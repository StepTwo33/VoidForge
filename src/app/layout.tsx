import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site/site-metadata";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OverridesProvider } from "@/components/overrides-provider";
import { Footer } from "@/components/footer";
import { ThemeAwareToaster } from "@/components/theme-aware-toaster";
import { ConfirmDialogProvider } from "@/components/confirm-dialog-provider";
import { PWARegister } from "@/components/pwa-register";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { DeployRefreshNotifier } from "@/components/deploy-refresh-notifier";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const defaultTitle = `${SITE_NAME} - ${SITE_TAGLINE}`;
/** Bump when replacing the social preview image so Discord/Twitter re-scrape. */
const OG_IMAGE_VERSION = "4";
const ogImageUrl = `/og-embed.png?v=${OG_IMAGE_VERSION}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Warframe",
    "build planner",
    "build calculator",
    "modding",
    "loadout",
    "DPS calculator",
    "warframe builder",
  ],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [ogImageUrl],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Voidforge",
  },
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feeds/updates.xml", title: `${SITE_NAME} What's New` },
        { url: "/feeds/builds-recent.xml", title: `${SITE_NAME} Latest Builds` },
        { url: "/feeds/builds.xml", title: `${SITE_NAME} Top Builds` },
      ],
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a1a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){var m=localStorage.getItem('framehub_mode')||'dark';if(m==='dark')document.documentElement.classList.add('dark');var t=localStorage.getItem('framehub_theme')||'tenno';if(t&&t!=='void')document.documentElement.classList.add('theme-'+t);})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <TooltipProvider>
          <ConfirmDialogProvider>
          <OverridesProvider>
          <ThemeAwareToaster />
          <PWARegister />
          <PWAInstallPrompt />
          <DeployRefreshNotifier />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          </OverridesProvider>
          </ConfirmDialogProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
