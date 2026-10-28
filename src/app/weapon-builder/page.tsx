"use client";

import {
  applyPolarityOverride,
  effectiveSlotPolarities,
  innateSlotPolarities,
  isInnatePolarity,
} from "@/lib/builds/innate-polarities";
import { cleanModDescription } from "@/lib/display/mod-display";
import { BuilderSectionNav } from "@/components/builder-section-nav";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import { MobileStatSummary } from "@/components/stats/mobile-stat-summary";
import { weaponStatSummary } from "@/lib/ui/mobile-stat-summary";
import { ModPicker, buildSlotNav, type SlotType } from "@/components/mod-picker";
import { useWeapons, useMods } from "@/lib/weapons/use-data";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { mergeIncarnonStatChanges, mergeRivenStatChanges } from "@/lib/calc/weapon-stat-merges";
import { resolveIncarnonActiveWeapon, isIncarnonFormActive } from "@/lib/calc/incarnon-active-weapon";
import { Weapon, Mod, CalculatedStats, EquippedMod, SimulationParams, DEFAULT_SIM_PARAMS, WeaponCalculationOptions } from "@/lib/types";
import { applyGravimagMode, weaponHasGravimagMode } from "@/lib/weapons/weapon-gravimag";
import { applyAlternateMode, getAlternateModes, weaponHasAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { applyArbucepAttackMode } from "@/lib/weapons/weapon-arbucep-mode";
import {
  weaponSupportsProgenitor,
  weaponModCapacity,
  clampAdversaryFormas,
  adversaryRankFromFormas,
  PROGENITOR_BONUS_DEFAULT,
  normalizeProgenitorElement,
} from "@/lib/weapons/weapon-progenitor";
import { Zap, Flag, Flame, Plus, X, Gem, Save, FolderOpen, Share2, Check, Upload, Crosshair, Orbit, Swords, ArrowLeftRight } from "lucide-react";
import { isPrimaryWeaponCategory } from "@/lib/mods/mod-weapon-eligibility";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import { incarnonDataMap } from "@/data/incarnon";
import { cn } from "@/lib/utils";
import { appendReturnTo } from "@/lib/site/nav-return";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, WeaponBuildData, persistSavedBuild, resolveSavedArcaneSlots, resolveArcaneById } from "@/lib/builds/build-storage";
import { reportUnreadableShareLink } from "@/lib/builds/share-link-errors";
import { cleanLoadedBuild, cleanLoadedMods } from "@/lib/builds/incompatible-mod-warnings";
import { extractBuildFromUrlAsync, ShareableBuild } from "@/lib/builds/build-url";
import { shareBuilderBuild } from "@/lib/builds/share-build";
import { toast } from "sonner";
import { getWeaponImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { BuildImporter, type ImportApplied } from "@/components/build-importer";
import { weaponImportEligibility } from "@/lib/builds/import-eligibility";
import { describeImportResult } from "@/lib/builds/mod-list-import";
import { ImportCapacityNotice, useImportCapacityNotice } from "@/components/import-capacity-notice";
import { importCapacityToastText, isOverCapacity } from "@/lib/builds/import-capacity-notice";
import { useCloudBuildFromUrl, fetchCloudBuild, setCloudBuildInUrl, clearCloudBuildInUrl, markCloudBuildLoaded } from "@/lib/builds/use-cloud-build-from-url";
import { snapshotFromBuild } from "@/lib/builds/compare-build";
import { BuildCompareDialog } from "@/components/compare/build-compare-dialog";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { LoadoutEditBanner } from "@/components/loadout-edit-banner";
import { SAVE_DIRTY_CLASS, SAVE_DIRTY_DOT_CLASS, stableBuildSnapshot, useUnsavedChanges } from "@/lib/builds/unsaved-changes";
import { loadoutSlotLabel, updateLoadoutSlot } from "@/lib/builds/loadout-edit-context";
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
  const [adversaryFormas, setAdversaryFormas] = useState(0);
  const [selectedEvolutions, setSelectedEvolutions] = useState<Record<number, number>>({}); // tier -> slot
  const [rivenStatsMap, setRivenStatsMap] = useState<Record<number, Record<string, number>>>({});
  const [equippedArcanes, setEquippedArcanes] = useState<(Mod | null)[]>([null, null]);
  const [arcanePickerOpen, setArcanePickerOpen] = useState(false);
  const [activeArcaneSlot, setActiveArcaneSlot] = useState(0);
  const [stanceMod, setStanceMod] = useState<Mod | null>(null);
  const [stancePickerOpen, setStancePickerOpen] = useState(false);
  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const innatePolarities = useMemo(
    () => innateSlotPolarities("weapon", selectedWeapon?.id),
    [selectedWeapon?.id],
  );
  const effectivePolarities = useMemo(
    () => effectiveSlotPolarities(innatePolarities, slotPolarities),
    [innatePolarities, slotPolarities],
  );
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
  /** -1 = catalog default; 0..n-1 = index into getAlternateModes(). */
  const [alternateModeIndex, setAlternateModeIndex] = useState(-1);
  const alternateMode = alternateModeIndex >= 0;

  /** Archgun Gravimag / alternate fire-form / Arbucep cycle, then Incarnon resolution. */
  const activeWeapon = useMemo<Weapon | null>(() => {
    if (!selectedWeapon) return null;
    let w = selectedWeapon;
    if (gravimagMode && weaponHasGravimagMode(selectedWeapon)) w = applyGravimagMode(selectedWeapon);
    if (alternateMode && weaponHasAlternateMode(w)) w = applyAlternateMode(w, alternateModeIndex);
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
    alternateModeIndex,
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
  const appliedShareParamRef = useRef<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        if (allWeapons.length === 0) return;
        const params = new URLSearchParams(window.location.search);
        if (params.get("build") && params.get("build") === appliedShareParamRef.current) return;
        const shared = await extractBuildFromUrlAsync(params);
        if (cancelled) return;
        if (!shared) {
          reportUnreadableShareLink(params);
          return;
        }
        if (shared.type !== "weapon") return;
        const weapon = allWeapons.find((w) => w.id === shared.itemId);
        if (!weapon) {
          toast.error("Weapon not found", { description: "This shared build uses a weapon that is no longer in the catalog." });
          return;
        }
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
        setEquippedMods(cleanLoadedMods(mods));
        if (shared.arcanes) {
          setEquippedArcanes(shared.arcanes.map((id) => (id ? resolveArcaneById(id) : null)));
        }
        setCurrentBuildId(null);
        setBuildName(`${weapon.name} Build`);
        setBuildDescription("");
        if (shared.progenitorElement) {
          setProgenitorElement(normalizeProgenitorElement(shared.progenitorElement));
        }
        if (shared.progenitorBonusPercent != null) setProgenitorBonusPercent(shared.progenitorBonusPercent);
        if (shared.hasOrokinCatalyst != null) setHasOrokinCatalyst(shared.hasOrokinCatalyst);
        setAdversaryFormas(
          weaponSupportsProgenitor(weapon) ? clampAdversaryFormas(shared.adversaryFormas) : 0,
        );
        if (shared.slotPolarities) setSlotPolarities(shared.slotPolarities);
        const sharedIncarnon = (shared as ShareableBuild & { incarnonEvolutions?: Record<number, number> }).incarnonEvolutions;
        if (sharedIncarnon) setSelectedEvolutions(sharedIncarnon);
        // ?build= stays in the URL (shareable, survives refresh); remember it so a later
        // catalog update does not re-apply it over edits.
        appliedShareParamRef.current = params.get("build");
      })();
    });
    return () => {
      cancelled = true;
    };
  }, [allWeapons]);

  const buildWeaponData = useCallback((): WeaponBuildData | null => {
    if (!selectedWeapon) return null;
    return {
      weaponId: selectedWeapon.id,
      mods: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      stanceModId: stanceMod?.id,
      arcaneIds: equippedArcanes.map((a) => a?.id ?? null),
      hasOrokinCatalyst,
      isMR30: false,
      ...(weaponSupportsProgenitor(selectedWeapon) && adversaryFormas > 0
        ? { adversaryFormas }
        : {}),
      slotPolarities,
      ...(weaponCalcOptions?.progenitorElement != null
        ? {
            progenitorElement: weaponCalcOptions.progenitorElement,
            progenitorBonusPercent: weaponCalcOptions.progenitorBonusPercent,
          }
        : {}),
      ...(Object.keys(selectedEvolutions).length > 0 ? { incarnonEvolutions: selectedEvolutions } : {}),
    };
  }, [selectedWeapon, equippedMods, stanceMod, equippedArcanes, hasOrokinCatalyst, adversaryFormas, slotPolarities, weaponCalcOptions, selectedEvolutions]);

  const { dirty: hasUnsavedChanges, markClean } = useUnsavedChanges(useMemo(() => stableBuildSnapshot(buildWeaponData()), [buildWeaponData]));

  const applyLoadedBuild = useCallback((rawBuild: SavedBuild, options?: { silent?: boolean }) => {
    const build = cleanLoadedBuild(rawBuild);
    const d = build.data as WeaponBuildData;
    const weapon = allWeapons.find((w) => w.id === d.weaponId);
    if (!weapon) { toast.error("Weapon not found"); return; }
    markClean();
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
    setAdversaryFormas(
      weaponSupportsProgenitor(weapon) ? clampAdversaryFormas(d.adversaryFormas) : 0,
    );
    setSlotPolarities(d.slotPolarities || {});
    if (weaponSupportsProgenitor(weapon)) {
      setProgenitorElement(normalizeProgenitorElement(d.progenitorElement));
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
  }, [markClean, allWeapons]);

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
      toast.success(currentBuildId ? "Build saved" : "Saved as new build", { description: `${name} saved to your account` });
    } else {
      toast.success(currentBuildId ? "Build saved locally" : "Saved as new build", { description: currentBuildId ? "Log in to sync builds to your account" : "Saved on this device. Log in to sync builds to your account." });
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
  const { context: loadoutCtx, clearContext: clearLoadoutCtx } = useLoadoutSlotFromUrl(
    "weapon",
    useCallback((build) => applyLoadedBuild(build, { silent: true }), [applyLoadedBuild]),
    allWeapons.length > 0,
  );

  const handleSaveDialog = useCallback(async (values: SaveBuildDialogValues) => {
    if (values.target === "loadout" && loadoutCtx) {
      const data = buildWeaponData();
      if (!data) return false;
      const res = await updateLoadoutSlot(loadoutCtx, data);
      if (!res.ok) {
        toast.error("Loadout not found", { description: "It may have been deleted. Use Save as new build instead." });
        clearLoadoutCtx();
        return false;
      }
      if (res.cloud === "failed") {
        toast.warning(`Saved to ${loadoutCtx.loadoutName} on this device`, {
          description: "Account sync failed. Open Loadouts and save the loadout again to sync it.",
        });
      } else {
        toast.success(`Saved to ${loadoutCtx.loadoutName} loadout`, {
          description: `${loadoutSlotLabel(loadoutCtx.slot)} slot updated${res.cloud === "synced" ? " and synced to your account" : ""}.`,
        });
      }
      markClean();
      return true;
    }
    await handleSaveBuildConfirm(values);
    markClean();
    return true;
  }, [markClean, loadoutCtx, clearLoadoutCtx, handleSaveBuildConfirm, buildWeaponData]);

  const handleDeleteBuild = useCallback((id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("weapon"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId]);

  const [shareCopied, setShareCopied] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const liveCompare = useMemo(() => {
    const data = buildWeaponData();
    if (!data || !selectedWeapon) return null;
    return snapshotFromBuild("weapon", buildName || selectedWeapon.name, data);
  }, [buildWeaponData, selectedWeapon, buildName]);
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
        isMR30: false,
        ...(weaponSupportsProgenitor(selectedWeapon) && adversaryFormas > 0
          ? { adversaryFormas }
          : {}),
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
    adversaryFormas,
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
    setAlternateModeIndex(-1);
    setEquippedMods([]);
    setHasOrokinCatalyst(false);
    setAdversaryFormas(0);
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
  const modCapacity = weaponModCapacity(selectedWeapon, adversaryFormas, hasOrokinCatalyst);
  const importEligibility = useMemo(
    () => (selectedWeapon ? weaponImportEligibility(selectedWeapon, modCategory) : null),
    [selectedWeapon, modCategory],
  );
  const importRegularSlots = useMemo(() => Array.from({ length: numSlots }, (_, i) => i), [numSlots]);
  const weaponCapacityUsed = computeUsedCapacity(equippedMods, modsMap, effectivePolarities);
  const importCapacityNotice = useImportCapacityNotice(selectedWeapon?.id ?? "", weaponCapacityUsed, modCapacity);
  const importCapacityAfter = useCallback(
    (mods: EquippedMod[]) => ({
      used: computeUsedCapacity(cleanLoadedMods(mods), modsMap, effectivePolarities),
      max: modCapacity,
    }),
    [modsMap, effectivePolarities, modCapacity],
  );
  const { arm: armImportCapacityNotice, clear: clearImportCapacityNotice } = importCapacityNotice;
  const handleImportMods = useCallback(
    (r: ImportApplied) => {
      const previous = equippedMods;
      const next = cleanLoadedMods(r.mods);
      setEquippedMods(next);
      setShowImporter(false);
      armImportCapacityNotice();
      const { title, description } = describeImportResult(r);
      const figures = importCapacityAfter(next);
      toast.success(title, {
        description: isOverCapacity(figures.used, figures.max)
          ? `${description} ${importCapacityToastText(figures)}`
          : description,
        duration: 12000,
        action: {
          label: "Undo",
          onClick: () => {
            setEquippedMods(previous);
            clearImportCapacityNotice();
          },
        },
      });
    },
    [equippedMods, armImportCapacityNotice, clearImportCapacityNotice, importCapacityAfter],
  );
  const showAdversaryRank = selectedWeapon != null && weaponSupportsProgenitor(selectedWeapon);

  return (
    <PageShell>

      <main className="container mx-auto flex-1 px-3.5 pt-5 pb-24 sm:px-4 sm:pt-6 lg:pb-6">
        <LoadoutEditBanner
          context={loadoutCtx}
          onDetach={clearLoadoutCtx}
          dirty={hasUnsavedChanges}
          onSaveToLoadout={() => handleSaveDialog({ name: buildName, description: "", isPublic: false, tags: [], target: "loadout" })}
        />
        {showWeaponList || !selectedWeapon ? (
          <ItemPickerScreen
            onBack={selectedWeapon ? () => setShowWeaponList(false) : undefined}
            backLabel={selectedWeapon?.name}
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
                    {incarnonDataMap.has(weapon.id) && <Flame className="ml-1 inline h-3 w-3 text-orange-700 dark:text-orange-400" />}
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
                        <span title="Total base damage per shot">DMG {weapon.damage}</span>
                        <span title="Critical chance">CC {(weapon.criticalChance * 100).toFixed(0)}%</span>
                        <span title="Critical damage (critical multiplier)">CD {weapon.criticalMultiplier.toFixed(1)}x</span>
                        <span title="Status chance">SC {(weapon.statusChance * 100).toFixed(0)}%</span>
                        <span title="Fire rate (attacks per second)">FR {weapon.fireRate.toFixed(1)}</span>
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
                    className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs lg:pointer-fine:min-h-0 lg:py-1.5 text-muted-foreground hover:text-green-700 dark:hover:text-green-400 hover:bg-green-500/10 transition-all font-medium", hasUnsavedChanges && SAVE_DIRTY_CLASS)}
                    title={hasUnsavedChanges ? "Save Build (unsaved changes)" : "Save Build"}
                    data-dirty={hasUnsavedChanges ? "true" : undefined}
                  >
                    <Save className="h-3.5 w-3.5" /> <span className="inline">Save</span>
                    {hasUnsavedChanges && <span className={SAVE_DIRTY_DOT_CLASS} aria-hidden />}
                  </button>
                  <button
                    onClick={() => { setSavedBuilds(getSavedBuilds("weapon")); setShowSavedBuilds(true); }}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs lg:pointer-fine:min-h-0 lg:py-1.5 text-muted-foreground hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all font-medium"
                    title="Load Build"
                  >
                    <FolderOpen className="h-3.5 w-3.5" /> <span className="inline">Load</span>
                  </button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button
                    onClick={() => setShowImporter(!showImporter)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                      showImporter
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                        : "text-muted-foreground hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-500/10"
                    )}
                    title="Import mods from a pasted mod list or a screenshot. You choose to replace or add, and can undo it"
                  >
                    <Upload className="h-3.5 w-3.5" /> <span className="inline">Import mods</span>
                  </button>
                  <button
                    onClick={handleShareBuild}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                      shareCopied
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : "text-muted-foreground hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-500/10"
                    )}
                    title="Copy shareable link"
                  >
                    {shareCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                    <span className="inline">{shareCopied ? "Copied!" : "Share"}</span>
                  </button>
                  <button
                    onClick={() => setCompareOpen(true)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-400 lg:pointer-fine:min-h-0 lg:py-1.5"
                    title="Compare this build to a saved or posted build"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span className="inline">Compare</span>
                  </button>
                </BuilderActionGroup>

                <BuilderActionGroup>
                  {showAdversaryRank && (
                    <button
                      onClick={() => setAdversaryFormas((n) => (n >= 5 ? 0 : n + 1))}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                        adversaryFormas > 0
                          ? "bg-amber-500/10 text-amber-800 dark:text-amber-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      title="Each Forma raises max rank by 2, up to 40. Mod capacity matches that rank."
                    >
                      <span className="inline">Rank {adversaryRankFromFormas(adversaryFormas)}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setHasOrokinCatalyst(!hasOrokinCatalyst)}
                    title="Orokin Catalyst — doubles mod capacity"
                    aria-pressed={hasOrokinCatalyst}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                      hasOrokinCatalyst
                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span className="inline">Catalyst</span>
                  </button>
                  {weaponHasGravimagMode(selectedWeapon) && (
                    <button
                      onClick={() => setGravimagMode((v) => !v)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                        gravimagMode
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      title={gravimagMode
                        ? "Gravimag deployed — showing atmosphere stats. Click for Archwing (space) stats."
                        : "Showing Archwing (space) stats. Click to deploy via Gravimag (atmosphere stats)."}
                    >
                      <Orbit className="h-3.5 w-3.5" />
                      <span className="inline">Gravimag</span>
                    </button>
                  )}
                  {weaponHasAlternateMode(selectedWeapon) && (() => {
                    const modes = getAlternateModes(selectedWeapon);
                    const multi = modes.length > 1;
                    const nextIndex = alternateModeIndex + 1 >= modes.length ? -1 : alternateModeIndex + 1;
                    const currentLabel = alternateMode ? modes[alternateModeIndex]!.label : (selectedWeapon.defaultModeLabel ?? "Default");
                    const nextLabel = nextIndex >= 0 ? modes[nextIndex]!.label : (selectedWeapon.defaultModeLabel ?? "default form");
                    return (
                    <button
                      onClick={() => {
                        setAlternateModeIndex((i) => {
                          const next = i + 1 >= modes.length ? -1 : i + 1;
                          // Stance pool changes with Dual Swords ↔ Heavy Blade.
                          const from = i >= 0 ? modes[i] : undefined;
                          const to = next >= 0 ? modes[next] : undefined;
                          if (from?.stanceType || to?.stanceType) {
                            setStanceMod(null);
                          }
                          return next;
                        });
                      }}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                        alternateMode
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      title={
                        multi
                          ? `${currentLabel} mode — click for ${nextLabel}. Modes: ${[selectedWeapon.defaultModeLabel ?? "Default", ...modes.map((m) => m.label)].join(" → ")}.`
                          : alternateMode
                            ? `${modes[0]!.label} mode on — click for default form.`
                            : `Default form — click for ${modes[0]!.label}.`
                      }
                    >
                      <Swords className="h-3.5 w-3.5" />
                      <span className="inline">
                        {multi ? currentLabel : modes[0]!.label}
                      </span>
                    </button>
                    );
                  })()}
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
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-500/5 hover:text-amber-900 dark:text-amber-400/70 dark:hover:text-amber-400 lg:pointer-fine:min-h-0 lg:py-1.5"
                >
                  <Flag className="h-3 w-3" /> <span className="inline">Report</span>
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
              <div id="build-mods" className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)]">
                <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/85 lg:static lg:z-auto lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
                  <h2 className="min-w-0 truncate text-sm font-semibold tracking-wider text-muted-foreground">
                    MOD CONFIGURATION
                  </h2>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-mono tabular-nums",
                    weaponCapacityUsed > modCapacity
                      ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                  )}>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">Capacity</span>
                    {weaponCapacityUsed} / {modCapacity}
                  </span>
                  <MobileStatSummary items={weaponStatSummary(calculatedStats)} />
                </div>
                {importCapacityNotice.visible && (
                  <ImportCapacityNotice used={weaponCapacityUsed} max={modCapacity} onDismiss={importCapacityNotice.dismiss} />
                )}
                {showImporter && selectedWeapon && importEligibility && (
                  <div className="mb-4">
                    <BuildImporter
                      itemName={selectedWeapon.name}
                      itemKind="weapon"
                      catalog={allMods}
                      isEligible={importEligibility.isEligible}
                      explainIneligible={importEligibility.explainIneligible}
                      regularSlots={importRegularSlots}
                      existing={equippedMods}
                      capacityAfter={importCapacityAfter}
                      onImport={handleImportMods}
                      onClose={() => setShowImporter(false)}
                    />
                  </div>
                )}
                {equippedMods.length === 0 && (
                  <p className="mb-2 text-[11px] leading-snug text-muted-foreground sm:hidden" data-testid="mobile-slot-hint">
                    Tap a slot to add a mod. Tap the hexagon beside a slot to add a forma.
                  </p>
                )}
                {hasWeaponExilusSlot && (
                  <p className="mb-2 text-[11px] leading-snug text-muted-foreground">
                    The last slot, <span className="font-medium text-foreground/80">Exilus</span>
                    {selectedWeapon && isTomeWeapon(selectedWeapon.id) ? " (Canticle on tomes)" : ""}
                    {", "}only takes Exilus-eligible mods for this weapon.
                  </p>
                )}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 lg:grid-cols-4">
                  {Array.from({ length: numSlots }, (_, i) => {
                    const equipped = equippedMods.find((m) => m.slotIndex === i);
                    const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                    return (
                      <ModSlotCard
                        key={i}
                        mod={mod}
                        rank={equipped?.rank ?? 0}
                        slotIndex={i}
                        slotPolarity={effectivePolarities[i]}
                        innatePolarity={isInnatePolarity(innatePolarities, slotPolarities, i)}
                        rivenStats={rivenStatsMap[i]}
                        weaponCategory={selectedWeapon.category}
                        onAdd={() => handleOpenModPicker(i)}
                        onRemove={() => handleRemoveMod(i)}
                        onPolarize={(p) => setSlotPolarities((prev) => applyPolarityOverride(prev, innatePolarities, i, p))}
                        onEditRiven={() => handleOpenModPicker(i)}
                      />
                    );
                  })}
                </div>
                {hasWeaponExilusSlot && (() => {
                  const i = WEAPON_EXILUS_SLOT_INDEX;
                  const equipped = equippedMods.find((m) => m.slotIndex === i);
                  const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                  const exilusLabel = isTomeWeapon(selectedWeapon.id) ? "Canticle" : "Exilus";
                  return (
                    <div className="mt-2.5">
                      <span className="mb-1 block text-[10px] font-semibold tracking-wider text-cyan-700 dark:text-cyan-400">
                        {exilusLabel.toUpperCase()}
                      </span>
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-4">
                        <ModSlotCard
                          key={i}
                          mod={mod}
                          rank={equipped?.rank ?? 0}
                          slotIndex={i}
                          label={exilusLabel}
                          slotPolarity={effectivePolarities[i]}
                        innatePolarity={isInnatePolarity(innatePolarities, slotPolarities, i)}
                          rivenStats={rivenStatsMap[i]}
                          weaponCategory={selectedWeapon.category}
                          onAdd={() => handleOpenModPicker(i)}
                          onRemove={() => handleRemoveMod(i)}
                          onPolarize={(p) => setSlotPolarities((prev) => applyPolarityOverride(prev, innatePolarities, i, p))}
                          onEditRiven={() => handleOpenModPicker(i)}
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Stance Mod (melee only) */}
                {selectedWeapon.category === "melee" && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3">STANCE</h2>
                    {stanceMod ? (
                      <div className="relative border border-amber-500/30 rounded-lg p-3 bg-amber-500/5">
                        <button
                          type="button"
                          onClick={() => setStanceMod(null)}
                          className="absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive sm:h-8 sm:w-8"
                          aria-label="Remove stance"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{stanceMod.name}</span>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400">
                            +{Math.abs(modCapacityAtRank(stanceMod.drain, stanceMod.maxRank))} capacity
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">
                          {cleanModDescription(stanceMod.description).substring(0, 60)}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setStancePickerOpen(true)}
                        className="w-full h-14 border border-dashed border-amber-500/30 rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-amber-500/50 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-500/5 transition-all"
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
                        <Gem className="h-4 w-4 text-purple-700 dark:text-purple-400" />
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
                    className="w-full h-24 p-3 bg-card border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/70 shadow-sm"
                  />
                </div>
              </div>

              <div id="build-stats" className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] space-y-4 lg:sticky lg:top-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] lg:self-start lg:max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain">
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
        slotNav={buildSlotNav(
          [...Array.from({ length: numSlots }, (_, i) => i), ...(hasWeaponExilusSlot ? [WEAPON_EXILUS_SLOT_INDEX] : [])],
          activeSlotIndex,
          handleOpenModPicker,
        )}
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

      {selectedWeapon && (
        <BuildCompareDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          type="weapon"
          itemId={selectedWeapon.id}
          live={liveCompare}
        />
      )}

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || (selectedWeapon ? `${selectedWeapon.name} Build` : "Weapon Build")}
        defaultDescription={buildDescription}
        defaultIsPublic={saveDialogDefaultPublic}
        onSave={handleSaveDialog}
        loadoutTarget={loadoutCtx ? { loadoutName: loadoutCtx.loadoutName, slotLabel: loadoutSlotLabel(loadoutCtx.slot) } : null}
      />
      <BuilderSectionNav sections={[{ id: "build-mods", label: "Mods" }, { id: "build-stats", label: "Stats" }]} />
    </PageShell>
  );
}
