import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteUrl, SITE_NAME } from "@/lib/site/site-metadata";
import { buildRssDocument, RSS_RESPONSE_HEADERS } from "@/lib/site/rss";

export const dynamic = "force-dynamic";

const FEED_LIMIT = 25;

export async function GET() {
  const siteUrl = getSiteUrl();

  let builds: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    upvoteCount: number;
    updatedAt: Date;
    user: { username: string | null; name: string | null };
  }> = [];

  try {
    builds = await prisma.build.findMany({
      where: { isPublic: true, user: { bannedAt: null } },
      orderBy: [{ upvoteCount: "desc" }, { updatedAt: "desc" }, { id: "desc" }],
      take: FEED_LIMIT,
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        upvoteCount: true,
        updatedAt: true,
        user: { select: { username: true, name: true } },
      },
    });
  } catch {
    builds = [];
  }

  const xml = buildRssDocument({
    title: `${SITE_NAME} — Top Community Builds`,
    description: "Highest-voted public builds shared on Frame Hub.",
    link: `${siteUrl}/discover`,
    items: builds.map((b) => {
      const author = b.user.username || b.user.name || "Anonymous";
      const desc = [
        b.description?.trim() || `${b.type} build`,
        `${b.upvoteCount} upvote${b.upvoteCount === 1 ? "" : "s"}`,
        `by @${author}`,
      ].join(" · ");
      return {
        title: b.name,
        description: desc,
        link: `${siteUrl}/build/${b.id}`,
        guid: `${siteUrl}/build/${b.id}`,
        pubDate: b.updatedAt,
        author,
      };
    }),
  });

  return new NextResponse(xml, { headers: RSS_RESPONSE_HEADERS });
}
