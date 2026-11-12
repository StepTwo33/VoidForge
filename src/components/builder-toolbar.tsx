"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check, FolderOpen, RotateCcw, Share2 } from "lucide-react";
import { BuilderSaveControls } from "@/components/builder-save-controls";
import { BuilderActionBar, BuilderActionGroup } from "@/components/item-picker";
import { SAVE_DIRTY_CLASS, SAVE_DIRTY_DOT_CLASS } from "@/lib/builds/unsaved-changes";
import { cn } from "@/lib/utils";

/** Canonical 44px coarse-pointer target; shrinks on large fine-pointer layouts. */
export const BUILDER_TOOLBAR_BTN_CLASS =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground lg:pointer-fine:min-h-0 lg:py-1.5";

const SAVE_HOVER =
  "hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400";
const LOAD_HOVER =
  "hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400";
const SHARE_HOVER =
  "hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-400";
const SHARE_COPIED = "bg-green-500/10 text-green-700 dark:text-green-400";
const RESET_HOVER = "hover:bg-destructive/10 hover:text-destructive";

export function BuilderToolbarButton({
  onClick,
  title,
  disabled,
  active,
  activeClass,
  hoverClass,
  className,
  children,
  type = "button",
  ...rest
}: {
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  active?: boolean;
  activeClass?: string;
  hoverClass?: string;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "onClick" | "title" | "disabled" | "type">) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        BUILDER_TOOLBAR_BTN_CLASS,
        disabled && "pointer-events-none opacity-40",
        active ? (activeClass ?? "bg-secondary text-foreground") : hoverClass,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * Shared builder action bar. Canonical order: Save / Save as / Load / Share / Reset,
 * then builder-specific extras (Import, Compare), a second group (Reactor / Catalyst),
 * and an optional trailing control (Report). Share and Reset render only when a handler
 * is passed so existing behavior is unchanged on builders that do not have them.
 */
export function BuilderToolbar({
  canUpdate,
  dirty,
  onUpdate,
  onSaveAs,
  onSaveNew,
  onLoad,
  loadTitle = "Load",
  onShare,
  shareCopied,
  shareDisabled,
  shareTitle = "Copy shareable link",
  onReset,
  resetDisabled,
  resetTitle = "Reset this build",
  leading,
  extras,
  secondary,
  aside,
  trailing,
  className,
}: {
  canUpdate: boolean;
  dirty?: boolean;
  onUpdate: () => void;
  onSaveAs: () => void;
  onSaveNew: () => void;
  onLoad: () => void;
  loadTitle?: string;
  onShare?: () => void;
  shareCopied?: boolean;
  shareDisabled?: boolean;
  shareTitle?: string;
  onReset?: () => void;
  resetDisabled?: boolean;
  resetTitle?: string;
  leading?: ReactNode;
  extras?: ReactNode;
  secondary?: ReactNode;
  /** Un-grouped controls after the secondary cluster (e.g. progenitor). */
  aside?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <BuilderActionBar className={className} data-testid="builder-toolbar">
      {leading}
      <BuilderActionGroup>
        <BuilderSaveControls
          canUpdate={canUpdate}
          dirty={dirty}
          dirtyClass={SAVE_DIRTY_CLASS}
          dotClass={SAVE_DIRTY_DOT_CLASS}
          className={cn(BUILDER_TOOLBAR_BTN_CLASS, SAVE_HOVER)}
          onUpdate={onUpdate}
          onSaveAs={onSaveAs}
          onSaveNew={onSaveNew}
        />
        <BuilderToolbarButton onClick={onLoad} title={loadTitle} hoverClass={LOAD_HOVER}>
          <FolderOpen className="h-3.5 w-3.5" />
          <span className="inline">Load</span>
        </BuilderToolbarButton>
        {onShare ? (
          <BuilderToolbarButton
            onClick={onShare}
            disabled={shareDisabled}
            title={shareTitle}
            active={!!shareCopied}
            activeClass={SHARE_COPIED}
            hoverClass={SHARE_HOVER}
          >
            {shareCopied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            <span className="inline">{shareCopied ? "Copied!" : "Share"}</span>
          </BuilderToolbarButton>
        ) : null}
        {onReset ? (
          <BuilderToolbarButton
            onClick={onReset}
            disabled={resetDisabled}
            title={resetTitle}
            hoverClass={RESET_HOVER}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="inline">Reset</span>
          </BuilderToolbarButton>
        ) : null}
        {extras}
      </BuilderActionGroup>
      {secondary ? <BuilderActionGroup>{secondary}</BuilderActionGroup> : null}
      {aside}
      {trailing ? (
        <>
          <div className="flex-1" />
          {trailing}
        </>
      ) : null}
    </BuilderActionBar>
  );
}

/** Report-issue link styling used on every builder that has a Report action. */
export const BUILDER_REPORT_CLASS =
  "inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-500/5 hover:text-amber-900 dark:text-amber-400/70 dark:hover:text-amber-400 lg:pointer-fine:min-h-0 lg:py-1.5";
