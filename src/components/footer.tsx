"use client";

import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { VOIDFORGE_GITHUB_URL } from "@/lib/site/site-links";

const FOOTER_LINKS = [
  { href: VOIDFORGE_GITHUB_URL, label: "Open Source", external: true },
  { href: "/about", label: "About" },
  { href: "/guides/how-to-mod", label: "How to Mod" },
  { href: "/support", label: "Support" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/report-issue", label: "Report Issue" },
] as const;

export function Footer() {
  return (
    <footer className="relative z-[1] mt-auto border-t border-border/60 bg-card/40 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-center sm:text-left">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-90">
              <span className="text-base font-bold tracking-tight text-primary">
                Voidforge
              </span>
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Fan-made Warframe build planner
              <span className="mx-1.5 text-muted-foreground/35">·</span>
              <span className="inline-flex items-center gap-0.5 text-muted-foreground/70">
                Built for the community <Heart className="h-2.5 w-2.5 text-rose-600/80 dark:text-rose-400/80" />
              </span>
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:justify-end">
            {FOOTER_LINKS.map((link) =>
              "external" in link ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <Github className="h-3 w-3" />
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <p className="mt-3 border-t border-border/40 pt-2.5 text-center text-[10px] leading-snug text-muted-foreground/60">
          Warframe and the Warframe logo are registered trademarks of Digital Extremes Ltd.
          Voidforge is not affiliated with Digital Extremes.
        </p>
      </div>
    </footer>
  );
}
