import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { MELEE_ATTACK_DATA } from "@/data/melee-attack-data";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const build = (id: string, mods: string[] = []) =>
  calculateWeaponBuild(
    enrichWeapon(allWeapons.find((x) => x.id === id)!),
    mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
  );

describe("Melee attack data import (Module:Weapons/data/melee; fandom spot-check)", () => {
  it("Skana: heavy 600, wind-up 0.6, FT 0.6, range 2.5, slide 75, slam 240 Impact / heavy slam 360 Blast", () => {
    expect(MELEE_ATTACK_DATA.skana).toMatchObject({
      heavyAttack: 600, windUp: 0.6, followThrough: 0.6, meleeRange: 2.5, slideAttack: 75,
      slam: { damage: 240, elements: { Impact: 240 }, radius: 7, falloffReduction: 0.5 },
      heavySlam: { damage: 360, elements: { Blast: 360 }, radius: 8, falloffReduction: 0.3 },
    });
  });
});

describe("Heavy attacks use the per-weapon heavy base (wiki Melee § Heavy Attack)", () => {
  it("Skana unmodded: 600 × (1 + 0.05 × 0.5) = 615 (was 120 × 1.025 = 123)", () => {
    expect(build("skana").heavyAttackDamage).toBeCloseTo(615, 1);
  });
  it("Dual Skana: 480 heavy, wind-up 0.7 s", () => {
    const s = build("dual_skana");
    expect(s.heavyAttackDamage).toBeCloseTo(480 * 1.025, 1);
    expect(s.heavyAttackWindUp).toBeCloseTo(0.7, 9);
  });
  it("Killing Blow R5: +120% heavy damage (additive) and wind-up 0.6 / 1.6 = 0.375 s", () => {
    const s = build("skana", ["killing_blow"]);
    expect(s.heavyAttackDamage).toBeCloseTo(600 * 2.2 * 1.025, 1);
    expect(s.heavyAttackWindUp).toBeCloseTo(0.375, 9);
    expect(s.burstDps).toBeCloseTo(build("skana").burstDps, 9); // light attacks unaffected
  });
  it("Pressure Point + Killing Blow: 600 × (1 + 1.2 + 1.2) × 1.025 = 2091", () => {
    expect(build("skana", ["pressure_point_r3", "killing_blow"]).heavyAttackDamage).toBeCloseTo(2091, 0);
  });
  it("True Steel x2 on heavies: CC 0.05 × (1 + 1.2 + 1.2) = 0.17 → 600 × 1.085 = 651", () => {
    const s = build("skana", ["true_steel_r3"]);
    expect(s.criticalChance).toBeCloseTo(0.11, 9); // light attacks still +120%
    expect(s.heavyAttackDamage).toBeCloseTo(651, 1);
  });
});

describe("Follow Through multi-target (wiki Melee § Follow Through)", () => {
  const withTargets = (n: number, mods: string[] = []) =>
    calculateWeaponBuild(
      enrichWeapon(allWeapons.find((x) => x.id === "skana")!),
      mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, meleeTargetsHit: n },
    );
  it("Skana FT 0.6, 3 targets: 1 + 0.6 + 0.36 = 1.96× burst", () => {
    const one = withTargets(1);
    const three = withTargets(3);
    expect(one.baseFollowThrough).toBe(0.6);
    expect(three.followThroughTargetFactor).toBeCloseTo(1.96, 9);
    expect(three.burstDps).toBeCloseTo(one.burstDps * 1.96, 6);
  });
  it("default (1 target) unchanged", () => {
    expect(withTargets(1).followThroughTargetFactor).toBe(1);
  });
});
