/**
 * Per-mod verified behaviors — category: pistol (18 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py pistol
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_PISTOL: Record<string, VerifiedModBehavior> = {
  anemic_agility: mod("anemic_agility", [
    line("damage", "weapon_dps", "multiplicative_percent", "Anemic Agility: damage \u2014 +15% Fire Rate, -2.5% Damage per rank"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Anemic Agility: fireRate \u2014 +15% Fire Rate, -2.5% Damage per rank"),
  ]),
  // Wiki: Augur Seeker — Secondary Status Duration (+15%/rank → +90% R5)
  augur_seeker: mod("augur_seeker", [
    line("statusDuration", "weapon_dps", "multiplicative_percent", "Augur Seeker: statusDuration — +15% Status Duration per rank"),
  ]),
  augur_breach: mod("augur_breach", [
    line("damage", "weapon_dps", "multiplicative_percent", "Augur Pact: damage \u2014 +15% Damage per rank"),
  ]),

  creeping_bullseye: mod("creeping_bullseye", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Creeping Bullseye: criticalChance \u2014 +8% Crit Chance, -6% Fire Rate per rank"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Creeping Bullseye: fireRate \u2014 +8% Crit Chance, -6% Fire Rate per rank"),
  ]),
  embedded_catalyzer: mod("embedded_catalyzer", [
    line("duration", "mod_panel", "multiplicative_percent", "Embedded Catalyzer: duration \u2014 On Ability Cast:\\\\n+90% Status Chance when Aiming for 9s"),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Embedded Catalyzer \u2014 On Ability Cast: +90% Status Chance when Aiming for 9s"),
  ]),
  galvanized_crosshairs: mod("galvanized_crosshairs", [
    line("criticalChanceOnHeadshot", "weapon_dps", "conditional_crit_on_headshot", "wiki: Galvanized Crosshairs \u2014 +120% Critical Chance when Aiming for 12s on Headshot"),
    line("criticalChanceOnHeadshotKill", "weapon_dps", "conditional_crit_on_headshot", "wiki: Galvanized Crosshairs \u2014 +40% Critical Chance per Headshot Kill stack (5x)"),
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Crosshairs: duration \u2014 On Headshot:\\\\n+120% Critical Chance when Aiming for 12s\\\\nOn Headshot Kill:\\\\n+\u2026"),
  ]),
  galvanized_shot: mod("galvanized_shot", [
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status_on_kill", "wiki: Galvanized Shot — on-kill damage per status stack"),
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Shot: duration \u2014 +80% Status Chance\\\\nOn Kill:\\\\n+40% Direct Damage per Status Type affecting the\u2026"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Shot — +80% Status Chance (always-on paper)"),
  ]),
  hydraulic_crosshairs: mod("hydraulic_crosshairs", [
    line("criticalChanceOnHeadshot", "weapon_dps", "conditional_crit_on_headshot", "wiki: Hydraulic Crosshairs \u2014 On Headshot: +135% Critical Chance when Aiming for 9s"),
    line("duration", "mod_panel", "multiplicative_percent", "Hydraulic Crosshairs: duration \u2014 On Headshot:\\\\n+135% Critical Chance when Aiming for 9s"),
  ]),

  lethal_torrent: mod("lethal_torrent", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Lethal Torrent: fireRate \u2014 +10% Fire Rate, +10% Multishot per rank"),
    line("multishot", "weapon_dps", "multiplicative_percent", "Lethal Torrent: multishot \u2014 +10% Fire Rate, +10% Multishot per rank"),
  ]),
  magnum_force: mod("magnum_force", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Magnum Force: accuracy \u2014 +6% Damage, -3% Accuracy per rank (arsenal display only)"),
    line("damage", "weapon_dps", "multiplicative_percent", "Magnum Force: damage \u2014 +6% Damage, -3% Accuracy per rank"),
  ]),
  pistol_ammo_mutation: mod("pistol_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Pistol Ammo Mutation: ammoConversion \u2014 Converts Primary ammo pickups to 50% of Ammo Pick Up."),
  ]),

  primed_convulsion: mod("primed_convulsion", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Primed Convulsion: electricity \u2014 +15% Electricity per rank (Primed)"),
  ]),
  primed_heated_charge: mod("primed_heated_charge", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Primed Heated Charge: heat \u2014 +15% Heat per rank (Primed)"),
  ]),
  primed_pistol_gambit: mod("primed_pistol_gambit", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Primed Pistol Gambit: criticalChance \u2014 +22% Critical Chance per rank (Primed)"),
  ]),
  primed_target_cracker: mod("primed_target_cracker", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Primed Target Cracker: criticalMultiplier \u2014 +15% Critical Damage per rank (Primed)"),
  ]),
  riven_pistol: mod("riven_pistol", [], "wiki: Riven Mod (Pistol) \u2014 Riven mod with random stats. Configure stats after equipping."),
};
