import { Loadout, ModularBuildData, ModSlot } from "../types";
import { inferModularLoadoutSlot } from "./modular-resolve";
import type { SavedBuild } from "./build-storage";

const STORAGE_KEY = "overframe_loadouts";

/** Slot payloads only — name/description/isPublic live on SavedBuild when cloud-synced. */
export type LoadoutBuildData = Omit<
  Loadout,
  "id" | "name" | "description" | "isPublic" | "cloudId" | "createdAt" | "updatedAt"
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
  return normalizeLoadoutBuildData(data);
}

export function loadoutFromSavedBuild(build: SavedBuild): Loadout {
  return {
    id: build.id,
    cloudId: build.id,
    name: build.name,
    description: build.description,
    isPublic: build.isPublic,
    createdAt: build.createdAt,
    updatedAt: build.updatedAt,
    ...(build.data as LoadoutBuildData),
  };
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
  return out;
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

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
