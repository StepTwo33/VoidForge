import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Modular Builder | Voidforge").
export const metadata: Metadata = { title: "Modular Builder" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
