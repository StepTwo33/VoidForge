"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { getRivenStatsForCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PolarityIcon } from "@/components/polarity-icon";
import {
  DEFAULT_RIVEN_POLARITY,
  RIVEN_MAX_RANK,
  RIVEN_POLARITIES,
  rivenDrainFromRank,
  rivenPolarityError,
  rivenRankFromDrain,
  validateRivenStats,
} from "@/lib/riven/riven-validation";

export interface RivenEditorProps {
  /** Riven stat pool category (rifle / shotgun / pistol / melee / archgun …). */
  poolCategory: string;
  stats: Record<string, number>;
  onStatsChange: (next: Record<string, number>) => void;
  polarity: string;
  onPolarityChange: (p: string) => void;
  /** In-game drain at the chosen rank (10 at rank 0 … 18 at rank 8). */
  drain: number;
  onDrainChange: (n: number) => void;
  /** Show the validation list (hidden until the user has added a stat). */
  showValidation?: boolean;
}

/**
 * Riven stat / polarity / drain editor shared by the mod picker and the /builds riven
 * library (Round 54). Validation lives in lib/riven/riven-validation.
 */
export function RivenEditor({
  poolCategory,
  stats: rivenStats,
  onStatsChange,
  polarity,
  onPolarityChange,
  drain,
  onDrainChange,
  showValidation: showValidationProp,
}: RivenEditorProps) {
  const [rivenStatKey, setRivenStatKey] = useState("");
  const [rivenStatValue, setRivenStatValue] = useState("");
  const [rivenStatSearch, setRivenStatSearch] = useState("");
  const setRivenStats = (fn: (prev: Record<string, number>) => Record<string, number>) => onStatsChange(fn(rivenStats));
  const statValidation = validateRivenStats(rivenStats, poolCategory);
  const polErr = rivenPolarityError(polarity);
  const validation = polErr
    ? { ...statValidation, ok: false, errors: [...statValidation.errors, polErr] }
    : statValidation;
  const rank = rivenRankFromDrain(drain);
  const showValidation = showValidationProp ?? Object.keys(rivenStats).length > 0;

    const rivenPool = getRivenStatsForCategory(poolCategory);
    const availableStats = rivenPool.filter((s) => !s.spliced && !(s.key in rivenStats));
    const canAddSpliced = !rivenPool.some((s) => s.spliced && s.key in rivenStats) && rivenPool.some((s) => s.spliced);
    const availableSplicedStats = canAddSpliced ? rivenPool.filter((s) => s.spliced) : [];

    const q = rivenStatSearch.trim().toLowerCase();
    const filteredNormalStats = q
      ? availableStats.filter((s) => s.label.toLowerCase().includes(q) || s.key.toLowerCase().includes(q))
      : availableStats;
    const filteredSplicedStats = q
      ? availableSplicedStats.filter((s) => s.label.toLowerCase().includes(q) || s.key.toLowerCase().includes(q))
      : availableSplicedStats;

    const selectedStatDef = rivenPool.find((s) => s.key === rivenStatKey);
    const isPercentStat = selectedStatDef ? selectedStatDef.isPercent !== false : true;

    const handleAddRivenStat = () => {
      if (!rivenStatKey || !rivenStatValue) return;
      const num = parseFloat(rivenStatValue);
      if (isNaN(num) || num === 0) return;
      const val = isPercentStat ? num / 100 : num;
      setRivenStats((prev) => ({ ...prev, [rivenStatKey]: val }));
      setRivenStatKey("");
      setRivenStatValue("");
      setRivenStatSearch("");
    };

    return (
      <div className="space-y-3">
        <div className="text-[10px] text-purple-700/70 uppercase tracking-wider dark:text-purple-300/60">
          Configure Riven Stats (2–3 positive, up to 1 negative)
        </div>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Enter values as shown in game; type a minus sign for the negative stat. A riven can carry one spliced trait; it is always positive.
        </p>
        {Object.keys(rivenStats).length > 0 && (
          <div className="space-y-1">
            {Object.entries(rivenStats).map(([key, value]) => {
              const statDef = rivenPool.find((s) => s.key === key);
              const asPercent = statDef?.isPercent !== false;
              return (
                <div key={key} className="flex items-center justify-between text-xs p-1.5 rounded bg-background">
                  <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                    <span className="truncate">{statDef?.spliced ? statDef.label.replace(" (Spliced)", "") : statDef?.label || key}</span>
                    {statDef?.spliced && (
                      <span
                        className="shrink-0 rounded border border-cyan-600/40 bg-cyan-500/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300"
                        title={statDef.displayOnly ? "Spliced trait (Riven Splicer). Shown on the riven; not part of the DPS math." : "Spliced trait (Riven Splicer)"}
                      >
                        Spliced{statDef.displayOnly ? " · info" : ""}
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={value >= 0 ? "cmp-win" : "cmp-lose"}>
                      {value >= 0 ? "+" : ""}
                      {asPercent
                        ? `${(value * 100).toFixed(1)}%`
                        : value.toFixed(1)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRivenStats((prev) => { const n = { ...prev }; delete n[key]; return n; })}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-red-700 dark:hover:text-red-400 sm:h-9 sm:w-9"
                      aria-label="Remove riven stat"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {Object.keys(rivenStats).length < 4 && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stats (e.g. crit, damage, cold)..."
                value={rivenStatSearch}
                onChange={(e) => setRivenStatSearch(e.target.value)}
                className="h-8 w-full rounded border border-border bg-background pl-8 pr-7 text-xs placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {rivenStatSearch && (
                <button
                  type="button"
                  onClick={() => setRivenStatSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Clear stat search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {q && (filteredNormalStats.length > 0 || filteredSplicedStats.length > 0) && (
              <div className="flex flex-wrap gap-1">
                {[...filteredNormalStats, ...filteredSplicedStats].slice(0, 8).map((s) => {
                  const isSelected = rivenStatKey === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setRivenStatKey(s.key)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
                        isSelected
                          ? "border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300"
                          : "border-border bg-muted/40 text-muted-foreground hover:border-purple-500/50 hover:text-foreground",
                      )}
                    >
                      <span>{s.spliced ? s.label.replace(" (Spliced)", "") : s.label}</span>
                      {s.spliced && (
                        <span className="text-[8px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                          spliced
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {q && filteredNormalStats.length === 0 && filteredSplicedStats.length === 0 && (
              <p className="text-[11px] text-muted-foreground italic">
                No stats match &quot;{rivenStatSearch}&quot;
              </p>
            )}

            <div className="flex gap-2">
              <select
                value={rivenStatKey}
                onChange={(e) => setRivenStatKey(e.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded border border-border bg-background px-2 py-2 text-xs sm:min-h-9 sm:py-1.5"
              >
                <option value="">
                  {q
                    ? filteredNormalStats.length + filteredSplicedStats.length > 0
                      ? `Select stat (${filteredNormalStats.length + filteredSplicedStats.length} matching)...`
                      : "No matching stats"
                    : "Select stat..."}
                </option>
                {rivenStatKey && !filteredNormalStats.some((s) => s.key === rivenStatKey) && !filteredSplicedStats.some((s) => s.key === rivenStatKey) && selectedStatDef && (
                  <option value={selectedStatDef.key}>
                    {selectedStatDef.spliced ? selectedStatDef.label.replace(" (Spliced)", "") : selectedStatDef.label} (selected)
                  </option>
                )}
                {filteredNormalStats.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}{s.displayOnly ? " (info only)" : ""}
                  </option>
                ))}
                {filteredSplicedStats.length > 0 && (
                  <optgroup label="Spliced traits (Riven Splicer, max 1)">
                    {filteredSplicedStats.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label.replace(" (Spliced)", "")}{s.displayOnly ? " (info only)" : ""}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <input
                type="number"
                step="0.1"
                placeholder={isPercentStat ? "% value" : "value"}
                value={rivenStatValue}
                onChange={(e) => setRivenStatValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRivenStat();
                  }
                }}
                className="h-11 w-24 shrink-0 rounded border border-border bg-background px-2 text-xs sm:h-9"
              />
              <button
                type="button"
                onClick={handleAddRivenStat}
                disabled={!rivenStatKey || !rivenStatValue}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded bg-purple-600 text-xs text-white transition-colors hover:bg-purple-700 disabled:opacity-40 sm:h-9 sm:w-9"
                title="Add stat"
                aria-label="Add riven stat"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      <div className="grid grid-cols-2 gap-2" data-testid="riven-polarity-drain">
        <label className="space-y-1 text-[11px] text-muted-foreground">
          <span className="block">Polarity</span>
          <div className="flex items-center gap-1.5">
            <PolarityIcon polarity={polarity} size={16} className="shrink-0" />
            <select
              value={polarity}
              onChange={(e) => onPolarityChange(e.target.value)}
              className="min-h-11 min-w-0 flex-1 rounded border border-border bg-background px-2 text-xs text-foreground pointer-fine:min-h-9"
              aria-label="Riven polarity"
            >
              {!RIVEN_POLARITIES.includes(polarity as (typeof RIVEN_POLARITIES)[number]) && (
                <option value={DEFAULT_RIVEN_POLARITY} disabled>Choose…</option>
              )}
              {RIVEN_POLARITIES.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </label>
        <label className="space-y-1 text-[11px] text-muted-foreground">
          <span className="block">Rank · drain</span>
          <select
            value={rank}
            onChange={(e) => onDrainChange(rivenDrainFromRank(parseInt(e.target.value, 10)))}
            className="min-h-11 w-full rounded border border-border bg-background px-2 text-xs text-foreground pointer-fine:min-h-9"
            aria-label="Riven rank"
            data-testid="riven-rank"
          >
            {Array.from({ length: RIVEN_MAX_RANK + 1 }, (_, r) => RIVEN_MAX_RANK - r).map((r) => (
              <option key={r} value={r}>Rank {r} · drain {rivenDrainFromRank(r)}</option>
            ))}
          </select>
        </label>
      </div>
      {showValidation && !validation.ok && (
        <ul className="space-y-0.5 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-2 text-[11px] leading-snug text-red-800 dark:text-red-300" data-testid="riven-validation" role="alert">
          {validation.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      </div>
    );
}
