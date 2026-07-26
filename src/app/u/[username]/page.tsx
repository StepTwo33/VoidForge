import { notFound } from "next/navigation";
import { AvatarImage } from "@/components/game-asset-image";
import { PageShell, PageMain, ContentPanel } from "@/components/page-shell";
import { prisma } from "@/lib/prisma";
import { SupporterBadge } from "@/components/supporter-badge";
import { RoleBadge } from "@/components/role-badge";
import { isSupporter } from "@/lib/auth/supporter";
import { PublicProfileBuilds } from "@/components/public-profile-builds";

export const dynamic = "force-dynamic";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const normalized = username.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { username: normalized },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      role: true,
      supporterAt: true,
      bannedAt: true,
      createdAt: true,
      _count: { select: { builds: true } },
    },
  });

  if (!user || user.bannedAt) notFound();

  const publicBuilds = await prisma.build.findMany({
    where: { userId: user.id, isPublic: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      type: true,
      upvoteCount: true,
      updatedAt: true,
    },
    take: 50,
  });

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <ContentPanel className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {user.image ? (
              <AvatarImage src={user.image} alt="" size={80} className="w-20 h-20 rounded-full border-2 border-border object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                <span className="text-3xl font-bold text-muted-foreground">
                  {(user.name ?? user.username ?? "?").charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold">{user.name ?? user.username ?? "Tenno"}</h1>
                {user.role === "admin" && <RoleBadge role="admin" />}
                {user.role === "moderator" && <RoleBadge role="moderator" />}
                {isSupporter(user) && <SupporterBadge />}
              </div>
              {user.username && <p className="text-primary text-sm mt-1">@{user.username}</p>}
              {user.bio ? (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{user.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground/80 mt-3">No bio yet.</p>
              )}
            </div>

            <div className="text-center shrink-0">
              <div className="text-2xl font-bold">{publicBuilds.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Public Builds</div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border text-xs text-muted-foreground">
            <span>Joined {joined}</span>
          </div>
        </ContentPanel>

        <div className="mt-8">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground mb-4">
            COMMUNITY BUILDS
          </h2>
          <PublicProfileBuilds
            builds={publicBuilds.map((b) => ({
              id: b.id,
              name: b.name,
              description: b.description,
              type: b.type,
              upvoteCount: b.upvoteCount,
              updatedAt: b.updatedAt.toISOString(),
            }))}
          />
        </div>
      </PageMain>
    </PageShell>
  );
}
