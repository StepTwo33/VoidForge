import type { CalculatedStats, Mod, ModSlot } from "@/lib/types";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";

/**
 * Wiki Melee Combo Counter: tiers every 20 hits.
 * Blood Rush / Weeping Wounds / Gladiator use the same combo multiplier as heavy attacks
 * (1× → 2× → … → 12×), not a separate 3.75× track.
 */
export const STANDARD_COMBO_STEP = 20;
export const STANDARD_HEAVY_COMBO_MAX = 12;
/** @deprecated BR/WW use heavy combo multi (12×). Kept for tests/legacy references. */
export const STANDARD_SCALING_COMBO_MAX = 12;

/** Dex Nikana: tiers every 11 hits; heavy max 11×. */
export const DEX_NIKANA_COMBO_STEP = 11;
export const DEX_NIKANA_HEAVY_COMBO_MAX = 11;

export interface MeleeComboTierRules {
  step: number;
  heavyMax: number;
  /** Max combo multiplier for BR / WW / heavy (same track). */
  scalingMax: number;
  /** Venka Prime: 13× at 240+ hits. */
  venkaHeavy240?: number;
  /** @deprecated Same as venkaHeavy240 — BR/WW share the heavy track. */
  venkaScaling240?: number;
}

export interface MeleeComboModContext {
  hasBloodRush: boolean;
  bloodRushValue: number;
  hasWeepingWounds: boolean;
  weepingWoundsValue: number;
  gladiatorCount: number;
}

/** Innate starting combo counter from weapon passives (rank-3 / max). */
export const WEAPON_INNATE_INITIAL_COMBO: Record<string, number> = {
  fragor_prime: 30,
  furax_wraith: 20,
  synoid_heliocor: 20,
};

export function getMeleeComboRules(weaponId?: string): MeleeComboTierRules {
  if (weaponId === "dex_nikana") {
    return {
      step: DEX_NIKANA_COMBO_STEP,
      heavyMax: DEX_NIKANA_HEAVY_COMBO_MAX,
      scalingMax: DEX_NIKANA_HEAVY_COMBO_MAX,
    };
  }
  if (weaponId === "venka_prime") {
    return {
      step: STANDARD_COMBO_STEP,
      heavyMax: STANDARD_HEAVY_COMBO_MAX,
      scalingMax: STANDARD_HEAVY_COMBO_MAX,
      venkaHeavy240: 13,
      venkaScaling240: 13,
    };
  }
  return {
    step: STANDARD_COMBO_STEP,
    heavyMax: STANDARD_HEAVY_COMBO_MAX,
    scalingMax: STANDARD_HEAVY_COMBO_MAX,
  };
}

function tierIndex(comboCount: number, step: number): number {
  if (comboCount < step) return -1;
  return Math.floor((comboCount - step) / step);
}

/**
 * Combo multiplier used by Blood Rush, Weeping Wounds, and Gladiator.
 * Same track as heavy attack mult: 1× below first tier, then 2×, 3×, … up to cap.
 */
export function getMeleeScalingMultiplier(comboCount: number, weaponId?: string): number {
  return getHeavyAttackComboMultiplier(comboCount, weaponId);
}

/** Heavy Attack Multiplier column — heavy slam damage tier (and BR/WW combo multi). */
export function getHeavyAttackComboMultiplier(comboCount: number, weaponId?: string): number {
  const rules = getMeleeComboRules(weaponId);
  if (rules.venkaHeavy240 != null && comboCount >= 240) return rules.venkaHeavy240;
  const tier = tierIndex(comboCount, rules.step);
  if (tier < 0) return 1;
  return Math.min(2 + tier, rules.heavyMax);
}

/** Corrupt Charge and similar: stat value is max-rank total, scaled by rank. */
export function sumInitialComboFromMods(
  equippedMods: ModSlot[],
  allMods: Map<string, Mod>,
): number {
  let total = 0;
  for (const modSlot of equippedMods) {
    const mod = allMods.get(modSlot.modId);
    if (!mod?.stats.comboCount) continue;
    const rank = Math.min(Math.max(modSlot.rank ?? 0, 0), mod.maxRank);
    total += (mod.stats.comboCount * (rank + 1)) / (mod.maxRank + 1);
  }
  return Math.round(total);
}

export function getInnateInitialCombo(weaponId?: string): number {
  if (!weaponId) return 0;
  return WEAPON_INNATE_INITIAL_COMBO[weaponId] ?? 0;
}

export function resolveEffectiveComboCount(
  simComboCount: number,
  weaponId: string | undefined,
  equippedMods: ModSlot[],
  allMods: Map<string, Mod>,
  extraCombo = 0,
): number {
  return (
    simComboCount +
    sumInitialComboFromMods(equippedMods, allMods) +
    getInnateInitialCombo(weaponId) +
    extraCombo
  );
}

/**
 * Apply combo tiers, Blood Rush / Weeping / Gladiator, and heavy attack damage.
 *
 * Wiki formulas (additive with other chance mods):
 *   Crit   = BaseCrit   × [1 + CritMods   + BR×(CM−1) + Glad×(CM−1)]
 *   Status = BaseStatus × [1 + StatusMods + WW×(CM−1)]
 *
 * With preCombo already = Base × (1 + Mods):
 *   final = preCombo + Base × comboBonus
 */
export function applyMeleeComboToStats(
  stats: CalculatedStats,
  comboCount: number,
  weaponId: string | undefined,
  ctx: MeleeComboModContext,
  baseCritChance = 0,
  baseStatusChance = 0,
): void {
  stats.comboCount = comboCount;
  const comboMulti = getHeavyAttackComboMultiplier(comboCount, weaponId);
  // BR/WW and heavy share the same combo multiplier track (1×…12×).
  stats.comboMultiplier = comboMulti;
  stats.heavyAttackComboMultiplier = comboMulti;

  const critBase = stats.preComboCriticalChance ?? stats.criticalChance;
  const statusBase = stats.preComboStatusChance ?? stats.statusChance;
  stats.criticalChance = critBase;
  stats.statusChance = statusBase;
  stats.bloodRushStacks = 0;

  const comboTier = Math.max(0, comboMulti - 1);

  let critComboBonus = 0;
  if (ctx.hasBloodRush) {
    stats.bloodRushStacks = ctx.bloodRushValue;
    critComboBonus += ctx.bloodRushValue * comboTier;
  }
  if (ctx.gladiatorCount > 0 && comboTier > 0) {
    let gladPerTier = 0.1 * ctx.gladiatorCount;
    if (ctx.gladiatorCount >= 6) gladPerTier += 0.15;
    critComboBonus += gladPerTier * comboTier;
  }
  // Additive with other crit chance mods: preCombo + base × BR/Glad bonus.
  if (critComboBonus > 0) {
    stats.criticalChance = critBase + baseCritChance * critComboBonus;
  }

  if (ctx.hasWeepingWounds) {
    stats.weepingWoundsBonus = ctx.weepingWoundsValue;
    const wwBonus = ctx.weepingWoundsValue * comboTier;
    stats.statusChance = statusBase + baseStatusChance * wwBonus;
  } else {
    stats.weepingWoundsBonus = 0;
  }

  stats.heavyAttackDamage =
    stats.totalDamage *
    stats.heavyAttackComboMultiplier *
    avgCritMultiplier(stats.criticalChance, stats.criticalMultiplier);
}
