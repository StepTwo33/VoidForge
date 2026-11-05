import { describe, expect, it } from "vitest";
import { evaluateRiven, getRivenGrade, rivenShapeProblem, type RivenMod, type RivenStat } from "@/lib/calc/riven-calculator";

const pos = (name: string, v: number): RivenStat => ({ name, type: "percent", baseValue: v, minValue: v * 0.9, maxValue: v * 1.1 });
const neg = (name: string, v: number): RivenStat => ({ name, type: "percent", baseValue: -v, minValue: -v * 1.1, maxValue: -v * 0.9 });
const riven = (positiveStats: RivenStat[], negativeStat: RivenStat | null): RivenMod => ({
  weaponName: "Braton", polarity: "madurai", rank: 8, rerolls: 0, positiveStats, negativeStat, disposition: 1.2,
});
const three = [pos("Critical Chance", 150), pos("Critical Damage", 120), pos("Multishot", 110)];

describe("Round 54 riven grader", () => {
  it("a harmful curse lowers the score meaningfully versus a harmless curse", () => {
    const good = evaluateRiven(riven(three.slice(0, 2), neg("Zoom", 60)));
    const bad = evaluateRiven(riven(three.slice(0, 2), neg("Damage", 90)));
    expect(good - bad).toBeGreaterThan(1);
  });

  it("only a 3 positive + 1 negative roll can be a God Roll", () => {
    expect(getRivenGrade(evaluateRiven(riven(three, null)))).not.toBe("God Roll");
    expect(getRivenGrade(evaluateRiven(riven(three.slice(0, 2), neg("Zoom", 60))))).not.toBe("God Roll");
    expect(getRivenGrade(evaluateRiven(riven(three, neg("Zoom", 60))))).toBe("God Roll");
  });

  it("requires a legal shape", () => {
    expect(rivenShapeProblem(1, 0)).toMatch(/2 or 3/);
    expect(rivenShapeProblem(4, 0)).toMatch(/at most 3/);
    expect(rivenShapeProblem(2, 2)).toMatch(/at most 1/);
    expect(rivenShapeProblem(2, 0)).toBeNull();
    expect(rivenShapeProblem(3, 1)).toBeNull();
  });
});
