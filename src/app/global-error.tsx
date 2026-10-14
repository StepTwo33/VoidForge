"use client";

import { useEffect } from "react";
import "./globals.css";

const MODE_KEY = "framehub_mode";

function resolveDark(): boolean {
  try {
    const m = localStorage.getItem(MODE_KEY);
    if (m === "dark") return true;
    if (m === "light") return false;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}

/** Last-resort boundary for errors in the root layout. Renders its own <html>/<body>; no header available. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error", error);
  }, [error]);

  // Follow the user's saved mode (same key as layout.tsx / theme-picker.tsx), falling back to
  // the OS preference. Starts dark (className below) and switches after hydration; no inline script, so CSP is untouched.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolveDark());
  }, []);

  const btn =
    "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors";
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground antialiased">
        <main className="w-full max-w-md space-y-4 rounded-xl border border-border/60 bg-card p-6 text-center sm:p-8">
          <p className="text-lg font-bold text-primary">Voidforge</p>
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The site hit an unexpected error. Your saved builds are safe. Try again or go back home.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button type="button" onClick={() => reset()} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              Try again
            </button>
            {/* Plain anchor: the app router may be unusable here, so do a full navigation. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className={`${btn} border border-border hover:bg-muted`}>
              Home
            </a>
          </div>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ref: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
