"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderOpen, LogIn } from "lucide-react";
import { hasClientSession } from "@/lib/auth/client-session";
import type { SavedBuild } from "@/lib/builds/build-storage";
import { mergeYoursBuilds, ownershipBadge } from "@/lib/builds/yours-builds";
import {
  compareSuggestionsEmptyCopy,
  compareTypeLabel,
  pickCompareSuggestions,
} from "@/lib/builds/compare-suggestions";
import type { CompareKind } from "@/lib/builds/compare-build";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

type SuggestType = CompareKind | "loadout";

export function CompareSuggestedBuilds({
  type,
  excludeIds,
  onSelect,
  className,
}: {
  type: SuggestType;
  excludeIds?: readonly (string | null | undefined)[];
  onSelect: (build: SavedBuild) => void;
  className?: string;
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [all, setAll] = useState<SavedBuild[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void hasClientSession().then((v) => {
      if (!cancelled) setSignedIn(v);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void mergeYoursBuilds(type, 24).then((rows) => {
      if (!cancelled) setAll(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [type]);

  const suggestions = useMemo(
    () => (all ? pickCompareSuggestions(all, { excludeIds, limit: 8 }) : []),
    [all, excludeIds],
  );

  const typeLabel = compareTypeLabel(type);
  const loading = all === null || signedIn === null;

  return (
    <section
      className={cn("mb-6 rounded-xl border border-border/60 bg-card/40 p-3 sm:p-4", className)}
      data-testid="compare-suggestions"
      aria-label={`Suggested ${typeLabel} builds`}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold tracking-tight">Your recent {typeLabel} builds</h2>
        {signedIn === false && suggestions.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing builds saved on this device.{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign in
            </a>{" "}
            to include account builds.
          </p>
        )}
      </div>
      {loading ? (
        <p className="py-3 text-center text-xs text-muted-foreground">Looking up your builds…</p>
      ) : suggestions.length === 0 ? (
        <EmptyState
          size="compact"
          icon={FolderOpen}
          title={compareSuggestionsEmptyCopy({ signedIn: !!signedIn, typeLabel }).title}
          description={compareSuggestionsEmptyCopy({ signedIn: !!signedIn, typeLabel }).description}
          action={
            signedIn
              ? undefined
              : { href: "/signin", label: "Sign in", icon: LogIn }
          }
          titleAs="p"
        />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {suggestions.map((build) => {
            const badge = ownershipBadge(build.id);
            return (
              <li key={build.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onSelect(build)}
                  title={`Use “${build.name}”`}
                  className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 lg:pointer-fine:min-h-9"
                >
                  <span className="truncate">{build.name}</span>
                  {badge ? (
                    <span className="shrink-0 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">
                      {badge}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
