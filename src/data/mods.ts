import { Mod } from "@/lib/types";
import { normalizeModCatalog } from "@/lib/mods/set-mod-catalog";

const RAW_MODS: Mod[] = [
  {
    "id": "heavy_caliber",
    "name": "Heavy Caliber",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "damage": 15,
      "accuracy": -5
    },
    "description": "+15% Damage, -5% Accuracy per rank",
    "rarity": "rare"
  },
  {
    "id": "vigilante_armaments",
    "name": "Vigilante Armaments",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "multishot": 10
    },
    "description": "+10% Multishot per rank",
    "rarity": "common"
  },
  {
    "id": "argon_scope",
    "name": "Argon Scope",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "criticalChanceOnHeadshot": 22.5,
      "duration": 1.5
    },
    "description": "On Headshot:\\n+135% Critical Chance when Aiming for 9s",
    "rarity": "rare"
  },
  {
    "id": "galvanized_scope",
    "name": "Galvanized Scope",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "criticalChanceOnHeadshot": 10.909091,
      "criticalChanceOnHeadshotKill": 3.636364,
      "duration": 1.090909
    },
    "description": "On Headshot:\\n+120% Critical Chance when Aiming for 12s\\nOn Headshot Kill:\\n+40% Critical Chance when Aiming for 12s. Stacks up to 5x.",
    "rarity": "rare"
  },
  {
    "id": "hammer_shot",
    "name": "Hammer Shot",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 15,
      "statusChance": 20
    },
    "description": "+60% Critical Damage\\n+80% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "primed_cryo_rounds",
    "name": "Primed Cryo Rounds",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "cold": 15
    },
    "description": "+15% Cold per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "shred",
    "name": "Shred",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "fireRate": 5,
      "punchThrough": 0.2
    },
    "description": "+30% Fire Rate (x2 for Bows)\\n+1.2 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "vile_acceleration",
    "name": "Vile Acceleration",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "fireRate": 15,
      "damage": -2.5
    },
    "description": "+90% Fire Rate (x2 for Bows)\\n-15% Damage",
    "rarity": "rare"
  },
  {
    "id": "piercing_caliber",
    "name": "Piercing Caliber",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "puncture": 20.0
    },
    "description": "+20% Puncture per rank (+120% at max)",
    "rarity": "rare"
  },
  {
    "id": "bladed_rounds",
    "name": "Bladed Rounds",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 20.0,
      "duration": 1.5
    },
    "description": "On Kill:\\n+120% Critical Damage when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "vigilante_fervor",
    "name": "Vigilante Fervor",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "fireRate": 7.5
    },
    "description": "+7.5% Fire Rate per rank (Set)",
    "rarity": "uncommon"
  },
  {
    "id": "vigilante_supplies",
    "name": "Vigilante Supplies",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "ammoPickup": 15,
      "ammoConversion": 5.0
    },
    "description": "Converts Secondary ammo pickups to 30% of Ammo Pick Up.",
    "rarity": "rare"
  },
  {
    "id": "galvanized_chamber",
    "name": "Galvanized Chamber",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "multishot": 7.272727,
      "multishotOnKill": 2.727273,
      "duration": 1.818182
    },
    "description": "+80% Multishot\\nOn Kill:\\n+30% Multishot for 20s. Stacks up to 5x.",
    "rarity": "rare"
  },
  {
    "id": "galvanized_aptitude",
    "name": "Galvanized Aptitude",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "statusChance": 7.272727,
      "damagePerStatus": 3.636364,
      "duration": 1.818182
    },
    "description": "+80% Status Chance\\nOn Kill:\\n+40% Direct Damage per Status Type affecting the target for 20s. Stacks up to 2x.",
    "rarity": "rare"
  },
  {
    "id": "galvanized_savvy",
    "name": "Galvanized Savvy",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "statusChance": 7.272727,
      "damagePerStatus": 3.636364,
      "duration": 1.818182
    },
    "description": "+80% Status Chance\\nOn Kill:\\n+40% Direct Damage per Status Type affecting the target for 20s. Stacks up to 2x.",
    "rarity": "rare"
  },
  {
    "id": "critical_delay",
    "name": "Critical Delay",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "criticalChance": 33.3333,
      "fireRate": -3.3333
    },
    "description": "+200% Critical Chance\\n-20% Fire Rate (x2 for Bows)",
    "rarity": "rare"
  },
  {
    "id": "frail_momentum",
    "name": "Frail Momentum",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "fireRate": 15,
      "damage": -2.5
    },
    "description": "+15% Fire Rate, -2.5% Damage per rank",
    "rarity": "rare"
  },
  {
    "id": "wildfire",
    "name": "Wildfire",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "heat": 15,
      "magazine": 5
    },
    "description": "+15% Heat, +5% Magazine per rank",
    "rarity": "rare"
  },
  {
    "id": "ice_storm",
    "name": "Ice Storm",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "cold": 10,
      "magazine": 10
    },
    "description": "+40% Magazine Capacity, +40% Cold at max rank",
    "rarity": "rare"
  },
  {
    "id": "thermite_rounds_nightmare",
    "name": "Thermite Rounds",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "heat": 15,
      "statusChance": 15
    },
    "description": "+60% Heat, +60% Status Chance at max rank",
    "rarity": "rare"
  },
  {
    "id": "critical_deceleration",
    "name": "Critical Deceleration",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "criticalChance": 33.3333,
      "fireRate": -3.3333
    },
    "description": "+8% Crit Chance, -6% Fire Rate per rank",
    "rarity": "rare"
  },
  {
    "id": "amalgam_serration",
    "name": "Amalgam Serration",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "rifle",
    "subCategory": "weapon",
    "stats": {
      // Max rank: +155% damage (14.0909×11), +55% sprint speed (5×11).
      "damage": 14.0909,
      "sprintSpeed": 5
    },
    "description": "+155% Damage, +55% Sprint Speed at max rank",
    "rarity": "rare"
  },
  {
    "id": "seeking_fury",
    "name": "Seeking Fury",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 2.5,
      "punchThrough": 0.2
    },
    "description": "+5% Reload, +0.2m Punch Through per rank",
    "rarity": "rare"
  },
  {
    "id": "magnum_force",
    "name": "Magnum Force",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "damage": 15,
      "accuracy": -5.0
    },
    "description": "+165% Damage, -55% Accuracy at max rank",
    "rarity": "rare"
  },

  {
    "id": "primed_pistol_gambit",
    "name": "Primed Pistol Gambit",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "criticalChance": 17
    },
    "description": "+187% Critical Chance at max rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "hydraulic_crosshairs",
    "name": "Hydraulic Crosshairs",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "criticalChanceOnHeadshot": 22.5,
      "duration": 1.5
    },
    "description": "On Headshot:\\n+135% Critical Chance when Aiming for 9s",
    "rarity": "common"
  },
  {
    "id": "galvanized_crosshairs",
    "name": "Galvanized Crosshairs",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "criticalChanceOnHeadshot": 10.909091,
      "criticalChanceOnHeadshotKill": 3.636364,
      "duration": 1.090909
    },
    "description": "On Headshot:\\n+120% Critical Chance when Aiming for 12s\\nOn Headshot Kill:\\n+40% Critical Chance when Aiming for 12s. Stacks up to 5x.",
    "rarity": "rare"
  },
  {
    "id": "primed_target_cracker",
    "name": "Primed Target Cracker",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10
    },
    "description": "+110% Critical Damage at max rank (Primed)",
    "rarity": "legendary"
  },

  {
    "id": "embedded_catalyzer",
    "name": "Embedded Catalyzer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "statusChance": 15,
      "duration": 1.5
    },
    "description": "On Ability Cast:\\n+90% Status Chance when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "galvanized_shot",
    "name": "Galvanized Shot",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "statusChance": 7.272727,
      "damagePerStatus": 3.636364,
      "duration": 1.272727
    },
    "description": "+80% Status Chance\\nOn Kill:\\n+40% Direct Damage per Status Type affecting the target for 14s. Stacks up to 3x.",
    "rarity": "rare"
  },
  {
    "id": "primed_heated_charge",
    "name": "Primed Heated Charge",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "heat": 15
    },
    "description": "+15% Heat per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "primed_convulsion",
    "name": "Primed Convulsion",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "electricity": 15
    },
    "description": "+15% Electricity per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "lethal_torrent",
    "name": "Lethal Torrent",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "fireRate": 10,
      "multishot": 10
    },
    "description": "+10% Fire Rate, +10% Multishot per rank",
    "rarity": "rare"
  },
  {
    "id": "anemic_agility",
    "name": "Anemic Agility",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "fireRate": 15,
      "damage": -2.5
    },
    "description": "+15% Fire Rate, -2.5% Damage per rank",
    "rarity": "rare"
  },

  {
    "id": "pistol_ammo_mutation",
    "name": "Pistol Ammo Mutation",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.333333
    },
    "description": "Converts Primary ammo pickups to 50% of Ammo Pick Up.",
    "rarity": "rare"
  },
  {
    "id": "creeping_bullseye",
    "name": "Creeping Bullseye",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "criticalChance": 33.3333,
      "fireRate": -3.3333
    },
    "description": "+8% Crit Chance, -6% Fire Rate per rank",
    "rarity": "rare"
  },
  {
    "id": "primed_point_blank",
    "name": "Primed Point Blank",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "damage": 15
    },
    "description": "+15% Damage per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "vicious_spread",
    "name": "Vicious Spread",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "damage": 15,
      "spread": 10,
      "accuracy": -10.0
    },
    "description": "+90% Damage, +60% Spread at max rank",
    "rarity": "rare"
  },
  {
    "id": "hells_chamber",
    "name": "Hell's Chamber",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "multishot": 20
    },
    "description": "+20% Multishot per rank",
    "rarity": "rare"
  },
  {
    "id": "primed_ravage",
    "name": "Primed Ravage",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10
    },
    "description": "+110% Critical Damage at max rank (Primed)",
    "rarity": "legendary"
  },

  {
    "id": "primed_charged_shell",
    "name": "Primed Charged Shell",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "electricity": 15
    },
    "description": "+15% Electricity per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "primed_chilling_grasp",
    "name": "Primed Chilling Grasp",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "cold": 15
    },
    "description": "+15% Cold per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "shotgun_spazz",
    "name": "Shotgun Spazz",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "fireRate": 15
    },
    "description": "+15% Fire Rate per rank",
    "rarity": "common"
  },
  {
    "id": "galvanized_hell",
    "name": "Galvanized Hell",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "multishot": 10,
      "multishotOnKill": 2.727273,
      "duration": 1.818182
    },
    "description": "+110% Multishot\\nOn Kill:\\n+30% Multishot for 20s. Stacks up to 4x.",
    "rarity": "rare"
  },
  {
    "id": "ammo_mutation",
    "name": "Shotgun Ammo Mutation",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.333333
    },
    "description": "Converts Secondary ammo pickups to 50% of Ammo Pick Up.",
    "rarity": "rare"
  },
  {
    "id": "blaze",
    "name": "Blaze",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "heat": 15,
      "damage": 15
    },
    "description": "+15% Heat, +15% Damage per rank",
    "rarity": "rare"
  },
  {
    "id": "burdened_magazine",
    "name": "Burdened Magazine",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "shotgun",
    "subCategory": "",
    "stats": {
      "magazine": 10,
      "reloadSpeed": -3
    },
    "description": "+60% Magazine Capacity\\n-18% Reload Speed",
    "rarity": "rare"
  },
  {
    "id": "primed_pressure_point",
    "name": "Primed Pressure Point",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 15
    },
    "description": "+165% Damage at max rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "blood_rush",
    "name": "Blood Rush",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalChancePerCombo": 3.6364,
      "criticalChance": 3.636364
    },
    "description": "+40% Critical Chance per Combo Multiplier at max rank",
    "rarity": "uncommon"
  },
  {
    "id": "sacrificial_steel",
    "name": "Sacrificial Steel",
    "polarity": "umbra",
    "drain": 6,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalChance": 20,
      "sentientDamage": 3
    },
    "description": "+220% Critical Chance (x2 for Heavy Attacks)\\nx1.33 Damage to Sentients",
    "rarity": "legendary"
  },

  {
    "id": "condition_overload",
    "name": "Condition Overload",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damagePerStatus": 13.3333,
      "damage": 13.333333
    },
    "description": "+80% Damage per Status Type affecting the target at max rank",
    "rarity": "rare"
  },
  {
    "id": "primed_fever_strike",
    "name": "Primed Fever Strike",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "toxin": 15
    },
    "description": "+15% Toxin per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "primed_fury",
    "name": "Primed Fury",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 5
    },
    "description": "+7.5% Attack Speed per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "berserker",
    "name": "Berserker",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeedOnCrit": 7.5
    },
    "description": "Stance: Valkyr is imbued with energy and becomes a ball of vicious rage, capable of unleashing a torrent of deadly claw attacks on unsuspecting foes.",
    "rarity": "rare"
  },
  {
    "id": "gladiator_vice",
    "name": "Gladiator Vice",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 5
    },
    "description": "+7.5% Attack Speed per rank (Set)",
    "rarity": "rare"
  },
  {
    "id": "primed_reach",
    "name": "Primed Reach",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "range": 0.272727
    },
    "description": "+17% Range per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "spring_loaded_blade",
    "name": "Spring-Loaded Blade",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "range": 0.166667,
      "duration": 4.0
    },
    "description": "On Status Effect: +1 Range for 24s. Stacks up to 2 times.",
    "rarity": "rare"
  },
  {
    "id": "body_count",
    "name": "Body Count",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboDuration": 2,
      "duration": 2.0
    },
    "description": "+2s Combo Duration per rank",
    "rarity": "common"
  },
  {
    "id": "gladiator_rush",
    "name": "Gladiator Rush",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboDuration": 1.5,
      "duration": 1.0
    },
    "description": "+1.5s Combo Duration per rank (Set)",
    "rarity": "common"
  },
  {
    "id": "killing_blow",
    "name": "Killing Blow",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "heavyAttackDamage": 20,
      "damage": 20.0,
      "heavyAttackEfficiency": 10.0
    },
    "description": "+120% Melee Damage On Heavy Attack\\n+60% Heavy Attack Wind Up Speed",
    "rarity": "uncommon"
  },
  {
    "id": "corrupt_charge",
    "name": "Corrupt Charge",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboCount": 15,
      "attackSpeed": -10
    },
    "description": "Start with +15 Combo, -10% Attack Speed per rank",
    "rarity": "rare"
  },
  {
    "id": "amalgam_organ_shatter",
    "name": "Amalgam Organ Shatter",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "weapon",
    "stats": {
      "criticalMultiplier": 14.1667,
      "heavyWindUp": 10,
      "heavyAttackEfficiency": 10.0
    },
    "description": "+85% Critical Damage\\n+60% Heavy Attack Wind Up Speed",
    "rarity": "rare"
  },
  {
    "id": "life_strike",
    "name": "Life Strike",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "lifeSteal": 5
    },
    "description": "Heavy Attacks have +5% Life Steal per rank",
    "rarity": "rare"
  },
  {
    "id": "healing_return",
    "name": "Healing Return",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "healthOnStatus": 1
    },
    "description": "Restores 11 Health per Status Type affecting the target",
    "rarity": "rare"
  },


  {
    "id": "covert_lethality",
    "name": "Covert Lethality",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "lethalDamage": 100,
      "damage": 25.0,
      "finisherDamage": 25.0
    },
    "description": "+16 Initial Combo\\n+100% Finisher Damage",
    "rarity": "rare"
  },
  {
    "id": "riven_rifle",
    "name": "Riven Mod (Rifle)",
    "polarity": "zenurik",
    "drain": 18,
    "maxRank": 8,
    "category": "rifle",
    "subCategory": "riven",
    "stats": {},
    "description": "Riven mod with random stats. Configure stats after equipping.",
    "rarity": "legendary"
  },
  {
    "id": "riven_shotgun",
    "name": "Riven Mod (Shotgun)",
    "polarity": "zenurik",
    "drain": 18,
    "maxRank": 8,
    "category": "shotgun",
    "subCategory": "riven",
    "stats": {},
    "description": "Riven mod with random stats. Configure stats after equipping.",
    "rarity": "legendary"
  },
  {
    "id": "riven_pistol",
    "name": "Riven Mod (Pistol)",
    "polarity": "zenurik",
    "drain": 18,
    "maxRank": 8,
    "category": "pistol",
    "subCategory": "riven",
    "stats": {},
    "description": "Riven mod with random stats. Configure stats after equipping.",
    "rarity": "legendary"
  },
  {
    "id": "riven_melee",
    "name": "Riven Mod (Melee)",
    "polarity": "zenurik",
    "drain": 18,
    "maxRank": 8,
    "category": "melee",
    "subCategory": "riven",
    "stats": {},
    "description": "Riven mod with random stats. Configure stats after equipping.",
    "rarity": "legendary"
  },
  {
    "id": "aura_cunning_drift",
    "name": "Cunning Drift",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityRange": 2.5,
      "slideSpeed": 2.0,
      "slideFriction": -5.0
    },
    "description": "+12% Slide\\n-30% Friction\\n+15% Ability Range",
    "rarity": "rare"
  },
  {
    "id": "aura_speed_holster",
    "name": "Speed Holster",
    "polarity": "naramon",
    "drain": -7,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "holsterSpeed": 20
    },
    "description": "+20% Holster Speed per rank",
    "rarity": "uncommon"
  },
  {
    "id": "aura_toxin_resistance",
    "name": "Toxin Resistance",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "toxinResistance": 15,
      "toxin": 2.5
    },
    "description": "+15% Toxin Resistance per rank",
    "rarity": "uncommon"
  },
  {
    "id": "aura_physique",
    "name": "Physique",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 3.3333
    },
    "description": "Squad gains +20% Maximum Health",
    "rarity": "uncommon"
  },
  {
    "id": "aura_energy_siphon",
    "name": "Energy Siphon",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energyRegen": 0.3,
      "energyOnKill": 0.1
    },
    "description": "Squad receives +0.6 Energy Regen/s",
    "rarity": "uncommon"
  },
  {
    "id": "aura_rejuvenation",
    "name": "Rejuvenation",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "healthRegen": 1
    },
    "description": "Squad receives +3 Health Regen/s",
    "rarity": "uncommon"
  },
  {
    "id": "aura_corrosive_projection",
    "name": "Corrosive Projection",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armorReduction": 6,
      "armor": -3.0
    },
    "description": "-6% Enemy Armor per rank",
    "rarity": "uncommon"
  },
  {
    "id": "aura_shield_disruption",
    "name": "Shield Disruption",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shieldReduction": 6,
      "shield": -3.0
    },
    "description": "Enemies lose -18% Shield Capacity",
    "rarity": "uncommon"
  },
  {
    "id": "aura_infested_impedance",
    "name": "Infested Impedance",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "infestedSpeedReduction": 5
    },
    "description": "Enemy Infested lose -18% Speed",
    "rarity": "uncommon"
  },
  {
    "id": "aura_rifle_amplification",
    "name": "Rifle Amp",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "rifleDamage": 4,
      "damage": 4.5
    },
    "description": "Squad receives +27% Rifle Damage",
    "rarity": "uncommon"
  },
  {
    "id": "aura_shotgun_amplification",
    "name": "Shotgun Amp",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shotgunDamage": 5,
      "damage": 3.0
    },
    "description": "Squad receives +18% Shotgun Damage",
    "rarity": "uncommon"
  },
  {
    "id": "aura_pistol_amplification",
    "name": "Pistol Amp",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "pistolDamage": 6,
      "damage": 4.5
    },
    "description": "Squad receives +27% Pistol Damage",
    "rarity": "uncommon"
  },
  {
    "id": "aura_steel_charge",
    "name": "Steel Charge",
    "polarity": "madurai",
    "drain": -4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "meleeDamage": 10,
      "damage": 10.0
    },
    "description": "Squad receives +60% Melee Damage",
    "rarity": "uncommon"
  },
  {
    "id": "aura_sprint_boost",
    "name": "Sprint Boost",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 2.5
    },
    "description": "Squad receives +15% Sprint Speed",
    "rarity": "uncommon"
  },
  {
    "id": "aura_sprint_speed",
    "name": "Sprint Speed",
    "polarity": "naramon",
    "drain": -7,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 2
    },
    "description": "+2% Sprint Speed per rank",
    "rarity": "uncommon"
  },
  {
    "id": "aura_looters",
    "name": "Looters",
    "polarity": "vazarin",
    "drain": -7,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "lootRadar": 10
    },
    "description": "+10m Loot Radar per rank",
    "rarity": "common"
  },
  {
    "id": "aura_enemy_radar",
    "name": "Enemy Radar",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "enemyRadar": 10
    },
    "description": "Highlights enemies on the Minimap\\nSquad receives +30 Enemy Radar",
    "rarity": "uncommon"
  },
  {
    "id": "primed_redirection",
    "name": "Primed Redirection",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": 16.3636
    },
    "description": "+180% Shield Capacity",
    "rarity": "legendary"
  },
  {
    "id": "fortitude",
    "name": "Fortitude",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shieldRecharge": 15,
      "knockdownResistance": 10.0,
      "shield": 25.0
    },
    "description": "+15% Shield Recharge, +50% Knockdown Resistance per rank",
    "rarity": "rare"
  },
  {
    "id": "armored_agility",
    "name": "Armored Agility",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 6.6667,
      "sprintSpeed": 2.5
    },
    "description": "+7.5% Armor, +2.5% Sprint Speed per rank",
    "rarity": "rare"
  },
  {
    "id": "gladiator_aegis",
    "name": "Gladiator Aegis",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 6.6667
    },
    "description": "+7.5% Armor per rank (Set)",
    "rarity": "common"
  },
  {
    "id": "primed_flow",
    "name": "Primed Flow",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energy": 16.8182
    },
    "description": "+185% Energy Max at max rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "primed_continuity",
    "name": "Primed Continuity",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 5
    },
    "description": "+5% Ability Duration per rank (Primed)",
    "rarity": "legendary"
  },
  {
    "id": "narrow_minded",
    "name": "Narrow Minded",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 9,
      "abilityRange": -6
    },
    "description": "+99% Ability Duration\\n-66% Ability Range",
    "rarity": "rare"
  },
  {
    "id": "blind_rage",
    "name": "Blind Rage",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 9,
      "abilityEfficiency": -5
    },
    "description": "+99% Ability Strength\\n-55% Ability Efficiency",
    "rarity": "rare"
  },
  {
    "id": "transient_fortitude",
    "name": "Transient Fortitude",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 5,
      "abilityDuration": -2.5
    },
    "description": "+55% Ability Strength\\n-27.5% Ability Duration",
    "rarity": "rare"
  },
  {
    "id": "umbra_intensify",
    "name": "Umbral Intensify",
    "polarity": "umbra",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "warframeId": "universal",
    "stats": {
      "abilityStrength": 4,
      "tauResistance": 1
    },
    "description": "+4% Strength, +1% Tau Resistance per rank",
    "rarity": "legendary"
  },
  {
    "id": "speed_drift",
    "name": "Speed Drift",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "coactionBonus": 2.5,
      "sprintSpeed": 2
    },
    "description": "+12% Sprint Speed\\n+15% Casting Speed",
    "rarity": "rare"
  },
  {
    "id": "patagium",
    "name": "Patagium",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "aimGlide": 2.5,
      "wallLatch": 2.5
    },
    "description": "+2.5s Aim Glide and Wall Latch per rank",
    "rarity": "uncommon"
  },
  {
    "id": "aerodynamic",
    "name": "Aerodynamic",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "airborneDamageReduction": 5,
      "damage": 4.0,
      "duration": 2.0
    },
    "description": "Squad takes 24% reduced damage while airborne, gains +6s Aim Glide and +12s Wall Latch",
    "rarity": "rare"
  },
  {
    "id": "thiefs_wit",
    "name": "Thief's Wit",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "lootRadar": 7,
      "range": 7.0
    },
    "description": "Minimap shows loot crates.\\n+42m Loot Radar",
    "rarity": "common"
  },
  {
    "id": "vigilante_pursuit",
    "name": "Vigilante Pursuit",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "enemyRadar": 5,
      "range": 5.0
    },
    "description": "+5m Enemy Radar per rank (Set)",
    "rarity": "uncommon"
  },
  {
    "id": "umbra_fiber",
    "name": "Umbral Fiber",
    "polarity": "umbra",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "warframeId": "universal",
    "stats": {
      "armor": 9.090909,
      "tauResistance": 1
    },
    "description": "+55% Armor, +11% Tau Resistance",
    "rarity": "legendary"
  },
  {
    "id": "umbra_vitality",
    "name": "Umbral Vitality",
    "polarity": "umbra",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "warframeId": "universal",
    "stats": {
      "health": 9.090909,
      "tauResistance": 1
    },
    "description": "+44% Health, +11% Tau Resistance",
    "rarity": "legendary"
  },
  {
    "id": "animal_instinct",
    "name": "Animal Instinct",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "lootRadar": 5,
      "enemyRadar": 3
    },
    "description": "+30m Loot Radar\\n+18m Enemy Radar",
    "rarity": "rare"
  },
  {
    "id": "primed_animal_instinct",
    "name": "Primed Animal Instinct",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "lootRadar": 5,
      "enemyRadar": 3
    },
    "description": "+55m Loot Radar\\n+33m Enemy Radar",
    "rarity": "legendary"
  },
  {
    "id": "calculated_redirection",
    "name": "Calculated Redirection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "shield": 22.7273
    },
    "description": "+250% Shield Capacity",
    "rarity": "common"
  },
  {
    "id": "enhanced_vitality",
    "name": "Enhanced Vitality",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "health": 22.7273
    },
    "description": "+250% Health",
    "rarity": "common"
  },
  {
    "id": "link_fiber",
    "name": "Link Fiber",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "armorLink": 110,
      "armor": 11.363636
    },
    "description": "Increase Max Armor by +125% of Warframe's Armor",
    "rarity": "uncommon"
  },
  {
    "id": "link_redirection",
    "name": "Link Redirection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "shieldLink": 275,
      "shield": 11.363636
    },
    "description": "Increase Shield by +125% of Warframe's Max Shield",
    "rarity": "uncommon"
  },
  {
    "id": "link_vitality",
    "name": "Link Vitality",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healthLink": 275,
      "health": 11.363636
    },
    "description": "Increase Health by +125% of Warframe's Max Health",
    "rarity": "uncommon"
  },
  {
    "id": "loyal_companion",
    "name": "Loyal Companion",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "damageReduction": 60,
      "heat": 5.833333,
      "cooldown": 10.0,
      "duration": 1.666667
    },
    "description": "When your Health falls below 35%, gain 75% Damage Reduction for 10s while your Companion becomes invincible and draws fire to itself for 10s. 60s cooldown.",
    "rarity": "common"
  },
  {
    "id": "medi_pet_kit",
    "name": "Medi-Pet Kit",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healthRegen": 12,
      "recoveryTime": 90,
      "duration": 2.5
    },
    "description": "+12 Companion Health Regen/s\\n-15s Companion Recovery Time",
    "rarity": "rare"
  },
  {
    "id": "metal_fiber",
    "name": "Metal Fiber",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "armor": 22.7273
    },
    "description": "+250% Armor",
    "rarity": "common"
  },
  {
    "id": "pack_leader",
    "name": "Pack Leader",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healOnMelee": 36
    },
    "description": "Heal your Companion with Melee hits. Excess healing grants Overguard.\\n+100 Health per hit\\n+1,200 Overguard Max",
    "rarity": "common"
  },
  {
    "id": "primed_pack_leader",
    "name": "Primed Pack Leader",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healOnMelee": 66
    },
    "description": "Heal your Companion with Melee hits. Excess healing grants Overguard.\\n+183 Health per hit\\n+2,200 Overguard Max",
    "rarity": "legendary"
  },
  {
    "id": "synth_deconstruct",
    "name": "Synth Deconstruct",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healthOrbChance": 25,
      "health": 4.166667
    },
    "description": "Enemies injured by the Companions have 25% chance to drop a Health Orb when killed.",
    "rarity": "rare"
  },
  {
    "id": "synth_fiber",
    "name": "Synth Fiber",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healthPickupBonus": 100,
      "duration": 3.0
    },
    "description": "Health Orbs increase Armor for Companions by 100% for 12s.",
    "rarity": "rare"
  },
  {
    "id": "aerial_bond",
    "name": "Aerial Bond",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "airborneCrit": 150,
      "airborneDamage": 60,
      "duration": 0.5,
      "range": 1.666667
    },
    "description": "Airborne kills decrease Companion Recovery Time by 3s and 9s for headshot kills. Companion creates a field of cold that increases up to 35% and 10m radius while Warframe is airborne, lasting for 3s after returning to ground.",
    "rarity": "rare"
  },
  {
    "id": "astral_bond",
    "name": "Astral Bond",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "energyOnAbility": 10,
      "damage": 10.0,
      "duration": 0.833333
    },
    "description": "Damage dealt by Operator or Drifter grants 60% damage and 30% Void Damage to your Companion's attacks for 10s. Companion Void Damage adds +30% Amp and Energy Efficiency to Operator or Drifter for 5s.",
    "rarity": "rare"
  },
  {
    "id": "contagious_bond",
    "name": "Contagious Bond",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "statusSpread": 100,
      "range": 1.5
    },
    "description": "When your Companion kills an enemy afflicted with a Status Effect, 50% of the Status Effect spreads to other enemies within 9m. Max 100 stacks.",
    "rarity": "rare"
  },
  {
    "id": "covert_bond",
    "name": "Covert Bond",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "stealthDamage": 120,
      "duration": 10.0
    },
    "description": "Finisher and Mercy Kills grant your Companion 10s of stealth that attacks will not disrupt. Max 60s.",
    "rarity": "rare"
  },
  {
    "id": "duplex_bond",
    "name": "Duplex Bond",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "companionDamage": 60,
      "extraAttack": 30,
      "energy": 8.333333,
      "duration": 5.0
    },
    "description": "Companion will clone itself each time you expend 100 energy, up to 3 clones. Clones live 30s and cannot use Abilities. Their kills have a 50% chance of dropping Energy Orbs.",
    "rarity": "rare"
  },
  {
    "id": "momentous_bond",
    "name": "Momentous Bond",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "heavyAttackDamage": 110,
      "heavyAttackSpeed": 30,
      "damage": 20.0,
      "duration": 3.0
    },
    "description": "Killing Eximus enemies grants 120% bonus of a random Elemental Damage to your Companion for 30s and reduces Companion Recovery Time by 18s.",
    "rarity": "rare"
  },
  {
    "id": "mystic_bond",
    "name": "Mystic Bond",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "energyLeech": 15
    },
    "description": "After your Companion uses Abilities with cooldowns 5 times, you may cast a Warframe Ability without expending Energy.",
    "rarity": "rare"
  },
  {
    "id": "reinforced_bond",
    "name": "Reinforced Bond",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "overguard": 1200,
      "reviveOverguard": 2400,
      "shield": 10.0
    },
    "description": "If the Companion exceeds 1200 Max Shields or Overshields then your fire rate is increased 60%. Reloading restores 150 Overshields to your companion.",
    "rarity": "rare"
  },
  {
    "id": "restorative_bond",
    "name": "Restorative Bond",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "healthOnKill": 60,
      "restoreNearby": 30,
      "duration": 0.5
    },
    "description": "Health Orbs restore 60 more health and reduce Companion Recovery Time by 3s.",
    "rarity": "rare"
  },
  {
    "id": "seismic_bond",
    "name": "Seismic Bond",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "knockdownDuration": 90,
      "damage": 5.0,
      "range": 0.666667,
      "duration": 2.0
    },
    "description": "While a channeled Ability is active, Companion melee attacks create a 4m shockwave for 30% of their melee attack damage. Damage dealt by your Companion increases your Ability Efficiency by 3% for 12 seconds. Max 10 stacks.",
    "rarity": "rare"
  },
  {
    "id": "tenacious_bond",
    "name": "Tenacious Bond",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "headshotCritDamage": 150,
      "mercyCritDamage": 150,
      "criticalMultiplier": 8.333333,
      "duration": 0.5
    },
    "description": "Headshot kills reduce Companion Recovery timer by 3s. If the Companion's Critical Chance is over 50% then you gain +1.2x Final Critical Damage Multiplier.",
    "rarity": "rare"
  },
  {
    "id": "vicious_bond",
    "name": "Vicious Bond",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "meleeAttackSpeed": 30,
      "meleeDamage": 60,
      "damage": 2.5,
      "range": 1.5
    },
    "description": "Companion melee attacks strip 15% of enemy armor. Enemies recently damaged by Abilities spread the effect to other enemies in a 9m radius.",
    "rarity": "rare"
  },
  {
    "id": "manifold_bond",
    "name": "Manifold Bond",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "universal",
    "stats": {
      "abilityDamage": 30,
      "abilityDuration": 30,
      "cooldown": 0.5
    },
    "description": "Companion Precept Mods apply Status Effects from Companion weapons. Killing enemies with 3 or more unique Status Effects reduces Companion Ability cooldowns by 3s.",
    "rarity": "rare"
  },
  {
    "id": "accelerated_deflection",
    "name": "Accelerated Deflection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "shieldRecharge": 90,
      "shield": -7.5
    },
    "description": "+90% Shield Recharge\\n-45% Shield Recharge Delay",
    "rarity": "uncommon"
  },
  {
    "id": "anti_grav_array",
    "name": "Anti-Grav Array",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "gravityReduction": 80
    },
    "description": "Increase height of owner's jumps by +40%.",
    "rarity": "rare"
  },
  {
    "id": "coolant_leak",
    "name": "Coolant Leak",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "coldDamage": 60,
      "slow": 30,
      "cooldown": 2.5
    },
    "description": "Unleashes a 10m radial blast of Cold when multiple enemies are nearby. Add 3 stacks. 10s cooldown.",
    "rarity": "rare"
  },
  {
    "id": "guardian",
    "name": "Guardian",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "shieldRestore": 100,
      "cooldown": 30
    },
    "description": "Restores 100% Shields when depleted, 30s cooldown",
    "rarity": "common"
  },
  {
    "id": "medi_ray",
    "name": "Medi-Ray",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "healthRestore": 12,
      "range": 15,
      "health": 2.0,
      "duration": 0.666667
    },
    "description": "Sentinel will occasionally heal its owner, restoring 12% Health over 4s.",
    "rarity": "uncommon"
  },
  {
    "id": "odomedic",
    "name": "Odomedic",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "healthRestoreMove": 9,
      "range": 0.75,
      "duration": 1.0
    },
    "description": "Every 3m traversed by Wall Running regenerates +40 Health over 4s. This effect can stack up to 3x.",
    "rarity": "rare"
  },
  {
    "id": "sanctuary",
    "name": "Sanctuary",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "bubbleHealth": 600,
      "rechargeDelay": 15
    },
    "description": "Creates a shield with 1800 Health around the player when they are reviving fallen allies.",
    "rarity": "rare"
  },
  {
    "id": "shield_charger",
    "name": "Shield Charger",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "overshields": 200,
      "range": 15,
      "duration": 1.666667
    },
    "description": "Increase Warframe Max Shields and Shield Regeneration by 60% for 10s.",
    "rarity": "rare"
  },
  {
    "id": "spare_parts",
    "name": "Spare Parts",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "lootChance": 45,
      "duration": 2.5
    },
    "description": "Companion marks a target every 15s for 15s. The target becomes 200% more likely to drop an item when killed.",
    "rarity": "uncommon"
  },
  {
    "id": "vacuum",
    "name": "Vacuum",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "pickupRange": 13.5,
      "range": 2.25
    },
    "description": "13.5m Companion Gather-Link. Detects and collects items, including mods.",
    "rarity": "common"
  },
  {
    "id": "fetch",
    "name": "Fetch",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "pickupRange": 13.5,
      "range": 2.25
    },
    "description": "13.5m Companion Gather-Link. Detects and collects items, including mods.",
    "rarity": "uncommon"
  },
  {
    "id": "regen",
    "name": "Regen",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "regenCharges": 3,
      "healthPercent": 100,
      "duration": 1.666667
    },
    "description": "Sentinel recovery time reduced by 20s. Revives with 10s of invulnerability.",
    "rarity": "common"
  },
  {
    "id": "primed_regen",
    "name": "Primed Regen",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "regenCharges": 6,
      "healthPercent": 100,
      "duration": 0.909091
    },
    "description": "Sentinel recovery time reduced by 35s. Revives with 10s of invulnerability.",
    "rarity": "legendary"
  },
  {
    "id": "repair_kit",
    "name": "Repair Kit",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "healthRegen": 6
    },
    "description": "+18 Companion Health Regen/s",
    "rarity": "common"
  },
  {
    "id": "sacrifice",
    "name": "Sacrifice",
    "polarity": "penjaga",
    "drain": 6,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "revive": 100,
      "health": 25.0,
      "duration": 3.75
    },
    "description": "Sentinel incapacitates itself to revive its downed owner to 100% health and shields in 4s. Sentinel Recovery timer increases by 15s.\\n+15s Companion Recovery Time",
    "rarity": "rare"
  },
  {
    "id": "self_destruct",
    "name": "Self Destruct",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "blastDamage": 600,
      "radius": 6,
      "range": 3.0
    },
    "description": "Explodes when incapacitated, dealing 600 Blast Damage in a 18m radius and knocking down nearby enemies.",
    "rarity": "rare"
  },
  {
    "id": "targeting_receptor",
    "name": "Targeting Receptor",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "targetRange": 30,
      "range": 2.5
    },
    "description": "Causes the Helios Sentinel to attack targets within 10m with 3 glaives.",
    "rarity": "common"
  },
  {
    "id": "reawaken",
    "name": "Reawaken",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "autoRevive": 90,
      "duration": 1.0
    },
    "description": "Energy Orbs reduce Sentinel Recovery timer by 6s. Djinn recovers with 300 Overshields per Energy Orb collected. Djinn's max Overshields increase by 900.",
    "rarity": "rare"
  },
  {
    "id": "negate",
    "name": "Negate",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "robotic",
    "stats": {
      "statusImmunity": 5,
      "duration": 0.833333
    },
    "description": "Sentinel prevents Status Effects from applying to its owner once every 5s.",
    "rarity": "rare"
  },
  {
    "id": "bite",
    "name": "Bite",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "critChance": 30,
      "critDamage": 60,
      "criticalChance": 30.0,
      "criticalMultiplier": 20.0
    },
    "description": "+330% Critical Chance\\n+220% Critical Damage",
    "rarity": "rare"
  },
  {
    "id": "maul",
    "name": "Maul",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "damage": 30.0
    },
    "description": "+330% Melee Damage",
    "rarity": "uncommon"
  },
  {
    "id": "ferocity",
    "name": "Ferocity",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "attackSpeed": 30,
      "criticalChance": 50.0,
      "range": 1.0
    },
    "description": "Kubrow attacks an enemy open to finishers with +300% crit chance. If the enemy dies during the attack, enemies within 6m have a 30% chance to be knocked down and opened to finishers.",
    "rarity": "rare"
  },
  {
    "id": "hunt",
    "name": "Hunt",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "finisherChance": 35,
      "damage": 20.0
    },
    "description": "The kubrow charges at a target, dragging them and dealing 120% damage to all in its path.",
    "rarity": "rare"
  },
  {
    "id": "howl",
    "name": "Howl",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "fearDuration": 9,
      "range": 4.0,
      "duration": 2.666667
    },
    "description": "The kubrow cries out with a blood-curdling howl that strikes fear into 15 enemies within 24m for 16s.",
    "rarity": "rare"
  },
  {
    "id": "protect",
    "name": "Protect",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "shieldRestore": 100,
      "cooldown": 30,
      "shield": 5.0,
      "duration": 0.5
    },
    "description": "The kubrow comes to the defense of its master, replenishing both of their shields by 30% of its maximum shields and adding its shield regeneration rate to its master's for 3s.",
    "rarity": "rare"
  },
  {
    "id": "retrieve",
    "name": "Retrieve",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "lootFetch": 27.5,
      "range": 5.0,
      "duration": 1.666667
    },
    "description": "Kubrow has 45% chance to scavenge additional loot from a fallen enemy or containers within 30m, every 10s.",
    "rarity": "common"
  },
  {
    "id": "savagery",
    "name": "Savagery",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "finisherDamage": 110,
      "range": 1.666667
    },
    "description": "The Kubrow rushes at 8 enemies within 10m, dealing damage and knocking them over.",
    "rarity": "rare"
  },
  {
    "id": "scavenge",
    "name": "Scavenge",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "ammoChance": 45
    },
    "description": "+90% chance for the pet to pry open a locked locker.",
    "rarity": "common"
  },
  {
    "id": "stalk",
    "name": "Stalk",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "stealthDuration": 9,
      "cooldown": 18,
      "range": 4.0
    },
    "description": "The kubrow cloaks itself and its master to stalk down its prey when they are within 24m.",
    "rarity": "rare"
  },
  {
    "id": "unleashed",
    "name": "Unleashed",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "vipCapture": 100,
      "damage": 50.0,
      "range": 10.0
    },
    "description": "The kubrow hunts for Eximus units protected by Overguard within 60m and deals +300% Damage against Overguard.",
    "rarity": "rare"
  },
  {
    "id": "dig",
    "name": "Dig",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "digCooldown": 40
    },
    "description": "The kubrow sniffs out buried objects and digs them up.\\n+270% Success Chance",
    "rarity": "rare"
  },
  {
    "id": "neutralize",
    "name": "Neutralize",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "disarmChance": 30,
      "range": 1.666667
    },
    "description": "The kubrow roars, causing enemies within 10m to stumble and drop their weapons.",
    "rarity": "rare"
  },
  {
    "id": "reflect",
    "name": "Reflect",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "damageReflection": 60,
      "damage": 10.0
    },
    "description": "Adarza Kavat has a 40% chance to reflect damage back to an enemy, amplifying it by 60%.",
    "rarity": "rare"
  },
  {
    "id": "cats_eye",
    "name": "Cat's Eye",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "critBuff": 60,
      "duration": 5.0,
      "criticalChance": 15.0,
      "range": 6.25
    },
    "description": "Adarza Kavat grants 60% increased critical chance for 10s to allies within 25m every 20s.",
    "rarity": "rare"
  },
  {
    "id": "charm",
    "name": "Charm",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "buffChance": 27,
      "duration": 6.75
    },
    "description": "Smeeta Kavat has a 40% chance every 27s to bestow its owner with good fortune.",
    "rarity": "rare"
  },
  {
    "id": "draining_bite",
    "name": "Draining Bite",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "lifeSteal": 20,
      "damage": 37.5
    },
    "description": "Vasca Kavat inflicts 5 stacks of Slash at 150% of its melee damage and restores 10% Health to itself.",
    "rarity": "rare"
  },
  {
    "id": "transfusion",
    "name": "Transfusion",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "beast",
    "stats": {
      "reviveChance": 90,
      "cooldown": 120,
      "health": 5.0
    },
    "description": "When its Master is bleeding out, the Vasca Kavat sacrifices 20% of its Health to raise them.",
    "rarity": "rare"
  },
  {
    "id": "claw_bite",
    "name": "Bite (Claws)",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "criticalChance": 30,
      "criticalDamage": 60,
      "criticalMultiplier": 20.0
    },
    "description": "+330% Critical Chance\n+220% Critical Damage",
    "rarity": "uncommon"
  },
  {
    "id": "claw_maul",
    "name": "Maul (Claws)",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "damage": 30.0
    },
    "description": "+330% Melee Damage",
    "rarity": "common"
  },
  {
    "id": "claw_shred",
    "name": "Shred (Claws)",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "punchThrough": 1.2,
      "fireRate": 5.0
    },
    "description": "+30% Fire Rate (x2 for Bows)\\n+1.2 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "claw_swipe",
    "name": "Swipe (Claws)",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "range": 0.5
    },
    "description": "Strikes 4 additional enemies and increases Attack Range by 2m.",
    "rarity": "uncommon"
  },
  {
    "id": "claw_heat",
    "name": "Flame Claws",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "heat": 15
    },
    "description": "+90% Heat Damage",
    "rarity": "uncommon"
  },
  {
    "id": "claw_cold",
    "name": "Frost Claws",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "cold": 15
    },
    "description": "+90% Cold Damage",
    "rarity": "uncommon"
  },


  {
    "id": "claw_fury",
    "name": "Fury (Claws)",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "attackSpeed": 5.0
    },
    "description": "+30% Attack Speed",
    "rarity": "common"
  },
  {
    "id": "claw_magnetic",
    "name": "Magnetic Claws",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "magnetic": 15.0,
      "statusDuration": 10.0
    },
    "description": "+60% Magnetic\\n+40% Status Duration",
    "rarity": "rare"
  },

  {
    "id": "bloodthirst",
    "name": "Bloodthirst",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "healthPerSlashStack": 25
    },
    "description": "Health stolen per stack of Slash Damage on the target (+25 per rank, max 100)",
    "rarity": "rare"
  },
  {
    "id": "cull_the_weak",
    "name": "Cull the Weak",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "damagePerStatus": 10,
      "nonCritDamage": 40,
      "damage": 40.0
    },
    "description": "+10% Melee Damage per Status type on the target, +40% Damage on non-Critical Hits per rank",
    "rarity": "rare"
  },
  {
    "id": "precision_conditioning",
    "name": "Precision Conditioning",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "damage": 35
    },
    "description": "+35% Damage per rank (max +385%). Converts all base Physical Damage to Slash",
    "rarity": "uncommon"
  },
  {
    "id": "radon_claws",
    "name": "Radon Claws",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion_weapon",
    "subCategory": "beast_weapon",
    "stats": {
      "damage": 15,
      "criticalMultiplier": 20,
      "radiation": 15.0
    },
    "description": "+15% Damage and +20% Critical Damage per rank",
    "rarity": "uncommon"
  },

  {
    "id": "augment_excalibur_radiant_finish",
    "name": "Radiant Finish",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "finisherDamageBonus": 50,
      "damage": 75.0,
      "finisherDamage": 75.0
    },
    "description": "Radial Blind Augment: Blinded enemies take 300% more Finisher Damage.",
    "rarity": "rare",
    "warframeId": "excalibur"
  },
  {
    "id": "augment_excalibur_furious_javelin",
    "name": "Furious Javelin",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "meleeDamagePerEnemy": 10,
      "duration": 4.0
    },
    "description": "Radial Javelin Augment: Each enemy hit will increase Excalibur's Melee Damage by 15% for 16s.",
    "rarity": "rare",
    "warframeId": "excalibur"
  },
  {
    "id": "augment_excalibur_chromatic_blade",
    "name": "Chromatic Blade",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "statusChance": 50
    },
    "description": "Exalted Blade Augment: Exalted Blade's Damage Type changes depending on Excalibur's Emissive Color, and Status Chance is increased by 300%.",
    "rarity": "rare",
    "warframeId": "excalibur"
  },
  {
    "id": "augment_excalibur_surging_dash",
    "name": "Surging Dash",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "comboPerHit": 2
    },
    "description": "Slash Dash Augment: Each enemy hit during Slash Dash further increases your Melee Counter by 8.",
    "rarity": "rare",
    "warframeId": "excalibur"
  },
  {
    "id": "augment_mag_fracturing_crush",
    "name": "Fracturing Crush",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorReduction": 25,
      "armor": 12.5,
      "duration": 1.75
    },
    "description": "Crush Augment: Crush gains +50% casting speed. The armor of surviving enemies decreases by 75% and they are unable to move for 7s.",
    "rarity": "rare",
    "warframeId": "mag"
  },
  {
    "id": "augment_mag_counter_pulse",
    "name": "Counter Pulse",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "disarmDuration": 3,
      "duration": 1.0
    },
    "description": "Polarize Augment: Enemy weapons are jammed and robotics are disabled for 4s when hit by Polarize.",
    "rarity": "rare",
    "warframeId": "mag"
  },
  {
    "id": "augment_mag_magnetized_discharge",
    "name": "Magnetized Discharge",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "explosionDamage": 50,
      "range": 11.25
    },
    "description": "Magnetize Augment: Recast on the target to detonate. Enemies hit have a 50% chance to be disarmed.\\nPassive: +45% Magnetize Range.",
    "rarity": "rare",
    "warframeId": "mag"
  },
  {
    "id": "augment_mag_sgreedy_pull",
    "name": "Greedy Pull",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "lootPull": 100
    },
    "description": "Pull Augment: Adds 100% chance to pull pickups towards Mag.",
    "rarity": "rare",
    "warframeId": "mag"
  },
  {
    "id": "augment_volt_shocking_speed",
    "name": "Shocking Speed",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "dischargeDamage": 25,
      "range": 0.75
    },
    "description": "Speed Augment: While moving under the effects of Speed, enemies within 3m will take 300 Electricity Damage with guaranteed Status effect.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "augment_volt_shock_trooper",
    "name": "Shock Trooper",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyShockDamage": 100,
      "damage": 25.0,
      "range": 3.75,
      "duration": 10.0
    },
    "description": "Shock Augment: Hold to cast will grant all allies within 15m an additional 100% Electricity Damage to their attacks for 40s.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "augment_volt_reactive_storm",
    "name": "ReactivStorm",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damageIncrease": 50,
      "statusChance": 62.5
    },
    "description": "Serene Storm Augment: Desert Wind is granted +250% Status Chance and changes its damage type to match enemy weaknesses.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "augment_volt_transistor_shield",
    "name": "Transistor Shield",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "critChancePerShield": 10,
      "damage": 75.0
    },
    "description": "Electric Shield Augment: Allies can pick up Electric Shield. 300% of damage absorbed will be added to Volt's Static Discharge.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "augment_volt_capacitance",
    "name": "Capacitance",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shieldPerTarget": 25,
      "damage": 0.75
    },
    "description": "Discharge Augment: Converts 3% of Damage dealt into Shields split between Volt and Squadmates.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "augment_saryn_revealing_spores",
    "name": "Revealing Spores",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "enemyRadar": 30,
      "range": 10.0
    },
    "description": "Spores Augment: Infected enemies within 40m appear on the minimap. +40 Enemy Radar.",
    "rarity": "rare",
    "warframeId": "saryn"
  },
  {
    "id": "augment_saryn_regenerative_molt",
    "name": "Regenerative Molt",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healthRegen": 50,
      "duration": 2.5
    },
    "description": "Molt Augment: After casting Molt, Saryn regenerates 50 Health/s for 10s.",
    "rarity": "rare",
    "warframeId": "saryn"
  },
  {
    "id": "augment_saryn_contagion_cloud",
    "name": "Contagion Cloud",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "toxinDamagePerSecond": 300,
      "range": 5,
      "duration": 12
    },
    "description": "Toxic Lash Augment: Create 5m toxic clouds, dealing 300 Toxin Damage/s for 12s with every kill. Damage is twice as strong for Melee kills.",
    "rarity": "rare",
    "warframeId": "saryn"
  },

  {
    "id": "augment_saryn_venom_dose",
    "name": "Venom Dose",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyCorrosiveDamage": 100,
      "damage": 25.0,
      "range": 3.75,
      "duration": 10.0
    },
    "description": "Spores Augment: Hold to cast will grant all allies within 15m an additional 100% Corrosive Damage to their attacks for 40s.",
    "rarity": "rare",
    "warframeId": "saryn"
  },
  {
    "id": "augment_rhino_ironclad_charge",
    "name": "Ironclad Charge",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "ironSkinPerHit": 10,
      "duration": 2.5
    },
    "description": "Rhino Charge Augment: Each enemy hit increases Rhino's Armor Rating by 50% for 10s.",
    "rarity": "rare",
    "warframeId": "rhino"
  },
  {
    "id": "augment_rhino_iron_shrapnel",
    "name": "Iron Shrapnel",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "recastExplosion": 100,
      "damage": 25.0
    },
    "description": "Iron Skin Augment: Recasting Iron Skin will cause it to detonate, dealing 100% of its remaining Health as Puncture Damage, and knocking down enemies.",
    "rarity": "rare",
    "warframeId": "rhino"
  },
  {
    "id": "augment_rhino_piercing_roar",
    "name": "Piercing Roar",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorReduction": 25,
      "range": 6.25
    },
    "description": "Roar Augment: Roar gains +40% range. Enemies within 25m are knocked down and suffer 5 stacks of Puncture Status.",
    "rarity": "rare",
    "warframeId": "rhino"
  },
  {
    "id": "augment_rhino_reinforcing_stomp",
    "name": "Reinforcing Stomp",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorPerEnemy": 5
    },
    "description": "Rhino Stomp Augment: Iron Skin Health is replenished by 4% for each enemy affected.",
    "rarity": "rare",
    "warframeId": "rhino"
  },
  {
    "id": "augment_nova_neutron_star",
    "name": "Neutron Star",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "starExplosion": 100,
      "range": 2.0
    },
    "description": "Null Star Augment: Particles deal 240 Heat Damage with guaranteed Status effect in 8m. On recast, remaining particles seek out enemies with doubled search radius.",
    "rarity": "rare",
    "warframeId": "nova"
  },
  {
    "id": "augment_nova_antimatter_absorb",
    "name": "Antimatter Absorb",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "absorbRadius": 2,
      "range": 1.25
    },
    "description": "Antimatter Drop Augment: Absorbs enemy bullets within 5m, increasing the power of the explosion from Nova's particle of antimatter.",
    "rarity": "rare",
    "warframeId": "nova"
  },
  {
    "id": "augment_nova_escape_velocity",
    "name": "Escape Velocity",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "speedOnTeleport": 15,
      "duration": 1.75
    },
    "description": "Worm Hole Augment: Allies that travel through wormhole gain a 50% Speed bonus for 7s.",
    "rarity": "rare",
    "warframeId": "nova"
  },
  {
    "id": "augment_nova_molecular_fission",
    "name": "Molecular Fission",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "slowWithoutSpeed": 15
    },
    "description": "Molecular Prime Augment: Enemies hit by Null Stars are primed. When killed, primed enemies will restore a Null Star charge and have a 100% chance of restoring two.",
    "rarity": "rare",
    "warframeId": "nova"
  },
  {
    "id": "augment_trinity_vampire_leech",
    "name": "Vampire Leech",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "overshieldConversion": 100
    },
    "description": "Energy Vampire Augment: Excess Energy replenishes Shields by 225%.",
    "rarity": "rare",
    "warframeId": "trinity"
  },
  {
    "id": "augment_trinity_abating_link",
    "name": "Abating Link",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorReduction": 15
    },
    "description": "Link Augment: Reduces Armor Rating by 60% on enemies targeted by Link.",
    "rarity": "rare",
    "warframeId": "trinity"
  },

  {
    "id": "augment_trinity_pool_of_life",
    "name": "Pool of Life",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healthOrbChance": 25,
      "energy": 25.0
    },
    "description": "Well of Life Augment: On death, marked enemies will drop 4 Health Orbs with a 100% chance of dropping an Energy Orb.",
    "rarity": "rare",
    "warframeId": "trinity"
  },
  {
    "id": "augment_mesa_ballistic_bullseye",
    "name": "Ballistic Bullseye",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "critChance": 25,
      "criticalChance": 12.5
    },
    "description": "Ballistic Battery Augment: The shot gains a +50% Final Critical Chance bonus, based on the amount charged.",
    "rarity": "rare",
    "warframeId": "mesa"
  },
  {
    "id": "augment_mesa_muzzle_flash",
    "name": "Muzzle Flash",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "blindDuration": 3,
      "range": 3.0,
      "duration": 1.5
    },
    "description": "Shooting Gallery Augment: After 6 kill assists by a player with Shooting Gallery, Mesa's next shot will blind enemies within 12m for 6s.",
    "rarity": "rare",
    "warframeId": "mesa"
  },
  {
    "id": "augment_mesa_staggering_shield",
    "name": "Staggering Shield",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "reflectStagger": 100
    },
    "description": "Shatter Shield Augment: Reflected bullets have a chance to stagger enemies. The base 50% chance increases with power strength.",
    "rarity": "rare",
    "warframeId": "mesa"
  },
  {
    "id": "augment_mesa_mess_waltz",
    "name": "Mesa's Waltz",
    "polarity": "exilus",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "moveSpeed": 50
    },
    "description": "Peacemaker Augment: Mesa can move at 50% Speed while using Peacemaker.",
    "rarity": "rare",
    "warframeId": "mesa"
  },
  {
    "id": "augment_wisp_fused_reservoir",
    "name": "Fused Reservoir",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "combinedMote": 100,
      "energy": 50.0
    },
    "description": "Reservoirs Augment: Adds a fourth reservoir that gives the effects of all three. Costs 200% more Energy.",
    "rarity": "rare",
    "warframeId": "wisp"
  },
  {
    "id": "augment_khora_accumulating_whipclaw",
    "name": "Accumulating Whipclaw",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "comboOnHit": 1,
      "damage": 8.75,
      "duration": 2.5
    },
    "description": "Whipclaw Augment: Hitting 3 enemies will grant a 35% stacking Damage Bonus to subsequent Whipclaws. Bonus will decay after 10s.",
    "rarity": "rare",
    "warframeId": "khora"
  },
  {
    "id": "augment_khora_pilfering_strangledome",
    "name": "Pilfering Strangledome",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "lootChance": 35
    },
    "description": "Strangledome Augment: Enemies held in Strangledome have a 65% chance of dropping additional loot.",
    "rarity": "rare",
    "warframeId": "khora"
  },
  {
    "id": "augment_khora_venari_bodyguard",
    "name": "Venari Bodyguard",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "deathPrevention": 100,
      "duration": 1.0
    },
    "description": "Venari Augment: Venari dies in Khora's place. Recovery timer increased to 150s. Killing enemies decreases the timer by 4s.",
    "rarity": "rare",
    "warframeId": "khora"
  },
  {
    "id": "augment_ash_safeguard_switch",
    "name": "Safeguard Switch",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "invulnerabilityDuration": 2,
      "duration": 1.5
    },
    "description": "Switch Teleport Augment: Switch with an enemy for 3s invulnerability. Switch with an ally to give ally 6s invulnerability. Switch also removes negative status effects on Loki and allies.",
    "rarity": "rare",
    "warframeId": "loki"
  },
  {
    "id": "augment_ash_rising_storm",
    "name": "Rising Storm",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "comboDuration": 4,
      "duration": 2.5
    },
    "description": "Blade Storm Augment: Blade Storm attacks increase your Ability Combo Counter by 4.\\nPassive: +10s Combo Duration",
    "rarity": "rare",
    "warframeId": "ash"
  },
  {
    "id": "augment_ash_seeking_shuriken",
    "name": "Seeking Shuriken",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorReduction": 25,
      "duration": 2.0
    },
    "description": "Shuriken Augment: Hits expose weaknesses on enemies, reducing their Armor by 70% for 8s.",
    "rarity": "rare",
    "warframeId": "ash"
  },
  {
    "id": "augment_ash_smoke_shadow",
    "name": "Smoke Shadow",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyStealth": 100,
      "criticalChance": 37.5,
      "range": 3.75
    },
    "description": "Smoke Screen Augment: Conceals allies within 15m and grants 150% Critical Chance while invisible.",
    "rarity": "rare",
    "warframeId": "ash"
  },
  {
    "id": "augment_ivar_piercing_navigator",
    "name": "Piercing Navigator",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "punchThroughPerHit": 1
    },
    "description": "Navigator Augment: Each hit increases the projectile's Critical Chance by 50% up to a max of 250%.\\n+3 Projectile Punch Through.",
    "rarity": "rare",
    "warframeId": "ivara"
  },
  {
    "id": "augment_ivar_infiltrate",
    "name": "Infiltrate",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "hackSpeed": 25
    },
    "description": "Prowl Augment: Ivara is able to bypass laser barriers and gains 25% Movement Speed.",
    "rarity": "rare",
    "warframeId": "ivara"
  },
  {
    "id": "augment_ivar_concentrated_arrow",
    "name": "Concentrated Arrow",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "headshotExplosion": 100,
      "criticalChance": 6.25,
      "range": 1.75
    },
    "description": "Artemis Bow Augment: Fires a single arrow with +25% Base Critical Chance on full charge, additional +50% Chance and explodes in a 7m radius on Weak Points. Removes Punch Through.",
    "rarity": "rare",
    "warframeId": "ivara"
  },
  {
    "id": "augment_ivar_empowered_quiver",
    "name": "Empowered Quiver",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "critDamage": 100,
      "criticalMultiplier": 25.0
    },
    "description": "Quiver Augment: Dashwire grants allies 100% Critical Damage. Cloak arrow has a 100% chance to prevent Status Effects.",
    "rarity": "rare",
    "warframeId": "ivara"
  },
  {
    "id": "augment_octavia_partition_mallet",
    "name": "Partitioned Mallet",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "maxMallets": 1,
      "range": 5.0
    },
    "description": "Mallet Augment: Create an additional Mallet with 20% reduced range.",
    "rarity": "rare",
    "warframeId": "octavia"
  },
  {
    "id": "augment_octavia_conductor",
    "name": "Conductor",
    "polarity": "exilus",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "spectraFollow": 100
    },
    "description": "Resonator Augment: Reactivate the ability to command Resonator to move to your aim point at 150% Speed.",
    "rarity": "rare",
    "warframeId": "octavia"
  },
  {
    "id": "augment_ember_fireball_frenzy",
    "name": "Fireball Frenzy",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyCast": 100,
      "damage": 25.0,
      "range": 3.75,
      "duration": 10.0
    },
    "description": "Fireball Augment: Hold to cast will grant all allies within 15m an additional 100% Heat Damage to their attacks for 40s.",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "augment_ember_flash_accelerant",
    "name": "Flash Accelerant",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "castSpeedBonus": 25
    },
    "description": "Immolation grants +25% Cast Speed per rank",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "augment_ember_fire_fright",
    "name": "Fire Fright",
    "polarity": "{{pol|zenurik}}",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "panicChance": 25
    },
    "description": "+25% chance to panic enemies per rank",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "augment_ember_healing_flame",
    "name": "Healing Flame",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healthOnImmolation": 25
    },
    "description": "Fire Blast Augment: Each enemy hit heals by 25 to 50 depending on current Immolation level. With Ember, over healing grants you Overguard.",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "augment_ember_exothermic",
    "name": "Exothermic",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "energyOrbChance": 15,
      "energy": 3.75
    },
    "description": "Inferno Augment: Enemies killed while under the effect of Inferno have a 15% chance to drop an energy orb.",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "augment_frost_freeze_force",
    "name": "Freeze Force",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyColdDamage": 50,
      "damage": 25.0,
      "range": 3.75,
      "duration": 10.0
    },
    "description": "Freeze Augment: Hold to cast will grant all allies within 15m an additional 100% Cold Damage to their attacks for 40s.",
    "rarity": "rare",
    "warframeId": "frost"
  },
  {
    "id": "augment_frost_ice_wave_impedance",
    "name": "Ice Wave Impedance",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "slowDuration": 4,
      "duration": 3.0
    },
    "description": "Ice Wave Augment: Create a frozen trail for 12 seconds. Enemies that touch it are inflicted with Cold Status every second.",
    "rarity": "rare",
    "warframeId": "frost"
  },
  {
    "id": "augment_frost_chilling_globe",
    "name": "Chilling Globe",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "freezeChance": 25,
      "duration": 2.5
    },
    "description": "Snow Globe Augment: Enemies that enter have a 50% chance to become frozen solid for 10s.",
    "rarity": "rare",
    "warframeId": "frost"
  },
  {
    "id": "augment_frost_icy_avalanche",
    "name": "Icy Avalanche",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyOverguard": 50,
      "armor": 5.0
    },
    "description": "Avalanche Augment: Allies within Affinity Range are coated in ice that grants 60 Overguard per enemy hit. Overguard increases by 20% of your Armor once per enemy.",
    "rarity": "rare",
    "warframeId": "frost"
  },
  {
    "id": "augment_loki_savior_decoy",
    "name": "Savior Decoy",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "deathPrevention": 100
    },
    "description": "Decoy Augment: If Loki takes fatal damage, Decoy absorbs the damage and swaps locations. Also increases Casting Speed of Decoy by 50%",
    "rarity": "rare",
    "warframeId": "loki"
  },
  {
    "id": "augment_loki_hushed_invisibility",
    "name": "Hushed Invisibility",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "silenceMelee": 100
    },
    "description": "Invisibility Augment: Weapon noise is reduced by 100% while invisible.",
    "rarity": "rare",
    "warframeId": "loki"
  },

  {
    "id": "augment_loki_irradiating_disarm",
    "name": "Irradiating Disarm",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "radiationChance": 75,
      "duration": 2.25
    },
    "description": "Radial Disarm Augment: Enemies will be affected by Radiation Status for 9s",
    "rarity": "rare",
    "warframeId": "loki"
  },
  {
    "id": "augment_nyx_mind_freak",
    "name": "Mind Freak",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "controlledDamage": 100,
      "attackSpeed": 250.0,
      "damage": 250.0
    },
    "description": "Mind Control Augment: Controlled target inflicts +1000% Damage and gains +25% Movement and Attack Speed.",
    "rarity": "rare",
    "warframeId": "nyx"
  },
  {
    "id": "augment_nyx_chaos_sphere",
    "name": "Chaos Sphere",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "sphereDuration": 6,
      "abilityDuration": 12.5
    },
    "description": "Chaos Augment: Enemies entering the Effect Range will be inflicted with Chaos. Effect Range lasts for 50% of the ability duration and shrinks over time.",
    "rarity": "rare",
    "warframeId": "nyx"
  },
  {
    "id": "augment_nyx_assimilate",
    "name": "Assimilate",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "moveSpeed": 50
    },
    "description": "Absorb Augment: Nyx can use weapons during Absorb and its duration is infinite, but it consumes 6.5  Energy/s and its area of effect is halved.",
    "rarity": "rare",
    "warframeId": "nyx"
  },
  {
    "id": "augment_nyx_pacifying_bolts",
    "name": "Pacifying Bolts",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "stunDuration": 3,
      "duration": 2.5
    },
    "description": "Psychic Bolts Augment: Throw an additional 3 force bolts with guaranteed Radiation Status Effect. Enemies struck are confused for 10s.",
    "rarity": "rare",
    "warframeId": "nyx"
  },
  {
    "id": "augment_banshee_sonic_fracture",
    "name": "Sonic Fracture",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorReduction": 15
    },
    "description": "Sonic Boom Augment: Enemy Armor is reduced by 70%.",
    "rarity": "rare",
    "warframeId": "banshee"
  },
  {
    "id": "augment_banshee_resonance",
    "name": "Resonance",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "markDuration": 5
    },
    "description": "Sonar Augment: Killing an enemy by shooting their weak spot will trigger another Sonar for 100% of remaining duration.",
    "rarity": "rare",
    "warframeId": "banshee"
  },
  {
    "id": "augment_banshee_silence_savage",
    "name": "Savage Silence",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "finisherDamage": 25
    },
    "description": "Silence Augment: Silence staggers enemies and Finisher damage is increased by 300%",
    "rarity": "rare",
    "warframeId": "banshee"
  },
  {
    "id": "augment_banshee_resonating_quake",
    "name": "Resonating Quake",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "quakeDamage": 75
    },
    "description": "Sound Quake Augment: Forgoes channeling to create a shockwave that deals 20x Damage at the epicenter, gradually weakening as it expands out.",
    "rarity": "rare",
    "warframeId": "banshee"
  },
  {
    "id": "augment_vauban_tesla_link",
    "name": "Tesla Link",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "linkDamageReduction": 15
    },
    "description": "Tesla chains grant +15% Damage Reduction per rank",
    "rarity": "rare",
    "warframeId": "vauban"
  },
  {
    "id": "augment_vauban_photon_repeater",
    "name": "Photon Repeater",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "extraCast": 2
    },
    "description": "Photon Strike Augment: If Photon Strike hits at least 5 enemies, the next cast will cost no Energy and fire two additional strikes.",
    "rarity": "rare",
    "warframeId": "vauban"
  },
  {
    "id": "augment_vauban_repelling_bastille",
    "name": "Repelling Bastille",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "repelChance": 25
    },
    "description": "+25% chance to repel enemies per rank",
    "rarity": "rare",
    "warframeId": "vauban"
  },
  {
    "id": "augment_nekros_creeping_terrify",
    "name": "Creeping Terrify",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "slowAfterFlee": 20
    },
    "description": "Terrify Augment: Affected enemies have 60% reduced Movement Speed.",
    "rarity": "rare",
    "warframeId": "nekros"
  },
  {
    "id": "augment_nekros_despoil",
    "name": "Despoil",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healthCost": 10
    },
    "description": "Desecrate Augment: No longer consumes Energy, but consumes 10 Health per corpse instead.",
    "rarity": "rare",
    "warframeId": "nekros"
  },
  {
    "id": "augment_nekros_soul_survivor",
    "name": "Soul Survivor",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyRevive": 15,
      "health": 7.5
    },
    "description": "Soul Punch Augment: Use on a downed ally to revive them with 30% Health.",
    "rarity": "rare",
    "warframeId": "nekros"
  },
  {
    "id": "augment_nekros_shield_of_shadows",
    "name": "Shield of Shadows",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damageReductionPerShadow": 6,
      "damage": 1.5,
      "range": 12.5
    },
    "description": "Shadows of the Dead Augment: Each Shadow within 50m take 6% of the Damage done to Nekros in his stead.",
    "rarity": "rare",
    "warframeId": "nekros"
  },

  {
    "id": "augment_hydroid_tidal_impunity",
    "name": "Tidal Impunity",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "statusCure": 100,
      "duration": 3.0
    },
    "description": "Tidal Surge Augment: Clears Status Effects and grants 12s of Status Immunity for yourself and allies that come in contact with it. Reduces Tidal Surge's Energy cost to 15.",
    "rarity": "rare",
    "warframeId": "hydroid"
  },
  {
    "id": "augment_hydroid_curative_undertow",
    "name": "Curative Undertow",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healOnDrown": 25,
      "health": 7.5,
      "duration": 0.375
    },
    "description": "Undertow Augment: Allies can stand in the pool to regain 30% Health every 1.5s. Hydroid will restore 10% Health.",
    "rarity": "rare",
    "warframeId": "hydroid"
  },
  {
    "id": "augment_hydroid_pilfering_swarm",
    "name": "Pilfering Swarm",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "lootChance": 35
    },
    "description": "Tentacle Swarm Augment: Enemies held by tentacles have a 100% chance at additional drops.",
    "rarity": "rare",
    "warframeId": "hydroid"
  },
  {
    "id": "augment_mirage_explosive_legerdemain",
    "name": "Explosive Legerdemain",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "explosionDamage": 100,
      "statusChance": 25.0
    },
    "description": "Sleight of Hand Augment: Ammo and Orbs pickups are turned into proximity mines that deal 1000 Damage with a 100% Status Chance.",
    "rarity": "rare",
    "warframeId": "mirage"
  },
  {
    "id": "augment_mirage_total_eclipse",
    "name": "Total Eclipse",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyShare": 50,
      "range": 3.75
    },
    "description": "Eclipse Augment: While active, allies within 15m benefit from Eclipse.",
    "rarity": "rare",
    "warframeId": "mirage"
  },
  {
    "id": "augment_mirage_hall_of_malevolence",
    "name": "Hall of Malevolence",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damagePerKill": 5
    },
    "description": "Hall of Mirrors Augment: The damage of your doppelgangers is increased by 5% every time you kill an enemy.",
    "rarity": "rare",
    "warframeId": "mirage"
  },
  {
    "id": "augment_chroma_afterburn",
    "name": "Afterburn",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damagePerSecondActive": 25,
      "totalDamageCap": 200,
      "explosionDamage": 25.0
    },
    "description": "Spectral Scream Augment: Upon deactivation, Chroma will launch an elemental projectile dealing 100 Damage for each second the ability was active, to a maximum of 500 Damage.",
    "rarity": "rare",
    "warframeId": "chroma"
  },
  {
    "id": "augment_chroma_everlasting_ward",
    "name": "Everlasting Ward",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyDuration": 100
    },
    "description": "Elemental Ward Augment: Allies that leave the radius will retain the effect for 100% of the remaining duration.",
    "rarity": "rare",
    "warframeId": "chroma"
  },
  {
    "id": "augment_chroma_vexing_retaliation",
    "name": "Vexing Retaliation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "retaliationChance": 25,
      "range": 2.25
    },
    "description": "Vex Armor Augment: Taking 150 Damage will trigger a 9m burst. Shield damage will cause a Puncture Status effect while Health damage will cause a Blast Status effect.",
    "rarity": "rare",
    "warframeId": "chroma"
  },
  {
    "id": "augment_chroma_guided_effigy",
    "name": "Guided Effigy",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "moveEffigy": 100
    },
    "description": "Effigy Augment: Cast and hold to make Effigy move to your aim point. Deals 4000 Damage/s and restores 5 Energy for each enemy in its path. Roars on arrival, stunning nearby enemies.",
    "rarity": "rare",
    "warframeId": "chroma"
  },
  {
    "id": "augment_limbo_rift_haven",
    "name": "Rift Haven",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healInRift": 15,
      "health": 6.25
    },
    "description": "Banish Augment: Allies banished to the rift will have 25% of their Maximum Health restored every second.",
    "rarity": "rare",
    "warframeId": "limbo"
  },
  {
    "id": "augment_limbo_rift_torrent",
    "name": "Rift Torrent",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damagePerEnemy": 10,
      "damage": 7.5
    },
    "description": "Rift Surge Augment: Limbo deals 30% Extra Damage for each enemy affected by Rift Surge while in the rift.",
    "rarity": "rare",
    "warframeId": "limbo"
  },
  {
    "id": "augment_limbo_cataclysmic_continuum",
    "name": "Cataclysmic Continuum",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "durationPerKill": 1,
      "duration": 0.25
    },
    "description": "Cataclysm Augment: Duration increased by 1s for each enemy killed.",
    "rarity": "rare",
    "warframeId": "limbo"
  },
  {
    "id": "augment_equinox_duality",
    "name": "Duality",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "specterDuration": 5,
      "damage": 75.0,
      "duration": 2.5
    },
    "description": "Metamorphosis Augment: Equinox's other half breaks free for 10s, dealing 300% Damage.",
    "rarity": "rare",
    "warframeId": "equinox"
  },
  {
    "id": "augment_equinox_calm_frenzy",
    "name": "Calm & Frenzy",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "castSpeed": 25,
      "range": 1.25
    },
    "description": "Rest & Rage Augment: Killing an affected enemy causes the effect to spread to enemies within 5m for 100% of the remaining duration.",
    "rarity": "rare",
    "warframeId": "equinox"
  },
  {
    "id": "augment_equinox_energy_transfer",
    "name": "Energy Transfer",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "energyOnBurst": 50
    },
    "description": "Mend & Maim Augment: 100% of charge is conserved when switching between forms.",
    "rarity": "rare",
    "warframeId": "equinox"
  },
  {
    "id": "augment_atlas_tectonic_fracture",
    "name": "Tectonic Fracture",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "extraWalls": 1,
      "health": 25.0
    },
    "description": "Tectonics Augment: Create up to 3 walls with 100% Health. Walls can no longer be turned into boulders.",
    "rarity": "rare",
    "warframeId": "atlas"
  },
  {
    "id": "augment_atlas_ore_gaze",
    "name": "Ore Gaze",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "oreChance": 25
    },
    "description": "Petrify Augment: Petrified enemies are scanned into the Codex and have a 25% chance to drop additional loot when killed.",
    "rarity": "rare",
    "warframeId": "atlas"
  },
  {
    "id": "augment_atlas_rumbled",
    "name": "Rumbled",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "rumbleDuration": 5,
      "damage": 75.0
    },
    "description": "Rumblers Augment: Atlas becomes a Rumbler with Rock Armor that grants Overguard and absorbs up to 300% of damage to Max Health.",
    "rarity": "rare",
    "warframeId": "atlas"
  },
  {
    "id": "augment_atlas_path_of_statues",
    "name": "Path of Statues",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "petrifyTrail": 100,
      "duration": 1.5
    },
    "description": "Landslide Augment: Leave a trail for 12s that petrifies enemies for 6s.",
    "rarity": "rare",
    "warframeId": "atlas"
  },
  {
    "id": "augment_wukong_celestial_stomp",
    "name": "Celestial Stomp",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "stompRange": 5,
      "range": 5.0
    },
    "description": "Celestial Twin Augment: Hold to command the twin to perform a slam attack suspending enemies in the air within 20m for 25 Energy.",
    "rarity": "rare",
    "warframeId": "wukong"
  },
  {
    "id": "augment_wukong_enveloping_cloud",
    "name": "Enveloping Cloud",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyInvisibility": 100,
      "range": 1.0,
      "duration": 3.5
    },
    "description": "Cloud Walker Augment: Allies within 4m of the cloud become invisible to enemies for 14s.",
    "rarity": "rare",
    "warframeId": "wukong"
  },
  {
    "id": "augment_wukong_primal_rage",
    "name": "Primal Rage",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "critBonusPerKill": 3.75,
      "critDecayPerSecond": 0.25
    },
    "description": "Primal Fury Augment: Killing an enemy increases Critical Chance by 15%. The increase decays by 1%/s",
    "rarity": "rare",
    "warframeId": "wukong"
  },
  {
    "id": "augment_titania_spellbound_harvest",
    "name": "Spellbound Harvest",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "tributeEfficiency": 25,
      "abilityRange": 10.0
    },
    "description": "Spellbind Augment: Hitting at least 4 enemies with Spellbind grants Titania 50. The next cast has +40% Ability Range.",
    "rarity": "rare",
    "warframeId": "titania"
  },
  {
    "id": "augment_titania_razorwing_blitz",
    "name": "Razorwing Blitz",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "speedPerCast": 10,
      "fireRate": 6.25,
      "duration": 2.0,
      "flightSpeed": 6.25
    },
    "description": "Razorwing Augment: Flight Speed increased by 25% and Fire Rate increased by 25% for 8s when using abilities. Stacks up to 4x.",
    "rarity": "rare",
    "warframeId": "titania"
  },
  {
    "id": "augment_titania_beguiling_lantern",
    "name": "Beguiling Lantern",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "attractionRange": 5,
      "damage": 25.0,
      "weaponDamageBonus": 25.0
    },
    "description": "Lantern Augment: Attracted enemies take 100% more Weapon Damage.",
    "rarity": "rare",
    "warframeId": "titania"
  },
  {
    "id": "augment_nezha_pyroclastic_flow",
    "name": "Pyroclastic Flow",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "fireballExplosion": 100,
      "damage": 62.5,
      "duration": 2.5
    },
    "description": "Fire Walker Augment: Accumulate 250% of the damage Fire Walker deals, unleashing it in a trail of fire that lasts 10s.",
    "rarity": "rare",
    "warframeId": "nezha"
  },
  {
    "id": "augment_nezha_reaping_chakram",
    "name": "Reaping Chakram",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healthOrbChance": 25
    },
    "description": "Blazing Chakram Augment: Each enemy hit increases the ring's Damage by 2x and the chance for enemies to drop Health Orbs on death by +0.25x.",
    "rarity": "rare",
    "warframeId": "nezha"
  },
  {
    "id": "augment_nezha_safeguard",
    "name": "Safeguard",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyWard": 100
    },
    "description": "Warding Halo Augment: Can now be cast on allies with 50% effectiveness.",
    "rarity": "rare",
    "warframeId": "nezha"
  },

  {
    "id": "augment_inaros_elemental_sandstorm",
    "name": "Elemental Sandstorm",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "elementalChance": 25,
      "damage": 12.5
    },
    "description": "Sandstorm Augment: Sandstorm gains 50% Ability Range and has a 100% chance of inflicting Status Effects based on the Damage Types on the equipped Melee Weapon.",
    "rarity": "rare",
    "warframeId": "inaros"
  },
  {
    "id": "augment_inaros_negation_swarm",
    "name": "Negation Swarm",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "statusProtection": 100,
      "armor": 0.75
    },
    "description": "Scarab Swarm Augment: Scarab Armor protects Inaros from Status Effects, consuming 3% Bonus Armor for each effect resisted.",
    "rarity": "rare",
    "warframeId": "inaros"
  },
  {
    "id": "augment_inaros_desiccation_curse",
    "name": "Desiccation's Curse",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "sandShadowChance": 25
    },
    "description": "Desiccation Augment: Killing a blinded enemy with a Finisher has a 100% chance to summon a Swarm Kavat that will spread Scarab Swarm. Maximum Swarm Kavats +2.",
    "rarity": "rare",
    "warframeId": "inaros"
  },
  {
    "id": "augment_gara_mending_splinters",
    "name": "Mending Splinters",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "healthRegen": 5
    },
    "description": "Splinter Storm Augment: For each target affected, Splinter Storm heals 15 Health/s.",
    "rarity": "rare",
    "warframeId": "gara"
  },
  {
    "id": "augment_gara_spectrosiphon",
    "name": "Spectrosiphon",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "energyOnKill": 2,
      "energy": 12.5
    },
    "description": "Spectrorage Augment: Enemies that die within Spectrorage have a 50% chance to drop an Energy Orb.",
    "rarity": "rare",
    "warframeId": "gara"
  },
  {
    "id": "augment_baruuk_endless_lull",
    "name": "Endless Lull",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "lullDuration": 3
    },
    "description": "+3s Lull duration per rank",
    "rarity": "rare",
    "warframeId": "baruuk"
  },
  {
    "id": "augment_baruuk_elusive_retribution",
    "name": "Elusive Retribution",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "evasionToDamage": 10,
      "duration": 1.5
    },
    "description": "Elude Augment: Every attack Baruuk Eludes increases his Melee Attack Speed and Melee Critical Damage by 5% up to 6 stacks. Stacks last 6s.",
    "rarity": "rare",
    "warframeId": "baruuk"
  },
  {
    "id": "augment_baruuk_reactive_storm",
    "name": "Reactive Storm",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "statusChance": 62.5
    },
    "description": "Serene Storm Augment: Desert Wind is granted +250% Status Chance and changes its damage type to match enemy weaknesses.",
    "rarity": "rare",
    "warframeId": "baruuk"
  },
  {
    "id": "augment_hildryn_balefire_surge",
    "name": "Balefire Surge",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "explosionOnHit": 50
    },
    "description": "Balefire Augment: Fully charged direct hits restore 250 Shield to Hildryn. Impact with Nullifier Shields will destroy them and restore 750 Shield.",
    "rarity": "rare",
    "warframeId": "hildryn"
  },
  {
    "id": "augment_hildryn_pillage_aug",
    "name": "Blazing Pillage",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "heatDamage": 200
    },
    "description": "Pillage Augment: Enemies affected by Haven will be set ablaze for 200 Heat Damage and restore 50 additional Shields to Hildryn.",
    "rarity": "rare",
    "warframeId": "hildryn"
  },


  {
    "id": "augment_garuda_blood_forge",
    "name": "Blood Forge",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "reloadSpeed": 50
    },
    "description": "Bloodletting Augment: Garuda's equipped weapon is reloaded up to 100%.",
    "rarity": "rare",
    "warframeId": "garuda"
  },

  {
    "id": "augment_garuda_dread_ward",
    "name": "Dread Ward",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "invulnerability": 2,
      "duration": 2.0
    },
    "description": "Dread Mirror Augment: Become unkillable for 8s when Dread Mirror kills a target by ripping its life force.",
    "rarity": "rare",
    "warframeId": "garuda"
  },
  {
    "id": "augment_garuda_blending_talons",
    "name": "Blending Talons",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "comboPerHit": 1,
      "slash": 25.0,
      "range": 2.25,
      "comboCountChance": 25.0
    },
    "description": "Seeking Talons Augment: Tap to perform a 9m AoE around Garuda. Garuda's Talons gain 100% additional Combo Count Chance when hitting targets affected by Slash Status.",
    "rarity": "rare",
    "warframeId": "garuda"
  },
  {
    "id": "augment_gauss_mach_crash",
    "name": "Mach Crash",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shockwaveOnStop": 100,
      "range": 2.0
    },
    "description": "Mach Rush Augment: Impact shockwave leaves behind a vacuum that sucks in enemies within 8m.",
    "rarity": "rare",
    "warframeId": "gauss"
  },
  {
    "id": "augment_gauss_thermal_transfer",
    "name": "Thermal Transfer",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "coldToAlly": 50,
      "damage": 18.75,
      "duration": 7.5
    },
    "description": "Thermal Sunder Augment: Allies in range gain 75% bonus Elemental Damage for 30s.",
    "rarity": "rare",
    "warframeId": "gauss"
  },
  {
    "id": "augment_grendel_hearty_nourishment",
    "name": "Hearty Nourishment",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "immunityDuration": 3,
      "duration": 1.25
    },
    "description": "Nourish Augment: Clear Status Effects and gain 5s of Status Immunity for each victim in Grendel's stomach.",
    "rarity": "rare",
    "warframeId": "grendel"
  },
  {
    "id": "augment_grendel_catapult",
    "name": "Catapult",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "launchSpeed": 100
    },
    "description": "Pulverize Augment:  to launch Grendel in your aim direction. Costs 5. Crouch to slow down.",
    "rarity": "rare",
    "warframeId": "grendel"
  },
  {
    "id": "augment_grendel_gourmand",
    "name": "Gourmand",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorPerHit": 10
    },
    "description": "Feast Augment: Instead of Energy, consumes 200 Health on cast. Glutton grants an additional 150 Armor per enemy.",
    "rarity": "rare",
    "warframeId": "grendel"
  },

  {
    "id": "augment_yareli_merulina_guardian",
    "name": "Merulina Guardian",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damageAbsorption": 25,
      "fireRate": 5.0,
      "duration": 5.0
    },
    "description": "Merulina Augment: Enemies eliminated during Sea Snares heal 20% of Merulina's health. Upon healing, gain +200% Reload Speed and Fire Rate on Secondary weapons for 20s.",
    "rarity": "rare",
    "warframeId": "yareli"
  },
  {
    "id": "augment_yareli_surging_blades",
    "name": "Surging Blades",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "bladeDamage": 10,
      "damage": 2.5
    },
    "description": "Aquablades Augment: Activate Aquablades when the ability is in use or cooldown to throw one blade. Blades gain 10% damage when any Aquablade hits an enemy. No cost to throw with Merulina.",
    "rarity": "rare",
    "warframeId": "yareli"
  },




  {
    "id": "augment_wisp_critical_surge",
    "name": "Critical Surge",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "breachCritChance": 25,
      "criticalChance": 2.5,
      "duration": 2.25
    },
    "description": "Breach Surge Augment: Teleporting to a Reservoir costs 50% Energy and grants 10% Critical Chance to Primary Weapons per meter traveled for 9s. Maximum 250% Critical Chance.",
    "rarity": "rare",
    "warframeId": "wisp"
  },


  {
    "id": "augment_universal_health_conversion",
    "name": "Health Conversion",
    "polarity": "unairu",
    "drain": 10,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorOnOrb": 15,
      "duration": 0.5
    },
    "description": "Health Orbs grant 450 Armor, stacking up to 3x. Taking damage will consume a stack after 3s.",
    "rarity": "rare",
    "warframeId": "garuda"
  },
  {
    "id": "augment_universal_energy_conversion",
    "name": "Energy Conversion",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "strengthOnOrb": 9,
      "abilityStrength": 8.333333
    },
    "description": "Energy Orbs grant 50% more Ability Strength to your next cast.",
    "rarity": "rare",
    "warframeId": "citrine"
  },
  {
    "id": "augment_universal_shattering_impact",
    "name": "Shattering Impact",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armorReduction": 5
    },
    "description": "Impact Damage reduces enemy Armor by 6.",
    "rarity": "common",
    "warframeId": "valkyr"
  },
  {
    "id": "augur_message",
    "name": "Augur Message",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 4
    },
    "description": "+6% Ability Duration per rank",
    "rarity": "common"
  },
  {
    "id": "augur_seeker",
    "name": "Augur Seeker",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "statusDuration": 15.0
    },
    "description": "+15% Status Duration per rank (Secondary)",
    "rarity": "rare"
  },
  {
    "id": "augur_reach",
    "name": "Augur Reach",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityRange": 5
    },
    "description": "+6% Ability Range per rank",
    "rarity": "uncommon"
  },
  {
    "id": "augur_accord",
    "name": "Augur Accord",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": 11.6667
    },
    "description": "+70% Shield Capacity at max",
    "rarity": "uncommon"
  },
  {
    "id": "augur_secrets",
    "name": "Augur Secrets",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 4
    },
    "description": "+6% Ability Strength per rank",
    "rarity": "rare"
  },
  {
    "id": "augur_breach",
    "name": "Augur Pact",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "pistol",
    "subCategory": "",
    "stats": {
      "damage": 15
    },
    "description": "+15% Damage per rank",
    "rarity": "common"
  },
  {
    "id": "gladiator_might",
    "name": "Gladiator Might",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10
    },
    "description": "+60% Critical Damage at max rank (Set)",
    "rarity": "uncommon"
  },
  {
    "id": "hunter_adrenaline",
    "name": "Hunter Adrenaline",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energyOnHealthDamage": 7.5,
      "damage": 7.5
    },
    "description": "Convert +45% of Damage on Health to Energy. Without Shields, ally Overguard imitates Health.",
    "rarity": "common"
  },
  {
    "id": "hunter_munitions",
    "name": "Hunter Munitions",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "subCategory": "",
    "stats": {
      "slashOnCrit": 5
    },
    "description": "+30% chance for Slash proc on Critical Hits",
    "rarity": "uncommon"
  },
  {
    "id": "hunter_track",
    "name": "Hunter Track",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "radarOnBleed": 10,
      "statusDuration": 15.0
    },
    "description": "+10m Enemy Radar vs bleeding per rank",
    "rarity": "rare"
  },
  {
    "id": "hunter_recovery",
    "name": "Hunter Recovery",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "lifestealToOwner": 7.5,
      "damage": 5.0
    },
    "description": "Warframe healed for +30% Companion Damage dealt",
    "rarity": "common"
  },
  {
    "id": "hunter_command",
    "name": "Hunter Command",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "commandOnStatus": 100,
      "duration": 1.0
    },
    "description": "Applying a Slash Status to an enemy causes the Companion to attack them for 6s.",
    "rarity": "rare"
  },
  {
    "id": "hunter_synergy",
    "name": "Hunter Synergy",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "critLink": 7.5,
      "criticalChance": 5.0
    },
    "description": "+30% Primary Weapon Critical Chance added to Companion",
    "rarity": "uncommon"
  },
  {
    "id": "mecha_empowered",
    "name": "Mecha Empowered",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armorOnMarkKill": 30,
      "damage": 25.0
    },
    "description": "Increased Pistol Ammo recovery.\\nSquad deals +150% extra Damage against a Marked Enemy",
    "rarity": "rare"
  },
  {
    "id": "mecha_recharge",
    "name": "Mecha Recharge",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "shieldRechargeLink": 15,
      "shield": 15.0
    },
    "description": "+15% Shield Recharge when Kubrow attacks per rank",
    "rarity": "rare"
  },

  {
    "id": "melee_prowess_sentinel",
    "name": "Assault Mode",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "attackRange": 3,
      "range": 5.0
    },
    "description": "Sentinel will attack the first visible enemy within 30m.",
    "rarity": "common"
  },
  {
    "id": "energy_generator",
    "name": "Energy Generator",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "energyOnAssist": 5
    },
    "description": "Dethcube drops an Energy Orb after assisting in 10 kills.",
    "rarity": "rare"
  },


  {
    "id": "link_armor",
    "name": "Link Armor",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "linkArmor": 10
    },
    "description": "+10% Link Armor per rank",
    "rarity": "uncommon"
  },
  {
    "id": "link_shields",
    "name": "Link Shields",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "linkShields": 10
    },
    "description": "+10% Link Shields per rank",
    "rarity": "uncommon"
  },


  {
    "id": "scan_organic",
    "name": "Scan Organic Lifeforms",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "scanChance": 10
    },
    "description": "+10% Scan Chance per rank",
    "rarity": "uncommon"
  },
  {
    "id": "hard_engag",
    "name": "Hard Engage",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "spinDamage": 20,
      "range": 1.666667
    },
    "description": "Engages enemies within 10m with melee attacks, dealing 90 Impact Damage. Melee attacks are enhanced by Mods equipped in the Moa's weapon.",
    "rarity": "rare"
  },
  {
    "id": "security_override",
    "name": "Security Override",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "hackSpeed": 15,
      "duration": 2.333333,
      "range": 5.0
    },
    "description": "Auto-hacks consoles over 2s. 30% chance to mind control basic robotic enemies and turrets in 30m for 14s after Hacking.",
    "rarity": "common"
  },
  {
    "id": "stasis_field",
    "name": "Stasis Field",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "fieldDuration": 3,
      "damage": 15.0,
      "duration": 5.0
    },
    "description": "Creates a stasis field for 30s. While inside the field, all enemy projectiles move 90% slower and deal 60% less Damage.",
    "rarity": "common"
  },
  {
    "id": "set_bonus_augur",
    "name": "Augur Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 6,
    "category": "set",
    "subCategory": "",
    "stats": {
      "energyToShields": 40
    },
    "description": "6-piece: Spent Energy becomes Shields (40%)",
    "rarity": "legendary"
  },
  {
    "id": "set_bonus_gladiator",
    "name": "Gladiator Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 6,
    "category": "set",
    "subCategory": "",
    "stats": {
      "critPerCombo": 15
    },
    "description": "6-piece: +15% Crit Chance per Combo Multiplier",
    "rarity": "legendary"
  },
  {
    "id": "set_bonus_hunter",
    "name": "Hunter Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 6,
    "category": "set",
    "subCategory": "",
    "stats": {
      "companionDamageToStatus": 150
    },
    "description": "6-piece: Companion deals +150% damage to status enemies",
    "rarity": "legendary"
  },
  {
    "id": "set_bonus_mecha",
    "name": "Mecha Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 4,
    "category": "set",
    "subCategory": "",
    "stats": {
      "markExplosion": 150
    },
    "description": "4-piece: Marked enemies explode for 150% damage",
    "rarity": "legendary"
  },
  {
    "id": "set_bonus_synth",
    "name": "Synth Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 4,
    "category": "set",
    "subCategory": "",
    "stats": {
      "pistolReloadSpeed": 15
    },
    "description": "4-piece: +15% Pistol Reload Speed, Companion reloads 5%/s",
    "rarity": "legendary"
  },
  {
    "id": "set_bonus_tek",
    "name": "Tek Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 4,
    "category": "set",
    "subCategory": "",
    "stats": {
      "markDuration": 10
    },
    "description": "4-piece: Kavat marks for 10s, +60% damage to marked",
    "rarity": "legendary"
  },
  {
    "id": "set_bonus_vigilante",
    "name": "Vigilante Set Bonus",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 6,
    "category": "set",
    "subCategory": "",
    "stats": {
      "critEnhanceChance": 30
    },
    "description": "6-piece: 30% chance to enhance primary crit hits",
    "rarity": "legendary"
  },
  {
    "id": "stance_iron_phoenix",
    "name": "Iron Phoenix",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Fast cutting attacks with puncture finish.",
    "rarity": "rare"
  },
  {
    "id": "stance_crimson_dervish",
    "name": "Crimson Dervish",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Sword stance: High damage, slow",
    "rarity": "rare"
  },
  {
    "id": "stance_vengeful_revenant",
    "name": "Vengeful Revenant",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Sword stance: High damage, sweeping",
    "rarity": "rare"
  },
  {
    "id": "stance_swooping_falcon",
    "name": "Swooping Falcon",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Quick slashes with spinning lunges.",
    "rarity": "rare"
  },
  {
    "id": "stance_crossing_snakes",
    "name": "Crossing Snakes",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Multi-angle strikes and deadly thrust attacks.",
    "rarity": "rare"
  },
  {
    "id": "stance_swirling_tiger",
    "name": "Swirling Tiger",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Dual sword stance: Fluid combos",
    "rarity": "uncommon"
  },
  {
    "id": "stance_carving_mantis",
    "name": "Carving Mantis",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Strong slashes and quick stabs that keeps momentum forward.",
    "rarity": "rare"
  },
  {
    "id": "stance_cleaving_whirlwind",
    "name": "Cleaving Whirlwind",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Heavy blade stance: Spinning attacks",
    "rarity": "rare"
  },
  {
    "id": "stance_temporal_royale",
    "name": "Tempo Royale",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Sweeping strikes and twisting slashes.",
    "rarity": "rare"
  },
  {
    "id": "stance_shimmering_blight",
    "name": "Shimmering Blight",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Fast spinning attacks and staggering strikes.",
    "rarity": "uncommon"
  },
  {
    "id": "stance_bleeding_willow",
    "name": "Bleeding Willow",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "A blend of strong and rapid strikes with leaping combos.",
    "rarity": "rare"
  },
  {
    "id": "stance_twirling_spire",
    "name": "Twirling Spire",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "A mix of sweeping attacks with precise strikes.",
    "rarity": "rare"
  },
  {
    "id": "stance_burning_wasp",
    "name": "Burning Wasp",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Whip stance: Fast strikes",
    "rarity": "uncommon"
  },
  {
    "id": "stance_coiling_viper",
    "name": "Coiling Viper",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Powerful arcing strikes with energetic flips.",
    "rarity": "rare"
  },
  {
    "id": "stance_seismic_palm",
    "name": "Seismic Palm",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Methodical strikes with reaching combos.",
    "rarity": "rare"
  },
  {
    "id": "stance_vermillion_storm",
    "name": "Vermillion Storm",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Kicks woven between spinning slashes.",
    "rarity": "rare"
  },
  {
    "id": "stance_decisive_judgement",
    "name": "Decisive Judgement",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Fierce, double-handed strikes.",
    "rarity": "rare"
  },
  {
    "id": "stance_vulpine_mask",
    "name": "Vulpine Mask",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Rapier stance: Cunning strikes",
    "rarity": "rare"
  },
  {
    "id": "stance_high_noon",
    "name": "High Noon",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Bullets spray between wicked slash attacks.",
    "rarity": "rare"
  },
  {
    "id": "stance_bullet_dance",
    "name": "Bullet Dance",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Sharpened blades dance with gunfire.",
    "rarity": "rare"
  },
  {
    "id": "stance_aurora_rush",
    "name": "Astral Twilight",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Orbiting slashes and lashing strikes.",
    "rarity": "rare"
  },
  {
    "id": "stance_gleaming_talent",
    "name": "Gleaming Blight",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10,
      "statusChance": 25.0,
      "syndicatePower": 1.0
    },
    "description": "+100% Status Chance\\n+1 'Blight'",
    "rarity": "rare"
  },
  {
    "id": "stance_pointed_wind",
    "name": "Pointed Wind",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Dagger stance: Precision strikes",
    "rarity": "rare"
  },
  {
    "id": "stance_stinging_thorn",
    "name": "Stinging Thorn",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Vigorous slashes with forceful stabs.",
    "rarity": "rare"
  },
  {
    "id": "stance_homing_fang",
    "name": "Homing Fang",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Dagger stance: Seeking strikes",
    "rarity": "uncommon"
  },
  {
    "id": "stance_sundering_weave",
    "name": "Sundering Weave",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Steady chopping strikes with focused damage.",
    "rarity": "uncommon"
  },
  {
    "id": "stance_reaping_spiral",
    "name": "Reaping Spiral",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Far flung attacks and multi-hit combos.",
    "rarity": "rare"
  },
  {
    "id": "stance_stalking_fan",
    "name": "Stalking Fan",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Lunging spirals and shattering combos.",
    "rarity": "rare"
  },
  {
    "id": "stance_clashing_forest",
    "name": "Clashing Forest",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Arcing strikes and focused combos.",
    "rarity": "uncommon"
  },
  {
    "id": "stance_flailing_branch",
    "name": "Flailing Branch",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Lifting strikes and whirlwind combos.",
    "rarity": "rare"
  },
  {
    "id": "stance_gnashing_payara",
    "name": "Gnashing Payara",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Lunging punctures with impaling spirals.",
    "rarity": "rare"
  },
  {
    "id": "stance_sinking_talon",
    "name": "Sinking Talon",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 10
    },
    "description": "Strong, focused attacks with multi-hit spins.",
    "rarity": "uncommon"
  },
  {
    "id": "stance_grim_fury_sparring",
    "name": "Grim Fury",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Lightning fast hit chains and hard-hitting combos.",
    "rarity": "uncommon"
  },
  {
    "id": "stance_wise_razor",
    "name": "Wise Razor",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Deftly executed sweeps and slashes.",
    "rarity": "uncommon"
  },
  {
    "id": "stance_spinning_needle",
    "name": "Spinning Needle",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 15
    },
    "description": "Dual dagger stance: Spinning strikes",
    "rarity": "rare"
  },
  {
    "id": "stance_defiled_snapdragon",
    "name": "Defiled Snapdragon",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damageBonus": 20
    },
    "description": "Blade whip stance: Snake-like strikes",
    "rarity": "rare"
  },
  {
    "id": "evolution_incarnon_rifle",
    "name": "Incarnon Rifle Evolution",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 3,
    "category": "evolution",
    "subCategory": "",
    "stats": {
      "evolutionBonus": 25
    },
    "description": "Incarnon weapon evolution bonuses",
    "rarity": "legendary"
  },
  {
    "id": "evolution_incarnon_pistol",
    "name": "Incarnon Pistol Evolution",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 3,
    "category": "evolution",
    "subCategory": "",
    "stats": {
      "evolutionBonus": 25
    },
    "description": "Incarnon weapon evolution bonuses",
    "rarity": "legendary"
  },
  {
    "id": "evolution_incarnon_melee",
    "name": "Incarnon Melee Evolution",
    "polarity": "zenurik",
    "drain": 0,
    "maxRank": 3,
    "category": "evolution",
    "subCategory": "",
    "stats": {
      "evolutionBonus": 25
    },
    "description": "Incarnon weapon evolution bonuses",
    "rarity": "legendary"
  },
  {
    "id": "adhesive_blast",
    "name": "Adhesive Blast",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {},
    "description": "Grenades have 100% chance to stick to surfaces.",
    "rarity": "rare"
  },
  {
    "id": "aerial_ace",
    "name": "Aerial Ace",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {},
    "description": "On Kill:\\nRefresh Double Jump up to 6x while Airborne.",
    "rarity": "rare"
  },
  {
    "id": "aero_agility",
    "name": "Aero Agility",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 25.0
    },
    "description": "100% Reload Speed while Aim Gliding",
    "rarity": "rare"
  },
  {
    "id": "aero_periphery",
    "name": "Aero Periphery",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "zoom": -12.5
    },
    "description": "-50% Zoom while Aim Gliding",
    "rarity": "common"
  },
  {
    "id": "agile_aim",
    "name": "Agile Aim",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 5
    },
    "description": "+20% Movement Speed when Aiming",
    "rarity": "uncommon"
  },
  {
    "id": "amalgam_argonak_metal_auger",
    "name": "Amalgam Argonak Metal Auger",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "punchThrough": 0.5
    },
    "description": "+3 Punch Through, Damage from Daggers reduces Armor by 6.\\n<LINE_SEPARATOR>\\nEnemies are revealed by Punch Through.",
    "rarity": "rare"
  },
  {
    "id": "amalgam_daikyu_target_acquired",
    "name": "Amalgam Daikyu Target Acquired",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "lifeSteal": 0.5,
      "headshotMultiplier": 12.5
    },
    "description": "+75% to Headshot Multiplier, +3% Life Steal on Nikanas, <LINE_SEPARATOR>\\n60% chance to pickup used arrows.",
    "rarity": "rare"
  },
  {
    "id": "amalgam_javlok_magazine_warp",
    "name": "Amalgam Javlok Magazine Warp",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "magazine": 7.5,
      "shield": 16.666667,
      "comboCountChance": 16.666667
    },
    "description": "+45% Magazine Capacity, +100% Combo Count Chance while Blocking with a Shield",
    "rarity": "rare"
  },
  {
    "id": "ambush_optics",
    "name": "Ambush Optics",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "zoom": -12.5
    },
    "description": "-50% Zoom",
    "rarity": "rare"
  },
  {
    "id": "ammo_drum",
    "name": "Ammo Drum",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "ammoMaximum": 15
    },
    "description": "+90% Ammo Maximum",
    "rarity": "common"
  },
  {
    "id": "apex_predator",
    "name": "Apex Predator",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "On Hit:\\nReveals target on Minimap for +6s.",
    "rarity": "uncommon"
  },
  {
    "id": "arrow_mutation",
    "name": "Arrow Mutation",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.333333
    },
    "description": "Converts Secondary ammo pickups to 50% of Ammo Pick Up.",
    "rarity": "rare"
  },
  {
    "id": "bane_of_corpus",
    "name": "Bane Of Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.3 Damage to Corpus",
    "rarity": "uncommon"
  },
  {
    "id": "bane_of_grineer",
    "name": "Bane Of Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.3 Damage to Grineer",
    "rarity": "uncommon"
  },
  {
    "id": "bane_of_infested",
    "name": "Bane Of Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.3 Damage to Infested",
    "rarity": "uncommon"
  },
  {
    "id": "bane_of_orokin",
    "name": "Bane Of Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.3 Damage to Orokin",
    "rarity": "uncommon"
  },
  {
    "id": "bane_of_the_murmur",
    "name": "Bane Of The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.3 Damage to Murmur",
    "rarity": "uncommon"
  },
  {
    "id": "bhisaj_bal",
    "name": "Bhisaj-Bal",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "statusChance": 15
    },
    "description": "Restore 300 Health for every 3 Status effects., +90% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "biotic_rounds",
    "name": "Biotic Rounds",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "viral": 25,
      "magnetic": 25,
      "statusChance": 25.0,
      "duration": 2.5
    },
    "description": "On Weak Point Kill:\\n+150% <DT_VIRAL_COLOR>Viral and <DT_MAGNETIC_COLOR>Magnetic Damage and Status Chance for 15s",
    "rarity": "rare"
  },
  {
    "id": "brain_storm",
    "name": "Brain Storm",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "ammoEfficiency": 25,
      "duration": 0.125
    },
    "description": "On Headshot:\\n+100% Ammo Efficiency for 0.5s",
    "rarity": "rare"
  },
  {
    "id": "bursting_mass",
    "name": "Bursting Mass",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 33.333333,
      "range": 2.5
    },
    "description": "The infested mass accumulates 200% of the damage that goes through it and deals it in 15m radius when it expires. Secondary fire will manually detonate an existing mass.",
    "rarity": "rare"
  },
  {
    "id": "catalyzer_link",
    "name": "Catalyzer Link",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "statusChance": 10,
      "duration": 1.5
    },
    "description": "On Ability Cast:\\n+60% Status Chance when Aiming for 9s",
    "rarity": "common"
  },
  {
    "id": "cautious_shot",
    "name": "Cautious Shot",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {},
    "description": "+100% chance to reduce the Stagger effect from self-imposed Radial Attacks",
    "rarity": "rare"
  },
  {
    "id": "charged_chamber",
    "name": "Charged Chamber",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damageFirstShot": 6.666667
    },
    "description": "+40% Damage on first shot in Magazine",
    "rarity": "uncommon"
  },
  {
    "id": "clip_delegation",
    "name": "Clip Delegation",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "magazine": 2.5
    },
    "description": "On Reload: Next Magazine has Status Chance and Multishot increased by 15% per shot landed with current Magazine. Max 15 stacks.",
    "rarity": "rare"
  },
  {
    "id": "combat_reload",
    "name": "Combat Reload",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "duration": 0.5,
      "reloadSpeed": 20.0
    },
    "description": "If 5 pellets are headshots, increase reload speed by +120% for 3s.",
    "rarity": "rare"
  },
  {
    "id": "combustion_beam",
    "name": "Combustion Beam",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "explosionDamage": 100.0
    },
    "description": "Enemies killed explode, dealing 600 Damage shortly after death.",
    "rarity": "rare"
  },
  {
    "id": "comet_rounds",
    "name": "Comet Rounds",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_IMPACT_COLOR>Impact",
    "rarity": "uncommon"
  },
  {
    "id": "continuous_misery",
    "name": "Continuous Misery",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "statusDuration": 25
    },
    "description": "+100% Status Duration",
    "rarity": "common"
  },
  {
    "id": "crash_course",
    "name": "Crash Course",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "impact": 20
    },
    "description": "+120% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "critical_precision",
    "name": "Critical Precision",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 1.666667,
      "critBonusPerKill": 1.666667
    },
    "description": "Burst Fire Only: Headshots increase Critical Chance by 10% up to 500%. Missing with all shots in a burst removes up to 100% of this bonus Critical Chance.",
    "rarity": "rare"
  },
  {
    "id": "deadly_sequence",
    "name": "Deadly Sequence",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 50,
      "syndicatePower": 1.0
    },
    "description": "+200% Critical Chance, +1 'Sequence'",
    "rarity": "rare"
  },
  {
    "id": "deft_tempo",
    "name": "Deft Tempo",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "On Headshot:\\n+10% Mobility for 4s",
    "rarity": "rare"
  },
  {
    "id": "depleted_reload",
    "name": "Depleted Reload",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magazine": -10,
      "reloadSpeed": 8
    },
    "description": "-60% Magazine Capacity, +48% Reload Speed",
    "rarity": "rare"
  },
  {
    "id": "directed_convergence",
    "name": "Directed Convergence",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "accuracy": 25
    },
    "description": "+100% Accuracy when Aiming",
    "rarity": "rare"
  },
  {
    "id": "disarming_purity",
    "name": "Disarming Purity",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "disarmChance": 10.0,
      "syndicatePower": 1.0
    },
    "description": "Secondary Fire mode has a 40% chance to disarm enemies., +1 'Purity'",
    "rarity": "rare"
  },
  {
    "id": "double_tap",
    "name": "Double Tap",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "damage": 5.0,
      "duration": 0.5
    },
    "description": "ON HIT:\\n20% Bonus Damage on next Shot for 2s.\\nStacks up to 20x outside of Conclave.",
    "rarity": "rare"
  },
  {
    "id": "dreadful_killshot",
    "name": "Dreadful Killshot",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "health": 3.333333
    },
    "description": "Increased Damage and Status Chance by +20% for every 75 Warframe Health. Capped at 360%",
    "rarity": "rare"
  },
  {
    "id": "eagle_eye",
    "name": "Eagle Eye",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "zoom": 10
    },
    "description": "+40% Zoom",
    "rarity": "uncommon"
  },
  {
    "id": "emergent_aftermath",
    "name": "Emergent Aftermath",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 12.5,
      "duration": 0.75
    },
    "description": "On Kill:\\n+50% Reload Speed for 3s",
    "rarity": "rare"
  },
  {
    "id": "entropy_burst",
    "name": "Entropy Burst",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "statusChance": 5,
      "syndicatePower": 1.0
    },
    "description": "+20 Final Status Chance, +1 'Entropy'",
    "rarity": "rare"
  },
  {
    "id": "eximus_advantage",
    "name": "Eximus Advantage",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "damage": 100.0
    },
    "description": "Headshots on Eximus enemies increase Secondary Damage by +600% for 10 secs.",
    "rarity": "rare"
  },
  {
    "id": "exposing_harpoon",
    "name": "Exposing Harpoon",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 50,
      "duration": 2.5
    },
    "description": "Pulling an enemy will give +300% Critical Chance for 15s.",
    "rarity": "rare"
  },
  {
    "id": "fanged_fusillade",
    "name": "Fanged Fusillade",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "slash": 20
    },
    "description": "+120% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "feathered_arrows",
    "name": "Feathered Arrows",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 15,
      "damage": -5
    },
    "description": "+60% Projectile Speed, -20% Damage",
    "rarity": "uncommon"
  },
  {
    "id": "final_tap",
    "name": "Final Tap",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "damage": 25,
      "duration": 0.05
    },
    "description": "On 4 Hits within 0.05s:\\n+100% Damage for 0.2s",
    "rarity": "rare"
  },
  {
    "id": "firestorm",
    "name": "Firestorm",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "blastRange": 6,
      "range": 6.0
    },
    "description": "Improves the Blast Radius of weapons with Radial Attacks.\\n+24% Blast Range",
    "rarity": "rare"
  },
  {
    "id": "flux_overdrive",
    "name": "Flux Overdrive",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "heat": 25.0,
      "duration": 0.833333
    },
    "description": "Status Chance fluctuates between +150% and +250% over 5s while the beam is fired.",
    "rarity": "rare"
  },
  {
    "id": "focused_acceleration",
    "name": "Focused Acceleration",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "projectileSpeed": 20
    },
    "description": "When Aiming:\\n+80% Projectile Speed",
    "rarity": "rare"
  },
  {
    "id": "gilded_truth",
    "name": "Gilded Truth",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "fireRate": 20,
      "syndicatePower": 1.0
    },
    "description": "+80% Fire Rate, +1 'Truth'",
    "rarity": "rare"
  },
  {
    "id": "gorgon_frenzy",
    "name": "Gorgon Frenzy",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "fireRate": 7.5,
      "duration": 0.75
    },
    "description": "On Kill:\\n+30% Fire Rate for 3s",
    "rarity": "rare"
  },
  {
    "id": "grinloked",
    "name": "Grinloked",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "accuracy": 15
    },
    "description": "+60% Accuracy when Aiming",
    "rarity": "rare"
  },
  {
    "id": "guided_ordnance",
    "name": "Guided Ordnance",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "accuracy": 5,
      "duration": 1.5
    },
    "description": "On Hit:\\n+30% Accuracy when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "gun_glide",
    "name": "Gun Glide",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "accuracy": 5,
      "recoil": -5.0
    },
    "description": "-20% Weapon Recoil, and +20% Accuracy when Sliding",
    "rarity": "rare"
  },
  {
    "id": "harkonar_scope",
    "name": "Harkonar Scope",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "comboDuration": 2,
      "duration": 2.0
    },
    "description": "+12s Combo Duration",
    "rarity": "uncommon"
  },
  {
    "id": "hata_satya",
    "name": "Hata-Satya",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "critBonusPerKill": 0.2
    },
    "description": "Each hit increases Critical Chance by 1.2%. Resets upon reloading or holstering.",
    "rarity": "rare"
  },
  {
    "id": "higasa_serration",
    "name": "Higasa Serration",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "damage": 75
    },
    "description": "Alternate Fire applies a random Status Effect to enemies hit.\\n+450% Damage",
    "rarity": "rare"
  },
  {
    "id": "hydraulic_gauge",
    "name": "Hydraulic Gauge",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magazine": -2.5,
      "recoil": -15.0
    },
    "description": "-60% Weapon Recoil, -10% Magazine Capacity",
    "rarity": "rare"
  },
  {
    "id": "internal_bleeding",
    "name": "Internal Bleeding",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "slashOnImpactProc": 5.833333
    },
    "description": " <DT_IMPACT_COLOR>Impact Status Effects have 35% chance to apply a <DT_SLASH_COLOR>Slash Status Effect (x2 when Fire Rate is below 2.5)",
    "rarity": "rare"
  },
  {
    "id": "kinetic_ricochet",
    "name": "Kinetic Ricochet",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "ricochetBounces": 6.0,
      "range": 5.0
    },
    "description": "Shots now bounce up to 6x and travel 30% further.",
    "rarity": "rare"
  },
  {
    "id": "lasting_purity",
    "name": "Lasting Purity",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 15,
      "syndicatePower": 1.0
    },
    "description": "+60% Damage when Aiming, +1 'Purity'",
    "rarity": "rare"
  },
  {
    "id": "lie_in_wait",
    "name": "Lie In Wait",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "fireRate": 5,
      "recoil": 25.0
    },
    "description": "+20% Fire Rate when Crouching, +100% Weapon Recoil",
    "rarity": "uncommon"
  },
  {
    "id": "loose_hatch",
    "name": "Loose Hatch",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 5,
      "recoil": 8.333333
    },
    "description": "+30% Reload Speed, +50% Weapon Recoil",
    "rarity": "common"
  },
  {
    "id": "lucky_shot",
    "name": "Lucky Shot",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 10,
      "accuracy": -0.5
    },
    "description": "+40% Projectile Speed, -2% Accuracy",
    "rarity": "uncommon"
  },
  {
    "id": "magnetic_capacity",
    "name": "Magnetic Capacity",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magnetic": 15,
      "magazine": 10
    },
    "description": "+60% <DT_MAGNETIC_COLOR>Magnetic, +40% Magazine Capacity",
    "rarity": "rare"
  },
  {
    "id": "maximum_capacity",
    "name": "Maximum Capacity",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magazine": 5,
      "reloadSpeed": -2.5
    },
    "description": "+30% Magazine Capacity, -15% Reload Speed",
    "rarity": "common"
  },
  {
    "id": "measured_burst",
    "name": "Measured Burst",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "fireRate": -15,
      "damage": 7.5
    },
    "description": "When Aiming:\\n-60% Fire Rate\\n+30% Damage",
    "rarity": "rare"
  },
  {
    "id": "mending_shot",
    "name": "Mending Shot",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "energyOrbBonus": 10.0
    },
    "description": "Shoot Health Orbs to obtain them with +110% extra effect.",
    "rarity": "rare"
  },
  {
    "id": "metamorphic_magazine",
    "name": "Metamorphic Magazine",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "magazine": 15,
      "ammoMaximum": 15,
      "duration": 0.833333
    },
    "description": "+90% Magazine Capacity, +90% Ammo Maximum, Inflicting 20 cumulative attacks on an enemy will petrify them for 5s.",
    "rarity": "rare"
  },
  {
    "id": "meticulous_aim",
    "name": "Meticulous Aim",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "headshotDamage": 17.5,
      "damage": -7.5
    },
    "description": "+105% Headshot Damage, -45% Bodyshot Damage",
    "rarity": "rare"
  },
  {
    "id": "motus_setup",
    "name": "Motus Setup",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "criticalChance": 25.0,
      "statusChance": 25.0,
      "duration": 1.0
    },
    "description": "100% Critical and Status Chance for 4s after landing from a Double or Bullet Jump.",
    "rarity": "rare"
  },
  {
    "id": "napalm_grenades",
    "name": "Napalm Grenades",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "statusChance": 5
    },
    "description": "Grenades leave a burning patch on impact.\\n+30 Final Status Chance",
    "rarity": "rare"
  },
  {
    "id": "necrophagic_vigor",
    "name": "Necrophagic Vigor",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "health": 3.333333
    },
    "description": "Reloading drains up to half your Health based on ammo created, increasing Critical Chance and Critical Damage by +20% for every 20 Health drained. Capped at 360%.",
    "rarity": "rare"
  },
  {
    "id": "neutralizing_justice",
    "name": "Neutralizing Justice",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "nullifierPopChance": 22.5,
      "syndicatePower": 1.0
    },
    "description": "Each Miter blade has a +90% chance to immediately destroy a Nullifier field., +1 'Justice'",
    "rarity": "rare"
  },
  {
    "id": "nightwatch_napalm",
    "name": "Nightwatch Napalm",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 5.0,
      "duration": 1.0
    },
    "description": "Rockets disperse napalm, inflicting 30% damage over 6s across 90% of the explosion area.",
    "rarity": "uncommon"
  },
  {
    "id": "overview",
    "name": "Overview",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "zoom": -10
    },
    "description": "-60% Zoom while Aim Gliding",
    "rarity": "uncommon"
  },
  {
    "id": "photon_overcharge",
    "name": "Photon Overcharge",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "criticalMultiplier": 15,
      "energy": 0.333333
    },
    "description": "+90% Critical Damage, On Kill or Assist: Slain enemies have a 2% chance to drop an Energy Orb per <DT_FREEZE_COLOR>Cold Status affecting them.",
    "rarity": "rare"
  },
  {
    "id": "piercing_hit",
    "name": "Piercing Hit",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "puncture": 15
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "common"
  },
  {
    "id": "plan_b",
    "name": "Plan B",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "fireRate": 5.0,
      "duration": 0.75
    },
    "description": "On Hit:\\n+20% Secondary Weapon Fire Rate for 3s",
    "rarity": "rare"
  },
  {
    "id": "precision_munition",
    "name": "Precision Munition",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 0,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "accuracy": 100,
      "projectileSpeed": 50
    },
    "description": "+100% Accuracy, +50% Projectile Speed",
    "rarity": "rare"
  },
  {
    "id": "precision_strike",
    "name": "Precision Strike",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "duration": 1.25
    },
    "description": "Hitting an enemy directly with the grenade increases Reload Speed by 150% for 5s.",
    "rarity": "rare"
  },
  {
    "id": "primary_acuity",
    "name": "Primary Acuity",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "weakPointDamage": 31.818182,
      "criticalChanceOnHeadshot": 31.818182
    },
    "description": "+350% Weak Point Damage, +350% Weak Point Critical Chance. Multishot cannot be modified.",
    "rarity": "rare"
  },
  {
    "id": "primed_bane_of_corpus",
    "name": "Primed Bane Of Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.55 Damage to Corpus",
    "rarity": "legendary"
  },
  {
    "id": "primed_bane_of_grineer",
    "name": "Primed Bane Of Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.55 Damage to Grineer",
    "rarity": "legendary"
  },
  {
    "id": "primed_bane_of_infested",
    "name": "Primed Bane Of Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.55 Damage to Infested",
    "rarity": "legendary"
  },
  {
    "id": "primed_bane_of_orokin",
    "name": "Primed Bane Of Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.55 Damage to Orokin",
    "rarity": "legendary"
  },
  {
    "id": "primed_bane_of_the_murmur",
    "name": "Primed Bane Of The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.55 Damage to Murmur",
    "rarity": "legendary"
  },
  {
    "id": "primed_chamber",
    "name": "Primed Chamber",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damageFirstShot": 25.0
    },
    "description": "+100% Damage on first shot in Magazine",
    "rarity": "rare"
  },
  {
    "id": "primed_charged_chamber",
    "name": "Primed Charged Chamber",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damageFirstShot": 10
    },
    "description": "+110% Damage on first shot in Magazine",
    "rarity": "legendary"
  },
  {
    "id": "primed_firestorm",
    "name": "Primed Firestorm",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "blastRange": 4,
      "range": 4.0
    },
    "description": "Improves the Blast Radius of weapons with Radial Attacks.\\n+44% Blast Range",
    "rarity": "legendary"
  },
  {
    "id": "primed_magazine_warp",
    "name": "Primed Magazine Warp",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magazine": 5
    },
    "description": "+55% Magazine Capacity",
    "rarity": "legendary"
  },
  {
    "id": "primed_rifle_ammo_mutation",
    "name": "Primed Rifle Ammo Mutation",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.363636
    },
    "description": "Converts Secondary ammo pickups to 92% of Ammo Pick Up.",
    "rarity": "legendary"
  },
  {
    "id": "primed_shred",
    "name": "Primed Shred",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.2,
      "fireRate": 5
    },
    "description": "+55% Fire Rate (x2 for Bows), +2.2 Punch Through",
    "rarity": "legendary"
  },
  {
    "id": "primed_sniper_ammo_mutation",
    "name": "Primed Sniper Ammo Mutation",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.363636
    },
    "description": "Converts Secondary ammo pickups to 92% of Ammo Pick Up.",
    "rarity": "legendary"
  },
  {
    "id": "primed_stabilizer",
    "name": "Primed Stabilizer",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "recoil": -7.7273
    },
    "description": "-85% Weapon Recoil",
    "rarity": "legendary"
  },
  {
    "id": "proton_jet",
    "name": "Proton Jet",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "statusChance": 30,
      "criticalChance": 30.0
    },
    "description": "During a Wall Latch gain +120% Status Chance and Critical Chance.",
    "rarity": "uncommon"
  },
  {
    "id": "radiated_reload",
    "name": "Radiated Reload",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 10,
      "radiation": 15.0
    },
    "description": "+60% <DT_RADIATION_COLOR>Radiation, +40% Reload Speed",
    "rarity": "rare"
  },
  {
    "id": "range_advantage",
    "name": "Range Advantage",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "damage": 50,
      "range": 1.666667
    },
    "description": "+300% damage if no enemies are within 10m.",
    "rarity": "rare"
  },
  {
    "id": "recover",
    "name": "Recover",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "duration": 2.5,
      "health": -6.25
    },
    "description": "On Kill:\\n+15 Heal Rate for 10s, -25% from Health Orbs",
    "rarity": "rare"
  },
  {
    "id": "rifle_ammo_mutation",
    "name": "Rifle Ammo Mutation",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.333333
    },
    "description": "Converts Secondary ammo pickups to 50% of Ammo Pick Up.",
    "rarity": "rare"
  },
  {
    "id": "rifle_elementalist",
    "name": "Rifle Elementalist",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "statusDamage": 15,
      "punchThrough": 0.1
    },
    "description": "+90% Status Damage, +0.6 Punch Through",
    "rarity": "uncommon"
  },
  {
    "id": "ripper_rounds",
    "name": "Ripper Rounds",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "uncommon"
  },
  {
    "id": "rupture",
    "name": "Rupture",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact",
    "rarity": "common"
  },
  {
    "id": "sawtooth_clip",
    "name": "Sawtooth Clip",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "slash": 15
    },
    "description": "+90% <DT_SLASH_COLOR>Slash",
    "rarity": "common"
  },
  {
    "id": "scattered_justice",
    "name": "Scattered Justice",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "multishot": 50,
      "syndicatePower": 1.0
    },
    "description": "+200% Multishot, +1 'Justice'",
    "rarity": "rare"
  },
  {
    "id": "semi_rifle_cannonade",
    "name": "Semi-Rifle Cannonade",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.25,
      "damage": 40
    },
    "description": "Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\n+240% Damage\\n+1.5 Punch Through",
    "rarity": "uncommon"
  },
  {
    "id": "sentient_barrage",
    "name": "Sentient Barrage",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 50.0,
      "criticalMultiplier": 50.0
    },
    "description": "Discharge from Alt-Fire now has infinite Body Punch Through but no longer explodes on contact. Each enemy hit will refill one charge, and reaching a full charge will increase the Critical Chance and Critical Damage of the next discharge by 300%.",
    "rarity": "rare"
  },
  {
    "id": "serrated_rounds",
    "name": "Serrated Rounds",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_SLASH_COLOR>Slash",
    "rarity": "uncommon"
  },
  {
    "id": "sharpshooter",
    "name": "Sharpshooter",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "energyOnKill": 1.363636
    },
    "description": "On Headshot Kill:\\n+15 Energy",
    "rarity": "rare"
  },
  {
    "id": "shattering_justice",
    "name": "Shattering Justice",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "statusChance": 22.5,
      "syndicatePower": 1.0
    },
    "description": "+90% Status Chance, +1 'Justice'",
    "rarity": "rare"
  },
  {
    "id": "shivering_contagion",
    "name": "Shivering Contagion",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "range": 1.0
    },
    "description": "On <DT_FREEZE_COLOR>Cold Status Effect: 100% chance to spread that status to other enemies within 6m.",
    "rarity": "rare"
  },
  {
    "id": "sinister_reach",
    "name": "Sinister Reach",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "range": 3.0
    },
    "description": "+12m Beam Range",
    "rarity": "uncommon"
  },
  {
    "id": "sniper_ammo_mutation",
    "name": "Sniper Ammo Mutation",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.333333
    },
    "description": "Converts Secondary ammo pickups to 50% of Ammo Pick Up.",
    "rarity": "rare"
  },
  {
    "id": "soaring_strike",
    "name": "Soaring Strike",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "fireRate": 12.5
    },
    "description": "+50% Fire Rate when Airborne",
    "rarity": "rare"
  },
  {
    "id": "spectral_serration",
    "name": "Spectral Serration",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damage": 30
    },
    "description": "+330% Damage while Invisible",
    "rarity": "rare"
  },
  {
    "id": "split_flights",
    "name": "Split Flights",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "accuracy": -30,
      "multishot": 16.666667,
      "duration": 0.333333
    },
    "description": "On Hit:\\n+100% Multishot\\n-180% Accuracy for 2s. Stacks up to 4x.\\n(Non-AOE Bows)",
    "rarity": "rare"
  },
  {
    "id": "spontaneous_singularity",
    "name": "Spontaneous Singularity",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "damage": 15.0
    },
    "description": "Orbs that strike targets will explode immediately with 90% Bonus Damage and a 18% chance of Singularity that pulls in more targets. Orbs do not bounce or combine. ",
    "rarity": "rare"
  },
  {
    "id": "spring_loaded_broadhead",
    "name": "Spring-Loaded Broadhead",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "range": 2.5
    },
    "description": "Increase damage by +40%, if the target is over 15m away.",
    "rarity": "rare"
  },
  {
    "id": "spring_loaded_chamber",
    "name": "Spring-Loaded Chamber",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "fireRate": 12.5,
      "duration": 1.5
    },
    "description": "On Reload:\\n+75% Fire Rate when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "stabilizer",
    "name": "Stabilizer",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "recoil": -10.0
    },
    "description": "-60% Weapon Recoil",
    "rarity": "rare"
  },
  {
    "id": "sudden_justice",
    "name": "Sudden Justice",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "fireRate": 7.5,
      "duration": 0.5
    },
    "description": "On 2 Hits within 0.2s:\\n+30% Fire Rate for 2s",
    "rarity": "rare"
  },
  {
    "id": "tainted_mag",
    "name": "Tainted Mag",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magazine": 6,
      "reloadSpeed": -3
    },
    "description": "+66% Magazine Capacity, -33% Reload Speed",
    "rarity": "rare"
  },
  {
    "id": "target_acquired",
    "name": "Target Acquired",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "headshotMultiplier": 10.0
    },
    "description": "+60% to Headshot Multiplier",
    "rarity": "rare"
  },
  {
    "id": "terminal_velocity",
    "name": "Terminal Velocity",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 15
    },
    "description": "+60% Projectile Speed",
    "rarity": "uncommon"
  },
  {
    "id": "tether_grenades",
    "name": "Tether Grenades",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "range": 1.5
    },
    "description": "Grenades tether up to 5 enemies from 9m away.",
    "rarity": "rare"
  },
  {
    "id": "thermagnetic_shells",
    "name": "Thermagnetic Shells",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "health": 10.0,
      "range": 1.5
    },
    "description": "Enemies explode on death, dealing 80 <DT_MAGNETIC_COLOR>Magnetic Damage (+40% Enemy Max Health) in a 6m radius.",
    "rarity": "rare"
  },
  {
    "id": "thunderbolt",
    "name": "Thunderbolt",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "explosionChance": 7.5
    },
    "description": "+45% Chance to Explode (Use with Caution)",
    "rarity": "rare"
  },
  {
    "id": "thundermiter",
    "name": "Thundermiter",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "magazine": -15
    },
    "description": "+100% chance charged Projectiles explode, -60% Magazine Capacity",
    "rarity": "rare"
  },
  {
    "id": "triple_tap",
    "name": "Triple Tap",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "damage": 10,
      "duration": 0.05
    },
    "description": "On 2 Hits within 0.02s:\\n+40% Damage for 0.2s",
    "rarity": "rare"
  },
  {
    "id": "twitch",
    "name": "Twitch",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "accuracy": -10.0,
      "duration": 2.0
    },
    "description": "On Equip: \\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s",
    "rarity": "uncommon"
  },
  {
    "id": "unseen_dread",
    "name": "Unseen Dread",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "criticalMultiplier": 29.166667,
      "duration": 0.833333
    },
    "description": "Become invisible for 5 seconds when you strike 3 or more enemies with a single projectile. Deal 175% more Critical Damage with Dread while invisible.",
    "rarity": "rare"
  },
  {
    "id": "vanquished_prey",
    "name": "Vanquished Prey",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "shield": -25,
      "duration": 2.5,
      "health": -6.25
    },
    "description": "On Kill:\\n-100% Shield Recharge Delay for 10s, -25% from Health Orbs",
    "rarity": "rare"
  },
  {
    "id": "vile_discharge",
    "name": "Vile Discharge",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "storedDamage": 5000.0
    },
    "description": "Damage is accumulated up to 30,000. Use Alt-fire to launch an explosive vile sac dealing and resetting the accumulated damage.",
    "rarity": "rare"
  },
  {
    "id": "vile_precision",
    "name": "Vile Precision",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "fireRate": -6,
      "recoil": -15.0
    },
    "description": "-90% Weapon Recoil, -36% Fire Rate (x2 for Bows)",
    "rarity": "rare"
  },
  {
    "id": "volatile_variant",
    "name": "Volatile Variant",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "weapon",
    "stats": {
      "punchThrough": 0.5,
      "statusChance": 8.3333,
      "range": 0.666667
    },
    "description": "Shots have +3 Punch Through and barbs explode instantly. Barbs that strike enemies directly have +4m radius and +50% Status Chance.",
    "rarity": "rare"
  },
  {
    "id": "voltage_sequence",
    "name": "Voltage Sequence",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "duration": 2.0,
      "syndicatePower": 1.0
    },
    "description": "Killing a flying enemy creates a lightning trap from their remains, lasting 8s, +1 'Sequence'",
    "rarity": "rare"
  },
  {
    "id": "wild_frenzy",
    "name": "Wild Frenzy",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "fireRate": 66.6667
    },
    "description": "Secondary Fire will shoot with +400% Fire Rate until the magazine is empty. Killing 2 or more enemies will refund 100% of the ammo.",
    "rarity": "rare"
  },
  {
    "id": "cryo_rounds_r3",
    "name": "Cryo Rounds",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "cold": 15
    },
    "description": "+90% <DT_FREEZE_COLOR>Cold",
    "rarity": "uncommon"
  },
  {
    "id": "fast_hands_r3",
    "name": "Fast Hands",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 5
    },
    "description": "+30% Reload Speed",
    "rarity": "common"
  },
  {
    "id": "hellfire_r3",
    "name": "Hellfire",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "heat": 15
    },
    "description": "+90% <DT_FIRE_COLOR>Heat",
    "rarity": "uncommon"
  },
  {
    "id": "high_voltage_r3",
    "name": "High Voltage",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "hush_r3",
    "name": "Hush",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "noiseReduction": 25.0
    },
    "description": "Reduces the chance an enemy will hear gunfire by 100%.",
    "rarity": "common"
  },
  {
    "id": "infected_clip_r3",
    "name": "Infected Clip",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "toxin": 15
    },
    "description": "+90% <DT_POISON_COLOR>Toxin",
    "rarity": "uncommon"
  },
  {
    "id": "magazine_warp_r3",
    "name": "Magazine Warp",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "magazine": 5
    },
    "description": "+30% Magazine Capacity",
    "rarity": "common"
  },
  {
    "id": "malignant_force_r3",
    "name": "Malignant Force",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "metal_auger_r3",
    "name": "Metal Auger",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.35
    },
    "description": "+2.1 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "point_strike_r3",
    "name": "Point Strike",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "criticalChance": 25
    },
    "description": "+150% Critical Chance",
    "rarity": "common"
  },
  {
    "id": "rifle_aptitude_r3",
    "name": "Rifle Aptitude",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "statusChance": 15
    },
    "description": "+90% Status Chance",
    "rarity": "uncommon"
  },
  {
    "id": "rime_rounds_r3",
    "name": "Rime Rounds",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "serration_r3",
    "name": "Serration",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "damage": 15
    },
    "description": "+165% Damage",
    "rarity": "uncommon"
  },
  {
    "id": "speed_trigger_r3",
    "name": "Speed Trigger",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "fireRate": 10
    },
    "description": "+60% Fire Rate (x2 for Bows)",
    "rarity": "uncommon"
  },
  {
    "id": "split_chamber_r3",
    "name": "Split Chamber",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "multishot": 15
    },
    "description": "+90% Multishot",
    "rarity": "rare"
  },
  {
    "id": "stormbringer_r3",
    "name": "Stormbringer",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "electricity": 15
    },
    "description": "+90% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "uncommon"
  },
  {
    "id": "tactical_reload_r3",
    "name": "Tactical Reload",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "holsterRate": 5
    },
    "description": "+20% Magazine Reloaded/s when Holstered",
    "rarity": "rare"
  },
  {
    "id": "vital_sense_r3",
    "name": "Vital Sense",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "primary",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 20
    },
    "description": "+120% Critical Damage",
    "rarity": "rare"
  },
  {
    "id": "accelerated_isotope",
    "name": "Accelerated Isotope",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "fireRate": 10,
      "radiation": 15.0
    },
    "description": "+60% <DT_RADIATION_COLOR>Radiation, +40% Fire Rate",
    "rarity": "rare"
  },
  {
    "id": "air_recon",
    "name": "Air Recon",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "zoom": -10
    },
    "description": "-60% Zoom while Aim Gliding",
    "rarity": "uncommon"
  },
  {
    "id": "amalgam_barrel_diffusion",
    "name": "Amalgam Barrel Diffusion",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "multishot": 18.3333
    },
    "description": "+110% Multishot, +60% Dodge Speed",
    "rarity": "rare"
  },
  {
    "id": "blind_shot",
    "name": "Blind Shot",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 10,
      "accuracy": -1
    },
    "description": "+40% Projectile Speed, -4% Accuracy",
    "rarity": "rare"
  },
  {
    "id": "bore",
    "name": "Bore",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "puncture": 20
    },
    "description": "+120% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "calculated_victory",
    "name": "Calculated Victory",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "shield": -25,
      "duration": 2.5,
      "health": -6.25
    },
    "description": "On Kill:\\n-100% Shield Recharge Delay for 10s, -25% from Health Orbs",
    "rarity": "rare"
  },
  {
    "id": "cannonade",
    "name": "Cannonade",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "explosionChance": 7.5
    },
    "description": "+30% Chance to Explode (Use with Caution)",
    "rarity": "rare"
  },
  {
    "id": "carnis_stinger",
    "name": "Carnis Stinger",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "slash": 15,
      "statusChance": 10
    },
    "description": "+90% <DT_SLASH_COLOR>Slash, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "concealed_explosives",
    "name": "Concealed Explosives",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "explosionChance": 20.0
    },
    "description": "+80% Chance to Explode (Use with Caution)",
    "rarity": "rare"
  },
  {
    "id": "concussion_rounds",
    "name": "Concussion Rounds",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact",
    "rarity": "uncommon"
  },
  {
    "id": "critical_mutation",
    "name": "Critical Mutation",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 5.0,
      "criticalMultiplier": 5.0
    },
    "description": "Each kill increases Critical Chance and Critical Damage by 30% up to 300%. Reduce by 30% when fewer than 3 enemies are struck by the grenade explosion.",
    "rarity": "rare"
  },
  {
    "id": "damzav_vati",
    "name": "Damzav-Vati",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "viral": 40
    },
    "description": "+240% <DT_VIRAL_COLOR>Viral",
    "rarity": "rare"
  },
  {
    "id": "deadly_maneuvers",
    "name": "Deadly Maneuvers",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 100.0
    },
    "description": "On Dodge, gain 400% Headshot Critical Chance for your next 2 shots.",
    "rarity": "rare"
  },
  {
    "id": "dizzying_rounds",
    "name": "Dizzying Rounds",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "statusChance": 50,
      "range": 2.0
    },
    "description": "Shots from less than 8m stun enemies and open them to finishers.\\n+200% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "draining_gloom",
    "name": "Draining Gloom",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "magazine": -15,
      "ammoMaximum": -15,
      "energy": 25.0
    },
    "description": "+100% chance of Energy Drain explosion, -60% Magazine Capacity, -60% Ammo Maximum",
    "rarity": "rare"
  },
  {
    "id": "eject_magazine",
    "name": "Eject Magazine",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": 5
    },
    "description": "+20% Magazine Reloaded/s when Holstered",
    "rarity": "rare"
  },
  {
    "id": "energizing_shot",
    "name": "Energizing Shot",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "energyOrbBonus": 10.0
    },
    "description": "Shoot Energy Orbs to obtain them with +110% extra effect.",
    "rarity": "rare"
  },
  {
    "id": "entropy_spike",
    "name": "Entropy Spike",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "explosionChance": 5.0,
      "syndicatePower": 1.0
    },
    "description": "+20% Chance to Explode (Use with Caution), +1 'Entropy'",
    "rarity": "rare"
  },
  {
    "id": "eroding_blight",
    "name": "Eroding Blight",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "magazine": 50,
      "syndicatePower": 1.0
    },
    "description": "+200% Magazine Capacity, +1 'Blight'",
    "rarity": "rare"
  },
  {
    "id": "expel_orokin",
    "name": "Expel Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.3 Damage to Orokin",
    "rarity": "uncommon"
  },
  {
    "id": "expel_the_murmur",
    "name": "Expel The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.3 Damage to Murmur",
    "rarity": "uncommon"
  },
  {
    "id": "fass_canticle",
    "name": "Fass Canticle",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "shield": 10.0,
      "duration": 3.75
    },
    "description": "Killing enemies grants Allies in Affinity Range 40% Shield Recharge Rate and <LOWER_IS_BETTER>-28% Shield Recharge Delay for 15s.",
    "rarity": "rare"
  },
  {
    "id": "full_capacity",
    "name": "Full Capacity",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": 5,
      "reloadSpeed": -2.5
    },
    "description": "+30% Magazine Capacity, -15% Reload Speed",
    "rarity": "common"
  },
  {
    "id": "fulmination",
    "name": "Fulmination",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "blastRange": 6,
      "range": 6.0
    },
    "description": "Improves the Blast Radius of weapons with Radial Attacks.\\n+24% Blast Range",
    "rarity": "rare"
  },
  {
    "id": "galvanized_diffusion",
    "name": "Galvanized Diffusion",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "multishot": 10,
      "multishotOnKill": 2.727273,
      "duration": 1.818182
    },
    "description": "+110% Multishot, On Kill:\\n+30% Multishot for 20s. Stacks up to 4x.",
    "rarity": "rare"
  },
  {
    "id": "hawk_eye",
    "name": "Hawk Eye",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "zoom": 20
    },
    "description": "+80% Zoom",
    "rarity": "uncommon"
  },
  {
    "id": "heavy_warhead",
    "name": "Heavy Warhead",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "blastRange": 25,
      "projectileSpeed": -12.5,
      "blast": 25.0
    },
    "description": "+100% Blast Radius, -50% Projectile Speed",
    "rarity": "rare"
  },
  {
    "id": "hemorrhage",
    "name": "Hemorrhage",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "slashOnImpactProc": 5.833333
    },
    "description": " <DT_IMPACT_COLOR>Impact Status Effects have 35% chance to apply a <DT_SLASH_COLOR>Slash Status Effect (x2 when Fire Rate is below 2.5)",
    "rarity": "rare"
  },
  {
    "id": "hollow_point",
    "name": "Hollow Point",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10,
      "damage": -2.5
    },
    "description": "+60% Critical Damage, -15% Damage",
    "rarity": "rare"
  },
  {
    "id": "hydraulic_barrel",
    "name": "Hydraulic Barrel",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": -5,
      "recoil": -10.0
    },
    "description": "-40% Weapon Recoil, -20% Magazine Capacity",
    "rarity": "rare"
  },
  {
    "id": "impaler_munitions",
    "name": "Impaler Munitions",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "uncommon"
  },
  {
    "id": "jahu_canticle",
    "name": "Jahu Canticle",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "armorDebuffOnKill": 1.25,
      "shieldDebuffOnKill": 1.25
    },
    "description": "Killing enemies reduces the Armor and Shields of other enemies within Affinity Range by 5%.",
    "rarity": "rare"
  },
  {
    "id": "jugulus_spines",
    "name": "Jugulus Spines",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "puncture": 15,
      "statusChance": 10
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "khra_canticle",
    "name": "Khra Canticle",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "universalOrbChance": 3.0
    },
    "description": "Enemies have a 12% chance to drop a Universal Orb on death.",
    "rarity": "rare"
  },
  {
    "id": "leaded_gas",
    "name": "Leaded Gas",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "gas": 50,
      "statusChance": 50.0,
      "duration": 1.0
    },
    "description": "On Weak Point Hit:\\n+300% <DT_GAS_COLOR>Gas Damage and Status Chance for 6s",
    "rarity": "rare"
  },
  {
    "id": "lethal_momentum",
    "name": "Lethal Momentum",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 10
    },
    "description": "+40% Projectile Speed",
    "rarity": "uncommon"
  },
  {
    "id": "lohk_canticle",
    "name": "Lohk Canticle",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "fireRate": 7.5,
      "duration": 3.75
    },
    "description": "Killing enemies grants Allies within Affinity Range +30% Fire Rate for 15s.",
    "rarity": "rare"
  },
  {
    "id": "loose_magazine",
    "name": "Loose Magazine",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 8.3333,
      "recoil": 8.333333
    },
    "description": "+50% Reload Speed, +50% Weapon Recoil",
    "rarity": "common"
  },
  {
    "id": "magnetic_might",
    "name": "Magnetic Might",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magnetic": 15,
      "criticalMultiplier": 10
    },
    "description": "+60% <DT_MAGNETIC_COLOR>Magnetic, +40% Critical Damage",
    "rarity": "rare"
  },
  {
    "id": "maim",
    "name": "Maim",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "slash": 20
    },
    "description": "+120% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "merciless_gunfight",
    "name": "Merciless Gunfight",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.2,
      "criticalMultiplier": 7.5
    },
    "description": "+45% Critical Damage, +1.2 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "meteor_munitions",
    "name": "Meteor Munitions",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_IMPACT_COLOR>Impact",
    "rarity": "uncommon"
  },
  {
    "id": "netra_invocation",
    "name": "Netra Invocation",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "duration": 5.0
    },
    "description": "Alternate Fire increases Ability Efficiency by 4% for 20s for each enemy hit. Stacks up to 15 times.",
    "rarity": "rare"
  },
  {
    "id": "night_stalker",
    "name": "Night Stalker",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "On Hit:\\nReveals target on Minimap for +6s.",
    "rarity": "uncommon"
  },
  {
    "id": "no_return",
    "name": "No Return",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "puncture": 15
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "uncommon"
  },
  {
    "id": "pain_points",
    "name": "Pain Points",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "damage": 10.0,
      "duration": 0.833333
    },
    "description": "On Weak Point hits with Primary Fire:\\n+60% Weak Point Damage for 5s. Stacks up to 10x.",
    "rarity": "rare"
  },
  {
    "id": "perpetual_agony",
    "name": "Perpetual Agony",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "statusDuration": 15
    },
    "description": "+90% Status Duration",
    "rarity": "common"
  },
  {
    "id": "pistol_acuity",
    "name": "Pistol Acuity",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "weakPointDamage": 31.818182,
      "criticalChanceOnHeadshot": 31.818182
    },
    "description": "+350% Weak Point Damage, +350% Weak Point Critical Chance. Multishot cannot be modified.",
    "rarity": "rare"
  },
  {
    "id": "pistol_elementalist",
    "name": "Pistol Elementalist",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "statusDamage": 15,
      "reloadSpeed": 10
    },
    "description": "+90% Status Damage, +60% Reload Speed",
    "rarity": "uncommon"
  },
  {
    "id": "pressurized_magazine",
    "name": "Pressurized Magazine",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "fireRate": 15,
      "duration": 1.5
    },
    "description": "On Reload:\\n+90% Fire Rate when Aiming for 9s",
    "rarity": "rare"
  },
  {
    "id": "primed_expel_corpus",
    "name": "Primed Expel Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.55 Damage to Corpus",
    "rarity": "legendary"
  },
  {
    "id": "primed_expel_grineer",
    "name": "Primed Expel Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.55 Damage to Grineer",
    "rarity": "legendary"
  },
  {
    "id": "primed_expel_infested",
    "name": "Primed Expel Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.55 Damage to Infested",
    "rarity": "legendary"
  },
  {
    "id": "primed_expel_orokin",
    "name": "Primed Expel Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.55 Damage to Orokin",
    "rarity": "legendary"
  },
  {
    "id": "primed_expel_the_murmur",
    "name": "Primed Expel The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.55 Damage to Murmur",
    "rarity": "legendary"
  },
  {
    "id": "primed_fulmination",
    "name": "Primed Fulmination",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "blastRange": 4,
      "range": 4.0
    },
    "description": "Improves the Blast Radius of weapons with Radial Attacks.\\n+44% Blast Range",
    "rarity": "legendary"
  },
  {
    "id": "primed_pistol_ammo_mutation",
    "name": "Primed Pistol Ammo Mutation",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.363636
    },
    "description": "Converts Primary ammo pickups to 92% of Ammo Pick Up.",
    "rarity": "legendary"
  },
  {
    "id": "primed_slip_magazine",
    "name": "Primed Slip Magazine",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": 5
    },
    "description": "+55% Magazine Capacity",
    "rarity": "legendary"
  },
  {
    "id": "primed_steady_hands",
    "name": "Primed Steady Hands",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "recoil": -7.7273
    },
    "description": "-85% Weapon Recoil",
    "rarity": "legendary"
  },
  {
    "id": "pummel",
    "name": "Pummel",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "impact": 20
    },
    "description": "+120% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "razor_munitions",
    "name": "Razor Munitions",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_SLASH_COLOR>Slash",
    "rarity": "uncommon"
  },
  {
    "id": "razor_shot",
    "name": "Razor Shot",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "slash": 15
    },
    "description": "+90% <DT_SLASH_COLOR>Slash",
    "rarity": "uncommon"
  },
  {
    "id": "recuperate",
    "name": "Recuperate",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "duration": 2.5,
      "health": -6.25
    },
    "description": "On Kill:\\n+15 Heal Rate for 10s, -25% from Health Orbs",
    "rarity": "rare"
  },
  {
    "id": "reflex_draw",
    "name": "Reflex Draw",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "accuracy": -10.0,
      "duration": 2.0
    },
    "description": "On Equip: \\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s",
    "rarity": "uncommon"
  },
  {
    "id": "ris_invocation",
    "name": "Ris Invocation",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "duration": 5.0
    },
    "description": "Alternate Fire increases Ability Duration by 4% for 20s for each enemy hit. Stacks up to 15 times.",
    "rarity": "rare"
  },
  {
    "id": "ruinous_extension",
    "name": "Ruinous Extension",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "range": 2.0
    },
    "description": "+8m Beam Range",
    "rarity": "uncommon"
  },
  {
    "id": "saxum_spittle",
    "name": "Saxum Spittle",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "impact": 15,
      "statusChance": 10
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "secondary_wind",
    "name": "Secondary Wind",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 12.5,
      "duration": 1.0
    },
    "description": "On Kill:\\n+50% Reload Speed for 4s",
    "rarity": "rare"
  },
  {
    "id": "semi_pistol_cannonade",
    "name": "Semi-Pistol Cannonade",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.25,
      "damage": 50
    },
    "description": "Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\n+300% Damage\\n+1.5 Punch Through",
    "rarity": "uncommon"
  },
  {
    "id": "sentient_surge",
    "name": "Sentient Surge",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 10,
      "statusChance": 10
    },
    "description": "Each target eliminated refills 20% of Ocucor's magazine. Status Chance and Critical Chance are increased by 60% for each Tendril active.",
    "rarity": "rare"
  },
  {
    "id": "sequence_burn",
    "name": "Sequence Burn",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "range": 5.0,
      "syndicatePower": 1.0
    },
    "description": "+20m Beam Range, +1 'Sequence'",
    "rarity": "rare"
  },
  {
    "id": "sharpened_bullets",
    "name": "Sharpened Bullets",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 12.5,
      "duration": 1.5
    },
    "description": "On Kill:\\n+75% Critical Damage when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "shrapnel_rounds",
    "name": "Shrapnel Rounds",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 0,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "multishot": 200,
      "damage": -66
    },
    "description": "+200% Multishot, -66% Damage",
    "rarity": "rare"
  },
  {
    "id": "skull_shots",
    "name": "Skull Shots",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "ammoEfficiency": 25,
      "duration": 0.5
    },
    "description": "On Headshot:\\n+100% Ammo Efficiency for 2s",
    "rarity": "rare"
  },
  {
    "id": "soaring_truth",
    "name": "Soaring Truth",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "criticalChance": 50
    },
    "description": "+200% Critical Chance, +1 'Purity'",
    "rarity": "rare"
  },
  {
    "id": "spry_sights",
    "name": "Spry Sights",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 5
    },
    "description": "+20% Movement Speed when Aiming",
    "rarity": "uncommon"
  },
  {
    "id": "static_alacrity",
    "name": "Static Alacrity",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "projectileSpeed": 12.5,
      "blastRange": -12.5,
      "blast": -12.5
    },
    "description": "+50% Projectile Speed, -50% Blast Radius",
    "rarity": "rare"
  },
  {
    "id": "steady_hands",
    "name": "Steady Hands",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "recoil": -10.0
    },
    "description": "-60% Weapon Recoil",
    "rarity": "rare"
  },
  {
    "id": "stinging_truth",
    "name": "Stinging Truth",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "magazine": 10.0,
      "syndicatePower": 1.0
    },
    "description": "+40 Magazine Capacity, +1 'Truth'",
    "rarity": "rare"
  },
  {
    "id": "stockpiled_blight",
    "name": "Stockpiled Blight",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "magazine": 50,
      "syndicatePower": 1.0
    },
    "description": "+200% Magazine Capacity, +1 'Blight'",
    "rarity": "rare"
  },
  {
    "id": "strafing_slide",
    "name": "Strafing Slide",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "accuracy": 5,
      "recoil": -5.0
    },
    "description": "-20% Weapon Recoil, and +20% Accuracy when Sliding",
    "rarity": "rare"
  },
  {
    "id": "stunning_speed",
    "name": "Stunning Speed",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 10,
      "statusChance": 7.5
    },
    "description": "+40% Reload Speed, +30% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "sure_shot",
    "name": "Sure Shot",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "statusChance": 15
    },
    "description": "+90% Status Chance",
    "rarity": "uncommon"
  },
  {
    "id": "tainted_clip",
    "name": "Tainted Clip",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": 10,
      "reloadSpeed": -5
    },
    "description": "+60% Magazine Capacity, -30% Reload Speed",
    "rarity": "rare"
  },
  {
    "id": "targeting_subsystem",
    "name": "Targeting Subsystem",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "accuracy": 5,
      "duration": 1.5
    },
    "description": "On Hit:\\n+30% Accuracy when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "toxic_sequence",
    "name": "Toxic Sequence",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "statusDuration": 50,
      "syndicatePower": 1.0
    },
    "description": "+200% Status Duration, +1 'Sequence'",
    "rarity": "rare"
  },
  {
    "id": "vome_invocation",
    "name": "Vome Invocation",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "duration": 5.0,
      "abilityStrength": 1.0
    },
    "description": "Alternate Fire increases Ability Strength by 4% for 20s for each enemy hit. Stacks up to 15 times.",
    "rarity": "rare"
  },
  {
    "id": "winds_of_purity",
    "name": "Winds Of Purity",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "lifeSteal": 5,
      "syndicatePower": 1.0
    },
    "description": "+20% Life Steal, +1 'Purity'",
    "rarity": "rare"
  },
  {
    "id": "xata_invocation",
    "name": "Xata Invocation",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "duration": 5.0,
      "energyOnCast": 0.25
    },
    "description": "Alternate Fire grants 1 Energy Regen/s for 20s for each enemy hit. Stacks up to 10 times.",
    "rarity": "rare"
  },
  {
    "id": "zazvat_kar",
    "name": "Zazvat-Kar",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "weapon",
    "stats": {
      "ammoEfficiency": 12.5
    },
    "description": "+75% Ammo Efficiency while Airborne",
    "rarity": "rare"
  },
  {
    "id": "barrel_diffusion_r3",
    "name": "Barrel Diffusion",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "multishot": 20
    },
    "description": "+120% Multishot",
    "rarity": "rare"
  },
  {
    "id": "convulsion_r3",
    "name": "Convulsion",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "electricity": 15
    },
    "description": "+90% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "uncommon"
  },
  {
    "id": "deep_freeze_r3",
    "name": "Deep Freeze",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "cold": 15
    },
    "description": "+90% <DT_FREEZE_COLOR>Cold",
    "rarity": "uncommon"
  },
  {
    "id": "expel_corpus_r3",
    "name": "Expel Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.3 Damage to Corpus",
    "rarity": "uncommon"
  },
  {
    "id": "expel_grineer_r3",
    "name": "Expel Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.3 Damage to Grineer",
    "rarity": "uncommon"
  },
  {
    "id": "expel_infested_r3",
    "name": "Expel Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.3 Damage to Infested",
    "rarity": "uncommon"
  },
  {
    "id": "frostbite_r3",
    "name": "Frostbite",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "gunslinger_r3",
    "name": "Gunslinger",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "fireRate": 12
    },
    "description": "+72% Fire Rate",
    "rarity": "uncommon"
  },
  {
    "id": "heated_charge_r3",
    "name": "Heated Charge",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "heat": 15
    },
    "description": "+90% <DT_FIRE_COLOR>Heat",
    "rarity": "uncommon"
  },
  {
    "id": "hornet_strike_r3",
    "name": "Hornet Strike",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "damage": 20
    },
    "description": "+220% Damage",
    "rarity": "uncommon"
  },
  {
    "id": "jolt_r3",
    "name": "Jolt",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "pathogen_rounds_r3",
    "name": "Pathogen Rounds",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "toxin": 15
    },
    "description": "+90% <DT_POISON_COLOR>Toxin",
    "rarity": "uncommon"
  },
  {
    "id": "pistol_gambit_r3",
    "name": "Pistol Gambit",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "criticalChance": 20
    },
    "description": "+120% Critical Chance",
    "rarity": "common"
  },
  {
    "id": "pistol_pestilence_r3",
    "name": "Pistol Pestilence",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "quickdraw_r3",
    "name": "Quickdraw",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 8
    },
    "description": "+48% Reload Speed",
    "rarity": "common"
  },
  {
    "id": "scorch_r3",
    "name": "Scorch",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "statusChance": 15,
      "heat": 15.0
    },
    "description": "+60% <DT_FIRE_COLOR>Heat, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "seeker_r3",
    "name": "Seeker",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.35
    },
    "description": "+2.1 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "slip_magazine_r3",
    "name": "Slip Magazine",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": 5
    },
    "description": "+30% Magazine Capacity",
    "rarity": "common"
  },
  {
    "id": "suppress_r3",
    "name": "Suppress",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "noiseReduction": 16.666667
    },
    "description": "Reduces the chance an enemy will hear gunfire by 100%.",
    "rarity": "common"
  },
  {
    "id": "synth_charge_r3",
    "name": "Synth Charge",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "magazine": 50.0
    },
    "description": "+200% Bonus Damage on final shot. Requires Magazine 6 or higher.",
    "rarity": "rare"
  },
  {
    "id": "target_cracker_r3",
    "name": "Target Cracker",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10
    },
    "description": "+60% Critical Damage",
    "rarity": "uncommon"
  },
  {
    "id": "trick_mag_r3",
    "name": "Trick Mag",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "secondary",
    "subCategory": "",
    "stats": {
      "ammoMaximum": 15
    },
    "description": "+90% Ammo Maximum",
    "rarity": "common"
  },
  {
    "id": "air_martial",
    "name": "Air Martial",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "channelingDamage": -25
    },
    "description": "With Melee equipped, lock onto targets within +5m while Airborne, -100% Channeling Damage",
    "rarity": "rare"
  },
  {
    "id": "amalgam_furax_body_count",
    "name": "Amalgam Furax Body Count",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "comboDuration": 2.5,
      "fireRate": 7.5,
      "blastStaggerRadius": 2.5
    },
    "description": "+15s Combo Duration\\n+45% Fire Rate for Secondary Weapons\\n<LINE_SEPARATOR>\\nMelee kills <DT_EXPLOSION_COLOR>Blast and stagger enemies in 15m",
    "rarity": "rare"
  },
  {
    "id": "amalgam_ripkas_true_steel",
    "name": "Amalgam Ripkas True Steel",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "criticalChance": 31.1667,
      "reloadSpeed": 3.3333
    },
    "description": "+187% Critical Chance (x2 for Heavy Attacks), +20% Reload Speed on Shotguns, <LINE_SEPARATOR>\\n+100% Gore Chance",
    "rarity": "rare"
  },
  {
    "id": "amanata_pressure",
    "name": "Amanata Pressure",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "weapon",
    "stats": {
      "damage": 55
    },
    "description": "When Combo Multiplier reaches 8x, Heavy attacks apply a random Status Effect to enemies hit.\\n+330% Melee Damage",
    "rarity": "rare"
  },
  {
    "id": "amars_contempt",
    "name": "Amar's Contempt",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damage": 15.0,
      "slash": 5.0
    },
    "description": "+90% Melee Damage\\n+30% Slash",
    "rarity": "rare"
  },
  {
    "id": "auger_strike",
    "name": "Auger Strike",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "puncture": 20
    },
    "description": "+120% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "avenging_truth",
    "name": "Avenging Truth",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 12.5,
      "syndicatePower": 1.0
    },
    "description": "Blocking absorbs 50% of incoming damage, stored as Extra Damage for the next charge attack., +1 'Truth'",
    "rarity": "rare"
  },
  {
    "id": "berserker_fury",
    "name": "Berserker Fury",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 5.8333,
      "duration": 1.666667
    },
    "description": "On Melee Kill:\\n+35% Attack Speed for 10s. Stacks up to 2x.",
    "rarity": "rare"
  },
  {
    "id": "blade_of_truth",
    "name": "Blade Of Truth",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 25,
      "syndicatePower": 1.0
    },
    "description": "+100% Melee Damage, +1 'Truth'",
    "rarity": "rare"
  },
  {
    "id": "boreals_contempt",
    "name": "Boreal's Contempt",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damage": 15.0,
      "statusDamage": 10.0
    },
    "description": "+90% Melee Damage\\n+60% Status Damage",
    "rarity": "rare"
  },
  {
    "id": "bright_purity",
    "name": "Bright Purity",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 25,
      "syndicatePower": 1.0
    },
    "description": "+100% Melee Damage, +1 'Purity'",
    "rarity": "rare"
  },
  {
    "id": "burning_hate",
    "name": "Burning Hate",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "weapon",
    "stats": {
      "damage": 20.0
    },
    "description": "When Hate damages enemies inflicted with <DT_FIRE_COLOR>Heat Status, they become vulnerable to 120% more Status Damage.",
    "rarity": "rare"
  },
  {
    "id": "buzz_kill",
    "name": "Buzz Kill",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "slash": 20
    },
    "description": "+120% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "carnis_mandible",
    "name": "Carnis Mandible",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "slash": 15,
      "statusChance": 10
    },
    "description": "+90% <DT_SLASH_COLOR>Slash, +60% Status Chance",
    "rarity": "common"
  },
  {
    "id": "collision_force",
    "name": "Collision Force",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "impact": 20
    },
    "description": "+120% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "combo_fury",
    "name": "Combo Fury",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "magazine": 16.6667,
      "reloadSpeed": 16.666667,
      "duration": 2.0
    },
    "description": "On Melee Kill:\\n+100% Reload Speed\\n+100% Magazine Capacity for 12s on Secondary Weapon",
    "rarity": "rare"
  },
  {
    "id": "combo_killer",
    "name": "Combo Killer",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboDuration": 0.83,
      "duration": 0.833333
    },
    "description": "+5s Combo Duration, On Kill with Secondary Weapon:\\nReset Melee Combo Timer",
    "rarity": "uncommon"
  },
  {
    "id": "conditions_perfection",
    "name": "Condition's Perfection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 25.0
    },
    "description": "Enables Tennokai. Increases status chance by +100% on Tennokai attacks.",
    "rarity": "uncommon"
  },
  {
    "id": "counterweight",
    "name": "Counterweight",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_IMPACT_COLOR>Impact",
    "rarity": "uncommon"
  },
  {
    "id": "disciplines_merit",
    "name": "Discipline's Merit",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {},
    "description": "Enables Tennokai. Opportunities occur every 4 melee hits instead of at random.",
    "rarity": "rare"
  },
  {
    "id": "dispatch_overdrive",
    "name": "Dispatch Overdrive",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 10,
      "duration": 2.5
    },
    "description": "On Heavy Attack Hit:\\n+60% Movement Speed for 15s",
    "rarity": "uncommon"
  },
  {
    "id": "dreamers_wrath",
    "name": "Dreamer's Wrath",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 12.5
    },
    "description": "Enables Tennokai. Increases opportunity chance by 50% and critical damage by 32% for Tennokai attacks.",
    "rarity": "rare"
  },
  {
    "id": "electromagnetic_shielding",
    "name": "Electromagnetic Shielding",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 8.333333,
      "range": 2.0
    },
    "description": "While blocking, redirect 50% of damage taken by allies within 12m to yourself.",
    "rarity": "uncommon"
  },
  {
    "id": "enduring_affliction",
    "name": "Enduring Affliction",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 16.6667
    },
    "description": "+100% Status Chance on Lifted enemies",
    "rarity": "uncommon"
  },
  {
    "id": "enduring_strike",
    "name": "Enduring Strike",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboCountChance": 5.0
    },
    "description": "+20% Additional Combo Count Chance on Lifted enemies",
    "rarity": "common"
  },
  {
    "id": "entropy_detonation",
    "name": "Entropy Detonation",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 5.0,
      "range": 2.5,
      "syndicatePower": 1.0
    },
    "description": "Lethal ground attacks cause enemies to explode dealing +1,000, (+20% Enemy Max Health) <DT_EXPLOSION_COLOR>Blast Damage, in a +10m radius., +1 'Entropy'",
    "rarity": "rare"
  },
  {
    "id": "entropy_flight",
    "name": "Entropy Flight",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "projectileSpeed": 35,
      "syndicatePower": 1.0
    },
    "description": "+140% Projectile Speed, +1 'Entropy'",
    "rarity": "rare"
  },
  {
    "id": "explosive_demise",
    "name": "Explosive Demise",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "explosionDamage": 50.0
    },
    "description": "Enemies killed explode, dealing 300 Damage shortly after death.",
    "rarity": "rare"
  },
  {
    "id": "focus_radon",
    "name": "Focus Radon",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "radiation": 15,
      "heavyAttackEfficiency": 10.0
    },
    "description": "+60% <DT_RADIATION_COLOR>Radiation, +40% Heavy Attack Efficiency",
    "rarity": "rare"
  },
  {
    "id": "focused_defense",
    "name": "Focused Defense",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "blockAngle": 5.0
    },
    "description": "+20 Parry Angle",
    "rarity": "common"
  },
  {
    "id": "galvanized_elementalist",
    "name": "Galvanized Elementalist",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusDamage": 7.272727,
      "statusChance": 2.7273,
      "duration": 1.818182
    },
    "description": "+80% Status Damage\\nOn Melee Kill:\\n+30% Status Chance for 20s. Stacks up to 4x.",
    "rarity": "rare"
  },
  {
    "id": "galvanized_reflex",
    "name": "Galvanized Reflex",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "duration": 1.818182,
      "heavyAttackEfficiency": 4.545455
    },
    "description": "+50% Heavy Attack Efficiency\\nOn Melee Kill:\\n+20 Initial Combo for 20s. Stacks up to 4x.",
    "rarity": "rare"
  },
  {
    "id": "galvanized_steel",
    "name": "Galvanized Steel",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 2.7273,
      "criticalChance": 10.0,
      "duration": 1.818182
    },
    "description": "+110% Critical Chance (x2 for Heavy Attacks)\\nOn Melee Kill:\\n+30% Critical Damage for 20s. Stacks up to 4x.",
    "rarity": "rare"
  },
  {
    "id": "guardian_derision",
    "name": "Guardian Derision",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboCountChance": 5
    },
    "description": "Blocking taunts enemies within 15 meters to target you instead of allies., +30% Combo Count Chance while Blocking",
    "rarity": "rare"
  },
  {
    "id": "harrowed_hook",
    "name": "Harrowed Hook",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "duration": 0.5
    },
    "description": "With Melee Weapon equipped, unchanneled hits slow target and disable jump for +2s.",
    "rarity": "rare"
  },
  {
    "id": "heartseeker",
    "name": "Heartseeker",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": -12.5,
      "range": 0.25
    },
    "description": "Lock onto targets within 1m, but reduces blocking effectiveness., -50% Damage Block",
    "rarity": "rare"
  },
  {
    "id": "heavy_trauma",
    "name": "Heavy Trauma",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "hunters_bonesaw",
    "name": "Hunter's Bonesaw",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "finisherDamage": 20.0
    },
    "description": "Increase Finisher Damage by 120% against prone enemies.",
    "rarity": "uncommon"
  },
  {
    "id": "impenetrable_offense",
    "name": "Impenetrable Offense",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": -2.5
    },
    "description": "+30% Damage Block, -10% Melee Damage",
    "rarity": "rare"
  },
  {
    "id": "jagged_edge",
    "name": "Jagged Edge",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "slash": 15
    },
    "description": "+90% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "jugulus_barbs",
    "name": "Jugulus Barbs",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "puncture": 15,
      "statusChance": 10
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture, +60% Status Chance",
    "rarity": "common"
  },
  {
    "id": "justice_blades",
    "name": "Justice Blades",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 25,
      "syndicatePower": 1.0
    },
    "description": "+100% Melee Damage, +1 'Justice'",
    "rarity": "rare"
  },
  {
    "id": "lasting_sting",
    "name": "Lasting Sting",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusDuration": 10
    },
    "description": "+110% Status Duration",
    "rarity": "common"
  },
  {
    "id": "magnetic_rush",
    "name": "Magnetic Rush",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "magnetic": 15,
      "attackSpeed": 5
    },
    "description": "+60% <DT_MAGNETIC_COLOR>Magnetic, +20% Attack Speed",
    "rarity": "rare"
  },
  {
    "id": "maiming_strike",
    "name": "Maiming Strike",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalChance": 25
    },
    "description": "+150% Critical Chance for Slide Attack",
    "rarity": "rare"
  },
  {
    "id": "mark_of_the_beast",
    "name": "Mark Of The Beast",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 20,
      "duration": 4.0,
      "criticalChance": 20.0
    },
    "description": "On 6 Melee Kills within 6s:\\n\\n+120% Status and Critical Chance for Secondary Weapon for 24s",
    "rarity": "rare"
  },
  {
    "id": "martial_fury",
    "name": "Martial Fury",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 5,
      "energy": -12.5
    },
    "description": "+20% Attack Speed, -50% Energy Rate",
    "rarity": "rare"
  },
  {
    "id": "masters_edge",
    "name": "Master's Edge",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 10.0
    },
    "description": "Enables Tennokai. Increases Tennokai damage by 60%.",
    "rarity": "uncommon"
  },
  {
    "id": "melee_elementalist",
    "name": "Melee Elementalist",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusDamage": 15,
      "heavyAttackSpeed": 10
    },
    "description": "+90% Status Damage, +60% Heavy Attack Wind Up Speed",
    "rarity": "uncommon"
  },
  {
    "id": "melee_prowess",
    "name": "Melee Prowess",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 15
    },
    "description": "+90% Status Chance",
    "rarity": "common"
  },
  {
    "id": "mentors_legacy",
    "name": "Mentor's Legacy",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 0,
    "category": "melee",
    "subCategory": "",
    "stats": {},
    "description": "Enables Tennokai.",
    "rarity": "uncommon"
  },
  {
    "id": "mortal_conduct",
    "name": "Mortal Conduct",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 15,
      "duration": 2.0
    },
    "description": "At Less than 50 Health:\\n+60% Damage taken is reflected when Blocking attacks while Channeling for 8s",
    "rarity": "rare"
  },
  {
    "id": "motus_impact",
    "name": "Motus Impact",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "range": 0.5
    },
    "description": "Increase range of aerial melee attacks by +2m.",
    "rarity": "uncommon"
  },
  {
    "id": "niras_contempt",
    "name": "Nira's Contempt",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {
      "damage": 15.0,
      "statusChance": 10.0
    },
    "description": "+90% Melee Damage\\n+60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "opportunitys_reach",
    "name": "Opportunity's Reach",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "duration": 1.0,
      "range": 0.75
    },
    "description": "Enables Tennokai. Increases opportunity window to 4.0s and melee range by 3m for Tennokai attacks.",
    "rarity": "uncommon"
  },
  {
    "id": "power_throw",
    "name": "Power Throw",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.3333,
      "damage": 16.666667
    },
    "description": "+2 Punch Through, On Consecutive throw (Max stacks 3):\\n+100% Throw Damage",
    "rarity": "rare"
  },
  {
    "id": "primed_heavy_trauma",
    "name": "Primed Heavy Trauma",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+165% <DT_IMPACT_COLOR>Impact",
    "rarity": "legendary"
  },
  {
    "id": "primed_smite_corpus",
    "name": "Primed Smite Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.55 Damage to Corpus",
    "rarity": "legendary"
  },
  {
    "id": "primed_smite_grineer",
    "name": "Primed Smite Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.55 Damage to Grineer",
    "rarity": "legendary"
  },
  {
    "id": "primed_smite_infested",
    "name": "Primed Smite Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.55 Damage to Infested",
    "rarity": "legendary"
  },
  {
    "id": "primed_smite_orokin",
    "name": "Primed Smite Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.55 Damage to Orokin",
    "rarity": "legendary"
  },
  {
    "id": "primed_smite_the_murmur",
    "name": "Primed Smite The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.55 Damage to Murmur",
    "rarity": "legendary"
  },
  {
    "id": "proton_snap",
    "name": "Proton Snap",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 12.5,
      "damage": 25.0,
      "duration": 5.0
    },
    "description": "Hold Wall Latch for 2s to gain +100% <DT_POISON_COLOR>Toxin Damage,  and +50% Status Chance for 20s.",
    "rarity": "rare"
  },
  {
    "id": "quick_return",
    "name": "Quick Return",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "ricochetBounces": -4.0
    },
    "description": "-4 Bounce",
    "rarity": "common"
  },
  {
    "id": "rebound",
    "name": "Rebound",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "ricochetBounces": 4.0
    },
    "description": "+4 Bounce",
    "rarity": "common"
  },
  {
    "id": "relentless_assault",
    "name": "Relentless Assault",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "duration": 1.0,
      "energyOnKill": 0.5
    },
    "description": "On Kill:\\n+2 Energy Rate for 4s",
    "rarity": "rare"
  },
  {
    "id": "rending_strike",
    "name": "Rending Strike",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "slash": 15,
      "puncture": 20
    },
    "description": "+60% <DT_SLASH_COLOR>Slash, +80% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "rift_strike",
    "name": "Rift Strike",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "range": 4.166667
    },
    "description": "Heavy attacks now step through the rift to attack enemies up to 25m away",
    "rarity": "uncommon"
  },
  {
    "id": "sacrificial_pressure",
    "name": "Sacrificial Pressure",
    "polarity": "umbra",
    "drain": 6,
    "maxRank": 10,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 10,
      "sentientDamage": 3
    },
    "description": "+110% Melee Damage, x1.33 Damage to Sentients",
    "rarity": "legendary"
  },
  {
    "id": "saxum_thorax",
    "name": "Saxum Thorax",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "impact": 15,
      "statusChance": 10
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact, +60% Status Chance",
    "rarity": "common"
  },
  {
    "id": "seismic_wave",
    "name": "Seismic Wave",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 50.0
    },
    "description": "+200% Slam Attack Damage",
    "rarity": "uncommon"
  },
  {
    "id": "serrated_edges",
    "name": "Serrated Edges",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "uncommon"
  },
  {
    "id": "sharpened_blade",
    "name": "Sharpened Blade",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_SLASH_COLOR>Slash",
    "rarity": "uncommon"
  },
  {
    "id": "smite_orokin",
    "name": "Smite Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.3 Damage to Orokin",
    "rarity": "uncommon"
  },
  {
    "id": "smite_the_murmur",
    "name": "Smite The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.3 Damage to Murmur",
    "rarity": "uncommon"
  },
  {
    "id": "stand_ground",
    "name": "Stand Ground",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damageReduction": 10.0
    },
    "description": "Blocking reduces damage taken from enemy abilities by 60%.",
    "rarity": "rare"
  },
  {
    "id": "static_discharge",
    "name": "Static Discharge",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "damage": 13.333333
    },
    "description": "Heavy Attacks electrify nearby enemies for <DT_ELECTRICITY_COLOR>Electricity Damage equal to 80% of weapon damage.",
    "rarity": "rare"
  },
  {
    "id": "strain_infection",
    "name": "Strain Infection",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 5
    },
    "description": "Melee Attacks gain +20% Critical Damage per Cyst.",
    "rarity": "rare"
  },
  {
    "id": "sundering_strike",
    "name": "Sundering Strike",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "puncture": 15
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "sword_alone",
    "name": "Sword Alone",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 7.5
    },
    "description": "With Melee Equipped:\\n+10% Mobility\\n+30% Sprint Speed",
    "rarity": "rare"
  },
  {
    "id": "toxic_blight",
    "name": "Toxic Blight",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "toxin": 25,
      "syndicatePower": 1.0
    },
    "description": "+100% <DT_POISON_COLOR>Toxin, +1 'Blight'",
    "rarity": "rare"
  },
  {
    "id": "true_punishment",
    "name": "True Punishment",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboDuration": -12.5,
      "comboCountChance": 25.0
    },
    "description": "+100% Additional Combo Count Chance, -50% Combo Duration",
    "rarity": "common"
  },
  {
    "id": "vicious_frost",
    "name": "Vicious Frost",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "virulent_scourge",
    "name": "Virulent Scourge",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "volatile_quick_return",
    "name": "Volatile Quick Return",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "explosionChance": 25.0,
      "ricochetBounces": -4.0
    },
    "description": "-4 Bounce, +3 Blast Radius, +100% Chance to explode on Bounce (Disables Punch Through)",
    "rarity": "uncommon"
  },
  {
    "id": "volatile_rebound",
    "name": "Volatile Rebound",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "explosionChance": 25.0
    },
    "description": "+100% Chance to explode on Bounce (Disables Punch Through)",
    "rarity": "rare"
  },
  {
    "id": "volcanic_edge",
    "name": "Volcanic Edge",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 15,
      "heat": 15.0
    },
    "description": "+60% <DT_FIRE_COLOR>Heat, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "voltaic_strike",
    "name": "Voltaic Strike",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "vulcan_blitz",
    "name": "Vulcan Blitz",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "health": 10.0,
      "range": 1.0
    },
    "description": "Enemies explode on death, dealing 300 <DT_EXPLOSION_COLOR>Blast Damage (+60% Enemy Max Health) in a 6m radius.",
    "rarity": "uncommon"
  },
  {
    "id": "whirlwind",
    "name": "Whirlwind",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 30
    },
    "description": "+180% Projectile Speed",
    "rarity": "rare"
  },
  {
    "id": "drifting_contact_r3",
    "name": "Drifting Contact",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "comboDuration": 2.5,
      "statusChance": 10,
      "duration": 2.5
    },
    "description": "+10s Combo Duration, +40% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "energy_channel_r10",
    "name": "Energy Channel",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 33.333333
    },
    "description": "Converts 200% of Energy used to up to 200 Bonus Damage on next Melee Attack.",
    "rarity": "rare"
  },
  {
    "id": "fever_strike_r3",
    "name": "Fever Strike",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "toxin": 15
    },
    "description": "+90% <DT_POISON_COLOR>Toxin",
    "rarity": "uncommon"
  },
  {
    "id": "finishing_touch_r10",
    "name": "Finishing Touch",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 10.0,
      "finisherDamage": 10.0
    },
    "description": "+60% Finisher Damage",
    "rarity": "uncommon"
  },
  {
    "id": "focus_energy_r3",
    "name": "Focus Energy",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "heavyAttackEfficiency": 10.0
    },
    "description": "+40% Heavy Attack Efficiency, +60% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "rare"
  },
  {
    "id": "fury_r3",
    "name": "Fury",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 5
    },
    "description": "+30% Attack Speed",
    "rarity": "uncommon"
  },
  {
    "id": "molten_impact_r3",
    "name": "Molten Impact",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "heat": 15
    },
    "description": "+90% <DT_FIRE_COLOR>Heat",
    "rarity": "uncommon"
  },
  {
    "id": "north_wind_r3",
    "name": "North Wind",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "cold": 15
    },
    "description": "+90% <DT_FREEZE_COLOR>Cold",
    "rarity": "uncommon"
  },
  {
    "id": "organ_shatter_r3",
    "name": "Organ Shatter",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 15
    },
    "description": "+90% Critical Damage",
    "rarity": "common"
  },
  {
    "id": "pressure_point_r3",
    "name": "Pressure Point",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 20.0
    },
    "description": "+20% Melee Damage per rank (max +120% at rank 5)",
    "rarity": "common"
  },
  {
    "id": "quickening_r3",
    "name": "Quickening",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 10,
      "comboCountChance": 5.0
    },
    "description": "+40% Attack Speed, +20% Combo Count Chance",
    "rarity": "rare"
  },
  {
    "id": "reach_r3",
    "name": "Reach",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "range": 0.25
    },
    "description": "+1.5 Range",
    "rarity": "common"
  },
  {
    "id": "reflex_coil_r3",
    "name": "Reflex Coil",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "heavyAttackEfficiency": 10.0
    },
    "description": "+60% Heavy Attack Efficiency",
    "rarity": "uncommon"
  },
  {
    "id": "relentless_combination_r3",
    "name": "Relentless Combination",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "damage": 25.0
    },
    "description": "+100% chance to increase Melee Combo Counter when <DT_SLASH_COLOR>Slash Status deals damage.",
    "rarity": "uncommon"
  },
  {
    "id": "shocking_touch_r3",
    "name": "Shocking Touch",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "electricity": 15
    },
    "description": "+90% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "uncommon"
  },
  {
    "id": "smite_corpus_r3",
    "name": "Smite Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.3 Damage to Corpus",
    "rarity": "uncommon"
  },
  {
    "id": "smite_grineer_r3",
    "name": "Smite Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.3 Damage to Grineer",
    "rarity": "uncommon"
  },
  {
    "id": "smite_infested_r3",
    "name": "Smite Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.3 Damage to Infested",
    "rarity": "uncommon"
  },
  {
    "id": "spoiled_strike_r3",
    "name": "Spoiled Strike",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "attackSpeed": -5,
      "damage": 25.0
    },
    "description": "+100% Melee Damage, -20% Attack Speed",
    "rarity": "rare"
  },
  {
    "id": "tek_gravity_r3",
    "name": "Tek Gravity",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Slam Attacks in the Marked Zone pull all enemies within 20m.",
    "rarity": "rare"
  },
  {
    "id": "true_steel_r3",
    "name": "True Steel",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "criticalChance": 20
    },
    "description": "+120% Critical Chance (x2 for Heavy Attacks)",
    "rarity": "common"
  },
  {
    "id": "truths_flame",
    "name": "Truth's Flame",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "duration": 1.5,
      "syndicatePower": 1.0
    },
    "description": "Enables Tennokai.\\nTennokai kills grant an additional 4s Tennokai opportunity and increase Tennokai damage by 120%.\\n\\nCURSE: Suffer 100 Heat Damage/s for 6s.\\n+1 'Truth'",
    "rarity": "rare"
  },
  {
    "id": "weeping_wounds_r5",
    "name": "Weeping Wounds",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "melee",
    "subCategory": "",
    "stats": {
      "statusChance": 6.6667
    },
    "description": "+40% Status Chance per Combo Multiplier",
    "rarity": "uncommon"
  },
  {
    "id": "abundant_mutation",
    "name": "Abundant Mutation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "cooldown": 7.5,
      "mutationStackBonus": 75.0
    },
    "description": "Passive Augment: Nidus gains an additional 300 max stacks of Mutation (500 total). Undying has a 30s cooldown.",
    "rarity": "rare",
    "warframeId": "nidus"
  },
  {
    "id": "adaptation",
    "name": "Adaptation",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 0.909091,
      "duration": 1.818182,
      "damageResistancePerStack": 0.909091,
      "damageResistanceCap": 90.0
    },
    "description": "When Damaged:\\n+10% Resistance to that Damage Type for 20s. Stacks up to 90%.",
    "rarity": "rare"
  },
  {
    "id": "adept_surge",
    "name": "Adept Surge",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 2.5,
      "health": -6.25
    },
    "description": "+10% Mobility, -25 Health",
    "rarity": "uncommon"
  },
  {
    "id": "adrenaline_boost",
    "name": "Adrenaline Boost",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energy": 12.5,
      "health": -5
    },
    "description": "+50% Energy, -20% Health",
    "rarity": "rare"
  },
  {
    "id": "aegis_gale",
    "name": "Aegis Gale",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 3.75
    },
    "description": "Aegis Storm Augment: Balefire has an Alternate Fire during Aegis Storm. The blast deals 15% of Hildryn's Max Shield as additional damage.",
    "rarity": "rare",
    "warframeId": "hildryn"
  },
  {
    "id": "aero_vantage",
    "name": "Aero Vantage",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "gravityReduction": -25.0
    },
    "description": "-100% Gravity while Aim Gliding",
    "rarity": "uncommon"
  },
  {
    "id": "agility_drift",
    "name": "Agility Drift",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "accuracy": -1.0,
      "damageReduction": 2.0
    },
    "description": "Reduced damage by 12% while airborne, <LOWER_IS_BETTER>-6% Enemy Accuracy when targeting Warframe",
    "rarity": "rare"
  },
  {
    "id": "air_thrusters",
    "name": "Air Thrusters",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "slideSpeed": 25.0
    },
    "description": "+100% Slide Boost when Airborne, -20% Mobility",
    "rarity": "uncommon"
  },
  {
    "id": "airburst_rounds",
    "name": "Airburst Rounds",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 3.5
    },
    "description": "Airburst Augment: Each enemy hit by Airburst increases secondary damage by 40% for 14s.",
    "rarity": "rare",
    "warframeId": "zephyr"
  },
  {
    "id": "ambush",
    "name": "Ambush",
    "polarity": "penjaga",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 60.0,
      "duration": 0.75
    },
    "description": "When Ghost invisibility is broken, Shade's owner is granted +240% Weapon Damage for 3s.",
    "rarity": "rare"
  },
  {
    "id": "anchored_glide",
    "name": "Anchored Glide",
    "polarity": "exilus",
    "drain": 2,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityStrength": 2.5
    },
    "description": "Disable Zephyr's reduced airborne gravity. Increase Ability Strength by 15%.",
    "rarity": "rare",
    "warframeId": "zephyr"
  },
  {
    "id": "anti_flak_plating",
    "name": "Anti-Flak Plating",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damageReduction": 5.0,
      "parkourVelocity": -2.5
    },
    "description": "+20 <DT_EXPLOSION_COLOR>Blast Resistance, -10% Mobility",
    "rarity": "uncommon"
  },
  {
    "id": "anticipation",
    "name": "Anticipation",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "Immune to Knockdown for an additional +4s after being knocked down., Immune to Stagger for an additional +4s after being Staggered.",
    "rarity": "uncommon"
  },
  {
    "id": "antimatter_mine",
    "name": "Antimatter Mine",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 1.5
    },
    "description": "Antimatter Drop Augment: Creates a fully charged stationary orb that explodes after 6s or within enemy proximity.",
    "rarity": "rare",
    "warframeId": "nova"
  },
  {
    "id": "antitoxin",
    "name": "Antitoxin",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "toxin": 7.5
    },
    "description": "+82.5% <DT_POISON_COLOR>Toxin Resistance",
    "rarity": "uncommon"
  },
  {
    "id": "archon_continuity",
    "name": "Archon Continuity",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 5
    },
    "description": "+55% Ability Duration, Abilities that inflict a <DT_POISON_COLOR>Toxin status effect will also apply a <DT_CORROSIVE_COLOR>Corrosive status effect.",
    "rarity": "legendary"
  },
  {
    "id": "archon_flow",
    "name": "Archon Flow",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energy": 16.8182,
      "cooldown": 0.909091
    },
    "description": "+185% Energy Max, Enemies killed by <DT_FREEZE_COLOR>Cold Abilities have 10% chance to drop an Energy Orb. Cooldown: 10s",
    "rarity": "legendary"
  },
  {
    "id": "archon_intensify",
    "name": "Archon Intensify",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 2.727273,
      "duration": 0.909091
    },
    "description": "+30% Ability Strength\\nRestoring health with abilities grants +30% Ability Strength for 10s.",
    "rarity": "rare"
  },
  {
    "id": "archon_stretch",
    "name": "Archon Stretch",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityRange": 4.090909,
      "duration": 0.454545,
      "energyOnKill": 0.181818
    },
    "description": "Abilities that deal <DT_ELECTRICITY_COLOR>Electricity Damage restore +2 Energy/s over 5s.",
    "rarity": "rare"
  },
  {
    "id": "archon_vitality",
    "name": "Archon Vitality",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 9.0909
    },
    "description": "+100% Health, Status Effects from abilities that deal <DT_FIRE_COLOR>Heat Damage will be applied twice.",
    "rarity": "legendary"
  },
  {
    "id": "armored_acrobatics",
    "name": "Armored Acrobatics",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 5,
      "sprintSpeed": -2.5,
      "damage": 5.0
    },
    "description": "+20% Damage Resistance during Bullet Jump, -10% Mobility",
    "rarity": "uncommon"
  },
  {
    "id": "armored_evade",
    "name": "Armored Evade",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 10,
      "sprintSpeed": -2.5,
      "damage": 10.0
    },
    "description": "+40% Damage Resistance while Dodging, -10% Mobility",
    "rarity": "uncommon"
  },
  {
    "id": "armored_recovery",
    "name": "Armored Recovery",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 12.5,
      "sprintSpeed": -5,
      "damage": 12.5,
      "slideSpeed": -5.0
    },
    "description": "+50% Damage Resistance when knocked down, -20% Slide",
    "rarity": "uncommon"
  },
  {
    "id": "augmented_sonar",
    "name": "Augmented Sonar",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 2.5
    },
    "description": "Sonar Augment: Affected enemies also become visible through walls for 10s.",
    "rarity": "rare"
  },
  {
    "id": "aviator",
    "name": "Aviator",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damageReduction": 10.0
    },
    "description": "Reduced damage by 60% while airborne",
    "rarity": "common"
  },
  {
    "id": "axios_javelineers",
    "name": "Axios Javelineers",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "vortexDuration": 5,
      "vortexBonusOnHit": 5,
      "duration": 1.25
    },
    "description": "Axios Javelin Augment: Spawns specters that throw two extra javelins with guaranteed vortexes. Direct hits add +5s vortex duration (scales with Duration). Base vortex duration 5s at max rank.",
    "rarity": "rare",
    "warframeId": "styanax"
  },
  {
    "id": "battering_maneuver",
    "name": "Battering Maneuver",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "impact": 10,
      "bulletJump": 10.0
    },
    "description": "+18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_IMPACT_COLOR>Impact on Bullet Jump",
    "rarity": "uncommon"
  },
  {
    "id": "biting_frost",
    "name": "Biting Frost",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "Augment",
    "subCategory": "",
    "stats": {
      "criticalChance": 50,
      "criticalMultiplier": 50
    },
    "description": "Passive Augment: +200% Critical Chance and +200% Critical Damage against enemies frozen by 10 Cold status effects.",
    "rarity": "rare",
    "warframeId": "frost"
  },
  {
    "id": "blinding_reave",
    "name": "Blinding Reave",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 10,
      "duration": 2.5
    },
    "description": "Reave Augment: Reave gains +40% range and enemies are blinded by its fog for 10s.",
    "rarity": "rare",
    "warframeId": "revenant"
  },
  {
    "id": "brief_respite",
    "name": "Brief Respite",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": 25.0
    },
    "description": "On Ability Cast:\\nSquad converts 150% of Energy spent to Shields while Overshields are inactive",
    "rarity": "uncommon"
  },
  {
    "id": "calculated_spring",
    "name": "Calculated Spring",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 6.25,
      "sprintSpeed": -2.5
    },
    "description": "-10% Mobility, +25% Health",
    "rarity": "uncommon"
  },
  {
    "id": "carnis_carapace",
    "name": "Carnis Carapace",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 9.1667,
      "health": 3.3333
    },
    "description": "+55% Armor, +20% Health",
    "rarity": "uncommon"
  },
  {
    "id": "cataclysmic_gate",
    "name": "Cataclysmic Gate",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 2.5
    },
    "description": "Sol Gate Augment : Wisp and 2 spectral images cast a single blast of Sol Gate, leaving an area with 500 <DT_FIRE_COLOR>Heat Damage / Second with guaranteed Heat and Radiation Status Effects for 10s. ",
    "rarity": "rare"
  },
  {
    "id": "catalyzing_shields",
    "name": "Catalyzing Shields",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 0.3325
    },
    "description": "x0.20 Max Shield Capacity, 1.33s Full Shield Gate immunity duration",
    "rarity": "rare"
  },
  {
    "id": "cathode_current",
    "name": "Cathode Current",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 50.0
    },
    "description": "Cathode Grace Augment: Eliminating an enemy while Cathode Grace is active will release an additional discharge from Rotorswell with 200% Damage and extend its duration by the same amount.",
    "rarity": "rare",
    "warframeId": "gyre"
  },
  {
    "id": "champions_blessing",
    "name": "Champion's Blessing",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 7.5
    },
    "description": "Blessing Augment: Gain Primary and Secondary Critical Chance for 30s for each percent you heal on allies up to 350%.",
    "rarity": "rare"
  },
  {
    "id": "coaction_drift",
    "name": "Coaction Drift",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "auraStrengthSquad": 2.5,
      "auraStrengthSelf": 2.5
    },
    "description": "Squad benefits +15% more from Auras, You benefit an additional +15% from Auras",
    "rarity": "rare"
  },
  {
    "id": "coil_recharge",
    "name": "Coil Recharge",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {},
    "description": "Coil Horizon Augment: Gyratory Sphere can be recalled. Enemies in its radius suffer 500 <DT_ELECTRICITY_COLOR> Electricity Damage and chain other enemies. Enemies pulled into detonation suffer additional discharges.",
    "rarity": "rare",
    "warframeId": "gyre"
  },
  {
    "id": "combat_discipline",
    "name": "Combat Discipline",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "You lose <LOWER_IS_BETTER>10 Health on kill\\nSquadmates gain 20 Health on kill",
    "rarity": "rare"
  },
  {
    "id": "conductive_sphere",
    "name": "Conductive Sphere",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "electricity": 18.75,
      "damage": 18.75
    },
    "description": "Arcsphere Augment: Projectiles that pass through Arcsphere have guaranteed <DT_ELECTRICITY_COLOR>Electricity Status Effect and +75% <DT_ELECTRICITY_COLOR>Electricity Damage.",
    "rarity": "rare",
    "warframeId": "gyre"
  },
  {
    "id": "constitution",
    "name": "Constitution",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 7,
      "knockdownRecovery": 10.0
    },
    "description": "+40% Faster Knockdown Recovery, +28% Ability Duration",
    "rarity": "rare"
  },
  {
    "id": "controlled_slide",
    "name": "Controlled Slide",
    "polarity": "zenurik",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 2.5
    },
    "description": "Disable Nezha's passive ability. Increase Ability Strength by 15%.",
    "rarity": "rare"
  },
  {
    "id": "damage_decoy",
    "name": "Damage Decoy",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 87.5
    },
    "description": "Decoy Augment: Decoy can be cast on enemies. Enemies who attack that decoy receive 5 random Status Effects, and the reflected damage is increased by 350%.",
    "rarity": "rare"
  },
  {
    "id": "dark_propagation",
    "name": "Dark Propagation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 3.75
    },
    "description": "Sow Augment: Enemies killed while inflicted with Sow spread its effect in a 15m radius. Shadow's Death Harvest also inflicts Sow.",
    "rarity": "rare",
    "warframeId": "sevagoth"
  },
  {
    "id": "dead_eye",
    "name": "Dead Eye",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 8.75
    },
    "description": "Squad receives +52.5% Sniper Rifle Damage",
    "rarity": "uncommon"
  },
  {
    "id": "deceptive_bond",
    "name": "Deceptive Bond",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 12.5
    },
    "description": "Decoy Augment: 50% of damage Loki takes is transferred to Decoy, and vice versa.",
    "rarity": "rare",
    "warframeId": "loki"
  },
  {
    "id": "defiled_reckoning",
    "name": "Defiled Reckoning",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 2.5
    },
    "description": "Reckoning Augment: Health Orbs become unusable by enemies for 10s.",
    "rarity": "rare",
    "warframeId": "oberon"
  },
  {
    "id": "diamond_skin",
    "name": "Diamond Skin",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "radiation": 7.5
    },
    "description": "+82.5% <DT_RADIATION_COLOR>Radiation Resistance",
    "rarity": "uncommon"
  },
  {
    "id": "discharge_strike",
    "name": "Discharge Strike",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "energyLeech": 6.25
    },
    "description": "Soul Punch Augment: Depletes up to 25 Energy from the target.",
    "rarity": "rare",
    "warframeId": "nekros"
  },
  {
    "id": "divine_retribution",
    "name": "Divine Retribution",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 3.5
    },
    "description": "Divine Spears Augment: Status Effects spread to all speared enemies. Spear explosions scale by 1.5x of remaining <DT_SLASH_COLOR>Slash, <DT_POISON_COLOR>Toxin and <DT_FIRE_COLOR>Heat Status Effects. Base Radius is 14m.",
    "rarity": "rare",
    "warframeId": "nezha"
  },
  {
    "id": "emp_aura",
    "name": "EMP Aura",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "accuracy": -2.5
    },
    "description": "Enemy Corpus lose -15% Accuracy",
    "rarity": "uncommon"
  },
  {
    "id": "empowered_blades",
    "name": "Empowered Blades",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "statusChance": 10.0
    },
    "description": "Squad receives +60% Status Chance and Status Damage on Heavy Attacks, but lose <LOWER_IS_BETTER>90 Shields per hit.",
    "rarity": "rare"
  },
  {
    "id": "endless_lullaby",
    "name": "Endless Lullaby",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 12.5
    },
    "description": "Lull Augment: Performing a finisher on or killing a sleeping enemy will retrigger Lull for 100% of the remaining duration.\\nPassive: +50% Lull Duration.",
    "rarity": "rare"
  },
  {
    "id": "endurance_drift",
    "name": "Endurance Drift",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energyMax": 1.67,
      "parkourVelocity": 2,
      "energy": 1.666667
    },
    "description": "+10% Energy Max, +12% Parkour Velocity",
    "rarity": "rare"
  },
  {
    "id": "energy_nexus",
    "name": "Energy Nexus",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energyOnKill": 0.5
    },
    "description": "Warframe receives +3 Energy Regen/s",
    "rarity": "rare"
  },
  {
    "id": "enraged",
    "name": "Enraged",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "criticalChance": 87.5,
      "cooldown": 3.75,
      "duration": 3.75
    },
    "description": "Hysteria Augment: Damage increased by 350%, Critical Chance increased by 350%. Hysteria lasts for 15s, and receives a matching cooldown.",
    "rarity": "rare",
    "warframeId": "valkyr"
  },
  {
    "id": "equilibrium",
    "name": "Equilibrium",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energy": 8,
      "health": 10.0
    },
    "description": "Health pickups give +110% Energy. Energy pickups give +110% Health.",
    "rarity": "uncommon"
  },
  {
    "id": "eternal_war",
    "name": "Eternal War",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 0.5
    },
    "description": "Warcry Augment: While active, Warcry's duration is increased by 2s for each Melee Kill.",
    "rarity": "rare",
    "warframeId": "valkyr"
  },
  {
    "id": "final_act",
    "name": "Final Act",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 7.5,
      "duration": 2.0
    },
    "description": "On Low Health:\\n+30% Ability Strength\\n+30% Casting Speed for 8s",
    "rarity": "rare"
  },
  {
    "id": "firewalker",
    "name": "Firewalker",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "heat": 25,
      "bulletJump": 25.0
    },
    "description": "+24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_FIRE_COLOR>Heat on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "follow_through",
    "name": "Follow Through",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energyOnKill": 2.5
    },
    "description": "On Respawn:\\n+10 Energy",
    "rarity": "uncommon"
  },
  {
    "id": "funnel_clouds",
    "name": "Funnel Clouds",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityProjectileCount": 2.0
    },
    "description": "Tornado Augment: Creates 8 additional tornadoes. All tornadoes are 50% their original size and won't pick up enemies.",
    "rarity": "rare",
    "warframeId": "zephyr"
  },
  {
    "id": "fused_crucible",
    "name": "Fused Crucible",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {},
    "description": "Crucible Blast Augment: Becomes a channeled ability consuming <LOWER_IS_BETTER>20 <ENERGY> Energy/s that ramps up. While active Chyrinka Pillars trigger chain reactions and their duration is frozen. Mobility is greatly reduced.",
    "rarity": "rare",
    "warframeId": "qorvex"
  },
  {
    "id": "gale_kick",
    "name": "Gale Kick",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 25.0
    },
    "description": "+100% of Melee Damage converted to <DT_IMPACT_COLOR>Impact Damage on Jump Kick, knocking down nearby enemies on kill.",
    "rarity": "rare"
  },
  {
    "id": "gastro",
    "name": "Gastro",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 2.0,
      "ricochetBounces": 3.0
    },
    "description": "Regurgitate Augment: Regurgitated enemies bounce up to 3 times, creating gas clouds that last 8s and inflict nearby enemies with <DT_GAS_COLOR> Gas Status Effect.",
    "rarity": "rare",
    "warframeId": "grendel"
  },
  {
    "id": "gladiator_finesse",
    "name": "Gladiator Finesse",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 10.0
    },
    "description": "Drains Energy to stop Lethal Damage with 60% Efficiency.",
    "rarity": "rare"
  },
  {
    "id": "growing_power",
    "name": "Growing Power",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "On Status Effect with Weapon: Squad increases personal Ability Strength by 25% for 6s.",
    "rarity": "rare"
  },
  {
    "id": "guardian_armor",
    "name": "Guardian Armor",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "health": 18.75,
      "duration": 0.25
    },
    "description": "Vex Armor Augment: Chroma reduces the damage his squadmates within <AFFINITY_SHARE>Affinity Range take by 75%. Squad kills restore 5% of his Health over 3s and increases Vex Armor duration by 1s.",
    "rarity": "rare",
    "warframeId": "chroma"
  },
  {
    "id": "hallowed_eruption",
    "name": "Hallowed Eruption",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityDuration": 50.0
    },
    "description": "Hallowed Ground Augment: Reactivate to deal all Remaining Damage and <DT_RADIATION_COLOR>Radiation Status.\\nPassive: +200% Hallowed Ground Duration.",
    "rarity": "rare",
    "warframeId": "oberon"
  },
  {
    "id": "hallowed_reckoning",
    "name": "Hallowed Reckoning",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 0.75,
      "damage": 10.0
    },
    "description": "Reckoning Augment: Reckoning gains +40% range. A 3m radius around each affected enemy grants bonus armor to allies and deals 300 damage per second to enemies.",
    "rarity": "rare",
    "warframeId": "oberon"
  },
  {
    "id": "hastened_steps",
    "name": "Hastened Steps",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 5,
      "shield": -5
    },
    "description": "+20% Sprint Speed, -20% Shield Capacity",
    "rarity": "rare"
  },
  {
    "id": "heavy_impact",
    "name": "Heavy Impact",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "range": 1.0,
      "explosionDamage": 50.0
    },
    "description": "Create 11m seismic shockwaves from heavy landings, dealing 550 Damage and knocking foes off their feet.",
    "rarity": "uncommon"
  },
  {
    "id": "heightened_reflexes",
    "name": "Heightened Reflexes",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": -5
    },
    "description": "+20% Casting Speed, -20% Ability Efficiency",
    "rarity": "rare"
  },
  {
    "id": "holster_amp",
    "name": "Holster Amp",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 10.0,
      "duration": 0.5
    },
    "description": "On Equip:\\nSquad gains 60% Weapon Damage for 3s",
    "rarity": "uncommon"
  },
  {
    "id": "hysterical_assault",
    "name": "Hysterical Assault",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 12.5,
      "sprintSpeed": 12.5,
      "range": 12.5,
      "duration": 1.25
    },
    "description": "Hysteria Augment: Attack with Valkyr\u2019s Talons to leap onto targeted enemies up to 50m away. Gain +50% Parkour Velocity and +50% Sprint Speed for 5s.",
    "rarity": "rare",
    "warframeId": "valkyr"
  },
  {
    "id": "hysterical_fixation",
    "name": "Hysterical Fixation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shield": 5.0
    },
    "description": "Hysteria Augment: While Hysteria is active, each kill restores 20% Maximum Shields.",
    "rarity": "rare",
    "warframeId": "valkyr"
  },
  {
    "id": "ice_spring",
    "name": "Ice Spring",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "cold": 25,
      "bulletJump": 25.0
    },
    "description": "+24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_FREEZE_COLOR>Cold on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "immolated_radiance",
    "name": "Immolated Radiance",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damageReduction": 12.5
    },
    "description": "Immolation Augment: Allies within Affinity range will receive 50% of Immolation's Damage Reduction.",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "insatiable",
    "name": "Insatiable",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "mutationStackChance": 15.0
    },
    "description": "Ravenous Augment: Nidus has a chance for additional Mutation stacks while in the infestation. The base 60% chance increases with power strength, and multiple stacks are possible above 100%.",
    "rarity": "rare",
    "warframeId": "nidus"
  },
  {
    "id": "intrepid_stand",
    "name": "Intrepid Stand",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "overguardSelf": 60,
      "overguardAlly": 30,
      "overguardCap": 15000
    },
    "description": "Final Stand Augment: Each javelin that damages an enemy grants 60 Overguard to Styanax and 30 to allies in Affinity Range. Overguard cap 15,000 (scales with Strength).",
    "rarity": "rare",
    "warframeId": "styanax"
  },
  {
    "id": "intruder",
    "name": "Intruder",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 2.0
    },
    "description": "+2s to Hacking",
    "rarity": "common"
  },
  {
    "id": "ironclad_flight",
    "name": "Ironclad Flight",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damageReduction": 10.0
    },
    "description": "Disable vacuum in Razorwing. Reduced Damage by 40% while Airborne.",
    "rarity": "rare",
    "warframeId": "titania"
  },
  {
    "id": "jades_judgment",
    "name": "Jade's Judgment",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "spawnChance": 1.25,
      "duration": 0.75
    },
    "description": "Light's Judgment Augment: Enemies damaged by the well have a 5% chance per hit to spawn a Jade Light above them, damaging them for 3s. Spawn chance scales with Ability Strength; beam duration scales with Ability Duration.",
    "rarity": "rare",
    "warframeId": "jade"
  },
  {
    "id": "jet_stream",
    "name": "Jet Stream",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 10.0,
      "projectileSpeed": 25.0
    },
    "description": "Turbulence Augment: Turbulence increases Movement Speed by 40% and Projectile Speed by 100% for Zephyr and her allies.",
    "rarity": "rare",
    "warframeId": "zephyr"
  },
  {
    "id": "jugulus_carapace",
    "name": "Jugulus Carapace",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 9.1667,
      "health": 3.3333
    },
    "description": "+55% Armor, +20% Health",
    "rarity": "uncommon"
  },
  {
    "id": "kavats_grace",
    "name": "Kavat's Grace",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "hardLandingReduction": 25.0
    },
    "description": "Falling is 100% less likely to result in a hard landing.",
    "rarity": "rare"
  },
  {
    "id": "kinetic_collision",
    "name": "Kinetic Collision",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "Speed Augment: Running into an opponent increases the duration of Speed by 4s.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "larva_burst",
    "name": "Larva Burst",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 2.0
    },
    "description": "Larva Augment: Reactivate Larva to detonate and deal 600 Toxin Damage in a 8m radius. This damage and Status Effect stacks for every enemy grabbed by the Larva.",
    "rarity": "rare",
    "warframeId": "nidus"
  },
  {
    "id": "lasting_covenant",
    "name": "Lasting Covenant",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 0.75
    },
    "description": "Covenant Augment: Headshot kills increase Critical Chance bonus duration by 3s.",
    "rarity": "rare",
    "warframeId": "harrow"
  },
  {
    "id": "lightning_dash",
    "name": "Lightning Dash",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "electricity": 25,
      "bulletJump": 25.0
    },
    "description": "+24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_ELECTRICITY_COLOR>Electricity on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "lingering_transmutation",
    "name": "Lingering Transmutation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 3.75
    },
    "description": "Transmutation Probe Augment: Probe returns to cast position after reaching max range, and remains nearby for 15s. Recall Probe by recasting. Recast again to end.",
    "rarity": "rare"
  },
  {
    "id": "loot_detector",
    "name": "Loot Detector",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Minimap shows loot crates.\\nSquad receives +30m Loot Radar",
    "rarity": "uncommon"
  },
  {
    "id": "loyal_merulina",
    "name": "Loyal Merulina",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "cooldown": 0.5
    },
    "description": "Merulina Augment: Yareli no longer rides Merulina. Instead, Merulina follows her and casts Sea Snare on nearby enemies. 2s cooldown.",
    "rarity": "rare"
  },
  {
    "id": "maglev",
    "name": "Maglev",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "slideSpeed": 5.0,
      "slideFriction": -5.0
    },
    "description": "+20% Slide, -20% Friction",
    "rarity": "uncommon"
  },
  {
    "id": "master_thief",
    "name": "Master Thief",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "lockerUnlockChance": 10.0
    },
    "description": "+60% chance to unlock locked lockers.",
    "rarity": "rare"
  },
  {
    "id": "melee_guidance",
    "name": "Melee Guidance",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 2.0
    },
    "description": "You lose <LOWER_IS_BETTER>6s Melee Combo Duration\\nSquadmates gain 12s Melee Combo Duration",
    "rarity": "rare"
  },
  {
    "id": "mesmer_shield",
    "name": "Mesmer Shield",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 12.5
    },
    "description": "Mesmer Skin Augment: Revenant receives +50% Mesmer Skin Strength and allies within Affinity Range are granted a maximum of 5 charges.",
    "rarity": "rare",
    "warframeId": "revenant"
  },
  {
    "id": "motus_signal",
    "name": "Motus Signal",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "bulletJump": 50.0
    },
    "description": "Increase Double Jump strength by +200%.",
    "rarity": "common"
  },
  {
    "id": "natural_talent",
    "name": "Natural Talent",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "castSpeed": 12.5
    },
    "description": "Improves Casting Speed on Warframe abilities if applicable.\\n+50% Casting Speed",
    "rarity": "rare"
  },
  {
    "id": "negation_armor",
    "name": "Negation Armor",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "cooldown": 7.5
    },
    "description": "Scarab Shell Augment: When Inaros takes fatal damage, he consumes Scarab Shell to heal with a brief invulnerability that ends with a deadly <DT_SLASH_COLOR>Slash Status Effect. Cooldown <LOWER_IS_BETTER>30s.",
    "rarity": "rare",
    "warframeId": "inaros"
  },
  {
    "id": "no_current_leap",
    "name": "No Current Leap",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 2.5
    },
    "description": "+10% Mobility, 0 Energy Rate",
    "rarity": "uncommon"
  },
  {
    "id": "omikujis_fortune",
    "name": "Omikuji's Fortune",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "cooldown": 1.0
    },
    "description": "Omikuji Augment: Reduce Omikuji's Cooldown by 4s when you kill an enemy with the weapon affected by Koumei's Passive.",
    "rarity": "rare",
    "warframeId": "koumei"
  },
  {
    "id": "overcharge_detectors",
    "name": "Overcharge Detectors",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Exposes enemies at maximum Energy Capacity within 30m.",
    "rarity": "uncommon"
  },
  {
    "id": "overcharged",
    "name": "Overcharged",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "overshieldConversion": 16.666667,
      "energyMax": 8.333333
    },
    "description": "On Respawn:\\nConverts up to 50 Energy to Overshields at a rate of 100%.",
    "rarity": "rare"
  },
  {
    "id": "pain_threshold",
    "name": "Pain Threshold",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "knockdownRecovery": 40.0
    },
    "description": "+160% Faster Stagger Recovery",
    "rarity": "rare"
  },
  {
    "id": "parasitic_vitality",
    "name": "Parasitic Vitality",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 1.0
    },
    "description": "Parasitic Link Augment: Nidus and any ally he's bound to gain 4% Max Health per Mutation during Parasitic Link.",
    "rarity": "rare"
  },
  {
    "id": "peaceful_provocation",
    "name": "Peaceful Provocation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 10.0
    },
    "description": "Pacify & Provoke Augment: Pacify converts damage done to allies into an aura that slows enemies by 40%. Provoke converts damage done to enemies into 15% extra Ability Strength.",
    "rarity": "rare",
    "warframeId": "equinox"
  },
  {
    "id": "phoenix_renewal",
    "name": "Phoenix Renewal",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "health": 12.5,
      "duration": 15.0
    },
    "description": "Renewal Augment: Taking fatal damage while under the effects of Renewal will instead Heal you or allies to 50% Health. This effect triggers only once for each ally every 60s.",
    "rarity": "rare",
    "warframeId": "oberon"
  },
  {
    "id": "piercing_step",
    "name": "Piercing Step",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "puncture": 10,
      "bulletJump": 10.0
    },
    "description": "+18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_PUNCTURE_COLOR>Puncture on Bullet Jump",
    "rarity": "uncommon"
  },
  {
    "id": "pistol_scavenger",
    "name": "Pistol Scavenger",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Squad receives +150% Pistol Ammo Recovery",
    "rarity": "uncommon"
  },
  {
    "id": "power_drift",
    "name": "Power Drift",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 2.5,
      "knockdownResistance": 5.0
    },
    "description": "+15% Ability Strength, +30% Chance to Resist Knockdown",
    "rarity": "rare"
  },
  {
    "id": "power_of_three",
    "name": "Power Of Three",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "extraEnergyCost": 5,
      "abilityProjectileCount": 3
    },
    "description": "Quiver Augment: Quiver fires three arrows and consumes <LOWER_IS_BETTER>20 more Energy.",
    "rarity": "rare",
    "warframeId": "ivara"
  },
  {
    "id": "precision_intensify",
    "name": "Precision Intensify",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 15
    },
    "description": "+90% Ability Strength for your 4th Ability",
    "rarity": "rare"
  },
  {
    "id": "prey_of_dynar",
    "name": "Prey Of Dynar",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damageVulnerability": 12.5,
      "spreadRadiusBonus": 37.5
    },
    "description": "Shroud of Dynar Augment: Increase an enemy\u2019s Damage Vulnerability by 50%. Using Fang of Raksh on that enemy increases its spread radius by 150%.",
    "rarity": "rare",
    "warframeId": "voruna"
  },
  {
    "id": "primed_streamline",
    "name": "Primed Streamline",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 14,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 3.666667
    },
    "description": "+55% Ability Efficiency",
    "rarity": "legendary"
  },
  {
    "id": "primed_vigor",
    "name": "Primed Vigor",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 6.8182,
      "shield": 6.8182
    },
    "description": "+75% Shield Capacity, +75% Health",
    "rarity": "legendary"
  },
  {
    "id": "prism_guard",
    "name": "Prism Guard",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "Prism Augment: Prism follows above Mirage. Duration changed to 4s.",
    "rarity": "rare",
    "warframeId": "mirage"
  },
  {
    "id": "prismatic_companion",
    "name": "Prismatic Companion",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityDuration": 12.5
    },
    "description": "Prismatic Gem Augment: The gem now attaches to your free-moving companion. \\nPassive : +50% Prismatic Gem Duration.",
    "rarity": "rare",
    "warframeId": "citrine"
  },
  {
    "id": "prolonged_paralysis",
    "name": "Prolonged Paralysis",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 1.25
    },
    "description": "Paralysis Augment: Affected enemies are pulled towards Valkyr and the stun duration is increased by 5s.",
    "rarity": "rare",
    "warframeId": "valkyr"
  },
  {
    "id": "proton_pulse",
    "name": "Proton Pulse",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "bulletJump": 25.0
    },
    "description": "Wall Dashing grants +100% Bullet Jump Speed.",
    "rarity": "common"
  },
  {
    "id": "provoked",
    "name": "Provoked",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 10
    },
    "description": "+110% Damage during Bleedout",
    "rarity": "uncommon"
  },
  {
    "id": "purging_slash",
    "name": "Purging Slash",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shield": 17.5
    },
    "description": "Slash Dash Augment: Allies in the path of Slash Dash have 4 debuffs removed and 70% Shields restored.",
    "rarity": "rare",
    "warframeId": "excalibur"
  },
  {
    "id": "purifying_flames",
    "name": "Purifying Flames",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "Fire Blast Augment: Allies hit by the expanding ring of fire are cured of Status Effects and granted 4s of Status Immunity.",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "push_&_pull",
    "name": "Push & Pull",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 1.5
    },
    "description": "Metamorphosis Augment: Switching to Day-form staggers enemies within 6m and knocks them down when switching to Night-form.",
    "rarity": "rare",
    "warframeId": "equinox"
  },
  {
    "id": "quick_charge",
    "name": "Quick Charge",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": -5
    },
    "description": "-20% Shield Recharge Delay, -20 Shield Capacity",
    "rarity": "rare"
  },
  {
    "id": "quick_thinking",
    "name": "Quick Thinking",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 40.0
    },
    "description": "Drains Energy to stop Lethal Damage with 240% Efficiency.",
    "rarity": "rare"
  },
  {
    "id": "rage",
    "name": "Rage",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 6.666667
    },
    "description": "Convert +60% of Damage on Health to Energy. Without Shields, ally Overguard imitates Health.",
    "rarity": "rare"
  },
  {
    "id": "rapid_resilience",
    "name": "Rapid Resilience",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "statusDuration": -12.5
    },
    "description": "-75% Status Duration on Self",
    "rarity": "rare"
  },
  {
    "id": "razor_mortar",
    "name": "Razor Mortar",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "electricity": 17.5,
      "fireRate": 17.5,
      "duration": 1.5
    },
    "description": "Razor Gyre Augment: Groups enemies together, while Lethal Progeny's Ortholysts focus fire on those enemies with +70% <DT_ELECTRICITY_COLOR>Electricity Damage and Fire Rate for 6s.",
    "rarity": "rare"
  },
  {
    "id": "ready_steel",
    "name": "Ready Steel",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Squad begins the mission with +24 Initial Combo",
    "rarity": "uncommon"
  },
  {
    "id": "recharge_barrier",
    "name": "Recharge Barrier",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shield": 8.75
    },
    "description": "Electric Shield Augment: Allies that pass through have 35% Shields restored.",
    "rarity": "rare",
    "warframeId": "volt"
  },
  {
    "id": "recrystalize",
    "name": "Recrystalize",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 4.0
    },
    "description": "Crystallize Augment: Enemies killed by crystalline growths stagger and spread the crystals to enemies within 16m.",
    "rarity": "rare",
    "warframeId": "citrine"
  },
  {
    "id": "reflection",
    "name": "Reflection",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "blockStaggerChance": 12.216667,
      "blockStunChance": 3.05
    },
    "description": "+73.3% chance to Stagger on Block, +18.3% chance to Stun on Block",
    "rarity": "uncommon"
  },
  {
    "id": "rending_turn",
    "name": "Rending Turn",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "slash": 10,
      "bulletJump": 10.0
    },
    "description": "+18% to Parkour Velocity, +18% Aim Glide/Wall Latch Duration, +60% <DT_SLASH_COLOR>Slash on Bullet Jump",
    "rarity": "uncommon"
  },
  {
    "id": "repair_dispensary",
    "name": "Repair Dispensary",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "health": 5.0,
      "incapacitationTimerReduction": 3.0
    },
    "description": "Dispensary Augment: Dispensary also creates pick ups that heal companions for 20% of their maximum health and reduce their incapacitation timer by 12 sec.",
    "rarity": "rare",
    "warframeId": "protea"
  },
  {
    "id": "resilient_focus",
    "name": "Resilient Focus",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 5
    },
    "description": "+20% Damage Resistance on Stun",
    "rarity": "rare"
  },
  {
    "id": "retribution",
    "name": "Retribution",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 15.0
    },
    "description": "+90% Chance to deal Electrical Damage when shield struck by melee enemies., +120 <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "rare"
  },
  {
    "id": "reverse_rotorswell",
    "name": "Reverse Rotorswell",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 8.75
    },
    "description": "Rotorswell Augment: 35% of damage received is redirected toward the instigator as <DT_ELECTRICITY_COLOR> Electricity Damage.",
    "rarity": "rare"
  },
  {
    "id": "rifle_scavenger",
    "name": "Rifle Scavenger",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Squad receives +150% Rifle Ammo Recovery",
    "rarity": "uncommon"
  },
  {
    "id": "rime_vault",
    "name": "Rime Vault",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 0,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Ice FX on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "rising_skill",
    "name": "Rising Skill",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 2.5,
      "shield": -7.5
    },
    "description": "+10% Mobility, -30 Shield Capacity",
    "rarity": "uncommon"
  },
  {
    "id": "rolling_guard",
    "name": "Rolling Guard",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "cooldown": 0.636364,
      "duration": 0.272727
    },
    "description": "On Dodge:\\nBecome invulnerable for 3s and remove all Status Effects. <LOWER_IS_BETTER>7s cooldown.",
    "rarity": "rare"
  },
  {
    "id": "rousing_plunder",
    "name": "Rousing Plunder",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 12.5
    },
    "description": "Plunder Augment: Plunder gains 50% max <DT_CORROSIVE_COLOR>Corrosive Damage and Armor, and heals allies within Affinity range for 50 Health.",
    "rarity": "rare",
    "warframeId": "hydroid"
  },
  {
    "id": "rubble_heap",
    "name": "Rubble Heap",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {},
    "description": "Passive Augment: When above 1400 Rubble, Landslide costs no Energy, deals 2x Damage, and travels 2x faster.",
    "rarity": "rare",
    "warframeId": "atlas"
  },
  {
    "id": "sapping_reach",
    "name": "Sapping Reach",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "energyLeech": 6.25
    },
    "description": "Pull Augment: Steals up to 25 Energy from the target.",
    "rarity": "rare",
    "warframeId": "mag"
  },
  {
    "id": "saxum_carapace",
    "name": "Saxum Carapace",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 9.1667,
      "health": 3.3333
    },
    "description": "+55% Armor, +20% Health",
    "rarity": "uncommon"
  },
  {
    "id": "searing_leap",
    "name": "Searing Leap",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 0,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Fire FX on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "shadow_haze",
    "name": "Shadow Haze",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "critBonusPerKill": 12.5
    },
    "description": "Reap Augment: Increase Critical Chance by 50% on enemies inflicted with Death Harvest. A new Shadow emerges from those enemies when they perish. Limit of 3 Shadows.",
    "rarity": "rare",
    "warframeId": "sevagoth"
  },
  {
    "id": "shattered_storm",
    "name": "Shattered Storm",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityStrength": 25.0
    },
    "description": "Shattered Lash Augment: When Gara breaks her Mass Vitrify ring with Shattered Lash, enemies struck by the glass suffer Splinter Storm at 100% Strength.",
    "rarity": "rare",
    "warframeId": "gara"
  },
  {
    "id": "shepherd",
    "name": "Shepherd",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Squad's Companions receive +300 Health and +180 Armor",
    "rarity": "rare"
  },
  {
    "id": "shield_overload",
    "name": "Shield Overload",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 2.25
    },
    "description": "Polarize Augment: Increases the time for the target's Shields to regenerate by 9s.",
    "rarity": "rare",
    "warframeId": "mag"
  },
  {
    "id": "shock_absorbers",
    "name": "Shock Absorbers",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "+30% Physical Damage Resistance",
    "rarity": "rare"
  },
  {
    "id": "shotgun_scavenger",
    "name": "Shotgun Scavenger",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Squad receives +150% Shotgun Ammo Recovery",
    "rarity": "uncommon"
  },
  {
    "id": "signal_flare",
    "name": "Signal Flare",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 3.0
    },
    "description": "Radial Blind Augment: Blinded enemies are marked on the Minimap for 12s.",
    "rarity": "rare",
    "warframeId": "excalibur"
  },
  {
    "id": "singularity",
    "name": "Singularity",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 0.75,
      "range": 3.75
    },
    "description": "Absorb Augment: Create a ring every 3s that drags in enemies at 15m/s.",
    "rarity": "rare",
    "warframeId": "nyx"
  },
  {
    "id": "smite_infusion",
    "name": "Smite Infusion",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 25.0,
      "range": 3.75,
      "duration": 10.0
    },
    "description": "Smite Augment: Hold to cast will grant all allies within 15m an additional 100% <DT_RADIATION_COLOR>Radiation Damage to their attacks for 40s.",
    "rarity": "rare",
    "warframeId": "oberon"
  },
  {
    "id": "sniper_scavenger",
    "name": "Sniper Scavenger",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Squad receives +150% Sniper Rifle Ammo Recovery",
    "rarity": "uncommon"
  },
  {
    "id": "spectral_spirit",
    "name": "Spectral Spirit",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "cooldown": 0.25
    },
    "description": "Grave Spirit Augment: Immediately assume Spectral Form. 100% chance for weapons and abilities to apply Doom. Kills outside of Spectral Form decrease its cooldown by 1s.",
    "rarity": "rare",
    "warframeId": "dagath"
  },
  {
    "id": "stand_united",
    "name": "Stand United",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 4.166667
    },
    "description": "Squad receives +25% Armor",
    "rarity": "uncommon"
  },
  {
    "id": "stealth_drift",
    "name": "Stealth Drift",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "range": 3.0
    },
    "description": "+18m Enemy Radar, +12% Aim Glide/Wall Latch Duration",
    "rarity": "rare"
  },
  {
    "id": "strain_consume",
    "name": "Strain Consume",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 1.0,
      "range": 2.5
    },
    "description": "Dead Maggots within 10m are consumed, increasing Max Health by 4% and increasing Health Regen by 2/sec for 45sec.",
    "rarity": "rare"
  },
  {
    "id": "streamlined_form",
    "name": "Streamlined Form",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "slideSpeed": 5.0,
      "slideFriction": -5.0
    },
    "description": "+30% Slide, -30% Friction",
    "rarity": "rare"
  },
  {
    "id": "summoners_wrath",
    "name": "Summoner's Wrath",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 12.5
    },
    "description": "Squad receives 75% Companion and Summon Damage",
    "rarity": "uncommon"
  },
  {
    "id": "surplus_diverters",
    "name": "Surplus Diverters",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energyOnKill": 1.0
    },
    "description": "Gain +6 energy, upon replenishing shields completely after they have been deactivated.",
    "rarity": "rare"
  },
  {
    "id": "swift_momentum",
    "name": "Swift Momentum",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 1.0,
      "heavyAttackEfficiency": 5.0
    },
    "description": "Squad receives +30% Heavy Attack Wind Up Speed and +6s Melee Combo Duration",
    "rarity": "rare"
  },
  {
    "id": "swing_line",
    "name": "Swing Line",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 5
    },
    "description": "Rip Line Augment: Rip Lines has no Energy cost while Airborne., +20% Parkour Velocity",
    "rarity": "rare",
    "warframeId": "valkyr"
  },
  {
    "id": "tactical_retreat",
    "name": "Tactical Retreat",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "On Low Health:\\n+10% Mobility for 4s",
    "rarity": "rare"
  },
  {
    "id": "target_fixation",
    "name": "Target Fixation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 25.0,
      "duration": 0.5
    },
    "description": "Tail Wind Augment: Casting Tail Wind resets Zephyr\u2019s bullet jump. Each enemy hit increases Tail Wind Damage by 100%. Damage resets upon being on the ground for 2s.",
    "rarity": "rare",
    "warframeId": "zephyr"
  },
  {
    "id": "tear_gas",
    "name": "Tear Gas",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 1.0,
      "duration": 0.75
    },
    "description": "Smoke Screen Augment: Blinds enemies within 4m for 3s.",
    "rarity": "rare",
    "warframeId": "ash"
  },
  {
    "id": "teeming_virulence",
    "name": "Teeming Virulence",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "criticalChance": 30.0,
      "duration": 3.75
    },
    "description": "Virulence Augment: Hitting 4 enemies with Virulence grants 120% Primary Weapon Critical Chance for 15s.",
    "rarity": "rare",
    "warframeId": "nidus"
  },
  {
    "id": "teleport_rush",
    "name": "Teleport Rush",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 1.25
    },
    "description": "Teleport Augment: Using Teleport increases Parkour Velocity by 30% for 12s. Executing a target with Teleport extends Smoke Screen's duration by 5s. Teleport Mercy Kills fully refresh the duration.",
    "rarity": "rare",
    "warframeId": "ash"
  },
  {
    "id": "tempered_bound",
    "name": "Tempered Bound",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "parkourVelocity": -2.5,
      "shield": 7.5
    },
    "description": "-10% Mobility, +30 Shield Capacity",
    "rarity": "uncommon"
  },
  {
    "id": "temporal_artillery",
    "name": "Temporal Artillery",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {},
    "description": "Blaze Artillery Augment : When Temporal Anchor is activated, one existing Artillery unit will attach to Protea, halting its duration countdown. Max combo count is 20x.",
    "rarity": "rare",
    "warframeId": "protea"
  },
  {
    "id": "temporal_erosion",
    "name": "Temporal Erosion",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "armor": 2.5
    },
    "description": "Temporal Anchor Augment: While Temporal Anchor is active, each strike of Grenade Fan and Blaze Artillery strips 10% Armor from enemies.",
    "rarity": "rare",
    "warframeId": "protea"
  },
  {
    "id": "tesla_bank",
    "name": "Tesla Bank",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 2.0
    },
    "description": "Tesla Nervos Augment: While a target has a Nervos attached, any damage dealt to it will be absorbed by the Nervos and channeled into a 8m burst of <DT_ELECTRICITY_COLOR>Electricity on death.",
    "rarity": "rare",
    "warframeId": "vauban"
  },
  {
    "id": "tharros_lethality",
    "name": "Tharros Lethality",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 25.0
    },
    "description": "Tharros Strike Augment: Increases Critical Damage by 100% on enemies you hit. Critical Damage bonus is doubled for Spearguns.",
    "rarity": "rare"
  },
  {
    "id": "the_relentless_lost",
    "name": "The Relentless Lost",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 8.75
    },
    "description": "The Lost Augment: The Lost gains 35% Ability Strength and 15% Ability Efficiency when cast. The effect stacks up to 3x. Casting the same ability back-to-back resets the effect.",
    "rarity": "rare"
  },
  {
    "id": "thrall_pact",
    "name": "Thrall Pact",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 6.25
    },
    "description": "Enthrall Augment: Gain +25% Primary Weapon Damage for each active Thrall.",
    "rarity": "rare",
    "warframeId": "revenant"
  },
  {
    "id": "titanic_rumbler",
    "name": "Titanic Rumbler",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 75.0,
      "range": 3.75
    },
    "description": "Rumblers Augment: Create a single rumbler with 300% Health and 400% Damage.\\nReactivating will cause him to slam the floor and knockdown enemies in 15m.",
    "rarity": "rare",
    "warframeId": "atlas"
  },
  {
    "id": "toxic_flight",
    "name": "Toxic Flight",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "toxin": 25,
      "bulletJump": 25.0
    },
    "description": "+24.2% to Parkour Velocity, +24.2% Aim Glide/Wall Latch Duration, +275% <DT_POISON_COLOR>Toxin on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "tribunal",
    "name": "Tribunal",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "allyEffectPercent": 40
    },
    "description": "Condemn Augment: Other players will trigger 100% of the effects of Penance and Thurible when attacking chained enemies.",
    "rarity": "rare",
    "warframeId": "harrow"
  },
  {
    "id": "ulfruns_endurance",
    "name": "Ulfrun's Endurance",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Ulfrun's Descent Augment: During Ulfrun's attack, enemies that die from Slash Status within 20m restore Voruna's charges.",
    "rarity": "rare",
    "warframeId": "voruna"
  },
  {
    "id": "undying_will",
    "name": "Undying Will",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "bleedoutReduction": 7.0
    },
    "description": "+42% Bleedout Reduction",
    "rarity": "rare"
  },
  {
    "id": "untime_rift",
    "name": "Untime Rift",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "range": 3.75
    },
    "description": "The Vast Untime Augment: Creates a Rift that connects to enemies suffering from <DT_RADIANT_COLOR> Void Status Effect within 15m, doubling debuffs applied by The Vast Untime and maintaining <DT_RADIANT_COLOR> Void Status.",
    "rarity": "rare"
  },
  {
    "id": "valence_formation",
    "name": "Valence Formation",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 5.0
    },
    "description": "Passive Augment: Casting an Ability imbued with extra Elemental Damage applies that Element as a 200% bonus to your weapons with guaranteed Status for 20s.",
    "rarity": "rare"
  },
  {
    "id": "vampiric_grasp",
    "name": "Vampiric Grasp",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "healthRegen": 6.25
    },
    "description": "Grasp of Lohk Augment: When a stolen weapon deals damage to an enemy affected by The Lost: Gaze or The Vast Untime, Xaku heals by 25.",
    "rarity": "rare"
  },
  {
    "id": "venomous_rise",
    "name": "Venomous Rise",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 0,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Toxin FX on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "vigorous_swap",
    "name": "Vigorous Swap",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "damage": 15,
      "duration": 0.272727
    },
    "description": "On Equip:\\n+165% Damage for 3s",
    "rarity": "rare"
  },
  {
    "id": "viral_tempest",
    "name": "Viral Tempest",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "viral": 25.0
    },
    "description": "Tempest Barrage Augment: Each projectile has a 100% chance of inflicting a <DT_VIRAL_COLOR>Viral Status Effect.",
    "rarity": "rare",
    "warframeId": "hydroid"
  },
  {
    "id": "vital_systems_bypass",
    "name": "Vital Systems Bypass",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": 12.5
    },
    "description": "+1 Health Regen/s, +50% Shield Recharge Delay",
    "rarity": "rare"
  },
  {
    "id": "volatile_recompense",
    "name": "Volatile Recompense",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 6.25
    },
    "description": "Recompense Augment: Daggers whirl in a ring around Kullervo for 25s, slashing nearby foes and dealing <DT_EXPLOSION_COLOR>Blast Damage and Status Effect before returning to the ring.",
    "rarity": "rare"
  },
  {
    "id": "voltaic_lance",
    "name": "Voltaic Lance",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 0,
    "category": "warframe",
    "subCategory": "",
    "stats": {},
    "description": "Electrical FX on Bullet Jump",
    "rarity": "rare"
  },
  {
    "id": "ward_recovery",
    "name": "Ward Recovery",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 12.5
    },
    "description": "Warding Halo Augment: 50% of the casting cost returned based on how much protection is left.",
    "rarity": "rare",
    "warframeId": "nezha"
  },
  {
    "id": "warding_thurible",
    "name": "Warding Thurible",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 12.5
    },
    "description": "Thurible Augment: Allies in range take 50% less Damage while channeling Thurible and grant 1.0 additional Energy charge whenever damaged.",
    "rarity": "rare",
    "warframeId": "harrow"
  },
  {
    "id": "warm_coat",
    "name": "Warm Coat",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": 3
    },
    "description": "+18% Shield Resistance to Environmental Ice Hazards",
    "rarity": "common"
  },
  {
    "id": "warriors_rest",
    "name": "Warrior's Rest",
    "polarity": "zenurik",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 3.75
    },
    "description": "Passive Augment: Umbra's Ability Strength increases by +15% but he no longer fights independently alongside his Operator.",
    "rarity": "rare"
  },
  {
    "id": "worthy_comradery",
    "name": "Worthy Comradery",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "criticalChance": 12.5
    },
    "description": "Squad receives +75% Weak Point Critical Chance",
    "rarity": "uncommon"
  },
  {
    "id": "wrath_of_ukko",
    "name": "Wrath Of Ukko",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 1.5
    },
    "description": "Storm of Ukko Augment: Wrathful Advance moves the storm of daggers to the teleportation location and increases its duration by 6s.",
    "rarity": "rare"
  },
  {
    "id": "wrecking_wall",
    "name": "Wrecking Wall",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shield": 12.5
    },
    "description": "Containment Wall Augment: Strip 50% of armor and shields from struck enemies. Hitting 5 or more enemies will restart the duration of any Chyrinka Pillars and empower them.",
    "rarity": "rare",
    "warframeId": "qorvex"
  },
  {
    "id": "continuity_r3",
    "name": "Continuity",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityDuration": 5.0
    },
    "description": "+30% Ability Duration",
    "rarity": "rare"
  },
  {
    "id": "enemy_sense_r3",
    "name": "Enemy Sense",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "+55m Enemy Radar",
    "rarity": "rare"
  },
  {
    "id": "fast_deflection_r3",
    "name": "Fast Deflection",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": -7.5
    },
    "description": "+90% Shield Recharge\\n-45% Shield Recharge Delay",
    "rarity": "uncommon"
  },
  {
    "id": "flame_repellent_r3",
    "name": "Flame Repellent",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "heat": 10.0
    },
    "description": "+100% <DT_FIRE_COLOR>Heat Resistance",
    "rarity": "common"
  },
  {
    "id": "fleeting_expertise_r5",
    "name": "Fleeting Expertise",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 10,
      "abilityDuration": -10
    },
    "description": "+60% Ability Efficiency, -60% Ability Duration",
    "rarity": "rare"
  },
  {
    "id": "flow_r3",
    "name": "Flow",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energy": 16.666667
    },
    "description": "+100% Energy Max",
    "rarity": "rare"
  },
  {
    "id": "handspring_r10",
    "name": "Handspring",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "knockdownRecovery": 40.0
    },
    "description": "+240% Faster Knockdown Recovery",
    "rarity": "rare"
  },
  {
    "id": "insulation_r3",
    "name": "Insulation",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "cold": 10.0
    },
    "description": "+100% <DT_FREEZE_COLOR>Cold Resistance",
    "rarity": "common"
  },
  {
    "id": "intensify_r3",
    "name": "Intensify",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": 5
    },
    "description": "+55% Ability Strength",
    "rarity": "rare"
  },
  {
    "id": "lightning_rod_r3",
    "name": "Lightning Rod",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "electricity": 10.0
    },
    "description": "+100% <DT_ELECTRICITY_COLOR>Electricity Resistance",
    "rarity": "common"
  },
  {
    "id": "mecha_pulse_r3",
    "name": "Mecha Pulse",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 15,
      "duration": 5.0,
      "range": 7.5
    },
    "description": "Killing a Marked Enemy grants +60% Armor for 20s for each enemy within 30m.",
    "rarity": "rare"
  },
  {
    "id": "mobilize_r3",
    "name": "Mobilize",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 5.0
    },
    "description": "+20% to Parkour Velocity, +20% Aim Glide/Wall Latch Duration",
    "rarity": "uncommon"
  },
  {
    "id": "overextended_r5",
    "name": "Overextended",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityRange": 15,
      "abilityStrength": -10
    },
    "description": "+90% Ability Range, -60% Ability Strength",
    "rarity": "rare"
  },
  {
    "id": "parry_r3",
    "name": "Parry",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "finisherChance": 16.0
    },
    "description": "+96% chance to open enemies to Finisher Attacks after Warframe blocks Melee",
    "rarity": "common"
  },
  {
    "id": "power_donation_r5",
    "name": "Power Donation",
    "polarity": "madurai",
    "drain": -4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityStrength": -5.0
    },
    "description": "You lose <LOWER_IS_BETTER>30% Ability Strength\\nSquadmates gain 30% Ability Strength",
    "rarity": "rare"
  },
  {
    "id": "preparation_r10",
    "name": "Preparation",
    "polarity": "zenurik",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "energy": 9.090909
    },
    "description": "+100% Maximum Energy is filled on Spawn",
    "rarity": "rare"
  },
  {
    "id": "redirection_r3",
    "name": "Redirection",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "shield": 9.090909
    },
    "description": "+100% Shield Capacity",
    "rarity": "common"
  },
  {
    "id": "reflex_guard_r10",
    "name": "Reflex Guard",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "comboCountChance": 9.0909
    },
    "description": "+100% Combo Count Chance while Blocking",
    "rarity": "rare"
  },
  {
    "id": "rush_r3",
    "name": "Rush",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 5
    },
    "description": "+30% Sprint Speed",
    "rarity": "uncommon"
  },
  {
    "id": "steel_fiber_r3",
    "name": "Steel Fiber",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "armor": 9.090909
    },
    "description": "+100% Armor",
    "rarity": "common"
  },
  {
    "id": "streamline_r3",
    "name": "Streamline",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 5.0
    },
    "description": "+12% Ability Efficiency",
    "rarity": "rare"
  },
  {
    "id": "stretch_r3",
    "name": "Stretch",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityRange": 7.5
    },
    "description": "+45% Ability Range",
    "rarity": "uncommon"
  },
  {
    "id": "sure_footed_r5",
    "name": "Sure Footed",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "knockdownResistance": 10.0
    },
    "description": "+90% Chance to Resist Knockdown",
    "rarity": "rare"
  },
  {
    "id": "swift_bite_r3",
    "name": "Swift Bite",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "abilityRange": 7.5,
      "cooldown": 1.0
    },
    "description": "Ophidian Bite Augment: Reduce Ability Cooldowns by 4s when at least 4 enemies are hit. Ophidian Bite is granted 30% additional Ability Range.",
    "rarity": "rare"
  },
  {
    "id": "synth_reflex_r3",
    "name": "Synth Reflex",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "duration": 0.5,
      "bulletJump": 10.0
    },
    "description": "On Equip:\\n+40% Bullet Jump for 2s",
    "rarity": "rare"
  },
  {
    "id": "tek_collateral_r3",
    "name": "Tek Collateral",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 25
    },
    "description": "Increased Pistol Ammo recovery.\\n+100% Critical Damage when inside the Marked Zone.",
    "rarity": "rare"
  },
  {
    "id": "vigor_r5",
    "name": "Vigor",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 8.3333,
      "shield": 8.3333
    },
    "description": "+50% Shield Capacity, +50% Health",
    "rarity": "rare"
  },
  {
    "id": "vitality_r3",
    "name": "Vitality",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 10,
    "category": "warframe",
    "subCategory": "",
    "stats": {
      "health": 9.090909
    },
    "description": "+100% Health",
    "rarity": "common"
  },
  {
    "id": "acidic_spittle",
    "name": "Acidic Spittle",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 3.0,
      "range": 7.5
    },
    "description": "Every <LOWER_IS_BETTER>5s spit acidic tar at an enemy within 30m, blinding them for 12s and dealing 120 <DT_CORROSIVE_COLOR>Corrosive Damage.",
    "rarity": "rare"
  },
  {
    "id": "aerial_prospectus",
    "name": "Aerial Prospectus",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 4.5
    },
    "description": "Launches a beacon at an enemy within 27m that calls down an Orbital Strike dealing 1200 <DT_EXPLOSION_COLOR>Blast Damage in a 7m radius.",
    "rarity": "rare"
  },
  {
    "id": "anabolic_pollination",
    "name": "Anabolic Pollination",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 3.75
    },
    "description": "Release a cloud of spores that persists for 10s increasing <DT_POISON_COLOR>Toxin Damage by +100% for 15s.",
    "rarity": "rare"
  },
  {
    "id": "anti_grav_grenade",
    "name": "Anti-Grav Grenade",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 20.0,
      "range": 1.5,
      "duration": 1.5
    },
    "description": "A grenade that levitates enemies in a 6m. After 6s afflicted enemies come crashing down, causing  <DT_IMPACT_COLOR>Impact Damage equal to 80% of the damage taken while floating.",
    "rarity": "common"
  },
  {
    "id": "arc_coil",
    "name": "Arc Coil",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "statusChance": 1.666667,
      "range": 1.666667
    },
    "description": "Sentinel will zap up to 7 enemies within 10m, dealing 100 <DT_ELECTRICITY_COLOR>Electricity Damage with a 10% Status Chance.",
    "rarity": "common"
  },
  {
    "id": "auto_omni",
    "name": "Auto Omni",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 16.666667,
      "cooldown": 3.333333
    },
    "description": "Nautilus has 100% chance to repair nearby Railjack hull damages and extinguishes fires on Railjack. Cooldown: 20s.",
    "rarity": "common"
  },
  {
    "id": "bell_ringer",
    "name": "Bell Ringer",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "impactStatusStacks": 1.0
    },
    "description": "Melee attacks knock down enemies and apply +4 <DT_IMPACT_COLOR>Impact Status Effects",
    "rarity": "uncommon"
  },
  {
    "id": "blast_shield",
    "name": "Blast Shield",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 1.666667
    },
    "description": "Overshields increased by +3000. Leap at an enemy within 10m dealing 30 <DT_IMPACT_COLOR>Impact Damage and knocking down other enemies within 5m and resets Overshields.",
    "rarity": "common"
  },
  {
    "id": "botanist",
    "name": "Botanist",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 8.333333,
      "duration": 0.333333
    },
    "description": "Oxylus Sentinel will automatically pick any plants within 50m over <LOWER_IS_BETTER>2.0s.",
    "rarity": "rare"
  },
  {
    "id": "brute_conditioning",
    "name": "Brute Conditioning",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 35
    },
    "description": "+385% Melee Damage, Convert all base Physical Damage to <DT_IMPACT_COLOR>Impact Damage",
    "rarity": "uncommon"
  },
  {
    "id": "burning_claws",
    "name": "Burning Claws",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "statusChance": 30,
      "heat": 30.0
    },
    "description": "+330% <DT_FIRE_COLOR>Heat, +330% Status Chance, Converts all elemental damage from these claws to <DT_FIRE_COLOR>Heat damage",
    "rarity": "rare"
  },
  {
    "id": "calculated_shot",
    "name": "Calculated Shot",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 11.666667
    },
    "description": "Sentinel charges a powerful shot and fires at the first enemy within 70m.",
    "rarity": "common"
  },
  {
    "id": "chilling_claws",
    "name": "Chilling Claws",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "cold": 30,
      "statusChance": 30
    },
    "description": "+330% <DT_FREEZE_COLOR>Cold, +330% Status Chance, Converts all elemental damage from these claws to <DT_FREEZE_COLOR>Cold damage",
    "rarity": "rare"
  },
  {
    "id": "cordon",
    "name": "Cordon",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "cooldown": 2.5,
      "range": 5.0
    },
    "description": "Nautilus forces enemies within 30m of the target into clusters for easier targeting. Cooldown: 15s.",
    "rarity": "common"
  },
  {
    "id": "crescent_charge",
    "name": "Crescent Charge",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "health": 5.0,
      "range": 6.25
    },
    "description": "Charges an enemy within 25m dealing <DT_PUNCTURE_COLOR>Puncture Damage and lifting them. While lifted, enemy is flung at nearby foes dealing an additional 20% of the thrown enemy's health and adding 5 <DT_PUNCTURE_COLOR>Puncture Status to enemies within 5m.",
    "rarity": "rare"
  },
  {
    "id": "crescent_devolution",
    "name": "Crescent Devolution",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 7.5
    },
    "description": "Devolves into its larval form when downed and charges at enemies, dealing 100 <DT_PUNCTURE_COLOR>Puncture Damage. Regains true form after 30s.",
    "rarity": "rare"
  },
  {
    "id": "crowd_dispersion",
    "name": "Crowd Dispersion",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 1.666667,
      "explosionDamage": 1.666667
    },
    "description": "Unleashes a 10.0m radial knockdown when multiple enemies are nearby, dealing 10.0 Damage.",
    "rarity": "common"
  },
  {
    "id": "detect_vulnerability",
    "name": "Detect Vulnerability",
    "polarity": "penjaga",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "weakspotDamage": 45.833333333333336
    },
    "description": "Upon completing research on an enemy, subsequent scans will reveal their weak points.",
    "rarity": "rare"
  },
  {
    "id": "disabling_conditioning",
    "name": "Disabling Conditioning",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 35
    },
    "description": "+385% Melee Damage, Convert all base Physical Damage to <DT_PUNCTURE_COLOR>Puncture Damage",
    "rarity": "uncommon"
  },
  {
    "id": "diversified_denial",
    "name": "Diversified Denial",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 14.166667,
      "duration": 5.0
    },
    "description": "Fabricate 3 Specters that fight for 30s. Each deals 85% of the Hound's damage and cannot use Abilities.",
    "rarity": "rare"
  },
  {
    "id": "electro_pulse",
    "name": "Electro Pulse",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 0.833333,
      "range": 2.5
    },
    "description": "Every 5s, Sentinel will continually zap an enemy within 15m, trapping them in a stunned state.",
    "rarity": "common"
  },
  {
    "id": "endoparasitic_vector",
    "name": "Endoparasitic Vector",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 7.5,
      "duration": 1.25
    },
    "description": "Transmit an endoparasite to an enemy within 30m. Tentacles spawn from it, clinging to enemies within 10m slowing them as they move further from the parasite, and dealing 20 <DT_VIRAL_COLOR>Viral Damage/sec over 5s.",
    "rarity": "rare"
  },
  {
    "id": "equilibrium_audit",
    "name": "Equilibrium Audit",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 2.5
    },
    "description": "Unleashes a series of shockwaves that knockdown enemies within 15m and deal 300 damage.",
    "rarity": "rare"
  },
  {
    "id": "evasive_denial",
    "name": "Evasive Denial",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "heat": 12.5,
      "duration": 1.333333
    },
    "description": "Teleports a safe distance away and engages a displacement field gaining 75% chance to dodge enemy fire for 8s.",
    "rarity": "rare"
  },
  {
    "id": "fatal_attraction",
    "name": "Fatal Attraction",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "cooldown": 1.0,
      "range": 3.333333
    },
    "description": "Enemies within 20m are drawn to you. Once they are within 6m, they detonate for 250 Damage. Kill them before detonation to increase lure time and reduce cooldown.",
    "rarity": "common"
  },
  {
    "id": "fear_sense",
    "name": "Fear Sense",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 50,
      "range": 6.25,
      "duration": 6.25
    },
    "description": "The Kavat senses the weaknesses of enemies within 25m. For 25s, its attacks deal +200% damage and stagger with a 30% chance of knockdown.",
    "rarity": "uncommon"
  },
  {
    "id": "fired_up",
    "name": "Fired Up",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 0.833333,
      "duration": 0.833333
    },
    "description": "5% <DT_FIRE_COLOR>Heat Damage on weapon per hit. Stacks up to 100%. Resets after 5s with no hits.",
    "rarity": "rare"
  },
  {
    "id": "flame_gland",
    "name": "Flame Gland",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "statusChance": 15,
      "heat": 15.0
    },
    "description": "+60% <DT_FIRE_COLOR>Heat, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "focused_prospectus",
    "name": "Focused Prospectus",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 0.75
    },
    "description": "Fires a beam of energy that deals 900 <DT_FIRE_COLOR>Heat Damage over 4.5s.",
    "rarity": "rare"
  },
  {
    "id": "frost_jaw",
    "name": "Frost Jaw",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "ghost",
    "name": "Ghost",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 4.0
    },
    "description": "Cloaks owner when enemies are within 24m. The cloak is disrupted if owner attacks.",
    "rarity": "common"
  },
  {
    "id": "hastened_deflection",
    "name": "Hastened Deflection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "shield": -7.5
    },
    "description": "+90% Shield Recharge, -45% Shield Recharge Delay",
    "rarity": "uncommon"
  },
  {
    "id": "helminth_ferocity",
    "name": "Helminth Ferocity",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "finisherDamage": 20.0
    },
    "description": "+120% Finisher Damage",
    "rarity": "rare"
  },
  {
    "id": "iatric_mycelium",
    "name": "Iatric Mycelium",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 1.25
    },
    "description": "Release a trail of spores every <LOWER_IS_BETTER>8s that heal the companion and its allies for 300 health over 5s.",
    "rarity": "rare"
  },
  {
    "id": "immunity_resistance",
    "name": "Immunity Resistance",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "statusDamage": 12.5
    },
    "description": "+50% Status Damage",
    "rarity": "common"
  },
  {
    "id": "infectious_bite",
    "name": "Infectious Bite",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 50.0,
      "finisherDamage": 50.0
    },
    "description": "An attack that deals +200% Finisher Damage and infects the target with a Virus that grows 4 volatile pustules that react to damage and explode.",
    "rarity": "rare"
  },
  {
    "id": "investigator",
    "name": "Investigator",
    "polarity": "penjaga",
    "drain": 4,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 8.333333,
      "duration": 0.333333
    },
    "description": "Helios Sentinel will scan objects and enemies within 50m over 2.0s. This consumes Codex Scanner charges.",
    "rarity": "common"
  },
  {
    "id": "looter",
    "name": "Looter",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 3.666667
    },
    "description": "Emits a pulse wave to break open Loot Crates within 22m.",
    "rarity": "rare"
  },
  {
    "id": "loyal_retriever",
    "name": "Loyal Retriever",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "pickupDoubleChance": 2.1666666666666665
    },
    "description": "13% chance to double Credit and Resource pickups",
    "rarity": "uncommon"
  },
  {
    "id": "magnetic_strike",
    "name": "Magnetic Strike",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "impact": 25.0
    },
    "description": "100% Chance to apply a <DT_MAGNETIC_COLOR>Magnetic status effect when inflicting an <DT_IMPACT_COLOR>Impact status effect",
    "rarity": "common"
  },
  {
    "id": "martyr_symbiosis",
    "name": "Martyr Symbiosis",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "health": 10.0,
      "range": 6.25
    },
    "description": "Drains and stores 20 health from corpses within 25m up to 40% of your health. If your health falls below 10%, Companion downs itself to heal you.",
    "rarity": "rare"
  },
  {
    "id": "mecha_overdrive",
    "name": "Mecha Overdrive",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "statusDuration": 15,
      "statusChance": 10.0
    },
    "description": "+60% Primary Weapon Status Chance added to Companion, +90% Status Duration",
    "rarity": "rare"
  },
  {
    "id": "mischief",
    "name": "Mischief",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 3.75,
      "duration": 1.75
    },
    "description": "Smeeta Kavat becomes invisible for 9s every <LOWER_IS_BETTER>7s while a decoy kavat draws fire. Decoy has a 15% chance to evade damage and blinds nearby enemies on death.",
    "rarity": "rare"
  },
  {
    "id": "molecular_conversion",
    "name": "Molecular Conversion",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 1.666667
    },
    "description": "Blast enemies within 10m, converting 200 Damage into Shields for the Warframe.",
    "rarity": "common"
  },
  {
    "id": "null_audit",
    "name": "Null Audit",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 10.0
    },
    "description": "The Hound utilizes the same Aura and Abilities as an Eximus enemy for 60s, while stripping its Overguard by 50%.",
    "rarity": "rare"
  },
  {
    "id": "panzer_devolution",
    "name": "Panzer Devolution",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 7.5
    },
    "description": "Devolves into its larval form when downed and attacks enemies with quills, dealing 60 <DT_VIRAL_COLOR>Viral Damage each. Regains true form after 30s.",
    "rarity": "rare"
  },
  {
    "id": "paralytic_spores",
    "name": "Paralytic Spores",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 7.5,
      "duration": 2.5,
      "explosionDamage": 40.0
    },
    "description": "Charges at an enemy within 30m dealing 160 damage. This releases spores that affect enemies within 15m, opening them up to Melee Finishers, and slowing them by 50% for 10s.",
    "rarity": "rare"
  },
  {
    "id": "pounce",
    "name": "Pounce",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 22.5
    },
    "description": "The Kavat pounces at an enemy, dealing 90% Damage and stunning them for a short duration.",
    "rarity": "uncommon"
  },
  {
    "id": "proboscis",
    "name": "Proboscis",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 7.5,
      "explosionDamage": 25.0
    },
    "description": "Helminth Charger whips a proboscis out at an enemy within 30m, pulling them back and dealing 100 damage.",
    "rarity": "rare"
  },
  {
    "id": "prosperous_retriever",
    "name": "Prosperous Retriever",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "creditPickupDoubleChance": 3.0
    },
    "description": "18% chance to double Credit pickups",
    "rarity": "rare"
  },
  {
    "id": "reflex_denial",
    "name": "Reflex Denial",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 15.0,
      "duration": 1.666667,
      "range": 2.0
    },
    "description": "Generates a shield that reflects 90% Damage taken in pulses over 10s as <DT_MAGNETIC_COLOR>Magnetic Damage in a 12m radius.",
    "rarity": "rare"
  },
  {
    "id": "repo_audit",
    "name": "Repo Audit",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Emits a magnetic pulse that disarms enemies within 30m.",
    "rarity": "rare"
  },
  {
    "id": "resourceful_retriever",
    "name": "Resourceful Retriever",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "resourcePickupDoubleChance": 3.0
    },
    "description": "18% chance to double Resource pickups",
    "rarity": "rare"
  },
  {
    "id": "scan_matter",
    "name": "Scan Matter",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 15.0,
      "duration": 0.75
    },
    "description": "Reveals resource containers and mineral deposits within 60m. Automatically breaks containers and collects resources every 3s.",
    "rarity": "common"
  },
  {
    "id": "sepsis_claws",
    "name": "Sepsis Claws",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "toxin": 30,
      "statusChance": 30
    },
    "description": "+330% <DT_POISON_COLOR>Toxin, +330% Status Chance, Converts all elemental damage from these claws to <DT_POISON_COLOR>Toxin damage",
    "rarity": "rare"
  },
  {
    "id": "sharpened_claws",
    "name": "Sharpened Claws",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 75.0
    },
    "description": "A vicious attack dealing 300% damage that sunders armor by 120% and rends flesh.",
    "rarity": "uncommon"
  },
  {
    "id": "shelter",
    "name": "Shelter",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "reviveShieldHealth": 163.63636363636363
    },
    "description": "Creates a shield with 1800 Health around the player when they are reviving fallen allies.",
    "rarity": "uncommon"
  },
  {
    "id": "shock_collar",
    "name": "Shock Collar",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "shocking_claws",
    "name": "Shocking Claws",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "electricity": 30,
      "statusChance": 30
    },
    "description": "+330% <DT_ELECTRICITY_COLOR>Electricity, +330% Status Chance, Converts all elemental damage from these claws to <DT_ELECTRICITY_COLOR>Electricity damage",
    "rarity": "rare"
  },
  {
    "id": "sly_devolution",
    "name": "Sly Devolution",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 2.0
    },
    "description": "Devolves into its larval form when downed and regains its true form after 30s. Your kills reduce enemy accuracy against Warframes by 20% for 8s.",
    "rarity": "rare"
  },
  {
    "id": "strain_eruption",
    "name": "Strain Eruption",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 1.0,
      "range": 2.0
    },
    "description": "Maggots explode on death, dealing 4% of an enemy's current Health as <DT_CORROSIVE_COLOR>Corrosive Damage to any enemy within 8m.",
    "rarity": "rare"
  },
  {
    "id": "strain_fever",
    "name": "Strain Fever",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 10
    },
    "description": "Helminth Charger gains +40% Damage per Cyst.",
    "rarity": "rare"
  },
  {
    "id": "survival_instinct",
    "name": "Survival Instinct",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "cooldown": 1.25,
      "duration": 0.375
    },
    "description": "On Bullet Jump:\\nEnemies lose sight of you for 1.5s. <LOWER_IS_BETTER>5s cooldown.",
    "rarity": "rare"
  },
  {
    "id": "swipe",
    "name": "Swipe",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 0.5
    },
    "description": "Strikes 4 additional enemies and increases Attack Range by 2m.",
    "rarity": "uncommon"
  },
  {
    "id": "synergized_prospectus",
    "name": "Synergized Prospectus",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Fires a spark that seeks out the nearest enemy in 30m, dealing 300 <DT_ELECTRICITY_COLOR>Electricity Damage in a 10m radius. The spark ricochets up to 7x, seeking out the nearest enemy in 30m.",
    "rarity": "rare"
  },
  {
    "id": "tandem_bond",
    "name": "Tandem Bond",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 5.0
    },
    "description": "Companion melee hits increase your Combo by 6. Heavy Attacks increase Companion melee damage by 30% multiplied by your combo multiplier for 30s.",
    "rarity": "rare"
  },
  {
    "id": "thumper",
    "name": "Thumper",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 10.0
    },
    "description": "Djinn will attack the first visible enemy within 60m.",
    "rarity": "common"
  },
  {
    "id": "tractor_beam",
    "name": "Tractor Beam",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "aimGlideDuration": 25.0,
      "gravityReduction": -12.5
    },
    "description": "+100% Aim Glide Duration\\n<LOWER_IS_BETTER>-50% Gravity",
    "rarity": "common"
  },
  {
    "id": "vaporize",
    "name": "Vaporize",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 1.666667,
      "range": 5.0
    },
    "description": "Every 10s the sentinel will stun and inflict 600 damage to an enemy within 30m. Damage dealt affected by Sentinel Weapon Mods.",
    "rarity": "common"
  },
  {
    "id": "venom_teeth",
    "name": "Venom Teeth",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "viral_quills",
    "name": "Viral Quills",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "statusChance": 10.0,
      "cooldown": 1.0,
      "range": 5.0
    },
    "description": "Launches 6 quills at enemies within 20m, each dealing 60 <DT_VIRAL_COLOR>Viral Damage with 40% Status Chance. If the target is affected by a Viral Status, a Spore is added. <LOWER_IS_BETTER>4s cooldown.",
    "rarity": "rare"
  },
  {
    "id": "volatile_parasite",
    "name": "Volatile Parasite",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 25.0,
      "duration": 3.75,
      "range": 10.0
    },
    "description": "Every <LOWER_IS_BETTER>15s spits out a maggot that latches onto the nearest enemy, drawing fire from those within 40m. On death, the maggot bursts, dealing 100% of accumulated damage <DT_VIRAL_COLOR>Viral Damage (+40% damage if the enemy dies while latched) to those within 10m.",
    "rarity": "rare"
  },
  {
    "id": "ammo_case",
    "name": "Ammo Case",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "duration": 0.333333
    },
    "description": "Increases Ammo Capacity by 25% and converts Ammo Pickups into ammo for equipped weapons after 2s.",
    "rarity": "common"
  },
  {
    "id": "trample",
    "name": "Trample",
    "polarity": "penjaga",
    "drain": 0,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 1.6667,
      "duration": 0.833333,
      "explosionDamage": 26.666667
    },
    "description": "The Helminth Charger rushes an enemy, dealing 160 Damage to all in its path. It gains +10% Melee Damage, Max Health and Armor for every enemy hit for 5s.",
    "rarity": "rare"
  },
  {
    "id": "shockwave_actuators_r3",
    "name": "Shockwave Actuators",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 3.0,
      "duration": 2.5
    },
    "description": "Blasts a shockwave knocking down those within 12m. The shockwave recharges every 10s.",
    "rarity": "common"
  },
  {
    "id": "tek_assault_r3",
    "name": "Tek Assault",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "damage": 15.0,
      "duration": 1.0
    },
    "description": "Kavat has 60% chance to ignore Lethal Damage and be immune for 4s.",
    "rarity": "rare"
  },
  {
    "id": "tek_enhance",
    "name": "Tek Enhance",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "abilityDuration": 5.0
    },
    "description": "+30% Ability Duration",
    "rarity": "rare"
  },
  {
    "id": "territorial_aggression_r3",
    "name": "Territorial Aggression",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 1.5,
      "duration": 3.75
    },
    "description": "The Kavat stakes their territory in a radius of 6m for 15s. Each second, enemies within this area have a 30% chance of being attacked by a shadow Kavat.",
    "rarity": "uncommon"
  },
  {
    "id": "whiplash_mine_r3",
    "name": "Whiplash Mine",
    "polarity": "penjaga",
    "drain": 2,
    "maxRank": 3,
    "category": "companion",
    "subCategory": "",
    "stats": {
      "range": 5.0,
      "duration": 0.75
    },
    "description": "Deploys a tether mine snaring all enemies in a 20m. After 3s, all enemies still in range get pulled to the mine.",
    "rarity": "common"
  },
  {
    "id": "afterburner",
    "name": "Afterburner",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "archwing",
    "stats": {
      "igniteDuration": 12,
      "heatDamage": 500,
      "duration": 3.0
    },
    "description": "Core Vent Augment: Blast damage ignites exhaust fumes for 12s. Enemies passing through the flames take 500 Heat damage at max rank.",
    "rarity": "rare",
    "warframeId": "elytron"
  },
  {
    "id": "argon_plating",
    "name": "Argon Plating",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "armor": 16.6667
    },
    "description": "+100% Armor",
    "rarity": "common"
  },
  {
    "id": "auxiliary_power",
    "name": "Auxiliary Power",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "energy": 16.6667
    },
    "description": "+100% Energy Max",
    "rarity": "uncommon"
  },
  {
    "id": "cold_snap",
    "name": "Cold Snap",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "archwing",
    "stats": {
      "duration": 1.25
    },
    "description": "Cosmic Crush Augment: The black hole saps the area of heat, freezing enemies in range. Enemies near the black hole are completely frozen for 5s.",
    "rarity": "rare",
    "warframeId": "itzal"
  },
  {
    "id": "efficient_transferral",
    "name": "Efficient Transferral",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "abilityDuration": 7.5
    },
    "description": "+30% Ability Duration",
    "rarity": "rare"
  },
  {
    "id": "energy_amplifier",
    "name": "Energy Amplifier",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "abilityRange": 10
    },
    "description": "+60% Ability Range",
    "rarity": "uncommon"
  },
  {
    "id": "energy_field",
    "name": "Energy Field",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "archwing",
    "stats": {
      "range": 35.0
    },
    "description": "Energy Shell Augment: Energy Shell applies to allies within 140m.",
    "rarity": "rare",
    "warframeId": "odonata"
  },
  {
    "id": "energy_inversion",
    "name": "Energy Inversion",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 3,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "shield": 25
    },
    "description": "+100% Shield Capacity",
    "rarity": "common"
  },
  {
    "id": "enhanced_durability",
    "name": "Enhanced Durability",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "health": 16.6667
    },
    "description": "+100% Health",
    "rarity": "uncommon"
  },
  {
    "id": "hyperion_thrusters",
    "name": "Hyperion Thrusters",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 10,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "flightSpeed": 2.5
    },
    "description": "+27.5% Flight Speed",
    "rarity": "rare"
  },
  {
    "id": "kinetic_diversion",
    "name": "Kinetic Diversion",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "damage": 10.0
    },
    "description": "Convert +40% of Damage on Health to Energy. Without Shields, ally Overguard imitates Health.",
    "rarity": "rare"
  },
  {
    "id": "morphic_transformer",
    "name": "Morphic Transformer",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "abilityStrength": 5
    },
    "description": "+20% Ability Strength",
    "rarity": "rare"
  },
  {
    "id": "primed_morphic_transformer",
    "name": "Primed Morphic Transformer",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "abilityStrength": 5
    },
    "description": "+55% Ability Strength",
    "rarity": "legendary"
  },
  {
    "id": "superior_defenses",
    "name": "Superior Defenses",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "shieldRecharge": 33.3333,
      "shieldRechargeDelay": -16.6667
    },
    "description": "+100% Shield Recharge, -50% Shield Recharge Delay",
    "rarity": "uncommon"
  },
  {
    "id": "system_reroute",
    "name": "System Reroute",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 10,
    "category": "archwing",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 5
    },
    "description": "+55% Ability Efficiency",
    "rarity": "rare"
  },
  {
    "id": "acid_shells",
    "name": "Acid Shells",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "health": 7.5,
      "range": 2.5
    },
    "description": "Enemies explode on death, dealing 450 <DT_CORROSIVE_COLOR>Corrosive Damage (+45% Enemy Max Health) in a 15m radius.",
    "rarity": "uncommon"
  },
  {
    "id": "affinity_spike",
    "name": "Affinity Spike",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Kills from Melee Attacks grant 45% more Melee Affinity.",
    "rarity": "uncommon"
  },
  {
    "id": "air_time",
    "name": "Air Time",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "-20% Gravity while Falling Down",
    "rarity": "common"
  },
  {
    "id": "amalgam_shotgun_barrage",
    "name": "Amalgam Shotgun Barrage",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "weapon",
    "stats": {
      "fireRate": 14.1667
    },
    "description": "+85% Fire Rate, +45% Revive Speed",
    "rarity": "rare"
  },
  {
    "id": "amarsetmod",
    "name": "Amarsetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "ammo_chain",
    "name": "Ammo Chain",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "ammoMaximum": 16.6667
    },
    "description": "+100% Ammo Maximum",
    "rarity": "uncommon"
  },
  {
    "id": "amp_spike",
    "name": "Amp Spike",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Transfer to Operator with 8x Combo Multiplier to increase AMP damage by 100% for 40s.",
    "rarity": "rare"
  },
  {
    "id": "anti_v",
    "name": "Anti-V",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Digital extremists stand no chance when you have Anti-V on your side",
    "rarity": "rare"
  },
  {
    "id": "archgun_ace",
    "name": "Archgun Ace",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "fireRate": 8.333333,
      "reloadSpeed": 16.666667,
      "duration": 1.5
    },
    "description": "On Headshot Kill:\\n+50% Fire/Charge Rate\\n+100% Reload Speed for 9s",
    "rarity": "rare"
  },
  {
    "id": "archgun_riven_mod",
    "name": "Archgun Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "archgun",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "argent_scourge",
    "name": "Argent Scourge",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "artillery_cheap_shot",
    "name": "Artillery Cheap Shot",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Forward Artillery has a +90% chance to not consume Dome Charges",
    "rarity": "rare"
  },
  {
    "id": "ashensetmod",
    "name": "Ashensetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "assassin_posture",
    "name": "Assassin Posture",
    "polarity": "penjaga",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 75.0
    },
    "description": "The companion will prioritize Eximus and other high-ranking enemies. +300% Overguard Damage",
    "rarity": "common"
  },
  {
    "id": "astral_autopsy",
    "name": "Astral Autopsy",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 0,
    "category": "archmelee",
    "subCategory": "",
    "stats": {},
    "description": "Fatal strikes against an enemy also perform a Codex Scan. Scans require an equipped Codex Scanner and an available charge.",
    "rarity": "rare"
  },
  {
    "id": "astral_cut",
    "name": "Astral Cut",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "slashSize": 20.0
    },
    "description": "Tauron Strike slash size is increased by 80%.",
    "rarity": "uncommon"
  },
  {
    "id": "astral_slash",
    "name": "Astral Slash",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "slash": 15
    },
    "description": "+90% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "atlantis_vulcan",
    "name": "Atlantis Vulcan",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Rapid strikes, deceptive movements.",
    "rarity": "uncommon"
  },
  {
    "id": "atomic_fallout",
    "name": "Atomic Fallout",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magazine": 10,
      "radiation": 15.0
    },
    "description": "+60% <DT_RADIATION_COLOR>Radiation, +40% Magazine Capacity",
    "rarity": "rare"
  },
  {
    "id": "augursetmod",
    "name": "Augursetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "auto_breach",
    "name": "Auto Breach",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "+30% chance to auto complete Hacking",
    "rarity": "uncommon"
  },
  {
    "id": "automatic_trigger",
    "name": "Automatic Trigger",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "fireRate": 10
    },
    "description": "+60% Fire Rate",
    "rarity": "rare"
  },
  {
    "id": "balanced_posture",
    "name": "Balanced Posture",
    "polarity": "penjaga",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "range": 0.5
    },
    "description": "The companion acts freely as they see fit. Staggers enemies within 2m while moving.",
    "rarity": "common"
  },
  {
    "id": "ballista_measure",
    "name": "Ballista Measure",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "range": 5
    },
    "description": "+20% Range",
    "rarity": "rare"
  },
  {
    "id": "basilisk_gaze",
    "name": "Basilisk Gaze",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Void Blast radius by 60%.",
    "rarity": "uncommon"
  },
  {
    "id": "basilisk_scales",
    "name": "Basilisk Scales",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Operator Armor by 200%.",
    "rarity": "uncommon"
  },
  {
    "id": "battle_forge",
    "name": "Battle Forge",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cooldown": 80.0
    },
    "description": "Reduce Forge Cooldown by 120s\\nCooldown: 480s",
    "rarity": "uncommon"
  },
  {
    "id": "battle_stations",
    "name": "Battle Stations",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 4.333333,
      "cooldown": 40.0
    },
    "description": "Boost Turret Damage by 75% for 30s\\nCooldown: 240s",
    "rarity": "uncommon"
  },
  {
    "id": "biting_piranha",
    "name": "Biting Piranha",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "blackout_pulse",
    "name": "Blackout Pulse",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Electro-Magnetic Pulse that damages enemies and disables them temporarily.",
    "rarity": "rare"
  },
  {
    "id": "blazing_dash",
    "name": "Blazing Dash",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Sling leaves a trail of fire that deals 1000 Damage/s over 14s. Void Sling will now stun enemies instead of displacing them.",
    "rarity": "uncommon"
  },
  {
    "id": "blazing_steel",
    "name": "Blazing Steel",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "heat": 20
    },
    "description": "+120% <DT_FIRE_COLOR>Heat",
    "rarity": "uncommon"
  },
  {
    "id": "bleeding_edge",
    "name": "Bleeding Edge",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10
    },
    "description": "+110% Critical Damage",
    "rarity": "common"
  },
  {
    "id": "blind_justice",
    "name": "Blind Justice",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Reverse grip style emphasizing slashing and impaling strikes.",
    "rarity": "uncommon"
  },
  {
    "id": "blood_for_ammo",
    "name": "Blood For Ammo",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Mercy Kill refills Primary and Secondary Magazine by 100%",
    "rarity": "common"
  },
  {
    "id": "blood_for_energy",
    "name": "Blood For Energy",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "energy": 50.0
    },
    "description": "50% chance to drop an Energy Orb on Mercy",
    "rarity": "rare"
  },
  {
    "id": "blood_for_life",
    "name": "Blood For Life",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "health": 100.0
    },
    "description": "100% chance to drop a Health Orb on Mercy",
    "rarity": "common"
  },
  {
    "id": "bomb_the_landin",
    "name": "Bomb The Landin'",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "Tap and hold Grind in the air to execute a 20m radius Slam Shockwave that deals 300 damage.",
    "rarity": "rare"
  },
  {
    "id": "bonebladesetmod",
    "name": "Bonebladesetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "borealsetmod",
    "name": "Borealsetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "boundless_energy",
    "name": "Boundless Energy",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Ability strength, duration, and cast speed granted by spectral pages increased by 40%.",
    "rarity": "uncommon"
  },
  {
    "id": "bounty_hunter",
    "name": "Bounty Hunter",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "On Hit:\\nReveals target on Minimap for +6s.",
    "rarity": "uncommon"
  },
  {
    "id": "breach_loader",
    "name": "Breach Loader",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "puncture": 20
    },
    "description": "+120% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "breach_quanta",
    "name": "Breach Quanta",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 7.5,
      "cooldown": 50.0
    },
    "description": "Temporarily stall Hull Breach for 55s\\nCooldown: 300s",
    "rarity": "common"
  },
  {
    "id": "brilliant_insight",
    "name": "Brilliant Insight",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Spectral pages also fire off beams that blind enemies within 16m.",
    "rarity": "uncommon"
  },
  {
    "id": "broad_eye",
    "name": "Broad Eye",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "zoom": -10
    },
    "description": "-60% Zoom while Aim Gliding",
    "rarity": "uncommon"
  },
  {
    "id": "brutal_tide",
    "name": "Brutal Tide",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Round-house attacks and leaping fists.",
    "rarity": "rare"
  },
  {
    "id": "butchers_revelry",
    "name": "Butcher's Revelry",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Stance: Rip and rend with this Assault Saw stance.",
    "rarity": "rare"
  },
  {
    "id": "byteryte",
    "name": "Byteryte",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Keeps your bytes tight and your bits fit",
    "rarity": "rare"
  },
  {
    "id": "caustic_strike",
    "name": "Caustic Strike",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Second Ability launches an energy bomb that explodes with a 8m radius, stripping 100% of enemy armor. Tap <ACTIVATE_ABILITY_1> again to detonate in-flight.",
    "rarity": "uncommon"
  },
  {
    "id": "celestial_nightfall",
    "name": "Celestial Nightfall",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "chained_sling",
    "name": "Chained Sling",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "50% Energy Efficiency on Consecutive Void Slings.",
    "rarity": "uncommon"
  },
  {
    "id": "charged_bullets",
    "name": "Charged Bullets",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "chilling_reload",
    "name": "Chilling Reload",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "reloadSpeed": 10
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +40% Reload Speed",
    "rarity": "rare"
  },
  {
    "id": "cleanse_orokin",
    "name": "Cleanse Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.3 Damage to Orokin",
    "rarity": "uncommon"
  },
  {
    "id": "cleanse_the_murmur",
    "name": "Cleanse The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.3 Damage to Murmur",
    "rarity": "uncommon"
  },
  {
    "id": "cogron_tauron_strike",
    "name": "Cogron Tauron Strike",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Summon forth Cogron from the Void and brandish the mighty hammer, slamming it into the ground to create a cataclysmic shockwave that ripples 4 times.",
    "rarity": "rare"
  },
  {
    "id": "cold_arrival",
    "name": "Cold Arrival",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "range": 1.0
    },
    "description": "Dismounting deals 400 <DT_FREEZE_COLOR>Cold Damage to enemies within 4m.",
    "rarity": "uncommon"
  },
  {
    "id": "combustion_rounds",
    "name": "Combustion Rounds",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "heat": 20
    },
    "description": "+120% <DT_FIRE_COLOR>Heat",
    "rarity": "uncommon"
  },
  {
    "id": "comet_blast",
    "name": "Comet Blast",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "companion_weapon_riven_mod",
    "name": "Companion Weapon Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "computer_cop",
    "name": "Computer Cop",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Stopping cyber-crime in its tracks",
    "rarity": "rare"
  },
  {
    "id": "conductive_blade",
    "name": "Conductive Blade",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "electricity": 20
    },
    "description": "+120% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "uncommon"
  },
  {
    "id": "conic_nozzle",
    "name": "Conic Nozzle",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "engineSpeed": 4.25
    },
    "description": "+25.5% Railjack Speed",
    "rarity": "rare"
  },
  {
    "id": "containment_breach",
    "name": "Containment Breach",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "radiation": 15,
      "multishot": 7.5
    },
    "description": "+60% <DT_RADIATION_COLOR>Radiation, +30% Multishot",
    "rarity": "rare"
  },
  {
    "id": "contamination_casing",
    "name": "Contamination Casing",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "contamination_wave",
    "name": "Contamination Wave",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Second Ability emits a Void wave lasting 2s that drenches enemies with Void Contamination making them 50% more vulnerable to Operator Damage for 20s.",
    "rarity": "uncommon"
  },
  {
    "id": "counterbalance",
    "name": "Counterbalance",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "recoil": -15
    },
    "description": "-60% Weapon Recoil",
    "rarity": "rare"
  },
  {
    "id": "countermeasures",
    "name": "Countermeasures",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Flares that distract enemy guided projectiles.",
    "rarity": "common"
  },
  {
    "id": "crash_shot",
    "name": "Crash Shot",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_IMPACT_COLOR>Impact",
    "rarity": "uncommon"
  },
  {
    "id": "crashing_havoc",
    "name": "Crashing Havoc",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "crashing_timber",
    "name": "Crashing Timber",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "crimson_fugue",
    "name": "Crimson Fugue",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 2.5,
      "duration": 0.727273
    },
    "description": "+27.5% Turret Damage per enemy destroyed, for 8s (Maximum 5 stacks)",
    "rarity": "rare"
  },
  {
    "id": "crippling_dash",
    "name": "Crippling Dash",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Using Void Sling through an enemy will reduce their Damage by 50%.",
    "rarity": "rare"
  },
  {
    "id": "critical_focus",
    "name": "Critical Focus",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "criticalChance": 10,
      "criticalMultiplier": 10
    },
    "description": "+60% Critical Chance and Damage when Aiming",
    "rarity": "rare"
  },
  {
    "id": "critical_meltdown",
    "name": "Critical Meltdown",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "criticalChance": 15,
      "radiation": 15.0
    },
    "description": "+60% <DT_RADIATION_COLOR>Radiation, +60% Critical Chance",
    "rarity": "rare"
  },
  {
    "id": "cruising_speed",
    "name": "Cruising Speed",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "engineSpeed": 9.09,
      "range": 272.727273
    },
    "description": "+100% Railjack Speed when no enemies within 3000m",
    "rarity": "uncommon"
  },
  {
    "id": "crushing_ruin",
    "name": "Crushing Ruin",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Aerial attacks with Crowd Control combos.",
    "rarity": "rare"
  },
  {
    "id": "cryo_coating",
    "name": "Cryo Coating",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "cunning_aspect",
    "name": "Cunning Aspect",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "cutting_edge",
    "name": "Cutting Edge",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "damage": 10
    },
    "description": "+110% Melee Damage",
    "rarity": "uncommon"
  },
  {
    "id": "cyclone_kraken",
    "name": "Cyclone Kraken",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Brutal strikes with deft movement.",
    "rarity": "rare"
  },
  {
    "id": "deadly_efficiency",
    "name": "Deadly Efficiency",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "damage": 20,
      "duration": 1.5
    },
    "description": "On Reload From Empty:\\n+120% Damage for 9s",
    "rarity": "rare"
  },
  {
    "id": "death_blossom",
    "name": "Death Blossom",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cooldown": 50.0,
      "duration": 4.166667
    },
    "description": "Turret Cooldowns removed for 30s\\nCooldown: 300s",
    "rarity": "rare"
  },
  {
    "id": "deathless_currents",
    "name": "Deathless Currents",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Vortex heals allies for 250 health/s. Downed players inside the vortex will be instantly revived, and dead players will be resummoned.",
    "rarity": "rare"
  },
  {
    "id": "defensive_fire",
    "name": "Defensive Fire",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "shield": 1.5,
      "duration": 1.666667
    },
    "description": "+13.5% Maximum Shields per enemy killed for 10s (Maximum 10 stacks)",
    "rarity": "rare"
  },
  {
    "id": "disarming_blast",
    "name": "Disarming Blast",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Enemies hit by Void Blast have a 50% chance to be disarmed.",
    "rarity": "uncommon"
  },
  {
    "id": "disarming_sling",
    "name": "Disarming Sling",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Slinging through enemies has a 50% chance to disarm them.",
    "rarity": "uncommon"
  },
  {
    "id": "disorienting_blast",
    "name": "Disorienting Blast",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Blast has a 50% chance of confusing enemies for 16s, causing them to be unable to distinguish friend from foe.",
    "rarity": "common"
  },
  {
    "id": "disruptor",
    "name": "Disruptor",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact",
    "rarity": "common"
  },
  {
    "id": "distilled_contamination",
    "name": "Distilled Contamination",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Killing an enemy affected by Contamination Wave makes all affected enemies 50% more vulnerable, while also making the effect last 10s longer. Maximum 2 stacks.",
    "rarity": "rare"
  },
  {
    "id": "dividing_blades",
    "name": "Dividing Blades",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "double_barrel_drift",
    "name": "Double-Barrel Drift",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "accuracy": 5,
      "recoil": -5.0
    },
    "description": "-20% Weapon Recoil, and +20% Accuracy when Sliding",
    "rarity": "rare"
  },
  {
    "id": "downpour",
    "name": "Downpour",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Rain of Arrows will also target 4 additional enemies within 10m.",
    "rarity": "uncommon"
  },
  {
    "id": "drive_duster",
    "name": "Drive-Duster",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Your digital virus buster",
    "rarity": "rare"
  },
  {
    "id": "dual_rounds",
    "name": "Dual Rounds",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "multishot": 10
    },
    "description": "+60% Multishot",
    "rarity": "rare"
  },
  {
    "id": "efficient_beams",
    "name": "Efficient Beams",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "statusChance": 25
    },
    "description": "Only consume ammo when dealing damage.\\n+150% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "electrified_barrel",
    "name": "Electrified Barrel",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "electricity": 20
    },
    "description": "+120% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "uncommon"
  },
  {
    "id": "eleventh_storm",
    "name": "Eleventh Storm",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Rapid attacks using sword and shield.",
    "rarity": "uncommon"
  },
  {
    "id": "elusive_posture",
    "name": "Elusive Posture",
    "polarity": "penjaga",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "The companion will avoid attacking. +50% Evasion",
    "rarity": "common"
  },
  {
    "id": "enduring_tides",
    "name": "Enduring Tides",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Operator Health and Armor by 200%.",
    "rarity": "uncommon"
  },
  {
    "id": "energy_pulse",
    "name": "Energy Pulse",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Energy pickups grant 50% additional Energy over 5s.",
    "rarity": "common"
  },
  {
    "id": "eroding_rapids",
    "name": "Eroding Rapids",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Vortex applies 100% status vulnerability to all enemies within it.",
    "rarity": "rare"
  },
  {
    "id": "eternal_gaze",
    "name": "Eternal Gaze",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increase Energy Regeneration Rate for Amps and Void Beam by 60%.",
    "rarity": "rare"
  },
  {
    "id": "executing_dash",
    "name": "Executing Dash",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Sling no longer displaces enemies, instead it will open them up to Finishers and increase Finisher Damage taken by 35%.",
    "rarity": "uncommon"
  },
  {
    "id": "extend",
    "name": "Extend",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "range": 25
    },
    "description": "+100 Attraction Range (In Space), +3 Melee Range",
    "rarity": "common"
  },
  {
    "id": "extreme_velocity",
    "name": "Extreme Velocity",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+30% K-Drive Speed",
    "rarity": "rare"
  },
  {
    "id": "failsafe",
    "name": "Failsafe",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "+50% to retry on Hacking failure",
    "rarity": "rare"
  },
  {
    "id": "far_sling",
    "name": "Far Sling",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases maximum Void Sling distance by 30%.",
    "rarity": "rare"
  },
  {
    "id": "fass",
    "name": "Fass",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Roiling, moaning, this realm of ours  In madness lost shall die",
    "rarity": "rare"
  },
  {
    "id": "fatal_acceleration",
    "name": "Fatal Acceleration",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 10
    },
    "description": "+40% Projectile Speed",
    "rarity": "uncommon"
  },
  {
    "id": "fateful_truth",
    "name": "Fateful Truth",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "femursetmod",
    "name": "Femursetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "final_harbinger",
    "name": "Final Harbinger",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Powerful slashes and shield attacks.",
    "rarity": "uncommon"
  },
  {
    "id": "fire_suppression",
    "name": "Fire Suppression",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cooldown": 38.333333
    },
    "description": "Extinguish 1 fire\\nCooldown: <LOWER_IS_BETTER>200s",
    "rarity": "common"
  },
  {
    "id": "firewall",
    "name": "Firewall",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Reduces damage by 75% while hacking",
    "rarity": "uncommon"
  },

  {
    "id": "flak_shot",
    "name": "Flak Shot",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_SLASH_COLOR>Slash",
    "rarity": "uncommon"
  },
  {
    "id": "flame_blast",
    "name": "Flame Blast",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Blast releases a ball of fire that deals 250% of the Void Blast damage and explodes after 0.6000000238418579s.",
    "rarity": "rare"
  },
  {
    "id": "flechette",
    "name": "Flechette",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "puncture": 15
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "common"
  },
  {
    "id": "flow_burn",
    "name": "Flow Burn",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 1.181818,
      "cooldown": 21.818182
    },
    "description": "+38% Speed and Boost Speed for 13s\\nCooldown: 240s",
    "rarity": "uncommon"
  },
  {
    "id": "flowing_strikes",
    "name": "Flowing Strikes",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Increase the range of spectral melee attacks to 26m.",
    "rarity": "uncommon"
  },
  {
    "id": "fomorian_accelerant",
    "name": "Fomorian Accelerant",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "weapon",
    "stats": {
      "projectileSpeed": 15.0,
      "ricochetBounces": 4.0
    },
    "description": "Flak now bounces up to 4x and travels 60% faster.",
    "rarity": "uncommon"
  },
  {
    "id": "form_up",
    "name": "Form Up",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cooldown": 40.0
    },
    "description": "Recall all Crew Members to the Railjack and Heal them for 100%\\nCooldown: 240s",
    "rarity": "uncommon"
  },
  {
    "id": "fortifying_fire",
    "name": "Fortifying Fire",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "shield": 0.5
    },
    "description": "ON CRITICAL HIT:\\nReplenish 4.5% of Shields",
    "rarity": "rare"
  },
  {
    "id": "forward_artillery",
    "name": "Forward Artillery",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "artilleryDamage": 9.09,
      "damage": 9.090909
    },
    "description": "+100% Forward Artillery Damage",
    "rarity": "rare"
  },
  {
    "id": "four_riders",
    "name": "Four Riders",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fast strikes, powerful slams.",
    "rarity": "rare"
  },
  {
    "id": "fracturing_wind",
    "name": "Fracturing Wind",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fast, multi-hit strikes with powerful finishers.",
    "rarity": "uncommon"
  },
  {
    "id": "frenzied_posture",
    "name": "Frenzied Posture",
    "polarity": "penjaga",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "statusDuration": 20.0
    },
    "description": "The companion prefers to change its target after each attack. +80% Status Duration",
    "rarity": "common"
  },
  {
    "id": "full_contact",
    "name": "Full Contact",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "impact": 20
    },
    "description": "+120% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "furor",
    "name": "Furor",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "attackSpeed": 2.5
    },
    "description": "+10% Attack Speed",
    "rarity": "uncommon"
  },
  {
    "id": "gaias_tragedy",
    "name": "Gaia's Tragedy",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Slow, powerful strikes.",
    "rarity": "rare"
  },
  {
    "id": "galeforce_dawn",
    "name": "Galeforce Dawn",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Wide slashes and heavy strikes.",
    "rarity": "uncommon"
  },
  {
    "id": "galvanized_acceleration",
    "name": "Galvanized Acceleration",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "projectileSpeed": 2.7273,
      "range": 2.727273,
      "duration": 0.909091
    },
    "description": "+30% Projectile Speed and +30% Beam Range, On Kill:\\n+30% Projectile Speed and +30% Beam Range for 10s. Stacks up to 2x.",
    "rarity": "rare"
  },
  {
    "id": "gemini_cross",
    "name": "Gemini Cross",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "A style exhibiting sweeping slash attacks and swift jabs.",
    "rarity": "uncommon"
  },
  {
    "id": "glacial_edge",
    "name": "Glacial Edge",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "cold": 20
    },
    "description": "+120% <DT_FREEZE_COLOR>Cold",
    "rarity": "uncommon"
  },
  {
    "id": "gladiatorsetmod",
    "name": "Gladiatorsetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "gleaming_talon",
    "name": "Gleaming Talon",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fast arcing strikes.",
    "rarity": "rare"
  },
  {
    "id": "granums_nemesis",
    "name": "Granum's Nemesis",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "x1.27 Turret Damage vs Corpus",
    "rarity": "rare"
  },
  {
    "id": "great_quake",
    "name": "Great Quake",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Increase shockwave radius by +40%.",
    "rarity": "uncommon"
  },
  {
    "id": "guardian_blast",
    "name": "Guardian Blast",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Blast consumes 25 Energy for each ally hit within 8m and grants them 160 Shields.",
    "rarity": "uncommon"
  },
  {
    "id": "guardian_break",
    "name": "Guardian Break",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "When the Guardian Shell breaks, Warframe Shield Regeneration rate is increased by 150% and Regeneration Delay is reduced by 80%, for 12s.",
    "rarity": "rare"
  },
  {
    "id": "guardian_shell",
    "name": "Guardian Shell",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Use your first Ability to manifest a barrier on the Operator and allies in Affinity Range. It is invulnerable for 4s when first created and damage inflicted while it's invulnerable will be added to its base health of 500.",
    "rarity": "uncommon"
  },
  {
    "id": "hard_reset",
    "name": "Hard Reset",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 15.0
    },
    "description": "Mercy Kills reduce Companion Recovery by 15s",
    "rarity": "rare"
  },
  {
    "id": "hardened_wellspring",
    "name": "Hardened Wellspring",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Use your first Ability inside a Wellspring to increase its size, boost its duration by 20s, and grant 20% Ability Strength to those inside.",
    "rarity": "rare"
  },
  {
    "id": "harrowing_spire",
    "name": "Harrowing Spire",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Relentless jabs and powerful sweeping lunges.",
    "rarity": "rare"
  },
  {
    "id": "hawksetmod",
    "name": "Hawksetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "hit_and_run",
    "name": "Hit And Run",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "parkourVelocity": 60.0,
      "duration": 15.0
    },
    "description": "+60% Parkour Speed after a Mercy for 15s",
    "rarity": "uncommon"
  },
  {
    "id": "hollowed_bullets",
    "name": "Hollowed Bullets",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 20
    },
    "description": "+80% Critical Damage",
    "rarity": "rare"
  },
  {
    "id": "hungering_blades",
    "name": "Hungering Blades",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Spectral weapons have a 100% chance to attack the same enemy a second time.",
    "rarity": "rare"
  },
  {
    "id": "huntersetmod",
    "name": "Huntersetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "hydraulic_chamber",
    "name": "Hydraulic Chamber",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magazine": -2.5,
      "recoil": -15.0
    },
    "description": "-60% Weapon Recoil, -10% Magazine Capacity",
    "rarity": "rare"
  },
  {
    "id": "hyperstrike",
    "name": "Hyperstrike",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "turretDamage": 12.5,
      "damage": 12.5
    },
    "description": "+75% Turret Damage",
    "rarity": "common"
  },
  {
    "id": "hypothermic_shell",
    "name": "Hypothermic Shell",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "immuno_shield",
    "name": "Immuno Shield",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Gain 15% Disinfection and gain 5000 Affinity",
    "rarity": "common"
  },
  {
    "id": "indomitable_matrix",
    "name": "Indomitable Matrix",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "shield": 2.5,
      "armor": 5.0
    },
    "description": "<LOWER_IS_BETTER>-18% Breach Chance\\n+22% Shield Recharge during Breach\\n+30% Armor when below 53% Hull",
    "rarity": "uncommon"
  },
  {
    "id": "inertia_dampeners",
    "name": "Inertia Dampeners",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+4 Point Multiplier to Trick Score",
    "rarity": "uncommon"
  },
  {
    "id": "infectious_injection",
    "name": "Infectious Injection",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "inner_gaze",
    "name": "Inner Gaze",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increase Energy for Amps and Void Beam by 40%.",
    "rarity": "uncommon"
  },
  {
    "id": "inner_might",
    "name": "Inner Might",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Allows Abilities to be cast without using Energy or Shields but requires 60s to recharge.",
    "rarity": "uncommon"
  },
  {
    "id": "instant_secure",
    "name": "Instant Secure",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Gain 15% Disinfection and gain 10,000 H\u00f6llars",
    "rarity": "common"
  },
  {
    "id": "intruder_stasis",
    "name": "Intruder Stasis",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 5.833333,
      "cooldown": 50.0
    },
    "description": "Freeze all Enemy Boarding Parties for 45s\\nCooldown: 300s",
    "rarity": "uncommon"
  },
  {
    "id": "ion_burn",
    "name": "Ion Burn",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "boostSpeed": 7.5
    },
    "description": "+45% Railjack Boost Speed",
    "rarity": "common"
  },
  {
    "id": "ion_infusion",
    "name": "Ion Infusion",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "ironclad_matrix",
    "name": "Ironclad Matrix",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "armor": 3.75,
      "shield": 4.25
    },
    "description": "+33.75% Hull and Armor, +38.25% Max Shields and Shield Recharge",
    "rarity": "uncommon"
  },
  {
    "id": "jahu",
    "name": "Jahu",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Corporeal laws are unwrit  As suns and love retreat",
    "rarity": "rare"
  },
  {
    "id": "juice",
    "name": "Juice",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "Executing tricks charges Energy: 55 Energy per 100 Trick Points.",
    "rarity": "common"
  },
  {
    "id": "keep_clean",
    "name": "Keep-Clean",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "There's no Clean like Keep-Clean",
    "rarity": "rare"
  },
  {
    "id": "khra",
    "name": "Khra",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "To cosmic forms from tangent planes  We end as we began",
    "rarity": "rare"
  },
  {
    "id": "kill_switch",
    "name": "Kill Switch",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 12.5,
      "duration": 0.75
    },
    "description": "On Kill:\\n+50% Reload Speed for 3s",
    "rarity": "rare"
  },
  {
    "id": "killers_rush",
    "name": "Killer's Rush",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "rare"
  },
  {
    "id": "kinetic_friction",
    "name": "Kinetic Friction",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "range": 1.0
    },
    "description": "Grinding builds up a charge that is released when landing the trick, dealing 400 <DT_ELECTRICITY_COLOR>Electricity Damage to enemies within 4m.",
    "rarity": "uncommon"
  },

  {
    "id": "laser_sight",
    "name": "Laser Sight",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "criticalChance": 20,
      "duration": 1.5
    },
    "description": "On Headshot:\\n+120% Critical Chance when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "lashing_coil",
    "name": "Lashing Coil",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "last_gasp",
    "name": "Last Gasp",
    "polarity": "unairu",
    "drain": 6,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Revive your Warframe by transferring to Operator and killing 3 enemies before 15s elapse and the Revive Meter begins to drain.",
    "rarity": "uncommon"
  },
  {
    "id": "last_herald",
    "name": "Last Herald",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "lethal_levitation",
    "name": "Lethal Levitation",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Additional 50% Weapon Damage per Lifted enemy attacked by Operator. Lasts for 60s, stacks up to 4x.",
    "rarity": "rare"
  },
  {
    "id": "lingering_torment",
    "name": "Lingering Torment",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "statusDuration": 15
    },
    "description": "+90% Status Duration",
    "rarity": "common"
  },
  {
    "id": "live_wire",
    "name": "Live Wire",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "range": 20.0
    },
    "description": "Shock enemies within 20m while Hacking",
    "rarity": "common"
  },
  {
    "id": "loaded_capacity",
    "name": "Loaded Capacity",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magazine": 5,
      "reloadSpeed": -2.5
    },
    "description": "+30% Magazine Capacity, -15% Reload Speed",
    "rarity": "common"
  },
  {
    "id": "lock_and_load",
    "name": "Lock and Load",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "holsterRate": 5
    },
    "description": "+20% Magazine Reloaded/s when Holstered",
    "rarity": "rare"
  },
  {
    "id": "lohk",
    "name": "Lohk",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "From brooding gulfs are we beheld  By that which bears no name",
    "rarity": "rare"
  },
  {
    "id": "loose_chamber",
    "name": "Loose Chamber",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 5,
      "recoil": 8.333333
    },
    "description": "+30% Reload Speed, +50% Weapon Recoil",
    "rarity": "common"
  },
  {
    "id": "lorak_tauron_strike",
    "name": "Lorak Tauron Strike",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Summon forth Lorak from the Void and conjure its ruinous spells, calling forth a beam of energy from within. Enemies pierced by the beam have a 100% chance to drop Energy Orbs if killed within 10s.",
    "rarity": "rare"
  },
  {
    "id": "mad_stack",
    "name": "Mad Stack",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+120% Velocity when falling",
    "rarity": "uncommon"
  },
  {
    "id": "madurai_transmute_core",
    "name": "Madurai Transmute Core",
    "polarity": "madurai",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Ensures transmuted mod is of Madurai polarity and eliminates credit cost.",
    "rarity": "rare"
  },
  {
    "id": "mafic_rain",
    "name": "Mafic Rain",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "mag_locks",
    "name": "Mag Locks",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+30% K-Drive Grind Magnetism",
    "rarity": "common"
  },
  {
    "id": "magazine_extension",
    "name": "Magazine Extension",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "magazine": 10
    },
    "description": "+60% Magazine Capacity",
    "rarity": "common"
  },
  {
    "id": "magma_chamber",
    "name": "Magma Chamber",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "heat": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FIRE_COLOR>Heat, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "magnetic_blast",
    "name": "Magnetic Blast",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Enemies hit by Void Blast are affected by Magnetize for 10s.",
    "rarity": "rare"
  },
  {
    "id": "magnetic_boost",
    "name": "Magnetic Boost",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Sling out of a Magnetic Flare to refresh its duration and increase its radius by 100%.",
    "rarity": "rare"
  },
  {
    "id": "magnetic_flare",
    "name": "Magnetic Flare",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Use your first Ability to create a 8m radius field that lasts for 30s and disables the shields of any enemy that enters it.",
    "rarity": "uncommon"
  },
  {
    "id": "magnetic_strafe",
    "name": "Magnetic Strafe",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magnetic": 15,
      "fireRate": 10
    },
    "description": "+60% <DT_MAGNETIC_COLOR>Magnetic, +40% Fire Rate",
    "rarity": "rare"
  },
  {
    "id": "magnetic_welt",
    "name": "Magnetic Welt",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "fireRate": 5.833333
    },
    "description": " <DT_IMPACT_COLOR>Impact Status Effects have 35% chance to apply a <DT_MAGNETIC_COLOR>Magnetic Status Effect (x2 when Fire Rate is below 2.5)",
    "rarity": "rare"
  },
  {
    "id": "magnetized_core",
    "name": "Magnetized Core",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magnetic": 15,
      "criticalMultiplier": 10
    },
    "description": "+60% <DT_MAGNETIC_COLOR>Magnetic, +40% Critical Damage",
    "rarity": "rare"
  },
  {
    "id": "magnetized_cycle",
    "name": "Magnetized Cycle",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "magnetic": 15,
      "fireRate": 7.5
    },
    "description": "+60% <DT_MAGNETIC_COLOR>Magnetic, +30% Fire Rate",
    "rarity": "rare"
  },
  {
    "id": "malicious_code",
    "name": "Malicious Code",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "range": 15.0,
      "duration": 8.0
    },
    "description": "50% chance on Mercy Kill for enemies within 15m to cower in fear for 8s",
    "rarity": "rare"
  },
  {
    "id": "malicious_raptor",
    "name": "Malicious Raptor",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Puncturing strikes and quick slashes.",
    "rarity": "rare"
  },
  {
    "id": "marked_target",
    "name": "Marked Target",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "statusChance": 20
    },
    "description": "+120% Status Chance when Aiming",
    "rarity": "rare"
  },
  {
    "id": "master_key",
    "name": "Master Key",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "range": 20.0
    },
    "description": "Unlock 5 lockers within 20m after Hacking",
    "rarity": "common"
  },
  {
    "id": "mechasetmod",
    "name": "Mechasetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "melee_riven_mod",
    "name": "Melee Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "mending_soul",
    "name": "Mending Soul",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "The first 4 revives are instantaneous. Additional revives are 100% faster.",
    "rarity": "uncommon"
  },
  {
    "id": "mending_unity",
    "name": "Mending Unity",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Increases Affinity Radius by 25m.",
    "rarity": "common"
  },
  {
    "id": "meteor_crash",
    "name": "Meteor Crash",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "impact": 15
    },
    "description": "+90% <DT_IMPACT_COLOR>Impact",
    "rarity": "rare"
  },
  {
    "id": "meteoric_dash",
    "name": "Meteoric Dash",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Sling deals 400 Extra Damage to enemies.",
    "rarity": "rare"
  },
  {
    "id": "mind_sprint",
    "name": "Mind Sprint",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Void Sling Speed by 120%.",
    "rarity": "uncommon"
  },
  {
    "id": "mind_step",
    "name": "Mind Step",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Operator Movement Speed by 30%.",
    "rarity": "uncommon"
  },
  {
    "id": "modified_munitions",
    "name": "Modified Munitions",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "statusChance": 10
    },
    "description": "+60% Status Chance",
    "rarity": "uncommon"
  },
  {
    "id": "momentary_pause",
    "name": "Momentary Pause",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 2.5,
      "health": -6.25
    },
    "description": "On Kill:\\n+15 Heal Rate for 10s, -25% from Health Orbs",
    "rarity": "rare"
  },
  {
    "id": "mountains_edge",
    "name": "Mountain's Edge",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Sharp movements with wide reach.",
    "rarity": "uncommon"
  },
  {
    "id": "munitions_vortex",
    "name": "Munitions Vortex",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Vortex that absorbs incoming fire and detonates, releasing damage.",
    "rarity": "uncommon"
  },
  {
    "id": "nano_applicator",
    "name": "Nano-Applicator",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "statusChance": 15,
      "duration": 1.5
    },
    "description": "On Ability Cast:\\n+90% Status Chance when Aiming for 9s",
    "rarity": "rare"
  },
  {
    "id": "naramon_transmute_core",
    "name": "Naramon Transmute Core",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Ensures transmuted mod is of Naramon polarity and eliminates credit cost.",
    "rarity": "rare"
  },
  {
    "id": "narrow_barrel",
    "name": "Narrow Barrel",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "accuracy": 5,
      "duration": 1.5
    },
    "description": "On Hit:\\n+30% Accuracy when Aiming for 9s",
    "rarity": "rare"
  },
  {
    "id": "nebula_bore",
    "name": "Nebula Bore",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "puncture": 15
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "necramech_augur",
    "name": "Necramech Augur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "shield": 40.0
    },
    "description": "240% Energy spent on abilities is converted to Shields.",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_aviator",
    "name": "Necramech Aviator",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "damageReduction": 10.0
    },
    "description": "Reduced damage by 40% while airborne",
    "rarity": "common"
  },
  {
    "id": "necramech_blitz",
    "name": "Necramech Blitz",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "damage": 20.0,
      "slideSpeed": 20.0
    },
    "description": "+80% Slide Attack Damage",
    "rarity": "common"
  },
  {
    "id": "necramech_continuity",
    "name": "Necramech Continuity",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "abilityDuration": 5
    },
    "description": "+30% Ability Duration",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_deflection",
    "name": "Necramech Deflection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "shield": -7.5
    },
    "description": "+90% Shield Recharge, -45% Shield Recharge Delay",
    "rarity": "common"
  },
  {
    "id": "necramech_drift",
    "name": "Necramech Drift",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "+60% Hover Efficiency",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_efficiency",
    "name": "Necramech Efficiency",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "+30% Engine Efficiency",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_enemy_sense",
    "name": "Necramech Enemy Sense",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "range": 5.0
    },
    "description": "+30m Enemy Radar",
    "rarity": "common"
  },
  {
    "id": "necramech_flow",
    "name": "Necramech Flow",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "energy": 16.6667
    },
    "description": "+100% Energy Max",
    "rarity": "rare"
  },
  {
    "id": "necramech_friction",
    "name": "Necramech Friction",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "slideSpeed": 10.0
    },
    "description": "+60% Slide Efficiency",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_fury",
    "name": "Necramech Fury",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "attackSpeed": 10
    },
    "description": "+40% Melee Attack Speed",
    "rarity": "common"
  },
  {
    "id": "necramech_hydraulics",
    "name": "Necramech Hydraulics",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "+120% Jump Height",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_intensify",
    "name": "Necramech Intensify",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "abilityStrength": 5
    },
    "description": "+30% Ability Strength",
    "rarity": "rare"
  },
  {
    "id": "necramech_pressure_point",
    "name": "Necramech Pressure Point",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "damage": 10
    },
    "description": "+60% Melee Damage",
    "rarity": "rare"
  },
  {
    "id": "necramech_rage",
    "name": "Necramech Rage",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "damage": 2.5
    },
    "description": "Convert +15% of Damage on Health to Energy. Without Shields, ally Overguard imitates Health.",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_reach",
    "name": "Necramech Reach",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "+1 Melee Range",
    "rarity": "common"
  },
  {
    "id": "necramech_rebuke",
    "name": "Necramech Rebuke",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "range": 5.0,
      "duration": 0.75,
      "cooldown": 2.5
    },
    "description": "Electrifies enemies within 20m for 3s and dealing 300 <DT_ELECTRICITY_COLOR>Electricity Damage when shields are depleted.\\n10s cooldown.",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_redirection",
    "name": "Necramech Redirection",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "shield": 9.0909
    },
    "description": "+100% Shield Capacity",
    "rarity": "common"
  },
  {
    "id": "necramech_refuel",
    "name": "Necramech Refuel",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "+20% Engine Replenish",
    "rarity": "common"
  },
  {
    "id": "necramech_repair",
    "name": "Necramech Repair",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "health": 2.5,
      "cooldown": 3.75
    },
    "description": "Restore 10% Health/s over 3s when Health drops below 20%. 15s Cooldown.",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_seismic_wave",
    "name": "Necramech Seismic Wave",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "damage": 7.5
    },
    "description": "+45% Slam Attack Damage",
    "rarity": "rare"
  },
  {
    "id": "necramech_slipstream",
    "name": "Necramech Slipstream",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "slideSpeed": 10.0
    },
    "description": "+60% Slide",
    "rarity": "common"
  },
  {
    "id": "necramech_stamina",
    "name": "Necramech Stamina",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "-60% Sprint Efficiency",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_steel_fiber",
    "name": "Necramech Steel Fiber",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "armor": 16.6667
    },
    "description": "+100% Armor",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_streamline",
    "name": "Necramech Streamline",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "abilityEfficiency": 5
    },
    "description": "+30% Ability Efficiency",
    "rarity": "rare"
  },
  {
    "id": "necramech_stretch",
    "name": "Necramech Stretch",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "abilityRange": 7.5
    },
    "description": "+45% Ability Range",
    "rarity": "uncommon"
  },
  {
    "id": "necramech_thrusters",
    "name": "Necramech Thrusters",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 3,
    "category": "necramech",
    "subCategory": "",
    "stats": {},
    "description": "+100% Engine Max",
    "rarity": "rare"
  },
  {
    "id": "necramech_vitality",
    "name": "Necramech Vitality",
    "polarity": "vazarin",
    "drain": 6,
    "maxRank": 5,
    "category": "necramech",
    "subCategory": "",
    "stats": {
      "health": 16.6667
    },
    "description": "+100% Health",
    "rarity": "common"
  },
  {
    "id": "netra",
    "name": "Netra",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Carrion hordes trill their profane  Accord with eldritch plans",
    "rarity": "rare"
  },
  {
    "id": "nidri_tauron_strike",
    "name": "Nidri Tauron Strike",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Summon forth Nidri from the Void and plant the noble staff into the ground, creating a titanic splash of water that becomes a lingering vortex for 20s. 50% of damage dealt to enemies caught in the vortex is also inflicted upon all other enemies within it.",
    "rarity": "rare"
  },
  {
    "id": "nirasetmod",
    "name": "Nirasetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "nitro_boost",
    "name": "Nitro Boost",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+30% K-Drive Boost Speed",
    "rarity": "rare"
  },
  {
    "id": "no_quarter",
    "name": "No Quarter",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Killing a disarmed enemy increases Operator energy regen rate by 10% for 10s. 4 Max Stacks.",
    "rarity": "rare"
  },
  {
    "id": "noble_cadence",
    "name": "Noble Cadence",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "onslaught_matrix",
    "name": "Onslaught Matrix",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 3.333333
    },
    "description": "+22% Turret Damage while 100% Hull\\n20% chance to Reflect 38% Damage while over 80% Shields\\n+9% Battle Mod Efficiency",
    "rarity": "uncommon"
  },
  {
    "id": "opening_slam",
    "name": "Opening Slam",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Performing a Slam as Operator switches to Warframe and grants double Combo gain for 20s.",
    "rarity": "uncommon"
  },
  {
    "id": "ordnance_cheap_shot",
    "name": "Ordnance Cheap Shot",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Ordnance weapons have a +90% chance to not consume Munitions",
    "rarity": "rare"
  },
  {
    "id": "ordnance_velocity",
    "name": "Ordnance Velocity",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "ordnanceSpeed": 10
    },
    "description": "+60% Ordnance Projectile Speed",
    "rarity": "rare"
  },
  {
    "id": "orgone_tuning_matrix",
    "name": "Orgone Tuning Matrix",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "heat": 3.0
    },
    "description": "+33.75% Forge Capacity, <LOWER_IS_BETTER>-22.5% Forge Cooldown, +22.5% Elemental Resistance, +27% Turret Heat Capacity ",
    "rarity": "uncommon"
  },
  {
    "id": "oull",
    "name": "Oull",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Through endless faces, countless forms, a multitude unfolds.  (Mimics any Requiem Mod)",
    "rarity": "rare"
  },
  {
    "id": "out_of_sight",
    "name": "Out Of Sight",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "range": 18.0
    },
    "description": "Blinds enemies within 18m on Mercy Kill",
    "rarity": "rare"
  },
  {
    "id": "overloader",
    "name": "Overloader",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magazine": 21.75
    },
    "description": "+87% Maximum Ordnance Munitions",
    "rarity": "common"
  },
  {
    "id": "overwhelming_power",
    "name": "Overwhelming Power",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "abilityStrength": 1.25
    },
    "description": "Gain +5% Ability Strength for each enemy hit by the initial Tauron Strike for 30s. Max +50%.",
    "rarity": "rare"
  },
  {
    "id": "parallax_scope",
    "name": "Parallax Scope",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "criticalChance": 25
    },
    "description": "+100% Critical Chance",
    "rarity": "common"
  },
  {
    "id": "particle_ram",
    "name": "Particle Ram",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Railjack Ram that deals damage to anything it touches when moving forward.",
    "rarity": "rare"
  },
  {
    "id": "peculiar_audience",
    "name": "Peculiar Audience",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cooldown": 3.333333
    },
    "description": "Killing an enemy has a 60% chance to amuse a certain Void entity. Cooldown: 20s.",
    "rarity": "uncommon"
  },
  {
    "id": "peculiar_bloom",
    "name": "Peculiar Bloom",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Critical hits cause flowers to grow from the wounds.",
    "rarity": "uncommon"
  },
  {
    "id": "peculiar_end",
    "name": "Peculiar End",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Finisher kills have a 100% chance to dissolve enemies in dread.",
    "rarity": "common"
  },
  {
    "id": "peculiar_growth",
    "name": "Peculiar Growth",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 1.0
    },
    "description": "Damaging an enemy will inflate the body part hit for 6s.",
    "rarity": "uncommon"
  },
  {
    "id": "perfect_balance",
    "name": "Perfect Balance",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+66% Chance to Resist Falls",
    "rarity": "uncommon"
  },
  {
    "id": "persistent_posture",
    "name": "Persistent Posture",
    "polarity": "penjaga",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 10.0
    },
    "description": "The companion will pick a target and then attack it relentlessly. +40% Impact Damage",
    "rarity": "common"
  },
  {
    "id": "phoenix_blaze",
    "name": "Phoenix Blaze",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Wreathes the Railjack in fire, increasing Turret Damage and Speed.",
    "rarity": "uncommon"
  },
  {
    "id": "phoenix_spirit",
    "name": "Phoenix Spirit",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Elemental Damage increased by |PERCENT|%.",
    "rarity": "common"
  },
  {
    "id": "phoenix_talons",
    "name": "Phoenix Talons",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Physical Damage and Operator Damage increased by 30%.",
    "rarity": "common"
  },
  {
    "id": "piercing_fury",
    "name": "Piercing Fury",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "pistol_riven_mod",
    "name": "Pistol Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "poise",
    "name": "Poise",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Gain immunity to slow, stagger, and knockdown effects for 40s after transferring between Operator or Warframe.",
    "rarity": "common"
  },
  {
    "id": "poisonous_sting",
    "name": "Poisonous Sting",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "toxin": 20
    },
    "description": "+120% <DT_POISON_COLOR>Toxin",
    "rarity": "uncommon"
  },
  {
    "id": "polar_magazine",
    "name": "Polar Magazine",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "cold": 20
    },
    "description": "+120% <DT_FREEZE_COLOR>Cold",
    "rarity": "uncommon"
  },
  {
    "id": "pop_top",
    "name": "Pop Top",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "-60% Jump Charge Time",
    "rarity": "uncommon"
  },
  {
    "id": "poppin_vert",
    "name": "Poppin' Vert",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+80% K-Drive Double Jump Height",
    "rarity": "rare"
  },
  {
    "id": "power_drain",
    "name": "Power Drain",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "abilityStrength": 50
    },
    "description": "Next ability cast after Mercy Kill gains +50% Ability Strength",
    "rarity": "uncommon"
  },
  {
    "id": "power_spike",
    "name": "Power Spike",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Melee Combo Counter now decays while out of combat by 5 every few seconds, instead of depleting completely.",
    "rarity": "common"
  },
  {
    "id": "power_transfer",
    "name": "Power Transfer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "100% Amp Critical Damage for 20s on switching to Operator. 50% Casting Speed on switching to Warframe.",
    "rarity": "uncommon"
  },
  {
    "id": "predator",
    "name": "Predator",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "turretCritChance": 8.333,
      "criticalChance": 8.333333
    },
    "description": "+50% Turret Critical Chance",
    "rarity": "uncommon"
  },
  {
    "id": "primed_ammo_chain",
    "name": "Primed Ammo Chain",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 10,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "ammoMaximum": 15
    },
    "description": "+165% Ammo Maximum",
    "rarity": "legendary"
  },
  {
    "id": "primed_ammo_stock",
    "name": "Primed Ammo Stock",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magazine": 10
    },
    "description": "+110% Magazine Capacity",
    "rarity": "legendary"
  },
  {
    "id": "primed_blunderbuss",
    "name": "Primed Blunderbuss",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "criticalChance": 15
    },
    "description": "+165% Critical Chance",
    "rarity": "legendary"
  },
  {
    "id": "primed_cleanse_corpus",
    "name": "Primed Cleanse Corpus",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.55 Damage to Corpus",
    "rarity": "legendary"
  },
  {
    "id": "primed_cleanse_grineer",
    "name": "Primed Cleanse Grineer",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.55 Damage to Grineer",
    "rarity": "legendary"
  },
  {
    "id": "primed_cleanse_infested",
    "name": "Primed Cleanse Infested",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.55 Damage to Infested",
    "rarity": "legendary"
  },
  {
    "id": "primed_cleanse_orokin",
    "name": "Primed Cleanse Orokin",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionOrokin": 5
    },
    "description": "x1.55 Damage to Orokin",
    "rarity": "legendary"
  },
  {
    "id": "primed_cleanse_the_murmur",
    "name": "Primed Cleanse The Murmur",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionMurmur": 5
    },
    "description": "x1.55 Damage to Murmur",
    "rarity": "legendary"
  },
  {
    "id": "primed_combustion_rounds",
    "name": "Primed Combustion Rounds",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "heat": 17
    },
    "description": "+187% <DT_FIRE_COLOR>Heat",
    "rarity": "legendary"
  },
  {
    "id": "primed_counterbalance",
    "name": "Primed Counterbalance",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "recoil": -7.7273
    },
    "description": "-85% Weapon Recoil",
    "rarity": "legendary"
  },
  {
    "id": "primed_deadly_efficiency",
    "name": "Primed Deadly Efficiency",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 10,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "damage": 20,
      "duration": 1.5
    },
    "description": "On Reload From Empty:\\n+220% Damage for 16.5s",
    "rarity": "legendary"
  },
  {
    "id": "primed_dual_rounds",
    "name": "Primed Dual Rounds",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "multishot": 10
    },
    "description": "+110% Multishot",
    "rarity": "legendary"
  },
  {
    "id": "primed_rubedo_lined_barrel",
    "name": "Primed Rubedo-Lined Barrel",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "damage": 17
    },
    "description": "+187% Damage",
    "rarity": "legendary"
  },
  {
    "id": "primed_shotgun_ammo_mutation",
    "name": "Primed Shotgun Ammo Mutation",
    "polarity": "naramon",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "ammoConversion": 8.363636
    },
    "description": "Converts Secondary ammo pickups to 92% of Ammo Pick Up.",
    "rarity": "legendary"
  },
  {
    "id": "primed_venomous_clip",
    "name": "Primed Venomous Clip",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "toxin": 17
    },
    "description": "+187% <DT_POISON_COLOR>Toxin",
    "rarity": "legendary"
  },
  {
    "id": "primo_flair",
    "name": "Primo Flair",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "Increase Maximum Trick Combo to 6000",
    "rarity": "rare"
  },
  {
    "id": "prismatic_beam",
    "name": "Prismatic Beam",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Enemies struck by the Tauron Strike fire off smaller beams at other enemies within 20m.",
    "rarity": "rare"
  },
  {
    "id": "prize_kill",
    "name": "Prize Kill",
    "polarity": "vazarin",
    "drain": 10,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "shield": -25,
      "duration": 2.5,
      "health": -6.25
    },
    "description": "On Kill:\\n-100% Shield Recharge Delay for 10s, -25% from Health Orbs",
    "rarity": "rare"
  },
  {
    "id": "protective_shots",
    "name": "Protective Shots",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "+30% Turret Damage when Shields are above 75%",
    "rarity": "uncommon"
  },
  {
    "id": "protective_sling",
    "name": "Protective Sling",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Allies touched by Void Sling are granted immunity from damage for 5s and healed 60% over 5s for 10 energy cost.",
    "rarity": "rare"
  },
  {
    "id": "protector_posture",
    "name": "Protector Posture",
    "polarity": "penjaga",
    "drain": -2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "range": 3.75
    },
    "description": "The companion will prioritize attacking enemies within 15m of the Warframe. Attacks inflict +4 <DT_PUNCTURE_COLOR> Puncture Status Effects",
    "rarity": "common"
  },
  {
    "id": "quaking_hand",
    "name": "Quaking Hand",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "quasar_drill",
    "name": "Quasar Drill",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "puncture": 15
    },
    "description": "+90% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "quick_correct",
    "name": "Quick Correct",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Gain 10% Disinfection and 10% chance to drop a Live Heartcell ",
    "rarity": "rare"
  },
  {
    "id": "quick_escape",
    "name": "Quick Escape",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "duration": 1.25
    },
    "description": "Gain invulnerability for 5s mounting a K-drive, but will expire early upon dismounting. ",
    "rarity": "rare"
  },
  {
    "id": "quick_reload",
    "name": "Quick Reload",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 25
    },
    "description": "+100% Reload Speed",
    "rarity": "uncommon"
  },
  {
    "id": "quicklock",
    "name": "Quicklock",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "-112.5% Ordnance Lock-On Time",
    "rarity": "common"
  },
  {
    "id": "raider_matrix",
    "name": "Raider Matrix",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 7.5,
      "shield": 4.0
    },
    "description": "+22% Archwing Speed and Damage\\n+36% Archwing Shield and Armor\\n+67% Captured Crewship Speed and Damage",
    "rarity": "uncommon"
  },
  {
    "id": "rail_guards",
    "name": "Rail Guards",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+30% K-Drive Grind Speed",
    "rarity": "common"
  },
  {
    "id": "rain_of_arrows",
    "name": "Rain of Arrows",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "On dealing damage, fire an arrow at an enemy with 0.35s cooldown between arrows. 30s duration.",
    "rarity": "rare"
  },
  {
    "id": "raptorsetmod",
    "name": "Raptorsetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "reinforced_return",
    "name": "Reinforced Return",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Warframe is invulnerable for 4s after Operator is downed. Tap <USE> as Operator falls to bring the Warframe to the Operator\u2019s location.",
    "rarity": "uncommon"
  },
  {
    "id": "rejuvenating_tides",
    "name": "Rejuvenating Tides",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Operator Health Regeneration is increased by 6/s, and is doubled while controlling the Warframe.",
    "rarity": "rare"
  },
  {
    "id": "rending_crane",
    "name": "Rending Crane",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Downward cuts with an impact combo.",
    "rarity": "uncommon"
  },
  {
    "id": "rending_wind",
    "name": "Rending Wind",
    "polarity": "zenurik",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "repeater_clip",
    "name": "Repeater Clip",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "fireRate": 17.5,
      "duration": 1.5
    },
    "description": "On Reload:\\n+105% Fire Rate when Aiming for 9s",
    "rarity": "uncommon"
  },
  {
    "id": "resolute_focus",
    "name": "Resolute Focus",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "accuracy": 8.3333
    },
    "description": "+100% Chance to Resist Staggers/Knockdowns when Aiming, +50% Accuracy when Aiming",
    "rarity": "uncommon"
  },
  {
    "id": "revo_reducer",
    "name": "Revo Reducer",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "-60.8% Omni Revolite Consumption",
    "rarity": "rare"
  },
  {
    "id": "rifle_riven_mod",
    "name": "Rifle Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "rift_waters",
    "name": "Rift Waters",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Vortex strips enemy Overguard 25% per second.",
    "rarity": "uncommon"
  },
  {
    "id": "ripload",
    "name": "Ripload",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "reloadSpeed": -7.0
    },
    "description": "-63% Ordnance Reload Time",
    "rarity": "common"
  },
  {
    "id": "ris",
    "name": "Ris",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "In luminous space blackened stars  They gaze, accuse, deny",
    "rarity": "rare"
  },
  {
    "id": "rising_blast",
    "name": "Rising Blast",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Void Blast Damage by 200% and it can now be charged to deal additional damage.",
    "rarity": "uncommon"
  },
  {
    "id": "rising_steel",
    "name": "Rising Steel",
    "polarity": "unairu",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "rubedo_lined_barrel",
    "name": "Rubedo-Lined Barrel",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "damage": 16.6667
    },
    "description": "+100% Damage",
    "rarity": "uncommon"
  },
  {
    "id": "runtime",
    "name": "Runtime",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 75,
      "duration": 15.0
    },
    "description": "+75% Sprint Speed for 15s after Hacking",
    "rarity": "rare"
  },
  {
    "id": "sabot_rounds",
    "name": "Sabot Rounds",
    "polarity": "naramon",
    "drain": 10,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.5,
      "damage": 10
    },
    "description": "+60% Damage, +3 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "sacrificesetmod",
    "name": "Sacrificesetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },

  {
    "id": "scarlet_hurricane",
    "name": "Scarlet Hurricane",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "scourging_warheads",
    "name": "Scourging Warheads",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "shield": 8.5
    },
    "description": "+76.5% chance for Ordnance to ignore enemy Shields",
    "rarity": "uncommon"
  },
  {
    "id": "searing_steel",
    "name": "Searing Steel",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "heat": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FIRE_COLOR>Heat, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "section_density",
    "name": "Section Density",
    "polarity": "madurai",
    "drain": 10,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "turretCritDamage": 8.333,
      "criticalMultiplier": 8.333333
    },
    "description": "+50% Turret Critical Damage",
    "rarity": "uncommon"
  },
  {
    "id": "seeker_volley",
    "name": "Seeker Volley",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Fires a volley of homing missiles.",
    "rarity": "uncommon"
  },
  {
    "id": "seismic_impact",
    "name": "Seismic Impact",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Cogron Tauron Strikes enable their shockwave effect for the next 4 aerial Melee slam attacks.",
    "rarity": "rare"
  },
  {
    "id": "semi_shotgun_cannonade",
    "name": "Semi-Shotgun Cannonade",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.25,
      "damage": 40
    },
    "description": "Only compatible with Semi-Auto Trigger. Fire Rate cannot be modified.\\n+240% Damage\\n+1.5 Punch Through",
    "rarity": "uncommon"
  },
  {
    "id": "sentient_scalpel",
    "name": "Sentient Scalpel",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "x1.41 Turret Damage vs Sentients",
    "rarity": "rare"
  },
  {
    "id": "shadow_harvest",
    "name": "Shadow Harvest",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "shatter_burst",
    "name": "Shatter Burst",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Delivers a barrage of explosions across a large area.",
    "rarity": "common"
  },
  {
    "id": "shattering_storm",
    "name": "Shattering Storm",
    "polarity": "vazarin",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Methodical strikes and high impact combos.",
    "rarity": "uncommon"
  },
  {
    "id": "shell_compression",
    "name": "Shell Compression",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "ammoMaximum": 15
    },
    "description": "+90% Ammo Maximum",
    "rarity": "uncommon"
  },
  {
    "id": "shell_rush",
    "name": "Shell Rush",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "fireRate": 12.5
    },
    "description": "+50% Charge Rate",
    "rarity": "uncommon"
  },
  {
    "id": "shotgun_barrage",
    "name": "Shotgun Barrage",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "fireRate": 15
    },
    "description": "+90% Fire Rate",
    "rarity": "uncommon"
  },
  {
    "id": "shotgun_elementalist",
    "name": "Shotgun Elementalist",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "statusDamage": 15,
      "magazine": 10
    },
    "description": "+90% Status Damage, +60% Magazine Capacity",
    "rarity": "uncommon"
  },
  {
    "id": "shotgun_riven_mod",
    "name": "Shotgun Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "shotgun_savvy",
    "name": "Shotgun Savvy",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "statusChance": 15
    },
    "description": "+90% Status Chance",
    "rarity": "uncommon"
  },
  {
    "id": "shrapnel_shot",
    "name": "Shrapnel Shot",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 16.5,
      "duration": 1.5
    },
    "description": "On Kill:\\n+99% Critical Damage when Aiming for 9s",
    "rarity": "common"
  },
  {
    "id": "shred_shot",
    "name": "Shred Shot",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 5.0
    },
    "description": "20% of Damage converted into <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "uncommon"
  },
  {
    "id": "shredder",
    "name": "Shredder",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "slash": 15
    },
    "description": "+90% <DT_SLASH_COLOR>Slash",
    "rarity": "common"
  },
  {
    "id": "silent_battery",
    "name": "Silent Battery",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "noiseReduction": 25.0
    },
    "description": "Reduces the chance an enemy will hear gunfire by 100%.",
    "rarity": "uncommon"
  },
  {
    "id": "slay_board",
    "name": "Slay Board",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "explosionDamage": 100.0
    },
    "description": "On Directional Dismount:\\nBoard is launched, dealing 400 Damage while slicing enemies.",
    "rarity": "uncommon"
  },
  {
    "id": "slicing_feathers",
    "name": "Slicing Feathers",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Twirling, acrobatic slashes with a refined touch.",
    "rarity": "rare"
  },
  {
    "id": "sling_strength",
    "name": "Sling Strength",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Switching to Warframe after a Chained Sling adds 40% Ability Strength for 20s.",
    "rarity": "rare"
  },
  {
    "id": "sling_stun",
    "name": "Sling Stun",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Second Ability increases the width of the next Void Sling by 200% and enemies hit are vulnerable to Finishers, taking 30% more finisher damage.",
    "rarity": "uncommon"
  },
  {
    "id": "snap_shot",
    "name": "Snap Shot",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "sprintSpeed": 5
    },
    "description": "+20% Movement Speed when Aiming",
    "rarity": "uncommon"
  },
  {
    "id": "soft_hands",
    "name": "Soft Hands",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "accuracy": -10.0,
      "duration": 2.0
    },
    "description": "On Equip: \\n<LOWER_IS_BETTER>-40% Weapon Recoil and +40% Accuracy for 8s",
    "rarity": "uncommon"
  },
  {
    "id": "soft_safe",
    "name": "Soft Safe",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Keeping software safe by ALWAYS WATCHING",
    "rarity": "rare"
  },
  {
    "id": "sonic_boost",
    "name": "Sonic Boost",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "duration": 2.5,
      "range": 1.0
    },
    "description": "Every <LOWER_IS_BETTER>10s, boosting will release a shockwave, stunning enemies in 4m.",
    "rarity": "rare"
  },
  {
    "id": "sonic_dash",
    "name": "Sonic Dash",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Sling no longer displaces enemies, instead it emits a shockwave 14m wide and travels 8m stunning any enemy it hits.",
    "rarity": "rare"
  },
  {
    "id": "sovereign_outcast",
    "name": "Sovereign Outcast",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "An outlandish style with sweeping attacks.",
    "rarity": "rare"
  },
  {
    "id": "spectral_blades",
    "name": "Spectral Blades",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Summon 4 spectral swords that are copies of equipped melee weapon. Melee attacks will simultaneously trigger spectral attacks on any enemies within 10m for 30s. Spectral sword hits increase Combo Count and grant extra Tauron Strike Charge. Spectral swords are granted to all players in Affinity Range.",
    "rarity": "rare"
  },
  {
    "id": "spectral_pages",
    "name": "Spectral Pages",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Create 4 spectral pages granting an additional 10% Cast Speed, Ability Strength, Duration, and 100 bonus Energy per page.",
    "rarity": "rare"
  },
  {
    "id": "spidersetmod",
    "name": "Spidersetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "squad_regen",
    "name": "Squad Regen",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "When Void Regen reaches its maximum, it is applied to squad members within Affinity Range for 60s.",
    "rarity": "rare"
  },
  {
    "id": "squad_renew",
    "name": "Squad Renew",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cooldown": 50.0
    },
    "description": "Heal all Railjack squad members by 100%.\\nCooldown: 300s",
    "rarity": "rare"
  },
  {
    "id": "star_divide",
    "name": "Star Divide",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "static_purge",
    "name": "Static Purge",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "100% chance to clear Transference Static on kill while Reinforced Return is active.",
    "rarity": "rare"
  },
  {
    "id": "stone_skin",
    "name": "Stone Skin",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Armor for Warframe and Operator by 200.",
    "rarity": "uncommon"
  },
  {
    "id": "strainsetmod",
    "name": "Strainsetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "sudden_impact",
    "name": "Sudden Impact",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "statusChance": 10
    },
    "description": "+60% Status Chance",
    "rarity": "common"
  },
  {
    "id": "sundered_bounty",
    "name": "Sundered Bounty",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Shockwaves generate 5 pickups, in the form of Universal Orbs or Ammo.",
    "rarity": "uncommon"
  },
  {
    "id": "sundering_dash",
    "name": "Sundering Dash",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 5,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Using Void Sling through an enemy will reduce their Armor by 75%.",
    "rarity": "rare"
  },
  {
    "id": "surging_storm",
    "name": "Surging Storm",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Increase Rain of Arrows radius to 5m.",
    "rarity": "uncommon"
  },
  {
    "id": "sweeping_serration",
    "name": "Sweeping Serration",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "slash": 20
    },
    "description": "+120% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "swelling_deluge",
    "name": "Swelling Deluge",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Increase vortex duration to 40s.",
    "rarity": "uncommon"
  },
  {
    "id": "swift_mercy",
    "name": "Swift Mercy",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Speed of Mercy Kills increased by 50%",
    "rarity": "common"
  },
  {
    "id": "synthsetmod",
    "name": "Synthsetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "tainted_hydra",
    "name": "Tainted Hydra",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "teksetmod",
    "name": "Teksetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "tempered_benison",
    "name": "Tempered Benison",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Shockwaves create 5 Armor Motes that grant +450 temporary Armor. Max 5.",
    "rarity": "rare"
  },
  {
    "id": "tempered_blade",
    "name": "Tempered Blade",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "archmelee",
    "subCategory": "",
    "stats": {
      "criticalChance": 25
    },
    "description": "+150% Critical Chance",
    "rarity": "common"
  },
  {
    "id": "temporal_drag",
    "name": "Temporal Drag",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Second Ability emits a radial burst slowing any enemy it touches by 80% for 10s.",
    "rarity": "uncommon"
  },
  {
    "id": "temporal_shot",
    "name": "Temporal Shot",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Precision head shot damage increased by 100% on enemies afflicted with Temporal Drag.",
    "rarity": "rare"
  },
  {
    "id": "tether",
    "name": "Tether",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Ensnares enemies, increasing vulnerability to Railjack weaponry.",
    "rarity": "uncommon"
  },
  {
    "id": "thara_tauron_strike",
    "name": "Thara Tauron Strike",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Summon forth Thara from the Void and fire the great bow into the air, blanketing the area with a rain of explosive arrows for 7s.",
    "rarity": "rare"
  },
  {
    "id": "thrash_landing",
    "name": "Thrash Landing",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {
      "damage": 10.0,
      "range": 1.0
    },
    "description": "Landing a trick releases an explosion dealing 40% Trick Score <DT_EXPLOSION_COLOR>Blast Damage to enemies within 4m.",
    "rarity": "rare"
  },
  {
    "id": "threat_blocker",
    "name": "Threat Blocker",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Gain 10% Disinfection and 25% chance to drop a Potency mod",
    "rarity": "uncommon"
  },
  {
    "id": "trail_blazer",
    "name": "Trail Blazer",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "Tricks leave a trail inflicting 40 <DT_FIRE_COLOR>Heat Damage to enemies.",
    "rarity": "common"
  },
  {
    "id": "tranquil_cleave",
    "name": "Tranquil Cleave",
    "polarity": "madurai",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Powerful arcs with frenzied combo.",
    "rarity": "rare"
  },

  {
    "id": "trojan_tracker",
    "name": "Trojan Tracker",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Eliminating sneaky viruses since 1989",
    "rarity": "rare"
  },
  {
    "id": "turbo_protect",
    "name": "Turbo Protect",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Gain 10% Disinfection and 25% chance to drop an Antivirus mod",
    "rarity": "rare"
  },
  {
    "id": "turret_velocity",
    "name": "Turret Velocity",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "turretRange": 2.3,
      "turretProjectileSpeed": 5,
      "range": 2.3
    },
    "description": "+25.3% Turret Range, +55% Turret Projectile Speed",
    "rarity": "rare"
  },
  {
    "id": "umbrasetmod",
    "name": "Umbrasetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "unairu_wisp",
    "name": "Unairu Wisp",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "100% chance to summon an Unairu Wisp per enemy hit by Caustic Strike. The Wisp will seek out the nearest ally within Affinity Range, increasing Operator damage by 100% for 20s.",
    "rarity": "rare"
  },

  {
    "id": "untraceable",
    "name": "Untraceable",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 15.0
    },
    "description": "Invisible for 15s after Hacking",
    "rarity": "rare"
  },
  {
    "id": "vapor_trail",
    "name": "Vapor Trail",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 10,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "Add 11 Boost Speed. Consumes 10 Energy/s",
    "rarity": "common"
  },
  {
    "id": "vazarin_transmute_core",
    "name": "Vazarin Transmute Core",
    "polarity": "vazarin",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Ensures transmuted mod is of Vazarin polarity and eliminates credit cost.",
    "rarity": "rare"
  },
  {
    "id": "venerdo_hoverdrive",
    "name": "Venerdo Hoverdrive",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "kdrive",
    "subCategory": "",
    "stats": {},
    "description": "+30% K-Drive Jump Height",
    "rarity": "uncommon"
  },
  {
    "id": "vengeance",
    "name": "Vengeance",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "During Last Gasp, Operator Damage is increased by 100% plus an additional 25% per second.",
    "rarity": "rare"
  },
  {
    "id": "venomous_clip",
    "name": "Venomous Clip",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "toxin": 20
    },
    "description": "+120% <DT_POISON_COLOR>Toxin",
    "rarity": "uncommon"
  },
  {
    "id": "vexoric_tauron_strike",
    "name": "Vexoric Tauron Strike",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Summon forth Vexoric from the Void and swing the colossal sword, unleashing a wave of devastating energy. Gain +8 Melee Combo from each enemy hit.",
    "rarity": "rare"
  },
  {
    "id": "vicious_approach",
    "name": "Vicious Approach",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Fighting form devised for Conclave.",
    "rarity": "uncommon"
  },
  {
    "id": "vigilantesetmod",
    "name": "Vigilantesetmod",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "",
    "rarity": "common"
  },
  {
    "id": "void_aegis",
    "name": "Void Aegis",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode creates a shield that grows up to 12m over 5s. This ability costs an additional 2 Energy/s.",
    "rarity": "uncommon"
  },
  {
    "id": "void_chrysalis",
    "name": "Void Chrysalis",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode reduces damage taken by invisible allies within 25m by 80%. This ability costs an additional 4 Energy/s.",
    "rarity": "uncommon"
  },
  {
    "id": "void_cloak",
    "name": "Void Cloak",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "duration": 5.833333,
      "cooldown": 20.0
    },
    "description": "Cloak from Enemies for 50s\\nEngine Speed reduced to 50%\\nCooldown: 120s",
    "rarity": "common"
  },
  {
    "id": "void_flow",
    "name": "Void Flow",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Operator Energy by 90%.",
    "rarity": "rare"
  },
  {
    "id": "void_fuel",
    "name": "Void Fuel",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "40% Weapon Efficiency for Operator and Warframe while Void Strike is active.",
    "rarity": "uncommon"
  },
  {
    "id": "void_hole",
    "name": "Void Hole",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "A black hole that draws in enemies, dealing damage.",
    "rarity": "rare"
  },
  {
    "id": "void_hunter",
    "name": "Void Hunter",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode reveals enemies within 25m through walls. This range gradually decreases over 5s when the Operator leaves Void Mode. This ability costs an additional 1 Energy/s.",
    "rarity": "uncommon"
  },
  {
    "id": "void_levitation",
    "name": "Void Levitation",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "First Ability creates a 6m wide shockwave lasting 4s, that inflicts Lift Status on all enemies it touches.",
    "rarity": "uncommon"
  },
  {
    "id": "void_radiance",
    "name": "Void Radiance",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Consumes 50 Energy on leaving Void Mode to blind enemies within 10m for 5s.",
    "rarity": "uncommon"
  },
  {
    "id": "void_regen",
    "name": "Void Regen",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode starts healing at +10 Health per second, increasing by 10 per second up to a maximum of 50.",
    "rarity": "uncommon"
  },
  {
    "id": "void_shadow",
    "name": "Void Shadow",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode now renders allies within 40m invisible. This ability costs an additional 4 Energy/s per ally cloaked.",
    "rarity": "uncommon"
  },
  {
    "id": "void_singularity",
    "name": "Void Singularity",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode pulls enemies within 20m towards the Operator, and costs an additional 2 Energy/s.",
    "rarity": "rare"
  },
  {
    "id": "void_siphon",
    "name": "Void Siphon",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Increases Operator Energy Regeneration by 90%.",
    "rarity": "uncommon"
  },
  {
    "id": "void_snare",
    "name": "Void Snare",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Second Ability Launches a projectile that spins up a vortex trap on impact, or tap <ACTIVATE_ABILITY_1> again to detonate in-flight. Trap lasts 8s. Void Sling through trapped enemies to grant allies within Affinity Range 100 Health.",
    "rarity": "uncommon"
  },
  {
    "id": "void_spines",
    "name": "Void Spines",
    "polarity": "unairu",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "100% Damage taken is returned to the attacker.",
    "rarity": "uncommon"
  },
  {
    "id": "void_stalker",
    "name": "Void Stalker",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode increases Critical Chance of melee attacks by up to 50% over 5s. This chance gradually decreases over 20s when the Operator leaves Void Mode. This ability costs an additional 4 Energy/s.",
    "rarity": "uncommon"
  },
  {
    "id": "void_static",
    "name": "Void Static",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Mode emits a pulse that deals 500 Damage/s over 15m, and costs an additional 1 Energy/s.",
    "rarity": "uncommon"
  },
  {
    "id": "void_strike",
    "name": "Void Strike",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "First Ability consumes all energy to increase damage for 8s. Deal 10% additional damage for every percentage of energy consumed. 40s cooldown.",
    "rarity": "uncommon"
  },
  {
    "id": "voltaic_blast",
    "name": "Voltaic Blast",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "operator",
    "subCategory": "",
    "stats": {},
    "description": "Void Blast creates a surge of electricity, zapping enemies within 10m for 200% Damage.",
    "rarity": "uncommon"
  },
  {
    "id": "vome",
    "name": "Vome",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "To cosmic madness laws submit  Though stalwart minds entreat",
    "rarity": "rare"
  },
  {
    "id": "votive_onslaught",
    "name": "Votive Onslaught",
    "polarity": "naramon",
    "drain": -2,
    "maxRank": 3,
    "category": "stance",
    "subCategory": "weapon",
    "stats": {},
    "description": "Precise, focused arcs and cuts not hampered by pity.",
    "rarity": "rare"
  },
  {
    "id": "warhead",
    "name": "Warhead",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "ordnanceDamage": 9.09,
      "damage": 9.090909
    },
    "description": "+100% Ordnance Damage",
    "rarity": "uncommon"
  },
  {
    "id": "waveband_disruptor",
    "name": "Waveband Disruptor",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "shield": 8.5
    },
    "description": "+76.5% chance for Turret Critical Hits to ignore enemy Shields",
    "rarity": "uncommon"
  },
  {
    "id": "wellspring",
    "name": "Wellspring",
    "polarity": "zenurik",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "First Ability creates a well of energy for 8s. Allies passing through the well gain 5 Energy/s for 30s.",
    "rarity": "uncommon"
  },
  {
    "id": "worm_away",
    "name": "Worm Away",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Get rid of malware, spyware, wetware and worms",
    "rarity": "rare"
  },
  {
    "id": "worms_torment",
    "name": "Worm's Torment",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "x1.27 Turret Damage vs Grineer",
    "rarity": "rare"
  },
  {
    "id": "xata",
    "name": "Xata",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "Its heralds are the stars it fells  The sky and Earth aflame",
    "rarity": "rare"
  },
  {
    "id": "zaw_riven_mod",
    "name": "Zaw Riven Mod",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 0,
    "category": "general",
    "subCategory": "",
    "stats": {},
    "description": "You will need to prove yourself before I reveal the beauty within this work.",
    "rarity": "rare"
  },
  {
    "id": "zodiac_shred",
    "name": "Zodiac Shred",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "archgun",
    "subCategory": "",
    "stats": {
      "slash": 15
    },
    "description": "+90% <DT_SLASH_COLOR>Slash",
    "rarity": "rare"
  },
  {
    "id": "accelerated_blast_r3",
    "name": "Accelerated Blast",
    "polarity": "madurai",
    "drain": 6,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "fireRate": 15,
      "puncture": 15
    },
    "description": "+60% Fire Rate, +60% <DT_PUNCTURE_COLOR>Puncture",
    "rarity": "rare"
  },
  {
    "id": "ammo_stock_r3",
    "name": "Ammo Stock",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "magazine": 10
    },
    "description": "+60% Magazine Capacity",
    "rarity": "uncommon"
  },
  {
    "id": "blunderbuss_r3",
    "name": "Blunderbuss",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "criticalChance": 15
    },
    "description": "+90% Critical Chance",
    "rarity": "common"
  },
  {
    "id": "charged_shell_r3",
    "name": "Charged Shell",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "electricity": 15
    },
    "description": "+90% <DT_ELECTRICITY_COLOR>Electricity",
    "rarity": "uncommon"
  },
  {
    "id": "chilling_grasp_r3",
    "name": "Chilling Grasp",
    "polarity": "vazarin",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cold": 15
    },
    "description": "+90% <DT_FREEZE_COLOR>Cold",
    "rarity": "uncommon"
  },
  {
    "id": "cleanse_corpus_r3",
    "name": "Cleanse Corpus",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionCorpus": 5
    },
    "description": "x1.3 Damage to Corpus",
    "rarity": "uncommon"
  },
  {
    "id": "cleanse_grineer_r3",
    "name": "Cleanse Grineer",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionGrineer": 5
    },
    "description": "x1.3 Damage to Grineer",
    "rarity": "uncommon"
  },
  {
    "id": "cleanse_infested_r3",
    "name": "Cleanse Infested",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "factionInfested": 5
    },
    "description": "x1.3 Damage to Infested",
    "rarity": "uncommon"
  },
  {
    "id": "contagious_spread_r3",
    "name": "Contagious Spread",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "toxin": 15
    },
    "description": "+90% <DT_POISON_COLOR>Toxin",
    "rarity": "uncommon"
  },
  {
    "id": "frigid_blast_r3",
    "name": "Frigid Blast",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "cold": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_FREEZE_COLOR>Cold, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "incendiary_coat_r3",
    "name": "Incendiary Coat",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "heat": 15
    },
    "description": "+90% <DT_FIRE_COLOR>Heat",
    "rarity": "uncommon"
  },
  {
    "id": "point_blank_r3",
    "name": "Point Blank",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "damage": 15
    },
    "description": "+90% Damage",
    "rarity": "uncommon"
  },
  {
    "id": "ravage_r3",
    "name": "Ravage",
    "polarity": "madurai",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "criticalMultiplier": 10
    },
    "description": "+60% Critical Damage",
    "rarity": "rare"
  },
  {
    "id": "scattering_inferno_r3",
    "name": "Scattering Inferno",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "statusChance": 15,
      "heat": 15.0
    },
    "description": "+60% <DT_FIRE_COLOR>Heat, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "seeking_force_r3",
    "name": "Seeking Force",
    "polarity": "naramon",
    "drain": 6,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "punchThrough": 0.35
    },
    "description": "+2.1 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "shell_shock_r3",
    "name": "Shell Shock",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "electricity": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_ELECTRICITY_COLOR>Electricity, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "tactical_pump_r3",
    "name": "Tactical Pump",
    "polarity": "naramon",
    "drain": 2,
    "maxRank": 5,
    "category": "general",
    "subCategory": "",
    "stats": {
      "reloadSpeed": 10
    },
    "description": "+60% Reload Speed",
    "rarity": "uncommon"
  },
  {
    "id": "tainted_shell_r10",
    "name": "Tainted Shell",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 10,
    "category": "general",
    "subCategory": "",
    "stats": {
      "accuracy": 7,
      "fireRate": -5
    },
    "description": "+77% Accuracy, -55% Fire Rate",
    "rarity": "rare"
  },
  {
    "id": "toxic_barrage_r3",
    "name": "Toxic Barrage",
    "polarity": "madurai",
    "drain": 4,
    "maxRank": 3,
    "category": "general",
    "subCategory": "",
    "stats": {
      "toxin": 15,
      "statusChance": 15
    },
    "description": "+60% <DT_POISON_COLOR>Toxin, +60% Status Chance",
    "rarity": "rare"
  },
  {
    "id": "gladiator_resolve",
    "name": "Gladiator Resolve",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "stats": {
      "health": 6.6667
    },
    "description": "+40% Health",
    "rarity": "uncommon"
  },
  {
    "id": "vigilante_offense",
    "name": "Vigilante Offense",
    "polarity": "naramon",
    "drain": 4,
    "maxRank": 5,
    "category": "rifle",
    "stats": {
      "punchThrough": 0.25
    },
    "description": "+1.5 Punch Through",
    "rarity": "rare"
  },
  {
    "id": "vigilante_vigor",
    "name": "Vigilante Vigor",
    "polarity": "vazarin",
    "drain": 4,
    "maxRank": 5,
    "category": "warframe",
    "stats": {
      "shieldRecharge": 10,
      "shieldRechargeDelay": -5,
      "shield": -5.0
    },
    "description": "+60% Shield Recharge, -30% Shield Recharge Delay",
    "rarity": "common"
  },
  {
    "id": "da_ren",
    "name": "Da-Ren",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "operatorShields": 50
    },
    "description": "+300 Operator Shields. +30 bonus for each Unairu School Mod",
    "rarity": "uncommon"
  },
  {
    "id": "empazu_shol",
    "name": "Empazu-Shol",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "tauronCharge": 2
    },
    "description": "+12% Tauron Strike Initial Charge. +2% bonus for each Mod from a unique School",
    "rarity": "rare"
  },
  {
    "id": "esti_vel_ikha",
    "name": "Esti Vel-Ikha",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "voidSlingDistance": 5
    },
    "description": "Increases maximum Void Sling distance by +30%.\\n+10% Void Sling radius for each Mod from a unique School",
    "rarity": "rare"
  },
  {
    "id": "evir_ti",
    "name": "Evir-Ti",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "tektolyst",
    "stats": {
      "operatorJumpHeight": 15
    },
    "description": "+60% Operator Jump Height",
    "rarity": "common"
  },
  {
    "id": "hayan_dabor",
    "name": "Hayan-Dabor",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampMultishot": 10
    },
    "description": "+60% Amp Multishot",
    "rarity": "common"
  },
  {
    "id": "hok_kaal",
    "name": "Hok-Kaal",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampBonusDamage": 0.5,
      "cooldown": 5
    },
    "description": "After using Void Mode, the next Amp attack deals x3.0 bonus damage (cooldown 5s)",
    "rarity": "common"
  },
  {
    "id": "kaal_zidi",
    "name": "Kaal-Zidi",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "voidModeEfficiency": 5
    },
    "description": "+30% Void Mode efficiency\\n+5% Movement Speed in Void Mode for each Naramon School Mod",
    "rarity": "uncommon"
  },
  {
    "id": "lashta_vak",
    "name": "Lashta-Vak",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "voidSlingPulse": 2,
      "range": 0.333333
    },
    "description": "Void Sling emits a pulse that breaks Containers within 12 m\\n+2m bonus for each Mod from a unique School",
    "rarity": "rare"
  },
  {
    "id": "lorun_tash",
    "name": "Lorun-Tash",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "tektolyst",
    "stats": {
      "operatorArmor": 100
    },
    "description": "+400 Operator Armor",
    "rarity": "common"
  },
  {
    "id": "metem_erun",
    "name": "Metem-Erun",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "operatorSprintSpeed": 5
    },
    "description": "Increase Operator Sprint Speed by +30%\\n+5% bonus for each Mod from a unique School",
    "rarity": "rare"
  },
  {
    "id": "metem_hakh",
    "name": "Metem-Hakh",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "operatorHealthShields": 5,
      "health": 5.0
    },
    "description": "+30% Operator Health & Shields\\n+15% bonus for each Mod from a unique School",
    "rarity": "rare"
  },
  {
    "id": "omn_evi",
    "name": "Omn-Evi",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampCriticalChance": 10,
      "ampCritDamage": 10
    },
    "description": "+60% Amp Critical Chance\\n+10% Amp Critical Damage for each Zenurik School Mod",
    "rarity": "uncommon"
  },
  {
    "id": "sey_taph",
    "name": "Sey-Taph",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "voidSlingEfficiency": 5
    },
    "description": "+30% Void Sling Efficiency",
    "rarity": "common"
  },
  {
    "id": "sil_tabol",
    "name": "Sil-Tabol",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampStatusChance": 10,
      "ampStatusDamage": 15
    },
    "description": "+60% Amp Status Chance\\n+15% Status Damage for each Vazarin School Mod",
    "rarity": "uncommon"
  },
  {
    "id": "talsek_an",
    "name": "Talsek-An",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "cooldown": 1.25,
      "duration": 0.5
    },
    "description": "Gain knockdown immunity. When knockdown is blocked, enter Void Mode for 3s (cooldown 7.5s)",
    "rarity": "common"
  },
  {
    "id": "ubri_kaneph",
    "name": "Ubri-Kaneph",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampDamage": 10,
      "ampSchoolDamage": 10
    },
    "description": "+60% Damage to Amps\\n+10% bonus for each Mod from a unique School",
    "rarity": "rare"
  },
  {
    "id": "ulashta_shol",
    "name": "Ulashta-Shol",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 3,
    "category": "tektolyst",
    "stats": {
      "transferenceStaticDuration": -15
    },
    "description": "-60% Transference Static duration",
    "rarity": "common"
  },
  {
    "id": "vik_anam",
    "name": "Vik-Anam",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampEnergy": 5,
      "ampEnergyRegen": 5
    },
    "description": "+30% Maximum Amp Energy\\n+5% Amp Energy Regen Rate for each Madurai School Mod",
    "rarity": "uncommon"
  },
  {
    "id": "vikla_safor",
    "name": "Vikla-Safor",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "ampFireRate": 5,
      "ampAmmoEfficiency": 5
    },
    "description": "+30% Amp Fire Rate. +30% Amp Ammo Efficiency",
    "rarity": "common"
  },
  {
    "id": "yar_dal",
    "name": "Yar Dal",
    "polarity": "universal",
    "drain": 0,
    "maxRank": 5,
    "category": "tektolyst",
    "stats": {
      "operatorHealth": 50
    },
    "description": "+300 Operator Health",
    "rarity": "common"
  },
  {
    "id": "corroding_barrage",
    "name": "Corroding Barrage",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "abilityStrength": 25.0
    },
    "description": "Tempest Barrage Augment: Each projectile has a 100% chance of inflicting a Corrosive Status Effect. Tempest Barrage gains 100% Ability Strength.",
    "rarity": "rare",
    "warframeId": "hydroid"
  },
  {
    "id": "divebomb_vortex",
    "name": "Divebomb Vortex",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "range": 3.0
    },
    "description": "Dive Bomb Augment - Enemies within 12 meters of the point of impact are dragged into it.",
    "rarity": "rare",
    "warframeId": "zephyr"
  },
  {
    "id": "enduring_bastille",
    "name": "Enduring Bastille",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "duration": 0.5
    },
    "description": "Bastille Augment: Killing an enemy in Bastille extends the duration by 2s. Vortex's duration is increased by 70% of its Maximum Duration for each additional Vortex thrown into it.",
    "rarity": "rare",
    "warframeId": "vauban"
  },
  {
    "id": "fatal_teleport",
    "name": "Fatal Teleport",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 50.0
    },
    "description": "Teleport Augment: Teleport will perform a Finisher on the target, dealing 200% Extra Damage. 50% of Energy cost is refunded on a kill.",
    "rarity": "rare",
    "warframeId": "ash"
  },
  {
    "id": "firequake",
    "name": "Firequake",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "knockdownChance": 25.0
    },
    "description": "Firequake augment.",
    "rarity": "rare",
    "warframeId": "ember"
  },
  {
    "id": "iron_vault",
    "name": "Iron Vault",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "damage": 75.0,
      "range": 3.75
    },
    "description": "Iron Jab Augment: Aiming Iron Jab at the ground launches Wukong into the air. Executing a slam attack increases range by 15m and applies 300% extra damage.",
    "rarity": "rare",
    "warframeId": "wukong"
  },
  {
    "id": "perpetual_vortex",
    "name": "Perpetual Vortex",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {},
    "description": "Perpetual Vortex augment.",
    "rarity": "rare",
    "warframeId": "vauban"
  },
  {
    "id": "shield_transference",
    "name": "Shield Transference",
    "polarity": "zenurik",
    "drain": 6,
    "maxRank": 3,
    "category": "augment",
    "subCategory": "",
    "stats": {
      "shield": 12.5
    },
    "description": "Shield Polarize Augment - Mag gains 50% overshields from depleted enemy shields.",
    "rarity": "rare",
    "warframeId": "mag"
  }
];

export const allMods: Mod[] = normalizeModCatalog(RAW_MODS);
export const modsMap = new Map<string, Mod>(allMods.map(m => [m.id, m]));

/** Legacy duplicate augment ids → canonical mod (saved builds). */
const MOD_ID_ALIASES: Record<string, string> = {
  augment_styanax_intrepid_stand: "intrepid_stand",
  augment_styanax_axios_javelin_aug: "axios_javelineers",
};
for (const [alias, canonical] of Object.entries(MOD_ID_ALIASES)) {
  const mod = modsMap.get(canonical);
  if (mod) modsMap.set(alias, mod);
}
