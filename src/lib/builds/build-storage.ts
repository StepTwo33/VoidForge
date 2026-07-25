// Build storage utilities - localStorage fallback + cloud API when logged in
import { ModSlot, EquippedArchonShard, Mod, ModularBuildData } from "../types";
import { resolveEffectiveModOrArcane } from "@/lib/weapons/effective-data";

/** Arcanes are not in mods.ts; resolve from override-aware catalogs. */
export function resolveArcaneById(id: string): Mod | null {
  return resolveEffectiveModOrArcane(id);
}

/** Restore equipped arcane row from saved `arcaneIds` (cloud / localStorage). */
export function resolveSavedArcaneSlots(arcaneIds: (string | null)[] | undefined, slotCount = 2): (Mod | null)[] {
  const ids = arcaneIds ?? [];
  const out: (Mod | null)[] = [];
  for (let i = 0; i < slotCount; i++) {
    const id = ids[i];
    out.push(id ? resolveArcaneById(id) : null);
  }
  return out;
}

export interface SavedBuild {
  id: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  type: "weapon" | "warframe" | "companion" | "modular" | "archwing" | "railjack" | "loadout";
  /** Community meta tags (steel_path, budget, …). */
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const STORAGE_KEY = "framehub_builds";

// ── localStorage (offline / not logged in) ──────────────────────────

export function getSavedBuilds(type?: string): SavedBuild[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const builds = JSON.parse(raw) as SavedBuild[];
    if (type) return builds.filter((b) => b.type === type);
    return builds;
  } catch {
    return [];
  }
}

export function saveBuild(build: SavedBuild): void {
  const builds = getSavedBuilds();
  const index = builds.findIndex((b) => b.id === build.id);
  if (index >= 0) {
    builds[index] = { ...build, updatedAt: Date.now() };
  } else {
    builds.push({ ...build, createdAt: Date.now(), updatedAt: Date.now() });
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
  } catch (err) {
    console.warn("Failed to save builds to localStorage", err);
  }
}

export function deleteBuild(id: string): void {
  const builds = getSavedBuilds().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

export function generateBuildId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ── Cloud API (logged in) ───────────────────────────────────────────

export async function getCloudBuilds(type?: string): Promise<SavedBuild[]> {
  try {
    const url = type ? `/api/builds?type=${type}` : "/api/builds";
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveCloudBuild(build: SavedBuild): Promise<SavedBuild | null> {
  try {
    const res = await fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(build),
    });
    if (!res.ok) {
      console.warn("saveCloudBuild failed", res.status, await res.text().catch(() => ""));
      return null;
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.warn("saveCloudBuild: expected JSON response");
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn("saveCloudBuild error", err);
    return null;
  }
}

export async function deleteCloudBuild(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/builds/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Local-first save used by all builders: write localStorage, then sync to the
 * cloud when logged in. Remaps the local id if the API assigns a new one.
 */
export async function persistSavedBuild(build: SavedBuild): Promise<{
  id: string;
  isPublic: boolean;
  synced: boolean;
  builds: SavedBuild[];
}> {
  saveBuild(build);
  let id = build.id;
  let isPublic = !!build.isPublic;
  let synced = false;

  const cloudResult = await saveCloudBuild(build);
  if (cloudResult) {
    synced = true;
    isPublic = cloudResult.isPublic ?? isPublic;
    if (cloudResult.id !== build.id) {
      deleteBuild(build.id);
      saveBuild({ ...build, id: cloudResult.id, isPublic });
    }
    id = cloudResult.id;
  }

  return { id, isPublic, synced, builds: getSavedBuilds(build.type) };
}

// Weapon build data
export interface WeaponBuildData {
  weaponId: string;
  mods: ModSlot[];
  stanceModId?: string;
  arcaneIds: (string | null)[];
  hasOrokinCatalyst: boolean;
  isMR30: boolean;
  slotPolarities: Record<number, string>;
  /** Kuva/Tenet/Coda progenitor bonus (optional). */
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  /** Incarnon evolution picks: tier → slot index. */
  incarnonEvolutions?: Record<number, number>;
}

// Warframe build data
export interface WarframeBuildData {
  warframeId: string;
  mods: ModSlot[];
  shards: (EquippedArchonShard | null)[];
  arcaneIds: (string | null)[];
  arcaneRanks?: number[];
  hasOrokinReactor: boolean;
  isMR30: boolean;
  slotPolarities: Record<number, string>;
  helminthSlot?: number | null;
  helminthAbilityId?: string | null;
  exaltedMods?: ModSlot[];
  exaltedSlotPolarities?: Record<number, string>;
  exaltedArcaneIds?: (string | null)[];
  /** Titania Diwata (melee) when Dex Pixia is the primary exalted. */
  exaltedMeleeMods?: ModSlot[];
  exaltedMeleeSlotPolarities?: Record<number, string>;
  exaltedMeleeArcaneIds?: (string | null)[];
  /** Non-default form configs for dual-form warframes (e.g. Orion on Sirius & Orion). */
  dualFormBuilds?: Record<string, {
    mods: ModSlot[];
    slotPolarities?: Record<number, string>;
    arcaneIds?: (string | null)[];
    arcaneRanks?: number[];
  }>;
}

// Companion build data
export interface CompanionBuildData {
  companionId: string;
  mods: ModSlot[];
  weaponId?: string;
  weaponMods: ModSlot[];
  weaponSlotPolarities?: Record<number, string>;
  arcaneIds: (string | null)[];
  hasReactor: boolean;
  hasCatalyst?: boolean;
  isMR30: boolean;
  slotPolarities: Record<number, string>;
}

export type { ModularBuildData };

// Railjack build data
export interface RailjackBuildData {
  reactorId?: string;
  shieldId?: string;
  engineId?: string;
  platingId?: string;
  /** Nose / Dorsal / Ventral turret hardpoints. */
  turretIds?: (string | undefined)[];
  /** @deprecated Use turretIds[0] — kept for older saves. */
  turretId?: string;
  ordnanceId?: string;
  integratedMods: ModSlot[];
  battleMods: ModSlot[];
  tacticalMods: ModSlot[];
  integratedPolarities: Record<number, string>;
  battlePolarities: Record<number, string>;
  tacticalPolarities: Record<number, string>;
  /** Elite crew member (Update 43 protoframes). */
  eliteCrewId?: string;
  /** Selected Mk III house unique trait rolls. */
  reactorTraitId?: string;
  shieldTraitId?: string;
  engineTraitId?: string;
  /** Player Intrinsics ranks 0–10 (Dirac/grid removed U29.10 → Endo). */
  intrinsics?: {
    tactical?: number;
    piloting?: number;
    gunnery?: number;
    engineering?: number;
    command?: number;
  };
  /** Simulation toggles for conditional integrated mods and active abilities. */
  simulation?: {
    crimsonFugueStacks?: number;
    cruisingSpeedActive?: boolean;
    protectiveShotsActive?: boolean;
    shieldsDepleted?: boolean;
    activeBattleAbilityId?: string | null;
    activeTacticalAbilityId?: string | null;
  };
}

// Archwing/Necramech build data
export interface ArchwingBuildData {
  mode: string; // 'archwing' | 'necramech'
  frameId?: string; // archwing or necramech id
  frameMods: ModSlot[];
  weaponId?: string;
  weaponMods: ModSlot[];
  hasReactor: boolean;
  hasCatalyst: boolean;
  isMR30: boolean;
  framePolarities: Record<number, string>;
  weaponPolarities: Record<number, string>;
}
