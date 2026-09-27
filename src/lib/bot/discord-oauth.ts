/**
 * Discord OAuth helpers for linking Voidforge accounts and bot invite URLs.
 */

import { getPublicOrigin } from "@/lib/site/public-origin";

const DISCORD_API = "https://discord.com/api/v10";

/** View Channel + Send Messages + Embed Links + Read Message History */
export const BOT_PERMISSIONS = String(1024 + 2048 + 16384 + 65536);

export function getDiscordClientId(): string | null {
  return process.env.DISCORD_CLIENT_ID?.trim() || null;
}

export function getDiscordClientSecret(): string | null {
  return process.env.DISCORD_CLIENT_SECRET?.trim() || null;
}

export function getDiscordBotToken(): string | null {
  return process.env.DISCORD_BOT_TOKEN?.trim() || null;
}

export function discordConfigured(): boolean {
  return !!(getDiscordClientId() && getDiscordClientSecret() && getDiscordBotToken());
}

export function getDiscordOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/$/, "")}/api/bot/discord/callback`;
}

export function getDiscordLinkAuthUrl(origin: string, state: string): string {
  const clientId = getDiscordClientId();
  if (!clientId) throw new Error("DISCORD_CLIENT_ID is not set");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getDiscordOAuthRedirectUri(origin),
    response_type: "code",
    scope: "identify guilds",
    state,
    prompt: "consent",
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

export function getBotInviteUrl(guildId?: string): string | null {
  const clientId = getDiscordClientId();
  if (!clientId) return null;
  const params = new URLSearchParams({
    client_id: clientId,
    permissions: BOT_PERMISSIONS,
    scope: "bot applications.commands",
  });
  if (guildId) params.set("guild_id", guildId);
  params.set("disable_guild_select", guildId ? "true" : "false");
  return `https://discord.com/api/oauth2/authorize?${params}`;
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export async function exchangeDiscordCode(
  code: string,
  origin: string,
): Promise<DiscordTokenResponse | null> {
  const clientId = getDiscordClientId();
  const clientSecret = getDiscordClientSecret();
  if (!clientId || !clientSecret) return null;

  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: getDiscordOAuthRedirectUri(origin),
    }),
  });
  if (!res.ok) return null;
  return (await res.json()) as DiscordTokenResponse;
}

export async function refreshDiscordToken(
  refreshToken: string,
): Promise<DiscordTokenResponse | null> {
  const clientId = getDiscordClientId();
  const clientSecret = getDiscordClientSecret();
  if (!clientId || !clientSecret) return null;

  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) return null;
  return (await res.json()) as DiscordTokenResponse;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string | null;
  avatar: string | null;
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser | null> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as DiscordUser;
}

export interface DiscordPartialGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

const MANAGE_GUILD = BigInt(0x20);
const ADMINISTRATOR = BigInt(0x8);

export function canManageGuild(permissions: string): boolean {
  try {
    const p = BigInt(permissions);
    return (p & ADMINISTRATOR) !== BigInt(0) || (p & MANAGE_GUILD) !== BigInt(0);
  } catch {
    return false;
  }
}

export async function fetchUserGuilds(accessToken: string): Promise<DiscordPartialGuild[]> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  return (await res.json()) as DiscordPartialGuild[];
}

export async function fetchBotGuilds(): Promise<DiscordPartialGuild[]> {
  const token = getDiscordBotToken();
  if (!token) return [];
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) return [];
  return (await res.json()) as DiscordPartialGuild[];
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  position?: number;
  parent_id?: string | null;
}

/** Guild text channel type */
export const CHANNEL_TYPE_GUILD_TEXT = 0;
export const CHANNEL_TYPE_GUILD_ANNOUNCEMENT = 5;

export async function fetchGuildChannels(guildId: string): Promise<DiscordChannel[]> {
  const token = getDiscordBotToken();
  if (!token) return [];
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) return [];
  const channels = (await res.json()) as DiscordChannel[];
  return channels
    .filter((c) => c.type === CHANNEL_TYPE_GUILD_TEXT || c.type === CHANNEL_TYPE_GUILD_ANNOUNCEMENT)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

export async function postChannelEmbed(
  channelId: string,
  embed: Record<string, unknown>,
  content?: string,
): Promise<{ ok: boolean; status: number; error?: string }> {
  const token = getDiscordBotToken();
  if (!token) return { ok: false, status: 0, error: "Bot token not configured" };

  const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content || undefined,
      embeds: [embed],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: text.slice(0, 300) };
  }
  return { ok: true, status: res.status };
}

export function discordAvatarUrl(user: DiscordUser): string | null {
  if (!user.avatar) return null;
  const ext = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}`;
}

/** Re-export for routes that already import public origin helpers. */
export { getPublicOrigin };
