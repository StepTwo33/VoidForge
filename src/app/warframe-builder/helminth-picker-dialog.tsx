"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/page-shell";
import { allHelminthAbilities, type HelminthAbility } from "@/data/helminth";

export function HelminthPickerDialog({
  open,
  onOpenChange,
  pickerSlot,
  hasCurrentHelminth,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pickerSlot: number;
  hasCurrentHelminth: boolean;
  onSelect: (ability: HelminthAbility, slot: number) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return allHelminthAbilities;
    const q = search.toLowerCase();
    return allHelminthAbilities.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.sourceWarframe || "").toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSearch("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[85vh] min-h-0 w-full max-w-[calc(100%-2rem)] flex-col overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 space-y-1.5 p-6 pb-0">
          <DialogTitle className="pr-8 text-base leading-snug sm:text-lg">
            {hasCurrentHelminth
              ? `Change Helminth ability (slot ${pickerSlot + 1})`
              : `Replace ability ${pickerSlot + 1} with Helminth`}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            One subsume per loadout. Subsuming an ability unlocks its matching Augment in the mod picker.
          </DialogDescription>
        </DialogHeader>
        <div className="shrink-0 px-6 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Helminth abilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-9 text-sm md:h-9"
              aria-label="Search Helminth abilities"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {filtered.length === 0 ? (
              search.trim() ? "No abilities match this search" : "No Helminth abilities available"
            ) : (
              <>
                <span className="font-mono tabular-nums text-foreground">{filtered.length}</span>
                {" "}abilities — tap to subsume
              </>
            )}
          </p>
        </div>
        <ScrollArea className="min-h-0 flex-1 px-6 pb-6">
          <div className="space-y-1.5">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No abilities found"
                description={
                  search.trim()
                    ? `Nothing matches “${search.trim()}”. Clear search to see all Helminth abilities.`
                    : "No Helminth abilities are available right now."
                }
                className="border-0 bg-transparent py-10"
              />
            ) : (
              filtered.map((ability) => (
                <button
                  key={ability.id}
                  type="button"
                  onClick={() => {
                    onSelect(ability, pickerSlot);
                    setSearch("");
                    onOpenChange(false);
                  }}
                  className="w-full rounded-lg border border-border p-3 text-left transition-all hover:border-green-500/50 hover:bg-green-500/5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{ability.name}</span>
                    <span className="shrink-0 text-[10px] text-green-700/80 dark:text-green-400/70">
                      {ability.sourceWarframe ? ability.sourceWarframe : "Helminth"}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                    {ability.description}
                  </p>
                  {ability.energyCost != null && (
                    <span className="mt-1 inline-block text-[9px] text-muted-foreground">⚡ {ability.energyCost} energy</span>
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
