"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageShell, PageMain, PageHero, ContentPanel } from "@/components/page-shell";
import { Heart, ExternalLink, Mail } from "lucide-react";
import { BUY_ME_A_COFFEE_URL } from "@/lib/site/support";

interface SupportAccount {
  email: string | null;
  emailVerified: boolean;
  username: string | null;
}

export default function SupportPage() {
  const [account, setAccount] = useState<SupportAccount | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) return null;
        return fetch("/api/auth/profile");
      })
      .then((res) => {
        if (!res?.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setAccount({
            email: data.user.email ?? null,
            emailVerified: Boolean(data.user.emailVerified),
            username: data.user.username ?? null,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PageShell>
      <PageMain maxWidth="md">
        <PageHero
          icon={Heart}
          accent="rose"
          title="Support"
          highlight="Voidforge"
          description="Voidforge is free and open source. Tips are optional — a few dollars helps keep hosting and updates going."
        />

        <ContentPanel className="p-6 sm:p-8">
          <div className="text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              No paywall, no premium tier. Suggested tips are around $3–5 (or a monthly membership on Buy Me a Coffee
              if you use the site a lot). Any amount helps.
            </p>

            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#FFDD00] px-6 text-base font-semibold text-[#0D0C22] shadow-sm transition-opacity hover:opacity-90"
            >
              <Heart className="h-4 w-4" aria-hidden />
              Buy me a coffee
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              Opens{" "}
              <a
                href={BUY_ME_A_COFFEE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                buymeacoffee.com/StepTwo
              </a>
            </p>
          </div>

          {account?.email && (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm">
              <p className="flex items-center justify-center gap-2 font-medium text-rose-800 dark:text-rose-200">
                <Mail className="h-4 w-4 shrink-0" />
                Want the Supporter badge?
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground leading-relaxed">
                Tip with this email so we can match your account
                {!account.emailVerified ? " (verify it in Settings first)" : ""}:
              </p>
              <p className="mt-2 break-all text-center font-mono text-sm text-foreground">{account.email}</p>
              {account.username && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Badge shows on{" "}
                  <Link href={`/u/${account.username}`} className="break-all text-primary underline-offset-2 hover:underline">
                    /u/{account.username}
                  </Link>
                </p>
              )}
            </div>
          )}

          {!account && (
            <p className="mx-auto mt-6 max-w-md text-center text-xs text-muted-foreground leading-relaxed">
              Tips work without an account.{" "}
              <Link href="/signin" className="text-primary underline-offset-2 hover:underline">
                Sign in
              </Link>{" "}
              and use the same email when tipping if you want a cosmetic Supporter badge on your profile.
            </p>
          )}

          <details className="mx-auto mt-8 max-w-xs text-center">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Or scan a QR code
            </summary>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block transition-opacity hover:opacity-90"
            >
              <Image
                src="/images/support/buymeacoffee-qr.png"
                alt="Buy Me a Coffee QR code — scan to tip StepTwo"
                width={240}
                height={240}
                className="mx-auto h-auto max-w-full rounded-xl border border-border bg-white p-3 shadow-sm"
              />
            </a>
          </details>

          <p className="mt-8 text-center text-xs text-muted-foreground/80 leading-relaxed">
            Donations are voluntary gifts, not purchases. The Supporter badge is cosmetic only — it does not unlock
            features. If you tip with a different email, ask via{" "}
            <Link href="/report-issue" className="text-primary underline-offset-2 hover:underline">
              Report Issue
            </Link>
            . See our{" "}
            <Link href="/terms" className="text-primary underline-offset-2 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </ContentPanel>
      </PageMain>
    </PageShell>
  );
}
