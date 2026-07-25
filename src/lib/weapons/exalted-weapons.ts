import type { Weapon } from "@/lib/types";

const EXALTED_DAMAGE_KEYS = [
  "damage",
  "impact",
  "puncture",
  "slash",
  "heat",
  "cold",
  "toxin",
  "electricity",
  "radiation",
  "viral",
  "corrosive",
  "blast",
  "gas",
  "magnetic",
  "tau",
] as const;

/** Ability names that summon an exalted weapon (normalized lowercase). */
const ABILITY_EXALTED_ALIASES: Record<string, string[]> = {
  "exalted blade": ["exalted blade", "slash dash"],
  "peacemaker": ["peacemaker"],
  "artemis bow": ["artemis bow"],
  "hysteria": ["hysteria"],
  "primal fury": ["primal fury"],
  "razorwing": ["razorwing"],
  "balefire": ["balefire"],
  "serene storm": ["serene storm"],
  "exalted shadow": ["exalted shadow"],
  "noctua": ["noctua"],
  "neutralize": ["neutralize"],
  "glory on high": ["glory on high"],
  "guard mode": ["guard mode"],
  "exalted ironbride": ["exalted ironbride"],
  "blade storm": ["blade storm"],
  "landslide": ["landslide"],
  "shattered lash": ["shattered lash"],
  "whipclaw": ["whipclaw"],
  "exalted solo": ["exalted solo"],
  "slash dash": ["slash dash"],
  "passive": ["passive"],
};

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/** All exalted / signature weapons tied to a specific warframe id. */
export function getExaltedWeaponsForWarframe(warframeId: string, weapons: Weapon[]): Weapon[] {
  return weapons
    .filter((w) => w.isExalted && w.warframeId === warframeId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Primary exalted weapon shown in the warframe builder mod section (ranged / main). */
export function getPrimaryExaltedWeapon(warframeId: string, weapons: Weapon[]): Weapon | null {
  const owned = getExaltedWeaponsForWarframe(warframeId, weapons);
  if (owned.length === 0) return null;
  if (owned.length === 1) return owned[0];

  const preferId: Partial<Record<string, string>> = {
    excalibur: "exalted_blade",
    excalibur_prime: "exalted_blade_prime",
    excalibur_umbra: "exalted_blade_umbra",
    titania: "dex_pixia",
    titania_prime: "dex_pixia_prime",
    ash: "shadow_clones",
    ash_prime: "shadow_clones_prime",
    atlas: "landslide_fists",
    atlas_prime: "landslide_fists_prime",
    gara: "shattered_lash",
    gara_prime: "shattered_lash_prime",
    khora: "whipclaw",
    khora_prime: "whipclaw_prime",
    temple: "lizzie",
    garuda: "garuda_talons",
    garuda_prime: "garuda_prime_talons",
  };
  const preferred = preferId[warframeId];
  if (preferred) {
    const match = owned.find((w) => w.id === preferred);
    if (match) return match;
  }
  return owned[0];
}

/**
 * Secondary melee exalted when a frame has two (Titania Diwata alongside Dex Pixia).
 * Returns null when the primary is already melee or there is no second weapon.
 */
export function getMeleeExaltedWeapon(warframeId: string, weapons: Weapon[]): Weapon | null {
  const owned = getExaltedWeaponsForWarframe(warframeId, weapons);
  if (owned.length < 2) return null;
  const primary = getPrimaryExaltedWeapon(warframeId, weapons);
  const meleePrefer: Partial<Record<string, string>> = {
    titania: "diwata",
    titania_prime: "diwata_prime",
  };
  const preferred = meleePrefer[warframeId];
  if (preferred) {
    const match = owned.find((w) => w.id === preferred);
    if (match && match.id !== primary?.id) return match;
  }
  return (
    owned.find(
      (w) =>
        w.id !== primary?.id &&
        (w.category === "melee" || w.category === "archmelee" || w.triggerType === "Melee"),
    ) ?? null
  );
}

/** Match an ability name to its exalted weapon, if any. */
export function getExaltedWeaponForAbility(
  warframeId: string,
  abilityName: string,
  weapons: Weapon[],
): Weapon | null {
  const normalizedAbility = normalizeLabel(abilityName);
  const frameWeapons = getExaltedWeaponsForWarframe(warframeId, weapons);

  for (const weapon of frameWeapons) {
    if (!weapon.abilityName) continue;
    const normalizedWeaponAbility = normalizeLabel(weapon.abilityName);
    if (normalizedWeaponAbility === normalizedAbility) return weapon;
    const aliases = ABILITY_EXALTED_ALIASES[normalizedWeaponAbility];
    if (aliases?.includes(normalizedAbility)) return weapon;
  }

  for (const weapon of frameWeapons) {
    if (!weapon.abilityName) continue;
    const normalizedWeaponAbility = normalizeLabel(weapon.abilityName);
    if (
      normalizedAbility.includes(normalizedWeaponAbility) ||
      normalizedWeaponAbility.includes(normalizedAbility)
    ) {
      return weapon;
    }
  }

  return null;
}

export function warframeHasExaltedWeapons(warframeId: string, weapons: Weapon[]): boolean {
  return getExaltedWeaponsForWarframe(warframeId, weapons).length > 0;
}

/** Garuda Talons — always-on claws; wiki does not scale them with Ability Strength. */
export function exaltedIgnoresAbilityStrength(weapon: Pick<Weapon, "isExalted" | "abilityName">): boolean {
  if (!weapon.isExalted) return true;
  return normalizeLabel(weapon.abilityName ?? "") === "passive";
}

/**
 * Temple Lizzie / Exalted Solo: damage multiplier 1.25× is Serration-additive and
 * scales with Strength → paper bonus = 1.25×STR − 1 (at 100% STR → +25%).
 */
export function exaltedUsesAdditiveStrengthBonus(weapon: Pick<Weapon, "id" | "abilityName">): boolean {
  const id = weapon.id ?? "";
  if (id === "lizzie") return true;
  return normalizeLabel(weapon.abilityName ?? "") === "exalted solo";
}

/** Multiply exalted IPS / elements / damage by Ability Strength (1 = 100%). */
export function scaleExaltedWeaponByStrength(weapon: Weapon, abilityStrength: number): Weapon {
  if (!(abilityStrength > 0) || abilityStrength === 1) return weapon;
  const next: Weapon = { ...weapon };
  for (const key of EXALTED_DAMAGE_KEYS) {
    const v = next[key];
    if (typeof v === "number" && v !== 0) {
      (next as unknown as Record<string, number>)[key] = v * abilityStrength;
    }
  }
  return next;
}

/**
 * Resolve how Ability Strength applies to an exalted weapon for paper DPS.
 * Returns a (possibly scaled) weapon plus optional additive damage fraction.
 */
export function resolveExaltedStrengthForCalc(
  weapon: Weapon,
  abilityStrength: number | undefined,
): { weapon: Weapon; additiveStrengthBonus: number } {
  if (!weapon.isExalted || exaltedIgnoresAbilityStrength(weapon)) {
    return { weapon, additiveStrengthBonus: 0 };
  }
  const str =
    typeof abilityStrength === "number" && Number.isFinite(abilityStrength) && abilityStrength > 0
      ? abilityStrength
      : 1;
  if (exaltedUsesAdditiveStrengthBonus(weapon)) {
    return { weapon, additiveStrengthBonus: Math.max(0, 1.25 * str - 1) };
  }
  return { weapon: scaleExaltedWeaponByStrength(weapon, str), additiveStrengthBonus: 0 };
}
