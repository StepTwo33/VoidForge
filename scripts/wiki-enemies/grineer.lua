return {
 ["Aerial Commander"] = {
 General = {
 Abilities = { "Rides a Tusk Command Dargyn Skiff", "Deploy Reth Rollers" },
 Description = "A rugged career pilot, bred to survive on the Plains.",
 Faction = "Grineer",
 Image = "EidolonVipPilot.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/Vip/EidolonVipPilotAgent",
 Introduced = "22",
 Link = "Aerial Commander",
 Missions = { "Cetus Bounties" },
 Name = "Aerial Commander",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Hind", "Brokk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4,
 },
 TotalDamage = 4,
 BurstCount = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.25,
 Slash = 0.05,
 },
 TotalDamage = 150,
 StatusChance = 0,
 },
 },
 Health = 800,
 Armor = 250,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Akkalak Turret"] = {
 General = {
 Description = "Fires armor-shattering shells at a rapid rate.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "EidolonAutoTurret.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonAutoTurretAgent",
 Introduced = "22",
 Link = "Turret#Akkalak",
 Name = "Akkalak Turret",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 10,
 BurstCount = 5,
 StatusChance = 0.1
 },
 },
 Health = 1100,
 Armor = 100,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Arid Butcher"] = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Grineer",
 Image = "DesertBladeSawmanAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/BladeSawman",
 Introduced = "9.5",
 Link = "Butcher#Arid",
 Name = "Arid Butcher",
 Planets = { "Mars" },
 Scans = 20,
 TileSets = { "Grineer Settlement" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 30,
 StatusChance = 0
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Arid Eviscerator"] = {
 General = {
 Description = "Long range blade attacks",
 Faction = "Grineer",
 Image = "DesertEvisceratorLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/EvisceratorLancer",
 Introduced = "9.5",
 Link = "Eviscerator#Arid",
 Name = "Arid Eviscerator",
 Planets = { "Mars" },
 Scans = 5,
 TileSets = { "Grineer Settlement" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 45,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 Multishot = 4,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Arid Heavy Gunner"] = {
 General = {
 Description = "High damage minigun",
 Faction = "Grineer",
 Image = "DesertHeavyFemaleGrineerAvatarDesert.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/MinigunBombard",
 Introduced = "9.5",
 Link = "Heavy Gunner#Arid",
 Name = "Arid Heavy Gunner",
 Planets = { "Mars" },
 Scans = 3,
 TileSets = { "Grineer Settlement" },
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.35,
 Puncture = 0.1,
 Slash = 0.55
 },
 TotalDamage = 10,
 StatusChance = 0.01,
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 8,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Arid Hellion"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "DesertJetpackMarineAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/JetpackMarine",
 Introduced = "9.5",
 Link = "Hellion#Arid",
 Name = "Arid Hellion",
 Planets = { "Mars" },
 Scans = 5,
 TileSets = { "Grineer Settlement" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 BurstCount = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 180,
 Armor = 100,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Arid Lancer"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "DesertRifleLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/RifleLancer",
 Introduced = "9.5",
 Link = "Lancer#Arid",
 Name = "Arid Lancer",
 Planets = { "Mars" },
 Scans = 20,
 TileSets = { "Grineer Settlement" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Arid Seeker"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "DesertGrineerMarinePistolAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/GrineerMarinePistol",
 Introduced = "9.5",
 Link = "Seeker#Arid",
 Name = "Arid Seeker",
 Planets = { "Mars" },
 Scans = 5,
 TileSets = { "Grineer Settlement" },
 Type = "Ranged Support",
 Weapons = { "Viper", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.2,
 Slash = 0.2
 },
 TotalDamage = 15,
 StatusChance = 0.025,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Arid Trooper"] = {
 General = {
 Description = "Heavily armored, close range Lancer",
 Faction = "Grineer",
 Image = "DesertShotgunLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/ShotgunLancer",
 Introduced = "9.5",
 Link = "Trooper#Arid",
 Name = "Arid Trooper",
 Planets = { "Mars" },
 Scans = 10,
 TileSets = { "Grineer Settlement" },
 Type = "Ranged",
 Weapons = { "Sobek", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334
 },
 TotalDamage = 6,
 Multishot = 5,
 StatusChance = 0.1,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Artificer = {
 General = {
 CodexSecret = true,
 --Description = "?",
 Faction = "Grineer",
 Image = "GrineerArtificer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SpecialEvents/GrineerArtificer",
 Introduced = "18.4.1",
 Link = "Artificer",
 Missions = { "Operation: Shadow Debt" },
 Name = "Artificer",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Stug" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Stug AoE Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 75
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 200
 },
 },
 Health = 1500,
 Armor = 150,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Armored Roller"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "ArmoredRoller.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/KelaRollingDrone",
 Introduced = "18.10",
 Link = "Roller#Armored",
 Missions = { "Assassination", "Merrow" },
 Name = "Armored Roller",
 Planets = { "Sedna" },
 Scans = 10,
 TileSets = { "Grineer Asteroid" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 80,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 12,
 Multis = { "" },
 }
 },
 Bailiff = {
 General = {
 Abilities = { "Charge", "Seismic Shockwave" },
 Description = "Charges foes with devastating melee attacks",
 Faction = "Kuva Grineer",
 Image = "GrineerCrusher.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/GrineerCharger",
 Introduced = "17.5",
 Link = "Bailiff",
 Name = "Bailiff",
 Planets = { "Mercury", "Mars", "Saturn", "Ceres", "Sedna", "Deimos", "Lua" },
 Scans = 3,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Grineer Shipyard", "Orokin Moon" },
 Type = "Melee",
 Weapons = { "Jat Kittag" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 },
 {
 AttackName = "Charge Melee Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 StatusChance = 0.2,
 },
 },
 Health = 450,
 EximusHealth = 450,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Padded Areas: 0.5x" },
 }
 },
 Ballista = {
 General = {
 Description = "Long Ranged Sniper",
 Faction = "Grineer",
 Image = "BallistaDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/GrineerFemale",
 --Introduced = "?",
 Link = "Ballista",
 Name = "Ballista",
 Scans = 5,
 Type = "Sniper",
 Weapons = { "Vulkar", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.15,
 Slash = 0.05,
 },
 TotalDamage = 100,
 StatusChance = 0.1
 }
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Blite Captain"] = {
 General = {
 Abilities = { "Deploy Carabus Drone" },
 Description = "A Grineer Captain specializing in toxic weaponry.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "BliteCaptain.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/AdmiralPoisonAgent",
 Introduced = "27",
 Link = "Blite Captain",
 Missions = { "Empyrean" },
 Name = "Blite Captain",
 Planets = { "Earth Proxima", "Veil Proxima" },
 Scans = 3,
 TileSets = { "Grineer Galleon" },
 Type = "Melee",
 Weapons = { "Krohkur" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Toxin = 1,
 },
 TotalDamage = 60,
 StatusChance = 0.1,
 },
 },
 Health = 300,
 Armor = 750,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 Bombard = {
 General = {
 Description = "Long range missile attack",
 Faction = "Grineer",
 Image = "BombardDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/RocketBombard",
 --Introduced = "?",
 Link = "Bombard",
 Name = "Bombard",
 Scans = 3,
 Type = "Heavy Ranged",
 Weapons = { "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 4,
 Multis = { "Head: 3.0x" },
 }
 },
 Butcher = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Grineer",
 Image = "ButcherDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/BladeSawman",
 Introduced = "Vanilla",
 Link = "Butcher",
 Name = "Butcher",
 Scans = 20,
 Type = "Melee",
 Weapons = { "Cleaver" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 30,
 StatusChance = 0
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Cannon Battery (Grineer)"] = {
 General = {
 Description = "Inflicts moderate damage at a fast rate",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "Blank.png",
 InternalName = "",
 Introduced = "29.10",
 Link = "Turret#Grineer",
 Missions = { "Empyrean" },
 Name = "Cannon Battery",
 Planets = { "Earth Proxima", "Saturn Proxima", "Veil Proxima" },
 Scans = 10,
 TileSets = { "Free Space" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Health = 8000,
 Shield = 0,
 Armor = 200,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Cannon Battery (Captain Vor)"] = {
 General = {
 Description = "Inflicts moderate damage at a fast rate",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "Blank.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/VorRework/VorArenaTurret/VorArenaTurretAgent",
 Introduced = "39.0",
 Link = "Cannon Battery (Captain Vor)",
 Missions = { "Tolstoj" },
 Name = "Cannon Battery",
 Planets = { "Mercury" },
 Scans = 5,
 TileSets = { "Grineer Asteroid" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1, 
 Puncture = 0.7, 
 Slash = 0.2 
 },
 TotalDamage = 75,
 StatusChance = 0.01,
 },
 },
 Health = 250,
 Shield = 0,
 Armor = 200,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 1,
 }
 },
 ["Captain Vor"] = {
 General = {
 Abilities = { "Nervos Mine", "Teleport", "Sphere Shield" },
 Actor = "Kol Crosbie (aka [DE]Skree)",
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "VorPortrait d.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/CaptainVorBossAgent",
 Introduced = "Vanilla",
 Link = "Captain Vor",
 Missions = { "Assassination", "Tolstoj", "Exta" },
 Name = "Captain Vor",
 Planets = { "Mercury", "Ceres" },
 Scans = 3,
 TileSets = { "Grineer Asteroid", "Grineer Shipyard" },
 Type = "Boss",
 Weapons = { "Seer", "Cronus" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = { 
 Impact = 0.8, 
 Puncture = 0.1, 
 Slash = 0.1
 },
 TotalDamage = 75,
 StatusChance = 0.025,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15, 
 Puncture = 0.15, 
 Slash = 0.7 
 },
 TotalDamage = 35,
 StatusChance = 0.1,
 }
 },
 Health = 900,
 Shield = 900,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 Carabus = {
 General = {
 Abilities = { "Kamikaze" },
 CodexSecret = true,
 Description = "Charges its target and detonates when threatened",
 Faction = "Grineer",
 Image = "Carabus.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Carabus",
 Name = "Carabus",
 Scans = 5,
 Type = "",
 Weapons = { "Atomos" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 85,
 StatusChance = 0.1,
 }
 },
 Health = 750,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 5,
 Multis = { "" },
 }
 },
 Commander = {
 General = {
 Abilities = { "Switch Teleport" },
 Description = "Heavily Armored.",
 Faction = "Grineer",
 Image = "GrineerMarineLeaderAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/GrineerMarineLeader",
 --Introduced = "",
 Link = "Commander",
 Name = "Commander",
 Planets = { "Mercury", "Earth", "Mars", "Ceres", "Saturn", "Sedna", "Lua" },
 Scans = 5,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Grineer Shipyard", "Orokin Moon" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 },
 Health = 500,
 EximusHealth = 500,
 Armor = 95,
 Affinity = 500,
 BaseLevel = 3,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Vor"] = {
 -- No damage data
 General = {
 Abilities = { "Teleport", "Golden Eruption" },
 Actor = "Kol Crosbie (aka [DE]Skree)",
 Description = "I was cut in half, destroyed, but through its Janus Key, the Void called to me. It brought me here and here I was reborn\n\n-Vor",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "VorTwo.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/VorTwo/VorTwoBossAgent",
 --Introduced = "?",
 Link = "Corrupted Vor",
 Missions = { "Level ≥40 Orokin Void missions", "The Undercroft Exterminate" },
 Name = "Corrupted Vor",
 Planets = { "Void" },
 Scans = 3,
 TileSets = { "Orokin Tower", "The Undercroft" },
 Type = "Field Boss",
 Weapons = { "" },
 },
 Stats = {
 Health = 1500,
 Shield = 1500,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 40,
 --Multis = { "?" },
 }
 },
 ["Councilor Vay Hek"] = {
 General = {
 Actor = "James Atkins",
 Description = "Empowers Grineer while Disabling Tenno",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "VayHekPortrait.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/Hek/HekDroneStage1Agent",
 --Introduced = "?",
 Link = "Councilor Vay Hek",
 Missions = { "Assassination", "Oro" },
 Name = "Councilor Vay Hek",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Grineer Forest" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 2,
 StatusChance = 0.02,
 },
 },
 Health = 1800,
 Armor = 225,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 --Multis = { "?" },
 }
 },
 ["Darek Draga"] = {
 General = {
 Description = "Deploys disruptive ink clouds",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "SquidFrogLancer.png",
 InternalName = "/Lotus/Types/Enemies/Water/Grineer/SquidLancerAgent",
 Introduced = "17",
 Link = "Darek Draga",
 Name = "Darek Draga",
 Scans = 20,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Kulstar" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 100
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 100
 },
 },
 Health = 130,
 Armor = 10,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Dargyn = {
 General = {
 Description = "Inflicts moderate damage at a fast rate",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnSkiff.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Skiffs/GrineerSpaceMarine",
 --Introduced = "?",
 Link = "Dargyn",
 Missions = { "Archwing (Mission)" },
 Name = "Dargyn",
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6,
 },
 TotalDamage = 10,
 statusChance = 0,
 },
 },
 Health = 200,
 EximusHealth = 200,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Dargyn Pilot"] = {
 General = {
 Description = "Hardy and quick-thinking, as formidable outside his Dargyn as in.",
 Faction = "Grineer",
 Image = "EidolonSkiffPilot.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonSkiffPilotAgent",
 Introduced = "22",
 Link = "Dargyn Pilot",
 Name = "Dargyn Pilot",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Kraken" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.125,
 Slash = 0.125
 },
 TotalDamage = 30,
 BurstCount = 2,
 StatusChance = 0.1,
 },
 },
 Health = 120,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Demolisher Bailiff"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "DemolisherBailiff.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Disruption/DisruptionCharger",
 Introduced = "25.7",
 Link = "Bailiff#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Bailiff",
 Planets = { "Mars", "Sedna", "Kuva Fortress" },
 Scans = 3,
 TileSets = { "Grineer Settlement", "Grineer Galleon", "Grineer Asteroid Fortress" },
 Type = "Melee",
 Weapons = { "Jat Kittag" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 },
 {
 AttackName = "Charge Melee Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 StatusChance = 0.2,
 },
 },
 Health = 2000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Devourer"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Grineer",
 Image = "DemolisherDevourer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Disruption/DemoDevourerAgent",
 Introduced = "25.7",
 Link = "Ghoul Devourer#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Devourer",
 Planets = { "Mars" },
 Scans = 20,
 TileSets = { "Grineer Settlement" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 55,
 StatusChance = 0.05
 },
 },
 Health = 2500,
 Armor = 250,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Mines: 0.5x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Expired"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Grineer",
 Image = "DemolisherExpired.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Disruption/DemoExpiredAgent",
 Introduced = "25.7",
 Link = "Ghoul Expired#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Expired",
 Planets = { "Mars", "Sedna" },
 Scans = 20,
 TileSets = { "Grineer Settlement", "Grineer Galleon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 35,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage", -- confirm if its two instnace of explosion of 60 or 90, or just one instance of explosion worth 60
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 60,
 }
 },
 Health = 1500,
 Armor = 100,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Heavy Gunner"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "DemolisherHeavyGunner.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Disruption/DisruptionMinigunBombard",
 Introduced = "25.7",
 Link = "Heavy Gunner#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Heavy Gunner",
 Planets = { "Mars", "Sedna", "Kuva Fortress" },
 Scans = 3,
 TileSets = { "Grineer Settlement", "Grineer Galleon", "Grineer Asteroid Fortress" },
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1,
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 },
 },
 Health = 2000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Kuva Guardian"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Kuva Grineer",
 Image = "DemolisherKuvaGuardian.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Disruption/DisruptionRoyalGuardAgent",
 Introduced = "25.7",
 Link = "Kuva Guardian#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Kuva Guardian",
 Planets = { "Kuva Fortress" },
 Scans = 20,
 TileSets = { "Kuva Fortress" },
 Type = "",
 Weapons = { "Kesheg", "Twin Rogga" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Kesheg Melee",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7
 },
 TotalDamage = 75,
 StatusChance = 0.15,
 },
 {
 AttackName = "Twin Rogga Shot", -- no data found, observation data
 DamageDistribution = {
 Impact = 0.4375,
 Puncture = 0.25,
 Slash = 0.3125
 },
 TotalDamage = 8,
 Multishot = 5,
 Note = "Used when Kesheg is knocked off"
 },
 },
 Health = 2500,
 Armor = 150,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Nox"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "DemolisherNox.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Disruption/DisruptionNoxAgent",
 Introduced = "25.7",
 Link = "Nox#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Nox",
 Planets = { "Sedna", "Kuva Fortress" },
 Scans = 3,
 TileSets = { "Grineer Galleon", "Grineer Asteroid Fortress" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 2500,
 Armor = 250,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 ProcResists = { "Radiation" },
 }
 },
 ["Disruptor Drone"] = {
 General = {
 Description = "Boosts Grineer morale while weakening enemies.",
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "VayHekPropagandaDrone.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/Hek/PropDrones/HekPropCCDroneAgent",
 --Introduced = "?",
 Link = "Disruptor Drone",
 Missions = { "The Law of Retribution" },
 Name = "Disruptor Drone",
 Planets = { "Earth", "Ceres", "Mars" },
 Scans = 10,
 TileSets = { "Grineer Forest", "Grineer Shipyard", "Grineer Settlement" },
 Type = "Deployable Drone",
 Weapons = { "" },
 },
 Stats = {
 Health = 500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Draga = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "FrogLancer.png",
 InternalName = "/Lotus/Types/Enemies/Water/Grineer/FrogLancerNavAgent",
 Introduced = "17",
 Link = "Draga",
 Name = "Draga",
 Scans = 20,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Harpak" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage", -- verify if projectile damage and contact damage is separate or not, cause the status is on contact damage
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.75,
 Slash = 0.15
 },
 TotalDamage = 3,
 BurstCount = 3,
 StatusChance = 0.05,
 },
 },
 Health = 120,
 Armor = 10,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Drahk = {
 General = {
 Description = "Thick dermal plates adorn its hide",
 Faction = "Grineer",
 Image = "GrnArmoredKubrow.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/CombatKubrowAgent",
 --Introduced = "?",
 Link = "Drahk",
 Name = "Drahk",
 Scans = 20,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.875x" },
 }
 },
 ["Drahk Master"] = {
 General = {
 Description = "Summons Drahk to fight for it",
 Faction = "Grineer",
 Image = "GrnBeastMaster.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/BeastMaster",
 --Introduced = "?",
 Link = "Drahk Master",
 Name = "Drahk Master",
 Scans = 5,
 Type = "Support / Summoner",
 Weapons = { "Halikar" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Halikar Throw",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 12,
 Multis = { "Head: 3.0x" },
 }
 },
 Dreg = {
 General = {
 Description = "Fires slow moving projectiles that inflict moderate damage.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnDrone.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Drones/GrineerSpaceDrone",
 --Introduced = "?",
 Link = "Dreg",
 Missions = { "Archwing (Mission)" },
 Name = "Dreg",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 15,
 StatusChance = 0.03,
 },
 }, -- Missing shot damage
 Health = 100,
 EximusHealth = 100,
 Armor = 150,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Drekar Ballista"] = {
 General = {
 Description = "Long Ranged Sniper",
 Faction = "Grineer",
 Image = "SeaLabBallista.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/GrineerFemaleSniper",
 Introduced = "17",
 Link = "Ballista#Drekar",
 Name = "Drekar Ballista",
 Planets = { "Earth", "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Sealab" },
 Type = "Sniper",
 Weapons = { "Vulkar", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.15,
 Slash = 0.05
 },
 TotalDamage = 100,
 StatusChance = 0.1,
 }
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Butcher"] = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Grineer",
 Image = "SeaLabButcher.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/BladeSawman",
 Introduced = "17",
 Link = "Butcher#Drekar",
 Name = "Drekar Butcher",
 Planets = { "Earth", "Uranus" },
 Scans = 20,
 TileSets = { "Grineer Sealab" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Elite Lancer"] = {
 General = {
 Description = "High Damage",
 Faction = "Grineer",
 Image = "SeaLabEliteLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/EliteRifleLancer",
 Introduced = "17",
 Link = "Elite Lancer#Drekar",
 Name = "Drekar Elite Lancer",
 Planets = { "Earth", "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Harpak", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.75,
 Slash = 0.15
 },
 TotalDamage = 3,
 BurstCount = 3,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Eviscerator"] = {
 General = {
 Description = "Long range blade attacks",
 Faction = "Grineer",
 Image = "SeaLabEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/EvisceratorLancer",
 Introduced = "17",
 Link = "Eviscerator#Drekar",
 Name = "Drekar Eviscerator",
 Planets = { "Earth", "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 45,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 Multishot = 4,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Heavy Gunner"] = {
 General = {
 Description = "High damage minigun",
 Faction = "Grineer",
 Image = "SeaLabHeavyGunner.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/GrineerFemaleHeavy",
 Introduced = "17",
 Link = "Heavy Gunner#Drekar",
 Name = "Drekar Heavy Gunner",
 Planets = { "Earth", "Uranus" },
 Scans = 3,
 TileSets = { "Grineer Sealab" },
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 }
 },
 Health = 350,
 EximusHealth = 350,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Hellion"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "SeaLabHellion.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/JetpackMarine",
 Introduced = "17",
 Link = "Hellion#Drekar",
 Name = "Drekar Hellion",
 Planets = { "Earth", "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 BurstCount = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 180,
 EximusHealth = 180,
 Armor = 100,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Lancer"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "SeaLabLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/RifleLancer",
 Introduced = "17",
 Link = "Lancer#Drekar",
 Name = "Drekar Lancer",
 Planets = { "Earth", "Uranus" },
 Scans = 20,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Manic"] = {
 General = {
 Abilities = { "Invisibility" },
 Description = "Dashes in for quick strikes",
 Faction = "Grineer",
 Image = "SeaLabManic.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/SeaLabManicGrineer",
 Introduced = "17",
 Link = "Manic#Drekar",
 Name = "Drekar Manic",
 Planets = { "Earth", "Uranus" },
 Scans = 3,
 TileSets = { "Grineer Sealab" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 50,
 StatusChance = 0.05,
 },
 },
 Health = 450,
 Armor = 25,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Manic Bombard"] = {
 General = {
 Description = "Highly mobile heavy artillery",
 Faction = "Grineer",
 Image = "SeaLabManicBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/SeaLabManicRocketBombard",
 Introduced = "17",
 Link = "Manic Bombard#Drekar",
 Name = "Drekar Manic Bombard",
 Planets = { "Earth", "Uranus" },
 Scans = 3,
 TileSets = { "Grineer Sealab" },
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 },
 {
 AttackName = "Cluster Bomb", -- Might be outdated, data was over 5 years ago
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 Multishot = 5
 },
 },
 Health = 1750,
 Armor = 500,
 Affinity = 750,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Scorpion"] = {
 General = {
 Description = "Lethal melee unit with ranged harpoon attack",
 Faction = "Grineer",
 Image = "SeaLabScorpion.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/GrineerFemaleMachete",
 Introduced = "17",
 Link = "Scorpion#Drekar",
 Name = "Drekar Scorpion",
 Planets = { "Earth", "Uranus" },
 Scans = 10,
 TileSets = { "Grineer Sealab" },
 Type = "Melee",
 Weapons = { "Machete", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 
 },
 {
 AttackName = "Hook Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 },
 },
 Health = 350,
 EximusHealth = 350,
 Armor = 150,
 Affinity = 100,
 BaseLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Seeker"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "SeaLabHeavySeeker.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/GrineerMarinePistol",
 Introduced = "17",
 Link = "Seeker#Drekar",
 Name = "Drekar Seeker",
 Planets = { "Earth", "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged Support",
 Weapons = { "Viper", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.2,
 Slash = 0.2
 },
 TotalDamage = 12,
 BurstCount = 3,
 StatusChance = 0.06,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drekar Trooper"] = {
 General = {
 Description = "Heavily armored, close range Lancer",
 Faction = "Grineer",
 Image = "SeaLabTrooper.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SeaLab/ShotgunLancer",
 Introduced = "17",
 Link = "Trooper#Drekar",
 Name = "Drekar Trooper",
 Planets = { "Earth", "Uranus" },
 Scans = 10,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Sobek", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 6,
 Multishot = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drudge Brazer"] = {
 General = {
 Description = "Proficient with tools used for smelting.",
 Faction = "Grineer",
 Image = "DrudgeBrazer.png",
 InternalName = "Lotus/Types/Enemies/Grineer/AIWeek/GrineerWorkerB",
 Introduced = "19.4",
 Link = "Drudge#Brazer",
 Name = "Drudge Brazer",
 Scans = 10,
 TileSets = { "Grineer Shipyard", "Grineer Asteroid" },
 Type = "Melee",
 Weapons = { "Welder" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 90,
 StatusChance = 0.1,
 },
 },
 Health = 350,
 Armor = 75,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Stealth/Finisher: 16.0x", "Head: 3.0x" },
 }
 },
 ["Drudge Foreman"] = {
 General = {
 Description = "Oversees the tasks performed by other drudges.",
 Faction = "Grineer",
 Image = "DrudgeForeman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/GrineerWorker",
 Introduced = "19.4",
 Link = "Drudge#Foreman",
 Name = "Drudge Foreman",
 Scans = 10,
 TileSets = { "Grineer Shipyard", "Grineer Asteroid" },
 Type = "Melee",
 Weapons = { "Hammer" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 90,
 StatusChance = 0.1,
 },
 },
 Health = 350,
 Armor = 75,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Stealth/Finisher: 16.0x", "Head: 3.0x" },
 }
 },
 ["Drudge Scrapper"] = {
 General = {
 Description = "Proficient with tools used for grinding.",
 Faction = "Grineer",
 Image = "DrudgeScrapper.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/GrineerWorkerC",
 Introduced = "19.4",
 Link = "Drudge#Scrapper",
 Name = "Drudge Scrapper",
 Scans = 10,
 TileSets = { "Grineer Shipyard", "Grineer Asteroid" },
 Type = "Melee",
 Weapons = { "Grinder" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 90,
 StatusChance = 0.1,
 },
 },
 Health = 350,
 Armor = 75,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Stealth/Finisher: 16.0x", "Head: 3.0x" },
 }
 },
 ["Eidolon Lure"] = {
 General = {
 Description = "A Grineer device meant to lure in Vomvalysts and trap their energy.",
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "VomvalystLureDrone.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/VomvalystLure/EidolonVomLureAgent",
 Introduced = "22",
 Link = "Eidolon Lure",
 Name = "Eidolon Lure",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Drone",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Shield = 600,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "" },
 }
 },
 ["Elite Arid Lancer"] = {
 General = {
 Description = "High Damage",
 Faction = "Grineer",
 Image = "DesertEliteRifleLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Desert/EliteRifleLancer",
 Introduced = "9.5",
 Link = "Elite Arid Lancer",
 Name = "Elite Arid Lancer",
 Planets = { "Mars" },
 Scans = 5,
 TileSets = { "Grineer Settlement" },
 Type = "Ranged",
 Weapons = { "Hind", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4
 },
 TotalDamage = 6,
 BurstCount = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Elite Exo Cutter"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; outfitted with an autocannon for devastating strafing runs. Also equipped with missiles and flare countermeasures.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoCutterElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Exo Cutter",
 Missions = { "Empyrean" },
 Name = "Elite Exo Cutter",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 150,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Exo Flak"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; bombards targets with a high-damage flak cannon. Has a strong frontal shield.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoFlakElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Exo Flak",
 Missions = { "Empyrean" },
 Name = "Elite Exo Flak",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 400,
 Armor = 175,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Exo Gokstad Crewship"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoGokstadCrewship.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Exo Gokstad Crewship",
 Missions = { "Empyrean" },
 Name = "Elite Exo Gokstad Crewship",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 3000,
 Armor = 600,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 32,
 Multis = { "Engines: 5.0x", "Destroyed Engine: 0.0x", "Tail End: 0.25x" },
 }
 },
 ["Elite Exo Outrider"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Heavy Grineer assault craft; attacks with massive firepower from close range, then disengages while leaving mines behind.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoOutriderElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Exo Outrider",
 Missions = { "Empyrean" },
 Name = "Elite Exo Outrider",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Health = 1500,
 Armor = 400,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Exo Ramsled"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "Ramsled.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Exo Ramsled",
 Missions = { "Empyrean" },
 Name = "Elite Exo Ramsled",
 Planets = { "Veil Proxima" },
 --Scans = ?,
 TileSets = { "Free Space" },
 Type = "Boarding Capsule",
 Weapons = { "" },
 },
 Stats = {
 Health = -1,
 Armor = -1,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Exo Taktis"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; armed with long-ranged homing missiles that deliver an electrical charge.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoTaktisElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Exo Taktis",
 Missions = { "Empyrean" },
 Name = "Elite Exo Taktis",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 175,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Frontier Lancer"] = {
 General = {
 Description = "High Damage",
 Faction = "Grineer",
 Image = "ForestEliteLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/EliteRifleLancer",
 --Introduced = "?",
 Link = "Elite Frontier Lancer",
 Name = "Elite Frontier Lancer",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Grineer Forest" },
 Type = "Ranged",
 Weapons = { "Karak", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.45,
 Puncture = 0.30,
 Slash = 0.25
 },
 TotalDamage = 6,
 StatusChance = 0.075,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Elite Gyre Cutter"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; outfitted with an autocannon for devastating strafing runs. Also equipped with missiles and flare countermeasures.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreCutterElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Gyre Cutter",
 Missions = { "Empyrean" },
 Name = "Elite Gyre Cutter",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 150,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Elite Gyre Flak"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; bombards targets with a high-damage flak cannon. Has a strong frontal shield.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreFlakElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Gyre Flak",
 Missions = { "Empyrean" },
 Name = "Elite Gyre Flak",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 400,
 Armor = 175,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Elite Gyre Outrider"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Heavy Grineer assault craft; attacks with massive firepower from close range, then disengages while leaving mines behind.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreOutriderElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Gyre Outrider",
 Missions = { "Empyrean" },
 Name = "Elite Gyre Outrider",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Health = 1500,
 Armor = 400,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Elite Gyre Taktis"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; armed with long-ranged homing missiles that deliver an electrical charge.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreTaktisElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Gyre Taktis",
 Missions = { "Empyrean" },
 Name = "Elite Gyre Taktis",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 175,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Elite Kosma Cutter"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; outfitted with an autocannon for devastating strafing runs. Also equipped with missiles and flare countermeasures.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaCutterElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Kosma Cutter",
 Missions = { "Empyrean" },
 Name = "Elite Kosma Cutter",
 Planets = { "Earth Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 150,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Elite Kosma Flak"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; bombards targets with a high-damage flak cannon. Has a strong frontal shield.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaFlakElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Kosma Flak",
 Missions = { "Empyrean" },
 Name = "Elite Kosma Flak",
 Planets = { "Earth Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 400,
 Armor = 175,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Elite Kosma Outrider"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Heavy Grineer assault craft; attacks with massive firepower from close range, then disengages while leaving mines behind.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaOutriderElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Kosma Outrider",
 Missions = { "Empyrean" },
 Name = "Elite Kosma Outrider",
 Planets = { "Earth Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Health = 1500,
 Armor = 400,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Elite Kosma Taktis"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; armed with long-ranged homing missiles that deliver an electrical charge.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaTaktisElite.png",
 InternalName = "",
 Introduced = "27",
 Link = "Elite Kosma Taktis",
 Missions = { "Empyrean" },
 Name = "Elite Kosma Taktis",
 Planets = { "Earth Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 175,
 Affinity = 600,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Elite Lancer"] = {
 General = {
 Description = "High Damage",
 Faction = "Grineer",
 Image = "EliteRifleLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/EliteRifleLancer",
 --Introduced = "?",
 Link = "Elite Lancer",
 Name = "Elite Lancer",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Hind", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4
 },
 TotalDamage = 6,
 BurstCount = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Elite Shield Lancer"] = {
 General = {
 Description = "Carries an impenetrable shield and fires granades.",
 Faction = "Grineer",
 Image = "EliteShieldLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/EliteShieldLancer",
 Introduced = "27.2",
 Link = "Elite Shield Lancer",
 Name = "Elite Shield Lancer",
 Scans = 3,
 Type = "Ranged / Knockdown",
 Weapons = { "Tonkor", "Sheev" },
 },
 Stats = {
 Attacks = { -- missing status chance data...
 {
 AttackName = "Tonkor Shot Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 50,
 },
 {
 AttackName = "Tonkor AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 50,
 Note = "Grenade bounces twice before exploding, each bounce does radial damage."
 },
 },
 Health = 200,
 EximusHealth = 200,
 Armor = 5,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Eviscerator = {
 General = {
 Description = "Long range blade attacks",
 Faction = "Grineer",
 Image = "EliteShotgunLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/EviseratorLancer",
 Introduced = "9.3",
 Link = "Eviscerator",
 Name = "Eviscerator",
 Planets = { "Mercury", "Ceres", "Saturn", "Sedna", "Lua" },
 Scans = 5,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Grineer Shipyard", "Orokin Moon" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 45,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 Multishot = 4,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Dhurnam"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerHeavy.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionHeavyAgent",
 Introduced = "Lunaro",
 Link = "Executioner Dhurnam",
 Missions = { "Rathuum" },
 Name = "Executioner Dhurnam",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Twin Hek", "Brokk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.65,
 Slash = 0.2
 },
 TotalDamage = 25,
 Multishot = 7,
 StatusChance = 0.25,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.25,
 Slash = 0.05,
 },
 TotalDamage = 150,
 StatusChance = 0,
 },
 },
 Health = 600,
 Shield = 600,
 Armor = 300,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Dok Thul"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerHealer.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionHealerAgent",
 Introduced = "18.10",
 Link = "Executioner Dok Thul",
 Missions = { "Rathuum" },
 Name = "Executioner Dok Thul",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Hind", "Amphis" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4
 },
 TotalDamage = 10,
 BurstCount = 5,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Magnetic = 1
 },
 TotalDamage = 100,
 StatusChance = 0,
 },
 },
 Health = 600,
 Shield = 600,
 Armor = 300,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Garesh"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerCharger.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionChargerAgent",
 Introduced = "18.10",
 Link = "Executioner Garesh",
 Missions = { "Rathuum" },
 Name = "Executioner Garesh",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Twin Basolk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 125,
 },
 {
 AttackName = "Basolk Throw Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1
 },
 TotalDamage = 150,
 StatusChance = 0,
 },
 },
 Health = 350,
 Shield = 600,
 Armor = 150,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Gorth"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerTank.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionTankAgent",
 Introduced = "18.10",
 Link = "Executioner Gorth",
 Missions = { "Rathuum" },
 Name = "Executioner Gorth",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Ogris", "Ack & Brunt" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ogris Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 {
 AttackName = "Ogris AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 60,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 100,
 StatusChance = 0,
 },
 },
 Health = 500,
 Shield = 800,
 Armor = 325,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Harkonar"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerSniper.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionSniperAgent",
 Introduced = "18.10",
 Link = "Executioner Harkonar",
 Missions = { "Rathuum" },
 Name = "Executioner Harkonar",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Buzlok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15,
 },
 TotalDamage = 40,
 StatusChance = 0.15,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.05,
 Slash = 0.9
 },
 TotalDamage = 150,
 StatusChance = 0.25,
 },
 },
 Health = 200,
 Shield = 500,
 Armor = 75,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Nok"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerGrunt.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionGruntAgent",
 Introduced = "18.10",
 Link = "Executioner Nok",
 Missions = { "Rathuum" },
 Name = "Executioner Nok",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Sobek", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6,
 Corrosive = 0.25
 },
 TotalDamage = 8,
 Multishot = 5,
 StatusChance = 0.25,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.05,
 Slash = 0.9
 },
 TotalDamage = 150,
 StatusChance = 0.25,
 },
 },
 Health = 250,
 Shield = 500,
 Armor = 150,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Reth"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerEngineer.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionEngineerAgent",
 Introduced = "18.10",
 Link = "Executioner Reth",
 Missions = { "Rathuum" },
 Name = "Executioner Reth",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Drakgoon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8
 },
 TotalDamage = 20,
 Multishot = 10,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.05,
 Slash = 0.9
 },
 TotalDamage = 150,
 StatusChance = 0.25,
 },
 },
 Health = 250,
 Shield = 350,
 Armor = 75,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Vay Molta"] = {
 General = {
 Description = "Highly maneuverable combatant with devastating attacks.",
 Faction = "Grineer",
 Image = "GrineerHellion.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionJetpackAgent",
 Introduced = "18.10",
 Link = "Executioner Vay Molta",
 Missions = { "Rathuum" },
 Name = "Executioner Vay Molta",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Grakata", "Hind", "Jat Kittag" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4,
 },
 TotalDamage = 10,
 BurstCount = 5,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 75,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Spin Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 150,
 FixedDamage = true,
 },
 {
 AttackName = "Rocket Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 75,
 BurstCount = 5,
 StatusChance = 0,
 },
 {
 AttackName = "Rocket AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 110,
 StatusChance = 0,
 },
 },
 Health = 350,
 Shield = 750,
 Armor = 225,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Executioner Zura"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GrineerBeastMaster.png",
 InternalName = "/Lotus/Types/Enemies/GrineerChampions/GrineerChampionBeastmasterAgent",
 Introduced = "18.10",
 Link = "Executioner Zura",
 Missions = { "Rathuum" },
 Name = "Executioner Zura",
 Planets = { "Sedna" },
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "Ignis", "Ripkas" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ignis Damage",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 40,
 StatusChance = 0.3,
 },
 },
 Health = 250,
 Shield = 500,
 Armor = 75,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Butcher"] = {
 General = {
 Description = "Grineer shock trooper. Carries a huge blade.",
 Faction = "Grineer",
 Image = "ExoButcher.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSCrewBladeAgent",
 Introduced = "27",
 Link = "Exo Butcher",
 Missions = { "Empyrean" },
 Name = "Exo Butcher",
 Planets = { "Veil Proxima" },
 Scans = 20,
 Type = "Melee",
 Weapons = { "Machete" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Cutter"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; outfitted with an autocannon for devastating strafing runs. Also equipped with missiles and flare countermeasures.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoCutter.png",
 InternalName = "",
 Introduced = "27",
 Link = "Exo Cutter",
 Missions = { "Empyrean" },
 Name = "Exo Cutter",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Armor = 125,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Exo Elite Lancer"] = {
 General = {
 Description = "Highly-trained Lancer. Expected to assume support duties aboard crewships.",
 Faction = "Grineer",
 Image = "ExoEliteLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSCrewEliteRifleAgent",
 Introduced = "27",
 Link = "Exo Elite Lancer",
 Missions = { "Empyrean" },
 Name = "Exo Elite Lancer",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quartakk", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.37,
 Puncture = 0.29,
 Slash = 0.34
 },
 TotalDamage = 49,
 BurstCount = 4,
 StatusChance = 0.27,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 600,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Eviscerator"] = {
 General = {
 Description = "A Grineer specialist packing twin grakatas and able to drop mobile cover",
 Faction = "Grineer",
 Image = "ExoEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSCrewEvisceratorAgent",
 Introduced = "27",
 Link = "Exo Eviscerator",
 Missions = { "Empyrean" },
 Name = "Exo Eviscerator",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Twin Grakatas", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.3333,
 Slash = 0.2667
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.11,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Flak"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; bombards targets with a high-damage flak cannon. Has a strong frontal shield.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoFlak.png",
 InternalName = "",
 Introduced = "27",
 Link = "Exo Flak",
 Missions = { "Empyrean" },
 Name = "Exo Flak",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 200,
 Armor = 150,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Exo Gokstad Crewship"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Heavy-class personal transport capable of deploying a healing field for its fighter support.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoGokstadCrewship.png",
 InternalName = "",
 Introduced = "27",
 Link = "Exo Gokstad Crewship",
 Missions = { "Empyrean" },
 Name = "Exo Gokstad Crewship",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 3000,
 Armor = 300,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 32,
 Multis = { "Engines: 5.0x", "Destroyed Engine: 0.0x", "Tail End: 0.25x" },
 }
 },
 ["Exo Gokstad Officer"] = {
 General = {
 Abilities = { "Deploy Roller Sentry" },
 Description = "The commanding officer of a Gokstad crewship. Wields a Karak Wraith and has the ability to spawn Roller Sentries.",
 Faction = "Grineer",
 Image = "ExoGokstadOfficer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSCaptainHeavyAgent",
 Introduced = "27",
 Link = "Exo Gokstad Officer",
 Missions = { "Empyrean" },
 Name = "Exo Gokstad Officer",
 Planets = { "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Karak Wraith" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 StatusChance = 0.05,
 },
 },
 Health = 1000,
 Armor = 1000,
 Affinity = 500,
 BaseLevel = 8,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Gokstad Pilot"] = {
 General = {
 Description = "Helms a Gokstad crewship. She can be found on the bridge flying the ship. If the Piot is killed the crewship can be hijacked.",
 Faction = "Grineer",
 Image = "ExoGokstadPilot.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSPilotAgent",
 Introduced = "27",
 Link = "Exo Gokstad Pilot",
 Missions = { "Empyrean" },
 Name = "Exo Gokstad Pilot",
 Planets = { "Veil Proxima" },
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Stubba", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.43,
 Puncture = 0.1,
 Slash = 0.47
 },
 TotalDamage = 33,
 StatusChance = 0.13,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Outrider"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Heavy Grineer assault craft; attacks with massive firepower from close range, then disengages while leaving mines behind.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoOutrider.png",
 InternalName = "",
 Introduced = "27",
 Link = "Exo Outrider",
 Missions = { "Empyrean" },
 Name = "Exo Outrider",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Armor = 300,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Exo Raider"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party, packing a cluster missile launcher.",
 Faction = "Grineer",
 Image = "ExoRaider.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSBoardingDemoAgent",
 Introduced = "27",
 Link = "Exo Raider",
 Missions = { "Empyrean" },
 Name = "Exo Raider",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tonkor", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Tonkor Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 20,
 BurstCount = 4,
 StatusChance = 0.15,
 },
 {
 AttackName = "Tonkor AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Raider Carver"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party. Wields two melee sawblades, and is a relentless pursuer.",
 Faction = "Grineer",
 Image = "ExoRaiderCarver.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSBoardingMeleeAgent",
 Introduced = "27",
 Link = "Exo Raider Carver",
 Missions = { "Empyrean" },
 Name = "Exo Raider Carver",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Twin Carver Sawblades" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Raider Eviscerator"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party. Uses a sawblades weapon capable of firing ricocheting projectiles.",
 Faction = "Grineer",
 Image = "ExoRaiderEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSBoardingShotgunAgent",
 Introduced = "27",
 Link = "Exo Raider Eviscerator",
 Missions = { "Empyrean" },
 Name = "Exo Raider Eviscerator",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Ramsled"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "High-impact one-shot Grineer boarding capsule.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "Ramsled.png",
 InternalName = "",
 Introduced = "27",
 Link = "Exo Ramsled",
 Missions = { "Empyrean" },
 Name = "Exo Ramsled",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Boarding Capsule",
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Exo Roller Sentry"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "ExoRollerSentry.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSCaptainRollerTurretAgent",
 Introduced = "27",
 Link = "Exo Roller Sentry",
 Missions = { "Empyrean" },
 Name = "Exo Roller Sentry",
 Planets = { "Veil Proxima" },
 Scans = 20,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1875,
 Puncture = 0.1875,
 Slash = 0.625
 },
 TotalDamage = 3,
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Exo Supressor"] = {
 General = {
 Description = "Carries an experimental icethrower to slow down advancing enemies.",
 Faction = "Grineer",
 Image = "ExoSupressor.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/DeepSpace/GrnDSCrewFlameAgent",
 Introduced = "27",
 Link = "Exo Supressor",
 Missions = { "Empyrean" },
 Name = "Exo Supressor",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Supressor Icethrower", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Icethrower Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 200,
 StatusChance = 0.5,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 80,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Exo Taktis"] = {
 --Missing Railjack Ship Data?
 General = {
 Description = "Interceptor-class Grineer fighter; armed with long-ranged homing missiles that deliver an electrical charge.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "ExoTaktis.png",
 InternalName = "",
 Introduced = "27",
 Link = "Exo Taktis",
 Missions = { "Empyrean" },
 Name = "Exo Taktis",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Armor = 125,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 Flameblade = {
 General = {
 Description = "High damage enemy with teleport",
 Faction = "Grineer",
 Image = "BlowtorchSawmanAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/BlowtorchSawman",
 --Introduced = "?",
 Link = "Flameblade",
 Name = "Flameblade",
 Scans = 10,
 Type = "Melee",
 Weapons = { "Twin Basolk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 30,
 StatusDamage = 0.2,
 },
 },
 Health = 50,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Fortress Scanner"] = {
 General = {
 --Description = "?",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "FortressScanner.png",
 InternalName = "",
 Introduced = "19",
 Link = "Kuva Fortress",
 Name = "Fortress Scanner",
 Planets = { "Kuva Fortress" },
 --Scans = ?,
 TileSets = { "Grineer Asteroid Fortress" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Shield = 10,
 Armor = 75,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Frontier Bailiff"] = {
 General = {
 Abilities = { "Charge", "Seismic Shockwave" },
 Description = "Charges foes with devastating melee attacks",
 Faction = "Grineer",
 Image = "FrontierBailiff.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/GrineerCharger",
 Introduced = "38.6",
 Link = "Bailiff",
 Name = "Frontier Bailiff",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Grineer Forest" },
 Type = "Melee",
 Weapons = { "Jat Kittag" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 },
 {
 AttackName = "Charge Melee Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 StatusChance = 0.2,
 },
 },
 Health = 450,
 EximusHealth = 450,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Padded Areas: 0.5x" },
 }
 },
 ["Frontier Butcher"] = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Grineer",
 Image = "ForestButcher.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/BladeSawman",
 --Introduced = "?",
 Link = "Frontier Butcher",
 Name = "Frontier Butcher",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Grineer Forest" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Frontier Eviscerator"] = {
 General = {
 Description = "Long range blade attacks",
 Faction = "Grineer",
 Image = "ForestEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/EvisceratorLancer",
 Introduced = "11.5",
 Link = "Frontier Eviscerator",
 Name = "Frontier Eviscerator",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Grineer Forest" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 45,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 Multishot = 4,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Frontier Heavy Gunner"] = {
 General = {
 Description = "High damage minigun",
 Faction = "Grineer",
 Image = "ForestHeavyGunner.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/MinigunBombard",
 --Introduced = "?",
 Link = "Frontier Heavy Gunner",
 Name = "Frontier Heavy Gunner",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Grineer Forest" },
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.35,
 Puncture = 0.1,
 Slash = 0.55
 },
 TotalDamage = 10,
 StatusChance = 0.01,
 }
 },
 Health = 350,
 EximusHealth = 350,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Frontier Hellion"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "ForestHellion.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/JetpackMarine",
 --Introduced = "?",
 Link = "Frontier Hellion",
 Name = "Frontier Hellion",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Grineer Forest" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 BurstCount = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 180,
 EximusHealth = 180,
 Armor = 100,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Frontier Lancer"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "ForestLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/RifleLancer",
 --Introduced = "?",
 Link = "Frontier Lancer",
 Name = "Frontier Lancer",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Grineer Forest" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6,
 StatusChance = 0,
 }
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 }, 
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Frontier Regulator"] = {
 General = {
 Description = "Grants nearby Grineer units extra speed and damage",
 Faction = "Grineer",
 Image = "ForestRegulator.png",
 InternalName = "",
 Introduced = "11.5",
 Link = "Frontier Regulator",
 Name = "Frontier Regulator",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Grineer Forest" },
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Health = 1,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Frontier Seeker"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "ForestSeeker.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/GrineerMarinePistol",
 --Introduced = "?",
 Link = "Frontier Seeker",
 Name = "Frontier Seeker",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Grineer Forest" },
 Type = "Ranged Support",
 Weapons = { "Viper", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.2,
 Slash = 0.2
 },
 TotalDamage = 15,
 StatusChance = 0.025,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Frontier Trooper"] = {
 General = {
 Description = "Heavily armored, close range Lancer",
 Faction = "Grineer",
 Image = "Frontier Trooper.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Forest/ShotgunLancer",
 --Introduced = "?",
 Link = "Frontier Trooper",
 Name = "Frontier Trooper",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Grineer Forest" },
 Type = "Ranged",
 Weapons = { "Sobek", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334
 },
 TotalDamage = 6,
 Multishot = 5,
 StatusChance = 0.1,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 65,
 EximusHealth = 65,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Garv = {
 General = {
 Actor = "Gemma Laurelle",
 Description = "Wily Grineer castaway, acclaimed as squad leader by his surviving brood-mates. Capable of complex diplomatic negotiations by Grineer standards.",
 Faction = "Grineer",
 Image = "Garv.png",
 InternalName = "",
 Introduced = "29",
 Link = "Garv",
 Missions = { "Necralisk Bounty" },
 Name = "Garv",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "Ranged",
 Weapons = { "Ignis" },
 },
 Stats = {
 Health = 800,
 Armor = 1000,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["General Sargas Ruk"] = {
 General = {
 Actor = "Kol Crosbie (aka [DE]Skree)",
 Description = "Heavily armored",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "GeneralSargasRukCodex.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/SargasRuk/SargasRukBossAgent",
 Introduced = "11",
 Link = "General Sargas Ruk",
 Missions = { "Assassination", "Tethys" },
 Name = "General Sargas Ruk",
 Planets = { "Saturn" },
 Scans = 3,
 TileSets = { "Grineer Galleon" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Flamethrower Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 70,
 StatusChance = 0.1,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 1
 },
 },
 Health = 2000,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 26,
 --Multis = { "?" },
 }
 },
 ["Ghoul Auger"] = {
 General = {
 Description = "Known colloquially as the 'drill sergeant', the Augur is fast-grown into its enhancements. As with all Ghouls, no regard is given to the proper development of its higher functions.\n\nCantilevered leg augments propel the unit toward the fray at speed, while over- and undermounted extendable drill carriages magnify both reach and penetrating power.",
 Faction = "Grineer",
 Image = "GhoulDrillSergeant.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Ghouls/GhoulDrillAgent",
 Introduced = "22.8",
 Link = "Ghoul Auger",
 Missions = { "Cetus Bounty", "Disruption" },
 Name = "Ghoul Auger",
 Planets = { "Earth", "Mars" },
 Scans = 20,
 TileSets = { "Plains of Eidolon", "Grineer Settlement" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Flamethrower Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 15,
 StatusChance = 0.25,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 1,
 StatusChance = 0,
 },
 },
 Health = 400,
 Armor = 200,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ghoul Auger Alpha"] = {
 General = {
 Description = "Whether through aberrant cognition or sheer brutality one specimen always moves to the front of each pack. It is from this individual that the other units take their dead.",
 Faction = "Grineer",
 Image = "GhoulDrillSergeantVip.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Ghouls/Vip/GhoulDrillVipAgent",
 Introduced = "22.8",
 Link = "Ghoul Auger Alpha",
 Missions = { "Cetus Bounty" },
 Name = "Ghoul Auger Alpha",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Flamethrower Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 25,
 StatusChance = 0.25,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 1,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Armor = 250,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ghoul Devourer"] = {
 General = {
 Description = "Vay Hek's personal favorite, the Devourer is a maximal terror unit. Draped in shreds of the diapause bag that birthed it, this gap-mawed monstrosity barrels toward prey with furious intensity.\n\nWrist-mounted hooks are welded to elbow joints and hyperpowered by a myotechnical winch system for maximum impact-and-pull.",
 Faction = "Grineer",
 Image = "GhoulDevourer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Ghouls/GhoulDevourerAgent",
 Introduced = "22.8",
 Link = "Ghoul Devourer",
 Missions = { "Cetus Bounty", "Disruption" },
 Name = "Ghoul Devourer",
 Planets = { "Earth", "Mars" },
 Scans = 20,
 TileSets = { "Plains of Eidolon", "Grineer Settlement" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 55,
 StatusChance = 0.05,
 },
 {
 AttackName = "Hook Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25
 }
 },
 Health = 600,
 Armor = 250,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ghoul Expired"] = {
 General = {
 Description = "The Expired are Ghouls who have succumbed to malnutrition or enviromental poisoning during the early stages of development. Their backup nervous systems continue to drive them forward, however, making them ideal suicide troops.",
 Faction = "Grineer",
 Image = "GhoulExpired.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Ghouls/GhoulExpiredAgent",
 Introduced = "22.8",
 Link = "Ghoul Expired",
 Missions = { "Cetus Bounty", "Disruption" },
 Name = "Ghoul Expired",
 Planets = { "Earth", "Mars" },
 Scans = 20,
 TileSets = { "Plains of Eidolon", "Grineer Settlement" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 35,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 60
 }
 },
 Health = 300,
 Armor = 150,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ghoul Rictus"] = {
 General = {
 Actor = "Lucas Schuneman",
 Description = "So named for its terrifying leer, the Rictus (AKA 'the Sawman') lives to divide and conquer its foes - literally.",
 Faction = "Grineer",
 Image = "GhoulSawman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Ghouls/GhoulSawmanAgent",
 Introduced = "22.8",
 Link = "Ghoul Rictus",
 Missions = { "Cetus Bounty", "Disruption" },
 Name = "Ghoul Rictus",
 Planets = { "Earth", "Mars" },
 Scans = 20,
 TileSets = { "Plains of Eidolon", "Grineer Settlement" },
 Type = "Melee",
 Weapons = { "Ghoulsaw" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 40,
 Multihit = 2,
 StatusChance = 0,
 },
 {
 AttackName = "Blade Throw Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25
 }
 },
 Health = 400,
 Armor = 200,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ghoul Rictus Alpha"] = {
 General = {
 Actor = "Lucas Schuneman",
 Description = "This specimen shows evidence of advanced cognitive abilities and greater, if rudimentary, situational analysis. Cold blooded and ruthless, it is easy to see how this specimen led its pack so ably.",
 Faction = "Grineer",
 Image = "GhoulSawmanVIP.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Ghouls/Vip/GhoulSawmanVipAgent",
 Introduced = "22.8",
 Link = "Ghoul Rictus Alpha",
 Missions = { "Cetus Bounty" },
 Name = "Ghoul Rictus Alpha",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Melee",
 Weapons = { "Ghoulsaw" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 60,
 Multihit = 2,
 StatusChance = 0,
 },
 {
 AttackName = "Blade Throw Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25
 }
 },
 Health = 1200,
 Armor = 250,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ghoul Target"] = {
 General = {
 Actor = "Lucas Schuneman",
 Description = "A high value Ghoul target.",
 Faction = "Grineer",
 Image = "GhoulSawmanVIP.png",
 InternalName = "/Lotus/Types/Enemies/CaptureTargets/CaptureTargetGhoulAgent",
 Introduced = "22.8",
 Link = "Ghoul Target",
 Missions = { "Cetus Bounty", "Disruption" },
 Name = "Ghoul Target",
 Planets = { "Earth", "Mars" },
 Scans = 3,
 TileSets = { "Plains of Eidolon", "Grineer Settlement" },
 Type = "Melee",
 Weapons = { "Ghoulsaw" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 60,
 Multihit = 2,
 StatusChance = 0,
 }, 
 },
 Health = 1000,
 Armor = 60,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Glacik Commander"] = {
 General = {
 Abilities = { "Snow Globe" },
 Description = "A Grineer Captain specializing in freezing weaponry.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "GlacikCommander.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Avatars/AdmiralIceAvatar",
 Introduced = "27",
 Link = "Glacik Commander",
 Missions = { "Empyrean" },
 Name = "Glacik Commander",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Grineer Asteroid" },
 Type = "Melee",
 Weapons = { "Manticore" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 200,
 StatusChance = 0.25,
 }, 
 },
 Health = 300,
 Armor = 750,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 70,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Grineer Manic"] = {
 General = {
 Abilities = { "Invisibility" },
 Description = "Dashes in for quick strikes",
 Faction = "Grineer",
 Image = "GrineerManic.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/ManicGrineer",
 Introduced = "16",
 Link = "Grineer Manic",
 Name = "Grineer Manic",
 Scans = 3,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 },
 Health = 350,
 Armor = 25,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Grineer Power Carrier"] = {
 General = {
 Description = "Energy Transport Unit",
 Faction = "Grineer",
 Image = "PowercellLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/CarrierRifleLancer",
 Introduced = "14.5",
 Link = "Grineer Power Carrier",
 Missions = { "Excavation" },
 Name = "Grineer Power Carrier",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Grineer Forest" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 650,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Grineer Queens"] = {
 General = {
 Actor = "",
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "",
 InternalName = "",
 --Introduced = "?",
 Link = "Grineer Queens",
 Missions = { "The War Within" },
 Name = "Grineer Queens",
 Planets = { "Kuva Fortress" },
 --Scans = 0,
 Type = "",
 Weapons = {},
 },
 Stats = {
 --Health = 1,
 --Armor = 1,
 --Affinity = -1,
 --BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Grineer Target"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "GrineerCaptureTarget.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Grineer Target",
 Missions = { "Capture" },
 Name = "Grineer Target",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Grakata", "Kraken", "Miter", "Viper", "Sheev" },
 },
 Stats = {
 Health = 800,
 Armor = 60,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Grineer Warden"] = {
 General = {
 Description = "Weak to stealth takedowns",
 Faction = "Grineer",
 Image = "DEGrineerWarden.png",
 InternalName = "",
 Introduced = "13.2",
 Link = "Grineer Warden",
 Missions = { "Rescue" },
 Name = "Grineer Warden",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Gorgon" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Gorgon Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.125,
 Slash = 0.125
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 },
 {
 AttackName = "Vulkar Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.15,
 Slash = 0.05
 },
 TotalDamage = 100,
 StatusChance = 0.1
 },
 },
 Health = 600,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Stealth/Finisher: 16.0x", "Head: 3.0x" },
 }
 },
 Guardsman = {
 General = {
 Description = "Vicious melee attacks",
 Faction = "Grineer",
 Image = "GrineerProsecutor.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/GrineerMeleeStaffAgent",
 Introduced = "13",
 Link = "Guardsman",
 Name = "Guardsman",
 Scans = 10,
 TileSets = { "Grineer Shipyard" },
 Type = "Melee",
 Weapons = { "Amphis" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15
 },
 TotalDamage = 30,
 StatusChance = 0.1,
 },
 },
 Health = 150,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Butcher"] = {
 General = {
 Description = "Grineer shock trooper. Carries a huge blade.",
 Faction = "Grineer",
 Image = "GyreButcher.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnCrewBladeAgent",
 Introduced = "27",
 Link = "Gyre Butcher",
 Missions = { "Empyrean" },
 Name = "Gyre Butcher",
 Planets = { "Saturn Proxima" },
 Scans = 20,
 Type = "Melee",
 Weapons = { "Machete" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Cutter"] = {
 -- Missing damage data
 General = {
 Description = "Interceptor-class Grineer fighter; outfitted with an autocannon for devastating strafing runs. Also equipped with missiles and flare countermeasures.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreCutter.png",
 InternalName = "",
 Introduced = "27",
 Link = "Gyre Cutter",
 Missions = { "Empyrean" },
 Name = "Gyre Cutter",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Armor = 125,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Gyre Elite Lancer"] = {
 General = {
 Description = "Highly-trained Lancer. Expected to assume support duties aboard crewships.",
 Faction = "Grineer",
 Image = "GyreEliteLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnCrewEliteRifleAgent",
 Introduced = "27",
 Link = "Gyre Elite Lancer",
 Missions = { "Empyrean" },
 Name = "Gyre Elite Lancer",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quartakk", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.37,
 Puncture = 0.29,
 Slash = 0.34
 },
 TotalDamage = 49,
 BurstCount = 4,
 StatusChance = 0.27,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 600,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Eviscerator"] = {
 General = {
 Description = "A Grineer specialist packing twin grakatas and able to drop mobile cover",
 Faction = "Grineer",
 Image = "GyreEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnBoardingShotgunAgent",
 Introduced = "27",
 Link = "Gyre Eviscerator",
 Missions = { "Empyrean" },
 Name = "Gyre Eviscerator",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Twin Grakatas", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.3333,
 Slash = 0.2667
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.11,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Flak"] = {
 -- Missing damage data
 General = {
 Description = "Interceptor-class Grineer fighter; bombards targets with a high-damage flak cannon. Has a strong frontal shield.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreFlak.png",
 InternalName = "",
 Introduced = "27",
 Link = "Gyre Flak",
 Missions = { "Empyrean" },
 Name = "Gyre Flak",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 200,
 Armor = 150,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Gyre Gokstad Crewship"] = {
 -- Missing damage data
 General = {
 Description = "Heavy-class personal transport capable of deploying a healing field for its fighter support.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreGokstadCrewship.png",
 InternalName = "",
 Introduced = "27",
 Link = "Gyre Gokstad Crewship",
 Missions = { "Empyrean" },
 Name = "Gyre Gokstad Crewship",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 3000,
 Armor = 300,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 22,
 Multis = { "Engines: 5.0x", "Destroyed Engine: 0.0x", "Tail End: 0.25x" },
 }
 },
 ["Gyre Gokstad Officer"] = {
 General = {
 Abilities = { "Deploy Roller Sentry" },
 Description = "The commanding officer of a Gokstad crewship. Wields a Karak Wraith and has the ability to spawn Roller Sentries.",
 Faction = "Grineer",
 Image = "GyreGokstadOfficer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnCaptainHeavyAgent",
 Introduced = "27",
 Link = "Gyre Gokstad Officer",
 Missions = { "Empyrean" },
 Name = "Gyre Gokstad Officer",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Karak Wraith" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 StatusChance = 0.05,
 },
 },
 Health = 1000,
 Armor = 1000,
 Affinity = 500,
 BaseLevel = 8,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Gokstad Pilot"] = {
 General = {
 Description = "Helms a Gokstad crewship. She can be found on the bridge flying the ship. If the Piot is killed the crewship can be hijacked.",
 Faction = "Grineer",
 Image = "GyreGokstadPilot.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnPilotAgent",
 Introduced = "27",
 Link = "Gyre Gokstad Pilot",
 Missions = { "Empyrean" },
 Name = "Gyre Gokstad Pilot",
 Planets = { "Saturn Proxima" },
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Stubba", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.43,
 Puncture = 0.1,
 Slash = 0.47
 },
 TotalDamage = 33,
 StatusChance = 0.13,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Outrider"] = {
 -- Missing damage data
 General = {
 Description = "Heavy Grineer assault craft; attacks with massive firepower from close range, then disengages while leaving mines behind.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreOutrider.png",
 InternalName = "",
 Introduced = "27",
 Link = "Gyre Outrider",
 Missions = { "Empyrean" },
 Name = "Gyre Outrider",
 Planets = { "Saturn Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Armor = 300,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Gyre Raider"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party, packing a cluster missile launcher.",
 Faction = "Grineer",
 Image = "GyreRaider.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnBoardingDemoAgent",
 Introduced = "27",
 Link = "Gyre Raider",
 Missions = { "Empyrean" },
 Name = "Gyre Raider",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tonkor", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Tonkor Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 20,
 BurstCount = 4,
 StatusChance = 0.15,
 },
 {
 AttackName = "Tonkor AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Raider Carver"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party. Wields two melee sawblades, and is a relentless pursuer.",
 Faction = "Grineer",
 Image = "GyreRaiderCarver.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnBoardingMeleeAgent",
 Introduced = "27",
 Link = "Gyre Raider Carver",
 Missions = { "Empyrean" },
 Name = "Gyre Raider Carver",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Twin Carver Sawblades" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Raider Eviscerator"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party. Uses a sawblades weapon capable of firing ricocheting projectiles.",
 Faction = "Grineer",
 Image = "GyreRaiderEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnBoardingShotgunAgent",
 Introduced = "27",
 Link = "Gyre Raider Eviscerator",
 Missions = { "Empyrean" },
 Name = "Gyre Raider Eviscerator",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Ramsled"] = {
 -- Missing damage data
 General = {
 Description = "High-impact one-shot Grineer boarding capsule.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "Ramsled.png",
 InternalName = "",
 Introduced = "27",
 Link = "Gyre Ramsled",
 Missions = { "Empyrean" },
 Name = "Gyre Ramsled",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Boarding Capsule",
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Gyre Roller Sentry"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "GyreRollerSentry.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnCaptainRollerTurretAgent",
 Introduced = "27",
 Link = "Gyre Roller Sentry",
 Missions = { "Empyrean" },
 Name = "Gyre Roller Sentry",
 Planets = { "Saturn Proxima" },
 Scans = 20,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1875,
 Puncture = 0.1875,
 Slash = 0.625
 },
 TotalDamage = 3,
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "" },
 }
 },
 ["Gyre Supressor"] = {
 General = {
 Description = "Carries an experimental icethrower to slow down advancing enemies.",
 Faction = "Grineer",
 Image = "GyreSupressor.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Saturn/GrnSaturnCrewFlameAgent",
 Introduced = "27",
 Link = "Gyre Supressor",
 Missions = { "Empyrean" },
 Name = "Gyre Supressor",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Supressor Icethrower", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Icethrower Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 200,
 StatusChance = 0.5,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 55,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Gyre Taktis"] = {
 -- Missing Data
 General = {
 Description = "Interceptor-class Grineer fighter; armed with long-ranged homing missiles that deliver an electrical charge.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GyreTaktis.png",
 InternalName = "",
 Introduced = "27",
 Link = "Gyre Taktis",
 Missions = { "Empyrean" },
 Name = "Gyre Taktis",
 Planets = { "Saturn Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Armor = 125,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 22,
 --Multis = { "?" },
 }
 },
 ["Heavy Gunner"] = {
 General = {
 Description = "High damage minigun",
 Faction = "Grineer",
 Image = "HeavyGunnerDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/MinigunBombard",
 --Introduced = "?",
 Link = "Heavy Gunner",
 Name = "Heavy Gunner",
 Scans = 3,
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 8,
 Multis = { "Head: 3.0x" },
 }
 },
 Hellion = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "HellionDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/JetpackMarine",
 Introduced = "9.5",
 Link = "Hellion",
 Name = "Hellion",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 BurstCount = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 100,
 Armor = 100,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Hellion Dargyn"] = {
 General = {
 Description = "Missiles seek out targets and inflict high damage",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnSkiffMissile.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Skiffs/MissileSkiff",
 --Introduced = "?",
 Link = "Hellion Dargyn",
 Missions = { "Archwing (Mission)" },
 Name = "Hellion Dargyn",
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6,
 },
 TotalDamage = 10
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 150,
 StatusChance = 0.03,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 150,
 StatusChance = 0.03,
 },
 },
 Health = 200,
 EximusHealth = 200,
 Armor = 200,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Hellion Power Carrier"] = {
 General = {
 Description = "Energy Transport Unit",
 Faction = "Grineer",
 Image = "PowercellLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/CarrierJetpack",
 Introduced = "14.5",
 Link = "Hellion Power Carrier",
 Missions = { "Excavation" },
 Name = "Hellion Power Carrier",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Grakata Shot",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Lato Shot",
 DamageDistribution = {
 Impact = 0.125,
 Puncture = 0.125,
 Slash = 0.8125
 },
 TotalDamage = 3,
 StatusChance = 0,
 Note = "Used when airborne",
 },
 },
 Health = 100,
 Armor = 100,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Hyekka = {
 General = {
 Description = "Trained to hunt down the Infestation",
 Faction = "Grineer",
 Image = "CombatCatbrow.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/CombatCatbrowAgent",
 Introduced = "18.5",
 Link = "Hyekka",
 Name = "Hyekka",
 Scans = 20,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40,
 StatusChance = 0
 },
 },
 Health = 200,
 Armor = 175,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.875x" },
 }
 },
 ["Hyekka Master"] = {
 General = {
 Description = "Summons Hyekka to fight for it",
 Faction = "Grineer",
 Image = "CatMaster.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/CatMaster",
 Introduced = "18.5",
 Link = "Hyekka Master",
 Name = "Hyekka Master",
 Scans = 5,
 Type = "Heavy",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ignis Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 25,
 StatusChance = 0.3,
 },
 },
 Health = 650,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Instigator Ghoul"] = {
 General = {
 Description = "",
 ExcludeFromSimulacrum = true,
 Faction = "Grineer",
 Image = "InstigatorGhoul.png",
 InternalName = "/Lotus/Types/Enemies/CaptureTargets/CaptureTargetGrineerGhoulShip",
 Introduced = "38.5.11",
 Link = "Instigator Ghoul",
 Missions = { "Galleon of Ghouls" },
 Name = "Instigator Ghoul",
 Scans = 5,
 Type = "Heavy",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 55,
 StatusChance = 0.05,
 },
 },
 Health = 3000,
 Armor = 60,
 Affinity = 0,
 BaseLevel = 1,
 SpawnLevel = 20,
 Multis = { "Head: 2.0x" },
 }
 },
 ["Janus Captain Vor"] = {
 General = {
 Abilities = { "Nervos Mine", "Teleport", "Sphere Shield" },
 Actor = "Kol Crosbie (aka [DE]Skree)",
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "VorPortrait d.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/VorRework/CaptainVorBossReworkHardModeAgent",
 Introduced = "39",
 Link = "Janus Captain Vor",
 Missions = { "Assassination", "Tolstoj" },
 Name = "Janus Captain Vor",
 Planets = { "Mercury" },
 --Scans = ?,
 TileSets = { "Grineer Asteroid" },
 Type = "Boss",
 Weapons = { "Seer", "Cronus" },
 -- EximusDefault = false,
 SteelPathDefault = true,
 -- EmpoweredDefault = false,
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = { 
 Impact = 0.8, 
 Puncture = 0.1, 
 Slash = 0.1
 },
 TotalDamage = 25,
 Multishot = 5,
 StatusChance = 0.025,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15, 
 Puncture = 0.15, 
 Slash = 0.7 
 },
 TotalDamage = 35,
 StatusChance = 0.1,
 }
 },
 Health = 7500,
 Shield = 2750,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 375,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kavor Defector"] = {
 General = {
 Description = "Grineer defectors in search of a better, more peaceful life.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "CodexKavorDefector1.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/SyndicateAllies/ColonyRescueAllies/ColonistRescueSteelMeridianAvatarA", -- BCD
 Introduced = "19.12",
 Link = "Kavor Defector",
 Missions = { "Defection" },
 Name = "Kavor Defector",
 Planets = { "Phobos", "Saturn", "Neptune" },
 Scans = 3,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Infested Ship" },
 Type = "Ranged",
 Weapons = { "Ignis", "Grakata", "Gorgon", "Sobek" },
 },
 Stats = {
 Health = 200,
 Armor = 50,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Kela De Thaym"] = {
 General = {
 Actor = "Cassandra Wladyslava",
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "KelaDeThaym.png",
 InternalName = "",
 Introduced = "7",
 Link = "Kela De Thaym",
 Missions = { "Assassination", "Merrow" },
 Name = "Kela De Thaym",
 Planets = { "Sedna" },
 Scans = 3,
 TileSets = { "Grineer Asteroid" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Rocket Contact Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 70,
 StatusChance = 0,
 },
 {
 AttackName = "Rocket AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 75,
 StatusChance = 0,
 },
 },
 Health = 7250,
 Shield = 1400,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Butcher"] = {
 General = {
 Description = "Grineer shock trooper. Carries a huge blade.",
 Faction = "Grineer",
 Image = "KosmaButcher.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnCrewBladeAgent",
 Introduced = "27",
 Link = "Kosma Butcher",
 Missions = { "Empyrean" },
 Name = "Kosma Butcher",
 Planets = { "Earth Proxima" },
 Scans = 20,
 Type = "Melee",
 Weapons = { "Machete" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Cutter"] = {
 -- Lacking damage data
 General = {
 Description = "Interceptor-class Grineer fighter; outfitted with an autocannon for devastating strafing runs. Also equipped with missiles and flare countermeasures.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaCutter.png",
 InternalName = "",
 Introduced = "27",
 Link = "Kosma Cutter",
 Missions = { "Empyrean" },
 Name = "Kosma Cutter",
 Planets = { "Earth Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Armor = 125,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Kosma Elite Lancer"] = {
 General = {
 Description = "Highly-trained Lancer. Expected to assume support duties aboard crewships.",
 Faction = "Grineer",
 Image = "KosmaEliteLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnCrewEliteRifleAgent",
 Introduced = "27",
 Link = "Kosma Elite Lancer",
 Missions = { "Empyrean" },
 Name = "Kosma Elite Lancer",
 Planets = { "Earth Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quartakk", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.37,
 Puncture = 0.29,
 Slash = 0.34
 },
 TotalDamage = 49,
 BurstCount = 4,
 StatusChance = 0.27,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 600,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Eviscerator"] = {
 General = {
 Description = "A Grineer specialist packing twin grakatas and able to drop mobile cover",
 Faction = "Grineer",
 Image = "KosmaEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnCrewEvisceratorAgent",
 Introduced = "27",
 Link = "Kosma Eviscerator",
 Missions = { "Empyrean" },
 Name = "Kosma Eviscerator",
 Planets = { "Earth Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Twin Grakatas", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.3333,
 Slash = 0.2667
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.11,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Flak"] = {
 -- Lacking damage data
 General = {
 Description = "Interceptor-class Grineer fighter; bombards targets with a high-damage flak cannon. Has a strong frontal shield.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaFlak.png",
 InternalName = "",
 Introduced = "27",
 Link = "Kosma Flak",
 Missions = { "Empyrean" },
 Name = "Kosma Flak",
 Planets = { "Earth Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 200,
 Armor = 150,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Kosma Gokstad Crewship"] = {
 -- Lacking damage data
 General = {
 Description = "Heavy-class personal transport capable of deploying a healing field for its fighter support.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaGokstadCrewship.png",
 InternalName = "",
 Introduced = "27",
 Link = "Kosma Gokstad Crewship",
 Missions = { "Empyrean" },
 Name = "Kosma Gokstad Crewship",
 Planets = { "Earth Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 3000,
 Armor = 300,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 3,
 Multis = { "Engines: 5.0x", "Destroyed Engine: 0.0x", "Tail End: 0.25x" },
 }
 },
 ["Kosma Gokstad Officer"] = {
 General = {
 Abilities = { "Deploy Roller Sentry" },
 Description = "The commanding officer of a Gokstad crewship. Wields a Karak Wraith and has the ability to spawn Roller Sentries.",
 Faction = "Grineer",
 Image = "KosmaGokstadOfficer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnCaptainHeavyAgent",
 Introduced = "27",
 Link = "Kosma Gokstad Officer",
 Missions = { "Empyrean" },
 Name = "Kosma Gokstad Officer",
 Planets = { "Earth Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Karak Wraith" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 StatusChance = 0.05,
 },
 },
 Health = 1000,
 Armor = 1000,
 Affinity = 500,
 BaseLevel = 8,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Gokstad Pilot"] = {
 General = {
 Description = "Helms a Gokstad crewship. She can be found on the bridge flying the ship. If the Piot is killed the crewship can be hijacked.",
 Faction = "Grineer",
 Image = "KosmaGokstadPilot.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnPilotAgent",
 Introduced = "27",
 Link = "Kosma Gokstad Pilot",
 Missions = { "Empyrean" },
 Name = "Kosma Gokstad Pilot",
 Planets = { "Earth Proxima" },
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Stubba", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.43,
 Puncture = 0.1,
 Slash = 0.47
 },
 TotalDamage = 33,
 StatusChance = 0.13,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Outrider"] = {
 -- Lacking damage data
 General = {
 Description = "Heavy Grineer assault craft; attacks with massive firepower from close range, then disengages while leaving mines behind.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaOutrider.png",
 InternalName = "",
 Introduced = "27",
 Link = "Kosma Outrider",
 Missions = { "Empyrean" },
 Name = "Kosma Outrider",
 Planets = { "Earth Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Armor = 300,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Kosma Raider"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party, packing a cluster missile launcher.",
 Faction = "Grineer",
 Image = "KosmaRaider.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnBoardingDemoAgent",
 Introduced = "27",
 Link = "Kosma Raider",
 Missions = { "Empyrean" },
 Name = "Kosma Raider",
 Planets = { "Earth Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tonkor", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Tonkor Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 20,
 BurstCount = 4,
 StatusChance = 0.15,
 },
 {
 AttackName = "Tonkor AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Raider Carver"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party. Wields two melee sawblades, and is a relentless pursuer.",
 Faction = "Grineer",
 Image = "KosmaRaiderCarver.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnBoardingMeleeAgent",
 Introduced = "27",
 Link = "Kosma Raider Carver",
 Missions = { "Empyrean" },
 Name = "Kosma Raider Carver",
 Planets = { "Earth Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Twin Carver Sawblades" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Raider Eviscerator"] = {
 General = {
 Description = "Part of a Grineer Ramsled boarding party. Uses a sawblades weapon capable of firing ricocheting projectiles.",
 Faction = "Grineer",
 Image = "KosmaRaiderEviscerator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnBoardingShotgunAgent",
 Introduced = "27",
 Link = "Kosma Raider Eviscerator",
 Missions = { "Empyrean" },
 Name = "Kosma Raider Eviscerator",
 Planets = { "Earth Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Ramsled"] = {
 -- Lacking damage data
 General = {
 Description = "High-impact one-shot Grineer boarding capsule.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "Ramsled.png",
 InternalName = "",
 Introduced = "27",
 Link = "Kosma Ramsled",
 Missions = { "Empyrean" },
 Name = "Kosma Ramsled",
 Planets = { "Earth Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Boarding Capsule",
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 ["Kosma Roller Sentry"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "KosmaRoller.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnCaptainRollerTurretAgent",
 Introduced = "27",
 Link = "Kosma Roller Sentry",
 Missions = { "Empyrean" },
 Name = "Kosma Roller Sentry",
 Planets = { "Earth Proxima" },
 Scans = 20,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1875,
 Puncture = 0.1875,
 Slash = 0.625
 },
 TotalDamage = 3,
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "" },
 }
 },
 ["Kosma Supressor"] = {
 General = {
 Description = "Carries an experimental icethrower to slow down advancing enemies.",
 Faction = "Grineer",
 Image = "KosmaSupressor.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/GrnCrewFlameAgent",
 Introduced = "27",
 Link = "Kosma Supressor",
 Missions = { "Empyrean" },
 Name = "Kosma Supressor",
 Planets = { "Earth Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Supressor Icethrower", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Icethrower Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 200,
 StatusChance = 0.5,
 },
 },
 Health = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 7,
 SpawnLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kosma Taktis"] = {
 -- Lacking damage data
 General = {
 Description = "Interceptor-class Grineer fighter; armed with long-ranged homing missiles that deliver an electrical charge.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KosmaTaktis.png",
 InternalName = "",
 Introduced = "27",
 Link = "Kosma Taktis",
 Missions = { "Empyrean" },
 Name = "Kosma Taktis",
 Planets = { "Earth Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Armor = 125,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 3,
 --Multis = { "?" },
 }
 },
 Kuva = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KuvaGhost.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Kuva (Resource)",
 Missions = { "Kuva Siphon" },
 Name = "Kuva",
 Scans = 3,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 --Health = 250,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Kuva Bailiff"] = {
 General = {
 Abilities = { "Charge", "Seismic Shockwave" },
 Description = "The finest Bailiff clones are chosen to serve in the Queen's Fortress",
 Faction = "Kuva Grineer",
 Image = "KuvaBailiff.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressGrineerCharger",
 Introduced = "17.5",
 Link = "Bailiff",
 Name = "Bailiff",
 Planets = { "Kuva Fortress" },
 Scans = 3,
 TileSets = { "Grineer Asteroid Fortress" },
 Type = "Melee",
 Weapons = { "Jat Kittag" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 30,
 },
 {
 AttackName = "Charge Melee Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 StatusChance = 0.2,
 },
 },
 Health = 450,
 EximusHealth = 450,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Padded Areas: 0.5x" },
 }
 },
 ["Kuva Ballista"] = {
 General = {
 Description = "Long Ranged Sniper",
 Faction = "Kuva Grineer",
 Image = "FortressGrineerFemale.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressGrineerFemale",
 --Introduced = "?",
 Link = "Kuva Ballista",
 Name = "Kuva Ballista",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Sniper",
 Weapons = { "Vulkar", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.15,
 Slash = 0.05
 },
 TotalDamage = 100,
 StatusChance = 0.1,
 }
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Bombard"] = {
 General = {
 Description = "Long range missile attack",
 Faction = "Kuva Grineer",
 Image = "FortressRocketBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressRocketBombard",
 --Introduced = "?",
 Link = "Kuva Bombard",
 Name = "Kuva Bombard",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 3,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Heavy Ranged",
 Weapons = { "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 4,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Butcher"] = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Kuva Grineer",
 Image = "FortressBladeSawman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressBladeSawman",
 --Introduced = "?",
 Link = "Kuva Butcher",
 Name = "Kuva Butcher",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Dargyn"] = {
 General = {
 Description = "Missiles seek out targets and inflict high damage",
 ExcludedFromSimulacrum = true,
 Faction = "Kuva Grineer",
 Image = "GrnSkiffMissile.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/Avatars/FortressSkiff",
 Introduced = "19",
 Link = "Kuva Dargyn",
 Name = "Kuva Dargyn",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 10,
 StatusChance = 0,
 },
 },
 Health = 450,
 Armor = 125,
 Affinity = 200,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Kuva Drahk"] = {
 General = {
 Description = "Thick dermal plates adorn its hide",
 Faction = "Kuva Grineer",
 Image = "KuvaDrahkPH.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressCombatKubrowAgent",
 Introduced = "19",
 Link = "Kuva Drahk",
 Name = "Kuva Drahk",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.875x" },
 }
 },
 ["Kuva Drahk Master"] = {
 General = {
 Description = "Summons Drahk to fight for it",
 Faction = "Kuva Grineer",
 Image = "FortressBeastMaster.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressBeastMaster",
 Introduced = "19",
 Link = "Kuva Drahk Master",
 Name = "Kuva Drahk Master",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Support / Summoner",
 Weapons = { "Halikar" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Halikar Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1
 },
 TotalDamage = 50
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 12,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Elite Lancer"] = {
 General = {
 Description = "High Damage",
 Faction = "Kuva Grineer",
 Image = "FortressEliteRifleLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressEliteRifleLancer",
 Introduced = "19",
 Link = "Kuva Elite Lancer",
 Name = "Kuva Elite Lancer",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Grinlok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.1,
 Slash = 0.4
 },
 TotalDamage = 25,
 StatusChance = 0.35,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Eviscerator"] = {
 General = {
 Description = "Long range blade attacks",
 Faction = "Kuva Grineer",
 Image = "FortressEviseratorLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressEviseratorLancer",
 Introduced = "19",
 Link = "Kuva Eviscerator",
 Name = "Kuva Eviscerator",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 45,
 StatusChance = 0.25,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 Multishot = 4,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Flameblade"] = {
 General = {
 Description = "High damage enemy with teleport",
 Faction = "Kuva Grineer",
 Image = "FortressBlowtorchSawman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressBlowtorchSawman",
 Introduced = "19",
 Link = "Kuva Flameblade",
 Name = "Kuva Flameblade",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 10,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "Twin Basolk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Guardian"] = {
 General = {
 Description = "",
 Faction = "Kuva Grineer",
 Image = "RoyalGuard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/GrineerRoyalGuard/GrineerRoyalGuardAgent",
 Introduced = "19",
 Link = "Kuva Guardian",
 Name = "Kuva Guardian",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "Kesheg", "Twin Rogga" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Kesheg Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7
 },
 TotalDamage = 75,
 StatusChance = 0.15,
 },
 {
 AttackName = "Twin Rogga Shot", -- no data found, observation data
 DamageDistribution = {
 Impact = 0.4375,
 Puncture = 0.25,
 Slash = 0.3125
 },
 TotalDamage = 8,
 Multishot = 5,
 Note = "Used when Kesheg is knocked off"
 },
 },
 Health = 400,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Heavy Gunner"] = {
 General = {
 Description = "High damage minigun",
 Faction = "Kuva Grineer",
 Image = "FortressMinigunBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressMinigunBombard",
 --Introduced = "?",
 Link = "Kuva Heavy Gunner",
 Name = "Kuva Heavy Gunner",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 3,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Heavy Ranged",
 Weapons = { "Drakgoon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 5,
 Multishot = 10
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 8,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Hellion"] = {
 General = {
 Description = "",
 Faction = "Kuva Grineer",
 Image = "FortressJetpackMarine.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressJetpackMarine",
 --Introduced = "?",
 Link = "Kuva Hellion",
 Name = "Kuva Hellion",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 BurstCount = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Hyekka"] = {
 General = {
 Description = "Trained to hunt down the Infestation",
 Faction = "Kuva Grineer",
 Image = "KuvaHyekka.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressCombatCatbrowAgent",
 --Introduced = "?",
 Link = "Kuva Hyekka",
 Name = "Kuva Hyekka",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "Ignis", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 200,
 Armor = 175,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.875x" },
 }
 },
 ["Kuva Hyekka Master"] = {
 General = {
 Description = "Summons Hyekka to fight for it",
 Faction = "Kuva Grineer",
 Image = "FortressCatMaster.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressCatMaster",
 --Introduced = "?",
 Link = "Kuva Hyekka Master",
 Name = "Kuva Hyekka Master",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Heavy",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ignis Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 135,
 Multishot = 2,
 StatusChance = 0.25,
 },
 },
 Health = 650,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Jester"] = {
 General = {
 Description = "Small and agile, jumps onto its prey",
 Faction = "Kuva Grineer",
 Image = "Jester.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/RoyalJester/RoyalJesterAvatar",
 --Introduced = "?",
 Link = "Kuva Jester",
 Name = "Kuva Jester",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 {
 AttackName = "Latch Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 5,
 FixedDamage = true,
 },
 },
 Health = 350,
 Armor = 200,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Lancer"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Kuva Grineer",
 Image = "FortressRifleLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressRifleLancer",
 --Introduced = "?",
 Link = "Kuva Lancer",
 Name = "Kuva Lancer",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Kohm", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.8
 },
 TotalDamage = 1,
 Multishot = 8,
 StatusChance = 0.02,
 Note = "Spools up from 1 to 8 projectiles"
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Larvling"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "WolfGangster.png",
 InternalName = "/Lotus/Types/Enemies/KuvaLich/KuvaLarvlingAgent",
 --Introduced = "?",
 Link = "Kuva Larvling",
 Name = "Kuva Larvling",
 Planets = { "Earth", "Mercury", "Mars", "Ceres", "Saturn", "Uranus", "Sedna", "Lua", "Kuva Fortress" },
 Scans = 5,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Grineer Shipyard", "Orokin Moon", "Kuva Fortress" },
 Type = "Ranged",
 Weapons = { "Karak" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.45,
 Puncture = 0.30,
 Slash = 0.25
 },
 TotalDamage = 6,
 StatusChance = 0.075,
 },
 },
 Health = 800,
 Armor = 300,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Larvling (Female)"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "FortressMacheteWoman.png",
 InternalName = "/Lotus/Types/Enemies/KuvaLich/KuvaLarvlingFemaleAgent",
 --Introduced = "?",
 Link = "Kuva Larvling",
 Name = "Kuva Larvling",
 Planets = { "Earth", "Mercury", "Mars", "Ceres", "Saturn", "Uranus", "Sedna", "Lua", "Kuva Fortress" },
 Scans = 5,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Grineer Shipyard", "Orokin Moon", "Kuva Fortress" },
 Type = "Ranged",
 Weapons = { "Karak" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.45,
 Puncture = 0.30,
 Slash = 0.25
 },
 TotalDamage = 6,
 StatusChance = 0.075,
 },
 },
 Health = 800,
 Armor = 300,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Napalm"] = {
 General = {
 Description = "Creates fire hazards",
 Faction = "Kuva Grineer",
 Image = "FortressIncendiaryBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressIncendiaryBombard",
 --Introduced = "?",
 Link = "Kuva Napalm",
 Name = "Kuva Napalm",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 3,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Heavy",
 Weapons = { "Tonkor", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Napalm Shot",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 50
 },
 {
 AttackName = "Napalm AoE",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 50
 },
 },
 Health = 600,
 EximusHealth = 600,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Powerclaw"] = {
 General = {
 Description = "Slow but very powerful melee attacks",
 Faction = "Kuva Grineer",
 Image = "FortressPistonSawman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressPistonSawman",
 --Introduced = "?",
 Link = "Kuva Powerclaw",
 Name = "Kuva Powerclaw",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 10,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "Ripkas" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.1,
 Slash = 0.85
 },
 TotalDamage = 15,
 StatusChance = 0.05,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Roller"] = {
 General = {
 Description = "",
 Faction = "Kuva Grineer",
 Image = "RollingDroneAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressGrineerRollingDrone",
 --Introduced = "?",
 Link = "Kuva Roller",
 Name = "Kuva Roller",
 Planets = { "Kuva Fortress" },
 Scans = 10,
 TileSets = { "Grineer Asteroid Fortress" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 40,
 EximusHealth = 40,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 10,
 Multis = { "" },
 }
 },
 ["Kuva Scorch"] = {
 General = {
 Description = "Short-range incendiary attacks",
 Faction = "Kuva Grineer",
 Image = "FortressFlameLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressFlameLancer",
 --Introduced = "?",
 Link = "Kuva Scorch",
 Name = "Kuva Scorch",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 3,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Ignis", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ignis Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 200,
 StatusChance = 0.25,
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Scorpion"] = {
 General = {
 Description = "Lethal melee unit with ranged harpoon attack",
 Faction = "Kuva Grineer",
 Image = "FortressMacheteWoman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressMacheteWoman",
 --Introduced = "?",
 Link = "Kuva Scorpion",
 Name = "Kuva Scorpion",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 10,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Melee",
 Weapons = { "Machete" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 {
 AttackName = "Hook Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 150,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Seeker"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Kuva Grineer",
 Image = "FortressGrineerMarinePistol.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressGrineerMarinePistol",
 --Introduced = "?",
 Link = "Kuva Seeker",
 Name = "Kuva Seeker",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged Support",
 Weapons = { "Kraken", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.125,
 Slash = 0.125
 },
 TotalDamage = 45,
 BurstCount = 2,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Shield Lancer"] = {
 General = {
 Description = "Provides cover for allies",
 Faction = "Kuva Grineer",
 Image = "FortressShieldLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressShieldLancer",
 --Introduced = "?",
 Link = "Kuva Shield Lancer",
 Name = "Kuva Shield Lancer",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged / Knockdown",
 Weapons = { "Marelok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.125,
 Slash = 0.375
 },
 TotalDamage = 50,
 StatusChance = 0.3,
 },
 },
 Health = 40,
 EximusHealth = 40,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Siphon"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "KuvaSiphon.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Kuva Siphon",
 Missions = { "Kuva Siphon" },
 Name = "Kuva Siphon",
 Planets = { "Any near Kuva Fortress" },
 Scans = 20,
 Type = "Environment",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Shield = 1,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Kuva Trokarian"] = {
 General = {
 Abilities = { "Kuva Trokar" },
 Description = "The Worm Queen's early presence aboard the Zariman has aided her troops' defenses. Through Reliquary tampering, The Worm Queen has bestowed these troopers with a miniature Kuva Trokar to disrupt transference.",
 Faction = "Kuva Grineer",
 Image = "KuvaTrokarian.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Zariman/GrnAntiWarframeAgent",
 Introduced = "31.5",
 Link = "Kuva Trokarian",
 Name = "Kuva Trokarian",
 Planets = { "Zariman Ten Zero" },
 Scans = 3,
 TileSets = { "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Kuva Karak" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.31,
 Puncture = 0.27,
 Slash = 0.42
 },
 TotalDamage = 3,
 StatusChance = 0.31,
 },
 },
 Health = 500,
 Armor = 300,
 Overguard = 2,
 Affinity = 750,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kuva Trooper"] = {
 General = {
 Description = "Heavily armored, close range Lancer",
 Faction = "Kuva Grineer",
 Image = "FortressShotgunLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Fortress/FortressShotgunLancer",
 --Introduced = "?",
 Link = "Kuva Trooper",
 Name = "Kuva Trooper",
 Planets = { "Kuva Fortress", "Zariman Ten Zero" },
 Scans = 10,
 TileSets = { "Grineer Asteroid Fortress", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Hek", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 5,
 Multishot = 7,
 StatusChance = 0.1,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 150,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Lancer = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "LancerDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/RifleLancer",
 --Introduced = "?",
 Link = "Lancer",
 Name = "Lancer",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Lancer Dreg"] = {
 General = {
 Description = "Fires highly accurate laser beams",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnLaserDrone.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Drones/LaserDrone",
 --Introduced = "?",
 Link = "Lancer Dreg",
 Missions = { "Archwing (Mission)" },
 Name = "Lancer Dreg",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Radiation = 1
 },
 TotalDamage = 25,
 StatusChance = 0.01,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 150,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Lancer Survivor"] = {
 General = {
 --Description = "?",
 Faction = "Grineer",
 Image = "RifleLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/InfestedMicroPlanet/GrineerShotgunSurvivorAgent",
 Introduced = "29",
 Link = "Lancer Survivor",
 Missions = { "Necralisk Bounty" },
 Name = "Lancer Survivor",
 Planets = { "Deimos" },
 Scans = 20,
 TileSets = { "Cambion Drift" },
 Type = "Ranged",
 Weapons = { "Karak", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 250,
 StatusChance = 0.5,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 },
 },
 Health = 1000,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Latcher = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "LatcherDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/StickyRollingDrone",
 --Introduced = "?",
 Link = "Latcher",
 Name = "Latcher",
 Scans = 10,
 Type = "Deployable Bomb",
 Weapons = { "" },
 },
 Stats = {
 Health = 1,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 12,
 Multis = { "" },
 }
 },
 Leekter = {
 General = {
 Description = "A member of the infamous Grustrag Three",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "DELeekter.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/DeathSquad/DeathSquadB",
 --Introduced = "?",
 Link = "Leekter",
 Name = "Leekter",
 Scans = 3,
 Type = "Assassin",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 75,
 StatusChance = 0,
 },
 -- {
 -- AttackName = "Grenade Damage",
 -- DamageDistribution = {
 -- Blast = 1
 -- },
 -- TotalDamage = 80
 -- },
 },
 Health = 1700,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 6,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Lektro Commander"] = {
 General = {
 Description = "A Grineer Commander specializing in electrical weaponry.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "LektroCommander.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/AdmiralLightningAgent",
 --Introduced = "?",
 Link = "Lektro Commander",
 Name = "Lektro Commander",
 Scans = 3,
 TileSets = { "Grineer Asteroid" },
 Type = "Ranged",
 Weapons = { "Quartakk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.37,
 Puncture = 0.29,
 Slash = 0.34,
 },
 TotalDamage = 10,
 Multishot = 4, -- Technically 4 burst count, but there's no delay inbetween burst, so it's indistinguishable to multishot
 StatusChance = 0.27,
 }, 
 },
 Health = 300,
 Armor = 750,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 70,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Lieutenant Lech Kril"] = {
 General = {
 Abilities = { "Ice Wave", "Fire Wave", "Flame Barrier" },
 Actor = "George Spanos ([DE]George)",
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "BossLechKrilAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/BossLechKrilAgent",
 --Introduced = "?",
 Link = "Lieutenant Lech Kril",
 Missions = { "Assassination", "War (Node)", "Exta" },
 Name = "Lt Lech Kril",
 Planets = { "Mars", "Ceres" },
 Scans = 3,
 TileSets = { "Grineer Settlement", "Grineer Shipyard" },
 Type = "Boss",
 Weapons = { "Gorgon", "Brokk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Gorgon Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1
 },
 TotalDamage = 25,
 StatusChance = 0.09,
 },
 {
 AttackName = "Brokk Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15,
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 {
 AttackName = "Fire Wave",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 100
 },
 },
 Health = 4000,
 Shield = 400,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 13,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Manic Bombard"] = {
 General = {
 Description = "Highly mobile heavy artillery",
 Faction = "Grineer",
 Image = "GrineerManicBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/ManicRocketBombard",
 Introduced = "17",
 Link = "Manic Bombard",
 Name = "Manic Bombard",
 Planets = { "Uranus" },
 Scans = 3,
 TileSets = { "Grineer Sealab" },
 Type = "Heavy Ranged",
 Weapons = { "Gorgon", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 },
 {
 AttackName = "Cluster Grenade", -- Might be outdated, data was over 5 years ago
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 Multishot = 5
 },
 },
 Health = 1500,
 EximusHealth = 1500,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 4,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Mordda Turret"] = {
 General = {
 Description = "A long-range battery that fires destructive ordnance.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "EidolonAutoMortarTurret.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonAutoTurretAgentMortar",
 Introduced = "22",
 Link = "Mordda Turret",
 Name = "Mordda Turret",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Mortar Contact Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 BurstCount = 3,
 },
 {
 AttackName = "Mortar AoE Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 40,
 StatusChance = 0.3,
 },
 },
 Health = 1100,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Napalm = {
 General = {
 Description = "Creates fire hazards",
 Faction = "Grineer",
 Image = "IncendiaryBombardAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/IncendiaryBombard",
 --Introduced = "?",
 Link = "Napalm",
 Name = "Napalm",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Napalm Shot Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 50
 },
 {
 AttackName = "Napalm AoE Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 50
 },
 },
 Health = 600,
 EximusHealth = 600,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 6,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Bailiff"] = {
 General = {
 CodexSecret = true,
 Description = "Swings a Jat Kittag as he runs down his foes.",
 Faction = "Grineer",
 Image = "NightwatchCharger.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchGrineerCharger",
 --Introduced = "?",
 Link = "Nightwatch Bailiff",
 Name = "Nightwatch Bailiff",
 Scans = 20,
 Type = "Melee",
 Weapons = { "Jat Kittag" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 30,
 },
 {
 AttackName = "Charge Melee Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 StatusChance = 0.2,
 },
 {
 AttackName = "Hook Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 },
 },
 Health = 450,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Padded Areas: 0.5x" },
 }
 },
 ["Nightwatch Bombard"] = {
 General = {
 CodexSecret = true,
 Description = "Brings devastation with a modified Ogris.",
 Faction = "Grineer",
 Image = "NightwatchBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/Avatars/NightwatchHeavyGunnerAvatar",
 --Introduced = "?",
 Link = "Nightwatch Bombard",
 Name = "Nightwatch Bombard",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Ogris", "Sheev" }, 
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40
 }
 },
 Health = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 8,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Brunt Lancer"] = {
 General = {
 CodexSecret = true,
 Description = "Blocks hostile gunfire with a reinforced Brunt.",
 Faction = "Grineer",
 Image = "NightwatchBruntLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchShieldLancer",
 --Introduced = "?",
 Link = "Nightwatch Brunt Lancer",
 Name = "Nightwatch Brunt Lancer",
 Scans = 20,
 Type = "Ranged / Knockdown",
 Weapons = { "Brakk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.2,
 Slash = 0.2
 },
 TotalDamage = 5,
 BurstCount = 3,
 StatusChance = 0.025,
 },
 {
 AttackName = "Shield Bash",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 40,
 EximusHealth = 40,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Carrier"] = {
 General = {
 CodexSecret = true,
 Description = "Energy Transport Unit",
 Faction = "Grineer",
 Image = "NightwatchCarrierLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchCarrierRifleLancer",
 --Introduced = "?",
 Link = "Nightwatch Carrier",
 Missions = { "Excavation" },
 Name = "Nightwatch Carrier",
 --Scans = ?,
 Type = "",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 650,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Flameblade"] = {
 General = {
 CodexSecret = true,
 Description = "Assailing enemies with the Twin Basolk, this combatant closes in on its target with teleportation technology.",
 Faction = "Grineer",
 Image = "NightwatchFlameblade.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchFlamebladeSawman",
 --Introduced = "?",
 Link = "Nightwatch Flameblade",
 Name = "Nightwatch Flameblade",
 Scans = 10,
 Type = "Melee",
 Weapons = { "Twin Basolk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 30,
 StatusDamage = 0.2,
 },
 },
 Health = 50,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Gunner"] = {
 General = {
 CodexSecret = true,
 Description = "Brings devastation with a modified Ogris.",
 Faction = "Grineer",
 Image = "NightwatchBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchHeavyGunner",
 --Introduced = "?",
 Link = "Nightwatch Gunner",
 Name = "Nightwatch Gunner",
 Scans = 3,
 Type = "Heavy",
 Weapons = { "Ogris" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 },
 },
 Health = 300,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 8,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Hyekka Master"] = {
 General = {
 CodexSecret = true,
 Description = "Leads a pack of Hyekka into battle.",
 Faction = "Grineer",
 Image = "NightwatchCatMaster.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchCatMaster",
 --Introduced = "?",
 Link = "Nightwatch Hyekka Master",
 Name = "Nightwatch Hyekka Master",
 Scans = 5,
 Type = "Heavy",
 Weapons = { "Ignis", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ignis Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 25,
 StatusChance = 0.3,
 },
 },
 Health = 650,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Lancer"] = {
 General = {
 CodexSecret = true,
 Description = "These mobile infantry make up the core of the Nightwatch Corps.",
 Faction = "Grineer",
 Image = "NightwatchLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchRifleLancer",
 --Introduced = "?",
 Link = "Nightwatch Lancer",
 Name = "Nightwatch Lancer",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Grinlok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.1,
 Slash = 0.4
 },
 TotalDamage = 25,
 StatusChance = 0.35,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Manic"] = {
 General = {
 Abilities = { "Invisibility" },
 CodexSecret = true,
 Description = "Fastm ruthless and completely unpredictable.",
 Faction = "Grineer",
 Image = "NightwatchManic.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchManic",
 --Introduced = "?",
 Link = "Nightwatch Manic",
 Name = "Nightwatch Manic",
 Scans = 3,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 },
 Health = 350,
 Armor = 25,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Powerclaw"] = {
 General = {
 CodexSecret = true,
 Description = "Sporting the visceral Ripkas, this unit is a specialist in close quarter combat.",
 Faction = "Grineer",
 Image = "NightwatchPowerclaw.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchPowerfist",
 --Introduced = "?",
 Link = "Nightwatch Powerclaw",
 Name = "Nightwatch Powerclaw",
 Scans = 10,
 Type = "Melee",
 Weapons = { "Ripkas" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.10,
 Slash = 0.85
 },
 TotalDamage = 30,
 StatusChance = 0.05,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Reaver"] = {
 General = {
 CodexSecret = true,
 Description = "Highly mobile and heavily armored, this unit spreads mayhem with his modified Tonkor.",
 Faction = "Grineer",
 Image = "NightwatchReaver.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/JetpackHeavyMarine",
 --Introduced = "?",
 Link = "Nightwatch Reaver",
 Name = "Nightwatch Reaver",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tonkor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Puncture = 1
 },
 TotalDamage = 75,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 650,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 BurstCount = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 },
 Health = 600,
 EximusHealth = 600,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nightwatch Seeker"] = {
 General = {
 CodexSecret = true,
 Description = "Distracts prey with rollers while taking aim with a high-calibre Marelok.",
 Faction = "Grineer",
 Image = "NightwatchSeeker.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/NightwatchGrineerMarinePistol",
 --Introduced = "?",
 Link = "Nightwatch Seeker",
 Name = "Nightwatch Seeker",
 Scans = 5,
 Type = "Ranged Support",
 Weapons = { "Marelok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.1,
 Slash = 0.4
 },
 TotalDamage = 15,
 StatusChance = 0.3,
 },
 },
 Health = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Nox = {
 General = {
 Actor = "Kellen Goff",
 Description = "Toxic to the core, Nox lobs exploding poison goo at enemies. Rupture his helmet to expose his head but beware of the unleashed noxious gasses.",
 Faction = "Grineer",
 Image = "Nox.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/ChemStrike/ChemStrikeNoxAgent",
 Introduced = "21",
 Link = "Nox",
 Name = "Nox",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Stug Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 {
 AttackName = "Stug AoE Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 {
 AttackName = "Blob Stick Damage",
 DamageDistribution = {
 Toxin = 1,
 },
 TotalDamage = 3
 },
 },
 Health = 350,
 EximusHealth = 350,
 Armor = 500,
 Overguard = 5,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Ogma = {
 General = {
 Description = "Armed with a Demolition Cannon and Mining Drill.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnCombatPod.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Pods/CombatPod",
 --Introduced = "?",
 Link = "Ogma",
 Missions = { "Archwing (Mission)" },
 Name = "Ogma",
 Scans = 3,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 600,
 Armor = 500,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Thruster: ?", "Machine: 3.0x" },
 }
 },
 ["Ogma Elite"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnCombatPodElite.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Ogma",
 Missions = { "Eyes of Blight" },
 Name = "Ogma Elite",
 Type = "",
 Weapons = { "Asteroid Splitter", "Mining Drill", "Machine Gun" },
 },
 Stats = {
 Health = 0,
 Armor = 0,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Thruster: ?", "Machine: 3.0x" },
 }
 },
 ["Orbital Strike Drone"] = {
 General = {
 Description = "Paints targets for orbital strikes",
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "VayHekStrikeDrone.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/Hek/PropDrones/StrikeDroneAvatar",
 --Introduced = "?",
 Link = "Orbital Strike Drone",
 Missions = { "Assassination", "Oro" },
 Name = "Orbital Strike Drone",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Grineer Forest" },
 Type = "Deployable Drone",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Plains Commander"] = {
 General = {
 Abilities = { "Seismic Shockwave", "Summons Tusk Carabuses" },
 Description = "One of the faceless Grineer ranks.",
 Faction = "Grineer",
 Image = "EidolonVipGrunt.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/Vip/EidolonVipGruntAgent",
 Introduced = "22",
 Link = "Plains Commander",
 Missions = { "Cetus Bounty" },
 Name = "Plains Commander",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Hind", "Brokk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4,
 },
 TotalDamage = 4,
 BurstCount = 5,
 StatusChance = 0.05
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.25,
 Slash = 0.05,
 },
 TotalDamage = 150,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Armor = 250,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Powerfist = {
 General = {
 Description = "Slow but very powerful melee attacks",
 Faction = "Grineer",
 Image = "PowerfistDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/PistonSawman",
 Introduced = "Vanilla",
 Link = "Powerfist",
 Name = "Powerfist",
 Scans = 10,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Viral = 1
 },
 TotalDamage = 60,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Propaganda Drone"] = {
 General = {
 Description = "Boosts Grineer morale while weakening enemies.",
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "VayHekPropagandaDrone.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Propaganda Drone",
 Missions = { "Assassination", "Oro" },
 Name = "Propaganda Drone",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Grineer Forest" },
 Type = "Deployable Drone",
 Weapons = { "" },
 },
 Stats = {
 Health = 500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Prosecutor = {
 General = {
 Description = "Vicious melee attacks",
 Faction = "Grineer",
 Image = "GrineerProsecutor.png",
 InternalName = "",
 Introduced = "13",
 Link = "Prosecutor",
 Name = "Prosecutor",
 Scans = 3,
 TileSets = { "Grineer Shipyard" },
 Type = "Melee",
 Weapons = { "Amphis" },
 EximusDefault = true,
 -- SteelPathDefault = false,
 -- EmpoweredDefault = true,
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15
 },
 TotalDamage = 30,
 StatusChance = 0.1,
 },
 },
 Health = 1500,
 Armor = 5,
 Affinity = 500,
 BaseLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Pyr Captain"] = {
 General = {
 Description = "A Grineer Captain specializing in thermal weaponry.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "PyrCaptain.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/RailJack/Avatars/AdmiralFireAvatar",
 Introduced = "27",
 Link = "Pyr Captain",
 Missions = { "Empyrean" },
 Name = "Pyr Captain",
 Planets = { "Earth Proxima", "Veil Proxima" },
 Scans = 3,
 TileSets = { "Grineer Galleon" },
 Type = "Ranged",
 Weapons = { "Gorgon" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.15,
 Slash = 0.1,
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 },
 },
 Health = 300,
 Armor = 750,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Recon Commander"] = {
 General = {
 Abilities = { "Seismic Shockwave", "Invisibility" },
 Description = "Agile and quick-witted, as patient as she is cunning.",
 Faction = "Grineer",
 Image = "EidolonVipSniper.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/Vip/Avatars/EidolonVipSniperAvatar",
 Introduced = "22",
 Link = "Recon Commander",
 Missions = { "Cetus Bounty" },
 Name = "Recon Commander",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Tonkor", "Manticore" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Tonkor Shot Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 45,
 },
 {
 AttackName = "Tonkor AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 95,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.43,
 Puncture = 0.1,
 Slash = 0.47
 },
 TotalDamage = 60,
 StatusChance = 0.25,
 },
 },
 Health = 1200,
 Armor = 250,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Regulator = {
 General = {
 Description = "Grants nearby Grineer units extra speed and damage",
 Faction = "Grineer",
 Image = "RegulatorDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/SpecialEvents/SurveillanceDroneAvatar",
 --Introduced = "?",
 Link = "Regulator",
 Name = "Regulator",
 Scans = 20,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Health = 120,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Roller = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "RollingDroneAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/GrineerRollingDrone",
 --Introduced = "?",
 Link = "Roller",
 Name = "Roller",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 40,
 EximusHealth = 40,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 12,
 Multis = { "" },
 }
 },
 ["Roller Sentry"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "RollerTurret.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/RollerAutoTurret",
 Introduced = "18.10",
 Link = "Roller Sentry",
 Name = "Roller Sentry",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1875,
 Puncture = 0.1875,
 Slash = 0.625
 },
 TotalDamage = 3,
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Scorch = {
 General = {
 Description = "Short-range incendiary attacks",
 Faction = "Grineer",
 Image = "FlameLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/FlameLancer",
 --Introduced = "?",
 Link = "Scorch",
 Name = "Scorch",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Ignis", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ignis Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 200,
 StatusChance = 0.25,
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 7,
 Multis = { "Head: 3.0x" },
 }
 },
 Scorpion = {
 General = {
 Description = "Lethal melee unit with ranged harpoon attack",
 Faction = "Grineer",
 Image = "ScorpionDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/MacheteWoman",
 --Introduced = "?",
 Link = "Scorpion",
 Name = "Scorpion",
 Scans = 10,
 Type = "Melee",
 Weapons = { "Machete" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 {
 AttackName = "Hook Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 150,
 Affinity = -1,
 BaseLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 Seeker = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "SeekerDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/GrineerMarinePistol",
 Introduced = "6.3",
 Link = "Seeker",
 Name = "Seeker",
 Scans = 5,
 Type = "Ranged Support",
 Weapons = { "Kraken", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.125,
 Slash = 0.125
 },
 TotalDamage = 49,
 BurstCount = 2,
 StatusChance = 0.13,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Sensor Regulator"] = {
 General = {
 Description = "Detects intruders",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "RegulatorDE.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/Avatars/CameraDroneAvatar",
 --Introduced = "?",
 Link = "Sensor Regulator",
 Missions = { "Spy" },
 Name = "Sensor Regulator",
 Scans = 20,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Health = 100,
 EximusHealth = 100,
 Armor = 300,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Senta Turret (Kuva Fortress)"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Kuva Grineer",
 Image = "FortressAutoTurret.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/GrineerAutoTurretStaticAgent",
 Introduced = "19",
 Link = "Turret#Grineer",
 Name = "Senta Turret",
 Planets = { "Kuva Fortress" },
 Scans = 20,
 TileSets = { "Grineer Asteroid Fortress" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334
 },
 TotalDamage = 10,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Shield Dargyn"] = {
 General = {
 Description = "A Dargyn equipped with Shield defences",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnSkiffShield.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Skiffs/ShieldSkiff",
 --Introduced = "?",
 Link = "Shield Dargyn",
 Missions = { "Archwing (Mission)" },
 Name = "Shield Dargyn",
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1
 },
 TotalDamage = 3,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Shield Lancer"] = {
 General = {
 Description = "Provides cover for allies",
 Faction = "Grineer",
 Image = "ShieldLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/ShieldLancer",
 --Introduced = "?",
 Link = "Shield Lancer",
 Name = "Shield Lancer",
 Scans = 20,
 Type = "Ranged / Knockdown",
 Weapons = { "Viper", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.2,
 Slash = 0.2
 },
 TotalDamage = 12,
 BurstCount = 3,
 StatusChance = 0.06,
 },
 {
 AttackName = "Shield Bash",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 40,
 EximusHealth = 40,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Shield-Hellion Dargyn"] = {
 General = {
 Description = "A Helion Dargyn equipped with Shield defences",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnSkiffMissileShield.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Skiffs/MissileShieldSkiff",
 --Introduced = "?",
 Link = "Shield-Hellion Dargyn",
 Missions = { "Archwing (Mission)" },
 Name = "Shield-Hellion Dargyn",
 Planets = { "Uranus" },
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 150,
 StatusChance = 0.03,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 150,
 StatusChance = 0.03,
 },
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Shik Tal"] = {
 General = {
 Description = "A member of the infamous Grustrag Three",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "DEShik.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/DeathSquad/DeathSquadC",
 --Introduced = "?",
 Link = "Shik Tal",
 Name = "Shik Tal",
 Scans = 3,
 Type = "Assassin",
 Weapons = { "Marelok" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Missile Contact Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 45,
 BurstCount = 4,
 StatusChance = 0.05,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 45,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shield Bash",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 1700,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 6,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Shock Draga"] = {
 General = {
 Description = "Utilizes a taser cord",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "EelFrogLancer.png",
 InternalName = "/Lotus/Types/Enemies/Water/Grineer/EelLancerAgent",
 Introduced = "17",
 Link = "Shock Draga",
 Name = "Shock Draga",
 Scans = 20,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "Sydon" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7
 },
 TotalDamage = 50,
 StatusChance = 0.15,
 },
 },
 Health = 150,
 Armor = 10,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Sikula = {
 General = {
 Description = "Deploys aquatic mines.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "WaterMineDrone.png",
 InternalName = "/Lotus/Types/Enemies/Water/Grineer/WaterMineDrone",
 Introduced = "17",
 Link = "Sikula",
 Name = "Sikula",
 Scans = 10,
 TileSets = { "Grineer Sealab" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Mine Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 },
 },
 Health = 50,
 Shield = 25,
 Armor = 50,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Sprag = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "Sprag.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/JetpackMeleeMarine",
 Introduced = "14.7",
 Link = "Sprag",
 Missions = { "Orokin Sabotage", "Formido", "Stribog" },
 Name = "Sprag",
 Scans = 3,
 Type = "Field Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 75,
 StatusChance = 0,
 },
 },
 Health = 600,
 Armor = 150,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 16,
 --Multis = { "?" },
 }
 },
 ["Temporal Dreg"] = {
 General = {
 Description = "Emits a tractor beam, slowing its target down.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnStasisDrone.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/Drones/StasisDrone",
 --Introduced = "?",
 Link = "Temporal Dreg",
 Missions = { "Archwing (Mission)" },
 Name = "Temporal Dreg",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.6
 },
 TotalDamage = 5,
 },
 },
 Health = 100,
 Armor = 150,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Trooper = {
 General = {
 Description = "Heavily armored, close range Lancer",
 Faction = "Grineer",
 Image = "ShotgunLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/ShotgunLancer",
 Introduced = "Vanilla",
 Link = "Trooper",
 Name = "Trooper",
 Scans = 10,
 Type = "Ranged",
 Weapons = { "Sobek", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 6,
 Multishot = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 150,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Trooper Survivor"] = {
 General = {
 --Description = "?",
 Faction = "Grineer",
 Image = "ShotgunLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/InfestedMicroPlanet/GrineerShotgunSurvivorAvatar",
 Introduced = "29",
 Link = "Trooper Survivor",
 Missions = { "Necralisk Bounty" },
 Name = "Trooper Survivor",
 Planets = { "Deimos" },
 Scans = 10,
 TileSets = { "Cambion Drift" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 250,
 StatusChance = 0.5,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 },
 },
 Health = 1000,
 Armor = 150,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Ballista"] = {
 General = {
 Description = "Long Ranged Sniper",
 Faction = "Grineer",
 Image = "EidolonGrineerFemale.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonGrineerFemale",
 Introduced = "22",
 Link = "Tusk Ballista",
 Name = "Tusk Ballista",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "Sniper",
 Weapons = { "Vulkar", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.15,
 Slash = 0.05
 },
 TotalDamage = 75,
 StatusChance = 0.1,
 }
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Bolkor"] = {
 General = {
 Description = "The pride of the Tusk fleet, the Bolkor is the ideal platform from which to mount ground operations. Equipped with a high capacity rotary canon, densely plated and with enough space to carry a platoon, the Bolkor holds its own raining down fire and dropping squad after squad at regular intervals.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "BigDripShip.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/GrineerDropship/GrineerBigDropshipAgent",
 Introduced = "22",
 Link = "Tusk Bolkor",
 Name = "Tusk Bolkor",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 20,
 },
 },
 Health = 10000,
 Armor = 600,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Tusk Bombard"] = {
 General = {
 Description = "Long range missile attack",
 Faction = "Grineer",
 Image = "Tusk Bombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonRocketBombard",
 Introduced = "22",
 Link = "Tusk Bombard",
 Name = "Tusk Bombard",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Heavy Ranged",
 Weapons = { "Ogris", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 35,
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Butcher"] = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Grineer",
 Image = "EidolonBladeSawman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonBladeSawman",
 Introduced = "22",
 Link = "Tusk Butcher",
 Name = "Tusk Butcher",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Carabus"] = {
 -- Missing data
 General = {
 Abilities = { "Kamikaze" },
 CodexSecret = true,
 Description = "Fires a devastating heat ray and self destructs.",
 Faction = "Grineer",
 Image = "EidolonVipGruntDrone.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/Vip/EidolonVipGruntDroneAgent",
 Introduced = "22",
 Link = "Tusk Carabus",
 Name = "Tusk Carabus",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "Atomos" },
 },
 Stats = {
 Health = 50,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Tusk Command Dargyn"] = {
 General = {
 Description = "Armed with a high-velocity rapid-fire cannon, this armored skiff tears up targets and terrain alike.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "EidolonVipSkiff.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/Vip/EidolonVipSkiffAgent",
 Introduced = "22",
 Link = "Tusk Command Dargyn",
 Missions = { "Cetus Bounty" },
 Name = "Tusk Command Dargyn",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "Grattler" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1,
 },
 TotalDamage = 12,
 StatusChance = 0.05,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1,
 },
 TotalDamage = 6,
 StatusChance = 0.075,
 }
 },
 Health = 800,
 Armor = 125,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Tusk Dargyn"] = {
 General = {
 Description = "Inflicts moderate damage at a fast rate",
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnSkiff.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/GrineerSkiff/GrineerSkiffAgent",
 Introduced = "22",
 Link = "Tusk Dargyn",
 Name = "Tusk Dargyn",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1,
 },
 TotalDamage = 20
 },
 },
 Health = 300,
 Armor = 125,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Tusk Elite Lancer"] = {
 General = {
 Description = "High Damage",
 Faction = "Grineer",
 Image = "EidolonEliteRifleLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonEliteRifleLancer",
 Introduced = "22",
 Link = "Tusk Elite Lancer",
 Name = "Tusk Elite Lancer",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Grinlok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.1,
 Slash = 0.4
 },
 TotalDamage = 15,
 StatusChance = 0.35,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Eviscerator"] = {
 General = {
 Description = "Long range blade attacks",
 Faction = "Grineer",
 Image = "EidolonEvisceratorLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonEviseratorLancer",
 Introduced = "22",
 Link = "Tusk Eviscerator",
 Name = "Tusk Eviscerator",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Miter", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 45,
 StatusChance = 0.025,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 Multishot = 4,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Firbolg"] = {
 General = {
 Description = "In and out under extreme duress, the Firbolg handles lightning fast infiltrations/extractions and lazy picket duty with equal aplomb.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "GrineerDropShip.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/GrineerDropship/GrineerDropshipAgent",
 Introduced = "22",
 Link = "Tusk Firbolg",
 Name = "Tusk Firbolg",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 20,
 },
 },
 Health = 8000,
 Armor = 600,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Tusk Flameblade"] = {
 General = {
 Description = "High damage enemy with teleport",
 Faction = "Grineer",
 Image = "EidolonBlowtorchSawman.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonBlowtorchSawman",
 Introduced = "22",
 Link = "Tusk Flameblade",
 Name = "Tusk Flameblade",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Plains of Eidolon" },
 Type = "Melee",
 Weapons = { "Twin Basolk" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 30,
 StatusChance = 0.2
 },
 },
 Health = 50,
 EximusHealth = 50,
 Armor = 5,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Heavy Gunner"] = {
 General = {
 Description = "High damage minigun",
 Faction = "Grineer",
 Image = "EidolonMinigunBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonMinigunBombard",
 Introduced = "22",
 Link = "Tusk Heavy Gunner",
 Name = "Tusk Heavy Gunner",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Heavy Ranged",
 Weapons = { "Kohmak", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Grattler Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1
 },
 TotalDamage = 7,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grattler AoE Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1
 },
 TotalDamage = 7,
 StatusChance = 0075,
 },
 {
 AttackName = "Kohmak Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 Multishot = 5,
 StatusChance = 0.1,
 Note = "Spools up from 1 to 5 projectiles"
 }
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Hellion"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "EidolonJetpackMarine.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonJetpackMarine",
 Introduced = "22",
 Link = "Tusk Hellion",
 Name = "Tusk Hellion",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Grakata", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 BurstCount = 3,
 StatusChance = 0.15,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Lancer"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "EidolonRifleLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonRifleLancer",
 Introduced = "22",
 Link = "Tusk Lancer",
 Name = "Tusk Lancer",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Hind", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.2,
 Slash = 0.4,
 },
 TotalDamage = 4,
 BurstCount = 5,
 StatusChance = 0.05
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Mortar Bombard"] = {
 General = {
 Description = "This Bombard's portable, back-mounted mortar allows the Grineer to rain destruction anywhere on the plains.",
 Faction = "Grineer",
 Image = "EidolonMortarBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonMortarBombard",
 Introduced = "22",
 Link = "Tusk Mortar Bombard",
 Name = "Tusk Mortar Bombard",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Heavy Ranged",
 Weapons = { "Kraken", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Kraken Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.125,
 Slash = 0.125,
 },
 TotalDamage = 30,
 BurstCount = 2,
 StatusChance = 0.1,
 },
 {
 AttackName = "Mortar AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 BurstCount = 3
 },
 },
 Health = 300,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Napalm"] = {
 General = {
 Description = "Creates fire hazards",
 Faction = "Grineer",
 Image = "EidolonIncendiaryBombard.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonIncendiaryBombard",
 Introduced = "22",
 Link = "Tusk Napalm",
 Name = "Tusk Napalm",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Heavy",
 Weapons = { "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Napalm Shot Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 50
 },
 {
 AttackName = "Napalm AoE Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 50
 },
 },
 Health = 450,
 EximusHealth = 450,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Ogma"] = {
 General = {
 Description = "Retrofitted for Plains operations, the Tusk-variant Ogma IDs targets at range, hammers out missile volleys on approach and finishes the job with a rain of explosives.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "EidolonBomber.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/GrineerBomber/GrineerBomberAvatar",
 Introduced = "22",
 Link = "Tusk Ogma",
 Name = "Tusk Ogma",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 3500,
 Armor = 225,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Thruster: ?", "Sensor array: 3.0x" },
 }
 },
 ["Tusk Predator"] = {
 General = {
 Description = "High damage enemy with teleport",
 Faction = "Grineer",
 Image = "EidolonPredator.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonPredator",
 Introduced = "22",
 Link = "Tusk Predator",
 Name = "Tusk Predator",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Plains of Eidolon" },
 Type = "Melee",
 Weapons = { "Twin Krohkur" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 35,
 StatusChance = 0.5,
 },
 {
 AttackName = "Hook Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334
 },
 TotalDamage = 25
 },
 },
 Health = 75,
 EximusHealth = 75,
 Armor = 5,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Reaver"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "EidolonJetpackMelee.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonJetpackMelee",
 Introduced = "22",
 Link = "Tusk Reaver",
 Name = "Tusk Reaver",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 75,
 StatusChance = 0,
 },
 },
 Health = 200,
 Armor = 500,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Roller"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "EidolonRollingDrone.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonGrineerRollingDrone",
 Introduced = "22",
 Link = "Tusk Roller",
 Name = "Tusk Roller",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 60,
 EximusHealth = 60,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 10,
 Multis = { "" },
 }
 },
 ["Tusk Seeker"] = {
 General = {
 Description = "Heavily armored",
 Faction = "Grineer",
 Image = "EidolonGrineerMarinePistol.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonGrineerMarinePistol",
 Introduced = "22",
 Link = "Tusk Seeker",
 Name = "Tusk Seeker",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged Support",
 Weapons = { "Kraken", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.75,
 Puncture = 0.125,
 Slash = 0.125
 },
 TotalDamage = 30,
 BurstCount = 2,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Seeker Drone"] = {
 General = {
 Description = "Identifies potential threats and calls in reinforcements.",
 Faction = "Grineer",
 Image = "EidolonAlarmDrone.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Narmer/NarmerEidolonAlarmDroneAgent",
 Introduced = "22",
 Link = "Tusk Seeker Drone",
 Name = "Tusk Seeker Drone",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged Support",
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Tusk Shield Dargyn"] = {
 General = {
 Description = "Inflicts moderate damage at a fast rate",
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnSkiff.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/GrineerSkiff/GrineerShieldSkiffAgent",
 Introduced = "22",
 Link = "Tusk Shield Dargyn",
 Name = "Tusk Shield Dargyn",
 Planets = { "Earth" },
 Scans = 5,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1,
 },
 TotalDamage = 20
 },
 },
 Health = 300,
 Armor = 125,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Tusk Shield Lancer"] = {
 General = {
 Description = "Provides cover for allies",
 Faction = "Grineer",
 Image = "EidolonShieldLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonShieldLancer",
 Introduced = "22",
 Link = "Tusk Shield Lancer",
 Name = "Tusk Shield Lancer",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged / Knockdown",
 Weapons = { "Marelok", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.1,
 Slash = 0.4
 },
 TotalDamage = 80, -- data says 80, confirm if its 80, previously was 50
 StatusChance = 0.3,
 },
 },
 Health = 40,
 EximusHealth = 40,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 5,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Target"] = {
 General = {
 Description = "",
 Faction = "Grineer",
 Image = "?",
 InternalName = "",
 Introduced = "22",
 Link = "Tusk Target",
 Missions = { "Cetus Bounty" },
 Name = "Tusk Target",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Hind" },
 },
 Stats = {
 Health = 1000,
 Armor = 60,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tusk Thumper"] = {
 General = {
 Description = "Grineer mobile defense platform. Pneumatic groundpounders, high-drop entrances and wide-bore cannons deliver the same simple message: boom.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "TuskThumper.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Thumper/ThumperAgent",
 Introduced = "24.6",
 Link = "Tusk Thumper",
 Name = "Tusk Thumper",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 9000,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 20,
 --Multis = { "?" },
 }
 },
 ["Tusk Thumper Bull"] = {
 General = {
 Description = "An upsized version of the Grineer mobile defense platform. Pneumatic groundpounders, high-drop entrances and wide-bore cannons deliver the same simple message: boom.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "TuskThumperBull.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Thumper/ThumperMedAgent",
 Introduced = "24.6",
 Link = "Tusk Thumper Bull",
 Name = "Tusk Thumper Bull",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 12000,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Tusk Thumper Doma"] = {
 General = {
 Description = "The largest version of the Grineer mobile defense platform. Pneumatic groundpounders, high-drop entrances and wide-bore cannons deliver the same simple message: boom.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "TuskThumperDoma.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Thumper/ThumperLargeAgent",
 Introduced = "24.6",
 Link = "Tusk Thumper Doma",
 Name = "Tusk Thumper Doma",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 15000,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Tusk Trooper"] = {
 General = {
 Description = "Heavily armored, close range Lancer",
 Faction = "Grineer",
 Image = "EidolonShotgunLancer.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonShotgunLancer",
 Introduced = "22",
 Link = "Tusk Trooper",
 Name = "Tusk Trooper",
 Planets = { "Earth" },
 Scans = 10,
 TileSets = { "Plains of Eidolon" },
 Type = "Ranged",
 Weapons = { "Karak", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.45,
 Puncture = 0.3,
 Slash = 0.25,
 },
 TotalDamage = 4,
 StatusChance = 0.075,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 20,
 }
 },
 },
 Health = 120,
 EximusHealth = 120,
 Armor = 150,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Tyl Regor"] = {
 General = {
 Abilities = { "Smoke Screen", "SlashDash", "Stompwave" },
 Actor = "Lucas Schuneman",
 Description = "Melee Specialist",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "TylRegor.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/TylRegor/TylRegorAgent",
 Introduced = "5",
 Link = "Tyl Regor",
 Missions = { "Assassination", "Titania (Node)" },
 Name = "Tyl Regor",
 Planets = { "Uranus" },
 Scans = 3,
 TileSets = { "Grineer Sealab" },
 Type = "Boss",
 Weapons = { "Ack & Brunt", "Knux" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ack & Brunt Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 35,
 StatusChance = 0.05,
 },
 },
 Health = 3000,
 Shield = 800,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 31,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vay Hek Terra Frame"] = {
 General = {
 Actor = "James Atkins",
 Description = "Vay Hek's combat platform",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "VayHek.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Vip/Hek/HekBipedAgent",
 --Introduced = "?",
 Link = "Vay Hek Terra Frame",
 Missions = { "Assassination", "Oro" },
 Name = "Vay Hek Terra Frame",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Grineer Forest" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 2,
 StatusChance = 0.02,
 },
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 45,
 StatusChance = 0.05,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 50,
 StatusChance = 0.05,
 },
 },
 Health = 2500,
 Armor = 225,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 --Multis = { "?" },
 }
 },
 ["Vem Tabook"] = {
 General = {
 Description = "A member of the infamous Grustrag Three",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "DETabook.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/DeathSquad/DeathSquadA",
 --Introduced = "?",
 Link = "Vem Tabook",
 Name = "Vem Tabook",
 Scans = 3,
 Type = "Assassin",
 Weapons = { "Hek" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.2,
 Slash = 0.6,
 },
 TotalDamage = 30,
 Multishot = 7,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 100,
 StatusChance = 1,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80
 },
 },
 Health = 1700,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 6,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ven'kra Tel"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "Venkra.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/JetpackSniper",
 Introduced = "14.7",
 Link = "Ven'kra Tel",
 Missions = { "Orokin Sabotage", "Formido", "Stribog" },
 Name = "Ven'kra Tel",
 Scans = 3,
 Type = "Field Boss",
 Weapons = { "Vulkar" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.15,
 Slash = 0.05,
 },
 TotalDamage = 125,
 StatusChance = 0.1,
 },
 },
 Health = 400,
 Armor = 150,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 16,
 --Multis = { "?" },
 }
 },
 ["Vruush Turret"] = {
 General = {
 Description = "Launches rockets at hostile targets.",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 Image = "EidolonAutoRocketTurret.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/Eidolon/EidolonAutoTurretAgentRocket",
 Introduced = "22",
 Link = "Vruush Turret",
 Name = "Vruush Turret",
 Planets = { "Earth" },
 Scans = 20,
 TileSets = { "Plains of Eidolon" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Rocket Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 BurstCount = 6,
 StatusChance = 0.15,
 }, 
 {
 AttackName = "Rocket AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 30,
 StatusChance = 0,
 }, 
 },
 Health = 1100,
 Armor = 100,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Zeplen = {
 General = {
 Description = "Locks opponenets in a tractor field preventing escape",
 ExcludedFromSimulacrum = true,
 Faction = "Grineer",
 FactionDamageOverride = "",
 Image = "GrnMissilePlatform.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Grineer/GrineerMissilePlatAvatar",
 Introduced = "15",
 Link = "Zeplen",
 Missions = { "Fomorian Sabotage" },
 Name = "Zeplen",
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 400,
 Armor = 2750,
 Affinity = 2000,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
}