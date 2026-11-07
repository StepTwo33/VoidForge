import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAllowedBuildType } from "@/lib/builds/build-types";
import { resolveSubtypeItemFilter } from "@/lib/builds/discover-subtypes";

// GET /api/builds/public/counts?type=&slot=
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const type = params.get("type");
  const slot = params.get("slot");

  if (!type || !isAllowedBuildType(type)) {
    return NextResponse.json({ error: "Invalid or missing build type" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isPublic: true, type, user: { bannedAt: null } };

  if (slot && slot !== "companion_weapon") {
    const filter = resolveSubtypeItemFilter(type, slot);
    if (filter.kind === "ids") {
      if (filter.ids.length === 0) {
        return NextResponse.json({ counts: {} as Record<string, number> });
      }
      where.itemId = { in: filter.ids };
    } else if (filter.kind === "prefix") {
      where.itemId = { startsWith: filter.prefix };
    }
  }

  const includeCompanionWeapons =
    (type === "companion" || type === "weapon") &&
    (!slot || slot === "all" || slot === "companion_weapon");

  try {
    const counts: Record<string, number> = {};
    if (slot !== "companion_weapon") {
      const rows = await prisma.build.groupBy({
        by: ["itemId"],
        where,
        _count: { _all: true },
      });
      for (const row of rows) {
        if (!row.itemId) continue;
        counts[row.itemId] = row._count._all;
      }
    }
    if (includeCompanionWeapons) {
      const compBuilds = await prisma.build.findMany({
        where: {
          isPublic: true,
          type: "companion",
          user: { bannedAt: null },
          data: { contains: `"weaponId":"` },
        },
        select: { data: true },
      });
      for (const b of compBuilds) {
        const m = /"weaponId":"([a-z0-9_]+)"/i.exec(b.data);
        if (m?.[1]) {
          const key = `weapon:${m[1]}`;
          counts[key] = (counts[key] ?? 0) + 1;
        }
      }
    }
    return NextResponse.json({ counts });
  } catch {
    return NextResponse.json({ counts: {} as Record<string, number> });
  }
}
