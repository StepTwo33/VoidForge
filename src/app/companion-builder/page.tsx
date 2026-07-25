"use client";

import { useState, useMemo, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import {
  ItemPickerScreen,
  ItemPickerFilter,
  ItemPickerRow,
  BuilderItemHeader,
  BuilderActionBar,
  BuilderActionGroup,
} from "@/components/item-picker";
import { ModSlotCard } from "@/components/mod-slot";
import { ModPicker } from "@/components/mod-picker";
import { useCompanions, useWeapons, useMods } from "@/lib/weapons/use-data";
import { Companion, Mod, Weapon, EquippedMod, CompanionCalculatedStats, DEFAULT_SIM_PARAMS } from "@/lib/types";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { weaponSupportsHunterCompanionSet } from "@/lib/calc/set-bonuses";
import { mergeRivenStatChanges } from "@/lib/calc/weapon-stat-merges";
import { avgCritMultiplier, critTierDamage, critTiersToShow, critTierLabel, critTierColorClass, exceedsWarframeInt32 } from "@/lib/calc/crit-utils";
import {
  COMPANION_MAX_PRECEPTS,
  COMPANION_MOD_SLOT_COUNT,
  isCompanionPrecept,
} from "@/lib/mods/companion-augment-mods";
import {
  companionPreceptModsForBuilder,
  companionStatModsForBuilder,
  companionPreceptEligibleForCompanion,
  isCataloguedCompanionPrecept,
} from "@/lib/mods/companion-precept-eligibility";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Zap, Dog, Bot, Bug, Swords, Crosshair, Flag, Star, Save, FolderOpen } from "lucide-react";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, CompanionBuildData, persistSavedBuild } from "@/lib/builds/build-storage";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { cn } from "@/lib/utils";
import { appendReturnTo } from "@/lib/site/nav-return";
import { toast } from "sonner";
import { getCompanionImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { modSlotCapacityCost, modCapacityAtRank } from "@/lib/calc/mod-capacity";

const companionTypeLabels: Record<string, string> = {
  all: "All",
  sentinel: "Sentinels",
  kubrow: "Kubrows",
  kavat: "Kavats",
  moa: "MOAs",
  predasite: "Predasites",
  vulpaphyla: "Vulpaphylas",
  hound: "Hounds",
};

function getCompanionIcon(type: string) {
  switch (type) {
    case "sentinel": return <Bot className="h-4 w-4" />;
    case "kubrow": case "kavat": case "predasite": case "vulpaphyla": return <Dog className="h-4 w-4" />;
    case "hound": return <Bug className="h-4 w-4" />;
    default: return <Bot className="h-4 w-4" />;
  }
}

function getCompanionModSubCategory(companionType: string): string[] {
  switch (companionType) {
    case "sentinel": case "moa": case "hound":
      return ["universal", "robotic"];
    case "kubrow": case "kavat": case "predasite": case "vulpaphyla":
      return ["universal", "beast"];
    default:
      return ["universal"];
  }
}

import { getCompanionWeapons, resolveDefaultCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";

function StatRow({ label, value, highlighted, color }: { label: string; value: string; highlighted?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className={cn("text-sm", color || "text-muted-foreground")}>{label}</span>
      <span className={highlighted ? "text-sm font-bold text-cyan-400" : `text-sm font-mono ${color || ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function CompanionBuilderPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const builderReturnTo = useMemo(() => {
    const q = searchParams.toString();
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, searchParams]);

  const allCompanions = useCompanions();
  const allWeapons = useWeapons();
  const { mods: allMods, modsMap } = useMods();
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [equippedMods, setEquippedMods] = useState<EquippedMod[]>([]);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [companionSearch, setCompanionSearch] = useState("");
  const [companionType, setCompanionType] = useState("all");
  const [showCompanionList, setShowCompanionList] = useState(true);
  const [hasReactor, setHasReactor] = useState(false);
  const [isMR30, setIsMR30] = useState(false);
  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => getSavedBuilds("companion"));
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [pickerTab, setPickerTab] = useState<"catalog" | "saved">("catalog");
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  // Weapon state
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [weaponMods, setWeaponMods] = useState<EquippedMod[]>([]);
  const [activeWeaponSlotIndex, setActiveWeaponSlotIndex] = useState(0);
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [weaponSlotPolarities, setWeaponSlotPolarities] = useState<Record<number, string>>({});
  const [modPickerTarget, setModPickerTarget] = useState<"companion" | "weapon">("companion");
  const [weaponRivenStatsMap, setWeaponRivenStatsMap] = useState<Record<number, Record<string, number>>>();
  const [applyHunterVsSlash, setApplyHunterVsSlash] = useState(false);

  const handleSaveBuildConfirm = useCallback(async ({ name, description, isPublic, tags }: SaveBuildDialogValues) => {
    if (!selectedCompanion) return;
    const data: CompanionBuildData = {
      companionId: selectedCompanion.id,
      mods: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      weaponId: selectedWeapon?.id,
      weaponMods: weaponMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      weaponSlotPolarities,
      arcaneIds: [],
      hasReactor,
      hasCatalyst,
      isMR30,
      slotPolarities,
    };
    const build: SavedBuild = {
      id: currentBuildId || generateBuildId(),
      name,
      description,
      isPublic,
      tags,
      type: "companion",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data,
    };
    const result = await persistSavedBuild(build);
    setCurrentBuildId(result.id);
    setBuildName(name);
    setBuildDescription(description);
    setBuildIsPublic(result.isPublic);
    setSavedBuilds(result.builds);
    if (result.synced) {
      toast.success("Build saved", { description: `${name} saved to your account` });
    } else {
      toast.success("Build saved locally", { description: "Log in to sync builds to your account" });
    }
  }, [selectedCompanion, equippedMods, selectedWeapon, weaponMods, weaponSlotPolarities, hasReactor, hasCatalyst, isMR30, slotPolarities, currentBuildId]);

  const handleLoadBuild = useCallback((build: SavedBuild) => {
    const d = build.data as CompanionBuildData;
    const comp = allCompanions.find((c) => c.id === d.companionId);
    if (!comp) { toast.error("Companion not found"); return; }
    setSelectedCompanion(comp);
    setEquippedMods(d.mods.map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    const weaponCandidates = getCompanionWeapons(comp, allWeapons);
    if (d.weaponId) {
      setSelectedWeapon(weaponCandidates.find((w) => w.id === d.weaponId) ?? null);
    } else if ((d.weaponMods || []).length > 0) {
      setSelectedWeapon(resolveDefaultCompanionWeapon(comp, allWeapons));
    } else {
      setSelectedWeapon(null);
    }
    setWeaponMods((d.weaponMods || []).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    setHasReactor(d.hasReactor);
    setHasCatalyst(d.hasCatalyst ?? false);
    setIsMR30(d.isMR30);
    setSlotPolarities(d.slotPolarities || {});
    setWeaponSlotPolarities(d.weaponSlotPolarities || {});
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildDescription(build.description || "");
    setBuildIsPublic(build.isPublic ?? false);
    setShowSavedBuilds(false);
    setShowCompanionList(false);
    toast.info("Build loaded", { description: build.name });
  }, [allCompanions, allWeapons]);

  useCloudBuildFromUrl("companion", handleLoadBuild);
  useLocalBuildFromUrl("companion", handleLoadBuild);
  useLoadoutSlotFromUrl("companion", handleLoadBuild, allCompanions.length > 0);

  const handleDeleteBuild = useCallback((id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("companion"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId]);

  const filteredCompanions = useMemo(() => {
    let comps = [...allCompanions];
    if (companionType !== "all") {
      comps = comps.filter((c) => c.type === companionType);
    }
    if (companionSearch.trim()) {
      const q = companionSearch.toLowerCase();
      comps = comps.filter((c) => c.name.toLowerCase().includes(q));
    }
    return comps.sort((a, b) => a.name.localeCompare(b.name));
  }, [allCompanions, companionType, companionSearch]);

  const calculatedStats = useMemo<CompanionCalculatedStats | null>(() => {
    if (!selectedCompanion) return null;
    return calculateCompanionBuild(selectedCompanion, equippedMods);
  }, [selectedCompanion, equippedMods]);

  const baseCapacity = (hasReactor ? 60 : 30) + (isMR30 ? 10 : 0);
  const capacityUsed = useMemo(() => {
    return equippedMods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = slotPolarities[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [equippedMods, slotPolarities]);

  const companionPreceptMods = useMemo(() => {
    if (!selectedCompanion) return [];
    return companionPreceptModsForBuilder(selectedCompanion, allMods);
  }, [selectedCompanion]);

  const companionStatMods = useMemo(() => {
    if (!selectedCompanion) return allMods.filter((m) => m.category === "companion");
    const subCats = getCompanionModSubCategory(selectedCompanion.type);
    return companionStatModsForBuilder(selectedCompanion, allMods, subCats);
  }, [selectedCompanion]);

  const companionPickerMods = useMemo(() => {
    const seen = new Set<string>();
    const merged: Mod[] = [];
    for (const m of [...companionPreceptMods, ...companionStatMods]) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      merged.push(m);
    }
    return merged;
  }, [companionPreceptMods, companionStatMods]);

  const equippedPreceptCount = useMemo(() => {
    return equippedMods.filter((e) => {
      const m = modsMap.get(e.modId);
      return m && isCataloguedCompanionPrecept(m);
    }).length;
  }, [equippedMods, modsMap]);

  const availableWeapons = useMemo(() => {
    if (!selectedCompanion) return [];
    return getCompanionWeapons(selectedCompanion, allWeapons);
  }, [selectedCompanion, allWeapons]);

  const weaponStats = useMemo(() => {
    if (!selectedWeapon) return null;
    const rivenStatChanges = mergeRivenStatChanges(weaponRivenStatsMap, weaponMods);
    const linkage = {
      companionMods: equippedMods.map((m) => ({
        modId: m.modId,
        rank: m.rank,
        slotIndex: m.slotIndex,
      })),
    };
    return calculateWeaponBuild(
      selectedWeapon,
      weaponMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      modsMap,
      undefined,
      {
        ...DEFAULT_SIM_PARAMS,
        applyHunterSetVsSlashDamage: applyHunterVsSlash,
      },
      undefined,
      linkage,
      rivenStatChanges,
    );
  }, [selectedWeapon, weaponMods, weaponRivenStatsMap, modsMap, equippedMods, applyHunterVsSlash]);

  const weaponCapacity = hasCatalyst ? 60 : 30;
  const weaponCapacityUsed = useMemo(() => {
    return weaponMods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = weaponSlotPolarities[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [weaponMods, weaponSlotPolarities]);

  const weaponModPool = useMemo(() => {
    if (!selectedWeapon) return [];
    const cat = selectedWeapon.category;
    if (cat === "sentinel_weapon") {
      // Sentinel weapons use robotic weapon mods only
      return allMods.filter((m) =>
        m.category === "companion_weapon" ||
        (m.category === "companion" && (m.subCategory === "robotic" || m.subCategory === "universal"))
      );
    }
    if (cat === "beast_claw") {
      // Beast claws use companion weapon mods only (Bite, Maul, etc.) — NOT regular melee mods like Blood Rush
      return allMods.filter((m) =>
        m.category === "companion_weapon" ||
        (m.category === "companion" && (m.subCategory === "beast" || m.subCategory === "universal"))
      );
    }
    if (cat === "hound_weapon") {
      // Hound weapons use robotic weapon mods
      return allMods.filter((m) =>
        m.category === "companion_weapon" ||
        (m.category === "companion" && (m.subCategory === "robotic" || m.subCategory === "universal"))
      );
    }
    return allMods.filter((m) => m.category === "companion_weapon");
  }, [selectedWeapon]);

  const handleSelectCompanion = useCallback((companion: Companion) => {
    setSelectedCompanion(companion);
    setEquippedMods([]);
    setHasReactor(false);
    setSelectedWeapon(null);
    setWeaponMods([]);
    setHasCatalyst(false);
    setWeaponSlotPolarities({});
    setWeaponRivenStatsMap(undefined);
    setSlotPolarities({});
    setCurrentBuildId(null);
    setBuildName(`${companion.name} Build`);
    setBuildDescription("");
    setShowCompanionList(false);
  }, []);

  const handleOpenModPicker = useCallback((slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    setModPickerTarget("companion");
    setModPickerOpen(true);
  }, []);

  const handleOpenWeaponModPicker = useCallback((slotIndex: number) => {
    setActiveWeaponSlotIndex(slotIndex);
    setModPickerTarget("weapon");
    setModPickerOpen(true);
  }, []);

  const handleSelectMod = useCallback((mod: Mod, rank: number) => {
    if (modPickerTarget === "weapon") {
      setWeaponMods((prev) => {
        const filtered = prev.filter((m) => m.slotIndex !== activeWeaponSlotIndex);
        return [
          ...filtered,
          { modId: mod.id, modName: mod.name, rank, slotIndex: activeWeaponSlotIndex, polarity: mod.polarity, drain: mod.drain },
        ];
      });
    } else {
      if (!selectedCompanion) return;
      const isPrecept = isCataloguedCompanionPrecept(mod);
      if (isPrecept) {
        if (!companionPreceptEligibleForCompanion(selectedCompanion, mod)) return;
        const replacing = equippedMods.find((m) => m.slotIndex === activeSlotIndex);
        const replacingMod = replacing ? modsMap.get(replacing.modId) : undefined;
        const replacingPrecept = replacingMod && isCataloguedCompanionPrecept(replacingMod);
        if (equippedPreceptCount >= COMPANION_MAX_PRECEPTS && !replacingPrecept) return;
      } else if (isCompanionPrecept(mod)) {
        return;
      }
      setEquippedMods((prev) => {
        const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
        return [
          ...filtered,
          { modId: mod.id, modName: mod.name, rank, slotIndex: activeSlotIndex, polarity: mod.polarity, drain: mod.drain },
        ];
      });
    }
  }, [activeSlotIndex, activeWeaponSlotIndex, equippedMods, equippedPreceptCount, modPickerTarget, modsMap, selectedCompanion]);

  const handleRemoveMod = useCallback((slotIndex: number) => {
    setEquippedMods((prev) => prev.filter((m) => m.slotIndex !== slotIndex));
  }, []);

  const handleRemoveWeaponMod = useCallback((slotIndex: number) => {
    setWeaponMods((prev) => prev.filter((m) => m.slotIndex !== slotIndex));
    setWeaponRivenStatsMap((prev) => { if (!prev) return prev; const n = { ...prev }; delete n[slotIndex]; return n; });
  }, []);

  const handleSelectWeaponRiven = useCallback((mod: Mod, stats: Record<string, number>) => {
    setWeaponMods((prev) => {
      const filtered = prev.filter((m) => m.slotIndex !== activeWeaponSlotIndex);
      return [
        ...filtered,
        { modId: mod.id, modName: mod.name, rank: 0, slotIndex: activeWeaponSlotIndex, polarity: mod.polarity, drain: mod.drain },
      ];
    });
    setWeaponRivenStatsMap((prev) => ({ ...(prev || {}), [activeWeaponSlotIndex]: stats }));
  }, [activeWeaponSlotIndex]);

  const equippedModIds = modPickerTarget === "weapon"
    ? weaponMods.map((m) => m.modId)
    : equippedMods.map((m) => m.modId);

  return (
    <PageShell>

      <main className="flex-1 container mx-auto px-4 py-6">
        {showCompanionList || !selectedCompanion ? (
          <ItemPickerScreen
            icon={Dog}
            accent="cyan"
            title="Companion Builder"
            description="Choose a sentinel, kubrow, kavat, MOA, or other companion to configure."
            count={filteredCompanions.length}
            search={companionSearch}
            onSearchChange={setCompanionSearch}
            searchPlaceholder="Search companions..."
            pickerTab={pickerTab}
            onPickerTabChange={(tab) => {
              if (tab === "saved") setSavedBuilds(getSavedBuilds("companion"));
              setPickerTab(tab);
            }}
            savedPanel={
              savedBuilds.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No saved companion builds yet. Save a build from the builder to see it here.
                </p>
              ) : (
                savedBuilds.map((build) => {
                  const d = build.data as CompanionBuildData;
                  const compName = allCompanions.find((c) => c.id === d.companionId)?.name ?? d.companionId;
                  return (
                    <ItemPickerRow
                      key={build.id}
                      accent="cyan"
                      onClick={() => handleLoadBuild(build)}
                      title={build.name}
                      badge={
                        <span className="shrink-0 text-xs text-muted-foreground">{compName}</span>
                      }
                      meta={
                        <span className="text-xs text-muted-foreground">
                          {new Date(build.updatedAt).toLocaleDateString()}
                        </span>
                      }
                    />
                  );
                })
              )
            }
            filters={Object.entries(companionTypeLabels).map(([key, label]) => (
              <ItemPickerFilter
                key={key}
                active={companionType === key}
                onClick={() => setCompanionType(key)}
              >
                {label}
              </ItemPickerFilter>
            ))}
          >
            {filteredCompanions.map((comp) => (
              <ItemPickerRow
                key={comp.id}
                accent="cyan"
                onClick={() => handleSelectCompanion(comp)}
                image={
                  <GameAssetImage
                    src={getCompanionImage(comp.name)}
                    alt=""
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain"
                    hideOnError
                  />
                }
                title={
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-cyan-400">{getCompanionIcon(comp.type)}</span>
                    {comp.name}
                  </span>
                }
                badge={<span className="text-xs capitalize text-muted-foreground">{comp.type}</span>}
                meta={
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>HP {comp.health}</span>
                    <span>SH {comp.shield}</span>
                    <span>AR {comp.armor}</span>
                  </div>
                }
              >
                {comp.description && (
                  <p className="mt-1 truncate text-xs text-muted-foreground/70">{comp.description}</p>
                )}
              </ItemPickerRow>
            ))}
          </ItemPickerScreen>
        ) : (
          <div>
            <BuilderItemHeader
              onChange={() => setShowCompanionList(true)}
              image={
                <GameAssetImage
                  src={getCompanionImage(selectedCompanion.name)}
                  alt=""
                  width={40}
                  height={40}
                  className="hidden h-10 w-10 rounded-lg object-contain sm:block"
                  hideOnError
                />
              }
              title={selectedCompanion.name}
              subtitle={selectedCompanion.type}
            >
              <BuilderActionBar>
                <BuilderActionGroup>
                  <button
                    onClick={() => setSaveDialogOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-all font-medium"
                    title="Save Build"
                  >
                    <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
                  </button>
                  <button onClick={() => { setSavedBuilds(getSavedBuilds("companion")); setShowSavedBuilds(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all font-medium" title="Load Build">
                    <FolderOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Load</span>
                  </button>
                </BuilderActionGroup>

                <BuilderActionGroup>
                  <button
                    onClick={() => setIsMR30(!isMR30)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                      isMR30
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Star className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">MR 30+</span>
                  </button>
                  <button
                    onClick={() => setHasReactor(!hasReactor)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                      hasReactor
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reactor</span>
                  </button>
                </BuilderActionGroup>

                <div className="flex-1" />

                <a
                  href={appendReturnTo(
                    `/report-issue?type=companion&name=${encodeURIComponent(selectedCompanion.name)}&id=${encodeURIComponent(selectedCompanion.id)}`,
                    builderReturnTo,
                  )}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400/70 transition-colors hover:bg-amber-500/5 hover:text-amber-400"
                >
                  <Flag className="h-3 w-3" /> <span className="hidden sm:inline">Report</span>
                </a>
              </BuilderActionBar>
            </BuilderItemHeader>

            <div className="mb-6">
              <textarea
                value={buildDescription}
                onChange={(e) => setBuildDescription(e.target.value)}
                placeholder="Write a description for this build... (e.g. mechanics, synergies, how to play)"
                className="w-full h-24 p-3 bg-card border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/60 shadow-sm"
              />
            </div>

            {selectedCompanion.precept && (
              <div className="mb-4 p-3 border border-cyan-500/20 rounded-lg bg-cyan-500/5">
                <span className="text-[10px] font-semibold text-cyan-400 tracking-wider">PRECEPT</span>
                <p className="text-sm text-muted-foreground mt-1">{selectedCompanion.precept}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
                    MOD CONFIGURATION
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-muted-foreground">
                      {equippedPreceptCount}/{COMPANION_MAX_PRECEPTS} precepts
                    </span>
                    <span className={cn(
                      capacityUsed > baseCapacity ? "text-red-400" : "text-muted-foreground"
                    )}>
                      {capacityUsed} / {baseCapacity}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: COMPANION_MOD_SLOT_COUNT }, (_, i) => {
                    const equipped = equippedMods.find((m) => m.slotIndex === i);
                    const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                    const isPrecept = mod && isCataloguedCompanionPrecept(mod);
                    return (
                      <ModSlotCard
                        key={i}
                        mod={mod}
                        rank={equipped?.rank ?? 0}
                        slotIndex={i}
                        label={isPrecept ? "Precept" : undefined}
                        slotPolarity={slotPolarities[i]}
                        onAdd={() => handleOpenModPicker(i)}
                        onRemove={() => handleRemoveMod(i)}
                        onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; })}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="border border-border rounded-xl p-6 bg-card">
                  <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-4">COMPANION STATS</h3>
                  {calculatedStats ? (
                    <div className="space-y-0.5">
                      <StatRow label="Health" value={calculatedStats.totalHealth.toFixed(0)} />
                      <StatRow label="Shield" value={calculatedStats.totalShield.toFixed(0)} />
                      <StatRow label="Armor" value={calculatedStats.totalArmor.toFixed(0)} />
                      <div className="border-t border-border my-2" />
                      <StatRow label="Melee Dmg" value={`+${(calculatedStats.meleeDamageBonus * 100).toFixed(0)}%`} />
                      <StatRow label="Atk Speed" value={`+${(calculatedStats.attackSpeedBonus * 100).toFixed(0)}%`} />
                      <StatRow label="Crit Chance" value={`+${(calculatedStats.critChanceBonus * 100).toFixed(0)}%`} />
                      <StatRow label="Crit Dmg" value={`+${(calculatedStats.critDamageBonus * 100).toFixed(0)}%`} />
                      {calculatedStats.weakspotDamageBonus > 0 && (
                        <StatRow label="Weakspot Dmg" value={`+${(calculatedStats.weakspotDamageBonus * 100).toFixed(0)}%`} />
                      )}
                      {calculatedStats.finisherDamageBonus > 0 && (
                        <StatRow label="Finisher Dmg" value={`+${(calculatedStats.finisherDamageBonus * 100).toFixed(0)}%`} />
                      )}
                      {calculatedStats.impactStatusStacks > 0 && (
                        <StatRow label="Impact Stacks" value={`+${calculatedStats.impactStatusStacks.toFixed(0)}`} />
                      )}
                      {calculatedStats.pickupDoubleChance > 0 && (
                        <StatRow label="Pickup Double" value={`+${(calculatedStats.pickupDoubleChance * 100).toFixed(0)}%`} />
                      )}
                      {calculatedStats.reviveShieldHealth > 0 && (
                        <StatRow label="Revive Shield" value={calculatedStats.reviveShieldHealth.toFixed(0)} />
                      )}
                      <div className="border-t border-border my-2" />
                      <StatRow label="Effective HP" value={calculatedStats.effectiveHealth.toFixed(0)} highlighted />
                      <StatRow label="Dmg Reduction" value={`${calculatedStats.damageReduction.toFixed(1)}%`} highlighted />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select a companion to see stats</p>
                  )}
                </div>
              </div>

              {/* COMPANION WEAPON SECTION */}
              <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Swords className="h-5 w-5 text-orange-400" />
                  <h2 className="text-lg font-bold">Companion Weapon</h2>
                  {selectedWeapon && (
                    <button
                      onClick={() => setHasCatalyst(!hasCatalyst)}
                      className={cn(
                        "ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all",
                        hasCatalyst
                          ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      {hasCatalyst ? "Catalyst Installed" : "Orokin Catalyst"}
                    </button>
                  )}
                </div>

                {/* Weapon Selector */}
                {!selectedWeapon ? (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {availableWeapons.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No weapons available for this companion type</p>
                    ) : (
                      availableWeapons.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => { setSelectedWeapon(w); setWeaponMods([]); setHasCatalyst(false); setWeaponSlotPolarities({}); }}
                          className="w-full text-left p-2.5 rounded-lg border border-border hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{w.name}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{w.category.replace('_', ' ')}</span>
                          </div>
                          <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
                            <span>DMG {w.damage}</span>
                            <span>CC {(w.criticalChance * 100).toFixed(0)}%</span>
                            <span>CD {w.criticalMultiplier.toFixed(1)}x</span>
                            <span>SC {(w.statusChance * 100).toFixed(0)}%</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4 p-3 border border-orange-500/30 bg-orange-500/5 rounded-lg">
                      <Crosshair className="h-4 w-4 text-orange-400" />
                      <span className="font-medium text-sm">{selectedWeapon.name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{selectedWeapon.category.replace('_', ' ')}</span>
                      <button onClick={() => { setSelectedWeapon(null); setWeaponMods([]); setWeaponSlotPolarities({}); }} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Change</button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold tracking-wider text-muted-foreground">WEAPON MODS</h3>
                          <span className={cn(
                            "text-xs font-mono",
                            weaponCapacityUsed > weaponCapacity ? "text-red-400" : "text-muted-foreground"
                          )}>
                            {weaponCapacityUsed} / {weaponCapacity}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {Array.from({ length: 8 }, (_, i) => {
                            const equipped = weaponMods.find((m) => m.slotIndex === i);
                            const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                            return (
                              <ModSlotCard
                                key={`w${i}`}
                                mod={mod}
                                rank={equipped?.rank ?? 0}
                                slotIndex={i}
                                slotPolarity={weaponSlotPolarities[i]}
                                onAdd={() => handleOpenWeaponModPicker(i)}
                                onRemove={() => handleRemoveWeaponMod(i)}
                                onPolarize={(p) => setWeaponSlotPolarities((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; })}
                              />
                            );
                          })}
                        </div>
                      </div>

                      <div className="border border-border rounded-xl p-6 bg-card">
                        <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-4">WEAPON STATS</h3>
                        {weaponStats ? (
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-muted-foreground/70 mb-1">Hit damage (no multishot / fire rate)</p>
                            {(() => {
                              const hitBase = weaponStats.arsenalDamage?.totalDamage ?? weaponStats.totalDamage;
                              const cm = weaponStats.criticalMultiplier;
                              const cc = weaponStats.criticalChance;
                              const avgHit = hitBase * avgCritMultiplier(cc, cm);
                              const tiers = critTiersToShow(cc);
                              const showOverflow = [
                                hitBase,
                                ...tiers.map((t) => hitBase * critTierDamage(t, cm)),
                                avgHit,
                                weaponStats.burstDps,
                                weaponStats.sustainedDps,
                              ].some(exceedsWarframeInt32);
                              return (
                                <>
                                  <StatRow
                                    label="Non-crit hit"
                                    value={hitBase.toFixed(1)}
                                    highlighted
                                  />
                                  {tiers.map((tier) => (
                                    <StatRow
                                      key={tier}
                                      label={critTierLabel(tier)}
                                      value={(hitBase * critTierDamage(tier, cm)).toFixed(1)}
                                      color={critTierColorClass(tier)}
                                    />
                                  ))}
                                  <StatRow
                                    label="Avg hit"
                                    value={avgHit.toFixed(1)}
                                  />
                                  <p className="text-[9px] text-muted-foreground/70 mt-1 leading-snug">
                                    Orange/red+ are tier hit values; Avg hit only blends tiers your CC can roll.
                                  </p>                                  {showOverflow && (
                                    <p className="text-[9px] text-amber-500/90 mt-1.5 leading-snug">
                                      Note: values above ~2.147B can wrap to large negatives in-game (signed 32-bit). FrameHub shows uncapped math.
                                    </p>
                                  )}
                                </>
                              );
                            })()}
                            <div className="border-t border-border my-2" />
                            <StatRow label="Crit Chance" value={`${(weaponStats.criticalChance * 100).toFixed(1)}%`} />
                            <StatRow label="Crit Multi" value={`${weaponStats.criticalMultiplier.toFixed(2)}x`} />
                            <StatRow label="Status" value={`${(weaponStats.statusChancePerShot * 100).toFixed(1)}%`} />
                            <StatRow label="Fire Rate" value={(weaponStats.effectiveFireRate ?? weaponStats.fireRate).toFixed(2)} />
                            <StatRow label="Multishot" value={weaponStats.multishot.toFixed(2)} />
                            {weaponStats.magazine > 0 && (
                              <StatRow label="Magazine" value={`${weaponStats.magazine}`} />
                            )}
                            {weaponStats.reloadTime > 0 && (
                              <StatRow label="Reload" value={`${weaponStats.reloadTime.toFixed(2)}s`} />
                            )}
                            <div className="border-t border-border my-2" />
                            {weaponSupportsHunterCompanionSet(selectedWeapon) && (
                              <>
                                <label className="flex items-center gap-2 py-1 text-[11px] text-muted-foreground cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={applyHunterVsSlash}
                                    onChange={(e) => setApplyHunterVsSlash(e.target.checked)}
                                    className="rounded border-border"
                                  />
                                  Hunter set vs Slash-status DPS
                                </label>
                                {weaponStats.hunterSetVsSlashDamageMultiplier != null && (
                                  <StatRow
                                    label="Hunter vs Slash"
                                    value={`×${weaponStats.hunterSetVsSlashDamageMultiplier.toFixed(2)}`}
                                    color="text-amber-400"
                                  />
                                )}
                              </>
                            )}
                            <StatRow label="Burst DPS" value={weaponStats.burstDps.toFixed(0)} highlighted />
                            <StatRow label="Sustained DPS" value={weaponStats.sustainedDps.toFixed(0)} highlighted />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Select a weapon to see stats</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <ModPicker
        open={modPickerOpen}
        onClose={() => setModPickerOpen(false)}
        mods={modPickerTarget === "weapon" ? weaponModPool : companionPickerMods}
        category="_prefiltered"
        slotType="regular"
        equippedModIds={equippedModIds}
        onSelect={handleSelectMod}
        onSelectRiven={modPickerTarget === "weapon" ? handleSelectWeaponRiven : undefined}
        weaponCategory={selectedWeapon?.category}
      />

      <SavedBuildsDialog
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
        title="Saved Companion Builds"
        builds={savedBuilds}
        accent="green"
        getSubtitle={(build) => {
          const d = build.data as CompanionBuildData;
          const comp = allCompanions.find((c) => c.id === d.companionId);
          return `${comp?.name ?? d.companionId} • ${d.mods.length} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || (selectedCompanion ? `${selectedCompanion.name} Build` : "Companion Build")}
        defaultDescription={buildDescription}
        defaultIsPublic={buildIsPublic}
        onSave={handleSaveBuildConfirm}
      />
    </PageShell>
  );
}
