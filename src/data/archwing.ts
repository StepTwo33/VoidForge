// Archwing frames and Necramech data
// Converted from lib/data/archwing_data.dart

export interface Archwing {
  id: string;
  name: string;
  health: number;
  shield: number;
  armor: number;
  energy: number;
  speed: number;
  description: string;
}

export interface Necramech {
  id: string;
  name: string;
  health: number;
  shield: number;
  armor: number;
  energy: number;
  description: string;
}

/**
 * Rank 0 → rank 30 stat gains. Since the Health/Shield/Energy/Armor overhaul, Archwing and
 * Necramech mods multiply the max-rank stat (wiki Archwing / Necramech patch history:
 * "updated to apply Health / Shield / Energy / Armor values to Max Rank stats").
 * Every Archwing gains +250 health / +200 shields / +50 energy (e.g. Elytron 765→1015,
 * 745→945, 120→170); Necramechs gain +1000 / +200 / +50 (Voidrig 1400→2400, 850→1050,
 * 175→225). Armor does not scale with rank.
 * Necramechs can reach rank 40 via Forma; no source gives extra stats past rank 30, so
 * builds assume rank 30.
 */
export const ARCHWING_RANK30_BONUS = { health: 250, shield: 200, energy: 50 } as const;
export const NECRAMECH_RANK30_BONUS = { health: 1000, shield: 200, energy: 50 } as const;

export const archwings: Archwing[] = [
  { id: "odonata", name: "Odonata", health: 425, shield: 430, armor: 100, energy: 85, speed: 1.0, description: "Balanced starter Archwing" },
  { id: "odonata_prime", name: "Odonata Prime", health: 650, shield: 640, armor: 100, energy: 85, speed: 1.05, description: "Prime balanced Archwing" },
  { id: "elytron", name: "Elytron", health: 765, shield: 745, armor: 145, energy: 120, speed: 0.9, description: "Heavy bomber Archwing" },
  { id: "itzal", name: "Itzal", health: 200, shield: 220, armor: 50, energy: 220, speed: 1.2, description: "Stealth and support Archwing" },
  { id: "amesha", name: "Amesha", health: 650, shield: 220, armor: 195, energy: 220, speed: 1.1, description: "Support Archwing with healing and buffs" },
];

export const necramechs: Necramech[] = [
  { id: "voidrig", name: "Voidrig", health: 1400, shield: 850, armor: 385, energy: 175, description: "Heavy artillery Necramech. Exalted weapon: Arquebex." },
  { id: "bonewidow", name: "Bonewidow", health: 1880, shield: 430, armor: 480, energy: 175, description: "Melee-focused Necramech with shield and sword." },
];

/** Ids that also have ability rows in warframes.ts for calc/codex — not selectable Warframes. */
export const NECRAMECH_IDS = new Set(necramechs.map((n) => n.id));

export function isNecramechId(id: string): boolean {
  return NECRAMECH_IDS.has(id);
}
