"use client";

import { GameAssetImage } from "@/components/game-asset-image";
import { cn } from "@/lib/utils";
import type { DiscoverCatalogItem } from "@/lib/builds/discover-subtypes";

export function DiscoverItemGrid({
  items,
  counts,
  onSelect,
}: {
  items: DiscoverCatalogItem[];
  counts: Record<string, number>;
  onSelect: (item: DiscoverCatalogItem) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">No items in this category.</p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6">
      {items.map((item) => {
        const count = counts[item.id] ?? 0;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "group flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/30 p-2 text-center transition-all",
              "hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            )}
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-muted/30 sm:h-20 sm:w-20">
              {item.image ? (
                <GameAssetImage
                  src={item.image}
                  alt=""
                  width={80}
                  height={80}
                  className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                  hideOnError
                />
              ) : (
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  {item.name.slice(0, 3)}
                </span>
              )}
            </div>
            <span className="line-clamp-2 w-full text-[11px] font-medium leading-tight text-foreground sm:text-xs">
              {item.name}
            </span>
            <span
              className={cn(
                "text-[10px] tabular-nums",
                count > 0 ? "text-primary" : "text-muted-foreground/70",
              )}
            >
              {count === 1 ? "1 build" : `${count} builds`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
