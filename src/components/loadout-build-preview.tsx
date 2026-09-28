"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Target, Zap } from "lucide-react";
import { GameAssetImage } from "@/components/game-asset-image";
import { EnemyLevelControl } from "@/components/enemy-level-control";
import { getArcaneImage, getModImage } from "@/lib/display/images";
import type { BuildPreviewChip, BuildPreviewData, LoadoutSlotPreview } from "@/lib/builds/build-preview";
import { summarizeLoadoutSlots } from "@/lib/builds/build-preview";
import type { LoadoutBuildData } from "@/lib/builds/loadouts";
import {
  bestSustainedDps,
  calcLoadoutStats,
  ENEMY_TYPES,
  fmtDamageNum,
  scenarioSimParams,
  type DamageScenario,
  type LoadoutStatsResult,
  type LoadoutWeaponSlotStats,
} from "@/lib/builds/loadout-stats";
import {
  buildShareUrl,
  encodeBuild,
  type ShareableBuild,
} from "@/lib/builds/build-url";
import type { WarframeBuildData, WeaponBuildData } from "@/lib/builds/build-storage";
import { allWarframes } from "@/data/warframes";
import {
  resolveAbilitiesWithHelminth,
  weaponDamageBuffAbilities,
} from "@/lib/weapons/weapon-external-buffs";
import { useWeapons } from "@/lib/weapons/use-data";
import type { Loadout, ModularBuildData, WarframeCalculatedStats } from "@/lib/types";
import { cn } from "@/lib/utils";

const SCENARIO_LABELS: Record<DamageScenario, string> = {
  paper: "Paper",
  midFight: "Mid-fight",
  fullRamp: "Full ramp",
  vsEnemy: "vs Enemy",
};

function GearTile({
  chip,
  accent,
}: {
  chip: BuildPreviewChip;
  accent?: "arcane";
}) {
  const src = accent === "arcane" ? getArcaneImage(chip.label) : getModImage(chip.label);
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-2 py-1.5",
        accent === "arcane"
          ? "border-purple-500/30 bg-purple-500/10"
          : "border-border/50 bg-card/70",
      )}
      title={chip.sublabel ? `${chip.label} ${chip.sublabel}` : chip.label}
    >
      <GameAssetImage
        src={src}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded object-contain bg-muted/30"
        hideOnError
      />
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-medium leading-tight text-foreground">
          {chip.label}
        </span>
        {chip.sublabel && (
          <span className="block text-[9px] text-muted-foreground">{chip.sublabel}</span>
        )}
      </span>
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-border/40 bg-background/40 px-2 py-1.5">
      <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={cn(
          "truncate font-mono text-xs tabular-nums",
          highlight && "font-medium text-amber-800 dark:text-amber-300",
        )}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

function modsToShare(mods: { modId: string; rank: number; slotIndex?: number }[] | undefined) {
  return (mods ?? []).map((m) => ({
    id: m.modId,
    rank: m.rank,
    ...(m.slotIndex != null ? { slotIndex: m.slotIndex } : {}),
  }));
}

function polaritiesToShare(pols: Record<number, string> | undefined) {
  if (!pols) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(pols)) out[k] = v;
  return Object.keys(out).length ? out : undefined;
}

/** Encode a loadout kit slot as a builder share URL (full stats / edit). */
function slotBuilderHref(loadout: Loadout | null, slotId: string): string | null {
  if (!loadout) return null;
  try {
    let share: ShareableBuild | null = null;

    if (slotId === "warframe" && loadout.warframeBuild) {
      const wb = loadout.warframeBuild as WarframeBuildData;
      share = {
        type: "warframe",
        itemId: wb.warframeId,
        mods: modsToShare(wb.mods),
        arcanes: (wb.arcaneIds ?? []).map((id) => id ?? ""),
        shards: (wb.shards ?? [])
          .filter((s): s is NonNullable<typeof s> => s != null)
          .map((s) => ({ id: s.shardId, bonus: s.selectedBonus })),
        slotPolarities: polaritiesToShare(wb.slotPolarities),
        isMR30: wb.isMR30,
      };
    } else if (slotId === "primary" || slotId === "secondary" || slotId === "melee") {
      const modular = loadout.modularBuild;
      if (modular?.slot === slotId) {
        const mb = modular as ModularBuildData & { slot: string };
        share = {
          type: "modular",
          itemId: mb.modularType,
          mods: modsToShare(mb.mods),
          modularType: mb.modularType,
          parts: mb.parts,
          arcanes: (mb.arcaneIds ?? []).map((id) => id ?? ""),
          hasOrokinCatalyst: mb.hasOrokinCatalyst,
          isMR30: mb.isMR30,
          slotPolarities: polaritiesToShare(mb.slotPolarities),
        };
      } else {
        const wb =
          slotId === "primary"
            ? loadout.primaryBuild
            : slotId === "secondary"
              ? loadout.secondaryBuild
              : loadout.meleeBuild;
        if (!wb?.weaponId) return null;
        const data = wb as WeaponBuildData;
        share = {
          type: "weapon",
          itemId: data.weaponId,
          mods: modsToShare(data.mods),
          arcanes: (data.arcaneIds ?? []).map((id) => id ?? ""),
          hasOrokinCatalyst: data.hasOrokinCatalyst,
          isMR30: data.isMR30,
          progenitorElement: data.progenitorElement,
          progenitorBonusPercent: data.progenitorBonusPercent,
          adversaryFormas: data.adversaryFormas,
          incarnonEvolutions: data.incarnonEvolutions,
          slotPolarities: polaritiesToShare(data.slotPolarities),
        };
      }
    } else if (slotId === "modular" && loadout.modularBuild) {
      const mb = loadout.modularBuild as ModularBuildData;
      share = {
        type: "modular",
        itemId: mb.modularType,
        mods: modsToShare(mb.mods),
        modularType: mb.modularType,
        parts: mb.parts,
        arcanes: (mb.arcaneIds ?? []).map((id) => id ?? ""),
        hasOrokinCatalyst: mb.hasOrokinCatalyst,
        isMR30: mb.isMR30,
        slotPolarities: polaritiesToShare(mb.slotPolarities),
      };
    }

    if (!share) return null;
    return buildShareUrl(share, encodeBuild(share));
  } catch {
    return null;
  }
}

function warframeMiniStats(s: WarframeCalculatedStats | null | undefined) {
  if (!s) return null;
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
      <MiniStat label="EHP" value={fmtDamageNum(s.effectiveHealth ?? 0)} highlight />
      <MiniStat label="Health" value={fmtDamageNum(s.totalHealth ?? 0)} />
      <MiniStat label="Shield" value={fmtDamageNum(s.totalShield ?? 0)} />
      <MiniStat label="Armor" value={fmtDamageNum(s.totalArmor ?? 0)} />
      <MiniStat label="Energy" value={fmtDamageNum(s.totalEnergy ?? 0)} />
      <MiniStat label="Strength" value={`${((s.abilityStrength ?? 0) * 100).toFixed(0)}%`} />
      <MiniStat label="Duration" value={`${((s.abilityDuration ?? 0) * 100).toFixed(0)}%`} />
      <MiniStat label="Efficiency" value={`${((s.abilityEfficiency ?? 0) * 100).toFixed(0)}%`} />
      <MiniStat label="Range" value={`${((s.abilityRange ?? 0) * 100).toFixed(0)}%`} />
      {(s.damageReduction ?? 0) > 0 && (
        <MiniStat label="DR" value={`${((s.damageReduction ?? 0) * 100).toFixed(0)}%`} />
      )}
    </div>
  );
}

function weaponMiniStats(entry: LoadoutWeaponSlotStats | null | undefined, showTtk: boolean) {
  if (!entry) return null;
  const { stats, ttk, isMelee } = entry;
  const burst = ttk?.burstDps ?? stats.burstDps;
  const sustained = ttk?.sustainedDps ?? stats.sustainedDps;
  const totalDmg =
    (stats.arsenalDamage?.totalDamage ?? stats.totalDamage ?? 0) * Math.max(1, stats.multishot ?? 1);

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      <MiniStat label="Sustained" value={fmtDamageNum(sustained)} highlight />
      <MiniStat label="Burst" value={fmtDamageNum(burst)} highlight />
      <MiniStat label="Total dmg" value={totalDmg.toFixed(0)} />
      <MiniStat
        label="Crit"
        value={`${((stats.criticalChance ?? 0) * 100).toFixed(0)}% / ${(stats.criticalMultiplier ?? 0).toFixed(1)}x`}
      />
      <MiniStat label="Status" value={`${((stats.statusChance ?? 0) * 100).toFixed(0)}%`} />
      <MiniStat label="Multishot" value={(stats.multishot ?? 1).toFixed(2)} />
      {isMelee ? (
        (stats.heavyAttackDamage ?? 0) > 0 ? (
          <MiniStat label="Heavy" value={fmtDamageNum(stats.heavyAttackDamage ?? 0)} />
        ) : (
          <MiniStat label="Attack spd" value={(stats.fireRate ?? 0).toFixed(2)} />
        )
      ) : (
        <MiniStat label="Fire rate" value={(stats.effectiveFireRate ?? stats.fireRate ?? 0).toFixed(2)} />
      )}
      {!isMelee && (
        <MiniStat
          label="Mag / reload"
          value={`${Math.round(stats.magazine ?? 0)} / ${(stats.reloadTime ?? 0).toFixed(1)}s`}
        />
      )}
      {showTtk && ttk && (
        <>
          <MiniStat
            label="TTK"
            value={ttk.ttk === Infinity ? "∞" : `${ttk.ttk.toFixed(2)}s`}
            highlight
          />
          <MiniStat
            label="Shots"
            value={ttk.shotsToKill === Infinity ? "∞" : String(ttk.shotsToKill)}
          />
        </>
      )}
    </div>
  );
}

function SlotCard({
  slot,
  featured,
  stats,
  showTtk,
  builderHref,
}: {
  slot: LoadoutSlotPreview;
  featured?: boolean;
  stats: LoadoutStatsResult | null;
  showTtk: boolean;
  builderHref: string | null;
}) {
  let estimate: React.ReactNode = null;

  if (slot.id === "warframe" && stats?.warframe) {
    const wf = stats.warframe;
    estimate = wf.forms ? (
      <div className="space-y-2">
        {wf.forms.map((form) => (
          <div key={form.id}>
            <p className="mb-1 text-[10px] font-semibold text-purple-800/90 dark:text-purple-300/90">
              {form.label}
            </p>
            {warframeMiniStats(form.stats)}
          </div>
        ))}
      </div>
    ) : (
      warframeMiniStats(wf.stats)
    );
  } else if (slot.id === "primary") {
    estimate = weaponMiniStats(stats?.primary, showTtk);
  } else if (slot.id === "secondary") {
    estimate = weaponMiniStats(stats?.secondary, showTtk);
  } else if (slot.id === "melee") {
    estimate = weaponMiniStats(stats?.melee, showTtk);
  } else if (slot.id === "modular") {
    const weaponEntry =
      stats?.primary?.name === slot.itemName
        ? stats.primary
        : stats?.secondary?.name === slot.itemName
          ? stats.secondary
          : stats?.melee?.name === slot.itemName
            ? stats.melee
            : stats?.primary ?? stats?.secondary ?? stats?.melee;
    estimate = weaponMiniStats(weaponEntry, showTtk);
  } else if (slot.id === "companion" && stats?.companion) {
    const c = stats.companion;
    estimate = (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <MiniStat label="HP" value={fmtDamageNum(c.bodyStats.totalHealth)} />
          <MiniStat label="Shield" value={fmtDamageNum(c.bodyStats.totalShield)} />
          <MiniStat label="Armor" value={fmtDamageNum(c.bodyStats.totalArmor)} />
          <MiniStat label="EHP" value={fmtDamageNum(c.bodyStats.effectiveHealth)} highlight />
        </div>
        {c.weapon && (
          <div>
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {c.weapon.name}
            </p>
            {weaponMiniStats(c.weapon, showTtk)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border/60 bg-muted/15 p-4",
        featured && "md:col-span-2 lg:col-span-3",
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        {slot.itemImage ? (
          <GameAssetImage
            src={slot.itemImage}
            alt={slot.itemName}
            width={featured ? 72 : 56}
            height={featured ? 72 : 56}
            className={cn(
              "shrink-0 rounded-lg bg-muted/40 object-contain p-1 dark:bg-black/20",
              featured ? "h-[4.5rem] w-[4.5rem]" : "h-14 w-14",
            )}
            hideOnError
          />
        ) : (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-medium text-muted-foreground",
              featured ? "h-[4.5rem] w-[4.5rem]" : "h-14 w-14",
            )}
          >
            {slot.label.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {slot.label}
          </p>
          <p
            className={cn(
              "font-semibold text-foreground break-words [overflow-wrap:anywhere]",
              featured ? "text-lg" : "text-sm",
            )}
          >
            {slot.itemName}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {slot.modChips.length === 0
              ? "No mods"
              : `${slot.modChips.length} mod${slot.modChips.length === 1 ? "" : "s"}`}
            {slot.arcaneChips.length > 0
              ? ` · ${slot.arcaneChips.length} arcane${slot.arcaneChips.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
      </div>

      {estimate && (
        <div className="mb-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2.5">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-900/80 dark:text-amber-200/80">
              Estimate
            </p>
            {builderHref && (
              <Link
                href={builderHref}
                className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border/60 bg-background/60 px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                Full stats
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
          {estimate}
        </div>
      )}

      <div className="mt-auto space-y-3">
        {slot.modChips.length > 0 && (
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mods
            </p>
            <div
              className={cn(
                "grid gap-1.5",
                featured
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {slot.modChips.map((chip, i) => (
                <GearTile key={`${chip.label}-${i}`} chip={chip} />
              ))}
            </div>
          </div>
        )}

        {slot.arcaneChips.length > 0 && (
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Arcanes
            </p>
            <div
              className={cn(
                "grid gap-1.5",
                featured ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {slot.arcaneChips.map((chip, i) => (
                <GearTile key={`${chip.label}-${i}`} chip={chip} accent="arcane" />
              ))}
            </div>
          </div>
        )}

        {slot.extraLines.length > 0 && (
          <div className="space-y-1 border-t border-border/40 pt-2">
            {slot.extraLines.map((line) => (
              <p key={line} className="text-xs text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadoutBuildPreview({
  data,
  summary,
}: {
  data: unknown;
  summary: BuildPreviewData;
}) {
  const allWeapons = useWeapons();
  const [scenario, setScenario] = useState<DamageScenario>("midFight");
  const [enemyId, setEnemyId] = useState("heavy_gunner");
  const [enemyLevel, setEnemyLevel] = useState(100);
  const [steelPath, setSteelPath] = useState(false);
  const [activeAbilityBuffs, setActiveAbilityBuffs] = useState<string[]>([]);

  const loadout = useMemo((): Loadout | null => {
    if (!data || typeof data !== "object") return null;
    return {
      id: "preview",
      name: "Preview",
      createdAt: 0,
      updatedAt: 0,
      ...(data as LoadoutBuildData),
    };
  }, [data]);

  const slots = useMemo(() => summarizeLoadoutSlots(data), [data]);
  const warframe = slots.find((s) => s.id === "warframe");
  const others = slots.filter((s) => s.id !== "warframe");

  const abilityBuffOptions = useMemo(() => {
    if (!loadout?.warframeBuild?.warframeId) return [];
    try {
      const wb = loadout.warframeBuild;
      const wf = allWarframes.find((w) => w.id === wb.warframeId);
      return weaponDamageBuffAbilities(
        resolveAbilitiesWithHelminth(wf?.abilities, wb.helminthAbilityId, wb.helminthSlot),
      );
    } catch {
      return [];
    }
  }, [
    loadout?.warframeBuild?.warframeId,
    loadout?.warframeBuild?.helminthAbilityId,
    loadout?.warframeBuild?.helminthSlot,
  ]);

  const enemy = useMemo(
    () => ENEMY_TYPES.find((e) => e.id === enemyId) ?? ENEMY_TYPES[0],
    [enemyId],
  );

  const stats = useMemo((): LoadoutStatsResult | null => {
    if (!loadout) return null;
    try {
      return calcLoadoutStats(loadout, {
        simParams: {
          ...scenarioSimParams(scenario),
          activeWeaponAbilityBuffs: activeAbilityBuffs,
        },
        allWeapons,
        enemy: scenario === "vsEnemy" ? enemy : null,
        enemyLevel: scenario === "vsEnemy" ? enemyLevel : undefined,
        steelPath: scenario === "vsEnemy" ? steelPath : undefined,
      });
    } catch {
      return null;
    }
  }, [loadout, scenario, enemy, enemyLevel, steelPath, allWeapons, activeAbilityBuffs]);

  const best = useMemo(() => (stats ? bestSustainedDps(stats) : null), [stats]);
  const showTtk = scenario === "vsEnemy";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {summary.itemImage ? (
            <GameAssetImage
              src={summary.itemImage}
              alt={summary.itemName}
              width={96}
              height={96}
              className="h-20 w-20 shrink-0 rounded-xl bg-muted/50 object-contain p-1.5 dark:bg-black/20 sm:h-24 sm:w-24"
              hideOnError
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-medium text-muted-foreground sm:h-24 sm:w-24">
              LO
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Loadout
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground break-words [overflow-wrap:anywhere] sm:text-2xl">
              {summary.itemName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{summary.modSummary}</p>
            {slots.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {slots.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 py-0.5 pl-0.5 pr-2.5 text-[11px] text-muted-foreground"
                  >
                    {s.itemImage ? (
                      <GameAssetImage
                        src={s.itemImage}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 rounded-full object-contain bg-muted/40"
                        hideOnError
                      />
                    ) : null}
                    <span className="font-medium text-foreground/90">{s.label}</span>
                    <span className="text-muted-foreground/80">· {s.itemName}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              Damage estimate
            </div>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(SCENARIO_LABELS) as DamageScenario[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-md border px-2.5 py-1.5 text-[10px] transition-colors",
                    scenario === key
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-900 dark:text-amber-200"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {SCENARIO_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {scenario === "vsEnemy" && (
            <div className="flex flex-wrap items-end gap-2">
              <div className="min-w-[140px] flex-1">
                <label className="mb-0.5 block text-[10px] text-muted-foreground">Enemy</label>
                <select
                  value={enemyId}
                  onChange={(e) => setEnemyId(e.target.value)}
                  className="w-full min-h-11 rounded-md border border-border bg-background px-2 py-1.5 text-xs"
                >
                  {ENEMY_TYPES.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.faction} — {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 max-w-[12rem] flex-1">
                <EnemyLevelControl
                  value={enemyLevel}
                  onChange={setEnemyLevel}
                  steelPath={steelPath}
                  onSteelPathChange={setSteelPath}
                />
              </div>
            </div>
          )}

          {abilityBuffOptions.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] text-muted-foreground">
                Active weapon buffs (warframe abilities)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {abilityBuffOptions.map((ability) => {
                  const active = activeAbilityBuffs.includes(ability.name);
                  return (
                    <button
                      key={ability.name}
                      type="button"
                      onClick={() =>
                        setActiveAbilityBuffs((prev) =>
                          active
                            ? prev.filter((n) => n !== ability.name)
                            : [...prev, ability.name],
                        )
                      }
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-md border px-2.5 py-1.5 text-[10px] transition-colors",
                        active
                          ? "border-purple-500/50 bg-purple-500/15 text-purple-900 dark:text-purple-200"
                          : "border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                      title={ability.description}
                    >
                      {ability.name}
                      {ability.damageBuff != null && (
                        <span className="opacity-70"> (+{(ability.damageBuff * 100).toFixed(0)}%)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {best && (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5 shrink-0 text-amber-700/80 dark:text-amber-400/80" />
              <span>
                Best sustained: <span className="font-medium text-foreground">{best.slot}</span> (
                {best.name}) —{" "}
                <span className="font-mono text-amber-800 dark:text-amber-300">
                  {fmtDamageNum(best.sustainedDps)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-muted-foreground">No slots filled in this loadout yet.</p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Kit slots
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {warframe && (
              <SlotCard
                slot={warframe}
                featured
                stats={stats}
                showTtk={showTtk}
                builderHref={slotBuilderHref(loadout, warframe.id)}
              />
            )}
            {others.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                stats={stats}
                showTtk={showTtk}
                builderHref={slotBuilderHref(loadout, slot.id)}
              />
            ))}
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            Estimates use modded stats with scenario assumptions (
            {SCENARIO_LABELS[scenario].toLowerCase()}).
            {scenario !== "vsEnemy" && " Switch to vs Enemy for TTK against a specific target. Use Full stats on a slot for the complete builder view."}
          </p>
        </div>
      )}
    </div>
  );
}
