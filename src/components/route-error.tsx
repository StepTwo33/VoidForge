"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageShell, PageMain, ContentPanel } from "@/components/page-shell";

const btnBase =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Shared error card for route-level error.tsx boundaries. Presentational only. */
export function RouteError({
  error,
  reset,
  title = "Something went wrong on this page",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error("Route error", error);
  }, [error]);

  return (
    <PageShell>
      <PageMain maxWidth="sm">
        <ContentPanel className="mx-auto max-w-xl space-y-4 p-6 text-center sm:p-8">
          <div
            aria-hidden
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-700 ring-1 ring-border/50 dark:text-red-400"
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            This page hit an unexpected error. Your saved builds are safe. Try again, and if it keeps happening, let us
            know.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-2 sm:gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className={`${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`}
            >
              Try again
            </button>
            <Link href="/" className={`${btnBase} border border-border hover:bg-muted`}>
              Home
            </Link>
            <Link href="/report-issue" className={`${btnBase} border border-border hover:bg-muted`}>
              Report this issue
            </Link>
          </div>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ref: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </ContentPanel>
      </PageMain>
    </PageShell>
  );
}
