/**
 * Per-mod verified behavior — one entry per mod ID, one line per stat on that mod.
 * Add mods here only after wiki verification for that specific mod.
 */
import type { ItemApplyMode, ItemApplyTarget, VerifiedItemStatLine, VerifiedModBehavior } from "@/lib/codex/item-behavior-types";

function line(
  statKey: string,
  target: ItemApplyTarget,
  mode: ItemApplyMode,
  source: string,
): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], customHandler?: string): VerifiedModBehavior {
  return customHandler ? { modId, customHandler, stats } : { modId, stats };
}

export const VERIFIED_MOD_BEHAVIORS: Record<string, VerifiedModBehavior> = {
  // ── Primary ─────────────────────────────────────────────────────────────
  serration_r3: mod("serration_r3", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Serration — +165% damage at R10"),
  ]),
  split_chamber_r3: mod("split_chamber_r3", [
    line("multishot", "weapon_dps", "multiplicative_percent", "wiki: Split Chamber — +90% multishot at R5"),
  ]),
  point_strike_r3: mod("point_strike_r3", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Point Strike — +150% crit chance at R5"),
  ]),
  vital_sense_r3: mod("vital_sense_r3", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "wiki: Vital Sense — +120% crit damage at R5"),
  ]),
  heavy_caliber: mod("heavy_caliber", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Heavy Caliber — +165% damage at R10"),
    line("accuracy", "mod_panel", "multiplicative_percent", "wiki: Heavy Caliber — accuracy penalty, not DPS math"),
  ]),
  hellfire_r3: mod("hellfire_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "wiki: Hellfire — +90% heat on base damage at R5"),
  ]),

  // ── Galvanized (each mod verified separately) ───────────────────────────
  galvanized_chamber: mod("galvanized_chamber", [
    line("multishot", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Chamber — base multishot"),
    line("multishotOnKill", "weapon_dps", "conditional_multishot_on_kill", "wiki: Galvanized Chamber — multishot per kill stack"),
  ]),
  galvanized_hell: mod("galvanized_hell", [
    line("multishot", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Hell — base multishot"),
    line("multishotOnKill", "weapon_dps", "conditional_multishot_on_kill", "wiki: Galvanized Hell — multishot per kill stack"),
  ]),
  galvanized_diffusion: mod("galvanized_diffusion", [
    line("multishot", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Diffusion — base multishot"),
    line("multishotOnKill", "weapon_dps", "conditional_multishot_on_kill", "wiki: Galvanized Diffusion — multishot per kill stack"),
  ]),
  galvanized_aptitude: mod("galvanized_aptitude", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Aptitude — +80% Status Chance (always-on paper)"),
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status_on_kill", "wiki: Galvanized Aptitude — damage per status per stack"),
  ]),
  galvanized_savvy: mod("galvanized_savvy", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Savvy — +80% Status Chance (always-on paper)"),
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status_on_kill", "wiki: Galvanized Savvy — damage per status per stack"),
  ]),
  galvanized_shot: mod("galvanized_shot", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Shot — +80% Status Chance (always-on paper)"),
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status_on_kill", "wiki: Galvanized Shot — damage per status per stack"),
  ]),

  // ── Melee ───────────────────────────────────────────────────────────────
  pressure_point_r3: mod("pressure_point_r3", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Pressure Point — +120% damage at R5"),
  ]),
  primed_pressure_point: mod("primed_pressure_point", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Primed Pressure Point — +165% damage at R10"),
  ]),
  true_steel_r3: mod("true_steel_r3", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: True Steel — +120% crit chance at R5"),
  ]),
  organ_shatter_r3: mod("organ_shatter_r3", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "wiki: Organ Shatter — +90% crit damage at R5"),
  ]),
  fury_r3: mod("fury_r3", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "wiki: Fury — +30% attack speed at R5"),
  ]),
  blood_rush: mod("blood_rush", [
    line("criticalChancePerCombo", "weapon_dps", "conditional_combo_crit", "wiki: Blood Rush — crit per combo multiplier tier"),
  ]),
  condition_overload: mod("condition_overload", [
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status", "wiki: Condition Overload — damage per status type on target"),
  ]),
  weeping_wounds_r5: mod("weeping_wounds_r5", [
    line("statusChance", "weapon_dps", "conditional_combo_status", "wiki: Weeping Wounds — status per combo multiplier tier"),
  ]),
  berserker_fury: mod("berserker_fury", [
    line("attackSpeed", "weapon_dps", "conditional_attack_speed_on_kill", "wiki: Berserker Fury — attack speed per kill stack (max 2)"),
  ]),
  north_wind_r3: mod("north_wind_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "wiki: North Wind — +90% cold on base damage at R5"),
  ]),
  shocking_touch_r3: mod("shocking_touch_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "wiki: Shocking Touch — +90% elec on base damage at R5"),
  ]),
  sacrificial_steel: mod("sacrificial_steel", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Sacrificial Steel — crit chance (set bonus applied separately)"),
    line("sentientDamage", "mod_panel", "multiplicative_percent", "wiki: Sacrificial Steel — vs Sentients, not generic DPS"),
  ]),

  volcanic_edge: mod("volcanic_edge", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "wiki: Volcanic Edge — +60% heat at R3"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Volcanic Edge — +60% status at R3"),
  ]),

  // ── Warframe ────────────────────────────────────────────────────────────
  intensify_r3: mod("intensify_r3", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "wiki: Intensify — +30% strength at R5"),
  ]),
  continuity_r3: mod("continuity_r3", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "wiki: Continuity — +30% duration at R5"),
  ]),
  stretch_r3: mod("stretch_r3", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "wiki: Stretch — +45% range at R5"),
  ]),
  flow_r3: mod("flow_r3", [
    line("energy", "warframe_totals", "multiplicative_percent", "wiki: Flow — +100% energy at R5 (post-U34)"),
  ]),
  vitality_r3: mod("vitality_r3", [
    line("health", "warframe_totals", "multiplicative_percent", "wiki: Vitality — +100% health at R10 (post-U34)"),
  ]),
  steel_fiber_r3: mod("steel_fiber_r3", [
    line("armor", "warframe_totals", "multiplicative_percent", "wiki: Steel Fiber — +100% armor at R10 (post-U34)"),
  ]),
};
