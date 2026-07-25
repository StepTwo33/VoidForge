"use client";

import { useMemo, useState } from "react";
import {
  calcLoadoutStats,
  bestSustainedDps,
  fmtDamageNum,
  scenarioSimParams,
  ENEMY_TYPES,
  type DamageScenario,
} from "@/lib/builds/loadout-stats";
import type { Loadout } from "@/lib/types";
import type { LoadoutStatsResult, LoadoutWeaponSlotStats } from "@/lib/builds/loadout-stats";
import { useWeapons } from "@/lib/weapons/use-data";
import { allWarframes } from "@/data/warframes";
import {
  resolveAbilitiesWithHelminth,
  weaponDamageBuffAbilities,
} from "@/lib/weapons/weapon-external-buffs";
import { formatMarginalPct, type DpsContribution } from "@/lib/calc/dps-contributions";
import { ChevronDown, ChevronRight, Crosshair, Dog, Shield, Swords, Sparkles, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnemyLevelControl } from "@/components/enemy-level-control";

const SCENARIO_LABELS: Record<DamageScenario, string> = {
  paper: "Paper",
  midFight: "Mid-fight",
  fullRamp: "Full ramp",
  vsEnemy: "vs Enemy",
};

function ContributionsList({ contributions }: { contributions?: DpsContribution[] }) {
  if (!contributions?.length) return null;
  const showSustained = contributions.some(
    (c) => Math.abs(c.sustainedMarginalPct - c.burstMarginalPct) > 0.5,
  );

  return (
    <div className="pt-2 mt-1 border-t border-border/40">
      <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/80 mb-1.5">DPS contributions</p>
      <div className="space-y-1">
        {contributions.slice(0, 8).map((row) => (
          <div
            key={row.id}
            className="flex items-start justify-between gap-2"
            title={[row.nominal, row.tooltip].filter(Boolean).join(" · ")}
          >
            <div className="min-w-0">
              <div className="text-[10px] truncate">{row.label}</div>
              {row.nominal && (
                <div className="text-[9px] text-muted-foreground/60 truncate">{row.nominal}</div>
              )}
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] font-mono text-blue-400">{formatMarginalPct(row.burstMarginalPct ?? 0)}</div>
              {showSustained && (
                <div className="text-[9px] font-mono text-muted-foreground">
                  sus {formatMarginalPct(row.sustainedMarginalPct ?? 0)}
                </div>
              )}
            </div>
          </div>
        ))}
        {contributions.length > 8 && (
          <p className="text-[9px] text-muted-foreground/60">+{contributions.length - 8} more in weapon builder</p>
        )}
      </div>
    </div>
  );
}

function WeaponRow({
  label,
  icon,
  color,
  entry,
  showTtk,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  entry: LoadoutWeaponSlotStats | null;
  showTtk: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!entry) return null;
  const { stats, ttk, isMelee } = entry;
  const burst = ttk?.burstDps ?? stats.burstDps;
  const sustained = ttk?.sustainedDps ?? stats.sustainedDps;

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden bg-card/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
        <span className={color}>{icon}</span>
        <span className="text-xs font-medium truncate flex-1">{label}</span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[40%] hidden sm:inline">{entry.name}</span>
        <span className="text-xs font-mono text-amber-400 tabular-nums shrink-0">{fmtDamageNum(sustained)}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0 space-y-1 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground pt-2 truncate">{entry.name}</p>
          <StatLine label="Burst DPS" value={fmtDamageNum(burst)} highlight />
          <StatLine label="Sustained DPS" value={fmtDamageNum(sustained)} highlight />
          {showTtk && ttk && (
            <>
              <StatLine label="TTK" value={ttk.ttk === Infinity ? "∞" : `${ttk.ttk.toFixed(2)}s`} />
              <StatLine label="Shots to kill" value={ttk.shotsToKill === Infinity ? "∞" : String(ttk.shotsToKill)} />
            </>
          )}
          <StatLine
            label="Total damage"
            value={(
              (stats.arsenalDamage?.totalDamage ?? stats.totalDamage ?? 0)
              * Math.max(1, stats.multishot ?? 1)
            ).toFixed(1)}
          />
          <StatLine label="Crit" value={`${((stats.criticalChance ?? 0) * 100).toFixed(1)}% / ${(stats.criticalMultiplier ?? 0).toFixed(1)}x`} />
          <StatLine label="Status" value={`${((stats.statusChance ?? 0) * 100).toFixed(1)}%`} />
          {isMelee && (stats.heavyAttackDamage ?? 0) > 0 && (
            <>
              <StatLine label="Heavy attack mult" value={`${(stats.heavyAttackComboMultiplier ?? 1).toFixed(1)}x`} />
              <StatLine label="Heavy attack" value={fmtDamageNum(stats.heavyAttackDamage ?? 0)} />
            </>
          )}
          {!isMelee && (
            <StatLine label="Fire rate" value={(stats.fireRate ?? 0).toFixed(2)} />
          )}
          <ContributionsList contributions={entry.contributions} />
        </div>
      )}
    </div>
  );
}

function StatLine({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className={cn("text-[10px] font-mono tabular-nums", highlight && "text-amber-800 font-medium dark:text-amber-300")}>{value}</span>
    </div>
  );
}

export function LoadoutDamagePanel({ loadout }: { loadout: Loadout }) {
  const allWeapons = useWeapons();
  const [scenario, setScenario] = useState<DamageScenario>("midFight");
  const [enemyId, setEnemyId] = useState<string>("heavy_gunner");
  const [enemyLevel, setEnemyLevel] = useState(100);
  const [activeAbilityBuffs, setActiveAbilityBuffs] = useState<string[]>([]);

  const abilityBuffOptions = useMemo(() => {
    try {
      const wb = loadout.warframeBuild;
      if (!wb?.warframeId) return [];
      const wf = allWarframes.find((w) => w.id === wb.warframeId);
      return weaponDamageBuffAbilities(
        resolveAbilitiesWithHelminth(wf?.abilities, wb.helminthAbilityId, wb.helminthSlot),
      );
    } catch (err) {
      console.warn("Loadout ability buff options failed", err);
      return [];
    }
  }, [
    loadout.warframeBuild?.warframeId,
    loadout.warframeBuild?.helminthAbilityId,
    loadout.warframeBuild?.helminthSlot,
  ]);

  const enemy = useMemo(
    () => ENEMY_TYPES.find((e) => e.id === enemyId) ?? ENEMY_TYPES[0],
    [enemyId],
  );

  const stats = useMemo((): LoadoutStatsResult | null => {
    try {
      const simParams = {
        ...scenarioSimParams(scenario),
        activeWeaponAbilityBuffs: activeAbilityBuffs,
      };
      return calcLoadoutStats(loadout, {
        simParams,
        allWeapons,
        enemy: scenario === "vsEnemy" ? enemy : null,
        enemyLevel: scenario === "vsEnemy" ? enemyLevel : undefined,
      });
    } catch (err) {
      console.warn("Loadout damage estimate failed", err);
      return null;
    }
  }, [loadout, scenario, enemy, enemyLevel, allWeapons, activeAbilityBuffs]);

  const best = useMemo(() => {
    if (!stats) return null;
    try {
      return bestSustainedDps(stats);
    } catch (err) {
      console.warn("Loadout best DPS failed", err);
      return null;
    }
  }, [stats]);
  const showTtk = scenario === "vsEnemy";

  if (!stats) return null;

  const hasAnyWeapon =
    stats.primary || stats.secondary || stats.melee || stats.exalted || stats.exaltedMelee;

  if (!stats.warframe && !hasAnyWeapon && !stats.companion) {
    return null;
  }

  return (
    <div className="mt-4 border border-amber-500/20 rounded-xl bg-amber-500/[0.04] overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-500/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold">Damage estimate</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(SCENARIO_LABELS) as DamageScenario[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setScenario(key)}
              className={cn(
                "px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                scenario === key
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-200"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {SCENARIO_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {scenario === "vsEnemy" && (
        <div className="px-4 py-2 border-b border-border/40 flex flex-wrap gap-2 items-end bg-card/30">
          <div className="flex-1 min-w-[140px]">
            <label className="text-[10px] text-muted-foreground block mb-0.5">Enemy</label>
            <select
              value={enemyId}
              onChange={(e) => setEnemyId(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs"
            >
              {ENEMY_TYPES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.faction} — {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 flex-1 max-w-[10rem]">
            <EnemyLevelControl value={enemyLevel} onChange={setEnemyLevel} />
          </div>
        </div>
      )}

      {abilityBuffOptions.length > 0 && (
        <div className="px-4 py-2 border-b border-border/40 bg-card/20">
          <p className="text-[10px] text-muted-foreground mb-1.5">Active weapon buffs (warframe abilities)</p>
          <div className="flex flex-wrap gap-1.5">
            {abilityBuffOptions.map((ability) => {
              const active = activeAbilityBuffs.includes(ability.name);
              return (
                <button
                  key={ability.name}
                  type="button"
                  onClick={() =>
                    setActiveAbilityBuffs((prev) =>
                      active ? prev.filter((n) => n !== ability.name) : [...prev, ability.name],
                    )
                  }
                  className={cn(
                    "px-2 py-0.5 text-[10px] rounded-md border transition-colors",
                    active
                      ? "border-purple-500/50 bg-purple-500/15 text-purple-200"
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
        <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/30 flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-amber-400/80" />
          Best sustained: <span className="text-foreground font-medium">{best.slot}</span> ({best.name}) —{" "}
          <span className="font-mono text-amber-800 dark:text-amber-300">{fmtDamageNum(best.sustainedDps)}</span>
          {showTtk && scenario === "vsEnemy" && (
            <span className="text-[10px] ml-1">vs {enemy.name} L{enemyLevel}</span>
          )}
        </div>
      )}

      <div className="p-3 space-y-2">
        {stats.warframe && (
          <div className="border border-purple-500/25 rounded-lg px-3 py-2 bg-purple-500/[0.06]">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs font-medium">{stats.warframe.name}</span>
            </div>
            {stats.warframe.forms ? (
              <div className="space-y-2">
                {stats.warframe.forms.map((form) => (
                  <div key={form.id} className="rounded-md border border-purple-500/15 bg-background/30 px-2 py-1.5">
                    <p className="text-[10px] font-semibold text-purple-800/90 mb-1 dark:text-purple-300/90">{form.label}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1">
                      <MiniStat label="EHP" value={fmtDamageNum(form.stats?.effectiveHealth ?? 0)} />
                      <MiniStat label="Strength" value={`${((form.stats?.abilityStrength ?? 0) * 100).toFixed(0)}%`} />
                      <MiniStat label="Duration" value={`${((form.stats?.abilityDuration ?? 0) * 100).toFixed(0)}%`} />
                      <MiniStat label="Efficiency" value={`${((form.stats?.abilityEfficiency ?? 0) * 100).toFixed(0)}%`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1">
                <MiniStat label="EHP" value={fmtDamageNum(stats.warframe.stats?.effectiveHealth ?? 0)} />
                <MiniStat label="Strength" value={`${((stats.warframe.stats?.abilityStrength ?? 0) * 100).toFixed(0)}%`} />
                <MiniStat label="Duration" value={`${((stats.warframe.stats?.abilityDuration ?? 0) * 100).toFixed(0)}%`} />
                <MiniStat label="Efficiency" value={`${((stats.warframe.stats?.abilityEfficiency ?? 0) * 100).toFixed(0)}%`} />
              </div>
            )}
          </div>
        )}

        <WeaponRow label="Primary" icon={<Crosshair className="h-3.5 w-3.5" />} color="text-blue-400" entry={stats.primary} showTtk={showTtk} />
        <WeaponRow label="Secondary" icon={<Crosshair className="h-3.5 w-3.5" />} color="text-cyan-400" entry={stats.secondary} showTtk={showTtk} />
        <WeaponRow label="Melee" icon={<Swords className="h-3.5 w-3.5" />} color="text-orange-400" entry={stats.melee} showTtk={showTtk} />
        <WeaponRow label="Exalted" icon={<Sparkles className="h-3.5 w-3.5" />} color="text-violet-400" entry={stats.exalted} showTtk={showTtk} />
        <WeaponRow
          label="Exalted Melee"
          icon={<Sparkles className="h-3.5 w-3.5" />}
          color="text-fuchsia-400"
          entry={stats.exaltedMelee}
          showTtk={showTtk}
        />

        {stats.companion && (
          <div className="border border-green-500/25 rounded-lg overflow-hidden bg-green-500/[0.04]">
            <div className="px-3 py-2 flex items-center gap-2">
              <Dog className="h-3.5 w-3.5 text-green-400" />
              <span className="text-xs font-medium">{stats.companion.name}</span>
            </div>
            <div className="px-3 pb-2 grid grid-cols-3 gap-2">
              <MiniStat label="HP" value={fmtDamageNum(stats.companion.bodyStats.totalHealth)} />
              <MiniStat label="Shield" value={fmtDamageNum(stats.companion.bodyStats.totalShield)} />
              <MiniStat label="EHP" value={fmtDamageNum(stats.companion.bodyStats.effectiveHealth)} />
            </div>
            {stats.companion.weapon && (
              <div className="border-t border-border/40 px-3 py-2 space-y-1">
                <p className="text-[10px] text-muted-foreground">
                  Weapon: <span className="text-foreground">{stats.companion.weapon.name}</span>
                </p>
                <StatLine
                  label="Sustained DPS"
                  value={fmtDamageNum(
                    stats.companion.weapon.ttk?.sustainedDps ?? stats.companion.weapon.stats.sustainedDps,
                  )}
                  highlight
                />
                {showTtk && stats.companion.weapon.ttk && (
                  <StatLine
                    label="TTK"
                    value={
                      stats.companion.weapon.ttk.ttk === Infinity
                        ? "∞"
                        : `${stats.companion.weapon.ttk.ttk.toFixed(2)}s`
                    }
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="px-4 pb-3 text-[10px] text-muted-foreground/70 leading-relaxed">
        Estimates use modded stats with scenario assumptions ({SCENARIO_LABELS[scenario].toLowerCase()}).
        {scenario !== "vsEnemy" && " Switch to vs Enemy for TTK against a specific target."}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-xs font-mono tabular-nums">{value}</div>
    </div>
  );
}
