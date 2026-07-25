/**
 * Merge per-slot / per-evolution stat deltas for weapon builders.
 */

import type { IncarnonWeaponData } from "@/data/incarnon";

export type MergeIncarnonOptions = {
  /** When true, also merge formStatChanges / variantFormStatChanges. */
  formActive?: boolean;
  /** When true, also merge chargeStatChanges (Onos charged blast, etc.). */
  chargeMode?: boolean;
};

/** Sum selected Incarnon evolution stat changes (variant-aware). */
export function mergeIncarnonStatChanges(
  incarnonData: IncarnonWeaponData | undefined,
  selectedEvolutions: Record<number, number>,
  weaponId: string | undefined,
  options?: MergeIncarnonOptions,
): Record<string, number> | undefined {
  if (!incarnonData || Object.keys(selectedEvolutions).length === 0) return undefined;
  const merged: Record<string, number> = {};
  const formActive = options?.formActive === true;
  const chargeMode = options?.chargeMode === true;
  for (const [tierStr, slot] of Object.entries(selectedEvolutions)) {
    const tier = Number(tierStr);
    const evo = incarnonData.evolutions.find((e) => e.tier === tier && e.slot === slot);
    if (!evo) continue;
    const changes = evo.variantStatChanges?.[weaponId ?? ""] ?? evo.statChanges;
    for (const [stat, val] of Object.entries(changes)) {
      merged[stat] = (merged[stat] ?? 0) + val;
    }
    if (formActive) {
      const formChanges =
        evo.variantFormStatChanges?.[weaponId ?? ""] ?? evo.formStatChanges;
      if (formChanges) {
        for (const [stat, val] of Object.entries(formChanges)) {
          merged[stat] = (merged[stat] ?? 0) + val;
        }
      }
    }
    if (chargeMode && evo.chargeStatChanges) {
      for (const [stat, val] of Object.entries(evo.chargeStatChanges)) {
        merged[stat] = (merged[stat] ?? 0) + val;
      }
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

/**
 * Sum riven stats from slots that currently have a riven equipped.
 * Calculator applies these multiplicatively.
 */
export function mergeRivenStatChanges(
  rivenStatsMap: Record<number, Record<string, number>> | undefined,
  equippedMods: { slotIndex: number; modId: string }[],
): Record<string, number> | undefined {
  if (!rivenStatsMap) return undefined;
  const merged: Record<string, number> = {};
  for (const [slotStr, stats] of Object.entries(rivenStatsMap)) {
    const slotIdx = Number(slotStr);
    const equipped = equippedMods.find((m) => m.slotIndex === slotIdx);
    if (equipped && equipped.modId.startsWith("riven_")) {
      for (const [k, v] of Object.entries(stats)) {
        merged[k] = (merged[k] ?? 0) + v;
      }
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}
