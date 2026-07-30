// Mod exclusion groups: mods within the same group cannot be equipped together.
// This mirrors in-game restrictions (Primed/Umbral/Archon/Amalgam/Galvanized/Sacrificial variants).

export const MOD_EXCLUSION_GROUPS: string[][] = [
  // === WARFRAME MODS ===
  // Intensify variants
  ["intensify_r3", "umbra_intensify", "archon_intensify", "precision_intensify"],
  // Vitality variants
  ["vitality_r3", "umbra_vitality", "archon_vitality"],
  // Steel Fiber / Umbral Fiber
  ["steel_fiber_r3", "umbra_fiber"],
  // Continuity variants
  ["continuity_r3", "primed_continuity", "archon_continuity"],
  // Flow variants
  ["flow_r3", "primed_flow", "archon_flow"],
  // Stretch variants
  ["stretch_r3", "archon_stretch"],
  // Streamline / Primed
  ["streamline_r3", "primed_streamline"],
  // Vigor / Primed
  ["vigor_r5", "primed_vigor"],
  // Archon set warframe Hatred (mutually exclusive)
  ["amars_hatred", "boreals_hatred", "niras_hatred"],
  // Archon set Exilus Anguish (mutually exclusive)
  ["amars_anguish", "boreals_anguish", "niras_anguish"],

  // === PRIMARY (RIFLE) MODS ===
  // Serration / Amalgam Serration
  ["serration_r3", "amalgam_serration"],
  // Split Chamber / Galvanized Chamber
  ["split_chamber_r3", "galvanized_chamber"],
  // Shred / Primed Shred
  ["shred", "primed_shred"],
  // Firestorm / Primed Firestorm
  ["firestorm", "primed_firestorm"],
  // Magazine Warp / Primed / Amalgam Javlok
  ["magazine_warp_r3", "primed_magazine_warp", "amalgam_javlok_magazine_warp"],
  // Charged Chamber / Primed
  ["charged_chamber", "primed_charged_chamber"],
  // Stabilizer / Primed
  ["stabilizer", "primed_stabilizer"],
  // Combustion Rounds / Primed
  ["combustion_rounds", "primed_combustion_rounds"],
  // Rifle Ammo Mutation / Primed
  ["rifle_ammo_mutation", "primed_rifle_ammo_mutation"],
  // Sniper Ammo Mutation / Primed
  ["sniper_ammo_mutation", "primed_sniper_ammo_mutation"],
  // Bane faction mods / Primed
  ["bane_of_corpus", "primed_bane_of_corpus"],
  ["bane_of_grineer", "primed_bane_of_grineer"],
  ["bane_of_infested", "primed_bane_of_infested"],
  ["bane_of_orokin", "primed_bane_of_orokin"],
  ["bane_of_the_murmur", "primed_bane_of_the_murmur"],

  // === SECONDARY (PISTOL) MODS ===
  // Barrel Diffusion / Amalgam / Galvanized Diffusion
  ["barrel_diffusion_r3", "amalgam_barrel_diffusion", "galvanized_diffusion"],
  // Pistol Gambit / Primed
  ["pistol_gambit_r3", "primed_pistol_gambit"],
  // Target Cracker / Primed
  ["target_cracker_r3", "primed_target_cracker"],
  // Heated Charge / Primed
  ["heated_charge_r3", "primed_heated_charge"],
  // Pistol Ammo Mutation / Primed
  ["pistol_ammo_mutation", "primed_pistol_ammo_mutation"],
  // Slip Magazine / Primed
  ["slip_magazine_r3", "primed_slip_magazine"],
  // Steady Hands / Primed
  ["steady_hands", "primed_steady_hands"],
  // Fulmination / Primed
  ["fulmination", "primed_fulmination"],
  // Expel faction mods / Primed
  ["expel_corpus_r3", "primed_expel_corpus"],
  ["expel_grineer_r3", "primed_expel_grineer"],
  ["expel_infested_r3", "primed_expel_infested"],
  ["expel_orokin", "primed_expel_orokin"],
  ["expel_the_murmur", "primed_expel_the_murmur"],

  // === SHOTGUN MODS ===
  // Point Blank / Primed
  ["point_blank_r3", "primed_point_blank"],
  // Ravage / Primed
  ["ravage_r3", "primed_ravage"],
  // Hell's Chamber / Galvanized Hell
  ["hells_chamber", "galvanized_hell"],
  // Blunderbuss / Primed
  ["blunderbuss_r3", "primed_blunderbuss"],
  // Shotgun Barrage / Amalgam
  ["shotgun_barrage", "amalgam_shotgun_barrage"],
  // Shotgun Ammo Mutation / Primed
  ["ammo_mutation", "primed_shotgun_ammo_mutation"],
  // Ammo Stock / Primed
  ["ammo_stock_r3", "primed_ammo_stock"],
  // Dual Rounds / Primed
  ["dual_rounds", "primed_dual_rounds"],
  // Rubedo-Lined Barrel / Primed
  ["rubedo_lined_barrel", "primed_rubedo_lined_barrel"],
  // Venomous Clip / Primed
  ["venomous_clip", "primed_venomous_clip"],
  // Counterbalance / Primed
  ["counterbalance", "primed_counterbalance"],
  // Deadly Efficiency / Primed
  ["deadly_efficiency", "primed_deadly_efficiency"],
  // Ammo Chain / Primed
  ["ammo_chain", "primed_ammo_chain"],
  // Cleanse faction mods / Primed
  ["cleanse_corpus_r3", "primed_cleanse_corpus"],
  ["cleanse_grineer_r3", "primed_cleanse_grineer"],
  ["cleanse_infested_r3", "primed_cleanse_infested"],
  ["cleanse_orokin", "primed_cleanse_orokin"],
  ["cleanse_the_murmur", "primed_cleanse_the_murmur"],

  // === MELEE MODS ===
  // Pressure Point / Primed / Sacrificial Pressure
  ["pressure_point_r3", "primed_pressure_point", "sacrificial_pressure"],
  // True Steel / Sacrificial Steel
  ["true_steel_r3", "sacrificial_steel"],
  // Organ Shatter / Amalgam Organ Shatter
  ["organ_shatter_r3", "amalgam_organ_shatter"],
  // Reach / Primed
  ["reach_r3", "primed_reach"],
  // Fury / Primed
  ["fury_r3", "primed_fury"],
  // Heavy Trauma / Primed
  ["heavy_trauma", "primed_heavy_trauma"],
  // Smite faction mods / Primed
  ["smite_corpus_r3", "primed_smite_corpus"],
  ["smite_grineer_r3", "primed_smite_grineer"],
  ["smite_infested_r3", "primed_smite_infested"],
  ["smite_orokin", "primed_smite_orokin"],
  ["smite_the_murmur", "primed_smite_the_murmur"],

  // === COMPANION MODS ===
  // Animal Instinct / Primed
  ["animal_instinct", "primed_animal_instinct"],
  // Morphic Transformer / Primed
  ["morphic_transformer", "primed_morphic_transformer"],
];

// Build a lookup map: mod ID → Set of all conflicting mod IDs
const exclusionMap = new Map<string, Set<string>>();

for (const group of MOD_EXCLUSION_GROUPS) {
  for (const modId of group) {
    if (!exclusionMap.has(modId)) {
      exclusionMap.set(modId, new Set());
    }
    for (const otherId of group) {
      if (otherId !== modId) {
        exclusionMap.get(modId)!.add(otherId);
      }
    }
  }
}

/** Returns the set of mod IDs that conflict with the given mod ID, or empty set if none. */
export function getExcludedMods(modId: string): Set<string> {
  return exclusionMap.get(modId) || new Set();
}

/** Given a list of equipped mod IDs, returns the full set of mod IDs that are blocked. */
export function getBlockedModIds(equippedModIds: string[]): Set<string> {
  const blocked = new Set<string>();
  for (const id of equippedModIds) {
    const conflicts = exclusionMap.get(id);
    if (conflicts) {
      for (const c of conflicts) {
        blocked.add(c);
      }
    }
  }
  return blocked;
}
