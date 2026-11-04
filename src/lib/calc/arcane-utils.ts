import type { ArcaneEffectLine } from "@/data/arcane-effects";

/** Arcane Persistence damage/s cap by rank (wiki: ranks 0–5). */
export const PERSISTENCE_DAMAGE_CAP_BY_RANK = [750, 700, 650, 600, 550, 500] as const;

export function getPersistenceDamageCap(rank: number, maxRank = 5): number {
  const r = Math.min(Math.max(rank, 0), maxRank);
  return PERSISTENCE_DAMAGE_CAP_BY_RANK[r] ?? PERSISTENCE_DAMAGE_CAP_BY_RANK[PERSISTENCE_DAMAGE_CAP_BY_RANK.length - 1];
}

export interface ArcaneEffectScaleOpts {
  /** When true, value is the same at every arcane rank (e.g. proc chance, duration). */
  constantAtAllRanks?: boolean;
  /** Value at rank 0. When set, scales linearly to maxValue at maxRank. */
  baseValue?: number;
  /** Explicit value per rank (R0..Rmax). Overrides base/max interpolation. */
  valuesByRank?: number[];
}

/** Scale arcane stat values by rank. */
export function scaleArcaneEffectValue(
  maxValue: number,
  rank: number,
  maxRank: number,
  opts?: ArcaneEffectScaleOpts,
): number {
  if (opts?.constantAtAllRanks) return maxValue;

  const r = Math.min(Math.max(rank, 0), maxRank);

  if (opts?.valuesByRank?.length) {
    const byRank = opts.valuesByRank;
    if (r < byRank.length) return byRank[r]!;
    return byRank[byRank.length - 1] ?? maxValue;
  }

  if (opts?.baseValue != null && maxRank > 0) {
    return opts.baseValue + (maxValue - opts.baseValue) * (r / maxRank);
  }

  if (maxRank <= 0) return maxValue;
  // Legacy: scales from max/(maxRank+1) at R0 up to maxValue at maxRank.
  return maxValue * ((r + 1) / (maxRank + 1));
}

export function scaleArcaneEffectLine(
  line: Pick<ArcaneEffectLine, "maxValue" | "baseValue" | "constantAtAllRanks" | "valuesByRank">,
  rank: number,
  maxRank: number,
): number {
  return scaleArcaneEffectValue(line.maxValue, rank, maxRank, {
    constantAtAllRanks: line.constantAtAllRanks,
    baseValue: line.baseValue,
    valuesByRank: line.valuesByRank,
  });
}

/**
 * Max stacks at a rank. wiki: some arcanes raise their stack cap with rank
 * (Ice Storm 10→20, Magus Melt 2→7, Zid-An Uskos 625→105 kills).
 */
export function arcaneStackCap(
  def: { stackCap?: number; stackCapByRank?: number[]; maxRank: number },
  rank?: number,
): number | undefined {
  if (def.stackCapByRank?.length && rank != null) {
    const r = Math.max(0, Math.min(def.stackCapByRank.length - 1, Math.round(rank)));
    return def.stackCapByRank[r];
  }
  return def.stackCap;
}

/** Values at each rank for preview / editor. */
export function arcaneEffectValuesByRank(
  line: Pick<ArcaneEffectLine, "maxValue" | "baseValue" | "constantAtAllRanks" | "valuesByRank">,
  maxRank: number,
): number[] {
  return Array.from({ length: maxRank + 1 }, (_, rank) => scaleArcaneEffectLine(line, rank, maxRank));
}

/** Infer R0 from max when only max is known (legacy formula). */
export function defaultArcaneBaseValue(maxValue: number, maxRank: number): number {
  if (maxRank <= 0) return maxValue;
  return maxValue / (maxRank + 1);
}
