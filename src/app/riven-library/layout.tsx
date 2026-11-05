import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/riven-library",
  title: "Riven Library",
  description:
    "Your personal Warframe Riven collection. Generate high-resolution card thumbnails, roll new stats, grade rolls, and equip directly in the Weapon Builder.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
