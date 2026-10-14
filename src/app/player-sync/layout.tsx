import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Player Sync | Voidforge").
export const metadata: Metadata = { title: "Player Sync" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
