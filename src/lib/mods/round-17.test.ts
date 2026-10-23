/**
 * Round 17: max ranks that match the wiki infobox
 * (wiki.warframe.com infobox Max Rank + max-rank value), clamping of saved ranks, and the relabelled cards.
 * Expected values are worked by hand from the wiki tables quoted in each case.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { clampModRanks, clampModRanksDeep } from "@/lib/mods/known-mods";
import { cleanLoadedBuild, cleanLoadedMods, describeClampedRanks } from "@/lib/builds/incompatible-mod-warnings";
import { modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { formatStatNumber, getModStatDisplayLines } from "@/lib/display/mod-display";
import type { SavedBuild } from "@/lib/builds/build-storage";

const mod = (id: string) => modsMap.get(id)!;
const lines = (id: string, rank?: number) => getModStatDisplayLines(mod(id), rank ?? mod(id).maxRank).map((l) => l.atRank);

describe("ranks: wiki.warframe.com infobox Max Rank and max-rank value, linear per rank", () => {
  // [id, infobox Max Rank, card text at max, base drain, capacity at max]. Every page's stats table
  // is R0–R3, which doesn't match the infobox Max Rank, so the per-rank value is max / (maxRank + 1).
  // Round 18: Zoom / Recoil / Noise Reduction carry their % (wiki "+40% Zoom", "-60% Weapon Recoil",
  // "+100% Noise Reduction"), and Rage's stray `damage` key is Energy On Health Damage.
  const cases: [string, number, string, number, number][] = [
    ["sure_footed_r5", 5, "+60% Knockdown Resistance", 6, 11],
    ["rage", 5, "+40% Energy On Health Damage", 6, 11],
    ["charged_chamber", 5, "+40% Damage on first shot in magazine", 6, 11],
    ["eagle_eye", 5, "+40% Zoom", 4, 9],
    ["stabilizer", 5, "-60% Recoil", 6, 11],
    ["hawk_eye", 5, "+80% Zoom", 4, 9],
    ["steady_hands", 5, "-60% Recoil", 6, 11],
    ["suppress_r3", 5, "+100% Noise Reduction", 2, 7],
    ["energy_channel_r10", 5, "+200% Damage", 4, 9],
    ["reach_r3", 5, "+1.5m Range", 4, 9],
    ["intruder", 3, "+8s Duration", 0, 3],
  ];
  for (const [id, maxRank, text, drain, cost] of cases) {
    it(`${id}: R${maxRank}, ${text}, costs ${cost} at max`, () => {
      expect(mod(id).maxRank).toBe(maxRank);
      expect(lines(id)).toContain(text);
      expect(mod(id).drain).toBe(drain);
      expect(modCapacityAtRank(mod(id).drain, mod(id).maxRank)).toBe(cost);
    });
  }
  it("Finishing Touch: R5, +10%/rank → +60% Finisher Damage, cost 2 → 7", () => {
    expect(mod("finishing_touch_r10").maxRank).toBe(5);
    expect([0, 2, 5].map((r) => lines("finishing_touch_r10", r)[0])).toEqual(
      ["+10%", "+30%", "+60%"].map((v) => `${v} Finisher Damage`),
    );
    expect(modCapacityAtRank(mod("finishing_touch_r10").drain, 5)).toBe(7);
  });
  it("Sure Footed / Rage per rank: 10% and 6.7% steps", () => {
    expect([0, 2, 5].map((r) => lines("sure_footed_r5", r)[0])).toEqual(
      ["+10%", "+30%", "+60%"].map((v) => `${v} Knockdown Resistance`),
    );
    expect([0, 2, 5].map((r) => lines("rage", r)[0])).toEqual(["+6.7% Energy On Health Damage", "+20% Energy On Health Damage", "+40% Energy On Health Damage"]);
  });
  it("Reach 0.25 m/rank and Intruder 2 s/rank on every card", () => {
    expect([0, 1, 2, 3, 4, 5].map((r) => lines("reach_r3", r)[0])).toEqual(
      ["+0.3m", "+0.5m", "+0.8m", "+1m", "+1.3m", "+1.5m"].map((v) => `${v} Range`),
    );
    expect([0, 1, 2, 3].map((r) => lines("intruder", r)[0])).toEqual(["+2s", "+4s", "+6s", "+8s"].map((v) => `${v} Duration`));
  });
  it("Stand Ground stays R5 (WFCD fusionLimit 5 and the wiki infobox); 10% per rank", () => {
    expect(mod("stand_ground").maxRank).toBe(5);
    expect([0, 5].map((r) => lines("stand_ground", r)[0])).toEqual([
      "+10% Ability Damage Reduction While Blocking",
      "+60% Ability Damage Reduction While Blocking",
    ]);
  });
  it("behavior lines only use stats the catalog has", () => {
    for (const id of ["sure_footed_r5", "rage", "intruder", "stand_ground", "anti_flak_plating", "stasis_field",
      "electromagnetic_shielding", "mortal_conduct", "orgone_tuning_matrix", "agility_drift", "armored_evade",
      "armored_acrobatics", "armored_recovery", "augment_nekros_shield_of_shadows"]) {
      const keys = getVerifiedModBehavior(id)!.stats.map((l) => l.statKey).sort();
      expect(keys, id).toEqual(Object.keys(mod(id).stats).sort());
    }
  });
});

describe("saved ranks above max are clamped on load", () => {
  it("clampModRanks lowers only ranks above max and reports them", () => {
    const input = [
      { modId: "rage", rank: 7, slotIndex: 0 },
      { modId: "sure_footed_r5", rank: 5, slotIndex: 1 },
      { modId: "intruder", rank: 5, slotIndex: 2 },
      { modId: "not_a_mod", rank: 9, slotIndex: 3 },
    ];
    const { mods, clamped } = clampModRanks(input, modsMap);
    expect(mods).toEqual([
      { modId: "rage", rank: 5, slotIndex: 0 },
      { modId: "sure_footed_r5", rank: 5, slotIndex: 1 },
      { modId: "intruder", rank: 3, slotIndex: 2 },
      { modId: "not_a_mod", rank: 9, slotIndex: 3 },
    ]);
    expect(describeClampedRanks(clamped)).toEqual(["Rage R7 → R5", "Intruder R5 → R3"]);
    expect(mods[1]).toBe(input[1]);
  });
  it("returns the same array / data when nothing is above max (every Round 17 max rank is unchanged)", () => {
    const input = [{ modId: "rage", rank: 5, slotIndex: 0 }, { modId: "reach_r3", rank: 5, slotIndex: 1 }];
    expect(clampModRanks(input, modsMap).mods).toBe(input);
    const data = { warframeId: "rhino", mods: input };
    expect(clampModRanksDeep(data, modsMap).data).toBe(data);
  });
  it("cleanLoadedBuild clamps; capacity follows the clamped rank", () => {
    const build = {
      id: "b", name: "bad ranks", type: "warframe", createdAt: 0, updatedAt: 0,
      data: { warframeId: "rhino", mods: [{ modId: "rage", rank: 8, slotIndex: 0 }, { modId: "sure_footed_r5", rank: 4, slotIndex: 8 }] },
    } as unknown as SavedBuild;
    const cleaned = cleanLoadedBuild(build);
    expect((cleaned.data as { mods: unknown[] }).mods).toEqual([
      { modId: "rage", rank: 5, slotIndex: 0 },
      { modId: "sure_footed_r5", rank: 4, slotIndex: 8 },
    ]);
    // Rage 6 + 8 = 14 → 6 + 5 = 11.
    expect(modCapacityAtRank(6, 5)).toBe(11);
  });
  it("cleanLoadedMods (share codes) clamps too", () => {
    expect(cleanLoadedMods([{ modId: "intruder", rank: 10, slotIndex: 0 }])).toEqual([{ modId: "intruder", rank: 3, slotIndex: 0 }]);
  });
});

describe("labels (wiki.warframe.com; Orgone from fandom + WFCD while the wiki page was down)", () => {
  const cases: [string, number, string[]][] = [
    ["anti_flak_plating", 0, ["+5% Blast Damage Resistance", "-2.5% Mobility"]],
    ["augment_nekros_shield_of_shadows", 0, ["+3% Damage Redirected Per Shadow", "+50m Range"]],
    ["augment_nekros_shield_of_shadows", 2, ["+5% Damage Redirected Per Shadow", "+50m Range"]],
    ["stasis_field", 0, ["+5s Duration", "-15% Enemy Projectile Speed", "-10% Enemy Projectile Damage"]],
    ["stasis_field", 5, ["+30s Duration", "-90% Enemy Projectile Speed", "-60% Enemy Projectile Damage"]],
    ["electromagnetic_shielding", 0, ["+25% Ally Damage Redirected", "+2m Range"]],
    ["electromagnetic_shielding", 3, ["+40% Ally Damage Redirected", "+8m Range"]],
    ["electromagnetic_shielding", 5, ["+50% Ally Damage Redirected", "+12m Range"]],
    ["mortal_conduct", 0, ["+15% Damage Reflected", "+2s Duration"]],
    ["mortal_conduct", 3, ["+60% Damage Reflected", "+8s Duration"]],
    ["orgone_tuning_matrix", 3, ["+15% Forge Capacity", "-10% Forge Cooldown", "+10% Elemental Resistance", "+12% Turret Heat Capacity"]],
    ["orgone_tuning_matrix", 5, ["+22.5% Forge Capacity", "-15% Forge Cooldown", "+15% Elemental Resistance", "+18% Turret Heat Capacity"]],
    ["agility_drift", 0, ["+1% Evasion", "+2% Airborne Damage Reduction"]],
    ["agility_drift", 5, ["+6% Evasion", "+12% Airborne Damage Reduction"]],
    ["armored_recovery", 0, ["+12.5% Knocked Down Damage Resistance", "-5% Slide Speed"]],
    ["armored_evade", 1, ["+20% Dodge Damage Resistance", "-5% Mobility"]],
  ];
  for (const [id, rank, want] of cases) it(`${id} R${rank}`, () => expect(lines(id, rank)).toEqual(want));
  it("no stray Damage line left on the relabelled mods", () => {
    for (const id of ["augment_nekros_shield_of_shadows", "stasis_field", "electromagnetic_shielding", "mortal_conduct", "stand_ground", "anti_flak_plating"]) {
      expect(lines(id).some((l) => /% Damage$/.test(l)), id).toBe(false);
    }
  });
});

describe("formatter: one decimal when not whole and under 100", () => {
  it.each([
    [12.5, "+12.5"], [22.5, "+22.5"], [18.1818, "+18.2"], [14.3, "+14.3"], [0.375, "+0.4"], [-2.5, "-2.5"],
    [40.000002, "+40"], [99.99, "+100"], [100.000002, "+100"], [137.5, "+138"], [7, "+7"], [-60, "-60"], [4.5, "+4.5"],
  ])("%s → %s", (v, want) => expect(formatStatNumber(v)).toBe(want));
  it("Antitoxin R2 22.5%, Primed Sure Footed R1 18.2%, Steel Charge aura stays whole", () => {
    expect(lines("antitoxin", 2)[0]).toBe("+22.5% Toxin Damage Resistance");
    expect(lines("primed_sure_footed", 1)[0]).toBe("+18.2% Knockdown Resistance");
    expect(lines("aura_steel_charge", 5)).toEqual(["+60% Melee Damage", "+60% Damage"]);
  });
});
