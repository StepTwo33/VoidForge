import { describe, it, expect } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { applyAlternateMode, weaponHasAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { modsMap } from "@/data/mods";

const w = (id: string) => enrichWeapon(allWeapons.find((x) => x.id === id)!);
const calc = (weapon: ReturnType<typeof w>) => calculateWeaponBuild(weapon, [], modsMap);
const avgCrit = (cc: number, cm: number) => 1 + cc * (cm - 1);

// Simultaneous bursts (BurstDelay 0): shots/s = BurstCount / (1/FR) = BurstCount x FR.
describe("simultaneous bursts", () => {
  it("Quartakk: 4 rounds per pull x 1.58 = 6.32 shots/s", () => {
    expect(calc(w("quartakk")).effectiveFireRate).toBeCloseTo(6.32, 6);
  });
  it("Akjagara / Prime stay full-auto at FR 5 (no burst timing)", () => {
    expect(calc(w("akjagara")).effectiveFireRate).toBeCloseTo(5, 6);
    expect(calc(w("akjagara_prime")).effectiveFireRate).toBeCloseTo(5, 6);
  });
  it("Sepulcrum: 2 x 1.83 = 3.66; each round's 46 Heat explosion counted per round", () => {
    const s = calc(w("sepulcrum"));
    expect(s.effectiveFireRate).toBeCloseTo(3.66, 6);
  });
  it("Morgha (Auto-Burst): 2 x 3 = 6 shots/s", () => {
    expect(calc(w("morgha")).effectiveFireRate).toBeCloseTo(6, 6);
  });
});

describe("two-mode weapons use the existing alternate-mode toggle", () => {
  it("Kuva Quartakk: default hip-fire Auto 4.83; aimed Burst 4 x 1.58 at 31%/2.3x", () => {
    const base = w("kuva_quartakk");
    expect(calc(base).effectiveFireRate).toBeCloseTo(4.8333, 3);
    expect(weaponHasAlternateMode(base)).toBe(true);
    const alt = calc(applyAlternateMode(base));
    expect(alt.effectiveFireRate).toBeCloseTo(6.32, 6);
    // 54 dmg x 6.32 x avgCrit(31%, 2.3x), unmodded, no status DoT in burst DPS
    expect(alt.criticalChance).toBeCloseTo(0.31, 6);
  });
  it("Quatz: default Auto 15; Burst mode 4 x 2.5 = 10 shots/s", () => {
    expect(calc(w("quatz")).effectiveFireRate).toBeCloseTo(15, 4);
    expect(calc(applyAlternateMode(w("quatz"))).effectiveFireRate).toBeCloseTo(10, 6);
  });
  it("Kuva Hind: default Auto 10; Burst 5 / (1/5 + 4 x 0.07) = 10.417", () => {
    expect(calc(w("kuva_hind")).effectiveFireRate).toBeCloseTo(10, 6);
    expect(calc(applyAlternateMode(w("kuva_hind"))).effectiveFireRate).toBeCloseTo(5 / 0.48, 6);
  });
  it("Tiberon Prime: default Auto 8.33; Burst 3 / (1/5 + 2 x 0.08) = 8.333", () => {
    expect(calc(applyAlternateMode(w("tiberon_prime"))).effectiveFireRate).toBeCloseTo(3 / 0.36, 6);
  });
});

describe("Bubonico: Viral explosion belongs to the alt-fire burst only", () => {
  it("primary Auto has no radial DPS", () => {
    const s = calc(w("bubonico"));
    expect(s.radialBurstDps ?? 0).toBe(0);
  });
  it("alt-fire burst: 3 / (1/5 + 2 x 0.23) = 4.545 shots/s, 143 Viral (x0.75 falloff avg) per shot", () => {
    const s = calc(applyAlternateMode(w("bubonico")));
    const efr = 3 / 0.66;
    expect(s.effectiveFireRate).toBeCloseTo(efr, 6);
    expect(s.radialBurstDps).toBeCloseTo(143 * 0.75 * efr * avgCrit(0.03, 3.5), 0);
  });
});
