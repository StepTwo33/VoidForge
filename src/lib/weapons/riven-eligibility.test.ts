import { describe, expect, it } from "vitest";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import {
  getRivenModIdForWeapon,
  getRivenWeaponType,
  rivenModMatchesWeapon,
} from "@/lib/weapons/riven-weapon-type";
import { rivenCannotEquipReason } from "@/lib/rivens/riven-equip";
import { modFitsCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { archgunModsForBuilder } from "@/lib/mods/archgun-weapon-augment-mods";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { getRivenStatsForCategory } from "@/lib/types";

/**
 * Wiki eligibility (page body of wiki.warframe.com, not the infobox alone):
 * - Riven Mods: rivens exist for Primary, Secondary, Melee, Archguns, and Robotic Weapons.
 *   "Veiled Archgun Rivens can only be equipped on Archguns."
 *   Arch-melee is never listed as a riven type.
 * - Robotic Weapon / Riven Mods: "Veiled Robotic Weapon Rivens can be equipped on any Robotic weapon."
 *   "Robotic Weapons use the base values of their associated weapon class
 *   (e.g. Deconstructor = Melee, Sweeper = Shotgun, etc.)."
 *   "Although Beast Companions had their weapons separated in Update 37.0,
 *   Veiled Companion Riven mods can still only become mods for Robotic Weapons."
 * - Hound (Companion): Hound weapons "can generate an associated Riven Mod" and are Robotic.
 * - Claws (Beast) Update 37.0: "we did not add them to the Riven system nor do we have current plans to."
 */
describe("riven eligibility (wiki.warframe.com)", () => {
  const weapons = getEffectiveWeapons();
  const byCat = (cat: string) => weapons.filter((w) => w.category === cat);

  it("gives every non-exalted archgun the archgun_riven_mod catalog id", () => {
    const archguns = byCat("archgun");
    expect(archguns.length).toBeGreaterThan(0);
    for (const w of archguns) {
      if (w.isExalted || w.hasRivenSlot === false) {
        expect(getRivenModIdForWeapon(w), w.id).toBeNull();
        expect(rivenCannotEquipReason(w)).toMatch(/cannot use Rivens/);
        continue;
      }
      expect(getRivenWeaponType(w), w.id).toBe("Archgun");
      expect(getRivenModIdForWeapon(w), w.id).toBe("archgun_riven_mod");
      expect(rivenModMatchesWeapon("archgun_riven_mod", w)).toBe(true);
      expect(rivenModMatchesWeapon("riven_archgun", w)).toBe(false);
      expect(rivenCannotEquipReason(w)).toBeNull();
    }
  });

  it("includes the Archgun Riven placeholder in the archwing-builder gun pool", () => {
    const pool = archgunModsForBuilder("imperator");
    expect(pool.some((m) => m.id === "archgun_riven_mod")).toBe(true);
  });

  it("blocks every arch-melee weapon, including Kaszas", () => {
    const melee = byCat("archmelee");
    expect(melee.length).toBeGreaterThan(0);
    expect(melee.some((w) => w.id === "kaszas")).toBe(true);
    for (const w of melee) {
      expect(getRivenModIdForWeapon(w), w.id).toBeNull();
      expect(rivenCannotEquipReason(w)).toBe(`${w.name} cannot use Rivens.`);
    }
  });

  it("lets robotic sentinel, MOA, and hound weapons take Companion Weapon Rivens", () => {
    const robotic = [...byCat("sentinel_weapon"), ...byCat("hound_weapon")];
    expect(robotic.some((w) => w.id === "helstrum")).toBe(true); // MOA
    expect(robotic.some((w) => w.id === "akaten")).toBe(true); // Hound
    expect(robotic.some((w) => w.id === "deconstructor")).toBe(true);
    const riven = getEffectiveModsMap().get("companion_weapon_riven_mod");
    expect(riven).toBeTruthy();
    for (const w of robotic) {
      expect(getRivenModIdForWeapon(w), w.id).toBe("companion_weapon_riven_mod");
      expect(rivenCannotEquipReason(w), w.id).toBeNull();
      expect(modFitsCompanionWeapon(riven!, w), w.id).toBe(true);
    }
  });

  it("uses the wiki-associated class for robotic riven stat pools", () => {
    const name = (id: string) => weapons.find((w) => w.id === id)!;
    expect(getRivenWeaponType(name("sweeper"))).toBe("Shotgun");
    expect(getRivenWeaponType(name("sweeper_prime"))).toBe("Shotgun");
    expect(getRivenWeaponType(name("deconstructor"))).toBe("Melee");
    expect(getRivenWeaponType(name("deconstructor_prime"))).toBe("Melee");
    expect(getRivenWeaponType(name("burst_laser"))).toBe("Pistol");
    expect(getRivenWeaponType(name("burst_laser_prime"))).toBe("Pistol");
    expect(getRivenWeaponType(name("prisma_burst_laser"))).toBe("Pistol");
    expect(getRivenWeaponType(name("akaten"))).toBe("Melee");
    expect(getRivenWeaponType(name("batoten"))).toBe("Melee");
    expect(getRivenWeaponType(name("lacerten"))).toBe("Melee");
    expect(getRivenWeaponType(name("helstrum"))).toBe("Rifle");
    expect(getRivenWeaponType(name("vulcax"))).toBe("Rifle");
    expect(getRivenWeaponType(name("verglas"))).toBe("Rifle");
  });

  it("blocks every beast claw (Kubrow, Kavat, Vulpaphyla, Predasite, Venari, Helminth)", () => {
    const claws = byCat("beast_claw");
    expect(claws.length).toBeGreaterThan(0);
    const riven = getEffectiveModsMap().get("companion_weapon_riven_mod");
    const expected = [
      "chesa_claws",
      "helminth_claws",
      "smeeta_claws",
      "sly_claws",
      "vizier_claws",
      "venari_claws",
    ];
    for (const id of expected) {
      expect(claws.some((w) => w.id === id), id).toBe(true);
    }
    for (const w of claws) {
      expect(getRivenModIdForWeapon(w), w.id).toBeNull();
      expect(rivenCannotEquipReason(w)).toBe(`${w.name} cannot use Rivens.`);
      expect(modFitsCompanionWeapon(riven!, w), w.id).toBe(false);
    }
  });

  it("uses the dedicated Archgun riven stat pool (no IPS, no Reload While Holstered)", () => {
    const keys = getRivenStatsForCategory("archgun", { includeSpliced: true }).map((s) => s.key);
    const rifle = getRivenStatsForCategory("rifle", { includeSpliced: true }).map((s) => s.key);
    expect(keys).toContain("ammoMax");
    expect(keys).toContain("punchThrough");
    expect(keys).toContain("zoom");
    expect(keys).not.toContain("impact");
    expect(keys).not.toContain("puncture");
    expect(keys).not.toContain("slash");
    expect(keys).not.toContain("reloadWhileHolstered");
    expect(rifle).toContain("reloadWhileHolstered");
  });

  it("applies archgun-pool riven stats in the weapon calc", () => {
    const imperator = weapons.find((w) => w.id === "imperator");
    expect(imperator).toBeTruthy();
    const mods = getEffectiveModsMap();
    const base = calculateWeaponBuild(imperator!, [], mods);
    const rivened = calculateWeaponBuild(
      imperator!,
      [{ modId: "archgun_riven_mod", rank: 8, slotIndex: 0 }],
      mods,
      undefined,
      undefined,
      undefined,
      undefined,
      { damage: 1, criticalChance: 0.5 },
    );
    expect(rivened.totalDamage).toBeCloseTo(base.totalDamage * 2, 5);
    expect(rivened.criticalChance).toBeCloseTo(base.criticalChance * 1.5, 5);
  });
});
