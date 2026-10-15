import { describe, expect, it } from "vitest";
const DOT_TICKS = 7;
import { ENEMY_TYPES, enemyDamageTypeMultiplier } from "@/lib/calc/ttk";
import { runDamageSim } from "@/lib/calc/damage-sim";

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

describe("status DoT steady-state DPS = procs/s × ticks × tick damage", () => {
  it("damage sim Slash: 1.5 procs/s × ½ slash weight × 0.35 × 200 × 1.36 per tick, every tick of every stack", () => {
    const r = runDamageSim(baseInput, lancer, 1)!;
    const pps = 5 * 0.3 * (100 / 200); // 0.75
    const tick = 200 * 0.35 * (1 + 0.3 * 1.2); // 95.2
    const perTickDps = pps * tick * enemyDamageTypeMultiplier(lancer, "slash") * r.viralMult;
    expect(r.slashDotDps / perTickDps).toBeCloseTo(DOT_TICKS, 6);
  });
  it("damage sim Heat/Toxin also count every tick", () => {
    const input = { ...baseInput, dmgTypes: { heat: 100, toxin: 100 } };
    const r = runDamageSim(input, lancer, 1)!;
    const pps = 5 * 0.3 * 0.5;
    const tick = 200 * 0.5 * 1.36;
    const heatOne = pps * tick * enemyDamageTypeMultiplier(lancer, "heat") * (1 - r.armorDR);
    const toxOne = pps * tick * enemyDamageTypeMultiplier(lancer, "toxin") * (1 - r.armorDR);
    expect(r.heatDotDps / heatOne).toBeCloseTo(DOT_TICKS, 6);
    expect(r.toxinDotDps / toxOne).toBeCloseTo(DOT_TICKS, 6);
  });
});
