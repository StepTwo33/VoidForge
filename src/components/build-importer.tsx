"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Upload, Type, X, Search, Check, AlertTriangle, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { allMods } from "@/data/mods";
import { Mod, EquippedMod } from "@/lib/types";

// Simple fuzzy match: case-insensitive substring + Levenshtein for close matches
function fuzzyMatch(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (t === q) return 1.0;
  if (t.includes(q)) return 0.9;
  if (q.length < 3) return 0;
  // Simple Levenshtein-based score for short distances
  const dist = levenshtein(q, t);
  const maxLen = Math.max(q.length, t.length);
  const score = 1 - dist / maxLen;
  return score > 0.6 ? score * 0.8 : 0;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function findBestMod(name: string, category: string | null): Mod | null {
  let best: Mod | null = null;
  let bestScore = 0;
  for (const mod of allMods) {
    // Filter by category if specified
    if (category && mod.category !== category && mod.category !== "general") continue;
    const score = fuzzyMatch(name, mod.name);
    if (score > bestScore) {
      bestScore = score;
      best = mod;
    }
  }
  return bestScore > 0.5 ? best : null;
}

interface MatchedMod {
  inputName: string;
  mod: Mod | null;
  confidence: "high" | "medium" | "low" | "none";
}

function matchModNames(names: string[], category: string | null): MatchedMod[] {
  return names.map((name) => {
    const trimmed = name.trim();
    if (!trimmed) return { inputName: trimmed, mod: null, confidence: "none" as const };
    const mod = findBestMod(trimmed, category);
    if (!mod) return { inputName: trimmed, mod: null, confidence: "none" as const };
    const score = fuzzyMatch(trimmed, mod.name);
    const confidence: MatchedMod["confidence"] = score >= 0.9 ? "high" : score >= 0.7 ? "medium" : "low";
    return { inputName: trimmed, mod, confidence };
  }).filter((m) => m.inputName.length > 0);
}

interface BuildImporterProps {
  modCategory: string | null;
  numSlots: number;
  onImport: (mods: EquippedMod[]) => void;
  onClose: () => void;
}

export function BuildImporter({ modCategory, numSlots, onImport, onClose }: BuildImporterProps) {
  const [mode, setMode] = useState<"text" | "screenshot">("text");
  const [textInput, setTextInput] = useState("");
  const [matches, setMatches] = useState<MatchedMod[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autocomplete state for individual mod input
  const [currentModInput, setCurrentModInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMods, setSelectedMods] = useState<Mod[]>([]);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (currentModInput.length < 2) return [];
    const q = currentModInput.toLowerCase();
    return allMods
      .filter((m) => {
        if (modCategory && m.category !== modCategory && m.category !== "general") return false;
        return m.name.toLowerCase().includes(q);
      })
      .filter((m) => !selectedMods.find((s) => s.id === m.id))
      .slice(0, 8);
  }, [currentModInput, modCategory, selectedMods]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAddMod = useCallback((mod: Mod) => {
    if (selectedMods.length >= numSlots) return;
    setSelectedMods((prev) => [...prev, mod]);
    setCurrentModInput("");
    setShowSuggestions(false);
  }, [selectedMods, numSlots]);

  const handleRemoveMod = useCallback((index: number) => {
    setSelectedMods((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Bulk text paste (comma-separated)
  const handleParseBulk = useCallback(() => {
    const names = textInput.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
    const matched = matchModNames(names, modCategory);
    setMatches(matched);
  }, [textInput, modCategory]);

  // Screenshot OCR
  const handleScreenshot = useCallback(async (file: File) => {
    setIsProcessing(true);
    setOcrError(null);
    setMatches([]);
    let worker: { terminate: () => Promise<unknown> } | null = null;
    let url: string | null = null;
    try {
      const { createWorker } = await import("tesseract.js");
      const ocrWorker = await createWorker("eng");
      worker = ocrWorker;
      // Preprocess: create a canvas with high contrast
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      url = objectUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = objectUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      // Apply contrast enhancement
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = gray > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = val;
      }
      ctx.putImageData(imageData, 0, 0);

      const { data: result } = await ocrWorker.recognize(canvas);

      // Extract potential mod names from OCR text
      const lines = result.text.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 3);
      const matched = matchModNames(lines, modCategory);
      const valid = matched.filter((m) => m.mod !== null);
      if (valid.length === 0) {
        setOcrError("No mod names detected. Try a clearer screenshot of the mod loadout area.");
      }
      setMatches(matched);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("OCR error:", err);
      }
      setOcrError("Failed to process image. Please try again.");
    } finally {
      if (worker) {
        try { await worker.terminate(); } catch { /* already terminated */ }
      }
      if (url) URL.revokeObjectURL(url);
      setIsProcessing(false);
    }
  }, [modCategory]);

  const handleImportMatches = useCallback(() => {
    const validMods = matches
      .filter((m) => m.mod !== null)
      .slice(0, numSlots)
      .map((m, i) => ({
        modId: m.mod!.id,
        modName: m.mod!.name,
        rank: m.mod!.maxRank,
        slotIndex: i,
        polarity: m.mod!.polarity,
        drain: m.mod!.drain,
      }));
    onImport(validMods);
  }, [matches, numSlots, onImport]);

  const handleImportSelected = useCallback(() => {
    const equipped: EquippedMod[] = selectedMods.map((mod, i) => ({
      modId: mod.id,
      modName: mod.name,
      rank: mod.maxRank,
      slotIndex: i,
      polarity: mod.polarity,
      drain: mod.drain,
    }));
    onImport(equipped);
  }, [selectedMods, onImport]);

  const validMatchCount = matches.filter((m) => m.mod !== null).length;

  return (
    <div className="min-w-0 w-full overflow-hidden border border-blue-500/30 rounded-xl bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-semibold text-blue-700 dark:text-blue-400">IMPORT BUILD</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close import"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Mode tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => { setMode("text"); setMatches([]); }}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors",
            mode === "text" ? "border-blue-600 bg-blue-600 text-white" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <Type className="h-3.5 w-3.5" /> Mod Picker
        </button>
        <button
          type="button"
          onClick={() => { setMode("text"); setMatches([]); setTextInput(""); }}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" /> Paste Names
        </button>
        <button
          type="button"
          onClick={() => { setMode("screenshot"); setMatches([]); setSelectedMods([]); }}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors",
            mode === "screenshot" ? "border-blue-600 bg-blue-600 text-white" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <Camera className="h-3.5 w-3.5" /> Screenshot
          <span className="rounded bg-amber-500/20 px-1 py-0.5 text-[9px] text-amber-800 dark:text-amber-400">BETA</span>
        </button>
      </div>

      {mode === "text" && (
        <>
          {/* Individual mod picker with autocomplete */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Add mods one by one ({selectedMods.length}/{numSlots})
            </label>
            {selectedMods.length === 0 && (
              <p className="mb-2 text-xs text-muted-foreground">No mods selected yet — search below or paste a list.</p>
            )}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {selectedMods.map((mod, i) => (
                <span key={`${mod.id}-${i}`} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-xs text-blue-700 dark:text-blue-400 sm:min-h-0">
                  <span className="max-w-[12rem] truncate sm:max-w-none">{mod.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMod(i)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:text-red-700 dark:hover:text-red-400 sm:min-h-0 sm:min-w-0"
                    aria-label={`Remove ${mod.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative" ref={suggestionsRef}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={currentModInput}
                onChange={(e) => { setCurrentModInput(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type a mod name..."
                disabled={selectedMods.length >= numSlots}
                className="min-h-11 h-11 w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-base focus:border-blue-500/50 focus:outline-none disabled:opacity-50 sm:h-9 sm:min-h-9 sm:text-sm"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => handleAddMod(mod)}
                      className="flex min-h-11 w-full min-w-0 items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
                    >
                      <span className="min-w-0 truncate">{mod.name}</span>
                      <span className="shrink-0 text-[10px] capitalize text-muted-foreground">{mod.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedMods.length > 0 && (
            <button
              onClick={handleImportSelected}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" /> Import {selectedMods.length} Mod{selectedMods.length !== 1 ? "s" : ""}
            </button>
          )}

          {/* Bulk paste separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground uppercase">or paste in bulk</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Bulk text paste */}
          <div className="mb-3">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={"Paste mod names, one per line or comma-separated:\nSerration, Split Chamber, Heavy Caliber\nVital Sense, Point Strike"}
              className="h-24 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-base focus:border-blue-500/50 focus:outline-none sm:text-sm"
            />
          </div>
          <button
            onClick={handleParseBulk}
            disabled={!textInput.trim()}
            className="min-h-11 w-full rounded-lg bg-muted py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
          >
            Match Mod Names
          </button>
        </>
      )}

      {mode === "screenshot" && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[11rem] cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:border-blue-500/50"
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-blue-700 dark:text-blue-400 animate-spin" />
                <p className="text-sm text-muted-foreground">Processing screenshot...</p>
                <p className="text-[10px] text-muted-foreground">This may take a few seconds on first use</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm">Click to upload a screenshot</p>
                <p className="text-[10px] text-muted-foreground">Screenshot the mod loadout area for best results</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleScreenshot(file);
              // Allow re-selecting the same file after a failure
              e.target.value = "";
            }}
          />
          {ocrError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-700 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {ocrError}
            </div>
          )}
        </div>
      )}

      {/* Match results */}
      {matches.length > 0 && (
        <div className="mt-4 border border-border rounded-lg overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground">
            <span className="min-w-0">Detected Mods ({validMatchCount} matched)</span>
            {matches.some((m) => m.confidence === "none") && (
              <span className="shrink-0 text-amber-800 dark:text-amber-400">{matches.filter((m) => m.confidence === "none").length} unmatched</span>
            )}
          </div>
          <div className="max-h-60 divide-y divide-border overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex min-h-11 min-w-0 flex-wrap items-center gap-2 px-3 py-2 text-sm sm:gap-3">
                <div className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  m.confidence === "high" ? "bg-green-400" :
                  m.confidence === "medium" ? "bg-amber-400" :
                  m.confidence === "low" ? "bg-orange-400" : "bg-red-400"
                )} />
                <div className="min-w-0 flex-1 break-words">
                  <span className="mr-2 text-xs text-muted-foreground line-through break-all">{m.inputName}</span>
                  {m.mod ? (
                    <span className="font-medium break-words">{m.mod.name}</span>
                  ) : (
                    <span className="italic text-red-700 dark:text-red-400">No match</span>
                  )}
                </div>
                {m.mod && (
                  <span className="shrink-0 text-[10px] capitalize text-muted-foreground">{m.mod.category}</span>
                )}
              </div>
            ))}
          </div>
          {validMatchCount > 0 && (
            <div className="p-3 border-t border-border">
              <button
                onClick={handleImportMatches}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Check className="h-4 w-4" /> Import {Math.min(validMatchCount, numSlots)} Mod{Math.min(validMatchCount, numSlots) !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
