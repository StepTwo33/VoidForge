"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const BUILD_STORAGE_KEY = "framehub_build_id";
const CHECK_INTERVAL_MS = 60_000;
const RELOAD_DELAY_MS = 1200;

function isStaleClientError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("failed to find server action") ||
    m.includes("chunkloaderror") ||
    m.includes("loading chunk") ||
    m.includes("older or newer deployment")
  );
}

function reloadSoon(reason: string) {
  toast.info(reason, { duration: RELOAD_DELAY_MS + 500 });
  window.setTimeout(() => {
    window.location.reload();
  }, RELOAD_DELAY_MS);
}

/**
 * Detects a new production build and reloads the tab so users get fresh JS/HTML
 * without needing a manual hard refresh (Ctrl+Shift+R).
 */
export function DeployRefreshNotifier() {
  const reloading = useRef(false);

  useEffect(() => {
    const triggerReload = (reason: string) => {
      if (reloading.current) return;
      reloading.current = true;
      reloadSoon(reason);
    };

    const checkBuild = async () => {
      try {
        const res = await fetch("/api/build-meta", { cache: "no-store" });
        if (!res.ok) return;
        const { buildId } = (await res.json()) as { buildId?: string };
        if (!buildId) return;

        const prev = sessionStorage.getItem(BUILD_STORAGE_KEY);
        sessionStorage.setItem(BUILD_STORAGE_KEY, buildId);
        if (prev && prev !== buildId) {
          triggerReload("Frame Hub was updated. Reloading…");
        }
      } catch {
        // ignore network errors during deploy
      }
    };

    checkBuild();
    const interval = setInterval(checkBuild, CHECK_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void checkBuild();
    };
    document.addEventListener("visibilitychange", onVisible);

    const onError = (event: ErrorEvent) => {
      if (isStaleClientError(event.message || "")) {
        triggerReload("This page is from an older version. Reloading…");
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const msg =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason ?? "");
      if (isStaleClientError(msg)) {
        triggerReload("This page is from an older version. Reloading…");
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
