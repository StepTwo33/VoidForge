import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import {
  kitgunChambers,
  kitgunGrips,
  kitgunLoaders,
  buildKitgun,
} from "@/data/modular-weapons";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

const semiShotgunCannonade = allMods.find((m) => m.id === "semi_shotgun_cannonade")!;
const semiPistolCannonade = allMods.find((m) => m.id === "semi_pistol_cannonade")!;
const semiRifleCannonade = allMods.find((m) => m.id === "semi_rifle_cannonade")!;
const pointBlank = allMods.find((m) => m.id === "point_blank_r3")!;
const serration = allMods.find((m) => m.id === "serration_r3")!;

const ch = (id: string) => kitgunChambers.find((c) => c.id === `${id}_chamber`)!;
const primaryGrip = kitgunGrips.find((g) => g.type === "primary")!;
const secondaryGrip = kitgunGrips.find((g) => g.type === "secondary")!;
const loader = kitgunLoaders[0];

describe("Kitgun Cannonade and weapon class eligibility", () => {
  it("equips Semi-Shotgun Cannonade on regular semi-auto shotguns like Strun", () => {
    const strun = allWeapons.find((w) => w.id === "strun")!;
    expect(
      modEligibleForWeaponSlot(
        semiShotgunCannonade,
        "primary",
        strun.category,
        "regular",
        getWeaponModProfile(strun),
      ),
    ).toBe(true);
  });

  // Wiki Module:Weapons/data/modular: Sporelacer (Primary) is Auto (shotgun class); Sporelacer (Secondary)
  // is Semi-Auto (pistol class). The grip decides the slot, and the slot decides trigger + class.
  it("Sporelacer Primary is an AUTO shotgun: equips shotgun mods, rejects Semi-Shotgun Cannonade and rifle mods", () => {
    const sporelacerPrimary = buildKitgun(ch("sporelacer"), primaryGrip, loader);
    const profile = getWeaponModProfile(sporelacerPrimary);

    expect(sporelacerPrimary.category).toBe("shotgun");
    expect(sporelacerPrimary.triggerType).toBe("Auto");
    expect(profile.tags.has("SINGLESHOT")).toBe(false);
    expect(profile.tags.has("MODULAR_GUN")).toBe(true);

    expect(modEligibleForWeaponSlot(semiShotgunCannonade, "primary", sporelacerPrimary.category, "regular", profile)).toBe(false);
    expect(modEligibleForWeaponSlot(pointBlank, "primary", sporelacerPrimary.category, "regular", profile)).toBe(true);
    expect(modEligibleForWeaponSlot(serration, "primary", sporelacerPrimary.category, "regular", profile)).toBe(false);
  });

  it("Sporelacer Secondary is a SEMI-AUTO pistol: equips Semi-Pistol Cannonade, rejects Semi-Shotgun / Semi-Rifle", () => {
    const sec = buildKitgun(ch("sporelacer"), secondaryGrip, loader);
    const profile = getWeaponModProfile(sec);

    expect(sec.category).toBe("secondary");
    expect(sec.triggerType).toBe("Semi-Auto");
    expect(profile.tags.has("SINGLESHOT")).toBe(true);
    expect(modEligibleForWeaponSlot(semiPistolCannonade, "secondary", sec.category, "regular", profile)).toBe(true);
    expect(modEligibleForWeaponSlot(semiShotgunCannonade, "secondary", sec.category, "regular", profile)).toBe(false);
    expect(modEligibleForWeaponSlot(semiRifleCannonade, "secondary", sec.category, "regular", profile)).toBe(false);
  });

  it("Same Sporelacer chamber: the grip flips trigger and Semi-Auto eligibility between slots", () => {
    for (const grip of kitgunGrips) {
      const w = buildKitgun(ch("sporelacer"), grip, loader);
      expect(w.triggerType, grip.id).toBe(grip.type === "primary" ? "Auto" : "Semi-Auto");
      expect(w.category, grip.id).toBe(grip.type === "primary" ? "shotgun" : "secondary");
    }
  });

  it("Secondary semi-auto kitguns equip Semi-Pistol Cannonade", () => {
    for (const chamberName of ["sporelacer", "catchmoon", "tombfinger"]) {
      const weapon = buildKitgun(ch(chamberName), secondaryGrip, loader);
      const profile = getWeaponModProfile(weapon);
      expect(profile.tags.has("SINGLESHOT")).toBe(true);
      expect(
        modEligibleForWeaponSlot(semiPistolCannonade, "secondary", weapon.category, "regular", profile),
        `${chamberName} secondary should equip Semi-Pistol Cannonade`,
      ).toBe(true);
    }
  });

  it("Catchmoon Primary is an auto shotgun: equips shotgun mods but rejects Semi-Shotgun Cannonade", () => {
    const catchmoonPrimary = buildKitgun(ch("catchmoon"), primaryGrip, loader);
    const profile = getWeaponModProfile(catchmoonPrimary);

    expect(catchmoonPrimary.category).toBe("shotgun");
    expect(catchmoonPrimary.triggerType).toBe("Auto");
    expect(profile.tags.has("SINGLESHOT")).toBe(false);

    expect(modEligibleForWeaponSlot(semiShotgunCannonade, "primary", catchmoonPrimary.category, "regular", profile)).toBe(false);
    expect(modEligibleForWeaponSlot(pointBlank, "primary", catchmoonPrimary.category, "regular", profile)).toBe(true);
    expect(modEligibleForWeaponSlot(serration, "primary", catchmoonPrimary.category, "regular", profile)).toBe(false);
  });

  it("Tombfinger Primary is a rifle: equips rifle mods, rejects shotgun mods and Cannonade (charge trigger)", () => {
    const tombfingerPrimary = buildKitgun(ch("tombfinger"), primaryGrip, loader);
    const profile = getWeaponModProfile(tombfingerPrimary);

    expect(tombfingerPrimary.category).toBe("primary");
    expect(modEligibleForWeaponSlot(serration, "primary", tombfingerPrimary.category, "regular", profile)).toBe(true);
    expect(modEligibleForWeaponSlot(pointBlank, "primary", tombfingerPrimary.category, "regular", profile)).toBe(false);
    expect(modEligibleForWeaponSlot(semiShotgunCannonade, "primary", tombfingerPrimary.category, "regular", profile)).toBe(false);
    // Charge trigger counts as SINGLESHOT and the class is Rifle, but the wiki's MODULAR_GUN incompatibility
    // on Semi-Rifle Cannonade keeps it off every kitgun.
    expect(tombfingerPrimary.triggerType).toBe("Charge");
    expect(profile.tags.has("SINGLESHOT")).toBe(true);
    expect(profile.tags.has("MODULAR_GUN")).toBe(true);
    expect(modEligibleForWeaponSlot(semiRifleCannonade, "primary", tombfingerPrimary.category, "regular", profile)).toBe(false);
  });

  it("Semi-Rifle and Semi-Shotgun Cannonade are never eligible on any kitgun (wiki MODULAR_GUN incompatibility)", () => {
    for (const chamber of kitgunChambers) {
      for (const grip of kitgunGrips) {
        const w = buildKitgun(chamber, grip, loader);
        const profile = getWeaponModProfile(w);
        const slot = grip.type === "primary" ? "primary" : "secondary";
        for (const mod of [semiRifleCannonade, semiShotgunCannonade]) {
          expect(
            modEligibleForWeaponSlot(mod, slot, w.category, "regular", profile),
            `${mod.id} on ${chamber.name} / ${grip.name}`,
          ).toBe(false);
        }
      }
    }
  });

  it("Semi-Rifle Cannonade is still eligible on a real semi-auto rifle (Rubico)", () => {
    const rubico = allWeapons.find((w) => w.id === "rubico")!;
    expect(
      modEligibleForWeaponSlot(semiRifleCannonade, "primary", rubico.category, "regular", getWeaponModProfile(rubico)),
    ).toBe(true);
  });

  it("Semi-Pistol Cannonade needs a Semi-Auto trigger AND the secondary slot: only Catchmoon / Sporelacer / Tombfinger secondaries", () => {
    const eligible: string[] = [];
    for (const chamber of kitgunChambers) {
      for (const grip of kitgunGrips) {
        const w = buildKitgun(chamber, grip, loader);
        const slot = grip.type === "primary" ? "primary" : "secondary";
        if (modEligibleForWeaponSlot(semiPistolCannonade, slot, w.category, "regular", getWeaponModProfile(w))) {
          eligible.push(`${chamber.name}:${grip.type}`);
        }
      }
    }
    expect([...new Set(eligible)].sort()).toEqual(["Catchmoon:secondary", "Sporelacer:secondary", "Tombfinger:secondary"]);
  });

  it("Full auto and beam kitguns reject Cannonade mods", () => {
    // Rattleguts (Auto)
    const rattleSec = buildKitgun(ch("rattleguts"), secondaryGrip, loader);
    expect(modEligibleForWeaponSlot(semiPistolCannonade, "secondary", rattleSec.category, "regular", getWeaponModProfile(rattleSec))).toBe(false);

    const rattlePri = buildKitgun(ch("rattleguts"), primaryGrip, loader);
    expect(modEligibleForWeaponSlot(semiRifleCannonade, "primary", rattlePri.category, "regular", getWeaponModProfile(rattlePri))).toBe(false);

    // Gaze (Beam / Held)
    const gazeSec = buildKitgun(ch("gaze"), secondaryGrip, loader);
    expect(modEligibleForWeaponSlot(semiPistolCannonade, "secondary", gazeSec.category, "regular", getWeaponModProfile(gazeSec))).toBe(false);

    // Vermisplicer (Beam / Held)
    const vermSec = buildKitgun(ch("vermisplicer"), secondaryGrip, loader);
    expect(modEligibleForWeaponSlot(semiPistolCannonade, "secondary", vermSec.category, "regular", getWeaponModProfile(vermSec))).toBe(false);
  });
});
