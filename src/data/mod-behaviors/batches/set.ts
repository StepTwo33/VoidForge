/**
 * Per-mod verified behaviors — category: set (7 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py set
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_SET: Record<string, VerifiedModBehavior> = {
  set_bonus_augur: mod("set_bonus_augur", [
    line("energyToShields", "mod_panel", "multiplicative_percent", "Augur Set Bonus: energyToShields \u2014 6-piece: Spent Energy becomes Shields (40%)"),
  ]),
  set_bonus_gladiator: mod("set_bonus_gladiator", [
    line("critPerCombo", "mod_panel", "multiplicative_percent", "Gladiator Set Bonus: critPerCombo \u2014 +10% Crit Chance per Combo Multiplier per piece"),
  ]),
  set_bonus_hunter: mod("set_bonus_hunter", [
    line("companionDamageToStatus", "mod_panel", "multiplicative_percent", "Hunter Set Bonus: companionDamageToStatus \u2014 6-piece: Companion deals +150% damage to status enemies"),
  ]),
  set_bonus_mecha: mod("set_bonus_mecha", [
    line("markDuration", "mod_panel", "flat", "Mecha Set Bonus: markDuration \u2014 3s mark per piece (wiki set page)"),
  ]),
  set_bonus_synth: mod("set_bonus_synth", [
    line("holsterReloadPerSecond", "mod_panel", "multiplicative_percent", "Synth Set Bonus: holsterReloadPerSecond \u2014 holstered weapons reload 5% of magazine/s per piece"),
  ]),
  set_bonus_tek: mod("set_bonus_tek", [
    line("zoneDamagePerSecond", "mod_panel", "flat", "Tek Set Bonus: zoneDamagePerSecond \u2014 marked zone deals 50 damage/s per piece"),
  ]),
  set_bonus_vigilante: mod("set_bonus_vigilante", [
    line("critEnhanceChance", "mod_panel", "multiplicative_percent", "Vigilante Set Bonus: critEnhanceChance \u2014 6-piece: 30% chance to enhance primary crit hits"),
  ]),
};
