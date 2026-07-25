/**
 * Per-mod verified behaviors — category: stance (41 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py stance
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_STANCE: Record<string, VerifiedModBehavior> = {
  stance_aurora_rush: mod("stance_aurora_rush", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Astral Twilight: damageBonus \u2014 Orbiting slashes and lashing strikes."),
  ]),
  stance_bleeding_willow: mod("stance_bleeding_willow", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Bleeding Willow: damageBonus \u2014 A blend of strong and rapid strikes with leaping combos."),
  ]),
  stance_bullet_dance: mod("stance_bullet_dance", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Bullet Dance: damageBonus \u2014 Sharpened blades dance with gunfire."),
  ]),
  stance_burning_wasp: mod("stance_burning_wasp", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Burning Wasp: damageBonus \u2014 Whip stance: Fast strikes"),
  ]),
  stance_carving_mantis: mod("stance_carving_mantis", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Carving Mantis: damageBonus \u2014 Strong slashes and quick stabs that keeps momentum forward."),
  ]),
  stance_clashing_forest: mod("stance_clashing_forest", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Clashing Forest: damageBonus \u2014 Arcing strikes and focused combos."),
  ]),
  stance_cleaving_whirlwind: mod("stance_cleaving_whirlwind", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Cleaving Whirlwind: damageBonus \u2014 Heavy blade stance: Spinning attacks"),
  ]),
  stance_coiling_viper: mod("stance_coiling_viper", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Coiling Viper: damageBonus \u2014 Powerful arcing strikes with energetic flips."),
  ]),
  stance_crimson_dervish: mod("stance_crimson_dervish", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Crimson Dervish: damageBonus \u2014 Sword stance: High damage, slow"),
  ]),
  stance_crossing_snakes: mod("stance_crossing_snakes", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Crossing Snakes: damageBonus \u2014 Multi-angle strikes and deadly thrust attacks."),
  ]),
  stance_decisive_judgement: mod("stance_decisive_judgement", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Decisive Judgement: damageBonus \u2014 Fierce, double-handed strikes."),
  ]),
  stance_defiled_snapdragon: mod("stance_defiled_snapdragon", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Defiled Snapdragon: damageBonus \u2014 Blade whip stance: Snake-like strikes"),
  ]),
  stance_flailing_branch: mod("stance_flailing_branch", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Flailing Branch: damageBonus \u2014 Lifting strikes and whirlwind combos."),
  ]),
  stance_gnashing_payara: mod("stance_gnashing_payara", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Gnashing Payara: damageBonus \u2014 Lunging punctures with impaling spirals."),
  ]),
  stance_grim_fury_sparring: mod("stance_grim_fury_sparring", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Grim Fury: damageBonus \u2014 Lightning fast hit chains and hard-hitting combos."),
  ]),
  stance_high_noon: mod("stance_high_noon", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "High Noon: damageBonus \u2014 Bullets spray between wicked slash attacks."),
  ]),
  stance_homing_fang: mod("stance_homing_fang", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Homing Fang: damageBonus \u2014 Dagger stance: Seeking strikes"),
  ]),
  stance_iron_phoenix: mod("stance_iron_phoenix", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Iron Phoenix: damageBonus \u2014 Fast cutting attacks with puncture finish."),
  ]),
  stance_pointed_wind: mod("stance_pointed_wind", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Pointed Wind: damageBonus \u2014 Dagger stance: Precision strikes"),
  ]),
  stance_reaping_spiral: mod("stance_reaping_spiral", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Reaping Spiral: damageBonus \u2014 Far flung attacks and multi-hit combos."),
  ]),
  stance_seismic_palm: mod("stance_seismic_palm", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Seismic Palm: damageBonus \u2014 Methodical strikes with reaching combos."),
  ]),
  stance_shimmering_blight: mod("stance_shimmering_blight", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Shimmering Blight: damageBonus \u2014 Fast spinning attacks and staggering strikes."),
  ]),
  stance_sinking_talon: mod("stance_sinking_talon", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Sinking Talon: damageBonus \u2014 Strong, focused attacks with multi-hit spins."),
  ]),
  stance_spinning_needle: mod("stance_spinning_needle", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Spinning Needle: damageBonus \u2014 Dual dagger stance: Spinning strikes"),
  ]),
  stance_stalking_fan: mod("stance_stalking_fan", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Stalking Fan: damageBonus \u2014 Lunging spirals and shattering combos."),
  ]),
  stance_stinging_thorn: mod("stance_stinging_thorn", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Stinging Thorn: damageBonus \u2014 Vigorous slashes with forceful stabs."),
  ]),
  stance_sundering_weave: mod("stance_sundering_weave", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Sundering Weave: damageBonus \u2014 Steady chopping strikes with focused damage."),
  ]),
  stance_swirling_tiger: mod("stance_swirling_tiger", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Swirling Tiger: damageBonus \u2014 Dual sword stance: Fluid combos"),
  ]),
  stance_swooping_falcon: mod("stance_swooping_falcon", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Swooping Falcon: damageBonus \u2014 Quick slashes with spinning lunges."),
  ]),
  stance_temporal_royale: mod("stance_temporal_royale", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Tempo Royale: damageBonus \u2014 Sweeping strikes and twisting slashes."),
  ]),
  stance_twirling_spire: mod("stance_twirling_spire", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Twirling Spire: damageBonus \u2014 A mix of sweeping attacks with precise strikes."),
  ]),
  stance_vengeful_revenant: mod("stance_vengeful_revenant", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Vengeful Revenant: damageBonus \u2014 Sword stance: High damage, sweeping"),
  ]),
  stance_vermillion_storm: mod("stance_vermillion_storm", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Vermillion Storm: damageBonus \u2014 Kicks woven between spinning slashes."),
  ]),
  stance_vulpine_mask: mod("stance_vulpine_mask", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Vulpine Mask: damageBonus \u2014 Rapier stance: Cunning strikes"),
  ]),
  stance_wise_razor: mod("stance_wise_razor", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "Wise Razor: damageBonus \u2014 Deftly executed sweeps and slashes."),
  ]),
};
