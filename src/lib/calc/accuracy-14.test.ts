import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { DEFAULT_SIM_PARAMS, type SimulationParams } from "@/lib/types";
import { SNIPER_DATA, sniperComboHitsRequired, sniperComboMultiplier } from "@/data/sniper-zoom";

const build = (id: string, mods: string[] = [], sim: Partial<SimulationParams> = {}) =>
  calculateWeaponBuild(
    enrichWeapon(allWeapons.find((x) => x.id === id)!),
    mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
    undefined,
    { ...DEFAULT_SIM_PARAMS, ...sim },
  );

describe("Sniper Shot Combo Counter (wiki Sniper Rifle, both wikis)", () => {
  it("tiers 1.5/2/2.5/3/3.5×; hits = min × 3^(tier−1) (min 4 → 4/12/36/108/324)", () => {
    expect([0, 1, 2, 3, 4, 5].map(sniperComboMultiplier)).toEqual([1, 1.5, 2, 2.5, 3, 3.5]);
    expect([1, 2, 3, 4, 5].map((t) => sniperComboHitsRequired(4, t))).toEqual([4, 12, 36, 108, 324]);
  });
  // accuracy-15 R7-12: the combo multiplies critical damage only (in-game scope text);
  // crit hits ×combo, non-crits unchanged: avg = combo·A − (combo−1)·(1−CC), A = 1 + CC(CM−1).
  it("Vectis 2× tier: total damage unchanged; burst × (2A − (1−CC))/A", () => {
    const base = build("vectis");
    const c = build("vectis", [], { sniperComboTier: 2 });
    expect(c.totalDamage).toBe(base.totalDamage);
    const cc = base.criticalChance;
    const A = 1 + cc * (base.criticalMultiplier - 1);
    expect(c.burstDps / base.burstDps).toBeCloseTo((2 * A - (1 - cc)) / A, 9);
    expect(build("vectis", [], { sniperComboTier: 0 }).totalDamage).toBe(base.totalDamage);
  });
  it("Rubico / Komorex tier 3 (2.5×): crit-only ratio", () => {
    for (const id of ["rubico", "komorex"]) {
      const b = build(id);
      const cc = b.criticalChance;
      const A = 1 + cc * (b.criticalMultiplier - 1);
      expect(build(id, [], { sniperComboTier: 3 }).burstDps / b.burstDps).toBeCloseTo((2.5 * A - 1.5 * (1 - cc)) / A, 9);
    }
  });
  it("non-sniper ignores combo/zoom params", () => {
    const b = build("braton");
    const c = build("braton", [], { sniperComboTier: 3, sniperZoomLevel: 2 });
    expect(c.totalDamage).toBe(b.totalDamage);
    expect(c.criticalChance).toBe(b.criticalChance);
  });
});

describe("Sniper zoom buffs", () => {
  it("only both-wiki snipers listed", () => {
    expect(Object.keys(SNIPER_DATA).sort()).toEqual([
      "komorex", "lanka", "perigale", "rubico", "rubico_prime", "snipetron", "snipetron_vandal",
      "sporothrix", "vectis", "vectis_prime", "vulkar", "vulkar_wraith",
    ]);
  });
  it("Lanka 8x: flat +50% CC after mods (wiki: 25%×2.5 + 50 = 112.5% with Point Strike)", () => {
    const base = build("lanka", ["point_strike_r3"]);
    const z = build("lanka", ["point_strike_r3"], { sniperZoomLevel: 3 });
    expect(base.criticalChance).toBeCloseTo(0.25 * 2.5, 9);
    expect(z.criticalChance).toBeCloseTo(1.125, 9);
  });
  it("Rubico 6x: +50% CM additive with Vital Sense (+120%): 3.0 × (1 + 1.2 + 0.5) = 8.1", () => {
    const z = build("rubico", ["vital_sense_r3"], { sniperZoomLevel: 2 });
    const base = build("rubico", ["vital_sense_r3"]);
    // base CM is quantized (3.0 → 3.00073…, wiki Critical Hit § quantization)
    expect(base.criticalMultiplier).toBeCloseTo(3 * 2.2, 2);
    expect(z.criticalMultiplier / base.criticalMultiplier).toBeCloseTo(2.7 / 2.2, 9);
  });
  it("Vulkar 8x: +70% headshot damage bonus", () => {
    expect(build("vulkar", [], { sniperZoomLevel: 3 }).headshotDamageBonus).toBeCloseTo(0.7, 9);
    expect(build("vulkar").headshotDamageBonus ?? 0).toBe(0);
  });
});
