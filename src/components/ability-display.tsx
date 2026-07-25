"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AbilityScaleAttribute } from "@/lib/codex/ability-scaling-registry";
import type { Ability, WarframeCalculatedStats } from "@/lib/types";
import {
  scaleAbilityMiscStats,
  scaledAbilityDamageReduction,
  scaledAbilityDamageBuff,
  scaledAbilityEnergyCost,
  abilityPercentFraction,
  computeArmorScaledPool,
  getArmorPoolInvulnAbsorb,
  computeInfernoRingDps,
  computeImmolationDrAtHeat,
  computeFireBlastArmorStripAtHeat,
  computeFireballHeatDamage,
  computeFireballComboMultiplier,
  computeKineticPlatingDrAtBattery,
  computeRedlineBuffAtBattery,
  computeThermalSunderRedlineArmorStrip,
  computeMassVitrifyEnemyAbsorb,
  computeThuribleEnergyPerKill,
  computeMetamorphosisBonusAtTime,
  computeCovenantCritChance,
  computeVirulenceDamage,
  lerpBatteryValue,
  lerpBatteryMaxStat,
  type AbilityDisplayContext,
} from "@/lib/codex/ability-misc-stats";
import { SimSlider } from "@/components/stats/stat-primitives";
import { Zap, Sparkles } from "lucide-react";

export type AbilityScaleHint = AbilityScaleAttribute;

const SLOT_STYLES: Record<number, { border: string; badge: string; glow: string }> = {
  1: {
    border: "border-l-orange-500/70",
    badge: "bg-orange-500/15 text-orange-400 ring-orange-500/30",
    glow: "shadow-[inset_3px_0_12px_-4px_rgba(249,115,22,0.35)]",
  },
  2: {
    border: "border-l-cyan-500/70",
    badge: "bg-cyan-500/15 text-cyan-400 ring-cyan-500/30",
    glow: "shadow-[inset_3px_0_12px_-4px_rgba(34,211,238,0.35)]",
  },
  3: {
    border: "border-l-violet-500/70",
    badge: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
    glow: "shadow-[inset_3px_0_12px_-4px_rgba(139,92,246,0.35)]",
  },
  4: {
    border: "border-l-amber-400/80",
    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/40",
    glow: "shadow-[inset_3px_0_12px_-4px_rgba(251,191,36,0.4)]",
  },
};

const SCALE_BADGE: Record<AbilityScaleHint, { label: string; className: string }> = {
  strength: { label: "STR", className: "bg-rose-500/15 text-rose-400 ring-rose-500/25" },
  duration: { label: "DUR", className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25" },
  range: { label: "RNG", className: "bg-sky-500/15 text-sky-400 ring-sky-500/25" },
  efficiency: { label: "EFF", className: "bg-amber-500/15 text-amber-300 ring-amber-500/25" },
};

export function getSlotStyle(slot: number) {
  return SLOT_STYLES[slot] ?? SLOT_STYLES[1];
}

export function AbilityScaleBadge({
  scale,
  className,
}: {
  scale: AbilityScaleHint;
  className?: string;
}) {
  const cfg = SCALE_BADGE[scale];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1 py-px text-[9px] font-bold tracking-wide ring-1",
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}

export function AbilitySlotBadge({ slot }: { slot: number }) {
  const style = getSlotStyle(slot);
  return (
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ring-1",
        style.badge,
      )}
    >
      {slot}
    </span>
  );
}

export function AbilityFormBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">
      {label}
    </span>
  );
}

export function AbilityEnergyChip({
  baseCost,
  effectiveCost,
  className,
}: {
  baseCost: number;
  effectiveCost: number;
  className?: string;
}) {
  const modified = Math.abs(effectiveCost - baseCost) > 0.5;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1",
        modified
          ? "bg-blue-500/10 text-blue-300 ring-blue-500/25"
          : "bg-muted/60 text-muted-foreground ring-border/50",
        className,
      )}
    >
      <Zap className={cn("h-3 w-3", modified ? "text-blue-400" : "text-muted-foreground")} />
      <span className={cn("text-xs font-mono font-semibold", modified && "text-blue-300")}>
        {modified ? effectiveCost.toFixed(0) : baseCost}
      </span>
      {modified && (
        <span className="text-[10px] font-mono text-muted-foreground/50 line-through">{baseCost}</span>
      )}
    </div>
  );
}

export function AbilityDamageTypeChip({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-orange-500/25 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-300">
      <Sparkles className="h-3 w-3 opacity-70" />
      {type}
    </span>
  );
}

export function AbilityStatSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="flex items-center gap-2 pb-1 pt-1.5">
        <span className="h-px flex-1 bg-gradient-to-r from-border/80 to-transparent" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/80">
          {title}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-border/80 to-transparent" />
      </div>
      {children}
    </div>
  );
}

export function AbilityStatRow({
  label,
  baseValue,
  modifiedValue,
  unit = "",
  isModified,
  isPositive,
  scaleHint,
  compact = false,
  title,
}: {
  label: string;
  baseValue: string;
  modifiedValue: string;
  unit?: string;
  isModified: boolean;
  isPositive: boolean;
  scaleHint?: AbilityScaleHint;
  compact?: boolean;
  /** Hover tip (e.g. exalted dual-display caveat). */
  title?: string;
}) {
  const display = isModified ? modifiedValue : baseValue;
  return (
    <div
      title={title}
      className={cn(
        "group flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/40",
        compact ? "py-0.5" : "py-1",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {scaleHint && <AbilityScaleBadge scale={scaleHint} />}
        <span
          className={cn(
            "text-muted-foreground",
            compact ? "text-[10px]" : "text-[11px]",
          )}
        >
          {label}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {isModified && (
          <span
            className={cn(
              "font-mono text-muted-foreground/45 line-through",
              compact ? "text-[10px]" : "text-[11px]",
            )}
          >
            {baseValue}
            {unit}
          </span>
        )}
        <span
          className={cn(
            "rounded-md bg-muted/50 px-1.5 py-0.5 font-mono font-semibold ring-1 ring-border/40",
            compact ? "text-[10px]" : "text-[11px]",
            isModified && (isPositive ? "text-emerald-400 ring-emerald-500/20 bg-emerald-500/10" : "text-rose-400 ring-rose-500/20 bg-rose-500/10"),
            !isModified && "text-foreground",
          )}
        >
          {display}
          {unit}
        </span>
      </div>
    </div>
  );
}

export function AbilityCardShell({
  slot,
  children,
  variant = "default",
  className,
}: {
  slot: number;
  children: React.ReactNode;
  variant?: "default" | "helminth";
  className?: string;
}) {
  const style = getSlotStyle(slot);
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/20",
        "border-l-[3px] shadow-sm transition-shadow hover:shadow-md",
        variant === "default" ? cn(style.border, style.glow) : "border-l-emerald-500/70 shadow-[inset_3px_0_12px_-4px_rgba(52,211,153,0.25)]",
        variant === "helminth" && "from-emerald-500/5 via-card to-card ring-1 ring-emerald-500/20",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
      <div className="relative flex h-full flex-col p-4">{children}</div>
    </div>
  );
}

export function AbilitiesSectionHeader({
  formLabel,
}: {
  formLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h2 className="text-sm font-semibold tracking-wide text-foreground">
          Abilities
          {formLabel && (
            <span className="ml-2 font-normal text-primary">{formLabel}</span>
          )}
        </h2>
        <p className="text-[10px] text-muted-foreground">
          Stats update with your current build · one Helminth subsume per loadout
        </p>
      </div>
    </div>
  );
}

type AbilityStatSource = Pick<
  Ability,
  | "energyCost"
  | "damage"
  | "directDamage"
  | "aoeDamage"
  | "damagePerSecond"
  | "range"
  | "duration"
  | "radius"
  | "health"
  | "armor"
  | "shield"
  | "damageReduction"
  | "damageBuff"
  | "statusChance"
  | "castTime"
  | "cooldown"
  | "chainRange"
  | "chainLinks"
  | "maxTargets"
  | "miscStats"
>;

export function AbilityStatsBlock({
  ability,
  stats,
  display,
  compact = false,
  /** When set, Damage row is unmodded wiki×STR — modded DPS lives on the exalted weapon panel. */
  hasExaltedWeapon = false,
}: {
  ability: AbilityStatSource;
  stats: WarframeCalculatedStats | null;
  display: AbilityDisplayContext;
  compact?: boolean;
  hasExaltedWeapon?: boolean;
}) {
  const str = stats?.abilityStrength ?? 1;
  const dur = stats?.abilityDuration ?? 1;
  const rng = stats?.abilityRange ?? 1;
  const eff = stats?.abilityEfficiency ?? 1;
  const poolAbsorb = getArmorPoolInvulnAbsorb(display.abilityName, ability.miscStats);
  const [invulnAbsorbK, setInvulnAbsorbK] = useState(0);
  const absorbedDamage = poolAbsorb ? invulnAbsorbK * 1000 : 0;
  const poolAbsorbOpts = poolAbsorb
    ? {
        absorbedDamage,
        absorbMode: poolAbsorb.mode,
        absorptionMultiplier: poolAbsorb.absorptionMultiplier,
      }
    : undefined;
  const hasMassVitrifyAbsorb = display.abilityName === "Mass Vitrify";
  const [vitrifyEnemies, setVitrifyEnemies] = useState(0);
  const [vitrifyEnemyEhpK, setVitrifyEnemyEhpK] = useState(0);
  const thuribleConvert = Number(ability.miscStats?.energyConvert);
  const thuribleHsMult = Number(ability.miscStats?.headshotMultiplier);
  const hasThuribleEpk =
    display.abilityName === "Thurible" &&
    Number.isFinite(thuribleConvert) &&
    thuribleConvert > 0;
  const [thuribleChannel, setThuribleChannel] = useState(
    typeof ability.energyCost === "number" ? ability.energyCost : 25,
  );
  const hasMetamorphosisDecay = display.abilityName === "Metamorphosis";
  const [metaElapsedSec, setMetaElapsedSec] = useState(0);
  const metaDurationSec = Math.max(0, (ability.duration ?? 25) * dur);
  const hasCovenantCrit =
    display.abilityName === "Covenant" &&
    typeof ability.miscStats?.baseCriticalChance === "number";
  const [covenantAbsorbK, setCovenantAbsorbK] = useState(0);
  const hasVirulenceMutation =
    display.abilityName === "Virulence" && typeof ability.damage === "number";
  const [mutationStacks, setMutationStacks] = useState(0);
  const maxHeatEnergyCost = Number(ability.miscStats?.maxHeatEnergyCost);
  const hasHeatEnergyLerp =
    display.abilityName === "Fire Blast" &&
    typeof ability.energyCost === "number" &&
    Number.isFinite(maxHeatEnergyCost) &&
    maxHeatEnergyCost > 0;
  const minRingDps = Number(ability.miscStats?.minRingDamagePerSecond);
  const hasInfernoRingHeat =
    display.abilityName === "Inferno" && Number.isFinite(minRingDps) && minRingDps > 0;
  const hasImmolationDrHeat = display.abilityName === "Immolation";
  const hasFireBlastStripHeat =
    display.abilityName === "Fire Blast" &&
    typeof ability.miscStats?.armorStrip === "number";
  const fireballArea = Number(ability.miscStats?.areaDamage);
  const hasFireballHeat =
    display.abilityName === "Fireball" &&
    typeof ability.damage === "number" &&
    Number.isFinite(fireballArea) &&
    fireballArea > 0;
  const usesImmolationHeat =
    hasHeatEnergyLerp ||
    hasInfernoRingHeat ||
    hasImmolationDrHeat ||
    hasFireBlastStripHeat ||
    hasFireballHeat;
  const [immolationHeatPct, setImmolationHeatPct] = useState(0);
  const heatT = Math.min(1, Math.max(0, immolationHeatPct / 100));
  const [fireballPriorCasts, setFireballPriorCasts] = useState(0);
  const hasKineticPlatingBattery = display.abilityName === "Kinetic Plating";
  const sunderStatusMin = Number(ability.miscStats?.statusDurationMin);
  const sunderStatusMax = Number(ability.miscStats?.statusDurationMax);
  const sunderHeatMax = Number(ability.aoeDamage ?? ability.miscStats?.heatDamage);
  const hasThermalSunderBattery =
    display.abilityName === "Thermal Sunder" &&
    !display.helminth &&
    typeof ability.damage === "number" &&
    Number.isFinite(sunderHeatMax) &&
    sunderHeatMax > 0 &&
    Number.isFinite(sunderStatusMin) &&
    Number.isFinite(sunderStatusMax) &&
    sunderStatusMax > sunderStatusMin;
  const hasRedlineBattery = display.abilityName === "Redline";
  const usesBattery =
    hasKineticPlatingBattery || hasThermalSunderBattery || hasRedlineBattery;
  const [batteryPct, setBatteryPct] = useState(
    hasKineticPlatingBattery || hasRedlineBattery || hasThermalSunderBattery ? 80 : 0,
  );
  const batteryT = Math.min(1, Math.max(0, batteryPct / 100));

  const scaledMisc = ability.miscStats
    ? scaleAbilityMiscStats(
        ability.miscStats,
        { strength: str, duration: dur, range: rng, efficiency: eff },
        display,
      )
    : [];

  const scaledDr =
    ability.damageReduction != null && ability.damageReduction > 0
      ? scaledAbilityDamageReduction(ability.damageReduction, str, display, ability.miscStats)
      : null;
  const scaledBuff =
    ability.damageBuff != null && ability.damageBuff > 0
      ? scaledAbilityDamageBuff(ability.damageBuff, str, display)
      : null;

  const hasDamage =
    (ability.damage != null && ability.damage > 0) ||
    (ability.directDamage != null && ability.directDamage > 0) ||
    (ability.aoeDamage != null && ability.aoeDamage > 0) ||
    (ability.damagePerSecond != null && ability.damagePerSecond > 0) ||
    scaledBuff != null;

  const hasDimensions =
    ability.range != null ||
    ability.duration != null ||
    ability.radius != null ||
    ability.chainRange != null ||
    ability.chainLinks != null ||
    ability.maxTargets != null;

  const hasDefense =
    (ability.health != null && ability.health > 0) ||
    (ability.armor != null && ability.armor > 0) ||
    (ability.shield != null && ability.shield > 0) ||
    scaledDr != null ||
    (ability.statusChance != null && ability.statusChance > 0);

  const hasTiming =
    (ability.castTime != null && ability.castTime > 0) ||
    (ability.cooldown != null && ability.cooldown > 0);

  const hasAny =
    hasDamage || hasDimensions || hasDefense || hasTiming || scaledMisc.length > 0;

  if (!hasAny) return null;

  const rows: React.ReactNode[] = [];

  if (hasFireballHeat && ability.damage != null) {
    const combo = computeFireballComboMultiplier(fireballPriorCasts, heatT);
    const comboActive = heatT > 0 || fireballPriorCasts > 0;
    const baseHit = computeFireballHeatDamage(ability.damage, heatT, 1, fireballPriorCasts);
    const scaledHit = computeFireballHeatDamage(ability.damage, heatT, str, fireballPriorCasts);
    const baseAoe = computeFireballHeatDamage(fireballArea, heatT, 1, fireballPriorCasts);
    const scaledAoe = computeFireballHeatDamage(fireballArea, heatT, str, fireballPriorCasts);
    rows.push(
      <AbilityStatRow
        key="damage"
        compact={compact}
        label={comboActive ? `Damage (×${combo} combo)` : "Damage"}
        baseValue={baseHit.toFixed(0)}
        modifiedValue={scaledHit.toFixed(0)}
        isModified={str !== 1 || comboActive}
        isPositive={str > 1 || comboActive}
        scaleHint="strength"
      />,
    );
    rows.push(
      <AbilityStatRow
        key="fireball-aoe"
        compact={compact}
        label={comboActive ? `AoE dmg (×${combo} combo)` : "AoE dmg"}
        baseValue={baseAoe.toFixed(0)}
        modifiedValue={scaledAoe.toFixed(0)}
        isModified={str !== 1 || comboActive}
        isPositive={str > 1 || comboActive}
        scaleHint="strength"
      />,
    );
  } else if (hasVirulenceMutation && ability.damage != null) {
    const baseHit = computeVirulenceDamage(ability.damage, 1, mutationStacks);
    const scaledHit = computeVirulenceDamage(ability.damage, str, mutationStacks);
    const fieldBase = ability.damage / 2; // wiki lingering Viral DPS = half impact base
    const baseField = computeVirulenceDamage(fieldBase, 1, mutationStacks);
    const scaledField = computeVirulenceDamage(fieldBase, str, mutationStacks);
    rows.push(
      <AbilityStatRow
        key="damage"
        compact={compact}
        label={mutationStacks > 0 ? "Damage (at Mutation)" : "Damage"}
        baseValue={baseHit.toFixed(0)}
        modifiedValue={scaledHit.toFixed(0)}
        isModified={str !== 1 || mutationStacks > 0}
        isPositive={str > 1 || mutationStacks > 0}
        scaleHint="strength"
      />,
    );
    rows.push(
      <AbilityStatRow
        key="virulence-field"
        compact={compact}
        label={mutationStacks > 0 ? "Field DPS (at Mutation)" : "Field DPS"}
        baseValue={baseField.toFixed(0)}
        modifiedValue={scaledField.toFixed(0)}
        isModified={str !== 1 || mutationStacks > 0}
        isPositive={str > 1 || mutationStacks > 0}
        scaleHint="strength"
      />,
    );
  } else if (hasThermalSunderBattery && ability.damage != null) {
    const baseCold = lerpBatteryMaxStat(ability.damage, batteryT);
    const scaledCold = baseCold * str;
    const baseHeat = lerpBatteryMaxStat(sunderHeatMax, batteryT);
    const scaledHeat = baseHeat * str;
    rows.push(
      <AbilityStatRow
        key="damage"
        compact={compact}
        label="Cold Damage (at Battery)"
        baseValue={baseCold.toFixed(0)}
        modifiedValue={scaledCold.toFixed(0)}
        isModified={str !== 1 || batteryT > 0}
        isPositive={str > 1 || batteryT > 0}
        scaleHint="strength"
      />,
    );
    rows.push(
      <AbilityStatRow
        key="sunder-heat"
        compact={compact}
        label="Heat Damage (at Battery)"
        baseValue={baseHeat.toFixed(0)}
        modifiedValue={scaledHeat.toFixed(0)}
        isModified={str !== 1 || batteryT > 0}
        isPositive={str > 1 || batteryT > 0}
        scaleHint="strength"
      />,
    );
  } else if (ability.damage != null && ability.damage > 0) {
    rows.push(
      <AbilityStatRow
        key="damage"
        compact={compact}
        label={hasExaltedWeapon ? "Base damage (unmodded)" : "Damage"}
        baseValue={ability.damage.toFixed(0)}
        modifiedValue={(ability.damage * str).toFixed(0)}
        isModified={str !== 1}
        isPositive={str > 1}
        scaleHint="strength"
        title={
          hasExaltedWeapon
            ? "Wiki ability base × Ability Strength only — not modded. Use Exalted Weapon DPS below as the source of truth."
            : undefined
        }
      />,
    );
  }
  if (hasInfernoRingHeat) {
    const baseRing = computeInfernoRingDps(minRingDps, heatT, 1);
    const scaledRing = computeInfernoRingDps(minRingDps, heatT, str);
    rows.push(
      <AbilityStatRow
        key="inferno-ring-dps"
        compact={compact}
        label={heatT > 0 ? "Ring DPS (at Heat)" : "Ring DPS (Min Heat)"}
        baseValue={baseRing.toFixed(0)}
        modifiedValue={scaledRing.toFixed(0)}
        isModified={str !== 1 || heatT > 0}
        isPositive={str > 1 || heatT > 0}
        scaleHint="strength"
      />,
    );
  } else if (ability.damagePerSecond != null && ability.damagePerSecond > 0) {
    rows.push(
      <AbilityStatRow
        key="dps"
        compact={compact}
        label="Damage/s"
        baseValue={ability.damagePerSecond.toFixed(0)}
        modifiedValue={(ability.damagePerSecond * str).toFixed(0)}
        isModified={str !== 1}
        isPositive={str > 1}
        scaleHint="strength"
      />,
    );
  }
  if (ability.directDamage != null && ability.directDamage > 0) {
    rows.push(
      <AbilityStatRow
        key="direct"
        compact={compact}
        label="Direct dmg"
        baseValue={ability.directDamage.toFixed(0)}
        modifiedValue={(ability.directDamage * str).toFixed(0)}
        isModified={str !== 1}
        isPositive={str > 1}
        scaleHint="strength"
      />,
    );
  }
  if (
    !hasThermalSunderBattery &&
    ability.aoeDamage != null &&
    ability.aoeDamage > 0
  ) {
    rows.push(
      <AbilityStatRow
        key="aoe"
        compact={compact}
        label="AoE dmg"
        baseValue={ability.aoeDamage.toFixed(0)}
        modifiedValue={(ability.aoeDamage * str).toFixed(0)}
        isModified={str !== 1}
        isPositive={str > 1}
        scaleHint="strength"
      />,
    );
  }
  if (scaledBuff) {
    rows.push(
      <AbilityStatRow
        key="buff"
        compact={compact}
        label="Dmg Buff"
        baseValue={(abilityPercentFraction(ability.damageBuff!) * 100).toFixed(0)}
        modifiedValue={(scaledBuff.value * 100).toFixed(0)}
        unit="%"
        isModified={scaledBuff.modified}
        isPositive={str >= 1}
        scaleHint="strength"
      />,
    );
  }
  if (ability.range != null) {
    rows.push(
      <AbilityStatRow
        key="range"
        compact={compact}
        label="Range"
        baseValue={ability.range.toFixed(1)}
        modifiedValue={(ability.range * rng).toFixed(1)}
        unit="m"
        isModified={rng !== 1}
        isPositive={rng > 1}
        scaleHint="range"
      />,
    );
  }
  if (ability.duration != null) {
    rows.push(
      <AbilityStatRow
        key="duration"
        compact={compact}
        label="Duration"
        baseValue={ability.duration.toFixed(1)}
        modifiedValue={(ability.duration * dur).toFixed(1)}
        unit="s"
        isModified={dur !== 1}
        isPositive={dur > 1}
        scaleHint="duration"
      />,
    );
  }
  if (ability.radius != null) {
    rows.push(
      <AbilityStatRow
        key="radius"
        compact={compact}
        label="Radius"
        baseValue={ability.radius.toFixed(1)}
        modifiedValue={(ability.radius * rng).toFixed(1)}
        unit="m"
        isModified={rng !== 1}
        isPositive={rng > 1}
        scaleHint="range"
      />,
    );
  }
  if (ability.chainRange != null && ability.chainRange > 0) {
    rows.push(
      <AbilityStatRow
        key="chain-range"
        compact={compact}
        label="Chain range"
        baseValue={ability.chainRange.toFixed(1)}
        modifiedValue={(ability.chainRange * rng).toFixed(1)}
        unit="m"
        isModified={rng !== 1}
        isPositive={rng > 1}
        scaleHint="range"
      />,
    );
  }
  if (ability.chainLinks != null && ability.chainLinks > 0) {
    rows.push(
      <AbilityStatRow
        key="chain-links"
        compact={compact}
        label="Chain links"
        baseValue={String(ability.chainLinks)}
        modifiedValue={String(ability.chainLinks)}
        isModified={false}
        isPositive
      />,
    );
  }
  if (ability.maxTargets != null && ability.maxTargets > 0) {
    rows.push(
      <AbilityStatRow
        key="max-targets"
        compact={compact}
        label="Max targets"
        baseValue={String(ability.maxTargets)}
        modifiedValue={String(ability.maxTargets)}
        isModified={false}
        isPositive
      />,
    );
  }
  if (ability.health != null && ability.health > 0) {
    // Snow Globe / Tectonics: base HP is a formula input; outer STR on armor-scaled pool.
    const isArmorPoolHealth =
      display.abilityName === "Snow Globe" || display.abilityName === "Tectonics";
    rows.push(
      <AbilityStatRow
        key="health"
        compact={compact}
        label={isArmorPoolHealth ? "Base Health" : "Health"}
        baseValue={ability.health.toFixed(0)}
        modifiedValue={
          isArmorPoolHealth ? ability.health.toFixed(0) : (ability.health * str).toFixed(0)
        }
        isModified={!isArmorPoolHealth && str !== 1}
        isPositive={str > 1}
        scaleHint={isArmorPoolHealth ? undefined : "strength"}
      />,
    );
    const poolMult = Number(ability.miscStats?.armorMultiplier);
    if (
      isArmorPoolHealth &&
      stats != null &&
      Number.isFinite(poolMult) &&
      poolMult > 0
    ) {
      const unscaled = computeArmorScaledPool(
        ability.health,
        poolMult,
        stats.totalArmor,
        1,
        poolAbsorbOpts,
      );
      const scaled = computeArmorScaledPool(
        ability.health,
        poolMult,
        stats.totalArmor,
        str,
        poolAbsorbOpts,
      );
      rows.push(
        <AbilityStatRow
          key={`${display.abilityName}-initialHealth`}
          compact={compact}
          label={absorbedDamage > 0 ? "Health (w/ Absorb)" : "Initial Health"}
          baseValue={unscaled.toFixed(0)}
          modifiedValue={scaled.toFixed(0)}
          isModified={str !== 1 || absorbedDamage > 0}
          isPositive={str > 1 || absorbedDamage > 0}
          scaleHint="strength"
        />,
      );
    }
  }
  if (ability.armor != null && ability.armor > 0) {
    const isIronSkin = display.abilityName === "Iron Skin";
    // Iron Skin: base Overguard is a formula input; outer STR applies on the armor-scaled pool.
    rows.push(
      <AbilityStatRow
        key="armor"
        compact={compact}
        label={isIronSkin ? "Base Overguard" : "Armor"}
        baseValue={ability.armor.toFixed(0)}
        modifiedValue={
          isIronSkin ? ability.armor.toFixed(0) : (ability.armor * str).toFixed(0)
        }
        isModified={!isIronSkin && str !== 1}
        isPositive={str > 1}
        scaleHint={isIronSkin ? undefined : "strength"}
      />,
    );
    const skinMult = Number(ability.miscStats?.armorMultiplier);
    if (
      isIronSkin &&
      stats != null &&
      Number.isFinite(skinMult) &&
      skinMult > 0
    ) {
      const unscaled = computeArmorScaledPool(
        ability.armor,
        skinMult,
        stats.totalArmor,
        1,
        poolAbsorbOpts,
      );
      const scaled = computeArmorScaledPool(
        ability.armor,
        skinMult,
        stats.totalArmor,
        str,
        poolAbsorbOpts,
      );
      rows.push(
        <AbilityStatRow
          key="ironSkinOverguard"
          compact={compact}
          label={absorbedDamage > 0 ? "Overguard (w/ Absorb)" : "Initial Overguard"}
          baseValue={unscaled.toFixed(0)}
          modifiedValue={scaled.toFixed(0)}
          isModified={str !== 1 || absorbedDamage > 0}
          isPositive={str > 1 || absorbedDamage > 0}
          scaleHint="strength"
        />,
      );
    }
  }
  if (ability.shield != null && ability.shield > 0) {
    rows.push(
      <AbilityStatRow
        key="shield"
        compact={compact}
        label="Shield"
        baseValue={ability.shield.toFixed(0)}
        modifiedValue={(ability.shield * str).toFixed(0)}
        isModified={str !== 1}
        isPositive={str > 1}
        scaleHint="strength"
      />,
    );
  }
  if (scaledDr) {
    if (hasImmolationDrHeat) {
      const initialDr = Number(ability.miscStats?.initialDamageReduction ?? 0.4);
      const maxCap = Number(ability.miscStats?.drCap ?? 0.9);
      const baseDr = computeImmolationDrAtHeat(heatT, 1, {
        initialDr,
        maxDr: abilityPercentFraction(ability.damageReduction!),
        maxCap,
      });
      const scaledHeatDr = computeImmolationDrAtHeat(heatT, str, {
        initialDr,
        maxDr: abilityPercentFraction(ability.damageReduction!),
        maxCap,
      });
      rows.push(
        <AbilityStatRow
          key="dr"
          compact={compact}
          label={heatT > 0 ? "Dmg Reduction (at Heat)" : "Dmg Reduction (0% Heat)"}
          baseValue={(baseDr * 100).toFixed(0)}
          modifiedValue={(scaledHeatDr * 100).toFixed(0)}
          unit="%"
          isModified={str !== 1 || heatT > 0}
          isPositive={str >= 1 || heatT > 0}
          scaleHint="strength"
        />,
      );
      // Keep max-heat DR visible as reference when not already at 100% heat
      if (heatT < 1) {
        rows.push(
          <AbilityStatRow
            key="dr-max-heat"
            compact={compact}
            label="Dmg Reduction (Max Heat)"
            baseValue={(abilityPercentFraction(ability.damageReduction!) * 100).toFixed(0)}
            modifiedValue={(scaledDr.value * 100).toFixed(0)}
            unit="%"
            isModified={scaledDr.modified}
            isPositive={str >= 1}
            scaleHint="strength"
          />,
        );
      }
    } else if (hasKineticPlatingBattery) {
      const minDr = Number(ability.miscStats?.minDamageReduction ?? 0.2);
      const emptyCap = Number(ability.miscStats?.emptyBatteryDrCap ?? 0.5);
      const fullCap = Number(ability.miscStats?.drCap ?? 1);
      const opts = {
        minDr,
        maxDr: abilityPercentFraction(ability.damageReduction!),
        emptyCap,
        fullCap,
      };
      const baseDr = computeKineticPlatingDrAtBattery(batteryT, 1, opts);
      const scaledBatteryDr = computeKineticPlatingDrAtBattery(batteryT, str, opts);
      rows.push(
        <AbilityStatRow
          key="dr"
          compact={compact}
          label="Dmg Reduction (at Battery)"
          baseValue={(baseDr * 100).toFixed(0)}
          modifiedValue={(scaledBatteryDr * 100).toFixed(0)}
          unit="%"
          isModified={str !== 1 || batteryT !== 0}
          isPositive={str >= 1 || batteryT > 0}
          scaleHint="strength"
        />,
      );
    } else {
      rows.push(
        <AbilityStatRow
          key="dr"
          compact={compact}
          label="Dmg Reduction"
          baseValue={(abilityPercentFraction(ability.damageReduction!) * 100).toFixed(0)}
          modifiedValue={(scaledDr.value * 100).toFixed(0)}
          unit="%"
          isModified={scaledDr.modified}
          isPositive={str >= 1}
          scaleHint="strength"
        />,
      );
    }
  }
  if (ability.statusChance != null && ability.statusChance > 0) {
    rows.push(
      <AbilityStatRow
        key="status"
        compact={compact}
        label="Status"
        baseValue={(ability.statusChance * 100).toFixed(0)}
        modifiedValue={Math.min(100, ability.statusChance * str * 100).toFixed(0)}
        unit="%"
        isModified={str !== 1}
        isPositive={str >= 1}
        scaleHint="strength"
      />,
    );
  }
  if (ability.castTime != null && ability.castTime > 0) {
    rows.push(
      <AbilityStatRow
        key="cast"
        compact={compact}
        label="Cast Time"
        baseValue={ability.castTime.toFixed(1)}
        modifiedValue={ability.castTime.toFixed(1)}
        unit="s"
        isModified={false}
        isPositive
      />,
    );
  }
  if (ability.cooldown != null && ability.cooldown > 0) {
    rows.push(
      <AbilityStatRow
        key="cooldown"
        compact={compact}
        label="Cooldown"
        baseValue={ability.cooldown.toFixed(1)}
        modifiedValue={ability.cooldown.toFixed(1)}
        unit="s"
        isModified={false}
        isPositive
      />,
    );
  }
  for (const line of scaledMisc) {
    // Heat/battery-aware rows replace these misc lines.
    if (hasFireBlastStripHeat && line.label === "Armor Strip") continue;
    if (hasFireballHeat && line.label === "Area Damage") continue;
    if (hasKineticPlatingBattery && line.label === "Min Damage Reduction") continue;
    if (
      hasThermalSunderBattery &&
      (line.label === "Status Duration Min" ||
        line.label === "Status Duration Max" ||
        line.label === "Heat Damage")
    ) {
      continue;
    }
    if (
      hasRedlineBattery &&
      (line.label === "Fire Rate Buff" ||
        line.label === "Attack Speed Buff" ||
        line.label === "Reload Buff" ||
        line.label === "Cast Speed Buff")
    ) {
      continue;
    }
    if (
      hasMetamorphosisDecay &&
      (line.label === "Night Armor" ||
        line.label === "Night Shields" ||
        line.label === "Day Damage Bonus" ||
        line.label === "Day Speed Bonus")
    ) {
      continue;
    }
    if (
      hasCovenantCrit &&
      (line.label === "Base Critical Chance" ||
        line.label === "Crit Chance per 100 Damage" ||
        line.label === "Headshot Multiplier" ||
        line.label === "Bodyshot Crit Chance Cap" ||
        line.label === "Headshot Crit Chance Cap")
    ) {
      continue;
    }
    rows.push(
      <AbilityStatRow
        key={line.label}
        compact={compact}
        label={line.label}
        baseValue={line.base}
        modifiedValue={line.scaled}
        isModified={line.modified}
        isPositive={line.positive ?? true}
        scaleHint={line.scaleAttr}
      />,
    );
  }
  // wiki armor-scaled pools stored in misc: (base + armorMult × totalArmor) × STR
  // Storm Shroud: no armor term — (base + absorbed × absorbMult) × STR
  const miscArmorPool: Record<
    string,
    { baseKey: string; label: string; requiresArmorMult?: boolean }
  > = {
    "Warding Halo": { baseKey: "haloHealth", label: "Initial Health" },
    "Shield Maiden": { baseKey: "shieldHealth", label: "Initial Health" },
    "Mass Vitrify": { baseKey: "segmentHealth", label: "Initial Segment Health" },
    "Storm Shroud": {
      baseKey: "shroudHealth",
      label: "Initial Health",
      requiresArmorMult: false,
    },
  };
  const miscPool = miscArmorPool[display.abilityName];
  if (miscPool && stats != null && ability.miscStats) {
    const poolBase = Number(ability.miscStats[miscPool.baseKey]);
    const poolMult = Number(ability.miscStats.armorMultiplier);
    const needsArmor = miscPool.requiresArmorMult !== false;
    const armorMult = needsArmor ? poolMult : Number.isFinite(poolMult) ? poolMult : 0;
    const armorOk = needsArmor
      ? Number.isFinite(poolMult) && poolMult > 0
      : true;
    if (Number.isFinite(poolBase) && poolBase > 0 && armorOk) {
      const armorForPool = needsArmor ? stats.totalArmor : 0;
      let unscaled = computeArmorScaledPool(
        poolBase,
        armorMult,
        armorForPool,
        1,
        poolAbsorbOpts,
      );
      let scaled = computeArmorScaledPool(
        poolBase,
        armorMult,
        armorForPool,
        str,
        poolAbsorbOpts,
      );
      let withEnemyAbsorb = false;
      if (hasMassVitrifyAbsorb && vitrifyEnemies > 0) {
        const enemyEhp = vitrifyEnemyEhpK * 1000;
        const perBase = computeMassVitrifyEnemyAbsorb(armorForPool, 1, enemyEhp, {
          absorbBase: poolBase / armorMult,
          armorMultiplier: armorMult,
        });
        const perScaled = computeMassVitrifyEnemyAbsorb(armorForPool, str, enemyEhp, {
          absorbBase: poolBase / armorMult,
          armorMultiplier: armorMult,
        });
        unscaled += vitrifyEnemies * perBase;
        scaled += vitrifyEnemies * perScaled;
        withEnemyAbsorb = true;
      }
      const withAbsorb = absorbedDamage > 0 || withEnemyAbsorb;
      rows.push(
        <AbilityStatRow
          key={`${display.abilityName}-armorPool`}
          compact={compact}
          label={
            withAbsorb
              ? miscPool.label.replace(/^Initial /, "") + " (w/ Absorb)"
              : miscPool.label
          }
          baseValue={unscaled.toFixed(0)}
          modifiedValue={scaled.toFixed(0)}
          isModified={str !== 1 || withAbsorb}
          isPositive={str > 1 || withAbsorb}
          scaleHint="strength"
        />,
      );
    }
  }
  if (hasHeatEnergyLerp && typeof ability.energyCost === "number") {
    const baseAtHeat = ability.energyCost + (maxHeatEnergyCost - ability.energyCost) * heatT;
    const scaledAtHeat = scaledAbilityEnergyCost(baseAtHeat, eff);
    const fmt = (n: number) =>
      Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1);
    rows.push(
      <AbilityStatRow
        key="fireBlastHeatEnergy"
        compact={compact}
        label="Energy Cost (at Heat)"
        baseValue={fmt(baseAtHeat)}
        modifiedValue={fmt(scaledAtHeat)}
        isModified={eff !== 1 || heatT > 0}
        isPositive={scaledAtHeat <= ability.energyCost}
        scaleHint="efficiency"
      />,
    );
  }
  if (hasFireBlastStripHeat) {
    const baseStrip = computeFireBlastArmorStripAtHeat(heatT, 1);
    const scaledStrip = computeFireBlastArmorStripAtHeat(heatT, str);
    rows.push(
      <AbilityStatRow
        key="fireBlastHeatStrip"
        compact={compact}
        label={heatT > 0 ? "Armor Strip (at Heat)" : "Armor Strip (0% Heat)"}
        baseValue={(baseStrip * 100).toFixed(0)}
        modifiedValue={(scaledStrip * 100).toFixed(0)}
        unit="%"
        isModified={str !== 1 || heatT > 0}
        isPositive={scaledStrip >= baseStrip}
        scaleHint="strength"
      />,
    );
  }
  if (hasThermalSunderBattery) {
    const baseStatus = lerpBatteryValue(sunderStatusMin, sunderStatusMax, batteryT);
    rows.push(
      <AbilityStatRow
        key="thermalSunderStatus"
        compact={compact}
        label="Status Duration (at Battery)"
        baseValue={`${baseStatus.toFixed(1)}s`}
        modifiedValue={`${baseStatus.toFixed(1)}s`}
        isModified={batteryT > 0}
        isPositive={batteryT > 0}
      />,
    );
    const redlineStrip = computeThermalSunderRedlineArmorStrip(batteryT);
    rows.push(
      <AbilityStatRow
        key="thermalSunderRedlineStrip"
        compact={compact}
        label="Blast Strip (Redline)"
        baseValue={(redlineStrip * 100).toFixed(0)}
        modifiedValue={(redlineStrip * 100).toFixed(0)}
        unit="%"
        isModified={batteryT > 0.8}
        isPositive={redlineStrip > 0}
      />,
    );
  }
  if (hasRedlineBattery) {
    const buffDefs: { key: string; label: string; max: number }[] = [
      {
        key: "fireRateBuff",
        label: "Fire Rate (at Battery)",
        max: Number(ability.miscStats?.fireRateBuff ?? 0.75),
      },
      {
        key: "attackSpeedBuff",
        label: "Attack Speed (at Battery)",
        max: Number(ability.miscStats?.attackSpeedBuff ?? 0.4),
      },
      {
        key: "reloadBuff",
        label: "Reload Speed (at Battery)",
        max: Number(ability.miscStats?.reloadBuff ?? 0.5),
      },
      {
        key: "castSpeedBuff",
        label: "Cast Speed (at Battery)",
        max: Number(ability.miscStats?.castSpeedBuff ?? 0.5),
      },
    ];
    for (const buff of buffDefs) {
      if (!Number.isFinite(buff.max) || buff.max <= 0) continue;
      const base = computeRedlineBuffAtBattery(buff.max, batteryT, 1);
      const scaled = computeRedlineBuffAtBattery(buff.max, batteryT, dur);
      rows.push(
        <AbilityStatRow
          key={buff.key}
          compact={compact}
          label={buff.label}
          baseValue={(base * 100).toFixed(0)}
          modifiedValue={(scaled * 100).toFixed(0)}
          unit="%"
          isModified={dur !== 1 || batteryT > 0}
          isPositive={dur >= 1 || batteryT > 0}
          scaleHint="duration"
        />,
      );
    }
  }
  if (hasCovenantCrit && ability.miscStats) {
    const absorbed = covenantAbsorbK * 1000;
    const opts = {
      baseCriticalChance: Number(ability.miscStats.baseCriticalChance),
      critChancePer100Damage: Number(ability.miscStats.critChancePer100Damage),
      headshotMultiplier: Number(ability.miscStats.headshotMultiplier),
      bodyshotCritChanceCap: Number(ability.miscStats.bodyshotCritChanceCap),
      headshotCritChanceCap: Number(ability.miscStats.headshotCritChanceCap),
    };
    const baseCc = computeCovenantCritChance(absorbed, 1, opts);
    const scaledCc = computeCovenantCritChance(absorbed, str, opts);
    const atLabel = absorbed > 0 ? " (at Absorb)" : " (Base)";
    rows.push(
      <AbilityStatRow
        key="covenantBodyCc"
        compact={compact}
        label={`Retaliation CC${atLabel}`}
        baseValue={(baseCc.body * 100).toFixed(1)}
        modifiedValue={(scaledCc.body * 100).toFixed(1)}
        unit="%"
        isModified={str !== 1 || absorbed > 0}
        isPositive={scaledCc.body >= baseCc.body}
        scaleHint="strength"
      />,
    );
    rows.push(
      <AbilityStatRow
        key="covenantHsCc"
        compact={compact}
        label={`Retaliation HS CC${atLabel}`}
        baseValue={(baseCc.headshot * 100).toFixed(1)}
        modifiedValue={(scaledCc.headshot * 100).toFixed(1)}
        unit="%"
        isModified={str !== 1 || absorbed > 0}
        isPositive={scaledCc.headshot >= baseCc.headshot}
        scaleHint="strength"
      />,
    );
  }
  if (hasMetamorphosisDecay && ability.miscStats) {
    const nightArmor = Number(ability.miscStats.nightArmor);
    const nightShields = Number(ability.miscStats.nightShields);
    const dayDmg = Number(ability.miscStats.dayDamageBonus);
    const daySpeed = Number(ability.miscStats.daySpeedBonus);
    const dBase = ability.duration ?? 25;
    const dScaled = metaDurationSec;
    const atLabel = metaElapsedSec > 0 ? " (at Elapsed)" : " (Peak)";
    const metaRows: {
      key: string;
      label: string;
      base: number;
      scaled: number;
      percent?: boolean;
    }[] = [];
    if (Number.isFinite(nightArmor) && nightArmor > 0) {
      metaRows.push({
        key: "metaNightArmor",
        label: `Night Armor${atLabel}`,
        base: computeMetamorphosisBonusAtTime(nightArmor, 1, metaElapsedSec, dBase),
        scaled: computeMetamorphosisBonusAtTime(nightArmor, str, metaElapsedSec, dScaled),
      });
    }
    if (Number.isFinite(nightShields) && nightShields > 0) {
      metaRows.push({
        key: "metaNightShields",
        label: `Night Shields${atLabel}`,
        base: computeMetamorphosisBonusAtTime(nightShields, 1, metaElapsedSec, dBase),
        scaled: computeMetamorphosisBonusAtTime(nightShields, str, metaElapsedSec, dScaled),
      });
    }
    if (Number.isFinite(dayDmg) && dayDmg > 0) {
      metaRows.push({
        key: "metaDayDmg",
        label: `Day Damage${atLabel}`,
        base: computeMetamorphosisBonusAtTime(dayDmg, 1, metaElapsedSec, dBase),
        scaled: computeMetamorphosisBonusAtTime(dayDmg, str, metaElapsedSec, dScaled),
        percent: true,
      });
    }
    if (Number.isFinite(daySpeed) && daySpeed > 0) {
      metaRows.push({
        key: "metaDaySpeed",
        label: `Day Speed${atLabel}`,
        base: computeMetamorphosisBonusAtTime(daySpeed, 1, metaElapsedSec, dBase),
        scaled: computeMetamorphosisBonusAtTime(daySpeed, str, metaElapsedSec, dScaled),
        percent: true,
      });
    }
    for (const r of metaRows) {
      rows.push(
        <AbilityStatRow
          key={r.key}
          compact={compact}
          label={r.label}
          baseValue={
            r.percent ? (r.base * 100).toFixed(1) : r.base.toFixed(0)
          }
          modifiedValue={
            r.percent ? (r.scaled * 100).toFixed(1) : r.scaled.toFixed(0)
          }
          unit={r.percent ? "%" : undefined}
          isModified={str !== 1 || dur !== 1 || metaElapsedSec > 0}
          isPositive={r.scaled >= r.base || metaElapsedSec === 0}
          scaleHint="strength"
        />,
      );
    }
  }
  if (hasThuribleEpk) {
    const baseEpk = computeThuribleEnergyPerKill(thuribleChannel, 1, 1, {
      energyConvert: thuribleConvert,
      headshotMultiplier: Number.isFinite(thuribleHsMult) ? thuribleHsMult : 4,
    });
    const scaledEpk = computeThuribleEnergyPerKill(thuribleChannel, str, eff, {
      energyConvert: thuribleConvert,
      headshotMultiplier: Number.isFinite(thuribleHsMult) ? thuribleHsMult : 4,
    });
    const fmtE = (n: number) => (Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1));
    rows.push(
      <AbilityStatRow
        key="thuribleEpk"
        compact={compact}
        label="Energy / Kill"
        baseValue={fmtE(baseEpk.body)}
        modifiedValue={fmtE(scaledEpk.body)}
        isModified={str !== 1 || eff !== 1 || thuribleChannel !== (ability.energyCost ?? 25)}
        isPositive={scaledEpk.body >= baseEpk.body}
        scaleHint="strength"
      />,
    );
    rows.push(
      <AbilityStatRow
        key="thuribleEpkHs"
        compact={compact}
        label="Energy / Headshot Kill"
        baseValue={fmtE(baseEpk.headshot)}
        modifiedValue={fmtE(scaledEpk.headshot)}
        isModified={str !== 1 || eff !== 1 || thuribleChannel !== (ability.energyCost ?? 25)}
        isPositive={scaledEpk.headshot >= baseEpk.headshot}
        scaleHint="strength"
      />,
    );
  }
  if (ability.miscStats?.channeled === true) {
    rows.push(
      <div key="channeled" className="px-1.5 py-0.5 text-[10px] font-medium text-violet-400">
        Channeled
      </div>,
    );
  }

  return (
    <div
      className={cn(
        "space-y-0.5 rounded-lg bg-muted/20 p-1.5 ring-1 ring-border/30",
        compact && "p-1",
      )}
    >
      {poolAbsorb && (
        <SimSlider
          label="Invuln Absorb (k)"
          value={invulnAbsorbK}
          min={0}
          max={64}
          onChange={setInvulnAbsorbK}
          tooltip={
            poolAbsorb.mode === "inside_strength"
              ? "Damage taken during cast invulnerability. Wiki: (base + armor×mult + absorb×absorbMult) × STR. Halo absorbMult Misc-fixed; Storm Shroud absorbMult also × STR (same form)."
              : "Damage taken during cast invulnerability. Wiki: (base + armor×mult) × STR + absorbed."
          }
        />
      )}
      {hasMassVitrifyAbsorb && (
        <>
          <SimSlider
            label="Crystallized Enemies"
            value={vitrifyEnemies}
            min={0}
            max={24}
            onChange={setVitrifyEnemies}
            tooltip="Each crystallized enemy adds max((320+5×armor)×STR, enemy EHP÷10) to every segment."
          />
          <SimSlider
            label="Enemy HP+Shields (k)"
            value={vitrifyEnemyEhpK}
            min={0}
            max={100}
            onChange={setVitrifyEnemyEhpK}
            tooltip="0 uses the armor floor absorb. Set higher so enemy EHP÷10 can beat the floor (e.g. 30 → 3000)."
          />
        </>
      )}
      {usesImmolationHeat && (
        <SimSlider
          label="Immolation Heat %"
          value={immolationHeatPct}
          min={0}
          max={100}
          onChange={setImmolationHeatPct}
          tooltip={
            hasFireballHeat
              ? "Fireball: heat adds up to +4× to the combo multiplier (first cast ×3 dmg at max heat)."
              : hasInfernoRingHeat
                ? "Inferno Ring DPS = minRing × (1 + heat) × STR (double at max heat)."
                : hasImmolationDrHeat
                  ? "Immolation DR lerps from initial DR cap to max-heat DR cap with heat (wiki formula)."
                  : "Fire Blast: energy lerps 75→25 × EFF; armor strip lerps 50%→100% × STR (capped at heat value)."
          }
        />
      )}
      {hasFireballHeat && (
        <SimSlider
          label="Prior Casts"
          value={fireballPriorCasts}
          min={0}
          max={3}
          onChange={setFireballPriorCasts}
          tooltip="Fireball 1.5s combo window: chain 1×/2×/4×/8× + up to 4× from heat. Dmg = (base÷2)×(combo+1)×STR (wiki: max 5200/1950)."
        />
      )}
      {usesBattery && (
        <SimSlider
          label="Battery %"
          value={batteryPct}
          min={0}
          max={100}
          onChange={setBatteryPct}
          tooltip={
            hasKineticPlatingBattery
              ? "Kinetic Plating DR = MinDR + (MaxDR − MinDR) × battery (wiki; default slider 80%)."
              : hasRedlineBattery
                ? "Redline speed buffs lerp min→max (min=max/5) with battery, then × Ability Duration."
                : "Thermal Sunder: Cold/Heat dmg + status × battery; Blast strip (w/ Redline) 0% at 80% → 100% at full."
          }
        />
      )}
      {hasThuribleEpk && (
        <SimSlider
          label="Energy Channeled"
          value={thuribleChannel}
          min={0}
          max={500}
          onChange={setThuribleChannel}
          tooltip="Thurible: Energy/Kill = 1 + [channel × 15% ÷ (2−EFF)] × STR; headshots ×4 (wiki)."
        />
      )}
      {hasMetamorphosisDecay && (
        <SimSlider
          label="Elapsed (s)"
          value={metaElapsedSec}
          min={0}
          max={Math.max(1, Math.ceil(metaDurationSec))}
          onChange={setMetaElapsedSec}
          tooltip="Metamorphosis bonuses decay linearly to 0 over duration×DUR (wiki)."
        />
      )}
      {hasCovenantCrit && (
        <SimSlider
          label="Absorbed Damage (k)"
          value={covenantAbsorbK}
          min={0}
          max={20}
          onChange={setCovenantAbsorbK}
          tooltip="Covenant Retaliation: CC = (5% + absorb÷100 × 1.5%) × STR; body cap 50%, HS ×4 cap 200%."
        />
      )}
      {hasVirulenceMutation && (
        <SimSlider
          label="Mutation Stacks"
          value={mutationStacks}
          min={0}
          max={300}
          onChange={setMutationStacks}
          tooltip="Virulence: damage = floor(base × STR × (1 + stacks)); field DPS uses half base (wiki)."
        />
      )}
      {rows}
    </div>
  );
}
