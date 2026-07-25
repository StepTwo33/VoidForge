/**
 * Pure helpers for loadout slot labels, mod counts, and build pickers.
 */

import { getSavedBuilds, type SavedBuild, type WarframeBuildData, type WeaponBuildData, type ModularBuildData } from "@/lib/builds/build-storage";
import type { Loadout, EquippedArchonShard, Weapon } from "@/lib/types";
import { modularBuildDisplayName, modularBuildMatchesLoadoutSlot } from "@/lib/builds/modular-resolve";
import type { LoadoutWeaponSlot } from "@/lib/builds/modular-resolve";
import { allWarframes } from "@/data/warframes";
import { allCompanions } from "@/data/companions";
import { getWarframeImage, getWeaponImage, getCompanionImage } from "@/lib/display/images";
import { dualFormModCountSummary, isDualFormWarframe } from "@/lib/builds/dual-form-warframes";

export type LoadoutSlotType = "warframe" | "primary" | "secondary" | "melee" | "companion";

export const LOADOUT_SLOT_CONFIG: Record<
  LoadoutSlotType,
  { label: string; color: string; builderPath: string }
> = {
  warframe: { label: "Warframe", color: "purple", builderPath: "/warframe-builder" },
  primary: { label: "Primary", color: "blue", builderPath: "/weapon-builder" },
  secondary: { label: "Secondary", color: "cyan", builderPath: "/weapon-builder" },
  melee: { label: "Melee", color: "orange", builderPath: "/weapon-builder" },
  companion: { label: "Companion", color: "green", builderPath: "/companion-builder" },
};

/** Tailwind cannot compile dynamic `border-${color}` — use explicit classes. */
export const LOADOUT_SLOT_CARD_STYLES: Record<LoadoutSlotType, string> = {
  warframe: "border-purple-500/35 bg-purple-500/[0.07]",
  primary: "border-blue-500/35 bg-blue-500/[0.07]",
  secondary: "border-cyan-500/35 bg-cyan-500/[0.07]",
  melee: "border-orange-500/35 bg-orange-500/[0.07]",
  companion: "border-green-500/35 bg-green-500/[0.07]",
};

export const EMPTY_LOADOUT_SHARDS: (EquippedArchonShard | null)[] = [null, null, null, null, null];

export function pickerSlotToWeaponSlot(slot: LoadoutSlotType): LoadoutWeaponSlot | null {
  if (slot === "primary" || slot === "secondary" || slot === "melee") return slot;
  return null;
}

export function getWeaponSlotPayload(
  loadout: Loadout,
  w: LoadoutWeaponSlot,
):
  | { kind: "weapon"; weaponId: string }
  | { kind: "modular"; data: ModularBuildData & { slot: LoadoutWeaponSlot } }
  | null {
  if (loadout.modularBuild?.slot === w) {
    return { kind: "modular", data: loadout.modularBuild };
  }
  const weaponId =
    w === "primary"
      ? loadout.primaryBuild?.weaponId
      : w === "secondary"
        ? loadout.secondaryBuild?.weaponId
        : loadout.meleeBuild?.weaponId;
  if (!weaponId) return null;
  return { kind: "weapon", weaponId };
}

export function getSlotLabelName(
  loadout: Loadout,
  slot: LoadoutSlotType,
  weaponsMap: Map<string, Weapon>,
): string | null {
  switch (slot) {
    case "warframe": {
      const id = loadout.warframeBuild?.warframeId;
      return id ? allWarframes.find((w) => w.id === id)?.name ?? id : null;
    }
    case "companion": {
      const id = loadout.companionBuild?.companionId;
      return id ? allCompanions.find((c) => c.id === id)?.name ?? id : null;
    }
    case "primary":
    case "secondary":
    case "melee": {
      const w = pickerSlotToWeaponSlot(slot);
      if (!w) return null;
      const p = getWeaponSlotPayload(loadout, w);
      if (!p) return null;
      if (p.kind === "modular") return modularBuildDisplayName(p.data);
      return weaponsMap.get(p.weaponId)?.name ?? p.weaponId;
    }
  }
}

export function getSlotModCount(loadout: Loadout, slot: LoadoutSlotType): number {
  switch (slot) {
    case "warframe": {
      const wb = loadout.warframeBuild;
      if (!wb) return 0;
      if (isDualFormWarframe(wb.warframeId)) {
        const primary = wb.mods?.length ?? 0;
        const secondary = Object.values(wb.dualFormBuilds ?? {}).reduce(
          (sum, s) => sum + (s.mods?.length ?? 0),
          0,
        );
        return primary + secondary;
      }
      return wb.mods?.length ?? 0;
    }
    case "companion":
      return (loadout.companionBuild?.mods?.length ?? 0) + (loadout.companionBuild?.weaponMods?.length ?? 0);
    case "primary":
    case "secondary":
    case "melee": {
      const w = pickerSlotToWeaponSlot(slot);
      if (!w) return 0;
      const p = getWeaponSlotPayload(loadout, w);
      if (!p) return 0;
      if (p.kind === "modular") {
        const mods = p.data.mods?.length ?? 0;
        const arcanes = p.data.arcaneIds?.filter(Boolean).length ?? 0;
        return mods + arcanes;
      }
      const build =
        w === "primary" ? loadout.primaryBuild : w === "secondary" ? loadout.secondaryBuild : loadout.meleeBuild;
      return build?.mods?.length ?? 0;
    }
  }
}

export function getSlotModLabel(loadout: Loadout, slot: LoadoutSlotType): string {
  if (slot === "warframe" && loadout.warframeBuild && isDualFormWarframe(loadout.warframeBuild.warframeId)) {
    return dualFormModCountSummary(loadout.warframeBuild as WarframeBuildData);
  }
  const count = getSlotModCount(loadout, slot);
  return `${count} mod${count === 1 ? "" : "s"} filled`;
}

export function getSlotImage(slot: LoadoutSlotType, name: string, weaponsMap: Map<string, Weapon>): string {
  switch (slot) {
    case "warframe":
      return getWarframeImage(name);
    case "primary":
    case "secondary":
    case "melee": {
      const w = [...weaponsMap.values()].find((x) => x.name === name);
      return getWeaponImage(name, w ? { category: w.category } : undefined);
    }
    case "companion":
      return getCompanionImage(name);
  }
}

export function getWeaponCategories(slot: LoadoutSlotType): string[] {
  switch (slot) {
    case "primary":
      return ["primary", "rifle", "shotgun", "bow", "launcher"];
    case "secondary":
      return ["secondary", "pistol", "dual_pistols"];
    case "melee":
      return ["melee"];
    default:
      return [];
  }
}

export function listSavedBuildsForSlot(
  slot: LoadoutSlotType,
  weaponsMap: Map<string, Weapon>,
): SavedBuild[] {
  const all = getSavedBuilds();
  if (slot === "warframe") return all.filter((b) => b.type === "warframe");
  if (slot === "companion") return all.filter((b) => b.type === "companion");
  const cats = getWeaponCategories(slot);
  return all.filter((b) => {
    if (b.type !== "weapon") return false;
    const d = b.data as WeaponBuildData;
    const w = weaponsMap.get(d.weaponId);
    return !!w && cats.includes(w.category);
  });
}

export function listModularBuildsForWeaponSlot(slot: LoadoutSlotType): SavedBuild[] {
  const ws = pickerSlotToWeaponSlot(slot);
  if (!ws) return [];
  return getSavedBuilds("modular").filter((b) => {
    if (b.type !== "modular") return false;
    return modularBuildMatchesLoadoutSlot(b.data as ModularBuildData, ws);
  });
}

export function normalizeWarframeBuild(d: WarframeBuildData): NonNullable<Loadout["warframeBuild"]> {
  const shards =
    d.shards && d.shards.length === 5 ? d.shards : ([...EMPTY_LOADOUT_SHARDS] as (EquippedArchonShard | null)[]);
  return {
    ...d,
    shards,
    arcaneIds: d.arcaneIds ?? [null, null],
    slotPolarities: d.slotPolarities ?? {},
    exaltedMods: d.exaltedMods ?? [],
    exaltedSlotPolarities: d.exaltedSlotPolarities ?? {},
    exaltedArcaneIds: d.exaltedArcaneIds ?? [null, null],
    exaltedMeleeMods: d.exaltedMeleeMods ?? [],
    exaltedMeleeSlotPolarities: d.exaltedMeleeSlotPolarities ?? {},
    exaltedMeleeArcaneIds: d.exaltedMeleeArcaneIds ?? [null, null],
    dualFormBuilds: d.dualFormBuilds,
  };
}
