import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Codex | Voidforge").
export const metadata: Metadata = { title: "Codex" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
