"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Rss, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { PublicBuildRow } from "@/components/public-build-row";
import {
  HOME_SIDEBAR_BODY_CLASS,
  HOME_SIDEBAR_PANEL_CLASS,
  HOME_SIDEBAR_TAB_ROW_CLASS,
} from "@/lib/site/home-sidebar-layout";
import { ContentPanel } from "@/components/page-shell";

type SortMode = "recent" | "popular";

interface CommunityBuildsSidebarProps {
  /** Sticky sidebar on xl+; inline block on smaller screens. */
  variant?: "sidebar" | "inline";
  limit?: number;
  className?: string;
}

export function CommunityBuildsSidebar({
  variant = "sidebar",
  limit = 8,
  className,
}: CommunityBuildsSidebarProps) {
  const [sort, setSort] = useState<SortMode>("recent");
  const [builds, setBuilds] = useState<(PublicBuildSummary & { voted?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuilds = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sort,
        limit: String(limit),
      });
      const res = await fetch(`/api/builds/public?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setBuilds(data.builds ?? []);
    } finally {
      setLoading(false);
    }
  }, [sort, limit]);

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  const isSidebar = variant === "sidebar";

  return (
    <ContentPanel
      padding={false}
      className={cn(isSidebar && HOME_SIDEBAR_PANEL_CLASS, className)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            Community Builds
          </h2>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Shared by other Tenno
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/feeds/builds.xml"
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground hover:text-primary hover:underline"
            title="RSS feed for top community builds"
          >
            <Rss className="h-3 w-3" />
            RSS
          </a>
          <Link
            href="/discover"
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:underline"
          >
            View all
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className={HOME_SIDEBAR_TAB_ROW_CLASS}>
        {([
          { id: "recent" as const, label: "Recent", icon: Sparkles },
          { id: "popular" as const, label: "Top rated", icon: TrendingUp },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSort(id)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-colors",
              sort === id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <Icon className="h-3 w-3 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      <div className={cn(isSidebar ? HOME_SIDEBAR_BODY_CLASS : "space-y-2 p-3")}>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : builds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 px-3 py-8 text-center">
            <p className="text-xs text-muted-foreground">
              No public builds yet. Save a build and check &quot;List in Community Builds&quot; to share it.
            </p>
            <Link
              href="/discover"
              className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
            >
              Browse Discover
            </Link>
          </div>
        ) : (
          builds.map((build) => (
            <PublicBuildRow key={build.id} build={build} compact showThumbnails />
          ))
        )}
      </div>
    </ContentPanel>
  );
}
