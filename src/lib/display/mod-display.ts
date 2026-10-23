import type { Mod } from "@/lib/types";
import { getModStatLabel } from "@/lib/overrides/override-stat-catalog";

/** Strip wiki/HTML markup from mod descriptions for UI. */
export function cleanModDescription(description: string): string {
  return description
    .replace(/\\n/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const FLAT_STAT_KEYS = new Set([
  "range",
  "duration",
  "cooldown",
  "mutationStackBonus",
  "damageResistanceCap",
  "attractionRange",
  "allyRadius",
  "ricochetBounces",
  "syndicatePower",
  "blockAngle",
  "abilityProjectileCount",
  "impactStatusStacks",
  "reviveShieldHealth",
  "incapacitationTimerReduction",
  "ampCritDamage",
  "ampStatusDamage",
  "ampSchoolDamage",
  "ampEnergyRegen",
  "killsRequired",
]);

const PERCENT_LIKE_KEYS = new Set([
  "damage",
  "criticalChance",
  "criticalChanceOnHeadshot",
  "criticalChanceOnHeadshotKill",
  "criticalMultiplier",
  "fireRate",
  "attackSpeed",
  "multishot",
  "multishotOnKill",
  "slashOnCrit",
  "slashOnImpactProc",
  "extraElectricProcChance",
  "falloffDistance",
  "damageFirstShot",
  "statusChance",
  "abilityStrength",
  "abilityDuration",
  "abilityEfficiency",
  "abilityRange",
  "health",
  "shield",
  "armor",
  "energy",
  "sprintSpeed",
  "slideSpeed",
  "critBonusPerKill",
  "damageReductionPerKill",
  "tributeEfficiency",
  "speedPerCast",
  "damageResistancePerStack",
  "shieldRecharge",
  "shieldRechargeDelay",
  "aimGlide",
  "wallLatch",
  // Umbral mods' Tau resistance (wiki.warframe.com Umbral Vitality / Fiber / Intensify: +1%/rank, 11% R10).
  "tauResistance",
  // Chance to resist knockdown (wiki.warframe.com Sure Footed, Primed Sure Footed, Power Drift, Fortitude).
  "knockdownResistance",
]);

/**
 * wiki.warframe.com stat tables for mods whose values aren't linear in rank (index = rank).
 * Display only: the card shows the wiki value at each rank instead of perRank × (rank + 1).
 */
const MOD_RANK_VALUE_TABLES: Record<string, Record<string, readonly number[]>> = {
  // Adaptation: +5% … +10% per stack, 10 s … 20 s (R0–R10); calculator: adaptationDrPerStack.
  adaptation: {
    damageResistancePerStack: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    duration: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  // Immolated Radiance: shares 20/30/40/50% of Immolation's damage reduction (R0–R3).
  immolated_radiance: { sharedDamageReduction: [20, 30, 40, 50] },
  // Warding Thurible: allies take 30/35/40/50% less damage (R0–R3).
  warding_thurible: { allyDamageReduction: [30, 35, 40, 50] },
};

/** Card text for a stat that has a wiki rank table or a cap, else null (use the per-rank formula). */
export function formatModStatSpecial(modId: string, statKey: string, perRank: number, rank: number): string | null {
  const table = MOD_RANK_VALUE_TABLES[modId]?.[statKey];
  if (table) {
    const value = table[Math.min(Math.max(Math.round(rank), 0), table.length - 1)];
    const label = getModStatLabel(statKey);
    if (statKey === "duration") return `${formatStatNumber(value)}s ${label}`;
    return `${formatStatNumber(value)}% ${label}`;
  }
  // Adaptation: "Stacks up to 90%" (wiki); the cap doesn't scale with rank.
  if (statKey === "damageResistanceCap") return `Stacks up to ${perRank}%`;
  return null;
}

/** Flat seconds stored per rank (× (rank+1)), e.g. Aerodynamic +1s Aim Glide / +2s Wall Latch. */
const SECONDS_PER_RANK_KEYS = new Set(["aimGlideTime", "wallLatchTime"]);

/** Percent stats stored as the live value (not per-rank × (rank+1)). */
const RANK_INDEPENDENT_PERCENT_KEYS = new Set([
  "extraElectricProcChance",
]);

/** Flat non-percent stats stored as the live value (not per-rank × (rank+1)). */
const RANK_INDEPENDENT_FLAT_KEYS = new Set([
  "ricochetBounces",
  "syndicatePower",
  "abilityProjectileCount",
  "damageResistanceCap",
]);

function usesPercentDisplay(statKey: string): boolean {
  if (RANK_INDEPENDENT_PERCENT_KEYS.has(statKey)) return true;
  if (FLAT_STAT_KEYS.has(statKey)) return false;
  if (PERCENT_LIKE_KEYS.has(statKey)) return true;
  if (statKey.endsWith("Chance") || statKey.endsWith("Percent") || statKey.endsWith("Bonus")) return true;
  return statKey.includes("Damage") || statKey.includes("Speed") || statKey.includes("Rate");
}

/** True when catalog stores a per-rank % that scales as base × (rank+1). */
export function isPercentLikeModStat(statKey: string): boolean {
  return usesPercentDisplay(statKey);
}

export function isFlatModStat(statKey: string): boolean {
  return FLAT_STAT_KEYS.has(statKey);
}

function formatStatNumber(value: number): string {
  const rounded = Math.round(value * 1e4) / 1e4;
  const abs = Math.abs(rounded);
  const decimals = abs % 1 !== 0 && abs < 10 ? 1 : 0;
  const body = rounded.toFixed(decimals);
  return rounded > 0 ? `+${body}` : body;
}

/**
 * Resistance stats shown to one decimal at every size (wiki tables: Antitoxin 22.5%, Umbral Tau
 * 14.3% / 19.8%, Primed Sure Footed 18.18% → 18.2%), instead of rounding values ≥ 10 to integers.
 */
const ONE_DECIMAL_PERCENT_KEYS = new Set([
  "tauResistance",
  "knockdownResistance",
  "toxinDamageResistance",
  "radiationDamageResistance",
  "knockedDownDamageResistance",
]);

function formatOneDecimal(value: number): string {
  const body = String(Number(value.toFixed(1)));
  return value > 0 ? `+${body}` : body;
}

/** Per-rank catalog value → total at a given rank (mods store per-rank increments). */
export function modStatTotalAtRank(perRank: number, rank: number): number {
  return perRank * (rank + 1);
}

export function formatModStatValue(
  statKey: string,
  perRank: number,
  rank: number,
  multiplier = 1,
): string {
  const unscaled = RANK_INDEPENDENT_FLAT_KEYS.has(statKey) || RANK_INDEPENDENT_PERCENT_KEYS.has(statKey);
  const total = (unscaled ? perRank : modStatTotalAtRank(perRank, rank)) * multiplier;
  const label = getModStatLabel(statKey);
  if (statKey === "ampBonusDamage") {
    return `x${total.toFixed(1)} ${label}`;
  }
  if (statKey === "critDecayPerSecond") {
    return `${formatStatNumber(total)}%/s ${label}`;
  }
  if (usesPercentDisplay(statKey)) {
    const n = ONE_DECIMAL_PERCENT_KEYS.has(statKey) ? formatOneDecimal(total) : formatStatNumber(total);
    return `${n}% ${label}`;
  }
  if (statKey === "ricochetBounces") {
    return `${formatStatNumber(perRank)} bounces`;
  }
  if (statKey === "syndicatePower") {
    return `+${perRank} syndicate power`;
  }
  if (statKey === "abilityProjectileCount") {
    return `${formatStatNumber(perRank)} projectiles`;
  }
  if (statKey === "range" || statKey === "attractionRange" || statKey === "allyRadius" || statKey === "blastStaggerRadius") {
    return `${formatStatNumber(total)}m ${label}`;
  }
  if (statKey === "duration" || statKey === "cooldown" || SECONDS_PER_RANK_KEYS.has(statKey)) {
    return `${formatStatNumber(total)}s ${label}`;
  }
  return `${formatStatNumber(total)} ${label}`;
}

export interface ModStatDisplayLine {
  statKey: string;
  label: string;
  atRank: string;
  atMax: string;
}

export function getModStatDisplayLines(mod: Mod, rank: number): ModStatDisplayLine[] {
  const stats = mod.stats ?? {};
  return Object.entries(stats).map(([statKey, perRank]) => {
    const special = formatModStatSpecial(mod.id, statKey, perRank, rank);
    if (special !== null) {
      const atMax = formatModStatSpecial(mod.id, statKey, perRank, mod.maxRank)!;
      return { statKey, label: getModStatLabel(statKey), atRank: special, atMax: rank >= mod.maxRank ? special : atMax };
    }
    const unscaled = RANK_INDEPENDENT_FLAT_KEYS.has(statKey) || RANK_INDEPENDENT_PERCENT_KEYS.has(statKey);
    const atRank = unscaled
      ? formatModStatValue(statKey, perRank, 0)
      : formatModStatValue(statKey, perRank, rank);
    const atMax = unscaled
      ? atRank
      : formatModStatValue(statKey, perRank, mod.maxRank);
    return {
      statKey,
      label: getModStatLabel(statKey),
      atRank,
      atMax: rank >= mod.maxRank ? atRank : atMax,
    };
  });
}

export function modDrainAtRank(baseDrain: number, rank: number): number {
  return baseDrain + rank;
}
