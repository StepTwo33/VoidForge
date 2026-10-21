import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/warframe-builder",
  title: "Warframe Builder",
  description:
    "Mod your Warframe with archon shards, Helminth abilities and arcanes, and see ability stats, effective health and damage reduction.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
