/**
 * Per-arcane effect apply rules — one entry per arcane, one line per effect stat.
 * Regenerate: python scripts/generate_arcane_behaviors.py
 *
 * Edit individual lines here only — no blanket stat rules.
 */
import type { VerifiedArcaneBehavior } from "@/lib/codex/item-behavior-types";

export const VERIFIED_ARCANE_BEHAVIORS: Record<string, VerifiedArcaneBehavior> = {

  "akimbo_slip_shot": {
    arcaneId: "akimbo_slip_shot",
    effects: [
      {"statKey": "ammoEfficiency", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Akimbo Slip Shot — +65% Ammo Efficiency while sliding/aim gliding (paper assumes active)"},
    ],
  },
  "arcane_acceleration": {
    arcaneId: "arcane_acceleration",
    customHandler: "arcane_acceleration",
    effects: [
      {"statKey": "fireRate", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Acceleration — +90% primary FR for 9s on crit (excl. shotguns; paper: stacks>0 = buff up)"},
      {"statKey": "holsterDamage", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Arcane Acceleration: holsterDamage (legacy/display)"},
      {"statKey": "fireRateOnCrit", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Acceleration — 30% proc chance on crit"},
    ],
  },
  "arcane_aegis": {
    arcaneId: "arcane_aegis",
    customHandler: "arcane_aegis",
    effects: [
      {"statKey": "shieldRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Arcane Aegis — 3% chance on shield damage (panel)"},
      {"statKey": "shieldRegenAmount", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Aegis — +30% shield recharge for 12s (paper: equipped = buff up; additive to innate 5%)"},
    ],
  },
  "arcane_agility": {
    arcaneId: "arcane_agility",
    customHandler: "arcane_agility",
    effects: [
      {"statKey": "parkourProcChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Arcane Agility — 60% chance on damaged (panel)"},
      {"statKey": "parkourVelocity", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Agility — +60% Parkour Velocity for 18s (paper: equipped = buff up)"},
    ],
  },
  "arcane_arachne": {
    arcaneId: "arcane_arachne",
    customHandler: "arcane_arachne",
    effects: [
      {"statKey": "wallLatchDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Arachne — +150% damage while wall-latched (paper: stacks>0 = latched)"},
    ],
  },
  "arcane_avenger": {
    arcaneId: "arcane_avenger",
    customHandler: "arcane_avenger",
    effects: [
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Avenger — absolute +45% CC for 12s on damaged (paper: stacks>0 = buff up)"},
    ],
  },
  "arcane_awakening": {
    arcaneId: "arcane_awakening",
    customHandler: "arcane_awakening",
    effects: [
      {"statKey": "holsterDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Awakening — +150% secondary damage for 24s on reload (paper: stacks>0 = buff up)"},
    ],
  },
  "arcane_barrier": {
    arcaneId: "arcane_barrier",
    customHandler: "arcane_barrier",
    effects: [
      {"statKey": "shieldRestoreChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Barrier — 1–6% chance to fully restore shields on shield damage"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Barrier — 1–6s cooldown by rank"},
    ],
  },
  "arcane_battery": {
    arcaneId: "arcane_battery",
    customHandler: "arcane_battery",
    effects: [
      {"statKey": "energyPerArmor", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Battery — +0.3 Max Energy / Armor at R5 (cap +1000)"},
    ],
  },
  "arcane_bellicose": {
    arcaneId: "arcane_bellicose",
    customHandler: "arcane_bellicose",
    effects: [
      {"statKey": "abilityStrengthPerHealth", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Bellicose — round(HP÷250×STR%) capped (R5 72%)"},
      {"statKey": "abilityStrengthPerHealthStep", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Bellicose — 250 Health divisor"},
      {"statKey": "abilityStrengthMaximum", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Bellicose — Ability Strength Maximum (R5 72%)"},
    ],
  },
  "arcane_blade_charger": {
    arcaneId: "arcane_blade_charger",
    customHandler: "arcane_blade_charger",
    effects: [
      {"statKey": "meleeDamageChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Blade Charger — 30% chance on primary kill"},
      {"statKey": "meleeDamageBonus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Blade Charger — +300% melee damage for 12s (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Blade Charger — 12s buff duration"},
    ],
  },
  "arcane_blessing": {
    arcaneId: "arcane_blessing",
    effects: [
      {"statKey": "healthFlat", "target": "warframe_totals", "mode": "flat", "source": "wiki: Arcane Blessing — +24 Max Health / pickup (cap 50 → +1200; paper assumes max stacks)"},
    ],
  },
  "arcane_bodyguard": {
    arcaneId: "arcane_bodyguard",
    customHandler: "arcane_bodyguard",
    effects: [
      {"statKey": "companionHeal", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Bodyguard — heal companion 150–900 after 6 melee kills in 30s"},
      {"statKey": "companionHealKillThreshold", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Bodyguard — 6 melee kills (constant)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Bodyguard — 30s window (constant)"},
    ],
  },
  "arcane_camisado": {
    arcaneId: "arcane_camisado",
    effects: [
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Arcane Camisado — +6% STR/summon attack stack (cap 10 → +60%; paper assumes max stacks)"},
    ],
  },
  "arcane_circumvent": {
    arcaneId: "arcane_circumvent",
    customHandler: "arcane_circumvent",
    effects: [
      {"statKey": "armorSteal", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Circumvent — steal 25–50% defenses on roll"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Circumvent — 15s armor buff duration"},
      {"statKey": "armorStealCap", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Circumvent — armor buff cap 1000 (paper: equipped = SP roll → +1000 flat armor)"},
      {"statKey": "overguardStealCap", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Circumvent — Overguard steal cap 10000"},
    ],
  },
  "arcane_concentration": {
    arcaneId: "arcane_concentration",
    customHandler: "arcane_concentration",
    effects: [
      {"statKey": "abilityDuration", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Concentration — +60% DUR for 3s after cast (paper: equipped = buff up for next ability)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Arcane Concentration — 3s buff (panel)"},
    ],
  },
  "arcane_consequence": {
    arcaneId: "arcane_consequence",
    customHandler: "arcane_consequence",
    effects: [
      {"statKey": "parkourVelocity", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Consequence — +60% Parkour Velocity for 18s on headshot (paper: equipped = buff up)"},
    ],
  },
  "arcane_crepuscular": {
    arcaneId: "arcane_crepuscular",
    customHandler: "arcane_crepuscular",
    effects: [
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Crepuscular — +30% Ability Strength while invisible (paper: stacks>0 / equipped on warframe = invisible)"},
      {"statKey": "criticalMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Crepuscular — +3 final crit mult while invisible (paper: stacks>0 = invisible)"},
    ],
  },
  "arcane_deflection": {
    arcaneId: "arcane_deflection",
    customHandler: "arcane_deflection",
    effects: [
      {"statKey": "statusResistance", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Deflection — 17–102% chance to resist Radiation"},
    ],
  },
  "arcane_double_back": {
    arcaneId: "arcane_double_back",
    customHandler: "arcane_double_back",
    effects: [
      {"statKey": "damageReduction", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Double Back — +25% DR/maneuver stack (cap 3 → +75%; paper assumes max stacks; multiplies with armor DR)"},
    ],
  },
  "arcane_energize": {
    arcaneId: "arcane_energize",
    customHandler: "arcane_energize",
    effects: [
      {"statKey": "energyPickupChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Energize — 60% chance on Energy Orb (constant)"},
      {"statKey": "energyOrbBonus", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Energize — replenish 25–150 Energy to self"},
      {"statKey": "allyEnergy", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Energize — same Energy to allies in radius"},
      {"statKey": "allyEnergyRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Energize — 15m ally radius (constant)"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Energize — 15s cooldown (constant)"},
    ],
  },
  "arcane_eruption": {
    arcaneId: "arcane_eruption",
    customHandler: "arcane_eruption",
    effects: [
      {"statKey": "knockdownChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Eruption — 17–100% knockdown on Energy Orb pickup"},
      {"statKey": "radialAttackRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Eruption — 5–30m radius"},
    ],
  },
  "arcane_escapist": {
    arcaneId: "arcane_escapist",
    customHandler: "arcane_escapist",
    effects: [
      {"statKey": "escapistStackCap", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Escapist — stack cap 9 (constant)"},
      {"statKey": "invulnerabilityDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Escapist — 2–12s invuln after consuming 3 stacks on fatal"},
      {"statKey": "escapistStacksConsumed", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Escapist — consume 3 stacks (constant)"},
    ],
  },
  "arcane_expertise": {
    arcaneId: "arcane_expertise",
    customHandler: "arcane_expertise",
    effects: [
      {"statKey": "abilityStrengthToShield", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Expertise — shields += (STR−100%) × conversion (R5 100%)"},
    ],
  },
  "arcane_fury": {
    arcaneId: "arcane_fury",
    customHandler: "arcane_fury",
    effects: [
      {"statKey": "meleeDamageBonus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Fury — +180% melee damage for 18s on crit (paper: stacks>0 = buff up)"},
      {"statKey": "meleeDamageChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Fury — 60% chance on crit"},
    ],
  },
  "arcane_grace": {
    arcaneId: "arcane_grace",
    customHandler: "arcane_grace",
    effects: [
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Arcane Grace — 9% chance on damaged (panel)"},
      {"statKey": "healthRegenAmount", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Grace — +6% max HP/s regen (paper: equipped = buff up)"},
    ],
  },
  "arcane_guardian": {
    arcaneId: "arcane_guardian",
    customHandler: "arcane_guardian",
    effects: [
      {"statKey": "armorBonusChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Arcane Guardian — 15% chance on damaged (panel)"},
      {"statKey": "flatArmorBonus", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Guardian — +900 flat Armor (paper: equipped = buff up)"},
    ],
  },
  "arcane_healing": {
    arcaneId: "arcane_healing",
    customHandler: "arcane_healing",
    effects: [
      {"statKey": "statusResistance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Healing — 17–102% chance to resist Slash (panel)"},
    ],
  },
  "arcane_hot_shot": {
    arcaneId: "arcane_hot_shot",
    effects: [
      // wiki: +6% CC per Heat status from abilities, max 50 stacks (sim.arcaneStacks)
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Arcane Hot Shot — +6% weapon CC per Heat-from-ability stack (cap 50)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Arcane Hot Shot — 10s buff duration"},
    ],
  },
  "arcane_ice": {
    arcaneId: "arcane_ice",
    customHandler: "arcane_ice",
    effects: [
      {"statKey": "statusResistance", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Ice — 17–102% chance to resist Cold"},
    ],
  },
  "arcane_ice_storm": {
    arcaneId: "arcane_ice_storm",
    effects: [
      {"statKey": "abilityDuration", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Arcane Ice Storm — +2% DUR/freeze stack (cap 20 → +40%; paper assumes max stacks)"},
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Arcane Ice Storm — +2% STR/freeze stack (cap 20 → +40%; paper assumes max stacks)"},
    ],
  },
  "arcane_impetus": {
    arcaneId: "arcane_impetus",
    effects: [
      {"statKey": "abilityEfficiency", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Arcane Impetus — +3% EFF / unique ability status (cap 14 → +42%; paper assumes max stacks)"},
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Arcane Impetus — +6% STR / unique ability status (cap 14 → +84%; paper assumes max stacks)"},
    ],
  },
  "arcane_intention": {
    arcaneId: "arcane_intention",
    effects: [
      {"statKey": "healthFlat", "target": "warframe_totals", "mode": "flat", "source": "wiki: Arcane Intention — +250 Max Health / channeled ability (cap 4 → +1000; paper assumes max stacks)"},
    ],
  },
  "arcane_melee_animosity": {
    arcaneId: "arcane_melee_animosity",
    customHandler: "arcane_melee_animosity",
    effects: [
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Animosity — +42% absolute CC/stack (cap 10 → +420%) on heavy only; light DPS unchanged; paper uses sim stacks"},
    ],
  },
  "arcane_momentum": {
    arcaneId: "arcane_momentum",
    customHandler: "arcane_momentum",
    effects: [
      {"statKey": "reloadSpeedChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Arcane Momentum: 60% chance on crit (panel)"},
      {"statKey": "reloadSpeedBonus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Momentum — +150% sniper reload for 12s on crit (paper: stacks>0 = buff up; snipers only)"},
    ],
  },
  "arcane_nullifier": {
    arcaneId: "arcane_nullifier",
    customHandler: "arcane_nullifier",
    effects: [
      {"statKey": "statusResistance", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Nullifier — 17–102% chance to resist Magnetic"},
    ],
  },
  "arcane_persistence": {
    arcaneId: "arcane_persistence",
    customHandler: "arcane_persistence",
    effects: [
      {"statKey": "persistenceDamageCapPerSecond", "target": "arcane_panel", "mode": "custom", "source": "Arcane Persistence: custom handler"},
      {"statKey": "removeShields", "target": "arcane_panel", "mode": "custom", "source": "Arcane Persistence: custom handler"},
    ],
  },
  "arcane_phantasm": {
    arcaneId: "arcane_phantasm",
    customHandler: "arcane_phantasm",
    effects: [
      {"statKey": "sprintSpeed", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Phantasm — +10–60% Movement Speed on block (paper: equipped = buff up)"},
      {"statKey": "sprintSpeedChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Phantasm — 45% chance on block (constant)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Phantasm — 18s duration (constant)"},
    ],
  },
  "arcane_pistoleer": {
    arcaneId: "arcane_pistoleer",
    customHandler: "arcane_pistoleer",
    effects: [
      {"statKey": "headshotProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Pistoleer — 60% chance on pistol HS kill"},
      {"statKey": "ammoEfficiency", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Pistoleer — +102% Ammo Efficiency for 12s (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Pistoleer — 12s buff duration"},
    ],
  },
  "arcane_power_ramp": {
    arcaneId: "arcane_power_ramp",
    effects: [
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Arcane Power Ramp — +9% STR/cast stack (cap 4 → +36%; paper assumes max stacks)"},
    ],
  },
  "arcane_precision": {
    arcaneId: "arcane_precision",
    customHandler: "arcane_precision",
    effects: [
      {"statKey": "headshotDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Precision — +300% secondary damage for 18s on headshot (paper: stacks>0 = buff up)"},
    ],
  },
  "arcane_primary_charger": {
    arcaneId: "arcane_primary_charger",
    customHandler: "arcane_primary_charger",
    effects: [
      {"statKey": "holsterDamage", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Arcane Primary Charger: holsterDamage (legacy/display)"},
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Primary Charger — +300% primary damage for 12s on melee kill (paper: stacks>0 = buff up)"},
      {"statKey": "armorBonusChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Primary Charger — 30% proc chance"},
    ],
  },
  "arcane_primary_deadhead": {
    arcaneId: "arcane_primary_deadhead",
    customHandler: "arcane_primary_deadhead",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Deadhead — +120% damage / HS-kill stack at R5 (cap 3 → +360%; applies at sim stack count)"},
      {"statKey": "headshotMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Deadhead — +30% headshot multiplier passive at R5"},
      {"statKey": "recoilReduction", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Deadhead — −50% recoil passive at R5 (panel)"},
    ],
  },
  "arcane_primary_dexterity": {
    arcaneId: "arcane_primary_dexterity",
    customHandler: "arcane_primary_dexterity",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Dexterity — +60% damage / melee-kill stack at R5 (cap 6 → +360%; applies at sim stack count)"},
      {"statKey": "comboDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Dexterity — +7.5s melee combo duration passive at R5 (panel)"},
    ],
  },
  "arcane_primary_merciless": {
    arcaneId: "arcane_primary_merciless",
    customHandler: "arcane_primary_merciless",
    effects: [
      {"statKey": "reloadSpeed", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Merciless — +30% Reload Speed passive at R5 (not per-stack)"},
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Merciless — +30% damage / kill stack at R5 (cap 12 → +360%; applies at sim stack count)"},
    ],
  },
  "arcane_pulse": {
    arcaneId: "arcane_pulse",
    customHandler: "arcane_pulse",
    effects: [
      {"statKey": "healthFromOrbs", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Pulse — restore 50/100/200/300/400/500 Health to allies"},
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Pulse — 60% chance on Health Orb (constant)"},
      {"statKey": "allyHealRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Pulse — 25m radius (constant)"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Pulse — 15s cooldown (constant)"},
    ],
  },
  "arcane_rage": {
    arcaneId: "arcane_rage",
    customHandler: "arcane_rage",
    effects: [
      {"statKey": "holsterDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Rage — +180% primary damage for 24s on headshot (paper: stacks>0 = buff up)"},
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Arcane Rage: healthRegenChance (legacy/display)"},
    ],
  },
  "arcane_reaper": {
    arcaneId: "arcane_reaper",
    customHandler: "arcane_reaper",
    effects: [
      {"statKey": "healthRegenPerSec", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Reaper — +24 HP/s on melee kill (paper: equipped = buff up)"},
      {"statKey": "flatArmorBonus", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Reaper — +660 flat Armor on melee kill (paper: equipped = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Arcane Reaper — buff duration (panel)"},
    ],
  },
  "arcane_resistance": {
    arcaneId: "arcane_resistance",
    customHandler: "arcane_resistance",
    effects: [
      {"statKey": "statusResistance", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Resistance — 17–102% chance to resist Toxin"},
    ],
  },
  "arcane_rise": {
    arcaneId: "arcane_rise",
    customHandler: "arcane_rise",
    effects: [
      {"statKey": "holsterDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Rise — +150% primary damage for 24s on reload (paper: stacks>0 = buff up)"},
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Arcane Rise: proc chance (panel)"},
    ],
  },
  "arcane_sculptor": {
    arcaneId: "arcane_sculptor",
    customHandler: "arcane_sculptor",
    effects: [
      {"statKey": "abilityEfficiency", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Sculptor — lock Ability Efficiency at 175% when creating an object (paper: equipped = locked)"},
    ],
  },
  "arcane_secondary_deadhead": {
    arcaneId: "arcane_secondary_deadhead",
    customHandler: "arcane_secondary_deadhead",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Deadhead — +120% damage / HS-kill stack at R5 (cap 3 → +360%; applies at sim stack count)"},
      {"statKey": "headshotMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Deadhead — +30% headshot multiplier passive at R5"},
      {"statKey": "recoilReduction", "target": "arcane_panel", "mode": "custom", "source": "wiki: Secondary Deadhead — −50% recoil passive at R5 (panel)"},
    ],
  },
  "arcane_secondary_dexterity": {
    arcaneId: "arcane_secondary_dexterity",
    customHandler: "arcane_secondary_dexterity",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Dexterity — +60% damage / melee-kill stack at R5 (cap 6 → +360%; applies at sim stack count)"},
      {"statKey": "comboDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Secondary Dexterity — +7.5s melee combo duration passive at R5 (panel)"},
    ],
  },
  "arcane_secondary_merciless": {
    arcaneId: "arcane_secondary_merciless",
    customHandler: "arcane_secondary_merciless",
    effects: [
      {"statKey": "reloadSpeed", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Merciless — +30% Reload Speed passive at R5 (not per-stack)"},
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Merciless — +30% damage / kill stack at R5 (cap 12 → +360%; applies at sim stack count)"},
    ],
  },
  "arcane_steadfast": {
    arcaneId: "arcane_steadfast",
    customHandler: "arcane_steadfast",
    effects: [
      {"statKey": "freeAbilityCastChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Steadfast — 5–20% chance on cast for free abilities"},
      {"statKey": "freeAbilityCastCount", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Steadfast — next 3 abilities free (constant)"},
    ],
  },
  "arcane_strike": {
    arcaneId: "arcane_strike",
    customHandler: "arcane_strike",
    effects: [
      {"statKey": "attackSpeed", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Strike — +60% melee attack speed for 18s on hit (paper: stacks>0 = buff up)"},
      {"statKey": "attackSpeedChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Strike — 15% proc chance on hit"},
    ],
  },
  "arcane_tanker": {
    arcaneId: "arcane_tanker",
    customHandler: "arcane_tanker",
    effects: [
      {"statKey": "flatArmorBonus", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Tanker — +1200 flat Armor for 60s on Archgun equip (paper: equipped = buff up)"},
    ],
  },
  "arcane_tempo": {
    arcaneId: "arcane_tempo",
    customHandler: "arcane_tempo",
    effects: [
      {"statKey": "fireRate", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Tempo — +90% shotgun FR for 12s on crit (paper: stacks>0 = buff up)"},
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Arcane Tempo: healthRegenChance (legacy/display)"},
    ],
  },
  "arcane_trickery": {
    arcaneId: "arcane_trickery",
    customHandler: "arcane_trickery",
    effects: [
      {"statKey": "invisibilityChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Trickery — 15% chance on Finisher Kill (constant)"},
      {"statKey": "invisibilityDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Trickery — 5–30s invisibility"},
    ],
  },
  "arcane_truculence": {
    arcaneId: "arcane_truculence",
    customHandler: "arcane_truculence",
    effects: [
      {"statKey": "overguardThreshold", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Truculence — every 3000 Overguard gained (constant)"},
      {"statKey": "radialAttackRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Truculence — 5–30m Viral wave radius"},
      {"statKey": "viralStatusStacks", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Truculence — 10 Viral stacks (constant)"},
    ],
  },
  "arcane_ultimatum": {
    arcaneId: "arcane_ultimatum",
    customHandler: "arcane_ultimatum",
    effects: [
      {"statKey": "flatArmorBonus", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Ultimatum — +1200 flat Armor for 45s on finisher kill (paper: equipped = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Arcane Ultimatum — 45s buff (panel)"},
    ],
  },
  "arcane_universal_fallout": {
    arcaneId: "arcane_universal_fallout",
    customHandler: "arcane_universal_fallout",
    effects: [
      {"statKey": "universalOrbChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Universal Fallout — +1–6% Universal Orb chance per Radiation status (cap 60%)"},
      {"statKey": "universalOrbChanceCap", "target": "arcane_panel", "mode": "custom", "source": "wiki: Arcane Universal Fallout — 60% chance cap (constant)"},
    ],
  },
  "arcane_velocity": {
    arcaneId: "arcane_velocity",
    customHandler: "arcane_velocity",
    effects: [
      {"statKey": "fireRate", "target": "weapon_dps", "mode": "custom", "source": "wiki: Arcane Velocity — +120% secondary FR for 9s on crit (paper: stacks>0 = buff up)"},
    ],
  },
  "arcane_victory": {
    arcaneId: "arcane_victory",
    customHandler: "arcane_victory",
    effects: [
      {"statKey": "headshotHealthRegen", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Victory — +3% max HP/s for 9s on HS kill (paper: equipped = buff up)"},
    ],
  },
  "arcane_warmth": {
    arcaneId: "arcane_warmth",
    customHandler: "arcane_warmth",
    effects: [
      {"statKey": "statusResistance", "target": "warframe_totals", "mode": "custom", "source": "wiki: Arcane Warmth — 17–102% chance to resist Heat"},
    ],
  },
  "cascadia_accuracy": {
    arcaneId: "cascadia_accuracy",
    customHandler: "cascadia_accuracy",
    effects: [
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Cascadia Accuracy — +300% Weakpoint CC for 4s after roll (R5; paper: stacks>0 + applyHeadshots)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Cascadia Accuracy — 4s buff duration"},
    ],
  },
  "cascadia_empowered": {
    arcaneId: "cascadia_empowered",
    customHandler: "cascadia_empowered",
    effects: [
      {"statKey": "bonusDamageOnStatus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Cascadia Empowered — flat +750 typed dmg / status proc at R5 (paper: E[procs]=SC×MS; not weapon-mod scaled)"},
    ],
  },
  "cascadia_flare": {
    arcaneId: "cascadia_flare",
    customHandler: "cascadia_flare",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Cascadia Flare — +12% damage / Heat stack at R5 (cap 40 → +480%; applies at sim stack count)"},
    ],
  },
  "cascadia_overcharge": {
    arcaneId: "cascadia_overcharge",
    customHandler: "cascadia_overcharge",
    effects: [
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Cascadia Overcharge — +300% CC while Overshields active (paper: stacks>0 = overshields up)"},
    ],
  },
  "conjunction_voltage": {
    arcaneId: "conjunction_voltage",
    customHandler: "conjunction_voltage",
    effects: [
      {"statKey": "reloadSpeed", "target": "weapon_dps", "mode": "custom", "source": "wiki: Conjunction Voltage — +1.5% Reload Speed / stack at R5 (cap 40 → +60%; applies at sim stack count)"},
      {"statKey": "multishot", "target": "weapon_dps", "mode": "custom", "source": "wiki: Conjunction Voltage — +3% Multishot / stack at R5 (cap 40 → +120%; applies at sim stack count)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Conjunction Voltage — 12s stack duration (constant; expiry clears all stacks)"},
    ],
  },
  "emergence_dissipate": {
    arcaneId: "emergence_dissipate",
    customHandler: "emergence_dissipate",
    effects: [
      {"statKey": "dissipateRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Dissipate — 10m cancel radius (constant)"},
      {"statKey": "voidMoteEnergy", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Dissipate — Void Motes restore 5–10 Energy"},
    ],
  },
  "emergence_renewed": {
    arcaneId: "emergence_renewed",
    customHandler: "emergence_renewed",
    effects: [
      {"statKey": "energyRegen", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Renewed — +300% Energy Regen for 5s on empty (paper: equipped = buff up; panel)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Renewed — 5s duration (constant)"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Renewed — 30s cooldown (constant)"},
    ],
  },
  "emergence_savior": {
    arcaneId: "emergence_savior",
    customHandler: "emergence_savior",
    effects: [
      {"statKey": "lethalInvulnDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Savior — 5s Operator invuln on lethal (constant; Operator panel)"},
      {"statKey": "lethalHealPercent", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Savior — recover 10–60% Operator Health"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Emergence Savior — 90s cooldown (constant)"},
    ],
  },
  "eternal_eradicate": {
    arcaneId: "eternal_eradicate",
    customHandler: "eternal_eradicate",
    effects: [
      {"statKey": "ampDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Eternal Eradicate — +60% amp damage for 8s after Operator ability (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Eternal Eradicate: buffDuration (panel)"},
    ],
  },
  "eternal_logistics": {
    arcaneId: "eternal_logistics",
    customHandler: "eternal_logistics",
    effects: [
      {"statKey": "ampAmmoEfficiency", "target": "weapon_dps", "mode": "custom", "source": "wiki: Eternal Logistics — +72% amp ammo efficiency for 8s after Void Sling (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Eternal Logistics: buffDuration (panel)"},
    ],
  },
  "eternal_onslaught": {
    arcaneId: "eternal_onslaught",
    customHandler: "eternal_onslaught",
    effects: [
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Eternal Onslaught — +180% amp CC for 8s while Operator energy ≤25 (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Eternal Onslaught: buffDuration (panel)"},
    ],
  },
  "exodia_brave": {
    arcaneId: "exodia_brave",
    customHandler: "exodia_brave",
    effects: [
      {"statKey": "energyRegen", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Brave — +5 Energy/s × stacks (cap 3 → 15) for 4s on Zaw heavy-kill"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Brave — 4s window (not × stacks; Zaw-only)"},
    ],
  },
  "exodia_contagion": {
    arcaneId: "exodia_contagion",
    customHandler: "exodia_contagion",
    effects: [
      {"statKey": "contagionProjectileDamage", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Contagion — paper 1× point-blank hit = zawDmg×(2+5×stanceMult)×avgCrit (Zaw burst panel; not sustained DPS)"},
      {"statKey": "contagionExplosionRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Contagion — 8m explosion (fixed; Zaw-only)"},
    ],
  },
  "exodia_epidemic": {
    arcaneId: "exodia_epidemic",
    customHandler: "exodia_epidemic",
    effects: [
      {"statKey": "epidemicSuspendDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Epidemic — aerial slam suspend 1–4s (paper: stacks>0; Zaw panel)"},
    ],
  },
  "exodia_force": {
    arcaneId: "exodia_force",
    customHandler: "exodia_force",
    effects: [
      {"statKey": "statusProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Force — 50% chance on status (Zaw panel)"},
      {"statKey": "procDamageMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Exodia Force — 200% weapon damage radial at R3 (Zaw; paper: stacks>0 = 1 nearby at point-blank)"},
    ],
  },
  "exodia_hunt": {
    arcaneId: "exodia_hunt",
    customHandler: "exodia_hunt",
    effects: [
      {"statKey": "pullChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Hunt — 50% slam pull chance (constant; Zaw panel)"},
      {"statKey": "pullRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Hunt — 6–12m pull radius on slam (paper: stacks>0)"},
    ],
  },
  "exodia_might": {
    arcaneId: "exodia_might",
    customHandler: "exodia_might",
    effects: [
      {"statKey": "lifeStealChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Might — 50% finisher chance for lifesteal (constant; Zaw panel)"},
      {"statKey": "lifeSteal", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Might — +7.5–30% Life Steal for 8s (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Might — 8s duration (constant)"},
    ],
  },
  "exodia_triumph": {
    arcaneId: "exodia_triumph",
    customHandler: "exodia_triumph",
    effects: [
      {"statKey": "meleeComboChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Triumph — +50% Additional Combo Count Chance on Zaw hit (panel; combo DPS → C6)"},
    ],
  },
  "exodia_valor": {
    arcaneId: "exodia_valor",
    customHandler: "exodia_valor",
    effects: [
      {"statKey": "meleeComboChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Exodia Valor — +200% Combo Count Chance vs Lifted on Zaw (paper: stacks>0 = Lifted; panel; combo DPS → C6)"},
    ],
  },
  "fractalized_reset": {
    arcaneId: "fractalized_reset",
    customHandler: "fractalized_reset",
    effects: [
      {"statKey": "reloadSpeed", "target": "weapon_dps", "mode": "custom", "source": "wiki: Fractalized Reset — +240% reload for 5s on ability cast (paper: stacks>0 = buff up)"},
    ],
  },
  "longbow_sharpshot": {
    arcaneId: "longbow_sharpshot",
    customHandler: "longbow_sharpshot",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Longbow Sharpshot — +300% next-shot damage after HS, multiplicative to Serration (paper: stacks>0 = buff up)"},
    ],
  },
  "magus_accelerant": {
    arcaneId: "magus_accelerant",
    customHandler: "magus_accelerant",
    effects: [
      {"statKey": "enemyResistanceReduction", "target": "weapon_dps", "mode": "custom", "source": "wiki: Magus Accelerant — −65% Heat resistance / Void Sling stack (paper: Heat ×(1+0.65×stacks))"},
    ],
  },
  "magus_aggress": {
    arcaneId: "magus_aggress",
    customHandler: "magus_aggress",
    effects: [
      {"statKey": "criticalMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Magus Aggress — +300% CD on heavy blade/hammer for 4 attacks (paper: stacks>0 = buff up)"},
      {"statKey": "attackCount", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Magus Aggress: 4 attacks (panel)"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "Magus Aggress: 20s cooldown (panel)"},
    ],
  },
  "magus_anomaly": {
    arcaneId: "magus_anomaly",
    customHandler: "magus_anomaly",
    effects: [
      {"statKey": "voidPullRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Anomaly — Transference In pull 5–30m"},
    ],
  },
  "magus_cadence": {
    arcaneId: "magus_cadence",
    customHandler: "magus_cadence",
    effects: [
      {"statKey": "sprintSpeed", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Cadence — +15–90% Operator Sprint Speed for 12s (Operator only; not Warframe)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Cadence — 12s duration (constant)"},
    ],
  },
  "magus_cloud": {
    arcaneId: "magus_cloud",
    customHandler: "magus_cloud",
    effects: [
      {"statKey": "voidSlingRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Cloud — +50–300% Void Sling Radius for 6s after Void Mode"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Cloud — 6s duration (constant)"},
    ],
  },
  "magus_destruct": {
    arcaneId: "magus_destruct",
    customHandler: "magus_destruct",
    effects: [
      {"statKey": "enemyResistanceReduction", "target": "weapon_dps", "mode": "custom", "source": "wiki: Magus Destruct — −65% Puncture resistance / Void Sling stack (paper: Puncture ×(1+0.65×stacks))"},
    ],
  },
  "magus_drive": {
    arcaneId: "magus_drive",
    customHandler: "magus_drive",
    effects: [
      {"statKey": "kdDriveSpeed", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Drive — +25–150% K-Drive speed for 30s on Transference In"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Drive — 30s duration (constant)"},
    ],
  },
  "magus_elevate": {
    arcaneId: "magus_elevate",
    customHandler: "magus_elevate",
    effects: [
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Elevate — 95% chance (constant all ranks) on Transference In"},
      {"statKey": "operatorToWarframeHeal", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Elevate — restore 50–300 Warframe Health (Operator panel; E[heal]=chance×heal)"},
    ],
  },
  "magus_firewall": {
    arcaneId: "magus_firewall",
    customHandler: "magus_firewall",
    effects: [
      {"statKey": "damageReduction", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Firewall — 12.5% Operator DR/particle ×6 = 75% (Operator only; does not affect Warframes)"},
      {"statKey": "voidModeDamageReduction", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Firewall — particle duration 10–60s by rank (Operator Void Mode)"},
    ],
  },
  "magus_glitch": {
    arcaneId: "magus_glitch",
    customHandler: "magus_glitch",
    effects: [
      {"statKey": "transferenceStaticNegate", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Glitch — 17–102% chance to negate Transference Static"},
    ],
  },
  "magus_husk": {
    arcaneId: "magus_husk",
    customHandler: "magus_husk",
    effects: [
      {"statKey": "operatorArmor", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Husk — +300 Operator Armor (Operator panel only; not Warframe armor)"},
    ],
  },
  "magus_lockdown": {
    arcaneId: "magus_lockdown",
    customHandler: "magus_lockdown",
    effects: [
      {"statKey": "voidTrapDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Lockdown — 4s tether duration (constant)"},
      {"statKey": "voidTrapRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Lockdown — 15m radius (constant)"},
      {"statKey": "voidTrapTetherCount", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Lockdown — up to 10 enemies (constant; CC only)"},
    ],
  },
  "magus_melt": {
    arcaneId: "magus_melt",
    customHandler: "magus_melt",
    effects: [
      {"statKey": "operatorHeatDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Magus Melt — +30% Operator Heat / Void Sling stack at R5 (cap 7 → +210%; applies at sim stack count on amps)"},
    ],
  },
  "magus_nourish": {
    arcaneId: "magus_nourish",
    customHandler: "magus_nourish",
    effects: [
      {"statKey": "operatorToWarframeHeal", "target": "warframe_totals", "mode": "custom", "source": "wiki: Magus Nourish — 10–35 Warframe HP/s while Operator (paper: equipped = Operator → healthRegenPerSec)"},
    ],
  },
  "magus_overload": {
    arcaneId: "magus_overload",
    customHandler: "magus_overload",
    effects: [
      {"statKey": "damage", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Overload — discharge = 80% of robotic enemy max HP as Electricity in 25m (not weapon damage %)"},
    ],
  },
  "magus_repair": {
    arcaneId: "magus_repair",
    customHandler: "magus_repair",
    effects: [
      {"statKey": "operatorToWarframeHeal", "target": "warframe_totals", "mode": "custom", "source": "wiki: Magus Repair — 5–25% max HP/s within 30m in Void Mode (paper: equipped = Void Mode → healthRegenPerSec)"},
      {"statKey": "repairRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Repair — 30m radius (constant)"},
    ],
  },
  "magus_replenish": {
    arcaneId: "magus_replenish",
    customHandler: "magus_replenish",
    effects: [
      {"statKey": "operatorHealthRegen", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Replenish — heal 5–30% Operator Health on Void Sling (Operator panel only)"},
    ],
  },
  "magus_revert": {
    arcaneId: "magus_revert",
    customHandler: "magus_revert",
    effects: [
      {"statKey": "revertWindow", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Revert — 3s window to return (constant)"},
      {"statKey": "revertHeal", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Revert — restore 10–60 Operator Health"},
      {"statKey": "cooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Revert — 3s cooldown (constant)"},
    ],
  },
  "magus_vigor": {
    arcaneId: "magus_vigor",
    customHandler: "magus_vigor",
    effects: [
      {"statKey": "operatorHealth", "target": "arcane_panel", "mode": "custom", "source": "wiki: Magus Vigor — +600 Operator Health (Operator panel only; not Warframe HP)"},
    ],
  },
  "melee_afflictions": {
    arcaneId: "melee_afflictions",
    customHandler: "melee_afflictions",
    effects: [
      {"statKey": "statusStackBonus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Afflictions — +1…+6 stacks to each damaging status on KD (paper: stacks>0 → ×2 DoT ticks, assume 6 existing)"},
    ],
  },
  "melee_assimilation": {
    arcaneId: "melee_assimilation",
    customHandler: "melee_assimilation",
    effects: [
      {"statKey": "meleeHeavyDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Assimilation — +150% heavy damage for 20s after shield break (paper: stacks>0 = buff up)"},
      {"statKey": "shieldRestorePercent", "target": "arcane_panel", "mode": "custom", "source": "wiki: Melee Assimilation — +30% shields restored on heavy kill at R5 (panel)"},
    ],
  },
  "melee_careen": {
    arcaneId: "melee_careen",
    customHandler: "melee_careen",
    effects: [
      {"statKey": "meleeDamageBonus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Careen — ×2.5 damage vs fully frozen at R5 (paper: stacks>0 = vs frozen)"},
    ],
  },
  "melee_crescendo": {
    arcaneId: "melee_crescendo",
    customHandler: "melee_crescendo",
    effects: [
      {"statKey": "meleeComboInitial", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Crescendo — +6 initial combo / finisher at R5 (sim stacks = finishers; capped at 220)"},
    ],
  },
  "melee_doughty": {
    arcaneId: "melee_doughty",
    customHandler: "melee_doughty",
    effects: [
      {"statKey": "critPerPunctureTen", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Doughty — flat CM = round1(Puncture SC% × 0.1 × rank CM); R5 1.0x/10% puncture SC; cap +50x"},
    ],
  },
  "melee_duplicate": {
    arcaneId: "melee_duplicate",
    customHandler: "melee_duplicate",
    effects: [
      {"statKey": "duplicateAttackChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Duplicate — chance to duplicate yellow crit hits (paper: stacks>0 = all hits qualify → damage × (1 + chance))"},
    ],
  },
  "melee_exposure": {
    arcaneId: "melee_exposure",
    customHandler: "melee_exposure",
    effects: [
      {"statKey": "meleeDamageBonus", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Exposure — Corrosive Damage stacks to 240% cap (R5 +60%/ability cast; sim stacks = casts)"},
      {"statKey": "corrosiveDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Exposure — +60% Corrosive Damage / ability cast at R5"},
    ],
  },
  "melee_fortification": {
    arcaneId: "melee_fortification",
    effects: [
      {"statKey": "flatArmorBonus", "target": "warframe_totals", "mode": "flat", "source": "wiki: Melee Fortification — +210 Armor/melee kill (paper cap 30 stacks → +6300; duration 10s panel)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Melee Fortification — 10s per stack (panel)"},
    ],
  },
  "melee_influence": {
    arcaneId: "melee_influence",
    customHandler: "melee_influence",
    effects: [
      {"statKey": "elementalProcChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Melee Influence — 20% on Electricity status to start buff (panel)"},
      {"statKey": "procAuraRadius", "target": "arcane_panel", "mode": "flat", "source": "wiki: Melee Influence — spread range 10–20m (panel)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Melee Influence — buff 3–18s (panel)"},
      {"statKey": "elementalSplash", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Influence — spread deals procced elemental damage to nearby; paper: stacks>0 = buff up + 1 nearby at sum(elements)"},
    ],
  },
  "melee_retaliation": {
    arcaneId: "melee_retaliation",
    customHandler: "melee_retaliation",
    effects: [
      {"statKey": "meleeDamagePerShield", "target": "weapon_dps", "mode": "custom", "source": "wiki: Melee Retaliation — +30% dmg / 200 shields at R5 (sim stacks = floor(shields/200); half for overshields not split)"},
      {"statKey": "meleeDamagePerShieldCap", "target": "arcane_panel", "mode": "custom", "source": "wiki: Melee Retaliation — damage cap 420% at R5"},
    ],
  },
  "melee_vortex": {
    arcaneId: "melee_vortex",
    customHandler: "melee_vortex",
    effects: [
      {"statKey": "pullChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Melee Vortex — 20–45% pull on Magnetic-status kill (paper: stacks>0)"},
      {"statKey": "pullRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Melee Vortex — 18m radius (constant)"},
    ],
  },
  "molt_augmented": {
    arcaneId: "molt_augmented",
    effects: [
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "multiplicative_percent", "source": "wiki: Molt Augmented — +0.24% STR/kill (cap 250 → +60%; paper assumes max stacks)"},
    ],
  },
  "molt_efficiency": {
    arcaneId: "molt_efficiency",
    customHandler: "molt_efficiency",
    effects: [
      {"statKey": "abilityDurationPerSecond", "target": "arcane_panel", "mode": "custom", "source": "wiki: Molt Efficiency — +1–6% DUR/s while shields active"},
      {"statKey": "abilityDuration", "target": "warframe_totals", "mode": "custom", "source": "wiki: Molt Efficiency — cap +6–36% DUR (paper: shields up at cap)"},
    ],
  },
  "molt_reconstruct": {
    arcaneId: "molt_reconstruct",
    customHandler: "molt_reconstruct",
    effects: [
      {"statKey": "healPerEnergySpent", "target": "arcane_panel", "mode": "custom", "source": "wiki: Molt Reconstruct — heal 1–6 HP per Energy spent on initial cast (Affinity Range)"},
    ],
  },
  "molt_vigor": {
    arcaneId: "molt_vigor",
    customHandler: "molt_vigor",
    effects: [
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "custom", "source": "wiki: Molt Vigor — +45% STR on next WF ability after Operator ability (paper: equipped = buff up)"},
    ],
  },
  "pax_bolt": {
    arcaneId: "pax_bolt",
    customHandler: "pax_bolt",
    effects: [
      {"statKey": "abilityEfficiency", "target": "warframe_totals", "mode": "custom", "source": "wiki: Pax Bolt — +7.5–30% EFF on next cast after kitgun HS kill (paper: equipped = buff up)"},
      {"statKey": "abilityStrength", "target": "warframe_totals", "mode": "custom", "source": "wiki: Pax Bolt — +7.5–30% STR on next cast after kitgun HS kill (paper: equipped = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Pax Bolt — 4s window for next ability (constant)"},
    ],
  },
  "pax_charge": {
    arcaneId: "pax_charge",
    customHandler: "pax_charge",
    effects: [
      {"statKey": "kitgunRecharge", "target": "weapon_dps", "mode": "custom", "source": "wiki: Pax Charge — +12.5–50% reload speed (reduces battery recharge delay; passive)"},
    ],
  },
  "pax_seeker": {
    arcaneId: "pax_seeker",
    customHandler: "pax_seeker",
    effects: [
      {"statKey": "kitgunHoming", "target": "arcane_panel", "mode": "custom", "source": "wiki: Pax Seeker — 1–4 homing bolts on kitgun HS kill (paper: stacks>0)"},
    ],
  },
  "pax_soar": {
    arcaneId: "pax_soar",
    customHandler: "pax_soar",
    effects: [
      {"statKey": "airborneAccuracy", "target": "arcane_panel", "mode": "custom", "source": "wiki: Pax Soar — +12.5–50% airborne accuracy (passive)"},
      {"statKey": "airborneRecoilReduction", "target": "arcane_panel", "mode": "custom", "source": "wiki: Pax Soar — −12.5–50% airborne recoil (passive)"},
      {"statKey": "aimGlideDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Pax Soar — +1.25–5s aim glide / wall latch (passive)"},
    ],
  },
  "primary_blight": {
    arcaneId: "primary_blight",
    effects: [
      {"statKey": "multishot", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Primary Blight — +1.8% Multishot / Toxin stack at R5 (cap 40 → +72%; applies at sim stack count)"},
      {"statKey": "criticalMultiplier", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Primary Blight — +3.6% Critical Damage / Toxin stack at R5 (cap 40 → +144%; applies at sim stack count)"},
    ],
  },
  "primary_bulwark": {
    arcaneId: "primary_bulwark",
    customHandler: "primary_bulwark",
    effects: [
      {"statKey": "damagePerArmorOver", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Bulwark — +1%/armor over 1000 at R5 (cap +500% at 1500 armor; uses sim.warframeArmor)"},
      {"statKey": "damagePerArmorThreshold", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Bulwark — armor threshold 1000"},
    ],
  },
  "primary_compression": {
    arcaneId: "primary_compression",
    customHandler: "primary_compression",
    effects: [
      {"statKey": "ammoEfficiency", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Compression — +5.5% AE / meter radius lost while aiming (metersLost = radius×0.8; paper: stacks>0 = aiming)"},
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Compression — +100% damage / meter lost as final mult (Acceltra 4m → ×4.2)"},
    ],
  },
  "primary_crux": {
    arcaneId: "primary_crux",
    effects: [
      {"statKey": "ammoEfficiency", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Primary Crux — +6% Ammo Efficiency / weak-point stack at R5 (cap 10 → +60%; applies at sim stack count)"},
      {"statKey": "statusChancePerHit", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Primary Crux — +30% Status Chance / weak-point stack at R5 (cap 10 → +300%; applies at sim stack count)"},
    ],
  },
  "primary_debilitate": {
    arcaneId: "primary_debilitate",
    customHandler: "primary_debilitate",
    effects: [
      {"statKey": "debilitateStackThreshold", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Debilitate — requires ≥10 stacks of a combined status (constant)"},
      {"statKey": "statusProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Debilitate — 50–100% chance to apply one base component on re-proc (paper: stacks>0 = threshold; expected component chances on statusProcs)"},
    ],
  },
  "primary_exhilarate": {
    arcaneId: "primary_exhilarate",
    effects: [
      {"statKey": "energyRegen", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Primary Exhilarate — +1.2 Energy/s per Impact stack at R5 (cap 3 → +3.6/s; tracked at sim stacks)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Primary Exhilarate — 10s duration (loses 1 stack on expiry)"},
    ],
  },
  "primary_frostbite": {
    arcaneId: "primary_frostbite",
    effects: [
      {"statKey": "multishot", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Primary Frostbite — +2.25% Multishot / Cold stack at R5 (cap 40 → +90%; applies at sim stack count)"},
      {"statKey": "criticalMultiplier", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Primary Frostbite — +3% Critical Damage / Cold stack at R5 (cap 40 → +120%; applies at sim stack count)"},
    ],
  },
  "primary_obstruct": {
    arcaneId: "primary_obstruct",
    customHandler: "primary_obstruct",
    effects: [
      {"statKey": "weaponJamRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Obstruct — 15m jam radius on Magnetic status (constant)"},
      {"statKey": "weaponJamCooldown", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Obstruct — cooldown 60→10s by rank (paper: stacks>0 = Magnetic applied)"},
    ],
  },
  "primary_overcharge": {
    arcaneId: "primary_overcharge",
    customHandler: "primary_overcharge",
    effects: [
      {"statKey": "multishot", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Overcharge — up to +350% Multishot at R5 while Energy >90% (paper assumes cap)"},
    ],
  },
  "primary_plated_round": {
    arcaneId: "primary_plated_round",
    customHandler: "primary_plated_round",
    effects: [
      {"statKey": "reloadDamageRamp", "target": "weapon_dps", "mode": "custom", "source": "wiki: Primary Plated Round — damage = 15×√(5×mag) after empty reload (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Primary Plated Round — buff duration by rank (R5 10s)"},
    ],
  },
  "residual_boils": {
    arcaneId: "residual_boils",
    customHandler: "residual_boils",
    effects: [
      {"statKey": "zoneDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Residual Boils — 80 Heat explosion (paper: stacks>0 = zone up; 1 hit/s → +80 DPS)"},
      {"statKey": "killProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Boils — 20% spawn chance on kill (constant)"},
      {"statKey": "zoneDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Boils — 3–12s duration by rank"},
      {"statKey": "zoneRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Boils — 10m explosion radius"},
      {"statKey": "zoneBuffRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Boils — 9m Theorem buff radius"},
    ],
  },
  "residual_malodor": {
    arcaneId: "residual_malodor",
    customHandler: "residual_malodor",
    effects: [
      {"statKey": "zoneDamagePerSec", "target": "weapon_dps", "mode": "custom", "source": "wiki: Residual Malodor — 40 Cold/s (paper: stacks>0 = zone up)"},
      {"statKey": "killProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Malodor — 20% spawn chance on kill (constant)"},
      {"statKey": "zoneDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Malodor — 3–12s duration by rank"},
      {"statKey": "zoneRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Malodor — 9m damage radius"},
      {"statKey": "zoneBuffRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Malodor — 9m Theorem buff radius"},
    ],
  },
  "residual_shock": {
    arcaneId: "residual_shock",
    customHandler: "residual_shock",
    effects: [
      {"statKey": "zoneDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Residual Shock — 200 Electricity (paper: stacks>0 = zone up; 1 hit/s → +200 DPS)"},
      {"statKey": "killProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Shock — 20% spawn chance on kill (constant)"},
      {"statKey": "zoneDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Shock — 3–12s duration by rank"},
      {"statKey": "zoneRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Shock — 10m range"},
      {"statKey": "zoneBuffRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Shock — 9m Theorem buff radius"},
    ],
  },
  "residual_viremia": {
    arcaneId: "residual_viremia",
    customHandler: "residual_viremia",
    effects: [
      {"statKey": "zoneDamagePerSec", "target": "weapon_dps", "mode": "custom", "source": "wiki: Residual Viremia — 40 Toxin/s (paper: stacks>0 = zone up)"},
      {"statKey": "killProcChance", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Viremia — 20% spawn chance on kill (constant)"},
      {"statKey": "zoneDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Viremia — 3–12s duration by rank"},
      {"statKey": "zoneRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Viremia — 9m range"},
      {"statKey": "zoneBuffRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Residual Viremia — 9m Theorem buff radius"},
    ],
  },
  "secondary_cryogenic": {
    arcaneId: "secondary_cryogenic",
    customHandler: "secondary_cryogenic",
    effects: [
      {"statKey": "coldStacksApplied", "target": "arcane_panel", "mode": "custom", "source": "wiki: Secondary Cryogenic — 1/1/2/2/3/3 Cold stacks on Puncture (paper: stacks>0)"},
      {"statKey": "coldSpreadRadius", "target": "arcane_panel", "mode": "custom", "source": "wiki: Secondary Cryogenic — 10–15m radius around Puncture target"},
    ],
  },
  "secondary_encumber": {
    arcaneId: "secondary_encumber",
    customHandler: "secondary_encumber",
    effects: [
      {"statKey": "secondaryStatusProc", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Encumber — 24% on status → 1 extra random status (paper: stacks>0 → +SC×0.24 expected)"},
    ],
  },
  "secondary_enervate": {
    arcaneId: "secondary_enervate",
    customHandler: "secondary_enervate",
    effects: [
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Enervate — +10% absolute CC / hit stack (sim stacks = hits; resets after N big crits)"},
      {"statKey": "bigCritThreshold", "target": "arcane_panel", "mode": "custom", "source": "wiki: Secondary Enervate — big-crit reset threshold (R5 = 6)"},
    ],
  },
  "secondary_fortifier": {
    arcaneId: "secondary_fortifier",
    customHandler: "secondary_fortifier",
    effects: [
      {"statKey": "overguardDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Fortifier — ×8 damage vs Overguard at R5 (paper: simStacks>0 = target has Overguard)"},
    ],
  },
  "secondary_irradiate": {
    arcaneId: "secondary_irradiate",
    customHandler: "secondary_irradiate",
    effects: [
      {"statKey": "procDamageMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Irradiate — 180% hit damage to nearby at 10 Radiation stacks (paper: stacks>0 = 1 nearby)"},
      {"statKey": "procAuraRadius", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Secondary Irradiate — 7m radius at R5 (panel)"},
    ],
  },
  "secondary_kinship": {
    arcaneId: "secondary_kinship",
    effects: [
      // wiki: +20.04% CC per unique ally Warframe buff (sim.arcaneStacks = buff count)
      {"statKey": "criticalChance", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Secondary Kinship — +20% CC per ally buff stack (cap 24)"},
    ],
  },
  "secondary_outburst": {
    arcaneId: "secondary_outburst",
    customHandler: "secondary_outburst",
    effects: [
      {"statKey": "criticalMultiplier", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Outburst — +20% CC and CD / combo at R5 (sim stacks = combo consumed)"},
    ],
  },
  "secondary_shiver": {
    arcaneId: "secondary_shiver",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Secondary Shiver — +45% damage / Cold stack on target at R5 (cap 10 → +450%; applies at sim stack count)"},
    ],
  },
  "secondary_surge": {
    arcaneId: "secondary_surge",
    customHandler: "secondary_surge",
    effects: [
      {"statKey": "damagePerEnergy", "target": "weapon_dps", "mode": "custom", "source": "wiki: Secondary Surge — +0.5% dmg/energy after cast; R5 cap +700% (paper: stacks>0 = at cap)"},
    ],
  },
  "shotgun_vendetta": {
    arcaneId: "shotgun_vendetta",
    customHandler: "shotgun_vendetta",
    effects: [
      {"statKey": "reloadSpeed", "target": "weapon_dps", "mode": "custom", "source": "wiki: Shotgun Vendetta — +75% reload for 15s after ≤5m shotgun kill (paper: stacks>0 = buff up)"},
      {"statKey": "multishot", "target": "weapon_dps", "mode": "custom", "source": "wiki: Shotgun Vendetta — +180% multishot for 15s after ≤5m shotgun kill (paper: stacks>0 = buff up)"},
    ],
  },
  "theorem_contagion": {
    arcaneId: "theorem_contagion",
    customHandler: "theorem_contagion",
    effects: [
      {"statKey": "vulnerability", "target": "arcane_panel", "mode": "custom", "source": "wiki: Theorem Contagion — +25–200% vulnerability for 6s within 15m"},
      {"statKey": "contagionGlobeRange", "target": "arcane_panel", "mode": "custom", "source": "wiki: Theorem Contagion — 15m globe strike range (constant)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Theorem Contagion — 6s vulnerability duration (constant)"},
    ],
  },
  "theorem_demulcent": {
    arcaneId: "theorem_demulcent",
    effects: [
      {"statKey": "damage", "target": "weapon_dps", "mode": "multiplicative_percent", "source": "wiki: Theorem Demulcent — +12% weapon damage / Residual tick stack at R5 (cap 15 → +180%; applies at sim stack count)"},
    ],
  },
  "theorem_infection": {
    arcaneId: "theorem_infection",
    customHandler: "theorem_infection",
    effects: [
      {"statKey": "companionDamageRamp", "target": "arcane_panel", "mode": "custom", "source": "wiki: Theorem Infection — +24%/s companion+summon damage in Residual zone (cap 15 → +360%; paper max stacks)"},
    ],
  },
  "virtuos_forge": {
    arcaneId: "virtuos_forge",
    customHandler: "virtuos_forge",
    effects: [
      {"statKey": "voidConversion", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Forge — convert 24–96% Void→Heat on amp (R3=96%; hard cap 98% with multiple converters)"},
    ],
  },
  "virtuos_fury": {
    arcaneId: "virtuos_fury",
    customHandler: "virtuos_fury",
    effects: [
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Virtuos Fury — 20% chance on status (panel)"},
      {"statKey": "damage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Fury — +30% amp damage for 4s on status (paper: stacks>0 = buff up)"},
    ],
  },
  "virtuos_ghost": {
    arcaneId: "virtuos_ghost",
    customHandler: "virtuos_ghost",
    effects: [
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Virtuos Ghost — 40% chance on headshot (panel)"},
      {"statKey": "ampStatusChance", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Ghost — +60% amp Status Chance for 12s on HS (paper: stacks>0 = buff up)"},
    ],
  },
  "virtuos_null": {
    arcaneId: "virtuos_null",
    customHandler: "virtuos_null",
    effects: [
      {"statKey": "energyRegen", "target": "arcane_panel", "mode": "custom", "source": "wiki: Virtuos Null — +5–20% Amp energy regen for 4s on kill (paper: stacks>0)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Virtuos Null — 4s duration (constant)"},
    ],
  },
  "virtuos_shadow": {
    arcaneId: "virtuos_shadow",
    customHandler: "virtuos_shadow",
    effects: [
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Virtuos Shadow — 40% chance on headshot (panel)"},
      {"statKey": "critChanceOnDamaged", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Shadow — +60% multiplicative amp CC for 12s on HS (paper: stacks>0 = buff up)"},
    ],
  },
  "virtuos_spike": {
    arcaneId: "virtuos_spike",
    customHandler: "virtuos_spike",
    effects: [
      {"statKey": "voidConversion", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Spike — convert 24–96% Void→Puncture on amp"},
    ],
  },
  "virtuos_strike": {
    arcaneId: "virtuos_strike",
    customHandler: "virtuos_strike",
    effects: [
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Virtuos Strike — 20% chance on crit (panel)"},
      {"statKey": "ampCritDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Strike — +80% multiplicative amp CD for 4s on crit (paper: stacks>0 = buff up)"},
    ],
  },
  "virtuos_surge": {
    arcaneId: "virtuos_surge",
    customHandler: "virtuos_surge",
    effects: [
      {"statKey": "voidConversion", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Surge — convert 24–96% Void→Electricity on amp"},
    ],
  },
  "virtuos_tempo": {
    arcaneId: "virtuos_tempo",
    customHandler: "virtuos_tempo",
    effects: [
      {"statKey": "ampFireRate", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Tempo — +60% amp fire rate for 8s on kill (paper: stacks>0 = buff up)"},
      {"statKey": "healthRegenChance", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Virtuos Tempo — 60% chance on kill (panel)"},
    ],
  },
  "virtuos_trojan": {
    arcaneId: "virtuos_trojan",
    customHandler: "virtuos_trojan",
    effects: [
      {"statKey": "voidConversion", "target": "weapon_dps", "mode": "custom", "source": "wiki: Virtuos Trojan — convert 24–96% Void→Viral on amp"},
    ],
  },
  "zid_an_asheir": {
    arcaneId: "zid_an_asheir",
    customHandler: "zid_an_asheir",
    effects: [
      {"statKey": "statusChancePerHit", "target": "weapon_dps", "mode": "custom", "source": "wiki: Zid-An Asheir — +6% SC / Tauron hit (cap 50 → +300%) for WF weapons"},
      {"statKey": "tauronStrikeCharge", "target": "arcane_panel", "mode": "custom", "source": "wiki: Zid-An Asheir — +18% Tauron Strike initial charge (passive)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Zid-An Asheir — 30s SC buff"},
    ],
  },
  "zid_an_haras": {
    arcaneId: "zid_an_haras",
    customHandler: "zid_an_haras",
    effects: [
      {"statKey": "ammoEfficiency", "target": "weapon_dps", "mode": "custom", "source": "wiki: Zid-An Haras — +48% WF ammo efficiency for 30s after Tauron Strike (paper: stacks>0 = buff up)"},
      {"statKey": "ampAmmoEfficiency", "target": "weapon_dps", "mode": "custom", "source": "wiki: Zid-An Haras — +18% amp ammo efficiency (always active)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Zid-An Haras — 30s WF AE buff (panel)"},
    ],
  },
  "zid_an_osbok": {
    arcaneId: "zid_an_osbok",
    customHandler: "zid_an_osbok",
    effects: [
      {"statKey": "overguardStrip", "target": "arcane_panel", "mode": "multiplicative_percent", "source": "wiki: Zid-An Osbok — Void Sling strips 30% Overguard (panel)"},
      {"statKey": "ampCritDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Zid-An Osbok — +3.0 flat amp CD for 15s after OG strip (paper: stacks>0 = buff up)"},
      {"statKey": "buffDuration", "target": "arcane_panel", "mode": "flat", "source": "wiki: Zid-An Osbok — 15s buff (panel)"},
    ],
  },
  "zid_an_sek_eel": {
    arcaneId: "zid_an_sek_eel",
    customHandler: "zid_an_sek_eel",
    effects: [
      {"statKey": "invisibilityDuration", "target": "arcane_panel", "mode": "custom", "source": "wiki: Zid-An Sek-Eel — 30s invisibility after Tauron Strike (constant)"},
      {"statKey": "tauronChargeRate", "target": "arcane_panel", "mode": "custom", "source": "wiki: Zid-An Sek-Eel — +1.5–9% Tauron Strike Charge Rate"},
    ],
  },
  "zid_an_uskos": {
    arcaneId: "zid_an_uskos",
    customHandler: "zid_an_uskos",
    effects: [
      {"statKey": "secondaryHeatDamage", "target": "weapon_dps", "mode": "custom", "source": "wiki: Zid-An Uskos — +2.4% Heat / kill (cap 105 → max +250%; does not combine; paper uses sim stacks)"},
    ],
  },
};
