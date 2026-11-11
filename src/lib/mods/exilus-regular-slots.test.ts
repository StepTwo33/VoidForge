/**
 * Exilus-eligible mods can also occupy regular slots, as they do in game
 * (wiki.warframe.com/w/Exilus_Mods, wiki.warframe.com/w/Mod/Compatibility):
 * "Exilus Mods can be equipped in any slot, but they are the only mods allowed
 * in the Exilus slot." Auras and stances stay slot-exclusive. Tome Canticles
 * are the genuine Exilus-only exception (they use the Tome's Exilus slot).
 *
 * The restriction that kept them out of regular Warframe slots landed in
 * ce88e85 and was lifted for Warframes in a1d637a; Round 44 (602d0e1 / 40e1ec9)
 * did the same for weapons. These tests lock that behavior so it cannot regress.
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { filterPickerMods } from "@/components/mod-picker-filter";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import {
  isWarframeExilusMod,
  isPrimaryWeaponExilusMod,
  isSecondaryWeaponExilusMod,
  isMeleeWeaponExilusMod,
  isTomeCanticleMod,
} from "@/lib/mods/mod-slot-categories";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { warframeImportEligibility, weaponImportEligibility } from "@/lib/builds/import-eligibility";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";

function warframePicker(slotType: "regular" | "exilus" | "aura", search = "", warframeId = "mesa") {
  return filterPickerMods({
    mods: allMods,
    category: "warframe",
    slotType,
    search,
    warframeId,
  });
}

function weaponPicker(
  weaponId: string,
  slotType: "regular" | "weapon_exilus_primary" | "weapon_exilus_secondary" | "weapon_exilus_melee",
  search = "",
) {
  const weapon = allWeapons.find((w) => w.id === weaponId)!;
  return filterPickerMods({
    mods: allMods,
    category: getModCategory(weapon.category),
    slotType,
    search,
    weaponCategory: weapon.category,
    weaponModProfile: getWeaponModProfile(weapon),
    weapon,
  });
}

describe("Warframe Exilus mods occupy regular slots as well as the Exilus slot", () => {
  it("offers Power Drift, Primed Sure Footed and Rush in a regular slot", () => {
    const names = warframePicker("regular").map((m) => m.name);
    expect(names).toContain("Power Drift");
    expect(names).toContain("Primed Sure Footed");
    expect(names).toContain("Rush");
    expect(names).toContain("Mobilize");
    expect(warframePicker("regular").filter(isWarframeExilusMod).length).toBeGreaterThan(20);
  });

  it("still offers those same mods in the Exilus slot, and only Exilus mods", () => {
    const ex = warframePicker("exilus");
    expect(ex.every(isWarframeExilusMod)).toBe(true);
    const names = ex.map((m) => m.name);
    expect(names).toContain("Power Drift");
    expect(names).toContain("Primed Sure Footed");
    expect(names).not.toContain("Intensify");
    expect(names).not.toContain("Vitality");
    expect(names).not.toContain("Steel Charge");
  });

  it("keeps Auras out of regular and Exilus slots, and only in the Aura slot", () => {
    const regular = warframePicker("regular");
    const exilus = warframePicker("exilus");
    const aura = warframePicker("aura");
    expect(regular.filter(isAuraMod)).toEqual([]);
    expect(exilus.filter(isAuraMod)).toEqual([]);
    expect(regular.map((m) => m.name)).not.toContain("Steel Charge");
    expect(regular.map((m) => m.name)).not.toContain("Growing Power");
    expect(aura.every(isAuraMod)).toBe(true);
    expect(aura.map((m) => m.name)).toContain("Steel Charge");
    expect(aura.map((m) => m.name)).not.toContain("Power Drift");
  });

  it("offers Mesa's Waltz (Augment / Exilus) in Mesa's regular slots, not on other frames", () => {
    const mesa = warframePicker("regular", "", "mesa").map((m) => m.name);
    const mesaPrime = warframePicker("regular", "", "mesa_prime").map((m) => m.name);
    const volt = warframePicker("regular", "", "volt").map((m) => m.name);
    expect(mesa).toContain("Mesa's Waltz");
    expect(mesaPrime).toContain("Mesa's Waltz");
    expect(volt).not.toContain("Mesa's Waltz");
  });

  it("the Import dialog accepts an Exilus mod on a Warframe regular-slot paste", () => {
    const { isEligible } = warframeImportEligibility("mesa", "Mesa");
    expect(isEligible(modsMap.get("power_drift")!)).toBe(true);
    expect(isEligible(modsMap.get("primed_sure_footed")!)).toBe(true);
    expect(isEligible(modsMap.get("intensify_r3") ?? modsMap.get("intensify")!)).toBe(true);
  });
});

describe("Weapon Exilus mods occupy regular slots as well as the Exilus slot", () => {
  it("rifle: Stabilizer, Ammo Drum and Eagle Eye fit a Braton regular slot and its Exilus slot", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const profile = getWeaponModProfile(braton);
    for (const id of ["stabilizer", "ammo_drum", "eagle_eye"]) {
      const mod = modsMap.get(id)!;
      expect(isPrimaryWeaponExilusMod(mod)).toBe(true);
      expect(modEligibleForWeaponSlot(mod, "primary", braton.category, "regular", profile)).toBe(true);
      expect(modEligibleForWeaponSlot(mod, "primary", braton.category, "weapon_exilus_primary", profile)).toBe(true);
    }
    const regularNames = weaponPicker("braton", "regular").map((m) => m.name);
    expect(regularNames).toContain("Stabilizer");
    expect(regularNames).toContain("Ammo Drum");
    expect(regularNames).toContain("Eagle Eye");
  });

  it("secondary: Hawk Eye and Lethal Momentum fit a Lex regular slot", () => {
    const names = weaponPicker("lex", "regular").map((m) => m.name);
    expect(names).toContain("Hawk Eye");
    expect(names).toContain("Lethal Momentum");
    expect(weaponPicker("lex", "regular").some(isSecondaryWeaponExilusMod)).toBe(true);
  });

  it("melee: Parry fits a Skana regular slot and its Exilus slot", () => {
    const skana = allWeapons.find((w) => w.id === "skana")!;
    const parry = modsMap.get("parry_r3") ?? modsMap.get("parry")!;
    expect(isMeleeWeaponExilusMod(parry)).toBe(true);
    expect(modEligibleForWeaponSlot(parry, "melee", skana.category, "regular", getWeaponModProfile(skana))).toBe(true);
    expect(weaponPicker("skana", "regular").map((m) => m.name)).toContain(parry.name);
  });

  it("class and sub-class rules still apply in regular slots (Shotgun Exilus on a rifle)", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const counterbalance = modsMap.get("counterbalance")!;
    expect(modEligibleForWeaponSlot(counterbalance, "primary", braton.category, "regular", getWeaponModProfile(braton))).toBe(false);
    expect(weaponPicker("braton", "regular").map((m) => m.name)).not.toContain("Counterbalance");
  });

  it("stances stay out of regular melee slots (they have their own Stance slot)", () => {
    const names = weaponPicker("skana", "regular").map((m) => m.name);
    const stances = allMods.filter((m) => m.category === "stance").map((m) => m.name);
    for (const name of stances.slice(0, 8)) {
      expect(names).not.toContain(name);
    }
    // A well-known stance
    expect(names).not.toContain("Crimson Dervish");
    expect(names).not.toContain("Iron Phoenix");
  });

  it("the Import dialog accepts a weapon Exilus mod on a matching weapon", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const { isEligible } = weaponImportEligibility(braton, "primary");
    expect(isEligible(modsMap.get("stabilizer")!)).toBe(true);
    expect(isEligible(modsMap.get("ammo_drum")!)).toBe(true);
    expect(isEligible(modsMap.get("counterbalance")!)).toBe(false);
  });
});

describe("Genuine Exilus-only exception: Tome Canticles", () => {
  it("Canticles only fit a Tome's Exilus slot, not a regular slot", () => {
    const tome = allWeapons.find((w) => isTomeWeapon(w.id));
    expect(tome, "a tome weapon in the catalog").toBeTruthy();
    const canticle = allMods.find(isTomeCanticleMod)!;
    const profile = getWeaponModProfile(tome!);
    const cat = getModCategory(tome!.category);
    expect(modEligibleForWeaponSlot(canticle, cat, tome!.category, "regular", profile)).toBe(false);
    expect(modEligibleForWeaponSlot(canticle, cat, tome!.category, "weapon_exilus_secondary", profile)).toBe(true);
  });
});
