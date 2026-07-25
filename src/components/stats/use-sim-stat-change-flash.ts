"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CalculatedStats, SimulationParams } from "@/lib/types";
import { avgCritMultiplier, critTierDamage } from "@/lib/calc/crit-utils";

function round(n: number, digits = 2): number {
  const m = 10 ** digits;
  return Math.round(n * m) / m;
}

/** Stable numeric fingerprint of values shown in the weapon stats panel. */
export function buildSimFlashSnapshot(stats: CalculatedStats): Record<string, number> {
  const dmg = stats.arsenalDamage ?? stats;
  const hitBase = dmg.totalDamage;
  const cm = stats.criticalMultiplier;
  const cc = stats.criticalChance;
  const efr = stats.effectiveFireRate ?? stats.fireRate;
  const radialBurst = stats.radialBurstDps ?? 0;
  const radialSustained = stats.radialSustainedDps ?? 0;
  const contagionCloud = stats.contagionCloudDps ?? 0;
  const mechaSpread = stats.mechaSpreadDps ?? 0;
  const shardChain = stats.shardChainDps ?? 0;
  const extraAoE = contagionCloud + mechaSpread + shardChain;

  const procsPerSec = (stats.statusProcs ?? []).reduce(
    (sum, p) => sum + efr * stats.multishot * p.chance,
    0,
  );
  const statusDps = (stats.statusProcs ?? [])
    .filter((p) => p.totalDamage > 0)
    .reduce((sum, p) => {
      const pps = efr * stats.multishot * p.chance;
      return sum + (pps * p.totalDamage) / p.duration;
    }, 0);

  return {
    totalDamage: round(dmg.totalDamage, 1),
    arsenalTotal: round(hitBase * Math.max(1, stats.multishot), 1),
    impact: round(dmg.impact, 1),
    puncture: round(dmg.puncture, 1),
    slash: round(dmg.slash, 1),
    fireRate: round(efr, 3),
    criticalChance: round(stats.criticalChance, 5),
    criticalMultiplier: round(stats.criticalMultiplier, 3),
    statusChance: round(stats.statusChancePerShot, 5),
    multishot: round(stats.multishot, 3),
    reloadTime: round(stats.reloadTime, 3),
    nonCritHit: round(hitBase, 1),
    yellowHit: round(hitBase * critTierDamage(1, cm), 1),
    orangeHit: round(hitBase * critTierDamage(2, cm), 1),
    redHit: round(hitBase * critTierDamage(3, cm), 1),
    avgHit: round(hitBase * avgCritMultiplier(cc, cm), 1),
    heavyAttack: round(stats.heavyAttackDamage ?? 0, 1),
    directBurstDps: round(Math.max(0, stats.burstDps - radialBurst - extraAoE), 0),
    directSustainedDps: round(Math.max(0, stats.sustainedDps - radialSustained - extraAoE), 0),
    radialBurstDps: round(radialBurst, 0),
    radialSustainedDps: round(radialSustained, 0),
    contagionCloudDps: round(contagionCloud, 0),
    mechaSpreadDps: round(mechaSpread, 0),
    shardChainDps: round(shardChain, 0),
    burstDps: round(stats.burstDps, 0),
    sustainedDps: round(stats.sustainedDps, 0),
    procsPerSec: round(procsPerSec, 2),
    statusDps: round(statusDps, 0),
    ttk: round(stats.burstDps + stats.sustainedDps + efr + stats.criticalChance, 4),
  };
}

/**
 * After simulation slider changes, return keys whose displayed stats moved
 * (brief flash). Mod/equipment edits update the baseline silently.
 */
export function useSimStatChangeFlash(
  stats: CalculatedStats | null,
  simParams: SimulationParams | undefined,
  durationMs = 1800,
): Set<string> {
  const prevSimRef = useRef<string | null>(null);
  const prevSnapRef = useRef<Record<string, number> | null>(null);
  const [changed, setChanged] = useState<Set<string>>(() => new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const simKey = simParams ? JSON.stringify(simParams) : "";
  const snap = useMemo(
    () => (stats ? buildSimFlashSnapshot(stats) : null),
    [stats],
  );

  useEffect(() => {
    if (!snap) {
      prevSnapRef.current = null;
      prevSimRef.current = simKey;
      return;
    }

    const prevSnap = prevSnapRef.current;
    const prevSim = prevSimRef.current;
    prevSnapRef.current = snap;
    prevSimRef.current = simKey;

    // First paint, or stats changed without a sim tweak (mods/equipment).
    if (!prevSnap || prevSim === null || prevSim === simKey) return;

    const keys = new Set<string>();
    for (const key of new Set([...Object.keys(prevSnap), ...Object.keys(snap)])) {
      if (prevSnap[key] !== snap[key]) keys.add(key);
    }
    if (keys.size === 0) return;

    setChanged(keys);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setChanged(new Set()), durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [snap, simKey, durationMs]);

  return changed;
}
