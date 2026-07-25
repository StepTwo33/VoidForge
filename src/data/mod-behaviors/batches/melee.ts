/**
 * Per-mod verified behaviors — category: melee (123 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py melee
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_MELEE: Record<string, VerifiedModBehavior> = {

  air_martial: mod("air_martial", [
    line("channelingDamage", "mod_panel", "multiplicative_percent", "Air Martial: channelingDamage \u2014 With Melee equipped, lock onto targets within +5m while Airborne, -100% Channeli\u2026"),
  ]),
  amalgam_organ_shatter: mod("amalgam_organ_shatter", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Amalgam Organ Shatter: criticalMultiplier \u2014 +85% Critical Damage\\\\n+60% Heavy Attack Wind Up Speed"),
    line("heavyAttackEfficiency", "weapon_dps", "multiplicative_percent", "Amalgam Organ Shatter: heavyAttackEfficiency \u2014 +85% Critical Damage\\\\n+60% Heavy Attack Wind Up Speed"),
    line("heavyWindUp", "mod_panel", "multiplicative_percent", "Amalgam Organ Shatter: heavyWindUp \u2014 +85% Critical Damage\\\\n+60% Heavy Attack Wind Up Speed"),
  ]),
  amanata_pressure: mod("amanata_pressure", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Amanata Pressure — 8x combo / heavy conditional"),
  ]),
  amars_contempt: mod("amars_contempt", [
    line("damage", "weapon_dps", "multiplicative_percent", "Amar's Contempt: damage \u2014 +90% Melee Damage\\\\n+30% Slash"),
    line("slash", "weapon_dps", "multiplicative_percent", "Amar's Contempt: slash \u2014 +90% Melee Damage\\\\n+30% Slash"),
  ]),
  auger_strike: mod("auger_strike", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Auger Strike: puncture \u2014 +120% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  berserker: mod("berserker", [
    line("attackSpeedOnCrit", "mod_panel", "multiplicative_percent", "Berserker: attackSpeedOnCrit \u2014 Stance: Valkyr is imbued with energy and becomes a ball of vicious rage, capable\u2026"),
  ]),
  berserker_fury: mod("berserker_fury", [
    line("attackSpeed", "weapon_dps", "conditional_attack_speed_on_kill", "Berserker Fury: attackSpeed \u2014 On Melee Kill:\\\\n+35% Attack Speed for 10s. Stacks up to 2x."),
    line("duration", "mod_panel", "multiplicative_percent", "Berserker Fury: duration \u2014 On Melee Kill:\\\\n+35% Attack Speed for 10s. Stacks up to 2x."),
  ]),
  blood_rush: mod("blood_rush", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Blood Rush: criticalChance \u2014 +40% Critical Chance per Combo Multiplier at max rank"),
    line("criticalChancePerCombo", "weapon_dps", "conditional_combo_crit", "Blood Rush: criticalChancePerCombo \u2014 +40% Critical Chance per Combo Multiplier at max rank"),
  ]),
  body_count: mod("body_count", [
    line("comboDuration", "weapon_dps", "additive_percent", "wiki: Body Count — +2s Combo Duration per rank (flat seconds)"),
    line("duration", "mod_panel", "multiplicative_percent", "Body Count: duration \u2014 +2s Combo Duration per rank"),
  ]),
  boreals_contempt: mod("boreals_contempt", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Boreal's Contempt \u2014 +90% Melee Damage at max"),
    line("statusDamage", "weapon_dps", "multiplicative_percent", "wiki: Boreal's Contempt \u2014 +60% Status Damage at max (DoT ticks)"),
  ]),
  burning_hate: mod("burning_hate", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Burning Hate \u2014 target vulnerability vs Heat-statused enemies only, not flat weapon damage (panel only)"),
  ]),
  buzz_kill: mod("buzz_kill", [
    line("slash", "weapon_dps", "multiplicative_percent", "Buzz Kill: slash \u2014 +120% <DT_SLASH_COLOR>Slash"),
  ]),
  carnis_mandible: mod("carnis_mandible", [
    line("slash", "weapon_dps", "multiplicative_percent", "Carnis Mandible: slash \u2014 +90% <DT_SLASH_COLOR>Slash, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Carnis Mandible: statusChance \u2014 +90% <DT_SLASH_COLOR>Slash, +60% Status Chance"),
  ]),
  collision_force: mod("collision_force", [
    line("impact", "weapon_dps", "multiplicative_percent", "Collision Force: impact \u2014 +120% <DT_IMPACT_COLOR>Impact"),
  ]),
  combo_fury: mod("combo_fury", [
    line("duration", "mod_panel", "multiplicative_percent", "Combo Fury: duration \u2014 On Melee Kill:\\\\n+100% Reload Speed\\\\n+100% Magazine Capacity for 12s on Seconda\u2026"),
    line("magazine", "mod_panel", "multiplicative_percent", "wiki: Combo Fury — secondary buff via linkage.meleeMods (Sim5 cross-slot)"),
    line("reloadSpeed", "mod_panel", "multiplicative_percent", "wiki: Combo Fury — secondary buff via linkage.meleeMods (Sim5 cross-slot)"),
  ]),
  combo_killer: mod("combo_killer", [
    line("comboDuration", "weapon_dps", "additive_percent", "wiki: Combo Killer — +5s Combo Duration (flat seconds)"),
    line("duration", "mod_panel", "multiplicative_percent", "Combo Killer: duration \u2014 +5s Combo Duration, On Kill with Secondary Weapon:\\\\nReset Melee Combo Timer"),
  ]),
  condition_overload: mod("condition_overload", [
    line("damage", "weapon_dps", "multiplicative_percent", "Condition Overload: damage \u2014 +80% Damage per Status Type affecting the target at max rank"),
    line("damagePerStatus", "weapon_dps", "conditional_damage_per_status", "Condition Overload: damagePerStatus \u2014 +80% Damage per Status Type affecting the target at max rank"),
  ]),
  conditions_perfection: mod("conditions_perfection", [
    line("statusChance", "mod_panel", "multiplicative_percent", "wiki: Condition's Perfection — Tennokai-only status"),
  ]),
  corrupt_charge: mod("corrupt_charge", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Corrupt Charge: attackSpeed \u2014 Start with +15 Combo, -10% Attack Speed per rank"),
    line("comboCount", "mod_panel", "multiplicative_percent", "Corrupt Charge: comboCount \u2014 Start with +15 Combo, -10% Attack Speed per rank"),
  ]),
  counterweight: mod("counterweight", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Counterweight — IPS convert (not always-on damage)"),
  ]),
  covert_lethality: mod("covert_lethality", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Covert Lethality — initial combo / finisher (not light DPS)"),
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Covert Lethality: finisherDamage \u2014 +16 Initial Combo\\\\n+100% Finisher Damage"),
    line("lethalDamage", "mod_panel", "multiplicative_percent", "Covert Lethality: lethalDamage \u2014 +16 Initial Combo\\\\n+100% Finisher Damage"),
  ]),
  disciplines_merit: mod("disciplines_merit", [], "wiki: Discipline's Merit \u2014 Enables Tennokai. Opportunities occur every 4 melee hits instead of at random."),
  dispatch_overdrive: mod("dispatch_overdrive", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Dispatch Overdrive — heavy-hit gated movement"),
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Dispatch Overdrive — heavy-hit gated movement"),
  ]),
  dreamers_wrath: mod("dreamers_wrath", [
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "wiki: Dreamer's Wrath — Tennokai-only crit damage"),
  ]),
  drifting_contact_r3: mod("drifting_contact_r3", [
    line("comboDuration", "weapon_dps", "additive_percent", "wiki: Drifting Contact — +10s Combo Duration (flat seconds)"),
    line("duration", "mod_panel", "multiplicative_percent", "Drifting Contact: duration \u2014 +10s Combo Duration, +40% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Drifting Contact: statusChance \u2014 +10s Combo Duration, +40% Status Chance"),
  ]),
  enduring_affliction: mod("enduring_affliction", [
    line("statusChance", "mod_panel", "multiplicative_percent", "wiki: Enduring Affliction — Lifted-only status"),
  ]),
  enduring_strike: mod("enduring_strike", [
    line("comboCountChance", "mod_panel", "multiplicative_percent", "Enduring Strike: comboCountChance \u2014 +20% Additional Combo Count Chance on Lifted enemies"),
  ]),
  energy_channel_r10: mod("energy_channel_r10", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Energy Channel — next-attack energy convert (not always-on)"),
  ]),
  explosive_demise: mod("explosive_demise", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Explosive Demise: explosionDamage \u2014 Enemies killed explode, dealing 300 Damage shortly after death."),
  ]),
  fever_strike_r3: mod("fever_strike_r3", [
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Fever Strike: toxin \u2014 +90% <DT_POISON_COLOR>Toxin"),
  ]),
  finishing_touch_r10: mod("finishing_touch_r10", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Finishing Touch — finisher-only (not light DPS)"),
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Finishing Touch: finisherDamage \u2014 +60% Finisher Damage"),
  ]),
  focus_energy_r3: mod("focus_energy_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Focus Energy: electricity \u2014 +40% Heavy Attack Efficiency, +60% <DT_ELECTRICITY_COLOR>Electricity"),
    line("heavyAttackEfficiency", "weapon_dps", "additive_percent", "wiki: Focus Energy — +40% Heavy Attack Efficiency"),
  ]),
  focus_radon: mod("focus_radon", [
    line("heavyAttackEfficiency", "weapon_dps", "additive_percent", "wiki: Focus Radon — +40% Heavy Attack Efficiency"),
    line("radiation", "weapon_dps", "elemental_from_base_damage", "Focus Radon: radiation \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Heavy Attack Efficiency"),
  ]),
  focused_defense: mod("focused_defense", [
    line("blockAngle", "mod_panel", "multiplicative_percent", "Focused Defense: blockAngle \u2014 +20\u00b0 Block Angle"),
  ]),
  fury_r3: mod("fury_r3", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Fury: attackSpeed \u2014 +30% Attack Speed"),
  ]),
  galvanized_elementalist: mod("galvanized_elementalist", [
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Elementalist: buff duration 20s (panel only)"),
    line("statusDamage", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Elementalist — +80% Status Damage (always)"),
    line("statusChance", "weapon_dps", "conditional_stat_per_kill_stack", "wiki: Galvanized Elementalist — +30% Status Chance per melee kill (cap 4 → +120%)"),
  ]),
  galvanized_reflex: mod("galvanized_reflex", [
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Reflex: duration \u2014 +50% Heavy Attack Efficiency\\\\nOn Melee Kill:\\\\n+20 Initial Combo for 20s. Stack\u2026"),
    line("heavyAttackEfficiency", "weapon_dps", "additive_percent", "wiki: Galvanized Reflex — +50% Heavy Attack Efficiency (base; stacks conditional)"),
  ]),
  galvanized_steel: mod("galvanized_steel", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Galvanized Steel — +110% Critical Chance (x2 for Heavy Attacks)"),
    line("criticalMultiplier", "weapon_dps", "conditional_stat_per_kill_stack", "wiki: Galvanized Steel — +30% Critical Damage per melee kill (cap 4 → +120%)"),
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Steel: buff duration 20s (panel only)"),
  ]),

  gladiator_might: mod("gladiator_might", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Gladiator Might: criticalMultiplier \u2014 +7.5% Critical Damage per rank (Set)"),
  ]),
  gladiator_rush: mod("gladiator_rush", [
    line("comboDuration", "weapon_dps", "additive_percent", "wiki: Gladiator Rush — +1.5s Combo Duration per rank (flat seconds)"),
    line("duration", "mod_panel", "multiplicative_percent", "Gladiator Rush: duration \u2014 +1.5s Combo Duration per rank (Set)"),
  ]),
  gladiator_vice: mod("gladiator_vice", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Gladiator Vice: attackSpeed \u2014 +7.5% Attack Speed per rank (Set)"),
  ]),
  guardian_derision: mod("guardian_derision", [
    line("comboCountChance", "mod_panel", "multiplicative_percent", "Guardian Derision: comboCountChance \u2014 Blocking taunts enemies within 15 meters to target you instead of allies., +30% \u2026"),
  ]),
  harrowed_hook: mod("harrowed_hook", [
    line("duration", "mod_panel", "multiplicative_percent", "Harrowed Hook: duration \u2014 With Melee Weapon equipped, unchanneled hits slow target and disable jump for +2\u2026"),
  ]),
  healing_return: mod("healing_return", [
    line("healthOnStatus", "mod_panel", "multiplicative_percent", "Healing Return: healthOnStatus \u2014 Restores 11 Health per Status Type affecting the target"),
  ]),
  heartseeker: mod("heartseeker", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Heartseeker — damage block penalty (not melee damage)"),
    line("range", "mod_panel", "multiplicative_percent", "Heartseeker: range \u2014 Lock onto targets within 1m, but reduces blocking effectiveness., -50% Damage Bl\u2026 (arsenal display only)"),
  ]),
  heavy_trauma: mod("heavy_trauma", [
    line("impact", "weapon_dps", "multiplicative_percent", "Heavy Trauma: impact \u2014 +90% <DT_IMPACT_COLOR>Impact"),
  ]),
  impenetrable_offense: mod("impenetrable_offense", [
    line("damage", "weapon_dps", "multiplicative_percent", "Impenetrable Offense: damage \u2014 +30% Damage Block, -10% Melee Damage"),
  ]),
  jagged_edge: mod("jagged_edge", [
    line("slash", "weapon_dps", "multiplicative_percent", "Jagged Edge: slash \u2014 +90% <DT_SLASH_COLOR>Slash"),
  ]),
  jugulus_barbs: mod("jugulus_barbs", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Jugulus Barbs: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Jugulus Barbs: statusChance \u2014 +90% <DT_PUNCTURE_COLOR>Puncture, +60% Status Chance"),
  ]),
  killing_blow: mod("killing_blow", [
    // Wiki: +120% Melee Damage On Heavy Attack only — not light/paper DPS.
    line("damage", "mod_panel", "multiplicative_percent", "Killing Blow: damage \u2014 +120% Melee Damage On Heavy Attack\\\\n+60% Heavy Attack Wind Up Speed"),
    line("heavyAttackDamage", "mod_panel", "multiplicative_percent", "Killing Blow: heavyAttackDamage \u2014 +120% Melee Damage On Heavy Attack\\\\n+60% Heavy Attack Wind Up Speed"),
    line("heavyAttackEfficiency", "mod_panel", "multiplicative_percent", "Killing Blow: heavyAttackEfficiency \u2014 +120% Melee Damage On Heavy Attack\\\\n+60% Heavy Attack Wind Up Speed (wind-up; panel until heavy DPS model)"),
  ]),
  lasting_sting: mod("lasting_sting", [
    line("statusDuration", "weapon_dps", "multiplicative_percent", "Lasting Sting: statusDuration \u2014 +110% Status Duration (extends DoT ticks)"),
  ]),
  life_strike: mod("life_strike", [
    line("lifeSteal", "mod_panel", "multiplicative_percent", "Life Strike: lifeSteal \u2014 Heavy Attacks have +5% Life Steal per rank"),
  ]),
  magnetic_rush: mod("magnetic_rush", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Magnetic Rush: attackSpeed \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +20% Attack Speed"),
    line("magnetic", "weapon_dps", "elemental_from_base_damage", "Magnetic Rush: magnetic \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +20% Attack Speed"),
  ]),
  maiming_strike: mod("maiming_strike", [
    // Wiki: +150% Critical Chance for Slide Attack only — not standing paper CC.
    line("criticalChance", "mod_panel", "multiplicative_percent", "Maiming Strike: criticalChance \u2014 +150% Critical Chance for Slide Attack (slide-only; not standing paper DPS)"),
  ]),
  mark_of_the_beast: mod("mark_of_the_beast", [
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Mark Of The Beast — secondary buff via linkage.meleeMods (Sim5 cross-slot)"),
    line("duration", "mod_panel", "multiplicative_percent", "Mark Of The Beast: duration \u2014 On 6 Melee Kills within 6s: +120% Status/Crit for Secondary"),
    line("statusChance", "mod_panel", "multiplicative_percent", "wiki: Mark Of The Beast — secondary buff via linkage.meleeMods (Sim5 cross-slot)"),
  ]),
  martial_fury: mod("martial_fury", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Martial Fury: attackSpeed \u2014 +20% Attack Speed, -50% Energy Rate"),
    line("energy", "warframe_totals", "multiplicative_percent", "Martial Fury: energy \u2014 +20% Attack Speed, -50% Energy Rate"),
  ]),
  masters_edge: mod("masters_edge", [
    line("damage", "mod_panel", "multiplicative_percent", "Master's Edge: damage \u2014 Enables Tennokai. Increases Tennokai damage by 60%."),
  ]),

  melee_elementalist: mod("melee_elementalist", [
    line("statusDamage", "weapon_dps", "multiplicative_percent", "wiki: Melee Elementalist — +90% Status Damage"),
    line("heavyAttackSpeed", "weapon_dps", "multiplicative_percent", "wiki: Melee Elementalist — +60% Heavy Attack Wind Up Speed"),
  ]),
  melee_prowess: mod("melee_prowess", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Melee Prowess: statusChance \u2014 +90% Status Chance"),
  ]),
  mentors_legacy: mod("mentors_legacy", [], "wiki: Mentor's Legacy \u2014 Enables Tennokai."),
  molten_impact_r3: mod("molten_impact_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Molten Impact: heat \u2014 +90% <DT_FIRE_COLOR>Heat"),
  ]),
  mortal_conduct: mod("mortal_conduct", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Mortal Conduct — low-health block reflect"),
    line("duration", "mod_panel", "multiplicative_percent", "Mortal Conduct: duration \u2014 At Less than 50 Health:\\\\n+60% Damage taken is reflected when Blocking attacks w\u2026"),
  ]),
  motus_impact: mod("motus_impact", [
    line("range", "mod_panel", "multiplicative_percent", "Motus Impact: range \u2014 Increase range of aerial melee attacks by +2m. (arsenal display only)"),
  ]),
  niras_contempt: mod("niras_contempt", [
    line("damage", "weapon_dps", "multiplicative_percent", "Nira's Contempt: damage \u2014 +90% Melee Damage\\\\n+60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Nira's Contempt: statusChance \u2014 +90% Melee Damage\\\\n+60% Status Chance"),
  ]),
  north_wind_r3: mod("north_wind_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "North Wind: cold \u2014 +90% <DT_FREEZE_COLOR>Cold"),
  ]),
  opportunitys_reach: mod("opportunitys_reach", [
    line("duration", "mod_panel", "multiplicative_percent", "Opportunity's Reach: duration \u2014 Enables Tennokai. Increases opportunity window to 4.0s and melee range by 3m for\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Opportunity's Reach: range \u2014 Enables Tennokai. Increases opportunity window to 4.0s and melee range by 3m for\u2026 (arsenal display only)"),
  ]),
  organ_shatter_r3: mod("organ_shatter_r3", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Organ Shatter: criticalMultiplier \u2014 +90% Critical Damage"),
  ]),
  power_throw: mod("power_throw", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Power Throw \u2014 +100% Throw Damage on consecutive throws only (thrown attacks not in melee DPS; panel only)"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Power Throw: punchThrough \u2014 +2 Punch Through (arsenal display only)"),
  ]),
  pressure_point_r3: mod("pressure_point_r3", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Pressure Point — +120% Melee Damage at R5"),
  ]),
  primed_fever_strike: mod("primed_fever_strike", [
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Primed Fever Strike: toxin \u2014 +15% Toxin per rank (Primed)"),
  ]),
  primed_fury: mod("primed_fury", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Primed Fury: attackSpeed \u2014 +7.5% Attack Speed per rank (Primed)"),
  ]),
  primed_heavy_trauma: mod("primed_heavy_trauma", [
    line("impact", "weapon_dps", "multiplicative_percent", "Primed Heavy Trauma: impact \u2014 +165% <DT_IMPACT_COLOR>Impact"),
  ]),
  primed_pressure_point: mod("primed_pressure_point", [
    line("damage", "weapon_dps", "multiplicative_percent", "Primed Pressure Point: damage \u2014 +20% Damage per rank (Primed)"),
  ]),
  primed_reach: mod("primed_reach", [
    line("range", "mod_panel", "multiplicative_percent", "Primed Reach: range \u2014 +17% Range per rank (Primed) (arsenal display only)"),
  ]),
  primed_smite_corpus: mod("primed_smite_corpus", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Primed Smite Corpus: factionCorpus \u2014 x1.55 Damage to Corpus"),
  ]),
  primed_smite_grineer: mod("primed_smite_grineer", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Primed Smite Grineer: factionGrineer \u2014 x1.55 Damage to Grineer"),
  ]),
  primed_smite_infested: mod("primed_smite_infested", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Primed Smite Infested: factionInfested \u2014 x1.55 Damage to Infested"),
  ]),
  primed_smite_orokin: mod("primed_smite_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Primed Smite Orokin: factionOrokin \u2014 x1.55 Damage to Orokin"),
  ]),
  primed_smite_the_murmur: mod("primed_smite_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Primed Smite The Murmur: factionMurmur \u2014 x1.55 Damage to Murmur"),
  ]),
  proton_snap: mod("proton_snap", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Proton Snap — Hold Wall Latch for 2s: +100% Toxin (catalog key damage→toxin)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Proton Snap — wall-latch buff duration"),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Proton Snap — Hold Wall Latch for 2s: +50% Status Chance for 20s"),
  ]),
  quick_return: mod("quick_return", [
    line("ricochetBounces", "mod_panel", "multiplicative_percent", "Quick Return: ricochetBounces \u2014 -4 Bounce"),
  ]),
  quickening_r3: mod("quickening_r3", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Quickening: attackSpeed \u2014 +40% Attack Speed, +20% Combo Count Chance"),
    line("comboCountChance", "mod_panel", "multiplicative_percent", "Quickening: comboCountChance \u2014 +40% Attack Speed, +20% Combo Count Chance"),
  ]),
  reach_r3: mod("reach_r3", [
    line("range", "mod_panel", "multiplicative_percent", "Reach: range \u2014 +1.5 Range (arsenal display only)"),
  ]),
  rebound: mod("rebound", [
    line("ricochetBounces", "mod_panel", "multiplicative_percent", "Rebound: ricochetBounces \u2014 +4 Bounce"),
  ]),
  reflex_coil_r3: mod("reflex_coil_r3", [
    line("heavyAttackEfficiency", "weapon_dps", "additive_percent", "wiki: Reflex Coil — +60% Heavy Attack Efficiency"),
  ]),
  relentless_assault: mod("relentless_assault", [
    line("duration", "mod_panel", "multiplicative_percent", "Relentless Assault: duration \u2014 On Kill:\\\\n+2 Energy Rate for 4s"),
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Relentless Assault: energyOnKill \u2014 On Kill:\\\\n+2 Energy Rate for 4s"),
  ]),
  relentless_combination_r3: mod("relentless_combination_r3", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Relentless Combination — slash-status combo chance (not damage)"),
  ]),
  rending_strike: mod("rending_strike", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Rending Strike: puncture \u2014 +60% <DT_SLASH_COLOR>Slash, +80% <DT_PUNCTURE_COLOR>Puncture"),
    line("slash", "weapon_dps", "multiplicative_percent", "Rending Strike: slash \u2014 +60% <DT_SLASH_COLOR>Slash, +80% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  riven_melee: mod("riven_melee", [], "wiki: Riven Mod (Melee) \u2014 Riven mod with random stats. Configure stats after equipping."),
  sacrificial_pressure: mod("sacrificial_pressure", [
    line("damage", "weapon_dps", "multiplicative_percent", "Sacrificial Pressure: damage \u2014 +110% Melee Damage, x1.33 Damage to Sentients"),
    line("sentientDamage", "mod_panel", "multiplicative_percent", "Sacrificial Pressure: sentientDamage \u2014 +110% Melee Damage, x1.33 Damage to Sentients"),
  ]),
  sacrificial_steel: mod("sacrificial_steel", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Sacrificial Steel: criticalChance \u2014 +220% Critical Chance (x2 for Heavy Attacks)\\\\nx1.33 Damage to Sentients"),
    line("sentientDamage", "mod_panel", "multiplicative_percent", "Sacrificial Steel: sentientDamage \u2014 +220% Critical Chance (x2 for Heavy Attacks)\\\\nx1.33 Damage to Sentients"),
  ]),
  saxum_thorax: mod("saxum_thorax", [
    line("impact", "weapon_dps", "multiplicative_percent", "Saxum Thorax: impact \u2014 +90% <DT_IMPACT_COLOR>Impact, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Saxum Thorax: statusChance \u2014 +90% <DT_IMPACT_COLOR>Impact, +60% Status Chance"),
  ]),
  seismic_wave: mod("seismic_wave", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Seismic Wave — slam-only (not light DPS)"),
  ]),
  serrated_edges: mod("serrated_edges", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Serrated Edges — IPS convert (not always-on damage)"),
  ]),
  sharpened_blade: mod("sharpened_blade", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Sharpened Blade — IPS convert (not always-on damage)"),
  ]),
  shocking_touch_r3: mod("shocking_touch_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Shocking Touch: electricity \u2014 +90% <DT_ELECTRICITY_COLOR>Electricity"),
  ]),
  smite_corpus_r3: mod("smite_corpus_r3", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Smite Corpus: factionCorpus \u2014 x1.3 Damage to Corpus"),
  ]),
  smite_grineer_r3: mod("smite_grineer_r3", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Smite Grineer: factionGrineer \u2014 x1.3 Damage to Grineer"),
  ]),
  smite_infested_r3: mod("smite_infested_r3", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Smite Infested: factionInfested \u2014 x1.3 Damage to Infested"),
  ]),
  smite_orokin: mod("smite_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Smite Orokin: factionOrokin \u2014 x1.3 Damage to Orokin"),
  ]),
  smite_the_murmur: mod("smite_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Smite The Murmur: factionMurmur \u2014 x1.3 Damage to Murmur"),
  ]),
  spoiled_strike_r3: mod("spoiled_strike_r3", [
    line("attackSpeed", "weapon_dps", "multiplicative_percent", "Spoiled Strike: attackSpeed \u2014 +100% Melee Damage, -20% Attack Speed"),
    line("damage", "weapon_dps", "multiplicative_percent", "Spoiled Strike: damage \u2014 +100% Melee Damage, -20% Attack Speed"),
  ]),
  spring_loaded_blade: mod("spring_loaded_blade", [
    line("duration", "mod_panel", "multiplicative_percent", "Spring-Loaded Blade: duration \u2014 On Status Effect: +1 Range for 24s. Stacks up to 2 times."),
    line("range", "mod_panel", "multiplicative_percent", "Spring-Loaded Blade: range \u2014 On Status Effect: +1 Range for 24s. Stacks up to 2 times. (arsenal display only)"),
  ]),
  stand_ground: mod("stand_ground", [
    line("damageReduction", "mod_panel", "multiplicative_percent", "Stand Ground: damageReduction \u2014 Blocking reduces damage taken from enemy abilities by 60%."),
  ]),
  strain_infection: mod("strain_infection", [
    line("criticalMultiplier", "weapon_dps", "conditional_stat_per_kill_stack", "wiki: Strain Infection — +20% CD per cyst (cap 8 full set; sim uses killStacks)"),
  ]),
  sundering_strike: mod("sundering_strike", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Sundering Strike: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  sword_alone: mod("sword_alone", [
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Sword Alone — melee-equipped gated mobility"),
  ]),
  tek_gravity_r3: mod("tek_gravity_r3", [
    line("range", "mod_panel", "multiplicative_percent", "Tek Gravity: range \u2014 Slam Attacks in the Marked Zone pull all enemies within 20m. (arsenal display only)"),
  ]),
  true_punishment: mod("true_punishment", [
    line("comboCountChance", "mod_panel", "multiplicative_percent", "True Punishment: comboCountChance \u2014 +100% Additional Combo Count Chance, -50% Combo Duration"),
    line("comboDuration", "mod_panel", "multiplicative_percent", "wiki: True Punishment — -50% Combo Duration (percent of base; panel until duration mult model)"),
  ]),
  true_steel_r3: mod("true_steel_r3", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "True Steel: criticalChance \u2014 +120% Critical Chance (x2 for Heavy Attacks)"),
  ]),
  truths_flame: mod("truths_flame", [
    line("duration", "mod_panel", "multiplicative_percent", "Truth's Flame: duration \u2014 Enables Tennokai.\\\\nTennokai kills grant an additional 4s Tennokai opportunity a\u2026"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Truth's Flame: syndicatePower \u2014 Enables Tennokai.\\\\nTennokai kills grant an additional 4s Tennokai opportunity a\u2026"),
  ]),
  vicious_frost: mod("vicious_frost", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Vicious Frost: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Vicious Frost: statusChance \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
  ]),
  virulent_scourge: mod("virulent_scourge", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Virulent Scourge: statusChance \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Virulent Scourge: toxin \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
  ]),
  volatile_quick_return: mod("volatile_quick_return", [
    line("explosionChance", "mod_panel", "multiplicative_percent", "Volatile Quick Return: explosionChance \u2014 -4 Bounce, +3 Blast Radius, +100% Chance to explode on Bounce (Disables Punch Th\u2026"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Volatile Quick Return: punchThrough \u2014 -4 Bounce, +3 Blast Radius, +100% Chance to explode on Bounce (Disables Punch Th\u2026 (arsenal display only)"),
    line("ricochetBounces", "mod_panel", "multiplicative_percent", "Volatile Quick Return: ricochetBounces \u2014 -4 Bounce, +3 Blast Radius, +100% Chance to explode on Bounce (Disables Punch Th\u2026"),
  ]),
  volatile_rebound: mod("volatile_rebound", [
    line("explosionChance", "mod_panel", "multiplicative_percent", "Volatile Rebound: explosionChance \u2014 +100% Chance to explode on Bounce (Disables Punch Through)"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Volatile Rebound: punchThrough \u2014 +100% Chance to explode on Bounce (Disables Punch Through) (arsenal display only)"),
  ]),
  volcanic_edge: mod("volcanic_edge", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Volcanic Edge: heat \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Volcanic Edge: statusChance \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
  ]),
  voltaic_strike: mod("voltaic_strike", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Voltaic Strike: electricity \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Voltaic Strike: statusChance \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
  ]),
  weeping_wounds_r5: mod("weeping_wounds_r5", [
    line("statusChance", "weapon_dps", "conditional_combo_status", "Weeping Wounds: statusChance \u2014 +40% Status Chance per Combo Multiplier"),
  ]),
  whirlwind: mod("whirlwind", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Whirlwind: projectileSpeed \u2014 +180% Projectile Speed"),
  ]),
};
