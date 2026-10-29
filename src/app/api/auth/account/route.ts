import { NextRequest, NextResponse } from "next/server";
import { getSession, SESSION_COOKIE, clearFramehubSessionCookieOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { logServerError } from "@/lib/log-server-error";
import { getPublicOrigin } from "@/lib/site/public-origin";
import { removeAvatarFiles } from "@/lib/auth/avatar-files";

export const dynamic = "force-dynamic";

/**
 * Permanently delete the signed-in user's account and cascaded data
 * (sessions, OAuth accounts, builds, votes, Discord link) and their uploaded avatar file.
 * Reports and donation records are kept but unlinked (onDelete: SetNull).
 */
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`account_delete:${session.user.id}:${ip}`, 5, 60 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json({ error: "Too many delete attempts. Try again later." }, { status: 429 });
  }

  let confirm: string | undefined;
  try {
    const body = (await req.json()) as { confirm?: string };
    confirm = typeof body.confirm === "string" ? body.confirm.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, username: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const expected = (user.username || user.email || "").trim();
  if (!confirm || !expected || confirm.toLowerCase() !== expected.toLowerCase()) {
    return NextResponse.json(
      { error: "Confirmation must match your username or email exactly." },
      { status: 400 },
    );
  }

  try {
    await prisma.user.delete({ where: { id: user.id } });
  } catch (err) {
    logServerError("account_delete", err);
    return NextResponse.json({ error: "Could not delete account." }, { status: 500 });
  }

  // The avatar file is served by URL, so remove it too (only after the account row is gone).
  await removeAvatarFiles(user.id);

  const origin = getPublicOrigin(req);
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", clearFramehubSessionCookieOptions(origin));
  return response;
}
