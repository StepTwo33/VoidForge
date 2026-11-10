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

/** Guess which loadout weapon slot this modular belongs in (for migration / defaults). */
export function inferModularLoadoutSlot(data: ModularBuildData): "primary" | "secondary" | "melee" {
  const w = weaponFromModularData(data);
  if (data.modularType === "zaw") return "melee";
  if (data.modularType === "amp") return "primary";
  if (!w) return "secondary";
  if (w.category === "melee" || w.triggerType === "Melee") return "melee";
  if (["secondary", "pistol", "dual_pistols"].includes(w.category)) return "secondary";
  return "primary";
}

export type LoadoutWeaponSlot = "primary" | "secondary" | "melee";

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
  return ["primary", "rifle", "shotgun", "bow", "launcher", "archgun"].includes(w.category) || w.category === "primary";
}
