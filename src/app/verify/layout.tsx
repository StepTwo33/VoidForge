import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Verify Email | Voidforge").
export const metadata: Metadata = { title: "Verify Email" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
