"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type OverflowAction = {
  key: string;
  label: string;
  icon: ReactNode;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
};

const ROW =
  "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/**
 * Phone-only (below sm) "More" menu for a loadout card: every secondary action as an icon + text
 * label, so the card header isn't a row of unlabeled icon buttons. sm+ keeps the inline icons.
 */
export function LoadoutCardOverflowMenu({ actions, loadoutName }: { actions: OverflowAction[]; loadoutName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`More actions for ${loadoutName}`}
          data-testid="loadout-more-actions"
          className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden /> More
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-1" aria-label="Loadout actions">
        {actions.map((a) =>
          a.href ? (
            <Link
              key={a.key}
              href={a.href}
              onClick={() => setOpen(false)}
              className={cn(ROW, "text-foreground")}
            >
              {a.icon}
              {a.label}
            </Link>
          ) : (
            <button
              key={a.key}
              type="button"
              disabled={a.disabled}
              onClick={() => {
                setOpen(false);
                a.onSelect?.();
              }}
              className={cn(ROW, a.destructive ? "text-destructive hover:bg-destructive/15" : "text-foreground")}
            >
              {a.icon}
              {a.label}
            </button>
          ),
        )}
      </PopoverContent>
    </Popover>
  );
}
