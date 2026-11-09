"use client";

import { cleanModDescription } from "@/lib/display/mod-display";
import { useState, useMemo } from "react";
import { Mod } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, X, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getArcaneImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { formatArcaneRankDescription, getArcaneDisplayInfo } from "@/lib/display/arcane-display";

import { RARITY_BADGE_COLORS } from "@/lib/display/rarity-badge-colors";
interface ArcaneSlotProps {
  arcane: Mod | null;
  rank: number;
  label: string;
  onAdd: () => void;
  onRemove: () => void;
  onRankChange?: (rank: number) => void;
}

function ArcaneEffectSummary({ arcane, rank }: { arcane: Mod; rank: number }) {
  const info = useMemo(() => getArcaneDisplayInfo(arcane, rank), [arcane, rank]);
  const lines = [...info.applied, ...info.conditional].slice(0, 3);

  if (lines.length === 0) {
    const desc = info.description;
    if (!desc) return null;
    return (
      <p className="text-[10px] leading-snug text-purple-800/80 line-clamp-2 pr-4 dark:text-purple-300/80">
        {desc}
      </p>
    );
  }

  return (
    <ul className="space-y-0.5 pr-4">
      {lines.map((line, i) => (
        <li key={`${line.label}-${i}`} className="text-[10px] leading-snug text-purple-800/90 dark:text-purple-300/90">
          <span className="text-muted-foreground">{line.label}</span>
          {" "}
          <span className="font-mono">{line.value}</span>
          {line.note ? (
            <span className="text-muted-foreground/80"> · {line.note}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ArcaneSlotCard({ arcane, rank, label, onAdd, onRemove, onRankChange }: ArcaneSlotProps) {
  if (!arcane) {
    return (
      <button
        onClick={onAdd}
        className="flex w-full min-h-16 items-center justify-center gap-2 rounded-lg border border-dashed border-purple-500/30 text-muted-foreground transition-all hover:border-purple-500/50 hover:bg-purple-500/5 hover:text-purple-700 dark:hover:text-purple-400"
      >
        <Plus className="h-4 w-4" />
        <span className="text-xs">Add {label}</span>
      </button>
    );
  }

  const effectiveRank = Math.max(0, Math.min(arcane.maxRank, Number.isFinite(rank) ? Math.round(rank) : arcane.maxRank));

  return (
    <div className="relative w-full min-h-16 border border-purple-500/30 rounded-lg p-3 bg-purple-500/5">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
        aria-label="Remove arcane"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onAdd}
          title="Change arcane"
          className="shrink-0 mt-0.5 rounded transition-opacity hover:opacity-80"
        >
          <GameAssetImage src={getArcaneImage(arcane.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/20 shrink-0" hideOnError />
        </button>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="pr-8">
            <button
              type="button"
              onClick={onAdd}
              title="Change arcane"
              className="text-left text-sm font-medium truncate block max-w-full hover:text-purple-700 dark:hover:text-purple-300"
            >
              {arcane.name}
            </button>
            {onRankChange && arcane.maxRank > 0 ? (
              <div className="mt-1 inline-flex items-center gap-1" data-testid="arcane-slot-rank-stepper">
                <button
                  type="button"
                  onClick={() => onRankChange(Math.max(0, effectiveRank - 1))}
                  disabled={effectiveRank <= 0}
                  aria-label="Decrease arcane rank"
                  className="inline-flex h-5 w-5 items-center justify-center rounded border border-purple-500/30 bg-background/70 text-muted-foreground transition-colors hover:border-purple-500/60 hover:text-foreground disabled:opacity-35"
                >
                  <Minus className="h-2.5 w-2.5" />
                </button>
                <select
                  value={effectiveRank}
                  onChange={(e) => onRankChange(parseInt(e.target.value, 10))}
                  aria-label={`${arcane.name} rank`}
                  className="h-5 rounded border border-purple-500/30 bg-background/70 px-1 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {Array.from({ length: arcane.maxRank + 1 }, (_, r) => arcane.maxRank - r).map((r) => (
                    <option key={r} value={r}>
                      Rank {r}/{arcane.maxRank}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onRankChange(Math.min(arcane.maxRank, effectiveRank + 1))}
                  disabled={effectiveRank >= arcane.maxRank}
                  aria-label="Increase arcane rank"
                  className="inline-flex h-5 w-5 items-center justify-center rounded border border-purple-500/30 bg-background/70 text-muted-foreground transition-colors hover:border-purple-500/60 hover:text-foreground disabled:opacity-35"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground">Rank {effectiveRank}/{arcane.maxRank}</span>
            )}
          </div>
          <ArcaneEffectSummary arcane={arcane} rank={effectiveRank} />
        </div>
      </div>
    </div>
  );
}

interface ArcanePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arcanes: Mod[];
  equippedArcaneIds: string[];
  onSelect: (arcane: Mod, rank: number) => void;
  /** Initial rank when opening (defaults to max rank). */
  initialRank?: number;
  title?: string;
}

export function ArcanePicker({
  open,
  onOpenChange,
  arcanes,
  equippedArcaneIds,
  onSelect,
  initialRank,
  title = "Select Arcane",
}: ArcanePickerProps) {
  const [search, setSearch] = useState("");
  const maxAvailableRank = useMemo(
    () => arcanes.reduce((m, a) => Math.max(m, a.maxRank ?? 5), 0) || 5,
    [arcanes],
  );
  const [selectedRank, setSelectedRank] = useState<number>(() => initialRank ?? maxAvailableRank);
  const [prevOpen, setPrevOpen] = useState(false);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setSelectedRank(initialRank ?? maxAvailableRank);
      setSearch("");
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return arcanes;
    const q = search.toLowerCase();
    return arcanes.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
    );
  }, [arcanes, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] min-h-0 w-full max-w-[calc(100%-2rem)] flex-col overflow-hidden p-0 sm:max-w-lg max-lg:top-auto max-lg:bottom-0 max-lg:max-h-[85dvh] max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none">
        <DialogHeader className="p-6 pb-0 sm:pl-6 sm:pr-12 lg:pl-6 lg:pr-12">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-3 space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search arcanes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 pl-9 sm:min-h-9"
              autoFocus
            />
          </div>
          {maxAvailableRank > 0 && (
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-purple-500/25 bg-purple-500/5 px-2.5 py-1.5"
              data-testid="arcane-picker-rank-bar"
            >
              <span className="text-[11px] font-medium text-muted-foreground">
                Equip at rank
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: maxAvailableRank + 1 }, (_, r) => r).map((r) => {
                  const active = selectedRank === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRank(r)}
                      className={cn(
                        "inline-flex h-6 min-w-7 items-center justify-center rounded px-1.5 text-[11px] font-mono font-medium transition-colors",
                        active
                          ? "bg-purple-600 text-white shadow-xs"
                          : "border border-border/70 bg-background text-muted-foreground hover:border-purple-500/50 hover:text-foreground",
                      )}
                    >
                      R{r}
                      {r === maxAvailableRank ? " · Max" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">{filtered.length} arcanes</p>
        </div>
        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 px-3 py-8 text-center">
              <p className="text-sm font-medium text-foreground">No arcanes match</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
          <div className="space-y-1">
            {filtered.map((arcane) => {
              const isEquipped = equippedArcaneIds.includes(arcane.id);
              const effectiveRank = Math.max(0, Math.min(arcane.maxRank, selectedRank));
              const desc = formatArcaneRankDescription(arcane, effectiveRank) || cleanModDescription(arcane.description);
              return (
                <button
                  key={arcane.id}
                  type="button"
                  onClick={() => !isEquipped && onSelect(arcane, effectiveRank)}
                  disabled={isEquipped}
                  className={cn(
                    "w-full min-h-11 text-left p-3 rounded-lg border transition-all",
                    isEquipped
                      ? "border-border opacity-40 cursor-not-allowed"
                      : "border-border hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <GameAssetImage src={getArcaneImage(arcane.name)} alt="" width={28} height={28} className="w-7 h-7 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                      <span className="truncate text-sm font-medium">{arcane.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300">
                        R{effectiveRank}/{arcane.maxRank}
                      </span>
                      <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[arcane.rarity])}>
                        {arcane.rarity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 pl-9">
                    {desc}
                  </p>
                </button>
              );
            })}
          </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
