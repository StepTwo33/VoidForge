import { allWeapons } from "@/data/weapons";
import type { Weapon } from "@/lib/types";
import { getRivenWeaponType, type RivenWeaponType } from "./riven-weapon-type";

export type ExtendedRivenWeaponType = RivenWeaponType | "Kitgun" | "Zaw";

const PREFIXES = [
  "Kuva ",
  "Tenet ",
  "Prisma ",
  "Synoid ",
  "Telos ",
  "Secura ",
  "Rakta ",
  "Sancti ",
  "Vaykor ",
  "Mara ",
  "Dex ",
  "Ceti ",
  "Carmine ",
  "MK1-",
  "Mk1-",
];

const SUFFIXES = [" Prime", " Vandal", " Wraith"];

// Cache of weapon names and byId for fast lookups
const weaponsByName = new Map<string, Weapon>();
const weaponsById = new Map<string, Weapon>();

for (const w of allWeapons) {
  weaponsByName.set(w.name, w);
  weaponsById.set(w.id, w);
}

/**
 * Returns the canonical base weapon name for a Riven (e.g. "Acceltra Prime" -> "Acceltra",
 * "Kuva Nukor" -> "Nukor"). If no base weapon exists in the game (e.g. "Kuva Bramma",
 * "Dakra Prime", "Euphona Prime"), the name is preserved.
 */
export function getRivenBaseName(name: string): string {
  // Suffix checks first ("Acceltra Prime" -> "Acceltra")
  for (const s of SUFFIXES) {
    if (name.endsWith(s)) {
      const stripped = name.slice(0, -s.length).trim();
      if (weaponsByName.has(stripped)) {
        return stripped;
      }
    }
  }

  // Prefix checks ("Kuva Nukor" -> "Nukor")
  for (const p of PREFIXES) {
    if (name.startsWith(p)) {
      const stripped = name.slice(p.length).trim();
      if (weaponsByName.has(stripped)) {
        return stripped;
      }
    }
  }

  return name;
}

/**
 * Given a weapon or weapon id, returns the canonical base weapon for Riven modding.
 */
export function getRivenBaseWeapon(weaponOrId: Weapon | string): Weapon {
  const w = typeof weaponOrId === "string" ? weaponsById.get(weaponOrId) : weaponOrId;
  if (!w) {
    return allWeapons[0];
  }
  const baseName = getRivenBaseName(w.name);
  if (baseName === w.name) {
    return w;
  }
  return weaponsByName.get(baseName) ?? w;
}

/**
 * Returns true if the weapon is a variant (Prime, Kuva, Vandal, etc.) of another base weapon.
 */
export function isRivenVariant(weaponOrId: Weapon | string): boolean {
  const w = typeof weaponOrId === "string" ? weaponsById.get(weaponOrId) : weaponOrId;
  if (!w) return false;
  return getRivenBaseName(w.name) !== w.name;
}

/**
 * Returns all weapon IDs belonging to the same Riven family (e.g. "acceltra" and "acceltra_prime").
 * Any Riven for this family equips on all these variants.
 */
export function getRivenFamilyWeaponIds(weaponId: string): string[] {
  const target = weaponsById.get(weaponId);
  if (!target) return [weaponId];

  const baseName = getRivenBaseName(target.name);
  const familyIds: string[] = [];

  for (const w of allWeapons) {
    if (getRivenBaseName(w.name) === baseName) {
      familyIds.push(w.id);
    }
  }

  return familyIds.length > 0 ? familyIds : [weaponId];
}

/**
 * Returns the effective Riven category for display and filtering:
 * Rifle, Shotgun, Pistol, Melee, Kitgun, Zaw, Archgun.
 */
export function getEffectiveRivenWeaponType(
  weapon: Pick<Weapon, "category" | "name"> & { kitgunChamberCategory?: Weapon["kitgunChamberCategory"] },
): ExtendedRivenWeaponType | null {
  const cat = (weapon.category || "").toLowerCase();
  if (cat === "kitgun_chamber" || weapon.kitgunChamberCategory != null) {
    return "Kitgun";
  }
  if (cat === "zaw_strike" || cat === "zaw") {
    return "Zaw";
  }
  return getRivenWeaponType(weapon);
}

/**
 * Returns all base weapons eligible for Rivens (excluding variants so users only create base Rivens).
 */
export function getBaseRivenWeapons(): Weapon[] {
  return allWeapons.filter((w) => {
    if (w.triggerType === "Zaw Component") return false;
    if (getRivenWeaponType(w) === null) return false;
    return !isRivenVariant(w);
  });
}
