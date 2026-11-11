/**
 * Garuda Talons are treated as an Exalted Weapon (wiki.warframe.com/w/Exalted_Weapon lists them under
 * Exalted melee; owner decision): innate Orokin Catalyst (60 capacity) and, like every exalted weapon,
 * no Riven slot (wiki.warframe.com/w/Garuda_Talons: "Does not receive Riven Mods").
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { weaponModCapacity } from "@/lib/weapons/weapon-progenitor";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";

describe("Garuda Talons as exalted", () => {
  for (const id of ["garuda_talons", "garuda_prime_talons"]) {
    const w = allWeapons.find((x) => x.id === id)!;
    it(`${id}: exalted, innate Catalyst, no Riven slot`, () => {
      expect(w.isExalted).toBe(true);
      expect(weaponModCapacity(w, 0, false)).toBe(60);
      expect(w.hasRivenSlot).toBe(false);
      expect(getRivenWeaponType(w)).toBeNull();
    });
  }

  it("no exalted weapon has a Riven slot", () => {
    expect(allWeapons.filter((w) => w.isExalted && w.hasRivenSlot).map((w) => w.id)).toEqual([]);
  });
});
