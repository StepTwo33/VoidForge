import { describe, expect, it } from "vitest";
import {
  getNegativeStatsWithDisposition,
  getStatsWithDisposition,
  rivenBuffCountMultiplier,
  rivenCurseMultiplier,
} from "@/lib/calc/riven-calculator";

const find = (pool: { name: string }[], n: string) => pool.find((s) => s.name === n) as never as {
  minValue: number; maxValue: number; baseValue: number; type: string;
};

describe("R8-1 riven ranges (wiki Riven Mods attribute formula)", () => {
  it("bonus / curse factors", () => {
    expect(rivenBuffCountMultiplier(2, false)).toBe(0.99);
    expect(rivenBuffCountMultiplier(2, true)).toBe(1.2375);
    expect(rivenBuffCountMultiplier(3, false)).toBe(0.75);
    expect(rivenBuffCountMultiplier(3, true)).toBe(0.9375);
    expect(rivenCurseMultiplier(2)).toBe(0.495);
    expect(rivenCurseMultiplier(3)).toBe(0.75);
  });
  it("rifle Damage 2+1 at dispo 1.0: 165×1.2375×[0.9,1.1] = 183.8–224.6", () => {
    const d = find(getStatsWithDisposition("rifle", 1, { positiveCount: 2, hasNegative: true }), "Damage");
    expect(d.minValue).toBeCloseTo(183.8, 1);
    expect(d.maxValue).toBeCloseTo(224.6, 1);
  });
  it("rifle Damage 3+0: 165×0.75 → 111.4–136.1", () => {
    const d = find(getStatsWithDisposition("rifle", 1, { positiveCount: 3, hasNegative: false }), "Damage");
    expect(d.minValue).toBeCloseTo(111.4, 1);
    expect(d.maxValue).toBeCloseTo(136.1, 1);
  });
  it("rifle Damage curse 2+1: −165×0.495 → −89.8…−73.5", () => {
    const d = find(getNegativeStatsWithDisposition(1, { positiveCount: 2, category: "rifle" }), "Damage");
    expect(d.minValue).toBeCloseTo(-89.8, 1);
    expect(d.maxValue).toBeCloseTo(-73.5, 1);
  });
  it("base values: pistol Damage 219.6, rifle Slash 119.97, melee Range 1.94 m, Combo 8.1 s", () => {
    const o = { positiveCount: 2, hasNegative: true };
    expect(find(getStatsWithDisposition("pistol", 1, o), "Damage").baseValue).toBeCloseTo(219.6 * 1.2375, 1);
    expect(find(getStatsWithDisposition("rifle", 1, o), "Slash").baseValue).toBeCloseTo(119.97 * 1.2375, 1);
    const r = find(getStatsWithDisposition("melee", 1, o), "Range");
    expect(r.type).toBe("integer");
    expect(r.baseValue).toBeCloseTo(2.4, 1); // 1.94×1.2375
    expect(find(getStatsWithDisposition("melee", 1, o), "Combo Duration").baseValue).toBeCloseTo(10.0, 1);
  });
  it("elements and Punch Through never curse; Recoil curse is positive", () => {
    const neg = getNegativeStatsWithDisposition(1, { category: "rifle" });
    expect(neg.some((s) => s.name.includes("Heat") || s.name === "Punch Through")).toBe(false);
    expect(find(neg, "Recoil").baseValue).toBeGreaterThan(0);
  });
});

describe("R8-1 dispositions (wiki.gg Module:Weapons/data)", () => {
  it("7 corrected entries", async () => {
    const { rivenDispositions: d } = await import("@/data/riven-dispositions");
    expect([d["Aksondol"], d["Nunchasa"], d["Pathocyst"], d["Sarofang"], d["Tenet Diplos"], d["Tenet Plinx"], d["Coda Bassocyst"]])
      .toEqual([0.5, 0.5, 1.3, 1.1, 0.75, 0.8, 0.55]);
  });
});
