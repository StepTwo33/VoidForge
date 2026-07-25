import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageShell, ContentPanel } from "@/components/page-shell";
import { BuildPreviewSummary } from "@/components/build-preview-summary";
import { BuildPreviewStats } from "@/components/build-preview-stats";
import { buildOpenUrl } from "@/lib/builds/build-url";
import { summarizeBuildPreview } from "@/lib/builds/build-preview";
import { BuildPageVote } from "@/components/build-page-vote";
import { BuildShareCard } from "@/components/build-share-card";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/auth";
import { safeParseBuildJson } from "@/lib/builds/build-types";
import { getSiteUrl } from "@/lib/site/site-metadata";
import { AvatarImage } from "@/components/game-asset-image";

interface SharedBuild {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  type: string;
  upvoteCount: number;
  data: unknown;
  createdAt: number;
  updatedAt: number;
  author: {
    username: string;
    profileSlug?: string | null;
    image?: string;
  };
}

/** Read the build straight from the DB — no self-fetch, so no reliance on client-controlled Host headers. */
async function getBuild(id: string): Promise<SharedBuild | null> {
  const build = await prisma.build.findUnique({
    where: { id },
    include: { user: { select: { username: true, name: true, image: true } } },
  });
  if (!build) return null;

  if (!build.isPublic) {
    const session = await getSession();
    if (session?.user?.id !== build.userId) return null;
  }

  const parsed = safeParseBuildJson(build.data);
  if (parsed === null) return null;

  return {
    id: build.id,
    name: build.name,
    description: build.description,
    isPublic: build.isPublic,
    type: build.type,
    upvoteCount: build.upvoteCount,
    data: parsed,
    createdAt: build.createdAt.getTime(),
    updatedAt: build.updatedAt.getTime(),
    author: {
      username: build.user.username || build.user.name || "Anonymous",
      profileSlug: build.user.username,
      image: build.user.image ?? undefined,
    },
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const build = await getBuild(id);

  if (!build) return { title: "Build Not Found - Frame Hub" };

  const preview = summarizeBuildPreview(build.type, build.data);
  const desc =
    build.description?.trim() ||
    `${preview.itemName} ${build.type} build by ${build.author.username}` +
      (preview.modSummary ? ` · ${preview.modSummary}` : "");
  const title = `${build.name} — ${preview.itemName} | Frame Hub`;

  return {
    title,
    description: desc.slice(0, 200),
    openGraph: {
      title,
      description: desc.slice(0, 200),
      type: "article",
      siteName: "Frame Hub",
      images: [{ url: "/og-embed.png", width: 1200, height: 630, alt: "Frame Hub" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc.slice(0, 200),
      images: ["/og-embed.png"],
    },
  };
}

export default async function SharedBuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const build = await getBuild(id);

  if (!build) {
    notFound();
  }

  const builderUrl = buildOpenUrl(build.type, build.id);
  const preview = summarizeBuildPreview(build.type, build.data);
  const profileSlug = build.author.profileSlug ?? build.author.username;
  const pageUrl = `${getSiteUrl()}/build/${build.id}`;

  return (
    <PageShell>
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <ContentPanel className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {build.type} build
                </span>
                <span className="text-xs text-muted-foreground">
                  Updated {new Date(build.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">{build.name}</h1>
              <div className="flex items-center gap-2">
                {build.author.image ? (
                  <AvatarImage
                    src={build.author.image}
                    alt={build.author.username}
                    size={20}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] text-primary">
                      {build.author.username[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                )}
                {profileSlug ? (
                  <Link
                    href={`/u/${profileSlug}`}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    by {build.author.username}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    by {build.author.username}
                  </span>
                )}
              </div>
            </div>

            <BuildPageVote
              buildId={build.id}
              initialUpvoteCount={build.upvoteCount ?? 0}
              isPublic={build.isPublic}
              builderUrl={builderUrl !== "#" ? builderUrl : undefined}
              openLabel={build.type === "loadout" ? "Open in Loadouts" : "Open in Builder"}
            />
          </div>

          <div className="w-full h-px bg-border mb-8" />

          <BuildPreviewSummary preview={preview} />

          <BuildPreviewStats type={build.type} data={build.data} />

          <div className="mt-6">
            <BuildShareCard
              buildName={build.name}
              author={build.author.username}
              type={build.type}
              itemName={preview.itemName}
              description={build.description}
              pageUrl={pageUrl}
            />
          </div>

          {build.description && (
            <>
              <div className="w-full h-px bg-border my-8" />
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Author notes
                </h2>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {build.description}
                </div>
              </section>
            </>
          )}
        </ContentPanel>
      </main>
    </PageShell>
  );
}
