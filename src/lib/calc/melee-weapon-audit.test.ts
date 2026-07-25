/**
 * Melee weapons accuracy (B12) — non-exalted melee bare paper.
 * Zaw-component stubs (Rabvee) excluded via triggerType; modular zaw_rabvee is SoT.
 * Wiki Module:Weapons/data/melee locked in MELEE_BARE_GOLDENS.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { MELEE_BARE_GOLDENS } from "@/lib/calc/melee-bare-goldens";
import type { Mod, Weapon } from "@/lib/types";

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function meleePool(): Weapon[] {
  return allWeapons.filter(
    (w) =>
      w.category === "melee" &&
      !w.isExalted &&
      w.triggerType !== "Zaw Component",
  );
}

describe("melee weapon inventory (B12)", () => {
  const pool = meleePool();

  it("has a non-empty melee pool excluding exalteds and zaw stubs", () => {
    expect(pool.length).toBeGreaterThan(200);
  });

  it("every locked-pool melee has damage > 0 and required paper fields", () => {
    for (const w of pool) {
      expect(w.damage, w.id).toBeGreaterThan(0);
      expect(w.criticalChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.criticalMultiplier, w.id).toBeGreaterThan(0);
      expect(w.statusChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.fireRate, w.id).toBeGreaterThan(0);
      expect(w.multishot, w.id).toBeGreaterThan(0);
    }
  });

  it("Rabvee zaw stub mirrors modular zaw_rabvee and stays out of melee goldens", () => {
    const stub = allWeapons.find((w) => w.id === "rabvee");
    expect(stub).toBeDefined();
    expect(stub!.triggerType).toBe("Zaw Component");
    expect(stub!.damage).toBeCloseTo(234, 4);
    expect(stub!.impact).toBeCloseTo(140.4, 4);
    expect(stub!.puncture).toBeCloseTo(11.7, 4);
    expect(stub!.slash).toBeCloseTo(81.9, 4);
    expect(stub!.criticalChance).toBeCloseTo(0.18, 4);
    expect(stub!.criticalMultiplier).toBeCloseTo(2, 4);
    expect(stub!.statusChance).toBeCloseTo(0.18, 4);
    expect(MELEE_BARE_GOLDENS.some((g) => g.id === "rabvee")).toBe(false);
    expect(pool.some((w) => w.id === "rabvee")).toBe(false);
  });
});

describe("melee bare wiki goldens", () => {
  it("locks every non-deferred melee against wiki-matched catalog", () => {
    expect(MELEE_BARE_GOLDENS.length).toBeGreaterThanOrEqual(221);
  });

  it.each(MELEE_BARE_GOLDENS)("$id catalog bare paper", (g) => {
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

  it("Skana + Pressure Point still scales modded base (smoke)", () => {
    const skana = allWeapons.find((w) => w.id === "skana")!;
    const pp = allMods.find((m) => m.id === "pressure_point_r3")!;
    const stats = calculateWeaponBuild(
      skana,
      [{ modId: pp.id, rank: pp.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(stats.moddedBaseDamage).toBeCloseTo(skana.damage * 2.2, 3);
  });

  it("Silva & Aegis / Dark Sword keep innate elements on bare calc", () => {
    for (const [id, type] of [
      ["silva_&_aegis", "heat"],
      ["silva_&_aegis_prime", "heat"],
      ["dark_sword", "radiation"],
    ] as const) {
      const w = allWeapons.find((x) => x.id === id)!;
      const stats = calculateWeaponBuild(w, [], modsMap());
      expect(stats.elements.some((e) => e.type === type), id).toBe(true);
    }
  });
});
