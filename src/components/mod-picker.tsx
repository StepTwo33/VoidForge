"use client";

import { useState, useMemo, useEffect } from "react";
import { Mod, getRivenStatsForCategory } from "@/lib/types";
import { isAuraMod } from "@/lib/mods/aura-mods";
import { isArchmeleeMod } from "@/lib/mods/archmelee-mods";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search, Plus, X } from "lucide-react";
import { PolarityIcon } from "@/components/polarity-icon";
import { getModImage, getArcaneImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { getBlockedModIds } from "@/data/mod-exclusions";
import { cleanModDescription, getModStatDisplayLines } from "@/lib/display/mod-display";

function isRivenMod(mod: Mod): boolean {
  return mod.subCategory === "riven" || mod.id.startsWith("riven_");
}

import {
  isWarframeAugment,
  warframeAugmentEligibleInBuilder,
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

export type SlotType = WeaponModSlotType | "aura" | "exilus" | "companion_precept";

interface ModPickerProps {
  open: boolean;
  onClose: () => void;
  mods: Mod[];
  category: string;
  slotType?: SlotType;
  equippedModIds: string[];
  onSelect: (mod: Mod, rank: number) => void;
  onSelectRiven?: (mod: Mod, stats: Record<string, number>) => void;
  weaponCategory?: string; // for riven stat pool filtering
  /** When set, filters mods by beam / AoE / projectile wiki compatibility tags. */
  weapon?: Pick<Weapon, "id" | "name" | "category" | "triggerType">;
  warframeId?: string; // When set, augment mods are filtered to this warframe + universal
  archwingId?: string; // When set, archwing augments are filtered to this archwing
  /** When provided, shows Mods / Arcanes tabs for browsing warframe arcanes. */
  arcaneCatalog?: Mod[];
  /** Restrict picker to mods-only or arcanes-only (warframe builder). */
  pickerMode?: "mods" | "arcanes";
  initialBrowseTab?: "mods" | "arcanes";
  equippedArcaneIds?: string[];
}

export function ModPicker({ open, onClose, mods, category, slotType = "regular", equippedModIds, onSelect, onSelectRiven, weaponCategory, weapon, warframeId, archwingId, arcaneCatalog, pickerMode = "mods", initialBrowseTab = "mods", equippedArcaneIds = [] }: ModPickerProps) {
  const [search, setSearch] = useState("");
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [selectedRank, setSelectedRank] = useState(0);
  const [browseTab, setBrowseTab] = useState<"mods" | "arcanes">(initialBrowseTab);
  // Riven stat configuration state
  const [rivenStats, setRivenStats] = useState<Record<string, number>>({});
  const [rivenStatKey, setRivenStatKey] = useState("");
  const [rivenStatValue, setRivenStatValue] = useState("");
  const [statFilter, setStatFilter] = useState<ModStatFilterId>("all");
  const [sortId, setSortId] = useState<ModSortId>("name");

  const statFilterOptions = useMemo(
    () => getModPickerStatFilters(category, slotType),
    [category, slotType],
  );

  const blockedByExclusion = useMemo(() => getBlockedModIds(equippedModIds), [equippedModIds]);

  const weaponModProfile = useMemo(
    () => (weapon ? getWeaponModProfile(weapon) : undefined),
    [weapon],
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
        if (m.subCategory === "riven") {
          const wc = weaponCategory.toLowerCase();
          if (m.id === "riven_rifle") return ["rifle", "bow", "primary", "launcher"].includes(wc);
          if (m.id === "riven_shotgun") return wc === "shotgun";
          if (m.id === "riven_pistol") return ["pistol", "secondary", "dual_pistols"].includes(wc);
          if (m.id === "riven_melee") return wc === "melee";
          return false;
        }
        return modEligibleForWeaponSlot(m, category, weaponCategory, "regular", weaponModProfile);
      });
    } else {
      categoryMods = mods.filter((m) => {
        if (isSetBonusMod(m)) return false;
        // Stance mods should never appear in regular mod slots
        if (m.category === "stance") return false;
        // Necramech/archwing/operator mods should not leak into normal weapon builders
        if (m.category === "necramech" || m.category === "archwing" || m.category === "operator") return false;
        if (category !== "archmelee" && (m.category === "archmelee" || isArchmeleeMod(m))) return false;
        if (category !== "archgun" && m.category === "archgun") return false;
        // Riven mods: only show the riven matching the specific weapon category
        if (m.subCategory === "riven") {
          if (!weaponCategory) return false;
          const wc = weaponCategory.toLowerCase();
          if (m.id === "riven_rifle") return ["rifle", "bow", "primary", "launcher"].includes(wc);
          if (m.id === "riven_shotgun") return wc === "shotgun";
          if (m.id === "riven_pistol") return ["pistol", "secondary", "dual_pistols"].includes(wc);
          if (m.id === "riven_melee") return wc === "melee";
          return false;
        }
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

    categoryMods = categoryMods.filter((m) => m.category !== "arcane");

    // Warframe ability augments: only in warframe builder for the selected frame (+ universal).
    categoryMods = categoryMods.filter((m) =>
      warframeAugmentEligibleInBuilder(m, category, warframeId),
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
        categoryMods = categoryMods.filter((m) => !isAuraMod(m) && !isWarframeExilusMod(m));
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
  }, [mods, category, slotType, search, warframeId, archwingId, weaponCategory, weaponModProfile, weapon?.id]);

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

  useEffect(() => {
    if (open) {
      setBrowseTab(pickerMode === "arcanes" ? "arcanes" : initialBrowseTab);
      setStatFilter("all");
      setSortId("name");
    }
  }, [open, initialBrowseTab, pickerMode]);

  const handleSelectMod = (mod: Mod) => {
    setSelectedMod(mod);
    setSelectedRank(mod.maxRank);
  };

  const handleConfirm = () => {
    if (selectedMod) {
      if (isRivenMod(selectedMod) && onSelectRiven) {
        onSelectRiven(selectedMod, rivenStats);
      } else {
        onSelect(selectedMod, selectedRank);
      }
      setSelectedMod(null);
      setSelectedRank(0);
      setRivenStats({});
      setRivenStatKey("");
      setRivenStatValue("");
      setSearch("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedMod(null);
    setSelectedRank(0);
    setRivenStats({});
    setRivenStatKey("");
    setRivenStatValue("");
    setSearch("");
    setStatFilter("all");
    setSortId("name");
    setBrowseTab(initialBrowseTab);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] min-h-0 flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
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
        </DialogHeader>

        {selectedMod ? (
          <div className="p-6 space-y-4">
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
                <div className="flex-1 flex items-center justify-between">
                  <h4 className="font-semibold">{selectedMod.name}</h4>
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

            {isRivenMod(selectedMod) ? (() => {
              const rivenPool = getRivenStatsForCategory(weaponCategory || category);
              return (
                <div className="space-y-3">
                  <div className="text-[10px] text-purple-700/70 uppercase tracking-wider dark:text-purple-300/60">
                    Configure Riven Stats (up to 4)
                  </div>
                  {Object.keys(rivenStats).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(rivenStats).map(([key, value]) => {
                        const statDef = rivenPool.find((s) => s.key === key);
                        return (
                          <div key={key} className="flex items-center justify-between text-xs p-1.5 rounded bg-background">
                            <span className="text-muted-foreground">{statDef?.label || key}</span>
                            <div className="flex items-center gap-2">
                              <span className={value >= 0 ? "text-green-400" : "text-red-400"}>
                                {value >= 0 ? "+" : ""}{(value * 100).toFixed(1)}%
                              </span>
                              <button
                                onClick={() => setRivenStats((prev) => { const n = { ...prev }; delete n[key]; return n; })}
                                className="text-muted-foreground hover:text-red-400 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {Object.keys(rivenStats).length < 4 && (
                    <div className="flex gap-2">
                      <select
                        value={rivenStatKey}
                        onChange={(e) => setRivenStatKey(e.target.value)}
                        className="flex-1 text-xs bg-background border border-border rounded px-2 py-1.5"
                      >
                        <option value="">Select stat...</option>
                        {rivenPool.filter((s) => !(s.key in rivenStats)).map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="% value"
                        value={rivenStatValue}
                        onChange={(e) => setRivenStatValue(e.target.value)}
                        className="w-24 text-xs bg-background border border-border rounded px-2 py-1.5"
                      />
                      <button
                        onClick={() => {
                          if (!rivenStatKey || !rivenStatValue) return;
                          const val = parseFloat(rivenStatValue) / 100;
                          setRivenStats((prev) => ({ ...prev, [rivenStatKey]: val }));
                          setRivenStatKey("");
                          setRivenStatValue("");
                        }}
                        disabled={!rivenStatKey || !rivenStatValue}
                        className="px-3 py-1.5 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })() : (
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

            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedMod(null)}
              >
                Back
              </Button>
              <Button
                onClick={handleConfirm}
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
                      "flex-1 text-xs py-1.5 rounded-md transition-colors",
                      browseTab === "mods" ? "bg-background text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Mods
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrowseTab("arcanes")}
                    className={cn(
                      "flex-1 text-xs py-1.5 rounded-md transition-colors",
                      browseTab === "arcanes" ? "bg-background text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
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
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {statFilterOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setStatFilter(option.id)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ring-1",
                        statFilter === option.id
                          ? "bg-primary text-primary-foreground ring-primary/40"
                          : "bg-secondary/40 text-muted-foreground ring-border hover:text-foreground hover:bg-secondary/70",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {!isArcaneBrowse && (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {displayedMods.length} mods available
                  </p>
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    Sort
                    <select
                      value={sortId}
                      onChange={(e) => setSortId(e.target.value as ModSortId)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground"
                    >
                      <option value="name">Name (A–Z)</option>
                      <option value="drain-asc">Drain (low → high)</option>
                      <option value="drain-desc">Drain (high → low)</option>
                    </select>
                  </label>
                </div>
              )}
              {isArcaneBrowse && (
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredArcanes.length} arcanes available
                </p>
              )}
            </div>

            <div
              className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 min-h-0"
              role="listbox"
              aria-label={isArcaneBrowse ? "Arcane list" : "Mod list"}
            >
              <div className="space-y-1">
                {isArcaneBrowse ? filteredArcanes.map((arcane) => {
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GameAssetImage src={getArcaneImage(arcane.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                          <span className="text-sm font-medium">{arcane.name}</span>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[arcane.rarity])}>
                          {arcane.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {arcane.description.replace(/<[^>]+>/g, "").substring(0, 100)}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GameAssetImage src={getModImage(mod.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                          <PolarityIcon polarity={mod.polarity} size={14} />
                          <span className="text-sm font-medium">{mod.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {!hasStats && (
                            <span className="text-[10px] text-yellow-500/70">utility</span>
                          )}
                          <Badge variant="outline" className={cn("text-[10px]", RARITY_BADGE_COLORS[mod.rarity])}>
                            {mod.rarity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {mod.description.replace(/<[^>]+>/g, "").substring(0, 80)}
                      </p>
                      {isEquipped && (
                        <span className="text-[10px] text-muted-foreground">Already equipped</span>
                      )}
                      {isBlocked && !isEquipped && (
                        <span className="text-[10px] text-orange-400">Variant equipped</span>
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
