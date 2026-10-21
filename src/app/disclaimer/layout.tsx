import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/disclaimer",
  title: "Disclaimer",
  description:
    "Voidforge is a fan-made tool and is not affiliated with Digital Extremes. How the data and calculations should be used.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
