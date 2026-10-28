import type { CalculatedStats, WarframeCalculatedStats } from "@/lib/types";

export type StatSummaryItem = {
  key: string;
  /** Short label shown above the value. */
  label: string;
  value: string;
  /** Long form for the tooltip / screen readers. */
  title: string;
};

/** Same formatting as the full Warframe stats panel (SURVIVABILITY + EFFECTIVE HEALTH). */
export function warframeStatSummary(stats: WarframeCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "health", label: "HP", value: stats.totalHealth.toFixed(0), title: "Health" },
    { key: "shield", label: "Shield", value: stats.totalShield.toFixed(0), title: "Shield" },
    { key: "armor", label: "Armor", value: stats.totalArmor.toFixed(0), title: "Armor" },
    { key: "energy", label: "Energy", value: stats.totalEnergy.toFixed(0), title: "Energy" },
    { key: "ehp", label: "Eff. HP", value: stats.effectiveHealth.toFixed(0), title: "Effective Health" },
  ];
}

/** Same formatting as the full weapon stats panel (DPS totals + CORE rows). */
export function weaponStatSummary(stats: CalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "burst", label: "Burst DPS", value: stats.burstDps.toFixed(0), title: "Total Burst DPS" },
    { key: "sustained", label: "Sust. DPS", value: stats.sustainedDps.toFixed(0), title: "Total Sustained DPS" },
    { key: "cc", label: "CC", value: `${(stats.criticalChance * 100).toFixed(1)}%`, title: "Critical chance" },
    { key: "cd", label: "CD", value: `${stats.criticalMultiplier.toFixed(2)}x`, title: "Critical damage (critical multiplier)" },
    { key: "sc", label: "SC", value: `${(stats.statusChance * 100).toFixed(1)}%`, title: "Status chance" },
  ];
}
