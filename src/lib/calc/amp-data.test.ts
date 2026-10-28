import { describe, it, expect } from "vitest";
import { allWeapons } from "@/data/weapons";
import { ampPrisms, ampScaffolds } from "@/data/modular-weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";

const calc = (w: Parameters<typeof enrichWeapon>[0]) => calculateWeaponBuild(enrichWeapon(w), [], modsMap);
const avgCrit = (cc: number, cm: number) => 1 + cc * (cm - 1);
const KEYS = ["damage", "fireRate", "criticalChance", "criticalMultiplier", "statusChance", "magazine", "ammoCost", "triggerType", "burstCount", "burstDelay"] as const;

describe("main-list amp entries mirror the modular-builder data (same ids)", () => {
  for (const p of ampPrisms) {
    it(p.id, () => {
      const main = allWeapons.find((w) => w.id === p.id)!;
      expect(main.category).toBe("amp_prism");
      for (const k of KEYS) expect((main as unknown as Record<string, unknown>)[k]).toEqual((p as unknown as Record<string, unknown>)[k]);
    });
  }
  it("scaffold ids in the main list match the scaffold primary-fire paper", () => {
    for (const id of ["amp_exard", "amp_dissic", "amp_propa"]) {
      const main = allWeapons.find((w) => w.id === id)!;
      const sc = ampScaffolds.find((s) => s.id === id)!;
      for (const k of ["damage", "fireRate", "criticalChance", "criticalMultiplier", "statusChance", "burstCount", "burstDelay"] as const)
        expect((main as unknown as Record<string, unknown>)[k]).toEqual((sc as unknown as Record<string, unknown>)[k]);
    }
  });
});

describe("wiki values (Module:Weapons/data/modular)", () => {
  it("Exard scaffold: 3-round burst, 0.12s, Fire Rate 1 -> 3 / (1 + 2 x 0.12) = 2.419 shots/s", () => {
    const sc = ampScaffolds.find((s) => s.id === "amp_exard")!;
    expect([sc.fireRate, sc.burstCount, sc.burstDelay]).toEqual([1, 3, 0.12]);
    expect(calc(allWeapons.find((w) => w.id === "amp_exard")).effectiveFireRate).toBeCloseTo(3 / 1.24, 6);
  });
  it("Dissic scaffold fire rate is 1 (both wikis), not 0.5", () => {
    expect(ampScaffolds.find((s) => s.id === "amp_dissic")!.fireRate).toBe(1);
  });
  it("Granmu: (1000 + 1400) x 3 / (1 + 2 x 0.15) x avgCrit(26%, 2x) = 6979.2 burst DPS", () => {
    const s = calc(ampPrisms.find((p) => p.id === "amp_granmu"));
    expect(s.effectiveFireRate).toBeCloseTo(3 / 1.3, 6);
    expect(s.burstDps / (2400 * (3 / 1.3) * avgCrit(0.26, 2))).toBeCloseTo(1, 3); // calc adds a <0.1% residual term
  });
  it("Raplak: 3000 x 2/s x avgCrit(38%, 2.6x) = 9648 burst DPS; 100 energy / 10 per shot", () => {
    const s = calc(ampPrisms.find((p) => p.id === "amp_raplak"));
    expect(s.burstDps / (3000 * 2 * avgCrit(0.38, 2.6))).toBeCloseTo(1, 2);
    expect(s.sustainedDps).toBeLessThan(s.burstDps); // 10 shots per pool, then recharge
  });
});
