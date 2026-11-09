/** Ids already chosen on the other compare side. Empty strings are ignored. */
export function compareIdsTaken(ids: Array<string | null | undefined>): string[] {
  return ids.filter((id): id is string => typeof id === "string" && id.length > 0);
}

/** True when this picker row is the build or loadout already on the other side. */
export function isSameCompareSelection(id: string, taken: readonly string[]): boolean {
  return taken.includes(id);
}
