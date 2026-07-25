"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lightbulb, AlertTriangle } from "lucide-react";
import { ContentPanel } from "@/components/page-shell";
import { accentTone } from "@/lib/display/accent-tones";
import {
  HOW_TO_MOD_SECTIONS,
  resolveHowToModSection,
} from "@/lib/guides/how-to-mod-sections";
import { cn } from "@/lib/utils";

export function HowToModSectionNav() {
  const pathname = usePathname();
  const active = resolveHowToModSection(pathname);

  return (
    <ContentPanel className="mb-6 p-2" padding={false}>
      <nav
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5 sm:flex-wrap sm:overflow-visible"
        aria-label="How to Mod sections"
      >
        {HOW_TO_MOD_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          return (
            <Link
              key={section.id}
              href={section.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? accentTone.amber.chipActive
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {section.label}
            </Link>
          );
        })}
      </nav>
    </ContentPanel>
  );
}

export function GuideTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 px-3.5 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Lightbulb className="h-3.5 w-3.5" />
        Tip
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function GuideMistake({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3.5 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300">
        <AlertTriangle className="h-3.5 w-3.5" />
        Common mistake
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function GuideCtaLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
