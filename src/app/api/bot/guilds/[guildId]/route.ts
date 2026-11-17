import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { fetchGuildChannels, getBotInviteUrl } from "@/lib/bot/discord-oauth";
import { listManageableGuilds, guildIconUrl } from "@/lib/bot/discord-link-service";
import { BOT_EVENT_TYPES } from "@/lib/bot/alert-types";

async function assertCanManage(userId: string, guildId: string) {
  const guilds = await listManageableGuilds(userId);
  return guilds.find((g) => g.id === guildId && g.canManage) ?? null;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ guildId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { guildId } = await ctx.params;
  const manageable = await assertCanManage(session.user.id, guildId);
  if (!manageable) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.discordGuild.upsert({
    where: { id: guildId },
    create: {
      id: guildId,
      name: manageable.name,
      icon: manageable.icon,
    },
    update: { name: manageable.name, icon: manageable.icon },
  });
  await prisma.discordGuildConfig.upsert({
    where: { guildId },
    create: { guildId },
    update: {},
  });

  const [config, routes, channels] = await Promise.all([
    prisma.discordGuildConfig.findUnique({ where: { guildId } }),
    prisma.alertRoute.findMany({ where: { guildId } }),
    manageable.botInstalled ? fetchGuildChannels(guildId) : Promise.resolve([]),
  ]);

  return NextResponse.json({
    guild: {
      id: guildId,
      name: manageable.name,
      iconUrl: guildIconUrl(guildId, manageable.icon),
      botInstalled: manageable.botInstalled,
      inviteUrl: getBotInviteUrl(guildId),
    },
    config: {
      platform: config?.platform ?? "pc",
      timezone: config?.timezone ?? "UTC",
    },
    eventTypes: BOT_EVENT_TYPES,
    channels: channels.map((c) => ({ id: c.id, name: c.name })),
    routes: routes.map((r) => ({
      id: r.id,
      channelId: r.channelId,
      eventType: r.eventType,
      enabled: r.enabled,
      mentionRoleId: r.mentionRoleId,
    })),
  });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ guildId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { guildId } = await ctx.params;
  const manageable = await assertCanManage(session.user.id, guildId);
  if (!manageable) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { platform?: string; timezone?: string };
  try {
    body = (await req.json()) as { platform?: string; timezone?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const platform =
    body.platform === "ps4" || body.platform === "xb1" || body.platform === "swi" || body.platform === "pc"
      ? body.platform
      : undefined;

  await prisma.discordGuild.upsert({
    where: { id: guildId },
    create: { id: guildId, name: manageable.name, icon: manageable.icon },
    update: { name: manageable.name, icon: manageable.icon },
  });

  const config = await prisma.discordGuildConfig.upsert({
    where: { guildId },
    create: {
      guildId,
      platform: platform ?? "pc",
      timezone: body.timezone ?? "UTC",
    },
    update: {
      ...(platform ? { platform } : {}),
      ...(body.timezone ? { timezone: body.timezone } : {}),
    },
  });

  return NextResponse.json({ config });
}
