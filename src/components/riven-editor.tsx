"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { getRivenStatsForCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PolarityIcon } from "@/components/polarity-icon";
import {
  STANDARD_RIVEN_DISPOSITION,
  getNegativeStatsWithDisposition,
  getStatsWithDisposition,
  isValueInStatRange,
  type RivenStat,
} from "@/lib/calc/riven-calculator";
import {
  DEFAULT_RIVEN_POLARITY,
  RIVEN_MAX_RANK,
  RIVEN_POLARITIES,
  graderRivenCategory,
  isRivenBuff,
  rivenDrainFromRank,
  rivenPolarityError,
  rivenRankFromDrain,
  validateRivenStats,
} from "@/lib/riven/riven-validation";

function formatExpectedRange(stat: RivenStat | undefined, key: string, isCurse: boolean): string {
  if (!stat) return "";
  const lo = Math.min(Math.abs(stat.minValue), Math.abs(stat.maxValue));
  const hi = Math.max(Math.abs(stat.minValue), Math.abs(stat.maxValue));
  if (key.startsWith("faction") || stat.name.startsWith("Damage to ") || stat.name.startsWith("Damage vs ")) {
    if (isCurse) {
      return `${Math.max(0.01, 1 - hi / 100).toFixed(2)}–${Math.max(0.01, 1 - lo / 100).toFixed(2)}x`;
    }
    return `${(1 + lo / 100).toFixed(2)}–${(1 + hi / 100).toFixed(2)}x`;
  }
  if (key === "recoil") {
    return isCurse ? `+${lo.toFixed(1)}–${hi.toFixed(1)}%` : `-${hi.toFixed(1)} to -${lo.toFixed(1)}%`;
  }
  const sign = isCurse ? "-" : "+";
  if (stat.type === "percent") return `${sign}${lo.toFixed(1)}–${hi.toFixed(1)}%`;
  if (stat.type === "seconds") return `${sign}${lo.toFixed(1)}–${hi.toFixed(1)}s`;
  return `${sign}${lo.toFixed(1)}–${hi.toFixed(1)}m`;
}

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
    const hasExistingSpliced = rivenPool.some((s) => s.spliced && s.key in rivenStats);
    // Allow browsing all spliced traits even if one is equipped so user can easily switch
    const availableSplicedStats = rivenPool.filter((s) => s.spliced && !(s.key in rivenStats));

    const canAddNormal = Object.keys(rivenStats).length < 4;
    const canSwitchSpliced = hasExistingSpliced || canAddNormal;
    const q = rivenStatSearch.trim().toLowerCase();
    const filteredNormalStats = canAddNormal
      ? (q ? availableStats.filter((s) => s.label.toLowerCase().includes(q) || s.key.toLowerCase().includes(q)) : availableStats)
      : [];
    const filteredSplicedStats = canSwitchSpliced
      ? (q ? availableSplicedStats.filter((s) => s.label.toLowerCase().includes(q) || s.key.toLowerCase().includes(q)) : availableSplicedStats)
      : [];

    const selectedStatDef = rivenPool.find((s) => s.key === rivenStatKey);
    const isFactionStat = rivenStatKey.startsWith("faction");
    const isPercentStat = selectedStatDef ? selectedStatDef.isPercent !== false && !isFactionStat : true;

    const gradeCat = graderRivenCategory(poolCategory);
    const { existingPositives, existingNegatives } = useMemo(() => {
      let pos = 0;
      let neg = 0;
      for (const [k, v] of Object.entries(rivenStats)) {
        if (isRivenBuff(k, v)) pos++;
        else neg++;
      }
      return { existingPositives: pos, existingNegatives: neg };
    }, [rivenStats]);

    const shapePositiveCount = Math.max(2, Math.min(3, existingPositives || 2));
    const shapeHasNegative = existingNegatives > 0;

    const addedPosPool = useMemo(
      () =>
        getStatsWithDisposition(gradeCat, STANDARD_RIVEN_DISPOSITION, {
          rank,
          positiveCount: shapePositiveCount,
          hasNegative: shapeHasNegative,
          includeSpliced: true,
        }),
      [gradeCat, rank, shapePositiveCount, shapeHasNegative],
    );

    const addedNegPool = useMemo(
      () =>
        getNegativeStatsWithDisposition(STANDARD_RIVEN_DISPOSITION, {
          rank,
          positiveCount: shapePositiveCount,
          hasNegative: true,
          category: gradeCat,
        }),
      [gradeCat, rank, shapePositiveCount],
    );

    const nextPosCount = Math.max(2, Math.min(3, existingPositives + 1));
    const previewPosPool = useMemo(
      () =>
        getStatsWithDisposition(gradeCat, STANDARD_RIVEN_DISPOSITION, {
          rank,
          positiveCount: nextPosCount,
          hasNegative: shapeHasNegative,
          includeSpliced: true,
        }),
      [gradeCat, rank, nextPosCount, shapeHasNegative],
    );

    const selectedCleanLabel = selectedStatDef
      ? (selectedStatDef.spliced ? selectedStatDef.label.replace(" (Spliced)", "") : selectedStatDef.label).trim()
      : "";
    const selectedPosRange = selectedCleanLabel
      ? previewPosPool.find((p) => p.name.replace(" (Spliced)", "").trim() === selectedCleanLabel)
      : undefined;
    const selectedNegRange =
      selectedCleanLabel && !selectedStatDef?.spliced && existingNegatives === 0
        ? addedNegPool.find((p) => p.name.replace(" (Spliced)", "").trim() === selectedCleanLabel)
        : undefined;

    const fillMidpointValue = (poolStat: RivenStat, asCurse: boolean) => {
      const mid = (Math.abs(poolStat.minValue) + Math.abs(poolStat.maxValue)) / 2;
      if (isFactionStat) {
        const mult = asCurse ? Math.max(0.05, 1 - mid / 100) : 1 + mid / 100;
        setRivenStatValue(mult.toFixed(2));
        return;
      }
      if (rivenStatKey === "recoil") {
        setRivenStatValue((asCurse ? mid : -mid).toFixed(1));
        return;
      }
      setRivenStatValue((asCurse ? -mid : mid).toFixed(1));
    };

    const handleAddRivenStat = () => {
      if (!rivenStatKey || !rivenStatValue) return;
      const num = parseFloat(rivenStatValue);
      if (isNaN(num) || num === 0) return;
      let val: number;
      if (isFactionStat) {
        // Faction damage: user enters multiplier e.g. 1.55 (or 55 for +55%)
        val = num >= 1 ? num - 1 : num > 0 ? num - 1 : num <= -1 ? num / 100 : num;
      } else {
        val = isPercentStat ? num / 100 : num;
      }
      setRivenStats((prev) => {
        const next = { ...prev };
        if (selectedStatDef?.spliced) {
          // If switching to another spliced stat, remove the existing spliced stat
          for (const k of Object.keys(next)) {
            if (rivenPool.some((p) => p.spliced && p.key === k)) {
              delete next[k];
            }
          }
        }
        next[rivenStatKey] = val;
        return next;
      });
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
              const isFac = key.startsWith("faction");
              const buff = isRivenBuff(key, value);
              const cleanLabel = statDef
                ? (statDef.spliced ? statDef.label.replace(" (Spliced)", "") : statDef.label).trim()
                : "";
              const poolStat = cleanLabel
                ? (buff ? addedPosPool : addedNegPool).find(
                    (p) => p.name.replace(" (Spliced)", "").trim() === cleanLabel,
                  )
                : undefined;
              const checkVal = asPercent || isFac ? Math.abs(value) * 100 : Math.abs(value);
              const outOfBand =
                !!poolStat &&
                value !== 0 &&
                !isValueInStatRange(key === "recoil" && buff ? -checkVal : buff ? checkVal : -checkVal, poolStat);
              const rangeText = formatExpectedRange(poolStat, key, !buff);
              return (
                <div key={key} className="rounded bg-background p-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
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
                      <span className={buff ? "cmp-win" : "cmp-lose"}>
                        {isFac
                          ? `${(1 + value).toFixed(2)}x`
                          : `${value >= 0 ? "+" : ""}${asPercent ? `${(value * 100).toFixed(1)}%` : value.toFixed(1)}`}
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
                  {rangeText && (
                    <div
                      className={cn(
                        "mt-0.5 text-[10px]",
                        outOfBand
                          ? "font-medium text-amber-700 dark:text-amber-400"
                          : "text-muted-foreground/80",
                      )}
                      data-testid="riven-stat-expected-range"
                    >
                      Typical {buff ? "range" : "curse"} (R{rank}, {shapePositiveCount}+{shapeHasNegative ? 1 : 0}):{" "}
                      <span className="font-mono">{rangeText}</span>
                      {outOfBand ? " · outside standard 1.2 band" : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {(Object.keys(rivenStats).length < 4 || hasExistingSpliced) && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stats"
                aria-label="Search stats, for example crit, damage, or cold"
                value={rivenStatSearch}
                onChange={(e) => setRivenStatSearch(e.target.value)}
                className="h-11 w-full rounded border border-border bg-background pl-8 pr-7 text-sm placeholder:text-muted-foreground focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:h-9 sm:text-xs"
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
                  <optgroup label={hasExistingSpliced ? "Switch spliced trait (replaces current)" : "Spliced traits (Riven Splicer, max 1)"}>
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
                step="0.01"
                placeholder={isFactionStat ? "e.g. 1.55" : isPercentStat ? "% value" : "value"}
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
            {rivenStatKey && (selectedPosRange || selectedNegRange) && (
              <div
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-purple-500/25 bg-purple-500/5 px-2.5 py-1.5 text-[11px]"
                data-testid="riven-expected-range"
              >
                <div className="min-w-0 space-y-0.5">
                  {selectedPosRange && (
                    <p className="text-purple-900 dark:text-purple-200">
                      <span className="text-muted-foreground">
                        Expected buff (R{rank}, {nextPosCount}+{shapeHasNegative ? 1 : 0}):
                      </span>{" "}
                      <span className="font-mono font-semibold">
                        {formatExpectedRange(selectedPosRange, rivenStatKey, false)}
                      </span>
                    </p>
                  )}
                  {selectedNegRange && (
                    <p className="text-muted-foreground">
                      <span>Curse range:</span>{" "}
                      <span className="font-mono text-red-700 dark:text-red-300">
                        {formatExpectedRange(selectedNegRange, rivenStatKey, true)}
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {selectedPosRange && (
                    <button
                      type="button"
                      onClick={() => fillMidpointValue(selectedPosRange, false)}
                      className="rounded border border-purple-500/35 bg-background px-2 py-0.5 text-[10px] font-medium text-purple-700 transition-colors hover:bg-purple-500/15 dark:text-purple-300"
                    >
                      Fill avg buff
                    </button>
                  )}
                  {selectedNegRange && (
                    <button
                      type="button"
                      onClick={() => fillMidpointValue(selectedNegRange, true)}
                      className="rounded border border-red-500/35 bg-background px-2 py-0.5 text-[10px] font-medium text-red-700 transition-colors hover:bg-red-500/15 dark:text-red-300"
                    >
                      Fill avg curse
                    </button>
                  )}
                </div>
              </div>
            )}
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
