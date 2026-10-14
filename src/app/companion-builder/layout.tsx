import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Companion Builder | Voidforge").
export const metadata: Metadata = { title: "Companion Builder" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
