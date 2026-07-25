import { STANCE_WEAPON_TYPE } from "@/data/stances";
import {
  STANCE_COMBO_DAMAGE_MULTIPLIER,
  type StanceComboDirectionKey,
} from "@/lib/calc/stance-combo-multipliers";
import { STANCE_COMBO_CYCLE_MULTIPLIER } from "@/lib/calc/stance-combo-cycle-multipliers";

/**
 * Shared combat multipliers: faction (Bane), headshots, stance averages, status damage.
 * Used by weapon DPS and TTK so both stay in sync.
 */

/** Stance combo string direction for paper DPS (Neutral = B1 lock). */
export type StanceComboDirection = "neutral" | StanceComboDirectionKey;

/** Hit-avg (B1/C6 default) vs wiki Avg Dmg Multi/s cycle (C6b). */
export type StanceDpsModel = "hitAvg" | "cycle";

/** Map mod stat keys → normalized faction ids used by ENEMY_TYPES / sim UI. */
export const FACTION_STAT_TO_ID: Record<string, string> = {
  factionGrineer: "grineer",
  factionCorpus: "corpus",
  factionInfested: "infested",
  factionOrokin: "orokin",
  factionCorrupted: "orokin", // Bane of Orokin covers Corrupted
  factionMurmur: "murmur",
  factionSentient: "sentient",
  factionNarmer: "narmer",
};

/** EnemyType.faction string → normalized id. */
export function normalizeFactionName(faction: string | undefined | null): string {
  if (!faction) return "";
  const f = faction.toLowerCase().trim();
  if (f === "corrupted" || f === "orokin") return "orokin";
  if (f === "stalker") return "stalker";
  if (f.includes("murmur") || f.includes("the murmur")) return "murmur";
  if (f.includes("grineer")) return "grineer";
  if (f.includes("corpus")) return "corpus";
  if (f.includes("infest")) return "infested";
  if (f.includes("sentient")) return "sentient";
  if (f.includes("narmer")) return "narmer";
  return f;
}

export function factionBonusFromStats(
  factionBonuses: Record<string, number> | undefined,
  targetFaction: string | undefined | null,
): number {
  if (!factionBonuses || !targetFaction) return 0;
  const id = normalizeFactionName(targetFaction);
  if (!id) return 0;
  // Prefer exact key; also accept raw enemy faction labels
  return factionBonuses[id] ?? factionBonuses[targetFaction] ?? 0;
}

/**
 * Direct hit faction mult: (1 + bane%).
 * DoT ticks get this squared in-game.
 */
export function factionHitMultiplier(factionBonus: number): number {
  return 1 + Math.max(0, factionBonus);
}

export function factionDotMultiplier(factionBonus: number): number {
  const m = factionHitMultiplier(factionBonus);
  return m * m;
}

/** Toxic Lash Extra Hit Toxin DoT: faction applies a third time → (1+bane)³. */
export function factionTripleDotMultiplier(factionBonus: number): number {
  const m = factionHitMultiplier(factionBonus);
  return m * m * m;
}

/**
 * Headshot / weak-point multiplier.
 * Base head multi is typically 2×; weak-point / Acuity bonuses add to that.
 */
export function headshotMultiplier(
  applyHeadshots: boolean | undefined,
  headshotDamageBonus = 0,
  baseHeadMulti = 2,
): number {
  if (!applyHeadshots) return 1;
  return baseHeadMulti * (1 + Math.max(0, headshotDamageBonus));
}

/**
 * Approximate average stance damage multiplier (combo string average, first target).
 * Real stances vary ~1.2–2.5×. Prefer per-stance entries; else type average; else default.
 * Values are Tier B best-effort (not full combo-string simulation).
 */
export const STANCE_AVG_DAMAGE_MULTIPLIER: Record<string, number> = {
  // Heavy blade — wiki Neutral Crowd Fall hit avg ~3.3× (533.3%/s)
  stance_cleaving_whirlwind: 3.3,
  // Heavy blade — wiki Tempo Royale Neutral August Mesto hit avg ~2.3× (408.6%/s)
  stance_temporal_royale: 2.3,
  // Heavy blade — wiki Neutral Skull Splitter hit avg ~2.8× (486.5%/s)
  rending_crane: 2.8,
  // Conclave-only heavy blade — Neutral Avg Dmg Multi/s N/A
  noble_cadence: 1,
  // Sword
  // Sword — wiki Neutral Wings and Beak hit avg ~2.3× (518.5%/s)
  stance_iron_phoenix: 2.3,
  // Sword — wiki Neutral Twisting Flurry hit avg 2.8× (700%/s)
  stance_crimson_dervish: 2.8,
  // Sword — wiki Neutral Impending Dread hit avg 2.8× (444.4%/s)
  stance_vengeful_revenant: 2.8,
  // Sword — wiki Neutral Diving Kestrel hit avg 2.4× (600%/s)
  stance_swooping_falcon: 2.4,
  // Conclave-only — Neutral Avg Dmg Multi/s N/A (like Archon Contempt)
  rising_steel: 1,
  argent_scourge: 1,
  biting_piranha: 1,
  lashing_coil: 1,
  last_herald: 1,
  piercing_fury: 1,
  tainted_hydra: 1,
  quaking_hand: 1,
  scarlet_hurricane: 1,
  cunning_aspect: 1,
  dividing_blades: 1,
  rending_wind: 1,
  shadow_harvest: 1,
  crashing_timber: 1,
  star_divide: 1,
  vicious_approach: 1,
  mafic_rain: 1,
  // Nikana
  // Nikana — wiki Neutral Swift Retribution hit avg 2.8× (528.3%/s)
  stance_decisive_judgement: 2.8,
  // Nikana — wiki Neutral Guiding Light hit avg ~2.4× (730.8%/s)
  blind_justice: 2.4,
  // Conclave-only Nikana — Neutral Avg Dmg Multi/s N/A
  fateful_truth: 1,
  // Nikana — wiki Neutral Breathless Lunge hit avg ~2.2× (342.1%/s)
  tranquil_cleave: 2.2,
  // Dual swords
  // Dual swords — wiki Neutral East to West hit avg 1.8× (666.7%/s)
  stance_crossing_snakes: 1.8,
  // Dual swords — wiki Neutral Winding Claws hit avg ~1.4× (536.6%/s)
  stance_swirling_tiger: 1.4,
  // Dual swords — wiki Neutral Rapid Incisions hit avg ~2.4× (487.2%/s)
  stance_carving_mantis: 2.4,
  // Polearm
  // Polearm — wiki Neutral Slashing Wind hit avg 1.25× (526.3%/s)
  stance_shimmering_blight: 1.3,
  // Polearm — wiki Neutral Lethal Gust hit avg 1.25× (526.3%/s)
  stance_bleeding_willow: 1.3,
  // Polearm — wiki Neutral Cresting Peak hit avg 2.8× (424.2%/s)
  stance_twirling_spire: 2.8,
  // Archon Contempt set mods occupy the stance slot but use stanceless combos
  amars_contempt: 1,
  boreals_contempt: 1,
  niras_contempt: 1,
  // Glaive — wiki Neutral Mercury Vortex hit avg ~2.6× (488.4%/s)
  gleaming_talon: 2.6,
  // Glaive — wiki Astral Twilight Neutral Morning Sun hit avg ~2.2× (517.6%/s)
  stance_aurora_rush: 2.2,
  // Conclave-only glaive — Neutral Avg Dmg Multi/s N/A
  celestial_nightfall: 1,
  // Scythe / staff / hammer (common)
  // Scythe — wiki Neutral Eternal Nocturne hit avg 3.2× (551.7%/s)
  stance_reaping_spiral: 3.2,
  // Scythe — wiki Neutral Shadow Wing hit avg 3.0× (306.1%/s)
  stance_stalking_fan: 3.0,
  // Staff — wiki Neutral Resolute Flurry hit avg ~1.7× (692.3%/s)
  stance_clashing_forest: 1.7,
  // Staff — wiki Neutral Rising Falls hit avg 3.0× (383%/s)
  stance_flailing_branch: 3.0,
  // Conclave-only hammer — Neutral Avg Dmg Multi/s N/A
  crashing_havoc: 1,
  // Hammer — wiki Neutral Raging Whirlwind hit avg 3.0× (466.7%/s)
  crushing_ruin: 3.0,
  // Hammer — wiki Neutral Falling Rock hit avg 3.5× excl. true-slam radials (428.6%/s)
  shattering_storm: 3.5,
  // Dagger — wiki Neutral Parting Edge hit avg 2.4× (774.2%/s)
  stance_pointed_wind: 2.4,
  // Dagger — wiki Neutral Cutting Arches hit avg ~2.4× (607.1%/s)
  stance_homing_fang: 2.4,
  // Dagger — wiki Neutral Carving Spike hit avg ~2.2× (557%/s)
  stance_stinging_thorn: 2.2,
  // Tonfa — wiki Neutral Vagrant Blight hit avg ~1.2× (467.4%/s; many 50% hits)
  gemini_cross: 1.2,
  // Tonfa — wiki Neutral Rogue Edict hit avg ~1.5× (771.9%/s; many 50% hits)
  sovereign_outcast: 1.5,
  // Fist — wiki Neutral River's Grief hit avg 3.0× (493.2%/s)
  gaias_tragedy: 3.0,
  // Fist — wiki Neutral Quaking Touch hit avg 2.6× (774.2%/s)
  stance_seismic_palm: 2.6,
  // Fist — wiki Neutral Rolling Gale hit avg 3.0× (580.6%/s)
  fracturing_wind: 3.0,
  // Claw — wiki Neutral Jagged Gash hit avg ~1.7× (567.2%/s)
  malicious_raptor: 1.7,
  // Claw — wiki Neutral Aggravated Swarm hit avg 2.6× (565.2%/s)
  four_riders: 2.6,
  // Claw — wiki Neutral Flurry Rose hit avg ~2.2× (658.2%/s)
  stance_vermillion_storm: 2.2,
  // Gunblade — wiki Neutral Final Showdown hit avg ~1.6× (338.5%/s; slam radials in string)
  stance_high_noon: 1.6,
  // Gunblade — wiki Neutral Automatic Rhumba hit avg ~1.7× (333.3%/s; slam radials in string)
  stance_bullet_dance: 1.7,
  // Sparring — wiki Neutral Inferno hit avg ~1.8× (651.2%/s)
  brutal_tide: 1.8,
  // Sparring — wiki Neutral Fanning Flame hit avg 2.6× (684.2%/s)
  stance_grim_fury_sparring: 2.6,
  // Warfan — wiki Neutral Scathing Plume hit avg ~2.4× (527.8%/s)
  slicing_feathers: 2.4,
  // Warfan — wiki Neutral Purging Drive hit avg 2.0× (778.2%/s)
  votive_onslaught: 2.0,
  // Blade-whip — wiki Neutral Claws of the Drake hit avg 2.3× (541.2%/s)
  stance_defiled_snapdragon: 2.3,
  // Two-handed Nikana — wiki Neutral Threshing Grain hit avg ~2.8× (386.4%/s)
  stance_wise_razor: 2.8,
  // Dual Nikana — wiki Neutral Rise and Fall hit avg 3.0× (750%/s)
  mountains_edge: 3.0,
  // Heavy scythe — wiki Neutral Stormreaper hit avg 3.0× (294.1%/s)
  galeforce_dawn: 3.0,
  // Sword & shield — wiki Neutral Striking Thunder hit avg ~2.7× (542.9%/s)
  eleventh_storm: 2.7,
  // Sword & board — wiki Neutral Null Warning hit avg ~1.9× (688.5%/s)
  final_harbinger: 1.9,
  // Whip — wiki Neutral Whistling Wind hit avg 2.0× (370.4%/s)
  stance_coiling_viper: 2.0,
  // Whip — wiki Neutral Sparking Torture hit avg 3.0× (315.8%/s)
  stance_burning_wasp: 3.0,
  // Dual daggers — wiki Neutral True Kiss hit avg ~2.8× (594.6%/s)
  stance_spinning_needle: 2.8,
  // Dual daggers — wiki Neutral Pincer Strike hit avg 2.8× (560%/s)
  stance_gnashing_payara: 2.8,
  // Dual daggers — wiki Neutral Lashing Panther hit avg 1.0× (347.8%/s)
  stance_sinking_talon: 1.0,
  // Nunchaku — wiki Neutral Molten Whirlpool hit avg ~0.7× (304.3%/s; many 50% hits)
  atlantis_vulcan: 0.7,
  // Blade and saw — wiki Neutral Rictus' Wrath hit avg ~2.8× (223.1%/s)
  butchers_revelry: 2.8,
  // Rapier — wiki Neutral Assailant Guise hit avg ~2.3× (533.3%/s)
  stance_vulpine_mask: 2.3,
  // Machete — wiki Neutral Rapid Current hit avg 3.0× (529.4%/s)
  stance_sundering_weave: 3.0,
  // Machete — wiki Neutral Gale Triton hit avg ~2.43× (414.6%/s @1.0 AS)
  cyclone_kraken: 2.4,
};

/** Fallback when a stance id is known by type but has no per-stance entry yet. */
export const STANCE_TYPE_AVG_MULTIPLIER: Record<string, number> = {
  sword: 1.6,
  sword_shield: 1.55,
  dual_swords: 1.6,
  dual_nikana: 1.65,
  heavy_blade: 1.85,
  heavy_scythe: 1.75,
  polearm: 1.7,
  whip: 1.55,
  fist: 1.6,
  claw: 1.65,
  nikana: 1.7,
  two_handed_nikana: 1.75,
  rapier: 1.55,
  gunblade: 1.5,
  glaive: 1.55,
  dagger: 1.5,
  dual_daggers: 1.55,
  machete: 1.6,
  scythe: 1.7,
  staff: 1.6,
  tonfa: 1.6,
  sparring: 1.55,
  warfan: 1.55,
  blade_whip: 1.6,
  hammer: 1.75,
  nunchaku: 1.55,
  bladesaw: 1.7,
};

export const DEFAULT_STANCE_AVG_MULTIPLIER = 1.55;

export function resolveStanceDamageMultiplier(
  equippedMods: { modId: string }[],
  direction: StanceComboDirection = "neutral",
  model: StanceDpsModel = "hitAvg",
): number {
  for (const slot of equippedMods) {
    const type = STANCE_WEAPON_TYPE[slot.modId];
    if (!type) continue;
    if (model === "cycle") {
      const cycle = STANCE_COMBO_CYCLE_MULTIPLIER[slot.modId]?.[direction];
      if (cycle != null && cycle > 0) return cycle;
    }
    if (direction !== "neutral") {
      const combo = STANCE_COMBO_DAMAGE_MULTIPLIER[slot.modId]?.[direction];
      if (combo != null && combo > 0) return combo;
    }
    return (
      STANCE_AVG_DAMAGE_MULTIPLIER[slot.modId] ??
      STANCE_TYPE_AVG_MULTIPLIER[type] ??
      DEFAULT_STANCE_AVG_MULTIPLIER
    );
  }
  return 1;
}

/** Combined non-crit, non-MS damage mult for paper DPS. */
export function combatDamageMultiplier(opts: {
  factionBonus?: number;
  applyHeadshots?: boolean;
  headshotDamageBonus?: number;
  stanceMultiplier?: number;
}): number {
  const faction = factionHitMultiplier(opts.factionBonus ?? 0);
  const head = headshotMultiplier(opts.applyHeadshots, opts.headshotDamageBonus ?? 0);
  const stance = opts.stanceMultiplier && opts.stanceMultiplier > 0 ? opts.stanceMultiplier : 1;
  return faction * head * stance;
}
