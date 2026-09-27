import { prisma } from "@/lib/prisma";
import { SITE_NAME } from "@/lib/site/site-metadata";
import { buildRssDocument, type RssItem } from "@/lib/site/rss";

export const BUILDS_FEED_LIMIT = 25;

/** Same floor as Discover / sidebar “Top rated” (`sort=popular`). */
export const TOP_BUILDS_MIN_UPVOTES = 1;

type BuildsOrderBy =
  | [{ upvoteCount: "desc" }, { updatedAt: "desc" }, { id: "desc" }]
  | [{ updatedAt: "desc" }, { id: "desc" }];

export async function buildCommunityBuildsRss(opts: {
  siteUrl: string;
  title: string;
  description: string;
  orderBy: BuildsOrderBy;
  /** When set, only include builds with at least this many upvotes. */
  minUpvotes?: number;
}): Promise<string> {
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
      where: {
        isPublic: true,
        user: { bannedAt: null },
        ...(opts.minUpvotes != null && opts.minUpvotes > 0
          ? { upvoteCount: { gte: opts.minUpvotes } }
          : {}),
      },
      orderBy: opts.orderBy,
      take: BUILDS_FEED_LIMIT,
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

  const items: RssItem[] = builds.map((b) => {
    const author = b.user.username || b.user.name || "Anonymous";
    const desc = [
      b.description?.trim() || `${b.type} build`,
      `${b.upvoteCount} upvote${b.upvoteCount === 1 ? "" : "s"}`,
      `by @${author}`,
    ].join(" · ");
    return {
      title: b.name,
      description: desc,
      link: `${opts.siteUrl}/build/${b.id}`,
      guid: `${opts.siteUrl}/build/${b.id}`,
      pubDate: b.updatedAt,
      author,
    };
  });

  return buildRssDocument({
    title: opts.title,
    description: opts.description,
    link: `${opts.siteUrl}/discover`,
    items,
  });
}

export function topBuildsRssTitle(): string {
  return `${SITE_NAME} — Top Community Builds`;
}

export function latestBuildsRssTitle(): string {
  return `${SITE_NAME} — Latest Community Builds`;
}
