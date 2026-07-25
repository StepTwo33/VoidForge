"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatRow({ label, value, highlighted, color, tooltip, changed }: {
  label: string; value: string; highlighted?: boolean; color?: string; tooltip?: string; changed?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-0.5 px-1 -mx-1 rounded group transition-colors duration-500",
        changed && "bg-amber-500/20 ring-1 ring-amber-500/35",
      )}
      title={tooltip}
    >
      <span className={cn("text-xs", color || "text-muted-foreground", changed && "text-amber-900 dark:text-amber-200")}>
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-mono",
          highlighted ? "font-bold text-blue-400" : color || "",
          changed && "font-semibold text-amber-950 dark:text-amber-100",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CollapsibleSection({ title, defaultOpen, children, flash }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode; flash?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <div
      className={cn(
        "rounded-md transition-colors duration-500",
        flash && "bg-amber-500/10 ring-1 ring-amber-500/25 px-1 -mx-1",
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 w-full text-left py-2.5 text-[10px] font-semibold tracking-wider transition-colors",
          flash ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {open ? <ChevronDown className="h-3 w-3 inline-block" /> : <ChevronRight className="h-3 w-3 inline-block" />}
        {title}
        {flash && <span className="ml-1 text-[9px] font-normal tracking-normal opacity-80">updated</span>}
      </button>
      {open && <div className="ml-1 min-w-0 overflow-x-hidden">{children}</div>}
    </div>
  );
}
export function SimSlider({ label, value, min, max, onChange, suffix, tooltip }: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; suffix?: string; tooltip?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="w-full min-w-0 space-y-0.5" title={tooltip}>
      <span className="block text-[10px] text-muted-foreground leading-tight">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={Math.min(value, max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-w-0 flex-1 h-1 accent-primary cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(clamp(v));
          }}
          className="w-10 shrink-0 text-[10px] font-mono text-right bg-background border border-border rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="shrink-0 text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

