/** Compact loadout cards keep the combat report closed until that card is opened. */
export function nextCombatOpen(open: Record<string, boolean>, id: string): Record<string, boolean> {
  return { ...open, [id]: !open[id] };
}
