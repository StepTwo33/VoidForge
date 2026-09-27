import type { NextConfig } from "next";

const isMaintainer =
  process.env.FRAMEHUB_MAINTAINER === "1" || process.env.VOIDFORGE_MAINTAINER === "1";
if (!isMaintainer) {
  throw new Error(
    [
      "Voidforge is not intended for self-hosting.",
      "Use the planner at https://void-forge.org",
      "To verify calculations and item catalogs: npm test",
      "Maintainers: set FRAMEHUB_MAINTAINER=1 or VOIDFORGE_MAINTAINER=1 to run the Next app.",
    ].join("\n"),
  );
}

/** Security response headers. HSTS only in production so local HTTP `next dev` stays usable. */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          // 1 year; enable Always Use HTTPS + HSTS in Cloudflare too (edge covers HTTP→HTTPS).
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** WFCD packages are ESM + large; resolve from node_modules at runtime on the server. */
  serverExternalPackages: ["@wfcd/arsenal-parser", "@wfcd/items", "warframe-worldstate-data"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh4.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh6.googleusercontent.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Browsers otherwise may keep sw.js for up to 24h, delaying post-deploy updates.
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
