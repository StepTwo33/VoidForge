/**
 * Phase M3 — DPS aura apply goldens (wiki max rank).
 * Amp auras: paper `damage` line applies when present on a weapon build (loadout
 * linkage uses the same verified line). CP/SD stay enemy-side panel until TTK wiring.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { allWarframes } from "@/data/warframes";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { calculateWeaponBuild, calculateWarframeBuild } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireWeapon(id: string) {
  const weapon = allWeapons.find((w) => w.id === id);
  expect(weapon, `missing weapon ${id}`).toBeDefined();
  return weapon!;
}

function withWeaponMod(weaponId: string, modId: string) {
  const weapon = requireWeapon(weaponId);
  const mod = requireMod(modId);
  return calculateWeaponBuild(
    weapon,
    [{ modId, rank: mod.maxRank, slotIndex: 0 }],
    modsMap(),
    undefined,
    DEFAULT_SIM_PARAMS,
  );
}

describe("weapon damage amp auras (wiki max rank)", () => {
  it("Rifle Amp R5: +27% damage on Braton", () => {
    const weapon = requireWeapon("braton");
    const stats = withWeaponMod("braton", "aura_rifle_amplification");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.27, 8);
  });

  it("Pistol Amp R5: +27% damage on Lex", () => {
    const weapon = requireWeapon("lex");
    const stats = withWeaponMod("lex", "aura_pistol_amplification");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.27, 8);
  });

  it("Shotgun Amp R5: +18% damage on Strun", () => {
    const weapon = requireWeapon("strun");
    const stats = withWeaponMod("strun", "aura_shotgun_amplification");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.18, 8);
  });

  it("Steel Charge R5: +60% damage on Skana", () => {
    const weapon = requireWeapon("skana");
    const stats = withWeaponMod("skana", "aura_steel_charge");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.6, 8);
  });

  it("Dead Eye R5: +52.5% damage on Vectis (sniper)", () => {
    const weapon = requireWeapon("vectis");
    const stats = withWeaponMod("vectis", "dead_eye");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.525, 8);
  });
});

describe("Growing Power / CP / SD (wiki max rank)", () => {
  it("Growing Power: +25% Ability Strength for 6s is conditional (mod_panel duration only)", () => {
    const mod = requireMod("growing_power");
    expect(mod.stats.duration! * (mod.maxRank + 1)).toBeCloseTo(6, 8);
    const beh = VERIFIED_MOD_BEHAVIORS.growing_power;
    expect(beh?.stats.every((s) => s.target === "mod_panel")).toBe(true);

    const wf = allWarframes.find((w) => w.id === "excalibur")!;
    const bare = calculateWarframeBuild(wf, [], modsMap());
    const withGp = calculateWarframeBuild(
      wf,
      [{ modId: "growing_power", rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    // Conditional STR buff is not always-on paper — Ability Strength unchanged.
    expect(withGp.abilityStrength).toBeCloseTo(bare.abilityStrength, 8);
  });

  it("Corrosive Projection R5: −18%/−36% enemy armor (catalog); does not strip warframe armor", () => {
    const mod = requireMod("aura_corrosive_projection");
    expect(mod.stats.armor! * (mod.maxRank + 1)).toBeCloseTo(-18, 8);
    expect(mod.stats.armorReduction! * (mod.maxRank + 1)).toBeCloseTo(36, 8);
    expect(
      VERIFIED_MOD_BEHAVIORS.aura_corrosive_projection?.stats.every((s) => s.target === "mod_panel"),
    ).toBe(true);

    const wf = allWarframes.find((w) => w.id === "excalibur")!;
    const bare = calculateWarframeBuild(wf, [], modsMap());
    const withCp = calculateWarframeBuild(
      wf,
      [{ modId: "aura_corrosive_projection", rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(withCp.totalArmor).toBeCloseTo(bare.totalArmor, 8);
  });

  it("Shield Disruption R5: −18% enemy shields (catalog); does not strip warframe shields", () => {
    const mod = requireMod("aura_shield_disruption");
    expect(mod.stats.shield! * (mod.maxRank + 1)).toBeCloseTo(-18, 8);
    expect(
      VERIFIED_MOD_BEHAVIORS.aura_shield_disruption?.stats.every((s) => s.target === "mod_panel"),
    ).toBe(true);

    const wf = allWarframes.find((w) => w.id === "excalibur")!;
    const bare = calculateWarframeBuild(wf, [], modsMap());
    const withSd = calculateWarframeBuild(
      wf,
      [{ modId: "aura_shield_disruption", rank: mod.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(withSd.totalShield).toBeCloseTo(bare.totalShield, 8);
  });
});
