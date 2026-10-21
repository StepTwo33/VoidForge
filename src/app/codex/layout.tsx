import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/codex",
  title: "Codex",
  description:
    "Browse every Warframe mod, arcane, archon shard, weapon, Warframe, companion, Archwing and Necramech with drain, effects and stats.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
