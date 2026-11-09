"use client";

import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

/** Update writes the open build in place. Save as opens the dialog for a new id. */
export function BuilderSaveControls({
  canUpdate,
  dirty,
  dirtyClass,
  dotClass,
  className,
  onUpdate,
  onSaveAs,
  onSaveNew,
}: {
  canUpdate: boolean;
  dirty?: boolean;
  dirtyClass?: string;
  dotClass?: string;
  className?: string;
  onUpdate: () => void;
  onSaveAs: () => void;
  onSaveNew: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => (canUpdate ? onUpdate() : onSaveNew())}
        className={cn(className, dirty && dirtyClass)}
        title={
          canUpdate
            ? dirty
              ? "Update this build (unsaved changes). Name and visibility stay the same."
              : "Update this build. Name and visibility stay the same."
            : dirty
              ? "Save Build (unsaved changes)"
              : "Save Build"
        }
        data-dirty={dirty ? "true" : undefined}
      >
        <Save className="h-3.5 w-3.5" />
        <span className="inline">{canUpdate ? "Update" : "Save"}</span>
        {dirty && dotClass ? <span className={dotClass} aria-hidden /> : null}
      </button>
      {canUpdate && (
        <button
          type="button"
          onClick={onSaveAs}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground lg:pointer-fine:min-h-0 lg:py-1.5"
          title="Save a separate copy with a new id"
        >
          <span className="inline">Save as</span>
        </button>
      )}
    </>
  );
}
