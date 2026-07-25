/**
 * Phase M13/M14 — Railjack integrated always-on mod apply goldens (wiki max rank).
 */
import { describe, expect, it } from "vitest";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { calculateRailjackBuild } from "@/lib/calc/railjack-calculator";

describe("railjack integrated cores (wiki max rank, Phase M13)", () => {
  it("Hyperstrike R5: +75% turret damage (no alias double-count)", () => {
    const stats = calculateRailjackBuild({
      turretIds: ["zetki_apoc"],
      integratedMods: [{ modId: "hyperstrike", rank: 5, slotIndex: 0 }],
    });
    expect(stats.turretDamageBonus).toBeCloseTo(0.75, 5);
  });

  it("Predator R5: +50% turret crit chance", () => {
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "predator", rank: 5, slotIndex: 0 }],
    });
    // Catalog 8.333%/rank leaves ~2e-5 residue vs exact wiki +50%
    expect(stats.turretCritBonus).toBeCloseTo(0.5, 3);
  });

  it("Section Density R5: +50% turret crit damage", () => {
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "section_density", rank: 5, slotIndex: 0 }],
    });
    expect(stats.turretCritDmgBonus).toBeCloseTo(0.5, 3);
  });

  it("Warhead R10: +100% ordnance damage (not turret)", () => {
    const stats = calculateRailjackBuild({
      ordnanceId: "zetki_tycho_seeker_mk4",
      integratedMods: [{ modId: "warhead", rank: 10, slotIndex: 0 }],
    });
    expect(stats.ordnanceDamageBonus).toBeCloseTo(1, 3);
    expect(stats.turretDamageBonus).toBeCloseTo(0, 8);
  });

  it("Forward Artillery R10: +100% artillery damage (not turret)", () => {
    const bare = calculateRailjackBuild({});
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "forward_artillery", rank: 10, slotIndex: 0 }],
    });
    expect(stats.artilleryDamageBonus).toBeCloseTo(1, 3);
    expect(stats.turretDamageBonus).toBeCloseTo(0, 8);
    // Catalog residue ≈ +100%; Tunguska avg shot = damage × (1 + 3.0×(2−1)) = ×4
    expect(stats.artillery?.damage).toBe(Math.round(56500 * (1 + stats.artilleryDamageBonus)));
    expect(stats.artillery?.avgShotDamage).toBe((stats.artillery?.damage ?? 0) * 4);
    expect(stats.artillery?.damage).toBeGreaterThan(bare.artillery?.damage ?? 0);
  });

  it("Fortifying/Defensive Fire / Onslaught Matrix: conditional are panel-only", () => {
    for (const id of ["fortifying_fire", "defensive_fire", "onslaught_matrix"]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });
});

describe("railjack remainder cores (wiki max rank, Phase M14)", () => {
  it("Conic Nozzle R5: +25.5% Railjack speed (catalog 4.25×6)", () => {
    const bare = calculateRailjackBuild({});
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "conic_nozzle", rank: 5, slotIndex: 0 }],
    });
    // Wiki: Conic scales base 150 only (no engine here → same as full-speed %)
    expect(stats.speed).toBe(Math.round(bare.baseSpeed * (1 + (4.25 * 6) / 100)));
  });

  it("Ion Burn R5: +45% boost speed", () => {
    const bare = calculateRailjackBuild({});
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "ion_burn", rank: 5, slotIndex: 0 }],
    });
    // Leave mod paper alone — golden only: 150 × (1.3 × 1.45) → 283
    expect(stats.boostSpeed).toBe(Math.round(bare.boostSpeed * 1.45));
  });

  it("Ordnance Velocity R5: +60% ordnance projectile speed", () => {
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "ordnance_velocity", rank: 5, slotIndex: 0 }],
    });
    expect(stats.ordnanceSpeedBonus).toBeCloseTo(0.6, 5);
  });

  it("Overloader R3: +87% munitions capacity", () => {
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "overloader", rank: 3, slotIndex: 0 }],
    });
    expect(stats.munitionsCapacityBonus).toBeCloseTo(0.87, 5);
  });

  it("Turret Velocity R10: +25.3% range, +55% turret projectile speed (not ordnance)", () => {
    const stats = calculateRailjackBuild({
      integratedMods: [{ modId: "turret_velocity", rank: 10, slotIndex: 0 }],
    });
    expect(stats.turretRangeBonus).toBeCloseTo(0.253, 3);
    expect(stats.turretProjectileSpeedBonus).toBeCloseTo(0.55, 5);
    expect(stats.ordnanceSpeedBonus).toBeCloseTo(0, 8);
  });

  it("Raider Matrix / Ripload / Orgone / Waveband / Scourging: panel-only", () => {
    for (const id of [
      "raider_matrix",
      "ripload",
      "orgone_tuning_matrix",
      "waveband_disruptor",
      "scourging_warheads",
      "indomitable_matrix",
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

describe("railjack sim-gated cores (wiki max rank, Phase M16)", () => {
  it("Protective Shots R5: paper 0; sim above 75% shields → +30% turret damage", () => {
    const paper = calculateRailjackBuild({
      integratedMods: [{ modId: "protective_shots", rank: 5, slotIndex: 0 }],
    });
    expect(paper.turretDamageBonus).toBeCloseTo(0, 8);
    const active = calculateRailjackBuild({
      integratedMods: [{ modId: "protective_shots", rank: 5, slotIndex: 0 }],
      simulation: { protectiveShotsActive: true },
    });
    expect(active.turretDamageBonus).toBeCloseTo(0.3, 5);
  });
});
