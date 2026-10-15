import { describe, expect, it } from "vitest";
const DOT_TICKS = 6;
import { ENEMY_TYPES, enemyDamageTypeMultiplier } from "@/lib/calc/ttk";
import { runDamageSim } from "@/lib/calc/damage-sim";
import { dotFirstTickDelay, dotTickCount } from "@/lib/calc/dot-ticks";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";

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

describe("DoT tick count and timing (wiki Damage over Time)", () => {
  it("6 ticks at base 6s for every DoT type", () => {
    for (const t of ["slash", "heat", "toxin", "electricity", "gas"]) expect(dotTickCount(t, 6)).toBe(6);
  });
  it("first tick 1s after proc for Slash/Heat/Toxin, on application for Electricity/Gas", () => {
    expect(["slash", "heat", "toxin"].map(dotFirstTickDelay)).toEqual([1, 1, 1]);
    expect(["electricity", "gas"].map(dotFirstTickDelay)).toEqual([0, 0]);
  });
  it("status duration: +100% → 12s → 12 ticks; 6.5s → Slash 6 (1…6s), Electricity 7 (0…6s)", () => {
    expect(dotTickCount("slash", 12)).toBe(12);
    expect(dotTickCount("electricity", 12)).toBe(12);
    expect(dotTickCount("slash", 6.5)).toBe(6);
    expect(dotTickCount("electricity", 6.5)).toBe(7);
  });
});

describe("charge times (wiki Module:Weapons + Fire Rate)", () => {
  const efr = (id: string) =>
    calculateWeaponBuild(enrichWeapon(allWeapons.find((x) => x.id === id)!), [], modsMap).effectiveFireRate;
  it("Auto-Charge (standard 1/(CT + 1/FR)): Vadarya Prime 0.75s @2.8, Javlok 0.3s @3.33", () => {
    expect(efr("vadarya_prime")).toBeCloseTo(1 / (0.75 + 1 / 2.8), 4); // 0.9032
    expect(efr("javlok")).toBeCloseTo(1 / (0.3 + 1 / 3.3333335), 4); // 1.6667
  });
  it("standard charge: Tenet Ferrox 0.4s @2.67 → 1.290; Prisma Angstrum 0.2s @2 → 1.429", () => {
    expect(efr("tenet_ferrox")).toBeCloseTo(1 / (0.4 + 1 / 2.6667), 3);
    expect(efr("prisma_angstrum")).toBeCloseTo(1 / (0.2 + 0.5), 4);
  });
  it("bow cycle 1/(CT + reload): Proboscis Cernos 0.7+0.6, Nunchasa 0.6+0.6, Epitaph/Prime 0.36+0.6", () => {
    expect(efr("proboscis_cernos")).toBeCloseTo(1 / 1.3, 4);
    expect(efr("nunchasa")).toBeCloseTo(1 / 1.2, 4);
    expect(efr("epitaph")).toBeCloseTo(1 / 0.96, 4);
    expect(efr("epitaph_prime")).toBeCloseTo(1 / 0.96, 4);
  });
});
