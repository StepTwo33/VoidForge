/**
 * R14-8 Heavy Attack Efficiency, hand-worked from wiki.warframe.com Melee Combo:
 * - "efficiency … increases combo retained after the attack, … a percentage of current
 *   combo" (40% at 160 → 64), "capped at 90%";
 * - spent Initial Combo "regenerates at a rate of 40 combo points per second"
 *   (0% → 3 s to rebuild 7× / 120 combo; 50% → 1.5 s; 90% → 0.3 s).
 * Wind-up is a separate stat and does not change with efficiency.
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { applyHeavyAttackEfficiency } from "@/lib/calc/melee-combo";
import type { CalculatedStats } from "@/lib/types";

const skana = allWeapons.find((w) => w.id === "skana")!;
const build = (ids: string[]) =>
  calculateWeaponBuild(
    skana,
    ids.map((modId, slotIndex) => ({ modId, rank: modsMap.get(modId)!.maxRank, slotIndex })),
    modsMap,
  );
const stub = (over: Partial<CalculatedStats>) =>
  ({
    heavyAttackEfficiency: 0,
    comboCount: 0,
    heavyAttackWindUp: 0.5,
    heavyAttackDamage: 1000,
    heavyAttackInitialCombo: 0,
    heavyAttackSimCombo: 0,
    ...over,
  }) as CalculatedStats;

describe("Heavy Attack Efficiency (wiki Melee Combo)", () => {
  it("wiki example: 40% at 160 combo keeps 64", () => {
    const s = stub({ heavyAttackEfficiency: 0.4, comboCount: 160 });
    applyHeavyAttackEfficiency(s);
    expect(s.heavyAttackComboRetained).toBe(64);
  });
  it("capped at 90%; negative floors at 0", () => {
    const hi = stub({ heavyAttackEfficiency: 1.2, comboCount: 100 });
    applyHeavyAttackEfficiency(hi);
    expect(hi.heavyAttackEfficiencyEffective).toBe(0.9);
    expect(hi.heavyAttackComboRetained).toBe(90);
    const lo = stub({ heavyAttackEfficiency: -0.3, comboCount: 100 });
    applyHeavyAttackEfficiency(lo);
    expect(lo.heavyAttackEfficiencyEffective).toBe(0);
  });
  it("wiki rebuild times for a 120-combo (7×) Initial Combo build: 3 s / 1.5 s / 0.3 s", () => {
    for (const [eff, rebuild] of [[0, 3], [0.5, 1.5], [0.9, 0.3]] as const) {
      const s = stub({ heavyAttackEfficiency: eff, comboCount: 120, heavyAttackInitialCombo: 120 });
      applyHeavyAttackEfficiency(s);
      expect(s.heavyAttackCycleTime! - 0.5).toBeCloseTo(rebuild, 9);
    }
  });
  it("combo from light attacks: no heavy rotation modelled", () => {
    const s = stub({ heavyAttackEfficiency: 0.6, comboCount: 80, heavyAttackSimCombo: 50, heavyAttackInitialCombo: 30 });
    applyHeavyAttackEfficiency(s);
    expect(s.heavyAttackCycleTime).toBeUndefined();
    expect(s.heavyAttackComboRetained).toBe(48);
  });
});

describe("Skana builds (wind-up 0.6 s)", () => {
  it("Corrupt Charge (30 initial) alone: 0.6 + 30/40 = 1.35 s per heavy", () => {
    const s = build(["corrupt_charge"]);
    expect(s.comboCount).toBe(30);
    expect(s.heavyAttackCycleTime).toBeCloseTo(1.35, 9);
    expect(s.heavyAttackRotationDps).toBeCloseTo(s.heavyAttackDamage / 1.35, 6);
  });
  it("+ Reflex Coil 60%: keeps 18, spends 12 → 0.6 + 0.3 = 0.9 s; wind-up unchanged", () => {
    const base = build(["corrupt_charge"]);
    const s = build(["corrupt_charge", "reflex_coil_r3"]);
    expect(s.heavyAttackComboRetained).toBe(18);
    expect(s.heavyAttackCycleTime).toBeCloseTo(0.9, 9);
    expect(s.heavyAttackWindUp).toBe(base.heavyAttackWindUp);
    expect(s.heavyAttackDamage).toBe(base.heavyAttackDamage);
  });
  it("Reflex Coil + Focus Energy = 100% → capped 90%: keeps 27, 0.6 + 3/40 = 0.675 s", () => {
    const s = build(["corrupt_charge", "reflex_coil_r3", "focus_energy_r3"]);
    expect(s.heavyAttackEfficiencyEffective).toBe(0.9);
    expect(s.heavyAttackCycleTime).toBeCloseTo(0.675, 9);
  });
  it("Amalgam Organ Shatter is +60% wind-up speed, not efficiency: 0.6 / 1.6 = 0.375 s", () => {
    const s = build(["amalgam_organ_shatter"]);
    expect(s.heavyAttackWindUp).toBeCloseTo(0.375, 9);
    expect(s.heavyAttackEfficiency).toBe(0);
  });
});
