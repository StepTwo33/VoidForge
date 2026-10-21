import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/import-export",
  title: "Share Builds",
  description:
    "Import and export Voidforge builds as share codes or files.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
