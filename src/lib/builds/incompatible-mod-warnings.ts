"use client";

import { toast } from "sonner";
import { modsMap } from "@/data/mods";
import {
  dropIncompatibleMods,
  dropIncompatibleModsDeep,
  type DroppedIncompatibleMod,
} from "@/lib/mods/mod-incompatibility";
import type { SavedBuild } from "@/lib/builds/build-storage";
import {
  dropRetiredMods,
  dropRetiredModsDeep,
  migrateRenamedMods,
  migrateRenamedModsDeep,
  RENAMED_MOD_OLD_NAMES,
  RENAMED_MOD_UPDATE,
  type MigratedMod,
  type RetiredModDrop,
  type RetiredModReason,
} from "@/lib/mods/known-mods";

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

/** "Link Shields → Link Redirection (Update 34)" lines for renamed mods found in an old build. */
export function describeMigratedMods(migrated: readonly MigratedMod[]): string[] {
  return migrated.map((m) => {
    const from = RENAMED_MOD_OLD_NAMES[m.fromModId] ?? m.fromModId;
    const update = RENAMED_MOD_UPDATE[m.fromModId];
    const when = update ? ` (${update})` : "";
    return m.droppedAsDuplicate
      ? `${from} removed (${modName(m.toModId)} is already equipped)`
      : `${from} → ${modName(m.toModId)}${when}`;
  });
}

export function warnMigratedMods(migrated: readonly MigratedMod[]): void {
  if (!migrated.length) return;
  toast.info("Updated renamed mods", {
    id: "renamed-mods-migrated",
    description: `${describeMigratedMods(migrated).join("; ")}.`,
    duration: 9000,
  });
}

const RETIRED_REASON_LABEL: Record<RetiredModReason, string> = {
  archived: "removed from the game",
  no_source: "not a real mod",
  unreleased: "never released",
  focus_2: "old Focus 2.0 node",
  conclave: "Conclave only",
};

/** "Comet Rounds (Conclave only)" lines. */
export function describeRetiredMods(dropped: readonly RetiredModDrop[]): string[] {
  return dropped.map((d) => `${d.name} (${RETIRED_REASON_LABEL[d.reason]})`);
}

export function warnRetiredMods(dropped: readonly RetiredModDrop[]): void {
  if (!dropped.length) return;
  toast.warning(dropped.length === 1 ? "Removed 1 mod that can't be used in PvE" : `Removed ${dropped.length} mods that can't be used in PvE`, {
    id: "retired-mods-dropped",
    description: `${describeRetiredMods(dropped).join("; ")}.`,
    duration: 9000,
  });
}

/**
 * Clean a saved build before it is applied to a builder: migrate renamed mods (Link Shields →
 * Link Redirection, Shotgun Spazz → Shotgun Barrage, …), drop removed and Conclave-only mods,
 * then drop mods the game won't equip together. Shows a toast for each kind of change.
 */
export function cleanLoadedBuild(build: SavedBuild): SavedBuild {
  const renamed = migrateRenamedModsDeep(build.data, modsMap);
  warnMigratedMods(renamed.migrated);
  const retired = dropRetiredModsDeep(renamed.data, modsMap);
  warnRetiredMods(retired.dropped);
  const { data, dropped } = dropIncompatibleModsDeep(retired.data);
  warnDroppedIncompatibleMods(dropped);
  if (!dropped.length && !renamed.migrated.length && !retired.dropped.length) return build;
  return { ...build, data };
}

/** Clean one mod list (share codes, pasted imports): migrate renames, drop retired, drop incompatible; warn. */
export function cleanLoadedMods<T extends { modId: string; slotIndex?: number; rank?: number }>(mods: readonly T[]): T[] {
  const renamed = migrateRenamedMods(mods, modsMap);
  warnMigratedMods(renamed.migrated);
  const retired = dropRetiredMods(renamed.mods, modsMap);
  warnRetiredMods(retired.dropped);
  const { mods: kept, dropped } = dropIncompatibleMods(retired.mods);
  warnDroppedIncompatibleMods(dropped);
  return kept;
}
