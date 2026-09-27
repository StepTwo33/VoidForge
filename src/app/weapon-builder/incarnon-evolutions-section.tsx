"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IncarnonWeaponData } from "@/data/incarnon";

export function IncarnonEvolutionsSection({
  incarnonData,
  selectedEvolutions,
  onSelectEvolution,
}: {
  incarnonData: IncarnonWeaponData | null | undefined;
  selectedEvolutions: Record<number, number>;
  onSelectEvolution: (tier: number, slot: number) => void;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-700 dark:text-orange-400" />
        INCARNON EVOLUTIONS
      </h2>
      {incarnonData ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((tier) => {
            const choices = incarnonData.evolutions.filter((e) => e.tier === tier);
            if (choices.length === 0) return null;
            const selected = selectedEvolutions[tier];
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
