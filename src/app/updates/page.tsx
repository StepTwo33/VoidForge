import Link from "next/link";
import { PageShell, PageMain, PageHero, ContentPanel } from "@/components/page-shell";
import { fetchPublishedSiteUpdates } from "@/lib/site/site-updates-server";
import { formatSiteUpdateTime } from "@/lib/site/site-updates";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "What's New - Voidforge",
  description: "Updates and announcements from the Voidforge team.",
};

export default async function UpdatesPage() {
  const updates = await fetchPublishedSiteUpdates(50);

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          title="What's"
          highlight="New"
          description="Updates and announcements from the Voidforge team."
          iconName="megaphone"
          accent="amber"
        />

        {updates.length === 0 ? (
          <ContentPanel className="text-center py-12">
            <p className="text-sm text-muted-foreground">No updates posted yet. Check back soon.</p>
          </ContentPanel>
        ) : (
          <ul className="space-y-4">
            {updates.map((update) => (
              <li key={update.id}>
                <Link href={`/updates/${update.id}`} className="group block">
                  <ContentPanel
                    className={cn(
                      "transition-colors hover:border-primary/40 hover:bg-card/80",
                      update.featured && "border-amber-500/40 bg-amber-500/5",
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <time className="text-xs text-muted-foreground">
                        {formatSiteUpdateTime(update.createdAt)}
                      </time>
                      {update.featured && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {update.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {update.body}
                    </p>
                    <span className="mt-3 inline-block text-xs font-medium text-primary">
                      Read full update
                    </span>
                  </ContentPanel>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PageMain>
    </PageShell>
  );
}
