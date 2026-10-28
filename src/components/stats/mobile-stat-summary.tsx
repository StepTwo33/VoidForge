"use client";

import type { StatSummaryItem } from "@/lib/ui/mobile-stat-summary";
import { cn } from "@/lib/utils";

/**
 * Phone/tablet-only (below lg) live summary of the key stats, shown in the sticky header of the
 * Mods view so the numbers stay visible while mods are being picked. Tapping it opens the Stats
 * view (the full panel). Display only: the values are the same numbers the full panel shows.
 */
export function MobileStatSummary({
  items,
  className,
  statsSectionId = "build-stats",
}: {
  items: StatSummaryItem[];
  className?: string;
  statsSectionId?: string;
}) {
  if (items.length === 0) return null;
  const openStats = () => {
    document
      .querySelector<HTMLElement>(`[data-builder-section-nav] [role="tab"][aria-controls="${statsSectionId}"]`)
      ?.click();
  };
  return (
    <button
      type="button"
      onClick={openStats}
      data-testid="mobile-stat-summary"
      aria-label={`Key stats: ${items.map((i) => `${i.title} ${i.value}`).join(", ")}. Tap to open all stats.`}
      className={cn(
        "basis-full w-full grid gap-1 rounded-md border border-border/50 bg-secondary/40 px-2 py-1 text-center active:bg-secondary/70 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((i) => (
        <span key={i.key} title={i.title} className="min-w-0">
          <span className="block truncate text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{i.label}</span>
          <span className="block truncate font-mono text-xs tabular-nums text-foreground">{i.value}</span>
        </span>
      ))}
    </button>
  );
}
