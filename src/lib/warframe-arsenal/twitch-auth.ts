/** Twitch extension identity for the official Warframe Arsenal extension. */
const WARFRAME_ARSENAL_EXTENSION_ID = "ud1zj704c0eb1s553jbkayvqxjft97";

/** Public Twitch web client id (used by gql.twitch.tv for ExtensionsForChannel). */
const TWITCH_WEB_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

const EXTENSIONS_FOR_CHANNEL_HASH =
  "d52085e5b03d1fc3534aa49de8f5128b2ee0f4e700f79bf3875dcb1c90947ac3";

type CachedJwt = {
  token: string;
  expiresAt: number;
};

let cachedJwt: CachedJwt | null = null;

function extensionOrigin(): string {
  return `https://${WARFRAME_ARSENAL_EXTENSION_ID}.ext-twitch.tv`;
}

function parseJwtExpiry(jwt: string): number {
  try {
    const payload = jwt.split(".")[1];
    if (!payload) return Date.now() + 30 * 60_000;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    if (typeof decoded.exp === "number") {
      // Refresh one minute before expiry.
      return (decoded.exp - 60) * 1000;
    }
  } catch {
    // Fall through to default TTL.
  }
  return Date.now() + 30 * 60_000;
}

async function fetchJwtForChannel(channelId: string): Promise<string | null> {
  const res = await fetch("https://gql.twitch.tv/gql", {
    method: "POST",
    headers: {
      "Client-Id": TWITCH_WEB_CLIENT_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        operationName: "ExtensionsForChannel",
        variables: { channelID: channelId },
        extensions: {
          persistedQuery: { version: 1, sha256Hash: EXTENSIONS_FOR_CHANNEL_HASH },
        },
      },
    ]),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Array<{
    data?: {
      user?: {
        channel?: {
          selfInstalledExtensions?: Array<{
            token?: { extensionID?: string; jwt?: string };
          }>;
        };
      };
    };
  }>;

  const extensions = data[0]?.data?.user?.channel?.selfInstalledExtensions ?? [];
  for (const ext of extensions) {
    if (ext.token?.extensionID === WARFRAME_ARSENAL_EXTENSION_ID && ext.token.jwt) {
      return ext.token.jwt;
    }
  }
  return null;
}

/**
 * Bearer token for api.warframe.com/cdn/twitch/getActiveLoadout.php.
 * Cached in memory until shortly before JWT expiry.
 */
export async function getWarframeArsenalJwt(): Promise<string> {
  const envJwt = process.env.WARFRAME_ARSENAL_JWT?.trim();
  if (envJwt) return envJwt;

  if (cachedJwt && cachedJwt.expiresAt > Date.now()) {
    return cachedJwt.token;
  }

  const channelId = process.env.TWITCH_ARSENAL_CHANNEL_ID?.trim();
  if (!channelId) {
    throw new Error(
      "TWITCH_ARSENAL_CHANNEL_ID is not set. Install the Warframe Arsenal Twitch extension on your channel and set its numeric channel ID, or provide WARFRAME_ARSENAL_JWT.",
    );
  }

  const jwt = await fetchJwtForChannel(channelId);
  if (jwt) {
    cachedJwt = { token: jwt, expiresAt: parseJwtExpiry(jwt) };
    return jwt;
  }

  throw new Error(
    "Could not obtain a Twitch extension token from TWITCH_ARSENAL_CHANNEL_ID. Confirm the Warframe Arsenal extension is installed on that channel.",
  );
}

export function warframeArsenalRequestHeaders(jwt: string): HeadersInit {
  const origin = extensionOrigin();
  return {
    Accept: "application/json",
    Origin: origin,
    Referer: origin,
    Authorization: `Bearer ${jwt}`,
    "User-Agent": "Voidforge/1.0 (Warframe Arsenal Twitch Extension)",
  };
}
