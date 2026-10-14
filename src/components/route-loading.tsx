import { PageShell, PageMain, type PageMaxWidth } from "@/components/page-shell";
import { ListSkeleton } from "@/components/list-skeleton";

/** Route-level loading fallback: real header + PageHero-shaped skeleton + ListSkeleton. Presentational only. */
export function RouteLoading({
  label = "Loading…",
  variant = "row",
  rows = 8,
  pills = 2,
  maxWidth = "lg",
}: {
  label?: string;
  variant?: "row" | "grid" | "compact";
  rows?: number;
  pills?: number;
  maxWidth?: PageMaxWidth;
}) {
  return (
    <PageShell>
      <PageMain maxWidth={maxWidth} animate={false}>
        {/* Light mode: bg-muted is very pale on the light theme, so darken skeleton fills here only (scoped;
            the shared ListSkeleton is untouched). Dark mode keeps the original muted tones. */}
        <div className="[&_.bg-muted]:bg-foreground/[0.11] [&_.bg-muted\/70]:bg-foreground/[0.07] [&_.bg-card\/60]:border-foreground/15 dark:[&_.bg-muted]:bg-muted dark:[&_.bg-muted\/70]:bg-muted/70 dark:[&_.bg-card\/60]:border-border/50">
          <div aria-hidden className="mb-6 flex gap-3 sm:mb-8 sm:gap-3.5">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-muted" />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <div className="h-6 w-1/2 max-w-xs animate-pulse rounded bg-muted sm:h-8" />
              <div className="h-3.5 w-4/5 max-w-lg animate-pulse rounded bg-muted/70" />
            </div>
          </div>
          {pills > 0 && (
            <div aria-hidden className="mb-4 flex flex-wrap gap-2">
              {Array.from({ length: pills }, (_, i) => (
                <div key={i} className="h-11 w-24 animate-pulse rounded-lg bg-muted/70" />
              ))}
            </div>
          )}
          <ListSkeleton rows={rows} label={label} variant={variant} />
        </div>
      </PageMain>
    </PageShell>
  );
}
