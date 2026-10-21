import type { StatusResistanceEntry, WarframeCalculatedStats } from "@/lib/types";

/**
 * Warframe arcanes that give a chance to resist one element's status effect
 * (wiki.warframe.com arcane pages: 17% per rank, 102% at R5).
 */
export const ARCANE_STATUS_RESIST: Record<string, { element: string; name: string }> = {
  arcane_ice: { element: "Heat", name: "Arcane Ice" },
  arcane_warmth: { element: "Cold", name: "Arcane Warmth" },
  arcane_nullifier: { element: "Magnetic", name: "Arcane Nullifier" },
  arcane_resistance: { element: "Toxin", name: "Arcane Resistance" },
  arcane_deflection: { element: "Slash", name: "Arcane Deflection" },
  arcane_healing: { element: "Radiation", name: "Arcane Healing" },
};

/**
 * Add a status-resist chance for one element. Chances only combine within the
 * same element (independent rolls: 1 − Π(1 − p)), capped at 100%.
 */
export function addStatusResistance(
  stats: Pick<WarframeCalculatedStats, "statusResistances">,
  element: string,
  chancePercent: number,
  source: string,
): void {
  if (!(chancePercent > 0)) return;
  const list: StatusResistanceEntry[] = stats.statusResistances ?? (stats.statusResistances = []);
  const p = Math.min(chancePercent, 100) / 100;
  const existing = list.find((e) => e.element === element);
  if (existing) {
    existing.chance = Math.min(100, (1 - (1 - existing.chance / 100) * (1 - p)) * 100);
    existing.sources.push(source);
  } else {
    list.push({ element, chance: p * 100, sources: [source] });
  }
}
