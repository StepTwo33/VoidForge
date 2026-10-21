/**
 * Round 13 hand-worked checks: every Link mod copies the Warframe's stats, Jade's two Auras.
 * Sources (wiki.warframe.com, checked 2026-10-21; fandom agrees on the Link numbers):
 * - Link Vitality / Link Redirection / Link Fiber: "+125% of Warframe's Max Health / Max Shield /
 *   Armor" at R10 (+11.36% per rank); equippable on Kubrows, Kavats, MOAs and Hounds.
 * - Link Shields / Link Armor: pre-Update 34 names of Link Redirection / Link Fiber. The catalog
 *   still has them at their card value (+10% per rank, 60% at R5).
 * - Jade: "two Aura Mod Slots", AuraPolarity ["Aura", "Vazarin"]: the first is the built-in
 *   Universal Aura polarity. Jade/Abilities: "+28 from two maxed Auras, or +32 / +36 with
 *   Steel Charge and/or Power Donation".
 */
import { describe, expect, it } from "vitest";
import { allCompanions } from "@/data/companions";
import { allWarframes } from "@/data/warframes";
import { modsMap } from "@/data/mods";
import { INNATE_POLARITIES } from "@/data/innate-polarities";
import { calculateCompanionBuild, COMPANION_LINK_MODS } from "@/lib/calc/companion-calculator";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import { innateSlotPolarities } from "@/lib/builds/innate-polarities";
import { computeWarframeAuraBonus } from "@/lib/calc/compute-used-capacity";
import { getWarframeAuraSlotIndices, WARFRAME_SECOND_AURA_SLOT } from "@/lib/warframes/aura-slots";
import { mapPositionalWarframeMods, rawUpgradeSlots, type ArsenalImportWarning } from "@/lib/warframe-arsenal/map-import";
import type { Loadout } from "@/lib/types";

const comp = (id: string) => allCompanions.find((c) => c.id === id)!;
const rhinoTank = { name: "Rhino", health: 740, shield: 1110, armor: 480 };
const one = (modId: string, rank: number) => [{ modId, rank }];

describe("R13 Link mods copy the Warframe's stats", () => {
  it("covers every Link mod in the catalog", () => {
    const linkIds = [...modsMap.values()].filter((m) => /^Link /.test(m.name) && m.category === "companion").map((m) => m.id).sort();
    expect(linkIds).toEqual(["link_armor", "link_fiber", "link_redirection", "link_shields", "link_vitality"]);
    expect(Object.keys(COMPANION_LINK_MODS).sort()).toEqual(linkIds);
  });

  it.each([
    // [mod, rank, stat, companion base, Warframe stat, fraction, expected total]
    ["link_vitality", 10, "totalHealth", 390, 740, 1.25, 390 + 925],
    ["link_redirection", 10, "totalShield", 230, 1110, 1.25, 230 + 1387.5],
    ["link_fiber", 10, "totalArmor", 300, 480, 1.25, 300 + 600],
    ["link_fiber", 4, "totalArmor", 300, 480, 1.25 * (5 / 11), 300 + 480 * 1.25 * (5 / 11)],
    ["link_shields", 5, "totalShield", 230, 1110, 0.6, 230 + 666],
    ["link_armor", 5, "totalArmor", 300, 480, 0.6, 300 + 288],
    ["link_armor", 2, "totalArmor", 300, 480, 0.3, 300 + 144],
  ] as const)("Smeeta + %s R%i: %s = base + fraction × Warframe", (modId, rank, stat, base, wfStat, frac, expected) => {
    const s = calculateCompanionBuild(comp("smeeta"), one(modId, rank), modsMap, null, rhinoTank);
    expect(s[stat]).toBeCloseTo(expected, 3);
    expect(s[stat]).toBeCloseTo(base + frac * wfStat, 3);
    expect(s.linkModsNeedWarframe).toBe(false);
  });

  it.each(["link_vitality", "link_redirection", "link_fiber", "link_shields", "link_armor"])(
    "standalone %s: totals stay at the companion's own and the build is flagged",
    (modId) => {
      const s = calculateCompanionBuild(comp("smeeta"), one(modId, modsMap.get(modId)!.maxRank), modsMap);
      expect([s.totalHealth, s.totalShield, s.totalArmor]).toEqual([390, 230, 300]);
      expect(s.linkHealth + s.linkShield + s.linkArmor).toBe(0);
      expect(s.linkModsNeedWarframe).toBe(true);
    },
  );

  it("Smeeta EHP with Link Shields R5 + Link Armor R5: 390 / (1 − 588/888) + 896", () => {
    const s = calculateCompanionBuild(comp("smeeta"), [{ modId: "link_shields", rank: 5 }, { modId: "link_armor", rank: 5 }], modsMap, null, rhinoTank);
    expect(s.totalShield).toBeCloseTo(896, 6);
    expect(s.totalArmor).toBeCloseTo(588, 6);
    expect(s.damageReduction).toBeCloseTo((588 / 888) * 100, 6);
    expect(s.effectiveHealth).toBeCloseTo(390 / (1 - 588 / 888) + 896, 3);
  });

  it("works on a MOA and a Hound too (Lambeo 350/350/350, Bhaira 350/450/350)", () => {
    const moa = calculateCompanionBuild(comp("lambeo"), one("link_redirection", 10), modsMap, null, rhinoTank);
    expect(moa.totalShield).toBeCloseTo(350 + 1387.5, 3);
    const hound = calculateCompanionBuild(comp("bhaira_hound"), one("link_fiber", 10), modsMap, null, rhinoTank);
    expect(hound.totalArmor).toBeCloseTo(350 + 600, 3);
  });

  it("loadouts use their Warframe: bare Rhino 370 / 555 / 240 with every Link mod", () => {
    const base = { id: "t", name: "t", createdAt: 0, updatedAt: 0 } as const;
    const wfBuild = { warframeId: "rhino", mods: [], shards: [null, null, null, null, null], hasOrokinReactor: true };
    const run = (mods: { modId: string; rank: number; slotIndex: number }[]) =>
      calcLoadoutStats({ ...base, warframeBuild: wfBuild, companionBuild: { companionId: "smeeta", mods, weaponMods: [], hasReactor: true, hasCatalyst: false } } as unknown as Loadout)
        .companion!.bodyStats;
    expect(run([{ modId: "link_vitality", rank: 10, slotIndex: 0 }]).totalHealth).toBeCloseTo(390 + 1.25 * 370, 3);
    expect(run([{ modId: "link_redirection", rank: 10, slotIndex: 0 }]).totalShield).toBeCloseTo(230 + 1.25 * 555, 3);
    expect(run([{ modId: "link_fiber", rank: 10, slotIndex: 0 }]).totalArmor).toBeCloseTo(300 + 1.25 * 240, 3);
    expect(run([{ modId: "link_shields", rank: 5, slotIndex: 0 }]).totalShield).toBeCloseTo(230 + 0.6 * 555, 3);
    expect(run([{ modId: "link_armor", rank: 5, slotIndex: 0 }]).totalArmor).toBeCloseTo(300 + 0.6 * 240, 3);
    const noFrame = calcLoadoutStats({ ...base, companionBuild: { companionId: "smeeta", mods: [{ modId: "link_armor", rank: 5, slotIndex: 0 }], weaponMods: [], hasReactor: true, hasCatalyst: false } } as unknown as Loadout).companion!.bodyStats;
    expect(noFrame.totalArmor).toBe(300);
    expect(noFrame.linkModsNeedWarframe).toBe(true);
  });
});

describe("R13 Jade's two Aura slots", () => {
  it("Jade has Aura 1 (slot 0) and Aura 2 (slot 10); no Jade Prime in the catalog", () => {
    expect(getWarframeAuraSlotIndices("jade")).toEqual([0, WARFRAME_SECOND_AURA_SLOT]);
    expect(allWarframes.some((w) => w.id === "jade_prime")).toBe(false);
    expect(getWarframeAuraSlotIndices("rhino")).toEqual([0]);
  });

  it("polarities follow WFCD + wiki.warframe.com: Aura 1 Universal, Aura 2 Vazarin, one Naramon slot", () => {
    expect(INNATE_POLARITIES["warframe:jade"]).toEqual({ slots: ["naramon"], aura: "universal", aura2: "vazarin" });
    expect(innateSlotPolarities("warframe", "jade")).toEqual({ 0: "universal", 1: "naramon", 10: "vazarin" });
    for (const id of ["protea", "protea_prime", "dante"]) expect(INNATE_POLARITIES[`warframe:${id}`].aura).toBe("universal");
  });

  const polarities = innateSlotPolarities("warframe", "jade");
  const aura = (modId: string, slotIndex: number) => ({ modId, rank: 5, slotIndex });
  it("both Auras add capacity: two maxed −2 Auras on matching slots = 14 + 14 = 28 (wiki)", () => {
    expect(computeWarframeAuraBonus([aura("growing_power", 0), aura("aura_physique", 10)], modsMap, polarities, [0, 10])).toBe(28);
  });
  it("Steel Charge (−4 → 9 at R5) in the Universal slot + a Vazarin Aura: 18 + 14 = 32 (wiki)", () => {
    expect(computeWarframeAuraBonus([aura("aura_steel_charge", 0), aura("aura_physique", 10)], modsMap, polarities, [0, 10])).toBe(32);
  });
  it("Aura 2 with a non-Vazarin Aura is a mismatch, Aura 1 matches anything", () => {
    const mismatch = computeWarframeAuraBonus([aura("growing_power", 10)], modsMap, polarities, [0, 10]);
    expect(mismatch).toBeLessThan(7);
    expect(computeWarframeAuraBonus([aura("growing_power", 0)], modsMap, polarities, [0, 10])).toBe(14);
  });

  const U = (uniqueName: string, rank = 5) => ({ uniqueName, rank });
  const E = { uniqueName: "" };
  const GROWING = U("/Lotus/Upgrades/Mods/Aura/FairyQuest/FairyQuestCritToAbilityAuraMod");
  const CORROSIVE = U("/Lotus/Upgrades/Mods/Aura/EnemyArmorReductionAuraMod");
  const DRIFT = U("/Lotus/Upgrades/Mods/OrokinChallenge/OrokinChallengeModPower");
  const FLOW = U("/Lotus/Upgrades/Mods/Warframe/Expert/AvatarPowerMaxModExpert", 10);
  const CONT = U("/Lotus/Upgrades/Mods/Warframe/Expert/AvatarAbilityDurationModExpert", 10);
  const UMBRAL = U("/Lotus/Upgrades/Mods/Sets/Umbra/WarframeUmbraModA", 10);
  const map = (upgrades: unknown[]) => {
    const warnings: ArsenalImportWarning[] = [];
    const { mods } = mapPositionalWarframeMods(rawUpgradeSlots(upgrades)!, warnings, "jade");
    return { at: Object.fromEntries(mods.map((m) => [m.slotIndex, m.modId])), warnings };
  };
  const REGULAR = [FLOW, E, UMBRAL, E, E, E, E, CONT];
  const expected = { 0: "growing_power", 10: "aura_corrosive_projection", 9: "power_drift", 1: "primed_flow", 3: "umbra_vitality", 8: "primed_continuity" };

  it("Player Sync: second Aura next to the first ([arcane, arcane, exilus, aura, aura2, r1..r8])", () => {
    const { at, warnings } = map([E, E, DRIFT, GROWING, CORROSIVE, ...REGULAR]);
    expect(at).toEqual(expected);
    expect(warnings).toEqual([]);
  });
  it("Player Sync: second Aura after the regular slots ([..., aura, r1..r8, aura2])", () => {
    const { at, warnings } = map([E, E, DRIFT, GROWING, ...REGULAR, CORROSIVE]);
    expect(at).toEqual(expected);
    expect(warnings).toEqual([]);
  });
  it("Player Sync: empty trailing Aura 2 keeps the regular slots in place", () => {
    const { at } = map([E, E, DRIFT, GROWING, ...REGULAR, E]);
    expect(at).toEqual({ 0: "growing_power", 9: "power_drift", 1: "primed_flow", 3: "umbra_vitality", 8: "primed_continuity" });
  });
  it("Player Sync: standard 12-entry Jade list with one Aura", () => {
    const { at } = map([E, E, DRIFT, GROWING, ...REGULAR]);
    expect(at).toEqual({ 0: "growing_power", 9: "power_drift", 1: "primed_flow", 3: "umbra_vitality", 8: "primed_continuity" });
  });
});
