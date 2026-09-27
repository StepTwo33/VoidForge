"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { PublicBuildRow } from "@/components/public-build-row";

interface CommunityBuildsPanelProps {
  type: "weapon" | "warframe";
  itemId: string;
  itemName: string;
  onLoadBuild?: (buildId: string) => void;
  defaultExpanded?: boolean;
}

export function CommunityBuildsPanel({
  type,
  itemId,
  itemName,
  onLoadBuild,
  defaultExpanded = false,
}: CommunityBuildsPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [sort, setSort] = useState<"recent" | "popular">("popular");
  const [builds, setBuilds] = useState<(PublicBuildSummary & { voted?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const requestIdRef = useRef(0);

  const fetchBuilds = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type,
        itemId,
        sort,
        limit: "10",
      });
      const res = await fetch(`/api/builds/public?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      if (requestId !== requestIdRef.current) return; // stale response
      setBuilds(data.builds ?? []);
      setLoaded(true);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [type, itemId, sort]);

  // Reset when the selected item changes so we refetch for the new item
  useEffect(() => {
    requestIdRef.current++;
    setBuilds([]);
    setLoaded(false);
  }, [type, itemId]);

  useEffect(() => {
    if (expanded && !loaded) {
      fetchBuilds();
    }
  }, [expanded, loaded, fetchBuilds]);

  useEffect(() => {
    if (expanded && loaded) {
      fetchBuilds();
    }
  }, [sort]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl border border-border/60 bg-card/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Users className="h-4 w-4 text-primary shrink-0" />
          <span className="truncate break-words text-sm font-medium">
            Community builds for {itemName}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/60">
          <div className="flex gap-2 py-3">
            {(["popular", "recent"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border px-3 py-1 text-xs transition-colors",
                  sort === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "popular" ? "Top Rated" : "Recent"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : builds.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 px-3 py-6 text-center">
              <p className="text-sm font-medium text-foreground">No community builds yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Be the first — save with &quot;List in Community Builds&quot; checked.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {builds.map((build) => (
                <PublicBuildRow
                  key={build.id}
                  build={build}
                  compact
                  onLoad={onLoadBuild ? () => onLoadBuild(build.id) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
