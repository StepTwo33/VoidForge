import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isDeniedPath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  // Segment-based so we do not match benign paths like `/docs/.gitignore` or `/.environment`.
  const badSegment = (seg: string) => {
    if (!seg) return false;
    if (seg === ".git" || seg === ".svn" || seg === ".aws") return true;
    if (seg === ".env" || seg.startsWith(".env.")) return true;
    return false;
  };
  if (p.split("/").some(badSegment)) return true;
  if (p.startsWith("/wp-admin") || p.startsWith("/wp-login") || p.startsWith("/wp-includes") || p.startsWith("/wp-content")) return true;
  if (p.startsWith("/xmlrpc.php")) return true;
  if (p.startsWith("/phpmyadmin") || p.startsWith("/pma/")) return true;
  if (p.startsWith("/adminer")) return true;
  if (p.startsWith("/vendor/phpunit")) return true;
  if (p.startsWith("/actuator/")) return true;
  if (p === "/server-status" || p.startsWith("/server-status/")) return true;
  return false;
}

/**
 * Build a nonce-based Content-Security-Policy.
 *
 * - `script-src` uses a per-request nonce (Next injects it into its own inline
 *   bootstrap scripts) instead of `'unsafe-inline'`, so injected inline scripts
 *   are blocked. `'wasm-unsafe-eval'` + `blob:` + the tesseract.js CDN hosts keep
 *   the client-side OCR importer working.
 * - `style-src` keeps `'unsafe-inline'` because Next/Tailwind/Radix inject styles.
 * - `img-src` allows Google avatar hosts (also listed in next.config remotePatterns).
 */
function buildCsp(nonce: string, isProd: boolean): string {
  const directives = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'self'`,
    `form-action 'self'`,
    `img-src 'self' data: blob: https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com`,
    `font-src 'self' data:`,
    `style-src 'self' 'unsafe-inline'`,
    `script-src 'self' 'nonce-${nonce}' 'wasm-unsafe-eval' blob: https://cdn.jsdelivr.net https://unpkg.com`,
    `worker-src 'self' blob:`,
    `connect-src 'self' blob: data: https://cdn.jsdelivr.net https://unpkg.com https://tessdata.projectnaptha.com`,
    `manifest-src 'self'`,
  ];
  if (isProd) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

const LEGACY_HOSTS = new Set(["frame-hub.com", "www.frame-hub.com"]);
const CANONICAL_ORIGIN = "https://void-forge.org";

/** Next.js 16+ convention (replaces `middleware`). Host redirect + exploit 404s + CSP. */
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0]?.toLowerCase() ?? "";
  if (LEGACY_HOSTS.has(host)) {
    const url = new URL(request.url);
    return NextResponse.redirect(
      `${CANONICAL_ORIGIN}${url.pathname}${url.search}`,
      301,
    );
  }

  if (isDeniedPath(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const csp = buildCsp(nonce, process.env.NODE_ENV === "production");

  // Forward the nonce (and CSP) on the request so Next can nonce its own inline scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icons/|api/|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|html|js|css|woff2?)$).*)",
  ],
};
