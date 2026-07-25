import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site/site-metadata";

/** Refresh public build/profile URLs about hourly. */
export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/discover", changeFrequency: "hourly", priority: 0.9 },
  { path: "/weapon-builder", changeFrequency: "weekly", priority: 0.85 },
  { path: "/warframe-builder", changeFrequency: "weekly", priority: 0.85 },
  { path: "/companion-builder", changeFrequency: "weekly", priority: 0.8 },
  { path: "/modular-builder", changeFrequency: "weekly", priority: 0.8 },
  { path: "/archwing-builder", changeFrequency: "weekly", priority: 0.75 },
  { path: "/railjack-builder", changeFrequency: "weekly", priority: 0.75 },
  { path: "/codex", changeFrequency: "weekly", priority: 0.8 },
  { path: "/mod-browser", changeFrequency: "weekly", priority: 0.7 },
  { path: "/arcane-browser", changeFrequency: "weekly", priority: 0.7 },
  { path: "/riven-calculator", changeFrequency: "monthly", priority: 0.65 },
  { path: "/damage-simulator", changeFrequency: "monthly", priority: 0.65 },
  { path: "/compare", changeFrequency: "monthly", priority: 0.6 },
  { path: "/player-sync", changeFrequency: "monthly", priority: 0.55 },
  { path: "/loadouts", changeFrequency: "monthly", priority: 0.55 },
  { path: "/updates", changeFrequency: "daily", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guides/how-to-mod", changeFrequency: "monthly", priority: 0.7 },
  { path: "/guides/how-to-mod/basics", changeFrequency: "monthly", priority: 0.65 },
  { path: "/guides/how-to-mod/weapons", changeFrequency: "monthly", priority: 0.65 },
  { path: "/guides/how-to-mod/warframes", changeFrequency: "monthly", priority: 0.65 },
  { path: "/guides/how-to-mod/archwing", changeFrequency: "monthly", priority: 0.65 },
  { path: "/support", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
];

const MAX_PUBLIC_BUILDS = 10_000;
const MAX_PUBLIC_PROFILES = 5_000;
const MAX_SITE_UPDATES = 500;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const [builds, profiles, updates] = await Promise.all([
      prisma.build.findMany({
        where: { isPublic: true, user: { bannedAt: null } },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: MAX_PUBLIC_BUILDS,
      }),
      prisma.user.findMany({
        where: {
          bannedAt: null,
          username: { not: null },
          builds: { some: { isPublic: true } },
        },
        select: { username: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: MAX_PUBLIC_PROFILES,
      }),
      prisma.siteUpdate.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
        take: MAX_SITE_UPDATES,
      }),
    ]);

    for (const build of builds) {
      entries.push({
        url: `${base}/build/${build.id}`,
        lastModified: build.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const profile of profiles) {
      if (!profile.username) continue;
      entries.push({
        url: `${base}/u/${encodeURIComponent(profile.username)}`,
        lastModified: profile.createdAt,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }

    for (const update of updates) {
      entries.push({
        url: `${base}/updates/${update.id}`,
        lastModified: update.updatedAt,
        changeFrequency: "monthly",
        priority: 0.55,
      });
    }
  } catch (err) {
    console.error("[sitemap] Failed to load dynamic URLs; serving static routes only.", err);
  }

  return entries;
}
