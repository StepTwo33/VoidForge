import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Support | Voidforge").
export const metadata: Metadata = { title: "Support" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
