import type { Metadata } from "next";
import { summarizeBuildPreview } from "@/lib/builds/build-preview";
import { safeParseBuildJson } from "@/lib/builds/build-types";
import { OG_IMAGE_URL, RSS_ALTERNATE_TYPES } from "@/lib/site/page-metadata";
import { SITE_NAME } from "@/lib/site/site-metadata";

/** The DB fields the shared build page reads (one `findUnique`, shared by metadata and page). */
export interface BuildPageRecord {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  type: string;
  data: string;
  updatedAt: Date;
  user: { username: string | null; name: string | null };
}

export const BUILD_DESCRIPTION_MAX = 200;

function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1).trimEnd()}…`;
}

/** Social card fields for a public build, or null when the build must not be described. */
export function publicBuildCard(record: BuildPageRecord | null): {
  name: string;
  itemName: string;
  itemImage: string | null;
  typeLabel: string;
  author: string;
  summary: string;
} | null {
  if (!record || !record.isPublic) return null;
  const data = safeParseBuildJson(record.data);
  if (data === null || data === undefined) return null;
  const preview = summarizeBuildPreview(record.type, data);
  return {
    name: record.name,
    itemName: preview.itemName,
    itemImage: preview.itemImage,
    typeLabel: preview.typeLabel,
    author: record.user.username || record.user.name || "Anonymous",
    summary: record.description?.trim() || preview.modSummary,
  };
}

/** Generic metadata for a missing or private build: no build data, not indexed. */
export function unavailableBuildMetadata(): Metadata {
  return {
    title: "Build not available",
    description: "This build doesn't exist or isn't public.",
    robots: { index: false, follow: false },
  };
}

/**
 * Shared build page metadata: "<build name> — <item>" title, description with author, item and a
 * short summary, canonical + og:url /build/<id>. Private and missing builds get generic noindex
 * metadata (nothing about the build, so no leak to crawlers or link previews).
 * `ogImageUrl` is the build's dynamic social image (opengraph-image route); defaults to the generic one.
 */
export function buildPageMetadata(
  record: BuildPageRecord | null,
  ogImageUrl: string = OG_IMAGE_URL,
): Metadata {
  const card = publicBuildCard(record);
  if (!record || !card) return unavailableBuildMetadata();

  const path = `/build/${encodeURIComponent(record.id)}`;
  const nameHasItem = card.name.toLowerCase().includes(card.itemName.toLowerCase());
  const title = nameHasItem || card.itemName === "Unknown item" ? card.name : `${card.name} — ${card.itemName}`;
  const socialTitle = `${title} | ${SITE_NAME}`;
  const description = clip(
    `${card.itemName} ${card.typeLabel.toLowerCase()} build by ${card.author}. ${card.summary}`,
    BUILD_DESCRIPTION_MAX,
  );
  const alt = `${card.name}: ${card.itemName} build on ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE_TYPES },
    openGraph: {
      type: "article",
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: socialTitle,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: ogImageUrl, alt }],
    },
  };
}
