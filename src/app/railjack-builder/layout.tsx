import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/railjack-builder",
  title: "Railjack Builder",
  description:
    "Configure Railjack components, armaments, ordnance, crew and Plexus mods, with hull, shield and speed stats.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
