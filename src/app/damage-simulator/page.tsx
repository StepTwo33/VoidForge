"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/utils";
import { Crosshair, Shield, Heart, Flame, Plus, X, ChevronDown, ChevronRight, Zap, FolderOpen } from "lucide-react";
import {
  EnemyType, ENEMY_TYPES,
  HEALTH_MODIFIERS, ARMOR_MODIFIERS, SHIELD_MODIFIERS,
  getMod,
} from "@/lib/calc/ttk";
import { getSavedBuilds, getCloudBuilds, type SavedBuild } from "@/lib/builds/build-storage";
import { calcSavedWeaponBuildStats } from "@/lib/builds/loadout-stats";
import { calculatedStatsToSimInputs } from "@/lib/calc/damage-sim-load";
import { runDamageSim, type DamageSimResult } from "@/lib/calc/damage-sim";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";
import { EnemyLevelControl } from "@/components/enemy-level-control";

const FACTION_COLORS: Record<string, string> = {
  Grineer: "#FF6B35", Corpus: "#00B4D8", Infested: "#2ECC71",
  Corrupted: "#9B59B6", Stalker: "#E91E63",
};

const ELEMENT_COLORS: Record<string, string> = {
  impact: "#94a3b8", puncture: "#a8a29e", slash: "#f87171",
  heat: "#fb923c", cold: "#67e8f9", toxin: "#4ade80", electricity: "#93c5fd",
  blast: "#facc15", corrosive: "#a3e635", gas: "#6ee7b7", magnetic: "#a5b4fc",
  radiation: "#fcd34d", viral: "#5eead4",
};

const DAMAGE_TYPES = [
  { key: "impact", label: "Impact" }, { key: "puncture", label: "Puncture" }, { key: "slash", label: "Slash" },
  { key: "heat", label: "Heat" }, { key: "cold", label: "Cold" }, { key: "toxin", label: "Toxin" },
  { key: "electricity", label: "Electricity" }, { key: "blast", label: "Blast" },
  { key: "corrosive", label: "Corrosive" }, { key: "gas", label: "Gas" },
  { key: "magnetic", label: "Magnetic" }, { key: "radiation", label: "Radiation" }, { key: "viral", label: "Viral" },
];

function InputField({ label, value, onChange, step, min, suffix }: {
  label: string; value: number; onChange: (v: number) => void;
  step?: number; min?: number; suffix?: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground block mb-0.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          step={step ?? 1}
          min={min ?? 0}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-background border border-border rounded px-2 py-1 text-xs font-mono"
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, color, bold, tooltip }: {
  label: string; value: string; color?: string; bold?: boolean; tooltip?: string;
}) {
  return (
    <div className="flex justify-between items-center py-0.5" title={tooltip}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-xs font-mono", color, bold && "font-bold")}>{value}</span>
    </div>
  );
}

function Section({ title, icon, children, defaultOpen }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {icon}
        {title}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function fmt(n: number): string {
  if (n === Infinity || isNaN(n)) return "∞";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(n < 10 ? 2 : 0);
}

export default function DamageSimulatorPage() {
  // Weapon stats
  const [dmgTypes, setDmgTypes] = useState<Record<string, number>>({ impact: 50, puncture: 50, slash: 100 });
  const [fireRate, setFireRate] = useState(5);
  const [critChance, setCritChance] = useState(0.3);
  const [critMulti, setCritMulti] = useState(2.2);
  const [multishot, setMultishot] = useState(1);
  const [statusChance, setStatusChance] = useState(0.3);
  const [magazine, setMagazine] = useState(30);
  const [reloadTime, setReloadTime] = useState(2);
  const [addingType, setAddingType] = useState("");
  const [statusDamageBonus, setStatusDamageBonus] = useState(0);
  const [headshotDamageBonus, setHeadshotDamageBonus] = useState(0);
  const [factionBonuses, setFactionBonuses] = useState<Record<string, number>>({});
  const [applyHeadshots, setApplyHeadshots] = useState(false);
  /** Latron Flensing Spikes — loaded from builds; 0.2 = −20% armor per Puncture stack. */
  const [punctureArmorStripPerStack, setPunctureArmorStripPerStack] = useState(0);
  const [loadedBuildLabel, setLoadedBuildLabel] = useState<string | null>(null);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);

  // Enemy
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyType | null>(null);
  const [enemyLevel, setEnemyLevel] = useState(100);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = getSavedBuilds("weapon");
      let cloud: SavedBuild[] = [];
      try {
        cloud = await getCloudBuilds("weapon");
      } catch {
        /* offline / signed out */
      }
      if (cancelled) return;
      const byId = new Map<string, SavedBuild>();
      for (const b of [...local, ...cloud]) byId.set(b.id, b);
      setSavedBuilds(
        Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 40),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadFromBuild = useCallback((build: SavedBuild) => {
    const data = build.data as {
      weaponId?: string;
      mods?: { modId: string; rank: number; slotIndex: number }[];
      arcaneIds?: (string | null)[];
      progenitorElement?: string;
      progenitorBonusPercent?: number;
      incarnonEvolutions?: Record<number, number>;
    };
    if (!data?.weaponId) return;
    const entry = calcSavedWeaponBuildStats(
      {
        weaponId: data.weaponId,
        mods: data.mods ?? [],
        arcaneIds: data.arcaneIds,
        progenitorElement: data.progenitorElement,
        progenitorBonusPercent: data.progenitorBonusPercent,
        incarnonEvolutions: data.incarnonEvolutions,
      },
      { ...DEFAULT_SIM_PARAMS, killStacks: 5, statusTypesOnTarget: 3, arcaneStacks: 12 },
    );
    if (!entry) return;
    const inputs = calculatedStatsToSimInputs(entry.stats);
    setDmgTypes(inputs.dmgTypes);
    setFireRate(inputs.fireRate);
    setCritChance(inputs.critChance);
    setCritMulti(inputs.critMulti);
    setMultishot(inputs.multishot);
    setStatusChance(inputs.statusChance);
    setMagazine(inputs.magazine);
    setReloadTime(inputs.reloadTime);
    setStatusDamageBonus(inputs.statusDamageBonus);
    setHeadshotDamageBonus(inputs.headshotDamageBonus);
    setFactionBonuses(inputs.factionBonuses);
    setPunctureArmorStripPerStack(inputs.punctureArmorStripPerStack ?? 0);
    setLoadedBuildLabel(`${build.name} (${entry.name})`);
  }, []);

  const factions = useMemo(() => ["all", ...new Set(ENEMY_TYPES.map((e) => e.faction))], []);
  const filteredEnemies = selectedFaction && selectedFaction !== "all"
    ? ENEMY_TYPES.filter((e) => e.faction === selectedFaction)
    : ENEMY_TYPES;

  const totalRaw = useMemo(() => Object.values(dmgTypes).reduce((s, v) => s + v, 0), [dmgTypes]);

  const sim = useMemo((): DamageSimResult | null => {
    if (!selectedEnemy || totalRaw <= 0) return null;
    return runDamageSim(
      {
        dmgTypes,
        fireRate,
        critChance,
        critMulti,
        multishot,
        statusChance,
        magazine,
        reloadTime,
        statusDamageBonus,
        headshotDamageBonus,
        factionBonuses,
        applyHeadshots,
        punctureArmorStripPerStack:
          punctureArmorStripPerStack > 0 ? punctureArmorStripPerStack : undefined,
      },
      selectedEnemy,
      enemyLevel,
    );
  }, [
    selectedEnemy, enemyLevel, dmgTypes, totalRaw, fireRate, critChance, critMulti,
    multishot, statusChance, magazine, reloadTime, statusDamageBonus, headshotDamageBonus,
    factionBonuses, applyHeadshots, punctureArmorStripPerStack,
  ]);

  const setDmg = (type: string, val: number) => setDmgTypes((prev) => ({ ...prev, [type]: val }));
  const removeDmg = (type: string) => setDmgTypes((prev) => { const n = { ...prev }; delete n[type]; return n; });

  const unusedTypes = DAMAGE_TYPES.filter((t) => !(t.key in dmgTypes));

  return (
    <PageShell>
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg sm:text-2xl font-bold mb-2 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Damage Simulator
          </h1>
          <p className="text-xs text-muted-foreground mb-6 max-w-2xl">
            Enter stats by hand or load a saved weapon build. TTK uses the same discrete engine as the Arsenal
            (post-U32 enemy armor DR = 0.9×AR/2700, Viral/Corrosive stacking, Elementalist, Bane, optional headshots).
          </p>

          <div className="grid lg:grid-cols-[1fr_420px] gap-6">
            {/* Left: Inputs */}
            <div className="space-y-4">
              <Section title="LOAD FROM BUILD" icon={<FolderOpen className="h-3.5 w-3.5" />} defaultOpen>
                {savedBuilds.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No saved weapon builds found. Save one in the Weapon Builder (local or account), then return here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <select
                      className="w-full h-9 rounded-lg border border-border bg-background px-2 text-xs"
                      defaultValue=""
                      onChange={(e) => {
                        const b = savedBuilds.find((x) => x.id === e.target.value);
                        if (b) loadFromBuild(b);
                      }}
                    >
                      <option value="">Select a weapon build…</option>
                      {savedBuilds.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    {loadedBuildLabel && (
                      <p className="text-[11px] text-cyan-400">
                        Loaded: {loadedBuildLabel}
                        {(statusDamageBonus > 0 || Object.keys(factionBonuses).length > 0) && (
                          <span className="text-muted-foreground">
                            {" "}
                            · status dmg +{(statusDamageBonus * 100).toFixed(0)}%
                            {Object.keys(factionBonuses).length > 0 && " · faction mods active"}
                          </span>
                        )}
                      </p>
                    )}
                    <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyHeadshots}
                        onChange={(e) => setApplyHeadshots(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-border accent-primary"
                      />
                      Headshots (2× × Acuity bonuses from build)
                    </label>
                  </div>
                )}
              </Section>

              {/* Weapon Core Stats */}
              <Section title="WEAPON STATS" icon={<Crosshair className="h-3.5 w-3.5" />}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <InputField label="Fire Rate" value={fireRate} onChange={setFireRate} step={0.1} />
                  <InputField label="Crit Chance" value={critChance} onChange={setCritChance} step={0.01} />
                  <InputField label="Crit Multi" value={critMulti} onChange={setCritMulti} step={0.1} suffix="x" />
                  <InputField label="Multishot" value={multishot} onChange={setMultishot} step={0.1} />
                  <InputField label="Status Chance" value={statusChance} onChange={setStatusChance} step={0.01} />
                  <InputField label="Magazine" value={magazine} onChange={setMagazine} step={1} />
                  <InputField label="Reload (s)" value={reloadTime} onChange={setReloadTime} step={0.1} />
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">Total Damage</label>
                    <div className="bg-muted/30 border border-border rounded px-2 py-1 text-xs font-mono font-bold text-primary">
                      {totalRaw.toFixed(1)}
                    </div>
                  </div>
                </div>
              </Section>

              {/* Damage Type Breakdown */}
              <Section title="DAMAGE TYPES" icon={<Flame className="h-3.5 w-3.5" />}>
                <div className="space-y-1.5">
                  {Object.entries(dmgTypes).map(([type, val]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: ELEMENT_COLORS[type] || "#888" }}
                      />
                      <span className="text-xs font-medium w-20 capitalize" style={{ color: ELEMENT_COLORS[type] }}>{type}</span>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => setDmg(type, parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs font-mono"
                      />
                      <span className="text-[10px] text-muted-foreground w-10 text-right">
                        {totalRaw > 0 ? `${((val / totalRaw) * 100).toFixed(0)}%` : "0%"}
                      </span>
                      <button onClick={() => removeDmg(type)} className="text-red-400/60 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {unusedTypes.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <select
                      value={addingType}
                      onChange={(e) => setAddingType(e.target.value)}
                      className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs"
                    >
                      <option value="">Add element...</option>
                      {unusedTypes.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                    <button
                      onClick={() => { if (addingType) { setDmg(addingType, 100); setAddingType(""); } }}
                      disabled={!addingType}
                      className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground disabled:opacity-40"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </Section>

              {/* Enemy Selection */}
              <Section title="ENEMY TARGET" icon={<Shield className="h-3.5 w-3.5" />}>
                <div className="flex gap-1 mb-2 flex-wrap">
                  {factions.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFaction(f === "all" ? null : f)}
                      className={cn(
                        "px-2 py-0.5 text-[10px] rounded border transition-colors capitalize",
                        (f === "all" && !selectedFaction) || selectedFaction === f
                          ? "border-primary text-primary bg-primary/10"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="space-y-0.5 max-h-40 overflow-y-auto">
                  {filteredEnemies.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEnemy(e)}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-lg border text-xs transition-all",
                        selectedEnemy?.id === e.id ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/30"
                      )}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{e.name}</span>
                        <span className="text-[9px]" style={{ color: FACTION_COLORS[e.faction] }}>{e.faction}</span>
                      </div>
                      <div className="flex gap-3 text-[9px] text-muted-foreground mt-0.5">
                        <span>HP {e.baseHealth}</span>
                        {e.baseShield > 0 && <span>SH {e.baseShield}</span>}
                        {e.baseArmor > 0 && <span>AR {e.baseArmor}</span>}
                        <span className="text-muted-foreground/50">{e.healthType} / {e.armorType !== "none" ? e.armorType : "–"}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedEnemy && (
                  <div className="mt-3 min-w-0">
                    <EnemyLevelControl value={enemyLevel} onChange={setEnemyLevel} />
                  </div>
                )}
              </Section>
            </div>

            {/* Right: Results */}
            <div className="space-y-4">
              {selectedEnemy && sim && (
                <>
                  {/* Enemy Scaled Stats */}
                  <Section title={`${selectedEnemy.name} Lv.${enemyLevel}`} icon={<Heart className="h-3.5 w-3.5 text-red-400" />}>
                    <ResultRow label="Health" value={fmt(sim.hp)} color="text-red-400" />
                    {sim.shield > 0 && <ResultRow label="Shield" value={fmt(sim.shield)} color="text-cyan-300" />}
                    {sim.baseArmor > 0 && (
                      <ResultRow
                        label="Armor"
                        value={`${fmt(sim.armor)} (${(sim.armorDR * 100).toFixed(1)}% DR)`}
                        color="text-yellow-400"
                        tooltip="Enemy DR = 0.9 × net armor / 2700 (capped 90%). Not the Tenno armor/(armor+300) formula."
                      />
                    )}
                    {sim.baseArmor > 0 && sim.corrosiveStrippedArmor < sim.baseArmor - 0.5 && (
                      <ResultRow
                        label="Armor before strip"
                        value={fmt(sim.baseArmor)}
                        color="text-yellow-400/70"
                      />
                    )}
                    <ResultRow label="Effective HP" value={fmt(sim.effectiveHP)} bold color="text-primary" />
                    <div className="text-[9px] text-muted-foreground/60 mt-1">
                      {selectedEnemy.healthType} health · {selectedEnemy.armorType !== "none" ? `${selectedEnemy.armorType} armor` : "no armor"} · {selectedEnemy.shieldType !== "none" ? `${selectedEnemy.shieldType} shields` : "no shields"}
                    </div>
                  </Section>

                  {/* Per-Type Damage Breakdown */}
                  <Section title="DAMAGE BREAKDOWN" icon={<Flame className="h-3.5 w-3.5" />} defaultOpen={false}>
                    <div className="text-[9px] text-muted-foreground mb-2 grid grid-cols-4 gap-1">
                      <span>Type</span><span className="text-right">Raw</span>
                      <span className="text-right">vs Shield</span><span className="text-right">vs Health</span>
                    </div>
                    {sim.typeBreakdown.map((t) => (
                      <div key={t.type} className="grid grid-cols-4 gap-1 py-0.5 text-[10px]">
                        <span className="capitalize font-medium" style={{ color: ELEMENT_COLORS[t.type] }}>{t.type}</span>
                        <span className="text-right font-mono">{t.raw.toFixed(0)}</span>
                        <span className="text-right font-mono text-cyan-300">{t.vsShield.toFixed(0)}</span>
                        <span className="text-right font-mono text-red-300">{t.vsHealth.toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border/50 mt-1 pt-1 grid grid-cols-4 gap-1 text-[10px] font-bold">
                      <span>Total</span>
                      <span className="text-right font-mono">{totalRaw.toFixed(0)}</span>
                      <span className="text-right font-mono text-cyan-300">{sim.typeBreakdown.reduce((s, t) => s + t.vsShield, 0).toFixed(0)}</span>
                      <span className="text-right font-mono text-red-300">{sim.typeBreakdown.reduce((s, t) => s + t.vsHealth, 0).toFixed(0)}</span>
                    </div>
                  </Section>

                  {/* Per-Shot Calculations */}
                  <Section title="PER-SHOT" icon={<Crosshair className="h-3.5 w-3.5" />}>
                    <ResultRow label="Avg Crit Multiplier" value={`${sim.avgCrit.toFixed(2)}x`} />
                    <ResultRow label={`Multishot × ${multishot.toFixed(1)}`} value={`${multishot > 1 ? multishot.toFixed(1) + " pellets" : "1 pellet"}`} />
                    <ResultRow label="Raw / Shot" value={fmt(sim.rawPerShot)} />
                    {sim.shield > 0 && <ResultRow label="vs Shield / Shot" value={fmt(sim.shieldDmgPerShot)} color="text-cyan-300" />}
                    <ResultRow label="vs Health / Shot" value={fmt(sim.healthDmgPerShot)} color="text-red-300" bold />
                  </Section>

                  {/* Status Effects */}
                  {sim.procsPerSec > 0 && (
                    <Section title="STATUS EFFECTS" icon={<Zap className="h-3.5 w-3.5" />} defaultOpen={false}>
                      <ResultRow label="Procs / Sec" value={sim.procsPerSec.toFixed(1)} color="text-teal-400" />
                      {sim.viralMult > 1 && (
                        <ResultRow label="Viral Multiplier" value={`${sim.viralMult.toFixed(2)}x health dmg`} color="text-teal-300"
                          tooltip="Stack 1: +100% health dmg, stacks 2–10: +25% each (max 4.25×). Uses discrete peak stacks when available." />
                      )}
                      {sim.baseArmor > 0 && sim.corrosiveStrippedArmor < sim.baseArmor - 0.5 && (
                        <ResultRow label="Corrosive Strip" value={`${fmt(sim.baseArmor)} → ${fmt(sim.corrosiveStrippedArmor)}`} color="text-lime-400"
                          tooltip="Stack 1: −26% armor; stacks 2–10: −6% each of original (max −80% at 10). Heat strip (−50%) applied when Heat procs." />
                      )}
                      <div className="border-t border-border/50 mt-1 pt-1" />
                      {sim.slashDotDps > 0 && <ResultRow label="Slash DoT DPS" value={fmt(sim.slashDotDps)} color="text-red-300"
                        tooltip="35% base/tick, 7 ticks over 6s, bypasses armor" />}
                      {sim.heatDotDps > 0 && <ResultRow label="Heat DoT DPS" value={fmt(sim.heatDotDps)} color="text-orange-300"
                        tooltip="50% base/tick, reduced by enemy armor DR (0.9×AR/2700)" />}
                      {sim.toxinDotDps > 0 && <ResultRow label="Toxin DoT DPS" value={fmt(sim.toxinDotDps)} color="text-green-300"
                        tooltip="50% base/tick, bypasses shields; reduced by armor DR on health" />}
                      {sim.totalDotDps > 0 && <ResultRow label="Total DoT DPS" value={fmt(sim.totalDotDps)} bold color="text-teal-400" />}
                    </Section>
                  )}

                  {/* DPS & TTK */}
                  <Section title="DPS & TIME TO KILL">
                    <ResultRow label="Burst DPS (vs Health)" value={fmt(sim.burstDps)} bold color="text-amber-300" />
                    <ResultRow label="Sustained DPS" value={fmt(sim.sustainedDps)} bold color="text-amber-300"
                      tooltip={`Accounts for ${reloadTime}s reload every ${magazine} shots`} />
                    {sim.totalDotDps > 0 && (
                      <ResultRow label="↳ incl. DoT DPS" value={fmt(sim.totalDotDps)} color="text-teal-400" />
                    )}
                    <div className="border-t border-border/50 my-1" />
                    {sim.shieldTime > 0 && <ResultRow label="Shield Phase" value={`${sim.shieldTime.toFixed(2)}s`} color="text-cyan-300" />}
                    <ResultRow label="Health Phase" value={sim.healthTime === Infinity ? "∞" : `${sim.healthTime.toFixed(2)}s`} color="text-red-300" />
                    <div className="border-t border-border/50 my-1" />
                    <ResultRow label="Time to Kill" value={sim.ttk === Infinity ? "∞" : sim.ttk < 0.01 ? "<0.01s" : `${sim.ttk.toFixed(2)}s`}
                      bold color={sim.ttk < 1 ? "text-green-400" : sim.ttk < 5 ? "text-yellow-400" : sim.ttk < 15 ? "text-orange-400" : "text-red-400"}
                      tooltip="Discrete shot-by-shot sim (same as Arsenal TTK) — not the continuous paper estimate." />
                    <ResultRow label="Shots to Kill" value={sim.shotsToKill === Infinity ? "∞" : sim.shotsToKill.toLocaleString()} bold />
                    {magazine > 0 && (
                      <ResultRow label="Magazines Needed" value={Math.ceil(sim.shotsToKill / magazine).toString()} />
                    )}
                  </Section>

                  {/* Type matchup reference */}
                  <Section title="TYPE MATCHUPS" defaultOpen={false}>
                    <div className="space-y-0.5">
                      {Object.entries(dmgTypes).filter(([, v]) => v > 0).map(([type]) => {
                        const hm = getMod(HEALTH_MODIFIERS, selectedEnemy.healthType, type);
                        const am = selectedEnemy.armorType !== "none" ? getMod(ARMOR_MODIFIERS, selectedEnemy.armorType, type) : 0;
                        const sm = selectedEnemy.shieldType !== "none" ? getMod(SHIELD_MODIFIERS, selectedEnemy.shieldType, type) : 0;
                        return (
                          <div key={type} className="flex items-center gap-1 text-[10px]">
                            <span className="w-16 capitalize font-medium" style={{ color: ELEMENT_COLORS[type] }}>{type}</span>
                            {hm !== 0 && <span className={cn("px-1 rounded", hm > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                              HP {hm > 0 ? "+" : ""}{(hm * 100).toFixed(0)}%
                            </span>}
                            {am !== 0 && <span className={cn("px-1 rounded", am > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                              AR {am > 0 ? "+" : ""}{(am * 100).toFixed(0)}%
                            </span>}
                            {sm !== 0 && <span className={cn("px-1 rounded", sm > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                              SH {sm > 0 ? "+" : ""}{(sm * 100).toFixed(0)}%
                            </span>}
                            {hm === 0 && am === 0 && sm === 0 && <span className="text-muted-foreground/40">neutral</span>}
                          </div>
                        );
                      })}
                    </div>
                  </Section>
                </>
              )}

              {!selectedEnemy && (
                <div className="border border-border rounded-xl p-8 bg-card text-center">
                  <Shield className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Select an enemy target to run the simulation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
