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

  it("Final Stand has the derived 0.75 s cast time on Styanax and Styanax Prime", () => {
    for (const id of ["styanax", "styanax_prime"]) {
      const fs = allWarframes.find((w) => w.id === id)!.abilities.find((a) => a.name === "Final Stand")!;
      expect(fs.castTime).toBe(0.75);
    }
  });
});
