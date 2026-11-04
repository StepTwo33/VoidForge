/**
 * Per-mod verified behaviors — category: archmelee (17 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py archmelee
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_ARCHMELEE: Record<string, VerifiedModBehavior> = {
  astral_autopsy: mod("astral_autopsy", [], "wiki: Astral Autopsy \u2014 Fatal strikes against an enemy also perform a Codex Scan. Scans require an equipped Codex Scanner and an available charge."),
  astral_cut: mod("astral_cut", [
    line("slashSize", "mod_panel", "multiplicative_percent", "Astral Cut: slashSize \u2014 Tauron Strike slash size is increased by 80%."),
  ]),
  astral_slash: mod("astral_slash", [
    line("slash", "weapon_dps", "multiplicative_percent", "Astral Slash: slash \u2014 +90% <DT_SLASH_COLOR>Slash"),
  ]),
  blazing_steel: mod("blazing_steel", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Blazing Steel: heat \u2014 +120% <DT_FIRE_COLOR>Heat"),
  ]),
  bleeding_edge: mod("bleeding_edge", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Bleeding Edge: criticalMultiplier \u2014 +110% Critical Damage"),
  ]),
  cutting_edge: mod("cutting_edge", [
    line("damage", "weapon_dps", "multiplicative_percent", "Cutting Edge: damage \u2014 +110% Melee Damage"),
  ]),
  extend: mod("extend", [
    line("range", "mod_panel", "flat", "wiki: Extend — +3m Melee Range (0.75m per rank; arsenal display only)"),
    line("attractionRange", "mod_panel", "flat", "wiki: Extend — +100m Attraction Range in space (25m per rank; arsenal display only)"),
  ]),
  furor: mod("furor", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Furor: attackSpeed \u2014 +10% Attack Speed"),
  ]),
  glacial_edge: mod("glacial_edge", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Glacial Edge: cold \u2014 +120% <DT_FREEZE_COLOR>Cold"),
  ]),
  infectious_injection: mod("infectious_injection", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Infectious Injection: statusChance \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Infectious Injection: toxin \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
  ]),
  ion_infusion: mod("ion_infusion", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Ion Infusion: electricity \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Ion Infusion: statusChance \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
  ]),
  meteor_crash: mod("meteor_crash", [
    line("impact", "weapon_dps", "multiplicative_percent", "Meteor Crash: impact \u2014 +90% <DT_IMPACT_COLOR>Impact"),
  ]),
  nebula_bore: mod("nebula_bore", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Nebula Bore: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  poisonous_sting: mod("poisonous_sting", [
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Poisonous Sting: toxin \u2014 +120% <DT_POISON_COLOR>Toxin"),
  ]),
  searing_steel: mod("searing_steel", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Searing Steel: heat \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Searing Steel: statusChance \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
  ]),
  sudden_impact: mod("sudden_impact", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Sudden Impact: statusChance \u2014 +60% Status Chance"),
  ]),
  tempered_blade: mod("tempered_blade", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Tempered Blade: criticalChance \u2014 +150% Critical Chance"),
  ]),
};
