import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/report-issue",
  title: "Report Issue",
  description:
    "Report a wrong stat, missing item or bug in Voidforge.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
