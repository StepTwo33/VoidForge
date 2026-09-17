"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ArcaneEffectDef } from "@/data/arcane-effects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArcaneEffectsEditor, ArcaneTriggerPicker } from "@/components/override-field-editors";
import type { ArcaneTrigger } from "@/data/arcane-effects";
import {
  draftsToEffectsPayload,
  saveArcaneEffectOverride,
  toEffectDrafts,
  type ArcaneEffectLineDraft,
} from "@/lib/overrides/arcane-effect-drafts";
import { appendReturnTo } from "@/lib/site/nav-return";
import { dataFixesHref } from "@/lib/overrides/data-fixes-url";

type ArcaneValuesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  arcaneId: string;
  arcaneName: string;
  effects: ArcaneEffectDef | undefined;
  returnTo?: string;
  onSaved?: () => void;
};

export function ArcaneValuesDialog({
  open,
  onOpenChange,
  arcaneId,
  arcaneName,
  effects,
  returnTo,
  onSaved,
}: ArcaneValuesDialogProps) {
  const [lines, setLines] = useState<ArcaneEffectLineDraft[]>([]);
  const [trigger, setTrigger] = useState<ArcaneTrigger>("passive");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLines(toEffectDrafts(effects?.effects ?? []));
    setTrigger(effects?.trigger ?? "passive");
    setNote("");
  }, [open, effects]);

  const maxRank = effects?.maxRank ?? 5;

  const handleSave = async () => {
    if (!effects) return;
    setSaving(true);
    try {
      await saveArcaneEffectOverride(
        arcaneId,
        {
          ...effects,
          name: arcaneName,
          maxRank,
          trigger,
          effects: draftsToEffectsPayload(lines),
        },
        note.trim(),
      );
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save arcane values");
    } finally {
      setSaving(false);
    }
  };

  const advancedHref = returnTo
    ? appendReturnTo(dataFixesHref({ category: "arcane", itemId: arcaneId }), returnTo)
    : dataFixesHref({ category: "arcane", itemId: arcaneId });

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg" showCloseButton={!saving}>
        <DialogHeader>
          <DialogTitle>Edit base values — {arcaneName}</DialogTitle>
          <DialogDescription>
            Set unranked (R0) and max-rank values, or each rank manually. Preview updates as you edit.
          </DialogDescription>
        </DialogHeader>

        {!effects || effects.effects.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No effect lines in data yet. Use{" "}
            <a href={advancedHref} className="text-purple-800 hover:underline dark:text-purple-400">
              Data Fixes
            </a>{" "}
            to add them.
          </p>
        ) : (
          <>
            <ArcaneTriggerPicker
              value={trigger}
              currentValue={effects.trigger}
              required
              onChange={(t) => setTrigger(t as ArcaneTrigger)}
            />
            <ArcaneEffectsEditor lines={lines} maxRank={maxRank} onChange={setLines} />
          </>
        )}

        <label className="block text-[11px]">
          <span className="text-muted-foreground">Note (optional)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why this change?"
            className="mt-0.5 min-h-11 w-full rounded border border-border bg-background px-2 text-sm sm:min-h-9"
          />
        </label>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <a
            href={advancedHref}
            className="inline-flex min-h-11 items-center text-[11px] text-muted-foreground hover:text-purple-800 dark:hover:text-purple-400 sm:min-h-0"
          >
            More options in Data Fixes →
          </a>
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saving || !effects?.effects.length}
              onClick={() => void handleSave()}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save values"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
