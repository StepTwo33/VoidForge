"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, SlidersHorizontal } from "lucide-react";
import type { CalculatedStats, SimulationParams, Weapon } from "@/lib/types";
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
import { WeaponSimControls } from "./weapon-sim-controls";

function simSummaryChips(
  simParams: SimulationParams,
  isMelee?: boolean,
): string[] {
  const chips: string[] = [];
  if (isMelee && simParams.comboCount > 0) chips.push(`${simParams.comboCount} combo`);
  if (simParams.killStacks > 0) chips.push(`${simParams.killStacks} kills`);
  if (simParams.statusTypesOnTarget > 0) chips.push(`${simParams.statusTypesOnTarget} status`);
  if (simParams.arcaneStacks > 0) chips.push(`${simParams.arcaneStacks} arcane`);
  if (simParams.targetFaction) chips.push(simParams.targetFaction);
  if (simParams.steelPath) chips.push("Steel Path");
  if (simParams.applyHeadshots) chips.push("Headshots");
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
}: {
  stats: CalculatedStats;
  simParams: SimulationParams;
  onSimParamsChange: (p: SimulationParams) => void;
  weapon?: Weapon | null;
  isMelee?: boolean;
  hasConditionals: boolean;
  onKillBuffTotal: number;
  triggerBuffTotal: number;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const chips = useMemo(
    () => simSummaryChips(simParams, isMelee),
    [simParams, isMelee],
  );

  const openInDamageSim = () => {
    storeDamageSimHandoff(stats, weapon?.name ?? "Weapon");
    setOpen(false);
    router.push("/damage-simulator?from=builder");
  };

  return (
    <div className="border-b border-border/60 pb-2 mb-1 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
          SIMULATION
        </span>
        {hasConditionals && (
          <span className="text-[9px] text-blue-700 dark:text-blue-400">Conditionals</span>
        )}
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
        <p className="text-[10px] text-muted-foreground/70 leading-snug">
          Default stacks — edit to model mid-fight buffs
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-7 text-[10px]"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal className="size-3" />
          Edit simulation
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-7 text-[10px] text-muted-foreground"
          onClick={openInDamageSim}
        >
          <ExternalLink className="size-3" />
          Open in Damage Simulator
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="sm:max-w-md w-full gap-0 p-0 flex flex-col"
        >
          <SheetHeader className="border-b border-border shrink-0">
            <SheetTitle className="text-sm">Simulation</SheetTitle>
            <SheetDescription className="text-[11px]">
              Adjust stacks and conditionals for paper DPS. Stats update live in the sidebar.
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
            />
          </div>
          <SheetFooter className="border-t border-border shrink-0 sm:flex-col">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center"
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
