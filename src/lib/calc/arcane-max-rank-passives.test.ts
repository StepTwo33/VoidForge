/**
 * Terkeon report: "primary merciless ... the reload speed buff is only applied once if the
 * arcane is rank 5, and is always active." wiki.warframe.com rank tables (Primary/Secondary
 * Merciless, Deadhead, Dexterity) list the extra bonus only at rank 5 ("-" below it).
 */
import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { allArcanes } from "@/data/arcanes";
import { calculateWeaponBuild, calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";
import { formatArcaneRankDescription, getArcaneDisplayInfo } from "@/lib/display/arcane-display";

const arc = (id: string) => allArcanes.find((a) => a.id === id)!;
const braton = allWeapons.find((w) => w.id === "braton_prime")!;
const lex = allWeapons.find((w) => w.id === "lex")!;
const sim = (stacks: number) => ({ ...DEFAULT_SIM_PARAMS, arcaneStacks: stacks });

function calc(weapon: typeof braton, id: string, rank: number, stacks: number) {
  return calculateWeaponBuildWithArcanes(weapon, [], new Map(), [arc(id)], undefined, sim(stacks), undefined, undefined, undefined, [rank]);
}

describe("Merciless reload speed: rank 5 only, always on, not per stack", () => {
  const bare = calculateWeaponBuild(braton, [], new Map());
  it("R5 with 0 kills still gets +30% reload and no damage", () => {
    const s = calc(braton, "arcane_primary_merciless", 5, 0);
    expect(s.reloadTime).toBeCloseTo(bare.reloadTime / 1.3, 4);
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage, 6);
  });
  it("R5 at 12 stacks: reload is still +30% once (not ×12), damage +360%", () => {
    const s = calc(braton, "arcane_primary_merciless", 5, 12);
    expect(s.reloadTime).toBeCloseTo(bare.reloadTime / 1.3, 4);
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage * 4.6, 4);
  });
  it("R3 has no reload bonus (wiki table: '-') and +20% damage per stack", () => {
    const s = calc(braton, "arcane_primary_merciless", 3, 12);
    expect(s.reloadTime).toBeCloseTo(bare.reloadTime, 6);
    expect(s.totalDamage).toBeCloseTo(bare.totalDamage * (1 + 0.2 * 12), 4);
  });
  it("Secondary Merciless follows the same rule", () => {
    const lexBare = calculateWeaponBuild(lex, [], new Map());
    expect(calc(lex, "arcane_secondary_merciless", 5, 0).reloadTime).toBeCloseTo(lexBare.reloadTime / 1.3, 4);
    expect(calc(lex, "arcane_secondary_merciless", 4, 12).reloadTime).toBeCloseTo(lexBare.reloadTime, 6);
  });
});

describe("Deadhead headshot / recoil and Dexterity combo duration: rank 5 only", () => {
  it("Deadhead R5 adds +30% headshot multiplier with 0 stacks, R4 adds none", () => {
    expect(calc(lex, "arcane_secondary_deadhead", 5, 0).headshotDamageBonus ?? 0).toBeCloseTo(0.3, 6);
    expect(calc(lex, "arcane_secondary_deadhead", 4, 3).headshotDamageBonus ?? 0).toBe(0);
    expect(calc(braton, "arcane_primary_deadhead", 5, 3).headshotDamageBonus ?? 0).toBeCloseTo(0.3, 6);
  });
  it("Dexterity combo duration is +7.5s at R5 only", () => {
    expect(calc(braton, "arcane_primary_dexterity", 5, 0).arcaneBonuses?.comboDuration).toBe(7.5);
    expect(calc(braton, "arcane_primary_dexterity", 4, 6).arcaneBonuses?.comboDuration ?? 0).toBe(0);
  });
});

describe("arcane cards and descriptions", () => {
  it("Merciless card: damage is per stack, reload is always active (not per stack)", () => {
    const info = getArcaneDisplayInfo(arc("arcane_primary_merciless"), 5);
    const reload = info.applied.find((l) => l.label.includes("Reload"))!;
    const dmg = info.applied.find((l) => l.label === "Damage")!;
    expect(reload.value).toBe("+30%");
    expect(reload.note).toBe("Always active (not per stack)");
    expect(dmg.note).toBe("Per stack (max 12)");
  });
  it("below R5 the reload line says it unlocks at rank 5 and the description drops it", () => {
    const info = getArcaneDisplayInfo(arc("arcane_primary_merciless"), 3);
    const reload = info.applied.find((l) => l.label.includes("Reload"))!;
    expect(reload.note).toBe("Rank 5 only");
    expect(reload.active).toBe(false);
    const desc = formatArcaneRankDescription(arc("arcane_primary_merciless"), 3);
    expect(desc).toContain("+20% Damage");
    expect(desc).not.toMatch(/Reload/);
    expect(formatArcaneRankDescription(arc("arcane_secondary_merciless"), 0)).not.toMatch(/Reload/);
    expect(formatArcaneRankDescription(arc("arcane_primary_merciless"), 5)).toMatch(/\+30% Reload Speed/);
  });
  it("Deadhead / Dexterity descriptions drop their rank 5 extras below max rank", () => {
    const dh = formatArcaneRankDescription(arc("arcane_primary_deadhead"), 2);
    expect(dh).toContain("+60% Damage");
    expect(dh).not.toMatch(/Headshot|Recoil/);
    const dx = formatArcaneRankDescription(arc("arcane_secondary_dexterity"), 1);
    expect(dx).not.toMatch(/Combo Duration/);
    expect(arc("arcane_secondary_dexterity").description).toContain("+7.5s Combo Duration");
  });
});
