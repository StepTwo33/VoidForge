import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { allWarframes } from "@/data/warframes";
import { allCompanions } from "@/data/companions";
import { allMods } from "@/data/mods";
import { ENEMY_TYPES } from "@/data/enemies";
import { isNecramechId } from "@/data/archwing";

/**
 * Weapon categories the Weapon Builder picker hides (they're built in the Modular
 * or Companion builders). Mirrors the list inside `filteredWeapons` in
 * src/app/weapon-builder/page.tsx; catalog-counts.test.ts checks the two agree.
 */
export const WEAPON_PICKER_HIDDEN_CATEGORIES = [
  "amp_prism",
  "zaw_strike",
  "kitgun_chamber",
  "sentinel_weapon",
  "hound_weapon",
  "beast_claw",
] as const;

export interface CatalogCounts {
  /** Rows the Weapon Builder picker lists ("All" tab). */
  weaponPicker: number;
  /** Raw weapon entries, including modular parts and companion weapons. */
  weaponRaw: number;
  /** Rows the Warframe Builder picker lists (no Helminth, no Necramechs). */
  warframePicker: number;
  /** Raw warframe entries, including Helminth and the Necramechs. */
  warframeRaw: number;
  companions: number;
  companionMods: number;
  enemies: number;
}

export function getCatalogCounts(): CatalogCounts {
  const weapons = getEffectiveWeapons();
  const hidden = new Set<string>(WEAPON_PICKER_HIDDEN_CATEGORIES);
  return {
    weaponPicker: weapons.filter((w) => !hidden.has(w.category)).length,
    weaponRaw: weapons.length,
    warframePicker: allWarframes.filter((w) => w.id !== "helminth" && !isNecramechId(w.id)).length,
    warframeRaw: allWarframes.length,
    companions: allCompanions.length,
    companionMods: allMods.filter((m) => m.category === "companion").length,
    enemies: ENEMY_TYPES.length,
  };
}
