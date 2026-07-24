/**
 * Per-mod verified behaviors — category: augment (273 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py augment
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_AUGMENT: Record<string, VerifiedModBehavior> = {
  abundant_mutation: mod("abundant_mutation", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Abundant Mutation: cooldown \u2014 Passive Augment: Nidus gains an additional 300 max stacks of Mutation (500 total\u2026"),
    line("mutationStackBonus", "mod_panel", "multiplicative_percent", "Abundant Mutation: mutationStackBonus \u2014 Passive Augment: Nidus gains an additional 300 max stacks of Mutation (500 total\u2026"),
  ]),
  acid_shells: mod("acid_shells", [
    line("health", "mod_panel", "multiplicative_percent", "Acid Shells: health \u2014 Enemies explode on death, dealing 450 <DT_CORROSIVE_COLOR>Corrosive Damage (+45%\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Acid Shells: range \u2014 Enemies explode on death, dealing 450 <DT_CORROSIVE_COLOR>Corrosive Damage (+45%\u2026"),
  ]),
  aegis_gale: mod("aegis_gale", [
    line("damage", "mod_panel", "multiplicative_percent", "Aegis Gale: damage \u2014 Aegis Storm Augment: Balefire has an Alternate Fire during Aegis Storm. The blas\u2026"),
  ]),
  afterburner: mod("afterburner", [
    line("duration", "mod_panel", "multiplicative_percent", "Afterburner: duration \u2014 Core Vent Augment: Blast damage ignites exhaust fumes for 12s. Enemies passing t\u2026"),
    line("heatDamage", "mod_panel", "multiplicative_percent", "Afterburner: heatDamage \u2014 Core Vent Augment: Blast damage ignites exhaust fumes for 12s. Enemies passing t\u2026"),
    line("igniteDuration", "mod_panel", "multiplicative_percent", "Afterburner: igniteDuration \u2014 Core Vent Augment: Blast damage ignites exhaust fumes for 12s. Enemies passing t\u2026"),
  ]),
  airburst_rounds: mod("airburst_rounds", [
    line("duration", "mod_panel", "multiplicative_percent", "Airburst Rounds: duration \u2014 Airburst Augment: Each enemy hit by Airburst increases secondary damage by 40% f\u2026"),
  ]),
  amalgam_argonak_metal_auger: mod("amalgam_argonak_metal_auger", [
    line("punchThrough", "mod_panel", "multiplicative_percent", "Amalgam Argonak Metal Auger: punchThrough \u2014 +3 Punch Through, Damage from Daggers reduces Armor by 6.\\\\n<LINE_SEPARATOR>\\\\nE\u2026"),
  ]),
  amalgam_daikyu_target_acquired: mod("amalgam_daikyu_target_acquired", [
    line("headshotMultiplier", "mod_panel", "multiplicative_percent", "Amalgam Daikyu Target Acquired: headshotMultiplier \u2014 +75% to Headshot Multiplier, +3% Life Steal on Nikanas, <LINE_SEPARATOR>\\\\n60% c\u2026"),
    line("lifeSteal", "mod_panel", "multiplicative_percent", "Amalgam Daikyu Target Acquired: lifeSteal \u2014 +75% to Headshot Multiplier, +3% Life Steal on Nikanas, <LINE_SEPARATOR>\\\\n60% c\u2026"),
  ]),
  amalgam_furax_body_count: mod("amalgam_furax_body_count", [
    line("comboDuration", "weapon_dps", "additive_percent", "wiki: Amalgam Furax Body Count — +15s Combo Duration on melee"),
    line("fireRate", "mod_panel", "multiplicative_percent", "wiki: Amalgam Furax — +45% Secondary FR via linkage.meleeMods (Sim5 cross-slot)"),
    line("blastStaggerRadius", "mod_panel", "multiplicative_percent", "wiki: Amalgam Furax — melee-kill Blast proc + stagger radius (15m at R5; not Ability Duration)"),
  ]),
  amalgam_javlok_magazine_warp: mod("amalgam_javlok_magazine_warp", [
    line("comboCountChance", "mod_panel", "multiplicative_percent", "Amalgam Javlok Magazine Warp: comboCountChance \u2014 shield-block gated"),
    line("magazine", "weapon_dps", "multiplicative_percent", "wiki: Amalgam Javlok Magazine Warp — +45% Magazine Capacity"),
    line("shield", "mod_panel", "multiplicative_percent", "Amalgam Javlok Magazine Warp: shield \u2014 block-gated combo chance display"),
  ]),
  amalgam_ripkas_true_steel: mod("amalgam_ripkas_true_steel", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Amalgam Ripkas True Steel — +187% Critical Chance on melee"),
    line("reloadSpeed", "mod_panel", "multiplicative_percent", "wiki: Amalgam Ripkas — +20% Shotgun reload via linkage.meleeMods (Sim5 cross-slot)"),
  ]),
  anchored_glide: mod("anchored_glide", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "Anchored Glide: abilityStrength \u2014 Disable Zephyr's reduced airborne gravity. Increase Ability Strength by 15%."),
  ]),
  antimatter_mine: mod("antimatter_mine", [
    line("duration", "mod_panel", "multiplicative_percent", "Antimatter Mine: duration \u2014 Antimatter Drop Augment: Creates a fully charged stationary orb that explodes af\u2026"),
  ]),
  augment_ash_rising_storm: mod("augment_ash_rising_storm", [
    line("comboDuration", "mod_panel", "multiplicative_percent", "Rising Storm: comboDuration \u2014 Blade Storm Augment: Blade Storm attacks increase your Ability Combo Counter by \u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Rising Storm: duration \u2014 Blade Storm Augment: Blade Storm attacks increase your Ability Combo Counter by \u2026"),
  ]),
  augment_ash_safeguard_switch: mod("augment_ash_safeguard_switch", [
    line("duration", "mod_panel", "multiplicative_percent", "Safeguard Switch: duration \u2014 Switch Teleport Augment: Switch with an enemy for 3s invulnerability. Switch wit\u2026"),
    line("invulnerabilityDuration", "mod_panel", "multiplicative_percent", "Safeguard Switch: invulnerabilityDuration \u2014 Switch Teleport Augment: Switch with an enemy for 3s invulnerability. Switch wit\u2026"),
  ]),
  augment_ash_seeking_shuriken: mod("augment_ash_seeking_shuriken", [
    line("armorReduction", "mod_panel", "multiplicative_percent", "Seeking Shuriken: armorReduction \u2014 Shuriken Augment: Hits expose weaknesses on enemies, reducing their Armor by 70%\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Seeking Shuriken: duration \u2014 Shuriken Augment: Hits expose weaknesses on enemies, reducing their Armor by 70%\u2026"),
  ]),
  augment_ash_smoke_shadow: mod("augment_ash_smoke_shadow", [
    line("allyStealth", "mod_panel", "multiplicative_percent", "Smoke Shadow: allyStealth \u2014 Smoke Screen Augment: Conceals allies within 15m and grants 150% Critical Chance\u2026"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Smoke Shadow — Smoke Screen-gated weapon CC (not × Strength; not always-on)"),
    line("range", "mod_panel", "multiplicative_percent", "Smoke Shadow: range \u2014 Smoke Screen Augment: Conceals allies within 15m and grants 150% Critical Chance\u2026"),
  ]),
  augment_atlas_ore_gaze: mod("augment_atlas_ore_gaze", [
    line("oreChance", "mod_panel", "multiplicative_percent", "Ore Gaze: oreChance \u2014 Petrify Augment: Petrified enemies are scanned into the Codex and have a 25% cha\u2026"),
  ]),
  augment_atlas_path_of_statues: mod("augment_atlas_path_of_statues", [
    line("duration", "mod_panel", "multiplicative_percent", "Path of Statues: duration \u2014 Landslide Augment: Leave a trail for 12s that petrifies enemies for 6s."),
    line("petrifyTrail", "mod_panel", "multiplicative_percent", "Path of Statues: petrifyTrail \u2014 Landslide Augment: Leave a trail for 12s that petrifies enemies for 6s."),
  ]),
  augment_atlas_rumbled: mod("augment_atlas_rumbled", [
    line("damage", "mod_panel", "multiplicative_percent", "Rumbled: damage \u2014 Rumblers Augment: Atlas becomes a Rumbler with Rock Armor that grants Overguard \u2026"),
    line("rumbleDuration", "mod_panel", "multiplicative_percent", "Rumbled: rumbleDuration \u2014 Rumblers Augment: Atlas becomes a Rumbler with Rock Armor that grants Overguard \u2026"),
  ]),
  augment_atlas_tectonic_fracture: mod("augment_atlas_tectonic_fracture", [
    line("extraWalls", "mod_panel", "multiplicative_percent", "Tectonic Fracture: extraWalls \u2014 Tectonics Augment: Create up to 3 walls with 100% Health. Walls can no longer be\u2026"),
    line("health", "mod_panel", "multiplicative_percent", "Tectonic Fracture: health \u2014 Tectonics Augment: Create up to 3 walls with 100% Health. Walls can no longer be\u2026"),
  ]),
  augment_banshee_resonance: mod("augment_banshee_resonance", [
    line("markDuration", "mod_panel", "multiplicative_percent", "Resonance: markDuration \u2014 Sonar Augment: Killing an enemy by shooting their weak spot will trigger another\u2026"),
  ]),
  augment_banshee_resonating_quake: mod("augment_banshee_resonating_quake", [
    line("quakeDamage", "mod_panel", "multiplicative_percent", "Resonating Quake: quakeDamage \u2014 Sound Quake Augment: Forgoes channeling to create a shockwave that deals 20x Dam\u2026"),
  ]),
  augment_banshee_silence_savage: mod("augment_banshee_silence_savage", [
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Savage Silence: finisherDamage \u2014 Silence Augment: Silence staggers enemies and Finisher damage is increased by 30\u2026"),
  ]),
  augment_banshee_sonic_fracture: mod("augment_banshee_sonic_fracture", [
    line("armorReduction", "mod_panel", "multiplicative_percent", "Sonic Fracture: armorReduction \u2014 Sonic Boom Augment: Enemy Armor is reduced by 70%."),
  ]),
  augment_baruuk_elusive_retribution: mod("augment_baruuk_elusive_retribution", [
    line("duration", "mod_panel", "multiplicative_percent", "Elusive Retribution: duration \u2014 Elude Augment: Every attack Baruuk Eludes increases his Melee Attack Speed and M\u2026"),
    line("evasionToDamage", "mod_panel", "multiplicative_percent", "Elusive Retribution: evasionToDamage \u2014 Elude Augment: Every attack Baruuk Eludes increases his Melee Attack Speed and M\u2026"),
  ]),
  augment_baruuk_endless_lull: mod("augment_baruuk_endless_lull", [
    line("lullDuration", "mod_panel", "multiplicative_percent", "Endless Lull: lullDuration \u2014 +3s Lull duration per rank"),
  ]),
  augment_baruuk_reactive_storm: mod("augment_baruuk_reactive_storm", [
    line("statusChance", "mod_panel", "multiplicative_percent", "Reactive Storm: statusChance \u2014 Serene Storm Augment: Desert Wind is granted +250% Status Chance and changes its\u2026"),
  ]),

  augment_chroma_afterburn: mod("augment_chroma_afterburn", [
    line("damagePerSecondActive", "mod_panel", "multiplicative_percent", "Afterburn: damagePerSecondActive \u2014 Spectral Scream Augment: Upon deactivation, Chroma will launch an elemental proj\u2026"),
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Afterburn: explosionDamage \u2014 Spectral Scream Augment: Upon deactivation, Chroma will launch an elemental proj\u2026"),
    line("totalDamageCap", "mod_panel", "multiplicative_percent", "Afterburn: totalDamageCap \u2014 Spectral Scream Augment: Upon deactivation, Chroma will launch an elemental proj\u2026"),
  ]),
  augment_chroma_everlasting_ward: mod("augment_chroma_everlasting_ward", [
    line("allyDuration", "mod_panel", "multiplicative_percent", "Everlasting Ward: allyDuration \u2014 Elemental Ward Augment: Allies that leave the radius will retain the effect for \u2026"),
  ]),
  augment_chroma_guided_effigy: mod("augment_chroma_guided_effigy", [
    line("moveEffigy", "mod_panel", "multiplicative_percent", "Guided Effigy: moveEffigy \u2014 Effigy Augment: Cast and hold to make Effigy move to your aim point. Deals 4000 \u2026"),
  ]),
  augment_chroma_vexing_retaliation: mod("augment_chroma_vexing_retaliation", [
    line("range", "mod_panel", "multiplicative_percent", "Vexing Retaliation: range \u2014 Vex Armor Augment: Taking 150 Damage will trigger a 9m burst. Shield damage will\u2026"),
    line("retaliationChance", "mod_panel", "multiplicative_percent", "Vexing Retaliation: retaliationChance \u2014 Vex Armor Augment: Taking 150 Damage will trigger a 9m burst. Shield damage will\u2026"),
  ]),

  augment_ember_exothermic: mod("augment_ember_exothermic", [
    line("energy", "mod_panel", "multiplicative_percent", "Exothermic: energy \u2014 Inferno Augment: Enemies killed while under the effect of Inferno have a 15% cha\u2026"),
    line("energyOrbChance", "mod_panel", "multiplicative_percent", "Exothermic: energyOrbChance \u2014 Inferno Augment: Enemies killed while under the effect of Inferno have a 15% cha\u2026"),
  ]),
  augment_ember_fire_fright: mod("augment_ember_fire_fright", [
    line("panicChance", "mod_panel", "multiplicative_percent", "Fire Fright: panicChance \u2014 +25% chance to panic enemies per rank"),
  ]),
  augment_ember_fireball_frenzy: mod("augment_ember_fireball_frenzy", [
    line("allyCast", "mod_panel", "multiplicative_percent", "Fireball Frenzy: allyCast \u2014 Fireball Augment: Hold to cast will grant all allies within 15m an additional 10\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Fireball Frenzy — Fireball-gated parallel Heat × Strength (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Fireball Frenzy: duration \u2014 Fireball Augment: Hold to cast will grant all allies within 15m an additional 10\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Fireball Frenzy: range \u2014 Fireball Augment: Hold to cast will grant all allies within 15m an additional 10\u2026"),
  ]),
  augment_ember_flash_accelerant: mod("augment_ember_flash_accelerant", [
    line("castSpeedBonus", "mod_panel", "multiplicative_percent", "Flash Accelerant: castSpeedBonus \u2014 Immolation grants +25% Cast Speed per rank"),
  ]),
  augment_ember_healing_flame: mod("augment_ember_healing_flame", [
    line("healthOnImmolation", "mod_panel", "multiplicative_percent", "Healing Flame: healthOnImmolation \u2014 Fire Blast Augment: Each enemy hit heals by 25 to 50 depending on current Immola\u2026"),
  ]),
  augment_equinox_calm_frenzy: mod("augment_equinox_calm_frenzy", [
    line("castSpeed", "mod_panel", "multiplicative_percent", "Calm & Frenzy: castSpeed \u2014 Rest & Rage Augment: Killing an affected enemy causes the effect to spread to en\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Calm & Frenzy: range \u2014 Rest & Rage Augment: Killing an affected enemy causes the effect to spread to en\u2026"),
  ]),
  augment_equinox_duality: mod("augment_equinox_duality", [
    line("damage", "mod_panel", "multiplicative_percent", "Duality: damage \u2014 Metamorphosis Augment: Equinox's other half breaks free for 10s, dealing 300% Da\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Duality: duration \u2014 Metamorphosis Augment: Equinox's other half breaks free for 10s, dealing 300% Da\u2026"),
    line("specterDuration", "mod_panel", "multiplicative_percent", "Duality: specterDuration \u2014 Metamorphosis Augment: Equinox's other half breaks free for 10s, dealing 300% Da\u2026"),
  ]),
  augment_equinox_energy_transfer: mod("augment_equinox_energy_transfer", [
    line("energyOnBurst", "mod_panel", "multiplicative_percent", "Energy Transfer: energyOnBurst \u2014 Mend & Maim Augment: 100% of charge is conserved when switching between forms."),
  ]),
  augment_excalibur_chromatic_blade: mod("augment_excalibur_chromatic_blade", [
    line("statusChance", "mod_panel", "multiplicative_percent", "Chromatic Blade: statusChance \u2014 Exalted Blade Augment: Exalted Blade's Damage Type changes depending on Excalibu\u2026"),
  ]),
  augment_excalibur_furious_javelin: mod("augment_excalibur_furious_javelin", [
    line("duration", "mod_panel", "multiplicative_percent", "Furious Javelin: duration \u2014 Radial Javelin Augment: Each enemy hit will increase Excalibur's Melee Damage by\u2026"),
    line("meleeDamagePerEnemy", "mod_panel", "multiplicative_percent", "wiki: Furious Javelin — Radial Javelin-gated melee damage mult × enemies × Strength (not always-on)"),
  ]),
  augment_excalibur_radiant_finish: mod("augment_excalibur_radiant_finish", [
    line("damage", "mod_panel", "multiplicative_percent", "Radiant Finish: damage \u2014 Radial Blind Augment: Blinded enemies take 300% more Finisher Damage."),
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Radiant Finish: finisherDamage \u2014 Radial Blind Augment: Blinded enemies take 300% more Finisher Damage."),
    line("finisherDamageBonus", "mod_panel", "multiplicative_percent", "Radiant Finish: finisherDamageBonus \u2014 Radial Blind Augment: Blinded enemies take 300% more Finisher Damage."),
  ]),
  augment_excalibur_surging_dash: mod("augment_excalibur_surging_dash", [
    line("comboPerHit", "mod_panel", "multiplicative_percent", "Surging Dash: comboPerHit \u2014 Slash Dash Augment: Each enemy hit during Slash Dash further increases your Mele\u2026"),
  ]),
  augment_frost_chilling_globe: mod("augment_frost_chilling_globe", [
    line("duration", "mod_panel", "multiplicative_percent", "Chilling Globe: duration \u2014 Snow Globe Augment: Enemies that enter have a 50% chance to become frozen solid \u2026"),
    line("freezeChance", "mod_panel", "multiplicative_percent", "Chilling Globe: freezeChance \u2014 Snow Globe Augment: Enemies that enter have a 50% chance to become frozen solid \u2026"),
  ]),
  augment_frost_freeze_force: mod("augment_frost_freeze_force", [
    line("allyColdDamage", "mod_panel", "multiplicative_percent", "Freeze Force: allyColdDamage \u2014 Freeze Augment: Hold to cast will grant all allies within 15m an additional 100%\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Freeze Force — Freeze-gated parallel Cold × Strength (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Freeze Force: duration \u2014 Freeze Augment: Hold to cast will grant all allies within 15m an additional 100%\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Freeze Force: range \u2014 Freeze Augment: Hold to cast will grant all allies within 15m an additional 100%\u2026"),
  ]),
  augment_frost_ice_wave_impedance: mod("augment_frost_ice_wave_impedance", [
    line("duration", "mod_panel", "multiplicative_percent", "Ice Wave Impedance: duration \u2014 Ice Wave Augment: Create a frozen trail for 12 seconds. Enemies that touch it ar\u2026"),
    line("slowDuration", "mod_panel", "multiplicative_percent", "Ice Wave Impedance: slowDuration \u2014 Ice Wave Augment: Create a frozen trail for 12 seconds. Enemies that touch it ar\u2026"),
  ]),
  augment_frost_icy_avalanche: mod("augment_frost_icy_avalanche", [
    line("allyOverguard", "mod_panel", "multiplicative_percent", "Icy Avalanche: allyOverguard \u2014 Avalanche Augment: Allies within Affinity Range are coated in ice that grants 60\u2026"),
    line("armor", "mod_panel", "multiplicative_percent", "Icy Avalanche: armor \u2014 Avalanche Augment: Allies within Affinity Range are coated in ice that grants 60\u2026"),
  ]),
  augment_gara_mending_splinters: mod("augment_gara_mending_splinters", [
    line("healthRegen", "mod_panel", "multiplicative_percent", "Mending Splinters: healthRegen \u2014 Splinter Storm Augment: For each target affected, Splinter Storm heals 15 Health\u2026"),
  ]),
  augment_gara_spectrosiphon: mod("augment_gara_spectrosiphon", [
    line("energy", "mod_panel", "multiplicative_percent", "Spectrosiphon: energy \u2014 Spectrorage Augment: Enemies that die within Spectrorage have a 50% chance to dr\u2026"),
    line("energyOnKill", "mod_panel", "multiplicative_percent", "Spectrosiphon: energyOnKill \u2014 Spectrorage Augment: Enemies that die within Spectrorage have a 50% chance to dr\u2026"),
  ]),
  augment_garuda_blending_talons: mod("augment_garuda_blending_talons", [
    line("comboCountChance", "mod_panel", "multiplicative_percent", "Blending Talons: comboCountChance \u2014 Seeking Talons Augment: Tap to perform a 9m AoE around Garuda. Garuda's Talons g\u2026"),
    line("comboPerHit", "mod_panel", "multiplicative_percent", "Blending Talons: comboPerHit \u2014 Seeking Talons Augment: Tap to perform a 9m AoE around Garuda. Garuda's Talons g\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Blending Talons: range \u2014 Seeking Talons Augment: Tap to perform a 9m AoE around Garuda. Garuda's Talons g\u2026"),
    line("slash", "mod_panel", "multiplicative_percent", "Blending Talons: slash \u2014 Seeking Talons Augment: Tap to perform a 9m AoE around Garuda. Garuda's Talons g\u2026"),
  ]),
  augment_garuda_blood_forge: mod("augment_garuda_blood_forge", [
    line("reloadSpeed", "mod_panel", "multiplicative_percent", "Blood Forge: reloadSpeed \u2014 Bloodletting Augment: Garuda's equipped weapon is reloaded up to 100%."),
  ]),

  augment_garuda_dread_ward: mod("augment_garuda_dread_ward", [
    line("duration", "mod_panel", "multiplicative_percent", "Dread Ward: duration \u2014 Dread Mirror Augment: Become unkillable for 8s when Dread Mirror kills a target \u2026"),
    line("invulnerability", "mod_panel", "multiplicative_percent", "Dread Ward: invulnerability \u2014 Dread Mirror Augment: Become unkillable for 8s when Dread Mirror kills a target \u2026"),
  ]),
  augment_gauss_mach_crash: mod("augment_gauss_mach_crash", [
    line("range", "mod_panel", "multiplicative_percent", "Mach Crash: range \u2014 Mach Rush Augment: Impact shockwave leaves behind a vacuum that sucks in enemies\u2026"),
    line("shockwaveOnStop", "mod_panel", "multiplicative_percent", "Mach Crash: shockwaveOnStop \u2014 Mach Rush Augment: Impact shockwave leaves behind a vacuum that sucks in enemies\u2026"),
  ]),
  augment_gauss_thermal_transfer: mod("augment_gauss_thermal_transfer", [
    line("coldToAlly", "mod_panel", "multiplicative_percent", "Thermal Transfer: coldToAlly \u2014 Thermal Sunder Augment: Allies in range gain 75% bonus Elemental Damage for 30s."),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Thermal Transfer — Thermal Sunder-gated parallel Cold/Heat/Blast × Strength (polarity via sim)"),
    line("duration", "mod_panel", "multiplicative_percent", "Thermal Transfer: duration \u2014 Thermal Sunder Augment: Allies in range gain 75% bonus Elemental Damage for 30s."),
  ]),
  augment_grendel_catapult: mod("augment_grendel_catapult", [
    line("launchSpeed", "mod_panel", "multiplicative_percent", "Catapult: launchSpeed \u2014 Pulverize Augment:  to launch Grendel in your aim direction. Costs 5. Crouch to \u2026"),
  ]),
  augment_grendel_gourmand: mod("augment_grendel_gourmand", [
    line("armorPerHit", "mod_panel", "multiplicative_percent", "Gourmand: armorPerHit \u2014 Feast Augment: Instead of Energy, consumes 200 Health on cast. Glutton grants an\u2026"),
  ]),
  augment_grendel_hearty_nourishment: mod("augment_grendel_hearty_nourishment", [
    line("duration", "mod_panel", "multiplicative_percent", "Hearty Nourishment: duration \u2014 Nourish Augment: Clear Status Effects and gain 5s of Status Immunity for each vi\u2026"),
    line("immunityDuration", "mod_panel", "multiplicative_percent", "Hearty Nourishment: immunityDuration \u2014 Nourish Augment: Clear Status Effects and gain 5s of Status Immunity for each vi\u2026"),
  ]),
  augment_hildryn_balefire_surge: mod("augment_hildryn_balefire_surge", [
    line("explosionOnHit", "mod_panel", "multiplicative_percent", "Balefire Surge: explosionOnHit \u2014 Balefire Augment: Fully charged direct hits restore 250 Shield to Hildryn. Impac\u2026"),
  ]),
  augment_hildryn_pillage_aug: mod("augment_hildryn_pillage_aug", [
    line("heatDamage", "mod_panel", "multiplicative_percent", "Blazing Pillage: heatDamage \u2014 Pillage Augment: Enemies affected by Haven will be set ablaze for 200 Heat Damag\u2026"),
  ]),
  augment_hydroid_curative_undertow: mod("augment_hydroid_curative_undertow", [
    line("duration", "mod_panel", "multiplicative_percent", "Curative Undertow: duration \u2014 Undertow Augment: Allies can stand in the pool to regain 30% Health every 1.5s. \u2026"),
    line("healOnDrown", "mod_panel", "multiplicative_percent", "Curative Undertow: healOnDrown \u2014 Undertow Augment: Allies can stand in the pool to regain 30% Health every 1.5s. \u2026"),
    line("health", "mod_panel", "multiplicative_percent", "Curative Undertow: health \u2014 Undertow Augment: Allies can stand in the pool to regain 30% Health every 1.5s. \u2026"),
  ]),
  augment_hydroid_pilfering_swarm: mod("augment_hydroid_pilfering_swarm", [
    line("lootChance", "mod_panel", "multiplicative_percent", "Pilfering Swarm: lootChance \u2014 Tentacle Swarm Augment: Enemies held by tentacles have a 100% chance at addition\u2026"),
  ]),

  augment_hydroid_tidal_impunity: mod("augment_hydroid_tidal_impunity", [
    line("duration", "mod_panel", "multiplicative_percent", "Tidal Impunity: duration \u2014 Tidal Surge Augment: Clears Status Effects and grants 12s of Status Immunity for\u2026"),
    line("statusCure", "mod_panel", "multiplicative_percent", "Tidal Impunity: statusCure \u2014 Tidal Surge Augment: Clears Status Effects and grants 12s of Status Immunity for\u2026"),
  ]),
  augment_inaros_desiccation_curse: mod("augment_inaros_desiccation_curse", [
    line("sandShadowChance", "mod_panel", "multiplicative_percent", "Desiccation's Curse: sandShadowChance \u2014 Desiccation Augment: Killing a blinded enemy with a Finisher has a 100% chance t\u2026"),
  ]),
  augment_inaros_elemental_sandstorm: mod("augment_inaros_elemental_sandstorm", [
    line("damage", "mod_panel", "multiplicative_percent", "Elemental Sandstorm: damage \u2014 Sandstorm Augment: Sandstorm gains 50% Ability Range and has a 100% chance of in\u2026"),
    line("elementalChance", "mod_panel", "multiplicative_percent", "Elemental Sandstorm: elementalChance \u2014 Sandstorm Augment: Sandstorm gains 50% Ability Range and has a 100% chance of in\u2026"),
  ]),
  augment_inaros_negation_swarm: mod("augment_inaros_negation_swarm", [
    line("armor", "mod_panel", "multiplicative_percent", "Negation Swarm: armor \u2014 Scarab Swarm Augment: Scarab Armor protects Inaros from Status Effects, consumin\u2026"),
    line("statusProtection", "mod_panel", "multiplicative_percent", "Negation Swarm: statusProtection \u2014 Scarab Swarm Augment: Scarab Armor protects Inaros from Status Effects, consumin\u2026"),
  ]),
  augment_ivar_concentrated_arrow: mod("augment_ivar_concentrated_arrow", [
    line("criticalChance", "mod_panel", "multiplicative_percent", "Concentrated Arrow: criticalChance \u2014 Artemis Bow Augment: Fires a single arrow with +25% Base Critical Chance on full\u2026"),
    line("headshotExplosion", "mod_panel", "multiplicative_percent", "Concentrated Arrow: headshotExplosion \u2014 Artemis Bow Augment: Fires a single arrow with +25% Base Critical Chance on full\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Concentrated Arrow: range \u2014 Artemis Bow Augment: Fires a single arrow with +25% Base Critical Chance on full\u2026"),
  ]),
  augment_ivar_empowered_quiver: mod("augment_ivar_empowered_quiver", [
    line("critDamage", "mod_panel", "multiplicative_percent", "Empowered Quiver: critDamage \u2014 Quiver Augment: Dashwire grants allies 100% Critical Damage. Cloak arrow has a 1\u2026"),
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "Empowered Quiver: criticalMultiplier \u2014 Quiver Augment: Dashwire grants allies 100% Critical Damage. Cloak arrow has a 1\u2026"),
  ]),
  augment_ivar_infiltrate: mod("augment_ivar_infiltrate", [
    line("hackSpeed", "mod_panel", "multiplicative_percent", "Infiltrate: hackSpeed \u2014 Prowl Augment: Ivara is able to bypass laser barriers and gains 25% Movement Spe\u2026"),
  ]),
  augment_ivar_piercing_navigator: mod("augment_ivar_piercing_navigator", [
    line("punchThroughPerHit", "mod_panel", "multiplicative_percent", "Piercing Navigator: punchThroughPerHit \u2014 Navigator Augment: Each hit increases the projectile's Critical Chance by 50% up\u2026"),
  ]),

  augment_khora_accumulating_whipclaw: mod("augment_khora_accumulating_whipclaw", [
    line("comboOnHit", "mod_panel", "multiplicative_percent", "Accumulating Whipclaw: comboOnHit \u2014 Whipclaw Augment: Hitting 3 enemies will grant a 35% stacking Damage Bonus to su\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Accumulating Whipclaw: damage \u2014 Whipclaw Augment: Hitting 3 enemies will grant a 35% stacking Damage Bonus to su\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Accumulating Whipclaw: duration \u2014 Whipclaw Augment: Hitting 3 enemies will grant a 35% stacking Damage Bonus to su\u2026"),
  ]),
  augment_khora_pilfering_strangledome: mod("augment_khora_pilfering_strangledome", [
    line("lootChance", "mod_panel", "multiplicative_percent", "Pilfering Strangledome: lootChance \u2014 Strangledome Augment: Enemies held in Strangledome have a 65% chance of dropping\u2026"),
  ]),
  augment_khora_venari_bodyguard: mod("augment_khora_venari_bodyguard", [
    line("deathPrevention", "mod_panel", "multiplicative_percent", "Venari Bodyguard: deathPrevention \u2014 Venari Augment: Venari dies in Khora's place. Recovery timer increased to 150s. \u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Venari Bodyguard: duration \u2014 Venari Augment: Venari dies in Khora's place. Recovery timer increased to 150s. \u2026"),
  ]),

  augment_limbo_cataclysmic_continuum: mod("augment_limbo_cataclysmic_continuum", [
    line("duration", "mod_panel", "multiplicative_percent", "Cataclysmic Continuum: duration \u2014 Cataclysm Augment: Duration increased by 1s for each enemy killed."),
    line("durationPerKill", "mod_panel", "multiplicative_percent", "Cataclysmic Continuum: durationPerKill \u2014 Cataclysm Augment: Duration increased by 1s for each enemy killed."),
  ]),
  augment_limbo_rift_haven: mod("augment_limbo_rift_haven", [
    line("healInRift", "mod_panel", "multiplicative_percent", "Rift Haven: healInRift \u2014 Banish Augment: Allies banished to the rift will have 25% of their Maximum Healt\u2026"),
    line("health", "mod_panel", "multiplicative_percent", "Rift Haven: health \u2014 Banish Augment: Allies banished to the rift will have 25% of their Maximum Healt\u2026"),
  ]),
  augment_limbo_rift_torrent: mod("augment_limbo_rift_torrent", [
    line("damage", "mod_panel", "multiplicative_percent", "Rift Torrent: damage \u2014 Rift Surge Augment: Limbo deals 30% Extra Damage for each enemy affected by Rift\u2026"),
    line("damagePerEnemy", "mod_panel", "multiplicative_percent", "Rift Torrent: damagePerEnemy \u2014 Rift Surge Augment: Limbo deals 30% Extra Damage for each enemy affected by Rift\u2026"),
  ]),
  augment_loki_hushed_invisibility: mod("augment_loki_hushed_invisibility", [
    line("silenceMelee", "mod_panel", "multiplicative_percent", "Hushed Invisibility: silenceMelee \u2014 Invisibility Augment: Weapon noise is reduced by 100% while invisible."),
  ]),
  augment_loki_irradiating_disarm: mod("augment_loki_irradiating_disarm", [
    line("duration", "mod_panel", "multiplicative_percent", "Irradiating Disarm: duration \u2014 Radial Disarm Augment: Enemies will be affected by Radiation Status for 9s"),
    line("radiationChance", "mod_panel", "multiplicative_percent", "Irradiating Disarm: radiationChance \u2014 Radial Disarm Augment: Enemies will be affected by Radiation Status for 9s"),
  ]),

  augment_loki_savior_decoy: mod("augment_loki_savior_decoy", [
    line("deathPrevention", "mod_panel", "multiplicative_percent", "Savior Decoy: deathPrevention \u2014 Decoy Augment: If Loki takes fatal damage, Decoy absorbs the damage and swaps lo\u2026"),
  ]),
  augment_mag_counter_pulse: mod("augment_mag_counter_pulse", [
    line("disarmDuration", "mod_panel", "multiplicative_percent", "Counter Pulse: disarmDuration \u2014 Polarize Augment: Enemy weapons are jammed and robotics are disabled for 4s when\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Counter Pulse: duration \u2014 Polarize Augment: Enemy weapons are jammed and robotics are disabled for 4s when\u2026"),
  ]),
  augment_mag_fracturing_crush: mod("augment_mag_fracturing_crush", [
    line("armor", "mod_panel", "multiplicative_percent", "Fracturing Crush: armor \u2014 Crush Augment: Crush gains +50% casting speed. The armor of surviving enemies de\u2026"),
    line("armorReduction", "mod_panel", "multiplicative_percent", "Fracturing Crush: armorReduction \u2014 Crush Augment: Crush gains +50% casting speed. The armor of surviving enemies de\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Fracturing Crush: duration \u2014 Crush Augment: Crush gains +50% casting speed. The armor of surviving enemies de\u2026"),
  ]),
  augment_mag_magnetized_discharge: mod("augment_mag_magnetized_discharge", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Magnetized Discharge: explosionDamage \u2014 Magnetize Augment: Recast on the target to detonate. Enemies hit have a 50% chan\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Magnetized Discharge: range \u2014 Magnetize Augment: Recast on the target to detonate. Enemies hit have a 50% chan\u2026"),
  ]),
  augment_mag_sgreedy_pull: mod("augment_mag_sgreedy_pull", [
    line("lootPull", "mod_panel", "multiplicative_percent", "Greedy Pull: lootPull \u2014 Pull Augment: Adds 100% chance to pull pickups towards Mag."),
  ]),
  augment_mesa_ballistic_bullseye: mod("augment_mesa_ballistic_bullseye", [
    line("critChance", "mod_panel", "multiplicative_percent", "Ballistic Bullseye: critChance \u2014 Ballistic Battery Augment: The shot gains a +50% Final Critical Chance bonus, ba\u2026"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "Ballistic Bullseye: criticalChance \u2014 Ballistic Battery Augment: The shot gains a +50% Final Critical Chance bonus, ba\u2026"),
  ]),
  augment_mesa_mess_waltz: mod("augment_mesa_mess_waltz", [
    line("moveSpeed", "mod_panel", "multiplicative_percent", "Mesa's Waltz: moveSpeed \u2014 Peacemaker Augment: Mesa can move at 50% Speed while using Peacemaker."),
  ]),
  augment_mesa_muzzle_flash: mod("augment_mesa_muzzle_flash", [
    line("blindDuration", "mod_panel", "multiplicative_percent", "Muzzle Flash: blindDuration \u2014 Shooting Gallery Augment: After 6 kill assists by a player with Shooting Gallery\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Muzzle Flash: duration \u2014 Shooting Gallery Augment: After 6 kill assists by a player with Shooting Gallery\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Muzzle Flash: range \u2014 Shooting Gallery Augment: After 6 kill assists by a player with Shooting Gallery\u2026"),
  ]),
  augment_mesa_staggering_shield: mod("augment_mesa_staggering_shield", [
    line("reflectStagger", "mod_panel", "multiplicative_percent", "Staggering Shield: reflectStagger \u2014 Shatter Shield Augment: Reflected bullets have a chance to stagger enemies. The \u2026"),
  ]),
  augment_mirage_explosive_legerdemain: mod("augment_mirage_explosive_legerdemain", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Explosive Legerdemain: explosionDamage \u2014 Sleight of Hand Augment: Ammo and Orbs pickups are turned into proximity mines t\u2026"),
    line("statusChance", "mod_panel", "multiplicative_percent", "Explosive Legerdemain: statusChance \u2014 Sleight of Hand Augment: Ammo and Orbs pickups are turned into proximity mines t\u2026"),
  ]),
  augment_mirage_hall_of_malevolence: mod("augment_mirage_hall_of_malevolence", [
    line("damagePerKill", "mod_panel", "multiplicative_percent", "Hall of Malevolence: damagePerKill \u2014 Hall of Mirrors Augment: The damage of your doppelgangers is increased by 5% eve\u2026"),
  ]),
  augment_mirage_total_eclipse: mod("augment_mirage_total_eclipse", [
    line("allyShare", "mod_panel", "multiplicative_percent", "Total Eclipse: allyShare \u2014 Eclipse Augment: While active, allies within 15m benefit from Eclipse."),
    line("range", "mod_panel", "multiplicative_percent", "Total Eclipse: range \u2014 Eclipse Augment: While active, allies within 15m benefit from Eclipse."),
  ]),
  augment_nekros_creeping_terrify: mod("augment_nekros_creeping_terrify", [
    line("slowAfterFlee", "mod_panel", "multiplicative_percent", "Creeping Terrify: slowAfterFlee \u2014 Terrify Augment: Affected enemies have 60% reduced Movement Speed."),
  ]),
  augment_nekros_despoil: mod("augment_nekros_despoil", [
    line("healthCost", "mod_panel", "multiplicative_percent", "Despoil: healthCost \u2014 Desecrate Augment: No longer consumes Energy, but consumes 10 Health per corpse \u2026"),
  ]),
  augment_nekros_shield_of_shadows: mod("augment_nekros_shield_of_shadows", [
    line("damage", "mod_panel", "multiplicative_percent", "Shield of Shadows: damage \u2014 Shadows of the Dead Augment: Each Shadow within 50m take 6% of the Damage done t\u2026"),
    line("damageReductionPerShadow", "mod_panel", "multiplicative_percent", "Shield of Shadows: damageReductionPerShadow \u2014 Shadows of the Dead Augment: Each Shadow within 50m take 6% of the Damage done t\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Shield of Shadows: range \u2014 Shadows of the Dead Augment: Each Shadow within 50m take 6% of the Damage done t\u2026"),
  ]),
  augment_nekros_soul_survivor: mod("augment_nekros_soul_survivor", [
    line("allyRevive", "mod_panel", "multiplicative_percent", "Soul Survivor: allyRevive \u2014 Soul Punch Augment: Use on a downed ally to revive them with 30% Health."),
    line("health", "mod_panel", "multiplicative_percent", "Soul Survivor: health \u2014 Soul Punch Augment: Use on a downed ally to revive them with 30% Health."),
  ]),
  augment_nezha_pyroclastic_flow: mod("augment_nezha_pyroclastic_flow", [
    line("damage", "mod_panel", "multiplicative_percent", "Pyroclastic Flow: damage \u2014 Fire Walker Augment: Accumulate 250% of the damage Fire Walker deals, unleashing\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Pyroclastic Flow: duration \u2014 Fire Walker Augment: Accumulate 250% of the damage Fire Walker deals, unleashing\u2026"),
    line("fireballExplosion", "mod_panel", "multiplicative_percent", "Pyroclastic Flow: fireballExplosion \u2014 Fire Walker Augment: Accumulate 250% of the damage Fire Walker deals, unleashing\u2026"),
  ]),
  augment_nezha_reaping_chakram: mod("augment_nezha_reaping_chakram", [
    line("healthOrbChance", "mod_panel", "multiplicative_percent", "Reaping Chakram: healthOrbChance \u2014 Blazing Chakram Augment: Each enemy hit increases the ring's Damage by 2x and th\u2026"),
  ]),
  augment_nezha_safeguard: mod("augment_nezha_safeguard", [
    line("allyWard", "mod_panel", "multiplicative_percent", "Safeguard: allyWard \u2014 Warding Halo Augment: Can now be cast on allies with 50% effectiveness."),
  ]),

  augment_nova_antimatter_absorb: mod("augment_nova_antimatter_absorb", [
    line("absorbRadius", "mod_panel", "multiplicative_percent", "Antimatter Absorb: absorbRadius \u2014 Antimatter Drop Augment: Absorbs enemy bullets within 5m, increasing the power o\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Antimatter Absorb: range \u2014 Antimatter Drop Augment: Absorbs enemy bullets within 5m, increasing the power o\u2026"),
  ]),
  augment_nova_escape_velocity: mod("augment_nova_escape_velocity", [
    line("duration", "mod_panel", "multiplicative_percent", "Escape Velocity: duration \u2014 Worm Hole Augment: Allies that travel through wormhole gain a 50% Speed bonus fo\u2026"),
    line("speedOnTeleport", "mod_panel", "multiplicative_percent", "Escape Velocity: speedOnTeleport \u2014 Worm Hole Augment: Allies that travel through wormhole gain a 50% Speed bonus fo\u2026"),
  ]),
  augment_nova_molecular_fission: mod("augment_nova_molecular_fission", [
    line("slowWithoutSpeed", "mod_panel", "multiplicative_percent", "Molecular Fission: slowWithoutSpeed \u2014 Molecular Prime Augment: Enemies hit by Null Stars are primed. When killed, prim\u2026"),
  ]),
  augment_nova_neutron_star: mod("augment_nova_neutron_star", [
    line("range", "mod_panel", "multiplicative_percent", "Neutron Star: range \u2014 Null Star Augment: Particles deal 240 Heat Damage with guaranteed Status effect \u2026"),
    line("starExplosion", "mod_panel", "multiplicative_percent", "Neutron Star: starExplosion \u2014 Null Star Augment: Particles deal 240 Heat Damage with guaranteed Status effect \u2026"),
  ]),
  augment_nyx_assimilate: mod("augment_nyx_assimilate", [
    line("moveSpeed", "mod_panel", "multiplicative_percent", "Assimilate: moveSpeed \u2014 Absorb Augment: Nyx can use weapons during Absorb and its duration is infinite, \u2026"),
  ]),
  augment_nyx_chaos_sphere: mod("augment_nyx_chaos_sphere", [
    line("abilityDuration", "mod_panel", "multiplicative_percent", "Chaos Sphere: abilityDuration \u2014 Chaos Augment: Enemies entering the Effect Range will be inflicted with Chaos. E\u2026"),
    line("sphereDuration", "mod_panel", "multiplicative_percent", "Chaos Sphere: sphereDuration \u2014 Chaos Augment: Enemies entering the Effect Range will be inflicted with Chaos. E\u2026"),
  ]),
  augment_nyx_mind_freak: mod("augment_nyx_mind_freak", [
    line("attackSpeed", "mod_panel", "multiplicative_percent", "Mind Freak: attackSpeed \u2014 Mind Control Augment: Controlled target inflicts +1000% Damage and gains +25% Mo\u2026"),
    line("controlledDamage", "mod_panel", "multiplicative_percent", "Mind Freak: controlledDamage \u2014 Mind Control Augment: Controlled target inflicts +1000% Damage and gains +25% Mo\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Mind Freak: damage \u2014 Mind Control Augment: Controlled target inflicts +1000% Damage and gains +25% Mo\u2026"),
  ]),
  augment_nyx_pacifying_bolts: mod("augment_nyx_pacifying_bolts", [
    line("duration", "mod_panel", "multiplicative_percent", "Pacifying Bolts: duration \u2014 Psychic Bolts Augment: Throw an additional 3 force bolts with guaranteed Radiati\u2026"),
    line("stunDuration", "mod_panel", "multiplicative_percent", "Pacifying Bolts: stunDuration \u2014 Psychic Bolts Augment: Throw an additional 3 force bolts with guaranteed Radiati\u2026"),
  ]),
  augment_octavia_conductor: mod("augment_octavia_conductor", [
    line("spectraFollow", "mod_panel", "multiplicative_percent", "Conductor: spectraFollow \u2014 Resonator Augment: Reactivate the ability to command Resonator to move to your a\u2026"),
  ]),
  augment_octavia_partition_mallet: mod("augment_octavia_partition_mallet", [
    line("maxMallets", "mod_panel", "multiplicative_percent", "Partitioned Mallet: maxMallets \u2014 Mallet Augment: Create an additional Mallet with 20% reduced range."),
    line("range", "mod_panel", "multiplicative_percent", "Partitioned Mallet: range \u2014 Mallet Augment: Create an additional Mallet with 20% reduced range."),
  ]),




  augment_rhino_iron_shrapnel: mod("augment_rhino_iron_shrapnel", [
    line("damage", "mod_panel", "multiplicative_percent", "Iron Shrapnel: damage \u2014 Iron Skin Augment: Recasting Iron Skin will cause it to detonate, dealing 100% o\u2026"),
    line("recastExplosion", "mod_panel", "multiplicative_percent", "Iron Shrapnel: recastExplosion \u2014 Iron Skin Augment: Recasting Iron Skin will cause it to detonate, dealing 100% o\u2026"),
  ]),
  augment_rhino_ironclad_charge: mod("augment_rhino_ironclad_charge", [
    line("duration", "mod_panel", "multiplicative_percent", "Ironclad Charge: duration \u2014 Rhino Charge Augment: Each enemy hit increases Rhino's Armor Rating by 50% for 1\u2026"),
    line("ironSkinPerHit", "mod_panel", "multiplicative_percent", "Ironclad Charge: ironSkinPerHit \u2014 Rhino Charge Augment: Each enemy hit increases Rhino's Armor Rating by 50% for 1\u2026"),
  ]),
  augment_rhino_piercing_roar: mod("augment_rhino_piercing_roar", [
    line("armorReduction", "mod_panel", "multiplicative_percent", "Piercing Roar: armorReduction \u2014 Roar Augment: Roar gains +40% range. Enemies within 25m are knocked down and suf\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Piercing Roar: range \u2014 Roar Augment: Roar gains +40% range. Enemies within 25m are knocked down and suf\u2026"),
  ]),
  augment_rhino_reinforcing_stomp: mod("augment_rhino_reinforcing_stomp", [
    line("armorPerEnemy", "mod_panel", "multiplicative_percent", "Reinforcing Stomp: armorPerEnemy \u2014 Rhino Stomp Augment: Iron Skin Health is replenished by 4% for each enemy affect\u2026"),
  ]),
  // wiki R3 absolutes; Ability Strength/Range/Duration scale cloud via Toxic Lash miscStats panel
  augment_saryn_contagion_cloud: mod("augment_saryn_contagion_cloud", [
    line("toxinDamagePerSecond", "mod_panel", "flat", "Contagion Cloud: 300 Toxin Damage/s (R3; × Ability Strength on ability panel)"),
    line("duration", "mod_panel", "flat", "Contagion Cloud: 12s cloud duration (R3; × Ability Duration on ability panel)"),
    line("range", "mod_panel", "flat", "Contagion Cloud: 5m radius (R3; × Ability Range on ability panel)"),
  ]),

  augment_saryn_regenerative_molt: mod("augment_saryn_regenerative_molt", [
    line("duration", "mod_panel", "multiplicative_percent", "Regenerative Molt: duration \u2014 Molt Augment: After casting Molt, Saryn regenerates 50 Health/s for 10s."),
    line("healthRegen", "mod_panel", "multiplicative_percent", "Regenerative Molt: healthRegen \u2014 Molt Augment: After casting Molt, Saryn regenerates 50 Health/s for 10s."),
  ]),
  augment_saryn_revealing_spores: mod("augment_saryn_revealing_spores", [
    line("enemyRadar", "mod_panel", "multiplicative_percent", "Revealing Spores: enemyRadar \u2014 Spores Augment: Infected enemies within 40m appear on the minimap. +40 Enemy Rad\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Revealing Spores: range \u2014 Spores Augment: Infected enemies within 40m appear on the minimap. +40 Enemy Rad\u2026"),
  ]),
  augment_saryn_venom_dose: mod("augment_saryn_venom_dose", [
    line("allyCorrosiveDamage", "mod_panel", "multiplicative_percent", "Venom Dose: allyCorrosiveDamage \u2014 Spores Augment: Hold to cast will grant all allies within 15m an additional 100%\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Venom Dose — Spores-gated parallel Corrosive × Strength (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Venom Dose: duration \u2014 Spores Augment: Hold to cast will grant all allies within 15m an additional 100%\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Venom Dose: range \u2014 Spores Augment: Hold to cast will grant all allies within 15m an additional 100%\u2026"),
  ]),

  augment_titania_beguiling_lantern: mod("augment_titania_beguiling_lantern", [
    line("attractionRange", "mod_panel", "multiplicative_percent", "Beguiling Lantern: attractionRange \u2014 Lantern Augment: Attracted enemies take 100% more Weapon Damage."),
    line("damage", "mod_panel", "multiplicative_percent", "Beguiling Lantern: damage \u2014 Lantern Augment: Attracted enemies take 100% more Weapon Damage."),
    line("weaponDamageBonus", "mod_panel", "multiplicative_percent", "Beguiling Lantern: weaponDamageBonus \u2014 Lantern Augment: Attracted enemies take 100% more Weapon Damage."),
  ]),
  augment_titania_razorwing_blitz: mod("augment_titania_razorwing_blitz", [
    line("duration", "mod_panel", "multiplicative_percent", "Razorwing Blitz: duration \u2014 Razorwing Augment: Flight Speed increased by 25% and Fire Rate increased by 25% \u2026"),
    line("fireRate", "mod_panel", "multiplicative_percent", "wiki: Razorwing Blitz — Razorwing-gated FR/AS × stacks × Strength (Dex Pixia / Diwata; not always-on)"),
    line("flightSpeed", "mod_panel", "multiplicative_percent", "wiki: Razorwing Blitz — flight/sprint display (not weapon DPS)"),
    line("speedPerCast", "mod_panel", "multiplicative_percent", "Razorwing Blitz: speedPerCast \u2014 Razorwing Augment: Flight Speed increased by 25% and Fire Rate increased by 25% \u2026"),
  ]),
  augment_titania_spellbound_harvest: mod("augment_titania_spellbound_harvest", [
    line("abilityRange", "mod_panel", "multiplicative_percent", "Spellbound Harvest: abilityRange \u2014 Spellbind Augment: Hitting at least 4 enemies with Spellbind grants Titania 50. \u2026"),
    line("tributeEfficiency", "mod_panel", "multiplicative_percent", "Spellbound Harvest: tributeEfficiency \u2014 Spellbind Augment: Hitting at least 4 enemies with Spellbind grants Titania 50. \u2026"),
  ]),
  augment_trinity_abating_link: mod("augment_trinity_abating_link", [
    line("armorReduction", "mod_panel", "multiplicative_percent", "Abating Link: armorReduction \u2014 Link Augment: Reduces Armor Rating by 60% on enemies targeted by Link."),
  ]),

  augment_trinity_pool_of_life: mod("augment_trinity_pool_of_life", [
    line("energy", "mod_panel", "multiplicative_percent", "Pool of Life: energy \u2014 Well of Life Augment: On death, marked enemies will drop 4 Health Orbs with a 10\u2026"),
    line("healthOrbChance", "mod_panel", "multiplicative_percent", "Pool of Life: healthOrbChance \u2014 Well of Life Augment: On death, marked enemies will drop 4 Health Orbs with a 10\u2026"),
  ]),
  augment_trinity_vampire_leech: mod("augment_trinity_vampire_leech", [
    line("overshieldConversion", "mod_panel", "multiplicative_percent", "Vampire Leech: overshieldConversion \u2014 Energy Vampire Augment: Excess Energy replenishes Shields by 225%."),
  ]),
  augment_universal_energy_conversion: mod("augment_universal_energy_conversion", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "Energy Conversion: abilityStrength \u2014 Energy Orbs grant 50% more Ability Strength to your next cast."),
    line("strengthOnOrb", "mod_panel", "multiplicative_percent", "Energy Conversion: strengthOnOrb \u2014 Energy Orbs grant 50% more Ability Strength to your next cast."),
  ]),
  augment_universal_health_conversion: mod("augment_universal_health_conversion", [
    line("armorOnOrb", "mod_panel", "multiplicative_percent", "Health Conversion: armorOnOrb \u2014 Health Orbs grant 450 Armor, stacking up to 3x. Taking damage will consume a sta\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Health Conversion: duration \u2014 Health Orbs grant 450 Armor, stacking up to 3x. Taking damage will consume a sta\u2026"),
  ]),
  augment_universal_shattering_impact: mod("augment_universal_shattering_impact", [
    line("armorReduction", "mod_panel", "multiplicative_percent", "Shattering Impact: armorReduction \u2014 Impact Damage reduces enemy Armor by 6."),
  ]),
  augment_vauban_photon_repeater: mod("augment_vauban_photon_repeater", [
    line("extraCast", "mod_panel", "multiplicative_percent", "Photon Repeater: extraCast \u2014 Photon Strike Augment: If Photon Strike hits at least 5 enemies, the next cast w\u2026"),
  ]),
  augment_vauban_repelling_bastille: mod("augment_vauban_repelling_bastille", [
    line("repelChance", "mod_panel", "multiplicative_percent", "Repelling Bastille: repelChance \u2014 +25% chance to repel enemies per rank"),
  ]),
  augment_vauban_tesla_link: mod("augment_vauban_tesla_link", [
    line("linkDamageReduction", "mod_panel", "multiplicative_percent", "Tesla Link: linkDamageReduction \u2014 Tesla chains grant +15% Damage Reduction per rank"),
  ]),
  augment_volt_capacitance: mod("augment_volt_capacitance", [
    line("damage", "mod_panel", "multiplicative_percent", "Capacitance: damage \u2014 Discharge Augment: Converts 3% of Damage dealt into Shields split between Volt a\u2026"),
    line("shieldPerTarget", "mod_panel", "multiplicative_percent", "Capacitance: shieldPerTarget \u2014 Discharge Augment: Converts 3% of Damage dealt into Shields split between Volt a\u2026"),
  ]),
  augment_volt_reactive_storm: mod("augment_volt_reactive_storm", [
    line("damageIncrease", "mod_panel", "multiplicative_percent", "ReactivStorm: damageIncrease \u2014 Serene Storm Augment: Desert Wind is granted +250% Status Chance and changes its\u2026"),
    line("statusChance", "mod_panel", "multiplicative_percent", "ReactivStorm: statusChance \u2014 Serene Storm Augment: Desert Wind is granted +250% Status Chance and changes its\u2026"),
  ]),
  augment_volt_shock_trooper: mod("augment_volt_shock_trooper", [
    line("allyShockDamage", "mod_panel", "multiplicative_percent", "Shock Trooper: allyShockDamage \u2014 Shock Augment: Hold to cast will grant all allies within 15m an additional 100% \u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Shock Trooper — Shock-gated parallel Electricity × Strength (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Shock Trooper: duration \u2014 Shock Augment: Hold to cast will grant all allies within 15m an additional 100% \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Shock Trooper: range \u2014 Shock Augment: Hold to cast will grant all allies within 15m an additional 100% \u2026"),
  ]),
  augment_volt_shocking_speed: mod("augment_volt_shocking_speed", [
    line("dischargeDamage", "mod_panel", "multiplicative_percent", "Shocking Speed: dischargeDamage \u2014 Speed Augment: While moving under the effects of Speed, enemies within 3m will t\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Shocking Speed: range \u2014 Speed Augment: While moving under the effects of Speed, enemies within 3m will t\u2026"),
  ]),
  augment_volt_transistor_shield: mod("augment_volt_transistor_shield", [
    line("critChancePerShield", "mod_panel", "multiplicative_percent", "Transistor Shield: critChancePerShield \u2014 Electric Shield Augment: Allies can pick up Electric Shield. 300% of damage abso\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Transistor Shield: damage \u2014 Electric Shield Augment: Allies can pick up Electric Shield. 300% of damage abso\u2026"),
  ]),
  augment_wisp_critical_surge: mod("augment_wisp_critical_surge", [
    line("breachCritChance", "mod_panel", "multiplicative_percent", "Critical Surge: breachCritChance \u2014 Breach Surge Augment: Teleporting to a Reservoir costs 50% Energy and grants 10%\u2026"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Critical Surge — Breach Surge teleport-gated primary CC × meters × Strength (cap 250%; not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Critical Surge: duration \u2014 Breach Surge Augment: Teleporting to a Reservoir costs 50% Energy and grants 10%\u2026"),
  ]),
  augment_wisp_fused_reservoir: mod("augment_wisp_fused_reservoir", [
    line("combinedMote", "mod_panel", "multiplicative_percent", "Fused Reservoir: combinedMote \u2014 Reservoirs Augment: Adds a fourth reservoir that gives the effects of all three.\u2026"),
    line("energy", "mod_panel", "multiplicative_percent", "Fused Reservoir: energy \u2014 Reservoirs Augment: Adds a fourth reservoir that gives the effects of all three.\u2026"),
  ]),
  augment_wukong_celestial_stomp: mod("augment_wukong_celestial_stomp", [
    line("range", "mod_panel", "multiplicative_percent", "Celestial Stomp: range \u2014 Celestial Twin Augment: Hold to command the twin to perform a slam attack suspen\u2026"),
    line("stompRange", "mod_panel", "multiplicative_percent", "Celestial Stomp: stompRange \u2014 Celestial Twin Augment: Hold to command the twin to perform a slam attack suspen\u2026"),
  ]),
  augment_wukong_enveloping_cloud: mod("augment_wukong_enveloping_cloud", [
    line("allyInvisibility", "mod_panel", "multiplicative_percent", "Enveloping Cloud: allyInvisibility \u2014 Cloud Walker Augment: Allies within 4m of the cloud become invisible to enemies \u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Enveloping Cloud: duration \u2014 Cloud Walker Augment: Allies within 4m of the cloud become invisible to enemies \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Enveloping Cloud: range \u2014 Cloud Walker Augment: Allies within 4m of the cloud become invisible to enemies \u2026"),
  ]),
  augment_wukong_primal_rage: mod("augment_wukong_primal_rage", [
    line("critBonusPerKill", "mod_panel", "multiplicative_percent", "Primal Rage: critBonusPerKill \u2014 Primal Fury Augment: Killing an enemy increases Critical Chance by 15%. The incr\u2026"),
    line("critDecayPerSecond", "mod_panel", "multiplicative_percent", "Primal Rage: critDecayPerSecond \u2014 Primal Fury Augment: Killing an enemy increases Critical Chance by 15%. The incr\u2026"),
  ]),
  augment_yareli_merulina_guardian: mod("augment_yareli_merulina_guardian", [
    line("damageAbsorption", "mod_panel", "multiplicative_percent", "Merulina Guardian: damageAbsorption \u2014 Merulina Augment: Enemies eliminated during Sea Snares heal 20% of Merulina's he\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Merulina Guardian: duration \u2014 Merulina Augment: Enemies eliminated during Sea Snares heal 20% of Merulina's he\u2026"),
    line("fireRate", "mod_panel", "multiplicative_percent", "Merulina Guardian: fireRate \u2014 Merulina Augment: Enemies eliminated during Sea Snares heal 20% of Merulina's he\u2026"),
  ]),
  augment_yareli_surging_blades: mod("augment_yareli_surging_blades", [
    line("bladeDamage", "mod_panel", "multiplicative_percent", "Surging Blades: bladeDamage \u2014 Aquablades Augment: Activate Aquablades when the ability is in use or cooldown t\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Surging Blades: damage \u2014 Aquablades Augment: Activate Aquablades when the ability is in use or cooldown t\u2026"),
  ]),
  avenging_truth: mod("avenging_truth", [
    line("damage", "mod_panel", "multiplicative_percent", "Avenging Truth: damage \u2014 Blocking absorbs 50% of incoming damage, stored as Extra Damage for the next cha\u2026"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Avenging Truth: syndicatePower \u2014 Blocking absorbs 50% of incoming damage, stored as Extra Damage for the next cha\u2026"),
  ]),
  axios_javelineers: mod("axios_javelineers", [
    line("duration", "mod_panel", "multiplicative_percent", "Axios Javelineers: duration \u2014 Axios Javelin Augment: Spawns specters that throw two extra javelins with guaran\u2026"),
    line("vortexBonusOnHit", "mod_panel", "multiplicative_percent", "Axios Javelineers: vortexBonusOnHit \u2014 Axios Javelin Augment: Spawns specters that throw two extra javelins with guaran\u2026"),
    line("vortexDuration", "mod_panel", "multiplicative_percent", "Axios Javelineers: vortexDuration \u2014 Axios Javelin Augment: Spawns specters that throw two extra javelins with guaran\u2026"),
  ]),
  blade_of_truth: mod("blade_of_truth", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Blade Of Truth — +100% Melee Damage"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Blade Of Truth: syndicatePower \u2014 +1 'Truth'"),
  ]),
  blinding_reave: mod("blinding_reave", [
    line("duration", "mod_panel", "multiplicative_percent", "Blinding Reave: duration \u2014 Reave Augment: Reave gains +40% range and enemies are blinded by its fog for 10s\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Blinding Reave: range \u2014 Reave Augment: Reave gains +40% range and enemies are blinded by its fog for 10s\u2026"),
  ]),
  bright_purity: mod("bright_purity", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Bright Purity — +100% Melee Damage"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Bright Purity: syndicatePower \u2014 +1 'Purity'"),
  ]),
  bursting_mass: mod("bursting_mass", [
    line("damage", "mod_panel", "multiplicative_percent", "Bursting Mass: damage \u2014 The infested mass accumulates 200% of the damage that goes through it and deals \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Bursting Mass: range \u2014 The infested mass accumulates 200% of the damage that goes through it and deals \u2026"),
  ]),
  cathode_current: mod("cathode_current", [
    line("damage", "mod_panel", "multiplicative_percent", "Cathode Current: damage \u2014 Cathode Grace Augment: Eliminating an enemy while Cathode Grace is active will r\u2026"),
  ]),
  clip_delegation: mod("clip_delegation", [
    line("magazine", "mod_panel", "multiplicative_percent", "Clip Delegation: magazine \u2014 On Reload: Next Magazine has Status Chance and Multishot increased by 15% per sh\u2026"),
  ]),
  coil_recharge: mod("coil_recharge", [], "wiki: Coil Recharge \u2014 Coil Horizon Augment: Gyratory Sphere can be recalled. Enemies in its radius suffer 500 <DT_ELECTRICITY_COLOR> Electricity Damage and chain other enemies. Enemies pulled into detonation suffer additional discharges."),
  cold_snap: mod("cold_snap", [
    line("duration", "mod_panel", "multiplicative_percent", "Cold Snap: duration \u2014 Cosmic Crush Augment: The black hole saps the area of heat, freezing enemies in \u2026"),
  ]),
  conductive_sphere: mod("conductive_sphere", [
    line("damage", "mod_panel", "multiplicative_percent", "Conductive Sphere: damage \u2014 Arcsphere Augment: Projectiles that pass through Arcsphere have guaranteed <DT_E\u2026"),
    line("electricity", "mod_panel", "multiplicative_percent", "Conductive Sphere: electricity \u2014 Arcsphere Augment: Projectiles that pass through Arcsphere have guaranteed <DT_E\u2026"),
  ]),
  corroding_barrage: mod("corroding_barrage", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "Corroding Barrage: abilityStrength \u2014 Tempest Barrage Augment: Each projectile has a 100% chance of inflicting a Corro\u2026"),
  ]),
  dark_propagation: mod("dark_propagation", [
    line("range", "mod_panel", "multiplicative_percent", "Dark Propagation: range \u2014 Sow Augment: Enemies killed while inflicted with Sow spread its effect in a 15m \u2026"),
  ]),
  deadly_sequence: mod("deadly_sequence", [
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Deadly Sequence — +200% Critical Chance"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Deadly Sequence: syndicatePower \u2014 +1 'Sequence'"),
  ]),
  deceptive_bond: mod("deceptive_bond", [
    line("damage", "mod_panel", "multiplicative_percent", "Deceptive Bond: damage \u2014 Decoy Augment: 50% of damage Loki takes is transferred to Decoy, and vice versa."),
  ]),
  defiled_reckoning: mod("defiled_reckoning", [
    line("duration", "mod_panel", "multiplicative_percent", "Defiled Reckoning: duration \u2014 Reckoning Augment: Health Orbs become unusable by enemies for 10s."),
  ]),
  disarming_purity: mod("disarming_purity", [
    line("disarmChance", "mod_panel", "multiplicative_percent", "Disarming Purity: disarmChance \u2014 Secondary Fire mode has a 40% chance to disarm enemies., +1 'Purity'"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Disarming Purity: syndicatePower \u2014 Secondary Fire mode has a 40% chance to disarm enemies., +1 'Purity'"),
  ]),
  discharge_strike: mod("discharge_strike", [
    line("energyLeech", "mod_panel", "multiplicative_percent", "Discharge Strike: energyLeech \u2014 Soul Punch Augment: Depletes up to 25 Energy from the target."),
  ]),
  divebomb_vortex: mod("divebomb_vortex", [
    line("range", "mod_panel", "multiplicative_percent", "Divebomb Vortex: range \u2014 Dive Bomb Augment - Enemies within 12 meters of the point of impact are dragged into it."),
  ]),
  divine_retribution: mod("divine_retribution", [
    line("range", "mod_panel", "multiplicative_percent", "Divine Retribution: range \u2014 Divine Spears Augment: Status Effects spread to all speared enemies. Spear explo\u2026"),
  ]),
  efficient_beams: mod("efficient_beams", [
    line("statusChance", "mod_panel", "multiplicative_percent", "Efficient Beams: statusChance \u2014 Only consume ammo when dealing damage.\\\\n+150% Status Chance"),
  ]),
  electromagnetic_shielding: mod("electromagnetic_shielding", [
    line("damage", "mod_panel", "multiplicative_percent", "Electromagnetic Shielding: damage \u2014 While blocking, redirect 50% of damage taken by allies within 12m to yourself."),
    line("range", "mod_panel", "multiplicative_percent", "Electromagnetic Shielding: range \u2014 While blocking, redirect 50% of damage taken by allies within 12m to yourself."),
  ]),
  enduring_bastille: mod("enduring_bastille", [
    line("duration", "mod_panel", "multiplicative_percent", "Enduring Bastille: duration \u2014 Bastille Augment: Killing an enemy in Bastille extends the duration by 2s. Vorte\u2026"),
  ]),
  energy_field: mod("energy_field", [
    line("range", "mod_panel", "multiplicative_percent", "Energy Field: range \u2014 Energy Shell Augment: Energy Shell applies to allies within 140m."),
  ]),
  enraged: mod("enraged", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Enraged: cooldown \u2014 Hysteria Augment: Damage increased by 350%, Critical Chance increased by 350%. H\u2026"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "Enraged: criticalChance \u2014 Hysteria Augment: Damage increased by 350%, Critical Chance increased by 350%. H\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Enraged: duration \u2014 Hysteria Augment: Damage increased by 350%, Critical Chance increased by 350%. H\u2026"),
  ]),
  entropy_burst: mod("entropy_burst", [
    line("statusChance", "weapon_dps", "flat", "wiki: Entropy Burst — +20 Final Status Chance (after multiplicative SC)"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Entropy Burst: syndicatePower \u2014 +1 'Entropy'"),
  ]),
  entropy_detonation: mod("entropy_detonation", [
    line("damage", "mod_panel", "multiplicative_percent", "Entropy Detonation: damage \u2014 Lethal ground attacks cause enemies to explode dealing +1,000, (+20% Enemy Max H\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Entropy Detonation: range \u2014 Lethal ground attacks cause enemies to explode dealing +1,000, (+20% Enemy Max H\u2026"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Entropy Detonation: syndicatePower \u2014 Lethal ground attacks cause enemies to explode dealing +1,000, (+20% Enemy Max H\u2026"),
  ]),
  entropy_flight: mod("entropy_flight", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Entropy Flight: projectileSpeed \u2014 +140% Projectile Speed, +1 'Entropy'"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Entropy Flight: syndicatePower \u2014 +140% Projectile Speed, +1 'Entropy'"),
  ]),
  entropy_spike: mod("entropy_spike", [
    line("explosionChance", "mod_panel", "multiplicative_percent", "Entropy Spike: explosionChance \u2014 +20% Chance to Explode (Use with Caution), +1 'Entropy'"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Entropy Spike: syndicatePower \u2014 +20% Chance to Explode (Use with Caution), +1 'Entropy'"),
  ]),
  eroding_blight: mod("eroding_blight", [
    line("magazine", "weapon_dps", "multiplicative_percent", "wiki: Eroding Blight — +200% Magazine Capacity"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Eroding Blight: syndicatePower \u2014 +1 'Blight'"),
  ]),
  eternal_war: mod("eternal_war", [
    line("duration", "mod_panel", "multiplicative_percent", "Eternal War: duration \u2014 Warcry Augment: While active, Warcry's duration is increased by 2s for each Mele\u2026"),
  ]),
  exposing_harpoon: mod("exposing_harpoon", [
    line("criticalChance", "weapon_dps", "conditional_stat_on_trigger", "wiki: Exposing Harpoon — On Harpak pull: +300% Critical Chance for 15s (sim Trigger buffs)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Exposing Harpoon — buff duration"),
  ]),
  fatal_teleport: mod("fatal_teleport", [
    line("damage", "mod_panel", "multiplicative_percent", "Fatal Teleport: damage \u2014 Teleport Augment: Teleport will perform a Finisher on the target, dealing 200% E\u2026"),
  ]),
  firequake: mod("firequake", [
    line("knockdownChance", "mod_panel", "multiplicative_percent", "Firequake: knockdownChance \u2014 World On Fire Augment: Enemies caught in the flames have a chance to be knocked down."),
  ]),
  flux_overdrive: mod("flux_overdrive", [
    line("duration", "mod_panel", "multiplicative_percent", "Flux Overdrive: duration \u2014 Status Chance fluctuates between +150% and +250% over 5s while the beam is fired\u2026"),
    line("heat", "mod_panel", "multiplicative_percent", "Flux Overdrive: heat \u2014 Status Chance fluctuates between +150% and +250% over 5s while the beam is fired\u2026"),
  ]),
  fomorian_accelerant: mod("fomorian_accelerant", [
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "Fomorian Accelerant: projectileSpeed \u2014 Flak now bounces up to 4x and travels 60% faster."),
    line("ricochetBounces", "mod_panel", "multiplicative_percent", "Fomorian Accelerant: ricochetBounces \u2014 Flak now bounces up to 4x and travels 60% faster."),
  ]),
  funnel_clouds: mod("funnel_clouds", [
    line("abilityProjectileCount", "mod_panel", "multiplicative_percent", "Funnel Clouds: abilityProjectileCount \u2014 Tornado Augment: Creates 8 additional tornadoes. All tornadoes are 50% their original size and won't pick up enemies."),
  ]),
  fused_crucible: mod("fused_crucible", [], "wiki: Fused Crucible \u2014 Crucible Blast Augment: Becomes a channeled ability consuming <LOWER_IS_BETTER>20 <ENERGY> Energy/s that ramps up. While active Chyrinka Pillars trigger chain reactions and their duration is frozen. Mobility is greatly reduced."),
  gastro: mod("gastro", [
    line("duration", "mod_panel", "multiplicative_percent", "Gastro: duration \u2014 Regurgitate Augment: Regurgitated enemies bounce up to 3 times, creating gas clo\u2026"),
    line("ricochetBounces", "mod_panel", "multiplicative_percent", "Gastro: ricochetBounces \u2014 Regurgitate Augment: Regurgitated enemies bounce up to 3 times, creating gas clo\u2026"),
  ]),
  gilded_truth: mod("gilded_truth", [
    line("fireRate", "weapon_dps", "multiplicative_percent", "wiki: Gilded Truth — +80% Fire Rate"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Gilded Truth: syndicatePower \u2014 +1 'Truth'"),
  ]),
  guardian_armor: mod("guardian_armor", [
    line("duration", "mod_panel", "multiplicative_percent", "Guardian Armor: duration \u2014 Vex Armor Augment: Chroma reduces the damage his squadmates within <AFFINITY_SHA\u2026"),
    line("health", "mod_panel", "multiplicative_percent", "Guardian Armor: health \u2014 Vex Armor Augment: Chroma reduces the damage his squadmates within <AFFINITY_SHA\u2026"),
  ]),
  hallowed_eruption: mod("hallowed_eruption", [
    line("abilityDuration", "mod_panel", "multiplicative_percent", "Hallowed Eruption: abilityDuration \u2014 Hallowed Ground Augment: Reactivate to deal all Remaining Damage and <DT_RADIATION_COLOR>Radiation Status.\\\\nPassive: +200% Hallowed Ground Duration."),
  ]),
  hallowed_reckoning: mod("hallowed_reckoning", [
    line("damage", "mod_panel", "multiplicative_percent", "Hallowed Reckoning: damage \u2014 Reckoning Augment: Reckoning gains +40% range. A 3m radius around each affected \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Hallowed Reckoning: range \u2014 Reckoning Augment: Reckoning gains +40% range. A 3m radius around each affected \u2026"),
  ]),
  hunters_bonesaw: mod("hunters_bonesaw", [
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Hunter's Bonesaw: finisherDamage \u2014 Increase Finisher Damage by 120% against prone enemies."),
  ]),
  hysterical_assault: mod("hysterical_assault", [
    line("duration", "mod_panel", "multiplicative_percent", "Hysterical Assault: duration \u2014 Hysteria Augment: Attack with Valkyr\\u2019s Talons to leap onto targeted enemies\u2026"),
    line("parkourVelocity", "mod_panel", "multiplicative_percent", "Hysterical Assault: parkourVelocity \u2014 Hysteria Augment: Attack with Valkyr\\u2019s Talons to leap onto targeted enemies\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Hysterical Assault: range \u2014 Hysteria Augment: Attack with Valkyr\\u2019s Talons to leap onto targeted enemies\u2026"),
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "Hysterical Assault: sprintSpeed \u2014 Hysteria Augment: Attack with Valkyr\\u2019s Talons to leap onto targeted enemies\u2026"),
  ]),
  hysterical_fixation: mod("hysterical_fixation", [
    line("shield", "mod_panel", "multiplicative_percent", "Hysterical Fixation: shield \u2014 Hysteria Augment: While Hysteria is active, each kill restores 20% Maximum Shiel\u2026"),
  ]),
  immolated_radiance: mod("immolated_radiance", [
    line("damageReduction", "mod_panel", "multiplicative_percent", "Immolated Radiance: damageReduction \u2014 Immolation Augment: Allies within Affinity range will receive 50% of Immolation's Damage Reduction."),
  ]),
  insatiable: mod("insatiable", [
    line("mutationStackChance", "mod_panel", "multiplicative_percent", "Insatiable: mutationStackChance \u2014 Ravenous Augment: Nidus has a chance for additional Mutation stacks while in the infestation. The base 60% chance increases with power strength, and multiple stacks are possible above 100%."),
  ]),
  intrepid_stand: mod("intrepid_stand", [
    line("overguardAlly", "mod_panel", "multiplicative_percent", "Intrepid Stand: overguardAlly \u2014 Final Stand Augment: Each javelin that damages an enemy grants 60 Overguard to S\u2026"),
    line("overguardCap", "mod_panel", "multiplicative_percent", "Intrepid Stand: overguardCap \u2014 Final Stand Augment: Each javelin that damages an enemy grants 60 Overguard to S\u2026"),
    line("overguardSelf", "mod_panel", "multiplicative_percent", "Intrepid Stand: overguardSelf \u2014 Final Stand Augment: Each javelin that damages an enemy grants 60 Overguard to S\u2026"),
  ]),
  iron_vault: mod("iron_vault", [
    line("damage", "mod_panel", "multiplicative_percent", "Iron Vault: damage \u2014 Iron Jab Augment: Aiming Iron Jab at the ground launches Wukong into the air. Ex\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Iron Vault: range \u2014 Iron Jab Augment: Aiming Iron Jab at the ground launches Wukong into the air. Ex\u2026"),
  ]),
  ironclad_flight: mod("ironclad_flight", [
    line("damageReduction", "mod_panel", "multiplicative_percent", "Ironclad Flight: damageReduction \u2014 Disable vacuum in Razorwing. Reduced Damage by 40% while Airborne."),
  ]),
  jet_stream: mod("jet_stream", [
    line("sprintSpeed", "mod_panel", "multiplicative_percent", "wiki: Jet Stream — Turbulence-gated movement (× Strength; not always-on)"),
    line("projectileSpeed", "mod_panel", "multiplicative_percent", "wiki: Jet Stream — Turbulence-gated projectile speed (× Strength)"),
  ]),
  justice_blades: mod("justice_blades", [
    line("damage", "weapon_dps", "multiplicative_percent", "wiki: Justice Blades — +100% Melee Damage"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Justice Blades: syndicatePower \u2014 +1 'Justice'"),
  ]),
  kinetic_collision: mod("kinetic_collision", [
    line("duration", "mod_panel", "multiplicative_percent", "Kinetic Collision: duration \u2014 Speed Augment: Running into an opponent increases the duration of Speed by 4s."),
  ]),
  kinetic_ricochet: mod("kinetic_ricochet", [
    line("range", "mod_panel", "multiplicative_percent", "Kinetic Ricochet: range \u2014 Shots now bounce up to 6x and travel 30% further."),
    line("ricochetBounces", "mod_panel", "multiplicative_percent", "Kinetic Ricochet: ricochetBounces \u2014 Shots now bounce up to 6x and travel 30% further."),
  ]),
  larva_burst: mod("larva_burst", [
    line("range", "mod_panel", "multiplicative_percent", "Larva Burst: range \u2014 Larva Augment: Reactivate Larva to detonate and deal 600 Toxin Damage in a 8m ra\u2026"),
  ]),
  lasting_covenant: mod("lasting_covenant", [
    line("duration", "mod_panel", "multiplicative_percent", "Lasting Covenant: duration \u2014 Covenant Augment: Headshot kills increase Critical Chance bonus duration by 3s."),
  ]),
  lasting_purity: mod("lasting_purity", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Lasting Purity — +60% Damage when Aiming"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Lasting Purity: syndicatePower \u2014 +1 'Purity' (syndicate proc)"),
  ]),
  mesmer_shield: mod("mesmer_shield", [
    line("range", "mod_panel", "multiplicative_percent", "Mesmer Shield: range \u2014 Mesmer Skin Augment: Revenant receives +50% Mesmer Skin Strength and allies with\u2026"),
  ]),
  meticulous_aim: mod("meticulous_aim", [
    line("damage", "mod_panel", "multiplicative_percent", "Meticulous Aim: damage \u2014 +105% Headshot Damage, -45% Bodyshot Damage"),
    line("headshotDamage", "mod_panel", "multiplicative_percent", "Meticulous Aim: headshotDamage \u2014 +105% Headshot Damage, -45% Bodyshot Damage"),
  ]),
  napalm_grenades: mod("napalm_grenades", [
    line("statusChance", "weapon_dps", "flat", "wiki: Napalm Grenades — +30 Final Status Chance (Heat convert/patches unmodeled)"),
  ]),
  negation_armor: mod("negation_armor", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Negation Armor: cooldown \u2014 Scarab Shell Augment: When Inaros takes fatal damage, he consumes Scarab Shell t\u2026"),
  ]),
  neutralizing_justice: mod("neutralizing_justice", [
    line("nullifierPopChance", "mod_panel", "multiplicative_percent", "Neutralizing Justice: nullifierPopChance \u2014 Each Miter blade has a +90% chance to immediately destroy a Nullifier field., +1\u2026"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Neutralizing Justice: syndicatePower \u2014 Each Miter blade has a +90% chance to immediately destroy a Nullifier field., +1\u2026"),
  ]),
  nightwatch_napalm: mod("nightwatch_napalm", [
    line("damage", "mod_panel", "multiplicative_percent", "Nightwatch Napalm: damage \u2014 Rockets disperse napalm, inflicting 30% damage over 6s across 90% of the explosi\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Nightwatch Napalm: duration \u2014 Rockets disperse napalm, inflicting 30% damage over 6s across 90% of the explosi\u2026"),
  ]),
  omikujis_fortune: mod("omikujis_fortune", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Omikuji's Fortune: cooldown \u2014 Omikuji Augment: Reduce Omikuji's Cooldown by 4s when you kill an enemy with the\u2026"),
  ]),
  peaceful_provocation: mod("peaceful_provocation", [
    line("damage", "mod_panel", "multiplicative_percent", "Peaceful Provocation: damage \u2014 Pacify & Provoke Augment: Pacify converts damage done to allies into an aura tha\u2026"),
  ]),
  perpetual_vortex: mod("perpetual_vortex", [], "wiki: Perpetual Vortex \u2014 Perpetual Vortex augment."),
  phoenix_renewal: mod("phoenix_renewal", [
    line("duration", "mod_panel", "multiplicative_percent", "Phoenix Renewal: duration \u2014 Renewal Augment: Taking fatal damage while under the effects of Renewal will ins\u2026"),
    line("health", "mod_panel", "multiplicative_percent", "Phoenix Renewal: health \u2014 Renewal Augment: Taking fatal damage while under the effects of Renewal will ins\u2026"),
  ]),
  photon_overcharge: mod("photon_overcharge", [
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "wiki: Photon Overcharge — +90% Critical Damage"),
    line("energy", "mod_panel", "multiplicative_percent", "Photon Overcharge: energy \u2014 Cold-stack energy orb chance on kill"),
  ]),
  power_of_three: mod("power_of_three", [
    line("abilityProjectileCount", "mod_panel", "multiplicative_percent", "Power Of Three: abilityProjectileCount \u2014 Quiver Augment: Quiver fires three arrows and consumes <LOWER_IS_BETTER>20 more \u2026"),
    line("extraEnergyCost", "mod_panel", "multiplicative_percent", "Power Of Three: extraEnergyCost \u2014 Quiver Augment: Quiver fires three arrows and consumes <LOWER_IS_BETTER>20 more \u2026"),
  ]),
  prey_of_dynar: mod("prey_of_dynar", [
    line("damageVulnerability", "mod_panel", "multiplicative_percent", "Prey Of Dynar: damageVulnerability \u2014 Shroud of Dynar Augment: Increase an enemy\\u2019s Damage Vulnerability by 50%. U\u2026"),
    line("spreadRadiusBonus", "mod_panel", "multiplicative_percent", "Prey Of Dynar: spreadRadiusBonus \u2014 Shroud of Dynar Augment: Increase an enemy\\u2019s Damage Vulnerability by 50%. U\u2026"),
  ]),
  prism_guard: mod("prism_guard", [
    line("duration", "mod_panel", "multiplicative_percent", "Prism Guard: duration \u2014 Prism Augment: Prism follows above Mirage. Duration changed to 4s."),
  ]),
  prolonged_paralysis: mod("prolonged_paralysis", [
    line("duration", "mod_panel", "multiplicative_percent", "Prolonged Paralysis: duration \u2014 Paralysis Augment: Affected enemies are pulled towards Valkyr and the stun durat\u2026"),
  ]),
  purging_slash: mod("purging_slash", [
    line("shield", "mod_panel", "multiplicative_percent", "Purging Slash: shield \u2014 Slash Dash Augment: Allies in the path of Slash Dash have 4 debuffs removed and \u2026"),
  ]),
  purifying_flames: mod("purifying_flames", [
    line("duration", "mod_panel", "multiplicative_percent", "Purifying Flames: duration \u2014 Fire Blast Augment: Allies hit by the expanding ring of fire are cured of Status\u2026"),
  ]),
  biting_frost: mod("biting_frost", [
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Biting Frost — +200% CC vs enemies frozen by 10 Cold stacks (conditional; not paper DPS)"),
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "wiki: Biting Frost — +200% CD vs enemies frozen by 10 Cold stacks (conditional; not paper DPS)"),
  ]),
  "push_&_pull": mod("push_&_pull", [
    line("range", "mod_panel", "multiplicative_percent", "Push & Pull: range \u2014 Metamorphosis Augment: Switching to Day-form staggers enemies within 6m and knoc\u2026"),
  ]),
  recharge_barrier: mod("recharge_barrier", [
    line("shield", "mod_panel", "multiplicative_percent", "Recharge Barrier: shield \u2014 Electric Shield Augment: Allies that pass through have 35% Shields restored."),
  ]),
  prismatic_companion: mod("prismatic_companion", [
    line("abilityDuration", "mod_panel", "multiplicative_percent", "Prismatic Companion: abilityDuration \u2014 Prismatic Gem Augment: The gem now attaches to your free-moving companion. Passive: +50% Prismatic Gem Duration."),
  ]),
  repair_dispensary: mod("repair_dispensary", [
    line("health", "mod_panel", "multiplicative_percent", "Repair Dispensary: health \u2014 Dispensary Augment: Dispensary also creates pick ups that heal companions for 20% of their maximum health\u2026"),
    line("incapacitationTimerReduction", "mod_panel", "flat", "Repair Dispensary: incapacitationTimerReduction \u2014 \u2026and reduce their incapacitation timer by 12 sec."),
  ]),
  rift_strike: mod("rift_strike", [
    line("range", "mod_panel", "multiplicative_percent", "Rift Strike: range \u2014 Heavy attacks now step through the rift to attack enemies up to 25m away"),
  ]),
  rousing_plunder: mod("rousing_plunder", [
    line("damage", "mod_panel", "multiplicative_percent", "Rousing Plunder: damage \u2014 Plunder Augment: Plunder gains 50% max <DT_CORROSIVE_COLOR>Corrosive Damage and \u2026"),
  ]),
  rubble_heap: mod("rubble_heap", [], "wiki: Rubble Heap \u2014 Passive Augment: When above 1400 Rubble, Landslide costs no Energy, deals 2x Damage, and travels 2x faster."),
  sapping_reach: mod("sapping_reach", [
    line("energyLeech", "mod_panel", "multiplicative_percent", "Sapping Reach: energyLeech \u2014 Pull Augment: Steals up to 25 Energy from the target."),
  ]),
  scattered_justice: mod("scattered_justice", [
    line("multishot", "weapon_dps", "multiplicative_percent", "wiki: Scattered Justice — +200% Multishot"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Scattered Justice: syndicatePower \u2014 +1 'Justice'"),
  ]),
  sequence_burn: mod("sequence_burn", [
    line("range", "mod_panel", "multiplicative_percent", "Sequence Burn: range \u2014 +20m Beam Range, +1 'Sequence'"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Sequence Burn: syndicatePower \u2014 +20m Beam Range, +1 'Sequence'"),
  ]),
  shadow_haze: mod("shadow_haze", [
    line("critBonusPerKill", "mod_panel", "multiplicative_percent", "Shadow Haze: critBonusPerKill \u2014 Reap Augment: Increase Critical Chance by 50% on enemies inflicted with Death Ha\u2026"),
  ]),
  shattered_storm: mod("shattered_storm", [
    line("abilityStrength", "mod_panel", "multiplicative_percent", "Shattered Storm: abilityStrength \u2014 Shattered Lash Augment: When Gara breaks her Mass Vitrify ring with Shattered Lash, enemies struck by the glass suffer Splinter Storm at 100% Strength."),
  ]),
  shattering_justice: mod("shattering_justice", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Shattering Justice — +90% Status Chance"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Shattering Justice: syndicatePower \u2014 +1 'Justice'"),
  ]),
  shield_overload: mod("shield_overload", [
    line("duration", "mod_panel", "multiplicative_percent", "Shield Overload: duration \u2014 Polarize Augment: Increases the time for the target's Shields to regenerate by 9\u2026"),
  ]),
  shield_transference: mod("shield_transference", [
    line("shield", "mod_panel", "multiplicative_percent", "Shield Transference: shield \u2014 Shield Polarize Augment - Mag gains 50% overshields from depleted enemy shields."),
  ]),
  signal_flare: mod("signal_flare", [
    line("duration", "mod_panel", "multiplicative_percent", "Signal Flare: duration \u2014 Radial Blind Augment: Blinded enemies are marked on the Minimap for 12s."),
  ]),
  singularity: mod("singularity", [
    line("duration", "mod_panel", "multiplicative_percent", "Singularity: duration \u2014 Absorb Augment: Create a ring every 3s that drags in enemies at 15m/s."),
    line("range", "mod_panel", "multiplicative_percent", "Singularity: range \u2014 Absorb Augment: Create a ring every 3s that drags in enemies at 15m/s."),
  ]),
  smite_infusion: mod("smite_infusion", [
    line("damage", "mod_panel", "multiplicative_percent", "wiki: Smite Infusion — Smite-gated parallel Radiation × Strength (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Smite Infusion: duration \u2014 Smite Augment: Hold to cast will grant all allies within 15m an additional 100% \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Smite Infusion: range \u2014 Smite Augment: Hold to cast will grant all allies within 15m an additional 100% \u2026"),
  ]),
  spectral_spirit: mod("spectral_spirit", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Spectral Spirit: cooldown \u2014 Grave Spirit Augment: Immediately assume Spectral Form. 100% chance for weapons \u2026"),
  ]),
  spring_loaded_broadhead: mod("spring_loaded_broadhead", [
    line("range", "mod_panel", "multiplicative_percent", "Spring-Loaded Broadhead: range \u2014 Increase damage by +40%, if the target is over 15m away."),
  ]),
  stance_gleaming_talent: mod("stance_gleaming_talent", [
    line("damageBonus", "mod_panel", "multiplicative_percent", "wiki: Gleaming Blight — spurious catalog damageBonus (not wiki combat)"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "wiki: Gleaming Blight — +100% Status Chance"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Gleaming Blight: syndicatePower \u2014 +1 'Blight'"),
  ]),
  static_discharge: mod("static_discharge", [
    line("damage", "mod_panel", "multiplicative_percent", "Static Discharge: damage \u2014 Heavy Attacks electrify nearby enemies for <DT_ELECTRICITY_COLOR>Electricity Dam\u2026"),
  ]),
  stinging_truth: mod("stinging_truth", [
    line("magazine", "weapon_dps", "flat", "wiki: Stinging Truth — +40 flat Magazine Capacity"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Stinging Truth: syndicatePower \u2014 +1 'Truth'"),
  ]),
  stockpiled_blight: mod("stockpiled_blight", [
    line("magazine", "weapon_dps", "multiplicative_percent", "wiki: Stockpiled Blight — +200% Magazine Capacity"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Stockpiled Blight: syndicatePower \u2014 +1 'Blight'"),
  ]),
  swing_line: mod("swing_line", [
    line("parkourVelocity", "mod_panel", "multiplicative_percent", "Swing Line: parkourVelocity \u2014 Rip Line Augment: Rip Lines has no Energy cost while Airborne., +20% Parkour Vel\u2026"),
  ]),
  target_fixation: mod("target_fixation", [
    line("damage", "mod_panel", "multiplicative_percent", "Target Fixation: damage \u2014 Tail Wind Augment: Casting Tail Wind resets Zephyr\\u2019s bullet jump. Each enem\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Target Fixation: duration \u2014 Tail Wind Augment: Casting Tail Wind resets Zephyr\\u2019s bullet jump. Each enem\u2026"),
  ]),
  tear_gas: mod("tear_gas", [
    line("duration", "mod_panel", "multiplicative_percent", "Tear Gas: duration \u2014 Smoke Screen Augment: Blinds enemies within 4m for 3s."),
    line("range", "mod_panel", "multiplicative_percent", "Tear Gas: range \u2014 Smoke Screen Augment: Blinds enemies within 4m for 3s."),
  ]),
  teeming_virulence: mod("teeming_virulence", [
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Teeming Virulence — Virulence-gated primary CC × Strength (not always-on)"),
    line("duration", "mod_panel", "multiplicative_percent", "Teeming Virulence: duration \u2014 Virulence Augment: Hitting 4 enemies with Virulence grants 120% Primary Weapon C\u2026"),
  ]),
  teleport_rush: mod("teleport_rush", [
    line("duration", "mod_panel", "multiplicative_percent", "Teleport Rush: duration \u2014 Teleport Augment: Using Teleport increases Parkour Velocity by 30% for 12s. Exec\u2026"),
  ]),
  temporal_artillery: mod("temporal_artillery", [], "wiki: Temporal Artillery \u2014 Blaze Artillery Augment : When Temporal Anchor is activated, one existing Artillery unit will attach to Protea, halting its duration countdown. Max combo count is 20x."),
  temporal_erosion: mod("temporal_erosion", [
    line("armor", "mod_panel", "multiplicative_percent", "Temporal Erosion: armor \u2014 Temporal Anchor Augment: While Temporal Anchor is active, each strike of Grenade\u2026"),
  ]),
  tesla_bank: mod("tesla_bank", [
    line("range", "mod_panel", "multiplicative_percent", "Tesla Bank: range \u2014 Tesla Nervos Augment: While a target has a Nervos attached, any damage dealt to \u2026"),
  ]),
  tether_grenades: mod("tether_grenades", [
    line("range", "mod_panel", "multiplicative_percent", "Tether Grenades: range \u2014 Grenades tether up to 5 enemies from 9m away."),
  ]),
  thermagnetic_shells: mod("thermagnetic_shells", [
    line("health", "mod_panel", "multiplicative_percent", "Thermagnetic Shells: health \u2014 Enemies explode on death, dealing 80 <DT_MAGNETIC_COLOR>Magnetic Damage (+40% En\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Thermagnetic Shells: range \u2014 Enemies explode on death, dealing 80 <DT_MAGNETIC_COLOR>Magnetic Damage (+40% En\u2026"),
  ]),
  titanic_rumbler: mod("titanic_rumbler", [
    line("damage", "mod_panel", "multiplicative_percent", "Titanic Rumbler: damage \u2014 Rumblers Augment: Create a single rumbler with 300% Health and 400% Damage.\\\\nRe\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Titanic Rumbler: range \u2014 Rumblers Augment: Create a single rumbler with 300% Health and 400% Damage.\\\\nRe\u2026"),
  ]),
  tribunal: mod("tribunal", [
    line("allyEffectPercent", "mod_panel", "multiplicative_percent", "Tribunal: allyEffectPercent \u2014 Condemn Augment: allies trigger Penance/Thurible effects on chained enemies (40\u2013100% by rank; not affected by mods)."),
  ]),
  toxic_blight: mod("toxic_blight", [
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Toxic Blight: syndicatePower \u2014 +1 'Blight'"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "wiki: Toxic Blight — +100% Toxin"),
  ]),
  toxic_sequence: mod("toxic_sequence", [
    line("statusDuration", "weapon_dps", "multiplicative_percent", "Toxic Sequence: statusDuration \u2014 +200% Status Duration (extends DoT ticks)"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Toxic Sequence: syndicatePower \u2014 +200% Status Duration, +1 'Sequence'"),
  ]),
  ulfruns_endurance: mod("ulfruns_endurance", [
    line("range", "mod_panel", "multiplicative_percent", "Ulfrun's Endurance: range \u2014 Ulfrun's Descent Augment: During Ulfrun's attack, enemies that die from Slash St\u2026"),
  ]),
  viral_tempest: mod("viral_tempest", [
    line("viral", "mod_panel", "multiplicative_percent", "Viral Tempest: viral \u2014 Tempest Barrage Augment: Each projectile has a 100% chance of inflicting a <DT_V\u2026"),
  ]),
  voltage_sequence: mod("voltage_sequence", [
    line("duration", "mod_panel", "multiplicative_percent", "Voltage Sequence: duration \u2014 Killing a flying enemy creates a lightning trap from their remains, lasting 8s, \u2026"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Voltage Sequence: syndicatePower \u2014 Killing a flying enemy creates a lightning trap from their remains, lasting 8s, \u2026"),
  ]),
  vulcan_blitz: mod("vulcan_blitz", [
    line("health", "mod_panel", "multiplicative_percent", "Vulcan Blitz: health \u2014 Enemies explode on death, dealing 300 <DT_EXPLOSION_COLOR>Blast Damage (+60% Ene\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Vulcan Blitz: range \u2014 Enemies explode on death, dealing 300 <DT_EXPLOSION_COLOR>Blast Damage (+60% Ene\u2026"),
  ]),
  ward_recovery: mod("ward_recovery", [
    line("abilityEfficiency", "mod_panel", "multiplicative_percent", "Ward Recovery: abilityEfficiency \u2014 Warding Halo Augment: 50% of the casting cost returned based on how much protection is left."),
  ]),
  warding_thurible: mod("warding_thurible", [
    line("damage", "mod_panel", "multiplicative_percent", "Warding Thurible: damage \u2014 Thurible Augment: Allies in range take 50% less Damage while channeling Thurible\u2026"),
  ]),
  wild_frenzy: mod("wild_frenzy", [
    line("fireRate", "mod_panel", "multiplicative_percent", "Wild Frenzy: fireRate \u2014 Secondary Fire will shoot with +400% Fire Rate until the magazine is empty. Kill\u2026"),
  ]),
  winds_of_purity: mod("winds_of_purity", [
    line("lifeSteal", "mod_panel", "multiplicative_percent", "Winds Of Purity: lifeSteal \u2014 +20% Life Steal, +1 'Purity'"),
    line("syndicatePower", "mod_panel", "multiplicative_percent", "Winds Of Purity: syndicatePower \u2014 +20% Life Steal, +1 'Purity'"),
  ]),
  wrecking_wall: mod("wrecking_wall", [
    line("shield", "mod_panel", "multiplicative_percent", "Wrecking Wall: shield \u2014 Containment Wall Augment: Strip 50% of armor and shields from struck enemies. Hi\u2026"),
  ]),
};
