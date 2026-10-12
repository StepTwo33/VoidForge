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

function normalizeAuraSlotIndices(auraSlots: number | readonly number[] = 0): number[] {
  return typeof auraSlots === "number" ? [auraSlots] : [...auraSlots];
}

/**
 * Aura drain adds capacity on warframes (does not consume it).
 * Pass every Aura slot index (Jade has two).
 */
export function computeWarframeAuraBonus(
  equippedMods: Pick<EquippedMod, "modId" | "rank" | "slotIndex">[],
  modsMap: Map<string, Pick<Mod, "drain" | "polarity">>,
  slotPolarities: Record<number, string | undefined>,
  auraSlots: number | readonly number[] = 0,
): number {
  let total = 0;
  for (const auraSlotIndex of normalizeAuraSlotIndices(auraSlots)) {
    const auraMod = equippedMods.find((m) => m.slotIndex === auraSlotIndex);
    if (!auraMod) continue;
    const mod = modsMap.get(auraMod.modId);
    if (!mod) continue;
    const drainAtRank = modCapacityAtRank(mod.drain, auraMod.rank);
    const effectiveDrain = modSlotCapacityCost(
      drainAtRank,
      slotPolarities[auraSlotIndex],
      mod.polarity,
    );
    total += Math.abs(effectiveDrain);
  }
  return total;
}

/** Capacity used by non-aura warframe slots. */
export function computeWarframeCapacityUsed(
  equippedMods: Pick<EquippedMod, "modId" | "rank" | "slotIndex">[],
  modsMap: Map<string, Pick<Mod, "drain" | "polarity">>,
  slotPolarities: Record<number, string | undefined>,
  auraSlots: number | readonly number[] = 0,
): number {
  const auraSet = new Set(normalizeAuraSlotIndices(auraSlots));
  return computeUsedCapacity(
    equippedMods.filter((m) => !auraSet.has(m.slotIndex)),
    modsMap,
    slotPolarities,
  );
}
