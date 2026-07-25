/**
 * Per-mod verified behaviors — category: shotgun (13 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py shotgun
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_SHOTGUN: Record<string, VerifiedModBehavior> = {
  ammo_mutation: mod("ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Shotgun Ammo Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 50% of Ammo Pick Up."),
  ]),
  blaze: mod("blaze", [
    line("damage", "weapon_dps", "multiplicative_percent", "Blaze: damage \u2014 +15% Heat, +15% Damage per rank"),
    line("heat", "weapon_dps", "elemental_from_base_damage", "Blaze: heat \u2014 +15% Heat, +15% Damage per rank"),
  ]),
  burdened_magazine: mod("burdened_magazine", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Burdened Magazine: magazine \u2014 +60% Magazine Capacity\\\\n-18% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Burdened Magazine: reloadSpeed \u2014 +60% Magazine Capacity\\\\n-18% Reload Speed"),
  ]),
  galvanized_hell: mod("galvanized_hell", [
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Hell: duration \u2014 +110% Multishot\\\\nOn Kill:\\\\n+30% Multishot for 20s. Stacks up to 4x."),
    line("multishot", "weapon_dps", "multiplicative_percent", "Galvanized Hell: multishot \u2014 +110% Multishot\\\\nOn Kill:\\\\n+30% Multishot for 20s. Stacks up to 4x."),
    line("multishotOnKill", "weapon_dps", "conditional_multishot_on_kill", "Galvanized Hell: multishotOnKill \u2014 +110% Multishot\\\\nOn Kill:\\\\n+30% Multishot for 20s. Stacks up to 4x."),
  ]),
  hells_chamber: mod("hells_chamber", [
    line("multishot", "weapon_dps", "multiplicative_percent", "Hell's Chamber: multishot \u2014 +20% Multishot per rank"),
  ]),
  primed_charged_shell: mod("primed_charged_shell", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Primed Charged Shell: electricity \u2014 +15% Electricity per rank (Primed)"),
  ]),
  primed_chilling_grasp: mod("primed_chilling_grasp", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Primed Chilling Grasp: cold \u2014 +15% Cold per rank (Primed)"),
  ]),
  primed_point_blank: mod("primed_point_blank", [
    line("damage", "weapon_dps", "multiplicative_percent", "Primed Point Blank: damage \u2014 +15% Damage per rank (Primed)"),
  ]),
  primed_ravage: mod("primed_ravage", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Primed Ravage: criticalMultiplier \u2014 +20% Critical Damage per rank (Primed)"),
  ]),
  riven_shotgun: mod("riven_shotgun", [], "wiki: Riven Mod (Shotgun) \u2014 Riven mod with random stats. Configure stats after equipping."),

  shotgun_spazz: mod("shotgun_spazz", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Shotgun Spazz: fireRate \u2014 +15% Fire Rate per rank"),
  ]),
  vicious_spread: mod("vicious_spread", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Vicious Spread: accuracy \u2014 +10% Damage, +10% Spread per rank (arsenal display only)"),
    line("damage", "weapon_dps", "multiplicative_percent", "Vicious Spread: damage \u2014 +10% Damage, +10% Spread per rank"),
    line("spread", "mod_panel", "multiplicative_percent", "Vicious Spread: spread \u2014 +10% Damage, +10% Spread per rank"),
  ]),
};
