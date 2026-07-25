"use client";

import { useEffect } from "react";

/**
 * Register the PWA service worker and force clients onto the newest SW after deploy.
 * updateViaCache: "none" prevents browsers from using a cached sw.js for up to 24h.
 */
export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let updateTimer: ReturnType<typeof setInterval> | undefined;

    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((registration) => {
        // Ask the browser to re-fetch sw.js periodically while the tab is open.
        updateTimer = setInterval(() => {
          void registration.update();
        }, 60_000);

        const askWaitingToActivate = () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        };

        if (registration.waiting) askWaitingToActivate();

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              askWaitingToActivate();
            }
          });
        });
      })
      .catch(() => {
        // Service worker registration failed — not critical
      });

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      if (updateTimer) clearInterval(updateTimer);
    };
  }, []);

  return null;
}
