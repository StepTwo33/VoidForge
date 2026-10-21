"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderOpen, X } from "lucide-react";
import { loadoutSlotLabel, type LoadoutEditContext } from "@/lib/builds/loadout-edit-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LOADOUTS_HREF = "/loadouts";

/** Shown at the top of a builder opened from a loadout slot. */
export function LoadoutEditBanner({
  context,
  onDetach,
  dirty = false,
  onSaveToLoadout,
}: {
  context: LoadoutEditContext | null;
  onDetach: () => void;
  /** Unsaved changes in the builder: "Back to loadout" asks to save / discard / cancel first. */
  dirty?: boolean;
  /** Saves the current build into the loadout slot. Resolves false when the save failed. */
  onSaveToLoadout?: () => Promise<boolean>;
}) {
  const router = useRouter();
  const [promptOpen, setPromptOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  if (!context) return null;
  const slotLabel = loadoutSlotLabel(context.slot);
  const guardBack = dirty && onSaveToLoadout != null;

  const handleSave = async () => {
    if (!onSaveToLoadout) return;
    setSaving(true);
    try {
      const ok = await onSaveToLoadout();
      if (ok) {
        setPromptOpen(false);
        router.push(LOADOUTS_HREF);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm"
    >
      <FolderOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="min-w-[14rem] flex-1">
        Editing the <span className="font-semibold">{slotLabel}</span> slot of{" "}
        <span className="font-semibold break-words">{context.loadoutName}</span>. Save updates the loadout.
      </p>
      <div className="ml-auto flex items-center gap-1">
        <Link
          href={LOADOUTS_HREF}
          data-testid="loadout-banner-back"
          onClick={(e) => {
            if (!guardBack) return;
            e.preventDefault();
            setPromptOpen(true);
          }}
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

      <Dialog open={promptOpen} onOpenChange={(open) => !saving && setPromptOpen(open)}>
        <DialogContent className="sm:max-w-md" data-testid="loadout-unsaved-prompt">
          <DialogHeader>
            <DialogTitle>Save changes to {context.loadoutName}?</DialogTitle>
            <DialogDescription>
              You changed the {slotLabel} slot since it was opened. Save it to the loadout, or discard the
              changes and go back.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setPromptOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPromptOpen(false);
                router.push(LOADOUTS_HREF);
              }}
              disabled={saving}
            >
              Discard
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save to loadout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
