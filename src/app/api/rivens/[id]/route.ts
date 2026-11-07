import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { logServerError } from "@/lib/log-server-error";
import { withSqliteSchemaRetry } from "@/lib/sqlite-schema-repair";

// DELETE /api/rivens/[id] — owner only (Round 54 riven library).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    return await withSqliteSchemaRetry(async () => {
      const riven = await prisma.savedRiven.findUnique({ where: { id }, select: { userId: true } });
      if (!riven) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (riven.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await prisma.savedRiven.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    });
  } catch (e) {
    logServerError("DELETE /api/rivens/[id]", e);
    return NextResponse.json({ error: "Failed to delete riven" }, { status: 500 });
  }
}
