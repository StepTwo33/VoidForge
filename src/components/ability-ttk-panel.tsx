"use client";

import { useMemo, useState } from "react";
import { calculateAbilityTTK, ENEMY_TYPES, type AbilityTTKEntry } from "@/lib/calc/ability-ttk";
import { cn } from "@/lib/utils";
import { EnemyLevelControl } from "@/components/enemy-level-control";

const FACTION_COLORS: Record<string, string> = {
  Grineer: "text-red-700 dark:text-red-400",
  Corpus: "text-blue-700 dark:text-blue-300",
  Infested: "text-green-700 dark:text-green-400",
  Corrupted: "text-yellow-700 dark:text-yellow-400",
  Stalker: "text-purple-700 dark:text-purple-400",
};

function fmt(n: number) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(0);
}

export function AbilityTTKPanel({ entries }: { entries: AbilityTTKEntry[] }) {
  const [level, setLevel] = useState(100);
  const [selectedFaction, setSelectedFaction] = useState("all");
  const [expandedKey, setExpandedKey] = useState<string | null>(entries[0]?.key ?? null);

  const factions = useMemo(
    () => ["all", ...new Set(ENEMY_TYPES.map((e) => e.faction))],
    [],
  );

  const resultsByAbility = useMemo(() => {
    const enemies =
      selectedFaction === "all"
        ? ENEMY_TYPES
        : ENEMY_TYPES.filter((e) => e.faction === selectedFaction);

    return entries.map((entry) => ({
      entry,
      results: enemies
        .map((enemy) => calculateAbilityTTK(entry, enemy, level))
        .sort((a, b) => a.ttk - b.ttk),
    }));
  }, [entries, level, selectedFaction]);

  if (entries.length === 0) return null;

  return (
    <div className="min-w-0 space-y-3 rounded-xl border border-border bg-card p-4">
      <div>
        <h3 className="text-[10px] font-semibold tracking-wider text-muted-foreground mb-1">
          ABILITY TIME TO KILL
        </h3>
        <p className="text-[10px] text-muted-foreground/80 leading-snug">
          Modeled from ability damage at your build&apos;s strength. Finisher-style damage ignores armor.
        </p>
      </div>

      <EnemyLevelControl value={level} onChange={setLevel} label="Enemy level" />

      <div className="flex gap-1 flex-wrap">
        {factions.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSelectedFaction(f)}
            className={cn(
              "inline-flex min-h-11 items-center text-[9px] px-2.5 py-1.5 rounded border transition-all",
              selectedFaction === f
                ? "border-primary text-primary bg-primary/10"
                : "border-border/50 text-muted-foreground hover:text-foreground",
            )}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {resultsByAbility.map(({ entry, results }) => {
          const open = expandedKey === entry.key;
          const best = results[0];
          return (
            <div key={entry.key} className="rounded-lg border border-border/60 bg-muted/10">
              <button
                type="button"
                onClick={() => setExpandedKey(open ? null : entry.key)}
                className="w-full flex min-h-11 items-center gap-2 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
              >
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {entry.slot}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-orange-800 dark:text-orange-300 truncate">
                      {entry.abilityName}
                    </span>
                    {entry.helminth && (
                      <span className="text-[9px] text-emerald-700/90 dark:text-emerald-400/80 shrink-0">Helminth</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{entry.damageSummary}</p>
                </div>
                {best && (
                  <span className="text-[10px] font-mono text-amber-800 dark:text-amber-400 shrink-0">
                    {best.ttk === Infinity ? "∞" : `${best.ttk.toFixed(2)}s`}
                  </span>
                )}
              </button>

              {open && (
                <div className="px-3 pb-2 space-y-0.5 border-t border-border/40">
                  {results.map((r) => (
                    <div key={r.enemy.id} className="flex min-w-0 items-center justify-between gap-2 py-1">
                      <span
                        className={cn(
                          "min-w-0 truncate text-[10px]",
                          FACTION_COLORS[r.enemy.faction] || "text-muted-foreground",
                        )}
                      >
                        {r.enemy.name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-mono shrink-0 ml-2",
                          r.ttk < 1
                            ? "text-green-700 dark:text-green-400"
                            : r.ttk < 5
                              ? "text-yellow-700 dark:text-yellow-400"
                              : r.ttk < 15
                                ? "text-orange-700 dark:text-orange-400"
                                : "text-red-700 dark:text-red-400",
                        )}
                      >
                        {r.ttk === Infinity ? "∞" : r.ttk < 0.01 ? "<0.01s" : `${r.ttk.toFixed(2)}s`}
                      </span>
                    </div>
                  ))}
                  {entry.ignoreArmor && (
                    <p className="text-[9px] text-muted-foreground/70 pt-1">
                      Finisher-style — armor DR not applied.
                    </p>
                  )}
                  {best && (
                    <div className="pt-1 mt-1 border-t border-border/30 text-[9px] text-muted-foreground flex justify-between">
                      <span>Best target DPS</span>
                      <span className="font-mono text-amber-800 dark:text-amber-300/90">{fmt(best.sustainedDps)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
