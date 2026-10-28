import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/riven-calculator",
  title: "Riven Grader",
  description:
    "Grade Warframe riven rolls against the standard stat ranges and see how good each stat is.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
