import { describe, it, expect } from "vitest";
import { allWeapons } from "@/data/weapons";
import { customWeapons } from "@/data/custom-items";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { resolveEffectiveFireRate } from "@/lib/calc/effective-fire-rate";

const efr = (id: string, modIds: string[] = []) => {
  const w = [...allWeapons, ...customWeapons].find((x) => x.id === id)!;
  const mods = modIds.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i }));
  return calculateWeaponBuild(enrichWeapon(w), mods, modsMap).effectiveFireRate!;
};

// Wiki Fire Rate (wiki.warframe.com + fandom): FR bonus speeds up the burst and the gap
// between bursts; Burst Delay is not affected by net negative FR bonuses.
describe("fire rate bonus shortens burst delay", () => {
  it("Burston Prime + Speed Trigger (+60%): 3 / (1/8 + 2 x 0.04/1.6) = 17.143", () => {
    expect(efr("burston_prime", ["speed_trigger_r3"])).toBeCloseTo(3 / (1 / 8 + 0.05), 6); // was 14.634
  });
  it("Burston Prime unmodded unchanged: 3 / (1/5 + 0.08) = 10.714", () => {
    expect(efr("burston_prime")).toBeCloseTo(3 / (0.2 + 0.08), 6);
  });
  it("Sicarus + Gunslinger (+72%): 3 / (1/(3.5 x 1.72) + 2 x 0.04/1.72) = 14.11", () => {
    expect(efr("sicarus", ["gunslinger_r3"])).toBeCloseTo(3 / (1 / 6.02 + 0.08 / 1.72), 6);
  });
  it("Tigris + Shotgun Barrage (+90%): 2 / (1/3.8 + 0.15/1.9) = 5.846", () => {
    expect(efr("tigris", ["shotgun_barrage"])).toBeCloseTo(2 / (1 / 3.8 + 0.15 / 1.9), 6);
  });
  it("Helstrum + Speed Trigger: 4 / (1/0.4 + 3 x 0.1/1.6) = 1.4884", () => {
    expect(efr("helstrum", ["speed_trigger_r3"])).toBeCloseTo(4 / (2.5 + 0.3 / 1.6), 6);
  });
  it("net negative bonus leaves burst delay unscaled", () => {
    const base = { triggerType: "Burst", baseFireRate: 5, fireRateBonus: -0.36, reloadTime: 2, burstCount: 3, burstDelay: 0.04 };
    expect(resolveEffectiveFireRate({ ...base, moddedFireRate: 5 * 0.64 })).toBeCloseTo(3 / (1 / 3.2 + 0.08), 6);
  });
  it("zero burst delay (simultaneous bursts) is unaffected", () => {
    const r = resolveEffectiveFireRate({ triggerType: "Burst", baseFireRate: 5, moddedFireRate: 8, fireRateBonus: 0.6, reloadTime: 2, burstCount: 3, burstDelay: 0 });
    expect(r).toBeCloseTo(24, 6);
  });
});
