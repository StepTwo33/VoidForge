import { abilityToPseudoWeaponStats } from "@/lib/calc/ability-ttk";
import type { WarframeCalculatedStats } from "@/lib/types";
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWarframes } from "@/data/warframes";
import { calculateWarframeBuild } from "@/lib/calc/calculator";

const styanax = allWarframes.find((w) => w.id === "styanax")!;

describe("Round 54 warframe stat folding", () => {
  it("Natural Talent R4 gives +50% cast speed; Calm & Frenzy (conditional) is ignored", () => {
    const s = calculateWarframeBuild(styanax, [{ modId: "natural_talent", rank: 4, slotIndex: 0 }], modsMap);
    expect(s.castingSpeedBonus).toBeCloseTo(50);
    expect(calculateWarframeBuild(styanax, [], modsMap).castingSpeedBonus).toBe(0);
  });

  it("Fast Deflection R5 → +90% recharge and 45% shorter delay; Preparation R10 → 100% starting energy", () => {
    const s = calculateWarframeBuild(
      styanax,
      [
        { modId: "fast_deflection_r3", rank: 5, slotIndex: 0 },
        { modId: "preparation_r10", rank: 10, slotIndex: 1 },
      ],
      modsMap,
    );
    expect(s.shieldRechargeBonus).toBeCloseTo(0.9);
    expect(s.shieldRechargeDelayReduction).toBeCloseTo(0.45);
    expect(s.startingEnergyPct).toBeCloseTo(100, 0);
  });

  // Round 54b: Jason's in-game Styanax tooltips (max rank, no mods) are the source of truth.
  // No cast time is shown for Rally Point or Final Stand, so neither carries castTime.
  it("Rally Point and Final Stand match the in-game tooltips (no cast time)", () => {
    for (const id of ["styanax", "styanax_prime"]) {
      const abilities = allWarframes.find((w) => w.id === id)!.abilities;
      const rally = abilities.find((a) => a.name === "Rally Point")!;
      expect(rally).toMatchObject({ energyCost: 75, duration: 30, radius: 30 });
      expect(rally.miscStats).toMatchObject({ shieldsPerKill: 50, energyRegen: 3 });
      expect(rally.castTime).toBeUndefined();
      const fs = abilities.find((a) => a.name === "Final Stand")!;
      expect(fs).toMatchObject({
        energyCost: 100,
        directDamage: 1500,
        damageType: "Impact",
        aoeDamage: 1500,
        aoeDamageType: "Blast",
        radius: 6,
      });
      expect(fs.miscStats?.javelins).toBe(30);
      expect(fs.castTime).toBeUndefined();
    }
  });

  it("Final Stand TTK splits the hit (Impact) and the explosion (Blast)", () => {
    const fs = allWarframes.find((w) => w.id === "styanax")!.abilities.find((a) => a.name === "Final Stand")!;
    const r = abilityToPseudoWeaponStats(fs, { abilityStrength: 1 } as WarframeCalculatedStats)!;
    expect(r.stats.impact).toBe(1500);
    expect(r.stats.elements).toEqual([{ type: "blast", value: 1500 }]);
    expect(r.stats.totalDamage).toBe(3000);
  });
});
