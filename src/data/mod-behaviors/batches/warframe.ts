/**
 * Per-mod verified behaviors — category: warframe (199 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py warframe
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_WARFRAME: Record<string, VerifiedModBehavior> = {
  adaptation: mod("adaptation", [
    line("damage", "mod_panel", "multiplicative_percent", "Adaptation: damage \u2014 When Damaged:\\\\n+10% Resistance to that Damage Type for 20s. Stacks up to 90%."),
    line("damageResistanceCap", "mod_panel", "multiplicative_percent", "Adaptation: damageResistanceCap \u2014 When Damaged:\\\\n+10% Resistance to that Damage Type for 20s. Stacks up to 90%."),
    line("damageResistancePerStack", "mod_panel", "multiplicative_percent", "Adaptation: damageResistancePerStack \u2014 When Damaged:\\\\n+10% Resistance to that Damage Type for 20s. Stacks up to 90%."),
    line("duration", "mod_panel", "multiplicative_percent", "Adaptation: duration \u2014 When Damaged:\\\\n+10% Resistance to that Damage Type for 20s. Stacks up to 90%."),
  ]),
  adept_surge: mod("adept_surge", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Adept Surge — flat −25 Health (not % pool)"),
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "Adept Surge: parkourVelocity \u2014 +10% Mobility, -25 Health"),
  ]),
  adrenaline_boost: mod("adrenaline_boost", [
    line("energy", "warframe_totals", "multiplicative_percent", "Adrenaline Boost: energy \u2014 +50% Energy, -20% Health"),
    line("health", "warframe_totals", "multiplicative_percent", "Adrenaline Boost: health \u2014 +50% Energy, -20% Health"),
  ]),
  aero_vantage: mod("aero_vantage", [
    line("gravityReduction", "mod_panel", "multiplicative_percent", "Aero Vantage: gravityReduction \u2014 -100% Gravity while Aim Gliding"),
  ]),
  aerodynamic: mod("aerodynamic", [
    line("airborneDamageReduction", "mod_panel", "multiplicative_percent", "Aerodynamic: airborneDamageReduction \u2014 Squad takes 24% reduced damage while airborne, gains +6s Aim Glide and +12s Wall\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Aerodynamic: damage \u2014 Squad takes 24% reduced damage while airborne, gains +6s Aim Glide and +12s Wall\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Aerodynamic: duration \u2014 Squad takes 24% reduced damage while airborne, gains +6s Aim Glide and +12s Wall\u2026"),
  ]),
  agility_drift: mod("agility_drift", [
    line("accuracy", "mod_panel", "multiplicative_percent", "Agility Drift: accuracy \u2014 Reduced damage by 12% while airborne, <LOWER_IS_BETTER>-6% Enemy Accuracy when t\u2026 (arsenal display only)"),
    line("damageReduction", "mod_panel", "multiplicative_percent", "Agility Drift: damageReduction \u2014 Reduced damage by 12% while airborne, <LOWER_IS_BETTER>-6% Enemy Accuracy when t\u2026"),
  ]),
  air_thrusters: mod("air_thrusters", [
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Air Thrusters: slideSpeed \u2014 +100% Slide Boost when Airborne, -20% Mobility"),
  ]),
  ambush: mod("ambush", [
    line("damage", "mod_panel", "multiplicative_percent", "Ambush: damage \u2014 When Ghost invisibility is broken, Shade's owner is granted +240% Weapon Damage \u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Ambush: duration \u2014 When Ghost invisibility is broken, Shade's owner is granted +240% Weapon Damage \u2026"),
  ]),
  anti_flak_plating: mod("anti_flak_plating", [
    line("damageReduction", "mod_panel", "multiplicative_percent", "Anti-Flak Plating: damageReduction \u2014 +20 <DT_EXPLOSION_COLOR>Blast Resistance, -10% Mobility"),
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "Anti-Flak Plating: parkourVelocity \u2014 +20 <DT_EXPLOSION_COLOR>Blast Resistance, -10% Mobility"),
  ]),
  anticipation: mod("anticipation", [
    line("duration", "mod_panel", "multiplicative_percent", "Anticipation: duration \u2014 Immune to Knockdown for an additional +4s after being knocked down., Immune to S\u2026"),
  ]),
  antitoxin: mod("antitoxin", [
    line("toxin", "mod_panel", "multiplicative_percent", "Antitoxin: toxin \u2014 +82.5% <DT_POISON_COLOR>Toxin Resistance"),
  ]),
  archon_continuity: mod("archon_continuity", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Archon Continuity: abilityDuration \u2014 +55% Ability Duration, Abilities that inflict a <DT_POISON_COLOR>Toxin status ef\u2026"),
  ]),
  archon_flow: mod("archon_flow", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Archon Flow: cooldown \u2014 +185% Energy Max, Enemies killed by <DT_FREEZE_COLOR>Cold Abilities have 10% cha\u2026"),
    line("energy", "warframe_totals", "multiplicative_percent", "Archon Flow: energy \u2014 +185% Energy Max, Enemies killed by <DT_FREEZE_COLOR>Cold Abilities have 10% cha\u2026"),
  ]),
  archon_intensify: mod("archon_intensify", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Archon Intensify: abilityStrength \u2014 +30% Ability Strength\\\\nRestoring health with abilities grants +30% Ability Stre\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Archon Intensify: duration \u2014 +30% Ability Strength\\\\nRestoring health with abilities grants +30% Ability Stre\u2026"),
  ]),
  archon_stretch: mod("archon_stretch", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Archon Stretch: abilityRange \u2014 Abilities that deal <DT_ELECTRICITY_COLOR>Electricity Damage restore +2 Energy/s\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Archon Stretch: duration \u2014 Abilities that deal <DT_ELECTRICITY_COLOR>Electricity Damage restore +2 Energy/s\u2026"),
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Archon Stretch: energyOnKill \u2014 Abilities that deal <DT_ELECTRICITY_COLOR>Electricity Damage restore +2 Energy/s\u2026"),
  ]),
  archon_vitality: mod("archon_vitality", [
    line("health", "warframe_totals", "multiplicative_percent", "Archon Vitality: health \u2014 +100% Health, Status Effects from abilities that deal <DT_FIRE_COLOR>Heat Damage\u2026"),
  ]),
  armored_acrobatics: mod("armored_acrobatics", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Armored Acrobatics — conditional DR (not armor capacity)"),
    line("damage", "mod_panel", "multiplicative_percent", "Armored Acrobatics: damage \u2014 +20% Damage Resistance during Bullet Jump, -10% Mobility"),
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Armored Acrobatics — mobility penalty (not always-on sprint)"),
  ]),
  armored_agility: mod("armored_agility", [
    line("armor", "warframe_totals", "multiplicative_percent", "Armored Agility: armor \u2014 +7.5% Armor, +2.5% Sprint Speed per rank"),
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Armored Agility: sprintSpeed \u2014 +7.5% Armor, +2.5% Sprint Speed per rank"),
  ]),
  armored_evade: mod("armored_evade", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Armored Evade — conditional DR (not armor capacity)"),
    line("damage", "mod_panel", "multiplicative_percent", "Armored Evade: damage \u2014 +40% Damage Resistance while Dodging, -10% Mobility"),
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Armored Evade — mobility penalty (not always-on sprint)"),
  ]),
  armored_recovery: mod("armored_recovery", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Armored Recovery — conditional DR (not armor capacity)"),
    line("damage", "mod_panel", "multiplicative_percent", "Armored Recovery: damage \u2014 +50% Damage Resistance when knocked down, -20% Slide"),
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Armored Recovery: slideSpeed \u2014 +50% Damage Resistance when knocked down, -20% Slide"),
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Armored Recovery — slide/mobility penalty (not always-on sprint)"),
  ]),
  augmented_sonar: mod("augmented_sonar", [
    line("duration", "mod_panel", "multiplicative_percent", "Augmented Sonar: duration \u2014 Sonar Augment: Affected enemies also become visible through walls for 10s."),
  ]),
  augur_accord: mod("augur_accord", [
    line("shield", "warframe_totals", "multiplicative_percent", "wiki: Augur Accord — +70% Shield Capacity at max"),
  ]),
  augur_message: mod("augur_message", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Augur Message: abilityDuration \u2014 +6% Ability Duration per rank"),
  ]),
  augur_reach: mod("augur_reach", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Augur Reach: abilityRange \u2014 +6% Ability Range per rank"),
  ]),
  augur_secrets: mod("augur_secrets", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Augur Secrets: abilityStrength \u2014 +6% Ability Strength per rank"),
  ]),
  // Enemy armor strip — not player armor. Keep both lines panel until TTK enemy-aura wiring.
  aura_corrosive_projection: mod("aura_corrosive_projection", [
    line("armor", "mod_panel", "multiplicative_percent", "Corrosive Projection: armor \u2014 -6% Enemy Armor per rank (enemy-side; not warframe armor)"),
    line("armorReduction", "mod_panel", "multiplicative_percent", "Corrosive Projection: armorReduction \u2014 -6% Enemy Armor per rank"),
  ]),
  aura_cunning_drift: mod("aura_cunning_drift", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Cunning Drift: abilityRange \u2014 +12% Slide\\\\n-30% Friction\\\\n+15% Ability Range"),
    line("slideFriction", "mod_panel", "multiplicative_percent", "Cunning Drift: slideFriction \u2014 +12% Slide\\\\n-30% Friction\\\\n+15% Ability Range"),
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Cunning Drift: slideSpeed \u2014 +12% Slide\\\\n-30% Friction\\\\n+15% Ability Range"),
  ]),
  aura_enemy_radar: mod("aura_enemy_radar", [
    line("enemyRadar", "mod_panel", "multiplicative_percent", "Enemy Radar: enemyRadar \u2014 Highlights enemies on the Minimap\\\\nSquad receives +30 Enemy Radar"),
  ]),
  aura_energy_siphon: mod("aura_energy_siphon", [
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Energy Siphon: energyOnKill \u2014 Squad receives +0.6 Energy Regen/s"),
    line("energyRegen", "mod_panel", "multiplicative_percent", "Energy Siphon: energyRegen \u2014 Squad receives +0.6 Energy Regen/s"),
  ]),
  aura_infested_impedance: mod("aura_infested_impedance", [
    line("infestedSpeedReduction", "mod_panel", "multiplicative_percent", "Infested Impedance: infestedSpeedReduction \u2014 Enemy Infested lose -18% Speed"),
  ]),
  aura_looters: mod("aura_looters", [
    line("lootRadar", "mod_panel", "multiplicative_percent", "Looters: lootRadar \u2014 +10m Loot Radar per rank"),
  ]),
  aura_physique: mod("aura_physique", [
    line("health", "warframe_totals", "multiplicative_percent", "Physique: health \u2014 Squad gains +20% Maximum Health"),
  ]),
  aura_pistol_amplification: mod("aura_pistol_amplification", [
    line("damage", "weapon_dps", "multiplicative_percent", "Pistol Amp: damage \u2014 Squad receives +27% Pistol Damage"),
    line("pistolDamage", "mod_panel", "multiplicative_percent", "Pistol Amp: pistolDamage \u2014 Squad receives +27% Pistol Damage (display key; damage line is paper)"),
  ]),
  aura_rejuvenation: mod("aura_rejuvenation", [
    line("healthRegen", "mod_panel", "multiplicative_percent", "Rejuvenation: healthRegen \u2014 Squad receives +3 Health Regen/s"),
  ]),
  aura_rifle_amplification: mod("aura_rifle_amplification", [
    line("damage", "weapon_dps", "multiplicative_percent", "Rifle Amp: damage \u2014 Squad receives +27% Rifle Damage"),
    line("rifleDamage", "mod_panel", "multiplicative_percent", "Rifle Amp: rifleDamage \u2014 Squad receives +27% Rifle Damage (display key; damage line is paper)"),
  ]),
  // Enemy shield strip — not player shields.
  aura_shield_disruption: mod("aura_shield_disruption", [
    line("shield", "mod_panel", "multiplicative_percent", "Shield Disruption: shield \u2014 Enemies lose -18% Shield Capacity (enemy-side; not warframe shields)"),
    line("shieldReduction", "mod_panel", "multiplicative_percent", "Shield Disruption: shieldReduction \u2014 Enemies lose -18% Shield Capacity"),
  ]),
  aura_shotgun_amplification: mod("aura_shotgun_amplification", [
    line("damage", "weapon_dps", "multiplicative_percent", "Shotgun Amp: damage \u2014 Squad receives +18% Shotgun Damage"),
    line("shotgunDamage", "mod_panel", "multiplicative_percent", "Shotgun Amp: shotgunDamage \u2014 Squad receives +18% Shotgun Damage (display key; damage line is paper)"),
  ]),
  aura_speed_holster: mod("aura_speed_holster", [
    line("holsterSpeed", "mod_panel", "multiplicative_percent", "Speed Holster: holsterSpeed \u2014 +20% Holster Speed per rank"),
  ]),
  aura_sprint_boost: mod("aura_sprint_boost", [
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Sprint Boost: sprintSpeed \u2014 Squad receives +15% Sprint Speed"),
  ]),
  aura_sprint_speed: mod("aura_sprint_speed", [
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Sprint Speed: sprintSpeed \u2014 +2% Sprint Speed per rank"),
  ]),
  aura_steel_charge: mod("aura_steel_charge", [
    line("damage", "weapon_dps", "multiplicative_percent", "Steel Charge: damage \u2014 Squad receives +60% Melee Damage"),
    line("meleeDamage", "mod_panel", "multiplicative_percent", "Steel Charge: meleeDamage \u2014 Squad receives +60% Melee Damage (display key; damage line is paper)"),
  ]),
  aura_toxin_resistance: mod("aura_toxin_resistance", [
    line("toxin", "mod_panel", "multiplicative_percent", "Toxin Resistance: toxin \u2014 +15% Toxin Resistance per rank"),
    line("toxinResistance", "mod_panel", "multiplicative_percent", "Toxin Resistance: toxinResistance \u2014 +15% Toxin Resistance per rank"),
  ]),
  aviator: mod("aviator", [
    line("damageReduction", "mod_panel", "multiplicative_percent", "Aviator: damageReduction \u2014 Reduced damage by 60% while airborne"),
  ]),
  battering_maneuver: mod("battering_maneuver", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Battering Maneuver: bulletJump \u2014 +18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_IMPACT_CO\u2026"),
    line("impact", "mod_panel", "multiplicative_percent", "Battering Maneuver: impact \u2014 +18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_IMPACT_CO\u2026"),
  ]),
  blind_rage: mod("blind_rage", [
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "Blind Rage: abilityEfficiency \u2014 +99% Ability Strength\\\\n-55% Ability Efficiency"),
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Blind Rage: abilityStrength \u2014 +99% Ability Strength\\\\n-55% Ability Efficiency"),
  ]),
  brief_respite: mod("brief_respite", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Brief Respite — energy→shields on cast (not capacity)"),
  ]),
  calculated_spring: mod("calculated_spring", [
    line("health", "warframe_totals", "multiplicative_percent", "Calculated Spring: health \u2014 -10% Mobility, +25% Health"),
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Calculated Spring: sprintSpeed \u2014 -10% Mobility, +25% Health"),
  ]),
  carnis_carapace: mod("carnis_carapace", [
    line("armor", "warframe_totals", "multiplicative_percent", "Carnis Carapace: armor \u2014 +55% Armor, +20% Health"),
    line("health", "warframe_totals", "multiplicative_percent", "Carnis Carapace: health \u2014 +55% Armor, +20% Health"),
  ]),
  cataclysmic_gate: mod("cataclysmic_gate", [
    line("duration", "mod_panel", "multiplicative_percent", "Cataclysmic Gate: duration \u2014 Sol Gate Augment : Wisp and 2 spectral images cast a single blast of Sol Gate, l\u2026"),
  ]),
  catalyzing_shields: mod("catalyzing_shields", [
    line("duration", "mod_panel", "multiplicative_percent", "Catalyzing Shields: duration \u2014 x0.20 Max Shield Capacity, 1.33s Full Shield Gate immunity duration"),
  ]),
  champions_blessing: mod("champions_blessing", [
    line("duration", "mod_panel", "multiplicative_percent", "Champion's Blessing: duration \u2014 Blessing Augment: Gain Primary and Secondary Critical Chance for 30s for each pe\u2026"),
  ]),
  coaction_drift: mod("coaction_drift", [
    line("auraStrengthSelf", "mod_panel", "multiplicative_percent", "Coaction Drift: auraStrengthSelf \u2014 Squad benefits +15% more from Auras, You benefit an additional +15% from Auras"),
    line("auraStrengthSquad", "mod_panel", "multiplicative_percent", "Coaction Drift: auraStrengthSquad \u2014 Squad benefits +15% more from Auras, You benefit an additional +15% from Auras"),
  ]),
  combat_discipline: mod("combat_discipline", [], "wiki: Combat Discipline \u2014 You lose <LOWER_IS_BETTER>10 Health on kill\\\\nSquadmates gain 20 Health on kill"),
  constitution: mod("constitution", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Constitution: abilityDuration \u2014 +40% Faster Knockdown Recovery, +28% Ability Duration"),
    line("knockdownRecovery", "mod_panel", "multiplicative_percent", "Constitution: knockdownRecovery \u2014 +40% Faster Knockdown Recovery, +28% Ability Duration"),
  ]),
  continuity_r3: mod("continuity_r3", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Continuity: abilityDuration \u2014 +30% Ability Duration"),
  ]),
  controlled_slide: mod("controlled_slide", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Controlled Slide: abilityStrength \u2014 Disable Nezha's passive ability. Increase Ability Strength by 15%."),
  ]),
  damage_decoy: mod("damage_decoy", [
    line("damage", "mod_panel", "multiplicative_percent", "Damage Decoy: damage \u2014 Decoy Augment: Decoy can be cast on enemies. Enemies who attack that decoy recei\u2026"),
  ]),
  dead_eye: mod("dead_eye", [
    line("damage", "weapon_dps", "multiplicative_percent", "Dead Eye: damage \u2014 Squad receives +52.5% Sniper Rifle Damage"),
  ]),
  diamond_skin: mod("diamond_skin", [
    line("radiation", "mod_panel", "multiplicative_percent", "Diamond Skin: radiation \u2014 +82.5% <DT_RADIATION_COLOR>Radiation Resistance"),
  ]),
  emp_aura: mod("emp_aura", [
    line("accuracy", "mod_panel", "multiplicative_percent", "EMP Aura: accuracy \u2014 Enemy Corpus lose -15% Accuracy (arsenal display only)"),
  ]),
  empowered_blades: mod("empowered_blades", [
    line("statusChance", "mod_panel", "multiplicative_percent", "Empowered Blades: statusChance \u2014 Squad receives +60% Status Chance and Status Damage on Heavy Attacks, but lose <\u2026"),
  ]),
  endless_lullaby: mod("endless_lullaby", [
    line("abilityDuration", "mod_panel", "multiplicative_percent", "Endless Lullaby: abilityDuration \u2014 Lull Augment: Performing a finisher on or killing a sleeping enemy will retrigge\u2026"),
  ]),
  endurance_drift: mod("endurance_drift", [
    line("energy", "warframe_totals", "multiplicative_percent", "wiki: Endurance Drift — +10% Energy Max"),
    line("energyMax", "mod_panel", "multiplicative_percent", "wiki: Endurance Drift — energyMax catalog duplicate of energy (panel; avoid double-count)"),
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "wiki: Endurance Drift — +12% Parkour Velocity"),
  ]),
  enemy_sense_r3: mod("enemy_sense_r3", [
    line("range", "mod_panel", "multiplicative_percent", "Enemy Sense: range \u2014 +55m Enemy Radar (arsenal display only)"),
  ]),
  energy_nexus: mod("energy_nexus", [
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Energy Nexus: energyOnKill \u2014 Warframe receives +3 Energy Regen/s"),
  ]),
  equilibrium: mod("equilibrium", [
    line("energy", "mod_panel", "multiplicative_percent", "wiki: Equilibrium — Health/Energy pickup conversion (not max pool)"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Equilibrium — Health/Energy pickup conversion (not max pool)"),
  ]),
  fast_deflection_r3: mod("fast_deflection_r3", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Fast Deflection — shield recharge/delay (not capacity)"),
  ]),
  final_act: mod("final_act", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "wiki: Final Act — low-health conditional strength"),
    line("duration", "mod_panel", "multiplicative_percent", "Final Act: duration \u2014 On Low Health:\\\\n+30% Ability Strength\\\\n+30% Casting Speed for 8s"),
  ]),
  firewalker: mod("firewalker", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Firewalker: bulletJump \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_FIRE\u2026"),
    line("heat", "mod_panel", "multiplicative_percent", "Firewalker: heat \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_FIRE\u2026"),
  ]),
  flame_repellent_r3: mod("flame_repellent_r3", [
    line("heat", "mod_panel", "multiplicative_percent", "Flame Repellent: heat \u2014 +100% <DT_FIRE_COLOR>Heat Resistance"),
  ]),
  fleeting_expertise_r5: mod("fleeting_expertise_r5", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Fleeting Expertise: abilityDuration \u2014 +60% Ability Efficiency, -60% Ability Duration"),
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "Fleeting Expertise: abilityEfficiency \u2014 +60% Ability Efficiency, -60% Ability Duration"),
  ]),
  flow_r3: mod("flow_r3", [
    line("energy", "warframe_totals", "multiplicative_percent", "Flow: energy \u2014 +100% Energy Max"),
  ]),
  follow_through: mod("follow_through", [
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Follow Through: energyOnKill \u2014 On Respawn:\\\\n+10 Energy"),
  ]),
  fortitude: mod("fortitude", [
    line("knockdownResistance", "mod_panel", "multiplicative_percent", "Fortitude: knockdownResistance \u2014 +15% Shield Recharge, +50% Knockdown Resistance per rank"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Fortitude — shield recharge (not capacity)"),
    line("shieldRecharge", "mod_panel", "multiplicative_percent", "Fortitude: shieldRecharge \u2014 +15% Shield Recharge, +50% Knockdown Resistance per rank"),
  ]),
  gale_kick: mod("gale_kick", [
    line("damage", "mod_panel", "multiplicative_percent", "Gale Kick: damage \u2014 +100% of Melee Damage converted to <DT_IMPACT_COLOR>Impact Damage on Jump Kick, \u2026"),
  ]),
  gladiator_aegis: mod("gladiator_aegis", [
    line("armor", "warframe_totals", "multiplicative_percent", "Gladiator Aegis: armor \u2014 +7.5% Armor per rank (Set)"),
  ]),
  gladiator_finesse: mod("gladiator_finesse", [
    line("abilityEfficiency", "mod_panel", "multiplicative_percent", "wiki: Gladiator Finesse — lethal-damage energy drain (not efficiency pool)"),
  ]),
  gladiator_resolve: mod("gladiator_resolve", [
    line("health", "warframe_totals", "multiplicative_percent", "Gladiator Resolve: health \u2014 +40% Health"),
  ]),
  growing_power: mod("growing_power", [
    line("duration", "mod_panel", "multiplicative_percent", "Growing Power: duration \u2014 On Status Effect with Weapon: Squad increases personal Ability Strength by 25% f\u2026"),
  ]),
  handspring_r10: mod("handspring_r10", [
    line("knockdownRecovery", "mod_panel", "multiplicative_percent", "Handspring: knockdownRecovery \u2014 +240% Faster Knockdown Recovery"),
  ]),
  hastened_steps: mod("hastened_steps", [
    line("shield", "warframe_totals", "multiplicative_percent", "Hastened Steps: shield \u2014 +20% Sprint Speed, -20% Shield Capacity"),
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Hastened Steps: sprintSpeed \u2014 +20% Sprint Speed, -20% Shield Capacity"),
  ]),
  heavy_impact: mod("heavy_impact", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Heavy Impact: explosionDamage \u2014 Create 11m seismic shockwaves from heavy landings, dealing 550 Damage and knocki\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Heavy Impact: range \u2014 Create 11m seismic shockwaves from heavy landings, dealing 550 Damage and knocki\u2026 (arsenal display only)"),
  ]),
  heightened_reflexes: mod("heightened_reflexes", [
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "Heightened Reflexes: abilityEfficiency \u2014 +20% Casting Speed, -20% Ability Efficiency"),
  ]),
  holster_amp: mod("holster_amp", [
    line("damage", "mod_panel", "multiplicative_percent", "Holster Amp: damage \u2014 On Equip:\\\\nSquad gains 60% Weapon Damage for 3s"),
    line("duration", "mod_panel", "multiplicative_percent", "Holster Amp: duration \u2014 On Equip:\\\\nSquad gains 60% Weapon Damage for 3s"),
  ]),
  hunter_adrenaline: mod("hunter_adrenaline", [
    line("damage", "mod_panel", "multiplicative_percent", "Hunter Adrenaline: damage \u2014 Convert +45% of Damage on Health to Energy. Without Shields, ally Overguard imit\u2026"),
    line("energyOnHealthDamage", "mod_panel", "multiplicative_percent", "Hunter Adrenaline: energyOnHealthDamage \u2014 Convert +45% of Damage on Health to Energy. Without Shields, ally Overguard imit\u2026"),
  ]),
  hunter_track: mod("hunter_track", [
    line("radarOnBleed", "mod_panel", "multiplicative_percent", "Hunter Track: radarOnBleed \u2014 +10m Enemy Radar vs bleeding per rank"),
    line("statusDuration", "mod_panel", "multiplicative_percent", "Hunter Track: statusDuration \u2014 +10m Enemy Radar vs bleeding per rank"),
  ]),
  ice_spring: mod("ice_spring", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Ice Spring: bulletJump \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_FREE\u2026"),
    line("cold", "mod_panel", "multiplicative_percent", "Ice Spring: cold \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_FREE\u2026"),
  ]),
  insulation_r3: mod("insulation_r3", [
    line("cold", "mod_panel", "multiplicative_percent", "Insulation: cold \u2014 +100% <DT_FREEZE_COLOR>Cold Resistance"),
  ]),
  intensify_r3: mod("intensify_r3", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Intensify: abilityStrength \u2014 +55% Ability Strength"),
  ]),
  intruder: mod("intruder", [
    line("duration", "mod_panel", "multiplicative_percent", "Intruder: duration \u2014 +2s to Hacking"),
  ]),
  jades_judgment: mod("jades_judgment", [
    line("spawnChance", "mod_panel", "multiplicative_percent", "Jade's Judgment: spawnChance \u2014 Light's Judgment Augment: +1.25% Jade Light spawn chance per rank (× Strength)"),
    line("duration", "mod_panel", "multiplicative_percent", "Jade's Judgment: duration \u2014 Light's Judgment Augment: +0.75s Jade Light beam duration per rank (× Duration)"),
  ]),
  jugulus_carapace: mod("jugulus_carapace", [
    line("armor", "warframe_totals", "multiplicative_percent", "Jugulus Carapace: armor \u2014 +55% Armor, +20% Health"),
    line("health", "warframe_totals", "multiplicative_percent", "Jugulus Carapace: health \u2014 +55% Armor, +20% Health"),
  ]),
  kavats_grace: mod("kavats_grace", [
    line("hardLandingReduction", "mod_panel", "multiplicative_percent", "Kavat's Grace: hardLandingReduction \u2014 Falling is 100% less likely to result in a hard landing."),
  ]),
  lightning_dash: mod("lightning_dash", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Lightning Dash: bulletJump \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_ELEC\u2026"),
    line("electricity", "mod_panel", "multiplicative_percent", "Lightning Dash: electricity \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_ELEC\u2026"),
  ]),
  lightning_rod_r3: mod("lightning_rod_r3", [
    line("electricity", "mod_panel", "multiplicative_percent", "Lightning Rod: electricity \u2014 +100% <DT_ELECTRICITY_COLOR>Electricity Resistance"),
  ]),
  lingering_transmutation: mod("lingering_transmutation", [
    line("duration", "mod_panel", "multiplicative_percent", "Lingering Transmutation: duration \u2014 Transmutation Probe Augment: Probe returns to cast position after reaching max r\u2026"),
  ]),
  loot_detector: mod("loot_detector", [
    line("range", "mod_panel", "multiplicative_percent", "Loot Detector: range \u2014 Minimap shows loot crates.\\\\nSquad receives +30m Loot Radar (arsenal display only)"),
  ]),
  loyal_merulina: mod("loyal_merulina", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Loyal Merulina: cooldown \u2014 Merulina Augment: Yareli no longer rides Merulina. Instead, Merulina follows her\u2026"),
  ]),
  maglev: mod("maglev", [
    line("slideFriction", "mod_panel", "multiplicative_percent", "Maglev: slideFriction \u2014 +20% Slide, -20% Friction"),
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Maglev: slideSpeed \u2014 +20% Slide, -20% Friction"),
  ]),
  master_thief: mod("master_thief", [
    line("lockerUnlockChance", "mod_panel", "multiplicative_percent", "Master Thief: lockerUnlockChance \u2014 +60% chance to unlock locked lockers."),
  ]),
  mecha_pulse_r3: mod("mecha_pulse_r3", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Mecha Pulse — conditional mark-kill armor (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Mecha Pulse: duration \u2014 Killing a Marked Enemy grants +60% Armor for 20s for each enemy within 30m."),
    line("range", "mod_panel", "multiplicative_percent", "Mecha Pulse: range \u2014 Killing a Marked Enemy grants +60% Armor for 20s for each enemy within 30m. (arsenal display only)"),
  ]),
  melee_guidance: mod("melee_guidance", [
    line("duration", "mod_panel", "multiplicative_percent", "Melee Guidance: duration \u2014 You lose <LOWER_IS_BETTER>6s Melee Combo Duration\\\\nSquadmates gain 12s Melee Co\u2026"),
  ]),
  mobilize_r3: mod("mobilize_r3", [
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "Mobilize: parkourVelocity \u2014 +20% to Parkour Velocity, +20% Aim Glide/Wall Latch Duration"),
  ]),
  motus_signal: mod("motus_signal", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Motus Signal: bulletJump \u2014 Increase Double Jump strength by +200%."),
  ]),
  narrow_minded: mod("narrow_minded", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Narrow Minded: abilityDuration \u2014 +99% Ability Duration\\\\n-66% Ability Range"),
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Narrow Minded: abilityRange \u2014 +99% Ability Duration\\\\n-66% Ability Range"),
  ]),
  natural_talent: mod("natural_talent", [
    line("castSpeed", "mod_panel", "multiplicative_percent", "Natural Talent: castSpeed \u2014 Improves Casting Speed on Warframe abilities if applicable.\\\\n+50% Casting Speed"),
  ]),
  no_current_leap: mod("no_current_leap", [
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "No Current Leap: parkourVelocity \u2014 +10% Mobility, 0 Energy Rate"),
  ]),
  overcharge_detectors: mod("overcharge_detectors", [
    line("range", "mod_panel", "multiplicative_percent", "Overcharge Detectors: range \u2014 Exposes enemies at maximum Energy Capacity within 30m. (arsenal display only)"),
  ]),
  overcharged: mod("overcharged", [
    line("energyMax", "mod_panel", "multiplicative_percent", "wiki: Overcharged — respawn overshield conversion (not energy pool)"),
    line("overshieldConversion", "mod_panel", "multiplicative_percent", "Overcharged: overshieldConversion \u2014 On Respawn:\\\\nConverts up to 50 Energy to Overshields at a rate of 100%."),
  ]),
  overextended_r5: mod("overextended_r5", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Overextended: abilityRange \u2014 +90% Ability Range, -60% Ability Strength"),
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Overextended: abilityStrength \u2014 +90% Ability Range, -60% Ability Strength"),
  ]),
  pain_threshold: mod("pain_threshold", [
    line("knockdownRecovery", "mod_panel", "multiplicative_percent", "Pain Threshold: knockdownRecovery \u2014 +160% Faster Stagger Recovery"),
  ]),
  parasitic_vitality: mod("parasitic_vitality", [
    line("health", "mod_panel", "multiplicative_percent", "Parasitic Vitality: health \u2014 Parasitic Link Augment: Nidus and any ally he's bound to gain 4% Max Health per \u2026"),
  ]),
  parry_r3: mod("parry_r3", [
    line("finisherChance", "mod_panel", "multiplicative_percent", "Parry: finisherChance \u2014 +96% chance to open enemies to Finisher Attacks after Warframe blocks Melee"),
  ]),
  patagium: mod("patagium", [
    line("aimGlide", "mod_panel", "multiplicative_percent", "Patagium: aimGlide \u2014 +2.5s Aim Glide and Wall Latch per rank"),
    line("wallLatch", "mod_panel", "multiplicative_percent", "Patagium: wallLatch \u2014 +2.5s Aim Glide and Wall Latch per rank"),
  ]),
  piercing_step: mod("piercing_step", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Piercing Step: bulletJump \u2014 +18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_PUNCTURE_\u2026"),
    line("puncture", "mod_panel", "multiplicative_percent", "Piercing Step: puncture \u2014 +18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_PUNCTURE_\u2026"),
  ]),
  pistol_scavenger: mod("pistol_scavenger", [], "wiki: Pistol Scavenger \u2014 Squad receives +150% Pistol Ammo Recovery"),
  power_donation_r5: mod("power_donation_r5", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "wiki: Power Donation — host loses 30% strength (squadmates gain panel)"),
  ]),
  power_drift: mod("power_drift", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Power Drift: abilityStrength \u2014 +15% Ability Strength, +30% Chance to Resist Knockdown"),
    line("knockdownResistance", "mod_panel", "multiplicative_percent", "Power Drift: knockdownResistance \u2014 +15% Ability Strength, +30% Chance to Resist Knockdown"),
  ]),
  precision_intensify: mod("precision_intensify", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "wiki: Precision Intensify — +90% strength on 4th ability only"),
  ]),
  preparation_r10: mod("preparation_r10", [
    line("energy", "mod_panel", "multiplicative_percent", "wiki: Preparation — spawn energy fill (not max energy pool)"),
  ]),
  primed_continuity: mod("primed_continuity", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Primed Continuity: abilityDuration \u2014 +5% Ability Duration per rank (Primed)"),
  ]),
  primed_flow: mod("primed_flow", [
    line("energy", "warframe_totals", "multiplicative_percent", "Primed Flow: energy \u2014 +185% Energy Max at max rank (Primed)"),
  ]),
  primed_redirection: mod("primed_redirection", [
    line("shield", "warframe_totals", "multiplicative_percent", "Primed Redirection: shield \u2014 +55% Shield Capacity per rank (Primed)"),
  ]),
  primed_streamline: mod("primed_streamline", [
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "Primed Streamline: abilityEfficiency \u2014 +55% Ability Efficiency"),
  ]),
  primed_vigor: mod("primed_vigor", [
    line("health", "warframe_totals", "multiplicative_percent", "Primed Vigor: health \u2014 +75% Shield Capacity, +75% Health"),
    line("shield", "warframe_totals", "multiplicative_percent", "Primed Vigor: shield \u2014 +75% Shield Capacity, +75% Health"),
  ]),
  proton_pulse: mod("proton_pulse", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Proton Pulse: bulletJump \u2014 Wall Dashing grants +100% Bullet Jump Speed."),
  ]),
  provoked: mod("provoked", [
    line("damage", "mod_panel", "multiplicative_percent", "Provoked: damage \u2014 +110% Damage during Bleedout"),
  ]),
  quick_charge: mod("quick_charge", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Quick Charge — recharge delay + flat shield penalty (not % pool)"),
  ]),
  quick_thinking: mod("quick_thinking", [
    line("abilityEfficiency", "mod_panel", "multiplicative_percent", "wiki: Quick Thinking — lethal-damage energy drain (not efficiency pool)"),
  ]),
  rage: mod("rage", [
    line("damage", "mod_panel", "multiplicative_percent", "Rage: damage \u2014 Convert +60% of Damage on Health to Energy. Without Shields, ally Overguard imit\u2026"),
  ]),
  rapid_resilience: mod("rapid_resilience", [
    line("statusDuration", "mod_panel", "multiplicative_percent", "Rapid Resilience: statusDuration \u2014 -75% Status Duration on Self"),
  ]),
  razor_mortar: mod("razor_mortar", [
    line("duration", "mod_panel", "multiplicative_percent", "Razor Mortar: duration \u2014 Razor Gyre Augment: Groups enemies together, while Lethal Progeny's Ortholysts f\u2026"),
    line("electricity", "mod_panel", "multiplicative_percent", "Razor Mortar: electricity \u2014 Razor Gyre Augment: Groups enemies together, while Lethal Progeny's Ortholysts f\u2026"),
    line("fireRate", "mod_panel", "multiplicative_percent", "Razor Mortar: fireRate \u2014 Razor Gyre Augment: Groups enemies together, while Lethal Progeny's Ortholysts f\u2026"),
  ]),
  ready_steel: mod("ready_steel", [], "wiki: Ready Steel \u2014 Squad begins the mission with +24 Initial Combo"),
  recrystalize: mod("recrystalize", [
    line("range", "mod_panel", "multiplicative_percent", "Recrystalize: range \u2014 Crystallize Augment: Enemies killed by crystalline growths stagger and spread th\u2026"),
  ]),
  redirection_r3: mod("redirection_r3", [
    line("shield", "warframe_totals", "multiplicative_percent", "Redirection: shield \u2014 +100% Shield Capacity"),
  ]),
  reflection: mod("reflection", [
    line("blockStaggerChance", "mod_panel", "multiplicative_percent", "Reflection: blockStaggerChance \u2014 +73.3% chance to Stagger on Block, +18.3% chance to Stun on Block"),
    line("blockStunChance", "mod_panel", "multiplicative_percent", "Reflection: blockStunChance \u2014 +73.3% chance to Stagger on Block, +18.3% chance to Stun on Block"),
  ]),
  reflex_guard_r10: mod("reflex_guard_r10", [
    line("comboCountChance", "mod_panel", "multiplicative_percent", "Reflex Guard: comboCountChance \u2014 +100% Combo Count Chance while Blocking"),
  ]),
  rending_turn: mod("rending_turn", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Rending Turn: bulletJump \u2014 +18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_SLASH_COL\u2026"),
    line("slash", "mod_panel", "multiplicative_percent", "Rending Turn: slash \u2014 +18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_SLASH_COL\u2026"),
  ]),
  resilient_focus: mod("resilient_focus", [
    line("damage", "mod_panel", "multiplicative_percent", "Resilient Focus: damage \u2014 +20% Damage Resistance on Stun"),
  ]),
  retribution: mod("retribution", [
    line("damage", "mod_panel", "multiplicative_percent", "Retribution: damage \u2014 +90% Chance to deal Electrical Damage when shield struck by melee enemies., +120\u2026"),
  ]),
  reverse_rotorswell: mod("reverse_rotorswell", [
    line("damage", "mod_panel", "multiplicative_percent", "Reverse Rotorswell: damage \u2014 Rotorswell Augment: 35% of damage received is redirected toward the instigator a\u2026"),
  ]),
  rifle_scavenger: mod("rifle_scavenger", [], "wiki: Rifle Scavenger \u2014 Squad receives +150% Rifle Ammo Recovery"),
  rime_vault: mod("rime_vault", [], "wiki: Rime Vault \u2014 Ice FX on Bullet Jump"),
  rising_skill: mod("rising_skill", [
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "Rising Skill: parkourVelocity \u2014 +10% Mobility, -30 Shield Capacity"),
    line("shield", "warframe_totals", "multiplicative_percent", "Rising Skill: shield \u2014 +10% Mobility, -30 Shield Capacity"),
  ]),
  rolling_guard: mod("rolling_guard", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Rolling Guard: cooldown \u2014 On Dodge:\\\\nBecome invulnerable for 3s and remove all Status Effects. <LOWER_IS_\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Rolling Guard: duration \u2014 On Dodge:\\\\nBecome invulnerable for 3s and remove all Status Effects. <LOWER_IS_\u2026"),
  ]),
  rush_r3: mod("rush_r3", [
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Rush: sprintSpeed \u2014 +55% Sprint Speed"),
  ]),
  saxum_carapace: mod("saxum_carapace", [
    line("armor", "warframe_totals", "multiplicative_percent", "Saxum Carapace: armor \u2014 +55% Armor, +20% Health"),
    line("health", "warframe_totals", "multiplicative_percent", "Saxum Carapace: health \u2014 +55% Armor, +20% Health"),
  ]),
  searing_leap: mod("searing_leap", [], "wiki: Searing Leap \u2014 Fire FX on Bullet Jump"),
  shepherd: mod("shepherd", [], "wiki: Shepherd \u2014 Squad's Companions receive +300 Health and +180 Armor"),
  shock_absorbers: mod("shock_absorbers", [
    line("damage", "mod_panel", "multiplicative_percent", "Shock Absorbers: damage \u2014 +30% Physical Damage Resistance"),
  ]),
  shotgun_scavenger: mod("shotgun_scavenger", [], "wiki: Shotgun Scavenger \u2014 Squad receives +150% Shotgun Ammo Recovery"),
  sniper_scavenger: mod("sniper_scavenger", [], "wiki: Sniper Scavenger \u2014 Squad receives +150% Sniper Rifle Ammo Recovery"),
  speed_drift: mod("speed_drift", [
    line("coactionBonus", "mod_panel", "multiplicative_percent", "Speed Drift: coactionBonus \u2014 +12% Sprint Speed\\\\n+15% Casting Speed"),
    line("sprintSpeed", "warframe_totals", "multiplicative_percent", "Speed Drift: sprintSpeed \u2014 +12% Sprint Speed\\\\n+15% Casting Speed"),
  ]),
  stand_united: mod("stand_united", [
    line("armor", "warframe_totals", "multiplicative_percent", "Stand United: armor \u2014 Squad receives +25% Armor"),
  ]),
  stealth_drift: mod("stealth_drift", [
    line("range", "mod_panel", "multiplicative_percent", "Stealth Drift: range \u2014 +18m Enemy Radar, +12% Aim Glide/Wall Latch Duration (arsenal display only)"),
  ]),
  steel_fiber_r3: mod("steel_fiber_r3", [
    line("armor", "warframe_totals", "multiplicative_percent", "Steel Fiber: armor \u2014 +100% Armor"),
  ]),
  strain_consume: mod("strain_consume", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Strain Consume — maggot-gated health stacks (not always-on)"),
    line("range", "mod_panel", "multiplicative_percent", "Strain Consume: range \u2014 Dead Maggots within 10m are consumed, increasing Max Health by 4% and increasing\u2026 (arsenal display only)"),
  ]),
  streamline_r3: mod("streamline_r3", [
    line("abilityEfficiency", "warframe_totals", "multiplicative_percent", "Streamline: abilityEfficiency \u2014 +12% Ability Efficiency"),
  ]),
  streamlined_form: mod("streamlined_form", [
    line("slideFriction", "mod_panel", "multiplicative_percent", "Streamlined Form: slideFriction \u2014 +30% Slide, -30% Friction"),
    line("slideSpeed", "mod_panel", "multiplicative_percent", "Streamlined Form: slideSpeed \u2014 +30% Slide, -30% Friction"),
  ]),
  stretch_r3: mod("stretch_r3", [
    line("abilityRange", "warframe_totals", "multiplicative_percent", "Stretch: abilityRange \u2014 +45% Ability Range"),
  ]),
  summoners_wrath: mod("summoners_wrath", [
    line("damage", "mod_panel", "multiplicative_percent", "Summoner's Wrath: damage \u2014 Squad receives 75% Companion and Summon Damage"),
  ]),
  sure_footed_r5: mod("sure_footed_r5", [
    line("knockdownResistance", "mod_panel", "multiplicative_percent", "Sure Footed: knockdownResistance \u2014 +90% Chance to Resist Knockdown"),
  ]),
  surplus_diverters: mod("surplus_diverters", [
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Surplus Diverters: energyOnKill \u2014 Gain +6 energy, upon replenishing shields completely after they have been deacti\u2026"),
  ]),
  swift_bite_r3: mod("swift_bite_r3", [
    line("abilityRange", "mod_panel", "multiplicative_percent", "Swift Bite: abilityRange \u2014 Ophidian Bite Augment: Reduce Ability Cooldowns by 4s when at least 4 enemies ar\u2026"),
    line("cooldown", "mod_panel", "multiplicative_percent", "Swift Bite: cooldown \u2014 Ophidian Bite Augment: Reduce Ability Cooldowns by 4s when at least 4 enemies ar\u2026"),
  ]),
  swift_momentum: mod("swift_momentum", [
    line("duration", "mod_panel", "multiplicative_percent", "Swift Momentum: duration \u2014 Squad receives +30% Heavy Attack Wind Up Speed and +6s Melee Combo Duration"),
    line("heavyAttackEfficiency", "mod_panel", "multiplicative_percent", "Swift Momentum: heavyAttackEfficiency \u2014 Squad receives +30% Heavy Attack Wind Up Speed and +6s Melee Combo Duration"),
  ]),
  synth_reflex_r3: mod("synth_reflex_r3", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Synth Reflex: bulletJump \u2014 On Equip:\\\\n+40% Bullet Jump for 2s"),
    line("duration", "mod_panel", "multiplicative_percent", "Synth Reflex: duration \u2014 On Equip:\\\\n+40% Bullet Jump for 2s"),
  ]),
  tactical_retreat: mod("tactical_retreat", [
    line("duration", "mod_panel", "multiplicative_percent", "Tactical Retreat: duration \u2014 On Low Health:\\\\n+10% Mobility for 4s"),
  ]),
  tek_collateral_r3: mod("tek_collateral_r3", [
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "Tek Collateral: criticalMultiplier \u2014 Increased Pistol Ammo recovery.\\\\n+100% Critical Damage when inside the Marked Z\u2026"),
  ]),
  tempered_bound: mod("tempered_bound", [
    line("parkourVelocity", "warframe_totals", "multiplicative_percent", "Tempered Bound: parkourVelocity \u2014 -10% Mobility, +30 Shield Capacity"),
    line("shield", "warframe_totals", "multiplicative_percent", "Tempered Bound: shield \u2014 -10% Mobility, +30 Shield Capacity"),
  ]),
  tharros_lethality: mod("tharros_lethality", [
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "Tharros Lethality: criticalMultiplier \u2014 Tharros Strike Augment: Increases Critical Damage by 100% on enemies you hit. Cr\u2026"),
  ]),
  the_relentless_lost: mod("the_relentless_lost", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "The Relentless Lost: abilityStrength \u2014 The Lost Augment: The Lost gains 35% Ability Strength and 15% Ability Efficiency\u2026"),
  ]),
  thiefs_wit: mod("thiefs_wit", [
    line("lootRadar", "mod_panel", "multiplicative_percent", "Thief's Wit: lootRadar \u2014 Minimap shows loot crates.\\\\n+42m Loot Radar"),
    line("range", "mod_panel", "multiplicative_percent", "Thief's Wit: range \u2014 Minimap shows loot crates.\\\\n+42m Loot Radar (arsenal display only)"),
  ]),
  thrall_pact: mod("thrall_pact", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Thrall Pact — Enthrall-gated primary damage × thralls × Strength (not always-on)"),
  ]),
  toxic_flight: mod("toxic_flight", [
    line("bulletJump", "mod_panel", "multiplicative_percent", "Toxic Flight: bulletJump \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_POIS\u2026"),
    line("toxin", "mod_panel", "multiplicative_percent", "Toxic Flight: toxin \u2014 +24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_POIS\u2026"),
  ]),
  transient_fortitude: mod("transient_fortitude", [
    line("abilityDuration", "warframe_totals", "multiplicative_percent", "Transient Fortitude: abilityDuration \u2014 +55% Ability Strength\\\\n-27.5% Ability Duration"),
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Transient Fortitude: abilityStrength \u2014 +55% Ability Strength\\\\n-27.5% Ability Duration"),
  ]),
  umbra_fiber: mod("umbra_fiber", [
    line("armor", "warframe_totals", "multiplicative_percent", "Umbral Fiber: armor \u2014 +55% Armor, +11% Tau Resistance"),
    line("tauResistance", "mod_panel", "multiplicative_percent", "Umbral Fiber: tauResistance \u2014 +55% Armor, +11% Tau Resistance"),
  ]),
  umbra_intensify: mod("umbra_intensify", [
    line("abilityStrength", "warframe_totals", "multiplicative_percent", "Umbral Intensify: abilityStrength \u2014 +4% Strength, +1% Tau Resistance per rank"),
    line("tauResistance", "mod_panel", "multiplicative_percent", "Umbral Intensify: tauResistance \u2014 +4% Strength, +1% Tau Resistance per rank"),
  ]),
  umbra_vitality: mod("umbra_vitality", [
    line("health", "warframe_totals", "multiplicative_percent", "Umbral Vitality: health \u2014 +44% Health, +11% Tau Resistance"),
    line("tauResistance", "mod_panel", "multiplicative_percent", "Umbral Vitality: tauResistance \u2014 +44% Health, +11% Tau Resistance"),
  ]),
  undying_will: mod("undying_will", [
    line("bleedoutReduction", "mod_panel", "multiplicative_percent", "Undying Will: bleedoutReduction \u2014 +42% Bleedout Reduction"),
  ]),
  untime_rift: mod("untime_rift", [
    line("range", "mod_panel", "multiplicative_percent", "Untime Rift: range \u2014 The Vast Untime Augment: Creates a Rift that connects to enemies suffering from \u2026"),
  ]),
  valence_formation: mod("valence_formation", [
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Valence Formation — duration panel; parallel elemental × rank (50–200%) + guaranteed status gated via sim (not always-on; not × Strength)"),
  ]),
  vampiric_grasp: mod("vampiric_grasp", [
    line("healthRegen", "mod_panel", "multiplicative_percent", "Vampiric Grasp: healthRegen \u2014 Grasp of Lohk Augment: When a stolen weapon deals damage to an enemy affected by\u2026"),
  ]),
  venomous_rise: mod("venomous_rise", [], "wiki: Venomous Rise \u2014 Toxin FX on Bullet Jump"),
  vigilante_pursuit: mod("vigilante_pursuit", [
    line("enemyRadar", "mod_panel", "multiplicative_percent", "Vigilante Pursuit: enemyRadar \u2014 +5m Enemy Radar per rank (Set)"),
    line("range", "mod_panel", "multiplicative_percent", "Vigilante Pursuit: range \u2014 +5m Enemy Radar per rank (Set) (arsenal display only)"),
  ]),
  vigilante_vigor: mod("vigilante_vigor", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Vigilante Vigor — shield recharge/delay (not capacity)"),
    line("shieldRecharge", "mod_panel", "multiplicative_percent", "Vigilante Vigor: shieldRecharge \u2014 +60% Shield Recharge, -30% Shield Recharge Delay"),
    line("shieldRechargeDelay", "mod_panel", "multiplicative_percent", "Vigilante Vigor: shieldRechargeDelay \u2014 +60% Shield Recharge, -30% Shield Recharge Delay"),
  ]),
  vigor_r5: mod("vigor_r5", [
    line("health", "warframe_totals", "multiplicative_percent", "Vigor: health \u2014 +50% Shield Capacity, +50% Health"),
    line("shield", "warframe_totals", "multiplicative_percent", "Vigor: shield \u2014 +50% Shield Capacity, +50% Health"),
  ]),

  vigorous_swap: mod("vigorous_swap", [
    line("damage", "mod_panel", "multiplicative_percent", "Vigorous Swap: damage \u2014 On Equip:\\\\n+165% Damage for 3s"),
    line("duration", "mod_panel", "multiplicative_percent", "Vigorous Swap: duration \u2014 On Equip:\\\\n+165% Damage for 3s"),
  ]),
  vital_systems_bypass: mod("vital_systems_bypass", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Vital Systems Bypass — regen + recharge delay (not capacity)"),
  ]),
  vitality_r3: mod("vitality_r3", [
    line("health", "warframe_totals", "multiplicative_percent", "Vitality: health \u2014 +100% Health"),
  ]),
  volatile_recompense: mod("volatile_recompense", [
    line("duration", "mod_panel", "multiplicative_percent", "Volatile Recompense: duration \u2014 Recompense Augment: Daggers whirl in a ring around Kullervo for 25s, slashing ne\u2026"),
  ]),
  voltaic_lance: mod("voltaic_lance", [], "wiki: Voltaic Lance \u2014 Electrical FX on Bullet Jump"),
  warm_coat: mod("warm_coat", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Warm Coat — environmental ice resistance (not capacity)"),
  ]),
  warriors_rest: mod("warriors_rest", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "Warrior's Rest: abilityStrength \u2014 Passive Augment: Umbra's Ability Strength increases by +15% but he no longer fig\u2026"),
  ]),
  worthy_comradery: mod("worthy_comradery", [
    line("criticalChance", "mod_panel", "multiplicative_percent", "Worthy Comradery: criticalChance \u2014 Squad receives +75% Weak Point Critical Chance"),
  ]),
  wrath_of_ukko: mod("wrath_of_ukko", [
    line("duration", "mod_panel", "multiplicative_percent", "Wrath Of Ukko: duration \u2014 Storm of Ukko Augment: Wrathful Advance moves the storm of daggers to the telepo\u2026"),
  ]),
};
