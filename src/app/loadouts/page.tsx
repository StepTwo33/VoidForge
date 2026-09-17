"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, startTransition } from "react";
import { PageShell, PageMain, PageHero, ContentPanel, EmptyState } from "@/components/page-shell";
import { getLoadouts, saveLoadout, deleteLoadout, generateId, loadoutToBuildData, loadoutFromSavedBuild, mergeCloudLoadoutPreservingSlots } from "@/lib/builds/loadouts";
import {
  generateBuildId,
  saveCloudBuild,
  SavedBuild,
  WarframeBuildData,
  WeaponBuildData,
  CompanionBuildData,
  ModularBuildData,
} from "@/lib/builds/build-storage";
import { SaveBuildDialog, type SaveBuildDialogValues } from "@/components/save-build-dialog";
import {
  useCloudBuildFromUrl,
  markCloudBuildLoaded,
} from "@/lib/builds/use-cloud-build-from-url";
import { Loadout } from "@/lib/types";
import { modularBuildDisplayName, modularBuildMatchesLoadoutSlot } from "@/lib/builds/modular-resolve";
import { allWarframes } from "@/data/warframes";
import { allCompanions } from "@/data/companions";
import { useWeapons } from "@/lib/weapons/use-data";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Swords,
  Shield,
  Dog,
  Crosshair,
  Search,
  ExternalLink,
  Copy,
  Info,
  Library,
  Sparkles,
  Wrench,
  FolderOpen,
  Save,
  Share2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GameAssetImage } from "@/components/game-asset-image";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/confirm-dialog-provider";
import { LoadoutDamagePanel } from "@/components/loadout-damage-panel";
import { LoadoutSectionErrorBoundary } from "@/components/loadout-section-error-boundary";
import { emptyDualFormBuilds, isDualFormWarframe } from "@/lib/builds/dual-form-warframes";
import {
  type LoadoutSlotType,
  LOADOUT_SLOT_CONFIG,
  LOADOUT_SLOT_CARD_STYLES,
  EMPTY_LOADOUT_SHARDS,
  pickerSlotToWeaponSlot,
  getWeaponSlotPayload,
  getSlotLabelName,
  getSlotModLabel,
  getSlotImage,
  getWeaponCategories,
  listSavedBuildsForSlot,
  listModularBuildsForWeaponSlot,
  normalizeWarframeBuild,
} from "@/lib/builds/loadout-slot-helpers";

type SlotType = LoadoutSlotType;

const SLOT_CONFIG = LOADOUT_SLOT_CONFIG;
const SLOT_CARD_STYLES = LOADOUT_SLOT_CARD_STYLES;

const SLOT_ICONS: Record<SlotType, React.ReactNode> = {
  warframe: <Shield className="h-4 w-4" />,
  primary: <Crosshair className="h-4 w-4" />,
  secondary: <Crosshair className="h-4 w-4" />,
  melee: <Swords className="h-4 w-4" />,
  companion: <Dog className="h-4 w-4" />,
};

export default function LoadoutsPage() {
  const { confirm } = useConfirmDialog();
  const weapons = useWeapons();
  const weaponsMap = useMemo(() => new Map(weapons.map((w) => [w.id, w])), [weapons]);
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<SlotType>("warframe");
  const [pickerLoadoutId, setPickerLoadoutId] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerTab, setPickerTab] = useState<"saved" | "catalog" | "modular">("catalog");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveDialogLoadoutId, setSaveDialogLoadoutId] = useState<string | null>(null);
  const [saveDialogDefaultPublic, setSaveDialogDefaultPublic] = useState(false);
  const [shareCopiedId, setShareCopiedId] = useState<string | null>(null);

  const saveDialogLoadout = useMemo(
    () => (saveDialogLoadoutId ? loadouts.find((l) => l.id === saveDialogLoadoutId) ?? null : null),
    [loadouts, saveDialogLoadoutId],
  );

  useEffect(() => {
    queueMicrotask(() => setLoadouts(getLoadouts()));
  }, []);

  const refresh = useCallback(() => setLoadouts(getLoadouts()), []);

  const applyCloudLoadout = useCallback(
    (build: SavedBuild, options?: { silent?: boolean }) => {
      const existing = getLoadouts().find((l) => l.cloudId === build.id || l.id === build.id);
      const loadout: Loadout = existing
        ? mergeCloudLoadoutPreservingSlots(existing, build)
        : { ...loadoutFromSavedBuild(build), id: generateId(), cloudId: build.id };
      saveLoadout(loadout);
      refresh();
      if (!options?.silent) {
        toast.success(`Loaded “${build.name}”`, { description: "Loadout updated from your account." });
      }
    },
    [refresh],
  );

  useCloudBuildFromUrl("loadout", (build) => applyCloudLoadout(build, { silent: true }));

  const handleOpenSaveDialog = useCallback(async (loadoutId: string, defaultPublic = false) => {
    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json().catch(() => null);
      if (!session?.user) {
        toast.error("Sign in to save loadouts", {
          description: "Create an account or sign in, then try again.",
        });
        return;
      }
    } catch {
      toast.error("Could not verify sign-in status", { description: "Check your connection and try again." });
      return;
    }
    setSaveDialogLoadoutId(loadoutId);
    setSaveDialogDefaultPublic(defaultPublic);
    setSaveDialogOpen(true);
  }, []);

  const handleSaveLoadoutConfirm = useCallback(
    async ({ name, description, isPublic, tags }: SaveBuildDialogValues) => {
      if (!saveDialogLoadoutId) return;
      const loadout = loadouts.find((l) => l.id === saveDialogLoadoutId);
      if (!loadout) return;

      try {
        const build: SavedBuild = {
          id: loadout.cloudId || generateBuildId(),
          name,
          description,
          isPublic,
          tags,
          type: "loadout",
          createdAt: loadout.createdAt,
          updatedAt: Date.now(),
          data: loadoutToBuildData(loadout),
        };

        const cloudResult = await saveCloudBuild(build);
        if (!cloudResult) {
          toast.error("Could not save loadout", {
            description: "Sign in to save loadouts to your account, or try again in a moment.",
          });
          return;
        }

        const updated: Loadout = {
          ...loadout,
          name,
          description,
          isPublic: cloudResult.isPublic ?? isPublic,
          cloudId: cloudResult.id,
          updatedAt: Date.now(),
        };
        saveLoadout(updated);
        markCloudBuildLoaded(cloudResult.id);
        startTransition(() => refresh());
        toast.success("Loadout saved", {
          description: isPublic ? "Listed in Community Builds." : "Saved to your account.",
        });
      } catch (err) {
        console.error("Failed to save loadout", err);
        toast.error("Could not save loadout", { description: "Something went wrong while saving. Try again." });
      }
    },
    [saveDialogLoadoutId, loadouts, refresh],
  );

  const handleShareLoadout = useCallback(
    async (loadout: Loadout) => {
      if (loadout.isPublic && loadout.cloudId) {
        const url = `${window.location.origin}/build/${loadout.cloudId}`;
        await navigator.clipboard.writeText(url);
        setShareCopiedId(loadout.id);
        setTimeout(() => setShareCopiedId(null), 2000);
        toast.success("Share link copied!", { description: "Anyone can view and upvote this loadout." });
        return;
      }

      if (loadout.cloudId) {
        const url = `${window.location.origin}/loadouts?buildId=${encodeURIComponent(loadout.cloudId)}`;
        await navigator.clipboard.writeText(url);
        setShareCopiedId(loadout.id);
        setTimeout(() => setShareCopiedId(null), 2000);
        toast.success("Share link copied!", { description: "Private link — only you can open it when signed in." });
        return;
      }

      handleOpenSaveDialog(loadout.id, true);
      toast.info("Save to share", { description: "Save to your account first, then copy a share link." });
    },
    [handleOpenSaveDialog],
  );

  const handleCreate = useCallback(() => {
    const list = getLoadouts();
    const newLoadout: Loadout = {
      id: generateId(),
      name: `Loadout ${list.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveLoadout(newLoadout);
    refresh();
    toast.success("Loadout created", { description: "Add frames and weapons using the slots below." });
  }, [refresh]);

  const handleDuplicate = useCallback(
    (loadout: Loadout) => {
      const copy: Loadout = {
        ...JSON.parse(JSON.stringify(loadout)) as Loadout,
        id: generateId(),
        name: `${loadout.name} (copy)`,
        cloudId: undefined,
        isPublic: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveLoadout(copy);
      refresh();
      toast.success("Loadout duplicated");
    },
    [refresh]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await confirm({
        title: "Delete loadout?",
        description: "This loadout will be permanently removed from this device.",
        confirmLabel: "Delete",
        destructive: true,
      });
      if (!ok) return;
      deleteLoadout(id);
      refresh();
      toast.success("Loadout deleted");
    },
    [confirm, refresh],
  );

  const handleStartEdit = useCallback((loadout: Loadout) => {
    setEditingId(loadout.id);
    setEditName(loadout.name);
  }, []);

  const handleSaveEdit = useCallback(
    (id: string) => {
      const loadout = loadouts.find((l) => l.id === id);
      if (loadout && editName.trim()) {
        saveLoadout({ ...loadout, name: editName.trim() });
        refresh();
        toast.success("Name updated");
      }
      setEditingId(null);
    },
    [loadouts, editName, refresh]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName("");
  }, []);

  const handleOpenPicker = useCallback((loadoutId: string, slot: SlotType) => {
    setPickerLoadoutId(loadoutId);
    setPickerSlot(slot);
    setPickerSearch("");
    const saved = listSavedBuildsForSlot(slot, weaponsMap);
    const modular = listModularBuildsForWeaponSlot(slot);
    if (saved.length > 0) setPickerTab("saved");
    else if (modular.length > 0) setPickerTab("modular");
    else setPickerTab("catalog");
    setPickerOpen(true);
  }, [weaponsMap]);

  const handlePickCatalogItem = useCallback(
    (itemId: string) => {
      if (!pickerLoadoutId) return;
      const loadout = loadouts.find((l) => l.id === pickerLoadoutId);
      if (!loadout) return;

      const updated = { ...loadout };
      switch (pickerSlot) {
        case "warframe":
          updated.warframeBuild = {
            warframeId: itemId,
            mods: [],
            shards: [...EMPTY_LOADOUT_SHARDS],
            arcaneIds: [null, null],
            hasOrokinReactor: false,
            isMR30: false,
            slotPolarities: {},
            exaltedMods: [],
            exaltedSlotPolarities: {},
            dualFormBuilds: emptyDualFormBuilds(itemId),
          };
          break;
        case "primary":
        case "secondary":
        case "melee":
          {
            const ws = pickerSlotToWeaponSlot(pickerSlot);
            if (ws && updated.modularBuild?.slot === ws) delete updated.modularBuild;
            const weaponShell: NonNullable<Loadout["primaryBuild"]> = {
              weaponId: itemId,
              mods: [],
              arcaneIds: [null, null],
              hasOrokinCatalyst: false,
              isMR30: false,
              slotPolarities: {},
            };
            if (pickerSlot === "primary") updated.primaryBuild = weaponShell;
            else if (pickerSlot === "secondary") updated.secondaryBuild = weaponShell;
            else updated.meleeBuild = weaponShell;
          }
          break;
        case "companion":
          updated.companionBuild = {
            companionId: itemId,
            mods: [],
            weaponMods: [],
            arcaneIds: [null, null],
            hasReactor: false,
            hasCatalyst: false,
            isMR30: false,
            slotPolarities: {},
          };
          break;
      }
      saveLoadout(updated);
      refresh();
      setPickerOpen(false);
      toast.success(`${SLOT_CONFIG[pickerSlot].label} added`, {
        description: "Empty build — attach a saved build or configure in the builder.",
      });
    },
    [pickerLoadoutId, pickerSlot, loadouts, refresh]
  );

  const handleAttachSavedBuild = useCallback(
    (build: SavedBuild) => {
      if (!pickerLoadoutId) return;
      const loadout = loadouts.find((l) => l.id === pickerLoadoutId);
      if (!loadout) return;

      const updated = { ...loadout };

      if (pickerSlot === "warframe" && build.type === "warframe") {
        updated.warframeBuild = normalizeWarframeBuild(build.data as WarframeBuildData);
      } else if (pickerSlot === "companion" && build.type === "companion") {
        const d = build.data as CompanionBuildData & { hasCatalyst?: boolean };
        updated.companionBuild = {
          ...d,
          arcaneIds: d.arcaneIds ?? [null, null],
          slotPolarities: d.slotPolarities ?? {},
          weaponMods: d.weaponMods ?? [],
          hasCatalyst: d.hasCatalyst ?? false,
        };
      } else if (["primary", "secondary", "melee"].includes(pickerSlot) && build.type === "weapon") {
        const d = build.data as WeaponBuildData;
        const w = weaponsMap.get(d.weaponId);
        if (!w || !getWeaponCategories(pickerSlot).includes(w.category)) {
          toast.error("This saved build does not match this weapon slot.");
          return;
        }
        const ws = pickerSlotToWeaponSlot(pickerSlot);
        if (ws && updated.modularBuild?.slot === ws) delete updated.modularBuild;
        const payload: NonNullable<Loadout["primaryBuild"]> = {
          ...d,
          arcaneIds: d.arcaneIds ?? [null, null],
          slotPolarities: d.slotPolarities ?? {},
        };
        if (pickerSlot === "primary") updated.primaryBuild = payload;
        else if (pickerSlot === "secondary") updated.secondaryBuild = payload;
        else updated.meleeBuild = payload;
      } else {
        toast.error("Incompatible saved build for this slot.");
        return;
      }

      saveLoadout(updated);
      refresh();
      setPickerOpen(false);
      toast.success(`Attached “${build.name}”`, { description: SLOT_CONFIG[pickerSlot].label });
    },
    [pickerLoadoutId, pickerSlot, loadouts, refresh, weaponsMap]
  );

  const handleAttachModularBuild = useCallback(
    (build: SavedBuild) => {
      if (!pickerLoadoutId || build.type !== "modular") return;
      const ws = pickerSlotToWeaponSlot(pickerSlot);
      if (!ws) return;
      const data = build.data as ModularBuildData;
      if (!modularBuildMatchesLoadoutSlot(data, ws)) {
        toast.error("This modular build does not fit this weapon slot.");
        return;
      }
      const loadout = loadouts.find((l) => l.id === pickerLoadoutId);
      if (!loadout) return;
      const updated: Loadout = {
        ...loadout,
        modularBuild: { ...data, slot: ws },
        updatedAt: Date.now(),
      };
      if (ws === "primary") delete updated.primaryBuild;
      if (ws === "secondary") delete updated.secondaryBuild;
      if (ws === "melee") delete updated.meleeBuild;
      saveLoadout(updated);
      refresh();
      setPickerOpen(false);
      toast.success(`Attached “${build.name}”`, { description: `${SLOT_CONFIG[pickerSlot].label} (modular)` });
    },
    [pickerLoadoutId, pickerSlot, loadouts, refresh]
  );

  const handleClearSlot = useCallback(
    async (loadoutId: string, slot: SlotType) => {
      const ok = await confirm({
        title: `Remove ${SLOT_CONFIG[slot].label}?`,
        description: "This slot will be cleared from the loadout. The saved build itself is not deleted.",
        confirmLabel: "Remove",
        destructive: true,
      });
      if (!ok) return;
      const loadout = loadouts.find((l) => l.id === loadoutId);
      if (!loadout) return;
      const updated = { ...loadout };
      switch (slot) {
        case "warframe":
          delete updated.warframeBuild;
          break;
        case "primary":
          if (loadout.modularBuild?.slot === "primary") delete updated.modularBuild;
          else delete updated.primaryBuild;
          break;
        case "secondary":
          if (loadout.modularBuild?.slot === "secondary") delete updated.modularBuild;
          else delete updated.secondaryBuild;
          break;
        case "melee":
          if (loadout.modularBuild?.slot === "melee") delete updated.modularBuild;
          else delete updated.meleeBuild;
          break;
        case "companion":
          delete updated.companionBuild;
          break;
      }
      saveLoadout(updated);
      refresh();
      toast.info(`${SLOT_CONFIG[slot].label} cleared`);
    },
    [confirm, loadouts, refresh],
  );

  const pickerCatalogItems = useMemo(() => {
    const q = pickerSearch.toLowerCase();
    if (pickerSlot === "warframe") {
      return allWarframes
        .filter((w) => !q || w.name.toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((w) => ({ id: w.id, name: w.name, detail: `HP ${w.health} • SH ${w.shield} • AR ${w.armor}` }));
    }
    if (pickerSlot === "companion") {
      return allCompanions
        .filter((c) => !q || c.name.toLowerCase().includes(q))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ id: c.id, name: c.name, detail: `${c.type} • HP ${c.health}` }));
    }
    const cats = getWeaponCategories(pickerSlot);
    return weapons
      .filter((w) => cats.includes(w.category))
      .filter((w) => !q || w.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((w) => ({
        id: w.id,
        name: w.name,
        detail: `DMG ${w.damage} • CC ${(w.criticalChance * 100).toFixed(0)}% • SC ${(w.statusChance * 100).toFixed(0)}%`,
      }));
  }, [pickerSlot, pickerSearch, weapons]);

  const pickerSavedBuilds = useMemo(() => {
    const q = pickerSearch.toLowerCase();
    return listSavedBuildsForSlot(pickerSlot, weaponsMap).filter((b) => {
      if (!q) return true;
      if (b.name.toLowerCase().includes(q)) return true;
      if (b.type === "warframe") {
        const wf = allWarframes.find((w) => w.id === (b.data as WarframeBuildData).warframeId);
        return wf?.name.toLowerCase().includes(q);
      }
      if (b.type === "weapon") {
        const w = weaponsMap.get((b.data as WeaponBuildData).weaponId);
        return w?.name.toLowerCase().includes(q);
      }
      if (b.type === "companion") {
        const c = allCompanions.find((x) => x.id === (b.data as CompanionBuildData).companionId);
        return c?.name.toLowerCase().includes(q);
      }
      return false;
    });
  }, [pickerSlot, pickerSearch, weaponsMap]);

  const pickerModularBuilds = useMemo(() => {
    const q = pickerSearch.toLowerCase();
    return listModularBuildsForWeaponSlot(pickerSlot).filter((b) => {
      if (!q) return true;
      if (b.name.toLowerCase().includes(q)) return true;
      const d = b.data as ModularBuildData;
      return modularBuildDisplayName(d).toLowerCase().includes(q);
    });
  }, [pickerSlot, pickerSearch]);

  const savedCount = pickerSavedBuilds.length;
  const modularCount = pickerModularBuilds.length;
  const showModularTab = pickerSlot === "primary" || pickerSlot === "secondary" || pickerSlot === "melee";

  return (
    <PageShell>
      <PageMain maxWidth="lg">
        <PageHero
          icon={FolderOpen}
          accent="green"
          title="Loadouts"
          description="Group a warframe, weapons (including kitguns, zaws, and amps from the Modular tab), and a companion into one kit."
          actions={
            loadouts.length > 0 ? (
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New loadout
              </button>
            ) : undefined
          }
        />

        {loadouts.length > 0 && (
          <ContentPanel className="mb-6 py-3">
            <div className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
              <div className="space-y-1">
                <p>
                  <span className="font-medium text-foreground/80" title="Kitguns, Zaws, and Amps saved in Modular Builder">Modular</span>
                  {" "}— attach kitgun / zaw / amp presets from the Modular tab when filling a weapon slot.
                </p>
                <p>
                  <Link href="/player-sync" className="font-medium text-primary hover:underline" title="Import equipped gear from your Warframe account via the Arsenal Twitch extension">Player Sync</Link>
                  {" "}— pull your in-game loadout into Frame Hub.
                </p>
              </div>
            </div>
          </ContentPanel>
        )}

        {loadouts.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No loadouts yet"
            description="Create a kit, then attach saved builds from the Warframe, Weapon, and Companion builders."
          >
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              New loadout
            </button>
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {loadouts.map((loadout) => (
              <LoadoutSectionErrorBoundary
                key={loadout.id}
                label="loadout card"
                resetKey={`${loadout.id}:${loadout.updatedAt}`}
                fallback={
                  <ContentPanel className="p-5 border-destructive/30">
                    <p className="text-sm text-muted-foreground">
                      Could not display &ldquo;{loadout.name}&rdquo;. Your data is still saved locally.
                    </p>
                  </ContentPanel>
                }
              >
              <ContentPanel className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    {editingId === loadout.id ? (
                      <div className="flex items-center gap-2 flex-1 flex-wrap">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(loadout.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="w-full max-w-xs text-sm sm:h-9"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(loadout.id)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-green-700 hover:bg-green-500/10 dark:text-green-400 sm:h-10 sm:w-10"
                          aria-label="Save name"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-red-700 hover:bg-red-500/10 dark:text-red-400 sm:h-10 sm:w-10"
                          aria-label="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0">
                        <h2 className="text-lg font-semibold truncate">{loadout.name}</h2>
                        {loadout.isPublic && (
                          <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                            Public
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(loadout)}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted sm:h-9 sm:w-9"
                          aria-label="Rename loadout"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    <div className="flex shrink-0 flex-wrap items-center gap-1 sm:gap-2">
                      <span className="text-[10px] text-muted-foreground tabular-nums mr-2">
                        Updated {new Date(loadout.updatedAt).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenSaveDialog(loadout.id)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10"
                        title="Save to account"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShareLoadout(loadout)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10"
                        title="Copy share link"
                      >
                        {shareCopiedId === loadout.id ? (
                          <Check className="h-4 w-4 text-green-700 dark:text-green-400" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                      </button>
                      {loadout.cloudId && (
                        <a
                          href={`/build/${loadout.cloudId}`}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10 sm:w-10"
                          title="View build page"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(loadout)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10 sm:w-10"
                        title="Duplicate loadout"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(loadout.id)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive sm:h-10 sm:w-10"
                        title="Delete loadout"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {(["warframe", "primary", "secondary", "melee", "companion"] as SlotType[]).map((slot) => {
                      const cfg = SLOT_CONFIG[slot];
                      const itemName = getSlotLabelName(loadout, slot, weaponsMap);
                      const ws = pickerSlotToWeaponSlot(slot);
                      const isModularSlot = ws && getWeaponSlotPayload(loadout, ws)?.kind === "modular";
                      const cardStyle = SLOT_CARD_STYLES[slot];

                      if (!itemName) {
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleOpenPicker(loadout.id, slot)}
                            className="group flex min-h-[100px] items-center gap-3 rounded-xl border border-dashed border-border/80 p-4 text-left transition-all hover:border-primary/45 hover:bg-primary/5"
                          >
                            <span className="text-muted-foreground/60 group-hover:text-primary">{SLOT_ICONS[slot]}</span>
                            <div>
                              <span className="block text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                {cfg.label}
                              </span>
                              <span className="text-[11px] text-muted-foreground/70">Tap to add</span>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <div key={slot} className={cn("relative rounded-xl border p-4 flex flex-col gap-2 min-h-[100px]", cardStyle)}>
                          <div className="flex items-start gap-2.5">
                            {isModularSlot ? (
                              <span className="w-10 h-10 rounded-md flex items-center justify-center bg-amber-500/15 border border-amber-500/30 shrink-0">
                                <Wrench className="h-5 w-5 text-amber-800/90 dark:text-amber-400/90" aria-hidden />
                              </span>
                            ) : (
                            <GameAssetImage
                              src={getSlotImage(slot, itemName ?? "", weaponsMap)}
                              alt=""
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-md object-contain bg-background/40 border border-border/30 shrink-0"
                              hideOnError
                            />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                                {cfg.label}
                              </span>
                              <span className="text-sm font-semibold truncate block leading-tight">{itemName}</span>
                              <span className="text-[11px] text-muted-foreground mt-0.5">
                                {getSlotModLabel(loadout, slot)}
                                {isModularSlot ? " • Modular" : ""}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 mt-auto pt-1">
                            <a
                              href={`${isModularSlot ? "/modular-builder" : cfg.builderPath}?loadout=${encodeURIComponent(loadout.id)}&slot=${slot}`}
                              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/60 text-xs font-medium transition-colors hover:border-primary/35 hover:text-primary"
                            >
                              Open builder <ExternalLink className="h-3 w-3 opacity-70" />
                            </a>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenPicker(loadout.id, slot)}
                                className="min-h-11 rounded-lg border border-border/60 text-xs transition-colors hover:bg-background/80"
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={() => handleClearSlot(loadout.id, slot)}
                                className="min-h-11 rounded-lg border border-border/60 text-xs text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <LoadoutSectionErrorBoundary label="damage panel" resetKey={loadout.updatedAt}>
                    <LoadoutDamagePanel loadout={loadout} />
                  </LoadoutSectionErrorBoundary>
                </ContentPanel>
              </LoadoutSectionErrorBoundary>
              ))}
            </div>
          )}
      </PageMain>

      <Dialog
        open={pickerOpen}
        onOpenChange={(open) => {
          setPickerOpen(open);
          if (!open) setPickerLoadoutId(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 sm:max-w-lg">
          <DialogHeader className="p-5 pb-0 shrink-0">
            <DialogTitle className="text-left">Fill {SLOT_CONFIG[pickerSlot]?.label} slot</DialogTitle>
            <p className="text-xs text-muted-foreground text-left font-normal pt-1">
              Saved builds include mods and settings from each builder. Catalog adds the item with an empty build.
            </p>
          </DialogHeader>

          <div className="px-5 pt-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search…"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="h-11 pl-9 sm:h-9"
              />
            </div>
          </div>

          <Tabs
            value={pickerTab}
            onValueChange={(v) => setPickerTab(v as "saved" | "catalog" | "modular")}
            className="flex flex-col flex-1 min-h-0 px-5 pb-5 pt-3"
          >
            <TabsList className={cn("mb-3 grid h-auto min-h-11 w-full shrink-0 sm:h-9", showModularTab ? "grid-cols-3" : "grid-cols-2")}>
              <TabsTrigger value="saved" className="gap-1.5 text-xs sm:text-sm">
                <Library className="h-3.5 w-3.5" />
                <span className="truncate">Saved</span>
                {savedCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary/15 text-primary px-1.5 py-0 text-[10px] tabular-nums">
                    {savedCount}
                  </span>
                )}
              </TabsTrigger>
              {showModularTab && (
                <TabsTrigger value="modular" className="gap-1.5 text-xs sm:text-sm">
                  <Wrench className="h-3.5 w-3.5" />
                  <span className="truncate">Modular</span>
                  {modularCount > 0 && (
                    <span className="ml-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-400 px-1.5 py-0 text-[10px] tabular-nums">
                      {modularCount}
                    </span>
                  )}
                </TabsTrigger>
              )}
              <TabsTrigger value="catalog" className="gap-1.5 text-xs sm:text-sm">
                <Crosshair className="h-3.5 w-3.5" />
                Catalog
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden flex flex-col">
              <ScrollArea className="h-[min(50vh,360px)] pr-3">
                {pickerSavedBuilds.length === 0 ? (
                  <div className="text-center py-10 px-2 text-sm text-muted-foreground">
                    <p className="mb-2">No matching saved builds for this slot.</p>
                    <p className="text-xs">
                      Save a build in the {SLOT_CONFIG[pickerSlot].label} builder, then return here — or use the Catalog
                      tab to start from a blank item.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5 pr-1">
                    {pickerSavedBuilds.map((build) => {
                      let subtitle = "";
                      let modTotal = 0;
                      if (build.type === "warframe") {
                        const d = build.data as WarframeBuildData;
                        subtitle = allWarframes.find((w) => w.id === d.warframeId)?.name ?? d.warframeId;
                        modTotal = d.mods?.length ?? 0;
                      } else if (build.type === "weapon") {
                        const d = build.data as WeaponBuildData;
                        subtitle = weaponsMap.get(d.weaponId)?.name ?? d.weaponId;
                        modTotal = d.mods?.length ?? 0;
                      } else if (build.type === "companion") {
                        const d = build.data as CompanionBuildData;
                        subtitle = allCompanions.find((c) => c.id === d.companionId)?.name ?? d.companionId;
                        modTotal = (d.mods?.length ?? 0) + (d.weaponMods?.length ?? 0);
                      }
                      return (
                        <button
                          key={build.id}
                          type="button"
                          onClick={() => handleAttachSavedBuild(build)}
                          className="w-full text-left p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col gap-0.5"
                        >
                          <span className="text-sm font-medium">{build.name}</span>
                          <span className="text-xs text-muted-foreground">{subtitle}</span>
                          <span className="text-[10px] text-muted-foreground/80">
                            {modTotal} mods • {new Date(build.updatedAt).toLocaleDateString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="catalog" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden flex flex-col">
              <p className="text-[11px] text-muted-foreground mb-2">
                {pickerCatalogItems.length} items — empty mod loadout; use builders to configure, save, then attach from{" "}
                <strong>Saved</strong>.
              </p>
              <ScrollArea className="h-[min(50vh,360px)] pr-3">
                <div className="space-y-1.5 pr-1">
                  {pickerCatalogItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePickCatalogItem(item.id)}
                      className="w-full text-left p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-3"
                    >
                      <GameAssetImage
                        src={getSlotImage(pickerSlot, item.name, weaponsMap)}
                        alt=""
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-md object-contain bg-muted/30 shrink-0 border border-border/40"
                        hideOnError
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium block truncate">{item.name}</span>
                        <span className="text-xs text-muted-foreground block truncate">{item.detail}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {showModularTab && (
              <TabsContent value="modular" className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden flex flex-col">
                <p className="text-[11px] text-muted-foreground mb-2">
                  Kitgun, Zaw, and Amp presets from Modular Builder. Attaching one <strong>replaces</strong> this weapon
                  slot (same as in-game).
                </p>
                <ScrollArea className="h-[min(50vh,360px)] pr-3">
                  {pickerModularBuilds.length === 0 ? (
                    <div className="text-center py-10 px-2 text-sm text-muted-foreground">
                      <p className="mb-2">No modular builds fit this slot.</p>
                      <p className="text-xs">
                        Save a kitgun / zaw / amp in{" "}
                        <a href="/modular-builder" className="text-primary underline">
                          Modular Builder
                        </a>
                        , then return here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pr-1">
                      {pickerModularBuilds.map((build) => {
                        const d = build.data as ModularBuildData;
                        const subtitle = `${d.modularType} • ${modularBuildDisplayName(d)}`;
                        const modTotal = d.mods?.length ?? 0;
                        return (
                          <button
                            key={build.id}
                            type="button"
                            onClick={() => handleAttachModularBuild(build)}
                            className="w-full text-left p-3 rounded-xl border border-amber-500/20 hover:border-amber-500/45 hover:bg-amber-500/5 transition-all flex flex-col gap-0.5"
                          >
                            <span className="text-sm font-medium">{build.name}</span>
                            <span className="text-xs text-muted-foreground">{subtitle}</span>
                            <span className="text-[10px] text-muted-foreground/80">
                              {modTotal} mods • {new Date(build.updatedAt).toLocaleDateString()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      <LoadoutSectionErrorBoundary label="save dialog" resetKey={`${saveDialogLoadoutId}:${saveDialogOpen}`}>
        <SaveBuildDialog
          open={saveDialogOpen}
          onOpenChange={(open) => {
            setSaveDialogOpen(open);
            if (!open) setSaveDialogLoadoutId(null);
          }}
          defaultName={saveDialogLoadout?.name ?? "Loadout"}
          defaultDescription={saveDialogLoadout?.description ?? ""}
          defaultIsPublic={saveDialogDefaultPublic || (saveDialogLoadout?.isPublic ?? false)}
          title="Save Loadout"
          onSave={handleSaveLoadoutConfirm}
        />
      </LoadoutSectionErrorBoundary>
    </PageShell>
  );
}
