import type { CalculatedStats } from "@/lib/types";

/** Map calculator output into damage-simulator form state. */
export function calculatedStatsToSimInputs(stats: CalculatedStats): {
  dmgTypes: Record<string, number>;
  fireRate: number;
  critChance: number;
  critMulti: number;
  multishot: number;
  statusChance: number;
  magazine: number;
  reloadTime: number;
  statusDamageBonus: number;
  headshotDamageBonus: number;
  factionBonuses: Record<string, number>;
  punctureArmorStripPerStack?: number;
} {
  const dmgTypes: Record<string, number> = {};
  if (stats.impact > 0) dmgTypes.impact = stats.impact;
  if (stats.puncture > 0) dmgTypes.puncture = stats.puncture;
  if (stats.slash > 0) dmgTypes.slash = stats.slash;
  for (const e of stats.elements ?? []) {
    if (e.value > 0) dmgTypes[e.type] = (dmgTypes[e.type] ?? 0) + e.value;
  }
  if (Object.keys(dmgTypes).length === 0) {
    dmgTypes.impact = Math.max(stats.totalDamage, 1);
  }

  return {
    dmgTypes,
    fireRate: stats.fireRate,
    critChance: stats.criticalChance,
    critMulti: stats.criticalMultiplier,
    multishot: stats.multishot,
    statusChance: stats.statusChance,
    magazine: stats.magazine,
    reloadTime: stats.reloadTime,
    statusDamageBonus: stats.statusDamageBonus ?? 0,
    headshotDamageBonus: stats.headshotDamageBonus ?? 0,
    factionBonuses: { ...(stats.factionBonuses ?? {}) },
    ...(stats.punctureArmorStripPerStack
      ? { punctureArmorStripPerStack: stats.punctureArmorStripPerStack }
      : {}),
  };
}

export interface SimBuildOption {
  id: string;
  label: string;
  source: "local" | "cloud";
  type: string;
}
