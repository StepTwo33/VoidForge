"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type BuilderSection = { id: string; label: string };

const HIDDEN = "data-section-hidden";
const ACTIVE = "data-section-active";
const HOST = "data-section-host";

/** Resolves --builder-scroll-offset (globals.css: 3.5rem header + safe area + 0.75rem) to px. */
function readScrollOffset(): number {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;height:var(--builder-scroll-offset)";
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px;
}

function scrollToSection(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY - readScrollOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}

/**
 * Phone/tablet-only (below lg) bottom tab bar for builder sections (e.g. Mods / Stats).
 * Acts as a view switcher: only the active section is displayed below lg (see the
 * `data-section-*` rules in globals.css); switching scrolls to the top of that section.
 * Pure display/navigation over elements already rendered on the page — it never changes
 * what they compute. At lg+ the bar is hidden and the CSS rules don't apply.
 */
export function BuilderSectionNav({ sections }: { sections: BuilderSection[] }) {
  const [present, setPresent] = useState<BuilderSection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const pendingScroll = useRef(false);
  const sectionsRef = useRef(sections);
  useEffect(() => {
    sectionsRef.current = sections;
  });
  const key = sections.map((s) => s.id).join("|");

  useEffect(() => {
    let first = true;
    const scan = () => {
      const next = sections.filter((s) => document.getElementById(s.id));
      setPresent((prev) => (prev.map((p) => p.id).join("|") === next.map((n) => n.id).join("|") ? prev : next));
      if (first) {
        first = false;
        const hash = window.location.hash.slice(1);
        if (hash && next.some((s) => s.id === hash)) setSelected(hash);
      }
    };
    scan();
    // Rescan whenever sections mount/unmount or an element's id changes (no polling needed).
    let raf = 0;
    const observer = new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        scan();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["id"] });
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const switching = present.length >= 2;
  const active = switching ? (present.some((s) => s.id === selected) ? selected : present[0].id) : null;

  // Mark sections so CSS (below lg only) shows just the active one. Supports one level of
  // nesting (e.g. archwing stats inside the mods block): the ancestor stays as a "host" and
  // only its children that don't lead to the active section are hidden.
  useEffect(() => {
    if (!active) return;
    let applied: HTMLElement[] = [];
    const clear = () => {
      for (const el of applied) {
        el.removeAttribute(HIDDEN);
        el.removeAttribute(ACTIVE);
        el.removeAttribute(HOST);
      }
    };
    const apply = () => {
      // All declared sections (not just `present`), so a section that mounts between scans is
      // hidden immediately instead of showing next to the active one.
      const els = sectionsRef.current.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
      const activeEl = document.getElementById(active);
      clear();
      for (const el of els) {
        if (el === activeEl) el.setAttribute(ACTIVE, "");
        else if (activeEl && el.contains(activeEl)) el.setAttribute(HOST, "");
        else el.setAttribute(HIDDEN, "");
      }
      applied = els;
      return activeEl;
    };
    const activeEl = apply();
    if (pendingScroll.current && activeEl) {
      pendingScroll.current = false;
      scrollToSection(activeEl);
    }
    // Sections can remount (variant/tab switches, item changes): React creates fresh elements
    // without our data-* attributes. Re-apply whenever a tracked section element is replaced.
    let raf = 0;
    const observer = new MutationObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const current = sectionsRef.current.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
        const changed =
          current.length !== applied.length ||
          current.some((el, i) => el !== applied[i] || (!el.hasAttribute(HIDDEN) && !el.hasAttribute(ACTIVE) && !el.hasAttribute(HOST)));
        if (changed) apply();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["id"] });
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      clear();
    };
  }, [active, present]);

  if (!switching) return null;

  // Portal to <body>: pages using PageShell's ambient background create their own stacking
  // context (isolation: isolate), which let the site footer paint over the fixed bar.
  // `switching` is only true after mount effects, so `document` is always available here.
  return createPortal(
    <nav
      aria-label="Builder sections"
      data-builder-section-nav=""
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center [body[data-scroll-locked]_&]:hidden px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 pointer-events-none lg:hidden"
    >
      <div
        role="tablist"
        aria-label="Builder sections"
        className="pointer-events-auto flex max-w-full gap-1 overflow-x-auto rounded-full border border-border/70 bg-card/95 p-1 shadow-lg shadow-[var(--shadow-color)] backdrop-blur-md supports-[backdrop-filter]:bg-card/85"
      >
        {present.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={s.id}
              onClick={() => {
                pendingScroll.current = true;
                if (isActive) {
                  // Re-tapping the current tab returns to its top.
                  const el = document.getElementById(s.id);
                  if (el) scrollToSection(el);
                  pendingScroll.current = false;
                } else {
                  setSelected(s.id);
                }
              }}
              className={cn(
                "inline-flex min-h-11 min-w-14 shrink-0 items-center justify-center rounded-full px-3 text-[13px] sm:min-w-16 sm:px-4 sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </nav>,
    document.body,
  );
}
