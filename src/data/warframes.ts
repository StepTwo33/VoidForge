import { Warframe } from "@/lib/types";

export const allWarframes: Warframe[] = [
  {
    "id": "ash",
    "name": "Ash",
    "health": 455,
    "shield": 270,
    "armor": 105,
    "energy": 100,
    "sprintSpeed": 1.15,
    "description": "Launches seeking shuriken that deal Slash damage and pin enemies to walls.",
    "passive": "<DT_SLASH_COLOR>Slash Status Effects inflicted on enemies do 25% increased damage and last 50% longer.",
    "abilities": [
      {
        "name": "Shuriken",
        "energyCost": 25,
        "description": "Launches seeking shuriken that deal Slash damage and pin enemies to walls.",
        "damage": 750,
        "range": 60,
        "castTime": 0.3,
        "damageType": "Slash",
        "miscStats": {
          "shurikenCount": 5,
          "autoTargetRadius": 6,
          "homingAngle": 90
        }
      },
      {
        "name": "Smoke Screen",
        "energyCost": 35,
        "description": "Drops a smoke bomb that stuns enemies and obscures their vision, rendering Ash invisible for a short time.",
        "range": 10,
        "duration": 12,
        "castTime": 0.2
      },
      {
        "name": "Teleport",
        "energyCost": 25,
        "description": "Teleport to a target and perform a Finisher. If the finisher kills the target, Ash regains a portion of the energy spent.",
        "range": 60,
        "castTime": 0.3,
        "miscStats": {
          "finisherDamageBonus": 2,
          "energyRefund": 0.5
        }
      },
      {
        "name": "Blade Storm",
        "energyCost": 0,
        "description": "Project fierce Shadow Clones of Ash upon groups of distant enemies. Join the fray using Teleport.",
        "damage": 1500,
        "range": 50,
        "castTime": 0.5,
        "damageType": "True",
        "miscStats": {
          "energyPerMark": 12,
          "invisibleMarkDiscount": 0.5,
          "shadowClones": 2,
          "hitsPerMark": 1
        }
      }
    ]
  },
  {
    "id": "ash_prime",
    "name": "Ash Prime",
    "health": 455,
    "shield": 365,
    "armor": 185,
    "energy": 100,
    "sprintSpeed": 1.2,
    "description": "Launches seeking shuriken that deal Slash damage and pin enemies to walls.",
    "passive": "<DT_SLASH>Slash Status Effects inflicted on enemies do 25% increased damage and last 50% longer.",
    "abilities": [
      {
        "name": "Shuriken",
        "energyCost": 25,
        "description": "Launches seeking shuriken that deal Slash damage and pin enemies to walls.",
        "damage": 750,
        "range": 60,
        "castTime": 0.3,
        "damageType": "Slash",
        "miscStats": {
          "shurikenCount": 5,
          "autoTargetRadius": 6,
          "homingAngle": 90
        }
      },
      {
        "name": "Smoke Screen",
        "energyCost": 35,
        "description": "Drops a smoke bomb that stuns enemies and obscures their vision, rendering Ash invisible for a short time.",
        "range": 10,
        "duration": 12,
        "castTime": 0.2
      },
      {
        "name": "Teleport",
        "energyCost": 25,
        "description": "Teleport to a target and perform a Finisher. If the finisher kills the target, Ash regains a portion of the energy spent.",
        "range": 60,
        "castTime": 0.3,
        "miscStats": {
          "finisherDamageBonus": 2,
          "energyRefund": 0.5
        }
      },
      {
        "name": "Blade Storm",
        "energyCost": 0,
        "description": "Project fierce Shadow Clones of Ash upon groups of distant enemies. Join the fray using Teleport.",
        "damage": 1500,
        "range": 50,
        "castTime": 0.5,
        "damageType": "True",
        "miscStats": {
          "energyPerMark": 12,
          "invisibleMarkDiscount": 0.5,
          "shadowClones": 2,
          "hitsPerMark": 1
        }
      }
    ]
  },
  {
    "id": "atlas",
    "name": "Atlas",
    "health": 270,
    "shield": 270,
    "armor": 475,
    "energy": 175,
    "sprintSpeed": 0.89999998,
    "description": "Bash enemies with an explosive sliding punch, repeat up to three times for a combo attack. Each hit in the three-punch combo increases the radius of the attack. Energy cost is reduced for each successive punch.",
    "passive": "Becomes immune to Knockdown effects while on the ground.",
    "abilities": [
      {
        "name": "Landslide",
        "energyCost": 25,
        "description": "Bash enemies with an explosive sliding punch, repeat up to three times for a combo attack. Each hit in the three-punch combo increases the radius of the attack. Energy cost is reduced with each hit of Landslide.",
        "damage": 350,
        "range": 12,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "hit2Radius": 6,
          "hit3Radius": 8,
          "comboWindow": 5
        }
      },
      {
        "name": "Tectonics",
        "energyCost": 50,
        "description": "Summon a Bulwark rock-wall, activate again to send the rocks crashing toward the enemy. Bulwarks attacked by enemies release an area-of-effect Slash powered by the Health it has lost.",
        "damage": 500,
        "range": 5,
        "health": 1500,
        "castTime": 0.8,
        "damageType": "Puncture",
        "miscStats": {
          "armorMultiplier": 5,
          "rollDamage": 600,
          "invulnerabilityDuration": 4,
          "rollDistance": 15,
          "slashHealthMultiplier": 1
        }
      },
      {
        "name": "Petrify",
        "energyCost": 75,
        "description": "Atlas' hardened gaze will fossilize foes increasing the damage they take, heal Rumblers, and create Petrified Bulwarks. When shattered, petrified enemies drop healing Rubble for Atlas.",
        "range": 14,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "coneAngle": 120,
          "damageVulnerability": 0.5,
          "rumblerHeal": 1
        }
      },
      {
        "name": "Rumblers",
        "energyCost": 100,
        "description": "Summon two elemental stone brawlers to the melee. Summoning petrifies enemies in close proximity to Atlas. When finished, Rumblers collapse into a pile of healing Rubble.",
        "damage": 2000,
        "range": 6,
        "duration": 45,
        "health": 1200,
        "armor": 500,
        "castTime": 1,
        "damageType": "Impact",
        "miscStats": {
          "rockDamage": 500,
          "blastDamage": 1250,
          "rumblerCount": 2,
          "speedMultiplier": 1,
          "stoneDuration": 10
        }
      }
    ]
  },
  {
    "id": "atlas_prime",
    "name": "Atlas Prime",
    "health": 550,
    "shield": 455,
    "armor": 500,
    "energy": 215,
    "sprintSpeed": 1,
    "description": "Bash enemies with an explosive sliding punch, repeat up to three times for a combo attack. Each hit in the three-punch combo increases the radius of the attack. Energy cost is reduced for each successive punch.",
    "passive": "Becomes immune to Knockdown effects while on the ground.",
    "abilities": [
      {
        "name": "Landslide",
        "energyCost": 25,
        "description": "Bash enemies with an explosive sliding punch, repeat up to three times for a combo attack. Each hit in the three-punch combo increases the radius of the attack. Energy cost is reduced with each hit of Landslide.",
        "damage": 350,
        "range": 12,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "hit2Radius": 6,
          "hit3Radius": 8,
          "comboWindow": 5
        }
      },
      {
        "name": "Tectonics",
        "energyCost": 50,
        "description": "Summon a Bulwark rock-wall, activate again to send the rocks crashing toward the enemy. Bulwarks attacked by enemies release an area-of-effect Slash powered by the Health it has lost.",
        "damage": 500,
        "range": 5,
        "health": 1500,
        "castTime": 0.8,
        "damageType": "Puncture",
        "miscStats": {
          "armorMultiplier": 5,
          "rollDamage": 600,
          "invulnerabilityDuration": 4,
          "rollDistance": 15,
          "slashHealthMultiplier": 1
        }
      },
      {
        "name": "Petrify",
        "energyCost": 75,
        "description": "Atlas' hardened gaze will fossilize foes increasing the damage they take, heal Rumblers, and create Petrified Bulwarks. When shattered, petrified enemies drop healing Rubble for Atlas.",
        "range": 14,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "coneAngle": 120,
          "damageVulnerability": 0.5,
          "rumblerHeal": 1
        }
      },
      {
        "name": "Rumblers",
        "energyCost": 100,
        "description": "Summon two elemental stone brawlers to the melee. Summoning petrifies enemies in close proximity to Atlas. When finished, Rumblers collapse into a pile of healing Rubble.",
        "damage": 2000,
        "range": 6,
        "duration": 45,
        "health": 1200,
        "armor": 500,
        "castTime": 1,
        "damageType": "Impact",
        "miscStats": {
          "rockDamage": 500,
          "blastDamage": 1250,
          "rumblerCount": 2,
          "speedMultiplier": 1,
          "stoneDuration": 10
        }
      }
    ]
  },
  {
    "id": "banshee",
    "name": "Banshee",
    "health": 270,
    "shield": 270,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Banshee emits a sonic shockwave that pushes targets in range with enough force to incapacitate or kill attackers.",
    "passive": "Weapon noises are hushed so that enemies cannot hear them.",
    "abilities": [
      {
        "name": "Sonic Boom",
        "energyCost": 25,
        "description": "Banshee emits a sonic shockwave that pushes targets in range with enough force to incapacitate or kill attackers.",
        "damage": 50,
        "range": 15,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "coneAngle": 180
        }
      },
      {
        "name": "Sonar",
        "energyCost": 50,
        "description": "Using acoustic location, Banshee's Sonar power finds and tracks enemies, and exposes critical weak spots to everyone in your squad.",
        "range": 35,
        "duration": 30,
        "castTime": 0.6,
        "miscStats": {
          "damageMultiplier": 5,
          "propagationSpeed": 20
        }
      },
      {
        "name": "Silence",
        "energyCost": 75,
        "description": "Using Silence surrounds Banshee in an aura that stuns enemies and will limit their perceptions and tactical response to gunfire and Warframe attacks.",
        "range": 20,
        "duration": 30,
        "castTime": 0.5,
        "miscStats": {
          "stunDuration": 2
        }
      },
      {
        "name": "Sound Quake",
        "energyCost": 25,
        "description": "Channeling all of her acoustic energy into the environment, Banshee uses ultrasonic reverberations to violently shake the ground.",
        "damage": 200,
        "range": 20,
        "castTime": 1,
        "damageType": "Blast",
        "miscStats": {
          "energyDrain": 12,
          "channeled": true
        }
      }
    ]
  },
  {
    "id": "banshee_prime",
    "name": "Banshee Prime",
    "health": 270,
    "shield": 270,
    "armor": 135,
    "energy": 215,
    "sprintSpeed": 1.15,
    "description": "Banshee emits a sonic shockwave that pushes targets in range with enough force to incapacitate or kill attackers.",
    "passive": "Weapon noises are hushed so that enemies cannot hear them.",
    "abilities": [
      {
        "name": "Sonic Boom",
        "energyCost": 25,
        "description": "Banshee emits a sonic shockwave that pushes targets in range with enough force to incapacitate or kill attackers.",
        "damage": 50,
        "range": 15,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "coneAngle": 180
        }
      },
      {
        "name": "Sonar",
        "energyCost": 50,
        "description": "Using acoustic location, Banshee's Sonar power finds and tracks enemies, and exposes critical weak spots to everyone in your squad.",
        "range": 35,
        "duration": 30,
        "castTime": 0.6,
        "miscStats": {
          "damageMultiplier": 5,
          "propagationSpeed": 20
        }
      },
      {
        "name": "Silence",
        "energyCost": 75,
        "description": "Using Silence surrounds Banshee in an aura that stuns enemies and will limit their perceptions and tactical response to gunfire and Warframe attacks.",
        "range": 20,
        "duration": 30,
        "castTime": 0.5,
        "miscStats": {
          "stunDuration": 2
        }
      },
      {
        "name": "Sound Quake",
        "energyCost": 25,
        "description": "Channeling all of her acoustic energy into the environment, Banshee uses ultrasonic reverberations to violently shake the ground.",
        "damage": 200,
        "range": 20,
        "castTime": 1,
        "damageType": "Blast",
        "miscStats": {
          "energyDrain": 12,
          "channeled": true
        }
      }
    ]
  },
  {
    "id": "baruuk",
    "name": "Baruuk",
    "health": 180,
    "shield": 270,
    "armor": 185,
    "energy": 200,
    "sprintSpeed": 1.2,
    "description": "Dodge all incoming projectiles, but only while not attacking. Use again to deactivate this ability.",
    "passive": "Each projectile dodged, each enemy lulled or disarmed, erodes Baruuk's restraint and fuels the storm within. As Baruuk's restraint is diminished he becomes up to 50% more resistant to damage.",
    "abilities": [
      {
        "name": "Elude",
        "energyCost": 25,
        "description": "Dodge all incoming projectiles, but only while not attacking. Use again to deactivate this ability.",
        "castTime": 0.4,
        "miscStats": {
          "evasionAngle": 180,
          "energyDrain": 2.5,
          "channeled": true,
          "restraintErosion": 0.012
        }
      },
      {
        "name": "Lull",
        "energyCost": 50,
        "description": "A calming wave slows enemies until they fall into a slumber. Enemies woken by damage will be confused and disoriented. Short-term amnesia means all waking enemies forget anything that happened before the lull.",
        "range": 25,
        "duration": 20,
        "castTime": 0.8,
        "miscStats": {
          "waveDuration": 5,
          "restraintErosion": 0.008,
          "finisherDamageVulnerability": 1
        }
      },
      {
        "name": "Desolate Hands",
        "energyCost": 75,
        "description": "Summon a bevy of orbiting daggers to seek out enemy guns, destroying them with a small explosion. Combine with Elude to double the range.",
        "damage": 250,
        "range": 6,
        "radius": 3,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "daggerCharges": 8,
          "damageReductionPerDagger": 0.1,
          "drCap": 0.9,
          "restraintErosion": 0.016
        }
      },
      {
        "name": "Serene Storm",
        "energyCost": 0,
        "description": "With his Restraint eroded, Baruuk commands the Desert Wind to deliver powerful radial strikes with his fists and feet. Each moment commanding the storm restores his Restraint.",
        "damage": 250,
        "damageReduction": 0.25,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "drCap": 0.4,
          "restraintRestoreOnCast": 0.04,
          "restraintRestorePerSecond": 0.008
        }
      }
    ]
  },
  {
    "id": "baruuk_prime",
    "name": "Baruuk Prime",
    "health": 180,
    "shield": 365,
    "armor": 240,
    "energy": 200,
    "sprintSpeed": 1.2,
    "description": "Dodge all incoming projectiles, but only while not attacking. Use again to deactivate this ability.",
    "passive": "Each projectile dodged, each enemy lulled or disarmed, erodes Baruuk's restraint and fuels the storm within. As Baruuk's restraint is diminished he becomes up to 50% more resistant to damage.",
    "abilities": [
      {
        "name": "Elude",
        "energyCost": 25,
        "description": "Dodge all incoming projectiles, but only while not attacking. Use again to deactivate this ability.",
        "castTime": 0.4,
        "miscStats": {
          "evasionAngle": 180,
          "energyDrain": 2.5,
          "channeled": true,
          "restraintErosion": 0.012
        }
      },
      {
        "name": "Lull",
        "energyCost": 50,
        "description": "A calming wave slows enemies until they fall into a slumber. Enemies woken by damage will be confused and disoriented. Short-term amnesia means all waking enemies forget anything that happened before the lull.",
        "range": 25,
        "duration": 20,
        "castTime": 0.8,
        "miscStats": {
          "waveDuration": 5,
          "restraintErosion": 0.008,
          "finisherDamageVulnerability": 1
        }
      },
      {
        "name": "Desolate Hands",
        "energyCost": 75,
        "description": "Summon a bevy of orbiting daggers to seek out enemy guns, destroying them with a small explosion. Combine with Elude to double the range.",
        "damage": 250,
        "range": 6,
        "radius": 3,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "daggerCharges": 8,
          "damageReductionPerDagger": 0.1,
          "drCap": 0.9,
          "restraintErosion": 0.016
        }
      },
      {
        "name": "Serene Storm",
        "energyCost": 0,
        "description": "With his Restraint eroded, Baruuk commands the Desert Wind to deliver powerful radial strikes with his fists and feet. Each moment commanding the storm restores his Restraint.",
        "damage": 250,
        "damageReduction": 0.25,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "drCap": 0.4,
          "restraintRestoreOnCast": 0.04,
          "restraintRestorePerSecond": 0.008
        }
      }
    ]
  },
  {
    "id": "bonewidow",
    "name": "Bonewidow",
    "health": 1880,
    "shield": 430,
    "armor": 480,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Skewer and hold a target, siphoning their health. Use again to hurl the victim damaging them and anyone near the impact site.",
    "passive": "",
        "abilities": [
      {
        "name": "Meathook",
        "energyCost": 25,
        "description": "Skewer and hold a target, siphoning their health. Use again to hurl the victim damaging them and anyone near the impact site.",
        "radius": 17,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "healthDrainPerSecond": 0.2,
          "lifesteal": 0.4,
          "explosionHealthPercent": 0.5,
          "impactStatusChance": 1
        }
      },
      {
        "name": "Shield Maiden",
        "energyCost": 25,
        "description": "Raise Bonewidow's shield to block incoming forward damage, reflecting it back at attackers. While active, bash enemies with a Maiden's Kiss.",
        "castTime": 0.4,
        "miscStats": {
          "shieldHealth": 2000,
          "reflectMultiplier": 2,
          "armorMultiplier": 2.5,
          "invulnerabilityDuration": 3,
          "blockAngle": 160,
          "augmentBlockAngle": 220,
          "breakCooldown": 10,
          "kissEnergyCost": 15
        }
      },
      {
        "name": "Firing Line",
        "energyCost": 50,
        "description": "Sweep surrounding enemies into the line of fire and suspend them in air with a force beam.",
        "range": 25,
        "duration": 5,
        "castTime": 0.8,
        "miscStats": {
          "sweepSpeed": 360,
          "damageVulnerability": 0.5
        }
      },
      {
        "name": "Exalted Ironbride",
        "energyCost": 50,
        "description": "Summon a devastating exalted blade.",
        "damage": 1500,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "energyDrain": 2.5
        }
      }
    ]
  },
  {
    "id": "caliban",
    "name": "Caliban",
    "health": 270,
    "shield": 550,
    "armor": 290,
    "energy": 140,
    "sprintSpeed": 1.1,
    "description": "Dash forward in a spinning vortex of death. Struck enemies are inflicted with <DT_SENTIENT_COLOR>Tau Status Effect, making them more vulnerable to all other status effects.",
    "passive": "Allies within Affinity range gain up to 50% resistance to the types of damage they are currently taking.",
    "abilities": [
      {
        "name": "Razor Gyre",
        "energyCost": 25,
        "description": "Dash forward in a spinning vortex of death. Struck enemies are inflicted with <DT_SENTIENT_COLOR>Tau Status Effect, making them more vulnerable to all other status effects. For each enemy hit, recover a portion of the energy cost, as well as health and shields.",
        "damage": 500,
        "range": 10,
        "castTime": 0.5,
        "damageType": "Tau",
        "miscStats": {
          "wrathDamagePerSecond": 1000,
          "healthPerHit": 30,
          "energyRestorePercent": 0.25,
          "dashDuration": 1.25,
          "damageInterval": 0.1
        }
      },
      {
        "name": "Sentient Wrath",
        "energyCost": 50,
        "description": "Smash the ground sending out a radial wave of destruction. Those not killed by the initial blast are helplessly raised into the air, where they take amplified damage for a short time.",
        "damage": 2000,
        "range": 22,
        "duration": 10,
        "castTime": 0.6,
        "damageType": "Tau",
        "miscStats": {
          "damageVulnerability": 0.35
        }
      },
      {
        "name": "Lethal Progeny",
        "energyCost": 50,
        "description": "Cycle through Sentient unit types, then summon them to Caliban's side. Conculysts focus on raw melee damage. Ortholysts specialize in ranged attacks and inflict <DT_SENTIENT_COLOR>Tau Status. Summulysts summon Choralysts and provide shield protection.",
        "range": 25,
        "duration": 45,
        "castTime": 0.8,
        "miscStats": {
          "shieldRestorePerSecond": 25,
          "damageMultiplier": 2.5,
          "healthMultiplier": 2,
          "maxConculysts": 3,
          "maxOrtholysts": 3,
          "maxSummulysts": 1
        }
      },
      {
        "name": "Fusion Strike",
        "energyCost": 100,
        "description": "Converge three streams of raw energy upon a single point, causing a massive explosion. The streams strip armor and shields, and each enemy struck detonates on stream convergence.",
        "damage": 15000,
        "range": 30,
        "radius": 10,
        "duration": 15,
        "castTime": 1,
        "damageType": "Tau",
        "miscStats": {
          "detonationDamage": 5000,
          "explosionDamage": 750,
          "armorStrip": 0.5,
          "shieldStrip": 0.5,
          "streamCount": 3,
          "enemyExplosionRadius": 2
        }
      }
    ]
  },
  {
    "id": "caliban_prime",
    "name": "Caliban Prime",
    "health": 270,
    "shield": 640,
    "armor": 290,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Dash forward in a spinning vortex of death. Struck enemies are inflicted with <DT_SENTIENT_COLOR>Tau Status Effect, making them more vulnerable to all other status effects.",
    "passive": "Allies within Affinity range gain up to 50% resistance to the types of damage they are currently taking.",
    "abilities": [
      {
        "name": "Razor Gyre",
        "energyCost": 25,
        "description": "Dash forward in a spinning vortex of death. Struck enemies are inflicted with <DT_SENTIENT_COLOR>Tau Status Effect, making them more vulnerable to all other status effects. For each enemy hit, recover a portion of the energy cost, as well as health and shields.",
        "damage": 500,
        "range": 10,
        "castTime": 0.5,
        "damageType": "Tau",
        "miscStats": {
          "wrathDamagePerSecond": 1000,
          "healthPerHit": 30,
          "energyRestorePercent": 0.25,
          "dashDuration": 1.25,
          "damageInterval": 0.1
        }
      },
      {
        "name": "Sentient Wrath",
        "energyCost": 50,
        "description": "Smash the ground sending out a radial wave of destruction. Those not killed by the initial blast are helplessly raised into the air, where they take amplified damage for a short time.",
        "damage": 2000,
        "range": 22,
        "duration": 10,
        "castTime": 0.6,
        "damageType": "Tau",
        "miscStats": {
          "damageVulnerability": 0.35
        }
      },
      {
        "name": "Lethal Progeny",
        "energyCost": 50,
        "description": "Cycle through Sentient unit types, then summon them to Caliban's side. Conculysts focus on raw melee damage. Ortholysts specialize in ranged attacks and inflict <DT_SENTIENT_COLOR>Tau Status. Summulysts summon Choralysts and provide shield protection.",
        "range": 25,
        "duration": 45,
        "castTime": 0.8,
        "miscStats": {
          "shieldRestorePerSecond": 25,
          "damageMultiplier": 2.5,
          "healthMultiplier": 2,
          "maxConculysts": 3,
          "maxOrtholysts": 3,
          "maxSummulysts": 1
        }
      },
      {
        "name": "Fusion Strike",
        "energyCost": 100,
        "description": "Converge three streams of raw energy upon a single point, causing a massive explosion. The streams strip armor and shields, and each enemy struck detonates on stream convergence.",
        "damage": 15000,
        "range": 30,
        "radius": 10,
        "duration": 15,
        "castTime": 1,
        "damageType": "Tau",
        "miscStats": {
          "detonationDamage": 5000,
          "explosionDamage": 750,
          "armorStrip": 0.5,
          "shieldStrip": 0.5,
          "streamCount": 3,
          "enemyExplosionRadius": 2
        }
      }
    ]
  },
  {
    "id": "chroma",
    "name": "Chroma",
    "health": 270,
    "shield": 270,
    "armor": 370,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Exhale a deep breath of elemental destruction. Tap to cycle through elements, hold to cast. The chosen element applies to all of Chroma's abilities.",
    "passive": "Wings sprout for an additional jump and bullet jump.",
    "abilities": [
      {
        "name": "Spectral Scream",
        "energyCost": 10,
        "description": "Exhale a deep breath of elemental destruction. Tap to cycle through elements, hold to cast. The chosen element applies to all of Chroma's abilities.",
        "damagePerSecond": 400,
        "range": 10,
        "castTime": 0.5,
        "statusChance": 1,
        "damageType": "Elemental (Heat / Cold / Toxin / Electricity)",
        "subAbilities": [
          "Channeled: 3 energy/s while active (after the 10 energy cast).",
          "Cone reach scales weakly with Ability Range (effective length scales with the cube root of Range).",
          "Elemental stream can chain to one enemy within 10 m of targets hit by the cone."
        ],
        "miscStats": {
          "energyDrain": 3,
          "streamLinkRange": 10,
          "coneAngle": 90
        }
      },
      {
        "name": "Elemental Ward",
        "energyCost": 50,
        "description": "Depending on Chroma's elemental alignment, an offensive area-of-effect is created. Chroma and nearby allies are imbued with defensive energy.",
        "range": 12,
        "duration": 25,
        "castTime": 1,
        "subAbilities": [
          "Heat: +55% max Health; aura deals 100 Heat/s in 5 m (10% status). Inner 5 m radius does not scale with Range.",
          "Electric: +30% max Shields; incoming damage can arc to an enemy within 10 m (25% status, min 200 damage).",
          "Toxin: +35% reload speed and holster damage (3 s buff); 50% chance per second for a toxin hit in 5 m (100% status on proc).",
          "Cold: +145% base Armor; reflects damage as Cold (300% reflected multiplier, 25% status)."
        ],
        "miscStats": {
          "auraRadius": 12,
          "heatHealthBonus": 0.55,
          "heatDps": 100,
          "electricShieldBonus": 0.3,
          "electricReflectMult": 10,
          "toxinReloadBonus": 0.35,
          "toxinHolsterDamage": 0.35,
          "toxinProcChance": 0.5,
          "coldArmorBonus": 1.45,
          "coldReflectMult": 3
        }
      },
      {
        "name": "Vex Armor",
        "energyCost": 75,
        "description": "Chroma fortifies squad Armor when his Shields are damaged or he kills an enemy with a melee weapon. He increases squad Weapon Damage when he loses Health or he kills an enemy with a ranged weapon.",
        "range": 18,
        "duration": 25,
        "radius": 18,
        "castTime": 0.5,
        "subAbilities": [
          "Scorn builds to +350% armor from shield damage taken or melee kills.",
          "Fury builds to +275% weapon damage from health damage taken or ranged kills (headshots build faster).",
          "Buffs apply to allies in aura range; percentages scale with Ability Strength."
        ],
        "miscStats": {
          "auraRadius": 18,
          "scornMax": 3.5,
          "furyMax": 2.75,
          "scornPerMeleeKill": 0.15,
          "furyPerRangedKill": 0.15
        }
      },
      {
        "name": "Effigy",
        "energyCost": 50,
        "description": "Chroma turns his pelt into a massive sentry that strengthens nearby allies and engulfs enemies in elemental attacks.",
        "damage": 400,
        "damagePerSecond": 2000,
        "health": 8000,
        "armor": 200,
        "range": 20,
        "castTime": 1,
        "damageType": "Elemental (matches alignment)",
        "subAbilities": [
          "Sentry fires in 20 m at 5 ticks/s; costs 10 energy/s while active.",
          "Chroma: +20% movement speed and −50% total armor while the pelt is out.",
          "Roar stuns in 30 m (15 s cooldown). Wing flap: 200 elemental damage in 5 m (5 s cooldown).",
          "Kills by the sentry have a chance for bonus credits; pickups within 10 m gain +25–100% credits."
        ],
        "miscStats": {
          "sentryArmor": 200,
          "energyDrain": 10,
          "stunRadius": 30,
          "creditPickupRadius": 10,
          "moveSpeedBonus": 0.2,
          "armorReduction": 0.5,
          "knockbackDamage": 200,
          "knockbackRadius": 5,
          "creditChance": 0.6,
          "creditBonus": 1,
          "ticksPerSecond": 5
        }
      }
    ]
  },
  {
    "id": "chroma_prime",
    "name": "Chroma Prime",
    "health": 270,
    "shield": 270,
    "armor": 450,
    "energy": 200,
    "sprintSpeed": 1,
    "description": "Exhale a deep breath of elemental destruction. Tap to cycle through elements, hold to cast. The chosen element applies to all of Chroma's abilities.",
    "passive": "Wings sprout for an additional jump and bullet jump.",
    "abilities": [
      {
        "name": "Spectral Scream",
        "energyCost": 10,
        "description": "Exhale a deep breath of elemental destruction. Tap to cycle through elements, hold to cast. The chosen element applies to all of Chroma's abilities.",
        "damagePerSecond": 400,
        "range": 10,
        "castTime": 0.5,
        "statusChance": 1,
        "damageType": "Elemental (Heat / Cold / Toxin / Electricity)",
        "subAbilities": [
          "Channeled: 3 energy/s while active (after the 10 energy cast).",
          "Cone reach scales weakly with Ability Range (effective length scales with the cube root of Range).",
          "Elemental stream can chain to one enemy within 10 m of targets hit by the cone."
        ],
        "miscStats": {
          "energyDrain": 3,
          "streamLinkRange": 10,
          "coneAngle": 90
        }
      },
      {
        "name": "Elemental Ward",
        "energyCost": 50,
        "description": "Depending on Chroma's elemental alignment, an offensive area-of-effect is created. Chroma and nearby allies are imbued with defensive energy.",
        "range": 12,
        "duration": 25,
        "castTime": 1,
        "subAbilities": [
          "Heat: +55% max Health; aura deals 100 Heat/s in 5 m (10% status). Inner 5 m radius does not scale with Range.",
          "Electric: +30% max Shields; incoming damage can arc to an enemy within 10 m (25% status, min 200 damage).",
          "Toxin: +35% reload speed and holster damage (3 s buff); 50% chance per second for a toxin hit in 5 m (100% status on proc).",
          "Cold: +145% base Armor; reflects damage as Cold (300% reflected multiplier, 25% status)."
        ],
        "miscStats": {
          "auraRadius": 12,
          "heatHealthBonus": 0.55,
          "heatDps": 100,
          "electricShieldBonus": 0.3,
          "electricReflectMult": 10,
          "toxinReloadBonus": 0.35,
          "toxinHolsterDamage": 0.35,
          "toxinProcChance": 0.5,
          "coldArmorBonus": 1.45,
          "coldReflectMult": 3
        }
      },
      {
        "name": "Vex Armor",
        "energyCost": 75,
        "description": "Chroma fortifies squad Armor when his Shields are damaged or he kills an enemy with a melee weapon. He increases squad Weapon Damage when he loses Health or he kills an enemy with a ranged weapon.",
        "range": 18,
        "duration": 25,
        "radius": 18,
        "castTime": 0.5,
        "subAbilities": [
          "Scorn builds to +350% armor from shield damage taken or melee kills.",
          "Fury builds to +275% weapon damage from health damage taken or ranged kills (headshots build faster).",
          "Buffs apply to allies in aura range; percentages scale with Ability Strength."
        ],
        "miscStats": {
          "auraRadius": 18,
          "scornMax": 3.5,
          "furyMax": 2.75,
          "scornPerMeleeKill": 0.15,
          "furyPerRangedKill": 0.15
        }
      },
      {
        "name": "Effigy",
        "energyCost": 50,
        "description": "Chroma turns his pelt into a massive sentry that strengthens nearby allies and engulfs enemies in elemental attacks.",
        "damage": 400,
        "damagePerSecond": 2000,
        "health": 8000,
        "armor": 200,
        "range": 20,
        "castTime": 1,
        "damageType": "Elemental (matches alignment)",
        "subAbilities": [
          "Sentry fires in 20 m at 5 ticks/s; costs 10 energy/s while active.",
          "Chroma: +20% movement speed and −50% total armor while the pelt is out.",
          "Roar stuns in 30 m (15 s cooldown). Wing flap: 200 elemental damage in 5 m (5 s cooldown).",
          "Kills by the sentry have a chance for bonus credits; pickups within 10 m gain +25–100% credits."
        ],
        "miscStats": {
          "sentryArmor": 200,
          "energyDrain": 10,
          "stunRadius": 30,
          "creditPickupRadius": 10,
          "moveSpeedBonus": 0.2,
          "armorReduction": 0.5,
          "knockbackDamage": 200,
          "knockbackRadius": 5,
          "creditChance": 0.6,
          "creditBonus": 1,
          "ticksPerSecond": 5
        }
      }
    ]
  },
  {
    "id": "citrine",
    "name": "Citrine",
    "health": 400,
    "shield": 270,
    "armor": 265,
    "energy": 130,
    "sprintSpeed": 1,
    "description": "Slash and stagger enemies with a crystal blast that inflicts <DT_SLASH_COLOR>Slash Status. Enemies afflicted with this Status Effect have an increased chance of dropping Health Orbs.",
    "passive": "Citrine grants nearby allies within Affinity Range 5 health regeneration per second. Pick up a Health Orb to increase regeneration by 0.1, up to a maximum of 25.",
    "abilities": [
      {
        "name": "Fractured Blast",
        "energyCost": 25,
        "description": "Slash and stagger enemies with a crystal blast that inflicts Slash Status. Enemies afflicted with this Status Effect have an increased chance of dropping Health and Energy Orbs.",
        "damage": 500,
        "range": 14,
        "damageType": "Slash",
        "miscStats": {
          "healthOrbChance": 0.5,
          "energyOrbChance": 0.2
        }
      },
      {
        "name": "Preserving Shell",
        "energyCost": 50,
        "description": "Citrine guards herself and nearby allies with a crystalline shell that gradually decays. Kills and assists increase the defensive power of the shell.",
        "damageReduction": 0.4,
        "duration": 25,
        "miscStats": {
          "drCap": 0.9,
          "minDamageReduction": 0.25,
          "drPerKill": 0.03,
          "drPerAssist": 0.01,
          "staggerRadius": 8,
          "initialDecayDelay": 1,
          "killAssistDecayDelay": 2
        }
      },
      {
        "name": "Prismatic Gem",
        "energyCost": 75,
        "description": "Deploy a gem that shoots prismatic beams. The gem targets enemies that are taking weapon damage from Citrine and her allies. Its beams inflict Heat, Cold, Toxin, and Electricity Status Effects. Status Chance and Status Duration increase for nearby allies.",
        "damage": 1000,
        "duration": 30,
        "range": 15,
        "miscStats": {
          "placementDistance": 5,
          "statusChanceBonus": 1,
          "statusDurationBonus": 1,
          "beamsPerAlly": 1,
          "retargetDelay": 0.4,
          "statusTypes": 4,
          "gemLimit": 1
        }
      },
      {
        "name": "Crystallize",
        "energyCost": 100,
        "description": "Citrine summons crystal fractals. The fractals rush forward, seeking enemies. Enemies touched by the fractals are paralyzed by crystalline growths. Hit the growths to deal Critical Damage.",
        "damage": 500,
        "range": 30,
        "duration": 8,
        "damageType": "Impact",
        "miscStats": {
          "coneAngle": 190,
          "growthsPerEnemy": 1,
          "absoluteCritChance": 3
        }
      }
    ]
  },
  {
    "id": "cyte_09",
    "name": "Cyte-09",
    "health": 225,
    "shield": 135,
    "armor": 150,
    "energy": 180,
    "sprintSpeed": 1.1,
    "description": "Plant an antenna that projects a forward wave scan. Detected enemies take increased Weak Point Damage, and become visible through walls. Weapons gain Punch through.",
    "passive": "Weak Point Kills increase Cyte-09's Weak Point Critical Chance by 1% up to 300% for the duration of the current mission.",
    "abilities": [
      {
        "name": "Seek",
        "energyCost": 25,
        "description": "Plant an antenna that projects a forward wave scan. Detected enemies take increased Weak Point Damage, and become visible through walls. Weapons gain Punch through.",
        "range": 60,
        "duration": 35,
        "castTime": 0.5,
        "miscStats": {
          "weakPointDamageBonus": 0.75,
          "scanDuration": 5,
          "punchThrough": 10,
          "coneAngle": 75,
          "pulseInterval": 3,
          "maxAntennae": 3
        }
      },
      {
        "name": "Resupply",
        "energyCost": 50,
        "description": "Throw two Elemental Ammo Packs that instantly refill the active weapon's magazine, while granting the weapon an additional instance of the selected Elemental Damage and Status Effect. Reload clears the effect. Sniper Rifles gain extra damage. Hold the ability to select the Elemental Damage type.",
        "castTime": 0.6,
        "miscStats": {
          "weaponDamageBonus": 0.25,
          "sniperDamageBonus": 0.5,
          "ammoPacks": 2,
          "maxAmmoPacks": 6,
          "recastCooldown": 0.35
        }
      },
      {
        "name": "Evade",
        "energyCost": 75,
        "description": "Jump backwards and become invisible for a short duration. Killing enemies on their Weak Points extends the duration and heals Cyte-09.",
        "duration": 10,
        "castTime": 0.3,
        "miscStats": {
          "healthRestore": 100,
          "durationExtend": 2,
          "durationCap": 30,
          "dodgeDistance": 5,
          "cooldown": 60,
          "statusCleanse": true
        }
      },
      {
        "name": "Neutralize",
        "energyCost": 5,
        "description": "Summon the Neutralizer, Cyte-09's exalted Sniper Rifle. Bullets ricochet off Weak Points to seek out other nearby Weak Points. Alt fire lobs a Cold grenade that completely freezes enemies.",
        "castTime": 0.8,
        "miscStats": {
          "damageMultiplier": 1.25,
          "ricochetRange": 10,
          "ricochets": 4,
          "damageLossPerRicochet": 0.2,
          "energyPerShot": 10,
          "altFireEnergy": 20,
          "staggerRange": 10
        }
      }
    ]
  },
  {
    "id": "dagath",
    "name": "Dagath",
    "health": 566,
    "shield": 150,
    "armor": 125,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Wyrd Scythes surround Dagath and seek out nearby enemies. Those struck are slowed and suffer <DT_VIRAL_COLOR>Viral Damage with a guaranteed Status Effect.",
    "passive": "There is a 35% chance that Energy and Health Orbs will be 300% more effective on Dagath.",
    "abilities": [
      {
        "name": "Wyrd Scythes",
        "energyCost": 25,
        "description": "Wyrd Scythes surround Dagath and seek out nearby enemies. Those struck are slowed and suffer <DT_VIRAL_COLOR>Viral Damage with a guaranteed Status Effect. The scythes also spread Doom and extend its duration.",
        "damage": 500,
        "range": 15,
        "duration": 5,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Viral",
        "miscStats": {
          "slowPercent": 0.35,
          "slowCap": 0.95,
          "throwDamage": 1000,
          "sickleCount": 7,
          "minSpinRadius": 1,
          "maxSpinRadius": 5
        }
      },
      {
        "name": "Doom",
        "energyCost": 50,
        "description": "Condemn nearby enemies to their doom. A portion of the damage Dagath deals is revisited upon them by a Wyrd Scythe. They also suffer <DT_VIRAL_COLOR>Viral Damage.",
        "damage": 500,
        "range": 15,
        "duration": 15,
        "castTime": 0.6,
        "damageType": "Viral",
        "miscStats": {
          "phantomWrathStored": 0.35,
          "coneAngle": 40
        }
      },
      {
        "name": "Grave Spirit",
        "energyCost": 75,
        "description": "Supercharge Dagath's weapons with extra Critical Damage. The effects are doubled on Doomed enemies. Escape fatal blows by briefly assuming a spectral form.",
        "duration": 10,
        "castTime": 0.5,
        "miscStats": {
          "critDamageBonus": 0.5,
          "doomCritDamageBonus": 1,
          "knockdownRadius": 10,
          "cooldown": 25
        }
      },
      {
        "name": "Rakhali's Cavalry",
        "energyCost": 100,
        "description": "Phantom Kaithes charge forth, inflicting <DT_VIRAL_COLOR>Viral Damage upon all in their path. Their attack strips the defenses of Doomed enemies.",
        "damage": 30000,
        "duration": 3,
        "statusChance": 1,
        "castTime": 0.8,
        "damageType": "Viral",
        "miscStats": {
          "defenseReduction": 0.35,
          "kaitheCount": 5,
          "summonRadius": 5,
          "invulnerabilityDuration": 1.5,
          "chargeVelocity": 15,
          "damageInterval": 0.15
        }
      }
    ]
  },
  {
    "id": "dante",
    "name": "Dante",
    "health": 300,
    "shield": 150,
    "armor": 145,
    "energy": 200,
    "sprintSpeed": 1.15,
    "description": "Open Noctua, Dante's Exalted Tome, and unleash a tale of woe upon his enemies.",
    "passive": "Noctua scans targets, recording information for your Codex. Status Chance increases by 50% on fully scanned targets.",
    "abilities": [
      {
        "name": "Noctua",
        "energyCost": 5,
        "description": "Open Noctua, Dante's Exalted Tome, and unleash a tale of woe upon his enemies.",
        "damage": 250,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "energyPerShot": 2,
          "altFireDamage": 2750,
          "pageFragments": 4,
          "seekAngle": 60,
          "seekDistance": 20
        }
      },
      {
        "name": "Light Verse",
        "energyCost": 25,
        "description": "Dante's vitalizing composition grants him and his allies Overguard and restores their Health.",
        "range": 20,
        "radius": 20,
        "castTime": 0.6,
        "miscStats": {
          "overguardGain": 350,
          "overguardCap": 15000,
          "healthHealPercent": 0.2,
          "invulnerabilityDuration": 1
        }
      },
      {
        "name": "Dark Verse",
        "energyCost": 25,
        "description": "Dante's composition draws blood from nearby enemies, inflicting <DT_SLASH_COLOR>Slash Damage upon them.",
        "damage": 1250,
        "range": 20,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "coneAngle": 50,
          "slashStatuses": 2
        }
      },
      {
        "name": "Final Verse",
        "energyCost": 50,
        "description": "Dante must compose two other Verses before his Final Verse. TRIUMPH: Two Light Verses cast in succession invigorate allies. TRAGEDY: Two Dark Verses cast in succession devastate enemies. WORDWARDEN: Light then Dark supports allies with Noctua copies. PAGEFLIGHT: Dark then Light summons Paragrimms.",
        "damage": 6500,
        "duration": 45,
        "radius": 30,
        "castTime": 1,
        "damageType": "Slash",
        "miscStats": {
          "overguardGain": 3000,
          "overguardCap": 15000,
          "overguardRegenPerSecond": 100,
          "overguardRegenTimer": 2,
          "statusDetonationMultiplier": 3,
          "damageCopied": 0.5,
          "noctuaCopyLimit": 1,
          "pageflightDamage": 300,
          "statusChanceVulnerability": 0.5,
          "statusDamageIncrease": 0.5,
          "statusVulnerabilityDuration": 30,
          "paragrimmLimit": 3,
          "paragrimmAttackRange": 30,
          "invulnerabilityDuration": 1
        }
      }
    ]
  },
  {
    "id": "ember",
    "name": "Ember",
    "health": 270,
    "shield": 270,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Launch a fiery projectile dealing Heat damage. Can be combo-chained for increased damage. Immolation Heat adds bonus combo multiplier.",
    "passive": "Receive 5% Ability Strength for every enemy within <AFFINITY_SHARE>Affinity Range affected by <DT_FIRE_COLOR>Heat.",
    "abilities": [
      {
        "name": "Fireball",
        "energyCost": 25,
        "description": "Release a fiery projectile that ignites enemies on contact.",
        "damage": 800,
        "radius": 3,
        "duration": 1.5,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "areaDamage": 300,
          "comboDamageCap": 8
        }
      },
      {
        "name": "Immolation",
        "energyCost": 50,
        "description": "Protect Ember with flame armor that burns stronger over time, consuming energy once its meter is at full strength. Cast again to extinguish the flame.",
        "damageReduction": 0.85,
        "miscStats": {
          "initialDamageReduction": 0.4,
          "drCap": 0.9
        }
      },
      {
        "name": "Fire Blast",
        "energyCost": 75,
        "description": "Slam the ground to create a wave of incinerating plasma that knocks back enemies and strips their armor.",
        "damage": 200,
        "range": 25,
        "statusChance": 1,
        "castTime": 0.7,
        "damageType": "Heat",
        "miscStats": {
          "armorStrip": 1,
          "maxHeatEnergyCost": 25
        }
      },
      {
        "name": "Inferno",
        "energyCost": 0,
        "description": "Command a flaming comet to crash down in front of Ember, engulfing enemies with a fire that can spread through their ranks.",
        "damage": 2500,
        "damagePerSecond": 700,
        "range": 25,
        "duration": 15,
        "statusChance": 1,
        "damageType": "Heat",
        "miscStats": {
          "minRingDamagePerSecond": 350,
          "ringRadius": 8,
          "energyPerEnemy": 10,
          "maxEnergyTargets": 10
        }
      }
    ]
  },
  {
    "id": "ember_prime",
    "name": "Ember Prime",
    "health": 270,
    "shield": 365,
    "armor": 160,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Launch a fiery projectile dealing Heat damage. Can be combo-chained for increased damage. Immolation Heat adds bonus combo multiplier.",
    "passive": "Receive 5% Ability Strength for every enemy within <AFFINITY_SHARE>Affinity Range affected by <DT_FIRE_COLOR>Heat.",
    "abilities": [
      {
        "name": "Fireball",
        "energyCost": 25,
        "description": "Release a fiery projectile that ignites enemies on contact.",
        "damage": 800,
        "radius": 3,
        "duration": 1.5,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "areaDamage": 300,
          "comboDamageCap": 8
        }
      },
      {
        "name": "Immolation",
        "energyCost": 50,
        "description": "Protect Ember with flame armor that burns stronger over time, consuming energy once its meter is at full strength. Cast again to extinguish the flame.",
        "damageReduction": 0.85,
        "miscStats": {
          "initialDamageReduction": 0.4,
          "drCap": 0.9
        }
      },
      {
        "name": "Fire Blast",
        "energyCost": 75,
        "description": "Slam the ground to create a wave of incinerating plasma that knocks back enemies and strips their armor.",
        "damage": 200,
        "range": 25,
        "statusChance": 1,
        "castTime": 0.7,
        "damageType": "Heat",
        "miscStats": {
          "armorStrip": 1,
          "maxHeatEnergyCost": 25
        }
      },
      {
        "name": "Inferno",
        "energyCost": 0,
        "description": "Command a flaming comet to crash down in front of Ember, engulfing enemies with a fire that can spread through their ranks.",
        "damage": 2500,
        "damagePerSecond": 700,
        "range": 25,
        "duration": 15,
        "statusChance": 1,
        "damageType": "Heat",
        "miscStats": {
          "minRingDamagePerSecond": 350,
          "ringRadius": 8,
          "energyPerEnemy": 10,
          "maxEnergyTargets": 10
        }
      }
    ]
  },
  {
    "id": "equinox",
    "name": "Equinox",
    "health": 270,
    "shield": 270,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.15,
    "description": "Switch forms, temporarily gaining bonus Shields and Armor in Night-Form, or bonus Damage and Speed in Day-Form.",
    "passive": "10% of Health Orbs are converted into Energy, and 10% of Energy Orbs are converted into Health.",
    "abilities": [
      {
        "name": "Metamorphosis",
        "energyCost": 25,
        "description": "Switch forms, temporarily gaining bonus Shields and Armor in Night-Form, or bonus Damage and Speed in Day-Form.",
        "duration": 25,
        "castTime": 0.5,
        "miscStats": {
          "nightArmor": 250,
          "nightShields": 150,
          "dayDamageBonus": 0.25,
          "daySpeedBonus": 0.15
        }
      },
      {
        "name": "Rest & Rage",
        "energyCost": 25,
        "description": "In Night-Form, targets are put to sleep. In Day-Form, targets become more vulnerable to damage and gain speed.",
        "range": 50,
        "duration": 22,
        "radius": 5,
        "castTime": 0.6,
        "miscStats": {
          "damageVulnerability": 0.5,
          "enemySpeedBonus": 0.2,
          "wakeupHealthThreshold": 0.5
        }
      },
      {
        "name": "Pacify & Provoke",
        "energyCost": 10,
        "description": "In Night-Form, reduces damage inflicted by nearby enemies. In Day-Form, increases Ability Strength of nearby allies.",
        "range": 16,
        "castTime": 0.5,
        "miscStats": {
          "pacifyDamageReduction": 0.5,
          "abilityStrengthBonus": 0.2,
          "abilityStrengthBonusCap": 0.5,
          "energyDrainPerEnemy": 0.5,
          "energyPerAbility": 3,
          "channeled": true
        }
      },
      {
        "name": "Mend & Maim",
        "energyCost": 50,
        "description": "In Night-Form, allies' Shields are replenished with each nearby enemy killed. In Day-Form, enemies are inflicted with Slash Status. Deactivate to heal (Night) or release stored Slash damage (Day).",
        "damage": 150,
        "range": 18,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "shieldsPerKill": 25,
          "hitpointConversion": 0.75,
          "damageConversion": 0.75,
          "energyDrain": 3.5,
          "channeled": true
        }
      }
    ]
  },
  {
    "id": "equinox_prime",
    "name": "Equinox Prime",
    "health": 365,
    "shield": 270,
    "armor": 160,
    "energy": 200,
    "sprintSpeed": 1.15,
    "description": "Switch forms, temporarily gaining bonus Shields and Armor in Night-Form, or bonus Damage and Speed in Day-Form.",
    "passive": "10% of Health Orbs are converted into Energy, and 10% of Energy Orbs are converted into Health.",
    "abilities": [
      {
        "name": "Metamorphosis",
        "energyCost": 25,
        "description": "Switch forms, temporarily gaining bonus Shields and Armor in Night-Form, or bonus Damage and Speed in Day-Form.",
        "duration": 25,
        "castTime": 0.5,
        "miscStats": {
          "nightArmor": 250,
          "nightShields": 150,
          "dayDamageBonus": 0.25,
          "daySpeedBonus": 0.15
        }
      },
      {
        "name": "Rest & Rage",
        "energyCost": 25,
        "description": "In Night-Form, targets are put to sleep. In Day-Form, targets become more vulnerable to damage and gain speed.",
        "range": 50,
        "duration": 22,
        "radius": 5,
        "castTime": 0.6,
        "miscStats": {
          "damageVulnerability": 0.5,
          "enemySpeedBonus": 0.2,
          "wakeupHealthThreshold": 0.5
        }
      },
      {
        "name": "Pacify & Provoke",
        "energyCost": 10,
        "description": "In Night-Form, reduces damage inflicted by nearby enemies. In Day-Form, increases Ability Strength of nearby allies.",
        "range": 16,
        "castTime": 0.5,
        "miscStats": {
          "pacifyDamageReduction": 0.5,
          "abilityStrengthBonus": 0.2,
          "abilityStrengthBonusCap": 0.5,
          "energyDrainPerEnemy": 0.5,
          "energyPerAbility": 3,
          "channeled": true
        }
      },
      {
        "name": "Mend & Maim",
        "energyCost": 50,
        "description": "In Night-Form, allies' Shields are replenished with each nearby enemy killed. In Day-Form, enemies are inflicted with Slash Status. Deactivate to heal (Night) or release stored Slash damage (Day).",
        "damage": 150,
        "range": 18,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "shieldsPerKill": 25,
          "hitpointConversion": 0.75,
          "damageConversion": 0.75,
          "energyDrain": 3.5,
          "channeled": true
        }
      }
    ]
  },
  {
    "id": "excalibur",
    "name": "Excalibur",
    "health": 270,
    "shield": 270,
    "armor": 240,
    "energy": 100,
    "sprintSpeed": 1,
    "description": "Slash and dash through enemies alongside a radial specter. The powerful Exalted Blade's slashes inflict Slash Status.",
    "passive": "Excalibur deals 10% increased damage and attacks 10% faster when wielding swords.",
    "abilities": [
      {
        "name": "Slash Dash",
        "energyCost": 25,
        "description": "Slash and dash through enemies alongside a radial specter. The powerful Exalted Blade's slashes inflict Slash Status.",
        "range": 20,
        "chainRange": 7,
        "castTime": 0.3,
        "damageType": "Slash"
      },
      {
        "name": "Radial Blind",
        "energyCost": 50,
        "description": "Emit a bright flash of light, blinding all nearby enemies. Blinded enemies are vulnerable to melee finishers and susceptible to stealth damage bonus.",
        "range": 25,
        "duration": 15,
        "castTime": 0.5
      },
      {
        "name": "Radial Javelin",
        "energyCost": 75,
        "description": "Radial javelins impale nearby enemies, inflicting Slash Status and pinning them to walls.",
        "damage": 1000,
        "range": 25,
        "castTime": 0.8,
        "damageType": "Slash"
      },
      {
        "name": "Exalted Blade",
        "energyCost": 25,
        "description": "Summon a sword of pure light and immense power. Wield Excalibur Exalted Blade for devastating melee attacks with extended reach.",
        "damage": 250,
        "range": 5,
        "duration": 6,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 2.5,
          "meleeRange": 2.5,
          "waveRange": 70,
          "waveSpeed": 30,
          "slideEnergyCost": 25
        }
      }
    ]
  },
  {
    "id": "excalibur_prime",
    "name": "Excalibur Prime",
    "health": 270,
    "shield": 270,
    "armor": 315,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Slash and dash through enemies alongside a radial specter. The powerful Exalted Blade's slashes inflict Slash Status.",
    "passive": "Excalibur Prime deals 10% increased damage and attacks 10% faster when wielding swords.",
    "abilities": [
      {
        "name": "Slash Dash",
        "energyCost": 25,
        "description": "Slash and dash through enemies alongside a radial specter. The powerful Exalted Blade's slashes inflict Slash Status.",
        "range": 20,
        "chainRange": 7,
        "castTime": 0.3,
        "damageType": "Slash"
      },
      {
        "name": "Radial Blind",
        "energyCost": 50,
        "description": "Emit a bright flash of light, blinding all nearby enemies. Blinded enemies are vulnerable to melee finishers and susceptible to stealth damage bonus.",
        "range": 25,
        "duration": 15,
        "castTime": 0.5
      },
      {
        "name": "Radial Javelin",
        "energyCost": 75,
        "description": "Radial javelins impale nearby enemies, inflicting Slash Status and pinning them to walls.",
        "damage": 1000,
        "range": 25,
        "castTime": 0.8,
        "damageType": "Slash"
      },
      {
        "name": "Exalted Blade",
        "energyCost": 25,
        "description": "Summon a sword of pure light and immense power. Wield Excalibur Exalted Blade for devastating melee attacks with extended reach.",
        "damage": 250,
        "range": 5,
        "duration": 6,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 2.5,
          "meleeRange": 2.5,
          "waveRange": 70,
          "waveSpeed": 30,
          "slideEnergyCost": 25
        }
      }
    ]
  },
  {
    "id": "excalibur_umbra",
    "name": "Excalibur Umbra",
    "health": 270,
    "shield": 270,
    "armor": 315,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Slash and dash through enemies alongside a radial specter. The powerful Exalted Blade\u2019s slashes inflict <DT_SLASH_COLOR>Slash Status.",
    "passive": "Umbra exhibits sentience in combat without Transference control. Attacks 10% faster and deals 10% more damage while wielding swords.",
    "abilities": [
      {
        "name": "Slash Dash",
        "energyCost": 25,
        "description": "Slash and dash through enemies alongside a radial specter. The powerful Exalted Blade\u2019s slashes inflict <DT_SLASH_COLOR>Slash Status.",
        "range": 20,
        "chainRange": 7,
        "castTime": 0.3,
        "damageType": "Slash"
      },
      {
        "name": "Radial Howl",
        "energyCost": 50,
        "description": "Let out ferocious howl that stuns nearby enemies and causes Sentients to shed any built up resistances.",
        "range": 25,
        "duration": 15,
        "castTime": 0.5
      },
      {
        "name": "Radial Javelin",
        "energyCost": 75,
        "description": "Radial javelins impale nearby enemies, inflicting Slash Status and pinning them to walls.",
        "damage": 1000,
        "range": 25,
        "castTime": 0.8,
        "damageType": "Slash"
      },
      {
        "name": "Exalted Blade",
        "energyCost": 25,
        "description": "Summon a sword of pure light and immense power. Wield Excalibur Exalted Blade for devastating melee attacks with extended reach.",
        "damage": 250,
        "range": 5,
        "duration": 6,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 2.5,
          "meleeRange": 2.5,
          "waveRange": 70,
          "waveSpeed": 30,
          "slideEnergyCost": 25
        }
      }
    ]
  },
  {
    "id": "follie",
    "name": "Follie",
    "health": 485,
    "shield": 225,
    "armor": 325,
    "energy": 175,
    "sprintSpeed": 0.95,
    "description": "Drop through an inky frame and emerge invulnerable at the aimed location in a splash of ink that inflicts Inkblot on nearby enemies.",
    "passive": "INKBLOT: Follie's abilities splatter thick viscous ink onto enemies, applying a 50% slow for 10 seconds. While coated in ink, slain foes have a 20% chance to congeal an ink balloon that pops, dropping a random mixture of 3 Health and Energy Orbs.",
        "abilities": [
      {
        "name": "Forced Perspective",
        "energyCost": 15,
        "description": "Drop through an inky frame and emerge invulnerable at the aimed location in a splash of ink that inflicts Inkblot on nearby enemies.",
        "damage": 750,
        "range": 100,
        "radius": 5,
        "castTime": 0.4,
        "damageType": "Corrosive",
        "miscStats": {
          "invulnerabilityDuration": 3.5,
          "statusCleanse": true
        }
      },
      {
        "name": "Shadowgraph",
        "energyCost": 25,
        "description": "Bring shadowgraphs from Follie's sketchbook to life as items that can be used for tactical advantage. Shadowgraphs splash Inkblot onto nearby enemies when created. HOLD to open the Shadowgraph gear wheel.",
        "damage": 250,
        "range": 50,
        "duration": 20,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "miscStats": {
          "objectTypes": 14,
          "maxBrushLayers": 16
        }
      },
      {
        "name": "Self Portrait",
        "energyCost": 50,
        "description": "Draw an ink effigy to absorb the damage dealt to Follie and allies. A pool of ink spreads Inkblot; kill enemies inside the pool to grow the effigy and its ink puddle.",
        "damage": 550,
        "range": 50,
        "duration": 30,
        "radius": 8,
        "damageReduction": 0.5,
        "castTime": 0.6,
        "damageType": "Corrosive",
        "miscStats": {
          "startingDamageReduction": 0.1,
          "drCap": 0.9,
          "maxDuration": 60,
          "maxRadius": 20,
          "durationBonusPerKill": 3
        }
      },
      {
        "name": "Plein Air",
        "energyCost": 75,
        "description": "Tie nearby enemies to floating balloons that douse them with Inkblot. Pop the balloons to send them crashing to the ground, splashing Corrosive damage on nearby enemies.",
        "damage": 25000,
        "range": 18,
        "duration": 25,
        "radius": 18,
        "castTime": 0.8,
        "damageType": "Corrosive",
        "miscStats": {
          "defenseReduction": 0.5,
          "minFallDamage": 250,
          "splashRadius": 4,
          "cooldown": 1
        }
      }
    ]
  },
  {
    "id": "frost",
    "name": "Frost",
    "health": 270,
    "shield": 455,
    "armor": 315,
    "energy": 100,
    "sprintSpeed": 0.94999999,
    "description": "Launch a freezing projectile that deals Cold damage and freezes solid on impact.",
    "passive": "Cold Status Effects from Frost's Abilities last 100% longer. Frost gains 50 Armor for each enemy afflicted with <DT_FREEZE_COLOR>Cold within <AFFINITY_SHARE>Affinity Range.",
    "abilities": [
      {
        "name": "Freeze",
        "energyCost": 25,
        "description": "A frigid energy blast that freezes targets in their tracks.",
        "damage": 350,
        "range": 5,
        "duration": 15,
        "castTime": 0.3,
        "damageType": "Cold",
        "miscStats": {
          "areaDamage": 150
        }
      },
      {
        "name": "Ice Wave",
        "energyCost": 50,
        "description": "Sends a wave of razor sharp, crystalized ice toward an enemy, dealing heavy damage.",
        "damage": 700,
        "range": 20,
        "duration": 10,
        "castTime": 0.5,
        "damageType": "Cold",
        "miscStats": {
          "waveAngle": 45,
          "initialWidth": 3
        }
      },
      {
        "name": "Snow Globe",
        "energyCost": 50,
        "description": "Frost deep freezes any vapor and moisture in the area, creating a protective sphere with brief invulnerability to boost its strength.",
        "duration": 10,
        "radius": 5,
        "health": 3500,
        "castTime": 0.5,
        "miscStats": {
          "armorMultiplier": 5,
          "breakDamage": 150,
          "invulnerabilityDuration": 4,
          "globeLimit": 4,
          "healthCap": 1000000
        }
      },
      {
        "name": "Avalanche",
        "energyCost": 100,
        "description": "Summons a treacherous landslide of ice that instantly freezes and shatters all enemies in its radius.",
        "damage": 1500,
        "range": 15,
        "duration": 8,
        "castTime": 0.8,
        "damageType": "Cold",
        "miscStats": {
          "shatterDamage": 400,
          "shatterRadius": 4.5,
          "armorStrip": 0.6
        }
      }
    ]
  },
  {
    "id": "frost_prime",
    "name": "Frost Prime",
    "health": 270,
    "shield": 550,
    "armor": 315,
    "energy": 100,
    "sprintSpeed": 0.94999999,
    "description": "Launch a freezing projectile that deals Cold damage and freezes solid on impact.",
    "passive": "Cold Status Effects from Frost's Abilities last 100% longer. Frost gains 50 Armor for each enemy afflicted with <DT_FREEZE_COLOR>Cold within <AFFINITY_SHARE>Affinity Range.",
    "abilities": [
      {
        "name": "Freeze",
        "energyCost": 25,
        "description": "A frigid energy blast that freezes targets in their tracks.",
        "damage": 350,
        "range": 5,
        "duration": 15,
        "castTime": 0.3,
        "damageType": "Cold",
        "miscStats": {
          "areaDamage": 150
        }
      },
      {
        "name": "Ice Wave",
        "energyCost": 50,
        "description": "Sends a wave of razor sharp, crystalized ice toward an enemy, dealing heavy damage.",
        "damage": 700,
        "range": 20,
        "duration": 10,
        "castTime": 0.5,
        "damageType": "Cold",
        "miscStats": {
          "waveAngle": 45,
          "initialWidth": 3
        }
      },
      {
        "name": "Snow Globe",
        "energyCost": 50,
        "description": "Frost deep freezes any vapor and moisture in the area, creating a protective sphere with brief invulnerability to boost its strength.",
        "duration": 10,
        "radius": 5,
        "health": 3500,
        "castTime": 0.5,
        "miscStats": {
          "armorMultiplier": 5,
          "breakDamage": 150,
          "invulnerabilityDuration": 4,
          "globeLimit": 4,
          "healthCap": 1000000
        }
      },
      {
        "name": "Avalanche",
        "energyCost": 100,
        "description": "Summons a treacherous landslide of ice that instantly freezes and shatters all enemies in its radius.",
        "damage": 1500,
        "range": 15,
        "duration": 8,
        "castTime": 0.8,
        "damageType": "Cold",
        "miscStats": {
          "shatterDamage": 400,
          "shatterRadius": 4.5,
          "armorStrip": 0.6
        }
      }
    ]
  },
  {
    "id": "gara",
    "name": "Gara",
    "health": 270,
    "shield": 270,
    "armor": 160,
    "energy": 175,
    "sprintSpeed": 1.15,
    "description": "Lash out with stream of shattered glass, or hold for an arcing strike. Stats are boosted by the equipped mods on Shattered Lash.",
    "passive": "A 15% chance to create a radial blind lasting 10s when Gara casts Abilities.",
    "abilities": [
      {
        "name": "Shattered Lash",
        "energyCost": 25,
        "description": "Lash out with stream of shattered glass, or hold for an arcing strike. Stats are boosted by the equipped mods on Shattered Lash.",
        "damage": 400,
        "range": 12,
        "castTime": 0.4,
        "damageType": "Puncture",
        "miscStats": {
          "sweepArc": 225,
          "bladeRadius": 1.75
        }
      },
      {
        "name": "Splinter Storm",
        "energyCost": 50,
        "description": "Gara's armor splinters into a maelstrom of shattered glass. Allies who contact the cloud are fortified against damage.",
        "damage": 250,
        "range": 30,
        "duration": 22,
        "radius": 2.5,
        "castTime": 0.5,
        "damageReduction": 0.7,
        "miscStats": {
          "damageVulnerability": 0.35,
          "absorbedDamage": 0.5,
          "drCap": 0.9
        }
      },
      {
        "name": "Spectrorage",
        "energyCost": 75,
        "description": "Trap enemies in a carousel of mirrors, forcing them to attack visions of their true selves. Destroyed mirrors damage their attackers, as does the collapse of the carousel.",
        "damage": 800,
        "duration": 22,
        "castTime": 0.6,
        "miscStats": {
          "collapseDamage": 1500,
          "mirrorCount": 12,
          "collapseThreshold": 6,
          "charmRadius": 4,
          "castRange": 100,
          "absorbedDamage": 0.5
        }
      },
      {
        "name": "Mass Vitrify",
        "energyCost": 75,
        "description": "Create an expanding ring of molten glass that slowly crystallizes enemies who enter. When the expansion is complete, the ring hardens to block weapons fire. Use Shattered Lash to smash the ring and send razor-sharp glass flying.",
        "damage": 800,
        "range": 11,
        "duration": 16,
        "castTime": 1,
        "miscStats": {
          "damageVulnerability": 0.5,
          "segmentHealth": 1600,
          "armorMultiplier": 5,
          "expansionTime": 3,
          "ringInitialRadius": 2,
          "ringExpansionRate": 3,
          "explosionRange": 15,
          "energyDrain": 3,
          "crystallizationTime": 3,
          "ringSegments": 12
        }
      }
    ]
  },
  {
    "id": "gara_prime",
    "name": "Gara Prime",
    "health": 345,
    "shield": 270,
    "armor": 200,
    "energy": 175,
    "sprintSpeed": 1.15,
    "description": "Lash out with stream of shattered glass, or hold for an arcing strike. Stats are boosted by the equipped mods on Shattered Lash.",
    "passive": "A 15% chance to create a radial blind lasting 10s when Gara casts Abilities.",
    "abilities": [
      {
        "name": "Shattered Lash",
        "energyCost": 25,
        "description": "Lash out with stream of shattered glass, or hold for an arcing strike. Stats are boosted by the equipped mods on Shattered Lash.",
        "damage": 400,
        "range": 12,
        "castTime": 0.4,
        "damageType": "Puncture",
        "miscStats": {
          "sweepArc": 225,
          "bladeRadius": 1.75
        }
      },
      {
        "name": "Splinter Storm",
        "energyCost": 50,
        "description": "Gara's armor splinters into a maelstrom of shattered glass. Allies who contact the cloud are fortified against damage.",
        "damage": 250,
        "range": 30,
        "duration": 22,
        "radius": 2.5,
        "castTime": 0.5,
        "damageReduction": 0.7,
        "miscStats": {
          "damageVulnerability": 0.35,
          "absorbedDamage": 0.5,
          "drCap": 0.9
        }
      },
      {
        "name": "Spectrorage",
        "energyCost": 75,
        "description": "Trap enemies in a carousel of mirrors, forcing them to attack visions of their true selves. Destroyed mirrors damage their attackers, as does the collapse of the carousel.",
        "damage": 800,
        "duration": 22,
        "castTime": 0.6,
        "miscStats": {
          "collapseDamage": 1500,
          "mirrorCount": 12,
          "collapseThreshold": 6,
          "charmRadius": 4,
          "castRange": 100,
          "absorbedDamage": 0.5
        }
      },
      {
        "name": "Mass Vitrify",
        "energyCost": 75,
        "description": "Create an expanding ring of molten glass that slowly crystallizes enemies who enter. When the expansion is complete, the ring hardens to block weapons fire. Use Shattered Lash to smash the ring and send razor-sharp glass flying.",
        "damage": 800,
        "range": 11,
        "duration": 16,
        "castTime": 1,
        "miscStats": {
          "damageVulnerability": 0.5,
          "segmentHealth": 1600,
          "armorMultiplier": 5,
          "expansionTime": 3,
          "ringInitialRadius": 2,
          "ringExpansionRate": 3,
          "explosionRange": 15,
          "energyDrain": 3,
          "crystallizationTime": 3,
          "ringSegments": 12
        }
      }
    ]
  },
  {
    "id": "garuda",
    "name": "Garuda",
    "health": 270,
    "shield": 270,
    "armor": 315,
    "energy": 140,
    "sprintSpeed": 1,
    "description": "Rip the life force from an enemy and use it as a shield that captures damage, this kills significantly weakened enemies instantly. Charge to channel the captured damage into an explosive projectile.",
    "passive": "Garuda's damage temporarily increases with each enemy she kills, to a maximum of 100%.  Slashes with her talons if no melee weapon is equipped.",
    "abilities": [
      {
        "name": "Dread Mirror",
        "energyCost": 25,
        "description": "Rip the life force from an enemy and use it as a shield that captures damage, this kills significantly weakened enemies instantly. Charge to channel the captured damage into an explosive projectile.",
        "range": 30,
        "radius": 10,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "damageCaptureMultiplier": 2,
          "instantKillThreshold": 0.4,
          "staggerRadius": 8,
          "mirrorContactDamage": 100
        }
      },
      {
        "name": "Blood Altar",
        "energyCost": 50,
        "description": "Impale an enemy on an altar of talons and siphon health for Garuda and her allies.",
        "range": 30,
        "duration": 20,
        "radius": 8,
        "castTime": 0.8,
        "miscStats": {
          "healthPerSecond": 0.25,
          "damagePerSecond": 0.01,
          "maxAltars": 3,
          "staggerRadius": 8
        }
      },
      {
        "name": "Bloodletting",
        "energyCost": 0,
        "description": "Garuda sacrifices her health to generate energy and clear Status Effects.",
        "castTime": 0.5,
        "miscStats": {
          "energyGainPercent": 0.4,
          "healthDeducted": 0.5,
          "minimumHealth": 2
        }
      },
      {
        "name": "Seeking Talons",
        "energyCost": 100,
        "description": "Charge to expand the targeting area, release to send Garuda's talons careening toward each target in area. Surviving enemies are prone to <DT_SLASH_COLOR>Slash Status.",
        "damage": 300,
        "duration": 10,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "slashStatusChance": 0.75,
          "maxRange": 60,
          "minChargeAngle": 25,
          "maxChargeAngle": 95,
          "initialProjectiles": 12,
          "knockbackRadius": 2
        }
      }
    ]
  },
  {
    "id": "garuda_prime",
    "name": "Garuda Prime",
    "health": 270,
    "shield": 270,
    "armor": 420,
    "energy": 220,
    "sprintSpeed": 1,
    "description": "Rip the life force from an enemy and use it as a shield that captures damage, this kills significantly weakened enemies instantly. Charge to channel the captured damage into an explosive projectile.",
    "passive": "Garuda's damage temporarily increases with each enemy she kills, to a maximum of 100%.  Slashes with her talons if no melee weapon is equipped.",
    "abilities": [
      {
        "name": "Dread Mirror",
        "energyCost": 25,
        "description": "Rip the life force from an enemy and use it as a shield that captures damage, this kills significantly weakened enemies instantly. Charge to channel the captured damage into an explosive projectile.",
        "range": 30,
        "radius": 10,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "damageCaptureMultiplier": 2,
          "instantKillThreshold": 0.4,
          "staggerRadius": 8,
          "mirrorContactDamage": 100
        }
      },
      {
        "name": "Blood Altar",
        "energyCost": 50,
        "description": "Impale an enemy on an altar of talons and siphon health for Garuda and her allies.",
        "range": 30,
        "duration": 20,
        "radius": 8,
        "castTime": 0.8,
        "miscStats": {
          "healthPerSecond": 0.25,
          "damagePerSecond": 0.01,
          "maxAltars": 3,
          "staggerRadius": 8
        }
      },
      {
        "name": "Bloodletting",
        "energyCost": 0,
        "description": "Garuda sacrifices her health to generate energy and clear Status Effects.",
        "castTime": 0.5,
        "miscStats": {
          "energyGainPercent": 0.4,
          "healthDeducted": 0.5,
          "minimumHealth": 2
        }
      },
      {
        "name": "Seeking Talons",
        "energyCost": 100,
        "description": "Charge to expand the targeting area, release to send Garuda's talons careening toward each target in area. Surviving enemies are prone to <DT_SLASH_COLOR>Slash Status.",
        "damage": 300,
        "duration": 10,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "slashStatusChance": 0.75,
          "maxRange": 60,
          "minChargeAngle": 25,
          "maxChargeAngle": 95,
          "initialProjectiles": 12,
          "knockbackRadius": 2
        }
      }
    ]
  },
  {
    "id": "gauss",
    "name": "Gauss",
    "health": 270,
    "shield": 455,
    "armor": 185,
    "energy": 175,
    "sprintSpeed": 1.4,
    "description": "Burst into a hyper-sprint bowling over enemies and charging the battery. Crashing into solid objects generates a powerful shockwave. Hold to rush continuously.",
    "passive": "Moving generates an electrical current that fills Gauss' battery. Shields recharge up to 120% faster while the Recharge Delay is up to 80% shorter, based on the battery level.",
    "abilities": [
      {
        "name": "Mach Rush",
        "energyCost": 15,
        "description": "Burst into a hyper-sprint bowling over enemies and charging the battery. Crashing into solid objects generates a powerful shockwave. Hold to rush continuously.",
        "damage": 800,
        "range": 4,
        "radius": 10,
        "castTime": 0.3,
        "damageType": "Impact",
        "miscStats": {
          "energyDrain": 12.5,
          "dashDistance": 12,
          "batteryChargeOnCast": 0.1
        }
      },
      {
        "name": "Kinetic Plating",
        "energyCost": 50,
        "description": "Generate armor plating that converts a portion of absorbed Kinetic Damage (Physical, Heat, Cold, and Blast) into Energy. Also protects Gauss from being staggered or knocked down. Damage Resistance is relative to the battery level.",
        "duration": 30,
        "damageReduction": 1,
        "castTime": 0.5,
        "miscStats": {
          "minDamageReduction": 0.2,
          "drCap": 1,
          "emptyBatteryDrCap": 0.5,
          "energyRestorePerHit": 0.05,
          "batteryDrainPerSecond": 0.01
        }
      },
      {
        "name": "Thermal Sunder",
        "energyCost": 50,
        "description": "Siphon kinetic energy from the area, charging the battery and inflicting Cold Status on nearby enemies. Hold reverses the process, draining the battery and inflicting Heat Status.",
        "damage": 750,
        "aoeDamage": 1500,
        "duration": 15,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Cold",
        "miscStats": {
          "minRadius": 6,
          "maxRadius": 12,
          "batteryCharge": 0.1,
          "batteryDrain": 0.1,
          "areasPerElement": 4,
          "statusDurationMin": 4,
          "statusDurationMax": 8
        }
      },
      {
        "name": "Redline",
        "energyCost": 100,
        "description": "Push Gauss' battery beyond the redline, supercharging his Abilities and setting Fire Rate, Attack Speed, Reload Speed, and Casting Speed into overdrive. When past the redline, bolts of arcing electricity dance periodically from Gauss, exploding en masse when the ability is deactivated.",
        "damage": 400,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Impact",
        "miscStats": {
          "fireRateBuff": 0.75,
          "attackSpeedBuff": 0.4,
          "reloadBuff": 0.5,
          "castSpeedBuff": 0.5,
          "batteryDrainPerSecond": 0.02
        }
      }
    ]
  },
  {
    "id": "gauss_prime",
    "name": "Gauss Prime",
    "health": 270,
    "shield": 550,
    "armor": 185,
    "energy": 175,
    "sprintSpeed": 1.5,
    "description": "Burst into a hyper-sprint bowling over enemies and charging the battery. Crashing into solid objects generates a powerful shockwave. Hold to rush continuously.",
    "passive": "Moving generates an electrical current that fills Gauss' battery. Shields recharge up to 120% faster while the Recharge Delay is up to 80% shorter, based on the battery level.",
    "abilities": [
      {
        "name": "Mach Rush",
        "energyCost": 15,
        "description": "Burst into a hyper-sprint bowling over enemies and charging the battery. Crashing into solid objects generates a powerful shockwave. Hold to rush continuously.",
        "damage": 800,
        "range": 4,
        "radius": 10,
        "castTime": 0.3,
        "damageType": "Impact",
        "miscStats": {
          "energyDrain": 12.5,
          "dashDistance": 12,
          "batteryChargeOnCast": 0.1
        }
      },
      {
        "name": "Kinetic Plating",
        "energyCost": 50,
        "description": "Generate armor plating that converts a portion of absorbed Kinetic Damage (Physical, Heat, Cold, and Blast) into Energy. Also protects Gauss from being staggered or knocked down. Damage Resistance is relative to the battery level.",
        "duration": 30,
        "damageReduction": 1,
        "castTime": 0.5,
        "miscStats": {
          "minDamageReduction": 0.2,
          "drCap": 1,
          "emptyBatteryDrCap": 0.5,
          "energyRestorePerHit": 0.05,
          "batteryDrainPerSecond": 0.01
        }
      },
      {
        "name": "Thermal Sunder",
        "energyCost": 50,
        "description": "Siphon kinetic energy from the area, charging the battery and inflicting Cold Status on nearby enemies. Hold reverses the process, draining the battery and inflicting Heat Status.",
        "damage": 750,
        "aoeDamage": 1500,
        "duration": 15,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Cold",
        "miscStats": {
          "minRadius": 6,
          "maxRadius": 12,
          "batteryCharge": 0.1,
          "batteryDrain": 0.1,
          "areasPerElement": 4,
          "statusDurationMin": 4,
          "statusDurationMax": 8
        }
      },
      {
        "name": "Redline",
        "energyCost": 100,
        "description": "Push Gauss' battery beyond the redline, supercharging his Abilities and setting Fire Rate, Attack Speed, Reload Speed, and Casting Speed into overdrive. When past the redline, bolts of arcing electricity dance periodically from Gauss, exploding en masse when the ability is deactivated.",
        "damage": 400,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Impact",
        "miscStats": {
          "fireRateBuff": 0.75,
          "attackSpeedBuff": 0.4,
          "reloadBuff": 0.5,
          "castSpeedBuff": 0.5,
          "batteryDrainPerSecond": 0.02
        }
      }
    ]
  },
  {
    "id": "grendel",
    "name": "Grendel",
    "health": 1095,
    "shield": 95,
    "armor": 370,
    "energy": 175,
    "sprintSpeed": 0.94999999,
    "description": "Swallow enemies whole and store them in Grendel's gut. Hold to vomit out stored enemies, covering them in toxic bile.",
    "passive": "Each enemy consumed grants 250 bonus armor.",
    "abilities": [
      {
        "name": "Feast",
        "energyCost": 25,
        "description": "Swallow enemies whole and store them in Grendel's gut. Hold to vomit out stored enemies, covering them in toxic bile.",
        "damage": 500,
        "range": 25,
        "castTime": 0.4,
        "damageType": "Toxin",
        "miscStats": {
          "maxEnemies": 5,
          "vomitConeRange": 8,
          "damagePerSecond": 0.02,
          "mawOpenDuration": 1.5
        }
      },
      {
        "name": "Nourish",
        "energyCost": 50,
        "description": "Regenerate health as Grendel absorbs nourishment from enemies in his gut. While he digests, enemies that attack or are attacked by Grendel suffer Viral Damage and energy sources provide more energy. These buffs extend to squad mates.",
        "range": 25,
        "duration": 25,
        "castTime": 0.5,
        "miscStats": {
          "viralDamageBonus": 0.75,
          "energyMultiplier": 2,
          "selfHeal": 1000,
          "viralDamage": 250,
          "digestionDamage": 0.2,
          "splashRadius": 12,
          "viralStacks": 10
        }
      },
      {
        "name": "Pulverize",
        "energyCost": 0,
        "description": "Grendel curls into a ball. He heals over time as he rolls, knocking over anyone in his path. Jumping slams Grendel into the ground and generates a damaging shockwave.",
        "damage": 2000,
        "range": 15,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "minCollisionDamage": 500,
          "slamDamage": 500,
          "healPerSecond": 200,
          "armorStrip": 0.5,
          "toxinDamagePerSecond": 25,
          "minSlamRadius": 5,
          "collisionRadius": 5,
          "energyDrain": 3
        }
      },
      {
        "name": "Regurgitate",
        "energyCost": 0,
        "description": "Violently puke out a bile soaked enemy from Grendel's gut, turning the consumed into a toxic projectile. Nearby enemies are slowed and have their armor dissolved by the bile.",
        "damage": 2000,
        "range": 6,
        "castTime": 0.3,
        "damageType": "Toxin",
        "miscStats": {
          "armorStrip": 0.75,
          "slowPercent": 0.8,
          "slowDuration": 6
        }
      }
    ]
  },
  {
    "id": "grendel_prime",
    "name": "Grendel Prime",
    "health": 1095,
    "shield": 95,
    "armor": 400,
    "energy": 200,
    "sprintSpeed": 0.94999999,
    "description": "Swallow enemies whole and store them in Grendel's gut. Hold to vomit out stored enemies, covering them in toxic bile.",
    "passive": "Each enemy consumed grants 250 bonus armor.",
    "abilities": [
      {
        "name": "Feast",
        "energyCost": 25,
        "description": "Swallow enemies whole and store them in Grendel's gut. Hold to vomit out stored enemies, covering them in toxic bile.",
        "damage": 500,
        "range": 25,
        "castTime": 0.4,
        "damageType": "Toxin",
        "miscStats": {
          "maxEnemies": 5,
          "vomitConeRange": 8,
          "damagePerSecond": 0.02,
          "mawOpenDuration": 1.5
        }
      },
      {
        "name": "Nourish",
        "energyCost": 50,
        "description": "Regenerate health as Grendel absorbs nourishment from enemies in his gut. While he digests, enemies that attack or are attacked by Grendel suffer Viral Damage and energy sources provide more energy. These buffs extend to squad mates.",
        "range": 25,
        "duration": 25,
        "castTime": 0.5,
        "miscStats": {
          "viralDamageBonus": 0.75,
          "energyMultiplier": 2,
          "selfHeal": 1000,
          "viralDamage": 250,
          "digestionDamage": 0.2,
          "splashRadius": 12,
          "viralStacks": 10
        }
      },
      {
        "name": "Pulverize",
        "energyCost": 0,
        "description": "Grendel curls into a ball. He heals over time as he rolls, knocking over anyone in his path. Jumping slams Grendel into the ground and generates a damaging shockwave.",
        "damage": 2000,
        "range": 15,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "minCollisionDamage": 500,
          "slamDamage": 500,
          "healPerSecond": 200,
          "armorStrip": 0.5,
          "toxinDamagePerSecond": 25,
          "minSlamRadius": 5,
          "collisionRadius": 5,
          "energyDrain": 3
        }
      },
      {
        "name": "Regurgitate",
        "energyCost": 0,
        "description": "Violently puke out a bile soaked enemy from Grendel's gut, turning the consumed into a toxic projectile. Nearby enemies are slowed and have their armor dissolved by the bile.",
        "damage": 2000,
        "range": 6,
        "castTime": 0.3,
        "damageType": "Toxin",
        "miscStats": {
          "armorStrip": 0.75,
          "slowPercent": 0.8,
          "slowDuration": 6
        }
      }
    ]
  },
  {
    "id": "gyre",
    "name": "Gyre",
    "health": 270,
    "shield": 550,
    "armor": 105,
    "energy": 190,
    "sprintSpeed": 1,
    "description": "Launch a Gyratory Sphere that will deal high damage on impact and periodically deal electrical shocks to nearby enemies. Hit multiple enemies at once with the initial launch to enhance damage.",
    "passive": "Gyre's abilities have a 10% chance to deal critical damage for each Electrical status that affects the enemy.",
    "abilities": [
      {
        "name": "Arcsphere",
        "energyCost": 25,
        "description": "Launch a Gyratory Sphere that will deal high damage on impact and periodically deal electrical shocks to nearby enemies. Hit multiple enemies at once with the initial launch to enhance damage.",
        "damage": 2000,
        "duration": 10,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Electricity",
        "miscStats": {
          "fieldDamagePerSecond": 250,
          "fieldRadius": 7,
          "maxSpheres": 3,
          "multiHitDamageMultiplier": 2
        }
      },
      {
        "name": "Coil Horizon",
        "energyCost": 50,
        "description": "Throw forward a Gyratory Sphere that will implode after a few seconds or can be manually triggered.",
        "damage": 1250,
        "radius": 12,
        "castTime": 0.6,
        "damageType": "Electricity",
        "miscStats": {
          "contactDamagePerSecond": 1500,
          "sphereLifetime": 2,
          "implosionLifetime": 2
        }
      },
      {
        "name": "Cathode Grace",
        "energyCost": 75,
        "description": "Gain a brief burst of increased Critical Chance and Energy Regen, with each kill extending duration of Cathode Grace. Casting is on a cooldown.",
        "duration": 8,
        "castTime": 0.5,
        "miscStats": {
          "criticalChanceBonus": 0.5,
          "abilityCritChance": 0.5,
          "energyRegen": 1.5,
          "durationExtension": 3,
          "durationCap": 60,
          "castingCooldown": 60
        }
      },
      {
        "name": "Rotorswell",
        "energyCost": 100,
        "description": "Gyre's mechanisms spin at incredible speeds, generating an Electric Field that shocks nearby enemies. When Gyre gets a critical hit, a large electrical discharge will chain from the enemy that was hit to nearby enemies.",
        "damage": 250,
        "duration": 22,
        "radius": 4,
        "castTime": 0.8,
        "damageType": "Electricity",
        "miscStats": {
          "dischargeDamage": 500,
          "dischargeRange": 10,
          "moveSpeedMultiplier": 1.5,
          "dischargeTargets": 5,
          "simultaneousDischarges": 2,
          "dischargeCooldown": 1
        }
      }
    ]
  },
  {
    "id": "gyre_prime",
    "name": "Gyre Prime",
    "health": 345,
    "shield": 640,
    "armor": 105,
    "energy": 190,
    "sprintSpeed": 1.05,
    "description": "Launch a Gyratory Sphere that will deal high damage on impact and periodically deal electrical shocks to nearby enemies. Hit multiple enemies at once with the initial launch to enhance damage.",
    "passive": "Gyre's abilities have a 10% chance to deal critical damage for each Electrical status that affects the enemy.",
    "abilities": [
      {
        "name": "Arcsphere",
        "energyCost": 25,
        "description": "Launch a Gyratory Sphere that will deal high damage on impact and periodically deal electrical shocks to nearby enemies. Hit multiple enemies at once with the initial launch to enhance damage.",
        "damage": 2000,
        "duration": 10,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Electricity",
        "miscStats": {
          "fieldDamagePerSecond": 250,
          "fieldRadius": 7,
          "maxSpheres": 3,
          "multiHitDamageMultiplier": 2
        }
      },
      {
        "name": "Coil Horizon",
        "energyCost": 50,
        "description": "Throw forward a Gyratory Sphere that will implode after a few seconds or can be manually triggered.",
        "damage": 1250,
        "radius": 12,
        "castTime": 0.6,
        "damageType": "Electricity",
        "miscStats": {
          "contactDamagePerSecond": 1500,
          "sphereLifetime": 2,
          "implosionLifetime": 2
        }
      },
      {
        "name": "Cathode Grace",
        "energyCost": 75,
        "description": "Gain a brief burst of increased Critical Chance and Energy Regen, with each kill extending duration of Cathode Grace. Casting is on a cooldown.",
        "duration": 8,
        "castTime": 0.5,
        "miscStats": {
          "criticalChanceBonus": 0.5,
          "abilityCritChance": 0.5,
          "energyRegen": 1.5,
          "durationExtension": 3,
          "durationCap": 60,
          "castingCooldown": 60
        }
      },
      {
        "name": "Rotorswell",
        "energyCost": 100,
        "description": "Gyre's mechanisms spin at incredible speeds, generating an Electric Field that shocks nearby enemies. When Gyre gets a critical hit, a large electrical discharge will chain from the enemy that was hit to nearby enemies.",
        "damage": 250,
        "duration": 22,
        "radius": 4,
        "castTime": 0.8,
        "damageType": "Electricity",
        "miscStats": {
          "dischargeDamage": 500,
          "dischargeRange": 10,
          "moveSpeedMultiplier": 1.5,
          "dischargeTargets": 5,
          "simultaneousDischarges": 2,
          "dischargeCooldown": 1
        }
      }
    ]
  },
  {
    "id": "harrow",
    "name": "Harrow",
    "health": 270,
    "shield": 455,
    "armor": 185,
    "energy": 100,
    "sprintSpeed": 1,
    "description": "Cast a wave of energy that chains them where they stand. Each enemy held reinforces Harrow's shields.",
    "passive": "Overshield capacity doubled. Start missions at maximum energy.",
    "abilities": [
      {
        "name": "Condemn",
        "energyCost": 25,
        "description": "Cast a wave of energy that chains them where they stand. Each enemy held reinforces Harrow's shields.",
        "range": 20,
        "duration": 6,
        "castTime": 0.5,
        "miscStats": {
          "shieldsPerEnemy": 150,
          "waveWidth": 2.5
        }
      },
      {
        "name": "Penance",
        "energyCost": 50,
        "description": "Sacrifice Shields to boost Reload Speed, and Fire Rate while converting damage inflicted on enemies into health for Harrow and nearby allies.",
        "duration": 4,
        "castTime": 0.5,
        "miscStats": {
          "initialHealPercent": 0.5,
          "lifeStealPercent": 0.05,
          "fireRateBuff": 0.35,
          "reloadBuff": 0.7,
          "durationPer100Shields": 1.54,
          "maxDuration": 120
        }
      },
      {
        "name": "Thurible",
        "energyCost": 25,
        "description": "Channel Harrow's energy into the Thurible to generate a buff. Once finished, kill enemies to bestow nearby allies with bursts of energy. The more energy channeled the greater the reward. Headshots produce extra energy.",
        "range": 20,
        "duration": 35,
        "castTime": 1,
        "miscStats": {
          "energyConvert": 0.15,
          "headshotMultiplier": 4
        }
      },
      {
        "name": "Covenant",
        "energyCost": 100,
        "description": "Protect nearby allies with an energy force that absorbs all damage and converts it to a Critical Chance bonus for all those under the Covenant. Headshots are amplified even further.",
        "duration": 6,
        "castTime": 0.8,
        "miscStats": {
          "baseCriticalChance": 0.05,
          "critChancePer100Damage": 0.015,
          "critChanceDuration": 12,
          "headshotMultiplier": 4,
          "bodyshotCritChanceCap": 0.5,
          "headshotCritChanceCap": 2
        }
      }
    ]
  },
  {
    "id": "harrow_prime",
    "name": "Harrow Prime",
    "health": 270,
    "shield": 640,
    "armor": 185,
    "energy": 140,
    "sprintSpeed": 1,
    "description": "Cast a wave of energy that chains them where they stand. Each enemy held reinforces Harrow's shields.",
    "passive": "Overshield capacity doubled. Start missions at maximum energy.",
    "abilities": [
      {
        "name": "Condemn",
        "energyCost": 25,
        "description": "Cast a wave of energy that chains them where they stand. Each enemy held reinforces Harrow's shields.",
        "range": 20,
        "duration": 6,
        "castTime": 0.5,
        "miscStats": {
          "shieldsPerEnemy": 150,
          "waveWidth": 2.5
        }
      },
      {
        "name": "Penance",
        "energyCost": 50,
        "description": "Sacrifice Shields to boost Reload Speed, and Fire Rate while converting damage inflicted on enemies into health for Harrow and nearby allies.",
        "duration": 4,
        "castTime": 0.5,
        "miscStats": {
          "initialHealPercent": 0.5,
          "lifeStealPercent": 0.05,
          "fireRateBuff": 0.35,
          "reloadBuff": 0.7,
          "durationPer100Shields": 1.54,
          "maxDuration": 120
        }
      },
      {
        "name": "Thurible",
        "energyCost": 25,
        "description": "Channel Harrow's energy into the Thurible to generate a buff. Once finished, kill enemies to bestow nearby allies with bursts of energy. The more energy channeled the greater the reward. Headshots produce extra energy.",
        "range": 20,
        "duration": 35,
        "castTime": 1,
        "miscStats": {
          "energyConvert": 0.15,
          "headshotMultiplier": 4
        }
      },
      {
        "name": "Covenant",
        "energyCost": 100,
        "description": "Protect nearby allies with an energy force that absorbs all damage and converts it to a Critical Chance bonus for all those under the Covenant. Headshots are amplified even further.",
        "duration": 6,
        "castTime": 0.8,
        "miscStats": {
          "baseCriticalChance": 0.05,
          "critChancePer100Damage": 0.015,
          "critChanceDuration": 12,
          "headshotMultiplier": 4,
          "bodyshotCritChanceCap": 0.5,
          "headshotCritChanceCap": 2
        }
      }
    ]
  },
  {
    "id": "helminth",
    "name": "Helminth",
    "health": 0,
    "shield": 0,
    "armor": 0,
    "energy": 0,
    "sprintSpeed": 1,
    "description": "Increase the efficiency of your ammo consumption.",
    "passive": "",
    "abilities": [
      {
        "name": "Energized Munitions",
        "energyCost": 25,
        "description": "Increase the efficiency of your ammo consumption."
      },
      {
        "name": "Master's Summons",
        "energyCost": 25,
        "description": "Heal your companion and call it to your side."
      },
      {
        "name": "Voracious Metastasis",
        "energyCost": 25,
        "description": "Consume Energy to heal yourself and grant matching Energy to each ally."
      },
      {
        "name": "Perspicacity",
        "energyCost": 25,
        "description": "Automatically succeed at your next hack attempt."
      }
    ]
  },
  {
    "id": "hildryn",
    "name": "Hildryn",
    "health": 180,
    "shield": 1280,
    "armor": 315,
    "energy": 0,
    "sprintSpeed": 1,
    "description": "Charge and launch devastating bolts of electricity.",
    "passive": "Hildryn's full Shield Gate is high. After her Shields are depleted, she is invulnerable to damage up to 3.5s.",
    "abilities": [
      {
        "name": "Balefire",
        "energyCost": 0,
        "description": "Charge and launch devastating bolts of electricity.",
        "damage": 1500,
        "range": 3,
        "castTime": 0.5,
        "damageType": "Electricity",
        "miscStats": {
          "shieldCost": 50,
          "minDamage": 500
        }
      },
      {
        "name": "Pillage",
        "energyCost": 0,
        "description": "Pillage a percentage of Shields and Armor of nearby enemies to replenish Hildryn's own Shields and Overshields. Also removes Status Effects from Hildryn and her allies.",
        "range": 8,
        "duration": 2,
        "castTime": 0.8,
        "miscStats": {
          "shieldStrip": 0.25,
          "armorStrip": 0.25,
          "statusCleanse": true,
          "shieldCost": 150
        }
      },
      {
        "name": "Haven",
        "energyCost": 0,
        "description": "Create a shield aura around allies. Enemies that approach shielded allies will take damage.",
        "damagePerSecond": 200,
        "range": 15,
        "castTime": 0.6,
        "damageType": "Radiation",
        "miscStats": {
          "allyShieldBonus": 500,
          "shieldRechargeRate": 0.8,
          "shieldCost": 250,
          "shieldDrainPerAlly": 5,
          "shieldDrainPerEnemy": 25
        }
      },
      {
        "name": "Aegis Storm",
        "energyCost": 0,
        "description": "Take the skies and rain Balefire rockets down on the enemy. Nearby enemies are blasted into the air where they will create an Energy Orb every few seconds. When shields run out the enemies are smashed into the ground.",
        "damagePerSecond": 200,
        "range": 15,
        "castTime": 1,
        "damageType": "Radiation",
        "miscStats": {
          "deactivationDamage": 500,
          "shieldCost": 100,
          "shieldDrain": 25,
          "shieldDrainPerEnemy": 25,
          "dodgeShieldCost": 50,
          "maxAltitude": 10
        }
      }
    ]
  },
  {
    "id": "hildryn_prime",
    "name": "Hildryn Prime",
    "health": 270,
    "shield": 1380,
    "armor": 315,
    "energy": 0,
    "sprintSpeed": 1.05,
    "description": "Charge and launch devastating bolts of electricity.",
    "passive": "Hildryn's full Shield Gate is high. After her Shields are depleted, she is invulnerable to damage up to 3.5s.",
    "abilities": [
      {
        "name": "Balefire",
        "energyCost": 0,
        "description": "Charge and launch devastating bolts of electricity.",
        "damage": 1500,
        "range": 3,
        "castTime": 0.5,
        "damageType": "Electricity",
        "miscStats": {
          "shieldCost": 50,
          "minDamage": 500
        }
      },
      {
        "name": "Pillage",
        "energyCost": 0,
        "description": "Pillage a percentage of Shields and Armor of nearby enemies to replenish Hildryn's own Shields and Overshields. Also removes Status Effects from Hildryn and her allies.",
        "range": 8,
        "duration": 2,
        "castTime": 0.8,
        "miscStats": {
          "shieldStrip": 0.25,
          "armorStrip": 0.25,
          "statusCleanse": true,
          "shieldCost": 150
        }
      },
      {
        "name": "Haven",
        "energyCost": 0,
        "description": "Create a shield aura around allies. Enemies that approach shielded allies will take damage.",
        "damagePerSecond": 200,
        "range": 15,
        "castTime": 0.6,
        "damageType": "Radiation",
        "miscStats": {
          "allyShieldBonus": 500,
          "shieldRechargeRate": 0.8,
          "shieldCost": 250,
          "shieldDrainPerAlly": 5,
          "shieldDrainPerEnemy": 25
        }
      },
      {
        "name": "Aegis Storm",
        "energyCost": 0,
        "description": "Take the skies and rain Balefire rockets down on the enemy. Nearby enemies are blasted into the air where they will create an Energy Orb every few seconds. When shields run out the enemies are smashed into the ground.",
        "damagePerSecond": 200,
        "range": 15,
        "castTime": 1,
        "damageType": "Radiation",
        "miscStats": {
          "deactivationDamage": 500,
          "shieldCost": 100,
          "shieldDrain": 25,
          "shieldDrainPerEnemy": 25,
          "dodgeShieldCost": 50,
          "maxAltitude": 10
        }
      }
    ]
  },
  {
    "id": "hydroid",
    "name": "Hydroid",
    "health": 270,
    "shield": 365,
    "armor": 240,
    "energy": 140,
    "sprintSpeed": 1.05,
    "description": "Summon a tempest to rain down upon a target area.",
    "passive": "Enemies damaged by Hydroid are more vulnerable to Corrosive Status, with initial Status reducing Armor by 50%.",
    "abilities": [
      {
        "name": "Tempest Barrage",
        "energyCost": 25,
        "description": "Summon a tempest to rain down upon a target area.",
        "damage": 300,
        "duration": 10,
        "radius": 5,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "statusChance": 1,
        "miscStats": {
          "barrageRadius": 10,
          "salvosPerSecond": 4
        }
      },
      {
        "name": "Tidal Surge",
        "energyCost": 50,
        "description": "Crash through enemies in a ferocious wall of water.",
        "damage": 300,
        "range": 6,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "miscStats": {
          "waveDuration": 1,
          "recastEnergyDiscount": 0.5
        }
      },
      {
        "name": "Plunder",
        "energyCost": 75,
        "description": "Plunder Armor from nearby enemies and increase Corrosive Damage on your Abilities and weapons. Enemies affected by Corrosive Status offer a greater increase.",
        "range": 25,
        "duration": 25,
        "castTime": 0.8,
        "miscStats": {
          "armorPerEnemy": 40,
          "armorPerCorrosiveStatus": 40,
          "armorCap": 750,
          "corrosiveBonusPerEnemy": 0.1,
          "corrosiveBonusPerStatus": 0.1,
          "corrosiveBonusCap": 2
        }
      },
      {
        "name": "Tentacle Swarm",
        "energyCost": 50,
        "description": "Summon a creature from the depths. Its watery tentacles emerge from nearby surfaces to wreak havoc.",
        "damage": 200,
        "duration": 20,
        "castTime": 1,
        "damageType": "Corrosive",
        "statusChance": 1,
        "miscStats": {
          "spawnRadius": 15,
          "tentacleCount": 20,
          "overguardContactDamage": 200
        }
      }
    ]
  },
  {
    "id": "hydroid_prime",
    "name": "Hydroid Prime",
    "health": 270,
    "shield": 550,
    "armor": 290,
    "energy": 175,
    "sprintSpeed": 1.05,
    "description": "Summon a tempest to rain down upon a target area.",
    "passive": "Enemies damaged by Hydroid are more vulnerable to Corrosive Status, with initial Status reducing Armor by 50%.",
    "abilities": [
      {
        "name": "Tempest Barrage",
        "energyCost": 25,
        "description": "Summon a tempest to rain down upon a target area.",
        "damage": 300,
        "duration": 10,
        "radius": 5,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "statusChance": 1,
        "miscStats": {
          "barrageRadius": 10,
          "salvosPerSecond": 4
        }
      },
      {
        "name": "Tidal Surge",
        "energyCost": 50,
        "description": "Crash through enemies in a ferocious wall of water.",
        "damage": 300,
        "range": 6,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "miscStats": {
          "waveDuration": 1,
          "recastEnergyDiscount": 0.5
        }
      },
      {
        "name": "Plunder",
        "energyCost": 75,
        "description": "Plunder Armor from nearby enemies and increase Corrosive Damage on your Abilities and weapons. Enemies affected by Corrosive Status offer a greater increase.",
        "range": 25,
        "duration": 25,
        "castTime": 0.8,
        "miscStats": {
          "armorPerEnemy": 40,
          "armorPerCorrosiveStatus": 40,
          "armorCap": 750,
          "corrosiveBonusPerEnemy": 0.1,
          "corrosiveBonusPerStatus": 0.1,
          "corrosiveBonusCap": 2
        }
      },
      {
        "name": "Tentacle Swarm",
        "energyCost": 50,
        "description": "Summon a creature from the depths. Its watery tentacles emerge from nearby surfaces to wreak havoc.",
        "damage": 200,
        "duration": 20,
        "castTime": 1,
        "damageType": "Corrosive",
        "statusChance": 1,
        "miscStats": {
          "spawnRadius": 15,
          "tentacleCount": 20,
          "overguardContactDamage": 200
        }
      }
    ]
  },
  {
    "id": "inaros",
    "name": "Inaros",
    "health": 2110,
    "shield": 0,
    "armor": 240,
    "energy": 100,
    "sprintSpeed": 1,
    "description": "Blast enemies with a wave of cursed sand that blinds them and steals their health.",
    "passive": "When Inaros takes lethal damage, he entombs himself in a sarcophagus and incarnates as sand to attack enemies, draining their lifeforce to revive himself.",
    "abilities": [
      {
        "name": "Desiccation",
        "energyCost": 25,
        "description": "Blast enemies with a wave of cursed sand that blinds them and steals their health.",
        "damage": 150,
        "damagePerSecond": 8,
        "range": 15,
        "duration": 8,
        "castTime": 0.5,
        "damageType": "True",
        "miscStats": {
          "lifesteal": 0.25,
          "coneAngle": 180
        }
      },
      {
        "name": "Sandstorm",
        "energyCost": 25,
        "description": "Become a sandstorm. Inaros devours enemies pulled into his whirlwind, healing himself.",
        "damagePerSecond": 500,
        "range": 7.5,
        "duration": 4,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "healthPerEnemy": 50,
          "moveSpeed": 12,
          "tickInterval": 0.25
        }
      },
      {
        "name": "Scarab Shell",
        "energyCost": 0,
        "description": "Activate to form Armor by draining Inaros's Health. Activate again to stop the formation early. The protective layer reduces incoming Damage and absorbs Status Effects.",
        "castTime": 0.3,
        "miscStats": {
          "armorBonus": 350,
          "totalHealthCost": 2500,
          "statusProtectionCost": 0.05,
          "minHealthThreshold": 2
        }
      },
      {
        "name": "Scarab Swarm",
        "energyCost": 100,
        "description": "Summon a Scarab Swarm to attack enemies with guaranteed Corrosive Status. Damage scales with Inaros's Health. Enemies killed while immersed in the swarm summon a Swarm Kavat that fights alongside Inaros and guides the scarabs to other enemies.",
        "range": 30,
        "duration": 15,
        "castTime": 0.8,
        "damageType": "Corrosive",
        "miscStats": {
          "healthAsDamage": 0.1,
          "spreadRange": 12,
          "swarmKavatLimit": 3,
          "swarmKavatLifespan": 20,
          "tickInterval": 0.5
        }
      }
    ]
  },
  {
    "id": "inaros_prime",
    "name": "Inaros Prime",
    "health": 2215,
    "shield": 0,
    "armor": 240,
    "energy": 140,
    "sprintSpeed": 1.05,
    "description": "Blast enemies with a wave of cursed sand that blinds them and steals their health.",
    "passive": "When Inaros takes lethal damage, he entombs himself in a sarcophagus and incarnates as sand to attack enemies, draining their lifeforce to revive himself.",
    "abilities": [
      {
        "name": "Desiccation",
        "energyCost": 25,
        "description": "Blast enemies with a wave of cursed sand that blinds them and steals their health.",
        "damage": 150,
        "damagePerSecond": 8,
        "range": 15,
        "duration": 8,
        "castTime": 0.5,
        "damageType": "True",
        "miscStats": {
          "lifesteal": 0.25,
          "coneAngle": 180
        }
      },
      {
        "name": "Sandstorm",
        "energyCost": 25,
        "description": "Become a sandstorm. Inaros devours enemies pulled into his whirlwind, healing himself.",
        "damagePerSecond": 500,
        "range": 7.5,
        "duration": 4,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "healthPerEnemy": 50,
          "moveSpeed": 12,
          "tickInterval": 0.25
        }
      },
      {
        "name": "Scarab Shell",
        "energyCost": 0,
        "description": "Activate to form Armor by draining Inaros's Health. Activate again to stop the formation early. The protective layer reduces incoming Damage and absorbs Status Effects.",
        "castTime": 0.3,
        "miscStats": {
          "armorBonus": 350,
          "totalHealthCost": 2500,
          "statusProtectionCost": 0.05,
          "minHealthThreshold": 2
        }
      },
      {
        "name": "Scarab Swarm",
        "energyCost": 100,
        "description": "Summon a Scarab Swarm to attack enemies with guaranteed Corrosive Status. Damage scales with Inaros's Health. Enemies killed while immersed in the swarm summon a Swarm Kavat that fights alongside Inaros and guides the scarabs to other enemies.",
        "range": 30,
        "duration": 15,
        "castTime": 0.8,
        "damageType": "Corrosive",
        "miscStats": {
          "healthAsDamage": 0.1,
          "spreadRange": 12,
          "swarmKavatLimit": 3,
          "swarmKavatLifespan": 20,
          "tickInterval": 0.5
        }
      }
    ]
  },
  {
    "id": "ivara",
    "name": "Ivara",
    "health": 180,
    "shield": 270,
    "armor": 105,
    "energy": 215,
    "sprintSpeed": 1.15,
    "description": "Cycle through and shoot one of four tactical arrows. Cloak creates a stationary bubble that cloaks Ivara and allies. Dashwire creates a traversable zipline. Noise emits a high-pitched sound to attract enemies. Sleep puts enemies to sleep.",
    "passive": "Senses nearby enemies within 50m.",
    "abilities": [
      {
        "name": "Quiver",
        "energyCost": 25,
        "description": "Cycle through and shoot one of four tactical arrows. Cloak creates a stationary bubble that cloaks Ivara and allies. Dashwire creates a traversable zipline. Noise emits a high-pitched sound to attract enemies. Sleep puts enemies to sleep.",
        "duration": 12,
        "radius": 2.5,
        "castTime": 0.4,
        "miscStats": {
          "noiseRadius": 20,
          "sleepDuration": 10,
          "sleepRadius": 6,
          "sleepHealthThreshold": 0.5,
          "maxCloakBubbles": 3,
          "maxZiplines": 4,
          "ziplineRange": 100
        }
      },
      {
        "name": "Navigator",
        "energyCost": 25,
        "description": "Assume control of any projectile launched by Ivara and guide it to the target.",
        "castTime": 0.5,
        "miscStats": {
          "maxDamageMultiplier": 5,
          "multiplierGrowth": 1,
          "energyDrain": 3,
          "energyDrainGrowth": 2,
          "channeled": true
        }
      },
      {
        "name": "Prowl",
        "energyCost": 25,
        "description": "Become invisible and steal loot from unsuspecting enemies or take out prey with deadly headshots.",
        "range": 4,
        "castTime": 0.5,
        "miscStats": {
          "headshotBonus": 0.4,
          "lootChance": 1,
          "stealTime": 2.5,
          "movementSpeedPenalty": 0.5,
          "energyDrain": 1,
          "energyDrainMoving": 3,
          "meleeEnergyCost": 2,
          "damageEnergyCost": 10,
          "channeled": true
        }
      },
      {
        "name": "Artemis Bow",
        "energyCost": 50,
        "description": "Summon a mighty bow and unleash a volley of devastating arrows.",
        "damage": 240,
        "castTime": 0.8,
        "damageType": "Puncture",
        "miscStats": {
          "arrowCount": 7,
          "energyPerShot": 15
        }
      }
    ]
  },
  {
    "id": "ivara_prime",
    "name": "Ivara Prime",
    "health": 180,
    "shield": 455,
    "armor": 135,
    "energy": 250,
    "sprintSpeed": 1.2,
    "description": "Cycle through and shoot one of four tactical arrows. Cloak creates a stationary bubble that cloaks Ivara and allies. Dashwire creates a traversable zipline. Noise emits a high-pitched sound to attract enemies. Sleep puts enemies to sleep.",
    "passive": "Senses nearby enemies within 50m.",
    "abilities": [
      {
        "name": "Quiver",
        "energyCost": 25,
        "description": "Cycle through and shoot one of four tactical arrows. Cloak creates a stationary bubble that cloaks Ivara and allies. Dashwire creates a traversable zipline. Noise emits a high-pitched sound to attract enemies. Sleep puts enemies to sleep.",
        "duration": 12,
        "radius": 2.5,
        "castTime": 0.4,
        "miscStats": {
          "noiseRadius": 20,
          "sleepDuration": 10,
          "sleepRadius": 6,
          "sleepHealthThreshold": 0.5,
          "maxCloakBubbles": 3,
          "maxZiplines": 4,
          "ziplineRange": 100
        }
      },
      {
        "name": "Navigator",
        "energyCost": 25,
        "description": "Assume control of any projectile launched by Ivara and guide it to the target.",
        "castTime": 0.5,
        "miscStats": {
          "maxDamageMultiplier": 5,
          "multiplierGrowth": 1,
          "energyDrain": 3,
          "energyDrainGrowth": 2,
          "channeled": true
        }
      },
      {
        "name": "Prowl",
        "energyCost": 25,
        "description": "Become invisible and steal loot from unsuspecting enemies or take out prey with deadly headshots.",
        "range": 4,
        "castTime": 0.5,
        "miscStats": {
          "headshotBonus": 0.4,
          "lootChance": 1,
          "stealTime": 2.5,
          "movementSpeedPenalty": 0.5,
          "energyDrain": 1,
          "energyDrainMoving": 3,
          "meleeEnergyCost": 2,
          "damageEnergyCost": 10,
          "channeled": true
        }
      },
      {
        "name": "Artemis Bow",
        "energyCost": 50,
        "description": "Summon a mighty bow and unleash a volley of devastating arrows.",
        "damage": 240,
        "castTime": 0.8,
        "damageType": "Puncture",
        "miscStats": {
          "arrowCount": 7,
          "energyPerShot": 15
        }
      }
    ]
  },
  {
    "id": "jade",
    "name": "Jade",
    "health": 365,
    "shield": 450,
    "armor": 135,
    "energy": 150,
    "sprintSpeed": 1,
    "description": "Create a well of light that heals allies and hurts enemies. Those who enter the well will be highlighted by Judgments.",
    "passive": "Jade's profound understanding of the relationship between life and death grants her two Aura Mod Slots. Some of her Abilities apply Judgments, increasing enemy damage vulnerability by 50% for 10s.",
    "abilities": [
      {
        "name": "Light's Judgment",
        "energyCost": 25,
        "description": "Create a well of light that heals allies and hurts enemies. Those who enter the well will be highlighted by Judgments.",
        "damage": 500,
        "duration": 10,
        "radius": 6,
        "castTime": 0.6,
        "damageType": "Heat",
        "miscStats": {
          "healthRegen": 0.08,
          "wellsLimit": 5,
          "judgmentVulnerability": 0.5,
          "tickInterval": 0.5
        }
      },
      {
        "name": "Symphony Of Mercy",
        "energyCost": 50,
        "description": "Cycle through three songs that strengthen allies. Power of The Seven increases Ability Strength. Deathbringer increases Weapon Damage. Spirit of Resilience increases Shield Effectiveness. Extend the duration of each song by killing enemies surrounded by Judgments.",
        "duration": 30,
        "castTime": 0.5,
        "damageBuff": 1,
        "miscStats": {
          "strengthBonus": 0.25,
          "shieldRegen": 0.1,
          "shieldRechargeDelayReduction": 0.1,
          "affinityRange": 50,
          "strengthBonusCap": 1.5
        }
      },
      {
        "name": "Ophanim Eyes",
        "energyCost": 50,
        "description": "Jade summons an accusatory gaze that slows nearby enemies and dissolves their Shields and Armor. When the gaze falls upon allies, they can be revived from a distance.",
        "damage": 50,
        "range": 20,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Heat",
        "miscStats": {
          "armorStripPerSecond": 0.1,
          "shieldStripPerSecond": 0.1,
          "slowPerSecond": 0.15,
          "slowCap": 0.9,
          "coneAngle": 70,
          "tickInterval": 0.5
        }
      },
      {
        "name": "Glory On High",
        "energyCost": 25,
        "description": "Soar with destructive power. Use alternate-fire to detonate Judgments, causing an explosion of Jade Light. Enemies inside the Light's Judgment radius empower the explosion.",
        "damage": 150,
        "aoeDamage": 1500,
        "range": 2,
        "damageReduction": 0.35,
        "castTime": 1,
        "damageType": "Heat",
        "miscStats": {
          "drCap": 0.5,
          "energyDrain": 5,
          "altFireExplosion": 4,
          "altFireEnergy": 25,
          "judgmentChance": 0.1,
          "speedBuff": 1
        }
      }
    ]
  },
  {
    "id": "khora",
    "name": "Khora",
    "health": 365,
    "shield": 270,
    "armor": 290,
    "energy": 140,
    "sprintSpeed": 1.05,
    "description": "Send enemies reeling with a deafening whipcrack. Stats are boosted by the equipped mods on Whipclaw.",
    "passive": "The ferocious kavat, Venari, fights by Khora's side and provides her with a 15% speed boost while active. If killed, Venari will reappear after 45s.",
    "abilities": [
      {
        "name": "Whipclaw",
        "energyCost": 25,
        "description": "Send enemies reeling with a deafening whipcrack. Stats are boosted by the equipped mods on Whipclaw.",
        "damage": 150,
        "range": 10,
        "radius": 5,
        "castTime": 0.4,
        "damageType": "Slash",
        "miscStats": {
          "ensnareDamageMultiplier": 2
        }
      },
      {
        "name": "Ensnare",
        "energyCost": 50,
        "description": "Bind a hapless target in living metal, entangling others who stray too close. Whipclaw will refresh the trap allowing it to capture more enemies.",
        "range": 30,
        "duration": 15,
        "castTime": 0.5,
        "miscStats": {
          "spreadRadius": 10,
          "spreadDelay": 0.5,
          "damageMultiplier": 2
        }
      },
      {
        "name": "Venari",
        "energyCost": 0,
        "description": "Command Venari to focus on a target. Hold to cycle between Attack, Protect, and Heal postures. If Venari is killed, use this ability to revive her instantly.",
        "castTime": 0.3,
        "miscStats": {
          "moveSpeedMultiplier": 1.15,
          "snareDamage": 350,
          "healthRegen": 50,
          "markDuration": 120,
          "respawnTime": 45,
          "healAuraRadius": 10
        }
      },
      {
        "name": "Strangledome",
        "energyCost": 100,
        "description": "Weave a dome of living chain that ensnares and strangles any enemy within, and any foolish enough to approach. Foes outside the trap will try to hasten their comrade's deaths by shooting them. Crack Whipclaw on the dome to further damage any trapped enemies.",
        "damage": 250,
        "range": 5,
        "duration": 20,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "grabRadius": 10,
          "damageVulnerability": 2,
          "maxDomes": 2,
          "vertices": 26
        }
      }
    ]
  },
  {
    "id": "khora_prime",
    "name": "Khora Prime",
    "health": 365,
    "shield": 365,
    "armor": 345,
    "energy": 175,
    "sprintSpeed": 1.05,
    "description": "Send enemies reeling with a deafening whipcrack. Stats are boosted by the equipped mods on Whipclaw.",
    "passive": "The ferocious kavat, Venari, fights by Khora's side and provides her with a 15% speed boost while active. If killed, Venari will reappear after 45s.",
    "abilities": [
      {
        "name": "Whipclaw",
        "energyCost": 25,
        "description": "Send enemies reeling with a deafening whipcrack. Stats are boosted by the equipped mods on Whipclaw.",
        "damage": 150,
        "range": 10,
        "radius": 5,
        "castTime": 0.4,
        "damageType": "Slash",
        "miscStats": {
          "ensnareDamageMultiplier": 2
        }
      },
      {
        "name": "Ensnare",
        "energyCost": 50,
        "description": "Bind a hapless target in living metal, entangling others who stray too close. Whipclaw will refresh the trap allowing it to capture more enemies.",
        "range": 30,
        "duration": 15,
        "castTime": 0.5,
        "miscStats": {
          "spreadRadius": 10,
          "spreadDelay": 0.5,
          "damageMultiplier": 2
        }
      },
      {
        "name": "Venari",
        "energyCost": 0,
        "description": "Command Venari to focus on a target. Hold to cycle between Attack, Protect, and Heal postures. If Venari is killed, use this ability to revive her instantly.",
        "castTime": 0.3,
        "miscStats": {
          "moveSpeedMultiplier": 1.15,
          "snareDamage": 350,
          "healthRegen": 50,
          "markDuration": 120,
          "respawnTime": 45,
          "healAuraRadius": 10
        }
      },
      {
        "name": "Strangledome",
        "energyCost": 100,
        "description": "Weave a dome of living chain that ensnares and strangles any enemy within, and any foolish enough to approach. Foes outside the trap will try to hasten their comrade's deaths by shooting them. Crack Whipclaw on the dome to further damage any trapped enemies.",
        "damage": 250,
        "range": 5,
        "duration": 20,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "grabRadius": 10,
          "damageVulnerability": 2,
          "maxDomes": 2,
          "vertices": 26
        }
      }
    ]
  },
  {
    "id": "koumei",
    "name": "Koumei",
    "health": 344,
    "shield": 122,
    "armor": 444,
    "energy": 122,
    "sprintSpeed": 1,
    "description": "Weave the threads of destiny. Enemies who touch the threads suffer a random Elemental Status Effect. A roll of triple sixes creates threads that inflict one of every Elemental Status at once.",
    "passive": "Every 60 seconds, one of Koumei's weapons will inflict random Status Effects for 60 seconds.",
        "abilities": [
      {
        "name": "Kumihimo",
        "energyCost": 25,
        "description": "Weave the threads of destiny. Enemies who touch the threads suffer a random Elemental Status Effect. A roll of triple sixes creates threads that inflict one of every Elemental Status Effect.",
        "damage": 25,
        "range": 30,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "bounceRadius": 3,
          "threadLength": 15,
          "threads": 15,
          "maxThreads": 30,
          "tripleSixBounceDamage": 2750
        }
      },
      {
        "name": "Omikuji",
        "energyCost": 50,
        "description": "Koumei glimpses a favorable future and the precise steps needed to reach it. Complete the challenge to earn a Decree. Unlucky rolls add a debuff, but you can hold the ability to reject the Omikuji.",
        "castTime": 0.6,
        "miscStats": {
          "rareDecreeChance": 0.15,
          "unluckyThreshold": 12,
          "cooldownCap": 150,
          "allyKillWindow": 2
        }
      },
      {
        "name": "Omamori",
        "energyCost": 75,
        "description": "Surround yourself with Omamori Charms, each with a chance to have enemy attacks heal you instead of damage you. The number of charms is determined by Koumei's dice roll. A roll of triple sixes grants invulnerability for the duration of your Omamori Charms.",
        "castTime": 0.8,
        "miscStats": {
          "healMultiplier": 1,
          "blockChance": 0.5,
          "healCooldown": 3,
          "recastThreshold": 5
        }
      },
      {
        "name": "Bunraku",
        "energyCost": 100,
        "description": "Wield your foe's fate threads like the strings of marionettes. Koumei's dice determine how many Status Effects foes in front of Koumei will suffer. A roll of triple sixes causes further Status Effects over time and extends Bunraku to enemies behind Koumei.",
        "damage": 500,
        "range": 30,
        "duration": 20,
        "castTime": 1,
        "damageType": "Puncture",
        "miscStats": {
          "coneAngle": 170,
          "cooldown": 3,
          "statusDurationPause": 30
        }
      }
    ]
  },
  {
    "id": "kullervo",
    "name": "Kullervo",
    "health": 1005,
    "shield": 0,
    "armor": 550,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "(TAP) Kullervo charges a Heavy Attack, then teleports to his target and strikes. His rage-filled focus temporarily increases his Melee Critical Chance. (HOLD) Teleport to any marked target.",
    "passive": "Kullervo boasts +75% Heavy Attack Efficiency and +100% Heavy Attack Wind Up Speed on all melee weapons.",
    "abilities": [
      {
        "name": "Wrathful Advance",
        "energyCost": 25,
        "description": "(TAP) Kullervo charges a Heavy Attack, then teleports to his target and strikes. His rage-filled focus temporarily increases his Melee Critical Chance. (HOLD) Teleport to any marked location.",
        "duration": 10,
        "range": 25,
        "cooldown": 1,
        "castTime": 0.5,
        "miscStats": {
          "criticalChanceBonus": 2
        }
      },
      {
        "name": "Recompense",
        "energyCost": 50,
        "description": "Kullervo surrounds himself with daggers. Each dagger that strikes an enemy restores his health, but each dagger that misses an enemy strikes Kullervo, dealing a bit of damage. When Kullervo has max Health, he receives Overguard from struck enemies.",
        "damage": 500,
        "radius": 8,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "healthPerHit": 350,
          "missDrain": 35,
          "overguardCap": 10000,
          "daggerCount": 10,
          "daggerAirtime": 5,
          "invulnerabilityDuration": 1,
          "maxDaggersPerEnemy": 3
        }
      },
      {
        "name": "Collective Curse",
        "energyCost": 75,
        "description": "Kullervo sends forth a curse that binds enemies. When a cursed enemy takes damage from him, every other cursed enemy also suffers a portion of that damage.",
        "duration": 25,
        "range": 25,
        "castTime": 0.5,
        "miscStats": {
          "damageRedirection": 0.5,
          "coneAngle": 65,
          "damageRedirectionCap": 1
        }
      },
      {
        "name": "Storm Of Ukko",
        "energyCost": 100,
        "description": "The Void answers Kullervo's invocation with a storm of daggers that rain down upon his enemies.",
        "damage": 2500,
        "duration": 15,
        "radius": 10,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "maxStorms": 1,
          "ticksPerSecond": 2
        }
      }
    ]
  },
  {
    "id": "lavos",
    "name": "Lavos",
    "health": 540,
    "shield": 270,
    "armor": 575,
    "energy": 0,
    "sprintSpeed": 1.15,
    "description": "Lash out with a toxic serpentine strike, consuming the target to heal Lavos. Hold to imbue all abilities with Toxin.",
    "passive": "Energy and Universal Orbs give Lavos status immunity for 10s. Hold any ability to imbue the next cast with additional Elemental Damage and Status.",
    "abilities": [
      {
        "name": "Ophidian Bite",
        "energyCost": 0,
        "description": "Lash out with a toxic serpentine strike, consuming the target to heal Lavos. Hold to imbue all abilities with Toxin.",
        "damage": 1000,
        "range": 10,
        "cooldown": 8,
        "castTime": 0.5,
        "damageType": "Toxin",
        "miscStats": {
          "healthConversion": 0.15,
          "coneAngle": 100
        }
      },
      {
        "name": "Vial Rush",
        "energyCost": 0,
        "description": "Dash forward, crashing through enemies and leaving an icy trail of broken vials. Hold to imbue the next ability cast with Cold.",
        "damage": 250,
        "duration": 8,
        "range": 30,
        "radius": 9,
        "cooldown": 5,
        "castTime": 0.4,
        "damageType": "Cold",
        "miscStats": {
          "vialCharges": 24,
          "residueRadius": 2,
          "chargeSpeed": 30
        }
      },
      {
        "name": "Transmutation Probe",
        "energyCost": 0,
        "description": "Launch a probe that converts Health and Energy Orbs into Universal Orbs that provide both, and ammo pickups into Universal Ammo Pickups. The probe shocks enemies in close proximity. Each electrocuted foe reduces other ability cooldowns by 1.5s.",
        "damage": 250,
        "radius": 6,
        "cooldown": 10,
        "castTime": 0.6,
        "damageType": "Electricity",
        "miscStats": {
          "probeSpeed": 15,
          "probeDuration": 3,
          "cooldownReduction": 1.5,
          "haltDelay": 0.5
        }
      },
      {
        "name": "Catalyze",
        "energyCost": 0,
        "description": "Catalyst Probes erupt from Lavos and douse combatants in a fiery gel. Damage is doubled for each element afflicting an enemy. Hold to imbue the next ability cast with Heat.",
        "damage": 2000,
        "range": 25,
        "cooldown": 30,
        "castTime": 0.8,
        "damageType": "Heat",
        "miscStats": {
          "probeCount": 9,
          "probeSpeed": 8.33,
          "travelTime": 3,
          "gelMistReach": 5,
          "damagePerStatus": 1
        }
      }
    ]
  },
  {
    "id": "lavos_prime",
    "name": "Lavos Prime",
    "health": 600,
    "shield": 310,
    "armor": 575,
    "energy": 0,
    "sprintSpeed": 1.15,
    "description": "Lash out with a toxic serpentine strike, consuming the target to heal Lavos. Hold to imbue all abilities with Toxin.",
    "passive": "Energy and Universal Orbs give Lavos status immunity for 10s. Hold any ability to imbue the next cast with additional Elemental Damage and Status.",
    "abilities": [
      {
        "name": "Ophidian Bite",
        "energyCost": 0,
        "description": "Lash out with a toxic serpentine strike, consuming the target to heal Lavos. Hold to imbue all abilities with Toxin.",
        "damage": 1000,
        "range": 10,
        "cooldown": 8,
        "castTime": 0.5,
        "damageType": "Toxin",
        "miscStats": {
          "healthConversion": 0.15,
          "coneAngle": 100
        }
      },
      {
        "name": "Vial Rush",
        "energyCost": 0,
        "description": "Dash forward, crashing through enemies and leaving an icy trail of broken vials. Hold to imbue the next ability cast with Cold.",
        "damage": 250,
        "duration": 8,
        "range": 30,
        "radius": 9,
        "cooldown": 5,
        "castTime": 0.4,
        "damageType": "Cold",
        "miscStats": {
          "vialCharges": 24,
          "residueRadius": 2,
          "chargeSpeed": 30
        }
      },
      {
        "name": "Transmutation Probe",
        "energyCost": 0,
        "description": "Launch a probe that converts Health and Energy Orbs into Universal Orbs that provide both, and ammo pickups into Universal Ammo Pickups. The probe shocks enemies in close proximity. Each electrocuted foe reduces other ability cooldowns by 1.5s.",
        "damage": 250,
        "radius": 6,
        "cooldown": 10,
        "castTime": 0.6,
        "damageType": "Electricity",
        "miscStats": {
          "probeSpeed": 15,
          "probeDuration": 3,
          "cooldownReduction": 1.5,
          "haltDelay": 0.5
        }
      },
      {
        "name": "Catalyze",
        "energyCost": 0,
        "description": "Catalyst Probes erupt from Lavos and douse combatants in a fiery gel. Damage is doubled for each element afflicting an enemy. Hold to imbue the next ability cast with Heat.",
        "damage": 2000,
        "range": 25,
        "cooldown": 30,
        "castTime": 0.8,
        "damageType": "Heat",
        "miscStats": {
          "probeCount": 9,
          "probeSpeed": 8.33,
          "travelTime": 3,
          "gelMistReach": 5,
          "damagePerStatus": 1
        }
      }
    ]
  },
  {
    "id": "limbo",
    "name": "Limbo",
    "health": 270,
    "shield": 180,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1.15,
    "description": "Casts a wave of Rift energy that damages hostiles while pushing enemies and allies out of Limbo's current plane of existence.",
    "passive": "Dodge to enter and exit the Rift. Entering leaves behind a small Rift portal lasting 5s. Energy slowly recharges in the Rift, and each enemy killed in there also gives 10 Energy.",
    "abilities": [
      {
        "name": "Banish",
        "energyCost": 25,
        "description": "Casts a wave of Rift energy that damages hostiles while pushing enemies and allies out of Limbo's current plane of existence.",
        "damage": 250,
        "range": 35,
        "duration": 25,
        "castTime": 0.4,
        "damageType": "Impact",
        "miscStats": {
          "transitionalDamage": 300,
          "energyRegen": 2,
          "coneInitialRadius": 5,
          "spreadAngle": 15
        }
      },
      {
        "name": "Stasis",
        "energyCost": 50,
        "description": "Freezes Rift-bound enemies. While active, enemy projectiles are arrested in mid-air, resuming its trajectory when stasis ends.",
        "duration": 15,
        "castTime": 0.5,
        "miscStats": {
          "gunfireObjectLimit": 300
        }
      },
      {
        "name": "Rift Surge",
        "energyCost": 50,
        "description": "Surges nearby Rift-bound enemies with Rift energy. When killed the Rift Surge is transferred to a nearby enemy outside the rift. Surged enemies that leave the Rift perform a radial Banish.",
        "range": 25,
        "duration": 25,
        "radius": 5,
        "castTime": 0.6,
        "miscStats": {
          "banishDuration": 18,
          "transitionalDamage": 300
        }
      },
      {
        "name": "Cataclysm",
        "energyCost": 100,
        "description": "A violent blast of Void energy tears open a pocket of rift plane which can sustain itself for a short period before collapsing in another lethal blast.",
        "damage": 500,
        "range": 16,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "finalRadius": 5,
          "transitionalDamage": 300,
          "energyRegen": 2,
          "collapseDamageBonus": 0.1
        }
      }
    ]
  },
  {
    "id": "limbo_prime",
    "name": "Limbo Prime",
    "health": 270,
    "shield": 270,
    "armor": 135,
    "energy": 215,
    "sprintSpeed": 1.15,
    "description": "Casts a wave of Rift energy that damages hostiles while pushing enemies and allies out of Limbo's current plane of existence.",
    "passive": "Dodge to enter and exit the Rift. Entering leaves behind a small Rift portal lasting 5s. Energy slowly recharges in the Rift, and each enemy killed in there also gives 10 Energy.",
    "abilities": [
      {
        "name": "Banish",
        "energyCost": 25,
        "description": "Casts a wave of Rift energy that damages hostiles while pushing enemies and allies out of Limbo's current plane of existence.",
        "damage": 250,
        "range": 35,
        "duration": 25,
        "castTime": 0.4,
        "damageType": "Impact",
        "miscStats": {
          "transitionalDamage": 300,
          "energyRegen": 2,
          "coneInitialRadius": 5,
          "spreadAngle": 15
        }
      },
      {
        "name": "Stasis",
        "energyCost": 50,
        "description": "Freezes Rift-bound enemies. While active, enemy projectiles are arrested in mid-air, resuming its trajectory when stasis ends.",
        "duration": 15,
        "castTime": 0.5,
        "miscStats": {
          "gunfireObjectLimit": 300
        }
      },
      {
        "name": "Rift Surge",
        "energyCost": 50,
        "description": "Surges nearby Rift-bound enemies with Rift energy. When killed the Rift Surge is transferred to a nearby enemy outside the rift. Surged enemies that leave the Rift perform a radial Banish.",
        "range": 25,
        "duration": 25,
        "radius": 5,
        "castTime": 0.6,
        "miscStats": {
          "banishDuration": 18,
          "transitionalDamage": 300
        }
      },
      {
        "name": "Cataclysm",
        "energyCost": 100,
        "description": "A violent blast of Void energy tears open a pocket of rift plane which can sustain itself for a short period before collapsing in another lethal blast.",
        "damage": 500,
        "range": 16,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "finalRadius": 5,
          "transitionalDamage": 300,
          "energyRegen": 2,
          "collapseDamageBonus": 0.1
        }
      }
    ]
  },
  {
    "id": "loki",
    "name": "Loki",
    "health": 180,
    "shield": 180,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1.25,
    "description": "Loki deploys a holographic copy of himself that draws enemy fire and absorbs a portion of nearby enemy health and shields.",
    "passive": "Able to hang from walls 10x longer than normal.",
    "abilities": [
      {
        "name": "Decoy",
        "energyCost": 25,
        "description": "Loki deploys a holographic copy of himself that draws enemy fire. The decoy gains health and shield based on enemies nearby.",
        "range": 15,
        "duration": 25,
        "castTime": 0.4,
        "miscStats": {
          "healthShieldAbsorb": 0.15,
          "decoyShields": 400,
          "decoyHealth": 200
        }
      },
      {
        "name": "Invisibility",
        "energyCost": 50,
        "description": "Loki camouflages himself, becoming invisible to enemies.",
        "duration": 12,
        "castTime": 0.5
      },
      {
        "name": "Switch Teleport",
        "energyCost": 25,
        "description": "Loki instantaneously swaps positions with a target, confusing the enemy.",
        "range": 75,
        "duration": 5,
        "castTime": 0.3,
        "miscStats": {
          "speedBuff": 0.5
        }
      },
      {
        "name": "Radial Disarm",
        "energyCost": 100,
        "description": "Lets forth a wave of energy, disrupting the projectile weapons of enemies in range and forcing them to revert to melee combat.",
        "damage": 500,
        "range": 20,
        "castTime": 0.8,
        "damageType": "Impact"
      }
    ]
  },
  {
    "id": "loki_prime",
    "name": "Loki Prime",
    "health": 180,
    "shield": 180,
    "armor": 135,
    "energy": 215,
    "sprintSpeed": 1.25,
    "description": "Loki deploys a holographic copy of himself that draws enemy fire and absorbs a portion of nearby enemy health and shields.",
    "passive": "Able to hang from walls 10x longer than normal.",
    "abilities": [
      {
        "name": "Decoy",
        "energyCost": 25,
        "description": "Loki deploys a holographic copy of himself that draws enemy fire. The decoy gains health and shield based on enemies nearby.",
        "range": 15,
        "duration": 25,
        "castTime": 0.4,
        "miscStats": {
          "healthShieldAbsorb": 0.15,
          "decoyShields": 400,
          "decoyHealth": 200
        }
      },
      {
        "name": "Invisibility",
        "energyCost": 50,
        "description": "Loki camouflages himself, becoming invisible to enemies.",
        "duration": 12,
        "castTime": 0.5
      },
      {
        "name": "Switch Teleport",
        "energyCost": 25,
        "description": "Loki instantaneously swaps positions with a target, confusing the enemy.",
        "range": 75,
        "duration": 5,
        "castTime": 0.3,
        "miscStats": {
          "speedBuff": 0.5
        }
      },
      {
        "name": "Radial Disarm",
        "energyCost": 100,
        "description": "Lets forth a wave of energy, disrupting the projectile weapons of enemies in range and forcing them to revert to melee combat.",
        "damage": 500,
        "range": 20,
        "castTime": 0.8,
        "damageType": "Impact"
      }
    ]
  },
  {
    "id": "mag",
    "name": "Mag",
    "health": 180,
    "shield": 455,
    "armor": 105,
    "energy": 140,
    "sprintSpeed": 1,
    "description": "Mag stuns enemies as she manifests a magnetic vortex. The vortex pulls in Polarize Shards and stunned enemies to place them directly in front of her.",
    "passive": "Nearby items gravitate toward Mag for easy collection.",
    "abilities": [
      {
        "name": "Pull",
        "energyCost": 25,
        "description": "Mag stuns enemies as she manifests a magnetic vortex. The vortex pulls in Polarize Shards and stunned enemies to place them directly in front of her.",
        "damage": 300,
        "range": 25,
        "castTime": 0.4,
        "damageType": "Magnetic",
        "miscStats": {
          "radialPull": 6,
          "pullAngle": 90
        }
      },
      {
        "name": "Magnetize",
        "energyCost": 50,
        "description": "(TAP) Enclose a target in a magnetic field that ensnares nearby enemies and deals damage over time. The field pulls Polarize Shards that orbited Mag and shrapnel into the deadly mix. (HOLD) Mag surrounds herself in a magnetic field that absorbs ranged attacks and reflects damage back in a destructive cone.",
        "damage": 300,
        "duration": 15,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "damageMultiplier": 2,
          "magneticPull": 4,
          "explosionRadius": 15,
          "damageAbsorption": 0.25
        }
      },
      {
        "name": "Polarize",
        "energyCost": 75,
        "description": "Emit an energy pulse that depletes enemy shields and armor as it restores ally shields. Debris left over from the pulse becomes Polarize Shards. Nearby Polarize Shards orbit Mag and cut enemies, inflicting Slash Status Effect.",
        "damage": 400,
        "range": 8,
        "duration": 5,
        "castTime": 0.6,
        "miscStats": {
          "explosionDamageMultiplier": 2.5,
          "shardDamage": 50,
          "shardPickupRadius": 3
        }
      },
      {
        "name": "Crush",
        "energyCost": 100,
        "description": "Magnetize the bones of nearby enemies, causing them to collapse upon themselves.",
        "damage": 1500,
        "range": 18,
        "castTime": 0.8,
        "damageType": "Magnetic",
        "miscStats": {
          "magnetizeExtraDamage": 1500,
          "shieldsPerHit": 25,
          "shieldsPerHitCap": 75
        }
      }
    ]
  },
  {
    "id": "mag_prime",
    "name": "Mag Prime",
    "health": 270,
    "shield": 455,
    "armor": 135,
    "energy": 215,
    "sprintSpeed": 1,
    "description": "Mag stuns enemies as she manifests a magnetic vortex. The vortex pulls in Polarize Shards and stunned enemies to place them directly in front of her.",
    "passive": "Nearby items gravitate toward Mag for easy collection.",
    "abilities": [
      {
        "name": "Pull",
        "energyCost": 25,
        "description": "Mag stuns enemies as she manifests a magnetic vortex. The vortex pulls in Polarize Shards and stunned enemies to place them directly in front of her.",
        "damage": 300,
        "range": 25,
        "castTime": 0.4,
        "damageType": "Magnetic",
        "miscStats": {
          "radialPull": 6,
          "pullAngle": 90
        }
      },
      {
        "name": "Magnetize",
        "energyCost": 50,
        "description": "(TAP) Enclose a target in a magnetic field that ensnares nearby enemies and deals damage over time. The field pulls Polarize Shards that orbited Mag and shrapnel into the deadly mix. (HOLD) Mag surrounds herself in a magnetic field that absorbs ranged attacks and reflects damage back in a destructive cone.",
        "damage": 300,
        "duration": 15,
        "radius": 4,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "damageMultiplier": 2,
          "magneticPull": 4,
          "explosionRadius": 15,
          "damageAbsorption": 0.25
        }
      },
      {
        "name": "Polarize",
        "energyCost": 75,
        "description": "Emit an energy pulse that depletes enemy shields and armor as it restores ally shields. Debris left over from the pulse becomes Polarize Shards. Nearby Polarize Shards orbit Mag and cut enemies, inflicting Slash Status Effect.",
        "damage": 400,
        "range": 8,
        "duration": 5,
        "castTime": 0.6,
        "miscStats": {
          "explosionDamageMultiplier": 2.5,
          "shardDamage": 50,
          "shardPickupRadius": 3
        }
      },
      {
        "name": "Crush",
        "energyCost": 100,
        "description": "Magnetize the bones of nearby enemies, causing them to collapse upon themselves.",
        "damage": 1500,
        "range": 18,
        "castTime": 0.8,
        "damageType": "Magnetic",
        "miscStats": {
          "magnetizeExtraDamage": 1500,
          "shieldsPerHit": 25,
          "shieldsPerHitCap": 75
        }
      }
    ]
  },
  {
    "id": "mesa",
    "name": "Mesa",
    "health": 365,
    "shield": 180,
    "armor": 105,
    "energy": 100,
    "sprintSpeed": 1.1,
    "description": "When activated, this power stores damage caused by guns. When triggered again, that damage is channelled through the next gunshot.",
    "passive": "Shoot dual-wielded sidearms 15% faster and reload single-handed sidearms 25% more rapidly. Gain 50 Bonus Health when not using Melee Weapons.",
    "abilities": [
      {
        "name": "Ballistic Battery",
        "energyCost": 25,
        "description": "When activated, this power stores damage caused by guns. When triggered again, that damage is channelled through the next gunshot.",
        "castTime": 0.4,
        "miscStats": {
          "damagePercentage": 0.7,
          "maxDamagePerInstance": 140,
          "maxStoredDamage": 5000
        }
      },
      {
        "name": "Shooting Gallery",
        "energyCost": 50,
        "description": "Gives an ally Extra Damage while jamming the guns of nearby enemies. This power shifts between team members.",
        "damageBuff": 0.25,
        "range": 16,
        "duration": 30,
        "castTime": 0.5,
        "miscStats": {
          "stunTargets": 3,
          "stunInterval": 1.5
        }
      },
      {
        "name": "Shatter Shield",
        "energyCost": 75,
        "description": "Envelops Mesa in a barrier of energy, reflecting back incoming bullet damage.",
        "damageReduction": 0.8,
        "range": 11,
        "duration": 25,
        "castTime": 0.6,
        "miscStats": {
          "drCap": 0.95
        }
      },
      {
        "name": "Peacemaker",
        "energyCost": 25,
        "description": "With intense focus, Mesa draws her Regulator pistols, shooting down her foes in rapid succession.",
        "damage": 50,
        "castTime": 0.5,
        "damageType": "Puncture",
        "miscStats": {
          "energyDrain": 15,
          "damageBonus": 1.5,
          "rampUpDamageBonus": 1.5,
          "maxShootingDistance": 50,
          "minFov": 15
        }
      }
    ]
  },
  {
    "id": "mesa_prime",
    "name": "Mesa Prime",
    "health": 400,
    "shield": 180,
    "armor": 135,
    "energy": 140,
    "sprintSpeed": 1.1,
    "description": "When activated, this power stores damage caused by guns. When triggered again, that damage is channelled through the next gunshot.",
    "passive": "Shoot dual-wielded sidearms 15% faster and reload single-handed sidearms 25% more rapidly. Gain 50 Bonus Health when not using Melee Weapons.",
    "abilities": [
      {
        "name": "Ballistic Battery",
        "energyCost": 25,
        "description": "When activated, this power stores damage caused by guns. When triggered again, that damage is channelled through the next gunshot.",
        "castTime": 0.4,
        "miscStats": {
          "damagePercentage": 0.7,
          "maxDamagePerInstance": 140,
          "maxStoredDamage": 5000
        }
      },
      {
        "name": "Shooting Gallery",
        "energyCost": 50,
        "description": "Gives an ally Extra Damage while jamming the guns of nearby enemies. This power shifts between team members.",
        "damageBuff": 0.25,
        "range": 16,
        "duration": 30,
        "castTime": 0.5,
        "miscStats": {
          "stunTargets": 3,
          "stunInterval": 1.5
        }
      },
      {
        "name": "Shatter Shield",
        "energyCost": 75,
        "description": "Envelops Mesa in a barrier of energy, reflecting back incoming bullet damage.",
        "damageReduction": 0.8,
        "range": 11,
        "duration": 25,
        "castTime": 0.6,
        "miscStats": {
          "drCap": 0.95
        }
      },
      {
        "name": "Peacemaker",
        "energyCost": 25,
        "description": "With intense focus, Mesa draws her Regulator pistols, shooting down her foes in rapid succession.",
        "damage": 50,
        "castTime": 0.5,
        "damageType": "Puncture",
        "miscStats": {
          "energyDrain": 15,
          "damageBonus": 1.5,
          "rampUpDamageBonus": 1.5,
          "maxShootingDistance": 50,
          "minFov": 15
        }
      }
    ]
  },
  {
    "id": "mirage",
    "name": "Mirage",
    "health": 200,
    "shield": 200,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1.2,
    "description": "Mirage creates an entourage of doppelgangers to confuse and distract the enemy.",
    "passive": "Sliding lasts 85% longer and acrobatic maneuvers are 50% faster.",
    "abilities": [
      {
        "name": "Hall Of Mirrors",
        "energyCost": 25,
        "description": "Mirage creates an entourage of doppelgangers to confuse and distract the enemy.",
        "duration": 25,
        "castTime": 0.6,
        "miscStats": {
          "hologramCount": 4,
          "cloneMeleeDamage": 0.2,
          "cloneRangedDamage": 0.4
        }
      },
      {
        "name": "Sleight Of Hand",
        "energyCost": 50,
        "description": "Booby trap nearby objects while conjuring an irresistible jewel that bursts with radial blind when touched in darkness, or a radial explosion in light. Conjure multiple smaller jewels with the help of Hall of Mirrors.",
        "damage": 200,
        "range": 40,
        "duration": 18,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "blindDuration": 5,
          "jewelCharmRadius": 12,
          "explosionRadius": 8,
          "blindRadius": 8,
          "jewelCastRange": 60,
          "jewelDuration": 20
        }
      },
      {
        "name": "Eclipse",
        "energyCost": 25,
        "description": "(TAP) Lunar Eclipse: Reduce incoming damage by 75% (cap 90%). (HOLD) Solar Eclipse: +200% weapon damage.",
        "damageBuff": 2.0,
        "damageReduction": 0.75,
        "duration": 25,
        "castTime": 0.4,
        "miscStats": {
          "drCap": 0.9
        }
      },
      {
        "name": "Prism",
        "energyCost": 50,
        "description": "Fires an energy prism that shoots lasers in all directions. Activating again detonates the prism, blinding nearby foes.",
        "damage": 250,
        "range": 30,
        "duration": 12,
        "radius": 25,
        "castTime": 0.8,
        "damageType": "Radiation",
        "miscStats": {
          "energyDrain": 10,
          "laserCount": 20,
          "prismSpeed": 5,
          "tickRate": 2,
          "damageBonusPerHit": 0.25,
          "blindDuration": 15
        }
      }
    ]
  },
  {
    "id": "mirage_prime",
    "name": "Mirage Prime",
    "health": 200,
    "shield": 310,
    "armor": 185,
    "energy": 175,
    "sprintSpeed": 1.2,
    "description": "Mirage creates an entourage of doppelgangers to confuse and distract the enemy.",
    "passive": "Sliding lasts 85% longer and acrobatic maneuvers are 50% faster.",
    "abilities": [
      {
        "name": "Hall Of Mirrors",
        "energyCost": 25,
        "description": "Mirage creates an entourage of doppelgangers to confuse and distract the enemy.",
        "duration": 25,
        "castTime": 0.6,
        "miscStats": {
          "hologramCount": 4,
          "cloneMeleeDamage": 0.2,
          "cloneRangedDamage": 0.4
        }
      },
      {
        "name": "Sleight Of Hand",
        "energyCost": 50,
        "description": "Booby trap nearby objects while conjuring an irresistible jewel that bursts with radial blind when touched in darkness, or a radial explosion in light. Conjure multiple smaller jewels with the help of Hall of Mirrors.",
        "damage": 200,
        "range": 40,
        "duration": 18,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "blindDuration": 5,
          "jewelCharmRadius": 12,
          "explosionRadius": 8,
          "blindRadius": 8,
          "jewelCastRange": 60,
          "jewelDuration": 20
        }
      },
      {
        "name": "Eclipse",
        "energyCost": 25,
        "description": "(TAP) Lunar Eclipse: Reduce incoming damage by 75% (cap 90%). (HOLD) Solar Eclipse: +200% weapon damage.",
        "damageBuff": 2.0,
        "damageReduction": 0.75,
        "duration": 25,
        "castTime": 0.4,
        "miscStats": {
          "drCap": 0.9
        }
      },
      {
        "name": "Prism",
        "energyCost": 50,
        "description": "Fires an energy prism that shoots lasers in all directions. Activating again detonates the prism, blinding nearby foes.",
        "damage": 250,
        "range": 30,
        "duration": 12,
        "radius": 25,
        "castTime": 0.8,
        "damageType": "Radiation",
        "miscStats": {
          "energyDrain": 10,
          "laserCount": 20,
          "prismSpeed": 5,
          "tickRate": 2,
          "damageBonusPerHit": 0.25,
          "blindDuration": 15
        }
      }
    ]
  },
  {
    "id": "nekros",
    "name": "Nekros",
    "health": 270,
    "shield": 235,
    "armor": 105,
    "energy": 100,
    "sprintSpeed": 1.1,
    "description": "A blow so powerful, it turns the enemy's very soul into a deadly projectile, damaging all in its path. Enemies that survive the blow are Marked for Harvest and become one of Nekros's shadows if killed.",
    "passive": "Restore 5 Health with every enemy death within 10m.",
    "abilities": [
      {
        "name": "Soul Punch",
        "energyCost": 25,
        "description": "A blow so powerful, it turns the enemy's very soul into a deadly projectile, damaging all in its path. Enemies that survive the blow are Marked for Harvest and become one of Nekros's Shadows of the Dead if killed while marked.",
        "damage": 500,
        "range": 50,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "instantKillThreshold": 0.25,
          "projectileDamage": 50,
          "explosionDamage": 100,
          "markDuration": 3
        }
      },
      {
        "name": "Terrify",
        "energyCost": 75,
        "description": "Cast fear into the hearts of nearby enemies, causing them to run away in terror and stripping their armor.",
        "range": 15,
        "duration": 25,
        "castTime": 0.6,
        "miscStats": { "armorStrip": 0.6, "affectedEnemies": 20 }
      },
      {
        "name": "Desecrate",
        "energyCost": 10,
        "description": "Forces fallen enemies around you to drop additional loot. Costs 10 energy per corpse.",
        "range": 25,
        "castTime": 0.4,
        "miscStats": {
          "energyPerCorpse": 10,
          "healthOrbChance": 0.6,
          "dropTableChance": 0.54
        }
      },
      {
        "name": "Shadows Of The Dead",
        "energyCost": 100,
        "description": "Summon shadow versions of vanquished enemies to fight alongside you for a short period.",
        "castTime": 1,
        "miscStats": {
          "damageBonus": 1.5,
          "shieldBonus": 1,
          "healthBonus": 1,
          "healthDecayPerSecond": 0.03,
          "shadowCopies": 7,
          "spawnRadius": 10
        }
      }
    ]
  },
  {
    "id": "nekros_prime",
    "name": "Nekros Prime",
    "health": 270,
    "shield": 455,
    "armor": 135,
    "energy": 140,
    "sprintSpeed": 1.1,
    "description": "A blow so powerful, it turns the enemy's very soul into a deadly projectile, damaging all in its path. Enemies that survive the blow are Marked for Harvest and become one of Nekros's shadows if killed.",
    "passive": "Restore 5 Health with every enemy death within 10m.",
    "abilities": [
      {
        "name": "Soul Punch",
        "energyCost": 25,
        "description": "A blow so powerful, it turns the enemy's very soul into a deadly projectile, damaging all in its path. Enemies that survive the blow are Marked for Harvest and become one of Nekros's Shadows of the Dead if killed while marked.",
        "damage": 500,
        "range": 50,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "instantKillThreshold": 0.25,
          "projectileDamage": 50,
          "explosionDamage": 100,
          "markDuration": 3
        }
      },
      {
        "name": "Terrify",
        "energyCost": 75,
        "description": "Cast fear into the hearts of nearby enemies, causing them to run away in terror and stripping their armor.",
        "range": 15,
        "duration": 25,
        "castTime": 0.6,
        "miscStats": { "armorStrip": 0.6, "affectedEnemies": 20 }
      },
      {
        "name": "Desecrate",
        "energyCost": 10,
        "description": "Forces fallen enemies around you to drop additional loot. Costs 10 energy per corpse.",
        "range": 25,
        "castTime": 0.4,
        "miscStats": {
          "energyPerCorpse": 10,
          "healthOrbChance": 0.6,
          "dropTableChance": 0.54
        }
      },
      {
        "name": "Shadows Of The Dead",
        "energyCost": 100,
        "description": "Summon shadow versions of vanquished enemies to fight alongside you for a short period.",
        "castTime": 1,
        "miscStats": {
          "damageBonus": 1.5,
          "shieldBonus": 1,
          "healthBonus": 1,
          "healthDecayPerSecond": 0.03,
          "shadowCopies": 7,
          "spawnRadius": 10
        }
      }
    ]
  },
  {
    "id": "nezha",
    "name": "Nezha",
    "health": 365,
    "shield": 135,
    "armor": 200,
    "energy": 175,
    "sprintSpeed": 1.15,
    "description": "Blaze a trail of flames, scorching enemies and cleansing allies. Teleporting blasts the landing area with a ring of fire.",
    "passive": "Slide 60% faster and go 35% farther.",
    "abilities": [
      {
        "name": "Fire Walker",
        "energyCost": 25,
        "description": "Blaze a trail of flames, scorching enemies and cleansing allies. Teleporting blasts the landing area with a ring of fire.",
        "damage": 200,
        "duration": 30,
        "radius": 6,
        "castTime": 0.4,
        "damageType": "Heat",
        "miscStats": {
          "explosionDamage": 1250,
          "flameDuration": 10,
          "speedBuff": 0.25,
          "statusChance": 0.75,
          "damageInterval": 0.5
        }
      },
      {
        "name": "Blazing Chakram",
        "energyCost": 25,
        "description": "Hurl a flaming ring that sets enemies ablaze making them vulnerable to any damage. Flaming enemies drop Restorative Orbs on death. Charge to amplify the power of the ring, and reactivate to teleport to the ring.",
        "damage": 250,
        "duration": 15,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "boostedDamage": 1000,
          "damageVulnerability": 1,
          "healthOrbChance": 1,
          "energyOrbChance": 0.35,
          "unchargedThrowDistance": 30,
          "chargedThrowDistance": 70
        }
      },
      {
        "name": "Warding Halo",
        "energyCost": 75,
        "description": "Create a protective ring of fire, that also stuns and damages enemies who get too close.",
        "damage": 125,
        "range": 2,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "haloHealth": 1000,
          "armorMultiplier": 2.5,
          "absorptionMultiplier": 2.5,
          "invulnerabilityDuration": 3,
          "damageRedirection": 0.9,
          "breakInvulnerabilityDuration": 2
        }
      },
      {
        "name": "Divine Spears",
        "energyCost": 100,
        "description": "Impale nearby enemies on spears that erupt from the below. Activate again to slam surviving enemies back into the ground.",
        "damage": 600,
        "range": 19,
        "duration": 12,
        "castTime": 0.8,
        "damageType": "Puncture",
        "miscStats": {
          "slamDamage": 600
        }
      }
    ]
  },
  {
    "id": "nezha_prime",
    "name": "Nezha Prime",
    "health": 365,
    "shield": 135,
    "armor": 265,
    "energy": 175,
    "sprintSpeed": 1.2,
    "description": "Blaze a trail of flames, scorching enemies and cleansing allies. Teleporting blasts the landing area with a ring of fire.",
    "passive": "Slide 60% faster and go 35% farther.",
    "abilities": [
      {
        "name": "Fire Walker",
        "energyCost": 25,
        "description": "Blaze a trail of flames, scorching enemies and cleansing allies. Teleporting blasts the landing area with a ring of fire.",
        "damage": 200,
        "duration": 30,
        "radius": 6,
        "castTime": 0.4,
        "damageType": "Heat",
        "miscStats": {
          "explosionDamage": 1250,
          "flameDuration": 10,
          "speedBuff": 0.25,
          "statusChance": 0.75,
          "damageInterval": 0.5
        }
      },
      {
        "name": "Blazing Chakram",
        "energyCost": 25,
        "description": "Hurl a flaming ring that sets enemies ablaze making them vulnerable to any damage. Flaming enemies drop Restorative Orbs on death. Charge to amplify the power of the ring, and reactivate to teleport to the ring.",
        "damage": 250,
        "duration": 15,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "boostedDamage": 1000,
          "damageVulnerability": 1,
          "healthOrbChance": 1,
          "energyOrbChance": 0.35,
          "unchargedThrowDistance": 30,
          "chargedThrowDistance": 70
        }
      },
      {
        "name": "Warding Halo",
        "energyCost": 75,
        "description": "Create a protective ring of fire, that also stuns and damages enemies who get too close.",
        "damage": 125,
        "range": 2,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "haloHealth": 1000,
          "armorMultiplier": 2.5,
          "absorptionMultiplier": 2.5,
          "invulnerabilityDuration": 3,
          "damageRedirection": 0.9,
          "breakInvulnerabilityDuration": 2
        }
      },
      {
        "name": "Divine Spears",
        "energyCost": 100,
        "description": "Impale nearby enemies on spears that erupt from the below. Activate again to slam surviving enemies back into the ground.",
        "damage": 600,
        "range": 19,
        "duration": 12,
        "castTime": 0.8,
        "damageType": "Puncture",
        "miscStats": {
          "slamDamage": 600
        }
      }
    ]
  },
  {
    "id": "nidus",
    "name": "Nidus",
    "health": 675,
    "shield": 0,
    "armor": 350,
    "energy": 100,
    "sprintSpeed": 1,
    "description": "Command the Infestation with Mutation Stacks that fuel his abilities. Virulence ruptures the ground with fungal growth; Larva, Parasitic Link, and Ravenous build and spend stacks for crowd control and healing.",
    "passive": "If Nidus is killed with at least 15 stacks of Mutation, those stacks are consumed; this grants 5s of invulnerability and restores Health to 50%. Mutation stacks cap at 200.",
    "abilities": [
      {
        "name": "Virulence",
        "energyCost": 40,
        "description": "Rupture the ground with a damaging fungal growth that steals energy from each enemy it strikes. For every five enemies hit, the Infestation mutates, multiplying its destructive force.",
        "damage": 200,
        "range": 16,
        "castTime": 0.4,
        "damageType": "Puncture",
        "miscStats": {
          "energyRefundPerHit": 10,
          "width": 4
        }
      },
      {
        "name": "Larva",
        "energyCost": 25,
        "description": "Spawn an Infested pod that erupts with tendrils, latches onto nearby enemies and pulls them in. Recasting removes the previous Larva. Enemies killed while held can generate Mutation stacks; chance scales with Ability Strength up to 100%.",
        "range": 12,
        "duration": 7,
        "castTime": 0.6,
        "miscStats": {
          "mutationStackChance": 0.5,
          "releaseDelay": 3
        }
      },
      {
        "name": "Parasitic Link",
        "energyCost": 0,
        "description": "Bind to a target with parasitic link. When cast on an ally or Companion, both receive Ability Strength and weapon damage bonuses. Linked enemies redirect damage to themselves. Recast to retarget or refresh duration.",
        "range": 40,
        "duration": 60,
        "castTime": 0.4,
        "damageBuff": 0.25,
        "damageReduction": 0.5,
        "miscStats": {
          "mutationStackCost": 1,
          "strengthBonus": 0.25,
          "enemyLinkRange": 20
        }
      },
      {
        "name": "Ravenous",
        "energyCost": 0,
        "description": "Expend 3 Mutation stacks to spawn gluttonous maggots and an infestation zone. Allies inside regenerate health and are cleansed of status effects. Recasting on the zone refreshes duration and detonates maggots.",
        "damage": 150,
        "range": 8,
        "duration": 40,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "mutationStackCost": 3,
          "healthRegen": 20,
          "explosionRadius": 4,
          "maggots": 9,
          "maggotHealth": 1000,
          "maggotDamage": 10,
          "statusCleanse": true
        }
      }
    ]
  },
  {
    "id": "nidus_prime",
    "name": "Nidus Prime",
    "health": 825,
    "shield": 0,
    "armor": 425,
    "energy": 140,
    "sprintSpeed": 1,
    "description": "Command the Infestation with Mutation Stacks that fuel his abilities. Virulence ruptures the ground with fungal growth; Larva, Parasitic Link, and Ravenous build and spend stacks for crowd control and healing.",
    "passive": "If Nidus is killed with at least 15 stacks of Mutation, those stacks are consumed; this grants 5s of invulnerability and restores Health to 50%. Mutation stacks cap at 200.",
    "abilities": [
      {
        "name": "Virulence",
        "energyCost": 40,
        "description": "Rupture the ground with a damaging fungal growth that steals energy from each enemy it strikes. For every five enemies hit, the Infestation mutates, multiplying its destructive force.",
        "damage": 200,
        "range": 16,
        "castTime": 0.4,
        "damageType": "Puncture",
        "miscStats": {
          "energyRefundPerHit": 10,
          "width": 4
        }
      },
      {
        "name": "Larva",
        "energyCost": 25,
        "description": "Spawn an Infested pod that erupts with tendrils, latches onto nearby enemies and pulls them in. Recasting removes the previous Larva. Enemies killed while held can generate Mutation stacks; chance scales with Ability Strength up to 100%.",
        "range": 12,
        "duration": 7,
        "castTime": 0.6,
        "miscStats": {
          "mutationStackChance": 0.5,
          "releaseDelay": 3
        }
      },
      {
        "name": "Parasitic Link",
        "energyCost": 0,
        "description": "Bind to a target with parasitic link. When cast on an ally or Companion, both receive Ability Strength and weapon damage bonuses. Linked enemies redirect damage to themselves. Recast to retarget or refresh duration.",
        "range": 40,
        "duration": 60,
        "castTime": 0.4,
        "damageBuff": 0.25,
        "damageReduction": 0.5,
        "miscStats": {
          "mutationStackCost": 1,
          "strengthBonus": 0.25,
          "enemyLinkRange": 20
        }
      },
      {
        "name": "Ravenous",
        "energyCost": 0,
        "description": "Expend 3 Mutation stacks to spawn gluttonous maggots and an infestation zone. Allies inside regenerate health and are cleansed of status effects. Recasting on the zone refreshes duration and detonates maggots.",
        "damage": 150,
        "range": 8,
        "duration": 40,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "mutationStackCost": 3,
          "healthRegen": 20,
          "explosionRadius": 4,
          "maggots": 9,
          "maggotHealth": 1000,
          "maggotDamage": 10,
          "statusCleanse": true
        }
      }
    ]
  },
  {
    "id": "nokko",
    "name": "Nokko",
    "health": 150,
    "shield": 300,
    "armor": 135,
    "energy": 130,
    "sprintSpeed": 1.25,
    "description": "Throw a mushroom that periodically sheds poisonous spores, inflicting Viral Damage and Status Effect upon nearby enemies while also lulling them to sleep.",
    "passive": "Upon receiving fatal damage, Nokko reverts to his Sprodling form and his active mushrooms will glow, reviving Nokko when touched. Orbs spawned will grant a speed boost but not healing. If a glowing mushroom is not reached in time, Nokko will automatically use a self-revive.",
        "abilities": [
      {
        "name": "Stinkbrain",
        "energyCost": 25,
        "description": "Throw a mushroom that periodically sheds poisonous spores, inflicting Viral Damage and Status Effect upon nearby enemies while also lulling them to sleep.",
        "damage": 250,
        "duration": 25,
        "radius": 5,
        "castTime": 0.4,
        "damageType": "Viral",
        "miscStats": {
          "pulseInterval": 3,
          "sleepDuration": 3,
          "finisherVulnerability": 1,
          "maxMushrooms": 4,
          "invigoratedPulseInterval": 1.5,
          "viralStatusChance": 1
        }
      },
      {
        "name": "Brightbonnet",
        "energyCost": 50,
        "description": "Release a rejuvenating mushroom that emits a radial pulse, giving Nokko and his allies Energy and applying a buff to Ability Strength that lasts for a short time.",
        "duration": 25,
        "radius": 15,
        "castTime": 0.5,
        "miscStats": {
          "energyRestore": 15,
          "strengthBonus": 0.3,
          "strengthBonusDuration": 5,
          "strengthBonusCap": 1.5,
          "invigoratedStrengthBonusCap": 3,
          "pulseInterval": 3,
          "invigoratedPulseInterval": 1.5,
          "maxMushrooms": 2,
          "sproutDamage": 200,
          "sproutRadius": 6
        }
      },
      {
        "name": "Reroot",
        "energyCost": 50,
        "description": "Revert to Sprodling form, spawning orbs that heal Nokko and grant a speed boost. While in this state, Nokko is untargetable and heals gradually.",
        "duration": 10,
        "castTime": 0.3,
        "miscStats": {
          "healthShieldPerSecond": 10,
          "pickupHeal": 80,
          "fungalSpores": 3,
          "sporeSpawnRadius": 10,
          "moveSpeedBonus": 1,
          "moveSpeedBonusDuration": 3,
          "baseMoveSpeed": 4.8
        }
      },
      {
        "name": "Sporespring",
        "energyCost": 75,
        "description": "Unleash a chaotic ballistic mushroom that seeks enemies and bounces explosively off whatever it touches. Contact with any of Nokko's mushrooms invigorates them, doubling their pulse rate.",
        "damage": 2500,
        "radius": 3,
        "castTime": 0.8,
        "damageType": "Toxin",
        "miscStats": {
          "bounces": 10,
          "bounceDistance": 8,
          "bounceDamageMultiplier": 1.5,
          "initialCriticalChance": 0.75,
          "criticalMultiplier": 2,
          "criticalChancePerBounce": 0.25,
          "maxSporesprings": 3
        }
      }
    ]
  },
  {
    "id": "nova",
    "name": "Nova",
    "health": 270,
    "shield": 180,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1.2,
    "description": "Creates antimatter particles that orbit Nova and attack nearby targets. Each active particle reduces damage to Nova's Health and Shields.",
    "passive": "Enemies killed while slowed down have 15% to drop health orbs. Enemies killed while sped up have 15% to drop energy orbs.",
    "abilities": [
      {
        "name": "Null Star",
        "energyCost": 25,
        "description": "Creates antimatter particles that orbit Nova and attack nearby targets. Each active particle reduces damage to Nova's Health and Shields.",
        "damage": 200,
        "range": 10,
        "castTime": 0.4,
        "damageType": "Blast",
        "miscStats": {
          "particles": 12,
          "damageReductionPerParticle": 0.05,
          "drCap": 0.9,
          "attackInterval": 1
        }
      },
      {
        "name": "Antimatter Drop",
        "energyCost": 50,
        "description": "Launch a large particle of charged antimatter that will detonate on contact. Direct the particle by aiming, shoot it to charge it further. Deals Blast Damage with a guaranteed Status Effect.",
        "damage": 200,
        "range": 15,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "absorbMultiplier": 8,
          "contactDamage": 10,
          "maxHitsAbsorbed": 5,
          "absorbedDamageCap": 25000
        }
      },
      {
        "name": "Wormhole",
        "energyCost": 75,
        "description": "Creates a wormhole allowing instantaneous travel. Hold the ability to visualize placement.",
        "range": 50,
        "castTime": 0.3,
        "miscStats": {
          "maxPortals": 4,
          "portalUses": 4
        }
      },
      {
        "name": "Molecular Prime",
        "energyCost": 100,
        "description": "Primes all enemies in an expanding radius with volatile antimatter. Press the ability to slow down enemy movement, hold the ability to speed them up.",
        "damage": 800,
        "range": 10,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "slow": 0.5,
          "slowCap": 0.75,
          "waveDuration": 6,
          "startingWaveRadius": 5,
          "waveSpeed": 5,
          "damageVulnerability": 1
        }
      }
    ]
  },
  {
    "id": "nova_prime",
    "name": "Nova Prime",
    "health": 270,
    "shield": 270,
    "armor": 135,
    "energy": 215,
    "sprintSpeed": 1.2,
    "description": "Creates antimatter particles that orbit Nova and attack nearby targets. Each active particle reduces damage to Nova's Health and Shields.",
    "passive": "Enemies killed while slowed down have 15% to drop health orbs. Enemies killed while sped up have 15% to drop energy orbs.",
    "abilities": [
      {
        "name": "Null Star",
        "energyCost": 25,
        "description": "Creates antimatter particles that orbit Nova and attack nearby targets. Each active particle reduces damage to Nova's Health and Shields.",
        "damage": 200,
        "range": 10,
        "castTime": 0.4,
        "damageType": "Blast",
        "miscStats": {
          "particles": 12,
          "damageReductionPerParticle": 0.05,
          "drCap": 0.9,
          "attackInterval": 1
        }
      },
      {
        "name": "Antimatter Drop",
        "energyCost": 50,
        "description": "Launch a large particle of charged antimatter that will detonate on contact. Direct the particle by aiming, shoot it to charge it further. Deals Blast Damage with a guaranteed Status Effect.",
        "damage": 200,
        "range": 15,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "absorbMultiplier": 8,
          "contactDamage": 10,
          "maxHitsAbsorbed": 5,
          "absorbedDamageCap": 25000
        }
      },
      {
        "name": "Wormhole",
        "energyCost": 75,
        "description": "Creates a wormhole allowing instantaneous travel. Hold the ability to visualize placement.",
        "range": 50,
        "castTime": 0.3,
        "miscStats": {
          "maxPortals": 4,
          "portalUses": 4
        }
      },
      {
        "name": "Molecular Prime",
        "energyCost": 100,
        "description": "Primes all enemies in an expanding radius with volatile antimatter. Press the ability to slow down enemy movement, hold the ability to speed them up.",
        "damage": 800,
        "range": 10,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "slow": 0.5,
          "slowCap": 0.75,
          "waveDuration": 6,
          "startingWaveRadius": 5,
          "waveSpeed": 5,
          "damageVulnerability": 1
        }
      }
    ]
  },
  {
    "id": "nyx",
    "name": "Nyx",
    "health": 270,
    "shield": 270,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Psychic attacks make Nyx a dangerous foe. She reaches into enemy consciousness to provide crowd control and turn their attacks back on them.",
    "passive": "Nyx gains +40% Critical Chance on Primary and Secondary weapons per Confused enemy within Affinity Range, up to +200%.",
    "abilities": [
      {
        "name": "Mind Control",
        "energyCost": 25,
        "description": "Nyx seizes control of a target's mind, compelling them to fight for the Tenno cause. Controlled enemies have increased Radiation Status Chance. When Nyx shoots the controlled enemy, a percentage of that damage is transferred to the target.",
        "range": 60,
        "duration": 60,
        "castTime": 0.5,
        "miscStats": {
          "stunDuration": 3,
          "radiationStatusChance": 1,
          "initialDamageBonus": 7.5,
          "damageConversionRate": 0.06,
          "damageConversionDuration": 4,
          "maxTargets": 1
        }
      },
      {
        "name": "Psychic Bolts",
        "energyCost": 50,
        "description": "Nyx unleashes a volley of psychic bolts that track and strike nearby enemies with telekinetic precision. When enemies are slain, additional bolts scatter to new targets. Striking foes weakens their defenses and transfers a portion to Nyx.",
        "duration": 11,
        "castTime": 0.4,
        "miscStats": {
          "boltCount": 6,
          "boltsOnKill": 2,
          "targetingRange": 60,
          "defenseStrip": 0.8,
          "infestedSlow": 0.2,
          "armorSteal": 25,
          "shieldSteal": 75,
          "overguardSteal": 500,
          "armorStealCap": 1000,
          "overguardStealCap": 7500,
          "armorStealDuration": 20
        }
      },
      {
        "name": "Chaos",
        "energyCost": 75,
        "description": "Nyx releases a devastating psychic pulse, disorienting enemies in a wide radius and forcing them to turn on each other. Confused foes lash out at random factions.",
        "range": 25,
        "duration": 25,
        "castTime": 0.6,
        "miscStats": {
          "radiationStacks": 10
        }
      },
      {
        "name": "Absorb",
        "energyCost": 75,
        "description": "Nyx draws in and contains damage dealt to her and damage confused enemies deal to each other, then converts it into a devastating radial blast. Following the blast, she gains brief invulnerability and a Weapon Damage bonus proportional to absorbed damage.",
        "damage": 1500,
        "range": 15,
        "duration": 8,
        "castTime": 0.8,
        "damageType": "Magnetic",
        "miscStats": {
          "absorbDuration": 5,
          "maxRadius": 50,
          "weaponDamageConvert": 0.025,
          "weaponDamageCap": 4,
          "speedMultiplier": 0.7,
          "invulnAbsorbThreshold": 5000,
          "invulnDurationBoost": 1,
          "invulnDurationCap": 6
        }
      }
    ]
  },
  {
    "id": "nyx_prime",
    "name": "Nyx Prime",
    "health": 270,
    "shield": 365,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.125,
    "description": "Infiltrate the minds of your enemies with Nyx Prime. Featuring altered mod polarities for greater customization.",
    "passive": "Nyx gains +40% Critical Chance on Primary and Secondary weapons per Confused enemy within Affinity Range, up to +200%.",
    "abilities": [
      {
        "name": "Mind Control",
        "energyCost": 25,
        "description": "Nyx seizes control of a target's mind, compelling them to fight for the Tenno cause. Controlled enemies have increased Radiation Status Chance. When Nyx shoots the controlled enemy, a percentage of that damage is transferred to the target.",
        "range": 60,
        "duration": 60,
        "castTime": 0.5,
        "miscStats": {
          "stunDuration": 3,
          "radiationStatusChance": 1,
          "initialDamageBonus": 7.5,
          "damageConversionRate": 0.06,
          "damageConversionDuration": 4,
          "maxTargets": 1
        }
      },
      {
        "name": "Psychic Bolts",
        "energyCost": 50,
        "description": "Nyx unleashes a volley of psychic bolts that track and strike nearby enemies with telekinetic precision. When enemies are slain, additional bolts scatter to new targets. Striking foes weakens their defenses and transfers a portion to Nyx.",
        "duration": 11,
        "castTime": 0.4,
        "miscStats": {
          "boltCount": 6,
          "boltsOnKill": 2,
          "targetingRange": 60,
          "defenseStrip": 0.8,
          "infestedSlow": 0.2,
          "armorSteal": 25,
          "shieldSteal": 75,
          "overguardSteal": 500,
          "armorStealCap": 1000,
          "overguardStealCap": 7500,
          "armorStealDuration": 20
        }
      },
      {
        "name": "Chaos",
        "energyCost": 75,
        "description": "Nyx releases a devastating psychic pulse, disorienting enemies in a wide radius and forcing them to turn on each other. Confused foes lash out at random factions.",
        "range": 25,
        "duration": 25,
        "castTime": 0.6,
        "miscStats": {
          "radiationStacks": 10
        }
      },
      {
        "name": "Absorb",
        "energyCost": 75,
        "description": "Nyx draws in and contains damage dealt to her and damage confused enemies deal to each other, then converts it into a devastating radial blast. Following the blast, she gains brief invulnerability and a Weapon Damage bonus proportional to absorbed damage.",
        "damage": 1500,
        "range": 15,
        "duration": 8,
        "castTime": 0.8,
        "damageType": "Magnetic",
        "miscStats": {
          "absorbDuration": 5,
          "maxRadius": 50,
          "weaponDamageConvert": 0.025,
          "weaponDamageCap": 4,
          "speedMultiplier": 0.7,
          "invulnAbsorbThreshold": 5000,
          "invulnDurationBoost": 1,
          "invulnDurationCap": 6
        }
      }
    ]
  },
  {
    "id": "oberon",
    "name": "Oberon",
    "health": 365,
    "shield": 270,
    "armor": 385,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Focuses deadly energy within a target, dealing massive damage and removing all of its defenses, including Overguard. Enemies near the target also take a portion of the damage.",
    "passive": "Oberon grants Righteous Negation to himself and his allies in Affinity Range when he collects Health Orbs, protecting players against the next instance of damage. Stacks up to 3 times.",
    "abilities": [
      {
        "name": "Smite",
        "energyCost": 25,
        "description": "Focuses deadly energy within a target, dealing massive damage and removing all of its defenses, including Overguard. Enemies near the target also take a portion of the damage.",
        "damage": 500,
        "range": 50,
        "radius": 6,
        "castTime": 0.4,
        "damageType": "Radiation",
        "miscStats": {
          "percentageDamage": 0.35,
          "aoePercentageDamage": 0.1,
          "percentageDamageCap": 0.75,
          "aoePercentageDamageCap": 0.3,
          "armorStrip": 1
        }
      },
      {
        "name": "Hallowed Ground",
        "energyCost": 50,
        "description": "Sanctifies the ground around Oberon, inflicting Radiation Damage to all enemies within the radius. Also grants protection against Status Effects for Oberon and his allies.",
        "damage": 100,
        "range": 15,
        "duration": 20,
        "castTime": 0.6,
        "damageType": "Radiation",
        "miscStats": {
          "tickInterval": 0.5,
          "groundCap": 3
        }
      },
      {
        "name": "Renewal",
        "energyCost": 25,
        "description": "Generates a protective aura that grants bonus Armor to Oberon and his allies and restores allies' Health over time. Healing is doubled while within the radius of Hallowed Ground.",
        "castTime": 0.5,
        "miscStats": {
          "armorBuff": 0.5,
          "armorBuffCap": 1,
          "initialHeal": 125,
          "healthPerSecond": 40,
          "bleedoutSlow": 0.45,
          "bleedoutSlowCap": 0.9,
          "allyArmorMultiplier": 2,
          "energyDrain": 3.5,
          "channeled": true
        }
      },
      {
        "name": "Reckoning",
        "energyCost": 100,
        "description": "Lifts enemies into the air and then hurls them down with conviction, removing their Armor. Enemies hit by this ability will grant Oberon additional Armor and have a chance to spawn Health Orbs.",
        "damage": 7500,
        "range": 15,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Radiation",
        "miscStats": {
          "armorStrip": 0.6,
          "radiationBonusDamage": 750,
          "bonusArmorPerEnemy": 10,
          "bonusArmorPerRadiation": 5,
          "healthOrbChance": 0.5,
          "armorCap": 1000
        }
      }
    ]
  },
  {
    "id": "oberon_prime",
    "name": "Oberon Prime",
    "health": 365,
    "shield": 270,
    "armor": 450,
    "energy": 215,
    "sprintSpeed": 1,
    "description": "Focuses deadly energy within a target, dealing massive damage and removing all of its defenses, including Overguard. Enemies near the target also take a portion of the damage.",
    "passive": "Oberon grants Righteous Negation to himself and his allies in Affinity Range when he collects Health Orbs, protecting players against the next instance of damage. Stacks up to 3 times.",
    "abilities": [
      {
        "name": "Smite",
        "energyCost": 25,
        "description": "Focuses deadly energy within a target, dealing massive damage and removing all of its defenses, including Overguard. Enemies near the target also take a portion of the damage.",
        "damage": 500,
        "range": 50,
        "radius": 6,
        "castTime": 0.4,
        "damageType": "Radiation",
        "miscStats": {
          "percentageDamage": 0.35,
          "aoePercentageDamage": 0.1,
          "percentageDamageCap": 0.75,
          "aoePercentageDamageCap": 0.3,
          "armorStrip": 1
        }
      },
      {
        "name": "Hallowed Ground",
        "energyCost": 50,
        "description": "Sanctifies the ground around Oberon, inflicting Radiation Damage to all enemies within the radius. Also grants protection against Status Effects for Oberon and his allies.",
        "damage": 100,
        "range": 15,
        "duration": 20,
        "castTime": 0.6,
        "damageType": "Radiation",
        "miscStats": {
          "tickInterval": 0.5,
          "groundCap": 3
        }
      },
      {
        "name": "Renewal",
        "energyCost": 25,
        "description": "Generates a protective aura that grants bonus Armor to Oberon and his allies and restores allies' Health over time. Healing is doubled while within the radius of Hallowed Ground.",
        "castTime": 0.5,
        "miscStats": {
          "armorBuff": 0.5,
          "armorBuffCap": 1,
          "initialHeal": 125,
          "healthPerSecond": 40,
          "bleedoutSlow": 0.45,
          "bleedoutSlowCap": 0.9,
          "allyArmorMultiplier": 2,
          "energyDrain": 3.5,
          "channeled": true
        }
      },
      {
        "name": "Reckoning",
        "energyCost": 100,
        "description": "Lifts enemies into the air and then hurls them down with conviction, removing their Armor. Enemies hit by this ability will grant Oberon additional Armor and have a chance to spawn Health Orbs.",
        "damage": 7500,
        "range": 15,
        "duration": 30,
        "castTime": 0.8,
        "damageType": "Radiation",
        "miscStats": {
          "armorStrip": 0.6,
          "radiationBonusDamage": 750,
          "bonusArmorPerEnemy": 10,
          "bonusArmorPerRadiation": 5,
          "healthOrbChance": 0.5,
          "armorCap": 1000
        }
      }
    ]
  },
  {
    "id": "octavia",
    "name": "Octavia",
    "health": 270,
    "shield": 180,
    "armor": 160,
    "energy": 175,
    "sprintSpeed": 1.05,
    "description": "Rhythmically beats damage into nearby enemies and draws their fire. Damage inflicted on the Mallet increases its lethality.",
    "passive": "Replenish 1 energy per second over 30s for Octavia and allies within 15m when abilities are activated.",
    "abilities": [
      {
        "name": "Mallet",
        "energyCost": 25,
        "description": "Rhythmically beats damage into nearby enemies and draws their fire. Damage inflicted on the Mallet increases its lethality.",
        "range": 10,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "damageMultiplier": 2.5
        }
      },
      {
        "name": "Resonator",
        "energyCost": 50,
        "description": "Launches a rollerball that charms foes to follow it. Combines with the Mallet to create a roving ball of sonic destruction.",
        "damage": 125,
        "range": 6,
        "duration": 20,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "maxCharmRadius": 15,
          "enemiesToMaxRadius": 10
        }
      },
      {
        "name": "Metronome",
        "energyCost": 75,
        "description": "Grants buffs to those who consistently perform actions in time to Octavia's music. Timed jumps offer the Vivace speed buff. Crouching on the beat grants cloaking with the Nocturne buff. Firing on beat grants the Opera buff for multishot. Melee on beat grants the Forte buff for melee damage.",
        "range": 12,
        "duration": 20,
        "castTime": 0.6,
        "miscStats": {
          "armorBonus": 0.35,
          "speedBonus": 0.3,
          "multishotBonus": 0.3,
          "meleeDamageBonus": 0.3,
          "buffDuration": 15
        }
      },
      {
        "name": "Amp",
        "energyCost": 100,
        "description": "Draws power from the decibel level of sound in the area and uses it to amplify a damage buff for Octavia and her allies. It also doubles the range of nearby Mallets.",
        "range": 14,
        "duration": 30,
        "castTime": 0.8,
        "damageBuff": 0.25,
        "miscStats": {
          "maxDamageBuff": 2,
          "malletRangeBonus": 2
        }
      }
    ]
  },
  {
    "id": "octavia_prime",
    "name": "Octavia Prime",
    "health": 270,
    "shield": 270,
    "armor": 160,
    "energy": 215,
    "sprintSpeed": 1.05,
    "description": "Rhythmically beats damage into nearby enemies and draws their fire. Damage inflicted on the Mallet increases its lethality.",
    "passive": "Replenish 1 energy per second over 30s for Octavia and allies within 15m when abilities are activated.",
    "abilities": [
      {
        "name": "Mallet",
        "energyCost": 25,
        "description": "Rhythmically beats damage into nearby enemies and draws their fire. Damage inflicted on the Mallet increases its lethality.",
        "range": 10,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "damageMultiplier": 2.5
        }
      },
      {
        "name": "Resonator",
        "energyCost": 50,
        "description": "Launches a rollerball that charms foes to follow it. Combines with the Mallet to create a roving ball of sonic destruction.",
        "damage": 125,
        "range": 6,
        "duration": 20,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "maxCharmRadius": 15,
          "enemiesToMaxRadius": 10
        }
      },
      {
        "name": "Metronome",
        "energyCost": 75,
        "description": "Grants buffs to those who consistently perform actions in time to Octavia's music. Timed jumps offer the Vivace speed buff. Crouching on the beat grants cloaking with the Nocturne buff. Firing on beat grants the Opera buff for multishot. Melee on beat grants the Forte buff for melee damage.",
        "range": 12,
        "duration": 20,
        "castTime": 0.6,
        "miscStats": {
          "armorBonus": 0.35,
          "speedBonus": 0.3,
          "multishotBonus": 0.3,
          "meleeDamageBonus": 0.3,
          "buffDuration": 15
        }
      },
      {
        "name": "Amp",
        "energyCost": 100,
        "description": "Draws power from the decibel level of sound in the area and uses it to amplify a damage buff for Octavia and her allies. It also doubles the range of nearby Mallets.",
        "range": 14,
        "duration": 30,
        "castTime": 0.8,
        "damageBuff": 0.25,
        "miscStats": {
          "maxDamageBuff": 2,
          "malletRangeBonus": 2
        }
      }
    ]
  },
  {
    "id": "oraxia",
    "name": "Oraxia",
    "health": 575,
    "shield": 125,
    "armor": 125,
    "energy": 150,
    "sprintSpeed": 1,
    "description": "Leap onto an enemy and pierce them with Oraxia\u2019s spider legs, dealing <DT_POISON_COLOR>Toxin Damage. Enemies defeated by this attack have a chance to drop Health or Energy Orbs.",
    "passive": "Wall Latching grants Predator's Lurk, rendering Oraxia invisible for 8s.",
        "abilities": [
      {
        "name": "Mercy's Kiss",
        "energyCost": 25,
        "description": "Leap onto an enemy and pierce them with Oraxia's spider legs, dealing Toxin Damage. Enemies defeated by this attack have a chance to drop Health or Energy Orbs.",
        "damage": 4000,
        "range": 40,
        "castTime": 0.5,
        "damageType": "Toxin",
        "miscStats": {
          "healthOrbChance": 2,
          "energyOrbChance": 0.5,
          "instantKillThreshold": 0.5,
          "finisherPromptDuration": 3
        }
      },
      {
        "name": "Webbed Embrace",
        "energyCost": 50,
        "description": "Oraxia throws a creeping web to ensnare her prey. Enemies caught within the widening radius are trapped inside a cocoon that increases their Damage Vulnerability.",
        "damage": 250,
        "duration": 25,
        "radius": 10,
        "castTime": 0.5,
        "damageType": "Toxin",
        "miscStats": {
          "damageVulnerability": 0.5,
          "maxWebs": 3,
          "toxinStatusChance": 1
        }
      },
      {
        "name": "Widow's Brood",
        "energyCost": 50,
        "description": "Oraxia launches a barrage of stinging darts in front of her that applies Toxin Status Effect. Poisoned enemies spawn Scuttlers when killed.",
        "damage": 750,
        "range": 25,
        "duration": 15,
        "castTime": 0.6,
        "damageType": "Toxin",
        "miscStats": {
          "darts": 10,
          "coneAngle": 35,
          "forcedToxinStacks": 4,
          "scuttlerDuration": 45,
          "maxScuttlers": 10,
          "scuttlerDamage": 50,
          "recallRadius": 60
        }
      },
      {
        "name": "Silken Stride",
        "energyCost": 25,
        "description": "Unfurl Oraxia's spider legs and go on the prowl. Oraxia is immune to Status Effects and has increased Maximum Health. Ranged Weapons are imbued with Toxin Damage. Killing enemies causes them to burst with Toxin.",
        "damage": 500,
        "radius": 5,
        "castTime": 0.8,
        "damageType": "Toxin",
        "miscStats": {
          "healthMultiplier": 2,
          "toxinWeaponDamage": 0.4,
          "wallLatchToxinWeaponDamage": 0.8,
          "energyDrain": 5,
          "dodgeRange": 75,
          "explosionRadiusCap": 10,
          "moveSpeedBonus": 0.3,
          "parkourVelocityBonus": 0.25,
          "statusImmunity": true
        }
      }
    ]
  },
  {
    "id": "protea",
    "name": "Protea",
    "health": 270,
    "shield": 455,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.2,
    "description": "Throw out grenades in an arc.  (TAP) SHRAPNEL VORTEX Creates a slashing, staggering swirl of shrapnel.  (HOLD) SHIELD SATELLITES Protea reconfigures Grenades to work as overchar...",
    "passive": "Every 4th Power Cast is granted +100% Ability Strength.",
    "abilities": [
      {
        "name": "Grenade Fan",
        "energyCost": 25,
        "description": "Throw out grenades in an arc.  (TAP) SHRAPNEL VORTEX Creates a slashing, staggering swirl of shrapnel.  (HOLD) SHIELD SATELLITES Protea reconfigures Grenades to work as overcharging shield generators, protecting her, her allies and companions. When Shields break, a Satellite is destroyed to double minimum Shield Gate invincibility time.",
        "damage": 500,
        "duration": 13,
        "radius": 5,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "shieldRestore": 500,
          "shieldsPerSecond": 50,
          "shrapnelGrenades": 3,
          "shieldGrenades": 4,
          "statusChance": 0.33,
          "staggerChance": 1,
          "shieldGateExtension": 2
        }
      },
      {
        "name": "Blaze Artillery",
        "energyCost": 50,
        "description": "Deploys an artillery unit to blast plasma charges at enemies it faces. Each enemy hit increases the power of subsequent plasma attacks.",
        "damage": 500,
        "duration": 3,
        "range": 30,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "shotsPerSecond": 3,
          "firingArc": 130,
          "maxTurrets": 3,
          "splashRadius": 2,
          "damageBonusPerHit": 1
        }
      },
      {
        "name": "Dispensary",
        "energyCost": 75,
        "description": "Deploys a device that generates 3 pickups after a short delay: empowered health orb, universal ammo pack and energy orb.",
        "duration": 25,
        "castTime": 0.5,
        "miscStats": {
          "extraPickupChance": 0.25,
          "spawnInterval": 2,
          "empoweredHealthRestore": 100,
          "maxCaches": 1
        }
      },
      {
        "name": "Temporal Anchor",
        "energyCost": 100,
        "description": "Drops a Temporal Anchor which, after a short duration, Protea rewinds to trigger a temporal implosion. Implosion damage increases based on damage dealt between anchor drop and rewind. Everything lost or expended in that time is returned. Dying while Anchor is active rewinds Protea to the anchor, saving her.",
        "duration": 8,
        "radius": 15,
        "castTime": 0.8,
        "miscStats": {
          "damageConversion": 0.25,
          "invulnerabilityDuration": 3,
          "rewindCountdown": 1.5,
          "lethalHealthRestore": 0.05
        }
      }
    ]
  },
  {
    "id": "protea_prime",
    "name": "Protea Prime",
    "health": 270,
    "shield": 455,
    "armor": 185,
    "energy": 200,
    "sprintSpeed": 1.2,
    "description": "Throw out grenades in an arc.  (TAP) SHRAPNEL VORTEX Creates a slashing, staggering swirl of shrapnel.  (HOLD) SHIELD SATELLITES Protea reconfigures Grenades to work as overchar...",
    "passive": "Every 4th Power Cast is granted +100% Ability Strength.",
    "abilities": [
      {
        "name": "Grenade Fan",
        "energyCost": 25,
        "description": "Throw out grenades in an arc.  (TAP) SHRAPNEL VORTEX Creates a slashing, staggering swirl of shrapnel.  (HOLD) SHIELD SATELLITES Protea reconfigures Grenades to work as overcharging shield generators, protecting her, her allies and companions. When Shields break, a Satellite is destroyed to double minimum Shield Gate invincibility time.",
        "damage": 500,
        "duration": 13,
        "radius": 5,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "shieldRestore": 500,
          "shieldsPerSecond": 50,
          "shrapnelGrenades": 3,
          "shieldGrenades": 4,
          "statusChance": 0.33,
          "staggerChance": 1,
          "shieldGateExtension": 2
        }
      },
      {
        "name": "Blaze Artillery",
        "energyCost": 50,
        "description": "Deploys an artillery unit to blast plasma charges at enemies it faces. Each enemy hit increases the power of subsequent plasma attacks.",
        "damage": 500,
        "duration": 3,
        "range": 30,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "shotsPerSecond": 3,
          "firingArc": 130,
          "maxTurrets": 3,
          "splashRadius": 2,
          "damageBonusPerHit": 1
        }
      },
      {
        "name": "Dispensary",
        "energyCost": 75,
        "description": "Deploys a device that generates 3 pickups after a short delay: empowered health orb, universal ammo pack and energy orb.",
        "duration": 25,
        "castTime": 0.5,
        "miscStats": {
          "extraPickupChance": 0.25,
          "spawnInterval": 2,
          "empoweredHealthRestore": 100,
          "maxCaches": 1
        }
      },
      {
        "name": "Temporal Anchor",
        "energyCost": 100,
        "description": "Drops a Temporal Anchor which, after a short duration, Protea rewinds to trigger a temporal implosion. Implosion damage increases based on damage dealt between anchor drop and rewind. Everything lost or expended in that time is returned. Dying while Anchor is active rewinds Protea to the anchor, saving her.",
        "duration": 8,
        "radius": 15,
        "castTime": 0.8,
        "miscStats": {
          "damageConversion": 0.25,
          "invulnerabilityDuration": 3,
          "rewindCountdown": 1.5,
          "lethalHealthRestore": 0.05
        }
      }
    ]
  },
  {
    "id": "qorvex",
    "name": "Qorvex",
    "health": 600,
    "shield": 200,
    "armor": 875,
    "energy": 150,
    "sprintSpeed": 0.89999998,
    "description": "Summon a Chyrinka Pillar that slows enemies. It pulses <DT_RADIATION_COLOR>Radiation Damage with a guaranteed Status Effect.",
    "passive": "Weapons wielded by Qorvex have an additional +3 Punch Through.",
    "abilities": [
      {
        "name": "Chyrinka Pillar",
        "energyCost": 25,
        "description": "Summon a Chyrinka Pillar that slows enemies. It pulses <DT_RADIATION_COLOR>Radiation Damage with a guaranteed Status Effect.",
        "damage": 1000,
        "duration": 35,
        "radius": 8,
        "castTime": 0.5,
        "damageType": "Radiation",
        "miscStats": {
          "empoweredDuration": 5,
          "pillarHeight": 3,
          "maxPillars": 2,
          "pulseInterval": 1.5,
          "slowPercent": 0.35,
          "empoweredPulseInterval": 0.75
        }
      },
      {
        "name": "Containment Wall",
        "energyCost": 50,
        "description": "Contain the threat. Qorvex summons walls that slam together, damaging all enemies caught between them and inflicting <DT_RADIATION_COLOR>Radiation Status.",
        "damage": 3500,
        "range": 20,
        "castTime": 1,
        "damageType": "Impact",
        "miscStats": {
          "radiationDamagePerTick": 200,
          "damageVulnerability": 0.25,
          "wallsGap": 10,
          "placementDistance": 2,
          "assemblyTime": 1,
          "damageInterval": 0.125,
          "radiationTicks": 7
        }
      },
      {
        "name": "Disometric Guard",
        "energyCost": 75,
        "description": "Guard yourself and nearby allies against Status Effects. Each time Qorvex kills or assists in killing an enemy affected by <DT_RADIATION_COLOR>Radiation Status, the number of Status Effects Disometric Guard can prevent increases.",
        "damage": 500,
        "castTime": 0.5,
        "damageType": "Radiation",
        "miscStats": {
          "initialStatusStacks": 5,
          "maxStatusStacks": 10,
          "damageRadius": 6,
          "affinityRange": 50,
          "stackChancePerStatus": 0.1,
          "stackChanceCap": 1
        }
      },
      {
        "name": "Crucible Blast",
        "energyCost": 100,
        "description": "Release a beam from Qorvex's Crucible Core. Each enemy struck suffers <DT_RADIATION_COLOR>Radiation Damage with a guaranteed Status Effect. Enemies affected by <DT_RADIATION_COLOR>Radiation Status explode in a chain reaction.",
        "damage": 10000,
        "range": 40,
        "radius": 8,
        "castTime": 0.75,
        "damageType": "Radiation",
        "miscStats": {
          "explosionDamage": 500,
          "explosionDamagePerStatus": 250,
          "beamRadius": 2,
          "beamTicksPerSecond": 10,
          "beamDuration": 2
        }
      }
    ]
  },
  {
    "id": "revenant",
    "name": "Revenant",
    "health": 270,
    "shield": 635,
    "armor": 135,
    "energy": 140,
    "sprintSpeed": 1,
    "description": "Convert a target into a zealous thrall. Thralls turn on their allies and enthrall through damage. On death, they disintegrate into a damaging pillar of energy.",
    "passive": "Shield depletion smashes enemies within 7.5m with a 100 Damage knockdown shockwave.",
    "abilities": [
      {
        "name": "Enthrall",
        "energyCost": 25,
        "description": "Convert a target into a zealous thrall. Thralls turn on their allies and enthrall through damage. On death, they disintegrate into a damaging pillar of energy.",
        "damage": 1000,
        "range": 25,
        "duration": 30,
        "castTime": 0.4,
        "miscStats": {
          "pillarDuration": 10,
          "pillarRadius": 2,
          "projectileDamage": 1000,
          "projectileSeekRange": 10,
          "maxThralls": 7
        }
      },
      {
        "name": "Mesmer Skin",
        "energyCost": 50,
        "description": "Become enveloped in Sentient energy, redirecting damage and stunning all those who dare attack. Stunned enemies can be Enthralled at no energy cost.",
        "castTime": 0.6,
        "miscStats": {
          "charges": 6,
          "stunDuration": 5
        }
      },
      {
        "name": "Reave",
        "energyCost": 50,
        "description": "Dash through enemies as a wall of sentient energy, leeching shields and health from any encountered, enhanced for thralls.",
        "range": 6,
        "duration": 1,
        "castTime": 0.5,
        "miscStats": {
          "hitpointsDrain": 0.08,
          "thrallHitpointsDrain": 0.4,
          "travelSpeed": 25
        }
      },
      {
        "name": "Danse Macabre",
        "energyCost": 25,
        "description": "Erupt with a multitude of Eidolon energy beams and sweep a circle of death around Revenant. The beams will modify their Damage Type to target select defenses, while incoming damage is redirected back into the beams.",
        "damage": 1250,
        "castTime": 0.8,
        "miscStats": {
          "boostedDamage": 2500,
          "beamRadius": 0.1,
          "boostedBeamRadius": 0.2,
          "beamCount": 9,
          "sweepArea": 100,
          "energyDrain": 20,
          "boostedEnergyDrain": 40,
          "statusChance": 0.2,
          "boostedStatusChance": 0.4,
          "channeled": true
        }
      }
    ]
  },
  {
    "id": "revenant_prime",
    "name": "Revenant Prime",
    "health": 270,
    "shield": 825,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Convert a target into a zealous thrall. Thralls turn on their allies and enthrall through damage. On death, they disintegrate into a damaging pillar of energy.",
    "passive": "Shield depletion smashes enemies within 7.5m with a 100 Damage knockdown shockwave.",
    "abilities": [
      {
        "name": "Enthrall",
        "energyCost": 25,
        "description": "Convert a target into a zealous thrall. Thralls turn on their allies and enthrall through damage. On death, they disintegrate into a damaging pillar of energy.",
        "damage": 1000,
        "range": 25,
        "duration": 30,
        "castTime": 0.4,
        "miscStats": {
          "pillarDuration": 10,
          "pillarRadius": 2,
          "projectileDamage": 1000,
          "projectileSeekRange": 10,
          "maxThralls": 7
        }
      },
      {
        "name": "Mesmer Skin",
        "energyCost": 50,
        "description": "Become enveloped in Sentient energy, redirecting damage and stunning all those who dare attack. Stunned enemies can be Enthralled at no energy cost.",
        "castTime": 0.6,
        "miscStats": {
          "charges": 6,
          "stunDuration": 5
        }
      },
      {
        "name": "Reave",
        "energyCost": 50,
        "description": "Dash through enemies as a wall of sentient energy, leeching shields and health from any encountered, enhanced for thralls.",
        "range": 6,
        "duration": 1,
        "castTime": 0.5,
        "miscStats": {
          "hitpointsDrain": 0.08,
          "thrallHitpointsDrain": 0.4,
          "travelSpeed": 25
        }
      },
      {
        "name": "Danse Macabre",
        "energyCost": 25,
        "description": "Erupt with a multitude of Eidolon energy beams and sweep a circle of death around Revenant. The beams will modify their Damage Type to target select defenses, while incoming damage is redirected back into the beams.",
        "damage": 1250,
        "castTime": 0.8,
        "miscStats": {
          "boostedDamage": 2500,
          "beamRadius": 0.1,
          "boostedBeamRadius": 0.2,
          "beamCount": 9,
          "sweepArea": 100,
          "energyDrain": 20,
          "boostedEnergyDrain": 40,
          "statusChance": 0.2,
          "boostedStatusChance": 0.4,
          "channeled": true
        }
      }
    ]
  },
  {
    "id": "rhino",
    "name": "Rhino",
    "health": 270,
    "shield": 455,
    "armor": 240,
    "energy": 100,
    "sprintSpeed": 0.94999999,
    "description": "Rhino charges towards a target, clobbering any in his path and goring his victim.",
    "passive": "Emit a shockwave dealing 100 damage after landing from a great height.",
    "abilities": [
      {
        "name": "Rhino Charge",
        "energyCost": 25,
        "description": "Rhino charges towards a target, clobbering any in his path and goring his victim.",
        "damage": 650,
        "range": 12,
        "radius": 2,
        "duration": 1,
        "castTime": 0.4,
        "damageType": "Impact",
        "miscStats": {
          "dashSpeed": 48
        }
      },
      {
        "name": "Iron Skin",
        "energyCost": 50,
        "description": "Rhino hardens his skin, insulating himself from all damage and gaining Overguard.",
        "armor": 1200,
        "castTime": 0.6,
        "miscStats": {
          "armorMultiplier": 2.5,
          "invulnerabilityDuration": 3
        }
      },
      {
        "name": "Roar",
        "energyCost": 75,
        "description": "Grants all nearby Warframes increased damage for a short duration.",
        "damageBuff": 0.5,
        "range": 25,
        "duration": 30,
        "castTime": 0.5
      },
      {
        "name": "Rhino Stomp",
        "energyCost": 100,
        "description": "Rhino stomps with force sufficient to disrupt time, tumbling enemies around him in stasis.",
        "damage": 800,
        "range": 25,
        "duration": 8,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "slowPercent": 0.975
        }
      }
    ]
  },
  {
    "id": "rhino_prime",
    "name": "Rhino Prime",
    "health": 270,
    "shield": 455,
    "armor": 290,
    "energy": 100,
    "sprintSpeed": 1,
    "description": "Rhino charges towards a target, clobbering any in his path and goring his victim.",
    "passive": "Emit a shockwave dealing 100 damage after landing from a great height.",
    "abilities": [
      {
        "name": "Rhino Charge",
        "energyCost": 25,
        "description": "Rhino charges towards a target, clobbering any in his path and goring his victim.",
        "damage": 650,
        "range": 12,
        "radius": 2,
        "duration": 1,
        "castTime": 0.4,
        "damageType": "Impact",
        "miscStats": {
          "dashSpeed": 48
        }
      },
      {
        "name": "Iron Skin",
        "energyCost": 50,
        "description": "Rhino hardens his skin, insulating himself from all damage and gaining Overguard.",
        "armor": 1200,
        "castTime": 0.6,
        "miscStats": {
          "armorMultiplier": 2.5,
          "invulnerabilityDuration": 3
        }
      },
      {
        "name": "Roar",
        "energyCost": 75,
        "description": "Grants all nearby Warframes increased damage for a short duration.",
        "damageBuff": 0.5,
        "range": 25,
        "duration": 30,
        "castTime": 0.5
      },
      {
        "name": "Rhino Stomp",
        "energyCost": 100,
        "description": "Rhino stomps with force sufficient to disrupt time, tumbling enemies around him in stasis.",
        "damage": 800,
        "range": 25,
        "duration": 8,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "slowPercent": 0.975
        }
      }
    ]
  },
  {
    "id": "saryn",
    "name": "Saryn",
    "health": 365,
    "shield": 270,
    "armor": 240,
    "energy": 175,
    "sprintSpeed": 0.94999999,
    "description": "Inflict a target with a pox of Corrosive spores. Spread spores to nearby enemies by destroying them or killing their host. The longer the Spore spreads, its damage increases.",
    "passive": "Status Effects inflicted upon enemies last 25% longer.",
    "abilities": [
      {
        "name": "Spores",
        "energyCost": 25,
        "description": "Inflict a target with a pox of Corrosive spores. Spread spores to nearby enemies by destroying them or killing their host. The longer the Spore spreads, its damage will increase.",
        "damage": 10,
        "range": 60,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "miscStats": {
          "damageGrowth": 2,
          "spreadRadius": 16,
          "statusChance": 0.5,
          "resetDecay": 0.2,
          "damageDecayRate": 0.1,
          "growthEnemyCap": 7,
          "initialSpores": 3,
          "miasmaDamageMultiplier": 4
        }
      },
      {
        "name": "Molt",
        "energyCost": 50,
        "description": "Shedding her skin like a snake, Saryn leaves a decoy behind to draw fire from enemies.",
        "health": 500,
        "damage": 400,
        "range": 10,
        "duration": 40,
        "castTime": 0.6,
        "damageType": "Toxin",
        "miscStats": {
          "speedBuff": 0.5,
          "speedBuffDuration": 5,
          "decoyShields": 400,
          "decoyInvulnerability": 3,
          "statusCleanse": true
        }
      },
      {
        "name": "Toxic Lash",
        "energyCost": 50,
        "description": "While active, attacks deal additional Toxin Damage; this effect is doubled for Melee Strikes. Instantly burst spores when attacking afflicted enemies.",
        "duration": 45,
        "castTime": 0.4,
        "miscStats": {
          "gunDamage": 0.3,
          "meleeDamage": 0.6,
          "contagionCloudDps": 300,
          "contagionCloudRange": 5,
          "contagionCloudDuration": 12,
          "contagionCloudMeleeMult": 2
        }
      },
      {
        "name": "Miasma",
        "energyCost": 75,
        "description": "Release a poisonous miasma that deals Viral Damage to enemies in range. Foes afflicted by spores are more susceptible to the mist.",
        "damagePerSecond": 150,
        "range": 20,
        "duration": 6,
        "castTime": 0.8,
        "damageType": "Viral",
        "miscStats": {
          "sporesDamageMultiplier": 4
        }
      }
    ]
  },
  {
    "id": "saryn_prime",
    "name": "Saryn Prime",
    "health": 365,
    "shield": 270,
    "armor": 315,
    "energy": 200,
    "sprintSpeed": 1,
    "description": "Inflict a target with a pox of Corrosive spores. Spread spores to nearby enemies by destroying them or killing their host. The longer the Spore spreads, its damage increases.",
    "passive": "Status Effects inflicted upon enemies last 25% longer.",
    "abilities": [
      {
        "name": "Spores",
        "energyCost": 25,
        "description": "Inflict a target with a pox of Corrosive spores. Spread spores to nearby enemies by destroying them or killing their host. The longer the Spore spreads, its damage will increase.",
        "damage": 10,
        "range": 60,
        "castTime": 0.5,
        "damageType": "Corrosive",
        "miscStats": {
          "damageGrowth": 2,
          "spreadRadius": 16,
          "statusChance": 0.5,
          "resetDecay": 0.2,
          "damageDecayRate": 0.1,
          "growthEnemyCap": 7,
          "initialSpores": 3,
          "miasmaDamageMultiplier": 4
        }
      },
      {
        "name": "Molt",
        "energyCost": 50,
        "description": "Shedding her skin like a snake, Saryn leaves a decoy behind to draw fire from enemies.",
        "health": 500,
        "damage": 400,
        "range": 10,
        "duration": 40,
        "castTime": 0.6,
        "damageType": "Toxin",
        "miscStats": {
          "speedBuff": 0.5,
          "speedBuffDuration": 5,
          "decoyShields": 400,
          "decoyInvulnerability": 3,
          "statusCleanse": true
        }
      },
      {
        "name": "Toxic Lash",
        "energyCost": 50,
        "description": "While active, attacks deal additional Toxin Damage; this effect is doubled for Melee Strikes. Instantly burst spores when attacking afflicted enemies.",
        "duration": 45,
        "castTime": 0.4,
        "miscStats": {
          "gunDamage": 0.3,
          "meleeDamage": 0.6,
          "contagionCloudDps": 300,
          "contagionCloudRange": 5,
          "contagionCloudDuration": 12,
          "contagionCloudMeleeMult": 2
        }
      },
      {
        "name": "Miasma",
        "energyCost": 75,
        "description": "Release a poisonous miasma that deals Viral Damage to enemies in range. Foes afflicted by spores are more susceptible to the mist.",
        "damagePerSecond": 150,
        "range": 20,
        "duration": 6,
        "castTime": 0.8,
        "damageType": "Viral",
        "miscStats": {
          "sporesDamageMultiplier": 4
        }
      }
    ]
  },
  {
    "id": "sevagoth",
    "name": "Sevagoth",
    "health": 270,
    "shield": 235,
    "armor": 160,
    "energy": 140,
    "sprintSpeed": 0.94999999,
    "description": "Sevagoth's Shadow flies outward ravaging enemies in his path. Survivors are damaged by Death\u2019s Harvest over time. The souls of the dead fill the Death Well.",
    "passive": "On death, become Sevagoth's Shadow and fight to resurrect him by collecting the souls needed to rebuild his tombstone.",
    "abilities": [
      {
        "name": "Reap",
        "energyCost": 25,
        "description": "Sevagoth's Shadow flies outward ravaging enemies in his path. Survivors are damaged by Death's Harvest over time. The souls of the dead fill the Death Well.",
        "damage": 250,
        "duration": 6,
        "radius": 8,
        "castTime": 0.5,
        "damageType": "Radiation",
        "miscStats": {
          "damageVulnerability": 0.5,
          "debuffDuration": 10,
          "deathWellGain": 0.05,
          "radialDamagePercent": 0.25,
          "radialDamageRange": 4
        }
      },
      {
        "name": "Sow",
        "energyCost": 50,
        "description": "Plant a death seed in nearby targets to drain their lifeforce. Reap what has been sown to detonate afflicted enemies, dealing a percentage of their health as radial damage. The souls of the dead fill the Death Well.",
        "damage": 250,
        "duration": 10,
        "range": 16,
        "castTime": 0.5,
        "miscStats": {
          "deathWellGain": 0.05,
          "radialDamagePercent": 0.25,
          "radialDamageRange": 4
        }
      },
      {
        "name": "Gloom",
        "energyCost": 50,
        "description": "Summon a radial pulse wave that ensnares and slows enemies, siphoning their lifeforce for the Death Well. Allies within the wave steal health with each attack.",
        "castTime": 0.5,
        "miscStats": {
          "slowPercent": 0.35,
          "lifeStealPercent": 0.05,
          "slowCap": 0.95,
          "minRadius": 4,
          "maxRadius": 16,
          "rangeGrowthPerSecond": 2,
          "energyDrainPerEnemy": 0.75,
          "energyDrainEnemyCap": 10,
          "deathWellGainPerSecond": 0.001,
          "channeled": true
        }
      },
      {
        "name": "Exalted Shadow",
        "energyCost": 0,
        "description": "When the Death Well fills to above 75%, Sevagoth's Shadow form is ready to be released. Tear the enemy asunder with a collection of melee-focused abilities.",
        "damage": 250,
        "castTime": 0.8,
        "miscStats": {
          "deathWellThreshold": 0.75,
          "deathWellDrain": 0.01,
          "invulnerabilityDuration": 5
        }
      }
    ]
  },
  {
    "id": "sevagoth_prime",
    "name": "Sevagoth Prime",
    "health": 270,
    "shield": 270,
    "armor": 185,
    "energy": 175,
    "sprintSpeed": 0.94999999,
    "description": "Sevagoth's Shadow flies outward ravaging enemies in his path. Survivors are damaged by Death\u2019s Harvest over time. The souls of the dead fill the Death Well.",
    "passive": "On death, become Sevagoth's Shadow and fight to resurrect him by collecting the souls needed to rebuild his tombstone.",
    "abilities": [
      {
        "name": "Reap",
        "energyCost": 25,
        "description": "Sevagoth's Shadow flies outward ravaging enemies in his path. Survivors are damaged by Death's Harvest over time. The souls of the dead fill the Death Well.",
        "damage": 250,
        "duration": 6,
        "radius": 8,
        "castTime": 0.5,
        "damageType": "Radiation",
        "miscStats": {
          "damageVulnerability": 0.5,
          "debuffDuration": 10,
          "deathWellGain": 0.05,
          "radialDamagePercent": 0.25,
          "radialDamageRange": 4
        }
      },
      {
        "name": "Sow",
        "energyCost": 50,
        "description": "Plant a death seed in nearby targets to drain their lifeforce. Reap what has been sown to detonate afflicted enemies, dealing a percentage of their health as radial damage. The souls of the dead fill the Death Well.",
        "damage": 250,
        "duration": 10,
        "range": 16,
        "castTime": 0.5,
        "miscStats": {
          "deathWellGain": 0.05,
          "radialDamagePercent": 0.25,
          "radialDamageRange": 4
        }
      },
      {
        "name": "Gloom",
        "energyCost": 50,
        "description": "Summon a radial pulse wave that ensnares and slows enemies, siphoning their lifeforce for the Death Well. Allies within the wave steal health with each attack.",
        "castTime": 0.5,
        "miscStats": {
          "slowPercent": 0.35,
          "lifeStealPercent": 0.05,
          "slowCap": 0.95,
          "minRadius": 4,
          "maxRadius": 16,
          "rangeGrowthPerSecond": 2,
          "energyDrainPerEnemy": 0.75,
          "energyDrainEnemyCap": 10,
          "deathWellGainPerSecond": 0.001,
          "channeled": true
        }
      },
      {
        "name": "Exalted Shadow",
        "energyCost": 0,
        "description": "When the Death Well fills to above 75%, Sevagoth's Shadow form is ready to be released. Tear the enemy asunder with a collection of melee-focused abilities.",
        "damage": 250,
        "castTime": 0.8,
        "miscStats": {
          "deathWellThreshold": 0.75,
          "deathWellDrain": 0.01,
          "invulnerabilityDuration": 5
        }
      }
    ]
  },
  {
    "id": "styanax",
    "name": "Styanax",
    "health": 270,
    "shield": 825,
    "armor": 265,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Throw an Axios Javelin. When the javelin impales an enemy against a wall, surrounding enemies are pulled into the area and suffer a burst of damage.",
    "passive": "Styanax's critical chance increases with his shields and doubles for spearguns.",
    "abilities": [
      {
        "name": "Axios Javelin",
        "energyCost": 15,
        "description": "Throw an Axios Javelin. When the javelin impales an enemy against a wall, surrounding enemies are pulled into the area and suffer a burst of damage.",
        "directDamage": 1250,
        "aoeDamage": 1250,
        "range": 50,
        "radius": 15,
        "duration": 8,
        "castTime": 0.5
      },
      {
        "name": "Tharros Strike",
        "energyCost": 25,
        "description": "Summon Tharros, the shield of Styanax. Swing Tharros to repel enemies and reduce their shields and armor. Styanax regenerates health for every enemy struck.",
        "damage": 1000,
        "range": 9,
        "castTime": 0.75,
        "damageType": "Impact",
        "miscStats": {
          "shieldStrip": 0.5,
          "armorStrip": 0.5,
          "healthPerHit": 100,
          "shieldCount": 9,
          "horizontalSpread": 135,
          "verticalSpread": 160
        }
      },
      {
        "name": "Rally Point",
        "energyCost": 75,
        "description": "Draw enemy attention to Styanax. His resolve uplifts him and nearby allies, regenerating the squad's energy over time. Styanax and his allies also regenerate shields for every kill assist they contribute.",
        "duration": 30,
        "range": 30,
        "miscStats": { "energyRegen": 3, "shieldsPerKill": 50 }
      },
      {
        "name": "Final Stand",
        "energyCost": 100,
        "description": "Exude might and valor. Rise into the air and throw a barrage of Axios Javelins. The javelins deal damage to nearby enemies wherever they land. Direct hits to enemies deal greater damage.",
        "directDamage": 1500,
        "aoeDamage": 1500,
        "radius": 6,
        "miscStats": { "javelins": 30, "javelinsPerSecond": 20 }
      }
    ]
  },
  {
    "id": "styanax_prime",
    "name": "Styanax Prime",
    "health": 270,
    "shield": 925,
    "armor": 265,
    "energy": 215,
    "sprintSpeed": 1,
    "description": "Shield of the innocent. Spear of justice. Styanax Prime holds the line in defiance of tyranny.",
    "passive": "Styanax's critical chance increases with his shields and doubles for spearguns.",
    "abilities": [
      {
        "name": "Axios Javelin",
        "energyCost": 15,
        "description": "Throw an Axios Javelin. When the javelin impales an enemy against a wall, surrounding enemies are pulled into the area and suffer a burst of damage.",
        "directDamage": 1250,
        "aoeDamage": 1250,
        "range": 50,
        "radius": 15,
        "duration": 8,
        "castTime": 0.5
      },
      {
        "name": "Tharros Strike",
        "energyCost": 25,
        "description": "Summon Tharros, the shield of Styanax. Swing Tharros to repel enemies and reduce their shields and armor. Styanax regenerates health for every enemy struck.",
        "damage": 1000,
        "range": 9,
        "castTime": 0.75,
        "damageType": "Impact",
        "miscStats": {
          "shieldStrip": 0.5,
          "armorStrip": 0.5,
          "healthPerHit": 100,
          "shieldCount": 9,
          "horizontalSpread": 135,
          "verticalSpread": 160
        }
      },
      {
        "name": "Rally Point",
        "energyCost": 75,
        "description": "Draw enemy attention to Styanax. His resolve uplifts him and nearby allies, regenerating the squad's energy over time. Styanax and his allies also regenerate shields for every kill assist they contribute.",
        "duration": 30,
        "range": 30,
        "miscStats": { "energyRegen": 3, "shieldsPerKill": 50 }
      },
      {
        "name": "Final Stand",
        "energyCost": 100,
        "description": "Exude might and valor. Rise into the air and throw a barrage of Axios Javelins. The javelins deal damage to nearby enemies wherever they land. Direct hits to enemies deal greater damage.",
        "directDamage": 1500,
        "aoeDamage": 1500,
        "radius": 6,
        "miscStats": { "javelins": 30, "javelinsPerSecond": 20 }
      }
    ]
  },
  {
    "id": "sirius_orion",
    "name": "Sirius & Orion",
    "health": 475,
    "shield": 355,
    "armor": 160,
    "energy": 200,
    "sprintSpeed": 1.15,
    "description": "Wield the power of the stars in a constant battle for supremacy. Swap between Sirius and Orion during combat to rain cosmic destruction upon foes.",
    "passive": "Swapping between Sirius and Orion grants 45% Ability Efficiency for the next 2 casts. When below 50 energy, they steal energy from each other.",
        "abilities": [
      {
        "name": "Coronal Ejection",
        "energyCost": 15,
        "description": "Hurl Sirius' Jade Light infused scythe, dealing Heat damage while collecting any pickups in its path. (HOLD) Swap to Orion and cast Gravitic Slash.",
        "damage": 1500,
        "radius": 5,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Heat"
      },
      {
        "name": "Gravitic Slash",
        "energyCost": 15,
        "description": "Repel enemies with Orion's scythe, dealing Slash damage while reducing shields and armor. (HOLD) Swap to Sirius and cast Coronal Ejection.",
        "damage": 2000,
        "radius": 8,
        "statusChance": 1,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "shieldStrip": 0.5,
          "armorStrip": 0.5,
          "coneAngle": 67.5
        }
      },
      {
        "name": "Jade Stars",
        "energyCost": 50,
        "description": "Sirius conjures Jade Light motes that slowly regenerate over time. Attacking enemies launches the motes, dealing Heat damage. (HOLD) Swap to Orion and cast Astral Shell.",
        "damage": 500,
        "duration": 35,
        "radius": 4,
        "statusChance": 1,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "motes": 7,
          "moteRecoveryPerSecond": 0.2,
          "maxAttackRange": 50
        }
      },
      {
        "name": "Astral Shell",
        "energyCost": 50,
        "description": "Envelop Orion in an Astral Shell. Upon taking damage the shell becomes a decoy that draws fire until it is destroyed. (HOLD) Swap to Sirius and cast Jade Stars.",
        "duration": 35,
        "castTime": 0.4,
        "miscStats": {
          "decoyDuration": 5,
          "decoyDamage": 200,
          "decoyRadius": 5,
          "decoyCooldown": 5,
          "tauntRadius": 30
        }
      },
      {
        "name": "Light's Sanctuary",
        "energyCost": 50,
        "description": "Sirius creates a well of light that heals and revives allies, while reducing incoming damage. The well slowly grows in size and power. (HOLD) Swap to Orion and cast Event Horizon.",
        "duration": 30,
        "radius": 10,
        "damageReduction": 0.45,
        "castTime": 0.6,
        "miscStats": {
          "minRadius": 5,
          "maxRadius": 10,
          "minHealthRegen": 25,
          "maxHealthRegen": 55,
          "minDamageReduction": 0.15,
          "expansionTime": 10,
          "reviveCooldown": 60,
          "drCap": 0.75,
          "sanctuaryLimit": 1
        }
      },
      {
        "name": "Event Horizon",
        "energyCost": 50,
        "description": "Orion forms a drifting black hole, trapping enemies within its gravity. Hitting the black hole with Gravitic Slash or Coronal Ejection extends its duration and changes its trajectory.",
        "damage": 750,
        "duration": 18,
        "radius": 8,
        "castTime": 0.7,
        "damageType": "Heat",
        "miscStats": {
          "explosionRadius": 12,
          "durationExtension": 5,
          "blackHoleLimit": 1
        }
      },
      {
        "name": "Celestial Clash",
        "energyCost": 100,
        "description": "Sirius and Orion take to the skies in a cosmic clash. Each attack consumes a Constellation Star to inflict colossal Blast damage. Match the star color for increased Critical Chance.",
        "damage": 10000,
        "radius": 26,
        "castTime": 1,
        "damageType": "Blast",
        "miscStats": {
          "criticalChanceBonus": 0.5,
          "matchedDamageBonus": 1.5,
          "maxConstellationStars": 7
        }
      }
    ]
  },
  {
    "id": "temple",
    "name": "Temple",
    "health": 405,
    "shield": 225,
    "armor": 325,
    "energy": 165,
    "sprintSpeed": 1,
    "description": "Blast targeted enemies with pillars of <DT_FIRE_COLOR>Heat Damage.   Backbeat Timing: Ignite even more pillars. Increases the Duration and <DT_FIRE_COLOR>Heat Damage of Ripper\"...",
    "passive": "Play abilities in sync with the Backbeat metronome to invigorate ability effects while increasing Ability Efficiency by 50%.",
    "abilities": [
      {
        "name": "Pyrotechnics",
        "energyCost": 25,
        "description": "Blast targeted enemies with pillars of Heat Damage. Backbeat Timing: Ignite even more pillars. Increases the Duration and Heat Damage of Ripper's Wail when it deals damage.",
        "damage": 1000,
        "range": 25,
        "radius": 20,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "pillars": 5,
          "heatStatusChance": 1,
          "wailDurationBonus": 6,
          "backbeatPillarMultiplier": 2
        }
      },
      {
        "name": "Overdrive",
        "energyCost": 25,
        "description": "Drive loudspeakers into epic distortion to create a damaging wave of Heat Damage while also increasing vulnerability to Critical Chance. Backbeat Timing: Doubles Critical Chance.",
        "damage": 750,
        "range": 20,
        "duration": 20,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "criticalChanceVulnerability": 0.25,
          "coneAngle": 100,
          "stunDuration": 2,
          "wailDurationBonus": 6,
          "backbeatCritMultiplier": 2
        }
      },
      {
        "name": "Ripper's Wail",
        "energyCost": 50,
        "description": "Rip on the guitar to make Temple briefly invulnerable while healing them. Ally weapons in Affinity Range gain Heat Damage each time an ability is used on the Backbeat and hits enemies.",
        "duration": 30,
        "castTime": 0.8,
        "miscStats": {
          "heatDamageBonus": 0.75,
          "heatDamageCap": 7.5,
          "healthRestorePerSecond": 0.5,
          "invulnerabilityDuration": 3,
          "backbeatInvulnerabilityBonus": 4,
          "backbeatBonus": 0.05,
          "maxBuffDuration": 60,
          "affinityRange": 50
        }
      },
      {
        "name": "Exalted Solo",
        "energyCost": 75,
        "description": "Once a charge has been built up on the Backbeat metronome, set Lizzie aflame and torch enemies with Heat. While aimed, Lizzie blasts enemies with thunderous elemental sound waves.",
        "castTime": 0.8,
        "miscStats": {
          "damageMultiplier": 1.25,
          "backbeatAmmoCost": 2,
          "backbeatStatusBonus": 3
        }
      }
    ]
  },
  {
    "id": "titania",
    "name": "Titania",
    "health": 270,
    "shield": 270,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Enemies fumble their weapons as they are whisked into the air. Nearby allies become immune to Status Effects. Hold the ability to cast the immunity onto Titania.",
    "passive": "Titania generates Health for herself and nearby allies every time she casts an Ability.",
    "abilities": [
      {
        "name": "Spellbind",
        "energyCost": 25,
        "description": "Enemies fumble their weapons as they are whisked into the air. Nearby allies become immune to Status Effects. Hold the ability to cast the immunity onto Titania.",
        "range": 50,
        "duration": 16,
        "radius": 5,
        "castTime": 0.4,
        "miscStats": {
          "statusCleanse": true
        }
      },
      {
        "name": "Tribute",
        "energyCost": 50,
        "description": "Cycle through and extract one of the four Buffs when cast on an enemy. Thorns reduces incoming damage. Dust degrades enemy accuracy. Full Moon increases companion damage. Entangle slows enemies.",
        "damage": 500,
        "range": 25,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "auraDuration": 120,
          "auraRadius": 35
        }
      },
      {
        "name": "Lantern",
        "energyCost": 75,
        "description": "Create a swarm of razorflies that transform an enemy into an irresistible floating beacon, attracting witless comrades before exploding on command.",
        "damagePerSecond": 350,
        "damage": 2500,
        "range": 25,
        "duration": 25,
        "radius": 20,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "explosionRadius": 8,
          "damageRadius": 2.5,
          "maxLanterns": 4
        }
      },
      {
        "name": "Razorwing",
        "energyCost": 25,
        "description": "Shrink down and take flight, while razorflies attack nearby enemies and amplify the damage they take.",
        "damage": 160,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 5,
          "meleeDamage": 200,
          "droneDamage": 80,
          "evasion": 0.5,
          "razorflies": 6,
          "vacuumRadius": 10
        }
      }
    ]
  },
  {
    "id": "titania_prime",
    "name": "Titania Prime",
    "health": 365,
    "shield": 270,
    "armor": 135,
    "energy": 215,
    "sprintSpeed": 1,
    "description": "Enemies fumble their weapons as they are whisked into the air. Nearby allies become immune to Status Effects. Hold the ability to cast the immunity onto Titania.",
    "passive": "Titania generates Health for herself and nearby allies every time she casts an Ability.",
    "abilities": [
      {
        "name": "Spellbind",
        "energyCost": 25,
        "description": "Enemies fumble their weapons as they are whisked into the air. Nearby allies become immune to Status Effects. Hold the ability to cast the immunity onto Titania.",
        "range": 50,
        "duration": 16,
        "radius": 5,
        "castTime": 0.4,
        "miscStats": {
          "statusCleanse": true
        }
      },
      {
        "name": "Tribute",
        "energyCost": 50,
        "description": "Cycle through and extract one of the four Buffs when cast on an enemy. Thorns reduces incoming damage. Dust degrades enemy accuracy. Full Moon increases companion damage. Entangle slows enemies.",
        "damage": 500,
        "range": 25,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Impact",
        "miscStats": {
          "auraDuration": 120,
          "auraRadius": 35
        }
      },
      {
        "name": "Lantern",
        "energyCost": 75,
        "description": "Create a swarm of razorflies that transform an enemy into an irresistible floating beacon, attracting witless comrades before exploding on command.",
        "damagePerSecond": 350,
        "damage": 2500,
        "range": 25,
        "duration": 25,
        "radius": 20,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "explosionRadius": 8,
          "damageRadius": 2.5,
          "maxLanterns": 4
        }
      },
      {
        "name": "Razorwing",
        "energyCost": 25,
        "description": "Shrink down and take flight, while razorflies attack nearby enemies and amplify the damage they take.",
        "damage": 160,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 5,
          "meleeDamage": 200,
          "droneDamage": 80,
          "evasion": 0.5,
          "razorflies": 6,
          "vacuumRadius": 10
        }
      }
    ]
  },
  {
    "id": "trinity",
    "name": "Trinity",
    "health": 270,
    "shield": 270,
    "armor": 105,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Create a well of life on an enemy who will absorb Status Effect damage intended for nearby allies. Allies gain additional Health when they attack the target. If allies die, enemies in the well die in their stead.",
    "passive": "Allies in Affinity Range gain 50% of Trinity's Max Energy as Health.",
    "abilities": [
      {
        "name": "Well Of Life",
        "energyCost": 25,
        "description": "Create a well of life on an enemy who will absorb Status Effect damage intended for nearby allies. Allies gain additional Health when they attack the target. If allies die, enemies in the well die in their stead.",
        "range": 100,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "healthPerSecond": 100,
          "lifesteal": 0.01,
          "healingRadius": 20,
          "maxTargets": 3,
          "reviveCooldown": 60,
          "invulnerabilityDuration": 5
        }
      },
      {
        "name": "Energy Vampire",
        "energyCost": 50,
        "description": "Allies will gain energy over time when enemies are marked with Energy Vampire.",
        "range": 100,
        "duration": 9,
        "castTime": 0.4,
        "miscStats": {
          "energyPerPulse": 25,
          "pulseRadius": 25,
          "pulseInterval": 2.25,
          "damagePercentage": 0.0625,
          "damageHealthThreshold": 0.25
        }
      },
      {
        "name": "Link",
        "energyCost": 75,
        "description": "Any damage taken while Link is active will be channeled to a nearby enemy.",
        "range": 20,
        "duration": 20,
        "castTime": 0.6,
        "miscStats": {
          "affectedEnemies": 3,
          "damageRedirection": 0.75
        }
      },
      {
        "name": "Blessing",
        "energyCost": 100,
        "description": "Restore the health and shields of allies within Affinity Range while reducing the damage they take from enemies.",
        "duration": 15,
        "castTime": 0.8,
        "damageReduction": 0.5,
        "miscStats": {
          "healthShieldRestore": 0.8,
          "drCap": 0.75,
          "affinityRange": 50
        }
      }
    ]
  },
  {
    "id": "trinity_prime",
    "name": "Trinity Prime",
    "health": 270,
    "shield": 455,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Create a well of life on an enemy who will absorb Status Effect damage intended for nearby allies. Allies gain additional Health when they attack the target. If allies die, enemies in the well die in their stead.",
    "passive": "Allies in Affinity Range gain 50% of Trinity's Max Energy as Health.",
    "abilities": [
      {
        "name": "Well Of Life",
        "energyCost": 25,
        "description": "Create a well of life on an enemy who will absorb Status Effect damage intended for nearby allies. Allies gain additional Health when they attack the target. If allies die, enemies in the well die in their stead.",
        "range": 100,
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "healthPerSecond": 100,
          "lifesteal": 0.01,
          "healingRadius": 20,
          "maxTargets": 3,
          "reviveCooldown": 60,
          "invulnerabilityDuration": 5
        }
      },
      {
        "name": "Energy Vampire",
        "energyCost": 50,
        "description": "Allies will gain energy over time when enemies are marked with Energy Vampire.",
        "range": 100,
        "duration": 9,
        "castTime": 0.4,
        "miscStats": {
          "energyPerPulse": 25,
          "pulseRadius": 25,
          "pulseInterval": 2.25,
          "damagePercentage": 0.0625,
          "damageHealthThreshold": 0.25
        }
      },
      {
        "name": "Link",
        "energyCost": 75,
        "description": "Any damage taken while Link is active will be channeled to a nearby enemy.",
        "range": 20,
        "duration": 20,
        "castTime": 0.6,
        "miscStats": {
          "affectedEnemies": 3,
          "damageRedirection": 0.75
        }
      },
      {
        "name": "Blessing",
        "energyCost": 100,
        "description": "Restore the health and shields of allies within Affinity Range while reducing the damage they take from enemies.",
        "duration": 15,
        "castTime": 0.8,
        "damageReduction": 0.5,
        "miscStats": {
          "healthShieldRestore": 0.8,
          "drCap": 0.75,
          "affinityRange": 50
        }
      }
    ]
  },
  {
    "id": "uriel",
    "name": "Uriel",
    "health": 566,
    "shield": 566,
    "armor": 105,
    "energy": 100,
    "sprintSpeed": 1.1,
    "description": "Manifest an aura of flames inflicting <DT_FIRE_COLOR>Heat Damage and Status Effect on nearby enemies.  Tap Dodge while airborne to take flight as a flaming meteor of destruction.",
    "passive": "Uriel commands, empowers, and protects three unique demons.  CATENACH: Snares and slows enemies chaining them together. Damage dealt to any target in the chain is inflicted on all snared enemies. (Unlocks with Infernalis)  GULPHAGOR : Latches onto foes dealing damage over time. If killed, a circle of pain is spawned. (Unlocks with Remedium)  VYTHELAS: Inscribes demonic runes upon fallen foes that add Fire Rate and <DT_FIRE_COLOR>Heat Damage when collected. (Unlocks with Demonium)",
        "abilities": [
      {
        "name": "Infernalis",
        "energyCost": 25,
        "description": "Manifest an aura of flames inflicting Heat Damage and Status Effect on nearby enemies. Tap Dodge while airborne to take flight as a flaming meteor of destruction.",
        "damage": 1500,
        "damagePerSecond": 250,
        "duration": 35,
        "radius": 2,
        "castTime": 0.5,
        "damageType": "Heat",
        "miscStats": {
          "heatStatusChance": 1,
          "flightSpeed": 16,
          "catenachChainDamage": 100,
          "catenachSlow": 0.5,
          "catenachSlowCap": 0.95,
          "catenachChainDuration": 10,
          "catenachChainRange": 15,
          "catenachMaxTargets": 5
        }
      },
      {
        "name": "Remedium",
        "energyCost": 50,
        "description": "Uriel heals himself and his demons. If his demons are dead, they are resurrected.",
        "castTime": 0.6,
        "miscStats": {
          "healthRestore": 0.5,
          "statusCleanse": true,
          "gulphagorDamage": 750,
          "gulphagorHealthOrbChance": 3,
          "gulphagorEnergyOrbChance": 1,
          "gulphagorFieldDamage": 200,
          "gulphagorFieldDuration": 10,
          "gulphagorFieldRadius": 4
        }
      },
      {
        "name": "Demonium",
        "energyCost": 75,
        "description": "Uriel rips out the souls of his demons, draining their health, and sends them in search of new victims. Souls explode on contact with an enemy, rendering it vulnerable to Damage.",
        "damage": 250,
        "duration": 5,
        "radius": 6,
        "castTime": 0.6,
        "damageType": "Heat",
        "miscStats": {
          "damageVulnerability": 0.5,
          "demonHealthDrain": 0.1,
          "maxProjectiles": 3,
          "vythelasFireRate": 0.3,
          "vythelasHeatDamage": 0.3,
          "vythelasDuration": 10,
          "maxRunes": 3
        }
      },
      {
        "name": "Brimstone",
        "energyCost": 75,
        "description": "Uriel and his demons create a growing ring of flaming brimstone. Charge the ability by utilizing demon abilities. Damage inflicted increases with each consecutive hit.",
        "damage": 1500,
        "duration": 10,
        "radius": 15,
        "castTime": 0.8,
        "damageType": "Heat",
        "miscStats": {
          "tickInterval": 0.25,
          "damageGrowthPercent": 1,
          "damageGrowthInterval": 0.5,
          "damageMultiplierCap": 10,
          "heatStatusChance": 1
        }
      }
    ]
  },
  {
    "id": "valkyr",
    "name": "Valkyr",
    "health": 650,
    "shield": 135,
    "armor": 855,
    "energy": 100,
    "sprintSpeed": 1.1,
    "description": "Valkyr hurls forth a hook and pulls herself to whatever it hits. If it hits an enemy, nearby foes are pulled in as she unleashes a coordinated Melee attack.",
    "passive": "Valkyr accumulates Rage when hitting or killing enemies with melee weapons, increasing her Melee Damage up to 300%. Taking fatal damage when the Rage meter is above 150% consumes the meter, preventing death and granting 5s of invulnerability.",
    "abilities": [
      {
        "name": "Rip Line",
        "energyCost": 25,
        "description": "Valkyr hurls forth a hook and pulls herself to whatever it hits. If it hits an enemy, nearby foes are pulled in as she unleashes a coordinated Melee attack.",
        "damage": 600,
        "range": 75,
        "duration": 1,
        "castTime": 0.4,
        "damageType": "Slash",
        "miscStats": {
          "pullRadius": 9,
          "terrainPullSpeed": 35,
          "enemyPullSpeed": 150,
          "cooldown": 0.4
        }
      },
      {
        "name": "Warcry",
        "energyCost": 75,
        "description": "Valkyr lets out a rallying cry that bolsters Armor and Attack Speed for allies while in Affinity Range.",
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "attackSpeedBuff": 0.5,
          "armorBuff": 0.5
        }
      },
      {
        "name": "Paralysis",
        "energyCost": 25,
        "description": "Unleash a damaging blast, slowing its victims while increasing their Melee Damage Vulnerability.",
        "damage": 400,
        "range": 10,
        "duration": 15,
        "castTime": 0.3,
        "damageType": "Impact",
        "miscStats": {
          "slowPercent": 0.3,
          "meleeDamageVulnerability": 0.5,
          "slowCap": 0.75
        }
      },
      {
        "name": "Hysteria",
        "energyCost": 25,
        "description": "Valkyr bares her deadly claws, unleashing devastating attacks that also heal her. Valkyr becomes immune to Status Effects and her Armor bonus from Warcry is multiplied while using the claws.",
        "damage": 250,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 5,
          "healthPerHit": 100,
          "warcryArmorMultiplier": 3
        }
      }
    ]
  },
  {
    "id": "valkyr_prime",
    "name": "Valkyr Prime",
    "health": 650,
    "shield": 135,
    "armor": 1000,
    "energy": 175,
    "sprintSpeed": 1.1,
    "description": "Valkyr hurls forth a hook and pulls herself to whatever it hits. If it hits an enemy, nearby foes are pulled in as she unleashes a coordinated Melee attack.",
    "passive": "Valkyr accumulates Rage when hitting or killing enemies with melee weapons, increasing her Melee Damage up to 300%. Taking fatal damage when the Rage meter is above 150% consumes the meter, preventing death and granting 5s of invulnerability.",
    "abilities": [
      {
        "name": "Rip Line",
        "energyCost": 25,
        "description": "Valkyr hurls forth a hook and pulls herself to whatever it hits. If it hits an enemy, nearby foes are pulled in as she unleashes a coordinated Melee attack.",
        "damage": 600,
        "range": 75,
        "duration": 1,
        "castTime": 0.4,
        "damageType": "Slash",
        "miscStats": {
          "pullRadius": 9,
          "terrainPullSpeed": 35,
          "enemyPullSpeed": 150,
          "cooldown": 0.4
        }
      },
      {
        "name": "Warcry",
        "energyCost": 75,
        "description": "Valkyr lets out a rallying cry that bolsters Armor and Attack Speed for allies while in Affinity Range.",
        "duration": 20,
        "castTime": 0.5,
        "miscStats": {
          "attackSpeedBuff": 0.5,
          "armorBuff": 0.5
        }
      },
      {
        "name": "Paralysis",
        "energyCost": 25,
        "description": "Unleash a damaging blast, slowing its victims while increasing their Melee Damage Vulnerability.",
        "damage": 400,
        "range": 10,
        "duration": 15,
        "castTime": 0.3,
        "damageType": "Impact",
        "miscStats": {
          "slowPercent": 0.3,
          "meleeDamageVulnerability": 0.5,
          "slowCap": 0.75
        }
      },
      {
        "name": "Hysteria",
        "energyCost": 25,
        "description": "Valkyr bares her deadly claws, unleashing devastating attacks that also heal her. Valkyr becomes immune to Status Effects and her Armor bonus from Warcry is multiplied while using the claws.",
        "damage": 250,
        "castTime": 0.8,
        "damageType": "Slash",
        "miscStats": {
          "energyDrain": 5,
          "healthPerHit": 100,
          "warcryArmorMultiplier": 3
        }
      }
    ]
  },
  {
    "id": "vauban",
    "name": "Vauban",
    "health": 270,
    "shield": 180,
    "armor": 160,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Deploy a roller drone that attaches itself to enemies and delivers bursts of arcing electricity to anything in the immediate area.",
    "passive": "Deal 25% Extra Damage to incapacitated enemies.",
    "abilities": [
      {
        "name": "Tesla Nervos",
        "energyCost": 25,
        "description": "Deploy a roller drone that attaches itself to enemies and delivers bursts of arcing Electricity Damage to anything in the immediate area.",
        "damage": 150,
        "damagePerSecond": 25,
        "range": 6,
        "castTime": 0.4,
        "damageType": "Electricity",
        "miscStats": {
          "charges": 10,
          "statusChance": 0.5,
          "dischargeInterval": 1,
          "maxDrones": 4,
          "capsuleDamage": 15
        }
      },
      {
        "name": "Minelayer",
        "energyCost": 25,
        "description": "Control the battlefield with masterful mines. Vauban's Tether-Flechette orb immobilizes and draws in enemies while launching deadly nails in all directions. HOLD to launch a Vector-Overdrive pad that accelerates foes and allies alike, increasing ally Movement Speed and Weapon Damage.",
        "damage": 250,
        "range": 20,
        "duration": 25,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "flechetteDamage": 300,
          "tetherMaxTargets": 2,
          "flechetteTargetRadius": 10,
          "maxOrbs": 4,
          "vectorSpeed": 25,
          "moveSpeedBuff": 0.25,
          "weaponDamageBonus": 0.25,
          "maxPads": 4
        }
      },
      {
        "name": "Photon Strike",
        "energyCost": 50,
        "description": "Drop a targeting beacon that calls in a devastating laser artillery strike. Deals doubled damage to enemies with Overguard.",
        "damage": 2500,
        "range": 7,
        "castTime": 0.6,
        "damageType": "Blast",
        "miscStats": {
          "overguardDamageMultiplier": 2,
          "strikeDelay": 1.5,
          "capsuleDamage": 15
        }
      },
      {
        "name": "Bastille",
        "energyCost": 100,
        "description": "Erect a containment field to capture enemies and suspend them in stasis, stripping their armor and granting it to Vauban and any allies within Bastille's field. HOLD to collapse all Bastilles into a single damaging vortex.",
        "range": 10,
        "duration": 15,
        "castTime": 0.8,
        "miscStats": {
          "armorStripPerSecond": 0.1,
          "armorBuffRate": 20,
          "armorBuffDuration": 10,
          "armorCap": 1500,
          "vortexDamagePerSecond": 50,
          "vortexDuration": 15,
          "vortexStatusChance": 0.4,
          "maxBastilles": 4,
          "maxVortices": 4,
          "capsuleDamage": 15
        }
      }
    ]
  },
  {
    "id": "vauban_prime",
    "name": "Vauban Prime",
    "health": 270,
    "shield": 270,
    "armor": 210,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Deploy a roller drone that attaches itself to enemies and delivers bursts of arcing electricity to anything in the immediate area.",
    "passive": "Deal 25% Extra Damage to incapacitated enemies.",
    "abilities": [
      {
        "name": "Tesla Nervos",
        "energyCost": 25,
        "description": "Deploy a roller drone that attaches itself to enemies and delivers bursts of arcing Electricity Damage to anything in the immediate area.",
        "damage": 150,
        "damagePerSecond": 25,
        "range": 6,
        "castTime": 0.4,
        "damageType": "Electricity",
        "miscStats": {
          "charges": 10,
          "statusChance": 0.5,
          "dischargeInterval": 1,
          "maxDrones": 4,
          "capsuleDamage": 15
        }
      },
      {
        "name": "Minelayer",
        "energyCost": 25,
        "description": "Control the battlefield with masterful mines. Vauban's Tether-Flechette orb immobilizes and draws in enemies while launching deadly nails in all directions. HOLD to launch a Vector-Overdrive pad that accelerates foes and allies alike, increasing ally Movement Speed and Weapon Damage.",
        "damage": 250,
        "range": 20,
        "duration": 25,
        "castTime": 0.5,
        "damageType": "Slash",
        "miscStats": {
          "flechetteDamage": 300,
          "tetherMaxTargets": 2,
          "flechetteTargetRadius": 10,
          "maxOrbs": 4,
          "vectorSpeed": 25,
          "moveSpeedBuff": 0.25,
          "weaponDamageBonus": 0.25,
          "maxPads": 4
        }
      },
      {
        "name": "Photon Strike",
        "energyCost": 50,
        "description": "Drop a targeting beacon that calls in a devastating laser artillery strike. Deals doubled damage to enemies with Overguard.",
        "damage": 2500,
        "range": 7,
        "castTime": 0.6,
        "damageType": "Blast",
        "miscStats": {
          "overguardDamageMultiplier": 2,
          "strikeDelay": 1.5,
          "capsuleDamage": 15
        }
      },
      {
        "name": "Bastille",
        "energyCost": 100,
        "description": "Erect a containment field to capture enemies and suspend them in stasis, stripping their armor and granting it to Vauban and any allies within Bastille's field. HOLD to collapse all Bastilles into a single damaging vortex.",
        "range": 10,
        "duration": 15,
        "castTime": 0.8,
        "miscStats": {
          "armorStripPerSecond": 0.1,
          "armorBuffRate": 20,
          "armorBuffDuration": 10,
          "armorCap": 1500,
          "vortexDamagePerSecond": 50,
          "vortexDuration": 15,
          "vortexStatusChance": 0.4,
          "maxBastilles": 4,
          "maxVortices": 4,
          "capsuleDamage": 15
        }
      }
    ]
  },
  {
    "id": "voidrig",
    "name": "Voidrig",
    "health": 1400,
    "shield": 850,
    "armor": 385,
    "energy": 175,
    "sprintSpeed": 1,
    "description": "Hurl a canister of graviton fluids to create a wide mire that will significantly slow enemies traveling across it. Alternatively, the canister can be shot in mid-air to create a...",
    "passive": "",
        "abilities": [
      {
        "name": "Necraweb",
        "energyCost": 25,
        "description": "Hurl a canister of graviton fluids to create a wide mire that will significantly slow enemies traveling across it. Alternatively, the canister can be shot in mid-air to create a fiery conflagration.",
        "damage": 2000,
        "range": 20,
        "duration": 20,
        "radius": 25,
        "castTime": 0.5,
        "damageType": "Blast",
        "miscStats": {
          "slow": 0.5
        }
      },
      {
        "name": "Storm Shroud",
        "energyCost": 50,
        "description": "Swathe the Necramech in a powerful electrical field that greatly enhances survivability in close combat. Enemies that strike the shroud will suffer for their impudence.",
        "castTime": 0.5,
        "miscStats": {
          "shroudHealth": 1200,
          "absorptionMultiplier": 2,
          "reflectChance": 1,
          "invulnerabilityDuration": 3
        }
      },
      {
        "name": "Gravemines",
        "energyCost": 75,
        "description": "Launch a pattern of charged mines all around you. Each mine detonates in a violent blast when touched, damaging enemies in a three-meter radius.",
        "damage": 200,
        "range": 8,
        "castTime": 0.6,
        "damageType": "Heat",
        "miscStats": {
          "charges": 24,
          "explosionRadius": 3,
          "selfDetonationTime": 2.5
        }
      },
      {
        "name": "Guard Mode",
        "energyCost": 50,
        "description": "Take a stationary stance to deploy maximum firepower and gain increased structural integrity for a time.",
        "damage": 500,
        "castTime": 0.8,
        "damageType": "Blast",
        "miscStats": {
          "energyDrain": 5
        }
      }
    ]
  },
  {
    "id": "volt",
    "name": "Volt",
    "health": 270,
    "shield": 455,
    "armor": 105,
    "energy": 100,
    "sprintSpeed": 1,
    "description": "Launch a voltaic projectile that stuns and damages its target. A chain of electricity extends from the target to shock nearby enemies.",
    "passive": "Grounded movement generates an electrical charge building up 10 Damage per meter that is unleashed with the next attack.",
    "abilities": [
      {
        "name": "Shock",
        "energyCost": 15,
        "description": "Launch a voltaic projectile that stuns and damages its target. A chain of electricity extends from the target to shock nearby enemies.",
        "damage": 200,
        "range": 15,
        "castTime": 0.4,
        "damageType": "Electricity",
        "chainLinks": 5,
        "chainRange": 15
      },
      {
        "name": "Speed",
        "energyCost": 25,
        "description": "Embody an electric current. Volt and his allies receive a brief movement speed boost and a reload speed buff.",
        "range": 25,
        "duration": 12,
        "castTime": 0.5,
        "miscStats": {
          "speedBuff": 0.75,
          "reloadBuff": 0.25,
          "allySpeedCap": 1.5
        }
      },
      {
        "name": "Electric Shield",
        "energyCost": 50,
        "description": "Volt deploys an electric shield that blocks enemy fire and adds Electricity Damage to projectiles. HOLD to equip the shield for mobile cover.",
        "duration": 25,
        "castTime": 0.4,
        "miscStats": {
          "electricDamageBonus": 0.5,
          "critDamageBonus": 1,
          "shieldLimit": 6
        }
      },
      {
        "name": "Discharge",
        "energyCost": 100,
        "description": "Volt discharges the electricity that courses through him. The shockwave paralyzes and damages nearby enemies. Enemies on the edge of the shockwave are stunned.",
        "damage": 1200,
        "range": 20,
        "duration": 6,
        "radius": 8,
        "castTime": 0.8,
        "damageType": "Electricity",
        "miscStats": {
          "pulseDuration": 4,
          "damageDelay": 4.5
        }
      }
    ]
  },
  {
    "id": "volt_prime",
    "name": "Volt Prime",
    "health": 270,
    "shield": 455,
    "armor": 135,
    "energy": 200,
    "sprintSpeed": 1,
    "description": "Launch a voltaic projectile that stuns and damages its target. A chain of electricity extends from the target to shock nearby enemies.",
    "passive": "Grounded movement generates an electrical charge building up 10 Damage per meter that is unleashed with the next attack.",
    "abilities": [
      {
        "name": "Shock",
        "energyCost": 15,
        "description": "Launch a voltaic projectile that stuns and damages its target. A chain of electricity extends from the target to shock nearby enemies.",
        "damage": 200,
        "range": 15,
        "castTime": 0.4,
        "damageType": "Electricity",
        "chainLinks": 5,
        "chainRange": 15
      },
      {
        "name": "Speed",
        "energyCost": 25,
        "description": "Embody an electric current. Volt and his allies receive a brief movement speed boost and a reload speed buff.",
        "range": 25,
        "duration": 12,
        "castTime": 0.5,
        "miscStats": {
          "speedBuff": 0.75,
          "reloadBuff": 0.25,
          "allySpeedCap": 1.5
        }
      },
      {
        "name": "Electric Shield",
        "energyCost": 50,
        "description": "Volt deploys an electric shield that blocks enemy fire and adds Electricity Damage to projectiles. HOLD to equip the shield for mobile cover.",
        "duration": 25,
        "castTime": 0.4,
        "miscStats": {
          "electricDamageBonus": 0.5,
          "critDamageBonus": 1,
          "shieldLimit": 6
        }
      },
      {
        "name": "Discharge",
        "energyCost": 100,
        "description": "Volt discharges the electricity that courses through him. The shockwave paralyzes and damages nearby enemies. Enemies on the edge of the shockwave are stunned.",
        "damage": 1200,
        "range": 20,
        "duration": 6,
        "radius": 8,
        "castTime": 0.8,
        "damageType": "Electricity",
        "miscStats": {
          "pulseDuration": 4,
          "damageDelay": 4.5
        }
      }
    ]
  },
  {
    "id": "voruna",
    "name": "Voruna",
    "health": 455,
    "shield": 270,
    "armor": 200,
    "energy": 100,
    "sprintSpeed": 0.94999999,
    "description": "(TAP) Dynar shrouds Voruna with invisibility and accelerates her speed. Invisibility ends when Voruna attacks. For a short time after invisibility ends, melee attacks have incre...",
    "passive": "Voruna never fights alone. In mission, hold Abilities to call upon each wolf\u2019s unique Passive power.",
    "abilities": [
      {
        "name": "Shroud Of Dynar",
        "energyCost": 25,
        "description": "(TAP) Dynar shrouds Voruna with invisibility and accelerates her speed. Invisibility ends when Voruna attacks. For a short time after invisibility ends, melee attacks have increased Critical Damage, Status Chance, Critical Chance and inflict Slash Status Effects. Melee kill an enemy during this time to extend the melee buff once per cast.(HOLD) Dynar guards Voruna, increasing her Parkour Velocity.",
        "duration": 14,
        "miscStats": {
          "speedBuff": 1,
          "meleeBuffDuration": 3,
          "durationExtension": 5,
          "criticalChanceBonus": 1,
          "statusChance": 1,
          "critDamageBonus": 2,
          "parkourVelocity": 0.5
        }
      },
      {
        "name": "Fangs Of Raksh",
        "energyCost": 50,
        "description": "(TAP) Raksh's fangs tear into your enemies. 5 random Status Effects are applied at 10 Stacks each on an enemy. On target's death, spread the Status Effects to other nearby enemies.(HOLD) Raksh guards Voruna with Status Effect resistance.",
        "damage": 250,
        "range": 30,
        "radius": 7,
        "damageType": "Slash",
        "miscStats": {
          "statusTypes": 5,
          "statusStacks": 10
        }
      },
      {
        "name": "Lycath's Hunt",
        "energyCost": 75,
        "description": "(TAP) Lycath hunts to sustain the pack. Enemies killed by melee attacks drop health orbs and enemies killed by headshots drop energy orbs. Increase the duration of Lycath's hunt by killing enemies affected by 5 or more Status Effects.(HOLD) Lycath guards Voruna with increased Heavy Attack efficiency.",
        "duration": 20,
        "miscStats": {
          "healthOrbChance": 1,
          "energyOrbChance": 1,
          "durationExtension": 5,
          "maxDuration": 60,
          "heavyAttackEfficiency": 1
        }
      },
      {
        "name": "Ulfrun's Descent",
        "energyCost": 100,
        "description": "(TAP) Voruna drops to all fours and prepares 5 brutal charges that lock onto enemies. Ulfrun, the most powerful wolf, leads the attack as Voruna dashes toward her target. The pack deals increased damage to targets and nearby enemies that are inflicted by Status Effects. Lethal attacks double the damage of Voruna's remaining charges.(HOLD) Ulfrun guards Voruna. If Voruna falls during this time, Ulfrun dies in her place.",
        "damage": 5000,
        "damagePerSecond": 1000,
        "duration": 4,
        "range": 30,
        "radius": 10,
        "damageType": "Slash",
        "miscStats": {
          "charges": 5,
          "speedBuff": 0.5,
          "killDamageBonus": 2,
          "critChancePerKill": 0.05,
          "critDamagePerKill": 0.1,
          "statusDamageBonus": 1
        }
      }
    ]
  },
  {
    "id": "voruna_prime",
    "name": "Voruna Prime",
    "health": 455,
    "shield": 270,
    "armor": 265,
    "energy": 130,
    "sprintSpeed": 1.2,
    "description": "Splendor and ferocity reach their savage apex in Voruna Prime. Though exalted by Orokin gold, she is more feral than ever.",
    "passive": "Voruna never fights alone. In mission, hold Abilities to call upon each wolf\u2019s unique Passive power.",
    "abilities": [
      {
        "name": "Shroud Of Dynar",
        "energyCost": 25,
        "description": "(TAP) Dynar shrouds Voruna with invisibility and accelerates her speed. Invisibility ends when Voruna attacks. For a short time after invisibility ends, melee attacks have increased Critical Damage, Status Chance, Critical Chance and inflict Slash Status Effects. Melee kill an enemy during this time to extend the melee buff once per cast.(HOLD) Dynar guards Voruna, increasing her Parkour Velocity.",
        "duration": 14,
        "miscStats": {
          "speedBuff": 1,
          "meleeBuffDuration": 3,
          "durationExtension": 5,
          "criticalChanceBonus": 1,
          "statusChance": 1,
          "critDamageBonus": 2,
          "parkourVelocity": 0.5
        }
      },
      {
        "name": "Fangs Of Raksh",
        "energyCost": 50,
        "description": "(TAP) Raksh's fangs tear into your enemies. 5 random Status Effects are applied at 10 Stacks each on an enemy. On target's death, spread the Status Effects to other nearby enemies.(HOLD) Raksh guards Voruna with Status Effect resistance.",
        "damage": 250,
        "range": 30,
        "radius": 7,
        "damageType": "Slash",
        "miscStats": {
          "statusTypes": 5,
          "statusStacks": 10
        }
      },
      {
        "name": "Lycath's Hunt",
        "energyCost": 75,
        "description": "(TAP) Lycath hunts to sustain the pack. Enemies killed by melee attacks drop health orbs and enemies killed by headshots drop energy orbs. Increase the duration of Lycath's hunt by killing enemies affected by 5 or more Status Effects.(HOLD) Lycath guards Voruna with increased Heavy Attack efficiency.",
        "duration": 20,
        "miscStats": {
          "healthOrbChance": 1,
          "energyOrbChance": 1,
          "durationExtension": 5,
          "maxDuration": 60,
          "heavyAttackEfficiency": 1
        }
      },
      {
        "name": "Ulfrun's Descent",
        "energyCost": 100,
        "description": "(TAP) Voruna drops to all fours and prepares 5 brutal charges that lock onto enemies. Ulfrun, the most powerful wolf, leads the attack as Voruna dashes toward her target. The pack deals increased damage to targets and nearby enemies that are inflicted by Status Effects. Lethal attacks double the damage of Voruna's remaining charges.(HOLD) Ulfrun guards Voruna. If Voruna falls during this time, Ulfrun dies in her place.",
        "damage": 5000,
        "damagePerSecond": 1000,
        "duration": 4,
        "range": 30,
        "radius": 10,
        "damageType": "Slash",
        "miscStats": {
          "charges": 5,
          "speedBuff": 0.5,
          "killDamageBonus": 2,
          "critChancePerKill": 0.05,
          "critDamagePerKill": 0.1,
          "statusDamageBonus": 1
        }
      }
    ]
  },
  {
    "id": "wisp",
    "name": "Wisp",
    "health": 270,
    "shield": 180,
    "armor": 185,
    "energy": 200,
    "sprintSpeed": 1.2,
    "description": "Choose and summon a Reservoir filled with Motes that attach to and aid Wisp and her allies. Haste Mote grants increased movement and attack speed. Vitality Mote increases maximum Health and heals over time. Shock Mote stuns nearby enemies.",
    "passive": "Flowing between dimensions, Wisp becomes invisible to enemies while in the air.",
    "abilities": [
      {
        "name": "Reservoirs",
        "energyCost": 25,
        "description": "Choose and summon a Reservoir filled with Motes that attach to and aid Wisp and her allies. Haste Mote grants increased movement and attack speed. Vitality Mote increases maximum Health and heals over time. Shock Mote stuns nearby enemies.",
        "range": 5,
        "duration": 30,
        "castTime": 0.5,
        "miscStats": {
          "maxReservoirs": 6,
          "vitalityHealth": 300,
          "vitalityHealPerSecond": 30,
          "hasteMoveSpeed": 0.2,
          "hasteAttackSpeed": 0.2,
          "hasteFireRate": 0.3,
          "shockDamage": 10,
          "shockRange": 15,
          "shockTargets": 5,
          "shockCooldown": 3
        }
      },
      {
        "name": "Wil-O-Wisp",
        "energyCost": 35,
        "description": "Cast forward a spectral image of Wisp to confuse and distract enemies. Reactivate to travel to its position. Hold to have the image travel faster and teleport to its position on release.",
        "duration": 4,
        "castTime": 0.4,
        "miscStats": {
          "teleportInvulnerability": 3
        }
      },
      {
        "name": "Breach Surge",
        "energyCost": 50,
        "description": "Open a dimensional breach to overwhelm nearby enemies and cause them to release aggressive Surge sparks when damaged. Wisp may also target a Reservoir to teleport to it and double the range of the surge.",
        "range": 18,
        "duration": 16,
        "castTime": 0.6,
        "miscStats": {
          "sparkDamageMultiplier": 2,
          "radiationStatusChance": 0.2,
          "sparkSeekRange": 10,
          "sparkChanceOnHit": 0.1,
          "sparkCritMultiplier": 1.5,
          "reservoirSurgeRangeBonus": 2
        }
      },
      {
        "name": "Sol Gate",
        "energyCost": 25,
        "description": "Open a portal to the sun to irradiate enemies with a devastating beam of pure solar plasma. Hold fire to double Damage at the cost of increased energy consumption. For the duration of an attack enemies damaged by Sol Gate are increasingly more vulnerable to it.",
        "damagePerSecond": 1500,
        "range": 40,
        "castTime": 0.8,
        "damageType": "Radiation",
        "miscStats": {
          "energyDrain": 12,
          "boostedDamagePerSecond": 3000,
          "boostedEnergyDrain": 24,
          "damageRampCap": 10,
          "boostedMoveSpeedPenalty": 0.5
        }
      }
    ]
  },
  {
    "id": "wisp_prime",
    "name": "Wisp Prime",
    "health": 270,
    "shield": 270,
    "armor": 210,
    "energy": 200,
    "sprintSpeed": 1.25,
    "description": "Choose and summon a Reservoir filled with Motes that attach to and aid Wisp and her allies. Haste Mote grants increased movement and attack speed. Vitality Mote increases maximum Health and heals over time. Shock Mote stuns nearby enemies.",
    "passive": "Flowing between dimensions, Wisp becomes invisible to enemies while in the air.",
    "abilities": [
      {
        "name": "Reservoirs",
        "energyCost": 25,
        "description": "Choose and summon a Reservoir filled with Motes that attach to and aid Wisp and her allies. Haste Mote grants increased movement and attack speed. Vitality Mote increases maximum Health and heals over time. Shock Mote stuns nearby enemies.",
        "range": 5,
        "duration": 30,
        "castTime": 0.5,
        "miscStats": {
          "maxReservoirs": 6,
          "vitalityHealth": 300,
          "vitalityHealPerSecond": 30,
          "hasteMoveSpeed": 0.2,
          "hasteAttackSpeed": 0.2,
          "hasteFireRate": 0.3,
          "shockDamage": 10,
          "shockRange": 15,
          "shockTargets": 5,
          "shockCooldown": 3
        }
      },
      {
        "name": "Wil-O-Wisp",
        "energyCost": 35,
        "description": "Cast forward a spectral image of Wisp to confuse and distract enemies. Reactivate to travel to its position. Hold to have the image travel faster and teleport to its position on release.",
        "duration": 4,
        "castTime": 0.4,
        "miscStats": {
          "teleportInvulnerability": 3
        }
      },
      {
        "name": "Breach Surge",
        "energyCost": 50,
        "description": "Open a dimensional breach to overwhelm nearby enemies and cause them to release aggressive Surge sparks when damaged. Wisp may also target a Reservoir to teleport to it and double the range of the surge.",
        "range": 18,
        "duration": 16,
        "castTime": 0.6,
        "miscStats": {
          "sparkDamageMultiplier": 2,
          "radiationStatusChance": 0.2,
          "sparkSeekRange": 10,
          "sparkChanceOnHit": 0.1,
          "sparkCritMultiplier": 1.5,
          "reservoirSurgeRangeBonus": 2
        }
      },
      {
        "name": "Sol Gate",
        "energyCost": 25,
        "description": "Open a portal to the sun to irradiate enemies with a devastating beam of pure solar plasma. Hold fire to double Damage at the cost of increased energy consumption. For the duration of an attack enemies damaged by Sol Gate are increasingly more vulnerable to it.",
        "damagePerSecond": 1500,
        "range": 40,
        "castTime": 0.8,
        "damageType": "Radiation",
        "miscStats": {
          "energyDrain": 12,
          "boostedDamagePerSecond": 3000,
          "boostedEnergyDrain": 24,
          "damageRampCap": 10,
          "boostedMoveSpeedPenalty": 0.5
        }
      }
    ]
  },
  {
    "id": "wukong",
    "name": "Wukong",
    "health": 455,
    "shield": 270,
    "armor": 265,
    "energy": 130,
    "sprintSpeed": 1,
    "description": "Shedding part of himself, Wukong creates a twin to fight by his side. Attack at range and the twin will melee, pull a blade and the twin will lay down covering fire. Use again to command the twin to attack a target with increased damage.",
    "passive": "After taking fatal damage Wukong automatically uses one of his mastered survival techniques. These techniques can only be invoked three times per mission.",
    "abilities": [
      {
        "name": "Celestial Twin",
        "energyCost": 25,
        "description": "Shedding part of himself, Wukong creates a twin to fight by his side. Attack at range and the twin will melee, pull a blade and the twin will lay down covering fire. Use again to command the twin to attack a target with increased damage.",
        "castTime": 0.5,
        "miscStats": {
          "healthMultiplier": 2,
          "damageMultiplier": 0.5,
          "markDamageMultiplier": 3
        }
      },
      {
        "name": "Cloud Walker",
        "energyCost": 25,
        "description": "Evaporate into a cloud of mist and float through the battlefield, dazing any enemies encountered, while healing Wukong and his twin.",
        "range": 8,
        "duration": 2,
        "castTime": 0.4,
        "miscStats": {
          "healPerMeter": 0.01,
          "stunRadius": 8,
          "stunDuration": 2,
          "moveSpeedBonus": 3,
          "statusCleanse": true
        }
      },
      {
        "name": "Defy",
        "energyCost": 50,
        "description": "Wukong and his twin become invulnerable and defy enemies to attack. All damage is captured, stored, and dealt back in a single furious strike of Wukong's staff. Bonus Armor is then granted relative to the damage captured.",
        "damage": 500,
        "range": 12,
        "duration": 2,
        "castTime": 0.6,
        "damageType": "Impact",
        "miscStats": {
          "damageMultiplier": 7.5,
          "armorMultiplier": 1.5,
          "armorDuration": 25,
          "armorCap": 1500,
          "minArmorBonus": 100,
          "moveSpeedPenalty": 0.5,
          "statusCleanse": true
        }
      },
      {
        "name": "Primal Fury",
        "energyCost": 10,
        "description": "Summon the iron staff and unleash fury.",
        "damage": 300,
        "castTime": 0.8,
        "damageType": "Impact",
        "miscStats": {
          "energyDrain": 5,
          "rangePerCombo": 0.5
        }
      }
    ]
  },
  {
    "id": "wukong_prime",
    "name": "Wukong Prime",
    "health": 455,
    "shield": 345,
    "armor": 290,
    "energy": 145,
    "sprintSpeed": 1.05,
    "description": "Shedding part of himself, Wukong creates a twin to fight by his side. Attack at range and the twin will melee, pull a blade and the twin will lay down covering fire. Use again to command the twin to attack a target with increased damage.",
    "passive": "After taking fatal damage Wukong automatically uses one of his mastered survival techniques. These techniques can only be invoked three times per mission.",
    "abilities": [
      {
        "name": "Celestial Twin",
        "energyCost": 25,
        "description": "Shedding part of himself, Wukong creates a twin to fight by his side. Attack at range and the twin will melee, pull a blade and the twin will lay down covering fire. Use again to command the twin to attack a target with increased damage.",
        "castTime": 0.5,
        "miscStats": {
          "healthMultiplier": 2,
          "damageMultiplier": 0.5,
          "markDamageMultiplier": 3
        }
      },
      {
        "name": "Cloud Walker",
        "energyCost": 25,
        "description": "Evaporate into a cloud of mist and float through the battlefield, dazing any enemies encountered, while healing Wukong and his twin.",
        "range": 8,
        "duration": 2,
        "castTime": 0.4,
        "miscStats": {
          "healPerMeter": 0.01,
          "stunRadius": 8,
          "stunDuration": 2,
          "moveSpeedBonus": 3,
          "statusCleanse": true
        }
      },
      {
        "name": "Defy",
        "energyCost": 50,
        "description": "Wukong and his twin become invulnerable and defy enemies to attack. All damage is captured, stored, and dealt back in a single furious strike of Wukong's staff. Bonus Armor is then granted relative to the damage captured.",
        "damage": 500,
        "range": 12,
        "duration": 2,
        "castTime": 0.6,
        "damageType": "Impact",
        "miscStats": {
          "damageMultiplier": 7.5,
          "armorMultiplier": 1.5,
          "armorDuration": 25,
          "armorCap": 1500,
          "minArmorBonus": 100,
          "moveSpeedPenalty": 0.5,
          "statusCleanse": true
        }
      },
      {
        "name": "Primal Fury",
        "energyCost": 10,
        "description": "Summon the iron staff and unleash fury.",
        "damage": 300,
        "castTime": 0.8,
        "damageType": "Impact",
        "miscStats": {
          "energyDrain": 5,
          "rangePerCombo": 0.5
        }
      }
    ]
  },
  {
    "id": "xaku",
    "name": "Xaku",
    "health": 269,
    "shield": 239,
    "armor": 146,
    "energy": 160,
    "sprintSpeed": 1.02,
    "description": "Wield Void Damage for all attacks from equipped weapons when activated.",
    "passive": "25% Damage Reduction on AOE attacks and 25% chance to avoid incoming weapon damage.",
    "abilities": [
      {
        "name": "Xata's Whisper",
        "energyCost": 25,
        "description": "Wield Void Damage for all attacks from equipped weapons when activated.",
        "duration": 35,
        "castTime": 0.4,
        "miscStats": {
          "voidDamageBonus": 0.26
        }
      },
      {
        "name": "Grasp Of Lohk",
        "energyCost": 50,
        "description": "Void Tendrils steal weapons from nearby enemies to use as your own floating, auto-targeting armament. Damage output increases based on enemy level. The number of weapons grabbed also determines the damage multiplier for The Lost: Deny's Void beam.",
        "damage": 50,
        "range": 15,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Void",
        "miscStats": {
          "targetRange": 8,
          "maxTargets": 6
        }
      },
      {
        "name": "The Lost",
        "energyCost": 75,
        "description": "Cycle through a trio of lost Warframe powers. Accuse manifests a Void fissure to corrupt enemies into allies. Gaze grasps targets in Void tendrils that strip defenses. Deny annihilates with a beam of Void energy, wiping Sentient resistances.",
        "damage": 4000,
        "range": 40,
        "duration": 14,
        "castTime": 0.6,
        "damageType": "Void",
        "miscStats": {
          "accuseMaxTargets": 8,
          "accuseDuration": 16,
          "accuseRange": 11,
          "gazeDefenseStrip": 0.5,
          "gazeDuration": 14,
          "gazeCastRange": 25,
          "gazeAuraRadius": 12,
          "gazeMaxTargets": 2,
          "denyRange": 40,
          "denyDuration": 14
        }
      },
      {
        "name": "The Vast Untime",
        "energyCost": 100,
        "description": "Temporarily shed the outer pieces of Xaku in a destructive blast, then stalk the battlefield in a new, swifter skeletal form. Enemies damaged by the body shrapnel are rendered weaker to Void Damage. Xaku's other active abilities' duration is frozen in time and resumes once The Vast Untime expires.",
        "damage": 1200,
        "range": 25,
        "duration": 25,
        "castTime": 0.8,
        "damageType": "Void",
        "miscStats": {
          "slowPercent": 0.25,
          "slowCap": 0.95,
          "voidDamageVulnerability": 0.5,
          "dodgeChance": 0.75,
          "areaDamageReduction": 0.75,
          "moveSpeedBonus": 0.2
        }
      }
    ]
  },
  {
    "id": "xaku_prime",
    "name": "Xaku Prime",
    "health": 269,
    "shield": 263,
    "armor": 167,
    "energy": 181,
    "sprintSpeed": 1.0700001,
    "description": "Wield Void Damage for all attacks from equipped weapons when activated.",
    "passive": "25% Damage Reduction on AOE attacks and 25% chance to avoid incoming weapon damage.",
    "abilities": [
      {
        "name": "Xata's Whisper",
        "energyCost": 25,
        "description": "Wield Void Damage for all attacks from equipped weapons when activated.",
        "duration": 35,
        "castTime": 0.4,
        "miscStats": {
          "voidDamageBonus": 0.26
        }
      },
      {
        "name": "Grasp Of Lohk",
        "energyCost": 50,
        "description": "Void Tendrils steal weapons from nearby enemies to use as your own floating, auto-targeting armament. Damage output increases based on enemy level. The number of weapons grabbed also determines the damage multiplier for The Lost: Deny's Void beam.",
        "damage": 50,
        "range": 15,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Void",
        "miscStats": {
          "targetRange": 8,
          "maxTargets": 6
        }
      },
      {
        "name": "The Lost",
        "energyCost": 75,
        "description": "Cycle through a trio of lost Warframe powers. Accuse manifests a Void fissure to corrupt enemies into allies. Gaze grasps targets in Void tendrils that strip defenses. Deny annihilates with a beam of Void energy, wiping Sentient resistances.",
        "damage": 4000,
        "range": 40,
        "duration": 14,
        "castTime": 0.6,
        "damageType": "Void",
        "miscStats": {
          "accuseMaxTargets": 8,
          "accuseDuration": 16,
          "accuseRange": 11,
          "gazeDefenseStrip": 0.5,
          "gazeDuration": 14,
          "gazeCastRange": 25,
          "gazeAuraRadius": 12,
          "gazeMaxTargets": 2,
          "denyRange": 40,
          "denyDuration": 14
        }
      },
      {
        "name": "The Vast Untime",
        "energyCost": 100,
        "description": "Temporarily shed the outer pieces of Xaku in a destructive blast, then stalk the battlefield in a new, swifter skeletal form. Enemies damaged by the body shrapnel are rendered weaker to Void Damage. Xaku's other active abilities' duration is frozen in time and resumes once The Vast Untime expires.",
        "damage": 1200,
        "range": 25,
        "duration": 25,
        "castTime": 0.8,
        "damageType": "Void",
        "miscStats": {
          "slowPercent": 0.25,
          "slowCap": 0.95,
          "voidDamageVulnerability": 0.5,
          "dodgeChance": 0.75,
          "areaDamageReduction": 0.75,
          "moveSpeedBonus": 0.2
        }
      }
    ]
  },
  {
    "id": "yareli",
    "name": "Yareli",
    "health": 270,
    "shield": 455,
    "armor": 105,
    "energy": 200,
    "sprintSpeed": 1,
    "description": "Form five water globules that seek out enemies and expand on contact, simultaneously damaging and immobilizing their victims. Enemies hit by the globules take increased damage from all sources.",
    "passive": "Yareli gains +200% Critical Chance for Secondary weapons when she has been moving for at least 1.5s.",
    "abilities": [
      {
        "name": "Sea Snares",
        "energyCost": 25,
        "description": "Form five water globules that seek out enemies and expand on contact, simultaneously damaging and immobilizing their victims. Enemies hit by the globules take increased damage from all sources.",
        "damagePerSecond": 250,
        "range": 30,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Cold",
        "miscStats": {
          "damageGrowthPerSecond": 125,
          "damageVulnerability": 1,
          "globules": 5,
          "globuleLifetime": 20,
          "globuleTargetRadius": 10,
          "activeGlobuleCap": 15
        }
      },
      {
        "name": "Merulina",
        "energyCost": 25,
        "description": "Summon Merulina, a rideable creature of the waves, and the inspiration for K-Driving. Merulina protects Yareli by absorbing a large portion of incoming damage.",
        "castTime": 0.4,
        "miscStats": {
          "merulinaHealth": 7500,
          "damageRedirection": 0.9,
          "initialInvulnerability": 4,
          "dismountInvulnerability": 1.5
        }
      },
      {
        "name": "Aquablades",
        "energyCost": 75,
        "description": "Tear through foes with a trio of orbiting aquatic blades.",
        "damage": 750,
        "duration": 45,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "blades": 3,
          "bladeRadius": 5,
          "hitsPerInterval": 3,
          "intervalTime": 0.5,
          "attackCooldown": 0.5
        }
      },
      {
        "name": "Riptide",
        "energyCost": 100,
        "description": "Drag enemies into a crushing maelstrom and then blow them away in a watery burst. Each enemy trapped in the vortex increases the burst's damage.",
        "damage": 500,
        "range": 40,
        "duration": 10,
        "castTime": 0.8,
        "damageType": "Cold",
        "miscStats": {
          "burstDamage": 2500,
          "vortexRadius": 15,
          "explosionRadius": 15,
          "extraDamagePerEnemy": 0.5,
          "tickInterval": 0.45
        }
      }
    ]
  },
  {
    "id": "yareli_prime",
    "name": "Yareli Prime",
    "health": 270,
    "shield": 550,
    "armor": 105,
    "energy": 215,
    "sprintSpeed": 1.1,
    "description": "Form five water globules that seek out enemies and expand on contact, simultaneously damaging and immobilizing their victims. Enemies hit by the globules take increased damage from all sources.",
    "passive": "Yareli gains +200% Critical Chance for Secondary weapons when she has been moving for at least 1.5s.",
    "abilities": [
      {
        "name": "Sea Snares",
        "energyCost": 25,
        "description": "Form five water globules that seek out enemies and expand on contact, simultaneously damaging and immobilizing their victims. Enemies hit by the globules take increased damage from all sources.",
        "damagePerSecond": 250,
        "range": 30,
        "duration": 12,
        "castTime": 0.5,
        "damageType": "Cold",
        "miscStats": {
          "damageGrowthPerSecond": 125,
          "damageVulnerability": 1,
          "globules": 5,
          "globuleLifetime": 20,
          "globuleTargetRadius": 10,
          "activeGlobuleCap": 15
        }
      },
      {
        "name": "Merulina",
        "energyCost": 25,
        "description": "Summon Merulina, a rideable creature of the waves, and the inspiration for K-Driving. Merulina protects Yareli by absorbing a large portion of incoming damage.",
        "castTime": 0.4,
        "miscStats": {
          "merulinaHealth": 7500,
          "damageRedirection": 0.9,
          "initialInvulnerability": 4,
          "dismountInvulnerability": 1.5
        }
      },
      {
        "name": "Aquablades",
        "energyCost": 75,
        "description": "Tear through foes with a trio of orbiting aquatic blades.",
        "damage": 750,
        "duration": 45,
        "castTime": 0.6,
        "damageType": "Slash",
        "miscStats": {
          "blades": 3,
          "bladeRadius": 5,
          "hitsPerInterval": 3,
          "intervalTime": 0.5,
          "attackCooldown": 0.5
        }
      },
      {
        "name": "Riptide",
        "energyCost": 100,
        "description": "Drag enemies into a crushing maelstrom and then blow them away in a watery burst. Each enemy trapped in the vortex increases the burst's damage.",
        "damage": 500,
        "range": 40,
        "duration": 10,
        "castTime": 0.8,
        "damageType": "Cold",
        "miscStats": {
          "burstDamage": 2500,
          "vortexRadius": 15,
          "explosionRadius": 15,
          "extraDamagePerEnemy": 0.5,
          "tickInterval": 0.45
        }
      }
    ]
  },
  {
    "id": "zephyr",
    "name": "Zephyr",
    "health": 455,
    "shield": 455,
    "armor": 105,
    "energy": 100,
    "sprintSpeed": 1.1,
    "description": "Hold while airborne to hover Zephyr with reduced movement. From the air, tap to dash forward, or aim down to dive bomb enemies below.",
    "passive": "Zephyr moves faster and falls slower while airborne. Also gain 150% Critical Hit chance with weapons while airborne.",
    "abilities": [
      {
        "name": "Tail Wind",
        "energyCost": 25,
        "description": "Hold while airborne to hover Zephyr with reduced movement. From the air, tap to dash forward, or aim down to dive bomb enemies below.",
        "damage": 750,
        "range": 2,
        "radius": 7,
        "castTime": 0.3,
        "damageType": "Slash",
        "miscStats": {
          "diveBombDamage": 4500,
          "airSpeed": 30,
          "energyDrain": 5,
          "airborneEnergyCost": 12.5,
          "dashDuration": 1
        }
      },
      {
        "name": "Airburst",
        "energyCost": 50,
        "description": "Launch a burst of massively dense air. Hold to send enemies flying, tap to pull them toward the burst. Damage increases per enemy hit.",
        "damage": 500,
        "range": 8,
        "castTime": 0.4,
        "damageType": "Slash",
        "miscStats": {
          "statusChance": 0.5,
          "travelDistance": 100,
          "damageGrowthPerEnemy": 0.35,
          "pullForceDuration": 2,
          "airborneEnergyCost": 25
        }
      },
      {
        "name": "Turbulence",
        "energyCost": 75,
        "description": "Creates a wind shield around Zephyr, redirecting all incoming projectiles.",
        "range": 6,
        "duration": 20,
        "castTime": 0.5
      },
      {
        "name": "Tornado",
        "energyCost": 100,
        "description": "Create deadly tornadoes that seek out and engulf enemies. Tornadoes deal the elemental Damage Type they absorb the most. Shoot engulfed enemies to inflict extra damage. Hold for stationary tornadoes.",
        "damagePerSecond": 640,
        "range": 25,
        "duration": 20,
        "castTime": 0.8,
        "damageType": "Impact",
        "miscStats": {
          "tickDamage": 160,
          "tickInterval": 0.25,
          "tornadoCount": 3,
          "pullRadius": 10,
          "critDamageMultiplier": 2,
          "tornadoHeight": 9
        }
      }
    ]
  },
  {
    "id": "zephyr_prime",
    "name": "Zephyr Prime",
    "health": 455,
    "shield": 455,
    "armor": 135,
    "energy": 175,
    "sprintSpeed": 1.15,
    "description": "Hold while airborne to hover Zephyr with reduced movement. From the air, tap to dash forward, or aim down to dive bomb enemies below.",
    "passive": "Zephyr moves faster and falls slower while airborne. Also gain 150% Critical Hit chance with weapons while airborne.",
    "abilities": [
      {
        "name": "Tail Wind",
        "energyCost": 25,
        "description": "Hold while airborne to hover Zephyr with reduced movement. From the air, tap to dash forward, or aim down to dive bomb enemies below.",
        "damage": 750,
        "range": 2,
        "radius": 7,
        "castTime": 0.3,
        "damageType": "Slash",
        "miscStats": {
          "diveBombDamage": 4500,
          "airSpeed": 30,
          "energyDrain": 5,
          "airborneEnergyCost": 12.5,
          "dashDuration": 1
        }
      },
      {
        "name": "Airburst",
        "energyCost": 50,
        "description": "Launch a burst of massively dense air. Hold to send enemies flying, tap to pull them toward the burst. Damage increases per enemy hit.",
        "damage": 500,
        "range": 8,
        "castTime": 0.4,
        "damageType": "Slash",
        "miscStats": {
          "statusChance": 0.5,
          "travelDistance": 100,
          "damageGrowthPerEnemy": 0.35,
          "pullForceDuration": 2,
          "airborneEnergyCost": 25
        }
      },
      {
        "name": "Turbulence",
        "energyCost": 75,
        "description": "Creates a wind shield around Zephyr, redirecting all incoming projectiles.",
        "range": 6,
        "duration": 20,
        "castTime": 0.5
      },
      {
        "name": "Tornado",
        "energyCost": 100,
        "description": "Create deadly tornadoes that seek out and engulf enemies. Tornadoes deal the elemental Damage Type they absorb the most. Shoot engulfed enemies to inflict extra damage. Hold for stationary tornadoes.",
        "damagePerSecond": 640,
        "range": 25,
        "duration": 20,
        "castTime": 0.8,
        "damageType": "Impact",
        "miscStats": {
          "tickDamage": 160,
          "tickInterval": 0.25,
          "tornadoCount": 3,
          "pullRadius": 10,
          "critDamageMultiplier": 2,
          "tornadoHeight": 9
        }
      }
    ]
  }
];

export const warframesMap = new Map<string, Warframe>(allWarframes.map(w => [w.id, w]));
