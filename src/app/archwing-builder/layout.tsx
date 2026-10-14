import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Archwing & Necramech Builder | Voidforge").
export const metadata: Metadata = { title: "Archwing & Necramech Builder" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
