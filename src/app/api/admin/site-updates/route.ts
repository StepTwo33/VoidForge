import { NextRequest, NextResponse } from "next/server";
import { verifyFullAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import {
  parseSiteUpdatePayload,
  type SiteUpdateSummary,
} from "@/lib/site/site-updates";

function toSummary(
  row: {
    id: string;
    title: string;
    body: string;
    published: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: { username: string | null; name: string | null };
  },
): SiteUpdateSummary {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    published: row.published,
    featured: row.featured,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
    author: {
      username: row.author.username || row.author.name || "Voidforge",
      profileSlug: row.author.username,
    },
  };
}

const selectFields = {
  id: true,
  title: true,
  body: true,
  published: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { username: true, name: true } },
} as const;

// GET /api/admin/site-updates — all posts (admin only)
export async function GET() {
  const { isAdmin } = await verifyFullAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.siteUpdate.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: selectFields,
  });

  return NextResponse.json({ updates: rows.map(toSummary) });
}

// POST /api/admin/site-updates — create post (admin only)
export async function POST(req: NextRequest) {
  const { isAdmin, userId } = await verifyFullAdmin();
  if (!isAdmin || !userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseSiteUpdatePayload(json);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const row = await prisma.siteUpdate.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body,
      published: parsed.data.published,
      featured: parsed.data.featured,
      authorId: userId,
    },
    select: selectFields,
  });

  return NextResponse.json(toSummary(row), { status: 201 });
}
