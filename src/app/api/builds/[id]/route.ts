import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { verifyAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { safeParseBuildJson } from "@/lib/builds/build-types";
import { sendBuildDeletedEmail } from "@/lib/auth/email";
import { logServerError } from "@/lib/log-server-error";

const STAFF_DELETE_REASON_MAX = 1000;

// DELETE /api/builds/[id] — owner, or staff (admin/moderator) moderation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { isAdmin } = await verifyAdmin();

  let reason = "";
  let notifyOwner = true;
  try {
    const json = (await req.json()) as { reason?: unknown; notifyOwner?: unknown };
    if (typeof json.reason === "string") {
      reason = json.reason.trim().slice(0, STAFF_DELETE_REASON_MAX);
    }
    if (json.notifyOwner === false) notifyOwner = false;
  } catch {
    // Owner deletes often send no body; that's fine.
  }

  const build = await prisma.build.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      name: true,
      type: true,
      user: {
        select: {
          email: true,
          name: true,
          username: true,
        },
      },
    },
  });

  if (!build) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = build.userId === session.user.id;
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const staffModeration = isAdmin && !isOwner;

  await prisma.build.delete({ where: { id } });

  if (staffModeration && notifyOwner && build.user.email) {
    try {
      await sendBuildDeletedEmail({
        to: build.user.email,
        ownerName: build.user.name || build.user.username || "Tenno",
        buildName: build.name,
        buildType: build.type,
        reason: reason || undefined,
      });
    } catch (err) {
      logServerError("Failed to email owner after staff build delete", err);
    }
  }

  return NextResponse.json({
    success: true,
    notified: Boolean(staffModeration && notifyOwner && build.user.email),
  });
}

// GET /api/builds/[id] (Public)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const build = await prisma.build.findUnique({
    where: { id },
    include: {
      user: {
        select: { username: true, name: true, image: true }
      }
    }
  });

  if (!build) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!build.isPublic) {
    // If it's not public, we need to check if the requester is the owner
    const session = await getSession();
    if (session?.user?.id !== build.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const parsed = safeParseBuildJson(build.data);
  if (parsed === null) {
    return NextResponse.json({ error: "Invalid build data" }, { status: 500 });
  }

  return NextResponse.json({
    id: build.id,
    name: build.name,
    description: build.description,
    isPublic: build.isPublic,
    type: build.type,
    itemId: build.itemId,
    upvoteCount: build.upvoteCount,
    data: parsed,
    createdAt: build.createdAt.getTime(),
    updatedAt: build.updatedAt.getTime(),
    author: {
      username: build.user.username || build.user.name || "Anonymous",
      profileSlug: build.user.username,
      image: build.user.image,
    }
  });
}
