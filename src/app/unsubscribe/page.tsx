"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

function UnsubscribeInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        if (cancelled) return;
        setStatus(r.ok ? "ok" : "error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      {status === "loading" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Updating your email preferences…</p>
        </>
      )}
      {status === "ok" && (
        <>
          <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Unsubscribed</h1>
          <p className="text-sm text-muted-foreground mb-6">
            You will no longer receive Voidforge newsletters. Transactional emails (like report
            updates) are unaffected.
          </p>
          <Link href="/profile" className="text-sm text-primary hover:underline">
            Manage preferences in your profile
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Link invalid</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This unsubscribe link is invalid or expired. You can turn off newsletters anytime in
            profile settings while signed in.
          </p>
          <Link href="/profile" className="text-sm text-primary hover:underline">
            Go to profile settings
          </Link>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mx-auto" />
          </div>
        }
      >
        <UnsubscribeInner />
      </Suspense>
    </PageShell>
  );
}
