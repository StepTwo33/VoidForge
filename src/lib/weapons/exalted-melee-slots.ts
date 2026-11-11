import type { Mod, Weapon } from "@/lib/types";
import { getInnatePolarityEntry } from "@/lib/builds/innate-polarities";
import { modCapacityAtRank, modSlotCapacityCost } from "@/lib/calc/mod-capacity";

/**
 * Stance slots and their capacity on melee weapons, including Exalted melee.
 *
 * wiki.warframe.com/w/Stance: Stances "increase a weapon's mod capacity"; "All Stances provide a bonus
 * mod capacity of 5 when maxed, doubling it to 10 when placed on the matching polarity."
 *
 * wiki.warframe.com/w/Mod: "For Exalted Melee weapons (not including Garuda Talons), the Stance slot
 * is permanently occupied by an Ability-related Stance and can't be interacted with."
 * wiki.warframe.com/w/Exalted_Weapon, Update 38.5 (Techrot Encore): "All Exalted Stances now grant Mod
 * Capacity just like regular Stances. Additionally, we have applied the Zenurik Polarity to all Exalted
 * Stances and their corresponding Melee Stance slots, providing a +10 capacity boost." 38.5.2 removed
 * re-polarizing that slot. Garuda Talons "instead have the Madurai stance polarity and can use any Claw
 * stance mod". Exalted stance names and Zenurik polarity: wiki Module:Mods/data.
 */

/** Matched Zenurik exalted stance: +10 capacity (Update 38.5). */
export const EXALTED_STANCE_CAPACITY = 10;

/** Exalted melee weapon id -> its locked Ability stance (wiki Module:Mods/data, Polarity Zenurik). */
const FIXED_EXALTED_STANCES: Readonly<Record<string, string>> = {
  exalted_blade: "Exalted Blade",
  exalted_blade_prime: "Exalted Blade",
  exalted_blade_umbra: "Exalted Blade",
  iron_staff: "Primal Fury",
  iron_staff_prime: "Primal Fury",
  talons: "Hysteria",
  talons_prime: "Hysteria",
  desert_wind: "Serene Storm",
  desert_wind_prime: "Serene Storm",
  shadow_claws: "Ravenous Wraith",
  shadow_claws_prime: "Ravenous Wraith",
  diwata: "Razorwing",
  diwata_prime: "Razorwing",
  // Pseudo-exalted (Update 38.5 "New Exalted Weapons"); their stances are in Module:Mods/data too.
  landslide_fists: "Landslide",
  landslide_fists_prime: "Landslide",
  shattered_lash: "Shattered Lash",
  shattered_lash_prime: "Shattered Lash",
  whipclaw: "Whipclaw",
  whipclaw_prime: "Whipclaw",
  shadow_clones: "Blade Storm",
  shadow_clones_prime: "Blade Storm",
};

export type StanceSlotInfo =
  | { kind: "fixed"; stanceName: string; polarity: "zenurik"; capacity: number }
  | { kind: "choice"; polarity: string | undefined; stanceType: string | undefined };

type WeaponLike = Pick<Weapon, "id" | "category"> & Partial<Pick<Weapon, "isExalted" | "triggerType" | "stanceType">>;

/** Stance slot for a weapon: a locked exalted stance, a free choice, or none (non-melee / arch-melee). */
export function stanceSlotInfo(weapon: WeaponLike | null | undefined): StanceSlotInfo | null {
  if (!weapon) return null;
  const fixed = FIXED_EXALTED_STANCES[weapon.id];
  if (fixed) return { kind: "fixed", stanceName: fixed, polarity: "zenurik", capacity: EXALTED_STANCE_CAPACITY };
  if (weapon.category !== "melee") return null;
  return {
    kind: "choice",
    polarity: getInnatePolarityEntry("weapon", weapon.id)?.stance,
    stanceType: weapon.stanceType,
  };
}

/** Capacity a chosen stance adds at max rank on a slot of the given polarity (5 / 10 matched / 4 mismatched). */
export function stanceCapacityBonus(
  stance: Pick<Mod, "drain" | "maxRank" | "polarity"> | null | undefined,
  slotPolarity: string | undefined | null,
): number {
  if (!stance) return 0;
  const atMax = modCapacityAtRank(stance.drain, stance.maxRank);
  if (atMax >= 0) return 0;
  return -modSlotCapacityCost(atMax, slotPolarity, stance.polarity);
}

/** Capacity a weapon's stance slot adds: the locked exalted stance, or the chosen stance on the innate polarity. */
export function weaponStanceCapacity(
  weapon: WeaponLike | null | undefined,
  chosenStance: Pick<Mod, "drain" | "maxRank" | "polarity"> | null | undefined,
): number {
  const slot = stanceSlotInfo(weapon);
  if (!slot) return 0;
  if (slot.kind === "fixed") return slot.capacity;
  return stanceCapacityBonus(chosenStance, slot.polarity);
}

/** Exalted weapon max capacity: innate Catalyst (60 at rank 30) plus its stance. */
export function exaltedMaxCapacity(
  weapon: WeaponLike | null | undefined,
  chosenStance?: Pick<Mod, "drain" | "maxRank" | "polarity"> | null,
): number {
  return 60 + weaponStanceCapacity(weapon, chosenStance);
}

/** A chosen stance only counts when the weapon's stance slot is a free choice of the right type. */
export function isStanceAllowed(
  weapon: WeaponLike | null | undefined,
  stance: Pick<Mod, "id" | "category"> | null | undefined,
  stanceWeaponType: (id: string) => string | undefined,
): boolean {
  if (!stance || stance.category !== "stance") return false;
  const slot = stanceSlotInfo(weapon);
  if (!slot || slot.kind !== "choice") return false;
  if (!slot.stanceType) return true;
  return stanceWeaponType(stance.id) === slot.stanceType;
}
