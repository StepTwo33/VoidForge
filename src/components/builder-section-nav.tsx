"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type BuilderSection = { id: string; label: string };

/**
 * Phone/tablet-only (below lg) bottom bar that jumps between builder sections
 * (e.g. Mods / Stats). Pure navigation: it only scrolls to elements that are
 * already rendered on the page and hides sections that aren't present.
 */
export function BuilderSectionNav({ sections }: { sections: BuilderSection[] }) {
  const [present, setPresent] = useState<BuilderSection[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const key = sections.map((s) => s.id).join("|");

  useEffect(() => {
    const scan = () => {
      const next = sections.filter((s) => document.getElementById(s.id));
      setPresent((prev) => (prev.map((p) => p.id).join("|") === next.map((n) => n.id).join("|") ? prev : next));
    };
    scan();
    const t = setInterval(scan, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (present.length < 2) return;
    const els = present.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current: string | null = els[0]?.id ?? null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [present]);

  if (present.length < 2) return null;

  return (
    <nav
      aria-label="Builder sections"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 pointer-events-none lg:hidden"
    >
      <div className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-full border border-border/70 bg-card/95 p-1 shadow-lg shadow-[var(--shadow-color)] backdrop-blur-md supports-[backdrop-filter]:bg-card/85">
        {present.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "inline-flex min-h-11 min-w-14 shrink-0 items-center justify-center rounded-full px-3 text-[13px] sm:min-w-16 sm:px-4 sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              {s.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
