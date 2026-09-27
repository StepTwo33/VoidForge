import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { isAllowedBuildType } from "@/lib/builds/build-types";
import { parseBuildTags } from "@/lib/builds/build-tags";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;

function toPublicSummary(
  build: {
    id: string;
    name: string;
    description: string;
    type: string;
    itemId: string;
    upvoteCount: number;
    createdAt: Date;
    updatedAt: Date;
    tags?: string;
    user: { username: string | null; name: string | null; image: string | null };
  },
  voted?: boolean
) {
  return {
    id: build.id,
    name: build.name,
    description: build.description,
    type: build.type,
    itemId: build.itemId,
    upvoteCount: build.upvoteCount,
    tags: parseBuildTags(build.tags),
    createdAt: build.createdAt.getTime(),
    updatedAt: build.updatedAt.getTime(),
    author: {
      username: build.user.username || build.user.name || "Anonymous",
      profileSlug: build.user.username,
      image: build.user.image,
    },
    ...(voted !== undefined ? { voted } : {}),
  };
}

// GET /api/builds/public?type=&itemId=&sort=recent|popular&q=&tag=&featured=&limit=&cursor=
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const type = params.get("type");
  const itemId = params.get("itemId");
  const sort = params.get("sort") === "popular" ? "popular" : "recent";
  const q = params.get("q")?.trim() ?? "";
  const tag = params.get("tag")?.trim() ?? "";
  const featured = params.get("featured") === "1";
  const userId = params.get("userId");
  const limit = Math.min(
    Math.max(parseInt(params.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );
  const cursor = params.get("cursor");

  if (type && !isAllowedBuildType(type)) {
    return NextResponse.json({ error: "Invalid build type" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isPublic: true, user: { bannedAt: null } };
  if (type) where.type = type;
  if (itemId) where.itemId = itemId;
  if (userId) where.userId = userId;
  if (tag) {
    // tags stored as JSON array string — match quoted id
    where.tags = { contains: `"${tag}"` };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (featured) {
    // Build of the day pool: last 14 days, at least 1 upvote
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    where.updatedAt = { gte: since };
    where.upvoteCount = { gte: 1 };
  } else if (sort === "popular") {
    // Top rated: only builds that have actually been upvoted
    where.upvoteCount = { gte: 1 };
  }

  // `id` tie-breaker keeps cursor pagination stable when sort keys collide.
  const orderBy =
    featured || sort === "popular"
      ? [{ upvoteCount: "desc" as const }, { updatedAt: "desc" as const }, { id: "desc" as const }]
      : [{ updatedAt: "desc" as const }, { id: "desc" as const }];

  let builds;
  try {
    builds = await prisma.build.findMany({
      where,
      orderBy,
      take: featured ? Math.min(limit, 5) : limit + 1,
      ...(cursor && !featured
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        itemId: true,
        upvoteCount: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { username: true, name: true, image: true } },
      },
    });
  } catch {
    // Cursor build may have been deleted/unpublished, or tags column not migrated yet.
    return NextResponse.json({ builds: [], nextCursor: null });
  }

  const hasMore = builds.length > limit;
  const page = hasMore ? builds.slice(0, limit) : builds;
  const nextCursor = hasMore ? page[page.length - 1]?.id : null;

  const session = await getSession();
  let votedIds = new Set<string>();
  if (session?.user?.id && page.length > 0) {
    const votes = await prisma.buildVote.findMany({
      where: {
        userId: session.user.id,
        buildId: { in: page.map((b) => b.id) },
      },
      select: { buildId: true },
    });
    votedIds = new Set(votes.map((v) => v.buildId));
  }

  return NextResponse.json({
    builds: page.map((b) => toPublicSummary(b, session?.user?.id ? votedIds.has(b.id) : undefined)),
    nextCursor,
  });
}
