import { describe, expect, it } from "vitest";
import {
  auraEnergyRegenPerSec,
  shieldGateSec,
  shieldRechargeDelays,
  shieldRechargePerSec,
  startingEnergy,
} from "@/lib/calc/warframe-shield-energy";

describe("Round 54 shield / energy sidebar helpers", () => {
  it("recharge rate follows (15 + 5% shields) × (1 + bonus)", () => {
    expect(shieldRechargePerSec(300)).toBeCloseTo(30);
    expect(shieldRechargePerSec(300, 1)).toBeCloseTo(60);
    expect(shieldRechargePerSec(0)).toBe(0);
  });
  it("recharge delay is 1 s / 4 s, reduction capped at 80%", () => {
    expect(shieldRechargeDelays(0)).toEqual({ normal: 1, depleted: 4 });
    expect(shieldRechargeDelays(0.45).depleted).toBeCloseTo(2.2);
    expect(shieldRechargeDelays(2).normal).toBeCloseTo(0.2);
  });
  it("shield gate piecewise formula and Catalyzing Shields", () => {
    expect(shieldGateSec(0)).toBe(0);
    expect(shieldGateSec(36)).toBeCloseTo(36 / 180 + 1 / 3);
    expect(shieldGateSec(350)).toBeCloseTo(1 + 1 / 3);
    expect(shieldGateSec(2000)).toBe(2.5);
    expect(shieldGateSec(2000, true)).toBe(1.33);
  });
  it("starting energy adds 5 × free capacity and % of max, capped at max", () => {
    expect(startingEnergy({ base: 50, maxEnergy: 300, freeModCapacity: 4 })).toBe(70);
    expect(startingEnergy({ base: 50, maxEnergy: 300, bonusPct: 100 })).toBe(300);
    expect(startingEnergy({ base: 50, maxEnergy: 300, fullOnSpawn: true })).toBe(300);
  });
  it("aura energy regen at max rank", () => {
    expect(auraEnergyRegenPerSec([{ modId: "aura_energy_siphon", rank: 5 }])).toBe(0.6);
    expect(auraEnergyRegenPerSec([{ modId: "dreamers_bond", rank: 5 }])).toBe(0.3);
    expect(auraEnergyRegenPerSec([{ modId: "energy_nexus", rank: 5 }])).toBe(3);
    expect(auraEnergyRegenPerSec([{ modId: "steel_charge", rank: 5 }])).toBe(0);
  });
});
