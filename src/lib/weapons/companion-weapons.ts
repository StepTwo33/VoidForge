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

/**
 * Beast Claws mods that only fit some families (wiki.warframe.com Module:Mods/data Type):
 * Swipe "Kavat Claws", Mecha Overdrive "Kubrow Claws", Strain Fever "Helminth Charger".
 * Vulpaphyla page: "Beast and Kavat mods may be equipped on Vulpaphylas"; Predasite page: "Beast and
 * Kubrow mods may be equipped on Predasites"; Helminth Charger page: "Though classed as a Kubrow,
 * the Helminth Charger cannot be equipped with Mecha Overdrive."
 */
const CLAW_MOD_FAMILY_RULES: Readonly<Record<string, (clawId: string, family: string | undefined) => boolean>> = {
  swipe: (_id, family) => family === "kavat" || family === "vulpaphyla",
  mecha_overdrive: (id, family) => (family === "kubrow" || family === "predasite") && id !== "helminth_claws",
  strain_fever: (id) => id === "helminth_claws",
};

/** True when this mod belongs on the companion's weapon, not the companion itself. */
export function modFitsCompanionWeapon(
  mod: Pick<Mod, "id" | "category" | "subCategory" | "name" | "description" | "polarity">,
  weapon: Pick<Weapon, "id" | "category" | "triggerType" | "name" | "companionType">,
): boolean {
  const modClass = companionWeaponModClass(weapon);
  if (modClass === "beast_claw") {
    // Wiki Claws (Beast) Update 37.0: beast claws were not added to the Riven system.
    // Robotic weapons (sentinel, MOA, hound) use Companion Weapon Rivens instead.
    if (mod.subCategory === "riven" || mod.id === "companion_weapon_riven_mod") return false;
    const familyRule = CLAW_MOD_FAMILY_RULES[mod.id];
    if (familyRule && !familyRule(weapon.id, weapon.companionType)) return false;
    return (
      mod.category === "companion_weapon" &&
      mod.subCategory === "beast_weapon"
    );
  }
  if (mod.category === "companion" || mod.category === "companion_weapon") {
    if (weapon.category === "sentinel_weapon") {
      return mod.id === "fired_up" || mod.id === "companion_weapon_riven_mod";
    }
    if (weapon.category === "hound_weapon") {
      return mod.id === "companion_weapon_riven_mod";
    }
    return false;
  }
  if (mod.subCategory === "riven") {
    if (weapon.category === "sentinel_weapon" || weapon.category === "hound_weapon") {
      return mod.id === "companion_weapon_riven_mod";
    }
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
  vasca: "vasca_claws",
  vizier_predasite: "vizier_claws",
  pharaoh_predasite: "pharaoh_claws",
  medjay_predasite: "medjay_claws",
  sly_vulpaphyla: "sly_claws",
  crescent_vulpaphyla: "crescent_claws",
  panzer_vulpaphyla: "panzer_claws",
  venari: "venari_claws",
  venari_prime: "venari_prime_claws",
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

/** Wiki: Deconstructor and Deconstructor Prime can only be equipped by Helios and Helios Prime. */
const HELIOS_COMPANION_IDS = new Set(["helios", "helios_prime"]);
const HELIOS_EXCLUSIVE_WEAPON_IDS = new Set(["deconstructor", "deconstructor_prime"]);

/**
 * Signature / default companion body per companion weapon id.
 * Used when deep-linking or picking a companion weapon directly (e.g. Verglas → Nautilus).
 */
export const SIGNATURE_COMPANION_BY_WEAPON_ID: Readonly<Record<string, string>> = {
  // Sentinel signature weapons
  artax: "taxon",
  burst_laser: "shade",
  prisma_burst_laser: "prisma_shade",
  burst_laser_prime: "shade_prime",
  deconstructor: "helios",
  deconstructor_prime: "helios_prime",
  deth_machine_rifle: "dethcube",
  deth_machine_rifle_prime: "dethcube_prime",
  laser_rifle: "wyrm",
  prime_laser_rifle: "wyrm_prime",
  multron: "oxylus",
  stinger: "djinn",
  sweeper: "carrier",
  sweeper_prime: "carrier_prime",
  verglas: "nautilus",
  verglas_prime: "nautilus_prime",
  vulklok: "diriga",
  // Fortuna robotic weapons (MOA)
  cryotra: "lambeo",
  tazicor: "olaro",
  vulcax: "para",
  helstrum: "nidus_moa",
  // Hound melee weapons
  lacerten: "bhaira_hound",
  batoten: "dorma_hound",
  akaten: "hec_hound",
  // Beast claws (inverse of COMPANION_CLAW_BY_ID)
  ...Object.fromEntries(Object.entries(COMPANION_CLAW_BY_ID).map(([compId, clawId]) => [clawId, compId])),
};

export function getCompanionWeapons(companion: Companion, weaponList: Weapon[]): Weapon[] {
  const type = companion.type;
  if (type === "sentinel") {
    return weaponList.filter(
      (w) =>
        w.category === "sentinel_weapon" &&
        (!HELIOS_EXCLUSIVE_WEAPON_IDS.has(w.id) || HELIOS_COMPANION_IDS.has(companion.id)),
    );
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
      (w) =>
        w.category === "sentinel_weapon" &&
        !HELIOS_EXCLUSIVE_WEAPON_IDS.has(w.id) &&
        !w.name.toLowerCase().includes("deconstructor"),
    );
  }
  if (type === "hound") {
    return weaponList.filter((w) => w.category === "hound_weapon" || w.companionType === "hound");
  }
  return [];
}

/**
 * Resolve the signature or best-matching companion for a companion weapon
 * (e.g. Verglas → Nautilus, Verglas Prime → Nautilus Prime, Deconstructor → Helios).
 */
export function resolvePreferredCompanionForWeapon(
  weapon: Weapon,
  companions: readonly Companion[],
): Companion | null {
  const sigId = SIGNATURE_COMPANION_BY_WEAPON_ID[weapon.id];
  if (sigId) {
    const sig = companions.find((c) => c.id === sigId);
    if (sig && getCompanionWeapons(sig, [weapon]).some((w) => w.id === weapon.id)) {
      return sig;
    }
  }
  return (
    companions.find((c) => getCompanionWeapons(c, [weapon]).some((w) => w.id === weapon.id)) ??
    companions.find((c) => c.type === "sentinel") ??
    companions[0] ??
    null
  );
}

/** Default weapon used for DPS when companion build has weapon mods but no explicit weapon id. */
export function resolveDefaultCompanionWeapon(companion: Companion, weaponList: Weapon[]): Weapon | null {
  const candidates = getCompanionWeapons(companion, weaponList);
  return candidates[0] ?? null;
}

/**
 * Beast companions (Kubrow, Kavat, Predasite, Vulpaphyla) have their claws built into the
 * animal: the weapon is fixed per breed and cannot be swapped in the arsenal.
 */
export const BEAST_COMPANION_TYPES: ReadonlySet<string> = new Set(["kubrow", "kavat", "predasite", "vulpaphyla"]);

export function companionHasFixedWeapon(companion: Pick<Companion, "type"> | null | undefined): boolean {
  return !!companion && BEAST_COMPANION_TYPES.has(companion.type);
}

/** Beast claws: 8 regular slots + the Posture slot (index 8, Exilus-like). */
export const COMPANION_WEAPON_REGULAR_SLOT_COUNT = 8;
export const COMPANION_WEAPON_POSTURE_SLOT_INDEX = 8;

/** Posture mods (Elusive, Assassin, Balanced, Frenzied, Persistent, Protector). */
export function isCompanionPostureMod(mod: { id: string; name?: string }): boolean {
  return /_posture$/.test(mod.id) || /\bPosture$/.test(mod.name ?? "");
}

/**
 * Load migration: older Player Sync imports put a beast's posture mod in a regular claw
 * slot. Posture mods only fit the Posture slot in game, so move the first one there when
 * that slot is empty. Idempotent; returns the same array when nothing moves.
 */
export function migratePostureToPostureSlot<T extends { modId: string; slotIndex: number }>(
  weaponMods: T[],
  companion: Pick<Companion, "type"> | null | undefined,
): T[] {
  if (!companionHasFixedWeapon(companion)) return weaponMods;
  if (weaponMods.some((m) => m.slotIndex === COMPANION_WEAPON_POSTURE_SLOT_INDEX)) return weaponMods;
  const i = weaponMods.findIndex(
    (m) => m.slotIndex !== COMPANION_WEAPON_POSTURE_SLOT_INDEX && isCompanionPostureMod({ id: m.modId }),
  );
  if (i < 0) return weaponMods;
  const next = [...weaponMods];
  next[i] = { ...next[i], slotIndex: COMPANION_WEAPON_POSTURE_SLOT_INDEX };
  return next;
}


/**
 * Round 49: mods that wiki.warframe.com lists under "Beast Claws Mods" (Module:Mods/data Type
 * "Claws" / "Kavat Claws" / "Kubrow Claws" / "Helminth Charger"). Update 37 (Companion Rework
 * Phase 2) moved Bite, Maul, Hunter Synergy, Swipe, Mecha Overdrive (and the rest) from the beast
 * onto its claws; older saved builds still have them in the companion's own slots.
 */
export const CLAW_MODS_FORMERLY_ON_COMPANION: ReadonlySet<string> = new Set([
  "bite",
  "maul",
  "swipe",
  "brute_conditioning",
  "disabling_conditioning",
  "hunter_synergy",
  "immunity_resistance",
  "magnetic_strike",
  "mecha_overdrive",
  "strain_fever",
  "assassin_posture",
  "balanced_posture",
  "elusive_posture",
  "frenzied_posture",
  "persistent_posture",
  "protector_posture",
]);

/**
 * Load migration: move Beast Claws mods out of a beast's own mod slots into free claw slots
 * (postures to the Posture slot, the rest to the first free regular slot 0-7). A mod is left where
 * it is when the claws have no free slot or the claws can't take it (Swipe on a Kubrow); a copy
 * already on the claws drops the companion-slot copy. Returns the same arrays when nothing changes.
 */
export function migrateClawModsFromCompanion<
  C extends { modId: string; slotIndex: number },
  W extends { modId: string; slotIndex: number },
>(
  mods: readonly C[],
  weaponMods: readonly W[],
  companion: Pick<Companion, "id" | "name" | "type"> | null | undefined,
): { mods: C[]; weaponMods: W[]; moved: string[]; droppedDuplicates: string[] } {
  const unchanged = { mods: mods as C[], weaponMods: weaponMods as W[], moved: [], droppedDuplicates: [] };
  if (!companion || !companionHasFixedWeapon(companion)) return unchanged;
  if (!mods.some((m) => m && CLAW_MODS_FORMERLY_ON_COMPANION.has(m.modId))) return unchanged;
  const clawId = resolveCompanionClawId(companion as Companion) ?? "";
  const used = new Set(weaponMods.map((m) => m.slotIndex));
  const onClaws = new Set(weaponMods.map((m) => m.modId));
  const keptMods: C[] = [];
  const nextWeapon: W[] = [...weaponMods];
  const moved: string[] = [];
  const droppedDuplicates: string[] = [];
  for (const m of [...mods].sort((a, b) => a.slotIndex - b.slotIndex)) {
    if (!m || !CLAW_MODS_FORMERLY_ON_COMPANION.has(m.modId)) {
      keptMods.push(m);
      continue;
    }
    if (onClaws.has(m.modId)) {
      droppedDuplicates.push(m.modId);
      continue;
    }
    const familyRule = CLAW_MOD_FAMILY_RULES[m.modId];
    if (familyRule && !familyRule(clawId, companion.type)) {
      keptMods.push(m);
      continue;
    }
    let slot: number | undefined;
    if (isCompanionPostureMod({ id: m.modId })) {
      if (!used.has(COMPANION_WEAPON_POSTURE_SLOT_INDEX)) slot = COMPANION_WEAPON_POSTURE_SLOT_INDEX;
    } else {
      for (let i = 0; i < COMPANION_WEAPON_REGULAR_SLOT_COUNT; i++) {
        if (!used.has(i)) {
          slot = i;
          break;
        }
      }
    }
    if (slot == null) {
      keptMods.push(m);
      continue;
    }
    used.add(slot);
    onClaws.add(m.modId);
    nextWeapon.push({ ...(m as unknown as W), slotIndex: slot });
    moved.push(m.modId);
  }
  if (!moved.length && !droppedDuplicates.length) return unchanged;
  // Keep the original order of the companion's remaining mods.
  const keptSet = new Set(keptMods);
  return {
    mods: mods.filter((m) => keptSet.has(m)),
    weaponMods: nextWeapon.sort((a, b) => a.slotIndex - b.slotIndex),
    moved,
    droppedDuplicates,
  };
}
