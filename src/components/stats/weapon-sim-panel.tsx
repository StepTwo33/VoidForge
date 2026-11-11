"use client";

import { SNIPER_DATA, sniperComboMultiplier } from "@/data/sniper-zoom";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, SlidersHorizontal } from "lucide-react";
import type { CalculatedStats, SetBonusLinkage, SimulationParams, Weapon } from "@/lib/types";
import { storeDamageSimHandoff } from "@/lib/calc/damage-sim-load";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { maxStacksSimParams, paperSimParams } from "@/lib/ui/sim-presets";
import { WeaponSimControls } from "./weapon-sim-controls";
import { HIT_WINDOW_TRIGGERS } from "@/lib/ui/hit-window-triggers";
import type { SimRelevanceKey } from "@/lib/ui/sim-relevance";

export function simSummaryChips(
  simParams: SimulationParams,
  isMelee?: boolean,
  weaponId?: string,
  relevant?: ReadonlySet<SimRelevanceKey>,
  triggerBuckets?: CalculatedStats["triggerBuckets"],
): string[] {
  const chips: string[] = [];
  // Only list switches and stacks that change a number for this build (all of them when unknown).
  const counts = (key: SimRelevanceKey) => !relevant || relevant.has(key);
  const sniper = weaponId ? SNIPER_DATA[weaponId] : undefined;
  if (sniper) {
    const zoom = sniper.zooms[(simParams.sniperZoomLevel ?? 0) - 1];
    if (zoom) chips.push(`${zoom.label} zoom`);
    if ((simParams.sniperComboTier ?? 0) > 0) {
      chips.push(`${sniperComboMultiplier(simParams.sniperComboTier ?? 0)}× shot combo`);
    }
  }
  if (isMelee && simParams.comboCount > 0 && counts("comboCount")) chips.push(`${simParams.comboCount} combo`);
  if (simParams.killStacks > 0 && counts("killStacks")) chips.push(`${simParams.killStacks} kills`);
  if (simParams.statusTypesOnTarget > 0 && counts("statusTypesOnTarget")) chips.push(`${simParams.statusTypesOnTarget} status`);
  if (simParams.arcaneStacks > 0 && counts("arcaneStacks")) chips.push(`${simParams.arcaneStacks} arcane`);
  if (simParams.applyAiming && counts("applyAiming")) chips.push("Aiming");
  if (simParams.applyInvisible && counts("applyInvisible")) chips.push("Invisible");
  if (simParams.applyAbilityCast && counts("applyAbilityCast")) chips.push("Ability cast");
  if (simParams.applyReload && counts("applyReload")) chips.push("Reload");
  if (simParams.applyCrouch && counts("applyCrouch")) chips.push("Crouch");
  if (simParams.applyWallLatch && counts("applyWallLatch")) chips.push("Wall latch");
  if (simParams.applyAirborne && counts("applyAirborne")) chips.push("Airborne");
  if (simParams.applyAimGlide && counts("applyAimGlide")) chips.push("Aim glide");
  if (simParams.applyDistance && counts("applyDistance")) chips.push("Distance");
  for (const t of HIT_WINDOW_TRIGGERS) {
    const used = !relevant || Object.keys(triggerBuckets?.[t.bucket] ?? {}).length > 0;
    if (simParams[t.flag] && used) chips.push(t.label);
  }
  if (simParams.applyTriggerBuffs && counts("applyTriggerBuffs")) chips.push("Other buffs");
  if (simParams.applyYareliCriticalFlow) chips.push("Yareli +200% CC");
  if (simParams.applyZephyrAirborne) chips.push("Zephyr +150% CC");
  if (simParams.applyGarudaDeathsGate) chips.push("Death's Gate");
  if (simParams.applyTenaciousBondCrit === true) chips.push("Tenacious Bond");
  if (simParams.applyReinforcedBondFireRate === true) chips.push("Reinforced Bond");
  if (simParams.targetFaction) chips.push(simParams.targetFaction);
  if (simParams.steelPath) chips.push("Steel Path");
  if (simParams.applyHeadshots) chips.push("Headshot");
  else if (simParams.applyWeakPoints) chips.push("Weak point");
  return chips;
}

export function WeaponSimPanel({
  stats,
  simParams,
  onSimParamsChange,
  weapon,
  isMelee,
  hasConditionals,
  onKillBuffTotal,
  triggerBuffTotal,
  linkage,
  linkedWarframeId,
  linkedCompanionModIds,
  relevantKeys,
}: {
  stats: CalculatedStats;
  simParams: SimulationParams;
  onSimParamsChange: (p: SimulationParams) => void;
  weapon?: Weapon | null;
  isMelee?: boolean;
  hasConditionals: boolean;
  onKillBuffTotal: number;
  triggerBuffTotal: number;
  linkage?: SetBonusLinkage;
  linkedWarframeId?: string;
  linkedCompanionModIds?: string[];
  /** Sim controls that change a number for this build; undefined = show all. */
  relevantKeys?: ReadonlySet<SimRelevanceKey>;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const chips = useMemo(
    () => simSummaryChips(simParams, isMelee, weapon?.id, relevantKeys, stats.triggerBuckets),
    [simParams, isMelee, weapon?.id, relevantKeys, stats.triggerBuckets],
  );
  const isLinkedLoadout = Boolean(linkage);
  const arcaneSources = stats.arcaneStackSources ?? [];
  const arcaneMax = arcaneSources.length > 0 ? Math.max(...arcaneSources.map((a) => a.cap)) : 12;

  const openInDamageSim = () => {
    storeDamageSimHandoff(stats, weapon?.name ?? "Weapon");
    setOpen(false);
    router.push("/damage-simulator?from=builder");
  };

  return (
    <div className="border-b border-border/60 pb-2 mb-1 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
            SIMULATION
          </span>
          {hasConditionals && (
            <span className="text-[9px] text-blue-700 dark:text-blue-400">Conditionals</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSimParamsChange(paperSimParams(simParams))}
            className="min-h-11 rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors pointer-fine:min-h-0 lg:min-h-0"
            title="Turn off all conditional stacks and buffs (paper stats)"
          >
            Paper
          </button>
          <button
            type="button"
            onClick={() =>
              onSimParamsChange(
                maxStacksSimParams(simParams, {
                  isMelee,
                  arcaneMax,
                  linkedLoadout: isLinkedLoadout,
                }),
              )
            }
            className="min-h-11 rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary hover:bg-primary/20 transition-colors pointer-fine:min-h-0 lg:min-h-0"
            title="Max kill, status, combo and arcane stacks, and turn on the named situational switches. Hit location and Other buffs stay as they are."
          >
            Max stacks
          </button>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-md border border-border/80 bg-muted/40 px-1.5 py-0.5 text-[9px] text-muted-foreground"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-muted-foreground leading-snug">
          Default stacks — edit to model mid-fight buffs
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-7 min-h-11 text-[10px]"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal className="size-3" />
          Edit simulation
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 min-h-11 text-[10px] text-muted-foreground"
          onClick={openInDamageSim}
        >
          <ExternalLink className="size-3" />
          Open in Damage Simulator
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="sm:max-w-md w-full gap-0 p-0 flex flex-col"
        >
          <SheetHeader className="border-b border-border shrink-0">
            <SheetTitle className="text-sm">Simulation</SheetTitle>
            <SheetDescription className="text-[11px]">
              Adjust stacks and conditionals for paper DPS.{" "}
              <span className="lg:hidden">Close this sheet to see the updated stats.</span>
              <span className="max-lg:hidden">Weapon stats update live as you change them.</span>
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
            <WeaponSimControls
              stats={stats}
              simParams={simParams}
              onSimParamsChange={onSimParamsChange}
              weapon={weapon}
              isMelee={isMelee}
              hasConditionals={hasConditionals}
              onKillBuffTotal={onKillBuffTotal}
              triggerBuffTotal={triggerBuffTotal}
              linkage={linkage}
              linkedWarframeId={linkedWarframeId}
              linkedCompanionModIds={linkedCompanionModIds}
              relevantKeys={relevantKeys}
            />
          </div>
          <SheetFooter className="border-t border-border shrink-0 sm:flex-col">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-11 w-full justify-center"
              onClick={openInDamageSim}
            >
              <ExternalLink className="size-3.5" />
              Open in Damage Simulator
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
