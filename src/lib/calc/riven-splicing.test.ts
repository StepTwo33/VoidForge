/**
 * Riven Splicing (Update 44.1): hand-worked expected values on real weapons.
 * Lato: 40 base (10 IPS impact/puncture, 20 slash), CC 10%, mag 15, reload 1s.
 * Skana: melee, heavy wind up 0.6s base.
 * Element lines are quantized to 1/32 of modded base (existing Voidforge rule, same
 * as base-element riven rolls): 36 on a 40 base → round(36 / 1.25) × 1.25 = 36.25.
 */
import { describe, expect, it } from "vitest";
import { weaponsMap } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, getRivenStatsForCategory, type SimulationParams } from "@/lib/types";
import { evaluateRiven, getSplicedStats, getStatsWithDisposition, type RivenStat } from "@/lib/calc/riven-calculator";

const lato = weaponsMap.get("lato")!;
const skana = weaponsMap.get("skana")!;

function calc(weaponId: "lato" | "skana", riven?: Record<string, number>, sim: Partial<SimulationParams> = {}) {
  const w = weaponId === "lato" ? lato : skana;
  return calculateWeaponBuildWithArcanes(w, [], modsMap, [], undefined, { ...DEFAULT_SIM_PARAMS, ...sim }, undefined, undefined, riven);
}

describe("spliced combined elements", () => {
  it("weapon fixture is the expected Lato", () => {
    expect(lato.damage).toBe(40);
    expect(lato.criticalChance).toBe(0.1);
  });

  for (const type of ["viral", "corrosive", "gas", "radiation", "blast", "magnetic"]) {
    it(`+90% ${type} adds 40 × 0.9 = 36 (→ 36.25 quantized) as already-combined ${type}`, () => {
      const s = calc("lato", { [type]: 0.9 });
      expect(s.elements).toEqual([{ type, value: 36.25 }]);
      expect(s.totalDamage).toBeCloseTo(40 + 36.25, 9);
      // Same magnitude a base-element riven roll of +90% gets.
      expect(calc("lato", { toxin: 0.9 }).elements[0].value).toBe(36.25);
    });
  }

  it("scales with riven +damage regardless of key order (40 × 2 × 0.9 = 72 → 72.5 at 2.5 steps)", () => {
    for (const r of [{ damage: 1, viral: 0.9 }, { viral: 0.9, damage: 1 }]) {
      const s = calc("lato", r);
      expect(s.elements).toEqual([{ type: "viral", value: 72.5 }]);
      expect(s.totalDamage).toBeCloseTo(80 + 72.5, 9);
    }
  });

  it("does not combine with a base element: toxin stays toxin", () => {
    const s = calc("lato", { toxin: 0.5, viral: 0.9 });
    expect(s.elements).toEqual([{ type: "toxin", value: 20 }, { type: "viral", value: 36.25 }]);
  });

  it("merges with the same combined type made from heat + cold (20 + 20 + 36 = 76 → 76.25 blast)", () => {
    const s = calc("lato", { heat: 0.5, cold: 0.5, blast: 0.9 });
    expect(s.elements).toEqual([{ type: "blast", value: 76.25 }]);
  });
});

describe("spliced status / weak point / faction / utility", () => {
  it("Status Damage +90% → statusDamageBonus 0.9", () => {
    expect(calc("lato", { statusDamage: 0.9 }).statusDamageBonus).toBeCloseTo(0.9, 9);
  });

  it("Weak Point Damage +225% → head multi 2×(1+2.25)=6.5 vs 2 (×3.25 burst with headshots)", () => {
    const base = calc("lato", undefined, { applyHeadshots: true });
    const wp = calc("lato", { weakPointDamage: 2.25 }, { applyHeadshots: true });
    expect(wp.headshotDamageBonus).toBeCloseTo(2.25, 9);
    expect(wp.burstDps / base.burstDps).toBeCloseTo(3.25, 6);
    // No effect without headshots.
    expect(calc("lato", { weakPointDamage: 2.25 }).burstDps).toBeCloseTo(calc("lato").burstDps, 9);
  });

  it("Weak Point Crit Chance +247.5%: additive on base CC, headshots only", () => {
    expect(calc("lato", { weakPointCritChance: 2.475 }, { applyHeadshots: true }).criticalChance).toBeCloseTo(0.1 + 0.1 * 2.475, 9); // 34.75%
    expect(calc("lato", { weakPointCritChance: 2.475 }).criticalChance).toBeCloseTo(0.1, 9);
    // With riven +100% CC: 0.1 × 2 + 0.1 × 2.475 = 44.75%, in either key order.
    for (const r of [{ criticalChance: 1, weakPointCritChance: 2.475 }, { weakPointCritChance: 2.475, criticalChance: 1 }]) {
      expect(calc("lato", r, { applyHeadshots: true }).criticalChance).toBeCloseTo(0.4475, 9);
    }
  });

  it("Damage to Scaldra / Techrot / Orokin x0.45 behave exactly like an existing x0.45 faction roll", () => {
    const ref = calc("lato", { factionGrineer: 0.45 }, { targetFaction: "Grineer" });
    expect(calc("lato", { factionScaldra: 0.45 }, { targetFaction: "Scaldra" }).burstDps).toBeCloseTo(ref.burstDps, 9);
    expect(calc("lato", { factionTechrot: 0.45 }, { targetFaction: "Techrot" }).burstDps).toBeCloseTo(ref.burstDps, 9);
    expect(calc("lato", { factionOrokin: 0.45 }, { targetFaction: "Corrupted" }).burstDps).toBeCloseTo(ref.burstDps, 9);
    // Hit multiplier 1.45 on direct-hit-only part; DoT squared — so not the same as no-riven.
    expect(ref.burstDps).toBeGreaterThan(calc("lato", undefined, { targetFaction: "Grineer" }).burstDps * 1.45 - 1e-9);
  });

  it("Scaldra/Techrot spliced traits do nothing against other factions", () => {
    const none = calc("lato", undefined, { targetFaction: "Grineer" }).burstDps;
    expect(calc("lato", { factionScaldra: 0.45 }, { targetFaction: "Grineer" }).burstDps).toBeCloseTo(none, 9);
    expect(calc("lato", { factionTechrot: 0.45 }, { targetFaction: "Corpus" }).burstDps).toBeCloseTo(calc("lato", undefined, { targetFaction: "Corpus" }).burstDps, 9);
  });

  it("Grineer (which Voidforge applies to Scaldra) + Damage to Scaldra add up: 0.45 + 0.45 = 0.9", () => {
    const stacked = calc("lato", { factionGrineer: 0.45, factionScaldra: 0.45 }, { targetFaction: "Scaldra" });
    const single = calc("lato", { factionGrineer: 0.9 }, { targetFaction: "Grineer" });
    expect(stacked.burstDps).toBeCloseTo(single.burstDps, 9);
  });

  it("Ammo Efficiency +45%: burst unchanged, sustained uses mag 15 / (0.55 × fire rate)", () => {
    const base = calc("lato");
    const s = calc("lato", { ammoEfficiency: 0.45 });
    expect(s.ammoEfficiency).toBeCloseTo(0.45, 9);
    expect(s.burstDps).toBeCloseTo(base.burstDps, 9);
    const efr = s.effectiveFireRate ?? s.fireRate;
    const magTime = 15 / (0.55 * efr);
    expect(s.sustainedDps).toBeCloseTo(s.burstDps * (magTime / (magTime + 1)), 6);
  });

  it("Heavy Attack Wind Up Speed +119.7% (Skana): 0.6 / 2.197 = 0.27310s", () => {
    expect(calc("skana", { heavyAttackWindUp: 1.197 }).heavyAttackWindUp).toBeCloseTo(0.6 / 2.197, 9);
  });

  it("display-only spliced traits change no calculated number", () => {
    const base = JSON.stringify(calc("skana"));
    for (const k of ["heavyAttackDamageBonus", "slamDamage", "parryAngle"]) {
      expect(JSON.stringify(calc("skana", { [k]: 1.197 }))).toBe(base);
    }
    expect(JSON.stringify(calc("lato", { reloadWhileHolstered: 0.9 }))).toBe(JSON.stringify(calc("lato")));
  });
});

describe("spliced stat pools", () => {
  const keys = (cat: string) => getRivenStatsForCategory(cat).filter((s) => s.spliced).map((s) => s.key);

  it("rifle/pistol/shotgun get 14, archgun 13 (no Reload While Holstered), melee 14", () => {
    expect(keys("rifle")).toHaveLength(14);
    expect(keys("pistol")).toHaveLength(14);
    expect(keys("shotgun")).toHaveLength(14);
    expect(keys("archgun")).toHaveLength(13);
    expect(keys("archgun")).not.toContain("reloadWhileHolstered");
    expect(keys("melee")).toHaveLength(14);
    expect(keys("melee")).not.toContain("weakPointDamage");
    expect(keys("rifle")).not.toContain("parryAngle");
  });

  it("includeSpliced: false returns the legacy pool unchanged", () => {
    for (const c of ["rifle", "pistol", "shotgun", "archgun", "melee"]) {
      expect(getRivenStatsForCategory(c, { includeSpliced: false }).some((s) => s.spliced)).toBe(false);
    }
  });
});

describe("grader", () => {
  it("spliced base values match the wiki table", () => {
    const byName = Object.fromEntries(getSplicedStats("rifle").map((s) => [s.name, s.baseValue]));
    expect(byName["Weak Point Damage (Spliced)"]).toBe(225);
    expect(byName["Weak Point Critical Chance (Spliced)"]).toBe(247.5);
    expect(byName["Viral Damage (Spliced)"]).toBe(90);
    expect(byName["Ammo Efficiency (Spliced)"]).toBe(45);
    expect(byName["Damage to Orokin (Spliced)"]).toBe(45);
    const melee = Object.fromEntries(getSplicedStats("melee").map((s) => [s.name, s.baseValue]));
    expect(melee["Parry Angle (Spliced)"]).toBe(81);
    expect(melee["Slam Attack Damage (Spliced)"]).toBe(119.7);
    expect(getSplicedStats("archgun").some((s) => s.name.startsWith("Reload While Holstered"))).toBe(false);
  });

  it("legacy pool unchanged unless includeSpliced is set", () => {
    expect(getStatsWithDisposition("rifle", 1).some((s) => s.spliced)).toBe(false);
    expect(getStatsWithDisposition("rifle", 1, { includeSpliced: true }).filter((s) => s.spliced)).toHaveLength(14);
  });

  it("spliced traits are excluded from the score", () => {
    const cc: RivenStat = { name: "Critical Chance", type: "percent", baseValue: 150, minValue: 90, maxValue: 200 };
    const viral: RivenStat = { name: "Viral Damage (Spliced)", type: "percent", baseValue: 90, minValue: 54.5, maxValue: 119.9, spliced: true };
    const r = { weaponName: "Lato", polarity: "madurai", rank: 8, rerolls: 0, negativeStat: null, disposition: 1 };
    expect(evaluateRiven({ ...r, positiveStats: [cc, viral] })).toBe(evaluateRiven({ ...r, positiveStats: [cc] }));
  });
});
