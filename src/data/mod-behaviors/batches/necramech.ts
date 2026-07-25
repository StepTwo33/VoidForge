/**
 * Per-mod verified behaviors — category: necramech (28 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py necramech
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_NECRAMECH: Record<string, VerifiedModBehavior> = {
  necramech_augur: mod("necramech_augur", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Necramech Augur — energy spent converted to Shields (not max shield)"),
  ]),
  necramech_aviator: mod("necramech_aviator", [
    line("damageReduction", "mod_panel", "multiplicative_percent", "Necramech Aviator: damageReduction \u2014 Reduced damage by 40% while airborne"),
  ]),
  necramech_blitz: mod("necramech_blitz", [
    line("damage", "mod_panel", "multiplicative_percent", "Necramech Blitz: damage \u2014 +80% Slide Attack Damage"),
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Necramech Blitz: slideSpeed \u2014 +80% Slide Attack Damage"),
  ]),
  necramech_continuity: mod("necramech_continuity", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Necramech Continuity: abilityDuration \u2014 +30% Ability Duration"),
  ]),
  necramech_deflection: mod("necramech_deflection", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Necramech Deflection — shield recharge rate/delay (not capacity)"),
  ]),
  necramech_drift: mod("necramech_drift", [], "wiki: Necramech Drift \u2014 +60% Hover Efficiency"),
  necramech_efficiency: mod("necramech_efficiency", [], "wiki: Necramech Efficiency \u2014 +30% Engine Efficiency"),
  necramech_enemy_sense: mod("necramech_enemy_sense", [
    line("range", "mod_panel", "multiplicative_percent", "Necramech Enemy Sense: range \u2014 +30m Enemy Radar (arsenal display only)"),
  ]),
  necramech_flow: mod("necramech_flow", [
    line("energy", "warframe_totals", "multiplicative_percent", "Necramech Flow: energy \u2014 +100% Energy Max"),
  ]),
  necramech_friction: mod("necramech_friction", [
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Necramech Friction: slideSpeed \u2014 +60% Slide Efficiency"),
  ]),
  necramech_fury: mod("necramech_fury", [
    line("attackSpeed", "mod_panel", "multiplicative_percent", "Necramech Fury: attackSpeed \u2014 +40% Melee Attack Speed"),
  ]),
  necramech_hydraulics: mod("necramech_hydraulics", [], "wiki: Necramech Hydraulics \u2014 +120% Jump Height"),
  necramech_intensify: mod("necramech_intensify", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Necramech Intensify: abilityStrength \u2014 +30% Ability Strength"),
  ]),
  necramech_pressure_point: mod("necramech_pressure_point", [
    line("damage", "mod_panel", "multiplicative_percent", "Necramech Pressure Point: damage \u2014 +60% Melee Damage"),
  ]),
  necramech_rage: mod("necramech_rage", [
    line("damage", "mod_panel", "multiplicative_percent", "Necramech Rage: damage \u2014 Convert +15% of Damage on Health to Energy. Without Shields, ally Overguard imit\u2026"),
  ]),
  necramech_reach: mod("necramech_reach", [], "wiki: Necramech Reach \u2014 +1 Melee Range"),
  necramech_rebuke: mod("necramech_rebuke", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Necramech Rebuke: cooldown \u2014 Electrifies enemies within 20m for 3s and dealing 300 <DT_ELECTRICITY_COLOR>Elec\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Necramech Rebuke: duration \u2014 Electrifies enemies within 20m for 3s and dealing 300 <DT_ELECTRICITY_COLOR>Elec\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Necramech Rebuke: range \u2014 Electrifies enemies within 20m for 3s and dealing 300 <DT_ELECTRICITY_COLOR>Elec\u2026 (arsenal display only)"),
  ]),
  necramech_redirection: mod("necramech_redirection", [
    line("shield", "warframe_totals", "multiplicative_percent", "Necramech Redirection: shield \u2014 +100% Shield Capacity"),
  ]),
  necramech_refuel: mod("necramech_refuel", [], "wiki: Necramech Refuel \u2014 +20% Engine Replenish"),
  necramech_repair: mod("necramech_repair", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Necramech Repair: cooldown \u2014 Restore 10% Health/s over 3s when Health drops below 20%. 15s Cooldown."),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Necramech Repair — conditional heal below 20% HP (not max health)"),
  ]),
  necramech_seismic_wave: mod("necramech_seismic_wave", [
    line("damage", "mod_panel", "multiplicative_percent", "Necramech Seismic Wave: damage \u2014 +45% Slam Attack Damage"),
  ]),
  necramech_slipstream: mod("necramech_slipstream", [
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Necramech Slipstream: slideSpeed \u2014 +60% Slide"),
  ]),
  necramech_stamina: mod("necramech_stamina", [], "wiki: Necramech Stamina \u2014 -60% Sprint Efficiency"),
  necramech_steel_fiber: mod("necramech_steel_fiber", [
    line("armor", "warframe_totals", "multiplicative_percent", "Necramech Steel Fiber: armor \u2014 +100% Armor"),
  ]),
  necramech_streamline: mod("necramech_streamline", [
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "Necramech Streamline: abilityEfficiency \u2014 +30% Ability Efficiency"),
  ]),
  necramech_stretch: mod("necramech_stretch", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Necramech Stretch: abilityRange \u2014 +45% Ability Range"),
  ]),
  necramech_thrusters: mod("necramech_thrusters", [], "wiki: Necramech Thrusters \u2014 +100% Engine Max"),
  necramech_vitality: mod("necramech_vitality", [
    line("health", "warframe_totals", "multiplicative_percent", "Necramech Vitality: health \u2014 +100% Health"),
  ]),
};
