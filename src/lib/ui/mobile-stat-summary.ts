import { formatAbilityEfficiencyPct } from "@/lib/display/ability-efficiency";
import type {
  ArchwingCalculatedStats,
  CalculatedStats,
  CompanionCalculatedStats,
  RailjackCalculatedStats,
  WarframeCalculatedStats,
} from "@/lib/types";

export type StatSummaryItem = {
  key: string;
  /** Short label shown above the value. */
  label: string;
  value: string;
  /** Long form for the tooltip / screen readers. */
  title: string;
};

/** Key warframe stats for the compact sticky bar: EHP + ability strip. */
export function warframeStatSummary(stats: WarframeCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "ehp", label: "EHP", value: stats.effectiveHealth.toFixed(0), title: "Effective Health" },
    { key: "str", label: "STR", value: `${(stats.abilityStrength * 100).toFixed(0)}%`, title: "Ability Strength" },
    { key: "dur", label: "DUR", value: `${(stats.abilityDuration * 100).toFixed(0)}%`, title: "Ability Duration" },
    { key: "rng", label: "RNG", value: `${(stats.abilityRange * 100).toFixed(0)}%`, title: "Ability Range" },
    { key: "eff", label: "EFF", value: formatAbilityEfficiencyPct(stats.abilityEfficiency), title: "Ability Efficiency" },
  ];
}

/** Key weapon stats: burst and sustained DPS (plus CC so the row stays useful). */
export function weaponStatSummary(stats: CalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "burst", label: "Burst", value: stats.burstDps.toFixed(0), title: "Total Burst DPS" },
    { key: "sustained", label: "Sust.", value: stats.sustainedDps.toFixed(0), title: "Total Sustained DPS" },
    { key: "cc", label: "CC", value: `${(stats.criticalChance * 100).toFixed(1)}%`, title: "Critical chance" },
    { key: "cd", label: "CD", value: `${stats.criticalMultiplier.toFixed(2)}x`, title: "Critical damage (critical multiplier)" },
  ];
}

export function companionStatSummary(stats: CompanionCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "ehp", label: "EHP", value: stats.effectiveHealth.toFixed(0), title: "Effective Health" },
    { key: "health", label: "HP", value: stats.totalHealth.toFixed(0), title: "Health" },
    { key: "shield", label: "Shield", value: stats.totalShield.toFixed(0), title: "Shield" },
    { key: "armor", label: "Armor", value: stats.totalArmor.toFixed(0), title: "Armor" },
  ];
}

export function archwingStatSummary(stats: ArchwingCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "ehp", label: "EHP", value: stats.effectiveHealth.toFixed(0), title: "Effective Health" },
    { key: "str", label: "STR", value: `${(stats.abilityStrength * 100).toFixed(0)}%`, title: "Ability Strength" },
    { key: "dur", label: "DUR", value: `${(stats.abilityDuration * 100).toFixed(0)}%`, title: "Ability Duration" },
    { key: "rng", label: "RNG", value: `${(stats.abilityRange * 100).toFixed(0)}%`, title: "Ability Range" },
    { key: "eff", label: "EFF", value: formatAbilityEfficiencyPct(stats.abilityEfficiency), title: "Ability Efficiency" },
  ];
}

export function railjackStatSummary(stats: RailjackCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "hull", label: "Hull", value: stats.hull.toFixed(0), title: "Hull" },
    { key: "shield", label: "Shield", value: stats.shield.toFixed(0), title: "Shield" },
    { key: "armor", label: "Armor", value: stats.armor.toFixed(0), title: "Armor" },
    { key: "speed", label: "Speed", value: `${stats.speed.toFixed(0)}`, title: "Speed (m/s)" },
  ];
}

export function operatorStatSummary(amp: {
  damage: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
} | null): StatSummaryItem[] {
  if (!amp) return [];
  return [
    { key: "dmg", label: "DMG", value: amp.damage.toFixed(0), title: "Amp damage" },
    { key: "cc", label: "CC", value: `${(amp.criticalChance * 100).toFixed(0)}%`, title: "Critical chance" },
    { key: "cd", label: "CD", value: `${amp.criticalMultiplier.toFixed(1)}×`, title: "Critical multiplier" },
    { key: "sc", label: "SC", value: `${(amp.statusChance * 100).toFixed(0)}%`, title: "Status chance" },
  ];
}
