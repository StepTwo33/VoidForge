/**
 * Round 21 / Hotfix 44.1.3 (forum topic 1529475): Ammo Efficiency is capped at 75% and
 * "100% AE" sources became Infinite Ammo. Every expected number is worked by hand from the DE notes
 * and the wiki.warframe.com stat tables quoted in each case.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import {
  ammoConsumptionFactor,
  combineInfiniteAmmoUptime,
  effectiveAmmoEfficiency,
  infiniteAmmoUptimeFromChance,
  neverConsumesAmmo,
} from "@/lib/calc/ammo-efficiency";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { allArcanes } from "@/data/arcanes";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const lines = (id: string, rank: number) => getModStatDisplayLines(modsMap.get(id)!, rank).map((l) => l.atRank);

describe("Infinite Ammo model", () => {
  it("AE is capped at 75%: 1 in 4 shots still consumes ammo", () => {
    expect(ammoConsumptionFactor(0.75)).toBeCloseTo(0.25, 10);
    expect(ammoConsumptionFactor(1.02)).toBeCloseTo(0.25, 10); // old Pistoleer +102% no longer reaches 0
    expect(ammoConsumptionFactor(0.6)).toBeCloseTo(0.4, 10);
    expect(effectiveAmmoEfficiency(2)).toBeCloseTo(0.75, 10);
  });

  it("Infinite Ammo is not swallowed by the cap: (1 − 0.75) × (1 − 0.64) = 0.09", () => {
    expect(ammoConsumptionFactor(0.75, 0.64)).toBeCloseTo(0.09, 10);
    expect(effectiveAmmoEfficiency(0.75, 0.64)).toBeCloseTo(0.91, 10);
    expect(neverConsumesAmmo(1)).toBe(true);
    expect(neverConsumesAmmo(0.9999832)).toBe(false);
    expect(ammoConsumptionFactor(0.3, 1)).toBe(0);
  });

  it("chance triggers: uptime = 1 − (1 − p)^(events in the window), at least one event", () => {
    // Brain Storm R0: 10% for 0.5s → 1 event (floored) → 0.1; R2: 30% for 2s → 1 − 0.7² = 0.51;
    // R3: 40% for 2s → 1 − 0.6² = 0.64; Pistoleer R5: 60% for 12s → 1 − 0.4^12.
    expect(infiniteAmmoUptimeFromChance(0.1, 0.5)).toBeCloseTo(0.1, 10);
    expect(infiniteAmmoUptimeFromChance(0.3, 2)).toBeCloseTo(0.51, 10);
    expect(infiniteAmmoUptimeFromChance(0.4, 2)).toBeCloseTo(0.64, 10);
    expect(infiniteAmmoUptimeFromChance(0.6, 12)).toBeCloseTo(1 - Math.pow(0.4, 12), 12);
    expect(infiniteAmmoUptimeFromChance(0, 12)).toBe(0);
    expect(infiniteAmmoUptimeFromChance(1, 2)).toBe(1);
  });

  it("independent sources combine as P(at least one up): 1 − 0.5 × 0.5 = 0.75", () => {
    expect(combineInfiniteAmmoUptime(0.5, 0.5)).toBeCloseTo(0.75, 10);
    expect(combineInfiniteAmmoUptime(undefined, 0.64)).toBeCloseTo(0.64, 10);
  });
});

describe("DE ammo changes on the catalog", () => {
  it("Brain Storm / Skull Shots cards: 10/20/30/40% chance, 0.5/1/2/2 s (wiki rank table)", () => {
    for (const id of ["brain_storm", "skull_shots"]) {
      expect(lines(id, 0)).toEqual(["+10% Chance for Infinite Ammo", "+0.5s Duration"]);
      expect(lines(id, 1)).toEqual(["+20% Chance for Infinite Ammo", "+1s Duration"]);
      expect(lines(id, 2)).toEqual(["+30% Chance for Infinite Ammo", "+2s Duration"]);
      expect(lines(id, 3)).toEqual(["+40% Chance for Infinite Ammo", "+2s Duration"]);
      expect(modsMap.get(id)!.stats).not.toHaveProperty("ammoEfficiency");
    }
  });

  it("Acid Shells: explosion radius 10 m at every rank (was 15 m)", () => {
    const m = modsMap.get("acid_shells")!;
    expect(m.description).toContain("10m radius");
    expect(m.description).not.toContain("15m");
    for (const r of [0, 3, 5]) expect(lines("acid_shells", r)).toContain("+10m Range");
  });

  it("Arcane Pistoleer is Infinite Ammo, not AE, in the arcane catalog", () => {
    const a = allArcanes.find((x) => x.id === "arcane_pistoleer")!;
    expect(a.description).toMatch(/Infinite Ammo/);
    expect(a.description).not.toMatch(/Ammo Efficiency/);
  });

  it("Eternal Logistics reaches the 75% cap (R5 base 12.5 × 6)", () => {
    const amp = allWeapons.find((w) => w.id === "amp_raplak")!;
    const arc = allArcanes.find((x) => x.id === "eternal_logistics")!;
    const full = calculateWeaponBuildWithArcanes(amp, [], new Map(), [arc], undefined, { ...DEFAULT_SIM_PARAMS, arcaneStacks: 1 });
    expect(full.ammoEfficiency).toBeCloseTo(0.75, 10);
    expect(calculateWeaponBuild(amp, [], new Map()).ammoEfficiency ?? 0).toBe(0);
  });
});
