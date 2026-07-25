/**
 * Launcher weapons accuracy (B17) — category=launcher bare paper.
 * Wiki Module:Weapons/data/primary Grenade Impact / Rocket Impact locked in LAUNCHER_BARE_GOLDENS.
 * Most boomsticks are category=primary and locked via B10/B17 primary goldens.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { LAUNCHER_BARE_GOLDENS } from "@/lib/calc/launcher-bare-goldens";
import type { Mod, Weapon } from "@/lib/types";

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function launcherPool(): Weapon[] {
  return allWeapons.filter((w) => w.category === "launcher" && !w.isExalted);
}

describe("launcher weapon inventory (B17)", () => {
  const pool = launcherPool();

  it("locks every category=launcher row", () => {
    expect(pool.length).toBe(LAUNCHER_BARE_GOLDENS.length);
    for (const w of pool) {
      expect(
        LAUNCHER_BARE_GOLDENS.some((g) => g.id === w.id),
        w.id,
      ).toBe(true);
    }
  });

  it("every launcher has damage > 0 and required paper fields", () => {
    for (const w of pool) {
      expect(w.damage, w.id).toBeGreaterThan(0);
      expect(w.criticalChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.criticalMultiplier, w.id).toBeGreaterThan(0);
      expect(w.statusChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.fireRate, w.id).toBeGreaterThan(0);
      expect(w.multishot, w.id).toBeGreaterThan(0);
    }
  });
});

describe("launcher bare wiki goldens", () => {
  it.each(LAUNCHER_BARE_GOLDENS)("$id catalog bare paper", (g) => {
    const w = allWeapons.find((x) => x.id === g.id);
    expect(w, g.id).toBeDefined();
    expect(w!.category).toBe("launcher");
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

  it("Secura Penta / Tenet Envoy radials add explosion (not folded into direct)", () => {
    for (const id of ["secura_penta", "tenet_envoy"] as const) {
      const w = allWeapons.find((x) => x.id === id)!;
      const stats = calculateWeaponBuild(w, [], modsMap());
      expect(stats.radialBurstDps ?? 0, id).toBeGreaterThan(0);
      const main = (stats.radialAttacks ?? []).find((a) => !/incarnon/i.test(a.name));
      expect(main?.includedInDirect, id).toBe(false);
    }
  });
});
