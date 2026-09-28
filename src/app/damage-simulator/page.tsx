"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell, PageMain, PageHero, FilterChip } from "@/components/page-shell";
import { cn } from "@/lib/utils";
import { Crosshair, Shield, Flame, Plus, X, Zap, FolderOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EnemyType, ENEMY_TYPES, type EnemyKind } from "@/lib/calc/ttk";
import { runDamageSim, type DamageSimResult } from "@/lib/calc/damage-sim";
import { consumeDamageSimHandoff, type AppliedSimBuild } from "@/lib/calc/damage-sim-load";
import { EnemyLevelControl } from "@/components/enemy-level-control";
import { SimSection, SimInputField, SIM_DAMAGE_TYPES, SIM_ELEMENT_COLORS, SIM_FACTION_COLORS } from "@/components/damage-sim/sim-section";
import { SimLoadBuildPicker } from "@/components/damage-sim/sim-load-build-picker";
import { SimResultsPanel } from "@/components/damage-sim/sim-results-panel";

const DEFAULT_ENEMY = ENEMY_TYPES.find((e) => e.id === "lancer") ?? ENEMY_TYPES[0] ?? null;

const KIND_FILTERS: { id: "all" | EnemyKind; label: string }[] = [
  { id: "all", label: "All kinds" },
  { id: "unit", label: "Units" },
  { id: "heavy", label: "Heavies" },
  { id: "eximus", label: "Eximus" },
  { id: "boss", label: "Bosses" },
];

export default function DamageSimulatorPage() {
  const router = useRouter();
  const [dmgTypes, setDmgTypes] = useState<Record<string, number>>({
    impact: 50,
    puncture: 50,
    slash: 100,
  });
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
  const [punctureArmorStripPerStack, setPunctureArmorStripPerStack] = useState(0);
  const [loadedBuildLabel, setLoadedBuildLabel] = useState<string | null>(null);

  const [selectedEnemy, setSelectedEnemy] = useState<EnemyType | null>(DEFAULT_ENEMY);
  const [enemyLevel, setEnemyLevel] = useState(100);
  const [steelPath, setSteelPath] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [enemyKind, setEnemyKind] = useState<"all" | EnemyKind>("all");
  const [enemySearch, setEnemySearch] = useState("");

  const onLoaded = useCallback((applied: AppliedSimBuild) => {
    setDmgTypes(applied.dmgTypes);
    setFireRate(applied.fireRate);
    setCritChance(applied.critChance);
    setCritMulti(applied.critMulti);
    setMultishot(applied.multishot);
    setStatusChance(applied.statusChance);
    setMagazine(applied.magazine);
    setReloadTime(applied.reloadTime);
    setStatusDamageBonus(applied.statusDamageBonus);
    setHeadshotDamageBonus(applied.headshotDamageBonus);
    setFactionBonuses(applied.factionBonuses);
    setPunctureArmorStripPerStack(applied.punctureArmorStripPerStack ?? 0);
    setLoadedBuildLabel(applied.buildLabel);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("from") !== "builder") return;
    const handoff = consumeDamageSimHandoff();
    if (handoff) onLoaded(handoff);
    router.replace("/damage-simulator", { scroll: false });
  }, [onLoaded, router]);

  const factions = useMemo(() => ["all", ...new Set(ENEMY_TYPES.map((e) => e.faction))], []);
  const filteredEnemies = useMemo(() => {
    const q = enemySearch.trim().toLowerCase();
    return ENEMY_TYPES.filter((e) => {
      if (selectedFaction && selectedFaction !== "all" && e.faction !== selectedFaction) return false;
      if (enemyKind !== "all" && (e.kind ?? "unit") !== enemyKind) return false;
      if (q && !e.name.toLowerCase().includes(q) && !e.faction.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [selectedFaction, enemyKind, enemySearch]);

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
      { steelPath },
    );
  }, [
    selectedEnemy,
    enemyLevel,
    steelPath,
    dmgTypes,
    totalRaw,
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
    punctureArmorStripPerStack,
  ]);

  const setDmg = (type: string, val: number) => setDmgTypes((prev) => ({ ...prev, [type]: val }));
  const removeDmg = (type: string) =>
    setDmgTypes((prev) => {
      const n = { ...prev };
      delete n[type];
      return n;
    });

  const unusedTypes = SIM_DAMAGE_TYPES.filter((t) => !(t.key in dmgTypes));

  return (
    <PageShell>
      <PageMain maxWidth="xl">
        <PageHero
          icon={Zap}
          accent="amber"
          title="Damage Simulator"
          description="Load a weapon build or enter stats by hand, pick an enemy, and read time-to-kill."
        />

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="min-w-0 space-y-4">
            <SimSection title="Load from build" icon={<FolderOpen className="h-3.5 w-3.5" />}>
              <SimLoadBuildPicker
                onLoaded={onLoaded}
                loadedLabel={loadedBuildLabel}
                statusDamageBonus={statusDamageBonus}
                factionBonuses={factionBonuses}
                applyHeadshots={applyHeadshots}
                onApplyHeadshotsChange={setApplyHeadshots}
              />
            </SimSection>

            <SimSection title="Weapon stats" icon={<Crosshair className="h-3.5 w-3.5" />}>
              <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
                <SimInputField label="Fire Rate" value={fireRate} onChange={setFireRate} step={0.1} />
                <SimInputField label="Crit Chance" value={critChance} onChange={setCritChance} step={0.01} />
                <SimInputField label="Crit Multi" value={critMulti} onChange={setCritMulti} step={0.1} suffix="x" />
                <SimInputField label="Multishot" value={multishot} onChange={setMultishot} step={0.1} />
                <SimInputField label="Status Chance" value={statusChance} onChange={setStatusChance} step={0.01} />
                <SimInputField label="Magazine" value={magazine} onChange={setMagazine} step={1} />
                <SimInputField label="Reload (s)" value={reloadTime} onChange={setReloadTime} step={0.1} />
                <div className="min-w-0">
                  <label className="mb-0.5 block text-[10px] text-muted-foreground">Total damage</label>
                  <div className="flex min-h-11 min-w-0 max-w-full items-center rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 font-mono text-sm font-bold tabular-nums text-amber-900 dark:text-amber-300 sm:min-h-9 sm:text-xs">
                    {totalRaw.toFixed(1)}
                  </div>
                </div>
              </div>
            </SimSection>

            <SimSection title="Damage types" icon={<Flame className="h-3.5 w-3.5" />}>
              <div className="space-y-1.5">
                {Object.entries(dmgTypes).map(([type, val]) => (
                  <div key={type} className="flex min-w-0 items-center gap-1 sm:gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: SIM_ELEMENT_COLORS[type] || "#888" }}
                    />
                    <span
                      className="w-14 shrink-0 truncate text-xs font-medium capitalize sm:w-20"
                      style={{ color: SIM_ELEMENT_COLORS[type] }}
                    >
                      {type}
                    </span>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => setDmg(type, parseFloat(e.target.value) || 0)}
                      className="min-h-11 min-w-0 max-w-full flex-1 rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-base [appearance:textfield] sm:min-h-9 sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="w-8 shrink-0 text-right text-[10px] text-muted-foreground sm:w-10">
                      {totalRaw > 0 ? `${((val / totalRaw) * 100).toFixed(0)}%` : "0%"}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDmg(type)}
                      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center text-red-700/70 hover:text-red-700 dark:text-red-400/60 dark:hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              {unusedTypes.length > 0 && (
                <div className="mt-3 flex min-w-0 items-center gap-2">
                  <select
                    value={addingType}
                    onChange={(e) => setAddingType(e.target.value)}
                    className="min-h-11 min-w-0 max-w-full flex-1 rounded-lg border border-border bg-background px-2.5 py-2 text-base sm:text-sm"
                  >
                    <option value="">Add element...</option>
                    {unusedTypes.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (addingType) {
                        setDmg(addingType, 100);
                        setAddingType("");
                      }
                    }}
                    disabled={!addingType}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              )}
            </SimSection>

            <SimSection title="Enemy target" icon={<Shield className="h-3.5 w-3.5" />}>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {factions.map((f) => (
                  <FilterChip
                    key={f}
                    active={(f === "all" && !selectedFaction) || selectedFaction === f}
                    onClick={() => setSelectedFaction(f === "all" ? null : f)}
                  >
                    <span className="capitalize">{f}</span>
                  </FilterChip>
                ))}
              </div>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {KIND_FILTERS.map((k) => (
                  <FilterChip
                    key={k.id}
                    active={enemyKind === k.id}
                    onClick={() => setEnemyKind(k.id)}
                  >
                    {k.label}
                  </FilterChip>
                ))}
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search enemies…"
                  value={enemySearch}
                  onChange={(e) => setEnemySearch(e.target.value)}
                  className="min-h-11 pl-9"
                />
              </div>
              <div className="max-h-[min(50vh,20rem)] space-y-0.5 overflow-y-auto rounded-lg border border-border/60 bg-background/40 p-1">
                {filteredEnemies.length === 0 ? (
                  <p className="p-4 text-center text-xs text-muted-foreground">No enemies match.</p>
                ) : (
                  filteredEnemies.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setSelectedEnemy(e)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2.5 text-left text-xs transition-all min-h-11",
                        selectedEnemy?.id === e.id
                          ? "border-amber-500/50 bg-amber-500/5"
                          : "border-transparent hover:border-border hover:bg-muted/30",
                      )}
                    >
                      <div className="flex justify-between gap-2">
                        <span className="font-medium">{e.name}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          {e.kind && e.kind !== "unit" && (
                            <span className="rounded bg-muted/60 px-1 text-[8px] uppercase tracking-wide text-muted-foreground">
                              {e.kind}
                            </span>
                          )}
                          <span className="text-[9px]" style={{ color: SIM_FACTION_COLORS[e.faction] }}>
                            {e.faction}
                          </span>
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap gap-3 text-[9px] text-muted-foreground">
                        <span>HP {e.baseHealth}</span>
                        {e.baseShield > 0 && <span>SH {e.baseShield}</span>}
                        {e.baseArmor > 0 && <span>AR {e.baseArmor}</span>}
                        <span className="text-muted-foreground/50">
                          {e.healthType} / {e.armorType !== "none" ? e.armorType : "–"}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <p className="mt-2 text-[9px] text-muted-foreground/70">
                {filteredEnemies.length} shown · bosses / eidolons are paper HP (phases not modeled).
              </p>

              {selectedEnemy && (
                <div className="mt-3 min-w-0">
                  <EnemyLevelControl
                    value={enemyLevel}
                    onChange={setEnemyLevel}
                    steelPath={steelPath}
                    onSteelPathChange={setSteelPath}
                  />
                </div>
              )}
            </SimSection>
          </div>

          <div className="min-w-0 space-y-4 lg:sticky lg:top-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] lg:max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px)-1.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
            <SimResultsPanel
              selectedEnemy={selectedEnemy}
              enemyLevel={enemyLevel}
              steelPath={steelPath}
              sim={sim}
              totalRaw={totalRaw}
              multishot={multishot}
              magazine={magazine}
              reloadTime={reloadTime}
              dmgTypes={dmgTypes}
            />
          </div>
        </div>
      </PageMain>
    </PageShell>
  );
}
