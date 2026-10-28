/**
 * "Can the Import dialog put this mod on this item?" Mirrors the filter the in-builder mod picker
 * applies to a regular slot (src/components/mod-picker.tsx), so a mod that pastes in is a mod the
 * picker would also offer. Kept separate from the picker so the dialog can reuse it without React.
 */
import type { Mod, Weapon } from "@/lib/types";
import { modEligibleForWeaponSlot, isNonGroundWeaponMod } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile, isWeaponExclusiveMod } from "@/lib/mods/weapon-mod-tags";
import { isSetBonusMod } from "@/lib/mods/set-mod-catalog";
import { isTomeMod } from "@/lib/mods/mod-slot-categories";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import { isWarframeAugment, warframeAugmentEligibleInBuilder } from "@/lib/mods/warframe-augment-mods";
import { isArchmeleeMod } from "@/lib/mods/archmelee-mods";

export interface ImportEligibility {
  isEligible: (mod: Mod) => boolean;
  explainIneligible: (mod: Mod) => string;
}

function categoryLabel(mod: Mod): string {
  const c = mod.category;
  if (c === "warframe") return "Warframe";
  if (c === "augment") return "Warframe augment";
  if (c === "general") return "general";
  return c.replace(/_/g, " ");
}

const WEAPON_MOD_CATEGORIES = new Set(["primary", "rifle", "shotgun", "bow", "secondary", "pistol", "melee"]);

const withArticle = (label: string) => `${/^[aeiou]/i.test(label) ? "an" : "a"} ${label}`;

function baseExplain(mod: Mod, itemName: string): string | null {
  if (mod.subCategory === "riven") return "Rivens can't be imported (their stats aren't in a name list). Add it from the mod picker";
  if (mod.category === "conclave") return "Conclave (PvP) only";
  if (mod.category === "arcane") return "That's an arcane, not a mod. Add it in the Arcanes section";
  if (isSetBonusMod(mod)) return "Set bonuses are added by equipping the set's mods";
  if (isWeaponExclusiveMod(mod.id)) return `${mod.name} only fits specific weapons, not ${itemName}`;
  return null;
}

/** Regular-slot eligibility on a weapon, same rules as the picker. */
export function weaponImportEligibility(weapon: Weapon, builderCategory: string): ImportEligibility {
  const profile = getWeaponModProfile(weapon);
  const weaponCategory = weapon.category;
  const isEligible = (m: Mod): boolean => {
    if (m.subCategory === "riven" || m.category === "arcane" || isSetBonusMod(m)) return false;
    if (isTomeMod(m) && !isTomeWeapon(weapon.id)) return false;
    if (isNonGroundWeaponMod(m) && builderCategory !== "archwing") return false;
    if (builderCategory === "primary" || builderCategory === "secondary" || builderCategory === "melee") {
      return modEligibleForWeaponSlot(m, builderCategory, weaponCategory, "regular", profile);
    }
    if (builderCategory !== "archmelee" && (m.category === "archmelee" || isArchmeleeMod(m))) return false;
    return m.category === builderCategory || m.category === "general";
  };
  const explainIneligible = (m: Mod): string =>
    baseExplain(m, weapon.name) ?? `${m.name} is ${withArticle(`${categoryLabel(m)} mod`)}, so it can't go on ${weapon.name}`;
  return { isEligible, explainIneligible };
}

/** Regular + Aura slot eligibility on a Warframe (augments only for the chosen frame). */
export function warframeImportEligibility(warframeId: string | undefined, warframeName: string): ImportEligibility {
  const isEligible = (m: Mod): boolean => {
    if (m.subCategory === "riven" || m.category === "arcane" || isSetBonusMod(m)) return false;
    if (isNonGroundWeaponMod(m)) return false;
    if (!(m.category === "warframe" || isWarframeAugment(m))) return false;
    return warframeAugmentEligibleInBuilder(m, "warframe", warframeId, null);
  };
  const explainIneligible = (m: Mod): string => {
    const base = baseExplain(m, warframeName);
    if (base) return base;
    if (isWarframeAugment(m)) return `${m.name} is an augment for a different Warframe, so it can't go on ${warframeName}`;
    if (WEAPON_MOD_CATEGORIES.has(m.category)) return `${m.name} is a ${categoryLabel(m)} weapon mod, so it can't go on ${warframeName}`;
    return `${m.name} is ${withArticle(`${categoryLabel(m)} mod`)}, so it can't go on ${warframeName}`;
  };
  return { isEligible, explainIneligible };
}
