"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { StatSummaryItem } from "@/lib/ui/mobile-stat-summary";
import { cn } from "@/lib/utils";

/**
 * Phone/tablet-only (below lg) live summary of the key stats. Stays visible in the
 * sticky mods header while mods scroll underneath. Can collapse to a one-line strip;
 * does not cover the bottom mobile section nav (it sticks under the site header).
 */
export function MobileStatSummary({
  items,
  extraItems = [],
  className,
  statsSectionId = "build-stats",
}: {
  items: StatSummaryItem[];
  extraItems?: StatSummaryItem[];
  className?: string;
  statsSectionId?: string;
}) {
  const [collapsed, setCollapsed] = useState(true);
  if (items.length === 0) return null;

  const openStats = () => {
    document
      .querySelector<HTMLElement>(`[data-builder-section-nav] [role="tab"][aria-controls="${statsSectionId}"]`)
      ?.click();
  };

  const allItems = [...items, ...extraItems];
  const summaryLabel = `Key stats: ${allItems.map((i) => `${i.title} ${i.value}`).join(", ")}`;

  const renderGridRow = (row: StatSummaryItem[], borderedTop = false) => (
    <span
      className={cn(
        "grid w-full gap-1",
        borderedTop && "mt-1 border-t border-border/40 pt-1",
      )}
      style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}
    >
      {row.map((i) => (
        <span key={i.key} title={i.title} className="min-w-0">
          <span className="block truncate text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{i.label}</span>
          <span className="block truncate font-mono text-xs tabular-nums text-foreground">{i.value}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      data-testid="mobile-stat-summary"
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "basis-full w-full flex items-center gap-0.5 rounded-md border border-border/50 bg-secondary/40 text-center lg:hidden",
        className,
      )}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label={`${summaryLabel}. Expand.`}
          className="min-h-11 min-w-0 flex-1 truncate px-2 text-left text-xs font-mono tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {items.slice(0, 4).map((i) => `${i.label} ${i.value}`).join(" · ")}
        </button>
      ) : (
        <button
          type="button"
          onClick={openStats}
          aria-label={`${summaryLabel}. Tap to open all stats.`}
          className="min-h-11 min-w-0 flex-1 px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {renderGridRow(items)}
          {extraItems.length > 0 && renderGridRow(extraItems, true)}
        </button>
      )}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand key stats" : "Collapse key stats"}
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
    </div>
  );
}
