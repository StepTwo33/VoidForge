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
  /** Gunnery ≥1: +50% damage on Dorsal + Ventral turrets only. */
  dorsalVentralTurretDamageBonus: number;
  /** Tactical ≥6: multiply Battle Mod energy costs. */
  battleEnergyCostMult: number;
  /** Tactical ≥7 / ≥9: additive cooldown reduction (0–0.4). */
  tacticalCooldownReduction: number;
  /** Engineering ≥4: Dome Charge forge unlocked (display). */
  domeChargeForge: boolean;
  /** Engineering ≥3: Ordnance forge unlocked (display). */
  ordnanceForge: boolean;
  /** Command ≥10: elite crew recruit unlocked. */
  eliteCrewUnlocked: boolean;
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

  return {
    dorsalVentralTurretDamageBonus: i.gunnery >= 1 ? 0.5 : 0,
    battleEnergyCostMult: i.tactical >= 6 ? 0.75 : 1,
    tacticalCooldownReduction: (i.tactical >= 7 ? 0.2 : 0) + (i.tactical >= 9 ? 0.2 : 0),
    domeChargeForge: i.engineering >= 4,
    ordnanceForge: i.engineering >= 3,
    eliteCrewUnlocked: i.command >= 10,
    panelNotes,
  };
}
