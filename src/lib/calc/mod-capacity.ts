/**
 * Mod capacity at a given rank (R0 drain from data, +1 per rank for normal mods,
 * -1 per rank for aura/stance mods that provide capacity).
 */
export function modCapacityAtRank(baseDrain: number, rank: number): number {
  if (baseDrain < 0) return baseDrain - rank;
  return baseDrain + rank;
}

export type PolarityCapacityEffect = "match" | "mismatch" | "neutral";

/** Mods without a polarity symbol never get forma bonus or mismatch penalty. */
export function modHasPolarity(modPolarity: string): boolean {
  return modPolarity !== "universal";
}

export function getPolarityCapacityEffect(
  slotPolarity: string | undefined | null,
  modPolarity: string,
): PolarityCapacityEffect {
  // "none" = innate polarity cleared by the user (see lib/builds/innate-polarities).
  if (!slotPolarity || slotPolarity === "none" || !modHasPolarity(modPolarity)) return "neutral";
  // Umbral mods in an Omni slot: no bonus, no penalty.
  if (slotPolarity === "universal" && modPolarity === "umbra") return "neutral";
  if (slotPolarity === "universal" || modPolarity === slotPolarity) return "match";
  return "mismatch";
}

/**
 * Capacity cost for one mod on a polarized slot (Warframe, weapon, companion, etc.).
 *
 * Regular mods (positive drain): matching/Omni halves cost (round up); mismatch +25% (round).
 * Aura/stance mods (negative drain): matching/Omni doubles bonus; mismatch 80% bonus (round down).
 */
export function modSlotCapacityCost(
  baseDrain: number,
  slotPolarity: string | undefined | null,
  modPolarity: string,
): number {
  const effect = getPolarityCapacityEffect(slotPolarity, modPolarity);
  if (effect === "neutral") return baseDrain;

  if (baseDrain < 0) {
    if (effect === "match") return baseDrain * 2;
    return -Math.floor(Math.abs(baseDrain) * 0.8);
  }

  if (effect === "match") return Math.ceil(baseDrain / 2);
  return Math.round(baseDrain * 1.25);
}
