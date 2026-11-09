import { formatAbilityEfficiencyPct } from "@/lib/display/ability-efficiency";
import { fmtDamageNum } from "@/lib/builds/loadout-stats";
import type { WarframeCalculatedStats } from "@/lib/types";

/** Combat-card order: survivability, then Duration, Efficiency, Range, Strength. */
export function loadoutCombatStatCells(
  stats: WarframeCalculatedStats | null | undefined,
): { label: string; value: string }[] {
  return [
    { label: "EHP", value: fmtDamageNum(stats?.effectiveHealth ?? 0) },
    { label: "Sprint", value: (stats?.totalSprint ?? 0).toFixed(2) },
    { label: "Duration", value: `${((stats?.abilityDuration ?? 0) * 100).toFixed(0)}%` },
    {
      label: "Efficiency",
      value: stats ? formatAbilityEfficiencyPct(stats.abilityEfficiency) : "0%",
    },
    { label: "Range", value: `${((stats?.abilityRange ?? 0) * 100).toFixed(0)}%` },
    { label: "Strength", value: `${((stats?.abilityStrength ?? 0) * 100).toFixed(0)}%` },
  ];
}
