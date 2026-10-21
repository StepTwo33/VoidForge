import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/compare",
  title: "Compare",
  description:
    "Compare two Warframe weapon builds or full loadouts side by side: DPS, crit, status and survivability.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
