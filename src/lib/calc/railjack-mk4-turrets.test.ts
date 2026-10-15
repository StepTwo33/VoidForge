import { describe, it, expect } from "vitest";
import { findRailjackArmament } from "@/data/railjack";
import { computeRailjackArmamentStats } from "@/lib/calc/railjack-calculator";

const zero = { turretDamageBonus: 0, turretCritBonus: 0, turretCritDmgBonus: 0, ordnanceDamageBonus: 0 };
const a = (id: string) => findRailjackArmament(id)!;

// Wiki Module:Weapons/data/railjack "<House> <Turret> Mk IV" / "<Turret> Mk III".
describe("Railjack Mk IV turrets use wiki Mk IV stats", () => {
  it("Zetki Apoc Mk IV: 1122 dmg, 33% CC, 13% SC (was Mk III 30% / 10%)", () => {
    const t = a("zetki_apoc_mk4");
    expect([t.damage, t.critChance, t.statusChance, t.critMultiplier, t.fireRate]).toEqual([1122, 0.33, 0.13, 2, 8.33]);
  });

  it("Laith Mk IV = per-pellet x 8: Lavan 523 x 8 = 4184 (was 3120 x 1.5 = 4680)", () => {
    expect(a("lavan_laith_mk4").damage).toBe(4184);
    expect(a("lavan_laith_mk4").critChance).toBe(0.31);
    expect(a("vidar_laith_mk4").damage).toBe(3864); // 483 x 8
    expect(a("zetki_laith_mk4").damage).toBe(5280); // 660 x 8
  });

  it("Glazio Mk IV is 3476 for every house (810 + 810 + 1856)", () => {
    for (const h of ["lavan", "vidar", "zetki"]) expect(a(`${h}_glazio_mk4`).damage).toBe(3476);
    expect(a("vidar_glazio_mk4").critChance).toBe(0.51);
  });

  it("Mk IV paper DPS by hand: Zetki Apoc 1122 x (1 + 0.33 x (2 - 1)) x 8.33", () => {
    const s = computeRailjackArmamentStats(a("zetki_apoc_mk4"), zero);
    expect(s.estimatedDps).toBe(Math.round(1122 * 1.33 * 8.33)); // 12431
  });

  it("Sigma Apoc / Carcinnox = unhoused Mk III like the other Sigma turrets", () => {
    const apoc = a("sigma_apoc");
    expect([apoc.damage, apoc.critChance, apoc.critMultiplier, apoc.statusChance, apoc.fireRate]).toEqual([618, 0.2, 2, 0.1, 8.33]);
    const carc = a("sigma_carcinnox");
    expect([carc.damage, carc.critChance, carc.critMultiplier, carc.statusChance, carc.fireRate]).toEqual([392, 0.13, 2, 0.24, 15]);
  });
});
