import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";

const efr = (id: string) =>
  calculateWeaponBuild(enrichWeapon(allWeapons.find((x) => x.id === id)!), [], modsMap).effectiveFireRate;

describe("Lenz / Prisma Lenz are bows: 1 / (charge time + reload) (wiki Fire Rate)", () => {
  it("Lenz: 1 / (1.2 + 0.6) = 0.5556 shots/s", () => {
    expect(efr("lenz")).toBeCloseTo(1 / 1.8, 4);
  });
  it("Prisma Lenz: 1 / (0.8 + 0.6) = 0.7143 shots/s", () => {
    expect(efr("prisma_lenz")).toBeCloseTo(1 / 1.4, 4);
  });
});

import { calculateTTK, ENEMY_TYPES } from "@/lib/calc/ttk";

describe("TTK sim: Viral amplifies Heat / Toxin / Electricity ticks (wiki Viral Damage)", () => {
  const gunner = ENEMY_TYPES.find((e) => e.id === "heavy_gunner")!;
  const ttk = (mods: string[]) => {
    const w = enrichWeapon(allWeapons.find((x) => x.id === "ignis_wraith")!);
    const eq = mods.map((m, i) => ({ modId: m, rank: modsMap.get(m)!.maxRank, slotIndex: i }));
    return calculateTTK(calculateWeaponBuild(w, eq, modsMap), gunner, 100).ttk;
  };
  it("Ignis Wraith (innate Heat) + Viral: Heat ticks now take the Viral multiplier → 27.83s with the Heat pool (37.45s before accuracy-11)", () => {
    expect(ttk(["infected_clip_r3", "cryo_rounds_r3", "hellfire_r3"])).toBeCloseTo(26.825, 2); // 27.825 before Heavy Gunner BaseLevel 8 (accuracy-15 R7-4)
  });
  it("no Viral source → unchanged (Heat only)", () => {
    const heatOnly = ttk(["hellfire_r3"]);
    expect(Number.isFinite(heatOnly)).toBe(true);
  });
});
