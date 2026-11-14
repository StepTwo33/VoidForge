"use client";

import {
  draftMatchesRivenWeapon,
  loadoutFieldsForDraft,
  parseRivenEquip,
  placeLibraryRivenOnMods,
  readBuilderDraft,
  rivenCannotEquipReason,
  saveBuilderDraft,
  stripRivenEquipParams,
} from "@/lib/rivens/riven-equip";
import { getRivenModIdForWeapon } from "@/lib/weapons/riven-weapon-type";
import {
  applyPolarityOverride,
  effectiveSlotPolarities,
  innateSlotPolarities,
  isInnatePolarity,
} from "@/lib/builds/innate-polarities";
import { isExaltedCompanionId } from "@/lib/builds/loadout-slot-helpers";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { saveBuilderRivenToLibrary, useSavedRivenLibrary } from "@/lib/riven/use-saved-rivens";
import { rivenDrainFromRank, rivenRankFromDrain } from "@/lib/riven/riven-validation";
import { hasBuildLinkParam } from "@/lib/builds/weapon-url-param";
import { computeUsedCapacity } from "@/lib/calc/compute-used-capacity";
import { getRivenWeaponType, isRivenModId } from "@/lib/weapons/riven-weapon-type";

function withRivenRoll(eq: EquippedMod | undefined, mod: Mod | null): Mod | null {
  if (!eq || !mod || !isRivenModId(eq.modId)) return mod;
  return {
    ...mod,
    name: eq.modName && eq.modName !== mod.name ? eq.modName : mod.name,
    polarity: eq.polarity || mod.polarity,
  };
}
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
import { Companion, Mod, Weapon, EquippedMod, CompanionCalculatedStats, CompanionLinkedWarframe, DEFAULT_SIM_PARAMS, WeaponExternalBuff, WeaponCalculationOptions, type ModSlot } from "@/lib/types";
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
import { Search, Zap, Dog, Bot, Bug, Swords, Crosshair, Flag, FolderOpen, ArrowLeftRight } from "lucide-react";
import { SavedBuild, CompanionBuildData, persistSavedBuild } from "@/lib/builds/build-storage";
import { useBuilderSavedBuilds } from "@/lib/builds/use-builder-saved-builds";
import { cleanLoadedBuild } from "@/lib/builds/incompatible-mod-warnings";
import { dropUnknownMods } from "@/lib/mods/known-mods";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { cn } from "@/lib/utils";
import { appendReturnTo } from "@/lib/site/nav-return";
import { toast } from "sonner";
import { getCompanionImage, getWeaponImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { snapshotFromBuild } from "@/lib/builds/compare-build";
import { BuildCompareDialog } from "@/components/compare/build-compare-dialog";

const companionTypeLabels: Record<string, string> = {
  all: "All",
  sentinel: "Sentinels",
  kubrow: "Kubrows",
  kavat: "Kavats",
  moa: "MOAs",
  predasite: "Predasites",
  vulpaphyla: "Vulpaphylas",
  hound: "Hounds",
  weapons: "Weapons",
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

import {
  COMPANION_WEAPON_POSTURE_SLOT_INDEX,
  COMPANION_WEAPON_REGULAR_SLOT_COUNT,
  companionHasFixedWeapon,
  getCompanionWeapons,
  isCompanionPostureMod,
  isCompanionWeaponCategory,
  migrateClawModsFromCompanion,
  migratePostureToPostureSlot,
  modFitsCompanionWeapon,
  resolveCompanionClawId,
  resolveDefaultCompanionWeapon,
  resolveHoundWeaponId,
  resolvePreferredCompanionForWeapon,
  SIGNATURE_COMPANION_BY_WEAPON_ID,
} from "@/lib/weapons/companion-weapons";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { BuilderSaveControls } from "@/components/builder-save-controls";
import { BuilderToolbar, BuilderToolbarButton, BUILDER_REPORT_CLASS } from "@/components/builder-toolbar";
import { BuilderSavedEmpty } from "@/components/builder-saved-empty";
import { MobileStatSummary } from "@/components/stats/mobile-stat-summary";
import { companionStatSummary } from "@/lib/ui/mobile-stat-summary";
import { saveIdentityId } from "@/lib/builds/quicksave";
import { LoadoutEditBanner } from "@/components/loadout-edit-banner";
import { SAVE_DIRTY_CLASS, SAVE_DIRTY_DOT_CLASS, stableBuildSnapshot, useUnsavedChanges } from "@/lib/builds/unsaved-changes";
import { loadoutSlotLabel, updateLoadoutSlot } from "@/lib/builds/loadout-edit-context";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { getLoadouts } from "@/lib/builds/loadouts";
import { calcLoadoutStats, setBonusLinkageFromLoadout } from "@/lib/builds/loadout-stats";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";
import { shareBuilderBuild } from "@/lib/builds/share-build";
import { companionBuildToShare, companionShareToBuild, savedBuildFromShare } from "@/lib/builds/share-payload";
import { useShareBuildFromUrl } from "@/lib/builds/use-share-build-from-url";
import {
  houndBrackets,
  houndCores,
  houndModels,
  houndStabilizers,
  moaBrackets,
  moaCores,
  moaGyros,
  moaModels,
  type ModularCompanionParts,
} from "@/data/companion-parts";
import {
  defaultPartsForCompanion,
  resolveCompanionParts,
} from "@/lib/companions/companion-parts-resolve";

function PartSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; name: string }>;
  onChange: (id: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground tracking-wider font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatRow({ label, value, highlighted, color }: { label: string; value: string; highlighted?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className={cn("text-sm", color || "text-muted-foreground")}>{label}</span>
      <span className={highlighted ? "text-sm font-bold text-cyan-700 dark:text-cyan-400" : `text-sm font-mono ${color || ""}`}>
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
  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const { savedBuilds, refreshSavedBuilds, deleteSavedBuild } = useBuilderSavedBuilds("companion");
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [pickerTab, setPickerTab] = useState<"catalog" | "saved">("catalog");
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildTags, setBuildTags] = useState<string[]>([]);
  const [buildCreatedAt, setBuildCreatedAt] = useState<number | null>(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [buildDescription, setBuildDescription] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  // Weapon state
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [weaponSearch, setWeaponSearch] = useState("");
  const [weaponMods, setWeaponMods] = useState<EquippedMod[]>([]);
  const [activeWeaponSlotIndex, setActiveWeaponSlotIndex] = useState(0);
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [weaponSlotPolarities, setWeaponSlotPolarities] = useState<Record<number, string>>({});

  const isExaltedCompanion = Boolean(selectedCompanion && isExaltedCompanionId(selectedCompanion.id));
  const isExaltedCompanionWeapon = Boolean(selectedWeapon?.isExalted || isExaltedCompanion);
  const innatePolarities = useMemo(
    () => innateSlotPolarities("companion", selectedCompanion?.id),
    [selectedCompanion?.id],
  );
  const effectivePolarities = useMemo(
    () => effectiveSlotPolarities(innatePolarities, slotPolarities),
    [innatePolarities, slotPolarities],
  );
  const innateWeaponPolarities = useMemo(
    () => innateSlotPolarities("weapon", selectedWeapon?.id),
    [selectedWeapon?.id],
  );
  const effectiveWeaponPolarities = useMemo(
    () => effectiveSlotPolarities(innateWeaponPolarities, weaponSlotPolarities),
    [innateWeaponPolarities, weaponSlotPolarities],
  );
  const [modPickerTarget, setModPickerTarget] = useState<"companion" | "weapon">("companion");
  const [weaponRivenStatsMap, setWeaponRivenStatsMap] = useState<Record<number, Record<string, number>>>();
  const [editRivenSlot, setEditRivenSlot] = useState<number | null>(null);
  const [applyHunterVsSlash, setApplyHunterVsSlash] = useState(false);
  const [companionParts, setCompanionParts] = useState<ModularCompanionParts | null>(null);

  const [compareOpen, setCompareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const rivenLibraryState = useSavedRivenLibrary(selectedWeapon?.id);
  const savedRivens = rivenLibraryState.list;
  const refreshSavedRivens = rivenLibraryState.refresh;
  const rivenLibrary = useMemo(
    () => ({
      signedIn: rivenLibraryState.signedIn,
      onSave: async (r: { name: string; modId: string; stats: Record<string, number>; polarity: string; drain: number; id?: string }) => {
        if (!selectedWeapon) return false;
        const ok = await saveBuilderRivenToLibrary(selectedWeapon, r);
        if (ok) refreshSavedRivens();
        return ok;
      },
    }),
    [rivenLibraryState.signedIn, selectedWeapon, refreshSavedRivens],
  );

  const weaponAcceptsRiven = Boolean(selectedWeapon && getRivenModIdForWeapon(selectedWeapon));

  const editRivenTarget = useMemo(() => {
    if (editRivenSlot == null || !modPickerOpen || modPickerTarget !== "weapon") return null;
    const eq = weaponMods.find((m) => m.slotIndex === editRivenSlot);
    const mod = eq ? modsMap.get(eq.modId) : undefined;
    if (!eq || !mod || !isRivenModId(eq.modId)) return null;
    return {
      mod,
      stats: weaponRivenStatsMap?.[editRivenSlot] ?? {},
      polarity: eq.polarity,
      drain: rivenDrainFromRank(eq.rank),
      name: eq.modName && eq.modName !== mod.name ? eq.modName : undefined,
      libraryId: eq.rivenId,
    };
  }, [editRivenSlot, modPickerOpen, modPickerTarget, weaponMods, modsMap, weaponRivenStatsMap]);

  const buildCompanionData = useCallback((): CompanionBuildData | null => {
    if (!selectedCompanion) return null;
    return {
      companionId: selectedCompanion.id,
      mods: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      weaponId: selectedWeapon?.id,
      weaponMods: weaponMods.map((m) => ({
        modId: m.modId,
        rank: m.rank,
        slotIndex: m.slotIndex,
        ...(m.modName ? { modName: m.modName } : {}),
        ...(m.polarity ? { polarity: m.polarity } : {}),
        ...(weaponRivenStatsMap?.[m.slotIndex] ? { rivenStats: weaponRivenStatsMap[m.slotIndex] } : {}),
      })),
      weaponSlotPolarities,
      arcaneIds: [],
      hasReactor: isExaltedCompanion ? true : hasReactor,
      hasCatalyst: isExaltedCompanionWeapon ? true : hasCatalyst,
      isMR30: false,
      slotPolarities,
      ...(companionParts ? { parts: companionParts } : {}),
    };
  }, [selectedCompanion, equippedMods, selectedWeapon, weaponMods, weaponSlotPolarities, weaponRivenStatsMap, hasReactor, hasCatalyst, slotPolarities, companionParts]);

  const liveCompare = useMemo(() => {
    const data = buildCompanionData();
    if (!data || !selectedCompanion) return null;
    return snapshotFromBuild("companion", buildName || selectedCompanion.name, data);
  }, [buildCompanionData, selectedCompanion, buildName]);

  const { dirty: hasUnsavedChanges, markClean } = useUnsavedChanges(useMemo(() => stableBuildSnapshot(buildCompanionData()), [buildCompanionData]));

  const handleSaveBuildConfirm = useCallback(async ({ name, description, isPublic, tags, asNew = false }: SaveBuildDialogValues & { asNew?: boolean }) => {
    const data = buildCompanionData();
    if (!data || !selectedCompanion) return;
    const build: SavedBuild = {
      id: saveIdentityId(currentBuildId, asNew),
      name,
      description,
      isPublic,
      tags,
      type: "companion",
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
  }, [buildCompanionData, selectedCompanion, currentBuildId, refreshSavedBuilds, buildCreatedAt, markClean]);

  const handleQuickSave = useCallback(async () => {
    if (!currentBuildId) return;
    await handleSaveBuildConfirm({
      name: buildName || (selectedCompanion ? `${selectedCompanion.name} Build` : "Companion Build"),
      description: buildDescription,
      isPublic: buildIsPublic,
      tags: buildTags,
      target: "new",
      asNew: false,
    });
    markClean();
  }, [currentBuildId, handleSaveBuildConfirm, buildName, selectedCompanion, buildDescription, buildIsPublic, buildTags, markClean]);

  const handleLoadBuild = useCallback((rawBuild: SavedBuild, options?: { silent?: boolean }) => {
    const build = cleanLoadedBuild(rawBuild);
    const d0 = build.data as CompanionBuildData;
    const comp = allCompanions.find((c) => c.id === d0.companionId);
    if (!comp) { toast.error("Companion not found"); return; }
    // Round 49 (Update 37): Beast Claws mods saved in the beast's own slots move onto the claws.
    const claws = migrateClawModsFromCompanion(d0.mods ?? [], d0.weaponMods ?? [], comp);
    const d: CompanionBuildData = claws.moved.length || claws.droppedDuplicates.length
      ? { ...d0, mods: claws.mods, weaponMods: migratePostureToPostureSlot(claws.weaponMods, comp) }
      : d0;
    if (claws.moved.length) {
      toast.info(`Moved ${claws.moved.length === 1 ? "1 mod" : `${claws.moved.length} mods`} to the claws`, {
        id: "claw-mods-moved",
        description: `${claws.moved.map((id) => modsMap.get(id)?.name ?? id).join(", ")} now go on the claws (Update 37).`,
        duration: 9000,
      });
    }
    markClean();
    setSelectedCompanion(comp);
    const loadedParts = d.parts ?? defaultPartsForCompanion(comp) ?? null;
    setCompanionParts(loadedParts);
    // Removed / unknown mod ids (e.g. an old build saved with a mod later taken out) are dropped.
    setEquippedMods(dropUnknownMods(d.mods, modsMap).map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    const weaponCandidates = getCompanionWeapons(comp, allWeapons);
    const resolvedWeaponId =
      d.weaponId ??
      (loadedParts ? resolveCompanionParts(loadedParts)?.weaponId : undefined) ??
      resolveHoundWeaponId(comp) ??
      (companionHasFixedWeapon(comp) ? resolveCompanionClawId(comp) : undefined);
    if (resolvedWeaponId) {
      setSelectedWeapon(
        weaponCandidates.find((w) => w.id === resolvedWeaponId) ??
          (companionHasFixedWeapon(comp) ? resolveDefaultCompanionWeapon(comp, allWeapons) : null),
      );
    } else if ((d.weaponMods || []).length > 0 || companionHasFixedWeapon(comp)) {
      setSelectedWeapon(resolveDefaultCompanionWeapon(comp, allWeapons));
    } else {
      setSelectedWeapon(null);
    }
    const rivenMap: Record<number, Record<string, number>> = {};
    type LoadedWeaponMod = ModSlot & { modName?: string; polarity?: string; drain?: number };
    const loadedWeaponMods = (d.weaponMods || []) as LoadedWeaponMod[];
    for (const m of loadedWeaponMods) {
      if (m.rivenStats) rivenMap[m.slotIndex] = m.rivenStats;
    }
    setWeaponRivenStatsMap(Object.keys(rivenMap).length > 0 ? rivenMap : undefined);
    setWeaponMods(dropUnknownMods(loadedWeaponMods, modsMap).map((m) => {
      const mod = modsMap.get(m.modId);
      const isRiven = m.modId.startsWith("riven_") || m.modId === "companion_weapon_riven_mod";
      const rank = isRiven && !m.rank && typeof m.rivenDrain === "number" ? rivenRankFromDrain(m.rivenDrain) : m.rank;
      return {
        ...m,
        rank,
        modName: (isRiven && (m.rivenName || m.modName)) || m.modName || mod?.name || "",
        polarity: isRiven && m.rivenPolarity ? m.rivenPolarity : (m.polarity || mod?.polarity),
        drain: mod?.drain,
      };
    }));
    setHasReactor(isExaltedCompanionId(d.companionId) ? true : Boolean(d.hasReactor));
    setHasCatalyst(isExaltedCompanionId(d.companionId) ? true : Boolean(d.hasCatalyst));
    const resolved = loadedParts ? resolveCompanionParts(loadedParts) : null;
    setSlotPolarities(
      Object.keys(d.slotPolarities || {}).length > 0
        ? d.slotPolarities
        : (resolved?.defaultSlotPolarities ?? {}),
    );
    setWeaponSlotPolarities(d.weaponSlotPolarities || {});
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildDescription(build.description || "");
    setBuildIsPublic(build.isPublic ?? false);
    setBuildTags(build.tags ?? []);
    setBuildCreatedAt(build.createdAt || Date.now());
    setShowSavedBuilds(false);
    setShowCompanionList(false);
    if (!options?.silent) toast.info("Build loaded", { description: build.name });
  }, [markClean, allCompanions, allWeapons]);

  useCloudBuildFromUrl("companion", handleLoadBuild);
  useLocalBuildFromUrl("companion", handleLoadBuild);

  const handleShareBuild = useCallback(async () => {
    const data = buildCompanionData();
    if (!data) return;
    const outcome = await shareBuilderBuild({
      isPublic: buildIsPublic,
      buildId: currentBuildId,
      fallback: companionBuildToShare(data),
    });
    if (outcome.kind === "copied") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [buildCompanionData, buildIsPublic, currentBuildId]);

  useShareBuildFromUrl("companion", (shared) => {
    const data = companionShareToBuild(shared);
    if (!data) return false;
    if (!allCompanions.some((c) => c.id === data.companionId)) {
      toast.error("Companion not found", {
        description: "This shared build uses a companion that is no longer in the catalog.",
      });
      return false;
    }
    handleLoadBuild(savedBuildFromShare("companion", data, shared.customName || "Shared companion"), { silent: true });
    setCurrentBuildId(null);
  }, allCompanions.length > 0);

  const { context: loadoutCtx, clearContext: clearLoadoutCtx, restoreContext: restoreLoadoutCtx } = useLoadoutSlotFromUrl("companion", handleLoadBuild, allCompanions.length > 0);

  // Per-tab draft of the open build: Riven Library "Equip" adds its riven to this companion + weapon.
  useEffect(() => {
    const data = buildCompanionData();
    if (!data || !selectedCompanion || !selectedWeapon) return;
    saveBuilderDraft<CompanionBuildData>("companion", {
      itemId: selectedWeapon.id,
      buildId: currentBuildId,
      name: buildName,
      description: buildDescription,
      isPublic: buildIsPublic,
      tags: buildTags,
      createdAt: buildCreatedAt,
      data,
      ...loadoutFieldsForDraft(loadoutCtx),
    });
  }, [buildCompanionData, selectedCompanion, selectedWeapon, currentBuildId, buildName, buildDescription, buildIsPublic, buildTags, buildCreatedAt, loadoutCtx]);

  const weaponParamSeenRef = useRef<string | null>(null);
  useEffect(() => {
    if (allCompanions.length === 0 || allWeapons.length === 0) return;
    const params = new URLSearchParams(searchParams.toString());
    if (hasBuildLinkParam(params)) return;
    const weaponId = params.get("weapon")?.trim();
    const rivenParam = params.get("riven");
    const paramKey = weaponId ? `${weaponId}|${rivenParam ?? ""}` : null;
    if (!weaponId || paramKey === weaponParamSeenRef.current) return;
    weaponParamSeenRef.current = paramKey;

    const weapon = allWeapons.find((w) => w.id === weaponId);
    if (!weapon) return;

    const companion = resolvePreferredCompanionForWeapon(weapon, allCompanions);
    if (!companion) return;

    const stripEquip = (itemId: string) => {
      const clean = stripRivenEquipParams(window.location.pathname + window.location.search + window.location.hash);
      weaponParamSeenRef.current = `${itemId}|`;
      const url = new URL(clean, "http://x");
      url.searchParams.set("weapon", itemId);
      const qs = url.searchParams.toString();
      window.history.replaceState(window.history.state, "", `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`);
    };

    const startFreshCompanion = (opts?: { rivenMods?: { mods: ModSlot[]; stats: Record<number, Record<string, number>> } }) => {
      const parts = defaultPartsForCompanion(companion) ?? null;
      const resolved = parts ? resolveCompanionParts(parts) : null;
      setSelectedCompanion(companion);
      setCompanionParts(parts);
      setSlotPolarities(resolved?.defaultSlotPolarities ?? {});
      setShowCompanionList(false);
      setSelectedWeapon(weapon);
      setBuildName(`${companion.name} — ${weapon.name} Build`);
      if (opts?.rivenMods) {
        setWeaponMods(opts.rivenMods.mods.map((m) => ({
          modId: m.modId,
          modName: m.rivenName || `${weapon.name} Riven`,
          rank: m.rank,
          slotIndex: m.slotIndex,
          polarity: m.rivenPolarity,
          ...(m.rivenId ? { rivenId: m.rivenId } : {}),
        })));
        setWeaponRivenStatsMap(opts.rivenMods.stats);
      }
    };

    const equip = rivenParam ? parseRivenEquip(params) : null;
    const blocked = equip ? rivenCannotEquipReason(weapon) : null;
    if (equip && blocked) {
      toast.error(blocked);
      queueMicrotask(() => startFreshCompanion());
      stripEquip(weapon.id);
      return;
    }

    const rivenModId = equip && !blocked ? getRivenModIdForWeapon(weapon) : null;
    const rivenMod = rivenModId ? allMods.find((m) => m.id === rivenModId) : undefined;

    if (equip && rivenMod) {
      const draft = readBuilderDraft<CompanionBuildData>("companion");
      const useDraft = draft && draftMatchesRivenWeapon(draft.itemId, weapon.id);
      const placed = placeLibraryRivenOnMods(
        useDraft ? (draft.data.weaponMods || []) : [],
        { ...equip, modId: rivenMod.id, fallbackName: `${weapon.name} Riven`, catalogDrain: rivenMod.drain },
        COMPANION_WEAPON_REGULAR_SLOT_COUNT,
      );
      if (useDraft && draft) {
        const restored: SavedBuild = {
          id: draft.buildId || "",
          name: draft.name || `${companion.name} — ${weapon.name} Build`,
          description: draft.description || "",
          isPublic: draft.isPublic,
          tags: draft.tags,
          type: "companion",
          createdAt: draft.createdAt || Date.now(),
          updatedAt: Date.now(),
          data: { ...draft.data, weaponId: draft.data.weaponId || draft.itemId, weaponMods: placed.mods },
        };
        queueMicrotask(() => {
          handleLoadBuild(restored, { silent: true });
          if (!draft.buildId) setCurrentBuildId(null);
          if (draft.loadout) {
            restoreLoadoutCtx({
              loadoutId: draft.loadout.loadoutId,
              loadoutName: draft.loadout.loadoutName,
              kind: "companion",
              slot: draft.loadout.slot,
            });
          }
          const label = equip.name || "Riven";
          toast.success(`Added ${label} to ${restored.name}`, {
            description: placed.replaced
              ? `Slot ${placed.slotIndex + 1} was full, so it replaced ${modsMap.get(placed.replaced.modId)?.name ?? "that mod"}.`
              : undefined,
          });
        });
        stripEquip(draft.itemId);
        return;
      }
      const stats: Record<number, Record<string, number>> = {};
      for (const m of placed.mods) if (m.rivenStats) stats[m.slotIndex] = m.rivenStats;
      queueMicrotask(() => {
        startFreshCompanion({ rivenMods: { mods: placed.mods, stats } });
        const label = equip.name || "Riven";
        toast.success(`Equipped ${label}`, {
          description: placed.replaced
            ? `Slot ${placed.slotIndex + 1} was full, so it replaced ${modsMap.get(placed.replaced.modId)?.name ?? "that mod"}.`
            : undefined,
        });
      });
      stripEquip(weapon.id);
      return;
    }

    queueMicrotask(() => startFreshCompanion());
  }, [allCompanions, allWeapons, allMods, modsMap, searchParams, handleLoadBuild, restoreLoadoutCtx]);

  const handleSaveDialog = useCallback(async (values: SaveBuildDialogValues) => {
    if (values.target === "loadout" && loadoutCtx) {
      const data = buildCompanionData();
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
  }, [markClean, loadoutCtx, clearLoadoutCtx, handleSaveBuildConfirm, buildCompanionData, saveAsNew]);

  const handleDeleteBuild = useCallback((id: string) => {
    void deleteSavedBuild(id);
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId, deleteSavedBuild]);

  const filteredCompanions = useMemo(() => {
    if (companionType === "weapons") return [];
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

  const filteredPickerWeapons = useMemo(() => {
    const q = companionSearch.trim().toLowerCase();
    if (companionType !== "weapons" && !q) return [];
    let pool = allWeapons.filter((w) => isCompanionWeaponCategory(w.category));
    if (companionType !== "all" && companionType !== "weapons") {
      const typeComps = allCompanions.filter((c) => c.type === companionType);
      pool = pool.filter((w) => typeComps.some((c) => getCompanionWeapons(c, [w]).some((cw) => cw.id === w.id)));
    }
    if (q) {
      pool = pool.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.id.toLowerCase().includes(q) ||
          w.category.replace(/_/g, " ").toLowerCase().includes(q),
      );
    }
    return pool.sort((a, b) => a.name.localeCompare(b.name));
  }, [allWeapons, allCompanions, companionType, companionSearch]);

  // Link Vitality / Redirection / Fiber copy the Warframe's max stats. Only known when this
  // companion was opened from a loadout slot; a standalone companion build has no Warframe.
  const linkedWarframe = useMemo<CompanionLinkedWarframe | null>(() => {
    if (!loadoutCtx) return null;
    const loadout = getLoadouts().find((l) => l.id === loadoutCtx.loadoutId);
    if (!loadout?.warframeBuild) return null;
    const wf = calcLoadoutStats(loadout).warframe;
    if (!wf?.stats) return null;
    return { name: wf.name, health: wf.stats.totalHealth, shield: wf.stats.totalShield, armor: wf.stats.totalArmor };
  }, [loadoutCtx]);

  const calculatedStats = useMemo<CompanionCalculatedStats | null>(() => {
    if (!selectedCompanion) return null;
    return calculateCompanionBuild(selectedCompanion, equippedMods, modsMap, companionParts, linkedWarframe);
  }, [selectedCompanion, equippedMods, modsMap, companionParts, linkedWarframe]);

  const baseCapacity = hasReactor || isExaltedCompanion ? 60 : 30;
  const capacityUsed = useMemo(
    () => computeUsedCapacity(equippedMods, modsMap, effectivePolarities),
    [equippedMods, modsMap, effectivePolarities],
  );

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

  const filteredAvailableWeapons = useMemo(() => {
    const q = weaponSearch.trim().toLowerCase();
    if (!q) return availableWeapons;
    return availableWeapons.filter(
      (w) => w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q),
    );
  }, [availableWeapons, weaponSearch]);

  const loadoutLinkedCompanionWeaponBuffs = useMemo<WeaponExternalBuff[]>(() => {
    if (!loadoutCtx || !selectedWeapon) return [];
    const loadout = getLoadouts().find((l) => l.id === loadoutCtx.loadoutId);
    if (!loadout?.primaryBuild?.weaponId) return [];
    const stats = calcLoadoutStats(loadout);
    const primaryStats = stats.primary?.stats;
    if (!primaryStats) return [];
    const buffs: WeaponExternalBuff[] = [];
    const allSlots = [
      ...equippedMods.map((m) => ({ modId: m.modId, rank: m.rank })),
      ...weaponMods.map((m) => ({ modId: m.modId, rank: m.rank })),
    ];
    const hs = allSlots.find((m) => m.modId === "hunter_synergy");
    if (hs && primaryStats.criticalChance) {
      const bonus = primaryStats.criticalChance * (0.05 * ((hs.rank ?? 5) + 1));
      if (bonus > 0) {
        buffs.push({
          id: "mod:hunter_synergy",
          label: "Hunter Synergy",
          category: "companion",
          critChanceFlatBonus: bonus,
        });
      }
    }
    const mo = allSlots.find((m) => m.modId === "mecha_overdrive");
    if (mo && primaryStats.statusChance) {
      const bonus = primaryStats.statusChance * (0.10 * ((mo.rank ?? 5) + 1));
      if (bonus > 0) {
        buffs.push({
          id: "mod:mecha_overdrive",
          label: "Mecha Overdrive",
          category: "companion",
          statusChanceFlatBonus: bonus,
        });
      }
    }
    return buffs;
  }, [loadoutCtx, selectedWeapon, equippedMods, weaponMods]);

  const weaponStats = useMemo(() => {
    if (!selectedWeapon) return null;
    const rivenStatChanges = mergeRivenStatChanges(weaponRivenStatsMap, weaponMods);

    const linkedLoadout = loadoutCtx
      ? getLoadouts().find((l) => l.id === loadoutCtx.loadoutId)
      : undefined;
    const baseLinkage = linkedLoadout ? setBonusLinkageFromLoadout(linkedLoadout) : undefined;
    const linkage = {
      ...baseLinkage,
      companionMods: equippedMods.map((m) => ({
        modId: m.modId,
        rank: m.rank,
        slotIndex: m.slotIndex,
      })),
      // Round 49: Hunter Synergy / Mecha Overdrive sit on the claws since Update 37.
      companionWeaponMods: weaponMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
    };
    const options: WeaponCalculationOptions = {
      externalBuffs: loadoutLinkedCompanionWeaponBuffs.length > 0 ? loadoutLinkedCompanionWeaponBuffs : undefined,
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
      options,
      linkage,
      rivenStatChanges,
    );
  }, [selectedWeapon, weaponMods, weaponRivenStatsMap, modsMap, equippedMods, applyHunterVsSlash, loadoutLinkedCompanionWeaponBuffs]);

  const weaponCapacity = hasCatalyst || isExaltedCompanionWeapon ? 60 : 30;
  const weaponCapacityUsed = useMemo(
    () => computeUsedCapacity(weaponMods, modsMap, effectiveWeaponPolarities),
    [weaponMods, modsMap, effectiveWeaponPolarities],
  );

  /** Kavat/Kubrow/Predasite/Vulpaphyla: claws are part of the animal (no swap) + a Posture slot. */
  const hasFixedWeapon = companionHasFixedWeapon(selectedCompanion);
  const pickingPosture = hasFixedWeapon && activeWeaponSlotIndex === COMPANION_WEAPON_POSTURE_SLOT_INDEX;
  const weaponModPool = useMemo(() => {
    if (!selectedWeapon) return [];
    if (pickingPosture) return allMods.filter((m) => isCompanionPostureMod(m));
    return allMods.filter((m) => modFitsCompanionWeapon(m, selectedWeapon) && !isCompanionPostureMod(m));
  }, [allMods, selectedWeapon, pickingPosture]);

  const handleSelectCompanion = useCallback((companion: Companion) => {
    const isExalted = isExaltedCompanionId(companion.id);
    setSelectedCompanion(companion);
    setEquippedMods([]);
    setHasReactor(isExalted);
    const parts = defaultPartsForCompanion(companion) ?? null;
    setCompanionParts(parts);
    const resolved = parts ? resolveCompanionParts(parts) : null;
    const weaponCandidates = getCompanionWeapons(companion, allWeapons);
    // Preserve an already-selected robotic weapon (and its mods) when swapping between compatible Sentinels/MOAs
    const keepCurrentWeapon =
      selectedWeapon != null &&
      !companionHasFixedWeapon(companion) &&
      weaponCandidates.some((w) => w.id === selectedWeapon.id);
    if (!keepCurrentWeapon) {
      const weaponId =
        resolved?.weaponId ??
        resolveHoundWeaponId(companion) ??
        (companionHasFixedWeapon(companion) ? resolveCompanionClawId(companion) : undefined);
      const chosenWeapon = weaponId
        ? weaponCandidates.find((w) => w.id === weaponId) ??
            (companionHasFixedWeapon(companion) ? resolveDefaultCompanionWeapon(companion, allWeapons) : null)
        : companionHasFixedWeapon(companion)
          ? resolveDefaultCompanionWeapon(companion, allWeapons)
          : null;
      setSelectedWeapon(chosenWeapon);
      setWeaponMods([]);
      setHasCatalyst(isExalted || Boolean(chosenWeapon?.isExalted));
      setWeaponSlotPolarities({});
      setWeaponRivenStatsMap(undefined);
    }
    setSlotPolarities(resolved?.defaultSlotPolarities ?? {});
    setCurrentBuildId(null);
    setBuildName(
      keepCurrentWeapon && selectedWeapon
        ? `${companion.name} — ${selectedWeapon.name} Build`
        : `${companion.name} Build`,
    );
    setBuildDescription("");
    setShowCompanionList(false);
  }, [allWeapons, selectedWeapon]);

  const handleSelectWeaponFromPicker = useCallback((weapon: Weapon) => {
    const companion = resolvePreferredCompanionForWeapon(weapon, allCompanions);
    if (!companion) return;
    const isExalted = isExaltedCompanionId(companion.id);
    setSelectedCompanion(companion);
    setEquippedMods([]);
    setHasReactor(isExalted);
    const parts = defaultPartsForCompanion(companion) ?? null;
    setCompanionParts(parts);
    const resolved = parts ? resolveCompanionParts(parts) : null;
    setSlotPolarities(resolved?.defaultSlotPolarities ?? {});
    setSelectedWeapon(weapon);
    setWeaponMods([]);
    setHasCatalyst(isExalted || Boolean(weapon.isExalted));
    setWeaponSlotPolarities({});
    setWeaponRivenStatsMap(undefined);
    setCurrentBuildId(null);
    setBuildName(`${companion.name} — ${weapon.name} Build`);
    setBuildDescription("");
    setShowCompanionList(false);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (!hasBuildLinkParam(params)) {
        params.set("weapon", weapon.id);
        weaponParamSeenRef.current = weapon.id;
        window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params.toString()}`);
      }
    }
  }, [allCompanions]);

  const updateCompanionParts = useCallback((patch: Partial<ModularCompanionParts>) => {
    setCompanionParts((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const resolved = resolveCompanionParts(next);
      if (resolved) {
        setSlotPolarities((slots) =>
          Object.keys(slots).length === 0 ? resolved.defaultSlotPolarities : slots,
        );
        if (resolved.weaponId) {
          const weapon = allWeapons.find((w) => w.id === resolved.weaponId);
          if (weapon) setSelectedWeapon(weapon);
        }
        if (resolved.companionId && selectedCompanion?.id !== resolved.companionId) {
          const nextComp = allCompanions.find((c) => c.id === resolved.companionId);
          if (nextComp) setSelectedCompanion(nextComp);
        }
      }
      return next;
    });
  }, [allCompanions, allWeapons, selectedCompanion?.id]);

  const handleOpenModPicker = useCallback((slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    setModPickerTarget("companion");
    setModPickerOpen(true);
  }, []);

  const handleOpenWeaponModPicker = useCallback((slotIndex: number) => {
    setActiveWeaponSlotIndex(slotIndex);
    setEditRivenSlot(null);
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
    setEditRivenSlot((cur) => (cur === slotIndex ? null : cur));
  }, []);

  const handleSelectWeaponRiven = useCallback((mod: Mod, stats: Record<string, number>, meta?: { polarity?: string; drain?: number; name?: string; id?: string }) => {
    const rank = meta?.drain != null ? rivenRankFromDrain(meta.drain) : 8;
    const polarity = meta?.polarity || mod.polarity;
    const displayName = meta?.name || mod.name;
    setWeaponMods((prev) => {
      const filtered = prev.filter((m) => m.slotIndex !== activeWeaponSlotIndex);
      return [
        ...filtered,
        {
          modId: mod.id,
          modName: displayName,
          rank,
          slotIndex: activeWeaponSlotIndex,
          polarity,
          drain: rivenDrainFromRank(rank),
          ...(meta?.id ? { rivenId: meta.id } : {}),
        },
      ];
    });
    setEditRivenSlot(null);
    setWeaponRivenStatsMap((prev) => ({ ...(prev || {}), [activeWeaponSlotIndex]: stats }));
  }, [activeWeaponSlotIndex]);

  const equippedModIds = modPickerTarget === "weapon"
    ? weaponMods.map((m) => m.modId)
    : equippedMods.map((m) => m.modId);

  return (
    <PageShell>

      <main className="flex-1 container mx-auto px-4 py-6">
        <LoadoutEditBanner
          context={loadoutCtx}
          onDetach={clearLoadoutCtx}
          dirty={hasUnsavedChanges}
          onSaveToLoadout={() => handleSaveDialog({ name: buildName, description: "", isPublic: false, tags: [], target: "loadout" })}
        />
        {showCompanionList || !selectedCompanion ? (
          <ItemPickerScreen
            onBack={selectedCompanion ? () => setShowCompanionList(false) : undefined}
            backLabel={selectedCompanion?.name}
            icon={Dog}
            accent="cyan"
            title="Companion Builder"
            description="Choose a sentinel, kubrow, kavat, MOA, hound, or companion weapon to configure."
            count={filteredCompanions.length + filteredPickerWeapons.length}
            search={companionSearch}
            onSearchChange={setCompanionSearch}
            searchPlaceholder="Search companions or weapons (e.g. Verglas)..."
            pickerTab={pickerTab}
            onPickerTabChange={(tab) => {
              if (tab === "saved") void refreshSavedBuilds();
              setPickerTab(tab);
            }}
            savedPanel={
              savedBuilds.length === 0 ? (
                <BuilderSavedEmpty typeLabel="companion" />
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
                    <span className="text-cyan-700 dark:text-cyan-400">{getCompanionIcon(comp.type)}</span>
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
            {filteredPickerWeapons.map((w) => {
              const sigId = SIGNATURE_COMPANION_BY_WEAPON_ID[w.id];
              const sigName = sigId ? allCompanions.find((c) => c.id === sigId)?.name : null;
              return (
                <ItemPickerRow
                  key={`weapon:${w.id}`}
                  accent="cyan"
                  onClick={() => handleSelectWeaponFromPicker(w)}
                  image={
                    <GameAssetImage
                      src={getWeaponImage(w.name, { category: w.category })}
                      alt=""
                      width={40}
                      height={40}
                      className="h-9 w-9 object-contain"
                      hideOnError
                    />
                  }
                  title={
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-orange-700 dark:text-orange-400"><Crosshair className="h-4 w-4" /></span>
                      {w.name}
                    </span>
                  }
                  badge={
                    <span className="text-xs capitalize text-muted-foreground">
                      {w.category.replace(/_/g, " ")}
                      {sigName ? ` · ${sigName}` : ""}
                    </span>
                  }
                  meta={
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span>DMG {w.damage}</span>
                      <span>CC {(w.criticalChance * 100).toFixed(0)}%</span>
                      <span>CD {w.criticalMultiplier.toFixed(1)}x</span>
                      <span>SC {(w.statusChance * 100).toFixed(0)}%</span>
                    </div>
                  }
                />
              );
            })}
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
              subtitle={selectedWeapon ? `${selectedCompanion.type} • ${selectedWeapon.name}` : selectedCompanion.type}
            >
              <BuilderToolbar
                canUpdate={!!currentBuildId}
                dirty={hasUnsavedChanges}
                onUpdate={() => { void handleQuickSave(); }}
                onSaveNew={() => { setSaveAsNew(false); setSaveDialogOpen(true); }}
                onSaveAs={() => { setSaveAsNew(true); setSaveDialogOpen(true); }}
                onLoad={() => { void refreshSavedBuilds(); setShowSavedBuilds(true); }}
                onShare={handleShareBuild}
                shareCopied={shareCopied}
                extras={
                  <BuilderToolbarButton
                    onClick={() => setCompareOpen(true)}
                    title="Compare this build to a saved or posted build"
                    hoverClass="hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-400"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" /> <span className="inline">Compare</span>
                  </BuilderToolbarButton>
                }
                secondary={
                  isExaltedCompanion ? (
                    <BuilderToolbarButton
                      disabled
                      title="Innate Orokin Reactor — exalted companions automatically come with a pre-installed Reactor (60 capacity)"
                      aria-pressed={true}
                      active
                      activeClass="bg-yellow-500/10 text-yellow-400 cursor-default opacity-90"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span className="inline">Innate Reactor</span>
                    </BuilderToolbarButton>
                  ) : (
                    <BuilderToolbarButton
                      onClick={() => setHasReactor(!hasReactor)}
                      title="Orokin Reactor — doubles mod capacity"
                      aria-pressed={hasReactor}
                      active={hasReactor}
                      activeClass="bg-yellow-500/10 text-yellow-400"
                      hoverClass="hover:text-foreground hover:bg-accent"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span className="inline">Reactor</span>
                    </BuilderToolbarButton>
                  )
                }
                trailing={
                  <a
                    href={appendReturnTo(
                      `/report-issue?type=companion&name=${encodeURIComponent(selectedCompanion.name)}&id=${encodeURIComponent(selectedCompanion.id)}`,
                      builderReturnTo,
                    )}
                    className={BUILDER_REPORT_CLASS}
                  >
                    <Flag className="h-3 w-3" /> <span className="inline">Report</span>
                  </a>
                }
              />
            </BuilderItemHeader>

            <div className="mb-6">
              <textarea
                value={buildDescription}
                onChange={(e) => setBuildDescription(e.target.value)}
                placeholder="Write a description for this build... (e.g. mechanics, synergies, how to play)"
                className="w-full h-24 p-3 bg-card border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/70 shadow-sm"
              />
            </div>

            {companionParts && (selectedCompanion.type === "moa" || selectedCompanion.type === "hound") && (
              <div className="mb-4 p-3 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">
                    {companionParts.kind === "moa" ? "MOA PARTS" : "HOUND PARTS"}
                  </span>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={companionParts.isGilded !== false}
                      onChange={(e) => updateCompanionParts({ isGilded: e.target.checked })}
                    />
                    Gilded
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {companionParts.kind === "moa" ? (
                    <>
                      <PartSelect
                        label="Model"
                        value={companionParts.model}
                        options={moaModels}
                        onChange={(id) => updateCompanionParts({ model: id })}
                      />
                      <PartSelect
                        label="Core"
                        value={companionParts.core}
                        options={moaCores}
                        onChange={(id) => updateCompanionParts({ core: id })}
                      />
                      <PartSelect
                        label="Gyro"
                        value={companionParts.gyro ?? moaGyros[0].id}
                        options={moaGyros}
                        onChange={(id) => updateCompanionParts({ gyro: id })}
                      />
                      <PartSelect
                        label="Bracket"
                        value={companionParts.bracket}
                        options={moaBrackets}
                        onChange={(id) => updateCompanionParts({ bracket: id })}
                      />
                    </>
                  ) : (
                    <>
                      <PartSelect
                        label="Model"
                        value={companionParts.model}
                        options={houndModels}
                        onChange={(id) => updateCompanionParts({ model: id })}
                      />
                      <PartSelect
                        label="Core"
                        value={companionParts.core}
                        options={houndCores}
                        onChange={(id) => updateCompanionParts({ core: id })}
                      />
                      <PartSelect
                        label="Bracket"
                        value={companionParts.bracket}
                        options={houndBrackets}
                        onChange={(id) => updateCompanionParts({ bracket: id })}
                      />
                      <PartSelect
                        label="Stabilizer"
                        value={companionParts.stabilizer ?? houndStabilizers[0].id}
                        options={houndStabilizers}
                        onChange={(id) => updateCompanionParts({ stabilizer: id })}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedCompanion.precept && (
              <div className="mb-4 p-3 border border-cyan-500/20 rounded-lg bg-cyan-500/5">
                <span className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 tracking-wider">PRECEPT</span>
                <p className="text-sm text-muted-foreground mt-1">{selectedCompanion.precept}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div>
                <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card lg:static lg:z-auto lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
                  <h2 className="min-w-0 truncate text-sm font-semibold tracking-wider text-muted-foreground">
                    MOD CONFIGURATION
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-muted-foreground">
                      {equippedPreceptCount}/{COMPANION_MAX_PRECEPTS} precepts
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-mono tabular-nums",
                      capacityUsed > baseCapacity ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                    )}>
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">Capacity</span>
                      {capacityUsed} / {baseCapacity}
                    </span>
                  </div>
                  <MobileStatSummary items={companionStatSummary(calculatedStats)} />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
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
                        slotPolarity={effectivePolarities[i]}
                        innatePolarity={isInnatePolarity(innatePolarities, slotPolarities, i)}
                        equippedModIds={equippedModIds}
                        onAdd={() => handleOpenModPicker(i)}
                        onRemove={() => handleRemoveMod(i)}
                        onPolarize={(p) => setSlotPolarities((prev) => applyPolarityOverride(prev, innatePolarities, i, p))}
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
                      {(calculatedStats.linkHealth > 0 || calculatedStats.linkShield > 0 || calculatedStats.linkArmor > 0) && (
                        <p className="pt-1 text-xs text-muted-foreground" data-testid="companion-link-included">
                          Includes Link mods from {linkedWarframe?.name ?? "your Warframe"}:
                          {calculatedStats.linkHealth > 0 && ` +${calculatedStats.linkHealth.toFixed(0)} health`}
                          {calculatedStats.linkShield > 0 && ` +${calculatedStats.linkShield.toFixed(0)} shields`}
                          {calculatedStats.linkArmor > 0 && ` +${calculatedStats.linkArmor.toFixed(0)} armor`}
                        </p>
                      )}
                      {calculatedStats.linkModsNeedWarframe && (
                        <p className="pt-1 text-xs text-amber-800 dark:text-amber-400" data-testid="companion-link-standalone">
                          Link mods add up to 125% of your Warframe&apos;s health, shields or armor. This companion is built on its own, so they aren&apos;t in these totals. Open it from a loadout to include them.
                        </p>
                      )}
                      <div className="border-t border-border my-2" />
                      <StatRow label="Melee Damage" value={`+${(calculatedStats.meleeDamageBonus * 100).toFixed(0)}%`} />
                      <StatRow label="Attack Speed" value={`+${(calculatedStats.attackSpeedBonus * 100).toFixed(0)}%`} />
                      <StatRow label="Critical Chance" value={`+${(calculatedStats.critChanceBonus * 100).toFixed(0)}%`} />
                      <StatRow label="Critical Damage" value={`+${(calculatedStats.critDamageBonus * 100).toFixed(0)}%`} />
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
                      <StatRow label="Effective Health" value={calculatedStats.effectiveHealth.toFixed(0)} highlighted />
                      <StatRow label="Damage Reduction" value={`${calculatedStats.damageReduction.toFixed(1)}%`} highlighted />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Pick a companion above to see body stats and precepts.</p>
                  )}
                </div>
              </div>
            </div>

              {/* COMPANION WEAPON SECTION — full width below mods/stats */}
              <div className="mt-8 border-t border-border pt-6">
                <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <Swords className="h-5 w-5 shrink-0 text-orange-700 dark:text-orange-400" />
                  <h2 className="min-w-0 flex-1 truncate text-lg font-bold">Companion Weapon</h2>
                  {selectedWeapon && (
                    isExaltedCompanionWeapon ? (
                      <button
                        type="button"
                        disabled
                        title="Innate Orokin Catalyst — exalted companion weapons automatically come with an Orokin Catalyst equipped in-game (60 capacity)"
                        aria-pressed={true}
                        className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-400 cursor-default opacity-90 sm:min-h-9 sm:py-1.5"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>Innate Catalyst</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setHasCatalyst(!hasCatalyst)}
                        title="Orokin Catalyst — doubles mod capacity"
                        aria-pressed={hasCatalyst}
                        className={cn(
                          "ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-all sm:min-h-9 sm:py-1.5",
                          hasCatalyst
                            ? "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-400"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        {hasCatalyst ? (<><span className="sm:hidden">Catalyst</span><span className="hidden sm:inline">Catalyst Installed</span></>) : "Orokin Catalyst"}
                      </button>
                    )
                  )}
                </div>

                {/* Weapon Selector */}
                {!selectedWeapon ? (
                  <div className="space-y-2">
                    {availableWeapons.length > 0 && (
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="search"
                          value={weaponSearch}
                          onChange={(e) => setWeaponSearch(e.target.value)}
                          placeholder="Search companion weapons…"
                          className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm"
                          aria-label="Search companion weapons"
                        />
                      </div>
                    )}
                    <div className="max-h-[min(50dvh,20rem)] space-y-1 overflow-y-auto overscroll-contain rounded-lg border border-border/60 p-1.5 sm:max-h-[min(60vh,24rem)]">
                      {availableWeapons.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No weapons available for this companion type</p>
                      ) : filteredAvailableWeapons.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No weapons match “{weaponSearch.trim()}”.</p>
                      ) : (
                        filteredAvailableWeapons.map((w) => (
                          <button
                            key={w.id}
                            onClick={() => { setSelectedWeapon(w); setWeaponMods([]); setHasCatalyst(false); setWeaponSlotPolarities({}); setWeaponSearch(""); }}
                            className="min-h-11 w-full rounded-lg border border-transparent p-2.5 text-left transition-all hover:border-orange-500/50 hover:bg-orange-500/5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="min-w-0 truncate font-medium text-sm">{w.name}</span>
                              <span className="shrink-0 text-[10px] capitalize text-muted-foreground">{w.category.replace('_', ' ')}</span>
                            </div>
                            <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                              <span title="Total base damage per shot">DMG {w.damage}</span>
                              <span title="Critical chance">CC {(w.criticalChance * 100).toFixed(0)}%</span>
                              <span title="Critical damage (critical multiplier)">CD {w.criticalMultiplier.toFixed(1)}x</span>
                              <span title="Status chance">SC {(w.statusChance * 100).toFixed(0)}%</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 sm:gap-3">
                      <Crosshair className="h-4 w-4 shrink-0 text-orange-700 dark:text-orange-400" />
                      <span className="min-w-0 truncate font-medium text-sm">{selectedWeapon.name}</span>
                      <span className="text-[10px] capitalize text-muted-foreground">{selectedWeapon.category.replace('_', ' ')}</span>
                      {hasFixedWeapon ? (
                        <span className="ml-auto text-[10px] text-muted-foreground" data-testid="companion-claws-fixed">
                          Built into {selectedCompanion?.name ?? "this companion"}
                        </span>
                      ) : (
                        <button onClick={() => { setSelectedWeapon(null); setWeaponMods([]); setWeaponSlotPolarities({}); }} className="ml-auto inline-flex min-h-11 items-center rounded-md px-3 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground sm:min-h-9">Change</button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card lg:static lg:z-auto lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
                          <h3 className="min-w-0 truncate text-sm font-semibold tracking-wider text-muted-foreground">WEAPON MODS</h3>
                          <span className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-mono tabular-nums",
                            weaponCapacityUsed > weaponCapacity ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                          )}>
                            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">Capacity</span>
                            {weaponCapacityUsed} / {weaponCapacity}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {Array.from({ length: COMPANION_WEAPON_REGULAR_SLOT_COUNT }, (_, i) => {
                            const equipped = weaponMods.find((m) => m.slotIndex === i);
                            const mod = withRivenRoll(equipped, equipped ? modsMap.get(equipped.modId) ?? null : null);
                            return (
                              <ModSlotCard
                                key={`w${i}`}
                                mod={mod}
                                rank={equipped?.rank ?? 0}
                                slotIndex={i}
                                slotPolarity={effectiveWeaponPolarities[i]}
                                innatePolarity={isInnatePolarity(innateWeaponPolarities, weaponSlotPolarities, i)}
                                rivenStats={weaponRivenStatsMap?.[i]}
                                weaponCategory={getRivenWeaponType(selectedWeapon)?.toLowerCase() ?? selectedWeapon.category}
                                equippedModIds={weaponMods.map((m) => m.modId)}
                                onAdd={() => handleOpenWeaponModPicker(i)}
                                onRemove={() => handleRemoveWeaponMod(i)}
                                onPolarize={(p) => setWeaponSlotPolarities((prev) => applyPolarityOverride(prev, innateWeaponPolarities, i, p))}
                                onEditRiven={() => { handleOpenWeaponModPicker(i); setEditRivenSlot(i); }}
                              />
                            );
                          })}
                        </div>
                        {hasFixedWeapon && (() => {
                          const i = COMPANION_WEAPON_POSTURE_SLOT_INDEX;
                          const equipped = weaponMods.find((m) => m.slotIndex === i);
                          const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                          return (
                            <div className="mt-2.5" data-testid="companion-posture-slot">
                              <span className="mb-1 block text-[10px] font-semibold tracking-wider text-cyan-700 dark:text-cyan-400">
                                POSTURE
                              </span>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <ModSlotCard
                                  key={`w${i}`}
                                  mod={mod}
                                  rank={equipped?.rank ?? 0}
                                  slotIndex={i}
                                  label="Posture"
                                  equippedModIds={weaponMods.map((m) => m.modId)}
                                  slotPolarity={effectiveWeaponPolarities[i]}
                        innatePolarity={isInnatePolarity(innateWeaponPolarities, weaponSlotPolarities, i)}
                                  onAdd={() => handleOpenWeaponModPicker(i)}
                                  onRemove={() => handleRemoveWeaponMod(i)}
                                  onPolarize={(p) => setWeaponSlotPolarities((prev) => applyPolarityOverride(prev, innateWeaponPolarities, i, p))}
                                />
                              </div>
                            </div>
                          );
                        })()}
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
                                      Note: values above ~2.147B can wrap to large negatives in-game (signed 32-bit). Voidforge shows uncapped math.
                                    </p>
                                  )}
                                </>
                              );
                            })()}
                            <div className="border-t border-border my-2" />
                            <StatRow label="Critical Chance" value={`${(weaponStats.criticalChance * 100).toFixed(1)}%`} />
                            <StatRow label="Critical Multiplier" value={`${weaponStats.criticalMultiplier.toFixed(2)}x`} />
                            <StatRow label="Status Chance" value={`${(weaponStats.statusChancePerShot * 100).toFixed(1)}%`} />
                            <StatRow label="Fire Rate" value={`${(weaponStats.effectiveFireRate ?? weaponStats.fireRate).toFixed(2)}/s`} />
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
                                    color="text-amber-800 dark:text-amber-400"
                                  />
                                )}
                              </>
                            )}
                            <StatRow label="Burst DPS" value={weaponStats.burstDps.toFixed(0)} highlighted />
                            <StatRow label="Sustained DPS" value={weaponStats.sustainedDps.toFixed(0)} highlighted />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Attach a companion weapon to see DPS and mod capacity.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
          </div>
        )}
      </main>

      <ModPicker
        open={modPickerOpen}
        onClose={() => { setModPickerOpen(false); setEditRivenSlot(null); }}
        mods={modPickerTarget === "weapon" ? weaponModPool : companionPickerMods}
        category="_prefiltered"
        statFilterCategory={modPickerTarget === "weapon" ? "primary" : "companion"}
        slotType="regular"
        equippedModIds={equippedModIds}
        activeSlotModId={modPickerTarget === "weapon" ? weaponMods.find((m) => m.slotIndex === activeWeaponSlotIndex)?.modId : undefined}
        onSelect={handleSelectMod}
        onSelectRiven={modPickerTarget === "weapon" && weaponAcceptsRiven ? handleSelectWeaponRiven : undefined}
        editRiven={editRivenTarget}
        savedRivens={modPickerTarget === "weapon" && weaponAcceptsRiven ? savedRivens : undefined}
        rivenLibrary={modPickerTarget === "weapon" && weaponAcceptsRiven ? rivenLibrary : undefined}
        weaponCategory={modPickerTarget === "weapon" ? selectedWeapon?.category : undefined}
        weapon={modPickerTarget === "weapon" ? (selectedWeapon ?? undefined) : undefined}
        elsewhereMods={
          modPickerTarget === "weapon"
            ? { label: "the companion's mod panel", mods: companionPickerMods }
            : { label: `the Companion Weapon mods${selectedWeapon ? ` (${selectedWeapon.name})` : ""}`, mods: weaponModPool }
        }
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
          return `${comp?.name ?? d.companionId} • ${d.mods?.length ?? 0} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      {selectedCompanion && (
        <BuildCompareDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          type="companion"
          itemId={selectedCompanion.id}
          live={liveCompare}
        />
      )}

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || (selectedCompanion ? `${selectedCompanion.name} Build` : "Companion Build")}
        defaultDescription={buildDescription}
        defaultIsPublic={buildIsPublic}
        defaultTags={buildTags}
        onSave={handleSaveDialog}
        loadoutTarget={loadoutCtx ? { loadoutName: loadoutCtx.loadoutName, slotLabel: loadoutSlotLabel(loadoutCtx.slot) } : null}
      />
    </PageShell>
  );
}
