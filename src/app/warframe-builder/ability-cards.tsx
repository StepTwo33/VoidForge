"use client";

import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import type { Ability, WarframeCalculatedStats, Weapon } from "@/lib/types";
import type { HelminthAbility } from "@/data/helminth";
import { formatAbilityDescription } from "@/lib/display/ability-text";
import { scaledAbilityEnergyCost } from "@/lib/codex/ability-misc-stats";
import { augurShieldsFromEnergySpent } from "@/lib/calc/set-bonuses";
import {
  AbilityCardShell,
  AbilitySlotBadge,
  AbilityFormBadge,
  AbilityEnergyChip,
  AbilityDamageTypeChip,
  AbilityStatsBlock,
} from "@/components/ability-display";

function AugurShieldsOnCast({
  energySpent,
  convertPercent,
}: {
  energySpent: number;
  convertPercent: number;
}) {
  const pieces = Math.round(convertPercent / 40);
  const shields = augurShieldsFromEnergySpent(energySpent, pieces);
  if (shields <= 0) return null;

  return (
    <p
      className="mt-1 text-right text-[10px] leading-snug text-sky-700 dark:text-sky-400"
      title={`${pieces} Augur piece${pieces === 1 ? "" : "s"} convert ${convertPercent}% of energy spent into shields (can create Overshields).`}
    >
      +{shields % 1 === 0 ? shields.toFixed(0) : shields.toFixed(1)} shields
      <span className="text-muted-foreground"> · Augur</span>
    </p>
  );
}

export function AbilityCard({
  ability,
  index,
  stats,
  gameSlot,
  formLabel,
  warframeId,
  footer,
  exaltedWeapon,
}: {
  ability: Ability;
  index: number;
  stats: WarframeCalculatedStats | null;
  gameSlot?: number;
  formLabel?: string;
  warframeId?: string;
  footer?: ReactNode;
  exaltedWeapon?: Weapon | null;
}) {
  const eff = stats?.abilityEfficiency ?? 1;
  const display = { warframeId, abilityName: ability.name };
  const effectiveCost =
    typeof ability.energyCost === "number" ? scaledAbilityEnergyCost(ability.energyCost, eff) : null;
  const slotNum = gameSlot ?? index + 1;
  const augurPct = stats?.augurEnergyToShieldsPercent ?? 0;

  return (
    <AbilityCardShell slot={slotNum} className="flex h-full flex-col">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <AbilitySlotBadge slot={slotNum} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold leading-tight tracking-tight sm:text-base">{ability.name}</h3>
              {formLabel && <AbilityFormBadge label={formLabel} />}
            </div>
          </div>
        </div>
        <div className="shrink-0">
          {effectiveCost != null && ability.energyCost != null && (
            <AbilityEnergyChip baseCost={ability.energyCost} effectiveCost={effectiveCost} />
          )}
          {augurPct > 0 && effectiveCost != null && (
            <AugurShieldsOnCast energySpent={effectiveCost} convertPercent={augurPct} />
          )}
        </div>
      </div>

      <p className="mb-2 line-clamp-3 text-[11px] leading-snug text-muted-foreground sm:line-clamp-none sm:text-xs sm:leading-relaxed">
        {formatAbilityDescription(ability.description)}
      </p>

      {ability.subAbilities != null && ability.subAbilities.length > 0 && (
        <ul className="mb-2 list-inside list-disc space-y-0.5 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
          {ability.subAbilities.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}

      {ability.damageType && (
        <div className="mb-2">
          <AbilityDamageTypeChip type={ability.damageType} />
        </div>
      )}

      <div className="mb-2">
        <AbilityStatsBlock
          ability={ability}
          stats={stats}
          display={display}
          hasExaltedWeapon={!!exaltedWeapon}
        />
      </div>

      {exaltedWeapon && (
        <div className="mb-3 rounded-lg border border-purple-500/25 bg-purple-500/5 px-2.5 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-purple-800 dark:text-purple-300">
            Exalted weapon
          </p>
          <p className="mt-0.5 text-xs font-medium">{exaltedWeapon.name}</p>
          <p className="text-[10px] text-muted-foreground">
            Modded DPS is in the Exalted Weapon section below (not the base damage row above).
          </p>
        </div>
      )}

      {footer}
    </AbilityCardShell>
  );
}

export function HelminthSubsumeButton({
  onClick,
  label = "Subsume Helminth",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-[11px] font-medium text-emerald-900 transition-colors hover:border-emerald-600/50 hover:bg-emerald-500/20 sm:min-h-9 sm:px-2.5 sm:py-1.5 dark:text-emerald-300 dark:hover:border-emerald-400/50"
    >
      <RefreshCw className="h-3.5 w-3.5 shrink-0" />
      {label}
    </button>
  );
}

export function HelminthAbilityCard({
  ability,
  stats,
  gameSlot,
  onChange,
  onRemove,
}: {
  ability: HelminthAbility;
  stats: WarframeCalculatedStats | null;
  gameSlot: number;
  onChange: () => void;
  onRemove: () => void;
}) {
  const eff = stats?.abilityEfficiency ?? 1;
  const effectiveCost =
    typeof ability.energyCost === "number" ? scaledAbilityEnergyCost(ability.energyCost, eff) : null;
  const display = { warframeId: undefined, abilityName: ability.name, helminth: true as const };
  const augurPct = stats?.augurEnergyToShieldsPercent ?? 0;

  return (
    <AbilityCardShell slot={gameSlot} variant="helminth" className="flex h-full flex-col">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <AbilitySlotBadge slot={gameSlot} />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight tracking-tight text-emerald-700 dark:text-emerald-400 sm:text-base">
              {ability.name}
            </h3>
            <p className="mt-0.5 text-[10px] text-emerald-800/70 dark:text-emerald-400/70">
              {ability.sourceWarframe ? `Subsumed from ${ability.sourceWarframe}` : "Helminth"}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          {effectiveCost != null && ability.energyCost != null && (
            <AbilityEnergyChip baseCost={ability.energyCost} effectiveCost={effectiveCost} />
          )}
          {augurPct > 0 && effectiveCost != null && (
            <AugurShieldsOnCast energySpent={effectiveCost} convertPercent={augurPct} />
          )}
        </div>
      </div>

      <p className="mb-2 line-clamp-3 text-[11px] leading-snug text-muted-foreground sm:line-clamp-none sm:text-xs sm:leading-relaxed">
        {formatAbilityDescription(ability.description)}
      </p>

      <div className="mb-2">
        <AbilityStatsBlock ability={ability} stats={stats} display={display} />
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-emerald-500/15 pt-3">
        <HelminthSubsumeButton onClick={onChange} label="Change Helminth" />
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex min-h-11 items-center rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] font-medium text-rose-800 transition-colors hover:bg-rose-500/20 sm:min-h-9 sm:px-2.5 sm:py-1.5 dark:text-rose-300"
        >
          Restore ability
        </button>
      </div>
    </AbilityCardShell>
  );
}
