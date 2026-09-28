return {
	Angst = {
		General = {
			Abilities = { "Teleport", "Sonic Scream" },
			CodexSecret = false,
			Description = "Agile and ferocious",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "StrikerAcolyte.png",
			InternalName = "/Lotus/Types/Enemies/Acolytes/StrikerAcolyteAgent",
			Introduced = "18.4.1",
			Link = "Angst",
			Name = "Angst",
			Scans = 3,
			Type = "Field Boss",
			Weapons = { "Valkyr Talons" },
		},
		Stats = {
			Attacks = {
				{
					AttackName = "Melee Damage",
					DamageDistribution = {
						Impact = 0.05,
						Puncture = 0.25,
						Slash = 0.7
					},
					TotalDamage = 20,
				},
			},
			Health = 2500,
			Armor = 50,
			Shield = 1500,
			Affinity = 750,
			BaseLevel = 1,
			Multis = { "Head: 1.0x" },
		}
	},
	Malice = {
		General = {
			Abilities = { "Magnetize" },
			CodexSecret = false,
			Description = "Disciplined and accurate",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "HeavyAcolyte.png",
			InternalName = "/Lotus/Types/Enemies/Acolytes/HeavyAcolyteAgent",
			Introduced = "18.4.1",
			Link = "Malice",
			Name = "Malice",
			Scans = 3,
			Type = "Field Boss",
			Weapons = { "Opticor", "Heat Dagger" },
		},
		Stats = {
			Attacks = {
				{
					AttackName = "Shot Damage",
					DamageDistribution = {
						Impact = 0.1,
						Puncture = 0.85,
						Slash = 0.05
					},
					TotalDamage = 250,
				},
				{
					AttackName = "Melee Damage",
					DamageDistribution = {
						Impact = 0.0673,
						Puncture = 0.3654,
						Slash = 0.2692,
						Heat = 0.2981
					},
					TotalDamage = 208,
				},
			},
			Health = 2500,
			Armor = 50,
			Shield = 1500,
			Affinity = 750,
			BaseLevel = 1,
			Multis = { "Head: 1.0x" },
		}
	},
	Mania = {
		General = {
			Abilities = { "Switch Teleport", "Turbulence" },
			CodexSecret = false,
			Description = "Elusive and deadly",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "RogueAcolyte.png",
			InternalName = "/Lotus/Types/Enemies/Acolytes/RogueAcolyteAgent",
			Introduced = "18.4.1",
			Link = "Mania",
			Name = "Mania",
			Scans = 3,
			Type = "Field Boss",
			Weapons = { "Lacera" },
		},
		Stats = {
			Attacks = {
				{
					AttackName = "Melee Damage",
					DamageDistribution = {
						Impact = 0.3,
						Puncture = 0.25,
						Slash = 0.45
					},
					TotalDamage = 80,
				},
			},
			Health = 2500,
			Armor = 50,
			Shield = 1500,
			Affinity = 750,
			BaseLevel = 1,
			Multis = { "Head: 1.0x" },
		}
	},
	Misery = {
		General = {
			Abilities = { "Shadows of the Dead", "Soul Punch" },
			CodexSecret = false,
			Description = "Zealous and patient.",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "AreaCasterAcolyte.png",
			InternalName = "/Lotus/Types/Enemies/Acolytes/AreaCasterAcolyteAgent",
			Introduced = "18.4.1",
			Link = "Misery",
			Name = "Misery",
			Scans = 3,
			Type = "Field Boss",
			Weapons = { "Ether Reaper" },
		},
		Stats = {
			Attacks = {
				{
					AttackName = "Melee Damage",
					DamageDistribution = {
						Impact = 0.15,
						Puncture = 0.15,
						Slash = 0.7,
					},
					TotalDamage = 180,
				},
			},
			Health = 2500,
			Armor = 50,
			Shield = 1500,
			Affinity = 750,
			BaseLevel = 1,
			Multis = { "Head: 1.0x" },
		}
	},
	["Protector Stalker"] = {
		General = {
			Abilities = { "Slash Dash", "Teleport", "Absorb", "Pull", "Smoke Screen", "Reckoning" },
			Description = "I am your reckoning!",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "ProtectorStalker.png",
			InternalName = "/Lotus/Types/Enemies/Stalker/JadeStalkerAgent",
			Introduced = "36",
			Link = "Protector Stalker",
			Name = "Protector Stalker",
			Scans = 3,
			Type = "Assassin",
			Weapons = { "Dread", "Despair", "Hate" },
		},
		Stats = {
			Health = 1100,
			Shield = 500,
			Armor = 300,
			Affinity = 1500,
			BaseLevel = 1,
			--Multis = { "?" },
		}
	},
	["Shadow Stalker"] = {
		General = {
			Abilities = { "Rhino Charge", "Exalted Blade", "Pull" },
			CodexSecret = false,
			Description = "I am your reckoning!",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "SentientStalker.png",
			InternalName = "/Lotus/Types/Enemies/Stalker/SentientStalkerAgent",
			Introduced = "18",
			Link = "Shadow Stalker",
			Name = "Shadow Stalker",
			Scans = 3,
			Type = "Assassin",
			Weapons = { "War" },
		},
		Stats = {
			Health = 950,
			Shield = 200,
			Armor = 300,
			Affinity = 1500,
			BaseLevel = 1,
			--Multis = { "?" },
		}
	},
	Stalker = {
		General = {
			Abilities = { "Slash Dash", "Teleport", "Absorb", "Pull", "Smoke Screen", "Reckoning" },
			CodexSecret = false,
			Description = "I am your reckoning!",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "Stalker cdx.png",
			InternalName = "/Lotus/Types/Enemies/Stalker/StalkerAgent",
			Introduced = "7",
			Link = "Stalker",
			Name = "Stalker",
			Scans = 3,
			Type = "Assassin",
			Weapons = { "Dread", "Despair", "Hate" },
		},
		Stats = {
			Health = 750,
			Shield = 200,
			Armor = 300,
			Affinity = 1500,
			BaseLevel = 1,
			--Multis = { "?" },
		}
	},
	Torment = {
		General = {
			Abilities = { "Tempest Barrage", "Tidal Surge" },
			CodexSecret = false,
			Description = "Arrogant and calculating",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "ControlAcolyte.png",
			InternalName = "/Lotus/Types/Enemies/Acolytes/ControlAcolyteAgent",
			Introduced = "18.4.1",
			Link = "Torment",
			Name = "Torment",
			Scans = 3,
			Type = "Field Boss",
			Weapons = { "Akvasto" },
		},
		Stats = {
			Attacks = {
				{
					AttackName = "Shot Damage",
					DamageDistribution = {
						Impact = 0.25,
						Puncture = 0.25,
						Slash = 0.5
					},
					TotalDamage = 20,
				},
			},
			Health = 2500,
			Armor = 50,
			Shield = 1500,
			Affinity = 750,
			BaseLevel = 1,
			Multis = { "Head: 1.0x" },
		}
	},
	Violence = {
		General = {
			Abilities = { "Silence", "Ice Wave", "Slash Dash" },
			CodexSecret = false,
			Description = "Fast and vicious",
			ExcludedFromSimulacrum = true,
			Faction = "Stalker",
			Image = "DuellistAcolyte.png",
			InternalName = "/Lotus/Types/Enemies/Acolytes/DuellistAcolyteAgent",
			Introduced = "18.4.1",
			Link = "Violence",
			Name = "Violence",
			Scans = 3,
			Type = "Field Boss",
			Weapons = { "Destreza", "Venka" },
		},
		Stats = {
			Attacks = {
				{
					AttackName = "Melee Damage",
					DamageDistribution = {
						Impact = 0.025,
						Puncture = 0.85,
						Slash = 0.125
					},
					TotalDamage = 35,
				},
			},
			Health = 2500,
			Armor = 50,
			Shield = 1500,
			Affinity = 750,
			BaseLevel = 1,
			Multis = { "Head: 1.0x" },
		}
	},
}