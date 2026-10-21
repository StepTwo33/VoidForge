import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { getMeleeStats, getNegativeStats } from "@/lib/calc/riven-calculator";
import { getRivenStatsForCategory } from "@/lib/types";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";

describe("info-only melee riven stats (R10-D)", () => {
  it("are offered on melee rivens, flagged info-only", () => {
    const defs = getRivenStatsForCategory("melee", { includeSpliced: false }).filter((d) =>
      ["slideAttackCritChance", "comboCountChance", "comboGainChance"].includes(d.key),
    );
    expect(defs.map((d) => [d.key, d.displayOnly])).toEqual([
      ["slideAttackCritChance", true],
      ["comboCountChance", true],
      ["comboGainChance", true],
    ]);
  });

  it("grader pools follow the wiki: Chance to Gain Combo Count is curse-only, Additional Combo Count Chance buff-only", () => {
    const pos = getMeleeStats().map((s) => s.name);
    const neg = getNegativeStats("melee").map((s) => s.name);
    expect(pos).toContain("Critical Chance for Slide Attack");
    expect(pos).toContain("Additional Combo Count Chance");
    expect(pos).not.toContain("Chance to Gain Combo Count");
    expect(neg).toContain("Chance to Gain Combo Count");
    expect(neg).not.toContain("Additional Combo Count Chance");
    expect(getMeleeStats().find((s) => s.name === "Critical Chance for Slide Attack")!.baseValue).toBe(120);
  });

  it("do not change weapon DPS", () => {
    const w = allWeapons.find((x) => x.category === "melee")!;
    const mods = getEffectiveModsMap();
    const slots = [{ modId: "riven_melee", rank: 8, slotIndex: 0 }];
    const run = (r: Record<string, number>) =>
      calculateWeaponBuild(w, slots, mods, undefined, undefined, undefined, undefined, r);
    const base = run({ damage: 1 });
    const withRiven = run({ damage: 1, slideAttackCritChance: 1.2, comboCountChance: 0.5, comboGainChance: -0.6 });
    expect(base.totalDamage).toBeGreaterThan(calculateWeaponBuild(w, [], mods).totalDamage);
    expect(JSON.stringify(withRiven)).toBe(JSON.stringify(base));
  });
});
