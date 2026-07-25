"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell, PageMain, PageHero, ContentPanel } from "@/components/page-shell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  formatSiteUpdateTime,
  SITE_UPDATE_BODY_MAX,
  SITE_UPDATE_TITLE_MAX,
  type SiteUpdateSummary,
} from "@/lib/site/site-updates";
import {
  Megaphone,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";

interface Draft {
  title: string;
  body: string;
  published: boolean;
  featured: boolean;
}

const emptyDraft = (): Draft => ({ title: "", body: "", published: true, featured: false });

export default function AdminUpdatesPage() {
  const { confirm } = useConfirmDialog();
  const [updates, setUpdates] = useState<SiteUpdateSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/admin/site-updates")
      .then((r) => {
        if (!r.ok) throw new Error("Forbidden");
        return r.json();
      })
      .then((data) => {
        setUpdates(data.updates ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.role === "admin") {
          setAuthorized(true);
          refresh();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [refresh]);

  const startNew = () => {
    setEditingId("new");
    setDraft(emptyDraft());
    setError(null);
  };

  const startEdit = (update: SiteUpdateSummary) => {
    setEditingId(update.id);
    setDraft({
      title: update.title,
      body: update.body,
      published: update.published,
      featured: update.featured,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setError(null);
  };

  const saveDraft = async () => {
    if (!draft.title.trim() || !draft.body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const isNew = editingId === "new";
      const res = await fetch(
        isNew ? "/api/admin/site-updates" : `/api/admin/site-updates/${editingId}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      cancelEdit();
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const deleteUpdate = async (id: string) => {
    const ok = await confirm({
      title: "Delete update?",
      description: "This site update will be permanently removed.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await fetch(`/api/admin/site-updates/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    refresh();
  };

  const togglePublished = async (update: SiteUpdateSummary) => {
    await fetch(`/api/admin/site-updates/${update.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: update.title,
        body: update.body,
        published: !update.published,
        featured: update.featured,
      }),
    });
    refresh();
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  if (!authorized) {
    return (
      <PageShell>
        <PageMain maxWidth="md">
          <ContentPanel className="py-12 text-center text-sm text-muted-foreground">
            Admin access required.
          </ContentPanel>
        </PageMain>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={Megaphone}
          accent="amber"
          title="Site Updates"
          description="Write manual posts for the home page “What’s New” column. These are separate from GitHub activity."
          actions={
            editingId === null ? (
              <button
                type="button"
                onClick={startNew}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                New post
              </button>
            ) : null
          }
        />

        {editingId !== null && (
          <ContentPanel className="mb-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">
                {editingId === "new" ? "New update" : "Edit update"}
              </h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Title</label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value.slice(0, SITE_UPDATE_TITLE_MAX) }))}
                placeholder="e.g. Codex arcane editor improvements"
                maxLength={SITE_UPDATE_TITLE_MAX}
              />
              <p className="mt-1 text-[10px] text-muted-foreground text-right">
                {draft.title.length}/{SITE_UPDATE_TITLE_MAX}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Body</label>
              <textarea
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value.slice(0, SITE_UPDATE_BODY_MAX) }))}
                rows={6}
                placeholder="What changed? Keep it short — this shows in the home page sidebar."
                maxLength={SITE_UPDATE_BODY_MAX}
                className="w-full rounded-md border border-border/60 bg-background/50 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <p className="mt-1 text-[10px] text-muted-foreground text-right">
                {draft.body.length}/{SITE_UPDATE_BODY_MAX}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
                  className="rounded border-border"
                />
                Published (visible on home page)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
                  className="rounded border-border"
                />
                Featured (pin and highlight on What&apos;s New)
              </label>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveDraft}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </button>
            </div>
          </ContentPanel>
        )}

        <div className="space-y-3">
          {updates.length === 0 ? (
            <ContentPanel className="py-10 text-center text-sm text-muted-foreground">
              No updates yet. Post your first one to fill the home page sidebar.
            </ContentPanel>
          ) : (
            updates.map((update) => (
              <ContentPanel key={update.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold truncate">{update.title}</h3>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          update.published
                            ? "bg-green-500/10 text-green-400"
                            : "bg-zinc-500/10 text-zinc-400",
                        )}
                      >
                        {update.published ? (
                          <>
                            <Eye className="h-3 w-3" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Draft
                          </>
                        )}
                      </span>
                      {update.featured && (
                        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatSiteUpdateTime(update.createdAt)} · @{update.author.username}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePublished(update)}
                      title={update.published ? "Unpublish" : "Publish"}
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      {update.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(update)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUpdate(update.id)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{update.body}</p>
              </ContentPanel>
            ))
          )}
        </div>
      </PageMain>
    </PageShell>
  );
}
