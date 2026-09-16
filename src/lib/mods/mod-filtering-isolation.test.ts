import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { isAllowlistedRailjackPlexusMod } from "@/lib/mods/railjack-plexus-mods";
import {
  isShotgunOnlyMod,
  modEligibleForWeaponSlot,
} from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

const modsById = new Map(allMods.map((m) => [m.id, m]));

function primaryEligible(weaponId: string, modId: string): boolean {
  const weapon = allWeapons.find((w) => w.id === weaponId)!;
  const mod = modsById.get(modId)!;
  return modEligibleForWeaponSlot(
    mod,
    "primary",
    weapon.category,
    "regular",
    getWeaponModProfile(weapon),
  );
}

function secondaryEligible(weaponId: string, modId: string): boolean {
  const weapon = allWeapons.find((w) => w.id === weaponId)!;
  const mod = modsById.get(modId)!;
  return modEligibleForWeaponSlot(
    mod,
    "secondary",
    weapon.category,
    "regular",
    getWeaponModProfile(weapon),
  );
}

function meleeEligible(weaponId: string, modId: string): boolean {
  const weapon = allWeapons.find((w) => w.id === weaponId)!;
  const mod = modsById.get(modId)!;
  return modEligibleForWeaponSlot(
    mod,
    "melee",
    weapon.category,
    "regular",
    getWeaponModProfile(weapon),
  );
}

describe("cross-builder mod isolation", () => {
  it("Galvanized Aptitude is Vazarin", () => {
    expect(modsById.get("galvanized_aptitude")?.polarity).toBe("vazarin");
  });

  it("rifle primaries reject shotgun-only, railjack, companion, and warframe mods", () => {
    const rifle = "acceltra_prime";
    const denied = [
      "accelerated_blast_r3",
      "blunderbuss_r3",
      "hells_chamber",
      "point_blank_r3",
      "battle_forge",
      "blackout_pulse",
      "assassin_posture",
      "intensify_r3",
      "steel_fiber_r3",
    ];
    for (const id of denied) {
      if (!modsById.has(id)) continue;
      expect(primaryEligible(rifle, id), id).toBe(false);
    }
    expect(primaryEligible(rifle, "serration_r3")).toBe(true);
    expect(primaryEligible(rifle, "galvanized_aptitude")).toBe(true);
    expect(primaryEligible(rifle, "galvanized_savvy")).toBe(false);
  });

  it("shotguns accept shotgun mods and reject rifle Serration + railjack", () => {
    expect(primaryEligible("sobek", "hells_chamber")).toBe(true);
    expect(primaryEligible("sobek", "accelerated_blast_r3")).toBe(true);
    expect(primaryEligible("sobek", "serration_r3")).toBe(false);
    expect(primaryEligible("sobek", "battle_forge")).toBe(false);
  });

  it("secondaries reject primary/shotgun/railjack mods", () => {
    expect(secondaryEligible("lex", "hornet_strike_r3")).toBe(true);
    expect(secondaryEligible("lex", "serration_r3")).toBe(false);
    expect(secondaryEligible("lex", "hells_chamber")).toBe(false);
    expect(secondaryEligible("lex", "battle_forge")).toBe(false);
  });

  it("melee rejects primary/shotgun/railjack mods", () => {
    expect(meleeEligible("skana", "pressure_point_r3")).toBe(true);
    expect(meleeEligible("skana", "serration_r3")).toBe(false);
    expect(meleeEligible("skana", "hells_chamber")).toBe(false);
    expect(meleeEligible("skana", "battle_forge")).toBe(false);
  });

  it("railjack plexus mods stay out of ground weapon regular pools", () => {
    const plexus = allMods.filter((m) => isAllowlistedRailjackPlexusMod(m));
    expect(plexus.length).toBeGreaterThan(20);
    for (const mod of plexus) {
      expect(primaryEligible("braton", mod.id), mod.id).toBe(false);
      expect(secondaryEligible("lex", mod.id), mod.id).toBe(false);
      expect(meleeEligible("skana", mod.id), mod.id).toBe(false);
    }
  });

  it("shotgun-only allowlist mods never appear on Acceltra Prime", () => {
    const leaks = allMods
      .filter((m) => isShotgunOnlyMod(m))
      .filter((m) => primaryEligible("acceltra_prime", m.id))
      .map((m) => m.id);
    expect(leaks).toEqual([]);
  });

  it("Vigilante Supplies is primary Exilus on rifle/shotgun/bow, not secondary", () => {
    const mod = modsById.get("vigilante_supplies")!;
    expect(mod.category).toBe("primary");

    for (const weaponId of ["braton", "acceltra_prime", "sobek", "paris"]) {
      const weapon = allWeapons.find((w) => w.id === weaponId)!;
      const profile = getWeaponModProfile(weapon);
      expect(
        modEligibleForWeaponSlot(mod, "primary", weapon.category, "weapon_exilus_primary", profile),
        `${weaponId} exilus`,
      ).toBe(true);
      expect(
        modEligibleForWeaponSlot(mod, "primary", weapon.category, "regular", profile),
        `${weaponId} regular`,
      ).toBe(false);
    }

    const lex = allWeapons.find((w) => w.id === "lex")!;
    expect(
      modEligibleForWeaponSlot(
        mod,
        "secondary",
        lex.category,
        "weapon_exilus_secondary",
        getWeaponModProfile(lex),
      ),
    ).toBe(false);
  });

  it("no miscategorized general mods remain in the catalog", () => {
    const leftover = allMods.filter((m) => m.category === "general").map((m) => m.id);
    expect(leftover).toEqual([]);
  });

  it("railjack / operator / parazon / coda digimods stay out of ground weapons", () => {
    const deniedCats = new Set([
      "railjack",
      "operator",
      "parazon",
      "requiem",
      "antivirus",
      "potency",
      "conclave",
      "tektolyst",
      "utility",
      "set",
    ]);
    const leaks = allMods
      .filter((m) => deniedCats.has(m.category))
      .filter((m) => primaryEligible("braton", m.id) || secondaryEligible("lex", m.id) || meleeEligible("skana", m.id))
      .map((m) => `${m.id}:${m.category}`);
    expect(leaks).toEqual([]);
  });
});
