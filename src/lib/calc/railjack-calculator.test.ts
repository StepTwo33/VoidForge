import { describe, expect, it } from "vitest";
import { calculateRailjackBuild } from "@/lib/calc/railjack-calculator";
import { railjackPresets } from "@/data/railjack";
import { allMods } from "@/data/mods";

describe("calculateRailjackBuild", () => {
  it("applies Gunnery 1 +50% to Dorsal/Ventral only (not Nose)", () => {
    const bare = calculateRailjackBuild({
      turretIds: ["sigma_apoc", "sigma_apoc", "sigma_apoc"],
      intrinsics: { gunnery: 0 },
    });
    const gunned = calculateRailjackBuild({
      turretIds: ["sigma_apoc", "sigma_apoc", "sigma_apoc"],
      intrinsics: { gunnery: 1 },
    });
    expect(gunned.turrets[0]!.damage).toBe(bare.turrets[0]!.damage);
    expect(gunned.turrets[1]!.damage).toBe(Math.round((bare.turrets[1]!.damage) * 1.5));
    expect(gunned.turrets[2]!.damage).toBe(Math.round((bare.turrets[2]!.damage) * 1.5));
  });

  it("applies Tactical 6/7/9 battle energy and tactical cooldown paper", () => {
    const base = calculateRailjackBuild({
      battleMods: [{ modId: "phoenix_blaze", rank: 0, slotIndex: 0 }],
      tacticalMods: [{ modId: "void_cloak", rank: 0, slotIndex: 0 }],
      intrinsics: { tactical: 0 },
    });
    const scaled = calculateRailjackBuild({
      battleMods: [{ modId: "phoenix_blaze", rank: 0, slotIndex: 0 }],
      tacticalMods: [{ modId: "void_cloak", rank: 0, slotIndex: 0 }],
      intrinsics: { tactical: 9 },
    });
    expect(scaled.battleAbilities![0]!.energyCost).toBe(
      Math.round((base.battleAbilities![0]!.energyCost ?? 0) * 0.75),
    );
    expect(scaled.tacticalAbilities![0]!.cooldownSec).toBe(
      Math.round((base.tacticalAbilities![0]!.cooldownSec ?? 0) * 0.6),
    );
  });

  it("papers Tunguska Cannon with wiki base and red-crit average shot", () => {
    const stats = calculateRailjackBuild({});
    expect(stats.artillery?.damage).toBe(56500);
    expect(stats.artillery?.critChance).toBe(3);
    expect(stats.artillery?.critMultiplier).toBe(2);
    expect(stats.artillery?.chargeTime).toBe(4);
    // 300% CC × 2.0 CD → expected mult 4 → 226,000 avg shot; DPS = shot / 4s
    expect(stats.artillery?.avgShotDamage).toBe(226000);
    expect(stats.artillery?.estimatedDps).toBe(56500);
  });

  it("applies wiki mid-range absolute plating/shields and engine cruise/boost", () => {
    const stats = calculateRailjackBuild({
      reactorId: "lavan_reactor_mk3",
      shieldId: "lavan_shield_mk3",
      engineId: "lavan_engine_mk3",
      platingId: "lavan_plating_mk3",
    });

    expect(stats.hull).toBe(5250);
    expect(stats.armor).toBe(2419);
    // Default Lavan reactor roll is plating synergy → +25% max shields
    expect(stats.shield).toBe(Math.round(1700 * 1.25));
    expect(stats.shieldRecharge).toBe(22.5);
    expect(stats.shieldRechargeDelayReduction).toBeCloseTo(0.55, 5);
    expect(stats.speed).toBe(150 + 20);
    // SWB = cruise × (1.3 + 0.45 engine boost)
    expect(stats.boostMultiplier).toBeCloseTo(1.75, 5);
    expect(stats.boostSpeed).toBe(Math.round(170 * 1.75));
    expect(stats.fluxCapacity).toBe(273);
    expect(stats.avionicsCapacity).toBe(85);
    expect(stats.abilityDurationBonus).toBeCloseTo(0.5, 5);
    expect(stats.abilityStrengthBonus).toBeCloseTo(0.3, 5);
  });

  it("applies Conic Nozzle only to base 150 before engine flat speed", () => {
    const stats = calculateRailjackBuild({
      engineId: "lavan_engine_mk3",
      integratedMods: [{ modId: "conic_nozzle", rank: 5, slotIndex: 0 }],
    });
    const conic = (4.25 * 6) / 100;
    expect(stats.speed).toBe(Math.round(150 * (1 + conic) + 20));
  });

  it("applies Lavan reactor + Lavan plating shield synergy only for that trait roll", () => {
    const withSynergy = calculateRailjackBuild({
      reactorId: "lavan_reactor_mk3",
      shieldId: "lavan_shield_mk3",
      platingId: "lavan_plating_mk3",
      reactorTraitId: "lavan_reactor_plating_shields",
    });
    const otherRoll = calculateRailjackBuild({
      reactorId: "lavan_reactor_mk3",
      shieldId: "lavan_shield_mk3",
      platingId: "lavan_plating_mk3",
      reactorTraitId: "lavan_reactor_slingshot_damage",
    });
    expect(withSynergy.shield).toBe(Math.round(1700 * 1.25));
    expect(otherRoll.shield).toBe(1700);
    expect(withSynergy.activeHouseTraits?.some((t) => t.id === "lavan_reactor_plating_shields")).toBe(true);
  });

  it("applies shields-depleted boost only when that engine trait roll is selected", () => {
    const boostRoll = calculateRailjackBuild({
      engineId: "vidar_engine_mk3",
      engineTraitId: "vidar_engine_depleted_boost",
      simulation: { shieldsDepleted: true },
    });
    const armorRoll = calculateRailjackBuild({
      engineId: "vidar_engine_mk3",
      engineTraitId: "vidar_engine_intruder_armor",
      simulation: { shieldsDepleted: true },
    });
    expect(boostRoll.boostSpeed).toBeGreaterThan(armorRoll.boostSpeed);
  });

  it("applies shields-depleted house engine/shield traits only when simulated", () => {
    const inactive = calculateRailjackBuild({
      engineId: "lavan_engine_mk3",
      shieldId: "zetki_shield_mk3",
      turretIds: ["sigma_apoc"],
      simulation: { shieldsDepleted: false },
    });
    const active = calculateRailjackBuild({
      engineId: "lavan_engine_mk3",
      shieldId: "zetki_shield_mk3",
      turretIds: ["sigma_apoc"],
      simulation: { shieldsDepleted: true },
    });
    expect(active.speed).toBe(Math.round(150 * 1.2 + 20));
    expect(active.speed).toBeGreaterThan(inactive.speed);
    expect(active.turrets[0]!.damage).toBeGreaterThan(inactive.turrets[0]!.damage);
  });

  it("exposes Vidar reactor avionics capacity for Integrated Plexus cap", () => {
    const stats = calculateRailjackBuild({
      reactorId: "vidar_reactor_mk3",
    });
    expect(stats.avionicsCapacity).toBe(95);
  });

  it("applies The Marrowbone preset Plexus mod ids at max rank", () => {
    const preset = railjackPresets.find((p) => p.id === "the_marrowbone")!;
    for (const id of [...preset.integratedMods, ...preset.battleMods, ...preset.tacticalMods]) {
      expect(allMods.some((m) => m.id === id), `missing mod ${id}`).toBe(true);
    }
    const stats = calculateRailjackBuild({
      reactorId: preset.reactorId,
      shieldId: preset.shieldId,
      engineId: preset.engineId,
      platingId: preset.platingId,
      turretIds: preset.turretIds,
      ordnanceId: preset.ordnanceId,
      integratedMods: preset.integratedMods.map((modId, slotIndex) => {
        const mod = allMods.find((m) => m.id === modId)!;
        return { modId, rank: mod.maxRank, slotIndex };
      }),
      battleMods: preset.battleMods.map((modId, slotIndex) => {
        const mod = allMods.find((m) => m.id === modId)!;
        return { modId, rank: mod.maxRank, slotIndex };
      }),
      tacticalMods: preset.tacticalMods.map((modId, slotIndex) => {
        const mod = allMods.find((m) => m.id === modId)!;
        return { modId, rank: mod.maxRank, slotIndex };
      }),
    });
    expect(stats.artilleryDamageBonus).toBeGreaterThan(0);
    expect(stats.turretDamageBonus).toBeGreaterThan(0);
    expect(stats.turrets).toHaveLength(3);
  });

  it("applies ironclad matrix hull, armor, shield, and recharge bonuses", () => {
    const stats = calculateRailjackBuild({
      platingId: "sigma_plating_mk3",
      integratedMods: [{ modId: "ironclad_matrix", rank: 5, slotIndex: 0 }],
    });

    const baseHull = 2450;
    const baseArmor = 1625;
    expect(stats.hull).toBe(Math.round(baseHull * (1 + 0.225)));
    expect(stats.armor).toBe(Math.round(baseArmor * (1 + 0.225)));
  });

  it("supports three turret hardpoints (Nose/Dorsal/Ventral) and applies turret damage mods", () => {
    const stats = calculateRailjackBuild({
      turretIds: ["zetki_apoc", "vidar_pulsar", "lavan_cryophon"],
      integratedMods: [{ modId: "hyperstrike", rank: 5, slotIndex: 0 }],
    });

    expect(stats.turrets).toHaveLength(3);
    expect(stats.turretDamageBonus).toBeGreaterThan(0);
    expect(stats.turrets[0]!.damage).toBeGreaterThan(748);
    expect(stats.turrets[1]!.estimatedDps).toBeGreaterThan(0);
    expect(stats.turrets[2]!.id).toBe("lavan_cryophon");
  });

  it("migrates legacy single turretId saves", () => {
    const stats = calculateRailjackBuild({
      turretId: "sigma_apoc",
    });

    expect(stats.turrets).toHaveLength(1);
    expect(stats.turrets[0]!.id).toBe("sigma_apoc");
  });

  it("resolves legacy house-ordnance aliases to Sigma Mk III", () => {
    const stats = calculateRailjackBuild({
      ordnanceId: "zetki_tycho_seeker",
    });
    expect(stats.ordnance?.id).toBe("sigma_tycho_seeker_mk3");
  });

  it("applies Crimson Fugue stacks only when simulated", () => {
    const without = calculateRailjackBuild({
      integratedMods: [{ modId: "crimson_fugue", rank: 10, slotIndex: 0 }],
      simulation: { crimsonFugueStacks: 0 },
    });
    const withStacks = calculateRailjackBuild({
      integratedMods: [{ modId: "crimson_fugue", rank: 10, slotIndex: 0 }],
      simulation: { crimsonFugueStacks: 5 },
    });

    expect(without.turretDamageBonus).toBe(0);
    expect(withStacks.turretDamageBonus).toBeGreaterThan(1);
  });

  it("applies Cruising Speed only when active", () => {
    const inactive = calculateRailjackBuild({
      engineId: "lavan_engine_mk3",
      integratedMods: [{ modId: "cruising_speed", rank: 10, slotIndex: 0 }],
      simulation: { cruisingSpeedActive: false },
    });
    const active = calculateRailjackBuild({
      engineId: "lavan_engine_mk3",
      integratedMods: [{ modId: "cruising_speed", rank: 10, slotIndex: 0 }],
      simulation: { cruisingSpeedActive: true },
    });

    expect(active.speed).toBeGreaterThan(inactive.speed);
  });

  it("includes Mk IV components and ordnance", () => {
    const stats = calculateRailjackBuild({
      reactorId: "lavan_reactor_mk4",
      ordnanceId: "zetki_tycho_seeker_mk4",
      turretIds: ["zetki_apoc_mk4"],
    });

    expect(stats.fluxCapacity).toBe(273);
    expect(stats.ordnance?.damage).toBeGreaterThan(3400);
    expect(stats.turrets[0]!.damage).toBeGreaterThan(748);
  });

  it("applies elite crew gunnery bonus and battle abilities", () => {
    const stats = calculateRailjackBuild({
      eliteCrewId: "vena",
      reactorId: "zetki_reactor_mk3",
      battleMods: [{ modId: "phoenix_blaze", rank: 0, slotIndex: 0 }],
      simulation: { activeBattleAbilityId: "phoenix_blaze" },
    });

    expect(stats.crewBonuses?.turretDamageBonus).toBeGreaterThan(0);
    expect(stats.battleAbilities).toHaveLength(1);
    expect(stats.battleAbilities![0]!.name).toBe("Phoenix Blaze");
    expect(stats.abilityTurretDamageBonus).toBeGreaterThan(0.5);
  });
});
