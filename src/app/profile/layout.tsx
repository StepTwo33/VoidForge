import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Profile | Voidforge").
export const metadata: Metadata = { title: "Profile" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
