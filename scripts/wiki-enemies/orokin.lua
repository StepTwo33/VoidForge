return {
 ["Corrupted Ancient"] = {
 General = {
 Description = "Heavy melee that protects allies with Overguard, or damage reduction if Tenno.",
 Faction = "Orokin",
 Image = "OrokinHealingAncientAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinHealingAncient",
 --Introduced = "?",
 Link = "Corrupted Ancient",
 Name = "Corrupted Ancient",
 Scans = 5,
 Type = "Heavy",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 StatusChance = 0.1,
 },
 },
 Health = 350,
 EximusHealth = 350,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Back Crown: 0.5x" },
 }
 },
 ["Corrupted Bombard"] = {
 General = {
 Abilities = { "Seismic Shockwave" },
 Description = "Long range missile attack",
 Faction = "Orokin",
 Image = "CorruptedBombardNew.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinRocketBombard",
 --Introduced = "?",
 Link = "Corrupted Bombard",
 Name = "Corrupted Bombard",
 Scans = 3,
 Type = "Heavy Ranged",
 Weapons = { "Ogris", "Sheev" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ogris Contact Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 {
 AttackName = "Ogris AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 300,
 EximusHealth = 300,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 4,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Butcher"] = {
 General = {
 Description = "Blade attacks cause Critical Damage",
 Faction = "Orokin",
 Image = "OrokinBladeSawman.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinBladeSawman",
 --Introduced = "?",
 Link = "Corrupted Butcher",
 Name = "Corrupted Butcher",
 Scans = 20,
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
 Health = 100,
 EximusHealth = 100,
 Armor = 5,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Crewman"] = {
 General = {
 Description = "",
 Faction = "Orokin",
 Image = "OrokinRifleSpacemanAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/RifleSpacemanAgent",
 --Introduced = "?",
 Link = "Corrupted Crewman",
 Name = "Corrupted Crewman",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Arca Plasmor", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.7,
 Slash = 0.2,
 },
 TotalDamage = 7,
 Multishot = 7,
 StatusChance = 0.02,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 400,
 StatusChance = 0,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Shield = 120,
 EximusShield = 120,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Drahk"] = {
 General = {
 CodexSecret = true,
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 Image = "CorruptedDrahk.png",
 InternalName = "/Lotus/Types/Enemies/Corrupted/CorruptedCombatKubrowAgent",
 Introduced = "32.2",
 Link = "Corrupted Drahk",
 Missions = { "Conjunction Survival" },
 Name = "Corrupted Drahk",
 Planets = { "Lua" },
 --Scans = ?,
 TileSets = { "Orokin Moon" },
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
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 200,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 2.0x" },
 }
 },
 ["Corrupted Drahk Master"] = {
 General = {
 Description = "He came in search of Void treasure, the Orokin Neural Sentry had other plans.",
 Faction = "Orokin",
 Image = "CorruptedDrahkMaster.png",
 InternalName = "/Lotus/Types/Enemies/Corrupted/CorruptedBeastMaster",
 Introduced = "32.2",
 Link = "Corrupted Drahk Master",
 Missions = { "Conjunction Survival" },
 Name = "Corrupted Drahk Master",
 Planets = { "Lua" },
 Scans = 5,
 TileSets = { "Orokin Moon" },
 Type = "Support / Summoner",
 Weapons = { "Halikar" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Glaive Thrown Damage",
 DamageDistribution = {
 Impact = 0.8,
 Puncture = 0.1,
 Slash = 0.1,
 },
 TotalDamage = 50,
 StatusChance = 0,
 Note = "Attack disarms one of player's weapons"
 },
 },
 Health = 500,
 Armor = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Drone"] = {
 General = {
 Description = "",
 Faction = "Orokin",
 Image = "CorpusAttackDrone.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinDroneAttackAgent",
 --Introduced = "?",
 Link = "Corrupted Drone",
 Name = "Corrupted Drone",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Plasma Repeater" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.7,
 Slash = 0.2,
 },
 TotalDamage = 7,
 StatusChance = 0.02,
 },
 },
 Health = 250,
 Shield = 75,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Heavy Gunner"] = {
 General = {
 Description = "",
 Faction = "Orokin",
 Image = "OrokinHeavyFemaleAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinMinigunBombard",
 --Introduced = "?",
 Link = "Corrupted Heavy Gunner",
 Name = "Corrupted Heavy Gunner",
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
 Slash = 0.1,
 },
 TotalDamage = 8,
 StatusChance = 0.05,
 },
 },
 Health = 700,
 EximusHealth = 700,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 8,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Jackal"] = {
 General = {
 Abilities = { "" },
 Description = "",
 Faction = "Orokin",
 FactionDamageOverride = "Corpus",
 Image = "Jackal.png",
 InternalName = "/Lotus/Types/Enemies/Duviri/Jackal/QuadRobotAgentDuviri",
 Introduced = "33.6",
 Link = "Corrupted Jackal",
 Name = "Corrupted Jackal",
 Scans = 5,
 Type = "Field Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.6,
 Slash = 0.3,
 },
 TotalDamage = 2,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 100,
 Multishot = 6,
 BurstCount = 3,
 StatusChance = 0,
 },
 },
 Health = 2150,
 Armor = 100,
 Shield = 2000,
 Affinity = 1500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Corrupted Lancer"] = {
 General = {
 Description = "",
 Faction = "Orokin",
 Image = "OrokinRifleLancerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/RifleLancer",
 --Introduced = "?",
 Link = "Corrupted Lancer",
 Name = "Corrupted Lancer",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Grataka", "Sheev" },
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
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 400,
 StatusChance = 0,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted MOA"] = {
 General = {
 Abilities = { "Deploy Corrupted Drone" },
 Description = "",
 Faction = "Orokin",
 Image = "OrokinMoaBipedAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinMoaBipedAgent",
 --Introduced = "?",
 Link = "Corrupted MOA",
 Name = "Corrupted MOA",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Beam Damage",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 75,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 150,
 EximusShield = 150,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Corrupted Nullifier"] = {
 General = {
 Description = "Energy shield blocks projectiles and nullifies powers",
 Faction = "Orokin",
 Image = "OrokinNullifySpaceman.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinNullifySpacemanAgent",
 --Introduced = "?",
 Link = "Corrupted Nullifier",
 Name = "Corrupted Nullifier",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Lanka", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.9,
 Slash = 0.05,
 },
 TotalDamage = 75,
 StatusChance = 0.01,
 },
 },
 Health = 50,
 EximusHealth = 90,
 Shield = 40,
 EximusShield = 40,
 Affinity = 150,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corrupted Warden"] = {
 General = {
 Description = "Weak to stealth takedowns",
 Faction = "Orokin",
 Image = "OrokinHeavyFemaleAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/Gamemodes/CorruptedWardenAgent",
 Introduced = "13.2",
 Link = "Corrupted Warden",
 Missions = { "Rescue" },
 Name = "Corrupted Warden",
 Planets = { "Lua" },
 Scans = 3,
 TileSets = { "Orokin Moon" },
 Type = "Ranged",
 Weapons = { "Gorgon", "Vulkar", "Sheev" },
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
 StatusChance = 0.1,
 },
 },
 Health = 600,
 Armor = 500,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Stealth/Finisher: 16.0x", "Head: 3.0x" },
 }
 },
 ["Ember Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Anarch",
 FactionDamageOverride = "",
 Image = "Ember_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantEmberAgent",
 Introduced = "Specters of the Rail",
 Link = "Ember Specter",
 Missions = { "Junction" },
 Name = "Ember Specter",
 Planets = { "Jupiter" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Magnus", "Heat Sword" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.45,
 Puncture = 0.275,
 Slash = 0.275,
 },
 TotalDamage = 20,
 StatusChance = 0.22,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8,
 },
 TotalDamage = 147,
 StatusChance = 0.2,
 },
 },
 Health = 1800,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 20,
 --Multis = { "?" },
 }
 },
 ["Equinox Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantYinYangAgent",
 Image = "Equinox_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantYinYangAvatar",
 Introduced = "Specters of the Rail",
 Link = "Equinox Specter",
 Missions = { "Junction" },
 Name = "Equinox Specter",
 Planets = { "Saturn" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Boltor", "Shaku" },
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
 TotalDamage = 25,
 StatusChance = 0.14,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 -- Puncture = 0.1,
 -- Slash = 0.8,
 },
 TotalDamage = 180,
 StatusChance = 0.34,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 --Multis = { "?" },
 }
 },
 ["Excalibur Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Excalibur_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantExcaliburAvatar",
 Introduced = "Specters of the Rail",
 Link = "Excalibur Specter",
 Missions = { "Junction" },
 Name = "Excalibur Specter",
 Planets = { "Neptune" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Braton Vandal", "Dual Skana" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.35,
 Puncture = 0.05,
 Slash = 0.6,
 },
 TotalDamage = 35,
 StatusChance = 0.16,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7,
 },
 TotalDamage = 120,
 StatusChance = 0.16,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Feyarch Specter"] = {
 General = {
 Abilities = { "Smite", "Hallowed Ground", "Reckoning", "Tornado" },
 Description = "",
 Faction = "Orokin",
 FactionDamageOverride = "/Lotus/Types/Enemies/TennoReplicants/FairyQuest/FairyQuestPaladinAgent",
 Image = "FeyarchOberon.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/FairyQuest/FairyQuestPaladinAvatar",
 Introduced = "The Silver Grove",
 Link = "Feyarch Specter",
 Missions = { "The Silver Grove" },
 Name = "Feyarch Specter",
 Planets = { "Earth" },
 Scans = 1,
 TileSets = { "Grineer Forest" },
 Type = "Specter",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Uncharged Bow Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.75,
 Slash = 0.2,
 },
 TotalDamage = 60,
 StatusChance = 0,
 },
 {
 AttackName = "Charged Bow Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.8,
 Slash = 0.15,
 },
 TotalDamage = 90,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.175,
 Puncture = 0.175,
 Slash = 0.7,
 },
 TotalDamage = 35,
 StatusChance = 0.1,
 },
 },
 Health = 2250,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Frost Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Frost_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantFrostAgent",
 Introduced = "Specters of the Rail",
 Link = "Frost Specter",
 Missions = { "Junction" },
 Name = "Frost Specter",
 Planets = { "Uranus" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Tigris", "Sibear" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.25,
 Slash = 0.6,
 },
 TotalDamage = 17,
 StatusChance = 0.03,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.2592,
 Puncture = 0.074,
 Slash = 0.1852,
 Cold = 0.4815,
 },
 TotalDamage = 270,
 StatusChance = 0.3,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Knave Specter"] = {
 General = {
 Abilities = { "Decoy", "Invisibility", "Switch Teleport", "Radial Disarm" },
 Description = "",
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "LokiKnave.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/FairyQuest/FairyQuestLokiAgent",
 Introduced = "The Silver Grove",
 Link = "Knave Specter",
 Missions = { "The Silver Grove" },
 Name = "Knave Specter",
 Planets = { "Earth" },
 Scans = 1,
 TileSets = { "Grineer Forest" },
 Type = "Specter",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.1,
 Slash = 0.85,
 },
 TotalDamage = 8,
 StatusChance = 0,
 },
 },
 Health = 1250,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Loki Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Loki_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantLokiAgent",
 Introduced = "Specters of the Rail",
 Link = "Loki Specter",
 Missions = { "Junction" },
 Name = "Loki Specter",
 Planets = { "Earth" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Burston", "Boltace" },
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
 TotalDamage = 30,
 BurstCount = 3,
 StatusChance = 0.18,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1,
 },
 TotalDamage = 176,
 StatusChance = 0.28,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 10,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Mag Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Mag_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantMagAgent",
 Introduced = "Specters of the Rail",
 Link = "Mag Specter",
 Missions = { "Junction" },
 Name = "Mag Specter",
 Planets = { "Mars" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Hikou", "Tipedo" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.6,
 Slash = 0.3,
 },
 TotalDamage = 26,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8,
 },
 TotalDamage = 124,
 StatusChance = 0.2,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 20,
 --Multis = { "?" },
 }
 },
 ["Mesa Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Anarch",
 FactionDamageOverride = "",
 Image = "Mesa_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/JunctionRework/MesaJunctionBossAvatar",
 Introduced = "Specters of the Rail",
 Link = "Mesa Specter",
 Missions = { "Junction" },
 Name = "Mesa Specter",
 Planets = { "Pluto" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Regulators", "Redeemer" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7,
 },
 TotalDamage = 5,
 BurstCount = 2,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.2,
 Slash = 0.7,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 5000,
 BaseLevel = 1,
 SpawnLevel = 40,
 --Multis = { "?" },
 }
 },
 ["Nova Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Nova_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantNovaAgent",
 Introduced = "Specters of the Rail",
 Link = "Nova Specter",
 Missions = { "Junction" },
 Name = "Nova Specter",
 Planets = { "Jupiter" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Kunai", "Ether Daggers" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.75,
 Slash = 0.15,
 },
 TotalDamage = 46,
 StatusChance = 0.08,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.15,
 Slash = 0.7,
 },
 TotalDamage = 224,
 StatusChance = 0.3,
 },
 },
 Health = 1800,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 --Multis = { "?" },
 }
 },
 ["Orokin Drone"] = {
 General = {
 Description = "",
 Faction = "Orokin",
 Image = "OrokinShieldDroneAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinShieldDroneAgent",
 --Introduced = "?",
 Link = "Orokin Drone",
 Name = "Orokin Drone",
 Scans = 20,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.7,
 Slash = 0.2,
 },
 TotalDamage = 7,
 StatusChance = 0.02,
 },
 },
 Health = 25,
 EximusHealth = 80,
 Shield = 50,
 EximusShield = 50,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Orokin Sentry"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 Image = "OrokinSentry.png",
 InternalName = "/Lotus/Types/Enemies/Orokin/OrokinAutoTurretAgent",
 --Introduced = "?",
 Link = "Orokin Sentry",
 Name = "Orokin Sentry",
 Planets = { "Void" },
 Scans = 20,
 TileSets = { "Orokin Tower" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.7,
 Slash = 0.2,
 },
 TotalDamage = 7,
 StatusChance = 0.02,
 },
 },
 Health = 80,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Orokin Spectator"] = {
 General = {
 Description = "Detects intruders",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 Image = "OrokinShieldDroneAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Grineer/AIWeek/CameraDroneAgentOrokin",
 Introduced = "18",
 Link = "Orokin Spectator",
 Missions = { "Spy" },
 Name = "Orokin Spectator",
 Planets = { "Lua" },
 Scans = 20,
 TileSets = { "Orokin Moon" },
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.7,
 Slash = 0.2,
 },
 TotalDamage = 7,
 StatusChance = 0.02,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 50,
 EximusShield = 50,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Orphid Specter"] = {
 General = {
 Abilities = { "Molt", "Spores", "Miasma" },
 Description = "",
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "OrphidSaryn.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/FairyQuest/FairyQuestSarynAgent",
 Introduced = "The Silver Grove",
 Link = "Orphid Specter",
 Missions = { "The Silver Grove" },
 Name = "Orphid Specter",
 Planets = { "Earth" },
 Scans = 1,
 TileSets = { "Grineer Forest" },
 Type = "Specter",
 Weapons = { "Zhuge", "Sword" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.75,
 Slash = 0.2,
 },
 TotalDamage = 12,
 StatusChance = 0.35,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0.15,
 },
 },
 Health = 1500,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Rhino Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Rhino_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantRhinoAgent",
 Introduced = "Specters of the Rail",
 Link = "Rhino Specter",
 Missions = { "Junction" },
 Name = "Rhino Specter",
 Planets = { "Venus" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Soma", "Dual Raza" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.4,
 Slash = 0.5,
 },
 TotalDamage = 5,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.3,
 Slash = 0.6,
 },
 TotalDamage = 15,
 StatusChance = 0.05,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 8,
 --Multis = { "?" },
 }
 },
 ["Saryn Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Saryn_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantSarynAgent",
 Introduced = "Specters of the Rail",
 Link = "Saryn Specter",
 Missions = { "Junction" },
 Name = "Saryn Specter",
 Planets = { "Pluto" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Komorex", "Karyst" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.25,
 Puncture = 0.25,
 Slash = 0.25,
 Viral = 0.25
 },
 TotalDamage = 24,
 StatusChance = 0.33,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1099,
 Puncture = 0.3077,
 Slash = 0.2637,
 Toxin = 0.3186,
 },
 TotalDamage = 273,
 StatusChance = 0.26,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 35,
 --Multis = { "?" },
 }
 },
 ["Trinity Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Trinity_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantTrinityAgent",
 Introduced = "Specters of the Rail",
 Link = "Trinity Specter",
 Missions = { "Junction" },
 Name = "Trinity Specter",
 Planets = { "Mars" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Paris", "Cadus" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Uncharged Bow Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.75,
 Slash = 0.2,
 },
 TotalDamage = 160,
 StatusChance = 0,
 },
 {
 AttackName = "Charged Bow Damage",
 DamageDistribution = {
 Impact = 0.05,
 Puncture = 0.75,
 Slash = 0.2,
 },
 TotalDamage = 320,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.5833,
 Electric = 0.4615
 },
 TotalDamage = 65,
 StatusChance = 0.25,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 15,
 --Multis = { "?" },
 }
 },
 ["Valkyr Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Orokin",
 FactionDamageOverride = "",
 Image = "Valkyr_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/RelayBoss/TennoReplicantBerserkerAgent",
 Introduced = "Specters of the Rail",
 Link = "Valkyr Specter",
 Missions = { "Junction" },
 Name = "Valkyr Specter",
 Planets = { "Ceres" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Afuris", "Anku" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.7,
 Slash = 0.15,
 },
 TotalDamage = 20,
 StatusChance = 0.12,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.15,
 Puncture = 0.8,
 Slash = 0.05,
 },
 TotalDamage = 170,
 StatusChance = 0.1,
 },
 },
 Health = 3000,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 25,
 --Multis = { "?" },
 }
 },
 ["Volt Specter"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Anarch",
 FactionDamageOverride = "",
 Image = "Volt_Thumb.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/JunctionRework/VoltJunctionBossAvatar",
 Introduced = "Specters of the Rail",
 Link = "Volt Specter",
 Missions = { "Junction" },
 Name = "Volt Specter",
 Planets = { "Earth" },
 Scans = 1,
 Type = "Specter",
 Weapons = { "Magnus", "Heat Sword" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.12,
 Puncture = 0.3,
 Slash = 0.58,
 },
 TotalDamage = 3,
 StatusChance = 0,
 },
 },
 Health = 7100,
 Armor = 50,
 Affinity = 5000,
 BaseLevel = 1,
 SpawnLevel = 8,
 --Multis = { "?" },
 }
 },
}