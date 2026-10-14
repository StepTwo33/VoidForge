import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Weapon Builder | Voidforge").
export const metadata: Metadata = { title: "Weapon Builder" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
