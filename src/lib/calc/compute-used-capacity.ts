import type { Mod, EquippedMod } from "@/lib/types";
import { modCapacityAtRank, modSlotCapacityCost } from "@/lib/calc/mod-capacity";

/** Sum of capacity cost for equipped mods given slot polarities. */
export function computeUsedCapacity(
  equippedMods: Pick<EquippedMod, "modId" | "rank" | "slotIndex">[],
  modsMap: Map<string, Pick<Mod, "drain" | "polarity">>,
  slotPolarities: Record<number, string | undefined>,
): number {
  return equippedMods.reduce((sum, m) => {
    const mod = modsMap.get(m.modId);
    if (!mod) return sum;
    const baseDrain = modCapacityAtRank(mod.drain, m.rank);
    return sum + modSlotCapacityCost(baseDrain, slotPolarities[m.slotIndex], mod.polarity);
  }, 0);
}

/** Warframe base mod capacity before aura bonus. */
export function warframeBaseCapacity(hasOrokinReactor: boolean): number {
  return hasOrokinReactor ? 60 : 30;
}

/**
 * Aura drain adds capacity on warframes (does not consume it).
 * `auraSlotIndex` defaults to 0.
 */
export function computeWarframeAuraBonus(
  equippedMods: Pick<EquippedMod, "modId" | "rank" | "slotIndex">[],
  modsMap: Map<string, Pick<Mod, "drain" | "polarity">>,
  slotPolarities: Record<number, string | undefined>,
  auraSlotIndex = 0,
): number {
  const auraMod = equippedMods.find((m) => m.slotIndex === auraSlotIndex);
  if (!auraMod) return 0;
  const mod = modsMap.get(auraMod.modId);
  if (!mod) return 0;
  const drainAtRank = modCapacityAtRank(mod.drain, auraMod.rank);
  const effectiveDrain = modSlotCapacityCost(
    drainAtRank,
    slotPolarities[auraSlotIndex],
    mod.polarity,
  );
  return Math.abs(effectiveDrain);
}

/** Capacity used by non-aura warframe slots. */
export function computeWarframeCapacityUsed(
  equippedMods: Pick<EquippedMod, "modId" | "rank" | "slotIndex">[],
  modsMap: Map<string, Pick<Mod, "drain" | "polarity">>,
  slotPolarities: Record<number, string | undefined>,
  auraSlotIndex = 0,
): number {
  return computeUsedCapacity(
    equippedMods.filter((m) => m.slotIndex !== auraSlotIndex),
    modsMap,
    slotPolarities,
  );
}
