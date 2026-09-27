"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Pencil,
  ExternalLink,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GameAssetImage } from "@/components/game-asset-image";
import { CodexModImage } from "@/components/codex-mod-image";
import { ContentPanel, PanelHeading } from "@/components/page-shell";
import { CodexActionLinks } from "@/components/codex-entity-panels";
import { ArcaneValuesDialog } from "@/components/arcane-values-dialog";
import { ArcaneEffectDef } from "@/data/arcane-effects";
import { isAuraMod, modMaxCapacity } from "@/lib/mods/aura-mods";
import { getModSlotCategory, modSlotCategoryLabel } from "@/lib/mods/mod-slot-categories";
import { getArcaneImage, getWeaponImage, getWarframeImage } from "@/lib/display/images";
import { getArchonShardImage, SHARD_COLORS, getShardColorName } from "@/lib/display/shard-display";
import { scaleArcaneEffectLine, scaleArcaneEffectValue } from "@/lib/calc/arcane-utils";
import { getArcaneStatLabel, getArcaneDisplayInfo } from "@/lib/display/arcane-display";
import { getVerifiedArcaneBehavior } from "@/lib/calc/arcane-behavior-registry";
import { itemApplyTargetLabel } from "@/lib/codex/item-behavior-types";
import { cleanModDescription, getModStatDisplayLines, modDrainAtRank } from "@/lib/display/mod-display";
import { getModStatLabel } from "@/lib/overrides/override-stat-catalog";
import { getExclusiveWeaponEntries } from "@/lib/mods/weapon-exclusive-mods";
import { isWeaponExclusiveMod } from "@/lib/mods/weapon-mod-tags";
import {
  getAugmentWarframeEntry,
  isWarframeAugment,
  isWarframeSpecificAugment,
} from "@/lib/mods/warframe-augment-mods";
import { appendReturnTo } from "@/lib/site/nav-return";
import { useStaffRole } from "@/lib/auth/use-staff";
import {
  getArcaneCoverageInfo,
  getArcaneSlotLabel,
  getArcaneWikiUrl,
} from "@/lib/codex/arcane-browser-meta";
import { modBrowserCategoryLabel } from "@/lib/mods/mod-browser-categories";
import { Mod, ArchonShard } from "@/lib/types";
import { getSetBonusPieces, isSetBonusMod } from "@/lib/mods/set-mod-catalog";
import { accentTone } from "@/lib/display/accent-tones";
import { cn } from "@/lib/utils";

export function CodexDetailCard({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-stretch overscroll-none sm:items-end sm:justify-end sm:p-4 sm:pb-[max(1rem,env(safe-area-inset-bottom,0px))] lg:p-6 lg:pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]"
      role="dialog"
      aria-modal="true"
      aria-label="Selected entry details"
    >
      <button
        type="button"
        aria-label="Dismiss details"
        className="absolute inset-0 bg-background/55 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <ContentPanel
        className={cn(
          "relative z-[1] flex w-full flex-col overflow-hidden rounded-none border-x-0 border-b-0 sm:max-w-md sm:rounded-xl sm:border",
          "max-h-[min(88dvh,calc(100dvh-3.5rem-env(safe-area-inset-top,0px)))] pb-[env(safe-area-inset-bottom,0px)] shadow-2xl shadow-[var(--shadow-color)] sm:max-h-[min(72vh,calc(100dvh-5rem-env(safe-area-inset-top,0px)))] sm:pb-0",
          "border-border/80 bg-card/98 backdrop-blur-md",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:min-h-0 sm:py-1 sm:text-[10px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to list
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:h-8 sm:w-8"
            aria-label="Close detail card"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-3">{children}</div>
      </ContentPanel>
    </div>
  );
}

export function CodexModRow({
  mod,
  selected,
  onSelect,
}: {
  mod: Mod;
  selected: boolean;
  onSelect: () => void;
}) {
  const maxCap = modMaxCapacity(mod);
  const setBonus = isSetBonusMod(mod);
  const pieces = setBonus ? getSetBonusPieces(mod) : 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-lg border p-2 text-left transition-all",
        selected ? "border-indigo-500/50 bg-indigo-500/5" : "border-border/60 hover:border-indigo-500/30",
      )}
    >
      <CodexModImage
        name={mod.name}
        polarity={mod.polarity}
        variant="card"
        size={56}
        className="h-[82px] w-14"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{mod.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {modBrowserCategoryLabel(mod)}
        </p>
      </div>
      {setBonus ? (
        <span className={cn("text-[10px] font-medium", accentTone.amber.textSoft)} title="Set pieces required">
          {pieces}-piece
        </span>
      ) : (
        <span className="font-mono text-[10px] text-muted-foreground" title="Capacity drain at R0 → max rank">
          {mod.drain}
          <span className="text-muted-foreground/60"> → {maxCap}</span>
        </span>
      )}
    </button>
  );
}

export function CodexArcaneRow({
  arcane,
  selected,
  hasIssues,
  onSelect,
}: {
  arcane: Mod;
  selected: boolean;
  hasIssues: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-lg border p-2 text-left transition-all",
        selected ? "border-purple-500/50 bg-purple-500/5" : "border-border/60 hover:border-purple-500/30",
      )}
    >
      <GameAssetImage
        src={getArcaneImage(arcane.name)}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded object-contain bg-muted/20"
        hideOnError
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{arcane.name}</p>
        <p className="text-[10px] text-muted-foreground">{getArcaneSlotLabel(arcane)}</p>
      </div>
      {hasIssues && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />}
    </button>
  );
}

export function CodexShardRow({
  shard,
  selected,
  onSelect,
}: {
  shard: ArchonShard;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-lg border p-2 text-left transition-all",
        selected ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/60 hover:border-emerald-500/30",
      )}
    >
      <GameAssetImage
        src={getArchonShardImage(shard.color, shard.tier)}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded object-contain bg-muted/20"
        hideOnError
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{shard.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {getShardColorName(shard.color)} · Tier {shard.tier}
        </p>
      </div>
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: SHARD_COLORS[shard.color] ?? "#888" }}
      />
    </button>
  );
}

export function ModDetailPanel({ mod, compact, returnTo }: { mod: Mod; compact?: boolean; returnTo?: string }) {
  const aura = isAuraMod(mod);
  const setBonus = isSetBonusMod(mod);
  const setPieces = setBonus ? getSetBonusPieces(mod) : 0;
  const slotCategory = getModSlotCategory(mod);
  const maxCap = modMaxCapacity(mod);
  const exclusiveWeapons = isWeaponExclusiveMod(mod.id) ? getExclusiveWeaponEntries(mod.id) : [];
  const augmentWarframe = isWarframeSpecificAugment(mod) ? getAugmentWarframeEntry(mod) : null;
  const isUniversalAugment = isWarframeAugment(mod) && mod.warframeId === "universal";

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-start gap-2.5">
        <CodexModImage
          name={mod.name}
          polarity={mod.polarity}
          variant="card"
          size={compact ? 80 : 104}
          className={compact ? "h-[116px] w-20" : "h-[151px] w-[104px]"}
        />
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{mod.name}</h2>
          <p className="font-mono text-[10px] text-muted-foreground">{mod.id}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-[10px] capitalize">
              {modBrowserCategoryLabel(mod)}
            </Badge>
            {aura && (
              <Badge variant="outline" className={cn("text-[10px]", accentTone.amber.badge)}>
                Aura
              </Badge>
            )}
            {slotCategory && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  slotCategory === "exilus" && accentTone.cyan.badge,
                  slotCategory === "tome" && accentTone.purple.badge,
                  slotCategory === "historic" && accentTone.rose.badge,
                )}
              >
                {modSlotCategoryLabel(slotCategory)}
              </Badge>
            )}
            {exclusiveWeapons.length > 0 && (
              <Badge variant="outline" className={cn("text-[10px]", accentTone.orange.badge)}>
                Weapon mod
              </Badge>
            )}
            {augmentWarframe && (
              <Badge variant="outline" className={cn("text-[10px]", accentTone.indigo.badge)}>
                Warframe augment
              </Badge>
            )}
            {isUniversalAugment && (
              <Badge variant="outline" className={cn("text-[10px]", accentTone.indigo.badge)}>
                Universal augment
              </Badge>
            )}
            {setBonus && (
              <Badge variant="outline" className={cn("text-[10px]", accentTone.amber.badge)}>
                Set bonus
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
        {cleanModDescription(mod.description)}
      </p>

      {setBonus ? (
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="rounded border border-amber-500/25 bg-amber-500/5 p-1.5">
            <p className="text-[10px] uppercase text-muted-foreground">Pieces required</p>
            <p className={cn("font-mono", compact ? "text-base" : "text-lg")}>{setPieces}</p>
          </div>
          <div className="rounded border border-border/60 p-1.5">
            <p className="text-[10px] uppercase text-muted-foreground">Activation</p>
            <p className="text-sm font-medium">Automatic</p>
          </div>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <div className="rounded border border-border/60 p-1.5">
          <p className="text-[10px] uppercase text-muted-foreground">Base drain (R0)</p>
          <p className={cn("font-mono", compact ? "text-base" : "text-lg")}>{mod.drain}</p>
        </div>
        <div className="rounded border border-border/60 p-1.5">
          <p className="text-[10px] uppercase text-muted-foreground">
            {aura ? "Max rank bonus" : `Max drain (R${mod.maxRank})`}
          </p>
          <p className={cn("font-mono", compact ? "text-base" : "text-lg")}>{maxCap}</p>
        </div>
        <div className="rounded border border-border/60 p-1.5">
          <p className="text-[10px] uppercase text-muted-foreground">Max rank</p>
          <p className="font-mono">{mod.maxRank}</p>
        </div>
        <div className="rounded border border-border/60 p-1.5">
          <p className="text-[10px] uppercase text-muted-foreground">Polarity</p>
          <p className="capitalize">{mod.polarity}</p>
        </div>
      </div>

      {aura ? (
        <p className="text-[10px] leading-snug text-muted-foreground">
          Aura capacity: R0 = {mod.drain}, max rank R{mod.maxRank} = {maxCap} (adds matching polarity capacity).
        </p>
      ) : (
        <p className="text-[10px] leading-snug text-muted-foreground">
          Capacity drain: R0 = {modDrainAtRank(mod.drain, 0)}, max rank R{mod.maxRank} = {modDrainAtRank(mod.drain, mod.maxRank)} (+1 per rank).
        </p>
      )}
        </>
      )}

      {setBonus && (
        <p className="text-[10px] leading-snug text-muted-foreground">
          Set bonuses are not equippable mods — they activate automatically when enough mods from the same set are installed across your loadout.
        </p>
      )}

      {Object.keys(mod.stats ?? {}).length > 0 && (
        <div>
          <PanelHeading>{setBonus ? "Effect at full set" : "Stats (R0 → max)"}</PanelHeading>
          <ul className="mt-1 space-y-1">
            {Object.entries(mod.stats ?? {}).map(([statKey, perRank]) => {
              const r0 = getModStatDisplayLines({ ...mod, stats: { [statKey]: perRank } }, 0)[0];
              const rMax = getModStatDisplayLines({ ...mod, stats: { [statKey]: perRank } }, mod.maxRank)[0];
              return (
                <li key={statKey} className="flex justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">{getModStatLabel(statKey)}</span>
                  <span className="font-mono text-emerald-800 text-right dark:text-emerald-400">
                    {r0?.atRank ?? "—"}
                    <span className="text-muted-foreground/70"> → </span>
                    {rMax?.atMax ?? "—"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {exclusiveWeapons.length > 0 && (
        <div>
          <PanelHeading>Compatible weapons</PanelHeading>
          <ul className="space-y-2">
            {exclusiveWeapons.map((weapon) => (
              <li key={weapon.id}>
                <a
                  href={
                    returnTo
                      ? appendReturnTo(
                          `/codex?section=weapons&id=${encodeURIComponent(weapon.id)}`,
                          returnTo,
                        )
                      : `/codex?section=weapons&id=${encodeURIComponent(weapon.id)}`
                  }
                  className="flex items-center gap-2 rounded border border-orange-500/25 bg-orange-500/5 p-2 transition-colors hover:border-orange-500/40"
                >
                  <GameAssetImage
                    src={getWeaponImage(weapon.name, { category: weapon.category })}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded object-contain bg-muted/20"
                    hideOnError
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{weapon.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">Weapon-exclusive</p>
                  </div>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {augmentWarframe && (
        <div>
          <PanelHeading>Compatible warframe</PanelHeading>
          <ul className="space-y-2">
            <li>
              <a
                href={
                  returnTo
                    ? appendReturnTo(
                        `/codex?section=warframes&id=${encodeURIComponent(augmentWarframe.id)}`,
                        returnTo,
                      )
                    : `/codex?section=warframes&id=${encodeURIComponent(augmentWarframe.id)}`
                }
                className="flex items-center gap-2 rounded border border-indigo-500/25 bg-indigo-500/5 p-2 transition-colors hover:border-indigo-500/40"
              >
                <GameAssetImage
                  src={getWarframeImage(augmentWarframe.name)}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded object-contain bg-muted/20"
                  hideOnError
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{augmentWarframe.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">Ability augment</p>
                </div>
                <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
              </a>
            </li>
          </ul>
        </div>
      )}

      <CodexActionLinks
        reportType="mod"
        id={mod.id}
        name={mod.name}
        overrideCategory="mod"
        returnTo={returnTo}
      />
    </div>
  );
}

export function ArcaneDetailPanel({
  arcane,
  display,
  coverage,
  effects,
  rank,
  onRankChange,
  compact,
  returnTo,
}: {
  arcane: Mod;
  display: ReturnType<typeof getArcaneDisplayInfo>;
  coverage: ReturnType<typeof getArcaneCoverageInfo>;
  effects?: ArcaneEffectDef;
  rank: number;
  onRankChange: (r: number) => void;
  compact?: boolean;
  returnTo?: string;
}) {
  const isStaff = useStaffRole();
  const [editValuesOpen, setEditValuesOpen] = useState(false);
  const behavior = getVerifiedArcaneBehavior(arcane.id);

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-start gap-2.5">
        <GameAssetImage
          src={getArcaneImage(arcane.name)}
          alt={arcane.name}
          width={compact ? 48 : 64}
          height={compact ? 48 : 64}
          className={cn("rounded object-contain bg-muted/20", compact ? "h-12 w-12" : "h-16 w-16")}
          hideOnError
        />
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{arcane.name}</h2>
          <p className="font-mono text-[10px] text-muted-foreground">{arcane.id}</p>
          {effects && (
            <Badge variant="outline" className="mt-1 text-[10px]">
              {effects.trigger}
              {effects.stackCap != null ? ` · cap ${effects.stackCap}` : ""}
            </Badge>
          )}
        </div>
      </div>

      <label className="block text-[10px] text-muted-foreground">
        Preview rank{" "}
        <input
          type="range"
          min={0}
          max={arcane.maxRank}
          value={rank}
          onChange={(e) => onRankChange(Number(e.target.value))}
          className="ml-2 w-full"
        />
        <span className="font-mono text-foreground">
          {rank}/{arcane.maxRank}
        </span>
      </label>

      <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
        {display.description}
      </p>

      {coverage.issues.length > 0 && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-2.5 py-1.5">
          <ul className={cn("list-inside list-disc text-[11px]", accentTone.amber.textMuted)}>
            {coverage.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {display.applied.length > 0 && (
        <div>
          <PanelHeading>Applied @ R{rank}</PanelHeading>
          <ul className="space-y-0.5 text-xs">
            {display.applied.map((line, idx) => (
              <li key={`applied-${idx}-${line.label}`} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{line.label}</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{line.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {display.conditional.length > 0 && (
        <div key={`conditional-${rank}`}>
          <PanelHeading>Conditional @ R{rank}</PanelHeading>
          <ul className="space-y-1 text-xs">
            {display.conditional.map((line, idx) => (
              <li key={`cond-${idx}-${line.label}`}>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{line.label}</span>
                  <span className={cn("font-mono", accentTone.amber.mono)}>{line.value}</span>
                </div>
                {line.note && (
                  <p className="text-[10px] text-muted-foreground/80">{line.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {behavior && behavior.effects.length > 0 && (
        <div>
          <PanelHeading>Build apply</PanelHeading>
          <ul className="space-y-0.5 text-xs">
            {behavior.effects.map((line) => (
              <li key={line.statKey} className="flex justify-between gap-2">
                <span className="text-muted-foreground truncate">{getArcaneStatLabel(line.statKey)}</span>
                <span className={cn("shrink-0 text-[10px]", accentTone.purple.textSoft)}>{itemApplyTargetLabel(line.target)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(arcane.stats ?? {}).length > 0 && (
        <div>
          <PanelHeading>Catalog stats @ R{rank}</PanelHeading>
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(arcane.stats ?? {}).map(([stat, value]) => {
              const scaled = scaleArcaneEffectValue(value, rank, arcane.maxRank);
              const label = stat.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
              return (
                <span key={stat} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                  {label}: {scaled > 0 ? "+" : ""}
                  {Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}
                </span>
              );
            })}
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Catalog stats are display/fallback. Build values come from effect lines below — edit via Override in Data Fixes.
          </p>
        </div>
      )}

      {effects && effects.effects.length > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <PanelHeading>Base values @ R{rank}</PanelHeading>
            {isStaff && (
              <button
                type="button"
                onClick={() => setEditValuesOpen(true)}
                className={cn(
                  "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium",
                  accentTone.purple.button,
                )}
              >
                <Pencil className="h-2.5 w-2.5" />
                Edit values
              </button>
            )}
          </div>
          <div className={cn(compact ? "max-h-none overflow-visible" : "max-h-32 overflow-y-auto", "space-y-1")}>
            {effects.effects.map((line) => {
              const scaled = scaleArcaneEffectLine(line, rank, effects.maxRank);
              const suffix = line.flat ? "" : "%";
              const display = `${scaled > 0 && !line.flat ? "+" : ""}${Number.isInteger(scaled) ? scaled : scaled.toFixed(1)}${suffix}`;
              return (
                <div key={line.stat} className="flex justify-between gap-2 text-xs">
                  <span className="truncate text-muted-foreground">{getArcaneStatLabel(line.stat)}</span>
                  <span className="shrink-0 font-mono text-emerald-800 dark:text-emerald-400">{display}</span>
                </div>
              );
            })}
          </div>
          {!isStaff && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              These numbers drive builds. Staff can edit via the button above or Report Issue → Data Fixes.
            </p>
          )}
        </div>
      )}

      {isStaff && effects && (
        <ArcaneValuesDialog
          open={editValuesOpen}
          onOpenChange={setEditValuesOpen}
          arcaneId={arcane.id}
          arcaneName={arcane.name}
          effects={effects}
          returnTo={returnTo}
        />
      )}

      <CodexActionLinks
        reportType="mod"
        id={arcane.id}
        name={arcane.name}
        overrideCategory="arcane"
        editValuesLabel="Edit in Data Fixes"
        wikiUrl={getArcaneWikiUrl(arcane.name)}
        returnTo={returnTo}
      />
    </div>
  );
}

export function ShardDetailPanel({ shard, compact, returnTo }: { shard: ArchonShard; compact?: boolean; returnTo?: string }) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-start gap-2.5">
        <GameAssetImage
          src={getArchonShardImage(shard.color, shard.tier)}
          alt={shard.name}
          width={compact ? 48 : 64}
          height={compact ? 48 : 64}
          className={cn("rounded object-contain bg-muted/20", compact ? "h-12 w-12" : "h-16 w-16")}
          hideOnError
        />
        <div>
          <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{shard.name}</h2>
          <p className="font-mono text-[10px] text-muted-foreground">{shard.id}</p>
        </div>
      </div>
      <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
        {shard.description}
      </p>
      <div>
        <PanelHeading>Stat options</PanelHeading>
        <div className="flex flex-wrap gap-1">
          {Object.entries(shard.statBonuses).map(([stat, val]) => (
            <span key={stat} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              {stat}: +{val}
            </span>
          ))}
        </div>
      </div>
      <CodexActionLinks
        reportType="mod"
        id={shard.id}
        name={shard.name}
        overrideCategory="archon_shard"
        returnTo={returnTo}
      />
    </div>
  );
}