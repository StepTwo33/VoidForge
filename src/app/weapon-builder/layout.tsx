import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/weapon-builder",
  title: "Weapon Builder",
  description:
    "Mod any Warframe weapon with arcanes, rivens and Incarnon evolutions, and see real-time DPS, crit and status numbers.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
