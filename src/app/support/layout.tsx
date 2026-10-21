import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/support",
  title: "Support",
  description:
    "Support Voidforge and help keep the Warframe build planner free.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
