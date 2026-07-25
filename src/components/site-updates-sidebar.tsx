"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Megaphone, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSiteUpdateTime, type SiteUpdateSummary } from "@/lib/site/site-updates";
import {
  HOME_SIDEBAR_BODY_CLASS,
  HOME_SIDEBAR_PANEL_CLASS,
  HOME_SIDEBAR_TAB_ROW_CLASS,
} from "@/lib/site/home-sidebar-layout";
import { ContentPanel } from "@/components/page-shell";
import { CopyRssFeedButton } from "@/components/copy-rss-feed-button";

interface SiteUpdatesSidebarProps {
  variant?: "sidebar" | "inline";
  limit?: number;
  className?: string;
}

function UpdateCard({ update, compact }: { update: SiteUpdateSummary; compact?: boolean }) {
  const excerpt = update.body.length > 140;

  return (
    <Link
      href={`/updates/${update.id}`}
      className={cn(
        "group block rounded-lg border p-3 transition-colors",
        update.featured
          ? "border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60 hover:bg-amber-500/15"
          : "border-border/50 bg-background/40 hover:border-primary/40 hover:bg-background/60",
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <time className="text-[10px] text-muted-foreground">{formatSiteUpdateTime(update.createdAt)}</time>
        {update.featured && (
          <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-400">
            Featured
          </span>
        )}
      </div>
      <h3
        className={cn(
          "mt-1 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {update.title}
      </h3>
      <p
        className={cn(
          "mt-1.5 text-muted-foreground whitespace-pre-wrap leading-relaxed",
          compact ? "text-[11px]" : "text-xs",
          excerpt && "line-clamp-3",
        )}
      >
        {update.body}
      </p>
      {excerpt && (
        <span className="mt-1.5 inline-block text-[10px] font-medium text-primary group-hover:underline">
          Read more
        </span>
      )}
    </Link>
  );
}

export function SiteUpdatesSidebar({
  variant = "sidebar",
  limit = 8,
  className,
}: SiteUpdatesSidebarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [updates, setUpdates] = useState<SiteUpdateSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.user?.role === "admin"))
      .catch(() => {});
  }, []);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/site-updates?limit=${limit}`);
      if (!res.ok) return;
      const data = await res.json();
      setUpdates(data.updates ?? []);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const isSidebar = variant === "sidebar";

  return (
    <ContentPanel
      padding={false}
      className={cn(isSidebar && HOME_SIDEBAR_PANEL_CLASS, className)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold">
            <Megaphone className="h-4 w-4 shrink-0 text-amber-400" />
            What&apos;s New
          </h2>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Updates from the Frame Hub team
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin/updates"
              className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground hover:text-primary hover:underline"
            >
              Manage
            </Link>
          )}
          <CopyRssFeedButton
            feedPath="/feeds/updates.xml"
            title="Copy What's New RSS feed link"
            className="hover:text-amber-400"
          />
          <Link
            href="/updates"
            className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:underline"
          >
            View all
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {isSidebar && (
        <div className={HOME_SIDEBAR_TAB_ROW_CLASS}>
          <div className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary/10 px-2 py-1.5 text-[10px] font-medium text-primary">
            <Megaphone className="h-3 w-3 shrink-0" />
            Latest
          </div>
        </div>
      )}

      <div className={cn(isSidebar ? HOME_SIDEBAR_BODY_CLASS : "space-y-2 p-3")}>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : updates.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 px-3 py-8 text-center">
            <p className="text-xs text-muted-foreground">No site updates posted yet.</p>
          </div>
        ) : (
          updates.map((update) => (
            <UpdateCard key={update.id} update={update} compact={isSidebar} />
          ))
        )}
      </div>

      {isAdmin && !isSidebar && (
        <div className="border-t border-border/60 px-3 py-2.5">
          <Link
            href="/admin/updates"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border/60 bg-background/50 px-2 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <PenLine className="h-3 w-3" />
            Manage updates
            <ChevronRight className="ml-auto h-3 w-3" />
          </Link>
        </div>
      )}
    </ContentPanel>
  );
}
