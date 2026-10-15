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
