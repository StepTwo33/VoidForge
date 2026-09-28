"use client";

import { useEffect, useRef } from "react";
import { getLoadouts } from "@/lib/builds/loadouts";
import type { SavedBuild } from "@/lib/builds/build-storage";
import type { Loadout } from "@/lib/types";

type BuilderKind = "weapon" | "warframe" | "companion" | "modular";

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

/**
 * Open a loadout slot in a builder via `?loadout=<id>&slot=<slot>`.
 * Wraps the slot payload as a SavedBuild and hands it to the builder's
 * existing restore function. Uses an empty build id so saving from the
 * builder creates a new standalone build instead of overwriting anything.
 */
export function useLoadoutSlotFromUrl(
  kind: BuilderKind,
  apply: (build: SavedBuild) => void,
  ready = true,
) {
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!ready || appliedRef.current) return;
    queueMicrotask(() => {
      if (appliedRef.current) return;
      const params = new URLSearchParams(window.location.search);
      const loadoutId = params.get("loadout");
      if (!loadoutId) return;
      const slot = params.get("slot");

      const loadout = getLoadouts().find((l) => l.id === loadoutId);
      const data = loadout ? extractSlotData(loadout, kind, slot) : undefined;
      if (!loadout || !data) return;

      appliedRef.current = true;
      apply({
        id: "",
        name: loadout.name,
        type: kind,
        createdAt: loadout.createdAt,
        updatedAt: loadout.updatedAt,
        data,
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("loadout");
      url.searchParams.delete("slot");
      const qs = url.searchParams.toString();
      window.history.replaceState({}, "", qs ? `${url.pathname}?${qs}` : url.pathname);
    });
  }, [kind, apply, ready]);
}
