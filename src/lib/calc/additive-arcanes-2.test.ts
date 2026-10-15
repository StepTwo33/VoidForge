import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { allArcanes } from "@/data/arcanes";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

// wiki: Blade Charger, Primary Charger, Melee Retaliation, Primary Bulwark, Primary Plated Round
// and Arachne all stack additively with base damage mods (Serration / Pressure Point).
const arc = (id: string) => allArcanes.find((a) => a.id === id)!;
const w = (id: string) => allWeapons.find((x) => x.id === id)!;
const slot = (id: string) => [{ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: 0 }];
const sim = { ...DEFAULT_SIM_PARAMS, arcaneStacks: 99 };

describe("additive damage arcanes (round 3)", () => {
  it("Primary Charger R5 (+300%) + Serration (+165%) on Braton Prime 35: 35 × 5.65", () => {
    const s = calculateWeaponBuildWithArcanes(w("braton_prime"), slot("serration_r3"), modsMap, [arc("arcane_primary_charger")], undefined, sim);
    expect(s.totalDamage).toBeCloseTo(35 * (1 + 1.65 + 3), 6);
  });
  it("Blade Charger R5 (+300%) + Pressure Point (+120%): base × 5.2, not × 2.2 × 4", () => {
    const base = calculateWeaponBuild(w("nikana_prime"), [], modsMap).totalDamage;
    const s = calculateWeaponBuildWithArcanes(w("nikana_prime"), slot("pressure_point_r3"), modsMap, [arc("arcane_blade_charger")], undefined, sim);
    expect(s.totalDamage).toBeCloseTo(base * (1 + 1.2 + 3), 6);
  });
  it("Primary Bulwark at 1500 armor (+500% R5) + Serration: 35 × (1 + 1.65 + 5)", () => {
    const s = calculateWeaponBuildWithArcanes(w("braton_prime"), slot("serration_r3"), modsMap, [arc("primary_bulwark")], undefined, { ...sim, warframeArmor: 1500 });
    expect(s.totalDamage).toBeCloseTo(35 * (1 + 1.65 + 5), 6);
  });
});
