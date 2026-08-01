import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  discordAvatarUrl,
  exchangeDiscordCode,
  fetchDiscordUser,
} from "@/lib/bot/discord-oauth";
import { getPublicOrigin } from "@/lib/site/public-origin";

export async function GET(req: NextRequest) {
  const origin = getPublicOrigin(req);
  const dashboard = `${origin}/bot/dashboard`;
  const fail = (msg: string) =>
    NextResponse.redirect(`${dashboard}?error=${encodeURIComponent(msg)}`);

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookieState = req.cookies.get("discord_oauth_state")?.value;
  const userId = req.cookies.get("discord_oauth_uid")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return fail("Invalid OAuth state. Try linking Discord again.");
  }
  if (!userId) {
    return fail("Session expired. Sign in and try again.");
  }

  const tokens = await exchangeDiscordCode(code, origin);
  if (!tokens?.access_token) {
    return fail("Could not exchange Discord authorization code.");
  }

  const discordUser = await fetchDiscordUser(tokens.access_token);
  if (!discordUser) {
    return fail("Could not load Discord profile.");
  }

  const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 604800) * 1000);
  const avatar = discordAvatarUrl(discordUser);

  // One Discord account → one Voidforge user
  const existingDiscord = await prisma.discordUserLink.findUnique({
    where: { discordId: discordUser.id },
  });
  if (existingDiscord && existingDiscord.userId !== userId) {
    return fail("That Discord account is already linked to another Voidforge user.");
  }

  await prisma.discordUserLink.upsert({
    where: { userId },
    create: {
      userId,
      discordId: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      discriminator: discordUser.discriminator,
      avatar,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      tokenExpiresAt: expiresAt,
    },
    update: {
      discordId: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      discriminator: discordUser.discriminator,
      avatar,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? null,
      tokenExpiresAt: expiresAt,
    },
  });

  const res = NextResponse.redirect(`${dashboard}?linked=1`);
  res.cookies.set("discord_oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("discord_oauth_uid", "", { path: "/", maxAge: 0 });
  return res;
}
