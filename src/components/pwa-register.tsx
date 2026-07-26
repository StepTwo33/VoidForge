"use client";

import { useEffect } from "react";
import { promptDeployRefresh } from "@/lib/site/deploy-refresh";

/**
 * Register the PWA service worker. New workers stay in waiting until the user
 * chooses Refresh (see deploy-refresh toast) so open builders are not wiped.
 */
export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let updateTimer: ReturnType<typeof setInterval> | undefined;

    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        updateTimer = setInterval(() => {
          void registration.update();
        }, 60_000);

        const onWaitingWorker = () => {
          if (registration.waiting && navigator.serviceWorker.controller) {
            promptDeployRefresh("Frame Hub was updated");
          }
        };

        if (registration.waiting) onWaitingWorker();

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              onWaitingWorker();
            }
          });
        });
      })
      .catch(() => {
        // Service worker registration failed — not critical
      });

    return () => {
      if (updateTimer) clearInterval(updateTimer);
    };
  }, []);

  return null;
}
