"use client";

import { useState, useMemo } from "react";
import { Mod } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getArcaneImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { getArcaneDisplayInfo } from "@/lib/display/arcane-display";

import { RARITY_BADGE_COLORS } from "@/lib/display/rarity-badge-colors";
interface ArcaneSlotProps {
  arcane: Mod | null;
  rank: number;
  label: string;
  onAdd: () => void;
  onRemove: () => void;
}

function ArcaneEffectSummary({ arcane, rank }: { arcane: Mod; rank: number }) {
  const info = useMemo(() => getArcaneDisplayInfo(arcane, rank), [arcane, rank]);
  const lines = [...info.applied, ...info.conditional].slice(0, 3);

  if (lines.length === 0) {
    const desc = info.description;
    if (!desc) return null;
    return (
      <p className="text-[10px] leading-snug text-purple-300/80 line-clamp-2 pr-4">
        {desc}
      </p>
    );
  }

  return (
    <ul className="space-y-0.5 pr-4">
      {lines.map((line, i) => (
        <li key={`${line.label}-${i}`} className="text-[10px] leading-snug text-purple-300/90">
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

export function ArcaneSlotCard({ arcane, rank, label, onAdd, onRemove }: ArcaneSlotProps) {
  if (!arcane) {
    return (
      <button
        onClick={onAdd}
        className="w-full min-h-16 border border-dashed border-purple-500/30 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all"
      >
        <Plus className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </button>
    );
  }

  return (
    <div className="relative w-full min-h-16 border border-purple-500/30 rounded-lg p-3 bg-purple-500/5">
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
      <div className="flex items-start gap-2">
        <GameAssetImage src={getArcaneImage(arcane.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/20 shrink-0 mt-0.5" hideOnError />
        <div className="flex-1 min-w-0 space-y-1">
          <div>
            <span className="text-sm font-medium truncate block">{arcane.name}</span>
            <span className="text-[10px] text-muted-foreground">Rank {rank}/{arcane.maxRank}</span>
          </div>
          <ArcaneEffectSummary arcane={arcane} rank={rank} />
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
  onSelect: (arcane: Mod) => void;
  title?: string;
}

export function ArcanePicker({ open, onOpenChange, arcanes, equippedArcaneIds, onSelect, title = "Select Arcane" }: ArcanePickerProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return arcanes;
    const q = search.toLowerCase();
    return arcanes.filter((a) => a.name.toLowerCase().includes(q));
  }, [arcanes, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search arcanes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{filtered.length} arcanes</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <div className="space-y-1">
            {filtered.map((arcane) => {
              const isEquipped = equippedArcaneIds.includes(arcane.id);
              return (
                <button
                  key={arcane.id}
                  onClick={() => !isEquipped && onSelect(arcane)}
                  disabled={isEquipped}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    isEquipped
                      ? "border-border opacity-40 cursor-not-allowed"
                      : "border-border hover:border-purple-500/50 hover:bg-purple-500/5 cursor-pointer"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GameAssetImage src={getArcaneImage(arcane.name)} alt="" width={28} height={28} className="w-7 h-7 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                      <span className="text-sm font-medium">{arcane.name}</span>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[arcane.rarity])}>
                      {arcane.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate pl-5.5">
                    {arcane.description.replace(/<[^>]+>/g, "").substring(0, 80)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
