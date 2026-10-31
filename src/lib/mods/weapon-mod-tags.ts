import type { Weapon } from "@/lib/types";
import {
  MOD_COMPATIBILITY_TAGS,
  MOD_EXCLUSIVE_WEAPON_IDS,
  MOD_INCOMPATIBILITY_TAGS,
  MOD_WEAPON_SPECIFIC_INCOMPAT_TAGS,
  WEAPON_WIKI_SPECIFIC_TAGS,
} from "@/data/mod-weapon-tags";
import { getWeaponRadialAttacks } from "@/lib/weapons/weapon-radial-utils";

/** Tags weapons carry for mod compatibility (mirrors wiki weapon tags). */
export type WeaponModProfileTag = string;

export interface WeaponModProfile {
  weaponId: string;
  category: string;
  triggerType: string;
  tags: ReadonlySet<WeaponModProfileTag>;
}

/** Sniper-class ids whose fire mode is not semi-auto (Charge / Auto). */
const NON_SEMI_SNIPER_IDS = new Set(["lanka", "buzlok"]);

/**
 * Kitgun chambers carry the wiki's MODULAR_GUN tag (Module:Weapons/data/modular tags Catchmoon, Sporelacer and
 * Tombfinger in both slots; the beam / auto chambers never reach a Cannonade anyway). Semi-Rifle and Semi-Shotgun
 * Cannonade list MODULAR_GUN as incompatible, so they can never go on a kitgun, whatever its class or trigger.
 * Semi-Pistol Cannonade has no such restriction: it needs a Semi-Auto trigger and the secondary slot.
 */
const KITGUN_ID_PREFIX = "kitgun_";

/** Wiki weapon tags for a built kitgun, by chamber (both slots). Tombfinger is tagged AOE on the wiki. */
const KITGUN_CHAMBER_WIKI_TAGS: Record<string, readonly string[]> = {
  catchmoon_chamber: ["MODULAR_GUN"],
  sporelacer_chamber: ["MODULAR_GUN"],
  tombfinger_chamber: ["MODULAR_GUN", "AOE"],
};

const STANCE_TYPE_TO_TAG: Record<string, string> = {
  blade_whip: "BLADE_AND_WHIP_STANCE",
  bladesaw: "BLADESAW_STANCE",
  claw: "CLAWS_STANCE_STANCE",
  dagger: "DAGGERS_STANCE",
  dual_daggers: "DUAL_DAGGERS_STANCE",
  dual_nikana: "DUAL_KATANAS_STANCE",
  dual_swords: "DUAL_SWORDS_STANCE",
  fist: "FIST_STANCE",
  glaive: "GLAIVES_STANCE",
  gunblade: "GUNBLADE_STANCE",
  hammer: "HAMMERS_STANCE",
  heavy_blade: "HEAVY_BLADE_STANCE",
  heavy_scythe: "HEAVY SCYTHE_STANCE",
  machete: "MACHETES_STANCE",
  nikana: "NIKANAS_STANCE",
  nunchaku: "NUNCHAKU_STANCE",
  polearm: "POLEARMS_STANCE",
  rapier: "RAPIER_STANCE",
  scythe: "SCYTHES_STANCE",
  sparring: "SPARRING_STANCE",
  staff: "STAVES_STANCE",
  sword: "SWORDS_STANCE",
  sword_shield: "SWORDS_AND_SHIELD_STANCE",
  tonfa: "TONFA_STANCE",
  two_handed_nikana: "LONG_KATANA_STANCE",
  warfan: "WARFAN_STANCE",
  whip: "WHIPS_STANCE",
};

function isKitgunWeapon(weapon: Pick<Weapon, "category" | "id"> & Partial<Pick<Weapon, "kitgunChamberCategory">>): boolean {
  return (
    weapon.kitgunChamberCategory != null ||
    weapon.id.startsWith(KITGUN_ID_PREFIX) ||
    (weapon.category || "").toLowerCase() === "kitgun_chamber"
  );
}

function kitgunChamberId(weaponId: string): string | undefined {
  if (!weaponId.startsWith(KITGUN_ID_PREFIX)) return undefined;
  return Object.keys(KITGUN_CHAMBER_WIKI_TAGS).find((c) => weaponId.startsWith(`${KITGUN_ID_PREFIX}${c}_`));
}

/** Infer wiki-style weapon tags from arsenal data. */
export function getWeaponModProfile(
  weapon: Pick<Weapon, "category" | "triggerType" | "id" | "name"> &
    Partial<Pick<Weapon, "kitgunChamberCategory" | "stanceType">>,
): WeaponModProfile {
  const tags = new Set<WeaponModProfileTag>();

  const trigger = (weapon.triggerType || "").toLowerCase();
  const category = (weapon.category || "").toLowerCase();

  if (category === "sentinel_weapon") {
    tags.add("SENTINEL_WEAPON");
  } else if (category === "hound_weapon") {
    tags.add("HOUND_WEAPON");
  }

  if (weapon.stanceType && STANCE_TYPE_TO_TAG[weapon.stanceType]) {
    tags.add(STANCE_TYPE_TO_TAG[weapon.stanceType]);
  }

  if (trigger === "held" || isKnownBeamWeapon(weapon.id)) {
    tags.add("POWER_WEAPON");
    tags.add("BEAM");
  }

  if (getWeaponRadialAttacks(weapon as Weapon).length > 0) {
    tags.add("AOE");
  }

  if (category === "bow" || category === "launcher") {
    tags.add("SINGLESHOT");
  } else if (trigger.startsWith("semi") || trigger === "charge") {
    tags.add("SINGLESHOT");
  } else if (trigger === "sniper" && !NON_SEMI_SNIPER_IDS.has(weapon.id)) {
    // Sniper class uses triggerType "Sniper" in arsenal data; most are semi-auto
    // (Rubico, Vectis, …) and need SINGLESHOT for Semi-Rifle Cannonade etc.
    tags.add("SINGLESHOT");
  }

  if (!tags.has("POWER_WEAPON")) {
    tags.add("PROJECTILE");
  }

  for (const tag of WEAPON_WIKI_SPECIFIC_TAGS[weapon.id] ?? []) {
    tags.add(tag);
  }

  if (isKitgunWeapon(weapon)) {
    tags.add("MODULAR_GUN");
    const chamber = kitgunChamberId(weapon.id);
    for (const tag of chamber ? KITGUN_CHAMBER_WIKI_TAGS[chamber] : []) tags.add(tag);
    if ((category === "rifle" || category === "primary") && trigger !== "shotgun") {
      tags.add("CLASS_ASSAULT_RIFLE");
      tags.add("ASSAULT_AMMO");
    }
  }

  return {
    weaponId: weapon.id,
    category: weapon.category,
    triggerType: weapon.triggerType,
    tags,
  };
}

function isKnownBeamWeapon(weaponId: string): boolean {
  // Mutalist Quanta fires cubes, not a beam — do not match via /quanta/.
  if (weaponId === "mutalist_quanta") return false;
  return /amprex|synoid|tigris_prime|glaxion|embolist|phage|convectrix|quanta|catabolyst|nukor|atomos|cycron|phantasma|onos|battacor/i.test(
    weaponId,
  );
}

/** Mod only equips on specific weapon(s); empty / undefined = universal. */
export function isWeaponExclusiveMod(modId: string): boolean {
  const exclusive = MOD_EXCLUSIVE_WEAPON_IDS[modId];
  return !!(exclusive?.length);
}

export function modMatchesExclusiveWeapon(
  modId: string,
  weaponId: string | undefined,
): boolean {
  if (!isWeaponExclusiveMod(modId)) return true;
  return !!weaponId && MOD_EXCLUSIVE_WEAPON_IDS[modId]!.includes(weaponId);
}

/** Whether a mod can be equipped on this weapon profile (wiki tag rules). */
export function modCompatibleWithWeaponProfile(
  modId: string,
  profile: WeaponModProfile,
): boolean {
  if (!modMatchesExclusiveWeapon(modId, profile.weaponId)) {
    return false;
  }

  // Exclusive ownership wins: skip wiki incompat tags that would nullify
  // a mod on its own listed weapon (e.g. POWER_WEAPON on beam exclusives).
  const exclusiveOwned = isWeaponExclusiveMod(modId);

  const required = MOD_COMPATIBILITY_TAGS[modId];
  if (required?.length) {
    const normalized = normalizeRequiredTags(required);
    if (!normalized.some((t) => profile.tags.has(t))) {
      return false;
    }
  }

  if (!exclusiveOwned) {
    const profileBlocked = MOD_INCOMPATIBILITY_TAGS[modId];
    if (profileBlocked?.length) {
      for (const tag of profileBlocked) {
        if (profile.tags.has(tag)) {
          return false;
        }
      }
    }
  }

  const weaponBlocked = MOD_WEAPON_SPECIFIC_INCOMPAT_TAGS[modId];
  if (weaponBlocked?.length) {
    for (const tag of weaponBlocked) {
      if (profile.tags.has(tag)) {
        return false;
      }
    }
  }

  return true;
}

function normalizeRequiredTags(tags: readonly string[]): string[] {
  return tags.map((t) => {
    if (t === "PROJECTILE") return "PROJECTILE";
    if (t === "BEAM") return "BEAM";
    if (t === "SEMI_AUTO") return "SINGLESHOT";
    return t;
  });
}

/** Human-readable exclusive weapon names for UI (optional). */
export function getModExclusiveWeaponIds(modId: string): readonly string[] | undefined {
  return MOD_EXCLUSIVE_WEAPON_IDS[modId];
}
