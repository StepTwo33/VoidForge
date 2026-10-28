"use client";

import { BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WEAPON_STAT_GLOSSARY } from "@/lib/ui/weapon-stat-glossary";

/** "Glossary" button for the weapon stats heading: what each DPS / crit / status number means. */
export function WeaponStatsGlossary() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-testid="weapon-stats-glossary-trigger"
          className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-[10px] font-medium normal-case tracking-normal text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:pointer-fine:min-h-0 lg:py-0.5"
        >
          <BookOpen className="h-3 w-3" aria-hidden /> Glossary
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={12}
        className="max-h-[min(70dvh,32rem)] w-[min(24rem,calc(100vw-1.5rem))] overflow-y-auto p-3"
        data-testid="weapon-stats-glossary"
      >
        <p className="mb-2 text-xs font-semibold">What these numbers mean</p>
        <dl className="space-y-2.5">
          {WEAPON_STAT_GLOSSARY.map((g) => (
            <div key={g.term}>
              <dt className="text-xs font-semibold text-foreground">
                {g.term}
                {g.abbr ? <span className="ml-1 font-mono text-[10px] text-muted-foreground">({g.abbr})</span> : null}
              </dt>
              <dd className="text-[11px] leading-snug text-muted-foreground">{g.definition}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 border-t border-border/60 pt-2 text-[10px] leading-snug text-muted-foreground">
          Crit, status, multishot, fire rate and punch-through follow wiki.warframe.com. The DPS rows are Voidforge&apos;s
          own model (no in-game equivalent).
        </p>
      </PopoverContent>
    </Popover>
  );
}
