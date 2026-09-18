import type { Weapon } from "../types";

/**
 * Kuva / Tenet / Coda progenitor damage types (wiki Lich/Sister/Technocyte Coda).
 * Order matches the in-game / wiki element table.
 */
export const PROGENITOR_ELEMENT_IDS = [
  "impact",
  "heat",
  "cold",
  "electricity",
  "toxin",
  "magnetic",
  "radiation",
] as const;

export type ProgenitorElementId = (typeof PROGENITOR_ELEMENT_IDS)[number];

export const PROGENITOR_ELEMENT_LABELS: Record<ProgenitorElementId, string> = {
  impact: "Impact",
  heat: "Heat",
  cold: "Cold",
  electricity: "Electricity",
  toxin: "Toxin",
  magnetic: "Magnetic",
  radiation: "Radiation",
};

export function isProgenitorElementId(value: string): value is ProgenitorElementId {
  return (PROGENITOR_ELEMENT_IDS as readonly string[]).includes(value);
}

/** Fall back to Heat when an old share/build used a non-progenitor type. */
export function normalizeProgenitorElement(
  value: string | undefined | null,
  fallback: ProgenitorElementId = "heat",
): ProgenitorElementId {
  if (value && isProgenitorElementId(value)) return value;
  return fallback;
}

export function weaponSupportsProgenitor(weapon: Weapon): boolean {
  const id = weapon.id;
  return (
    id.startsWith("kuva_") ||
    id.startsWith("tenet_") ||
    id.startsWith("coda_") ||
    id.startsWith("dual_coda_")
  );
}

export const PROGENITOR_BONUS_MIN = 25;
export const PROGENITOR_BONUS_MAX = 60;
export const PROGENITOR_BONUS_DEFAULT = 55;
