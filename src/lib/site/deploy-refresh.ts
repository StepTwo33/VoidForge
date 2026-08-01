import { toast } from "sonner";

const PENDING_KEY = "framehub_deploy_refresh_pending";

let toastShown = false;

/** Soft prompt only — never force-reload; builders may have unsaved work. */
export function promptDeployRefresh(message = "Voidforge was updated"): void {
  if (typeof window === "undefined") return;
  if (toastShown || sessionStorage.getItem(PENDING_KEY) === "1") {
    toastShown = true;
    return;
  }
  toastShown = true;
  sessionStorage.setItem(PENDING_KEY, "1");

  toast.info(message, {
    description: "Refresh when you're ready so an in-progress build isn't cleared.",
    duration: Infinity,
    closeButton: true,
    action: {
      label: "Refresh",
      onClick: () => {
        sessionStorage.removeItem(PENDING_KEY);
        // Activate waiting service worker (if any), then reload.
        void navigator.serviceWorker?.getRegistration().then((reg) => {
          reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
          window.setTimeout(() => window.location.reload(), 100);
        }).catch(() => {
          window.location.reload();
        });
      },
    },
  });
}

export function clearDeployRefreshPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_KEY);
  toastShown = false;
}
