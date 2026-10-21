// Mod exclusion: mods the game won't equip together on one item (Primed / Umbral / Archon /
// Amalgam / Galvanized / Sacrificial variants, corrupted pairs like Point Strike + Critical Delay,
// the Archon set Hatred and Anguish trios, Link Vitality + Enhanced Vitality, ...).
// Source: wiki.warframe.com Module:Mods/data `Incompatible` lists, generated into
// mod-incompatibilities.ts by scripts/gen_mod_incompatibilities.py.
import { WIKI_INCOMPATIBLE_MOD_PAIRS } from "./mod-incompatibilities";

/**
 * Catalog mods the wiki data module doesn't list (so it has no `Incompatible` entry for them),
 * kept from the earlier hand list: a Primed card can't sit next to its base card.
 */
export const MOD_EXCLUSION_SUPPLEMENT: readonly (readonly [string, string])[] = [
  ["blunderbuss_r3", "primed_blunderbuss"],
  ["charged_chamber", "primed_charged_chamber"],
];

/** Every incompatible pair (wiki data + supplement), sorted ids. */
export const MOD_INCOMPATIBLE_PAIRS: readonly (readonly [string, string])[] = [
  ...WIKI_INCOMPATIBLE_MOD_PAIRS,
  ...MOD_EXCLUSION_SUPPLEMENT,
];

// mod ID → set of mod IDs it can't be equipped with
const exclusionMap = new Map<string, Set<string>>();

for (const [a, b] of MOD_INCOMPATIBLE_PAIRS) {
  if (a === b) continue;
  if (!exclusionMap.has(a)) exclusionMap.set(a, new Set());
  if (!exclusionMap.has(b)) exclusionMap.set(b, new Set());
  exclusionMap.get(a)!.add(b);
  exclusionMap.get(b)!.add(a);
}

/** Returns the set of mod IDs that conflict with the given mod ID, or empty set if none. */
export function getExcludedMods(modId: string): Set<string> {
  return exclusionMap.get(modId) || new Set();
}

/** True when the game refuses to equip `a` and `b` on the same item. */
export function areModsIncompatible(a: string, b: string): boolean {
  return a !== b && (exclusionMap.get(a)?.has(b) ?? false);
}

/** Given a list of equipped mod IDs, returns the full set of mod IDs that are blocked. */
export function getBlockedModIds(equippedModIds: string[]): Set<string> {
  const blocked = new Set<string>();
  for (const id of equippedModIds) {
    const conflicts = exclusionMap.get(id);
    if (conflicts) {
      for (const c of conflicts) {
        blocked.add(c);
      }
    }
  }
  return blocked;
}

/** First equipped mod that blocks `modId`, or undefined. */
export function findBlockingModId(modId: string, equippedModIds: readonly string[]): string | undefined {
  const conflicts = exclusionMap.get(modId);
  if (!conflicts) return undefined;
  return equippedModIds.find((id) => conflicts.has(id));
}
