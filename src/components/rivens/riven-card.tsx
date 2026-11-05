"use client";

import Link from "next/link";
import { ExternalLink, RefreshCw, Trash2, Edit3 } from "lucide-react";
import { PolarityIcon } from "@/components/polarity-icon";
import { GameAssetImage } from "@/components/game-asset-image";
import { getWeaponImage } from "@/lib/display/images";
import { type SavedRiven } from "@/lib/rivens/riven-storage";
import { cn } from "@/lib/utils";

interface RivenCardProps {
  riven: SavedRiven;
  onDelete?: (id: string) => void;
  onEdit?: (riven: SavedRiven) => void;
  onReroll?: (riven: SavedRiven) => void;
}

export function getRivenModArtImage(weaponType: string): string {
  const norm = (weaponType || "").toLowerCase();
  if (norm.includes("shotgun")) return "/images/mods/Shotgun_Riven_Mod.png";
  if (norm.includes("pistol")) return "/images/mods/Pistol_Riven_Mod.png";
  if (norm.includes("melee")) return "/images/mods/Melee_Riven_Mod.png";
  if (norm.includes("kitgun")) return "/images/mods/Kitgun_Riven_Mod.png";
  if (norm.includes("zaw")) return "/images/mods/Zaw_Riven_Mod.png";
  if (norm.includes("companion")) return "/images/mods/Companion_Weapon_Riven_Mod.png";
  if (norm.includes("archgun") || norm.includes("archwing")) return "/images/mods/Archgun_Riven_Mod.png";
  return "/images/mods/Rifle_Riven_Mod.png";
}

export function extractRivenAffix(fullName: string, weaponName: string): string {
  const cleanName = (fullName || "").trim();
  const cleanWeapon = (weaponName || "").trim();
  if (cleanName.toLowerCase().startsWith(cleanWeapon.toLowerCase())) {
    const remainder = cleanName.slice(cleanWeapon.length).trim();
    if (remainder) return remainder;
  }
  const parts = cleanName.split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : cleanName;
}

export function RivenCard({ riven, onDelete, onEdit, onReroll }: RivenCardProps) {
  const weaponName = riven.weaponName || "Weapon";
  const rollSuffix = extractRivenAffix(riven.name, weaponName) || "Riven";

  // URL to equip in weapon builder
  const equipUrl = `/weapon-builder?weapon=${riven.weaponId}&riven=${encodeURIComponent(
    JSON.stringify(riven.stats),
  )}`;

  const hasActions = Boolean(onReroll || onEdit || onDelete);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-purple-500/40 bg-gradient-to-b from-[#180b2f] via-[#110520] to-[#0a0214] p-3.5 text-purple-100 shadow-[0_4px_24px_rgba(147,51,234,0.18)] transition-all duration-200 hover:-translate-y-1 hover:border-purple-400 hover:shadow-[0_8px_32px_rgba(168,85,247,0.32)]">
      {/* Corner filigree brackets */}
      <div className="pointer-events-none absolute top-1.5 left-1.5 h-2 w-2 border-t-2 border-l-2 border-purple-400/40" />
      <div className="pointer-events-none absolute top-1.5 right-1.5 h-2 w-2 border-t-2 border-r-2 border-purple-400/40" />
      <div className="pointer-events-none absolute bottom-1.5 left-1.5 h-2 w-2 border-b-2 border-l-2 border-purple-400/40" />
      <div className="pointer-events-none absolute bottom-1.5 right-1.5 h-2 w-2 border-b-2 border-r-2 border-purple-400/40" />

      {/* Ornate Card Header */}
      <div>
        <div className="flex items-center justify-between gap-1 border-b border-purple-500/20 pb-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-200">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-purple-400/30 bg-purple-900/70 font-mono text-[11px] text-purple-200 shadow-sm">
              18
            </span>
            <PolarityIcon polarity={riven.polarity} size={15} />
          </div>

          {riven.grade && (
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-[0_0_8px_currentColor]/15"
              style={{
                borderColor: (riven.gradeColor || "#c084fc") + "80",
                backgroundColor: (riven.gradeColor || "#c084fc") + "18",
                color: riven.gradeColor || "#c084fc",
              }}
            >
              {riven.grade}
            </span>
          )}

          <div className="font-mono text-[11px] font-bold tracking-wider text-purple-300/85">
            MR {riven.masteryRank || 8}
          </div>
        </div>

        {/* Thumbnail Mod Artwork Window */}
        <div className="relative my-2.5 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-b from-[#0e041c] via-[#1a0833] to-[#0a0215] shadow-inner">
          {/* Void energy radial background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/25 via-purple-950/15 to-transparent" />

          {/* Official Category Riven Mod Art */}
          <GameAssetImage
            src={getRivenModArtImage(riven.weaponType)}
            alt={`${riven.weaponType} Riven`}
            width={180}
            height={150}
            className="pointer-events-none absolute inset-0 m-auto h-full w-full object-contain opacity-70 mix-blend-screen"
          />

          {/* Weapon Silhouette / Render in Foreground */}
          <GameAssetImage
            src={getWeaponImage(weaponName)}
            alt={weaponName}
            width={170}
            height={90}
            hideOnError
            className="relative z-10 max-h-[78%] max-w-[85%] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Bottom vignette gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0a0215] to-transparent" />
        </div>

        {/* Title & Classification Banner */}
        <div className="relative z-10 px-1 pt-1 pb-2 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400/90">
            {riven.weaponType} Riven Mod
          </div>
          <h3 className="truncate text-base font-black uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {weaponName}
          </h3>
          <p className="truncate text-xs font-black uppercase tracking-widest text-purple-200 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]">
            {rollSuffix}
          </p>

          {/* Subtle decorative divider line */}
          <div className="mx-auto mt-2 flex items-center justify-center gap-1.5 opacity-60">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
            <span className="h-1 w-1 rotate-45 bg-purple-400" />
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          </div>
        </div>

        {/* Stats Block */}
        <div className="space-y-1.5 py-1 text-center font-sans">
          {riven.displayStats.map((s, idx) => {
            const sign = s.value >= 0 ? "+" : "";
            const formattedVal = s.key.startsWith("faction")
              ? `${(1 + s.value).toFixed(2)}x`
              : s.isPercent
              ? `${sign}${(s.value * 100).toFixed(1)}%`
              : `${sign}${s.value.toFixed(1)}`;

            return (
              <div
                key={idx}
                className={cn(
                  "text-xs font-bold leading-normal tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]",
                  s.isCurse
                    ? "text-rose-400"
                    : s.spliced
                    ? "text-teal-300"
                    : "text-cyan-300",
                )}
              >
                <span>{formattedVal} {s.label}</span>
                {s.spliced && (
                  <span className="ml-1 text-[9px] font-semibold uppercase tracking-wider text-teal-400/90">
                    [Spliced]
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer: Details & Rank Pips */}
      <div className="mt-3 border-t border-purple-500/20 pt-2.5">
        <div className="flex items-center justify-between text-[11px] text-purple-300/80">
          <span className="flex items-center gap-1 font-medium">
            <RefreshCw className="h-3 w-3 text-purple-400" />
            <span>{riven.rerolls || 0} Cycles</span>
          </span>

          {/* 8 Rank Diamond Pips */}
          <div className="flex items-center gap-1" title={`Rank ${riven.rank ?? 8} / 8`}>
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "inline-block h-1.5 w-1.5 rotate-45 rounded-[1px] transition-colors",
                  i < (riven.rank ?? 8)
                    ? "bg-cyan-400 shadow-[0_0_6px_#38bdf8]"
                    : "border border-purple-800/60 bg-purple-950/70",
                )}
              />
            ))}
          </div>
        </div>

        {/* Action Button Bar */}
        {hasActions && (
          <div className="mt-2.5 flex items-center gap-1.5 pt-1">
            <Link
              href={equipUrl}
              title="Equip in Weapon Builder"
              className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-600/30 px-2.5 text-xs font-semibold text-purple-200 shadow-sm transition-all hover:border-purple-400 hover:bg-purple-600 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Equip</span>
            </Link>

            {onReroll && (
              <button
                type="button"
                onClick={() => onReroll(riven)}
                title="Cycle (Reroll Stats)"
                className="flex h-8 items-center justify-center gap-1 rounded-lg border border-purple-500/30 bg-purple-950/60 px-2.5 text-xs font-medium text-purple-300 shadow-sm transition-all hover:border-purple-400 hover:bg-purple-800 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cycle</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(riven)}
                title="Edit Riven"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/60 text-purple-300 shadow-sm transition-all hover:border-purple-400 hover:bg-purple-800 hover:text-white"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(riven.id)}
                title="Delete Riven"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-950/40 text-red-400 shadow-sm transition-all hover:border-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
