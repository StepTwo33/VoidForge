"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PolarityIcon } from "@/components/polarity-icon";
import { STANCE_WEAPON_TYPE, MELEE_TYPE_LABELS } from "@/data/stances";
import type { Mod } from "@/lib/types";

export function StancePickerDialog({
  open,
  onOpenChange,
  allMods,
  stanceType,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allMods: Mod[];
  stanceType?: string;
  onSelect: (mod: Mod) => void;
}) {
  const [search, setSearch] = useState("");

  const groups = Object.entries(
    allMods
      .filter((m) => m.category === "stance")
      .filter((m) => {
        const type = STANCE_WEAPON_TYPE[m.id];
        if (!type) return false;
        if (stanceType && type !== stanceType) return false;
        return true;
      })
      .filter((m) => !search.trim() || m.name.toLowerCase().includes(search.toLowerCase()))
      .reduce<Record<string, Mod[]>>((acc, mod) => {
        const type = STANCE_WEAPON_TYPE[mod.id] || "other";
        const label = MELEE_TYPE_LABELS[type] || "Other";
        if (!acc[label]) acc[label] = [];
        acc[label].push(mod);
        return acc;
      }, {}),
  ).sort(([a], [b]) => a.localeCompare(b));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSearch("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-[calc(100%-2rem)] max-h-[80vh] flex flex-col p-0 sm:max-w-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Select Stance Mod</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stances..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <div className="space-y-4">
            {groups.map(([type, mods]) => (
              <div key={type}>
                <h3 className="text-[10px] font-semibold tracking-wider text-amber-800/80 dark:text-amber-400/70 uppercase mb-1">
                  {type}
                </h3>
                <div className="space-y-1">
                  {mods.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        onSelect(mod);
                        setSearch("");
                        onOpenChange(false);
                      }}
                      className="w-full text-left p-2.5 rounded-lg border border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{mod.name}</span>
                        <PolarityIcon polarity={mod.polarity} size={14} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {mod.description.replace(/<[^>]+>/g, "").substring(0, 80)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
