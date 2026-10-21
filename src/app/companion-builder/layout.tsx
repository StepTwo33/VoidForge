import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/companion-builder",
  title: "Companion Builder",
  description:
    "Build sentinels, Kubrows, Kavats, MOAs and Hounds with companion mods, precepts and weapon stats.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
