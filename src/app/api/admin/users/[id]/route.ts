import { NextRequest, NextResponse } from "next/server";
import { banUser, unbanUser, verifyAdmin, verifyFullAdmin } from "@/lib/auth/admin";
import { grantSupporter, revokeSupporter } from "@/lib/auth/supporter";
import { prisma } from "@/lib/prisma";
import { logServerError } from "@/lib/log-server-error";

const VALID_ROLES = ["user", "moderator", "admin"] as const;

// PATCH /api/admin/users/[id] — ban, unban, or set role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { isAdmin, userId: actorId } = await verifyAdmin();
  if (!isAdmin || !actorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === actorId) {
    return NextResponse.json({ error: "You cannot modify your own account here." }, { status: 400 });
  }

  let body: { action?: string; reason?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      email: true,
      username: true,
      name: true,
      bannedAt: true,
      banReason: true,
      supporterAt: true,
      newsletterOptIn: true,
      createdAt: true,
    },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    if (body.action === "ban") {
      await banUser(id, body.reason);
    } else if (body.action === "unban") {
      await unbanUser(id);
    } else if (body.action === "setRole") {
      const { isAdmin: isFullAdmin } = await verifyFullAdmin();
      if (!isFullAdmin) {
        return NextResponse.json({ error: "Only admins can change roles." }, { status: 403 });
      }
      const role = body.role;
      if (!role || !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      await prisma.user.update({ where: { id }, data: { role } });
    } else if (body.action === "grantSupporter") {
      const { isAdmin: isFullAdmin } = await verifyFullAdmin();
      if (!isFullAdmin) {
        return NextResponse.json({ error: "Only admins can grant supporter badges." }, { status: 403 });
      }
      await grantSupporter(id);
    } else if (body.action === "revokeSupporter") {
      const { isAdmin: isFullAdmin } = await verifyFullAdmin();
      if (!isFullAdmin) {
        return NextResponse.json({ error: "Only admins can revoke supporter badges." }, { status: 403 });
      }
      await revokeSupporter(id);
    } else if (body.action === "unsubscribeNewsletter") {
      await prisma.user.update({ where: { id }, data: { newsletterOptIn: false } });
    } else if (body.action === "subscribeNewsletter") {
      await prisma.user.update({ where: { id }, data: { newsletterOptIn: true } });
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const updated = await prisma.user.findUnique({
      where: { id },
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
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    logServerError("PATCH /api/admin/users/[id]", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
