"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { calculateAbilityTTK, type AbilityTTKEntry } from "@/lib/calc/ability-ttk";
import { filterTtkEnemies } from "@/lib/calc/ttk";
import { cn } from "@/lib/utils";
import { EnemyLevelControl } from "@/components/enemy-level-control";
import { Input } from "@/components/ui/input";

const FACTION_COLORS: Record<string, string> = {
  Grineer: "text-red-700 dark:text-red-400",
  Corpus: "text-blue-700 dark:text-blue-300",
  Infested: "text-green-700 dark:text-green-400",
  Corrupted: "text-yellow-700 dark:text-yellow-400",
  Stalker: "text-purple-700 dark:text-purple-400",
  Sentient: "text-violet-700 dark:text-violet-400",
  Murmur: "text-slate-600 dark:text-slate-300",
  Zariman: "text-indigo-700 dark:text-indigo-300",
};

function fmt(n: number) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(0);
}

export function AbilityTTKPanel({ entries }: { entries: AbilityTTKEntry[] }) {
  const [level, setLevel] = useState(100);
  const [steelPath, setSteelPath] = useState(false);
  const [enemySearch, setEnemySearch] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(entries[0]?.key ?? null);

  const searching = enemySearch.trim().length > 0;
  const enemies = useMemo(() => filterTtkEnemies(enemySearch), [enemySearch]);

  const resultsByAbility = useMemo(
    () =>
      entries.map((entry) => ({
        entry,
        results: enemies
          .map((enemy) => calculateAbilityTTK(entry, enemy, level, { steelPath }))
          .sort((a, b) => a.ttk - b.ttk),
      })),
    [entries, level, steelPath, enemies],
  );

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

      <EnemyLevelControl
        value={level}
        onChange={setLevel}
        label="Enemy level"
        steelPath={steelPath}
        onSteelPathChange={setSteelPath}
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search enemies…"
          value={enemySearch}
          onChange={(e) => setEnemySearch(e.target.value)}
          className="min-h-9 h-9 pl-8 text-xs"
          aria-label="Search enemies"
        />
      </div>
      <p className="text-[9px] text-muted-foreground/70 -mt-1">
        {searching
          ? `${enemies.length} match${enemies.length === 1 ? "" : "es"}`
          : `${enemies.length} common · search for any enemy`}
      </p>

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
                      <span className="text-[9px] text-emerald-700/90 dark:text-emerald-400/80 shrink-0">
                        Helminth
                      </span>
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
                <div className="px-3 pb-2 border-t border-border/40">
                  <div className="max-h-[min(40vh,18rem)] space-y-0.5 overflow-y-auto py-1">
                    {results.length === 0 ? (
                      <p className="py-2 text-center text-[10px] text-muted-foreground">No enemies match.</p>
                    ) : (
                      results.map((r) => (
                        <div
                          key={r.enemy.id}
                          className="flex min-h-9 min-w-0 items-center justify-between gap-2 py-0.5"
                        >
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
                      ))
                    )}
                  </div>
                  {entry.ignoreArmor && (
                    <p className="text-[9px] text-muted-foreground/70 pt-1">
                      Finisher-style — armor DR not applied.
                    </p>
                  )}
                  {best && (
                    <div className="pt-1 mt-1 border-t border-border/30 text-[9px] text-muted-foreground flex justify-between">
                      <span>Best target DPS</span>
                      <span className="font-mono text-amber-800 dark:text-amber-300/90">
                        {fmt(best.sustainedDps)}
                      </span>
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
