/**
 * Round 54 sidebar rows (wiki-sourced, display only — not part of DPS/EHP math).
 *
 * - Shield recharge (wiki Shield): (15 + 0.05 × Max Shields) × (1 + recharge bonus) per second.
 * - Recharge delay (wiki Shield): 1 s, or 4 s after shields are depleted; mods reduce it,
 *   capped at 80% reduction.
 * - Shield gate (wiki Shield Gate), full shields when broken:
 *     shields < 53       → shields / 180 + 1/3
 *     53 – 1150 shields  → (shields / 350)^0.65 + 1/3
 *     > 1150 shields     → 2.5 s
 *   never below 1/3 s; Catalyzing Shields fixes it at 1.33 s.
 * - Starting energy (wiki Energy Capacity): Starting Energy + 5 × Free Mod Capacity
 *   + Max Energy × (Preparation + Amber shard %), never above Max Energy. Harrow spawns full.
 * - Aura energy regen (wiki mod pages): Energy Siphon +0.6/s, Dreamer's Bond +0.3/s,
 *   Energy Nexus +3/s at max rank (all linear in rank).
 */

export const SHIELD_RECHARGE_DELAY_SEC = 1;
export const SHIELD_DEPLETED_DELAY_SEC = 4;
export const SHIELD_DELAY_REDUCTION_CAP = 0.8;
export const CATALYZING_SHIELD_GATE_SEC = 1.33;

export function shieldRechargePerSec(maxShields: number, rechargeBonus = 0): number {
  if (maxShields <= 0) return 0;
  return (15 + 0.05 * maxShields) * Math.max(0, 1 + rechargeBonus);
}

export function shieldRechargeDelays(delayReduction = 0): { normal: number; depleted: number } {
  const keep = 1 - Math.min(SHIELD_DELAY_REDUCTION_CAP, Math.max(0, delayReduction));
  return { normal: SHIELD_RECHARGE_DELAY_SEC * keep, depleted: SHIELD_DEPLETED_DELAY_SEC * keep };
}

export function shieldGateSec(maxShields: number, catalyzing = false): number {
  if (maxShields <= 0) return 0;
  if (catalyzing) return CATALYZING_SHIELD_GATE_SEC;
  let t: number;
  if (maxShields < 53) t = maxShields / 180 + 1 / 3;
  else if (maxShields <= 1150) t = Math.pow(maxShields / 350, 0.65) + 1 / 3;
  else t = 2.5;
  return Math.max(1 / 3, t);
}

export function startingEnergy(opts: {
  base: number;
  maxEnergy: number;
  freeModCapacity?: number;
  /** Preparation + Amber shard, percent of max energy. */
  bonusPct?: number;
  fullOnSpawn?: boolean;
}): number {
  if (opts.maxEnergy <= 0) return 0;
  if (opts.fullOnSpawn) return opts.maxEnergy;
  const raw =
    opts.base + 5 * Math.max(0, opts.freeModCapacity ?? 0) + (opts.maxEnergy * (opts.bonusPct ?? 0)) / 100;
  return Math.min(opts.maxEnergy, Math.max(0, raw));
}

/** Energy per second at max rank, scaled linearly by rank (stat value per rank × (rank + 1)). */
const AURA_ENERGY_REGEN_PER_RANK: Record<string, { perRank: number; maxRank: number }> = {
  aura_energy_siphon: { perRank: 0.1, maxRank: 5 },
  dreamers_bond: { perRank: 0.05, maxRank: 5 },
  energy_nexus: { perRank: 0.5, maxRank: 5 },
};

export function auraEnergyRegenPerSec(mods: { modId: string; rank?: number }[]): number {
  let total = 0;
  for (const m of mods) {
    const def = AURA_ENERGY_REGEN_PER_RANK[m.modId];
    if (!def) continue;
    const r = Math.min(def.maxRank, Math.max(0, m.rank ?? 0));
    total += def.perRank * (r + 1);
  }
  return Math.round(total * 100) / 100;
}
