import type { Weapon } from "../types";

/** Element keys supported for Kuva/Tenet/Coda progenitor bonus (matches calculator innate keys). */
export const PROGENITOR_ELEMENT_IDS = [
  "heat",
  "cold",
  "toxin",
  "electricity",
  "impact",
  "puncture",
  "slash",
  "radiation",
  "viral",
  "corrosive",
  "magnetic",
  "gas",
  "blast",
] as const;

export type ProgenitorElementId = (typeof PROGENITOR_ELEMENT_IDS)[number];

export const PROGENITOR_ELEMENT_LABELS: Record<string, string> = {
  heat: "Heat",
  cold: "Cold",
  toxin: "Toxin",
  electricity: "Electricity",
  impact: "Impact",
  puncture: "Puncture",
  slash: "Slash",
  radiation: "Radiation",
  viral: "Viral",
  corrosive: "Corrosive",
  magnetic: "Magnetic",
  gas: "Gas",
  blast: "Blast",
};

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
