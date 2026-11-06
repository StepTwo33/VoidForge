import { MOD_EXCLUSIVE_WEAPON_IDS } from "@/data/mod-weapon-tags";
import { getEffectiveWeaponsMap } from "@/lib/weapons/effective-data";
import { getRivenFamilyWeaponIds } from "@/lib/weapons/riven-family";
import type { ModBrowserCategoryId } from "@/lib/mods/mod-browser-categories";

const PRIMARY_WEAPON_CATEGORIES = new Set([
  "rifle",
  "shotgun",
  "bow",
  "launcher",
  "primary",
]);

const ARCHGUN_WEAPON_CATEGORIES = new Set(["archgun"]);

const SECONDARY_WEAPON_CATEGORIES = new Set(["pistol", "secondary", "dual_pistols"]);

const MELEE_WEAPON_CATEGORIES = new Set(["melee", "archmelee", "zaw_strike"]);

function weaponIdToModBrowserCategory(weaponId: string): ModBrowserCategoryId | null {
  const weapon = getEffectiveWeaponsMap().get(weaponId);
  if (!weapon) return null;
  const category = weapon.category.toLowerCase();
  if (ARCHGUN_WEAPON_CATEGORIES.has(category)) return "archgun";
  if (PRIMARY_WEAPON_CATEGORIES.has(category)) return "primary";
  if (SECONDARY_WEAPON_CATEGORIES.has(category)) return "secondary";
  if (MELEE_WEAPON_CATEGORIES.has(category)) return "melee";
  return null;
}

let weaponToExclusiveMods: Map<string, string[]> | null = null;

function getWeaponToExclusiveModsIndex(): Map<string, string[]> {
  if (weaponToExclusiveMods) return weaponToExclusiveMods;
  weaponToExclusiveMods = new Map();
  for (const [modId, weaponIds] of Object.entries(MOD_EXCLUSIVE_WEAPON_IDS)) {
    for (const weaponId of weaponIds) {
      const list = weaponToExclusiveMods.get(weaponId) ?? [];
      list.push(modId);
      weaponToExclusiveMods.set(weaponId, list);
    }
  }
  for (const list of weaponToExclusiveMods.values()) {
    list.sort((a, b) => a.localeCompare(b));
  }
  return weaponToExclusiveMods;
}

/** Mod ids exclusive to this weapon (includes variants like supra + supra_vandal). */
export function getExclusiveModIdsForWeapon(weaponId: string): readonly string[] {
  const index = getWeaponToExclusiveModsIndex();
  const familyIds = getRivenFamilyWeaponIds(weaponId);
  const result = new Set<string>();
  for (const id of familyIds) {
    const list = index.get(id);
    if (list) {
      for (const m of list) result.add(m);
    }
  }
  return [...result].sort((a, b) => a.localeCompare(b));
}

/** Codex mod-browser tabs where a weapon-exclusive mod should appear (Primary / Secondary / Melee). */
export function getModCodexBrowserCategories(modId: string): ModBrowserCategoryId[] {
  const weaponIds = MOD_EXCLUSIVE_WEAPON_IDS[modId];
  if (!weaponIds?.length) return [];
  const categories = new Set<ModBrowserCategoryId>();
  for (const weaponId of weaponIds) {
    const slot = weaponIdToModBrowserCategory(weaponId);
    if (slot) categories.add(slot);
  }
  return [...categories];
}

export function getExclusiveWeaponEntries(
  modId: string,
): { id: string; name: string; category?: string }[] {
  const weaponIds = MOD_EXCLUSIVE_WEAPON_IDS[modId];
  if (!weaponIds?.length) return [];
  return weaponIds.map((id) => {
    const weapon = getEffectiveWeaponsMap().get(id);
    return {
      id,
      name: weapon?.name ?? id.replace(/_/g, " "),
      category: weapon?.category,
    };
  });
}
