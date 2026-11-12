"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { extractBuildFromUrlAsync, type ShareableBuild } from "@/lib/builds/build-url";
import { reportUnreadableShareLink } from "@/lib/builds/share-link-errors";

/**
 * Apply a `?build=` share link once catalogs are ready.
 * Leaves the param in the URL (shareable, survives refresh). The same code is
 * not re-applied over later edits.
 *
 * `apply` may return `false` to skip the success toast (e.g. item not found).
 */
export function useShareBuildFromUrl(
  expectedType: ShareableBuild["type"],
  apply: (shared: ShareableBuild) => boolean | void,
  ready = true,
) {
  const appliedRef = useRef<string | null>(null);
  const applyRef = useRef(apply);

  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    queueMicrotask(() => {
      void (async () => {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("build");
        if (!raw) return;
        if (raw === appliedRef.current) return;
        const shared = await extractBuildFromUrlAsync(params);
        if (cancelled) return;
        if (!shared) {
          reportUnreadableShareLink(params);
          return;
        }
        if (shared.type !== expectedType) return;
        let ok: boolean | void = true;
        try {
          ok = applyRef.current(shared);
        } catch {
          appliedRef.current = raw;
          return;
        }
        appliedRef.current = raw;
        if (ok === false) return;
        toast.info("Build loaded from link");
      })();
    });
    return () => {
      cancelled = true;
    };
  }, [ready, expectedType]);
}
