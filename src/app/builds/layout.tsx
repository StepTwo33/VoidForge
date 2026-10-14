import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Your Builds | Voidforge").
export const metadata: Metadata = { title: "Your Builds" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
