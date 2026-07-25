import { describe, expect, it } from "vitest";
import {
  evaluateRiven,
  getRivenGrade,
  getStatsWithDisposition,
  rivenBuffCountMultiplier,
  rivenRankMultiplier,
} from "@/lib/calc/riven-calculator";
import { getDispositionInfo, hasKnownDisposition } from "@/data/riven-dispositions";

describe("riven rank / buff multipliers", () => {
  it("rank 8 is full strength; rank 0 is 1/9", () => {
    expect(rivenRankMultiplier(8)).toBeCloseTo(1, 5);
    expect(rivenRankMultiplier(0)).toBeCloseTo(1 / 9, 5);
  });

  it("2+neg is baseline; 3+0 is lowest", () => {
    expect(rivenBuffCountMultiplier(2, true)).toBe(1);
    expect(rivenBuffCountMultiplier(3, false)).toBeLessThan(rivenBuffCountMultiplier(2, true));
  });
});

describe("getStatsWithDisposition", () => {
  it("scales rifle Damage max with disposition at rank 8 / 2+neg", () => {
    const atOne = getStatsWithDisposition("rifle", 1.0, { positiveCount: 2, hasNegative: true, rank: 8 });
    const atHalf = getStatsWithDisposition("rifle", 0.5, { positiveCount: 2, hasNegative: true, rank: 8 });
    const dmg1 = atOne.find((s) => s.name === "Damage")!;
    const dmgHalf = atHalf.find((s) => s.name === "Damage")!;
    expect(dmgHalf.maxValue).toBeCloseTo(dmg1.maxValue * 0.5, 0);
  });

  it("includes Impact/Puncture/Slash in rifle pool and curses", () => {
    const pool = getStatsWithDisposition("rifle", 1.0);
    expect(pool.some((s) => s.name === "Impact")).toBe(true);
    expect(pool.some((s) => s.name === "Punch Through" && s.type === "integer")).toBe(true);
  });
});

describe("evaluateRiven", () => {
  it("scores Punch Through using flat units (not /100 as percent)", () => {
    const asPercentWould = evaluateRiven({
      weaponName: "Test",
      polarity: "madurai",
      rank: 8,
      rerolls: 0,
      disposition: 1,
      positiveStats: [
        { name: "Punch Through", type: "percent", baseValue: 2.7, minValue: 1, maxValue: 4 },
      ],
      negativeStat: null,
    });
    const asInteger = evaluateRiven({
      weaponName: "Test",
      polarity: "madurai",
      rank: 8,
      rerolls: 0,
      disposition: 1,
      positiveStats: [
        { name: "Punch Through", type: "integer", baseValue: 2.7, minValue: 1, maxValue: 4 },
      ],
      negativeStat: null,
    });
    // Integer path should score ~ weight*1 + tier, not ~0.027
    expect(asInteger).toBeGreaterThan(0.4);
    expect(asInteger).toBeGreaterThan(asPercentWould);
  });

  it("rewards Impact curse vs Damage curse", () => {
    const base = {
      weaponName: "Braton",
      polarity: "madurai",
      rank: 8,
      rerolls: 0,
      disposition: 1.15,
      positiveStats: [
        { name: "Damage", type: "percent" as const, baseValue: 180, minValue: 100, maxValue: 220 },
        { name: "Multishot", type: "percent" as const, baseValue: 100, minValue: 60, maxValue: 120 },
      ],
    };
    const withImpact = evaluateRiven({
      ...base,
      negativeStat: { name: "Impact", type: "percent", baseValue: -80, minValue: -120, maxValue: -60 },
    });
    const withDamage = evaluateRiven({
      ...base,
      negativeStat: { name: "Damage", type: "percent", baseValue: -80, minValue: -120, maxValue: -60 },
    });
    expect(withImpact).toBeGreaterThan(withDamage);
    expect(getRivenGrade(withImpact)).not.toBe("Reroll");
  });
});

describe("disposition lookup", () => {
  it("knows Amprex and warns unknown names", () => {
    expect(hasKnownDisposition("Amprex")).toBe(true);
    expect(getDispositionInfo("Amprex").value).toBe(0.85);
    expect(hasKnownDisposition("__NotAWeapon__")).toBe(false);
    expect(getDispositionInfo("__NotAWeapon__").value).toBe(1.0);
  });
});
