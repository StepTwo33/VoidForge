import {
  getCloudBuilds,
  getSavedBuilds,
  type SavedBuild,
} from "@/lib/builds/build-storage";
import {
  getLoadouts,
  loadoutFromSavedBuild,
  loadoutToBuildData,
  mergeCloudLoadoutPreservingSlots,
} from "@/lib/builds/loadouts";
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

export function savedBuildToLoadout(build: SavedBuild): Loadout {
  return loadoutFromSavedBuild(build);
}
