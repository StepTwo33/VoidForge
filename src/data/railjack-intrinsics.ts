/**
 * Railjack Intrinsics (wiki rank 0–10 per tree).
 * Dirac / Avionics Grid were removed in Update 29.10 (→ Endo + Plexus Forma).
 */

export type RailjackIntrinsicTree =
  | "tactical"
  | "piloting"
  | "gunnery"
  | "engineering"
  | "command";

export interface RailjackIntrinsics {
  tactical: number;
  piloting: number;
  gunnery: number;
  engineering: number;
  command: number;
}

export const DEFAULT_RAILJACK_INTRINSICS: RailjackIntrinsics = {
  tactical: 0,
  piloting: 0,
  gunnery: 0,
  engineering: 0,
  command: 0,
};

export const MAX_INTRINSIC_RANK = 10;

export const RAILJACK_INTRINSIC_TREES: {
  id: RailjackIntrinsicTree;
  name: string;
  /** Short wiki blurb for the tree. */
  blurb: string;
}[] = [
  { id: "tactical", name: "Tactical", blurb: "Tactical Menu, Battle energy, Tactical cooldowns" },
  { id: "piloting", name: "Piloting", blurb: "Boost, Vector, Drift, Blink (mostly handling)" },
  { id: "gunnery", name: "Gunnery", blurb: "Swivel turret damage, heat, Slingshot" },
  { id: "engineering", name: "Engineering", blurb: "Omni repair, Forge, Dome Charges" },
  { id: "command", name: "Command", blurb: "Crew slots, competency, elite crew" },
];

/** Compact wiki rank labels for UI (rank → name). */
export const RAILJACK_INTRINSIC_RANK_NAMES: Record<RailjackIntrinsicTree, string[]> = {
  tactical: [
    "—",
    "Tactical System",
    "Ability Kinesis",
    "Command Link",
    "Recall Warp",
    "Deploy Necramechs",
    "Tactical Efficiency (−25% Battle energy)",
    "Tactical Response (−20% Tac CD)",
    "Archwing / Necramech CD",
    "Swift Tactics (−20% Tac CD)",
    "Join Warp",
  ],
  piloting: [
    "—",
    "Boost",
    "Vector Maneuver",
    "Vectored Evasion",
    "Drift Maneuver",
    "Boosted Scavenger",
    "Ram Jammer",
    "Necramech Haste",
    "Aeronaut",
    "Ramming Speed",
    "Railjack Blink",
  ],
  gunnery: [
    "—",
    "Energized Barrels (+50% Dorsal/Ventral dmg)",
    "Phantom Eye (360° swivels)",
    "Archwing Slingshot",
    "Archwing Fury",
    "Necramech Fury",
    "Cold Trigger (−20% heat)",
    "Advanced Gunnery (−50% overheat time)",
    "Vengeful Archwing",
    "Flush Heat Sinks",
    "Reflex Aim",
  ],
  engineering: [
    "—",
    "Applied Omni",
    "Rapid Support",
    "Ordnance Forge",
    "Dome Charge Forge",
    "Optimized Forge (+25% yield)",
    "Forge Accelerator",
    "Full Optimization (+25% yield)",
    "Vigilant Archwing",
    "Vigilant Necramech",
    "Anastasis",
  ],
  command: [
    "—",
    "1st Crew Member",
    "Competency Gain",
    "2nd Crew Member",
    "Competency Gain",
    "3rd Crew Member",
    "Competency Gain",
    "Competency Retraining",
    "Unusual Crew (Liches)",
    "Command Link II",
    "Elite Crew",
  ],
};

export interface RailjackIntrinsicPaperEffects {
  /** Gunnery ≥1: +50% damage on swivel (Dorsal/Ventral) turrets only. */
  dorsalVentralTurretDamageBonus: number;
  /** Tactical ≥6: multiply Battle Mod energy costs. */
  battleEnergyCostMult: number;
  /** Tactical ≥7 / ≥9: −20% each, multiplicative → total reduction 0 / 0.2 / 0.36. */
  tacticalCooldownReduction: number;
  /** Engineering ≥4: Dome Charge forge unlocked (display). */
  domeChargeForge: boolean;
  /** Engineering ≥3: Ordnance forge unlocked (display). */
  ordnanceForge: boolean;
  /** Command ≥10: elite crew recruit unlocked. */
  eliteCrewUnlocked: boolean;
  /** Command ≥8: Lich / Sister / Coda crew. */
  unusualCrewUnlocked: boolean;
  /** Mission crew slots unlocked (0–3) at Command 1/3/5. */
  crewSlotsUnlocked: number;
  /** Panel notes for QoL / heat ranks that are not paper DPS. */
  panelNotes: string[];
}

export function clampIntrinsicRank(rank: number): number {
  return Math.max(0, Math.min(MAX_INTRINSIC_RANK, Math.floor(rank)));
}

export function normalizeIntrinsics(
  input?: Partial<RailjackIntrinsics> | null,
): RailjackIntrinsics {
  return {
    tactical: clampIntrinsicRank(input?.tactical ?? 0),
    piloting: clampIntrinsicRank(input?.piloting ?? 0),
    gunnery: clampIntrinsicRank(input?.gunnery ?? 0),
    engineering: clampIntrinsicRank(input?.engineering ?? 0),
    command: clampIntrinsicRank(input?.command ?? 0),
  };
}

/** Wiki-backed paper / unlock effects from Intrinsics ranks. */
export function intrinsicPaperEffects(
  raw?: Partial<RailjackIntrinsics> | null,
): RailjackIntrinsicPaperEffects {
  const i = normalizeIntrinsics(raw);
  const panelNotes: string[] = [];
  if (i.gunnery >= 6) panelNotes.push("Gunnery 6: −20% turret heat accretion (needs heat model)");
  if (i.gunnery >= 7) panelNotes.push("Gunnery 7: −50% overheat recovery (needs heat model)");
  if (i.gunnery >= 10) panelNotes.push("Gunnery 10: Reflex Aim (QoL)");
  if (i.piloting >= 1) panelNotes.push("Piloting 1+: Boost / Vector / Drift / Blink (handling)");
  if (i.engineering >= 5) panelNotes.push("Engineering 5–7: Forge yield / speed");
  if (i.tactical >= 1 && i.tactical < 6) panelNotes.push("Tactical 1–5: Menu / warp / Necramech deploy");

  let crewSlotsUnlocked = 0;
  if (i.command >= 1) crewSlotsUnlocked = 1;
  if (i.command >= 3) crewSlotsUnlocked = 2;
  if (i.command >= 5) crewSlotsUnlocked = 3;

  return {
    dorsalVentralTurretDamageBonus: i.gunnery >= 1 ? 0.5 : 0,
    battleEnergyCostMult: i.tactical >= 6 ? 0.75 : 1,
    // wiki Railjack/Intrinsics/Tactical: R7 and R9 −20% each, multiplicative (combined 36%).
    tacticalCooldownReduction:
      1 - (i.tactical >= 7 ? 0.8 : 1) * (i.tactical >= 9 ? 0.8 : 1),
    domeChargeForge: i.engineering >= 4,
    ordnanceForge: i.engineering >= 3,
    eliteCrewUnlocked: i.command >= 10,
    unusualCrewUnlocked: i.command >= 8,
    crewSlotsUnlocked,
    panelNotes,
  };
}

/**
 * Railjack Gunnery intrinsics that buff Archwing / Necramech gear
 * (wiki Railjack/Intrinsics/Gunnery):
 * - Rank 3: Archwing melee +20% damage (+0.75 m range, not modelled).
 * - Rank 4: Necramech gun damage +20%.
 * - Rank 8: Archwing +25% damage (additive with Rubedo-Lined Barrel),
 *   +20% Ability Strength / Range / Efficiency.
 * Rank-8 damage is applied to Archwing-mode arch-guns and arch-melee (wiki "Archwing power").
 */
export function gunneryArchWeaponDamageBonus(
  gunnery: number | undefined,
  weaponCategory: string | undefined,
  mode: "archwing" | "necramech",
): number {
  const g = clampIntrinsicRank(gunnery ?? 0);
  if (mode === "necramech") return weaponCategory === "archgun" && g >= 4 ? 0.2 : 0;
  let bonus = 0;
  if (weaponCategory === "archmelee" && g >= 3) bonus += 0.2;
  if ((weaponCategory === "archgun" || weaponCategory === "archmelee") && g >= 8) bonus += 0.25;
  return bonus;
}

/** Gunnery 8: +20% Archwing Ability Strength, Range and Efficiency (additive with mods). */
export function gunneryArchwingAbilityBonus(gunnery: number | undefined): number {
  return clampIntrinsicRank(gunnery ?? 0) >= 8 ? 0.2 : 0;
}
