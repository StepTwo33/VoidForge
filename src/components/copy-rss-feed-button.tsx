"use client";

import { useCallback, useState } from "react";
import { Check, Rss } from "lucide-react";
import { cn } from "@/lib/utils";
import { copyTextToClipboard } from "@/lib/display/clipboard";
import { getSiteUrl } from "@/lib/site/site-metadata";

type CopyRssFeedButtonProps = {
  /** Path starting with `/`, e.g. `/feeds/updates.xml`. */
  feedPath: string;
  label?: string;
  title?: string;
  className?: string;
};

export function CopyRssFeedButton({
  feedPath,
  label = "RSS",
  title = "Copy RSS feed link",
  className,
}: CopyRssFeedButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    const url = `${getSiteUrl()}${feedPath.startsWith("/") ? feedPath : `/${feedPath}`}`;
    const ok = await copyTextToClipboard(url);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [feedPath]);

  return (
    <button
      type="button"
      onClick={onCopy}
      title={copied ? "Copied feed link" : title}
      className={cn(
        "inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground hover:underline",
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Rss className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}
