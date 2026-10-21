/**
 * Load-time guard for builds that hold two mods the game won't equip together (for example
 * Redirection + Primed Redirection, saved before the exclusion data covered them, or a pasted
 * code from another tool). The first mod by slot order stays; later conflicting ones are dropped.
 */
import { areModsIncompatible } from "@/data/mod-exclusions";

export interface DroppedIncompatibleMod {
  /** Mod that was removed. */
  modId: string;
  /** Mod already in the build that it conflicts with. */
  keptModId: string;
  slotIndex?: number;
}

type ModEntry = { modId: string; slotIndex?: number };

/**
 * Keep the first of each incompatible pair (lowest slot index, then list order); drop the rest.
 * Returns the original array when nothing conflicts.
 */
export function dropIncompatibleMods<T extends ModEntry>(
  mods: readonly T[],
): { mods: T[]; dropped: DroppedIncompatibleMod[] } {
  if (!Array.isArray(mods) || mods.length < 2) return { mods: mods as T[], dropped: [] };
  const order = mods
    .map((m, i) => ({ m, i }))
    .sort((a, b) => (a.m.slotIndex ?? a.i) - (b.m.slotIndex ?? b.i) || a.i - b.i);
  const kept: T[] = [];
  const droppedIdx = new Set<number>();
  const dropped: DroppedIncompatibleMod[] = [];
  for (const { m, i } of order) {
    const clash = kept.find((k) => areModsIncompatible(k.modId, m.modId));
    if (clash) {
      droppedIdx.add(i);
      dropped.push({ modId: m.modId, keptModId: clash.modId, ...(m.slotIndex != null ? { slotIndex: m.slotIndex } : {}) });
    } else {
      kept.push(m);
    }
  }
  if (!dropped.length) return { mods: mods as T[], dropped };
  return { mods: mods.filter((_, i) => !droppedIdx.has(i)), dropped };
}

function isModList(value: unknown): value is ModEntry[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => !!v && typeof v === "object" && typeof (v as ModEntry).modId === "string")
  );
}

/**
 * Walk a saved build / loadout payload and clean every mod list in it. Each list is its own
 * item (Warframe, exalted weapon, companion body, companion weapon, Railjack section, ...), so
 * conflicts are only checked inside one list. Returns a copy when anything changed.
 */
export function dropIncompatibleModsDeep<T>(data: T): { data: T; dropped: DroppedIncompatibleMod[] } {
  const dropped: DroppedIncompatibleMod[] = [];
  const walk = (value: unknown, depth: number): unknown => {
    if (depth > 8 || !value || typeof value !== "object") return value;
    if (isModList(value)) {
      const res = dropIncompatibleMods(value);
      dropped.push(...res.dropped);
      return res.mods;
    }
    if (Array.isArray(value)) {
      let changed = false;
      const next = value.map((v) => {
        const w = walk(v, depth + 1);
        if (w !== v) changed = true;
        return w;
      });
      return changed ? next : value;
    }
    let changed = false;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const w = walk(v, depth + 1);
      if (w !== v) changed = true;
      out[k] = w;
    }
    return changed ? out : value;
  };
  const next = walk(data, 0) as T;
  return { data: dropped.length ? next : data, dropped };
}
