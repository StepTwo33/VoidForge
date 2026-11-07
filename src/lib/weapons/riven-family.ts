import { allWeapons } from "@/data/weapons";
import { customWeapons } from "@/data/custom-items";
import type { Weapon } from "@/lib/types";
import { getRivenWeaponType, type RivenWeaponType } from "./riven-weapon-type";

export type ExtendedRivenWeaponType = RivenWeaponType | "Kitgun" | "Zaw" | "Companion";

const PREFIXES = [
  "Prime ",
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

const allSourceWeapons = [...allWeapons, ...customWeapons];

// Cache of weapon names and byId for fast lookups
const weaponsByName = new Map<string, Weapon>();
const weaponsById = new Map<string, Weapon>();

for (const w of allSourceWeapons) {
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

const kitgunChambersDesc = allSourceWeapons
  .filter((w) => w.category === "kitgun_chamber" || w.kitgunChamberCategory != null)
  .sort((a, b) => b.id.length - a.id.length);

const zawStrikesDesc = allSourceWeapons
  .filter((w) => w.category === "zaw_strike" || w.category === "zaw")
  .sort((a, b) => b.id.length - a.id.length);

/**
 * Resolves a catalog weapon or modular assembled weapon ID (e.g.
 * `kitgun_sporelacer_haymaker_splat` → `kitgun_sporelacer`,
 * `zaw_sepfahn_peye_vargeet_ii_jai` → `zaw_sepfahn`) to its canonical catalog Weapon.
 * Returns `null` when the weapon ID does not correspond to any known weapon.
 */
export function resolveRivenWeapon(weaponOrId: Weapon | string | undefined | null): Weapon | null {
  if (!weaponOrId) return null;
  if (typeof weaponOrId !== "string") {
    const direct = weaponsById.get(weaponOrId.id);
    if (direct) return direct;
    const modular = resolveRivenWeapon(weaponOrId.id);
    return modular ?? weaponOrId;
  }
  const direct = weaponsById.get(weaponOrId);
  if (direct) return direct;
  if (weaponOrId.startsWith("kitgun_") || weaponOrId.endsWith("_chamber")) {
    const chamber = kitgunChambersDesc.find((w) => {
      const slug = w.id.replace(/^kitgun_/, "").replace(/_chamber$/, "");
      return (
        weaponOrId === w.id ||
        weaponOrId.includes(w.id) ||
        (slug.length >= 3 && weaponOrId.includes(slug))
      );
    });
    if (chamber) return chamber;
  } else if (weaponOrId.startsWith("zaw_")) {
    const strike = zawStrikesDesc.find((w) => {
      const slug = w.id.replace(/^zaw_/, "");
      return (
        weaponOrId === w.id ||
        weaponOrId.includes(w.id) ||
        (slug.length >= 3 && weaponOrId.includes(slug))
      );
    });
    if (strike) return strike;
  }
  return null;
}

/**
 * Given a weapon or weapon id, returns the canonical base weapon for Riven modding.
 */
export function getRivenBaseWeapon(weaponOrId: Weapon | string): Weapon {
  const w = resolveRivenWeapon(weaponOrId);
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
  const w = resolveRivenWeapon(weaponOrId);
  if (!w) return false;
  return getRivenBaseName(w.name) !== w.name;
}

/**
 * Returns all weapon IDs belonging to the same Riven family (e.g. "acceltra" and "acceltra_prime",
 * or "kitgun_sporelacer" for "kitgun_sporelacer_haymaker_splat").
 * Any Riven for this family equips on all these variants.
 */
export function getRivenFamilyWeaponIds(weaponId: string): string[] {
  const target = resolveRivenWeapon(weaponId);
  if (!target) return [weaponId];

  const baseName = getRivenBaseName(target.name);
  const familyIds: string[] = [weaponId, target.id];

  for (const w of allSourceWeapons) {
    if (getRivenBaseName(w.name) === baseName) {
      familyIds.push(w.id);
    }
  }

  return Array.from(new Set(familyIds));
}

/**
 * Returns the effective Riven category for display and filtering:
 * Rifle, Shotgun, Pistol, Melee, Kitgun, Zaw, Companion, Archgun.
 */
export function getEffectiveRivenWeaponType(
  weapon: Pick<Weapon, "category" | "name"> & { kitgunChamberCategory?: Weapon["kitgunChamberCategory"] },
): ExtendedRivenWeaponType | null {
  const cat = (weapon.category || "").toLowerCase();
  if (cat === "sentinel_weapon" || cat === "hound_weapon") {
    return "Companion";
  }
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
  return allSourceWeapons.filter((w) => {
    if (w.triggerType === "Zaw Component") return false;
    if (getRivenWeaponType(w) === null) return false;
    return !isRivenVariant(w);
  });
}
