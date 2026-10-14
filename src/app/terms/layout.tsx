import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Terms of Service | Voidforge").
export const metadata: Metadata = { title: "Terms of Service" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
