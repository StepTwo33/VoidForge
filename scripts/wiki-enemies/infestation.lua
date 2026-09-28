return {
 ["Ancient Disruptor"] = {
 General = {
 Description = "Heavy melee unit with a disrupting attack.",
 Faction = "Infested",
 Image = "DisrupterAncientDE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/AncientAvatar",
 Introduced = "Vanilla",
 Link = "Ancient Disruptor",
 Name = "Ancient Disruptor",
 Planets = { "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ceres", "Eris", "Sedna", "Europa", "Phobos", "Deimos" },
 Scans = 5,
 Type = "Heavy",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Magnetic = 1
 },
 TotalDamage = 15,
 StatusChance = 0,
 Note = "Drains energy off player if hit"
 },
 },
 Health = 400,
 EximusHealth = 400,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Back Crown: 0.5x" },
 }
 },
 ["Ancient Healer"] = {
 General = {
 Description = "Heavy melee that applies damage reduction buff to allies.",
 Faction = "Infested",
 Image = "HealerAncientDE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/HealingAncient",
 Introduced = "Vanilla",
 Link = "Ancient Healer",
 Name = "Ancient Healer",
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
 Health = 400,
 EximusHealth = 400,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Back Crown: 0.5x" },
 }
 },
 ["Ancient Infested"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "Ancient Infested WB.png",
 InternalName = "",
 Introduced = "10",
 Link = "Lephantis",
 Missions = { "Magnacidium" },
 Name = "Ancient Infested",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Orokin Derelict" },
 Type = "Boss",
 Weapons = { "Sticky Bombs" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ancient Infested Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 30,
 Multishot = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Ancient Infested Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Ancient Protector"] = {
 General = {
 Description = "Heavy melee unit that protects allies with Overguard, or damage reduction if Tenno.",
 Faction = "Infested",
 Image = "AncientProtector.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/ProtectorAncient",
 Introduced = "38",
 Link = "Ancient Protector",
 Name = "Ancient Protector",
 Planets = { "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ceres", "Eris", "Sedna", "Europa", "Phobos", "Deimos" },
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
 Health = 400,
 EximusHealth = 400,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Back Crown: 0.5x" },
 }
 },
 ["Arcane Boiler"] = {
 General = {
 Description = "Riddled with boils that erupt into spawn pods when hit",
 Faction = "Infested",
 Image = "ArcaneBoiler.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/SpawningAncientMiniboss",
 Introduced = "15.13",
 Link = "Boiler#Arcane",
 Missions = { "Stolen Dreams" },
 Name = "Arcane Boiler",
 Scans = 1,
 TileSets = { "Orokin Derelict" },
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
 TotalDamage = 15,
 StatusChance = 0.1,
 },
 },
 Health = 2200,
 Affinity = 3000,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Attack Mutalist"] = {
 General = {
 Description = "Fires infested spores",
 Faction = "Infested",
 Image = "Attack Mutalist.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Infested/InfestedAttackDrone",
 Introduced = "17.5",
 Link = "Attack Mutalist",
 Missions = { "Jordas Golem Assassanation" },
 Name = "Attack Mutalist",
 Scans = 20,
 Type = "Ranged",
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
 TotalDamage = 3,
 StatusChance = 0.1,
 },
 },
 Health = 65,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Basal Diploid"] = {
 General = {
 Description = "Deaf, Dumb and Blind, it hunts prey using vibrations from the surrounding environment.",
 Faction = "Infested Deimos",
 Image = "BasalDiploid.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Splitter/SplitterSplitAgent",
 Introduced = "29.5",
 Link = "Basal Diploid",
 Name = "Basal Diploid",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.5,
 Slash = 0.5,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 },
 Health = 200,
 EximusHealth = 275,
 Armor = 125,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Body:0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Basal Diploid Rex"] = {
 General = {
 Description = "Deaf, Dumb and Blind, it hunts prey using vibrations from the surrounding environment.",
 Faction = "Infested Deimos",
 Image = "BasalDiploidRex.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Splitter/SplitterSplitAgentVIP",
 Introduced = "29.5",
 Link = "Basal Diploid#Rex",
 Missions = { "Necralisk Bounty" },
 Name = "Basal Diploid Rex",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.5,
 Slash = 0.5,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 },
 Health = 750,
 Armor = 500,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Body:0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Blighted Maggot"] = {
 General = {
 Description = "Rare Maggots that thrive in the toxic mist of infested fissures deep in the ruins of Deimos",
 Faction = "Infested",
 Image = "DEMaggot.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/RusherAgentMist",
 Introduced = "29.5",
 Link = "Maggot#Blighted",
 Missions = { "Arcana Isolation Vault Bounty" },
 Name = "Blighted Maggot",
 Planets = { "Deimos" },
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 20,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Boiler = {
 General = {
 Description = "Riddled with boils that erupt into spawn pods when hit",
 Faction = "Infested",
 Image = "PussAncient.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/SpawningAncient",
 Introduced = "15.5",
 Link = "Boiler",
 Name = "Boiler",
 Scans = 5,
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
 TotalDamage = 15,
 StatusChance = 0.1,
 },
 },
 Health = 1200,
 EximusHealth = 1000,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 12,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Brood Mother"] = {
 General = {
 Description = "Spawns maggots that attack its target",
 Faction = "Infested",
 Image = "DiseasedAncient.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/DiseasedAncient",
 Introduced = "15.5",
 Link = "Brood Mother",
 Name = "Brood Mother",
 Scans = 5,
 Type = "",
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
 Health = 700,
 EximusHealth = 600,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 12,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Carrion Charger"] = {
 General = {
 Description = "Spawned the body of a creature killed by infested, these charges are fast with weak claw attacks.",
 Faction = "Infested",
 Image = "CarrionCharger.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/QuadrupedColonist",
 Introduced = "19.12",
 Link = "Charger#Carrion",
 Missions = { "Defection" },
 Name = "Carrion Charger",
 Planets = { "Phobos", "Saturn", "Neptune" },
 Scans = 3,
 TileSets = { "Grineer Asteroid", "Grineer Galleon", "Infested Ship" },
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
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.25,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 80,
 EximusHealth = 80,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 Charger = {
 General = {
 Description = "Fast with weak claw attacks",
 Faction = "Infested",
 Image = "QuadrupedAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/Quadruped",
 Introduced = "6",
 Link = "Charger",
 Name = "Charger",
 Scans = 20,
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
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 80,
 EximusHealth = 80,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 Chroma = {
 General = {
 Abilities = { "Spectral Scream", "Elemental Ward", "Vex Armor", "Effigy" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "Chroma.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/TennoReplicantChromaAgent",
 Introduced = "16",
 Link = "Chroma",
 Missions = { "The New Strange" },
 Name = "Chroma",
 Scans = 1,
 Type = "Specter",
 Weapons = { "Dera", "Plasma Sword" },
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
 TotalDamage = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1683,
 Puncture = 0.0594,
 Slash = 0.4356,
 Electricity = 0.3267
 },
 TotalDamage = 202,
 StatusChance = 0.18,
 }
 },
 Health = 2000,
 Shield = 1000,
 Armor = 200,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Crawler = {
 General = {
 Description = "Weak claw attacks",
 Faction = "Infested",
 Image = "CrawlerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Crawlers/MeleeCrawler",
 --Introduced = "?",
 Link = "Crawler",
 Name = "Crawler",
 Scans = 30,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 10,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Deimos Ancient Healer"] = {
 General = {
 Description = "Heavy melee that applies damage reduction buff to allies.",
 Faction = "Infested Deimos",
 Image = "HealingAncientMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/HealingAncientMicroPlanet",
 Introduced = "29",
 Link = "Ancient Healer#Deimos",
 Name = "Deimos Ancient Healer",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
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
 Health = 400,
 EximusHealth = 400,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Deimos Brood Mother"] = {
 General = {
 Description = "Spawns maggots that attack its target",
 Faction = "Infested Deimos",
 Image = "DiseasedAncient.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/DiseasedAncientMicroPlanet",
 Introduced = "29",
 Link = "Brood Mother#Deimos",
 Name = "Deimos Brood Mother",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
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
 Health = 500,
 EximusHealth = 600,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Deimos Carnis"] = {
 General = {
 Description = "Carnis are many-legged hunters, ferocious and ever-hungry. They scuttle just out of reach trying to wear down their prey with ranged attacks until they can rush in to consume it.",
 Faction = "Infested Deimos",
 Image = "AshenAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Ashen/AshenAgent",
 Introduced = "29",
 Link = "Deimos Carnis",
 Name = "Deimos Carnis",
 Planets = { "Deimos" },
 Scans = 30,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 3,
 StatusChance = 0.1,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 600,
 EximusHealth = 600,
 Armor = 50,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Carnis Rex"] = {
 General = {
 Description = "The Carnis Rex is a true terror, a monstrously-large Carnis. The Carneis Rex rushes headlong upon their prey, often coiling into a spinning wheel in its haste to come to grips.",
 Faction = "Infested Deimos",
 Image = "AshenBigAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Ashen/AshenBigAgent",
 Introduced = "29",
 Link = "Deimos Carnis#Rex",
 Missions = { "Necralisk Bounty" },
 Name = "Deimos Carnis Rex",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 0.5,
 Slash = 0.5,
 },
 TotalDamage = 60,
 StatusChance = 0.1,
 },
 },
 Health = 1200,
 Armor = 150,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Charger"] = {
 General = {
 Description = "Fast with weak claw attacks",
 Faction = "Infested Deimos",
 Image = "QuadrupedMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/QuadrupedMicroPlanet",
 Introduced = "29",
 Link = "Charger#Deimos",
 Name = "Deimos Charger",
 Planets = { "Deimos" },
 Scans = 20,
 TileSets = { "Cambion Drift" },
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
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Toxin = 1
 },
 TotalDamage = 1,
 StatusChance = 0.2,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 80,
 EximusHealth = 80,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Lancer Head: 3.0x", "Face: 0.2x", "Carapace: 0.05x" },
 }
 },
 ["Deimos Genetrix"] = {
 General = {
 Description = "Genetrix act as mobile wombs for the Infested hordes, discharging swarms of Infested whenever they detect a non-Infested intruder. A Genetrix prominent sensor stalk must be disabled or avoided to stem a seemingly unending tide of monsters.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested Deimos",
 Image = "InfestedBigDropShipAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Dropship/InfestedBigDropshipAgent",
 Introduced = "29",
 Link = "Deimos Genetrix",
 Name = "Deimos Genetrix",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 6000,
 Armor = 600,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Juggernaut"] = {
 General = {
 Abilities = { "Charge", "Infested Spawn Tar", "Poison Rain", "Quill Shot" },
 Description = "Protected by impenetrable armor.",
 Faction = "Infested Deimos",
 Image = "JuggernautMicroPlanetCasualAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/JuggernautMicroPlanetCasual",
 Introduced = "29",
 Link = "Juggernaut#Deimos",
 Name = "Deimos Juggernaut",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 10,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.7,
 Slash = 0.1,
 },
 TotalDamage = 3,
 StatusChance = 0.02,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 2000,
 EximusHealth = 2000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Maw: 10.0x", "Belly: 10.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Jugulus"] = {
 General = {
 Description = "A writhing tower of flesh and gristle, the Jugulus lurks beneath the surface and emerges to launch streams of organic projectiles from its wide maw.",
 Faction = "Infested Deimos",
 Image = "BoneBladeAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/GreyStrain/BoneBlade/BoneBladeAgent",
 Introduced = "29",
 Link = "Deimos Jugulus",
 Name = "Deimos Jugulus",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 1200,
 EximusHealth = 1200,
 Armor = 300,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Jugulus Rex"] = {
 General = {
 Faction = "Infested Deimos",
 Image = "BoneBladeBossAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/GreyStrain/BoneBlade/BoneBladeBossAgent",
 Introduced = "30.5",
 Link = "Deimos Jugulus#Rex",
 Missions = { "Necralisk Bounty" },
 Name = "Deimos Jugulus Rex",
 Planets = { "Deimos" },
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 2000,
 Armor = 300,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Head: 2.0x", "Body: 0.5X" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Leaper"] = {
 General = {
 --Description = "?",
 Faction = "Infested Deimos",
 Image = "LeapingSuicideRunnerAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/LeapingSuicideRunner",
 Introduced = "29",
 Link = "Leaper#Deimos",
 Name = "Deimos Leaper",
 Planets = { "Deimos" },
 Scans = 30,
 TileSets = { "Cambion Drift" },
 Type = "Melee/Knockdown",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Toxin = 1
 },
 TotalDamage = 1,
 StatusChance = 0.2,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 100,
 Affinity = 35,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Deimos Leaping Thrasher"] = {
 General = {
 Description = "An ancient brute possessed of a weighty arm-flail and the terrifying strength to use it to devastating effect. Its lumbering form belies shocking speed, which the Leaping Thrasher achieves by slamming its arm into the ground and throwing itself into battle.",
 Faction = "Infested Deimos",
 Image = "AncientTankMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/AncientTankMicroPlanetAgent",
 Introduced = "29",
 Link = "Leaping Thrasher#Deimos",
 Name = "Deimos Leaping Thrasher",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
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
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 440,
 EximusHealth = 440,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Upper Head: 1.0x", "Upper Hardened Body: 0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Mutalist Osprey Carrier"] = {
 General = {
 Description = "Carries energy cells",
 Faction = "Infested Deimos",
 Image = "CellCarrierDroneMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/CellCarrierDroneMicroPlanet",
 Introduced = "29",
 Link = "Mutalist Osprey Carrier#Deimos",
 Missions = { "Excavation" },
 Name = "Deimos Mutalist Osprey Carrier",
 Planets = { "Deimos" },
 Scans = 10,
 TileSets = { "Cambion Drift" },
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
 Slash = 0.3334,
 },
 TotalDamage = 3,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Deimos Runner"] = {
 General = {
 Description = "Fast with weak claw attacks",
 Faction = "Infested Deimos",
 Image = "RunnerMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/MeleeMicroPlanetRunner",
 Introduced = "29",
 Link = "Runner#Deimos",
 Name = "Deimos Runner",
 Planets = { "Deimos" },
 Scans = 30,
 TileSets = { "Cambion Drift" },
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
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Toxin = 1
 },
 TotalDamage = 1,
 StatusChance = 0.2,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 100,
 EximusHealth = 100,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Deimos Saxum"] = {
 General = {
 Description = "Saxum are bipedal, medium-sized assailants capable of short-ranged attacks and a powerful grand slam in melee.",
 Faction = "Infested Deimos",
 Image = "InfestedFemurAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/GreyStrain/Femur/InfestedFemurAgent",
 Introduced = "29",
 Link = "Deimos Saxum",
 Name = "Deimos Saxum",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 10,
 BurstCount = 4,
 StatusChance = 0,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 5,
 StatusChance = 0,
 Note = "Shot damage is bundled with AoE damage"
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 0.5,
 Slash = 0.5,
 },
 TotalDamage = 60,
 StatusChance = 0.1,
 },
 },
 Health = 750,
 EximusHealth = 550,
 Armor = 70,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "First Femur: 1.0x", "Second Femur: 2.0x", "Broken Femurs: 2.0x" ,"Body with unbroken Femur: 0.2x", "Body with broken Femurs: 1.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Saxum Rex"] = {
 General = {
 Description = "Saxum Rex are larger, meaner Saxum and represent a considerably enhanced threat. How they achieve this evolution is unknown, but cannibalism is suspected.",
 Faction = "Infested Deimos",
 Image = "FemurAssassinateTargetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/FemurAssassinateTargetAgent",
 Introduced = "29",
 Link = "Deimos Saxum#Rex",
 Missions = { "Necralisk Bounty" },
 Name = "Deimos Saxum Rex",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 10,
 BurstCount = 4,
 StatusChance = 0,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 5,
 StatusChance = 0,
 Note = "Shot damage is bundled with AoE damage"
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 0.5,
 Slash = 0.5,
 },
 TotalDamage = 60,
 StatusChance = 0.1,
 },
 },
 Health = 900,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "First Femur: 1.0x", "Second Femur: 2.0x", "Broken Femurs: 2.0x" ,"Body with unbroken Femur: 0.2x", "Body with broken Femurs: 1.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Swarm Mutalist MOA"] = {
 General = {
 Description = "Discharges swarms of infested spores",
 Faction = "Infested Deimos",
 Image = "NaniteCloudBipedMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/NaniteCloudBipedMicroPlanet",
 Introduced = "29",
 Link = "Swarm Mutalist MOA#Deimos",
 Missions = { "Shrine Defence" },
 Name = "Deimos Swarm Mutalist MOA",
 Planets = { "Earth" },
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 10,
 BurstCount = 3,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 10,
 StatusChance = 0.05,
 Note = "Shot damage is bundled with AoE damage"
 },
 },
 Health = 350,
 EximusHealth = 275,
 Affinity = 150,
 BaseLevel = 12,
 --Multis = { "?" },
 }
 },
 ["Deimos Tendril Drone"] = {
 General = {
 Description = "An infested drone as brutal and unforgiving as Deimos itself.",
 Faction = "Infested Deimos",
 Image = "InfestedTendrilDroneAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Drones/Tendril/InfestedTendrilDroneAgent",
 Introduced = "29",
 Link = "Deimos Tendril Drone",
 Name = "Deimos Tendril Drone",
 Planets = { "Deimos" },
 Scans = 10,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 15,
 StatusChance = 0.03,
 },
 },
 Health = 60,
 Armor = 150,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Deimos Therid"] = {
 General = {
 Description = "The cunning Therid uses its long arms to spin a ball of corrosive gossamer that it hurls with a surprising force. It has also been known to scoop up smaller infested to throw at intruders as an improvised projectile/delivery system.",
 Faction = "Infested Deimos",
 Image = "AncientShellAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Emissary/AncientShellAgent",
 Introduced = "29",
 Link = "Deimos Therid",
 Name = "Deimos Therid",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 800,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Upper Hardened Body: 0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Undying Flyer"] = {
 General = {
 Description = "An Infested jetpack trooper, the Undying Flyer rams opponents at high speed. When killed it reverts to a pod-state. If not destroyed the Undying Flyer emerges at full health.",
 Faction = "Infested Deimos",
 Image = "UndyingFlyer.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Oni/InfestedJetpackMicroPlanetOni",
 Introduced = "29",
 Link = "Undying Flyer#Deimos",
 Missions = { "Shrine Defence" },
 Name = "Deimos Undying Flyer",
 Planets = { "Earth" },
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 14,
 StatusChance = 0.05,
 },
 },
 Health = 400,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 0.0x", "Jetpack: 0.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Deimos Venin Mutalist"] = {
 General = {
 Description = "Fires infested spores",
 Faction = "Infested Deimos",
 Image = "InfestedAttackDroneMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/InfestedAttackDroneMicroPlanet",
 Introduced = "29",
 Link = "Venin Mutalist#Deimos",
 Name = "Deimos Venin Mutalist",
 Planets = { "Deimos" },
 Scans = 10,
 TileSets = { "Cambion Drift" },
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
 Slash = 0.3334,
 },
 TotalDamage = 3,
 StatusChance = 0.1,
 },
 },
 Health = 160,
 EximusHealth = 160,
 Affinity = 100,
 BaseLevel = 5,
 Multis = { "" },
 }
 },
 ["Demolisher Boiler"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Infested",
 Image = "DemolisherBoiler.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Disruption/DisruptionBoilerAgent",
 Introduced = "25.7",
 Link = "Boiler#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Boiler",
 Planets = { "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Galleon" },
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
 TotalDamage = 15,
 StatusChance = 0.1,
 },
 },
 Health = 3000,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 ProcResists = { "Viral", "Radiation" },
 }
 },
 ["Demolisher Charger"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Infested",
 Image = "DemolisherCharger.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Disruption/DisruptionQuadrupedAgent",
 Introduced = "25.7",
 Link = "Charger#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Charger",
 Planets = { "Uranus" },
 Scans = 20,
 TileSets = { "Grineer Galleon" },
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
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.25,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 2500,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Viral", "Radiation" },
 }
 },
 ["Demolisher Juggernaut"] = {
 General = {
 Abilities = { "Charge", "Infested Spawn Tar", "Poison Rain", "Quill Shot" },
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Infested",
 Image = "DemolisherJuggernaut.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Disruption/DisruptionJuggernautAgent",
 Introduced = "25.7",
 Link = "Juggernaut#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Juggernaut",
 Planets = { "Uranus" },
 Scans = 3,
 TileSets = { "Grineer Galleon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 10,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.7,
 Slash = 0.1,
 },
 TotalDamage = 3,
 StatusChance = 0.02,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 1000,
 Armor = 50,
 Affinity = 1500,
 BaseLevel = 1,
 Multis = { "Maw: 10.0x", "Belly: 10.0x", "Boils: 0.5x" },
 ProcResists = { "Viral", "Radiation" },
 SteelPathHealthBonus = 2000,
 }
 },
 ["Demolisher Thrasher"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Infested",
 Image = "DemolisherThrasher.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Disruption/DisruptionAncientTankAgent",
 Introduced = "25.7",
 Link = "Leaping Thrasher#Demolisher",
 Missions = { "Disruption" },
 Name = "Demolisher Thrasher",
 Planets = { "Uranus" },
 Scans = 5,
 TileSets = { "Grineer Galleon" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 },
 Health = 3250,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Upper Hardened Body: 0.5x" },
 ProcResists = { "Viral", "Radiation" },
 }
 },
 ["Electric Crawler"] = {
 General = {
 Description = "Shock nearby enemies with a bio-electrical attack",
 Faction = "Infested",
 Image = "DEElectricCrawler.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Crawlers/LightningCrawler",
 Introduced = "10.5",
 Link = "Electric Crawler",
 Name = "Electric Crawler",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Lightning Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 20,
 StatusChance = 0.1,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Feral Diploid"] = {
 General = {
 Description = "Dismembered, but deadly nonetheless. It's acrobatic movement makes it threatening from any range.",
 Faction = "Infested Deimos",
 Image = "FeralDiploid.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Splitter/SplitterTopSplitAgent",
 Introduced = "29.5",
 Link = "Feral Diploid",
 Name = "Feral Diploid",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 22,
 StatusChance = 0,
 },
 },
 Health = 200,
 EximusHealth = 200,
 Armor = 125,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Body:0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Feral Diploid Rex"] = {
 General = {
 Description = "Dismembered, but deadly nonetheless. It's acrobatic movement makes it threatening from any range.",
 Faction = "Infested Deimos",
 Image = "FeralDiploidRex.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Splitter/SplitterTopSplitAgentVIP",
 Introduced = "29.5",
 Link = "Feral Diploid#Rex",
 Missions = { "Necralisk Bounty" },
 Name = "Feral Diploid Rex",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 22,
 StatusChance = 0,
 },
 },
 Health = 600,
 Armor = 500,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Body:0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Frozen Infested Hive"] = {
 General = {
 Description = "Generates a coldness that reduces shields.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "InfestedHiveA.png",
 InternalName = "",
 Introduced = "13.8",
 Link = "Frozen Infested Hive",
 Missions = { "Hive", "Hidden Messages", "Patient Zero" },
 Name = "Frozen Infested Hive",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 4500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Gas Infested Hive"] = {
 General = {
 Description = "Emits clouds of noxious gas.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "InfestedHiveB.png",
 InternalName = "",
 Introduced = "13.8",
 Link = "Gas Infested Hive",
 Missions = { "Hive", "Hidden Messages", "Patient Zero" },
 Name = "Gas Infested Hive",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 4500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Hemocyte = {
 General = {
 Description = "Hemocyte",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "EidolonLephantis.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Eidolon/EidolonLephantisAgent",
 Introduced = "22.3",
 Link = "Hemocyte",
 Missions = { "Operation: Plague Star" },
 Name = "Hemocyte",
 Planets = { "Earth" },
 Scans = 3,
 TileSets = { "Plains of Eidolon" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ancient Infested Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 30,
 Multishot = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Ancient Infested Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Corpus Grenade Contact Damage",
 DamageDistribution = {
 Blast = 1,
 },
 BurstCount = 8,
 TotalDamage = 100,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Corpus Grenade AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 BurstCount = 8,
 TotalDamage = 60,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Grineer Melee Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.15,
 Slash = 0.25,
 },
 TotalDamage = 100,
 StatusChance = 0.1,
 },
 },
 Health = 5000,
 Armor = 175,
 Affinity = 3500,
 BaseLevel = 1,
 SpawnLevel = 117,
 --Multis = { "?" },
 }
 },
 ["Infested Corpus"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "Infested Corpus WB.png",
 InternalName = "",
 Introduced = "10",
 Link = "Lephantis",
 Missions = { "Magnacidium" },
 Name = "Infested Corpus",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Orokin Derelict" },
 Type = "Boss",
 Weapons = { "Toxin Grenade", "Spawn Infested Pod" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Infested Corpus Grenade Contact Damage",
 DamageDistribution = {
 Blast = 1,
 },
 BurstCount = 8,
 TotalDamage = 100,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Corpus Grenade AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 BurstCount = 8,
 TotalDamage = 60,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Infested Grineer"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "Infested Grineer WB.png",
 InternalName = "",
 Introduced = "10",
 Link = "Lephantis",
 Missions = { "Magnacidium" },
 Name = "Infested Grineer",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Orokin Derelict" },
 Type = "Boss",
 Weapons = { "Scythe" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Infested Grineer Melee Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.15,
 Slash = 0.25,
 },
 TotalDamage = 100,
 StatusChance = 0.1,
 },
 },
 Health = 1200,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Infested Mesa"] = {
 General = {
 Abilities = { "Ballistic Battery", "Shooting Gallery", "Shatter Shield", "Peacemaker" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "RogueGunslinger.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/TennoReplicantGunslingerAgent",
 Introduced = "15.5",
 Link = "Infested Mesa",
 Missions = { "Patient Zero" },
 Name = "Infested Mesa",
 Scans = 1,
 Type = "Specter",
 Weapons = { "Regulators", "Plasma Sword" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Puncture = 0.25,
 Slash = 0.25,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1683,
 Puncture = 0.0594,
 Slash = 0.4356,
 Electricity = 0.3267
 },
 TotalDamage = 202,
 StatusChance = 0.18,
 }
 },
 Health = 1700,
 Shield = 1000,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Infested Oni"] = {
 General = {
 CodexSecret = false,
 Description = "An Infested beast of considerable strength long rumored to be lying dormant in the muck off the shores of Cetus.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested Deimos",
 Image = "AshenBigAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Oni/InfestedOniAgent",
 Introduced = "37",
 Link = "Infested Oni",
 Missions = { "Shrine Defense" },
 Planets = { "Earth" },
 Scans = 3,
 TileSets = {},
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 0.5,
 Slash = 0.5,
 },
 TotalDamage = 60,
 StatusChance = 0.1,
 },
 },
 Health = 10000,
 Armor = 2000,
 Affinity = 500,
 BaseLevel = 15,
 SpawnLevel = "15",
 Multis = { "" },
 ProcResists = { "Viral" },
 }
 },
 ["J3 Jordas Golem"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "J3GolemRaid.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Vip/J3Golem/J3GolemSpaceAgent",
 --Introduced = "?",
 Link = "J3 Jordas Golem",
 Name = "J3 Jordas Golem",
 --Scans = ?,
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 20000,
 Armor = 100,
 Affinity = 1500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Jack O'Naut"] = {
 General = {
 Abilities = { "Charge", "Infested Spawn Tar", "Poison Rain" },
 Faction = "Infested",
 Image = "Jack_O'_Naut.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/JuggernautTacAlert",
 Introduced = "Recurring Nightmares",
 Link = "Juggernaut#Jack O'Naut",
 Missions = { "Hallowed Nightmares" },
 Name = "Jack O'Naut",
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 10,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.7,
 Slash = 0.1,
 },
 TotalDamage = 3,
 StatusChance = 0.02,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 2000,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 2,
 Multis = { "" },
 }
 },
 ["Jordas Golem"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "J3Golem.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Vip/J3Golem/JuniorGolemSpaceAgent",
 --Introduced = "?",
 Link = "Jordas Golem",
 Missions = { "Jordas Golem Assassinate" },
 Name = "Jordas Golem",
 Planets = { "Eris" },
 Scans = 3,
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 20000,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 32,
 Multis = { "Body: 0.0x", "Engine: 1.0x" },
 FactionScaling = "Default"
 }
 },
 Juggernaut = {
 General = {
 Abilities = { "Charge", "Infested Spawn Tar", "Poison Rain", "Quill Shot" },
 Description = "Protected by impenetrable armor.",
 Faction = "Infested",
 Image = "Juggernaut.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/Juggernaut",
 Introduced = "16.7",
 Link = "Juggernaut",
 Name = "Juggernaut",
 Scans = 3,
 Type = "Field Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 10,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.7,
 Slash = 0.1,
 },
 TotalDamage = 3,
 StatusChance = 0.02,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 900,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 15,
 Multis = { "Maw: 10.0x", "Belly: 10.0x" },
 ProcResists = { "Viral" },
 SteelPathHealthBonus = 1800,
 }
 },
 ["Juggernaut Behemoth"] = {
 General = {
 Abilities = { "Charge", "Infested Spawn Tar", "Poison Rain", "Quill Shot" },
 Description = "Protected by impenetrable armor.",
 Faction = "Infested",
 Image = "JuggernautBoss.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/JuggernautBoss",
 Introduced = "16.7.1",
 Link = "Juggernaut Behemoth",
 Missions = { "Assassination", "Jordas Golem Assassinate" },
 Name = "Juggernaut Behemoth",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 10,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.7,
 Slash = 0.1,
 },
 TotalDamage = 3,
 StatusChance = 0.02,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 1500,
 Armor = 300,
 Affinity = 3500,
 BaseLevel = 15,
 Multis = { "Maw: 10.0x", "Belly: 10.0x" },
 SteelPathHealthBonus = 3000,
 }
 },
 ["Lancing Infested Hive"] = {
 General = {
 Description = "Emits a deadly laser.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "", 
 Image = "InfestedHiveD.png",
 InternalName = "",
 Introduced = "13.8",
 Link = "Lancing Infested Hive",
 Missions = { "Hive", "Hidden Messages", "Patient Zero" },
 Name = "Lancing Infested Hive",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 4500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Leaper = {
 General = {
 Description = "Fast with a leap attack",
 Faction = "Infested",
 Image = "LeaperDE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Runners/LeapingRunner",
 --Introduced = "?",
 Link = "Leaper",
 Name = "Leaper",
 Scans = 30,
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
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.25,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 100,
 EximusHealth = 100,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Leaping Thrasher"] = {
 General = {
 Description = "An ancient brute possessed of a weighty arm-flail and the terrifying strength to use it to devastating effect. Its lumbering form belies shocking speed, which the Leaping Thrasher achieves by slamming its arm into the ground and throwing itself into battle.",
 Faction = "Infested",
 Image = "LeapingThrasher.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Emissary/AncientTankAgent",
 Introduced = "25.7.3.1",
 Link = "Leaping Thrasher",
 Name = "Leaping Thrasher",
 Planets = { "Deimos" },
 Scans = 5,
 TileSets = { "Orokin Derelict" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 },
 Health = 600,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Upper Head: 1.0x", "Upper Hardened Body: 0.5x" },
 ProcResists = { "Viral" },
 }
 },
 Lephantis = {
 General = {
 Abilities = { "Rippling Shockwave" },
 Description = "Heavily armored",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "GolemFullAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Vip/GolemFullAgent",
 Introduced = "10",
 Link = "Lephantis",
 Missions = { "Assassination", "Magnacidium" },
 Name = "Lephantis",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Orokin Derelict" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Ancient Infested Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 30,
 Multishot = 5,
 StatusChance = 0.15,
 },
 {
 AttackName = "Ancient Infested Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Corpus Grenade Contact Damage",
 DamageDistribution = {
 Blast = 1,
 },
 BurstCount = 8,
 TotalDamage = 100,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Corpus Grenade AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 BurstCount = 8,
 TotalDamage = 60,
 StatusChance = 0,
 },
 {
 AttackName = "Infested Grineer Melee Damage",
 DamageDistribution = {
 Impact = 0.6,
 Puncture = 0.15,
 Slash = 0.25,
 },
 TotalDamage = 100,
 StatusChance = 0.1,
 },
 },
 Health = 3000,
 Affinity = 3500,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Lobber Crawler"] = {
 General = {
 Description = "Spits explosive projectiles",
 Faction = "Infested",
 Image = "GrenadeAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Crawlers/GrenadeCrawler",
 Introduced = "10.5",
 Link = "Lobber Crawler",
 Name = "Lobber Crawler",
 Scans = 30,
 Type = "Melee and Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage (Need Data)",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 0,
 StatusChance = 0,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Maggot = {
 General = {
 Description = "Overwhelms prey with sheer numbers.",
 Faction = "Infested",
 Image = "DEMaggot.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Quadrupeds/RusherAgent",
 Introduced = "15.5",
 Link = "Maggot",
 Name = "Maggot",
 Scans = 30,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 20,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Mitosid = {
 General = {
 Description = "When pressured, this beast severs it's torso from its legs, yielding double trouble for its victims.",
 Faction = "Infested Deimos",
 Image = "Mitosid.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Splitter/SplitterAgent",
 Introduced = "29.5",
 Link = "Mitosid",
 Name = "Mitosid",
 Planets = { "Deimos" },
 Scans = 1,
 TileSets = { "Cambion Drift" },
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
 },
 Health = 350,
 EximusHealth = 350,
 Armor = 125,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Torso: 3.0x", "Body: 0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Mitosid Rex"] = {
 General = {
 Description = "Fiercely territorial, this beast lurks within the ruins of Deimos.",
 Faction = "Infested Deimos",
 Image = "MitosidRex.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/Splitter/SplitterAgentVIP",
 Introduced = "29.5",
 Link = "Mitosid#Rex",
 Missions = { "Necralisk Bounty" },
 Name = "Mitosid Rex",
 Planets = { "Deimos" },
 Scans = 1,
 TileSets = { "Cambion Drift" },
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
 },
 Health = 700,
 Armor = 600,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Body: 0.5x" },
 ProcResists = { "Viral" },
 }
 },
 ["Mutalist Alad V"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "InfestedAladV.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/InfestedAladV/InfestedAladBossAgent",
 Introduced = "15.5",
 Link = "Mutalist Alad V",
 Missions = { "Assassination", "Mutalist Alad V Assassination" },
 Name = "Mutalist Alad V",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "Boss",
 Weapons = { "Paracyst" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Toxin = 1,
 },
 TotalDamage = 33,
 BurstCount = 3,
 StatusChance = 0.3,
 },
 },
 Health = 2500,
 Shield = 1200,
 Armor = 500,
 Affinity = 3500,
 BaseLevel = 1,
 SpawnLevel = 35,
 --Multis = { "?" },
 }
 },
 ["Mutalist Lightning Carrier"] = {
 General = {
 Description = "Carries Lightning Crawlers",
 Faction = "Infested",
 Image = "MutalistLightningCarrier.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Infested/LightningCarrierDrone",
 Introduced = "17.5",
 Link = "Mutalist Lightning Carrier",
 Missions = { "Jordas Golem Assassanation" },
 Name = "Mutalist Lightning Carrier",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Lightning Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 12,
 StatusChance = 0,
 },
 },
 Health = 65,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Mutalist Osprey"] = {
 General = {
 Description = "Carries Crawlers into battle",
 Faction = "Infested",
 Image = "InfestedOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/InfestedDrones/PoisonDroneAgent",
 Introduced = "13.8",
 Link = "Mutalist Osprey",
 Name = "Mutalist Osprey",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 200,
 Affinity = 100,
 BaseLevel = 10,
 Multis = { "" },
 }
 },
 ["Mutalist Osprey Carrier"] = {
 General = {
 Description = "Carries energy cells",
 Faction = "Infested",
 Image = "InfestedOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/InfestedDrones/CellCarrierDroneAgent",
 Introduced = "14.5",
 Link = "Mutalist Osprey Carrier",
 Missions = { "Excavation" },
 Name = "Mutalist Osprey Carrier",
 Scans = 10,
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
 Slash = 0.3334,
 },
 TotalDamage = 3,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Mutalist Toxic Carrier"] = {
 General = {
 Description = "Carries Toxic Crawlers into battle",
 Faction = "Infested",
 Image = "MutalistToxicCarrier.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Infested/GrenadeCarrierDrone",
 Introduced = "17.5",
 Link = "Mutalist Toxic Carrier",
 Missions = { "Jordas Golem Assassanation" },
 Name = "Mutalist Toxic Carrier",
 Scans = 10,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Grenade Contact Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 50,
 StatusChance = 0,
 },
 },
 Health = 65,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Nauseous Crawler"] = {
 General = {
 Description = "Has an immobilizing vomit attack",
 Faction = "Infested",
 Image = "NauseousCrawlerDE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Crawlers/GraspingCrawler",
 Introduced = "10.5",
 Link = "Nauseous Crawler",
 Name = "Nauseous Crawler",
 Scans = 20,
 Type = "Disabler",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Phorid = {
 General = {
 Abilities = { "Psychic Bolts", "Sonic Scream" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "PhoridDE2.png",
 InternalName = "/Lotus/Types/Enemies/Infested/Vip/QuadrupedVIP",
 Introduced = "6",
 Link = "Phorid",
 Missions = { "Assassination", "Invasion" },
 Name = "Phorid",
 Scans = 3,
 TileSets = { "Grineer Asteroid" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 100,
 StatusChance = 0.1,
 },
 {
 AttackName = "Sonic Scream (Data Needed)",
 DamageDistribution = {
 Impact = 0,
 },
 TotalDamage = 0,
 Note = "Data needed on Sonic Scream!"
 },
 },
 Health = 5000,
 Armor = 25,
 Affinity = 3500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Polyp-Hog Juggernaut"] = {
 General = {
 Abilities = { "Charge", "Infested Spawn Tar", "Poison Rain", "Quill Shot" },
 Description = "With the ability to track a scent from miles away, this Juggernaut is an invaluable ally when foraging rare Polyps from the ruins of Deimos",
 Faction = "Infested Deimos",
 Image = "JuggernautMicroPlanetAvatar.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/JuggernautMicroPlanetEscort",
 --Introduced = "?",
 Link = "Juggernaut#Polyp-Hog",
 Missions = { "Necralisk Bounty" },
 Name = "Polyp-Hog Juggernaut",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Damage",
 DamageDistribution = {
 Corrosive = 1
 },
 TotalDamage = 10,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.7,
 Slash = 0.1,
 },
 TotalDamage = 3,
 StatusChance = 0.02,
 Note = "Projectile damage is bundled with its own on-contact damage"
 },
 },
 Health = 6000,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 ProcResists = { "Viral" },
 }
 },
 ["Pulsing Infested Hive"] = {
 General = {
 Description = "Emits magnetized clouds.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "InfestedHiveC.png",
 InternalName = "",
 Introduced = "13.8",
 Link = "Pulsing Infested Hive",
 Missions = { "Hive", "Hidden Messages", "Patient Zero" },
 Name = "Pulsing Infested Hive",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 4500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Runner = {
 General = {
 Description = "Fast with weak claw attacks",
 Faction = "Infested",
 Image = "InfestedRunner.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Runners/MeleeRunner",
 --Introduced = "?",
 Link = "Runner",
 Name = "Runner",
 Scans = 30,
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
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.25,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 100,
 Affinity = 35,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Security Infested Hive"] = {
 General = {
 Description = "Controls nearby turrets.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "InfestedHiveF.png",
 InternalName = "",
 Introduced = "13.8",
 Link = "Security Infested Hive",
 Missions = { "Hive", "Hidden Messages", "Patient Zero" },
 Name = "Security Infested Hive",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 4500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Stabilization Infested Hive"] = {
 General = {
 Description = "Creates a field that lowers gravity.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 FactionDamageOverride = "",
 Image = "InfestedHiveE.png",
 InternalName = "",
 Introduced = "13.8",
 Link = "Stabilization Infested Hive",
 Missions = { "Hive", "Hidden Messages", "Patient Zero" },
 Name = "Stabilization Infested Hive",
 Planets = { "Eris" },
 Scans = 3,
 TileSets = { "Infested Ship" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 },
 Health = 4500,
 Armor = 25,
 Affinity = -1,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Swarm Mutalist MOA"] = {
 General = {
 Description = "Discharges swarms of infested spores",
 Faction = "Infested",
 Image = "NaniteInfestedMoa.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/InfestedMoas/NaniteCloudBipedAgent",
 Introduced = "15.5",
 Link = "Swarm Mutalist MOA",
 Name = "Swarm Mutalist MOA",
 Planets = { "Mercury", "Venus", "Earth", "Mars", "Deimos", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ceres", "Eris", "Sedna", "Europa", "Phobos" },
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 10,
 BurstCount = 3,
 StatusChance = 0.05,
 },
 {
 AttackName = "Swarm DoT Damage",
 DamageDistribution = {
 Puncture = 1
 },
 TotalDamage = 35,
 IsFixed = true,
 },
 },
 Health = 350,
 EximusHealth = 275,
 Affinity = 150,
 BaseLevel = 12,
 Multis = { "Tail: 3.0x", "Face: 0.5x" },
 }
 },
 ["Tar Mutalist MOA"] = {
 General = {
 Description = "Discharges tar-like mucus slowing its prey",
 Faction = "Infested",
 Image = "SlowInfestedMoa.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/InfestedMoas/SlowBombBipedAgent",
 Introduced = "15.5",
 Link = "Tar Mutalist MOA",
 Name = "Tar Mutalist MOA",
 Planets = { "Mercury", "Venus", "Earth", "Mars", "Deimos", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ceres", "Eris", "Sedna", "Europa", "Phobos" },
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Slow Bomb Contact Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 1,
 Multishot = 4,
 StatusChance = 0,
 },
 {
 AttackName = "Slow Bomb AoE Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 350,
 EximusHealth = 275,
 Affinity = 150,
 BaseLevel = 12,
 Multis = { "Tail: 3.0x", "Face: 0.5x" },
 }
 },
 ["Toxic Ancient"] = {
 General = {
 Abilities = { "Toxic Flail" },
 Description = "Heavy melee unit that lashes out with a toxic flail.",
 Faction = "Infested",
 Image = "ToxicAncient2DE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Ancients/ToxicAncient",
 --Introduced = "?",
 Link = "Toxic Ancient",
 Name = "Toxic Ancient",
 Scans = 3,
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
 {
 AttackName = "Toxin Flail Damage (Needs Data)",
 DamageDistribution = {
 Toxin = 1
 },
 TotalDamage = 0,
 StatusChance = 0,
 },
 },
 Health = 400,
 EximusHealth = 400,
 Affinity = 500,
 EximusAffinity = 700,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Back Crown: 0.5x" },
 }
 },
 ["Toxic Crawler"] = {
 General = {
 Description = "Releases a poison cloud on death",
 Faction = "Infested",
 Image = "ToxicCrawlerDE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Crawlers/NoxiousCrawler",
 Introduced = "10.5",
 Link = "Toxic Crawler",
 Name = "Toxic Crawler",
 Scans = 20,
 Type = "Enviromental Hazard",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Undying Flyer"] = {
 General = {
 Description = "An Infested jetpack trooper, the Undying Flyer rams opponents at high speed. When killed it reverts to a pod-state. If not destroyed the Undying Flyer emerges at full health.",
 Faction = "Infested",
 Image = "UndyingFlyer.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Emissary/InfestedJetpackAgent",
 Introduced = "25.7.3.1",
 Link = "Undying Flyer",
 Name = "Undying Flyer",
 Planets = { "Deimos" },
 Scans = 10,
 TileSets = { "Cambion Drift" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 14,
 StatusChance = 0.05,
 },
 },
 Health = 400,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 0.0x", "Jetpack: 0.0x" },
 ProcResists = { "Viral" },
 }
 },
 ["Venin Mutalist"] = {
 General = {
 Description = "Fires infested spores",
 Faction = "Infested",
 Image = "CodexVeninMutalist.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/InfestedDrones/InfestedAttackDroneAgent",
 Introduced = "19.12",
 Link = "Venin Mutalist",
 Missions = { "Defection" },
 Name = "Venin Mutalist",
 Scans = 10,
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
 Slash = 0.3334,
 },
 TotalDamage = 3,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Affinity = 100,
 BaseLevel = 5,
 Multis = { "" },
 }
 },
 ["Volatile Runner"] = {
 General = {
 Description = "Fast and explodes when near enemies",
 Faction = "Infested",
 Image = "RunnerDE.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/Runners/SuicideRunner",
 --Introduced = "?",
 Link = "Volatile Runner",
 Name = "Volatile Runner",
 Scans = 20,
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
 TotalDamage = 10,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 25,
 StatusChance = 0.25,
 Note = "Will resort to Shot Damage if target cannot be reached via melee"
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 Note = "Projectile shot damage is bundled with its own on-contact damage"
 },
 },
 Health = 80,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Zealoid Bastion"] = {
 General = {
 Description = "A subordinate loyal to the Zealoid Prelate, the Bastion renders regular Infested invulnerable.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "ZealoidPrelate.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/WeaveMutalist/DecodeSpawn",
 Introduced = "25.7.7",
 Link = "Zealoid Bastion",
 Missions = { "Assassination", "Exequias" },
 Name = "Zealoid Bastion",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Orokin Derelict" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 3,
 Multishot = 6,
 StatusChance = 0,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 5,
 StatusChance = 0,
 Note = "Shot detonates on impact and does a small AoE"
 },
 },
 Health = 950,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 30,
 --Multis = { "?" },
 }
 },
 ["Zealoid Prelate"] = {
 General = {
 Abilities = { "Ground Slam", "Teleportation", "Heat Wave", "Maggot Grenade" },
 Description = "Wreathed in an obfuscating black cloud the Zealoid Prelate brings Arlo's word with fire, blood and loyal Bastions who spring to his aid.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "ZealoidPrelate.png",
 InternalName = "/Lotus/Types/Enemies/Infested/AiWeek/WeaveMutalist/WeaveMutalist",
 Introduced = "25.7.7",
 Link = "Zealoid Prelate",
 Missions = { "Assassination", "Exequias" },
 Name = "Zealoid Prelate",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Orokin Derelict" },
 Type = "Boss",
 Weapons = { "Pathocyst" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Glaive Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1
 },
 TotalDamage = 75,
 StatusChance = 0.2,
 },
 {
 AttackName = "Glaive AoE Damage",
 DamageDistribution = {
 Toxin = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.15,
 },
 {
 AttackName = "Thrown Glaive Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 15,
 },
 {
 AttackName = "Thrown Glaive AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 45,
 StatusChance = 0.05,
 },
 },
 Health = 9000,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 35,
 --Multis = { "?" },
 }
 },
 ["Zealot Baptizer"] = {
 General = {
 CodexSecret = true,
 Description = "From Arlo the promise of a new life, a new form and a new word: death.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "ZealotBaptizer.png",
 InternalName = "/Lotus/Types/Enemies/Infested/SpecialEvents/ArloZealotSwordAgent",
 --Introduced = "?",
 Link = "Zealot Baptizer",
 Missions = { "Nightwave/Series 2" },
 Name = "Zealot Baptizer",
 Scans = 5,
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
 TotalDamage = 35,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Armor = 100,
 Affinity = 300,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Zealot Herald"] = {
 General = {
 CodexSecret = true,
 Description = "This Zealot targets petential converts with a spray of toxic sludge.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "ZealotHerald.png",
 InternalName = "/Lotus/Types/Enemies/Infested/SpecialEvents/ArloZealotGunAgent",
 --Introduced = "?",
 Link = "Zealot Herald",
 Missions = { "Nightwave/Series 2" },
 Name = "Zealot Herald",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Torid" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Gredade Contact Damage",
 DamageDistribution = {
 Viral = 1,
 },
 TotalDamage = 10,
 BurstCount = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade AoE Damage",
 DamageDistribution = {
 Viral = 1,
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Armor = 100,
 Affinity = 300,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Zealot Proselytizer"] = {
 General = {
 CodexSecret = true,
 Description = "Attacking with blade and gun, this Zealot spreads the 'message' with a hive of toxic, explosive pustules that grow on his back when he is attacked.",
 ExcludedFromSimulacrum = true,
 Faction = "Infested",
 Image = "ZealotProselytizer.png",
 InternalName = "/Lotus/Types/Enemies/Infested/SpecialEvents/ArloZealotDual/ArloZealotDualSwordGunAgent",
 --Introduced = "?",
 Link = "Zealot Proselytizer",
 Missions = { "Nightwave/Series 2" },
 Name = "Zealot Proselytizer",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Zymos" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Slash = 1,
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 {
 AttackName = "Shot Contact Damage",
 DamageDistribution = {
 Viral = 1,
 },
 TotalDamage = 8,
 StatusChance = 0,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Viral = 1,
 },
 TotalDamage = 14,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Armor = 100,
 Affinity = 300,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
}