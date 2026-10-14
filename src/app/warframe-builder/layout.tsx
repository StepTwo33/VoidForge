import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Warframe Builder | Voidforge").
export const metadata: Metadata = { title: "Warframe Builder" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
