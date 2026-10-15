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
};

/** Categories that can never hold a riven (amps, arch-melee, Tektolyst). */
const NO_RIVEN_CATEGORIES = new Set(["amp_prism", "archmelee", "tektolyst"]);

/**
 * Which riven stat table a weapon uses, or null when it cannot equip a riven
 * (exalted weapons, amps, arch-melee: flagged `hasRivenSlot: false` in data).
 */
export function getRivenWeaponType(
  weapon: Pick<Weapon, "name" | "category"> & { hasRivenSlot?: boolean },
): RivenWeaponType | null {
  if (weapon.hasRivenSlot === false) return null;
  const c = weapon.category.toLowerCase();
  if (NO_RIVEN_CATEGORIES.has(c)) return null;
  if (c === "sentinel_weapon") return SENTINEL_WEAPON_TYPE[weapon.name] ?? "Rifle";
  if (SHOTGUN_CLASS_PRIMARIES.has(weapon.name)) return "Shotgun";
  if (c === "shotgun") return "Shotgun";
  if (["rifle", "primary", "bow", "launcher", "sniper"].includes(c)) return "Rifle";
  // Kitgun rivens: VF chambers are the secondary (pistol-class) kitgun.
  if (["pistol", "secondary", "dual_pistols", "kitgun_chamber"].includes(c)) return "Pistol";
  // Zaw rivens use the Melee / Zaw column.
  if (c === "melee" || c === "zaw_strike") return "Melee";
  if (c === "archgun") return "Archgun";
  return null;
}

/** Riven placeholder for this weapon: same rules as the riven grader (getRivenWeaponType). */
export function rivenModMatchesWeapon(
  modId: string,
  weapon: (Pick<Weapon, "name" | "category"> & { hasRivenSlot?: boolean }) | undefined,
  weaponCategory: string | undefined,
): boolean {
  const target = weapon ?? (weaponCategory ? { name: "", category: weaponCategory } : undefined);
  const type = target ? getRivenWeaponType(target) : null;
  return type !== null && modId === `riven_${type.toLowerCase()}`;
}

