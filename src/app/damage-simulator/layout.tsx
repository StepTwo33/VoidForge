import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

// Metadata only: gives this client page its own title, description, canonical URL and OG tags.
export const metadata: Metadata = pageMetadata({
  path: "/damage-simulator",
  title: "Damage Simulator",
  description:
    "Simulate weapon damage against Warframe enemies with level scaling, armor, shields, faction and elemental modifiers.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
