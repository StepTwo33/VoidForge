"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { promptDeployRefresh } from "@/lib/site/deploy-refresh";

const BUILD_STORAGE_KEY = "framehub_build_id";
const CHECK_INTERVAL_MS = 60_000;

function isStaleClientError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("failed to find server action") ||
    m.includes("chunkloaderror") ||
    m.includes("loading chunk") ||
    m.includes("older or newer deployment")
  );
}

/**
 * Detects a new production build and prompts to refresh.
 * Does not auto-reload — that would wipe in-progress builder state.
 */
export function DeployRefreshNotifier() {
  const prompted = useRef(false);

  useEffect(() => {
    const offerRefresh = (message: string) => {
      if (prompted.current) return;
      prompted.current = true;
      promptDeployRefresh(message);
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
          offerRefresh("Frame Hub was updated");
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
        offerRefresh("This tab is on an older version");
        toast.warning("Something failed because of an old page version. Refresh when you can.", {
          duration: 8000,
        });
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const msg =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason ?? "");
      if (isStaleClientError(msg)) {
        offerRefresh("This tab is on an older version");
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
