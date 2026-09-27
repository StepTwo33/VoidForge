"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { buildOpenUrl } from "@/lib/builds/build-url";
import type { PublicBuildSummary } from "@/lib/builds/build-types";
import { resolveBuildItemDisplay } from "@/lib/builds/build-item-display";
import { AvatarImage, GameAssetImage } from "@/components/game-asset-image";
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

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const pad = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <button
      type="button"
      onClick={handleVote}
      disabled={loading || !canVote}
      title={canVote ? (voted ? "Remove upvote" : "Upvote") : "Sign in to upvote"}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border transition-colors font-medium",
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
  const size = compact ? "h-10 w-10" : "h-12 w-12";
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
          width={compact ? 40 : 48}
          height={compact ? 40 : 48}
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
  const router = useRouter();
  const itemDisplay = resolveBuildItemDisplay(build.type, build.itemId);

  return (
    <div
      className={cn(
        "group flex items-stretch overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-200",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
        compact && "text-sm",
      )}
    >
      <Link
        href={buildOpenUrl(build.type, build.id)}
        className="flex min-h-11 flex-1 items-center gap-3 p-3 sm:p-4 min-w-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset"
      >
        {showThumbnails && (
          <BuildItemThumbnail type={build.type} itemId={build.itemId} compact={compact} />
        )}
        <div className="flex-1 min-w-0">
          {itemDisplay.itemName && (
            <div className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {itemDisplay.itemName}
            </div>
          )}
          <div className="font-medium truncate break-words group-hover:text-primary transition-colors">{build.name}</div>
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
          <div className="text-[10px] text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {build.author.image && (
              <AvatarImage
                src={build.author.image}
                alt=""
                size={14}
                className="h-3.5 w-3.5 rounded-full object-cover ring-1 ring-border/50"
              />
            )}
            {build.author.profileSlug ? (
              // Not a <Link>: nesting an anchor inside the row's anchor is invalid HTML
              <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/u/${build.author.profileSlug}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/u/${build.author.profileSlug}`);
                  }
                }}
                className="inline-flex min-h-11 items-center hover:text-primary transition-colors cursor-pointer"
              >
                @{build.author.username}
              </span>
            ) : (
              <span>@{build.author.username}</span>
            )}
            <span>•</span>
            <span>{itemDisplay.typeLabel}</span>
            <span>•</span>
            <span>{formatRelativeTime(build.updatedAt)}</span>
          </div>
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
      </Link>

      <div className="flex items-center gap-1 px-2 sm:px-3 border-l border-border shrink-0">
        {showVote && (
          <BuildVoteButton
            buildId={build.id}
            initialCount={build.upvoteCount}
            initialVoted={build.voted}
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
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
