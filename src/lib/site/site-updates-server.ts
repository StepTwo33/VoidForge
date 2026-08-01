import { prisma } from "@/lib/prisma";
import type { SiteUpdateSummary } from "@/lib/site/site-updates";

type SiteUpdateRow = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: { username: string | null; name: string | null };
};

export function toSiteUpdateSummary(row: SiteUpdateRow): SiteUpdateSummary {
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

export async function fetchPublishedSiteUpdates(limit = 30): Promise<SiteUpdateSummary[]> {
  try {
    const rows = await prisma.siteUpdate.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: Math.min(Math.max(limit, 1), 50),
      select: selectFields,
    });
    return rows.map(toSiteUpdateSummary);
  } catch {
    return [];
  }
}

export async function fetchPublishedSiteUpdate(id: string): Promise<SiteUpdateSummary | null> {
  try {
    const row = await prisma.siteUpdate.findFirst({
      where: { id, published: true },
      select: selectFields,
    });
    return row ? toSiteUpdateSummary(row) : null;
  } catch {
    return null;
  }
}
