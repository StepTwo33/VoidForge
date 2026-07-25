import { describe, expect, it } from "vitest";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import {
  calculateTTK,
  ENEMY_TYPES,
  viralHealthMultiplier,
  corrosiveArmorRemaining,
  punctureArmorRemaining,
  scaleArmor,
  simulateDiscreteTTK,
} from "@/lib/calc/ttk";
import type { CalculatedStats } from "@/lib/types";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

function bareStats(partial: Partial<CalculatedStats> & Pick<CalculatedStats, "totalDamage" | "fireRate">): CalculatedStats {
  return {
    totalDamage: partial.totalDamage,
    impact: partial.impact ?? 0,
    puncture: partial.puncture ?? 0,
    slash: partial.slash ?? 0,
    elements: partial.elements ?? [],
    rawElements: [],
    fireRate: partial.fireRate,
    effectiveFireRate: partial.effectiveFireRate ?? partial.fireRate,
    criticalChance: partial.criticalChance ?? 0,
    criticalMultiplier: partial.criticalMultiplier ?? 1,
    statusChance: partial.statusChance ?? 0,
    statusChancePerShot: partial.statusChance ?? 0,
    magazine: partial.magazine ?? 0,
    reloadTime: partial.reloadTime ?? 0,
    multishot: partial.multishot ?? 1,
    burstDps: 0,
    sustainedDps: 0,
    statusProcs: [],
    heavyAttackDamage: 0,
    heavyAttackWindUp: 0,
    comboCount: 0,
    comboDuration: 0,
    heavyAttackEfficiency: 0,
    comboMultiplier: 1,
    heavyAttackComboMultiplier: 1,
    conditionOverloadBonus: 0,
    bloodRushStacks: 0,
    weavingFrameBonus: 0,
    simParams: { ...DEFAULT_SIM_PARAMS },
    galvanizedMultishotOnKill: 0,
    galvanizedDamagePerStatus: 0,
    berserkerFuryBonus: 0,
    weepingWoundsBonus: 0,
    moddedBaseDamage: partial.moddedBaseDamage ?? partial.totalDamage,
  };
}

describe("viralHealthMultiplier", () => {
  it("is 1 with no stacks, 2 at 1 stack, 4.25 at 10", () => {
    expect(viralHealthMultiplier(0)).toBe(1);
    expect(viralHealthMultiplier(1)).toBeCloseTo(2, 10);
    expect(viralHealthMultiplier(10)).toBeCloseTo(4.25, 10);
  });
});

describe("discrete TTK sim", () => {
  it("kills unarmored soft targets in finite time", () => {
    const charger = ENEMY_TYPES.find((e) => e.id === "charger")!;
    const stats = bareStats({
      totalDamage: 50,
      slash: 50,
      fireRate: 5,
      multishot: 1,
      statusChance: 0,
      magazine: 0,
    });
    const r = simulateDiscreteTTK(stats, charger, 10);
    expect(r.discrete).toBe(true);
    expect(r.ttk).toBeGreaterThan(0);
    expect(r.ttk).toBeLessThan(60);
    expect(r.shotsToKill).toBeGreaterThanOrEqual(1);
  });

  it("stacks viral and shortens TTK vs health", () => {
    const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;
    const noViral = bareStats({
      totalDamage: 40,
      impact: 40,
      fireRate: 8,
      statusChance: 0,
      magazine: 45,
      reloadTime: 2,
      moddedBaseDamage: 40,
    });
    const withViral = bareStats({
      totalDamage: 80,
      impact: 40,
      elements: [{ type: "viral", value: 40 }],
      fireRate: 8,
      statusChance: 1, // guaranteed procs
      multishot: 1,
      magazine: 45,
      reloadTime: 2,
      moddedBaseDamage: 40,
    });
    const a = simulateDiscreteTTK(noViral, lancer, 50);
    const b = simulateDiscreteTTK(withViral, lancer, 50);
    expect(b.peakViralStacks!).toBeGreaterThan(0);
    expect(b.ttk).toBeLessThan(a.ttk);
  });

  it("stacks corrosive and reduces effective armor", () => {
    const gunner = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
    const withCorr = bareStats({
      totalDamage: 100,
      puncture: 50,
      elements: [{ type: "corrosive", value: 50 }],
      fireRate: 10,
      statusChance: 1,
      multishot: 1,
      magazine: 100,
      reloadTime: 2,
      moddedBaseDamage: 50,
    });
    const r = simulateDiscreteTTK(withCorr, gunner, 80);
    expect(r.peakCorrosiveStacks!).toBeGreaterThan(1);
    // End armor should be stripped relative to scaled base
    expect(r.scaledArmor).toBeLessThan(scaleArmor(gunner.baseArmor, 80));
    expect(Number.isFinite(r.ttk)).toBe(true);
  });

  it("calculateTTK uses discrete path", () => {
    const charger = ENEMY_TYPES.find((e) => e.id === "charger")!;
    const stats = bareStats({
      totalDamage: 100,
      slash: 100,
      fireRate: 2,
      magazine: 0,
    });
    const r = calculateTTK(stats, charger, 5);
    expect(r.discrete).toBe(true);
  });
});

describe("corrosive remaining vs discrete peak", () => {
  it("10 stacks leave 20% armor", () => {
    expect(corrosiveArmorRemaining(10)).toBeCloseTo(0.2, 10);
  });
});

describe("punctureArmorRemaining (Flensing Spikes)", () => {
  it("removes 20% of original armor per stack; 5 stacks = full strip", () => {
    expect(punctureArmorRemaining(0, 0.2)).toBe(1);
    expect(punctureArmorRemaining(1, 0.2)).toBeCloseTo(0.8, 10);
    expect(punctureArmorRemaining(5, 0.2)).toBeCloseTo(0, 10);
    expect(punctureArmorRemaining(10, 0.2)).toBeCloseTo(0, 10);
  });
});

describe("Flensing Spikes TTK", () => {
  it("shortens TTK vs armored targets when puncture strip is active", () => {
    const gunner = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
    const base = bareStats({
      totalDamage: 80,
      puncture: 80,
      fireRate: 8,
      statusChance: 1,
      multishot: 1,
      magazine: 100,
      reloadTime: 2,
      moddedBaseDamage: 80,
    });
    const flensing = { ...base, punctureArmorStripPerStack: 0.2 };
    const a = simulateDiscreteTTK(base, gunner, 80);
    const b = simulateDiscreteTTK(flensing, gunner, 80);
    expect(Number.isFinite(b.ttk)).toBe(true);
    expect(b.ttk).toBeLessThan(a.ttk);
  });
});

describe("shield → health overflow (Phase 4)", () => {
  it("applies overkill past shields using health-type mods (not a no-op)", () => {
    const crewman = ENEMY_TYPES.find((e) => e.id === "crewman" || e.id === "corpus_crewman");
    const shielded =
      crewman ??
      ENEMY_TYPES.find((e) => e.shieldType !== "none" && e.baseShield > 0);
    expect(shielded).toBeDefined();

    // One huge shot: must break shields and deal health overflow in the same hit
    const stats = bareStats({
      totalDamage: 50_000,
      impact: 50_000,
      fireRate: 1,
      multishot: 1,
      statusChance: 0,
      magazine: 10,
      reloadTime: 2,
      moddedBaseDamage: 50_000,
    });
    const r = simulateDiscreteTTK(stats, shielded!, 1);
    expect(r.discrete).toBe(true);
    expect(r.ttk).toBeLessThan(2);
    expect(r.shotsToKill).toBe(1);
  });
});
