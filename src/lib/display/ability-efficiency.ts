/**
 * wiki Ability Efficiency: "the Arsenal does not display an Ability Efficiency below 25%
 * or above 175%, though that does not mean the Ability Efficiency stat per se can't go
 * beyond these parameters" (only channeled drain with Duration under 100% uses the rest).
 * Display only: calculations keep the raw value.
 */
export const ARSENAL_EFFICIENCY_DISPLAY_MIN = 0.25;
export const ARSENAL_EFFICIENCY_DISPLAY_MAX = 1.75;

/** Ability Efficiency as the in-game Arsenal shows it (25%–175%). */
export function displayAbilityEfficiency(efficiency: number): number {
  return Math.min(ARSENAL_EFFICIENCY_DISPLAY_MAX, Math.max(ARSENAL_EFFICIENCY_DISPLAY_MIN, efficiency));
}

/** "175%"-style label for an Ability Efficiency multiplier (1 = 100%). */
export function formatAbilityEfficiencyPct(efficiency: number): string {
  return `${(displayAbilityEfficiency(efficiency) * 100).toFixed(0)}%`;
}

/** Tooltip when the raw stat is outside the Arsenal display range; undefined otherwise. */
export function abilityEfficiencyCapNote(efficiency: number): string | undefined {
  const raw = `${(efficiency * 100).toFixed(0)}%`;
  if (efficiency > ARSENAL_EFFICIENCY_DISPLAY_MAX) {
    return `Raw Ability Efficiency ${raw}. The Arsenal shows at most 175%: costs cannot drop below 25%, so the extra only shortens channeled drain when Duration is under 100%.`;
  }
  if (efficiency < ARSENAL_EFFICIENCY_DISPLAY_MIN) {
    return `Raw Ability Efficiency ${raw}. The Arsenal shows at least 25%: costs cannot rise above 175%.`;
  }
  return undefined;
}
