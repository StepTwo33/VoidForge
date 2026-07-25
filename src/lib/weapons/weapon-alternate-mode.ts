import type { Weapon } from "@/lib/types";

/**
 * Some weapons ship two wiki paper profiles (Staticor charged fire, Dark
 * Split-Sword Heavy Blade form). Catalog stores the default; `alternateModeStats`
 * holds the toggled overlay.
 */
export function weaponHasAlternateMode(weapon: Weapon | null | undefined): boolean {
  return !!weapon?.alternateModeStats;
}

/** Merge alternate-mode overrides into the weapon's default catalog paper. */
export function applyAlternateMode(weapon: Weapon): Weapon {
  const alt = weapon.alternateModeStats;
  if (!alt) return weapon;
  const { radialAttacks, label: _label, ...statOverrides } = alt;
  const merged: Weapon = { ...weapon, ...statOverrides };
  if (radialAttacks) merged.radialAttacks = radialAttacks;
  return merged;
}
