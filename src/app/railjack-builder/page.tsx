"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { ModSlotCard } from "@/components/mod-slot";
import { ModPicker } from "@/components/mod-picker";
import { useMods } from "@/lib/weapons/use-data";
import {
  allReactors, allShieldArrays, allEngines, allPlating,
  allTurrets, allOrdnance,
  isRailjackMod,
  RailjackComponent, RailjackArmament,
  railjackPresets, uranusProximaMissions, railjackEliteCrew,
  findRailjackComponent, findRailjackArmament,
  getRailjackComponentTraits,
} from "@/data/railjack";
import {
  DEFAULT_RAILJACK_INTRINSICS,
  MAX_INTRINSIC_RANK,
  RAILJACK_INTRINSIC_RANK_NAMES,
  RAILJACK_INTRINSIC_TREES,
  type RailjackIntrinsicTree,
  type RailjackIntrinsics,
} from "@/data/railjack-intrinsics";
import { EquippedMod } from "@/lib/types";
import { calculateRailjackBuild, railjackBuildNeedsSimulation, resolveHouseTrait } from "@/lib/calc/railjack-calculator";

function defaultTraitId(componentId: string): string | undefined {
  return resolveHouseTrait(getRailjackComponentTraits(componentId))?.id;
}
import { filterRailjackModsForTab } from "@/lib/mods/railjack-plexus-mods";
import { cn } from "@/lib/utils";
import { Save, FolderOpen, Crosshair, Shield, Zap, Gauge, ChevronRight, Users } from "lucide-react";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, RailjackBuildData, persistSavedBuild } from "@/lib/builds/build-storage";
import { toast } from "sonner";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";
import { modSlotCapacityCost, modCapacityAtRank } from "@/lib/calc/mod-capacity";

type PlexusTab = "integrated" | "battle" | "tactical";

const INTEGRATED_SLOTS = 9;
const BATTLE_SLOTS = 3;
const TACTICAL_SLOTS = 3;
const TURRET_SLOT_LABELS = ["Nose", "Dorsal", "Ventral"] as const;

export default function RailjackBuilderPage() {
  const { mods: allMods, modsMap } = useMods();
  // Component state
  const [selectedReactor, setSelectedReactor] = useState<RailjackComponent | null>(null);
  const [selectedShield, setSelectedShield] = useState<RailjackComponent | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<RailjackComponent | null>(null);
  const [selectedPlating, setSelectedPlating] = useState<RailjackComponent | null>(null);
  const [reactorTraitId, setReactorTraitId] = useState<string | undefined>();
  const [shieldTraitId, setShieldTraitId] = useState<string | undefined>();
  const [engineTraitId, setEngineTraitId] = useState<string | undefined>();

  // Armament state — Nose / Dorsal / Ventral turrets + munitions launcher
  const [selectedTurrets, setSelectedTurrets] = useState<[RailjackArmament | null, RailjackArmament | null, RailjackArmament | null]>([null, null, null]);
  const [activeTurretSlot, setActiveTurretSlot] = useState<0 | 1 | 2>(0);
  const [showTurretPicker, setShowTurretPicker] = useState(false);
  const [selectedOrdnance, setSelectedOrdnance] = useState<RailjackArmament | null>(null);
  const [showOrdnancePicker, setShowOrdnancePicker] = useState(false);

  // Plexus mod state
  const [plexusTab, setPlexusTab] = useState<PlexusTab>("integrated");
  const [integratedMods, setIntegratedMods] = useState<EquippedMod[]>([]);
  const [battleMods, setBattleMods] = useState<EquippedMod[]>([]);
  const [tacticalMods, setTacticalMods] = useState<EquippedMod[]>([]);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // Polarities
  const [integratedPolarities, setIntegratedPolarities] = useState<Record<number, string>>({});
  const [battlePolarities, setBattlePolarities] = useState<Record<number, string>>({});
  const [tacticalPolarities, setTacticalPolarities] = useState<Record<number, string>>({});

  // Intrinsics (Dirac/grid removed U29.10 — Plexus uses Endo + Forma)
  const [intrinsics, setIntrinsics] = useState<RailjackIntrinsics>({ ...DEFAULT_RAILJACK_INTRINSICS });

  // Elite crew & simulation
  const [selectedEliteCrewId, setSelectedEliteCrewId] = useState<string | null>(null);
  const [crimsonFugueStacks, setCrimsonFugueStacks] = useState(5);
  const [cruisingSpeedActive, setCruisingSpeedActive] = useState(false);
  const [protectiveShotsActive, setProtectiveShotsActive] = useState(true);
  const [shieldsDepleted, setShieldsDepleted] = useState(false);
  const [activeBattleAbilityId, setActiveBattleAbilityId] = useState<string | null>(null);
  const [activeTacticalAbilityId, setActiveTacticalAbilityId] = useState<string | null>(null);

  // Save state
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildName, setBuildName] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Component pickers
  const [showComponentPicker, setShowComponentPicker] = useState<string | null>(null);

  useEffect(() => { setSavedBuilds(getSavedBuilds("railjack")); }, []);

  // Current mods/polarities based on active tab
  const currentMods = plexusTab === "integrated" ? integratedMods : plexusTab === "battle" ? battleMods : tacticalMods;
  const setCurrentMods = plexusTab === "integrated" ? setIntegratedMods : plexusTab === "battle" ? setBattleMods : setTacticalMods;
  const currentPolarities = plexusTab === "integrated" ? integratedPolarities : plexusTab === "battle" ? battlePolarities : tacticalPolarities;
  const setCurrentPolarities = plexusTab === "integrated" ? setIntegratedPolarities : plexusTab === "battle" ? setBattlePolarities : setTacticalPolarities;
  const currentSlotCount = plexusTab === "integrated" ? INTEGRATED_SLOTS : plexusTab === "battle" ? BATTLE_SLOTS : TACTICAL_SLOTS;

  // Railjack mods from the "general" category
  const railjackMods = useMemo(() => {
    return allMods.filter((m) => m.category === "general" && isRailjackMod(m));
  }, []);

  // Capacity
  const capacityUsed = useMemo(() => {
    return currentMods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = currentPolarities[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [currentMods, currentPolarities]);

  const maxCapacity =
    plexusTab === "integrated"
      ? Math.max(20, selectedReactor?.stats.avionicsCapacity ?? 60)
      : 15;

  const tabRailjackMods = useMemo(
    () => filterRailjackModsForTab(railjackMods, plexusTab),
    [railjackMods, plexusTab],
  );

  const buildInput = useMemo(
    () => ({
      reactorId: selectedReactor?.id,
      shieldId: selectedShield?.id,
      engineId: selectedEngine?.id,
      platingId: selectedPlating?.id,
      reactorTraitId,
      shieldTraitId,
      engineTraitId,
      turretIds: selectedTurrets.map((t) => t?.id),
      ordnanceId: selectedOrdnance?.id,
      integratedMods: integratedMods.map(({ modId, rank, slotIndex }) => ({ modId, rank, slotIndex })),
      battleMods: battleMods.map(({ modId, rank, slotIndex }) => ({ modId, rank, slotIndex })),
      tacticalMods: tacticalMods.map(({ modId, rank, slotIndex }) => ({ modId, rank, slotIndex })),
      eliteCrewId: selectedEliteCrewId ?? undefined,
      intrinsics,
      simulation: {
        crimsonFugueStacks,
        cruisingSpeedActive,
        protectiveShotsActive,
        shieldsDepleted,
        activeBattleAbilityId,
        activeTacticalAbilityId,
      },
    }),
    [
      selectedReactor,
      selectedShield,
      selectedEngine,
      selectedPlating,
      reactorTraitId,
      shieldTraitId,
      engineTraitId,
      selectedTurrets,
      selectedOrdnance,
      integratedMods,
      battleMods,
      tacticalMods,
      selectedEliteCrewId,
      intrinsics,
      crimsonFugueStacks,
      cruisingSpeedActive,
      protectiveShotsActive,
      shieldsDepleted,
      activeBattleAbilityId,
      activeTacticalAbilityId,
    ],
  );

  const computedStats = useMemo(() => calculateRailjackBuild(buildInput), [buildInput]);

  const showSimulationPanel = useMemo(() => railjackBuildNeedsSimulation(buildInput), [buildInput]);

  const hasCrimsonFugue = integratedMods.some((m) => m.modId === "crimson_fugue");
  const hasCruisingSpeed = integratedMods.some((m) => m.modId === "cruising_speed");
  const hasProtectiveShots = integratedMods.some((m) => m.modId === "protective_shots");

  // Save
  const handleSaveBuildConfirm = useCallback(async ({ name, isPublic }: SaveBuildDialogValues) => {
    const data: RailjackBuildData = {
      reactorId: selectedReactor?.id,
      shieldId: selectedShield?.id,
      engineId: selectedEngine?.id,
      platingId: selectedPlating?.id,
      reactorTraitId,
      shieldTraitId,
      engineTraitId,
      turretIds: selectedTurrets.map((t) => t?.id),
      ordnanceId: selectedOrdnance?.id,
      integratedMods: integratedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      battleMods: battleMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      tacticalMods: tacticalMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      integratedPolarities,
      battlePolarities,
      tacticalPolarities,
      eliteCrewId: selectedEliteCrewId ?? undefined,
      intrinsics,
      simulation: {
        crimsonFugueStacks,
        cruisingSpeedActive,
        protectiveShotsActive,
        shieldsDepleted,
        activeBattleAbilityId,
        activeTacticalAbilityId,
      },
    };
    const build: SavedBuild = {
      id: currentBuildId || generateBuildId(),
      name,
      isPublic,
      type: "railjack",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data,
    };
    const result = await persistSavedBuild(build);
    setCurrentBuildId(result.id);
    setBuildName(name);
    setBuildIsPublic(result.isPublic);
    setSavedBuilds(result.builds);
    if (result.synced) {
      toast.success("Build saved", { description: `${name} saved to your account` });
    } else {
      toast.success("Build saved locally", { description: "Log in to sync builds to your account" });
    }
  }, [selectedReactor, selectedShield, selectedEngine, selectedPlating, reactorTraitId, shieldTraitId, engineTraitId, selectedTurrets, selectedOrdnance, integratedMods, battleMods, tacticalMods, integratedPolarities, battlePolarities, tacticalPolarities, selectedEliteCrewId, intrinsics, crimsonFugueStacks, cruisingSpeedActive, protectiveShotsActive, shieldsDepleted, activeBattleAbilityId, activeTacticalAbilityId, currentBuildId]);

  const handleLoadBuild = useCallback((build: SavedBuild) => {
    const d = build.data as RailjackBuildData;
    const restoreMods = (slots: { modId: string; rank: number; slotIndex: number }[]) =>
      slots.map((m) => { const mod = modsMap.get(m.modId); return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain }; });

    setSelectedReactor(findRailjackComponent(d.reactorId ?? "") ?? null);
    setSelectedShield(findRailjackComponent(d.shieldId ?? "") ?? null);
    setSelectedEngine(findRailjackComponent(d.engineId ?? "") ?? null);
    setSelectedPlating(findRailjackComponent(d.platingId ?? "") ?? null);
    setReactorTraitId(d.reactorTraitId);
    setShieldTraitId(d.shieldTraitId);
    setEngineTraitId(d.engineTraitId);
    setIntrinsics({
      tactical: d.intrinsics?.tactical ?? 0,
      piloting: d.intrinsics?.piloting ?? 0,
      gunnery: d.intrinsics?.gunnery ?? 0,
      engineering: d.intrinsics?.engineering ?? 0,
      command: d.intrinsics?.command ?? 0,
    });
    const turretIds = d.turretIds?.length
      ? d.turretIds
      : d.turretId
        ? [d.turretId, undefined]
        : [undefined, undefined];
    setSelectedTurrets([
      findRailjackArmament(turretIds[0] ?? "") ?? null,
      findRailjackArmament(turretIds[1] ?? "") ?? null,
      findRailjackArmament(turretIds[2] ?? "") ?? null,
    ]);
    setSelectedOrdnance(findRailjackArmament(d.ordnanceId ?? "") ?? null);
    setIntegratedMods(restoreMods(d.integratedMods));
    setBattleMods(restoreMods(d.battleMods));
    setTacticalMods(restoreMods(d.tacticalMods));
    setIntegratedPolarities(d.integratedPolarities || {});
    setBattlePolarities(d.battlePolarities || {});
    setTacticalPolarities(d.tacticalPolarities || {});
    setSelectedEliteCrewId(d.eliteCrewId ?? null);
    setCrimsonFugueStacks(d.simulation?.crimsonFugueStacks ?? 5);
    setCruisingSpeedActive(d.simulation?.cruisingSpeedActive ?? false);
    setProtectiveShotsActive(d.simulation?.protectiveShotsActive ?? true);
    setShieldsDepleted(d.simulation?.shieldsDepleted ?? false);
    setActiveBattleAbilityId(d.simulation?.activeBattleAbilityId ?? null);
    setActiveTacticalAbilityId(d.simulation?.activeTacticalAbilityId ?? null);
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildIsPublic(build.isPublic ?? false);
    setShowSavedBuilds(false);
    toast.info("Build loaded", { description: build.name });
  }, []);

  useCloudBuildFromUrl("railjack", handleLoadBuild);

  const handleDeleteBuild = useCallback((id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("railjack"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId]);

  /** Picking different parts after a loaded save should not upsert the same cloud row with a stale name. */
  const beginNewRailjackDraft = useCallback(() => {
    setCurrentBuildId(null);
    setBuildName("");
  }, []);

  const applyRailjackPreset = useCallback((presetId: string) => {
    const preset = railjackPresets.find((p) => p.id === presetId);
    if (!preset) return;
    beginNewRailjackDraft();
    setSelectedReactor(findRailjackComponent(preset.reactorId) ?? null);
    setSelectedShield(findRailjackComponent(preset.shieldId) ?? null);
    setSelectedEngine(findRailjackComponent(preset.engineId) ?? null);
    setSelectedPlating(findRailjackComponent(preset.platingId) ?? null);
    setSelectedTurrets([
      findRailjackArmament(preset.turretIds[0]) ?? null,
      findRailjackArmament(preset.turretIds[1]) ?? null,
      findRailjackArmament(preset.turretIds[2]) ?? null,
    ]);
    setSelectedOrdnance(findRailjackArmament(preset.ordnanceId) ?? null);

    const toEquipped = (modIds: string[], slotCap: number): EquippedMod[] => {
      const out: EquippedMod[] = [];
      for (let i = 0; i < modIds.length && out.length < slotCap; i++) {
        const mod = modsMap.get(modIds[i]!);
        if (!mod) continue;
        out.push({
          modId: mod.id,
          rank: mod.maxRank,
          slotIndex: out.length,
          modName: mod.name,
          polarity: mod.polarity,
          drain: mod.drain,
        });
      }
      return out;
    };
    setIntegratedMods(toEquipped(preset.integratedMods, INTEGRATED_SLOTS));
    setBattleMods(toEquipped(preset.battleMods, BATTLE_SLOTS));
    setTacticalMods(toEquipped(preset.tacticalMods, TACTICAL_SLOTS));
    setIntegratedPolarities({});
    setBattlePolarities({});
    setTacticalPolarities({});
    setBuildName(preset.name);
    toast.success(`Loaded ${preset.name} (components + Plexus)`);
  }, [beginNewRailjackDraft, modsMap]);

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-8">
        {/* Title bar */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-xl sm:text-3xl font-bold">Railjack Builder</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="Build name..."
              className="px-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground w-40"
            />
            <button onClick={() => setSaveDialogOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-green-400 hover:border-green-500/50 transition-all" title="Save Build">
              <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={() => { setSavedBuilds(getSavedBuilds("railjack")); setShowSavedBuilds(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-blue-400 hover:border-blue-500/50 transition-all" title="Load Build">
              <FolderOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Load</span>
            </button>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">Configure your Railjack components, armaments, and Plexus mods</p>

        <div className="mb-6 border border-rose-500/20 rounded-xl p-4 bg-rose-500/5">
          <h2 className="text-xs font-semibold tracking-wider text-rose-800 mb-2 dark:text-rose-300">URANUS PROXIMA (UPDATE 43)</h2>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Jade Shadows: Constellations adds Pontis Tower, Steel Path Railjack, four new Arcanes, and two story missions with reference ship loadouts.
          </p>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            {uranusProximaMissions.map((m) => (
              <div key={m.id} className="text-xs border border-border/50 rounded-lg p-2.5 bg-card/50">
                <div className="font-medium">{m.name}</div>
                <div className="text-muted-foreground mt-0.5">Ally: {m.ally} • {m.rewards[0]}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {railjackPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => applyRailjackPreset(p.id)}
                className="px-3 py-1.5 text-xs rounded-lg border border-rose-500/30 text-rose-800 hover:bg-rose-500/10 transition-colors dark:text-rose-300"
              >
                Load {p.name} ({p.owner})
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/80 mt-2">
            Presets apply ship components, Nose/Dorsal/Ventral turrets, munitions, and max-rank Plexus mods.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Left Column: Ship Components & Stats ── */}
          <div className="space-y-6">
            {/* Ship Stats Overview */}
            <div className="border border-border rounded-xl p-4 bg-card">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">RAILJACK STATS</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Hull</span><span className="font-mono">{computedStats.hull}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Armor</span><span className="font-mono">{computedStats.armor}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shield</span><span className="font-mono">{computedStats.shield}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shield Recharge</span><span className="font-mono">{computedStats.shieldRecharge}%/s</span></div>
                {(computedStats.shieldRechargeDelayReduction ?? 0) > 0 && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Recharge Delay −</span><span className="font-mono">{computedStats.shieldRechargeDelayReduction}s</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Speed</span><span className="font-mono">{computedStats.speed} m/s</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Boost Speed</span><span className="font-mono">{computedStats.boostSpeed} m/s</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Boost Mult</span><span className="font-mono">{(computedStats.boostMultiplier ?? 0).toFixed(2)}×</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Boost Cost</span><span className="font-mono">{computedStats.boostCost}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Flux Capacity</span><span className="font-mono">{computedStats.fluxCapacity}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Avionics</span><span className="font-mono">{computedStats.avionicsCapacity}</span></div>
              </div>
              {(computedStats.activeHouseTraits?.length ?? 0) > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-1.5">ACTIVE HOUSE TRAITS</h3>
                  <ul className="space-y-1 text-[11px] text-muted-foreground">
                    {computedStats.activeHouseTraits!.map((t) => (
                      <li key={t.id}>• {t.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(computedStats.turretDamageBonus > 0 || computedStats.turretCritBonus > 0 || computedStats.turretCritDmgBonus > 0 || computedStats.ordnanceDamageBonus > 0 || computedStats.artilleryDamageBonus > 0 || computedStats.munitionsCapacityBonus > 0 || (computedStats.abilityTurretDamageBonus ?? 0) > 0 || (computedStats.crewBonuses?.turretDamageBonus ?? 0) > 0 || (computedStats.crewBonuses?.repairSpeedBonus ?? 0) > 0 || (computedStats.crewBonuses?.hullBonus ?? 0) > 0 || (computedStats.crewBonuses?.speedBonus ?? 0) > 0) && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-1.5">PLEXUS / CREW BONUSES</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    {computedStats.turretDamageBonus > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Turret Damage</span><span className="font-mono text-cyan-400">+{(computedStats.turretDamageBonus * 100).toFixed(0)}%</span></div>
                    )}
                    {computedStats.turretCritBonus > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Turret Crit</span><span className="font-mono text-cyan-400">+{(computedStats.turretCritBonus * 100).toFixed(0)}%</span></div>
                    )}
                    {computedStats.turretCritDmgBonus > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Turret Crit DMG</span><span className="font-mono text-cyan-400">+{(computedStats.turretCritDmgBonus * 100).toFixed(0)}%</span></div>
                    )}
                    {computedStats.ordnanceDamageBonus > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Ordnance Damage</span><span className="font-mono text-cyan-400">+{(computedStats.ordnanceDamageBonus * 100).toFixed(0)}%</span></div>
                    )}
                    {computedStats.artilleryDamageBonus > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Artillery Damage</span><span className="font-mono text-cyan-400">+{(computedStats.artilleryDamageBonus * 100).toFixed(0)}%</span></div>
                    )}
                    {computedStats.munitionsCapacityBonus > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Munitions Capacity</span><span className="font-mono text-cyan-400">+{(computedStats.munitionsCapacityBonus * 100).toFixed(0)}%</span></div>
                    )}
                    {(computedStats.abilityTurretDamageBonus ?? 0) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Ability Turret DMG</span><span className="font-mono text-cyan-400">+{((computedStats.abilityTurretDamageBonus ?? 0) * 100).toFixed(0)}%</span></div>
                    )}
                    {(computedStats.crewBonuses?.turretDamageBonus ?? 0) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Crew Gunnery</span><span className="font-mono text-cyan-400">+{((computedStats.crewBonuses!.turretDamageBonus) * 100).toFixed(0)}%</span></div>
                    )}
                    {(computedStats.crewBonuses?.repairSpeedBonus ?? 0) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Crew Repair</span><span className="font-mono text-cyan-400">+{((computedStats.crewBonuses!.repairSpeedBonus) * 100).toFixed(0)}%</span></div>
                    )}
                    {(computedStats.crewBonuses?.hullBonus ?? 0) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Crew Hull</span><span className="font-mono text-cyan-400">+{((computedStats.crewBonuses!.hullBonus) * 100).toFixed(0)}%</span></div>
                    )}
                    {(computedStats.crewBonuses?.speedBonus ?? 0) > 0 && (
                      <div className="flex justify-between"><span className="text-muted-foreground">Crew Speed</span><span className="font-mono text-cyan-400">+{((computedStats.crewBonuses!.speedBonus) * 100).toFixed(0)}%</span></div>
                    )}
                  </div>
                </div>
              )}
              {(computedStats.abilityStrengthBonus || computedStats.abilityRangeBonus || computedStats.abilityDurationBonus) && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-1.5">REACTOR BATTLE SCALING</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    {computedStats.abilityStrengthBonus ? (
                      <div className="flex justify-between"><span className="text-muted-foreground">Strength</span><span className="font-mono text-orange-400">+{(computedStats.abilityStrengthBonus * 100).toFixed(0)}%</span></div>
                    ) : null}
                    {computedStats.abilityRangeBonus ? (
                      <div className="flex justify-between"><span className="text-muted-foreground">Range</span><span className="font-mono text-orange-400">+{(computedStats.abilityRangeBonus * 100).toFixed(0)}%</span></div>
                    ) : null}
                    {computedStats.abilityDurationBonus ? (
                      <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-mono text-orange-400">+{(computedStats.abilityDurationBonus * 100).toFixed(0)}%</span></div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Component Selectors */}
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">COMPONENTS</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* Reactor */}
                <button
                  onClick={() => setShowComponentPicker(showComponentPicker === "reactor" ? null : "reactor")}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    selectedReactor ? "border-orange-500/50 bg-orange-500/5" : "border-border hover:border-orange-500/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-3.5 w-3.5 text-orange-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">REACTOR</span>
                  </div>
                  <span className="text-sm font-medium">{selectedReactor?.name ?? "None"}</span>
                  {selectedReactor && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Avionics {selectedReactor.stats.avionicsCapacity}
                      {selectedReactor.stats.abilityStrength != null && ` • STR +${Math.round(selectedReactor.stats.abilityStrength * 100)}%`}
                      {selectedReactor.stats.abilityRange != null && ` • RNG +${Math.round(selectedReactor.stats.abilityRange * 100)}%`}
                      {selectedReactor.stats.abilityDuration != null && ` • DUR +${Math.round(selectedReactor.stats.abilityDuration * 100)}%`}
                    </div>
                  )}
                </button>

                {/* Shield Array */}
                <button
                  onClick={() => setShowComponentPicker(showComponentPicker === "shield" ? null : "shield")}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    selectedShield ? "border-cyan-500/50 bg-cyan-500/5" : "border-border hover:border-cyan-500/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">SHIELD ARRAY</span>
                  </div>
                  <span className="text-sm font-medium">{selectedShield?.name ?? "None"}</span>
                  {selectedShield && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Cap {selectedShield.stats.shieldCapacity} • {selectedShield.stats.shieldRecharge}%/s
                      {(selectedShield.stats.shieldRechargeDelayReduction ?? 0) > 0 &&
                        ` • Delay −${selectedShield.stats.shieldRechargeDelayReduction}s`}
                    </div>
                  )}
                </button>

                {/* Engines */}
                <button
                  onClick={() => setShowComponentPicker(showComponentPicker === "engine" ? null : "engine")}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    selectedEngine ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-green-500/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">ENGINES</span>
                  </div>
                  <span className="text-sm font-medium">{selectedEngine?.name ?? "None"}</span>
                  {selectedEngine && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Cruise +{selectedEngine.stats.speed} m/s
                      {(selectedEngine.stats.boostMultiplier ?? 0) > 0 &&
                        ` • Boost +${selectedEngine.stats.boostMultiplier}×`}
                    </div>
                  )}
                </button>

                {/* Plating */}
                <button
                  onClick={() => setShowComponentPicker(showComponentPicker === "plating" ? null : "plating")}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    selectedPlating ? "border-amber-500/50 bg-amber-500/5" : "border-border hover:border-amber-500/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">HULL (PLATING)</span>
                  </div>
                  <span className="text-sm font-medium">{selectedPlating?.name ?? "None"}</span>
                  {selectedPlating && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Hull {selectedPlating.stats.hullBonus} • Armor {selectedPlating.stats.armorBonus}
                    </div>
                  )}
                </button>
              </div>

              {/* Component picker dropdown */}
              {showComponentPicker && (
                <div className="mt-3 border border-border rounded-xl p-3 bg-card max-h-[250px] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-1.5">
                    {(showComponentPicker === "reactor" ? allReactors :
                      showComponentPicker === "shield" ? allShieldArrays :
                      showComponentPicker === "engine" ? allEngines : allPlating
                    ).map((comp) => {
                      const traits = getRailjackComponentTraits(comp.id);
                      return (
                      <button
                        key={comp.id}
                        onClick={() => {
                          beginNewRailjackDraft();
                          if (showComponentPicker === "reactor") {
                            setSelectedReactor(comp);
                            setReactorTraitId(defaultTraitId(comp.id));
                          } else if (showComponentPicker === "shield") {
                            setSelectedShield(comp);
                            setShieldTraitId(defaultTraitId(comp.id));
                          } else if (showComponentPicker === "engine") {
                            setSelectedEngine(comp);
                            setEngineTraitId(defaultTraitId(comp.id));
                          } else setSelectedPlating(comp);
                          setShowComponentPicker(null);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-primary/40 transition-all text-left"
                      >
                        <div>
                          <span className="text-sm font-medium">{comp.name}</span>
                          <div className="text-[10px] text-muted-foreground">{comp.description}</div>
                          {traits.length > 0 && (
                            <div className="text-[10px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                              Traits: {traits.map((t) => t.text).join(" · ")}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* House unique trait rolls (Mk III wreckage) */}
              {([
                ["Reactor", selectedReactor, reactorTraitId, setReactorTraitId],
                ["Shield", selectedShield, shieldTraitId, setShieldTraitId],
                ["Engines", selectedEngine, engineTraitId, setEngineTraitId],
              ] as const).some(([, comp]) => comp && getRailjackComponentTraits(comp.id).length > 0) && (
                <div className="mt-3 border border-border rounded-xl p-3 bg-card space-y-2">
                  <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground">HOUSE TRAIT ROLLS</h3>
                  {([
                    ["Reactor", selectedReactor, reactorTraitId, setReactorTraitId],
                    ["Shield", selectedShield, shieldTraitId, setShieldTraitId],
                    ["Engines", selectedEngine, engineTraitId, setEngineTraitId],
                  ] as const).map(([label, comp, traitId, setTraitId]) => {
                    if (!comp) return null;
                    const traits = getRailjackComponentTraits(comp.id);
                    if (!traits.length) return null;
                    const value = traitId ?? defaultTraitId(comp.id) ?? traits[0]!.id;
                    return (
                      <label key={label} className="block text-xs">
                        <span className="text-muted-foreground">{label}</span>
                        <select
                          className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1.5 text-[11px]"
                          value={value}
                          onChange={(e) => {
                            beginNewRailjackDraft();
                            setTraitId(e.target.value);
                          }}
                        >
                          {traits.map((t) => (
                            <option key={t.id} value={t.id}>{t.text}</option>
                          ))}
                        </select>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Intrinsics */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold tracking-wider text-muted-foreground">INTRINSICS</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      beginNewRailjackDraft();
                      setIntrinsics({ ...DEFAULT_RAILJACK_INTRINSICS });
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="text-[10px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      beginNewRailjackDraft();
                      setIntrinsics({
                        tactical: MAX_INTRINSIC_RANK,
                        piloting: MAX_INTRINSIC_RANK,
                        gunnery: MAX_INTRINSIC_RANK,
                        engineering: MAX_INTRINSIC_RANK,
                        command: MAX_INTRINSIC_RANK,
                      });
                    }}
                  >
                    Max all
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">
                Dirac / Avionics Grid removed in U29.10 (→ Endo). Rank Plexus mods + Forma as usual.
              </p>
              <div className="border border-border rounded-xl p-3 bg-card space-y-2.5">
                {RAILJACK_INTRINSIC_TREES.map((tree) => {
                  const rank = intrinsics[tree.id];
                  const rankName = RAILJACK_INTRINSIC_RANK_NAMES[tree.id][rank] ?? "—";
                  return (
                    <label key={tree.id} className="block text-xs">
                      <div className="flex justify-between gap-2 mb-0.5">
                        <span className="font-medium">{tree.name}</span>
                        <span className="font-mono text-muted-foreground">{rank}/{MAX_INTRINSIC_RANK}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={MAX_INTRINSIC_RANK}
                        step={1}
                        value={rank}
                        onChange={(e) => {
                          beginNewRailjackDraft();
                          const next = Number(e.target.value) as number;
                          setIntrinsics((prev) => ({ ...prev, [tree.id]: next }));
                        }}
                        className="w-full"
                      />
                      <p className="text-[10px] text-muted-foreground mt-0.5" title={tree.blurb}>
                        {rankName}
                      </p>
                    </label>
                  );
                })}
                {(computedStats.intrinsicEffects?.dorsalVentralTurretDamageBonus ?? 0) > 0 && (
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400 pt-1 border-t border-border/50">
                    Paper: +50% Dorsal/Ventral turret damage (Gunnery 1)
                  </p>
                )}
                {(computedStats.intrinsicEffects?.battleEnergyCostMult ?? 1) < 1 && (
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400">
                    Paper: Battle Mod energy ×{computedStats.intrinsicEffects!.battleEnergyCostMult} (Tactical 6)
                  </p>
                )}
                {(computedStats.intrinsicEffects?.tacticalCooldownReduction ?? 0) > 0 && (
                  <p className="text-[10px] text-cyan-600 dark:text-cyan-400">
                    Paper: −{Math.round((computedStats.intrinsicEffects!.tacticalCooldownReduction ?? 0) * 100)}% Tactical cooldown
                  </p>
                )}
                {selectedEliteCrewId && !(computedStats.intrinsicEffects?.eliteCrewUnlocked) && (
                  <p className="text-[10px] text-amber-700 dark:text-amber-300">
                    Elite crew requires Command 10 (still applied for planning).
                  </p>
                )}
              </div>
            </div>

            {/* Elite Crew */}
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">ELITE CREW</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { beginNewRailjackDraft(); setSelectedEliteCrewId(null); }}
                  className={cn(
                    "p-2.5 rounded-lg border text-left text-xs transition-all",
                    !selectedEliteCrewId ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30",
                  )}
                >
                  <span className="font-medium">None</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Default crew bonuses</p>
                </button>
                {railjackEliteCrew.map((crew) => (
                  <button
                    key={crew.id}
                    type="button"
                    onClick={() => { beginNewRailjackDraft(); setSelectedEliteCrewId(crew.id); }}
                    className={cn(
                      "p-2.5 rounded-lg border text-left text-xs transition-all",
                      selectedEliteCrewId === crew.id ? "border-violet-500/50 bg-violet-500/10" : "border-border hover:border-violet-500/30",
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Users className="h-3 w-3 text-violet-400" />
                      <span className="font-medium">{crew.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{crew.description}</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">
                      G{crew.competency.gunnery} C{crew.competency.combat} P{crew.competency.piloting} R{crew.competency.repair} E{crew.competency.endurance}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Armaments — Nose / Dorsal / Ventral + munitions launcher */}
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">ARMAMENTS</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crosshair className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">TURRETS (×3)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([0, 1, 2] as const).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setActiveTurretSlot(slot);
                          setShowTurretPicker(true);
                          setShowOrdnancePicker(false);
                        }}
                        className={cn(
                          "rounded-lg border p-2.5 text-left transition-all",
                          selectedTurrets[slot]
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-dashed border-border hover:border-red-500/30",
                        )}
                      >
                        <span className="text-[10px] text-muted-foreground">{TURRET_SLOT_LABELS[slot]}</span>
                        <p className="text-sm font-medium mt-0.5 truncate">
                          {selectedTurrets[slot]?.name ?? "Select turret"}
                        </p>
                        {selectedTurrets[slot] && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            DMG {selectedTurrets[slot]!.damage} • CC {(selectedTurrets[slot]!.critChance * 100).toFixed(0)}%
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                  {showTurretPicker && (
                    <div className="mt-3 border border-border rounded-xl p-3 bg-card max-h-[240px] overflow-y-auto">
                      <p className="text-[10px] text-muted-foreground mb-2">Equipping {TURRET_SLOT_LABELS[activeTurretSlot]} turret</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {allTurrets.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              beginNewRailjackDraft();
                              setSelectedTurrets((prev) => {
                                const next: [RailjackArmament | null, RailjackArmament | null, RailjackArmament | null] = [...prev];
                                next[activeTurretSlot] = t;
                                return next;
                              });
                              setShowTurretPicker(false);
                            }}
                            className={cn(
                              "p-2 rounded-lg border text-left transition-all text-xs",
                              selectedTurrets[activeTurretSlot]?.id === t.id
                                ? "border-red-500/50 bg-red-500/10 text-red-400"
                                : "border-border hover:border-red-500/30",
                            )}
                          >
                            <span className="font-medium">{t.name}</span>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              DMG {t.damage} • CC {(t.critChance * 100).toFixed(0)}% • SC {(t.statusChance * 100).toFixed(0)}%
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crosshair className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">MUNITIONS LAUNCHER</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOrdnancePicker(!showOrdnancePicker);
                      setShowTurretPicker(false);
                    }}
                    className={cn(
                      "w-full rounded-lg border p-2.5 text-left transition-all",
                      selectedOrdnance
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-dashed border-border hover:border-purple-500/30",
                    )}
                  >
                    <span className="text-sm font-medium">{selectedOrdnance?.name ?? "Select munitions launcher"}</span>
                    {selectedOrdnance && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        DMG {selectedOrdnance.damage} • CC {(selectedOrdnance.critChance * 100).toFixed(0)}% • FR {selectedOrdnance.fireRate}
                      </p>
                    )}
                  </button>
                  {showOrdnancePicker && (
                    <div className="mt-3 border border-border rounded-xl p-3 bg-card max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {allOrdnance.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            onClick={() => {
                              beginNewRailjackDraft();
                              setSelectedOrdnance(o);
                              setShowOrdnancePicker(false);
                            }}
                            className={cn(
                              "p-2 rounded-lg border text-left transition-all text-xs",
                              selectedOrdnance?.id === o.id
                                ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                                : "border-border hover:border-purple-500/30",
                            )}
                          >
                            <span className="font-medium">{o.name}</span>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              DMG {o.damage} • CC {(o.critChance * 100).toFixed(0)}% • FR {o.fireRate}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Plexus Mods ── */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">PLEXUS MODS</h2>

              {/* Tab selector */}
              <div className="flex gap-2 mb-4">
                {(["integrated", "battle", "tactical"] as PlexusTab[]).map((tab) => {
                  const count = tab === "integrated" ? integratedMods.length : tab === "battle" ? battleMods.length : tacticalMods.length;
                  const max = tab === "integrated" ? INTEGRATED_SLOTS : tab === "battle" ? BATTLE_SLOTS : TACTICAL_SLOTS;
                  return (
                    <button
                      key={tab}
                      onClick={() => setPlexusTab(tab)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize",
                        plexusTab === tab
                          ? "bg-rose-500/10 border-rose-500/50 text-rose-400"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab}
                      <span className="ml-1.5 text-[10px] opacity-70">{count}/{max}</span>
                    </button>
                  );
                })}
              </div>

              {/* Capacity bar */}
              <div className="flex items-center justify-end gap-2 mb-3">
                <span className={cn(
                  "text-xs font-mono",
                  capacityUsed > maxCapacity ? "text-red-400" : "text-muted-foreground"
                )}>
                  {capacityUsed} / {maxCapacity}
                </span>
              </div>

              {/* Mod slots */}
              <div className={cn(
                "grid gap-2",
                plexusTab === "integrated" ? "grid-cols-3 sm:grid-cols-3" : "grid-cols-3"
              )}>
                {Array.from({ length: currentSlotCount }, (_, i) => {
                  const equipped = currentMods.find((m) => m.slotIndex === i);
                  const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                  return (
                    <ModSlotCard
                      key={`${plexusTab}-${i}`}
                      mod={mod}
                      rank={equipped?.rank ?? 0}
                      slotIndex={i}
                      slotPolarity={currentPolarities[i]}
                      onAdd={() => { setActiveSlotIndex(i); setModPickerOpen(true); }}
                      onRemove={() => setCurrentMods((prev) => prev.filter((m) => m.slotIndex !== i))}
                      onPolarize={(p) => setCurrentPolarities((prev) => {
                        const next = { ...prev };
                        if (p) next[i] = p; else delete next[i];
                        return next;
                      })}
                    />
                  );
                })}
              </div>
            </div>

            {/* Simulation toggles for conditional mods & active abilities */}
            {showSimulationPanel && (
              <div className="border border-amber-500/20 rounded-xl p-4 bg-amber-500/5">
                <h3 className="text-xs font-semibold tracking-wider text-amber-800 mb-3 dark:text-amber-300">SIMULATION</h3>
                <div className="space-y-3 text-xs">
                  {hasCrimsonFugue && (
                    <div>
                      <label className="text-muted-foreground block mb-1">Crimson Fugue stacks (0–5)</label>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={1}
                        value={crimsonFugueStacks}
                        onChange={(e) => setCrimsonFugueStacks(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="font-mono text-amber-800 dark:text-amber-300">{crimsonFugueStacks}</span>
                    </div>
                  )}
                  {hasCruisingSpeed && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cruisingSpeedActive}
                        onChange={(e) => setCruisingSpeedActive(e.target.checked)}
                        className="rounded"
                      />
                      <span>Cruising Speed active (no enemies within 3000m)</span>
                    </label>
                  )}
                  {hasProtectiveShots && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={protectiveShotsActive}
                        onChange={(e) => setProtectiveShotsActive(e.target.checked)}
                        className="rounded"
                      />
                      <span>Protective Shots active (shields above 75%)</span>
                    </label>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shieldsDepleted}
                      onChange={(e) => setShieldsDepleted(e.target.checked)}
                      className="rounded"
                    />
                    <span>Shields depleted (house engine/shield combat traits)</span>
                  </label>
                  {(computedStats.battleAbilities?.some((a) => a.turretDamageWhileActive) || computedStats.tacticalAbilities?.some((a) => a.turretDamageWhileActive)) && (
                    <div className="space-y-2 pt-1 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground">Simulate active turret-boost ability:</p>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => { setActiveBattleAbilityId(null); setActiveTacticalAbilityId(null); }}
                          className={cn(
                            "px-2 py-1 rounded border text-[10px]",
                            !activeBattleAbilityId && !activeTacticalAbilityId ? "border-amber-500/50 text-amber-900 dark:text-amber-300" : "border-border text-muted-foreground",
                          )}
                        >
                          None
                        </button>
                        {computedStats.battleAbilities?.filter((a) => a.turretDamageWhileActive).map((a) => (
                          <button
                            key={a.modId}
                            type="button"
                            onClick={() => { setActiveBattleAbilityId(a.modId); setActiveTacticalAbilityId(null); }}
                            className={cn(
                              "px-2 py-1 rounded border text-[10px]",
                              activeBattleAbilityId === a.modId ? "border-amber-500/50 text-amber-900 dark:text-amber-300" : "border-border text-muted-foreground",
                            )}
                          >
                            {a.name}
                          </button>
                        ))}
                        {computedStats.tacticalAbilities?.filter((a) => a.turretDamageWhileActive).map((a) => (
                          <button
                            key={a.modId}
                            type="button"
                            onClick={() => { setActiveTacticalAbilityId(a.modId); setActiveBattleAbilityId(null); }}
                            className={cn(
                              "px-2 py-1 rounded border text-[10px]",
                              activeTacticalAbilityId === a.modId ? "border-amber-500/50 text-amber-900 dark:text-amber-300" : "border-border text-muted-foreground",
                            )}
                          >
                            {a.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Battle / Tactical abilities */}
            {plexusTab !== "integrated" && (computedStats.battleAbilities?.length || computedStats.tacticalAbilities?.length) ? (
              <div className="border border-border rounded-xl p-4 bg-card">
                <h3 className="text-xs font-semibold tracking-wider text-muted-foreground mb-3">
                  {plexusTab === "battle" ? "BATTLE ABILITIES" : "TACTICAL ABILITIES"}
                </h3>
                <div className="space-y-2">
                  {(plexusTab === "battle" ? computedStats.battleAbilities : computedStats.tacticalAbilities)?.map((ability) => (
                    <div key={ability.modId} className="rounded-lg border border-border/60 p-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{ability.name}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{ability.category}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{ability.description}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[10px] font-mono text-cyan-400">
                        {ability.energyCost !== undefined && <span>Energy {ability.energyCost}</span>}
                        {ability.cooldownSec !== undefined && <span>CD {ability.cooldownSec}s</span>}
                        {ability.turretDamageWhileActive !== undefined && (
                          <span>Turret +{(ability.turretDamageWhileActive * 100).toFixed(0)}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Armament Stats */}
            <div className="border border-border rounded-xl p-4 bg-card">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3">ARMAMENT STATS (WITH PLEXUS)</h3>
              {computedStats.artillery && (
                <div>
                  <div className="text-xs font-medium text-orange-400 mb-1.5">Forward Artillery — {computedStats.artillery.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Damage</span><span className="font-mono">{computedStats.artillery.damage}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Avg Shot</span><span className="font-mono text-cyan-400">{computedStats.artillery.avgShotDamage}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Crit Chance</span><span className="font-mono">{(computedStats.artillery.critChance * 100).toFixed(0)}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Crit Multi</span><span className="font-mono">{computedStats.artillery.critMultiplier.toFixed(1)}x</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Charge</span><span className="font-mono">{computedStats.artillery.chargeTime}s</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. DPS</span><span className="font-mono text-cyan-400">{computedStats.artillery.estimatedDps}</span></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">Paper only — Dome Charge economy not modeled.</p>
                </div>
              )}
              {computedStats.turrets.map((turret, index) => (
                <div key={turret.id} className={cn((index > 0 || computedStats.artillery) && "mt-3 pt-3 border-t border-border/50")}>
                  <div className="text-xs font-medium text-red-400 mb-1.5">Turret {index + 1} — {turret.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Damage</span><span className="font-mono">{turret.damage}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. DPS</span><span className="font-mono text-cyan-400">{turret.estimatedDps}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Crit Chance</span><span className="font-mono">{(turret.critChance * 100).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Crit Multi</span><span className="font-mono">{turret.critMultiplier.toFixed(1)}x</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-mono">{(turret.statusChance * 100).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Fire Rate</span><span className="font-mono">{turret.fireRate}</span></div>
                  </div>
                </div>
              ))}
              {computedStats.ordnance && (
                <div className={cn((computedStats.turrets.length > 0 || computedStats.artillery) && "mt-3 pt-3 border-t border-border/50")}>
                  <div className="text-xs font-medium text-purple-400 mb-1.5">Munitions — {computedStats.ordnance.name}</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Damage</span><span className="font-mono">{computedStats.ordnance.damage}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. DPS</span><span className="font-mono text-cyan-400">{computedStats.ordnance.estimatedDps}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Crit Chance</span><span className="font-mono">{(computedStats.ordnance.critChance * 100).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Crit Multi</span><span className="font-mono">{computedStats.ordnance.critMultiplier.toFixed(1)}x</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-mono">{(computedStats.ordnance.statusChance * 100).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Fire Rate</span><span className="font-mono">{computedStats.ordnance.fireRate}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Plexus Mod Picker */}
      <ModPicker
        open={modPickerOpen}
        onClose={() => setModPickerOpen(false)}
        mods={tabRailjackMods}
        category="_prefiltered"
        equippedModIds={currentMods.map((m) => m.modId)}
        onSelect={(mod, rank) => {
          setCurrentMods((prev) => {
            const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
            return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: activeSlotIndex, polarity: mod.polarity, drain: mod.drain }];
          });
        }}
      />

      <SavedBuildsDialog
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
        title="Saved Railjack Builds"
        builds={savedBuilds}
        accent="rose"
        getSubtitle={(build) => {
          const d = build.data as RailjackBuildData;
          const modCount = d.integratedMods.length + d.battleMods.length + d.tacticalMods.length;
          return `${modCount} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || "Railjack Build"}
        defaultIsPublic={buildIsPublic}
        showDescription={false}
        onSave={handleSaveBuildConfirm}
      />
    </PageShell>
  );
}
