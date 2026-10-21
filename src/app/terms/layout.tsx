import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/terms",
  title: "Terms of Service",
  description:
    "The terms for using Voidforge.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
