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


/**
 * Augments that change what an ability *costs* (not just its numbers). Applied to the ability card
 * data before display so the card reads the way the in-game tooltip does.
 *
 * - Despoil (Nekros, Desecrate): no longer consumes Energy, consumes 10 Health per corpse instead.
 */
export function applyCostAugments<
  T extends { name: string; description?: string; miscStats?: Record<string, unknown> },
>(ability: T, equippedModIds: readonly string[]): T {
  if (ability.name === "Desecrate" && equippedModIds.includes("augment_nekros_despoil")) {
    const misc = { ...(ability.miscStats ?? {}) };
    const cost = typeof misc.energyPerCorpse === "number" ? misc.energyPerCorpse : 10;
    delete misc.energyPerCorpse;
    misc.healthPerCorpse = cost;
    return {
      ...ability,
      miscStats: misc,
      description: ability.description?.replace(/(\d+)\s+energy per corpse/i, "$1 health per corpse (Despoil)"),
    };
  }
  return ability;
}

/** Hildryn's frames: abilities cost Shields instead of Energy. */
export function isHildrynFrame(warframeId: string | undefined | null): boolean {
  return warframeId === "hildryn" || warframeId === "hildryn_prime";
}

/** wiki Hildryn: Helminth abilities subsumed onto her cost Shields at 10× their Energy cost. */
export const HILDRYN_SUBSUME_SHIELD_MULTIPLIER = 10;
