import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/discover",
  title: "Discover Builds",
  description:
    "Browse community Warframe builds by category: weapons, Warframes, companions, modular weapons, Archwing, Railjack and full loadouts.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
