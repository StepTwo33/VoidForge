"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import {
  ItemPickerScreen,
  ItemPickerRow,
  BuilderItemHeader,
  BuilderActionBar,
  BuilderActionGroup,
} from "@/components/item-picker";
import { ModSlotCard } from "@/components/mod-slot";
import { WarframeStatsPanel } from "@/components/stats-panel";
import { ModPicker, SlotType } from "@/components/mod-picker";
import { useWeapons, useWarframes, useMods, useArchonShards } from "@/lib/weapons/use-data";
import { calculateWarframeBuild, calculateWeaponBuild, calculateWeaponBuildWithArcanes, applyWarframeShardsAndArcanes } from "@/lib/calc/calculator";
import {
  computeUsedCapacity,
  warframeBaseCapacity,
  computeWarframeAuraBonus,
  computeWarframeCapacityUsed,
} from "@/lib/calc/compute-used-capacity";
import {
  Warframe,
  Mod,
  Ability,
  Weapon,
  WarframeCalculatedStats,
  CalculatedStats,
  EquippedMod,
  EquippedArchonShard,
  ArchonShard,
  WeaponCalculationOptions,
} from "@/lib/types";
import { Zap, Flag, Gem, Star, Save, FolderOpen, Share2, Check, Upload, Shield } from "lucide-react";
import { warframeArcanes } from "@/data/arcanes";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import { ArchonShardSlot } from "@/components/archon-shard-slot";
import { allHelminthAbilities, HelminthAbility } from "@/data/helminth";
import { cn } from "@/lib/utils";
import { appendReturnTo } from "@/lib/site/nav-return";
import {
  getExaltedWeaponForAbility,
  getExaltedWeaponsForWarframe,
  getMeleeExaltedWeapon,
  getPrimaryExaltedWeapon,
} from "@/lib/weapons/exalted-weapons";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, WarframeBuildData, persistSavedBuild, resolveSavedArcaneSlots } from "@/lib/builds/build-storage";
import { extractBuildFromUrl } from "@/lib/builds/build-url";
import { shareBuilderBuild } from "@/lib/builds/share-build";
import { toast } from "sonner";
import { getWarframeImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { BuildImporter } from "@/components/build-importer";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { CommunityBuildsPanel } from "@/components/community-builds-panel";
import { DualFormTabs } from "@/components/dual-form-tabs";
import { useCloudBuildFromUrl, fetchCloudBuild, setCloudBuildInUrl, clearCloudBuildInUrl, markCloudBuildLoaded } from "@/lib/builds/use-cloud-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";
import {
  dualFormStatesFromBuild,
  getDualFormConfig,
  buildAbilityDisplayEntries,
  serializeDualFormBuilds,
  EMPTY_ARCANE_IDS,
  DEFAULT_ARCANE_RANKS,
  type DualFormBuildSlice,
} from "@/lib/builds/dual-form-warframes";
import { AbilitiesSectionHeader } from "@/components/ability-display";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { AbilityCard, HelminthAbilityCard, HelminthSubsumeButton } from "./ability-cards";
import { ShardPickerDialog } from "./shard-picker-dialog";
import { HelminthPickerDialog } from "./helminth-picker-dialog";
import { ExaltedWeaponSection } from "./exalted-weapon-section";

const EMPTY_SHARDS: (EquippedArchonShard | null)[] = [null, null, null, null, null];

// Slot layout: 0=Aura, 1-8=Regular, 9=Exilus
const AURA_SLOT = 0;
const EXILUS_SLOT = 9;

function getSlotType(index: number): SlotType {
  if (index === AURA_SLOT) return "aura";
  if (index === EXILUS_SLOT) return "exilus";
  return "regular";
}

export default function WarframeBuilderPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const builderReturnTo = useMemo(() => {
    const q = searchParams.toString();
    return q ? `${pathname}?${q}` : pathname;
  }, [pathname, searchParams]);

  const allWarframes = useWarframes();
  const { mods: allMods, modsMap } = useMods();
  const allArchonShards = useArchonShards();
  const [selectedWarframe, setSelectedWarframe] = useState<Warframe | null>(null);
  const [equippedMods, setEquippedMods] = useState<EquippedMod[]>([]);
  const [equippedShards, setEquippedShards] = useState<(EquippedArchonShard | null)[]>([null, null, null, null, null]);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [activeSlotType, setActiveSlotType] = useState<SlotType>("regular");
  const [warframeSearch, setWarframeSearch] = useState("");
  const [showWarframeList, setShowWarframeList] = useState(true);
  const [shardPickerOpen, setShardPickerOpen] = useState(false);
  const [activeShardSlot, setActiveShardSlot] = useState(0);
  const [hasOrokinReactor, setHasOrokinReactor] = useState(false);
  const [isMR30, setIsMR30] = useState(false);
  const [helminthSlot, setHelminthSlot] = useState<number | null>(null); // which ability slot (0-3) is replaced
  const [helminthAbility, setHelminthAbility] = useState<HelminthAbility | null>(null);
  const [helminthPickerOpen, setHelminthPickerOpen] = useState(false);
  const [helminthPickerSlot, setHelminthPickerSlot] = useState(0);
  const [modPickerMode, setModPickerMode] = useState<"mods" | "arcanes">("mods");
  const [equippedArcanes, setEquippedArcanes] = useState<(Mod | null)[]>([null, null]);
  const [equippedArcaneRanks, setEquippedArcaneRanks] = useState<number[]>([5, 5]);
  const [activeArcaneSlot, setActiveArcaneSlot] = useState(0);
  const [exaltedMods, setExaltedMods] = useState<EquippedMod[]>([]);
  const [exaltedModPickerOpen, setExaltedModPickerOpen] = useState(false);
  const [exaltedActiveSlot, setExaltedActiveSlot] = useState(0);
  const [exaltedSlotPolarities, setExaltedSlotPolarities] = useState<Record<number, string>>({});
  const [exaltedArcanes, setExaltedArcanes] = useState<(Mod | null)[]>([null]);
  const [exaltedArcanePickerOpen, setExaltedArcanePickerOpen] = useState(false);
  const [exaltedActiveArcaneSlot, setExaltedActiveArcaneSlot] = useState(0);
  const [exaltedMeleeMods, setExaltedMeleeMods] = useState<EquippedMod[]>([]);
  const [exaltedMeleeModPickerOpen, setExaltedMeleeModPickerOpen] = useState(false);
  const [exaltedMeleeActiveSlot, setExaltedMeleeActiveSlot] = useState(0);
  const [exaltedMeleeSlotPolarities, setExaltedMeleeSlotPolarities] = useState<Record<number, string>>({});
  const [exaltedMeleeArcanes, setExaltedMeleeArcanes] = useState<(Mod | null)[]>([null]);
  const [exaltedMeleeArcanePickerOpen, setExaltedMeleeArcanePickerOpen] = useState(false);
  const [exaltedMeleeActiveArcaneSlot, setExaltedMeleeActiveArcaneSlot] = useState(0);
  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const [activeDualFormId, setActiveDualFormId] = useState("sirius");
  const [dualFormBuilds, setDualFormBuilds] = useState<Record<string, DualFormBuildSlice>>({});
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => getSavedBuilds("warframe"));
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [pickerTab, setPickerTab] = useState<"catalog" | "saved">("catalog");
  const [showImporter, setShowImporter] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveDialogDefaultPublic, setSaveDialogDefaultPublic] = useState(false);

  const dualFormConfig = useMemo(
    () => (selectedWarframe ? getDualFormConfig(selectedWarframe.id) : null),
    [selectedWarframe],
  );

  const modSlotsToEquipped = useCallback((mods: { modId: string; rank: number; slotIndex: number }[]): EquippedMod[] => {
    return mods.map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    });
  }, []);

  // Load build from URL ?build= param (hash share links)
  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search);
      const shared = extractBuildFromUrl(params);
      if (!shared || shared.type !== "warframe") return;
      const wf = allWarframes.find((w) => w.id === shared.itemId);
      if (!wf) return;
      setSelectedWarframe(wf);
      setShowWarframeList(false);
      setEquippedMods(shared.mods.map((m, i) => {
        const mod = modsMap.get(m.id);
        return { modId: m.id, modName: mod?.name ?? "", rank: m.rank, slotIndex: m.slotIndex ?? i, polarity: mod?.polarity, drain: mod?.drain };
      }));
      if (shared.arcanes) {
        setEquippedArcanes(resolveSavedArcaneSlots(shared.arcanes.map((id) => id || null), 2));
      }
      if (shared.shards && shared.shards.length > 0) {
        const restored: (EquippedArchonShard | null)[] = [...EMPTY_SHARDS];
        shared.shards.forEach((s, i) => {
          if (i >= restored.length) return;
          const def = allArchonShards.find((sh) => sh.id === s.id);
          if (!def) return;
          restored[i] = {
            shardId: def.id,
            shardColor: def.color,
            shardTier: def.tier,
            selectedBonus: s.bonus,
            bonusValue: def.statBonuses[s.bonus] ?? 0,
            slotIndex: i,
          };
        });
        setEquippedShards(restored);
      }
      setCurrentBuildId(null);
      setBuildName(`${wf.name} Build`);
      setBuildDescription("");
      const url = new URL(window.location.href);
      url.searchParams.delete("build");
      const qs = url.searchParams.toString();
      window.history.replaceState({}, "", qs ? `${url.pathname}?${qs}` : url.pathname);
    });
  }, []);

  const currentFormSlice = useCallback((): DualFormBuildSlice => ({
    mods: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
    slotPolarities: { ...slotPolarities },
    arcaneIds: equippedArcanes.map((a) => a?.id ?? null),
    arcaneRanks: [...equippedArcaneRanks],
  }), [equippedMods, slotPolarities, equippedArcanes, equippedArcaneRanks]);

  const buildWarframePayload = useCallback((): Pick<
    WarframeBuildData,
    "mods" | "slotPolarities" | "shards" | "arcaneIds" | "arcaneRanks" | "dualFormBuilds"
  > => {
    const shards = equippedShards;
    if (!selectedWarframe) {
      return {
        mods: [],
        slotPolarities: {},
        shards: [...EMPTY_SHARDS],
        arcaneIds: [...EMPTY_ARCANE_IDS],
      };
    }
    if (!dualFormConfig) {
      return { ...currentFormSlice(), shards };
    }
    const formStates = {
      ...dualFormBuilds,
      [activeDualFormId]: currentFormSlice(),
    };
    return { ...serializeDualFormBuilds(selectedWarframe.id, formStates), shards };
  }, [selectedWarframe, dualFormConfig, dualFormBuilds, activeDualFormId, currentFormSlice, equippedShards]);

  const handleDualFormSwitch = useCallback(
    (newFormId: string) => {
      if (!dualFormConfig || newFormId === activeDualFormId) return;
      const merged = { ...dualFormBuilds, [activeDualFormId]: currentFormSlice() };
      const next = merged[newFormId] ?? {
        mods: [],
        slotPolarities: {},
        arcaneIds: [...EMPTY_ARCANE_IDS],
        arcaneRanks: [...DEFAULT_ARCANE_RANKS],
      };
      setDualFormBuilds(merged);
      setActiveDualFormId(newFormId);
      setEquippedMods(modSlotsToEquipped(next.mods));
      setSlotPolarities(next.slotPolarities);
      setEquippedArcanes(resolveSavedArcaneSlots(next.arcaneIds, 2));
      setEquippedArcaneRanks(next.arcaneRanks ?? [...DEFAULT_ARCANE_RANKS]);
    },
    [dualFormConfig, activeDualFormId, dualFormBuilds, currentFormSlice, modSlotsToEquipped],
  );

  const buildWarframeData = useCallback((): WarframeBuildData | null => {
    if (!selectedWarframe) return null;
    const payload = buildWarframePayload();
    return {
      warframeId: selectedWarframe.id,
      ...payload,
      hasOrokinReactor: hasOrokinReactor,
      isMR30,
      helminthSlot,
      helminthAbilityId: helminthAbility?.id ?? null,
      exaltedMods: exaltedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      exaltedSlotPolarities,
      exaltedArcaneIds: exaltedArcanes.map((a) => a?.id ?? null),
      exaltedMeleeMods: exaltedMeleeMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      exaltedMeleeSlotPolarities,
      exaltedMeleeArcaneIds: exaltedMeleeArcanes.map((a) => a?.id ?? null),
    };
  }, [
    selectedWarframe,
    buildWarframePayload,
    hasOrokinReactor,
    isMR30,
    helminthSlot,
    helminthAbility,
    exaltedMods,
    exaltedSlotPolarities,
    exaltedArcanes,
    exaltedMeleeMods,
    exaltedMeleeSlotPolarities,
    exaltedMeleeArcanes,
  ]);

  const applyLoadedBuild = useCallback((build: SavedBuild, options?: { silent?: boolean }) => {
    const d = build.data as WarframeBuildData;
    const wf = allWarframes.find((w) => w.id === d.warframeId);
    if (!wf) { toast.error("Warframe not found"); return; }
    const config = getDualFormConfig(d.warframeId);
    if (config) {
      const states = dualFormStatesFromBuild(d)!;
      const nonDefault: Record<string, DualFormBuildSlice> = {};
      for (const form of config.forms) {
        if (form.id !== config.defaultFormId) nonDefault[form.id] = states[form.id];
      }
      setDualFormBuilds(nonDefault);
      setActiveDualFormId(config.defaultFormId);
      const defaultState = states[config.defaultFormId];
      setEquippedMods(modSlotsToEquipped(defaultState.mods));
      setSlotPolarities(defaultState.slotPolarities);
      setEquippedArcanes(resolveSavedArcaneSlots(defaultState.arcaneIds, 2));
      setEquippedArcaneRanks(defaultState.arcaneRanks ?? [...DEFAULT_ARCANE_RANKS]);
    } else {
      setDualFormBuilds({});
      setActiveDualFormId("sirius");
      setEquippedMods(modSlotsToEquipped(d.mods));
      setSlotPolarities(d.slotPolarities || {});
      setEquippedArcanes(resolveSavedArcaneSlots(d.arcaneIds, 2));
      setEquippedArcaneRanks(d.arcaneRanks ?? [...DEFAULT_ARCANE_RANKS]);
    }
    setEquippedShards(d.shards?.length === 5 ? d.shards : [...EMPTY_SHARDS]);
    setSelectedWarframe(wf);
    setHasOrokinReactor(d.hasOrokinReactor);
    setIsMR30(d.isMR30);
    setExaltedMods((d.exaltedMods || []).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    setExaltedSlotPolarities(d.exaltedSlotPolarities || {});
    setExaltedArcanes(resolveSavedArcaneSlots(d.exaltedArcaneIds, 2));
    setExaltedMeleeMods((d.exaltedMeleeMods || []).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    setExaltedMeleeSlotPolarities(d.exaltedMeleeSlotPolarities || {});
    setExaltedMeleeArcanes(resolveSavedArcaneSlots(d.exaltedMeleeArcaneIds, 2));
    if (d.helminthSlot != null) {
      setHelminthSlot(d.helminthSlot);
      if (d.helminthAbilityId) {
        setHelminthAbility(allHelminthAbilities.find((a) => a.id === d.helminthAbilityId) ?? null);
      }
    } else {
      setHelminthSlot(null);
      setHelminthAbility(null);
    }
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildDescription(build.description || "");
    setBuildIsPublic(build.isPublic ?? false);
    setShowSavedBuilds(false);
    setShowWarframeList(false);
    if (!options?.silent) {
      toast.info("Build loaded", { description: build.name });
    }
  }, [modSlotsToEquipped]);

  const handleSaveBuildConfirm = useCallback(async ({ name, description, isPublic, tags }: SaveBuildDialogValues) => {
    const data = buildWarframeData();
    if (!data || !selectedWarframe) return;
    const build: SavedBuild = {
      id: currentBuildId || generateBuildId(),
      name,
      description,
      isPublic,
      tags,
      type: "warframe",
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
  }, [buildWarframeData, selectedWarframe, currentBuildId]);

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

  useCloudBuildFromUrl("warframe", (build) => applyLoadedBuild(build, { silent: true }));
  useLocalBuildFromUrl("warframe", (build) => applyLoadedBuild(build, { silent: true }));
  useLoadoutSlotFromUrl(
    "warframe",
    useCallback((build) => applyLoadedBuild(build, { silent: true }), [applyLoadedBuild]),
    allWarframes.length > 0,
  );

  const handleDeleteBuild = useCallback((id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("warframe"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId]);

  const allWeaponsData = useWeapons();

  // Find exalted weapon for selected warframe
  const exaltedWeapons = useMemo<Weapon[]>(() => {
    if (!selectedWarframe) return [];
    return getExaltedWeaponsForWarframe(selectedWarframe.id, allWeaponsData);
  }, [selectedWarframe, allWeaponsData]);

  const exaltedWeapon = useMemo<Weapon | null>(() => {
    if (!selectedWarframe) return null;
    return getPrimaryExaltedWeapon(selectedWarframe.id, allWeaponsData);
  }, [selectedWarframe, allWeaponsData]);

  const exaltedMeleeWeapon = useMemo<Weapon | null>(() => {
    if (!selectedWarframe) return null;
    return getMeleeExaltedWeapon(selectedWarframe.id, allWeaponsData);
  }, [selectedWarframe, allWeaponsData]);

  const exaltedArcaneConfig = useMemo(
    () => (exaltedWeapon ? getWeaponArcanes(exaltedWeapon) : { arcanes: [] as Mod[], slots: 0, label: "" }),
    [exaltedWeapon],
  );

  const exaltedMeleeArcaneConfig = useMemo(
    () =>
      exaltedMeleeWeapon
        ? getWeaponArcanes(exaltedMeleeWeapon)
        : { arcanes: [] as Mod[], slots: 0, label: "" },
    [exaltedMeleeWeapon],
  );

  const calculatedStats = useMemo<WarframeCalculatedStats | null>(() => {
    if (!selectedWarframe) return null;
    const modSlots = equippedMods.map((m) => ({
      modId: m.modId,
      rank: m.rank,
      slotIndex: m.slotIndex,
    }));
    const stats = calculateWarframeBuild(selectedWarframe, modSlots, modsMap);
    return applyWarframeShardsAndArcanes(stats, equippedShards, equippedArcanes, equippedArcaneRanks);
  }, [selectedWarframe, equippedMods, equippedShards, equippedArcanes, equippedArcaneRanks, modsMap]);

  /** Exalted DPS scales with host Ability Strength (wiki). */
  const exaltedCalcOptions = useMemo<WeaponCalculationOptions>(
    () => ({ abilityStrength: calculatedStats?.abilityStrength ?? 1 }),
    [calculatedStats?.abilityStrength],
  );

  const exaltedStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedWeapon) return null;
    const slots = exaltedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const activeArcanes = exaltedArcanes
      .slice(0, exaltedArcaneConfig.slots)
      .filter((a): a is Mod => a !== null);
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(
        exaltedWeapon,
        slots,
        modsMap,
        activeArcanes,
        undefined,
        undefined,
        exaltedCalcOptions,
      );
    }
    return calculateWeaponBuild(
      exaltedWeapon,
      slots,
      modsMap,
      undefined,
      undefined,
      exaltedCalcOptions,
    );
  }, [exaltedWeapon, exaltedMods, exaltedArcanes, exaltedArcaneConfig.slots, modsMap, exaltedCalcOptions]);

  const exaltedMeleeStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedMeleeWeapon) return null;
    const slots = exaltedMeleeMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const activeArcanes = exaltedMeleeArcanes
      .slice(0, exaltedMeleeArcaneConfig.slots)
      .filter((a): a is Mod => a !== null);
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(
        exaltedMeleeWeapon,
        slots,
        modsMap,
        activeArcanes,
        undefined,
        undefined,
        exaltedCalcOptions,
      );
    }
    return calculateWeaponBuild(
      exaltedMeleeWeapon,
      slots,
      modsMap,
      undefined,
      undefined,
      exaltedCalcOptions,
    );
  }, [
    exaltedMeleeWeapon,
    exaltedMeleeMods,
    exaltedMeleeArcanes,
    exaltedMeleeArcaneConfig.slots,
    modsMap,
    exaltedCalcOptions,
  ]);

  const exaltedBaseStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedWeapon) return null;
    return calculateWeaponBuild(
      exaltedWeapon,
      [],
      modsMap,
      undefined,
      undefined,
      exaltedCalcOptions,
    );
  }, [exaltedWeapon, modsMap, exaltedCalcOptions]);

  const exaltedMeleeBaseStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedMeleeWeapon) return null;
    return calculateWeaponBuild(
      exaltedMeleeWeapon,
      [],
      modsMap,
      undefined,
      undefined,
      exaltedCalcOptions,
    );
  }, [exaltedMeleeWeapon, modsMap, exaltedCalcOptions]);

  const exaltedContributionContext = useMemo(() => {
    if (!exaltedWeapon) return null;
    return {
      baseWeapon: exaltedWeapon,
      modSlots: exaltedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
      arcanes: exaltedArcanes
        .slice(0, exaltedArcaneConfig.slots)
        .filter((a): a is Mod => a !== null),
      calcOptions: exaltedCalcOptions,
    };
  }, [exaltedWeapon, exaltedMods, exaltedArcanes, exaltedArcaneConfig.slots, modsMap, exaltedCalcOptions]);

  const exaltedMeleeContributionContext = useMemo(() => {
    if (!exaltedMeleeWeapon) return null;
    return {
      baseWeapon: exaltedMeleeWeapon,
      modSlots: exaltedMeleeMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
      arcanes: exaltedMeleeArcanes
        .slice(0, exaltedMeleeArcaneConfig.slots)
        .filter((a): a is Mod => a !== null),
      calcOptions: exaltedCalcOptions,
    };
  }, [
    exaltedMeleeWeapon,
    exaltedMeleeMods,
    exaltedMeleeArcanes,
    exaltedMeleeArcaneConfig.slots,
    modsMap,
    exaltedCalcOptions,
  ]);

  const exaltedCapacity = useMemo(
    () => computeUsedCapacity(exaltedMods, modsMap, exaltedSlotPolarities),
    [exaltedMods, exaltedSlotPolarities, modsMap],
  );

  const exaltedMeleeCapacity = useMemo(
    () => computeUsedCapacity(exaltedMeleeMods, modsMap, exaltedMeleeSlotPolarities),
    [exaltedMeleeMods, exaltedMeleeSlotPolarities, modsMap],
  );

  const filteredWarframes = useMemo(() => {
    const sorted = [...allWarframes]
      .filter((w) => w.id !== "helminth")
      .sort((a, b) => a.name.localeCompare(b.name));
    if (!warframeSearch.trim()) return sorted;
    const q = warframeSearch.toLowerCase();
    return sorted.filter((w) => w.name.toLowerCase().includes(q));
  }, [warframeSearch]);

  const abilityDisplayEntries = useMemo(() => {
    if (!selectedWarframe) return [];
    return buildAbilityDisplayEntries(selectedWarframe, !!dualFormConfig, activeDualFormId);
  }, [selectedWarframe, dualFormConfig, activeDualFormId]);

  const baseCapacity = warframeBaseCapacity(hasOrokinReactor, isMR30);
  const auraBonus = useMemo(
    () => computeWarframeAuraBonus(equippedMods, modsMap, slotPolarities, AURA_SLOT),
    [equippedMods, modsMap, slotPolarities],
  );

  const totalCapacity = baseCapacity + auraBonus;

  const capacityUsed = useMemo(
    () => computeWarframeCapacityUsed(equippedMods, modsMap, slotPolarities, AURA_SLOT),
    [equippedMods, modsMap, slotPolarities],
  );

  const handleSelectWarframe = useCallback((warframe: Warframe) => {
    setSelectedWarframe(warframe);
    setEquippedMods([]);
    setEquippedShards([null, null, null, null, null]);
    setEquippedArcanes([null, null]);
    setEquippedArcaneRanks([5, 5]);
    setExaltedMods([]);
    setExaltedSlotPolarities({});
    setExaltedArcanes([null]);
    setExaltedMeleeMods([]);
    setExaltedMeleeSlotPolarities({});
    setExaltedMeleeArcanes([null]);
    setHelminthSlot(null);
    setHelminthAbility(null);
    setSlotPolarities({});
    const config = getDualFormConfig(warframe.id);
    setActiveDualFormId(config?.defaultFormId ?? "sirius");
    setDualFormBuilds({});
    // New frame from the picker = new draft; keep old id/name or cloud upsert overwrites the wrong row title
    setCurrentBuildId(null);
    setBuildName(`${warframe.name} Build`);
    setBuildDescription("");
    setShowWarframeList(false);
  }, []);

  const handleOpenModPicker = useCallback((slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    setActiveSlotType(getSlotType(slotIndex));
    setModPickerMode("mods");
    setModPickerOpen(true);
  }, []);

  const handleOpenArcanePicker = useCallback((slotIndex: number) => {
    setActiveArcaneSlot(slotIndex);
    setModPickerMode("arcanes");
    setModPickerOpen(true);
  }, []);

  const handleSelectFromPicker = useCallback((mod: Mod, rank: number) => {
    if (mod.category === "arcane") {
      setEquippedArcanes((prev) => {
        const next = [...prev];
        next[activeArcaneSlot] = mod;
        return next;
      });
      setEquippedArcaneRanks((prev) => {
        const next = [...prev];
        next[activeArcaneSlot] = rank;
        return next;
      });
    } else {
      setEquippedMods((prev) => {
        const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
        return [
          ...filtered,
          { modId: mod.id, modName: mod.name, rank, slotIndex: activeSlotIndex, polarity: mod.polarity, drain: mod.drain },
        ];
      });
    }
  }, [activeSlotIndex, activeArcaneSlot]);

  const handleRemoveMod = useCallback((slotIndex: number) => {
    setEquippedMods((prev) => prev.filter((m) => m.slotIndex !== slotIndex));
  }, []);

  const handleOpenShardPicker = useCallback((slotIndex: number) => {
    setActiveShardSlot(slotIndex);
    setShardPickerOpen(true);
  }, []);

  const handleSelectShardBonus = useCallback((shard: ArchonShard, bonusKey: string, bonusValue: number) => {
    setEquippedShards((prev) => {
      const next = [...prev];
      next[activeShardSlot] = {
        shardId: shard.id,
        shardColor: shard.color,
        shardTier: shard.tier,
        selectedBonus: bonusKey,
        bonusValue,
        slotIndex: activeShardSlot,
      };
      return next;
    });
    setShardPickerOpen(false);
  }, [activeShardSlot]);

  const handleRemoveShard = useCallback((slotIndex: number) => {
    setEquippedShards((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
  }, []);

  const [shareCopied, setShareCopied] = useState(false);
  const handleShareBuild = useCallback(async () => {
    if (!selectedWarframe) return;

    const outcome = await shareBuilderBuild({
      isPublic: buildIsPublic,
      buildId: currentBuildId,
      fallback: {
        type: "warframe",
        itemId: selectedWarframe.id,
        mods: equippedMods.map((m) => ({ id: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
        arcanes: equippedArcanes.map((a) => a?.id ?? ""),
        shards: equippedShards
          .filter((s): s is EquippedArchonShard => s !== null)
          .map((s) => ({ id: s.shardId, bonus: s.selectedBonus })),
      },
    });

    if (outcome.kind === "copied") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [selectedWarframe, equippedMods, equippedArcanes, equippedShards, buildIsPublic, currentBuildId]);

  const equippedModIds = equippedMods.map((m) => m.modId);

  return (
    <PageShell>

      <main className="flex-1 container mx-auto px-4 py-6">
        {showWarframeList || !selectedWarframe ? (
          <ItemPickerScreen
            icon={Shield}
            accent="purple"
            title="Warframe Builder"
            description="Choose a warframe to configure mods, archon shards, Helminth abilities, and arcanes."
            count={filteredWarframes.length}
            search={warframeSearch}
            onSearchChange={setWarframeSearch}
            searchPlaceholder="Search warframes..."
            pickerTab={pickerTab}
            onPickerTabChange={(tab) => {
              if (tab === "saved") setSavedBuilds(getSavedBuilds("warframe"));
              setPickerTab(tab);
            }}
            savedPanel={
              savedBuilds.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  No saved warframe builds yet. Save a build from the builder to see it here.
                </p>
              ) : (
                savedBuilds.map((build) => {
                  const d = build.data as WarframeBuildData;
                  const wfName = allWarframes.find((w) => w.id === d.warframeId)?.name ?? d.warframeId;
                  return (
                    <ItemPickerRow
                      key={build.id}
                      accent="purple"
                      onClick={() => handleLoadBuild(build)}
                      title={build.name}
                      badge={
                        <span className="shrink-0 text-xs text-muted-foreground">{wfName}</span>
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
          >
            {filteredWarframes.map((wf) => (
              <ItemPickerRow
                key={wf.id}
                accent="purple"
                onClick={() => handleSelectWarframe(wf)}
                image={
                  <GameAssetImage
                    src={getWarframeImage(wf.name)}
                    alt=""
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain"
                    hideOnError
                  />
                }
                title={wf.name}
                meta={
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>HP {wf.health}</span>
                    <span>SH {wf.shield}</span>
                    <span>AR {wf.armor}</span>
                    <span>EN {wf.energy}</span>
                    <span>SPD {wf.sprintSpeed}</span>
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
                setShowWarframeList(true);
              }}
              image={
                <GameAssetImage
                  src={getWarframeImage(selectedWarframe.name)}
                  alt=""
                  width={40}
                  height={40}
                  className="hidden h-10 w-10 rounded-lg object-contain sm:block"
                  hideOnError
                />
              }
              title={selectedWarframe.name}
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
                  <button onClick={() => { setSavedBuilds(getSavedBuilds("warframe")); setShowSavedBuilds(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-all font-medium" title="Load Build">
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
                    onClick={() => setHasOrokinReactor(!hasOrokinReactor)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-all font-medium",
                      hasOrokinReactor
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
                    `/report-issue?type=warframe&name=${encodeURIComponent(selectedWarframe.name)}&id=${encodeURIComponent(selectedWarframe.id)}`,
                    builderReturnTo,
                  )}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400/70 transition-colors hover:bg-amber-500/5 hover:text-amber-400"
                >
                  <Flag className="h-3 w-3" /> <span className="hidden sm:inline">Report</span>
                </a>
              </BuilderActionBar>
            </BuilderItemHeader>

            <div className="mb-6">
              <CommunityBuildsPanel
                type="warframe"
                itemId={selectedWarframe.id}
                itemName={selectedWarframe.name}
                onLoadBuild={handleLoadCommunityBuild}
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div className="space-y-6">
                {/* Mod Configuration */}
                <div>
                  {dualFormConfig && (
                    <div className="mb-4 space-y-2">
                      <DualFormTabs
                        forms={dualFormConfig.forms}
                        activeFormId={activeDualFormId}
                        onChange={handleDualFormSwitch}
                      />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Sirius and Orion share one loadout slot. Mods and arcanes are saved per form; archon shards and Helminth apply to both.
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
                      MOD CONFIGURATION{dualFormConfig ? ` — ${dualFormConfig.forms.find((f) => f.id === activeDualFormId)?.label ?? ""}` : ""}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-mono",
                        capacityUsed > totalCapacity ? "text-red-400" : "text-muted-foreground"
                      )}>
                        {capacityUsed} / {totalCapacity}
                      </span>
                      {auraBonus > 0 && (
                        <span className="text-[10px] text-green-400/70">+{auraBonus} aura</span>
                      )}
                    </div>
                  </div>

                  {/* Aura + Exilus — top row (matches in-game warframe mod layout) */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-semibold text-purple-400 tracking-wider mb-1 block">AURA</span>
                      {(() => {
                        const equipped = equippedMods.find((m) => m.slotIndex === AURA_SLOT);
                        const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                        return (
                          <ModSlotCard
                            mod={mod}
                            rank={equipped?.rank ?? 0}
                            slotIndex={AURA_SLOT}
                            label="Aura"
                            slotPolarity={slotPolarities[AURA_SLOT]}
                            equippedModIds={equippedModIds}
                            onAdd={() => handleOpenModPicker(AURA_SLOT)}
                            onRemove={() => handleRemoveMod(AURA_SLOT)}
                            onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[AURA_SLOT] = p; else delete next[AURA_SLOT]; return next; })}
                          />
                        );
                      })()}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-cyan-400 tracking-wider mb-1 block">EXILUS</span>
                      {(() => {
                        const equipped = equippedMods.find((m) => m.slotIndex === EXILUS_SLOT);
                        const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                        return (
                          <ModSlotCard
                            mod={mod}
                            rank={equipped?.rank ?? 0}
                            slotIndex={EXILUS_SLOT}
                            label="Exilus"
                            slotPolarity={slotPolarities[EXILUS_SLOT]}
                            equippedModIds={equippedModIds}
                            onAdd={() => handleOpenModPicker(EXILUS_SLOT)}
                            onRemove={() => handleRemoveMod(EXILUS_SLOT)}
                            onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[EXILUS_SLOT] = p; else delete next[EXILUS_SLOT]; return next; })}
                          />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Build Importer */}
                  {showImporter && (
                    <div className="mb-4">
                      <BuildImporter
                        modCategory="warframe"
                        numSlots={8}
                        onImport={(mods) => {
                          const remapped = mods.map((m, i) => ({ ...m, slotIndex: i + 1 }));
                          setEquippedMods(remapped);
                          setShowImporter(false);
                        }}
                        onClose={() => setShowImporter(false)}
                      />
                    </div>
                  )}
                  {/* Regular Mod Slots (1-8) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Array.from({ length: 8 }, (_, i) => {
                      const slotIdx = i + 1;
                      const equipped = equippedMods.find((m) => m.slotIndex === slotIdx);
                      const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                      return (
                        <ModSlotCard
                          key={slotIdx}
                          mod={mod}
                          rank={equipped?.rank ?? 0}
                          slotIndex={slotIdx}
                          slotPolarity={slotPolarities[slotIdx]}
                          equippedModIds={equippedModIds}
                          onAdd={() => handleOpenModPicker(slotIdx)}
                          onRemove={() => handleRemoveMod(slotIdx)}
                          onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[slotIdx] = p; else delete next[slotIdx]; return next; })}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Archon Shards */}
                <div>
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-1">
                    ARCHON SHARDS
                  </h2>
                  {dualFormConfig && (
                    <p className="mb-2 text-[10px] text-muted-foreground">
                      One shard set for Sirius &amp; Orion — switching forms keeps these equipped.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {equippedShards.map((shard, i) => (
                      <ArchonShardSlot
                        key={i}
                        shard={shard}
                        slotIndex={i}
                        onEquip={() => handleOpenShardPicker(i)}
                        onRemove={() => handleRemoveShard(i)}
                      />
                    ))}
                  </div>
                </div>

                {/* Warframe Arcanes (2 slots) */}
                <div>
                  <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Gem className="h-4 w-4 text-purple-400" />
                    ARCANES
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {equippedArcanes.map((arcane, i) => (
                      <ArcaneSlotCard
                        key={i}
                        arcane={arcane}
                        rank={equippedArcaneRanks[i] ?? arcane?.maxRank ?? 0}
                        label={`Arcane ${i + 1}`}
                        onAdd={() => handleOpenArcanePicker(i)}
                        onRemove={() => {
                          setEquippedArcanes((prev) => { const next = [...prev]; next[i] = null; return next; });
                          setEquippedArcaneRanks((prev) => { const next = [...prev]; next[i] = 5; return next; });
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Abilities + Helminth */}
                {abilityDisplayEntries.length > 0 && (
                  <div>
                    <AbilitiesSectionHeader
                      formLabel={
                        dualFormConfig
                          ? dualFormConfig.forms.find((f) => f.id === activeDualFormId)?.label
                          : undefined
                      }
                    />
                    <div className="grid auto-rows-fr items-stretch gap-4 sm:grid-cols-2">
                      {abilityDisplayEntries.map((entry) => {
                        const slotIndex = entry.gameSlot - 1;
                        const hasHelminth = helminthSlot != null && helminthAbility != null;
                        const isHelminthed = hasHelminth && helminthSlot === slotIndex;
                        const canSubsumeHere = !hasHelminth || isHelminthed;
                        const openHelminthPicker = () => {
                          setHelminthPickerSlot(slotIndex);
                          setHelminthPickerOpen(true);
                        };
                        return (
                          <div key={entry.key} className="flex h-full flex-col">
                            {isHelminthed ? (
                              <HelminthAbilityCard
                                ability={helminthAbility}
                                stats={calculatedStats}
                                gameSlot={entry.gameSlot}
                                onChange={openHelminthPicker}
                                onRemove={() => { setHelminthSlot(null); setHelminthAbility(null); }}
                              />
                            ) : (
                              <AbilityCard
                                ability={entry.ability}
                                index={entry.abilityIndex}
                                gameSlot={entry.gameSlot}
                                formLabel={entry.formLabel}
                                stats={calculatedStats}
                                warframeId={selectedWarframe.id}
                                exaltedWeapon={getExaltedWeaponForAbility(
                                  selectedWarframe.id,
                                  entry.ability.name,
                                  allWeaponsData,
                                )}
                                footer={
                                  canSubsumeHere ? (
                                    <div className="mt-auto border-t border-border/40 pt-3">
                                      <HelminthSubsumeButton onClick={openHelminthPicker} />
                                    </div>
                                  ) : undefined
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {exaltedWeapon && (
                  <ExaltedWeaponSection
                    exaltedWeapon={exaltedWeapon}
                    exaltedWeapons={exaltedWeapons}
                    exaltedCapacity={exaltedCapacity}
                    exaltedMods={exaltedMods}
                    modsMap={modsMap}
                    exaltedSlotPolarities={exaltedSlotPolarities}
                    exaltedArcaneConfig={exaltedArcaneConfig}
                    exaltedArcanes={exaltedArcanes}
                    exaltedStats={exaltedStats}
                    exaltedBaseStats={exaltedBaseStats}
                    exaltedContributionContext={exaltedContributionContext}
                    sectionTitle={exaltedMeleeWeapon ? "Exalted Primary" : "Exalted Weapon"}
                    hideSiblingNote={!!exaltedMeleeWeapon}
                    onAddMod={(i) => {
                      setExaltedActiveSlot(i);
                      setExaltedModPickerOpen(true);
                    }}
                    onRemoveMod={(i) =>
                      setExaltedMods((prev) => prev.filter((m) => m.slotIndex !== i))
                    }
                    onPolarize={(i, p) =>
                      setExaltedSlotPolarities((prev) => {
                        const next = { ...prev };
                        if (p) next[i] = p;
                        else delete next[i];
                        return next;
                      })
                    }
                    onAddArcane={(i) => {
                      setExaltedActiveArcaneSlot(i);
                      setExaltedArcanePickerOpen(true);
                    }}
                    onRemoveArcane={(i) =>
                      setExaltedArcanes((prev) => {
                        const next = [...prev];
                        next[i] = null;
                        return next;
                      })
                    }
                  />
                )}

                {exaltedMeleeWeapon && (
                  <ExaltedWeaponSection
                    exaltedWeapon={exaltedMeleeWeapon}
                    exaltedWeapons={exaltedWeapons}
                    exaltedCapacity={exaltedMeleeCapacity}
                    exaltedMods={exaltedMeleeMods}
                    modsMap={modsMap}
                    exaltedSlotPolarities={exaltedMeleeSlotPolarities}
                    exaltedArcaneConfig={exaltedMeleeArcaneConfig}
                    exaltedArcanes={exaltedMeleeArcanes}
                    exaltedStats={exaltedMeleeStats}
                    exaltedBaseStats={exaltedMeleeBaseStats}
                    exaltedContributionContext={exaltedMeleeContributionContext}
                    sectionTitle="Exalted Melee"
                    hideSiblingNote
                    onAddMod={(i) => {
                      setExaltedMeleeActiveSlot(i);
                      setExaltedMeleeModPickerOpen(true);
                    }}
                    onRemoveMod={(i) =>
                      setExaltedMeleeMods((prev) => prev.filter((m) => m.slotIndex !== i))
                    }
                    onPolarize={(i, p) =>
                      setExaltedMeleeSlotPolarities((prev) => {
                        const next = { ...prev };
                        if (p) next[i] = p;
                        else delete next[i];
                        return next;
                      })
                    }
                    onAddArcane={(i) => {
                      setExaltedMeleeActiveArcaneSlot(i);
                      setExaltedMeleeArcanePickerOpen(true);
                    }}
                    onRemoveArcane={(i) =>
                      setExaltedMeleeArcanes((prev) => {
                        const next = [...prev];
                        next[i] = null;
                        return next;
                      })
                    }
                  />
                )}

                {/* Build Description */}
                <div>
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
                <WarframeStatsPanel
                  stats={calculatedStats}
                  warframe={selectedWarframe}
                  equippedMods={equippedMods}
                  allMods={modsMap}
                  equippedShards={equippedShards}
                  equippedArcanes={equippedArcanes}
                  arcaneRanks={equippedArcaneRanks}
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
        category="warframe"
        slotType={activeSlotType}
        equippedModIds={equippedModIds}
        onSelect={handleSelectFromPicker}
        warframeId={selectedWarframe?.id}
        arcaneCatalog={modPickerMode === "arcanes" ? warframeArcanes : undefined}
        pickerMode={modPickerMode}
        equippedArcaneIds={equippedArcanes.filter(Boolean).map((a) => a!.id)}
      />

      <ShardPickerDialog
        open={shardPickerOpen}
        onOpenChange={setShardPickerOpen}
        allArchonShards={allArchonShards}
        onSelectBonus={handleSelectShardBonus}
      />

      <HelminthPickerDialog
        open={helminthPickerOpen}
        onOpenChange={setHelminthPickerOpen}
        pickerSlot={helminthPickerSlot}
        hasCurrentHelminth={!!helminthAbility}
        onSelect={(ability, slot) => {
          setHelminthSlot(slot);
          setHelminthAbility(ability);
        }}
      />

      {/* Exalted Weapon Mod Picker */}
      {exaltedWeapon && (
        <ModPicker
          open={exaltedModPickerOpen}
          onClose={() => setExaltedModPickerOpen(false)}
          mods={allMods}
          category={
            exaltedWeapon.category === "melee" || exaltedWeapon.category === "archmelee"
              ? "melee"
              : exaltedWeapon.category === "secondary" ||
                  exaltedWeapon.category === "pistol" ||
                  exaltedWeapon.category === "dual_pistols"
                ? "secondary"
                : "primary"
          }
          equippedModIds={exaltedMods.map((m) => m.modId)}
          weaponCategory={exaltedWeapon.category}
          weapon={exaltedWeapon}
          onSelect={(mod, rank) => {
            setExaltedMods((prev) => {
              const filtered = prev.filter((m) => m.slotIndex !== exaltedActiveSlot);
              return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: exaltedActiveSlot, polarity: mod.polarity, drain: mod.drain }];
            });
          }}
        />
      )}

      {exaltedWeapon && exaltedArcaneConfig.slots > 0 && (
        <ArcanePicker
          open={exaltedArcanePickerOpen}
          onOpenChange={setExaltedArcanePickerOpen}
          arcanes={exaltedArcaneConfig.arcanes}
          equippedArcaneIds={exaltedArcanes.filter(Boolean).map((a) => a!.id)}
          onSelect={(arcane) => {
            setExaltedArcanes((prev) => {
              const next = [...prev];
              while (next.length < exaltedArcaneConfig.slots) next.push(null);
              next[exaltedActiveArcaneSlot] = arcane;
              return next;
            });
            setExaltedArcanePickerOpen(false);
          }}
          title={`Select ${exaltedArcaneConfig.label}`}
        />
      )}

      {exaltedMeleeWeapon && (
        <ModPicker
          open={exaltedMeleeModPickerOpen}
          onClose={() => setExaltedMeleeModPickerOpen(false)}
          mods={allMods}
          category="melee"
          equippedModIds={exaltedMeleeMods.map((m) => m.modId)}
          weaponCategory={exaltedMeleeWeapon.category}
          weapon={exaltedMeleeWeapon}
          onSelect={(mod, rank) => {
            setExaltedMeleeMods((prev) => {
              const filtered = prev.filter((m) => m.slotIndex !== exaltedMeleeActiveSlot);
              return [
                ...filtered,
                {
                  modId: mod.id,
                  modName: mod.name,
                  rank,
                  slotIndex: exaltedMeleeActiveSlot,
                  polarity: mod.polarity,
                  drain: mod.drain,
                },
              ];
            });
          }}
        />
      )}

      {exaltedMeleeWeapon && exaltedMeleeArcaneConfig.slots > 0 && (
        <ArcanePicker
          open={exaltedMeleeArcanePickerOpen}
          onOpenChange={setExaltedMeleeArcanePickerOpen}
          arcanes={exaltedMeleeArcaneConfig.arcanes}
          equippedArcaneIds={exaltedMeleeArcanes.filter(Boolean).map((a) => a!.id)}
          onSelect={(arcane) => {
            setExaltedMeleeArcanes((prev) => {
              const next = [...prev];
              while (next.length < exaltedMeleeArcaneConfig.slots) next.push(null);
              next[exaltedMeleeActiveArcaneSlot] = arcane;
              return next;
            });
            setExaltedMeleeArcanePickerOpen(false);
          }}
          title={`Select ${exaltedMeleeArcaneConfig.label}`}
        />
      )}

      <SavedBuildsDialog
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
        title="Saved Warframe Builds"
        builds={savedBuilds}
        accent="purple"
        getSubtitle={(build) => {
          const d = build.data as WarframeBuildData;
          const wf = allWarframes.find((w) => w.id === d.warframeId);
          return `${wf?.name ?? d.warframeId} • ${d.mods.length} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || (selectedWarframe ? `${selectedWarframe.name} Build` : "Warframe Build")}
        defaultDescription={buildDescription}
        defaultIsPublic={saveDialogDefaultPublic}
        onSave={handleSaveBuildConfirm}
      />
    </PageShell>
  );
}
