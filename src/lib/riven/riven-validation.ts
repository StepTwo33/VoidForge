import { getRivenStatsForCategory, type RivenStatDef } from "@/lib/types";
import {
  STANDARD_RIVEN_DISPOSITION,
  getRivenDrain,
  getNegativeStatsWithDisposition,
  getStatsWithDisposition,
} from "@/lib/calc/riven-calculator";

/**
 * Riven shape + range checks for the builder's riven editor (Round 54).
 *
 * Shape (wiki.warframe.com/w/Riven_Mods): two or three positive attributes and at most one
 * negative. A spliced trait combines two traits into one and is always positive, so it
 * counts as a positive here.
 *
 * Ranges: only checked where the grader's wiki base-value table has the attribute
 * (src/lib/calc/riven-calculator.ts), at the standardized 1.2 disposition
 * (src/data/riven-dispositions.ts). The editor stores the riven at rank 0 but users enter
 * the values they see in game, which can be any rank, so only the rank-8 ceiling (+10% roll
 * band, plus 0.1 rounding slack) is enforced; low values are allowed.
 */

/**
 * Polarities a riven can roll (wiki Riven Mods: "randomly chosen between Madurai, Naramon, or
 * Vazarin"). No Zenurik / Umbra / Penjaga / Unairu rivens exist.
 */
export const RIVEN_POLARITIES = ["madurai", "naramon", "vazarin"] as const;
export type RivenPolarity = (typeof RIVEN_POLARITIES)[number];
/** "Not chosen yet" (also what rivens saved before Round 54 carry). Not a real riven polarity. */
export const DEFAULT_RIVEN_POLARITY = "universal";
/**
 * Riven drain is not rolled: every riven costs 10 at rank 0 and 18 at rank 8 (+1 per rank),
 * the existing cap in getRivenDrain (riven-calculator.ts) and the catalog riven mods
 * (drain 10, maxRank 8, src/data/mods.ts). The editor picks the rank; drain follows.
 */
export const RIVEN_MAX_RANK = 8;
export const RIVEN_DRAIN_MIN = getRivenDrain(0);
export const RIVEN_DRAIN_MAX = getRivenDrain(RIVEN_MAX_RANK);
/** New rivens default to max rank (drain 18), like regular mods default to max rank in the picker. */
export const DEFAULT_RIVEN_DRAIN = RIVEN_DRAIN_MAX;

export interface RivenValidation {
  ok: boolean;
  errors: string[];
  positives: number;
  negatives: number;
}

/** Recoil is inverted: a buff lowers recoil (negative value). */
export function isRivenBuff(key: string, value: number): boolean {
  return key === "recoil" ? value < 0 : value > 0;
}

function labelFor(def: RivenStatDef | undefined, key: string): string {
  if (!def) return key;
  return def.spliced ? def.label.replace(" (Spliced)", "") : def.label;
}

/** Builder riven pool category → grader base-value table (same buckets as getRivenStatsForCategory). */
export function graderRivenCategory(poolCategory: string): string {
  const cat = poolCategory.toLowerCase();
  if (cat === "melee" || cat === "zaw_strike" || cat === "archmelee") return "melee";
  if (cat === "shotgun") return "shotgun";
  if (["pistol", "secondary", "dual_pistols", "kitgun_chamber", "sentinel_weapon"].includes(cat)) return "pistol";
  if (cat === "archgun") return "archgun";
  return "rifle";
}

export function validateRivenStats(
  stats: Record<string, number>,
  poolCategory: string,
  weaponDisposition?: number,
): RivenValidation {
  const pool = getRivenStatsForCategory(poolCategory);
  const errors: string[] = [];
  let positives = 0;
  let negatives = 0;
  const entries = Object.entries(stats);

  for (const [key, value] of entries) {
    const def = pool.find((s) => s.key === key);
    if (!Number.isFinite(value) || value === 0) {
      errors.push(`${labelFor(def, key)} can't be 0. Remove it or enter the in-game value.`);
      continue;
    }
    if (def?.spliced && !isRivenBuff(key, value)) {
      errors.push(`${labelFor(def, key)} is a spliced trait and is always positive.`);
    }
    if (isRivenBuff(key, value)) positives++;
    else negatives++;
  }

  if (entries.length > 0) {
    if (positives < 2) errors.push(`A riven needs 2 or 3 positive stats (has ${positives}).`);
    if (positives > 3) errors.push(`A riven has at most 3 positive stats (has ${positives}).`);
    if (negatives > 1) errors.push(`A riven has at most 1 negative stat (has ${negatives}).`);
  } else {
    errors.push("Add the riven's stats (2 or 3 positives, up to 1 negative).");
  }

  // Range ceilings (only where the wiki base-value table covers the attribute).
  if (positives >= 2 && positives <= 3 && negatives <= 1) {
    const hasNegative = negatives === 1;
    const gradeCat = graderRivenCategory(poolCategory);
    const effectiveDispo = Math.max(1.55, (weaponDisposition ?? STANDARD_RIVEN_DISPOSITION) * 1.25);
    const posRanges = getStatsWithDisposition(gradeCat, effectiveDispo, {
      rank: 8,
      positiveCount: positives,
      hasNegative,
    });
    const negRanges = getNegativeStatsWithDisposition(effectiveDispo, {
      rank: 8,
      positiveCount: positives,
      category: gradeCat,
    });
    // Units must agree (e.g. melee Range is metres in the wiki table but % in the builder).
    const unitsMatch = (type: string, isPercent: boolean) => (type === "percent") === isPercent;
    for (const [key, value] of entries) {
      const def = pool.find((s) => s.key === key);
      if (!def || def.spliced || !Number.isFinite(value) || value === 0) continue;
      const buff = isRivenBuff(key, value);
      const shown = def.isPercent ? Math.abs(value) * 100 : Math.abs(value);
      if (!buff) {
        const inPositivePool = posRanges.some((r) => r.name === def.label && unitsMatch(r.type, def.isPercent));
        const neg = negRanges.find((r) => r.name === def.label);
        if (inPositivePool && !neg) {
          errors.push(`${def.label} never rolls as a negative.`);
          continue;
        }
        if (neg && unitsMatch(neg.type, def.isPercent)) {
          const cap = Math.max(Math.abs(neg.minValue), Math.abs(neg.maxValue));
          if (shown > cap + 0.1) {
            errors.push(`-${shown.toFixed(1)} ${def.label} is above the max roll (${cap.toFixed(1)}) for this riven shape.`);
          }
        }
        continue;
      }
      const pos = posRanges.find((r) => r.name === def.label);
      if (!pos || !unitsMatch(pos.type, def.isPercent)) continue;
      const cap = Math.max(Math.abs(pos.minValue), Math.abs(pos.maxValue));
      if (shown > cap + 0.1) {
        errors.push(`${shown.toFixed(1)} ${def.label} is above the max roll (${cap.toFixed(1)}) for this riven shape.`);
      }
    }
  }

  return { ok: errors.length === 0, errors, positives, negatives };
}

/** Clamp a stored / imported drain to the real 10–18 range (older saves allowed 0–30). */
export function clampRivenDrain(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_RIVEN_DRAIN;
  return Math.min(RIVEN_DRAIN_MAX, Math.max(RIVEN_DRAIN_MIN, Math.round(n)));
}

export function rivenRankFromDrain(drain: number): number {
  return clampRivenDrain(drain) - RIVEN_DRAIN_MIN;
}

export function rivenDrainFromRank(rank: number): number {
  return getRivenDrain(Math.max(0, Math.min(RIVEN_MAX_RANK, Math.round(rank))));
}

/** Editor-side check: a riven always has one of the three riven polarities. */
export function rivenPolarityError(p: string | undefined | null): string | null {
  return p && (RIVEN_POLARITIES as readonly string[]).includes(p.toLowerCase())
    ? null
    : "Pick the riven's polarity (Madurai, Naramon or Vazarin).";
}

export function normalizeRivenPolarity(p: string | undefined | null): string {
  if (!p) return DEFAULT_RIVEN_POLARITY;
  const v = p.toLowerCase();
  return (RIVEN_POLARITIES as readonly string[]).includes(v) ? v : DEFAULT_RIVEN_POLARITY;
}
