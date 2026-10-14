import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Compare | Voidforge").
export const metadata: Metadata = { title: "Compare" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
