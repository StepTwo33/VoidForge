import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Share Builds | Voidforge").
export const metadata: Metadata = { title: "Share Builds" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
