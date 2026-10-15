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
      .toBeCloseTo(280.17, 1); // 295.53 before Heavy Gunner BaseLevel 8 (accuracy-15 R7-4)
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
  it("low per-shot Heat chance still strips once a proc lands (old >0.05/shot gate removed): Braton Prime + Hellfire vs heavy_gunner L100 265.2 → 99.9 s (89.9 s with Puncture crit, R6-6)", () => {
    expect(calculateTTK(build("braton_prime", ["hellfire_r3"]), gunner, 100).ttk).toBeCloseTo(86.93, 1); // 89.91 before BaseLevel 8 (R7-4)
  });
  it("Ignis Wraith unmodded vs heavy_gunner L100: 271.4 → 67.4 s", () => {
    expect(calculateTTK(build("ignis_wraith"), gunner, 100).ttk).toBeCloseTo(65.4, 1); // 67.4 before BaseLevel 8 (R7-4)
  });
});

describe("Cold / Puncture crit received in the TTK sim (wiki Cold, Puncture; both wikis)", () => {
  const mk = (dmgTypes: Record<string, number>, critChance: number, critMulti: number) =>
    simInputsToCalculatedStats(
      {
        dmgTypes, fireRate: 1, critChance, critMulti, multishot: 1, statusChance: 1,
        magazine: 1000, reloadTime: 1, statusDamageBonus: 0, headshotDamageBonus: 0,
        factionBonuses: {}, applyHeadshots: false,
      },
      "Grineer",
    );
  const enemyHp = (hp: number) => {
    const base = { id: "t", name: "T", faction: "Grineer", baseHealth: 1, baseArmor: 0, baseShield: 0,
      healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none", kind: "unit" } as never;
    return { ...(base as object), baseHealth: hp / scaleEnemyPools(base, 1).health } as never;
  };
  it("Puncture: +5% CC per stack (cap 5) → shots 1..6 deal 100m × (1, 1.05, 1.10, 1.15, 1.20, 1.25) at CD 2", () => {
    const s = mk({ puncture: 100 }, 0, 2);
    const m = enemyDamageTypeMultiplier(enemyHp(1), "puncture");
    expect(simulateDiscreteTTK(s, enemyHp(674 * m), 1).shotsToKill).toBe(6);
    expect(simulateDiscreteTTK(s, enemyHp(676 * m), 1).shotsToKill).toBe(7);
  });
  it("Cold: +0.1 CD at 1 stack, +0.05 per further stack → 100% CC, CD 2: shots deal 100m × (2, 2.1, 2.15)", () => {
    const s = mk({ cold: 100 }, 1, 2);
    const m = enemyDamageTypeMultiplier(enemyHp(1), "cold");
    expect(simulateDiscreteTTK(s, enemyHp(624 * m), 1).shotsToKill).toBe(3);
    expect(simulateDiscreteTTK(s, enemyHp(626 * m), 1).shotsToKill).toBe(4);
  });
  it("Hek (Puncture-heavy) vs lancer L100: 112.8 → 93.2 s", () => {
    expect(calculateTTK(build("hek"), lancer, 100).ttk).toBeCloseTo(93.16, 1);
  });
});
