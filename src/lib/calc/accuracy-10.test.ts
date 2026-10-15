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
