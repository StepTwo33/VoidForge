import type { NextRequest } from "next/server";

function trimSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

/**
 * Canonical public origin for auth redirects and cookie `Secure`.
 *
 * Prefer `AUTH_URL` or `NEXT_PUBLIC_APP_URL` in production so redirects and
 * session cookies are not derived from client-controlled `Host` / `X-Forwarded-*`.
 *
 * Optional `TRUSTED_HOSTS` (comma-separated hostnames, no scheme): when set,
 * forwarded host must match one of them or we fall back to `nextUrl.origin`.
 *
 * Production: set `AUTH_URL` to your public origin (e.g. https://void-forge.org).
 */
export function getPublicOrigin(req: NextRequest): string {
  const auth = process.env.AUTH_URL?.trim();
  if (auth) return trimSlash(auth);

  const pub = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (pub) return trimSlash(pub);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return trimSlash(`https://${vercel}`);

  const trustedRaw = process.env.TRUSTED_HOSTS?.trim();
  const trusted = trustedRaw
    ? trustedRaw
        .split(",")
        .map((h) => h.trim().toLowerCase().split(":")[0])
        .filter(Boolean)
    : [];

  const protoHdr = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "";
  const hostHdr =
    (req.headers.get("x-forwarded-host") || req.headers.get("host") || "")
      .split(",")[0]
      ?.trim()
      .toLowerCase() || "";
  const hostNoPort = hostHdr.split(":")[0];

  if (trusted.length > 0) {
    if (!hostNoPort || !trusted.includes(hostNoPort)) {
      return trimSlash(req.nextUrl.origin);
    }
  }

  if (protoHdr && hostHdr) {
    const proto = protoHdr === "http" || protoHdr === "https" ? protoHdr : "https";
    return `${proto}://${hostHdr}`;
  }

  return trimSlash(req.nextUrl.origin);
}
