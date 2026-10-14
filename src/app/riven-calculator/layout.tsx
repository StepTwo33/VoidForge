import type { Metadata } from "next";

// Metadata only: gives this client page its own tab title ("Riven Grader | Voidforge").
export const metadata: Metadata = { title: "Riven Grader" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
