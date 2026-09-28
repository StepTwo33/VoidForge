return {
 ["002-ER"] = {
 General = {
 Description = "Designed to execute the 002 Eradication Protocol, this Osprey identifies high-risk brokers and administers injury.",
 Faction = "Corpus",
 Image = "002-ER.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamD/CCTeamDOspreyAgent",
 --Introduced = "?",
 Link = "002-ER",
 Missions = { "The Index" },
 Name = "002-ER",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electric = 1
 },
 TotalDamage = 10,
 Multishot = 7
 },
 {
 AttackName = "Beam Cannon",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 20,
 BurstCount = 10
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Alad V"] = {
 General = {
 Actor = "Kol Crosbie (aka [DE]Skree)",
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus Amalgam",
 Image = "AladV.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/AladV/AladBossAgent",
 Introduced = "9.3",
 Link = "Alad V",
 Missions = { "Assassination", "Themisto" },
 Name = "Alad V",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Health = 900,
 Shield = 1500,
 Armor = 250,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 20,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Amalgam Alkonost"] = {
 General = {
 Abilities = { "Neuro-Carnivorous Enhancer (captured allies)" },
 Description = "The full realization of the grotesque partnership between Alad V and the Sentients. This unit can upgrade organic allies by capturing them and birthing neuro-carnivorous memes directly into their brain stems, thereby super-charging their fighting capacity and resilience.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamAlkonost.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamCorpusOverrideAgent",
 Introduced = "25",
 Link = "Amalgam Alkonost",
 Name = "Amalgam Alkonost",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 Multishot = 5,
 StatusChance = 0,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 StatusChance = 0.05
 },
 },
 Health = 650,
 EximusHealth = 650,
 Shield = 300,
 EximusShield = 300,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Amalgam Arca Heqet"] = {
 General = {
 Description = "An amalgamation of a Corpus brute and unknown sentient form. Not only is this fighter capable of crushing blows it can also manipulate matter to create a Spectralyst clone of any enemy, including Tenno.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamArcaHeqet.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/Prototypes/AmalgamPrototypeMeleeAgent",
 Introduced = "25",
 Link = "Amalgam Arca Heqet",
 Name = "Amalgam Arca Heqet",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Melee",
 Weapons = { "Arca Titron" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 60,
 StatusChance = 0,
 },
 },
 Health = 700,
 Shield = 1100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Back: 2.0x" },
 }
 },
 ["Amalgam Arca Kucumatz"] = {
 General = {
 Description = "The unseemly marriage of a Corpus sentry turret and a Sentient drone, this unit alternates between Arca Plasmor blasts and a devastating focused beam weapon.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamArcaKucumatz.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/Prototypes/AmalgamPrototypeCarrusAgent",
 Introduced = "25",
 Link = "Amalgam Arca Kucumatz",
 Name = "Amalgam Arca Kucumatz",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Arca Plasmor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1
 },
 StatusChance = 0.03,
 TotalDamage = 50,
 },
 },
 Health = 1500,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Amalgam Cinder Machinist"] = {
 General = {
 Description = "Alad V has married countless generations of Sentient evolution with the most advanced Corpus technology to create a brutal, persistent fighter. Wields a razor-torch hot enough to melt Sentient armor and is capable of rapid regeneration.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamCinderMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/Prototypes/AmalgamPrototypeCarrusPilotAgent",
 Introduced = "25",
 Link = "Amalgam Cinder Machinist",
 Name = "Amalgam Cinder Machinist",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Cinder Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 6,
 StatusChance = 0.27,
 },
 {
 AttackName = "Napalm Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 },
 {
 AttackName = "Napalm Patch Damage",
 DamageDistribution = {
 Heat = 25,
 },
 TotalDamage = 40,
 StatusChance = 0.5,
 },
 },
 Health = 1500,
 Shield = 1200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Amalgam Heqet"] = {
 General = {
 Abilities = { "Spectrolyst Spawner (Hand)" },
 Description = "An amalgamation of a Corpus Sniper and unknown sentient form. Not only is this fighter capable of pinpoint accuracy, it can also manipulate matter to create a Spectralyst clone of any enemy, including Tenno.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamHeqet.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamCorpusSniperAgent",
 Introduced = "25",
 Link = "Amalgam Heqet",
 Name = "Amalgam Heqet",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Komorex", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.25,
 Puncture = 0.25,
 Slash = 0.25,
 Viral = 0.25,
 },
 TotalDamage = 24,
 StatusChance = 0.33,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Tau = 1
 },
 TotalDamage = 20,
 StatusChance = 0
 },
 },
 Health = 500,
 EximusHealth = 500,
 Shield = 400,
 EximusShield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Back: 2.0x" },
 }
 },
 ["Amalgam Kucumatz"] = {
 General = {
 Description = "The unseemly marriage of a Corpus sentry turret and a Sentient drone, this unit alternates between repeating energy bolts and a devastating focused beam weapon.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamKucumatz.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamCarrusAgent",
 Introduced = "25",
 Link = "Amalgam Kucumatz",
 Name = "Amalgam Kucumatz",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 30,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 500,
 EximusHealth = 500,
 Shield = 100,
 EximusShield = 100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Amalgam Machinist"] = {
 General = {
 Description = "Alad V has married countless generations of Sentient evolution with the most advanced Corpus technology to create a brutal, persistent fighter. Wields a plasma assault rifle and carries an Amalgam Osprey into battle.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamCarrusPilotAgent",
 Introduced = "25",
 Link = "Amalgam Machinist",
 Name = "Amalgam Machinist",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Cyanex" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 BurstCount = 6,
 StatusChance = 0.1,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 ["Shield Drain"] = 1
 },
 TotalDamage = 5,
 StatusChance = 0,
 },
 },
 Health = 600,
 EximusHealth = 600,
 Shield = 300,
 EximusShield = 300,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Amalgam MOA"] = {
 General = {
 Abilities = { "Phase Heal" },
 Description = "A lethal blend of Corpus ingenuity and Sentient technology, this MOA has been loaded up with devastating hybrid weaponry.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamMoaAgent",
 Introduced = "25",
 Link = "Amalgam Moa",
 Name = "Amalgam MOA",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Puncture = 1
 },
 TotalDamage = 3,
 StatusChance = 0.2,
 },
 },
 Health = 500,
 EximusHealth = 500,
 Shield = 300,
 EximusShield = 300,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Amalgam Osprey"] = {
 General = {
 Abilities = { "Spectrolyst Spawner" },
 Description = "Corpus Osprey and Armored Sentient, conjoined in a hideous fusion of known and unknown to create a lethal unit that attacks with conventional beam weapons, or clones nearby friendly units to create Spectralyst fighters.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamOspreyAgent",
 Introduced = "25",
 Link = "Amalgam Osprey",
 Name = "Amalgam Osprey",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
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
 Health = 500,
 EximusHealth = 500,
 Shield = 300,
 EximusShield = 300,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Amalgam Phase MOA"] = {
 General = {
 Description = "A lethal blend of Corpus ingenuity and Sentient technology, this MOA shares the out-of-phase healing mode with its Prototype cousin but is also capable of staggering opponents with globes of explosive Sentient energy.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamPhaseMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/Prototypes/AmalgamPrototypeMoaAgent",
 Introduced = "25",
 Link = "Amalgam Phase Moa",
 Name = "Amalgam Phase MOA",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 50,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 35,
 },
 },
 Health = 500,
 Shield = 800,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Amalgam Satyr"] = {
 General = {
 Abilities = { "Shockwave Stomp" },
 Description = "A diabolical mess of limbs, this Amalgam fighter doesn't care which way is up. A fast-galloping unit that attacks with crushing melee blows, a repeater cannon and destabilizing ground slams.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamSatyr.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamMoaSatyrAgent",
 Introduced = "25",
 Link = "Amalgam Satyr",
 Name = "Amalgam Satyr",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged/Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Blasters",
 DamageDistribution = {
 Tau = 1
 },
 TotalDamage = 15,
 StatusChance = 0
 },
 {
 AttackName = "Blasters AoE",
 DamageDistribution = {
 Tau = 1
 },
 TotalDamage = 25,
 StatusChance = 0
 },
 {
 AttackName = "Leg Swipe",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 150,
 StatusChance = 0.05,
 },
 },
 Health = 600,
 EximusHealth = 600,
 Shield = 150,
 EximusShield = 150,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Amalgam Swarm Satyr"] = {
 General = {
 Description = "A diabolical mess of limbs, this Amalgam fighter doesn't care which way is up. A fast-galloping unit that attacks with crushing melee blows, destabilizing ground slams and homing energy projectiles.",
 Faction = "Corpus Amalgam",
 Image = "AmalgamSwarmSatyr.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/Prototypes/AmalgamPrototypeSatyrAgent",
 Introduced = "25",
 Link = "Amalgam Swarm Satyr",
 Name = "Amalgam Swarm Satyr",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged/Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 30,
 BurstCount = 6,
 StatusChance = 0
 },
 {
 AttackName = "Leg Swipe",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 150,
 StatusChance = 0.05,
 },
 },
 Health = 1300,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Ambulas = {
 General = {
 Abilities = { "Ground-burst" },
 Description = "This reborn Ambulas has been upgraded to become one of the most lethal combat proxies.",
 Faction = "Corpus",
 Image = "CodexAmbulas.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Ambulas/BossAmbulasRangedAgent",
 Introduced = "6",
 Link = "Ambulas",
 Missions = { "Assassination", "Hades" },
 Name = "Ambulas",
 Planets = { "Pluto" },
 Scans = 3,
 TileSets = { "Corpus Outpost" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 20,
 StatusChance = 0.3,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 10,
 StatusChance = 0,
 },
 },
 Health = 1100,
 Shield = 500,
 Armor = 150,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x", "Console: 0.5x", "Gun: 0.1x" },
 ProcResists = { "Viral", "Impact" },
 }
 },
 ["Anti MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "DEAntiMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/LaserDiscBipedAgent",
 Introduced = "11",
 Link = "Anti MOA",
 Name = "Anti MOA",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Armaments Director"] = {
 General = {
 Description = "Enrichment Labs director of weapons research. Responsible for advanced weapon prototypes and refinement.",
 Faction = "Corpus",
 Image = "ArmamentsDirector.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Commanders/VenusCommanderAquaAgent",
 Introduced = "24.2",
 Link = "Armaments Director",
 Missions = { "Fortuna Bounty" },
 Name = "Armaments Director",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Exergis" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Laser Grenade",
 DamageDistribution = {
 Impact = 0.333,
 Puncture = 0.333,
 Slash = 0.334,
 },
 TotalDamage = 25,
 },
 },
 Health = 1750,
 Shield = 1200,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Armis Ulta"] = {
 General = {
 Description = "As the Chief Officer of the Investor Relations department, Armis pressures investors into accepting Nef Anyo's invitation to The Index. He's also adept at leveraging investor debt to make maximum profit for Anyo Corp.",
 Faction = "Corpus",
 Image = "ArmisUlta.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamD/CCTeamDBusterAAgent",
 --Introduced = "?",
 Link = "Armis Ulta",
 Missions = { "The Index" },
 Name = "Armis Ulta",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Glaxion" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Glaxion Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 55,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Attack Drone"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "FusionDroneDE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/DroneAttackAgent",
 Introduced = "7.10",
 Link = "Attack Drone",
 Name = "Attack Drone",
 Scans = 5,
 Type = "Ranged",
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
 Health = 250,
 EximusHealth = 250,
 Shield = 75,
 EximusShield = 75,
 Affinity = 200,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Attack Drone (Archwing Enemy)"] = {
 General = {
 Description = "Weak, but aggressive with a high rate of fire.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "FusionDroneDE.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Attack Drone (Archwing Enemy)",
 Missions = { "Archwing (Mission)" },
 Name = "Attack Drone (Archwing Enemy)",
 Planets = { "Venus", "Phobos", "Jupiter", "Neptune" },
 Scans = 20,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "Ranged",
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
 Health = 250,
 Shield = 75,
 Affinity = 200,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Auditor = {
 General = {
 Abilities = { "Frontal Shield", "Shockwave Slam", "Rocket Barrage", "Laser Barricade" },
 Description = "A heavily modified model of Denial Bursas, designed for the secure transferral of offline funds. This armoured robot protects the financial interests of Anyo Corp.",
 Faction = "Corpus",
 Image = "CCTeamBRiotMoaAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamB/CCTeamBRiotMoaAgent",
 --Introduced = "?",
 Link = "Auditor",
 Missions = { "The Index" },
 Name = "Auditor",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electric = 1
 },
 TotalDamage = 10,
 Multishot = 7
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3333,
 },
 TotalDamage = 20,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Front: 0.5x", "Gun: 0.25x", "Shield: 0.0x" },
 }
 },
 ["Aurax Actinic"] = {
 General = {
 Description = "An elite unit that shocks and staggers with snares from his Protonex snare",
 Faction = "Corpus",
 Image = "AuraxActinic.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpSpecOpsShockerAgent",
 Introduced = "29.10",
 Link = "Aurax Actinic",
 Missions = { "Empyrean" },
 Name = "Aurax Actinic",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Plinx", "Protonex", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Protonex Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50,
 },
 {
 AttackName = "Protonex Radial Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50,
 },
 {
 AttackName = "Plinx Shot Damage",
 DamageDistribution = {
 Impact = 0.143,
 Puncture = 0.286,
 Slash = 0.214,
 Heat = 0.357
 },
 TotalDamage = 56,
 Note = "Used when player is 30m+ away"
 },
 },
 Health = 1500,
 Shield = 750,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Aurax Atloc Raknoid"] = {
 General = {
 Description = "Raknoid robotic unit upgraded with a thorax-mounted missiles launcher.",
 Faction = "Corpus",
 Image = "AuraxAtlocRaknoid.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/SpecOpsArachnoidAgent",
 Introduced = "29.10",
 Link = "Aurax Atloc Raknoid",
 Missions = { "Empyrean" },
 Name = "Aurax Atloc Raknoid",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 BurstCount = 4,
 StatusChance = 0.15,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 300,
 Shield = 150,
 Armor = 250,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Legs: 3.5x" },
 ProcResists = { "Viral", "Corrosive", "Magnetic" },
 }
 },
 ["Aurax Baculus"] = {
 General = {
 Description = "Trained in the art of deflection, this elite melee fighter uses his high-discharge staff to block most incomng, forward fire.",
 Faction = "Corpus",
 Image = "AuraxBaculus.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/SpecOpsStaffAgent",
 Introduced = "29.10",
 Link = "Aurax Baculus",
 Missions = { "Empyrean" },
 Name = "Aurax Baculus",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15,
 },
 TotalDamage = 30,
 StatusChance = 0.1,
 Note = "Always procs Electric as well"
 },
 },
 Health = 300,
 Shield = 750,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Aurax Culveri MOA"] = {
 General = {
 Description = "Elite robotic walker, armed with a high-intensity thermal beam.",
 Faction = "Corpus",
 Image = "AuraxCulveriMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/SpecOpsFireMoaAgent",
 Introduced = "29.10",
 Link = "Aurax Culveri MOA",
 Missions = { "Empyrean" },
 Name = "Aurax Culveri MOA",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Thermal Beam Damage",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 3,
 StatusChance = 0.5,
 Note = "Chains to other allies within 10m"
 },
 },
 Health = 55,
 Shield = 30,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Aurax Polaris MOA"] = {
 General = {
 Description = "Elite robotic walker, armed with a twin heat-sapping cryo beams.",
 Faction = "Corpus",
 Image = "AuraxPolarisMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/SpecOpsIceMoaAgent",
 Introduced = "29.10",
 Link = "Aurax Polaris MOA",
 Missions = { "Empyrean" },
 Name = "Aurax Polaris MOA",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Beam Damage",
 DamageDistribution = {
 Freeze = 1
 },
 TotalDamage = 3,
 StatusChance = 0.2,
 },
 },
 Health = 55,
 Shield = 30,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Aurax Vertec"] = {
 General = {
 Description = "Wields a devastating rotary laser cannon. Trained to clear entire hot zones with deadly efficiency.",
 Faction = "Corpus",
 Image = "AuraxVertec.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpSpecOpsMinigunAgent",
 Introduced = "29.10",
 Link = "Aurax Vertec",
 Missions = { "Empyrean" },
 Name = "Aurax Vertec",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.25,
 Puncture = 0.65,
 Slash = 0.1,
 },
 TotalDamage = 45,
 StatusChance = 0,
 },
 },
 Health = 1500,
 Shield = 750,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Basilisk"] = {
 General = {
 Description = "This fighter attacks with a tracking turret that delivers focused bursts from its energy beam.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioBasilisk.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptuneChargeAgent",
 Introduced = "29.10",
 Link = "Axio Basilisk",
 Missions = { "Empyrean" },
 Name = "Axio Basilisk",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8,
 },
 TotalDamage = 12,
 StatusChance = 0.9,
 },
 },
 Health = 190,
 Shield = 175,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Axio Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewRifleAgent",
 Introduced = "29.10",
 Link = "Axio Crewman",
 Missions = { "Empyrean" },
 Name = "Axio Crewman",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Stahlta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 5,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Crewship"] = {
 -- Missing damage data.
 General = {
 Description = "Medium Crewship armed with mini-missiles and ramsleds for boarding. Protected by a Shielding Satellite.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioCrewship.png",
 InternalName = "",
 Introduced = "29.10",
 Link = "Axio Crewship",
 Missions = { "Empyrean" },
 Name = "Axio Crewship",
 Planets = { "Neptune Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 2000,
 Shield = 3500,
 Armor = 250,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Axio Detron Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioDetronCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewShotgunAgent",
 Introduced = "29.10",
 Link = "Axio Detron Crewman",
 Missions = { "Empyrean" },
 Name = "Axio Detron Crewman",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Detron", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Disc MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioDiscMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewDiscBipedAgent",
 Introduced = "29.10",
 Link = "Axio Disc MOA",
 Missions = { "Empyrean" },
 Name = "Axio Disc MOA",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.28,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 600,
 Shield = 500,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Axio Elite Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewEliteAgent",
 Introduced = "29.10",
 Link = "Axio Elite Crewman",
 Missions = { "Empyrean" },
 Name = "Axio Elite Crewman",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 200,
 Affinity = 250,
 BaseLevel = 16,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Engineer"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioEngineer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpTechEngineerAgent",
 Introduced = "29.10",
 Link = "Axio Engineer",
 Missions = { "Empyrean", "Volatile" },
 Name = "Axio Engineer",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quanta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.48,
 },
 },
 Health = 2000,
 Shield = 250,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Gox"] = {
 General = {
 Description = "Protected by frontal shields and armed with a high-discharge plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioGox.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptuneGoxAgent",
 Introduced = "29.10",
 Link = "Axio Gox",
 Missions = { "Empyrean" },
 Name = "Axio Gox",
 Planets = { "Neptune Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 16,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 800,
 Shield = 650,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Axio Harpi"] = {
 General = {
 Description = "Attack fighter armed with rapid-fire plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioHarpi.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptuneLaserAgent",
 Introduced = "29.10",
 Link = "Axio Harpi",
 Missions = { "Empyrean" },
 Name = "Axio Harpi",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
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
 TotalDamage = 18,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Shield = 100,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Axio MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewCannonBipedAgent",
 Introduced = "29.10",
 Link = "Axio MOA",
 Missions = { "Empyrean" },
 Name = "Axio MOA",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Dera" },
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
 StatusChance = 0.01,
 },
 },
 Health = 400,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Axio Nullifier Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioNullifierCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewNullifierAgent",
 Introduced = "29.10",
 Link = "Axio Nullifier Crewman",
 Missions = { "Empyrean" },
 Name = "Axio Nullifier Crewman",
 Planets = { "Neptune Proxima" },
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
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 },
 Health = 300,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Numon"] = {
 General = {
 Description = "Specialist boarding unit, armed with repeat scatter blaster for shredding enemy personnel.",
 Faction = "Corpus",
 Image = "AxioNumon.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneBoardingShotgunSpacemanAgent",
 Introduced = "29.10",
 Link = "Axio Numon",
 Missions = { "Empyrean" },
 Name = "Axio Numon",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Pilot"] = {
 -- missing plinx data
 General = {
 Description = "Trained to fly Crewships and armed with a laser pistol.",
 Faction = "Corpus",
 Image = "AxioPilot.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewshipCaptain",
 Introduced = "29.10",
 Link = "Axio Pilot",
 Missions = { "Empyrean" },
 Name = "Axio Pilot",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Plinx", "Prova" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioRailgunMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewRJRailgunAgent",
 Introduced = "29.10",
 Link = "Axio Railgun MOA",
 Missions = { "Empyrean" },
 Name = "Axio Railgun MOA",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 25,
 StatusChance = 0.15,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Axio Ranger Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioRangerCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCorpusRailjackFlyingSpacemanAgent",
 Introduced = "29.10",
 Link = "Axio Ranger Crewman",
 Missions = { "Empyrean" },
 Name = "Axio Ranger Crewman",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 Health = 1000,
 Shield = 800,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewShieldDroneAgent",
 Introduced = "29.10",
 Link = "Axio Shield Osprey",
 Missions = { "Empyrean" },
 Name = "Axio Shield Osprey",
 Planets = { "Neptune Proxima" },
 Scans = 10,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 22,
 StatusChance = 0.22,
 },
 },
 Health = 200,
 Shield = 25,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioShockwaveMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpRailjackShockwaveBipedAgent",
 Introduced = "29.10",
 Link = "Axio Shockwave MOA",
 Missions = { "Empyrean" },
 Name = "Axio Shockwave MOA",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
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
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 200,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Axio Stropha Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioStrophaCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewMeleeAgent",
 Introduced = "29.10",
 Link = "Axio Stropha Crewman",
 Missions = { "Empyrean" },
 Name = "Axio Stropha Crewman",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Stropha" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 20,
 StatusChance = 0.1,
 },
 },
 Health = 600,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Tech"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "AxioTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneCrpCrewmanTechDeployableAgent",
 Introduced = "29.10",
 Link = "Axio Tech",
 Missions = { "Empyrean" },
 Name = "Axio Tech",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 700,
 Shield = 250,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Vambac"] = {
 General = {
 Description = "Specialist boarding unit trained to wreak havoc on crew and equipment with his proximity-granade launcher.",
 Faction = "Corpus",
 Image = "AxioVambac.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneBoardingRifleSpacemanAgent",
 Introduced = "29.10",
 Link = "Axio Vambac",
 Missions = { "Empyrean" },
 Name = "Axio Vambac",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Penta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Penta Contact Damage",
 DamageDistribution = {
 Impact = 0.68,
 Puncture = 0.02,
 Slash = 0.3,
 },
 TotalDamage = 180,
 StatusChance = 0.21,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 120,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Axio Weaver"] = {
 General = {
 Description = "This Corpus fighter spins and launches target-seeking globes of highly-charged plasma.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioWeaver.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptunePlasmaAgent",
 Introduced = "29.10",
 Link = "Axio Weaver",
 Missions = { "Empyrean" },
 Name = "Axio Weaver",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 120,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 50,
 StatusChance = 0,
 },
 },
 Health = 100,
 Shield = 150,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Axio Zerca"] = {
 General = {
 Description = "Specialist boarding unit, armed with an impact-hammer capable of rapidly disabling critical ship systems.",
 Faction = "Corpus",
 Image = "AxioZerca.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Neptune/NeptuneBoardingMeleeSpacemanAgent",
 Introduced = "29.10",
 Link = "Axio Zerca",
 Missions = { "Empyrean" },
 Name = "Axio Zerca",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Agendus" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.22,
 Puncture = 0.16,
 Slash = 0.62,
 },
 TotalDamage = 60,
 StatusChance = 0.16,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 Azoth = {
 General = {
 Description = "Affectionately known as \"Azoth\" the Hyena Hg is the latest version of Hyena to be produced at Anyo Corp. This model has been optimized to process Index Points with lethal efficiency.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CCTeamBHyenaAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamB/CCTeamBHyenaAgent",
 --Introduced = "?",
 Link = "Azoth",
 Missions = { "The Index" },
 Name = "Azoth",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 1000,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Buzzard Dropship"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "BuzzardDropship.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Dropship/Venus/VenusSmallDropshipAgent",
 Introduced = "24",
 Link = "Buzzard Dropship",
 Name = "Buzzard Dropship",
 Scans = 10,
 TileSets = { "Orb Vallis" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Health = 15000,
 Shield = 3000,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Cannon Battery (Corpus)"] = {
 General = {
 Description = "Inflicts moderate damage at a fast rate",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CannonBatteryCorpus.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Turrets/CorpusSpaceTurretAgent",
 Introduced = "29.10",
 Link = "Turret#Corpus",
 Missions = { "Empyrean" },
 Name = "Cannon Battery",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 10,
 TileSets = { "Free Space" },
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
 Slash = 0.2,
 },
 TotalDamage = 50,
 StatusChance = 0.01,
 },
 },
 Health = 8000,
 Shield = 4000,
 Armor = 200,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 Carrier = {
 General = {
 Description = "Launches several Locust drones.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CrpShipSwarm.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/SwarmShipNavAgent",
 --Introduced = "?",
 Link = "Carrier",
 Missions = { "Archwing (Mission)" },
 Name = "Carrier",
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
 TotalDamage = 6,
 StatusChance = 0,
 },
 },
 Health = 100,
 Armor = 75,
 Affinity = 300,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Cinderthresh Hyena"] = {
 General = {
 Description = "This ruthless Hyena variant pounds foes with its mortar attack and then finishes them off with flaming rounds.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CinderthreshHyena.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/Hyenas/VenusHyenaPacerAgent",
 Introduced = "24",
 Link = "Cinderthresh Hyena",
 Missions = { "Fortuna Bounty" },
 Name = "Cinderthresh Hyena",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 },
 Health = 800,
 Shield = 500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Coildrive"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "Coildrive.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vehicle/WheelCarAgent",
 Introduced = "24",
 Link = "Coildrive",
 Missions = { "Orb Vallis" },
 Name = "Coildrive",
 Planets = { "Venus" },
 Scans = 1,
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 44,
 StatusChance = 0.28,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 106,
 StatusChance = 0.28,
 },
 },
 Health = 8000,
 Shield = 4000,
 Armor = 100,
 Affinity = 50,
 BaseLevel = 1,
 SpawnLevel = 10,
 --Multis = { "?" },
 }
 },
 ["Comet Shard"] = {
 General = {
 Description = "Steel-clad frozen comet chunk capable of icing up target vessels.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CometShard.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/CorpusIceSledAgent",
 Introduced = "29.10",
 Link = "Comet Shard",
 Missions = { "Empyrean" },
 Name = "Comet Shard",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Freezing Capsule",
 Weapons = { "" },
 },
 Stats = {
 Health = 300,
 Shield = 200,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Condor Dropship"] = {
 General = {
 Description = "Aerial transport that delivers Corpus Reinforcements to strategic locations.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CorpusDropShip.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Dropship/CorpusDropshipAgent",
 Introduced = "20.4",
 Link = "Condor Dropship",
 Name = "Condor Dropship",
 Scans = 10,
 TileSets = { "Corpus Ice Planet", "Corpus Outpost", "Orb Vallis" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Condor Dropship (Orb Vallis)"] = {
 General = {
 Description = "Aerial transport that delivers Corpus Reinforcements to strategic locations.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CorpusDropShip.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Dropship/Venus/VenusDropshipAgent",
 Introduced = "24",
 Link = "Condor Dropship",
 Name = "Condor Dropship",
 Scans = 10,
 TileSets = { "Orb Vallis" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Health = 17500,
 Shield = 4000,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Condor Storm Dropship"] = {
 General = {
 Description = "Reinforced Condor used to transport elite personnel into conflict zone.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "AmbulasDropShip.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Ambulas/AmbulasDropshipAgent",
 Introduced = "20.4",
 Link = "Condor Storm Dropship",
 Missions = { "Assassination", "Hades" },
 Name = "Condor Storm Dropship",
 Planets = { "Pluto" },
 Scans = 10,
 TileSets = { "Corpus Outpost" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Health = 1000,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Coolant Raknoid"] = {
 General = {
 Description = "Often found near the Exploiter Orb, these Raknoids carry deep-ice coolant that they use to protect themselves while harvesting Thermia fractures.",
 Faction = "Corpus",
 Image = "CoolantRaknoid.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidCoolantAgent",
 Introduced = "24.4",
 Link = "Coolant Raknoid",
 Name = "Coolant Raknoid",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.3,
 Slash = 0.6,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 100,
 Shield = 2000,
 Armor = 250,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 50,
 Multis = { "Head: 2.25x" },
 }
 },
 ["Corpus Cestra Target"] = {
 General = {
 Description = "This high-profile unit is armed with Dual Cestras.",
 Faction = "Corpus",
 Image = "CorpusCestraTarget.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Vip/VenusVipDualPistolSpacemanAgent",
 Introduced = "24",
 Link = "Corpus Cestra Target",
 Missions = { "Fortuna Bounty" },
 Name = "Corpus Cestra Target",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Dual Cestra" },
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
 StatusChance = 0.1,
 },
 {
 AttackName = "Ice Grenade",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 0,
 StatusChance = 1,
 Note = 'Guarantees Cold proc, doesn\'t deal damage',
 },
 },
 Health = 800,
 Shield = 1200,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Power Carrier"] = {
 General = {
 Description = "Energy Transport Unit",
 Faction = "Corpus",
 Image = "PowercellCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/CarrierSpacemanAgent",
 Introduced = "14.5",
 Link = "Corpus Power Carrier",
 Missions = { "Excavation" },
 Name = "Corpus Power Carrier",
 Scans = 20,
 TileSets = { "Corpus Ice Planet", "Corpus Outpost" },
 Type = "Ranged",
 Weapons = { "Dera", "Prova" },
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
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 650,
 Shield = 120,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Power Carrier (Orb Vallis)"] = {
 General = {
 Description = "Energy Transport Unit",
 Faction = "Corpus",
 Image = "CorpusPowerCarrierOrbVallis.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusSpacemanCarrierAgent",
 Introduced = "24",
 Link = "Corpus Power Carrier (Orb Vallis)",
 Missions = { "Fortuna Bounty" },
 Name = "Corpus Power Carrier (Orb Vallis)",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Dera", "Prova" },
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
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 650,
 Shield = 180,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Ramsled"] = {
 General = {
 Description = "This missile-like landing craft penetrates enemy hulls to deliver a payload of fierce raiders.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CorpusRamsled.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/CorpusRamSledAgent",
 Introduced = "29.10",
 Link = "Corpus Ramsled",
 Missions = { "Empyrean" },
 Name = "Corpus Ramsled",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Boarding Capsule",
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Shield = 200,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Corpus Sniper Target"] = {
 General = {
 Description = "A Taxmen VIP marked for assassination, armed with a high-powered sniper rifle.",
 Faction = "Corpus",
 Image = "CorpusSniperTarget.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Vip/VenusVipSniperSpacemanAgent",
 Introduced = "24",
 Link = "Corpus Sniper Target",
 Missions = { "Fortuna Bounty" },
 Name = "Corpus Sniper Target",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Lanka", "Penta" },
 },
 Stats = {
 -- unclear /Lotus/Types/Enemies/Corpus/Venus/Weapons/VipVenusSniperGrenadeLauncher weapon behavior
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 1200,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Supra Target"] = {
 General = {
 Description = "A modified Supra makes this high-value target highly dangerous.",
 Faction = "Corpus",
 Image = "CorpusSupraTarget.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Vip/VenusVipShotgunSpacemanAgent",
 Introduced = "24",
 Link = "Corpus Supra Target",
 Missions = { "Fortuna Bounty" },
 Name = "Corpus Supra Target",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Supra" },
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
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 800,
 Shield = 1200,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Target"] = {
 General = {
 Abilities = { "Deploy Shield Osprey", "Nullifier Shield", "Seismic Shockwave", "Flash Bang", "Eximus Snow Globe", "Invisibility" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CorpusCaptureTarget.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Corpus Target",
 Missions = { "Capture" },
 Name = "Corpus Target",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Detron", "Glaxion", "Lanka", "Prova", "Viper" },
 },
 Stats = {
 Health = 500,
 Shield = 500,
 Armor = 20,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Stealth: 4.0x", "Head: 3.0x" },
 }
 },
 ["Corpus Tech"] = {
 General = {
 Abilities = { "Deploy Shield Osprey" },
 Description = "Energy Repeater, deploys Drones",
 Faction = "Corpus",
 Image = "CrewmanTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/DeployableSpacemanAgent",
 --Introduced = "?",
 Link = "Corpus Tech",
 Name = "Corpus Tech",
 Planets = { "Venus", "Earth", "Mars", "Jupiter", "Neptune", "Pluto", "Eris", "Europa" },
 Scans = 3,
 Type = "Heavy",
 Weapons = { "Supra", "Prova" },
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
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 700,
 EximusHealth = 700,
 Shield = 250,
 EximusShield = 250,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Trencher Target"] = {
 General = {
 Description = "With brutal melee attacks, this target does not back down.",
 Faction = "Corpus",
 Image = "CorpusTrencherTarget.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Vip/VenusVipPowerSpacemanAgent",
 Introduced = "24",
 Link = "Corpus Trencher Target",
 Missions = { "Fortuna Bounty" },
 Name = "Corpus Trencher Target",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 800,
 Shield = 1200,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Corpus Warden"] = {
 General = {
 Description = "Weak to stealth takedowns",
 Faction = "Corpus",
 Image = "DECorpusWarden.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Gamemodes/DeployableSpacemanWardenAgent",
 Introduced = "13.2",
 Link = "Corpus Warden",
 Missions = { "Rescue" },
 Name = "Corpus Warden",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Lanka", "Supra", "Prova" },
 },
 Stats = {
 Health = 400,
 Shield = 300,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Stealth/Finisher: 16.0x", "Head: 3.0x" },
 }
 },
 Corvette = {
 General = {
 Description = "Voltage grenades detonate to create an electric field.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CrpShipFlak.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/FlakShipNavAgent",
 --Introduced = "?",
 Link = "Corvette",
 Missions = { "Archwing (Mission)" },
 Name = "Corvette",
 Scans = 5,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 2
 },
 TotalDamage = 2,
 Multishot = 12,
 StatusChance = 0.03,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 100,
 StatusChance = 1,
 },
 },
 Health = 100,
 Shield = 100,
 Armor = 75,
 Affinity = 100,
 EximusAffinity = 750,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Crewman = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "CrewmanNormal.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/RifleSpacemanAgent",
 --Introduced = "?",
 Link = "Crewman",
 Name = "Crewman",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Dera", "Prova" },
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
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Cryo Sentry"] = {
 General = {
 CodexSecret = true,
 --Description = "?",
 Faction = "Corpus",
 Image = "Blank.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpAdmiralFreezeTurretAgent",
 Introduced = "29.10",
 Link = "Turret",
 Missions = { "Empyrean" },
 Name = "Cryo Turret",
 Type = "Turret",
 Weapons = { "Freezing Aura" },
 },
 Stats = {
 Health = 0,
 Shield = 0,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Datalyst = {
 General = {
 CodexSecret = true,
 --Description = "?",
 Faction = "Corpus",
 Image = "CorpusArtificer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/SpecialEvents/CorpusArtificer",
 Introduced = "18.4.1",
 Link = "Datalyst",
 Missions = { "Operation: Shadow Debt" },
 Name = "Datalyst",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Swarmer Detron", "Angstrum", "Lecta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Swarmer Detron Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 Multishot = 7, 
 StatusChance = 0,
 },
 {
 AttackName = "Swarmer Detron Areal Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 Multishot = 7, 
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 200
 },
 },
 Health = 1300,
 Shield = 600,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Demolisher Anti MOA"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DemolisherAntiMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Disruption/DisruptionLaserDiscBipedAgent",
 Introduced = "25.7",
 Link = "Demolisher Anti MOA",
 Missions = { "Disruption" },
 Name = "Demolisher Anti MOA",
 Planets = { "Neptune", "Lua" },
 Scans = 5,
 TileSets = { "Corpus Ship", "Orokin Moon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 2000,
 Shield = 800,
 Armor = 100,
 Affinity = 200,
 BaseLevel = 1,
 --Multis = { "?" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Bursa"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DemolisherBursa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Disruption/DisruptionRiotMoaAgent",
 Introduced = "25.7",
 Link = "Demolisher Bursa",
 Missions = { "Disruption" },
 Name = "Demolisher Bursa",
 Planets = { "Neptune", "Lua" },
 Scans = 3,
 TileSets = { "Corpus Ship", "Orokin Moon" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 3,
 Multishot = 8,
 StatusChance = 0,
 },
 },
 Health = 2000,
 Shield = 800,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Hyena"] = {
 General = {
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DemolisherHyena.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Disruption/DisruptionHyenaAgent",
 Introduced = "25.7",
 Link = "Demolisher Hyena",
 Missions = { "Disruption" },
 Name = "Demolisher Hyena",
 Planets = { "Neptune", "Lua" },
 Scans = 3,
 TileSets = { "Corpus Ship", "Orokin Moon" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 7,
 StatusChance = 0.1,
 },
 },
 Health = 1500,
 Shield = 700,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolisher Machinist"] = {
 General = {
 CodexSecret = true,
 Description = "Demolishers are explosive enemies with a single-minded purpose: the destruction of compromised conduits at any cost. Part of the complete Alad V Conduit Security Package!",
 Faction = "Corpus",
 Image = "DemolisherMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Disruption/DisruptionCarrusPilotAgent",
 Introduced = "25.7",
 Link = "Demolisher Machinist",
 Missions = { "Disruption" },
 Name = "Demolisher Machinist",
 Planets = { "Neptune", "Lua" },
 Scans = 5,
 TileSets = { "Corpus Ship", "Orokin Moon" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 4,
 StatusChance = 0.27,
 },
 },
 Health = 2000,
 Shield = 700,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Radiation" },
 }
 },
 Demolyst = {
 General = {
 Description = "A transient copy of an ally or enemy created by a Sentient from Tau energy.",
 Faction = "Corpus Amalgam",
 Image = "SpectralystAmalgamMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamPilotGhostBossAgent",
 Introduced = "25",
 Link = "Demolyst",
 Name = "Demolyst",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Cyanex" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 BurstCount = 6,
 StatusChance = 0.1,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 ["Shield Drain"] = 1
 },
 TotalDamage = 5,
 StatusChance = 0,
 },
 },
 Health = 400,
 Shield = 100,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolyst Heqet"] = {
 General = {
 Description = "An amalgamation of a Corpus Sniper and unknown sentient form. Not only is this fighter capable of pinpoint accuracy, it can also manipulate matter to create a Spectralyst clone of any enemy, including Tenno.",
 Faction = "Corpus Amalgam",
 Image = "DemolystHeqet.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamCorpusSniperBossAgent",
 Introduced = "25",
 Link = "Demolyst Heqet",
 Missions = { "Disruption" },
 Name = "Demolyst Heqet",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Komorex" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.25,
 Puncture = 0.25,
 Slash = 0.25,
 Viral = 0.25,
 },
 TotalDamage = 24,
 StatusChance = 0.33,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Tau = 1
 },
 TotalDamage = 20,
 StatusChance = 0
 },
 },
 Health = 2000,
 Shield = 800,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolyst Machinist"] = {
 General = {
 Description = "Alad V has married countless generations of Sentient evolution with the most advanced Corpus technology to create a brutal, persistent fighter. Wields a plasma assault rifle and carries an Amalgam Osprey into battle.",
 Faction = "Corpus Amalgam",
 Image = "DemolystMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamCarrusPilotBossAgent",
 Introduced = "25",
 Link = "Demolyst Machinist",
 Missions = { "Disruption" },
 Name = "Demolyst Machinist",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Cyanex" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 15,
 BurstCount = 6,
 StatusChance = 0.1,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 ["Shield Drain"] = 1
 },
 TotalDamage = 5,
 StatusChance = 0,
 },
 },
 Health = 2000,
 Shield = 800,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolyst MOA"] = {
 General = {
 Description = "A lethal blend of Corpus ingenuity and Sentient technology, this MOA has been loaded up with devastating hybrid weaponry.",
 Faction = "Corpus Amalgam",
 Image = "DemolystMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamMoaBossAgent",
 Introduced = "25",
 Link = "Demolyst MOA",
 Missions = { "Disruption" },
 Name = "Demolyst MOA",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Puncture = 1
 },
 TotalDamage = 3,
 StatusChance = 0.2,
 },
 },
 Health = 2000,
 Shield = 800,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolyst Osprey"] = {
 General = {
 Description = "Corpus Osprey and Armored Sentient, conjoined in a hideous fusion of known and unknown to create a lethal unit that attacks with conventional beam weapons, or clones nearby friendly units to create Spectralyst fighters.",
 Faction = "Corpus Amalgam",
 Image = "DemolystOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamOspreyBossAgent",
 Introduced = "25",
 Link = "Demolyst Osprey",
 Name = "Demolyst Osprey",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
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
 Health = 1000,
 Shield = 600,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 ProcResists = { "Radiation" },
 }
 },
 ["Demolyst Satyr"] = {
 General = {
 Description = "A diabolical mess of limbs, this Amalgam fighter doesn't care which way is up. A fast-galloping unit that attacks with crushing melee blows, a repeater cannon and destabilizing ground slams.",
 Faction = "Corpus Amalgam",
 Image = "DemolystSatyr.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamMoaSatyrBossAgent",
 Introduced = "25",
 Link = "Demolyst Satyr",
 Missions = { "Disruption" },
 Name = "Demolyst Satyr",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged/Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Blasters",
 DamageDistribution = {
 Tau = 1
 },
 TotalDamage = 15,
 StatusChance = 0
 },
 {
 AttackName = "Blasters AoE",
 DamageDistribution = {
 Tau = 1
 },
 TotalDamage = 25,
 StatusChance = 0
 },
 {
 AttackName = "Leg Swipe",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 150,
 StatusChance = 0.05,
 },
 },
 Health = 2000,
 Shield = 800,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "" },
 ProcResists = { "Radiation" },
 }
 },
 ["Denial Bursa"] = {
 General = {
 Description = "Blocks choke points to protect objectives",
 Faction = "Corpus",
 Image = "RiotMoaPrevention.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/RiotBipedPreventionAgent",
 Introduced = "16.4",
 Link = "Denial Bursa",
 Name = "Denial Bursa",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Shield = 700,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 15,
 Multis = { "Console: 3.0x", "Front: 0.4x", "Gun: 0.5x", "Shield: 0.0x" },
 }
 },
 ["Derim Zahn"] = {
 General = {
 Abilities = { "Activate Turrets", "Deploy Translocators" },
 Description = "A digital virtuoso, Derim is a capable hacker who applies his trade laundering funds traded through the Index.",
 Faction = "Corpus",
 Image = "CCTeamCHackerAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamC/CCTeamCSimplifiedHackerAgent",
 --Introduced = "?",
 Link = "Derim Zahn",
 Missions = { "The Index" },
 Name = "Derim Zahn",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged / Melee",
 Weapons = { "Ferrox", "Sonicor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Sonicor Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 15,
 StatusChance = 0,
 },
 {
 AttackName = "Ferrox Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 35,
 StatusChance = 0.25,
 },
 {
 AttackName = "Ferrox Thrown AoE",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15,
 },
 TotalDamage = 150,
 StatusChance = 0.33,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Derivator Crewman"] = {
 General = {
 Abilities = { "Derivator unit" },
 Description = "Using the latest in Corpus weapons technology, this Crewman absorbs damage, until it unleashes it all in a powerful shockwave. The Derivator unit is mounted on the back.",
 Faction = "Corpus",
 Image = "DerivatorCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Zariman/CrpInterrupterAgent",
 Introduced = "31.5",
 Link = "Derivator Crewman",
 Name = "Derivator Crewman",
 Planets = { "Zariman Ten Zero" },
 Scans = 5,
 TileSets = { "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2307,
 Puncture = 0.2307,
 Slash = 0.2307,
 Electricity = 0.3076,
 },
 TotalDamage = 65,
 StatusChance = 0.1,
 },
 },
 Health = 350,
 Shield = 100,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Detron Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "CrewmanShotgun.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/ShotgunSpacemanAgent",
 --Introduced = "?",
 Link = "Detron Crewman",
 Name = "Detron Crewman",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Detron", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Drover Bursa"] = {
 General = {
 Description = "Corrals its prey for rapid destruction",
 Faction = "Corpus",
 Image = "RiotMoaControl.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/RiotBipedControlAgent",
 Introduced = "16.4",
 Link = "Drover Bursa",
 Name = "Drover Bursa",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Shield = 700,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 20,
 Multis = { "Console: 3.0x", "Front: 0.4x", "Gun: 0.5x", "Shield: 0.0x" },
 }
 },
 ["Dru Pesfor"] = {
 General = {
 Description = "A senior Analysts, Dru addresses all complaints received from colonists in person - with a high-grade, rubedo-lined laser cannon.",
 Faction = "Corpus",
 Image = "DruPesfor.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamD/CCTeamDBusterBAgent",
 --Introduced = "?",
 Link = "Dru Pesfor",
 Missions = { "The Index" },
 Name = "Dru Pesfor",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Glaxion" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Glaxion Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 55,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Elite Axio Basilisk"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter. It attacks with a swivel turret that locks on and then focuses its triple-beam array, delivering continuous damage.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioBasiliskElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptuneChargeEliteAgent",
 Introduced = "29.10",
 Link = "Elite Axio Basilisk",
 Missions = { "Empyrean" },
 Name = "Elite Axio Basilisk",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 380,
 Shield = 350,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Elite Axio Harpi"] = {
 General = {
 Description = "The elite incarnation of this Corpus attack fighter gains the ability to teleport-dash short distances, leaving a blinding flare in its wake.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "AxioHarpiElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptuneLaserEliteAgent",
 Introduced = "29.10",
 Link = "Elite Axio Harpi",
 Missions = { "Empyrean" },
 Name = "Elite Axio Harpi",
 Planets = { "Neptune Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 400,
 Shield = 200,
 Armor = 85,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Elite Axio Weaver"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter fires a shotgun blast of slow-moving plasma gloves.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptunePlasmaEliteAgent",
 Image = "AxioWeaverElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Neptune/SpaceFighterNeptunePlasmaEliteAgent",
 Introduced = "29.10",
 Link = "Elite Axio Weaver",
 Missions = { "Empyrean" },
 Name = "Elite Axio Weaver",
 Planets = { "Neptune" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 },
 {
 AttackName = "Projectile Areal Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 StatusChance = 0,
 },
 },
 Health = 450,
 Shield = 300,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 18,
 --Multis = { "?" },
 }
 },
 ["Elite Crewman"] = {
 General = {
 Abilities = { "Plasma Grenade" },
 Description = "",
 Faction = "Corpus",
 Image = "CrewmanElite.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/EliteSpacemanAgent",
 --Introduced = "?",
 Link = "Elite Crewman",
 Name = "Elite Crewman",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Flux Rifle", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.8,
 Slash = 0.1,
 },
 TotalDamage = 75,
 StatusChance = 0.1,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 110,
 EximusHealth = 110,
 Shield = 150,
 EximusShield = 150,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Elite Orm Basilisk"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter. It attacks with a swivel turret that locks on and then focuses its triple-beam array, delivering continuous damage.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmBasiliskElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSChargeEliteAgent",
 Introduced = "29.10",
 Link = "Elite Orm Basilisk",
 Missions = { "Empyrean" },
 Name = "Elite Orm Basilisk",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 380,
 Shield = 350,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Elite Orm Harpi"] = {
 General = {
 Description = "The elite incarnation of this Corpus attack fighter gains the ability to teleport-dash short distances, leaving a blinding flare in its wake.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmHarpiElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSLaserEliteAgent",
 Introduced = "29.10",
 Link = "Elite Orm Harpi",
 Missions = { "Empyrean" },
 Name = "Elite Orm Harpi",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 400,
 Shield = 200,
 Armor = 85,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Elite Orm Weaver"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter fires a shotgun blast of slow-moving plasma gloves.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmWeaverElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSPlasmaEliteAgent",
 Introduced = "29.10",
 Link = "Elite Orm Weaver",
 Missions = { "Empyrean" },
 Name = "Elite Orm Weaver",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 },
 {
 AttackName = "Projectile Areal Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 StatusChance = 0,
 },
 },
 Health = 450,
 Shield = 300,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Elite Taro Basilisk"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter. It attacks with a swivel turret that locks on and then focuses its triple-beam array, delivering continuous damage.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroBasiliskElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Fighters/SpaceFighterChargeEliteAgent",
 Introduced = "29.10",
 Link = "Elite Taro Basilisk",
 Missions = { "Empyrean" },
 Name = "Elite Taro Basilisk",
 Planets = { "Venus Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 380,
 Shield = 350,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Elite Taro Harpi"] = {
 General = {
 Description = "The elite incarnation of this Corpus attack fighter gains the ability to teleport-dash short distances, leaving a blinding flare in its wake.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroHarpiElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Fighters/SpaceFighterLaserEliteAgent",
 Introduced = "29.10",
 Link = "Elite Taro Harpi",
 Missions = { "Empyrean" },
 Name = "Elite Taro Harpi",
 Planets = { "Venus Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 400,
 Shield = 200,
 Armor = 85,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Elite Taro Weaver"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter fires a shotgun blast of slow-moving plasma gloves.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroWeaverElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Fighters/SpaceFighterPlasmaEliteAgent",
 Introduced = "29.10",
 Link = "Elite Taro Weaver",
 Missions = { "Empyrean" },
 Name = "Elite Taro Weaver",
 Planets = { "Venus Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 },
 {
 AttackName = "Projectile Areal Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 StatusChance = 0,
 },
 },
 Health = 450,
 Shield = 300,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Elite Vorac Basilisk"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter. It attacks with a swivel turret that locks on and then focuses its triple-beam array, delivering continuous damage.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracBasiliskElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Pluto/SpaceFighterPlutoChargeEliteAgent",
 Introduced = "29.10",
 Link = "Elite Vorac Basilisk",
 Missions = { "Empyrean" },
 Name = "Elite Vorac Basilisk",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 380,
 Shield = 350,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Vorac Harpi"] = {
 General = {
 Description = "The elite incarnation of this Corpus attack fighter gains the ability to teleport-dash short distances, leaving a blinding flare in its wake.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracHarpiElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Pluto/SpaceFighterPlutoLaserEliteAgent",
 Introduced = "29.10",
 Link = "Elite Vorac Harpi",
 Missions = { "Empyrean" },
 Name = "Elite Vorac Harpi",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 50,
 StatusChance = 0.25,
 },
 },
 Health = 400,
 Shield = 200,
 Armor = 85,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Elite Vorac Weaver"] = {
 General = {
 Description = "The elite incarnation of this Corpus fighter fires a shotgun blast of slow-moving plasma gloves.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracWeaverElite.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Pluto/SpaceFighterPlutoPlasmaEliteAgent",
 Introduced = "29.10",
 Link = "Elite Vorac Weaver",
 Missions = { "Empyrean" },
 Name = "Elite Vorac Weaver",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Projectile Contact Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 },
 {
 AttackName = "Projectile Areal Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 24,
 StatusChance = 0,
 },
 },
 Health = 450,
 Shield = 300,
 Armor = 175,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Errant Specter"] = {
 General = {
 Description = "The ghostly minions of Parvos Granum within his timeless prison-realm.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "/Lotus/Types/Enemies/Corpus/Gamemodes/PurgatoryWarriorRanged",
 Image = "ErrantSpecter.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Gamemodes/PurgatoryWarrior",
 Introduced = "28",
 Link = "Errant Specter",
 Missions = { "Granum Void" },
 Name = "Errant Specter",
 Scans = 30,
 TileSets = { "Corpus Ship" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Eye Laser",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Armor = 50,
 Affinity = 35,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Exploiter Orb"] = {
 General = {
 Actor = "Rachel Sellers",
 Description = "Exploiter harvests energy from the landscape and uses storms of ice and snow to safeguard the Temple of Profit from trespassers.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "ExploiterOrb.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidCamperTerraAgent",
 Introduced = "24",
 Link = "Exploiter Orb",
 Missions = { "Fortuna Bounty" },
 Name = "Exploiter Orb",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Grand Boss",
 Weapons = { "" },
 },
 Stats = {
 Health = 12000,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 50,
 --Multis = { "?" },
 }
 },
 ["Fog Comba"] = {
 -- no weapon data found
 General = {
 Description = "Disrupts Perception powers",
 Faction = "Corpus",
 Image = "FogComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentWalkingDetector",
 Introduced = "17.5",
 Link = "Fog Comba",
 Name = "Fog Comba",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Fog Scrambus"] = {
 -- no weapon data found
 General = {
 Description = "Disrupts Perception powers",
 Faction = "Corpus",
 Image = "FogScrambus.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentSkatingDetector",
 Introduced = "17.5",
 Link = "Fog Scrambus",
 Name = "Fog Scrambus",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Frigate = {
 General = {
 Description = "Armed with a highly accurate laser cannon",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "/Lotus/Types/Enemies/SpaceBattles/Corpus/LaserShipNavAgent",
 Image = "CrpShipLaser.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/LaserShipNavAgent",
 --Introduced = "?",
 Link = "Frigate",
 Missions = { "Archwing (Mission)" },
 Name = "Frigate",
 Planets = { "Venus", "Mars", "Jupiter", "Neptune" },
 Scans = 5,
 TileSets = { "Corpus Ship (Archwing)" },
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
 TotalDamage = 6,
 StatusChance = 0,
 },
 },
 Health = 100,
 Shield = 100,
 Armor = 75,
 Affinity = 200,
 EximusAffinity = 750,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Fusion MOA"] = {
 General = {
 Description = "The latest in Corpus Robotics. These Moas have been augmented with salvaged Orokin technology. Their focused beam attack is deadly. A Fusion Moa will deploy a support Drone when sufficiently damaged.",
 Faction = "Corpus",
 Image = "MoaFusion.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/SuperMoaBipedAgent",
 Introduced = "7.10",
 Link = "Fusion MOA",
 Name = "Fusion MOA",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 75,
 StatusChance = 0.1,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Shield = 150,
 EximusShield = 150,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 Gox = {
 -- no weapon data found
 General = {
 Description = "Armed with a Mining Laser and Explosive Launcher",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CrpCombatPod.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/CorpusPodAgent",
 Introduced = "15",
 Link = "Gox",
 Missions = { "Archwing (Mission)" },
 Name = "Gox",
 Scans = 3,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 350,
 Shield = 250,
 Armor = 500,
 Affinity = 250,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Gyre Hyena"] = {
 General = {
 Description = "Scatters tether mines with its spin attack, or lays down automatic fire with its cannon.",
 Faction = "Corpus",
 Image = "GyreHyena.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/Hyenas/VenusHyenaHotrodAgent",
 Introduced = "24",
 Link = "Gyre Hyena",
 Missions = { "Fortuna Bounty" },
 Name = "Gyre Hyena",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 },
 Health = 800,
 Shield = 500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Hyena LN2"] = {
 General = {
 Abilities = { "Ice Wave" },
 Description = "Strong Melee attacks with a Slow Aura",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DEHyenaLN2.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Hyena/HyenaIceAgent",
 --Introduced = "?",
 Link = "Hyena Pack#Hyena LN2",
 Missions = { "Assassination", "Psamathe" },
 Name = "Hyena LN2",
 Planets = { "Neptune" },
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 8,
 StatusChance = 0.1,
 },
 },
 Health = 800,
 Shield = 1000,
 Armor = 25,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Hyena NG"] = {
 General = {
 Abilities = { "Blast Grenade", "Fire Wave" },
 Description = "Heavy AoE attacks with a Heat Resistance Aura",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DEHyenaNg.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Hyena/HyenaFireAgent",
 --Introduced = "?",
 Link = "Hyena Pack#Hyena NG",
 Missions = { "Assassination", "Psamathe" },
 Name = "Hyena NG",
 Planets = { "Neptune" },
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Heat = 1,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 100,
 },
 },
 Health = 800,
 Shield = 1000,
 Armor = 25,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Hyena PB"] = {
 General = {
 Abilities = { "Lead Storm" },
 Description = "Long range attacks with Shield Recharge Aura",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DEHyenaPb.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Hyena/HyenaGunAgent",
 --Introduced = "?",
 Link = "Hyena Pack#Hyena PB",
 Missions = { "Assassination", "Psamathe" },
 Name = "Hyena PB",
 Planets = { "Neptune" },
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 },
 Health = 800,
 Shield = 1000,
 Armor = 25,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Hyena TH"] = {
 General = {
 Abilities = { "Electric Surge", "Charge" },
 Description = "Charging attacks with a Power Drain and HUD Scrambling Aura",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "DEHyenaTh.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Hyena/HyenaElecAgent",
 --Introduced = "?",
 Link = "Hyena Pack#Hyena TH",
 Missions = { "Assassination", "Psamathe" },
 Name = "Hyena TH",
 Planets = { "Neptune" },
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 },
 Health = 800,
 Shield = 1000,
 Armor = 25,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Icemire Hyena"] = {
 General = {
 Description = "Usually found in the Orb Vallis, this Hyena model lobs ice grenades and fires electric bolts.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "IcemireHyena.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/Hyenas/VenusHyenaAstroAgent",
 Introduced = "24",
 Link = "Icemire Hyena",
 Missions = { "Fortuna Bounty" },
 Name = "Icemire Hyena",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 },
 Health = 800,
 Shield = 500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Isolator Bursa"] = {
 General = {
 Description = "Separates and isolates its prey",
 Faction = "Corpus",
 Image = "RiotMoaDispersion.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/RiotBipedDispersionAgent",
 Introduced = "16.4",
 Link = "Isolator Bursa",
 Name = "Isolator Bursa",
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 0.2871,
 Electricity = 0.7129,
 },
 TotalDamage = 35,
 Multishot = 8,
 StatusChance = 0,
 },
 },
 Health = 1200,
 Shield = 700,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Console: 3.0x", "Front: 0.4x", "Gun: 0.5x", "Shield: 0.0x" },
 }
 },
 Jackal = {
 General = {
 Abilities = { "Homing Missiles", "Plasma Grenade Cluster", "Rippling Shockwave", "Grid Wall", "Massive Shockwave" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "QuadJackal.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/QuadRobot/QuadRobotAgentNEW",
 Introduced = "Vanilla",
 Link = "Jackal",
 Missions = { "Assassination", "Fossa" },
 Name = "Jackal",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 15,
 StatusChance = 0.02,
 },
 {
 AttackName = "Burst Grenade",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 100,
 Multishot = 6,
 StatusChance = 0.02,
 },
 },
 Health = 1500,
 Shield = 2000,
 Armor = 100,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 8,
 --Multis = { "?" },
 }
 },
 ["Jad Teran"] = {
 General = {
 Abilities = { "Proximity Mines", "Disruption Helmet" },
 Description = "A young and ambitious Anyo Corp. employee, Jad has demonstrated remarkable aptitude for micromanaging machinery. He was promoted to the Robotics Technology Division where he leads the design of new robotics to be utilized by other divisions of Anyo Corp.",
 Faction = "Corpus",
 Image = "CCTeamBDisruptorAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamB/CCTeamBDisruptorAgent",
 --Introduced = "?",
 Link = "Jad Teran",
 Missions = { "The Index" },
 Name = "Jad Teran",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged / Melee",
 Weapons = { "Staticor", "Lecta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Staticor Shot Damage",
 DamageDistribution = {
 Magnetic = 1,
 },
 TotalDamage = 44,
 StatusChance = 0.28,
 },
 {
 AttackName = "Staticor AoE Damage",
 DamageDistribution = {
 Magnetic = 1,
 },
 TotalDamage = 88,
 StatusChance = 0.28,
 Note = "Does 1.2x more damage when charged"
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 70,
 StatusChance = 0.25,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Jen Dro"] = {
 General = {
 Abilities = { "Mimic", "Deploy Translocators" },
 Description = "Jen specializes in corporate espionage and uses the information she gathers to facilitate sudden downturns for her opponents.",
 Faction = "Corpus",
 Image = "CCTeamCDeceptionAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamC/CCTeamCDeceptionAgent",
 --Introduced = "?",
 Link = "Jen Dro",
 Missions = { "The Index" },
 Name = "Jen Dro",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged / Melee",
 Weapons = { "Dual Cestra", "Obex" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 5,
 StatusChance = 0,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.7,
 Puncture = 0.15,
 Slash = 0.15,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Crewman"] = {
 General = {
 Description = "A common employee of the Corpus Armada.",
 Faction = "Corpus",
 Image = "JunoCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCrewmanAgent",
 Introduced = "28",
 Link = "Juno Crewman",
 Name = "Juno Crewman",
 Scans = 20,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Spirex", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.5,
 Electricity = 0.5,
 },
 TotalDamage = 12,
 StatusChance = 0.02,
 },
 {
 AttackName = "Magnetic Grenade",
 DamageDistribution = {
 Magnetic = 300
 },
 TotalDamage = 300,
 StatusChance = 0,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 150,
 EximusShield = 150,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Dera MOA"] = {
 General = {
 Description = "A Moa equipped with a modified Dera rifle.",
 Faction = "Corpus",
 Image = "JunoDeraMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipMoaDeraAgent",
 Introduced = "28",
 Link = "Juno Dera MOA",
 Name = "Juno Dera MOA",
 Scans = 20,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Dera", "Prova" },
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
 StatusChance = 0.01,
 },
 },
 Health = 60,
 EximusHealth = 60,
 Shield = 150,
 EximusShield = 150,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Juno Disc MOA"] = {
 General = {
 Description = "A Moa equipped with a Disc Launcher.",
 Faction = "Corpus",
 Image = "JunoDiscMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipMoaDiscAgent",
 Introduced = "28",
 Link = "Juno Disc MOA",
 Name = "Juno Disc MOA",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.28,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 60,
 EximusHealth = 60,
 Shield = 200,
 EximusHealth = 200,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Juno Elite Crewman"] = {
 General = {
 Description = "A security specialist who is deployed in response to high-level threats.",
 Faction = "Corpus",
 Image = "JunoEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCrewmanEliteAgent",
 Introduced = "28",
 Link = "Juno Elite Crewman",
 Name = "Juno Elite Crewman",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Supra", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 15,
 StatusChance = 0,
 },
 {
 AttackName = "Magnetic Grenade",
 DamageDistribution = {
 Magnetic = 300
 },
 TotalDamage = 300,
 StatusChance = 0,
 },
 },
 Health = 120,
 EximusHealth = 120,
 Shield = 200,
 EximusShield = 200,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Fog Comba"] = {
 -- missing weapon data
 General = {
 Description = "An officer who can disable Perception-affecting abilities from Warframes.",
 Faction = "Corpus",
 Image = "JunoFogComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCombaDetectorAgent",
 Introduced = "28",
 Link = "Juno Fog Comba",
 Name = "Juno Fog Comba",
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Ranged/Melee",
 Weapons = { "Convectrix", "Ambassador", "Agendus" },
 },
 Stats = {
 Health = 1100,
 EximusHealth = 1100,
 Shield = 400,
 EximusShield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Geminex MOA"] = {
 General = {
 Description = "A Moa equipped with Twin Rocket Launchers.",
 Faction = "Corpus",
 Image = "JunoGeminexMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipMoaDualCannonAgent",
 Introduced = "28",
 Link = "Juno Geminex MOA",
 Name = "Juno Geminex MOA",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Rocket Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 15,
 BurstCount = 2,
 StatusChance = 0,
 },
 {
 AttackName = "Rocket AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 5,
 StatusChance = 0.05,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 200,
 EximusShield = 200,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Juno Glaxion MOA"] = {
 General = {
 Description = "A Moa equipped with a modified Glaxion rifle.",
 Faction = "Corpus",
 Image = "JunoGlaxionMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipMoaGlaxionAgent",
 Introduced = "28",
 Link = "Juno Glaxion MOA",
 Name = "Juno Glaxion MOA",
 Planets = { "Venus", "Jupiter", "Neptune", "Pluto", "Europa", "Phobos" },
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "",
 Weapons = { "Glaxion" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 4,
 StatusChance = 0.02,
 },
 },
 Health = 150,
 EximusHealth = 150,
 Shield = 210,
 EximusShield = 210,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Juno Jactus Osprey"] = {
 General = {
 Description = "Lobs explosive orbs that detonate after several seconds.",
 Faction = "Corpus",
 Image = "JunoJactusOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipOspreyMineAgent",
 Introduced = "28",
 Link = "Juno Jactus Osprey",
 Name = "Juno Jactus Osprey",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Deployer",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Orb Contact Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 25,
 },
 {
 AttackName = "Orb Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 100,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 25,
 EximusShield = 25,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Malleus Machinist"] = {
 General = {
 Description = "A specilist Crewman who wields a massive torque-wrench.",
 Faction = "Corpus",
 Image = "JunoMalleusMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipMachinistHammerAgent",
 Introduced = "28",
 Link = "Juno Malleus Machinist",
 Name = "Juno Malleus Machinist",
 Scans = 5,
 TileSets = { "Corpus Ship" },
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
 TotalDamage = 55,
 StatusChance = 0,
 },
 },
 Health = 300,
 EximusHealth = 300,
 Shield = 200,
 EximusShield = 200,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Juno Nul Comba"] = {
 -- missing weapon data
 General = {
 Description = "An officer who can disable Supporting and Debilitating abilities from Warframes.",
 Faction = "Corpus",
 Image = "JunoNulComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCombaShieldAgent",
 Introduced = "28",
 Link = "Juno Nul Comba",
 Name = "Juno Nul Comba",
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Ranged/Melee",
 Weapons = { "Convectrix", "Ambassador", "Agendus" },
 },
 Stats = {
 Health = 1100,
 EximusHealth = 1100,
 Shield = 400,
 EximusShield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Nullifier Crewman"] = {
 General = {
 Description = "Engages a field that disables Warframe powers.",
 Faction = "Corpus",
 Image = "JunoNullifierCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCrewmanNullifierAgent",
 Introduced = "28",
 Link = "Juno Nullifier Crewman",
 Name = "Juno Nullifier Crewman",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "Dual Cestra", "Prova" },
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
 StatusChance = 0.1,
 },
 },
 Health = 400,
 EximusHealth = 400,
 Shield = 200,
 EximusShield = 200,
 Affinity = 150,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Oxium Osprey"] = {
 -- test self destruct damage
 General = {
 Abilities = { "Kamikaze" },
 Description = "Charges its target and detonates when threatened",
 Faction = "Corpus",
 Image = "JunoOxiumOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipOspreyOxiumAgent",
 Introduced = "28",
 Link = "Juno Oxium Osprey",
 Name = "Juno Oxium Osprey",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Beam Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 700,
 Shield = 150,
 Armor = 40,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Sap Comba"] = {
 -- missing weapon data
 General = {
 Description = "An officer who can disable Damaging abilities from Warframes.",
 Faction = "Corpus",
 Image = "JunoSapComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCombaLaserAgent",
 Introduced = "28",
 Link = "Juno Sap Comba",
 Name = "Juno Sap Comba",
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Ranged/Melee",
 Weapons = { "Convectrix", "Ambassador", "Agendus" },
 },
 Stats = {
 Health = 1100,
 EximusHealth = 1100,
 Shield = 400,
 EximusShield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Sapper MOA"] = {
 General = {
 Description = "Launches slow-moving, high-charged orbs of electricity",
 Faction = "Corpus",
 Image = "JunoSapperMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Gamemodes/Ascension/AscensionCannonMoaAgent",
 Introduced = "36",
 Link = "Juno Sapper MOA",
 Missions = { "Brutus", "Ascension" },
 Name = "Juno Sapper MOA",
 Scans = 5,
 TileSets = { "Stalker's Lair" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Orb Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 100,
 StatusChance = 1,
 Note = "Guarantees stagger on contact"
 },
 {
 AttackName = "Orb AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 5,
 StatusChance = 0.05
 },
 },
 Health = 100,
 Shield = 200,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Gun: 0.5x", "Fanny Pack: 3.0x" },
 }
 },
 ["Juno Shield Osprey"] = {
 General = {
 Description = "Recharges the shields of nearby allies.",
 Faction = "Corpus",
 Image = "JunoShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipOspreyShieldAgent",
 Introduced = "28",
 Link = "Juno Shield Osprey",
 Name = "Juno Shield Osprey",
 Scans = 20,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
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
 TotalDamage = 12,
 StatusChance = 0.02,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 25,
 EximusShield = 25,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Slo Comba"] = {
 -- missing weapon data
 General = {
 Description = "An officer who can disable Mobility abilities from Warframes.",
 Faction = "Corpus",
 Image = "JunoSloComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCombaTeslaAgent",
 Introduced = "28",
 Link = "Juno Slo Comba",
 Name = "Juno Slo Comba",
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Ranged/Melee",
 Weapons = { "Convectrix", "Ambassador", "Agendus" },
 },
 Stats = {
 Health = 1100,
 EximusHealth = 1100,
 Shield = 400,
 EximusShield = 400,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Sniper Crewman"] = {
 General = {
 Description = "A crewman specialized in long-ranged firearms.",
 Faction = "Corpus",
 Image = "JunoSniperCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCrewmanSniperAgent",
 Introduced = "28",
 Link = "Juno Sniper Crewman",
 Name = "Juno Sniper Crewman",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Sniper",
 Weapons = { "Stahlta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2307,
 Puncture = 0.2307,
 Slash = 0.2307,
 Electricity = 0.3077
 },
 TotalDamage = 52,
 StatusChance = 0.1,
 },
 },
 Health = 40,
 EximusHealth = 40,
 Shield = 40,
 EximusShield = 40,
 Affinity = 150,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Juno Tech"] = {
 General = {
 Description = "A specialist who dispatches a Shield Osprey when threatened",
 Faction = "Corpus",
 Image = "JunoTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/CorpusShipRemastered/ShipCrewmanTechAgent",
 Introduced = "28",
 Link = "Juno Tech",
 Name = "Juno Tech",
 Scans = 5,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "Heavy",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 700,
 EximusHealth = 700,
 Shield = 225,
 EximusShield = 225,
 Affinity = 150,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Kyta Raknoid"] = {
 General = {
 Description = "A large Raknoid, with multiple attact vectors that is most frequently deployed during high alert levels.",
 Faction = "Corpus",
 Image = "KytaRaknoid.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidWraithAgent",
 Introduced = "24",
 Link = "Kyta Raknoid",
 Name = "Kyta Raknoid",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 8,
 StatusChance = 0.01,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 25,
 Multihit = 2,
 },
 {
 AttackName = "Overshield-Boosted Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 12,
 StatusChance = 0,
 },
 {
 AttackName = "Overshield-Boosted Shot AoE Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 4,
 StatusChance = 0,
 },
 {
 AttackName = "Overshield-Boosted Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50,
 Multihit = 2,
 },
 },
 Health = 4000,
 Shield = 10000,
 Armor = 150,
 Affinity = 1500,
 BaseLevel = 1,
 Multis = { "Head: 2.25x" },
 }
 },
 ["Latrox Une"] = {
 General = {
 Actor = "Guy Cunningham",
 Description = "Marooned Corpus researcher, unwilling resident on Deimos and ally-of-circumstance to the Entrati. Happy to see a non-Infested face.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CrewmanTech.png",
 InternalName = "/Lotus/Types/Enemies/Infested/InfestedMicroplanet/DeployableSpacemanResearcher",
 Introduced = "29",
 Link = "Latrox Une",
 Missions = { "Necralisk Bounty" },
 Name = "Latrox Une",
 Planets = { "Deimos" },
 Scans = 3,
 TileSets = { "Cambion Drift" },
 Type = "Ranged",
 Weapons = { "Supra" },
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
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 450,
 Shield = 250,
 Affinity = 500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Leech Osprey"] = {
 General = {
 Description = "Deployed by Fusion Moa",
 Faction = "Corpus",
 Image = "LeechOspreyDE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/AIWeek/LeechDroneAgent",
 Introduced = "Vanilla",
 Link = "Leech Osprey",
 Name = "Leech Osprey",
 Scans = 10,
 Type = "Deployer",
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
 TotalDamage = 3,
 StatusChance = 0.1,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Shield = 25,
 EximusShield = 25,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Lockjaw & Sol"] = {
 General = {
 Description = "The Loan Reclamation Division worked closely with Alad V on several ventures during his tenure on the Corpus Board of Directors. Despite his involuntary retirement, it is speculated that the Xol Brothers still undertake assignments on his behalf. These robots, based on Alad V's own patented designs were delivered as payment for services rendered and only serve to strengthen such suspicions.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CCTeamAZanukaAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamA/CCTeamAZanukaAgent",
 --Introduced = "?",
 Link = "Lockjaw & Sol",
 Missions = { "The Index" },
 Name = "Lockjaw & Sol",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 3,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 1000,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Locust Drone"] = {
 General = {
 Description = "Follows a target while attacking them with lasers",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "CrpSwarmDrone.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Drones/SwarmDrone",
 --Introduced = "?",
 Link = "Locust Drone",
 Missions = { "Archwing (Mission)" },
 Name = "Locust Drone",
 Scans = 10,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Beam Damage",
 DamageDistribution = {
 Radiation = 1,
 },
 TotalDamage = 5,
 StatusChance = 0.001,
 },
 },
 Health = 10,
 Armor = 50,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Lynx = {
 General = {
 Abilities = { "Stomp Shockwave", "Launch Turret", "Launch Lynx Osprey" },
 Description = "Summons Turrets and Ospreys",
 Faction = "Corpus",
 Image = "CrpMiniJackal.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/QuadRobot/MiniBoss/QuadRobotMiniBossAgent",
 Introduced = "15",
 Link = "Lynx",
 Missions = { "Orokin Sabotage", "Help Clem", "Grineer Spy" },
 Name = "Lynx",
 Scans = 3,
 Type = "Field Boss",
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
 TotalDamage = 7,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Armor = 150,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Lynx Osprey"] = {
 General = {
 Description = "Shields the Lynx from damage.",
 Faction = "Corpus",
 Image = "CrpMiniJackalOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/QuadRobot/MiniBoss/ShieldDroneMiniBossAgent",
 Introduced = "15",
 Link = "Lynx Osprey",
 Missions = { "Orokin Sabotage", "Help Clem", "Grineer Spy" },
 Name = "Lynx Osprey",
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
 Health = 35,
 Shield = 25,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Lynx Turret"] = {
 General = {
 Description = "Attacks any target hostile to the Lynx",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CrpMiniJackalTurret.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/QuadRobot/MiniBoss/TurretQuadMiniBossAgent",
 --Introduced = "?",
 Link = "Lynx Turret",
 Missions = { "Orokin Sabotage", "Help Clem", "Grineer Spy" },
 Name = "Lynx Turret",
 Scans = 20,
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
 Slash = 0.2,
 },
 TotalDamage = 5,
 StatusChance = 0.01,
 },
 },
 Health = 50,
 Shield = 50,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Machinist = {
 General = {
 Abilities = { "Shield Wall", "Deploy Mine Osprey", "Rapid Regeneration" },
 CodexSecret = true,
 Description = "A specialist in synthetic metallurgy protected by a large shield wall. This Corpus Tech brandishes a razor-torch hot enough to melt Sentient armor and is capable of rapid regeneratrion. Summons a Mine Osprey.",
 Faction = "Corpus Amalgam",
 Image = "CorpusMachinist.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/CorpusCarrusPilotAgent",
 Introduced = "25",
 Link = "Machinist",
 Name = "Machinist",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Cinder Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 6,
 StatusChance = 0.27,
 },
 {
 AttackName = "Napalm Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 },
 {
 AttackName = "Napalm Patch Damage",
 DamageDistribution = {
 Heat = 25,
 },
 TotalDamage = 40,
 StatusChance = 0.5,
 },
 },
 Health = 100,
 Shield = 230,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Mine Osprey"] = {
 General = {
 Description = "Deployed by Fusion Moa",
 Faction = "Corpus",
 Image = "MineOspreyDE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/AIWeek/MineDroneAgent",
 --Introduced = "?",
 Link = "Mine Osprey",
 Name = "Mine Osprey",
 Scans = 10,
 Type = "Deployer",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Mine AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 },
 },
 Health = 50,
 EximusHealth = 50,
 Shield = 25,
 EximusShield = 25,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Minima MOA"] = {
 General = {
 Description = "Tiny!",
 Faction = "Corpus",
 Image = "MinimaMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Aristocrats/MiniMoaAgent",
 Introduced = "28",
 Link = "Minima MOA",
 Name = "Minima MOA",
 Scans = 20,
 TileSets = { "Corpus Ship", "Zariman (Tileset)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 60,
 Shield = 120,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Head: 0.5x" },
 }
 },
 ["Mite Raknoid"] = {
 -- no weapon data found
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "MiteRaknoid.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidMicroAgent",
 Introduced = "24",
 Link = "Mite Raknoid",
 Name = "Mite Raknoid",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 150,
 Shield = 30,
 Armor = 50,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 MOA = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "MOADE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/LaserCannonBipedAgent",
 --Introduced = "?",
 Link = "MOA",
 Name = "MOA",
 Planets = { "Venus", "Mars", "Neptune", "Pluto", "Europa" },
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Plasma Rifle" },
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
 StatusChance = 0.01,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x", "Head: 1.0x" },
 }
 },
 ["M-W.A.M."] = {
 General = {
 Abilities = { "Rippling Shockwave", "Harpoon Launcher", "Proximity Mine", "Guardian Aura" },
 Description = "The Multi-Weapon Assault Moa is equipped with a number of weapons to assist the brokers employed by Zenith Galactical with endeavors.",
 Faction = "Corpus",
 Image = "CCTeamCMoaAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamC/CCTeamCMoaAgent",
 --Introduced = "?",
 Link = "M-W.A.M.",
 Missions = { "The Index" },
 Name = "M-W.A.M.",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Amprex", "Glaxion", "Supra", "Penta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Glaxion Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 40,
 StatusChance = 0.35,
 },
 {
 AttackName = "Amprex Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 40,
 StatusChance = 0.2,
 },
 {
 AttackName = "Supra Damage",
 DamageDistribution = {
 Impact = 0.3333,
 Puncture = 0.3333,
 Slash = 0.3334,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 {
 AttackName = "Penta Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 250,
 },
 {
 AttackName = "Rippling Shockwave (Ability)",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 {
 AttackName = "Mine Damage (Ability)",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
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
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Nako Xol"] = {
 General = {
 Abilities = { "Repulsion Wave", "Arctic Aura" },
 Description = "The younger brother of Ved Xol displayed no aptitude for business. Instead, his enthusiasm for violence and conflict have helped him quickly climb corporate ranks.",
 Faction = "Corpus",
 Image = "CCTeamARifleAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamA/CCTeamARifleAgent",
 --Introduced = "?",
 Link = "Nako Xol",
 Missions = { "The Index" },
 Name = "Nako Xol",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged / Melee / Support",
 Weapons = { "Tetra", "Prova" },
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
 StatusChance = 0.1,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Nemes = {
 General = {
 CodexSecret = true,
 Description = "Charges its target and detonates when threatened",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "Nemes.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/SpecialEvents/ArtificerSuicideDroneAgent",
 Introduced = "18.4.1",
 Link = "Nemes",
 Name = "Nemes",
 Scans = 5,
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
 Health = 750,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 5,
 --Multis = { "?" },
 }
 },
 ["Nemes Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "Nemes.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Nemes Ranger",
 Missions = { "Archwing (Mission)" },
 Name = "Nemes Ranger",
 Scans = 20,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 900,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Nemes Rt"] = {
 General = {
 Description = "Follows a target while attacking them with lasers",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "RaptorDrone.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/Vip/RaptorTwoSwarmDroneAgent",
 Introduced = "The Silver Grove",
 Link = "Nemes Rt",
 Missions = { "Assassination", "Naamah" },
 Name = "Nemes Rt",
 Planets = { "Europa" },
 Scans = 10,
 TileSets = { "Corpus Ice Planet" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 15,
 StatusChance = 0.1,
 },
 },
 Health = 25,
 Armor = 50,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 14,
 --Multis = { "?" },
 }
 },
 ["Nemes Scout"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "Nemes.png",
 InternalName = "",
 --Introduced = "?",
 Link = "Nemes Scout",
 Missions = { "Archwing (Mission)" },
 Name = "Nemes Scout",
 Scans = 20,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 900,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Nul Comba"] = {
 -- missing weapon data
 General = {
 Description = "Disrupts Buff and Debuff powers",
 Faction = "Corpus",
 Image = "NulComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentWalkingShield",
 Introduced = "17.5",
 Link = "Nul Comba",
 Name = "Nul Comba",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nul Scrambus"] = {
 -- missing weapon data
 General = {
 Description = "Disrupts Buff and Debuff powers",
 Faction = "Corpus",
 Image = "NulScrambus.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentSkatingShield",
 Introduced = "17.5",
 Link = "Nul Scrambus",
 Name = "Nul Scrambus",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nullifier Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "CrpNullRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/NullifySpacemanAgent",
 --Introduced = "?",
 Link = "Nullifier Crewman",
 Name = "Nullifier Crewman",
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
 Health = 90,
 EximusHealth = 90,
 Shield = 40,
 EximusShield = 40,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Nullifier Target"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CorpusCaptureTarget.png",
 InternalName = "/Lotus/Types/Enemies/CaptureTargets/CaptureTargetCorpusNullifier",
 --Introduced = "?",
 Link = "Nullifier Target",
 Missions = { "Capture" },
 Name = "Nullifier Target",
 Scans = 20,
 Type = "Ranged",
 Weapons = { "Detron" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 },
 Health = 800,
 Shield = 250,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 Optio = {
 General = {
 Abilities = { "Jetpack", "Short-range Teleportation", "Deploy Cryo Sentry" },
 Description = "A high-ranking Corpus official who is armed with a power cryo beam and deploys Cryo Sentries.",
 Faction = "Corpus",
 Image = "Optio.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpAdmiralFlyingAgent",
 Introduced = "29.10",
 Link = "Optio",
 Missions = { "Empyrean" },
 Name = "Optio",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Arca Plasmor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Radiation = 1
 },
 TotalDamage = 500,
 StatusChance = 0.28,
 },
 },
 Health = 250,
 Shield = 100,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0" },
 }
 },
 ["Orm Basilisk"] = {
 General = {
 Description = "This fighter attacks with a tracking turret that delivers focused bursts from its energy beam.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmBasilisk.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSChargeAgent",
 Introduced = "29.10",
 Link = "Orm Basilisk",
 Missions = { "Empyrean" },
 Name = "Orm Basilisk",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8,
 },
 TotalDamage = 12,
 StatusChance = 0.9,
 },
 },
 Health = 190,
 Shield = 175,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Orm Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewRifleAgent",
 Introduced = "29.10",
 Link = "Orm Crewman",
 Missions = { "Empyrean" },
 Name = "Orm Crewman",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Stahlta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 5,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Crewship"] = {
 -- missing data
 General = {
 Description = "Heavy Crewship fitted with assault beams, boarding ramsleds and missile swarms. Deploys a drone to shield allied fighter craft. Armor reinforced with security nodes.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmCrewship.png",
 InternalName = "",
 Introduced = "29.10",
 Link = "Orm Crewship",
 Missions = { "Empyrean" },
 Name = "Orm Crewship",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 3000,
 Shield = 3500,
 Armor = 250,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Orm Detron Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmDetronCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewShotgunAgent",
 Introduced = "29.10",
 Link = "Orm Detron Crewman",
 Missions = { "Empyrean" },
 Name = "Orm Detron Crewman",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Detron", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Disc MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmDiscMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewDiscBipedAgent",
 Introduced = "29.10",
 Link = "Orm Disc MOA",
 Missions = { "Empyrean" },
 Name = "Orm Disc MOA",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.28,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 600,
 Shield = 500,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Orm Elite Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewEliteAgent",
 Introduced = "29.10",
 Link = "Orm Elite Crewman",
 Missions = { "Empyrean" },
 Name = "Orm Elite Crewman",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 200,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Engineer"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmEngineer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpTechEngineerAgent",
 Introduced = "29.10",
 Link = "Orm Engineer",
 Missions = { "Empyrean", "Volatile" },
 Name = "Orm Engineer",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quanta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.48,
 },
 },
 Health = 2000,
 Shield = 250,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Gox"] = {
 General = {
 Description = "Protected by frontal shields and armed with a high-discharge plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmGox.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSGoxAgent",
 Introduced = "29.10",
 Link = "Orm Gox",
 Missions = { "Empyrean" },
 Name = "Orm Gox",
 Planets = { "Veil Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 16,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 800,
 Shield = 650,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Orm Harpi"] = {
 General = {
 Description = "Attack fighter armed with rapid-fire plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmHarpi.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSLaserAgent",
 Introduced = "29.10",
 Link = "Orm Harpi",
 Missions = { "Empyrean" },
 Name = "Orm Harpi",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
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
 TotalDamage = 18,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Shield = 100,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Orm MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewCannonBipedAgent",
 Introduced = "29.10",
 Link = "Orm MOA",
 Missions = { "Empyrean" },
 Name = "Orm MOA",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Dera" },
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
 StatusChance = 0.01,
 },
 },
 Health = 400,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Orm Nullifier Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmNullifierCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewNullifierAgent",
 Introduced = "29.10",
 Link = "Orm Nullifier Crewman",
 Missions = { "Empyrean" },
 Name = "Orm Nullifier Crewman",
 Planets = { "Veil Proxima" },
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
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 },
 Health = 300,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Numon"] = {
 General = {
 Description = "Specialist boarding unit, armed with repeat scatter blaster for shredding enemy personnel.",
 Faction = "Corpus",
 Image = "OrmNumon.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceBoardingShotgunSpacemanAgent",
 Introduced = "29.10",
 Link = "Orm Numon",
 Missions = { "Empyrean" },
 Name = "Orm Numon",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Pilot"] = {
 -- missing plinx data
 General = {
 Description = "Trained to fly Crewships and armed with a laser pistol.",
 Faction = "Corpus",
 Image = "OrmPilot.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewshipCaptain",
 Introduced = "29.10",
 Link = "Orm Pilot",
 Missions = { "Empyrean" },
 Name = "Orm Pilot",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Plinx", "Prova" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmRailgunMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewRJRailgunAgent",
 Introduced = "29.10",
 Link = "Orm Railgun MOA",
 Missions = { "Empyrean" },
 Name = "Orm Railgun MOA",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 25,
 StatusChance = 0.15,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Orm Ranger Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmRangerCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCorpusRailjackFlyingSpacemanAgent",
 Introduced = "29.10",
 Link = "Orm Ranger Crewman",
 Missions = { "Empyrean" },
 Name = "Orm Ranger Crewman",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 Health = 1000,
 Shield = 800,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewShieldDroneAgent",
 Introduced = "29.10",
 Link = "Orm Shield Osprey",
 Missions = { "Empyrean" },
 Name = "Orm Shield Osprey",
 Planets = { "Veil Proxima" },
 Scans = 10,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 22,
 StatusChance = 0.22,
 },
 },
 Health = 200,
 Shield = 25,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmShockwaveMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpRailjackShockwaveBipedAgent",
 Introduced = "29.10",
 Link = "Orm Shockwave MOA",
 Missions = { "Empyrean" },
 Name = "Orm Shockwave MOA",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
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
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 200,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Orm Stropha Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmStrophaCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewMeleeAgent",
 Introduced = "29.10",
 Link = "Orm Stropha Crewman",
 Missions = { "Empyrean" },
 Name = "Orm Stropha Crewman",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Stropha" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 20,
 StatusChance = 0.1,
 },
 },
 Health = 600,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Tech"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "OrmTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewmanTechDeployableAgent",
 Introduced = "29.10",
 Link = "Orm Tech",
 Missions = { "Empyrean" },
 Name = "Orm Tech",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 700,
 Shield = 250,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Vambac"] = {
 General = {
 Description = "Specialist boarding unit trained to wreak havoc on crew and equipment with his proximity-granade launcher.",
 Faction = "Corpus",
 Image = "OrmVambac.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceBoardingRifleSpacemanAgent",
 Introduced = "29.10",
 Link = "Orm Vambac",
 Missions = { "Empyrean" },
 Name = "Orm Vambac",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Penta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Penta Contact Damage",
 DamageDistribution = {
 Impact = 0.68,
 Puncture = 0.02,
 Slash = 0.3,
 },
 TotalDamage = 180,
 StatusChance = 0.21,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 120,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Orm Weaver"] = {
 General = {
 Description = "This Corpus fighter spins and launches target-seeking globes of highly-charged plasma.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "OrmWeaver.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/DeepSpace/SpaceFighterDSPlasmaAgent",
 Introduced = "29.10",
 Link = "Orm Weaver",
 Missions = { "Empyrean" },
 Name = "Orm Weaver",
 Planets = { "Veil Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 120,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 50,
 StatusChance = 0,
 },
 },
 Health = 100,
 Shield = 150,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 45,
 --Multis = { "?" },
 }
 },
 ["Orm Zerca"] = {
 General = {
 Description = "Specialist boarding unit, armed with an impact-hammer capable of rapidly disabling critical ship systems.",
 Faction = "Corpus",
 Image = "AxioZerca.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceBoardingMeleeSpacemanAgent",
 Introduced = "29.10",
 Link = "Orm Zerca",
 Missions = { "Empyrean" },
 Name = "Orm Zerca",
 Planets = { "Veil Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.22,
 Puncture = 0.16,
 Slash = 0.62,
 },
 TotalDamage = 60,
 StatusChance = 0.16,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 45,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Oxium Osprey"] = {
 General = {
 Abilities = { "Kamikaze" },
 Description = "Charges its target and detonates when threatened",
 Faction = "Corpus",
 Image = "OspreySuicide.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/AIWeek/SuicideDroneAgent",
 --Introduced = "?",
 Link = "Oxium Osprey",
 Name = "Oxium Osprey",
 Scans = 5,
 Type = "Ranged",
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
 Health = 700,
 Shield = 150,
 Armor = 40,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Pelna Cade"] = {
 General = {
 Abilities = { "Throwing slow orbs" },
 Description = "Pelna Cade is a skilled technician who graduated with the Xol brothers. Remaining close friends with the family following their military service together, he now works for them to keep the robotics in their service in peak condition.",
 Faction = "Corpus",
 Image = "CCTeamASkateAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamA/CCTeamASkateAgent",
 --Introduced = "?",
 Link = "Pelna Cade",
 Missions = { "The Index" },
 Name = "Pelna Cade",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Detron", "Lecta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 Multishot = 7,
 StatusChance = 0.05,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 70,
 StatusChance = 0.25,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Penta Ranger"] = {
 General = {
 Description = "Crewman equipped with a Jetpack",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "Grineer",
 Image = "JetpackCrewmanPenta.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/CrewMan/JetCorpusTwoNavAgent",
 --Introduced = "?",
 Link = "Penta Ranger",
 Missions = { "Archwing (Mission)" },
 Name = "Penta Ranger",
 Scans = 5,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "Ranged",
 Weapons = { "Penta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Penta Contact Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 60,
 StatusChance = 0.03,
 },
 {
 AttackName = "Penta AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 90,
 StatusChance = 0.03,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 100,
 EximusShield = 100,
 Affinity = 300,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Prod Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "CrewmanProd.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/MeleeSpacemanAgent",
 --Introduced = "?",
 Link = "Prod Crewman",
 Name = "Prod Crewman",
 Scans = 20,
 Type = "Melee",
 Weapons = { "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 20,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 50,
 EximusShield = 50,
 Affinity = 50,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Profit-Taker Orb"] = {
 General = {
 Actor = "Tamara Fritz",
 Description = "Monster of the Vallis and protector of Enrichment Labs, this massive Orb appears to be invulnerable.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "ProfitTakerOrb.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidCamperAvatar",
 Introduced = "24",
 Link = "Profit-Taker Orb",
 Missions = { "Fortuna Bounty" },
 Name = "Profit-Taker Orb",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Grand Boss",
 Weapons = { "" },
 },
 Stats = {
 Health = 7000,
 Shield = 30000,
 Armor = 150,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 60,
 --Multis = { "?" },
 }
 },
 ["Protea Specter"] = {
 General = {
 Abilities = { "Temporal Anchor" },
 Description = "The victim and beneficiary of Parvos Granum's research into Specter Particle Theory, this is all that remains of the Protea Warframe who sacrificed herself to keep Granum safe in a pocket realm beyond time.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "Protea.png",
 InternalName = "/Lotus/Types/Enemies/TennoReplicants/OdaliskQuest/OdaliskQuestSpecterAgent",
 Introduced = "28",
 Link = "Protea Specter",
 Missions = { "The Deadlock Protocol" },
 Name = "Protea Specter",
 Scans = 1,
 Type = "Specter",
 Weapons = { "Velox", "Gunsen" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.48,
 Puncture = 0.22,
 Slash = 0.30,
 },
 TotalDamage = 5,
 StatusChance = 0.05,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.08,
 Puncture = 0.12,
 Slash = 0.8,
 },
 TotalDamage = 160,
 StatusChance = 0.28,
 },
 },
 Health = 70,
 Shield = 100,
 Armor = 200,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 20
 --Multis = { "?" },
 }
 },
 ["Quanta Ranger"] = {
 General = {
 Description = "Crewman equipped with a jetpack.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "Grineer",
 Image = "JetpackCrewmamQuanta.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/CrewMan/JetCorpusThreeNavAgent",
 --Introduced = "?",
 Link = "Quanta Ranger",
 Missions = { "Archwing (Mission)" },
 Name = "Quanta Ranger",
 Scans = 5,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "Ranged",
 Weapons = { "Quanta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Beam Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 35,
 Multishot = 2,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 100,
 EximusShield = 100,
 Affinity = 150,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Rabbleback Hyena"] = {
 General = {
 Description = "This Hyena has been heavily modified to fire its spines as guided projectiles.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "RabblebackHyena.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/Hyenas/VenusHyenaBurnerAgent",
 Introduced = "24",
 Link = "Rabbleback Hyena",
 Missions = { "Fortuna Bounty" },
 Name = "Rabbleback Hyena",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 6,
 StatusChance = 0.05,
 },
 },
 Health = 800,
 Shield = 500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "MoaRailgun.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/RailgunBipedAgent",
 --Introduced = "?",
 Link = "Railgun MOA",
 Name = "Railgun MOA",
 Scans = 10,
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Rana Del"] = {
 General = {
 Description = "More than just a broker, Rana is a hostile customer relations specialist. When investors refuse to pay their debts, they can look forward to a visit from her.",
 Faction = "Corpus",
 Image = "RanaDel.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamD/CCTeamDBusterCAgent",
 --Introduced = "?",
 Link = "Rana Del",
 Missions = { "The Index" },
 Name = "Rana Del",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "Glaxion" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Glaxion Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 55,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Ranger = {
 General = {
 Description = "Crewman equipped with a jetpack.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "Grineer",
 Image = "JetpackCrewmanDera.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/CrewMan/JetCorpusNavAgent",
 --Introduced = "?",
 Link = "Ranger",
 Missions = { "Archwing (Mission)" },
 Name = "Ranger",
 Scans = 5,
 TileSets = { "Corpus Ship (Archwing)" },
 Type = "Ranged",
 Weapons = { "Dera" },
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
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 100,
 EximusShield = 100,
 Affinity = 200,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Raptor Mt"] = {
 General = {
 Abilities = { "Nemes RT Drones" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "RaptorTwoCarrier.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/Vip/RaptorTwoCarrierAgent",
 Introduced = "9",
 Link = "Raptors#MT",
 Missions = { "Assassination", "Naamah" },
 Name = "Raptor Mt",
 Planets = { "Europa" },
 Scans = 3,
 TileSets = { "Corpus Ice Planet" },
 Type = "Boss",
 Weapons = { "Explosive Laser Bolt" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 2500,
 Shield = 600,
 Armor = 25,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 23,
 --Multis = { "?" },
 }
 },
 ["Raptor Ns"] = {
 General = {
 Abilities = { "Energy Mortar" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "RaptorTwoMortar.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/Vip/RaptorTwoMortarAgent",
 Introduced = "9",
 Link = "Raptors#NS",
 Missions = { "Assassination", "Naamah" },
 Name = "Raptor Ns",
 Planets = { "Europa" },
 Scans = 3,
 TileSets = { "Corpus Ice Planet" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 2000,
 Shield = 600,
 Armor = 25,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 23,
 --Multis = { "?" },
 }
 },
 ["Raptor Rv"] = {
 General = {
 Abilities = { "Laser Barrage" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "RaptorTwoLaser.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/Vip/RaptorTwoLaserAgent",
 Introduced = "9",
 Link = "Raptors#RV",
 Missions = { "Assassination", "Naamah" },
 Name = "Raptor Rv",
 Planets = { "Europa" },
 Scans = 3,
 TileSets = { "Corpus Ice Planet" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 3000,
 Shield = 600,
 Armor = 25,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 23,
 --Multis = { "?" },
 }
 },
 ["Raptor RX"] = {
 General = {
 Description = "The Index marks the debut of the X-series of the Raptor. This version of armoured Osprey doubles as both a mobile accounting system and security detail for the brokers employed by Anyo Corp.",
 Faction = "Corpus",
 Image = "CCTeamBRaptorAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamB/CCTeamBOspreyAgent",
 --Introduced = "?",
 Link = "Raptor RX",
 Missions = { "The Index" },
 Name = "Raptor Rx",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Ratel = {
 General = {
 Description = "Compact robots that hunt with relentless zeal.",
 Faction = "Corpus",
 Image = "Ratel.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/QuadRobot/MicroHyenaAgent",
 --Introduced = "?",
 Link = "Ratel",
 Name = "Ratel",
 Scans = 20,
 Type = "Deployable Drone",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Electric Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 10,
 Shield = 30,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 Razorback = {
 General = {
 Abilities = { "Homing Missiles", "Plasma Grenade Cluster", "Rippling Shockwave" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "ArmoredJackal.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/SpecialEvents/ArmoredJackal/ArmoredJackalAgent",
 Introduced = "18.4.10",
 Link = "Razorback",
 Missions = { "Razorback Armada" },
 Name = "Razorback",
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Missile Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 15,
 Multishot = 2,
 StatusChance = 0,
 },
 {
 AttackName = "Missile AoE Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 35,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Cluster",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 100,
 Multishot = 4,
 StatusChance = 0,
 },
 },
 Health = 6000,
 Shield = 2000,
 Armor = 100,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 43,
 --Multis = { "?" },
 }
 },
 ["Remech Osprey"] = {
 General = {
 Description = "Repairs disabled Ambulas units.",
 Faction = "Corpus",
 Image = "RemechOspreyDE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Ambulas/AmbulasHackingDrone",
 Introduced = "20.4",
 Link = "Remech Osprey",
 Missions = { "Assassination", "Hades" },
 Name = "Remech Osprey",
 Planets = { "Pluto" },
 Scans = 5,
 TileSets = { "Corpus Outpost" },
 Type = "Repair",
 Weapons = { "" },
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
 },
 Health = 250,
 Shield = 200,
 Armor = 50,
 Affinity = 200,
 BaseLevel = 1,
 SpawnLevel = 25,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Sap Comba"] = {
 -- missing weapon data
 General = {
 Description = "Disrupts Damage powers",
 Faction = "Corpus",
 Image = "SapComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentWalkingLaser",
 Introduced = "17.5",
 Link = "Sap Comba",
 Name = "Sap Comba",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Sap Scrambus"] = {
 -- missing weapon data
 General = {
 Description = "Disrupts Damage powers",
 Faction = "Corpus",
 Image = "SapScrambus.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentSkatingLaser",
 Introduced = "17.5",
 Link = "Sap Scrambus",
 Name = "Sap Scrambus",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Sapping Osprey"] = {
 General = {
 Description = "Energy orb pulses AoE damage after detonation",
 Faction = "Corpus",
 Image = "DiscOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/AIWeek/DiscDroneAgent",
 --Introduced = "?",
 Link = "Sapping Osprey",
 Name = "Sapping Osprey",
 Scans = 5,
 Type = "Deployer",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 40,
 },
 },
 Health = 80,
 EximusHealth = 100,
 Shield = 25,
 EximusShield = 25,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Scavenger Drone"] = {
 General = {
 Abilities = { "Vacuum", "Rippling Shockwave" },
 Description = "Collects fallen items on the battlefield",
 Faction = "Corpus",
 Image = "ScavangerOspreyDE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/AIWeek/VacuumDroneAgent",
 --Introduced = "?",
 Link = "Scavenger Drone",
 Name = "Scavenger Drone",
 Scans = 10,
 Type = "Ranged",
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
 Health = 50,
 EximusHealth = 50,
 Shield = 25,
 EximusShield = 25,
 Affinity = 100,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Scrofa Armaments Director"] = {
 General = {
 Description = "Director of the Subterranean Armaments Division. Responsible for all research into weapons that can more effectively combat all things fungal.",
 Faction = "Corpus",
 Image = "NokkoBaseCorpusVIP.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoBaseCorpusVIPAgent",
 Introduced = "40",
 Link = "Scrofa Armaments Director",
 Name = "Scrofa Armaments Director",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 5000,
 Shield = 8000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Attack Drone"] = {
 General = {
 Description = "An attack drone that deploys a heat-based aerosol before pummeling targets.",
 Faction = "Corpus",
 Image = "NokkoFlyingAttack.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoFlyingAttackAgent",
 Introduced = "40",
 Link = "Scrofa Attack Drone",
 Name = "Scrofa Attack Drone",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Bolt Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 {
 AttackName = "Bolt AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 750,
 Shield = 1000,
 EximusShield = 900,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Crewman"] = {
 General = {
 Description = "A seasoned combatant specializing in subterranean warfrare.",
 Faction = "Corpus",
 Image = "NokkoEliteSpaceman.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoEliteSpacemanAgent",
 Introduced = "40",
 Link = "Scrofa Crewman",
 Name = "Scrofa Crewman",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 300,
 Shield = 400,
 Affinity = 150,
 EximusAffinity = 300,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Decoy Moa"] = {
 General = {
 Description = "Facilitates weapon testing for the Jackal.",
 Faction = "Corpus",
 Image = "NokkoSuicideBiped.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoSuicideBipedAgent",
 Introduced = "40",
 Link = "Scrofa Decoy MOA",
 Name = "Scrofa Decoy MOA",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Health = 250,
 Shield = 120,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Demolition Director"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "NokkoColonyVIPAvatarA.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoColonyVIPAvatarA",
 Introduced = "40",
 Link = "Scrofa Demolition Director",
 Name = "Scrofa Demolition Director",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 5000,
 Shield = 8000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Drover Bursa"] = {
 General = {
 Description = "A Bursa unit that corrals its prey for rapid destruction.",
 Faction = "Corpus",
 Image = "NokkoBaseHeavyBiped.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoBaseHeavyBipedAgent",
 Introduced = "40",
 Link = "Scrofa Drover Bursa",
 Name = "Scrofa Drover Bursa",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "Sobek" },
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
 TotalDamage = 8,
 Multishot = 5,
 StatusChance = 0.25,
 },
 },
 Health = 1200,
 EximusHealth = 900,
 Shield = 800,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Elite Crewman"] = {
 General = {
 Description = "An elite combatant that controls the battlefield through a combination of teleportation and decoy deployment.",
 Faction = "Corpus",
 Image = "NokkoHeavyEliteSpaceman.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoHeavyEliteSpacemanAgent",
 Introduced = "40",
 Link = "Scrofa Elite Crewman",
 Name = "Scrofa Elite Crewman",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 60,
 StatusChance = 0.15,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 1000,
 Shield = 500,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Energy Chief"] = {
 General = {
 Description = "Chief researcher officer of the Subterranean Energy Division. Responcible for producing new methods of energy production to fuel Nef Anyo's ambitions.",
 Faction = "Corpus",
 Image = "NokkoTrappedChestVIP.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoTrappedChestVIPAgent",
 Introduced = "40",
 Link = "Scrofa Energy Chief",
 Name = "Scrofa Energy Chief",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "Supra" },
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
 TotalDamage = 15,
 StatusChance = 0,
 },
 },
 Health = 5000,
 Shield = 8000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Grenadier Crewman"] = {
 General = {
 Description = "A seasoned combatant that utilizes multiple grenade types to deal heavy damage.",
 Faction = "Corpus",
 Image = "NokkoRangedHeavy.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoRangedHeavyAgent",
 Introduced = "40",
 Link = "Scrofa Grenadier Crewman",
 Name = "Scrofa Grenadier Crewman",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "Penta" },
 },
 Stats = {
 -- Attacks = {
 -- {
 -- AttackName = "Grenade Damage",
 -- DamageDistribution = {
 -- Blast = 1
 -- },
 -- TotalDamage = 80,
 -- },
 -- },
 Health = 300,
 Shield = 400,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Heavy Trencher"] = {
 General = {
 Description = "A large hatchet and flying charge attacks make this heavy unit a capable foe.",
 Faction = "Corpus",
 Image = "NokkoMeleeHeavy.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoMeleeHeavyAgent",
 Introduced = "40",
 Link = "Scrofa Heavy Trencher",
 Name = "Scrofa Heavy Trencher",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 55,
 StatusChance = 0,
 },
 },
 Health = 450,
 EximusHealth = 1500,
 Shield = 300,
 EximusShield = 600,
 Affinity = 500,
 EximusAffinity = 750,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Joro Raknoid"] = {
 General = {
 Description = "A large Raknoid, with multiple attack vectors that is most frequently deployed during high alert levels.",
 Faction = "Corpus",
 Image = "NokkoBaseRaknoidVIP.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoBaseRaknoidVIPAgent",
 Introduced = "40",
 Link = "Scrofa Joro Raknoid",
 Name = "Scrofa Joro Raknoid",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 8,
 StatusChance = 0.01,
 },
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 25,
 Multihit = 2,
 },
 {
 AttackName = "Overshield-Boosted Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 12,
 StatusChance = 0,
 },
 {
 AttackName = "Overshield-Boosted Shot AoE Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 4,
 StatusChance = 0,
 },
 {
 AttackName = "Overshield-Boosted Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50,
 Multihit = 2,
 },
 },
 Health = 10000,
 Shield = 10000,
 Armor = 150,
 Affinity = 1500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Laser Moa"] = {
 General = {
 Description = "A quick-moving Moa, armed with a laser disc weapon.",
 Faction = "Corpus",
 Image = "NokkoLaserCannonBiped.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoLaserCannonBipedAgent",
 Introduced = "40",
 Link = "Scrofa Laser MOA",
 Name = "Scrofa Laser MOA",
 Planets = { "Venus" },
 Scans = 10,
 Tilesets = { "Deepmines" },
 Weapons = { "Laser Disc" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.28,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 180,
 Shield = 120,
 Affinity = 100,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Latro Raknoid"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "NokkoPlantVIP.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoPlantVIPAgent",
 Introduced = "40",
 Link = "Scrofa Latro Raknoid",
 Name = "Scrofa Latro Raknoid",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.3,
 Slash = 0.6,
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 },
 Health = 7500,
 Shield = 1500,
 Armor = 400,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Legionary"] = {
 General = {
 Description = "A quick-moving uniit that closes the distance with it's target through a bettering shield, before striking with it's hammer.",
 Faction = "Corpus",
 Image = "NokkoLabMeleeHeavy.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoLabMeleeHeavyAgent",
 Introduced = "40",
 Link = "Scrofa Legionary",
 Name = "Scrofa Legionary",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.22,
 Puncture = 0.16,
 Slash = 0.62,
 },
 TotalDamage = 60,
 StatusChance = 0.16,
 },
 },
 Health = 1000,
 Shield = 300,
 Armor = 25,
 EximusArmor = 25,
 Affinity = 500,
 EximusAffinity = 750,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Light Trencher"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "NokkoMeleeLight.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoMeleeLightAgent",
 Introduced = "40",
 Link = "Scrofa Light Trencher",
 Name = "Scrofa Light Trencher",
 Planets = { "Venus" },
 --Scans = ,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 450,
 EximusHealth = 300,
 Shield = 300,
 EximusShield = 350,
 Affinity = 500,
 EximusAffinity = 750,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Lythrum Raknoid"] = {
 General = {
 Description = "This mid-sized Raknoid spits immobilizing fluid from it's sac before latching onto prey with it's grappling hook.",
 Faction = "Corpus",
 Image = "NokkoArachnoidHunger.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoPlantMeleeHeavyAgent",
 Introduced = "40",
 Link = "Scrofa Lythrum Raknoid",
 Name = "Scrofa Lythrum Raknoid",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 5000,
 Armor = 175,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Mine Osprey"] = {
 General = {
 Description = "Depoloyed by a Fusion Moa.",
 Faction = "Corpus",
 Image = "NokkoMineDrone.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoMineDroneAgent",
 Introduced = "40",
 Link = "Scrofa Mine Osprey",
 Name = "Scrofa Mine Osprey",
 Planets = { "Venus" },
 Scans = 10,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Mine AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 },
 },
 Health = 400,
 Shield = 25,
 EximusShield = 50,
 Affinity = 100,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Mite Raknoid"] = {
 -- no weapon damage found
 General = {
 Description = "A diminutive Raknoid that can close large distances with it's jumping attack.",
 Faction = "Corpus",
 Image = "NokkoArachnoidMicro.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoMiniArachnoidAgent",
 Introduced = "40",
 Link = "Scrofa Mite Raknoid",
 Name = "Scrofa Mite Raknoid",
 Planets = { "Venus" },
 Scans = 20,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Health = 100,
 Shield = 75,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Obviator"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "NokkoFlyingNullify.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoNullifySpacemanAgent",
 Introduced = "40",
 Link = "Scrofa Obviator",
 Name = "Scrofa Obviator",
 Planets = { "Venus" },
 --Scans = ,
 Tilesets = { "Deepmines" },
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 },
 Health = 180,
 Shield = 120,
 EximusShield = 450,
 Affinity = 250,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Plasmor Crewman"] = {
 General = {
 Description = "A shotgun wielding combatant specializing in subterranean warfare.",
 Faction = "Corpus",
 Image = "NokkoShotgunSpaceman.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoShotgunSpacemanAgent",
 Introduced = "40",
 Link = "Scrofa Plasmor Crewman",
 Name = "Scrofa Plasmor Crewman",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "Arca Plasmor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 25,
 StatusChance = 0.03,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 100,
 StatusChance = 0,
 },
 },
 Health = 90,
 Shield = 100,
 Affinity = 150,
 EximusAffinity = 300,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Railgun Moa"] = {
 General = {
 Description = "A Moa unit that fires from range while laying mines.",
 Faction = "Corpus",
 Image = "NokkoRailgunBiped.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoRailgunBipedAgent",
 Introduced = "40",
 Link = "Scrofa Railgun Moa",
 Name = "Scrofa Railgun Moa",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 50,
 StatusChance = 0.2,
 },
 },
 Health = 180,
 Shield = 120,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Research Chief"] = {
 General = {
 Description = "Chief technology officer of the Subterranean Research Division. Responcible for reaserching Syzygy energy to the benefit of Nef Anyo.",
 Faction = "Corpus",
 Image = "NokkoLabVIPAvatar.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoLabVIPAgent",
 Introduced = "40",
 Link = "Scrofa Research Chief",
 Name = "Scrofa Research Chief",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "Plinx", "Energy Shield", "Seeker", "Lecta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Plinx Shot Damage",
 DamageDistribution = {
 Impact = 0.143,
 Puncture = 0.286,
 Slash = 0.214,
 Heat = 0.357
 },
 TotalDamage = 56,
 },
 },
 Health = 5000,
 Shield = 8000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Shield Osprey"] = {
 General = {
 Description = "An Osprey that recharges the shields of it's allies.",
 Faction = "Corpus",
 Image = "NokkoFlyingSupport.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoFlyingSupportAgent",
 Introduced = "40",
 Link = "Scrofa Shield Osprey",
 Name = "Scrofa Shield Osprey",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.3,
 Slash = 0.2,
 },
 TotalDamage = 12,
 StatusChance = 0.02,
 },
 },
 Health = 100,
 Shield = 250,
 Affinity = 150,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Shockwave Moa"] = {
 General = {
 Description = "A Moa unit capable of creating a powerful shockwave by stomping it's foot.",
 Faction = "Corpus",
 Image = "NokkoShockwaveBiped.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoShockwaveBipedAgent",
 Introduced = "40",
 Link = "Scrofa Shockwave Moa",
 Name = "Scrofa Shockwave Moa",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 3,
 },
 TotalDamage = 3,
 StatusChance = 0.5,
 Note = "Chains up to 5 targets nearby"
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 180,
 Shield = 120,
 Affinity = 200,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Sniper Ranger"] = {
 General = {
 Description = "A unit that deploys turrets and fires deadly shots from afar using it's laser cannon.",
 Faction = "Corpus",
 Image = "NokkoSniper.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Agents/NokkoSniperAgent",
 Introduced = "40",
 Link = "Scrofa Sniper Ranger",
 Name = "Scrofa Sniper Ranger",
 Planets = { "Venus" },
 Scans = 5,
 Tilesets = { "Deepmines" },
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 60,
 StatusChance = 0.15,
 },
 },
 Health = 25,
 Shield = 450,
 Affinity = 300,
 EximusAffinity = 600,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scrofa Strike Director"] = {
 General = {
 Description = "Director of the Subterranean Strike Division. Responcible for coordinating attacks on targets that drw Nef Anyo's ire.",
 Faction = "Corpus",
 Image = "NokkoColonyVIPAvatarB.png",
 InternalName = "/Lotus/Types/Enemies/NokkoColony/Vip/NokkoColonyVIPAgentB",
 Introduced = "40",
 Link = "Scrofa Strike Director",
 Name = "Scrofa Strike Director",
 Planets = { "Venus" },
 Scans = 3,
 Tilesets = { "Deepmines" },
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Plinx Shot Damage",
 DamageDistribution = {
 Impact = 0.143,
 Puncture = 0.286,
 Slash = 0.214,
 Heat = 0.357
 },
 TotalDamage = 56,
 },
 },
 Health = 5000,
 Shield = 8000,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 ["Scyto Raknoid"] = {
 General = {
 Description = "This mid-sized Raknoid is highly mobile and attacks by latching onto prey with a grappling hook or spitting deadly fluid from its sac.",
 Faction = "Corpus",
 Image = "ScytoRaknoid.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidHungerAgent",
 Introduced = "24",
 Link = "Scyto Raknoid",
 Name = "Scyto Raknoid",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Corrosive = 1,
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 5000,
 Armor = 200,
 Affinity = 1000,
 BaseLevel = 1,
 Multis = { "Head: 2.0x" },
 }
 },
 ["Security Camera"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "Security camera.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Turrets/SecurityCameraAgent",
 Introduced = "5",
 Link = "Security Camera",
 Name = "Security Camera",
 Scans = 20,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Health = 10,
 Shield = 10,
 Affinity = 50,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Senta Turret (Corpus)"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CorpusTurret.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Turrets/AutoTurretHeavyAgent",
 --Introduced = "?",
 Link = "Turret#Corpus",
 Name = "Senta Turret",
 Scans = 20,
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
 Slash = 0.2,
 },
 TotalDamage = 7,
 StatusChance = 0.01,
 },
 },
 Health = 300,
 Armor = 100,
 Affinity = 0, --Actually has no affinity.
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Senta Turret (Orb Vallis)"] = {
 General = {
 Description = "Fires armor-shattering shells at a rapid rate.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "CodexObjTurret.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Turrets/CartTurretLaserAgent",
 Introduced = "24",
 Link = "Turret#Corpus",
 Name = "Senta Turret",
 Planets = { "Venus" },
 Scans = 20,
 TileSets = { "Orb Vallis" },
 Type = "Turret",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 15,
 },
 },
 Health = 500,
 Shield = 100,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Sentient Research Director"] = {
 General = {
 Description = "Director of Sentient studies at Enrichment Labs. The man Nef Anyo has entrusted to reverse engineer recovered Sentient technology.",
 Faction = "Corpus",
 Image = "SentientResearchDirector.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Commanders/VenusCommanderOrangeAgent",
 Introduced = "24.2",
 Link = "Sentient Research Director",
 Missions = { "Fortuna Bounty" },
 Name = "Sentient Research Director",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Supra Vandal" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Slash = 1
 },
 TotalDamage = 8,
 },
 },
 Health = 1750,
 Shield = 1200,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "ShieldOspreyDE.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/AIWeek/ShieldDroneAgent",
 --Introduced = "?",
 Link = "Shield Osprey",
 Name = "Shield Osprey",
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
 Health = 35,
 EximusHealth = 100,
 Shield = 25,
 EximusShield = 25,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "MoaShockwave.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/BipedRobot/AIWeek/ShockwaveBipedAgent",
 --Introduced = "?",
 Link = "Shockwave MOA",
 Name = "Shockwave MOA",
 Scans = 5,
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
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Slo Comba"] = {
 -- missing weapon data
 General = {
 Description = "Disrupts Mobility powers",
 Faction = "Corpus",
 Image = "SloComba.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentWalkingTesla",
 Introduced = "17.5",
 Link = "Slo Comba",
 Name = "Slo Comba",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Slo Scrambus"] = {
 -- missing weapon data
 General = {
 Description = "Disrupts Mobility powers",
 Faction = "Corpus",
 Image = "SloScrambus.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/ModularSpacemanAgentSkatingTesla",
 Introduced = "17.5",
 Link = "Slo Scrambus",
 Name = "Slo Scrambus",
 Scans = 3,
 Type = "Ranged/Melee",
 Weapons = { "Lecta" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 500,
 BaseLevel = 15,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Sniper Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "CrewmanSniper.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/AIWeek/SniperSpacemanAgent",
 Introduced = "7",
 Link = "Sniper Crewman",
 Name = "Sniper Crewman",
 Planets = { "Earth", "Mars", "Jupiter", "Neptune", "Pluto", "Eris", "Europa" },
 Scans = 5,
 Type = "Sniper",
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
 Health = 30,
 EximusHealth = 30,
 Shield = 40,
 EximusShield = 40,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Specter Particles"] = {
 -- Has an unused "/Lotus/Weapons/Tenno/Rifle/SuperDroneRifle" as weapon.
 General = {
 Description = "Energy released when an Errant Specter is defeated. Used to charge the Xoris glaive.",
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "SpecterParticles.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Gamemodes/PurgatoryGhost",
 Introduced = "28",
 Link = "Specter Particles",
 Missions = { "Granum Void" },
 Name = "Specter Particles",
 Scans = 20,
 TileSets = { "Corpus Ship" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Health = 100,
 Armor = 100,
 Affinity = 0,
 BaseLevel = 1,
 Multis = { "" },
 }
 },
 Spectralyst = {
 -- weapons depend on player character
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "SpectralystTenno.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Amalgams/AmalgamSniperReplicaAgent",
 Introduced = "25",
 Link = "Spectralyst",
 Name = "Spectralyst",
 Planets = { "Jupiter" },
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Health = 400,
 Shield = 100,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Head: 1.0x" },
 }
 },
 ["Tarask Bursa"] = {
 General = {
 Abilities = { "Tether mines", "Deploy Aurax Culveri MOA and Aurax Polaris MOA" },
 Description = "Elite Corpus robot. Launches tether-mines to ensnare opponents. Kinetic gun blasts have a strong knockback effect. Deploys defensive Aurax Moas to shield itself.",
 Faction = "Corpus",
 Image = "TaraskBursa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpSpecOpsRiotBipedControlAgent",
 Introduced = "29.10",
 Link = "Tarask Bursa",
 Missions = { "Empyrean" },
 Name = "Tarask Bursa",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 3,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Magnetic = 1,
 },
 TotalDamage = 80,
 StatusChance = 0.025,
 },
 },
 Health = 1200,
 Shield = 800,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 3.0x", "Weapon: 0.5x" },
 }
 },
 ["Taro Basilisk"] = {
 General = {
 Description = "This fighter attacks with a tracking turret that delivers focused bursts from its energy beam.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroBasilisk.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/SpaceFighterChargeAgent",
 Introduced = "29.10",
 Link = "Taro Basilisk",
 Missions = { "Empyrean" },
 Name = "Taro Basilisk",
 Planets = { "Venus Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8,
 },
 TotalDamage = 12,
 StatusChance = 0.9,
 },
 },
 Health = 190,
 Shield = 175,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Taro Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewRifleAgent",
 Introduced = "29.10",
 Link = "Taro Crewman",
 Missions = { "Empyrean" },
 Name = "Taro Crewman",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Stahlta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 5,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Crewship"] = {
 -- no data found
 General = {
 Description = "Light Corpus support Crewship armed with rapid-fire cannons.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroCrewship.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/DeepSpace/DeepSpaceCrpCrewshipCaptain",
 Introduced = "29.10",
 Link = "Taro Crewship",
 Missions = { "Empyrean" },
 Name = "Taro Crewship",
 Planets = { "Venus Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 1500,
 Shield = 2000,
 Armor = 205,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Taro Detron Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroDetronCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewShotgunAgent",
 Introduced = "29.10",
 Link = "Taro Detron Crewman",
 Missions = { "Empyrean" },
 Name = "Taro Detron Crewman",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Detron", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Disc MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroDiscMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewDiscBipedAgent",
 Introduced = "29.10",
 Link = "Taro Disc MOA",
 Missions = { "Empyrean" },
 Name = "Taro Disc MOA",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.28,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 600,
 Shield = 500,
 Affinity = 150,
 BaseLevel = 15,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Taro Elite Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewEliteAgent",
 Introduced = "29.10",
 Link = "Taro Elite Crewman",
 Missions = { "Empyrean" },
 Name = "Taro Elite Crewman",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 200,
 Affinity = 250,
 BaseLevel = 16,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Engineer"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroEngineer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpTechEngineerAgent",
 Introduced = "29.10",
 Link = "Taro Engineer",
 Missions = { "Empyrean", "Volatile" },
 Name = "Taro Engineer",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quanta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.48,
 },
 },
 Health = 2000,
 Shield = 250,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Gox"] = {
 General = {
 Description = "Protected by frontal shields and armed with a high-discharge plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroGox.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Fighters/SpaceFighterGoxAgent",
 Introduced = "29.10",
 Link = "Taro Gox",
 Missions = { "Empyrean" },
 Name = "Taro Gox",
 Planets = { "Venus Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 16,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 800,
 Shield = 650,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Taro Harpi"] = {
 General = {
 Description = "Attack fighter armed with rapid-fire plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroHarpi.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/SpaceFighterLaserAgent",
 Introduced = "29.10",
 Link = "Taro Harpi",
 Missions = { "Empyrean" },
 Name = "Taro Harpi",
 Planets = { "Venus Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
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
 TotalDamage = 18,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Shield = 100,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Taro MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewCannonBipedAgent",
 Introduced = "29.10",
 Link = "Taro MOA",
 Missions = { "Empyrean" },
 Name = "Taro MOA",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Dera" },
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
 StatusChance = 0.01,
 },
 },
 Health = 400,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Taro Nullifier Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroNullifierCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewNullifierAgent",
 Introduced = "29.10",
 Link = "Taro Nullifier Crewman",
 Missions = { "Empyrean" },
 Name = "Taro Nullifier Crewman",
 Planets = { "Venus Proxima" },
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
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 },
 Health = 300,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Numon"] = {
 General = {
 Description = "Specialist boarding unit, armed with repeat scatter blaster for shredding enemy personnel.",
 Faction = "Corpus",
 Image = "TaroNumon.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/BoardingShotgunSpacemanAgent",
 Introduced = "29.10",
 Link = "Taro Numon",
 Missions = { "Empyrean" },
 Name = "Taro Numon",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Pilot"] = {
 -- missing plinx data
 General = {
 Description = "Trained to fly Crewships and armed with a laser pistol.",
 Faction = "Corpus",
 Image = "TaroPilot.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewshipCaptain",
 Introduced = "29.10",
 Link = "Taro Pilot",
 Missions = { "Empyrean" },
 Name = "Taro Pilot",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Plinx", "Prova" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroRailgunMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewRJRailgunAgent",
 Introduced = "29.10",
 Link = "Taro Railgun MOA",
 Missions = { "Empyrean" },
 Name = "Taro Railgun MOA",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 25,
 StatusChance = 0.15,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Taro Ranger Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroRangerCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CorpusRailjackFlyingSpacemanAgent",
 Introduced = "29.10",
 Link = "Taro Ranger Crewman",
 Missions = { "Empyrean" },
 Name = "Taro Ranger Crewman",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 Health = 1000,
 Shield = 800,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Secura Osprey"] = {
 General = {
 Description = "Carries countermeasures that interfer with hacking.",
 Faction = "Corpus",
 Image = "TaroSecuraOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/OverrideJammingDroneAgent",
 Introduced = "29.10",
 Link = "Taro Secura Osprey",
 Missions = { "Empyrean" },
 Name = "Taro Secura Osprey",
 Planets = { "Venus Proxima", "Neptune Proxima", "Pluto Proxima", "Veil Proxima" },
 Scans = 5,
 Type = "Ranged",
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
 Health = 250,
 Shield = 75,
 Affinity = 200,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewShieldDroneAgent",
 Introduced = "29.10",
 Link = "Taro Shield Osprey",
 Name = "Taro Shield Osprey",
 Scans = 10,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 22,
 StatusChance = 0.22,
 },
 },
 Health = 200,
 Shield = 25,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroShockwaveMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpRailjackShockwaveBipedAgent",
 Introduced = "29.10",
 Link = "Taro Shockwave MOA",
 Missions = { "Empyrean" },
 Name = "Taro Shockwave MOA",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
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
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 200,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Taro Stropha Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroStrophaCrewman.png",
 InternalName = "Lotus/Types/Enemies/Corpus/Railjack/CrpCrewMeleeAgent",
 Introduced = "29.10",
 Link = "Taro Stropha Crewman",
 Missions = { "Empyrean" },
 Name = "Taro Stropha Crewman",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Stropha" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 20,
 StatusChance = 0.1,
 },
 },
 Health = 600,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Tech"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TaroTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/CrpCrewmanTechDeployableAgent",
 Introduced = "29.10",
 Link = "Taro Tech",
 Missions = { "Empyrean" },
 Name = "Taro Tech",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 700,
 Shield = 250,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Vambac"] = {
 General = {
 Description = "Specialist boarding unit trained to wreak havoc on crew and equipment with his proximity-granade launcher.",
 Faction = "Corpus",
 Image = "TaroVambac.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/BoardingRifleSpacemanAgent",
 Introduced = "29.10",
 Link = "Taro Vambac",
 Missions = { "Empyrean" },
 Name = "Taro Vambac",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Penta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Penta Contact Damage",
 DamageDistribution = {
 Impact = 0.68,
 Puncture = 0.02,
 Slash = 0.3,
 },
 TotalDamage = 180,
 StatusChance = 0.21,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 120,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Taro Weaver"] = {
 General = {
 Description = "This Corpus fighter spins and launches target-seeking globes of highly-charged plasma.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "TaroWeaver.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/SpaceFighterPlasmaAgent",
 Introduced = "29.10",
 Link = "Taro Weaver",
 Missions = { "Empyrean" },
 Name = "Taro Weaver",
 Planets = { "Venus Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 120,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 50,
 StatusChance = 0,
 },
 },
 Health = 100,
 Shield = 150,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 4,
 --Multis = { "?" },
 }
 },
 ["Taro Zerca"] = {
 General = {
 Description = "Specialist boarding unit, armed with an impact-hammer capable of rapidly disabling critical ship systems.",
 Faction = "Corpus",
 Image = "AxioZerca.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/BoardingMeleeSpacemanAgent",
 Introduced = "29.10",
 Link = "Taro Zerca",
 Missions = { "Empyrean" },
 Name = "Taro Zerca",
 Planets = { "Venus Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.22,
 Puncture = 0.16,
 Slash = 0.62,
 },
 TotalDamage = 60,
 StatusChance = 0.16,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 17,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Ambulas"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraAmbulas.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/Ambulas/VenusAmbulasAgent",
 Introduced = "24.2",
 Link = "Terra Ambulas",
 Name = "Terra Ambulas",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 20,
 StatusChance = 0.3,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 10,
 StatusChance = 0,
 },
 },
 Health = 1500,
 Shield = 500,
 Armor = 150,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x", "Fanny Pack: 0.5x", "Gun: 0.1x" },
 }
 },
 ["Terra Anti MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraAntiMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusLaserDiscBipedAgent",
 Introduced = "24",
 Link = "Terra Anti MOA",
 Name = "Terra Anti MOA",
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 100,
 EximusHealth = 100,
 Shield = 200,
 EximusShield = 200,
 Armor = 100,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x", "Head: 1.0x" },
 }
 },
 ["Terra Attack Drone"] = {
 General = {
 Description = "Deployed by Fusion Moa",
 Faction = "Corpus",
 Image = "TerraAttackDrones.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusDroneAttackAgent",
 Introduced = "24",
 Link = "Terra Attack Drone",
 Name = "Terra Attack Drone",
 Planets = { "Venus" },
 Scans = 10,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
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
 TotalDamage = 9,
 StatusChance = 0.01,
 },
 },
 Health = 250,
 EximusHealth = 100,
 Shield = 75,
 EximusShield = 75,
 Affinity = 100,
 EximusAffinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Auto Turret"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraAutoTurret.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusAutoTurretAgent",
 Introduced = "24",
 Link = "Terra Auto Turret",
 Name = "Terra Auto Turret",
 Planets = { "Venus" },
 Scans = 1,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 25,
 StatusChance = 0.1,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 75,
 },
 },
 Health = 1100,
 Shield = 200,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Terra Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusEliteSpacemanAgent",
 Introduced = "24",
 Link = "Terra Crewman",
 Name = "Terra Crewman",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 80,
 },
 },
 Health = 120,
 EximusHealth = 250,
 Shield = 180,
 EximusShield = 180,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Elite Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusHeavyEliteSpacemanAgent",
 Introduced = "24.0.9",
 Link = "Terra Elite Crewman",
 Name = "Terra Elite Crewman",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 300,
 EximusHealth = 300,
 Shield = 400,
 EximusShield = 400,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Elite Embattor MOA"] = {
 -- no weapon data
 General = {
 Description = "Heavily armored",
 Faction = "Corpus",
 Image = "TerraEliteEmbattorMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusIcewaveEliteBipedAgent",
 Introduced = "24.0.9",
 Link = "Terra Elite Embattor MOA",
 Name = "Terra Elite Embattor MOA",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Health = 1200,
 EximusHealth = 1200,
 Shield = 800,
 EximusShield = 800,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Terra Elite Overtaker"] = {
 General = {
 Description = "Quick-moving heavy unit, armed with an energy bolt weapon.",
 Faction = "Corpus",
 Image = "TerraEliteOvertaker.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusGrenadierEliteSpacemanAgent",
 Introduced = "24.0.9",
 Link = "Terra Elite Overtaker",
 Name = "Terra Elite Overtaker",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Convectrix" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Convectrix Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 120,
 },
 {
 AttackName = "Convectrix AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 50,
 },
 {
 AttackName = "Ice Grenade",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 0,
 StatusChance = 1,
 Note = 'Guarantees Cold proc, doesn\'t deal damage',
 },
 },
 Health = 800,
 EximusHealth = 800,
 Shield = 500,
 EximusShield = 500,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Elite Provisor"] = {
 General = {
 Description = "Hybrid air-ground unit, armed with a Tetra rifle and a devastating visor mounted beam weapon.",
 Faction = "Corpus",
 Image = "TerraEliteProvisor.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusFlyingEliteSpacemanAgent",
 Introduced = "24.0.9",
 Link = "Terra Elite Provisor",
 Name = "Terra Elite Provisor",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Tetra", "Visor Beam" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 600,
 EximusHealth = 600,
 Shield = 800,
 EximusShield = 800,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Elite Raptor Sx"] = {
 General = {
 Abilities = { "Deploy Rabbleback Hyena" },
 Description = "Deploys a Rabbleback Hyena and then pummels targets from range with energy shells.",
 Faction = "Corpus",
 Image = "TerraEliteRaptorSX.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusHeavyEliteDroneAgent",
 Introduced = "24.0.9",
 Link = "Terra Elite Raptor Sx",
 Name = "Terra Elite Raptor Sx",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 35,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 1750,
 Shield = 1750,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Elite Trencher"] = {
 General = {
 Description = "Dual ice-picks and a flying charge attack make a deadly capable foe.",
 Faction = "Corpus",
 Image = "TerraEliteTrencher.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusHeavyMeleeEliteSpacemanAgent",
 Introduced = "24.0.9",
 Link = "Terra Elite Trencher",
 Name = "Terra Elite Trencher",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Melee",
 Weapons = { "Kreska" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 1
 },
 TotalDamage = 75,
 StatusChance = 0.1,
 },
 },
 Health = 800,
 EximusHealth = 800,
 Shield = 500,
 EximusShield = 500,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 30,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Embattor MOA"] = {
 -- no weapon data
 General = {
 Description = "Lays bounce mines and launches artillery barrages.",
 Faction = "Corpus",
 Image = "TerraEmbattorMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusIcewaveBipedAgent",
 Introduced = "24",
 Link = "Terra Embattor MOA",
 Name = "Terra Embattor MOA",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 600,
 EximusHealth = 600,
 Shield = 600,
 EximusShield = 600,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Terra Jackal"] = {
 General = {
 Abilities = { "Electric Shield" },
 Description = "",
 Faction = "Corpus",
 Image = "TerraJackal.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/QuadAgent",
 Introduced = "24",
 Link = "Terra Jackal",
 Name = "Terra Jackal",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 15,
 StatusChance = 0.02,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 100,
 Multishot = 6
 
 },
 },
 Health = 3000,
 EximusHealth = 5000,
 Shield = 3000,
 Armor = 100,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 19,
 Multis = { "Head: 1.0x", "Front Shield: 1.5x" },
 }
 },
 ["Terra Jailer"] = {
 General = {
 Description = "Guards Solaris who have been detained for repossession.",
 Faction = "Corpus",
 Image = "TerraJailer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusGuardSpacemanAgent",
 Introduced = "24",
 Link = "Terra Jailer",
 Missions = { "Orb Vallis Bounty" },
 Name = "Terra Jailer",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Convectrix" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Convectrix Shot Damage",
 DamageDistribution = {
 Electric = 1
 },
 TotalDamage = 40,
 },
 {
 AttackName = "Convectrix AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 {
 AttackName = "Ice Grenade",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 0,
 StatusChance = 1,
 Note = 'Guarantees Cold proc, doesn\'t deal damage',
 },
 },
 Health = 600,
 Shield = 500,
 Affinity = 750,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Manker"] = {
 General = {
 Description = "Heavy, energy shotgun wielding combat unit.",
 Faction = "Corpus",
 Image = "TerraManker.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusCombatSpacemanAgent",
 Introduced = "24.2",
 Link = "Terra Manker",
 Missions = { "Profit-Taker Bounty" },
 Name = "Terra Manker",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Fluctus" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.1,
 Slash = 0.7,
 },
 TotalDamage = 60,
 },
 },
 Health = 900,
 EximusHealth = 900,
 Shield = 800,
 EximusShield = 800,
 Armor = 25,
 Affinity = 500,
 EximusAffinity = 750,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusLaserCannonBipedAgent",
 Introduced = "24",
 Link = "Terra MOA",
 Name = "Terra MOA",
 Planets = { "Venus" },
 Scans = 10,
 TileSets = { "Orb Vallis" },
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
 TotalDamage = 12,
 StatusChance = 0.01,
 }
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusHealth = 120,
 Affinity = 100,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Terra Overtaker"] = {
 General = {
 Description = "Quick-moving heavy unit, armed with an energy bolt weapon.",
 Faction = "Corpus",
 Image = "TerraOvertaker.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusGrenadierSpacemanAgent",
 Introduced = "24",
 Link = "Terra Overtaker",
 Name = "Terra Overtaker",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Convectrix" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Convectrix Shot Damage",
 DamageDistribution = {
 Electric = 1
 },
 TotalDamage = 40,
 },
 {
 AttackName = "Convectrix AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 StatusChance = 0,
 },
 {
 AttackName = "Ice Grenade",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 0,
 StatusChance = 1,
 Note = 'Guarantees Cold proc, doesn\'t deal damage',
 },
 },
 Health = 400,
 EximusHealth = 400,
 Shield = 250,
 EximusShield = 250,
 Affinity = 400,
 EximusAffinity = 750,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Oxium Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraOxiumOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusSuicideDroneAgent",
 Introduced = "24",
 Link = "Oxium Osprey#Terra",
 Name = "Terra Oxium Osprey",
 Planets = { "Venus" },
 Scans = 20,
 TileSets = { "Orb Vallis" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 750,
 EximusHealth = 100,
 Shield = 150,
 EximusHealth = 150,
 Affinity = -1,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Plasmor Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraPlasmorCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusShotgunSpacemanAgent",
 Introduced = "24",
 Link = "Terra Plasmor Crewman",
 Name = "Terra Plasmor Crewman",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Arca Plasmor", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 25,
 StatusChance = 0.03,
 },
 {
 AttackName = "Ice Grenade",
 DamageDistribution = {
 Cold = 1
 },
 TotalDamage = 0,
 StatusChance = 1,
 Note = 'Guarantees Cold proc, doesn\'t deal damage',
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 200,
 EximusShield = 200,
 Affinity = 150,
 EximusAffinity = 300,
 BaseLevel = 1,
 SpawnLevel = 10,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Provisor"] = {
 General = {
 Description = "Hybrid air-ground unit, armed with a Tetra rifle and a devastating visor mounted beam weapon.",
 Faction = "Corpus",
 Image = "TerraProvisor.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusFlyingSpacemanAgent",
 Introduced = "24",
 Link = "Terra Provisor",
 Name = "Terra Provisor",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Tetra" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 20,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 80,
 },
 },
 Health = 300,
 EximusHealth = 300,
 Shield = 450,
 EximusShield = 450,
 Affinity = 300,
 EximusAffinity = 600,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraRailgunMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusRailgunBipedAgent",
 Introduced = "24",
 Link = "Terra Railgun MOA",
 Name = "Terra Railgun MOA",
 Type = "",
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electric = 1
 },
 TotalDamage = 50,
 StatusChance = 0.2,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Terra Raptor SX"] = {
 General = {
 Abilities = { "Deploy Rabbleback Hyena" },
 Description = "Deploys a Rabbleback Hyena and then pummels targets from range with energy shells.",
 Faction = "Corpus",
 Image = "TerraRaptorSX.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusHeavyDroneAgent",
 Introduced = "24",
 Link = "Terra Raptor SX",
 Name = "Terra Raptor SX",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Energy Shells" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shell Shot Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 StatusChance = 0,
 },
 {
 AttackName = "Shell AoE Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 40,
 StatusChance = 0,
 },
 },
 Health = 750,
 Shield = 1000,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Rocket Turret"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraRocketTurret.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusAutoTurretAgentRocket",
 Introduced = "24",
 Link = "Terra Rocket Turret",
 Name = "Terra Rocket Turret",
 Planets = { "Venus" },
 Scans = 1,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 25,
 StatusChance = 0.15,
 },
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 30,
 StatusChance = 0,
 },
 },
 Health = 1100,
 Shield = 200,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Terra Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusShieldDroneAgent",
 Introduced = "24",
 Link = "Terra Shield Osprey",
 Name = "Terra Shield Osprey",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Support",
 Weapons = { "Shield Projection", "Laser Repeater" },
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
 TotalDamage = 12,
 StatusChance = 0.02,
 },
 },
 Health = 35,
 EximusHealth = 100,
 EximusShield = 25,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraShockwaveMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusShockwaveBipedAgent",
 Introduced = "24",
 Link = "Terra Shockwave MOA",
 Name = "Terra Shockwave MOA",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
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
 TotalDamage = 12,
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 EximusHealth = 400,
 Shield = 120,
 EximusShield = 120,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Terra Sniper Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "TerraSniperCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusSniperSpacemanAgent",
 Introduced = "24",
 Link = "Terra Sniper Crewman",
 Name = "Terra Sniper Crewman",
 Planets = { "Venus" },
 Scans = 5,
 TileSets = { "Orb Vallis" },
 Type = "Sniper",
 Weapons = { "Opticor", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 45,
 StatusChance = 0.15,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 170,
 EximusSHield = 170,
 Affinity = 300,
 EximusAffinity = 600,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Terra Trencher"] = {
 General = {
 Description = "Dual ice-picks and a flying charge attack make a deadly capable foe.",
 Faction = "Corpus",
 Image = "TerraTrencher.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Heavies/VenusHeavyMeleeSpacemanAgent",
 Introduced = "24",
 Link = "Terra Trencher",
 Name = "Terra Trencher",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Melee",
 Weapons = { "Kreska" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Puncture = 1,
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 450,
 EximusHealth = 1000,
 Shield = 300,
 EximusShield = 300,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 5,
 Multis = { "Head: 3.0x" },
 }
 },
 ["The Raptor"] = {
 General = {
 CodexSecret = true,
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "RaptorTwoLaser.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Drones/Vip/RaptorPack",
 --Introduced = "?",
 Link = "The Raptor",
 Missions = { "Assassination", "Naamah" },
 Name = "The Raptor",
 Planets = { "Europa" },
 Scans = 10,
 TileSets = { "Corpus Ice Planet" },
 Type = "Boss",
 Weapons = { "" },
 },
 Stats = {
 Health = 100,
 Armor = 200,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["The Sergeant"] = {
 General = {
 Abilities = { "Flash Bang" },
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "BossNefAnyo.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Spaceman/Vip/SniperAgent",
 Introduced = "Vanilla",
 Link = "The Sergeant",
 Missions = { "Iliad" },
 Name = "The Sergeant",
 Planets = { "Phobos" },
 Scans = 3,
 TileSets = { "Corpus Ship" },
 Type = "Boss",
 Weapons = { "Lanka" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 150,
 StatusChange = 0.01,
 },
 },
 Health = 500,
 Shield = 1000,
 Armor = 150,
 Affinity = 1500,
 BaseLevel = 1,
 SpawnLevel = 15,
 --Multis = { "?" },
 }
 },
 ["Thermic Raknoid"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "ArachnoidMolten.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Vip/Arachnoid/ArachnoidMoltenAgent",
 Introduced = "24.6",
 Link = "Thermic Raknoid",
 Missions = { "Thermia Fractures" },
 Name = "Thermic Raknoid",
 Planets = { "Venus" },
 TileSets = { "Orb Vallis" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 400,
 Shield = 30,
 Armor = 50,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Tia Mayn"] = {
 General = {
 Description = "Tia supports her allies by providing them with effective exit strategies when a deal takes a turn for the worse. These strategies often leave the other party with significant medical fees.",
 Faction = "Corpus",
 Image = "CCTeamCStealthAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamC/CCTeamCStealthAgent",
 --Introduced = "?",
 Link = "Tia Mayn",
 Missions = { "The Index" },
 Name = "Tia Mayn",
 Planets = { "Neptune" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Ohma" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 -- Impact = 0.000075, -- so small its nonexistent
 -- Puncture = 0.0003, -- so small its nonexistent
 -- Slash = 0.000075, -- so small its nonexistent
 Electricity = 1
 },
 TotalDamage = 132,
 StatusChance = 0.25,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 Treasurer = {
 General = {
 Actor = "Lucas Schuneman",
 Description = "One of Parvos' favored, keeper of the tokens of his esteem.",
 Faction = "Corpus",
 Image = "Treasurer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Aristocrats/AristocratManagerAgent",
 Introduced = "28",
 Link = "Treasurer",
 Name = "Treasurer",
 Scans = 20,
 TileSets = { "Corpus Ship" },
 Type = "Ranged",
 Weapons = { "Penta" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Penta AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 50,
 },
 },
 Health = 2500,
 Shield = 300,
 Affinity = 50,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vallis Surveillance Drone"] = {
 General = {
 Description = "Patrols the Vallis and reports any suspicious activity back to command.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "?",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/VenusDefenseDroneAgent",
 Introduced = "24",
 Link = "Vallis Surveillance Drone",
 Missions = { "Fortuna Bounty" },
 Name = "Vallis Surveillance Drone",
 Planets = { "Venus" },
 Scans = 20,
 TileSets = { "Orb Vallis" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Health = 500,
 Shield = 750,
 Affinity = 0,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Vapos Anti MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposFusionMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasLaserDiscBipedAgent",
 Introduced = "25",
 Link = "Vapos Anti MOA",
 Name = "Vapos Anti MOA",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 50
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 EximusHealth = 250,
 Shield = 120,
 EximusShield = 120,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Vapos Aquila"] = {
 General = {
 Description = "Nimble and relentless, the Aquila is the staple dogfighter of the Corpus fleet.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VaposAquila.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Dropship/SpaceFighterLaserHunterShipAgent",
 Introduced = "25",
 Link = "Vapos Aquila",
 Name = "Vapos Aquila",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Turret Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 1
 },
 {
 AttackName = "Turret AoE Shockwave",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 10,
 StatusChance = 0,
 },
 },
 Health = 1000,
 Shield = 100,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Vapos Bioengineer"] = {
 General = {
 Description = "",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 Image = "VaposBioengineer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasScientistAgent",
 Introduced = "25",
 Link = "Vapos Bioengineer",
 Name = "Vapos Bioengineer",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "Swarmer Detron" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Swarmer Detron Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 20,
 Multishot = 7, 
 StatusChance = 0,
 },
 {
 AttackName = "Swarmer Detron Areal Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 25,
 Multishot = 7, 
 StatusChance = 0.05,
 },
 },
 Health = 25,
 Shield = 0,
 Armor = 0,
 Affinity = 500,
 BaseLevel = 16,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Condor Dropship"] = {
 -- missing damage data
 General = {
 Description = "Dropship or gunship? Retrofitted for the challenges of Gas City and designed to rapidly deploy force to any security breach.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VaposCondorDropship.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Dropship/CorpusHunterShipAgent",
 Introduced = "25",
 Link = "Vapos Condor Dropship",
 Name = "Vapos Condor Dropship",
 Planets = { "Jupiter" },
 Scans = 10,
 TileSets = { "Corpus Gas City" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Health = 1500,
 Shield = 4000,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Vapos Condor Elite Dropship"] = {
 -- missing damage data
 General = {
 Description = "Dropship or gunship? Retrofitted for the challenges of Gas City and designed to rapidly deploy force to any security breach.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VaposCondorDropship.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Dropship/CorpusHunterShipEliteAgent",
 Introduced = "25",
 Link = "Vapos Condor Elite Dropship",
 Name = "Vapos Condor Elite Dropship",
 Planets = { "Jupiter" },
 Scans = 10,
 TileSets = { "Corpus Gas City" },
 Type = "Dropship",
 Weapons = { "" },
 },
 Stats = {
 Health = 2000,
 Shield = 4000,
 Armor = 100,
 Affinity = 100,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
 ["Vapos Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasRifleSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Crewman",
 Name = "Vapos Crewman",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Dera", "Prova" },
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
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 90,
 EximusHealth = 250,
 Shield = 120,
 EximusShield = 120,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Detron Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposDetronCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasShotgunSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Detron Crewman",
 Name = "Vapos Detron Crewman",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Detron", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 90,
 EximusHealth = 250,
 Shield = 50,
 EximusShield = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Detron Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposDetronRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasFlyingShotgunSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Detron Ranger",
 Name = "Vapos Detron Ranger",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Arca Plasmor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Cold = 1,
 },
 TotalDamage = 25,
 StatusChance = 0.03,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 60,
 EximusHealth = 250,
 Shield = 450,
 EximusShield = 450,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Elite Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasEliteSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Elite Crewman",
 Name = "Vapos Elite Crewman",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 110,
 EximusHealth = 300,
 Shield = 150,
 EximusShield = 150,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Elite Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposEliteRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasFlyingEliteSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Elite Ranger",
 Name = "Vapos Elite Ranger",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Exergis" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 80,
 EximusHealth = 280,
 Shield = 450,
 EximusShield = 450,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Fusion MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposFusionMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasSuperMoaBipedAgent",
 Introduced = "25",
 Link = "Vapos Fusion MOA",
 Name = "Vapos Fusion MOA",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Laser Damage",
 DamageDistribution = {
 Heat = 1
 },
 TotalDamage = 75,
 StatusChance = 0.1,
 },
 },
 Health = 100,
 EximusHealth = 400,
 Shield = 150,
 EximusShield = 150,
 Affinity = 250,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Vapos MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasLaserCannonBipedAgent",
 Introduced = "25",
 Link = "Vapos MOA",
 Name = "Vapos MOA",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 90,
 EximusHealth = 250,
 Shield = 120,
 EximusShield = 120,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Vapos Nullifier"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposNullifier.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasNullifySpacemanAgent",
 Introduced = "25",
 Link = "Vapos Nullifier",
 Name = "Vapos Nullifier",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Prova" },
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
 },
 Health = 90,
 EximusHealth = 250,
 Shield = 50,
 EximusShield = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Nullifier Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposNullifierRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasFlyingNullifierSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Nullifier Ranger",
 Name = "Vapos Nullifier Ranger",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Tetra" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 },
 Health = 80,
 EximusHealth = 280,
 Shield = 450,
 EximusShield = 450,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Oxium Osprey"] = {
 General = {
 Abilities = { "Kamikaze" },
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposOxiumOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasSuicideDroneAgent",
 Introduced = "25",
 Link = "Vapos Oxium Osprey",
 Name = "Vapos Oxium Osprey",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
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
 Health = 700,
 Shield = 150,
 Armor = 40,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Prod Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposProdCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasMeleeSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Prod Crewman",
 Name = "Vapos Prod Crewman",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
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
 StatusChance = 0.2,
 },
 },
 Health = 100,
 EximusHealth = 400,
 Shield = 50,
 EximusShield = 50,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposRailgunMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasRailgunBipedAgent",
 Introduced = "25",
 Link = "Vapos Railgun MOA",
 Name = "Vapos Railgun MOA",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 },
 Health = 90,
 EximusHealth = 250,
 Shield = 120,
 EximusShield = 120,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Vapos Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasFlyingSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Ranger",
 Name = "Vapos Ranger",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Tetra" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 40,
 StatusChance = 0.05,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 80,
 EximusHealth = 280,
 Shield = 450,
 EximusShield = 450,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Sapping Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposSappingOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasDiscDroneAgent",
 Introduced = "25",
 Link = "Vapos Sapping Osprey",
 Name = "Vapos Sapping Osprey",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Deployer",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot AoE Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 40,
 },
 },
 Health = 80,
 EximusHealth = 100,
 Shield = 25,
 EximusShield = 25,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasShieldDroneAgent",
 Introduced = "25",
 Link = "Vapos Shield Osprey",
 Name = "Vapos Shield Osprey",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
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
 Health = 35,
 EximusHealth = 200,
 Shield = 25,
 EximusShield = 25,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposShockwaveMoa.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasShockwaveBipedAgent",
 Introduced = "25",
 Link = "Vapos Shockwave MOA",
 Name = "Vapos Shockwave MOA",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 EximusHealth = 90,
 Shield = 120,
 EximusShield = 120,
 Affinity = 200,
 BaseLevel = 1,
 Multis = { "Fanny Pack: 3.0x", "Gun: 0.5x" },
 }
 },
 ["Vapos Sniper Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposSniperCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasSniperSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Sniper Crewman",
 Name = "Vapos Sniper Crewman",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Sniper",
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
 Health = 30,
 EximusHealth = 250,
 Shield = 40,
 EximusShield = 40,
 Affinity = 150,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Sniper Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposSniperRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasFlyingSniperSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Sniper Ranger",
 Name = "Vapos Sniper Ranger",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Ambassador" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.3,
 Puncture = 0.4,
 Slash = 0.3,
 },
 BurstCount = 3,
 TotalDamage = 16,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 60,
 EximusHealth = 250,
 Shield = 450,
 EximusHealth = 450,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Tech"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasDeployableSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Tech",
 Name = "Vapos Tech",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "Heavy",
 Weapons = { "Supra", "Prova" },
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
 StatusChance = 0.1,
 },
 },
 Health = 200,
 EximusHealth = 300,
 Shield = 100,
 EximusShield = 100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vapos Tech Ranger"] = {
 General = {
 Description = "",
 Faction = "Corpus Amalgam",
 Image = "VaposTechRanger.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/GasCity/GasFlyingDeployableSpacemanAgent",
 Introduced = "25",
 Link = "Vapos Tech Ranger",
 Name = "Vapos Tech Ranger",
 Planets = { "Jupiter" },
 Scans = 5,
 TileSets = { "Corpus Gas City" },
 Type = "Ranged",
 Weapons = { "Supra", "Prova" },
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
 StatusChance = 0.1,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 80,
 EximusHealth = 280,
 Shield = 450,
 EximusShield = 450,
 Affinity = 300,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Ved Xol"] = {
 General = {
 Abilities = { "Summon Nemes", "Arson Aura" },
 Description = "Ved Xol was nominated to become the head of the Loan Reclamation Division at Anyo Corp. after demonstrating ruthless aptitude within the Index. He has obtained favorable results with his team on many occasions, and is a firm favourite amongst corporate backers.",
 Faction = "Corpus",
 Image = "CCTeamAHeavyAgent.png",
 InternalName = "/Lotus/Types/Enemies/CorpusChampions/TeamA/CCTeamAHeavyAgent",
 --Introduced = "?",
 Link = "Ved Xol",
 Missions = { "The Index" },
 Name = "Ved Xol",
 Planets = { "Neptune" },
 Scans = 3,
 Type = "Ranged / Melee / Support",
 Weapons = { "Opticor", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Opticor Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 60,
 StatusChance = 0.15,
 },
 {
 AttackName = "Prova Melee Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 50,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 2500,
 Armor = 50,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vivisect Director"] = {
 General = {
 Description = "Enrichment Labs director of animal dissection and experimentation. Works closely with the Feed and Research Division.",
 Faction = "Corpus",
 Image = "VivisectDirector.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Venus/Commanders/VenusCommanderGreenAgent",
 Introduced = "24.2",
 Link = "Vivisect Director",
 Missions = { "Fortuna Bounty" },
 Name = "Vivisect Director",
 Planets = { "Venus" },
 Scans = 3,
 TileSets = { "Orb Vallis" },
 Type = "Ranged",
 Weapons = { "Plinx" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Plinx Shot Damage",
 DamageDistribution = {
 Impact = 0.143,
 Puncture = 0.286,
 Slash = 0.214,
 Heat = 0.357
 },
 TotalDamage = 56,
 },
 },
 Health = 1750,
 Shield = 1200,
 Armor = 100,
 Affinity = 500,
 BaseLevel = 1,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Basilisk"] = {
 General = {
 Description = "This fighter attacks with a tracking turret that delivers focused bursts from its energy beam.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracBasilisk.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Pluto/SpaceFighterPlutoChargeAgent",
 Introduced = "29.10",
 Link = "Vorac Basilisk",
 Missions = { "Empyrean" },
 Name = "Vorac Basilisk",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.1,
 Slash = 0.8,
 },
 TotalDamage = 12,
 StatusChance = 0.9,
 },
 },
 Health = 190,
 Shield = 175,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Vorac Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewRifleAgent",
 Introduced = "29.10",
 Link = "Vorac Crewman",
 Missions = { "Empyrean" },
 Name = "Vorac Crewman",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Stahlta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.8,
 },
 TotalDamage = 5,
 StatusChance = 0.2,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Crewship"] = {
 -- no data found
 General = {
 Description = "Heavy Crewship fitted with assault beams, boarding ramsleds and missile swarms.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracCrewship.png",
 InternalName = "",
 Introduced = "29.10",
 Link = "Vorac Crewship",
 Missions = { "Empyrean" },
 Name = "Vorac Crewship",
 Planets = { "Pluto Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Crewship",
 Weapons = { "" },
 },
 Stats = {
 Health = 2500,
 Shield = 3000,
 Armor = 235,
 Affinity = -1,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Vorac Detron Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracDetronCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewShotgunAgent",
 Introduced = "29.10",
 Link = "Vorac Detron Crewman",
 Missions = { "Empyrean" },
 Name = "Vorac Detron Crewman",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Detron", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.6,
 Slash = 0.2,
 },
 TotalDamage = 4,
 Multishot = 7,
 StatusChance = 0.01,
 },
 {
 AttackName = "Grenade Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 400,
 },
 },
 Health = 500,
 Shield = 150,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Disc MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracDiscMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewDiscBipedAgent",
 Introduced = "29.10",
 Link = "Vorac Disc MOA",
 Missions = { "Empyrean" },
 Name = "Vorac Disc MOA",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 30,
 StatusChance = 0.28,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 600,
 Shield = 500,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Fanny Pack: 2.0x" },
 }
 },
 ["Vorac Elite Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracEliteCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewEliteAgent",
 Introduced = "29.10",
 Link = "Vorac Elite Crewman",
 Missions = { "Empyrean" },
 Name = "Vorac Elite Crewman",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 200,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Engineer"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracEngineer.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpTechEngineerAgent",
 Introduced = "29.10",
 Link = "Vorac Engineer",
 Missions = { "Empyrean", "Volatile" },
 Name = "Vorac Engineer",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Quanta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 10,
 Multishot = 2,
 StatusChance = 0.48,
 },
 },
 Health = 2000,
 Shield = 250,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Gox"] = {
 General = {
 Description = "Protected by frontal shields and armed with a high-discharge plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracGox.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Pluto/SpaceFighterPlutoGoxAgent",
 Introduced = "29.10",
 Link = "Vorac Gox",
 Missions = { "Empyrean" },
 Name = "Vorac Gox",
 Planets = { "Pluto Proxima" },
 Scans = 3,
 TileSets = { "Free Space" },
 Type = "Assault Craft",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Blast = 1,
 },
 TotalDamage = 16,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 800,
 Shield = 650,
 Armor = 200,
 Affinity = 500,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Vorac Harpi"] = {
 General = {
 Description = "Attack fighter armed with rapid-fire plasma cannon.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracHarpi.png",
 InternalName = "/Lotus/Language/Railjack/CorpusFighterPlutoLaserName",
 Introduced = "29.10",
 Link = "Vorac Harpi",
 Missions = { "Empyrean" },
 Name = "Vorac Harpi",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
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
 TotalDamage = 18,
 StatusChance = 0.1,
 },
 },
 Health = 200,
 Shield = 100,
 Armor = 50,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Vorac MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewCannonBipedAgent",
 Introduced = "29.10",
 Link = "Vorac MOA",
 Missions = { "Empyrean" },
 Name = "Vorac MOA",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Dera" },
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
 StatusChance = 0.01,
 },
 },
 Health = 400,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Vorac Nullifier Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracNullifierCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewNullifierAgent",
 Introduced = "29.10",
 Link = "Vorac Nullifier Crewman",
 Missions = { "Empyrean" },
 Name = "Vorac Nullifier Crewman",
 Planets = { "Pluto Proxima" },
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
 TotalDamage = 30,
 StatusChance = 0.2,
 },
 },
 Health = 300,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Numon"] = {
 General = {
 Description = "Specialist boarding unit, armed with repeat scatter blaster for shredding enemy personnel.",
 Faction = "Corpus",
 Image = "VoracNumon.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoBoardingShotgunSpacemanAgent",
 Introduced = "29.10",
 Link = "Vorac Numon",
 Missions = { "Empyrean" },
 Name = "Vorac Numon",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.2,
 Puncture = 0.3,
 Slash = 0.5,
 },
 TotalDamage = 10,
 Multishot = 3,
 StatusChance = 0,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Pilot"] = {
 -- missing plinx data
 General = {
 Description = "Trained to fly Crewships and armed with a laser pistol.",
 Faction = "Corpus",
 Image = "VoracPilot.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewshipCaptain",
 Introduced = "29.10",
 Link = "Vorac Pilot",
 Missions = { "Empyrean" },
 Name = "Vorac Pilot",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Plinx", "Prova" },
 },
 Stats = {
 Health = 1100,
 Shield = 400,
 Affinity = 300,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Railgun MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracRailgunMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewRJRailgunAgent",
 Introduced = "29.10",
 Link = "Vorac Railgun MOA",
 Missions = { "Empyrean" },
 Name = "Vorac Railgun MOA",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Opticor" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.1,
 Puncture = 0.85,
 Slash = 0.05,
 },
 TotalDamage = 25,
 StatusChance = 0.15,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Vorac Ranger Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracRangerCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCorpusRailjackFlyingSpacemanAgent",
 Introduced = "29.10",
 Link = "Vorac Ranger Crewman",
 Missions = { "Empyrean" },
 Name = "Vorac Ranger Crewman",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Tetra", "Prova" },
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
 Health = 1000,
 Shield = 800,
 Affinity = 250,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Shield Osprey"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracShieldOsprey.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewShieldDroneAgent",
 Introduced = "29.10",
 Link = "Vorac Shield Osprey",
 Missions = { "Empyrean" },
 Name = "Vorac Shield Osprey",
 Planets = { "Pluto Proxima" },
 Scans = 10,
 Type = "Support",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1
 },
 TotalDamage = 22,
 StatusChance = 0.22,
 },
 },
 Health = 200,
 Shield = 25,
 Affinity = 100,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Shockwave MOA"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracShockwaveMOA.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpRailjackShockwaveBipedAgent",
 Introduced = "29.10",
 Link = "Vorac Shockwave MOA",
 Missions = { "Empyrean" },
 Name = "Vorac Shockwave MOA",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Plasma Rifle" },
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
 StatusChance = 0.01,
 },
 {
 AttackName = "Rippling Shockwave",
 DamageDistribution = {
 Impact = 1
 },
 TotalDamage = 50,
 FixedDamage = true,
 },
 },
 Health = 90,
 Shield = 120,
 Affinity = 200,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Fanny Pack: 3.0x" },
 }
 },
 ["Vorac Stropha Crewman"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracStrophaCrewman.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewMeleeAgent",
 Introduced = "29.10",
 Link = "Vorac Stropha Crewman",
 Missions = { "Empyrean" },
 Name = "Vorac Stropha Crewman",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "Stropha" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 20,
 StatusChance = 0.1,
 },
 },
 Health = 600,
 Shield = 50,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Tech"] = {
 General = {
 Description = "",
 Faction = "Corpus",
 Image = "VoracTech.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoCrpCrewmanTechDeployableAgent",
 Introduced = "29.10",
 Link = "Vorac Tech",
 Missions = { "Empyrean" },
 Name = "Vorac Tech",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Exergis", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.0002,
 Puncture = 0.0002,
 Slash = 0.0002,
 Radiation = 0.9994,
 },
 TotalDamage = 1974,
 StatusChance = 0,
 },
 },
 Health = 700,
 Shield = 250,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Vambac"] = {
 General = {
 Description = "Specialist boarding unit trained to wreak havoc on crew and equipment with his proximity-granade launcher.",
 Faction = "Corpus",
 Image = "VoracVambac.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoBoardingRifleSpacemanAgent",
 Introduced = "29.10",
 Link = "Vorac Vambac",
 Missions = { "Empyrean" },
 Name = "Vorac Vambac",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Ranged",
 Weapons = { "Penta", "Prova" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Penta Contact Damage",
 DamageDistribution = {
 Impact = 0.68,
 Puncture = 0.02,
 Slash = 0.3,
 },
 TotalDamage = 180,
 StatusChance = 0.21,
 },
 {
 AttackName = "Explosion Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 120,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 ["Vorac Weaver"] = {
 General = {
 Description = "This Corpus fighter spins and launches target-seeking globes of highly-charged plasma.",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus",
 FactionDamageOverride = "",
 Image = "VoracWeaver.png",
 InternalName = "/Lotus/Types/Enemies/SpaceBattles/Corpus/Ships/Pluto/SpaceFighterPlutoPlasmaAgent",
 Introduced = "29.10",
 Link = "Vorac Weaver",
 Missions = { "Empyrean" },
 Name = "Vorac Weaver",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 TileSets = { "Free Space" },
 Type = "Interceptor",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Electricity = 1,
 },
 TotalDamage = 120,
 },
 {
 AttackName = "Radial Damage",
 DamageDistribution = {
 Blast = 1
 },
 TotalDamage = 50,
 StatusChance = 0,
 },
 },
 Health = 100,
 Shield = 150,
 Armor = 75,
 Affinity = 400,
 BaseLevel = 1,
 SpawnLevel = 32,
 --Multis = { "?" },
 }
 },
 ["Vorac Zerca"] = {
 General = {
 Description = "Specialist boarding unit, armed with an impact-hammer capable of rapidly disabling critical ship systems.",
 Faction = "Corpus",
 Image = "AxioZerca.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/Railjack/Pluto/PlutoBoardingMeleeSpacemanAgent",
 Introduced = "29.10",
 Link = "Vorac Zerca",
 Missions = { "Empyrean" },
 Name = "Vorac Zerca",
 Planets = { "Pluto Proxima" },
 Scans = 5,
 Type = "Melee",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 0.22,
 Puncture = 0.16,
 Slash = 0.62,
 },
 TotalDamage = 60,
 StatusChance = 0.16,
 },
 },
 Health = 750,
 Shield = 450,
 Affinity = 150,
 BaseLevel = 1,
 SpawnLevel = 35,
 Multis = { "Head: 3.0x" },
 }
 },
 Zanuka = {
 General = {
 Abilities = { "Missile Strike", "Frost Bomb", "Dispel" },
 Description = "Fast with claw and missile attacks",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus Amalgam",
 Image = "ZukanaCodex.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/AladVPet/AladVPet",
 Introduced = "11",
 Link = "Zanuka",
 Missions = { "Assasination", "Themisto" },
 Name = "Zanuka",
 Planets = { "Jupiter" },
 Scans = 3,
 TileSets = { "Corpus Gas City" },
 Type = "",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Melee Damage",
 DamageDistribution = {
 Impact = 1,
 },
 TotalDamage = 8,
 StatusChance = 0.1,
 },
 },
 Health = 1000,
 Shield = 15000,
 Armor = 25,
 Affinity = 1000,
 BaseLevel = 1,
 SpawnLevel = 20,
 --Multis = { "?" },
 }
 },
 ["Zanuka Hunter"] = {
 General = {
 Description = "Captures Warframes",
 ExcludedFromSimulacrum = true,
 Faction = "Corpus Amalgam",
 Image = "DEHarvester.png",
 InternalName = "/Lotus/Types/Enemies/Corpus/AladVPet/ZanukaHunterAgent",
 --Introduced = "?",
 Link = "Zanuka Hunter",
 Missions = { "Assassination", "Themisto" },
 Name = "Zanuka Hunter",
 Scans = 3,
 Type = "Assasin",
 Weapons = { "" },
 },
 Stats = {
 Attacks = {
 {
 AttackName = "Shot Damage",
 DamageDistribution = {
 Impact = 0.4,
 Puncture = 0.4,
 Slash = 0.2,
 },
 TotalDamage = 3,
 StatusChance = 0.05,
 },
 },
 Health = 600,
 Shield = 1000,
 Armor = 25,
 Affinity = 1500,
 BaseLevel = 1,
 --Multis = { "?" },
 }
 },
}