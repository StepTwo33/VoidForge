"use client";

import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { cn } from "@/lib/utils";

export function SavedBuildsDialog({
  open,
  onOpenChange,
  title,
  emptyMessage = "No saved builds yet.",
  builds,
  getSubtitle,
  onLoad,
  onDelete,
  accent = "cyan",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  emptyMessage?: string;
  builds: SavedBuild[];
  getSubtitle: (build: SavedBuild) => string;
  onLoad: (build: SavedBuild) => void;
  onDelete: (id: string) => void;
  accent?: "cyan" | "purple" | "green" | "orange" | "rose";
}) {
  const hoverBorder =
    accent === "purple"
      ? "hover:border-purple-500/30"
      : accent === "green"
        ? "hover:border-green-500/30"
        : accent === "orange"
          ? "hover:border-orange-500/30"
          : accent === "rose"
            ? "hover:border-rose-500/30"
            : "hover:border-cyan-500/30";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {builds.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 px-3 py-8 text-center">
              <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Save a build from the builder to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {builds.map((build) => (
                <div
                  key={build.id}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border border-border transition-all",
                    hoverBorder,
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onLoad(build)}
                    className="flex min-h-11 flex-1 items-center text-left"
                  >
                    <span className="min-w-0">
                      <span className="text-sm font-medium">{build.name}</span>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {getSubtitle(build)}
                      </div>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(build.id)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                    aria-label="Delete saved build"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
