import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site/site-metadata";

/** Bump when replacing the social preview image so Discord/Twitter re-scrape. */
export const OG_IMAGE_VERSION = "7";
export const OG_IMAGE_URL = `/og-embed.png?v=${OG_IMAGE_VERSION}`;

/** RSS autodiscovery links, kept on every page (a route's `alternates` replaces the root's). */
export const RSS_ALTERNATE_TYPES = {
  "application/rss+xml": [
    { url: "/feeds/updates.xml", title: `${SITE_NAME} What's New` },
    { url: "/feeds/builds-recent.xml", title: `${SITE_NAME} Latest Builds` },
    { url: "/feeds/builds.xml", title: `${SITE_NAME} Top Builds` },
  ],
};

/**
 * Per-route metadata: title, description, canonical URL and matching Open Graph /
 * Twitter tags. Next merges metadata shallowly, so `openGraph` and `twitter` are
 * rebuilt in full here (including the image) instead of inheriting the root's
 * home-page title/url.
 *
 * `path` is the canonical pathname ("/codex"); `metadataBase` in the root layout
 * makes it absolute.
 */
export function pageMetadata({
  path,
  title,
  description,
  socialTitle,
}: {
  path: string;
  title: string;
  description: string;
  /** Title used for og:title / twitter:title; defaults to "<title> | Voidforge". */
  socialTitle?: string;
}): Metadata {
  const ogTitle = socialTitle ?? `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE_TYPES },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: ogTitle,
      description,
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}
