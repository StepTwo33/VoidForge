"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { fetchCloudBuild } from "@/lib/builds/use-cloud-build-from-url";
import { buildItemId, type CompareKind } from "@/lib/builds/compare-build";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { mergeYoursBuilds, ownershipBadge } from "@/lib/builds/yours-builds";
import { cn } from "@/lib/utils";

export type BuildSourceType = CompareKind | "loadout";

type Tab = "yours" | "community";

export function BuildSourcePicker({
  type,
  itemId,
  onSelect,
}: {
  type: BuildSourceType;
  /** When set, only builds for this weapon or warframe are listed. */
  itemId?: string;
  onSelect: (build: SavedBuild, origin: "yours" | "community") => void;
}) {
  const [tab, setTab] = useState<Tab>("yours");
  const [query, setQuery] = useState("");
  const [yours, setYours] = useState<SavedBuild[]>([]);
  const [community, setCommunity] = useState<PublicBuildSummary[]>([]);
  const [loadingYours, setLoadingYours] = useState(true);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingYours(true);
      const merged = await mergeYoursBuilds(type);
      if (cancelled) return;
      const q = query.trim().toLowerCase();
      setYours(
        merged.filter((b) => {
          if (type !== "loadout" && itemId && buildItemId(type, b.data) !== itemId) return false;
          if (!q) return true;
          return b.name.toLowerCase().includes(q);
        }),
      );
      setLoadingYours(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [type, itemId, query]);

  useEffect(() => {
    if (tab !== "community") return;
    const q = query.trim();
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoadingCommunity(true);
      try {
        const params = new URLSearchParams({ type, sort: "recent", limit: "20" });
        if (itemId) params.set("itemId", itemId);
        if (q) params.set("q", q);
        const res = await fetch(`/api/builds/public?${params}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        setCommunity(data.builds ?? []);
      } catch {
        if (!controller.signal.aborted) setCommunity([]);
      } finally {
        if (!controller.signal.aborted) setLoadingCommunity(false);
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [tab, type, itemId, query]);

  const pickCommunity = async (summary: PublicBuildSummary) => {
    setLoadingId(summary.id);
    const build = await fetchCloudBuild(summary.id);
    setLoadingId(null);
    if (build) onSelect(build, "community");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/20 p-1">
        {(
          [
            { id: "yours" as const, label: "Yours" },
            { id: "community" as const, label: "Community" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-9 flex-1 rounded-md px-3 text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "community" ? "Search community…" : "Filter yours…"}
          className="h-9 pl-8 text-xs"
        />
      </div>
      <div className="max-h-48 space-y-0.5 overflow-y-auto">
        {tab === "yours" && loadingYours && (
          <p className="flex items-center justify-center gap-2 px-2 py-6 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
          </p>
        )}
        {tab === "yours" && !loadingYours && yours.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            {itemId ? "No builds of yours for this item." : "Nothing in Yours yet — try Community."}
          </p>
        )}
        {tab === "yours" &&
          !loadingYours &&
          yours.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect(b, "yours")}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-accent"
            >
              <span className="min-w-0 flex-1 truncate font-medium">{b.name}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">{ownershipBadge(b.id)}</span>
            </button>
          ))}
        {tab === "community" && loadingCommunity && (
          <p className="flex items-center justify-center gap-2 px-2 py-6 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
          </p>
        )}
        {tab === "community" && !loadingCommunity && community.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">No community builds found.</p>
        )}
        {tab === "community" &&
          !loadingCommunity &&
          community.map((b) => (
            <button
              key={b.id}
              type="button"
              disabled={loadingId === b.id}
              onClick={() => void pickCommunity(b)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-accent disabled:opacity-60"
            >
              <span className="min-w-0 flex-1 truncate font-medium">{b.name}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">@{b.author.username}</span>
              {loadingId === b.id && <Loader2 className="h-3 w-3 animate-spin" />}
            </button>
          ))}
      </div>
    </div>
  );
}
