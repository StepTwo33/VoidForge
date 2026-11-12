"use client";

import { dropUnknownMods } from "@/lib/mods/known-mods";
import {
  WARFRAME_URL_PARAM,
  hasBuildLinkParam,
  hrefForWarframeCatalogPick,
  hrefWithWarframeParam,
  warframeIdFromParams,
} from "@/lib/builds/warframe-url-param";
import {
  applyPolarityOverride,
  effectiveSlotPolarities,
  innateSlotPolarities,
  isInnatePolarity,
} from "@/lib/builds/innate-polarities";
import { BuilderSectionNav } from "@/components/builder-section-nav";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
import { MobileStatSummary } from "@/components/stats/mobile-stat-summary";
import { warframeStatSummary } from "@/lib/ui/mobile-stat-summary";
import { ModPicker, buildSlotNav, SlotType } from "@/components/mod-picker";
import { useWeapons, useWarframes, useMods, useArchonShards } from "@/lib/weapons/use-data";
import {
  calculateWarframeBuild,
  getWarframeArmorModBase,
  getWarframeEnergyModBase,
  getWarframeHealthModBase,
  getWarframeShieldModBase,
  calculateWeaponBuild,
  calculateWeaponBuildWithArcanes,
  applyWarframeShardsAndArcanes,
  applyWarframePassivePreArcanes,
  applyWarframePassivePostArcanes,
  resolveDefaultOffWarframeArcaneStacks,
  resolveExaltedPassiveBuffs,
  DEFAULT_WARFRAME_PASSIVE_SIM,
  type WarframePassiveSimState,
} from "@/lib/calc/calculator";
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
  SimulationParams,
} from "@/lib/types";
import { DEFAULT_SIM_PARAMS, type ModSlot } from "@/lib/types";
import { Zap, Flag, Gem, FolderOpen, Share2, Check, Upload, Shield, ArrowLeftRight } from "lucide-react";
import { warframeArcanes } from "@/data/arcanes";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import { ArchonShardSlot } from "@/components/archon-shard-slot";
import { allHelminthAbilities, HelminthAbility } from "@/data/helminth";
import { isNecramechId } from "@/data/archwing";
import { buildAbilityTTKEntries } from "@/lib/calc/ability-ttk";
import { helminthToAbility } from "@/lib/builds/helminth-resolve";
import { AbilityTTKPanel } from "@/components/ability-ttk-panel";
import { cn } from "@/lib/utils";
import { appendReturnTo } from "@/lib/site/nav-return";
import {
  getExaltedWeaponForAbility,
  getExaltedWeaponsForWarframe,
  getMeleeExaltedWeapon,
  getPrimaryExaltedWeapon,
} from "@/lib/weapons/exalted-weapons";
import { SavedBuild, WarframeBuildData, WeaponBuildData, persistSavedBuild, resolveActiveArcaneList, resolveSavedArcaneSlots } from "@/lib/builds/build-storage";
import { getLoadouts } from "@/lib/builds/loadouts";
import { applyWeaponIncarnonMobilityToWarframe, setBonusLinkageFromLoadout } from "@/lib/builds/loadout-stats";
import { useBuilderSavedBuilds } from "@/lib/builds/use-builder-saved-builds";
import { reportUnreadableShareLink } from "@/lib/builds/share-link-errors";
import { cleanLoadedBuild, cleanLoadedMods } from "@/lib/builds/incompatible-mod-warnings";
import { extractBuildFromUrlAsync, shareExaltedToBuildSlice, shareFormToBuildSlice, warframeBuildToShare } from "@/lib/builds/build-url";
import { shareBuilderBuild } from "@/lib/builds/share-build";
import { toast } from "sonner";
import { getWarframeImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { BuildImporter, type ImportApplied } from "@/components/build-importer";
import { warframeImportEligibility } from "@/lib/builds/import-eligibility";
import { describeImportResult } from "@/lib/builds/mod-list-import";
import { ImportCapacityNotice, useImportCapacityNotice } from "@/components/import-capacity-notice";
import { importCapacityToastText, isOverCapacity } from "@/lib/builds/import-capacity-notice";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { BuilderSaveControls } from "@/components/builder-save-controls";
import { saveIdentityId } from "@/lib/builds/quicksave";
import { LoadoutEditBanner } from "@/components/loadout-edit-banner";
import { SAVE_DIRTY_CLASS, SAVE_DIRTY_DOT_CLASS, stableBuildSnapshot, useUnsavedChanges } from "@/lib/builds/unsaved-changes";
import { loadoutSlotLabel, updateLoadoutSlot } from "@/lib/builds/loadout-edit-context";
import { CommunityBuildsPanel } from "@/components/community-builds-panel";
import { DualFormTabs } from "@/components/dual-form-tabs";
import { useCloudBuildFromUrl, fetchCloudBuild, setCloudBuildInUrl, clearCloudBuildInUrl, markCloudBuildLoaded } from "@/lib/builds/use-cloud-build-from-url";
import { snapshotFromBuild } from "@/lib/builds/compare-build";
import { BuildCompareDialog } from "@/components/compare/build-compare-dialog";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";
import {
  dualFormStatesFromBuild,
  getDualForm,
  getDualFormConfig,
  warframeForDualForm,
  buildAbilityDisplayEntries,
  serializeDualFormBuilds,
  EMPTY_ARCANE_IDS,
  DEFAULT_ARCANE_RANKS,
  type DualFormBuildSlice,
} from "@/lib/builds/dual-form-warframes";
import { AbilitiesSectionHeader } from "@/components/ability-display";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { AbilityCard, HelminthAbilityCard, HelminthSubsumeButton } from "./ability-cards";
import { applyCostAugments } from "@/lib/calc/ability-augment-rows";
import { ShardPickerDialog } from "./shard-picker-dialog";
import { HelminthPickerDialog } from "./helminth-picker-dialog";
import { ExaltedWeaponSection } from "./exalted-weapon-section";
import { StancePickerDialog } from "../weapon-builder/stance-picker-dialog";
import { STANCE_WEAPON_TYPE } from "@/data/stances";
import {
  exaltedMaxCapacity,
  isStanceAllowed,
  splitUnavailableSlotMods,
  stanceSlotInfo,
  weaponHasExilusSlot,
} from "@/lib/weapons/exalted-melee-slots";
import {
  getWarframeAuraSlotIndices,
  WARFRAME_AURA_SLOT,
  WARFRAME_SECOND_AURA_SLOT,
} from "@/lib/warframes/aura-slots";
import { formatAbilityEfficiencyPct } from "@/lib/display/ability-efficiency";

const EMPTY_SHARDS: (EquippedArchonShard | null)[] = [null, null, null, null, null];

// Slot layout: 0=Aura, 1-8=Regular, 9=Exilus, 10=Jade second Aura
const AURA_SLOT = WARFRAME_AURA_SLOT;
const EXILUS_SLOT = 9;
/** Exalted weapon Exilus matches weapon-builder (index 8). */
const EXALTED_WEAPON_EXILUS_SLOT = 8;

function getSlotType(index: number): SlotType {
  if (index === AURA_SLOT || index === WARFRAME_SECOND_AURA_SLOT) return "aura";
  if (index === EXILUS_SLOT) return "exilus";
  return "regular";
}

function exaltedWeaponModSlotType(weapon: Weapon, slotIndex: number): SlotType {
  if (slotIndex !== EXALTED_WEAPON_EXILUS_SLOT) return "regular";
  if (weapon.category === "melee" || weapon.category === "archmelee" || weapon.category === "beast_claw") {
    return "weapon_exilus_melee";
  }
  if (["pistol", "secondary", "dual_pistols"].includes(weapon.category)) {
    return "weapon_exilus_secondary";
  }
  return "weapon_exilus_primary";
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
  const [helminthSlot, setHelminthSlot] = useState<number | null>(null); // which ability slot (0-3) is replaced
  const [helminthAbility, setHelminthAbility] = useState<HelminthAbility | null>(null);
  const [helminthPickerOpen, setHelminthPickerOpen] = useState(false);
  const [wfArcaneStacksById, setWfArcaneStacksById] = useState<Record<string, number>>({});
  const [wfConditionalModStacksById, setWfConditionalModStacksById] = useState<Record<string, number>>({});
  const [wfPassiveSim, setWfPassiveSim] = useState<WarframePassiveSimState>(DEFAULT_WARFRAME_PASSIVE_SIM);
  const [exaltedUserSim, setExaltedUserSim] = useState<SimulationParams>(DEFAULT_SIM_PARAMS);
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
  const [exaltedArcaneRanks, setExaltedArcaneRanks] = useState<number[]>([5, 5]);
  const [exaltedArcanePickerOpen, setExaltedArcanePickerOpen] = useState(false);
  const [exaltedActiveArcaneSlot, setExaltedActiveArcaneSlot] = useState(0);
  const [exaltedMeleeMods, setExaltedMeleeMods] = useState<EquippedMod[]>([]);
  const [exaltedMeleeModPickerOpen, setExaltedMeleeModPickerOpen] = useState(false);
  const [exaltedMeleeActiveSlot, setExaltedMeleeActiveSlot] = useState(0);
  const [exaltedMeleeSlotPolarities, setExaltedMeleeSlotPolarities] = useState<Record<number, string>>({});
  const [exaltedMeleeArcanes, setExaltedMeleeArcanes] = useState<(Mod | null)[]>([null]);
  const [exaltedMeleeArcaneRanks, setExaltedMeleeArcaneRanks] = useState<number[]>([5, 5]);
  const [exaltedMeleeArcanePickerOpen, setExaltedMeleeArcanePickerOpen] = useState(false);
  const [exaltedMeleeActiveArcaneSlot, setExaltedMeleeActiveArcaneSlot] = useState(0);
  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const [activeDualFormId, setActiveDualFormId] = useState("sirius");
  const [dualFormBuilds, setDualFormBuilds] = useState<Record<string, DualFormBuildSlice>>({});
  const { savedBuilds, refreshSavedBuilds, deleteSavedBuild } = useBuilderSavedBuilds("warframe");
  const { savedBuilds: savedWeaponBuilds, refreshSavedBuilds: refreshSavedWeaponBuilds } = useBuilderSavedBuilds("weapon");
  const [exaltedActiveBuildName, setExaltedActiveBuildName] = useState<string | null>(null);
  const [exaltedMeleeActiveBuildName, setExaltedMeleeActiveBuildName] = useState<string | null>(null);
  /** Chosen stance on an exalted melee with a free stance slot (Garuda Talons); locked exalted stances are derived. */
  const [exaltedStanceId, setExaltedStanceId] = useState<string | null>(null);
  const [exaltedMeleeStanceId, setExaltedMeleeStanceId] = useState<string | null>(null);
  const [stancePickerTarget, setStancePickerTarget] = useState<"exalted" | "exaltedMelee" | null>(null);
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [pickerTab, setPickerTab] = useState<"catalog" | "saved">("catalog");
  const [showImporter, setShowImporter] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildTags, setBuildTags] = useState<string[]>([]);
  const [buildCreatedAt, setBuildCreatedAt] = useState<number | null>(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveDialogDefaultPublic, setSaveDialogDefaultPublic] = useState(false);

  const activeDualForm = useMemo(
    () => (selectedWarframe ? getDualForm(selectedWarframe.id, activeDualFormId) : null),
    [selectedWarframe, activeDualFormId],
  );
  /** Ability set belongs to the active form (Sevagoth's Shadow): Helminth can't replace it. */
  const formOwnsAbilities = !!activeDualForm?.abilities;
  const dualFormConfig = useMemo(
    () => (selectedWarframe ? getDualFormConfig(selectedWarframe.id) : null),
    [selectedWarframe],
  );

  const effectiveWfArcaneStacksById = useMemo(
    () => resolveDefaultOffWarframeArcaneStacks(equippedArcanes, wfArcaneStacksById),
    [equippedArcanes, wfArcaneStacksById],
  );

  const modSlotsToEquipped = useCallback((mods: { modId: string; rank: number; slotIndex: number }[]): EquippedMod[] => {
    return dropUnknownMods(mods, modsMap).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    });
  }, []);

  // Load build from URL ?build= param (hash share links)
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        const params = new URLSearchParams(window.location.search);
        const shared = await extractBuildFromUrlAsync(params);
        if (cancelled) return;
        if (!shared) {
          reportUnreadableShareLink(params);
          return;
        }
        if (shared.type !== "warframe") return;
        const wf = allWarframes.find((w) => w.id === shared.itemId);
        if (!wf) {
          toast.error("Warframe not found", { description: "This shared build uses a Warframe that is no longer in the catalog." });
          return;
        }
        setSelectedWarframe(wf);
        setShowWarframeList(false);
        const shareConfig = getDualFormConfig(wf.id);
        setActiveDualFormId(shareConfig?.defaultFormId ?? "sirius");
        if (shareConfig && shared.dualFormBuilds) {
          const nonDefault: Record<string, DualFormBuildSlice> = {};
          for (const form of shareConfig.forms) {
            if (form.id === shareConfig.defaultFormId) continue;
            const slice = shared.dualFormBuilds[form.id];
            nonDefault[form.id] = slice
              ? shareFormToBuildSlice(slice)
              : { mods: [], slotPolarities: {}, arcaneIds: [...EMPTY_ARCANE_IDS], arcaneRanks: [...DEFAULT_ARCANE_RANKS] };
          }
          setDualFormBuilds(nonDefault);
        } else {
          setDualFormBuilds({});
        }
        setEquippedMods(dropUnknownMods(cleanLoadedMods(shared.mods.map((m, i) => ({ modId: m.id, rank: m.rank, slotIndex: m.slotIndex ?? i }))), modsMap).map((m) => {
          const mod = modsMap.get(m.modId);
          return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
        }));
        if (shared.slotPolarities) {
          setSlotPolarities(
            Object.fromEntries(Object.entries(shared.slotPolarities).map(([k, v]) => [Number(k), v])),
          );
        }
        if (shared.arcanes) {
          const restoredArcanes = resolveSavedArcaneSlots(shared.arcanes.map((id) => id || null), 2);
          setEquippedArcanes(restoredArcanes);
          setEquippedArcaneRanks([
            shared.arcaneRanks?.[0] ?? restoredArcanes[0]?.maxRank ?? 5,
            shared.arcaneRanks?.[1] ?? restoredArcanes[1]?.maxRank ?? 5,
          ]);
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
        if (shared.hasOrokinReactor) setHasOrokinReactor(true);
        if (shared.helminthSlot != null) {
          setHelminthSlot(shared.helminthSlot);
          setHelminthAbility(
            shared.helminthAbilityId
              ? allHelminthAbilities.find((a) => a.id === shared.helminthAbilityId) ?? null
              : null,
          );
        }
        const shareExaltedMods = (mods: { modId: string; rank: number; slotIndex: number }[]) =>
          dropUnknownMods(mods, modsMap).map((m, i) => {
            const mod = modsMap.get(m.modId);
            return { ...m, slotIndex: m.slotIndex ?? i, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
          });
        if (shared.exalted) {
          const slice = shareExaltedToBuildSlice(shared.exalted);
          setExaltedMods(shareExaltedMods(slice.mods));
          setExaltedSlotPolarities(slice.slotPolarities);
          const resolvedEx = resolveSavedArcaneSlots(slice.arcaneIds, 2);
          setExaltedArcanes(resolvedEx);
          setExaltedArcaneRanks([
            slice.arcaneRanks[0] ?? resolvedEx[0]?.maxRank ?? 5,
            slice.arcaneRanks[1] ?? resolvedEx[1]?.maxRank ?? 5,
          ]);
          if (slice.stanceModId) setExaltedStanceId(slice.stanceModId);
        }
        if (shared.exaltedMelee) {
          const slice = shareExaltedToBuildSlice(shared.exaltedMelee);
          setExaltedMeleeMods(shareExaltedMods(slice.mods));
          setExaltedMeleeSlotPolarities(slice.slotPolarities);
          const resolvedExM = resolveSavedArcaneSlots(slice.arcaneIds, 2);
          setExaltedMeleeArcanes(resolvedExM);
          setExaltedMeleeArcaneRanks([
            slice.arcaneRanks[0] ?? resolvedExM[0]?.maxRank ?? 5,
            slice.arcaneRanks[1] ?? resolvedExM[1]?.maxRank ?? 5,
          ]);
          if (slice.stanceModId) setExaltedMeleeStanceId(slice.stanceModId);
        }
        if (shared.arcaneStacksById) setWfArcaneStacksById(shared.arcaneStacksById);
        if (shared.conditionalModStacksById) setWfConditionalModStacksById(shared.conditionalModStacksById);
        setCurrentBuildId(null);
        setBuildName(`${wf.name} Build`);
        setBuildDescription("");
        // ?build= stays in the URL (shareable, survives refresh). Runs once on mount.
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []); // intentionally once on mount (warframe/mod catalogs are sync)

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
      isMR30: false,
      ...(Object.keys(wfArcaneStacksById).length > 0 ? { arcaneStacksById: wfArcaneStacksById } : {}),
      ...(Object.keys(wfConditionalModStacksById).length > 0
        ? { conditionalModStacksById: wfConditionalModStacksById }
        : {}),
      helminthSlot,
      helminthAbilityId: helminthAbility?.id ?? null,
      exaltedMods: exaltedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      exaltedSlotPolarities,
      exaltedArcaneIds: exaltedArcanes.map((a) => a?.id ?? null),
      exaltedArcaneRanks: [...exaltedArcaneRanks],
      ...(exaltedStanceId ? { exaltedStanceModId: exaltedStanceId } : {}),
      exaltedMeleeMods: exaltedMeleeMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      exaltedMeleeSlotPolarities,
      exaltedMeleeArcaneIds: exaltedMeleeArcanes.map((a) => a?.id ?? null),
      exaltedMeleeArcaneRanks: [...exaltedMeleeArcaneRanks],
      ...(exaltedMeleeStanceId ? { exaltedMeleeStanceModId: exaltedMeleeStanceId } : {}),
    };
  }, [
    selectedWarframe,
    buildWarframePayload,
    hasOrokinReactor,
    wfArcaneStacksById,
    wfConditionalModStacksById,
    helminthSlot,
    helminthAbility,
    exaltedMods,
    exaltedSlotPolarities,
    exaltedArcanes,
    exaltedArcaneRanks,
    exaltedMeleeMods,
    exaltedMeleeSlotPolarities,
    exaltedMeleeArcanes,
    exaltedMeleeArcaneRanks,
    exaltedStanceId,
    exaltedMeleeStanceId,
  ]);

  const { dirty: hasUnsavedChanges, markClean } = useUnsavedChanges(useMemo(() => stableBuildSnapshot(buildWarframeData()), [buildWarframeData]));

  const applyLoadedBuild = useCallback((rawBuild: SavedBuild, options?: { silent?: boolean }) => {
    const build = cleanLoadedBuild(rawBuild);
    const d = build.data as WarframeBuildData;
    const wf = allWarframes.find((w) => w.id === d.warframeId);
    if (!wf) { toast.error("Warframe not found"); return; }
    markClean();
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
    setWfArcaneStacksById(d.arcaneStacksById ?? {});
    setWfConditionalModStacksById(d.conditionalModStacksById ?? {});
    setWfPassiveSim(DEFAULT_WARFRAME_PASSIVE_SIM);
    setExaltedUserSim(DEFAULT_SIM_PARAMS);
    setSelectedWarframe(wf);
    setHasOrokinReactor(d.hasOrokinReactor);
    setExaltedMods(dropUnknownMods(d.exaltedMods, modsMap).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    setExaltedSlotPolarities(d.exaltedSlotPolarities || {});
    setExaltedStanceId(d.exaltedStanceModId ?? null);
    setExaltedMeleeStanceId(d.exaltedMeleeStanceModId ?? null);
    const resolvedExArcanes = resolveSavedArcaneSlots(d.exaltedArcaneIds, 2);
    setExaltedArcanes(resolvedExArcanes);
    setExaltedArcaneRanks([
      d.exaltedArcaneRanks?.[0] ?? resolvedExArcanes[0]?.maxRank ?? 5,
      d.exaltedArcaneRanks?.[1] ?? resolvedExArcanes[1]?.maxRank ?? 5,
    ]);
    setExaltedMeleeMods(dropUnknownMods(d.exaltedMeleeMods, modsMap).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    setExaltedMeleeSlotPolarities(d.exaltedMeleeSlotPolarities || {});
    const resolvedExMeleeArcanes = resolveSavedArcaneSlots(d.exaltedMeleeArcaneIds, 2);
    setExaltedMeleeArcanes(resolvedExMeleeArcanes);
    setExaltedMeleeArcaneRanks([
      d.exaltedMeleeArcaneRanks?.[0] ?? resolvedExMeleeArcanes[0]?.maxRank ?? 5,
      d.exaltedMeleeArcaneRanks?.[1] ?? resolvedExMeleeArcanes[1]?.maxRank ?? 5,
    ]);
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
    setBuildTags(build.tags ?? []);
    setBuildCreatedAt(build.createdAt || Date.now());
    setShowSavedBuilds(false);
    setShowWarframeList(false);
    if (!options?.silent) {
      toast.info("Build loaded", { description: build.name });
    }
  }, [markClean, modSlotsToEquipped]);

  const handleSaveBuildConfirm = useCallback(async ({ name, description, isPublic, tags, asNew = false }: SaveBuildDialogValues & { asNew?: boolean }) => {
    const data = buildWarframeData();
    if (!data || !selectedWarframe) return;
    const build: SavedBuild = {
      id: saveIdentityId(currentBuildId, asNew),
      name,
      description,
      isPublic,
      tags,
      type: "warframe",
      createdAt: asNew || !buildCreatedAt ? Date.now() : buildCreatedAt,
      updatedAt: Date.now(),
      data,
    };
    const result = await persistSavedBuild(build);
    setSaveAsNew(false);
    setCurrentBuildId(result.id);
    setBuildName(name);
    setBuildDescription(description);
    setBuildTags(tags);
    setBuildCreatedAt(build.createdAt);
    setBuildIsPublic(result.isPublic);
    void refreshSavedBuilds();
    markClean();
    if (result.synced) {
      toast.success(asNew || !currentBuildId ? "Saved as new build" : "Build updated", { description: `${name} saved to your account` });
    } else {
      toast.success(asNew || !currentBuildId ? "Saved as new build" : "Build updated on this device", { description: currentBuildId && !asNew ? "Log in to sync builds to your account" : "Saved on this device. Log in to sync builds to your account." });
    }
  }, [buildWarframeData, selectedWarframe, currentBuildId, refreshSavedBuilds, buildCreatedAt, markClean]);

  const handleQuickSave = useCallback(async () => {
    if (!currentBuildId) return;
    await handleSaveBuildConfirm({
      name: buildName || (selectedWarframe ? `${selectedWarframe.name} Build` : "Warframe Build"),
      description: buildDescription,
      isPublic: buildIsPublic,
      tags: buildTags,
      target: "new",
      asNew: false,
    });
    markClean();
  }, [currentBuildId, handleSaveBuildConfirm, buildName, selectedWarframe, buildDescription, buildIsPublic, buildTags, markClean]);

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
  const { context: loadoutCtx, clearContext: clearLoadoutCtx } = useLoadoutSlotFromUrl(
    "warframe",
    useCallback((build) => applyLoadedBuild(build, { silent: true }), [applyLoadedBuild]),
    allWarframes.length > 0,
  );

  const handleSaveDialog = useCallback(async (values: SaveBuildDialogValues) => {
    if (values.target === "loadout" && loadoutCtx) {
      const data = buildWarframeData();
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
    await handleSaveBuildConfirm({ ...values, asNew: saveAsNew });
    if (loadoutCtx) clearLoadoutCtx();
    markClean();
    return true;
  }, [markClean, loadoutCtx, clearLoadoutCtx, handleSaveBuildConfirm, buildWarframeData, saveAsNew]);

  const handleDeleteBuild = useCallback((id: string) => {
    void deleteSavedBuild(id);
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId, deleteSavedBuild]);

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

  const stanceTypeOf = useCallback((id: string) => STANCE_WEAPON_TYPE[id], []);
  const exaltedStanceSlot = useMemo(() => stanceSlotInfo(exaltedWeapon), [exaltedWeapon]);
  const exaltedMeleeStanceSlot = useMemo(() => stanceSlotInfo(exaltedMeleeWeapon), [exaltedMeleeWeapon]);
  const exaltedStance = useMemo(() => {
    const m = exaltedStanceId ? modsMap.get(exaltedStanceId) : undefined;
    return m && isStanceAllowed(exaltedWeapon, m, stanceTypeOf) ? m : null;
  }, [exaltedStanceId, modsMap, exaltedWeapon, stanceTypeOf]);
  const exaltedMeleeStance = useMemo(() => {
    const m = exaltedMeleeStanceId ? modsMap.get(exaltedMeleeStanceId) : undefined;
    return m && isStanceAllowed(exaltedMeleeWeapon, m, stanceTypeOf) ? m : null;
  }, [exaltedMeleeStanceId, modsMap, exaltedMeleeWeapon, stanceTypeOf]);
  // Pseudo-exalted melee have no Exilus slot: a saved Exilus mod is ignored (and flagged in the panel).
  const exaltedSplit = useMemo(() => splitUnavailableSlotMods(exaltedWeapon, exaltedMods), [exaltedWeapon, exaltedMods]);
  const exaltedModsActive = exaltedSplit.kept;
  const exaltedMeleeSplit = useMemo(
    () => splitUnavailableSlotMods(exaltedMeleeWeapon, exaltedMeleeMods),
    [exaltedMeleeWeapon, exaltedMeleeMods],
  );
  const exaltedMeleeModsActive = exaltedMeleeSplit.kept;
  const exaltedMaxCap = exaltedMaxCapacity(exaltedWeapon, exaltedStance);
  const exaltedMeleeMaxCap = exaltedMaxCapacity(exaltedMeleeWeapon, exaltedMeleeStance);

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
    const linkedLoadout = loadoutCtx
      ? getLoadouts().find((l) => l.id === loadoutCtx.loadoutId)
      : undefined;
    const linkage = linkedLoadout
      ? {
          ...setBonusLinkageFromLoadout(linkedLoadout),
          warframeMods: modSlots,
        }
      : undefined;
    // Dual-form frames (Orion) can have their own stat block per form.
    const statsWarframe = dualFormConfig ? warframeForDualForm(selectedWarframe, activeDualFormId) : selectedWarframe;
    const stats = calculateWarframeBuild(statsWarframe, modSlots, modsMap, linkage);
    applyWarframePassivePreArcanes(statsWarframe.id, stats, wfPassiveSim);
    // Arcane Intention counts this build's channeled abilities (Helminth slot substituted).
    const abilities = (statsWarframe.abilities ?? []).map((a, i) =>
      !formOwnsAbilities && helminthSlot === i && helminthAbility
        ? helminthToAbility(helminthAbility, statsWarframe.id)
        : a,
    );
    const equippedModNames = equippedMods
      .map((m) => modsMap.get(m.modId)?.name)
      .filter((n): n is string => !!n);
    const withShardsAndArcanes = applyWarframeShardsAndArcanes(stats, equippedShards, equippedArcanes, equippedArcaneRanks, {
      arcaneStacksById: effectiveWfArcaneStacksById,
      conditionalModStacksById: wfConditionalModStacksById,
      equippedModSlots: modSlots,
      abilities,
      equippedModNames,
    });
    applyWarframePassivePostArcanes(statsWarframe.id, withShardsAndArcanes, wfPassiveSim);
    if (linkedLoadout) {
      applyWeaponIncarnonMobilityToWarframe(withShardsAndArcanes, linkedLoadout);
    }
    return withShardsAndArcanes;
  }, [selectedWarframe, dualFormConfig, activeDualFormId, formOwnsAbilities, equippedMods, equippedShards, equippedArcanes, equippedArcaneRanks, modsMap, helminthSlot, helminthAbility, effectiveWfArcaneStacksById, wfConditionalModStacksById, wfPassiveSim, loadoutCtx]);

  /**
   * Ability Strength behind the exalted weapon's base damage. Usually the open form's; for
   * Sevagoth it is always Sevagoth's own (wiki Shadow Claws: "not affected in any way by the
   * ability strength of his shadow"), even while the Shadow tab is open.
   */
  const exaltedHostStrength = useMemo(() => {
    const own = calculatedStats?.abilityStrength ?? 1;
    const hostFormId = dualFormConfig?.exaltedStrengthFormId;
    if (!selectedWarframe || !hostFormId || hostFormId === activeDualFormId) return own;
    const slice = dualFormBuilds[hostFormId];
    if (!slice) return own;
    const hostWf = warframeForDualForm(selectedWarframe, hostFormId);
    const hostStats = calculateWarframeBuild(hostWf, slice.mods, modsMap);
    return applyWarframeShardsAndArcanes(
      hostStats,
      equippedShards,
      resolveSavedArcaneSlots(slice.arcaneIds, 2),
      slice.arcaneRanks,
      { abilities: hostWf.abilities, equippedModSlots: slice.mods },
    ).abilityStrength;
  }, [calculatedStats?.abilityStrength, dualFormConfig, activeDualFormId, selectedWarframe, dualFormBuilds, modsMap, equippedShards]);

  /** Primary Overcharge reads max energy. Hit location stays on the exalted sim; Cyte weak-point kills do not force headshots. */
  const exaltedSimParams = useMemo<SimulationParams>(
    () => ({
      ...exaltedUserSim,
      warframeMaxEnergy: calculatedStats?.totalEnergy,
    }),
    [calculatedStats?.totalEnergy, exaltedUserSim],
  );

  const exaltedActiveArcanes = useMemo(
    () =>
      resolveActiveArcaneList(
        exaltedArcanes.slice(0, exaltedArcaneConfig.slots),
        exaltedArcaneRanks.slice(0, exaltedArcaneConfig.slots),
      ),
    [exaltedArcanes, exaltedArcaneRanks, exaltedArcaneConfig.slots],
  );

  const exaltedMeleeActiveArcanes = useMemo(
    () =>
      resolveActiveArcaneList(
        exaltedMeleeArcanes.slice(0, exaltedMeleeArcaneConfig.slots),
        exaltedMeleeArcaneRanks.slice(0, exaltedMeleeArcaneConfig.slots),
      ),
    [exaltedMeleeArcanes, exaltedMeleeArcaneRanks, exaltedMeleeArcaneConfig.slots],
  );

  /** Exalted DPS scales with host Ability Strength + host Warframe passive buffs (wiki). */
  const exaltedCalcOptions = useMemo<WeaponCalculationOptions>(() => {
    const externalBuffs = exaltedWeapon
      ? resolveExaltedPassiveBuffs(selectedWarframe?.id, exaltedWeapon, wfPassiveSim)
      : [];
    return {
      abilityStrength: exaltedHostStrength,
      ...(exaltedActiveArcanes.arcanes.length > 0
        ? { arcaneRanks: exaltedActiveArcanes.arcaneRanks }
        : {}),
      ...(externalBuffs.length > 0 ? { externalBuffs } : {}),
    };
  }, [exaltedHostStrength, exaltedActiveArcanes, exaltedWeapon, selectedWarframe?.id, wfPassiveSim]);

  const exaltedMeleeCalcOptions = useMemo<WeaponCalculationOptions>(() => {
    const externalBuffs = exaltedMeleeWeapon
      ? resolveExaltedPassiveBuffs(selectedWarframe?.id, exaltedMeleeWeapon, wfPassiveSim)
      : [];
    return {
      abilityStrength: exaltedHostStrength,
      ...(exaltedMeleeActiveArcanes.arcanes.length > 0
        ? { arcaneRanks: exaltedMeleeActiveArcanes.arcaneRanks }
        : {}),
      ...(externalBuffs.length > 0 ? { externalBuffs } : {}),
    };
  }, [exaltedHostStrength, exaltedMeleeActiveArcanes, exaltedMeleeWeapon, selectedWarframe?.id, wfPassiveSim]);

  const exaltedBaseCalcOptions = useMemo<WeaponCalculationOptions>(
    () => ({ abilityStrength: exaltedHostStrength }),
    [exaltedHostStrength],
  );

  const exaltedStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedWeapon) return null;
    const slots = exaltedModsActive.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const activeArcanes = exaltedActiveArcanes.arcanes;
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(
        exaltedWeapon,
        slots,
        modsMap,
        activeArcanes,
        undefined,
        exaltedSimParams,
        exaltedCalcOptions,
      );
    }
    return calculateWeaponBuild(
      exaltedWeapon,
      slots,
      modsMap,
      undefined,
      exaltedSimParams,
      exaltedCalcOptions,
    );
  }, [exaltedWeapon, exaltedModsActive, exaltedActiveArcanes.arcanes, modsMap, exaltedCalcOptions, exaltedSimParams]);

  const exaltedMeleeStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedMeleeWeapon) return null;
    const slots = exaltedMeleeModsActive.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const activeArcanes = exaltedMeleeActiveArcanes.arcanes;
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(
        exaltedMeleeWeapon,
        slots,
        modsMap,
        activeArcanes,
        undefined,
        exaltedSimParams,
        exaltedMeleeCalcOptions,
      );
    }
    return calculateWeaponBuild(
      exaltedMeleeWeapon,
      slots,
      modsMap,
      undefined,
      exaltedSimParams,
      exaltedMeleeCalcOptions,
    );
  }, [
    exaltedMeleeWeapon,
    exaltedMeleeModsActive,
    exaltedMeleeActiveArcanes.arcanes,
    modsMap,
    exaltedMeleeCalcOptions,
    exaltedSimParams,
  ]);

  const exaltedBaseStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedWeapon) return null;
    return calculateWeaponBuild(
      exaltedWeapon,
      [],
      modsMap,
      undefined,
      undefined,
      exaltedBaseCalcOptions,
    );
  }, [exaltedWeapon, modsMap, exaltedBaseCalcOptions]);

  const exaltedMeleeBaseStats = useMemo<CalculatedStats | null>(() => {
    if (!exaltedMeleeWeapon) return null;
    return calculateWeaponBuild(
      exaltedMeleeWeapon,
      [],
      modsMap,
      undefined,
      undefined,
      exaltedBaseCalcOptions,
    );
  }, [exaltedMeleeWeapon, modsMap, exaltedBaseCalcOptions]);

  const exaltedContributionContext = useMemo(() => {
    if (!exaltedWeapon) return null;
    return {
      baseWeapon: exaltedWeapon,
      modSlots: exaltedModsActive.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
      arcanes: exaltedActiveArcanes.arcanes,
      calcOptions: exaltedCalcOptions,
    };
  }, [exaltedWeapon, exaltedModsActive, exaltedActiveArcanes.arcanes, modsMap, exaltedCalcOptions]);

  const exaltedMeleeContributionContext = useMemo(() => {
    if (!exaltedMeleeWeapon) return null;
    return {
      baseWeapon: exaltedMeleeWeapon,
      modSlots: exaltedMeleeModsActive.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
      arcanes: exaltedMeleeActiveArcanes.arcanes,
      calcOptions: exaltedMeleeCalcOptions,
    };
  }, [
    exaltedMeleeWeapon,
    exaltedMeleeModsActive,
    exaltedMeleeActiveArcanes.arcanes,
    modsMap,
    exaltedMeleeCalcOptions,
  ]);

  // Exalted weapons have innate polarities like any weapon; the state holds overrides only.
  const exaltedInnatePolarities = useMemo(
    () => innateSlotPolarities("weapon", exaltedWeapon?.id),
    [exaltedWeapon?.id],
  );
  const exaltedEffectivePolarities = useMemo(
    () => effectiveSlotPolarities(exaltedInnatePolarities, exaltedSlotPolarities),
    [exaltedInnatePolarities, exaltedSlotPolarities],
  );
  const exaltedMeleeInnatePolarities = useMemo(
    () => innateSlotPolarities("weapon", exaltedMeleeWeapon?.id),
    [exaltedMeleeWeapon?.id],
  );
  const exaltedMeleeEffectivePolarities = useMemo(
    () => effectiveSlotPolarities(exaltedMeleeInnatePolarities, exaltedMeleeSlotPolarities),
    [exaltedMeleeInnatePolarities, exaltedMeleeSlotPolarities],
  );

  const exaltedCapacity = useMemo(
    () => computeUsedCapacity(exaltedModsActive, modsMap, exaltedEffectivePolarities),
    [exaltedModsActive, exaltedEffectivePolarities, modsMap],
  );

  const exaltedMeleeCapacity = useMemo(
    () => computeUsedCapacity(exaltedMeleeModsActive, modsMap, exaltedMeleeEffectivePolarities),
    [exaltedMeleeModsActive, exaltedMeleeEffectivePolarities, modsMap],
  );

  const filteredWarframes = useMemo(() => {
    const sorted = [...allWarframes]
      .filter((w) => w.id !== "helminth" && !isNecramechId(w.id))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (!warframeSearch.trim()) return sorted;
    const q = warframeSearch.toLowerCase();
    return sorted.filter((w) => w.name.toLowerCase().includes(q));
  }, [allWarframes, warframeSearch]);

  const abilityDisplayEntries = useMemo(() => {
    if (!selectedWarframe) return [];
    return buildAbilityDisplayEntries(selectedWarframe, !!dualFormConfig, activeDualFormId);
  }, [selectedWarframe, dualFormConfig, activeDualFormId]);

  const abilityTTKEntries = useMemo(() => {
    if (!calculatedStats || abilityDisplayEntries.length === 0) return [];
    const rows = abilityDisplayEntries.map((entry) => {
      const slotIndex = entry.gameSlot - 1;
      if (
        !entry.formOwned &&
        helminthSlot != null &&
        helminthAbility != null &&
        helminthSlot === slotIndex
      ) {
        return {
          ability: helminthToAbility(helminthAbility, selectedWarframe?.id),
          slot: entry.gameSlot,
          helminth: true as const,
        };
      }
      return {
        ability: entry.ability,
        slot: entry.gameSlot,
        helminth: false as boolean | undefined,
      };
    });
    return buildAbilityTTKEntries(rows, calculatedStats);
  }, [
    calculatedStats,
    abilityDisplayEntries,
    helminthSlot,
    helminthAbility,
  ]);

  const auraSlotIndices = useMemo(
    () => getWarframeAuraSlotIndices(selectedWarframe?.id),
    [selectedWarframe?.id],
  );

  const importEligibility = useMemo(
    () => warframeImportEligibility(selectedWarframe?.id, selectedWarframe?.name ?? "this Warframe"),
    [selectedWarframe?.id, selectedWarframe?.name],
  );
  const importRegularSlots = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);

  const innatePolarities = useMemo(
    () =>
      innateSlotPolarities(
        "warframe",
        selectedWarframe?.id,
        dualFormConfig ? activeDualFormId : undefined,
      ),
    [selectedWarframe?.id, dualFormConfig, activeDualFormId],
  );
  const effectivePolarities = useMemo(
    () => effectiveSlotPolarities(innatePolarities, slotPolarities),
    [innatePolarities, slotPolarities],
  );

  // Sevagoth's Shadow comes with a pre-installed Orokin Reactor (wiki Sevagoth/Abilities/Passive).
  const baseCapacity = warframeBaseCapacity(hasOrokinReactor || !!activeDualForm?.preinstalledReactor);
  const auraBonus = useMemo(
    () => computeWarframeAuraBonus(equippedMods, modsMap, effectivePolarities, auraSlotIndices),
    [equippedMods, modsMap, effectivePolarities, auraSlotIndices],
  );

  const totalCapacity = baseCapacity + auraBonus;

  const capacityUsed = useMemo(
    () => computeWarframeCapacityUsed(equippedMods, modsMap, effectivePolarities, auraSlotIndices),
    [equippedMods, modsMap, effectivePolarities, auraSlotIndices],
  );

  const importCapacityNotice = useImportCapacityNotice(
    `${selectedWarframe?.id ?? ""}:${dualFormConfig ? activeDualFormId : ""}`,
    capacityUsed,
    totalCapacity,
  );
  const importCapacityAfter = useCallback(
    (mods: EquippedMod[]) => ({
      used: computeWarframeCapacityUsed(cleanLoadedMods(mods), modsMap, effectivePolarities, auraSlotIndices),
      max: baseCapacity + computeWarframeAuraBonus(cleanLoadedMods(mods), modsMap, effectivePolarities, auraSlotIndices),
    }),
    [modsMap, effectivePolarities, auraSlotIndices, baseCapacity],
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

  const handleSelectWarframe = useCallback((warframe: Warframe) => {
    setSelectedWarframe(warframe);
    setEquippedMods([]);
    setEquippedShards([null, null, null, null, null]);
    setEquippedArcanes([null, null]);
    setEquippedArcaneRanks([5, 5]);
    setWfArcaneStacksById({});
    setWfConditionalModStacksById({});
    setWfPassiveSim(DEFAULT_WARFRAME_PASSIVE_SIM);
    setExaltedUserSim(DEFAULT_SIM_PARAMS);
    setExaltedMods([]);
    setExaltedSlotPolarities({});
    setExaltedArcanes([null]);
    setExaltedArcaneRanks([5, 5]);
    setExaltedActiveBuildName(null);
    setExaltedMeleeMods([]);
    setExaltedMeleeSlotPolarities({});
    setExaltedMeleeArcanes([null]);
    setExaltedMeleeArcaneRanks([5, 5]);
    setExaltedMeleeActiveBuildName(null);
    setExaltedStanceId(null);
    setExaltedMeleeStanceId(null);
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

  const warframeParamSeenRef = useRef<string | null>(null);
  const handlePickWarframeFromCatalog = useCallback((warframe: Warframe) => {
    handleSelectWarframe(warframe);
    const next = hrefForWarframeCatalogPick(
      window.location.pathname + window.location.search + window.location.hash,
      warframe.id,
    );
    if (hasBuildLinkParam(new URL(next, window.location.origin).searchParams)) return;
    clearCloudBuildInUrl();
    warframeParamSeenRef.current = warframe.id;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState(null, "", next);
    }
  }, [handleSelectWarframe]);

  const selectedWarframeId = selectedWarframe?.id ?? null;
  useEffect(() => {
    if (!selectedWarframeId) return;
    const params = new URLSearchParams(window.location.search);
    if (hasBuildLinkParam(params)) return;
    if (params.get(WARFRAME_URL_PARAM) === selectedWarframeId) return;
    warframeParamSeenRef.current = selectedWarframeId;
    window.history.replaceState(
      window.history.state,
      "",
      hrefWithWarframeParam(
        window.location.pathname + window.location.search + window.location.hash,
        selectedWarframeId,
      ),
    );
  }, [selectedWarframeId]);

  const selectedWarframeRef = useRef<Warframe | null>(selectedWarframe);
  useEffect(() => {
    selectedWarframeRef.current = selectedWarframe;
  }, [selectedWarframe]);

  useEffect(() => {
    if (allWarframes.length === 0) return;
    const params = new URLSearchParams(searchParams.toString());
    if (hasBuildLinkParam(params)) {
      if (params.has(WARFRAME_URL_PARAM)) {
        window.history.replaceState(
          window.history.state,
          "",
          hrefWithWarframeParam(
            window.location.pathname + window.location.search + window.location.hash,
            null,
          ),
        );
      }
      warframeParamSeenRef.current = null;
      return;
    }
    const id = warframeIdFromParams(params);
    if (id === warframeParamSeenRef.current) return;
    const previous = warframeParamSeenRef.current;
    warframeParamSeenRef.current = id;
    const current = selectedWarframeRef.current;
    if (!id) {
      if (previous && current) setShowWarframeList(true);
      return;
    }
    const wf = allWarframes.find((w) => w.id === id);
    if (!wf) return;
    if (current?.id === id) {
      setShowWarframeList(false);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the URL on load and Back/Forward
    handleSelectWarframe(wf);
  }, [allWarframes, searchParams, handleSelectWarframe]);


  const handleLoadExaltedSavedBuild = useCallback((build: SavedBuild) => {
    const d = build.data as WeaponBuildData;
    const mods: EquippedMod[] = (d.mods || []).map((m: ModSlot & { id?: string }, i: number) => {
      const mid = m.modId ?? m.id;
      const mod = modsMap.get(mid);
      return {
        modId: mid,
        modName: mod?.name ?? "",
        rank: m.rank,
        slotIndex: typeof m.slotIndex === "number" ? m.slotIndex : i,
        polarity: mod?.polarity,
        drain: mod?.drain,
      };
    });
    setExaltedMods(mods);
    if (d.slotPolarities) setExaltedSlotPolarities(d.slotPolarities);
    setExaltedStanceId(d.stanceModId ?? null);
    if (d.arcaneIds) {
      const resolved = resolveSavedArcaneSlots(d.arcaneIds, exaltedArcaneConfig.slots);
      setExaltedArcanes(resolved);
      setExaltedArcaneRanks(resolved.map((a, i) => d.arcaneRanks?.[i] ?? a?.maxRank ?? 5));
    }
    setExaltedActiveBuildName(build.name);
    toast.success(`Loaded “${build.name}” onto ${exaltedWeapon?.name ?? "Exalted Weapon"}`);
  }, [modsMap, exaltedArcaneConfig.slots, exaltedWeapon?.name]);

  const handleSaveExaltedAsWeaponBuild = useCallback(async (name: string) => {
    if (!exaltedWeapon) return;
    const weaponData: WeaponBuildData = {
      weaponId: exaltedWeapon.id,
      mods: exaltedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      ...(exaltedStance ? { stanceModId: exaltedStance.id } : {}),
      arcaneIds: exaltedArcanes.map((a) => a?.id ?? null),
      arcaneRanks: [...exaltedArcaneRanks],
      hasOrokinCatalyst: true,
      isMR30: false,
      slotPolarities: exaltedSlotPolarities,
    };
    const now = Date.now();
    await persistSavedBuild({
      id: crypto.randomUUID(),
      type: "weapon",
      name,
      isPublic: false,
      data: weaponData,
      createdAt: now,
      updatedAt: now,
    });
    await refreshSavedWeaponBuilds();
    setExaltedActiveBuildName(name);
    toast.success(`Saved “${name}” to Weapon Builder library`);
  }, [exaltedWeapon, exaltedMods, exaltedStance, exaltedArcanes, exaltedArcaneRanks, exaltedSlotPolarities, refreshSavedWeaponBuilds]);

  const handleLoadExaltedMeleeSavedBuild = useCallback((build: SavedBuild) => {
    const d = build.data as WeaponBuildData;
    const mods: EquippedMod[] = (d.mods || []).map((m: ModSlot & { id?: string }, i: number) => {
      const mid = m.modId ?? m.id;
      const mod = modsMap.get(mid);
      return {
        modId: mid,
        modName: mod?.name ?? "",
        rank: m.rank,
        slotIndex: typeof m.slotIndex === "number" ? m.slotIndex : i,
        polarity: mod?.polarity,
        drain: mod?.drain,
      };
    });
    setExaltedMeleeMods(mods);
    if (d.slotPolarities) setExaltedMeleeSlotPolarities(d.slotPolarities);
    setExaltedMeleeStanceId(d.stanceModId ?? null);
    if (d.arcaneIds) {
      const resolved = resolveSavedArcaneSlots(d.arcaneIds, exaltedMeleeArcaneConfig.slots);
      setExaltedMeleeArcanes(resolved);
      setExaltedMeleeArcaneRanks(resolved.map((a, i) => d.arcaneRanks?.[i] ?? a?.maxRank ?? 5));
    }
    setExaltedMeleeActiveBuildName(build.name);
    toast.success(`Loaded “${build.name}” onto ${exaltedMeleeWeapon?.name ?? "Exalted Melee"}`);
  }, [modsMap, exaltedMeleeArcaneConfig.slots, exaltedMeleeWeapon?.name]);

  const handleSaveExaltedMeleeAsWeaponBuild = useCallback(async (name: string) => {
    if (!exaltedMeleeWeapon) return;
    const weaponData: WeaponBuildData = {
      weaponId: exaltedMeleeWeapon.id,
      mods: exaltedMeleeMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      ...(exaltedMeleeStance ? { stanceModId: exaltedMeleeStance.id } : {}),
      arcaneIds: exaltedMeleeArcanes.map((a) => a?.id ?? null),
      arcaneRanks: [...exaltedMeleeArcaneRanks],
      hasOrokinCatalyst: true,
      isMR30: false,
      slotPolarities: exaltedMeleeSlotPolarities,
    };
    const now = Date.now();
    await persistSavedBuild({
      id: crypto.randomUUID(),
      type: "weapon",
      name,
      isPublic: false,
      data: weaponData,
      createdAt: now,
      updatedAt: now,
    });
    await refreshSavedWeaponBuilds();
    setExaltedMeleeActiveBuildName(name);
    toast.success(`Saved “${name}” to Weapon Builder library`);
  }, [exaltedMeleeWeapon, exaltedMeleeMods, exaltedMeleeStance, exaltedMeleeArcanes, exaltedMeleeArcaneRanks, exaltedMeleeSlotPolarities, refreshSavedWeaponBuilds]);

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
  const [compareOpen, setCompareOpen] = useState(false);
  const liveCompare = useMemo(() => {
    const data = buildWarframeData();
    if (!data || !selectedWarframe) return null;
    return snapshotFromBuild("warframe", buildName || selectedWarframe.name, data);
  }, [buildWarframeData, selectedWarframe, buildName]);
  const handleShareBuild = useCallback(async () => {
    if (!selectedWarframe) return;

    const data = buildWarframeData();
    if (!data) return;
    const outcome = await shareBuilderBuild({
      isPublic: buildIsPublic,
      buildId: currentBuildId,
      fallback: warframeBuildToShare({
        warframeId: data.warframeId,
        mods: data.mods,
        arcaneIds: data.arcaneIds,
        arcaneRanks: data.arcaneRanks,
        slotPolarities: data.slotPolarities,
        shards: (data.shards ?? [])
          .filter((s): s is EquippedArchonShard => s !== null)
          .map((s) => ({ id: s.shardId, bonus: s.selectedBonus })),
        dualFormBuilds: data.dualFormBuilds,
        hasOrokinReactor: data.hasOrokinReactor,
        isMR30: data.isMR30,
        helminthSlot: data.helminthSlot,
        helminthAbilityId: data.helminthAbilityId,
        exaltedMods: data.exaltedMods,
        exaltedSlotPolarities: data.exaltedSlotPolarities,
        exaltedArcaneIds: data.exaltedArcaneIds,
        exaltedArcaneRanks: data.exaltedArcaneRanks,
        exaltedStanceModId: data.exaltedStanceModId,
        exaltedMeleeMods: data.exaltedMeleeMods,
        exaltedMeleeSlotPolarities: data.exaltedMeleeSlotPolarities,
        exaltedMeleeArcaneIds: data.exaltedMeleeArcaneIds,
        exaltedMeleeArcaneRanks: data.exaltedMeleeArcaneRanks,
        exaltedMeleeStanceModId: data.exaltedMeleeStanceModId,
        arcaneStacksById: data.arcaneStacksById,
        conditionalModStacksById: data.conditionalModStacksById,
      }),
    });

    if (outcome.kind === "copied") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [selectedWarframe, buildWarframeData, buildIsPublic, currentBuildId]);

  const equippedModIds = equippedMods.map((m) => m.modId);

  return (
    <PageShell>

      <main className="container mx-auto flex-1 px-3.5 pt-5 pb-24 sm:px-4 sm:pt-6 lg:pb-6">
        <LoadoutEditBanner
          context={loadoutCtx}
          onDetach={clearLoadoutCtx}
          dirty={hasUnsavedChanges}
          onSaveToLoadout={() => handleSaveDialog({ name: buildName, description: "", isPublic: false, tags: [], target: "loadout" })}
        />
        {showWarframeList || !selectedWarframe ? (
          <ItemPickerScreen
            onBack={selectedWarframe ? () => setShowWarframeList(false) : undefined}
            backLabel={selectedWarframe?.name}
            icon={Shield}
            accent="purple"
            title="Warframe Builder"
            description="Choose a warframe to configure mods, archon shards, Helminth abilities, and arcanes. HP, shield, armor and energy are shown at rank 30."
            count={filteredWarframes.length}
            search={warframeSearch}
            onSearchChange={setWarframeSearch}
            searchPlaceholder="Search warframes..."
            pickerTab={pickerTab}
            onPickerTabChange={(tab) => {
              if (tab === "saved") void refreshSavedBuilds();
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
                onClick={() => handlePickWarframeFromCatalog(wf)}
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
                  <div
                    className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground"
                    title="Health, shields, armor and energy at rank 30 (what mods scale)."
                  >
                    <span>HP {getWarframeHealthModBase(wf)}</span>
                    <span>SH {getWarframeShieldModBase(wf)}</span>
                    <span>AR {getWarframeArmorModBase(wf)}</span>
                    <span>EN {getWarframeEnergyModBase(wf)}</span>
                    <span>SPD {Number(wf.sprintSpeed).toFixed(2)}</span>
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
                  <BuilderSaveControls
                    canUpdate={!!currentBuildId}
                    dirty={hasUnsavedChanges}
                    dirtyClass={SAVE_DIRTY_CLASS}
                    dotClass={SAVE_DIRTY_DOT_CLASS}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 lg:pointer-fine:min-h-0 lg:py-1.5"
                    onUpdate={() => { void handleQuickSave(); }}
                    onSaveNew={() => {
                      setSaveAsNew(false);
                      setSaveDialogDefaultPublic(buildIsPublic);
                      setSaveDialogOpen(true);
                    }}
                    onSaveAs={() => {
                      setSaveAsNew(true);
                      setSaveDialogDefaultPublic(false);
                      setSaveDialogOpen(true);
                    }}
                  />
                  <button onClick={() => { void refreshSavedBuilds(); setShowSavedBuilds(true); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs lg:pointer-fine:min-h-0 lg:py-1.5 text-muted-foreground hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all font-medium" title="Load Build">
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
                  <button
                    onClick={() => setHasOrokinReactor(!hasOrokinReactor)}
                    title="Orokin Reactor — doubles mod capacity"
                    aria-pressed={hasOrokinReactor}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all lg:pointer-fine:min-h-0 lg:py-1.5",
                      hasOrokinReactor
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span className="inline">Reactor</span>
                  </button>
                </BuilderActionGroup>

                <div className="flex-1" />

                <a
                  href={appendReturnTo(
                    `/report-issue?type=warframe&name=${encodeURIComponent(selectedWarframe.name)}&id=${encodeURIComponent(selectedWarframe.id)}`,
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
                type="warframe"
                itemId={selectedWarframe.id}
                itemName={selectedWarframe.name}
                onLoadBuild={handleLoadCommunityBuild}
              />
            </div>

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div className="space-y-6">
                {/* Mod Configuration */}
                <div id="build-mods" className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)]">
                  {dualFormConfig && (
                    <div className="mb-4 space-y-2">
                      <DualFormTabs
                        forms={dualFormConfig.forms}
                        activeFormId={activeDualFormId}
                        onChange={handleDualFormSwitch}
                      />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {dualFormConfig.note}
                      </p>
                    </div>
                  )}
                  <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/85 lg:static lg:z-auto lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
                    <h2 className="min-w-0 truncate text-sm font-semibold tracking-wider text-muted-foreground">
                      MOD CONFIGURATION{dualFormConfig ? ` — ${dualFormConfig.forms.find((f) => f.id === activeDualFormId)?.label ?? ""}` : ""}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-mono tabular-nums",
                        capacityUsed > totalCapacity ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                      )}>
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">Capacity</span>
                        {capacityUsed} / {totalCapacity}
                      </span>
                      {auraBonus > 0 && (
                        <span className="text-[10px] text-green-700/80 dark:text-green-400/70">+{auraBonus} aura</span>
                      )}
                      {calculatedStats && (
                        <span className="hidden text-[10px] font-mono tabular-nums text-muted-foreground lg:inline">
                          DUR {(calculatedStats.abilityDuration * 100).toFixed(0)}%
                          {" · "}EFF {formatAbilityEfficiencyPct(calculatedStats.abilityEfficiency)}
                          {" · "}RNG {(calculatedStats.abilityRange * 100).toFixed(0)}%
                          {" · "}STR {(calculatedStats.abilityStrength * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <MobileStatSummary items={warframeStatSummary(calculatedStats)} />
                  </div>
                  {importCapacityNotice.visible && (
                    <ImportCapacityNotice used={capacityUsed} max={totalCapacity} onDismiss={importCapacityNotice.dismiss} />
                  )}


                  {equippedMods.length === 0 && (
                    <p className="mb-2 text-[11px] leading-snug text-muted-foreground sm:hidden" data-testid="mobile-slot-hint">
                      Tap a slot to add a mod. Tap the hexagon beside a slot to add a forma.
                    </p>
                  )}
                  {/* Aura + Exilus — top row (matches in-game warframe mod layout; Jade has 2 Auras) */}
                  <div
                    className={cn(
                      "mb-2 grid min-w-0 gap-1.5 sm:gap-2",
                      auraSlotIndices.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
                    )}
                  >
                    {auraSlotIndices.map((slotIndex, auraOrdinal) => {
                      const equipped = equippedMods.find((m) => m.slotIndex === slotIndex);
                      const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                      const label = auraSlotIndices.length > 1 ? `Aura ${auraOrdinal + 1}` : "Aura";
                      return (
                        <div key={`aura-${slotIndex}`}>
                          <span className="mb-1 block text-[10px] font-semibold tracking-wider text-purple-700 dark:text-purple-400">
                            {label.toUpperCase()}
                          </span>
                          <ModSlotCard
                            mod={mod}
                            rank={equipped?.rank ?? 0}
                            slotIndex={slotIndex}
                            label={label}
                            slotPolarity={effectivePolarities[slotIndex]}
                            innatePolarity={isInnatePolarity(innatePolarities, slotPolarities, slotIndex)}
                            equippedModIds={equippedModIds}
                            onAdd={() => handleOpenModPicker(slotIndex)}
                            onRemove={() => handleRemoveMod(slotIndex)}
                            onPolarize={(p) =>
                              setSlotPolarities((prev) => applyPolarityOverride(prev, innatePolarities, slotIndex, p))
                            }
                          />
                        </div>
                      );
                    })}
                    <div>
                      <span className="mb-1 block text-[10px] font-semibold tracking-wider text-cyan-700 dark:text-cyan-400" title="Utility / mobility mods — not Aura">
                        EXILUS
                        <span className="ml-1.5 hidden font-normal normal-case tracking-normal text-muted-foreground sm:inline">utility</span>
                      </span>
                      {(() => {
                        const equipped = equippedMods.find((m) => m.slotIndex === EXILUS_SLOT);
                        const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                        return (
                          <ModSlotCard
                            mod={mod}
                            rank={equipped?.rank ?? 0}
                            slotIndex={EXILUS_SLOT}
                            label="Exilus"
                            slotPolarity={effectivePolarities[EXILUS_SLOT]}
                            innatePolarity={isInnatePolarity(innatePolarities, slotPolarities, EXILUS_SLOT)}
                            equippedModIds={equippedModIds}
                            onAdd={() => handleOpenModPicker(EXILUS_SLOT)}
                            onRemove={() => handleRemoveMod(EXILUS_SLOT)}
                            onPolarize={(p) => setSlotPolarities((prev) => applyPolarityOverride(prev, innatePolarities, EXILUS_SLOT, p))}
                          />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Build Importer */}
                  {showImporter && selectedWarframe && (
                    <div className="mb-4">
                      <BuildImporter
                        itemName={selectedWarframe.name}
                        itemKind="warframe"
                        catalog={allMods}
                        isEligible={importEligibility.isEligible}
                        explainIneligible={importEligibility.explainIneligible}
                        regularSlots={importRegularSlots}
                        auraSlots={auraSlotIndices}
                        isAura={isAuraMod}
                        existing={equippedMods}
                        capacityAfter={importCapacityAfter}
                        onImport={handleImportMods}
                        onClose={() => setShowImporter(false)}
                      />
                    </div>
                  )}
                  {/* Regular Mod Slots (1-8) */}
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2.5">
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
                          slotPolarity={effectivePolarities[slotIdx]}
                            innatePolarity={isInnatePolarity(innatePolarities, slotPolarities, slotIdx)}
                          equippedModIds={equippedModIds}
                          onAdd={() => handleOpenModPicker(slotIdx)}
                          onRemove={() => handleRemoveMod(slotIdx)}
                          onPolarize={(p) => setSlotPolarities((prev) => applyPolarityOverride(prev, innatePolarities, slotIdx, p))}
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
                      {dualFormConfig.shardsNote}
                    </p>
                  )}
                  <div className="flex flex-wrap items-start gap-2">
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
                    <Gem className="h-4 w-4 text-purple-700 dark:text-purple-400" />
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
                        onRankChange={(r) =>
                          setEquippedArcaneRanks((prev) => {
                            const next = [...prev];
                            next[i] = r;
                            return next;
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Abilities + Helminth */}
                {abilityDisplayEntries.length > 0 && (
                  <div>
                    <AbilitiesSectionHeader
                      {...(formOwnsAbilities
                        ? { subtitle: "Scaled by the Shadow's own mods · Helminth can't replace these" }
                        : {})}
                      formLabel={
                        dualFormConfig
                          ? dualFormConfig.forms.find((f) => f.id === activeDualFormId)?.label
                          : undefined
                      }
                    />
                    <div className="grid auto-rows-fr items-stretch gap-2.5 sm:grid-cols-2 sm:gap-3">
                      {abilityDisplayEntries.map((entry) => {
                        const slotIndex = entry.gameSlot - 1;
                        const hasHelminth = helminthSlot != null && helminthAbility != null;
                        // Sevagoth's Shadow abilities can't be replaced by Helminth (wiki).
                        const isHelminthed = !entry.formOwned && hasHelminth && helminthSlot === slotIndex;
                        const canSubsumeHere = !entry.formOwned && (!hasHelminth || isHelminthed);
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
                                hostWarframeId={selectedWarframe.id}
                              />
                            ) : (
                              <AbilityCard
                                ability={applyCostAugments(entry.ability, equippedMods.map((m) => m.modId))}
                                index={entry.abilityIndex}
                                gameSlot={entry.gameSlot}
                                formLabel={entry.formLabel}
                                stats={calculatedStats}
                                warframeId={selectedWarframe.id}
                                immolationHeatPct={
                                  selectedWarframe.id === "ember" ||
                                  selectedWarframe.id === "ember_prime"
                                    ? wfPassiveSim.emberImmolationHeatPct
                                    : undefined
                                }
                                batteryPct={
                                  selectedWarframe.id === "gauss" ||
                                  selectedWarframe.id === "gauss_prime"
                                    ? wfPassiveSim.gaussBatteryPct
                                    : undefined
                                }
                                mutationStacks={
                                  selectedWarframe.id === "nidus" ||
                                  selectedWarframe.id === "nidus_prime"
                                    ? wfPassiveSim.nidusMutationStacks
                                    : undefined
                                }
                                intrepidStandRank={equippedMods.find((m) => m.modId === "intrepid_stand")?.rank}
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
                    exaltedMaxCapacity={exaltedMaxCap}
                    stanceSlot={exaltedStanceSlot}
                    stanceMod={exaltedStance}
                    onPickStance={() => setStancePickerTarget("exalted")}
                    onRemoveStance={() => setExaltedStanceId(null)}
                    exaltedMods={exaltedMods}
                    hasExilusSlot={weaponHasExilusSlot(exaltedWeapon)}
                    unavailableMods={exaltedSplit.dropped}
                    modsMap={modsMap}
                    exaltedSlotPolarities={exaltedEffectivePolarities}
                    exaltedSlotOverrides={exaltedSlotPolarities}
                    exaltedInnatePolarities={exaltedInnatePolarities}
                    exaltedArcaneConfig={exaltedArcaneConfig}
                    exaltedArcanes={exaltedArcanes}
                    exaltedArcaneRanks={exaltedArcaneRanks}
                    exaltedStats={exaltedStats}
                    exaltedBaseStats={exaltedBaseStats}
                    exaltedContributionContext={exaltedContributionContext}
                    simParams={exaltedSimParams}
                    onSimParamsChange={setExaltedUserSim}
                    sectionTitle={exaltedMeleeWeapon ? "Exalted Primary" : "Exalted Weapon"}
                    hideSiblingNote={!!exaltedMeleeWeapon}
                    activeBuildName={exaltedActiveBuildName}
                    savedWeaponBuilds={savedWeaponBuilds}
                    onLoadSavedBuild={handleLoadExaltedSavedBuild}
                    onSaveAsWeaponBuild={handleSaveExaltedAsWeaponBuild}
                    onClearMods={() => setExaltedMods([])}
                    onAddMod={(i) => {
                      setExaltedActiveSlot(i);
                      setExaltedModPickerOpen(true);
                    }}
                    onRemoveMod={(i) =>
                      setExaltedMods((prev) => prev.filter((m) => m.slotIndex !== i))
                    }
                    onPolarize={(i, p) =>
                      setExaltedSlotPolarities((prev) => applyPolarityOverride(prev, exaltedInnatePolarities, i, p))
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
                    onArcaneRankChange={(i, r) =>
                      setExaltedArcaneRanks((prev) => {
                        const next = [...prev];
                        next[i] = r;
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
                    exaltedMaxCapacity={exaltedMeleeMaxCap}
                    stanceSlot={exaltedMeleeStanceSlot}
                    stanceMod={exaltedMeleeStance}
                    onPickStance={() => setStancePickerTarget("exaltedMelee")}
                    onRemoveStance={() => setExaltedMeleeStanceId(null)}
                    exaltedMods={exaltedMeleeMods}
                    hasExilusSlot={weaponHasExilusSlot(exaltedMeleeWeapon)}
                    unavailableMods={exaltedMeleeSplit.dropped}
                    modsMap={modsMap}
                    exaltedSlotPolarities={exaltedMeleeEffectivePolarities}
                    exaltedSlotOverrides={exaltedMeleeSlotPolarities}
                    exaltedInnatePolarities={exaltedMeleeInnatePolarities}
                    exaltedArcaneConfig={exaltedMeleeArcaneConfig}
                    exaltedArcanes={exaltedMeleeArcanes}
                    exaltedArcaneRanks={exaltedMeleeArcaneRanks}
                    exaltedStats={exaltedMeleeStats}
                    exaltedBaseStats={exaltedMeleeBaseStats}
                    exaltedContributionContext={exaltedMeleeContributionContext}
                    simParams={exaltedSimParams}
                    onSimParamsChange={setExaltedUserSim}
                    sectionTitle="Exalted Melee"
                    hideSiblingNote
                    activeBuildName={exaltedMeleeActiveBuildName}
                    savedWeaponBuilds={savedWeaponBuilds}
                    onLoadSavedBuild={handleLoadExaltedMeleeSavedBuild}
                    onSaveAsWeaponBuild={handleSaveExaltedMeleeAsWeaponBuild}
                    onClearMods={() => setExaltedMeleeMods([])}
                    onAddMod={(i) => {
                      setExaltedMeleeActiveSlot(i);
                      setExaltedMeleeModPickerOpen(true);
                    }}
                    onRemoveMod={(i) =>
                      setExaltedMeleeMods((prev) => prev.filter((m) => m.slotIndex !== i))
                    }
                    onPolarize={(i, p) =>
                      setExaltedMeleeSlotPolarities((prev) => applyPolarityOverride(prev, exaltedMeleeInnatePolarities, i, p))
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
                    onArcaneRankChange={(i, r) =>
                      setExaltedMeleeArcaneRanks((prev) => {
                        const next = [...prev];
                        next[i] = r;
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
                    className="w-full h-24 p-3 bg-card border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/70 shadow-sm"
                  />
                </div>
              </div>

              <div id="build-stats" className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] space-y-4 lg:sticky lg:top-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] lg:self-start lg:max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain">
                <WarframeStatsPanel
                  freeModCapacity={totalCapacity - capacityUsed}
                  stats={calculatedStats}
                  warframe={selectedWarframe}
                  formId={activeDualForm?.baseStats ? activeDualFormId : undefined}
                  equippedMods={equippedMods}
                  allMods={modsMap}
                  equippedArcanes={equippedArcanes}
                  arcaneRanks={equippedArcaneRanks}
                  passiveSim={wfPassiveSim}
                  onPassiveSimChange={(patch) => setWfPassiveSim((prev) => ({ ...prev, ...patch }))}
                  arcaneStacksById={effectiveWfArcaneStacksById}
                  onArcaneStacksChange={(id, n) => setWfArcaneStacksById((prev) => ({ ...prev, [id]: n }))}
                  conditionalModStacksById={wfConditionalModStacksById}
                  onConditionalModStacksChange={(id, n) => setWfConditionalModStacksById((prev) => ({ ...prev, [id]: n }))}
                />
                {abilityTTKEntries.length > 0 && (
                  <AbilityTTKPanel entries={abilityTTKEntries} />
                )}
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
        helminthAbility={
          helminthAbility && helminthAbility.source !== "helminth"
            ? { sourceWarframeId: helminthAbility.source, abilityName: helminthAbility.name }
            : null
        }
        arcaneCatalog={modPickerMode === "arcanes" ? warframeArcanes : undefined}
        pickerMode={modPickerMode}
        equippedArcaneIds={equippedArcanes.filter(Boolean).map((a) => a!.id)}
        slotNav={
          modPickerMode === "mods"
            ? buildSlotNav(
                [...auraSlotIndices, EXILUS_SLOT, ...Array.from({ length: 8 }, (_, i) => i + 1)],
                activeSlotIndex,
                handleOpenModPicker,
              )
            : undefined
        }
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
        hostWarframeId={selectedWarframe?.id}
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
          slotType={exaltedWeaponModSlotType(exaltedWeapon, exaltedActiveSlot)}
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
          equippedArcaneIds={exaltedArcanes
            .map((a, idx) => (idx === exaltedActiveArcaneSlot ? null : a?.id))
            .filter((id): id is string => Boolean(id))}
          initialRank={
            exaltedArcanes[exaltedActiveArcaneSlot]
              ? (exaltedArcaneRanks[exaltedActiveArcaneSlot] ?? exaltedArcanes[exaltedActiveArcaneSlot]!.maxRank)
              : undefined
          }
          onSelect={(arcane, rank) => {
            setExaltedArcanes((prev) => {
              const next = [...prev];
              while (next.length < exaltedArcaneConfig.slots) next.push(null);
              next[exaltedActiveArcaneSlot] = arcane;
              return next;
            });
            setExaltedArcaneRanks((prev) => {
              const next = [...prev];
              next[exaltedActiveArcaneSlot] = rank ?? arcane.maxRank;
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
          slotType={exaltedWeaponModSlotType(exaltedMeleeWeapon, exaltedMeleeActiveSlot)}
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
          equippedArcaneIds={exaltedMeleeArcanes
            .map((a, idx) => (idx === exaltedMeleeActiveArcaneSlot ? null : a?.id))
            .filter((id): id is string => Boolean(id))}
          initialRank={
            exaltedMeleeArcanes[exaltedMeleeActiveArcaneSlot]
              ? (exaltedMeleeArcaneRanks[exaltedMeleeActiveArcaneSlot] ?? exaltedMeleeArcanes[exaltedMeleeActiveArcaneSlot]!.maxRank)
              : undefined
          }
          onSelect={(arcane, rank) => {
            setExaltedMeleeArcanes((prev) => {
              const next = [...prev];
              while (next.length < exaltedMeleeArcaneConfig.slots) next.push(null);
              next[exaltedMeleeActiveArcaneSlot] = arcane;
              return next;
            });
            setExaltedMeleeArcaneRanks((prev) => {
              const next = [...prev];
              next[exaltedMeleeActiveArcaneSlot] = rank ?? arcane.maxRank;
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
          return `${wf?.name ?? d.warframeId} • ${d.mods?.length ?? 0} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      {selectedWarframe && (
        <BuildCompareDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          type="warframe"
          itemId={selectedWarframe.id}
          live={liveCompare}
        />
      )}

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || (selectedWarframe ? `${selectedWarframe.name} Build` : "Warframe Build")}
        defaultDescription={buildDescription}
        defaultIsPublic={saveDialogDefaultPublic}
        defaultTags={buildTags}
        onSave={handleSaveDialog}
        loadoutTarget={loadoutCtx ? { loadoutName: loadoutCtx.loadoutName, slotLabel: loadoutSlotLabel(loadoutCtx.slot) } : null}
      />
      <StancePickerDialog
        open={stancePickerTarget !== null}
        onOpenChange={(open) => {
          if (!open) setStancePickerTarget(null);
        }}
        allMods={allMods}
        stanceType={
          (stancePickerTarget === "exaltedMelee" ? exaltedMeleeWeapon : exaltedWeapon)?.stanceType
        }
        onSelect={(mod) => {
          if (stancePickerTarget === "exaltedMelee") setExaltedMeleeStanceId(mod.id);
          else setExaltedStanceId(mod.id);
          setStancePickerTarget(null);
        }}
      />
      <BuilderSectionNav sections={[{ id: "build-mods", label: "Mods" }, { id: "build-stats", label: "Stats" }]} />
    </PageShell>
  );
}
