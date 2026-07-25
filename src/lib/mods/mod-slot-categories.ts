import { Mod } from "@/lib/types";

/** In-game special mod slot types (mutually exclusive). */
export type ModSlotCategory = "exilus" | "tome" | "historic";

/** Tektolyst Artifact / Antique mods (Operator ultimate weapon mods). */
export function isHistoricMod(mod: Pick<Mod, "id" | "category">): boolean {
  return mod.category === "tektolyst";
}

/** Tome weapon mods — Canticles and Invocations (separate from Exilus in the codex). */
export const TOME_MOD_IDS = new Set([
  "fass_canticle",
  "jahu_canticle",
  "khra_canticle",
  "lohk_canticle",
  "netra_invocation",
  "ris_invocation",
  "vome_invocation",
  "xata_invocation",
]);

export function isTomeMod(mod: Pick<Mod, "id">): boolean {
  return TOME_MOD_IDS.has(mod.id);
}

export function isTomeCanticleMod(mod: Pick<Mod, "id">): boolean {
  return TOME_CANTICLE_MOD_IDS.has(mod.id);
}

export function isTomeInvocationMod(mod: Pick<Mod, "id">): boolean {
  return isTomeMod(mod) && !isTomeCanticleMod(mod);
}

/** Canticles only — eligible for the weapon Exilus slot on Tomes. */
export const TOME_CANTICLE_MOD_IDS = new Set([
  "fass_canticle",
  "jahu_canticle",
  "khra_canticle",
  "lohk_canticle",
]);

/** Warframe Exilus slot mods (utility / drift / mobility). */
export const WARFRAME_EXILUS_MOD_IDS = new Set([
  "rush_r3",
  "maglev",
  "master_thief",
  "intruder",
  "enemy_sense_r3",
  "vigilante_pursuit",
  "animal_instinct",
  "aura_cunning_drift",
  "endurance_drift",
  "power_drift",
  "speed_drift",
  "coaction_drift",
  "lightning_dash",
  "firewalker",
  "ice_spring",
  "toxic_flight",
  "battering_maneuver",
  "handspring_r10",
  "sure_footed_r5",
  "aviator",
  "agility_drift",
  "mobilize_r3",
  "patagium",
  "proton_pulse",
  "streamlined_form",
  "preparation_r10",
  "heavy_impact",
  "shock_absorbers",
  "warm_coat",
  "mecha_pulse_r3",
]);

/** Primary weapon Exilus slot (utility — ammo mutation, terminal velocity, etc.). */
export const PRIMARY_WEAPON_EXILUS_MOD_IDS = new Set([
  "adhesive_blast",
  "aerial_ace",
  "aero_periphery",
  "ambush_optics",
  "ammo_drum",
  "arrow_mutation",
  "bhisaj_bal",
  "broad_eye",
  "cautious_shot",
  "counterbalance",
  "fomorian_accelerant",
  "guided_ordnance",
  "gun_glide",
  "kinetic_ricochet",
  "lock_and_load",
  "mending_shot",
  "narrow_barrel",
  "overview",
  "primed_counterbalance",
  "primed_rifle_ammo_mutation",
  "primed_shotgun_ammo_mutation",
  "primed_sniper_ammo_mutation",
  "primed_stabilizer",
  "rifle_ammo_mutation",
  "shell_compression",
  "ammo_mutation",
  "silent_battery",
  "sinister_reach",
  "sniper_ammo_mutation",
  "stabilizer",
  "terminal_velocity",
  "tether_grenades",
  // Also melee Exilus-compatible (wiki Category:Exilus_Weapon_Mods).
  "directed_convergence",
  "focused_acceleration",
  "snap_shot",
  "soft_hands",
  "tactical_reload_r3",
  "twitch",
  "hush_r3",
  "vile_precision",
]);

/** Secondary weapon Exilus slot (utility; excludes Tome mods). */
export const SECONDARY_WEAPON_EXILUS_MOD_IDS = new Set([
  "agile_aim",
  "air_recon",
  "double_barrel_drift",
  "eject_magazine",
  "energizing_shot",
  "fatal_acceleration",
  "hawk_eye",
  "hush_r3",
  "lethal_momentum",
  "pistol_ammo_mutation",
  "primed_pistol_ammo_mutation",
  "primed_steady_hands",
  "reflex_draw",
  "ruinous_extension",
  "spry_sights",
  "steady_hands",
  "strafing_slide",
  "suppress_r3",
  "targeting_subsystem",
  "trick_mag_r3",
  "vigilante_supplies",
  "vile_precision",
]);

/** Melee weapon Exilus slot (utility / block / Tennokai). */
export const MELEE_WEAPON_EXILUS_MOD_IDS = new Set([
  // Tennokai + wiki Category:Exilus_Weapon_Mods (melee).
  "conditions_perfection",
  "directed_convergence",
  "disciplines_merit",
  "dispatch_overdrive",
  "dreamers_wrath",
  "focused_acceleration",
  "masters_edge",
  "mentors_legacy",
  "opportunitys_reach",
  "snap_shot",
  "soft_hands",
  "tactical_reload_r3",
  "truths_flame",
  "twitch",
  // Update 35 melee Exilus utility (not all listed in wiki category).
  "parry_r3",
  "focused_defense",
  "guardian_derision",
  "electromagnetic_shielding",
  "whirlwind",
]);

export function isWarframeExilusMod(mod: Pick<Mod, "id" | "category" | "polarity">): boolean {
  if (WARFRAME_EXILUS_MOD_IDS.has(mod.id)) return true;
  return mod.category === "augment" && mod.polarity === "exilus";
}

export function isPrimaryWeaponExilusMod(mod: Pick<Mod, "id">): boolean {
  return PRIMARY_WEAPON_EXILUS_MOD_IDS.has(mod.id);
}

export function isSecondaryWeaponExilusMod(mod: Pick<Mod, "id">): boolean {
  return SECONDARY_WEAPON_EXILUS_MOD_IDS.has(mod.id);
}

export function isMeleeWeaponExilusMod(mod: Pick<Mod, "id">): boolean {
  return MELEE_WEAPON_EXILUS_MOD_IDS.has(mod.id);
}

/** Any Exilus-eligible mod (warframe or weapon), excluding Tome and Historic. */
export function isExilusMod(mod: Mod): boolean {
  if (isHistoricMod(mod) || isTomeMod(mod)) return false;
  return (
    isWarframeExilusMod(mod) ||
    isPrimaryWeaponExilusMod(mod) ||
    isSecondaryWeaponExilusMod(mod) ||
    isMeleeWeaponExilusMod(mod)
  );
}

/**
 * Returns the single special-slot category for a mod, or null if it uses a regular slot.
 * Historic, Tome, and Exilus are mutually exclusive.
 */
export function getModSlotCategory(mod: Mod): ModSlotCategory | null {
  if (isHistoricMod(mod)) return "historic";
  if (isTomeMod(mod)) return "tome";
  if (isExilusMod(mod)) return "exilus";
  return null;
}

export function modSlotCategoryLabel(category: ModSlotCategory): string {
  switch (category) {
    case "exilus":
      return "Exilus";
    case "tome":
      return "Tome";
    case "historic":
      return "Historic";
  }
}
