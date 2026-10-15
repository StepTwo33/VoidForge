import { describe, expect, it } from "vitest";
import { weaponsMap } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { headCritFactor, headshotMultiplier } from "@/lib/calc/combat-multipliers";
import { runDamageSim } from "@/lib/calc/damage-sim";
import { ENEMY_TYPES } from "@/lib/calc/ttk";
import { DEFAULT_SIM_PARAMS, type ModSlot, type SimulationParams } from "@/lib/types";

// Wiki Enemy Body Parts + Critical Hit § Critical Headshots (checked 2026-10-14):
//   head multi = (3 + 1.5 × weak point bonus) × (1 + headshot multiplier bonus)
//   headcrit tier multi = 1 + tier × (2 × CM − 1)  (Grineer / Infested / Sentient / Anarchs)

describe("headshotMultiplier (hand-worked)", () => {
  it("off → 1; plain head → 3; Murmur → 1.5", () => {
    expect(headshotMultiplier(false, 1, 3.5)).toBe(1);
    expect(headshotMultiplier(true)).toBe(3);
    expect(headshotMultiplier(true, 0, 0, "The Murmur")).toBe(1.5);
  });
  it("Primary Acuity +350% WP: 3 + 1.5 × 3.5 = 8.25", () => {
    expect(headshotMultiplier(true, 0, 3.5)).toBeCloseTo(8.25, 12);
  });
  it("wiki example: Seek + Acuity (4.25 WP), Deadhead + Prowl (+70%) = 15.9375", () => {
    expect(headshotMultiplier(true, 0.7, 4.25, "Grineer")).toBeCloseTo(15.9375, 12);
  });
  it("headcrit factor: Grineer/Infested/Sentient 2; Corpus/Murmur/unknown 1", () => {
    expect(headCritFactor(true, "Grineer")).toBe(2);
    expect(headCritFactor(true, "infested")).toBe(2);
    expect(headCritFactor(true, "Sentient")).toBe(2);
    expect(headCritFactor(true, "Corpus")).toBe(1);
    expect(headCritFactor(true, "The Murmur")).toBe(1);
    expect(headCritFactor(true, undefined)).toBe(1);
    expect(headCritFactor(false, "Grineer")).toBe(1);
  });
});

function calc(id: string, mods: ModSlot[], sim: Partial<SimulationParams>) {
  return calculateWeaponBuildWithArcanes(weaponsMap.get(id)!, mods, modsMap, [], undefined, { ...DEFAULT_SIM_PARAMS, ...sim });
}

describe("weapon DPS with headshots", () => {
  // Lex: 20% CC, 2.0x CM (quantized 256 × 32/4095 = 2.000488).
  const cm = (256 * 32) / 4095;
  const avg = 1 + 0.2 * (cm - 1); // 1.200098
  const avgHeadcrit = 1 + 0.2 * (2 * cm - 1); // 1.600195

  it("no faction: burst ×3 (no headcrit)", () => {
    const body = calc("lex", [], {});
    const head = calc("lex", [], { applyHeadshots: true });
    expect(head.burstDps / body.burstDps).toBeCloseTo(3, 9);
  });
  it("vs Grineer: burst × 3 × 1.600195 / 1.200098 ≈ 4.0002", () => {
    const body = calc("lex", [], { targetFaction: "grineer" });
    const head = calc("lex", [], { targetFaction: "grineer", applyHeadshots: true });
    expect(head.burstDps / body.burstDps).toBeCloseTo((3 * avgHeadcrit) / avg, 9);
    expect((3 * avgHeadcrit) / avg).toBeCloseTo(4.0002, 4);
  });
  it("vs Corpus: burst ×3 (Corpus humanoids cannot be headcrit)", () => {
    const body = calc("lex", [], { targetFaction: "corpus" });
    const head = calc("lex", [], { targetFaction: "corpus", applyHeadshots: true });
    expect(head.burstDps / body.burstDps).toBeCloseTo(3, 9);
  });
  it("Slash DoT tick inherits head multi and headcrit (vs Grineer)", () => {
    const body = calc("lex", [], { targetFaction: "grineer" });
    const head = calc("lex", [], { targetFaction: "grineer", applyHeadshots: true });
    const slash = (s: typeof body) => s.statusProcs.find((p) => p.type === "slash")!.damagePerTick;
    expect(slash(head) / slash(body)).toBeCloseTo((3 * avgHeadcrit) / avg, 9);
  });
  it("Target Acquired (+60% headshot multiplier) multiplies on top: ×1.6", () => {
    const ta = { modId: "target_acquired", rank: modsMap.get("target_acquired")!.maxRank, slotIndex: 0 };
    const head = calc("braton", [], { applyHeadshots: true });
    const withTa = calc("braton", [ta], { applyHeadshots: true });
    expect(withTa.headshotDamageBonus).toBeCloseTo(0.6, 9);
    expect(withTa.burstDps / head.burstDps).toBeCloseTo(1.6, 9);
  });
});

describe("damage simulator uses the same head math", () => {
  const input = {
    dmgTypes: { puncture: 100 } as Record<string, number>,
    fireRate: 2, critChance: 0.5, critMulti: 2, multishot: 1, statusChance: 0,
    magazine: 10, reloadTime: 1, statusDamageBonus: 0, headshotDamageBonus: 0,
    weakPointDamageBonus: 3.5, factionBonuses: {} as Record<string, number>, applyHeadshots: false,
  };
  it("Grineer Lancer: rawPerShot × (3 + 1.5×3.5) × avg(0.5, 4)/avg(0.5, 2) = 8.25 × 2.5/1.5", () => {
    const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;
    const body = runDamageSim(input, lancer, 1)!;
    const head = runDamageSim({ ...input, applyHeadshots: true }, lancer, 1)!;
    expect(head.rawPerShot / body.rawPerShot).toBeCloseTo((8.25 * 2.5) / 1.5, 9);
  });
});
