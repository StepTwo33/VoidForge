// Riven Grader — disposition-scaled pools + community heuristic scoring.
// Users enter in-game rolled values; there is no random generation.

export interface RivenStat {
  name: string;
  type: "percent" | "integer" | "seconds";
  baseValue: number;
  minValue: number;
  maxValue: number;
}

export interface RivenMod {
  weaponName: string;
  polarity: string;
  rank: number; // 0-8
  rerolls: number;
  positiveStats: RivenStat[];
  negativeStat: RivenStat | null;
  disposition: number; // 0.5 to 1.55
}

export interface RivenRangeOptions {
  /** Number of positive stats on the roll (affects buff-count penalty). */
  positiveCount?: number;
  hasNegative?: boolean;
  /** Rank 0–8; ranges shown at max rank by default. */
  rank?: number;
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
 * Buff-count scaling vs a 2+neg baseline (wiki Riven Mods).
 * Approximate community tables used for range display.
 */
export function rivenBuffCountMultiplier(positiveCount: number, hasNegative: boolean): number {
  const n = Math.max(1, Math.min(3, positiveCount));
  if (n <= 2 && hasNegative) return 1.0;
  if (n <= 2) return 0.9;
  if (hasNegative) return 0.75;
  return 0.66;
}

// ============================================================
// STAT POOLS (by weapon type) — labels aligned with builder
// ============================================================
export function getRifleStats(): RivenStat[] {
  return [
    { name: "Damage", type: "percent", baseValue: 165.0, minValue: 99.9, maxValue: 219.8 },
    { name: "Multishot", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Critical Chance", type: "percent", baseValue: 150.0, minValue: 90.9, maxValue: 200.0 },
    { name: "Critical Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Status Chance", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Fire Rate", type: "percent", baseValue: 60.0, minValue: 36.3, maxValue: 79.9 },
    { name: "Magazine Capacity", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Reload Speed", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Ammo Maximum", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Zoom", type: "percent", baseValue: 60.0, minValue: 36.3, maxValue: 79.9 },
    { name: "Projectile Speed", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Punch Through", type: "integer", baseValue: 2.7, minValue: 1.6, maxValue: 3.6 },
    { name: "Recoil", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
    { name: "Impact", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Puncture", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Slash", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Heat Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Cold Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Toxin Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Electricity Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
  ];
}

export function getMeleeStats(): RivenStat[] {
  return [
    { name: "Damage", type: "percent", baseValue: 165.0, minValue: 99.9, maxValue: 219.8 },
    { name: "Critical Chance", type: "percent", baseValue: 180.0, minValue: 109.0, maxValue: 239.8 },
    { name: "Critical Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Status Chance", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Attack Speed", type: "percent", baseValue: 55.0, minValue: 33.3, maxValue: 73.3 },
    { name: "Range", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Slide Attack", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Finisher Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Combo Duration", type: "seconds", baseValue: 10.0, minValue: 6.1, maxValue: 13.3 },
    { name: "Impact", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Puncture", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Slash", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Heat Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Cold Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Toxin Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Electricity Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
  ];
}

export function getShotgunStats(): RivenStat[] {
  return [
    { name: "Damage", type: "percent", baseValue: 165.0, minValue: 99.9, maxValue: 219.8 },
    { name: "Multishot", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Critical Chance", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Critical Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Status Chance", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Fire Rate", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Magazine Capacity", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Reload Speed", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Ammo Maximum", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Projectile Speed", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Impact", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Puncture", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Slash", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Heat Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Cold Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Toxin Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Electricity Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
  ];
}

export function getPistolStats(): RivenStat[] {
  return [
    { name: "Damage", type: "percent", baseValue: 165.0, minValue: 99.9, maxValue: 219.8 },
    { name: "Multishot", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Critical Chance", type: "percent", baseValue: 150.0, minValue: 90.9, maxValue: 200.0 },
    { name: "Critical Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Status Chance", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Fire Rate", type: "percent", baseValue: 75.0, minValue: 45.4, maxValue: 99.9 },
    { name: "Magazine Capacity", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Reload Speed", type: "percent", baseValue: 50.0, minValue: 30.3, maxValue: 66.6 },
    { name: "Ammo Maximum", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Projectile Speed", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Zoom", type: "percent", baseValue: 80.0, minValue: 48.5, maxValue: 106.6 },
    { name: "Recoil", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
    { name: "Impact", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Puncture", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Slash", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Heat Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Cold Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Toxin Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Electricity Damage", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
  ];
}

export function getArchgunStats(): RivenStat[] {
  return [
    { name: "Damage", type: "percent", baseValue: 100.0, minValue: 60.6, maxValue: 133.3 },
    { name: "Multishot", type: "percent", baseValue: 60.0, minValue: 36.3, maxValue: 79.9 },
    { name: "Critical Chance", type: "percent", baseValue: 100.0, minValue: 60.6, maxValue: 133.3 },
    { name: "Critical Damage", type: "percent", baseValue: 80.0, minValue: 48.5, maxValue: 106.6 },
    { name: "Status Chance", type: "percent", baseValue: 60.0, minValue: 36.3, maxValue: 79.9 },
    { name: "Fire Rate", type: "percent", baseValue: 60.0, minValue: 36.3, maxValue: 79.9 },
    { name: "Magazine Capacity", type: "percent", baseValue: 60.0, minValue: 36.3, maxValue: 79.9 },
    { name: "Reload Speed", type: "percent", baseValue: 100.0, minValue: 60.6, maxValue: 133.3 },
    { name: "Ammo Maximum", type: "percent", baseValue: 100.0, minValue: 60.6, maxValue: 133.3 },
    { name: "Projectile Speed", type: "percent", baseValue: 100.0, minValue: 60.6, maxValue: 133.3 },
    { name: "Heat Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Cold Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Toxin Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
    { name: "Electricity Damage", type: "percent", baseValue: 120.0, minValue: 72.7, maxValue: 160.0 },
  ];
}

export function getStatsForCategory(category: string): RivenStat[] {
  const cat = category.toLowerCase();
  if (cat === "melee") return getMeleeStats();
  if (cat === "shotgun") return getShotgunStats();
  if (cat === "pistol" || cat === "secondary") return getPistolStats();
  if (cat === "archgun") return getArchgunStats();
  return getRifleStats();
}

/** Scale pool min/max by disposition × rank × buff-count (plus ±10% roll band already in base min/max). */
export function getStatsWithDisposition(
  category: string,
  disposition: number,
  options: RivenRangeOptions = {},
): RivenStat[] {
  const rank = options.rank ?? 8;
  const positiveCount = options.positiveCount ?? 2;
  const hasNegative = options.hasNegative ?? true;
  const scale = disposition * rivenRankMultiplier(rank) * rivenBuffCountMultiplier(positiveCount, hasNegative);

  return getStatsForCategory(category).map((stat) => ({
    ...stat,
    minValue: Math.round(stat.minValue * scale * 10) / 10,
    maxValue: Math.round(stat.maxValue * scale * 10) / 10,
    baseValue: Math.round(stat.baseValue * scale * 10) / 10,
  }));
}

export function getNegativeStats(): RivenStat[] {
  return [
    { name: "Damage", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
    { name: "Multishot", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Critical Chance", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Critical Damage", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Status Chance", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Fire Rate", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Attack Speed", type: "percent", baseValue: -55.0, minValue: -73.3, maxValue: -33.3 },
    { name: "Magazine Capacity", type: "percent", baseValue: -50.0, minValue: -66.6, maxValue: -30.3 },
    { name: "Reload Speed", type: "percent", baseValue: -50.0, minValue: -66.6, maxValue: -30.3 },
    { name: "Ammo Maximum", type: "percent", baseValue: -50.0, minValue: -66.6, maxValue: -30.3 },
    { name: "Projectile Speed", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
    { name: "Recoil", type: "percent", baseValue: 90.0, minValue: 54.5, maxValue: 119.9 },
    { name: "Zoom", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Range", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Slide Attack", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Finisher Damage", type: "percent", baseValue: -60.0, minValue: -79.9, maxValue: -36.3 },
    { name: "Impact", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
    { name: "Puncture", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
    { name: "Slash", type: "percent", baseValue: -90.0, minValue: -119.9, maxValue: -54.5 },
  ];
}

export function getNegativeStatsWithDisposition(
  disposition: number,
  options: RivenRangeOptions = {},
): RivenStat[] {
  const rank = options.rank ?? 8;
  const positiveCount = options.positiveCount ?? 2;
  const hasNegative = true;
  const scale = disposition * rivenRankMultiplier(rank) * rivenBuffCountMultiplier(positiveCount, hasNegative);

  return getNegativeStats().map((stat) => ({
    ...stat,
    minValue: Math.round(stat.minValue * scale * 10) / 10,
    maxValue: Math.round(stat.maxValue * scale * 10) / 10,
    baseValue: Math.round(stat.baseValue * scale * 10) / 10,
  }));
}

/** Normalize a user-entered value for scoring: % → fraction of 100; flat stats → fraction of typical max. */
function scoringMagnitude(stat: RivenStat): number {
  const abs = Math.abs(stat.baseValue);
  if (stat.type === "percent") return abs / 100;
  if (stat.type === "seconds") return abs / 10; // combo duration ~10s baseline
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

  score *= riven.disposition;
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
