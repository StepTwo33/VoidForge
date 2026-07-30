"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageShell } from "@/components/page-shell";
import { ModSlotCard } from "@/components/mod-slot";
import { WeaponStatsPanel } from "@/components/stats-panel";
import { ModPicker } from "@/components/mod-picker";
import { useMods, useArcanes, useWeapons } from "@/lib/weapons/use-data";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { modSlotCapacityCost, modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { Weapon, Mod, EquippedMod, SimulationParams, DEFAULT_SIM_PARAMS, ModularBuildData } from "@/lib/types";
import { getWeaponArcanes } from "@/lib/weapons/weapon-arcane-config";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import type { SlotType } from "@/components/mod-picker";
import { Zap, Star, Wrench, ChevronRight, Save, FolderOpen, Gem } from "lucide-react";
import { getSavedBuilds, deleteBuild, generateBuildId, SavedBuild, persistSavedBuild } from "@/lib/builds/build-storage";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { toast } from "sonner";
import {
  kitgunChambers, kitgunGrips, kitgunLoaders, buildKitgun,
  zawStrikes, zawGrips, zawLinks, buildZaw,
  ampPrisms, ampScaffolds, ampBraces,
  recommendedBuilds,
  KitgunChamber, KitgunGrip, KitgunLoader, ZawStrike, ZawGrip, ZawLink, AmpScaffold, AmpBrace,
} from "@/data/modular-weapons";
import { cn } from "@/lib/utils";
import { extractBuildFromUrlAsync } from "@/lib/builds/build-url";
import { resolveArcaneById } from "@/lib/builds/build-storage";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";

type ModularType = "kitgun" | "zaw" | "amp";

const SECONDARY_EXILUS_SLOT_INDEX = 8;

const typeLabels: Record<ModularType, string> = {
  kitgun: "Kitgun",
  zaw: "Zaw",
  amp: "Amp",
};

function StatDelta({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const color = value > 0 ? "text-green-400" : value < 0 ? "text-red-400" : "text-muted-foreground";
  return (
    <div className="flex justify-between text-xs py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={color}>{value > 0 ? "+" : ""}{value}{suffix}</span>
    </div>
  );
}

export default function ModularBuilderPage() {
  const { mods: allMods, modsMap } = useMods();
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
  const [arcanePickerOpen, setArcanePickerOpen] = useState(false);
  const [activeArcaneSlot, setActiveArcaneSlot] = useState(0);
  const [hasOrokinCatalyst, setHasOrokinCatalyst] = useState(false);
  const [isMR30, setIsMR30] = useState(false);
  const [simParams, setSimParams] = useState<SimulationParams>(() => ({ ...DEFAULT_SIM_PARAMS }));

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

  const calculatedStats = useMemo(() => {
    if (!assembledWeapon) return null;
    const modSlots = equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    const activeArcanes = equippedArcanes.filter((a): a is Mod => a !== null);
    if (activeArcanes.length > 0) {
      return calculateWeaponBuildWithArcanes(assembledWeapon, modSlots, modsMap, activeArcanes, undefined, simParams);
    }
    return calculateWeaponBuild(assembledWeapon, modSlots, modsMap, undefined, simParams);
  }, [assembledWeapon, equippedMods, equippedArcanes, simParams]);

  const contributionContext = useMemo(() => {
    if (!assembledWeapon) return null;
    return {
      baseWeapon: assembledWeapon,
      modSlots: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      allMods: modsMap,
      arcanes: equippedArcanes.filter((a): a is Mod => a !== null),
      simParams,
    };
  }, [assembledWeapon, equippedMods, equippedArcanes, simParams, modsMap]);

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

  const arcaneConfig = assembledWeapon ? getWeaponArcanes(assembledWeapon) : { slots: 0, arcanes: [], label: "" };

  const [slotPolarities, setSlotPolarities] = useState<Record<number, string>>({});
  const capacity = (hasOrokinCatalyst ? 60 : 30) + (isMR30 ? 10 : 0);
  const capacityUsed = useMemo(() => {
    return equippedMods.reduce((sum, m) => {
      const mod = modsMap.get(m.modId);
      if (!mod) return sum;
      const baseDrain = modCapacityAtRank(mod.drain, m.rank);
      const slotPol = slotPolarities[m.slotIndex];
      return sum + modSlotCapacityCost(baseDrain, slotPol, mod.polarity);
    }, 0);
  }, [equippedMods, slotPolarities]);

  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>(() => getSavedBuilds("modular"));
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [buildName, setBuildName] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Load build from ?build= share link (e.g. from /build/[id] page)
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        const params = new URLSearchParams(window.location.search);
        const shared = await extractBuildFromUrlAsync(params);
        if (cancelled || !shared || shared.type !== "modular" || !shared.modularType || !shared.parts) return;
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
          shared.mods.map((m, idx) => {
            const mod = modsMap.get(m.id);
            return {
              modId: m.id,
              modName: mod?.name ?? "",
              rank: m.rank,
              slotIndex: m.slotIndex ?? idx,
              polarity: mod?.polarity,
              drain: mod?.drain,
            };
          })
        );
        setHasOrokinCatalyst(shared.hasOrokinCatalyst ?? false);
        setIsMR30(shared.isMR30 ?? false);
        if (shared.arcanes?.length) {
          setEquippedArcanes(shared.arcanes.map((id) => (id ? resolveArcaneById(id) : null)));
        } else {
          setEquippedArcanes([null, null]);
        }
        const pol: Record<number, string> = {};
        if (shared.slotPolarities) {
          for (const [k, v] of Object.entries(shared.slotPolarities)) {
            pol[Number(k)] = v;
          }
        }
        setSlotPolarities(pol);
        window.history.replaceState({}, "", window.location.pathname);
        toast.info("Build loaded from link", { description: "Modular configuration applied" });
      })();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const buildModularData = (): ModularBuildData => {
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
      mods: equippedMods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex })),
      arcaneIds: equippedArcanes.map((a) => a?.id ?? null),
      hasOrokinCatalyst,
      isMR30,
      slotPolarities,
    };
  };

  const handleSaveBuildConfirm = async ({ name, isPublic }: SaveBuildDialogValues) => {
    const data = buildModularData();
    const build: SavedBuild = {
      id: currentBuildId || generateBuildId(),
      name,
      isPublic,
      type: "modular",
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
    setEquippedMods(d.mods.map((m) => {
      const mod = modsMap.get(m.modId);
      return { ...m, modName: mod?.name ?? "", polarity: mod?.polarity, drain: mod?.drain };
    }));
    setHasOrokinCatalyst(d.hasOrokinCatalyst);
    setIsMR30(d.isMR30 ?? false);
    setSlotPolarities(d.slotPolarities || {});
    const aid = d.arcaneIds ?? [];
    setEquippedArcanes([
      aid[0] ? resolveArcaneById(aid[0]) : null,
      aid[1] ? resolveArcaneById(aid[1]) : null,
    ]);
    setCurrentBuildId(build.id);
    setBuildName(build.name);
    setBuildIsPublic(build.isPublic ?? false);
    setShowSavedBuilds(false);
    toast.info("Build loaded", { description: build.name });
  }, []);

  useCloudBuildFromUrl("modular", handleLoadBuild);
  useLoadoutSlotFromUrl("modular", handleLoadBuild);

  const handleDeleteBuild = (id: string) => {
    deleteBuild(id);
    setSavedBuilds(getSavedBuilds("modular"));
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  };

  const resetMods = () => {
    setEquippedMods([]);
    setEquippedArcanes([null, null]);
    setHasOrokinCatalyst(false);
    setSimParams({ ...DEFAULT_SIM_PARAMS });
    setCurrentBuildId(null);
    setBuildName("");
  };

  return (
    <PageShell>
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h1 className="text-xl sm:text-3xl font-bold">Modular Builder</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setSaveDialogOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-green-400 hover:border-green-500/50 transition-all" title="Save Build">
              <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={() => { setSavedBuilds(getSavedBuilds("modular")); setShowSavedBuilds(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-blue-400 hover:border-blue-500/50 transition-all" title="Load Build">
              <FolderOpen className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Load</span>
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
                "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                modularType === t
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Wrench className="h-3.5 w-3.5 inline mr-1.5" />
              {typeLabels[t]}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Part selection + Mod slots */}
          <div className="space-y-6">
            {/* KITGUN PARTS */}
            {modularType === "kitgun" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">KITGUN PARTS</h2>

                {/* Chamber */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Chamber (Base weapon)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kitgunChambers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setKitgunChamber(c); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          kitgunChamber?.id === c.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{c.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                        onClick={() => { setKitgunGrip(g); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          kitgunGrip?.id === g.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{g.name}</span>
                        <span className={cn("ml-1.5 text-[10px]", g.type === "primary" ? "text-blue-400" : "text-green-400")}>
                          {g.type}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {g.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loader */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Loader (Affects crit, status, magazine)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {kitgunLoaders.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { setKitgunLoader(l); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          kitgunLoader?.id === l.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{l.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          CC {l.critChanceBonus > 0 ? "+" : ""}{(l.critChanceBonus * 100).toFixed(0)}% •
                          CM {l.critMultiplierBonus > 0 ? "+" : ""}{l.critMultiplierBonus.toFixed(1)}x •
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
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">ZAW PARTS</h2>

                {/* Strike */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Strike (Blade type)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {zawStrikes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setZawStrike(s); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          zawStrike?.id === s.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{s.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                        onClick={() => { setZawGripSel(g); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          zawGripSel?.id === g.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{g.name}</span>
                        <span className={cn("ml-1.5 text-[10px]", g.type === "1h" ? "text-green-400" : "text-amber-400")}>{g.type}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                        onClick={() => { setZawLinkSel(l); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          zawLinkSel?.id === l.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium text-xs">{l.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">AMP PARTS</h2>

                {/* Prism */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Prism (Primary fire)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ampPrisms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setAmpPrism(p); resetMods(); }}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          ampPrism?.id === p.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{p.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                        onClick={() => setAmpScaffold(s)}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          ampScaffold?.id === s.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{s.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                        onClick={() => setAmpBrace(b)}
                        className={cn(
                          "p-2.5 rounded-lg border text-left transition-all text-sm",
                          ampBrace?.id === b.id
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                            : "border-border hover:border-cyan-500/30 hover:bg-cyan-500/5"
                        )}
                      >
                        <span className="font-medium">{b.name}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
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
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">RECOMMENDED BUILDS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedBuilds.filter(b => b.type === modularType).map((b, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border hover:border-cyan-500/30 transition-all">
                      <div className="font-medium text-sm">{b.name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{b.parts.join(" + ")}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{b.description}</div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {b.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assembled weapon + Mod slots */}
            {assembledWeapon && (
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-lg font-bold">{assembledWeapon.name}</h2>
                  <span className="text-sm text-muted-foreground capitalize">{assembledWeapon.category}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => setIsMR30(!isMR30)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all",
                        isMR30
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Star className="h-3.5 w-3.5" />
                      MR 30+
                    </button>
                    <button
                      onClick={() => setHasOrokinCatalyst(!hasOrokinCatalyst)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all",
                        hasOrokinCatalyst
                          ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Catalyst
                    </button>
                  </div>
                </div>

                {totalModSlots > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold tracking-wider text-muted-foreground">MOD CONFIGURATION</h3>
                      <span className={cn(
                        "text-xs font-mono",
                        capacityUsed > capacity ? "text-red-400" : "text-muted-foreground"
                      )}>
                        {capacityUsed} / {capacity}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Array.from({ length: totalModSlots }, (_, i) => {
                        const equipped = equippedMods.find((m) => m.slotIndex === i);
                        const mod = equipped ? modsMap.get(equipped.modId) ?? null : null;
                        const isExilus = isSecondaryKitgun && i === SECONDARY_EXILUS_SLOT_INDEX;
                        return (
                          <ModSlotCard
                            key={i}
                            mod={mod}
                            rank={equipped?.rank ?? 0}
                            slotIndex={i}
                            label={isExilus ? "Exilus" : undefined}
                            slotPolarity={slotPolarities[i]}
                            onAdd={() => {
                              setActiveSlotIndex(i);
                              setModPickerSlotType(isExilus ? "weapon_exilus_secondary" : "regular");
                              setModPickerOpen(true);
                            }}
                            onRemove={() => setEquippedMods((prev) => prev.filter((m) => m.slotIndex !== i))}
                            onPolarize={(p) => setSlotPolarities((prev) => { const next = { ...prev }; if (p) next[i] = p; else delete next[i]; return next; })}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {arcaneConfig.slots > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Gem className="h-4 w-4 text-purple-400" />
                      ARCANES
                    </h3>
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
                )}
              </div>
            )}
          </div>

          {/* Right: Stats panel */}
          <div>
            <div className="border border-border rounded-xl p-6 bg-card sticky top-6">
              <h3 className="text-sm font-semibold tracking-wider text-muted-foreground mb-4">
                {assembledWeapon ? "WEAPON STATS" : "SELECT ALL PARTS"}
              </h3>
              {assembledWeapon && calculatedStats ? (
                <WeaponStatsPanel
                  stats={calculatedStats}
                  weapon={assembledWeapon}
                  isMelee={assembledWeapon.category === "melee"}
                  simParams={simParams}
                  onSimParamsChange={setSimParams}
                  contributionContext={contributionContext}
                />
              ) : (
                <div className="space-y-2 text-sm text-muted-foreground">
                  {modularType === "kitgun" && (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", kitgunChamber ? "text-green-400" : "")} />
                        <span className={kitgunChamber ? "text-foreground" : ""}>
                          {kitgunChamber ? kitgunChamber.name : "Select Chamber"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", kitgunGrip ? "text-green-400" : "")} />
                        <span className={kitgunGrip ? "text-foreground" : ""}>
                          {kitgunGrip ? kitgunGrip.name : "Select Grip"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", kitgunLoader ? "text-green-400" : "")} />
                        <span className={kitgunLoader ? "text-foreground" : ""}>
                          {kitgunLoader ? kitgunLoader.name : "Select Loader"}
                        </span>
                      </div>
                    </>
                  )}
                  {modularType === "zaw" && (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", zawStrike ? "text-green-400" : "")} />
                        <span className={zawStrike ? "text-foreground" : ""}>
                          {zawStrike ? zawStrike.name : "Select Strike"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", zawGripSel ? "text-green-400" : "")} />
                        <span className={zawGripSel ? "text-foreground" : ""}>
                          {zawGripSel ? zawGripSel.name : "Select Grip"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", zawLinkSel ? "text-green-400" : "")} />
                        <span className={zawLinkSel ? "text-foreground" : ""}>
                          {zawLinkSel ? zawLinkSel.name : "Select Link"}
                        </span>
                      </div>
                    </>
                  )}
                  {modularType === "amp" && (
                    <>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", ampPrism ? "text-green-400" : "")} />
                        <span className={ampPrism ? "text-foreground" : ""}>
                          {ampPrism ? ampPrism.name : "Select Prism"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", ampScaffold ? "text-green-400" : "")} />
                        <span className={ampScaffold ? "text-foreground" : ""}>
                          {ampScaffold ? ampScaffold.name : "Select Scaffold"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={cn("h-3.5 w-3.5", ampBrace ? "text-green-400" : "")} />
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
          onClose={() => setModPickerOpen(false)}
          mods={allMods}
          category={modCategory}
          slotType={modPickerSlotType}
          weaponCategory={assembledWeapon.category}
          weapon={assembledWeapon}
          equippedModIds={equippedMods.map((m) => m.modId)}
          onSelect={(mod, rank) => {
            setEquippedMods((prev) => {
              const filtered = prev.filter((m) => m.slotIndex !== activeSlotIndex);
              return [...filtered, { modId: mod.id, modName: mod.name, rank, slotIndex: activeSlotIndex, polarity: mod.polarity, drain: mod.drain }];
            });
          }}
        />
      )}

      {assembledWeapon && arcaneConfig.slots > 0 && (
        <ArcanePicker
          open={arcanePickerOpen}
          onOpenChange={setArcanePickerOpen}
          arcanes={arcaneConfig.arcanes}
          equippedArcaneIds={equippedArcanes.filter(Boolean).map((a) => a!.id)}
          onSelect={(arcane) => {
            setEquippedArcanes((prev) => {
              const next = [...prev];
              next[activeArcaneSlot] = arcane;
              return next;
            });
            setArcanePickerOpen(false);
          }}
          title={`Select ${arcaneConfig.label}`}
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
          return `${d.modularType} • ${d.mods.length} mods • ${new Date(build.updatedAt).toLocaleDateString()}`;
        }}
        onLoad={handleLoadBuild}
        onDelete={handleDeleteBuild}
      />

      <SaveBuildDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        defaultName={buildName || `${modularType} Build`}
        defaultIsPublic={buildIsPublic}
        showDescription={false}
        onSave={handleSaveBuildConfirm}
      />
    </PageShell>
  );
}
