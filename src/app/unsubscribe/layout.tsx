import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Unsubscribe | Voidforge").
export const metadata: Metadata = { title: "Unsubscribe" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
