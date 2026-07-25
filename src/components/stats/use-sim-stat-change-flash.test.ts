import { describe, expect, it } from "vitest";
import { buildSimFlashSnapshot } from "@/components/stats/use-sim-stat-change-flash";
import type { CalculatedStats } from "@/lib/types";

function bareStats(over: Partial<CalculatedStats> = {}): CalculatedStats {
  return {
    totalDamage: 100,
    impact: 50,
    puncture: 25,
    slash: 25,
    elements: [],
    rawElements: [],
    fireRate: 1,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0.1,
    statusChancePerShot: 0.1,
    magazine: 10,
    reloadTime: 1,
    multishot: 1,
    burstDps: 200,
    sustainedDps: 150,
    statusProcs: [],
    comboCount: 0,
    comboMultiplier: 1,
    comboDuration: 5,
    heavyAttackDamage: 0,
    heavyAttackWindUp: 0,
    heavyAttackEfficiency: 0,
    heavyAttackComboMultiplier: 1,
    slideAttackDamage: 0,
    ...over,
  } as CalculatedStats;
}

describe("buildSimFlashSnapshot", () => {
  it("changes fireRate and dps keys when attack speed changes", () => {
    const a = buildSimFlashSnapshot(bareStats({ fireRate: 1, burstDps: 200, sustainedDps: 150 }));
    const b = buildSimFlashSnapshot(bareStats({ fireRate: 1.7, burstDps: 340, sustainedDps: 255 }));
    expect(a.fireRate).not.toBe(b.fireRate);
    expect(a.burstDps).not.toBe(b.burstDps);
    expect(a.directBurstDps).not.toBe(b.directBurstDps);
  });

  it("keeps direct damage stable when only fire rate changes", () => {
    const a = buildSimFlashSnapshot(bareStats({ fireRate: 1 }));
    const b = buildSimFlashSnapshot(bareStats({ fireRate: 2 }));
    expect(a.totalDamage).toBe(b.totalDamage);
    expect(a.nonCritHit).toBe(b.nonCritHit);
  });
});
