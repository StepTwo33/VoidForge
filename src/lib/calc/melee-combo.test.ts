import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import {
  getHeavyAttackComboMultiplier,
  getMeleeScalingMultiplier,
  resolveEffectiveComboCount,
} from "@/lib/calc/melee-combo";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const galatine = allWeapons.find((w) => w.id === "galatine")!;

describe("melee combo tiers", () => {
  it("reaches 12× heavy and BR/WW combo multi at 220 hits", () => {
    expect(getHeavyAttackComboMultiplier(219)).toBe(11);
    expect(getHeavyAttackComboMultiplier(220)).toBe(12);
    // BR/WW share the heavy track (not a separate 3.75× scale)
    expect(getMeleeScalingMultiplier(220)).toBe(12);
    expect(getMeleeScalingMultiplier(20)).toBe(2);
    expect(getMeleeScalingMultiplier(0)).toBe(1);
  });

  it("uses 11-hit cadence and 11× cap for Dex Nikana", () => {
    expect(getHeavyAttackComboMultiplier(110, "dex_nikana")).toBe(11);
    expect(getHeavyAttackComboMultiplier(220, "dex_nikana")).toBe(11);
    expect(getHeavyAttackComboMultiplier(22, "dex_nikana")).toBe(3);
  });

  it("adds Corrupt Charge to effective combo count", () => {
    const modsMap = new Map(allMods.map((m) => [m.id, m]));
    const withCorrupt = resolveEffectiveComboCount(
      200,
      "galatine",
      [{ modId: "corrupt_charge", rank: 3, slotIndex: 0 }],
      modsMap,
    );
    // Corrupt Charge max = +30 combo (wiki) → 230 hits → 12× (12× starts at 220)
    expect(withCorrupt).toBe(230);
    expect(getHeavyAttackComboMultiplier(withCorrupt)).toBe(12);
    expect(getHeavyAttackComboMultiplier(220)).toBe(12);
  });
});

describe("calculateWeaponBuild melee combo", () => {
  it("applies 12× heavy and BR/WW multi at 220 sim combo hits", () => {
    const modsMap = new Map(allMods.map((m) => [m.id, m]));
    const stats = calculateWeaponBuild(
      galatine,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, comboCount: 220 },
    );
    expect(stats.heavyAttackComboMultiplier).toBe(12);
    expect(stats.comboMultiplier).toBe(12);
  });

  it("starts Fragor Prime at 2× heavy from innate 30 combo", () => {
    const fragor = allWeapons.find((w) => w.id === "fragor_prime")!;
    const modsMap = new Map(allMods.map((m) => [m.id, m]));
    const stats = calculateWeaponBuild(
      fragor,
      [],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, comboCount: 0 },
    );
    expect(stats.comboCount).toBe(30);
    expect(stats.heavyAttackComboMultiplier).toBe(2);
  });

  it("applies Blood Rush additively with True Steel using (CM−1) on 12× track", () => {
    const modsMap = new Map(allMods.map((m) => [m.id, m]));
    const bloodRush = allMods.find((m) => m.id === "blood_rush")!;
    const trueSteel = allMods.find((m) => m.id === "true_steel_r3" || m.id === "true_steel")!;
    // Wiki example pattern: base × [1 + TrueSteel + BR×(CM−1)]
    // At 4× combo (60 hits): CM−1 = 3
    const stats = calculateWeaponBuild(
      galatine,
      [
        { modId: bloodRush.id, rank: bloodRush.maxRank, slotIndex: 0 },
        { modId: trueSteel.id, rank: trueSteel.maxRank, slotIndex: 1 },
      ],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, comboCount: 60 },
    );
    expect(stats.comboMultiplier).toBe(4);
    const brBonus = (bloodRush.stats.criticalChance * (bloodRush.maxRank + 1)) / 100;
    const tsBonus = (trueSteel.stats.criticalChance * (trueSteel.maxRank + 1)) / 100;
    const expected =
      galatine.criticalChance * (1 + tsBonus + brBonus * (4 - 1));
    expect(stats.criticalChance).toBeCloseTo(expected, 5);
  });

  it("gives +440% from max Blood Rush alone at 12× combo", () => {
    const modsMap = new Map(allMods.map((m) => [m.id, m]));
    const bloodRush = allMods.find((m) => m.id === "blood_rush")!;
    const stats = calculateWeaponBuild(
      galatine,
      [{ modId: bloodRush.id, rank: bloodRush.maxRank, slotIndex: 0 }],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, comboCount: 220 },
    );
    // base × [1 + 0.4×11] = base × 5.4
    expect(stats.criticalChance).toBeCloseTo(galatine.criticalChance * 5.4, 5);
  });
});
