"use client";

import { FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

/**
 * Shared empty state for "no saved builds" (catalog Saved tab and the Load dialog).
 * Copy and layout stay the same across every builder.
 */
export function BuilderSavedEmpty({
  typeLabel,
  title,
  description = "Save a build from the builder to see it here.",
}: {
  /** e.g. "warframe", "weapon" — used as "No saved {typeLabel} builds yet". */
  typeLabel?: string;
  title?: string;
  description?: string;
}) {
  const heading =
    title ?? (typeLabel ? `No saved ${typeLabel} builds yet` : "No saved builds yet");
  return (
    <EmptyState
      size="compact"
      icon={FolderOpen}
      title={heading}
      description={description}
      titleAs="p"
    />
  );
}
