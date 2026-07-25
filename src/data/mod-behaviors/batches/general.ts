/**
 * Per-mod verified behaviors — category: general (294 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py general
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_GENERAL: Record<string, VerifiedModBehavior> = {
  accelerated_blast_r3: mod("accelerated_blast_r3", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Accelerated Blast: fireRate \u2014 +60% Fire Rate, +60% <DT_PUNCTURE_COLOR>Puncture"),
    line("puncture", "weapon_dps", "multiplicative_percent", "Accelerated Blast: puncture \u2014 +60% Fire Rate, +60% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  affinity_spike: mod("affinity_spike", [], "wiki: Affinity Spike \u2014 Kills from Melee Attacks grant 45% more Melee Affinity."),
  amalgam_shotgun_barrage: mod("amalgam_shotgun_barrage", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Amalgam Shotgun Barrage: fireRate \u2014 +85% Fire Rate, +45% Revive Speed"),
  ]),
  amarsetmod: mod("amarsetmod", [], "wiki: Amarsetmod \u2014 catalog entry (stats in ability logic)"),
  ammo_stock_r3: mod("ammo_stock_r3", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Ammo Stock: magazine \u2014 +60% Magazine Capacity"),
  ]),
  anti_v: mod("anti_v", [], "wiki: Anti-V \u2014 Digital extremists stand no chance when you have Anti-V on your side"),
  artillery_cheap_shot: mod("artillery_cheap_shot", [], "wiki: Artillery Cheap Shot \u2014 Forward Artillery has a +90% chance to not consume Dome Charges"),
  ashensetmod: mod("ashensetmod", [], "wiki: Ashensetmod \u2014 catalog entry (stats in ability logic)"),
  assassin_posture: mod("assassin_posture", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Assassin Posture — overguard damage / priority (not base DPS)"),
  ]),
  argent_scourge: mod("argent_scourge", [], "wiki: Argent Scourge \u2014 Fighting form devised for Conclave."),
  atlantis_vulcan: mod("atlantis_vulcan", [], "wiki: Atlantis Vulcan \u2014 Rapid strikes, deceptive movements."),
  atomic_fallout: mod("atomic_fallout", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Atomic Fallout: magazine \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Magazine Capacity"),
    line("radiation", "weapon_dps", "elemental_from_base_damage", "Atomic Fallout: radiation \u2014 +60% <DT_RADIATION_COLOR>Radiation, +40% Magazine Capacity"),
  ]),
  augursetmod: mod("augursetmod", [], "wiki: Augursetmod \u2014 catalog entry (stats in ability logic)"),
  auto_breach: mod("auto_breach", [], "wiki: Auto Breach \u2014 +30% chance to auto complete Hacking"),
  balanced_posture: mod("balanced_posture", [
    line("range", "mod_panel", "multiplicative_percent", "Balanced Posture: range \u2014 The companion acts freely as they see fit. Staggers enemies within 2m while movi\u2026 (arsenal display only)"),
  ]),
  battle_forge: mod("battle_forge", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Battle Forge: cooldown \u2014 Reduce Forge Cooldown by 120s\\\\nCooldown: 480s"),
  ]),
  battle_stations: mod("battle_stations", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Battle Stations: cooldown \u2014 Boost Turret Damage by 75% for 30s\\\\nCooldown: 240s"),
    line("duration", "mod_panel", "multiplicative_percent", "Battle Stations: duration \u2014 Boost Turret Damage by 75% for 30s\\\\nCooldown: 240s"),
  ]),
  biting_piranha: mod("biting_piranha", [], "wiki: Biting Piranha \u2014 Fighting form devised for Conclave."),
  blackout_pulse: mod("blackout_pulse", [], "wiki: Blackout Pulse \u2014 Electro-Magnetic Pulse that damages enemies and disables them temporarily."),
  blind_justice: mod("blind_justice", [], "wiki: Blind Justice \u2014 Reverse grip style emphasizing slashing and impaling strikes."),
  blood_for_ammo: mod("blood_for_ammo", [], "wiki: Blood For Ammo \u2014 Mercy Kill refills Primary and Secondary Magazine by 100%"),
  blood_for_energy: mod("blood_for_energy", [
    line("energy", "mod_panel", "multiplicative_percent", "wiki: Blood For Energy — mercy energy orb drop (not max energy)"),
  ]),
  blood_for_life: mod("blood_for_life", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Blood For Life — mercy health orb drop (not max health)"),
  ]),
  blunderbuss_r3: mod("blunderbuss_r3", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Blunderbuss: criticalChance \u2014 +90% Critical Chance"),
  ]),
  bonebladesetmod: mod("bonebladesetmod", [], "wiki: Bonebladesetmod \u2014 catalog entry (stats in ability logic)"),
  borealsetmod: mod("borealsetmod", [], "wiki: Borealsetmod \u2014 catalog entry (stats in ability logic)"),
  boundless_energy: mod("boundless_energy", [], "wiki: Boundless Energy \u2014 Ability strength, duration, and cast speed granted by spectral pages increased by 40%."),
  bounty_hunter: mod("bounty_hunter", [
    line("duration", "mod_panel", "multiplicative_percent", "Bounty Hunter: duration \u2014 On Hit:\\\\nReveals target on Minimap for +6s."),
  ]),
  breach_loader: mod("breach_loader", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Breach Loader: puncture \u2014 +120% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  breach_quanta: mod("breach_quanta", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Breach Quanta: cooldown \u2014 Temporarily stall Hull Breach for 55s\\\\nCooldown: 300s"),
    line("duration", "mod_panel", "multiplicative_percent", "Breach Quanta: duration \u2014 Temporarily stall Hull Breach for 55s\\\\nCooldown: 300s"),
  ]),
  brilliant_insight: mod("brilliant_insight", [], "wiki: Brilliant Insight \u2014 Spectral pages also fire off beams that blind enemies within 16m."),
  broad_eye: mod("broad_eye", [
    line("zoom", "mod_panel", "multiplicative_percent", "Broad Eye: zoom \u2014 -60% Zoom while Aim Gliding (arsenal display only)"),
  ]),
  brutal_tide: mod("brutal_tide", [], "wiki: Brutal Tide \u2014 Round-house attacks and leaping fists."),
  butchers_revelry: mod("butchers_revelry", [], "wiki: Butcher's Revelry \u2014 Stance: Rip and rend with this Assault Saw stance."),
  byteryte: mod("byteryte", [], "wiki: Byteryte \u2014 Keeps your bytes tight and your bits fit"),
  caustic_strike: mod("caustic_strike", [], "wiki: Caustic Strike \u2014 Second Ability launches an energy bomb that explodes with a 8m radius, stripping 100% of enemy armor. Tap <ACTIVATE_ABILITY_1> again to detonate in-flight."),
  celestial_nightfall: mod("celestial_nightfall", [], "wiki: Celestial Nightfall \u2014 Fighting form devised for Conclave."),
  charged_shell_r3: mod("charged_shell_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Charged Shell: electricity \u2014 +90% <DT_ELECTRICITY_COLOR>Electricity"),
  ]),
  chilling_grasp_r3: mod("chilling_grasp_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Chilling Grasp: cold \u2014 +90% <DT_FREEZE_COLOR>Cold"),
  ]),
  chilling_reload: mod("chilling_reload", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Chilling Reload: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +40% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Chilling Reload: reloadSpeed \u2014 +60% <DT_FREEZE_COLOR>Cold, +40% Reload Speed"),
  ]),
  cleanse_corpus_r3: mod("cleanse_corpus_r3", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Cleanse Corpus: factionCorpus \u2014 x1.3 Damage to Corpus"),
  ]),
  cleanse_grineer_r3: mod("cleanse_grineer_r3", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Cleanse Grineer: factionGrineer \u2014 x1.3 Damage to Grineer"),
  ]),
  cleanse_infested_r3: mod("cleanse_infested_r3", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Cleanse Infested: factionInfested \u2014 x1.3 Damage to Infested"),
  ]),
  cleanse_orokin: mod("cleanse_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Cleanse Orokin: factionOrokin \u2014 x1.3 Damage to Orokin"),
  ]),
  cleanse_the_murmur: mod("cleanse_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Cleanse The Murmur: factionMurmur \u2014 x1.3 Damage to Murmur"),
  ]),
  cogron_tauron_strike: mod("cogron_tauron_strike", [], "wiki: Cogron Tauron Strike \u2014 Summon forth Cogron from the Void and brandish the mighty hammer, slamming it into the ground to create a cataclysmic shockwave that ripples 4 times."),
  companion_weapon_riven_mod: mod("companion_weapon_riven_mod", [], "wiki: Companion Weapon Riven Mod \u2014 You will need to prove yourself before I reveal the beauty within this work."),
  computer_cop: mod("computer_cop", [], "wiki: Computer Cop \u2014 Stopping cyber-crime in its tracks"),
  conductive_blade: mod("conductive_blade", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Conductive Blade: electricity \u2014 +120% <DT_ELECTRICITY_COLOR>Electricity"),
  ]),
  conic_nozzle: mod("conic_nozzle", [
    line("engineSpeed", "mod_panel", "multiplicative_percent", "Conic Nozzle: engineSpeed \u2014 +25.5% Railjack Speed"),
  ]),
  contagious_spread_r3: mod("contagious_spread_r3", [
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Contagious Spread: toxin \u2014 +90% <DT_POISON_COLOR>Toxin"),
  ]),
  counterbalance: mod("counterbalance", [
    line("recoil", "mod_panel", "multiplicative_percent", "Counterbalance: recoil \u2014 -60% Weapon Recoil (arsenal display only)"),
  ]),
  countermeasures: mod("countermeasures", [], "wiki: Countermeasures \u2014 Flares that distract enemy guided projectiles."),
  crash_shot: mod("crash_shot", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Crash Shot — IPS convert (not always-on damage)"),
  ]),
  crashing_havoc: mod("crashing_havoc", [], "wiki: Crashing Havoc \u2014 Fighting form devised for Conclave."),
  crashing_timber: mod("crashing_timber", [], "wiki: Crashing Timber \u2014 Fighting form devised for Conclave."),
  crimson_fugue: mod("crimson_fugue", [
    line("damage", "weapon_dps", "multiplicative_percent", "Crimson Fugue: damage \u2014 +27.5% Turret Damage per enemy destroyed, for 8s (Maximum 5 stacks)"),
    line("duration", "mod_panel", "multiplicative_percent", "Crimson Fugue: duration \u2014 +27.5% Turret Damage per enemy destroyed, for 8s (Maximum 5 stacks)"),
  ]),
  critical_meltdown: mod("critical_meltdown", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Critical Meltdown: criticalChance \u2014 +60% <DT_RADIATION_COLOR>Radiation, +60% Critical Chance"),
    line("radiation", "weapon_dps", "elemental_from_base_damage", "Critical Meltdown: radiation \u2014 +60% <DT_RADIATION_COLOR>Radiation, +60% Critical Chance"),
  ]),
  cruising_speed: mod("cruising_speed", [
    line("engineSpeed", "mod_panel", "multiplicative_percent", "Cruising Speed: engineSpeed \u2014 +100% Railjack Speed when no enemies within 3000m"),
    line("range", "mod_panel", "multiplicative_percent", "Cruising Speed: range \u2014 +100% Railjack Speed when no enemies within 3000m (arsenal display only)"),
  ]),
  crushing_ruin: mod("crushing_ruin", [], "wiki: Crushing Ruin \u2014 Aerial attacks with Crowd Control combos."),
  cryo_coating: mod("cryo_coating", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Cryo Coating: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Cryo Coating: statusChance \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
  ]),
  cunning_aspect: mod("cunning_aspect", [], "wiki: Cunning Aspect \u2014 Fighting form devised for Conclave."),
  cyclone_kraken: mod("cyclone_kraken", [], "wiki: Cyclone Kraken \u2014 Brutal strikes with deft movement."),
  death_blossom: mod("death_blossom", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Death Blossom: cooldown \u2014 Turret Cooldowns removed for 30s\\\\nCooldown: 300s"),
    line("duration", "mod_panel", "multiplicative_percent", "Death Blossom: duration \u2014 Turret Cooldowns removed for 30s\\\\nCooldown: 300s"),
  ]),
  deathless_currents: mod("deathless_currents", [], "wiki: Deathless Currents \u2014 Vortex heals allies for 250 health/s. Downed players inside the vortex will be instantly revived, and dead players will be resummoned."),
  defensive_fire: mod("defensive_fire", [
    line("duration", "mod_panel", "multiplicative_percent", "Defensive Fire: duration \u2014 +13.5% Maximum Shields per enemy killed for 10s (Maximum 10 stacks)"),
    line("shield", "warframe_totals", "multiplicative_percent", "Defensive Fire: shield \u2014 +13.5% Maximum Shields per enemy killed for 10s (Maximum 10 stacks)"),
  ]),
  disarming_sling: mod("disarming_sling", [], "wiki: Disarming Sling \u2014 Slinging through enemies has a 50% chance to disarm them."),
  disruptor: mod("disruptor", [
    line("impact", "weapon_dps", "multiplicative_percent", "Disruptor: impact \u2014 +90% <DT_IMPACT_COLOR>Impact"),
  ]),
  distilled_contamination: mod("distilled_contamination", [], "wiki: Distilled Contamination \u2014 Killing an enemy affected by Contamination Wave makes all affected enemies 50% more vulnerable, while also making the effect last 10s longer. Maximum 2 stacks."),
  dividing_blades: mod("dividing_blades", [], "wiki: Dividing Blades \u2014 Fighting form devised for Conclave."),
  double_barrel_drift: mod("double_barrel_drift", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Double-Barrel Drift: accuracy \u2014 -20% Weapon Recoil, and +20% Accuracy when Sliding (arsenal display only)"),
    line("recoil", "mod_panel", "multiplicative_percent", "Double-Barrel Drift: recoil \u2014 -20% Weapon Recoil, and +20% Accuracy when Sliding (arsenal display only)"),
  ]),
  downpour: mod("downpour", [], "wiki: Downpour \u2014 Rain of Arrows will also target 4 additional enemies within 10m."),
  drive_duster: mod("drive_duster", [], "wiki: Drive-Duster \u2014 Your digital virus buster"),
  eleventh_storm: mod("eleventh_storm", [], "wiki: Eleventh Storm \u2014 Rapid attacks using sword and shield."),
  elusive_posture: mod("elusive_posture", [], "wiki: Elusive Posture \u2014 The companion will avoid attacking. +50% Evasion"),
  energy_pulse: mod("energy_pulse", [], "wiki: Energy Pulse \u2014 Energy pickups grant 50% additional Energy over 5s."),
  eroding_rapids: mod("eroding_rapids", [], "wiki: Eroding Rapids \u2014 Vortex applies 100% status vulnerability to all enemies within it."),
  failsafe: mod("failsafe", [], "wiki: Failsafe \u2014 +50% to retry on Hacking failure"),
  fass: mod("fass", [], "wiki: Fass \u2014 Roiling, moaning, this realm of ours  In madness lost shall die"),
  fatal_acceleration: mod("fatal_acceleration", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Fatal Acceleration: projectileSpeed \u2014 +40% Projectile Speed"),
  ]),
  fateful_truth: mod("fateful_truth", [], "wiki: Fateful Truth \u2014 Fighting form devised for Conclave."),
  femursetmod: mod("femursetmod", [], "wiki: Femursetmod \u2014 catalog entry (stats in ability logic)"),
  final_harbinger: mod("final_harbinger", [], "wiki: Final Harbinger \u2014 Powerful slashes and shield attacks."),
  fire_suppression: mod("fire_suppression", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Fire Suppression: cooldown \u2014 Extinguish 1 fire\\\\nCooldown: <LOWER_IS_BETTER>200s"),
  ]),
  firewall: mod("firewall", [], "wiki: Firewall \u2014 Reduces damage by 75% while hacking"),
  flak_shot: mod("flak_shot", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Flak Shot — IPS convert (not always-on damage)"),
  ]),
  flechette: mod("flechette", [
    line("puncture", "weapon_dps", "multiplicative_percent", "Flechette: puncture \u2014 +90% <DT_PUNCTURE_COLOR>Puncture"),
  ]),
  flow_burn: mod("flow_burn", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Flow Burn: cooldown \u2014 +38% Speed and Boost Speed for 13s\\\\nCooldown: 240s"),
    line("duration", "mod_panel", "multiplicative_percent", "Flow Burn: duration \u2014 +38% Speed and Boost Speed for 13s\\\\nCooldown: 240s"),
  ]),
  flowing_strikes: mod("flowing_strikes", [], "wiki: Flowing Strikes \u2014 Increase the range of spectral melee attacks to 26m."),
  form_up: mod("form_up", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Form Up: cooldown \u2014 Recall all Crew Members to the Railjack and Heal them for 100%\\\\nCooldown: 240s"),
  ]),
  fortifying_fire: mod("fortifying_fire", [
    line("shield", "warframe_totals", "multiplicative_percent", "Fortifying Fire: shield \u2014 ON CRITICAL HIT:\\\\nReplenish 4.5% of Shields"),
  ]),
  forward_artillery: mod("forward_artillery", [
    line("artilleryDamage", "mod_panel", "multiplicative_percent", "Forward Artillery: artilleryDamage \u2014 +100% Forward Artillery Damage"),
    line("damage", "weapon_dps", "multiplicative_percent", "Forward Artillery: damage \u2014 +100% Forward Artillery Damage"),
  ]),
  four_riders: mod("four_riders", [], "wiki: Four Riders \u2014 Fast strikes, powerful slams."),
  fracturing_wind: mod("fracturing_wind", [], "wiki: Fracturing Wind \u2014 Fast, multi-hit strikes with powerful finishers."),
  frenzied_posture: mod("frenzied_posture", [
    line("statusDuration", "mod_panel", "multiplicative_percent", "Frenzied Posture: statusDuration \u2014 The companion prefers to change its target after each attack. +80% Status Durati\u2026"),
  ]),
  frigid_blast_r3: mod("frigid_blast_r3", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Frigid Blast: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Frigid Blast: statusChance \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
  ]),
  full_contact: mod("full_contact", [
    line("impact", "weapon_dps", "multiplicative_percent", "Full Contact: impact \u2014 +120% <DT_IMPACT_COLOR>Impact"),
  ]),
  gaias_tragedy: mod("gaias_tragedy", [], "wiki: Gaia's Tragedy \u2014 Slow, powerful strikes."),
  galeforce_dawn: mod("galeforce_dawn", [], "wiki: Galeforce Dawn \u2014 Wide slashes and heavy strikes."),
  galvanized_acceleration: mod("galvanized_acceleration", [
    line("duration", "mod_panel", "multiplicative_percent", "Galvanized Acceleration: duration \u2014 +30% Projectile Speed and +30% Beam Range, On Kill:\\\\n+30% Projectile Speed and \u2026"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Galvanized Acceleration: projectileSpeed \u2014 +30% Projectile Speed and +30% Beam Range, On Kill:\\\\n+30% Projectile Speed and \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Galvanized Acceleration: range \u2014 +30% Projectile Speed and +30% Beam Range, On Kill:\\\\n+30% Projectile Speed and \u2026 (arsenal display only)"),
  ]),
  gemini_cross: mod("gemini_cross", [], "wiki: Gemini Cross \u2014 A style exhibiting sweeping slash attacks and swift jabs."),
  gladiatorsetmod: mod("gladiatorsetmod", [], "wiki: Gladiatorsetmod \u2014 catalog entry (stats in ability logic)"),
  gleaming_talon: mod("gleaming_talon", [], "wiki: Gleaming Talon \u2014 Fast arcing strikes."),
  granums_nemesis: mod("granums_nemesis", [], "wiki: Granum's Nemesis \u2014 x1.27 Turret Damage vs Corpus"),
  great_quake: mod("great_quake", [], "wiki: Great Quake \u2014 Increase shockwave radius by +40%."),
  guardian_break: mod("guardian_break", [], "wiki: Guardian Break \u2014 When the Guardian Shell breaks, Warframe Shield Regeneration rate is increased by 150% and Regeneration Delay is reduced by 80%, for 12s."),
  hard_reset: mod("hard_reset", [
    line("duration", "mod_panel", "multiplicative_percent", "Hard Reset: duration \u2014 Mercy Kills reduce Companion Recovery by 15s"),
  ]),
  hardened_wellspring: mod("hardened_wellspring", [], "wiki: Hardened Wellspring \u2014 Use your first Ability inside a Wellspring to increase its size, boost its duration by 20s, and grant 20% Ability Strength to those inside."),
  harrowing_spire: mod("harrowing_spire", [], "wiki: Harrowing Spire \u2014 Relentless jabs and powerful sweeping lunges."),
  hawksetmod: mod("hawksetmod", [], "wiki: Hawksetmod \u2014 catalog entry (stats in ability logic)"),
  hit_and_run: mod("hit_and_run", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Hit And Run — post-mercy parkour"),
    line("parkourVelocity", "mod_panel", "multiplicative_percent", "wiki: Hit And Run — post-mercy parkour"),
  ]),
  hungering_blades: mod("hungering_blades", [], "wiki: Hungering Blades \u2014 Spectral weapons have a 100% chance to attack the same enemy a second time."),
  huntersetmod: mod("huntersetmod", [], "wiki: Huntersetmod \u2014 catalog entry (stats in ability logic)"),
  hydraulic_chamber: mod("hydraulic_chamber", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Hydraulic Chamber: magazine \u2014 -60% Weapon Recoil, -10% Magazine Capacity"),
    line("recoil", "mod_panel", "multiplicative_percent", "Hydraulic Chamber: recoil \u2014 -60% Weapon Recoil, -10% Magazine Capacity (arsenal display only)"),
  ]),
  hyperstrike: mod("hyperstrike", [
    line("damage", "weapon_dps", "multiplicative_percent", "Hyperstrike: damage \u2014 +75% Turret Damage"),
    line("turretDamage", "mod_panel", "multiplicative_percent", "Hyperstrike: turretDamage \u2014 +75% Turret Damage"),
  ]),
  immuno_shield: mod("immuno_shield", [], "wiki: Immuno Shield \u2014 Gain 15% Disinfection and gain 5000 Affinity"),
  incendiary_coat_r3: mod("incendiary_coat_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Incendiary Coat: heat \u2014 +90% <DT_FIRE_COLOR>Heat"),
  ]),
  indomitable_matrix: mod("indomitable_matrix", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Indomitable Matrix — breach-gated (railjack.ts owns apply)"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Indomitable Matrix — breach-gated (railjack.ts owns apply)"),
  ]),
  inner_might: mod("inner_might", [], "wiki: Inner Might \u2014 Allows Abilities to be cast without using Energy or Shields but requires 60s to recharge."),
  instant_secure: mod("instant_secure", [], "wiki: Instant Secure \u2014 Gain 15% Disinfection and gain 10,000 H\\u00f6llars"),
  intruder_stasis: mod("intruder_stasis", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Intruder Stasis: cooldown \u2014 Freeze all Enemy Boarding Parties for 45s\\\\nCooldown: 300s"),
    line("duration", "mod_panel", "multiplicative_percent", "Intruder Stasis: duration \u2014 Freeze all Enemy Boarding Parties for 45s\\\\nCooldown: 300s"),
  ]),
  ion_burn: mod("ion_burn", [
    line("boostSpeed", "mod_panel", "multiplicative_percent", "Ion Burn: boostSpeed \u2014 +45% Railjack Boost Speed"),
  ]),
  ironclad_matrix: mod("ironclad_matrix", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Ironclad Matrix — railjack.ts owns hull/armor/shield apply"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Ironclad Matrix — railjack.ts owns hull/armor/shield apply"),
  ]),
  jahu: mod("jahu", [], "wiki: Jahu \u2014 Corporeal laws are unwrit  As suns and love retreat"),
  keep_clean: mod("keep_clean", [], "wiki: Keep-Clean \u2014 There's no Clean like Keep-Clean"),
  khra: mod("khra", [], "wiki: Khra \u2014 To cosmic forms from tangent planes  We end as we began"),
  kill_switch: mod("kill_switch", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Kill Switch — on-kill reload"),
    line("reloadSpeed", "weapon_dps", "conditional_stat_on_kill", "wiki: Kill Switch — On Kill: +50% Reload Speed for 3s"),
  ]),
  killers_rush: mod("killers_rush", [], "wiki: Killer's Rush \u2014 catalog entry (stats in ability logic)"),

  lashing_coil: mod("lashing_coil", [], "wiki: Lashing Coil \u2014 Fighting form devised for Conclave."),
  laser_sight: mod("laser_sight", [
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Laser Sight — On Headshot: +120% Critical Chance when Aiming for 9s"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Laser Sight — buff duration"),
  ]),
  last_herald: mod("last_herald", [], "wiki: Last Herald \u2014 Fighting form devised for Conclave."),
  lingering_torment: mod("lingering_torment", [
    line("statusDuration", "weapon_dps", "multiplicative_percent", "Lingering Torment: statusDuration \u2014 +90% Status Duration (extends DoT ticks)"),
  ]),
  live_wire: mod("live_wire", [
    line("range", "mod_panel", "multiplicative_percent", "Live Wire: range \u2014 Shock enemies within 20m while Hacking (arsenal display only)"),
  ]),
  loaded_capacity: mod("loaded_capacity", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Loaded Capacity: magazine \u2014 +30% Magazine Capacity, -15% Reload Speed"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Loaded Capacity: reloadSpeed \u2014 +30% Magazine Capacity, -15% Reload Speed"),
  ]),
  lock_and_load: mod("lock_and_load", [
    line("holsterRate", "mod_panel", "multiplicative_percent", "Lock and Load: holsterRate \u2014 +20% Magazine Reloaded/s when Holstered (arsenal display only)"),
  ]),
  lohk: mod("lohk", [], "wiki: Lohk \u2014 From brooding gulfs are we beheld  By that which bears no name"),
  loose_chamber: mod("loose_chamber", [
    line("recoil", "mod_panel", "multiplicative_percent", "Loose Chamber: recoil \u2014 +30% Reload Speed, +50% Weapon Recoil (arsenal display only)"),
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Loose Chamber: reloadSpeed \u2014 +30% Reload Speed, +50% Weapon Recoil"),
  ]),
  lorak_tauron_strike: mod("lorak_tauron_strike", [], "wiki: Lorak Tauron Strike \u2014 Summon forth Lorak from the Void and conjure its ruinous spells, calling forth a beam of energy from within. Enemies pierced by the beam have a 100% chance to drop Energy Orbs if killed within 10s."),
  madurai_transmute_core: mod("madurai_transmute_core", [], "wiki: Madurai Transmute Core \u2014 Ensures transmuted mod is of Madurai polarity and eliminates credit cost."),
  mafic_rain: mod("mafic_rain", [], "wiki: Mafic Rain \u2014 Fighting form devised for Conclave."),
  magnetic_flare: mod("magnetic_flare", [], "wiki: Magnetic Flare \u2014 Use your first Ability to create a 8m radius field that lasts for 30s and disables the shields of any enemy that enters it."),
  magnetic_strafe: mod("magnetic_strafe", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Magnetic Strafe: fireRate \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Fire Rate"),
    line("magnetic", "weapon_dps", "elemental_from_base_damage", "Magnetic Strafe: magnetic \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Fire Rate"),
  ]),
  magnetic_welt: mod("magnetic_welt", [
    line("fireRate", "mod_panel", "multiplicative_percent", "wiki: Magnetic Welt — Impact→Magnetic proc chance (not fire rate)"),
  ]),
  magnetized_core: mod("magnetized_core", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Magnetized Core: criticalMultiplier \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Critical Damage"),
    line("magnetic", "weapon_dps", "elemental_from_base_damage", "Magnetized Core: magnetic \u2014 +60% <DT_MAGNETIC_COLOR>Magnetic, +40% Critical Damage"),
  ]),
  malicious_code: mod("malicious_code", [
    line("duration", "mod_panel", "multiplicative_percent", "Malicious Code: duration \u2014 50% chance on Mercy Kill for enemies within 15m to cower in fear for 8s"),
    line("range", "mod_panel", "multiplicative_percent", "Malicious Code: range \u2014 50% chance on Mercy Kill for enemies within 15m to cower in fear for 8s (arsenal display only)"),
  ]),
  malicious_raptor: mod("malicious_raptor", [], "wiki: Malicious Raptor \u2014 Puncturing strikes and quick slashes."),
  master_key: mod("master_key", [
    line("range", "mod_panel", "multiplicative_percent", "Master Key: range \u2014 Unlock 5 lockers within 20m after Hacking (arsenal display only)"),
  ]),
  mechasetmod: mod("mechasetmod", [], "wiki: Mechasetmod \u2014 catalog entry (stats in ability logic)"),
  melee_riven_mod: mod("melee_riven_mod", [], "wiki: Melee Riven Mod \u2014 You will need to prove yourself before I reveal the beauty within this work."),
  mending_soul: mod("mending_soul", [], "wiki: Mending Soul \u2014 The first 4 revives are instantaneous. Additional revives are 100% faster."),
  mending_unity: mod("mending_unity", [], "wiki: Mending Unity \u2014 Increases Affinity Radius by 25m."),
  momentary_pause: mod("momentary_pause", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Momentary Pause — on-kill heal rate"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Momentary Pause — on-kill heal (not max health)"),
  ]),
  mountains_edge: mod("mountains_edge", [], "wiki: Mountain's Edge \u2014 Sharp movements with wide reach."),
  munitions_vortex: mod("munitions_vortex", [], "wiki: Munitions Vortex \u2014 Vortex that absorbs incoming fire and detonates, releasing damage."),
  nano_applicator: mod("nano_applicator", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Nano-Applicator — cast+aim gated SC"),
    line("statusChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Nano-Applicator — On Ability Cast: +90% Status Chance when Aiming for 9s"),
  ]),
  naramon_transmute_core: mod("naramon_transmute_core", [], "wiki: Naramon Transmute Core \u2014 Ensures transmuted mod is of Naramon polarity and eliminates credit cost."),
  narrow_barrel: mod("narrow_barrel", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Narrow Barrel: accuracy \u2014 On Hit:\\\\n+30% Accuracy when Aiming for 9s (arsenal display only)"),
    line("duration", "mod_panel", "multiplicative_percent", "Narrow Barrel: duration \u2014 On Hit:\\\\n+30% Accuracy when Aiming for 9s"),
  ]),
  netra: mod("netra", [], "wiki: Netra \u2014 Carrion hordes trill their profane  Accord with eldritch plans"),
  nidri_tauron_strike: mod("nidri_tauron_strike", [], "wiki: Nidri Tauron Strike \u2014 Summon forth Nidri from the Void and plant the noble staff into the ground, creating a titanic splash of water that becomes a lingering vortex for 20s. 50% of damage dealt to enemies caught in the vortex is also inflicted upon all other enemies within it."),
  nirasetmod: mod("nirasetmod", [], "wiki: Nirasetmod \u2014 catalog entry (stats in ability logic)"),
  noble_cadence: mod("noble_cadence", [], "wiki: Noble Cadence \u2014 Fighting form devised for Conclave."),
  onslaught_matrix: mod("onslaught_matrix", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Onslaught Matrix — full-hull gated (railjack.ts)"),
  ]),
  ordnance_cheap_shot: mod("ordnance_cheap_shot", [], "wiki: Ordnance Cheap Shot \u2014 Ordnance weapons have a +90% chance to not consume Munitions"),
  ordnance_velocity: mod("ordnance_velocity", [
    line("ordnanceSpeed", "mod_panel", "multiplicative_percent", "Ordnance Velocity: ordnanceSpeed \u2014 +60% Ordnance Projectile Speed"),
  ]),
  orgone_tuning_matrix: mod("orgone_tuning_matrix", [
    line("heat", "mod_panel", "multiplicative_percent", "wiki: Orgone Tuning Matrix — forge/heat capacity (not weapon heat)"),
  ]),
  oull: mod("oull", [], "wiki: Oull \u2014 Through endless faces, countless forms, a multitude unfolds.  (Mimics any Requiem Mod)"),
  out_of_sight: mod("out_of_sight", [
    line("range", "mod_panel", "multiplicative_percent", "Out Of Sight: range \u2014 Blinds enemies within 18m on Mercy Kill (arsenal display only)"),
  ]),
  overloader: mod("overloader", [
    line("magazine", "mod_panel", "multiplicative_percent", "wiki: Overloader — railjack.ts owns munitions capacity apply"),
  ]),
  overwhelming_power: mod("overwhelming_power", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "wiki: Overwhelming Power — Tauron Strike hit stacks (not always-on)"),
  ]),
  particle_ram: mod("particle_ram", [], "wiki: Particle Ram \u2014 Railjack Ram that deals damage to anything it touches when moving forward."),
  peculiar_audience: mod("peculiar_audience", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Peculiar Audience: cooldown \u2014 Killing an enemy has a 60% chance to amuse a certain Void entity. Cooldown: 20s."),
  ]),
  peculiar_bloom: mod("peculiar_bloom", [], "wiki: Peculiar Bloom \u2014 Critical hits cause flowers to grow from the wounds."),
  peculiar_end: mod("peculiar_end", [], "wiki: Peculiar End \u2014 Finisher kills have a 100% chance to dissolve enemies in dread."),
  peculiar_growth: mod("peculiar_growth", [
    line("duration", "mod_panel", "multiplicative_percent", "Peculiar Growth: duration \u2014 Damaging an enemy will inflate the body part hit for 6s."),
  ]),
  persistent_posture: mod("persistent_posture", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Persistent Posture — impact bias / AI (not always-on base damage)"),
  ]),
  phoenix_blaze: mod("phoenix_blaze", [], "wiki: Phoenix Blaze \u2014 Wreathes the Railjack in fire, increasing Turret Damage and Speed."),
  phoenix_spirit: mod("phoenix_spirit", [], "wiki: Phoenix Spirit \u2014 Elemental Damage increased by |PERCENT|%."),
  piercing_fury: mod("piercing_fury", [], "wiki: Piercing Fury \u2014 Fighting form devised for Conclave."),
  pistol_riven_mod: mod("pistol_riven_mod", [], "wiki: Pistol Riven Mod \u2014 You will need to prove yourself before I reveal the beauty within this work."),
  point_blank_r3: mod("point_blank_r3", [
    line("damage", "weapon_dps", "multiplicative_percent", "Point Blank: damage \u2014 +90% Damage"),
  ]),
  power_drain: mod("power_drain", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "wiki: Power Drain — next cast after mercy (not always-on strength)"),
  ]),
  power_spike: mod("power_spike", [], "wiki: Power Spike \u2014 Melee Combo Counter now decays while out of combat by 5 every few seconds, instead of depleting completely."),
  predator: mod("predator", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Predator: criticalChance \u2014 +50% Turret Critical Chance"),
    line("turretCritChance", "mod_panel", "multiplicative_percent", "Predator: turretCritChance \u2014 +50% Turret Critical Chance"),
  ]),
  primed_ammo_stock: mod("primed_ammo_stock", [
    line("magazine", "weapon_dps", "multiplicative_percent", "Primed Ammo Stock: magazine \u2014 +110% Magazine Capacity"),
  ]),
  primed_blunderbuss: mod("primed_blunderbuss", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "Primed Blunderbuss: criticalChance \u2014 +165% Critical Chance"),
  ]),
  primed_cleanse_corpus: mod("primed_cleanse_corpus", [
    line("factionCorpus", "mod_panel", "multiplicative_percent", "Primed Cleanse Corpus: factionCorpus \u2014 x1.55 Damage to Corpus"),
  ]),
  primed_cleanse_grineer: mod("primed_cleanse_grineer", [
    line("factionGrineer", "mod_panel", "multiplicative_percent", "Primed Cleanse Grineer: factionGrineer \u2014 x1.55 Damage to Grineer"),
  ]),
  primed_cleanse_infested: mod("primed_cleanse_infested", [
    line("factionInfested", "mod_panel", "multiplicative_percent", "Primed Cleanse Infested: factionInfested \u2014 x1.55 Damage to Infested"),
  ]),
  primed_cleanse_orokin: mod("primed_cleanse_orokin", [
    line("factionOrokin", "mod_panel", "multiplicative_percent", "Primed Cleanse Orokin: factionOrokin \u2014 x1.55 Damage to Orokin"),
  ]),
  primed_cleanse_the_murmur: mod("primed_cleanse_the_murmur", [
    line("factionMurmur", "mod_panel", "multiplicative_percent", "Primed Cleanse The Murmur: factionMurmur \u2014 x1.55 Damage to Murmur"),
  ]),
  primed_counterbalance: mod("primed_counterbalance", [
    line("recoil", "mod_panel", "multiplicative_percent", "Primed Counterbalance: recoil \u2014 -85% Weapon Recoil (arsenal display only)"),
  ]),
  primed_shotgun_ammo_mutation: mod("primed_shotgun_ammo_mutation", [
    line("ammoConversion", "mod_panel", "multiplicative_percent", "Primed Shotgun Ammo Mutation: ammoConversion \u2014 Converts Secondary ammo pickups to 92% of Ammo Pick Up."),
  ]),
  prismatic_beam: mod("prismatic_beam", [], "wiki: Prismatic Beam \u2014 Enemies struck by the Tauron Strike fire off smaller beams at other enemies within 20m."),
  prize_kill: mod("prize_kill", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Prize Kill — on-kill shield recharge"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Prize Kill — on-kill health orb effect"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Prize Kill — on-kill shield recharge"),
  ]),
  protective_shots: mod("protective_shots", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Protective Shots — shield-gated (railjack sim)"),
  ]),
  protector_posture: mod("protector_posture", [
    line("range", "mod_panel", "multiplicative_percent", "Protector Posture: range \u2014 The companion will prioritize attacking enemies within 15m of the Warframe. Atta\u2026 (arsenal display only)"),
  ]),
  quaking_hand: mod("quaking_hand", [], "wiki: Quaking Hand \u2014 Fighting form devised for Conclave."),
  quick_correct: mod("quick_correct", [], "wiki: Quick Correct \u2014 Gain 10% Disinfection and 10% chance to drop a Live Heartcell "),
  quicklock: mod("quicklock", [], "wiki: Quicklock \u2014 -112.5% Ordnance Lock-On Time"),
  raider_matrix: mod("raider_matrix", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Raider Matrix — archwing slingshot (not gun/RJ paper)"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Raider Matrix — archwing slingshot utility"),
  ]),
  rain_of_arrows: mod("rain_of_arrows", [], "wiki: Rain Of Arrows \u2014 On dealing damage, fire an arrow at an enemy with 0.35s cooldown between arrows. 30s duration."),
  raptorsetmod: mod("raptorsetmod", [], "wiki: Raptorsetmod \u2014 catalog entry (stats in ability logic)"),
  ravage_r3: mod("ravage_r3", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "Ravage: criticalMultiplier \u2014 +60% Critical Damage"),
  ]),
  rending_crane: mod("rending_crane", [], "wiki: Rending Crane \u2014 Downward cuts with an impact combo."),
  rending_wind: mod("rending_wind", [], "wiki: Rending Wind \u2014 Fighting form devised for Conclave."),
  repeater_clip: mod("repeater_clip", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Repeater Clip — reload+aim gated fire rate"),
    line("fireRate", "weapon_dps", "conditional_stat_on_trigger", "wiki: Repeater Clip — On Reload: +105% Fire Rate when Aiming for 9s"),
  ]),
  revo_reducer: mod("revo_reducer", [], "wiki: Revo Reducer \u2014 -60.8% Omni Revolite Consumption"),
  rifle_riven_mod: mod("rifle_riven_mod", [], "wiki: Rifle Riven Mod \u2014 You will need to prove yourself before I reveal the beauty within this work."),
  rift_waters: mod("rift_waters", [], "wiki: Rift Waters \u2014 Vortex strips enemy Overguard 25% per second."),
  ripload: mod("ripload", [
    line("reloadSpeed", "mod_panel", "multiplicative_percent", "wiki: Ripload — ordnance reload time (not weapon reload)"),
  ]),
  ris: mod("ris", [], "wiki: Ris \u2014 In luminous space blackened stars  They gaze, accuse, deny"),
  rising_steel: mod("rising_steel", [], "wiki: Rising Steel \u2014 Fighting form devised for Conclave."),
  runtime: mod("runtime", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Runtime — post-hack sprint"),
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Runtime — post-hack sprint"),
  ]),
  sacrificesetmod: mod("sacrificesetmod", [], "wiki: Sacrificesetmod \u2014 catalog entry (stats in ability logic)"),

  scarlet_hurricane: mod("scarlet_hurricane", [], "wiki: Scarlet Hurricane \u2014 Fighting form devised for Conclave."),
  scattering_inferno_r3: mod("scattering_inferno_r3", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Scattering Inferno: heat \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Scattering Inferno: statusChance \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
  ]),
  scourging_warheads: mod("scourging_warheads", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Scourging Warheads — ordnance ignore shields (special)"),
  ]),
  section_density: mod("section_density", [
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "wiki: Section Density — alias (railjack.ts owns turretCritDamage)"),
    line("turretCritDamage", "mod_panel", "multiplicative_percent", "wiki: Section Density — railjack.ts owns apply"),
  ]),
  seeker_volley: mod("seeker_volley", [], "wiki: Seeker Volley \u2014 Fires a volley of homing missiles."),
  seeking_force_r3: mod("seeking_force_r3", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "Seeking Force: punchThrough \u2014 +2.1 Punch Through (arsenal display only)"),
  ]),
  seismic_impact: mod("seismic_impact", [], "wiki: Seismic Impact \u2014 Cogron Tauron Strikes enable their shockwave effect for the next 4 aerial Melee slam attacks."),
  semi_shotgun_cannonade: mod("semi_shotgun_cannonade", [
    line("damage", "weapon_dps", "multiplicative_percent", "Semi-Shotgun Cannonade: damage \u2014 Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\\\n+240% Da\u2026"),
    line("punchThrough", "mod_panel", "multiplicative_percent", "Semi-Shotgun Cannonade: punchThrough \u2014 Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\\\n+240% Da\u2026 (arsenal display only)"),
  ]),
  sentient_scalpel: mod("sentient_scalpel", [], "wiki: Sentient Scalpel \u2014 x1.41 Turret Damage vs Sentients"),
  shadow_harvest: mod("shadow_harvest", [], "wiki: Shadow Harvest \u2014 Fighting form devised for Conclave."),
  shatter_burst: mod("shatter_burst", [], "wiki: Shatter Burst \u2014 Delivers a barrage of explosions across a large area."),
  shattering_storm: mod("shattering_storm", [], "wiki: Shattering Storm \u2014 Methodical strikes and high impact combos."),
  shell_compression: mod("shell_compression", [
    line("ammoMaximum", "mod_panel", "multiplicative_percent", "Shell Compression: ammoMaximum \u2014 +90% Ammo Maximum"),
  ]),
  shell_shock_r3: mod("shell_shock_r3", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Shell Shock: electricity \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Shell Shock: statusChance \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
  ]),
  shotgun_barrage: mod("shotgun_barrage", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "Shotgun Barrage: fireRate \u2014 +90% Fire Rate"),
  ]),
  shotgun_elementalist: mod("shotgun_elementalist", [
    line("statusDamage", "weapon_dps", "multiplicative_percent", "wiki: Shotgun Elementalist \u2014 +90% Status Damage"),
    line("magazine", "weapon_dps", "multiplicative_percent", "wiki: Shotgun Elementalist \u2014 +60% Magazine Capacity"),
  ]),
  shotgun_riven_mod: mod("shotgun_riven_mod", [], "wiki: Shotgun Riven Mod \u2014 You will need to prove yourself before I reveal the beauty within this work."),
  shotgun_savvy: mod("shotgun_savvy", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Shotgun Savvy: statusChance \u2014 +90% Status Chance"),
  ]),
  shrapnel_shot: mod("shrapnel_shot", [
    line("criticalMultiplier", "weapon_dps", "conditional_stat_on_trigger", "wiki: Shrapnel Shot — On Kill: +99% Critical Damage when Aiming for 9s"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Shrapnel Shot — buff duration"),
  ]),
  shred_shot: mod("shred_shot", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Shred Shot — IPS convert (not always-on damage)"),
  ]),
  shredder: mod("shredder", [
    line("slash", "weapon_dps", "multiplicative_percent", "Shredder: slash \u2014 +90% <DT_SLASH_COLOR>Slash"),
  ]),
  silent_battery: mod("silent_battery", [
    line("noiseReduction", "mod_panel", "multiplicative_percent", "Silent Battery: noiseReduction \u2014 Reduces the chance an enemy will hear gunfire by 100%."),
  ]),
  slicing_feathers: mod("slicing_feathers", [], "wiki: Slicing Feathers \u2014 Twirling, acrobatic slashes with a refined touch."),
  sling_strength: mod("sling_strength", [], "wiki: Sling Strength \u2014 Switching to Warframe after a Chained Sling adds 40% Ability Strength for 20s."),
  snap_shot: mod("snap_shot", [
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Snap Shot — aiming-gated movement"),
  ]),
  soft_hands: mod("soft_hands", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Soft Hands: accuracy \u2014 On Equip: \\\\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s (arsenal display only)"),
    line("duration", "mod_panel", "multiplicative_percent", "Soft Hands: duration \u2014 On Equip: \\\\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s"),
  ]),
  soft_safe: mod("soft_safe", [], "wiki: Soft Safe \u2014 Keeping software safe by ALWAYS WATCHING"),
  sovereign_outcast: mod("sovereign_outcast", [], "wiki: Sovereign Outcast \u2014 An outlandish style with sweeping attacks."),
  spectral_blades: mod("spectral_blades", [], "wiki: Spectral Blades \u2014 Summon 4 spectral swords that are copies of equipped melee weapon. Melee attacks will simultaneously trigger spectral attacks on any enemies within 10m for 30s. Spectral sword hits increase Combo Count and grant extra Tauron Strike Charge. Spectral swords are granted to all players in Affinity Range."),
  spectral_pages: mod("spectral_pages", [], "wiki: Spectral Pages \u2014 Create 4 spectral pages granting an additional 10% Cast Speed, Ability Strength, Duration, and 100 bonus Energy per page."),
  spidersetmod: mod("spidersetmod", [], "wiki: Spidersetmod \u2014 catalog entry (stats in ability logic)"),
  squad_regen: mod("squad_regen", [], "wiki: Squad Regen \u2014 When Void Regen reaches its maximum, it is applied to squad members within Affinity Range for 60s."),
  squad_renew: mod("squad_renew", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Squad Renew: cooldown \u2014 Heal all Railjack squad members by 100%.\\\\nCooldown: 300s"),
  ]),
  star_divide: mod("star_divide", [], "wiki: Star Divide \u2014 Fighting form devised for Conclave."),
  strainsetmod: mod("strainsetmod", [], "wiki: Strainsetmod \u2014 catalog entry (stats in ability logic)"),
  sundered_bounty: mod("sundered_bounty", [], "wiki: Sundered Bounty \u2014 Shockwaves generate 5 pickups, in the form of Universal Orbs or Ammo."),
  surging_storm: mod("surging_storm", [], "wiki: Surging Storm \u2014 Increase Rain of Arrows radius to 5m."),
  sweeping_serration: mod("sweeping_serration", [
    line("slash", "weapon_dps", "multiplicative_percent", "Sweeping Serration: slash \u2014 +120% <DT_SLASH_COLOR>Slash"),
  ]),
  swelling_deluge: mod("swelling_deluge", [], "wiki: Swelling Deluge \u2014 Increase vortex duration to 40s."),
  swift_mercy: mod("swift_mercy", [], "wiki: Swift Mercy \u2014 Speed of Mercy Kills increased by 50%"),
  synthsetmod: mod("synthsetmod", [], "wiki: Synthsetmod \u2014 catalog entry (stats in ability logic)"),
  tactical_pump_r3: mod("tactical_pump_r3", [
    line("reloadSpeed", "weapon_dps", "multiplicative_percent", "Tactical Pump: reloadSpeed \u2014 +60% Reload Speed"),
  ]),
  tainted_hydra: mod("tainted_hydra", [], "wiki: Tainted Hydra \u2014 Fighting form devised for Conclave."),
  tainted_shell_r10: mod("tainted_shell_r10", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Tainted Shell: accuracy \u2014 +77% Accuracy, -55% Fire Rate (arsenal display only)"),
    line("fireRate", "weapon_dps", "multiplicative_percent", "Tainted Shell: fireRate \u2014 +77% Accuracy, -55% Fire Rate"),
  ]),
  teksetmod: mod("teksetmod", [], "wiki: Teksetmod \u2014 catalog entry (stats in ability logic)"),
  tempered_benison: mod("tempered_benison", [], "wiki: Tempered Benison \u2014 Shockwaves create 5 Armor Motes that grant +450 temporary Armor. Max 5."),
  temporal_drag: mod("temporal_drag", [], "wiki: Temporal Drag \u2014 Second Ability emits a radial burst slowing any enemy it touches by 80% for 10s."),
  temporal_shot: mod("temporal_shot", [], "wiki: Temporal Shot \u2014 Precision head shot damage increased by 100% on enemies afflicted with Temporal Drag."),
  tether: mod("tether", [], "wiki: Tether \u2014 Ensnares enemies, increasing vulnerability to Railjack weaponry."),
  thara_tauron_strike: mod("thara_tauron_strike", [], "wiki: Thara Tauron Strike \u2014 Summon forth Thara from the Void and fire the great bow into the air, blanketing the area with a rain of explosive arrows for 7s."),
  threat_blocker: mod("threat_blocker", [], "wiki: Threat Blocker \u2014 Gain 10% Disinfection and 25% chance to drop a Potency mod"),
  toxic_barrage_r3: mod("toxic_barrage_r3", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Toxic Barrage: statusChance \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Toxic Barrage: toxin \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
  ]),
  tranquil_cleave: mod("tranquil_cleave", [], "wiki: Tranquil Cleave \u2014 Powerful arcs with frenzied combo."),
  trojan_tracker: mod("trojan_tracker", [], "wiki: Trojan Tracker \u2014 Eliminating sneaky viruses since 1989"),
  turbo_protect: mod("turbo_protect", [], "wiki: Turbo Protect \u2014 Gain 10% Disinfection and 25% chance to drop an Antivirus mod"),
  umbrasetmod: mod("umbrasetmod", [], "wiki: Umbrasetmod \u2014 catalog entry (stats in ability logic)"),
  untraceable: mod("untraceable", [
    line("duration", "mod_panel", "multiplicative_percent", "Untraceable: duration \u2014 Invisible for 15s after Hacking"),
  ]),
  vazarin_transmute_core: mod("vazarin_transmute_core", [], "wiki: Vazarin Transmute Core \u2014 Ensures transmuted mod is of Vazarin polarity and eliminates credit cost."),
  vexoric_tauron_strike: mod("vexoric_tauron_strike", [], "wiki: Vexoric Tauron Strike \u2014 Summon forth Vexoric from the Void and swing the colossal sword, unleashing a wave of devastating energy. Gain +8 Melee Combo from each enemy hit."),
  vicious_approach: mod("vicious_approach", [], "wiki: Vicious Approach \u2014 Fighting form devised for Conclave."),
  vigilantesetmod: mod("vigilantesetmod", [], "wiki: Vigilantesetmod \u2014 catalog entry (stats in ability logic)"),
  void_cloak: mod("void_cloak", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Void Cloak: cooldown \u2014 Cloak from Enemies for 50s\\\\nEngine Speed reduced to 50%\\\\nCooldown: 120s"),
    line("duration", "mod_panel", "multiplicative_percent", "Void Cloak: duration \u2014 Cloak from Enemies for 50s\\\\nEngine Speed reduced to 50%\\\\nCooldown: 120s"),
  ]),
  void_hole: mod("void_hole", [], "wiki: Void Hole \u2014 A black hole that draws in enemies, dealing damage."),
  void_levitation: mod("void_levitation", [], "wiki: Void Levitation \u2014 First Ability creates a 6m wide shockwave lasting 4s, that inflicts Lift Status on all enemies it touches."),
  void_spines: mod("void_spines", [], "wiki: Void Spines \u2014 100% Damage taken is returned to the attacker."),
  void_strike: mod("void_strike", [], "wiki: Void Strike \u2014 First Ability consumes all energy to increase damage for 8s. Deal 10% additional damage for every percentage of energy consumed. 40s cooldown."),
  vome: mod("vome", [], "wiki: Vome \u2014 To cosmic madness laws submit  Though stalwart minds entreat"),
  votive_onslaught: mod("votive_onslaught", [], "wiki: Votive Onslaught \u2014 Precise, focused arcs and cuts not hampered by pity."),
  warhead: mod("warhead", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Warhead — alias (railjack.ts owns ordnanceDamage)"),
    line("ordnanceDamage", "mod_panel", "multiplicative_percent", "wiki: Warhead — railjack.ts owns apply"),
  ]),
  waveband_disruptor: mod("waveband_disruptor", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Waveband Disruptor — turret crits ignore shields (special)"),
  ]),
  wellspring: mod("wellspring", [], "wiki: Wellspring \u2014 First Ability creates a well of energy for 8s. Allies passing through the well gain 5 Energy/s for 30s."),
  worm_away: mod("worm_away", [], "wiki: Worm Away \u2014 Get rid of malware, spyware, wetware and worms"),
  worms_torment: mod("worms_torment", [], "wiki: Worm's Torment \u2014 x1.27 Turret Damage vs Grineer"),
  xata: mod("xata", [], "wiki: Xata \u2014 Its heralds are the stars it fells  The sky and Earth aflame"),
  zaw_riven_mod: mod("zaw_riven_mod", [], "wiki: Zaw Riven Mod \u2014 You will need to prove yourself before I reveal the beauty within this work."),
};
