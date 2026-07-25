import { describe, expect, it } from "vitest";
import {
  calculateTTK,
  corrosiveArmorRemaining,
  enemyArmorDamageReduction,
  ENEMY_TYPES,
  viralHealthMultiplier,
  avgCritMult,
  heatArmorRemaining,
} from "@/lib/calc/ttk";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";
import { runDamageSim, simInputsToCalculatedStats } from "@/lib/calc/damage-sim";

const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;

const baseInput = {
  dmgTypes: { impact: 50, puncture: 50, slash: 100 } as Record<string, number>,
  fireRate: 5,
  critChance: 0.3,
  critMulti: 2.2,
  multishot: 1,
  statusChance: 0.3,
  magazine: 30,
  reloadTime: 2,
  statusDamageBonus: 0,
  headshotDamageBonus: 0,
  factionBonuses: {} as Record<string, number>,
  applyHeadshots: false,
};

describe("damage sim Warframe math alignment", () => {
  it("aliases avgCritMult to avgCritMultiplier", () => {
    expect(avgCritMult(1.5, 3)).toBe(avgCritMultiplier(1.5, 3));
    expect(avgCritMult(0.25, 2)).toBeCloseTo(1.25, 10);
  });

  it("uses enemy armor DR (0.9×AR/2700), not Tenno AR/(AR+300)", () => {
    const sim = runDamageSim(
      { ...baseInput, dmgTypes: { puncture: 200 }, statusChance: 0 },
      lancer,
      100,
    )!;
    expect(sim.armorDR).toBeCloseTo(enemyArmorDamageReduction(sim.armor), 10);
    // Classic Tenno formula must NOT match at typical scaled armor
    expect(sim.armorDR).not.toBeCloseTo(sim.armor / (sim.armor + 300), 2);
  });

  it("passes Flensing puncture strip into discrete TTK (shortens armored TTK)", () => {
    const gunner = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
    const input = {
      ...baseInput,
      dmgTypes: { puncture: 200 },
      statusChance: 1,
      fireRate: 8,
      magazine: 100,
    };
    const bare = runDamageSim(input, gunner, 80)!;
    const flensing = runDamageSim(
      { ...input, punctureArmorStripPerStack: 0.2 },
      gunner,
      80,
    )!;
    expect(flensing.ttk).toBeLessThan(bare.ttk);
    expect(flensing.corrosiveStrippedArmor).toBeLessThan(bare.corrosiveStrippedArmor);
  });

  it("applies corrosive strip with −26%/−6% model, not 0.74^stacks", () => {
    const sim = runDamageSim(
      {
        ...baseInput,
        dmgTypes: { corrosive: 200 },
        statusChance: 1,
        multishot: 2,
        fireRate: 10,
      },
      lancer,
      50,
    )!;
    expect(sim.baseArmor).toBeGreaterThan(0);
    const stacks = Math.max(sim.peakCorrosiveStacks, 1);
    const expected =
      sim.baseArmor * corrosiveArmorRemaining(stacks) * heatArmorRemaining(false);
    expect(sim.corrosiveStrippedArmor).toBeCloseTo(expected, 5);

    // Multiplicative 0.74^n is the old/wrong model — remaining armor would be much lower
    const wrongRemaining = sim.baseArmor * Math.pow(0.74, stacks);
    expect(sim.corrosiveStrippedArmor).toBeGreaterThan(wrongRemaining + 1);
  });

  it("viral multiplier matches wiki stacks helper", () => {
    const sim = runDamageSim(
      {
        ...baseInput,
        dmgTypes: { viral: 200 },
        statusChance: 1,
        multishot: 2,
        fireRate: 8,
      },
      lancer,
      30,
    )!;
    expect(sim.viralMult).toBeCloseTo(
      viralHealthMultiplier(sim.peakViralStacks || 0),
      5,
    );
  });

  it("TTK matches calculateTTK for the same inputs (shared discrete engine)", () => {
    const input = {
      ...baseInput,
      dmgTypes: { slash: 80, viral: 40, corrosive: 40 },
      statusChance: 0.5,
      multishot: 1.5,
    };
    const sim = runDamageSim(input, lancer, 80)!;
    const stats = simInputsToCalculatedStats(input, lancer.faction);
    const ttk = calculateTTK(stats, lancer, 80);
    expect(sim.ttk).toBe(ttk.ttk);
    expect(sim.shotsToKill).toBe(ttk.shotsToKill);
    expect(sim.peakViralStacks).toBe(ttk.peakViralStacks);
    expect(sim.peakCorrosiveStacks).toBe(ttk.peakCorrosiveStacks);
  });

  it("300 enemy armor is 10% DR (not 50% Tenno)", () => {
    expect(enemyArmorDamageReduction(300)).toBeCloseTo(0.1, 10);
    expect(300 / (300 + 300)).toBeCloseTo(0.5, 10);
  });
});
