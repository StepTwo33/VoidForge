import type { NextConfig } from "next";

if (process.env.FRAMEHUB_MAINTAINER !== "1") {
  throw new Error(
    [
      "Frame Hub is not intended for self-hosting.",
      "Use the planner at https://frame-hub.com",
      "To verify calculations and item catalogs: npm test",
      "Maintainers: set FRAMEHUB_MAINTAINER=1 to run the Next app.",
    ].join("\n"),
  );
}

/** HSTS is best enabled at Cloudflare (or your TLS terminator) so local HTTP dev is unaffected. */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
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
