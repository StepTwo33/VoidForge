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
  conditionalsOn = {},
  onToggleConditional,
  genesis,
}: {
  incarnonData: IncarnonWeaponData | null | undefined;
  selectedEvolutions: Record<number, number>;
  onSelectEvolution: (tier: number, slot: number) => void;
  /** Round 47: conditional perk toggles (key → condition met). Unset = off. */
  conditionalsOn?: Record<string, boolean>;
  onToggleConditional?: (key: string, on: boolean) => void;
  /** Round 47: Incarnon Genesis weapons only — adapter installed (Cannonade check). */
  genesis?: IncarnonGenesisToggle;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-700 dark:text-orange-400" />
        INCARNON EVOLUTIONS
      </h2>
      {genesis && (
        <div className="mb-2 border border-border rounded-lg px-3 py-2 space-y-1">
          <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={genesis.installed}
              onChange={(e) => genesis.onChange(e.target.checked)}
            />
            <span>
              Incarnon Genesis installed
              {genesis.auto && <span className="opacity-70"> (auto: on when an evolution is picked)</span>}
            </span>
          </label>
          {genesis.cannonadeBlocked && (
            <p className="text-[9px] text-muted-foreground pl-5">
              Incarnon Form is not semi-auto, so Cannonade mods can&apos;t be equipped.
              {genesis.cannonadeEquipped && (
                <span className="text-amber-700 dark:text-amber-400"> An equipped Cannonade no longer fits.</span>
              )}
            </p>
          )}
        </div>
      )}
      {incarnonData ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((tier) => {
            const choices = incarnonData.evolutions.filter((e) => e.tier === tier);
            if (choices.length === 0) return null;
            const selected = selectedEvolutions[tier];
            const selectedEvo = choices.find((e) => e.slot === selected);
            const cond = selectedEvo ? getIncarnonConditional(incarnonData, selectedEvo) : undefined;
            const condKey = selectedEvo ? incarnonConditionalKey(incarnonData, selectedEvo) : "";
            return (
              <div key={tier} className="border border-border rounded-lg p-3">
                <span className="text-[10px] font-semibold text-orange-700 dark:text-orange-400 tracking-wider">
                  EVOLUTION {tier}
                </span>
                <div className="flex gap-2 mt-1.5">
                  {choices.map((evo) => (
                    <button
                      key={evo.slot}
                      onClick={() => onSelectEvolution(tier, evo.slot)}
                      className={cn(
                        "flex-1 text-left p-2 rounded-lg border text-[10px] transition-all",
                        selected === evo.slot
                          ? "border-orange-500/50 bg-orange-500/10 text-orange-900 dark:text-orange-300"
                          : "border-border text-muted-foreground hover:border-orange-500/30",
                      )}
                    >
                      <span className="font-medium block">{evo.name}</span>
                      <span className="text-[9px] opacity-70">{evo.description}</span>
                    </button>
                  ))}
                </div>
                {cond && onToggleConditional && (
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
