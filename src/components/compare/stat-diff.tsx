"use client";

import { cn } from "@/lib/utils";

export function fmtCompareNum(n: number, decimals = 0): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(decimals);
}

export function CompareSideHeader({ aLabel = "A", bLabel = "B" }: { aLabel?: string; bLabel?: string }) {
  return (
    <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-border/40 pb-2">
      <span className="min-w-0 truncate text-right text-[10px] font-bold uppercase tracking-wider text-primary">{aLabel}</span>
      <span className="w-[4.75rem] max-w-[5.75rem] shrink-0 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:w-28 sm:max-w-28">
        Diff
      </span>
      <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-wider text-primary">{bLabel}</span>
    </div>
  );
}

export function CompareRow({ label, a, b, higher = "green", format }: {
  label: string;
  a: number | null;
  b: number | null;
  higher?: "green" | "red";
  format?: (v: number) => string;
}) {
  const fmtFn = format || ((v: number) => fmtCompareNum(v));
  const diff = (a ?? 0) - (b ?? 0);
  const aWins = higher === "green" ? diff > 0.01 : diff < -0.01;
  const bWins = higher === "green" ? diff < -0.01 : diff > 0.01;
  const showDelta = a !== null && b !== null && (aWins || bWins);
  const deltaPct = showDelta && b !== 0 && a !== 0
    ? ((a! - b!) / Math.abs(b!)) * 100
    : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-border/20 py-1.5 last:border-b-0">
      <span className={cn(
        "min-w-0 text-right font-mono text-xs tabular-nums",
        a === null ? "text-muted-foreground/50" : aWins ? "cmp-win" : bWins ? "cmp-lose" : ""
      )}>
        <span className="mr-1 font-sans text-[9px] font-semibold uppercase text-muted-foreground sm:hidden">A</span>
        {a !== null ? fmtFn(a) : "–"}
      </span>
      <span className="w-[4.75rem] max-w-[5.75rem] shrink-0 break-words text-center text-[11px] font-medium leading-tight text-muted-foreground sm:w-28 sm:max-w-28">
        <span className="block">{label}</span>
        {showDelta && (
          <span className={cn("mt-0.5 block break-words font-mono text-[10px] tabular-nums", aWins ? "cmp-win" : "cmp-lose")}>
            {aWins ? "A" : "B"} ahead
            {deltaPct !== null && Number.isFinite(deltaPct) ? ` · ${Math.abs(deltaPct) >= 10 ? Math.round(Math.abs(deltaPct)) : Math.abs(deltaPct).toFixed(1)}%` : ""}
          </span>
        )}
      </span>
      <span className={cn(
        "min-w-0 font-mono text-xs tabular-nums",
        b === null ? "text-muted-foreground/50" : bWins ? "cmp-win" : aWins ? "cmp-lose" : ""
      )}>
        <span className="mr-1 font-sans text-[9px] font-semibold uppercase text-muted-foreground sm:hidden">B</span>
        {b !== null ? fmtFn(b) : "–"}
      </span>
    </div>
  );
}
