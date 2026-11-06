/**
 * Mod picker eligibility + search, shared by <ModPicker> and its regression tests (Round 54b),
 * so tests drive the exact code the picker runs when a user types in "Search mods...".
 */
import type { Mod, Weapon } from "@/lib/types";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { isArchmeleeMod } from "@/lib/mods/archmelee-mods";
import { rivenModMatchesWeapon } from "@/lib/weapons/riven-weapon-type";
import {
  isWarframeAugment,
  warframeAugmentEligibleInBuilder,
  type HelminthAugmentContext,
} from "@/lib/mods/warframe-augment-mods";
import { archwingAugmentEligibleInBuilder, isArchwingAugment } from "@/lib/mods/archwing-augment-mods";
import { isTomeMod, isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import { isSetBonusMod } from "@/lib/mods/set-mod-catalog";
import { modEligibleForWeaponSlot, isNonGroundWeaponMod } from "@/lib/mods/mod-weapon-eligibility";
import type { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

export interface PickerFilterInput {
  mods: readonly Mod[];
  category: string;
  slotType: string;
  search: string;
  warframeId?: string;
  helminthAbility?: HelminthAugmentContext | null;
  archwingId?: string;
  weaponCategory?: string;
  weaponModProfile?: ReturnType<typeof getWeaponModProfile>;
  weapon?: Pick<Weapon, "id" | "name" | "category" | "triggerType"> & { hasRivenSlot?: boolean };
}

export function filterPickerMods({
  mods,
  category,
  slotType,
  search,
  warframeId,
  helminthAbility,
  archwingId,
  weaponCategory,
  weaponModProfile,
  weapon,
}: PickerFilterInput): Mod[] {
  let categoryMods: Mod[];
  if (slotType === "aura") {
    categoryMods = mods.filter(isAuraMod);
  } else if (slotType === "exilus") {
    categoryMods = mods.filter(isWarframeExilusMod);
  } else if (slotType === "weapon_exilus_primary") {
    categoryMods = mods.filter((m) =>
      modEligibleForWeaponSlot(m, "primary", weaponCategory, "weapon_exilus_primary", weaponModProfile),
    );
  } else if (slotType === "weapon_exilus_secondary") {
    categoryMods = mods.filter((m) =>
      modEligibleForWeaponSlot(m, "secondary", weaponCategory, "weapon_exilus_secondary", weaponModProfile),
    );
  } else if (slotType === "weapon_exilus_melee") {
    categoryMods = mods.filter((m) =>
      modEligibleForWeaponSlot(m, "melee", weaponCategory, "weapon_exilus_melee", weaponModProfile),
    );
  } else if (category === "_prefiltered") {
    // Mods already filtered by caller (e.g. companion weapon mods)
    categoryMods = [...mods];
  } else if (
    weaponCategory &&
    (category === "primary" || category === "secondary" || category === "melee")
  ) {
    categoryMods = mods.filter((m) => {
      if (m.subCategory === "riven") return rivenModMatchesWeapon(m.id, weapon, weaponCategory);
      return modEligibleForWeaponSlot(m, category, weaponCategory, "regular", weaponModProfile);
    });
  } else {
    categoryMods = mods.filter((m) => {
      if (isSetBonusMod(m)) return false;
      // Stance / Railjack / Focus / Parazon / etc. never leak into weapon/frame pickers here.
      if (isNonGroundWeaponMod(m) && category !== "archwing") return false;
      if (category !== "archmelee" && (m.category === "archmelee" || isArchmeleeMod(m))) return false;
      if (category !== "archgun" && m.category === "archgun") return false;
      // Riven mods: only show the riven matching the specific weapon category
      if (m.subCategory === "riven") return rivenModMatchesWeapon(m.id, weapon, weaponCategory);
      if (category === "primary") return ["primary", "rifle", "shotgun", "bow", "general"].includes(m.category) || (m.category === "augment" && m.subCategory === "weapon");
      if (category === "secondary") return ["secondary", "pistol", "general"].includes(m.category) || (m.category === "augment" && m.subCategory === "weapon");
      if (category === "melee") return m.category === "melee" || (m.category === "general" && !isArchmeleeMod(m)) || (m.category === "augment" && m.subCategory === "weapon");
      if (category === "archmelee") return isArchmeleeMod(m);
      if (category === "warframe") {
        return m.category === "warframe" || isWarframeAugment(m);
      }
      if (category === "archwing") return m.category === "archwing" || isArchwingAugment(m);
      if (category === "companion") return m.category === "companion";
      return m.category === category;
    });
  }

  // Belt-and-suspenders: never show Railjack/Focus/etc in ground weapon pickers.
  if (
    category === "primary" ||
    category === "secondary" ||
    category === "melee" ||
    category === "archgun" ||
    category === "archmelee" ||
    slotType === "weapon_exilus_primary" ||
    slotType === "weapon_exilus_secondary" ||
    slotType === "weapon_exilus_melee"
  ) {
    categoryMods = categoryMods.filter((m) => !isNonGroundWeaponMod(m));
  }

  categoryMods = categoryMods.filter((m) => m.category !== "arcane");

  // Warframe ability augments: selected frame (+ universal) or Helminth ability match.
  categoryMods = categoryMods.filter((m) =>
    warframeAugmentEligibleInBuilder(m, category, warframeId, helminthAbility),
  );

  // Archwing ability augments: only in archwing builder for the selected archwing.
  categoryMods = categoryMods.filter((m) =>
    archwingAugmentEligibleInBuilder(m, category, archwingId),
  );

  // Tome mods (canticles + invocations) only on tome weapons.
  const weaponId = weapon?.id;
  categoryMods = categoryMods.filter((m) => {
    if (!isTomeMod(m)) return true;
    return isTomeWeapon(weaponId);
  });

  categoryMods = categoryMods.filter((m) => !isSetBonusMod(m));

  if (category === "warframe") {
    if (slotType === "regular") {
      // Aura is slot-exclusive. Exilus mods may also occupy regular slots (wiki / in-game).
      categoryMods = categoryMods.filter((m) => !isAuraMod(m));
    } else if (slotType === "aura") {
      categoryMods = categoryMods.filter(isAuraMod);
    } else if (slotType === "exilus") {
      categoryMods = categoryMods.filter(isWarframeExilusMod);
    }
  }

  if (!search.trim()) return categoryMods;
  const q = search.toLowerCase();
  return categoryMods.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
  );
}
