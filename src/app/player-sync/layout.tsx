import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/player-sync",
  title: "Player Sync",
  description:
    "Import your Warframe profile to see which items, mods and arcanes you own while you plan builds.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
