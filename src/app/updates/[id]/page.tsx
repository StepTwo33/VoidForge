import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Megaphone } from "lucide-react";
import { PageShell, PageMain, ContentPanel } from "@/components/page-shell";
import { fetchPublishedSiteUpdate } from "@/lib/site/site-updates-server";
import { formatSiteUpdateTime } from "@/lib/site/site-updates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const update = await fetchPublishedSiteUpdate(id);
  if (!update) return { title: "Update Not Found - Voidforge" };

  const excerpt = update.body.slice(0, 160).replace(/\s+/g, " ").trim();
  return {
    title: `${update.title} - Voidforge`,
    description: excerpt || "Voidforge site update",
  };
}

export default async function SiteUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const update = await fetchPublishedSiteUpdate(id);
  if (!update) notFound();

  const posted = new Date(update.createdAt).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <Link
          href="/updates"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          All updates
        </Link>

        <article>
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-border/50">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-muted-foreground">{posted}</p>
                {update.featured && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground/80">
                {formatSiteUpdateTime(update.createdAt)} · @{update.author.username}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {update.title}
              </h1>
            </div>
          </div>

          <ContentPanel>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90 dark:prose-invert">
              {update.body}
            </div>
          </ContentPanel>
        </article>
      </PageMain>
    </PageShell>
  );
}
