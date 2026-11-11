import type { ModularBuildData } from "../types";
import type { Weapon } from "../types";
import {
  buildKitgun,
  buildZaw,
  kitgunChambers,
  kitgunGrips,
  kitgunLoaders,
  zawStrikes,
  zawGrips,
  zawLinks,
  ampPrisms,
  ampScaffolds,
  ampBraces,
} from "@/data/modular-weapons";

/** Assemble a `Weapon` from saved modular parts, or null if parts are invalid. */
export function weaponFromModularData(data: ModularBuildData): Weapon | null {
  try {
    if (data.modularType === "kitgun") {
      const c = kitgunChambers.find((x) => x.id === data.parts.chamber);
      const g = kitgunGrips.find((x) => x.id === data.parts.grip);
      const l = kitgunLoaders.find((x) => x.id === data.parts.loader);
      if (!c || !g || !l) return null;
      return buildKitgun(c, g, l);
    }
    if (data.modularType === "zaw") {
      const s = zawStrikes.find((x) => x.id === data.parts.strike);
      const g = zawGrips.find((x) => x.id === data.parts.grip);
      const l = zawLinks.find((x) => x.id === data.parts.link);
      if (!s || !g || !l) return null;
      return buildZaw(s, g, l);
    }
    if (data.modularType === "amp") {
      const p = ampPrisms.find((x) => x.id === data.parts.prism);
      if (!p) return null;
      const sc = data.parts.scaffold ? ampScaffolds.find((x) => x.id === data.parts.scaffold) : null;
      const br = data.parts.brace ? ampBraces.find((x) => x.id === data.parts.brace) : null;
      return {
        ...p,
        name: `${p.name}${sc ? ` / ${sc.name}` : ""}${br ? ` / ${br.name}` : ""}`,
        arcaneSlots: 2,
        arcaneType: "amp",
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function modularBuildDisplayName(data: ModularBuildData): string {
  const custom = data.customName?.trim();
  if (custom) return custom;
  const w = weaponFromModularData(data);
  if (w?.name) return w.name;
  return `${data.modularType} build`;
}

export type LoadoutWeaponSlot = "primary" | "secondary" | "melee";

/**
 * Guess which loadout weapon slot this modular belongs in (for migration / defaults).
 * Amps are Operator-only and never infer into a weapon column.
 */
export function inferModularLoadoutSlot(data: ModularBuildData): LoadoutWeaponSlot | null {
  if (data.modularType === "amp") return null;
  const w = weaponFromModularData(data);
  if (data.modularType === "zaw") return "melee";
  if (!w) return "secondary";
  if (w.category === "melee" || w.triggerType === "Melee") return "melee";
  if (["secondary", "pistol", "dual_pistols"].includes(w.category)) return "secondary";
  return "primary";
}

export type ModularTypeName = "kitgun" | "zaw" | "amp";

/**
 * Type buttons shown in the Modular Builder. Amp is hidden while editing a
 * weapon slot (Primary / Secondary / Melee). A legacy Amp already in that slot
 * stays visible so the user can see it and switch away.
 */
export function visibleModularTypes(
  currentType: ModularTypeName,
  editingWeaponSlot: boolean,
): ModularTypeName[] {
  if (!editingWeaponSlot) return ["kitgun", "zaw", "amp"];
  if (currentType === "amp") return ["kitgun", "zaw", "amp"];
  return ["kitgun", "zaw"];
}

/** Whether a modular saved build is valid for a loadout weapon column. */
export function modularBuildMatchesLoadoutSlot(data: ModularBuildData, slot: LoadoutWeaponSlot): boolean {
  if (data.modularType === "amp") return false;
  const w = weaponFromModularData(data);
  if (!w) return false;
  if (slot === "melee") {
    return w.category === "melee" || w.triggerType === "Melee" || data.modularType === "zaw";
  }
  if (slot === "secondary") {
    return ["secondary", "pistol", "dual_pistols"].includes(w.category);
  }
  // primary
  return ["primary", "rifle", "shotgun", "bow", "launcher"].includes(w.category) || w.category === "primary";
}
