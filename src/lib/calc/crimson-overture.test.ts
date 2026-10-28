import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { allMods } from "@/data/mods";
import { incarnonDataMap } from "@/data/incarnon";
import { MAX_AMMO_EFFICIENCY } from "@/lib/calc/ammo-efficiency";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { resolveIncarnonActiveWeapon } from "@/lib/calc/incarnon-active-weapon";
import { mergeIncarnonStatChanges } from "@/lib/calc/weapon-stat-merges";
import { WIKI_INCARNON_EVOLUTIONS } from "@/data/incarnon-genesis-evolutions";

/**
 * Crimson Overture (Boltor + Dera Incarnon Genesis, EVO2).
 * wiki.warframe.com Boltor / Dera / Ammo, Hotfix 44.1.3 ("Was: +20% for 5s, stacks 4x. Now: +25%, stacks 3x.
 * Note: the increase to Base Damage is unchanged"):
 *   "Increase Base Damage by +X. On Kill: +25% Ammo Efficiency for 5s. Stacks up to 3x."
 *   Boltor X = 12 (Boltor) / 0 (Telos) / 0 (Prime);  Dera X = 8 (Dera) / 6 (Vandal).
 * Boltor / Dera pages: "Incarnon Form is not affected by Ammo Efficiency".
 */
const mods = new Map(allMods.map((m) => [m.id, m]));
const find = (id: string) => allWeapons.find((w) => w.id === id)!;
const dataFor = (id: string) => [...incarnonDataMap.values()].find((d) => d.variants?.includes(id)) ?? incarnonDataMap.get(id)!;

function build(id: string, evo: Record<number, number>, ae?: number) {
  const data = dataFor(id);
  const weapon = resolveIncarnonActiveWeapon(find(id), data, evo);
  const sc = { ...mergeIncarnonStatChanges(data, evo, id) };
  if (ae != null) sc.ammoEfficiency = ae;
  const formActive = evo[1] != null;
  return calculateWeaponBuild(weapon, [], mods, sc, undefined, formActive ? { incarnonFormActive: true } : undefined);
}

describe("Crimson Overture: wiki text and per-variant values", () => {
  it("text, stack math and variant damage match wiki.warframe.com / Hotfix 44.1.3", () => {
    const text = "On Kill: +25% Ammo Efficiency for 5s. Stacks up to 3x.";
    for (const key of ["boltor_incarnon", "dera_incarnon"]) {
      const evo = WIKI_INCARNON_EVOLUTIONS[key].find((e) => e.name === "Crimson Overture")!;
      expect(evo.description).toContain(text);
      expect(evo.tier).toBe(2);
      // 3 stacks × 25% = 75% = the Ammo Efficiency cap (not the old 4 × 20% = 80%).
      expect(evo.statChanges.ammoEfficiency).toBeCloseTo(3 * 0.25, 10);
      expect(evo.statChanges.ammoEfficiency).toBe(MAX_AMMO_EFFICIENCY);
    }
    const dmg = (id: string, slot: number) => mergeIncarnonStatChanges(dataFor(id), { 2: slot }, id)?.flatBaseDamage;
    expect([dmg("boltor", 1), dmg("telos_boltor", 1), dmg("boltor_prime", 1)]).toEqual([12, 0, 0]);
    expect([dmg("dera", 0), dmg("dera_vandal", 0)]).toEqual([8, 6]);
  });
});

describe("Crimson Overture: Boltor numbers (hand-worked)", () => {
  it("normal form: AE 75% → 1 ammo per 4 shots lengthens the 60-round magazine to 27.43 s", () => {
    const s = build("boltor", { 2: 1 });
    expect(s.ammoEfficiency).toBe(0.75);
    expect(s.magazine).toBe(60);
    // Boltor 25 + 12 = 37 damage; magazine time = 60 / (8.75 × 0.25) = 27.4286 s; reload 2.6 s.
    expect(s.totalDamage).toBeCloseTo(37, 5);
    const magTime = 60 / (8.75 * 0.25);
    expect(s.sustainedDps).toBeCloseTo((s.burstDps * magTime) / (magTime + 2.6), 1);
  });

  it("Incarnon Form is not affected by Ammo Efficiency: 160 charges at 10/s = 16 s, AE ignored", () => {
    const withCrimson = build("boltor", { 1: 0, 2: 1 });
    // Form 4 + 12 = 16 damage per projectile (wiki form: 4.00 per projectile, X = 12).
    expect(withCrimson.totalDamage).toBeCloseTo(16, 5);
    const magTime = 160 / 10;
    expect(withCrimson.sustainedDps).toBeCloseTo((withCrimson.burstDps * magTime) / (magTime + 2.6), 1);
    // Same sustained DPS whether or not the AE stat is present.
    const noAe = build("boltor", { 1: 0, 2: 1 }, 0);
    expect(noAe.sustainedDps).toBeCloseTo(withCrimson.sustainedDps, 8);
  });

  it("Telos / Prime: X = 0 so damage is untouched; AE still 75% on the normal form", () => {
    for (const id of ["telos_boltor", "boltor_prime"]) {
      const plain = build(id, {});
      const s = build(id, { 2: 1 });
      expect(s.totalDamage).toBeCloseTo(plain.totalDamage, 8);
      expect(s.ammoEfficiency).toBe(0.75);
      expect(s.sustainedDps).toBeGreaterThan(plain.sustainedDps);
    }
  });
});

describe("Crimson Overture: Dera numbers (hand-worked)", () => {
  it("normal form Dera: +8 base damage, AE 75% on a 45-round magazine", () => {
    const s = build("dera", { 2: 0 });
    expect(s.totalDamage).toBeCloseTo(38, 5); // 30 + 8
    const fr = find("dera").fireRate;
    const magTime = 45 / (fr * 0.25);
    expect(s.sustainedDps).toBeCloseTo((s.burstDps * magTime) / (magTime + s.reloadTime), 1);
  });

  it("Dera Vandal: +6 base damage; Incarnon Form ignores AE", () => {
    const plain = build("dera_vandal", {});
    expect(build("dera_vandal", { 2: 0 }).totalDamage).toBeCloseTo(plain.totalDamage + 6, 5);
    const a = build("dera_vandal", { 1: 0, 2: 0 });
    const b = build("dera_vandal", { 1: 0, 2: 0 }, 0);
    expect(a.sustainedDps).toBeCloseTo(b.sustainedDps, 8);
  });
});
