/**
 * Sentinel weapons accuracy (B14) — sentinel_weapon bare paper.
 * Deconstructor locked to First Attack (Impact) of IPS cycle.
 * Wiki Module:Weapons/data/companion locked in SENTINEL_BARE_GOLDENS.
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { allMods } from "@/data/mods";
import { SENTINEL_BARE_GOLDENS } from "@/lib/calc/sentinel-bare-goldens";
import type { Mod, Weapon } from "@/lib/types";

const DEFERRED_SENTINEL_IDS = new Set<string>([]);

function modsMap(): Map<string, Mod> {
  return new Map(allMods.map((m) => [m.id, m]));
}

function sentinelPool(): Weapon[] {
  return allWeapons.filter(
    (w) =>
      w.category === "sentinel_weapon" &&
      !w.isExalted &&
      !DEFERRED_SENTINEL_IDS.has(w.id),
  );
}

describe("sentinel weapon inventory (B14)", () => {
  const pool = sentinelPool();

  it("has a non-empty sentinel weapon pool", () => {
    expect(pool.length).toBeGreaterThanOrEqual(10);
  });

  it("every locked-pool sentinel has damage > 0 and required paper fields", () => {
    for (const w of pool) {
      expect(w.damage, w.id).toBeGreaterThan(0);
      expect(w.criticalChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.criticalMultiplier, w.id).toBeGreaterThan(0);
      expect(w.statusChance, w.id).toBeGreaterThanOrEqual(0);
      expect(w.fireRate, w.id).toBeGreaterThan(0);
      expect(w.multishot, w.id).toBeGreaterThan(0);
    }
  });

  it("deferred Deconstructor cycling rows are excluded from goldens", () => {
    for (const id of DEFERRED_SENTINEL_IDS) {
      expect(SENTINEL_BARE_GOLDENS.some((g) => g.id === id), id).toBe(false);
      expect(allWeapons.some((w) => w.id === id), `deferred ${id} still in catalog`).toBe(true);
    }
  });
});

describe("sentinel bare wiki goldens", () => {
  it("locks every non-deferred sentinel against wiki-matched catalog", () => {
    expect(SENTINEL_BARE_GOLDENS.length).toBe(12);
  });

  it.each(SENTINEL_BARE_GOLDENS)("$id catalog bare paper", (g) => {
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

  it("Verglas / Artax / Vulklok keep innate elements on bare calc", () => {
    for (const [id, type] of [
      ["verglas", "cold"],
      ["artax", "cold"],
      ["vulklok", "electricity"],
      ["tazicor", "electricity"],
      ["stinger", "toxin"],
    ] as const) {
      const w = allWeapons.find((x) => x.id === id)!;
      const stats = calculateWeaponBuild(w, [], modsMap());
      expect(stats.elements.some((e) => e.type === type), id).toBe(true);
    }
  });
});
