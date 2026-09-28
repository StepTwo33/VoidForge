"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameAssetImage } from "@/components/game-asset-image";
import { getModImage, getArcaneImage } from "@/lib/display/images";
import { getArchonShardImage, getShardShortLabel } from "@/lib/display/shard-display";
import {
  diffEquipmentGroups,
  equipmentHasAny,
  pairModSlots,
  resolveArcaneDisplay,
  resolveModDisplay,
  type CompareEquipment,
  type CompareEquipmentGroup,
  type GearDiffRow,
  type GearDiffStatus,
} from "@/lib/builds/compare-equipment";

function statusLabel(status: GearDiffStatus): string {
  if (status === "onlyA") return "only A";
  if (status === "onlyB") return "only B";
  if (status === "changed") return "changed";
  return "same";
}

function statusClass(status: GearDiffStatus): string {
  if (status === "onlyA") return "cmp-win";
  if (status === "onlyB") return "cmp-lose";
  if (status === "changed") return "text-amber-700 dark:text-amber-400";
  return "text-muted-foreground";
}

function DiffRow({ row }: { row: GearDiffRow }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-b border-border/20 py-1 last:border-b-0">
      <span
        className={cn(
          "min-w-0 truncate text-right text-[11px]",
          row.aLabel ? (row.status === "onlyA" || row.status === "changed" ? "cmp-win" : "") : "text-muted-foreground/40",
        )}
        title={row.aLabel ?? undefined}
      >
        {row.aLabel ?? "–"}
      </span>
      <span
        className={cn(
          "w-[4.75rem] max-w-[5.75rem] shrink-0 text-center text-[9px] font-semibold uppercase tracking-wider sm:w-28 sm:max-w-28",
          statusClass(row.status),
        )}
      >
        {statusLabel(row.status)}
      </span>
      <span
        className={cn(
          "min-w-0 truncate text-[11px]",
          row.bLabel ? (row.status === "onlyB" || row.status === "changed" ? "cmp-lose" : "") : "text-muted-foreground/40",
        )}
        title={row.bLabel ?? undefined}
      >
        {row.bLabel ?? "–"}
      </span>
    </div>
  );
}

function ModChip({
  modId,
  rank,
  highlight,
}: {
  modId: string | null;
  rank?: number;
  highlight?: "a" | "b" | "changed" | false;
}) {
  if (!modId) {
    return (
      <div className="flex h-9 items-center gap-1.5 rounded border border-dashed border-border/40 bg-muted/10 px-1.5 text-[9px] text-muted-foreground/50">
        Empty
      </div>
    );
  }
  const { name, rankLabel } = resolveModDisplay(modId, rank ?? 0);
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-1.5 overflow-hidden rounded border bg-muted/20 px-1.5",
        highlight === "a" && "border-emerald-500/50 bg-emerald-500/10",
        highlight === "b" && "border-rose-500/50 bg-rose-500/10",
        highlight === "changed" && "border-amber-500/50 bg-amber-500/10",
        !highlight && "border-border/40",
      )}
      title={rankLabel ? `${name} ${rankLabel}` : name}
    >
      <GameAssetImage
        src={getModImage(name)}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 rounded object-contain"
        hideOnError
      />
      <span className="min-w-0 truncate text-[10px] font-medium leading-tight">
        {name}
        {rankLabel ? <span className="ml-0.5 text-muted-foreground">{rankLabel}</span> : null}
      </span>
    </div>
  );
}

function ArcaneChip({
  id,
  highlight,
}: {
  id: string | null | undefined;
  highlight?: "a" | "b" | "changed" | false;
}) {
  const name = resolveArcaneDisplay(id ?? null);
  if (!name) {
    return (
      <div className="flex h-9 items-center gap-1.5 rounded border border-dashed border-border/40 bg-muted/10 px-1.5 text-[9px] text-muted-foreground/50">
        Empty
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-1.5 overflow-hidden rounded border bg-muted/20 px-1.5",
        highlight === "a" && "border-emerald-500/50 bg-emerald-500/10",
        highlight === "b" && "border-rose-500/50 bg-rose-500/10",
        highlight === "changed" && "border-amber-500/50 bg-amber-500/10",
        !highlight && "border-border/40",
      )}
      title={name}
    >
      <GameAssetImage
        src={getArcaneImage(name)}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 rounded object-contain"
        hideOnError
      />
      <span className="min-w-0 truncate text-[10px] font-medium">{name}</span>
    </div>
  );
}

function ShardChip({
  shard,
  highlight,
}: {
  shard: import("@/lib/types").EquippedArchonShard | null | undefined;
  highlight?: "a" | "b" | "changed" | false;
}) {
  if (!shard) {
    return (
      <div className="flex h-9 items-center gap-1.5 rounded border border-dashed border-border/40 bg-muted/10 px-1.5 text-[9px] text-muted-foreground/50">
        Empty
      </div>
    );
  }
  const label = getShardShortLabel(shard.shardColor, shard.shardTier);
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-1.5 overflow-hidden rounded border bg-muted/20 px-1.5",
        highlight === "a" && "border-emerald-500/50 bg-emerald-500/10",
        highlight === "b" && "border-rose-500/50 bg-rose-500/10",
        highlight === "changed" && "border-amber-500/50 bg-amber-500/10",
        !highlight && "border-border/40",
      )}
      title={label}
    >
      <GameAssetImage
        src={getArchonShardImage(shard.shardColor, shard.shardTier)}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 object-contain"
        hideOnError
      />
      <span className="min-w-0 truncate text-[10px] font-medium">{label}</span>
    </div>
  );
}

function SlotGrid({ a, b }: { a: CompareEquipmentGroup; b: CompareEquipmentGroup }) {
  const modPairs = pairModSlots(a.mods, b.mods);
  const arcLen = Math.max(a.arcaneIds?.length ?? 0, b.arcaneIds?.length ?? 0, a.arcaneIds || b.arcaneIds ? 2 : 0);
  const shardLen = Math.max(a.shards?.length ?? 0, b.shards?.length ?? 0, a.shards || b.shards ? 5 : 0);

  const stanceDiffers = (a.stanceModId ?? null) !== (b.stanceModId ?? null);

  return (
    <div className="mt-2 space-y-3">
      {(a.stanceModId || b.stanceModId) && (
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Stance</p>
          <div className="grid grid-cols-2 gap-2">
            <ModChip modId={a.stanceModId ?? null} highlight={stanceDiffers ? (a.stanceModId ? "a" : false) : false} />
            <ModChip modId={b.stanceModId ?? null} highlight={stanceDiffers ? (b.stanceModId ? "b" : false) : false} />
          </div>
        </div>
      )}
      {modPairs.length > 0 && (
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Mod slots</p>
          <div className="space-y-1">
            {modPairs.map((pair) => {
              let ha: "a" | "b" | "changed" | false = false;
              let hb: "a" | "b" | "changed" | false = false;
              if (pair.differs) {
                if (pair.a && !pair.b) {
                  ha = "a";
                } else if (!pair.a && pair.b) {
                  hb = "b";
                } else {
                  ha = "changed";
                  hb = "changed";
                }
              }
              return (
                <div key={pair.slotIndex} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
                  <span className="w-4 text-center font-mono text-[9px] text-muted-foreground">{pair.slotIndex + 1}</span>
                  <ModChip modId={pair.a?.modId ?? null} rank={pair.a?.rank} highlight={ha} />
                  <ModChip modId={pair.b?.modId ?? null} rank={pair.b?.rank} highlight={hb} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {arcLen > 0 && (
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Arcanes</p>
          <div className="space-y-1">
            {Array.from({ length: arcLen }, (_, i) => {
              const aId = a.arcaneIds?.[i] ?? null;
              const bId = b.arcaneIds?.[i] ?? null;
              const differs = aId !== bId;
              return (
                <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
                  <span className="w-4 text-center font-mono text-[9px] text-muted-foreground">{i + 1}</span>
                  <ArcaneChip
                    id={aId}
                    highlight={differs ? (aId && !bId ? "a" : aId && bId ? "changed" : false) : false}
                  />
                  <ArcaneChip
                    id={bId}
                    highlight={differs ? (!aId && bId ? "b" : aId && bId ? "changed" : false) : false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {shardLen > 0 && (
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Shards</p>
          <div className="space-y-1">
            {Array.from({ length: shardLen }, (_, i) => {
              const left = a.shards?.[i] ?? null;
              const right = b.shards?.[i] ?? null;
              const differs =
                (left?.shardId ?? null) !== (right?.shardId ?? null) ||
                (left?.shardTier ?? 0) !== (right?.shardTier ?? 0) ||
                (left?.selectedBonus ?? null) !== (right?.selectedBonus ?? null);
              return (
                <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
                  <span className="w-4 text-center font-mono text-[9px] text-muted-foreground">{i + 1}</span>
                  <ShardChip
                    shard={left}
                    highlight={differs ? (left && !right ? "a" : left && right ? "changed" : false) : false}
                  />
                  <ShardChip
                    shard={right}
                    highlight={differs ? (!left && right ? "b" : left && right ? "changed" : false) : false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTally(t: { onlyA: number; onlyB: number; changed: number }): string | null {
  const parts: string[] = [];
  if (t.onlyA) parts.push(`${t.onlyA} only A`);
  if (t.onlyB) parts.push(`${t.onlyB} only B`);
  if (t.changed) parts.push(`${t.changed} changed`);
  return parts.length ? parts.join(" · ") : null;
}

export function EquipmentDiff({
  a,
  b,
  aLabel = "A",
  bLabel = "B",
}: {
  a: CompareEquipment | undefined;
  b: CompareEquipment | undefined;
  aLabel?: string;
  bLabel?: string;
}) {
  const [slotsOpen, setSlotsOpen] = useState(false);
  const groups = useMemo(() => diffEquipmentGroups(a, b), [a, b]);
  const hasAny = equipmentHasAny(a) || equipmentHasAny(b);

  if (!hasAny && groups.length === 0) return null;

  const totalTally = groups.reduce(
    (acc, g) => ({
      onlyA: acc.onlyA + g.tally.onlyA,
      onlyB: acc.onlyB + g.tally.onlyB,
      changed: acc.changed + g.tally.changed,
    }),
    { onlyA: 0, onlyB: 0, changed: 0 },
  );
  const tallyLine = formatTally(totalTally);

  return (
    <div className="mt-4 border-t border-border/50 pt-3">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Gear differences
        </p>
        {tallyLine && (
          <p className="font-mono text-[10px] text-muted-foreground">{tallyLine}</p>
        )}
      </div>

      {groups.length === 0 || (totalTally.onlyA === 0 && totalTally.onlyB === 0 && totalTally.changed === 0) ? (
        <p className="mb-2 text-[11px] text-muted-foreground">Same mods, arcanes, and shards.</p>
      ) : (
        groups.map((g) => {
          const hasDiffs = g.tally.onlyA > 0 || g.tally.onlyB > 0 || g.tally.changed > 0;
          if (!hasDiffs) return null;
          return (
            <div key={g.groupId} className="mb-3 last:mb-0">
              {groups.length > 1 && (
                <p className="mb-1 text-[10px] font-medium text-foreground/80">{g.groupLabel}</p>
              )}
              {g.modRows.length > 0 && (
                <div className="mb-2">
                  <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Mods</p>
                  {g.modRows.map((row) => (
                    <DiffRow key={row.key} row={row} />
                  ))}
                </div>
              )}
              {g.arcaneRows.length > 0 && (
                <div className="mb-2">
                  <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Arcanes</p>
                  {g.arcaneRows.map((row) => (
                    <DiffRow key={row.key} row={row} />
                  ))}
                </div>
              )}
              {g.shardRows.length > 0 && (
                <div className="mb-2">
                  <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Shards</p>
                  {g.shardRows.map((row) => (
                    <DiffRow key={row.key} row={row} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={() => setSlotsOpen((v) => !v)}
        className="mt-1 flex min-h-9 w-full items-center gap-1.5 rounded-md px-1 text-left text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
      >
        {slotsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {slotsOpen ? "Hide slots" : "Show slots"}
        <span className="ml-auto text-[9px] font-normal uppercase tracking-wider text-muted-foreground/70">
          {aLabel} · {bLabel}
        </span>
      </button>

      {slotsOpen && (
        <div className="mt-2 space-y-4">
          {(a?.groups ?? b?.groups ?? []).length === 0 ? null : (
            (() => {
              const ids = new Set([
                ...(a?.groups.map((g) => g.id) ?? []),
                ...(b?.groups.map((g) => g.id) ?? []),
              ]);
              return [...ids].map((id) => {
                const ga = a?.groups.find((g) => g.id === id) ?? {
                  id,
                  label: id,
                  mods: [],
                };
                const gb = b?.groups.find((g) => g.id === id) ?? {
                  id,
                  label: id,
                  mods: [],
                };
                return (
                  <div key={id}>
                    {(a?.groups.length ?? 0) + (b?.groups.length ?? 0) > 1 && (
                      <p className="mb-1 text-[10px] font-medium text-foreground/80">
                        {ga.label || gb.label}
                      </p>
                    )}
                    <div className="mb-1 grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="w-4" />
                      <span className="truncate text-primary">{aLabel}</span>
                      <span className="truncate text-primary">{bLabel}</span>
                    </div>
                    <SlotGrid a={ga} b={gb} />
                  </div>
                );
              });
            })()
          )}
        </div>
      )}
    </div>
  );
}
