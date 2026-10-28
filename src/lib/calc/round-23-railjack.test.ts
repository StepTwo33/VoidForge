/**
 * Round 23: Railjack Plexus values corrected against wiki.warframe.com stat tables (fetched 2026-10-27).
 * Every expectation is hand-worked from the wiki rows quoted in the comments.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { RAILJACK_PLEXUS_ABILITIES, summarizeEquippedAbilities } from "@/lib/codex/railjack-abilities";
import { calculateRailjackBuild } from "@/lib/calc/railjack-calculator";
import { getModStatDisplayLines } from "@/lib/display/mod-display";

const desc = (id: string) => modsMap.get(id)!.description;
const card = (id: string, rank: number) => getModStatDisplayLines(modsMap.get(id)!, rank).map((l) => l.atRank);

describe("Railjack mod max-rank text matches the wiki", () => {
  it("cheap shots, Quicklock, Revo Reducer", () => {
    // Wiki: Artillery / Ordnance Cheap Shot +10% per rank → R5 +60%. Quicklock −12.5% per rank → R5 −75%.
    // Revo Reducer −6.75% per rank → R5 −40.5%.
    expect(desc("artillery_cheap_shot")).toContain("+60%");
    expect(desc("ordnance_cheap_shot")).toContain("+60%");
    expect(desc("quicklock")).toBe("-75% Ordnance Lock-On Time");
    expect(desc("revo_reducer")).toBe("-40.5% Omni Revolite Consumption");
  });

  it("tactical durations: Battle Stations 26s, Breach Quanta 45s, Death Blossom 25s, Intruder Stasis 35s, Void Cloak 35s", () => {
    expect(desc("battle_stations")).toContain("65% for 26s");
    expect(desc("breach_quanta")).toContain("for 45s");
    expect(desc("death_blossom")).toContain("for 25s");
    expect(desc("intruder_stasis")).toContain("for 35s");
    expect(desc("void_cloak")).toContain("for 35s");
    expect(desc("void_cloak")).toContain("reduced to 30%");
    expect(desc("battle_forge")).toContain("by 100s");
    expect(desc("fire_suppression")).toContain("230s");
    // The computed card already matched the wiki durations (stat × (rank + 1)).
    expect(card("battle_stations", 5)).toContain("+26s Duration");
    expect(card("death_blossom", 5)).toContain("+25s Duration");
    expect(card("void_cloak", 5)).toContain("+35s Duration");
  });
});

describe("Cruising Speed is +110% at R10 (Hotfix 30.0.4)", () => {
  it("10% per rank × (rank + 1)", () => {
    expect(modsMap.get("cruising_speed")!.stats!.engineSpeed).toBe(10);
    expect(card("cruising_speed", 0)[0]).toBe("+10% Engine Speed");
    expect(card("cruising_speed", 9)[0]).toBe("+100% Engine Speed");
    expect(card("cruising_speed", 10)[0]).toBe("+110% Engine Speed");
  });

  it("Lavan Mk III engine (150 of the 170 speed): +110% at R10 = +165, was +150 at the old +100%", () => {
    const run = (rank: number, active: boolean) =>
      calculateRailjackBuild({
        engineId: "lavan_engine_mk3",
        integratedMods: [{ modId: "cruising_speed", rank, slotIndex: 0 }],
        simulation: { cruisingSpeedActive: active },
      }).speed;
    const off = run(10, false);
    expect(off).toBe(170);
    expect(run(9, true) - off).toBe(150); // +100% of 150
    expect(run(10, true) - off).toBe(165); // +110% of 150
  });
});

describe("Battle Stations / Phoenix Blaze turret damage by rank (wiki stat tables)", () => {
  it("Battle Stations: 20/30/50/55/60/65% at R0–R5", () => {
    const at = (rank: number) =>
      summarizeEquippedAbilities([{ modId: "battle_stations", rank }], "tactical")[0].turretDamageWhileActive;
    expect([0, 1, 2, 3, 4, 5].map(at)).toEqual([0.2, 0.3, 0.5, 0.55, 0.6, 0.65]);
    expect(at(9)).toBe(0.65); // clamped to the max rank
  });

  it("Phoenix Blaze: Extra Heat Turret Damage +15% (R0) … +60% (R10), Energy Cost 100", () => {
    const at = (rank: number) =>
      summarizeEquippedAbilities([{ modId: "phoenix_blaze", rank }], "battle")[0].turretDamageWhileActive;
    expect([0, 1, 2, 5, 8, 10].map(at)).toEqual([0.15, 0.15, 0.2, 0.35, 0.5, 0.6]);
    expect(RAILJACK_PLEXUS_ABILITIES.phoenix_blaze.energyCost).toBe(100);
  });

  it("the active ability feeds the turret damage bonus at its rank", () => {
    const r5 = calculateRailjackBuild({
      tacticalMods: [{ modId: "battle_stations", rank: 5, slotIndex: 0 }],
      simulation: { activeTacticalAbilityId: "battle_stations" },
    });
    const r0 = calculateRailjackBuild({
      tacticalMods: [{ modId: "battle_stations", rank: 0, slotIndex: 0 }],
      simulation: { activeTacticalAbilityId: "battle_stations" },
    });
    expect(r0.abilityTurretDamageBonus).toBeCloseTo(0.2, 6);
    expect(r5.abilityTurretDamageBonus).toBeCloseTo(0.65, 6);
  });
});
