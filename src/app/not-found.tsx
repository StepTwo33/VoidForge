import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageMain, ContentPanel } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const linkBase =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const LINKS = [
  { href: "/discover", label: "Discover builds" },
  { href: "/weapon-builder", label: "Weapon Builder" },
  { href: "/warframe-builder", label: "Warframe Builder" },
] as const;

/** Root 404: keeps the site header (PageShell) and offers ways back. Presentational only. */
export default function NotFound() {
  return (
    <PageShell>
      <PageMain maxWidth="sm">
        <ContentPanel className="mx-auto max-w-xl space-y-4 p-6 text-center sm:p-8">
          <p className="text-5xl font-bold tracking-tight text-primary" aria-hidden>
            404
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">Page not found</h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            That page doesn&apos;t exist or was moved. If you followed a shared build or profile link, it may have been
            deleted or made private.
          </p>
          <nav aria-label="Helpful links" className="flex flex-wrap justify-center gap-2.5 pt-2 sm:gap-3">
            <Link href="/" className={`${linkBase} bg-primary text-primary-foreground hover:bg-primary/90`}>
              Home
            </Link>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`${linkBase} border border-border hover:bg-muted`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </ContentPanel>
      </PageMain>
    </PageShell>
  );
}
