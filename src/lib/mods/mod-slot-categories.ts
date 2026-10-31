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
  "augment_wisp_fused_reservoir",
  // Augment / Exilus mods (wiki.warframe.com + fandom mod pages and Exilus Warframe Adapter
  // list). Still limited to their own frame by warframeAugmentEligibleInBuilder.
  // Controlled Slide (Nezha) and Warrior's Rest (Excalibur Umbra): both wikis call them
  // "Warframe Augment / Exilus Mod".
  "augment_saryn_revealing_spores",
  "augment_grendel_catapult",
  "augment_nova_escape_velocity",
  "augment_octavia_conductor",
  "augment_frost_cold_front",
  "anchored_glide",
  "repair_dispensary",
  "swing_line",
  "ironclad_flight",
  "controlled_slide",
  "warriors_rest",
  "augment_mesa_mess_waltz",
  "hysterical_assault",
  "aero_vantage",
  "anticipation",
  "gale_kick",
  "kavats_grace",
  "motus_signal",
  "pain_threshold",
  "piercing_step",
  "rending_turn",
  "retribution",
  "stealth_drift",
  "synth_reflex_r3",
  "thiefs_wit",
  "rush_r3",
  "maglev",
  "master_thief",
  "enemy_sense_r3",
  "vigilante_pursuit",
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
  "primed_sure_footed",
  "peculiar_audience",
  "peculiar_bloom",
  "peculiar_growth",
  "peculiar_end",
  "aviator",
  "agility_drift",
  "mobilize_r3",
  "patagium",
  "proton_pulse",
  "streamlined_form",
  "preparation_r10",
  "heavy_impact",
  "warm_coat",
  "amars_anguish",
  "boreals_anguish",
  "niras_anguish",
]);

/** Primary weapon Exilus slot (utility — ammo mutation, terminal velocity, etc.). */
export const PRIMARY_WEAPON_EXILUS_MOD_IDS = new Set([
  "adhesive_blast",
  "aerial_ace",
  "aero_periphery",
  "agile_aim",
  "ambush_optics",
  "ammo_drum",
  "arrow_mutation",
  "bhisaj_bal",
  "broad_eye",
  "cautious_shot",
  "counterbalance",
  "directed_convergence",
  "double_barrel_drift",
  "eagle_eye",
  "fatal_acceleration",
  "focused_acceleration",
  "fomorian_accelerant",
  "galvanized_acceleration",
  "guided_ordnance",
  "gun_glide",
  "hush_r3",
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
  "snap_shot",
  "sniper_ammo_mutation",
  "soft_hands",
  "stabilizer",
  "tactical_reload_r3",
  "terminal_velocity",
  "tether_grenades",
  "twitch",
  "vigilante_supplies",
  "vile_precision",
]);

/** Secondary weapon Exilus slot (utility; excludes Tome mods). */
export const SECONDARY_WEAPON_EXILUS_MOD_IDS = new Set([
  "air_recon",
  "eject_magazine",
  "energizing_shot",
  "hawk_eye",
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
]);

/** Melee weapon Exilus slot (utility / block / Tennokai). */
export const MELEE_WEAPON_EXILUS_MOD_IDS = new Set([
  // Tennokai + wiki Category:Exilus_Weapon_Mods (melee).
  "conditions_perfection",
  "disciplines_merit",
  "dispatch_overdrive",
  "dreamers_wrath",
  "masters_edge",
  "mentors_legacy",
  "opportunitys_reach",
  "truths_flame",
  // Update 35 melee Exilus utility.
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
