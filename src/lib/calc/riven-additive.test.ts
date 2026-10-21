/**
 * Riven % stats stack additively with matching mods (wiki Critical Hit, Point Strike,
 * Calculating Bonuses, Reload), riven elements enter at the riven's slot, bottom-up
 * (wiki Riven Mods). Hand-worked expected values on real weapons.
 */
import { describe, expect, it } from "vitest";
import { weaponsMap } from "@/data/weapons";
import { allMods, modsMap } from "@/data/mods";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type CalculatedStats, type SimulationParams } from "@/lib/types";

const byName = new Map(allMods.map((m) => [m.name.toLowerCase(), m]));
type Slot = string | { riven: string };
function slots(list: Slot[]) {
  return list.map((n, i) => {
    if (typeof n !== "string") return { modId: n.riven, modName: "Riven", rank: 0, slotIndex: i, polarity: "madurai", drain: 10 };
    const m = byName.get(n.toLowerCase());
    if (!m) throw new Error("missing mod " + n);
    return { modId: m.id, modName: m.name, rank: m.maxRank, slotIndex: i, polarity: m.polarity, drain: m.drain };
  });
}
function calc(w: string, mods: Slot[], riven?: Record<string, number>, sim: Partial<SimulationParams> = {}) {
  return calculateWeaponBuildWithArcanes(weaponsMap.get(w)!, slots(mods), modsMap, [], undefined, { ...DEFAULT_SIM_PARAMS, ...sim }, undefined, undefined, riven) as CalculatedStats;
}

describe("example builds (riven additive with mods)", () => {
  it("A: Lato + Pistol Gambit, Target Cracker, Hornet Strike; riven +150% CC, +90% CD", () => {
    const s = calc("lato", ["Pistol Gambit", "Target Cracker", "Hornet Strike", { riven: "riven_pistol" }], { criticalChance: 1.5, criticalMultiplier: 0.9 });
    expect(s.criticalChance).toBeCloseTo(0.1 * (1 + 1.2 + 1.5), 9); // 37%
    // Base CD 1.8 is quantized to 1.7973 (wiki Critical Hit, 12-bit code).
    expect(s.criticalMultiplier).toBeCloseTo(1.7973 * (1 + 0.6 + 0.9), 3); // 4.49x
    expect(s.totalDamage).toBeCloseTo(40 * 3.2, 9); // 128
    expect(s.burstDps).toBeCloseTo(1320, -1);
  });

  it("A2: same + riven +120% Damage → 40 × (1 + 2.2 + 1.2) = 176", () => {
    const s = calc("lato", ["Pistol Gambit", "Target Cracker", "Hornet Strike", { riven: "riven_pistol" }], { criticalChance: 1.5, criticalMultiplier: 0.9, damage: 1.2 });
    expect(s.totalDamage).toBeCloseTo(176, 9);
    expect(s.burstDps).toBeCloseTo(1816, -1);
  });

  it("B: Braton + Serration, Split Chamber, Point Strike, Vital Sense, Speed Trigger, Hellfire; riven +150% CC, +165% Dmg, +60% FR", () => {
    const s = calc("braton", ["Serration", "Split Chamber", "Point Strike", "Vital Sense", "Speed Trigger", "Hellfire", { riven: "riven_rifle" }], { criticalChance: 1.5, damage: 1.65, fireRate: 0.6 });
    expect(s.criticalChance).toBeCloseTo(0.12 * (1 + 1.5 + 1.5), 9); // 48%
    expect(s.fireRate).toBeCloseTo(8.75 * (1 + 0.6 + 0.6), 9); // 19.25
    // IPS 24 × 4.3 = 103.2 before quantization; each type rounds to 1/32 of 103.2
    // (3.225): 34.06→35.475, 34.06→35.475, 35.09→35.475 → 106.425.
    expect(s.impact + s.puncture + s.slash).toBeCloseTo(106.425, 9);
    expect(s.burstDps / 16174).toBeCloseTo(1, 2);
  });

  it("C: Skana + True Steel, Pressure Point, Fury, Organ Shatter; riven +180% CC, +120% CD, +55% AS", () => {
    const s = calc("skana", ["True Steel", "Pressure Point", "Fury", "Organ Shatter", { riven: "riven_melee" }], { criticalChance: 1.8, criticalMultiplier: 1.2, fireRate: 0.55 });
    expect(s.criticalChance).toBeCloseTo(0.05 * (1 + 1.2 + 1.8), 9); // 20%
    expect(s.criticalMultiplier).toBeCloseTo(1.5 * (1 + 0.9 + 1.2), 2); // 4.65x
    expect(s.fireRate).toBeCloseTo(0.8333 * (1 + 0.3 + 0.55), 9); // 1.54
    expect(s.burstDps).toBeCloseTo(704, -1);
  });

  it("D: Boar + Point Blank, Shotgun Barrage, Blunderbuss, Ravage, Shotgun Savvy; riven +90% CC/SC/FR", () => {
    const s = calc("boar", ["Point Blank", "Shotgun Barrage", "Blunderbuss", "Ravage", "Shotgun Savvy", { riven: "riven_shotgun" }], { criticalChance: 0.9, statusChance: 0.9, fireRate: 0.9 });
    expect(s.criticalChance).toBeCloseTo(0.1 * (1 + 0.9 + 0.9), 9); // 28%
    expect(s.statusChance).toBeCloseTo(0.075 * (1 + 0.9 + 0.9), 9); // 21%
    expect(s.fireRate).toBeCloseTo(4.1667 * (1 + 0.9 + 0.9), 9); // 11.67
    expect(s.burstDps / 5601).toBeCloseTo(1, 2);
  });
});

describe("riven damage + elements", () => {
  const mods: Slot[] = ["Hornet Strike", "Heated Charge", { riven: "riven_pistol" }];
  it("Lato + Hornet, Heated Charge, riven +100% Dmg +90% Cold: 168 IPS + 302.4 Blast = 470.4", () => {
    const s = calc("lato", mods, { damage: 1, cold: 0.9 });
    expect(s.impact + s.puncture + s.slash).toBeCloseTo(40 * 4.2, 9); // 168
    expect(s.elements).toHaveLength(1);
    expect(s.elements[0].type).toBe("blast");
    // 151.2 heat + 151.2 cold = 302.4 (each quantized to 1/32 of 168 = 5.25 → 152.25 each).
    expect(s.elements[0].value).toBeCloseTo(2 * 152.25, 9);
    expect(s.totalDamage).toBeCloseTo(168 + 304.5, 9);
  });
  it("key order does not matter", () => {
    const a = calc("lato", mods, { damage: 1, cold: 0.9 });
    const b = calc("lato", mods, { cold: 0.9, damage: 1 });
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    const c = calc("braton", ["Serration", "Point Strike", { riven: "riven_rifle" }], { criticalChance: 1, damage: 1, multishot: 0.5 });
    const d = calc("braton", ["Serration", "Point Strike", { riven: "riven_rifle" }], { multishot: 0.5, damage: 1, criticalChance: 1 });
    expect(JSON.stringify(d)).toBe(JSON.stringify(c));
  });
  it("slot order (wiki Riven Mods example): Heat mod before a riven listing Elec then Cold → Blast + Electricity", () => {
    const s = calc("lato", ["Heated Charge", { riven: "riven_pistol" }], { electricity: 0.6, cold: 0.6 });
    expect(s.elements.map((e) => e.type).sort()).toEqual(["blast", "electricity"]);
  });
  it("Heat mod after the riven keeps Magnetic intact", () => {
    const s = calc("lato", [{ riven: "riven_pistol" }, "Heated Charge"], { electricity: 0.6, cold: 0.6 });
    expect(s.elements.map((e) => e.type).sort()).toEqual(["heat", "magnetic"]);
  });
});

describe("interactions", () => {
  it("Blood Rush: riven CC adds in the same bucket (no cross term)", () => {
    const sim = { comboCount: 60 };
    const noRiven = calc("skana", ["True Steel", "Blood Rush", { riven: "riven_melee" }], undefined, sim);
    const withRiven = calc("skana", ["True Steel", "Blood Rush", { riven: "riven_melee" }], { criticalChance: 1.8 }, sim);
    // base × (1 + True Steel + riven + Blood Rush × tier) − base × (1 + True Steel + BR × tier) = base × riven
    expect(withRiven.criticalChance - noRiven.criticalChance).toBeCloseTo(0.05 * 1.8, 9);
    expect(noRiven.criticalChance).toBeGreaterThan(0.05 * 2.2 + 1e-6); // Blood Rush is active
  });
  it("Galvanized Scope stacks: riven CC adds base × r", () => {
    const sim = { applyHeadshots: true, killStacks: 5 };
    const noRiven = calc("braton", ["Galvanized Scope", { riven: "riven_rifle" }], undefined, sim);
    const withRiven = calc("braton", ["Galvanized Scope", { riven: "riven_rifle" }], { criticalChance: 1.5 }, sim);
    expect(noRiven.criticalChance).toBeGreaterThan(0.12 + 1e-6);
    expect(withRiven.criticalChance - noRiven.criticalChance).toBeCloseTo(0.12 * 1.5, 9);
  });
  it("Acuity locks riven multishot too (wiki Multishot)", () => {
    expect(calc("braton", ["Primary Acuity", { riven: "riven_rifle" }], { multishot: 0.9 }).multishot).toBe(1);
  });
  it("magazine and reload add with mods; negative reload uses ÷ (1 + bonus) (wiki Reload)", () => {
    const s = calc("braton", ["Magazine Warp", "Fast Hands", { riven: "riven_rifle" }], { magazine: 0.5, reloadSpeed: 0.5 });
    expect(s.magazine).toBe(Math.round(45 * (1 + 0.3 + 0.5)));
    expect(s.reloadTime).toBeCloseTo(2 / (1 + 0.3 + 0.5), 9);
    expect(calc("braton", [{ riven: "riven_rifle" }], { reloadSpeed: -0.5 }).reloadTime).toBeCloseTo(4, 9);
    expect(calc("braton", ["Tainted Mag"]).reloadTime).toBeCloseTo(2 / (1 - 0.33), 9); // wiki: ~2.85s at −30%
  });
});
