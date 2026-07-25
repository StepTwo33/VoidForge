// Stance mod to melee weapon type mapping
// Derived from wiki CompatibilityTags (*_STANCE) in mod-weapon-tags.ts

export const STANCE_WEAPON_TYPE: Record<string, string> = {
  // Sword
  "rising_steel": "sword",
  "stance_crimson_dervish": "sword",
  "stance_iron_phoenix": "sword",
  "stance_swooping_falcon": "sword",
  "stance_vengeful_revenant": "sword",
  // Sword & Shield
  "eleventh_storm": "sword_shield",
  "final_harbinger": "sword_shield",
  "last_herald": "sword_shield",
  // Dual Swords
  "stance_carving_mantis": "dual_swords",
  "stance_crossing_snakes": "dual_swords",
  "stance_swirling_tiger": "dual_swords",
  // Dual Nikanas
  "mountains_edge": "dual_nikana",
  // Heavy Blade
  "noble_cadence": "heavy_blade",
  "rending_crane": "heavy_blade",
  "stance_cleaving_whirlwind": "heavy_blade",
  "stance_temporal_royale": "heavy_blade",
  // Heavy Scythe
  "galeforce_dawn": "heavy_scythe",
  // Polearm
  "argent_scourge": "polearm",
  "boreals_contempt": "polearm",
  "stance_bleeding_willow": "polearm",
  "stance_shimmering_blight": "polearm",
  "stance_twirling_spire": "polearm",
  // Whip
  "lashing_coil": "whip",
  "niras_contempt": "whip",
  "stance_burning_wasp": "whip",
  "stance_coiling_viper": "whip",
  // Fist
  "fracturing_wind": "fist",
  "gaias_tragedy": "fist",
  "quaking_hand": "fist",
  "stance_seismic_palm": "fist",
  // Claw
  "four_riders": "claw",
  "malicious_raptor": "claw",
  "scarlet_hurricane": "claw",
  "stance_vermillion_storm": "claw",
  // Nikana
  "blind_justice": "nikana",
  "fateful_truth": "nikana",
  "stance_decisive_judgement": "nikana",
  "tranquil_cleave": "nikana",
  // Two-Handed Nikana
  "stance_wise_razor": "two_handed_nikana",
  // Rapier
  "cunning_aspect": "rapier",
  "stance_vulpine_mask": "rapier",
  // Gunblade
  "stance_bullet_dance": "gunblade",
  "stance_high_noon": "gunblade",
  // Glaive
  "celestial_nightfall": "glaive",
  "gleaming_talon": "glaive",
  "stance_aurora_rush": "glaive",
  // Dagger
  "piercing_fury": "dagger",
  "stance_homing_fang": "dagger",
  "stance_pointed_wind": "dagger",
  "stance_stinging_thorn": "dagger",
  // Dual Daggers
  "amars_contempt": "dual_daggers",
  "biting_piranha": "dual_daggers",
  "dividing_blades": "dual_daggers",
  "stance_gnashing_payara": "dual_daggers",
  "stance_sinking_talon": "dual_daggers",
  "stance_spinning_needle": "dual_daggers",
  // Machete
  "cyclone_kraken": "machete",
  "rending_wind": "machete",
  "stance_sundering_weave": "machete",
  // Scythe
  "shadow_harvest": "scythe",
  "stance_reaping_spiral": "scythe",
  "stance_stalking_fan": "scythe",
  // Staff
  "crashing_timber": "staff",
  "stance_clashing_forest": "staff",
  "stance_flailing_branch": "staff",
  // Tonfa
  "gemini_cross": "tonfa",
  "sovereign_outcast": "tonfa",
  "star_divide": "tonfa",
  // Sparring
  "brutal_tide": "sparring",
  "stance_grim_fury_sparring": "sparring",
  "vicious_approach": "sparring",
  // Warfan
  "slicing_feathers": "warfan",
  "votive_onslaught": "warfan",
  // Blade & Whip
  "stance_defiled_snapdragon": "blade_whip",
  "tainted_hydra": "blade_whip",
  // Hammer
  "crashing_havoc": "hammer",
  "crushing_ruin": "hammer",
  "shattering_storm": "hammer",
  // Nunchaku
  "atlantis_vulcan": "nunchaku",
  "mafic_rain": "nunchaku",
  // Assault Saw
  "butchers_revelry": "bladesaw",
};

// Melee weapon type labels for display
export const MELEE_TYPE_LABELS: Record<string, string> = {
  sword: "Sword",
  sword_shield: "Sword & Shield",
  dual_swords: "Dual Swords",
  dual_nikana: "Dual Nikanas",
  heavy_blade: "Heavy Blade",
  heavy_scythe: "Heavy Scythe",
  polearm: "Polearm",
  whip: "Whip",
  fist: "Fist",
  claw: "Claw",
  nikana: "Nikana",
  two_handed_nikana: "Two-Handed Nikana",
  rapier: "Rapier",
  gunblade: "Gunblade",
  glaive: "Glaive",
  dagger: "Dagger",
  dual_daggers: "Dual Daggers",
  machete: "Machete",
  scythe: "Scythe",
  staff: "Staff",
  tonfa: "Tonfa",
  sparring: "Sparring",
  warfan: "Warfan",
  blade_whip: "Blade & Whip",
  hammer: "Hammer",
  nunchaku: "Nunchaku",
  bladesaw: "Assault Saw",
};

// Get stance weapon type from stance mod id
export function getStanceType(stanceId: string): string {
  return STANCE_WEAPON_TYPE[stanceId] || "unknown";
}

// Get all stance types present in the data
export function getAvailableStanceTypes(): string[] {
  return [...new Set(Object.values(STANCE_WEAPON_TYPE))].sort();
}
