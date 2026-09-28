"use client";

import {
  ENEMY_LEVEL_INPUT_MAX,
  ENEMY_LEVEL_MIN,
  ENEMY_LEVEL_SLIDER_MAX,
} from "@/lib/calc/sim-limits";
import { cn } from "@/lib/utils";

/**
 * Enemy level control: convenience slider (1–200) + number input up to 9999.
 * Optional Steel Path toggle applies ×2.5 HP/Shield after level scaling.
 */
export function EnemyLevelControl({
  value,
  onChange,
  className,
  label = "Level",
  steelPath,
  onSteelPathChange,
}: {
  value: number;
  onChange: (level: number) => void;
  className?: string;
  label?: string;
  /** When provided with onSteelPathChange, shows an SP toggle. */
  steelPath?: boolean;
  onSteelPathChange?: (steelPath: boolean) => void;
}) {
  const clamp = (v: number) =>
    Math.min(ENEMY_LEVEL_INPUT_MAX, Math.max(ENEMY_LEVEL_MIN, Math.round(v)));
  const showSp = typeof steelPath === "boolean" && typeof onSteelPathChange === "function";

  return (
    <div className={cn("w-full min-w-0 space-y-1", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{label}</span>
          {showSp && (
            <button
              type="button"
              onClick={() => onSteelPathChange!(!steelPath)}
              title="Steel Path: ×2.5 Health & Shields after level scaling (armor unchanged)"
              aria-pressed={steelPath}
              className={cn(
                "inline-flex h-6 shrink-0 items-center rounded border px-1.5 text-[9px] font-semibold tracking-wide transition-colors",
                steelPath
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-900 dark:text-amber-300"
                  : "border-border/60 text-muted-foreground hover:border-amber-500/40 hover:text-foreground",
              )}
            >
              SP
            </button>
          )}
        </div>
        <input
          type="number"
          min={ENEMY_LEVEL_MIN}
          max={ENEMY_LEVEL_INPUT_MAX}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isNaN(v)) onChange(clamp(v));
          }}
          className="h-11 w-16 shrink-0 rounded border border-border bg-background px-1.5 py-1 text-right font-mono text-base [appearance:textfield] sm:h-8 sm:w-14 sm:text-[10px] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <input
        type="range"
        min={ENEMY_LEVEL_MIN}
        max={ENEMY_LEVEL_SLIDER_MAX}
        value={Math.min(value, ENEMY_LEVEL_SLIDER_MAX)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full min-w-0 cursor-pointer accent-primary touch-manipulation sm:h-1.5"
      />
      {value > ENEMY_LEVEL_SLIDER_MAX && (
        <p className="text-[9px] text-muted-foreground/80">
          Above slider range — using level {value}
        </p>
      )}
      {showSp && steelPath && (
        <p className="text-[9px] text-amber-800/80 dark:text-amber-400/80">
          Steel Path · ×2.5 HP/Shield · set level to node+100 for star-chart SP
        </p>
      )}
    </div>
  );
}
