"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Discord-friendly share snippet + copy URL for community builds. */
export function BuildShareCard({
  buildName,
  author,
  type,
  itemName,
  description,
  pageUrl,
  className,
}: {
  buildName: string;
  author: string;
  type: string;
  itemName: string;
  description?: string;
  pageUrl: string;
  className?: string;
}) {
  const [copied, setCopied] = useState<"url" | "discord" | null>(null);

  const discordText = [
    `**${buildName}** — ${itemName} (${type})`,
    `by ${author} on Voidforge`,
    description?.trim() ? `> ${description.trim().slice(0, 180)}` : null,
    pageUrl,
  ]
    .filter(Boolean)
    .join("\n");

  const copy = async (mode: "url" | "discord") => {
    const text = mode === "url" ? pageUrl : discordText;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(mode);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3",
        className,
      )}
    >
      <div className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
        Share this build
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Copy a link for Discord embeds (Open Graph card) or a ready-to-paste text blurb.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => copy("url")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
        >
          {copied === "url" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Link2 className="h-3.5 w-3.5" />}
          {copied === "url" ? "Copied link" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={() => copy("discord")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors"
        >
          {copied === "discord" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied === "discord" ? "Copied Discord text" : "Copy Discord text"}
        </button>
      </div>
      <pre className="text-[10px] text-muted-foreground/80 bg-background/60 rounded-lg border border-border/50 p-2 overflow-x-auto whitespace-pre-wrap">
        {discordText}
      </pre>
    </div>
  );
}
