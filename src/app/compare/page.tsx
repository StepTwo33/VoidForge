"use client";

import { useState, useEffect, useMemo } from "react";
import { PageShell, PageMain, PageHero, FilterChip, ContentPanel, EmptyState } from "@/components/page-shell";
import { WeaponStatsPanel } from "@/components/stats-panel";
import { useWeapons, useMods } from "@/lib/weapons/use-data";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { Weapon, Mod, CalculatedStats, EquippedMod, Loadout } from "@/lib/types";
import { ModSlotCard } from "@/components/mod-slot";
import { ModPicker, type SlotType as ModPickerSlotType } from "@/components/mod-picker";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, ArrowLeftRight, ChevronDown, ChevronRight, X,
  Shield, Swords, Crosshair, Dog, Trophy, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getWeaponImage, getWarframeImage, getCompanionImage } from "@/lib/display/images";
import { GameAssetImage } from "@/components/game-asset-image";
import { getLoadouts } from "@/lib/builds/loadouts";
import { calcLoadoutStats, fmtDamageNum, scenarioSimParams, type LoadoutStatsResult } from "@/lib/builds/loadout-stats";
import { isPrimaryWeaponCategory } from "@/lib/mods/mod-weapon-eligibility";
import { isCompanionWeaponCategory } from "@/lib/weapons/companion-weapons";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import { toast } from "sonner";

/* ─── Shared helpers ─── */

function weaponImageForName(name: string, weapons: Weapon[]): string {
  const w = weapons.find((x) => x.name === name);
  return getWeaponImage(name, w ? { category: w.category } : undefined);
}

function fmtNum(n: number, decimals = 0): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(decimals);
}

function CompareRow({ label, a, b, higher = "green", format }: {
  label: string;
  a: number | null;
  b: number | null;
  higher?: "green" | "red";
  format?: (v: number) => string;
}) {
  const fmtFn = format || ((v: number) => fmtNum(v));
  const diff = (a ?? 0) - (b ?? 0);
  const aWins = higher === "green" ? diff > 0.01 : diff < -0.01;
  const bWins = higher === "green" ? diff < -0.01 : diff > 0.01;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 py-0.5 items-center">
      <span className={cn(
        "text-xs font-mono text-right",
        a === null ? "text-muted-foreground/30" : aWins ? "text-green-400 font-bold" : bWins ? "text-red-400" : ""
      )}>
        {a !== null ? fmtFn(a) : "–"}
      </span>
      <span className="text-[10px] text-muted-foreground text-center w-16 sm:w-28 truncate">{label}</span>
      <span className={cn(
        "text-xs font-mono",
        b === null ? "text-muted-foreground/30" : bWins ? "text-green-400 font-bold" : aWins ? "text-red-400" : ""
      )}>
        {b !== null ? fmtFn(b) : "–"}
      </span>
    </div>
  );
}

/* ─── Tab type ─── */

type CompareTab = "build" | "loadout";

const WEAPON_EXILUS_SLOT_INDEX = 8;

/* ─── Build vs Build tab ─── */

interface BuildSlot {
  weapon: Weapon | null;
  mods: EquippedMod[];
  stats: CalculatedStats | null;
}

function BuildCompareTab() {
  const allWeapons = useWeapons();
  const { mods: allMods, modsMap } = useMods();
  const [builds, setBuilds] = useState<[BuildSlot, BuildSlot]>([
    { weapon: null, mods: [], stats: null },
    { weapon: null, mods: [], stats: null },
  ]);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [activeModSlot, setActiveModSlot] = useState(0);
  const [modPickerOpen, setModPickerOpen] = useState(false);
  const [modPickerSlotType, setModPickerSlotType] = useState<ModPickerSlotType>("regular");
  const [weaponPickerOpen, setWeaponPickerOpen] = useState<0 | 1 | null>(null);
  const [weaponSearch, setWeaponSearch] = useState("");

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
    if (weaponSearch.trim()) {
      const q = weaponSearch.toLowerCase();
      weapons = weapons.filter((w) => w.name.toLowerCase().includes(q));
    }
    return weapons.sort((a, b) => a.name.localeCompare(b.name));
  }, [weaponSearch, allWeapons]);

  const recalcStats = (weapon: Weapon | null, mods: EquippedMod[]): CalculatedStats | null => {
    if (!weapon) return null;
    const modSlots = mods.map((m) => ({ modId: m.modId, rank: m.rank, slotIndex: m.slotIndex }));
    return calculateWeaponBuild(weapon, modSlots, modsMap);
  };

  const selectWeapon = (side: 0 | 1, weapon: Weapon) => {
    if (isCompanionWeaponCategory(weapon.category)) {
      toast.error("Companion weapons are built in Companion Builder", {
        action: {
          label: "Open",
          onClick: () => {
            window.location.href = "/companion-builder";
          },
        },
      });
      return;
    }
    setBuilds((prev) => {
      const next = [...prev] as [BuildSlot, BuildSlot];
      next[side] = { weapon, mods: [], stats: recalcStats(weapon, []) };
      return next;
    });
    setWeaponPickerOpen(null);
    setWeaponSearch("");
  };

  const addMod = (mod: Mod, rank: number) => {
    setBuilds((prev) => {
      const next = [...prev] as [BuildSlot, BuildSlot];
      const slot = next[activeSlot];
      const filtered = slot.mods.filter((m) => m.slotIndex !== activeModSlot);
      const newMods = [...filtered, {
        modId: mod.id, modName: mod.name, rank, slotIndex: activeModSlot,
        polarity: mod.polarity, drain: mod.drain,
      }];
      next[activeSlot] = { ...slot, mods: newMods, stats: recalcStats(slot.weapon, newMods) };
      return next;
    });
  };

  const removeMod = (side: 0 | 1, slotIndex: number) => {
    setBuilds((prev) => {
      const next = [...prev] as [BuildSlot, BuildSlot];
      const slot = next[side];
      const newMods = slot.mods.filter((m) => m.slotIndex !== slotIndex);
      next[side] = { ...slot, mods: newMods, stats: recalcStats(slot.weapon, newMods) };
      return next;
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {([0, 1] as const).map((side) => {
          const build = builds[side];
          return (
            <div key={side} className="space-y-4">
              {/* Weapon Selector */}
              {weaponPickerOpen === side ? (
                <ContentPanel>
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search weapons..."
                      value={weaponSearch}
                      onChange={(e) => setWeaponSearch(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <button onClick={() => setWeaponPickerOpen(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="space-y-0.5">
                      {filteredWeapons.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => selectWeapon(side, w)}
                          className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-accent transition-colors flex items-center gap-2"
                        >
                          <GameAssetImage src={getWeaponImage(w.name, { category: w.category })} alt="" width={24} height={24} className="w-6 h-6 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                          <span className="font-medium">{w.name}</span>
                          <span className="text-muted-foreground ml-auto text-[10px]">{w.category}</span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </ContentPanel>
              ) : (
                <button
                  onClick={() => setWeaponPickerOpen(side)}
                  className={cn(
                    "w-full text-left border rounded-xl p-4 transition-all",
                    build.weapon
                      ? "border-border bg-card hover:border-primary/50"
                      : "border-dashed border-border/50 hover:border-primary/50 bg-card/50"
                  )}
                >
                  {build.weapon ? (
                    <div className="flex items-center gap-3">
                      <GameAssetImage src={getWeaponImage(build.weapon.name, { category: build.weapon.category })} alt="" width={40} height={40} className="w-10 h-10 rounded object-contain bg-muted/20 shrink-0" hideOnError />
                      <div>
                        <div className="text-lg font-bold">{build.weapon.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{build.weapon.category} • {build.weapon.triggerType}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <ChevronDown className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Select Build {side + 1}</span>
                    </div>
                  )}
                </button>
              )}

              {/* Mod Slots */}
              {build.weapon && (() => {
                const w = build.weapon;
                const isPri = isPrimaryWeaponCategory(w.category);
                const isSec = ["pistol", "secondary", "dual_pistols"].includes(w.category);
                const isMel = ["melee", "archmelee"].includes(w.category);
                const hasExilus = isPri || isSec || isMel;
                const nSlots = w.modSlots + (hasExilus ? 1 : 0);
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {Array.from({ length: nSlots }, (_, i) => {
                      const equipped = build.mods.find((m) => m.slotIndex === i);
                      const mod = equipped ? modsMap.get(equipped.modId) : null;
                      const isExilus = hasExilus && i === WEAPON_EXILUS_SLOT_INDEX;
                      return (
                        <ModSlotCard
                          key={i}
                          slotIndex={i}
                          mod={mod ?? null}
                          rank={equipped?.rank ?? 0}
                          label={isExilus ? "Exilus" : undefined}
                          onAdd={() => {
                            setActiveSlot(side);
                            setActiveModSlot(i);
                            setModPickerSlotType(
                              isPri && isExilus
                                ? "weapon_exilus_primary"
                                : isSec && isExilus
                                  ? "weapon_exilus_secondary"
                                  : isMel && isExilus
                                    ? "weapon_exilus_melee"
                                    : "regular",
                            );
                            setModPickerOpen(true);
                          }}
                          onRemove={() => removeMod(side, i)}
                        />
                      );
                    })}
                  </div>
                );
              })()}

              {/* Stats */}
              <WeaponStatsPanel
                stats={build.stats}
                weapon={build.weapon}
                isMelee={build.weapon?.category === "melee" || build.weapon?.triggerType === "Melee"}
              />
            </div>
          );
        })}
      </div>

      {/* Side-by-side comparison table */}
      {builds[0].stats && builds[1].stats && (
        <ContentPanel className="mt-8">
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground">COMPARISON</h2>
          <div className="space-y-1">
            <CompareRow label="Total Damage" a={builds[0].stats.totalDamage} b={builds[1].stats.totalDamage} format={(v) => v.toFixed(1)} />
            <CompareRow label="Critical Chance" a={builds[0].stats.criticalChance * 100} b={builds[1].stats.criticalChance * 100} format={(v) => `${v.toFixed(1)}%`} />
            <CompareRow label="Critical Multiplier" a={builds[0].stats.criticalMultiplier} b={builds[1].stats.criticalMultiplier} format={(v) => `${v.toFixed(1)}x`} />
            <CompareRow label="Status Chance" a={builds[0].stats.statusChance * 100} b={builds[1].stats.statusChance * 100} format={(v) => `${v.toFixed(1)}%`} />
            <CompareRow label="Fire Rate" a={builds[0].stats.fireRate} b={builds[1].stats.fireRate} format={(v) => v.toFixed(2)} />
            <CompareRow label="Multishot" a={builds[0].stats.multishot} b={builds[1].stats.multishot} format={(v) => v.toFixed(2)} />
            <CompareRow label="Burst DPS" a={builds[0].stats.burstDps} b={builds[1].stats.burstDps} />
            <CompareRow label="Sustained DPS" a={builds[0].stats.sustainedDps} b={builds[1].stats.sustainedDps} />
          </div>
        </ContentPanel>
      )}

      <ModPicker
        open={modPickerOpen}
        onClose={() => setModPickerOpen(false)}
        mods={allMods}
        category={builds[activeSlot].weapon ? getModCategory(builds[activeSlot].weapon!.category) : "primary"}
        slotType={modPickerSlotType}
        equippedModIds={builds[activeSlot].mods.map((m) => m.modId)}
        onSelect={addMod}
        weaponCategory={builds[activeSlot].weapon?.category}
        weapon={builds[activeSlot].weapon ?? undefined}
      />
    </>
  );
}

/* ─── Loadout vs Loadout tab ─── */

type SlotType =
  | "warframe"
  | "primary"
  | "secondary"
  | "melee"
  | "exalted"
  | "exaltedMelee"
  | "companion";

const SLOT_META: Record<SlotType, { label: string; icon: React.ReactNode; color: string }> = {
  warframe:  { label: "Warframe",  icon: <Shield className="h-4 w-4" />,    color: "text-purple-400" },
  primary:   { label: "Primary",   icon: <Crosshair className="h-4 w-4" />, color: "text-blue-400" },
  secondary: { label: "Secondary", icon: <Crosshair className="h-4 w-4" />, color: "text-cyan-400" },
  melee:     { label: "Melee",     icon: <Swords className="h-4 w-4" />,    color: "text-orange-400" },
  exalted:   { label: "Exalted",   icon: <Sparkles className="h-4 w-4" />,  color: "text-violet-400" },
  exaltedMelee: { label: "Exalted Melee", icon: <Sparkles className="h-4 w-4" />, color: "text-fuchsia-400" },
  companion: { label: "Companion", icon: <Dog className="h-4 w-4" />,       color: "text-green-400" },
};

function sustainedDps(entry: LoadoutStatsResult["primary"]): number {
  if (!entry) return 0;
  return entry.ttk?.sustainedDps ?? entry.stats.sustainedDps;
}

function SlotSection({ slot, a, b, weapons }: {
  slot: SlotType;
  a: LoadoutStatsResult;
  b: LoadoutStatsResult;
  weapons: Weapon[];
}) {
  const [open, setOpen] = useState(true);
  const meta = SLOT_META[slot];

  if (slot === "warframe") {
    const wA = a.warframe;
    const wB = b.warframe;
    if (!wA && !wB) return null;

    const renderWarframeCompare = (
      labelA: string,
      statsA: typeof wA extends null ? never : NonNullable<typeof wA>["stats"] | undefined,
      labelB: string,
      statsB: typeof wB extends null ? never : NonNullable<typeof wB>["stats"] | undefined,
      subtitle?: string,
    ) => (
      <>
        {subtitle && <p className="text-[10px] text-muted-foreground mb-2 font-medium">{subtitle}</p>}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-2 items-center">
          <div className="flex items-center gap-2 justify-end">
            {statsA && <GameAssetImage src={getWarframeImage(labelA)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/30 hidden sm:block" hideOnError />}
            <span className="text-xs font-medium">{labelA || "–"}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">vs</span>
          <div className="flex items-center gap-2">
            {statsB && <GameAssetImage src={getWarframeImage(labelB)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/30 hidden sm:block" hideOnError />}
            <span className="text-xs font-medium">{labelB || "–"}</span>
          </div>
        </div>
        <CompareRow label="Health" a={statsA?.totalHealth ?? null} b={statsB?.totalHealth ?? null} />
        <CompareRow label="Shield" a={statsA?.totalShield ?? null} b={statsB?.totalShield ?? null} />
        <CompareRow label="Armor" a={statsA?.totalArmor ?? null} b={statsB?.totalArmor ?? null} />
        <CompareRow label="Energy" a={statsA?.totalEnergy ?? null} b={statsB?.totalEnergy ?? null} />
        <CompareRow label="Sprint" a={statsA?.totalSprint ?? null} b={statsB?.totalSprint ?? null} format={(v) => v.toFixed(2)} />
        <CompareRow label="EHP" a={statsA?.effectiveHealth ?? null} b={statsB?.effectiveHealth ?? null} />
        <CompareRow label="DR %" a={statsA?.damageReduction ?? null} b={statsB?.damageReduction ?? null} format={(v) => `${v.toFixed(1)}%`} />
        <CompareRow label="Strength" a={statsA ? statsA.abilityStrength * 100 : null} b={statsB ? statsB.abilityStrength * 100 : null} format={(v) => `${v.toFixed(0)}%`} />
        <CompareRow label="Duration" a={statsA ? statsA.abilityDuration * 100 : null} b={statsB ? statsB.abilityDuration * 100 : null} format={(v) => `${v.toFixed(0)}%`} />
        <CompareRow label="Efficiency" a={statsA ? statsA.abilityEfficiency * 100 : null} b={statsB ? statsB.abilityEfficiency * 100 : null} format={(v) => `${v.toFixed(0)}%`} />
        <CompareRow label="Range" a={statsA ? statsA.abilityRange * 100 : null} b={statsB ? statsB.abilityRange * 100 : null} format={(v) => `${v.toFixed(0)}%`} />
      </>
    );

    const formIds = new Set([
      ...(wA?.forms?.map((f) => f.id) ?? []),
      ...(wB?.forms?.map((f) => f.id) ?? []),
    ]);

    return (
      <ContentPanel padding={false} className="overflow-hidden">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          <span className={meta.color}>{meta.icon}</span>
          {meta.label}
        </button>
        {open && (
          <div className="px-4 pb-4 space-y-4">
            {formIds.size > 0
              ? Array.from(formIds).map((formId) => {
                  const fA = wA?.forms?.find((f) => f.id === formId);
                  const fB = wB?.forms?.find((f) => f.id === formId);
                  return (
                    <div key={formId}>
                      {renderWarframeCompare(
                        fA ? `${wA!.name} (${fA.label})` : wA?.name ?? "–",
                        fA?.stats ?? wA?.stats,
                        fB ? `${wB!.name} (${fB.label})` : wB?.name ?? "–",
                        fB?.stats ?? wB?.stats,
                        fA?.label ?? fB?.label,
                      )}
                    </div>
                  );
                })
              : renderWarframeCompare(wA?.name ?? "–", wA?.stats, wB?.name ?? "–", wB?.stats)}
          </div>
        )}
      </ContentPanel>
    );
  }

  if (slot === "companion") {
    const cA = a.companion;
    const cB = b.companion;
    if (!cA && !cB) return null;
    return (
      <ContentPanel padding={false} className="overflow-hidden">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          <span className={meta.color}>{meta.icon}</span>
          {meta.label}
        </button>
        {open && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-2 items-center">
              <div className="flex items-center gap-2 justify-end">
                {cA && <GameAssetImage src={getCompanionImage(cA.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/30 hidden sm:block" hideOnError />}
                <span className="text-xs font-medium">{cA?.name || "–"}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">vs</span>
              <div className="flex items-center gap-2">
                {cB && <GameAssetImage src={getCompanionImage(cB.name)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/30 hidden sm:block" hideOnError />}
                <span className="text-xs font-medium">{cB?.name || "–"}</span>
              </div>
            </div>
            <CompareRow label="Health" a={cA?.bodyStats.totalHealth ?? null} b={cB?.bodyStats.totalHealth ?? null} />
            <CompareRow label="Shield" a={cA?.bodyStats.totalShield ?? null} b={cB?.bodyStats.totalShield ?? null} />
            <CompareRow label="Armor" a={cA?.bodyStats.totalArmor ?? null} b={cB?.bodyStats.totalArmor ?? null} />
            <CompareRow label="EHP" a={cA?.bodyStats.effectiveHealth ?? null} b={cB?.bodyStats.effectiveHealth ?? null} />
            <CompareRow label="Weapon DPS" a={cA?.weapon ? sustainedDps(cA.weapon) : null} b={cB?.weapon ? sustainedDps(cB.weapon) : null} />
          </div>
        )}
      </ContentPanel>
    );
  }

  // Weapon slots
  const wA = a[slot];
  const wB = b[slot];
  if (!wA && !wB) return null;
  const sA = wA?.stats ?? null;
  const sB = wB?.stats ?? null;

  return (
    <ContentPanel padding={false} className="overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <span className={meta.color}>{meta.icon}</span>
        {meta.label}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-2 items-center">
            <div className="flex items-center gap-2 justify-end">
              {wA && <GameAssetImage src={weaponImageForName(wA.name, weapons)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/30 hidden sm:block" hideOnError />}
              <span className="text-xs font-medium">{wA?.name || "–"}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">vs</span>
            <div className="flex items-center gap-2">
              {wB && <GameAssetImage src={weaponImageForName(wB.name, weapons)} alt="" width={32} height={32} className="w-8 h-8 rounded object-contain bg-muted/30 hidden sm:block" hideOnError />}
              <span className="text-xs font-medium">{wB?.name || "–"}</span>
            </div>
          </div>
          <CompareRow label="Total Damage" a={sA?.totalDamage ?? null} b={sB?.totalDamage ?? null} format={(v) => v.toFixed(1)} />
          <CompareRow label="Crit Chance" a={sA ? sA.criticalChance * 100 : null} b={sB ? sB.criticalChance * 100 : null} format={(v) => `${v.toFixed(1)}%`} />
          <CompareRow label="Crit Multi" a={sA?.criticalMultiplier ?? null} b={sB?.criticalMultiplier ?? null} format={(v) => `${v.toFixed(1)}x`} />
          <CompareRow label="Status Chance" a={sA ? sA.statusChance * 100 : null} b={sB ? sB.statusChance * 100 : null} format={(v) => `${v.toFixed(1)}%`} />
          <CompareRow label="Fire Rate" a={sA?.fireRate ?? null} b={sB?.fireRate ?? null} format={(v) => v.toFixed(2)} />
          <CompareRow label="Multishot" a={sA?.multishot ?? null} b={sB?.multishot ?? null} format={(v) => v.toFixed(2)} />
          <CompareRow label="Magazine" a={sA?.magazine ?? null} b={sB?.magazine ?? null} format={(v) => v.toFixed(0)} />
          <CompareRow label="Reload" a={sA?.reloadTime ?? null} b={sB?.reloadTime ?? null} format={(v) => `${v.toFixed(2)}s`} higher="red" />
          <div className="border-t border-border/50 my-1" />
          <CompareRow label="Burst DPS" a={sA?.burstDps ?? null} b={sB?.burstDps ?? null} />
          <CompareRow label="Sustained DPS" a={sA?.sustainedDps ?? null} b={sB?.sustainedDps ?? null} />
        </div>
      )}
    </ContentPanel>
  );
}

function LoadoutCompareTab() {
  const allWeapons = useWeapons();
  const [loadouts, setLoadouts] = useState<Loadout[]>([]);
  const [selA, setSelA] = useState<string | null>(null);
  const [selB, setSelB] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setLoadouts(getLoadouts()));
  }, []);

  const loadoutA = useMemo(() => loadouts.find((l) => l.id === selA) ?? null, [loadouts, selA]);
  const loadoutB = useMemo(() => loadouts.find((l) => l.id === selB) ?? null, [loadouts, selB]);

  const simParams = useMemo(() => scenarioSimParams("midFight"), []);

  const statsA = useMemo(
    () => (loadoutA ? calcLoadoutStats(loadoutA, { simParams, allWeapons }) : null),
    [loadoutA, simParams, allWeapons],
  );
  const statsB = useMemo(
    () => (loadoutB ? calcLoadoutStats(loadoutB, { simParams, allWeapons }) : null),
    [loadoutB, simParams, allWeapons],
  );

  const aggregate = useMemo(() => {
    if (!statsA || !statsB) return null;
    const sumDps = (s: LoadoutStatsResult) =>
      sustainedDps(s.primary) +
      sustainedDps(s.secondary) +
      sustainedDps(s.melee) +
      sustainedDps(s.exalted) +
      sustainedDps(s.exaltedMelee);
    const totalDpsA = sumDps(statsA);
    const totalDpsB = sumDps(statsB);
    const ehpA = statsA.warframe?.stats.effectiveHealth ?? 0;
    const ehpB = statsB.warframe?.stats.effectiveHealth ?? 0;
    return { totalDpsA, totalDpsB, ehpA, ehpB };
  }, [statsA, statsB]);

  if (loadouts.length < 2) {
    return (
      <EmptyState
        icon={Trophy}
        title="Need more loadouts"
        description="You need at least 2 saved loadouts to compare them side by side."
      >
        <a href="/loadouts" className="text-sm font-medium text-primary hover:underline">Go to Loadouts →</a>
      </EmptyState>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Loadout Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-start mb-6">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">LOADOUT A</label>
          <select
            value={selA ?? ""}
            onChange={(e) => setSelA(e.target.value || null)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select loadout...</option>
            {loadouts.map((l) => (
              <option key={l.id} value={l.id} disabled={l.id === selB}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className="pt-5 hidden sm:block">
          <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">LOADOUT B</label>
          <select
            value={selB ?? ""}
            onChange={(e) => setSelB(e.target.value || null)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select loadout...</option>
            {loadouts.map((l) => (
              <option key={l.id} value={l.id} disabled={l.id === selA}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate Summary */}
      {aggregate && (
        <ContentPanel className="mb-6 border-primary/30 bg-primary/5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-primary" /> AGGREGATE
          </h2>
          <CompareRow label="Total Sustained DPS" a={aggregate.totalDpsA} b={aggregate.totalDpsB} format={(v) => fmtDamageNum(v)} />
          <CompareRow label="Warframe EHP" a={aggregate.ehpA} b={aggregate.ehpB} />
        </ContentPanel>
      )}

      {/* Per-Slot Comparisons */}
      {statsA && statsB && (
        <div className="space-y-4">
          {(["warframe", "primary", "secondary", "melee", "exalted", "exaltedMelee", "companion"] as SlotType[]).map((slot) => (
            <SlotSection key={slot} slot={slot} a={statsA} b={statsB} weapons={allWeapons} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */

export default function ComparePage() {
  const [tab, setTab] = useState<CompareTab>("build");

  return (
    <PageShell>
      <PageMain maxWidth="xl">
        <PageHero
          icon={ArrowLeftRight}
          accent="teal"
          title="Compare"
          description="Pit two weapon builds or full loadouts against each other side by side."
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip active={tab === "build"} onClick={() => setTab("build")}>
            <Swords className="mr-1.5 inline h-3.5 w-3.5" />
            Build vs Build
          </FilterChip>
          <FilterChip active={tab === "loadout"} onClick={() => setTab("loadout")}>
            <Shield className="mr-1.5 inline h-3.5 w-3.5" />
            Loadout vs Loadout
          </FilterChip>
        </div>

        {tab === "build" ? <BuildCompareTab /> : <LoadoutCompareTab />}
      </PageMain>
    </PageShell>
  );
}
