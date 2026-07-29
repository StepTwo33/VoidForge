/**
 * Railjack crew weapon eligibility and adversary family filters.
 * @see https://wiki.warframe.com/w/Railjack/Crew#Customization
 */

import type { Weapon } from "@/lib/types";
import {
  PROGENITOR_BONUS_DEFAULT,
  PROGENITOR_BONUS_MAX,
  PROGENITOR_BONUS_MIN,
} from "@/lib/weapons/weapon-progenitor";
import type { CrewWeaponLoadout, RailjackCrewSlot } from "@/data/railjack-crew";

/** Wiki: rifle, shotgun, or secondary — not bows, spearguns, thrown, arm-cannons. */
const CREW_ASSIGNABLE_CATEGORIES = new Set(["rifle", "shotgun", "pistol", "secondary"]);

const CREW_EXCLUDED_CATEGORIES = new Set([
  "bow",
  "melee",
  "archgun",
  "archmelee",
  "sentinel_weapon",
  "beast_claw",
  "hound_weapon",
  "kitgun_chamber",
  "zaw_strike",
]);

/** Spearguns / thrown / arm-cannons that may sit in rifle/pistol categories. */
const CREW_EXCLUDED_WEAPON_IDS = new Set([
  "ferrox",
  "tenet_ferrox",
  "javlok",
  "scourge",
  "scourge_prime",
  "afentis",
  "speargun",
  "castanas",
  "sancti_castanas",
  "talons",
  "pox",
  "hikou",
  "hikou_prime",
  "despair",
  "kunai",
  "spira",
  "spira_prime",
  "mk1_kunai",
  "furax",
  "athodai", // arm-cannon-ish secondary
  "sepia",
  "cyanex",
]);

const CREW_EXCLUDED_NAME_FRAGMENTS = [
  "spear",
  "thrown",
  "glaive",
  "arm-cannon",
  "arm cannon",
];

export type AdversaryWeaponFamily = "kuva" | "tenet" | "coda";

export function adversaryWeaponFamily(
  profileId: string,
): AdversaryWeaponFamily | undefined {
  if (profileId === "kuva_lich") return "kuva";
  if (profileId === "sister_of_parvos") return "tenet";
  if (profileId === "technocyte_coda") return "coda";
  return undefined;
}

export function weaponMatchesAdversaryFamily(
  weaponId: string,
  family: AdversaryWeaponFamily,
): boolean {
  if (family === "kuva") return weaponId.startsWith("kuva_");
  if (family === "tenet") return weaponId.startsWith("tenet_");
  // Coda: coda_* or dual_coda_*
  return weaponId.startsWith("coda_") || weaponId.startsWith("dual_coda_");
}

export function isRailjackCrewAssignableWeapon(weapon: Pick<Weapon, "id" | "name" | "category">): boolean {
  if (CREW_EXCLUDED_CATEGORIES.has(weapon.category)) return false;
  if (!CREW_ASSIGNABLE_CATEGORIES.has(weapon.category)) return false;
  if (CREW_EXCLUDED_WEAPON_IDS.has(weapon.id)) return false;
  const name = weapon.name.toLowerCase();
  if (CREW_EXCLUDED_NAME_FRAGMENTS.some((f) => name.includes(f))) return false;
  // Archgun boarding weapons are never assignable
  if (weapon.category === "archgun") return false;
  return true;
}

export function filterAdversaryWeapons(
  profileId: string,
  weapons: Weapon[],
): Weapon[] {
  const family = adversaryWeaponFamily(profileId);
  if (!family) return [];
  return weapons.filter(
    (w) =>
      weaponMatchesAdversaryFamily(w.id, family) &&
      isRailjackCrewAssignableWeapon(w) &&
      w.category !== "archgun",
  );
}

export function filterCrewAssignableWeapons(weapons: Weapon[]): Weapon[] {
  return weapons.filter(isRailjackCrewAssignableWeapon);
}

export function clampProgenitorBonusPercent(value: number | undefined): number {
  const n = Number.isFinite(value) ? Number(value) : PROGENITOR_BONUS_DEFAULT;
  return Math.min(PROGENITOR_BONUS_MAX, Math.max(PROGENITOR_BONUS_MIN, Math.round(n)));
}

export function emptyCrewWeaponLoadout(weaponId: string): CrewWeaponLoadout {
  return {
    weaponId,
    mods: [],
    slotPolarities: {},
    hasOrokinCatalyst: true,
  };
}

/** Wiki: the same weapon cannot be given to two crew members. */
export function findDuplicateCrewWeaponIds(
  slots: (RailjackCrewSlot | null | undefined)[],
): string[] {
  const seen = new Map<string, number>();
  const dupes = new Set<string>();
  for (const slot of slots) {
    const id = slot?.weaponLoadout?.weaponId;
    if (!id) continue;
    const n = (seen.get(id) ?? 0) + 1;
    seen.set(id, n);
    if (n > 1) dupes.add(id);
  }
  return [...dupes];
}

export function isCrewWeaponTakenByOtherSlot(
  slots: (RailjackCrewSlot | null | undefined)[],
  weaponId: string,
  slotIndex: number,
): boolean {
  return slots.some(
    (s, i) => i !== slotIndex && s?.weaponLoadout?.weaponId === weaponId,
  );
}
