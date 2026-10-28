/**
 * Round 23: Hallowed Reckoning and Retribution.
 *
 * Hallowed Reckoning: wiki.warframe.com stat table (Rank | Ability Range | Radiation Damage per second |
 *   Armor Bonus | Radius | Duration | Armor Bonus Grace Period):
 *   R0 +40% 150 150 1.5m 7s 3s | R1 +40% 200 180 2m 8s 3s | R2 +40% 250 210 2.5m 9s 3s | R3 +40% 300 250 3m 10s 3s
 * Retribution: wiki stat table (chance 15/30/45/60%) and max-rank text "+80 Electricity"; WFCD levelStats give
 *   +20/+40/+60/+80 Electricity at R0–R3 (20 per rank).
 * Both are ability / defensive effects: they are mod_panel lines, never read by the weapon calculator.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { getModStatFilterTags } from "@/lib/mods/mod-stat-filters";
import { getModStatDisplayLines } from "@/lib/display/mod-display";

const mod = (id: string) => modsMap.get(id)!;
const lines = (id: string, rank: number) => getModStatDisplayLines(mod(id), rank).map((l) => l.atRank);

describe("Hallowed Reckoning", () => {
  const expected: Record<number, string[]> = {
    0: ["+40% Reckoning Range", "+1.5m Armor Bonus Radius", "+150 Radiation Damage per Second", "+150 Armor Bonus", "+7s Duration", "+3s Armor Bonus Grace Period"],
    1: ["+40% Reckoning Range", "+2m Armor Bonus Radius", "+200 Radiation Damage per Second", "+180 Armor Bonus", "+8s Duration", "+3s Armor Bonus Grace Period"],
    2: ["+40% Reckoning Range", "+2.5m Armor Bonus Radius", "+250 Radiation Damage per Second", "+210 Armor Bonus", "+9s Duration", "+3s Armor Bonus Grace Period"],
    3: ["+40% Reckoning Range", "+3m Armor Bonus Radius", "+300 Radiation Damage per Second", "+250 Armor Bonus", "+10s Duration", "+3s Armor Bonus Grace Period"],
  };
  for (const rank of [0, 1, 2, 3]) {
    it(`R${rank} card matches the wiki stat table row`, () => {
      expect(lines("hallowed_reckoning", rank)).toEqual(expected[rank]);
    });
  }

  it("the armor-bonus radius is no longer labelled plain 'Range'", () => {
    const stats = mod("hallowed_reckoning").stats ?? {};
    expect(stats).not.toHaveProperty("range");
    for (const rank of [0, 3]) expect(lines("hallowed_reckoning", rank).join("|")).not.toMatch(/\d m Range|\dm Range/);
  });

  it("every catalog stat is a mod_panel behavior line (the weapon calculator never reads them)", () => {
    const b = getVerifiedModBehavior("hallowed_reckoning")!;
    expect(b.stats.map((s) => s.statKey).sort()).toEqual(Object.keys(mod("hallowed_reckoning").stats ?? {}).sort());
    expect(new Set(b.stats.map((s) => s.target))).toEqual(new Set(["mod_panel"]));
  });

  it("filter chips: range (Reckoning Range, radius), survivability (armor), duration", () => {
    const tags = getModStatFilterTags(mod("hallowed_reckoning"));
    for (const t of ["augment", "range", "survivability", "duration"] as const) expect(tags.has(t), t).toBe(true);
    expect(tags.has("damage")).toBe(false);
  });
});

describe("Retribution", () => {
  it("+20 Electricity per rank (+80 at R3) beside the 15/30/45/60% chance", () => {
    expect([0, 1, 2, 3].map((r) => lines("retribution", r))).toEqual([
      ["+15% Retaliation Chance", "+20 Electricity Damage"],
      ["+30% Retaliation Chance", "+40 Electricity Damage"],
      ["+45% Retaliation Chance", "+60 Electricity Damage"],
      ["+60% Retaliation Chance", "+80 Electricity Damage"],
    ]);
  });

  it("max-rank card agrees with the wiki description '+80 Electricity'", () => {
    expect(mod("retribution").description).toMatch(/\+80/);
    expect(mod("retribution").stats?.retaliationElectricity).toBe(20);
    expect(mod("retribution").stats?.retaliationElectricity! * (mod("retribution").maxRank + 1)).toBe(80);
  });

  it("is a defensive proc: mod_panel lines only, survivability chip, no damage chip", () => {
    const b = getVerifiedModBehavior("retribution")!;
    expect(b.stats.map((s) => s.statKey).sort()).toEqual(["retaliationChance", "retaliationElectricity"]);
    expect(new Set(b.stats.map((s) => s.target))).toEqual(new Set(["mod_panel"]));
    const tags = getModStatFilterTags(mod("retribution"));
    expect(tags.has("survivability")).toBe(true);
    expect(tags.has("damage")).toBe(false);
  });
});
