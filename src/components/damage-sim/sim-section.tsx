"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border/60 surface-panel">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-11 items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
        {icon && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-800 ring-1 ring-border/40 dark:text-amber-400">
            {icon}
          </span>
        )}
        <span className="min-w-0 truncate">{title}</span>
      </button>
      {open && <div className="min-w-0 px-4 pb-4">{children}</div>}
    </div>
  );
}

export function SimInputField({
  label,
  value,
  onChange,
  step,
  min,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-0.5 block truncate text-[10px] text-muted-foreground">{label}</label>
      <div className="relative min-w-0">
        <input
          type="number"
          step={step ?? 1}
          min={min ?? 0}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full min-h-11 min-w-0 max-w-full appearance-none rounded-lg border border-border bg-background px-2.5 py-2 font-mono text-base [appearance:textfield] sm:min-h-9 sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function SimResultRow({
  label,
  value,
  color,
  bold,
  tooltip,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5" title={tooltip}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("font-mono text-xs tabular-nums", color, bold && "font-bold")}>{value}</span>
    </div>
  );
}

export function fmtSimNum(n: number): string {
  if (n === Infinity || isNaN(n)) return "∞";
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toFixed(n < 10 ? 2 : 0);
}

export const SIM_ELEMENT_COLORS: Record<string, string> = {
  impact: "#94a3b8",
  puncture: "#a8a29e",
  slash: "#f87171",
  heat: "#fb923c",
  cold: "#67e8f9",
  toxin: "#4ade80",
  electricity: "#93c5fd",
  blast: "#facc15",
  corrosive: "#a3e635",
  gas: "#6ee7b7",
  magnetic: "#a5b4fc",
  radiation: "#fcd34d",
  viral: "#5eead4",
};

export const SIM_FACTION_COLORS: Record<string, string> = {
  Grineer: "#FF6B35",
  Corpus: "#00B4D8",
  Infested: "#2ECC71",
  Corrupted: "#9B59B6",
  Stalker: "#E91E63",
  Sentient: "#C084FC",
  Narmer: "#F59E0B",
  Murmur: "#94A3B8",
};

export const SIM_DAMAGE_TYPES = [
  { key: "impact", label: "Impact" },
  { key: "puncture", label: "Puncture" },
  { key: "slash", label: "Slash" },
  { key: "heat", label: "Heat" },
  { key: "cold", label: "Cold" },
  { key: "toxin", label: "Toxin" },
  { key: "electricity", label: "Electricity" },
  { key: "blast", label: "Blast" },
  { key: "corrosive", label: "Corrosive" },
  { key: "gas", label: "Gas" },
  { key: "magnetic", label: "Magnetic" },
  { key: "radiation", label: "Radiation" },
  { key: "viral", label: "Viral" },
];
