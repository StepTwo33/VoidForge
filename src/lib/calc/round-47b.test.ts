import { describe, expect, it } from "vitest";
import { warframesMap } from "@/data/warframes";
import { helminthAbilitiesMap } from "@/data/helminth";
import { resolveAbilityHitDamage } from "@/lib/calc/ability-ttk";
import { computeBansheeSilencePassive } from "@/lib/codex/ability-misc-stats";

// Round 47b — Jason's in-game screenshots beat the wiki.
describe("Round 47b: Nova Null Star (in-game: 300 dmg, 12 particles, 5% DR, 90% cap, 10 m)", () => {
  for (const id of ["nova", "nova_prime"]) {
    it(`${id} Null Star max-rank values`, () => {
      const ns = warframesMap.get(id)!.abilities.find((a) => a.name === "Null Star")!;
      expect(ns.damage).toBe(300);
      expect(ns.range).toBe(10);
      expect(ns.damageType).toBe("Blast");
      expect(ns.miscStats).toMatchObject({ particles: 12, damageReductionPerParticle: 0.05, drCap: 0.9 });
      expect(resolveAbilityHitDamage(ns, 1)).toBe(300);
      expect(resolveAbilityHitDamage(ns, 2)).toBe(600);
    });
  }

  it("Helminth Null Star shares the 300 damage, keeps its 75% DR cap", () => {
    const h = helminthAbilitiesMap.get("subsume_nova")!;
    expect(h.damage).toBe(300);
    expect(h.range).toBe(10);
    expect(h.miscStats).toMatchObject({ particles: 12, damageReductionPerParticle: 0.05, drCap: 0.75 });
  });
});

describe("Round 47b: Banshee passive radius (in-game tooltip: within a 20m radius)", () => {
  it("puncture radius is 20 m", () => {
    expect(computeBansheeSilencePassive().punctureRadiusM).toBe(20);
  });
  for (const id of ["banshee", "banshee_prime"]) {
    it(`${id} passive text says 20m`, () => {
      const p = warframesMap.get(id)!.passive ?? "";
      expect(p).toContain("within 20m");
      expect(p).not.toContain("10m");
    });
  }
});
