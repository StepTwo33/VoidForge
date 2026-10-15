import { ENEMY_SUBFACTION } from "@/data/enemy-subfactions";

/**
 * Update 36 (Damage 3.0) damage type modifiers by faction.
 * Source: wiki Damage/Overview Table (transcluded on Damage Type Modifier), checked 2026-10-14:
 * "Vulnerable = x1.5 and Resistant = x0.5 incoming damage multiplier."
 * Health / armor / shield classes (Cloned Flesh, Ferrite, Proto Shield…) no longer exist;
 * these multipliers apply to every layer of the target.
 */
export type DamageFaction =
  | "Grineer"
  | "Kuva Grineer"
  | "Corpus"
  | "Corpus Amalgam"
  | "Infested"
  | "Infested Deimos"
  | "Orokin"
  | "Sentient"
  | "Narmer"
  | "The Murmur"
  | "Zariman"
  | "Scaldra"
  | "Techrot"
  | "Anarchs";

const V = 1.5;
const R = 0.5;

export const FACTION_DAMAGE_MODIFIERS: Record<DamageFaction, Record<string, number>> = {
  Grineer: { impact: V, corrosive: V },
  "Kuva Grineer": { impact: V, corrosive: V, heat: R },
  Corpus: { puncture: V, magnetic: V },
  "Corpus Amalgam": { electricity: V, magnetic: V, blast: R },
  Infested: { slash: V, heat: V },
  "Infested Deimos": { blast: V, gas: V, viral: R },
  Orokin: { puncture: V, viral: V, radiation: R },
  Sentient: { cold: V, radiation: V, corrosive: R },
  Narmer: { slash: V, toxin: V, magnetic: R },
  "The Murmur": { electricity: V, radiation: V, viral: R },
  Zariman: { void: V },
  Scaldra: { impact: V, corrosive: V, gas: R },
  Techrot: { gas: V, magnetic: V, cold: R },
  Anarchs: { impact: V, electricity: V, radiation: R },
};

/** EnemyType.faction (catalog label) → damage faction column. Stalker / Duviri / Special: none. */
const CATALOG_FACTION: Record<string, DamageFaction> = {
  Grineer: "Grineer",
  Corpus: "Corpus",
  Infested: "Infested",
  Corrupted: "Orokin",
  Sentient: "Sentient",
  Narmer: "Narmer",
  Murmur: "The Murmur",
  Zariman: "Zariman",
  Scaldra: "Scaldra",
  Techrot: "Techrot",
  Anarch: "Anarchs",
};

export function damageFactionForEnemy(enemy: { id: string; faction: string }): DamageFaction | null {
  return ENEMY_SUBFACTION[enemy.id] ?? CATALOG_FACTION[enemy.faction] ?? null;
}

/** Incoming damage multiplier for one damage type on this enemy (1, 1.5 or 0.5). */
export function enemyDamageTypeMultiplier(enemy: { id: string; faction: string }, type: string): number {
  const f = damageFactionForEnemy(enemy);
  return (f && FACTION_DAMAGE_MODIFIERS[f][type]) || 1;
}
