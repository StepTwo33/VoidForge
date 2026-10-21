"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Deterministic JSON for comparing build snapshots: object keys are sorted so a rebuilt object
 * with the same values (but a different key insertion order) compares equal. `undefined` values
 * are dropped like JSON.stringify does. Returns null for "nothing selected yet".
 */
export function stableBuildSnapshot(value: unknown): string | null {
  if (value == null) return null;
  return JSON.stringify(value, (_key, v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.fromEntries(Object.keys(v as Record<string, unknown>).sort().map((k) => [k, (v as Record<string, unknown>)[k]]));
    }
    return v;
  });
}

/** True when the current build differs from the last loaded/saved one. */
export function isBuildDirty(current: string | null, baseline: string | null): boolean {
  return current !== baseline;
}

/** Delay before reading the "clean" snapshot so load-time state updates and effects settle. */
const SETTLE_MS = 60;

/**
 * Tracks unsaved builder changes. Pass the current build snapshot (`stableBuildSnapshot(data)`);
 * call `markClean()` right after a build is loaded or saved. An empty builder (snapshot null)
 * is clean; a freshly configured build that was never saved is dirty.
 */
export function useUnsavedChanges(snapshot: string | null): { dirty: boolean; markClean: () => void } {
  const latestRef = useRef(snapshot);
  const [baseline, setBaseline] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    latestRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const markClean = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setBaseline(latestRef.current);
    }, SETTLE_MS);
  }, []);

  return { dirty: isBuildDirty(snapshot, baseline), markClean };
}
/** Tailwind classes for a Save button with unsaved changes (primary token, pulse respects reduced motion). */
export const SAVE_DIRTY_CLASS =
  "relative bg-primary/10 text-primary ring-1 ring-primary/50 hover:bg-primary/15";
/** Small pulsing dot rendered inside the dirty Save button. */
export const SAVE_DIRTY_DOT_CLASS =
  "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse";
