"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CalculatedStats } from "@/lib/types";
import { filterTtkEnemies, calculateTTK } from "@/lib/calc/ttk";
import { EnemyLevelControl } from "@/components/enemy-level-control";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "./stat-primitives";

const FACTION_COLORS: Record<string, string> = {
  Grineer: "text-red-700 dark:text-red-400",
  Corpus: "text-blue-700 dark:text-blue-300",
  Infested: "text-green-700 dark:text-green-400",
  Corrupted: "text-yellow-700 dark:text-yellow-400",
  Stalker: "text-purple-700 dark:text-purple-400",
  Sentient: "text-violet-700 dark:text-violet-400",
  Narmer: "text-amber-800 dark:text-amber-400",
  Murmur: "text-slate-600 dark:text-slate-300",
  Zariman: "text-indigo-700 dark:text-indigo-300",
};

export function TTKSection({
  stats,
  flash,
  steelPath: steelPathProp,
  onSteelPathChange,
}: {
  stats: CalculatedStats;
  flash?: boolean;
  /** Controlled Steel Path flag (e.g. from SIMULATION). Falls back to local state. */
  steelPath?: boolean;
  onSteelPathChange?: (steelPath: boolean) => void;
}) {
  const [level, setLevel] = useState(100);
  const [localSteelPath, setLocalSteelPath] = useState(false);
  const controlled = typeof steelPathProp === "boolean" && typeof onSteelPathChange === "function";
  const steelPath = controlled ? steelPathProp! : localSteelPath;
  const setSteelPath = controlled ? onSteelPathChange! : setLocalSteelPath;
  const [enemySearch, setEnemySearch] = useState("");
  const [expandedEnemy, setExpandedEnemy] = useState<string | null>(null);

  const searching = enemySearch.trim().length > 0;
  const enemies = useMemo(() => filterTtkEnemies(enemySearch), [enemySearch]);

  const results = useMemo(
    () => enemies.map((e) => calculateTTK(stats, e, level, { steelPath })).sort((a, b) => a.ttk - b.ttk),
    [stats, level, steelPath, enemies],
  );

  const fmt = (n: number) =>
    n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(0);

  return (
    <CollapsibleSection title="TIME TO KILL" defaultOpen={false} flash={flash}>
      <div className="mb-2 min-w-0">
        <EnemyLevelControl
          value={level}
          onChange={setLevel}
          label="Enemy level"
          steelPath={steelPath}
          onSteelPathChange={setSteelPath}
        />
      </div>
      <div className="relative mb-2">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search enemies…"
          value={enemySearch}
          onChange={(e) => setEnemySearch(e.target.value)}
          className="min-h-9 h-9 pl-8 text-xs"
          aria-label="Search enemies"
        />
      </div>
      <div className="max-h-[min(40vh,18rem)] space-y-0.5 overflow-y-auto rounded-lg border border-border/50 bg-background/40 p-1">
        {results.length === 0 ? (
          <p className="p-3 text-center text-[10px] text-muted-foreground">No enemies match.</p>
        ) : (
          results.map((r) => (
            <div key={r.enemy.id}>
              <button
                type="button"
                onClick={() => setExpandedEnemy(expandedEnemy === r.enemy.id ? null : r.enemy.id)}
                className="w-full flex min-h-9 min-w-0 justify-between items-center gap-2 py-1 hover:bg-muted/30 rounded px-1 -mx-0 transition-colors"
              >
                <span
                  className={`min-w-0 truncate text-[10px] ${FACTION_COLORS[r.enemy.faction] || "text-muted-foreground"}`}
                >
                  {r.enemy.name}
                </span>
                <span
                  className={`text-[10px] font-mono shrink-0 ${
                    r.ttk < 1
                      ? "text-green-700 dark:text-green-400"
                      : r.ttk < 5
                        ? "text-yellow-700 dark:text-yellow-400"
                        : r.ttk < 15
                          ? "text-orange-700 dark:text-orange-400"
                          : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {r.ttk === Infinity ? "∞" : r.ttk < 0.01 ? "<0.01s" : `${r.ttk.toFixed(2)}s`}
                </span>
              </button>
              {expandedEnemy === r.enemy.id && (
                <div className="ml-2 mb-1 pl-2 border-l border-border/50 space-y-0.5 py-0.5">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-muted-foreground">Shots to Kill</span>
                    <span className="font-mono">{r.shotsToKill === Infinity ? "∞" : r.shotsToKill}</span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-muted-foreground">Health</span>
                    <span className="font-mono">{fmt(r.scaledHealth)}</span>
                  </div>
                  {r.scaledShield > 0 && (
                    <div className="flex justify-between text-[9px]">
                      <span className="text-muted-foreground">Shield</span>
                      <span className="font-mono text-cyan-700 dark:text-cyan-300">{fmt(r.scaledShield)}</span>
                    </div>
                  )}
                  {r.scaledArmor > 0 && (
                    <div className="flex justify-between text-[9px]">
                      <span className="text-muted-foreground">Armor</span>
                      <span className="font-mono">
                        {fmt(r.scaledArmor)}{" "}
                        <span className="text-red-700 dark:text-red-400">({r.armorDR.toFixed(1)}% DR)</span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[9px]">
                    <span className="text-muted-foreground">Burst DPS</span>
                    <span className="font-mono text-amber-800 dark:text-amber-300">{fmt(r.burstDps)}</span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-muted-foreground">Sustained DPS</span>
                    <span className="font-mono text-amber-800 dark:text-amber-300">{fmt(r.sustainedDps)}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <p className="mt-1.5 text-[9px] text-muted-foreground/70">
        {searching
          ? `${results.length} match${results.length === 1 ? "" : "es"}`
          : `${results.length} common · search for any enemy`}
      </p>
    </CollapsibleSection>
  );
}
