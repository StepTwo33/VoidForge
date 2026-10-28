"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Type, X, Check, AlertTriangle, Loader2, Info, RotateCcw, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EquippedMod, Mod } from "@/lib/types";
import {
  MAX_IMPORT_CHARS,
  MAX_IMPORT_LINES,
  SKIP_LABEL,
  buildImportPlan,
  createMatchSession,
  matchModList,
  parseModList,
  type ImportMode,
  type PlanRow,
} from "@/lib/builds/mod-list-import";
import {
  importCapacityPreviewText,
  isOverCapacity,
  type CapacityFigures,
} from "@/lib/builds/import-capacity-notice";

export interface ImportApplied {
  /** Full mod list for the build after the import. */
  mods: EquippedMod[];
  mode: ImportMode;
  imported: number;
  /** Lines that were not imported. */
  skipped: number;
  /** Equipped mods a "replace" import removed. */
  replaced: number;
}

interface BuildImporterProps {
  itemName: string;
  itemKind: "weapon" | "warframe";
  catalog: readonly Mod[];
  isEligible: (mod: Mod) => boolean;
  explainIneligible?: (mod: Mod) => string;
  /** Regular mod slot indexes, in fill order (never the Exilus / Aura slots). */
  regularSlots: readonly number[];
  /** Warframe Aura slot indexes; Aura mods are placed here. */
  auraSlots?: readonly number[];
  isAura?: (mod: Mod) => boolean;
  /** What is equipped right now. */
  existing: readonly EquippedMod[];
  /** Capacity the build would show after applying these mods (used / max), for the over-capacity note. */
  capacityAfter?: (mods: EquippedMod[]) => CapacityFigures;
  onImport: (result: ImportApplied) => void;
  onClose: () => void;
}

const EXAMPLE = "Serration R10\nSplit Chamber (rank 5)\nHeavy Caliber 10/10\nVital Sense";

const NOT_IMPORTED: Record<"weapon" | "warframe", string> = {
  weapon: "Forma and slot polarities, the Orokin Catalyst, Incarnon evolutions, Arcanes and Rivens aren't part of a mod list, so they stay as they are on this build.",
  warframe: "Forma and slot polarities, the Orokin Reactor, Archon Shards, Arcanes and Helminth choices aren't part of a mod list, so they stay as they are on this build.",
};

function rankText(row: PlanRow): string | null {
  if (!row.mod || row.rank === null) return null;
  return `Rank ${row.rank}/${row.mod.maxRank}`;
}

export function BuildImporter({
  itemName,
  itemKind,
  catalog,
  isEligible,
  explainIneligible,
  regularSlots,
  auraSlots,
  isAura,
  existing,
  capacityAfter,
  onImport,
  onClose,
}: BuildImporterProps) {
  const [tab, setTab] = useState<"paste" | "screenshot">("paste");
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ImportMode>("replace");
  const [overrides, setOverrides] = useState<Record<number, string>>({});
  const [confirming, setConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrMessage, setOcrMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // On a phone the dialog opens below the fold: bring it into view.
  useEffect(() => {
    rootRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }, []);

  const session = useMemo(
    () => createMatchSession({ catalog, isEligible, explainIneligible, itemName }),
    [catalog, isEligible, explainIneligible, itemName],
  );

  const deferredText = useDeferredValue(text);
  const parsed = useMemo(() => parseModList(deferredText), [deferredText]);
  const matched = useMemo(() => matchModList(parsed.lines, session), [parsed, session]);
  const plan = useMemo(
    () => buildImportPlan(matched, session, { mode, regularSlots, auraSlots, isAura, existing, overrides }),
    [matched, session, mode, regularSlots, auraSlots, isAura, existing, overrides],
  );

  const hasText = text.trim().length > 0;
  const equippedCount = existing.length;
  const replacing = mode === "replace" && equippedCount > 0;

  // The paste is a list for a different kind of item: nothing fits, and the mods are real mods.
  const wrongItem = useMemo(() => {
    if (!plan.rows.length || plan.importedCount > 0) return null;
    const real = plan.rows.filter((r) => r.matched.status === "ineligible" && r.matched.mod);
    if (real.length < Math.max(1, Math.ceil(plan.rows.length / 2))) return null;
    const kinds = new Map<string, number>();
    for (const r of real) {
      const c = r.matched.mod!.category;
      const label = c === "warframe" ? "Warframe" : c === "general" ? "general" : c.replace(/_/g, " ");
      kinds.set(label, (kinds.get(label) ?? 0) + 1);
    }
    const top = [...kinds.entries()].sort((a, b) => b[1] - a[1])[0][0];
    return `These look like ${top} mods, which ${itemName} can't use. Check you're importing into the right item.`;
  }, [plan, itemName]);

  // Imports carry no Forma/polarities, so the result can look over capacity: say so before applying.
  const capacityNote = useMemo(() => {
    if (!capacityAfter || plan.importedCount === 0) return null;
    const figures = capacityAfter(plan.result);
    return isOverCapacity(figures.used, figures.max) ? figures : null;
  }, [capacityAfter, plan]);

  const setOverride = useCallback((index: number, modId: string) => {
    setOverrides((prev) => ({ ...prev, [index]: modId }));
    setConfirming(false);
  }, []);
  const clearOverride = useCallback((index: number) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
    setConfirming(false);
  }, []);

  const handleText = (value: string) => {
    setText(value);
    setOverrides({});
    setConfirming(false);
  };

  const doImport = useCallback(() => {
    if (plan.importedCount === 0) return;
    onImport({
      mods: plan.result,
      mode,
      imported: plan.importedCount,
      skipped: plan.skippedCount,
      replaced: plan.replacedCount,
    });
  }, [plan, mode, onImport]);

  const handleImportClick = () => {
    if (plan.importedCount === 0) return;
    if (replacing && !confirming) {
      setConfirming(true);
      return;
    }
    doImport();
  };

  // Screenshot: read the text, then drop it into the paste box so it can be checked and edited.
  const handleScreenshot = useCallback(async (file: File) => {
    setOcrMessage(null);
    if (!file.type.startsWith("image/")) {
      setOcrMessage({ tone: "error", text: "That file isn't an image. Choose a PNG or JPG screenshot of your mod screen, or paste the mod names instead." });
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setOcrMessage({ tone: "error", text: "That image is over 12 MB. Crop it to the mod list or paste the mod names instead." });
      return;
    }
    setIsProcessing(true);
    let worker: { terminate: () => Promise<unknown> } | null = null;
    let url: string | null = null;
    try {
      const { createWorker } = await import("tesseract.js");
      const ocrWorker = await createWorker("eng");
      worker = ocrWorker;
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      url = objectUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("image"));
        img.src = objectUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = gray > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = val;
      }
      ctx.putImageData(imageData, 0, 0);
      const { data: result } = await ocrWorker.recognize(canvas);
      const lines = result.text
        .split("\n")
        .map((l: string) => l.trim())
        .filter((l: string) => (l.match(/\p{L}/gu) ?? []).length >= 4);
      if (lines.length === 0) {
        setOcrMessage({
          tone: "error",
          text: "No text could be read from that screenshot. Use a sharp, full-size screenshot of the mod list (not a photo of a screen), or paste the mod names instead.",
        });
        return;
      }
      handleText(lines.join("\n"));
      setTab("paste");
      setOcrMessage({
        tone: "info",
        text: `Read ${lines.length} line${lines.length === 1 ? "" : "s"} from the screenshot. Screenshot reading is a beta and often misreads names, so check the list below and fix anything wrong.`,
      });
    } catch (err) {
      if (process.env.NODE_ENV === "development") console.error("OCR error:", err);
      setOcrMessage({
        tone: "error",
        text: "The screenshot couldn't be read (the text reader may have failed to load, or the image is damaged). Try again, or paste the mod names instead.",
      });
    } finally {
      if (worker) {
        try { await worker.terminate(); } catch { /* already terminated */ }
      }
      if (url) URL.revokeObjectURL(url);
      setIsProcessing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const importLabel =
    plan.importedCount === 0
      ? "Nothing to import yet"
      : `${replacing ? "Replace with " : "Import "}${plan.importedCount} mod${plan.importedCount === 1 ? "" : "s"}`;

  return (
    <div ref={rootRef} className="min-w-0 w-full scroll-mt-20 overflow-hidden rounded-xl border border-blue-500/30 bg-card p-4 sm:p-5" data-testid="mod-importer">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-blue-700 dark:text-blue-400">IMPORT MODS</h2>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close import"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* What it accepts + what it does */}
      <div className="mb-4 space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Paste mod names</span> (one per line or comma-separated, with an optional rank) or{" "}
          <span className="font-semibold text-foreground">upload a screenshot</span> of your mod screen. Each name is matched to a mod {itemName} can equip.
        </p>
        <pre className="overflow-x-auto rounded-md bg-background/60 p-2 font-mono text-[11px] leading-snug text-foreground" aria-label="Example list">{EXAMPLE}</pre>
        <p>No rank written means max rank. A pasted list only carries mod names and ranks. {NOT_IMPORTED[itemKind]}</p>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Import source">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "paste"}
          onClick={() => setTab("paste")}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors",
            tab === "paste" ? "border-blue-600 bg-blue-600 text-white" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <Type className="h-3.5 w-3.5" /> Paste list
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "screenshot"}
          onClick={() => setTab("screenshot")}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors",
            tab === "screenshot" ? "border-blue-600 bg-blue-600 text-white" : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <Camera className="h-3.5 w-3.5" /> Screenshot
          <span className="rounded bg-amber-500/20 px-1 py-0.5 text-[9px] text-amber-800 dark:text-amber-400">BETA</span>
        </button>
      </div>

      {tab === "screenshot" && (
        <div className="mb-3">
          <p className="mb-2 text-xs text-muted-foreground">
            Upload a screenshot of the mod list. The text is read in your browser (nothing is uploaded) and put in the paste box so you can fix misreads before importing.
          </p>
          <label
            className={cn(
              "flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-blue-500/50",
              isProcessing && "pointer-events-none opacity-60",
            )}
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin text-blue-500" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{isProcessing ? "Reading screenshot…" : "Choose a screenshot (PNG or JPG)"}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Choose a screenshot of your mods"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleScreenshot(f); }}
            />
          </label>
        </div>
      )}

      {ocrMessage && (
        <div
          role={ocrMessage.tone === "error" ? "alert" : "status"}
          className={cn(
            "mb-3 flex items-start gap-2 rounded-lg border p-2.5 text-xs",
            ocrMessage.tone === "error" ? "border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-400" : "border-blue-500/30 bg-blue-500/5 text-blue-800 dark:text-blue-300",
          )}
        >
          {ocrMessage.tone === "error" ? <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
          <span>{ocrMessage.text}</span>
        </div>
      )}

      {/* Paste box */}
      <div className="mb-3">
        <label htmlFor="mod-import-text" className="mb-1.5 block text-xs text-muted-foreground">
          Mod list
        </label>
        <textarea
          id="mod-import-text"
          value={text}
          onChange={(e) => handleText(e.target.value)}
          rows={5}
          spellCheck={false}
          placeholder={EXAMPLE}
          className="min-h-28 w-full resize-y rounded-lg border border-border bg-background p-3 text-base placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring sm:text-sm"
        />
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>{hasText ? `${parsed.lines.length} line${parsed.lines.length === 1 ? "" : "s"} read` : "The preview appears as you type."}</span>
          {hasText && (
            <button type="button" onClick={() => handleText("")} className="inline-flex min-h-11 items-center px-2 underline-offset-2 hover:underline sm:min-h-0">
              Clear
            </button>
          )}
        </div>
      </div>

      {(parsed.textCut || parsed.extraLines > 0) && (
        <div role="status" className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {parsed.textCut
              ? `That paste is very long, so only the first ${MAX_IMPORT_CHARS.toLocaleString()} characters were read. `
              : ""}
            {parsed.extraLines > 0
              ? `Only the first ${MAX_IMPORT_LINES} lines were read (${parsed.extraLines} more ignored). A build holds ${regularSlots.length}${auraSlots?.length ? " plus an Aura" : ""} mods, so check this is a mod list.`
              : ""}
          </span>
        </div>
      )}

      {hasText && parsed.lines.length === 0 && (
        <p role="status" className="mb-3 rounded-lg border border-border p-2.5 text-xs text-muted-foreground">
          No mod names found in that text. Each line needs a mod name, such as <span className="font-mono text-foreground">Serration R10</span>.
        </p>
      )}

      {wrongItem && (
        <div role="alert" className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{wrongItem}</span>
        </div>
      )}

      {/* Preview */}
      {plan.rows.length > 0 && (
        <div className="mb-3 overflow-hidden rounded-lg border border-border" data-testid="import-preview">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border bg-muted/30 px-3 py-2 text-xs" aria-live="polite">
            <span className="font-medium text-foreground">
              {plan.importedCount} of {plan.rows.length} line{plan.rows.length === 1 ? "" : "s"} will be imported
            </span>
            {plan.skippedCount > 0 && <span className="font-medium text-amber-700 dark:text-amber-400">{plan.skippedCount} won&apos;t be</span>}
          </div>
          <ul className="divide-y divide-border">
            {plan.rows.map((row) => (
              <PreviewRow
                key={row.matched.line.index}
                row={row}
                onPick={(id) => setOverride(row.matched.line.index, id)}
                onSkip={() => setOverride(row.matched.line.index, "skip")}
                onReset={() => clearOverride(row.matched.line.index)}
                hasOverride={overrides[row.matched.line.index] !== undefined}
              />
            ))}
          </ul>
        </div>
      )}

      {/* What the import does to the build */}
      <fieldset className="mb-3">
        <legend className="mb-1.5 text-xs text-muted-foreground">
          {equippedCount > 0 ? `This build has ${equippedCount} mod${equippedCount === 1 ? "" : "s"} equipped. When you import:` : "This build has no mods equipped yet."}
        </legend>
        {equippedCount > 0 && (
          <div className="flex flex-col gap-1.5 sm:flex-row">
            {(
              [
                ["replace", "Replace all mods", "Clears every slot (Exilus and Aura too), then fills from the top"],
                ["fill", "Add to empty slots", "Keeps what's equipped and only fills free slots"],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex min-h-11 flex-1 cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-xs transition-colors",
                  mode === value ? "border-blue-500/60 bg-blue-500/10" : "border-border hover:border-blue-500/30",
                )}
              >
                <input
                  type="radio"
                  name="mod-import-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => { setMode(value); setConfirming(false); }}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium text-foreground">{label}</span>
                  <span className="block text-muted-foreground">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        )}
        <p className="mt-1.5 text-[11px] text-muted-foreground">You can undo the import right after from the confirmation message.</p>
      </fieldset>

      {capacityNote && (
        <div role="status" data-testid="import-dialog-capacity-note" className="mb-3 flex items-start gap-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-2.5 text-xs">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden="true" />
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Capacity may look over. </span>
            {importCapacityPreviewText(capacityNote)}
          </p>
        </div>
      )}

      {confirming && (
        <div role="alert" className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/5 p-2.5 text-xs text-amber-900 dark:text-amber-200">
          This removes all {equippedCount} mod{equippedCount === 1 ? "" : "s"} currently on this build (including Exilus and Aura) and equips the {plan.importedCount} imported
          mod{plan.importedCount === 1 ? "" : "s"}. You can undo it right after.
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleImportClick}
          disabled={plan.importedCount === 0}
          className={cn(
            "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            plan.importedCount === 0
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : confirming
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-blue-600 text-white hover:bg-blue-700",
          )}
        >
          <Check className="h-4 w-4" />
          {confirming ? `Yes, replace ${equippedCount} with ${plan.importedCount}` : importLabel}
        </button>
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function PreviewRow({
  row,
  onPick,
  onSkip,
  onReset,
  hasOverride,
}: {
  row: PlanRow;
  onPick: (modId: string) => void;
  onSkip: () => void;
  onReset: () => void;
  hasOverride: boolean;
}) {
  const { matched } = row;
  const imported = row.skip === null;
  const pasted = matched.line.raw;
  const showPasted = row.mod ? matched.line.name.toLowerCase().replace(/\s+/g, " ") !== row.mod.name.toLowerCase() || matched.line.rank !== null : true;
  const warn = imported && (matched.status === "typo" || matched.status === "partial" || matched.status === "renamed");
  const choices = !imported && (matched.status === "ambiguous" || matched.status === "unmatched") ? matched.candidates : [];

  return (
    <li className="flex flex-col gap-1.5 px-3 py-2.5 text-xs" data-status={imported ? "imported" : row.skip}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0">
          {imported ? (
            warn ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> : <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Ban className="h-3.5 w-3.5 text-red-500" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {row.mod ? (
              <span className={cn("break-words text-sm font-medium", imported ? "text-foreground" : "text-muted-foreground")}>{row.mod.name}</span>
            ) : (
              <span className="break-words text-sm font-medium text-muted-foreground">&ldquo;{matched.line.name}&rdquo;</span>
            )}
            {imported && rankText(row) && <span className="text-[11px] text-muted-foreground">{rankText(row)}</span>}
            {!imported && row.skip && (
              <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:text-red-400">{SKIP_LABEL[row.skip]}</span>
            )}
          </div>
          {showPasted && row.mod && <div className="break-words text-[11px] text-muted-foreground">from &ldquo;{pasted}&rdquo;</div>}
          {imported && matched.note && <div className="text-[11px] text-amber-700 dark:text-amber-400">{matched.note}</div>}
          {imported && row.rankNote && <div className="text-[11px] text-muted-foreground">{row.rankNote}</div>}
          {!imported && row.skipNote && <div className="text-[11px] text-muted-foreground">{row.skipNote}</div>}
          {!imported && matched.status === "unmatched" && choices.length === 0 && (
            <div className="text-[11px] text-muted-foreground">Fix the spelling in the list above, or add the mod from its slot.</div>
          )}
        </div>
        <div className="shrink-0">
          {imported ? (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:text-red-700 dark:hover:text-red-400 sm:min-h-8 sm:min-w-8"
              aria-label={`Skip ${row.mod?.name ?? pasted}`}
              title="Skip this line"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : hasOverride ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-[11px] text-muted-foreground hover:text-foreground sm:min-h-8"
              aria-label={`Restore ${pasted}`}
            >
              <RotateCcw className="h-3 w-3" /> Restore
            </button>
          ) : null}
        </div>
      </div>
      {choices.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-5" aria-label={`Choices for ${matched.line.name}`}>
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              className="inline-flex min-h-11 items-center rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-500/20 dark:text-blue-400 sm:min-h-8"
            >
              Use {c.name}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
