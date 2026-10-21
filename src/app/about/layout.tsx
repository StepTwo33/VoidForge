import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About",
  description:
    "What Voidforge is, how its Warframe build calculations work, and who maintains it.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
