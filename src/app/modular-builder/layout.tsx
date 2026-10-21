import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/modular-builder",
  title: "Modular Builder",
  description:
    "Assemble Kitguns, Zaws and Amps from their parts and mod them with live stat previews.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
