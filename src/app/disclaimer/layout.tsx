import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Disclaimer | Voidforge").
export const metadata: Metadata = { title: "Disclaimer" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
