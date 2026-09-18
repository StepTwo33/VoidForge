"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@/components/game-asset-image";
import {
  Flag, Check, X, ChevronDown, ChevronUp, Trash2, Search,
  AlertTriangle, Shield, RotateCcw, Clock, CheckCircle2, Ban,
  MessageSquare, User as UserIcon, Calendar,
} from "lucide-react";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";

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
  adminReply: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: { name: string | null; email: string | null; image: string | null };
}

const ISSUE_FLAGS = [
  { key: "doesNotExist", label: "Doesn't exist" },
  { key: "wrongStats", label: "Wrong stats" },
  { key: "missingData", label: "Missing data" },
  { key: "wrongCost", label: "Wrong cost/drain" },
  { key: "wrongRank", label: "Wrong max rank" },
  { key: "wrongCategory", label: "Wrong category" },
  { key: "wrongPolarity", label: "Wrong polarity" },
  { key: "wrongRarity", label: "Wrong rarity" },
] as const;

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; icon: typeof Clock }> = {
  open: { color: "text-amber-800 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "Open", icon: Clock },
  resolved: { color: "text-green-700 dark:text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "Resolved", icon: CheckCircle2 },
  wontfix: { color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30", label: "Won't Fix", icon: Ban },
};

const TYPE_COLORS: Record<string, string> = {
  weapon: "text-blue-700 dark:text-blue-400 bg-blue-500/10",
  mod: "text-purple-700 dark:text-purple-400 bg-purple-500/10",
  warframe: "text-cyan-700 dark:text-cyan-400 bg-cyan-500/10",
  companion: "text-teal-700 dark:text-teal-400 bg-teal-500/10",
  archon_shard: "text-red-700 dark:text-red-400 bg-red-500/10",
  other: "text-zinc-600 dark:text-zinc-400 bg-zinc-500/10",
};

export default function AdminReportsPage() {
  const { confirm } = useConfirmDialog();
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("open");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [emailNotify, setEmailNotify] = useState<Record<string, boolean>>({});

  const refresh = useCallback(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReports(data);
          window.dispatchEvent(new CustomEvent("framehub-reports-updated"));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        const role = data.user?.role;
        if (role === "admin" || role === "moderator") {
          setAuthorized(true);
          refresh();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [refresh]);

  const filteredReports = useMemo(() => {
    let r = [...reports];
    if (filterStatus !== "all") r = r.filter((x) => x.status === filterStatus);
    if (filterType !== "all") r = r.filter((x) => x.itemType === filterType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((x) =>
        x.itemName.toLowerCase().includes(q) ||
        x.comment.toLowerCase().includes(q) ||
        x.reporterName.toLowerCase().includes(q) ||
        x.itemId.toLowerCase().includes(q)
      );
    }
    return r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reports, filterStatus, filterType, searchQuery]);

  const stats = useMemo(() => {
    const open = reports.filter((r) => r.status === "open").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const wontfix = reports.filter((r) => r.status === "wontfix").length;
    return { total: reports.length, open, resolved, wontfix };
  }, [reports]);

  const handleAction = useCallback(async (id: string, action: "resolved" | "wontfix" | "open" | "delete") => {
    setActionLoading(id);
    try {
      if (action === "delete") {
        await fetch(`/api/reports/${id}`, { method: "DELETE" });
      } else {
        const payload: { status: string; adminReply?: string; notifyByEmail?: boolean } = { status: action };
        if (action === "resolved" || action === "wontfix") {
          const draft = replyDrafts[id]?.trim();
          if (draft) payload.adminReply = draft;
          if (emailNotify[id]) payload.notifyByEmail = true;
        }
        await fetch(`/api/reports/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      refresh();
    } catch { /* ignore */ }
    setActionLoading(null);
  }, [refresh, replyDrafts, emailNotify]);

  if (loading) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse mx-auto" />
        </div>
      </PageShell>
    );
  }

  if (!authorized) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-sm">This page is restricted to administrators and moderators.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Flag className="h-5 w-5 text-amber-800 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Report Management</h1>
            <p className="text-xs text-muted-foreground">Review and manage incoming reports</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-foreground", bg: "bg-muted/30", border: "border-border" },
            { label: "Open", value: stats.open, color: "text-amber-800 dark:text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20" },
            { label: "Resolved", value: stats.resolved, color: "text-green-700 dark:text-green-400", bg: "bg-green-500/5", border: "border-green-500/20" },
            { label: "Won't Fix", value: stats.wontFix, color: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-500/5", border: "border-zinc-500/20" },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-xl border p-4 text-center", s.bg, s.border)}>
              <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full min-h-11 h-11 text-xs pl-8 pr-3 rounded-lg border border-border bg-background focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex gap-1">
            {[
              { key: "all", label: "All" },
              { key: "open", label: "Open" },
              { key: "resolved", label: "Resolved" },
              { key: "wontfix", label: "Won't Fix" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setFilterStatus(s.key)}
                className={cn(
                  "inline-flex items-center min-h-11 px-2.5 py-1 text-[11px] rounded-lg border transition-colors",
                  filterStatus === s.key
                    ? s.key === "all" ? "border-primary text-primary bg-primary/10"
                    : `${STATUS_CONFIG[s.key]?.border} ${STATUS_CONFIG[s.key]?.color} ${STATUS_CONFIG[s.key]?.bg}`
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
                {s.key === "open" && stats.open > 0 && (
                  <span className="ml-1 text-[9px] px-1 py-0.5 rounded-full bg-amber-500/20">{stats.open}</span>
                )}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-background border border-border rounded-lg px-2 py-1 text-xs min-h-11 h-11"
          >
            <option value="all">All Types</option>
            <option value="weapon">Weapon</option>
            <option value="mod">Mod</option>
            <option value="warframe">Warframe</option>
            <option value="companion">Companion</option>
            <option value="archon_shard">Archon Shard</option>
            <option value="other">Other</option>
          </select>

          <span className="text-[10px] text-muted-foreground ml-auto hidden sm:inline">
            {filteredReports.length} of {reports.length} reports
          </span>
        </div>

        {/* Report List */}
        <div className="space-y-2">
          {filteredReports.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{reports.length === 0 ? "No reports yet." : "No reports match your filters."}</p>
            </div>
          )}

          {filteredReports.map((report) => {
            const isExpanded = expandedId === report.id;
            const isLoading = actionLoading === report.id;
            const statusCfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.open;
            const StatusIcon = statusCfg.icon;
            const typeColor = TYPE_COLORS[report.itemType] ?? TYPE_COLORS.other;
            const parsedIssues: Record<string, boolean> = (() => {
              try { return typeof report.issues === "string" ? JSON.parse(report.issues) : report.issues; } catch { return {}; }
            })();
            const activeIssues = Object.entries(parsedIssues)
              .filter(([, v]) => v)
              .map(([k]) => ISSUE_FLAGS.find((f) => f.key === k)?.label ?? k);
            const discrepancies: { stat: string; currentValue: string; expectedValue: string }[] = (() => {
              try { return typeof report.statDiscrepancies === "string" ? JSON.parse(report.statDiscrepancies) : report.statDiscrepancies; } catch { return []; }
            })();
            const timeAgo = getTimeAgo(report.createdAt);

            return (
              <div
                key={report.id}
                className={cn(
                  "border rounded-xl bg-card overflow-hidden transition-colors",
                  report.status === "open" ? "border-amber-500/20" : "border-border"
                )}
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : report.id)}
                  className="w-full text-left p-4 flex items-center gap-3"
                >
                  {/* Status Indicator */}
                  <div className={cn("p-1.5 rounded-lg", statusCfg.bg)}>
                    <StatusIcon className={cn("h-3.5 w-3.5", statusCfg.color)} />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm truncate">{report.itemName}</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded capitalize font-medium", typeColor)}>
                        {report.itemType.replace("_", " ")}
                      </span>
                      {report.itemId && (
                        <code className="text-[10px] text-muted-foreground/60 hidden sm:inline break-all">{report.itemId}</code>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[10px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-2.5 w-2.5" />
                        <span className="truncate max-w-[80px] sm:max-w-none">{report.user?.name || report.reporterName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {timeAgo}
                      </span>
                      {activeIssues.length > 0 && (
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {activeIssues.length} issue{activeIssues.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {report.comment && (
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <MessageSquare className="h-2.5 w-2.5" />
                          Comment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Status Badge */}
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium hidden sm:inline", statusCfg.bg, statusCfg.color)}>
                    {statusCfg.label}
                  </span>

                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    {/* Reporter info */}
                    <div className="flex items-center gap-3">
                      {report.user?.image ? (
                        <AvatarImage src={report.user.image} alt="" size={32} className="w-8 h-8 rounded-full border border-border" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{report.user?.name || report.reporterName}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {report.user?.email && <span className="break-all">{report.user.email} · </span>}
                          {new Date(report.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Issue Flags */}
                    {activeIssues.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Flagged Issues</div>
                        <div className="flex gap-1.5 flex-wrap">
                          {activeIssues.map((label) => (
                            <span key={label} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stat Discrepancies */}
                    {discrepancies.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Stat Discrepancies</div>
                        <div className="rounded-lg border border-border overflow-x-auto">
                          <table className="w-full text-xs min-w-[20rem]">
                            <thead>
                              <tr className="bg-muted/30 text-muted-foreground">
                                <th className="text-left px-3 py-1.5 font-medium">Stat</th>
                                <th className="text-left px-3 py-1.5 font-medium">Current</th>
                                <th className="text-left px-3 py-1.5 font-medium">Expected</th>
                              </tr>
                            </thead>
                            <tbody>
                              {discrepancies.map((d, i) => (
                                <tr key={i} className="border-t border-border">
                                  <td className="px-3 py-1.5 font-medium">{d.stat}</td>
                                  <td className="px-3 py-1.5 text-red-700 dark:text-red-400 break-words">{d.currentValue}</td>
                                  <td className="px-3 py-1.5 text-green-700 dark:text-green-400 break-words">{d.expectedValue}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Comment */}
                    {report.comment && (
                      <div>
                        <div className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Comment</div>
                        <p className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3 border border-border">
                          {report.comment}
                        </p>
                      </div>
                    )}

                    {/* Existing moderator reply */}
                    {report.adminReply && (
                      <div>
                        <div className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">Moderator reply</div>
                        <p className="text-sm text-foreground/90 bg-sky-500/5 rounded-lg p-3 border border-sky-500/20 whitespace-pre-wrap">
                          {report.adminReply}
                        </p>
                      </div>
                    )}

                    {/* Reply when closing */}
                    {report.status === "open" && (
                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase">
                            Reply to reporter (optional)
                          </div>
                          <textarea
                            value={replyDrafts[report.id] ?? ""}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({ ...prev, [report.id]: e.target.value }))
                            }
                            maxLength={4000}
                            rows={3}
                            placeholder="Explain what you fixed or why this won't be changed. Shown on their Profile → Reports."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background resize-y focus:outline-none focus:border-primary/50"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Signed-in reporters always see status and this reply on their profile. Email is off unless you check below.
                          </p>
                        </div>
                        {report.userId && report.user?.email ? (
                          <label className="flex items-start gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!emailNotify[report.id]}
                              onChange={(e) =>
                                setEmailNotify((prev) => ({ ...prev, [report.id]: e.target.checked }))
                              }
                              className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-primary"
                            />
                            <span className="text-[11px] text-muted-foreground leading-snug">
                              Also email {report.user.email} about this decision
                            </span>
                          </label>
                        ) : (
                          <p className="text-[10px] text-muted-foreground/80">
                            No account email on this report — on-site profile update only (if they were signed in).
                          </p>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0" /> Created: {new Date(report.createdAt).toLocaleString()}</span>
                      {report.updatedAt !== report.createdAt && (
                        <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3 shrink-0" /> Updated: {new Date(report.updatedAt).toLocaleString()}</span>
                      )}
                      <code className="opacity-50 truncate break-all">ID: {report.id}</code>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-border flex-wrap">
                      {report.status === "open" && (
                        <>
                          <button
                            onClick={() => handleAction(report.id, "resolved")}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          >
                            <Check className="h-3 w-3" /> Resolve
                          </button>
                          <button
                            onClick={() => handleAction(report.id, "wontfix")}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 text-xs rounded-lg bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors disabled:opacity-50"
                          >
                            <X className="h-3 w-3" /> Won&apos;t Fix
                          </button>
                        </>
                      )}
                      {report.status !== "open" && (
                        <button
                          onClick={() => handleAction(report.id, "open")}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="h-3 w-3" /> Reopen
                        </button>
                      )}
                      <div className="flex-1" />
                      <button
                        onClick={async () => {
                          const ok = await confirm({
                            title: "Delete report?",
                            description: "This report will be permanently removed.",
                            confirmLabel: "Delete",
                            destructive: true,
                          });
                          if (ok) handleAction(report.id, "delete");
                        }}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
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
    </PageShell>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
