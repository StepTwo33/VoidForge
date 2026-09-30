"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ThumbsUp,
  Loader2,
  ExternalLink,
  Download,
  Crosshair,
  Shield,
  Dog,
  Hammer,
  Plane,
  Rocket,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { resolveBuildItemDisplay } from "@/lib/builds/build-item-display";
import { AvatarImage, GameAssetImage } from "@/components/game-asset-image";
import { SupporterHeart } from "@/components/supporter-badge";
import { tagLabel } from "@/lib/builds/build-tags";

interface BuildVoteButtonProps {
  buildId: string;
  initialCount: number;
  initialVoted?: boolean;
  canVote?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function BuildVoteButton({
  buildId,
  initialCount,
  initialVoted = false,
  canVote = true,
  size = "sm",
  className,
}: BuildVoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCount(initialCount);
    setVoted(initialVoted);
  }, [initialCount, initialVoted]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canVote || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/builds/${buildId}/vote`, { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/signin";
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.upvoteCount);
      setVoted(data.voted);
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const pad = size === "sm" ? "px-2 py-1.5 text-xs" : "px-3 py-1.5 text-sm";
  const hit = size === "sm" ? "min-h-10 min-w-10" : "min-h-11 min-w-11";

  return (
    <button
      type="button"
      onClick={handleVote}
      disabled={loading || !canVote}
      title={canVote ? (voted ? "Remove upvote" : "Upvote") : "Sign in to upvote"}
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-md border transition-colors font-medium",
        hit,
        pad,
        voted
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30",
        !canVote && "opacity-70 cursor-default",
        className
      )}
    >
      {loading ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <ThumbsUp className={cn(iconSize, voted && "fill-current")} />
      )}
      <span>{count}</span>
    </button>
  );
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

const BUILD_TYPE_ICONS: Record<string, LucideIcon> = {
  weapon: Crosshair,
  warframe: Shield,
  companion: Dog,
  modular: Hammer,
  archwing: Plane,
  railjack: Rocket,
  loadout: FolderOpen,
};

function BuildItemThumbnail({
  type,
  itemId,
  compact,
}: {
  type: string;
  itemId: string;
  compact?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const { itemName, itemImage, typeLabel } = resolveBuildItemDisplay(type, itemId);
  const Icon = BUILD_TYPE_ICONS[type] ?? Hammer;
  const size = compact ? "h-9 w-9" : "h-12 w-12";
  const showImage = itemImage && !imageFailed;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/20",
        size,
      )}
      title={itemName ?? typeLabel}
    >
      {showImage ? (
        <GameAssetImage
          src={itemImage}
          alt={itemName ?? typeLabel}
          width={compact ? 36 : 48}
          height={compact ? 36 : 48}
          className="h-full w-full object-contain p-0.5"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-primary/5">
          <Icon className={cn("text-primary/70", compact ? "h-4 w-4" : "h-5 w-5")} />
        </div>
      )}
    </div>
  );
}

interface PublicBuildRowProps {
  build: PublicBuildSummary & { voted?: boolean };
  showVote?: boolean;
  onLoad?: () => void;
  compact?: boolean;
  showThumbnails?: boolean;
}

export function PublicBuildRow({
  build,
  showVote = true,
  onLoad,
  compact = false,
  showThumbnails = true,
}: PublicBuildRowProps) {
  const itemDisplay = resolveBuildItemDisplay(build.type, build.itemId);
  // Shared-at time: renames must not look like brand-new posts.
  const sharedAt = build.createdAt || build.updatedAt;

  return (
    <div
      className={cn(
        "group flex items-stretch overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-200",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
        compact && "text-sm",
      )}
    >
      <Link
        href={`/build/${build.id}`}
        className={cn(
          "flex flex-1 items-center min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset",
          compact ? "gap-2.5 px-3 py-2.5" : "min-h-11 gap-3 p-3 sm:p-4",
        )}
      >
        {showThumbnails && (
          <BuildItemThumbnail type={build.type} itemId={build.itemId} compact={compact} />
        )}
        <div className="flex-1 min-w-0">
          {itemDisplay.itemName && (
            <div className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground leading-tight">
              {itemDisplay.itemName}
            </div>
          )}
          <div
            className={cn(
              "font-medium truncate break-words group-hover:text-primary transition-colors",
              compact ? "text-sm leading-snug" : "",
            )}
          >
            {build.name}
          </div>
          {!compact && build.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{build.description}</p>
          )}
          {!compact && (build.tags?.length ?? 0) > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {build.tags!.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 bg-muted/30 px-1.5 py-0 text-[9px] text-muted-foreground"
                >
                  {tagLabel(t)}
                </span>
              ))}
            </div>
          )}
          <div
            className={cn(
              "text-[10px] text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5",
              compact ? "mt-1" : "mt-1",
            )}
          >
            {build.author.image && (
              <AvatarImage
                src={build.author.image}
                alt=""
                size={14}
                className="h-3.5 w-3.5 rounded-full object-cover ring-1 ring-border/50"
              />
            )}
            {/* Username is display-only on list cards so clicks open the build, not /u/… */}
            <span className="inline-flex items-center gap-1">
              @{build.author.username}
              {build.author.supporter && <SupporterHeart />}
            </span>
            <span className="text-border">·</span>
            <span>{itemDisplay.typeLabel}</span>
            <span className="text-border">·</span>
            <span>{formatRelativeTime(sharedAt)}</span>
          </div>
        </div>
        {!compact && (
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
        )}
      </Link>

      <div
        className={cn(
          "flex items-center border-l border-border shrink-0",
          compact ? "gap-1 px-2" : "gap-1 px-2 sm:px-3",
        )}
      >
        {showVote && (
          <BuildVoteButton
            buildId={build.id}
            initialCount={build.upvoteCount}
            initialVoted={build.voted}
            size={compact ? "sm" : "md"}
          />
        )}
        {onLoad && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onLoad();
            }}
            title="Load in builder"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
              compact ? "h-10 w-10" : "min-h-11 min-w-11 p-2",
            )}
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
