/**
 * Round 12 hand-worked checks (wiki.warframe.com, ties go to wiki.warframe.com).
 */
import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { allCompanions } from "@/data/companions";
import { archwings, necramechs } from "@/data/archwing";
import { allMods, modsMap } from "@/data/mods";
import {
  adaptationDrPerStack,
  adaptationMaxStacks,
  calculateWarframeBuild,
  computeAdaptationSurvivability,
  playerEffectiveHealth,
} from "@/lib/calc/calculator";
import { calculateArchwingBuild, calculateNecramechBuild } from "@/lib/calc/archwing-calculator";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import { scaleAbilityMiscStats, scaledAbilityEnergyCost } from "@/lib/codex/ability-misc-stats";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { searchBuildCatalog, withinOneEdit } from "@/lib/builds/build-search";
import { WEAPON_FIRE_TIMING } from "@/data/weapon-innate-elements";

const wf = (id: string) => allWarframes.find((w) => w.id === id)!;
const slot = (modId: string, rank: number, slotIndex = 0) => ({ modId, rank, slotIndex }) as never;

describe("R12-2 player shields take 50% damage in EHP", () => {
  it("Rhino bare: 370 / (1 − 240/540) + 555 × 2 = 666 + 1110 = 1776", () => {
    const s = calculateWarframeBuild(wf("rhino"), [], modsMap);
    expect(s.totalHealth).toBe(370);
    expect(s.totalShield).toBe(555);
    expect(s.totalArmor).toBe(240);
    expect(s.effectiveHealth).toBeCloseTo(666 + 1110, 6); // was 1221 (shields 1×)
  });
  it("Hildryn bare: 280 / (1 − 315/615) + 1780 × 2 = 574 + 3560 = 4134", () => {
    const s = calculateWarframeBuild(wf("hildryn"), [], modsMap);
    expect(s.effectiveHealth).toBeCloseTo(280 / (300 / 615) + 3560, 6); // was 2354
  });
  it("Odonata (rank 30 675 HP / 630 SH / 100 AR): 675 / 0.75 + 1260 = 2160", () => {
    const s = calculateArchwingBuild(archwings.find((a) => a.id === "odonata")!, [], modsMap);
    expect(s.effectiveHealth).toBeCloseTo(900 + 1260, 6); // was 1530
  });
  it("Necramechs use the same ×2 shield term", () => {
    const s = calculateNecramechBuild(necramechs[0], [], modsMap);
    const dr = s.totalArmor / (s.totalArmor + 300);
    expect(s.effectiveHealth).toBeCloseTo(s.totalHealth / (1 - dr) + 2 * s.totalShield, 6);
  });
  it("Companions keep shields at 1× (wiki: not Companions)", () => {
    const c = calculateCompanionBuild(allCompanions.find((x) => x.id === "smeeta")!, [], modsMap);
    expect(c.effectiveHealth).toBeCloseTo(390 * 2 + 230, 6);
  });
});

describe("R12-3 player armor DR has no 90% cap", () => {
  it("EHP uses the DR the panel shows (95% at 5700 armor)", () => {
    expect(playerEffectiveHealth(1000, 5700 / 6000, 0)).toBeCloseTo(20000, 6); // capped 90% would be 10000
    const high = calculateWarframeBuild({ ...wf("rhino"), id: "test_armor_frame", armor: 5700 }, [], modsMap);
    expect(high.totalArmor).toBe(5700);
    expect(high.damageReduction).toBeCloseTo(95, 6);
    expect(high.effectiveHealth).toBeCloseTo(high.totalHealth / 0.05 + 2 * high.totalShield, 6);
  });
});

describe("R12-4 energy cost and channel drain stay within 25%–175% of base", () => {
  it("cast cost: Blind Rage 45% EFF → 155% (under the ceiling); EFF 20% → 175% ceiling; EFF 190% → 25% floor", () => {
    expect(scaledAbilityEnergyCost(100, 0.45)).toBeCloseTo(155, 9);
    expect(scaledAbilityEnergyCost(100, 0.2)).toBeCloseTo(175, 9); // was 180
    expect(scaledAbilityEnergyCost(100, -1)).toBeCloseTo(175, 9); // was 300
    expect(scaledAbilityEnergyCost(100, 1.9)).toBeCloseTo(25, 9);
    expect(scaledAbilityEnergyCost(25, 1.3)).toBeCloseTo(17.5, 9);
  });
  it("channel drain: Blind Rage + Fleeting (EFF 105%, DUR 40%) → 237.5% capped to 175% (wiki example)", () => {
    const prism = wf("mirage").abilities.find((a) => a.name === "Prism")!;
    const base = Number((prism.miscStats as Record<string, unknown>).energyDrain);
    const line = (eff: number, dur: number) =>
      scaleAbilityMiscStats(prism.miscStats as never, { strength: 1, duration: dur, range: 1, efficiency: eff }, { warframeId: "mirage", abilityName: "Prism" })
        .find((l) => l.label.toLowerCase().includes("drain"))!;
    expect(parseFloat(line(1.05, 0.4).scaled)).toBeCloseTo(base * 1.75, 1); // was base × 2.375
    // Blind Rage + Streamline (EFF 75%, DUR 100%): 125%, under the ceiling, unchanged.
    expect(parseFloat(line(0.75, 1).scaled)).toBeCloseTo(base * 1.25, 1);
    // wiki example: 140% DUR, 130% EFF → 50%.
    expect(parseFloat(line(1.3, 1.4).scaled)).toBeCloseTo(base * 0.5, 1);
    // EFF above 175% still counts in drain (uncapped), floor 25%.
    expect(parseFloat(line(1.9, 0.4).scaled)).toBeCloseTo(base * 0.25, 1);
  });
});

describe("R12-6 Adaptation scales by rank (wiki table +5% R0 → +10% R10, 90% max)", () => {
  it("per stack and stacks to cap", () => {
    expect(adaptationDrPerStack(0)).toBeCloseTo(0.05, 12);
    expect(adaptationDrPerStack(5)).toBeCloseTo(0.075, 12);
    expect(adaptationDrPerStack(10)).toBeCloseTo(0.1, 12);
    expect(adaptationMaxStacks(0.05)).toBe(18);
    expect(adaptationMaxStacks(0.075)).toBe(12);
    expect(adaptationMaxStacks(0.1)).toBe(9);
  });
  it("R0 at 9 stacks is 45%, not 90%; reaches 90% at 18", () => {
    expect(computeAdaptationSurvivability(1000, 0.5, 9, 0.05).typedDRPercent).toBeCloseTo(45, 9);
    expect(computeAdaptationSurvivability(1000, 0.5, 18, 0.05).typedDRPercent).toBeCloseTo(90, 9);
    expect(computeAdaptationSurvivability(1000, 0.5, 30, 0.05).typedDRPercent).toBeCloseTo(90, 9);
    // R10 default unchanged: 9 stacks → 90%, EHP ×10.
    expect(computeAdaptationSurvivability(1000, 0.5, 9).adaptedEHP).toBeCloseTo(10000, 6);
  });
  it("Warframe stats carry the equipped rank's per-stack value", () => {
    expect(calculateWarframeBuild(wf("rhino"), [slot("adaptation", 0)], modsMap).adaptationDrPerStack).toBeCloseTo(0.05, 12);
    expect(calculateWarframeBuild(wf("rhino"), [slot("adaptation", 10)], modsMap).adaptationDrPerStack).toBeCloseTo(0.1, 12);
  });
});

describe("R12-5 Link mods add 125% of the Warframe's stats", () => {
  const smeeta = allCompanions.find((c) => c.id === "smeeta")!;
  const rhinoTank = { name: "Rhino", health: 740, shield: 1110, armor: 480 };
  it("Smeeta + R10 Link Vitality with Rhino (740 HP): 390 + 1.25 × 740 = 1315 HP, EHP 1315 × 2 + 230 = 2860", () => {
    const s = calculateCompanionBuild(smeeta, [{ modId: "link_vitality", rank: 10 }], modsMap, null, rhinoTank);
    expect(s.totalHealth).toBeCloseTo(1315, 3);
    expect(s.linkHealth).toBeCloseTo(925, 3);
    expect(s.effectiveHealth).toBeCloseTo(2860, 2); // was 1010
    expect(s.linkModsNeedWarframe).toBe(false);
  });
  it("Link Redirection + Fiber: shields 230 + 1387.5, armor 300 + 600", () => {
    const s = calculateCompanionBuild(smeeta, [{ modId: "link_redirection", rank: 10 }, { modId: "link_fiber", rank: 10 }], modsMap, null, rhinoTank);
    expect(s.totalShield).toBeCloseTo(230 + 1387.5, 2);
    expect(s.totalArmor).toBeCloseTo(300 + 600, 2);
    expect(s.damageReduction).toBeCloseTo((900 / 1200) * 100, 3);
  });
  it("Standalone companion: totals unchanged and flagged", () => {
    const s = calculateCompanionBuild(smeeta, [{ modId: "link_vitality", rank: 10 }], modsMap);
    expect(s.totalHealth).toBe(390);
    expect(s.linkModsNeedWarframe).toBe(true);
    expect(calculateCompanionBuild(smeeta, [], modsMap).linkModsNeedWarframe).toBe(false);
  });
  it("Rank 4 Link Vitality: 5/11 of 125%", () => {
    const s = calculateCompanionBuild(smeeta, [{ modId: "link_vitality", rank: 4 }], modsMap, null, rhinoTank);
    expect(s.linkHealth).toBeCloseTo(740 * 1.25 * (5 / 11), 2);
  });
});

describe("R12-7 Necramech Deflection data keys", () => {
  it("+90% shield recharge / −45% delay, no shield capacity line", () => {
    const m = allMods.find((x) => x.id === "necramech_deflection")!;
    const l = Object.fromEntries(getModStatDisplayLines(m, m.maxRank).map((x) => [x.statKey, x.atRank]));
    expect(l.shield).toBeUndefined();
    expect(l.shieldRecharge).toMatch(/^\+90%/);
    expect(l.shieldRechargeDelay).toMatch(/^-45%/);
    const mech = necramechs[0];
    const bare = calculateNecramechBuild(mech, [], modsMap);
    const withMod = calculateNecramechBuild(mech, [{ modId: "necramech_deflection", rank: 5, slotIndex: 0 }] as never, modsMap);
    expect(withMod.totalShield).toBe(bare.totalShield);
  });
});

describe("R12 Prisma Lenz stays at the in-game 0.8s", () => {
  it("charge time 0.8 (wikis say 1.2; Jason measured 0.8 in game)", () => {
    expect(WEAPON_FIRE_TIMING.prisma_lenz?.chargeTime).toBe(0.8);
  });
});

describe("R12-11 header search: one-typo fallback below exact/prefix", () => {
  it("withinOneEdit", () => {
    expect(withinOneEdit("akstiletto", "akstileto")).toBe(true); // deletion
    expect(withinOneEdit("soma", "sima")).toBe(true); // substitution
    expect(withinOneEdit("rhino", "rihno")).toBe(true); // swap
    expect(withinOneEdit("rhino", "rhinoo")).toBe(true); // insertion
    expect(withinOneEdit("rhino", "rnioh")).toBe(false);
  });
  it("typos find the item; exact/prefix rank first", () => {
    expect(searchBuildCatalog("akstileto", 3)[0]?.name).toBe("Akstiletto");
    expect(searchBuildCatalog("rihno", 3)[0]?.name).toBe("Rhino");
    expect(searchBuildCatalog("saryn prme", 3)[0]?.name).toBe("Saryn Prime");
    expect(searchBuildCatalog("soma", 2).map((i) => i.name)).toEqual(["Soma", "Soma Prime"]);
    expect(searchBuildCatalog("rhino prime", 1)[0]?.name).toBe("Rhino Prime");
    expect(searchBuildCatalog("ash", 1)[0]?.name).toBe("Ash");
  });
  it("short queries get no typo matches", () => {
    expect(searchBuildCatalog("asx", 5)).toEqual([]);
  });
});
