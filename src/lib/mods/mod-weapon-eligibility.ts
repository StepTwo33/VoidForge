import type { Mod } from "@/lib/types";
import {
  isMeleeWeaponExilusMod,
  isPrimaryWeaponExilusMod,
  isSecondaryWeaponExilusMod,
  isTomeCanticleMod,
  isTomeMod,
} from "@/lib/mods/mod-slot-categories";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import {
  isWeaponExclusiveMod,
  modCompatibleWithWeaponProfile,
  modMatchesExclusiveWeapon,
  type WeaponModProfile,
} from "@/lib/mods/weapon-mod-tags";

export type WeaponModSlotType =
  | "regular"
  | "weapon_exilus_primary"
  | "weapon_exilus_secondary"
  | "weapon_exilus_melee";

const PRIMARY_WEAPON_CATEGORIES = new Set([
  "rifle",
  "shotgun",
  "bow",
  "primary",
  "launcher",
  "sentinel_weapon",
  "hound_weapon",
]);

const SECONDARY_WEAPON_CATEGORIES = new Set(["pistol", "secondary", "dual_pistols"]);

const MELEE_WEAPON_CATEGORIES = new Set(["melee", "beast_claw"]);

/** General-category mods that only apply to melee weapons. */
const GENERAL_MELEE_ONLY_IDS = new Set([
  "affinity_spike",
  "flowing_strikes",
  "fracturing_wind",
  "melee_riven_mod",
  "peculiar_end",
  "power_spike",
  "spectral_blades",
  "zaw_riven_mod",
]);

/** General-category riven / placeholder mods scoped to one weapon class. */
const GENERAL_RIVEN_PLACEHOLDER: Record<string, Set<string>> = {
  rifle_riven_mod: PRIMARY_WEAPON_CATEGORIES,
  pistol_riven_mod: SECONDARY_WEAPON_CATEGORIES,
  melee_riven_mod: MELEE_WEAPON_CATEGORIES,
  zaw_riven_mod: MELEE_WEAPON_CATEGORIES,
};

export function isPrimaryWeaponCategory(category: string): boolean {
  return PRIMARY_WEAPON_CATEGORIES.has(category);
}

export function isSecondaryWeaponCategory(category: string): boolean {
  return SECONDARY_WEAPON_CATEGORIES.has(category);
}

export function isMeleeWeaponCategory(category: string): boolean {
  return MELEE_WEAPON_CATEGORIES.has(category);
}

function modText(mod: Pick<Mod, "id" | "name" | "description">): string {
  return `${mod.id} ${mod.name} ${mod.description}`.toLowerCase();
}

/** Whether a `general` mod is eligible for the given ground weapon category. */
export function generalModAppliesToWeaponCategory(
  mod: Mod,
  weaponCategory: string,
): boolean {
  if (mod.category !== "general") return true;

  if (GENERAL_MELEE_ONLY_IDS.has(mod.id)) {
    return isMeleeWeaponCategory(weaponCategory);
  }

  const rivenScope = GENERAL_RIVEN_PLACEHOLDER[mod.id];
  if (rivenScope) {
    return rivenScope.has(weaponCategory);
  }

  const text = modText(mod);

  if (text.includes("companion") || text.includes("kubrow") || text.includes("k-drive")) {
    return false;
  }

  if (isPrimaryWeaponCategory(weaponCategory)) {
    if (
      text.includes("melee attack") ||
      text.includes("melee affinity") ||
      text.includes("melee kills") ||
      text.includes("melee damage") ||
      text.includes("on melee") ||
      text.includes("with melee") ||
      text.includes("combo counter") ||
      text.includes("heavy attack") ||
      text.includes("while blocking") ||
      text.includes("slide attack")
    ) {
      return false;
    }
    if (/\bpistol\b/.test(text) || text.includes("secondary weapon") || text.includes("dual pistols")) {
      return false;
    }
    if (
      (mod.id.includes("pistol") || mod.name.toLowerCase().includes("pistol")) &&
      !mod.name.toLowerCase().includes("rifle")
    ) {
      return false;
    }
    if (
      (mod.id.includes("shotgun") || mod.name.toLowerCase().includes("shotgun")) &&
      weaponCategory !== "shotgun"
    ) {
      return false;
    }
    if (mod.id.includes("melee") || mod.name.toLowerCase().includes("melee")) {
      return false;
    }
    return true;
  }

  if (isSecondaryWeaponCategory(weaponCategory)) {
    if (
      text.includes("melee attack") ||
      text.includes("melee affinity") ||
      text.includes("combo counter") ||
      text.includes("heavy attack") ||
      text.includes("while blocking")
    ) {
      return false;
    }
    if (mod.id.includes("rifle") || mod.name.toLowerCase().includes("rifle")) {
      return false;
    }
    if (
      (mod.id.includes("shotgun") || mod.name.toLowerCase().includes("shotgun")) &&
      !mod.name.toLowerCase().includes("pistol")
    ) {
      return false;
    }
    if (mod.id.includes("melee") || mod.name.toLowerCase().includes("melee")) {
      return false;
    }
    return true;
  }

  if (isMeleeWeaponCategory(weaponCategory)) {
    if (/\bpistol\b/.test(text) || text.includes("rifle") || text.includes("shotgun")) {
      if (!text.includes("melee") && !text.includes("all weapons")) {
        return false;
      }
    }
    return true;
  }

  return true;
}

const WEAPON_BUILDER_CATEGORIES = new Set(["primary", "secondary", "melee", "archgun"]);

/** Category filter for weapon mod pickers (regular + typed categories). */
export function modMatchesWeaponBuilderCategory(
  mod: Mod,
  builderCategory: string,
  weaponId?: string,
): boolean {
  if (
    isWeaponExclusiveMod(mod.id) &&
    mod.category !== "stance" &&
    mod.category !== "general" &&
    modMatchesExclusiveWeapon(mod.id, weaponId) &&
    WEAPON_BUILDER_CATEGORIES.has(builderCategory)
  ) {
    return true;
  }

  if (mod.category === "stance") return false;
  if (mod.category === "necramech" || mod.category === "archwing" || mod.category === "operator") {
    return false;
  }
  if (builderCategory !== "archmelee" && mod.category === "archmelee") return false;
  if (builderCategory !== "archgun" && mod.category === "archgun") return false;

  if (mod.subCategory === "riven") {
    return false;
  }

  switch (builderCategory) {
    case "primary":
      return ["primary", "rifle", "shotgun", "bow", "launcher", "general"].includes(mod.category);
    case "secondary":
      return ["secondary", "pistol", "general"].includes(mod.category);
    case "melee":
      return mod.category === "melee" || mod.category === "general";
    default:
      return mod.category === builderCategory;
  }
}

/** Tome Canticle / Invocation mods only equip on tome weapons; canticles use Exilus only. */
export function tomeModEligibleForWeaponSlot(
  mod: Mod,
  weaponId: string | undefined,
  slotType: WeaponModSlotType,
): boolean {
  if (isTomeMod(mod)) {
    if (!isTomeWeapon(weaponId)) return false;
    if (isTomeCanticleMod(mod)) return slotType === "weapon_exilus_secondary";
    return slotType === "regular";
  }
  if (isTomeWeapon(weaponId) && slotType === "weapon_exilus_secondary") {
    return false;
  }
  return true;
}

/** Final eligibility for a weapon mod picker slot. */
export function modEligibleForWeaponSlot(
  mod: Mod,
  builderCategory: string,
  weaponCategory: string | undefined,
  slotType: WeaponModSlotType,
  weaponProfile?: WeaponModProfile,
): boolean {
  const weaponId = weaponProfile?.weaponId;

  if (!tomeModEligibleForWeaponSlot(mod, weaponId, slotType)) return false;

  if (slotType === "weapon_exilus_primary") {
    if (!isPrimaryWeaponExilusMod(mod)) return false;
    if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) return false;
    return true;
  }
  if (slotType === "weapon_exilus_secondary") {
    if (isTomeWeapon(weaponId)) {
      return isTomeCanticleMod(mod);
    }
    if (!isSecondaryWeaponExilusMod(mod)) return false;
    if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) return false;
    return true;
  }
  if (slotType === "weapon_exilus_melee") {
    if (!isMeleeWeaponExilusMod(mod)) return false;
    if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) return false;
    return true;
  }

  if (!modMatchesExclusiveWeapon(mod.id, weaponId)) return false;

  if (!modMatchesWeaponBuilderCategory(mod, builderCategory, weaponId)) return false;

  if (isPrimaryWeaponExilusMod(mod) || isSecondaryWeaponExilusMod(mod) || isMeleeWeaponExilusMod(mod)) {
    return false;
  }

  if (weaponCategory && mod.category === "general") {
    if (!generalModAppliesToWeaponCategory(mod, weaponCategory)) return false;
  }

  if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) {
    return false;
  }

  return true;
}
