import { describe, expect, it } from "vitest";
import {
  archwingStatSummary,
  archwingStatSummaryExtra,
  companionStatSummary,
  companionStatSummaryExtra,
  operatorStatSummary,
  operatorStatSummaryExtra,
  railjackStatSummary,
  railjackStatSummaryExtra,
  warframeStatSummary,
  warframeStatSummaryExtra,
  weaponStatSummary,
  weaponStatSummaryExtra,
} from "./mobile-stat-summary";
import type {
  ArchwingCalculatedStats,
  CalculatedStats,
  CompanionCalculatedStats,
  RailjackCalculatedStats,
  WarframeCalculatedStats,
} from "@/lib/types";

describe("mobile stat summary", () => {
  it("returns nothing without stats", () => {
    expect(warframeStatSummary(null)).toEqual([]);
    expect(weaponStatSummary(null)).toEqual([]);
    expect(companionStatSummary(null)).toEqual([]);
    expect(archwingStatSummary(null)).toEqual([]);
    expect(railjackStatSummary(null)).toEqual([]);
    expect(operatorStatSummary(null)).toEqual([]);
  });

  it("warframe: EHP plus strength, duration, range, and efficiency", () => {
    const s = {
      effectiveHealth: 1738.6,
      abilityStrength: 2.54,
      abilityDuration: 1.27,
      abilityRange: 0.89,
      abilityEfficiency: 1.3,
    } as WarframeCalculatedStats;
    expect(warframeStatSummary(s).map((i) => [i.label, i.value])).toEqual([
      ["EHP", "1739"],
      ["STR", "254%"],
      ["DUR", "127%"],
      ["RNG", "89%"],
      ["EFF", "130%"],
    ]);
  });

  it("weapon: burst and sustained DPS plus crit", () => {
    const s = { burstDps: 1285.4, sustainedDps: 857.2, criticalChance: 0.32, criticalMultiplier: 2.8, statusChance: 0.06 } as CalculatedStats;
    const items = weaponStatSummary(s);
    expect(items.map((i) => [i.label, i.value])).toEqual([
      ["Burst", "1285"],
      ["Sust.", "857"],
      ["CC", "32.0%"],
      ["CD", "2.80x"],
    ]);
    expect(items.find((i) => i.key === "cd")?.title).toMatch(/critical damage/i);
  });

  it("companion: EHP and body stats", () => {
    const s = { effectiveHealth: 900.4, totalHealth: 450, totalShield: 200, totalArmor: 50 } as CompanionCalculatedStats;
    expect(companionStatSummary(s).map((i) => [i.label, i.value])).toEqual([
      ["EHP", "900"],
      ["HP", "450"],
      ["Shield", "200"],
      ["Armor", "50"],
    ]);
  });

  it("archwing: EHP and ability strip", () => {
    const s = {
      effectiveHealth: 1200,
      abilityStrength: 1.1,
      abilityDuration: 1,
      abilityRange: 1,
      abilityEfficiency: 1,
    } as ArchwingCalculatedStats;
    expect(archwingStatSummary(s).map((i) => i.label)).toEqual(["EHP", "STR", "DUR", "RNG", "EFF"]);
  });

  it("railjack: hull, shield, armor, speed", () => {
    const s = { hull: 2400, shield: 1800, armor: 350, speed: 42.6 } as RailjackCalculatedStats;
    expect(railjackStatSummary(s).map((i) => [i.label, i.value])).toEqual([
      ["Hull", "2400"],
      ["Shield", "1800"],
      ["Armor", "350"],
      ["Speed", "43"],
    ]);
  });

  it("operator: amp damage and crit/status", () => {
    expect(
      operatorStatSummary({ damage: 3000, criticalChance: 0.3, criticalMultiplier: 2.0, statusChance: 0.12 }).map(
        (i) => [i.label, i.value],
      ),
    ).toEqual([
      ["DMG", "3000"],
      ["CC", "30%"],
      ["CD", "2.0×"],
      ["SC", "12%"],
    ]);
  });

  it("extra rows return secondary stats for expanded mobile view", () => {
    expect(weaponStatSummaryExtra(null)).toEqual([]);
    expect(warframeStatSummaryExtra(null)).toEqual([]);
    expect(
      weaponStatSummaryExtra({
        statusChance: 0.28,
        multishot: 2.8,
        fireRate: 12,
        effectiveFireRate: 10.5,
        totalDamage: 145,
      } as CalculatedStats).map((i) => [i.label, i.value]),
    ).toEqual([
      ["SC", "28.0%"],
      ["MS", "2.8"],
      ["FR", "10.50/s"],
      ["Dmg", "145"],
    ]);
    expect(
      warframeStatSummaryExtra({
        totalHealth: 740,
        totalShield: 370,
        totalArmor: 225,
        damageReduction: 42.9,
        totalEnergy: 425,
      } as WarframeCalculatedStats).map((i) => [i.label, i.value]),
    ).toEqual([
      ["HP", "740"],
      ["Shield", "370"],
      ["Armor", "225"],
      ["DR", "43%"],
      ["Energy", "425"],
    ]);
    expect(
      companionStatSummaryExtra({
        damageReduction: 55.2,
        meleeDamageBonus: 3.3,
        critChanceBonus: 1.1,
        critDamageBonus: 0.6,
      } as CompanionCalculatedStats).map((i) => [i.label, i.value]),
    ).toEqual([
      ["DR", "55%"],
      ["Melee", "+330%"],
      ["CC", "+110%"],
      ["CD", "+60%"],
    ]);
    expect(
      railjackStatSummaryExtra({
        boostSpeed: 640,
        shieldRecharge: 14.5,
        turretDamageBonus: 0.5,
        ordnanceDamageBonus: 0.25,
      } as RailjackCalculatedStats).map((i) => [i.label, i.value]),
    ).toEqual([
      ["Boost", "640"],
      ["Regen", "14.5%"],
      ["Turret", "+50%"],
      ["Ord.", "+25%"],
    ]);
    expect(
      operatorStatSummaryExtra({
        fireRate: 3,
        magazine: 10,
        reloadTime: 2,
        triggerType: "Semi",
      }).map((i) => [i.label, i.value]),
    ).toEqual([
      ["FR", "3.0/s"],
      ["Mag", "10"],
      ["Reload", "2.0s"],
      ["Trigger", "Semi"],
    ]);
  });
});
