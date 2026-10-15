import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";
import { DEFAULT_SIM_PARAMS, type SimulationParams } from "@/lib/types";

const build = (id: string, mods: string[] = [], sim: Partial<SimulationParams> = {}) =>
  calculateWeaponBuild(
    enrichWeapon(allWeapons.find((x) => x.id === id)!),
    mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i })),
    modsMap,
    undefined,
    { ...DEFAULT_SIM_PARAMS, ...sim },
  );

describe("R7-1: Galvanized / CO per-status bonus is direct-hit only (both wikis)", () => {
  it("Kuva Zarr + Galvanized Aptitude (2 stacks, 4 statuses): radial unchanged vs unmodded-equivalent", () => {
    const g = build("kuva_zarr", ["galvanized_aptitude"], { killStacks: 2, statusTypesOnTarget: 4 });
    const plain = build("kuva_zarr", ["galvanized_aptitude"], { killStacks: 0, statusTypesOnTarget: 0 });
    // Galv Aptitude: +40%/status/stack → direct ×(1+3.2)=4.2; radial must stay at plain value.
    expect(g.radialBurstDps!).toBeCloseTo(plain.radialBurstDps!, 6);
    expect(g.totalDamage / plain.totalDamage).toBeCloseTo(4.2, 2);
  });
});

describe("R7-2 + R7-7: DoTs hit shields; Magnetic amplifies shields (wiki Magnetic, both wikis)", () => {
  it("Magnetic multiplier: 1 stack ×2, +0.25/stack, 10 stacks ×4.25 (+325%), capped", async () => {
    const { magneticShieldMultiplier: m } = await import("@/lib/calc/ttk");
    expect(m(0)).toBe(1);
    expect(m(1)).toBe(2);
    expect(m(5)).toBe(3);
    expect(m(10)).toBe(4.25);
    expect(m(14)).toBe(4.25);
  });
  it("Simulor (Magnetic) kills a shielded Crewman L30 faster than before (6.0 s → 2.67 s)", async () => {
    const { calculateTTK, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const crew = ENEMY_TYPES.find((e) => e.id === "crewman")!;
    expect(calculateTTK(build("simulor"), crew, 30).ttk).toBeCloseTo(2.6667, 3);
  });
});

describe("R7-4: level scaling starts at the enemy's wiki BaseLevel (both wikis)", () => {
  it("Corpus Tech (BL 15) at L15 has exactly base stats; L30 scales by q = 15, not 29", async () => {
    const { scaleEnemyPools, scaleHealth, scaleShield, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const tech = ENEMY_TYPES.find((e) => e.id === "corpus_tech")!;
    expect(tech.baseLevel).toBe(15);
    const p15 = scaleEnemyPools(tech, 15);
    expect(p15.health).toBe(700);
    expect(p15.shield).toBe(250);
    const p30 = scaleEnemyPools(tech, 30);
    expect(p30.health).toBeCloseTo(scaleHealth(700, 16, "Corpus"), 9);
    expect(p30.shield).toBeCloseTo(scaleShield(250, 16, "Corpus"), 9);
    expect(p30.health).toBeCloseTo(3969.66, 1); // was 13927.36 with q = 29
  });
  it("Heavy Gunner (BL 8) L30 health 5968.9 → 3456.1; BL-1 units unchanged", async () => {
    const { scaleEnemyPools, ENEMY_TYPES } = await import("@/lib/calc/ttk");
    const hg = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
    expect(scaleEnemyPools(hg, 30).health).toBeCloseTo(3456.08, 1);
    const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;
    expect(lancer.baseLevel).toBeUndefined();
  });
});
