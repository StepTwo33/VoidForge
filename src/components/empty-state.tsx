import { createElement } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { resolvePageIcon, type PageIconName } from "@/lib/display/page-icons";
import { cn } from "@/lib/utils";

/** Shared CTA styles so every empty state's buttons look the same. */
export const emptyStatePrimaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
export const emptyStateSecondaryClass =
  "inline-flex min-h-11 items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export type EmptyStateAction = {
  label: string;
  icon?: LucideIcon;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

function ActionEl({ action, className }: { action: EmptyStateAction; className: string }) {
  const Icon = action.icon;
  const inner = (
    <>
      {Icon && <Icon className="h-4 w-4" aria-hidden />}
      {action.label}
    </>
  );
  return action.href ? (
    <Link href={action.href} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={className}>
      {inner}
    </button>
  );
}

/**
 * One empty-state pattern for the whole app: icon, title, short body, one primary CTA and an
 * optional quieter secondary link. `size="compact"` is for narrow panels (home sidebars, pickers).
 */
export function EmptyState({
  icon,
  iconName,
  title,
  description,
  action,
  secondaryAction,
  children,
  size = "default",
  titleAs = "h2",
  className,
}: {
  icon?: LucideIcon;
  iconName?: PageIconName;
  title: string;
  description?: React.ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  children?: React.ReactNode;
  size?: "default" | "compact";
  titleAs?: "h2" | "h3" | "p";
  className?: string;
}) {
  const Icon = resolvePageIcon(icon, iconName);
  if (!Icon) {
    throw new Error("EmptyState requires icon or iconName");
  }
  const compact = size === "compact";
  const Title = titleAs;
  const hasActions = action || secondaryAction || children;
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border/70 bg-card/40 text-center surface-panel",
        compact ? "px-3 py-6" : "px-5 py-12 sm:px-6 sm:py-16",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-center bg-primary/10 ring-1 ring-primary/20",
          compact ? "mb-2 h-9 w-9 rounded-xl" : "mb-4 h-14 w-14 rounded-2xl",
        )}
      >
        {createElement(Icon, { className: cn("text-primary/70", compact ? "h-4 w-4" : "h-7 w-7"), "aria-hidden": true })}
      </div>
      <Title className={cn("font-semibold", compact ? "text-xs text-foreground" : "text-base sm:text-lg")}>{title}</Title>
      {description && (
        <p
          className={cn(
            "mx-auto leading-relaxed text-muted-foreground",
            compact ? "mt-1 max-w-xs text-xs" : "mt-2 max-w-sm text-sm",
          )}
        >
          {description}
        </p>
      )}
      {hasActions && (
        <div className={cn("flex flex-wrap items-center justify-center gap-2", compact ? "mt-2" : "mt-5")}>
          {action && <ActionEl action={action} className={compact ? emptyStateSecondaryClass + " text-xs" : emptyStatePrimaryClass} />}
          {secondaryAction && <ActionEl action={secondaryAction} className={cn(emptyStateSecondaryClass, compact && "text-xs")} />}
          {children}
        </div>
      )}
    </div>
  );
}
