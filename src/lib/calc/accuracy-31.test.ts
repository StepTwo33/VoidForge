import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { modsMap } from "@/data/mods";

const slots = (ids: string[]) => ids.map((id, i) => ({ modId: id, rank: modsMap.get(id)!.maxRank, slotIndex: i }));
const build = (id: string, mods: string[] = []) =>
  calculateWeaponBuild(enrichWeapon(allWeapons.find((x) => x.id === id)!), slots(mods), modsMap);
const efr = (id: string) => build(id).effectiveFireRate;

// Round 31: charge times from the wiki Fire Rate page (charge-time list) and Module:Weapons/data.
// Formulas (wiki Fire Rate): bows / Epitaph 1 / (charge + reload); other charge weapons 1 / (charge + 1 / fire rate).
describe("Round 31: wiki charge times", () => {
  it("bows: Rakta Cernos 0.25, Cinta 1.5, Evensong 1.2, Nataruk 1.0 (charge + 0.6 reload)", () => {
    expect(efr("rakta_cernos")).toBeCloseTo(1 / (0.25 + 0.6), 4);
    expect(efr("cinta")).toBeCloseTo(1 / (1.5 + 0.6), 4);
    expect(efr("evensong")).toBeCloseTo(1 / (1.2 + 0.6), 4);
    expect(efr("nataruk")).toBeCloseTo(1 / (1.0 + 0.6), 4);
  });
  it("bows: burst = sustained (one arrow per reload)", () => {
    for (const id of ["rakta_cernos", "cinta", "evensong", "nataruk"]) {
      const s = build(id);
      expect(s.sustainedDps).toBeCloseTo(s.burstDps, 6);
    }
  });
  it("shotguns: Drakgoon 0.5 -> 1 / (0.5 + 0.3) = 1.25; Kuva Drakgoon 0.3 -> 1 / (0.3 + 0.3) = 1.667", () => {
    expect(efr("drakgoon")).toBeCloseTo(1 / (0.5 + 1 / 3.33), 4);
    expect(efr("kuva_drakgoon")).toBeCloseTo(1 / (0.3 + 0.3), 4);
  });
  it("rifles: Miter 0.75, Opticor 2.0, Opticor Vandal 0.6, Ferrox 0.5", () => {
    expect(efr("miter")).toBeCloseTo(1 / (0.75 + 0.4), 4);
    expect(efr("opticor")).toBeCloseTo(1 / (2 + 1), 4);
    expect(efr("opticor_vandal")).toBeCloseTo(1 / (0.6 + 0.5), 4);
    expect(efr("ferrox")).toBeCloseTo(1 / (0.5 + 0.75), 4);
  });
  it("Nagantaka is Semi-Auto 2.5/s (no charge) but keeps x2 for Bows on fire-rate mods", () => {
    expect(efr("nagantaka")).toBeCloseTo(2.5, 4);
    expect(modsMap.get("shred")!.description).toMatch(/x2 for Bows/);
    expect(build("nagantaka", ["shred"]).effectiveFireRate).toBeCloseTo(2.5 * 1.6, 3);
    const s = build("nagantaka"); // 9 bolts, 2.3 s reload: sustained below burst
    expect(s.sustainedDps).toBeCloseTo(s.burstDps * (9 / 2.5) / (9 / 2.5 + 2.3), 4);
  });
  it("Tenet Envoy is Auto 0.83/s with no charge time (not on the wiki charge-time list)", () => {
    expect(efr("tenet_envoy")).toBeCloseTo(0.8333, 4);
  });
  it("Opticor primary = charged shot: only the Charged Shot AoE; Epitaph primary has no explosion", () => {
    expect(build("opticor").radialAttacks?.map((r) => r.name)).toEqual(["Charged Shot AoE"]);
    expect(build("opticor_vandal").radialAttacks?.map((r) => r.name)).toEqual(["Charged Shot AoE"]);
    expect(build("epitaph").radialAttacks ?? []).toEqual([]);
    expect(build("epitaph_prime").radialAttacks ?? []).toEqual([]);
  });
});
