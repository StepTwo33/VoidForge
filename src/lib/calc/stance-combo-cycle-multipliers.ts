/**
 * Stance combo cycle scalars (C6b): wiki Avg Dmg Multi/s at 1.0 AS = (Σ Dmg%/100) / Duration.
 * Paper DPS still × Attack Speed afterward. Default model remains hit-avg (B1/C6).
 */

export type StanceComboCycleDirection =
  | "neutral"
  | "forward"
  | "forwardBlock"
  | "block"
  | "heavy"
  | "slide";

export const STANCE_COMBO_CYCLE_MULTIPLIER: Record<
  string,
  Partial<Record<StanceComboCycleDirection, number>>
> = {
  atlantis_vulcan: { neutral: 3.0, forward: 2.3, forwardBlock: 3.8, block: 4.6 },
  blind_justice: { neutral: 7.3, forward: 4.3, forwardBlock: 6.1, block: 7.1, slide: 4.4 },
  brutal_tide: { neutral: 6.5, forward: 6.5, forwardBlock: 4.7, block: 6.5 },
  butchers_revelry: { neutral: 2.2, forward: 1.4, forwardBlock: 1.8, block: 3.0 },
  crushing_ruin: { neutral: 5.0, forward: 3.1, forwardBlock: 4.2, block: 4.4 },
  cyclone_kraken: { neutral: 4.1, forward: 2.6, forwardBlock: 4.8, block: 4.8 },
  eleventh_storm: { neutral: 5.4, forward: 4.3, forwardBlock: 5.0, block: 5.0 },
  final_harbinger: { neutral: 6.9, forward: 5.7, forwardBlock: 4.9, block: 5.6 },
  four_riders: { neutral: 5.7, forward: 4.1, forwardBlock: 5.0, block: 7.6, slide: 5.8 },
  fracturing_wind: { neutral: 5.8, forward: 3.9, forwardBlock: 6.3, block: 6.9 },
  gaias_tragedy: { neutral: 4.9, forward: 4.2, forwardBlock: 6.5, block: 3.9 },
  galeforce_dawn: { neutral: 2.9, forward: 2.3, forwardBlock: 2.9, block: 2.9 },
  gemini_cross: { neutral: 4.7, forward: 3.3, forwardBlock: 5.7, block: 6.0 },
  gleaming_talon: { neutral: 4.9, forward: 3.0, forwardBlock: 5.0 },
  malicious_raptor: { neutral: 5.7, forward: 5.0, forwardBlock: 3.5, block: 4.1 },
  mountains_edge: { neutral: 7.5, forward: 3.7, forwardBlock: 5.6, block: 7.5 },
  rending_crane: { neutral: 5.9, forward: 4.3, forwardBlock: 5.2, block: 4.8 },
  shattering_storm: { neutral: 5.1, forward: 3.5, forwardBlock: 5.4, block: 3.6 },
  slicing_feathers: { neutral: 5.3, forward: 6.1, forwardBlock: 5.1, block: 3.7 },
  sovereign_outcast: { neutral: 7.7, forward: 5.1, forwardBlock: 5.0, block: 7.2 },
  stance_aurora_rush: { neutral: 5.2, forward: 1.8, forwardBlock: 3.8, block: 4.6 },
  stance_bleeding_willow: { neutral: 5.3, forward: 5.3, forwardBlock: 4.6, block: 5.3 },
  stance_bullet_dance: { neutral: 4.2, forward: 3.3, forwardBlock: 4.6, block: 2.7 },
  stance_burning_wasp: { neutral: 3.2, forward: 1.7, forwardBlock: 3.3, block: 3.2 },
  stance_carving_mantis: { neutral: 4.9, forward: 4.7, forwardBlock: 6.7, block: 4.9 },
  stance_clashing_forest: { neutral: 6.9, forward: 2.4, forwardBlock: 4.8, block: 6.9 },
  stance_cleaving_whirlwind: { neutral: 5.8, forward: 2.6, forwardBlock: 7.0, block: 5.3 },
  stance_coiling_viper: { neutral: 3.7, forward: 3.7, forwardBlock: 2.2, block: 3.7 },
  stance_crimson_dervish: { neutral: 7.0, forward: 3.0, forwardBlock: 5.3, block: 7.0 },
  stance_crossing_snakes: { neutral: 6.7, forward: 4.9, forwardBlock: 4.5, block: 3.3 },
  stance_decisive_judgement: { neutral: 5.3, forward: 3.3, forwardBlock: 6.1, block: 5.2, slide: 3.0 },
  stance_defiled_snapdragon: { neutral: 5.4, forward: 4.9, forwardBlock: 3.0, block: 3.7 },
  stance_flailing_branch: { neutral: 3.8, forward: 5.4, forwardBlock: 4.4, block: 3.8 },
  stance_gnashing_payara: { neutral: 5.6, forward: 4.3, forwardBlock: 7.1, block: 5.6 },
  stance_grim_fury_sparring: { neutral: 6.8, forward: 5.7, forwardBlock: 4.3, block: 6.8 },
  stance_high_noon: { neutral: 4.0, forward: 3.2, forwardBlock: 3.2, block: 9.1 },
  stance_homing_fang: { neutral: 6.1, forward: 2.9, forwardBlock: 4.7, block: 6.1 },
  stance_iron_phoenix: { neutral: 5.2, forward: 4.6, forwardBlock: 5.0, block: 5.2 },
  stance_pointed_wind: { neutral: 7.7, forward: 5.6, forwardBlock: 5.6, block: 7.7 },
  stance_reaping_spiral: { neutral: 5.5, forward: 3.2, forwardBlock: 4.3, block: 5.5 },
  stance_seismic_palm: { neutral: 8.4, forward: 5.2, forwardBlock: 6.5, block: 6.3 },
  stance_shimmering_blight: { neutral: 5.3, forward: 5.3, forwardBlock: 5.1, block: 5.3 },
  stance_sinking_talon: { neutral: 3.5, forward: 3.5, forwardBlock: 5.2, block: 3.5 },
  stance_spinning_needle: { neutral: 5.9, forward: 6.0, forwardBlock: 5.6, block: 6.4 },
  stance_stalking_fan: { neutral: 3.1, forward: 3.2, forwardBlock: 4.2, block: 3.1 },
  stance_stinging_thorn: { neutral: 5.6, forward: 4.4, forwardBlock: 4.4, block: 5.1 },
  stance_sundering_weave: { neutral: 5.3, forward: 2.5, forwardBlock: 3.8, block: 4.2 },
  stance_swirling_tiger: { neutral: 5.4, forward: 5.6, forwardBlock: 6.1, block: 5.4 },
  stance_swooping_falcon: { neutral: 6.0, forward: 3.1, forwardBlock: 4.9, block: 4.4 },
  stance_temporal_royale: { neutral: 4.5, forward: 2.4, forwardBlock: 5.2, block: 3.9 },
  stance_twirling_spire: { neutral: 4.2, forward: 4.4, forwardBlock: 4.6, block: 6.0 },
  stance_vengeful_revenant: { neutral: 4.4, forward: 3.9, forwardBlock: 4.8, block: 3.7 },
  stance_vermillion_storm: { neutral: 6.6, forward: 4.7, forwardBlock: 4.7, block: 5.2 },
  stance_vulpine_mask: { neutral: 5.3, forward: 2.7, forwardBlock: 5.6, block: 6.2 },
  stance_wise_razor: { neutral: 3.9, forward: 3.1, forwardBlock: 4.3 },
  tranquil_cleave: { neutral: 3.4, forward: 3.7, forwardBlock: 3.5, block: 6.7, slide: 3.0 },
  votive_onslaught: { neutral: 7.8, forward: 5.4, forwardBlock: 6.8, block: 6.0 },
};

