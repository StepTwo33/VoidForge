import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/rivens/[id] — owner only (Round 54 riven library).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const riven = await prisma.savedRiven.findUnique({ where: { id }, select: { userId: true } });
  if (!riven) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (riven.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.savedRiven.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
