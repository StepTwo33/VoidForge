/**
 * Per-mod verified behaviors — category: kdrive (22 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py kdrive
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_KDRIVE: Record<string, VerifiedModBehavior> = {
  air_time: mod("air_time", [], "wiki: Air Time \u2014 -20% Gravity while Falling Down"),
  bomb_the_landin: mod("bomb_the_landin", [
    line("range", "mod_panel", "multiplicative_percent", "Bomb The Landin': range \u2014 Tap and hold Grind in the air to execute a 20m radius Slam Shockwave that deals \u2026 (arsenal display only)"),
  ]),
  cold_arrival: mod("cold_arrival", [
    line("range", "mod_panel", "multiplicative_percent", "Cold Arrival: range \u2014 Dismounting deals 400 <DT_FREEZE_COLOR>Cold Damage to enemies within 4m. (arsenal display only)"),
  ]),
  extreme_velocity: mod("extreme_velocity", [], "wiki: Extreme Velocity \u2014 +30% K-Drive Speed"),
  inertia_dampeners: mod("inertia_dampeners", [], "wiki: Inertia Dampeners \u2014 +4 Point Multiplier to Trick Score"),
  juice: mod("juice", [], "wiki: Juice \u2014 Executing tricks charges Energy: 55 Energy per 100 Trick Points."),
  kinetic_friction: mod("kinetic_friction", [
    line("range", "mod_panel", "multiplicative_percent", "Kinetic Friction: range \u2014 Grinding builds up a charge that is released when landing the trick, dealing 400\u2026 (arsenal display only)"),
  ]),
  mad_stack: mod("mad_stack", [], "wiki: Mad Stack \u2014 +120% Velocity when falling"),
  mag_locks: mod("mag_locks", [], "wiki: Mag Locks \u2014 +30% K-Drive Grind Magnetism"),
  nitro_boost: mod("nitro_boost", [], "wiki: Nitro Boost \u2014 +30% K-Drive Boost Speed"),
  perfect_balance: mod("perfect_balance", [], "wiki: Perfect Balance \u2014 +66% Chance to Resist Falls"),
  pop_top: mod("pop_top", [], "wiki: Pop Top \u2014 -60% Jump Charge Time"),
  poppin_vert: mod("poppin_vert", [], "wiki: Poppin' Vert \u2014 +80% K-Drive Double Jump Height"),
  primo_flair: mod("primo_flair", [], "wiki: Primo Flair \u2014 Increase Maximum Trick Combo to 6000"),
  quick_escape: mod("quick_escape", [
    line("duration", "mod_panel", "multiplicative_percent", "Quick Escape: duration \u2014 Gain invulnerability for 5s mounting a K-drive, but will expire early upon dismo\u2026"),
  ]),
  rail_guards: mod("rail_guards", [], "wiki: Rail Guards \u2014 +30% K-Drive Grind Speed"),
  slay_board: mod("slay_board", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Slay Board: explosionDamage \u2014 On Directional Dismount:\\\\nBoard is launched, dealing 400 Damage while slicing e\u2026"),
  ]),
  sonic_boost: mod("sonic_boost", [
    line("duration", "mod_panel", "multiplicative_percent", "Sonic Boost: duration \u2014 Every <LOWER_IS_BETTER>10s, boosting will release a shockwave, stunning enemies \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Sonic Boost: range \u2014 Every <LOWER_IS_BETTER>10s, boosting will release a shockwave, stunning enemies \u2026 (arsenal display only)"),
  ]),
  thrash_landing: mod("thrash_landing", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Thrash Landing — trick-score explosion (not weapon paper damage)"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Thrash Landing — explosion range display"),
  ]),
  trail_blazer: mod("trail_blazer", [], "wiki: Trail Blazer \u2014 Tricks leave a trail inflicting 40 <DT_FIRE_COLOR>Heat Damage to enemies."),
  vapor_trail: mod("vapor_trail", [], "wiki: Vapor Trail \u2014 Add 11 Boost Speed. Consumes 10 Energy/s"),
  venerdo_hoverdrive: mod("venerdo_hoverdrive", [], "wiki: Venerdo Hoverdrive \u2014 +30% K-Drive Jump Height"),
};
