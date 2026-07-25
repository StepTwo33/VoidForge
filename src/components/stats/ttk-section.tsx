"use client";

import { useMemo, useState } from "react";
import type { CalculatedStats } from "@/lib/types";
import { ENEMY_TYPES, calculateTTK } from "@/lib/calc/ttk";
import { EnemyLevelControl } from "@/components/enemy-level-control";
import { CollapsibleSection, StatRow } from "./stat-primitives";

const FACTION_COLORS: Record<string, string> = {
  Grineer: "text-red-400",
  Corpus: "text-blue-300",
  Infested: "text-green-400",
  Corrupted: "text-yellow-400",
  Stalker: "text-purple-400",
};

export function TTKSection({ stats, flash }: { stats: CalculatedStats; flash?: boolean }) {
  const [level, setLevel] = useState(100);
  const [selectedFaction, setSelectedFaction] = useState("all");
  const [expandedEnemy, setExpandedEnemy] = useState<string | null>(null);

  const results = useMemo(() => {
    const enemies = selectedFaction === "all"
      ? ENEMY_TYPES
      : ENEMY_TYPES.filter((e) => e.faction === selectedFaction);
    return enemies.map((e) => calculateTTK(stats, e, level)).sort((a, b) => a.ttk - b.ttk);
  }, [stats, level, selectedFaction]);

  const factions = ["all", ...new Set(ENEMY_TYPES.map((e) => e.faction))];

  const fmt = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(0);

  return (
    <CollapsibleSection title="TIME TO KILL" defaultOpen={false} flash={flash}>
      <div className="mb-2 min-w-0">
        <EnemyLevelControl value={level} onChange={setLevel} label="Enemy level" />
      </div>
      <div className="flex gap-1 mb-2 flex-wrap">
        {factions.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFaction(f)}
            className={`text-[9px] px-1.5 py-0.5 rounded border transition-all ${selectedFaction === f
                ? "border-primary text-primary bg-primary/10"
                : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>
      <div className="space-y-0.5">
        {results.map((r) => (
          <div key={r.enemy.id}>
            <button
              onClick={() => setExpandedEnemy(expandedEnemy === r.enemy.id ? null : r.enemy.id)}
              className="w-full flex justify-between items-center py-0.5 hover:bg-muted/30 rounded px-1 -mx-1 transition-colors"
            >
              <span className={`text-[10px] ${FACTION_COLORS[r.enemy.faction] || "text-muted-foreground"}`}>
                {r.enemy.name}
              </span>
              <span className={`text-[10px] font-mono ${r.ttk < 1 ? "text-green-400" : r.ttk < 5 ? "text-yellow-400" : r.ttk < 15 ? "text-orange-400" : "text-red-400"
                }`}>
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
                    <span className="font-mono text-cyan-300">{fmt(r.scaledShield)}</span>
                  </div>
                )}
                {r.scaledArmor > 0 && (
                  <div className="flex justify-between text-[9px]">
                    <span className="text-muted-foreground">Armor</span>
                    <span className="font-mono">{fmt(r.scaledArmor)} <span className="text-red-400">({r.armorDR.toFixed(1)}% DR)</span></span>
                  </div>
                )}
                <div className="flex justify-between text-[9px]">
                  <span className="text-muted-foreground">Burst DPS</span>
                  <span className="font-mono text-amber-300">{fmt(r.burstDps)}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-muted-foreground">Sustained DPS</span>
                  <span className="font-mono text-amber-300">{fmt(r.sustainedDps)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

