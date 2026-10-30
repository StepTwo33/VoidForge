/**
 * Round 41 wiki fixes (wiki.warframe.com Module:Weapons/data + weapon pages), hand-worked.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { applyGravimagMode } from "@/lib/weapons/weapon-gravimag";
import { applyArbucepAttackMode } from "@/lib/weapons/weapon-arbucep-mode";
import { getWeaponRadialAttacks } from "@/lib/weapons/weapon-radial-utils";

const weapons = getEffectiveWeapons();
const byId = (id: string) => weapons.find((w) => w.id === id)!;

describe("Round 41 wiki fixes", () => {
  it("Glory primary: one 150 Heat 2 m AoE, counted once (was 150 direct + 150 radial)", () => {
    const s = calculateWeaponBuild(byId("glory"), [], modsMap);
    // 150 x 1.67/s x (1 + 0.15 x (2 - 1)) = 288.1 (was 432.1)
    expect(Math.abs(s.burstDps - 150 * 1.67 * 1.15) / (150 * 1.67 * 1.15)).toBeLessThan(0.002);
    expect(s.radialBurstDps).toBe(0);
    const row = s.radialAttacks?.find((r) => r.name === "Normal Attack");
    expect(row).toMatchObject({ totalDamage: 150, radius: 2, falloffReduction: 1, includedInDirect: true });
  });

  it("Arbucep explosion: 4 m with no AoE falloff (wiki Falloff 1500-2003 m / 200-270 m is shot range)", () => {
    const w = byId("arbucep");
    expect(getWeaponRadialAttacks(w)[0]).toMatchObject({ totalDamage: 114, radius: 4 });
    expect(getWeaponRadialAttacks(w)[0]?.falloffReduction).toBeUndefined();
    const atmo = applyGravimagMode(w);
    expect(getWeaponRadialAttacks(atmo)[0]).toMatchObject({ totalDamage: 228, radius: 4 });
    expect(getWeaponRadialAttacks(applyArbucepAttackMode(w, 3))[0]).toMatchObject({ gas: 114, radius: 4 });
    expect(getWeaponRadialAttacks(applyArbucepAttackMode(w, 3))[0]?.falloffReduction).toBeUndefined();
  });

  it("archgun trigger labels match the wiki: Cortege / Larkspur (Prime) Held, Mandonel Charge", () => {
    for (const id of ["cortege", "larkspur", "larkspur_prime"]) expect(byId(id).triggerType, id).toBe("Held");
    expect(byId("mandonel").triggerType).toBe("Charge");
  });

  it("label-only: Mandonel's primary numbers are unchanged by the Charge label (no charge time in data)", () => {
    const s = calculateWeaponBuild(byId("mandonel"), [], modsMap);
    expect(s.fireRate).toBeCloseTo(3, 6);
    expect(s.effectiveFireRate ?? s.fireRate).toBeCloseTo(3, 6);
  });

  it("Corinth / Prime: no Buckshot stand-in radial row (pellet falloff, not an AoE)", () => {
    for (const id of ["corinth", "corinth_prime"]) {
      expect(getWeaponRadialAttacks(byId(id)).map((r) => r.name), id).not.toContain("Buckshot");
    }
  });
});
