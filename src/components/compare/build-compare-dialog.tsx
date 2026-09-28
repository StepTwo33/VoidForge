"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { snapshotFromBuild, type CompareKind, type CompareSnapshot } from "@/lib/builds/compare-build";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { BuildSourcePicker } from "@/components/compare/build-source-picker";
import { SnapshotCompare } from "@/components/compare/build-stat-rows";

export function BuildCompareDialog({
  open,
  onOpenChange,
  type,
  itemId,
  live,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: CompareKind;
  itemId: string;
  live: CompareSnapshot | null;
}) {
  const [other, setOther] = useState<CompareSnapshot | null>(null);

  const pick = (build: SavedBuild) => {
    const snap = snapshotFromBuild(type, build.name, build.data);
    if (!snap) {
      toast.error("That build could not be compared");
      return;
    }
    setOther(snap);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) setOther(null);
      onOpenChange(next);
    }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Compare builds</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          This build stays on the left. Pick one from Yours or Community for the same item.
          Stats and gear (mods, arcanes, shards) both show below.
        </p>
        <BuildSourcePicker type={type} itemId={itemId} onSelect={pick} />
        {live && other && live.kind === other.kind && (
          <div className="rounded-lg border border-border/60 p-3">
            <SnapshotCompare a={live} b={other} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
