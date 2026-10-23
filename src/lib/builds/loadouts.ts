import { Loadout, ModularBuildData, ModSlot } from "../types";
import { inferModularLoadoutSlot } from "./modular-resolve";
import { companionsMap } from "@/data/companions";
import { migratePostureToPostureSlot } from "@/lib/weapons/companion-weapons";
import type { SavedBuild } from "./build-storage";
import { modsMap } from "@/data/mods";
import { clampModRanksDeep, dropRetiredModsDeep, migrateRenamedModsDeep } from "@/lib/mods/known-mods";

const STORAGE_KEY = "overframe_loadouts";

/** Slot payloads only — name/description/isPublic live on SavedBuild when cloud-synced. */
export type LoadoutBuildData = Omit<
  Loadout,
  "id" | "name" | "description" | "isPublic" | "cloudId" | "importWarnings" | "importSource" | "createdAt" | "updatedAt"
>;

/** Ensure cloud-safe defaults on slot payloads before POST /api/builds. */
export function normalizeLoadoutBuildData(data: LoadoutBuildData): LoadoutBuildData {
  let out: LoadoutBuildData;
  try {
    out = JSON.parse(JSON.stringify(data)) as LoadoutBuildData;
  } catch {
    out = { ...data };
  }

  if (out.warframeBuild) {
    const wb = out.warframeBuild;
    out.warframeBuild = {
      ...wb,
      slotPolarities: wb.slotPolarities ?? {},
      shards: wb.shards ?? [null, null, null, null, null],
      hasOrokinReactor: wb.hasOrokinReactor ?? false,
      isMR30: wb.isMR30 ?? false,
      mods: wb.mods ?? [],
      arcaneIds: wb.arcaneIds ?? [null, null],
    };
  }

  const normalizeWeapon = (build: LoadoutBuildData["primaryBuild"]) => {
    if (!build) return build;
    return {
      ...build,
      hasOrokinCatalyst: build.hasOrokinCatalyst ?? false,
      isMR30: build.isMR30 ?? false,
      slotPolarities: build.slotPolarities ?? {},
      arcaneIds: build.arcaneIds ?? [null, null],
      mods: build.mods ?? [],
    };
  };

  out.primaryBuild = normalizeWeapon(out.primaryBuild);
  out.secondaryBuild = normalizeWeapon(out.secondaryBuild);
  out.meleeBuild = normalizeWeapon(out.meleeBuild);

  if (out.companionBuild) {
    const cb = out.companionBuild;
    out.companionBuild = {
      ...cb,
      hasReactor: cb.hasReactor ?? false,
      hasCatalyst: cb.hasCatalyst ?? false,
      mods: cb.mods ?? [],
      weaponMods: cb.weaponMods ?? [],
      slotPolarities: cb.slotPolarities ?? {},
      weaponSlotPolarities: cb.weaponSlotPolarities ?? {},
    };
  }

  if (out.modularBuilds) {
    const slots = ["primary", "secondary", "melee"] as const;
    const next: NonNullable<LoadoutBuildData["modularBuilds"]> = {};
    for (const slot of slots) {
      const mb = out.modularBuilds[slot];
      if (!mb) continue;
      next[slot] = {
        ...mb,
        hasOrokinCatalyst: mb.hasOrokinCatalyst ?? false,
        slotPolarities: mb.slotPolarities ?? {},
        arcaneIds: mb.arcaneIds ?? [null, null],
        mods: mb.mods ?? [],
      };
    }
    out.modularBuilds = next;
  }

  if (out.modularBuild) {
    const mb = out.modularBuild;
    out.modularBuild = {
      ...mb,
      hasOrokinCatalyst: mb.hasOrokinCatalyst ?? false,
      slotPolarities: mb.slotPolarities ?? {},
      arcaneIds: mb.arcaneIds ?? [null, null],
      mods: mb.mods ?? [],
    };
  }

  return out;
}

export function loadoutToBuildData(loadout: Loadout): LoadoutBuildData {
  const {
    id: _id,
    name: _name,
    description: _description,
    isPublic: _isPublic,
    cloudId: _cloudId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...data
  } = loadout;
  // Import warnings are a local-only hint; never send them to the account.
  delete (data as { importWarnings?: string[] }).importWarnings;
  delete (data as { importSource?: unknown }).importSource;
  return normalizeLoadoutBuildData(data);
}

/** Migrate renamed mods, drop removed / Conclave-only mods, clamp ranks to max, in every mod list. */
function cleanLoadoutMods<T>(data: T): T {
  return clampModRanksDeep(dropRetiredModsDeep(migrateRenamedModsDeep(data, modsMap).data, modsMap).data, modsMap).data;
}

export function loadoutFromSavedBuild(build: SavedBuild): Loadout {
  return cleanLoadoutMods(migrateCompanionPosture({
    id: build.id,
    cloudId: build.id,
    name: build.name,
    description: build.description,
    isPublic: build.isPublic,
    createdAt: build.createdAt,
    updatedAt: build.updatedAt,
    ...(build.data as LoadoutBuildData),
  }));
}

export function mergeCloudLoadout(local: Loadout, cloud: SavedBuild): Loadout {
  return mergeCloudLoadoutPreservingSlots(local, cloud);
}

/** Merge cloud slot data onto a local loadout without wiping filled slots with empty cloud payloads. */
export function mergeCloudLoadoutPreservingSlots(local: Loadout, cloud: SavedBuild): Loadout {
  const cloudData = (cloud.data ?? {}) as LoadoutBuildData;
  const localData = loadoutToBuildData(local);

  const hasMods = (mods?: { length: number }) => (mods?.length ?? 0) > 0;

  const mergeWeapon = (
    localSlot: LoadoutBuildData["primaryBuild"],
    cloudSlot: LoadoutBuildData["primaryBuild"],
  ) => {
    if (!cloudSlot) return localSlot;
    if (!localSlot) return cloudSlot;
    return hasMods(cloudSlot.mods) || cloudSlot.weaponId ? cloudSlot : localSlot;
  };

  const mergeModularMaps = (
    localMap: LoadoutBuildData["modularBuilds"],
    cloudMap: LoadoutBuildData["modularBuilds"],
    legacyLocal: LoadoutBuildData["modularBuild"],
    legacyCloud: LoadoutBuildData["modularBuild"],
  ): LoadoutBuildData["modularBuilds"] => {
    const out: NonNullable<LoadoutBuildData["modularBuilds"]> = {
      ...(localMap ?? {}),
    };
    if (legacyLocal?.slot && !out[legacyLocal.slot]) {
      const { slot, ...rest } = legacyLocal;
      out[slot] = rest;
    }
    if (cloudMap) {
      for (const slot of ["primary", "secondary", "melee"] as const) {
        const c = cloudMap[slot];
        if (c && (hasMods(c.mods) || c.parts)) out[slot] = c;
      }
    }
    if (legacyCloud?.slot) {
      const { slot, ...rest } = legacyCloud;
      if (!out[slot] || hasMods(rest.mods) || rest.parts) out[slot] = rest;
    }
    return Object.keys(out).length ? out : undefined;
  };

  const modularBuilds = mergeModularMaps(
    localData.modularBuilds,
    cloudData.modularBuilds,
    localData.modularBuild,
    cloudData.modularBuild,
  );

  return {
    ...local,
    name: cloud.name || local.name,
    description: cloud.description ?? local.description,
    isPublic: cloud.isPublic ?? local.isPublic,
    cloudId: cloud.id,
    warframeBuild:
      cloudData.warframeBuild && hasMods(cloudData.warframeBuild.mods)
        ? cloudData.warframeBuild
        : localData.warframeBuild ?? cloudData.warframeBuild,
    primaryBuild: mergeWeapon(localData.primaryBuild, cloudData.primaryBuild),
    secondaryBuild: mergeWeapon(localData.secondaryBuild, cloudData.secondaryBuild),
    meleeBuild: mergeWeapon(localData.meleeBuild, cloudData.meleeBuild),
    companionBuild:
      cloudData.companionBuild &&
      (hasMods(cloudData.companionBuild.mods) || hasMods(cloudData.companionBuild.weaponMods))
        ? cloudData.companionBuild
        : localData.companionBuild ?? cloudData.companionBuild,
    modularBuilds,
    archwingBuild: cloudData.archwingBuild ?? localData.archwingBuild,
  };
}

function normalizeLoadout(raw: Loadout): Loadout {
  let out: Loadout = { ...raw };
  const modularBuilds: NonNullable<Loadout["modularBuilds"]> = {
    ...(out.modularBuilds ?? {}),
  };

  const m = out.modularBuild as Record<string, unknown> | undefined;
  if (m && (m.modularType || m.type) && m.parts) {
    const partial: ModularBuildData = {
      modularType: (m.modularType ?? m.type) as string,
      parts: m.parts as Record<string, string>,
      mods: (m.mods as ModSlot[]) || [],
      hasOrokinCatalyst: Boolean(m.hasOrokinCatalyst),
      isMR30: m.isMR30 as boolean | undefined,
      slotPolarities: m.slotPolarities as Record<number, string> | undefined,
      arcaneIds: m.arcaneIds as (string | null)[] | undefined,
      customName: (m.customName ?? m.name) as string | undefined,
    };
    const slot =
      (m.slot as "primary" | "secondary" | "melee" | undefined) ??
      inferModularLoadoutSlot(partial);
    if (!modularBuilds[slot]) modularBuilds[slot] = partial;
  }

  delete out.modularBuild;
  if (Object.keys(modularBuilds).length > 0) out.modularBuilds = modularBuilds;
  else delete out.modularBuilds;
  // Renamed mods (Link Shields → Link Redirection, …) migrate; removed / Conclave-only mods drop.
  return cleanLoadoutMods(migrateCompanionPosture(out));
}

/** Older imports: beast posture mod sat in a regular claw slot (see migratePostureToPostureSlot). */
export function migrateCompanionPosture<T extends Pick<Loadout, "companionBuild">>(loadout: T): T {
  const cb = loadout.companionBuild;
  if (!cb?.weaponMods?.length) return loadout;
  const weaponMods = migratePostureToPostureSlot(cb.weaponMods, companionsMap.get(cb.companionId));
  if (weaponMods === cb.weaponMods) return loadout;
  return { ...loadout, companionBuild: { ...cb, weaponMods } };
}

export function getLoadouts(): Loadout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Loadout[];
    return parsed.map(normalizeLoadout);
  } catch {
    return [];
  }
}

export function saveLoadout(loadout: Loadout): void {
  const loadouts = getLoadouts();
  const index = loadouts.findIndex((l) => l.id === loadout.id);
  if (index >= 0) {
    loadouts[index] = { ...loadout, updatedAt: Date.now() };
  } else {
    loadouts.push({ ...loadout, createdAt: Date.now(), updatedAt: Date.now() });
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts));
  } catch (err) {
    console.warn("Failed to save loadouts to localStorage", err);
  }
}

export function deleteLoadout(id: string): void {
  const loadouts = getLoadouts().filter((l) => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts));
}

/** Move a loadout one place up (-1) or down (+1) in the stored order. Returns the new list. */
export function moveLoadout(id: string, delta: -1 | 1): Loadout[] {
  const loadouts = getLoadouts();
  const from = loadouts.findIndex((l) => l.id === id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= loadouts.length) return loadouts;
  const [item] = loadouts.splice(from, 1);
  loadouts.splice(to, 0, item);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts));
  } catch (err) {
    console.warn("Failed to save loadouts to localStorage", err);
  }
  return loadouts;
}

/** Local loadouts previously imported from this Player Sync account (case-insensitive name). */
export function findImportedLoadouts(platform: string, account: string): Loadout[] {
  const acc = account.trim().toLowerCase();
  return getLoadouts().filter(
    (l) => l.importSource?.platform === platform && l.importSource.account.trim().toLowerCase() === acc,
  );
}

/**
 * Re-import onto an existing loadout: slot data and import warnings come from the new import;
 * id, name, description, sharing and account link stay.
 */
export function applyImportToLoadout(
  existing: Loadout,
  imported: Omit<Loadout, "id" | "createdAt" | "updatedAt">,
): Loadout {
  const {
    name: _name,
    description: _description,
    isPublic: _isPublic,
    cloudId: _cloudId,
    ...slots
  } = imported;
  return {
    id: existing.id,
    name: existing.name,
    description: existing.description,
    isPublic: existing.isPublic,
    cloudId: existing.cloudId,
    createdAt: existing.createdAt,
    updatedAt: Date.now(),
    ...slots,
  };
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
