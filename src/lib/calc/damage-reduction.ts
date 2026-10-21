/**
 * Player damage reduction stacking (Round 15).
 *
 * wiki.warframe.com Damage Reduction: "Sources of damage reduction (including armor) stack
 * multiplicatively with each other": Damage Received = Damage × (1 − DR1) × (1 − DR2) × ⋯.
 * - Armor DR (armor ÷ (armor + 300)) applies to health only.
 * - Pure damage reduction (mods, arcanes, abilities) applies to shields and health.
 * - Damage type modifiers (Antitoxin, Flame Repellent, …) only reduce that damage type; they
 *   multiply within the same type and with every other kind of DR.
 *
 * Update 30.5 (2021-07-06), "Damage Resistance Mod Math Changes" (wiki.warframe.com Aviator /
 * Agility Drift / Aerodynamic patch history): resistance works on damage remaining
 * (4 × 25% → 68.5%, not 100%), and the earlier 90% airborne cap (Hotfix 25.7.8) was removed
 * ("(Undocumented) removed 90% cap"). Individual abilities keep their own documented caps.
 */
import type { ModSlot } from "@/lib/types";
import { PLAYER_SHIELD_DAMAGE_TAKEN } from "@/lib/calc/player-ehp";

/** 1 − Π(1 − x). Inputs and result are fractions; each source is clamped to [0, 1]. */
export function combineDamageReduction(fractions: readonly number[]): number {
  let taken = 1;
  for (const f of fractions) {
    if (!Number.isFinite(f) || f <= 0) continue;
    taken *= 1 - Math.min(f, 1);
  }
  return 1 - taken;
}

/**
 * Warframe EHP with armor (health only) and pure DR (health and shields).
 * Shields additionally take 50% less damage (PLAYER_SHIELD_DAMAGE_TAKEN).
 */
export function warframeEffectiveHealth(
  health: number,
  shield: number,
  armorDR: number,
  pureDR: number,
  opts?: { typedResist?: number; bypassesShields?: boolean },
): number {
  const typed = Math.min(Math.max(opts?.typedResist ?? 0, 0), 0.999999);
  const pure = Math.min(Math.max(pureDR, 0), 0.999999);
  const armor = Math.min(Math.max(armorDR, 0), 0.999999);
  const healthTaken = (1 - armor) * (1 - pure) * (1 - typed);
  const shieldTaken = PLAYER_SHIELD_DAMAGE_TAKEN * (1 - pure) * (1 - typed);
  return health / healthTaken + (opts?.bypassesShields ? 0 : shield / shieldTaken);
}

/** Airborne-only damage reduction mods: fraction per rank (× (rank + 1)), wiki.warframe.com. */
export const AIRBORNE_DR_MODS: Record<string, { name: string; perRank: number }> = {
  // Aviator: 10/20/30/40% (R0–R3)
  aviator: { name: "Aviator", perRank: 0.1 },
  // Agility Drift: 2…12% (R0–R5)
  agility_drift: { name: "Agility Drift", perRank: 0.02 },
  // Aerodynamic (aura, squad): 4…24% (R0–R5). Catalog stat keys don't carry this cleanly.
  aerodynamic: { name: "Aerodynamic", perRank: 0.04 },
  // Ironclad Flight (Titania augment, Razorwing): 10/20/30/40% (R0–R3)
  ironclad_flight: { name: "Ironclad Flight", perRank: 0.1 },
};

/** Boreal set: 20% / 40% / 60% airborne DR for 1 / 2 / 3 pieces (wiki Aviator note uses 60%). */
export const BOREAL_AIRBORNE_DR_PER_PIECE = 0.2;

export type ResistDamageType =
  | "impact" | "puncture" | "slash" | "heat" | "cold" | "electricity" | "toxin" | "radiation";

/** Damage type resistance mods: fraction per rank (× (rank + 1)), wiki.warframe.com mod pages. */
export const TYPED_RESIST_MODS: Record<string, { name: string; types: ResistDamageType[]; perRank: number }> = {
  antitoxin: { name: "Antitoxin", types: ["toxin"], perRank: 0.075 }, // 45% R5
  aura_toxin_resistance: { name: "Toxin Resistance", types: ["toxin"], perRank: 0.025 }, // 15% R5
  diamond_skin: { name: "Diamond Skin", types: ["radiation"], perRank: 0.075 }, // 45% R5
  flame_repellent_r3: { name: "Flame Repellent", types: ["heat"], perRank: 0.1 }, // 60% R5
  insulation_r3: { name: "Insulation", types: ["cold"], perRank: 0.1 }, // 60% R5
  lightning_rod_r3: { name: "Lightning Rod", types: ["electricity"], perRank: 0.1 }, // 60% R5
  shock_absorbers: { name: "Shock Absorbers", types: ["impact", "puncture", "slash"], perRank: 0.05 }, // 20% R3
};

export interface DrSource {
  name: string;
  /** Fraction (0.4 = 40%). */
  value: number;
}

export interface TypedResistance {
  type: ResistDamageType;
  /** Combined resistance for this type, percent. */
  percent: number;
  sources: DrSource[];
  /** EHP against this damage type only (Toxin skips shields). */
  effectiveHealth: number;
}

function clampedRank(slot: Pick<ModSlot, "rank">, maxRank: number): number {
  return Math.min(Math.max(slot.rank ?? 0, 0), maxRank);
}

/** Airborne DR sources from equipped Warframe mods + Boreal set pieces. */
export function airborneDrSources(
  equippedMods: readonly Pick<ModSlot, "modId" | "rank">[],
  maxRankOf: (modId: string) => number,
  borealPieces: number,
): DrSource[] {
  const out: DrSource[] = [];
  for (const slot of equippedMods) {
    const def = AIRBORNE_DR_MODS[slot.modId];
    if (!def) continue;
    out.push({ name: def.name, value: def.perRank * (clampedRank(slot, maxRankOf(slot.modId)) + 1) });
  }
  if (borealPieces > 0) {
    out.push({ name: `Boreal set (${borealPieces}/3)`, value: BOREAL_AIRBORNE_DR_PER_PIECE * Math.min(borealPieces, 3) });
  }
  return out;
}

/** Per-type resistance sources from equipped Warframe mods. */
export function typedResistSources(
  equippedMods: readonly Pick<ModSlot, "modId" | "rank">[],
  maxRankOf: (modId: string) => number,
): Map<ResistDamageType, DrSource[]> {
  const out = new Map<ResistDamageType, DrSource[]>();
  for (const slot of equippedMods) {
    const def = TYPED_RESIST_MODS[slot.modId];
    if (!def) continue;
    const value = def.perRank * (clampedRank(slot, maxRankOf(slot.modId)) + 1);
    for (const t of def.types) {
      const list = out.get(t) ?? [];
      list.push({ name: def.name, value });
      out.set(t, list);
    }
  }
  return out;
}
