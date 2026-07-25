import { Weapon, Mod, Companion, Warframe, ArchonShard } from "@/lib/types";
import { Archwing, Necramech } from "@/data/archwing";
import { deepMergeOverrideFields } from "@/lib/overrides/override-merge";

export const OVERRIDE_CATEGORIES = [
  "weapon", "mod", "warframe", "companion", "arcane", "arcane_effect", "archon_shard", "archwing", "necramech",
] as const;
export type OverrideCategory = (typeof OVERRIDE_CATEGORIES)[number];

export interface DataOverride {
  id: string;
  targetType: OverrideCategory;
  targetId: string;
  action: "modify" | "add" | "remove";
  fields: Record<string, unknown>;
  note: string;
  timestamp: number;
  /** Last staff member who saved this override (shared list). */
  updatedBy?: string;
}

/** In-memory cache synced from GET /api/data-overrides (shared for all users). */
let overrideCache: DataOverride[] = [];

export function setOverrideCache(overrides: DataOverride[]): void {
  overrideCache = overrides;
}

export function getOverrides(): DataOverride[] {
  return overrideCache;
}

export async function saveOverride(override: DataOverride): Promise<DataOverride> {
  const { persistOverride } = await import("@/lib/overrides/data-overrides-client");
  return persistOverride(override);
}

export async function deleteOverride(id: string): Promise<void> {
  const { removeOverride } = await import("@/lib/overrides/data-overrides-client");
  return removeOverride(id);
}

export async function deleteOverrides(ids: string[]): Promise<number> {
  const { removeOverrides } = await import("@/lib/overrides/data-overrides-client");
  return removeOverrides(ids);
}

export function notifyDataOverridesUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("framehub-data-overrides-updated"));
  }
}

export function generateOverrideId(): string {
  return `ovr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function exportOverrides(): Promise<string> {
  const { exportSharedOverrides } = await import("@/lib/overrides/data-overrides-client");
  return exportSharedOverrides();
}

export async function importOverrides(json: string): Promise<number> {
  const { importSharedOverrides } = await import("@/lib/overrides/data-overrides-client");
  return importSharedOverrides(json);
}

export function getOverrideForTarget(
  targetType: OverrideCategory,
  targetId: string,
): DataOverride | undefined {
  return getOverrides().find((o) => o.targetType === targetType && o.targetId === targetId);
}

/** Merge server + local lists; server wins on duplicate targets. */
export function mergeOverrideLists(base: DataOverride[], extra: DataOverride[]): DataOverride[] {
  const map = new Map<string, DataOverride>();
  for (const o of extra) {
    map.set(`${o.targetType}:${o.targetId}`, o);
  }
  for (const o of base) {
    map.set(`${o.targetType}:${o.targetId}`, o);
  }
  return Array.from(map.values());
}

function applyModify<T extends object>(item: T, fields: Record<string, unknown>): T {
  return deepMergeOverrideFields(item, fields);
}

function applyOverridesToList<T extends { id: string }>(
  items: T[],
  overrides: DataOverride[],
): T[] {
  if (overrides.length === 0) return items;

  let result = [...items];

  for (const ovr of overrides) {
    if (ovr.action === "remove") {
      result = result.filter((item) => item.id !== ovr.targetId);
    } else if (ovr.action === "modify") {
      const idx = result.findIndex((item) => item.id === ovr.targetId);
      if (idx >= 0) {
        result[idx] = applyModify(result[idx], ovr.fields);
      }
    } else if (ovr.action === "add") {
      if (!result.find((item) => item.id === ovr.targetId)) {
        result.push({ id: ovr.targetId, ...ovr.fields } as T);
      }
    }
  }

  return result;
}

export function applyWeaponOverrides(weapons: Weapon[], overrides = getOverrides()): Weapon[] {
  return applyOverridesToList(weapons, overrides.filter((o) => o.targetType === "weapon"));
}

export function applyModOverrides(mods: Mod[], overrides = getOverrides()): Mod[] {
  return applyOverridesToList(mods, overrides.filter((o) => o.targetType === "mod"));
}

export function applyCompanionOverrides(companions: Companion[], overrides = getOverrides()): Companion[] {
  return applyOverridesToList(companions, overrides.filter((o) => o.targetType === "companion"));
}

export function applyWarframeOverrides(warframes: Warframe[], overrides = getOverrides()): Warframe[] {
  return applyOverridesToList(warframes, overrides.filter((o) => o.targetType === "warframe"));
}

export function applyArcaneOverrides(arcanes: Mod[], overrides = getOverrides()): Mod[] {
  return applyOverridesToList(arcanes, overrides.filter((o) => o.targetType === "arcane"));
}

export function applyArchonShardOverrides(shards: ArchonShard[], overrides = getOverrides()): ArchonShard[] {
  return applyOverridesToList(shards, overrides.filter((o) => o.targetType === "archon_shard"));
}

export function applyArchwingOverrides(archwings: Archwing[], overrides = getOverrides()): Archwing[] {
  return applyOverridesToList(archwings, overrides.filter((o) => o.targetType === "archwing"));
}

export function applyNecramechOverrides(mechs: Necramech[], overrides = getOverrides()): Necramech[] {
  return applyOverridesToList(mechs, overrides.filter((o) => o.targetType === "necramech"));
}
