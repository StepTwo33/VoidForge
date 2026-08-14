import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { MOD_EXCLUSIVE_WEAPON_IDS } from "@/data/mod-weapon-tags";
import { getModImage } from "@/lib/display/images";
import {
  isMeleeWeaponExilusMod,
  isPrimaryWeaponExilusMod,
  isSecondaryWeaponExilusMod,
} from "@/lib/mods/mod-slot-categories";
import {
  modEligibleForWeaponSlot,
  type WeaponModSlotType,
} from "@/lib/mods/mod-weapon-eligibility";
import { warframeAugmentEligibleInBuilder } from "@/lib/mods/warframe-augment-mods";
import {
  getWeaponModProfile,
  isWeaponExclusiveMod,
} from "@/lib/mods/weapon-mod-tags";
import type { Mod, Weapon } from "@/lib/types";

const modsById = new Map(allMods.map((m) => [m.id, m]));
const weaponsById = new Map(allWeapons.map((w) => [w.id, w]));

function builderForWeapon(weapon: Weapon): "primary" | "secondary" | "melee" {
  if (weapon.category === "melee" || weapon.category === "beast_claw") return "melee";
  if (["pistol", "secondary", "dual_pistols"].includes(weapon.category)) {
    return "secondary";
  }
  return "primary";
}

function slotTypesForExclusiveMod(mod: Mod): WeaponModSlotType[] {
  if (isPrimaryWeaponExilusMod(mod)) return ["weapon_exilus_primary"];
  if (isSecondaryWeaponExilusMod(mod)) return ["weapon_exilus_secondary"];
  if (isMeleeWeaponExilusMod(mod)) return ["weapon_exilus_melee"];
  return ["regular"];
}

describe("mod eligibility inventory", () => {
  it("blocks every weapon-exclusive / weapon-augment from warframe builder", () => {
    const leaks = allMods.filter(
      (m) =>
        (isWeaponExclusiveMod(m.id) ||
          (m.category === "augment" && m.subCategory === "weapon")) &&
        warframeAugmentEligibleInBuilder(m, "warframe", "excalibur"),
    );
    expect(leaks.map((m) => m.id)).toEqual([]);
  });

  it("equips every exclusive mod on each listed weapon in the correct slot", () => {
    const misses: string[] = [];

    for (const [modId, weaponIds] of Object.entries(MOD_EXCLUSIVE_WEAPON_IDS)) {
      const mod = modsById.get(modId);
      if (!mod) {
        misses.push(`${modId}: missing mod catalog entry`);
        continue;
      }

      const slots = slotTypesForExclusiveMod(mod);
      for (const weaponId of weaponIds) {
        const weapon = weaponsById.get(weaponId);
        if (!weapon) {
          misses.push(`${modId} -> ${weaponId}: unknown weapon id`);
          continue;
        }

        const builder = builderForWeapon(weapon);
        const profile = getWeaponModProfile(weapon);
        const ok = slots.some((slot) =>
          modEligibleForWeaponSlot(mod, builder, weapon.category, slot, profile),
        );
        if (!ok) {
          misses.push(
            `${modId} on ${weaponId} (builder=${builder}, slots=${slots.join("|")})`,
          );
        }
      }
    }

    expect(misses).toEqual([]);
  });

  it("covers known family variants for audited exclusives", () => {
    expect(MOD_EXCLUSIVE_WEAPON_IDS.avenging_truth).toContain("silva_&_aegis_prime");
    expect(MOD_EXCLUSIVE_WEAPON_IDS.stockpiled_blight).toContain("mk1_kunai");
    expect(MOD_EXCLUSIVE_WEAPON_IDS.winds_of_purity).toContain("mk1_furis");
  });

  it("places Bhisaj-Bal on primary Exilus for Paris Prime", () => {
    const mod = modsById.get("bhisaj_bal")!;
    const weapon = weaponsById.get("paris_prime")!;
    const profile = getWeaponModProfile(weapon);

    expect(isPrimaryWeaponExilusMod(mod)).toBe(true);
    expect(isSecondaryWeaponExilusMod(mod)).toBe(false);
    expect(
      modEligibleForWeaponSlot(mod, "primary", weapon.category, "weapon_exilus_primary", profile),
    ).toBe(true);
  });

  it("does not tag Mutalist Quanta as POWER_WEAPON / BEAM", () => {
    const profile = getWeaponModProfile(weaponsById.get("mutalist_quanta")!);
    expect(profile.tags.has("POWER_WEAPON")).toBe(false);
    expect(profile.tags.has("BEAM")).toBe(false);
  });

  it("equips exclusive beam mods on their own weapons despite POWER_WEAPON incompat rows", () => {
    const cases: Array<{ modId: string; weaponId: string }> = [
      { modId: "efficient_beams", weaponId: "convectrix" },
      { modId: "bursting_mass", weaponId: "mutalist_quanta" },
    ];

    for (const { modId, weaponId } of cases) {
      const mod = modsById.get(modId)!;
      const weapon = weaponsById.get(weaponId)!;
      const profile = getWeaponModProfile(weapon);
      expect(
        modEligibleForWeaponSlot(mod, "primary", weapon.category, "regular", profile),
        `${modId} on ${weaponId}`,
      ).toBe(true);
    }
  });

  it("tags Garuda talon augments as weapon subCategory", () => {
    for (const id of [
      "augment_garuda_blood_forge",
      "augment_garuda_dread_ward",
      "augment_garuda_blending_talons",
    ]) {
      const mod = modsById.get(id)!;
      expect(mod.subCategory).toBe("weapon");
      expect(warframeAugmentEligibleInBuilder(mod, "warframe", "garuda")).toBe(false);
    }
  });

  it("equips Amir's Shockwave Nightwave augments only on their EFV weapons", () => {
    expect(MOD_EXCLUSIVE_WEAPON_IDS.prototype_shock_coils).toEqual(["efv_8_mars"]);
    expect(MOD_EXCLUSIVE_WEAPON_IDS.overpressured_rounds).toEqual(["efv_5_jupiter"]);

    const proto = modsById.get("prototype_shock_coils")!;
    const over = modsById.get("overpressured_rounds")!;
    const mars = weaponsById.get("efv_8_mars")!;
    const jupiter = weaponsById.get("efv_5_jupiter")!;

    expect(proto.polarity).toBe("madurai");
    expect(over.polarity).toBe("madurai");
    expect(proto.drain).toBe(2);
    expect(over.drain).toBe(2);
    expect(proto.maxRank).toBe(5);
    expect(over.maxRank).toBe(5);
    expect(getModImage(proto.name)).toBe("/images/mods/Prototype_Shock_Coils.png");
    expect(getModImage(over.name)).toBe("/images/mods/Overpressured_Rounds.png");

    expect(
      modEligibleForWeaponSlot(proto, "secondary", mars.category, "regular", getWeaponModProfile(mars)),
    ).toBe(true);
    expect(
      modEligibleForWeaponSlot(over, "primary", jupiter.category, "regular", getWeaponModProfile(jupiter)),
    ).toBe(true);
    expect(
      modEligibleForWeaponSlot(proto, "primary", jupiter.category, "regular", getWeaponModProfile(jupiter)),
    ).toBe(false);
    expect(
      modEligibleForWeaponSlot(over, "secondary", mars.category, "regular", getWeaponModProfile(mars)),
    ).toBe(false);
  });
});
