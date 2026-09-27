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

export function weaponSupportsProgenitor(weapon: { id: string }): boolean {
  const id = weapon.id;
  return (
    id.startsWith("kuva_") ||
    id.startsWith("tenet_") ||
    id.startsWith("coda_") ||
    id.startsWith("dual_coda_")
  );
}

/** Formas that raise a Kuva/Tenet/Coda weapon past rank 30. Five Formas reach rank 40. */
export const ADVERSARY_FORMA_MAX = 5;

export function clampAdversaryFormas(value: number | undefined | null): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(ADVERSARY_FORMA_MAX, Math.max(0, Math.floor(value)));
}

/** Rank 30, then +2 per Forma, capped at 40. */
export function adversaryRankFromFormas(formas: number): number {
  return 30 + clampAdversaryFormas(formas) * 2;
}

/**
 * Mod capacity. Normal weapons are 30, or 60 with a Catalyst.
 * Kuva, Tenet, and Coda capacity matches max rank (40 / 80 after five Formas).
 */
export function weaponModCapacity(
  weapon: { id: string } | null | undefined,
  formas: number,
  hasCatalyst: boolean,
): number {
  const rank = weapon && weaponSupportsProgenitor(weapon) ? adversaryRankFromFormas(formas) : 30;
  return hasCatalyst ? rank * 2 : rank;
}

export const PROGENITOR_BONUS_MIN = 25;
export const PROGENITOR_BONUS_MAX = 60;
export const PROGENITOR_BONUS_DEFAULT = 55;
