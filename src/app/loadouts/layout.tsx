import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/loadouts",
  title: "Loadouts",
  description:
    "Assemble full Warframe kits (Warframe, primary, secondary, melee and companion) and see the combined stats.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
