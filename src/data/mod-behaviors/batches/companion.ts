/**
 * Per-mod verified behaviors — category: companion (158 mods).
 * Generated: python scripts/generate_mod_behavior_batch.py companion
 * Each mod has its own entry; edit lines after individual wiki review.
 */
import type { VerifiedModBehavior, VerifiedItemStatLine } from "@/lib/codex/item-behavior-types";

function line(statKey: string, target: VerifiedItemStatLine['target'], mode: VerifiedItemStatLine['mode'], source: string): VerifiedItemStatLine {
  return { statKey, target, mode, source };
}

function mod(modId: string, stats: VerifiedItemStatLine[], descriptionOnly?: string): VerifiedModBehavior {
  return descriptionOnly ? { modId, stats, descriptionOnly } : { modId, stats };
}

export const MOD_BEHAVIORS_COMPANION: Record<string, VerifiedModBehavior> = {
  accelerated_deflection: mod("accelerated_deflection", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Accelerated Deflection — recharge delay (not capacity)"),
    line("shieldRecharge", "mod_panel", "multiplicative_percent", "Accelerated Deflection: shieldRecharge \u2014 +90% Shield Recharge\\\\n-45% Shield Recharge Delay"),
  ]),
  acidic_spittle: mod("acidic_spittle", [
    line("duration", "mod_panel", "multiplicative_percent", "Acidic Spittle: duration \u2014 Every <LOWER_IS_BETTER>5s spit acidic tar at an enemy within 30m, blinding them \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Acidic Spittle: range \u2014 Every <LOWER_IS_BETTER>5s spit acidic tar at an enemy within 30m, blinding them \u2026 (arsenal display only)"),
  ]),
  aerial_bond: mod("aerial_bond", [
    line("airborneCrit", "mod_panel", "multiplicative_percent", "Aerial Bond: airborneCrit \u2014 Airborne kills decrease Companion Recovery Time by 3s and 9s for headshot kills.\u2026"),
    line("airborneDamage", "mod_panel", "multiplicative_percent", "Aerial Bond: airborneDamage \u2014 Airborne kills decrease Companion Recovery Time by 3s and 9s for headshot kills.\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Aerial Bond: duration \u2014 Airborne kills decrease Companion Recovery Time by 3s and 9s for headshot kills.\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Aerial Bond: range \u2014 Airborne kills decrease Companion Recovery Time by 3s and 9s for headshot kills.\u2026 (arsenal display only)"),
  ]),
  aerial_prospectus: mod("aerial_prospectus", [
    line("range", "mod_panel", "multiplicative_percent", "Aerial Prospectus: range \u2014 Launches a beacon at an enemy within 27m that calls down an Orbital Strike deali\u2026 (arsenal display only)"),
  ]),
  ammo_case: mod("ammo_case", [
    line("duration", "mod_panel", "multiplicative_percent", "Ammo Case: duration \u2014 Increases Ammo Capacity by 25% and converts Ammo Pickups into ammo for equipped \u2026"),
  ]),
  anabolic_pollination: mod("anabolic_pollination", [
    line("duration", "mod_panel", "multiplicative_percent", "Anabolic Pollination: duration \u2014 Release a cloud of spores that persists for 10s increasing <DT_POISON_COLOR>Toxi\u2026"),
  ]),
  animal_instinct: mod("animal_instinct", [
    line("enemyRadar", "mod_panel", "flat", "Animal Instinct: +3m Enemy Radar per rank, +18m at rank 5"),
    line("lootRadar", "mod_panel", "flat", "Animal Instinct: +5m Loot Radar per rank, +30m at rank 5"),
  ]),
  anti_grav_array: mod("anti_grav_array", [
    line("gravityReduction", "mod_panel", "multiplicative_percent", "Anti-Grav Array: gravityReduction \u2014 Increase height of owner's jumps by +40%."),
  ]),
  anti_grav_grenade: mod("anti_grav_grenade", [
    line("damage", "mod_panel", "multiplicative_percent", "Anti-Grav Grenade: damage \u2014 A grenade that levitates enemies in a 6m. After 6s afflicted enemies come crashi\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Anti-Grav Grenade: duration \u2014 A grenade that levitates enemies in a 6m. After 6s afflicted enemies come crashi\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Anti-Grav Grenade: range \u2014 A grenade that levitates enemies in a 6m. After 6s afflicted enemies come crashi\u2026 (arsenal display only)"),
  ]),
  arc_coil: mod("arc_coil", [
    line("range", "mod_panel", "multiplicative_percent", "Arc Coil: range \u2014 Sentinel will zap up to 7 enemies within 10m, dealing 100 <DT_ELECTRICITY_COLOR>\u2026 (arsenal display only)"),
    line("statusChance", "mod_panel", "multiplicative_percent", "Arc Coil: statusChance \u2014 Sentinel will zap up to 7 enemies within 10m, dealing 100 <DT_ELECTRICITY_COLOR>\u2026"),
  ]),
  astral_bond: mod("astral_bond", [
    line("damage", "mod_panel", "multiplicative_percent", "Astral Bond: damage \u2014 Damage dealt by Operator or Drifter grants 60% damage and 30% Void Damage to you\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Astral Bond: duration \u2014 Damage dealt by Operator or Drifter grants 60% damage and 30% Void Damage to you\u2026"),
    line("energyOnAbility", "mod_panel", "multiplicative_percent", "Astral Bond: energyOnAbility \u2014 Damage dealt by Operator or Drifter grants 60% damage and 30% Void Damage to you\u2026"),
  ]),
  auto_omni: mod("auto_omni", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Auto Omni: cooldown \u2014 Nautilus has 100% chance to repair nearby Railjack hull damages and extinguishes\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Auto Omni: damage \u2014 Nautilus has 100% chance to repair nearby Railjack hull damages and extinguishes\u2026"),
  ]),
  bell_ringer: mod("bell_ringer", [
    line("impactStatusStacks", "mod_panel", "flat", "wiki: Bell Ringer — precept knockdown/Impact stacks (AI)"),
  ]),
  bite: mod("bite", [
    line("critChance", "mod_panel", "multiplicative_percent", "wiki: Bite — duplicate critChance key"),
    line("critDamage", "mod_panel", "multiplicative_percent", "wiki: Bite — duplicate critDamage key (CM via criticalMultiplier)"),
    line("criticalChance", "weapon_dps", "multiplicative_percent", "wiki: Bite — +330% CC at max"),
    line("criticalMultiplier", "weapon_dps", "multiplicative_percent", "wiki: Bite — +220% CM at max"),
  ]),
  blast_shield: mod("blast_shield", [
    line("range", "mod_panel", "multiplicative_percent", "Blast Shield: range \u2014 Overshields increased by +3000. Leap at an enemy within 10m dealing 30 <DT_IMPAC\u2026 (arsenal display only)"),
  ]),
  botanist: mod("botanist", [
    line("duration", "mod_panel", "multiplicative_percent", "Botanist: duration \u2014 Oxylus Sentinel will automatically pick any plants within 50m over <LOWER_IS_BET\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Botanist: range \u2014 Oxylus Sentinel will automatically pick any plants within 50m over <LOWER_IS_BET\u2026 (arsenal display only)"),
  ]),
  brute_conditioning: mod("brute_conditioning", [
    line("damage", "weapon_dps", "multiplicative_percent", "Brute Conditioning: damage \u2014 +385% Melee Damage, Convert all base Physical Damage to <DT_IMPACT_COLOR>Impact \u2026"),
  ]),
  burning_claws: mod("burning_claws", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Burning Claws: heat \u2014 +330% <DT_FIRE_COLOR>Heat, +330% Status Chance, Converts all elemental damage fr\u2026"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Burning Claws: statusChance \u2014 +330% <DT_FIRE_COLOR>Heat, +330% Status Chance, Converts all elemental damage fr\u2026"),
  ]),
  calculated_redirection: mod("calculated_redirection", [
    line("shield", "warframe_totals", "multiplicative_percent", "Calculated Redirection: shield \u2014 +250% Shield Capacity"),
  ]),
  calculated_shot: mod("calculated_shot", [
    line("range", "mod_panel", "multiplicative_percent", "Calculated Shot: range \u2014 Sentinel charges a powerful shot and fires at the first enemy within 70m. (arsenal display only)"),
  ]),
  cats_eye: mod("cats_eye", [
    line("critBuff", "mod_panel", "multiplicative_percent", "wiki: Cat's Eye — timed ally CC buff (precept)"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Cat's Eye — timed ally CC buff (not always-on companion CC)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Cat's Eye — buff duration"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Cat's Eye — affinity range display"),
  ]),
  charm: mod("charm", [
    line("buffChance", "mod_panel", "multiplicative_percent", "Charm: buffChance \u2014 Smeeta Kavat has a 40% chance every 27s to bestow its owner with good fortune."),
    line("duration", "mod_panel", "multiplicative_percent", "Charm: duration \u2014 Smeeta Kavat has a 40% chance every 27s to bestow its owner with good fortune."),
  ]),
  chilling_claws: mod("chilling_claws", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Chilling Claws: cold \u2014 +330% <DT_FREEZE_COLOR>Cold, +330% Status Chance, Converts all elemental damage \u2026"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Chilling Claws: statusChance \u2014 +330% <DT_FREEZE_COLOR>Cold, +330% Status Chance, Converts all elemental damage \u2026"),
  ]),
  contagious_bond: mod("contagious_bond", [
    line("range", "mod_panel", "multiplicative_percent", "Contagious Bond: range \u2014 When your Companion kills an enemy afflicted with a Status Effect, 50% of the St\u2026 (arsenal display only)"),
    line("statusSpread", "mod_panel", "multiplicative_percent", "Contagious Bond: statusSpread \u2014 When your Companion kills an enemy afflicted with a Status Effect, 50% of the St\u2026"),
  ]),
  coolant_leak: mod("coolant_leak", [
    line("coldDamage", "mod_panel", "multiplicative_percent", "Coolant Leak: coldDamage \u2014 Unleashes a 10m radial blast of Cold when multiple enemies are nearby. Add 3 sta\u2026"),
    line("cooldown", "mod_panel", "multiplicative_percent", "Coolant Leak: cooldown \u2014 Unleashes a 10m radial blast of Cold when multiple enemies are nearby. Add 3 sta\u2026"),
    line("slow", "mod_panel", "multiplicative_percent", "Coolant Leak: slow \u2014 Unleashes a 10m radial blast of Cold when multiple enemies are nearby. Add 3 sta\u2026"),
  ]),
  cordon: mod("cordon", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Cordon: cooldown \u2014 Nautilus forces enemies within 30m of the target into clusters for easier target\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Cordon: range \u2014 Nautilus forces enemies within 30m of the target into clusters for easier target\u2026 (arsenal display only)"),
  ]),
  covert_bond: mod("covert_bond", [
    line("duration", "mod_panel", "multiplicative_percent", "Covert Bond: duration \u2014 Finisher and Mercy Kills grant your Companion 10s of stealth that attacks will n\u2026"),
    line("stealthDamage", "mod_panel", "multiplicative_percent", "Covert Bond: stealthDamage \u2014 Finisher and Mercy Kills grant your Companion 10s of stealth that attacks will n\u2026"),
  ]),
  crescent_charge: mod("crescent_charge", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Crescent Charge — precept charge damage (not max health)"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Crescent Charge — precept range"),
  ]),
  crescent_devolution: mod("crescent_devolution", [
    line("duration", "mod_panel", "multiplicative_percent", "Crescent Devolution: duration \u2014 Devolves into its larval form when downed and charges at enemies, dealing 100 <D\u2026"),
  ]),
  crowd_dispersion: mod("crowd_dispersion", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Crowd Dispersion: explosionDamage \u2014 Unleashes a 10.0m radial knockdown when multiple enemies are nearby, dealing 10.\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Crowd Dispersion: range \u2014 Unleashes a 10.0m radial knockdown when multiple enemies are nearby, dealing 10.\u2026 (arsenal display only)"),
  ]),
  detect_vulnerability: mod("detect_vulnerability", [
    line("weakspotDamage", "mod_panel", "multiplicative_percent", "wiki: Detect Vulnerability — precept weakspot reveal (AI)"),
  ]),
  dig: mod("dig", [
    line("digCooldown", "mod_panel", "multiplicative_percent", "Dig: digCooldown \u2014 The kubrow sniffs out buried objects and digs them up.\\\\n+270% Success Chance"),
  ]),
  disabling_conditioning: mod("disabling_conditioning", [
    line("damage", "weapon_dps", "multiplicative_percent", "Disabling Conditioning: damage \u2014 +385% Melee Damage, Convert all base Physical Damage to <DT_PUNCTURE_COLOR>Punct\u2026"),
  ]),
  diversified_denial: mod("diversified_denial", [
    line("damage", "mod_panel", "multiplicative_percent", "Diversified Denial: damage \u2014 Fabricate 3 Specters that fight for 30s. Each deals 85% of the Hound's damage an\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Diversified Denial: duration \u2014 Fabricate 3 Specters that fight for 30s. Each deals 85% of the Hound's damage an\u2026"),
  ]),
  draining_bite: mod("draining_bite", [
    line("damage", "mod_panel", "multiplicative_percent", "Draining Bite: damage \u2014 Vasca Kavat inflicts 5 stacks of Slash at 150% of its melee damage and restores \u2026"),
    line("lifeSteal", "mod_panel", "multiplicative_percent", "Draining Bite: lifeSteal \u2014 Vasca Kavat inflicts 5 stacks of Slash at 150% of its melee damage and restores \u2026"),
  ]),
  duplex_bond: mod("duplex_bond", [
    line("companionDamage", "mod_panel", "multiplicative_percent", "wiki: Duplex Bond — clone precept"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Duplex Bond — clone duration"),
    line("energy", "mod_panel", "multiplicative_percent", "wiki: Duplex Bond — energy spend threshold (not max energy)"),
    line("extraAttack", "mod_panel", "multiplicative_percent", "wiki: Duplex Bond — clone attacks"),
  ]),
  electro_pulse: mod("electro_pulse", [
    line("duration", "mod_panel", "multiplicative_percent", "Electro Pulse: duration \u2014 Every 5s, Sentinel will continually zap an enemy within 15m, trapping them in a \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Electro Pulse: range \u2014 Every 5s, Sentinel will continually zap an enemy within 15m, trapping them in a \u2026 (arsenal display only)"),
  ]),
  endoparasitic_vector: mod("endoparasitic_vector", [
    line("duration", "mod_panel", "multiplicative_percent", "Endoparasitic Vector: duration \u2014 Transmit an endoparasite to an enemy within 30m. Tentacles spawn from it, clingi\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Endoparasitic Vector: range \u2014 Transmit an endoparasite to an enemy within 30m. Tentacles spawn from it, clingi\u2026 (arsenal display only)"),
  ]),
  energy_generator: mod("energy_generator", [
    line("energyOnAssist", "mod_panel", "multiplicative_percent", "Energy Generator: energyOnAssist \u2014 Dethcube drops an Energy Orb after assisting in 10 kills."),
  ]),
  enhanced_vitality: mod("enhanced_vitality", [
    line("health", "warframe_totals", "multiplicative_percent", "wiki: Enhanced Vitality — +250% Health at max"),
  ]),
  equilibrium_audit: mod("equilibrium_audit", [
    line("range", "mod_panel", "multiplicative_percent", "Equilibrium Audit: range \u2014 Unleashes a series of shockwaves that knockdown enemies within 15m and deal 300 \u2026 (arsenal display only)"),
  ]),
  evasive_denial: mod("evasive_denial", [
    line("duration", "mod_panel", "multiplicative_percent", "Evasive Denial: duration \u2014 Teleports a safe distance away and engages a displacement field gaining 75% chan\u2026"),
    line("heat", "mod_panel", "multiplicative_percent", "Evasive Denial: heat \u2014 Teleports a safe distance away and engages a displacement field gaining 75% chan\u2026"),
  ]),
  fatal_attraction: mod("fatal_attraction", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Fatal Attraction: cooldown \u2014 Enemies within 20m are drawn to you. Once they are within 6m, they detonate for \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Fatal Attraction: range \u2014 Enemies within 20m are drawn to you. Once they are within 6m, they detonate for \u2026 (arsenal display only)"),
  ]),
  fear_sense: mod("fear_sense", [
    line("damage", "mod_panel", "multiplicative_percent", "Fear Sense: damage \u2014 The Kavat senses the weaknesses of enemies within 25m. For 25s, its attacks deal\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Fear Sense: duration \u2014 The Kavat senses the weaknesses of enemies within 25m. For 25s, its attacks deal\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Fear Sense: range \u2014 The Kavat senses the weaknesses of enemies within 25m. For 25s, its attacks deal\u2026 (arsenal display only)"),
  ]),
  ferocity: mod("ferocity", [
    line("attackSpeed", "mod_panel", "multiplicative_percent", "wiki: Ferocity — finisher precept AS"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Ferocity — finisher precept CC"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Ferocity — precept range"),
  ]),
  fired_up: mod("fired_up", [
    line("damage", "weapon_dps", "conditional_stat_on_trigger", "wiki: Fired Up — +5% Heat/hit up to +100% (catalog damage→heat; sim assumes max)"),
    line("duration", "mod_panel", "multiplicative_percent", "wiki: Fired Up — stack reset window"),
  ]),
  flame_gland: mod("flame_gland", [
    line("heat", "weapon_dps", "elemental_from_base_damage", "Flame Gland: heat \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Flame Gland: statusChance \u2014 +60% <DT_FIRE_COLOR>Heat, +60% Status Chance"),
  ]),
  focused_prospectus: mod("focused_prospectus", [
    line("duration", "mod_panel", "multiplicative_percent", "Focused Prospectus: duration \u2014 Fires a beam of energy that deals 900 <DT_FIRE_COLOR>Heat Damage over 4.5s."),
  ]),
  frost_jaw: mod("frost_jaw", [
    line("cold", "weapon_dps", "elemental_from_base_damage", "Frost Jaw: cold \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Frost Jaw: statusChance \u2014 +60% <DT_FREEZE_COLOR>Cold, +60% Status Chance"),
  ]),
  ghost: mod("ghost", [
    line("range", "mod_panel", "multiplicative_percent", "Ghost: range \u2014 Cloaks owner when enemies are within 24m. The cloak is disrupted if owner attack\u2026 (arsenal display only)"),
  ]),
  guardian: mod("guardian", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Guardian: cooldown \u2014 Restores 100% Shields when depleted, 30s cooldown"),
    line("shieldRestore", "mod_panel", "multiplicative_percent", "Guardian: shieldRestore \u2014 Restores 100% Shields when depleted, 30s cooldown"),
  ]),
  hard_engag: mod("hard_engag", [
    line("range", "mod_panel", "multiplicative_percent", "Hard Engage: range \u2014 Engages enemies within 10m with melee attacks, dealing 90 Impact Damage. Melee a\u2026 (arsenal display only)"),
    line("spinDamage", "mod_panel", "multiplicative_percent", "Hard Engage: spinDamage \u2014 Engages enemies within 10m with melee attacks, dealing 90 Impact Damage. Melee a\u2026"),
  ]),
  hastened_deflection: mod("hastened_deflection", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Hastened Deflection — shield recharge/delay (not capacity)"),
  ]),
  helminth_ferocity: mod("helminth_ferocity", [
    line("finisherDamage", "companion_totals", "multiplicative_percent", "Helminth Ferocity: finisherDamage \u2014 +120% Finisher Damage"),
  ]),
  howl: mod("howl", [
    line("duration", "mod_panel", "multiplicative_percent", "Howl: duration \u2014 The kubrow cries out with a blood-curdling howl that strikes fear into 15 enemie\u2026"),
    line("fearDuration", "mod_panel", "multiplicative_percent", "Howl: fearDuration \u2014 The kubrow cries out with a blood-curdling howl that strikes fear into 15 enemie\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Howl: range \u2014 The kubrow cries out with a blood-curdling howl that strikes fear into 15 enemie\u2026 (arsenal display only)"),
  ]),
  hunt: mod("hunt", [
    line("damage", "mod_panel", "multiplicative_percent", "Hunt: damage \u2014 The kubrow charges at a target, dragging them and dealing 120% damage to all in \u2026"),
    line("finisherChance", "mod_panel", "multiplicative_percent", "Hunt: finisherChance \u2014 The kubrow charges at a target, dragging them and dealing 120% damage to all in \u2026"),
  ]),
  hunter_command: mod("hunter_command", [
    line("commandOnStatus", "mod_panel", "multiplicative_percent", "Hunter Command: commandOnStatus \u2014 Applying a Slash Status to an enemy causes the Companion to attack them for 6s."),
    line("duration", "mod_panel", "multiplicative_percent", "Hunter Command: duration \u2014 Applying a Slash Status to an enemy causes the Companion to attack them for 6s."),
  ]),
  hunter_recovery: mod("hunter_recovery", [
    line("damage", "weapon_dps", "multiplicative_percent", "Hunter Recovery: damage \u2014 Warframe healed for +30% Companion Damage dealt"),
    line("lifestealToOwner", "mod_panel", "multiplicative_percent", "Hunter Recovery: lifestealToOwner \u2014 Warframe healed for +30% Companion Damage dealt"),
  ]),
  hunter_synergy: mod("hunter_synergy", [
    line("critLink", "mod_panel", "multiplicative_percent", "wiki: Hunter Synergy — links primary CC to companion (not weapon paper)"),
    line("criticalChance", "mod_panel", "multiplicative_percent", "wiki: Hunter Synergy — companion receives linked CC"),
  ]),
  iatric_mycelium: mod("iatric_mycelium", [
    line("duration", "mod_panel", "multiplicative_percent", "Iatric Mycelium: duration \u2014 Release a trail of spores every <LOWER_IS_BETTER>8s that heal the companion and \u2026"),
  ]),
  immunity_resistance: mod("immunity_resistance", [
    line("statusDamage", "mod_panel", "multiplicative_percent", "wiki: Immunity Resistance \u2014 +50% Status Damage (companion; was wrongly flat damage)"),
  ]),
  infectious_bite: mod("infectious_bite", [
    line("damage", "mod_panel", "multiplicative_percent", "Infectious Bite: damage \u2014 An attack that deals +200% Finisher Damage and infects the target with a Virus t\u2026"),
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Infectious Bite: finisherDamage \u2014 An attack that deals +200% Finisher Damage and infects the target with a Virus t\u2026"),
  ]),
  investigator: mod("investigator", [
    line("duration", "mod_panel", "multiplicative_percent", "Investigator: duration \u2014 Helios Sentinel will scan objects and enemies within 50m over 2.0s. This consume\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Investigator: range \u2014 Helios Sentinel will scan objects and enemies within 50m over 2.0s. This consume\u2026 (arsenal display only)"),
  ]),
  link_armor: mod("link_armor", [
    line("linkArmor", "mod_panel", "multiplicative_percent", "Link Armor: linkArmor \u2014 +10% Link Armor per rank"),
  ]),
  link_fiber: mod("link_fiber", [
    line("armor", "mod_panel", "multiplicative_percent", "wiki: Link Fiber — +125% of Warframe armor (not companion base %)"),
    line("armorLink", "mod_panel", "multiplicative_percent", "Link Fiber: armorLink \u2014 Increase Max Armor by +125% of Warframe's Armor"),
  ]),
  link_redirection: mod("link_redirection", [
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Link Redirection — +125% of Warframe shields (not companion base %)"),
    line("shieldLink", "mod_panel", "multiplicative_percent", "Link Redirection: shieldLink \u2014 Increase Shield by +125% of Warframe's Max Shield"),
  ]),
  link_shields: mod("link_shields", [
    line("linkShields", "mod_panel", "multiplicative_percent", "Link Shields: linkShields \u2014 +10% Link Shields per rank"),
  ]),
  link_vitality: mod("link_vitality", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Link Vitality — +125% of Warframe health (not companion base %)"),
    line("healthLink", "mod_panel", "multiplicative_percent", "Link Vitality: healthLink \u2014 Increase Health by +125% of Warframe's Max Health"),
  ]),
  looter: mod("looter", [
    line("range", "mod_panel", "multiplicative_percent", "Looter: range \u2014 Emits a pulse wave to break open Loot Crates within 22m. (arsenal display only)"),
  ]),
  loyal_companion: mod("loyal_companion", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Loyal Companion: cooldown \u2014 When your Health falls below 35%, gain 75% Damage Reduction for 10s while your C\u2026"),
    line("damageReduction", "mod_panel", "multiplicative_percent", "Loyal Companion: damageReduction \u2014 When your Health falls below 35%, gain 75% Damage Reduction for 10s while your C\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Loyal Companion: duration \u2014 When your Health falls below 35%, gain 75% Damage Reduction for 10s while your C\u2026"),
    line("heat", "mod_panel", "multiplicative_percent", "Loyal Companion: heat \u2014 When your Health falls below 35%, gain 75% Damage Reduction for 10s while your C\u2026"),
  ]),
  loyal_retriever: mod("loyal_retriever", [
    line("pickupDoubleChance", "companion_totals", "multiplicative_percent", "Loyal Retriever: pickupDoubleChance \u2014 13% chance to double Credit and Resource pickups"),
  ]),
  magnetic_strike: mod("magnetic_strike", [
    line("impact", "mod_panel", "multiplicative_percent", "wiki: Magnetic Strike — Impact→Magnetic on companion melee (not IPS)"),
  ]),
  manifold_bond: mod("manifold_bond", [
    line("abilityDamage", "mod_panel", "multiplicative_percent", "wiki: Manifold Bond — precept status / cooldown"),
    line("abilityDuration", "mod_panel", "multiplicative_percent", "wiki: Manifold Bond — precept duration (not WF ability duration)"),
    line("cooldown", "mod_panel", "multiplicative_percent", "wiki: Manifold Bond — precept cooldown"),
  ]),
  martyr_symbiosis: mod("martyr_symbiosis", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Martyr Symbiosis — stored heal on death (not max health)"),
    line("range", "mod_panel", "multiplicative_percent", "wiki: Martyr Symbiosis — corpse drain range"),
  ]),
  maul: mod("maul", [
    line("damage", "weapon_dps", "multiplicative_percent", "Maul: damage \u2014 +330% Melee Damage (duplicate meleeDamage key removed)"),
  ]),
  mecha_empowered: mod("mecha_empowered", [
    line("armorOnMarkKill", "mod_panel", "multiplicative_percent", "Mecha Empowered: armorOnMarkKill \u2014 Increased Pistol Ammo recovery.\\\\nSquad deals +150% extra Damage against a Marke\u2026"),
    line("damage", "mod_panel", "multiplicative_percent", "Mecha Empowered: damage \u2014 Increased Pistol Ammo recovery.\\\\nSquad deals +150% extra Damage against a Marke\u2026"),
  ]),
  mecha_overdrive: mod("mecha_overdrive", [
    line("statusChance", "mod_panel", "multiplicative_percent", "Mecha Overdrive: statusChance \u2014 +60% Primary Weapon Status Chance added to Companion, +90% Status Duration"),
    line("statusDuration", "mod_panel", "multiplicative_percent", "Mecha Overdrive: statusDuration \u2014 +60% Primary Weapon Status Chance added to Companion, +90% Status Duration"),
  ]),
  mecha_recharge: mod("mecha_recharge", [
    line("shield", "warframe_totals", "multiplicative_percent", "Mecha Recharge: shield \u2014 +15% Shield Recharge when Kubrow attacks per rank"),
    line("shieldRechargeLink", "mod_panel", "multiplicative_percent", "Mecha Recharge: shieldRechargeLink \u2014 +15% Shield Recharge when Kubrow attacks per rank"),
  ]),
  medi_pet_kit: mod("medi_pet_kit", [
    line("duration", "mod_panel", "multiplicative_percent", "Medi-Pet Kit: duration \u2014 +12 Companion Health Regen/s\\\\n-15s Companion Recovery Time"),
    line("healthRegen", "mod_panel", "multiplicative_percent", "Medi-Pet Kit: healthRegen \u2014 +12 Companion Health Regen/s\\\\n-15s Companion Recovery Time"),
    line("recoveryTime", "mod_panel", "multiplicative_percent", "Medi-Pet Kit: recoveryTime \u2014 +12 Companion Health Regen/s\\\\n-15s Companion Recovery Time"),
  ]),
  medi_ray: mod("medi_ray", [
    line("duration", "mod_panel", "multiplicative_percent", "Medi-Ray: duration \u2014 Sentinel will occasionally heal its owner, restoring 12% Health over 4s."),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Medi-Ray — heal precept (not max health)"),
    line("healthRestore", "mod_panel", "multiplicative_percent", "Medi-Ray: healthRestore \u2014 Sentinel will occasionally heal its owner, restoring 12% Health over 4s."),
    line("range", "mod_panel", "multiplicative_percent", "Medi-Ray: range \u2014 Sentinel will occasionally heal its owner, restoring 12% Health over 4s. (arsenal display only)"),
  ]),

  melee_prowess_sentinel: mod("melee_prowess_sentinel", [
    line("attackRange", "mod_panel", "multiplicative_percent", "Assault Mode: attackRange \u2014 Sentinel will attack the first visible enemy within 30m."),
    line("range", "mod_panel", "multiplicative_percent", "Assault Mode: range \u2014 Sentinel will attack the first visible enemy within 30m. (arsenal display only)"),
  ]),
  metal_fiber: mod("metal_fiber", [
    line("armor", "warframe_totals", "multiplicative_percent", "wiki: Metal Fiber — +250% Armor at max"),
  ]),
  mischief: mod("mischief", [
    line("damage", "mod_panel", "multiplicative_percent", "Mischief: damage \u2014 Smeeta Kavat becomes invisible for 9s every <LOWER_IS_BETTER>7s while a decoy ka\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Mischief: duration \u2014 Smeeta Kavat becomes invisible for 9s every <LOWER_IS_BETTER>7s while a decoy ka\u2026"),
  ]),
  molecular_conversion: mod("molecular_conversion", [
    line("range", "mod_panel", "multiplicative_percent", "Molecular Conversion: range \u2014 Blast enemies within 10m, converting 200 Damage into Shields for the Warframe. (arsenal display only)"),
  ]),
  momentous_bond: mod("momentous_bond", [
    line("damage", "mod_panel", "multiplicative_percent", "Momentous Bond: damage \u2014 Killing Eximus enemies grants 120% bonus of a random Elemental Damage to your Co\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Momentous Bond: duration \u2014 Killing Eximus enemies grants 120% bonus of a random Elemental Damage to your Co\u2026"),
    line("heavyAttackDamage", "mod_panel", "multiplicative_percent", "Momentous Bond: heavyAttackDamage \u2014 Killing Eximus enemies grants 120% bonus of a random Elemental Damage to your Co\u2026"),
    line("heavyAttackSpeed", "mod_panel", "multiplicative_percent", "Momentous Bond: heavyAttackSpeed \u2014 Killing Eximus enemies grants 120% bonus of a random Elemental Damage to your Co\u2026"),
  ]),
  mystic_bond: mod("mystic_bond", [
    line("energyLeech", "mod_panel", "multiplicative_percent", "Mystic Bond: energyLeech \u2014 After your Companion uses Abilities with cooldowns 5 times, you may cast a Warfr\u2026"),
  ]),
  negate: mod("negate", [
    line("duration", "mod_panel", "multiplicative_percent", "Negate: duration \u2014 Sentinel prevents Status Effects from applying to its owner once every 5s."),
    line("statusImmunity", "mod_panel", "multiplicative_percent", "Negate: statusImmunity \u2014 Sentinel prevents Status Effects from applying to its owner once every 5s."),
  ]),
  neutralize: mod("neutralize", [
    line("disarmChance", "mod_panel", "multiplicative_percent", "Neutralize: disarmChance \u2014 The kubrow roars, causing enemies within 10m to stumble and drop their weapons."),
    line("range", "mod_panel", "multiplicative_percent", "Neutralize: range \u2014 The kubrow roars, causing enemies within 10m to stumble and drop their weapons. (arsenal display only)"),
  ]),
  null_audit: mod("null_audit", [
    line("duration", "mod_panel", "multiplicative_percent", "Null Audit: duration \u2014 The Hound utilizes the same Aura and Abilities as an Eximus enemy for 60s, while\u2026"),
  ]),

  odomedic: mod("odomedic", [
    line("duration", "mod_panel", "multiplicative_percent", "Odomedic: duration \u2014 Every 3m traversed by Wall Running regenerates +40 Health over 4s. This effect c\u2026"),
    line("healthRestoreMove", "mod_panel", "multiplicative_percent", "Odomedic: healthRestoreMove \u2014 Every 3m traversed by Wall Running regenerates +40 Health over 4s. This effect c\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Odomedic: range \u2014 Every 3m traversed by Wall Running regenerates +40 Health over 4s. This effect c\u2026 (arsenal display only)"),
  ]),
  pack_leader: mod("pack_leader", [
    line("healOnMelee", "mod_panel", "multiplicative_percent", "Pack Leader: healOnMelee \u2014 Heal your Companion with Melee hits. Excess healing grants Overguard.\\\\n+100 Hea\u2026"),
  ]),
  panzer_devolution: mod("panzer_devolution", [
    line("duration", "mod_panel", "multiplicative_percent", "Panzer Devolution: duration \u2014 Devolves into its larval form when downed and attacks enemies with quills, deali\u2026"),
  ]),
  paralytic_spores: mod("paralytic_spores", [
    line("duration", "mod_panel", "multiplicative_percent", "Paralytic Spores: duration \u2014 Charges at an enemy within 30m dealing 160 damage. This releases spores that aff\u2026"),
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Paralytic Spores: explosionDamage \u2014 Charges at an enemy within 30m dealing 160 damage. This releases spores that aff\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Paralytic Spores: range \u2014 Charges at an enemy within 30m dealing 160 damage. This releases spores that aff\u2026 (arsenal display only)"),
  ]),
  pounce: mod("pounce", [
    line("damage", "mod_panel", "multiplicative_percent", "Pounce: damage \u2014 The Kavat pounces at an enemy, dealing 90% Damage and stunning them for a short \u2026"),
  ]),
  primed_animal_instinct: mod("primed_animal_instinct", [
    line("enemyRadar", "mod_panel", "flat", "Primed Animal Instinct: +3m Enemy Radar per rank, +33m at rank 10"),
    line("lootRadar", "mod_panel", "flat", "Primed Animal Instinct: +5m Loot Radar per rank, +55m at rank 10"),
  ]),
  primed_pack_leader: mod("primed_pack_leader", [
    line("healOnMelee", "mod_panel", "multiplicative_percent", "Primed Pack Leader: healOnMelee \u2014 Heal your Companion with Melee hits. Excess healing grants Overguard.\\\\n+183 Hea\u2026"),
  ]),
  primed_regen: mod("primed_regen", [
    line("duration", "mod_panel", "multiplicative_percent", "Primed Regen: duration \u2014 Sentinel recovery time reduced by 35s. Revives with 10s of invulnerability."),
    line("healthPercent", "mod_panel", "multiplicative_percent", "Primed Regen: healthPercent \u2014 Sentinel recovery time reduced by 35s. Revives with 10s of invulnerability."),
    line("regenCharges", "mod_panel", "multiplicative_percent", "Primed Regen: regenCharges \u2014 Sentinel recovery time reduced by 35s. Revives with 10s of invulnerability."),
  ]),
  proboscis: mod("proboscis", [
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Proboscis: explosionDamage \u2014 Helminth Charger whips a proboscis out at an enemy within 30m, pulling them back\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Proboscis: range \u2014 Helminth Charger whips a proboscis out at an enemy within 30m, pulling them back\u2026 (arsenal display only)"),
  ]),
  prosperous_retriever: mod("prosperous_retriever", [
    line("creditPickupDoubleChance", "companion_totals", "multiplicative_percent", "Prosperous Retriever: creditPickupDoubleChance \u2014 18% chance to double Credit pickups"),
  ]),
  protect: mod("protect", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Protect: cooldown \u2014 The kubrow comes to the defense of its master, replenishing both of their shield\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Protect: duration \u2014 The kubrow comes to the defense of its master, replenishing both of their shield\u2026"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Protect — shield restore precept (not capacity)"),
    line("shieldRestore", "mod_panel", "multiplicative_percent", "Protect: shieldRestore \u2014 The kubrow comes to the defense of its master, replenishing both of their shield\u2026"),
  ]),
  reawaken: mod("reawaken", [
    line("autoRevive", "mod_panel", "multiplicative_percent", "Reawaken: autoRevive \u2014 Energy Orbs reduce Sentinel Recovery timer by 6s. Djinn recovers with 300 Oversh\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Reawaken: duration \u2014 Energy Orbs reduce Sentinel Recovery timer by 6s. Djinn recovers with 300 Oversh\u2026"),
  ]),
  reflect: mod("reflect", [
    line("damage", "mod_panel", "multiplicative_percent", "Reflect: damage \u2014 Adarza Kavat has a 40% chance to reflect damage back to an enemy, amplifying it \u2026"),
    line("damageReflection", "mod_panel", "multiplicative_percent", "Reflect: damageReflection \u2014 Adarza Kavat has a 40% chance to reflect damage back to an enemy, amplifying it \u2026"),
  ]),
  reflex_denial: mod("reflex_denial", [
    line("damage", "mod_panel", "multiplicative_percent", "Reflex Denial: damage \u2014 Generates a shield that reflects 90% Damage taken in pulses over 10s as <DT_MAGN\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Reflex Denial: duration \u2014 Generates a shield that reflects 90% Damage taken in pulses over 10s as <DT_MAGN\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Reflex Denial: range \u2014 Generates a shield that reflects 90% Damage taken in pulses over 10s as <DT_MAGN\u2026 (arsenal display only)"),
  ]),
  regen: mod("regen", [
    line("duration", "mod_panel", "multiplicative_percent", "Regen: duration \u2014 Sentinel recovery time reduced by 20s. Revives with 10s of invulnerability."),
    line("healthPercent", "mod_panel", "multiplicative_percent", "Regen: healthPercent \u2014 Sentinel recovery time reduced by 20s. Revives with 10s of invulnerability."),
    line("regenCharges", "mod_panel", "multiplicative_percent", "Regen: regenCharges \u2014 Sentinel recovery time reduced by 20s. Revives with 10s of invulnerability."),
  ]),
  reinforced_bond: mod("reinforced_bond", [
    line("overguard", "mod_panel", "multiplicative_percent", "wiki: Reinforced Bond — overguard on revive"),
    line("reviveOverguard", "mod_panel", "multiplicative_percent", "wiki: Reinforced Bond — overguard on revive"),
    line("shield", "mod_panel", "multiplicative_percent", "wiki: Reinforced Bond — companion shield threshold for fire rate (not WF shields)"),
  ]),
  repair_kit: mod("repair_kit", [
    line("healthRegen", "mod_panel", "multiplicative_percent", "Repair Kit: healthRegen \u2014 +18 Companion Health Regen/s"),
  ]),
  repo_audit: mod("repo_audit", [
    line("range", "mod_panel", "multiplicative_percent", "Repo Audit: range \u2014 Emits a magnetic pulse that disarms enemies within 30m. (arsenal display only)"),
  ]),
  resourceful_retriever: mod("resourceful_retriever", [
    line("resourcePickupDoubleChance", "companion_totals", "multiplicative_percent", "Resourceful Retriever: resourcePickupDoubleChance \u2014 18% chance to double Resource pickups"),
  ]),
  restorative_bond: mod("restorative_bond", [
    line("duration", "mod_panel", "multiplicative_percent", "Restorative Bond: duration \u2014 Health Orbs restore 60 more health and reduce Companion Recovery Time by 3s."),
    line("healthOnKill", "mod_panel", "multiplicative_percent", "Restorative Bond: healthOnKill \u2014 Health Orbs restore 60 more health and reduce Companion Recovery Time by 3s."),
    line("restoreNearby", "mod_panel", "multiplicative_percent", "Restorative Bond: restoreNearby \u2014 Health Orbs restore 60 more health and reduce Companion Recovery Time by 3s."),
  ]),
  retrieve: mod("retrieve", [
    line("duration", "mod_panel", "multiplicative_percent", "Retrieve: duration \u2014 Kubrow has 45% chance to scavenge additional loot from a fallen enemy or contain\u2026"),
    line("lootFetch", "mod_panel", "multiplicative_percent", "Retrieve: lootFetch \u2014 Kubrow has 45% chance to scavenge additional loot from a fallen enemy or contain\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Retrieve: range \u2014 Kubrow has 45% chance to scavenge additional loot from a fallen enemy or contain\u2026 (arsenal display only)"),
  ]),
  sacrifice: mod("sacrifice", [
    line("duration", "mod_panel", "multiplicative_percent", "Sacrifice: duration \u2014 Sentinel incapacitates itself to revive its downed owner to 100% health and shie\u2026"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Sacrifice — revive precept (not max health)"),
    line("revive", "mod_panel", "multiplicative_percent", "Sacrifice: revive \u2014 Sentinel incapacitates itself to revive its downed owner to 100% health and shie\u2026"),
  ]),
  sanctuary: mod("sanctuary", [
    line("bubbleHealth", "mod_panel", "multiplicative_percent", "Sanctuary: bubbleHealth \u2014 Creates a shield with 1800 Health around the player when they are reviving falle\u2026"),
    line("rechargeDelay", "mod_panel", "multiplicative_percent", "Sanctuary: rechargeDelay \u2014 Creates a shield with 1800 Health around the player when they are reviving falle\u2026"),
  ]),
  savagery: mod("savagery", [
    line("finisherDamage", "mod_panel", "multiplicative_percent", "Savagery: finisherDamage \u2014 The Kubrow rushes at 8 enemies within 10m, dealing damage and knocking them over\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Savagery: range \u2014 The Kubrow rushes at 8 enemies within 10m, dealing damage and knocking them over\u2026 (arsenal display only)"),
  ]),
  scan_matter: mod("scan_matter", [
    line("duration", "mod_panel", "multiplicative_percent", "Scan Matter: duration \u2014 Reveals resource containers and mineral deposits within 60m. Automatically break\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Scan Matter: range \u2014 Reveals resource containers and mineral deposits within 60m. Automatically break\u2026 (arsenal display only)"),
  ]),
  scan_organic: mod("scan_organic", [
    line("scanChance", "mod_panel", "multiplicative_percent", "Scan Organic Lifeforms: scanChance \u2014 +10% Scan Chance per rank"),
  ]),
  scavenge: mod("scavenge", [
    line("ammoChance", "mod_panel", "multiplicative_percent", "Scavenge: ammoChance \u2014 +90% chance for the pet to pry open a locked locker."),
  ]),
  security_override: mod("security_override", [
    line("duration", "mod_panel", "multiplicative_percent", "Security Override: duration \u2014 Auto-hacks consoles over 2s. 30% chance to mind control basic robotic enemies an\u2026"),
    line("hackSpeed", "mod_panel", "multiplicative_percent", "Security Override: hackSpeed \u2014 Auto-hacks consoles over 2s. 30% chance to mind control basic robotic enemies an\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Security Override: range \u2014 Auto-hacks consoles over 2s. 30% chance to mind control basic robotic enemies an\u2026 (arsenal display only)"),
  ]),
  seismic_bond: mod("seismic_bond", [
    line("damage", "mod_panel", "multiplicative_percent", "Seismic Bond: damage \u2014 While a channeled Ability is active, Companion melee attacks create a 4m shockwa\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Seismic Bond: duration \u2014 While a channeled Ability is active, Companion melee attacks create a 4m shockwa\u2026"),
    line("knockdownDuration", "mod_panel", "multiplicative_percent", "Seismic Bond: knockdownDuration \u2014 While a channeled Ability is active, Companion melee attacks create a 4m shockwa\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Seismic Bond: range \u2014 While a channeled Ability is active, Companion melee attacks create a 4m shockwa\u2026 (arsenal display only)"),
  ]),
  self_destruct: mod("self_destruct", [
    line("blastDamage", "mod_panel", "multiplicative_percent", "Self Destruct: blastDamage \u2014 Explodes when incapacitated, dealing 600 Blast Damage in a 18m radius and knocki\u2026"),
    line("radius", "mod_panel", "multiplicative_percent", "Self Destruct: radius \u2014 Explodes when incapacitated, dealing 600 Blast Damage in a 18m radius and knocki\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Self Destruct: range \u2014 Explodes when incapacitated, dealing 600 Blast Damage in a 18m radius and knocki\u2026 (arsenal display only)"),
  ]),
  sepsis_claws: mod("sepsis_claws", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Sepsis Claws: statusChance \u2014 +330% <DT_POISON_COLOR>Toxin, +330% Status Chance, Converts all elemental damage\u2026"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Sepsis Claws: toxin \u2014 +330% <DT_POISON_COLOR>Toxin, +330% Status Chance, Converts all elemental damage\u2026"),
  ]),
  sharpened_claws: mod("sharpened_claws", [
    line("damage", "mod_panel", "multiplicative_percent", "Sharpened Claws: damage \u2014 A vicious attack dealing 300% damage that sunders armor by 120% and rends flesh."),
  ]),
  shelter: mod("shelter", [
    line("reviveShieldHealth", "mod_panel", "flat", "wiki: Shelter — revive bubble HP (precept)"),
  ]),
  shield_charger: mod("shield_charger", [
    line("duration", "mod_panel", "multiplicative_percent", "Shield Charger: duration \u2014 Increase Warframe Max Shields and Shield Regeneration by 60% for 10s."),
    line("overshields", "mod_panel", "multiplicative_percent", "Shield Charger: overshields \u2014 Increase Warframe Max Shields and Shield Regeneration by 60% for 10s."),
    line("range", "mod_panel", "multiplicative_percent", "Shield Charger: range \u2014 Increase Warframe Max Shields and Shield Regeneration by 60% for 10s. (arsenal display only)"),
  ]),
  shock_collar: mod("shock_collar", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Shock Collar: electricity \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Shock Collar: statusChance \u2014 +60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance"),
  ]),
  shocking_claws: mod("shocking_claws", [
    line("electricity", "weapon_dps", "elemental_from_base_damage", "Shocking Claws: electricity \u2014 +330% <DT_ELECTRICITY_COLOR>Electricity, +330% Status Chance, Converts all eleme\u2026"),
    line("statusChance", "weapon_dps", "multiplicative_percent", "Shocking Claws: statusChance \u2014 +330% <DT_ELECTRICITY_COLOR>Electricity, +330% Status Chance, Converts all eleme\u2026"),
  ]),
  shockwave_actuators_r3: mod("shockwave_actuators_r3", [
    line("duration", "mod_panel", "multiplicative_percent", "Shockwave Actuators: duration \u2014 Blasts a shockwave knocking down those within 12m. The shockwave recharges every\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Shockwave Actuators: range \u2014 Blasts a shockwave knocking down those within 12m. The shockwave recharges every\u2026 (arsenal display only)"),
  ]),
  sly_devolution: mod("sly_devolution", [
    line("duration", "mod_panel", "multiplicative_percent", "Sly Devolution: duration \u2014 Devolves into its larval form when downed and regains its true form after 30s. Y\u2026"),
  ]),
  spare_parts: mod("spare_parts", [
    line("duration", "mod_panel", "multiplicative_percent", "Spare Parts: duration \u2014 Companion marks a target every 15s for 15s. The target becomes 200% more likely \u2026"),
    line("lootChance", "mod_panel", "multiplicative_percent", "Spare Parts: lootChance \u2014 Companion marks a target every 15s for 15s. The target becomes 200% more likely \u2026"),
  ]),
  stalk: mod("stalk", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Stalk: cooldown \u2014 The kubrow cloaks itself and its master to stalk down its prey when they are wit\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Stalk: range \u2014 The kubrow cloaks itself and its master to stalk down its prey when they are wit\u2026 (arsenal display only)"),
    line("stealthDuration", "mod_panel", "multiplicative_percent", "Stalk: stealthDuration \u2014 The kubrow cloaks itself and its master to stalk down its prey when they are wit\u2026"),
  ]),
  stasis_field: mod("stasis_field", [
    line("damage", "mod_panel", "multiplicative_percent", "Stasis Field: damage \u2014 Creates a stasis field for 30s. While inside the field, all enemy projectiles mo\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Stasis Field: duration \u2014 Creates a stasis field for 30s. While inside the field, all enemy projectiles mo\u2026"),
    line("fieldDuration", "mod_panel", "multiplicative_percent", "Stasis Field: fieldDuration \u2014 Creates a stasis field for 30s. While inside the field, all enemy projectiles mo\u2026"),
  ]),
  strain_eruption: mod("strain_eruption", [
    line("damage", "mod_panel", "multiplicative_percent", "Strain Eruption: damage \u2014 Maggots explode on death, dealing 4% of an enemy's current Health as <DT_CORROSI\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Strain Eruption: range \u2014 Maggots explode on death, dealing 4% of an enemy's current Health as <DT_CORROSI\u2026 (arsenal display only)"),
  ]),
  strain_fever: mod("strain_fever", [
    line("damage", "mod_panel", "multiplicative_percent", "Strain Fever: damage \u2014 Helminth Charger gains +40% Damage per Cyst."),
  ]),
  survival_instinct: mod("survival_instinct", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Survival Instinct: cooldown \u2014 On Bullet Jump:\\\\nEnemies lose sight of you for 1.5s. <LOWER_IS_BETTER>5s cooldo\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Survival Instinct: duration \u2014 On Bullet Jump:\\\\nEnemies lose sight of you for 1.5s. <LOWER_IS_BETTER>5s cooldo\u2026"),
  ]),
  swipe: mod("swipe", [
    line("range", "mod_panel", "multiplicative_percent", "Swipe: range \u2014 Strikes 4 additional enemies and increases Attack Range by 2m. (arsenal display only)"),
  ]),
  synergized_prospectus: mod("synergized_prospectus", [
    line("range", "mod_panel", "multiplicative_percent", "Synergized Prospectus: range \u2014 Fires a spark that seeks out the nearest enemy in 30m, dealing 300 <DT_ELECTRICI\u2026 (arsenal display only)"),
  ]),
  synth_deconstruct: mod("synth_deconstruct", [
    line("health", "mod_panel", "multiplicative_percent", "wiki: Synth Deconstruct — health orb drop chance (not max health)"),
    line("healthOrbChance", "mod_panel", "multiplicative_percent", "wiki: Synth Deconstruct — health orb drop chance"),
  ]),
  synth_fiber: mod("synth_fiber", [
    line("duration", "mod_panel", "multiplicative_percent", "Synth Fiber: duration \u2014 Health Orbs increase Armor for Companions by 100% for 12s."),
    line("healthPickupBonus", "mod_panel", "multiplicative_percent", "Synth Fiber: healthPickupBonus \u2014 Health Orbs increase Armor for Companions by 100% for 12s."),
  ]),
  tandem_bond: mod("tandem_bond", [
    line("duration", "mod_panel", "multiplicative_percent", "Tandem Bond: duration \u2014 Companion melee hits increase your Combo by 6. Heavy Attacks increase Companion \u2026"),
  ]),

  targeting_receptor: mod("targeting_receptor", [
    line("range", "mod_panel", "multiplicative_percent", "Targeting Receptor: range \u2014 Causes the Helios Sentinel to attack targets within 10m with 3 glaives. (arsenal display only)"),
    line("targetRange", "mod_panel", "multiplicative_percent", "Targeting Receptor: targetRange \u2014 Causes the Helios Sentinel to attack targets within 10m with 3 glaives."),
  ]),

  tek_assault_r3: mod("tek_assault_r3", [
    line("damage", "mod_panel", "multiplicative_percent", "Tek Assault: damage \u2014 Kavat has 60% chance to ignore Lethal Damage and be immune for 4s."),
    line("duration", "mod_panel", "multiplicative_percent", "Tek Assault: duration \u2014 Kavat has 60% chance to ignore Lethal Damage and be immune for 4s."),
  ]),
  tek_enhance: mod("tek_enhance", [
    line("abilityDuration", "mod_panel", "multiplicative_percent", "wiki: Tek Enhance — +30% Kavat/Vulpaphyla Ability Duration (Tek set piece #4)"),
  ]),
  tenacious_bond: mod("tenacious_bond", [
    line("criticalMultiplier", "mod_panel", "multiplicative_percent", "Tenacious Bond: criticalMultiplier \u2014 Headshot kills reduce Companion Recovery timer by 3s. If the Companion's Critica\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Tenacious Bond: duration \u2014 Headshot kills reduce Companion Recovery timer by 3s. If the Companion's Critica\u2026"),
    line("headshotCritDamage", "mod_panel", "multiplicative_percent", "Tenacious Bond: headshotCritDamage \u2014 Headshot kills reduce Companion Recovery timer by 3s. If the Companion's Critica\u2026"),
    line("mercyCritDamage", "mod_panel", "multiplicative_percent", "Tenacious Bond: mercyCritDamage \u2014 Headshot kills reduce Companion Recovery timer by 3s. If the Companion's Critica\u2026"),
  ]),
  territorial_aggression_r3: mod("territorial_aggression_r3", [
    line("duration", "mod_panel", "multiplicative_percent", "Territorial Aggression: duration \u2014 The Kavat stakes their territory in a radius of 6m for 15s. Each second, enemies\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Territorial Aggression: range \u2014 The Kavat stakes their territory in a radius of 6m for 15s. Each second, enemies\u2026 (arsenal display only)"),
  ]),
  thumper: mod("thumper", [
    line("range", "mod_panel", "multiplicative_percent", "Thumper: range \u2014 Djinn will attack the first visible enemy within 60m. (arsenal display only)"),
  ]),
  tractor_beam: mod("tractor_beam", [
    line("aimGlideDuration", "mod_panel", "multiplicative_percent", "Tractor Beam: aimGlideDuration \u2014 +100% Aim Glide Duration"),
    line("gravityReduction", "mod_panel", "multiplicative_percent", "Tractor Beam: gravityReduction \u2014 -50% Gravity"),
  ]),
  trample: mod("trample", [
    line("damage", "mod_panel", "multiplicative_percent", "Trample: damage \u2014 The Helminth Charger rushes an enemy, dealing 160 Damage to all in its path. It \u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Trample: duration \u2014 The Helminth Charger rushes an enemy, dealing 160 Damage to all in its path. It \u2026"),
    line("explosionDamage", "mod_panel", "multiplicative_percent", "Trample: explosionDamage \u2014 The Helminth Charger rushes an enemy, dealing 160 Damage to all in its path. It \u2026"),
  ]),
  transfusion: mod("transfusion", [
    line("cooldown", "mod_panel", "multiplicative_percent", "wiki: Transfusion — bleedout revive precept"),
    line("health", "mod_panel", "multiplicative_percent", "wiki: Transfusion — HP sacrifice (not max health)"),
    line("reviveChance", "mod_panel", "multiplicative_percent", "wiki: Transfusion — revive chance"),
  ]),
  unleashed: mod("unleashed", [
    line("damage", "mod_panel", "multiplicative_percent", "Unleashed: damage \u2014 The kubrow hunts for Eximus units protected by Overguard within 60m and deals +3\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Unleashed: range \u2014 The kubrow hunts for Eximus units protected by Overguard within 60m and deals +3\u2026 (arsenal display only)"),
    line("vipCapture", "mod_panel", "multiplicative_percent", "Unleashed: vipCapture \u2014 The kubrow hunts for Eximus units protected by Overguard within 60m and deals +3\u2026"),
  ]),
  vacuum: mod("vacuum", [
    line("pickupRange", "mod_panel", "multiplicative_percent", "Vacuum: pickupRange \u2014 13.5m Companion Gather-Link. Detects and collects items, including mods."),
    line("range", "mod_panel", "multiplicative_percent", "Vacuum: range \u2014 13.5m Companion Gather-Link. Detects and collects items, including mods. (arsenal display only)"),
  ]),
  fetch: mod("fetch", [
    line("pickupRange", "mod_panel", "multiplicative_percent", "Fetch: pickupRange \u2014 13.5m Companion Gather-Link. Detects and collects items, including mods."),
    line("range", "mod_panel", "multiplicative_percent", "Fetch: range \u2014 13.5m Companion Gather-Link. Detects and collects items, including mods. (arsenal display only)"),
  ]),
  vaporize: mod("vaporize", [
    line("duration", "mod_panel", "multiplicative_percent", "Vaporize: duration \u2014 Every 10s the sentinel will stun and inflict 600 damage to an enemy within 30m. \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Vaporize: range \u2014 Every 10s the sentinel will stun and inflict 600 damage to an enemy within 30m. \u2026 (arsenal display only)"),
  ]),
  venom_teeth: mod("venom_teeth", [
    line("statusChance", "weapon_dps", "multiplicative_percent", "Venom Teeth: statusChance \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
    line("toxin", "weapon_dps", "elemental_from_base_damage", "Venom Teeth: toxin \u2014 +60% <DT_POISON_COLOR>Toxin, +60% Status Chance"),
  ]),
  vicious_bond: mod("vicious_bond", [
    line("damage", "mod_panel", "multiplicative_percent", "Vicious Bond: damage \u2014 Companion melee attacks strip 15% of enemy armor. Enemies recently damaged by Ab\u2026"),
    line("meleeAttackSpeed", "mod_panel", "multiplicative_percent", "Vicious Bond: meleeAttackSpeed \u2014 Companion melee attacks strip 15% of enemy armor. Enemies recently damaged by Ab\u2026"),
    line("meleeDamage", "mod_panel", "multiplicative_percent", "wiki: Vicious Bond — armor strip / spread (not always-on melee damage)"),
    line("range", "mod_panel", "multiplicative_percent", "Vicious Bond: range \u2014 Companion melee attacks strip 15% of enemy armor. Enemies recently damaged by Ab\u2026 (arsenal display only)"),
  ]),
  viral_quills: mod("viral_quills", [
    line("cooldown", "mod_panel", "multiplicative_percent", "Viral Quills: cooldown \u2014 Launches 6 quills at enemies within 20m, each dealing 60 <DT_VIRAL_COLOR>Viral D\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Viral Quills: range \u2014 Launches 6 quills at enemies within 20m, each dealing 60 <DT_VIRAL_COLOR>Viral D\u2026 (arsenal display only)"),
    line("statusChance", "mod_panel", "multiplicative_percent", "Viral Quills: statusChance \u2014 Launches 6 quills at enemies within 20m, each dealing 60 <DT_VIRAL_COLOR>Viral D\u2026"),
  ]),
  volatile_parasite: mod("volatile_parasite", [
    line("damage", "mod_panel", "multiplicative_percent", "Volatile Parasite: damage \u2014 Every <LOWER_IS_BETTER>15s spits out a maggot that latches onto the nearest enem\u2026"),
    line("duration", "mod_panel", "multiplicative_percent", "Volatile Parasite: duration \u2014 Every <LOWER_IS_BETTER>15s spits out a maggot that latches onto the nearest enem\u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Volatile Parasite: range \u2014 Every <LOWER_IS_BETTER>15s spits out a maggot that latches onto the nearest enem\u2026 (arsenal display only)"),
  ]),
  whiplash_mine_r3: mod("whiplash_mine_r3", [
    line("duration", "mod_panel", "multiplicative_percent", "Whiplash Mine: duration \u2014 Deploys a tether mine snaring all enemies in a 20m. After 3s, all enemies still \u2026"),
    line("range", "mod_panel", "multiplicative_percent", "Whiplash Mine: range \u2014 Deploys a tether mine snaring all enemies in a 20m. After 3s, all enemies still \u2026 (arsenal display only)"),
  ]),
};
