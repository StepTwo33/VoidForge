"use client";

import { useEffect, useReducer } from "react";
import { Info, X } from "lucide-react";
import {
  INITIAL_IMPORT_CAPACITY_NOTICE,
  IMPORT_CAPACITY_NOTICE_TITLE,
  importCapacityNoticeReducer,
  importCapacityNoticeText,
  shouldShowImportCapacityNotice,
  type CapacityFigures,
} from "@/lib/builds/import-capacity-notice";

/**
 * Tracks the "capacity may look over" notice for one builder. `key` identifies the item being
 * built (so opening another item clears it); `used`/`max` are the capacity numbers the builder
 * already shows.
 */
export function useImportCapacityNotice(key: string, used: number, max: number) {
  const [state, dispatch] = useReducer(importCapacityNoticeReducer, INITIAL_IMPORT_CAPACITY_NOTICE);
  useEffect(() => {
    dispatch({ type: "measure", key, used, max });
  }, [key, used, max]);
  return {
    visible: shouldShowImportCapacityNotice(state, key, used, max),
    /** Call right after applying an import. */
    arm: () => dispatch({ type: "imported", key }),
    dismiss: () => dispatch({ type: "dismiss" }),
    clear: () => dispatch({ type: "clear" }),
  };
}

/** Calm, dismissible note shown under the capacity bar right after an import. */
export function ImportCapacityNotice({ used, max, onDismiss }: CapacityFigures & { onDismiss: () => void }) {
  return (
    <div
      role="status"
      data-testid="import-capacity-notice"
      className="mb-3 flex items-start gap-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-2.5 text-xs text-foreground"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{IMPORT_CAPACITY_NOTICE_TITLE}</p>
        <p className="mt-0.5 text-muted-foreground">{importCapacityNoticeText({ used, max })}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss capacity note"
        className="-m-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
