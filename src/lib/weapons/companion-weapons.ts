import type { Companion, Mod, Weapon } from "../types";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

/** Weapon categories that belong in Companion Builder only (not Weapon Builder). */
export const COMPANION_WEAPON_CATEGORIES = [
  "sentinel_weapon",
  "hound_weapon",
  "beast_claw",
] as const;

export type CompanionWeaponCategory = (typeof COMPANION_WEAPON_CATEGORIES)[number];

export function isCompanionWeaponCategory(category: string): boolean {
  return (COMPANION_WEAPON_CATEGORIES as readonly string[]).includes(category);
}

/** Wiki: these robotic guns take shotgun mods. Everything else listed as a rifle gun takes rifle mods. */
const SHOTGUN_SENTINEL_WEAPON_IDS = new Set(["sweeper", "sweeper_prime"]);
/** Wiki: Burst Laser family takes pistol mods. */
const PISTOL_SENTINEL_WEAPON_IDS = new Set([
  "burst_laser",
  "burst_laser_prime",
  "prisma_burst_laser",
]);
/** Glaives. Hound weapons are melee too. */
const MELEE_SENTINEL_WEAPON_IDS = new Set(["deconstructor", "deconstructor_prime"]);

export type CompanionWeaponModClass = "rifle" | "shotgun" | "pistol" | "melee" | "beast_claw";

/** Which ground-weapon mod class this companion weapon accepts. */
export function companionWeaponModClass(weapon: { id: string; category: string }): CompanionWeaponModClass {
  if (weapon.category === "beast_claw") return "beast_claw";
  if (weapon.category === "hound_weapon" || MELEE_SENTINEL_WEAPON_IDS.has(weapon.id)) return "melee";
  if (SHOTGUN_SENTINEL_WEAPON_IDS.has(weapon.id)) return "shotgun";
  if (PISTOL_SENTINEL_WEAPON_IDS.has(weapon.id)) return "pistol";
  return "rifle";
}

/** True when this mod belongs on the companion's weapon, not the companion itself. */
export function modFitsCompanionWeapon(
  mod: Pick<Mod, "id" | "category" | "subCategory" | "name" | "description" | "polarity">,
  weapon: Pick<Weapon, "id" | "category" | "triggerType" | "name">,
): boolean {
  const modClass = companionWeaponModClass(weapon);
  if (modClass === "beast_claw") {
    return (
      mod.category === "companion_weapon" &&
      (mod.subCategory === "beast_weapon" || mod.subCategory === "riven")
    );
  }
  if (mod.category === "companion" || mod.category === "companion_weapon") {
    return weapon.category === "sentinel_weapon" && mod.id === "fired_up";
  }
  if (mod.subCategory === "riven") {
    const rivenId =
      modClass === "shotgun" ? "riven_shotgun"
      : modClass === "pistol" ? "riven_pistol"
      : modClass === "melee" ? "riven_melee"
      : "riven_rifle";
    return mod.id === rivenId;
  }
  const builderCategory = modClass === "pistol" ? "secondary" : modClass === "melee" ? "melee" : "primary";
  const weaponCategory = modClass === "pistol" ? "pistol" : modClass;
  const profile = { ...getWeaponModProfile(weapon), category: weaponCategory };
  return modEligibleForWeaponSlot(mod as Mod, builderCategory, weaponCategory, "regular", profile);
}

/** Breed-specific claw weapon per companion id (not interchangeable within a family). */
export const COMPANION_CLAW_BY_ID: Record<string, string> = {
  chesa: "chesa_claws",
  huras: "huras_claws",
  raksa: "raksa_claws",
  sahasa: "sahasa_claws",
  sunika: "sunika_claws",
  helminth_charger: "helminth_claws",
  adarza: "adarza_claws",
  smeeta: "smeeta_claws",
  vizier_predasite: "vizier_claws",
  pharaoh_predasite: "pharaoh_claws",
  medjay_predasite: "medjay_claws",
  sly_vulpaphyla: "sly_claws",
  crescent_vulpaphyla: "crescent_claws",
  panzer_vulpaphyla: "panzer_claws",
};

/** Legacy name map for companions not keyed by id (e.g. Venari). */
export const COMPANION_CLAW_BY_NAME: Record<string, string> = {
  "Vasca Kavat": "vasca_claws",
  Venari: "venari_claws",
  "Venari Prime": "venari_prime_claws",
};

export function resolveCompanionClawId(companion: Companion): string | undefined {
  return COMPANION_CLAW_BY_ID[companion.id] ?? COMPANION_CLAW_BY_NAME[companion.name];
}

/** Hound model → default melee weapon id. */
export const HOUND_WEAPON_BY_ID: Record<string, string> = {
  bhaira_hound: "lacerten",
  dorma_hound: "batoten",
  hec_hound: "akaten",
};

export function resolveHoundWeaponId(companion: Companion): string | undefined {
  if (companion.type !== "hound") return undefined;
  return HOUND_WEAPON_BY_ID[companion.id];
}

/** @deprecated Use COMPANION_CLAW_BY_ID / resolveCompanionClawId */
export const COMPANION_CLAW_MAP: Record<string, string> = {
  "Chesa Kubrow": "chesa_claws",
  "Huras Kubrow": "huras_claws",
  "Raksa Kubrow": "raksa_claws",
  "Sahasa Kubrow": "sahasa_claws",
  "Sunika Kubrow": "sunika_claws",
  "Helminth Charger": "helminth_claws",
  "Adarza Kavat": "adarza_claws",
  "Smeeta Kavat": "smeeta_claws",
  ...COMPANION_CLAW_BY_NAME,
  "Vizier Predasite": "vizier_claws",
  "Pharaoh Predasite": "pharaoh_claws",
  "Medjay Predasite": "medjay_claws",
  "Sly Vulpaphyla": "sly_claws",
  "Crescent Vulpaphyla": "crescent_claws",
  "Panzer Vulpaphyla": "panzer_claws",
};

export function getCompanionWeapons(companion: Companion, weaponList: Weapon[]): Weapon[] {
  const type = companion.type;
  if (type === "sentinel") {
    return weaponList.filter((w) => w.category === "sentinel_weapon");
  }
  if (type === "kubrow" || type === "predasite" || type === "kavat" || type === "vulpaphyla") {
    const specificClawId = resolveCompanionClawId(companion);
    const allClaws = weaponList.filter((w) => w.category === "beast_claw");
    if (specificClawId) {
      return allClaws.filter((w) => w.id === specificClawId);
    }
    return allClaws.filter((w) => w.companionType === type || w.companionType === "kubrow");
  }
  if (type === "moa") {
    return weaponList.filter(
      (w) => w.category === "sentinel_weapon" && !w.name.toLowerCase().includes("deconstructor"),
    );
  }
  if (type === "hound") {
    return weaponList.filter((w) => w.category === "hound_weapon" || w.companionType === "hound");
  }
  return [];
}

/** Default weapon used for DPS when companion build has weapon mods but no explicit weapon id. */
export function resolveDefaultCompanionWeapon(companion: Companion, weaponList: Weapon[]): Weapon | null {
  const candidates = getCompanionWeapons(companion, weaponList);
  return candidates[0] ?? null;
}
