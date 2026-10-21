"use client";

import { toast } from "sonner";
import { modsMap } from "@/data/mods";
import {
  dropIncompatibleMods,
  dropIncompatibleModsDeep,
  type DroppedIncompatibleMod,
} from "@/lib/mods/mod-incompatibility";
import type { SavedBuild } from "@/lib/builds/build-storage";

const modName = (id: string) => modsMap.get(id)?.name ?? id;

/** Human-readable lines, e.g. "Primed Redirection (can't be equipped with Redirection)". */
export function describeDroppedMods(dropped: readonly DroppedIncompatibleMod[]): string[] {
  return dropped.map((d) => `${modName(d.modId)} (can't be equipped with ${modName(d.keptModId)})`);
}

export function warnDroppedIncompatibleMods(dropped: readonly DroppedIncompatibleMod[]): void {
  if (!dropped.length) return;
  toast.warning(dropped.length === 1 ? "Removed 1 mod the game won't allow" : `Removed ${dropped.length} mods the game won't allow`, {
    id: "incompatible-mods-dropped",
    description: `${describeDroppedMods(dropped).join("; ")}. The first one in the build was kept.`,
    duration: 9000,
  });
}

/** Clean a saved build before it is applied to a builder; warns when something was dropped. */
export function cleanLoadedBuild(build: SavedBuild): SavedBuild {
  const { data, dropped } = dropIncompatibleModsDeep(build.data);
  if (!dropped.length) return build;
  warnDroppedIncompatibleMods(dropped);
  return { ...build, data };
}

/** Clean one mod list (share codes, pasted imports) and warn. */
export function cleanLoadedMods<T extends { modId: string; slotIndex?: number }>(mods: readonly T[]): T[] {
  const { mods: kept, dropped } = dropIncompatibleMods(mods);
  warnDroppedIncompatibleMods(dropped);
  return kept;
}
