"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Download, Copy, ExternalLink, RefreshCw, Trash2, Edit3, Check } from "lucide-react";
import { PolarityIcon } from "@/components/polarity-icon";
import { type SavedRiven } from "@/lib/rivens/riven-storage";
import { renderRivenCardToCanvas, downloadCanvasAsPng, copyCanvasToClipboard } from "@/lib/rivens/riven-canvas";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RivenCardProps {
  riven: SavedRiven;
  onDelete?: (id: string) => void;
  onEdit?: (riven: SavedRiven) => void;
  onReroll?: (riven: SavedRiven) => void;
}

export function RivenCard({ riven, onDelete, onEdit, onReroll }: RivenCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    try {
      await renderRivenCardToCanvas(canvasRef.current, riven, 2);
      downloadCanvasAsPng(canvasRef.current, `${riven.name}_thumbnail`);
      toast.success("Riven thumbnail downloaded!");
    } catch {
      toast.error("Failed to generate thumbnail");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      await renderRivenCardToCanvas(canvasRef.current, riven, 2);
      const ok = await copyCanvasToClipboard(canvasRef.current);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Riven card image copied to clipboard!");
      } else {
        toast.error("Clipboard copy not supported in this browser");
      }
    } catch {
      toast.error("Failed to copy image");
    }
  };

  const parts = riven.name.split(" ");
  const rollSuffix = parts.slice(1).join(" ") || "Riven";

  // URL to equip in weapon builder
  const equipUrl = `/weapon-builder?weapon=${riven.weaponId}&riven=${encodeURIComponent(
    JSON.stringify(riven.stats),
  )}`;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-purple-500/40 bg-gradient-to-b from-[#180b2f] via-[#240f43] to-[#120722] p-4 text-purple-100 shadow-[0_4px_24px_rgba(147,51,234,0.18)] transition-all duration-200 hover:-translate-y-1 hover:border-purple-400 hover:shadow-[0_8px_32px_rgba(168,85,247,0.32)]">
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Ornate Card Header */}
      <div>
        <div className="flex items-center justify-between gap-1 border-b border-purple-500/20 pb-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-200">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-900/60 text-[11px] text-purple-300">
              18
            </span>
            <PolarityIcon polarity={riven.polarity} size={15} />
          </div>

          {riven.grade && (
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide"
              style={{
                borderColor: (riven.gradeColor || "#c084fc") + "80",
                backgroundColor: (riven.gradeColor || "#c084fc") + "18",
                color: riven.gradeColor || "#c084fc",
              }}
            >
              {riven.grade}
            </span>
          )}

          <div className="text-[11px] font-semibold text-purple-300/80">
            MR {riven.masteryRank || 8}
          </div>
        </div>

        {/* Thumbnail artwork & Title Banner */}
        <div className="relative my-3 overflow-hidden rounded-xl border border-purple-500/30 bg-[#0d041a]/70 p-3 text-center shadow-inner">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/15 via-transparent to-transparent" />
          <div className="text-[9px] font-bold uppercase tracking-widest text-purple-400/80">
            {riven.weaponType} Riven Mod
          </div>
          <h3 className="truncate text-base font-black tracking-wide text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {riven.weaponName}
          </h3>
          <p className="truncate text-xs font-bold uppercase tracking-wider text-purple-300">
            {rollSuffix}
          </p>
        </div>

        {/* Stats Block */}
        <div className="space-y-1.5 py-1 text-center font-sans">
          {riven.displayStats.map((s, idx) => {
            const sign = s.value >= 0 ? "+" : "";
            const formattedVal = s.isPercent
              ? `${sign}${(s.value * 100).toFixed(1)}%`
              : `${sign}${s.value.toFixed(1)}`;

            return (
              <div
                key={idx}
                className={cn(
                  "text-xs font-bold leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
                  s.isCurse
                    ? "text-red-400"
                    : s.spliced
                    ? "text-teal-300"
                    : "text-cyan-300",
                )}
              >
                {formattedVal} {s.label}
                {s.spliced && (
                  <span className="ml-1 text-[9px] uppercase tracking-wider text-teal-400/80">
                    [Spliced]
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer: Details & Quick Actions */}
      <div className="mt-4 border-t border-purple-500/20 pt-3">
        <div className="mb-2.5 flex items-center justify-between text-[11px] text-purple-300/70">
          <span className="flex items-center gap-1 font-medium">
            <RefreshCw className="h-3 w-3 text-purple-400" />
            {riven.rerolls || 0} Cycles
          </span>

          {/* 8 Rank Pips */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block h-1.5 w-1.5 rotate-45 rounded-[1px] transition-colors",
                  i < (riven.rank ?? 8) ? "bg-cyan-400 shadow-[0_0_4px_#38bdf8]" : "bg-purple-900/60",
                )}
              />
            ))}
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="grid grid-cols-4 gap-1 pt-1 text-xs">
          <Link
            href={equipUrl}
            title="Equip in Weapon Builder"
            className="flex h-8 items-center justify-center rounded-lg bg-purple-600/30 text-purple-200 transition-colors hover:bg-purple-600 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            title="Download Riven Thumbnail (.png)"
            className="flex h-8 items-center justify-center rounded-lg bg-purple-950/60 text-purple-300 transition-colors hover:bg-purple-800 hover:text-white disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            title="Copy Riven Card Image to Clipboard"
            className="flex h-8 items-center justify-center rounded-lg bg-purple-950/60 text-purple-300 transition-colors hover:bg-purple-800 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          {onReroll && (
            <button
              type="button"
              onClick={() => onReroll(riven)}
              title="Reroll Stats"
              className="flex h-8 items-center justify-center rounded-lg bg-purple-950/60 text-purple-300 transition-colors hover:bg-purple-800 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}

          {onDelete && !onReroll && (
            <button
              type="button"
              onClick={() => onDelete(riven.id)}
              title="Delete Riven"
              className="flex h-8 items-center justify-center rounded-lg bg-red-950/40 text-red-400 transition-colors hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {onEdit && onDelete && onReroll && (
          <div className="mt-1 flex items-center justify-between px-1 pt-1 text-[11px]">
            <button
              type="button"
              onClick={() => onEdit(riven)}
              className="text-purple-400 transition-colors hover:text-purple-200"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(riven.id)}
              className="text-red-400/80 transition-colors hover:text-red-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
