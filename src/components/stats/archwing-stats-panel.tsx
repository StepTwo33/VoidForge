"use client";

import { ArchwingCalculatedStats } from "@/lib/types";
import { CollapsibleSection, StatRow } from "./stat-primitives";

const ARCHWING_MOD_BONUS_LABELS: Record<string, string> = {
  "superior_defenses::shieldRecharge": "Shield Recharge",
  "superior_defenses::shieldRechargeDelay": "Shield Recharge Delay",
};

export function ArchwingStatsPanel({
  stats,
  title = "ARCHWING STATS",
}: {
  stats: ArchwingCalculatedStats | null;
  title?: string;
}) {
  if (!stats) {
    return (
      <div className="border border-border rounded-xl p-4 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h3>
        <p className="text-xs text-muted-foreground">Select a frame to see stats</p>
      </div>
    );
  }

  const modBonusLines = Object.entries(stats.modBonuses ?? {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => ({
      key,
      label: ARCHWING_MOD_BONUS_LABELS[key] ?? key.replace("::", " — "),
      value,
    }));

  return (
    <div className="border border-border rounded-xl p-4 bg-card space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h3>

      <StatRow label="Health" value={stats.totalHealth.toFixed(0)} />
      <StatRow label="Shield" value={stats.totalShield.toFixed(0)} />
      <StatRow label="Armor" value={stats.totalArmor.toFixed(0)} />
      <StatRow label="Energy" value={stats.totalEnergy.toFixed(0)} />
      <StatRow label="Flight Speed" value={stats.totalFlightSpeed.toFixed(2)} />

      {stats.kineticDiversionPercent > 0 && (
        <StatRow
          label="Kinetic Diversion"
          value={`${stats.kineticDiversionPercent.toFixed(0)}% dmg → energy`}
          color="text-cyan-700 dark:text-cyan-400"
          tooltip="Converts a portion of damage taken on health into energy. Without shields, ally Overguard counts as health."
        />
      )}

      {(stats.abilityStrength !== 1 || stats.abilityDuration !== 1 || stats.abilityEfficiency !== 1 || stats.abilityRange !== 1) && (
        <>
          <div className="border-t border-border/50 my-1" />
          <StatRow
            label="Strength"
            value={`${(stats.abilityStrength * 100).toFixed(0)}%`}
            color={stats.abilityStrength > 1 ? "text-orange-700 dark:text-orange-400" : undefined}
          />
          <StatRow
            label="Duration"
            value={`${(stats.abilityDuration * 100).toFixed(0)}%`}
            color={stats.abilityDuration > 1 ? "text-cyan-700 dark:text-cyan-400" : undefined}
          />
          <StatRow
            label="Efficiency"
            value={`${(stats.abilityEfficiency * 100).toFixed(0)}%`}
            color={stats.abilityEfficiency > 1 ? "text-blue-700 dark:text-blue-400" : undefined}
          />
          <StatRow
            label="Range"
            value={`${(stats.abilityRange * 100).toFixed(0)}%`}
            color={stats.abilityRange > 1 ? "text-green-700 dark:text-green-400" : undefined}
          />
        </>
      )}

      {modBonusLines.length > 0 && (
        <>
          <div className="border-t border-border/50 my-1" />
          {modBonusLines.map((line) => (
            <StatRow
              key={line.key}
              label={line.label}
              value={`${line.value >= 0 ? "+" : ""}${line.value.toFixed(0)}%`}
              color="text-purple-800 dark:text-purple-300"
            />
          ))}
        </>
      )}

      <div className="border-t border-border/50 my-1" />
      <StatRow label="Effective Health" value={stats.effectiveHealth.toFixed(0)} highlighted />
      <StatRow label="Damage Reduction" value={`${stats.damageReduction.toFixed(1)}%`} highlighted />
    </div>
  );
}

