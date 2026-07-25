/**
 * Per-mod verified behaviors — category: tektolyst (20 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py tektolyst
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_TEKTOLYST: Record<string, VerifiedModBehavior> = {
  da_ren: mod("da_ren", [
    line("operatorShields", "mod_panel", "multiplicative_percent", "Da-Ren: operatorShields \u2014 +300 Operator Shields. +30 bonus for each Unairu School Mod"),
  ]),
  empazu_shol: mod("empazu_shol", [
    line("tauronCharge", "mod_panel", "multiplicative_percent", "Empazu-Shol: tauronCharge \u2014 +12% Tauron Strike Initial Charge. +2% bonus for each Mod from a unique School"),
  ]),
  esti_vel_ikha: mod("esti_vel_ikha", [
    line("voidSlingDistance", "mod_panel", "multiplicative_percent", "Esti Vel-Ikha: voidSlingDistance \u2014 Increases maximum Void Sling distance by +30%.\\\\n+10% Void Sling radius for each\u2026"),
  ]),
  evir_ti: mod("evir_ti", [
    line("operatorJumpHeight", "mod_panel", "multiplicative_percent", "Evir-Ti: operatorJumpHeight \u2014 +60% Operator Jump Height"),
  ]),
  hayan_dabor: mod("hayan_dabor", [
    line("ampMultishot", "mod_panel", "multiplicative_percent", "Hayan-Dabor: ampMultishot \u2014 +60% Amp Multishot"),
  ]),
  hok_kaal: mod("hok_kaal", [
    line("ampBonusDamage", "mod_panel", "flat", "Hok-Kaal: ampBonusDamage \u2014 After using Void Mode, the next Amp attack deals x3.0 bonus damage (cooldown 5s)"),
    line("cooldown", "mod_panel", "flat", "Hok-Kaal: cooldown \u2014 After using Void Mode, the next Amp attack deals x3.0 bonus damage (cooldown 5s)"),
  ]),
  kaal_zidi: mod("kaal_zidi", [
    line("voidModeEfficiency", "mod_panel", "multiplicative_percent", "Kaal-Zidi: voidModeEfficiency \u2014 +30% Void Mode efficiency\\\\n+5% Movement Speed in Void Mode for each Naramon Sch\u2026"),
  ]),
  lashta_vak: mod("lashta_vak", [
    line("range", "mod_panel", "multiplicative_percent", "Lashta-Vak: range \u2014 Void Sling emits a pulse that breaks Containers within 12 m\\\\n+2m bonus for each\u2026 (arsenal display only)"),
    line("voidSlingPulse", "mod_panel", "multiplicative_percent", "Lashta-Vak: voidSlingPulse \u2014 Void Sling emits a pulse that breaks Containers within 12 m\\\\n+2m bonus for each\u2026"),
  ]),
  lorun_tash: mod("lorun_tash", [
    line("operatorArmor", "mod_panel", "multiplicative_percent", "Lorun-Tash: operatorArmor \u2014 +400 Operator Armor"),
  ]),
  metem_erun: mod("metem_erun", [
    line("operatorSprintSpeed", "mod_panel", "multiplicative_percent", "Metem-Erun: operatorSprintSpeed \u2014 Increase Operator Sprint Speed by +30%\\\\n+5% bonus for each Mod from a unique Sc\u2026"),
  ]),
  metem_hakh: mod("metem_hakh", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Metem-Hakh — Operator HP/shields (not warframe health)"),
    line("operatorHealthShields", "mod_panel", "multiplicative_percent", "wiki: Metem-Hakh — Operator HP/shields (+ school bonus)"),
  ]),
  omn_evi: mod("omn_evi", [
    line("ampCriticalChance", "mod_panel", "multiplicative_percent", "Omn-Evi: ampCriticalChance \u2014 +60% Amp Critical Chance\\\\n+10% Amp Critical Damage for each Zenurik School Mod"),
    line("ampCritDamage", "mod_panel", "multiplicative_percent", "Omn-Evi: ampCritDamage \u2014 +10% Amp Critical Damage for each Zenurik School Mod (flat per rank)"),
  ]),
  sey_taph: mod("sey_taph", [
    line("voidSlingEfficiency", "mod_panel", "multiplicative_percent", "Sey-Taph: voidSlingEfficiency \u2014 +30% Void Sling Efficiency"),
  ]),
  sil_tabol: mod("sil_tabol", [
    line("ampStatusChance", "mod_panel", "multiplicative_percent", "Sil-Tabol: ampStatusChance \u2014 +60% Amp Status Chance\\\\n+15% Status Damage for each Vazarin School Mod"),
    line("ampStatusDamage", "mod_panel", "multiplicative_percent", "Sil-Tabol: ampStatusDamage \u2014 +15% Status Damage for each Vazarin School Mod (flat per rank)"),
  ]),
  talsek_an: mod("talsek_an", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Talsek-An: cooldown \u2014 Gain knockdown immunity. When knockdown is blocked, enter Void Mode for 3s (cool\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Talsek-An: duration \u2014 Gain knockdown immunity. When knockdown is blocked, enter Void Mode for 3s (cool\u2026"),
  ]),
  ubri_kaneph: mod("ubri_kaneph", [
    line("ampDamage", "mod_panel", "multiplicative_percent", "Ubri-Kaneph: ampDamage \u2014 +60% Damage to Amps\\\\n+10% bonus for each Mod from a unique School"),
    line("ampSchoolDamage", "mod_panel", "multiplicative_percent", "Ubri-Kaneph: ampSchoolDamage \u2014 +10% Amp Damage for each unique Focus School mod on the Artifact (flat per rank)"),
  ]),
  ulashta_shol: mod("ulashta_shol", [
    line("transferenceStaticDuration", "mod_panel", "multiplicative_percent", "Ulashta-Shol: transferenceStaticDuration \u2014 -60% Transference Static duration"),
  ]),
  vik_anam: mod("vik_anam", [
    line("ampEnergy", "mod_panel", "multiplicative_percent", "Vik-Anam: ampEnergy \u2014 +30% Maximum Amp Energy\\\\n+5% Amp Energy Regen Rate for each Madurai School Mod"),
    line("ampEnergyRegen", "mod_panel", "multiplicative_percent", "Vik-Anam: ampEnergyRegen \u2014 +5% Amp Energy Regen Rate for each Madurai School Mod (flat per rank)"),
  ]),
  vikla_safor: mod("vikla_safor", [
    line("ampAmmoEfficiency", "mod_panel", "multiplicative_percent", "Vikla-Safor: ampAmmoEfficiency \u2014 +30% Amp Fire Rate. +30% Amp Ammo Efficiency"),
    line("ampFireRate", "mod_panel", "multiplicative_percent", "Vikla-Safor: ampFireRate \u2014 +30% Amp Fire Rate. +30% Amp Ammo Efficiency"),
  ]),
  yar_dal: mod("yar_dal", [
    line("operatorHealth", "mod_panel", "multiplicative_percent", "Yar Dal: operatorHealth \u2014 +300 Operator Health"),
  ]),
};
