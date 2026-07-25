/**
 * Per-mod verified behaviors — category: secondary (105 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py secondary
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_SECONDARY: Record<string, VerifiedModBehavior> = {
  accelerated_isotope: mod("accelerated_isotope", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Accelerated Isotope: fireRate \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Fire Rate"),
    line("radiation", "weapon_dps", "elemental_from_base_damage", "Accelerated Isotope: radiation \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Fire Rate"),
  ]),
  air_recon: mod("air_recon", [
    line("zoom", "mod_panel", "multiplicative_percent", "Air Recon: zoom \u2014 -60% Zoom while Aim Gliding (arsenal display only)"),
  ]),
  amalgam_barrel_diffusion: mod("amalgam_barrel_diffusion", [
    line("multishot", "weapon_dps", "multiplicative_percent", "Amalgam Barrel Diffusion: multishot \u2014 +110% Multishot, +60% Dodge Speed"),
  ]),
  barrel_diffusion_r3: mod("barrel_diffusion_r3", [
    line("multishot", "weapon_dps", "multiplicative_percent", "Barrel Diffusion: multishot \u2014 +120% Multishot"),
  ]),
  blind_shot: mod("blind_shot", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Blind Shot: accuracy \u2014 +40% Projectile Speed, -4% Accuracy (arsenal display only)"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Blind Shot: projectileSpeed \u2014 +40% Projectile Speed, -4% Accuracy"),
  ]),
  bore: mod("bore", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Bore: puncture \u2014 +120% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  calculated_victory: mod("calculated_victory", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Calculated Victory — on-kill shield recharge"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Calculated Victory — on-kill health orb effect"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Calculated Victory — on-kill shield recharge"),
  ]),
  cannonade: mod("cannonade", [
    line("explosionChance", "mod_panel", "multiplicative_percent", "Cannonade: explosionChance \u2014 +30% Chance to Explode (Use with Caution)"),
  ]),
  carnis_stinger: mod("carnis_stinger", [
    line("slash", "weapon_dps", "multiplicative_percent", "Carnis Stinger: slash \u2014 +90% <DT_SLASH_COLOR>Slash, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Carnis Stinger: statusChance \u2014 +90% <DT_SLASH_COLOR>Slash, +60% Status Chance"),
  ]),
  concealed_explosives: mod("concealed_explosives", [
    line("explosionChance", "mod_panel", "multiplicative_percent", "Concealed Explosives: explosionChance \u2014 +80% Chance to Explode (Use with Caution)"),
  ]),
  concussion_rounds: mod("concussion_rounds", [
    line("impact", "weapon_dps", "multiplicative_percent", "Concussion Rounds: impact \u2014 +90% <DT_IMPACT_COLOR>Impact"),
  ]),
  convulsion_r3: mod("convulsion_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Convulsion: electricity \u2014 +90% <DT_ELECTRICITY_COLOR>Electricity"),
  ]),
  critical_mutation: mod("critical_mutation", [
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Critical Mutation — +30% CC/kill up to +300% (criticalMutationStacks; grenade <3 hits −1 stack)"),
    line("criticalMultiplier", "weapon_dps", "conditional_stat_on_trigger", "wiki: Critical Mutation — +30% CD/kill up to +300% (criticalMutationStacks; grenade <3 hits −1 stack)"),
  ]),
  damzav_vati: mod("damzav_vati", [
    line("viral", "weapon_dps", "elemental_from_base_damage", "Damzav-Vati: viral \u2014 +240% <DT_VIRAL_COLOR>Viral"),
  ]),
  deadly_maneuvers: mod("deadly_maneuvers", [
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Deadly Maneuvers — On Dodge: +400% Headshot Critical Chance for next 2 shots"),
  ]),
  deep_freeze_r3: mod("deep_freeze_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Deep Freeze: cold \u2014 +90% <DT_FREEZE_COLOR>Cold"),
  ]),
  dizzying_rounds: mod("dizzying_rounds", [
    line("range", "mod_panel", "multiplicative_percent", "Dizzying Rounds: range \u2014 Shots from less than 8m stun enemies and open them to finishers.\\\\n+200% Status \u2026 (arsenal display only)"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Dizzying Rounds: statusChance \u2014 Shots from less than 8m stun enemies and open them to finishers.\\\\n+200% Status \u2026"),
  ]),
  draining_gloom: mod("draining_gloom", [
    line("ammoMaximum", "mod_panel", "multiplicative_percent", "Draining Gloom: ammoMaximum \u2014 +100% chance of Energy Drain explosion, -60% Magazine Capacity, -60% Ammo Maximu\u2026"),
    line("energy", "mod_panel", "multiplicative_percent", "wiki: Draining Gloom — energy drain explosion (not max energy)"),
    line("magazine", "weapon_dps", "multiplicative_percent", "Draining Gloom: magazine \u2014 +100% chance of Energy Drain explosion, -60% Magazine Capacity, -60% Ammo Maximu\u2026"),
  ]),
  eject_magazine: mod("eject_magazine", [
    line("magazine", "mod_panel", "multiplicative_percent", "wiki: Eject Magazine — holster reload/s (not mag capacity)"),
  ]),
  energizing_shot: mod("energizing_shot", [
    line("energyOrbBonus", "mod_panel", "multiplicative_percent", "Energizing Shot: energyOrbBonus \u2014 Shoot Energy Orbs to obtain them with +110% extra effect."),
  ]),
  expel_corpus_r3: mod("expel_corpus_r3", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Expel Corpus: factionCorpus \u2014 x1.3 Damage to Corpus"),
  ]),
  expel_grineer_r3: mod("expel_grineer_r3", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Expel Grineer: factionGrineer \u2014 x1.3 Damage to Grineer"),
  ]),
  expel_infested_r3: mod("expel_infested_r3", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Expel Infested: factionInfested \u2014 x1.3 Damage to Infested"),
  ]),
  expel_orokin: mod("expel_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Expel Orokin: factionOrokin \u2014 x1.3 Damage to Orokin"),
  ]),
  expel_the_murmur: mod("expel_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Expel The Murmur: factionMurmur \u2014 x1.3 Damage to Murmur"),
  ]),
  eximus_advantage: mod("eximus_advantage", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Eximus Advantage — Eximus headshot: +600% Secondary Damage for 10s"),
  ]),
  fass_canticle: mod("fass_canticle", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Fass Canticle — kill-gated ally buff"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Fass Canticle — kill-gated ally shield recharge"),
  ]),
  frostbite_r3: mod("frostbite_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Frostbite: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Frostbite: statusChance \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
  ]),
  full_capacity: mod("full_capacity", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Full Capacity: magazine \u2014 +30% Magazine Capacity, -15% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Full Capacity: reloadSpeed \u2014 +30% Magazine Capacity, -15% Reload Speed"),
  ]),
  fulmination: mod("fulmination", [
    line("blastRange", "mod_panel", "multiplicative_percent", "Fulmination: blastRange \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+24% Blast Range"),
    line("range", "mod_panel", "multiplicative_percent", "Fulmination: range \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+24% Blast Range (arsenal display only)"),
  ]),
  galvanized_diffusion: mod("galvanized_diffusion", [
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Diffusion: duration \u2014 +110% Multishot, On Kill:\\\\n+30% Multishot for 20s. Stacks up to 4x."),
    line("multishot", "weapon_dps", "multiplicative_percent", "Galvanized Diffusion: multishot \u2014 +110% Multishot, On Kill:\\\\n+30% Multishot for 20s. Stacks up to 4x."),
    line("multishotOnKill", "weapon_dps", "conditional_multishot_on_kill", "Galvanized Diffusion: multishotOnKill \u2014 +110% Multishot, On Kill:\\\\n+30% Multishot for 20s. Stacks up to 4x."),
  ]),
  gunslinger_r3: mod("gunslinger_r3", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Gunslinger: fireRate \u2014 +72% Fire Rate"),
  ]),
  hawk_eye: mod("hawk_eye", [
    line("zoom", "mod_panel", "multiplicative_percent", "Hawk Eye: zoom \u2014 +80% Zoom (arsenal display only)"),
  ]),
  heated_charge_r3: mod("heated_charge_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Heated Charge: heat \u2014 +90% <DT_FIRE_COLOR>Heat"),
  ]),
  heavy_warhead: mod("heavy_warhead", [
    line("blast", "mod_panel", "multiplicative_percent", "wiki: Heavy Warhead — blast radius (not blast damage element)"),
    line("blastRange", "mod_panel", "multiplicative_percent", "Heavy Warhead: blastRange \u2014 +100% Blast Radius, -50% Projectile Speed"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Heavy Warhead: projectileSpeed \u2014 +100% Blast Radius, -50% Projectile Speed"),
  ]),
  hemorrhage: mod("hemorrhage", [
    line("slashOnImpactProc", "weapon_dps", "slash_on_impact_proc", "wiki: Hemorrhage \u2014 Impact procs have 35% chance to add a Slash proc (x2 when fire rate < 2.5)"),
  ]),
  hollow_point: mod("hollow_point", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Hollow Point: criticalMultiplier \u2014 +60% Critical Damage, -15% Damage"),
    line("damage", "weapon_dps", "multiplicative_percent", "Hollow Point: damage \u2014 +60% Critical Damage, -15% Damage"),
  ]),
  hornet_strike_r3: mod("hornet_strike_r3", [
    line("damage", "weapon_dps", "multiplicative_percent", "Hornet Strike: damage \u2014 +220% Damage"),
  ]),
  hydraulic_barrel: mod("hydraulic_barrel", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Hydraulic Barrel: magazine \u2014 -40% Weapon Recoil, -20% Magazine Capacity"),
    line("recoil", "mod_panel", "multiplicative_percent", "Hydraulic Barrel: recoil \u2014 -40% Weapon Recoil, -20% Magazine Capacity (arsenal display only)"),
  ]),
  impaler_munitions: mod("impaler_munitions", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Impaler Munitions — IPS convert (not always-on damage)"),
  ]),
  jahu_canticle: mod("jahu_canticle", [
    line("armorDebuffOnKill", "mod_panel", "multiplicative_percent", "Jahu Canticle: armorDebuffOnKill \u2014 Killing enemies reduces the Armor and Shields of other enemies within Affinity R\u2026"),
    line("shieldDebuffOnKill", "mod_panel", "multiplicative_percent", "Jahu Canticle: shieldDebuffOnKill \u2014 Killing enemies reduces the Armor and Shields of other enemies within Affinity R\u2026"),
  ]),
  jolt_r3: mod("jolt_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Jolt: electricity \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Jolt: statusChance \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
  ]),
  jugulus_spines: mod("jugulus_spines", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Jugulus Spines: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Jugulus Spines: statusChance \u2014 +90% <DT_PUNCTURE_COLOR>Puncture, +60% Status Chance"),
  ]),
  khra_canticle: mod("khra_canticle", [
    line("universalOrbChance", "mod_panel", "multiplicative_percent", "Khra Canticle: universalOrbChance \u2014 Enemies have a 12% chance to drop a Universal Orb on death."),
  ]),
  leaded_gas: mod("leaded_gas", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Leaded Gas — weak-point-hit gated"),
    line("gas", "weapon_dps", "conditional_stat_on_trigger", "wiki: Leaded Gas — On Weak Point Hit: +300% Gas for 6s"),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Leaded Gas — On Weak Point Hit: +300% Status Chance for 6s"),
  ]),
  lethal_momentum: mod("lethal_momentum", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Lethal Momentum: projectileSpeed \u2014 +40% Projectile Speed"),
  ]),
  lohk_canticle: mod("lohk_canticle", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Lohk Canticle — kill-gated ally fire rate"),
    line("fireRate", "weapon_dps", "conditional_stat_on_kill", "wiki: Lohk Canticle — On Kill: Allies +30% Fire Rate for 15s (sim: self uptime)"),
  ]),
  loose_magazine: mod("loose_magazine", [
    line("recoil", "mod_panel", "multiplicative_percent", "Loose Magazine: recoil \u2014 +50% Reload Speed, +50% Weapon Recoil (arsenal display only)"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Loose Magazine: reloadSpeed \u2014 +50% Reload Speed, +50% Weapon Recoil"),
  ]),
  magnetic_might: mod("magnetic_might", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Magnetic Might: criticalMultiplier \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Critical Damage"),
    line("magnetic", "weapon_dps", "elemental_from_base_damage", "Magnetic Might: magnetic \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Critical Damage"),
  ]),
  maim: mod("maim", [
    line("slash", "weapon_dps", "multiplicative_percent", "Maim: slash \u2014 +120% <DT_SLASH_COLOR>Slash"),
  ]),
  merciless_gunfight: mod("merciless_gunfight", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Merciless Gunfight: criticalMultiplier \u2014 +45% Critical Damage, +1.2 Punch Through"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Merciless Gunfight: punchThrough \u2014 +45% Critical Damage, +1.2 Punch Through (arsenal display only)"),
  ]),
  meteor_munitions: mod("meteor_munitions", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Meteor Munitions — IPS convert (not always-on damage)"),
  ]),
  netra_invocation: mod("netra_invocation", [
    line("duration", "mod_panel", "multiplicative_percent", "Netra Invocation: duration \u2014 Alternate Fire increases Ability Efficiency by 4% for 20s for each enemy hit. St\u2026"),
  ]),
  night_stalker: mod("night_stalker", [
    line("duration", "mod_panel", "multiplicative_percent", "Night Stalker: duration \u2014 On Hit:\\\\nReveals target on Minimap for +6s."),
  ]),
  no_return: mod("no_return", [
    line("puncture", "weapon_dps", "multiplicative_percent", "No Return: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  pain_points: mod("pain_points", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Pain Points — +60% WP dmg/stack up to +600% (catalog damage→weakPointDamage; sim assumes max)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Pain Points — stack duration"),
  ]),
  pathogen_rounds_r3: mod("pathogen_rounds_r3", [
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Pathogen Rounds: toxin \u2014 +90% <DT_POISON_COLOR>Toxin"),
  ]),
  perpetual_agony: mod("perpetual_agony", [
    line("statusDuration", "weapon_dps", "multiplicative_percent", "Perpetual Agony: statusDuration \u2014 +90% Status Duration (extends DoT ticks)"),
  ]),
  pistol_acuity: mod("pistol_acuity", [
    line("weakPointDamage", "weapon_dps", "multiplicative_percent", "wiki: Pistol Acuity \u2014 +350% Weak Point Damage (headshot-gated)"),
    line("criticalChanceOnHeadshot", "weapon_dps", "conditional_crit_on_headshot", "wiki: Pistol Acuity \u2014 +350% Weak Point Critical Chance"),
  ]),
  pistol_elementalist: mod("pistol_elementalist", [
    line("statusDamage", "weapon_dps", "multiplicative_percent", "wiki: Pistol Elementalist \u2014 +90% Status Damage"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "wiki: Pistol Elementalist \u2014 +60% Reload Speed"),
  ]),
  pistol_gambit_r3: mod("pistol_gambit_r3", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Pistol Gambit: criticalChance \u2014 +120% Critical Chance"),
  ]),
  pistol_pestilence_r3: mod("pistol_pestilence_r3", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Pistol Pestilence: statusChance \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Pistol Pestilence: toxin \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
  ]),
  pressurized_magazine: mod("pressurized_magazine", [
    line("duration", "mod_panel", "multiplicative_percent", "Pressurized Magazine: duration \u2014 On Reload:\\\\n+90% Fire Rate when Aiming for 9s"),
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Pressurized Magazine \u2014 On Reload: +90% Fire Rate when Aiming for 9s"),
  ]),
  primed_expel_corpus: mod("primed_expel_corpus", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Primed Expel Corpus: factionCorpus \u2014 x1.55 Damage to Corpus"),
  ]),
  primed_expel_grineer: mod("primed_expel_grineer", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Primed Expel Grineer: factionGrineer \u2014 x1.55 Damage to Grineer"),
  ]),
  primed_expel_infested: mod("primed_expel_infested", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Primed Expel Infested: factionInfested \u2014 x1.55 Damage to Infested"),
  ]),
  primed_expel_orokin: mod("primed_expel_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Primed Expel Orokin: factionOrokin \u2014 x1.55 Damage to Orokin"),
  ]),
  primed_expel_the_murmur: mod("primed_expel_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Primed Expel The Murmur: factionMurmur \u2014 x1.55 Damage to Murmur"),
  ]),
  primed_fulmination: mod("primed_fulmination", [
    line("blastRange", "mod_panel", "multiplicative_percent", "Primed Fulmination: blastRange \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+44% Blast Range"),
    line("range", "mod_panel", "multiplicative_percent", "Primed Fulmination: range \u2014 Improves the Blast Radius of weapons with Radial Attacks.\\\\n+44% Blast Range (arsenal display only)"),
  ]),
  primed_pistol_ammo_mutation: mod("primed_pistol_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Primed Pistol Ammo Mutation: ammoConversion \u2014 Converts Primary ammo pickups to 92% of Ammo Pick Up."),
  ]),
  primed_slip_magazine: mod("primed_slip_magazine", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Primed Slip Magazine: magazine \u2014 +55% Magazine Capacity"),
  ]),
  primed_steady_hands: mod("primed_steady_hands", [
    line("recoil", "mod_panel", "multiplicative_percent", "Primed Steady Hands: recoil \u2014 -85% Weapon Recoil (arsenal display only)"),
  ]),
  pummel: mod("pummel", [
    line("impact", "weapon_dps", "multiplicative_percent", "Pummel: impact \u2014 +120% <DT_IMPACT_COLOR>Impact"),
  ]),
  quickdraw_r3: mod("quickdraw_r3", [
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Quickdraw: reloadSpeed \u2014 +48% Reload Speed"),
  ]),
  range_advantage: mod("range_advantage", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Range Advantage — +300% damage if no enemies within 10m"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Range Advantage — condition display"),
  ]),
  razor_munitions: mod("razor_munitions", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Razor Munitions — IPS convert (not always-on damage)"),
  ]),
  razor_shot: mod("razor_shot", [
    line("slash", "weapon_dps", "multiplicative_percent", "Razor Shot: slash \u2014 +90% <DT_SLASH_COLOR>Slash"),
  ]),
  recuperate: mod("recuperate", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Recuperate — on-kill heal rate"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Recuperate — on-kill heal (not max health)"),
  ]),
  reflex_draw: mod("reflex_draw", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Reflex Draw: accuracy \u2014 On Equip: \\\\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s (arsenal display only)"),
    line("duration", "mod_panel", "multiplicative_percent", "Reflex Draw: duration \u2014 On Equip: \\\\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s"),
  ]),
  ris_invocation: mod("ris_invocation", [
    line("duration", "mod_panel", "multiplicative_percent", "Ris Invocation: duration \u2014 Alternate Fire increases Ability Duration by 4% for 20s for each enemy hit. Stac\u2026"),
  ]),
  ruinous_extension: mod("ruinous_extension", [
    line("range", "mod_panel", "multiplicative_percent", "Ruinous Extension: range \u2014 +8m Beam Range (arsenal display only)"),
  ]),
  saxum_spittle: mod("saxum_spittle", [
    line("impact", "weapon_dps", "multiplicative_percent", "Saxum Spittle: impact \u2014 +90% <DT_IMPACT_COLOR>Impact, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Saxum Spittle: statusChance \u2014 +90% <DT_IMPACT_COLOR>Impact, +60% Status Chance"),
  ]),
  scorch_r3: mod("scorch_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Scorch: heat \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Scorch: statusChance \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
  ]),
  secondary_wind: mod("secondary_wind", [
    line("duration", "mod_panel", "multiplicative_percent", "Secondary Wind: duration \u2014 On Kill:\\\\n+50% Reload Speed for 4s"),
    line("reloadSpeed", "weapon_dps", "conditional_stat_on_kill", "wiki: Secondary Wind \u2014 On Kill: +50% Reload Speed for 4s"),
  ]),
  seeker_r3: mod("seeker_r3", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "Seeker: punchThrough \u2014 +2.1 Punch Through (arsenal display only)"),
  ]),
  semi_pistol_cannonade: mod("semi_pistol_cannonade", [
    line("damage", "weapon_dps", "multiplicative_percent", "Semi-Pistol Cannonade: damage \u2014 Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\\\n+300% Da\u2026"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Semi-Pistol Cannonade: punchThrough \u2014 Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\\\n+300% Da\u2026 (arsenal display only)"),
  ]),
  sentient_surge: mod("sentient_surge", [
    line("criticalChance", "weapon_dps", "conditional_stat_per_kill_stack", "wiki: Sentient Surge — +60% CC per tendril (cap 4; sim uses killStacks)"),
    line("statusChance", "weapon_dps", "conditional_stat_per_kill_stack", "wiki: Sentient Surge — +60% SC per tendril (cap 4; sim uses killStacks)"),
  ]),
  sharpened_bullets: mod("sharpened_bullets", [
    line("criticalMultiplier", "weapon_dps", "conditional_stat_on_kill", "wiki: Sharpened Bullets \u2014 On Kill: +75% Critical Damage when Aiming for 9s"),
    line("duration", "mod_panel", "multiplicative_percent", "Sharpened Bullets: duration \u2014 On Kill:\\\\n+75% Critical Damage when Aiming for 9s"),
  ]),
  shrapnel_rounds: mod("shrapnel_rounds", [
    line("damage", "weapon_dps", "multiplicative_percent", "Shrapnel Rounds: damage \u2014 +200% Multishot, -66% Damage"),
    line("multishot", "weapon_dps", "multiplicative_percent", "Shrapnel Rounds: multishot \u2014 +200% Multishot, -66% Damage"),
  ]),
  skull_shots: mod("skull_shots", [
    line("ammoEfficiency", "weapon_dps", "conditional_stat_on_trigger", "wiki: Skull Shots — On Headshot: +100% Ammo Efficiency for 2s"),
    line("duration", "mod_panel", "multiplicative_percent", "Skull Shots: duration \u2014 On Headshot:\\\\n+100% Ammo Efficiency for 2s"),
  ]),
  slip_magazine_r3: mod("slip_magazine_r3", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Slip Magazine: magazine \u2014 +30% Magazine Capacity"),
  ]),
  soaring_truth: mod("soaring_truth", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Soaring Truth: criticalChance \u2014 +200% Critical Chance, +1 'Purity'"),
  ]),
  spry_sights: mod("spry_sights", [
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Spry Sights — aiming-gated movement"),
  ]),
  static_alacrity: mod("static_alacrity", [
    line("blast", "mod_panel", "multiplicative_percent", "wiki: Static Alacrity — blast radius (not blast damage element)"),
    line("blastRange", "mod_panel", "multiplicative_percent", "Static Alacrity: blastRange \u2014 +50% Projectile Speed, -50% Blast Radius"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Static Alacrity: projectileSpeed \u2014 +50% Projectile Speed, -50% Blast Radius"),
  ]),
  steady_hands: mod("steady_hands", [
    line("recoil", "mod_panel", "multiplicative_percent", "Steady Hands: recoil \u2014 -60% Weapon Recoil (arsenal display only)"),
  ]),
  strafing_slide: mod("strafing_slide", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Strafing Slide: accuracy \u2014 -20% Weapon Recoil, and +20% Accuracy when Sliding (arsenal display only)"),
    line("recoil", "mod_panel", "multiplicative_percent", "Strafing Slide: recoil \u2014 -20% Weapon Recoil, and +20% Accuracy when Sliding (arsenal display only)"),
  ]),
  stunning_speed: mod("stunning_speed", [
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Stunning Speed: reloadSpeed \u2014 +40% Reload Speed, +30% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Stunning Speed: statusChance \u2014 +40% Reload Speed, +30% Status Chance"),
  ]),
  suppress_r3: mod("suppress_r3", [
    line("noiseReduction", "mod_panel", "multiplicative_percent", "Suppress: noiseReduction \u2014 Reduces the chance an enemy will hear gunfire by 100%."),
  ]),
  sure_shot: mod("sure_shot", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Sure Shot: statusChance \u2014 +90% Status Chance"),
  ]),
  synth_charge_r3: mod("synth_charge_r3", [
    line("magazine", "mod_panel", "multiplicative_percent", "wiki: Synth Charge — final-shot bonus damage (not mag capacity)"),
  ]),
  tainted_clip: mod("tainted_clip", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Tainted Clip: magazine \u2014 +60% Magazine Capacity, -30% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Tainted Clip: reloadSpeed \u2014 +60% Magazine Capacity, -30% Reload Speed"),
  ]),
  target_cracker_r3: mod("target_cracker_r3", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Target Cracker: criticalMultiplier \u2014 +60% Critical Damage"),
  ]),
  targeting_subsystem: mod("targeting_subsystem", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Targeting Subsystem: accuracy \u2014 On Hit:\\\\n+30% Accuracy when Aiming for 9s (arsenal display only)"),
    line("duration", "mod_panel", "multiplicative_percent", "Targeting Subsystem: duration \u2014 On Hit:\\\\n+30% Accuracy when Aiming for 9s"),
  ]),
  trick_mag_r3: mod("trick_mag_r3", [
    line("ammoMaximum", "mod_panel", "multiplicative_percent", "Trick Mag: ammoMaximum \u2014 +90% Ammo Maximum"),
  ]),
  vile_discharge: mod("vile_discharge", [
    line("storedDamage", "mod_panel", "multiplicative_percent", "Vile Discharge: storedDamage \u2014 Damage is accumulated up to 30,000. Use Alt-fire to launch an explosive vile sac\u2026"),
  ]),
  vome_invocation: mod("vome_invocation", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "wiki: Vome Invocation — alt-fire hit stacks (not always-on strength)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Vome Invocation — stack duration"),
  ]),
  xata_invocation: mod("xata_invocation", [
    line("duration", "mod_panel", "multiplicative_percent", "Xata Invocation: duration \u2014 Alternate Fire grants 1 Energy Regen/s for 20s for each enemy hit. Stacks up to \u2026"),
    line("energyOnCast", "mod_panel", "multiplicative_percent", "Xata Invocation: energyOnCast \u2014 Alternate Fire grants 1 Energy Regen/s for 20s for each enemy hit. Stacks up to \u2026"),
  ]),
  zazvat_kar: mod("zazvat_kar", [
    line("ammoEfficiency", "weapon_dps", "conditional_stat_on_trigger", "wiki: Zazvat-Kar — +75% Ammo Efficiency while Airborne"),
  ]),
};
