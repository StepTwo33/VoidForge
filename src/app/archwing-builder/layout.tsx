import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/archwing-builder",
  title: "Archwing & Necramech Builder",
  description:
    "Mod Archwings, Necramechs, archguns and archmelee with rank-30 stats, capacity tracking and live stat previews.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
