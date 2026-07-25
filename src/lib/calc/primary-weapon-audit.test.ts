/**
 * Primary weapons accuracy (B10) — non-exalted rifle/shotgun/bow/primary bare paper.
 * Launchers deferred. Wiki Module:Weapons/data/primary locked rows in PRIMARY_BARE_GOLDENS.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { PRIMARY_BARE_GOLDENS } from "@/lib/calc/primary-bare-goldens";
import type { Mod, Weapon } from "@/lib/types";

const PRIMARY_CATS = new Set(["rifle", "shotgun", "bow", "primary"]);

/** Remaining odd / non-builder stubs intentionally not wiki-locked this pass. */
const DEFERRED_PRIMARY_IDS = new Set<string>([]);

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function primaryPool(): Weapon[] {
  return allWeapons.filter((w) => PRIMARY_CATS.has(w.category) && !w.isExalted);
}

describe("primary weapon inventory (B10)", () => {
  const pool = primaryPool();

  it("has a non-empty primary pool excluding exalteds and launchers", () => {
    expect(pool.length).toBeGreaterThan(150);
    expect(pool.every((w) => w.category !== "launcher")).toBe(true);
  });

  it("every primary has damage > 0 and required paper fields", () => {
    for (const w of pool) {
      expect(w.damage, w.id).toBeGreaterThan(0);
      expect(w.criticalChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.criticalMultiplier, w.id).toBeGreaterThan(0);
      expect(w.statusChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.fireRate, w.id).toBeGreaterThan(0);
      expect(w.multishot, w.id).toBeGreaterThan(0);
    }
  });

  it("launchers are out of this suite", () => {
    const launchers = allWeapons.filter((w) => w.category === "launcher" && !w.isExalted);
    expect(launchers.length).toBeGreaterThan(0);
    for (const w of launchers) {
      expect(PRIMARY_BARE_GOLDENS.some((g) => g.id === w.id)).toBe(false);
    }
  });

  it("deferred dual-mode/radial/pellet rows are excluded from goldens", () => {
    for (const id of DEFERRED_PRIMARY_IDS) {
      expect(
        PRIMARY_BARE_GOLDENS.some((g) => g.id === id),
        id,
      ).toBe(false);
    }
  });
});

describe("primary bare wiki goldens", () => {
  it("locks every non-deferred primary against wiki-matched catalog", () => {
    expect(PRIMARY_BARE_GOLDENS.length).toBeGreaterThanOrEqual(191);
  });

  it.each(PRIMARY_BARE_GOLDENS)("$id catalog bare paper", (g) => {
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
      "tau",
    ] as const) {
      const expected = (g as Record<string, number | undefined>)[key];
      if (expected != null) {
        expect(w![key] ?? 0, `${g.id}.${key}`).toBeCloseTo(expected, 4);
      }
    }
  });

  it("Braton + Serration still scales modded base (smoke)", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const serration = allMods.find((m) => m.id === "serration_r3")!;
    const stats = calculateWeaponBuild(
      braton,
      [{ modId: serration.id, rank: serration.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(stats.moddedBaseDamage).toBeCloseTo(24 * 2.65, 3);
  });

  it("Amprex / Alternox / Arca Plasmor / Sirocco keep innate elements on bare calc", () => {
    for (const [id, type] of [
      ["amprex", "electricity"],
      ["alternox", "electricity"],
      ["arca_plasmor", "radiation"],
      ["sirocco", "tau"],
    ] as const) {
      const w = allWeapons.find((x) => x.id === id)!;
      const stats = calculateWeaponBuild(w, [], modsMap());
      expect(stats.elements.some((e) => e.type === type), id).toBe(true);
    }
  });
});
