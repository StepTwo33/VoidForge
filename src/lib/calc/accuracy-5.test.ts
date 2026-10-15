import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { allArcanes } from "@/data/arcanes";
import { necramechs } from "@/data/archwing";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";
import { scaleHealth, scaleShield } from "@/lib/calc/ttk";

// Hand-worked against the wiki (Primary Merciless, Arcane Fury, Enemy Level Scaling, Voidrig, Bonewidow).
describe("damage arcanes stack additively with base damage mods", () => {
  const braton = allWeapons.find((w) => w.id === "braton_prime")!;
  const merciless = allArcanes.find((a) => a.id === "arcane_primary_merciless")!;
  const sim = { ...DEFAULT_SIM_PARAMS, arcaneStacks: 12 };
  it("Braton Prime 35 dmg + Serration (+165%) + Merciless 12 stacks (+360%) = 35 × 6.25", () => {
    const s = calculateWeaponBuildWithArcanes(
      braton, [{ modId: "serration_r3", rank: modsMap.get("serration_r3")!.maxRank, slotIndex: 0 }],
      modsMap, [merciless], undefined, sim,
    );
    expect(s.totalDamage).toBeCloseTo(35 * (1 + 1.65 + 3.6), 6);
  });
  it("without Serration Merciless alone is 35 × 4.6", () => {
    const s = calculateWeaponBuildWithArcanes(braton, [], modsMap, [merciless], undefined, sim);
    expect(s.totalDamage).toBeCloseTo(35 * 4.6, 6);
  });
});

describe("enemy health/shield scaling (wiki Enemy Level Scaling)", () => {
  it("level ≤ 1 is unscaled", () => {
    expect(scaleHealth(100, 1, "Grineer")).toBe(100);
    expect(scaleShield(100, 1, "Corpus")).toBe(100);
  });
  it("below 70 levels difference uses f1: Grineer L31 = 1 + 0.015·30^2.12", () => {
    expect(scaleHealth(100, 31, "Grineer")).toBeCloseTo(100 * (1 + 0.015 * Math.pow(30, 2.12)), 6);
    expect(scaleHealth(100, 31, "Infested")).toBeCloseTo(100 * (1 + 0.0225 * Math.pow(30, 2.12)), 6);
  });
  it("above 80 uses f2: Grineer L150 health = 1 + 10.7332·149^0.72 (≈ ×394.9)", () => {
    expect(scaleHealth(100, 150, "Grineer")).toBeCloseTo(100 * (1 + 10.7332 * Math.pow(149, 0.72)), 6);
    expect(scaleHealth(100, 150, "Grineer")).toBeGreaterThan(39400);
    expect(scaleHealth(100, 150, "Grineer")).toBeLessThan(39600);
  });
  it("Corpus L150: health 13.4165·d^0.55, shields 2·d^0.76", () => {
    expect(scaleHealth(100, 150, "Corpus")).toBeCloseTo(100 * (1 + 13.4165 * Math.pow(149, 0.55)), 6);
    expect(scaleShield(100, 150, "Corpus")).toBeCloseTo(100 * (1 + 2 * Math.pow(149, 0.76)), 6);
  });
  it("level difference 75 is the smoothstep midpoint (s = 0.5)", () => {
    const f1 = 1 + 0.015 * Math.pow(75, 2.12);
    const f2 = 1 + 10.7332 * Math.pow(75, 0.72);
    expect(scaleHealth(1, 76, "Scaldra")).toBeCloseTo(f1 + (f2 - f1) * 0.5, 6);
  });
});

describe("Necramech Codex stats (wiki infobox)", () => {
  it("Voidrig 1400 / 850 / 385 / 175; Bonewidow 1880 / 430 / 480 / 175", () => {
    const v = necramechs.find((n) => n.id === "voidrig")!;
    const b = necramechs.find((n) => n.id === "bonewidow")!;
    expect([v.health, v.shield, v.armor, v.energy]).toEqual([1400, 850, 385, 175]);
    expect([b.health, b.shield, b.armor, b.energy]).toEqual([1880, 430, 480, 175]);
  });
});
