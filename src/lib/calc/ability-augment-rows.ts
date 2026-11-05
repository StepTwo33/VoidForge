/** Affinity is shared within 50 m (wiki Affinity) — Intrepid Stand's ally range. */
export const AFFINITY_RANGE_M = 50;

/**
 * wiki Intrepid Stand: per javelin hit, 30/40/50/60 Overguard to Styanax and 15/20/25/30 to allies
 * in Affinity Range (R0–R3), capped at 15,000; all three scale with Ability Strength.
 */
export function intrepidStandValues(rank: number, strength: number) {
  return { cap: 15000 * strength, self: (30 + 10 * rank) * strength, ally: (15 + 5 * rank) * strength };
}

/** Cast speed shortens animations: time / (1 + bonus) (wiki Casting Speed). bonus is in percent. */
export function castTimeWithSpeed(castTime: number, castSpeedPct: number): number {
  return castTime / Math.max(0.01, 1 + castSpeedPct / 100);
}

