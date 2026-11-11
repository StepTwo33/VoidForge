import { allWeapons } from "@/data/weapons";
import type { Loadout, ModularBuildData } from "@/lib/types";
import { withLoadoutSlot, type LoadoutEditContext, loadoutSlotLabel } from "@/lib/builds/loadout-edit-context";
import { getWeaponCategories, getWeaponSlotPayload, withLoadoutModular } from "@/lib/builds/loadout-slot-helpers";
import {
  modularBuildDisplayName,
  modularBuildMatchesLoadoutSlot,
  weaponFromModularData,
  type LoadoutWeaponSlot,
} from "@/lib/builds/modular-resolve";

const WEAPON_SLOTS: LoadoutWeaponSlot[] = ["primary", "secondary", "melee"];

export function isLoadoutWeaponSlot(slot: string | null | undefined): slot is LoadoutWeaponSlot {
  return slot === "primary" || slot === "secondary" || slot === "melee";
}

/** The loadout column this modular weapon belongs in, or null (Amp, unfinished kit). */
export function slotForModularBuild(data: ModularBuildData): LoadoutWeaponSlot | null {
  if (data.modularType === "amp") return null;
  const w = weaponFromModularData(data);
  if (!w) return null;
  for (const slot of WEAPON_SLOTS) {
    if (modularBuildMatchesLoadoutSlot(data, slot)) return slot;
  }
  return null;
}

type LoadoutWeaponBuild = NonNullable<Loadout["primaryBuild"]>;

export type SlotOccupant =
  | { kind: "modular"; data: ModularBuildData; name: string }
  | { kind: "weapon"; data: LoadoutWeaponBuild; name: string };

export type ModularSlotMoveAction = "move" | "swap" | "replace";

export interface ModularSlotMovePlan {
  action: ModularSlotMoveAction;
  from: LoadoutWeaponSlot;
  to: LoadoutWeaponSlot;
  itemLabel: string;
  displaced?: SlotOccupant;
  title: string;
  description: string;
  confirmLabel: string;
  /** Replace removes an occupant that cannot move to the vacated slot. */
  destructive: boolean;
  toastTitle: string;
  toastDescription: string;
}

function typeLabel(data: ModularBuildData): string {
  if (data.modularType === "kitgun") return "Kitgun";
  if (data.modularType === "zaw") return "Zaw";
  if (data.modularType === "amp") return "Amp";
  return "modular weapon";
}

function occupantName(kind: "modular" | "weapon", data: ModularBuildData | LoadoutWeaponBuild): string {
  if (kind === "modular") return modularBuildDisplayName(data as ModularBuildData);
  const id = (data as LoadoutWeaponBuild).weaponId;
  return allWeapons.find((w) => w.id === id)?.name ?? id;
}

export function getSlotOccupant(loadout: Loadout, slot: LoadoutWeaponSlot): SlotOccupant | null {
  const payload = getWeaponSlotPayload(loadout, slot);
  if (!payload) return null;
  if (payload.kind === "modular") {
    const data: ModularBuildData = { ...payload.data };
    delete (data as { slot?: string }).slot;
    return { kind: "modular", data, name: occupantName("modular", data) };
  }
  const build =
    slot === "primary" ? loadout.primaryBuild : slot === "secondary" ? loadout.secondaryBuild : loadout.meleeBuild;
  if (!build) return null;
  return { kind: "weapon", data: build, name: occupantName("weapon", build) };
}

function occupantFitsSlot(occupant: SlotOccupant, slot: LoadoutWeaponSlot): boolean {
  if (occupant.kind === "modular") return modularBuildMatchesLoadoutSlot(occupant.data, slot);
  const weapon = allWeapons.find((w) => w.id === occupant.data.weaponId);
  if (!weapon) return false;
  return getWeaponCategories(slot).includes(weapon.category);
}

/**
 * What happens if this modular item, currently in `from`, is written to the slot it
 * actually belongs in (`to`). `from === to` returns null (no move).
 *
 * Occupied destination:
 * - occupant can legally go in `from` → swap the two
 * - otherwise → replace the occupant (it leaves the loadout)
 */
export function planModularSlotMove(
  loadout: Loadout,
  from: LoadoutWeaponSlot,
  data: ModularBuildData,
  options?: { loadoutName?: string; reason?: string },
): ModularSlotMovePlan | null {
  const to = slotForModularBuild(data);
  if (!to || to === from) return null;
  const itemLabel = typeLabel(data);
  const fromLabel = loadoutSlotLabel(from);
  const toLabel = loadoutSlotLabel(to);
  const loadoutName = options?.loadoutName;
  const inLoadout = loadoutName ? ` of “${loadoutName}”` : "";
  const reason = options?.reason;
  const reasonLead = reason ? `${reason} will move this ${itemLabel}` : `This ${itemLabel} will move`;
  const dest = getSlotOccupant(loadout, to);

  if (!dest) {
    return {
      action: "move",
      from,
      to,
      itemLabel,
      title: `Move to the ${toLabel} slot?`,
      description: `${reasonLead} to the ${toLabel} slot${inLoadout}. The ${fromLabel} slot will be emptied.`,
      confirmLabel: `Move to ${toLabel}`,
      destructive: false,
      toastTitle: `Moved to the ${toLabel} slot`,
      toastDescription: `The ${itemLabel} is now in the ${toLabel} slot${inLoadout}. The ${fromLabel} slot is empty.`,
    };
  }

  if (occupantFitsSlot(dest, from)) {
    return {
      action: "swap",
      from,
      to,
      itemLabel,
      displaced: dest,
      title: `Swap into the ${toLabel} slot?`,
      description: `${reasonLead} to the ${toLabel} slot${inLoadout}, and ${dest.name} will move to the ${fromLabel} slot.`,
      confirmLabel: "Swap slots",
      destructive: false,
      toastTitle: `Swapped into the ${toLabel} slot`,
      toastDescription: `The ${itemLabel} is now in the ${toLabel} slot. ${dest.name} moved to the ${fromLabel} slot.`,
    };
  }

  return {
    action: "replace",
    from,
    to,
    itemLabel,
    displaced: dest,
    title: `Replace the ${toLabel} slot?`,
    description: `${reasonLead} to the ${toLabel} slot${inLoadout}. That slot already has ${dest.name}, which can't go in the ${fromLabel} slot, so ${dest.name} will be removed from the loadout.`,
    confirmLabel: `Replace ${toLabel}`,
    destructive: true,
    toastTitle: `Moved to the ${toLabel} slot`,
    toastDescription: `The ${itemLabel} replaced ${dest.name} in the ${toLabel} slot${inLoadout}. ${dest.name} is no longer in this loadout.`,
  };
}

function clearWeaponSlot(loadout: Loadout, slot: LoadoutWeaponSlot): Loadout {
  const next = withLoadoutModular(loadout, slot, null);
  const copy: Loadout = { ...next };
  if (slot === "primary") delete copy.primaryBuild;
  else if (slot === "secondary") delete copy.secondaryBuild;
  else delete copy.meleeBuild;
  return copy;
}

function modularCtx(slot: LoadoutWeaponSlot): LoadoutEditContext {
  return { loadoutId: "", loadoutName: "", kind: "modular", slot };
}

function weaponCtx(slot: LoadoutWeaponSlot): LoadoutEditContext {
  return { loadoutId: "", loadoutName: "", kind: "weapon", slot };
}

/** Apply a planned move, writing `data` into the destination slot. */
export function applyModularSlotMove(loadout: Loadout, plan: ModularSlotMovePlan, data: ModularBuildData): Loadout {
  if (plan.action === "swap" && plan.displaced) {
    // Capture the destination first; writing the modular item overwrites it.
    const displaced = plan.displaced;
    let next = withLoadoutSlot(loadout, modularCtx(plan.to), data);
    if (displaced.kind === "modular") {
      next = withLoadoutSlot(next, modularCtx(plan.from), displaced.data);
    } else {
      next = withLoadoutSlot(next, weaponCtx(plan.from), displaced.data);
    }
    return next;
  }
  const next = withLoadoutSlot(loadout, modularCtx(plan.to), data);
  return clearWeaponSlot(next, plan.from);
}

