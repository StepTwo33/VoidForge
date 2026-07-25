"use client";

import { useState, useMemo, useCallback } from "react";
import { PageShell, PageMain, PageHero, FilterChip } from "@/components/page-shell";
import { allWeapons } from "@/data/weapons";
import { getDispositionInfo } from "@/data/riven-dispositions";
import {
  RivenMod, RivenStat,
  evaluateRiven, getRivenGrade, getGradeColor,
  getRerollCost,
  getStatsWithDisposition, getNegativeStatsWithDisposition,
  getStatTier, getStatTierColor, isValueInStatRange,
} from "@/lib/calc/riven-calculator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const weaponTypes = ["Rifle", "Shotgun", "Pistol", "Melee", "Archgun"];

function getWeaponTypeFromCategory(cat: string): string {
  const c = cat.toLowerCase();
  if (["rifle", "primary", "bow", "launcher"].includes(c)) return "Rifle";
  if (c === "shotgun") return "Shotgun";
  if (["pistol", "secondary"].includes(c)) return "Pistol";
  if (c === "melee") return "Melee";
  if (c === "archgun") return "Archgun";
  return "Rifle";
}

function formatRangeHint(stat: RivenStat | undefined): string {
  if (!stat) return "";
  const lo = Math.min(Math.abs(stat.minValue), Math.abs(stat.maxValue));
  const hi = Math.max(Math.abs(stat.minValue), Math.abs(stat.maxValue));
  if (stat.type === "percent") return `${lo.toFixed(0)}–${hi.toFixed(0)}%`;
  if (stat.type === "seconds") return `${lo.toFixed(1)}–${hi.toFixed(1)}s`;
  return `${lo.toFixed(1)}–${hi.toFixed(1)}`;
}

export default function RivenCalculatorPage() {
  const [selectedWeaponType, setSelectedWeaponType] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [weaponSearch, setWeaponSearch] = useState("");

  const [graderPositives, setGraderPositives] = useState<{ name: string; value: number }[]>([]);
  const [graderNegative, setGraderNegative] = useState<{ name: string; value: number } | null>(null);
  const graderPolarity = "madurai";
  const graderRank = 8;
  const graderRerolls = 0;

  const filteredWeapons = useMemo(() => {
    let weapons = allWeapons.filter((w) => w.hasRivenSlot !== false);
    if (selectedWeaponType) {
      weapons = weapons.filter(
        (w) => getWeaponTypeFromCategory(w.category) === selectedWeaponType
      );
    }
    if (weaponSearch.trim()) {
      const q = weaponSearch.toLowerCase();
      weapons = weapons.filter((w) => w.name.toLowerCase().includes(q));
    }
    return weapons.sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedWeaponType, weaponSearch]);

  const dispositionInfo = selectedWeapon
    ? getDispositionInfo(selectedWeapon)
    : { value: 1.0, known: false };
  const disposition = dispositionInfo.value;

  const rangeOptions = useMemo(
    () => ({
      positiveCount: Math.max(1, graderPositives.filter((s) => s.name).length || 2),
      hasNegative: !!(graderNegative && graderNegative.name),
      rank: graderRank,
    }),
    [graderPositives, graderNegative, graderRank],
  );

  const scaledPositivePool = useMemo(() => {
    if (!selectedWeaponType) return [];
    return getStatsWithDisposition(selectedWeaponType.toLowerCase(), disposition, rangeOptions);
  }, [selectedWeaponType, disposition, rangeOptions]);

  const scaledNegativePool = useMemo(
    () => getNegativeStatsWithDisposition(disposition, rangeOptions),
    [disposition, rangeOptions],
  );

  const handleGrade = useCallback((): { score: number; grade: string; color: string } | null => {
    if (!selectedWeapon || graderPositives.length === 0) return null;
    const posStats: RivenStat[] = graderPositives
      .filter((s) => s.name)
      .map((s) => {
        const pool = scaledPositivePool.find((p) => p.name === s.name);
        return {
          name: s.name,
          type: pool?.type ?? "percent",
          baseValue: s.value,
          minValue: pool?.minValue ?? s.value * 0.5,
          maxValue: pool?.maxValue ?? s.value * 1.5,
        };
      });
    const negPool = graderNegative?.name
      ? scaledNegativePool.find((p) => p.name === graderNegative.name)
      : undefined;
    const negStat: RivenStat | null = graderNegative && graderNegative.name
      ? {
          name: graderNegative.name,
          type: negPool?.type ?? "percent",
          baseValue: -Math.abs(graderNegative.value),
          minValue: negPool?.minValue ?? -Math.abs(graderNegative.value) * 1.5,
          maxValue: negPool?.maxValue ?? -Math.abs(graderNegative.value) * 0.5,
        }
      : null;
    const riven: RivenMod = {
      weaponName: selectedWeapon,
      polarity: graderPolarity,
      rank: graderRank,
      rerolls: graderRerolls,
      positiveStats: posStats,
      negativeStat: negStat,
      disposition,
    };
    const score = evaluateRiven(riven);
    const grade = getRivenGrade(score);
    const color = getGradeColor(grade);
    return { score, grade, color };
  }, [
    selectedWeapon,
    graderPositives,
    graderNegative,
    graderPolarity,
    graderRank,
    graderRerolls,
    disposition,
    scaledPositivePool,
    scaledNegativePool,
  ]);

  const gradeResult = handleGrade();

  const availablePositiveStats = useMemo(() => {
    const usedNames = new Set(graderPositives.map((s) => s.name));
    return scaledPositivePool.filter((s) => !usedNames.has(s.name));
  }, [scaledPositivePool, graderPositives]);

  return (
    <PageShell>
      <PageMain maxWidth="lg" className="py-6">
        <PageHero
          icon={Sparkles}
          accent="purple"
          title="Riven Grader"
          description="Enter the stats from your in-game riven to grade it against disposition-scaled ranges."
        />

        <div className="flex flex-wrap gap-2 mb-4">
          {weaponTypes.map((type) => (
            <FilterChip
              key={type}
              active={selectedWeaponType === type}
              onClick={() => { setSelectedWeaponType(type); setSelectedWeapon(null); }}
            >
              {type}
            </FilterChip>
          ))}
        </div>

          {selectedWeaponType && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search weapons..."
                  value={weaponSearch}
                  onChange={(e) => setWeaponSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              {!selectedWeapon ? (
                <ScrollArea className="h-48 mb-4">
                  <div className="space-y-1 pr-4">
                    {filteredWeapons.map((w) => {
                      const info = getDispositionInfo(w.name);
                      const dispColor = !info.known
                        ? "text-muted-foreground"
                        : info.value >= 1.3 ? "text-green-400"
                        : info.value >= 1.0 ? "text-blue-400"
                        : info.value >= 0.8 ? "text-orange-400"
                        : "text-red-400";
                      return (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWeapon(w.name)}
                          className="w-full text-left p-2 rounded-lg border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">{w.name}</span>
                          <span className={cn("text-xs font-mono", dispColor)}>
                            {info.known ? info.value.toFixed(2) : "?"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 border border-purple-500/30 bg-purple-500/5 rounded-lg">
                  <span className="font-medium">{selectedWeapon}</span>
                  <span className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded",
                    !dispositionInfo.known ? "bg-amber-500/10 text-amber-400" :
                    disposition >= 1.3 ? "bg-green-500/10 text-green-400" :
                    disposition >= 1.0 ? "bg-blue-500/10 text-blue-400" :
                    disposition >= 0.8 ? "bg-orange-500/10 text-orange-400" : "bg-red-500/10 text-red-400"
                  )}>
                    Disposition: {disposition.toFixed(2)}
                    {!dispositionInfo.known ? " (unknown)" : ""}
                  </span>
                  <button onClick={() => { setSelectedWeapon(null); }} className="ml-auto text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                  {!dispositionInfo.known && (
                    <p className="w-full text-xs text-amber-400/90">
                      No disposition on file for this weapon — ranges use 1.00 as a fallback.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {selectedWeapon && (
            <div className="space-y-4">
              <div className="border border-border rounded-xl p-4 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">POSITIVE STATS ({graderPositives.length}/3)</h3>
                  {graderPositives.length < 3 && (
                    <button
                      onClick={() => setGraderPositives([...graderPositives, { name: "", value: 0 }])}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Stat
                    </button>
                  )}
                </div>
                {graderPositives.map((stat, i) => {
                  const poolStat = scaledPositivePool.find((s) => s.name === stat.name);
                  const outOfRange = poolStat && stat.name && stat.value !== 0 && !isValueInStatRange(stat.value, poolStat);
                  return (
                    <div key={i} className="mb-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={stat.name}
                          onChange={(e) => {
                            const newStats = [...graderPositives];
                            const picked = scaledPositivePool.find((s) => s.name === e.target.value);
                            newStats[i] = {
                              name: e.target.value,
                              value: picked ? Math.round(((picked.minValue + picked.maxValue) / 2) * 10) / 10 : 0,
                            };
                            setGraderPositives(newStats);
                          }}
                          className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm"
                        >
                          <option value="">Select stat...</option>
                          {(stat.name
                            ? [{ name: stat.name, minValue: 0, maxValue: 0, type: "percent" as const }, ...availablePositiveStats]
                            : availablePositiveStats
                          ).map((s) => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          value={stat.value || ""}
                          onChange={(e) => {
                            const newStats = [...graderPositives];
                            newStats[i] = { ...newStats[i], value: parseFloat(e.target.value) || 0 };
                            setGraderPositives(newStats);
                          }}
                          className={cn("w-24 h-8 text-sm", outOfRange && "border-amber-500/60")}
                          placeholder={poolStat?.type === "percent" ? "%" : poolStat?.type === "seconds" ? "s" : ""}
                        />
                        <button onClick={() => setGraderPositives(graderPositives.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {poolStat && (
                        <p className={cn("text-[10px] mt-0.5 pl-0.5", outOfRange ? "text-amber-400" : "text-muted-foreground")}>
                          Typical range @ disp {disposition.toFixed(2)}: {formatRangeHint(poolStat)}
                          {outOfRange ? " — outside expected band" : ""}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border border-border rounded-xl p-4 bg-card">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">NEGATIVE STAT (Optional)</h3>
                {graderNegative ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <select
                        value={graderNegative.name}
                        onChange={(e) => {
                          const picked = scaledNegativePool.find((s) => s.name === e.target.value);
                          setGraderNegative({
                            name: e.target.value,
                            value: picked ? Math.round(Math.abs((picked.minValue + picked.maxValue) / 2) * 10) / 10 : 0,
                          });
                        }}
                        className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-sm"
                      >
                        <option value="">Select stat...</option>
                        {scaledNegativePool.map((s) => (
                          <option key={s.name} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        value={graderNegative.value || ""}
                        onChange={(e) => setGraderNegative({ ...graderNegative, value: parseFloat(e.target.value) || 0 })}
                        className="w-24 h-8 text-sm"
                        placeholder="%"
                      />
                      <button onClick={() => setGraderNegative(null)} className="text-red-400 hover:text-red-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {graderNegative.name && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Typical curse magnitude: {formatRangeHint(scaledNegativePool.find((s) => s.name === graderNegative.name))}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setGraderNegative({ name: "", value: 0 })}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Negative
                  </button>
                )}
              </div>

              {gradeResult && (
                <div className="border rounded-xl p-6 bg-card" style={{ borderColor: gradeResult.color + "50" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Grade</span>
                      <p className="text-2xl font-bold" style={{ color: gradeResult.color }}>{gradeResult.grade}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <p className="text-2xl font-mono font-bold" style={{ color: gradeResult.color }}>{gradeResult.score.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {graderPositives.filter((s) => s.name).map((s, i) => {
                      const tier = getStatTier(s.name);
                      return (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: getStatTierColor(tier) + "20", color: getStatTierColor(tier) }}>
                          {tier}: {s.name}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3">
                    Grade is a community heuristic (stat weights + curse quality), not market price or DPS uplift.
                  </p>
                </div>
              )}

              <div className="border border-border rounded-xl p-4 bg-card">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">REROLL KUVA COST</h3>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="text-center p-1 bg-background rounded">
                      <div className="text-muted-foreground">#{i}</div>
                      <div className="font-mono">{getRerollCost(i)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </PageMain>
    </PageShell>
  );
}
