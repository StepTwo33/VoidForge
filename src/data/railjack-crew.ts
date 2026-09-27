/**
 * Railjack crew: Ticker/syndicate hires, named elites, converted adversaries.
 * @see https://wiki.warframe.com/w/Railjack/Crew
 * @see https://wiki.warframe.com/w/Railjack/Intrinsics/Command
 */

import type { ModSlot } from "@/lib/types";

export type CrewRole = "pilot" | "gunner" | "engineer" | "defender";
export type CrewSource = "ticker" | "elite" | "adversary";
export type RailjackHouseId = "lavan" | "vidar" | "zetki";

export interface CrewCompetency {
  piloting: number;
  gunnery: number;
  repair: number;
  combat: number;
  endurance: number;
}

/** Per-crew weapon loadout (boarding). */
export interface CrewWeaponLoadout {
  weaponId: string;
  mods: ModSlot[];
  slotPolarities?: Record<number, string>;
  hasOrokinCatalyst?: boolean;
  /** Adversary / Kuva-Tenet-Coda progenitor. */
  progenitorElement?: string;
  progenitorBonusPercent?: number;
}

export interface RailjackCrewSlot {
  role: CrewRole;
  source: CrewSource;
  /** ticker faction / elite / adversary profile id */
  profileId: string;
  /** ticker / elite — ranks 0–5 per competency */
  competency?: CrewCompetency;
  /**
   * Elite trait id (ticker elite hires). Named elites use fixed wiki traits via
   * `defaultTraitId` — UI should not free-pick those.
   */
  eliteTraitId?: string;
  weaponLoadout?: CrewWeaponLoadout;
}

export type EliteTraitCompetency =
  | "piloting"
  | "gunnery"
  | "repair"
  | "combat"
  | "endurance";

export type EliteTraitPaperEffect =
  | "house_engine_speed"
  | "house_turret_damage"
  | "panel_only";

export interface RailjackEliteTrait {
  id: string;
  competency: EliteTraitCompetency;
  text: string;
  effect: EliteTraitPaperEffect;
  /** Fraction applied when effect is paper (e.g. 0.25, 0.5). */
  value?: number;
  /** When set, paper bonus applies only to this house. */
  house?: RailjackHouseId;
}

/** Legacy combined ids → first house variant (migration). */
const ELITE_TRAIT_ID_ALIASES: Record<string, string> = {
  elite_piloting_engine_speed: "elite_piloting_vidar_engines",
  elite_gunnery_turret_damage: "elite_gunnery_vidar_turrets",
};

/** Random ticker-elite traits keyed by highest competency (per-house paper). */
export const RAILJACK_ELITE_TRAITS: RailjackEliteTrait[] = [
  {
    id: "elite_piloting_lavan_engines",
    competency: "piloting",
    text: "+25% speed for Lavan engines",
    effect: "house_engine_speed",
    value: 0.25,
    house: "lavan",
  },
  {
    id: "elite_piloting_vidar_engines",
    competency: "piloting",
    text: "+25% speed for Vidar engines",
    effect: "house_engine_speed",
    value: 0.25,
    house: "vidar",
  },
  {
    id: "elite_piloting_zetki_engines",
    competency: "piloting",
    text: "+25% speed for Zetki engines",
    effect: "house_engine_speed",
    value: 0.25,
    house: "zetki",
  },
  {
    id: "elite_gunnery_lavan_turrets",
    competency: "gunnery",
    text: "+50% damage for Lavan turrets",
    effect: "house_turret_damage",
    value: 0.5,
    house: "lavan",
  },
  {
    id: "elite_gunnery_vidar_turrets",
    competency: "gunnery",
    text: "+50% damage for Vidar turrets",
    effect: "house_turret_damage",
    value: 0.5,
    house: "vidar",
  },
  {
    id: "elite_gunnery_zetki_turrets",
    competency: "gunnery",
    text: "+50% damage for Zetki turrets",
    effect: "house_turret_damage",
    value: 0.5,
    house: "zetki",
  },
  {
    id: "elite_repair_move_speed",
    competency: "repair",
    text: "Gain 50% Movement Speed for 10s after repairing",
    effect: "panel_only",
  },
  {
    id: "elite_repair_heal_allies",
    competency: "repair",
    text: "Heal all teammates for 1000 Health when this crew member drops below 30% Health (5 min CD)",
    effect: "panel_only",
  },
  {
    id: "elite_combat_crit_damage",
    competency: "combat",
    text: "+300% Critical Damage while Health is below 50%",
    effect: "panel_only",
  },
  {
    id: "elite_combat_crit_chance",
    competency: "combat",
    text: "+150% Critical Chance bonus with Rifles/Pistols",
    effect: "panel_only",
  },
  {
    id: "elite_combat_crit_chance_rifles",
    competency: "combat",
    text: "+150% Critical Chance with Rifles",
    effect: "panel_only",
  },
  {
    id: "elite_endurance_protective_shield",
    competency: "endurance",
    text: "Activates a protective shield when taking near lethal damage (60s CD)",
    effect: "panel_only",
  },
  {
    id: "elite_endurance_kill_heal",
    competency: "endurance",
    text: "Killing an enemy heals all nearby allies by 500 over 10s",
    effect: "panel_only",
  },
];

export function resolveEliteTraitId(id: string | undefined | null): string | undefined {
  if (!id) return undefined;
  return ELITE_TRAIT_ID_ALIASES[id] ?? id;
}

export function findEliteTrait(id: string): RailjackEliteTrait | undefined {
  const resolved = resolveEliteTraitId(id);
  if (!resolved) return undefined;
  return RAILJACK_ELITE_TRAITS.find((t) => t.id === resolved);
}

export function eliteTraitsForCompetency(
  competency: EliteTraitCompetency,
): RailjackEliteTrait[] {
  return RAILJACK_ELITE_TRAITS.filter((t) => t.competency === competency);
}

export function highestCompetencyKey(
  competency: CrewCompetency,
): EliteTraitCompetency {
  const entries: [EliteTraitCompetency, number][] = [
    ["piloting", competency.piloting],
    ["gunnery", competency.gunnery],
    ["repair", competency.repair],
    ["combat", competency.combat],
    ["endurance", competency.endurance],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]![0];
}

/** Wiki Piloting competency → max Railjack speed when crewmate is piloting. */
export const PILOTING_SPEED_BONUS = [0, 0.05, 0.1, 0.15, 0.2, 0.25] as const;

/** Wiki Gunnery heat accretion reduction (panel). */
export const GUNNERY_HEAT_REDUCTION = [0, 0.1, 0.2, 0.3, 0.4, 0.5] as const;

/** Wiki Gunnery accuracy bonus (panel). */
export const GUNNERY_ACCURACY_BONUS = [0, 0.15, 0.3, 0.45, 0.6, 0.75] as const;

/** Wiki Repair efficiency (panel). */
export const REPAIR_EFFICIENCY = [0, 0.1, 0.2, 0.3, 0.4, 0.5] as const;

/** Wiki Combat damage vs raiders (panel). */
export const COMBAT_DAMAGE_BONUS = [0, 0.4, 0.8, 1.2, 1.6, 2.0] as const;

/** Wiki Endurance flat Health / Shields (panel). */
export const ENDURANCE_HEALTH = [0, 300, 600, 900, 1200, 1500] as const;
export const ENDURANCE_SHIELDS = [0, 100, 200, 300, 400, 500] as const;

export function clampCompetencyRank(rank: number): number {
  return Math.max(0, Math.min(5, Math.floor(rank)));
}

export function emptyCompetency(): CrewCompetency {
  return { piloting: 0, gunnery: 0, repair: 0, combat: 0, endurance: 0 };
}

export function competencyTotal(c: CrewCompetency): number {
  return c.piloting + c.gunnery + c.repair + c.combat + c.endurance;
}

/** Command ranks 2/4/6 each grant +1 assignable competency point. */
export function commandCompetencyBonusPoints(commandRank: number): number {
  let n = 0;
  if (commandRank >= 2) n += 1;
  if (commandRank >= 4) n += 1;
  if (commandRank >= 6) n += 1;
  return n;
}

/** Mission crew slots unlock at Command 1 / 3 / 5. */
export function crewSlotUnlocked(slotIndex: number, commandRank: number): boolean {
  if (slotIndex === 0) return commandRank >= 1;
  if (slotIndex === 1) return commandRank >= 3;
  if (slotIndex === 2) return commandRank >= 5;
  return false;
}

export function unusualCrewUnlocked(commandRank: number): boolean {
  return commandRank >= 8;
}

export function eliteCrewUnlocked(commandRank: number): boolean {
  return commandRank >= 10;
}

export interface TickerCrewTemplate {
  id: string;
  name: string;
  syndicate: string;
  description: string;
  /** Base competency points before Command gains (credits=8, resources=10). */
  basePoints: 8 | 10;
  /** Suggested starting distribution (sums to basePoints). */
  defaultCompetency: CrewCompetency;
}

/** Syndicate operative templates from Ticker (Fortuna). */
export const tickerCrewTemplates: TickerCrewTemplate[] = [
  {
    id: "steel_meridian",
    name: "Steel Meridian Operative",
    syndicate: "Steel Meridian",
    description: "Grineer defector — typically strong Combat / Endurance.",
    basePoints: 10,
    defaultCompetency: { piloting: 1, gunnery: 2, repair: 1, combat: 3, endurance: 3 },
  },
  {
    id: "arbiters_of_hexis",
    name: "Arbiters of Hexis Operative",
    syndicate: "Arbiters of Hexis",
    description: "Disciplined operative — balanced competencies.",
    basePoints: 10,
    defaultCompetency: { piloting: 2, gunnery: 2, repair: 2, combat: 2, endurance: 2 },
  },
  {
    id: "cephalon_suda",
    name: "Cephalon Suda Operative",
    syndicate: "Cephalon Suda",
    description: "Research-minded hire — strong Repair / Piloting.",
    basePoints: 10,
    defaultCompetency: { piloting: 3, gunnery: 1, repair: 3, combat: 1, endurance: 2 },
  },
  {
    id: "the_perrin_sequence",
    name: "The Perrin Sequence Operative",
    syndicate: "The Perrin Sequence",
    description: "Corpus-aligned operative — Gunnery / Piloting focus.",
    basePoints: 10,
    defaultCompetency: { piloting: 3, gunnery: 3, repair: 1, combat: 1, endurance: 2 },
  },
  {
    id: "red_veil",
    name: "Red Veil Operative",
    syndicate: "Red Veil",
    description: "Zealous fighter — Combat / Gunnery focus.",
    basePoints: 10,
    defaultCompetency: { piloting: 1, gunnery: 3, repair: 1, combat: 3, endurance: 2 },
  },
  {
    id: "new_loka",
    name: "New Loka Operative",
    syndicate: "New Loka",
    description: "Purist operative — Endurance / Repair focus.",
    basePoints: 10,
    defaultCompetency: { piloting: 1, gunnery: 1, repair: 3, combat: 2, endurance: 3 },
  },
  {
    id: "credits_hire",
    name: "Credits Hire (8 pts)",
    syndicate: "Any",
    description: "Ticker hire paid in credits — 8 competency points.",
    basePoints: 8,
    defaultCompetency: { piloting: 2, gunnery: 2, repair: 1, combat: 2, endurance: 1 },
  },
];

export function findTickerTemplate(id: string): TickerCrewTemplate | undefined {
  return tickerCrewTemplates.find((t) => t.id === id);
}

export interface NamedEliteCrew {
  id: string;
  name: string;
  description: string;
  competency: CrewCompetency;
  vendorCost: "crimson" | "emerald" | "both";
  requiresCommandRank: number;
  /** Suggested elite trait id. */
  defaultTraitId: string;
}

/** Wiki Unique Elite Crew — fixed traits (not free-picked). */
export const namedEliteCrew: NamedEliteCrew[] = [
  {
    id: "vena",
    name: "Vena",
    description: "Garuda Protoframe — queen of gore.",
    competency: { piloting: 0, gunnery: 2, repair: 0, combat: 5, endurance: 5 },
    vendorCost: "both",
    requiresCommandRank: 10,
    defaultTraitId: "elite_endurance_kill_heal",
  },
  {
    id: "ryoku",
    name: "Ryoku",
    description: "Ash Protoframe — Scoria's deadliest assassin.",
    competency: { piloting: 0, gunnery: 2, repair: 2, combat: 5, endurance: 3 },
    vendorCost: "both",
    requiresCommandRank: 10,
    defaultTraitId: "elite_combat_crit_damage",
  },
  {
    id: "latrox_une",
    name: "Latrox Une",
    description: "Corpus researcher and Deimos ally.",
    competency: { piloting: 0, gunnery: 0, repair: 5, combat: 3, endurance: 4 },
    vendorCost: "both",
    requiresCommandRank: 10,
    defaultTraitId: "elite_endurance_protective_shield",
  },
  {
    id: "jarka_lar",
    name: "Jarka Lar",
    description: "Freed from the Grineer Queens.",
    competency: { piloting: 0, gunnery: 2, repair: 0, combat: 5, endurance: 5 },
    vendorCost: "both",
    requiresCommandRank: 10,
    defaultTraitId: "elite_combat_crit_chance_rifles",
  },
];

export function findNamedEliteCrew(id: string): NamedEliteCrew | undefined {
  return namedEliteCrew.find((c) => c.id === id);
}

/** Named elites have a locked wiki trait — do not offer a free picker. */
export function namedEliteFixedTraitId(profileId: string): string | undefined {
  return findNamedEliteCrew(profileId)?.defaultTraitId;
}

export function resolveSlotEliteTraitId(slot: RailjackCrewSlot): string | undefined {
  if (slot.source === "elite") {
    return namedEliteFixedTraitId(slot.profileId) ?? resolveEliteTraitId(slot.eliteTraitId);
  }
  return resolveEliteTraitId(slot.eliteTraitId);
}

export interface AdversaryCrewProfile {
  id: string;
  name: string;
  description: string;
  /** Mid-range wiki-ish display stats (no competency). */
  health: number;
  shields: number;
  requiresCommandRank: number;
}

/** Converted adversaries — Defender only, Command 8+. */
export const adversaryCrewProfiles: AdversaryCrewProfile[] = [
  {
    id: "kuva_lich",
    name: "Kuva Lich",
    description: "Converted Kuva Lich — Defender only; no competencies or systems operation.",
    health: 4500,
    shields: 1200,
    requiresCommandRank: 8,
  },
  {
    id: "sister_of_parvos",
    name: "Sister of Parvos",
    description: "Converted Sister — Defender only; can revive downed crew and players.",
    health: 4200,
    shields: 1400,
    requiresCommandRank: 8,
  },
  {
    id: "technocyte_coda",
    name: "Technocyte Coda",
    description: "Converted Technocyte Coda — Defender only; no competencies.",
    health: 4800,
    shields: 1000,
    requiresCommandRank: 8,
  },
];

export function findAdversaryCrew(id: string): AdversaryCrewProfile | undefined {
  return adversaryCrewProfiles.find((a) => a.id === id);
}

export const CREW_ROLE_LABELS: Record<CrewRole, string> = {
  pilot: "Pilot",
  gunner: "Gunner",
  engineer: "Engineer",
  defender: "Defender",
};

export const CREW_SLOT_LABELS = ["A", "B", "C"] as const;

export const DEFAULT_CREW_ROLES: CrewRole[] = ["pilot", "gunner", "engineer"];

/** Wiki-faithful paper bonuses from assigned crew. */
export interface RailjackCrewPaperBonuses {
  /** From Pilot role piloting competency. */
  speedBonus: number;
  /** Elite piloting trait bonus by house (fraction). */
  houseEngineSpeedByHouse: Partial<Record<RailjackHouseId, number>>;
  /** Elite gunnery trait bonus by house (fraction). */
  houseTurretDamageByHouse: Partial<Record<RailjackHouseId, number>>;
  /**
   * @deprecated Max across houses — prefer house-specific maps.
   * Kept so older UI bindings keep compiling.
   */
  houseEngineSpeedBonus: number;
  /** @deprecated Max across houses. */
  houseTurretDamageBonus: number;
  /** Panel-only competency summaries for UI. */
  panelNotes: string[];
}

export function componentHouseFromId(id: string | undefined): RailjackHouseId | "sigma" | undefined {
  if (!id) return undefined;
  if (id.includes("lavan")) return "lavan";
  if (id.includes("vidar")) return "vidar";
  if (id.includes("zetki")) return "zetki";
  if (id.includes("sigma")) return "sigma";
  return undefined;
}

export function resolveCrewCompetency(slot: RailjackCrewSlot): CrewCompetency | undefined {
  if (slot.source === "adversary") return undefined;
  if (slot.competency) return slot.competency;
  if (slot.source === "elite") {
    return findNamedEliteCrew(slot.profileId)?.competency;
  }
  if (slot.source === "ticker") {
    return findTickerTemplate(slot.profileId)?.defaultCompetency;
  }
  return undefined;
}

export function computeCrewPaperBonuses(
  slots: (RailjackCrewSlot | null | undefined)[] | undefined,
): RailjackCrewPaperBonuses {
  const result: RailjackCrewPaperBonuses = {
    speedBonus: 0,
    houseEngineSpeedByHouse: {},
    houseTurretDamageByHouse: {},
    houseEngineSpeedBonus: 0,
    houseTurretDamageBonus: 0,
    panelNotes: [],
  };
  if (!slots?.length) return result;

  for (const slot of slots) {
    if (!slot) continue;

    if (slot.source === "adversary") {
      const adv = findAdversaryCrew(slot.profileId);
      if (adv) {
        result.panelNotes.push(
          `${adv.name} (Defender): ~${adv.health} HP / ${adv.shields} Shields — no competencies`,
        );
      }
      continue;
    }

    const competency = resolveCrewCompetency(slot);
    if (!competency) continue;

    if (slot.role === "pilot") {
      const rank = clampCompetencyRank(competency.piloting);
      result.speedBonus = Math.max(result.speedBonus, PILOTING_SPEED_BONUS[rank] ?? 0);
    }

    if (slot.role === "gunner") {
      const rank = clampCompetencyRank(competency.gunnery);
      result.panelNotes.push(
        `Gunner: −${((GUNNERY_HEAT_REDUCTION[rank] ?? 0) * 100).toFixed(0)}% heat, +${((GUNNERY_ACCURACY_BONUS[rank] ?? 0) * 100).toFixed(0)}% accuracy (swivels)`,
      );
    }

    if (slot.role === "engineer") {
      const rank = clampCompetencyRank(competency.repair);
      result.panelNotes.push(
        `Engineer: +${((REPAIR_EFFICIENCY[rank] ?? 0) * 100).toFixed(0)}% repair efficiency`,
      );
    }

    if (slot.role === "defender") {
      const combat = clampCompetencyRank(competency.combat);
      const end = clampCompetencyRank(competency.endurance);
      result.panelNotes.push(
        `Defender: +${((COMBAT_DAMAGE_BONUS[combat] ?? 0) * 100).toFixed(0)}% boarding damage; +${ENDURANCE_HEALTH[end]} HP / +${ENDURANCE_SHIELDS[end]} Shields`,
      );
    }

    const traitId = resolveSlotEliteTraitId(slot);
    if (traitId) {
      const trait = findEliteTrait(traitId);
      if (trait?.effect === "house_engine_speed" && trait.house) {
        const prev = result.houseEngineSpeedByHouse[trait.house] ?? 0;
        result.houseEngineSpeedByHouse[trait.house] = Math.max(prev, trait.value ?? 0);
        result.panelNotes.push(`Elite trait: ${trait.text}`);
      } else if (trait?.effect === "house_turret_damage" && trait.house) {
        const prev = result.houseTurretDamageByHouse[trait.house] ?? 0;
        result.houseTurretDamageByHouse[trait.house] = Math.max(prev, trait.value ?? 0);
        result.panelNotes.push(`Elite trait: ${trait.text}`);
      } else if (trait) {
        result.panelNotes.push(`Elite trait: ${trait.text}`);
      }
    }
  }

  result.houseEngineSpeedBonus = Math.max(
    0,
    ...Object.values(result.houseEngineSpeedByHouse),
  );
  result.houseTurretDamageBonus = Math.max(
    0,
    ...Object.values(result.houseTurretDamageByHouse),
  );

  return result;
}

/** Migrate legacy single eliteCrewId → slot A. */
export function migrateEliteCrewIdToSlots(
  eliteCrewId: string | undefined | null,
): (RailjackCrewSlot | null)[] {
  const slots: (RailjackCrewSlot | null)[] = [null, null, null];
  if (!eliteCrewId) return slots;
  const elite = findNamedEliteCrew(eliteCrewId);
  if (!elite) return slots;
  slots[0] = {
    role: elite.competency.gunnery >= elite.competency.combat ? "gunner" : "defender",
    source: "elite",
    profileId: elite.id,
    competency: { ...elite.competency },
    eliteTraitId: elite.defaultTraitId,
  };
  return slots;
}

function cloneWeaponLoadout(loadout: CrewWeaponLoadout | undefined): CrewWeaponLoadout | undefined {
  if (!loadout?.weaponId) return undefined;
  return {
    weaponId: loadout.weaponId,
    mods: (loadout.mods ?? []).map((m) => ({ ...m })),
    slotPolarities: loadout.slotPolarities ? { ...loadout.slotPolarities } : undefined,
    hasOrokinCatalyst: loadout.hasOrokinCatalyst,
    progenitorElement: loadout.progenitorElement,
    progenitorBonusPercent: loadout.progenitorBonusPercent,
  };
}

export function normalizeCrewSlots(
  slots: (RailjackCrewSlot | null | undefined)[] | undefined,
  eliteCrewId?: string | null,
): (RailjackCrewSlot | null)[] {
  if (slots?.length) {
    const out: (RailjackCrewSlot | null)[] = [null, null, null];
    for (let i = 0; i < 3; i++) {
      const s = slots[i];
      if (!s) continue;
      const eliteTraitId =
        s.source === "elite"
          ? namedEliteFixedTraitId(s.profileId) ?? resolveEliteTraitId(s.eliteTraitId)
          : resolveEliteTraitId(s.eliteTraitId);
      const normalized: RailjackCrewSlot = {
        role: s.source === "adversary" ? "defender" : s.role,
        source: s.source,
        profileId: s.profileId,
        competency: s.competency ? { ...s.competency } : undefined,
        eliteTraitId,
        weaponLoadout: cloneWeaponLoadout(s.weaponLoadout),
      };
      out[i] = normalized;
    }
    return out;
  }
  return migrateEliteCrewIdToSlots(eliteCrewId);
}
