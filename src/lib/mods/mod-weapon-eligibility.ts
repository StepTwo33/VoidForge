import type { Mod } from "@/lib/types";
import {
  isMeleeWeaponExilusMod,
  isPrimaryWeaponExilusMod,
  isSecondaryWeaponExilusMod,
  isTomeCanticleMod,
  isTomeMod,
} from "@/lib/mods/mod-slot-categories";
import { isAllowlistedRailjackPlexusMod } from "@/lib/mods/railjack-plexus-mods";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import {
  isWeaponExclusiveMod,
  modCompatibleWithWeaponProfile,
  modMatchesExclusiveWeapon,
  type WeaponModProfile,
} from "@/lib/mods/weapon-mod-tags";

export type WeaponModSlotType =
  | "regular"
  | "weapon_exilus_primary"
  | "weapon_exilus_secondary"
  | "weapon_exilus_melee";

const PRIMARY_WEAPON_CATEGORIES = new Set([
  "rifle",
  "shotgun",
  "bow",
  "primary",
  "launcher",
  "sentinel_weapon",
  "hound_weapon",
]);

const SECONDARY_WEAPON_CATEGORIES = new Set(["pistol", "secondary", "dual_pistols"]);

const MELEE_WEAPON_CATEGORIES = new Set(["melee", "beast_claw"]);

/** General-category mods that only apply to melee weapons. */
const GENERAL_MELEE_ONLY_IDS = new Set([
  "affinity_spike",
  "flowing_strikes",
  "fracturing_wind",
  "melee_riven_mod",
  "power_spike",
  "spectral_blades",
  "zaw_riven_mod",
]);

/** General-category riven / placeholder mods scoped to one weapon class. */
const GENERAL_RIVEN_PLACEHOLDER: Record<string, Set<string>> = {
  rifle_riven_mod: PRIMARY_WEAPON_CATEGORIES,
  pistol_riven_mod: SECONDARY_WEAPON_CATEGORIES,
  melee_riven_mod: MELEE_WEAPON_CATEGORIES,
  zaw_riven_mod: MELEE_WEAPON_CATEGORIES,
};

/**
 * Shotgun-only mods that are still miscategorized as `general` in mods.ts.
 * Keep as an id allowlist (not a mass category rewrite) so rifle builders deny them.
 */
const SHOTGUN_ONLY_MOD_IDS = new Set([
  "accelerated_blast_r3",
  "ammo_stock_r3",
  "amalgam_shotgun_barrage",
  "atomic_fallout",
  "blunderbuss_r3",
  "breach_loader",
  "charged_shell_r3",
  "chilling_grasp_r3",
  "chilling_reload",
  "cleanse_corpus_r3",
  "cleanse_grineer_r3",
  "cleanse_infested_r3",
  "cleanse_orokin",
  "cleanse_the_murmur",
  "contagious_spread_r3",
  "crash_shot",
  "critical_meltdown",
  "cryo_coating",
  "disruptor",
  "fatal_acceleration",
  "flechette",
  "frigid_blast_r3",
  "full_contact",
  "incendiary_coat_r3",
  "loaded_capacity",
  "loose_chamber",
  "magnetic_strafe",
  "magnetized_core",
  "nano_applicator",
  "primed_ammo_stock",
  "primed_blunderbuss",
  "primed_cleanse_corpus",
  "primed_cleanse_grineer",
  "primed_cleanse_infested",
  "primed_cleanse_orokin",
  "primed_cleanse_the_murmur",
  "primed_shotgun_ammo_mutation",
  "ravage_r3",
  "repeater_clip",
  "scattering_inferno_r3",
  "seeking_force_r3",
  "semi_shotgun_cannonade",
  "shell_compression",
  "shell_shock_r3",
  "shotgun_barrage",
  "shotgun_elementalist",
  "shotgun_riven_mod",
  "shotgun_savvy",
  "shrapnel_shot",
  "shred_shot",
  "shredder",
  "sweeping_serration",
  "tactical_pump_r3",
  "tainted_shell_r10",
  "toxic_barrage_r3",
]);

/** Placeholder / non-equipable junk that must never appear in weapon pickers. */
const GENERAL_JUNK_MOD_IDS = new Set([
  "amarsetmod",
  "ashensetmod",
  "augursetmod",
  "bonebladesetmod",
  "borealsetmod",
  "femursetmod",
  "gladiatorsetmod",
  "hawksetmod",
  "huntersetmod",
  "mechasetmod",
  "nirasetmod",
  "raptorsetmod",
  "sacrificesetmod",
  "spidersetmod",
  "strainsetmod",
  "synthsetmod",
  "teksetmod",
  "umbrasetmod",
  "vigilantesetmod",
]);

/** Requiem mods (Parazon) — not ground-weapon equippable. */
const REQUIEM_MOD_IDS = new Set([
  "fass",
  "jahu",
  "khra",
  "lohk",
  "netra",
  "oull",
  "ris",
  "vome",
  "xata",
]);

/** True when this mod is shotgun-class regardless of catalog category. */
export function isShotgunOnlyMod(mod: Pick<Mod, "id" | "name" | "category">): boolean {
  if (mod.category === "shotgun") return true;
  if (SHOTGUN_ONLY_MOD_IDS.has(mod.id)) return true;
  const blob = `${mod.id} ${mod.name}`.toLowerCase();
  return blob.includes("shotgun");
}

function isNonWeaponGeneralFamily(mod: Mod): boolean {
  if (GENERAL_JUNK_MOD_IDS.has(mod.id) || mod.id.endsWith("setmod")) return true;
  if (REQUIEM_MOD_IDS.has(mod.id)) return true;
  if (mod.id.endsWith("_posture") || mod.id.includes("posture")) return true;
  if (isAllowlistedRailjackPlexusMod(mod)) return true;
  const text = modText(mod);
  if (text.includes("fighting form devised for conclave") || text.includes("conclave")) {
    return true;
  }
  // Digimods / Nightwave antivirus novelty mods
  if (
    /\b(bytes?|malware|spyware|wetware|cyber-crime|disinfection|h[oö]llars|antivirus)\b/i.test(
      text,
    )
  ) {
    return true;
  }
  return false;
}

export function isPrimaryWeaponCategory(category: string): boolean {
  return PRIMARY_WEAPON_CATEGORIES.has(category);
}

export function isSecondaryWeaponCategory(category: string): boolean {
  return SECONDARY_WEAPON_CATEGORIES.has(category);
}

export function isMeleeWeaponCategory(category: string): boolean {
  return MELEE_WEAPON_CATEGORIES.has(category);
}

function modText(mod: Pick<Mod, "id" | "name" | "description">): string {
  return `${mod.id} ${mod.name} ${mod.description}`.toLowerCase();
}

/** Whether a `general` mod is eligible for the given ground weapon category. */
export function generalModAppliesToWeaponCategory(
  mod: Mod,
  weaponCategory: string,
): boolean {
  if (mod.category !== "general") return true;

  if (isNonWeaponGeneralFamily(mod)) return false;

  if (GENERAL_MELEE_ONLY_IDS.has(mod.id)) {
    return isMeleeWeaponCategory(weaponCategory);
  }

  const rivenScope = GENERAL_RIVEN_PLACEHOLDER[mod.id];
  if (rivenScope) {
    return rivenScope.has(weaponCategory);
  }

  // Shotgun-only generals never appear on non-shotgun weapons.
  if (isShotgunOnlyMod(mod) && weaponCategory !== "shotgun") {
    return false;
  }

  const text = modText(mod);

  if (text.includes("companion") || text.includes("kubrow") || text.includes("k-drive")) {
    return false;
  }

  if (isPrimaryWeaponCategory(weaponCategory)) {
    if (
      text.includes("melee attack") ||
      text.includes("melee affinity") ||
      text.includes("melee kills") ||
      text.includes("melee damage") ||
      text.includes("on melee") ||
      text.includes("with melee") ||
      text.includes("combo counter") ||
      text.includes("heavy attack") ||
      text.includes("while blocking") ||
      text.includes("slide attack")
    ) {
      return false;
    }
    if (/\bpistol\b/.test(text) || text.includes("secondary weapon") || text.includes("dual pistols")) {
      return false;
    }
    if (
      (mod.id.includes("pistol") || mod.name.toLowerCase().includes("pistol")) &&
      !mod.name.toLowerCase().includes("rifle")
    ) {
      return false;
    }
    if (
      (mod.id.includes("shotgun") || mod.name.toLowerCase().includes("shotgun")) &&
      weaponCategory !== "shotgun"
    ) {
      return false;
    }
    if (mod.id.includes("melee") || mod.name.toLowerCase().includes("melee")) {
      return false;
    }
    return true;
  }

  if (isSecondaryWeaponCategory(weaponCategory)) {
    if (
      text.includes("melee attack") ||
      text.includes("melee affinity") ||
      text.includes("combo counter") ||
      text.includes("heavy attack") ||
      text.includes("while blocking")
    ) {
      return false;
    }
    if (mod.id.includes("rifle") || mod.name.toLowerCase().includes("rifle")) {
      return false;
    }
    if (
      (mod.id.includes("shotgun") || mod.name.toLowerCase().includes("shotgun")) &&
      !mod.name.toLowerCase().includes("pistol")
    ) {
      return false;
    }
    if (mod.id.includes("melee") || mod.name.toLowerCase().includes("melee")) {
      return false;
    }
    return true;
  }

  if (isMeleeWeaponCategory(weaponCategory)) {
    if (/\bpistol\b/.test(text) || text.includes("rifle") || text.includes("shotgun")) {
      if (!text.includes("melee") && !text.includes("all weapons")) {
        return false;
      }
    }
    return true;
  }

  return true;
}

const WEAPON_BUILDER_CATEGORIES = new Set(["primary", "secondary", "melee", "archgun"]);

/** Typed primary-class mod categories that are not shotguns. */
const NON_SHOTGUN_PRIMARY_MOD_CATEGORIES = new Set([
  "rifle",
  "primary",
  "bow",
  "launcher",
]);

/**
 * Effective weapon class for primary builders.
 * Some shotguns are stored as `category: "primary"` with `triggerType: "Shotgun"`.
 */
export function resolvePrimaryWeaponClass(
  weaponCategory: string | undefined,
  weaponProfile?: Pick<WeaponModProfile, "category" | "triggerType">,
): string | undefined {
  const cat = (weaponCategory || weaponProfile?.category || "").toLowerCase();
  if (cat === "shotgun") return "shotgun";
  const trigger = (weaponProfile?.triggerType || "").toLowerCase();
  if (trigger === "shotgun") return "shotgun";
  return weaponCategory || weaponProfile?.category;
}

/**
 * After builder-category match: shotgun weapons deny rifle/primary/bow/launcher mods;
 * non-shotgun primaries deny shotgun-class mods (typed category or known shotgun ids).
 */
export function modMatchesPrimaryWeaponClass(
  mod: Pick<Mod, "id" | "name" | "category">,
  weaponClass: string,
): boolean {
  if (weaponClass === "shotgun") {
    if (NON_SHOTGUN_PRIMARY_MOD_CATEGORIES.has(mod.category)) return false;
    return true;
  }
  if (isPrimaryWeaponCategory(weaponClass) || weaponClass === "sniper") {
    if (isShotgunOnlyMod(mod)) return false;
    return true;
  }
  return true;
}

/** Categories that must never appear in ground-weapon / archgun builders. */
const NON_GROUND_WEAPON_MOD_CATEGORIES = new Set([
  "necramech",
  "archwing",
  "operator",
  "railjack",
  "parazon",
  "requiem",
  "conclave",
  "nightwave",
  "tektolyst",
  "utility",
  "set",
  "kdrive",
  "stance",
]);

/** True when a mod belongs to a non-ground-weapon family (category or Railjack allowlist). */
export function isNonGroundWeaponMod(mod: Pick<Mod, "id" | "category">): boolean {
  if (NON_GROUND_WEAPON_MOD_CATEGORIES.has(mod.category)) return true;
  // ID allowlist wins even if a data override rewrites category back to primary/general.
  if (isAllowlistedRailjackPlexusMod(mod)) return true;
  return false;
}

/** Category filter for weapon mod pickers (regular + typed categories). */
export function modMatchesWeaponBuilderCategory(
  mod: Mod,
  builderCategory: string,
  weaponId?: string,
): boolean {
  if (isNonGroundWeaponMod(mod)) return false;

  if (
    isWeaponExclusiveMod(mod.id) &&
    mod.category !== "stance" &&
    mod.category !== "general" &&
    modMatchesExclusiveWeapon(mod.id, weaponId) &&
    WEAPON_BUILDER_CATEGORIES.has(builderCategory)
  ) {
    return true;
  }

  if (builderCategory !== "archmelee" && mod.category === "archmelee") return false;
  if (builderCategory !== "archgun" && mod.category === "archgun") return false;

  if (mod.subCategory === "riven") {
    return false;
  }

  switch (builderCategory) {
    case "primary":
      return ["primary", "rifle", "shotgun", "bow", "launcher", "general"].includes(mod.category);
    case "secondary":
      return ["secondary", "pistol", "general"].includes(mod.category);
    case "melee":
      return mod.category === "melee" || mod.category === "general";
    default:
      return mod.category === builderCategory;
  }
}

/** Tome Canticle / Invocation mods only equip on tome weapons; canticles use Exilus only. */
export function tomeModEligibleForWeaponSlot(
  mod: Mod,
  weaponId: string | undefined,
  slotType: WeaponModSlotType,
): boolean {
  if (isTomeMod(mod)) {
    if (!isTomeWeapon(weaponId)) return false;
    if (isTomeCanticleMod(mod)) return slotType === "weapon_exilus_secondary";
    return slotType === "regular";
  }
  if (isTomeWeapon(weaponId) && slotType === "weapon_exilus_secondary") {
    return false;
  }
  return true;
}

/** Final eligibility for a weapon mod picker slot. */
export function modEligibleForWeaponSlot(
  mod: Mod,
  builderCategory: string,
  weaponCategory: string | undefined,
  slotType: WeaponModSlotType,
  weaponProfile?: WeaponModProfile,
): boolean {
  // Hard deny first — covers Exilus early-returns and category overrides.
  if (isNonGroundWeaponMod(mod)) return false;

  const weaponId = weaponProfile?.weaponId;

  if (!tomeModEligibleForWeaponSlot(mod, weaponId, slotType)) return false;

  if (slotType === "weapon_exilus_primary") {
    if (!isPrimaryWeaponExilusMod(mod)) return false;
    if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) return false;
    return true;
  }
  if (slotType === "weapon_exilus_secondary") {
    if (isTomeWeapon(weaponId)) {
      return isTomeCanticleMod(mod);
    }
    if (!isSecondaryWeaponExilusMod(mod)) return false;
    if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) return false;
    return true;
  }
  if (slotType === "weapon_exilus_melee") {
    if (!isMeleeWeaponExilusMod(mod)) return false;
    if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) return false;
    return true;
  }

  if (!modMatchesExclusiveWeapon(mod.id, weaponId)) return false;

  if (!modMatchesWeaponBuilderCategory(mod, builderCategory, weaponId)) return false;

  const effectiveWeaponClass = resolvePrimaryWeaponClass(weaponCategory, weaponProfile);

  if (
    builderCategory === "primary" &&
    effectiveWeaponClass &&
    !isWeaponExclusiveMod(mod.id)
  ) {
    if (!modMatchesPrimaryWeaponClass(mod, effectiveWeaponClass)) return false;
  }

  if (isPrimaryWeaponExilusMod(mod) || isSecondaryWeaponExilusMod(mod) || isMeleeWeaponExilusMod(mod)) {
    return false;
  }

  if (effectiveWeaponClass && mod.category === "general") {
    if (!generalModAppliesToWeaponCategory(mod, effectiveWeaponClass)) return false;
  }

  if (weaponProfile && !modCompatibleWithWeaponProfile(mod.id, weaponProfile)) {
    return false;
  }

  return true;
}
