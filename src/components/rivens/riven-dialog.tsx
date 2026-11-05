"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Plus, Sparkles, RefreshCw, Dice6 } from "lucide-react";
import { allWeapons } from "@/data/weapons";
import type { Weapon } from "@/lib/types";
import { getRivenWeaponType, type RivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import {
  getBaseRivenWeapons,
  getEffectiveRivenWeaponType,
  getRivenBaseWeapon,
  type ExtendedRivenWeaponType,
} from "@/lib/weapons/riven-family";
import {
  getStatsWithDisposition,
  getNegativeStatsWithDisposition,
  STANDARD_RIVEN_DISPOSITION,
  type RivenStat,
} from "@/lib/calc/riven-calculator";
import { formatRivenName } from "@/lib/calc/riven-naming";
import {
  evaluateSavedRiven,
  generateRivenId,
  generateRandomRiven,
  type SavedRiven,
  type SavedRivenStat,
} from "@/lib/rivens/riven-storage";
import { RivenCard } from "./riven-card";
import { Input } from "@/components/ui/input";
import { getRivenStatsForCategory } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RivenDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (riven: SavedRiven) => void;
  initialRiven?: SavedRiven | null;
}

const POLARITIES = ["madurai", "vazarin", "naramon", "zenurik"];

export function RivenDialog({ open, onClose, onSave, initialRiven }: RivenDialogProps) {
  const eligibleWeapons = useMemo(
    () => getBaseRivenWeapons().sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const [weaponId, setWeaponId] = useState<string>("torid");
  const [weaponSearch, setWeaponSearch] = useState("");
  const [polarity, setPolarity] = useState<string>("madurai");
  const [masteryRank, setMasteryRank] = useState<number>(12);
  const [rerolls, setRerolls] = useState<number>(0);
  const [customName, setCustomName] = useState<string>("");

  // Stats state: key -> value (decimal fraction or flat)
  const [positiveStats, setPositiveStats] = useState<{ key: string; value: number }[]>([]);
  const [negativeStat, setNegativeStat] = useState<{ key: string; value: number } | null>(null);

  const selectedWeapon = useMemo(
    () => eligibleWeapons.find((w) => w.id === weaponId) ?? eligibleWeapons[0],
    [eligibleWeapons, weaponId],
  );

  const weaponType: ExtendedRivenWeaponType = useMemo(
    () => (selectedWeapon ? getEffectiveRivenWeaponType(selectedWeapon) ?? "Rifle" : "Rifle"),
    [selectedWeapon],
  );

  const availableDefs = useMemo(
    () => getRivenStatsForCategory(weaponType, { includeSpliced: true }),
    [weaponType],
  );

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (!open) return;
    if (initialRiven) {
      setWeaponId(initialRiven.weaponId);
      setPolarity(initialRiven.polarity);
      setMasteryRank(initialRiven.masteryRank);
      setRerolls(initialRiven.rerolls);
      setCustomName(initialRiven.name);

      const pos: { key: string; value: number }[] = [];
      let neg: { key: string; value: number } | null = null;
      for (const [k, v] of Object.entries(initialRiven.stats)) {
        if (v < 0) {
          neg = { key: k, value: Math.abs(v) };
        } else {
          pos.push({ key: k, value: v });
        }
      }
      setPositiveStats(pos);
      setNegativeStat(neg);
    } else {
      // Default to Torid with 2 good stats
      setWeaponId("torid");
      setPolarity("madurai");
      setMasteryRank(12);
      setRerolls(0);
      setCustomName("");
      setPositiveStats([
        { key: "criticalChance", value: 1.5 },
        { key: "multishot", value: 0.9 },
      ]);
      setNegativeStat({ key: "zoom", value: 0.45 });
    }
  }, [open, initialRiven]);

  // Compute stat pools with ranges for reference hints
  const rangeOpts = useMemo(
    () => ({
      positiveCount: Math.max(1, positiveStats.length),
      hasNegative: !!negativeStat,
      rank: 8,
      includeSpliced: true,
    }),
    [positiveStats.length, negativeStat],
  );

  const scaledPositivePool = useMemo(
    () => getStatsWithDisposition(weaponType.toLowerCase(), STANDARD_RIVEN_DISPOSITION, rangeOpts),
    [weaponType, rangeOpts],
  );

  const scaledNegativePool = useMemo(
    () =>
      getNegativeStatsWithDisposition(STANDARD_RIVEN_DISPOSITION, {
        ...rangeOpts,
        category: weaponType.toLowerCase(),
      }),
    [rangeOpts, weaponType],
  );

  // Filtered weapons for dropdown / search
  const filteredWeapons = useMemo(() => {
    if (!weaponSearch.trim()) return eligibleWeapons.slice(0, 50);
    const q = weaponSearch.toLowerCase();
    return eligibleWeapons.filter((w) => w.name.toLowerCase().includes(q)).slice(0, 50);
  }, [eligibleWeapons, weaponSearch]);

  // Construct preview Riven object
  const previewRiven = useMemo<SavedRiven>(() => {
    const statsMap: Record<string, number> = {};
    const posKeys: string[] = [];

    for (const p of positiveStats) {
      if (!p.key) continue;
      posKeys.push(p.key);
      statsMap[p.key] = p.value;
    }

    if (negativeStat && negativeStat.key) {
      statsMap[negativeStat.key] = -Math.abs(negativeStat.value);
    }

    const autoName = formatRivenName(selectedWeapon?.name ?? "Riven", posKeys);
    const finalName = customName.trim() ? customName.trim() : autoName;

    const evalResult = evaluateSavedRiven(
      selectedWeapon?.name ?? "Weapon",
      weaponType,
      statsMap,
      8,
      rerolls,
      polarity,
    );

    return {
      id: initialRiven?.id ?? generateRivenId(),
      name: finalName,
      weaponId: selectedWeapon?.id ?? "weapon",
      weaponName: selectedWeapon?.name ?? "Weapon",
      weaponCategory: selectedWeapon?.category ?? "primary",
      weaponType,
      polarity,
      rank: 8,
      rerolls,
      masteryRank,
      stats: statsMap,
      displayStats: evalResult.displayStats,
      score: evalResult.score,
      grade: evalResult.grade,
      gradeColor: evalResult.color,
      createdAt: initialRiven?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
  }, [
    positiveStats,
    negativeStat,
    selectedWeapon,
    customName,
    weaponType,
    rerolls,
    polarity,
    masteryRank,
    initialRiven,
  ]);

  const handleRollRandom = () => {
    const rolled = generateRandomRiven(selectedWeapon.id);
    setPolarity(rolled.polarity);
    setMasteryRank(rolled.masteryRank);
    setRerolls(rolled.rerolls);
    setCustomName("");

    const pos: { key: string; value: number }[] = [];
    let neg: { key: string; value: number } | null = null;
    for (const [k, v] of Object.entries(rolled.stats)) {
      if (v < 0) {
        neg = { key: k, value: Math.abs(v) };
      } else {
        pos.push({ key: k, value: v });
      }
    }
    setPositiveStats(pos);
    setNegativeStat(neg);
    toast.success(`Rolled ${rolled.name}!`);
  };

  const handleSave = () => {
    if (positiveStats.length === 0) {
      toast.error("Please add at least 1 positive stat");
      return;
    }
    onSave(previewRiven);
    toast.success(`Saved ${previewRiven.name} to Riven Library!`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#120822] text-foreground shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              {initialRiven ? "Edit Riven Roll" : "Create or Roll Riven"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-purple-500/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-4 md:col-span-7">
            {/* Weapon Selector */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Weapon
                </label>
                <button
                  type="button"
                  onClick={handleRollRandom}
                  className="inline-flex items-center gap-1 rounded bg-purple-600/30 px-2 py-0.5 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-600 hover:text-white"
                >
                  <Dice6 className="h-3.5 w-3.5" /> Roll Random
                </button>
              </div>
              <div className="space-y-1.5">
                <Input
                  placeholder="Search weapon..."
                  value={weaponSearch}
                  onChange={(e) => setWeaponSearch(e.target.value)}
                  className="h-9 border-purple-500/30 bg-purple-950/20 text-xs text-white placeholder:text-muted-foreground"
                />
                <select
                  value={weaponId}
                  onChange={(e) => {
                    setWeaponId(e.target.value);
                    setPositiveStats([]);
                    setNegativeStat(null);
                  }}
                  className="h-10 w-full rounded-lg border border-purple-500/30 bg-purple-950/40 px-3 text-sm text-white focus:border-purple-400 focus:outline-none"
                >
                  {filteredWeapons.map((w) => (
                    <option key={w.id} value={w.id} className="bg-[#120822] text-white">
                      {w.name} ({getEffectiveRivenWeaponType(w)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Polarity, MR, Rerolls Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-purple-300">Polarity</label>
                <select
                  value={polarity}
                  onChange={(e) => setPolarity(e.target.value)}
                  className="h-9 w-full rounded border border-purple-500/30 bg-purple-950/40 px-2 text-xs text-white capitalize focus:outline-none"
                >
                  {POLARITIES.map((p) => (
                    <option key={p} value={p} className="bg-[#120822] text-white capitalize">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-purple-300">MR Req</label>
                <Input
                  type="number"
                  min={8}
                  max={16}
                  value={masteryRank}
                  onChange={(e) => setMasteryRank(parseInt(e.target.value) || 8)}
                  className="h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-purple-300">Rerolls</label>
                <Input
                  type="number"
                  min={0}
                  value={rerolls}
                  onChange={(e) => setRerolls(parseInt(e.target.value) || 0)}
                  className="h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white"
                />
              </div>
            </div>

            {/* Positive Stats */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">
                  POSITIVE STATS ({positiveStats.length}/3)
                </span>
                {positiveStats.length < 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      const firstUnused = availableDefs.find(
                        (d) => !positiveStats.some((p) => p.key === d.key),
                      );
                      if (firstUnused) {
                        const isFac = firstUnused.key.startsWith("faction");
                        setPositiveStats([
                          ...positiveStats,
                          {
                            key: firstUnused.key,
                            value: isFac ? 0.45 : firstUnused.isPercent ? 1.0 : 2.0,
                          },
                        ]);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-200"
                  >
                    <Plus className="h-3 w-3" /> Add Stat
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {positiveStats.map((stat, idx) => {
                  const def = availableDefs.find((d) => d.key === stat.key);
                  const isFaction = stat.key.startsWith("faction");
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={stat.key}
                        onChange={(e) => {
                          const n = [...positiveStats];
                          const newDef = availableDefs.find((d) => d.key === e.target.value);
                          const isFac = e.target.value.startsWith("faction");
                          n[idx] = {
                            key: e.target.value,
                            value: isFac ? 0.45 : newDef?.isPercent ? 1.0 : 2.0,
                          };
                          setPositiveStats(n);
                        }}
                        className="h-9 min-w-0 flex-1 rounded border border-purple-500/30 bg-purple-950/40 px-2 text-xs text-white focus:outline-none"
                      >
                        {availableDefs.map((d) => (
                          <option key={d.key} value={d.key} className="bg-[#120822] text-white">
                            {d.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex w-24 shrink-0 items-center">
                        <Input
                          type="number"
                          step={isFaction ? "0.01" : "0.1"}
                          value={
                            isFaction
                              ? (1 + (stat.value || 0)).toFixed(2)
                              : def?.isPercent
                              ? Math.round(stat.value * 1000) / 10
                              : stat.value
                          }
                          onChange={(e) => {
                            const n = [...positiveStats];
                            const raw = parseFloat(e.target.value) || 0;
                            n[idx] = {
                              ...n[idx],
                              value: isFaction
                                ? (raw >= 1 ? raw - 1 : raw)
                                : def?.isPercent
                                ? raw / 100
                                : raw,
                            };
                            setPositiveStats(n);
                          }}
                          className="h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white"
                        />
                        {isFaction ? (
                          <span className="ml-1 text-xs text-purple-400">x</span>
                        ) : def?.isPercent ? (
                          <span className="ml-1 text-xs text-purple-400">%</span>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPositiveStats(positiveStats.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Negative Curse */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-red-300">NEGATIVE CURSE (OPTIONAL)</span>
                {!negativeStat ? (
                  <button
                    type="button"
                    onClick={() => {
                      const first = availableDefs.find((d) => !d.spliced);
                      if (first) setNegativeStat({ key: first.key, value: 0.45 });
                    }}
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-200"
                  >
                    <Plus className="h-3 w-3" /> Add Curse
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setNegativeStat(null)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              {negativeStat && (
                <div className="flex items-center gap-2">
                  <select
                    value={negativeStat.key}
                    onChange={(e) => {
                      setNegativeStat({ ...negativeStat, key: e.target.value });
                    }}
                    className="h-9 min-w-0 flex-1 rounded border border-purple-500/30 bg-purple-950/40 px-2 text-xs text-white focus:outline-none"
                  >
                    {availableDefs
                      .filter((d) => !d.spliced)
                      .map((d) => (
                        <option key={d.key} value={d.key} className="bg-[#120822] text-white">
                          -{d.label}
                        </option>
                      ))}
                  </select>

                  <div className="flex w-24 shrink-0 items-center">
                    <Input
                      type="number"
                      step="0.1"
                      value={Math.round(negativeStat.value * 1000) / 10}
                      onChange={(e) => {
                        const raw = parseFloat(e.target.value) || 0;
                        setNegativeStat({ ...negativeStat, value: Math.abs(raw) / 100 });
                      }}
                      className="h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white"
                    />
                    <span className="ml-1 text-xs text-purple-400">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Card Preview Column */}
          <div className="flex flex-col items-center justify-center border-t border-purple-500/20 pt-4 md:col-span-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
              Live Card Preview
            </div>
            <div className="w-full max-w-[280px]">
              <RivenCard riven={previewRiven} />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-purple-500/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-purple-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-purple-500"
          >
            Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}
