import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Privacy Policy | Voidforge").
export const metadata: Metadata = { title: "Privacy Policy" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
