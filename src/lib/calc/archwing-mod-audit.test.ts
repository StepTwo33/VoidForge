/**
 * Phase M11 — Archwing always-on mod apply goldens (wiki max rank).
 * Host: Odonata (catalog id `odonata`).
 */
import { describe, expect, it } from "vitest";
import { archwings } from "@/data/archwing";
import { allMods } from "@/data/mods";
import { calculateArchwingBuild } from "@/lib/calc/archwing-calculator";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireWing(id: string) {
  const wing = archwings.find((a) => a.id === id);
  expect(wing, `missing archwing ${id}`).toBeDefined();
  return wing!;
}

function withMod(modId: string) {
  const wing = requireWing("odonata");
  const mod = requireMod(modId);
  return calculateArchwingBuild(wing, [{ modId, rank: mod.maxRank }], modsMap());
}

describe("archwing cores (wiki max rank, Phase M11)", () => {
  it("Argon Plating R5: +100% armor", () => {
    const bare = calculateArchwingBuild(requireWing("odonata"), [], modsMap());
    expect(withMod("argon_plating").totalArmor / bare.totalArmor).toBeCloseTo(2, 5);
  });

  it("Auxiliary Power R5: +100% energy", () => {
    const bare = calculateArchwingBuild(requireWing("odonata"), [], modsMap());
    expect(withMod("auxiliary_power").totalEnergy / bare.totalEnergy).toBeCloseTo(2, 5);
  });

  it("Energy Inversion R3: +100% shields", () => {
    const bare = calculateArchwingBuild(requireWing("odonata"), [], modsMap());
    expect(withMod("energy_inversion").totalShield / bare.totalShield).toBeCloseTo(2, 5);
  });

  it("Enhanced Durability R5: +100% health", () => {
    const bare = calculateArchwingBuild(requireWing("odonata"), [], modsMap());
    expect(withMod("enhanced_durability").totalHealth / bare.totalHealth).toBeCloseTo(2, 5);
  });

  it("Efficient Transferral R3: +30% duration", () => {
    expect(withMod("efficient_transferral").abilityDuration).toBeCloseTo(1.3, 8);
  });

  it("Energy Amplifier R5: +60% range", () => {
    expect(withMod("energy_amplifier").abilityRange).toBeCloseTo(1.6, 8);
  });

  it("Morphic Transformer R3 / Primed Morphic R10: +20% / +55% strength", () => {
    expect(withMod("morphic_transformer").abilityStrength).toBeCloseTo(1.2, 8);
    expect(withMod("primed_morphic_transformer").abilityStrength).toBeCloseTo(1.55, 8);
  });

  it("System Reroute R10: +55% efficiency", () => {
    expect(withMod("system_reroute").abilityEfficiency).toBeCloseTo(1.55, 8);
  });

  it("Hyperion Thrusters R10: +27.5% flight speed", () => {
    const bare = calculateArchwingBuild(requireWing("odonata"), [], modsMap());
    expect(withMod("hyperion_thrusters").totalFlightSpeed / bare.totalFlightSpeed).toBeCloseTo(
      1.275,
      5,
    );
  });

  it("Superior Defenses / Kinetic Diversion: recharge/convert are panel-only", () => {
    for (const id of ["superior_defenses", "kinetic_diversion"]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });
});
