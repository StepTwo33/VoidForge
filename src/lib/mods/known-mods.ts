/**
 * Saved builds, share links and loadouts can reference mod ids that were later
 * removed from the catalog (e.g. the fake "augmented_sonar"). Drop those entries
 * on load so they don't linger as invisible slot occupants and get re-saved.
 * Everything else that reads mods already skips unknown ids (calc, capacity,
 * previews) or shows the raw id (compare view).
 */
export function dropUnknownMods<T extends { modId: string }>(
  mods: readonly T[] | null | undefined,
  modsMap: Pick<Map<string, unknown>, "has">,
): T[] {
  return (mods ?? []).filter((m) => Boolean(m?.modId) && modsMap.has(m.modId));
}
