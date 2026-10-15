import { describe, it, expect } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { applyAlternateMode, getAlternateModes, weaponHasAlternateMode } from "@/lib/weapons/weapon-alternate-mode";
import { modsMap } from "@/data/mods";

const w = (id: string) => enrichWeapon(allWeapons.find((x) => x.id === id)!);
const calc = (weapon: ReturnType<typeof w>) => calculateWeaponBuild(weapon, [], modsMap);
const avgCrit = (cc: number, cm: number) => 1 + cc * (cm - 1);
/** Burst DPS hand-worked from the calculator's own (quantized) per-shot damage. */
const handBurst = (s: ReturnType<typeof calc>, efr: number, cc: number, cm: number) => s.totalDamage * efr * avgCrit(cc, cm);

describe("three-mode weapons (wiki trigger: Auto / Burst / Semi-Auto)", () => {
  it("Kuva Hind lists Burst then Semi-Auto; default labelled Auto", () => {
    const k = w("kuva_hind");
    expect(getAlternateModes(k).map((m) => m.label)).toEqual(["Burst", "Semi-Auto"]);
    expect(k.defaultModeLabel).toBe("Auto");
  });
  it("Kuva Hind Auto (default): FR 10, 21%/1.9x", () => {
    const s = calc(w("kuva_hind"));
    expect(s.effectiveFireRate).toBeCloseTo(10, 6);
    expect(s.burstDps / handBurst(s, 10, 0.21, 1.9)).toBeCloseTo(1, 3);
  });
  it("Kuva Hind Burst: 5 / (1/5 + 4 x 0.07) = 10.4167 shots/s, 25%/2.1x", () => {
    const s = calc(applyAlternateMode(w("kuva_hind"), 0));
    expect(s.effectiveFireRate).toBeCloseTo(5 / 0.48, 4);
    expect(s.burstDps / handBurst(s, 5 / 0.48, 0.25, 2.1)).toBeCloseTo(1, 3);
  });
  it("Kuva Hind Semi-Auto: 90 dmg (18/18/54), FR 2.5, 37%/2.9x, 21% status, 3 ammo/shot", () => {
    const m = applyAlternateMode(w("kuva_hind"), 1);
    expect([m.damage, m.impact, m.puncture, m.slash, m.ammoCost]).toEqual([90, 18, 18, 54, 3]);
    const s = calc(m);
    expect(s.effectiveFireRate).toBeCloseTo(2.5, 6);
    expect(s.statusChance).toBeCloseTo(0.21, 6);
    // ≈ 90 x 2.5 x 1.703 = 383 before the calculator's damage quantization
    expect(s.burstDps / handBurst(s, 2.5, 0.37, 2.9)).toBeCloseTo(1, 3);
  });
  it("Tiberon Prime Auto (default) FR 8.33; Burst 3/(0.2+2x0.08)=8.333; Semi-Auto FR 5 at 42%/3.4x", () => {
    const t = w("tiberon_prime");
    expect(getAlternateModes(t).map((m) => m.label)).toEqual(["Burst", "Semi-Auto"]);
    const d = calc(t);
    expect(d.effectiveFireRate).toBeCloseTo(8.33, 6);
    const b = calc(applyAlternateMode(t, 0));
    expect(b.effectiveFireRate).toBeCloseTo(3 / 0.36, 4);
    expect(b.burstDps / handBurst(b, 3 / 0.36, 0.28, 3)).toBeCloseTo(1, 3);
    const s = calc(applyAlternateMode(t, 1));
    expect(s.effectiveFireRate).toBeCloseTo(5, 6);
    expect(s.totalDamage).toBeCloseTo(d.totalDamage, 6); // same 48 dmg paper
    expect(s.burstDps / handBurst(s, 5, 0.42, 3.4)).toBeCloseTo(1, 3);
  });
});

describe("two-mode Hind (Burst default + Semi-Auto alt fire)", () => {
  it("Burst (default): 5 / (1/5 + 4 x 0.12) = 7.3529 shots/s", () => {
    const s = calc(w("hind"));
    expect(s.effectiveFireRate).toBeCloseTo(5 / 0.68, 4);
  });
  it("Semi-Auto: 60 dmg (12/12/36), FR 2.5 (burst timing off), 15%/2x, 10% status", () => {
    const h = w("hind");
    expect(getAlternateModes(h)).toHaveLength(1);
    const m = applyAlternateMode(h);
    expect([m.damage, m.impact, m.puncture, m.slash]).toEqual([60, 12, 12, 36]);
    const s = calc(m);
    expect(s.effectiveFireRate).toBeCloseTo(2.5, 6);
    expect(s.statusChance).toBeCloseTo(0.1, 6);
    expect(s.burstDps / handBurst(s, 2.5, 0.15, 2)).toBeCloseTo(1, 3);
  });
  it("base Tiberon stays single-mode Burst", () => {
    expect(weaponHasAlternateMode(w("tiberon"))).toBe(false);
  });
});

describe("applyAlternateMode index", () => {
  it("defaults to index 0 and leaves the weapon unchanged out of range", () => {
    const k = w("kuva_hind");
    expect(applyAlternateMode(k)).toEqual(applyAlternateMode(k, 0));
    expect(applyAlternateMode(k, 2)).toBe(k);
    const st = w("staticor");
    expect(applyAlternateMode(st, 1)).toBe(st);
  });
});
