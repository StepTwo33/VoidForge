import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Damage Simulator | Voidforge").
export const metadata: Metadata = { title: "Damage Simulator" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
