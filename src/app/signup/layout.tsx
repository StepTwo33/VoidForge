import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Create Account | Voidforge").
export const metadata: Metadata = { title: "Create Account" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
