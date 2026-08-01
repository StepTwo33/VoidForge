import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site/site-metadata";
import { RSS_RESPONSE_HEADERS } from "@/lib/site/rss";
import {
  buildCommunityBuildsRss,
  TOP_BUILDS_MIN_UPVOTES,
  topBuildsRssTitle,
} from "@/lib/site/builds-rss";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const xml = await buildCommunityBuildsRss({
    siteUrl,
    title: topBuildsRssTitle(),
    description: "Highest-voted public builds on Voidforge (same pool as Discover → Top rated).",
    orderBy: [{ upvoteCount: "desc" }, { updatedAt: "desc" }, { id: "desc" }],
    minUpvotes: TOP_BUILDS_MIN_UPVOTES,
  });

  return new NextResponse(xml, { headers: RSS_RESPONSE_HEADERS });
}
