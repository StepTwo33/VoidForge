import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";
import { ArsenalFetchError, fetchAndMapWarframeArsenal } from "@/lib/warframe-arsenal/fetch";
import type { WarframePlatform } from "@/lib/warframe-arsenal/platforms";

export const dynamic = "force-dynamic";

const PLATFORMS = new Set<WarframePlatform>(["pc", "ps4", "xb1", "swi"]);

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`arsenal:${ip}`, 30, 5 * 60 * 1000);
  if (rl.limited) {
    return NextResponse.json(
      { error: "Too many arsenal lookups. Please try again in a few minutes.", code: "rate_limited" },
      { status: 429 },
    );
  }

  const platform = (request.nextUrl.searchParams.get("platform") || "pc").toLowerCase();
  const account = request.nextUrl.searchParams.get("account")?.trim() ?? "";

  if (!PLATFORMS.has(platform as WarframePlatform)) {
    return NextResponse.json({ error: "Invalid platform.", code: "invalid_request" }, { status: 400 });
  }
  if (!account) {
    return NextResponse.json({ error: "Account name is required.", code: "invalid_request" }, { status: 400 });
  }

  try {
    const data = await fetchAndMapWarframeArsenal(platform as WarframePlatform, account);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (err) {
    if (err instanceof ArsenalFetchError) {
      const status =
        err.code === "invalid_request" ? 400 :
        err.code === "not_shared" ? 403 :
        err.code === "not_found" ? 404 : 502;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    return NextResponse.json({ error: "Failed to retrieve loadout.", code: "upstream" }, { status: 502 });
  }
}
