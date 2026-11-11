import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import type { Mod } from "@/lib/types";
import { isWeaponExclusiveMod } from "@/lib/mods/weapon-mod-tags";
import { getExclusiveModIdsForWeapon } from "@/lib/mods/weapon-exclusive-mods";

/** Universal archgun slot mods, including the Archgun Riven placeholder. */
/** Weapon-exclusive augments for this archgun (empty today — Warframe has none). */
export function getArchgunWeaponAugmentModIds(weaponId: string): readonly string[] {
  return getExclusiveModIdsForWeapon(weaponId).filter((modId) => {
    const mod = getEffectiveModsMap().get(modId);
    return mod && isArchgunWeaponAugment(mod);
  });
}

export function isArchgunWeaponAugment(
  mod: Pick<Mod, "id" | "category" | "subCategory">,
): boolean {
  if (!isWeaponExclusiveMod(mod.id)) return false;
  if (mod.subCategory === "weapon") return true;
  return mod.category === "augment" || mod.category === "archgun";
}

/** Mods available in the archwing builder archgun picker for a selected weapon. */
export function archgunModsForBuilder(weaponId: string | undefined): Mod[] {
  const exclusiveIds = new Set(weaponId ? getArchgunWeaponAugmentModIds(weaponId) : []);
  const out: Mod[] = [];
  for (const mod of getEffectiveModsMap().values()) {
    if (exclusiveIds.has(mod.id)) {
      out.push(mod);
      continue;
    }
    if (mod.category === "archgun") {
      out.push(mod);
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
