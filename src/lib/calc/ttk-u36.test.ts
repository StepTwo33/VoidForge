import { describe, expect, it } from "vitest";
import { enemyArmorDamageReduction, scaleArmor } from "@/lib/calc/ttk";
import { damageFactionForEnemy, enemyDamageTypeMultiplier } from "@/data/faction-damage-modifiers";

// Hand-worked against wiki Damage (Update 36 faction modifiers), Armor, and Enemy Level Scaling.
describe("Update 36 faction damage modifiers", () => {
  const lancer = { id: "lancer", faction: "Grineer" };
  const crewman = { id: "crewman", faction: "Corpus" };
  it("Grineer: impact/corrosive ×1.5, others ×1", () => {
    expect(enemyDamageTypeMultiplier(lancer, "impact")).toBe(1.5);
    expect(enemyDamageTypeMultiplier(lancer, "corrosive")).toBe(1.5);
    expect(enemyDamageTypeMultiplier(lancer, "heat")).toBe(1);
    expect(enemyDamageTypeMultiplier(lancer, "slash")).toBe(1);
  });
  it("Corpus: puncture/magnetic ×1.5", () => {
    expect(enemyDamageTypeMultiplier(crewman, "puncture")).toBe(1.5);
    expect(enemyDamageTypeMultiplier(crewman, "magnetic")).toBe(1.5);
    expect(enemyDamageTypeMultiplier(crewman, "viral")).toBe(1);
  });
  it("Corrupted maps to Orokin (radiation ×0.5)", () => {
    const e = { id: "x_unknown", faction: "Corrupted" };
    expect(damageFactionForEnemy(e)).toBe("Orokin");
    expect(enemyDamageTypeMultiplier(e, "radiation")).toBe(0.5);
    expect(enemyDamageTypeMultiplier(e, "viral")).toBe(1.5);
  });
  it("Corpus Amalgam sub-faction resists blast", () => {
    const e = { id: "amalgam_heqet", faction: "Corpus" };
    expect(damageFactionForEnemy(e)).toBe("Corpus Amalgam");
    expect(enemyDamageTypeMultiplier(e, "blast")).toBe(0.5);
    expect(enemyDamageTypeMultiplier(e, "electricity")).toBe(1.5);
  });
});

describe("enemy armor (wiki Armor / Enemy Level Scaling)", () => {
  it("DR = 0.9·√(A/2700): 300 → 0.3, 2700 → 0.9, above uses A/(A+300)", () => {
    expect(enemyArmorDamageReduction(300)).toBeCloseTo(0.3, 10);
    expect(enemyArmorDamageReduction(2700)).toBeCloseTo(0.9, 10);
    expect(enemyArmorDamageReduction(3000)).toBeCloseTo(3000 / 3300, 10);
  });
  it("armor is clamped to minimum 200 and maximum 2700", () => {
    expect(scaleArmor(100, 1)).toBe(200);
    expect(scaleArmor(500, 9999)).toBe(2700);
    expect(scaleArmor(0, 100)).toBe(0);
  });
  it("base 100 at level 150: past the 80 blend, f2 = 1 + 0.4·149^0.75 ≈ 18.05 → ≈1805", () => {
    expect(scaleArmor(100, 150)).toBeCloseTo(100 * (1 + 0.4 * Math.pow(149, 0.75)), 6);
    expect(scaleArmor(100, 150)).toBeGreaterThan(1800);
    expect(scaleArmor(100, 150)).toBeLessThan(1810);
  });
});
