"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Library } from "lucide-react";
import { hasClientSession } from "@/lib/auth/client-session";
import {
  BUILDS_RESTORE_SCROLL_KEY,
  BUILDS_RETURN_KEY,
  parseBuildsReturn,
  resolveBuildsReturnLink,
  type BuildsReturnLinkState,
} from "@/lib/builds/builds-return";
import { cn } from "@/lib/utils";

function readEntry() {
  try {
    return parseBuildsReturn(window.sessionStorage.getItem(BUILDS_RETURN_KEY));
  } catch {
    return null;
  }
}

/**
 * Round 55: "Back to your builds" when this builder was opened from /builds (returns to the same
 * filter, search and scroll), otherwise "Your builds" for signed-in users. Renders nothing for
 * signed-out visitors who did not come from /builds.
 */
export function BuildsReturnLink({ className }: { className?: string }) {
  const [link, setLink] = useState<BuildsReturnLinkState>(null);

  useEffect(() => {
    let cancelled = false;
    const base = {
      pathname: window.location.pathname,
      search: window.location.search,
      entry: readEntry(),
    };
    const fromLibrary = resolveBuildsReturnLink({ ...base, signedIn: false });
    if (fromLibrary) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads per-tab sessionStorage, only available after mount
      setLink(fromLibrary);
      return;
    }
    void hasClientSession().then((signedIn) => {
      if (!cancelled) setLink(resolveBuildsReturnLink({ ...base, signedIn }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!link) return null;
  const back = link.kind === "back";
  return (
    <Link
      href={link.href}
      data-testid="builds-return-link"
      onClick={() => {
        if (!back) return;
        try {
          window.sessionStorage.setItem(BUILDS_RESTORE_SCROLL_KEY, "1");
        } catch {
          /* private mode */
        }
      }}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors lg:pointer-fine:min-h-9",
        back
          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
          : "border-border/70 bg-background/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
        className,
      )}
    >
      {back ? <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> : <Library className="h-3.5 w-3.5" aria-hidden />}
      {back ? "Back to your builds" : "Your builds"}
    </Link>
  );
}
