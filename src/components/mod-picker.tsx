"use client";

import { useState, useMemo } from "react";
import { Mod, getRivenStatsForCategory } from "@/lib/types";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { isArchmeleeMod } from "@/lib/mods/archmelee-mods";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PolarityIcon } from "@/components/polarity-icon";
import { getModImage, getArcaneImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { EmptyState } from "@/components/page-shell";
import { findBlockingModId, getBlockedModIds } from "@/data/mod-exclusions";
import { modsMap as catalogModsMap } from "@/data/mods";
import { cleanModDescription, getModStatDisplayLines } from "@/lib/display/mod-display";
import { getRivenWeaponType, rivenModMatchesWeapon } from "@/lib/weapons/riven-weapon-type";
import { RivenEditor } from "@/components/riven-editor";
import {
  DEFAULT_RIVEN_DRAIN,
  DEFAULT_RIVEN_POLARITY,
  clampRivenDrain,
  normalizeRivenPolarity,
  validateRivenStats,
} from "@/lib/riven/riven-validation";

function isRivenMod(mod: Mod): boolean {
  return mod.subCategory === "riven" || mod.id.startsWith("riven_");
}

/** Riven stat pool category for the picker (Kuva Hek / Phantasma use the shotgun pool). */
function rivenPoolCategory(
  weapon: (Pick<Weapon, "name" | "category"> & { hasRivenSlot?: boolean }) | undefined,
  fallback: string,
): string {
  const type = weapon ? getRivenWeaponType(weapon) : null;
  return type ? type.toLowerCase() : fallback;
}

import {
  isWarframeAugment,
  warframeAugmentEligibleInBuilder,
  type HelminthAugmentContext,
} from "@/lib/mods/warframe-augment-mods";
import { archwingAugmentEligibleInBuilder, isArchwingAugment } from "@/lib/mods/archwing-augment-mods";
import { isTomeMod } from "@/lib/mods/mod-slot-categories";
import { isTomeWeapon } from "@/lib/weapons/tome-weapons";
import { isSetBonusMod } from "@/lib/mods/set-mod-catalog";
import { RARITY_BADGE_COLORS } from "@/lib/display/rarity-badge-colors";
import {
  isWarframeExilusMod,
} from "@/lib/mods/mod-slot-categories";
import {
  modEligibleForWeaponSlot,
  isNonGroundWeaponMod,
  type WeaponModSlotType,
} from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import type { Weapon } from "@/lib/types";
import {
  getModPickerStatFilters,
  modMatchesStatFilter,
  sortMods,
  type ModSortId,
  type ModStatFilterId,
} from "@/lib/mods/mod-stat-filters";
import { PointerVerb } from "@/components/pointer-verb";
import { openResetKey, shouldResetOnOpen } from "@/lib/ui/reset-on-open";

export type SlotType = WeaponModSlotType | "aura" | "exilus" | "companion_precept";

interface ModPickerProps {
  open: boolean;
  onClose: () => void;
  mods: Mod[];
  category: string;
  slotType?: SlotType;
  /**
   * Which builder's stat chips to show when `category` is "_prefiltered" (the caller already filtered the pool).
   * Defaults to `category`.
   */
  statFilterCategory?: string;
  equippedModIds: string[];
  onSelect: (mod: Mod, rank: number) => void;
  onSelectRiven?: (mod: Mod, stats: Record<string, number>, meta?: RivenSelectMeta) => void;
  /** Open straight into the riven editor pre-filled (Edit riven). */
  editRiven?: { mod: Mod; stats: Record<string, number>; polarity?: string; drain?: number } | null;
  /** Signed-in user's saved rivens for this weapon (Round 54 riven library). */
  savedRivens?: SavedRivenEntry[];
  weaponCategory?: string; // for riven stat pool filtering
  /** When set, filters mods by beam / AoE / projectile wiki compatibility tags. */
  weapon?: Pick<Weapon, "id" | "name" | "category" | "triggerType"> & { hasRivenSlot?: boolean };
  /** Incarnon Genesis installed: form trigger also gates Cannonade (round 47). */
  incarnonFormTriggerType?: string;
  warframeId?: string; // When set, augment mods are filtered to this warframe + universal
  /** When set, unlocks the Helminth ability's matching "{Ability} Augment" mod. */
  helminthAbility?: HelminthAugmentContext | null;
  archwingId?: string; // When set, archwing augments are filtered to this archwing
  /** When provided, shows Mods / Arcanes tabs for browsing warframe arcanes. */
  arcaneCatalog?: Mod[];
  /** Restrict picker to mods-only or arcanes-only (warframe builder). */
  pickerMode?: "mods" | "arcanes";
  initialBrowseTab?: "mods" | "arcanes";
  equippedArcaneIds?: string[];
  /** Phone/tablet (below lg) slot stepper shown in the bottom sheet. Display/navigation only. */
  slotNav?: ModPickerSlotNav;
}

export interface RivenSelectMeta {
  polarity: string;
  drain: number;
  /** Saved-riven name when equipped from the riven library. */
  name?: string;
}

export interface SavedRivenEntry {
  id: string;
  name: string;
  /** Riven catalog mod id (riven_rifle / riven_shotgun / …). */
  modId: string;
  stats: Record<string, number>;
  polarity: string;
  drain: number;
}

export interface ModPickerSlotNav {
  /** Short visible position label, e.g. "3 / 9". */
  label: string;
  /** Spoken form for assistive tech, e.g. "Slot 3 of 9". */
  ariaLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export function ModPicker({ open, onClose, mods, category, statFilterCategory, slotType = "regular", equippedModIds, onSelect, onSelectRiven, weaponCategory, weapon, incarnonFormTriggerType, warframeId, helminthAbility, archwingId, arcaneCatalog, pickerMode = "mods", initialBrowseTab = "mods", equippedArcaneIds = [], slotNav, editRiven, savedRivens }: ModPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [selectedRank, setSelectedRank] = useState(0);
  const [browseTab, setBrowseTab] = useState<"mods" | "arcanes">(initialBrowseTab);
  // Riven stat configuration state
  const [rivenStats, setRivenStats] = useState<Record<string, number>>({});
  const [rivenPolarity, setRivenPolarity] = useState<string>(DEFAULT_RIVEN_POLARITY);
  const [rivenDrain, setRivenDrain] = useState<number>(DEFAULT_RIVEN_DRAIN);
  const rivenCategory = rivenPoolCategory(weapon, weaponCategory || category);
  // Edit riven: open straight into the editor pre-filled (adjust-state-during-render on open).
  const editKey = open && editRiven ? `${editRiven.mod.id}:${JSON.stringify(editRiven.stats)}:${editRiven.polarity}:${editRiven.drain}` : null;
  const [prevEditKey, setPrevEditKey] = useState<string | null>(null);
  if (prevEditKey !== editKey) {
    setPrevEditKey(editKey);
    if (editKey && editRiven) {
      setSelectedMod(editRiven.mod);
      setRivenStats(editRiven.stats);
      setRivenPolarity(normalizeRivenPolarity(editRiven.polarity));
      setRivenDrain(clampRivenDrain(editRiven.drain ?? DEFAULT_RIVEN_DRAIN));
    }
  }
  const [statFilter, setStatFilter] = useState<ModStatFilterId>("all");
  // Slot stepper: keep the chosen stat chip while moving between slots of the same type,
  // but reset it when the slot type changes (e.g. regular -> Aura/Exilus), whose chip set differs.
  // Adjust-state-during-render pattern (no effect) — UI state only.
  const [prevSlotType, setPrevSlotType] = useState(slotType);
  if (prevSlotType !== slotType) {
    setPrevSlotType(slotType);
    setStatFilter("all");
  }
  const [sortId, setSortId] = useState<ModSortId>("name");
  // Reset tab / stat chip / sort whenever the picker opens (or its seeds change while open).
  // Adjust-state-during-render, same timing as the old effect minus one stale frame; see lib/ui/reset-on-open.
  const resetKey = openResetKey(open, initialBrowseTab, pickerMode);
  const [prevResetKey, setPrevResetKey] = useState<string | null>(null);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    if (shouldResetOnOpen(prevResetKey, resetKey, open)) {
      setBrowseTab(pickerMode === "arcanes" ? "arcanes" : initialBrowseTab);
      setStatFilter("all");
      setSortId("name");
    }
  }

  const statFilterOptions = useMemo(
    () => getModPickerStatFilters(statFilterCategory ?? category, slotType),
    [category, statFilterCategory, slotType],
  );

  const blockedByExclusion = useMemo(() => getBlockedModIds(equippedModIds), [equippedModIds]);
  const blockingModName = (modId: string) => {
    const id = findBlockingModId(modId, equippedModIds);
    return (id && (mods.find((m) => m.id === id) ?? catalogModsMap.get(id))?.name) || "an equipped mod";
  };

  const weaponModProfile = useMemo(
    () => (weapon ? getWeaponModProfile(weapon, { incarnonFormTriggerType }) : undefined),
    [weapon, incarnonFormTriggerType],
  );

  const filteredMods = useMemo(() => {
    let categoryMods: Mod[];
    if (slotType === "aura") {
      categoryMods = mods.filter(isAuraMod);
    } else if (slotType === "exilus") {
      categoryMods = mods.filter(isWarframeExilusMod);
    } else if (slotType === "weapon_exilus_primary") {
      categoryMods = mods.filter((m) =>
        modEligibleForWeaponSlot(m, "primary", weaponCategory, "weapon_exilus_primary", weaponModProfile),
      );
    } else if (slotType === "weapon_exilus_secondary") {
      categoryMods = mods.filter((m) =>
        modEligibleForWeaponSlot(m, "secondary", weaponCategory, "weapon_exilus_secondary", weaponModProfile),
      );
    } else if (slotType === "weapon_exilus_melee") {
      categoryMods = mods.filter((m) =>
        modEligibleForWeaponSlot(m, "melee", weaponCategory, "weapon_exilus_melee", weaponModProfile),
      );
    } else if (category === "_prefiltered") {
      // Mods already filtered by caller (e.g. companion weapon mods)
      categoryMods = [...mods];
    } else if (
      weaponCategory &&
      (category === "primary" || category === "secondary" || category === "melee")
    ) {
      categoryMods = mods.filter((m) => {
        if (m.subCategory === "riven") return rivenModMatchesWeapon(m.id, weapon, weaponCategory);
        return modEligibleForWeaponSlot(m, category, weaponCategory, "regular", weaponModProfile);
      });
    } else {
      categoryMods = mods.filter((m) => {
        if (isSetBonusMod(m)) return false;
        // Stance / Railjack / Focus / Parazon / etc. never leak into weapon/frame pickers here.
        if (isNonGroundWeaponMod(m) && category !== "archwing") return false;
        if (category !== "archmelee" && (m.category === "archmelee" || isArchmeleeMod(m))) return false;
        if (category !== "archgun" && m.category === "archgun") return false;
        // Riven mods: only show the riven matching the specific weapon category
        if (m.subCategory === "riven") return rivenModMatchesWeapon(m.id, weapon, weaponCategory);
        if (category === "primary") return ["primary", "rifle", "shotgun", "bow", "general"].includes(m.category);
        if (category === "secondary") return ["secondary", "pistol", "general"].includes(m.category);
        if (category === "melee") return m.category === "melee" || (m.category === "general" && !isArchmeleeMod(m));
        if (category === "archmelee") return isArchmeleeMod(m);
        if (category === "warframe") {
          return m.category === "warframe" || isWarframeAugment(m);
        }
        if (category === "archwing") return m.category === "archwing" || isArchwingAugment(m);
        if (category === "companion") return m.category === "companion";
        return m.category === category;
      });
    }

    // Belt-and-suspenders: never show Railjack/Focus/etc in ground weapon pickers.
    if (
      category === "primary" ||
      category === "secondary" ||
      category === "melee" ||
      category === "archgun" ||
      category === "archmelee" ||
      slotType === "weapon_exilus_primary" ||
      slotType === "weapon_exilus_secondary" ||
      slotType === "weapon_exilus_melee"
    ) {
      categoryMods = categoryMods.filter((m) => !isNonGroundWeaponMod(m));
    }

    categoryMods = categoryMods.filter((m) => m.category !== "arcane");

    // Warframe ability augments: selected frame (+ universal) or Helminth ability match.
    categoryMods = categoryMods.filter((m) =>
      warframeAugmentEligibleInBuilder(m, category, warframeId, helminthAbility),
    );

    // Archwing ability augments: only in archwing builder for the selected archwing.
    categoryMods = categoryMods.filter((m) =>
      archwingAugmentEligibleInBuilder(m, category, archwingId),
    );

    // Tome mods (canticles + invocations) only on tome weapons.
    const weaponId = weapon?.id;
    categoryMods = categoryMods.filter((m) => {
      if (!isTomeMod(m)) return true;
      return isTomeWeapon(weaponId);
    });

    categoryMods = categoryMods.filter((m) => !isSetBonusMod(m));

    if (category === "warframe") {
      if (slotType === "regular") {
        // Aura is slot-exclusive. Exilus mods may also occupy regular slots (wiki / in-game).
        categoryMods = categoryMods.filter((m) => !isAuraMod(m));
      } else if (slotType === "aura") {
        categoryMods = categoryMods.filter(isAuraMod);
      } else if (slotType === "exilus") {
        categoryMods = categoryMods.filter(isWarframeExilusMod);
      }
    }

    if (!search.trim()) return categoryMods;
    const q = search.toLowerCase();
    return categoryMods.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [mods, category, slotType, search, warframeId, helminthAbility, archwingId, weaponCategory, weaponModProfile, weapon]);

  const displayedMods = useMemo(() => {
    let list = filteredMods;
    if (statFilter !== "all") {
      list = list.filter((m) => modMatchesStatFilter(m, statFilter));
    }
    return sortMods(list, sortId);
  }, [filteredMods, statFilter, sortId]);

  const filteredArcanes = useMemo(() => {
    if (!arcaneCatalog) return [];
    if (!search.trim()) return arcaneCatalog;
    const q = search.toLowerCase();
    return arcaneCatalog.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }, [arcaneCatalog, search]);

  const isArcaneBrowse = pickerMode === "arcanes" && !!arcaneCatalog;


  const visibleSavedRivens = useMemo(() => {
    if (!savedRivens?.length || !onSelectRiven || slotType !== "regular") return [];
    const pool = getRivenStatsForCategory(rivenCategory);
    const q = search.trim().toLowerCase();
    return savedRivens
      .map((entry) => {
        const mod = catalogModsMap.get(entry.modId);
        if (!mod) return null;
        const lines = Object.entries(entry.stats).map(([k, v]) => {
          const def = pool.find((d) => d.key === k);
          const label = def ? def.label.replace(" (Spliced)", "") : k;
          const shown = def?.isPercent === false ? v.toFixed(1) : `${(v * 100).toFixed(1)}%`;
          return `${v >= 0 ? "+" : ""}${shown} ${label}`;
        });
        return { entry, mod, lines, valid: validateRivenStats(entry.stats, rivenCategory).ok };
      })
      .filter((r): r is NonNullable<typeof r> => !!r)
      .filter((r) => !q || r.entry.name.toLowerCase().includes(q) || r.lines.some((l) => l.toLowerCase().includes(q)) || "riven".includes(q));
  }, [savedRivens, onSelectRiven, slotType, rivenCategory, search]);

  const equipSavedRiven = (entry: SavedRivenEntry, mod: Mod) => {
    if (!onSelectRiven || !validateRivenStats(entry.stats, rivenCategory).ok) return;
    onSelectRiven(mod, entry.stats, {
      polarity: normalizeRivenPolarity(entry.polarity),
      drain: clampRivenDrain(entry.drain),
      name: entry.name,
    });
    setSelectedMod(null);
    setRivenStats({});
    setRivenPolarity(DEFAULT_RIVEN_POLARITY);
    setRivenDrain(DEFAULT_RIVEN_DRAIN);
    setSearch("");
    onClose();
  };

  const handleSelectMod = (mod: Mod) => {
    setSelectedMod(mod);
    setSelectedRank(mod.maxRank);
  };

  const handleConfirm = () => {
    if (selectedMod) {
      if (isRivenMod(selectedMod) && onSelectRiven) {
        if (!rivenValidation.ok) return;
        onSelectRiven(selectedMod, rivenStats, { polarity: rivenPolarity, drain: rivenDrain });
      } else {
        onSelect(selectedMod, selectedRank);
      }
      setSelectedMod(null);
      setSelectedRank(0);
      setRivenStats({});
      setRivenPolarity(DEFAULT_RIVEN_POLARITY);
      setRivenDrain(DEFAULT_RIVEN_DRAIN);
      setSearch("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedMod(null);
    setSelectedRank(0);
    setRivenStats({});
    setRivenPolarity(DEFAULT_RIVEN_POLARITY);
    setRivenDrain(DEFAULT_RIVEN_DRAIN);
    setSearch("");
    setStatFilter("all");
    setSortId("name");
    setBrowseTab(initialBrowseTab);
    onClose();
  };

  // Escape / tapping outside while the rank card is open equips the mod at the shown rank instead of
  // silently dropping it (Back still returns to the list without equipping). A riven with no
  // stats yet has nothing to equip, so it just closes as before.
  const rivenValidation = validateRivenStats(rivenStats, rivenCategory);
  const rivenBlocked = !!selectedMod && isRivenMod(selectedMod) && !!onSelectRiven && !rivenValidation.ok;
  const dismissEquips = !!selectedMod && !rivenBlocked;
  const handleDismiss = () => {
    if (dismissEquips) {
      handleConfirm();
      return;
    }
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <DialogContent className="flex max-h-[85vh] min-h-0 w-full max-w-[calc(100%-2rem)] flex-col overflow-hidden p-0 sm:max-w-2xl max-lg:top-auto max-lg:bottom-0 max-lg:max-h-[85dvh] max-lg:max-w-none! max-lg:translate-y-0 max-lg:rounded-b-none max-lg:border-x-0 max-lg:border-b-0 max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=closed]:zoom-out-100 max-lg:data-[state=open]:zoom-in-100 max-lg:data-[state=open]:slide-in-from-bottom-8 max-lg:data-[state=closed]:slide-out-to-bottom-8">
        <div aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/40 lg:hidden" />
        <DialogHeader className="p-6 pb-0 sm:pl-6 sm:pr-12 lg:pl-6 lg:pr-12">
          <DialogTitle>
            {isArcaneBrowse
              ? "Select Arcane"
              : slotType === "aura"
                ? "Select Aura Mod"
                : slotType === "exilus"
                  ? "Select Exilus Mod"
                  : slotType === "weapon_exilus_primary"
                    ? "Select Primary Exilus Mod"
                    : slotType === "weapon_exilus_secondary"
                    ? "Select Secondary Exilus Mod"
                    : slotType === "weapon_exilus_melee"
                      ? "Select Melee Exilus Mod"
                      : slotType === "companion_precept"
                        ? "Select Companion Precept"
                        : "Select Mod"}
          </DialogTitle>
          {!isArcaneBrowse && (
            <DialogDescription className="text-xs text-muted-foreground">
              {slotType === "exilus"
                ? "Warframe Exilus — utility / mobility mods only (not Aura)."
                : slotType === "weapon_exilus_primary" || slotType === "weapon_exilus_secondary" || slotType === "weapon_exilus_melee"
                  ? "Weapon Exilus — mods eligible for this Exilus slot on the selected weapon."
                  : slotType === "aura"
                    ? "Aura slot — aura mods only."
                    : weaponCategory === "shotgun"
                      ? "Shotgun pool — rifle-only mods stay filtered out."
                      : "Eligible mods for this slot."}
            </DialogDescription>
          )}
          {!isArcaneBrowse && helminthAbility?.abilityName && (
            <p className="mt-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-2 text-[11px] leading-snug text-emerald-950 dark:text-emerald-200">
              Helminth unlock — <span className="font-semibold">{helminthAbility.abilityName} Augment</span> is available in this list while that ability is subsumed.
            </p>
          )}
          {slotNav && (
            <div className="mt-2 flex items-center gap-2 lg:hidden" data-slot-nav>
              <button
                type="button"
                onClick={() => { setSelectedMod(null); setSearch(""); slotNav.onPrev?.(); }}
                disabled={!slotNav.onPrev}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-md border border-border bg-secondary/40 px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Prev slot
              </button>
              <span
                role="status"
                aria-live="polite"
                aria-label={slotNav.ariaLabel ?? slotNav.label}
                className="shrink-0 px-1 text-xs tabular-nums text-muted-foreground"
              >
                <span aria-hidden>{slotNav.label}</span>
                <span className="sr-only">{slotNav.ariaLabel ?? slotNav.label}</span>
              </span>
              <button
                type="button"
                onClick={() => { setSelectedMod(null); setSearch(""); slotNav.onNext?.(); }}
                disabled={!slotNav.onNext}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-md border border-border bg-secondary/40 px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
              >
                Next slot
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </DialogHeader>

        {selectedMod ? (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6">
            <div className="border border-border rounded-lg p-4 bg-secondary/30">
              <div className="flex items-center gap-3 mb-2">
                <GameAssetImage
                  src={selectedMod.category === "arcane" ? getArcaneImage(selectedMod.name) : getModImage(selectedMod.name)}
                  alt=""
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded object-contain bg-muted/20 shrink-0"
                  hideOnError
                />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <h4 className="min-w-0 truncate font-semibold">{selectedMod.name}</h4>
                  <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[selectedMod.rarity])}>
                    {selectedMod.rarity}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {cleanModDescription(selectedMod.description)}
              </p>
              {getModStatDisplayLines(selectedMod, selectedRank).length > 0 && (
                <ul className="space-y-1 mb-3">
                  {getModStatDisplayLines(selectedMod, selectedRank).map((line) => (
                    <li key={line.statKey} className="flex justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">{line.label}</span>
                      <span className="font-mono text-blue-800 shrink-0 text-right dark:text-blue-300">
                        {line.atRank}
                        {selectedRank < selectedMod.maxRank && (
                          <span className="text-muted-foreground/70"> ({line.atMax} max)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isRivenMod(selectedMod) ? (
              <RivenEditor
                poolCategory={rivenCategory}
                stats={rivenStats}
                onStatsChange={setRivenStats}
                polarity={rivenPolarity}
                onPolarityChange={setRivenPolarity}
                drain={rivenDrain}
                onDrainChange={setRivenDrain}
              />
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rank: {selectedRank} / {selectedMod.maxRank}
                </label>
                <input
                  type="range"
                  min={0}
                  max={selectedMod.maxRank}
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{selectedMod.maxRank}</span>
                </div>
              </div>
            )}

            {dismissEquips && (
              <p className="mt-4 text-right text-[11px] text-muted-foreground">
                Closing this card equips it at the rank shown. Use Back to cancel.
              </p>
            )}
            <div className={cn("flex gap-2 justify-end", dismissEquips ? "mt-2" : "mt-4")}>
              <Button
                variant="outline"
                onClick={() => setSelectedMod(null)}
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={rivenBlocked}
                title={rivenBlocked ? "Fix the riven stats above to equip it" : undefined}
              >
                {selectedMod?.category === "arcane" ? "Equip Arcane" : "Equip Mod"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="px-6 pb-3 shrink-0">
              {arcaneCatalog && arcaneCatalog.length > 0 && pickerMode !== "mods" && pickerMode !== "arcanes" && (
                <div className="flex gap-1 mb-3 p-1 rounded-lg bg-secondary/40">
                  <button
                    type="button"
                    onClick={() => setBrowseTab("mods")}
                    className={cn(
                      "min-h-11 flex-1 rounded-md text-sm transition-colors",
                      browseTab === "mods" ? "bg-background font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Mods
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrowseTab("arcanes")}
                    className={cn(
                      "min-h-11 flex-1 rounded-md text-sm transition-colors",
                      browseTab === "arcanes" ? "bg-background font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Arcanes
                  </button>
                </div>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isArcaneBrowse ? "Search arcanes..." : "Search mods..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
              {!isArcaneBrowse && statFilterOptions.length > 1 && (
                <div className="codex-chip-row mt-3 flex flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain lg:flex-wrap lg:overflow-visible [&>*]:shrink-0">
                  {statFilterOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setStatFilter(option.id)}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-3 py-2.5 text-xs font-medium transition-colors ring-1 lg:pointer-fine:min-h-8 lg:px-2.5 lg:py-1 lg:text-[11px]",
                        statFilter === option.id
                          ? "bg-primary text-primary-foreground ring-primary/40"
                          : "bg-secondary/40 text-muted-foreground ring-foreground/20 hover:text-foreground hover:bg-secondary/70",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {!isArcaneBrowse && (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {displayedMods.length === 0
                      ? (search.trim() ? "No mods match this search" : "No mods in this filter")
                      : (
                        <>
                          <span className="font-mono tabular-nums text-foreground">{displayedMods.length}</span>
                          {" "}mods — <PointerVerb /> to equip
                        </>
                      )}
                  </p>
                  <label className="flex w-full items-center gap-2 text-xs text-muted-foreground sm:w-auto sm:gap-1.5 sm:text-[11px]">
                    Sort
                    <select
                      value={sortId}
                      onChange={(e) => setSortId(e.target.value as ModSortId)}
                      className="min-h-11 flex-1 rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground sm:flex-none lg:pointer-fine:min-h-8 sm:py-1 sm:text-[11px]"
                    >
                      <option value="name">Name (A–Z)</option>
                      <option value="drain-asc">Drain (low → high)</option>
                      <option value="drain-desc">Drain (high → low)</option>
                    </select>
                  </label>
                </div>
              )}
              {isArcaneBrowse && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {filteredArcanes.length === 0
                    ? (search.trim() ? "No arcanes match this search" : "No arcanes available")
                    : (
                      <>
                        <span className="font-mono tabular-nums text-foreground">{filteredArcanes.length}</span>
                        {" "}arcanes — <PointerVerb /> to equip
                      </>
                    )}
                </p>
              )}
            </div>

            <div
              className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 min-h-0"
              role="listbox"
              aria-label={isArcaneBrowse ? "Arcane list" : "Mod list"}
            >
              <div className="space-y-1">
                {!isArcaneBrowse && visibleSavedRivens.length > 0 && (
                  <div className="mb-2 space-y-1 rounded-lg border border-purple-500/30 bg-purple-500/5 p-2" data-testid="saved-rivens-in-picker">
                    <div className="px-1 text-[10px] font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      Your saved rivens
                    </div>
                    {visibleSavedRivens.map(({ entry, mod, valid, lines }) => (
                      <button
                        key={entry.id}
                        type="button"
                        role="option"
                        aria-selected={false}
                        disabled={!valid}
                        onClick={() => equipSavedRiven(entry, mod)}
                        title={valid ? "Equip this saved riven" : "This saved riven doesn't pass validation; edit it on My Builds"}
                        className="flex min-h-11 w-full items-start gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-left transition-colors hover:border-purple-500/60 disabled:opacity-50"
                      >
                        <PolarityIcon polarity={entry.polarity} size={14} className="mt-0.5 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">{entry.name}</span>
                            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{entry.drain}</span>
                          </span>
                          <span className="block text-[11px] leading-snug text-purple-800 dark:text-purple-300">{lines.join(" · ")}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {isArcaneBrowse && filteredArcanes.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title="No arcanes found"
                    description={search.trim() ? `Nothing matches “${search.trim()}”.` : "No arcanes available for this slot."}
                    className="border-0 bg-transparent py-10"
                  />
                ) : !isArcaneBrowse && displayedMods.length === 0 ? (
                  <EmptyState
                    icon={Search}
                    title={
                      slotType === "exilus" || String(slotType).startsWith("weapon_exilus")
                        ? "No Exilus mods found"
                        : weaponCategory === "shotgun"
                          ? "No shotgun mods found"
                          : "No mods found"
                    }
                    description={
                      search.trim()
                        ? `Nothing matches “${search.trim()}”. Try clearing search or filters.`
                        : slotType === "exilus"
                          ? "This slot only lists warframe Exilus (utility) mods."
                          : String(slotType).startsWith("weapon_exilus")
                            ? "No mods are eligible for this weapon’s Exilus slot with the current filters."
                            : weaponCategory === "shotgun"
                              ? "Shotgun filtering is on — rifle-class mods won’t appear here. Clear search/filters or pick a different weapon."
                              : "No mods match the current filters."
                    }
                    className="border-0 bg-transparent py-10"
                  />
                ) : isArcaneBrowse ? filteredArcanes.map((arcane) => {
                  const isEquipped = equippedArcaneIds.includes(arcane.id);
                  return (
                    <button
                      key={arcane.id}
                      onClick={() => !isEquipped && handleSelectMod(arcane)}
                      disabled={isEquipped}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        isEquipped
                          ? "border-border opacity-40 cursor-not-allowed"
                          : "border-border hover:border-purple-500/50 hover:bg-purple-500/5 hover:scale-[1.01] cursor-pointer shadow-sm",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <GameAssetImage src={getArcaneImage(arcane.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                          <span className="truncate text-sm font-medium">{arcane.name}</span>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[arcane.rarity])}>
                          {arcane.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {cleanModDescription(arcane.description).substring(0, 100)}
                      </p>
                      {isEquipped && (
                        <span className="text-[10px] text-muted-foreground">Already equipped</span>
                      )}
                    </button>
                  );
                }) : displayedMods.map((mod) => {
                  const isEquipped = equippedModIds.includes(mod.id);
                  const isBlocked = blockedByExclusion.has(mod.id);
                  const isDisabled = isEquipped || isBlocked;
                  const hasStats = Object.keys(mod.stats).length > 0;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => !isDisabled && handleSelectMod(mod)}
                      disabled={isDisabled}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all",
                        isDisabled
                          ? "border-border opacity-40 cursor-not-allowed"
                          : "border-border hover:border-blue-500/50 hover:bg-blue-500/5 hover:scale-[1.01] cursor-pointer shadow-sm"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <GameAssetImage src={getModImage(mod.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                          <PolarityIcon polarity={mod.polarity} size={14} />
                          <span className="truncate text-sm font-medium">{mod.name}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {!hasStats && (
                            <span className="text-[10px] text-yellow-800 dark:text-yellow-500/70">utility</span>
                          )}
                          <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[mod.rarity])}>
                            {mod.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {cleanModDescription(mod.description).substring(0, 80)}
                      </p>
                      {isEquipped && (
                        <span className="text-[10px] text-muted-foreground">Already equipped</span>
                      )}
                      {isBlocked && !isEquipped && (
                        <span className="text-[10px] text-orange-700 dark:text-orange-400" data-testid="mod-picker-incompatible">
                          Can&apos;t be equipped with {blockingModName(mod.id)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Builds the below-lg Prev/Next slot stepper from an ordered list of slot ids. UI navigation only. */
export function buildSlotNav<T>(
  order: readonly T[],
  active: T,
  open: (slot: T) => void,
): ModPickerSlotNav | undefined {
  const pos = order.indexOf(active);
  if (pos < 0 || order.length < 2) return undefined;
  return {
    label: `${pos + 1} / ${order.length}`,
    ariaLabel: `Slot ${pos + 1} of ${order.length}`,
    onPrev: pos > 0 ? () => open(order[pos - 1]) : undefined,
    onNext: pos < order.length - 1 ? () => open(order[pos + 1]) : undefined,
  };
}
