"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  DataOverride,
  deleteOverride,
  deleteOverrides,
  exportOverrides,
  getOverrideForTarget,
  getOverrides,
  importOverrides,
  OverrideCategory,
  OVERRIDE_CATEGORIES,
} from "@/lib/overrides/data-overrides";
import {
  exportLegacyLocalOverrides,
  getLegacyLocalOverrideCount,
  loadSharedOverrides,
  uploadLegacyLocalOverrides,
} from "@/lib/overrides/data-overrides-client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Wrench,
  Search,
  X,
} from "lucide-react";
import { OverrideEditor } from "@/components/override-editor";
import {
  formatOverrideFieldsSummary,
  OVERRIDE_ACTION_LABELS,
  OVERRIDE_CATEGORY_LABELS,
} from "@/lib/overrides/override-schemas";
import type { DataFixesPrefill } from "@/lib/overrides/data-fixes-url";
import { NavBack } from "@/components/nav-back";
import { returnLabel } from "@/lib/site/nav-return";

const ACTION_CHIP: Record<DataOverride["action"], string> = {
  modify: "text-blue-800 bg-blue-500/10 dark:text-blue-400",
  add: "text-green-800 bg-green-500/10 dark:text-green-400",
  remove: "text-red-800 bg-red-500/10 dark:text-red-400",
};

export function DataFixesPanel({
  initialPrefill,
  returnTo,
  compactHeader,
}: {
  initialPrefill?: DataFixesPrefill;
  returnTo?: string | null;
  compactHeader?: boolean;
}) {
  const { confirm } = useConfirmDialog();
  const [overrides, setOverrides] = useState<DataOverride[]>([]);
  const [showEditor, setShowEditor] = useState(Boolean(initialPrefill?.itemId || initialPrefill?.existingOverrideId));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [legacyLocalCount, setLegacyLocalCount] = useState(0);
  const [legacyUploading, setLegacyUploading] = useState(false);
  const [prefill, setPrefill] = useState<DataFixesPrefill | undefined>(initialPrefill);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");

  const refreshOverrides = useCallback(() => {
    void loadSharedOverrides().then(() => {
      setOverrides(getOverrides());
      setLegacyLocalCount(getLegacyLocalOverrideCount());
    });
  }, []);

  useEffect(() => {
    queueMicrotask(() => refreshOverrides());
  }, [refreshOverrides]);

  useEffect(() => {
    const onUpdate = () => {
      setOverrides(getOverrides());
      setLegacyLocalCount(getLegacyLocalOverrideCount());
    };
    window.addEventListener("framehub-data-overrides-updated", onUpdate);
    return () => window.removeEventListener("framehub-data-overrides-updated", onUpdate);
  }, []);

  useEffect(() => {
    if (!initialPrefill) return;
    queueMicrotask(() => {
      setPrefill(initialPrefill);
      if (initialPrefill.itemId || initialPrefill.existingOverrideId) {
        setShowEditor(true);
      }
    });
  }, [initialPrefill]);

  const filteredOverrides = useMemo(() => {
    let list = [...overrides];
    if (filterType !== "all") list = list.filter((o) => o.targetType === filterType);
    if (filterAction !== "all") list = list.filter((o) => o.action === filterAction);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.targetId.toLowerCase().includes(q)
          || o.note.toLowerCase().includes(q)
          || (o.updatedBy?.toLowerCase().includes(q) ?? false),
      );
    }
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [overrides, filterType, filterAction, searchQuery]);

  const filteredIds = useMemo(() => filteredOverrides.map((o) => o.id), [filteredOverrides]);
  const selectedVisibleCount = useMemo(
    () => filteredIds.filter((id) => selectedIds.has(id)).length,
    [filteredIds, selectedIds],
  );
  const allVisibleSelected = filteredIds.length > 0 && selectedVisibleCount === filteredIds.length;
  const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;

  const counts = useMemo(() => {
    const byAction = { modify: 0, add: 0, remove: 0 };
    for (const o of overrides) byAction[o.action]++;
    return byAction;
  }, [overrides]);

  const handleSaved = useCallback(() => {
    refreshOverrides();
    setShowEditor(false);
    setPrefill(undefined);
  }, [refreshOverrides]);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        for (const id of filteredIds) next.delete(id);
      } else {
        for (const id of filteredIds) next.add(id);
      }
      return next;
    });
  }, [allVisibleSelected, filteredIds]);

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await confirm({
        title: "Delete data fix?",
        description: "The site will revert to the original data for this item.",
        confirmLabel: "Delete",
        destructive: true,
      });
      if (!ok) return;
      try {
        await deleteOverride(id);
        setSelectedIds((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        refreshOverrides();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete");
      }
    },
    [confirm, refreshOverrides],
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Delete ${ids.length} data fix${ids.length === 1 ? "" : "es"}?`,
      description: "The site will revert to the original data for these items.",
      confirmLabel: `Delete ${ids.length}`,
      destructive: true,
    });
    if (!ok) return;
    setBulkDeleting(true);
    try {
      const deleted = await deleteOverrides(ids);
      setSelectedIds(new Set());
      refreshOverrides();
      toast.success(`Deleted ${deleted} fix${deleted === 1 ? "" : "es"}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBulkDeleting(false);
    }
  }, [confirm, refreshOverrides, selectedIds]);

  const handleEdit = useCallback((ovr: DataOverride) => {
    setPrefill({
      existingOverrideId: ovr.id,
      category: ovr.targetType,
      itemId: ovr.targetId,
      note: ovr.note,
      action: ovr.action,
      fields: ovr.fields,
    });
    setShowEditor(true);
  }, []);

  const handleExportJson = useCallback(async () => {
    const data = await exportOverrides();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `framehub-data-fixes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExportTypeScript = useCallback(() => {
    const adds = getOverrides().filter((o) => o.action === "add");
    if (adds.length === 0) {
      toast.info("No “New item” fixes to export.");
      return;
    }
    const byType: Record<string, string[]> = {};
    for (const o of adds) {
      if (!byType[o.targetType]) byType[o.targetType] = [];
      const lines = JSON.stringify(o.fields, null, 2)
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n");
      byType[o.targetType].push(`  // ${o.note || "Added via data fix"}\n${lines},`);
    }
    let ts = `// Exported from Frame Hub Data Fixes — ${new Date().toISOString().slice(0, 10)}\n\n`;
    for (const [type, entries] of Object.entries(byType)) {
      ts += `// ── ${type.toUpperCase()} ──\n${entries.join("\n")}\n\n`;
    }
    const blob = new Blob([ts], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `framehub-custom-items-${new Date().toISOString().slice(0, 10)}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        void importOverrides(reader.result as string).then((count) => {
          refreshOverrides();
          toast.success(`Imported ${count} new fix(es). Existing items were skipped.`);
        });
      };
      reader.readAsText(file);
    };
    input.click();
  }, [refreshOverrides]);

  const handleUploadLegacy = useCallback(async () => {
    setLegacyUploading(true);
    try {
      const { imported, remaining } = await uploadLegacyLocalOverrides();
      refreshOverrides();
      toast.success(
        remaining === 0
          ? `Uploaded ${imported} fix(es). Browser copy cleared.`
          : `Uploaded ${imported}. ${remaining} still only on this device — export JSON if needed.`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLegacyUploading(false);
    }
  }, [refreshOverrides]);

  const handleExportLegacy = useCallback(() => {
    const data = exportLegacyLocalOverrides();
    if (!data) {
      toast.info("No browser-saved fixes on this device.");
      return;
    }
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `framehub-browser-fixes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const startNewFix = () => {
    setPrefill(undefined);
    setShowEditor(true);
  };

  return (
    <div className="space-y-6">
      {returnTo && (
        <NavBack href={returnTo} label={returnLabel(returnTo)} />
      )}

      {!compactHeader && (
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Data Fixes</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Staff-only edits to game data. Fixes apply site-wide — correct wrong stats, add missing items, or hide entries that should not appear.
          </p>
        </div>
      )}

      {compactHeader && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-purple-500/25 bg-purple-500/5 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Staff data fixes — shared site-wide.
          </p>
          <Link
            href="/admin/data-fixes"
            className="text-xs font-medium text-purple-800 hover:text-purple-700 dark:text-purple-400"
          >
            Open full Data Fixes hub →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          <span className="font-medium text-foreground">{overrides.length}</span> total
        </span>
        <span className="rounded-full border border-blue-500/30 bg-blue-500/5 px-2.5 py-1 text-blue-800 dark:text-blue-300">
          {counts.modify} fixes
        </span>
        <span className="rounded-full border border-green-500/30 bg-green-500/5 px-2.5 py-1 text-green-800 dark:text-green-300">
          {counts.add} added
        </span>
        <span className="rounded-full border border-red-500/30 bg-red-500/5 px-2.5 py-1 text-red-800 dark:text-red-300">
          {counts.remove} hidden
        </span>
      </div>

      {legacyLocalCount > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            This browser has <strong>{legacyLocalCount}</strong> old local fix{legacyLocalCount === 1 ? "" : "es"} not yet on the server.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleUploadLegacy()}
              disabled={legacyUploading}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {legacyUploading ? "Uploading…" : "Upload to server"}
            </button>
            <button
              type="button"
              onClick={handleExportLegacy}
              className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs text-amber-900 hover:bg-amber-500/10 dark:text-amber-200"
            >
              Export browser JSON
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, note, or author…"
            className="h-8 pl-8 text-xs"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-8 rounded-lg border border-border bg-background px-2 text-xs"
        >
          <option value="all">All types</option>
          {OVERRIDE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{OVERRIDE_CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="h-8 rounded-lg border border-border bg-background px-2 text-xs"
        >
          <option value="all">All actions</option>
          <option value="modify">{OVERRIDE_ACTION_LABELS.modify}</option>
          <option value="add">{OVERRIDE_ACTION_LABELS.add}</option>
          <option value="remove">{OVERRIDE_ACTION_LABELS.remove}</option>
        </select>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleImport}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
          <button
            type="button"
            onClick={() => void handleExportJson()}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" /> JSON
          </button>
          <button
            type="button"
            onClick={handleExportTypeScript}
            className="flex items-center gap-1 rounded-lg border border-purple-500/40 px-3 py-1.5 text-xs text-purple-800 hover:text-purple-700 dark:text-purple-400"
          >
            <Download className="h-3.5 w-3.5" /> .ts export
          </button>
          <button
            type="button"
            onClick={() => (showEditor ? (setShowEditor(false), setPrefill(undefined)) : startNewFix())}
            className={cn(
              "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              showEditor ? "bg-red-600 text-white" : "bg-purple-600 text-white hover:bg-purple-700",
            )}
          >
            {showEditor ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showEditor ? "Cancel" : "New fix"}
          </button>
        </div>
      </div>

      {showEditor && (
        <OverrideEditor
          prefill={prefill}
          onSave={handleSaved}
          onCancel={() => {
            setShowEditor(false);
            setPrefill(undefined);
          }}
          backLink={returnTo ? { href: returnTo, label: returnLabel(returnTo) } : undefined}
        />
      )}

      <div className="space-y-2">
        {filteredOverrides.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Wrench className="mx-auto mb-3 h-8 w-8 opacity-40" />
            <p className="text-sm">
              {overrides.length === 0 ? "No data fixes yet." : "No fixes match your filters."}
            </p>
            <p className="mt-1 text-xs">
              Pick an item from the Codex and use <strong>Edit in Data Fixes</strong>, or click New fix above.
            </p>
          </div>
        )}
        {filteredOverrides.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someVisibleSelected;
                }}
                onChange={toggleSelectAllVisible}
                className="h-3.5 w-3.5 rounded border-border"
              />
              Select all{filterType !== "all" || filterAction !== "all" || searchQuery.trim() ? " visible" : ""}
              <span className="text-muted-foreground/70">({filteredIds.length})</span>
            </label>
            {selectedIds.size > 0 && (
              <>
                <span className="text-xs text-muted-foreground">
                  {selectedIds.size} selected
                </span>
                <button
                  type="button"
                  disabled={bulkDeleting}
                  onClick={() => void handleBulkDelete()}
                  className="ml-auto flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {bulkDeleting ? "Deleting…" : `Delete ${selectedIds.size}`}
                </button>
              </>
            )}
          </div>
        )}

        {filteredOverrides.map((ovr) => {
          const isExpanded = expandedId === ovr.id;
          const isSelected = selectedIds.has(ovr.id);
          return (
            <div
              key={ovr.id}
              className={cn(
                "overflow-hidden rounded-xl border bg-card",
                isSelected ? "border-purple-500/40 bg-purple-500/5" : "border-border",
              )}
            >
              <div className="flex w-full items-center gap-2 p-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelected(ovr.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${ovr.targetId}`}
                  className="h-3.5 w-3.5 shrink-0 rounded border-border"
                />
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : ovr.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className={cn("shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium", ACTION_CHIP[ovr.action])}>
                    {OVERRIDE_ACTION_LABELS[ovr.action]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="truncate text-sm font-medium">{ovr.targetId}</code>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize text-muted-foreground">
                        {OVERRIDE_CATEGORY_LABELS[ovr.targetType]}
                      </span>
                    </div>
                    {ovr.note && (
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{ovr.note}</p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="space-y-3 border-t border-border p-3">
                  <p className="text-[10px] text-muted-foreground">
                    Updated {new Date(ovr.timestamp).toLocaleString()}
                    {ovr.updatedBy && <> · {ovr.updatedBy}</>}
                  </p>
                  {Object.keys(ovr.fields).length > 0 && (
                    <ul className="space-y-0.5 text-xs">
                      {formatOverrideFieldsSummary(ovr.fields).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-2 border-t border-border pt-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(ovr)}
                      className="flex items-center gap-1 rounded bg-purple-500/10 px-2 py-1 text-[10px] text-purple-800 hover:bg-purple-500/20 dark:text-purple-400"
                    >
                      <Wrench className="h-3 w-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(ovr.id)}
                      className="ml-auto flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-[10px] text-red-700 hover:bg-red-500/20 dark:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Build prefill when creating a fix from an issue report. */
export function prefillFromReport(report: {
  itemType: string;
  itemName: string;
  itemId: string;
  issues: string;
  statDiscrepancies: string;
  comment: string;
}): DataFixesPrefill {
  const typeMap: Record<string, OverrideCategory> = {
    weapon: "weapon",
    mod: "mod",
    companion: "companion",
    warframe: "warframe",
    arcane: "arcane",
    arcane_effect: "arcane_effect",
    archon_shard: "archon_shard",
    archwing: "archwing",
    necramech: "necramech",
  };
  const issues = (() => {
    try {
      return JSON.parse(report.issues || "{}") as Record<string, boolean>;
    } catch {
      return {};
    }
  })();
  const discrepancies: { stat: string; currentValue: string; expectedValue: string }[] = (() => {
    try {
      return JSON.parse(report.statDiscrepancies || "[]");
    } catch {
      return [];
    }
  })();

  const cat = typeMap[report.itemType] ?? "weapon";
  let action: DataFixesPrefill["action"] = "modify";
  const fields: Record<string, unknown> = {};
  if (issues.doesNotExist) {
    action = "remove";
  } else if (discrepancies.length > 0) {
    const statPrefix =
      cat === "mod" || cat === "arcane" ? "stats." : cat === "archon_shard" ? "statBonuses." : "";
    for (const d of discrepancies) {
      if (!d.stat || !d.expectedValue) continue;
      const key = d.stat.includes(".") ? d.stat : statPrefix ? `${statPrefix}${d.stat}` : d.stat;
      const num = Number(d.expectedValue);
      fields[key] = Number.isNaN(num) ? d.expectedValue : num;
    }
  }

  const itemId = report.itemId || "";
  const existing = itemId ? getOverrideForTarget(cat, itemId) : undefined;

  return {
    existingOverrideId: existing?.id,
    category: cat,
    itemId: itemId || undefined,
    note: existing?.note ?? `From report: ${report.itemName}${report.comment ? ` — ${report.comment}` : ""}`,
    action: existing?.action ?? action,
    fields: existing?.fields ?? fields,
  };
}
