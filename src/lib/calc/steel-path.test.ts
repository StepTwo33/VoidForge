import { describe, expect, it } from "vitest";
import { scaleEnemyPools, STEEL_PATH_HEALTH_MULT, STEEL_PATH_SHIELD_MULT } from "@/lib/calc/ttk";
import { ENEMY_TYPES } from "@/data/enemies";

describe("Steel Path enemy pools", () => {
  const lancer = ENEMY_TYPES.find((e) => e.id === "lancer")!;
  const crewman = ENEMY_TYPES.find((e) => e.id === "crewman")!;

  it("multiplies health by 2.5 when steelPath is on", () => {
    const normal = scaleEnemyPools(lancer, 100);
    const sp = scaleEnemyPools(lancer, 100, { steelPath: true });
    expect(sp.health / normal.health).toBeCloseTo(STEEL_PATH_HEALTH_MULT, 8);
    expect(sp.armor).toBeCloseTo(normal.armor, 8);
  });

  it("multiplies shields by 2.5 when steelPath is on", () => {
    const normal = scaleEnemyPools(crewman, 100);
    const sp = scaleEnemyPools(crewman, 100, { steelPath: true });
    expect(sp.shield / normal.shield).toBeCloseTo(STEEL_PATH_SHIELD_MULT, 8);
  });
});
