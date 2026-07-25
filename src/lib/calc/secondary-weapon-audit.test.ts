/**
 * Secondary weapons accuracy (B11) — non-exalted pistol/secondary bare paper.
 * Radial/dual-mode rows deferred. Wiki Module:Weapons/data/secondary locked in SECONDARY_BARE_GOLDENS.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { SECONDARY_BARE_GOLDENS } from "@/lib/calc/secondary-bare-goldens";
import type { Mod, Weapon } from "@/lib/types";

const SECONDARY_CATS = new Set(["secondary", "pistol", "dual_pistols"]);

/** Remaining dual-mode / charge rows intentionally not wiki-locked (B16 promoted radials). */
const DEFERRED_SECONDARY_IDS = new Set<string>([]);

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function secondaryPool(): Weapon[] {
  return allWeapons.filter((w) => SECONDARY_CATS.has(w.category) && !w.isExalted);
}

describe("secondary weapon inventory (B11)", () => {
  const pool = secondaryPool();

  it("has a non-empty secondary pool excluding exalteds", () => {
    expect(pool.length).toBeGreaterThan(100);
  });

  it("every secondary has damage > 0 and required paper fields", () => {
    for (const w of pool) {
      expect(w.damage, w.id).toBeGreaterThan(0);
      expect(w.criticalChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.criticalMultiplier, w.id).toBeGreaterThan(0);
      expect(w.statusChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.fireRate, w.id).toBeGreaterThan(0);
      expect(w.multishot, w.id).toBeGreaterThan(0);
    }
  });

  it("deferred radial/dual-mode rows are excluded from goldens", () => {
    for (const id of DEFERRED_SECONDARY_IDS) {
      expect(
        SECONDARY_BARE_GOLDENS.some((g) => g.id === id),
        id,
      ).toBe(false);
      expect(
        pool.some((w) => w.id === id),
        `deferred ${id} still in catalog pool`,
      ).toBe(true);
    }
  });
});

describe("secondary bare wiki goldens", () => {
  it("locks every non-deferred secondary against wiki-matched catalog", () => {
    expect(SECONDARY_BARE_GOLDENS.length).toBeGreaterThanOrEqual(145);
  });

  it.each(SECONDARY_BARE_GOLDENS)("$id catalog bare paper", (g) => {
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

  it("Lex + Hornet Strike still scales modded base (smoke)", () => {
    const lex = allWeapons.find((w) => w.id === "lex")!;
    const hornet = allMods.find((m) => m.id === "hornet_strike_r3")!;
    const stats = calculateWeaponBuild(
      lex,
      [{ modId: hornet.id, rank: hornet.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(stats.moddedBaseDamage).toBeCloseTo(lex.damage * 3.2, 3);
  });

  it("Acrid / Gammacor / Detron keep innate elements on bare calc", () => {
    for (const [id, type] of [
      ["acrid", "toxin"],
      ["gammacor", "magnetic"],
      ["detron", "radiation"],
    ] as const) {
      const w = allWeapons.find((x) => x.id === id)!;
      const stats = calculateWeaponBuild(w, [], modsMap());
      expect(stats.elements.some((e) => e.type === type), id).toBe(true);
    }
  });
});
