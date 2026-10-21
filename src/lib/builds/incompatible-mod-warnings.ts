"use client";

import { toast } from "sonner";
import { modsMap } from "@/data/mods";
import {
  dropIncompatibleMods,
  dropIncompatibleModsDeep,
  type DroppedIncompatibleMod,
} from "@/lib/mods/mod-incompatibility";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { migrateRenamedModsDeep, RENAMED_MOD_OLD_NAMES, type MigratedMod } from "@/lib/mods/known-mods";

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

/** "Link Shields → Link Redirection" lines for renamed mods found in an old build. */
export function describeMigratedMods(migrated: readonly MigratedMod[]): string[] {
  return migrated.map((m) => {
    const from = RENAMED_MOD_OLD_NAMES[m.fromModId] ?? m.fromModId;
    return m.droppedAsDuplicate ? `${from} removed (${modName(m.toModId)} is already equipped)` : `${from} → ${modName(m.toModId)}`;
  });
}

/**
 * Clean a saved build before it is applied to a builder: migrate renamed mods (Link Shields →
 * Link Redirection, Link Armor → Link Fiber), then drop mods the game won't equip together.
 * Shows a toast for each kind of change.
 */
export function cleanLoadedBuild(build: SavedBuild): SavedBuild {
  const renamed = migrateRenamedModsDeep(build.data, modsMap);
  if (renamed.migrated.length) {
    toast.info("Updated renamed mods", {
      id: "renamed-mods-migrated",
      description: `${describeMigratedMods(renamed.migrated).join("; ")} (renamed in Update 34).`,
      duration: 9000,
    });
  }
  const { data, dropped } = dropIncompatibleModsDeep(renamed.data);
  warnDroppedIncompatibleMods(dropped);
  if (!dropped.length && !renamed.migrated.length) return build;
  return { ...build, data };
}

/** Clean one mod list (share codes, pasted imports) and warn. */
export function cleanLoadedMods<T extends { modId: string; slotIndex?: number }>(mods: readonly T[]): T[] {
  const { mods: kept, dropped } = dropIncompatibleMods(mods);
  warnDroppedIncompatibleMods(dropped);
  return kept;
}
