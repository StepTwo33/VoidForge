import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

// GET /api/admin/users?q= — list users (admin/mod only)
export async function GET(req: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q } },
            { username: { contains: q } },
            { name: { contains: q } },
          ],
        }
      : undefined,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      bannedAt: true,
      banReason: true,
      supporterAt: true,
      newsletterOptIn: true,
      createdAt: true,
      _count: { select: { builds: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ users });
}
