"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { WeaponStatsPanel } from "@/components/stats-panel";
import { ModPicker, type SlotType } from "@/components/mod-picker";
import { useWeapons, useMods } from "@/lib/weapons/use-data";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { mergeIncarnonStatChanges, mergeRivenStatChanges } from "@/lib/calc/weapon-stat-merges";
import { resolveIncarnonActiveWeapon, isIncarnonFormActive } from "@/lib/calc/incarnon-active-weapon";
import { Weapon, Mod, CalculatedStats, EquippedMod, SimulationParams, DEFAULT_SIM_PARAMS, WeaponCalculationOptions } from "@/lib/types";
import { applyGravimagMode, weaponHasGravimagMode } from "@/lib/weapons/weapon-gravimag";
import { applyAlternateMode, weaponHasAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { applyArbucepAttackMode } from "@/lib/weapons/weapon-arbucep-mode";
import {
  weaponSupportsProgenitor,
  PROGENITOR_BONUS_DEFAULT,
} from "@/lib/weapons/weapon-progenitor";
import { Zap, Flag, Flame, Plus, X, Gem, Star, Save, FolderOpen, Share2, Check, Upload, Crosshair, Orbit, Swords } from "lucide-react";
import { isPrimaryWeaponCategory } from "@/lib/mods/mod-weapon-eligibility";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import { incarnonDataMap } from "@/data/incarnon";
import { cn } from "@/lib/utils";
import { appendReturnTo } from "@/lib/site/nav-return";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, WeaponBuildData, persistSavedBuild, resolveSavedArcaneSlots, resolveArcaneById } from "@/lib/builds/build-storage";
import { extractBuildFromUrl, ShareableBuild } from "@/lib/builds/build-url";
import { shareBuilderBuild } from "@/lib/builds/share-build";
import { toast } from "sonner";
import { getWeaponImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { BuildImporter } from "@/components/build-importer";
import { useCloudBuildFromUrl, fetchCloudBuild, setCloudBuildInUrl, clearCloudBuildInUrl, markCloudBuildLoaded } from "@/lib/builds/use-cloud-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { CommunityBuildsPanel } from "@/components/community-builds-panel";
import { isCompanionWeaponCategory } from "@/lib/weapons/companion-weapons";
import { computeUsedCapacity } from "@/lib/calc/compute-used-capacity";
import { WEAPON_CATEGORY_LABELS, getModCategory } from "@/lib/weapons/weapon-categories";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { StancePickerDialog } from "./stance-picker-dialog";
import { ProgenitorControls } from "./progenitor-controls";
import { IncarnonEvolutionsSection } from "./incarnon-evolutions-section";

/** 9th slot (index 8) for primary / secondary / melee — in-game weapon Exilus slot. */
const WEAPON_EXILUS_SLOT_INDEX = 8;

export default function WeaponBuilderPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const builderReturnTo = useMemo(() => {
    const q = searchParams.toString();
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, searchParams]);

  const allWeapons = useWeapons();
  const { mods: allMods, modsMap } = useMods();
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [equippedMods, setEquippedMods] = useState<EquippedMod[]>([]);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [modPickerSlotType, setModPickerSlotType] = useState<SlotType>("regular");
  const [weaponSearch, setWeaponSearch] = useState("");
  const [weaponCategory, setWeaponCategory] = useState("all");
  const [showWeaponList, setShowWeaponList] = useState(true);
  const [hasOrokinCatalyst, setHasOrokinCatalyst] = useState(false);
  const [isMR30, setIsMR30] = useState(false);
  const [selectedEvolutions, setSelectedEvolutions] = useState<Record<number, number>>({}); // tier -> slot
  const [rivenStatsMap, setRivenStatsMap] = useState<Record<number, Record<string, number>>>({});
  const [equippedArcanes, setEquippedArcanes] = useState<(Mod | null)[]>([null, null]);
  const [arcanePickerOpen, setArcanePickerOpen] = useState(false);
  const [activeArcaneSlot, setActiveArcaneSlot] = useState(0);
  const [stanceMod, setStanceMod] = useState<Mod | null>(null);
  const [stancePickerOpen, setStancePickerOpen] = useState(false);
  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => getSavedBuilds("weapon"));
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveDialogDefaultPublic, setSaveDialogDefaultPublic] = useState(false);
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [pickerTab, setPickerTab] = useState<"catalog" | "saved">("catalog");
  const [showImporter, setShowImporter] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [simParams, setSimParams] = useState<SimulationParams>({ ...DEFAULT_SIM_PARAMS });
  const [progenitorElement, setProgenitorElement] = useState<string>("heat");
  const [progenitorBonusPercent, setProgenitorBonusPercent] = useState(PROGENITOR_BONUS_DEFAULT);
  const [gravimagMode, setGravimagMode] = useState(false);
  const [alternateMode, setAlternateMode] = useState(false);

  /** Archgun Gravimag / alternate fire-form / Arbucep cycle, then Incarnon resolution. */
  const activeWeapon = useMemo<Weapon | null>(() => {
    if (!selectedWeapon) return null;
    let w = selectedWeapon;
    if (gravimagMode && weaponHasGravimagMode(selectedWeapon)) w = applyGravimagMode(selectedWeapon);
    if (alternateMode && weaponHasAlternateMode(w)) w = applyAlternateMode(w);
    if (w.id === "arbucep") {
      w = applyArbucepAttackMode(w, simParams.arbucepAttackMode, { atmosphere: gravimagMode });
    }
    const data = incarnonDataMap.get(w.id);
    return resolveIncarnonActiveWeapon(w, data, selectedEvolutions, {
      onosIncarnonMode: simParams.onosIncarnonMode,
    });
  }, [
    selectedWeapon,
    gravimagMode,
    alternateMode,
    selectedEvolutions,
    simParams.onosIncarnonMode,
    simParams.arbucepAttackMode,
  ]);

  const weaponCalcOptions = useMemo<WeaponCalculationOptions | undefined>(() => {
    const data = selectedWeapon ? incarnonDataMap.get(selectedWeapon.id) : undefined;
    const formActive = isIncarnonFormActive(selectedEvolutions, data);
    const progenitor =
      selectedWeapon && weaponSupportsProgenitor(selectedWeapon)
        ? { progenitorElement, progenitorBonusPercent }
        : undefined;
    if (!progenitor && !formActive) return undefined;
    return {
      ...(progenitor ?? {}),
      ...(formActive ? { incarnonFormActive: true } : {}),
    };
  }, [selectedWeapon, progenitorElement, progenitorBonusPercent, selectedEvolutions]);

  // Load build from URL ?build= param
  useEffect(() => {
    queueMicrotask(() => {
      if (allWeapons.length === 0) return;
      const params = new URLSearchParams(window.location.search);
      const shared = extractBuildFromUrl(params);
      if (!shared || shared.type !== "weapon") return;
      const weapon = allWeapons.find((w) => w.id === shared.itemId);
      if (!weapon) return;
      if (isCompanionWeaponCategory(weapon.category)) {
        toast.error("Companion weapons are built in Companion Builder", {
          description: `${weapon.name} — open Companion Builder to configure this weapon.`,
          action: {
            label: "Open",
            onClick: () => {
              window.location.href = "/companion-builder";
            },
          },
        });
        const url = new URL(window.location.href);
        url.searchParams.delete("build");
        const qs = url.searchParams.toString();
        window.history.replaceState({}, "", qs ? `${url.pathname}?${qs}` : url.pathname);
        return;
      }
      setSelectedWeapon(weapon);
      setShowWeaponList(false);
      const mods: EquippedMod[] = shared.mods.map((m, i) => {
        const mod = modsMap.get(m.id);
        return { modId: m.id, modName: mod?.name ?? "", rank: m.rank, slotIndex: i, polarity: mod?.polarity, drain: mod?.drain };
      });
      setEquippedMods(mods);
      if (shared.arcanes) {
        setEquippedArcanes(shared.arcanes.map((id) => (id ? resolveArcaneById(id) : null)));
      }
      setCurrentBuildId(null);
      setBuildName(`${weapon.name} Build`);
      setBuildDescription("");
      if (shared.progenitorElement) setProgenitorElement(shared.progenitorElement);
      if (shared.progenitorBonusPercent != null) setProgenitorBonusPercent(shared.progenitorBonusPercent);
      if (shared.hasOrokinCatalyst != null) setHasOrokinCatalyst(shared.hasOrokinCatalyst);
      if (shared.isMR30 != null) setIsMR30(shared.isMR30);
      if (shared.slotPolarities) setSlotPolarities(shared.slotPolarities);
      const sharedIncarnon = (shared as ShareableBuild & { incarnonEvolutions?: Record<number, number> }).incarnonEvolutions;
      if (sharedIncarnon) setSelectedEvolutions(sharedIncarnon);
      const url = new URL(window.location.href);
      url.searchParams.delete("build");
      const qs = url.searchParams.toString();
      window.history.replaceState({}, "", qs ? `${url.pathname}?${qs}` : url.pathname);
    });
  }, [allWeapons]);

  const buildWeaponData = useCallback((): WeaponBuildData | null => {
    if (!selectedWeapon) return null;
    return {
      weaponId: selectedWeapon.id,
      mods: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      stanceModId: stanceMod?.id,
      arcaneIds: equippedArcanes.map((a) => a?.id ?? null),
      hasOrokinCatalyst,
      isMR30,
      slotPolarities,
      ...(weaponCalcOptions?.progenitorElement != null
        ? {
            progenitorElement: weaponCalcOptions.progenitorElement,
            progenitorBonusPercent: weaponCalcOptions.progenitorBonusPercent,
          }
        : {}),
      ...(Object.keys(selectedEvolutions).length > 0 ? { incarnonEvolutions: selectedEvolutions } : {}),
    };
  }, [selectedWeapon, equippedMods, stanceMod, equippedArcanes, hasOrokinCatalyst, isMR30, slotPolarities, weaponCalcOptions, selectedEvolutions]);

  const applyLoadedBuild = useCallback((build: SavedBuild, options?: { silent?: boolean }) => {
    const d = build.data as WeaponBuildData;
    const weapon = allWeapons.find((w) => w.id === d.weaponId);
    if (!weapon) { toast.error("Weapon not found"); return; }
    if (isCompanionWeaponCategory(weapon.category)) {
      toast.error("Companion weapons are built in Companion Builder", {
        description: build.name,
        action: {
          label: "Open",
          onClick: () => {
            window.location.href = "/companion-builder";
          },
        },
      });
      return;
    }
    setSelectedWeapon(weapon);
    setEquippedMods(d.mods.map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    if (d.stanceModId) {
      const sm = allMods.find((m) => m.id === d.stanceModId);
      setStanceMod(sm ?? null);
    } else {
      setStanceMod(null);
    }
    setEquippedArcanes(resolveSavedArcaneSlots(d.arcaneIds, 2));
    setHasOrokinCatalyst(d.hasOrokinCatalyst);
    setIsMR30(d.isMR30);
    setSlotPolarities(d.slotPolarities || {});
    if (weaponSupportsProgenitor(weapon)) {
      setProgenitorElement(d.progenitorElement ?? "heat");
      setProgenitorBonusPercent(d.progenitorBonusPercent ?? PROGENITOR_BONUS_DEFAULT);
    } else {
      setProgenitorElement("heat");
      setProgenitorBonusPercent(PROGENITOR_BONUS_DEFAULT);
    }
    setCurrentBuildId(build.id || null);
    setBuildName(build.name);
    setBuildDescription(build.description || "");
    setBuildIsPublic(build.isPublic ?? false);
    setSelectedEvolutions(d.incarnonEvolutions ?? {});
    const rivens: Record<number, Record<string, number>> = {};
    for (const m of d.mods) {
      if (m.rivenStats && Object.keys(m.rivenStats).length > 0) rivens[m.slotIndex] = m.rivenStats;
    }
    setRivenStatsMap(rivens);
    setShowSavedBuilds(false);
    setShowWeaponList(false);
    if (!options?.silent) {
      toast.info("Build loaded", { description: build.name });
    }
  }, [allWeapons]);

  const handleSaveBuildConfirm = useCallback(async ({ name, description, isPublic, tags }: SaveBuildDialogValues) => {
    const data = buildWeaponData();
    if (!data || !selectedWeapon) return;
    const build: SavedBuild = {
      id: currentBuildId || generateBuildId(),
      name,
      description,
      isPublic,
      tags,
      type: "weapon",
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
  }, [buildWeaponData, selectedWeapon, currentBuildId]);

  const handleLoadCommunityBuild = useCallback(async (buildId: string) => {
    const build = await fetchCloudBuild(buildId);
    if (!build) {
      toast.error("Could not load build");
      return;
    }
    setCloudBuildInUrl(buildId);
    markCloudBuildLoaded(buildId);
    applyLoadedBuild(build);
  }, [applyLoadedBuild]);

  const handleLoadBuild = useCallback((build: SavedBuild) => {
    applyLoadedBuild(build);
  }, [applyLoadedBuild]);

  useCloudBuildFromUrl("weapon", (build) => applyLoadedBuild(build, { silent: true }));
  useLocalBuildFromUrl("weapon", (build) => applyLoadedBuild(build, { silent: true }));
  useLoadoutSlotFromUrl(
    "weapon",
    useCallback((build) => applyLoadedBuild(build, { silent: true }), [applyLoadedBuild]),
    allWeapons.length > 0,
  );

  const handleDeleteBuild = useCallback((id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("weapon"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId]);

  const [shareCopied, setShareCopied] = useState(false);
  const handleShareBuild = useCallback(async () => {
    if (!selectedWeapon) return;

    const outcome = await shareBuilderBuild({
      isPublic: buildIsPublic,
      buildId: currentBuildId,
      fallback: {
        type: "weapon",
        itemId: selectedWeapon.id,
        mods: equippedMods.map((m) => ({ id: m.modId, rank: m.rank })),
        arcanes: equippedArcanes.map((a) => a?.id ?? ""),
        hasOrokinCatalyst,
        isMR30,
        slotPolarities: slotPolarities as Record<string, string>,
        ...(weaponCalcOptions?.progenitorElement != null
          ? {
              progenitorElement: weaponCalcOptions.progenitorElement,
              progenitorBonusPercent: weaponCalcOptions.progenitorBonusPercent,
            }
          : {}),
        ...(Object.keys(selectedEvolutions).length > 0
          ? { incarnonEvolutions: selectedEvolutions }
          : {}),
      },
    });

    if (outcome.kind === "copied") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [
    selectedWeapon,
    equippedMods,
    equippedArcanes,
    hasOrokinCatalyst,
    isMR30,
    slotPolarities,
    weaponCalcOptions,
    selectedEvolutions,
    buildIsPublic,
    currentBuildId,
  ]);

  const filteredWeapons = useMemo(() => {
    const hiddenCategories = [
      "amp_prism",
      "zaw_strike",
      "kitgun_chamber",
      "sentinel_weapon",
      "hound_weapon",
      "beast_claw",
    ];
    let weapons = allWeapons.filter((w) => !hiddenCategories.includes(w.category));
    if (weaponCategory !== "all") {
      weapons = weapons.filter((w) => w.category === weaponCategory);
    }
    if (weaponSearch.trim()) {
      const q = weaponSearch.toLowerCase();
      weapons = weapons.filter((w) => w.name.toLowerCase().includes(q));
    }
    return weapons.sort((a, b) => a.name.localeCompare(b.name));
  }, [allWeapons, weaponCategory, weaponSearch]);

  // Get Incarnon evolution data for selected weapon
  const incarnonData = selectedWeapon ? incarnonDataMap.get(selectedWeapon.id) : undefined;
  const isIncarnon = !!(incarnonData || selectedWeapon?.isIncarnon);

  // Merge selected incarnon evolution / riven stat changes
  const incarnonStatChanges = useMemo(
    () =>
      mergeIncarnonStatChanges(incarnonData, selectedEvolutions, selectedWeapon?.id, {
        formActive: isIncarnonFormActive(selectedEvolutions, incarnonData),
        chargeMode: simParams.onosIncarnonMode === "charge",
      }),
    [incarnonData, selectedEvolutions, selectedWeapon?.id, simParams.onosIncarnonMode],
  );

  const rivenStatChanges = useMemo(
    () => mergeRivenStatChanges(rivenStatsMap, equippedMods),
    [rivenStatsMap, equippedMods],
  );

  const calculatedStats = useMemo<CalculatedStats | null>(() => {
    if (!activeWeapon) return null;
    const modSlots = equippedMods.map((m) => ({
      modId: m.modId,
      rank: m.rank,
      slotIndex: m.slotIndex,
    }));
    const activeArcanes = equippedArcanes.filter((a): a is Mod => a !== null);
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(activeWeapon, modSlots, modsMap, activeArcanes, incarnonStatChanges, simParams, weaponCalcOptions, undefined, rivenStatChanges);
    }
    return calculateWeaponBuild(activeWeapon, modSlots, modsMap, incarnonStatChanges, simParams, weaponCalcOptions, undefined, rivenStatChanges);
  }, [activeWeapon, equippedMods, equippedArcanes, incarnonStatChanges, rivenStatChanges, simParams, weaponCalcOptions]);

  const contributionContext = useMemo(() => {
    if (!activeWeapon) return null;
    return {
      baseWeapon: activeWeapon,
      modSlots: equippedMods.map((m) => ({
        modId: m.modId,
        rank: m.rank,
        slotIndex: m.slotIndex,
      })),
      allMods: modsMap,
      arcanes: equippedArcanes.filter((a): a is Mod => a !== null),
      incarnonStatChanges,
      simParams,
      calcOptions: weaponCalcOptions,
      rivenStatChanges,
    };
  }, [activeWeapon, equippedMods, equippedArcanes, incarnonStatChanges, simParams, weaponCalcOptions, rivenStatChanges, modsMap]);

  const baseStats = useMemo<CalculatedStats | null>(() => {
    if (!activeWeapon) return null;
    return calculateWeaponBuild(activeWeapon, [], modsMap, undefined, simParams, weaponCalcOptions);
  }, [activeWeapon, simParams, weaponCalcOptions]);

  const handleSelectWeapon = useCallback((weapon: Weapon) => {
    setSelectedWeapon(weapon);
    setGravimagMode(false);
    setAlternateMode(false);
    setEquippedMods([]);
    setHasOrokinCatalyst(false);
    setSelectedEvolutions({});
    setRivenStatsMap({});
    setEquippedArcanes([null, null]);
    setStanceMod(null);
    setSlotPolarities({});
    setProgenitorElement("heat");
    setProgenitorBonusPercent(PROGENITOR_BONUS_DEFAULT);
    setCurrentBuildId(null);
    setBuildName(`${weapon.name} Build`);
    setBuildDescription("");
    setShowWeaponList(false);
  }, []);

  const handleOpenModPicker = useCallback((slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    const w = selectedWeapon;
    const pri = w && isPrimaryWeaponCategory(w.category);
    const sec = w && ["pistol", "secondary", "dual_pistols"].includes(w.category);
    const mel = w && w.category === "melee";
    const isExilus = slotIndex === WEAPON_EXILUS_SLOT_INDEX && Boolean(pri || sec || mel);
    setModPickerSlotType(
      pri && isExilus
        ? "weapon_exilus_primary"
        : sec && isExilus
          ? "weapon_exilus_secondary"
          : mel && isExilus
            ? "weapon_exilus_melee"
            : "regular",
    );
    setModPickerOpen(true);
  }, [selectedWeapon]);

  const handleSelectMod = useCallback((mod: Mod, rank: number) => {
    setEquippedMods((prev) => {
      const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
      return [
        ...filtered,
        {
          modId: mod.id,
          modName: mod.name,
          rank,
          slotIndex: activeSlotIndex,
          polarity: mod.polarity,
          drain: mod.drain,
        },
      ];
    });
  }, [activeSlotIndex]);

  const handleSelectRiven = useCallback((mod: Mod, stats: Record<string, number>) => {
    setEquippedMods((prev) => {
      const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
      return [
        ...filtered,
        {
          modId: mod.id,
          modName: mod.name,
          rank: 0,
          slotIndex: activeSlotIndex,
          polarity: mod.polarity,
          drain: mod.drain,
        },
      ];
    });
    setRivenStatsMap((prev) => ({ ...prev, [activeSlotIndex]: stats }));
  }, [activeSlotIndex]);

  const handleRemoveMod = useCallback((slotIndex: number) => {
    setEquippedMods((prev) => prev.filter((m) => m.slotIndex !== slotIndex));
    setRivenStatsMap((prev) => { const n = { ...prev }; delete n[slotIndex]; return n; });
  }, []);

  const modCategory = selectedWeapon ? getModCategory(selectedWeapon.category) : "primary";
  const equippedModIds = equippedMods.map((m) => m.modId);
  const numSlots = selectedWeapon?.modSlots || 8;
  const isPrimaryWeapon = selectedWeapon ? isPrimaryWeaponCategory(selectedWeapon.category) : false;
  const isSecondaryWeapon = selectedWeapon ? ["pistol", "secondary", "dual_pistols"].includes(selectedWeapon.category) : false;
  const isMeleeWeapon = selectedWeapon?.category === "melee";
  const hasWeaponExilusSlot = isPrimaryWeapon || isSecondaryWeapon || isMeleeWeapon;
  const totalModSlots = hasWeaponExilusSlot ? numSlots + 1 : numSlots;

  return (
    <PageShell>

      <main className="flex-1 container mx-auto px-4 py-6">
        {showWeaponList || !selectedWeapon ? (
          <ItemPickerScreen
            icon={Crosshair}
            accent="blue"
            title="Weapon Builder"
            description="Choose a weapon to configure mods, arcanes, rivens, and Incarnon evolutions."
            count={filteredWeapons.length}
            search={weaponSearch}
            onSearchChange={setWeaponSearch}
            searchPlaceholder="Search weapons..."
            pickerTab={pickerTab}
            onPickerTabChange={(tab) => {
              if (tab === "saved") setSavedBuilds(getSavedBuilds("weapon"));
              setPickerTab(tab);
            }}
            savedPanel={
              savedBuilds.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No saved weapon builds yet. Save a build from the builder to see it here.
                </p>
              ) : (
                savedBuilds.map((build) => {
                  const d = build.data as WeaponBuildData;
                  const weaponName = allWeapons.find((w) => w.id === d.weaponId)?.name ?? d.weaponId;
                  return (
                    <ItemPickerRow
                      key={build.id}
                      accent="blue"
                      onClick={() => handleLoadBuild(build)}
                      title={build.name}
                      badge={
                        <span className="shrink-0 text-xs text-muted-foreground">{weaponName}</span>
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
            filters={Object.entries(WEAPON_CATEGORY_LABELS).map(([key, label]) => (
              <ItemPickerFilter
                key={key}
                active={weaponCategory === key}
                onClick={() => setWeaponCategory(key)}
              >
                {label}
              </ItemPickerFilter>
            ))}
          >
            {filteredWeapons.map((weapon) => (
              <ItemPickerRow
                key={weapon.id}
                accent="blue"
                onClick={() => handleSelectWeapon(weapon)}
                image={
                  <GameAssetImage
                    src={getWeaponImage(weapon.name, { category: weapon.category })}
                    alt=""
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain"
                    hideOnError
                  />
                }
                title={
                  <>
                    {weapon.name}
                    {incarnonDataMap.has(weapon.id) && <Flame className="ml-1 inline h-3 w-3 text-orange-400" />}
                  </>
                }
                badge={
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {WEAPON_CATEGORY_LABELS[weapon.category] || weapon.category}
                  </span>
                }
                meta={
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {weapon.category === "tektolyst" ? (
                      <span>Tektolyst Artifact — {weapon.focusSchool || "Focus"} School</span>
                    ) : (
                      <>
                        <span>DMG {weapon.damage}</span>
                        <span>CC {(weapon.criticalChance * 100).toFixed(0)}%</span>
                        <span>CM {weapon.criticalMultiplier.toFixed(1)}x</span>
                        <span>SC {(weapon.statusChance * 100).toFixed(0)}%</span>
                        <span>FR {weapon.fireRate.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                }
              />
            ))}
          </ItemPickerScreen>
        ) : (
          <div>
            <BuilderItemHeader
              onChange={() => {
                clearCloudBuildInUrl();
                setShowWeaponList(true);
              }}
              image={
                <GameAssetImage
                  src={getWeaponImage(selectedWeapon.name, { category: selectedWeapon.category })}
                  alt=""
                  width={40}
                  height={40}
                  className="hidden h-10 w-10 rounded-lg object-contain sm:block"
                  hideOnError
                />
              }
              title={selectedWeapon.name}
              subtitle={`${selectedWeapon.category} • ${selectedWeapon.triggerType}`}
            >
              <BuilderActionBar>
                <BuilderActionGroup>
                  <button
                    onClick={() => {
                      setSaveDialogDefaultPublic(buildIsPublic);
                      setSaveDialogOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-all font-medium"
                    title="Save Build"
                  >
                    <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={() => { setSavedBuilds(getSavedBuilds("weapon")); setShowSavedBuilds(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all font-medium"
                    title="Load Build"
                  >
                    <FolderOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Load</span>
                  </button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button
                    onClick={() => setShowImporter(!showImporter)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                      showImporter
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10"
                    )}
                    title="Import Build"
                  >
                    <Upload className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Import</span>
                  </button>
                  <button
                    onClick={handleShareBuild}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                      shareCopied
                        ? "bg-green-500/10 text-green-400"
                        : "text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10"
                    )}
                    title="Copy shareable link"
                  >
                    {shareCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">{shareCopied ? "Copied!" : "Share"}</span>
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
                    onClick={() => setHasOrokinCatalyst(!hasOrokinCatalyst)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                      hasOrokinCatalyst
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Catalyst</span>
                  </button>
                  {weaponHasGravimagMode(selectedWeapon) && (
                    <button
                      onClick={() => setGravimagMode((v) => !v)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                        gravimagMode
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      title={gravimagMode
                        ? "Gravimag deployed — showing atmosphere stats. Click for Archwing (space) stats."
                        : "Showing Archwing (space) stats. Click to deploy via Gravimag (atmosphere stats)."}
                    >
                      <Orbit className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Gravimag</span>
                    </button>
                  )}
                  {weaponHasAlternateMode(selectedWeapon) && (
                    <button
                      onClick={() => {
                        setAlternateMode((v) => {
                          const next = !v;
                          // Stance pool changes with Dual Swords ↔ Heavy Blade.
                          if (selectedWeapon.alternateModeStats?.stanceType) {
                            setStanceMod(null);
                          }
                          return next;
                        });
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                        alternateMode
                          ? "bg-amber-500/10 text-amber-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      title={
                        alternateMode
                          ? `${selectedWeapon.alternateModeStats!.label} mode on — click for default form.`
                          : `Default form — click for ${selectedWeapon.alternateModeStats!.label}.`
                      }
                    >
                      <Swords className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {selectedWeapon.alternateModeStats!.label}
                      </span>
                    </button>
                  )}
                </BuilderActionGroup>

                {selectedWeapon && weaponSupportsProgenitor(selectedWeapon) && (
                  <ProgenitorControls
                    progenitorElement={progenitorElement}
                    progenitorBonusPercent={progenitorBonusPercent}
                    onElementChange={setProgenitorElement}
                    onBonusChange={setProgenitorBonusPercent}
                  />
                )}

                <div className="flex-1" />

                {/* meta */}
                <a
                  href={appendReturnTo(
                    `/report-issue?type=weapon&name=${encodeURIComponent(selectedWeapon.name)}&id=${encodeURIComponent(selectedWeapon.id)}`,
                    builderReturnTo,
                  )}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-500/30 text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/5 transition-colors"
                >
                  <Flag className="h-3 w-3" /> <span className="hidden sm:inline">Report</span>
                </a>
              </BuilderActionBar>
            </BuilderItemHeader>

            <div className="mb-6">
              <CommunityBuildsPanel
                type="weapon"
                itemId={selectedWeapon.id}
                itemName={selectedWeapon.name}
                onLoadBuild={handleLoadCommunityBuild}
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
                    MOD CONFIGURATION
                  </h2>
                  <span className={cn(
                    "text-xs font-mono",
                    computeUsedCapacity(equippedMods, modsMap, slotPolarities) >
                      (hasOrokinCatalyst ? 60 : 30) + (isMR30 ? 10 : 0)
                      ? "text-red-400" : "text-muted-foreground"
                  )}>
                    {computeUsedCapacity(equippedMods, modsMap, slotPolarities)} / {(hasOrokinCatalyst ? 60 : 30) + (isMR30 ? 10 : 0)}
                  </span>
                </div>
                {showImporter && (
                  <div className="mb-4">
                    <BuildImporter
                      modCategory={modCategory}
                      numSlots={totalModSlots}
                      onImport={(mods) => {
                        setEquippedMods(mods);
                        setShowImporter(false);
                      }}
                      onClose={() => setShowImporter(false)}
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Array.from({ length: totalModSlots }, (_, i) => {
                    const equipped = equippedMods.find((m) => m.slotIndex === i);
                    const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                    const isExilus = hasWeaponExilusSlot && i === WEAPON_EXILUS_SLOT_INDEX;
                    return (
                      <ModSlotCard
                        key={i}
                        mod={mod}
                        rank={equipped?.rank ?? 0}
                        slotIndex={i}
                        label={isExilus ? (isTomeWeapon(selectedWeapon.id) ? "Canticle" : "Exilus") : undefined}
                        slotPolarity={slotPolarities[i]}
                        rivenStats={rivenStatsMap[i]}
                        weaponCategory={selectedWeapon.category}
                        onAdd={() => handleOpenModPicker(i)}
                        onRemove={() => handleRemoveMod(i)}
                        onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; })}
                        onEditRiven={() => handleOpenModPicker(i)}
                      />
                    );
                  })}
                </div>

                {/* Stance Mod (melee only) */}
                {selectedWeapon.category === "melee" && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3">STANCE</h2>
                    {stanceMod ? (
                      <div className="relative border border-amber-500/30 rounded-lg p-3 bg-amber-500/5">
                        <button
                          onClick={() => setStanceMod(null)}
                          className="absolute top-1 right-1 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{stanceMod.name}</span>
                          <span className="text-[10px] text-amber-400">
                            +{Math.abs(modCapacityAtRank(stanceMod.drain, stanceMod.maxRank))} capacity
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">
                          {stanceMod.description.replace(/<[^>]+>/g, "").substring(0, 60)}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setStancePickerOpen(true)}
                        className="w-full h-14 border border-dashed border-amber-500/30 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-xs">Add Stance</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Weapon Arcanes */}
                {(() => {
                  const arcaneConfig = getWeaponArcanes(selectedWeapon);
                  if (arcaneConfig.slots === 0) return null;
                  return (
                    <div className="mt-6">
                      <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Gem className="h-4 w-4 text-purple-400" />
                        ARCANES
                      </h2>
                      <div className={cn("grid gap-2", arcaneConfig.slots === 2 ? "grid-cols-2" : "grid-cols-1")}>
                        {Array.from({ length: arcaneConfig.slots }).map((_, i) => (
                          <ArcaneSlotCard
                            key={i}
                            arcane={equippedArcanes[i]}
                            rank={equippedArcanes[i]?.maxRank ?? 0}
                            label={`${arcaneConfig.label} ${arcaneConfig.slots > 1 ? i + 1 : ""}`}
                            onAdd={() => { setActiveArcaneSlot(i); setArcanePickerOpen(true); }}
                            onRemove={() => setEquippedArcanes((prev) => { const next = [...prev]; next[i] = null; return next; })}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {isIncarnon && (
                  <IncarnonEvolutionsSection
                    incarnonData={incarnonData}
                    selectedEvolutions={selectedEvolutions}
                    onSelectEvolution={(tier, slot) =>
                      setSelectedEvolutions((prev) => ({ ...prev, [tier]: slot }))
                    }
                  />
                )}

                {/* Build Description */}
                <div className="mt-6">
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3">BUILD DESCRIPTION</h2>
                  <textarea
                    value={buildDescription}
                    onChange={(e) => setBuildDescription(e.target.value)}
                    placeholder="Write a description for this build... (e.g. mechanics, synergies, how to play)"
                    className="w-full h-24 p-3 bg-card border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/60 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <WeaponStatsPanel
                  stats={calculatedStats}
                  baseStats={baseStats}
                  weapon={activeWeapon}
                  isMelee={activeWeapon?.category === 'melee' || activeWeapon?.triggerType === 'Melee'}
                  selectedEvolutions={isIncarnon ? selectedEvolutions : undefined}
                  allEvolutions={incarnonData?.evolutions}
                  simParams={simParams}
                  onSimParamsChange={setSimParams}
                  contributionContext={contributionContext}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <ModPicker
        open={modPickerOpen}
        onClose={() => setModPickerOpen(false)}
        mods={allMods}
        category={modCategory}
        slotType={modPickerSlotType}
        equippedModIds={equippedModIds}
        onSelect={handleSelectMod}
        onSelectRiven={handleSelectRiven}
        weaponCategory={selectedWeapon?.category}
        weapon={selectedWeapon ?? undefined}
      />

      {/* Weapon Arcane Picker */}
      {selectedWeapon && (
        <ArcanePicker
          open={arcanePickerOpen}
          onOpenChange={setArcanePickerOpen}
          arcanes={getWeaponArcanes(selectedWeapon).arcanes}
          equippedArcaneIds={equippedArcanes.filter(Boolean).map((a) => a!.id)}
          onSelect={(arcane) => {
            setEquippedArcanes((prev) => {
              const next = [...prev];
              next[activeArcaneSlot] = arcane;
              return next;
            });
            setArcanePickerOpen(false);
          }}
          title={`Select ${getWeaponArcanes(selectedWeapon).label}`}
        />
      )}

      {/* Stance Mod Picker */}
      {selectedWeapon && selectedWeapon.category === "melee" && (
        <StancePickerDialog
          open={stancePickerOpen}
          onOpenChange={setStancePickerOpen}
          allMods={allMods}
          stanceType={activeWeapon?.stanceType ?? selectedWeapon.stanceType}
          onSelect={setStanceMod}
        />
      )}

      <SavedBuildsDialog
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
        title="Saved Weapon Builds"
        emptyMessage="No saved builds yet. Build a weapon and click Save!"
        builds={savedBuilds}
        accent="cyan"
        getSubtitle={(build) => {
          const d = build.data as WeaponBuildData;
          const weapon = allWeapons.find((w) => w.id === d.weaponId);
          return `${weapon?.name ?? d.weaponId} • ${d.mods.length} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || (selectedWeapon ? `${selectedWeapon.name} Build` : "Weapon Build")}
        defaultDescription={buildDescription}
        defaultIsPublic={saveDialogDefaultPublic}
        onSave={handleSaveBuildConfirm}
      />
    </PageShell>
  );
}
