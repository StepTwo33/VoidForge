"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  FolderOpen,
  Plus,
  ExternalLink,
} from "lucide-react";
import { PageShell, ContentPanel, PanelHeading } from "@/components/page-shell";
import { PolarityIcon } from "@/components/polarity-icon";
import { ArcaneSlotCard, ArcanePicker } from "@/components/arcane-picker";
import { LoadoutEditBanner } from "@/components/loadout-edit-banner";
import { BuilderActionBar, BuilderActionGroup, BuilderItemHeader } from "@/components/item-picker";
import { persistSavedBuild, resolveSavedArcaneSlots, type SavedBuild } from "@/lib/builds/build-storage";
import { saveIdentityId } from "@/lib/builds/quicksave";
import { BuilderSaveControls } from "@/components/builder-save-controls";
import { useBuilderSavedBuilds } from "@/lib/builds/use-builder-saved-builds";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import { SavedBuildsDialog } from "@/components/saved-builds-dialog";
import { useCloudBuildFromUrl } from "@/lib/builds/use-cloud-build-from-url";
import { useLocalBuildFromUrl } from "@/lib/builds/use-local-build-from-url";
import { useLoadoutSlotFromUrl } from "@/lib/builds/use-loadout-slot-from-url";
import { loadoutSlotLabel, updateLoadoutSlot } from "@/lib/builds/loadout-edit-context";
import { SAVE_DIRTY_CLASS, SAVE_DIRTY_DOT_CLASS, stableBuildSnapshot, useUnsavedChanges } from "@/lib/builds/unsaved-changes";
import {
  findSourceModularAmp,
  migrateOperatorAmpArcanes,
  modularAmpRefId,
  persistOperatorAmpArcanes,
  resolveAmpArcanes,
  writeAmpArcanesOnModular,
} from "@/lib/builds/operator-amp-arcanes";
import { modularBuildDisplayName, weaponFromModularData } from "@/lib/builds/modular-resolve";
import { operatorArcanes, ampArcanes } from "@/data/arcanes";
import { allWeapons } from "@/data/weapons";
import { ampBraces, ampPrisms, ampScaffolds } from "@/data/modular-weapons";
import type { LoadoutOperatorBuild, ModularBuildData, Mod } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { FOCUS_SCHOOLS } from "@/data/focus-school-cards";


export default function OperatorBuilderPage() {
  // Operator state
  const [focusSchool, setFocusSchool] = useState<string>("Madurai");
  const [operatorArcanesState, setOperatorArcanesState] = useState<(Mod | null)[]>([null, null]);
  const [operatorArcaneRanks, setOperatorArcaneRanks] = useState<number[]>([5, 5]);

  // Amp state
  const [ampId, setAmpId] = useState<string>("sirocco");
  const [ampName, setAmpName] = useState<string>("Sirocco");
  const [ampModularBuild, setAmpModularBuild] = useState<ModularBuildData | null>(null);
  const [ampArcanesState, setAmpArcanesState] = useState<(Mod | null)[]>([null, null]);
  const [ampArcaneRanks, setAmpArcaneRanks] = useState<number[]>([5, 5]);

  // Arcane Picker dialog state
  const [arcanePickerOpen, setArcanePickerOpen] = useState(false);
  const [arcanePickerTarget, setArcanePickerTarget] = useState<"operator" | "amp">("operator");
  const [activeArcaneSlotIndex, setActiveArcaneSlotIndex] = useState(0);

  const { savedBuilds, refreshSavedBuilds, deleteSavedBuild } = useBuilderSavedBuilds("operator");
  const { savedBuilds: modularSaved } = useBuilderSavedBuilds("modular");
  const [showSavedBuilds, setShowSavedBuilds] = useState(false);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [buildIsPublic, setBuildIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const savedModularAmps = useMemo(() => {
    return modularSaved.filter((b) => {
      const d = b.data as ModularBuildData;
      return d?.modularType === "amp";
    });
  }, [modularSaved]);

  const applyOperatorPayload = useCallback((ob: LoadoutOperatorBuild) => {
    const migrated = migrateOperatorAmpArcanes(ob);
    setFocusSchool(migrated.focusSchool || "Madurai");
    const opSlots = resolveSavedArcaneSlots(migrated.arcaneIds, 2);
    setOperatorArcanesState(opSlots);
    setOperatorArcaneRanks(
      [0, 1].map((i) => migrated.arcaneRanks?.[i] ?? opSlots[i]?.maxRank ?? 5),
    );
    // Older loadouts attached a Modular Amp without its id: don't show a preset Amp as active.
    const modular = migrated.ampModularBuild ?? null;
    const id = migrated.ampId || "sirocco";
    setAmpId(modular && !id.startsWith("modular_") ? "modular_" : id);
    setAmpName(migrated.ampName || (modular ? modularBuildDisplayName(modular) : "Sirocco"));
    setAmpModularBuild(modular);
    const amp = resolveAmpArcanes(migrated);
    setAmpArcanesState(resolveSavedArcaneSlots(amp.ids, 2));
    setAmpArcaneRanks(amp.ranks);
  }, []);

  const buildOperatorPayload = useCallback((): LoadoutOperatorBuild => {
    return migrateOperatorAmpArcanes({
      focusSchool,
      arcaneIds: operatorArcanesState.map((a) => a?.id ?? null),
      arcaneRanks: operatorArcaneRanks,
      ampId,
      ampName,
      ...persistOperatorAmpArcanes(
        ampModularBuild,
        ampArcanesState.map((a) => a?.id ?? null),
        ampArcaneRanks,
      ),
    });
  }, [
    focusSchool,
    operatorArcanesState,
    operatorArcaneRanks,
    ampId,
    ampName,
    ampModularBuild,
    ampArcanesState,
    ampArcaneRanks,
  ]);

  // Same unsaved-changes tracking as the other builders: the default Operator is the clean
  // baseline, so the first edit lights the Save button.
  const { dirty: hasUnsavedChanges, markClean } = useUnsavedChanges(stableBuildSnapshot(buildOperatorPayload()));
  useEffect(() => {
    markClean();
  }, [markClean]);

  const defaultOperatorBuildName = useCallback(() => {
    return buildName.trim() || `${focusSchool} Operator`;
  }, [buildName, focusSchool]);

  // Track active Amp weapon data (a saved Modular Amp shows its own prism, not Sirocco).
  const currentAmpWeapon = useMemo(() => {
    if (ampModularBuild) {
      const built = weaponFromModularData(ampModularBuild);
      if (built) return built;
    }
    return allWeapons.find((w) => w.id === ampId) ?? allWeapons.find((w) => w.id === "sirocco");
  }, [ampId, ampModularBuild]);

  // Select a preset amp
  const handleSelectPresetAmp = useCallback((id: string, name: string) => {
    setAmpId(id);
    setAmpName(name);
    setAmpModularBuild(null);
    setAmpArcanesState([null, null]);
    setAmpArcaneRanks([5, 5]);
  }, []);

  // Select a saved modular amp
  const handleSelectModularAmp = useCallback((build: SavedBuild) => {
    const data = build.data as ModularBuildData;
    const resolved = resolveAmpArcanes({ ampModularBuild: data });
    setAmpId(modularAmpRefId(build.id));
    setAmpName(build.name || modularBuildDisplayName(data));
    setAmpModularBuild(data);
    setAmpArcanesState(resolveSavedArcaneSlots(resolved.ids, 2));
    setAmpArcaneRanks(resolved.ranks);
    toast.success(`Attached Amp “${build.name}”`, {
      description: resolved.ids.filter(Boolean).length
        ? "Amp arcanes came with the Amp."
        : undefined,
    });
  }, []);

  const handleSaveBuildConfirm = useCallback(
    async ({ name, isPublic, asNew = false }: SaveBuildDialogValues & { asNew?: boolean }) => {
      const payload = buildOperatorPayload();
      const build: SavedBuild = {
        id: saveIdentityId(currentBuildId, asNew),
        name,
        isPublic,
        type: "operator",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        data: payload,
      };
      const result = await persistSavedBuild(build);
      setCurrentBuildId(result.id);
      setBuildName(name);
      setBuildIsPublic(result.isPublic);
      markClean();
      void refreshSavedBuilds();
      if (result.synced) {
        toast.success(asNew || !currentBuildId ? "Saved as new build" : "Build updated", {
          description: `${name} saved to your account.`,
        });
      } else {
        toast.success(asNew || !currentBuildId ? "Saved as new build" : "Build updated on this device", {
          description: "Log in to sync builds to your account.",
        });
      }
    },
    [buildOperatorPayload, currentBuildId, refreshSavedBuilds, markClean],
  );

  const handleLoadBuild = useCallback((rawBuild: SavedBuild, options?: { silent?: boolean }) => {
    applyOperatorPayload(rawBuild.data as LoadoutOperatorBuild);
    setCurrentBuildId(rawBuild.id || null);
    setBuildName(rawBuild.name);
    setBuildIsPublic(rawBuild.isPublic ?? false);
    setShowSavedBuilds(false);
    markClean();
    if (!options?.silent) toast.info("Build loaded", { description: rawBuild.name });
  }, [applyOperatorPayload, markClean]);

  useCloudBuildFromUrl("operator", handleLoadBuild);
  useLocalBuildFromUrl("operator", handleLoadBuild);
  // Same loadout-slot flow as the Warframe / weapon / companion builders (?loadout=&slot=operator).
  const { context: loadoutCtx, clearContext: clearLoadoutCtx } = useLoadoutSlotFromUrl("operator", handleLoadBuild);

  const handleSaveDialog = async (values: SaveBuildDialogValues): Promise<boolean> => {
    if (values.target === "loadout" && loadoutCtx) {
      const payload = buildOperatorPayload();
      const res = await updateLoadoutSlot(loadoutCtx, payload);
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
    return true;
  };

  const handleDeleteBuild = useCallback((id: string) => {
    void deleteSavedBuild(id);
    if (currentBuildId === id) setCurrentBuildId(null);
    toast.success("Build deleted");
  }, [currentBuildId, deleteSavedBuild]);

  // Open Arcane picker
  const handleOpenArcanePicker = useCallback((target: "operator" | "amp", slotIndex: number) => {
    setArcanePickerTarget(target);
    setActiveArcaneSlotIndex(slotIndex);
    setArcanePickerOpen(true);
  }, []);

  // Arcane chosen from dialog
  const handlePickArcane = useCallback(
    (arcane: Mod, rank?: number) => {
      if (arcanePickerTarget === "operator") {
        setOperatorArcanesState((prev) => {
          const next = [...prev];
          next[activeArcaneSlotIndex] = arcane;
          return next;
        });
        setOperatorArcaneRanks((prev) => {
          const next = [...prev];
          next[activeArcaneSlotIndex] = rank ?? arcane.maxRank;
          return next;
        });
      } else {
        const nextIds = ampArcanesState.map((a) => a?.id ?? null);
        const nextRanks = [...ampArcaneRanks];
        nextIds[activeArcaneSlotIndex] = arcane.id;
        nextRanks[activeArcaneSlotIndex] = rank ?? arcane.maxRank;
        setAmpArcanesState((prev) => {
          const next = [...prev];
          next[activeArcaneSlotIndex] = arcane;
          return next;
        });
        setAmpArcaneRanks(nextRanks);
        if (ampModularBuild) {
          setAmpModularBuild(writeAmpArcanesOnModular(ampModularBuild, nextIds, nextRanks));
        }
      }
      setArcanePickerOpen(false);
    },
    [arcanePickerTarget, activeArcaneSlotIndex, ampArcanesState, ampArcaneRanks, ampModularBuild],
  );

  const sourceAmp = useMemo(
    () => (ampModularBuild ? findSourceModularAmp({ ampId, ampName, ampModularBuild }, modularSaved) : null),
    [ampId, ampName, ampModularBuild, modularSaved],
  );

  const activeSchool = FOCUS_SCHOOLS.find((s) => s.id === focusSchool) ?? FOCUS_SCHOOLS[0];

  return (
    <PageShell>
      <main className="container mx-auto flex-1 px-3.5 pt-5 pb-24 sm:px-4 sm:pt-6 lg:pb-6">
        <LoadoutEditBanner
          context={loadoutCtx}
          onDetach={clearLoadoutCtx}
          dirty={hasUnsavedChanges}
          onSaveToLoadout={() => handleSaveDialog({ name: buildName, description: "", isPublic: false, tags: [], target: "loadout" })}
        />
        <BuilderItemHeader
          image={<PolarityIcon polarity={activeSchool.icon} size={32} />}
          title="Operator"
          subtitle={`${focusSchool} • ${ampName}`}
        >
          <BuilderActionBar>
            <BuilderActionGroup>
              <BuilderSaveControls
                canUpdate={!!currentBuildId}
                dirty={hasUnsavedChanges}
                dirtyClass={SAVE_DIRTY_CLASS}
                dotClass={SAVE_DIRTY_DOT_CLASS}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 lg:pointer-fine:min-h-0 lg:py-1.5"
                onUpdate={() => {
                  void handleSaveBuildConfirm({
                    name: defaultOperatorBuildName(),
                    description: "",
                    isPublic: buildIsPublic,
                    tags: [],
                    target: "new",
                    asNew: false,
                  });
                }}
                onSaveNew={() => {
                  setSaveAsNew(false);
                  setSaveDialogOpen(true);
                }}
                onSaveAs={() => {
                  setSaveAsNew(true);
                  setSaveDialogOpen(true);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  void refreshSavedBuilds();
                  setShowSavedBuilds(true);
                }}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400 lg:pointer-fine:min-h-0 lg:py-1.5"
                title="Load Build"
              >
                <FolderOpen className="h-3.5 w-3.5" /> <span className="inline">Load</span>
              </button>
            </BuilderActionGroup>
          </BuilderActionBar>
        </BuilderItemHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FOCUS SCHOOL SELECTOR (LEFT COLUMN) */}
          <div className="lg:col-span-7 space-y-6">
            <ContentPanel padding>
              <PanelHeading>1. Choose Focus School</PanelHeading>
              <p className="text-xs text-muted-foreground mb-4">
                Select your primary Focus School to activate its combat passives and abilities.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {FOCUS_SCHOOLS.map((school) => {
                  const isSelected = focusSchool === school.id;
                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => {
                        setFocusSchool(school.id);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center transition-all",
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-foreground ring-1 ring-amber-500/30 shadow-sm"
                          : "bg-card/60 border-border/70 hover:bg-muted/40 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <PolarityIcon polarity={school.icon} size={28} />
                      <span className="text-xs font-bold leading-none">{school.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active School Breakdown */}
              {(() => {
                const school = FOCUS_SCHOOLS.find((s) => s.id === focusSchool) ?? FOCUS_SCHOOLS[0];
                return (
                  <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                      <PolarityIcon polarity={school.icon} size={24} />
                      <div>
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          {school.name}
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                            {school.domain}
                          </span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground">{school.tagline}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {school.perks.map((perk) => (
                        <div
                          key={perk.title}
                          className="rounded-lg border border-border/60 bg-muted/20 p-2.5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-semibold text-foreground">{perk.title}</span>
                              {perk.badge && (
                                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:text-amber-400">
                                  {perk.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">{perk.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </ContentPanel>

            {/* OPERATOR ARCANES */}
            <ContentPanel padding>
              <PanelHeading>2. Operator Arcanes (Magus / Emergence)</PanelHeading>
              <p className="text-xs text-muted-foreground mb-3">
                Equip up to two Operator arcanes (Magus and Emergence). These slot on the Operator, not the Amp.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {operatorArcanesState.map((arcane, i) => (
                  <ArcaneSlotCard
                    key={`op-arcane-${i}`}
                    arcane={arcane}
                    rank={operatorArcaneRanks[i] ?? arcane?.maxRank ?? 5}
                    label={`Operator Arcane ${i + 1}`}
                    onAdd={() => handleOpenArcanePicker("operator", i)}
                    onRemove={() => {
                      setOperatorArcanesState((prev) => {
                        const next = [...prev];
                        next[i] = null;
                        return next;
                      });
                    }}
                    onRankChange={(rank) => {
                      setOperatorArcaneRanks((prev) => {
                        const next = [...prev];
                        next[i] = rank;
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            </ContentPanel>
          </div>

          {/* AMP & AMP ARCANES (RIGHT COLUMN) */}
          <div className="lg:col-span-5 space-y-6">
            <ContentPanel padding>
              <PanelHeading>3. Equipped Amp</PanelHeading>
              <p className="text-xs text-muted-foreground mb-3">
                Select a standalone Amp (Sirocco, Mote Amp) or equip one of your saved Modular Amps.
              </p>

              {/* Preset selection */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Preset Amps
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetAmp("sirocco", "Sirocco")}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      ampId === "sirocco"
                        ? "bg-blue-500/15 border-blue-500 text-foreground ring-1 ring-blue-500/30"
                        : "bg-card border-border/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Sirocco</span>
                      <span className="text-[9px] bg-blue-500/20 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono font-medium">
                        2000 DMG
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Semi-auto Void pistol with active reload overcharge (80% CC, 3600 DMG).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPresetAmp("mote_amp", "Mote Amp")}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      ampId === "mote_amp"
                        ? "bg-blue-500/15 border-blue-500 text-foreground ring-1 ring-blue-500/30"
                        : "bg-card border-border/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Mote Amp</span>
                      <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">
                        240 DMG
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Starter continuous beam amp (12 fire rate, 20% CC, 30m range).
                    </p>
                  </button>
                </div>
              </div>

              {/* Saved modular amps */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Saved Modular Amps ({savedModularAmps.length})
                  </span>
                  <Link
                    href="/modular-builder?type=amp"
                    className="inline-flex min-h-11 items-center gap-1 py-2 text-xs text-primary hover:underline pointer-fine:min-h-0 pointer-fine:py-0"
                  >
                    Craft in Modular Builder <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {savedModularAmps.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/80 p-3 text-center">
                    <p className="text-xs text-muted-foreground">No saved Modular Amps found.</p>
                    <Link
                      href="/modular-builder?type=amp"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      <Plus className="h-3 w-3" /> Create custom 1-7-7 / 7-7-7 Amp
                    </Link>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {savedModularAmps.map((b) => {
                      const isEquipped = ampId === `modular_${b.id}`;
                      const d = b.data as ModularBuildData;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => handleSelectModularAmp(b)}
                          className={cn(
                            "w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all",
                            isEquipped
                              ? "bg-blue-500/15 border-blue-500 ring-1 ring-blue-500/30"
                              : "bg-card border-border/70 hover:bg-muted/40",
                          )}
                        >
                          <div>
                            <span className="text-xs font-bold text-foreground block">{b.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {ampPrisms.find((x) => x.id === d.parts.prism)?.name ?? "Prism"} •{" "}
                              {ampScaffolds.find((x) => x.id === d.parts.scaffold)?.name ?? "Scaffold"} •{" "}
                              {ampBraces.find((x) => x.id === d.parts.brace)?.name ?? "Brace"}
                            </span>
                          </div>
                          {isEquipped && (
                            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-400">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Amp Stats Summary */}
              {currentAmpWeapon && (
                <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{ampName}</span>
                    <span className="rounded bg-purple-500/15 text-purple-700 dark:text-purple-400 text-[9px] px-1.5 py-0.5 font-bold uppercase">
                      Void Damage
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-border/50 text-[10px]">
                    <div>
                      <span className="text-muted-foreground block">Damage</span>
                      <span className="font-mono font-bold text-foreground">{currentAmpWeapon.damage}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Crit Chance</span>
                      <span className="font-mono font-bold text-foreground">
                        {(currentAmpWeapon.criticalChance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Crit Mult</span>
                      <span className="font-mono font-bold text-foreground">
                        {currentAmpWeapon.criticalMultiplier.toFixed(1)}×
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Status</span>
                      <span className="font-mono font-bold text-foreground">
                        {(currentAmpWeapon.statusChance * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </ContentPanel>

            {/* AMP ARCANES — Virtuos / Eternal; stored on this operator build / loadout (wiki: they slot on the Amp). */}
            <ContentPanel padding>
              <PanelHeading>4. Amp Arcanes (Virtuos / Eternal)</PanelHeading>
              <p className="text-xs text-muted-foreground mb-3">
                {ampModularBuild
                  ? sourceAmp
                    ? `These slot on the Amp and were pre-filled from ${sourceAmp.name}. Edits stay on this ${loadoutCtx ? "loadout" : "build"} and don't change the saved Amp.`
                    : "These slot on the Amp. Edits stay on this build (or loadout) and don't change a saved Amp."
                  : "These slot on the Amp (not the Operator). The second slot is unlocked in-game with an Amp Arcane Adapter."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ampArcanesState.map((arcane, i) => (
                  <ArcaneSlotCard
                    key={`amp-arcane-${i}`}
                    arcane={arcane}
                    rank={ampArcaneRanks[i] ?? arcane?.maxRank ?? 5}
                    label={`Amp Arcane ${i + 1}`}
                    onAdd={() => handleOpenArcanePicker("amp", i)}
                    onRemove={() => {
                      const nextIds = ampArcanesState.map((a, idx) => (idx === i ? null : a?.id ?? null));
                      const nextRanks = [...ampArcaneRanks];
                      setAmpArcanesState((prev) => {
                        const next = [...prev];
                        next[i] = null;
                        return next;
                      });
                      if (ampModularBuild) {
                        setAmpModularBuild(writeAmpArcanesOnModular(ampModularBuild, nextIds, nextRanks));
                      }
                    }}
                    onRankChange={(rank) => {
                      const nextIds = ampArcanesState.map((a) => a?.id ?? null);
                      const nextRanks = [...ampArcaneRanks];
                      nextRanks[i] = rank;
                      setAmpArcaneRanks(nextRanks);
                      if (ampModularBuild) {
                        setAmpModularBuild(writeAmpArcanesOnModular(ampModularBuild, nextIds, nextRanks));
                      }
                    }}
                  />
                ))}
              </div>
            </ContentPanel>
          </div>
        </div>

        {/* ARCANE PICKER DIALOG */}
        <ArcanePicker
          open={arcanePickerOpen}
          onOpenChange={setArcanePickerOpen}
          arcanes={arcanePickerTarget === "operator" ? operatorArcanes : ampArcanes}
          equippedArcaneIds={
            (arcanePickerTarget === "operator"
              ? operatorArcanesState.map((a, idx) => (idx === activeArcaneSlotIndex ? null : a?.id))
              : ampArcanesState.map((a, idx) => (idx === activeArcaneSlotIndex ? null : a?.id))
            ).filter((id): id is string => Boolean(id))
          }
          initialRank={
            arcanePickerTarget === "operator"
              ? operatorArcanesState[activeArcaneSlotIndex]
                ? (operatorArcaneRanks[activeArcaneSlotIndex] ?? operatorArcanesState[activeArcaneSlotIndex]!.maxRank)
                : 5
              : ampArcanesState[activeArcaneSlotIndex]
              ? (ampArcaneRanks[activeArcaneSlotIndex] ?? ampArcanesState[activeArcaneSlotIndex]!.maxRank)
              : 5
          }
          onSelect={handlePickArcane}
          title={arcanePickerTarget === "operator" ? "Select Operator Arcane (Magus / Emergence)" : "Select Amp Arcane (Virtuos / Eternal)"}
        />

        <SavedBuildsDialog
          open={showSavedBuilds}
          onOpenChange={setShowSavedBuilds}
          title="Saved Operator Builds"
          builds={savedBuilds}
          accent="orange"
          getSubtitle={(build) => {
            const d = build.data as LoadoutOperatorBuild;
            const amp = resolveAmpArcanes(d);
            const opCount = (d.arcaneIds ?? []).filter(Boolean).length;
            const ampCount = amp.ids.filter(Boolean).length;
            return `${d.focusSchool ?? "Operator"} • ${d.ampName ?? d.ampId ?? "Amp"} • ${opCount + ampCount} arcanes`;
          }}
          onLoad={handleLoadBuild}
          onDelete={handleDeleteBuild}
        />

        <SaveBuildDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          defaultName={defaultOperatorBuildName()}
          defaultIsPublic={buildIsPublic}
          showDescription={false}
          onSave={handleSaveDialog}
          loadoutTarget={loadoutCtx ? { loadoutName: loadoutCtx.loadoutName, slotLabel: loadoutSlotLabel(loadoutCtx.slot) } : null}
        />
      </main>
    </PageShell>
  );
}
