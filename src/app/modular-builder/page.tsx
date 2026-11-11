"use client";

import {
  draftMatchesRivenWeapon,
  loadoutFieldsForDraft,
  parseRivenEquip,
  placeLibraryRivenOnMods,
  readBuilderDraft,
  rivenCannotEquipReason,
  RIVEN_REGULAR_SLOTS,
  saveBuilderDraft,
  stripRivenEquipParams,
} from "@/lib/rivens/riven-equip";
import { BuilderSectionNav } from "@/components/builder-section-nav";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ModSlotCard } from "@/components/mod-slot";
import { WeaponStatsPanel } from "@/components/stats-panel";
import { MobileStatSummary } from "@/components/stats/mobile-stat-summary";
import { weaponStatSummary } from "@/lib/ui/mobile-stat-summary";
import { ModPicker, buildSlotNav, type RivenSelectMeta } from "@/components/mod-picker";
import { saveBuilderRivenToLibrary, useSavedRivenLibrary } from "@/lib/riven/use-saved-rivens";
import { rivenDrainFromRank, rivenRankFromDrain } from "@/lib/riven/riven-validation";
import { mergeRivenStatChanges } from "@/lib/calc/weapon-stat-merges";
import { useMods, useWarframes } from "@/lib/weapons/use-data";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { modSlotCapacityCost, modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { Weapon, Mod, EquippedMod, SimulationParams, DEFAULT_SIM_PARAMS, ModularBuildData, WeaponExternalBuff, WeaponCalculationOptions, SetBonusLinkage } from "@/lib/types";
import { getWeaponArcanes, arcanesForSlot, arcaneSlotLabel, type WeaponArcaneConfig } from "@/lib/weapons/weapon-arcane-config";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import type { SlotType } from "@/components/mod-picker";
import { Zap, Wrench, ChevronRight, FolderOpen, Gem, ArrowLeftRight } from "lucide-react";
import { SavedBuild, persistSavedBuild, resolveActiveArcaneList, resolveArcaneById } from "@/lib/builds/build-storage";
import { saveIdentityId } from "@/lib/builds/quicksave";
import { BuilderSaveControls } from "@/components/builder-save-controls";
import { getLoadouts } from "@/lib/builds/loadouts";
import { calcLoadoutStats, setBonusLinkageFromLoadout } from "@/lib/builds/loadout-stats";
import { resolveAbilitiesWithHelminth, resolveStandaloneExternalBuffs, resolveWeaponExternalBuffs, type WeaponBuffContext } from "@/lib/weapons/weapon-external-buffs";
import { hasBuildLinkParam } from "@/lib/builds/weapon-url-param";
import { useBuilderSavedBuilds } from "@/lib/builds/use-builder-saved-builds";
import { BuildsReturnLink } from "@/components/builds-return-link";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { toast } from "sonner";
import {
  kitgunChambers, kitgunGrips, kitgunLoaders, buildKitgun, kitgunWeaponClass,
  zawStrikes, zawGrips, zawLinks, buildZaw,
  ampPrisms, ampScaffolds, ampBraces, ampScaffoldProcsPerTrigger, ampScaffoldEdgeDamage,
  recommendedBuilds,
  KitgunChamber, KitgunGrip, KitgunLoader, ZawStrike, ZawGrip, ZawLink, AmpScaffold, AmpBrace,
} from "@/data/modular-weapons";
import { cn } from "@/lib/utils";
import { reportUnreadableShareLink } from "@/lib/builds/share-link-errors";
import { cleanLoadedBuild, cleanLoadedMods } from "@/lib/builds/incompatible-mod-warnings";
import { extractBuildFromUrlAsync } from "@/lib/builds/build-url";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { LoadoutEditBanner } from "@/components/loadout-edit-banner";
import { SAVE_DIRTY_CLASS, SAVE_DIRTY_DOT_CLASS, stableBuildSnapshot, useUnsavedChanges } from "@/lib/builds/unsaved-changes";
import { loadoutSlotLabel, updateLoadoutSlot } from "@/lib/builds/loadout-edit-context";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { snapshotFromBuild } from "@/lib/builds/compare-build";
import { extractBuildItemId } from "@/lib/builds/build-types";
import { keepLegalModularBuild } from "@/lib/builds/modular-part-edit";
import { weaponFromModularData } from "@/lib/builds/modular-resolve";
import { BuildCompareDialog } from "@/components/compare/build-compare-dialog";

type ModularType = "kitgun" | "zaw" | "amp";

const SECONDARY_EXILUS_SLOT_INDEX = 8;

const typeLabels: Record<ModularType, string> = {
  kitgun: "Kitgun",
  zaw: "Zaw",
  amp: "Amp",
};

function StatDelta({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const color = value > 0 ? "cmp-win" : value < 0 ? "cmp-lose" : "text-muted-foreground";
  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={color}>{value > 0 ? "+" : ""}{value}{suffix}</span>
    </div>
  );
}

function isRivenSlotModId(modId: string): boolean {
  return (
    modId.startsWith("riven_") ||
    modId === "zaw_riven_mod" ||
    modId === "kitgun_riven_mod" ||
    modId === "companion_weapon_riven_mod"
  );
}

function withRivenRoll(eq: EquippedMod | undefined, mod: Mod | null): Mod | null {
  if (!eq || !mod || !isRivenSlotModId(eq.modId)) return mod;
  return {
    ...mod,
    name: eq.modName && eq.modName !== mod.name ? eq.modName : mod.name,
    polarity: eq.polarity || mod.polarity,
    drain: rivenDrainFromRank(eq.rank),
  };
}

export default function ModularBuilderPage() {
  const { mods: allMods, modsMap } = useMods();
  const allWarframes = useWarframes();
  const [modularType, setModularType] = useState<ModularType>("kitgun");

  // Kitgun state
  const [kitgunChamber, setKitgunChamber] = useState<KitgunChamber | null>(null);
  const [kitgunGrip, setKitgunGrip] = useState<KitgunGrip | null>(null);
  const [kitgunLoader, setKitgunLoader] = useState<KitgunLoader | null>(null);

  // Zaw state
  const [zawStrike, setZawStrike] = useState<ZawStrike | null>(null);
  const [zawGripSel, setZawGripSel] = useState<ZawGrip | null>(null);
  const [zawLinkSel, setZawLinkSel] = useState<ZawLink | null>(null);

  // Amp state
  const [ampPrism, setAmpPrism] = useState<Weapon | null>(null);
  const [ampScaffold, setAmpScaffold] = useState<AmpScaffold | null>(null);
  const [ampBrace, setAmpBrace] = useState<AmpBrace | null>(null);

  // Mod state
  const [equippedMods, setEquippedMods] = useState<EquippedMod[]>([]);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [modPickerSlotType, setModPickerSlotType] = useState<SlotType>("regular");
  const [equippedArcanes, setEquippedArcanes] = useState<(Mod | null)[]>([null, null]);
  const [equippedArcaneRanks, setEquippedArcaneRanks] = useState<number[]>([5, 5]);
  const [arcanePickerOpen, setArcanePickerOpen] = useState(false);
  const [activeArcaneSlot, setActiveArcaneSlot] = useState(0);
  const [hasOrokinCatalyst, setHasOrokinCatalyst] = useState(false);
  const [simParams, setSimParams] = useState<SimulationParams>(() => ({ ...DEFAULT_SIM_PARAMS }));
  const [rivenStatsMap, setRivenStatsMap] = useState<Record<number, Record<string, number>>>({});
  const [editRivenSlot, setEditRivenSlot] = useState<number | null>(null);

  const rivenStatChanges = useMemo(
    () => mergeRivenStatChanges(rivenStatsMap, equippedMods),
    [rivenStatsMap, equippedMods],
  );

  // Build the assembled weapon
  const assembledWeapon = useMemo<Weapon | null>(() => {
    if (modularType === "kitgun" && kitgunChamber && kitgunGrip && kitgunLoader) {
      return buildKitgun(kitgunChamber, kitgunGrip, kitgunLoader);
    }
    if (modularType === "zaw" && zawStrike && zawGripSel && zawLinkSel) {
      return buildZaw(zawStrike, zawGripSel, zawLinkSel);
    }
    if (modularType === "amp" && ampPrism) {
      return {
        ...ampPrism,
        name: `${ampPrism.name}${ampScaffold ? ` / ${ampScaffold.name}` : ""}${ampBrace ? ` / ${ampBrace.name}` : ""}`,
        arcaneSlots: 2,
        arcaneType: "amp",
      };
    }
    return null;
  }, [modularType, kitgunChamber, kitgunGrip, kitgunLoader, zawStrike, zawGripSel, zawLinkSel, ampPrism, ampScaffold, ampBrace]);

  const rivenLibraryState = useSavedRivenLibrary(assembledWeapon?.id);
  const savedRivens = rivenLibraryState.list;
  const refreshSavedRivens = rivenLibraryState.refresh;
  const rivenLibrary = useMemo(
    () => ({
      signedIn: rivenLibraryState.signedIn,
      onSave: async (r: { name: string; modId: string; stats: Record<string, number>; polarity: string; drain: number; id?: string }) => {
        if (!assembledWeapon) return false;
        const ok = await saveBuilderRivenToLibrary(assembledWeapon, r);
        if (ok) refreshSavedRivens();
        return ok;
      },
    }),
    [rivenLibraryState.signedIn, assembledWeapon, refreshSavedRivens],
  );

  const editRivenTarget = useMemo(() => {
    if (editRivenSlot == null || !modPickerOpen) return null;
    const eq = equippedMods.find((m) => m.slotIndex === editRivenSlot);
    const mod = eq ? modsMap.get(eq.modId) : undefined;
    if (!eq || !mod || !isRivenSlotModId(eq.modId)) return null;
    return {
      mod,
      stats: rivenStatsMap[editRivenSlot] ?? {},
      polarity: eq.polarity,
      drain: rivenDrainFromRank(eq.rank),
      name: eq.modName && eq.modName !== mod.name ? eq.modName : undefined,
      libraryId: eq.rivenId,
    };
  }, [editRivenSlot, modPickerOpen, equippedMods, modsMap, rivenStatsMap]);

  const handleSelectRiven = useCallback((mod: Mod, stats: Record<string, number>, meta?: RivenSelectMeta) => {
    setEquippedMods((prev) => {
      const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
      return [
        ...filtered,
        {
          modId: mod.id,
          modName: meta?.name ?? mod.name,
          rank: meta ? rivenRankFromDrain(meta.drain) : mod.maxRank,
          slotIndex: activeSlotIndex,
          polarity: meta?.polarity ?? mod.polarity,
          drain: mod.drain,
          ...(meta?.id ? { rivenId: meta.id } : {}),
        },
      ];
    });
    setRivenStatsMap((prev) => ({ ...prev, [activeSlotIndex]: stats }));
    setModPickerOpen(false);
    setEditRivenSlot(null);
  }, [activeSlotIndex]);

  const modCategory = useMemo(() => {
    if (!assembledWeapon) return "primary";
    if (assembledWeapon.category === "melee") return "melee";
    if (assembledWeapon.category === "secondary") return "secondary";
    return "primary";
  }, [assembledWeapon]);

  const isSecondaryKitgun = assembledWeapon?.category === "secondary" && modularType === "kitgun";
  const totalModSlots =
    assembledWeapon && assembledWeapon.modSlots > 0
      ? assembledWeapon.modSlots + (isSecondaryKitgun ? 1 : 0)
      : 0;

  const arcaneConfig: WeaponArcaneConfig = assembledWeapon ? getWeaponArcanes(assembledWeapon) : { slots: 0, arcanes: [], label: "" };

  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const capacity = hasOrokinCatalyst ? 60 : 30;
  const capacityUsed = useMemo(() => {
    return equippedMods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = slotPolarities[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [equippedMods, slotPolarities, modsMap]);

  const { savedBuilds, refreshSavedBuilds, deleteSavedBuild } = useBuilderSavedBuilds("modular");
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  // Load build from ?build= share link (e.g. from /build/[id] page)
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
        if (shared.type !== "modular" || !shared.modularType || !shared.parts) return;
        const mt = shared.modularType as ModularType;
        setModularType(mt);
        if (mt === "kitgun") {
          setKitgunChamber(kitgunChambers.find((c) => c.id === shared.parts!.chamber) ?? null);
          setKitgunGrip(kitgunGrips.find((g) => g.id === shared.parts!.grip) ?? null);
          setKitgunLoader(kitgunLoaders.find((l) => l.id === shared.parts!.loader) ?? null);
        } else if (mt === "zaw") {
          setZawStrike(zawStrikes.find((s) => s.id === shared.parts!.strike) ?? null);
          setZawGripSel(zawGrips.find((g) => g.id === shared.parts!.grip) ?? null);
          setZawLinkSel(zawLinks.find((l) => l.id === shared.parts!.link) ?? null);
        } else {
          setAmpPrism(ampPrisms.find((p) => p.id === shared.parts!.prism) ?? null);
          setAmpScaffold(ampScaffolds.find((s) => s.id === shared.parts!.scaffold) ?? null);
          setAmpBrace(ampBraces.find((b) => b.id === shared.parts!.brace) ?? null);
        }
        setEquippedMods(
          cleanLoadedMods(shared.mods.map((m, idx) => {
            const mod = modsMap.get(m.id);
            return {
              modId: m.id,
              modName: mod?.name ?? "",
              rank: m.rank,
              slotIndex: m.slotIndex ?? idx,
              polarity: mod?.polarity,
              drain: mod?.drain,
            };
          }))
        );
        setRivenStatsMap({});
        setHasOrokinCatalyst(shared.hasOrokinCatalyst ?? false);
        if (shared.arcanes?.length) {
          const resolved = shared.arcanes.map((id) => (id ? resolveArcaneById(id) : null));
          setEquippedArcanes(resolved);
          setEquippedArcaneRanks([0, 1].map((i) => shared.arcaneRanks?.[i] ?? resolved[i]?.maxRank ?? 5));
        } else {
          setEquippedArcanes([null, null]);
          setEquippedArcaneRanks([5, 5]);
        }
        const pol: Record<number, string> = {};
        if (shared.slotPolarities) {
          for (const [k, v] of Object.entries(shared.slotPolarities)) {
            pol[Number(k)] = v;
          }
        }
        setSlotPolarities(pol);
        // ?build= stays in the URL (shareable, survives refresh). Runs once on mount.
        toast.info("Build loaded from link", { description: "Modular configuration applied" });
      })();
    });
    return () => {
      cancelled = true;
    };
  }, [modsMap]);


  const buildModularData = useCallback((): ModularBuildData => {
    const parts: Record<string, string> = {};
    if (modularType === "kitgun") {
      if (kitgunChamber) parts.chamber = kitgunChamber.id;
      if (kitgunGrip) parts.grip = kitgunGrip.id;
      if (kitgunLoader) parts.loader = kitgunLoader.id;
    } else if (modularType === "zaw") {
      if (zawStrike) parts.strike = zawStrike.id;
      if (zawGripSel) parts.grip = zawGripSel.id;
      if (zawLinkSel) parts.link = zawLinkSel.id;
    } else {
      if (ampPrism) parts.prism = ampPrism.id;
      if (ampScaffold) parts.scaffold = ampScaffold.id;
      if (ampBrace) parts.brace = ampBrace.id;
    }
    return {
      modularType,
      parts,
      mods: equippedMods.map((m) => {
        const riven = isRivenSlotModId(m.modId) ? rivenStatsMap[m.slotIndex] : undefined;
        if (!riven) return { modId: m.modId, rank: m.rank, slotIndex: m.slotIndex };
        return {
          modId: m.modId,
          rank: m.rank,
          slotIndex: m.slotIndex,
          rivenStats: riven,
          ...(m.polarity ? { rivenPolarity: m.polarity } : {}),
          rivenDrain: rivenDrainFromRank(m.rank),
        };
      }),
      arcaneIds: equippedArcanes.map((a) => a?.id ?? null),
      arcaneRanks: [...equippedArcaneRanks],
      hasOrokinCatalyst,
      isMR30: false,
      slotPolarities,
    };
  }, [
    modularType,
    kitgunChamber,
    kitgunGrip,
    kitgunLoader,
    zawStrike,
    zawGripSel,
    zawLinkSel,
    ampPrism,
    ampScaffold,
    ampBrace,
    equippedMods,
    rivenStatsMap,
    equippedArcanes,
    equippedArcaneRanks,
    hasOrokinCatalyst,
    slotPolarities,
  ]);

  const liveCompare = useMemo(() => {
    if (!assembledWeapon) return null;
    return snapshotFromBuild("modular", buildName || assembledWeapon.name, buildModularData());
  }, [assembledWeapon, buildName, buildModularData]);

  const { dirty: hasUnsavedChanges, markClean } = useUnsavedChanges(assembledWeapon ? stableBuildSnapshot(buildModularData()) : null);

  const handleSaveBuildConfirm = async ({ name, isPublic, asNew = false }: SaveBuildDialogValues & { asNew?: boolean }) => {
    const data = buildModularData();
    const build: SavedBuild = {
      id: saveIdentityId(currentBuildId, asNew),
      name,
      isPublic,
      type: "modular",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data,
    };
    const result = await persistSavedBuild(build);
    setSaveAsNew(false);
    setCurrentBuildId(result.id);
    setBuildName(name);
    setBuildIsPublic(result.isPublic);
    void refreshSavedBuilds();
    markClean();
    if (result.synced) {
      toast.success(asNew || !currentBuildId ? "Saved as new build" : "Build updated", { description: `${name} saved to your account` });
    } else {
      toast.success(asNew || !currentBuildId ? "Saved as new build" : "Build updated on this device", { description: currentBuildId && !asNew ? "Log in to sync builds to your account" : "Saved on this device. Log in to sync builds to your account." });
    }
  };

  const handleLoadBuild = useCallback((rawBuild: SavedBuild, options?: { silent?: boolean }) => {
    markClean();
    const build = cleanLoadedBuild(rawBuild);
    const d = build.data as ModularBuildData;
    setModularType(d.modularType as ModularType);
    if (d.modularType === "kitgun") {
      setKitgunChamber(kitgunChambers.find((c) => c.id === d.parts.chamber) ?? null);
      setKitgunGrip(kitgunGrips.find((g) => g.id === d.parts.grip) ?? null);
      setKitgunLoader(kitgunLoaders.find((l) => l.id === d.parts.loader) ?? null);
    } else if (d.modularType === "zaw") {
      setZawStrike(zawStrikes.find((s: ZawStrike) => s.id === d.parts.strike) ?? null);
      setZawGripSel(zawGrips.find((g) => g.id === d.parts.grip) ?? null);
      setZawLinkSel(zawLinks.find((l) => l.id === d.parts.link) ?? null);
    } else {
      setAmpPrism(ampPrisms.find((p) => p.id === d.parts.prism) ?? null);
      setAmpScaffold(ampScaffolds.find((s) => s.id === d.parts.scaffold) ?? null);
      setAmpBrace(ampBraces.find((b) => b.id === d.parts.brace) ?? null);
    }
    const nextRivenMap: Record<number, Record<string, number>> = {};
    setEquippedMods(d.mods.map((m) => {
      const mod = modsMap.get(m.modId);
      const isRiven = isRivenSlotModId(m.modId);
      const rank = isRiven && !m.rank && typeof m.rivenDrain === "number" ? rivenRankFromDrain(m.rivenDrain) : m.rank;
      if (isRiven && m.rivenStats) {
        nextRivenMap[m.slotIndex] = m.rivenStats;
      }
      return {
        ...m,
        rank,
        modName: (isRiven && m.rivenName) || mod?.name || "",
        polarity: isRiven && m.rivenPolarity ? m.rivenPolarity : mod?.polarity,
        drain: mod?.drain,
      };
    }));
    setRivenStatsMap(nextRivenMap);
    setHasOrokinCatalyst(d.hasOrokinCatalyst);
    setSlotPolarities(d.slotPolarities || {});
    const aid = d.arcaneIds ?? [];
    const loadedArcanes = [
      aid[0] ? resolveArcaneById(aid[0]) : null,
      aid[1] ? resolveArcaneById(aid[1]) : null,
    ];
    setEquippedArcanes(loadedArcanes);
    setEquippedArcaneRanks([
      d.arcaneRanks?.[0] ?? loadedArcanes[0]?.maxRank ?? 5,
      d.arcaneRanks?.[1] ?? loadedArcanes[1]?.maxRank ?? 5,
    ]);
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildIsPublic(build.isPublic ?? false);
    setShowSavedBuilds(false);
    if (!options?.silent) toast.info("Build loaded", { description: build.name });
  }, [markClean, modsMap, setShowSavedBuilds]);

  useCloudBuildFromUrl("modular", handleLoadBuild);
  const { context: loadoutCtx, clearContext: clearLoadoutCtx, restoreContext: restoreLoadoutCtx } = useLoadoutSlotFromUrl("modular", handleLoadBuild);
  const searchParams = useSearchParams();

  // Per-tab draft of the open kitgun/zaw: Riven Library "Equip" adds its riven to this build.
  useEffect(() => {
    if (modularType === "amp") return;
    const partId = modularType === "kitgun" ? kitgunChamber?.id : zawStrike?.id;
    if (!partId) return;
    const data = buildModularData();
    saveBuilderDraft<ModularBuildData>("modular", {
      itemId: partId,
      buildId: currentBuildId,
      name: buildName,
      description: "",
      isPublic: buildIsPublic,
      tags: [],
      createdAt: null,
      data,
      ...loadoutFieldsForDraft(loadoutCtx),
    });
  }, [modularType, kitgunChamber, zawStrike, buildModularData, currentBuildId, buildName, buildIsPublic, loadoutCtx]);

  const modularEquipSeenRef = useRef<string | null>(null);
  useEffect(() => {
    if (allMods.length === 0) return;
    const params = new URLSearchParams(searchParams.toString());
    if (hasBuildLinkParam(params)) return;
    const typeParam = params.get("type")?.toLowerCase();
    const partParam = params.get("part")?.trim();
    const rivenParam = params.get("riven");
    const paramKey = `${typeParam ?? ""}|${partParam ?? ""}|${rivenParam ?? ""}`;
    if (!typeParam && !partParam) return;
    if (paramKey === modularEquipSeenRef.current) return;
    modularEquipSeenRef.current = paramKey;

    const matchesChamber = (c: KitgunChamber, p: string) => {
      const slug = c.id.replace(/_chamber$/, "");
      return p === c.id || p === slug || p.includes(c.id) || p.includes(`kitgun_${slug}`);
    };
    const matchesStrike = (s: ZawStrike, p: string) => {
      const slug = s.id.replace(/^zaw_/, "");
      return p === s.id || p === slug || p.includes(s.id) || p.includes(`zaw_${slug}`);
    };

    const stripEquip = (type: string, part: string) => {
      const clean = stripRivenEquipParams(window.location.pathname + window.location.search + window.location.hash);
      modularEquipSeenRef.current = `${type}|${part}|`;
      const url = new URL(clean, "http://x");
      url.searchParams.set("type", type);
      if (part) url.searchParams.set("part", part);
      const qs = url.searchParams.toString();
      window.history.replaceState(window.history.state, "", `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`);
    };

    const equip = rivenParam ? parseRivenEquip(params) : null;

    if (typeParam === "amp") {
      if (equip) {
        toast.error("Amps cannot use Rivens.");
        stripEquip("amp", partParam ?? "");
      }
      return;
    }

    const isKitgun = typeParam === "kitgun" || (!typeParam && !!partParam && kitgunChambers.some((c) => matchesChamber(c, partParam)));
    const isZaw = typeParam === "zaw" || (!typeParam && !!partParam && zawStrikes.some((s) => matchesStrike(s, partParam)));

    const chamber = isKitgun
      ? ((partParam
          ? [...kitgunChambers].sort((a, b) => b.id.length - a.id.length).find((c) => matchesChamber(c, partParam))
          : undefined) ?? kitgunChambers[0] ?? null)
      : null;
    const strike = isZaw
      ? ((partParam
          ? [...zawStrikes].sort((a, b) => b.id.length - a.id.length).find((s) => matchesStrike(s, partParam))
          : undefined) ?? zawStrikes[0] ?? null)
      : null;

    const target = isKitgun && chamber
      ? { kind: "kitgun" as const, id: chamber.id, name: chamber.name, catalog: { name: chamber.name, category: "kitgun_chamber", id: chamber.id }, rivenModId: "kitgun_riven_mod" }
      : isZaw && strike
        ? { kind: "zaw" as const, id: strike.id, name: strike.name, catalog: { name: strike.name, category: "zaw_strike", id: strike.id }, rivenModId: "zaw_riven_mod" }
        : null;
    if (!target) return;

    const startFreshParts = () => {
      if (target.kind === "kitgun") {
        setModularType("kitgun");
        setKitgunChamber(chamber);
        setKitgunGrip((prev) => prev ?? kitgunGrips.find((g) => g.id.includes("haymaker")) ?? kitgunGrips[0] ?? null);
        setKitgunLoader((prev) => prev ?? kitgunLoaders.find((l) => l.id.includes("splat")) ?? kitgunLoaders[0] ?? null);
      } else {
        setModularType("zaw");
        setZawStrike(strike);
        setZawGripSel((prev) => prev ?? zawGrips.find((g) => g.id.includes("peye")) ?? zawGrips[0] ?? null);
        setZawLinkSel((prev) => prev ?? zawLinks.find((l) => l.id.includes("vargeet_2_jai")) ?? zawLinks[0] ?? null);
      }
    };

    const blocked = equip ? rivenCannotEquipReason(target.catalog, target.name) : null;
    if (equip && blocked) {
      toast.error(blocked);
      queueMicrotask(startFreshParts);
      stripEquip(target.kind, target.id);
      return;
    }

    if (equip) {
      const rivenMod = allMods.find((m) => m.id === target.rivenModId);
      if (!rivenMod) {
        queueMicrotask(startFreshParts);
        stripEquip(target.kind, target.id);
        return;
      }
      const draft = readBuilderDraft<ModularBuildData>("modular");
      const useDraft = draft && draftMatchesRivenWeapon(draft.itemId, target.id);
      const placed = placeLibraryRivenOnMods(
        useDraft ? (draft.data.mods || []) : [],
        { ...equip, modId: rivenMod.id, fallbackName: `${target.name} Riven`, catalogDrain: rivenMod.drain },
        RIVEN_REGULAR_SLOTS,
      );
      if (useDraft && draft) {
        const restored: SavedBuild = {
          id: draft.buildId || "",
          name: draft.name || `${target.name} Build`,
          description: draft.description || "",
          isPublic: draft.isPublic,
          tags: draft.tags,
          type: "modular",
          createdAt: draft.createdAt || Date.now(),
          updatedAt: Date.now(),
          data: { ...draft.data, mods: placed.mods },
        };
        queueMicrotask(() => {
          handleLoadBuild(restored, { silent: true });
          if (!draft.buildId) setCurrentBuildId(null);
          if (draft.loadout) {
            restoreLoadoutCtx({
              loadoutId: draft.loadout.loadoutId,
              loadoutName: draft.loadout.loadoutName,
              kind: "modular",
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
        stripEquip(target.kind, draft.itemId);
        return;
      }
      const stats: Record<number, Record<string, number>> = {};
      for (const m of placed.mods) if (m.rivenStats) stats[m.slotIndex] = m.rivenStats;
      queueMicrotask(() => {
        startFreshParts();
        setEquippedMods(placed.mods.map((m) => ({
          modId: m.modId,
          modName: m.rivenName || m.modId,
          rank: m.rank,
          slotIndex: m.slotIndex,
          polarity: m.rivenPolarity,
          drain: rivenMod.drain,
          ...(m.rivenId ? { rivenId: m.rivenId } : {}),
        })));
        setRivenStatsMap(stats);
        const label = equip.name || "Riven";
        toast.success(`Equipped ${label}`);
      });
      stripEquip(target.kind, target.id);
      return;
    }

    queueMicrotask(startFreshParts);
  }, [allMods, modsMap, searchParams, handleLoadBuild, restoreLoadoutCtx]);

  const loadoutLinkState = useMemo<{
    buffs: WeaponExternalBuff[];
    linkage?: SetBonusLinkage;
    warframeId?: string;
    companionModIds?: string[];
    warframeMaxEnergy?: number;
  }>(() => {
    const standaloneBuffs = () =>
      assembledWeapon != null ? resolveStandaloneExternalBuffs(assembledWeapon, simParams) : [];
    if (!loadoutCtx || !assembledWeapon) return { buffs: standaloneBuffs() };
    const loadout = getLoadouts().find((l) => l.id === loadoutCtx.loadoutId);
    if (!loadout) return { buffs: standaloneBuffs() };

    const baseLinkage = setBonusLinkageFromLoadout(loadout);
    const liveSlots = equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const linkage: SetBonusLinkage = {
      ...baseLinkage,
      ...(loadoutCtx.slot === "primary" ? { primaryMods: liveSlots } : {}),
      ...(loadoutCtx.slot === "secondary" ? { secondaryMods: liveSlots } : {}),
      ...(loadoutCtx.slot === "melee" ? { meleeMods: liveSlots } : {}),
    };

    const stats = calcLoadoutStats(loadout, { simParams });
    const wb = loadout.warframeBuild;
    const wf = wb?.warframeId ? allWarframes.find((w) => w.id === wb.warframeId) : undefined;
    const buffContext: WeaponBuffContext = {
      ...(wb?.warframeId && stats.warframe?.stats
        ? {
            warframeId: wb.warframeId,
            warframeStats: stats.warframe.stats,
            warframeAbilities: resolveAbilitiesWithHelminth(
              wf?.abilities,
              wb.helminthAbilityId,
              wb.helminthSlot,
              wb.warframeId,
            ),
            warframeModSlots: baseLinkage.warframeMods,
            warframeArcaneIds: wb.arcaneIds,
            warframeArcaneRanks: wb.arcaneRanks,
          }
        : {}),
      companionModSlots: baseLinkage.companionMods ?? [],
      companionWeaponCritChance: stats.companion?.weapon?.stats.criticalChance,
      allMods: modsMap,
    };

    return {
      buffs: resolveWeaponExternalBuffs(assembledWeapon, buffContext, simParams),
      linkage,
      warframeId: wb?.warframeId,
      companionModIds: (baseLinkage.companionMods ?? []).map((m) => m.modId),
      warframeMaxEnergy: stats.warframe?.stats.totalEnergy,
    };
  }, [loadoutCtx, assembledWeapon, equippedMods, simParams, allWarframes, modsMap]);

  const effectiveSimParams = useMemo<SimulationParams>(() => {
    if (loadoutLinkState.warframeMaxEnergy == null || simParams.warframeMaxEnergy != null) {
      return simParams;
    }
    return { ...simParams, warframeMaxEnergy: loadoutLinkState.warframeMaxEnergy };
  }, [simParams, loadoutLinkState.warframeMaxEnergy]);

  const activeArcaneState = useMemo(
    () => resolveActiveArcaneList(equippedArcanes, equippedArcaneRanks),
    [equippedArcanes, equippedArcaneRanks],
  );

  const modularCalcOptions = useMemo<WeaponCalculationOptions | undefined>(() => {
    const hasBuffs = loadoutLinkState.buffs.length > 0;
    const hasArcaneRanks = activeArcaneState.arcanes.length > 0;
    if (!hasBuffs && !hasArcaneRanks) return undefined;
    return {
      ...(hasBuffs ? { externalBuffs: loadoutLinkState.buffs } : {}),
      ...(hasArcaneRanks ? { arcaneRanks: activeArcaneState.arcaneRanks } : {}),
    };
  }, [loadoutLinkState.buffs, activeArcaneState]);

  const calculatedStats = useMemo(() => {
    if (!assembledWeapon) return null;
    const modSlots = equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const activeArcanes = activeArcaneState.arcanes;
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(assembledWeapon, modSlots, modsMap, activeArcanes, undefined, effectiveSimParams, modularCalcOptions, loadoutLinkState.linkage, rivenStatChanges);
    }
    return calculateWeaponBuild(assembledWeapon, modSlots, modsMap, undefined, effectiveSimParams, modularCalcOptions, loadoutLinkState.linkage, rivenStatChanges);
  }, [assembledWeapon, equippedMods, activeArcaneState.arcanes, effectiveSimParams, modularCalcOptions, loadoutLinkState.linkage, rivenStatChanges, modsMap]);

  const contributionContext = useMemo(() => {
    if (!assembledWeapon) return null;
    return {
      baseWeapon: assembledWeapon,
      modSlots: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
      arcanes: activeArcaneState.arcanes,
      simParams: effectiveSimParams,
      calcOptions: modularCalcOptions,
      linkage: loadoutLinkState.linkage,
      rivenStatChanges,
      warframeId: loadoutLinkState.warframeId,
      companionModIds: loadoutLinkState.companionModIds,
    };
  }, [assembledWeapon, equippedMods, activeArcaneState.arcanes, effectiveSimParams, modularCalcOptions, loadoutLinkState.linkage, rivenStatChanges, modsMap, loadoutLinkState.warframeId, loadoutLinkState.companionModIds]);

  const handleSaveDialog = async (values: SaveBuildDialogValues) => {
    if (values.target === "loadout" && loadoutCtx) {
      const data = buildModularData();
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
  };

  const handleDeleteBuild = (id: string) => {
    void deleteSavedBuild(id);
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  };

  const resetMods = () => {
    setEquippedMods([]);
    setRivenStatsMap({});
    setEquippedArcanes([null, null]);
    setEquippedArcaneRanks([5, 5]);
    setHasOrokinCatalyst(false);
    setSimParams({ ...DEFAULT_SIM_PARAMS });
    setCurrentBuildId(null);
    setBuildName("");
  };

  /**
   * Part edits keep the build (same saved build, mods, arcanes, Catalyst) and drop only what the
   * new weapon can't hold. Switching Kitgun / Zaw / Amp still starts fresh via resetMods().
   */
  type PartEdit = {
    chamber?: KitgunChamber; grip?: KitgunGrip; loader?: KitgunLoader;
    strike?: ZawStrike; zawGrip?: ZawGrip; link?: ZawLink;
    prism?: Weapon; scaffold?: AmpScaffold; brace?: AmpBrace;
  };
  const editPart = (edit: PartEdit) => {
    if (edit.chamber) setKitgunChamber(edit.chamber);
    if (edit.grip) setKitgunGrip(edit.grip);
    if (edit.loader) setKitgunLoader(edit.loader);
    if (edit.strike) setZawStrike(edit.strike);
    if (edit.zawGrip) setZawGripSel(edit.zawGrip);
    if (edit.link) setZawLinkSel(edit.link);
    if (edit.prism) setAmpPrism(edit.prism);
    if (edit.scaffold) setAmpScaffold(edit.scaffold);
    if (edit.brace) setAmpBrace(edit.brace);
    const next = weaponFromModularData({
      modularType,
      parts: modularType === "kitgun"
        ? { chamber: (edit.chamber ?? kitgunChamber)?.id ?? "", grip: (edit.grip ?? kitgunGrip)?.id ?? "", loader: (edit.loader ?? kitgunLoader)?.id ?? "" }
        : modularType === "zaw"
          ? { strike: (edit.strike ?? zawStrike)?.id ?? "", grip: (edit.zawGrip ?? zawGripSel)?.id ?? "", link: (edit.link ?? zawLinkSel)?.id ?? "" }
          : { prism: (edit.prism ?? ampPrism)?.id ?? "" },
      mods: [],
      hasOrokinCatalyst: false,
    });
    if (!next) return;
    const rivenWeaponChanged =
      (!!edit.chamber && !!kitgunChamber && edit.chamber.id !== kitgunChamber.id) ||
      (!!edit.strike && !!zawStrike && edit.strike.id !== zawStrike.id);
    const kept = keepLegalModularBuild({
      weapon: next,
      modularType,
      mods: equippedMods,
      rivenStats: rivenStatsMap,
      arcanes: equippedArcanes,
      arcaneRanks: equippedArcaneRanks,
      slotPolarities,
      modsMap,
      rivenWeaponChanged,
    });
    if (kept.dropped.length === 0) return;
    setEquippedMods(kept.mods);
    setRivenStatsMap(kept.rivenStats);
    setEquippedArcanes(kept.arcanes);
    setEquippedArcaneRanks(kept.arcaneRanks);
    setSlotPolarities(kept.slotPolarities);
    toast.info(`Removed ${kept.dropped.length === 1 ? "1 item" : `${kept.dropped.length} items`} the new part can't use`, {
      description: kept.dropped.join(", "),
    });
  };

  const applyRecommended = useCallback((parts: string[]) => {
    const [a, b, c] = parts;
    resetMods();
    if (modularType === "kitgun") {
      setKitgunChamber(kitgunChambers.find((p) => p.name === a) ?? null);
      setKitgunGrip(kitgunGrips.find((p) => p.name === b) ?? null);
      setKitgunLoader(kitgunLoaders.find((p) => p.name === c) ?? null);
      return;
    }
    if (modularType === "zaw") {
      setZawStrike(zawStrikes.find((p) => p.name === a) ?? null);
      setZawGripSel(zawGrips.find((p) => p.name === b) ?? null);
      setZawLinkSel(zawLinks.find((p) => p.name === c) ?? null);
      return;
    }
    setAmpPrism(ampPrisms.find((p) => p.name === a) ?? null);
    setAmpScaffold(ampScaffolds.find((p) => p.name === b) ?? null);
    setAmpBrace(ampBraces.find((p) => p.name === c) ?? null);
  }, [modularType]);

  const hasKitSummary = modularType === "kitgun"
    ? Boolean(kitgunChamber || kitgunGrip || kitgunLoader)
    : modularType === "zaw"
      ? Boolean(zawStrike || zawGripSel || zawLinkSel)
      : Boolean(ampPrism || ampScaffold || ampBrace);

  const openModSlot = (i: number) => {
    const isExilus = isSecondaryKitgun && i === SECONDARY_EXILUS_SLOT_INDEX;
    setActiveSlotIndex(i);
    setModPickerSlotType(isExilus ? "weapon_exilus_secondary" : "regular");
    setModPickerOpen(true);
  };

  return (
    <PageShell>
      <main className="container mx-auto px-4 pt-8 pb-24 lg:pb-8">
        <LoadoutEditBanner
          context={loadoutCtx}
          onDetach={clearLoadoutCtx}
          dirty={hasUnsavedChanges}
          onSaveToLoadout={() => handleSaveDialog({ name: buildName, description: "", isPublic: false, tags: [], target: "loadout" })}
        />
        {/* Round 55: back to /builds (same filter + scroll) or Your builds when signed in. */}
        <div className="mb-3 flex empty:hidden">
          <BuildsReturnLink />
        </div>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-xl sm:text-3xl font-bold">Modular Builder</h1>
          <div className="flex items-center gap-2">
            <BuilderSaveControls
              canUpdate={!!currentBuildId}
              dirty={hasUnsavedChanges}
              dirtyClass={SAVE_DIRTY_CLASS}
              dotClass={SAVE_DIRTY_DOT_CLASS}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-all hover:border-green-500/50 hover:text-green-700 dark:hover:text-green-400 lg:pointer-fine:min-h-9 sm:py-1.5"
              onUpdate={() => { void handleSaveBuildConfirm({ name: buildName || "Modular Build", description: "", isPublic: buildIsPublic, tags: [], target: "new", asNew: false }); }}
              onSaveNew={() => { setSaveAsNew(false); setSaveDialogOpen(true); }}
              onSaveAs={() => { setSaveAsNew(true); setSaveDialogOpen(true); }}
            />
            <button onClick={() => { void refreshSavedBuilds(); setShowSavedBuilds(true); }} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-all hover:border-blue-500/50 hover:text-blue-700 dark:hover:text-blue-400 lg:pointer-fine:min-h-9 sm:py-1.5" title="Load Build">
              <FolderOpen className="h-3.5 w-3.5" /> <span>Load</span>
            </button>
            <button
              onClick={() => setCompareOpen(true)}
              disabled={!assembledWeapon}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-all hover:border-teal-500/50 hover:text-teal-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:text-teal-400 lg:pointer-fine:min-h-9 sm:py-1.5"
              title={assembledWeapon ? "Compare this build to a saved or posted build" : "Finish the parts before comparing"}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> <span>Compare</span>
            </button>
          </div>
        </div>
        <p className="text-muted-foreground mb-6">Build custom Kitguns, Zaws, and Amps from parts</p>

        {/* Type selector */}
        <div className="flex gap-2 mb-6">
          {(Object.keys(typeLabels) as ModularType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setModularType(t);
                resetMods();
              }}
              className={cn(
                "inline-flex min-h-11 items-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-all lg:pointer-fine:min-h-9 sm:py-2",
                modularType === t
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-700 dark:text-cyan-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Wrench className="h-3.5 w-3.5 inline mr-1.5" />
              {typeLabels[t]}
            </button>
          ))}
        </div>

        {/* Sticky current-kit summary — sits under header safe-area; z above mod toolbars */}
        {hasKitSummary && (
          <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-30 mb-4 rounded-lg border border-cyan-500/30 bg-card/95 px-3 py-2 text-xs shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/90">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Current {typeLabels[modularType]}
            </p>
            <div className="flex gap-x-3 gap-y-1 overflow-x-auto overscroll-x-contain whitespace-nowrap text-muted-foreground [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:whitespace-normal">
              {modularType === "kitgun" && (
                <>
                  <span><span className="text-foreground/70">Chamber</span> {kitgunChamber?.name ?? "—"}</span>
                  <span><span className="text-foreground/70">Grip</span> {kitgunGrip?.name ?? "—"}</span>
                  <span><span className="text-foreground/70">Loader</span> {kitgunLoader?.name ?? "—"}</span>
                </>
              )}
              {modularType === "zaw" && (
                <>
                  <span><span className="text-foreground/70">Strike</span> {zawStrike?.name ?? "—"}</span>
                  <span><span className="text-foreground/70">Grip</span> {zawGripSel?.name ?? "—"}</span>
                  <span><span className="text-foreground/70">Link</span> {zawLinkSel?.name ?? "—"}</span>
                </>
              )}
              {modularType === "amp" && (
                <>
                  <span><span className="text-foreground/70">Prism</span> {ampPrism?.name ?? "—"}</span>
                  <span><span className="text-foreground/70">Scaffold</span> {ampScaffold?.name ?? "—"}</span>
                  <span><span className="text-foreground/70">Brace</span> {ampBrace?.name ?? "—"}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Part selection + Mod slots */}
          <div className="space-y-6">
            {/* KITGUN PARTS */}
            {modularType === "kitgun" && (
              <div className="space-y-4">
                <h2 className="section-title">Kitgun Parts</h2>

                {/* Chamber */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Chamber (Base weapon)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kitgunChambers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => editPart({ chamber: c })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          kitgunChamber?.id === c.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{c.name}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          {c.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grip */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Grip (Affects damage, fire rate, type)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kitgunGrips.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => editPart({ grip: g })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          kitgunGrip?.id === g.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{g.name}</span>
                        <span className={cn("ml-1.5 text-[10px]", g.type === "primary" ? "text-blue-700 dark:text-blue-400" : "text-green-700 dark:text-green-400")}>
                          {g.type}
                        </span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          {g.description}
                        </div>
                      </button>
                    ))}
                  </div>
                  {kitgunChamber && kitgunGrip && assembledWeapon && (
                    <p data-testid="kitgun-slot-summary" className="mt-2 text-xs text-muted-foreground">
                      The grip sets the slot: <span className="font-medium text-foreground">{kitgunGrip.type === "primary" ? "Primary" : "Secondary"}</span>
                      {" • "}
                      <span className="font-medium text-foreground">{kitgunWeaponClass(assembledWeapon)}</span> class
                      {" • "}
                      <span className="font-medium text-foreground">{assembledWeapon.triggerType}</span> trigger
                    </p>
                  )}
                </div>

                {/* Loader */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Loader (Affects crit, status, magazine)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kitgunLoaders.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => editPart({ loader: l })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          kitgunLoader?.id === l.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{l.name}</span>
                        <div
                          className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]"
                          title="CC = critical chance, CD = critical damage (critical multiplier), SC = status chance"
                        >
                          CC {l.critChanceBonus > 0 ? "+" : ""}{(l.critChanceBonus * 100).toFixed(0)}% •
                          CD {l.critMultiplierBonus > 0 ? "+" : ""}{l.critMultiplierBonus.toFixed(1)}x •
                          SC {l.statusChanceBonus > 0 ? "+" : ""}{(l.statusChanceBonus * 100).toFixed(0)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ZAW PARTS */}
            {modularType === "zaw" && (
              <div className="space-y-4">
                <h2 className="section-title">Zaw Parts</h2>

                {/* Strike */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Strike (Blade type)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {zawStrikes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => editPart({ strike: s })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          zawStrike?.id === s.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{s.name}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          {s.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grip */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Grip (1H or 2H, affects damage & speed)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {zawGrips.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => editPart({ zawGrip: g })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          zawGripSel?.id === g.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{g.name}</span>
                        <span className={cn("ml-1.5 text-[10px]", g.type === "1h" ? "text-green-700 dark:text-green-400" : "text-amber-800 dark:text-amber-400")}>{g.type}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          {g.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Link (Crit/Status balance)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {zawLinks.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => editPart({ link: l })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          zawLinkSel?.id === l.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium text-xs">{l.name}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          CC {l.critBonus > 0 ? "+" : ""}{(l.critBonus * 100).toFixed(0)}% •
                          SC {l.statusBonus > 0 ? "+" : ""}{(l.statusBonus * 100).toFixed(0)}% •
                          DMG {l.damageBonus > 0 ? "+" : ""}{l.damageBonus}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AMP PARTS */}
            {modularType === "amp" && (
              <div className="space-y-4">
                <h2 className="section-title">Amp Parts</h2>

                {/* Prism */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Prism (Primary fire)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ampPrisms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => editPart({ prism: p })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          ampPrism?.id === p.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{p.name}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          DMG {p.damage} • {p.triggerType} • CC {(p.criticalChance * 100).toFixed(0)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scaffold */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Scaffold (Alt fire)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ampScaffolds.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => editPart({ scaffold: s })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          ampScaffold?.id === s.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{s.name}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          DMG {s.damage} • {s.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brace */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Brace (Energy pool)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ampBraces.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => editPart({ brace: b })}
                        className={cn(
                          "min-h-11 rounded-lg border p-2.5 text-left text-sm transition-all",
                          ampBrace?.id === b.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{b.name}</span>
                        <div className="text-xs lg:text-[10px] text-muted-foreground mt-0.5 [overflow-wrap:anywhere]">
                          {b.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommended builds */}
            {!assembledWeapon && (
              <div className="space-y-3">
                <h2 className="section-title">Recommended Builds</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedBuilds.filter((b) => b.type === modularType).map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyRecommended(b.parts)}
                      className="p-3 rounded-lg border border-border hover:border-cyan-500/30 transition-all text-left"
                    >
                      <div className="font-medium text-sm">{b.name}</div>
                      <div className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono mt-0.5">{b.parts.join(" + ")}</div>
                      <div className="text-xs lg:text-[10px] text-muted-foreground mt-1 [overflow-wrap:anywhere]">{b.description}</div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {b.tags.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assembled weapon + Mod slots */}
            {assembledWeapon && (
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
                  <h2 className="text-lg font-bold">{assembledWeapon.name}</h2>
                  <span className="text-sm text-muted-foreground capitalize">{assembledWeapon.category}</span>
                  {modularType !== "amp" && totalModSlots > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => setHasOrokinCatalyst(!hasOrokinCatalyst)}
                        title="Orokin Catalyst — doubles mod capacity"
                        aria-pressed={hasOrokinCatalyst}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-all lg:pointer-fine:min-h-9 sm:py-1.5",
                          hasOrokinCatalyst
                            ? "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-400"
                            : "border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Catalyst
                      </button>
                    </div>
                  )}
                </div>

                {totalModSlots > 0 && (
                  <div id="build-mods" className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)]">
                    <div className={cn(
                      "sticky z-20 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/85 lg:static lg:z-auto lg:mb-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
                      hasKitSummary
                        ? "top-[calc(3.5rem+env(safe-area-inset-top,0px)+4.25rem)]"
                        : "top-[calc(3.5rem+env(safe-area-inset-top,0px))]",
                    )}>
                      <h3 className="min-w-0 truncate section-title">Mod Configuration</h3>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-mono tabular-nums",
                        capacityUsed > capacity ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                      )}>
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">Capacity</span>
                        {capacityUsed} / {capacity}
                      </span>
                      <MobileStatSummary items={weaponStatSummary(calculatedStats)} />
                    </div>
                    {isSecondaryKitgun && (
                      <p className="mb-2 text-[11px] leading-snug text-muted-foreground">
                        Last slot is <span className="font-medium text-foreground/80">Exilus</span> for secondary kitguns.
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                      {Array.from({ length: totalModSlots }, (_, i) => {
                        const equipped = equippedMods.find((m) => m.slotIndex === i);
                        const mod = withRivenRoll(equipped, equipped ? modsMap.get(equipped.modId) ?? null : null);
                        const isExilus = isSecondaryKitgun && i === SECONDARY_EXILUS_SLOT_INDEX;
                        return (
                          <ModSlotCard
                            key={i}
                            mod={mod}
                            rank={equipped?.rank ?? 0}
                            slotIndex={i}
                            label={isExilus ? "Exilus" : undefined}
                            slotPolarity={slotPolarities[i]}
                            rivenStats={rivenStatsMap[i]}
                            weaponCategory={assembledWeapon.category}
                            equippedModIds={equippedMods.map((m) => m.modId)}
                            onAdd={() => openModSlot(i)}
                            onRemove={() => {
                              setEquippedMods((prev) => prev.filter((m) => m.slotIndex !== i));
                              setRivenStatsMap((prev) => { const next = { ...prev }; delete next[i]; return next; });
                            }}
                            onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; })}
                            onEditRiven={() => { openModSlot(i); setEditRivenSlot(i); }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {arcaneConfig.slots > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Gem className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                      Arcanes
                    </h3>
                    <div className={cn("grid gap-2", arcaneConfig.slots === 2 ? "grid-cols-2" : "grid-cols-1")}>
                      {Array.from({ length: arcaneConfig.slots }).map((_, i) => (
                        <ArcaneSlotCard
                          key={i}
                          arcane={equippedArcanes[i]}
                          rank={equippedArcaneRanks[i] ?? equippedArcanes[i]?.maxRank ?? 0}
                          label={arcaneSlotLabel(arcaneConfig, i)}
                          onAdd={() => { setActiveArcaneSlot(i); setArcanePickerOpen(true); }}
                          onRemove={() => setEquippedArcanes((prev) => { const next = [...prev]; next[i] = null; return next; })}
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
                )}
              </div>
            )}
          </div>

          {/* Right: Stats panel */}
          <div>
            <div id="build-stats" className="scroll-mt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] border border-border rounded-xl bg-card p-4 sm:p-6 lg:sticky lg:top-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)] lg:self-start lg:max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px)-1.5rem)] lg:overflow-y-auto lg:overscroll-contain">
              <h2 className="section-title mb-4">
                {assembledWeapon ? "Weapon Stats" : "Select All Parts"}
              </h2>
              {assembledWeapon && calculatedStats ? (
                <WeaponStatsPanel
                  stats={calculatedStats}
                  weapon={assembledWeapon}
                  isMelee={assembledWeapon.category === "melee"}
                  simParams={effectiveSimParams}
                  onSimParamsChange={setSimParams}
                  contributionContext={contributionContext}
                />
              ) : (
                <div className="space-y-2 text-sm text-muted-foreground">
                  {modularType === "kitgun" && (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", kitgunChamber ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={kitgunChamber ? "text-foreground" : ""}>
                          {kitgunChamber ? kitgunChamber.name : "Select Chamber"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", kitgunGrip ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={kitgunGrip ? "text-foreground" : ""}>
                          {kitgunGrip ? kitgunGrip.name : "Select Grip"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", kitgunLoader ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={kitgunLoader ? "text-foreground" : ""}>
                          {kitgunLoader ? kitgunLoader.name : "Select Loader"}
                        </span>
                      </div>
                    </>
                  )}
                  {modularType === "zaw" && (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", zawStrike ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={zawStrike ? "text-foreground" : ""}>
                          {zawStrike ? zawStrike.name : "Select Strike"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", zawGripSel ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={zawGripSel ? "text-foreground" : ""}>
                          {zawGripSel ? zawGripSel.name : "Select Grip"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", zawLinkSel ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={zawLinkSel ? "text-foreground" : ""}>
                          {zawLinkSel ? zawLinkSel.name : "Select Link"}
                        </span>
                      </div>
                    </>
                  )}
                  {modularType === "amp" && (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", ampPrism ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={ampPrism ? "text-foreground" : ""}>
                          {ampPrism ? ampPrism.name : "Select Prism"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", ampScaffold ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={ampScaffold ? "text-foreground" : ""}>
                          {ampScaffold ? ampScaffold.name : "Select Scaffold"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", ampBrace ? "text-green-700 dark:text-green-400" : "")} />
                        <span className={ampBrace ? "text-foreground" : ""}>
                          {ampBrace ? ampBrace.name : "Select Brace"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Amp scaffold stats */}
              {modularType === "amp" && ampScaffold && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">ALT FIRE ({ampScaffold.name})</h4>
                  <div className="space-y-0.5">
                    <StatDelta label="Damage" value={ampScaffold.damage} />
                    <StatDelta label="Fire Rate" value={ampScaffold.fireRate} suffix="/s" />
                    <StatDelta label="Crit Chance" value={+(ampScaffold.criticalChance * 100).toFixed(0)} suffix="%" />
                    <StatDelta label="Crit Multi" value={ampScaffold.criticalMultiplier} suffix="x" />
                    <StatDelta label="Status" value={+(ampScaffold.statusChance * 100).toFixed(0)} suffix="%" />
                  </div>
                  {ampScaffold.attacks && ampScaffold.attacks.length > 1 && (
                    <div className="mt-2 space-y-0.5" data-testid="amp-scaffold-parts">
                      {ampScaffold.attacks.map((a) => (
                        <div key={a.name} className="flex justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">
                            {a.name}
                            {a.multishot && a.multishot > 1 ? ` ×${a.multishot}` : ""}
                            {a.radius ? ` (${a.radius}m)` : ""}
                          </span>
                          <span className="text-foreground/80">
                            {a.damage} {a.damageType} · {+(a.statusChance * 100).toFixed(0)}% SC
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-muted-foreground">Status procs / shot</span>
                        <span className="text-foreground/80">{+ampScaffoldProcsPerTrigger(ampScaffold).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs py-0.5">
                        <span className="text-muted-foreground">Damage at blast edge</span>
                        <span className="text-foreground/80">{Math.round(ampScaffoldEdgeDamage(ampScaffold))}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mod Picker */}
      {assembledWeapon && (
        <ModPicker
          open={modPickerOpen}
          onClose={() => { setModPickerOpen(false); setEditRivenSlot(null); }}
          mods={allMods}
          category={modCategory}
          editRiven={editRivenTarget}
          savedRivens={savedRivens}
          rivenLibrary={rivenLibrary}
          slotType={modPickerSlotType}
          weaponCategory={assembledWeapon.category}
          weapon={assembledWeapon}
          equippedModIds={equippedMods.map((m) => m.modId)}
          activeSlotModId={equippedMods.find((m) => m.slotIndex === activeSlotIndex)?.modId}
          slotNav={buildSlotNav(Array.from({ length: totalModSlots }, (_, i) => i), activeSlotIndex, openModSlot)}
          onSelect={(mod, rank) => {
            setEquippedMods((prev) => {
              const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
              return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: activeSlotIndex, polarity: mod.polarity, drain: mod.drain }];
            });
            setRivenStatsMap((prev) => { const next = { ...prev }; delete next[activeSlotIndex]; return next; });
          }}
          onSelectRiven={handleSelectRiven}
        />
      )}

      {assembledWeapon && arcaneConfig.slots > 0 && (
        <ArcanePicker
          open={arcanePickerOpen}
          onOpenChange={setArcanePickerOpen}
          arcanes={arcanesForSlot(arcaneConfig, activeArcaneSlot)}
          equippedArcaneIds={equippedArcanes
            .map((a, idx) => (idx === activeArcaneSlot ? null : a?.id))
            .filter((id): id is string => Boolean(id))}
          initialRank={
            equippedArcanes[activeArcaneSlot]
              ? (equippedArcaneRanks[activeArcaneSlot] ?? equippedArcanes[activeArcaneSlot]!.maxRank)
              : undefined
          }
          onSelect={(arcane, rank) => {
            setEquippedArcanes((prev) => {
              const next = [...prev];
              next[activeArcaneSlot] = arcane;
              return next;
            });
            setEquippedArcaneRanks((prev) => {
              const next = [...prev];
              next[activeArcaneSlot] = rank ?? arcane.maxRank;
              return next;
            });
            setArcanePickerOpen(false);
          }}
          title={`Select ${arcaneSlotLabel(arcaneConfig, activeArcaneSlot)}`}
        />
      )}

      <SavedBuildsDialog
        open={showSavedBuilds}
        onOpenChange={setShowSavedBuilds}
        title="Saved Modular Builds"
        builds={savedBuilds}
        accent="cyan"
        getSubtitle={(build) => {
          const d = build.data as ModularBuildData;
          return `${d.modularType} • ${d.mods?.length ?? 0} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      {assembledWeapon && (
        <BuildCompareDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          type="modular"
          itemId={extractBuildItemId("modular", buildModularData())}
          live={liveCompare}
        />
      )}

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || `${modularType} Build`}
        defaultIsPublic={buildIsPublic}
        showDescription={false}
        onSave={handleSaveDialog}
        loadoutTarget={loadoutCtx ? { loadoutName: loadoutCtx.loadoutName, slotLabel: loadoutSlotLabel(loadoutCtx.slot) } : null}
      />
      <BuilderSectionNav sections={[{ id: "build-mods", label: "Mods" }, { id: "build-stats", label: "Stats" }]} />
    </PageShell>
  );
}
