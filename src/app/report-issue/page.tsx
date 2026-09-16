"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell, PageMain, PageHero } from "@/components/page-shell";
import { OverrideCategory, OVERRIDE_CATEGORIES } from "@/lib/overrides/data-overrides";
import { dataFixesHref } from "@/lib/overrides/data-fixes-url";
import { DataFixesPanel, prefillFromReport } from "@/components/data-fixes-panel";
import type { DataFixesPrefill } from "@/lib/overrides/data-fixes-url";
import { allWeapons } from "@/data/weapons";
import { allMods } from "@/data/mods";
import { allCompanions } from "@/data/companions";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Flag, Plus, Trash2, Download, Check, X, ChevronDown, ChevronUp,
  AlertTriangle, Search, Wrench, Edit3,
} from "lucide-react";
import { NavBack } from "@/components/nav-back";
import { decodeReturnTo, returnLabel } from "@/lib/site/nav-return";

interface ApiReport {
  id: string;
  userId: string | null;
  reporterName: string;
  itemType: string;
  itemName: string;
  itemId: string;
  issues: string;
  statDiscrepancies: string;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: { name: string | null; email: string | null; image: string | null };
}

const ITEM_TYPES = ["weapon", "mod", "warframe", "companion", "archon_shard", "other"] as const;
type ItemType = (typeof ITEM_TYPES)[number];

const ISSUE_FLAGS = [
  { key: "doesNotExist", label: "Doesn't exist in-game" },
  { key: "wrongStats", label: "Wrong stat values" },
  { key: "missingData", label: "Missing data" },
  { key: "wrongCost", label: "Wrong mod cost/drain" },
  { key: "wrongRank", label: "Wrong max rank" },
  { key: "wrongCategory", label: "Wrong category" },
  { key: "wrongPolarity", label: "Wrong polarity" },
  { key: "wrongRarity", label: "Wrong rarity" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  open: "#F59E0B",
  resolved: "#10B981",
  wontfix: "#6B7280",
};

function emptyIssues() {
  return {
    doesNotExist: false, wrongStats: false, missingData: false,
    wrongCost: false, wrongRank: false, wrongCategory: false,
    wrongPolarity: false, wrongRarity: false,
  };
}

export default function ReportIssuePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reports" | "overrides">("reports");
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<string>("user");
  const isAdmin = userRole === "admin" || userRole === "moderator";
  const [overridePrefill, setOverridePrefill] = useState<DataFixesPrefill | undefined>(undefined);
  const [overrideCount, setOverrideCount] = useState(0);

  // Form state
  const [formType, setFormType] = useState<ItemType>("weapon");
  const [formItemName, setFormItemName] = useState("");
  const [formItemId, setFormItemId] = useState("");
  const [formReporter, setFormReporter] = useState("");
  const [formIssues, setFormIssues] = useState(emptyIssues());
  const [formDiscrepancies, setFormDiscrepancies] = useState<{ stat: string; currentValue: string; expectedValue: string }[]>([]);
  const [formComment, setFormComment] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [returnTo, setReturnTo] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/reports").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setReports(data);
    }).catch(() => {});
  }, []);

  // Load session and reports
  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((data) => {
      if (data.user?.role) setUserRole(data.user.role);
    }).catch(() => {});
    queueMicrotask(() => refresh());
  }, [refresh]);

  useEffect(() => {
    const onUpdate = () => {
      fetch("/api/data-overrides")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setOverrideCount(data.length);
        })
        .catch(() => {});
    };
    onUpdate();
    window.addEventListener("framehub-data-overrides-updated", onUpdate);
    return () => window.removeEventListener("framehub-data-overrides-updated", onUpdate);
  }, []);

  // Pre-fill from URL query params (e.g. ?type=weapon&name=Braton&id=braton)
  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const qType = params.get("type");
      const qName = params.get("name");
      const qId = params.get("id");
      const qTab = params.get("tab");
      const qOverrideCat = params.get("overrideCategory");
      const qOverrideId = params.get("overrideId");
      const qReturnTo = decodeReturnTo(params.get("returnTo"));
      if (qReturnTo) setReturnTo(qReturnTo);
      if (qTab === "overrides") setActiveTab("overrides");
      if (qType && ITEM_TYPES.includes(qType as ItemType)) {
        setFormType(qType as ItemType);
      }
      if (qName) {
        setFormItemName(qName);
        setShowForm(true);
      }
      if (qId) setFormItemId(qId);
      if (qOverrideCat && qOverrideId && OVERRIDE_CATEGORIES.includes(qOverrideCat as OverrideCategory)) {
        setActiveTab("overrides");
        setOverridePrefill({
          category: qOverrideCat as OverrideCategory,
          itemId: qOverrideId,
          action: "modify",
        });
      }
    });
  }, []);

  const filteredReports = useMemo(() => {
    let r = [...reports];
    if (filterStatus !== "all") r = r.filter((x) => x.status === filterStatus);
    if (filterType !== "all") r = r.filter((x) => x.itemType === filterType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((x) => x.itemName.toLowerCase().includes(q) || x.comment.toLowerCase().includes(q));
    }
    return r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reports, filterStatus, filterType, searchQuery]);

  const itemSuggestions = useMemo(() => {
    if (!itemSearch.trim()) return [];
    const q = itemSearch.toLowerCase();
    const results: { id: string; name: string; type: string }[] = [];
    if (formType === "weapon") {
      allWeapons.filter((w) => w.name.toLowerCase().includes(q)).slice(0, 8).forEach((w) => results.push({ id: w.id, name: w.name, type: "weapon" }));
    } else if (formType === "mod") {
      allMods.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 8).forEach((m) => results.push({ id: m.id, name: m.name, type: "mod" }));
    } else if (formType === "companion") {
      allCompanions.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8).forEach((c) => results.push({ id: c.id, name: c.name, type: "companion" }));
    }
    return results;
  }, [itemSearch, formType]);

  const handleSubmit = useCallback(async () => {
    if (!formItemName.trim()) return;
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reporterName: formReporter.trim() || "Anonymous",
        itemType: formType,
        itemName: formItemName.trim(),
        itemId: formItemId.trim(),
        issues: { ...formIssues },
        statDiscrepancies: formDiscrepancies.filter((d) => d.stat.trim()),
        comment: formComment.trim(),
      }),
    });
    refresh();
    setFormItemName("");
    setFormItemId("");
    setFormIssues(emptyIssues());
    setFormDiscrepancies([]);
    setFormComment("");
    setShowForm(false);
  }, [formType, formItemName, formItemId, formReporter, formIssues, formDiscrepancies, formComment, refresh]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify(reports, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `framehub-reports-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reports]);

  const handleResolve = useCallback(async (id: string) => {
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" }),
    });
    refresh();
  }, [refresh]);

  const handleWontfix = useCallback(async (id: string) => {
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "wontfix" }),
    });
    refresh();
  }, [refresh]);

  const handleDelete = useCallback(async (id: string) => {
    await fetch(`/api/reports/${id}`, { method: "DELETE" });
    refresh();
  }, [refresh]);

  const toggleIssue = (key: string) => {
    setFormIssues((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleCreateOverrideFromReport = useCallback((report: ApiReport) => {
    router.push(dataFixesHref({ ...prefillFromReport(report), returnTo: returnTo ?? undefined }));
  }, [router, returnTo]);

  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <PageShell>
      <PageMain maxWidth="lg">
          {returnTo && (
            <NavBack href={returnTo} label={returnLabel(returnTo)} className="mb-4" />
          )}
          <PageHero
            icon={Flag}
            accent="amber"
            title="Report"
            highlight="Issue"
            description="Flag incorrect stats, missing items, or data problems. Staff review reports and can apply fixes."
          />
          {/* Tab Toggle */}
          <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab("reports")}
                className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-colors", activeTab === "reports" ? "bg-amber-600 text-white" : "text-muted-foreground hover:text-foreground")}
              >
                <Flag className="h-4 w-4" /> Reports {openCount > 0 && <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{openCount}</span>}
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("overrides")}
                  className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-colors", activeTab === "overrides" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-foreground")}
                >
                  <Wrench className="h-4 w-4" /> Data Fixes {overrideCount > 0 && <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{overrideCount}</span>}
                </button>
              )}
            </div>
            {activeTab === "reports" && (
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {isAdmin && (
                  <button onClick={handleExport} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
                    <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span>
                  </button>
                )}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={cn("inline-flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors", showForm ? "bg-red-700 text-white dark:bg-red-600" : "bg-amber-600 text-white hover:bg-amber-700")}
                >
                  {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {showForm ? "Cancel" : "New Report"}
                </button>
              </div>
            )}
          </div>

          {/* ========== REPORTS TAB ========== */}
          {activeTab === "reports" && (<>
          {/* New Report Form */}
          {showForm && (
            <div className="border border-amber-500/30 rounded-xl p-5 bg-card mb-6">
              <h2 className="mb-4 text-sm font-semibold text-amber-800 dark:text-amber-400">NEW ISSUE REPORT</h2>

              {/* Reporter */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Reporter Name (optional)</label>
                <Input value={formReporter} onChange={(e) => setFormReporter(e.target.value)} placeholder="Your name..." className="h-11 min-h-11 text-sm" />
              </div>

              {/* Item Type */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Item Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {ITEM_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setFormType(t); setFormItemName(""); setFormItemId(""); setItemSearch(""); }}
                      className={cn(
                        "min-h-11 rounded-lg border px-2.5 py-2 text-xs capitalize transition-colors",
                        formType === t ? "border-amber-600 bg-amber-600 text-white" : "border-border text-muted-foreground"
                      )}
                    >
                      {t.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Search/Select */}
              <div className="mb-4 relative">
                <label className="text-xs text-muted-foreground mb-1 block">Item Name</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={formItemName || itemSearch}
                    onChange={(e) => {
                      setItemSearch(e.target.value);
                      setFormItemName(e.target.value);
                      setShowItemPicker(true);
                    }}
                    placeholder={`Search ${formType}s or type a name...`}
                    className="h-11 min-h-11 pl-8 text-sm"
                  />
                </div>
                {showItemPicker && itemSuggestions.length > 0 && (
                  <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {itemSuggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setFormItemName(s.name); setFormItemId(s.id); setShowItemPicker(false); setItemSearch(""); }}
                        className="flex min-h-11 w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        {s.name} <span className="text-[10px] text-muted-foreground">({s.id})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Issue Flags */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-2 block">Issues (check all that apply)</label>
                <div className="grid grid-cols-1 gap-1.5 min-[380px]:grid-cols-2">
                  {ISSUE_FLAGS.map((flag) => (
                    <button
                      key={flag.key}
                      onClick={() => toggleIssue(flag.key)}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                        formIssues[flag.key as keyof typeof formIssues]
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-300"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0",
                        formIssues[flag.key as keyof typeof formIssues] ? "bg-amber-500 border-amber-500" : "border-muted-foreground/50"
                      )}>
                        {formIssues[flag.key as keyof typeof formIssues] && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      {flag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stat Discrepancies */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted-foreground">Stat Discrepancies</label>
                  <button
                    onClick={() => setFormDiscrepancies([...formDiscrepancies, { stat: "", currentValue: "", expectedValue: "" }])}
                    className="inline-flex min-h-11 items-center gap-0.5 text-[10px] text-amber-800 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    <Plus className="h-2.5 w-2.5" /> Add
                  </button>
                </div>
                {formDiscrepancies.map((d, i) => (
                  <div key={i} className="flex gap-2 mb-1.5 flex-wrap sm:flex-nowrap">
                    <Input
                      value={d.stat}
                      onChange={(e) => {
                        const next = [...formDiscrepancies];
                        next[i] = { ...next[i], stat: e.target.value };
                        setFormDiscrepancies(next);
                      }}
                      placeholder="Stat name"
                      className="h-11 min-h-11 min-w-[100px] flex-1 text-xs"
                    />
                    <Input
                      value={d.currentValue}
                      onChange={(e) => {
                        const next = [...formDiscrepancies];
                        next[i] = { ...next[i], currentValue: e.target.value };
                        setFormDiscrepancies(next);
                      }}
                      placeholder="Shows as"
                      className="h-11 min-h-11 w-full min-w-[5.5rem] flex-1 text-xs sm:w-24 sm:flex-none"
                    />
                    <Input
                      value={d.expectedValue}
                      onChange={(e) => {
                        const next = [...formDiscrepancies];
                        next[i] = { ...next[i], expectedValue: e.target.value };
                        setFormDiscrepancies(next);
                      }}
                      placeholder="Should be"
                      className="h-11 min-h-11 w-full min-w-[5.5rem] flex-1 text-xs sm:w-24 sm:flex-none"
                    />
                    <button onClick={() => setFormDiscrepancies(formDiscrepancies.filter((_, j) => j !== i))} className="inline-flex min-h-11 min-w-11 items-center justify-center text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" aria-label="Remove discrepancy">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">Comment</label>
                <textarea
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  className="h-24 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formItemName.trim()}
                className="flex w-full min-h-11 items-center justify-center rounded-lg bg-amber-600 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search reports..." className="h-11 min-h-11 pl-8 text-xs" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="min-h-11 rounded-lg border border-border bg-background px-2 py-2 text-xs"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="wontfix">Won&apos;t Fix</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="min-h-11 rounded-lg border border-border bg-background px-2 py-2 text-xs"
            >
              <option value="all">All Types</option>
              {ITEM_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
            <span className="text-[10px] text-muted-foreground ml-auto">{filteredReports.length} reports</span>
          </div>

          {/* Report List */}
          <div className="space-y-2">
            {filteredReports.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <AlertTriangle className="mx-auto mb-3 h-8 w-8 opacity-50" />
                <p className="text-sm font-medium text-foreground/80">
                  {reports.length === 0 ? "No reports yet." : "No reports match these filters."}
                </p>
                <p className="mt-1 text-xs">
                  {reports.length === 0
                    ? 'Click "New Report" to flag incorrect stats or missing items.'
                    : "Try clearing search or status filters."}
                </p>
              </div>
            )}
            {filteredReports.map((report) => {
              const isExpanded = expandedReport === report.id;
              const parsedIssues: Record<string, boolean> = (() => { try { return typeof report.issues === "string" ? JSON.parse(report.issues) : report.issues; } catch { return {}; } })();
              const activeIssues = Object.entries(parsedIssues).filter(([, v]) => v).map(([k]) => ISSUE_FLAGS.find((f) => f.key === k)?.label ?? k);
              return (
                <div key={report.id} className="border border-border rounded-xl bg-card overflow-hidden">
                  <button
                    onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                    className="flex min-h-11 w-full items-center gap-3 p-3 text-left"
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[report.status] }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-medium">{report.itemName}</span>
                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize">{report.itemType.replace("_", " ")}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {report.reporterName} · {new Date(report.createdAt).toLocaleDateString()}
                        {activeIssues.length > 0 && ` · ${activeIssues.slice(0, 2).join(", ")}${activeIssues.length > 2 ? ` +${activeIssues.length - 2}` : ""}`}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border p-3 space-y-3">
                      {report.itemId && <div className="text-xs text-muted-foreground">ID: <code>{report.itemId}</code></div>}

                      {activeIssues.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {activeIssues.map((label) => (
                            <span key={label} className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-800 dark:text-amber-400">{label}</span>
                          ))}
                        </div>
                      )}

                      {(() => {
                        const discrepancies: { stat: string; currentValue: string; expectedValue: string }[] = (() => { try { return typeof report.statDiscrepancies === "string" ? JSON.parse(report.statDiscrepancies) : report.statDiscrepancies; } catch { return []; } })();
                        return discrepancies.length > 0 ? (
                          <div>
                            <span className="text-[10px] text-muted-foreground">Stat Discrepancies:</span>
                            <div className="mt-1 space-y-1">
                              {discrepancies.map((d: { stat: string; currentValue: string; expectedValue: string }, i: number) => (
                                <div key={i} className="flex gap-2 text-xs">
                                  <span className="font-medium">{d.stat}:</span>
                                  <span className="text-red-700 dark:text-red-400">{d.currentValue}</span>
                                  <span className="text-muted-foreground">→</span>
                                  <span className="text-green-800 dark:text-green-400">{d.expectedValue}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {report.comment && <p className="text-sm text-muted-foreground">{report.comment}</p>}

                      {isAdmin && (
                        <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                          {report.status === "open" && (<>
                            <button onClick={() => handleResolve(report.id)} className="inline-flex min-h-11 items-center gap-1 rounded bg-green-500/10 px-2.5 py-1.5 text-[10px] text-green-800 hover:bg-green-500/20 dark:text-green-400">
                              <Check className="h-3 w-3" /> Resolve
                            </button>
                            <button onClick={() => handleWontfix(report.id)} className="inline-flex min-h-11 items-center gap-1 rounded bg-gray-500/10 px-2.5 py-1.5 text-[10px] text-gray-700 hover:bg-gray-500/20 dark:text-gray-400">
                              <X className="h-3 w-3" /> Won&apos;t Fix
                            </button>
                          </>)}
                          <button onClick={() => handleCreateOverrideFromReport(report)} className="inline-flex min-h-11 items-center gap-1 rounded bg-purple-500/10 px-2.5 py-1.5 text-[10px] text-purple-800 hover:bg-purple-500/20 dark:text-purple-400">
                            <Edit3 className="h-3 w-3" /> Create Fix
                          </button>
                          <button onClick={() => handleDelete(report.id)} className="ml-auto inline-flex min-h-11 items-center gap-1 rounded bg-red-500/10 px-2.5 py-1.5 text-[10px] text-red-700 hover:bg-red-500/20 dark:text-red-400">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </>)}

          {/* ========== DATA FIXES TAB (staff) ========== */}
          {activeTab === "overrides" && isAdmin && (
            <DataFixesPanel
              key={overridePrefill?.itemId ?? "default"}
              compactHeader
              initialPrefill={overridePrefill}
              returnTo={returnTo}
            />
          )}

        {/* Contact footer */}
        <div className="mt-8 pb-4 text-center">
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
            <span>Need to reach us directly?</span>
            <a href="mailto:support@void-forge.org" className="inline-flex min-h-11 items-center break-all text-primary underline-offset-2 hover:underline">support@void-forge.org</a>
            <span aria-hidden>·</span>
            <a href="https://discord.gg/bqQXaYdTjS" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[#5865F2] underline-offset-2 hover:underline">Discord</a>
          </p>
        </div>
      </PageMain>
    </PageShell>
  );
}
