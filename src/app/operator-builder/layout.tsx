import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/operator-builder",
  title: "Operator Builder",
  description:
    "Build and configure Operator Focus Schools, Amps, and Operator and Amp Arcanes.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
