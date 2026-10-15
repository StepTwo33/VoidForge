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
