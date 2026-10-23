// Riven Grader — disposition-scaled pools + community heuristic scoring.
// Users enter in-game rolled values; there is no random generation.

import { STANDARD_RIVEN_DISPOSITION } from "@/data/riven-dispositions";

export { STANDARD_RIVEN_DISPOSITION };

export interface RivenStat {
  name: string;
  type: "percent" | "integer" | "seconds";
  baseValue: number;
  minValue: number;
  maxValue: number;
  /** Riven Splicer trait (Update 44.1): always positive, max one per riven, not scored. */
  spliced?: boolean;
}

export interface RivenMod {
  weaponName: string;
  polarity: string;
  rank: number; // 0-8
  rerolls: number;
  positiveStats: RivenStat[];
  negativeStat: RivenStat | null;
  /** Standardized to 1.2 (DE retired individual weapon dispositions). */
  disposition?: number;
}

export interface RivenRangeOptions {
  /** Number of positive stats on the roll (affects buff-count penalty). */
  positiveCount?: number;
  hasNegative?: boolean;
  /** Rank 0–8; ranges shown at max rank by default. */
  rank?: number;
  /** Append spliced traits (Riven Splicer) to the positive pool. Default false. */
  includeSpliced?: boolean;
}

export function formatRivenStatValue(stat: RivenStat): string {
  const value = Math.abs(stat.baseValue);
  if (stat.type === "percent") return `${value.toFixed(1)}%`;
  if (stat.type === "integer") return value.toFixed(1);
  if (stat.type === "seconds") return `${value.toFixed(1)}s`;
  return value.toFixed(2);
}

export function getRivenDrain(rank: number): number {
  return 10 + rank;
}

/** Rank multiplier at max rank is 1.0 (rank 8 → 9/9). */
export function rivenRankMultiplier(rank: number): number {
  return Math.max(0, Math.min(8, rank) + 1) / 9;
}

/**
 * Wiki Riven Mods § Attribute Value Formula: positive attributes are multiplied by
 * 2+0 → 0.99, 2+1 → 1.2375, 3+0 → 0.75, 3+1 → 0.9375.
 */
export function rivenBuffCountMultiplier(positiveCount: number, hasNegative: boolean): number {
  const n = Math.max(1, Math.min(3, positiveCount));
  if (n <= 2) return hasNegative ? 1.2375 : 0.99;
  return hasNegative ? 0.9375 : 0.75;
}

/** Curse factor (wiki): 2+1 → 0.495, 3+1 → 0.75 of the attribute's base value. */
export function rivenCurseMultiplier(positiveCount: number): number {
  return Math.max(1, Math.min(3, positiveCount)) >= 3 ? 0.75 : 0.495;
}

/** Each roll is 90–110% of base (wiki). */
const ROLL_MIN = 0.9;
const ROLL_MAX = 1.1;

type RivenPoolKey = "rifle" | "shotgun" | "pistol" | "archgun" | "melee";
interface RivenAttr {
  name: string;
  type: RivenStat["type"];
  /** Wiki base value per weapon class (Riven Mods § Base Values; ExportUpgrades). */
  base: Partial<Record<RivenPoolKey, number>>;
  /** Never rolls as a curse (wiki footnote 1). */
  positiveOnly?: boolean;
  /** Lower is better (Recoil): positive roll is negative %. */
  inverted?: boolean;
  /** Only ever rolls as a curse (wiki footnote 3). */
  negativeOnly?: boolean;
}

// Wiki Riven Mods base-value table (wiki.warframe.com, 2026-10).
const RIVEN_ATTRS: RivenAttr[] = [
  { name: "Damage", type: "percent", base: { rifle: 165, shotgun: 164.7, pistol: 219.6, archgun: 99.9, melee: 164.7 } },
  { name: "Multishot", type: "percent", base: { rifle: 90, shotgun: 119.7, pistol: 119.7, archgun: 60.3 } },
  { name: "Critical Chance", type: "percent", base: { rifle: 149.99, shotgun: 90, pistol: 149.99, archgun: 99.9, melee: 180 } },
  { name: "Critical Damage", type: "percent", base: { rifle: 119.997, shotgun: 90, pistol: 90, archgun: 80.1, melee: 90 } },
  { name: "Status Chance", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90, archgun: 60.3, melee: 90 } },
  { name: "Fire Rate", type: "percent", base: { rifle: 60.03, shotgun: 90, pistol: 74.7, archgun: 60.03 } },
  { name: "Attack Speed", type: "percent", base: { melee: 54.9 } },
  { name: "Range", type: "integer", base: { melee: 1.94 } },
  { name: "Slide Attack", type: "percent", base: { melee: 120 } },
  { name: "Finisher Damage", type: "percent", base: { melee: 119.7 } },
  { name: "Combo Duration", type: "seconds", base: { melee: 8.1 } },
  { name: "Critical Chance for Slide Attack", type: "percent", base: { melee: 120 } },
  { name: "Additional Combo Count Chance", type: "percent", base: { melee: 58.77 }, positiveOnly: true },
  { name: "Chance to Gain Combo Count", type: "percent", base: { melee: 104.85 }, negativeOnly: true },
  { name: "Magazine Capacity", type: "percent", base: { rifle: 49.995, shotgun: 49.995, pistol: 49.995, archgun: 60.3 } },
  { name: "Reload Speed", type: "percent", base: { rifle: 49.995, shotgun: 49.995, pistol: 49.995, archgun: 99.9 } },
  { name: "Ammo Maximum", type: "percent", base: { rifle: 49.95, shotgun: 90, pistol: 90, archgun: 99.9 } },
  { name: "Zoom", type: "percent", base: { rifle: 59.99, pistol: 80.1, archgun: 59.99 } },
  { name: "Projectile Speed", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90 } },
  { name: "Punch Through", type: "integer", base: { rifle: 2.7, shotgun: 2.7, pistol: 2.7, archgun: 2.7 }, positiveOnly: true },
  { name: "Recoil", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90, archgun: 90 }, inverted: true },
  { name: "Impact", type: "percent", base: { rifle: 119.97, shotgun: 119.97, pistol: 119.97, archgun: 90, melee: 119.7 } },
  { name: "Puncture", type: "percent", base: { rifle: 119.997, shotgun: 119.997, pistol: 119.997, archgun: 90, melee: 119.997 } },
  { name: "Slash", type: "percent", base: { rifle: 119.97, shotgun: 119.97, pistol: 119.97, archgun: 90, melee: 119.7 } },
  { name: "Heat Damage", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90, archgun: 119.7, melee: 90 }, positiveOnly: true },
  { name: "Cold Damage", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90, archgun: 119.7, melee: 90 }, positiveOnly: true },
  { name: "Toxin Damage", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90, archgun: 119.7, melee: 90 }, positiveOnly: true },
  { name: "Electricity Damage", type: "percent", base: { rifle: 90, shotgun: 90, pistol: 90, archgun: 119.7, melee: 90 }, positiveOnly: true },
];

function poolKey(category: string): RivenPoolKey {
  const cat = category.toLowerCase();
  if (cat === "melee") return "melee";
  if (cat === "shotgun") return "shotgun";
  if (cat === "pistol" || cat === "secondary") return "pistol";
  if (cat === "archgun") return "archgun";
  return "rifle";
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

/** Unscaled pool (disposition 1, factor 1): base and the ±10% roll band. */
function poolFor(key: RivenPoolKey): RivenStat[] {
  return RIVEN_ATTRS.filter((a) => a.base[key] != null && !a.negativeOnly).map((a) => {
    const b = a.base[key]!;
    const sign = a.inverted ? -1 : 1;
    const lo = sign * b * ROLL_MIN;
    const hi = sign * b * ROLL_MAX;
    return {
      name: a.name,
      type: a.type,
      baseValue: sign * b,
      minValue: Math.min(lo, hi),
      maxValue: Math.max(lo, hi),
    };
  });
}

// ============================================================
// STAT POOLS (by weapon type) — labels aligned with builder
// ============================================================
export function getRifleStats(): RivenStat[] {
  return poolFor("rifle");
}
export function getMeleeStats(): RivenStat[] {
  return poolFor("melee");
}
export function getShotgunStats(): RivenStat[] {
  return poolFor("shotgun");
}
export function getPistolStats(): RivenStat[] {
  return poolFor("pistol");
}
export function getArchgunStats(): RivenStat[] {
  return poolFor("archgun");
}

export function getStatsForCategory(category: string): RivenStat[] {
  const cat = category.toLowerCase();
  if (cat === "melee") return getMeleeStats();
  if (cat === "shotgun") return getShotgunStats();
  if (cat === "pistol" || cat === "secondary") return getPistolStats();
  if (cat === "archgun") return getArchgunStats();
  return getRifleStats();
}

// ============================================================
// SPLICED TRAITS (Riven Splicer, Update 44.1)
// Base values: wiki Riven Mods "Spliced Values" (from DE Public Export).
// Roll band: 90–110% of base, like the regular pools.
// ============================================================
const SPLICED_MIN_RATIO = ROLL_MIN;
const SPLICED_MAX_RATIO = ROLL_MAX;

function spliced(name: string, baseValue: number): RivenStat {
  return {
    name,
    type: "percent",
    baseValue,
    minValue: Math.round(baseValue * SPLICED_MIN_RATIO * 10) / 10,
    maxValue: Math.round(baseValue * SPLICED_MAX_RATIO * 10) / 10,
    spliced: true,
  };
}

export function getSplicedStats(category: string): RivenStat[] {
  const cat = category.toLowerCase();
  const all = [
    spliced("Viral Damage (Spliced)", 90),
    spliced("Corrosive Damage (Spliced)", 90),
    spliced("Gas Damage (Spliced)", 90),
    spliced("Radiation Damage (Spliced)", 90),
    spliced("Blast Damage (Spliced)", 90),
    spliced("Magnetic Damage (Spliced)", 90),
    spliced("Status Damage (Spliced)", 90),
    spliced("Damage to Orokin (Spliced)", 45),
    spliced("Damage to Scaldra (Spliced)", 45),
    spliced("Damage to Techrot (Spliced)", 45),
  ];
  if (cat === "melee") {
    return [
      ...all,
      spliced("Heavy Attack Wind Up Speed (Spliced)", 119.7),
      spliced("Melee Damage On Heavy Attack (Spliced)", 119.7),
      spliced("Slam Attack Damage (Spliced)", 119.7),
      spliced("Parry Angle (Spliced)", 81),
    ];
  }
  const ranged = [
    ...all,
    spliced("Weak Point Damage (Spliced)", 225),
    spliced("Weak Point Critical Chance (Spliced)", 247.5),
    spliced("Ammo Efficiency (Spliced)", 45),
  ];
  if (cat === "archgun") return ranged;
  return [...ranged, spliced("Reload While Holstered (Spliced)", 90)];
}

/** Scale pool min/max by disposition × rank × buff-count (plus ±10% roll band already in base min/max). */
export function getStatsWithDisposition(
  category: string,
  disposition: number = STANDARD_RIVEN_DISPOSITION,
  options: RivenRangeOptions = {},
): RivenStat[] {
  const rank = options.rank ?? 8;
  const positiveCount = options.positiveCount ?? 2;
  const hasNegative = options.hasNegative ?? true;
  const scale = disposition * rivenRankMultiplier(rank) * rivenBuffCountMultiplier(positiveCount, hasNegative);

  const pool = options.includeSpliced
    ? [...getStatsForCategory(category), ...getSplicedStats(category)]
    : getStatsForCategory(category);
  return pool.map((stat) => ({
    ...stat,
    minValue: Math.round(stat.minValue * scale * 10) / 10,
    maxValue: Math.round(stat.maxValue * scale * 10) / 10,
    baseValue: Math.round(stat.baseValue * scale * 10) / 10,
  }));
}

/**
 * Curse pool (wiki): same base value as the positive attribute, sign flipped; elements
 * and Punch Through never roll negative. Unscaled (disposition 1, factor 1).
 */
export function getNegativeStats(category = "rifle"): RivenStat[] {
  const key = poolKey(category);
  return RIVEN_ATTRS.filter((a) => a.base[key] != null && !a.positiveOnly).map((a) => {
    const b = a.base[key]!;
    const sign = a.inverted ? 1 : -1;
    const lo = sign * b * ROLL_MIN;
    const hi = sign * b * ROLL_MAX;
    return { name: a.name, type: a.type, baseValue: sign * b, minValue: Math.min(lo, hi), maxValue: Math.max(lo, hi) };
  });
}

export function getNegativeStatsWithDisposition(
  disposition: number = STANDARD_RIVEN_DISPOSITION,
  options: RivenRangeOptions & { category?: string } = {},
): RivenStat[] {
  const rank = options.rank ?? 8;
  const positiveCount = options.positiveCount ?? 2;
  const scale = disposition * rivenRankMultiplier(rank) * rivenCurseMultiplier(positiveCount);

  return getNegativeStats(options.category ?? "rifle").map((stat) => ({
    ...stat,
    minValue: round1(stat.minValue * scale),
    maxValue: round1(stat.maxValue * scale),
    baseValue: round1(stat.baseValue * scale),
  }));
}

/** Normalize a user-entered value for scoring: % → fraction of 100; flat stats → fraction of typical max. */
function scoringMagnitude(stat: RivenStat): number {
  const abs = Math.abs(stat.baseValue);
  if (stat.type === "percent") return abs / 100;
  if (stat.type === "seconds") return abs / 10; // combo duration ~10s baseline
  if (stat.name === "Range") return abs / 1.94; // melee range metres (wiki base 1.94 m)
  if (stat.type === "integer") return abs / 2.7; // punch through ~2.7m baseline
  return abs / 100;
}

// ============================================================
// EVALUATOR - Grade rivens based on community standards
// ============================================================
const STAT_WEIGHTS: Record<string, number> = {
  Damage: 1.0,
  Multishot: 0.95,
  "Critical Chance": 0.95,
  "Critical Damage": 0.9,
  "Toxin Damage": 0.85,
  "Heat Damage": 0.8,
  "Cold Damage": 0.8,
  "Electricity Damage": 0.75,
  // Legacy short names (older saved grader state)
  Toxin: 0.85,
  Heat: 0.8,
  Cold: 0.8,
  Electricity: 0.75,
  "Status Chance": 0.8,
  "Fire Rate": 0.7,
  "Attack Speed": 0.85,
  Range: 0.6,
  "Slide Attack": 0.4,
  "Punch Through": 0.5,
  "Magazine Capacity": 0.4,
  "Reload Speed": 0.5,
  "Combo Duration": 0.45,
  "Finisher Damage": 0.3,
  Zoom: 0.2,
  Recoil: 0.15,
  "Ammo Maximum": 0.2,
  "Projectile Speed": 0.25,
  Impact: 0.35,
  Puncture: 0.35,
  Slash: 0.55,
};

/** Higher = better curse for the roll (community preference). */
const NEGATIVE_VALUES: Record<string, number> = {
  Impact: 1.0,
  Puncture: 0.95,
  Zoom: 0.8,
  Recoil: 0.7,
  "Ammo Maximum": 0.6,
  Slash: 0.55,
  "Projectile Speed": 0.5,
  "Magazine Capacity": 0.5,
  "Reload Speed": 0.4,
  "Fire Rate": 0.3,
  "Attack Speed": 0.25,
  "Status Chance": 0.1,
  Damage: 0.0,
  Multishot: 0.0,
  "Critical Chance": 0.0,
  "Critical Damage": 0.0,
};

export function evaluateRiven(riven: RivenMod): number {
  let score = 0;
  let greatStats = 0;

  for (const stat of riven.positiveStats) {
    // Spliced traits are excluded from the community-weight score: there is no
    // established community value for them yet (Update 44.1).
    if (stat.spliced) continue;
    const weight = STAT_WEIGHTS[stat.name] ?? 0.3;
    const value = scoringMagnitude(stat);

    let tierBonus = 0;
    if (weight >= 0.9) {
      tierBonus = 0.2;
      greatStats++;
    } else if (weight >= 0.7) {
      tierBonus = 0.1;
    }

    score += value * weight + tierBonus;
  }

  let negativeBonus = 0;
  if (riven.negativeStat) {
    const curseValue = NEGATIVE_VALUES[riven.negativeStat.name] ?? 0.3;
    if (curseValue >= 0.9) negativeBonus = 0.5;
    else if (curseValue >= 0.7) negativeBonus = 0.3;
    else if (curseValue >= 0.4) negativeBonus = 0.1;
    else negativeBonus = -0.3;
  }

  let godRollBonus = 0;
  if (greatStats >= 2 && negativeBonus >= 0.3) godRollBonus = 0.5;
  else if (greatStats >= 2) godRollBonus = 0.3;

  score *= riven.disposition ?? STANDARD_RIVEN_DISPOSITION;
  score += negativeBonus + godRollBonus;

  if (riven.rank < 8) {
    score *= 0.5 + riven.rank / 16;
  }

  return score;
}

export function getRivenGrade(score: number): string {
  if (score >= 4.5) return "God Roll";
  if (score >= 3.5) return "Excellent";
  if (score >= 2.5) return "Good";
  if (score >= 1.5) return "Average";
  if (score >= 0.8) return "Below Average";
  return "Reroll";
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case "God Roll": return "#FFD700";
    case "Excellent": return "#E91E63";
    case "Good": return "#9C27B0";
    case "Average": return "#2196F3";
    case "Below Average": return "#4CAF50";
    case "Reroll": return "#F44336";
    default: return "#9CA3AF";
  }
}

export function getStatTier(statName: string): string {
  const weight = STAT_WEIGHTS[statName] ?? 0.3;
  if (weight >= 0.9) return "GREAT";
  if (weight >= 0.7) return "Good";
  if (weight >= 0.4) return "Meh";
  return "Low";
}

export function getStatTierColor(tier: string): string {
  switch (tier) {
    case "GREAT": return "#FFD700";
    case "Good": return "#9C27B0";
    case "Meh": return "#2196F3";
    default: return "#9CA3AF";
  }
}

export function getRerollCost(rerollCount: number): number {
  const costs = [900, 1000, 1200, 1400, 1700, 2000, 2350, 2700, 3050];
  if (rerollCount < costs.length) return costs[rerollCount];
  return 3500;
}

export function isValueInStatRange(value: number, stat: RivenStat): boolean {
  const lo = Math.min(stat.minValue, stat.maxValue);
  const hi = Math.max(stat.minValue, stat.maxValue);
  // Allow small float slack; curses may be entered as positive magnitudes in UI
  const absVal = Math.abs(value);
  const absLo = Math.min(Math.abs(lo), Math.abs(hi));
  const absHi = Math.max(Math.abs(lo), Math.abs(hi));
  return absVal + 0.05 >= absLo && absVal - 0.05 <= absHi;
}
