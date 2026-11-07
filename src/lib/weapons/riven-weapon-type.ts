import type { Weapon } from "@/lib/types";

export type RivenWeaponType = "Rifle" | "Shotgun" | "Pistol" | "Melee" | "Archgun";

/**
 * Wiki: primaries whose class is Shotgun but whose catalog category is "primary".
 * https://wiki.warframe.com/w/Module:Weapons/data/primary
 */
const SHOTGUN_CLASS_PRIMARIES = new Set(["Kuva Hek", "Phantasma", "Phantasma Prime"]);

/**
 * Wiki Riven Mods: "Sentinel weapons use the base values of their associated weapon class
 * (e.g. Deconstructor = Melee, Sweeper = Shotgun)". Others are Rifle class
 * (Module:Weapons/data/companion).
 */
const SENTINEL_WEAPON_TYPE: Record<string, RivenWeaponType> = {
  Sweeper: "Shotgun",
  "Sweeper Prime": "Shotgun",
  Deconstructor: "Melee",
  "Deconstructor Prime": "Melee",
  "Burst Laser": "Pistol",
  "Burst Laser Prime": "Pistol",
  "Prisma Burst Laser": "Pistol",
  "Shade Burst Laser": "Pistol",
};

/** Categories that can never hold a riven (amps, arch-melee, Tektolyst, beast claws). */
const NO_RIVEN_CATEGORIES = new Set(["amp_prism", "archmelee", "tektolyst", "beast_claw"]);

/**
 * Which riven stat table a weapon uses, or null when it cannot equip a riven
 * (exalted weapons, amps, arch-melee: flagged `hasRivenSlot: false` in data).
 */
export function getRivenWeaponType(
  weapon: Pick<Weapon, "name" | "category"> & {
    hasRivenSlot?: boolean;
    kitgunChamberCategory?: Weapon["kitgunChamberCategory"];
    arcaneType?: string;
    id?: string;
  },
): RivenWeaponType | null {
  if (weapon.hasRivenSlot === false) return null;
  const c = weapon.category.toLowerCase();
  if (NO_RIVEN_CATEGORIES.has(c)) return null;
  // Wiki Riven Mods: kitguns use the "Pistol / Kitgun" stat column in either slot (a primary kitgun
  // is category "primary"/"shotgun" here, but its Riven pool is still Pistol / Kitgun, not Rifle / Shotgun).
  if (isKitgunWeapon(weapon)) return "Pistol";
  // Zaw rivens use the Melee / Zaw column.
  if (isZawWeapon(weapon)) return "Melee";
  if (c === "sentinel_weapon") return SENTINEL_WEAPON_TYPE[weapon.name] ?? "Rifle";
  if (c === "hound_weapon") return "Melee";
  if (SHOTGUN_CLASS_PRIMARIES.has(weapon.name)) return "Shotgun";
  if (c === "shotgun") return "Shotgun";
  if (["rifle", "primary", "bow", "launcher", "sniper"].includes(c)) return "Rifle";
  if (["pistol", "secondary", "dual_pistols", "kitgun_chamber"].includes(c)) return "Pistol";
  if (c === "melee" || c === "zaw_strike") return "Melee";
  if (c === "archgun") return "Archgun";
  return null;
}

export function isZawWeapon(
  weapon: (Pick<Weapon, "name" | "category"> & { arcaneType?: string; id?: string }) | undefined,
): boolean {
  if (!weapon) return false;
  const c = (weapon.category || "").toLowerCase();
  if (c === "zaw_strike" || c === "zaw") return true;
  if (weapon.arcaneType === "exodia") return true;
  if (weapon.id && weapon.id.startsWith("zaw_")) return true;
  return false;
}

export function isKitgunWeapon(
  weapon: (Pick<Weapon, "name" | "category"> & { kitgunChamberCategory?: Weapon["kitgunChamberCategory"]; arcaneType?: string; id?: string }) | undefined,
): boolean {
  if (!weapon) return false;
  const c = (weapon.category || "").toLowerCase();
  if (c === "kitgun_chamber" || weapon.kitgunChamberCategory != null) return true;
  if (weapon.arcaneType === "kitgun") return true;
  if (weapon.id && weapon.id.startsWith("kitgun_")) return true;
  return false;
}

/** Riven placeholder for this weapon: matches exact in-game Riven category (Zaw, Kitgun, Companion, Melee, Rifle, Shotgun, Pistol, Archgun). */
export function rivenModMatchesWeapon(
  modId: string,
  weapon: (Pick<Weapon, "name" | "category"> & { hasRivenSlot?: boolean; kitgunChamberCategory?: Weapon["kitgunChamberCategory"]; arcaneType?: string; id?: string }) | undefined,
  weaponCategory?: string,
): boolean {
  const target = weapon ?? (weaponCategory ? { name: "", category: weaponCategory } : undefined);
  if (!target) return false;

  // 1. Zaws: ONLY match zaw_riven_mod! They can NEVER use riven_melee!
  if (isZawWeapon(target)) {
    return modId === "zaw_riven_mod";
  }

  // 2. Kitguns: ONLY match kitgun_riven_mod! They can NEVER use riven_pistol or riven_rifle!
  if (isKitgunWeapon(target)) {
    return modId === "kitgun_riven_mod";
  }

  // 3. Sentinel / Companion weapons: ONLY match companion_weapon_riven_mod!
  const c = (target.category || "").toLowerCase();
  if (c === "sentinel_weapon" || c === "hound_weapon") {
    return modId === "companion_weapon_riven_mod";
  }

  // 4. Deny zaw, kitgun, or companion weapon rivens on regular weapons:
  if (modId === "zaw_riven_mod" || modId === "kitgun_riven_mod" || modId === "companion_weapon_riven_mod") {
    return false;
  }

  const type = getRivenWeaponType(target);
  return type !== null && modId === `riven_${type.toLowerCase()}`;
}

/**
 * Riven catalog modId for a weapon (null when the weapon cannot equip a riven).
 * Maps:
 * - Zaws -> zaw_riven_mod
 * - Kitguns -> kitgun_riven_mod
 * - Sentinel / Hound weapons -> companion_weapon_riven_mod
 * - Rifles, Shotguns, Pistols, Melee, Archguns -> riven_<type>
 */
export function getRivenModIdForWeapon(
  weapon:
    | (Pick<Weapon, "name" | "category"> & {
        id?: string;
        hasRivenSlot?: boolean;
        kitgunChamberCategory?: Weapon["kitgunChamberCategory"];
        arcaneType?: string;
      })
    | undefined
    | null,
): string | null {
  if (!weapon) return null;
  if (isZawWeapon(weapon)) return "zaw_riven_mod";
  if (isKitgunWeapon(weapon)) return "kitgun_riven_mod";
  const cat = (weapon.category || "").toLowerCase();
  if (cat === "sentinel_weapon" || cat === "hound_weapon") return "companion_weapon_riven_mod";
  const type = getRivenWeaponType(weapon);
  return type ? `riven_${type.toLowerCase()}` : null;
}

