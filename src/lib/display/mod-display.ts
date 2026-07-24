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
]);

function usesPercentDisplay(statKey: string): boolean {
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
  const abs = Math.abs(value);
  const decimals = abs % 1 !== 0 && abs < 10 ? 1 : 0;
  const body = value.toFixed(decimals);
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
  const total = modStatTotalAtRank(perRank, rank) * multiplier;
  const label = getModStatLabel(statKey);
  if (statKey === "ampBonusDamage") {
    return `x${total.toFixed(1)} ${label}`;
  }
  if (statKey === "critDecayPerSecond") {
    return `${formatStatNumber(total)}%/s ${label}`;
  }
  if (usesPercentDisplay(statKey)) {
    return `${formatStatNumber(total)}% ${label}`;
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
  if (statKey === "duration" || statKey === "cooldown") {
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
    const flat = FLAT_STAT_KEYS.has(statKey);
    const atRank = flat
      ? formatModStatValue(statKey, perRank, 0)
      : formatModStatValue(statKey, perRank, rank);
    const atMax = flat
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
