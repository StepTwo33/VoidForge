"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderOpen, X } from "lucide-react";
import { loadoutSlotLabel, type LoadoutEditContext } from "@/lib/builds/loadout-edit-context";
import { getLoadouts } from "@/lib/builds/loadouts";
import {
  loadoutCardHref,
  loadoutSlotEditHref,
  type LoadoutSlotType,
} from "@/lib/builds/loadout-slot-helpers";
import type { Loadout } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SWITCH_SLOTS: LoadoutSlotType[] = ["warframe", "primary", "secondary", "melee", "companion"];

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
  /** Where to go after Save / Discard in the unsaved prompt: the loadout card or another slot. */
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [loadout, setLoadout] = useState<Loadout | null>(null);
  const loadoutId = context?.loadoutId;
  useEffect(() => {
    if (!loadoutId) return;
    queueMicrotask(() => setLoadout(getLoadouts().find((l) => l.id === loadoutId) ?? null));
  }, [loadoutId]);
  if (!context) return null;
  const slotLabel = loadoutSlotLabel(context.slot);
  const guardBack = dirty && onSaveToLoadout != null;
  const backHref = loadoutCardHref(context.loadoutId);
  const target = pendingHref ?? backHref;

  const go = (href: string) => {
    // Another slot opens a builder (maybe this same page): do a full load so the slot is read fresh.
    if (href === backHref) router.push(href);
    else window.location.assign(href);
  };

  const requestNavigate = (href: string) => {
    if (guardBack) {
      setPendingHref(href);
      setPromptOpen(true);
      return;
    }
    go(href);
  };

  const handleSave = async () => {
    if (!onSaveToLoadout) return;
    setSaving(true);
    try {
      const ok = await onSaveToLoadout();
      if (ok) {
        setPromptOpen(false);
        go(target);
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
          href={backHref}
          data-testid="loadout-banner-back"
          onClick={(e) => {
            if (!guardBack) return;
            e.preventDefault();
            setPendingHref(null);
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

      {loadout && (
        <nav aria-label="Loadout slots" className="flex w-full flex-wrap items-center gap-1" data-testid="loadout-slot-switcher">
          {SWITCH_SLOTS.map((slot) => {
            const href = loadoutSlotEditHref(loadout, slot);
            const current = slot === context.slot;
            const label = loadoutSlotLabel(slot);
            if (current) {
              return (
                <span
                  key={slot}
                  aria-current="page"
                  className="inline-flex min-h-11 items-center rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground lg:pointer-fine:min-h-7"
                >
                  {label}
                </span>
              );
            }
            if (!href) {
              return (
                <span
                  key={slot}
                  title={`${label} slot is empty — add it from the loadout`}
                  className="inline-flex min-h-11 items-center rounded-md px-2.5 text-xs text-muted-foreground/70 lg:pointer-fine:min-h-7"
                >
                  {label}
                </span>
              );
            }
            return (
              <a
                key={slot}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  requestNavigate(href);
                }}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-md border border-primary/25 px-2.5 text-xs font-medium text-primary hover:bg-primary/10 lg:pointer-fine:min-h-7",
                )}
              >
                {label}
              </a>
            );
          })}
        </nav>
      )}

      <Dialog open={promptOpen} onOpenChange={(open) => !saving && setPromptOpen(open)}>
        <DialogContent className="sm:max-w-md" data-testid="loadout-unsaved-prompt">
          <DialogHeader>
            <DialogTitle>Save changes to {context.loadoutName}?</DialogTitle>
            <DialogDescription>
              You changed the {slotLabel} slot since it was opened. Save it to the loadout, or discard the
              changes and {pendingHref ? "switch slots" : "go back"}.
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
                go(target);
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
