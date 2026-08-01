"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageShell, PageMain, PageHero, ContentPanel } from "@/components/page-shell";
import { Heart, LogIn, Mail } from "lucide-react";

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/StepTwo";

interface SupportAccount {
  email: string | null;
  emailVerified: boolean;
  username: string | null;
}

export default function SupportPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<SupportAccount | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          setLoggedIn(false);
          return;
        }
        setLoggedIn(true);
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
          description="Voidforge is free and open source. If you find it useful, you can chip in — any amount helps."
        />

        <ContentPanel className="p-6 sm:p-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            There is no paywall or premium tier. Donations are optional and go toward keeping the site online.
            Scan the QR code or use the link below — send whatever you feel is fair.
          </p>

          {!loggedIn ? (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
              <p className="flex items-center justify-center gap-2 font-medium">
                <LogIn className="h-4 w-4 shrink-0" />
                Sign in before you donate
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                We link supporter badges to your Voidforge account by matching your donation email.{" "}
                <Link href="/signin" className="text-primary hover:underline">Sign in</Link> first so we know which profile to credit.
              </p>
            </div>
          ) : account?.email ? (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm">
              <p className="flex items-center justify-center gap-2 font-medium text-rose-300">
                <Mail className="h-4 w-4 shrink-0" />
                Use this email when donating
              </p>
              <p className="mt-2 font-mono text-sm text-foreground">{account.email}</p>
              {!account.emailVerified && (
                <p className="mt-2 text-xs text-amber-400/90">
                  Verify your email in account settings before donating so your supporter badge can be applied automatically.
                </p>
              )}
              {account.username && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Your badge will appear on{" "}
                  <Link href={`/u/${account.username}`} className="text-primary hover:underline">
                    /u/{account.username}
                  </Link>
                </p>
              )}
            </div>
          ) : null}

          <div className="mx-auto mt-8 max-w-xs">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Buy Me a Coffee</h2>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-opacity hover:opacity-90"
            >
              <Image
                src="/images/support/buymeacoffee-qr.png"
                alt="Buy Me a Coffee QR code — scan to tip StepTwo"
                width={280}
                height={280}
                className="mx-auto rounded-xl border border-border bg-white p-3 shadow-sm"
                priority
              />
            </a>
            <a
              href={BUY_ME_A_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-primary hover:underline"
            >
              buymeacoffee.com/StepTwo
            </a>
          </div>

          <p className="mt-8 text-xs text-muted-foreground/80 leading-relaxed">
            Donations are voluntary gifts, not purchases. Verified donations through Buy Me a Coffee using the same
            email as your Voidforge account earn a cosmetic <strong className="font-medium text-foreground/80">Supporter</strong> badge
            on your public profile. The badge does not unlock features or special access.
            If you donate with a different email, contact us via{" "}
            <Link href="/report-issue" className="text-primary hover:underline">Report Issue</Link>{" "}
            or ask an admin to grant it manually.
            See our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
          </p>
        </ContentPanel>
      </PageMain>
    </PageShell>
  );
}
