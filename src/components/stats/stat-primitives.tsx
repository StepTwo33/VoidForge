"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Map dark-first Tailwind text tokens to light+dark pairs for readable light mode. */
const LIGHT_SAFE_TEXT: Record<string, string> = {
  "text-sky-400": "text-sky-700 dark:text-sky-400",
  "text-violet-400": "text-violet-700 dark:text-violet-400",
  "text-violet-300": "text-violet-800 dark:text-violet-300",
  "text-yellow-400": "text-yellow-700 dark:text-yellow-400",
  "text-yellow-300": "text-yellow-800 dark:text-yellow-300",
  "text-emerald-400": "text-emerald-700 dark:text-emerald-400",
  "text-lime-400": "text-lime-700 dark:text-lime-400",
  "text-lime-300": "text-lime-800 dark:text-lime-300",
  "text-pink-400": "text-pink-700 dark:text-pink-400",
  "text-pink-300": "text-pink-800 dark:text-pink-300",
  "text-fuchsia-400": "text-fuchsia-700 dark:text-fuchsia-400",
  "text-cyan-400": "text-cyan-700 dark:text-cyan-400",
  "text-cyan-300": "text-cyan-800 dark:text-cyan-300",
  "text-rose-400": "text-rose-700 dark:text-rose-400",
  "text-rose-300": "text-rose-800 dark:text-rose-300",
  "text-amber-400": "text-amber-800 dark:text-amber-400",
  "text-amber-300": "text-amber-800 dark:text-amber-300",
  "text-green-400": "text-green-700 dark:text-green-400",
  "text-orange-400": "text-orange-700 dark:text-orange-400",
  "text-orange-300": "text-orange-800 dark:text-orange-300",
  "text-red-400": "text-red-700 dark:text-red-400",
  "text-teal-400": "text-teal-700 dark:text-teal-400",
  "text-blue-400": "text-blue-700 dark:text-blue-400",
  "text-purple-400": "text-purple-700 dark:text-purple-400",
  "text-purple-300": "text-purple-800 dark:text-purple-300",
  "text-slate-400": "text-slate-700 dark:text-slate-300",
  "text-stone-400": "text-stone-700 dark:text-stone-300",
};

export function toLightSafeTextColor(color?: string): string | undefined {
  if (!color) return color;
  if (color.includes("dark:")) return color;
  return color
    .split(/\s+/)
    .map((token) => {
      const m = token.match(/^(text-[a-z]+-\d+)(\/\d+)?$/);
      if (!m) return token;
      const mapped = LIGHT_SAFE_TEXT[m[1]];
      if (!mapped) return token;
      const op = m[2] || "";
      return op ? mapped.replace(/(text-[a-z]+-\d+)/g, `$1${op}`) : mapped;
    })
    .join(" ");
}

export function StatRow({ label, value, highlighted, color, tooltip, changed }: {
  label: string; value: string; highlighted?: boolean; color?: string; tooltip?: string; changed?: boolean;
}) {
  const safeColor = toLightSafeTextColor(color);
  return (
    <div
      className={cn(
        "group -mx-1 flex min-w-0 items-center justify-between gap-2 rounded px-1.5 py-1 transition-colors duration-500",
        changed && "bg-amber-500/20 ring-1 ring-amber-500/35",
      )}
      title={tooltip}
    >
      <span className={cn("min-w-0 flex-1 break-words text-xs leading-snug", safeColor || "text-muted-foreground", changed && "text-amber-900 dark:text-amber-200")}>
        {label}
      </span>
      <span
        className={cn(
          "stat-readable shrink-0 text-xs font-mono tabular-nums",
          highlighted ? "font-bold text-primary" : safeColor || "text-foreground",
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

