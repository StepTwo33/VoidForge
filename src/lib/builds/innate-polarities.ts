import { INNATE_POLARITIES, type InnatePolarityEntry } from "@/data/innate-polarities";

/**
 * Default (innate) slot polarities for an item, layered under the user's / imported forma.
 *
 * The data (src/data/innate-polarities.ts) lists each item's innate polarities in WFCD order
 * without slot positions, so they are placed on the first regular slots in that order:
 *   - warframe: aura -> slot 0, Jade's second aura -> 10, exilus -> 9, regular from slot 1
 *   - weapon / companion / archwing / necramech: regular from slot 0 (weapon exilus has no innate default)
 *
 * Saved builds keep storing only overrides. An override of {@link NO_POLARITY} clears an innate
 * polarity (forma "Remove polarity" on a default slot), so the slot counts as unpolarized.
 */
export type InnateKind = "warframe" | "weapon" | "companion" | "archwing" | "necramech";

export const NO_POLARITY = "none";

const WARFRAME_AURA = 0;
const WARFRAME_SECOND_AURA = 10;
const WARFRAME_EXILUS = 9;
const WARFRAME_FIRST_REGULAR = 1;

export function getInnatePolarityEntry(
  kind: InnateKind,
  id: string | null | undefined,
): InnatePolarityEntry | undefined {
  if (!id) return undefined;
  return INNATE_POLARITIES[`${kind}:${id}`];
}

/** Innate polarity per builder slot index for one item. */
export function innateSlotPolarities(
  kind: InnateKind,
  id: string | null | undefined,
): Record<number, string> {
  const entry = getInnatePolarityEntry(kind, id);
  const out: Record<number, string> = {};
  if (!entry) return out;
  const first = kind === "warframe" ? WARFRAME_FIRST_REGULAR : 0;
  (entry.slots ?? []).forEach((p, i) => {
    out[first + i] = p;
  });
  if (kind === "warframe") {
    if (entry.aura) out[WARFRAME_AURA] = entry.aura;
    if (entry.aura2) out[WARFRAME_SECOND_AURA] = entry.aura2;
    if (entry.exilus) out[WARFRAME_EXILUS] = entry.exilus;
  }
  return out;
}

/** Innate defaults with overrides on top; {@link NO_POLARITY} overrides drop the slot. */
export function effectiveSlotPolarities(
  innate: Record<number, string>,
  overrides: Record<number, string> | null | undefined,
): Record<number, string> {
  const out: Record<number, string> = { ...innate };
  for (const [k, v] of Object.entries(overrides ?? {})) {
    const idx = Number(k);
    if (v === NO_POLARITY || !v) delete out[idx];
    else out[idx] = v;
  }
  return out;
}

/**
 * Apply a forma choice to the stored overrides. `null` means "Remove polarity": on a slot with an
 * innate default that stores {@link NO_POLARITY}; otherwise it deletes the override. Picking the
 * innate polarity itself just removes the override.
 */
export function applyPolarityOverride(
  overrides: Record<number, string>,
  innate: Record<number, string>,
  slotIndex: number,
  polarity: string | null,
): Record<number, string> {
  const next = { ...overrides };
  const def = innate[slotIndex];
  if (polarity && polarity !== NO_POLARITY) {
    if (polarity === def) delete next[slotIndex];
    else next[slotIndex] = polarity;
  } else if (def) {
    next[slotIndex] = NO_POLARITY;
  } else {
    delete next[slotIndex];
  }
  return next;
}

export function isInnatePolarity(
  innate: Record<number, string>,
  overrides: Record<number, string> | null | undefined,
  slotIndex: number,
): boolean {
  return innate[slotIndex] !== undefined && (overrides ?? {})[slotIndex] === undefined;
}
