import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site/site-metadata";

/** RFC 9116 security contact file — clears Cloudflare “Security.txt not configured”. */
export async function GET() {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);

  const body = [
    "Contact: mailto:support@void-forge.org",
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: en",
    `Canonical: ${siteUrl}/.well-known/security.txt`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
