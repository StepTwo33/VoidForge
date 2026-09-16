"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatRow({ label, value, highlighted, color, tooltip, changed }: {
  label: string; value: string; highlighted?: boolean; color?: string; tooltip?: string; changed?: boolean;
}) {
  return (
    <div
      className={cn(
        "group -mx-1 flex min-w-0 items-center justify-between gap-2 rounded px-1.5 py-1 transition-colors duration-500",
        changed && "bg-amber-500/20 ring-1 ring-amber-500/35",
      )}
      title={tooltip}
    >
      <span className={cn("min-w-0 flex-1 break-words text-xs leading-snug", color || "text-muted-foreground", changed && "text-amber-900 dark:text-amber-200")}>
        {label}
      </span>
      <span
        className={cn(
          "stat-readable shrink-0 text-xs font-mono tabular-nums",
          highlighted ? "font-bold text-primary" : color || "text-foreground",
          changed && "font-semibold text-amber-950 dark:text-amber-100",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CollapsibleSection({ title, defaultOpen, children, flash }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode; flash?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div
      className={cn(
        "rounded-md transition-colors duration-500",
        flash && "bg-amber-500/10 ring-1 ring-amber-500/25 px-1 -mx-1",
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex min-h-11 w-full items-center gap-1.5 py-2 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors sm:min-h-0",
          flash ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {open ? <ChevronDown className="inline-block h-3.5 w-3.5" /> : <ChevronRight className="inline-block h-3.5 w-3.5" />}
        {title}
        {flash && <span className="ml-1 text-[9px] font-normal normal-case tracking-normal opacity-80">updated</span>}
      </button>
      {open && <div className="ml-1 min-w-0 overflow-x-hidden">{children}</div>}
    </div>
  );
}
export function SimSlider({ label, value, min, max, onChange, suffix, tooltip }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; suffix?: string; tooltip?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="w-full min-w-0 space-y-0.5" title={tooltip}>
      <span className="block text-[11px] leading-tight text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={Math.min(value, max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 min-w-0 flex-1 cursor-pointer accent-primary"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(clamp(v));
          }}
          className="h-11 w-14 shrink-0 rounded border border-border bg-background px-1.5 py-0.5 text-right font-mono text-[11px] tabular-nums [appearance:textfield] sm:h-8 sm:w-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="shrink-0 text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

