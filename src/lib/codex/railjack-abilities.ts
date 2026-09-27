import type { PlexusModTab } from "@/lib/mods/railjack-plexus-mods";

export type PlexusAbilityCategory = "defensive" | "offensive" | "super";

export interface RailjackPlexusAbility {
  modId: string;
  name: string;
  tab: PlexusModTab;
  category: PlexusAbilityCategory;
  description: string;
  /** Battle mods consume Warframe energy (base before double-tap penalty). */
  energyCost?: number;
  /** Tactical mods use cooldowns (seconds at max rank, approximate). */
  cooldownSec?: number;
  /** Temporary turret damage bonus while active (fraction). */
  turretDamageWhileActive?: number;
  scalesWith?: ("strength" | "range" | "duration")[];
}

export const RAILJACK_PLEXUS_ABILITIES: Record<string, RailjackPlexusAbility> = {
  blackout_pulse: {
    modId: "blackout_pulse",
    name: "Blackout Pulse",
    tab: "battle",
    category: "defensive",
    description: "Electro-Magnetic Pulse that damages enemies and disables them temporarily.",
    energyCost: 50,
    scalesWith: ["strength", "range", "duration"],
  },
  countermeasures: {
    modId: "countermeasures",
    name: "Countermeasures",
    tab: "battle",
    category: "defensive",
    description: "Flares that distract enemy guided projectiles.",
    energyCost: 50,
    scalesWith: ["duration"],
  },
  munitions_vortex: {
    modId: "munitions_vortex",
    name: "Munitions Vortex",
    tab: "battle",
    category: "defensive",
    description: "Vortex that absorbs incoming fire and detonates, releasing damage.",
    energyCost: 50,
    scalesWith: ["strength", "range", "duration"],
  },
  particle_ram: {
    modId: "particle_ram",
    name: "Particle Ram",
    tab: "battle",
    category: "offensive",
    description: "Railjack Ram that deals damage to anything it touches when moving forward.",
    energyCost: 100,
    scalesWith: ["strength", "range", "duration"],
  },
  shatter_burst: {
    modId: "shatter_burst",
    name: "Shatter Burst",
    tab: "battle",
    category: "offensive",
    description: "Delivers a barrage of explosions across a large area.",
    energyCost: 100,
    scalesWith: ["strength", "range", "duration"],
  },
  tether: {
    modId: "tether",
    name: "Tether",
    tab: "battle",
    category: "offensive",
    description: "Ensnares enemies, increasing vulnerability to Railjack weaponry.",
    energyCost: 100,
    scalesWith: ["strength", "range", "duration"],
  },
  phoenix_blaze: {
    modId: "phoenix_blaze",
    name: "Phoenix Blaze",
    tab: "battle",
    category: "super",
    description: "Wreathes the Railjack in fire, increasing Turret Damage and Speed.",
    energyCost: 200,
    turretDamageWhileActive: 0.5,
    scalesWith: ["strength", "duration"],
  },
  seeker_volley: {
    modId: "seeker_volley",
    name: "Seeker Volley",
    tab: "battle",
    category: "super",
    description: "Fires a volley of homing missiles.",
    energyCost: 200,
    scalesWith: ["strength", "range"],
  },
  void_hole: {
    modId: "void_hole",
    name: "Void Hole",
    tab: "battle",
    category: "super",
    description: "A black hole that draws in enemies, dealing damage.",
    energyCost: 200,
    scalesWith: ["strength", "range", "duration"],
  },
  breach_quanta: {
    modId: "breach_quanta",
    name: "Breach Quanta",
    tab: "tactical",
    category: "defensive",
    description: "Temporarily stall Hull Breach.",
    cooldownSec: 300,
    scalesWith: ["duration"],
  },
  form_up: {
    modId: "form_up",
    name: "Form Up",
    tab: "tactical",
    category: "defensive",
    description: "Recall all Crew Members to the Railjack and heal them.",
    cooldownSec: 240,
  },
  squad_renew: {
    modId: "squad_renew",
    name: "Squad Renew",
    tab: "tactical",
    category: "defensive",
    description: "Heal all Railjack squad members.",
    cooldownSec: 300,
  },
  intruder_stasis: {
    modId: "intruder_stasis",
    name: "Intruder Stasis",
    tab: "tactical",
    category: "defensive",
    description: "Freeze all enemy boarding parties.",
    cooldownSec: 300,
    scalesWith: ["duration"],
  },
  battle_stations: {
    modId: "battle_stations",
    name: "Battle Stations",
    tab: "tactical",
    category: "offensive",
    description: "Boost Turret Damage for a duration.",
    cooldownSec: 240,
    turretDamageWhileActive: 0.75,
    scalesWith: ["duration"],
  },
  death_blossom: {
    modId: "death_blossom",
    name: "Death Blossom",
    tab: "tactical",
    category: "offensive",
    description: "Turret cooldowns removed for a duration.",
    cooldownSec: 300,
    scalesWith: ["duration"],
  },
  battle_forge: {
    modId: "battle_forge",
    name: "Battle Forge",
    tab: "tactical",
    category: "super",
    description: "Reduce Forge Cooldown.",
    cooldownSec: 480,
  },
  fire_suppression: {
    modId: "fire_suppression",
    name: "Fire Suppression",
    tab: "tactical",
    category: "super",
    description: "Extinguish one fire.",
    cooldownSec: 230,
  },
  flow_burn: {
    modId: "flow_burn",
    name: "Flow Burn",
    tab: "tactical",
    category: "super",
    description: "Increase Speed and Boost Speed for a duration.",
    cooldownSec: 240,
    scalesWith: ["duration"],
  },
  void_cloak: {
    modId: "void_cloak",
    name: "Void Cloak",
    tab: "tactical",
    category: "super",
    description: "Cloak from enemies; engine speed reduced while active.",
    cooldownSec: 120,
    scalesWith: ["duration"],
  },
};

export interface RailjackAbilitySummary {
  modId: string;
  name: string;
  tab: PlexusModTab;
  category: PlexusAbilityCategory;
  description: string;
  rank: number;
  energyCost?: number;
  cooldownSec?: number;
  turretDamageWhileActive?: number;
  scalesWith?: ("strength" | "range" | "duration")[];
}

export function summarizeEquippedAbilities(
  equipped: { modId: string; rank: number }[],
  tab: PlexusModTab,
): RailjackAbilitySummary[] {
  const summaries: RailjackAbilitySummary[] = [];
  for (const { modId, rank } of equipped) {
    const def = RAILJACK_PLEXUS_ABILITIES[modId];
    if (!def || def.tab !== tab) continue;
    summaries.push({
      modId,
      name: def.name,
      tab: def.tab,
      category: def.category,
      description: def.description,
      rank,
      energyCost: def.energyCost,
      cooldownSec: def.cooldownSec,
      turretDamageWhileActive: def.turretDamageWhileActive,
      scalesWith: def.scalesWith,
    });
  }
  return summaries;
}

/** @deprecated Use computeCrewPaperBonuses from @/data/railjack-crew */
export interface RailjackCrewBonuses {
  turretDamageBonus: number;
  speedBonus: number;
  hullBonus: number;
  repairSpeedBonus: number;
}

/**
 * @deprecated Invented scaling — use computeCrewPaperBonuses (wiki-faithful).
 * Kept only for any external imports; returns zeros.
 */
export function crewBonusesFromCompetency(_competency: {
  piloting: number;
  gunnery: number;
  repair: number;
  combat: number;
  endurance: number;
}): RailjackCrewBonuses {
  return {
    turretDamageBonus: 0,
    speedBonus: 0,
    hullBonus: 0,
    repairSpeedBonus: 0,
  };
}
