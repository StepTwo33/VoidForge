/**
 * Per-mod verified behaviors — category: archwing (12 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py archwing
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_ARCHWING: Record<string, VerifiedModBehavior> = {
  argon_plating: mod("argon_plating", [
    line("armor", "warframe_totals", "multiplicative_percent", "Argon Plating: armor \u2014 +100% Armor"),
  ]),
  auxiliary_power: mod("auxiliary_power", [
    line("energy", "warframe_totals", "multiplicative_percent", "Auxiliary Power: energy \u2014 +100% Energy Max"),
  ]),
  efficient_transferral: mod("efficient_transferral", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Efficient Transferral: abilityDuration \u2014 +30% Ability Duration"),
  ]),
  energy_amplifier: mod("energy_amplifier", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Energy Amplifier: abilityRange \u2014 +60% Ability Range"),
  ]),
  energy_inversion: mod("energy_inversion", [
    line("shield", "warframe_totals", "multiplicative_percent", "Energy Inversion: shield \u2014 +100% Shield Capacity"),
  ]),
  enhanced_durability: mod("enhanced_durability", [
    line("health", "warframe_totals", "multiplicative_percent", "Enhanced Durability: health \u2014 +100% Health"),
  ]),
  hyperion_thrusters: mod("hyperion_thrusters", [
    line("flightSpeed", "warframe_totals", "multiplicative_percent", "Hyperion Thrusters: flightSpeed \u2014 +27.5% Flight Speed"),
  ]),
  kinetic_diversion: mod("kinetic_diversion", [
    line("energyOnHealthDamage", "mod_panel", "multiplicative_percent", "wiki: Kinetic Diversion \u2014 converts 10% of health damage to energy per rank (+40% R3; not damage)"),
  ]),
  morphic_transformer: mod("morphic_transformer", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Morphic Transformer: abilityStrength \u2014 +20% Ability Strength"),
  ]),
  primed_morphic_transformer: mod("primed_morphic_transformer", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Primed Morphic Transformer: abilityStrength \u2014 +55% Ability Strength"),
  ]),
  superior_defenses: mod("superior_defenses", [
    line("shieldRecharge", "mod_panel", "multiplicative_percent", "Superior Defenses: shieldRecharge \u2014 +100% Shield Recharge, -50% Shield Recharge Delay"),
    line("shieldRechargeDelay", "mod_panel", "multiplicative_percent", "Superior Defenses: shieldRechargeDelay \u2014 +100% Shield Recharge, -50% Shield Recharge Delay"),
  ]),
  system_reroute: mod("system_reroute", [
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "System Reroute: abilityEfficiency \u2014 +55% Ability Efficiency"),
  ]),
};
