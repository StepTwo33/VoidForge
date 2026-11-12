import { isPrimaryWeaponCategory, isSecondaryWeaponCategory } from "@/lib/mods/mod-weapon-eligibility";

/** Display labels for weapon picker category filters. */
export const WEAPON_CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  primary: "All primary",
  rifle: "Rifles",
  shotgun: "Shotguns",
  bow: "Bows",
  secondary: "All secondary",
  pistol: "Pistols",
  melee: "Melee",
  launcher: "Launchers",
  archgun: "Archguns",
  archmelee: "Archmelee",
  tektolyst: "Tektolyst",
  companion: "Companion",
};

/** Map a weapon's data category onto the mod pool category used by ModPicker. */
export function getModCategory(weaponCategory: string): string {
  if (["rifle", "shotgun", "bow", "primary", "launcher"].includes(weaponCategory)) return "primary";
  if (weaponCategory === "archgun") return "archgun";
  if (["pistol", "secondary", "dual_pistols"].includes(weaponCategory)) return "secondary";
  if (weaponCategory === "archmelee") return "archmelee";
  // Round 54b: Zaw strikes are melee weapons (Blood Rush etc. were missing on ?weapon=zaw_*);
  // the lone "sniper" entry is a primary.
  if (weaponCategory === "melee" || weaponCategory === "zaw_strike") return "melee";
  if (weaponCategory === "sniper") return "primary";
  if (weaponCategory === "tektolyst") return "tektolyst";
  return weaponCategory;
}

/**
 * Catalog chip match. "All primary" includes rifles, shotguns, bows, launchers, and
 * anything else in the primary slot (not companion weapons). "Rifles" is the subset
 * whose data category is rifle. Same idea for "All secondary" vs "Pistols".
 */
export function weaponMatchesCategoryFilter(category: string, filter: string): boolean {
  if (!filter || filter === "all") return true;
  if (filter === "primary") {
    return isPrimaryWeaponCategory(category) && category !== "sentinel_weapon" && category !== "hound_weapon";
  }
  if (filter === "secondary") return isSecondaryWeaponCategory(category);
  return category === filter;
}
