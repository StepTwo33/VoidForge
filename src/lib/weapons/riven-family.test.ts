import { describe, it, expect } from "vitest";
import {
  getRivenBaseName,
  getRivenBaseWeapon,
  isRivenVariant,
  getRivenFamilyWeaponIds,
  getBaseRivenWeapons,
  getEffectiveRivenWeaponType,
} from "./riven-family";
import { allWeapons } from "@/data/weapons";

describe("riven-family", () => {
  it("resolves Prime variants to base weapon", () => {
    expect(getRivenBaseName("Acceltra Prime")).toBe("Acceltra");
    expect(getRivenBaseName("Braton Prime")).toBe("Braton");
    expect(getRivenBaseName("Rubico Prime")).toBe("Rubico");
    expect(getRivenBaseName("Orthos Prime")).toBe("Orthos");
    // Prefix Prime (Sentinel weapon)
    expect(getRivenBaseName("Prime Laser Rifle")).toBe("Laser Rifle");
  });

  it("resolves Kuva and Tenet variants to base weapon when base exists", () => {
    expect(getRivenBaseName("Kuva Nukor")).toBe("Nukor");
    expect(getRivenBaseName("Kuva Hek")).toBe("Hek");
    expect(getRivenBaseName("Kuva Kohm")).toBe("Kohm");
    expect(getRivenBaseName("Tenet Arca Plasmor")).toBe("Arca Plasmor");
    expect(getRivenBaseName("Tenet Cycron")).toBe("Cycron");
  });

  it("keeps unique Kuva/Tenet/Prime weapons that have no base counterpart", () => {
    // These have no non-Kuva/Tenet/Prime equivalent in Warframe
    expect(getRivenBaseName("Kuva Bramma")).toBe("Kuva Bramma");
    expect(getRivenBaseName("Kuva Chakkhurr")).toBe("Kuva Chakkhurr");
    expect(getRivenBaseName("Kuva Shildeg")).toBe("Kuva Shildeg");
    expect(getRivenBaseName("Tenet Spirex")).toBe("Tenet Spirex");
    expect(getRivenBaseName("Tenet Diplos")).toBe("Tenet Diplos");
    expect(getRivenBaseName("Euphona Prime")).toBe("Euphona Prime");
    expect(getRivenBaseName("Dakra Prime")).toBe("Dakra Prime");
    expect(getRivenBaseName("Reaper Prime")).toBe("Reaper Prime");
  });

  it("resolves Vandal, Wraith, Prisma, Syndicate, and MK1 variants", () => {
    expect(getRivenBaseName("Braton Vandal")).toBe("Braton");
    expect(getRivenBaseName("Strun Wraith")).toBe("Strun");
    expect(getRivenBaseName("Prisma Gorgon")).toBe("Gorgon");
    expect(getRivenBaseName("Synoid Gammacor")).toBe("Gammacor");
    expect(getRivenBaseName("Vaykor Hek")).toBe("Hek");
    expect(getRivenBaseName("Sancti Tigris")).toBe("Tigris");
    expect(getRivenBaseName("MK1-Braton")).toBe("Braton");
  });

  it("getRivenBaseWeapon maps Acceltra Prime to Acceltra", () => {
    const acceltraPrime = allWeapons.find((w) => w.id === "acceltra_prime")!;
    const base = getRivenBaseWeapon(acceltraPrime);
    expect(base.id).toBe("acceltra");
    expect(base.name).toBe("Acceltra");
  });

  it("getRivenBaseWeapon maps Kuva Nukor to Nukor", () => {
    const kuvaNukor = allWeapons.find((w) => w.id === "kuva_nukor")!;
    const base = getRivenBaseWeapon(kuvaNukor);
    expect(base.id).toBe("nukor");
    expect(base.name).toBe("Nukor");
  });

  it("isRivenVariant identifies variants correctly", () => {
    expect(isRivenVariant("acceltra_prime")).toBe(true);
    expect(isRivenVariant("acceltra")).toBe(false);
    expect(isRivenVariant("kuva_nukor")).toBe(true);
    expect(isRivenVariant("nukor")).toBe(false);
    expect(isRivenVariant("kuva_bramma")).toBe(false);
    expect(isRivenVariant("prime_laser_rifle")).toBe(true);
    expect(isRivenVariant("laser_rifle")).toBe(false);
  });

  it("getRivenFamilyWeaponIds returns all variant IDs for a base or variant", () => {
    const acceltraFamily = getRivenFamilyWeaponIds("acceltra");
    expect(acceltraFamily).toContain("acceltra");
    expect(acceltraFamily).toContain("acceltra_prime");

    const nukorFamily = getRivenFamilyWeaponIds("kuva_nukor");
    expect(nukorFamily).toContain("nukor");
    expect(nukorFamily).toContain("kuva_nukor");
  });

  it("classifies Kitgun and Zaw modular weapons into their own riven categories", () => {
    const sporelacer = allWeapons.find((w) => w.name === "Sporelacer")!;
    expect(getEffectiveRivenWeaponType(sporelacer)).toBe("Kitgun");

    const kripath = allWeapons.find((w) => w.name === "Plague Kripath")!;
    expect(getEffectiveRivenWeaponType(kripath)).toBe("Zaw");
  });
});
