import { describe, expect, it } from "vitest";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { getEffectiveModsMap, getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

// Gladiator set (wiki.warframe.com + fandom): +10% melee crit chance per set piece per
// (Combo Multiplier − 1); 6 pieces = +60% (660% "at 12x"). No extra 6-piece bonus
// since Update 26.0 ("changed from 15% to 10%").
describe("Gladiator set bonus", () => {
  const mods = getEffectiveModsMap();
  const skana = getEffectiveWeapons().find((w) => w.id === "skana")!;
  const onWeapon = ["gladiator_might", "gladiator_rush", "gladiator_vice"].map((id, i) => ({ modId: id, rank: mods.get(id)!.maxRank, slotIndex: i }));
  const cc = (extraWf: number, combo: number) =>
    calculateWeaponBuildWithArcanes(skana, onWeapon, mods, [], undefined, {
      ...DEFAULT_SIM_PARAMS, comboCount: combo, extraGladiatorMods: extraWf,
    }).criticalChance;

  it("Skana base crit is 5% (hand-worked inputs)", () => {
    expect(skana.criticalChance).toBeCloseTo(0.05, 9);
  });

  it("6 pieces at 12x (220 hits): 5% × (1 + 0.6 × 11) = 38%", () => {
    expect(cc(3, 220)).toBeCloseTo(0.05 * (1 + 0.6 * 11), 9);
  });

  it("5 pieces at 12x: 5% × (1 + 0.5 × 11) = 32.5%", () => {
    expect(cc(2, 220)).toBeCloseTo(0.325, 9);
  });

  it("6 pieces at 4x (60 hits): 5% × (1 + 0.6 × 3) = 14%", () => {
    expect(cc(3, 60)).toBeCloseTo(0.14, 9);
  });

  it("no bonus below the first combo tier", () => {
    expect(cc(3, 19)).toBeCloseTo(0.05, 9);
  });
});
