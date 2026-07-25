/**
 * Phase M12 — companion body survivability / utility apply goldens (wiki max rank).
 * Host: Carrier sentinel.
 */
import { describe, expect, it } from "vitest";
import { allCompanions } from "@/data/companions";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { allMods } from "@/data/mods";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireCompanion(id: string) {
  const c = allCompanions.find((x) => x.id === id);
  expect(c, `missing companion ${id}`).toBeDefined();
  return c!;
}

function withMod(modId: string) {
  const companion = requireCompanion("carrier");
  const mod = requireMod(modId);
  return calculateCompanionBuild(companion, [{ modId, rank: mod.maxRank }], modsMap());
}

describe("companion survivability (wiki max rank, Phase M12)", () => {
  it("Calculated Redirection R10: +250% shields", () => {
    const bare = calculateCompanionBuild(requireCompanion("carrier"), [], modsMap());
    expect(withMod("calculated_redirection").totalShield / bare.totalShield).toBeCloseTo(3.5, 5);
  });

  it("Enhanced Vitality R10: +250% health", () => {
    const bare = calculateCompanionBuild(requireCompanion("carrier"), [], modsMap());
    expect(withMod("enhanced_vitality").totalHealth / bare.totalHealth).toBeCloseTo(3.5, 5);
  });

  it("Metal Fiber R10: +250% armor", () => {
    const bare = calculateCompanionBuild(requireCompanion("carrier"), [], modsMap());
    expect(withMod("metal_fiber").totalArmor / bare.totalArmor).toBeCloseTo(3.5, 5);
  });

  it("Loyal / Prosperous / Resourceful Retriever: pickup double chances", () => {
    expect(withMod("loyal_retriever").pickupDoubleChance).toBeCloseTo(0.13, 5);
    expect(withMod("prosperous_retriever").creditPickupDoubleChance).toBeCloseTo(0.18, 5);
    expect(withMod("resourceful_retriever").resourcePickupDoubleChance).toBeCloseTo(0.18, 5);
  });

  it("Helminth Ferocity R5: +120% finisher damage", () => {
    expect(withMod("helminth_ferocity").finisherDamageBonus).toBeCloseTo(1.2, 8);
  });

  it("Accelerated/Hastened Deflection, Link suite, Vicious Bond: panel-only", () => {
    for (const id of [
      "accelerated_deflection",
      "hastened_deflection",
      "link_fiber",
      "link_redirection",
      "link_vitality",
      "vicious_bond",
    ]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });

  it("Medi-Ray / Protect / Sacrifice precepts: panel-only (no pool inflate)", () => {
    for (const id of ["medi_ray", "protect", "sacrifice"]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });
});

describe("companion precept leftovers (wiki max rank, Phase M16)", () => {
  it("Ferocity / Manifold / Shelter / Synth Deconstruct / Transfusion: panel-only", () => {
    for (const id of [
      "crescent_charge",
      "detect_vulnerability",
      "ferocity",
      "magnetic_strike",
      "manifold_bond",
      "shelter",
      "synth_deconstruct",
      "transfusion",
    ]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });
});
