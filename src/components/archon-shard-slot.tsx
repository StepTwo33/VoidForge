"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GameAssetImage } from "@/components/game-asset-image";
import { getArchonShardImage, getShardColorName, SHARD_COLORS } from "@/lib/display/shard-display";
import type { EquippedArchonShard } from "@/lib/types";
import { Plus } from "lucide-react";

const SHARD_BORDER: Record<string, string> = {
  crimson: "border-red-500/45 hover:border-red-400/70",
  azure: "border-sky-500/45 hover:border-sky-400/70",
  amber: "border-amber-500/45 hover:border-amber-400/70",
  violet: "border-violet-500/45 hover:border-violet-400/70",
  topaz: "border-orange-500/45 hover:border-orange-400/70",
  emerald: "border-emerald-500/45 hover:border-emerald-400/70",
};

function ShardCrystalFallback({ color, slotIndex }: { color: string; slotIndex: number }) {
  const hex = SHARD_COLORS[color] ?? "#888";
  const gradId = `shard-fallback-${color}-${slotIndex}`;
  return (
    <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={hex} stopOpacity="0.95" />
          <stop offset="100%" stopColor={hex} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M16 3 L27 11 L22 29 L10 29 L5 11 Z"
        fill={`url(#${gradId})`}
        stroke={hex}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShardArt({ color, tier, slotIndex }: { color: string; tier: number; slotIndex: number }) {
  const [failed, setFailed] = useState(false);
  const src = getArchonShardImage(color, tier);
  const colorName = getShardColorName(color);

  if (!src || failed) {
    return <ShardCrystalFallback color={color} slotIndex={slotIndex} />;
  }

  return (
    <GameAssetImage
      src={src}
      alt={colorName}
      width={36}
      height={36}
      className="h-9 w-9 object-contain drop-shadow-md"
      hideOnError
      onError={() => setFailed(true)}
    />
  );
}

type ArchonShardSlotProps = {
  shard: EquippedArchonShard | null;
  slotIndex: number;
  onEquip: () => void;
  onRemove: () => void;
};

export function ArchonShardSlot({ shard, slotIndex, onEquip, onRemove }: ArchonShardSlotProps) {
  if (!shard) {
    return (
      <button
        type="button"
        onClick={onEquip}
        className="flex h-[4.75rem] min-h-11 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border/80 bg-card/30 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        title={`Empty shard slot ${slotIndex + 1}`}
      >
        <Plus className="h-4 w-4" />
        <span className="text-[9px] font-medium text-muted-foreground/80">Add {slotIndex + 1}</span>
      </button>
    );
  }

  const colorName = getShardColorName(shard.shardColor);
  const border = SHARD_BORDER[shard.shardColor] ?? "border-border/60";
  const isTau = shard.shardTier === 2;

  return (
    <button
      type="button"
      onClick={onRemove}
      className={cn(
        "flex h-[4.75rem] w-16 flex-col items-center justify-between rounded-lg border bg-muted/60 px-1 py-1.5 transition-all hover:bg-muted dark:bg-black/40 dark:hover:bg-black/55",
        border,
        isTau && "shadow-[0_0_12px_-2px_rgba(251,191,36,0.35)]",
      )}
      title={`${colorName}${isTau ? " (Tauforged)" : ""} — click to remove`}
    >
      <ShardArt color={shard.shardColor} tier={shard.shardTier} slotIndex={slotIndex} />
      <div className="flex w-full flex-col items-center gap-0.5">
        <span className="max-w-full truncate text-[10px] font-semibold capitalize leading-none text-foreground">
          {colorName}
        </span>
        {isTau && (
          <span className="rounded bg-amber-500/15 px-1 py-px text-[8px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-400">
            Tau
          </span>
        )}
      </div>
    </button>
  );
}

/** Compact shard icon for lists / pickers. */
export function ArchonShardIcon({
  color,
  tier,
  className,
}: {
  color: string;
  tier: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = getArchonShardImage(color, tier);

  if (!src || failed) {
    return (
      <span className={cn("inline-flex h-8 w-8 items-center justify-center", className)}>
        <ShardCrystalFallback color={color} slotIndex={0} />
      </span>
    );
  }

  return (
    <GameAssetImage
      src={src}
      alt={getShardColorName(color)}
      width={32}
      height={32}
      className={cn("h-8 w-8 object-contain", className)}
      hideOnError
      onError={() => setFailed(true)}
    />
  );
}
