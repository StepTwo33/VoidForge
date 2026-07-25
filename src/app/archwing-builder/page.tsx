"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { ModSlotCard } from "@/components/mod-slot";
import { ModPicker } from "@/components/mod-picker";
import { useMods, useWeapons, useArchwings, useNecramechs } from "@/lib/weapons/use-data";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { filterArchmeleeMods } from "@/lib/mods/archmelee-mods";
import { archgunModsForBuilder } from "@/lib/mods/archgun-weapon-augment-mods";
import { isArchwingAugment, normalizeArchwingId } from "@/lib/mods/archwing-augment-mods";
import { Archwing, Necramech } from "@/data/archwing";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { buildWeaponContributionContext } from "@/lib/calc/dps-contributions";
import { calculateArchwingBuild, calculateNecramechBuild } from "@/lib/calc/archwing-calculator";
import { modSlotCapacityCost, modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { WeaponStatsPanel, ArchwingStatsPanel } from "@/components/stats-panel";
import { Weapon, EquippedMod, CalculatedStats, ArchwingCalculatedStats } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star, Zap, Save, FolderOpen } from "lucide-react";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, ArchwingBuildData, persistSavedBuild } from "@/lib/builds/build-storage";
import { toast } from "sonner";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";

type BuilderMode = "archwing" | "necramech";

export default function ArchwingBuilderPage() {
  const { mods: allMods, modsMap } = useMods();
  const allWeaponsData = useWeapons();
  const archwingList = useArchwings();
  const necramechList = useNecramechs();
  const [mode, setMode] = useState<BuilderMode>("archwing");

  // Archwing state
  const [selectedArchwing, setSelectedArchwing] = useState<Archwing | null>(null);
  const [archwingMods, setArchwingMods] = useState<EquippedMod[]>([]);
  const [archwingModPickerOpen, setArchwingModPickerOpen] = useState(false);
  const [archwingActiveSlot, setArchwingActiveSlot] = useState(0);
  const [archwingPolarities, setArchwingPolarities] = useState<Record<number, string>>({});

  // Necramech state
  const [selectedNecramech, setSelectedNecramech] = useState<Necramech | null>(null);
  const [necramechMods, setNecramechMods] = useState<EquippedMod[]>([]);
  const [necramechModPickerOpen, setNecramechModPickerOpen] = useState(false);
  const [necramechActiveSlot, setNecramechActiveSlot] = useState(0);
  const [necramechPolarities, setNecramechPolarities] = useState<Record<number, string>>({});

  // Weapon state (archgun/archmelee)
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [weaponMods, setWeaponMods] = useState<EquippedMod[]>([]);
  const [weaponModPickerOpen, setWeaponModPickerOpen] = useState(false);
  const [weaponActiveSlot, setWeaponActiveSlot] = useState(0);
  const [weaponPolarities, setWeaponPolarities] = useState<Record<number, string>>({});

  // Shared
  const [hasReactor, setHasReactor] = useState(false);
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [isMR30, setIsMR30] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildName, setBuildName] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => { setSavedBuilds(getSavedBuilds("archwing")); }, []);

  const handleSaveBuildConfirm = async ({ name, isPublic }: SaveBuildDialogValues) => {
    const data: ArchwingBuildData = {
      mode,
      frameId: mode === "archwing" ? selectedArchwing?.name : selectedNecramech?.name,
      frameMods: (mode === "archwing" ? archwingMods : necramechMods).map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      weaponId: selectedWeapon?.id,
      weaponMods: weaponMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      hasReactor,
      hasCatalyst,
      isMR30,
      framePolarities: mode === "archwing" ? archwingPolarities : necramechPolarities,
      weaponPolarities,
    };
    const build: SavedBuild = {
      id: currentBuildId || generateBuildId(),
      name,
      isPublic,
      type: "archwing",
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
  };

  const handleLoadBuild = useCallback((build: SavedBuild) => {
    const d = build.data as ArchwingBuildData;
    setMode(d.mode as BuilderMode);
    const restoreMods = (slots: { modId: string; rank: number; slotIndex: number }[]) =>
      slots.map((m) => { const mod = modsMap.get(m.modId); return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain }; });
    if (d.mode === "archwing") {
      setSelectedArchwing(
        archwingList.find(
          (a) =>
            a.name === d.frameId ||
            a.id === d.frameId ||
            a.id === normalizeArchwingId(String(d.frameId ?? "").toLowerCase().replace(/\s+/g, "_")) ||
            a.name === String(d.frameId ?? "").replace(/^Odenata/i, "Odonata"),
        ) ?? null,
      );
      setArchwingMods(restoreMods(d.frameMods));
      setArchwingPolarities(d.framePolarities || {});
    } else {
      setSelectedNecramech(necramechList.find((n) => n.name === d.frameId) ?? null);
      setNecramechMods(restoreMods(d.frameMods));
      setNecramechPolarities(d.framePolarities || {});
    }
    if (d.weaponId) {
      const found = allWeaponsData.find((w) => w.id === d.weaponId);
      setSelectedWeapon(found ? enrichWeapon(found) : null);
      setWeaponMods(restoreMods(d.weaponMods));
    }
    setHasReactor(d.hasReactor);
    setHasCatalyst(d.hasCatalyst);
    setIsMR30(d.isMR30);
    setWeaponPolarities(d.weaponPolarities || {});
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildIsPublic(build.isPublic ?? false);
    setShowSavedBuilds(false);
    toast.info("Build loaded", { description: build.name });
  }, []);

  useCloudBuildFromUrl("archwing", handleLoadBuild);

  const handleDeleteBuild = (id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("archwing"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  };

  // Filter archguns/archmelee from weapon data
  const archWeapons = useMemo(() => {
    return allWeaponsData
      .filter((w: Weapon) => w.category === "archgun" || w.category === "archmelee")
      .map(enrichWeapon);
  }, []);

  // Weapon stats
  const weaponStats = useMemo<CalculatedStats | null>(() => {
    if (!selectedWeapon) return null;
    return calculateWeaponBuild(selectedWeapon, weaponMods, modsMap);
  }, [selectedWeapon, weaponMods]);

  const weaponContributionContext = useMemo(() => {
    if (!selectedWeapon) return null;
    return buildWeaponContributionContext({
      weapon: selectedWeapon,
      modSlots: weaponMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
    });
  }, [selectedWeapon, weaponMods, modsMap]);

  const frameStats = useMemo<ArchwingCalculatedStats | null>(() => {
    if (mode === "archwing" && selectedArchwing) {
      return calculateArchwingBuild(selectedArchwing, archwingMods);
    }
    if (mode === "necramech" && selectedNecramech) {
      return calculateNecramechBuild(selectedNecramech, necramechMods);
    }
    return null;
  }, [mode, selectedArchwing, selectedNecramech, archwingMods, necramechMods]);

  const frameCapacity = (hasReactor ? 60 : 30) + (isMR30 ? 10 : 0);
  const weaponCapacity = (hasCatalyst ? 60 : 30) + (isMR30 ? 10 : 0);

  const frameModsUsed = useMemo(() => {
    const mods = mode === "archwing" ? archwingMods : necramechMods;
    const pols = mode === "archwing" ? archwingPolarities : necramechPolarities;
    return mods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = pols[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [mode, archwingMods, necramechMods, archwingPolarities, necramechPolarities]);

  const weaponModsUsed = useMemo(() => {
    return weaponMods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = weaponPolarities[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [weaponMods, weaponPolarities]);

  // Archwing / necramech mod pools
  const filteredFrameMods = useMemo(() => {
    if (mode === "necramech") {
      return allMods.filter((m) => m.category === "necramech");
    }
    return allMods.filter(
      (m) => m.category === "archwing" || isArchwingAugment(m),
    );
  }, [mode]);

  // Archgun and arch-melee each use their own mod pools (not ground weapon mods).
  const filteredWeaponMods = useMemo(() => {
    if (!selectedWeapon) return [];
    if (selectedWeapon.category === "archgun") {
      return archgunModsForBuilder(selectedWeapon.id);
    }
    if (selectedWeapon.category === "archmelee") {
      return filterArchmeleeMods(allMods);
    }
    return [];
  }, [selectedWeapon]);

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-xl sm:text-3xl font-bold">Archwing & Necramech Builder</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setSaveDialogOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-green-400 hover:border-green-500/50 transition-all" title="Save Build">
              <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={() => { setSavedBuilds(getSavedBuilds("archwing")); setShowSavedBuilds(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-blue-400 hover:border-blue-500/50 transition-all" title="Load Build">
              <FolderOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Load</span>
            </button>
          </div>
        </div>
        <p className="text-muted-foreground mb-6">Build Archwings, Necramechs, and their weapons</p>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
          {(["archwing", "necramech"] as BuilderMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setSelectedWeapon(null);
                setWeaponMods([]);
                setCurrentBuildId(null);
                setBuildName("");
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize",
                mode === m
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Frame selection + mods */}
          <div className="space-y-6">
            {/* Frame selection */}
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3">
                {mode === "archwing" ? "SELECT ARCHWING" : "SELECT NECRAMECH"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mode === "archwing" ? archwingList.map((aw) => (
                  <button
                    key={aw.id}
                    onClick={() => {
                      setSelectedArchwing(aw);
                      setArchwingMods([]);
                      setArchwingPolarities({});
                      setCurrentBuildId(null);
                      setBuildName(`${aw.name} Build`);
                    }}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      selectedArchwing?.id === aw.id
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                        : "border-border hover:border-cyan-500/30"
                    )}
                  >
                    <span className="font-medium text-sm">{aw.name}</span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      HP {aw.health} • SH {aw.shield} • ARM {aw.armor}
                    </div>
                  </button>
                )) : necramechList.map((nm) => (
                  <button
                    key={nm.id}
                    onClick={() => {
                      setSelectedNecramech(nm);
                      setNecramechMods([]);
                      setNecramechPolarities({});
                      setCurrentBuildId(null);
                      setBuildName(`${nm.name} Build`);
                    }}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      selectedNecramech?.id === nm.id
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                        : "border-border hover:border-cyan-500/30"
                    )}
                  >
                    <span className="font-medium text-sm">{nm.name}</span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      HP {nm.health} • ARM {nm.armor} • EN {nm.energy}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame mod slots */}
            {((mode === "archwing" && selectedArchwing) || (mode === "necramech" && selectedNecramech)) && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
                    {mode === "archwing" ? "ARCHWING MODS" : "NECRAMECH MODS"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMR30(!isMR30)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all",
                        isMR30 ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "border-border text-muted-foreground"
                      )}
                    >
                      <Star className="h-3.5 w-3.5" /> MR 30+
                    </button>
                    <button
                      onClick={() => setHasReactor(!hasReactor)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all",
                        hasReactor ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "border-border text-muted-foreground"
                      )}
                    >
                      <Zap className="h-3.5 w-3.5" /> Reactor
                    </button>
                    <span className={cn(
                      "text-xs font-mono",
                      frameModsUsed > frameCapacity ? "text-red-400" : "text-muted-foreground"
                    )}>
                      {frameModsUsed} / {frameCapacity}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Array.from({ length: mode === "necramech" ? 12 : 8 }, (_, i) => {
                    const mods = mode === "archwing" ? archwingMods : necramechMods;
                    const pols = mode === "archwing" ? archwingPolarities : necramechPolarities;
                    const equipped = mods.find((m) => m.slotIndex === i);
                    const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                    return (
                      <ModSlotCard
                        key={i}
                        mod={mod}
                        rank={equipped?.rank ?? 0}
                        slotIndex={i}
                        slotPolarity={pols[i]}
                        onAdd={() => {
                          if (mode === "archwing") { setArchwingActiveSlot(i); setArchwingModPickerOpen(true); }
                          else { setNecramechActiveSlot(i); setNecramechModPickerOpen(true); }
                        }}
                        onRemove={() => {
                          if (mode === "archwing") setArchwingMods((prev) => prev.filter((m) => m.slotIndex !== i));
                          else setNecramechMods((prev) => prev.filter((m) => m.slotIndex !== i));
                        }}
                        onPolarize={(p) => {
                          const setter = mode === "archwing" ? setArchwingPolarities : setNecramechPolarities;
                          setter((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; });
                        }}
                      />
                    );
                  })}
                </div>

                {/* Stats display */}
                <div className="mt-4">
                  <ArchwingStatsPanel
                    stats={frameStats}
                    title={mode === "archwing" ? "ARCHWING STATS" : "NECRAMECH STATS"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Weapon selection + mods */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3">
                {mode === "archwing" ? "ARCHGUN / ARCHMELEE" : "ARCHGUN (NECRAMECH)"}
              </h2>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                {archWeapons
                  .filter((w) => mode === "necramech" ? w.category === "archgun" : true)
                  .map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWeapon(w);
                      setWeaponMods([]);
                      setWeaponPolarities({});
                      setCurrentBuildId(null);
                      setBuildName(`${w.name} Build`);
                    }}
                    className={cn(
                      "p-2.5 rounded-lg border text-left transition-all text-sm",
                      selectedWeapon?.id === w.id
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                        : "border-border hover:border-cyan-500/30"
                    )}
                  >
                    <span className="font-medium">{w.name}</span>
                    <span className={cn("ml-1.5 text-[10px]", w.category === "archgun" ? "text-blue-400" : "text-green-400")}>
                      {w.category}
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      DMG {w.damage} • CC {(w.criticalChance * 100).toFixed(0)}% • SC {(w.statusChance * 100).toFixed(0)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedWeapon && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">WEAPON MODS</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHasCatalyst(!hasCatalyst)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all",
                        hasCatalyst ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "border-border text-muted-foreground"
                      )}
                    >
                      <Zap className="h-3.5 w-3.5" /> Catalyst
                    </button>
                    <span className={cn(
                      "text-xs font-mono",
                      weaponModsUsed > weaponCapacity ? "text-red-400" : "text-muted-foreground"
                    )}>
                      {weaponModsUsed} / {weaponCapacity}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Array.from({ length: selectedWeapon.modSlots }, (_, i) => {
                    const equipped = weaponMods.find((m) => m.slotIndex === i);
                    const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                    return (
                      <ModSlotCard
                        key={i}
                        mod={mod}
                        rank={equipped?.rank ?? 0}
                        slotIndex={i}
                        slotPolarity={weaponPolarities[i]}
                        onAdd={() => { setWeaponActiveSlot(i); setWeaponModPickerOpen(true); }}
                        onRemove={() => setWeaponMods((prev) => prev.filter((m) => m.slotIndex !== i))}
                        onPolarize={(p) => setWeaponPolarities((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; })}
                      />
                    );
                  })}
                </div>

                {/* Weapon stats */}
                {weaponStats && (
                  <div className="mt-4 border border-border rounded-xl p-4 bg-card">
                    <WeaponStatsPanel
                      stats={weaponStats}
                      weapon={selectedWeapon ?? undefined}
                      isMelee={selectedWeapon?.category === "archmelee"}
                      contributionContext={weaponContributionContext}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Archwing Mod Picker */}
      <ModPicker
        open={archwingModPickerOpen}
        onClose={() => setArchwingModPickerOpen(false)}
        mods={filteredFrameMods}
        category="archwing"
        archwingId={selectedArchwing?.id}
        equippedModIds={archwingMods.map((m) => m.modId)}
        onSelect={(mod, rank) => {
          setArchwingMods((prev) => {
            const filtered = prev.filter((m) => m.slotIndex !== archwingActiveSlot);
            return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: archwingActiveSlot, polarity: mod.polarity, drain: mod.drain }];
          });
        }}
      />

      {/* Necramech Mod Picker */}
      <ModPicker
        open={necramechModPickerOpen}
        onClose={() => setNecramechModPickerOpen(false)}
        mods={filteredFrameMods}
        category="_prefiltered"
        equippedModIds={necramechMods.map((m) => m.modId)}
        onSelect={(mod, rank) => {
          setNecramechMods((prev) => {
            const filtered = prev.filter((m) => m.slotIndex !== necramechActiveSlot);
            return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: necramechActiveSlot, polarity: mod.polarity, drain: mod.drain }];
          });
        }}
      />

      {/* Weapon Mod Picker */}
      <ModPicker
        open={weaponModPickerOpen}
        onClose={() => setWeaponModPickerOpen(false)}
        mods={filteredWeaponMods}
        category="_prefiltered"
        equippedModIds={weaponMods.map((m) => m.modId)}
        onSelect={(mod, rank) => {
          setWeaponMods((prev) => {
            const filtered = prev.filter((m) => m.slotIndex !== weaponActiveSlot);
            return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: weaponActiveSlot, polarity: mod.polarity, drain: mod.drain }];
          });
        }}
      />

      <SavedBuildsDialog
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
        title="Saved Archwing/Necramech Builds"
        builds={savedBuilds}
        accent="cyan"
        getSubtitle={(build) => {
          const d = build.data as ArchwingBuildData;
          return `${d.mode} • ${d.frameMods.length + d.weaponMods.length} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || `${(mode === "archwing" ? selectedArchwing?.name : selectedNecramech?.name) ?? mode} Build`}
        defaultIsPublic={buildIsPublic}
        showDescription={false}
        onSave={handleSaveBuildConfirm}
      />
    </PageShell>
  );
}
