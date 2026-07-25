/**
 * Arch weapons accuracy (B13 Space + B21 Atmosphere + B23 Arbucep cycle).
 * Arbucep default = 1st Attack (Blast); modes 2–6 via applyArbucepAttackMode.
 * Wiki Module:Weapons/data/archwing Space → ARCH_BARE_GOLDENS;
 * Atmosphere / Gravimag overlays → ARCH_ATMOSPHERE_GOLDENS.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { ARCH_ATMOSPHERE_GOLDENS } from "@/lib/calc/arch-atmosphere-goldens";
import { ARCH_BARE_GOLDENS } from "@/lib/calc/arch-bare-goldens";
import { applyGravimagMode, weaponHasGravimagMode } from "@/lib/weapons/weapon-gravimag";
import { getWeaponRadialAttacks } from "@/lib/weapons/weapon-radial-utils";
import type { Mod, Weapon } from "@/lib/types";

const ARCH_CATS = new Set(["archgun", "archmelee"]);

/** Multi-element modes 2–6 remain unmodeled; 1st Attack paper locked in B20. */
const DEFERRED_ARCH_IDS = new Set<string>([]);

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function archPool(): Weapon[] {
  return allWeapons.filter(
    (w) => ARCH_CATS.has(w.category) && !w.isExalted && !DEFERRED_ARCH_IDS.has(w.id),
  );
}

describe("arch weapon inventory (B13)", () => {
  const pool = archPool();

  it("has a non-empty archgun + archmelee pool", () => {
    expect(pool.length).toBeGreaterThanOrEqual(25);
    expect(pool.some((w) => w.category === "archgun")).toBe(true);
    expect(pool.some((w) => w.category === "archmelee")).toBe(true);
  });

  it("every locked-pool arch weapon has damage > 0 and required paper fields", () => {
    for (const w of pool) {
      expect(w.damage, w.id).toBeGreaterThan(0);
      expect(w.criticalChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.criticalMultiplier, w.id).toBeGreaterThan(0);
      expect(w.statusChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.fireRate, w.id).toBeGreaterThan(0);
      expect(w.multishot, w.id).toBeGreaterThan(0);
    }
  });

  it("deferred cycler rows are excluded from goldens", () => {
    for (const id of DEFERRED_ARCH_IDS) {
      expect(ARCH_BARE_GOLDENS.some((g) => g.id === id), id).toBe(false);
      expect(allWeapons.some((w) => w.id === id), `deferred ${id} still in catalog`).toBe(true);
    }
  });
});

describe("arch bare wiki goldens", () => {
  it("locks every non-deferred arch weapon against wiki-matched catalog", () => {
    expect(ARCH_BARE_GOLDENS.length).toBeGreaterThanOrEqual(28);
  });

  it.each(ARCH_BARE_GOLDENS)("$id catalog bare paper", (g) => {
    const w = allWeapons.find((x) => x.id === g.id);
    expect(w, g.id).toBeDefined();
    expect(w!.damage).toBeCloseTo(g.damage, 4);
    expect(w!.criticalChance).toBeCloseTo(g.criticalChance, 4);
    expect(w!.criticalMultiplier).toBeCloseTo(g.criticalMultiplier, 4);
    expect(w!.statusChance).toBeCloseTo(g.statusChance, 4);
    expect(w!.fireRate).toBeCloseTo(g.fireRate, 4);
    expect(w!.multishot).toBeCloseTo(g.multishot, 4);
    for (const key of [
      "impact",
      "puncture",
      "slash",
      "heat",
      "cold",
      "toxin",
      "electricity",
      "radiation",
      "viral",
      "corrosive",
      "blast",
      "gas",
      "magnetic",
    ] as const) {
      const expected = (g as Record<string, number | undefined>)[key];
      if (expected != null) {
        expect(w![key] ?? 0, `${g.id}.${key}`).toBeCloseTo(expected, 4);
      }
    }
  });

  it("Imperator bare calc smoke", () => {
    const w = allWeapons.find((x) => x.id === "imperator")!;
    const stats = calculateWeaponBuild(w, [], modsMap());
    expect(stats.moddedBaseDamage).toBeCloseTo(50, 3);
  });

  it("Cortege / Larkspur keep innate elements on bare calc", () => {
    for (const [id, type] of [
      ["cortege", "heat"],
      ["larkspur", "radiation"],
      ["velocitus", "magnetic"],
    ] as const) {
      const w = allWeapons.find((x) => x.id === id)!;
      const stats = calculateWeaponBuild(w, [], modsMap());
      expect(stats.elements.some((e) => e.type === type), id).toBe(true);
    }
  });
});

describe("arch Atmosphere / Gravimag goldens (B21)", () => {
  it("locks every archgun with atmosphereStats", () => {
    const withAtmos = allWeapons.filter(
      (w) => w.category === "archgun" && !w.isExalted && weaponHasGravimagMode(w),
    );
    expect(withAtmos.length).toBe(ARCH_ATMOSPHERE_GOLDENS.length);
    expect(ARCH_ATMOSPHERE_GOLDENS.length).toBeGreaterThanOrEqual(19);
    for (const w of withAtmos) {
      expect(
        ARCH_ATMOSPHERE_GOLDENS.some((g) => g.id === w.id),
        `missing atmosphere golden for ${w.id}`,
      ).toBe(true);
    }
  });

  it("Corvas Prime has no Gravimag overlay (Atmosphere Charged == Space)", () => {
    const w = allWeapons.find((x) => x.id === "corvas_prime")!;
    expect(weaponHasGravimagMode(w)).toBe(false);
  });

  it.each(ARCH_ATMOSPHERE_GOLDENS)("$id atmosphere overlay + merged Gravimag paper", (g) => {
    const w = allWeapons.find((x) => x.id === g.id);
    expect(w, g.id).toBeDefined();
    expect(weaponHasGravimagMode(w!)).toBe(true);
    const atmos = w!.atmosphereStats!;
    expect(atmos.damage, `${g.id}.atmosphereStats.damage`).toBeCloseTo(g.damage, 4);
    if (g.reloadTime != null) {
      expect(atmos.reloadTime, `${g.id}.reloadTime`).toBeCloseTo(g.reloadTime, 4);
    }
    for (const key of [
      "impact",
      "puncture",
      "slash",
      "heat",
      "cold",
      "toxin",
      "electricity",
      "radiation",
      "viral",
      "corrosive",
      "blast",
      "gas",
      "magnetic",
      "multishot",
      "statusChance",
      "fireRate",
      "criticalChance",
      "criticalMultiplier",
    ] as const) {
      const expected = (g as Record<string, number | undefined>)[key];
      if (expected == null) continue;
      const overlayVal = (atmos as Record<string, number | undefined>)[key];
      if (overlayVal != null) {
        expect(overlayVal, `${g.id}.atmosphereStats.${key}`).toBeCloseTo(expected, 4);
      }
    }
    const merged = applyGravimagMode(w!);
    expect(merged.damage).toBeCloseTo(g.damage, 4);
    expect(merged.criticalChance).toBeCloseTo(g.criticalChance, 4);
    expect(merged.criticalMultiplier).toBeCloseTo(g.criticalMultiplier, 4);
    expect(merged.statusChance).toBeCloseTo(g.statusChance, 4);
    expect(merged.fireRate).toBeCloseTo(g.fireRate, 4);
    expect(merged.multishot).toBeCloseTo(g.multishot, 4);
    for (const key of [
      "impact",
      "puncture",
      "slash",
      "heat",
      "radiation",
      "blast",
      "magnetic",
    ] as const) {
      const expected = (g as Record<string, number | undefined>)[key];
      if (expected != null) {
        expect(merged[key] ?? 0, `${g.id}.merged.${key}`).toBeCloseTo(expected, 4);
      }
    }
  });

  it("Arbucep Gravimag doubles 1st Attack blast and radial", () => {
    const w = allWeapons.find((x) => x.id === "arbucep")!;
    expect(w.damage).toBe(16);
    expect(getWeaponRadialAttacks(w)[0]?.totalDamage).toBeCloseTo(114, 5);
    const atmos = applyGravimagMode(w);
    expect(atmos.damage).toBe(32);
    expect(atmos.blast).toBe(32);
    expect(atmos.reloadTime).toBe(2);
    expect(getWeaponRadialAttacks(atmos)[0]?.totalDamage).toBeCloseTo(228, 5);
    const stats = calculateWeaponBuild(atmos, [], modsMap());
    expect(stats.moddedBaseDamage).toBeCloseTo(32, 3);
  });

  it.each([
    [2, "corrosive"],
    [3, "gas"],
    [4, "magnetic"],
    [5, "radiation"],
    [6, "viral"],
  ] as const)("Arbucep mode %i swaps Space paper to %s", async (mode, element) => {
    const { applyArbucepAttackMode } = await import("@/lib/weapons/weapon-arbucep-mode");
    const w = allWeapons.find((x) => x.id === "arbucep")!;
    const swapped = applyArbucepAttackMode(w, mode);
    expect(swapped.damage).toBe(16);
    expect(swapped[element]).toBe(16);
    expect(swapped.blast ?? 0).toBe(0);
    const radial = getWeaponRadialAttacks(swapped)[0]!;
    expect(radial.totalDamage).toBeCloseTo(114, 5);
    expect(radial[element]).toBeCloseTo(114, 5);
    const stats = calculateWeaponBuild(swapped, [], modsMap());
    expect(stats.elements.some((e) => e.type === element)).toBe(true);
  });

  it("Arbucep mode 4 under Gravimag uses Atmosphere magnitudes", async () => {
    const { applyArbucepAttackMode } = await import("@/lib/weapons/weapon-arbucep-mode");
    const w = applyGravimagMode(allWeapons.find((x) => x.id === "arbucep")!);
    const swapped = applyArbucepAttackMode(w, 4, { atmosphere: true });
    expect(swapped.damage).toBe(32);
    expect(swapped.magnetic).toBe(32);
    expect(swapped.blast ?? 0).toBe(0);
    expect(getWeaponRadialAttacks(swapped)[0]?.magnetic).toBeCloseTo(228, 5);
  });
});
