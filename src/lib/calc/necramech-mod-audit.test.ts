/**
 * Phase M10 — Necramech power / survivability apply goldens (wiki max rank).
 */
import { describe, expect, it } from "vitest";
import { necramechs } from "@/data/archwing";
import { allMods } from "@/data/mods";
import { calculateNecramechBuild } from "@/lib/calc/archwing-calculator";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireMech(id: string) {
  const mech = necramechs.find((n) => n.id === id);
  expect(mech, `missing necramech ${id}`).toBeDefined();
  return mech!;
}

function withMod(modId: string) {
  const mech = requireMech("voidrig");
  const mod = requireMod(modId);
  return calculateNecramechBuild(mech, [{ modId, rank: mod.maxRank }], modsMap());
}

describe("necramech power / survivability (wiki max rank, Phase M10)", () => {
  it("Necramech Intensify R5: +30% strength", () => {
    expect(withMod("necramech_intensify").abilityStrength).toBeCloseTo(1.3, 8);
  });

  it("Necramech Continuity R5: +30% duration", () => {
    expect(withMod("necramech_continuity").abilityDuration).toBeCloseTo(1.3, 8);
  });

  it("Necramech Streamline R5: +30% efficiency", () => {
    expect(withMod("necramech_streamline").abilityEfficiency).toBeCloseTo(1.3, 8);
  });

  it("Necramech Stretch R5: +45% range", () => {
    expect(withMod("necramech_stretch").abilityRange).toBeCloseTo(1.45, 8);
  });

  it("Necramech Flow R5: +100% energy", () => {
    const bare = calculateNecramechBuild(requireMech("voidrig"), [], modsMap());
    expect(withMod("necramech_flow").totalEnergy / bare.totalEnergy).toBeCloseTo(2, 5);
  });

  it("Necramech Vitality R5: +100% health", () => {
    const bare = calculateNecramechBuild(requireMech("voidrig"), [], modsMap());
    expect(withMod("necramech_vitality").totalHealth / bare.totalHealth).toBeCloseTo(2, 5);
  });

  it("Necramech Steel Fiber R5: +100% armor", () => {
    const bare = calculateNecramechBuild(requireMech("voidrig"), [], modsMap());
    expect(withMod("necramech_steel_fiber").totalArmor / bare.totalArmor).toBeCloseTo(2, 5);
  });

  it("Necramech Augur / Deflection / Repair: conversion/recharge/heal are panel-only", () => {
    for (const id of ["necramech_augur", "necramech_deflection", "necramech_repair"]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });
});

describe("necramech leftovers (wiki max rank, Phase M14)", () => {
  it("Necramech Redirection R10: +100% shield bonus (Voidrig base shield 0)", () => {
    expect(withMod("necramech_redirection").shieldBonus).toBeCloseTo(1, 5);
  });
});
