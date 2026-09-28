import { toast } from "sonner";

/** Buy Me a Coffee tip page. */
export const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/StepTwo";

const DISMISS_KEY = "voidforge-support-tip-at";
const SAVE_COUNT_KEY = "voidforge-support-tip-saves";
/** Don't re-prompt for this long after dismiss / tip click. */
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
/** Show after this many successful saves (local + account). */
const MIN_SAVES = 2;
const TOAST_DELAY_MS = 1600;

/**
 * Soft tip prompt after a save. Rate-limited via localStorage so it stays rare.
 * Safe to call from client-only save paths; no-ops on the server.
 */
export function maybePromptSupportTip(): void {
  if (typeof window === "undefined") return;

  try {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || "0");
    if (dismissedAt && Date.now() - dismissedAt < COOLDOWN_MS) return;

    const saves = Number(localStorage.getItem(SAVE_COUNT_KEY) || "0") + 1;
    localStorage.setItem(SAVE_COUNT_KEY, String(saves));
    if (saves < MIN_SAVES) return;
  } catch {
    return;
  }

  window.setTimeout(() => {
    toast("Voidforge is free — tip if it helped", {
      description: "Optional. A coffee keeps the site online.",
      duration: 9000,
      action: {
        label: "Buy coffee",
        onClick: () => {
          markSupportTipSeen();
          window.open(BUY_ME_A_COFFEE_URL, "_blank", "noopener,noreferrer");
        },
      },
      cancel: {
        label: "Not now",
        onClick: () => markSupportTipSeen(),
      },
      onDismiss: () => markSupportTipSeen(),
    });
  }, TOAST_DELAY_MS);
}

function markSupportTipSeen(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}
