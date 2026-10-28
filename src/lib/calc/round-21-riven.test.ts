/**
 * Round 21: Riven dispositions are retired (Hotfix 44.1.3, wiki.warframe.com Riven Mods: every Riven
 * uses the 1.2x constant). Grader numbers are worked by hand from riven-calculator.ts.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  STANDARD_RIVEN_DISPOSITION,
  evaluateRiven,
  getRivenGrade,
  type RivenMod,
  type RivenStat,
} from "@/lib/calc/riven-calculator";
import { getCatalogCounts } from "@/lib/site/catalog-counts";

const pct = (name: string, value: number): RivenStat => ({
  name,
  type: "percent",
  baseValue: value,
  minValue: value,
  maxValue: value,
});

const riven = (positiveStats: RivenStat[], negativeStat: RivenStat | null, disposition?: number): RivenMod => ({
  weaponName: "Test",
  name: "Test",
  polarity: "madurai",
  rank: 8,
  rerolls: 0,
  positiveStats,
  negativeStat,
  ...(disposition === undefined ? {} : { disposition }),
}) as RivenMod;

describe("grader at the standard 1.2 multiplier", () => {
  it("Damage 170% + Critical Chance 170% with an Impact curse (hand-worked)", () => {
    // Round 23 calibration: entered values are rescaled by 1.15/1.2 = 0.958333 (reference / rolled-at), then ×1.15.
    // (1.70×1.00×0.958333 + 0.2) + (1.70×0.95×0.958333 + 0.2) = 1.829167 + 1.747708 = 3.576875; ×1.15 = 4.113406
    // curse Impact 1.0 → +0.5; two great stats and curse ≥ 0.3 → +0.5; rank 8 → no rank penalty
    // total 4.113406 + 1.0 = 5.113406 → God Roll (≥ 4.5)
    const r = riven([pct("Damage", 170), pct("Critical Chance", 170)], pct("Impact", -50));
    expect(STANDARD_RIVEN_DISPOSITION).toBe(1.2);
    expect(evaluateRiven(r)).toBeCloseTo(5.113406, 5);
    expect(getRivenGrade(evaluateRiven(r))).toBe("God Roll");
  });

  it("an omitted disposition grades exactly like an explicit 1.2", () => {
    const stats = [pct("Damage", 120), pct("Multishot", 90)];
    expect(evaluateRiven(riven(stats, null))).toBeCloseTo(evaluateRiven(riven(stats, null, 1.2)), 12);
  });

  it("Damage 120% + Multishot 90%, no curse: hand-worked → Good", () => {
    // Multishot weight 0.95: 0.9 × 0.95 = 0.855. Two great stats, no curse → +0.3 god-roll bonus.
    // (1.2 × 0.958333 + 0.2) + (0.855 × 0.958333 + 0.2) = 1.35 + 1.019375 = 2.369375; × 1.15 = 2.724781; + 0.3 = 3.024781
    const s = evaluateRiven(riven([pct("Damage", 120), pct("Multishot", 90)], null));
    expect(s).toBeCloseTo(3.024781, 5);
    expect(getRivenGrade(s)).toBe("Good");
  });
});

describe("no stale disposition copy", () => {
  const read = (p: string) => readFileSync(p, "utf8");
  it("user-facing copy no longer describes per-weapon / disposition-scaled rivens", () => {
    expect(read("src/app/about/page.tsx")).not.toMatch(/disposition-scaled/i);
    expect(read("src/app/riven-calculator/layout.tsx")).not.toMatch(/disposition/i);
    expect(read("src/lib/guides/how-to-mod-sections.ts")).not.toMatch(/Disposition, rolls/);
    const guide = read("src/app/guides/how-to-mod/rivens/page.tsx");
    expect(guide).not.toMatch(/disposition ranges|low-disposition|Disposition is per weapon/i);
    expect(guide).toMatch(/Hotfix 44\.1\.3/);
  });

  it("catalog counts no longer report a (now meaningless) disposition table size", () => {
    expect(getCatalogCounts()).not.toHaveProperty("rivenDispositions");
  });
});
