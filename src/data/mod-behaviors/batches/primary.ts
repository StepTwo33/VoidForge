/**
 * Per-mod verified behaviors — category: primary (130 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py primary
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_PRIMARY: Record<string, VerifiedModBehavior> = {
  adhesive_blast: mod("adhesive_blast", [], "wiki: Adhesive Blast \u2014 Grenades have 100% chance to stick to surfaces."),
  aerial_ace: mod("aerial_ace", [], "wiki: Aerial Ace \u2014 On Kill:\\\\nRefresh Double Jump up to 6x while Airborne."),
  aero_agility: mod("aero_agility", [
    line("reloadSpeed", "weapon_dps", "conditional_stat_on_trigger", "wiki: Aero Agility — +100% Reload Speed while Aim Gliding"),
  ]),
  aero_periphery: mod("aero_periphery", [
    line("zoom", "mod_panel", "multiplicative_percent", "Aero Periphery: zoom \u2014 -50% Zoom while Aim Gliding (arsenal display only)"),
  ]),
  agile_aim: mod("agile_aim", [
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Agile Aim — aiming-gated movement"),
  ]),
  ambush_optics: mod("ambush_optics", [
    line("zoom", "mod_panel", "multiplicative_percent", "Ambush Optics: zoom \u2014 -50% Zoom (arsenal display only)"),
  ]),
  ammo_drum: mod("ammo_drum", [
    line("ammoMaximum", "mod_panel", "multiplicative_percent", "Ammo Drum: ammoMaximum \u2014 +90% Ammo Maximum"),
  ]),
  apex_predator: mod("apex_predator", [
    line("duration", "mod_panel", "multiplicative_percent", "Apex Predator: duration \u2014 On Hit:\\\\nReveals target on Minimap for +6s."),
  ]),
  arrow_mutation: mod("arrow_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Arrow Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 50% of Ammo Pick Up."),
  ]),
  bane_of_corpus: mod("bane_of_corpus", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Bane Of Corpus: factionCorpus \u2014 x1.3 Damage to Corpus"),
  ]),
  bane_of_grineer: mod("bane_of_grineer", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Bane Of Grineer: factionGrineer \u2014 x1.3 Damage to Grineer"),
  ]),
  bane_of_infested: mod("bane_of_infested", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Bane Of Infested: factionInfested \u2014 x1.3 Damage to Infested"),
  ]),
  bane_of_orokin: mod("bane_of_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Bane Of Orokin: factionOrokin \u2014 x1.3 Damage to Orokin"),
  ]),
  bane_of_the_murmur: mod("bane_of_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Bane Of The Murmur: factionMurmur \u2014 x1.3 Damage to Murmur"),
  ]),
  bhisaj_bal: mod("bhisaj_bal", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Bhisaj-Bal: statusChance \u2014 Restore 300 Health for every 3 Status effects., +90% Status Chance"),
  ]),
  biotic_rounds: mod("biotic_rounds", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Biotic Rounds — weak-point-kill gated"),
    line("viral", "weapon_dps", "conditional_stat_on_kill", "wiki: Biotic Rounds — On Weak Point Kill: +150% Viral for 15s"),
    line("magnetic", "weapon_dps", "conditional_stat_on_kill", "wiki: Biotic Rounds — On Weak Point Kill: +150% Magnetic for 15s"),
    line("statusChance", "weapon_dps", "conditional_stat_on_kill", "wiki: Biotic Rounds — On Weak Point Kill: +150% Status Chance for 15s"),
  ]),
  brain_storm: mod("brain_storm", [
    line("ammoEfficiency", "weapon_dps", "conditional_stat_on_trigger", "wiki: Brain Storm — On Headshot: +100% Ammo Efficiency for 0.5s"),
    line("duration", "mod_panel", "multiplicative_percent", "Brain Storm: duration \u2014 On Headshot:\\\\n+100% Ammo Efficiency for 0.5s"),
  ]),
  catalyzer_link: mod("catalyzer_link", [
    line("duration", "mod_panel", "multiplicative_percent", "Catalyzer Link: duration \u2014 On Ability Cast:\\\\n+60% Status Chance when Aiming for 9s"),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Catalyzer Link \u2014 On Ability Cast: +60% Status Chance when Aiming for 9s"),
  ]),
  cautious_shot: mod("cautious_shot", [], "wiki: Cautious Shot \u2014 +100% chance to reduce the Stagger effect from self-imposed Radial Attacks"),
  charged_chamber: mod("charged_chamber", [
    line("damageFirstShot", "weapon_dps", "first_shot_damage", "wiki: Charged Chamber \u2014 +40% Damage on first shot in Magazine (averaged over mag for DPS)"),
  ]),
  combat_reload: mod("combat_reload", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Combat Reload — headshot-pellet gated"),
    line("reloadSpeed", "weapon_dps", "conditional_stat_on_trigger", "wiki: Combat Reload — If 5 pellets are headshots: +120% Reload Speed for 3s"),
  ]),
  combustion_beam: mod("combustion_beam", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Combustion Beam: explosionDamage \u2014 Enemies killed explode, dealing 600 Damage shortly after death."),
  ]),
  comet_rounds: mod("comet_rounds", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Comet Rounds — IPS convert (not always-on damage)"),
  ]),
  continuous_misery: mod("continuous_misery", [
    line("statusDuration", "weapon_dps", "multiplicative_percent", "Continuous Misery: statusDuration \u2014 +100% Status Duration (extends DoT ticks)"),
  ]),
  crash_course: mod("crash_course", [
    line("impact", "weapon_dps", "multiplicative_percent", "Crash Course: impact \u2014 +120% <DT_IMPACT_COLOR>Impact"),
  ]),
  critical_precision: mod("critical_precision", [
    line("critBonusPerKill", "mod_panel", "multiplicative_percent", "wiki: Critical Precision — duplicate stack display key"),
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Critical Precision — HS stacks +10% CC up to +500% (criticalPrecisionStacks; miss ≈ −10 stacks)"),
  ]),
  cryo_rounds_r3: mod("cryo_rounds_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Cryo Rounds: cold \u2014 +90% <DT_FREEZE_COLOR>Cold"),
  ]),
  deft_tempo: mod("deft_tempo", [
    line("duration", "mod_panel", "multiplicative_percent", "Deft Tempo: duration \u2014 On Headshot:\\\\n+10% Mobility for 4s"),
  ]),
  depleted_reload: mod("depleted_reload", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Depleted Reload: magazine \u2014 -60% Magazine Capacity, +48% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Depleted Reload: reloadSpeed \u2014 -60% Magazine Capacity, +48% Reload Speed"),
  ]),
  directed_convergence: mod("directed_convergence", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Directed Convergence: accuracy \u2014 +100% Accuracy when Aiming (arsenal display only)"),
  ]),
  double_tap: mod("double_tap", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Double Tap — On Hit: +20% Damage/stack (cap 20; sim assumes max)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Double Tap — stack window"),
  ]),
  dreadful_killshot: mod("dreadful_killshot", [
    line("health", "weapon_dps", "conditional_stat_on_trigger", "wiki: Dreadful Killshot — +20% Damage & SC per 75 current HP, cap +360% (sim assumes cap)"),
  ]),
  eagle_eye: mod("eagle_eye", [
    line("zoom", "mod_panel", "multiplicative_percent", "Eagle Eye: zoom \u2014 +40% Zoom (arsenal display only)"),
  ]),
  emergent_aftermath: mod("emergent_aftermath", [
    line("duration", "mod_panel", "multiplicative_percent", "Emergent Aftermath: duration \u2014 On Kill:\\\\n+50% Reload Speed for 3s"),
    line("reloadSpeed", "weapon_dps", "conditional_stat_on_kill", "wiki: Emergent Aftermath \u2014 On Kill: +50% Reload Speed for 3s"),
  ]),
  fanged_fusillade: mod("fanged_fusillade", [
    line("slash", "weapon_dps", "multiplicative_percent", "Fanged Fusillade: slash \u2014 +120% <DT_SLASH_COLOR>Slash"),
  ]),
  fast_hands_r3: mod("fast_hands_r3", [
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Fast Hands: reloadSpeed \u2014 +30% Reload Speed"),
  ]),
  feathered_arrows: mod("feathered_arrows", [
    line("damage", "weapon_dps", "multiplicative_percent", "Feathered Arrows: damage \u2014 +60% Projectile Speed, -20% Damage"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Feathered Arrows: projectileSpeed \u2014 +60% Projectile Speed, -20% Damage"),
  ]),
  final_tap: mod("final_tap", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Final Tap — On 4 Hits within 0.05s: +100% Damage for 0.2s"),
    line("duration", "mod_panel", "multiplicative_percent", "Final Tap: duration \u2014 On 4 Hits within 0.05s:\\\\n+100% Damage for 0.2s"),
  ]),
  firestorm: mod("firestorm", [
    line("blastRange", "mod_panel", "multiplicative_percent", "Firestorm: blastRange \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+24% Blast Range"),
    line("range", "mod_panel", "multiplicative_percent", "Firestorm: range \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+24% Blast Range (arsenal display only)"),
  ]),
  focused_acceleration: mod("focused_acceleration", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Focused Acceleration: projectileSpeed \u2014 When Aiming:\\\\n+80% Projectile Speed"),
  ]),
  gorgon_frenzy: mod("gorgon_frenzy", [
    line("duration", "mod_panel", "multiplicative_percent", "Gorgon Frenzy: duration \u2014 On Kill:\\\\n+30% Fire Rate for 3s"),
    line("fireRate", "weapon_dps", "conditional_stat_on_kill", "wiki: Gorgon Frenzy \u2014 On Kill: +30% Fire Rate for 3s"),
  ]),
  grinloked: mod("grinloked", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Grinloked: accuracy \u2014 +60% Accuracy when Aiming (arsenal display only)"),
  ]),
  guided_ordnance: mod("guided_ordnance", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Guided Ordnance: accuracy \u2014 On Hit:\\\\n+30% Accuracy when Aiming for 9s (arsenal display only)"),
    line("duration", "mod_panel", "multiplicative_percent", "Guided Ordnance: duration \u2014 On Hit:\\\\n+30% Accuracy when Aiming for 9s"),
  ]),
  gun_glide: mod("gun_glide", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Gun Glide: accuracy \u2014 -20% Weapon Recoil, and +20% Accuracy when Sliding (arsenal display only)"),
    line("recoil", "mod_panel", "multiplicative_percent", "Gun Glide: recoil \u2014 -20% Weapon Recoil, and +20% Accuracy when Sliding (arsenal display only)"),
  ]),
  harkonar_scope: mod("harkonar_scope", [
    line("comboDuration", "weapon_dps", "additive_percent", "wiki: Harkonar Scope — +12s Combo Duration (flat seconds)"),
    line("duration", "mod_panel", "multiplicative_percent", "Harkonar Scope: duration \u2014 +12s Combo Duration"),
  ]),
  hata_satya: mod("hata_satya", [
    line("critBonusPerKill", "mod_panel", "multiplicative_percent", "Hata-Satya: critBonusPerKill \u2014 Each hit increases Critical Chance by 1.2%. Resets upon reloading or holstering."),
  ]),
  hellfire_r3: mod("hellfire_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Hellfire: heat \u2014 +90% <DT_FIRE_COLOR>Heat"),
  ]),
  higasa_serration: mod("higasa_serration", [
    line("damage", "weapon_dps", "multiplicative_percent", "Higasa Serration: damage \u2014 Alternate Fire applies a random Status Effect to enemies hit.\\\\n+450% Damage"),
  ]),
  high_voltage_r3: mod("high_voltage_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "High Voltage: electricity \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "High Voltage: statusChance \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
  ]),
  hush_r3: mod("hush_r3", [
    line("noiseReduction", "mod_panel", "multiplicative_percent", "Hush: noiseReduction \u2014 Reduces the chance an enemy will hear gunfire by 100%."),
  ]),
  hydraulic_gauge: mod("hydraulic_gauge", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Hydraulic Gauge: magazine \u2014 -60% Weapon Recoil, -10% Magazine Capacity"),
    line("recoil", "mod_panel", "multiplicative_percent", "Hydraulic Gauge: recoil \u2014 -60% Weapon Recoil, -10% Magazine Capacity (arsenal display only)"),
  ]),
  infected_clip_r3: mod("infected_clip_r3", [
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Infected Clip: toxin \u2014 +90% <DT_POISON_COLOR>Toxin"),
  ]),
  internal_bleeding: mod("internal_bleeding", [
    line("slashOnImpactProc", "weapon_dps", "slash_on_impact_proc", "wiki: Internal Bleeding \u2014 Impact procs have 35% chance to add a Slash proc (x2 when fire rate < 2.5)"),
  ]),
  lie_in_wait: mod("lie_in_wait", [
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Lie In Wait \u2014 +20% Fire Rate when Crouching"),
    line("recoil", "mod_panel", "multiplicative_percent", "Lie In Wait: recoil \u2014 +20% Fire Rate when Crouching, +100% Weapon Recoil (arsenal display only)"),
  ]),
  loose_hatch: mod("loose_hatch", [
    line("recoil", "mod_panel", "multiplicative_percent", "Loose Hatch: recoil \u2014 +30% Reload Speed, +50% Weapon Recoil (arsenal display only)"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Loose Hatch: reloadSpeed \u2014 +30% Reload Speed, +50% Weapon Recoil"),
  ]),
  lucky_shot: mod("lucky_shot", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Lucky Shot: accuracy \u2014 +40% Projectile Speed, -2% Accuracy (arsenal display only)"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Lucky Shot: projectileSpeed \u2014 +40% Projectile Speed, -2% Accuracy"),
  ]),
  magazine_warp_r3: mod("magazine_warp_r3", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Magazine Warp: magazine \u2014 +30% Magazine Capacity"),
  ]),
  magnetic_capacity: mod("magnetic_capacity", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Magnetic Capacity: magazine \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Magazine Capacity"),
    line("magnetic", "weapon_dps", "elemental_from_base_damage", "Magnetic Capacity: magnetic \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Magazine Capacity"),
  ]),
  malignant_force_r3: mod("malignant_force_r3", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Malignant Force: statusChance \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Malignant Force: toxin \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
  ]),
  maximum_capacity: mod("maximum_capacity", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Maximum Capacity: magazine \u2014 +30% Magazine Capacity, -15% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Maximum Capacity: reloadSpeed \u2014 +30% Magazine Capacity, -15% Reload Speed"),
  ]),
  measured_burst: mod("measured_burst", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Measured Burst — When Aiming: +30% Damage"),
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Measured Burst — When Aiming: −60% Fire Rate"),
  ]),
  mending_shot: mod("mending_shot", [
    line("energyOrbBonus", "mod_panel", "multiplicative_percent", "Mending Shot: energyOrbBonus \u2014 Shoot Health Orbs to obtain them with +110% extra effect."),
  ]),
  metal_auger_r3: mod("metal_auger_r3", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "Metal Auger: punchThrough \u2014 +2.1 Punch Through (arsenal display only)"),
  ]),
  metamorphic_magazine: mod("metamorphic_magazine", [
    line("ammoMaximum", "mod_panel", "multiplicative_percent", "Metamorphic Magazine: ammoMaximum \u2014 +90% Magazine Capacity, +90% Ammo Maximum, Inflicting 20 cumulative attacks on a\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Metamorphic Magazine: duration \u2014 +90% Magazine Capacity, +90% Ammo Maximum, Inflicting 20 cumulative attacks on a\u2026"),
    line("magazine", "weapon_dps", "multiplicative_percent", "Metamorphic Magazine: magazine \u2014 +90% Magazine Capacity, +90% Ammo Maximum, Inflicting 20 cumulative attacks on a\u2026"),
  ]),
  motus_setup: mod("motus_setup", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Motus Setup — post jump-land gated"),
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Motus Setup — +100% CC for 4s after Double/Bullet Jump land"),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Motus Setup — +100% SC for 4s after Double/Bullet Jump land"),
  ]),
  necrophagic_vigor: mod("necrophagic_vigor", [
    line("health", "weapon_dps", "conditional_stat_on_trigger", "wiki: Necrophagic Vigor — +20% CC & CD per 20 HP drained on reload, cap +360% (sim assumes cap)"),
  ]),
  overview: mod("overview", [
    line("zoom", "mod_panel", "multiplicative_percent", "Overview: zoom \u2014 -60% Zoom while Aim Gliding (arsenal display only)"),
  ]),
  piercing_hit: mod("piercing_hit", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Piercing Hit: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  plan_b: mod("plan_b", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Plan B — on-hit secondary fire rate"),
    line("fireRate", "mod_panel", "multiplicative_percent", "wiki: Plan B — on-hit secondary fire rate"),
  ]),
  point_strike_r3: mod("point_strike_r3", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Point Strike: criticalChance \u2014 +150% Critical Chance"),
  ]),
  precision_munition: mod("precision_munition", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Precision Munition: accuracy \u2014 +100% Accuracy, +50% Projectile Speed (arsenal display only)"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Precision Munition: projectileSpeed \u2014 +100% Accuracy, +50% Projectile Speed"),
  ]),
  precision_strike: mod("precision_strike", [
    line("duration", "mod_panel", "multiplicative_percent", "Precision Strike: duration \u2014 Hitting an enemy directly with the grenade increases Reload Speed by 150% for 5s\u2026"),
  ]),
  primary_acuity: mod("primary_acuity", [
    line("weakPointDamage", "weapon_dps", "multiplicative_percent", "wiki: Primary Acuity \u2014 +350% Weak Point Damage (headshot-gated)"),
    line("criticalChanceOnHeadshot", "weapon_dps", "conditional_crit_on_headshot", "wiki: Primary Acuity \u2014 +350% Weak Point Critical Chance"),
  ]),
  primed_bane_of_corpus: mod("primed_bane_of_corpus", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Primed Bane Of Corpus: factionCorpus \u2014 x1.55 Damage to Corpus"),
  ]),
  primed_bane_of_grineer: mod("primed_bane_of_grineer", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Primed Bane Of Grineer: factionGrineer \u2014 x1.55 Damage to Grineer"),
  ]),
  primed_bane_of_infested: mod("primed_bane_of_infested", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Primed Bane Of Infested: factionInfested \u2014 x1.55 Damage to Infested"),
  ]),
  primed_bane_of_orokin: mod("primed_bane_of_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Primed Bane Of Orokin: factionOrokin \u2014 x1.55 Damage to Orokin"),
  ]),
  primed_bane_of_the_murmur: mod("primed_bane_of_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Primed Bane Of The Murmur: factionMurmur \u2014 x1.55 Damage to Murmur"),
  ]),
  primed_chamber: mod("primed_chamber", [
    line("damageFirstShot", "weapon_dps", "first_shot_damage", "wiki: Primed Chamber \u2014 +100% Damage on first shot in Magazine (averaged over mag for DPS)"),
  ]),
  primed_charged_chamber: mod("primed_charged_chamber", [
    line("damageFirstShot", "weapon_dps", "first_shot_damage", "wiki: Primed Charged Chamber \u2014 +110% Damage on first shot in Magazine (averaged over mag for DPS)"),
  ]),
  primed_firestorm: mod("primed_firestorm", [
    line("blastRange", "mod_panel", "multiplicative_percent", "Primed Firestorm: blastRange \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+44% Blast Range"),
    line("range", "mod_panel", "multiplicative_percent", "Primed Firestorm: range \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+44% Blast Range (arsenal display only)"),
  ]),
  primed_magazine_warp: mod("primed_magazine_warp", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Primed Magazine Warp: magazine \u2014 +55% Magazine Capacity"),
  ]),
  primed_rifle_ammo_mutation: mod("primed_rifle_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Primed Rifle Ammo Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 92% of Ammo Pick Up."),
  ]),
  primed_shred: mod("primed_shred", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Primed Shred: fireRate \u2014 +55% Fire Rate (x2 for Bows), +2.2 Punch Through"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Primed Shred: punchThrough \u2014 +55% Fire Rate (x2 for Bows), +2.2 Punch Through (arsenal display only)"),
  ]),
  primed_sniper_ammo_mutation: mod("primed_sniper_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Primed Sniper Ammo Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 92% of Ammo Pick Up."),
  ]),
  primed_stabilizer: mod("primed_stabilizer", [
    line("recoil", "mod_panel", "multiplicative_percent", "Primed Stabilizer: recoil \u2014 -85% Weapon Recoil (arsenal display only)"),
  ]),
  proton_jet: mod("proton_jet", [
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Proton Jet \u2014 During a Wall Latch gain +120% Status Chance and Critical Chance."),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Proton Jet \u2014 During a Wall Latch gain +120% Status Chance and Critical Chance."),
  ]),
  radiated_reload: mod("radiated_reload", [
    line("radiation", "weapon_dps", "elemental_from_base_damage", "Radiated Reload: radiation \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Radiated Reload: reloadSpeed \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Reload Speed"),
  ]),
  recover: mod("recover", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Recover — on-kill heal rate"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Recover — on-kill heal (not max health)"),
  ]),
  rifle_ammo_mutation: mod("rifle_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Rifle Ammo Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 50% of Ammo Pick Up."),
  ]),
  rifle_aptitude_r3: mod("rifle_aptitude_r3", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Rifle Aptitude: statusChance \u2014 +90% Status Chance"),
  ]),
  rifle_elementalist: mod("rifle_elementalist", [
    line("statusDamage", "weapon_dps", "multiplicative_percent", "wiki: Rifle Elementalist \u2014 +90% Status Damage"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "wiki: Rifle Elementalist \u2014 +0.6 Punch Through (arsenal display only)"),
  ]),
  rime_rounds_r3: mod("rime_rounds_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Rime Rounds: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Rime Rounds: statusChance \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
  ]),
  ripper_rounds: mod("ripper_rounds", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Ripper Rounds — IPS convert (not always-on damage)"),
  ]),
  rupture: mod("rupture", [
    line("impact", "weapon_dps", "multiplicative_percent", "Rupture: impact \u2014 +90% <DT_IMPACT_COLOR>Impact"),
  ]),
  sawtooth_clip: mod("sawtooth_clip", [
    line("slash", "weapon_dps", "multiplicative_percent", "Sawtooth Clip: slash \u2014 +90% <DT_SLASH_COLOR>Slash"),
  ]),
  semi_rifle_cannonade: mod("semi_rifle_cannonade", [
    line("damage", "weapon_dps", "multiplicative_percent", "Semi-Rifle Cannonade: damage \u2014 Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\\\n+240% Da\u2026"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Semi-Rifle Cannonade: punchThrough \u2014 Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\\\n+240% Da\u2026 (arsenal display only)"),
  ]),
  sentient_barrage: mod("sentient_barrage", [
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Sentient Barrage — +300% CC on next full-charge Alt-Fire discharge"),
    line("criticalMultiplier", "weapon_dps", "conditional_stat_on_trigger", "wiki: Sentient Barrage — +300% CD on next full-charge Alt-Fire discharge"),
  ]),
  serrated_rounds: mod("serrated_rounds", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Serrated Rounds — IPS convert (not always-on damage)"),
  ]),
  serration_r3: mod("serration_r3", [
    line("damage", "weapon_dps", "multiplicative_percent", "Serration: damage \u2014 +165% Damage"),
  ]),
  sharpshooter: mod("sharpshooter", [
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Sharpshooter: energyOnKill \u2014 On Headshot Kill:\\\\n+15 Energy"),
  ]),
  shivering_contagion: mod("shivering_contagion", [
    line("range", "mod_panel", "multiplicative_percent", "Shivering Contagion: range \u2014 On <DT_FREEZE_COLOR>Cold Status Effect: 100% chance to spread that status to oth\u2026 (arsenal display only)"),
  ]),
  sinister_reach: mod("sinister_reach", [
    line("range", "mod_panel", "multiplicative_percent", "Sinister Reach: range \u2014 +12m Beam Range (arsenal display only)"),
  ]),
  sniper_ammo_mutation: mod("sniper_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Sniper Ammo Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 50% of Ammo Pick Up."),
  ]),
  soaring_strike: mod("soaring_strike", [
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Soaring Strike — +50% Fire Rate when Airborne"),
  ]),
  spectral_serration: mod("spectral_serration", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Spectral Serration — +330% Damage while Invisible"),
  ]),
  speed_trigger_r3: mod("speed_trigger_r3", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Speed Trigger: fireRate \u2014 +60% Fire Rate (x2 for Bows)"),
  ]),
  split_chamber_r3: mod("split_chamber_r3", [
    line("multishot", "weapon_dps", "multiplicative_percent", "Split Chamber: multishot \u2014 +90% Multishot"),
  ]),
  split_flights: mod("split_flights", [
    line("accuracy", "mod_panel", "multiplicative_percent", "wiki: Split Flights — on-hit accuracy penalty"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Split Flights — stack duration"),
    line("multishot", "weapon_dps", "conditional_stat_per_kill_stack", "wiki: Split Flights — On Hit: +100% Multishot/stack (cap 4; sim uses killStacks)"),
  ]),
  spontaneous_singularity: mod("spontaneous_singularity", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Spontaneous Singularity — orb-explode bonus (not always-on damage)"),
  ]),
  spring_loaded_chamber: mod("spring_loaded_chamber", [
    line("duration", "mod_panel", "multiplicative_percent", "Spring-Loaded Chamber: duration \u2014 On Reload:\\\\n+75% Fire Rate when Aiming for 9s"),
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Spring-Loaded Chamber \u2014 On Reload: +75% Fire Rate when Aiming for 9s"),
  ]),
  stabilizer: mod("stabilizer", [
    line("recoil", "mod_panel", "multiplicative_percent", "Stabilizer: recoil \u2014 -60% Weapon Recoil (arsenal display only)"),
  ]),
  stormbringer_r3: mod("stormbringer_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Stormbringer: electricity \u2014 +90% <DT_ELECTRICITY_COLOR>Electricity"),
  ]),
  sudden_justice: mod("sudden_justice", [
    line("duration", "mod_panel", "multiplicative_percent", "Sudden Justice: duration \u2014 On 2 Hits within 0.2s:\\\\n+30% Fire Rate for 2s"),
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Sudden Justice — On 2 Hits within 0.2s: +30% Fire Rate for 2s"),
  ]),
  tactical_reload_r3: mod("tactical_reload_r3", [
    line("holsterRate", "mod_panel", "multiplicative_percent", "Tactical Reload: holsterRate \u2014 +20% Magazine Reloaded/s when Holstered (arsenal display only)"),
  ]),
  tainted_mag: mod("tainted_mag", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Tainted Mag: magazine \u2014 +66% Magazine Capacity, -33% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Tainted Mag: reloadSpeed \u2014 +66% Magazine Capacity, -33% Reload Speed"),
  ]),
  target_acquired: mod("target_acquired", [
    line("headshotMultiplier", "mod_panel", "multiplicative_percent", "Target Acquired: headshotMultiplier \u2014 +60% to Headshot Multiplier"),
  ]),
  terminal_velocity: mod("terminal_velocity", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Terminal Velocity: projectileSpeed \u2014 +60% Projectile Speed"),
  ]),
  thunderbolt: mod("thunderbolt", [
    line("explosionChance", "mod_panel", "multiplicative_percent", "Thunderbolt: explosionChance \u2014 +45% Chance to Explode (Use with Caution)"),
  ]),
  thundermiter: mod("thundermiter", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Thundermiter: magazine \u2014 +100% chance charged Projectiles explode, -60% Magazine Capacity"),
  ]),
  triple_tap: mod("triple_tap", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Triple Tap — On 2 Hits within 0.02s: +40% Damage for 0.2s"),
    line("duration", "mod_panel", "multiplicative_percent", "Triple Tap: duration \u2014 On 2 Hits within 0.02s:\\\\n+40% Damage for 0.2s"),
  ]),
  twitch: mod("twitch", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Twitch: accuracy \u2014 On Equip: \\\\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s (arsenal display only)"),
    line("duration", "mod_panel", "multiplicative_percent", "Twitch: duration \u2014 On Equip: \\\\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s"),
  ]),
  unseen_dread: mod("unseen_dread", [
    line("criticalMultiplier", "weapon_dps", "conditional_stat_on_trigger", "wiki: Unseen Dread — +175% Critical Damage while invisible after multi-hit"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Unseen Dread — multi-hit invis duration"),
  ]),
  vanquished_prey: mod("vanquished_prey", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Vanquished Prey — on-kill shield recharge"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Vanquished Prey — on-kill health orb effect"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Vanquished Prey — on-kill shield recharge"),
  ]),
  vile_precision: mod("vile_precision", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Vile Precision: fireRate \u2014 -90% Weapon Recoil, -36% Fire Rate (x2 for Bows)"),
    line("recoil", "mod_panel", "multiplicative_percent", "Vile Precision: recoil \u2014 -90% Weapon Recoil, -36% Fire Rate (x2 for Bows) (arsenal display only)"),
  ]),
  vital_sense_r3: mod("vital_sense_r3", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Vital Sense: criticalMultiplier \u2014 +120% Critical Damage"),
  ]),
  volatile_variant: mod("volatile_variant", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "wiki: Volatile Variant — barb explode / PT behavior"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Volatile Variant — barb explode range display"),
    line("statusChance", "mod_panel", "multiplicative_percent", "wiki: Volatile Variant — barb explode SC (not always-on paper)"),
  ]),
};
