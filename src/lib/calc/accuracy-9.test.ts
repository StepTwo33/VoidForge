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
