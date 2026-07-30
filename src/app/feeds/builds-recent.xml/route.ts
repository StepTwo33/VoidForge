import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site/site-metadata";
import { RSS_RESPONSE_HEADERS } from "@/lib/site/rss";
import {
  buildCommunityBuildsRss,
  latestBuildsRssTitle,
} from "@/lib/site/builds-rss";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const xml = await buildCommunityBuildsRss({
    siteUrl,
    title: latestBuildsRssTitle(),
    description: "Recently updated public builds shared on Frame Hub.",
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
  });

  return new NextResponse(xml, { headers: RSS_RESPONSE_HEADERS });
}
