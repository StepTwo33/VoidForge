import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Report Issue | Voidforge").
export const metadata: Metadata = { title: "Report Issue" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
