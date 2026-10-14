import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Sign In | Voidforge").
export const metadata: Metadata = { title: "Sign In" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
