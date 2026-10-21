import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "How Voidforge collects, uses and protects your data.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
