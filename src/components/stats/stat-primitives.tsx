"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronRight, Minus, Plus } from "lucide-react";
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

export function StatRow({ label, value, highlighted, color, tooltip, changed, muted }: {
  label: string; value: string; highlighted?: boolean; color?: string; tooltip?: string; changed?: boolean;
  /** Non-numeric status (e.g. "Manual"): shown as a small muted chip instead of a number. */
  muted?: boolean;
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
      {muted ? (
        <span className="shrink-0 rounded border border-border/70 bg-muted/40 px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {value}
        </span>
      ) : (
        <span
          className={cn(
            "stat-readable shrink-0 text-xs font-mono tabular-nums",
            highlighted ? "font-bold text-primary" : safeColor || "text-foreground",
            changed && "font-semibold text-amber-950 dark:text-amber-100",
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function CollapsibleSection({ title, defaultOpen, children, flash }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode; flash?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  const bodyId = useId();
  return (
    <div
      className={cn(
        "rounded-md transition-colors duration-500",
        flash && "bg-amber-500/10 ring-1 ring-amber-500/25 px-1 -mx-1",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex min-h-11 w-full items-center gap-1.5 py-2 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors lg:pointer-fine:min-h-0",
          flash ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {open ? <ChevronDown className="inline-block h-3.5 w-3.5" /> : <ChevronRight className="inline-block h-3.5 w-3.5" />}
        {title}
        {flash && <span className="ml-1 text-[9px] font-normal normal-case tracking-normal opacity-80">updated</span>}
      </button>
      {open && <div id={bodyId} className="ml-1 min-w-0 overflow-x-hidden">{children}</div>}
    </div>
  );
}
export interface SimSliderPreset {
  label: string;
  value: number;
}

export interface SimSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  subtitle?: string;
  tooltip?: string;
  presets?: SimSliderPreset[];
  formatValue?: (v: number) => string;
  showStepButtons?: boolean;
}

export function SimSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix,
  subtitle,
  tooltip,
  presets,
  formatValue,
  showStepButtons = true,
}: SimSliderProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const safeVal = Math.min(max, Math.max(min, value));
  const pct = max > min ? Math.max(0, Math.min(100, ((safeVal - min) / (max - min)) * 100)) : 0;
  const displayVal = formatValue ? formatValue(safeVal) : `${safeVal}${suffix ? ` ${suffix}` : ""}`;

  // If presets are not explicitly given, but the range is small (e.g. 0 to 5) and integer step:
  // automatically create discrete preset pills for 1-click setting!
  const autoPresets =
    presets == null && min === 0 && max <= 5 && step === 1 && max > min
      ? Array.from({ length: max - min + 1 }, (_, i) => ({
          label: i === max ? `${i} (Max)` : `${i}`,
          value: min + i,
        }))
      : presets;

  return (
    <div
      className="w-full min-w-0 rounded-lg border border-border/50 bg-muted/20 p-2 space-y-1.5 transition-colors hover:border-border/80"
      title={tooltip}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold leading-tight text-foreground/90">{label}</span>
          {subtitle && (
            <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">{subtitle}</span>
          )}
        </div>
        <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums border bg-primary/10 text-primary border-primary/25 shadow-xs">
          {displayVal}
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-1.5">
        {showStepButtons && (
          <button
            type="button"
            disabled={safeVal <= min}
            onClick={() => onChange(clamp(safeVal - step))}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded border border-border/70 bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-30 transition-all lg:pointer-fine:h-6 lg:pointer-fine:w-6 lg:pointer-fine:min-h-0 lg:pointer-fine:min-w-0"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="h-3 w-3" />
          </button>
        )}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={safeVal}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`,
            }}
            className="h-2 min-w-0 w-full cursor-pointer appearance-none rounded-full accent-primary focus:outline-none"
          />
        </div>
        {showStepButtons && (
          <button
            type="button"
            disabled={safeVal >= max}
            onClick={() => onChange(clamp(safeVal + step))}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded border border-border/70 bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-30 transition-all lg:pointer-fine:h-6 lg:pointer-fine:w-6 lg:pointer-fine:min-h-0 lg:pointer-fine:min-w-0"
            aria-label={`Increase ${label}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(clamp(v));
          }}
          className="h-6 w-11 shrink-0 rounded border border-border/70 bg-background px-1 text-center font-mono text-[10px] tabular-nums text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {autoPresets && autoPresets.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {autoPresets.map((p) => {
            const isSelected = safeVal === p.value;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.value)}
                className={cn(
                  "flex-1 min-w-[24px] px-1 py-0.5 rounded text-[9px] font-mono transition-all border text-center",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                    : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

