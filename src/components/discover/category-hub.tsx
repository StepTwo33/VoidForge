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
import { ACCENT, type AccentColor } from "@/components/page-shell";
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

const CATEGORY_ACCENT: Record<DiscoverCategoryId, AccentColor> = {
  weapon: "blue",
  warframe: "purple",
  companion: "green",
  modular: "orange",
  archwing: "yellow",
  railjack: "rose",
  loadout: "teal",
};

const CATEGORY_HINTS: Partial<Record<DiscoverCategoryId, string>> = {
  weapon: "Primary · Secondary · Melee",
  warframe: "Mods · Arcanes · Shards",
  companion: "Sentinels · Pets · MOAs",
  modular: "Kitguns · Zaws · Amps",
  archwing: "Archwing · Necramech",
  railjack: "Ship · Reactors",
  loadout: "Full kit builds",
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
        const accent = CATEGORY_ACCENT[cat.id];
        const colors = ACCENT[accent];
        const hint = CATEGORY_HINTS[cat.id];
        const featured = cat.id === "loadout";

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "group flex min-h-[9.5rem] flex-col items-start gap-3 rounded-xl border border-border/60 surface-panel p-4 text-left sm:min-h-[10.5rem] sm:p-5",
              "transition-all duration-300 active:scale-[0.99] hover:-translate-y-1 hover:shadow-xl",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              colors.hoverBorder,
              colors.hoverBg,
              colors.shadow,
              featured && "col-span-2 sm:col-span-2 lg:col-span-2",
            )}
          >
            <span className={cn("rounded-lg p-2.5 ring-1 ring-border/40", colors.icon)}>
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block text-sm font-semibold tracking-tight transition-colors sm:text-base",
                  colors.hoverText,
                )}
              >
                {cat.label}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground sm:text-xs">
                {cat.description}
              </span>
              {hint && (
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 sm:text-[11px]",
                    colors.badge,
                  )}
                >
                  {hint}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
