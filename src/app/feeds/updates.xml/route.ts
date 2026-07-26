import { NextResponse } from "next/server";
import { fetchPublishedSiteUpdates } from "@/lib/site/site-updates-server";
import { getSiteUrl, SITE_NAME } from "@/lib/site/site-metadata";
import {
  buildRssDocument,
  rssContentHtml,
  rssDescriptionWithLink,
  RSS_RESPONSE_HEADERS,
} from "@/lib/site/rss";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const updates = await fetchPublishedSiteUpdates(50);

  const xml = buildRssDocument({
    title: `${SITE_NAME} — What's New`,
    description: "Updates and announcements from the Frame Hub team.",
    link: `${siteUrl}/updates`,
    items: updates.map((u) => {
      const link = `${siteUrl}/updates/${u.id}`;
      return {
        title: u.title,
        // Discord message limit is 2000 chars — never dump the full body here.
        description: rssDescriptionWithLink(u.body, link),
        contentEncoded: rssContentHtml(u.body),
        link,
        guid: link,
        pubDate: new Date(u.createdAt),
        author: u.author.username,
      };
    }),
  });

  return new NextResponse(xml, { headers: RSS_RESPONSE_HEADERS });
}
