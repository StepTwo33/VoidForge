import {
  getCloudBuilds,
  getSavedBuilds,
  saveBuild,
  saveCloudBuild,
  type SavedBuild,
} from "@/lib/builds/build-storage";
import {
  getLoadouts,
  loadoutFromSavedBuild,
  loadoutToBuildData,
  mergeCloudLoadoutPreservingSlots,
  saveLoadout,
} from "@/lib/builds/loadouts";
import { buildOpenUrl, localBuildOpenUrl } from "@/lib/builds/build-url";
import type { Loadout } from "@/lib/types";

/** Timestamp-prefixed ids are device-local; cuid / remapped cloud ids are account. */
export function isDeviceBuildId(id: string): boolean {
  return /^\d{10,}_/.test(id);
}

export type OwnershipBadge = "Device" | "Account";

export function ownershipBadge(id: string): OwnershipBadge {
  return isDeviceBuildId(id) ? "Device" : "Account";
}

/** Merge localStorage + signed-in cloud builds for one type (dedupe by id, prefer newer). */
export async function mergeYoursSavedBuilds(
  type: string,
  limit = 80,
): Promise<SavedBuild[]> {
  const local = getSavedBuilds(type);
  let cloud: SavedBuild[] = [];
  try {
    cloud = await getCloudBuilds(type);
  } catch {
    /* offline / signed out */
  }
  const byId = new Map<string, SavedBuild>();
  for (const b of [...local, ...cloud]) {
    const prev = byId.get(b.id);
    if (!prev || (b.updatedAt ?? 0) >= (prev.updatedAt ?? 0)) {
      byId.set(b.id, b);
    }
  }
  return Array.from(byId.values())
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    .slice(0, limit);
}

function loadoutAsSavedBuild(loadout: Loadout): SavedBuild {
  return {
    id: loadout.id,
    name: loadout.name,
    description: loadout.description,
    isPublic: loadout.isPublic,
    type: "loadout",
    createdAt: loadout.createdAt,
    updatedAt: loadout.updatedAt,
    data: loadoutToBuildData(loadout),
  };
}

/**
 * Yours loadouts: this-device kits plus account `type: loadout` rows.
 * Cloud rows merge onto matching local `cloudId` when present.
 */
export async function mergeYoursLoadouts(limit = 80): Promise<SavedBuild[]> {
  const local = getLoadouts();
  let cloud: SavedBuild[] = [];
  try {
    cloud = await getCloudBuilds("loadout");
  } catch {
    /* offline / signed out */
  }

  const byKey = new Map<string, SavedBuild>();

  for (const l of local) {
    byKey.set(l.cloudId || l.id, loadoutAsSavedBuild(l));
  }

  for (const c of cloud) {
    const key = c.id;
    const existingLocal = local.find((l) => l.cloudId === c.id || l.id === c.id);
    if (existingLocal) {
      const merged = mergeCloudLoadoutPreservingSlots(existingLocal, c);
      byKey.set(key, loadoutAsSavedBuild(merged));
    } else {
      byKey.set(key, {
        ...c,
        type: "loadout",
        data: c.data,
      });
    }
  }

  return Array.from(byKey.values())
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    .slice(0, limit);
}

export async function mergeYoursBuilds(type: string, limit = 80): Promise<SavedBuild[]> {
  if (type === "loadout") return mergeYoursLoadouts(limit);
  return mergeYoursSavedBuilds(type, limit);
}

/** All of Yours: single-item builds + loadouts, newest first. */
export async function mergeAllYoursLibrary(limit = 200): Promise<SavedBuild[]> {
  const [singles, loadouts] = await Promise.all([
    (async () => {
      const local = getSavedBuilds().filter((b) => b.type !== "loadout");
      let cloud: SavedBuild[] = [];
      try {
        cloud = (await getCloudBuilds()).filter((b) => b.type !== "loadout");
      } catch {
        /* offline / signed out */
      }
      const byId = new Map<string, SavedBuild>();
      for (const b of [...local, ...cloud]) {
        const prev = byId.get(b.id);
        if (!prev || (b.updatedAt ?? 0) >= (prev.updatedAt ?? 0)) {
          byId.set(b.id, b);
        }
      }
      return Array.from(byId.values());
    })(),
    mergeYoursLoadouts(limit),
  ]);

  return [...singles, ...loadouts]
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    .slice(0, limit);
}

export function savedBuildToLoadout(build: SavedBuild): Loadout {
  return loadoutFromSavedBuild(build);
}

/** Open URL for a library row: device → localBuild query; account → buildId. */
export function libraryOpenUrl(build: SavedBuild): string {
  if (build.type === "loadout") {
    if (isDeviceBuildId(build.id)) return "/loadouts";
    return `/loadouts?buildId=${encodeURIComponent(build.id)}`;
  }
  if (isDeviceBuildId(build.id)) {
    return localBuildOpenUrl(build.type, build.id);
  }
  return buildOpenUrl(build.type, build.id);
}

const BUILD_NAME_MAX = 200;

/** Cloud id for API ops, if this library row lives on the account. */
export function accountBuildId(build: SavedBuild): string | null {
  if (!isDeviceBuildId(build.id)) return build.id;
  if (build.type === "loadout") {
    const local = getLoadouts().find((l) => l.id === build.id || l.cloudId === build.id);
    return local?.cloudId ?? null;
  }
  return null;
}

/**
 * Toggle Community listing for an account-backed build.
 * Device-only rows must be saved to the account first.
 */
export async function setYoursBuildPublic(
  build: SavedBuild,
  isPublic: boolean,
): Promise<{ ok: true; build: SavedBuild } | { ok: false; error: string }> {
  const cloudId = accountBuildId(build);
  if (!cloudId) {
    return {
      ok: false,
      error: "Save this build to your account before listing it in Community.",
    };
  }

  const payload: SavedBuild = {
    ...build,
    id: cloudId,
    isPublic,
    updatedAt: Date.now(),
  };

  if (build.type === "loadout") {
    const local = getLoadouts().find((l) => l.id === build.id || l.cloudId === cloudId);
    if (local) {
      saveLoadout({ ...local, isPublic, updatedAt: Date.now() });
      payload.data = loadoutToBuildData({ ...local, isPublic });
    }
  } else if (getSavedBuilds().some((b) => b.id === build.id || b.id === cloudId)) {
    saveBuild({ ...payload, id: cloudId });
  }

  const cloud = await saveCloudBuild(payload);
  if (!cloud) {
    return { ok: false, error: "Could not update Community listing. Sign in and try again." };
  }
  return {
    ok: true,
    build: { ...build, id: cloud.id, isPublic: cloud.isPublic ?? isPublic, name: cloud.name },
  };
}

/**
 * Rename a library build. Updates device storage and, when the row is on the
 * account (or a loadout has cloudId), POSTs the new name to `/api/builds`.
 */
export async function renameYoursBuild(
  build: SavedBuild,
  rawName: string,
): Promise<{ ok: true; build: SavedBuild } | { ok: false; error: string }> {
  const name = rawName.trim();
  if (!name) return { ok: false, error: "Name is required" };
  if (name.length > BUILD_NAME_MAX) {
    return { ok: false, error: `Name must be at most ${BUILD_NAME_MAX} characters` };
  }

  const updated: SavedBuild = { ...build, name, updatedAt: Date.now() };

  if (build.type === "loadout") {
    const local = getLoadouts().find((l) => l.id === build.id || l.cloudId === build.id);
    if (local) {
      saveLoadout({ ...local, name, updatedAt: Date.now() });
    }
    const cloudId = local?.cloudId ?? (!isDeviceBuildId(build.id) ? build.id : null);
    if (cloudId) {
      const cloudPayload: SavedBuild = {
        ...updated,
        id: cloudId,
        data: local ? loadoutToBuildData({ ...local, name }) : build.data,
      };
      const cloud = await saveCloudBuild(cloudPayload);
      if (!cloud) {
        return {
          ok: false,
          error: local
            ? "Renamed on this device, but account sync failed. Sign in and try again."
            : "Could not rename on your account. Sign in and try again.",
        };
      }
      return { ok: true, build: { ...updated, id: cloud.id, name: cloud.name } };
    }
    if (!local && isDeviceBuildId(build.id)) {
      // Cloud-only merge miss: still try writing a local stub name via saveLoadout
      saveLoadout({ ...loadoutFromSavedBuild(updated), name });
    }
    return { ok: true, build: updated };
  }

  // Single-item builds
  const hasLocal = getSavedBuilds().some((b) => b.id === build.id);
  if (hasLocal || isDeviceBuildId(build.id)) {
    saveBuild(updated);
  }

  if (!isDeviceBuildId(build.id)) {
    const cloud = await saveCloudBuild(updated);
    if (!cloud) {
      return {
        ok: false,
        error: hasLocal
          ? "Renamed on this device, but account sync failed. Sign in and try again."
          : "Could not rename on your account. Sign in and try again.",
      };
    }
    // Keep a local mirror with the cloud id so Device/Account stay in sync
    saveBuild({ ...updated, id: cloud.id, name: cloud.name, isPublic: cloud.isPublic });
    return { ok: true, build: { ...updated, id: cloud.id, name: cloud.name } };
  }

  return { ok: true, build: updated };
}
