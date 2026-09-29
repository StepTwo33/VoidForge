"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { SavedBuild } from "@/lib/builds/build-storage";

const cloudBuildLoadedIdRef = { current: null as string | null };

export async function fetchCloudBuild(buildId: string): Promise<SavedBuild | null> {
  try {
    const res = await fetch(`/api/builds/${buildId}`);
    if (!res.ok) return null;
    const remote = await res.json();
    return {
      id: remote.id,
      name: remote.name,
      description: remote.description,
      isPublic: remote.isPublic,
      type: remote.type,
      createdAt: remote.createdAt,
      updatedAt: remote.updatedAt,
      data: remote.data,
    };
  } catch {
    return null;
  }
}

export function setCloudBuildInUrl(buildId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("buildId", buildId);
  window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
}

export function clearCloudBuildInUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("buildId");
  const qs = url.searchParams.toString();
  window.history.replaceState({}, "", qs ? `${url.pathname}?${qs}` : url.pathname);
  cloudBuildLoadedIdRef.current = null;
}

/** Call after loading a cloud build in-page so a later URL sync can recognize it. */
export function markCloudBuildLoaded(buildId: string) {
  cloudBuildLoadedIdRef.current = buildId;
}

/** Load a cloud build when the builder is opened via `?buildId=` (shareable, survives refresh). */
export function useCloudBuildFromUrl(
  expectedType: SavedBuild["type"],
  onLoad: (build: SavedBuild) => void
) {
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;
  /** Per mount — dedupes StrictMode double-invoke within the same mount cycle. */
  const loadedInMountRef = useRef<string | null>(null);

  const syncFromUrl = useCallback(async (opts?: { cancelled: () => boolean }) => {
    const buildId = new URLSearchParams(window.location.search).get("buildId");
    if (!buildId) {
      loadedInMountRef.current = null;
      cloudBuildLoadedIdRef.current = null;
      return;
    }
    if (loadedInMountRef.current === buildId) return;

    // Mark as attempted up-front so StrictMode's double effect invoke (same mount)
    // does not fire duplicate fetches/toasts. Cleared on unmount so reopening the
    // same ?buildId= after leaving the builder loads again.
    loadedInMountRef.current = buildId;
    cloudBuildLoadedIdRef.current = buildId;

    const build = await fetchCloudBuild(buildId);
    if (opts?.cancelled()) return;
    if (!build) {
      loadedInMountRef.current = null;
      cloudBuildLoadedIdRef.current = null;
      toast.error("Could not load build");
      return;
    }
    if (build.type !== expectedType) {
      loadedInMountRef.current = null;
      cloudBuildLoadedIdRef.current = null;
      toast.error("This build belongs in a different builder");
      return;
    }

    onLoadRef.current(build);
  }, [expectedType]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      void syncFromUrl({ cancelled: () => cancelled });
    });
    return () => {
      cancelled = true;
      loadedInMountRef.current = null;
      // Link nav away does not fire popstate — clear so the same buildId can load on re-entry.
      cloudBuildLoadedIdRef.current = null;
    };
  }, [syncFromUrl]);

  useEffect(() => {
    const onPopState = () => {
      loadedInMountRef.current = null;
      cloudBuildLoadedIdRef.current = null;
      void syncFromUrl();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [syncFromUrl]);
}
