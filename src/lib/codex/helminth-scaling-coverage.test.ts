import { describe, expect, it } from "vitest";
import { allHelminthAbilities as helminthAbilities } from "@/data/helminth";
import { hasHelminthScalingEntry, resolveAbilityScalingKey } from "./ability-scaling-registry";
import { scaleAbilityMiscStats } from "./ability-misc-stats";

const ROUND_15B = [
  "Shuriken", "Silence", "Dark Verse", "Radial Blind", "Tempest Barrage", "Banish", "Pull",
  "Mind Control", "Jade Stars", "Spellbind", "Shock", "Aquablades", "Airburst",
];

describe("Helminth scaling coverage (R6-8 / R15-2)", () => {
  it("every subsumed Warframe ability has its own helminth:: registry row", () => {
    const subsumes = helminthAbilities.filter((a) => a.id.startsWith("subsume_"));
    expect(subsumes.length).toBeGreaterThanOrEqual(65);
    const missing = subsumes.map((a) => a.name).filter((n) => !hasHelminthScalingEntry(n));
    expect(missing).toEqual([]);
  });

  it.each(ROUND_15B)("%s resolves to its helminth:: key", (name) => {
    expect(resolveAbilityScalingKey("excalibur", name, true)).toBe(`helminth::${name}`);
  });

  it("subsumed Pull keeps the altered max-rank target range (12.5 m, wiki 7.5/10/11/12.5)", () => {
    expect(helminthAbilities.find((a) => a.name === "Pull")?.range).toBe(12.5);
  });

  it("Shock chain range scales with Range; chain count does not", () => {
    const shock = helminthAbilities.find((a) => a.name === "Shock")!;
    const lines = scaleAbilityMiscStats(
      shock.miscStats as Record<string, unknown>,
      { strength: 1.3, duration: 1, range: 1.75, efficiency: 1 },
      { warframeId: "excalibur", abilityName: "Shock", helminth: true },
    );
    const chainRange = lines.find((l) => l.label.toLowerCase().includes("chain range"));
    const links = lines.find((l) => l.label.toLowerCase().includes("chain links"));
    // 15 m × 175% Range = 26.25 m
    expect(chainRange?.modified).toBe(true);
    expect(chainRange?.scaled).toBe("26.3m");
    expect(links?.modified).toBe(false);
  });

  it("fixed Misc values stay at base (Mind Control 750% initial damage bonus)", () => {
    const mc = helminthAbilities.find((a) => a.name === "Mind Control")!;
    const lines = scaleAbilityMiscStats(
      mc.miscStats as Record<string, unknown>,
      { strength: 2, duration: 2, range: 2, efficiency: 1 },
      { warframeId: "excalibur", abilityName: "Mind Control", helminth: true },
    );
    expect(lines.every((l) => !l.modified)).toBe(true);
  });
});
