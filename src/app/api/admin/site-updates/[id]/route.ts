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
      username: row.author.username || row.author.name || "Frame Hub",
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

// PATCH /api/admin/site-updates/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { isAdmin } = await verifyFullAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

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

  try {
    const row = await prisma.siteUpdate.update({
      where: { id },
      data: {
        title: parsed.data.title,
        body: parsed.data.body,
        published: parsed.data.published,
        featured: parsed.data.featured,
      },
      select: selectFields,
    });
    return NextResponse.json(toSummary(row));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// DELETE /api/admin/site-updates/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { isAdmin } = await verifyFullAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.siteUpdate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
