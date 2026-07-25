/**
 * Per-mod verified behaviors — category: rifle (27 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py rifle
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_RIFLE: Record<string, VerifiedModBehavior> = {
  amalgam_serration: mod("amalgam_serration", [
    line("damage", "weapon_dps", "multiplicative_percent", "Amalgam Serration: damage — +11% Damage per rank (max +155%)"),
    // Sprint speed is a Warframe movement buff from a rifle mod (cross-slot while equipped).
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Amalgam Serration: sprintSpeed — +5% Sprint Speed per rank (max +55%)"),
  ]),
  argon_scope: mod("argon_scope", [
    line("criticalChanceOnHeadshot", "weapon_dps", "conditional_crit_on_headshot", "wiki: Argon Scope \u2014 On Headshot: +135% Critical Chance when Aiming for 9s"),
    line("duration", "mod_panel", "multiplicative_percent", "Argon Scope: duration \u2014 On Headshot:\\\\n+135% Critical Chance when Aiming for 9s"),
  ]),
  bladed_rounds: mod("bladed_rounds", [
    line("criticalMultiplier", "weapon_dps", "conditional_stat_on_kill", "wiki: Bladed Rounds \u2014 On Kill: +120% Critical Damage when Aiming for 9s"),
    line("duration", "mod_panel", "multiplicative_percent", "Bladed Rounds: duration \u2014 On Kill:\\\\n+120% Critical Damage when Aiming for 9s"),
  ]),
  critical_deceleration: mod("critical_deceleration", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Critical Deceleration: criticalChance \u2014 +8% Crit Chance, -6% Fire Rate per rank"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Critical Deceleration: fireRate \u2014 +8% Crit Chance, -6% Fire Rate per rank"),
  ]),
  critical_delay: mod("critical_delay", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Critical Delay: criticalChance \u2014 +200% Critical Chance\\\\n-20% Fire Rate (x2 for Bows)"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Critical Delay: fireRate \u2014 +200% Critical Chance\\\\n-20% Fire Rate (x2 for Bows)"),
  ]),
  frail_momentum: mod("frail_momentum", [
    line("damage", "weapon_dps", "multiplicative_percent", "Frail Momentum: damage \u2014 +15% Fire Rate, -2.5% Damage per rank"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Frail Momentum: fireRate \u2014 +15% Fire Rate, -2.5% Damage per rank"),
  ]),
  galvanized_aptitude: mod("galvanized_aptitude", [
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status_on_kill", "wiki: Galvanized Aptitude — on-kill damage per status stack"),
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Aptitude: buff duration (panel only)"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Aptitude — +80% Status Chance (always-on paper)"),
  ]),
  galvanized_chamber: mod("galvanized_chamber", [
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Chamber: duration \u2014 +80% Multishot\\\\nOn Kill:\\\\n+30% Multishot for 20s. Stacks up to 5x."),
    line("multishot", "weapon_dps", "multiplicative_percent", "Galvanized Chamber: multishot \u2014 +80% Multishot\\\\nOn Kill:\\\\n+30% Multishot for 20s. Stacks up to 5x."),
    line("multishotOnKill", "weapon_dps", "conditional_multishot_on_kill", "Galvanized Chamber: multishotOnKill \u2014 +80% Multishot\\\\nOn Kill:\\\\n+30% Multishot for 20s. Stacks up to 5x."),
  ]),
  galvanized_savvy: mod("galvanized_savvy", [
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status_on_kill", "wiki: Galvanized Savvy — on-kill damage per status stack"),
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Savvy: duration \u2014 +80% Status Chance\\\\nOn Kill:\\\\n+40% Direct Damage per Status Type affecting the\u2026"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Savvy — +80% Status Chance (always-on paper)"),
  ]),
  galvanized_scope: mod("galvanized_scope", [
    line("criticalChanceOnHeadshot", "weapon_dps", "conditional_crit_on_headshot", "wiki: Galvanized Scope \u2014 +120% Critical Chance when Aiming for 12s on Headshot"),
    line("criticalChanceOnHeadshotKill", "weapon_dps", "conditional_crit_on_headshot", "wiki: Galvanized Scope \u2014 +40% Critical Chance per Headshot Kill stack (5x)"),
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Scope: duration \u2014 On Headshot:\\\\n+120% Critical Chance when Aiming for 12s\\\\nOn Headshot Kill:\\\\n+\u2026"),
  ]),
  hammer_shot: mod("hammer_shot", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Hammer Shot: criticalMultiplier \u2014 +60% Critical Damage\\\\n+80% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Hammer Shot: statusChance \u2014 +60% Critical Damage\\\\n+80% Status Chance"),
  ]),
  heavy_caliber: mod("heavy_caliber", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Heavy Caliber: accuracy \u2014 +15% Damage, -5% Accuracy per rank (arsenal display only)"),
    line("damage", "weapon_dps", "multiplicative_percent", "Heavy Caliber: damage \u2014 +15% Damage, -5% Accuracy per rank"),
  ]),
  hunter_munitions: mod("hunter_munitions", [
    line("slashOnCrit", "weapon_dps", "slash_on_crit", "wiki: Hunter Munitions \u2014 +30% chance for Slash proc on Critical Hits"),
  ]),
  ice_storm: mod("ice_storm", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Ice Storm: cold \u2014 +15% Cold, +5% Magazine per rank"),
    line("magazine", "weapon_dps", "multiplicative_percent", "Ice Storm: magazine \u2014 +15% Cold, +5% Magazine per rank"),
  ]),
  piercing_caliber: mod("piercing_caliber", [
    line("puncture", "weapon_dps", "multiplicative_percent", "wiki: Piercing Caliber \u2014 +120% Puncture at max (no punch through)"),
  ]),
  primed_cryo_rounds: mod("primed_cryo_rounds", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Primed Cryo Rounds: cold \u2014 +15% Cold per rank (Primed)"),
  ]),
  riven_rifle: mod("riven_rifle", [], "wiki: Riven Mod (Rifle) \u2014 Riven mod with random stats. Configure stats after equipping."),
  seeking_fury: mod("seeking_fury", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "Seeking Fury: punchThrough \u2014 +5% Reload, +0.2m Punch Through per rank (arsenal display only)"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Seeking Fury: reloadSpeed \u2014 +5% Reload, +0.2m Punch Through per rank"),
  ]),
  shred: mod("shred", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Shred: fireRate \u2014 +30% Fire Rate (x2 for Bows)\\\\n+1.2 Punch Through"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Shred: punchThrough \u2014 +30% Fire Rate (x2 for Bows)\\\\n+1.2 Punch Through (arsenal display only)"),
  ]),
  thermite_rounds_nightmare: mod("thermite_rounds_nightmare", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Thermite Rounds: heat \u2014 +15% Heat, +10% Status Chance per rank"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Thermite Rounds: statusChance \u2014 +15% Heat, +10% Status Chance per rank"),
  ]),
  vigilante_armaments: mod("vigilante_armaments", [
    line("multishot", "weapon_dps", "multiplicative_percent", "Vigilante Armaments: multishot \u2014 +10% Multishot per rank"),
  ]),
  vigilante_fervor: mod("vigilante_fervor", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Vigilante Fervor: fireRate \u2014 +7.5% Fire Rate per rank (Set)"),
  ]),
  vigilante_offense: mod("vigilante_offense", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "Vigilante Offense: punchThrough \u2014 +1.5 Punch Through (arsenal display only)"),
  ]),
  vigilante_supplies: mod("vigilante_supplies", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Vigilante Supplies: ammoConversion \u2014 Converts Secondary ammo pickups to 30% of Ammo Pick Up."),
    line("ammoPickup", "mod_panel", "multiplicative_percent", "Vigilante Supplies: ammoPickup \u2014 Converts Secondary ammo pickups to 30% of Ammo Pick Up."),
  ]),
  vile_acceleration: mod("vile_acceleration", [
    line("damage", "weapon_dps", "multiplicative_percent", "Vile Acceleration: damage \u2014 +90% Fire Rate (x2 for Bows)\\\\n-15% Damage"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Vile Acceleration: fireRate \u2014 +90% Fire Rate (x2 for Bows)\\\\n-15% Damage"),
  ]),
  wildfire: mod("wildfire", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Wildfire: heat \u2014 +15% Heat, +5% Magazine per rank"),
    line("magazine", "weapon_dps", "multiplicative_percent", "Wildfire: magazine \u2014 +15% Heat, +5% Magazine per rank"),
  ]),
};
