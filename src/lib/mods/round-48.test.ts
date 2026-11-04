/**
 * Round 48: Jason's in-game answers (in-game beats the wiki) plus wiki.warframe.com checks
 * (fetched 2026-11-04): Energizing Shot on exalted weapons, Tek / Amalgam polarities,
 * Transient Fortitude, Rumblejack crit, Scyotid, Simulor, Claw Shred / Claw Fury, Volatile Quick Return.
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { WEAPON_RADIAL_ATTACKS } from "@/data/weapon-radial-attacks";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import { dropRetiredMods, RETIRED_MODS } from "@/lib/mods/known-mods";
import { modFitsCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { applyAltFireMode, getAltFireModes } from "@/lib/weapons/alt-fire";
import { customWeapons } from "@/data/custom-items";

const weapon = (id: string) => {
  const w = allWeapons.find((x) => x.id === id)!;
  expect(w, id).toBeDefined();
  return w;
};
const fits = (modId: string, weaponId: string) => {
  const w = weapon(weaponId);
  return modEligibleForWeaponSlot(modsMap.get(modId)!, getModCategory(w.category), w.category, "regular", getWeaponModProfile(w));
};
const card = (id: string, rank: number) => getModStatDisplayLines(modsMap.get(id)!, rank).map((l) => l.atRank);

describe("Round 48: Energizing Shot on exalted weapons (wiki patch history, Update 38.6)", () => {
  it("exalted secondaries without the AOE tag can equip it", () => {
    for (const id of ["regulators", "regulators_prime", "dex_pixia", "dex_pixia_prime"]) expect(fits("energizing_shot", id), id).toBe(true);
  });
  it("Glory, Balefire and Noctua stay blocked (AOE), as do other AOE secondaries", () => {
    for (const id of ["glory", "balefire", "balefire_prime", "noctua", "kulstar"]) expect(fits("energizing_shot", id), id).toBe(false);
  });
  it("regular secondaries are unchanged", () => {
    expect(fits("energizing_shot", "lato")).toBe(true);
    expect(fits("energizing_shot", "sonicor")).toBe(true);
  });
});

describe("Round 48: polarities from Jason's Arsenal ('-' = Naramon)", () => {
  it("Tek Collateral is Naramon; the other Tek mods are Madurai", () => {
    expect(modsMap.get("tek_collateral_r3")!.polarity).toBe("naramon");
    for (const id of ["tek_assault_r3", "tek_enhance", "tek_gravity_r3"]) expect(modsMap.get(id)!.polarity, id).toBe("madurai");
  });
  it("Amalgam Furax, Javlok and Argonak are Naramon; the other Amalgam mods are Madurai", () => {
    const amalgam = allMods.filter((m) => m.id.startsWith("amalgam_"));
    expect(amalgam.length).toBe(9);
    const naramon = new Set(["amalgam_furax_body_count", "amalgam_javlok_magazine_warp", "amalgam_argonak_metal_auger"]);
    for (const m of amalgam) expect(m.polarity, m.id).toBe(naramon.has(m.id) ? "naramon" : "madurai");
  });
});

describe("Round 48: values Jason confirmed in game", () => {
  it("Transient Fortitude max rank: +55% Strength, -27.5% Duration (unchanged)", () => {
    expect(card("transient_fortitude", 10)).toEqual(["+55% Ability Strength", "-27.5% Ability Duration"]);
  });
  it("Rumblejack crit chance 13% (wiki Module:Weapons Normal Attack 0.13)", () => {
    expect(weapon("rumblejack").criticalChance).toBe(0.13);
    expect(calculateWeaponBuild(weapon("rumblejack"), [], modsMap).criticalChance).toBeCloseTo(0.13, 10);
  });
  it("Scyotid keeps 24% primary crit and 8% snare crit (wiki Semi attack 0.08)", () => {
    const w = weapon("scyotid");
    expect(w.criticalChance).toBeCloseTo(0.24, 6);
    expect(JSON.stringify(w).toLowerCase()).not.toMatch(/unable to crit|cannot crit|can't crit/);
    const snare = getAltFireModes(w).find((m) => /snare/i.test(m.label ?? ""));
    expect(snare, "snare mode").toBeDefined();
    expect(applyAltFireMode(w, snare!).criticalChance).toBeCloseTo(0.08, 6);
  });
});

describe("Round 48: Simulor main shot keeps its damage", () => {
  it("each shot is the orb explosion: 200 Magnetic (Synoid 240) counted in DPS", () => {
    for (const [id, dmg] of [["simulor", 200], ["synoid_simulor", 240]] as const) {
      const r = calculateWeaponBuild(weapon(id), [], modsMap);
      expect(r.totalDamage, id).toBe(dmg);
      expect(r.elements, id).toEqual([{ type: "magnetic", value: dmg }]);
      expect(r.burstDps, id).toBeGreaterThan(0);
    }
  });
  it("Orb Merging Damage radius is 4 m (Module:Weapons Range 4; page: 'exploding in a 4 meter radius')", () => {
    const merge = WEAPON_RADIAL_ATTACKS.simulor.find((a) => a.name === "Orb Merging Damage")!;
    expect(merge.radius).toBe(4);
    expect(merge.totalDamage).toBe(100);
  });
});

describe("Round 48: Shred (Claws) / Fury (Claws) retired", () => {
  it("are gone from the catalog and drop from saved builds as not real mods", () => {
    for (const id of ["claw_shred", "claw_fury"]) {
      expect(modsMap.has(id), id).toBe(false);
      expect(RETIRED_MODS[id]?.reason, id).toBe("no_source");
    }
    const { dropped } = dropRetiredMods([{ modId: "claw_shred" }, { modId: "claw_fury" }, { modId: "claw_bite" }], modsMap);
    expect(dropped.map((d) => d.modId)).toEqual(["claw_shred", "claw_fury"]);
  });
  it("regular Shred and Fury still don't fit Beast Claws; real claw mods still do", () => {
    const claws = customWeapons.find((w) => w.id === "chesa_claws")!;
    expect(claws).toBeDefined();
    expect(modFitsCompanionWeapon(modsMap.get("shred")!, claws)).toBe(false);
    const fury = allMods.find((m) => m.name === "Fury" && m.category === "melee")!;
    expect(fury).toBeDefined();
    expect(modFitsCompanionWeapon(fury, claws)).toBe(false);
    for (const id of ["claw_bite", "claw_maul", "burning_claws"]) expect(modFitsCompanionWeapon(modsMap.get(id)!, claws), id).toBe(true);
  });
});

describe("Round 48: Volatile Quick Return (Jason's in-game rank table)", () => {
  it("R0-R3: bounces -1..-4, blast radius +0.8/+1.5/+2.3/+3 m, explosion chance 25..100%", () => {
    expect([0, 1, 2, 3].map((r) => card("volatile_quick_return", r))).toEqual([
      ["+25% Explosion Chance", "-1 bounces", "+0.8m Blast Radius"],
      ["+50% Explosion Chance", "-2 bounces", "+1.5m Blast Radius"],
      ["+75% Explosion Chance", "-3 bounces", "+2.3m Blast Radius"],
      ["+100% Explosion Chance", "-4 bounces", "+3m Blast Radius"],
    ]);
  });
  it("stored per-rank values: -1 bounce, 25% explosion chance; cost 2 at R0 (2/3/4/5)", () => {
    const m = modsMap.get("volatile_quick_return")!;
    expect(m.stats.ricochetBounces).toBe(-1);
    expect(m.stats.explosionChance).toBe(25);
    expect(m.drain).toBe(2);
    expect(m.maxRank).toBe(3);
  });
});
