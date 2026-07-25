/**
 * Per-mod verified behaviors — Railjack Plexus (integrated) mods.
 * Overrides general.ts entries that mis-route to warframe_totals / weapon_dps.
 */
import type { VerifiedModBehavior } from "@/lib/codex/item-behavior-types";

function line(
  statKey: string,
  target: VerifiedModBehavior["stats"][0]["target"],
  mode: VerifiedModBehavior["stats"][0]["mode"],
  source: string,
): VerifiedModBehavior["stats"][0] {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedModBehavior["stats"], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_RAILJACK: Record<string, VerifiedModBehavior> = {
  conic_nozzle: mod("conic_nozzle", [
    line("engineSpeed", "railjack_totals", "multiplicative_percent", "Conic Nozzle: +25.5% Railjack Speed"),
  ]),
  cruising_speed: mod("cruising_speed", [
    line("engineSpeed", "railjack_totals", "multiplicative_percent", "Cruising Speed: +100% Speed when no enemies within 3000m"),
    line("range", "mod_panel", "multiplicative_percent", "Cruising Speed: range gate (display only)"),
  ]),
  hyperstrike: mod("hyperstrike", [
    line("turretDamage", "railjack_totals", "multiplicative_percent", "Hyperstrike: +75% Turret Damage"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Hyperstrike — alias of turretDamage (avoid double-count)"),
  ]),
  ion_burn: mod("ion_burn", [
    line("boostSpeed", "railjack_totals", "multiplicative_percent", "Ion Burn: +45% Boost Speed"),
  ]),
  predator: mod("predator", [
    line("turretCritChance", "railjack_totals", "multiplicative_percent", "Predator: +50% Turret Critical Chance"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Predator — alias of turretCritChance (avoid double-count)"),
  ]),
  section_density: mod("section_density", [
    line("turretCritDamage", "railjack_totals", "multiplicative_percent", "Section Density: +50% Turret Critical Damage"),
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "wiki: Section Density — alias of turretCritDamage (avoid double-count)"),
  ]),
  forward_artillery: mod("forward_artillery", [
    line("artilleryDamage", "railjack_totals", "multiplicative_percent", "Forward Artillery: +100% Forward Artillery Damage"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Forward Artillery — alias of artilleryDamage (not turret)"),
  ]),
  warhead: mod("warhead", [
    line("ordnanceDamage", "railjack_totals", "multiplicative_percent", "Warhead: +100% Ordnance Damage"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Warhead — alias of ordnanceDamage (not turret)"),
  ]),
  ironclad_matrix: mod("ironclad_matrix", [
    line("armor", "railjack_totals", "multiplicative_percent", "Ironclad Matrix: +33.75% Hull and Armor"),
    line("shield", "railjack_totals", "multiplicative_percent", "Ironclad Matrix: +38.25% Shields and Shield Recharge"),
  ]),
  indomitable_matrix: mod("indomitable_matrix", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Indomitable Matrix — breach-gated"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Indomitable Matrix — breach-gated"),
  ]),
  fortifying_fire: mod("fortifying_fire", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Fortifying Fire — shield on crit (conditional)"),
  ]),
  defensive_fire: mod("defensive_fire", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Defensive Fire — max shields per kill (stacking)"),
    line("duration", "mod_panel", "multiplicative_percent", "Defensive Fire: stack duration (display)"),
  ]),
  onslaught_matrix: mod("onslaught_matrix", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Onslaught Matrix — full-hull gated (sim)"),
    line("turretDamage", "mod_panel", "multiplicative_percent", "wiki: Onslaught Matrix — full-hull gated (sim)"),
  ]),
  crimson_fugue: mod("crimson_fugue", [
    line("damage", "railjack_totals", "multiplicative_percent", "Crimson Fugue: +27.5% Turret Damage per kill (5 stacks)"),
    line("duration", "mod_panel", "multiplicative_percent", "Crimson Fugue: stack duration (display)"),
  ]),
  protective_shots: mod("protective_shots", [
    line("damage", "railjack_totals", "multiplicative_percent", "Protective Shots: +30% Turret Damage above 75% shields (sim-gated)"),
  ]),
  waveband_disruptor: mod("waveband_disruptor", [
    line("shield", "mod_panel", "multiplicative_percent", "Waveband Disruptor: crits ignore shields (special)"),
  ]),
  turret_velocity: mod("turret_velocity", [
    line("turretRange", "railjack_totals", "multiplicative_percent", "Turret Velocity: +25.3% Turret Range"),
    line("turretProjectileSpeed", "railjack_totals", "multiplicative_percent", "Turret Velocity: +55% Projectile Speed"),
    line("range", "mod_panel", "multiplicative_percent", "Turret Velocity: range (display alias)"),
  ]),
  ordnance_velocity: mod("ordnance_velocity", [
    line("ordnanceSpeed", "railjack_totals", "multiplicative_percent", "Ordnance Velocity: +60% Projectile Speed"),
  ]),
  scourging_warheads: mod("scourging_warheads", [
    line("shield", "mod_panel", "multiplicative_percent", "Scourging Warheads: ordnance ignores shields"),
  ]),
  orgone_tuning_matrix: mod("orgone_tuning_matrix", [
    line("heat", "mod_panel", "multiplicative_percent", "Orgone Tuning Matrix: forge + elemental (partial)"),
  ]),
  overloader: mod("overloader", [
    line("magazine", "railjack_totals", "multiplicative_percent", "Overloader: +87% Maximum Ordnance Munitions"),
  ]),
  granums_nemesis: mod("granums_nemesis", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Granum's Nemesis: x1.27 vs Corpus"),
  ]),
  worms_torment: mod("worms_torment", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Worm's Torment: x1.27 vs Grineer"),
  ]),
  sentient_scalpel: mod("sentient_scalpel", [
    line("factionSentient", "mod_panel", "multiplicative_percent", "Sentient Scalpel: x1.27 vs Sentient"),
  ]),
  raider_matrix: mod("raider_matrix", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Raider Matrix — archwing slingshot (not RJ turret paper)"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Raider Matrix — archwing slingshot utility"),
  ]),
  ripload: mod("ripload", [
    line("reloadSpeed", "mod_panel", "multiplicative_percent", "wiki: Ripload — ordnance reload time (not weapon reload / not yet modeled)"),
  ]),
};
