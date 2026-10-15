import { describe, it, expect } from "vitest";
import { customWeapons } from "@/data/custom-items";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";

const calc = (id: string) =>
  calculateWeaponBuild(enrichWeapon(customWeapons.find((w) => w.id === id)!), [], modsMap);
// avg crit multiplier = 1 + CC x (CM - 1)
const avgCrit = (cc: number, cm: number) => 1 + cc * (cm - 1);

// Wiki Fire Rate (both wikis): EFR = BurstCount / (1/FR + (BurstCount - 1) x BurstDelay).
// BurstCount/BurstDelay: Module:Weapons/data/companion (wiki.warframe.com and fandom agree).
describe("companion burst timing", () => {
  it("Helstrum: 4 / (1/0.25 + 3 x 0.1) = 0.9302 shots/s", () => {
    expect(calc("helstrum").effectiveFireRate).toBeCloseTo(4 / 4.3, 6);
  });
  it("Burst Laser: 3 / (1/1.5 + 2 x 0.4) = 2.0455", () => {
    expect(calc("burst_laser").effectiveFireRate).toBeCloseTo(3 / (1 / 1.5 + 0.8), 6);
  });
  it("Burst Laser Prime: 5 / (1/1.5 + 4 x 0.2) = 3.4091", () => {
    expect(calc("burst_laser_prime").effectiveFireRate).toBeCloseTo(5 / (1 / 1.5 + 0.8), 6);
  });
  it("Prisma Burst Laser: 4 / (1/1.5 + 3 x 0.3) = 2.5532", () => {
    expect(calc("prisma_burst_laser").effectiveFireRate).toBeCloseTo(4 / (1 / 1.5 + 0.9), 6);
  });
  it("Multron: 3 / (1/2.5 + 2 x 0.4) = 2.5 (unchanged)", () => {
    expect(calc("multron").effectiveFireRate).toBeCloseTo(2.5, 6);
  });
});

describe("companion explosion / radial damage counted in DPS", () => {
  it("Helstrum burst DPS = (9 direct + 30 explosion) x avgCrit(5%, 1.5x) x 0.9302", () => {
    const s = calc("helstrum");
    const efr = 4 / 4.3;
    expect(s.radialBurstDps).toBeCloseTo(30 * avgCrit(0.05, 1.5) * efr, 1);
    expect(s.burstDps).toBeCloseTo(39 * avgCrit(0.05, 1.5) * efr, 1); // 37.19, was 9.99
  });

  // Existing radial model: 50% falloff to edge -> average multiplier 1 - 0.5/2 = 0.75.
  it("Vulcax: 500 Heat hitscan + 100 Blast radial (x0.75 falloff avg), x avgCrit(20%, 2.5x)", () => {
    const s = calc("vulcax");
    expect(customWeapons.find((w) => w.id === "vulcax")!.heat).toBe(500);
    expect(s.radialBurstDps).toBeCloseTo(75 * avgCrit(0.2, 2.5), 1); // 97.5
    expect(s.burstDps).toBeCloseTo(575 * avgCrit(0.2, 2.5), 0); // 747.5, was 650
  });

  it("Multron radial is per dart: 100 Blast x 0.75 falloff avg x 2.5/s x avgCrit(15%, 2x)", () => {
    expect(calc("multron").radialBurstDps).toBeCloseTo(75 * 2.5 * avgCrit(0.15, 2), 1);
  });
});
