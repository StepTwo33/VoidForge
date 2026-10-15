import { describe, it, expect } from "vitest";
import { customWeapons } from "@/data/custom-items";
import { getWeaponRadialAttacks } from "@/lib/weapons/weapon-radial-utils";
import { COMPANION_CLAW_BY_ID } from "@/lib/weapons/companion-weapons";

const w = (id: string) => customWeapons.find((x) => x.id === id)!;

// Wiki Module:Weapons/data/companion (checked against the fandom copy of the module).
describe("companion weapon data", () => {
  it("Helstrum: 4.95 I + 4.05 P missile, 30 explosion, 5% / 1.5x / 30%, FR 0.25", () => {
    const h = w("helstrum");
    expect([h.damage, h.impact, h.puncture, h.criticalChance, h.criticalMultiplier, h.statusChance, h.fireRate, h.magazine, h.reloadTime])
      .toEqual([9, 4.95, 4.05, 0.05, 1.5, 0.3, 0.25, 80, 2]);
    const r = getWeaponRadialAttacks(h);
    expect(r[0]!.totalDamage).toBe(30);
    expect(r[0]!.heat! + r[0]!.impact!).toBe(30);
  });

  it("Multron: 10 Puncture dart + 100 Blast radial, 22% SC, FR 2.5", () => {
    const m = w("multron");
    expect([m.damage, m.puncture, m.statusChance, m.fireRate, m.magazine]).toEqual([10, 10, 0.22, 2.5, 3]);
    expect(getWeaponRadialAttacks(m)[0]!.blast).toBe(100);
  });

  it("Burst Laser Prime: 25 total = 2.5 + 21.25 + 1.25, 20% / 2.3x / 15%", () => {
    const b = w("burst_laser_prime");
    expect(b.impact + b.puncture + b.slash).toBe(25);
    expect([b.damage, b.criticalChance, b.criticalMultiplier, b.statusChance, b.magazine]).toEqual([25, 0.2, 2.3, 0.15, 15]);
  });

  it("Medjay Claws are Slash + Viral (not Radiation)", () => {
    const c = w("medjay_claws");
    expect(c.viral).toBe(175);
    expect(c.radiation).toBeUndefined();
    expect(c.statusChance).toBe(0.2);
  });

  it("Helminth Claws exist and resolve for the Helminth Charger", () => {
    const c = w(COMPANION_CLAW_BY_ID.helminth_charger!);
    expect([c.damage, c.slash, c.toxin, c.criticalChance, c.criticalMultiplier, c.statusChance]).toEqual([250, 200, 50, 0.075, 2.5, 0.25]);
  });
});
