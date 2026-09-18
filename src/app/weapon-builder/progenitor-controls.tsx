"use client";

import {
  PROGENITOR_ELEMENT_IDS,
  PROGENITOR_ELEMENT_LABELS,
  PROGENITOR_BONUS_MIN,
  PROGENITOR_BONUS_MAX,
  normalizeProgenitorElement,
} from "@/lib/weapons/weapon-progenitor";

export function ProgenitorControls({
  progenitorElement,
  progenitorBonusPercent,
  onElementChange,
  onBonusChange,
}: {
  progenitorElement: string;
  progenitorBonusPercent: number;
  onElementChange: (element: string) => void;
  onBonusChange: (percent: number) => void;
}) {
  const selected = normalizeProgenitorElement(progenitorElement);
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.06]">
      <span className="text-xs font-medium text-amber-400/90 shrink-0">Progenitor bonus</span>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="hidden sm:inline">Element</span>
        <select
          value={selected}
          onChange={(e) => onElementChange(normalizeProgenitorElement(e.target.value))}
          className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground max-w-[140px]"
        >
          {PROGENITOR_ELEMENT_IDS.map((id) => (
            <option key={id} value={id}>
              {PROGENITOR_ELEMENT_LABELS[id]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Bonus %</span>
        <input
          type="number"
          min={PROGENITOR_BONUS_MIN}
          max={PROGENITOR_BONUS_MAX}
          value={progenitorBonusPercent}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isFinite(v)) return;
            onBonusChange(
              Math.min(PROGENITOR_BONUS_MAX, Math.max(PROGENITOR_BONUS_MIN, Math.round(v))),
            );
          }}
          className="w-14 bg-background border border-border rounded-md px-1.5 py-1 text-xs font-mono text-foreground"
        />
        <span className="text-[10px] opacity-70">
          ({PROGENITOR_BONUS_MIN}–{PROGENITOR_BONUS_MAX})
        </span>
      </label>
    </div>
  );
}
