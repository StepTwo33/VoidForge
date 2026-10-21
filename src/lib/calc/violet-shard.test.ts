import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import type { EquippedArchonShard } from "@/lib/types";
import { applyWarframeShardsAndArcanes, calculateWarframeBuild, VIOLET_MELEE_CRIT_ENERGY_THRESHOLD } from "./calculator";

const excal = allWarframes.find((w) => w.id === "excalibur")!;

function shard(selectedBonus: string, bonusValue: number, slotIndex: number, color = "violet", tier = 1): EquippedArchonShard {
  return { shardId: `${color}_${tier === 2 ? "tauforged" : "standard"}`, shardColor: color, shardTier: tier, selectedBonus, bonusValue, slotIndex };
}

/** Excalibur with extra flat max energy so the total lands exactly where a case needs it. */
function withEnergy(targetEnergy: number, shards: EquippedArchonShard[]) {
  const stats = calculateWarframeBuild(excal, [], new Map());
  const base = stats.baseEnergy * (1 + stats.energyBonus + stats.flowBonus) + stats.flatEnergyBonus;
  stats.flatEnergyBonus += targetEnergy - base;
  return applyWarframeShardsAndArcanes(stats, shards);
}

describe("Violet shard melee crit damage (wiki Archon Shard: doubles when Max Energy is over 500)", () => {
  it("threshold is 500, strictly greater", () => {
    expect(VIOLET_MELEE_CRIT_ENERGY_THRESHOLD).toBe(500);
  });

  it("bare Excalibur (150 energy): +25%", () => {
    const s = withEnergy(150, [shard("meleeCritDamageEnergy", 25, 0)]);
    expect(s.totalEnergy).toBeCloseTo(150);
    expect(s.meleeCritDamageBonus).toBe(25);
    expect(s.violetMeleeCritDamage).toEqual({ base: 25, doubled: false });
  });

  it("exactly 500 energy is not enough (needs 501+)", () => {
    const s = withEnergy(500, [shard("meleeCritDamageEnergy", 25, 0)]);
    expect(s.meleeCritDamageBonus).toBe(25);
  });

  it("501 energy doubles it: +50%", () => {
    const s = withEnergy(501, [shard("meleeCritDamageEnergy", 25, 0)]);
    expect(s.meleeCritDamageBonus).toBe(50);
    expect(s.violetMeleeCritDamage?.doubled).toBe(true);
  });

  it("tauforged doubles too: 37.5 → 75", () => {
    const s = withEnergy(600, [shard("meleeCritDamageEnergy", 37.5, 0, "violet", 2)]);
    expect(s.meleeCritDamageBonus).toBe(75);
  });

  it("Azure +50 energy shards count toward the threshold (flat, after mods)", () => {
    // 460 + 50 = 510 > 500 → two Violet shards: (25 + 25) × 2 = 100
    const s = withEnergy(460, [
      shard("meleeCritDamageEnergy", 25, 0),
      shard("meleeCritDamageEnergy", 25, 1),
      shard("energyMax", 50, 2, "azure"),
    ]);
    expect(s.totalEnergy).toBeCloseTo(510);
    expect(s.meleeCritDamageBonus).toBe(100);
  });

  it("Crimson melee crit damage is never doubled: Crimson 25 + Violet 25×2 = 75", () => {
    const s = withEnergy(700, [shard("meleeCritDamage", 25, 0, "crimson"), shard("meleeCritDamageEnergy", 25, 1)]);
    expect(s.meleeCritDamageBonus).toBe(75);
  });

  it("no Violet shard: no violetMeleeCritDamage field", () => {
    const s = withEnergy(700, [shard("meleeCritDamage", 25, 0, "crimson")]);
    expect(s.meleeCritDamageBonus).toBe(25);
    expect(s.violetMeleeCritDamage).toBeUndefined();
  });
});
