/**
 * Round 45 — arcane stacking buckets matched to the wiki.warframe.com worked examples
 * (C1–C7), plus the Overcharge / Surge models.
 */
import { describe, expect, it } from "vitest";
import { allArcanes } from "@/data/arcanes";
import { modsMap } from "@/data/mods";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";
import { DEFAULT_SIM_PARAMS, type ModSlot, type SimulationParams } from "@/lib/types";

const W = new Map(getEffectiveWeapons().map((w) => [w.id, w]));
const weapon = (id: string) => W.get(id)!;
const arc = (id: string) => allArcanes.find((a) => a.id === id)!;
const slots = (ids: string[]): ModSlot[] =>
  ids.map((id, i) => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i }) as ModSlot);
const sim = (p: Partial<SimulationParams> = {}): SimulationParams => ({ ...DEFAULT_SIM_PARAMS, ...p });
const build = (wid: string, mods: string[], arcanes: string[], p: Partial<SimulationParams> = {}) =>
  calculateWeaponBuildWithArcanes(weapon(wid), slots(mods), modsMap, arcanes.map(arc), undefined, sim(p));

describe("C1 — fire-rate arcanes add into the fire-rate mod sum", () => {
  it("wiki Arcane Acceleration: Braton 8.75 × (1 + 60% Speed Trigger + 90%) = 21.875", () => {
    const s = build("braton", ["speed_trigger_r3"], ["arcane_acceleration"], { arcaneStacks: 1 });
    expect(weapon("braton").fireRate).toBeCloseTo(8.75, 6);
    expect(s.fireRate).toBeCloseTo(21.875, 3);
    expect(s.fireRateBonus).toBeCloseTo(1.5, 6);
  });

  it("wiki Arcane Velocity: Lato 4.5 × (1 + 72% Gunslinger + 120%) = 13.14", () => {
    const s = build("lato", ["gunslinger_r3"], ["arcane_velocity"], { arcaneStacks: 1 });
    expect(s.fireRate).toBeCloseTo(13.14, 3);
  });

  it("wiki Arcane Strike: attack speed adds with Fury (base × (1 + 30% + 60%))", () => {
    const base = weapon("nikana_prime").fireRate;
    const s = build("nikana_prime", ["fury_r3"], ["arcane_strike"], { arcaneStacks: 1 });
    const bare = build("nikana_prime", ["fury_r3"], []);
    expect(bare.fireRate).toBeCloseTo(base * 1.3, 4);
    expect(s.fireRate).toBeCloseTo(base * 1.9, 4);
  });
});

describe("C2 — reload arcanes add into the reload-speed sum", () => {
  it("wiki Fractalized Reset: Braton 2 s / (1 + 30% Fast Hands + 240%) = 0.541 s", () => {
    const s = build("braton", ["fast_hands_r3"], ["fractalized_reset"], { arcaneStacks: 1 });
    expect(s.reloadTime).toBeCloseTo(2 / 3.7, 4);
    expect(s.reloadTime).toBeCloseTo(0.541, 3);
    expect(s.reloadSpeedBonus).toBeCloseTo(2.7, 6);
  });

  it("wiki Secondary Merciless: Lato 1 s / (1 + 48% Quickdraw + 30%) = 0.562 s", () => {
    const s = build("lato", ["quickdraw_r3"], ["arcane_secondary_merciless"], { arcaneStacks: 12 });
    expect(s.reloadTime).toBeCloseTo(0.562, 3);
  });
});

describe("C3 — Secondary Shiver adds to Hornet Strike", () => {
  it("wiki: Lato + Hornet Strike + 10 Cold stacks → 1 + 2.2 + 4.5 = ×7.7", () => {
    const bare = calculateWeaponBuild(weapon("lato"), [], modsMap);
    const s = build("lato", ["hornet_strike_r3"], ["secondary_shiver"], { arcaneStacks: 10 });
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage * 7.7, 3);
  });

  it("wiki exception list: multiplicative on Epitaph etc. → (1 + 2.2) × (1 + 4.5)", () => {
    const bare = calculateWeaponBuild(weapon("epitaph"), [], modsMap);
    const s = build("epitaph", ["hornet_strike_r3"], ["secondary_shiver"], { arcaneStacks: 10 });
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage * 3.2 * 5.5, 2);
  });
});

describe("C4 — Theorem Demulcent joins the paired Residual's element", () => {
  it("wiki: base × (1 + Serration) × (1 + Hellfire 90% + 180%) with Residual Boils (Heat)", () => {
    const braton = weapon("braton");
    const modsOnly = build("braton", ["serration_r3", "hellfire_r3"], []);
    const s = build("braton", ["serration_r3", "hellfire_r3"], ["theorem_demulcent", "residual_boils"], {
      arcaneStacks: 15,
    });
    // Demulcent joins the Heat bucket: + base × 2.65 × 1.8 (≈ ×9.81 of base in total; our
    // Hellfire part carries the in-game 1/16 quantization, the arcane part does not).
    const add = braton.damage * 2.65 * 1.8;
    expect(s.elements).toHaveLength(1);
    expect(s.elements[0].type).toBe("heat");
    expect(s.elements[0].value).toBeCloseTo(modsOnly.elements[0].value + add, 4);
    expect(s.totalDamage).toBeCloseTo(modsOnly.totalDamage + add, 4);
    // Unquantized wiki form: 24 × 2.65 × (1 + 0.9 + 1.8) = 24 × 9.805.
    expect(2.65 * (1 + 0.9 + 1.8)).toBeCloseTo(9.805, 6);
  });

  it("wiki Battacor: Cryo Rounds Cold + Residual Viremia Toxin combine into Viral", () => {
    const bat = weapon("battacor");
    const modsOnly = build("battacor", ["serration_r3", "cryo_rounds_r3"], []);
    const s = build("battacor", ["serration_r3", "cryo_rounds_r3"], ["theorem_demulcent", "residual_viremia"], {
      arcaneStacks: 15,
    });
    const cold = modsOnly.elements.find((e) => e.type === "cold")!.value;
    // wiki: 66 × (1 + 1.65) × (0.9 Cryo + 1.8) as Viral; innate Magnetic stays separate.
    expect(s.elements.find((e) => e.type === "viral")?.value).toBeCloseTo(cold + bat.damage * 2.65 * 1.8, 4);
    expect(s.elements.some((e) => e.type === "toxin" || e.type === "cold")).toBe(false);
    expect(s.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      modsOnly.elements.find((e) => e.type === "magnetic")!.value,
      6,
    );
  });

  it("no Residual on the weapon → no zone → no bonus", () => {
    const bare = build("braton", ["serration_r3"], []);
    const s = build("braton", ["serration_r3"], ["theorem_demulcent"], { arcaneStacks: 15 });
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage, 6);
  });
});

describe("C5 — Melee Animosity CC is base-multiplicative (additive with True Steel)", () => {
  it("heavy CC = base × (1 + 1.2 True Steel + 4.2)", () => {
    const np = weapon("nikana_prime");
    const bare = build("nikana_prime", ["true_steel_r3"], []);
    const s = build("nikana_prime", ["true_steel_r3"], ["arcane_melee_animosity"], { arcaneStacks: 10 });
    expect(bare.criticalChance).toBeCloseTo(np.criticalChance * 2.2, 5);
    const ratio =
      avgCritMultiplier(np.criticalChance * 6.4, bare.criticalMultiplier) /
      avgCritMultiplier(bare.criticalChance, bare.criticalMultiplier);
    expect(s.heavyAttackDamage).toBeCloseTo(bare.heavyAttackDamage * ratio, 3);
    expect(s.criticalChance).toBeCloseTo(bare.criticalChance, 6);
  });
});

describe("C6 — Melee Assimilation heavy damage adds to Pressure Point", () => {
  it("heavy × (1 + 1.2 + 1.5) / (1 + 1.2), not × 2.5", () => {
    const bare = build("nikana_prime", ["pressure_point_r3"], []);
    const s = build("nikana_prime", ["pressure_point_r3"], ["melee_assimilation"], { arcaneStacks: 1 });
    expect(s.heavyAttackDamage).toBeCloseTo((bare.heavyAttackDamage * 3.7) / 2.2, 3);
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage, 6);
  });
});

describe("C7 — Eternal Eradicate + Virtuos Fury share one additive amp pool", () => {
  it("wiki: 1 + 0.6 + 0.3 = ×1.9 (not 1.6 × 1.3 = ×2.08)", () => {
    const bare = build("amp_raplak", [], []);
    const one = build("amp_raplak", [], ["eternal_eradicate"], { arcaneStacks: 1 });
    const both = build("amp_raplak", [], ["eternal_eradicate", "virtuos_fury"], { arcaneStacks: 1 });
    expect(one.totalDamage).toBeCloseTo(bare.totalDamage * 1.6, 3);
    expect(both.totalDamage).toBeCloseTo(bare.totalDamage * 1.9, 3);
  });
});
