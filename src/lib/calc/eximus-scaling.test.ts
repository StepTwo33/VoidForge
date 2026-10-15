import { describe, expect, it } from "vitest";
import { eximusBasePools, eximusLevelFactor, scaleEnemyPools, scaleHealth } from "@/lib/calc/ttk";
import { ENEMY_TYPES } from "@/data/enemies";

// Hand-worked against wiki Enemy Level Scaling § Eximus.
describe("Eximus base health/shield increase", () => {
  it("level factor k: 1 @15, 1.25 @25, 2.5 @35, 4.5 @50, 6 @100+", () => {
    expect(eximusLevelFactor(10)).toBe(1);
    expect(eximusLevelFactor(25)).toBeCloseTo(1.25, 10);
    expect(eximusLevelFactor(35)).toBeCloseTo(2.5, 10);
    expect(eximusLevelFactor(50)).toBeCloseTo(4.5, 10);
    expect(eximusLevelFactor(100)).toBeCloseTo(6, 10);
    expect(eximusLevelFactor(500)).toBe(6);
  });
  it("Heavy Gunner (300 hp, armor) @100: max(330, 0.25·1200·6) = 1800 base", () => {
    expect(eximusBasePools({ baseHealth: 300, baseShield: 0, baseArmor: 500 }, 100).health).toBeCloseTo(1800, 10);
  });
  it("no shields/armor uses 0.375: Charger (80 hp) @1 = max(88, 0.375·980) = 367.5", () => {
    expect(eximusBasePools({ baseHealth: 80, baseShield: 0, baseArmor: 0 }, 1).health).toBeCloseTo(367.5, 10);
  });
  it("shields: 1.1× at low level, base·k later (250 @50 → 1125)", () => {
    const e = { baseHealth: 200, baseShield: 250, baseArmor: 0 };
    expect(eximusBasePools(e, 10).shield).toBeCloseTo(275, 10);
    expect(eximusBasePools(e, 50).shield).toBeCloseTo(1125, 10);
  });
  it("scaleEnemyPools applies the boost before faction scaling (Eximus Heavy Gunner @100)", () => {
    const e = ENEMY_TYPES.find((x) => x.id === "eximus_heavy_gunner")!;
    expect(scaleEnemyPools(e, 100).health).toBeCloseTo(scaleHealth(1800, 100, "Grineer"), 6);
  });
});
