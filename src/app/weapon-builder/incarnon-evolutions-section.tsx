"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IncarnonWeaponData } from "@/data/incarnon";
import { getIncarnonConditional, incarnonConditionalKey } from "@/lib/calc/weapon-stat-merges";

export type IncarnonGenesisToggle = {
  installed: boolean;
  /** True while the default rule (on once any evolution is picked) is in effect. */
  auto: boolean;
  onChange: (installed: boolean) => void;
  /** An equipped Cannonade mod that the installed adapter's form trigger rules out. */
  cannonadeEquipped?: boolean;
  cannonadeBlocked?: boolean;
};

const checkboxClass = "h-3.5 w-3.5 rounded border-border accent-primary";

export function IncarnonEvolutionsSection({
  incarnonData,
  selectedEvolutions,
  onSelectEvolution,
  onClearEvolutions,
  conditionalsOn = {},
  onToggleConditional,
  genesis,
}: {
  incarnonData: IncarnonWeaponData | null | undefined;
  selectedEvolutions: Record<number, number>;
  onSelectEvolution: (tier: number, slot: number) => void;
  onClearEvolutions?: () => void;
  /** Round 47: conditional perk toggles (key → condition met). Unset = off. */
  conditionalsOn?: Record<string, boolean>;
  onToggleConditional?: (key: string, on: boolean) => void;
  /** Incarnon Genesis weapons only — adapter installed toggle (controls Form, Evo perks, and Cannonade). */
  genesis?: IncarnonGenesisToggle;
}) {
  const adapterDisabled = Boolean(genesis && !genesis.installed);
  const pickedCount = Object.keys(selectedEvolutions).length;

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground flex items-center gap-2">
          <Flame className={cn("h-4 w-4", adapterDisabled ? "text-muted-foreground" : "text-orange-700 dark:text-orange-400")} />
          INCARNON EVOLUTIONS
        </h2>
        <div className="flex items-center gap-2">
          {pickedCount > 0 && onClearEvolutions && (
            <button
              type="button"
              onClick={onClearEvolutions}
              className="rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Clear all selected evolution perks"
            >
              Reset picks
            </button>
          )}
          {genesis && (
            <button
              type="button"
              role="switch"
              aria-checked={genesis.installed}
              onClick={() => genesis.onChange(!genesis.installed)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
                genesis.installed
                  ? "border-orange-500/40 bg-orange-500/15 text-orange-800 dark:text-orange-300"
                  : "border-border bg-muted/40 text-muted-foreground hover:border-orange-500/30 hover:text-foreground",
              )}
              title={
                genesis.installed
                  ? "Incarnon Genesis Adapter is ON — Incarnon Form & Evolution perks apply. Click to toggle off."
                  : "Incarnon Genesis Adapter is OFF — base weapon stats & mod rules only. Click to toggle on."
              }
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  genesis.installed ? "bg-orange-500" : "bg-muted-foreground/50",
                )}
              />
              <span>Adapter {genesis.installed ? "ON" : "OFF"}</span>
            </button>
          )}
        </div>
      </div>
      {genesis && (
        <div
          className={cn(
            "mb-2 rounded-lg border px-3 py-2 space-y-1 transition-colors",
            genesis.installed
              ? "border-orange-500/30 bg-orange-500/5"
              : "border-border bg-muted/20",
          )}
        >
          <label className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground cursor-pointer">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={genesis.installed}
                onChange={(e) => genesis.onChange(e.target.checked)}
              />
              <span className={cn(genesis.installed && "font-medium text-foreground")}>
                Incarnon Genesis Adapter installed
              </span>
            </span>
            <span className="text-[10px] opacity-75">
              {genesis.installed
                ? genesis.auto
                  ? "Active (auto)"
                  : "Active"
                : pickedCount > 0
                  ? `${pickedCount} perk${pickedCount === 1 ? "" : "s"} paused`
                  : "Not installed"}
            </span>
          </label>
          {!genesis.installed && pickedCount > 0 && (
            <p className="text-[10px] text-muted-foreground pl-5">
              Adapter is toggled off — evolution perks and Incarnon Form are bypassed so you can compare against the base weapon.
            </p>
          )}
          {genesis.installed && genesis.cannonadeBlocked && (
            <p className="text-[10px] text-muted-foreground pl-5">
              Incarnon Form is not semi-auto, so Cannonade mods can&apos;t be equipped.
              {genesis.cannonadeEquipped && (
                <span className="text-amber-700 dark:text-amber-400"> An equipped Cannonade no longer fits.</span>
              )}
            </p>
          )}
        </div>
      )}
      {incarnonData ? (
        <div className={cn("space-y-2 transition-opacity", adapterDisabled && "opacity-55")}>
          {[1, 2, 3, 4, 5].map((tier) => {
            const choices = incarnonData.evolutions.filter((e) => e.tier === tier);
            if (choices.length === 0) return null;
            const selected = selectedEvolutions[tier];
            const selectedEvo = choices.find((e) => e.slot === selected);
            const cond = selectedEvo ? getIncarnonConditional(incarnonData, selectedEvo) : undefined;
            const condKey = selectedEvo ? incarnonConditionalKey(incarnonData, selectedEvo) : "";
            return (
              <div key={tier} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-orange-700 dark:text-orange-400 tracking-wider">
                    EVOLUTION {tier}
                  </span>
                  {selected != null && (
                    <span className="text-[9px] text-muted-foreground">
                      {adapterDisabled ? "Paused (Adapter OFF)" : "Click active perk to deselect"}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-1.5">
                  {choices.map((evo) => (
                    <button
                      key={evo.slot}
                      type="button"
                      onClick={() => onSelectEvolution(tier, evo.slot)}
                      className={cn(
                        "flex-1 text-left p-2 rounded-lg border text-[10px] transition-all",
                        selected === evo.slot
                          ? adapterDisabled
                            ? "border-orange-500/30 bg-muted/40 text-foreground"
                            : "border-orange-500/50 bg-orange-500/10 text-orange-900 dark:text-orange-300"
                          : "border-border text-muted-foreground hover:border-orange-500/30",
                      )}
                    >
                      <span className="font-medium block">{evo.name}</span>
                      <span className="text-[9px] opacity-70">{evo.description}</span>
                    </button>
                  ))}
                </div>
                {cond && onToggleConditional && !adapterDisabled && (
                  <label
                    className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer"
                    title="Off = the perk's condition is not met; only its unconditional part applies."
                  >
                    <input
                      type="checkbox"
                      className={checkboxClass}
                      checked={conditionalsOn[condKey] === true}
                      onChange={(e) => onToggleConditional(condKey, e.target.checked)}
                    />
                    <span>{cond.label}</span>
                  </label>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground border border-dashed border-border rounded-lg p-4 text-center">
          Incarnon evolution data not yet available for this weapon.
          <br />
          <span className="text-[10px]">Evolution data is being added — check back soon.</span>
        </p>
      )}
    </div>
  );
}
