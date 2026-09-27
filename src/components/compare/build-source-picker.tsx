"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getSavedBuilds, type SavedBuild } from "@/lib/builds/build-storage";
import { fetchCloudBuild } from "@/lib/builds/use-cloud-build-from-url";
import { buildItemId, type CompareKind } from "@/lib/builds/compare-build";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { cn } from "@/lib/utils";

export function BuildSourcePicker({
  type,
  itemId,
  onSelect,
}: {
  type: CompareKind;
  /** When set, only builds for this weapon or warframe are listed. */
  itemId?: string;
  onSelect: (build: SavedBuild) => void;
}) {
  const [tab, setTab] = useState<"saved" | "posted">("saved");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<SavedBuild[]>([]);
  const [posted, setPosted] = useState<PublicBuildSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    setSaved(
      getSavedBuilds(type).filter((b) => {
        if (itemId && buildItemId(type, b.data) !== itemId) return false;
        if (!q) return true;
        return b.name.toLowerCase().includes(q);
      }),
    );
  }, [type, itemId, query]);

  useEffect(() => {
    if (tab !== "posted") return;
    const q = query.trim();
    if (!itemId && q.length < 2) {
      setPosted([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ type, sort: "popular", limit: "12" });
        if (itemId) params.set("itemId", itemId);
        if (q) params.set("q", q);
        const res = await fetch(`/api/builds/public?${params}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setPosted(data.builds ?? []);
      } catch {
        if (!controller.signal.aborted) setPosted([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [tab, type, itemId, query]);

  const pickPosted = async (summary: PublicBuildSummary) => {
    setLoadingId(summary.id);
    const build = await fetchCloudBuild(summary.id);
    setLoadingId(null);
    if (build) onSelect(build);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("saved")}
          className={cn(
            "min-h-9 rounded-md px-3 text-xs font-medium",
            tab === "saved" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent",
          )}
        >
          My builds
        </button>
        <button
          type="button"
          onClick={() => setTab("posted")}
          className={cn(
            "min-h-9 rounded-md px-3 text-xs font-medium",
            tab === "posted" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent",
          )}
        >
          Posted
        </button>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "posted" && !itemId ? "Search posted builds…" : "Filter by name…"}
          className="h-9 pl-8 text-xs"
        />
      </div>
      <div className="max-h-48 space-y-0.5 overflow-y-auto">
        {tab === "saved" && saved.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            {itemId ? "No saved builds for this item." : "No saved builds yet."}
          </p>
        )}
        {tab === "saved" && saved.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b)}
            className="flex w-full items-center rounded-md px-2 py-2 text-left text-xs hover:bg-accent"
          >
            <span className="min-w-0 flex-1 truncate font-medium">{b.name}</span>
          </button>
        ))}
        {tab === "posted" && loading && (
          <p className="flex items-center justify-center gap-2 px-2 py-6 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
          </p>
        )}
        {tab === "posted" && !loading && !itemId && query.trim().length < 2 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">Type at least 2 characters to search posted builds.</p>
        )}
        {tab === "posted" && !loading && posted.length === 0 && (itemId || query.trim().length >= 2) && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">No posted builds found.</p>
        )}
        {tab === "posted" && !loading && posted.map((b) => (
          <button
            key={b.id}
            type="button"
            disabled={loadingId === b.id}
            onClick={() => pickPosted(b)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-accent disabled:opacity-60"
          >
            <span className="min-w-0 flex-1 truncate font-medium">{b.name}</span>
            <span className="shrink-0 text-[10px] text-muted-foreground">{b.author.username}</span>
            {loadingId === b.id && <Loader2 className="h-3 w-3 animate-spin" />}
          </button>
        ))}
      </div>
    </div>
  );
}
