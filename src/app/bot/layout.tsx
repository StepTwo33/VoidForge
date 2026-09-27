import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { verifyAdmin } from "@/lib/auth/admin";
import { getSession } from "@/lib/auth/auth";
import { PageShell, PageMain } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default async function BotLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = await verifyAdmin();
  if (isAdmin) return <>{children}</>;

  const session = await getSession();
  const signedIn = Boolean(session?.user?.id);

  return (
    <PageShell>
      <PageMain maxWidth="sm" className="py-16 sm:py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
            <ShieldAlert className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">You shouldn&apos;t be here</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The Discord bot pages are only available to Voidforge staff right now while we finish building
            and testing them. If you followed an old link, head back home — nothing to configure here yet.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/">Back to home</Link>
            </Button>
            {!signedIn && (
              <Button asChild variant="outline">
                <Link href="/signin?callbackUrl=/bot">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </PageMain>
    </PageShell>
  );
}
