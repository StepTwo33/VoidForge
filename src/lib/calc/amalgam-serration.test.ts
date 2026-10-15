import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { allWarframes } from "@/data/warframes";
import { calculateWeaponBuild, calculateWarframeBuild } from "@/lib/calc/calculator";
import { getModStatDisplayLines } from "@/lib/display/mod-display";

const modsMap = new Map(allMods.map((m) => [m.id, m]));

describe("Amalgam Serration", () => {
  const amalgam = allMods.find((m) => m.id === "amalgam_serration")!;

  it("has damage + sprintSpeed only (no slideSpeed)", () => {
    expect(amalgam).toBeDefined();
    expect(amalgam.stats.damage).toBeGreaterThan(0);
    expect(amalgam.stats.sprintSpeed).toBeCloseTo(25 / 11, 5);
    expect(amalgam.stats.slideSpeed).toBeUndefined();
  });

  it("applies +25% sprint speed at max rank (wiki) on weapon stats", () => {
    const weapon = allWeapons.find((w) => w.category === "rifle" || w.category === "primary")!;
    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: "amalgam_serration", rank: amalgam.maxRank, slotIndex: 0 }],
      modsMap,
    );
    expect(stats.sprintSpeedBonus).toBeCloseTo(0.25, 5);
  });

  it("shows sprint speed on mod card lines", () => {
    const lines = getModStatDisplayLines(amalgam, amalgam.maxRank);
    const sprint = lines.find((l) => l.statKey === "sprintSpeed");
    expect(sprint).toBeDefined();
    expect(sprint!.atRank).toMatch(/\+25%/);
  });

  it("feeds sprint speed into warframe when primary has Amalgam Serration (loadout linkage)", () => {
    const wf = allWarframes[0]!;
    const stats = calculateWarframeBuild(wf, [], modsMap, {
      primaryMods: [{ modId: "amalgam_serration", rank: amalgam.maxRank, slotIndex: 0 }],
    });
    expect(stats.sprintSpeedBonus).toBeCloseTo(0.25, 5);
    expect(stats.totalSprint).toBeCloseTo(stats.baseSprint * 1.25, 5);
  });

  it("applies Maglev slide speed on warframe mods", () => {
    const maglev = allMods.find((m) => m.id === "maglev");
    if (!maglev) return;
    const wf = allWarframes[0]!;
    const stats = calculateWarframeBuild(
      wf,
      [{ modId: "maglev", rank: maglev.maxRank, slotIndex: 0 }],
      modsMap,
    );
    const expected = (maglev.stats.slideSpeed! * (maglev.maxRank + 1)) / 100;
    expect(stats.slideSpeedBonus).toBeCloseTo(expected, 5);
  });
});
