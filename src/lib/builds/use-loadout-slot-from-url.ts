"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLoadouts } from "@/lib/builds/loadouts";
import type { SavedBuild } from "@/lib/builds/build-storage";
import type { Loadout } from "@/lib/types";
import {
  loadoutSlotLabel,
  type LoadoutBuilderKind,
  type LoadoutEditContext,
} from "@/lib/builds/loadout-edit-context";

type BuilderKind = LoadoutBuilderKind;

function extractSlotData(loadout: Loadout, kind: BuilderKind, slot: string | null): unknown {
  switch (kind) {
    case "warframe":
      return loadout.warframeBuild;
    case "companion":
      return loadout.companionBuild;
    case "modular": {
      const ws =
        slot === "secondary" || slot === "melee" || slot === "primary" ? slot : null;
      if (ws) {
        const fromMap = loadout.modularBuilds?.[ws];
        if (fromMap) return fromMap;
      }
      // Prefer matching slot on legacy single modular, else any modular for open.
      if (loadout.modularBuild) {
        if (!ws || loadout.modularBuild.slot === ws) return loadout.modularBuild;
      }
      if (ws && loadout.modularBuilds) {
        return (
          loadout.modularBuilds[ws] ??
          loadout.modularBuilds.primary ??
          loadout.modularBuilds.secondary ??
          loadout.modularBuilds.melee
        );
      }
      return loadout.modularBuilds?.primary ?? loadout.modularBuilds?.secondary ?? loadout.modularBuilds?.melee;
    }
    case "weapon":
      if (slot === "secondary") return loadout.secondaryBuild;
      if (slot === "melee") return loadout.meleeBuild;
      return loadout.primaryBuild;
  }
}

function resolveSlot(kind: BuilderKind, slot: string | null, data: unknown): string {
  if (kind === "warframe" || kind === "companion") return kind;
  if (slot === "primary" || slot === "secondary" || slot === "melee") return slot;
  if (kind === "modular") {
    const s = (data as { slot?: string } | undefined)?.slot;
    if (s === "secondary" || s === "melee") return s;
  }
  return "primary";
}

/** Identity of the loadout slot in the URL. A different slot must re-apply without a full reload. */
export function loadoutSlotApplyKey(loadoutId: string | null, slot: string | null): string | null {
  if (!loadoutId) return null;
  return `${loadoutId}:${slot ?? ""}`;
}

/** Remove `?loadout=&slot=` from the current URL, keeping any other params. */
export function stripLoadoutParams(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("loadout") && !url.searchParams.has("slot")) return;
  url.searchParams.delete("loadout");
  url.searchParams.delete("slot");
  const qs = url.searchParams.toString();
  window.history.replaceState(window.history.state, "", qs ? `${url.pathname}?${qs}` : url.pathname);
}

/**
 * Open a loadout slot in a builder via `?loadout=<id>&slot=<slot>`.
 * Wraps the slot payload as a SavedBuild (empty id, so "Save as new build"
 * never overwrites a saved build) and returns the loadout edit context so the
 * builder can show a banner and offer "Update loadout slot" on save.
 */
export function useLoadoutSlotFromUrl(
  kind: BuilderKind,
  apply: (build: SavedBuild) => void,
  ready = true,
): { context: LoadoutEditContext | null; clearContext: () => void } {
  const searchParams = useSearchParams();
  const loadoutId = searchParams.get("loadout");
  const slotParam = searchParams.get("slot");
  const appliedKey = useRef<string | null>(null);
  const [context, setContext] = useState<LoadoutEditContext | null>(null);

  useEffect(() => {
    if (!ready) return;
    const key = loadoutSlotApplyKey(loadoutId, slotParam);
    if (!key || appliedKey.current === key) return;
    const loadout = getLoadouts().find((l) => l.id === loadoutId);
    const data = loadout ? extractSlotData(loadout, kind, slotParam) : undefined;
    if (!loadout || !data) return;

    appliedKey.current = key;
    const slot = resolveSlot(kind, slotParam, data);
    queueMicrotask(() => {
      apply({
        id: "",
        name: `${loadout.name} (${loadoutSlotLabel(slot)})`,
        type: kind,
        createdAt: loadout.createdAt,
        updatedAt: loadout.updatedAt,
        data,
      });
      setContext({ loadoutId: loadout.id, loadoutName: loadout.name, kind, slot });
    });
    // ?loadout=&slot= stay in the URL, so a refresh reopens the same slot with its banner.
  }, [kind, apply, ready, loadoutId, slotParam]);

  /** Detach from the loadout: drop the banner and the URL params (a refresh stays detached). */
  const clearContext = useCallback(() => {
    appliedKey.current = null;
    setContext(null);
    stripLoadoutParams();
  }, []);
  return { context, clearContext };
}
