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

/** Secondary rows revealed when the mobile stat summary strip is expanded. */
export function warframeStatSummaryExtra(stats: WarframeCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "hp", label: "HP", value: stats.totalHealth.toFixed(0), title: "Health" },
    { key: "shield", label: "Shield", value: stats.totalShield.toFixed(0), title: "Shield" },
    { key: "armor", label: "Armor", value: stats.totalArmor.toFixed(0), title: "Armor" },
    { key: "dr", label: "DR", value: `${stats.damageReduction.toFixed(0)}%`, title: "Damage Reduction" },
    { key: "energy", label: "Energy", value: stats.totalEnergy.toFixed(0), title: "Max Energy" },
  ];
}

export function weaponStatSummaryExtra(stats: CalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  const fr = stats.effectiveFireRate ?? stats.fireRate;
  return [
    { key: "sc", label: "SC", value: `${(stats.statusChance * 100).toFixed(1)}%`, title: "Status chance" },
    { key: "ms", label: "MS", value: stats.multishot.toFixed(1), title: "Multishot" },
    { key: "fr", label: "FR", value: `${fr.toFixed(2)}/s`, title: "Effective fire rate" },
    { key: "dmg", label: "Dmg", value: stats.totalDamage.toFixed(0), title: "Total damage per shot" },
  ];
}

export function companionStatSummaryExtra(stats: CompanionCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "dr", label: "DR", value: `${stats.damageReduction.toFixed(0)}%`, title: "Damage Reduction" },
    { key: "melee", label: "Melee", value: `+${(stats.meleeDamageBonus * 100).toFixed(0)}%`, title: "Companion melee damage bonus" },
    { key: "cc", label: "CC", value: `+${(stats.critChanceBonus * 100).toFixed(0)}%`, title: "Companion critical chance bonus" },
    { key: "cd", label: "CD", value: `+${(stats.critDamageBonus * 100).toFixed(0)}%`, title: "Companion critical damage bonus" },
  ];
}

export function archwingStatSummaryExtra(stats: ArchwingCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "hp", label: "HP", value: stats.totalHealth.toFixed(0), title: "Health" },
    { key: "shield", label: "Shield", value: stats.totalShield.toFixed(0), title: "Shield" },
    { key: "armor", label: "Armor", value: stats.totalArmor.toFixed(0), title: "Armor" },
    { key: "dr", label: "DR", value: `${stats.damageReduction.toFixed(0)}%`, title: "Damage Reduction" },
    { key: "energy", label: "Energy", value: stats.totalEnergy.toFixed(0), title: "Max Energy" },
  ];
}

export function railjackStatSummaryExtra(stats: RailjackCalculatedStats | null): StatSummaryItem[] {
  if (!stats) return [];
  return [
    { key: "boost", label: "Boost", value: stats.boostSpeed.toFixed(0), title: "Boost speed (m/s)" },
    { key: "regen", label: "Regen", value: `${stats.shieldRecharge.toFixed(1)}%`, title: "Shield recharge per second" },
    { key: "turret", label: "Turret", value: `+${(stats.turretDamageBonus * 100).toFixed(0)}%`, title: "Turret damage bonus" },
    { key: "ord", label: "Ord.", value: `+${(stats.ordnanceDamageBonus * 100).toFixed(0)}%`, title: "Ordnance damage bonus" },
  ];
}

export function operatorStatSummaryExtra(amp: {
  fireRate?: number;
  magazine?: number;
  reloadTime?: number;
  triggerType?: string;
} | null): StatSummaryItem[] {
  if (!amp) return [];
  const items: StatSummaryItem[] = [];
  if (typeof amp.fireRate === "number" && amp.fireRate > 0) {
    items.push({ key: "fr", label: "FR", value: `${amp.fireRate.toFixed(1)}/s`, title: "Fire rate" });
  }
  if (typeof amp.magazine === "number" && amp.magazine > 0) {
    items.push({ key: "mag", label: "Mag", value: String(amp.magazine), title: "Magazine / energy pool" });
  }
  if (typeof amp.reloadTime === "number" && amp.reloadTime > 0) {
    items.push({ key: "reload", label: "Reload", value: `${amp.reloadTime.toFixed(1)}s`, title: "Reload time" });
  }
  if (amp.triggerType) {
    items.push({ key: "type", label: "Trigger", value: amp.triggerType, title: "Trigger type" });
  }
  return items;
}
