/**
 * Per-mod verified behaviors — category: companion_weapon (16 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py companion_weapon
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_COMPANION_WEAPON: Record<string, VerifiedModBehavior> = {
  bloodthirst: mod("bloodthirst", [
    line("healthPerSlashStack", "mod_panel", "multiplicative_percent", "Bloodthirst: healthPerSlashStack \u2014 Health stolen per stack of Slash Damage on the target (+25 per rank, max 100)"),
  ]),
  claw_bite: mod("claw_bite", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Bite (Claws) — +330% CC / +220% CM at max (legacy criticalDamage key is panel)"),
    line("criticalDamage", "mod_panel", "multiplicative_percent", "wiki: Bite (Claws) — duplicate criticalDamage catalog key (CM via criticalMultiplier)"),
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "wiki: Bite (Claws) — +330% CC / +220% CM at max"),
  ]),
  claw_cold: mod("claw_cold", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Frost Claws: cold \u2014 +90% Cold Damage"),
  ]),

  claw_fury: mod("claw_fury", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Fury (Claws): attackSpeed \u2014 +30% Attack Speed"),
  ]),
  claw_heat: mod("claw_heat", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Flame Claws: heat \u2014 +90% Heat Damage"),
  ]),
  claw_magnetic: mod("claw_magnetic", [
    line("magnetic", "weapon_dps", "elemental_from_base_damage", "Magnetic Claws: magnetic \u2014 +60% Magnetic\\\\n+40% Status Duration"),
    line("statusDuration", "mod_panel", "multiplicative_percent", "Magnetic Claws: statusDuration \u2014 +60% Magnetic\\\\n+40% Status Duration"),
  ]),
  claw_maul: mod("claw_maul", [
    line("damage", "weapon_dps", "multiplicative_percent", "Maul (Claws): damage \u2014 +330% Melee Damage"),
  ]),
  claw_shred: mod("claw_shred", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Shred (Claws): fireRate \u2014 +30% Fire Rate (duplicate attackSpeed key removed)"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Shred (Claws): punchThrough \u2014 +1.2 Punch Through (arsenal display only)"),
  ]),
  claw_swipe: mod("claw_swipe", [
    line("range", "mod_panel", "multiplicative_percent", "Swipe (Claws): range \u2014 Strikes 4 additional enemies and increases Attack Range by 2m. (arsenal display only)"),
  ]),


  cull_the_weak: mod("cull_the_weak", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Cull the Weak — status/non-crit conditional (not always-on paper)"),
    line("damagePerStatus", "mod_panel", "multiplicative_percent", "Cull the Weak: damagePerStatus \u2014 +10% Melee Damage per Status type on the target, +40% Damage on non-Critical Hit\u2026"),
    line("nonCritDamage", "mod_panel", "multiplicative_percent", "Cull the Weak: nonCritDamage \u2014 +10% Melee Damage per Status type on the target, +40% Damage on non-Critical Hit\u2026"),
  ]),

  precision_conditioning: mod("precision_conditioning", [
    line("damage", "weapon_dps", "multiplicative_percent", "Precision Conditioning: damage \u2014 +35% Damage per rank (max +385%). Converts all base Physical Damage to Slash"),
  ]),
  radon_claws: mod("radon_claws", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Radon Claws: criticalMultiplier \u2014 +15% Damage and +20% Critical Damage per rank"),
    line("damage", "weapon_dps", "multiplicative_percent", "Radon Claws: damage \u2014 +15% Damage and +20% Critical Damage per rank"),
    line("radiation", "weapon_dps", "elemental_from_base_damage", "Radon Claws: radiation \u2014 +15% Damage and +20% Critical Damage per rank"),
  ]),
};
