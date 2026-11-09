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
import type { TTKPrimingOptions } from "@/lib/calc/ttk";
import { useWeapons } from "@/lib/weapons/use-data";
import { allWarframes } from "@/data/warframes";
import { resolveSavedArcaneSlots } from "@/lib/builds/build-storage";
import { getArcaneEffectDef } from "@/lib/calc/arcane-calculator";
import { arcaneStackCap } from "@/lib/calc/arcane-utils";
import { CONDITIONAL_WARFRAME_MOD_DEFS } from "@/lib/calc/calculator";
import {
  computeLoadoutAbilityArmorStripPct,
  formatAbilityBuffDebuffBadge,
  resolveAbilitiesWithHelminth,
  weaponDamageBuffAbilities,
} from "@/lib/weapons/weapon-external-buffs";
import { formatMarginalPct, type DpsContribution } from "@/lib/calc/dps-contributions";
import {
  ChevronDown,
  ChevronRight,
  Crosshair,
  Dog,
  Flame,
  Shield,
  Sparkles,
  Swords,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EnemyLevelControl } from "@/components/enemy-level-control";
import { loadoutCombatStatCells } from "@/lib/builds/loadout-combat-stats";

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
                <div className="text-[9px] text-muted-foreground/70 truncate">{row.nominal}</div>
              )}
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[10px] font-mono text-blue-700 dark:text-blue-400">{formatMarginalPct(row.burstMarginalPct ?? 0)}</div>
              {showSustained && (
                <div className="text-[9px] font-mono text-muted-foreground">
                  sus {formatMarginalPct(row.sustainedMarginalPct ?? 0)}
                </div>
              )}
            </div>
          </div>
        ))}
        {contributions.length > 8 && (
          <p className="text-[9px] text-muted-foreground/70">+{contributions.length - 8} more in weapon builder</p>
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
  const durScale = Math.max(0, 1 + (stats.statusDurationBonus ?? 0));
  const blastProc = stats.statusProcs?.find((p) => p.type === "blast");

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden bg-card/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex min-h-11 items-center gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
        <span className={color}>{icon}</span>
        <span className="min-w-0 flex-1 truncate text-xs font-medium">{label}</span>
        <span className="text-[10px] text-muted-foreground truncate max-w-[35%] hidden sm:inline">{entry.name}</span>
        {showTtk && ttk && (
          <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0">
            {ttk.ttk === Infinity ? "∞" : `${ttk.ttk.toFixed(2)}s`}
          </span>
        )}
        <span className="text-xs font-mono text-amber-800 dark:text-amber-400 tabular-nums shrink-0">{fmtDamageNum(sustained)}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0 space-y-1 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground pt-2 truncate">{entry.name}</p>
          <StatLine label="Burst DPS" value={fmtDamageNum(burst)} highlight />
          <StatLine label="Sustained DPS" value={fmtDamageNum(sustained)} highlight />
          {showTtk && ttk && (
            <>
              <StatLine label="TTK" value={ttk.ttk === Infinity ? "∞" : `${ttk.ttk.toFixed(2)}s`} highlight />
              <StatLine label="Shots to kill" value={ttk.shotsToKill === Infinity ? "∞" : String(ttk.shotsToKill)} />
              {ttk.scaledArmor > 0 && (
                <StatLine
                  label="End Armor / DR"
                  value={`${Math.round(ttk.scaledArmor)} (${ttk.armorDR.toFixed(1)}%)`}
                />
              )}
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
          <StatLine
            label="Status"
            value={`${((stats.statusChance ?? 0) * 100).toFixed(1)}%${Math.abs(durScale - 1) > 0.005 ? ` (${(durScale * 100).toFixed(0)}% dur)` : ""}`}
          />
          {blastProc && blastProc.totalDamage > 0 && (
            <StatLine
              label="Blast proc (fuse / 10×)"
              value={`${fmtDamageNum(blastProc.totalDamage)} @ ${(1.5 * durScale).toFixed(2)}s / ${fmtDamageNum(blastProc.totalDamage * 10)}`}
            />
          )}
          {isMelee ? (
            <>
              <StatLine label="Attack speed" value={(stats.fireRate ?? 0).toFixed(2)} />
              {(stats.heavyAttackDamage ?? 0) > 0 && (
                <>
                  <StatLine label="Heavy attack mult" value={`${(stats.heavyAttackComboMultiplier ?? 1).toFixed(1)}x`} />
                  <StatLine label="Heavy attack" value={fmtDamageNum(stats.heavyAttackDamage ?? 0)} />
                  {stats.heavyCriticalChance != null && (
                    <StatLine label="Heavy crit chance" value={`${(stats.heavyCriticalChance * 100).toFixed(1)}%`} />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <StatLine label="Fire rate" value={(stats.fireRate ?? 0).toFixed(2)} />
              {(stats.ammoEfficiency != null && stats.ammoEfficiency > 0) && (
                <StatLine label="Ammo efficiency" value={`${Math.min(75, Math.round(stats.ammoEfficiency * 100))}%`} />
              )}
            </>
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
  const [enableTargetSim, setEnableTargetSim] = useState(false);
  const [showPriming, setShowPriming] = useState(false);
  const [enemyId, setEnemyId] = useState<string>("heavy_gunner");
  const [enemyLevel, setEnemyLevel] = useState(100);
  const [steelPath, setSteelPath] = useState(false);
  const [applyHeadshots, setApplyHeadshots] = useState(false);
  const [applyTriggerBuffs, setApplyTriggerBuffs] = useState(false);
  const [activeAbilityBuffs, setActiveAbilityBuffs] = useState<string[]>([]);

  // Enemy debuff priming (Path-of-Building style combat configuration)
  const [primedViral, setPrimedViral] = useState(0);
  const [primedCorrosive, setPrimedCorrosive] = useState(0);
  const [primedBlast, setPrimedBlast] = useState(0);
  const [primedMagnetic, setPrimedMagnetic] = useState(0);
  const [primedHeatStrip, setPrimedHeatStrip] = useState(false);
  const [armorStripPct, setArmorStripPct] = useState(0);

  // Cross-slot conditional overrides (null = follow scenario preset)
  const [passiveYareliOverride, setPassiveYareliOverride] = useState<boolean | null>(null);
  const [passiveZephyrOverride, setPassiveZephyrOverride] = useState<boolean | null>(null);
  const [passiveGarudaOverride, setPassiveGarudaOverride] = useState<boolean | null>(null);
  const [tenaciousBondOverride, setTenaciousBondOverride] = useState<boolean | null>(null);
  const [reinforcedBondOverride, setReinforcedBondOverride] = useState<boolean | null>(null);
  const [wfArcaneOverrides, setWfArcaneOverrides] = useState<Record<string, number>>({});
  const [wfModOverrides, setWfModOverrides] = useState<Record<string, number>>({});

  const wfFamily = (loadout.warframeBuild?.warframeId ?? "").replace(/_prime$/, "");
  const companionModIds = useMemo(
    () => (loadout.companionBuild?.mods ?? []).map((m) => m.modId),
    [loadout.companionBuild?.mods],
  );
  const hasTenaciousBond = companionModIds.includes("tenacious_bond");
  const hasReinforcedBond = companionModIds.includes("reinforced_bond");

  const toggleableWarframeArcanes = useMemo(() => {
    const wb = loadout.warframeBuild;
    if (!wb?.arcaneIds?.length) return [];
    const slots = resolveSavedArcaneSlots(wb.arcaneIds, 2);
    const out: { id: string; name: string; fullStacks: number }[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < slots.length; i++) {
      const arc = slots[i];
      if (!arc || seen.has(arc.id)) continue;
      seen.add(arc.id);
      const def = getArcaneEffectDef(arc.id);
      if (
        !def ||
        def.trigger === "passive" ||
        arc.id === "arcane_intention" ||
        arc.id === "arcane_persistence"
      ) {
        continue;
      }
      const rank = wb.arcaneRanks?.[i] ?? arc.maxRank;
      const cap =
        def.trigger === "stacks" ? (arcaneStackCap(def, rank) ?? 1) : 1;
      out.push({ id: arc.id, name: arc.name, fullStacks: cap });
    }
    return out;
  }, [loadout.warframeBuild?.arcaneIds, loadout.warframeBuild?.arcaneRanks]);

  const toggleableWarframeMods = useMemo(() => {
    const mods = loadout.warframeBuild?.mods ?? [];
    const out: { id: string; label: string; maxStacks: number }[] = [];
    for (const slot of mods) {
      const def = CONDITIONAL_WARFRAME_MOD_DEFS[slot.modId];
      if (def) out.push({ id: def.id, label: def.label, maxStacks: def.maxStacks });
    }
    return out;
  }, [loadout.warframeBuild?.mods]);

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

  const targetActive = scenario === "vsEnemy" || enableTargetSim;
  const activePrimingCount =
    (primedViral > 0 ? 1 : 0) +
    (primedCorrosive > 0 ? 1 : 0) +
    (primedBlast > 0 ? 1 : 0) +
    (primedMagnetic > 0 ? 1 : 0) +
    (primedHeatStrip ? 1 : 0) +
    (armorStripPct > 0 ? 1 : 0);

  const enemyPriming = useMemo((): TTKPrimingOptions | undefined => {
    if (!targetActive && activePrimingCount === 0) return undefined;
    return {
      primedViralStacks: primedViral,
      primedCorrosiveStacks: primedCorrosive,
      primedBlastStacks: primedBlast,
      primedMagneticStacks: primedMagnetic,
      primedHeatStrip,
      armorStripPct,
    };
  }, [
    targetActive,
    activePrimingCount,
    primedViral,
    primedCorrosive,
    primedBlast,
    primedMagnetic,
    primedHeatStrip,
    armorStripPct,
  ]);

  const resolvedSimParams = useMemo(() => {
    const base = scenarioSimParams(scenario);
    return {
      ...base,
      activeWeaponAbilityBuffs: activeAbilityBuffs,
      applyHeadshots: applyHeadshots || base.applyHeadshots,
      applyTriggerBuffs: applyTriggerBuffs || base.applyTriggerBuffs,
      targetFaction: targetActive ? enemy.faction : base.targetFaction,
      ...(passiveYareliOverride != null ? { applyYareliCriticalFlow: passiveYareliOverride } : {}),
      ...(passiveZephyrOverride != null ? { applyZephyrAirborne: passiveZephyrOverride } : {}),
      ...(passiveGarudaOverride != null ? { applyGarudaDeathsGate: passiveGarudaOverride } : {}),
      ...(tenaciousBondOverride != null ? { applyTenaciousBondCrit: tenaciousBondOverride } : {}),
      ...(reinforcedBondOverride != null
        ? { applyReinforcedBondFireRate: reinforcedBondOverride }
        : {}),
      ...(Object.keys(wfArcaneOverrides).length > 0
        ? { arcaneStacksById: wfArcaneOverrides }
        : {}),
      ...(Object.keys(wfModOverrides).length > 0
        ? { conditionalModStacksById: wfModOverrides }
        : {}),
    };
  }, [
    scenario,
    activeAbilityBuffs,
    applyHeadshots,
    applyTriggerBuffs,
    targetActive,
    enemy.faction,
    passiveYareliOverride,
    passiveZephyrOverride,
    passiveGarudaOverride,
    tenaciousBondOverride,
    reinforcedBondOverride,
    wfArcaneOverrides,
    wfModOverrides,
  ]);

  const stats = useMemo((): LoadoutStatsResult | null => {
    try {
      return calcLoadoutStats(loadout, {
        simParams: resolvedSimParams,
        allWeapons,
        enemy: targetActive ? enemy : null,
        enemyLevel: targetActive ? enemyLevel : undefined,
        steelPath: targetActive ? steelPath : undefined,
        enemyPriming,
      });
    } catch (err) {
      console.warn("Loadout damage estimate failed", err);
      return null;
    }
  }, [loadout, resolvedSimParams, enemy, enemyLevel, steelPath, allWeapons, targetActive, enemyPriming]);

  const wfStrength = stats?.warframe?.stats?.abilityStrength ?? 1;
  const activeAbilityStripPct = useMemo(() => {
    return computeLoadoutAbilityArmorStripPct(
      abilityBuffOptions,
      wfStrength,
      activeAbilityBuffs,
    );
  }, [abilityBuffOptions, wfStrength, activeAbilityBuffs]);

  const best = useMemo(() => {
    if (!stats) return null;
    try {
      return bestSustainedDps(stats);
    } catch (err) {
      console.warn("Loadout best DPS failed", err);
      return null;
    }
  }, [stats]);
  const showTtk = targetActive;

  if (!stats) return null;

  const hasAnyWeapon =
    stats.primary || stats.secondary || stats.melee || stats.exalted || stats.exaltedMelee;

  if (!stats.warframe && !hasAnyWeapon && !stats.companion) {
    return null;
  }

  const isPaperScenario = scenario === "paper";
  const hasConditionalToggles =
    wfFamily === "yareli" ||
    wfFamily === "zephyr" ||
    wfFamily === "garuda" ||
    hasTenaciousBond ||
    hasReinforcedBond ||
    toggleableWarframeArcanes.length > 0 ||
    toggleableWarframeMods.length > 0;

  return (
    <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
      <div className="px-4 py-3 border-b border-amber-500/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-700 dark:text-amber-400" />
          <span className="text-sm font-semibold">Loadout Combat &amp; TTK</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(SCENARIO_LABELS) as DamageScenario[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setScenario(key);
                setPassiveYareliOverride(null);
                setPassiveZephyrOverride(null);
                setPassiveGarudaOverride(null);
                setTenaciousBondOverride(null);
                setReinforcedBondOverride(null);
                setWfArcaneOverrides({});
                setWfModOverrides({});
              }}
              className={cn(
                "inline-flex min-h-9 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                scenario === key
                  ? "border-amber-500/50 bg-amber-500/15 text-amber-900 dark:text-amber-200"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              {SCENARIO_LABELS[key]}
            </button>
          ))}
          {scenario !== "vsEnemy" && (
            <button
              type="button"
              onClick={() => setEnableTargetSim((v) => !v)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1 px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                enableTargetSim
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
              )}
              title="Enable enemy target, TTK, and debuff priming on top of the selected stack preset."
            >
              <Target className="h-3 w-3" />
              Target &amp; Priming
              {activePrimingCount > 0 && ` (${activePrimingCount})`}
            </button>
          )}
        </div>
      </div>

      {targetActive && (
        <div className="px-4 py-2.5 border-b border-border/40 space-y-2.5 bg-card/30">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] text-muted-foreground block mb-0.5">Enemy Target</label>
              <select
                value={enemyId}
                onChange={(e) => setEnemyId(e.target.value)}
                className="w-full min-h-9 bg-background border border-border rounded-md px-2 py-1 text-xs"
              >
                {ENEMY_TYPES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.faction} — {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1 max-w-[12rem]">
              <EnemyLevelControl
                value={enemyLevel}
                onChange={setEnemyLevel}
                steelPath={steelPath}
                onSteelPathChange={setSteelPath}
              />
            </div>
            <label className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-[10px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={applyHeadshots}
                onChange={(e) => setApplyHeadshots(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-amber-500"
              />
              Headshots
            </label>
            <label
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-[10px] text-muted-foreground cursor-pointer"
              title="Enable short on-equip / while-aiming / on-reload buffs (Vigorous Swap, Holster Amp, Argon Scope, Bladed Rounds)"
            >
              <input
                type="checkbox"
                checked={applyTriggerBuffs || scenario === "fullRamp"}
                onChange={(e) => setApplyTriggerBuffs(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-border accent-amber-500"
              />
              Swap / Trigger
            </label>
            <button
              type="button"
              onClick={() => setShowPriming((v) => !v)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1 rounded-md border px-2.5 py-1 text-[10px] transition-colors",
                showPriming || activePrimingCount > 0
                  ? "border-teal-500/50 bg-teal-500/15 text-teal-900 dark:text-teal-200"
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              <Flame className="h-3 w-3" />
              Debuffs &amp; Priming
              {activePrimingCount > 0 ? ` (${activePrimingCount})` : ""}
            </button>
          </div>

          {(showPriming || activePrimingCount > 0) && (
            <div className="rounded-lg border border-border/50 bg-background/50 p-2.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                  PRE-APPLIED ENEMY DEBUFFS (TTK + CO STATUSES)
                </span>
                {activePrimingCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPrimedViral(0);
                      setPrimedCorrosive(0);
                      setPrimedBlast(0);
                      setPrimedMagnetic(0);
                      setPrimedHeatStrip(false);
                      setArmorStripPct(0);
                    }}
                    className="text-[10px] text-muted-foreground hover:text-foreground underline"
                  >
                    Clear debuffs
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label className="text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Viral stacks</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400">{primedViral}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={primedViral}
                    onChange={(e) => setPrimedViral(Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </label>
                <label className="text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Corrosive stacks</span>
                    <span className="font-mono text-lime-600 dark:text-lime-400">{primedCorrosive}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={primedCorrosive}
                    onChange={(e) => setPrimedCorrosive(Number(e.target.value))}
                    className="w-full accent-lime-500"
                  />
                </label>
                <label
                  className="text-[10px] text-muted-foreground"
                  title="Pre-existing Blast stacks in fuse window. Reaching 10 stacks triggers instant 300% detonation; Status Duration stretches the 1.5s fuse."
                >
                  <div className="flex justify-between">
                    <span>Blast stacks (fuse)</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">{primedBlast}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={primedBlast}
                    onChange={(e) => setPrimedBlast(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </label>
                <label className="text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Magnetic stacks</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{primedMagnetic}/10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={primedMagnetic}
                    onChange={(e) => setPrimedMagnetic(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </label>
                <label className="text-[10px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Armor strip</span>
                    <span className="font-mono text-red-600 dark:text-red-400">
                      {Math.min(100, armorStripPct + activeAbilityStripPct)}%
                      {activeAbilityStripPct > 0 && (
                        <span className="text-[9px] opacity-80"> ({activeAbilityStripPct}% abilities)</span>
                      )}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={armorStripPct}
                    onChange={(e) => setArmorStripPct(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer self-end pb-1">
                  <input
                    type="checkbox"
                    checked={primedHeatStrip}
                    onChange={(e) => setPrimedHeatStrip(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border accent-orange-500"
                  />
                  <span>Heat 50% armor strip</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {(abilityBuffOptions.length > 0 || hasConditionalToggles) && (
        <div className="px-4 py-2 border-b border-border/40 bg-card/20 space-y-2">
          {abilityBuffOptions.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Active buffs &amp; enemy debuffs (warframe abilities)</p>
              <div className="flex flex-wrap gap-1.5">
                {abilityBuffOptions.map((ability) => {
                  const active = activeAbilityBuffs.includes(ability.name);
                  const badge = formatAbilityBuffDebuffBadge(
                    ability,
                    wfStrength,
                    loadout.warframeBuild?.warframeId,
                  );
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
                        "inline-flex min-h-9 items-center gap-1 px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                        active
                          ? "border-purple-500/50 bg-purple-500/15 text-purple-900 dark:text-purple-200"
                          : "border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                      title={ability.description}
                    >
                      <span>{ability.name}</span>
                      {badge && (
                        <span
                          className={cn(
                            "opacity-75 font-mono text-[9px]",
                            badge.includes("armor") && "text-red-700 dark:text-red-400 font-semibold",
                            badge.includes("vuln") && "text-amber-800 dark:text-amber-400 font-semibold",
                          )}
                        >
                          ({badge})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasConditionalToggles && (
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">Passives, arcanes &amp; conditionals</p>
              <div className="flex flex-wrap gap-1.5">
                {wfFamily === "yareli" && (
                  <button
                    type="button"
                    onClick={() =>
                      setPassiveYareliOverride(!resolvedSimParams.applyYareliCriticalFlow)
                    }
                    className={cn(
                      "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                      resolvedSimParams.applyYareliCriticalFlow
                        ? "border-sky-500/50 bg-sky-500/15 text-sky-900 dark:text-sky-200"
                        : "border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Critical Flow (+200% Sec CC)
                  </button>
                )}
                {wfFamily === "zephyr" && (
                  <button
                    type="button"
                    onClick={() =>
                      setPassiveZephyrOverride(!resolvedSimParams.applyZephyrAirborne)
                    }
                    className={cn(
                      "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                      resolvedSimParams.applyZephyrAirborne
                        ? "border-sky-500/50 bg-sky-500/15 text-sky-900 dark:text-sky-200"
                        : "border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Airborne (+150% CC)
                  </button>
                )}
                {wfFamily === "garuda" && (
                  <button
                    type="button"
                    onClick={() =>
                      setPassiveGarudaOverride(!resolvedSimParams.applyGarudaDeathsGate)
                    }
                    className={cn(
                      "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                      resolvedSimParams.applyGarudaDeathsGate
                        ? "border-sky-500/50 bg-sky-500/15 text-sky-900 dark:text-sky-200"
                        : "border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Death&apos;s Gate (+100% Dmg)
                  </button>
                )}
                {hasTenaciousBond && (
                  <button
                    type="button"
                    onClick={() =>
                      setTenaciousBondOverride(
                        resolvedSimParams.applyTenaciousBondCrit === false,
                      )
                    }
                    className={cn(
                      "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                      resolvedSimParams.applyTenaciousBondCrit !== false
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200"
                        : "border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Tenacious Bond (+1.2× CD)
                  </button>
                )}
                {hasReinforcedBond && (
                  <button
                    type="button"
                    onClick={() =>
                      setReinforcedBondOverride(
                        resolvedSimParams.applyReinforcedBondFireRate === false,
                      )
                    }
                    className={cn(
                      "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                      resolvedSimParams.applyReinforcedBondFireRate !== false
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200"
                        : "border-border/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Reinforced Bond (+60% FR)
                  </button>
                )}
                {toggleableWarframeArcanes.map((arc) => {
                  const defaultStacks = isPaperScenario ? 0 : arc.fullStacks;
                  const currentStacks = wfArcaneOverrides[arc.id] ?? defaultStacks;
                  const active = currentStacks > 0;
                  return (
                    <button
                      key={arc.id}
                      type="button"
                      onClick={() =>
                        setWfArcaneOverrides((prev) => ({
                          ...prev,
                          [arc.id]: active ? 0 : arc.fullStacks,
                        }))
                      }
                      className={cn(
                        "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                        active
                          ? "border-purple-500/50 bg-purple-500/15 text-purple-900 dark:text-purple-200"
                          : "border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                      title={`Toggle ${arc.name} conditional/stacking effect on loadout stats.`}
                    >
                      {arc.name}
                      {arc.fullStacks > 1 ? ` (${active ? `×${currentStacks}` : "off"})` : ""}
                    </button>
                  );
                })}
                {toggleableWarframeMods.map((mod) => {
                  const defaultStacks = isPaperScenario ? 0 : mod.maxStacks;
                  const currentStacks = wfModOverrides[mod.id] ?? defaultStacks;
                  const active = currentStacks > 0;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() =>
                        setWfModOverrides((prev) => ({
                          ...prev,
                          [mod.id]: active ? 0 : mod.maxStacks,
                        }))
                      }
                      className={cn(
                        "inline-flex min-h-8 items-center px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                        active
                          ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-900 dark:text-indigo-200"
                          : "border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                      title={`Toggle ${mod.label} conditional buff on Warframe stats.`}
                    >
                      {mod.label}
                      {mod.maxStacks > 1 ? ` (${active ? `×${currentStacks}` : "off"})` : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {best && (
        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-border/30 px-4 py-2 text-xs text-muted-foreground">
          <Target className="h-3.5 w-3.5 shrink-0 text-amber-700/80 dark:text-amber-400/80" />
          <span className="min-w-0">
            Best sustained: <span className="font-medium text-foreground">{best.slot}</span> ({best.name}) —{" "}
            <span className="font-mono text-amber-800 dark:text-amber-300">{fmtDamageNum(best.sustainedDps)}</span>
            {showTtk && (
              <span className="ml-1 text-[10px]">
                vs {enemy.name} L{enemyLevel}
                {steelPath ? " SP" : ""}
              </span>
            )}
          </span>
        </div>
      )}

      <div className="p-3 space-y-2">
        {stats.warframe && (
          <div className="border border-purple-500/25 rounded-lg px-3 py-2 bg-purple-500/[0.06]">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-purple-700 dark:text-purple-400" />
                <span className="text-xs font-medium">{stats.warframe.name}</span>
              </div>
              {(stats.warframe.stats.parkourVelocityBonus ?? 0) > 0 && (
                <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400">
                  Parkour +{((stats.warframe.stats.parkourVelocityBonus ?? 0) * 100).toFixed(0)}%
                </span>
              )}
            </div>
            {stats.warframe.forms ? (
              <div className="space-y-2">
                {stats.warframe.forms.map((form) => (
                  <div key={form.id} className="rounded-md border border-purple-500/15 bg-background/30 px-2 py-1.5">
                    <p className="text-[10px] font-semibold text-purple-800/90 mb-1 dark:text-purple-300/90">{form.label}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-6">
                      {loadoutCombatStatCells(form.stats).map((cell) => (
                        <MiniStat key={cell.label} label={cell.label} value={cell.value} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-6">
                {loadoutCombatStatCells(stats.warframe.stats).map((cell) => (
                  <MiniStat key={cell.label} label={cell.label} value={cell.value} />
                ))}
              </div>
            )}
          </div>
        )}

        <WeaponRow label="Primary" icon={<Crosshair className="h-3.5 w-3.5" />} color="text-blue-700 dark:text-blue-400" entry={stats.primary} showTtk={showTtk} />
        <WeaponRow label="Secondary" icon={<Crosshair className="h-3.5 w-3.5" />} color="text-cyan-700 dark:text-cyan-400" entry={stats.secondary} showTtk={showTtk} />
        <WeaponRow label="Melee" icon={<Swords className="h-3.5 w-3.5" />} color="text-orange-700 dark:text-orange-400" entry={stats.melee} showTtk={showTtk} />
        <WeaponRow label="Exalted" icon={<Sparkles className="h-3.5 w-3.5" />} color="text-violet-700 dark:text-violet-400" entry={stats.exalted} showTtk={showTtk} />
        <WeaponRow
          label="Exalted Melee"
          icon={<Sparkles className="h-3.5 w-3.5" />}
          color="text-fuchsia-700 dark:text-fuchsia-400"
          entry={stats.exaltedMelee}
          showTtk={showTtk}
        />

        {stats.companion && (
          <div className="border border-green-500/25 rounded-lg overflow-hidden bg-green-500/[0.04]">
            <div className="px-3 py-2 flex items-center gap-2">
              <Dog className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
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
                <StatLine
                  label="Crit"
                  value={`${((stats.companion.weapon.stats.criticalChance ?? 0) * 100).toFixed(1)}% / ${(stats.companion.weapon.stats.criticalMultiplier ?? 0).toFixed(1)}x`}
                />
                <StatLine
                  label="Status"
                  value={`${((stats.companion.weapon.stats.statusChance ?? 0) * 100).toFixed(1)}%`}
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
        Estimates combine Warframe ability buffs, cross-slot mods/arcanes/bonds, and scenario stacks ({SCENARIO_LABELS[scenario].toLowerCase()}).
        {!targetActive && " Click Target & Priming or vs Enemy to model TTK and pre-applied Viral / Blast / Armor Strip debuffs."}
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
