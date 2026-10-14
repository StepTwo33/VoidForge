import { getLoadouts, loadoutToBuildData, saveLoadout } from "@/lib/builds/loadouts";
import { saveCloudBuild, type SavedBuild } from "@/lib/builds/build-storage";
import type { Loadout, ModularBuildData } from "@/lib/types";
import type { CompanionBuildData, WarframeBuildData, WeaponBuildData } from "@/lib/builds/build-storage";
import { normalizeWarframeBuild, withLoadoutModular } from "@/lib/builds/loadout-slot-helpers";
import type { LoadoutWeaponSlot } from "@/lib/builds/modular-resolve";

export type LoadoutBuilderKind = "weapon" | "warframe" | "companion" | "modular";

/** Which loadout slot a builder was opened from (see useLoadoutSlotFromUrl). */
export interface LoadoutEditContext {
  loadoutId: string;
  loadoutName: string;
  kind: LoadoutBuilderKind;
  /** warframe | companion | primary | secondary | melee */
  slot: string;
}

const SLOT_LABELS: Record<string, string> = {
  warframe: "Warframe",
  companion: "Companion",
  primary: "Primary",
  secondary: "Secondary",
  melee: "Melee",
};

export function loadoutSlotLabel(slot: string): string {
  return SLOT_LABELS[slot] ?? slot;
}

/**
 * Return a copy of `loadout` with the builder payload written into the context's
 * slot, using the same rules as the Loadouts page picker (a weapon slot holds
 * either a regular weapon or a modular build, never both).
 */
export function withLoadoutSlot(loadout: Loadout, ctx: LoadoutEditContext, data: unknown): Loadout {
  switch (ctx.kind) {
    case "warframe":
      return { ...loadout, warframeBuild: normalizeWarframeBuild(data as WarframeBuildData) };
    case "companion": {
      const d = data as CompanionBuildData & { hasCatalyst?: boolean };
      return {
        ...loadout,
        companionBuild: {
          ...d,
          arcaneIds: d.arcaneIds ?? [null, null],
          slotPolarities: d.slotPolarities ?? {},
          weaponMods: d.weaponMods ?? [],
          hasCatalyst: d.hasCatalyst ?? false,
        },
      };
    }
    case "weapon": {
      const ws: LoadoutWeaponSlot = ctx.slot === "secondary" || ctx.slot === "melee" ? ctx.slot : "primary";
      const d = data as WeaponBuildData;
      const payload: NonNullable<Loadout["primaryBuild"]> = {
        ...d,
        arcaneIds: d.arcaneIds ?? [null, null],
        slotPolarities: d.slotPolarities ?? {},
      };
      const next = withLoadoutModular(loadout, ws, null);
      if (ws === "primary") next.primaryBuild = payload;
      else if (ws === "secondary") next.secondaryBuild = payload;
      else next.meleeBuild = payload;
      return next;
    }
    case "modular": {
      const ws: LoadoutWeaponSlot = ctx.slot === "secondary" || ctx.slot === "melee" ? ctx.slot : "primary";
      const next = withLoadoutModular(loadout, ws, data as ModularBuildData);
      if (ws === "primary") delete next.primaryBuild;
      if (ws === "secondary") delete next.secondaryBuild;
      if (ws === "melee") delete next.meleeBuild;
      return next;
    }
  }
}

export type UpdateLoadoutSlotResult =
  | { ok: true; loadout: Loadout; cloud: "synced" | "local-only" | "failed" }
  | { ok: false; reason: "missing" };

/**
 * Write the builder payload into its loadout slot. Always updates the local
 * copy; when the loadout is saved to the account (cloudId), re-saves it through
 * the existing build save endpoint (same call the Loadouts page uses).
 */
export async function updateLoadoutSlot(ctx: LoadoutEditContext, data: unknown): Promise<UpdateLoadoutSlotResult> {
  const current = getLoadouts().find((l) => l.id === ctx.loadoutId);
  if (!current) return { ok: false, reason: "missing" };
  const updated = withLoadoutSlot(current, ctx, data);
  saveLoadout(updated);
  if (!updated.cloudId) return { ok: true, loadout: updated, cloud: "local-only" };

  const build: SavedBuild = {
    id: updated.cloudId,
    name: updated.name,
    description: updated.description,
    isPublic: updated.isPublic ?? false,
    type: "loadout",
    createdAt: updated.createdAt,
    updatedAt: Date.now(),
    data: loadoutToBuildData(updated),
  };
  try {
    const res = await saveCloudBuild(build);
    return { ok: true, loadout: updated, cloud: res ? "synced" : "failed" };
  } catch {
    return { ok: true, loadout: updated, cloud: "failed" };
  }
}
