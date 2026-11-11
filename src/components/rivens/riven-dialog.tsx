"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { X, Plus, Sparkles, RefreshCw, Camera, Loader2 } from "lucide-react";
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
  isValueInStatRange,
  type RivenStat,
} from "@/lib/calc/riven-calculator";
import { formatRivenName } from "@/lib/calc/riven-naming";
import {
  DEFAULT_RIVEN_POLARITY,
  RIVEN_MAX_RANK,
  RIVEN_POLARITIES,
  rivenDrainFromRank,
  rivenPolarityError,
  validateRivenStats,
} from "@/lib/riven/riven-validation";
import { buildRivenStats, rivenDisplayName, splitRivenStats } from "@/lib/rivens/riven-form";
import {
  evaluateSavedRiven,
  generateRivenId,
  type SavedRiven,
  type SavedRivenStat,
} from "@/lib/rivens/riven-storage";
import { scanRivenImageFile, type ParsedOcrRiven } from "@/lib/rivens/riven-ocr";
import { RivenCard } from "./riven-card";
import { Input } from "@/components/ui/input";
import { getRivenStatsForCategory } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RivenDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (riven: SavedRiven) => void | Promise<void>;
  initialRiven?: SavedRiven | null;
  initialScannedRiven?: ParsedOcrRiven | null;
  fixedWeaponId?: string;
  hideWeaponSelect?: boolean;
  /** Screenshot picked before opening (Riven Library "Import screenshot"): scanned once on open. */
  initialScanFile?: File | null;
}

/** Same set as RIVEN_POLARITIES, in the order the dialog and library list them. */
export const POLARITIES: readonly string[] = ["madurai", "vazarin", "naramon"] satisfies readonly (typeof RIVEN_POLARITIES)[number][];
const WEAPON_CATEGORIES = ["All", "Rifle", "Shotgun", "Pistol", "Melee", "Kitgun", "Zaw", "Companion", "Archgun"] as const;

function formatRangeHint(stat: RivenStat | undefined, isCurse = false): string {
  if (!stat) return "";
  const lo = Math.min(Math.abs(stat.minValue), Math.abs(stat.maxValue));
  const hi = Math.max(Math.abs(stat.minValue), Math.abs(stat.maxValue));
  if (stat.name.startsWith("Damage to ") || stat.name.startsWith("Damage vs ")) {
    if (isCurse) {
      return `${Math.max(0.01, 1 - hi / 100).toFixed(2)}–${Math.max(0.01, 1 - lo / 100).toFixed(2)}x`;
    }
    return `${(1 + lo / 100).toFixed(2)}–${(1 + hi / 100).toFixed(2)}x`;
  }
  if (stat.type === "percent") return `${lo.toFixed(0)}–${hi.toFixed(0)}%`;
  if (stat.type === "seconds") return `${lo.toFixed(1)}–${hi.toFixed(1)}s`;
  if (stat.type === "integer") return `${lo.toFixed(1)}–${hi.toFixed(1)}m`;
  return `${lo.toFixed(1)}–${hi.toFixed(1)}`;
}

function computeStatMidpoint(poolStat: RivenStat | undefined, isPercent: boolean, isFaction: boolean): number {
  if (poolStat) {
    // Magnitude only: the form keeps buffs unsigned (a recoil buff is stored negative on save).
    const mid = Math.abs((poolStat.minValue + poolStat.maxValue) / 2);
    if (isFaction || poolStat.type === "percent") {
      return Math.round(mid * 10) / 1000;
    }
    return Math.round(mid * 10) / 10;
  }
  if (isFaction) return 0.45;
  return isPercent ? 1.0 : 2.0;
}

function computeNegMidpoint(poolStat: RivenStat | undefined, isPercent: boolean, isFaction: boolean): number {
  if (poolStat) {
    const mid = Math.abs((poolStat.minValue + poolStat.maxValue) / 2);
    if (isFaction || poolStat.type === "percent") {
      return Math.round(mid * 10) / 1000;
    }
    return Math.round(mid * 10) / 10;
  }
  if (isFaction) return 0.45;
  return isPercent ? 0.45 : 1.0;
}

export function RivenDialog({ open, onClose, onSave, initialRiven, initialScannedRiven, fixedWeaponId, hideWeaponSelect, initialScanFile }: RivenDialogProps) {
  const eligibleWeapons = useMemo(
    () => getBaseRivenWeapons().sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const initialTargetWeaponId = useMemo(() => {
    if (initialScannedRiven?.weaponId) return initialScannedRiven.weaponId;
    if (initialRiven?.weaponId) return initialRiven.weaponId;
    if (fixedWeaponId) {
      const base = getRivenBaseWeapon(fixedWeaponId);
      return base?.id ?? fixedWeaponId;
    }
    return "";
  }, [initialRiven, initialScannedRiven, fixedWeaponId]);

  const [weaponId, setWeaponId] = useState<string>(initialTargetWeaponId);
  const [weaponCategoryFilter, setWeaponCategoryFilter] = useState<string>("All");
  const [weaponSearch, setWeaponSearch] = useState("");
  const [polarity, setPolarity] = useState<string>(DEFAULT_RIVEN_POLARITY);
  const [rank, setRank] = useState<number>(RIVEN_MAX_RANK);
  const [masteryRank, setMasteryRank] = useState<number>(8);
  const [rerolls, setRerolls] = useState<number>(0);
  /** Full riven name as typed; empty means "<Weapon> <auto suffix>". */
  const [customName, setCustomName] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isScaled9x, setIsScaled9x] = useState<boolean>(false);

  // Stats state: key -> value (decimal fraction or flat)
  const [positiveStats, setPositiveStats] = useState<{ key: string; value: number }[]>([]);
  const [negativeStat, setNegativeStat] = useState<{ key: string; value: number } | null>(null);

  const handleScanFile = useCallback(async (file: File | Blob) => {
    setIsScanning(true);
    setScanStatus("Scanning...");
    try {
      const parsed = await scanRivenImageFile(file, (_progress, status) => {
        setScanStatus(status);
      });

      if (parsed.weaponId) {
        setWeaponId(parsed.weaponId);
      }
      if (parsed.masteryRank) {
        setMasteryRank(parsed.masteryRank);
      }
      if (parsed.rerolls != null) {
        setRerolls(parsed.rerolls);
      }
      if (parsed.customSuffix) {
        const scannedWeapon = allWeapons.find((w) => w.id === parsed.weaponId);
        setCustomName(scannedWeapon ? `${scannedWeapon.name} ${parsed.customSuffix}` : parsed.customSuffix);
      }

      let nextPos = parsed.positiveStats;
      let nextNeg = parsed.negativeStat;
      if (parsed.isLikelyUnranked && nextPos.length > 0) {
        nextPos = nextPos.map((p) => ({
          key: p.key,
          value: Math.round(p.value * 9 * 1000) / 1000,
        }));
        if (nextNeg) {
          nextNeg = {
            key: nextNeg.key,
            value: Math.round(nextNeg.value * 9 * 1000) / 1000,
          };
        }
        setIsScaled9x(true);
        toast.info("Unranked (Rank 0) card detected: stats scaled 9× to Max Rank (Rank 8).");
      } else {
        setIsScaled9x(false);
      }

      if (nextPos.length > 0) {
        setPositiveStats(nextPos);
      }
      if (nextNeg) {
        setNegativeStat(nextNeg);
      }

      toast.success(
        `Scanned ${parsed.weaponName ?? "Riven"} (${parsed.positiveStats.length} buff${parsed.positiveStats.length === 1 ? "" : "s"}${parsed.negativeStat ? ", 1 curse" : ""})! Check details below.`,
      );
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("OCR scan error:", err);
      toast.error("Could not scan Riven card from this image. You can adjust the stats manually.");
    } finally {
      setIsScanning(false);
      setScanStatus("");
    }
  }, []);

  const handleToggleScale9x = useCallback(() => {
    if (isScaled9x) {
      setPositiveStats((prev) =>
        prev.map((p) => ({
          key: p.key,
          value: Math.round((p.value / 9) * 1000) / 1000,
        })),
      );
      if (negativeStat) {
        setNegativeStat((prev) =>
          prev ? { key: prev.key, value: Math.round((prev.value / 9) * 1000) / 1000 } : null,
        );
      }
      setIsScaled9x(false);
      toast.info("Scaled down to Rank 0 values (÷9).");
    } else {
      setPositiveStats((prev) =>
        prev.map((p) => ({
          key: p.key,
          value: Math.round(p.value * 9 * 1000) / 1000,
        })),
      );
      if (negativeStat) {
        setNegativeStat((prev) =>
          prev ? { key: prev.key, value: Math.round(prev.value * 9 * 1000) / 1000 } : null,
        );
      }
      setIsScaled9x(true);
      toast.info("Scaled up to Max Rank values (×9).");
    }
  }, [isScaled9x, negativeStat]);

  // Clipboard paste listener (Ctrl+V) when modal is open and not typing into an input
  useEffect(() => {
    if (!open) return;
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleScanFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [open, handleScanFile]);

  const selectedWeapon = useMemo(
    () => eligibleWeapons.find((w) => w.id === weaponId),
    [eligibleWeapons, weaponId],
  );

  const weaponType: ExtendedRivenWeaponType = useMemo(
    () => (selectedWeapon ? getEffectiveRivenWeaponType(selectedWeapon) ?? "Rifle" : "Rifle"),
    [selectedWeapon],
  );

  const statPoolCategory = useMemo(() => {
    if (!selectedWeapon) return "Rifle";
    if (weaponType === "Kitgun") return "Pistol";
    if (weaponType === "Zaw") return "Melee";
    return getRivenWeaponType(selectedWeapon) ?? "Rifle";
  }, [selectedWeapon, weaponType]);

  const availableDefs = useMemo(
    () => getRivenStatsForCategory(statPoolCategory, { includeSpliced: true }),
    [statPoolCategory],
  );

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
    setIsScaled9x(false);
    if (initialScannedRiven) {
      if (initialScannedRiven.weaponId) {
        setWeaponId(initialScannedRiven.weaponId);
      }
      // OCR cannot read the polarity symbol, so the player picks it like in the builder.
      setPolarity(DEFAULT_RIVEN_POLARITY);
      setRank(RIVEN_MAX_RANK);
      setMasteryRank(initialScannedRiven.masteryRank ?? 8);
      setRerolls(initialScannedRiven.rerolls ?? 0);
      const scannedWeapon = allWeapons.find((w) => w.id === initialScannedRiven.weaponId);
      setCustomName(
        initialScannedRiven.customSuffix
          ? `${scannedWeapon?.name ?? ""} ${initialScannedRiven.customSuffix}`.trim()
          : "",
      );
      setPositiveStats(initialScannedRiven.positiveStats ?? []);
      setNegativeStat(initialScannedRiven.negativeStat ?? null);
    } else if (initialRiven) {
      setWeaponId(initialRiven.weaponId);
      setPolarity(initialRiven.polarity);
      setRank(initialRiven.rank ?? RIVEN_MAX_RANK);
      setMasteryRank(initialRiven.masteryRank ?? 8);
      setRerolls(initialRiven.rerolls ?? 0);
      // Keep the saved name verbatim (rebuilding "<weapon> <suffix>" doubled custom names).
      setCustomName(initialRiven.name);
      const split = splitRivenStats(initialRiven.stats);
      setPositiveStats(split.positives);
      setNegativeStat(split.negative);
    } else {
      // New riven: blank form, same as the builder (no example stats, polarity not chosen).
      setWeaponId(fixedWeaponId ? (getRivenBaseWeapon(fixedWeaponId)?.id ?? fixedWeaponId) : "");
      setPolarity(DEFAULT_RIVEN_POLARITY);
      setRank(RIVEN_MAX_RANK);
      setMasteryRank(8);
      setRerolls(0);
      setCustomName("");
      setPositiveStats([]);
      setNegativeStat(null);
    }
    });
  }, [open, initialRiven, initialScannedRiven, fixedWeaponId]);

  // Runs after the blank-form reset above (that one is queued first), so the scan fills the new form.
  useEffect(() => {
    if (!open || !initialScanFile) return;
    queueMicrotask(() => {
      void handleScanFile(initialScanFile);
    });
  }, [open, initialScanFile, handleScanFile]);

  // Compute stat pools with ranges for reference hints
  const rangeOpts = useMemo(
    () => ({
      positiveCount: Math.max(1, positiveStats.length),
      hasNegative: !!negativeStat,
      rank,
      includeSpliced: true,
    }),
    [positiveStats.length, negativeStat, rank],
  );

  const autoSuffix = useMemo(() => {
    const posKeys = positiveStats.filter((p) => p.key).map((p) => p.key);
    if (posKeys.length === 0) return "Riven Mod";
    return formatRivenName("", posKeys).trim() || "Riven Mod";
  }, [positiveStats]);

  const scaledPositivePool = useMemo(
    () => getStatsWithDisposition(statPoolCategory.toLowerCase(), STANDARD_RIVEN_DISPOSITION, rangeOpts),
    [statPoolCategory, rangeOpts],
  );

  const scaledNegativePool = useMemo(
    () =>
      getNegativeStatsWithDisposition(STANDARD_RIVEN_DISPOSITION, {
        ...rangeOpts,
        category: statPoolCategory.toLowerCase(),
      }),
    [rangeOpts, statPoolCategory],
  );

  // Filtered weapons for dropdown / search
  const filteredWeapons = useMemo(() => {
    let list = eligibleWeapons;
    if (weaponCategoryFilter !== "All") {
      list = list.filter((w) => getEffectiveRivenWeaponType(w) === weaponCategoryFilter);
    }
    if (weaponSearch.trim()) {
      const q = weaponSearch.toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          (getEffectiveRivenWeaponType(w)?.toLowerCase().includes(q) ?? false),
      );
    }
    if (selectedWeapon && !list.some((w) => w.id === selectedWeapon.id)) {
      list = [selectedWeapon, ...list];
    }
    return list;
  }, [eligibleWeapons, weaponCategoryFilter, weaponSearch, selectedWeapon]);

  // Construct preview Riven object
  const previewRiven = useMemo<SavedRiven>(() => {
    const statsMap = buildRivenStats(positiveStats, negativeStat);
    const finalName = rivenDisplayName(selectedWeapon?.name ?? "Weapon", autoSuffix, customName);

    const evalResult = evaluateSavedRiven(
      selectedWeapon?.name ?? "Weapon",
      statPoolCategory,
      statsMap,
      rank,
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
      statPoolCategory,
      polarity,
      rank,
      rerolls,
      masteryRank,
      stats: statsMap,
      displayStats: evalResult.displayStats,
      score: evalResult.score,
      grade: evalResult.grade,
      gradeColor: evalResult.color,
      createdAt: initialRiven?.createdAt ?? 0,
      updatedAt: initialRiven?.updatedAt ?? 0,
    };
  }, [
    positiveStats,
    negativeStat,
    selectedWeapon,
    customName,
    autoSuffix,
    rank,
    weaponType,
    statPoolCategory,
    rerolls,
    polarity,
    masteryRank,
    initialRiven,
  ]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    if (!selectedWeapon) {
      toast.error("Choose the riven's weapon");
      return;
    }
    const polarityError = rivenPolarityError(polarity);
    if (polarityError) {
      toast.error(polarityError);
      return;
    }
    if (positiveStats.length === 0) {
      toast.error("Please add at least 1 positive stat");
      return;
    }
    const valCheck = validateRivenStats(
      previewRiven.stats,
      statPoolCategory.toLowerCase(),
      STANDARD_RIVEN_DISPOSITION,
    );
    if (!valCheck.ok) {
      toast.error(valCheck.errors[0] ?? "Invalid riven stats");
      return;
    }
    setSaving(true);
    try {
      await onSave(previewRiven);
      toast.success(`Saved ${previewRiven.name} to Riven Library!`);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[min(92dvh,100dvh-2rem)] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#120822] text-foreground shadow-2xl">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-purple-500/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              {initialRiven ? "Edit Riven Roll" : "Create Riven"}
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
        <div className="grid min-h-0 flex-1 touch-manipulation grid-cols-1 gap-6 overflow-y-auto overscroll-contain p-6 md:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-4 md:col-span-7">
            {/* Screenshot Drop / Paste Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file && (file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name))) {
                  handleScanFile(file);
                }
              }}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border border-dashed p-3 text-center transition-all",
                isDragging
                  ? "border-purple-400 bg-purple-900/40"
                  : "border-purple-500/30 bg-purple-950/20 hover:border-purple-500/50 hover:bg-purple-950/30",
              )}
            >
              {isScanning ? (
                <div className="flex items-center gap-2 py-1 text-xs text-purple-200">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <span>{scanStatus || "Scanning riven card..."}</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-purple-300/90">
                  <div className="flex items-center gap-1.5 font-medium text-white">
                    <Camera className="h-4 w-4 text-purple-400" />
                    <span>Import Screenshot:</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Drop image here, paste from clipboard (<kbd className="rounded border border-purple-500/30 bg-purple-950/60 px-1 py-0.5 text-[10px] font-mono text-purple-200">Ctrl+V</kbd>), or
                  </span>
                  <label className="cursor-pointer font-semibold text-purple-400 underline decoration-purple-500/40 underline-offset-2 hover:text-purple-300">
                    browse file
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleScanFile(file);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            {/* Weapon Selector */}
            {hideWeaponSelect ? (
              <div className="rounded-lg border border-purple-500/30 bg-purple-950/40 p-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Weapon</span>
                <div className="mt-1 text-sm font-bold text-white">
                  {selectedWeapon?.name}{" "}
                  <span className="text-xs font-normal text-purple-300">({weaponType})</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    Weapon
                  </label>
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1">
                    {WEAPON_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setWeaponCategoryFilter(cat)}
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                          weaponCategoryFilter === cat
                            ? "bg-purple-600 text-white"
                            : "bg-purple-950/40 text-purple-300 hover:bg-purple-900/60",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Search weapon or type (e.g. sporelacer, kitgun)..."
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
                    aria-label="Riven weapon"
                    data-testid="riven-dialog-weapon"
                    className={cn(
                      "h-10 w-full rounded-lg border bg-purple-950/40 px-3 text-sm text-white focus:border-purple-400 focus:outline-none",
                      selectedWeapon ? "border-purple-500/30" : "border-amber-400 ring-1 ring-amber-400/60",
                    )}
                  >
                    {!selectedWeapon && (
                      <option value="" disabled className="bg-[#120822] text-white">
                        Choose a weapon…
                      </option>
                    )}
                    {filteredWeapons.map((w) => (
                      <option key={w.id} value={w.id} className="bg-[#120822] text-white">
                        {w.name} ({getEffectiveRivenWeaponType(w)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Riven name */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="riven-dialog-name" className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Riven name
                </label>
                {customName.trim() !== "" && (
                  <button
                    type="button"
                    onClick={() => setCustomName("")}
                    className="min-h-11 px-1 text-[10px] text-purple-400 hover:text-white pointer-fine:min-h-0"
                  >
                    Reset to auto
                  </button>
                )}
              </div>
              <Input
                id="riven-dialog-name"
                data-testid="riven-dialog-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={`${selectedWeapon?.name ?? "Weapon"} ${autoSuffix}`}
                maxLength={80}
                className="h-9 border-purple-500/30 bg-purple-950/20 text-xs font-semibold text-purple-100 placeholder:text-purple-300/60 focus:border-purple-400"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {customName.trim()
                  ? "Saved exactly as typed."
                  : "Leave empty to use the in-game style name from the buffs."}
              </p>
            </div>

            {/* Polarity, rank, MR, rerolls */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label htmlFor="riven-dialog-polarity" className="mb-1 block text-xs font-semibold text-purple-300">Polarity</label>
                <select
                  id="riven-dialog-polarity"
                  data-testid="riven-dialog-polarity"
                  value={polarity}
                  onChange={(e) => setPolarity(e.target.value)}
                  aria-invalid={!POLARITIES.includes(polarity)}
                  className={cn(
                    "h-9 w-full rounded border bg-purple-950/40 px-2 text-xs text-white capitalize focus:outline-none",
                    POLARITIES.includes(polarity) ? "border-purple-500/30" : "border-amber-400 ring-1 ring-amber-400/60",
                  )}
                >
                  {!POLARITIES.includes(polarity) && (
                    <option value={DEFAULT_RIVEN_POLARITY} disabled className="bg-[#120822] text-white">
                      Choose…
                    </option>
                  )}
                  {POLARITIES.map((p) => (
                    <option key={p} value={p} className="bg-[#120822] text-white capitalize">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="riven-dialog-rank" className="mb-1 block text-xs font-semibold text-purple-300">Rank · drain</label>
                <select
                  id="riven-dialog-rank"
                  data-testid="riven-dialog-rank"
                  value={rank}
                  onChange={(e) => setRank(parseInt(e.target.value, 10))}
                  className="h-9 w-full rounded border border-purple-500/30 bg-purple-950/40 px-2 text-xs text-white focus:outline-none"
                >
                  {Array.from({ length: RIVEN_MAX_RANK + 1 }, (_, i) => RIVEN_MAX_RANK - i).map((r) => (
                    <option key={r} value={r} className="bg-[#120822] text-white">
                      Rank {r} · drain {rivenDrainFromRank(r)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="riven-dialog-mr" className="mb-1 block text-xs font-semibold text-purple-300">MR Req</label>
                <Input
                  id="riven-dialog-mr"
                  type="number"
                  min={8}
                  max={16}
                  value={masteryRank}
                  onChange={(e) => setMasteryRank(Math.min(16, Math.max(8, parseInt(e.target.value) || 8)))}
                  className="h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white"
                />
              </div>
              <div>
                <label htmlFor="riven-dialog-rerolls" className="mb-1 block text-xs font-semibold text-purple-300">Rerolls</label>
                <Input
                  id="riven-dialog-rerolls"
                  type="number"
                  min={0}
                  value={rerolls}
                  onChange={(e) => setRerolls(Math.max(0, parseInt(e.target.value) || 0))}
                  className="h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white"
                />
              </div>
            </div>

            {/* Positive Stats */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-purple-300">
                  POSITIVE STATS ({positiveStats.length}/3)
                </span>
                <div className="flex items-center gap-2">
                  {positiveStats.length > 0 && (
                    <button
                      type="button"
                      onClick={handleToggleScale9x}
                      title="Multiply or divide stats by 9 (Warframe Rank 0 ↔ Max Rank 8)"
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium transition-colors",
                        isScaled9x
                          ? "border-emerald-500/50 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60"
                          : "border-purple-500/30 bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 hover:text-white",
                      )}
                    >
                      {isScaled9x ? "Scaled ×9 (Max) · Click to ÷9" : "Scale ×9 (Rank 0 → Max)"}
                    </button>
                  )}
                  {positiveStats.length < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        const firstUnused = availableDefs.find(
                          (d) => !positiveStats.some((p) => p.key === d.key),
                        );
                        if (firstUnused) {
                          const isFac = firstUnused.key.startsWith("faction");
                          const cLabel = firstUnused.label.replace(" (Spliced)", "").trim();
                          const newPool = scaledPositivePool.find(
                            (p) => p.name.replace(" (Spliced)", "").trim() === cLabel,
                          );
                          setPositiveStats([
                            ...positiveStats,
                            {
                              key: firstUnused.key,
                              value: computeStatMidpoint(newPool, firstUnused.isPercent !== false, isFac),
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
              </div>

              <div className="space-y-2">
                {positiveStats.map((stat, idx) => {
                  const def = availableDefs.find((d) => d.key === stat.key);
                  const isFaction = stat.key.startsWith("faction");
                  const cleanLabel = def ? def.label.replace(" (Spliced)", "").trim() : "";
                  const poolStat = scaledPositivePool.find(
                    (p) => p.name.replace(" (Spliced)", "").trim() === cleanLabel,
                  );
                  const statToCheckVal = (def?.isPercent || isFaction) ? (stat.value || 0) * 100 : stat.value;
                  const outOfRange = poolStat && stat.value !== 0 && !isValueInStatRange(statToCheckVal, poolStat);
                  const otherHasSpliced = positiveStats.some(
                    (p, i) => i !== idx && availableDefs.find((d) => d.key === p.key)?.spliced,
                  );
                  const rowDefs = otherHasSpliced ? availableDefs.filter((d) => !d.spliced) : availableDefs;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <select
                          value={stat.key}
                          onChange={(e) => {
                            const n = [...positiveStats];
                            const newDef = availableDefs.find((d) => d.key === e.target.value);
                            const isFac = e.target.value.startsWith("faction");
                            const cLabel = newDef ? newDef.label.replace(" (Spliced)", "").trim() : "";
                            const newPool = scaledPositivePool.find(
                              (p) => p.name.replace(" (Spliced)", "").trim() === cLabel,
                            );
                            n[idx] = {
                              key: e.target.value,
                              value: computeStatMidpoint(newPool, newDef?.isPercent !== false, isFac),
                            };
                            setPositiveStats(n);
                          }}
                          className="h-9 min-w-0 flex-1 rounded border border-purple-500/30 bg-purple-950/40 px-2 text-xs text-white focus:outline-none"
                        >
                          {rowDefs.map((d) => (
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
                            className={cn(
                              "h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white",
                              outOfRange && "border-amber-500/80 focus:border-amber-400",
                            )}
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
                      {poolStat && (
                        <p className={cn("text-[10px] pl-0.5", outOfRange ? "text-amber-400 font-medium" : "text-purple-300/60")}>
                          Typical range: {formatRangeHint(poolStat)}
                          {outOfRange ? " (outside expected band)" : ""}
                        </p>
                      )}
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
                      if (first) {
                        const isFac = first.key.startsWith("faction");
                        const cLabel = first.label.replace(" (Spliced)", "").trim();
                        const newPool = scaledNegativePool.find(
                          (p) => p.name.replace(" (Spliced)", "").trim() === cLabel,
                        );
                        setNegativeStat({
                          key: first.key,
                          value: computeNegMidpoint(newPool, first.isPercent !== false, isFac),
                        });
                      }
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

              {negativeStat && (() => {
                const negDef = availableDefs.find((d) => d.key === negativeStat.key);
                const isFaction = negativeStat.key.startsWith("faction");
                const cleanLabel = negDef ? negDef.label.replace(" (Spliced)", "").trim() : "";
                const negPoolStat = scaledNegativePool.find(
                  (p) => p.name.replace(" (Spliced)", "").trim() === cleanLabel,
                );
                const negToCheckVal = (negDef?.isPercent || isFaction) ? (negativeStat.value || 0) * 100 : negativeStat.value;
                const outOfRange = negPoolStat && negativeStat.value !== 0 && !isValueInStatRange(negToCheckVal, negPoolStat);

                return (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <select
                        value={negativeStat.key}
                        onChange={(e) => {
                          const newDef = availableDefs.find((d) => d.key === e.target.value);
                          const isFac = e.target.value.startsWith("faction");
                          const cLabel = newDef ? newDef.label.replace(" (Spliced)", "").trim() : "";
                          const newPool = scaledNegativePool.find(
                            (p) => p.name.replace(" (Spliced)", "").trim() === cLabel,
                          );
                          setNegativeStat({
                            key: e.target.value,
                            value: computeNegMidpoint(newPool, newDef?.isPercent !== false, isFac),
                          });
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
                          step={isFaction ? "0.01" : "0.1"}
                          value={
                            isFaction
                              ? Math.max(0.01, 1 - (negativeStat.value || 0)).toFixed(2)
                              : negDef?.isPercent !== false
                              ? Math.round(negativeStat.value * 1000) / 10
                              : negativeStat.value
                          }
                          onChange={(e) => {
                            const raw = parseFloat(e.target.value) || 0;
                            const nextMagnitude = isFaction
                              ? raw > 0 && raw < 1
                                ? Math.round((1 - raw) * 1000) / 1000
                                : Math.abs(raw) / 100
                              : negDef?.isPercent !== false
                              ? Math.abs(raw) / 100
                              : Math.abs(raw);
                            setNegativeStat({ ...negativeStat, value: nextMagnitude });
                          }}
                          className={cn(
                            "h-9 border-purple-500/30 bg-purple-950/40 text-xs text-white",
                            outOfRange && "border-amber-500/80 focus:border-amber-400",
                          )}
                        />
                        {isFaction ? (
                          <span className="ml-1 text-xs text-purple-400">x</span>
                        ) : negDef?.isPercent !== false ? (
                          <span className="ml-1 text-xs text-purple-400">%</span>
                        ) : null}
                      </div>
                    </div>
                    {negPoolStat && (
                      <p className={cn("text-[10px] pl-0.5", outOfRange ? "text-amber-400 font-medium" : "text-purple-300/60")}>
                        Typical curse: {formatRangeHint(negPoolStat, true)}
                        {outOfRange ? " (outside expected band)" : ""}
                      </p>
                    )}
                  </div>
                );
              })()}
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
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-purple-500/20 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-purple-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { void handleSave(); }}
            disabled={saving}
            className="min-h-11 rounded-lg bg-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-purple-500 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save to Library"}
          </button>
        </div>
      </div>
    </div>
  );
}
