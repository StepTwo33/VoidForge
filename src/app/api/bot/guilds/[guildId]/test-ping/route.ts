import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/auth";
import { listManageableGuilds } from "@/lib/bot/discord-link-service";
import { postChannelEmbed, fetchGuildChannels } from "@/lib/bot/discord-oauth";
import { embedTestPing } from "@/lib/bot/embeds";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ guildId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { guildId } = await ctx.params;
  const guilds = await listManageableGuilds(session.user.id);
  if (!guilds.some((g) => g.id === guildId && g.botInstalled)) {
    return NextResponse.json(
      { error: "Bot must be installed in this server" },
      { status: 400 },
    );
  }

  let body: { channelId?: string };
  try {
    body = (await req.json()) as { channelId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body?.channelId) {
    return NextResponse.json({ error: "channelId required" }, { status: 400 });
  }

  const channels = await fetchGuildChannels(guildId);
  const ch = channels.find((c) => c.id === body.channelId);
  if (!ch) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  const embed = embedTestPing(`#${ch.name}`);
  const result = await postChannelEmbed(body.channelId, embed as unknown as Record<string, unknown>);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Failed to send message", status: result.status },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
