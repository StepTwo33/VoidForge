/**
 * Phase 2c — high-use warframe power / survivability mod goldens (wiki max rank).
 */
import { describe, expect, it } from "vitest";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { allMods } from "@/data/mods";
import { allWarframes } from "@/data/warframes";
import { calculateWarframeBuild } from "@/lib/calc/calculator";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireFrame(id: string) {
  const wf = allWarframes.find((w) => w.id === id);
  expect(wf, `missing warframe ${id}`).toBeDefined();
  return wf!;
}

function withMod(modId: string) {
  const wf = requireFrame("excalibur");
  const mod = requireMod(modId);
  return calculateWarframeBuild(
    wf,
    [{ modId, rank: mod.maxRank, slotIndex: 0 }],
    modsMap(),
  );
}

describe("ability power mods (wiki max rank)", () => {
  it("Intensify R5: +30% strength", () => {
    expect(withMod("intensify_r3").abilityStrength).toBeCloseTo(1.3, 8);
  });

  it("Blind Rage R10: +99% strength, −55% efficiency", () => {
    const stats = withMod("blind_rage");
    expect(stats.abilityStrength).toBeCloseTo(1.99, 8);
    expect(stats.abilityEfficiency).toBeCloseTo(0.45, 8);
  });

  it("Transient Fortitude R10: +55% strength, −27.5% duration", () => {
    const stats = withMod("transient_fortitude");
    expect(stats.abilityStrength).toBeCloseTo(1.55, 8);
    expect(stats.abilityDuration).toBeCloseTo(0.725, 8);
  });

  it("Continuity R5: +30% duration", () => {
    expect(withMod("continuity_r3").abilityDuration).toBeCloseTo(1.3, 8);
  });

  it("Primed Continuity R10: +55% duration", () => {
    expect(withMod("primed_continuity").abilityDuration).toBeCloseTo(1.55, 8);
  });

  it("Narrow Minded R10: +99% duration, −66% range", () => {
    const stats = withMod("narrow_minded");
    expect(stats.abilityDuration).toBeCloseTo(1.99, 8);
    expect(stats.abilityRange).toBeCloseTo(0.34, 8);
  });

  it("Stretch R5: +45% range", () => {
    expect(withMod("stretch_r3").abilityRange).toBeCloseTo(1.45, 8);
  });

  it("Overextended R5: +90% range, −60% strength", () => {
    const stats = withMod("overextended_r5");
    expect(stats.abilityRange).toBeCloseTo(1.9, 8);
    expect(stats.abilityStrength).toBeCloseTo(0.4, 8);
  });

  it("Streamline R5: +30% efficiency", () => {
    expect(withMod("streamline_r3").abilityEfficiency).toBeCloseTo(1.3, 8);
  });

  it("Fleeting Expertise R5: +60% efficiency, −60% duration", () => {
    const stats = withMod("fleeting_expertise_r5");
    expect(stats.abilityEfficiency).toBeCloseTo(1.6, 8);
    expect(stats.abilityDuration).toBeCloseTo(0.4, 8);
  });
});

describe("survivability mods post-U34 (wiki max rank)", () => {
  it("Vitality R10: +100% health on rank-30 pool", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("vitality_r3");
    expect(stats.totalHealth).toBeCloseTo(bare.totalHealth * 2, 5);
  });

  it("Redirection R10: +100% shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("redirection_r3");
    expect(stats.totalShield).toBeCloseTo(bare.totalShield * 2, 5);
  });

  it("Steel Fiber R10: +100% armor", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("steel_fiber_r3");
    expect(stats.totalArmor).toBeCloseTo(bare.totalArmor * 2, 5);
  });

  it("Flow R5: +100% energy", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("flow_r3");
    expect(stats.totalEnergy).toBeCloseTo(bare.totalEnergy * 2, 5);
  });

  it("Primed Flow R10: +185% energy (16.8182% × 11)", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const mod = requireMod("primed_flow");
    const bonus = (mod.stats.energy! * (mod.maxRank + 1)) / 100;
    const stats = withMod("primed_flow");
    expect(stats.totalEnergy).toBeCloseTo(bare.totalEnergy * (1 + bonus), 4);
  });
});

describe("warframe power/survivability remainder (wiki max rank, Phase M10)", () => {
  it("Archon Continuity R10: +55% duration", () => {
    expect(withMod("archon_continuity").abilityDuration).toBeCloseTo(1.55, 8);
  });

  it("Archon Intensify R10: +30% strength (heal conditional is panel)", () => {
    expect(withMod("archon_intensify").abilityStrength).toBeCloseTo(1.3, 5);
  });

  it("Archon Stretch R10: +45% range", () => {
    expect(withMod("archon_stretch").abilityRange).toBeCloseTo(1.45, 5);
  });

  it("Archon Flow R10: +185% energy (matches Primed Flow paper)", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("archon_flow").totalEnergy / bare.totalEnergy).toBeCloseTo(2.85, 5);
  });

  it("Archon Vitality R10: +100% health", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("archon_vitality").totalHealth / bare.totalHealth).toBeCloseTo(2, 5);
  });

  it("Augur Message / Reach / Secrets R5: +24% duration / range / strength", () => {
    expect(withMod("augur_message").abilityDuration).toBeCloseTo(1.24, 8);
    expect(withMod("augur_reach").abilityRange).toBeCloseTo(1.3, 8);
    expect(withMod("augur_secrets").abilityStrength).toBeCloseTo(1.24, 8);
  });

  it("Augur Accord R5: +70% shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("augur_accord").totalShield / bare.totalShield).toBeCloseTo(1.7, 5);
  });

  it("Constitution R3: +28% duration", () => {
    expect(withMod("constitution").abilityDuration).toBeCloseTo(1.28, 8);
  });

  it("Armored Agility R5: +40% armor, +15% sprint", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("armored_agility");
    expect(stats.totalArmor / bare.totalArmor).toBeCloseTo(1.4, 5);
    expect(stats.sprintSpeedBonus).toBeCloseTo(0.15, 8);
  });

  it("Gladiator Aegis R5: +40% armor", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("gladiator_aegis").totalArmor / bare.totalArmor).toBeCloseTo(1.4, 5);
  });

  it("Carnis Carapace R5: +55% armor, +20% health", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("carnis_carapace");
    expect(stats.totalArmor / bare.totalArmor).toBeCloseTo(1.55, 5);
    expect(stats.totalHealth / bare.totalHealth).toBeCloseTo(1.2, 5);
  });

  it("Cunning Drift R5: +15% ability range", () => {
    expect(withMod("aura_cunning_drift").abilityRange).toBeCloseTo(1.15, 8);
  });

  it("Physique R5: +20% health", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("aura_physique").totalHealth / bare.totalHealth).toBeCloseTo(1.2, 5);
  });

  it("Sprint Boost R5: +15% sprint speed", () => {
    expect(withMod("aura_sprint_boost").sprintSpeedBonus).toBeCloseTo(0.15, 8);
  });

  it("Endurance Drift R5: +10% energy, +12% parkour velocity", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("endurance_drift");
    expect(stats.totalEnergy / bare.totalEnergy).toBeCloseTo(1.1, 5);
    expect(stats.parkourVelocityBonus).toBeCloseTo(0.12, 8);
  });

  it("Equilibrium: pickup conversion is panel-only (no max pool inflate)", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("equilibrium");
    expect(stats.totalHealth).toBeCloseTo(bare.totalHealth, 8);
    expect(stats.totalEnergy).toBeCloseTo(bare.totalEnergy, 8);
  });
});

describe("warframe remainder (wiki max rank, Phase M11)", () => {
  it("Primed Redirection R10: +180% shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("primed_redirection").totalShield / bare.totalShield).toBeCloseTo(2.8, 5);
  });

  it("Primed Vigor R10: +75% health and shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("primed_vigor");
    expect(stats.totalHealth / bare.totalHealth).toBeCloseTo(1.75, 5);
    expect(stats.totalShield / bare.totalShield).toBeCloseTo(1.75, 5);
  });

  it("Primed Streamline R14: +55% efficiency", () => {
    expect(withMod("primed_streamline").abilityEfficiency).toBeCloseTo(1.55, 5);
  });

  it("Rush R5: +30% sprint (5% × 6)", () => {
    expect(withMod("rush_r3").sprintSpeedBonus).toBeCloseTo(0.3, 8);
  });

  it("Power Drift R5: +15% strength", () => {
    expect(withMod("power_drift").abilityStrength).toBeCloseTo(1.15, 8);
  });

  it("Speed Drift R5: +12% sprint", () => {
    expect(withMod("speed_drift").sprintSpeedBonus).toBeCloseTo(0.12, 8);
  });

  it("Stand United R5: +25% armor", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("stand_united").totalArmor / bare.totalArmor).toBeCloseTo(1.25, 5);
  });

  it("Gladiator Resolve R5: +40% health", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    expect(withMod("gladiator_resolve").totalHealth / bare.totalHealth).toBeCloseTo(1.4, 5);
  });

  it("Jugulus / Saxum Carapace R5: +55% armor, +20% health", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    for (const id of ["jugulus_carapace", "saxum_carapace"] as const) {
      const stats = withMod(id);
      expect(stats.totalArmor / bare.totalArmor).toBeCloseTo(1.55, 5);
      expect(stats.totalHealth / bare.totalHealth).toBeCloseTo(1.2, 5);
    }
  });

  it("Hastened Steps R3: +20% sprint, −20% shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("hastened_steps");
    expect(stats.sprintSpeedBonus).toBeCloseTo(0.2, 8);
    expect(stats.totalShield / bare.totalShield).toBeCloseTo(0.8, 5);
  });

  it("Controlled Slide R5: +15% strength", () => {
    expect(withMod("controlled_slide").abilityStrength).toBeCloseTo(1.15, 8);
  });

  it("Sprint Speed aura R10: +22% sprint (2% × 11)", () => {
    expect(withMod("aura_sprint_speed").sprintSpeedBonus).toBeCloseTo(0.22, 8);
  });

  it("Heightened Reflexes R3: −20% efficiency (casting is unmodeled)", () => {
    expect(withMod("heightened_reflexes").abilityEfficiency).toBeCloseTo(0.8, 8);
  });

  it("Fast Deflection / Fortitude / Precision Intensify / Preparation / Armored DR suite: panel-only", () => {
    for (const id of [
      "fast_deflection_r3",
      "fortitude",
      "precision_intensify",
      "preparation_r10",
      "armored_acrobatics",
      "armored_evade",
      "armored_recovery",
      "mecha_pulse_r3",
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

describe("warframe remainder (wiki max rank, Phase M12)", () => {
  it("Vigor R5: +50% health and shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("vigor_r5");
    expect(stats.totalHealth / bare.totalHealth).toBeCloseTo(1.5, 5);
    expect(stats.totalShield / bare.totalShield).toBeCloseTo(1.5, 5);
  });

  it("Mobilize R3: +20% parkour velocity", () => {
    expect(withMod("mobilize_r3").parkourVelocityBonus).toBeCloseTo(0.2, 8);
  });

  it("Adrenaline Boost R3: +50% energy, −20% health", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("adrenaline_boost");
    expect(stats.totalEnergy / bare.totalEnergy).toBeCloseTo(1.5, 5);
    expect(stats.totalHealth / bare.totalHealth).toBeCloseTo(0.8, 5);
  });

  it("Adept Surge R3: +10% parkour (flat health penalty is panel)", () => {
    expect(withMod("adept_surge").parkourVelocityBonus).toBeCloseTo(0.1, 8);
  });

  it("Quick Charge / Vigilante Vigor / Quick Thinking / Gladiator Finesse: panel-only", () => {
    for (const id of [
      "quick_charge",
      "vigilante_vigor",
      "quick_thinking",
      "gladiator_finesse",
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

describe("warframe parkour / aura leftovers (wiki max rank, Phase M13)", () => {
  it("Calculated Spring R3: +25% health, −10% sprint", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("calculated_spring");
    expect(stats.totalHealth / bare.totalHealth).toBeCloseTo(1.25, 5);
    expect(stats.sprintSpeedBonus).toBeCloseTo(-0.1, 8);
  });

  it("Rising Skill R3: +10% parkour, −30% shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("rising_skill");
    expect(stats.parkourVelocityBonus).toBeCloseTo(0.1, 8);
    expect(stats.totalShield / bare.totalShield).toBeCloseTo(0.7, 5);
  });

  it("Tempered Bound R3: −10% parkour, +30% shields", () => {
    const bare = calculateWarframeBuild(requireFrame("excalibur"), [], modsMap());
    const stats = withMod("tempered_bound");
    expect(stats.parkourVelocityBonus).toBeCloseTo(-0.1, 8);
    expect(stats.totalShield / bare.totalShield).toBeCloseTo(1.3, 5);
  });

  it("Anti-Flak / No Current Leap: −/+10% parkour", () => {
    expect(withMod("anti_flak_plating").parkourVelocityBonus).toBeCloseTo(-0.1, 8);
    expect(withMod("no_current_leap").parkourVelocityBonus).toBeCloseTo(0.1, 8);
  });

  it("Power Donation R5: −30% strength (host)", () => {
    expect(withMod("power_donation_r5").abilityStrength).toBeCloseTo(0.7, 8);
  });

  it("Brief Respite / Final Act / Overcharged / Strain Consume / Warm Coat / Vital Systems: panel-only", () => {
    for (const id of [
      "brief_respite",
      "final_act",
      "overcharged",
      "strain_consume",
      "warm_coat",
      "vital_systems_bypass",
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
