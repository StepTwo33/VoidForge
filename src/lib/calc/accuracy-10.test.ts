import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";

const build = (id: string) =>
  calculateWeaponBuild(enrichWeapon(allWeapons.find((x) => x.id === id)!), [], modsMap);

describe("Kuva Bramma is a bow: 1 / (charge time + reload) (wiki Fire Rate)", () => {
  it("1 / (0.4 + 0.6) = 1.0 shots/s (was 1 / (0.4 + 1/0.6667) = 0.526)", () => {
    expect(build("kuva_bramma").effectiveFireRate).toBeCloseTo(1 / (0.4 + 0.6), 4);
  });
});

import { ENEMY_TYPES } from "@/lib/calc/ttk";
import { runDamageSim } from "@/lib/calc/damage-sim";

describe("Damage sim: Viral amplifies Heat / Toxin DoT ticks (wiki Viral Damage, matches ttk.ts)", () => {
  const gunner = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
  const base = {
    fireRate: 5, critChance: 0, critMulti: 2, multishot: 1, statusChance: 1, magazine: 30,
    reloadTime: 2, statusDamageBonus: 0, headshotDamageBonus: 0, factionBonuses: {}, applyHeadshots: false,
  };
  it("Viral 100 + Toxin 100 @ L100: 2.5 toxin procs/s × 6 ticks × (200 × 0.5) × (1 − 0.9 DR) × 4.25 = 637.5", () => {
    const r = runDamageSim({ ...base, dmgTypes: { viral: 100, toxin: 100 } }, gunner, 100)!;
    expect(r.viralMult).toBeCloseTo(4.25, 6);
    expect(r.armorDR).toBeCloseTo(0.9, 6);
    expect(r.toxinDotDps).toBeCloseTo(2.5 * 6 * 100 * 0.1 * 4.25, 6); // was 150
  });
  it("Viral + Heat: heat DoT is exactly 4.25× the no-Viral value (545.41 → 2317.97)", () => {
    const vh = runDamageSim({ ...base, dmgTypes: { viral: 100, heat: 100 } }, gunner, 100)!;
    expect(vh.heatDotDps).toBeCloseTo(545.4058453981607 * 4.25, 4);
  });
  it("Heat without Viral unchanged (545.41)", () => {
    const h = runDamageSim({ ...base, dmgTypes: { heat: 100 } }, gunner, 100)!;
    expect(h.viralMult).toBe(1);
    expect(h.heatDotDps).toBeCloseTo(545.4058453981607, 6);
  });
});

describe("Bows: sustained DPS = burst DPS including radial explosions (reload is in the bow cycle)", () => {
  for (const id of ["lenz", "prisma_lenz", "kuva_bramma", "proboscis_cernos", "evensong"]) {
    it(`${id}: sustained === burst (radial no longer re-applies mag/reload factor)`, () => {
      const s = build(id);
      expect(s.radialBurstDps ?? 0).toBeGreaterThan(0);
      expect(s.sustainedDps).toBeCloseTo(s.burstDps, 6);
    });
  }
  it("Lenz: 606.3 burst = sustained (sustained was 321.5; 411.8 before R43 full radial on the direct hit)", () => {
    expect(build("lenz").sustainedDps).toBeCloseTo(606.3, 0);
  });
});
