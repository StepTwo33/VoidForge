import type { CalculatedStats } from "@/lib/types";
import { calcSavedWeaponBuildStats } from "@/lib/builds/loadout-stats";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

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

export type SimWeaponBuildData = {
  weaponId?: string;
  mods?: { modId: string; rank: number; slotIndex: number }[];
  arcaneIds?: (string | null)[];
  progenitorElement?: string;
  progenitorBonusPercent?: number;
  incarnonEvolutions?: Record<number, number>;
};

export type AppliedSimBuild = ReturnType<typeof calculatedStatsToSimInputs> & {
  weaponName: string;
  buildLabel: string;
};

/** sessionStorage key for builder → damage-simulator handoff. */
export const DAMAGE_SIM_HANDOFF_KEY = "framehub:damage-sim-handoff";

/** Map live calculated stats into an AppliedSimBuild for the simulator. */
export function appliedSimBuildFromStats(
  stats: CalculatedStats,
  weaponName: string,
  buildLabel?: string,
): AppliedSimBuild {
  const inputs = calculatedStatsToSimInputs(stats);
  return {
    ...inputs,
    weaponName,
    buildLabel: buildLabel ?? `${weaponName} (current build)`,
  };
}

/** Persist current builder stats for the damage simulator to pick up. */
export function storeDamageSimHandoff(
  stats: CalculatedStats,
  weaponName: string,
  buildLabel?: string,
): void {
  if (typeof sessionStorage === "undefined") return;
  const payload = appliedSimBuildFromStats(stats, weaponName, buildLabel);
  sessionStorage.setItem(DAMAGE_SIM_HANDOFF_KEY, JSON.stringify(payload));
}

/** Read and clear a builder handoff payload, if present. */
export function consumeDamageSimHandoff(): AppliedSimBuild | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(DAMAGE_SIM_HANDOFF_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(DAMAGE_SIM_HANDOFF_KEY);
  try {
    const parsed = JSON.parse(raw) as AppliedSimBuild;
    if (!parsed?.dmgTypes || typeof parsed.fireRate !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Resolve a weapon build payload into simulator inputs + display label. */
export function applyWeaponBuildToSim(
  buildName: string,
  data: SimWeaponBuildData,
): AppliedSimBuild | null {
  if (!data?.weaponId) return null;
  const entry = calcSavedWeaponBuildStats(
    {
      weaponId: data.weaponId,
      mods: data.mods ?? [],
      arcaneIds: data.arcaneIds,
      progenitorElement: data.progenitorElement,
      progenitorBonusPercent: data.progenitorBonusPercent,
      incarnonEvolutions: data.incarnonEvolutions,
    },
    { ...DEFAULT_SIM_PARAMS, killStacks: 5, statusTypesOnTarget: 3, arcaneStacks: 12 },
  );
  if (!entry) return null;
  const inputs = calculatedStatsToSimInputs(entry.stats);
  return {
    ...inputs,
    weaponName: entry.name,
    buildLabel: `${buildName} (${entry.name})`,
  };
}
