import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/builds",
  title: "Your Builds",
  description:
    "Your saved Voidforge builds for weapons, Warframes, companions, Archwings, Railjack and loadouts.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
