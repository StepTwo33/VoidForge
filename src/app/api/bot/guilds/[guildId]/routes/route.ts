import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { isBotEventType } from "@/lib/bot/alert-types";
import { listManageableGuilds } from "@/lib/bot/discord-link-service";

type RouteBody = {
  routes: {
    channelId: string;
    eventType: string;
    enabled?: boolean;
    mentionRoleId?: string | null;
  }[];
};

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ guildId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { guildId } = await ctx.params;
  const guilds = await listManageableGuilds(session.user.id);
  const manageable = guilds.find((g) => g.id === guildId);
  if (!manageable) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: RouteBody;
  try {
    body = (await req.json()) as RouteBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || !Array.isArray(body.routes)) {
    return NextResponse.json({ error: "routes array required" }, { status: 400 });
  }

  // Validate
  for (const r of body.routes) {
    if (!r.channelId || !r.eventType || !isBotEventType(r.eventType)) {
      return NextResponse.json(
        { error: `Invalid route: ${r.eventType ?? "?"} → ${r.channelId ?? "?"}` },
        { status: 400 },
      );
    }
  }

  await prisma.discordGuild.upsert({
    where: { id: guildId },
    create: { id: guildId, name: manageable.name, icon: manageable.icon },
    update: { name: manageable.name, icon: manageable.icon },
  });

  // Replace all routes for this guild (simple full-save from dashboard)
  await prisma.$transaction(async (tx) => {
    await tx.alertRoute.deleteMany({ where: { guildId } });
    if (body.routes.length > 0) {
      await tx.alertRoute.createMany({
        data: body.routes.map((r) => ({
          guildId,
          channelId: r.channelId,
          eventType: r.eventType,
          enabled: r.enabled !== false,
          mentionRoleId: r.mentionRoleId ?? null,
        })),
      });
    }
  });

  const routes = await prisma.alertRoute.findMany({ where: { guildId } });
  return NextResponse.json({
    routes: routes.map((r) => ({
      id: r.id,
      channelId: r.channelId,
      eventType: r.eventType,
      enabled: r.enabled,
      mentionRoleId: r.mentionRoleId,
    })),
  });
}
