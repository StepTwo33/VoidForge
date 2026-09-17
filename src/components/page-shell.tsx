"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Header } from "@/components/header";
import { resolvePageIcon, type PageIconName } from "@/lib/display/page-icons";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "",
} as const;

export type PageMaxWidth = keyof typeof MAX_WIDTH;

export type AccentColor =
  | "blue"
  | "purple"
  | "cyan"
  | "amber"
  | "indigo"
  | "yellow"
  | "red"
  | "green"
  | "orange"
  | "rose"
  | "teal"
  | "slate"
  | "emerald"
  | "primary";

const ACCENT: Record<
  AccentColor,
  { icon: string; hoverBorder: string; hoverBg: string; hoverText: string; shadow: string; badge: string }
> = {
  blue: {
    icon: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    hoverBorder: "hover:border-blue-500/50",
    hoverBg: "hover:bg-blue-500/5",
    hoverText: "group-hover:text-blue-700 dark:group-hover:text-blue-400",
    shadow: "hover:shadow-blue-500/10",
    badge: "bg-blue-500/10 text-blue-800 ring-blue-500/25 dark:text-blue-300 dark:ring-blue-500/20",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    hoverBorder: "hover:border-purple-500/50",
    hoverBg: "hover:bg-purple-500/5",
    hoverText: "group-hover:text-purple-700 dark:group-hover:text-purple-400",
    shadow: "hover:shadow-purple-500/10",
    badge: "bg-purple-500/10 text-purple-800 ring-purple-500/25 dark:text-purple-300 dark:ring-purple-500/20",
  },
  cyan: {
    icon: "bg-cyan-500/10 text-cyan-800 dark:text-cyan-400",
    hoverBorder: "hover:border-cyan-500/50",
    hoverBg: "hover:bg-cyan-500/5",
    hoverText: "group-hover:text-cyan-800 dark:group-hover:text-cyan-400",
    shadow: "hover:shadow-cyan-500/10",
    badge: "bg-cyan-500/10 text-cyan-900 ring-cyan-500/25 dark:text-cyan-300 dark:ring-cyan-500/20",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-800 dark:text-amber-400",
    hoverBorder: "hover:border-amber-500/50",
    hoverBg: "hover:bg-amber-500/5",
    hoverText: "group-hover:text-amber-800 dark:group-hover:text-amber-400",
    shadow: "hover:shadow-amber-500/10",
    badge: "bg-amber-500/10 text-amber-900 ring-amber-500/25 dark:text-amber-300 dark:ring-amber-500/20",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
    hoverBorder: "hover:border-indigo-500/50",
    hoverBg: "hover:bg-indigo-500/5",
    hoverText: "group-hover:text-indigo-700 dark:group-hover:text-indigo-400",
    shadow: "hover:shadow-indigo-500/10",
    badge: "bg-indigo-500/10 text-indigo-800 ring-indigo-500/25 dark:text-indigo-300 dark:ring-indigo-500/20",
  },
  yellow: {
    icon: "bg-yellow-500/10 text-yellow-800 dark:text-yellow-400",
    hoverBorder: "hover:border-yellow-500/50",
    hoverBg: "hover:bg-yellow-500/5",
    hoverText: "group-hover:text-yellow-800 dark:group-hover:text-yellow-400",
    shadow: "hover:shadow-yellow-500/10",
    badge: "bg-yellow-500/10 text-yellow-900 ring-yellow-500/25 dark:text-yellow-300 dark:ring-yellow-500/20",
  },
  red: {
    icon: "bg-red-500/10 text-red-700 dark:text-red-400",
    hoverBorder: "hover:border-red-500/50",
    hoverBg: "hover:bg-red-500/5",
    hoverText: "group-hover:text-red-700 dark:group-hover:text-red-400",
    shadow: "hover:shadow-red-500/10",
    badge: "bg-red-500/10 text-red-800 ring-red-500/25 dark:text-red-300 dark:ring-red-500/20",
  },
  green: {
    icon: "bg-green-500/10 text-green-700 dark:text-green-400",
    hoverBorder: "hover:border-green-500/50",
    hoverBg: "hover:bg-green-500/5",
    hoverText: "group-hover:text-green-700 dark:group-hover:text-green-400",
    shadow: "hover:shadow-green-500/10",
    badge: "bg-green-500/10 text-green-800 ring-green-500/25 dark:text-green-300 dark:ring-green-500/20",
  },
  orange: {
    icon: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    hoverBorder: "hover:border-orange-500/50",
    hoverBg: "hover:bg-orange-500/5",
    hoverText: "group-hover:text-orange-700 dark:group-hover:text-orange-400",
    shadow: "hover:shadow-orange-500/10",
    badge: "bg-orange-500/10 text-orange-800 ring-orange-500/25 dark:text-orange-300 dark:ring-orange-500/20",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    hoverBorder: "hover:border-rose-500/50",
    hoverBg: "hover:bg-rose-500/5",
    hoverText: "group-hover:text-rose-700 dark:group-hover:text-rose-400",
    shadow: "hover:shadow-rose-500/10",
    badge: "bg-rose-500/10 text-rose-800 ring-rose-500/25 dark:text-rose-300 dark:ring-rose-500/20",
  },
  teal: {
    icon: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
    hoverBorder: "hover:border-teal-500/50",
    hoverBg: "hover:bg-teal-500/5",
    hoverText: "group-hover:text-teal-700 dark:group-hover:text-teal-400",
    shadow: "hover:shadow-teal-500/10",
    badge: "bg-teal-500/10 text-teal-800 ring-teal-500/25 dark:text-teal-300 dark:ring-teal-500/20",
  },
  slate: {
    icon: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    hoverBorder: "hover:border-slate-400/50",
    hoverBg: "hover:bg-slate-500/5",
    hoverText: "group-hover:text-slate-800 dark:group-hover:text-slate-200",
    shadow: "hover:shadow-slate-500/10",
    badge: "bg-slate-500/10 text-slate-800 ring-slate-500/25 dark:text-slate-300 dark:ring-slate-500/20",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
    hoverBg: "hover:bg-emerald-500/5",
    hoverText: "group-hover:text-emerald-700 dark:group-hover:text-emerald-400",
    shadow: "hover:shadow-emerald-500/10",
    badge: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/25 dark:text-emerald-300 dark:ring-emerald-500/20",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    hoverBorder: "hover:border-primary/50",
    hoverBg: "hover:bg-primary/5",
    hoverText: "group-hover:text-primary",
    shadow: "hover:shadow-primary/10",
    badge: "bg-primary/10 text-primary ring-primary/20",
  },
};

/** Site-wide page wrapper with ambient background and header. */
export function PageShell({
  children,
  ambient = true,
  className,
}: {
  children: React.ReactNode;
  ambient?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col", ambient && "page-ambient", className)}>
      <Header />
      {children}
    </div>
  );
}

/** Standard main content area with optional animation and max-width. */
export function PageMain({
  children,
  maxWidth = "lg",
  animate = true,
  className,
}: {
  children: React.ReactNode;
  maxWidth?: PageMaxWidth;
  animate?: boolean;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "relative z-[1] flex-1 container mx-auto w-full px-3.5 py-5 sm:px-4 sm:py-8",
        MAX_WIDTH[maxWidth],
        animate && "animate-in fade-in slide-in-from-bottom-4 duration-500",
        className,
      )}
    >
      {children}
    </main>
  );
}

/** Polished page title block for tool and content pages. */
export function PageHero({
  title,
  highlight,
  description,
  icon,
  iconName,
  accent = "primary",
  actions,
  centered = false,
  className,
}: {
  title: string;
  highlight?: string;
  description?: string;
  /** Client-only pages: pass the Lucide component directly. */
  icon?: LucideIcon;
  /** Server pages: pass a serializable icon key instead of `icon`. */
  iconName?: PageIconName;
  accent?: AccentColor;
  actions?: React.ReactNode;
  centered?: boolean;
  className?: string;
}) {
  const Icon = resolvePageIcon(icon, iconName);
  const colors = ACCENT[accent];
  return (
    <div
      className={cn(
        "mb-6 sm:mb-8",
        centered && "text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-3 sm:gap-4",
          centered ? "flex-col items-center" : "flex-col items-stretch sm:flex-row sm:items-start sm:justify-between",
          actions && !centered && "sm:flex-wrap",
        )}
      >
        <div className={cn("flex gap-3 sm:gap-3.5", centered && "flex-col items-center")}>
          {Icon && (
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-border/50",
                colors.icon,
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className={cn("min-w-0", centered && "max-w-2xl")}>
            <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="text-primary">{highlight}</span>
                </>
              )}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-2 sm:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/** Homepage-style feature link card. */
export function FeatureCard({
  href,
  external,
  title,
  description,
  icon,
  iconName,
  accent,
  badges,
  subtitle,
}: {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconName?: PageIconName;
  accent: AccentColor;
  badges?: string[];
  subtitle?: string;
}) {
  const Icon = resolvePageIcon(icon, iconName);
  if (!Icon) {
    throw new Error("FeatureCard requires icon or iconName");
  }
  const colors = ACCENT[accent];
  const inner = (
    <div
      className={cn(
        "group flex min-h-11 h-full flex-col rounded-xl border border-border/60 surface-panel p-4 sm:p-6",
        "transition-all duration-300 active:scale-[0.99] hover:-translate-y-1 hover:shadow-xl",
        colors.hoverBorder,
        colors.hoverBg,
        colors.shadow,
      )}
    >
      <div className="mb-2.5 flex items-start gap-3 sm:mb-3">
        <div className={cn("rounded-lg p-2 ring-1 ring-border/40", colors.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={cn("text-base font-semibold transition-colors sm:text-lg", colors.hoverText)}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {badges && badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-medium ring-1 sm:text-xs",
                colors.badge,
              )}
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="group block h-full min-h-11">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className="group block h-full min-h-11">
      {inner}
    </Link>
  );
}

/** Filter / sort pill button. */
export function FilterChip({
  active,
  onClick,
  children,
  className,
  style,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      title={title}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border px-3.5 py-2.5 text-xs font-medium transition-all lg:min-h-9 lg:px-3 lg:py-1.5",
        active
          ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10"
          : "border-border/70 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Elevated content panel for lists, forms, and tool areas. */
export function ContentPanel({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 surface-panel shadow-sm ring-1 ring-border/30",
        padding && "p-3.5 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Section heading inside content panels. */
export function PanelHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Empty state block for lists and search results. */
export function EmptyState({
  icon,
  iconName,
  title,
  description,
  children,
  className,
}: {
  icon?: LucideIcon;
  iconName?: PageIconName;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = resolvePageIcon(icon, iconName);
  if (!Icon) {
    throw new Error("EmptyState requires icon or iconName");
  }
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border/70 bg-card/40 px-5 py-12 text-center surface-panel sm:px-6 sm:py-16",
        className,
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <Icon className="h-7 w-7 text-primary/70" />
      </div>
      <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{children}</div>}
    </div>
  );
}

/** Prose wrapper for legal / long-form pages. */
export function ProsePanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ContentPanel className={cn("prose prose-sm max-w-none dark:prose-invert", className)} padding>
      {children}
    </ContentPanel>
  );
}
