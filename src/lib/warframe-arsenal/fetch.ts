import {
  WARFRAME_ARSENAL_LOADOUT_URL,
  type WarframePlatform,
} from "@/lib/warframe-arsenal/platforms";
import { loadoutHasImportableContent, mapArsenalToImportPayload } from "@/lib/warframe-arsenal/map-import";
import { buildArsenalData } from "@/lib/warframe-arsenal/normalize-payload";
import { getWarframeArsenalJwt, warframeArsenalRequestHeaders } from "@/lib/warframe-arsenal/twitch-auth";

const FETCH_TIMEOUT_MS = 20_000;

export class ArsenalFetchError extends Error {
  constructor(
    message: string,
    readonly code: "invalid_request" | "not_shared" | "not_found" | "upstream",
  ) {
    super(message);
    this.name = "ArsenalFetchError";
  }
}

function normalizeAccount(account: string): string {
  return account.trim().toLowerCase();
}

export async function fetchAndMapWarframeArsenal(platform: WarframePlatform, account: string) {
  const normalized = normalizeAccount(account);
  if (!normalized || normalized.length < 1 || normalized.length > 64) {
    throw new ArsenalFetchError("Enter a valid in-game account name.", "invalid_request");
  }

  const base = WARFRAME_ARSENAL_LOADOUT_URL[platform];
  const url = `${base}?account=${encodeURIComponent(normalized)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let raw: unknown;
  try {
    let jwt: string;
    try {
      jwt = await getWarframeArsenalJwt();
    } catch {
      throw new ArsenalFetchError(
        "Player Sync is not configured for arsenal access. The server needs TWITCH_ARSENAL_CHANNEL_ID (a Twitch channel with the Warframe Arsenal extension installed) or WARFRAME_ARSENAL_JWT.",
        "upstream",
      );
    }

    const res = await fetch(url, {
      signal: controller.signal,
      headers: warframeArsenalRequestHeaders(jwt),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new ArsenalFetchError(
        res.status === 404
          ? "Account not found or loadout sharing is disabled."
          : `Warframe servers returned ${res.status}. Try again in a moment.`,
        res.status === 404 ? "not_found" : "upstream",
      );
    }

    raw = await res.json();

    if (!res.ok && raw && typeof raw === "object" && "errors" in (raw as object)) {
      // Fall through to shared error handling below.
    } else if (!res.ok) {
      throw new ArsenalFetchError(
        `Warframe servers returned ${res.status}. Try again in a moment.`,
        res.status === 404 ? "not_found" : "upstream",
      );
    }
  } catch (err) {
    if (err instanceof ArsenalFetchError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new ArsenalFetchError("Warframe loadout request timed out. Try again.", "upstream");
    }
    throw new ArsenalFetchError(
      "Could not reach Warframe loadout servers. Check your connection and try again.",
      "upstream",
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!raw || typeof raw !== "object") {
    throw new ArsenalFetchError("Unexpected response from Warframe servers.", "upstream");
  }

  const payload = raw as Record<string, unknown>;
  if (payload.errors) {
    const message = String(payload.errors);
    if (/no auth header/i.test(message)) {
      throw new ArsenalFetchError(
        "This account has not enabled loadout sharing. In Warframe account settings, turn on “Share Loadout Information with the Warframe Arsenal Twitch Extension”.",
        "not_shared",
      );
    }
    throw new ArsenalFetchError(message, "upstream");
  }

  if (!payload.loadOuts || !payload.accountInfo) {
    throw new ArsenalFetchError("No loadout data returned for this account.", "not_found");
  }

  let arsenal;
  let mapped;
  try {
    arsenal = buildArsenalData(payload);
    mapped = mapArsenalToImportPayload(arsenal, { loadOuts: payload.loadOuts as never });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "parse failed";
    console.error("[warframe/arsenal] Failed to parse loadout for", normalized, detail);
    throw new ArsenalFetchError(
      "Loadout data was retrieved but could not be parsed. The account may have an unsupported slot configuration — try again after a deploy update.",
      "upstream",
    );
  }

  if (!loadoutHasImportableContent(mapped.loadout)) {
    throw new ArsenalFetchError(
      "Loadout data was retrieved but could not be mapped to Voidforge items.",
      "not_found",
    );
  }

  return mapped;
}
