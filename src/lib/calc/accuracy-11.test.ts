import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { calculateTTK, ENEMY_TYPES } from "@/lib/calc/ttk";

const build = (id: string, mods: string[] = []) =>
  calculateWeaponBuild(
    enrichWeapon(allWeapons.find((x) => x.id === id)!),
    mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
  );
const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;
const gunner = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;

describe("Beam multishot: status DoT scales with the per-beam multishot factor (wiki Multishot, both wikis)", () => {
  it("Amprex + Split Chamber: factor 1 + 0.9 = 1.9; Quanta keeps 2 innate beams, factor 1.9", () => {
    expect(build("amprex", ["split_chamber_r3"]).continuousMultishotFactor).toBeCloseTo(1.9, 9);
    expect(build("quanta", ["split_chamber_r3"]).continuousMultishotFactor).toBeCloseTo(1.9, 9);
  });
  it("non-beams and Phage (real extra beams) have no factor", () => {
    expect(build("braton_prime", ["split_chamber_r3"]).continuousMultishotFactor).toBeUndefined();
    expect(build("phage").continuousMultishotFactor).toBeUndefined();
  });
  it("Amprex Split + Vigilante vs heavy_gunner L100: TTK 547.0 → 295.5 s (Electricity DoT ×2.05)", () => {
    expect(calculateTTK(build("amprex", ["split_chamber_r3", "vigilante_armaments"]), gunner, 100).ttk)
      .toBeCloseTo(295.53, 1);
  });
  it("unmodded beam (factor 1) unchanged: Amprex vs lancer L30", () => {
    const s = build("amprex");
    expect(s.continuousMultishotFactor).toBe(1);
    expect(calculateTTK(s, lancer, 30).ttk).toBe(calculateTTK({ ...s, continuousMultishotFactor: undefined }, lancer, 30).ttk);
  });
});

import { simulateDiscreteTTK, scaleEnemyPools } from "@/lib/calc/ttk";
import { simInputsToCalculatedStats } from "@/lib/calc/damage-sim";
import { enemyDamageTypeMultiplier } from "@/lib/calc/ttk";

describe("Heat: one consolidated pool, every proc refreshes all stacks (wiki Heat Damage, both wikis)", () => {
  // 100 Heat/shot, 1 shot/s, 100% status, no crit, no armor/shields.
  const stats = simInputsToCalculatedStats(
    {
      dmgTypes: { heat: 100 }, fireRate: 1, critChance: 0, critMulti: 1, multishot: 1,
      statusChance: 1, magazine: 1000, reloadTime: 1, statusDamageBonus: 0,
      headshotDamageBonus: 0, factionBonuses: {}, applyHeadshots: false,
    },
    "Grineer",
  );
  const mkEnemy = (hp: number) => {
    const base = { id: "t", name: "T", faction: "Grineer", baseHealth: 1, baseArmor: 0, baseShield: 0,
      healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none", kind: "unit" } as never;
    const per = scaleEnemyPools(base, 1).health;
    return { ...(base as object), baseHealth: hp / per } as never;
  };
  it("procs at t=0..9 → tick at t=k carries k stacks; by t=10: 10 hits + Σk·tick = 1000m + 5500m", () => {
    const m = enemyDamageTypeMultiplier(mkEnemy(1), "heat");
    // tick per stack = 0.5 × 100 × (1 + innate heat share 1.0) = 100
    // independent stacks would give only 1000m + 4500m by t=10 (cap 6 live stacks)
    expect(simulateDiscreteTTK(stats, mkEnemy(6400 * m), 1).ttk).toBeCloseTo(10, 6);
    expect(simulateDiscreteTTK(stats, mkEnemy(6600 * m), 1).ttk).toBeGreaterThan(10);
  });
});

describe("Heat armor strip: proc-rate landing, 0.5 s ramp, Status Duration (wiki Heat Damage)", () => {
  it("low per-shot Heat chance still strips once a proc lands (old >0.05/shot gate removed): Braton Prime + Hellfire vs heavy_gunner L100 265.2 → 99.9 s", () => {
    expect(calculateTTK(build("braton_prime", ["hellfire_r3"]), gunner, 100).ttk).toBeCloseTo(99.89, 1);
  });
  it("Ignis Wraith unmodded vs heavy_gunner L100: 271.4 → 67.4 s", () => {
    expect(calculateTTK(build("ignis_wraith"), gunner, 100).ttk).toBeCloseTo(67.4, 1);
  });
});
