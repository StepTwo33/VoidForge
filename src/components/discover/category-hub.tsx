"use client";

import type { LucideIcon } from "lucide-react";
import {
  Crosshair,
  User,
  PawPrint,
  Puzzle,
  Plane,
  Ship,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DISCOVER_CATEGORIES,
  type DiscoverCategoryId,
} from "@/lib/builds/discover-subtypes";

const CATEGORY_ICONS: Record<DiscoverCategoryId, LucideIcon> = {
  weapon: Crosshair,
  warframe: User,
  companion: PawPrint,
  modular: Puzzle,
  archwing: Plane,
  railjack: Ship,
  loadout: LayoutGrid,
};

export function DiscoverCategoryHub({
  onSelect,
}: {
  onSelect: (type: DiscoverCategoryId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {DISCOVER_CATEGORIES.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.id];
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "group flex min-h-[8.5rem] flex-col items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 text-left transition-all",
              "hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            )}
          >
            <span className="rounded-lg bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/15">
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight sm:text-base">{cat.label}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground sm:text-xs">
                {cat.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
