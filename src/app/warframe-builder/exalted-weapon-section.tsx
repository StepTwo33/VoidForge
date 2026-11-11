"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, FolderOpen, Save, ExternalLink, Trash2, Check, Search, Plus, Lock, X } from "lucide-react";
import { ModSlotCard } from "@/components/mod-slot";
import { isInnatePolarity } from "@/lib/builds/innate-polarities";
import { ArcaneSlotCard } from "@/components/arcane-picker";
import { PolarityIcon } from "@/components/polarity-icon";
import { stanceCapacityBonus, type StanceSlotInfo } from "@/lib/weapons/exalted-melee-slots";
import { WeaponStatsPanel } from "@/components/stats-panel";
import { GameAssetImage } from "@/components/game-asset-image";
import { getWeaponImage } from "@/lib/display/images";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalculatedStats, EquippedMod, Mod, SimulationParams, Weapon } from "@/lib/types";
import type { WeaponDpsCalcContext } from "@/lib/calc/dps-contributions";
import type { SavedBuild, WeaponBuildData } from "@/lib/builds/build-storage";

/** Matches weapon-builder: regular slots 0–7, Exilus at index 8. */
const WEAPON_EXILUS_SLOT_INDEX = 8;

export function ExaltedWeaponSection({
  exaltedWeapon,
  exaltedWeapons,
  exaltedCapacity,
  exaltedMaxCapacity = 60,
  stanceSlot = null,
  stanceMod = null,
  onPickStance,
  onRemoveStance,
  exaltedMods,
  hasExilusSlot = true,
  unavailableMods = [],
  modsMap,
  exaltedSlotPolarities,
  exaltedSlotOverrides,
  exaltedInnatePolarities,
  exaltedArcaneConfig,
  exaltedArcanes,
  exaltedArcaneRanks,
  exaltedStats,
  exaltedBaseStats,
  exaltedContributionContext,
  simParams,
  onSimParamsChange,
  sectionTitle = "Exalted Weapon",
  hideSiblingNote = false,
  activeBuildName,
  savedWeaponBuilds = [],
  onLoadSavedBuild,
  onSaveAsWeaponBuild,
  onClearMods,
  onAddMod,
  onRemoveMod,
  onPolarize,
  onAddArcane,
  onRemoveArcane,
  onArcaneRankChange,
}: {
  exaltedWeapon: Weapon;
  exaltedWeapons: Weapon[];
  exaltedCapacity: number;
  /** Innate Catalyst (60) plus the stance's capacity. */
  exaltedMaxCapacity?: number;
  /** Locked Ability stance (most exalted melee) or a free stance choice (Garuda Talons); null = none. */
  stanceSlot?: StanceSlotInfo | null;
  stanceMod?: Mod | null;
  onPickStance?: () => void;
  onRemoveStance?: () => void;
  exaltedMods: EquippedMod[];
  /** False for pseudo-exalted melee (wiki: "does not have an Exilus Slot"). */
  hasExilusSlot?: boolean;
  /** Saved mods in a slot this weapon lacks; ignored by the maths and flagged here. */
  unavailableMods?: EquippedMod[];
  modsMap: Map<string, Mod>;
  /** Effective polarities (innate defaults merged with overrides). */
  exaltedSlotPolarities: Record<number, string>;
  /** Stored overrides only; with the innate map, marks slots that show a default. */
  exaltedSlotOverrides?: Record<number, string>;
  exaltedInnatePolarities?: Record<number, string>;
  exaltedArcaneConfig: { slots: number; label: string };
  exaltedArcanes: (Mod | null)[];
  exaltedArcaneRanks?: number[];
  exaltedStats: CalculatedStats | null;
  exaltedBaseStats: CalculatedStats | null;
  exaltedContributionContext: WeaponDpsCalcContext | null;
  simParams?: SimulationParams;
  onSimParamsChange?: (params: SimulationParams) => void;
  sectionTitle?: string;
  /** When true, skip the “Also moddable” note (sibling has its own grid). */
  hideSiblingNote?: boolean;
  activeBuildName?: string | null;
  savedWeaponBuilds?: SavedBuild[];
  onLoadSavedBuild?: (build: SavedBuild) => void;
  onSaveAsWeaponBuild?: (name: string) => void;
  onClearMods?: () => void;
  onAddMod: (slotIndex: number) => void;
  onRemoveMod: (slotIndex: number) => void;
  onPolarize: (slotIndex: number, polarity: string | null) => void;
  onAddArcane: (slotIndex: number) => void;
  onRemoveArcane: (slotIndex: number) => void;
  onArcaneRankChange?: (slotIndex: number, rank: number) => void;
}) {
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveBuildName, setSaveBuildName] = useState(`${exaltedWeapon.name} Build`);
  const [buildSearch, setBuildSearch] = useState("");

  const matchingBuilds = useMemo(() => {
    return savedWeaponBuilds.filter((b) => {
      if (b.type !== "weapon") return false;
      const d = b.data as WeaponBuildData;
      return d?.weaponId === exaltedWeapon.id;
    });
  }, [savedWeaponBuilds, exaltedWeapon.id]);

  const filteredBuilds = useMemo(() => {
    const q = buildSearch.trim().toLowerCase();
    if (!q) return matchingBuilds;
    return matchingBuilds.filter((b) => b.name.toLowerCase().includes(q));
  }, [matchingBuilds, buildSearch]);

  const handleOpenSaveDialog = () => {
    setSaveBuildName(activeBuildName || `${exaltedWeapon.name} Build`);
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = () => {
    const name = saveBuildName.trim();
    if (!name) return;
    onSaveAsWeaponBuild?.(name);
    setSaveDialogOpen(false);
  };

  return (
    <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.07] via-card to-card p-5 shadow-sm ring-1 ring-violet-500/10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
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
              <Sparkles className="h-4 w-4 shrink-0 text-violet-700 dark:text-violet-400" aria-hidden />
              <h2 className="text-sm font-semibold tracking-wide text-violet-800 dark:text-violet-300">{sectionTitle}</h2>
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-800 dark:text-violet-300 ring-1 ring-violet-500/25">
                {exaltedWeapon.name}
              </span>
              {activeBuildName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-900 dark:text-violet-200 border border-violet-500/30">
                  <Check className="h-3 w-3" /> {activeBuildName}
                </span>
              )}
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
                  exaltedCapacity > exaltedMaxCapacity ? "text-red-700 dark:text-red-400" : "text-foreground",
                )}
                data-testid="exalted-capacity"
              >
                {exaltedCapacity} / {exaltedMaxCapacity}
              </span>
              <span className="rounded bg-blue-500/10 px-1.5 py-0.2 text-[9px] font-medium text-blue-700 dark:text-blue-400">
                Innate Catalyst
              </span>
            </div>
          </div>
        </div>

        {/* EXALTED WEAPON ACTIONS TOOLBAR */}
        <div className="flex flex-wrap items-center gap-1.5 self-start pt-1">
          {onLoadSavedBuild && (
            <button
              type="button"
              onClick={() => {
                setBuildSearch("");
                setLoadDialogOpen(true);
              }}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-800 dark:text-violet-300 hover:bg-violet-500/20 transition-colors shadow-sm"
              title={`Switch or load a saved build for ${exaltedWeapon.name}`}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Switch Build{matchingBuilds.length > 0 ? ` (${matchingBuilds.length})` : ""}</span>
            </button>
          )}

          {onSaveAsWeaponBuild && (
            <button
              type="button"
              onClick={handleOpenSaveDialog}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              title="Save current mod layout as a Weapon Builder build"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save as Build</span>
            </button>
          )}

          <Link
            href={`/weapon-builder?weapon=${encodeURIComponent(exaltedWeapon.id)}`}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            title={`Open ${exaltedWeapon.name} in Weapon Builder`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Weapon Builder</span>
          </Link>

          {onClearMods && exaltedMods.length > 0 && (
            <button
              type="button"
              onClick={onClearMods}
              className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
              title="Clear equipped mods"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
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
              innatePolarity={isInnatePolarity(exaltedInnatePolarities ?? {}, exaltedSlotOverrides, i)}
              equippedModIds={exaltedMods.map((m) => m.modId)}
              onAdd={() => onAddMod(i)}
              onRemove={() => onRemoveMod(i)}
              onPolarize={(p) => onPolarize(i, p)}
            />
          );
        })}
      </div>

      {stanceSlot && (
        <div className="mt-2.5" data-testid="exalted-stance">
          <span className="mb-1 block text-[10px] font-semibold tracking-wider text-amber-700 dark:text-amber-400">
            STANCE
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {stanceSlot.kind === "fixed" ? (
              <div
                className="flex min-h-14 items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"
                title="Exalted stance: locked to the ability, Zenurik slot (wiki Update 38.5: +10 capacity)"
              >
                <Lock className="h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{stanceSlot.stanceName}</span>
                <PolarityIcon polarity={stanceSlot.polarity} size={14} />
                <span className="shrink-0 text-[10px] text-amber-700 dark:text-amber-400">+{stanceSlot.capacity}</span>
              </div>
            ) : stanceMod ? (
              <div className="relative flex min-h-14 items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 pr-12 sm:pr-10">
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{stanceMod.name}</span>
                <PolarityIcon polarity={stanceMod.polarity} size={14} />
                <span className="shrink-0 text-[10px] text-amber-700 dark:text-amber-400">
                  +{stanceCapacityBonus(stanceMod, stanceSlot.polarity)}
                </span>
                {onRemoveStance && (
                  <button
                    type="button"
                    onClick={onRemoveStance}
                    className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive sm:h-8 sm:w-8"
                    aria-label="Remove stance"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onPickStance}
                disabled={!onPickStance}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-amber-500/30 text-muted-foreground transition-all hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-700 dark:hover:text-amber-400"
              >
                <Plus className="h-4 w-4" />
                <span className="text-xs">Add Stance</span>
                {stanceSlot.polarity && <PolarityIcon polarity={stanceSlot.polarity} size={12} />}
              </button>
            )}
          </div>
        </div>
      )}

      {unavailableMods.length > 0 && (
        <div
          role="status"
          className="mt-2.5 flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-900 dark:text-amber-200"
        >
          <span className="min-w-0 flex-1">
            {exaltedWeapon.name} has no Exilus slot, so the saved{" "}
            {unavailableMods.map((m) => modsMap.get(m.modId)?.name ?? m.modName ?? m.modId).join(", ")} is ignored.
          </span>
          {unavailableMods.map((m) => (
            <button
              key={`drop-${m.slotIndex}`}
              type="button"
              onClick={() => onRemoveMod(m.slotIndex)}
              className="inline-flex min-h-8 items-center rounded-md border border-amber-500/40 px-2 font-medium hover:bg-amber-500/20"
            >
              Remove
            </button>
          ))}
        </div>
      )}

      {hasExilusSlot && (() => {
        const i = WEAPON_EXILUS_SLOT_INDEX;
        const equipped = exaltedMods.find((m) => m.slotIndex === i);
        const mod = equipped ? (modsMap.get(equipped.modId) ?? null) : null;
        return (
          <div className="mt-2.5">
            <span className="mb-1 block text-[10px] font-semibold tracking-wider text-cyan-700 dark:text-cyan-400">
              EXILUS
            </span>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <ModSlotCard
                key={`ex${i}`}
                mod={mod}
                rank={equipped?.rank ?? 0}
                slotIndex={i}
                label="Exilus"
                slotPolarity={exaltedSlotPolarities[i]}
                innatePolarity={isInnatePolarity(exaltedInnatePolarities ?? {}, exaltedSlotOverrides, i)}
                equippedModIds={exaltedMods.map((m) => m.modId)}
                onAdd={() => onAddMod(i)}
                onRemove={() => onRemoveMod(i)}
                onPolarize={(p) => onPolarize(i, p)}
              />
            </div>
          </div>
        );
      })()}

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
                rank={exaltedArcaneRanks?.[i] ?? exaltedArcanes[i]?.maxRank ?? 0}
                label={`${exaltedArcaneConfig.label}${exaltedArcaneConfig.slots > 1 ? ` ${i + 1}` : ""}`}
                onAdd={() => onAddArcane(i)}
                onRemove={() => onRemoveArcane(i)}
                onRankChange={onArcaneRankChange ? (r) => onArcaneRankChange(i, r) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {exaltedStats && (
        <div className="mt-4 border-t border-violet-500/15 pt-4 [&>div]:border-0 [&>div]:bg-transparent [&>div]:p-0 [&_h3]:text-violet-800/80 dark:[&_h3]:text-violet-300/80">
          <WeaponStatsPanel
            stats={exaltedStats}
            baseStats={exaltedBaseStats}
            weapon={exaltedWeapon}
            isMelee={exaltedWeapon.category === "melee" || exaltedWeapon.triggerType === "Melee"}
            contributionContext={exaltedContributionContext}
            simParams={simParams}
            onSimParamsChange={onSimParamsChange}
          />
        </div>
      )}

      {/* SWITCH / LOAD SAVED BUILD DIALOG */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="h-4 w-4 text-violet-700 dark:text-violet-400" />
              Switch {exaltedWeapon.name} Build
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select an existing weapon build to equip onto {exaltedWeapon.name}.
            </DialogDescription>
          </DialogHeader>

          {matchingBuilds.length > 4 && (
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={buildSearch}
                onChange={(e) => setBuildSearch(e.target.value)}
                placeholder="Search saved builds..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          )}

          <div className="max-h-72 overflow-y-auto space-y-1.5 py-1">
            {filteredBuilds.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/80 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {matchingBuilds.length === 0
                    ? `No saved builds found for ${exaltedWeapon.name}.`
                    : "No matching builds."}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => {
                      setLoadDialogOpen(false);
                      handleOpenSaveDialog();
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Save current layout
                  </Button>
                  <Button size="sm" asChild variant="secondary" className="text-xs">
                    <Link href={`/weapon-builder?weapon=${encodeURIComponent(exaltedWeapon.id)}`}>
                      Create in Weapon Builder
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              filteredBuilds.map((b) => {
                const d = b.data as WeaponBuildData;
                const modCount = d.mods?.length ?? 0;
                const isCurrent = activeBuildName === b.name;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      onLoadSavedBuild?.(b);
                      setLoadDialogOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all",
                      isCurrent
                        ? "bg-violet-500/15 border-violet-500 text-foreground ring-1 ring-violet-500/30"
                        : "bg-card border-border/70 hover:bg-muted/40 text-foreground",
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{b.name}</span>
                        {isCurrent && (
                          <span className="rounded bg-violet-500/20 px-1.5 py-0.2 text-[9px] font-bold text-violet-800 dark:text-violet-300">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        {modCount} mod{modCount === 1 ? "" : "s"}
                        {d.arcaneIds?.filter(Boolean).length ? ` • ${d.arcaneIds.filter(Boolean).length} arcane(s)` : ""}
                      </span>
                    </div>
                    <span className="text-xs text-primary font-medium">Equip</span>
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* SAVE AS WEAPON BUILD DIALOG */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Save className="h-4 w-4 text-violet-700 dark:text-violet-400" />
              Save as Weapon Build
            </DialogTitle>
            <DialogDescription className="text-xs">
              Save {exaltedWeapon.name}&apos;s current modding to your Weapon Builder library. You can switch to this build anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Build Name</label>
              <Input
                value={saveBuildName}
                onChange={(e) => setSaveBuildName(e.target.value)}
                placeholder="e.g. Corrosive Heat Peacemakers"
                className="h-9 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmSave();
                  }
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Includes {exaltedMods.length} equipped mod(s), polarity layout, and arcanes.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setSaveDialogOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmSave} className="text-xs">
              Save Build
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
