"use client";

import type { ReactNode } from "react";
import { Flag, Wrench, ExternalLink, Crosshair } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GameAssetImage } from "@/components/game-asset-image";
import { PanelHeading } from "@/components/page-shell";
import { formatCompanionType, formatWeaponCategory, getCodexWikiUrl, pct, weaponElementEntries } from "@/lib/codex/codex-catalog";
import {
  getWeaponRadialAttacks,
  radialAttackDamageTags,
  weaponHasRadialAttacks,
} from "@/lib/weapons/weapon-radial-utils";
import { getWeaponImage, getWarframeImage, getCompanionImage, getModImage } from "@/lib/display/images";
import { Weapon, Warframe, Companion } from "@/lib/types";
import { Archwing, Necramech } from "@/data/archwing";
import { useMods } from "@/lib/weapons/use-data";
import { getExclusiveModIdsForWeapon } from "@/lib/mods/weapon-exclusive-mods";
import { getAugmentModIdsForWarframe } from "@/lib/mods/warframe-augment-mods";
import { appendReturnTo } from "@/lib/site/nav-return";
import { dataFixesHref } from "@/lib/overrides/data-fixes-url";
import { useStaffRole } from "@/lib/auth/use-staff";
import type { OverrideCategory } from "@/lib/overrides/data-overrides";
import { cn } from "@/lib/utils";

export function CodexActionLinks({
  reportType,
  id,
  name,
  overrideCategory,
  wikiUrl,
  returnTo,
  editValuesLabel,
}: {
  reportType: string;
  id: string;
  name: string;
  overrideCategory: string;
  wikiUrl?: string;
  returnTo?: string;
  editValuesLabel?: string;
}) {
  const isStaff = useStaffRole();
  const reportHref = `/report-issue?type=${encodeURIComponent(reportType)}&name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`;
  const overrideHref = dataFixesHref({
    category: overrideCategory as OverrideCategory,
    itemId: id,
    returnTo,
  });

  return (
    <div className="flex flex-wrap gap-2 border-t border-border pt-3">
      {wikiUrl && (
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1 rounded border border-border px-2.5 py-2 text-xs text-muted-foreground hover:border-purple-500/40 hover:text-purple-800 dark:hover:text-purple-300 sm:min-h-0 sm:px-2 sm:py-1 sm:text-[10px]"
        >
          <ExternalLink className="h-2.5 w-2.5" /> Wiki
        </a>
      )}
      <a
        href={returnTo ? appendReturnTo(reportHref, returnTo) : reportHref}
        className="inline-flex min-h-11 items-center gap-1 rounded border border-amber-500/30 px-2.5 py-2 text-xs text-amber-800/80 hover:bg-amber-500/5 hover:text-amber-900 dark:text-amber-400/70 dark:hover:text-amber-400 sm:min-h-0 sm:px-2 sm:py-1 sm:text-[10px]"
      >
        <Flag className="h-2.5 w-2.5" /> Report
      </a>
      {isStaff && (
        <Link
          href={returnTo ? appendReturnTo(overrideHref, returnTo) : overrideHref}
          className="inline-flex min-h-11 items-center gap-1 rounded border border-purple-500/30 px-2.5 py-2 text-xs text-purple-800/80 hover:bg-purple-500/5 hover:text-purple-900 dark:text-purple-400/70 dark:hover:text-purple-400 sm:min-h-0 sm:px-2 sm:py-1 sm:text-[10px]"
        >
          <Wrench className="h-2.5 w-2.5" /> {editValuesLabel ?? "Edit in Data Fixes"}
        </Link>
      )}
    </div>
  );
}

function CodexEntityRow({
  selected,
  onSelect,
  accent,
  image,
  title,
  subtitle,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  accent: "blue" | "cyan" | "orange" | "sky" | "slate";
  image: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: ReactNode;
}) {
  const borderActive: Record<typeof accent, string> = {
    blue: "border-blue-500/50 bg-blue-500/5",
    cyan: "border-cyan-500/50 bg-cyan-500/5",
    orange: "border-orange-500/50 bg-orange-500/5",
    sky: "border-sky-500/50 bg-sky-500/5",
    slate: "border-slate-500/50 bg-slate-500/5",
  };
  const borderHover: Record<typeof accent, string> = {
    blue: "hover:border-blue-500/30",
    cyan: "hover:border-cyan-500/30",
    orange: "hover:border-orange-500/30",
    sky: "hover:border-sky-500/30",
    slate: "hover:border-slate-500/30",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2 rounded-lg border p-2 text-left transition-all",
        selected ? borderActive[accent] : cn("border-border/60", borderHover[accent]),
      )}
    >
      {image}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-[10px] text-muted-foreground">{subtitle}</p>
      </div>
      {badge}
    </button>
  );
}

export function CodexWeaponRow({
  weapon,
  selected,
  onSelect,
}: {
  weapon: Weapon;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CodexEntityRow
      selected={selected}
      onSelect={onSelect}
      accent="blue"
      image={
        <GameAssetImage
          src={getWeaponImage(weapon.name, { category: weapon.category })}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded object-contain bg-muted/20"
          hideOnError
        />
      }
      title={weapon.name}
      subtitle={`${formatWeaponCategory(weapon.category)} · ${pct(weapon.criticalChance)} crit${
        weaponHasRadialAttacks(weapon) ? " · AoE" : ""
      }`}
      badge={
        weapon.isIncarnon || weaponHasRadialAttacks(weapon) ? (
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            {weaponHasRadialAttacks(weapon) && (
              <Badge variant="outline" className="text-[9px] border-orange-500/30 text-orange-800 dark:text-orange-300">
                AoE
              </Badge>
            )}
            {weapon.isIncarnon && (
              <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-800 dark:text-amber-300">
                Incarnon
              </Badge>
            )}
          </div>
        ) : undefined
      }
    />
  );
}

export function CodexWarframeRow({
  warframe,
  selected,
  onSelect,
}: {
  warframe: Warframe;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CodexEntityRow
      selected={selected}
      onSelect={onSelect}
      accent="cyan"
      image={
        <GameAssetImage
          src={getWarframeImage(warframe.name)}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded object-contain bg-muted/20"
          hideOnError
        />
      }
      title={warframe.name}
      subtitle={`${warframe.health} HP · ${warframe.shield} shield · ${warframe.armor} armor`}
    />
  );
}

export function CodexCompanionRow({
  companion,
  selected,
  onSelect,
}: {
  companion: Companion;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CodexEntityRow
      selected={selected}
      onSelect={onSelect}
      accent="orange"
      image={
        <GameAssetImage
          src={getCompanionImage(companion.name)}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded object-contain bg-muted/20"
          hideOnError
        />
      }
      title={companion.name}
      subtitle={formatCompanionType(companion.type)}
    />
  );
}

export function CodexArchwingRow({
  archwing,
  selected,
  onSelect,
}: {
  archwing: Archwing;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CodexEntityRow
      selected={selected}
      onSelect={onSelect}
      accent="sky"
      image={
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-sky-500/10 text-[10px] font-bold text-sky-800 dark:text-sky-300">
          AW
        </div>
      }
      title={archwing.name}
      subtitle={`${archwing.health} HP · speed ${archwing.speed}`}
    />
  );
}

export function CodexNecramechRow({
  necramech,
  selected,
  onSelect,
}: {
  necramech: Necramech;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CodexEntityRow
      selected={selected}
      onSelect={onSelect}
      accent="slate"
      image={
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-slate-500/10 text-[10px] font-bold text-slate-700 dark:text-slate-300">
          NM
        </div>
      }
      title={necramech.name}
      subtitle={`${necramech.health} HP · ${necramech.armor} armor`}
    />
  );
}

function StatGrid({ items, compact }: { items: { label: string; value: string }[]; compact?: boolean }) {
  return (
    <div className={cn("grid gap-1 text-xs", compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3")}>
      {items.map(({ label, value }) => (
        <div key={label} className="rounded border border-border/60 px-1.5 py-1">
          <p className="text-[9px] uppercase leading-tight text-muted-foreground">{label}</p>
          <p className={cn("font-mono tabular-nums leading-tight", compact ? "text-xs" : "text-sm")}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export function WeaponDetailPanel({ weapon, compact, returnTo }: { weapon: Weapon; compact?: boolean; returnTo?: string }) {
  const { modsMap } = useMods();
  const elements = weaponElementEntries(weapon);
  const radialAttacks = getWeaponRadialAttacks(weapon);
  const exclusiveModIds = getExclusiveModIdsForWeapon(weapon.id);
  const exclusiveMods = exclusiveModIds
    .map((id) => modsMap.get(id))
    .filter((mod): mod is NonNullable<typeof mod> => Boolean(mod));

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-start gap-2.5">
        <GameAssetImage
          src={getWeaponImage(weapon.name, { category: weapon.category })}
          alt={weapon.name}
          width={compact ? 48 : 64}
          height={compact ? 48 : 64}
          className={cn("rounded object-contain bg-muted/20", compact ? "h-12 w-12" : "h-16 w-16")}
          hideOnError
        />
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{weapon.name}</h2>
          <p className="font-mono text-[10px] text-muted-foreground">{weapon.id}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-[10px] capitalize">
              {formatWeaponCategory(weapon.category)}
            </Badge>
            {weapon.isIncarnon && (
              <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-800 dark:text-amber-300">
                Incarnon
              </Badge>
            )}
            {weapon.isExalted && (
              <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-800 dark:text-purple-300">
                Exalted
              </Badge>
            )}
            {radialAttacks.length > 0 && (
              <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-800 dark:text-orange-300">
                AoE ×{radialAttacks.length}
              </Badge>
            )}
          </div>
          {weapon.isExalted && weapon.warframeId && weapon.abilityName && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              {weapon.abilityName === "Passive" ? "Signature weapon" : `${weapon.abilityName} ability`}
            </p>
          )}
        </div>
      </div>

      {weapon.isExalted && weapon.warframeId && (
        <div>
          <PanelHeading>Warframe</PanelHeading>
          <a
            href={
              returnTo
                ? appendReturnTo(`/codex?section=warframes&id=${encodeURIComponent(weapon.warframeId)}`, returnTo)
                : `/codex?section=warframes&id=${encodeURIComponent(weapon.warframeId)}`
            }
            className="inline-flex min-h-11 items-center gap-1.5 rounded border border-cyan-500/30 px-2.5 py-2 text-xs text-cyan-800 hover:bg-cyan-500/5 dark:text-cyan-300 sm:min-h-0 sm:px-2 sm:py-1 sm:text-[10px]"
          >
            <Crosshair className="h-2.5 w-2.5" />
            View warframe in codex
          </a>
        </div>
      )}

      <StatGrid
        compact={compact}
        items={[
          { label: "Total damage", value: String(Math.round(weapon.damage)) },
          { label: "Fire rate", value: weapon.fireRate.toFixed(2) },
          { label: "Crit chance", value: pct(weapon.criticalChance) },
          { label: "Crit mult", value: `${weapon.criticalMultiplier.toFixed(1)}x` },
          { label: "Status chance", value: pct(weapon.statusChance) },
          { label: "Magazine", value: String(weapon.magazine) },
          { label: "Reload", value: `${weapon.reloadTime.toFixed(1)}s` },
          { label: "Mod slots", value: String(weapon.modSlots) },
        ]}
      />

      <div>
        <PanelHeading>Damage types</PanelHeading>
        <div className="mt-1 flex flex-wrap gap-1 font-mono text-[10px]">
          {weapon.impact > 0 && (
            <span className="rounded bg-muted px-1.5 py-0.5">Impact {Math.round(weapon.impact)}</span>
          )}
          {weapon.puncture > 0 && (
            <span className="rounded bg-muted px-1.5 py-0.5">Puncture {Math.round(weapon.puncture)}</span>
          )}
          {weapon.slash > 0 && (
            <span className="rounded bg-muted px-1.5 py-0.5">Slash {Math.round(weapon.slash)}</span>
          )}
          {elements.map(({ label, value }) => (
            <span key={label} className="rounded bg-muted px-1.5 py-0.5 capitalize">
              {label} {Math.round(value)}
            </span>
          ))}
        </div>
      </div>

      {weapon.passive && (
        <div>
          <PanelHeading>Passive</PanelHeading>
          <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
            {weapon.passive}
          </p>
        </div>
      )}

      {exclusiveMods.length > 0 && (
        <div>
          <PanelHeading>Weapon mods</PanelHeading>
          <ul className="space-y-2">
            {exclusiveMods.map((mod) => (
              <li key={mod.id}>
                <a
                  href={
                    returnTo
                      ? appendReturnTo(
                          `/codex?section=mods&id=${encodeURIComponent(mod.id)}`,
                          returnTo,
                        )
                      : `/codex?section=mods&id=${encodeURIComponent(mod.id)}`
                  }
                  className="flex items-center gap-2 rounded border border-orange-500/25 bg-orange-500/5 p-2 transition-colors hover:border-orange-500/40"
                >
                  <GameAssetImage
                    src={getModImage(mod.name)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded object-contain bg-muted/20"
                    hideOnError
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{mod.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">Weapon-exclusive mod</p>
                  </div>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {radialAttacks.length > 0 && (
        <div>
          <PanelHeading>Radial / AoE attacks</PanelHeading>
          <div className={cn("space-y-2", compact ? "max-h-none overflow-visible" : "max-h-52 overflow-y-auto")}>
            {radialAttacks.map((attack, idx) => (
              <div key={`${attack.name}-${idx}`} className="rounded border border-border/60 p-2 text-xs">
                <p className="font-medium">{attack.name}</p>
                <div className="mt-1 grid grid-cols-2 gap-1 font-mono text-[10px] text-muted-foreground">
                  <span>Total: {Math.round(attack.totalDamage)}</span>
                  <span>Radius: {attack.radius.toFixed(1)}m</span>
                  {attack.falloffReduction != null && attack.falloffReduction > 0 && (
                    <span>Falloff: {(attack.falloffReduction * 100).toFixed(0)}%</span>
                  )}
                  {attack.explosionDelay != null && attack.explosionDelay > 0 && (
                    <span>Delay: {attack.explosionDelay.toFixed(1)}s</span>
                  )}
                </div>
                {radialAttackDamageTags(attack).length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {radialAttackDamageTags(attack).map((tag) => (
                      <span key={tag} className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <CodexActionLinks
        reportType="weapon"
        id={weapon.id}
        name={weapon.name}
        overrideCategory="weapon"
        wikiUrl={getCodexWikiUrl(weapon.name)}
        returnTo={returnTo}
      />
    </div>
  );
}

export function WarframeDetailPanel({
  warframe,
  exaltedWeapons = [],
  compact,
  returnTo,
}: {
  warframe: Warframe;
  exaltedWeapons?: Weapon[];
  compact?: boolean;
  returnTo?: string;
}) {
  const { modsMap } = useMods();
  const augmentModIds = getAugmentModIdsForWarframe(warframe.id);
  const augmentMods = augmentModIds
    .map((id) => modsMap.get(id))
    .filter((mod): mod is NonNullable<typeof mod> => Boolean(mod));

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-start gap-2.5">
        <GameAssetImage
          src={getWarframeImage(warframe.name)}
          alt={warframe.name}
          width={compact ? 48 : 64}
          height={compact ? 48 : 64}
          className={cn("rounded object-contain bg-muted/20", compact ? "h-12 w-12" : "h-16 w-16")}
          hideOnError
        />
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{warframe.name}</h2>
          <p className="font-mono text-[10px] text-muted-foreground">{warframe.id}</p>
        </div>
      </div>

      <StatGrid
        compact={compact}
        items={[
          { label: "Health", value: String(warframe.health) },
          { label: "Shield", value: String(warframe.shield) },
          { label: "Armor", value: String(warframe.armor) },
          { label: "Energy", value: String(warframe.energy) },
          { label: "Sprint speed", value: warframe.sprintSpeed.toFixed(2) },
          { label: "Abilities", value: String(warframe.abilities.length) },
        ]}
      />

      {warframe.passive && (
        <div>
          <PanelHeading>Passive</PanelHeading>
          <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
            {warframe.passive}
          </p>
        </div>
      )}

      {augmentMods.length > 0 && (
        <div>
          <PanelHeading>Augments</PanelHeading>
          <ul className="space-y-2">
            {augmentMods.map((mod) => (
              <li key={mod.id}>
                <a
                  href={
                    returnTo
                      ? appendReturnTo(
                          `/codex?section=mods&id=${encodeURIComponent(mod.id)}`,
                          returnTo,
                        )
                      : `/codex?section=mods&id=${encodeURIComponent(mod.id)}`
                  }
                  className="flex items-center gap-2 rounded border border-indigo-500/25 bg-indigo-500/5 p-2 transition-colors hover:border-indigo-500/40"
                >
                  <GameAssetImage
                    src={getModImage(mod.name)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 shrink-0 rounded object-contain bg-muted/20"
                    hideOnError
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{mod.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">Ability augment</p>
                  </div>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {exaltedWeapons.length > 0 && (
        <div>
          <PanelHeading>Exalted weapons</PanelHeading>
          <ul className="space-y-2">
            {exaltedWeapons.map((weapon) => (
              <li key={weapon.id}>
                <a
                  href={
                    returnTo
                      ? appendReturnTo(`/codex?section=weapons&id=${encodeURIComponent(weapon.id)}`, returnTo)
                      : `/codex?section=weapons&id=${encodeURIComponent(weapon.id)}`
                  }
                  className="flex items-center gap-2 rounded border border-purple-500/25 bg-purple-500/5 p-2 transition-colors hover:border-purple-500/40"
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
                    <p className="truncate text-[10px] text-muted-foreground">
                      {formatWeaponCategory(weapon.category)}
                      {weapon.abilityName && weapon.abilityName !== "Passive"
                        ? ` · ${weapon.abilityName}`
                        : weapon.abilityName === "Passive"
                          ? " · Passive (no melee equipped)"
                          : ""}
                    </p>
                  </div>
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warframe.abilities.length > 0 && (
        <div>
          <PanelHeading>Abilities</PanelHeading>
          <ul className={cn("space-y-2", compact ? "max-h-none overflow-visible" : "max-h-48 overflow-y-auto")}>
            {warframe.abilities.map((ab) => (
              <li key={ab.name} className="rounded border border-border/60 p-2">
                <p className="text-sm font-medium">{ab.name}</p>
                {ab.energyCost != null && (
                  <p className="text-[10px] text-muted-foreground">{ab.energyCost} energy</p>
                )}
                <p className={cn("mt-0.5 text-muted-foreground", compact ? "text-[10px] leading-snug" : "text-xs")}>
                  {ab.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CodexActionLinks
        reportType="warframe"
        id={warframe.id}
        name={warframe.name}
        overrideCategory="warframe"
        wikiUrl={getCodexWikiUrl(warframe.name)}
        returnTo={returnTo}
      />
    </div>
  );
}

export function CompanionDetailPanel({ companion, compact, returnTo }: { companion: Companion; compact?: boolean; returnTo?: string }) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div className="flex items-start gap-2.5">
        <GameAssetImage
          src={getCompanionImage(companion.name)}
          alt={companion.name}
          width={compact ? 48 : 64}
          height={compact ? 48 : 64}
          className={cn("rounded object-contain bg-muted/20", compact ? "h-12 w-12" : "h-16 w-16")}
          hideOnError
        />
        <div className="min-w-0 flex-1">
          <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{companion.name}</h2>
          <p className="font-mono text-[10px] text-muted-foreground">{companion.id}</p>
          <Badge variant="outline" className="mt-1 text-[10px] capitalize">
            {formatCompanionType(companion.type)}
          </Badge>
        </div>
      </div>

      <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
        {companion.description}
      </p>

      <StatGrid
        compact={compact}
        items={[
          { label: "Health", value: String(companion.health) },
          { label: "Shield", value: String(companion.shield) },
          { label: "Armor", value: String(companion.armor) },
        ]}
      />

      {companion.precept && (
        <div>
          <PanelHeading>Precept</PanelHeading>
          <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
            {companion.precept}
          </p>
        </div>
      )}

      <CodexActionLinks
        reportType="companion"
        id={companion.id}
        name={companion.name}
        overrideCategory="companion"
        wikiUrl={getCodexWikiUrl(companion.name)}
        returnTo={returnTo}
      />
    </div>
  );
}

export function ArchwingDetailPanel({ archwing, compact, returnTo }: { archwing: Archwing; compact?: boolean; returnTo?: string }) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div>
        <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{archwing.name}</h2>
        <p className="font-mono text-[10px] text-muted-foreground">{archwing.id}</p>
      </div>

      <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
        {archwing.description}
      </p>

      <StatGrid
        compact={compact}
        items={[
          { label: "Health", value: String(archwing.health) },
          { label: "Shield", value: String(archwing.shield) },
          { label: "Armor", value: String(archwing.armor) },
          { label: "Energy", value: String(archwing.energy) },
          { label: "Speed", value: archwing.speed.toFixed(2) },
        ]}
      />

      <CodexActionLinks
        reportType="other"
        id={archwing.id}
        name={archwing.name}
        overrideCategory="archwing"
        wikiUrl={getCodexWikiUrl(archwing.name)}
        returnTo={returnTo}
      />
    </div>
  );
}

export function NecramechDetailPanel({ necramech, compact, returnTo }: { necramech: Necramech; compact?: boolean; returnTo?: string }) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      <div>
        <h2 className={cn("font-semibold leading-tight", compact && "text-sm")}>{necramech.name}</h2>
        <p className="font-mono text-[10px] text-muted-foreground">{necramech.id}</p>
      </div>

      <p className={cn("text-muted-foreground", compact ? "text-xs leading-snug" : "text-sm")}>
        {necramech.description}
      </p>

      <StatGrid
        compact={compact}
        items={[
          { label: "Health", value: String(necramech.health) },
          { label: "Shield", value: String(necramech.shield) },
          { label: "Armor", value: String(necramech.armor) },
          { label: "Energy", value: String(necramech.energy) },
        ]}
      />

      <CodexActionLinks
        reportType="other"
        id={necramech.id}
        name={necramech.name}
        overrideCategory="necramech"
        wikiUrl={getCodexWikiUrl(necramech.name)}
        returnTo={returnTo}
      />
    </div>
  );
}
