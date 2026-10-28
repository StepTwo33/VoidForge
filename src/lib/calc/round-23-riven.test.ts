/**
 * Round 23: grader recalibration for the constant 1.2x Riven multiplier.
 *
 * Old grader: score = Σ(value × weight + tier) × weaponDisposition + bonuses, with weapons spread over
 * 0.5x-1.55x (median 1.15x). Grade bands were never documented, so they are kept and the score is
 * re-expressed at the median disposition: a roll of a given quality grades exactly as it did on a
 * 1.15x weapon (src/lib/calc/riven-calculator.ts GRADER_REFERENCE_DISPOSITION).
 */
import { describe, expect, it } from "vitest";
import {
  GRADER_REFERENCE_DISPOSITION,
  STANDARD_RIVEN_DISPOSITION,
  evaluateRiven,
  getNegativeStatsWithDisposition,
  getRivenGrade,
  getStatsWithDisposition,
  type RivenMod,
  type RivenStat,
} from "@/lib/calc/riven-calculator";

const pct = (name: string, value: number): RivenStat => ({
  name,
  type: "percent",
  baseValue: value,
  minValue: value,
  maxValue: value,
});

const riven = (pos: RivenStat[], neg: RivenStat | null, disposition?: number): RivenMod =>
  ({
    weaponName: "Test",
    name: "Test",
    polarity: "madurai",
    rank: 8,
    rerolls: 0,
    positiveStats: pos,
    negativeStat: neg,
    ...(disposition === undefined ? {} : { disposition }),
  }) as RivenMod;

/** The grader exactly as it was before Round 23, for a weapon rolled at disposition d. */
function oldScore(pos: Array<[string, number, number]>, curseBonus: number, godBonus: number, d: number): number {
  // pos entries: [name, value %, weight]; tier bonus derived from weight
  let s = 0;
  for (const [, v, w] of pos) s += (v / 100) * w + (w >= 0.9 ? 0.2 : w >= 0.7 ? 0.1 : 0);
  return s * d + curseBonus + godBonus;
}

describe("Round 23 grader calibration", () => {
  it("reference disposition is the median of the retired per-weapon table", () => {
    expect(GRADER_REFERENCE_DISPOSITION).toBe(1.15);
    expect(STANDARD_RIVEN_DISPOSITION).toBe(1.2);
  });

  it("Damage 190 + Heat 90 with a Reload Speed -40 curse: Excellent before, Good now (hand-worked)", () => {
    // Before (×1.2 on the raw sum): (1.9×1.0+0.2) + (0.9×0.8+0.1) = 2.1 + 0.82 = 2.92; ×1.2 = 3.504; curse 0.4 → +0.1 → 3.604 = Excellent
    // Now: values × 1.15/1.2 (0.958333): 1.820833+0.2 = 2.020833; 0.69+0.1 = 0.79; sum 2.810833; ×1.15 = 3.232458; +0.1 = 3.332458
    // one great stat only → no god-roll bonus → Good (2.5-3.5)
    const r = riven([pct("Damage", 190), pct("Heat Damage", 90)], pct("Reload Speed", -40));
    expect(oldScore([["Damage", 190, 1.0], ["Heat", 90, 0.8]], 0.1, 0, 1.2)).toBeCloseTo(3.604, 6);
    expect(getRivenGrade(3.604)).toBe("Excellent");
    expect(evaluateRiven(r)).toBeCloseTo(3.332458, 5);
    expect(getRivenGrade(evaluateRiven(r))).toBe("Good");
  });

  it("the same roll quality scores the same as it did on a median-disposition weapon", () => {
    // Median-disposition weapon (1.15x): rank-8 rifle Damage / Critical Chance with Impact curse, 2+1, at 50% of the roll band.
    const dmg = getStatsWithDisposition("rifle", 1.15, { rank: 8, positiveCount: 2, hasNegative: true }).find((s) => s.name === "Damage")!;
    const cc = getStatsWithDisposition("rifle", 1.15, { rank: 8, positiveCount: 2, hasNegative: true }).find((s) => s.name === "Critical Chance")!;
    const imp = getNegativeStatsWithDisposition(1.15, { category: "rifle", rank: 8, positiveCount: 2 }).find((s) => s.name === "Impact")!;
    const mid = (s: RivenStat) => (s.minValue + s.maxValue) / 2;
    const before = oldScore([["Damage", mid(dmg), 1.0], ["CC", mid(cc), 0.95]], 0.5, 0.5, 1.15);

    const dmg2 = getStatsWithDisposition("rifle", 1.2, { rank: 8, positiveCount: 2, hasNegative: true }).find((s) => s.name === "Damage")!;
    const cc2 = getStatsWithDisposition("rifle", 1.2, { rank: 8, positiveCount: 2, hasNegative: true }).find((s) => s.name === "Critical Chance")!;
    const imp2 = getNegativeStatsWithDisposition(1.2, { category: "rifle", rank: 8, positiveCount: 2 }).find((s) => s.name === "Impact")!;
    const after = evaluateRiven(riven([pct("Damage", mid(dmg2)), pct("Critical Chance", mid(cc2))], pct("Impact", mid(imp2))));

    expect(imp.minValue).toBeLessThan(0);
    // The 1.1-decimal rounding of pool bounds (round1) keeps this within a few thousandths.
    expect(after).toBeCloseTo(before, 1);
    // And the uncalibrated ×1.2 would have been ~0.47 higher.
    expect(oldScore([["Damage", mid(dmg2), 1.0], ["CC", mid(cc2), 0.95]], 0.5, 0.5, 1.2) - after).toBeGreaterThan(0.4);
  });

  it("an explicit disposition names the multiplier the entered values were rolled at", () => {
    // 1.15x-rolled values graded at 1.15 need no rescale: (1.0×1+0.2)×1.15 = 1.38
    expect(evaluateRiven(riven([pct("Damage", 100)], null, 1.15))).toBeCloseTo(1.38, 9);
    // The same quality rolled at 1.2 shows 100 × 1.2/1.15 = 104.347826 and must grade the same
    expect(evaluateRiven(riven([pct("Damage", 104.347826)], null, 1.2))).toBeCloseTo(1.38, 6);
  });

  it("grade bands are unchanged", () => {
    expect([4.5, 3.5, 2.5, 1.5, 0.8, 0.79].map(getRivenGrade)).toEqual([
      "God Roll", "Excellent", "Good", "Average", "Below Average", "Reroll",
    ]);
  });
});
