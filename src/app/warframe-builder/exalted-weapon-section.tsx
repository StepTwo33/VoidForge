"use client";

import { Sparkles } from "lucide-react";
import { ModSlotCard } from "@/components/mod-slot";
import { ArcaneSlotCard } from "@/components/arcane-picker";
import { WeaponStatsPanel } from "@/components/stats-panel";
import { GameAssetImage } from "@/components/game-asset-image";
import { getWeaponImage } from "@/lib/display/images";
import { cn } from "@/lib/utils";
import type { CalculatedStats, EquippedMod, Mod, Weapon } from "@/lib/types";
import type { WeaponDpsCalcContext } from "@/lib/calc/dps-contributions";

export function ExaltedWeaponSection({
  exaltedWeapon,
  exaltedWeapons,
  exaltedCapacity,
  exaltedMods,
  modsMap,
  exaltedSlotPolarities,
  exaltedArcaneConfig,
  exaltedArcanes,
  exaltedStats,
  exaltedBaseStats,
  exaltedContributionContext,
  sectionTitle = "Exalted Weapon",
  hideSiblingNote = false,
  onAddMod,
  onRemoveMod,
  onPolarize,
  onAddArcane,
  onRemoveArcane,
}: {
  exaltedWeapon: Weapon;
  exaltedWeapons: Weapon[];
  exaltedCapacity: number;
  exaltedMods: EquippedMod[];
  modsMap: Map<string, Mod>;
  exaltedSlotPolarities: Record<number, string>;
  exaltedArcaneConfig: { slots: number; label: string };
  exaltedArcanes: (Mod | null)[];
  exaltedStats: CalculatedStats | null;
  exaltedBaseStats: CalculatedStats | null;
  exaltedContributionContext: WeaponDpsCalcContext | null;
  sectionTitle?: string;
  /** When true, skip the “Also moddable” note (sibling has its own grid). */
  hideSiblingNote?: boolean;
  onAddMod: (slotIndex: number) => void;
  onRemoveMod: (slotIndex: number) => void;
  onPolarize: (slotIndex: number, polarity: string | null) => void;
  onAddArcane: (slotIndex: number) => void;
  onRemoveArcane: (slotIndex: number) => void;
}) {
  return (
    <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.07] via-card to-card p-5 shadow-sm ring-1 ring-violet-500/10">
      <div className="mb-4 flex items-start gap-3">
        <GameAssetImage
          src={getWeaponImage(exaltedWeapon.name, { category: exaltedWeapon.category })}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-lg object-contain bg-muted/30 ring-1 ring-violet-500/20"
          hideOnError
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-violet-400" aria-hidden />
            <h2 className="text-sm font-semibold tracking-wide text-violet-300">{sectionTitle}</h2>
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300 ring-1 ring-violet-500/25">
              {exaltedWeapon.name}
            </span>
          </div>
          {!hideSiblingNote && exaltedWeapons.length > 1 && (
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Also moddable:{" "}
              {exaltedWeapons
                .filter((w) => w.id !== exaltedWeapon.id)
                .map((w) => w.name)
                .join(", ")}
              . Grid below is for {exaltedWeapon.name}.
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">Capacity</span>
            <span
              className={cn(
                "font-mono font-medium",
                exaltedCapacity > 60 ? "text-red-400" : "text-foreground",
              )}
            >
              {exaltedCapacity} / 60
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: exaltedWeapon.modSlots }, (_, i) => {
          const equipped = exaltedMods.find((m) => m.slotIndex === i);
          const mod = equipped ? (modsMap.get(equipped.modId) ?? null) : null;
          return (
            <ModSlotCard
              key={`ex${i}`}
              mod={mod}
              rank={equipped?.rank ?? 0}
              slotIndex={i}
              slotPolarity={exaltedSlotPolarities[i]}
              onAdd={() => onAddMod(i)}
              onRemove={() => onRemoveMod(i)}
              onPolarize={(p) => onPolarize(i, p)}
            />
          );
        })}
      </div>

      {exaltedArcaneConfig.slots > 0 && (
        <div className="mt-4 border-t border-violet-500/15 pt-4">
          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {exaltedArcaneConfig.label}
          </h3>
          <div
            className={cn(
              "grid gap-2",
              exaltedArcaneConfig.slots === 2 ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {Array.from({ length: exaltedArcaneConfig.slots }).map((_, i) => (
              <ArcaneSlotCard
                key={`exalted-arcane-${i}`}
                arcane={exaltedArcanes[i] ?? null}
                rank={exaltedArcanes[i]?.maxRank ?? 0}
                label={`${exaltedArcaneConfig.label}${exaltedArcaneConfig.slots > 1 ? ` ${i + 1}` : ""}`}
                onAdd={() => onAddArcane(i)}
                onRemove={() => onRemoveArcane(i)}
              />
            ))}
          </div>
        </div>
      )}

      {exaltedStats && (
        <div className="mt-4 border-t border-violet-500/15 pt-4 [&>div]:border-0 [&>div]:bg-transparent [&>div]:p-0 [&_h3]:text-violet-300/80">
          <WeaponStatsPanel
            stats={exaltedStats}
            baseStats={exaltedBaseStats}
            weapon={exaltedWeapon}
            isMelee={exaltedWeapon.category === "melee" || exaltedWeapon.triggerType === "Melee"}
            contributionContext={exaltedContributionContext}
          />
        </div>
      )}
    </div>
  );
}
