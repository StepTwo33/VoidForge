import type { Weapon, WeaponAlternateModeStats } from "@/lib/types";

/**
 * Some weapons ship two or more wiki paper profiles (Staticor charged fire, Dark
 * Split-Sword Heavy Blade form, Kuva Hind Burst / Semi-Auto). Catalog stores the
 * default; `alternateModeStats` holds the first toggled overlay and
 * `additionalAlternateModes` any further ones.
 */
export function getAlternateModes(weapon: Weapon | null | undefined): WeaponAlternateModeStats[] {
  if (!weapon?.alternateModeStats) return [];
  return [weapon.alternateModeStats, ...(weapon.additionalAlternateModes ?? [])];
}

export function weaponHasAlternateMode(weapon: Weapon | null | undefined): boolean {
  return getAlternateModes(weapon).length > 0;
}

/**
 * Merge alternate-mode overrides into the weapon's default catalog paper.
 * `index` selects the mode (0 = `alternateModeStats`); out-of-range → unchanged.
 */
export function applyAlternateMode(weapon: Weapon, index = 0): Weapon {
  const alt = getAlternateModes(weapon)[index];
  if (!alt) return weapon;
  const { radialAttacks, label: _label, ...statOverrides } = alt;
  const merged: Weapon = { ...weapon, ...statOverrides };
  if (radialAttacks) merged.radialAttacks = radialAttacks;
  return merged;
}
