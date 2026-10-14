"use client";

import Link from "next/link";
import { ArrowLeft, FolderOpen, X } from "lucide-react";
import { loadoutSlotLabel, type LoadoutEditContext } from "@/lib/builds/loadout-edit-context";

/** Shown at the top of a builder opened from a loadout slot. */
export function LoadoutEditBanner({
  context,
  onDetach,
}: {
  context: LoadoutEditContext | null;
  onDetach: () => void;
}) {
  if (!context) return null;
  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm"
    >
      <FolderOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="min-w-[14rem] flex-1">
        Editing the <span className="font-semibold">{loadoutSlotLabel(context.slot)}</span> slot of{" "}
        <span className="font-semibold break-words">{context.loadoutName}</span>. Save updates the loadout.
      </p>
      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/loadouts"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-primary hover:bg-primary/10 lg:pointer-fine:min-h-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to loadout
        </Link>
        <button
          type="button"
          onClick={onDetach}
          title="Stop editing the loadout (saves go to a new build)"
          aria-label="Stop editing the loadout"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground lg:pointer-fine:h-8 lg:pointer-fine:w-8"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
