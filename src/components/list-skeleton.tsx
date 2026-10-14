import { cn } from "@/lib/utils";

/** Placeholder rows/cards shown while a list loads. Purely presentational. */
export function ListSkeleton({
  rows = 4,
  label = "Loading…",
  variant = "row",
  className,
}: {
  rows?: number;
  label?: string;
  variant?: "row" | "grid" | "compact";
  className?: string;
}) {
  const items = Array.from({ length: rows });
  return (
    <div role="status" aria-live="polite" className={cn(variant === "grid" ? "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" : "space-y-2", className)}>
      <span className="sr-only">{label}</span>
      {items.map((_, i) =>
        variant === "grid" ? (
          <div key={i} aria-hidden className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card/60 p-3">
            <div className="h-16 w-16 animate-pulse rounded-lg bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/70" />
          </div>
        ) : (
          <div
            key={i}
            aria-hidden
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border/50 bg-card/60",
              variant === "compact" ? "px-2.5 py-2" : "px-3 py-3 sm:px-4",
            )}
          >
            <div className={cn("shrink-0 animate-pulse rounded-md bg-muted", variant === "compact" ? "h-8 w-8" : "h-10 w-10")} />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-3/5 animate-pulse rounded bg-muted/70" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
