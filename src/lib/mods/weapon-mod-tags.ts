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

/** Infer wiki-style weapon tags from arsenal data. */
export function getWeaponModProfile(
  weapon: Pick<Weapon, "category" | "triggerType" | "id" | "name">,
): WeaponModProfile {
  const tags = new Set<WeaponModProfileTag>();

  const trigger = (weapon.triggerType || "").toLowerCase();
  const category = (weapon.category || "").toLowerCase();

  if (trigger === "held" || isKnownBeamWeapon(weapon.id)) {
    tags.add("POWER_WEAPON");
    tags.add("BEAM");
  }

  if (getWeaponRadialAttacks(weapon as Weapon).length > 0) {
    tags.add("AOE");
  }

  if (category === "bow" || category === "launcher") {
    tags.add("SINGLESHOT");
  } else if (trigger === "semi" || trigger === "charge") {
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
