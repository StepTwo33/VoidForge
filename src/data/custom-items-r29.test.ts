/** R29: wiki.warframe.com page values for custom-item weapons (Afentis Prime, Vizier Claws, Deth Machine Rifle). */
import { describe, expect, it } from "vitest";
import { getEffectiveWeaponsMap } from "@/lib/weapons/effective-data";

const w = (id: string) => {
  const x = getEffectiveWeaponsMap().get(id);
  if (!x) throw new Error(id);
  return x;
};

describe("R29 custom-item weapon data", () => {
  it("Afentis Prime: Semi 2.6x crit, 0.833 fire rate, Radial Attack 800 Blast + 250 Heat", () => {
    const a = w("afentis_prime");
    expect(a.criticalMultiplier).toBe(2.6);
    expect(a.fireRate).toBeCloseTo(0.833, 3);
    expect(a.radialAttacks?.[0]).toMatchObject({ blast: 800, heat: 250, totalDamage: 1050, radius: 5.5, falloffReduction: 0.5, explosionDelay: 0.4 });
  });
  it("Vizier Claws deal Impact + Corrosive (not Toxin)", () => {
    const v = w("vizier_claws");
    expect(v.corrosive).toBe(150);
    expect(v.toxin ?? 0).toBe(0);
  });
  it("Deth Machine Rifle (+Prime) physical split is 10/5/85", () => {
    const d = w("deth_machine_rifle");
    expect([d.impact, d.puncture, d.slash]).toEqual([1.5, 0.75, 12.75]);
    const p = w("deth_machine_rifle_prime");
    expect([p.impact, p.puncture, p.slash]).toEqual([2, 1, 17]);
  });
});
