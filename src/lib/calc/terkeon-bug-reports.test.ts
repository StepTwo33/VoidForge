import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons, weaponsMap } from "@/data/weapons";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { headCritFactor, headshotMultiplier } from "@/lib/calc/combat-multipliers";
import { resolveStandaloneExternalBuffs } from "@/lib/weapons/weapon-external-buffs";
import { DEFAULT_SIM_PARAMS, type ModSlot, type SimulationParams } from "@/lib/types";

function slot(id: string, rank?: number): ModSlot {
  const mod = modsMap.get(id);
  if (!mod) throw new Error(`Mod ${id} not found`);
  return {
    modId: id,
    rank: rank ?? mod.maxRank,
    slotIndex: 0,
  };
}

function calc(id: string, mods: ModSlot[], sim: Partial<SimulationParams> = {}) {
  const weapon = weaponsMap.get(id);
  if (!weapon) throw new Error(`Weapon ${id} not found`);
  return calculateWeaponBuildWithArcanes(weapon, mods, modsMap, [], undefined, {
    ...DEFAULT_SIM_PARAMS,
    ...sim,
  });
}

describe("Terkeon Bug Reports Fixes", () => {
  describe("Issue 1: Headshot vs Weak Point separation", () => {
    it("headshotMultiplier handles body (1.0x), headshot (3.0x), and non-head weak point (2.0x)", () => {
      // Body shot
      expect(headshotMultiplier(false, 0, 0, undefined, false)).toBe(1.0);
      // Headshot
      expect(headshotMultiplier(true, 0, 0, undefined, false)).toBe(3.0);
      // Non-head weak point
      expect(headshotMultiplier(false, 0, 0, undefined, true)).toBe(2.0);
    });

    it("Target Acquired (+60% headshot multi) applies on headshot but NOT on non-head weak point", () => {
      // Target Acquired only boosts headshots
      const taBonus = 0.6;
      expect(headshotMultiplier(true, taBonus, 0, undefined, false)).toBeCloseTo(3.0 * 1.6, 6);
      expect(headshotMultiplier(false, taBonus, 0, undefined, true)).toBe(2.0);
    });

    it("Primary Acuity (+350% weak point bonus) boosts both headshot and non-head weak point", () => {
      const wpBonus = 3.5;
      // Headshot: (3 + 1.5 * 3.5) = 8.25
      expect(headshotMultiplier(true, 0, wpBonus, undefined, false)).toBeCloseTo(8.25, 6);
      // Non-head weak point: 2.0 + 3.5 = 5.5
      expect(headshotMultiplier(false, 0, wpBonus, undefined, true)).toBeCloseTo(5.5, 6);
    });

    it("headCritFactor doubles crit multiplier for headshot vs Grineer, but NOT for non-head weak point", () => {
      expect(headCritFactor(true, "Grineer")).toBe(2);
      expect(headCritFactor(false, "Grineer")).toBe(1);
    });

    it("Cascadia Accuracy (+300% WP CC) triggers on non-head weak points as well as headshots", () => {
      const lex = weaponsMap.get("lex")!;
      const baseCC = lex.criticalChance; // 0.20
      const cascadia = { id: "cascadia_accuracy", name: "Cascadia Accuracy", maxRank: 5 };
      // Paper body shot
      const body = calculateWeaponBuildWithArcanes(lex, [], modsMap, [cascadia], [5], {
        ...DEFAULT_SIM_PARAMS,
        arcaneStacks: 1,
        applyHeadshots: false,
        applyWeakPoints: false,
      });
      expect(body.criticalChance).toBeCloseTo(baseCC, 5);

      // Non-head weak point hit
      const weakPoint = calculateWeaponBuildWithArcanes(lex, [], modsMap, [cascadia], [5], {
        ...DEFAULT_SIM_PARAMS,
        arcaneStacks: 1,
        applyHeadshots: false,
        applyWeakPoints: true,
      });
      expect(weakPoint.criticalChance).toBeCloseTo(baseCC * (1 + 3.0), 5); // +300% CC

      // Headshot hit
      const headshot = calculateWeaponBuildWithArcanes(lex, [], modsMap, [cascadia], [5], {
        ...DEFAULT_SIM_PARAMS,
        arcaneStacks: 1,
        applyHeadshots: true,
        applyWeakPoints: false,
      });
      expect(headshot.criticalChance).toBeCloseTo(baseCC * (1 + 3.0), 5);
    });
  });

  describe("Issue 2: Galvanized Steel Heavy Attack Crit Chance", () => {
    it("Galvanized Steel doubles crit chance bonus on heavy attacks and sets heavyCriticalChance", () => {
      // Skana base CC is 16% (0.16)
      const skana = weaponsMap.get("skana")!;
      const baseCC = skana.criticalChance;

      const bare = calc("skana", []);
      expect(bare.heavyCriticalChance).toBeCloseTo(baseCC, 5);
      expect(bare.criticalChance).toBeCloseTo(baseCC, 5);

      const withGalvSteel = calc("skana", [slot("galvanized_steel")]);
      // Normal attack: +110% CC -> baseCC * (1 + 1.10)
      expect(withGalvSteel.criticalChance).toBeCloseTo(baseCC * 2.1, 5);

      // Heavy attack: +220% CC -> baseCC * (1 + 2.20)
      expect(withGalvSteel.heavyCriticalChance).toBeCloseTo(baseCC * 3.2, 5);
      expect(withGalvSteel.heavyCritChanceBonus).toBeCloseTo(1.1, 5);
    });

    it("Sacrificial Steel and True Steel also double crit bonus in heavyCriticalChance", () => {
      const skana = weaponsMap.get("skana")!;
      const baseCC = skana.criticalChance;

      // True Steel: +120% CC (+240% for Heavy Attacks)
      const withTrueSteel = calc("skana", [slot("true_steel_r3")]);
      expect(withTrueSteel.criticalChance).toBeCloseTo(baseCC * 2.2, 5);
      expect(withTrueSteel.heavyCriticalChance).toBeCloseTo(baseCC * 3.4, 5);
    });
  });

  describe("Issue 3: Galvanized Scope Aiming Requirement", () => {
    it("Galvanized Scope requires applyTriggerBuffs (aiming) to apply critical chance", () => {
      const braton = weaponsMap.get("braton")!;
      const baseCC = braton.criticalChance;

      // Hip-fire (applyTriggerBuffs: false) with headshots active -> NO bonus
      const hipfireWithHeadshots = calc("braton", [slot("galvanized_scope")], {
        applyHeadshots: true,
        applyTriggerBuffs: false,
        killStacks: 0,
      });
      expect(hipfireWithHeadshots.criticalChance).toBeCloseTo(baseCC, 5);

      // Hip-fire with 5 kill stacks and headshots -> STILL NO bonus
      const hipfireMaxStacks = calc("braton", [slot("galvanized_scope")], {
        applyHeadshots: true,
        applyTriggerBuffs: false,
        killStacks: 5,
      });
      expect(hipfireMaxStacks.criticalChance).toBeCloseTo(baseCC, 5);

      // Aiming (applyTriggerBuffs: true) with headshot -> +120% CC
      const aimingHeadshot = calc("braton", [slot("galvanized_scope")], {
        applyHeadshots: true,
        applyTriggerBuffs: true,
        killStacks: 0,
      });
      expect(aimingHeadshot.criticalChance).toBeCloseTo(baseCC * 2.2, 5);

      // Aiming with headshot + 5 kill stacks -> +120% + 5 * 40% = +320% CC
      const aimingMaxStacks = calc("braton", [slot("galvanized_scope")], {
        applyHeadshots: true,
        applyTriggerBuffs: true,
        killStacks: 5,
      });
      expect(aimingMaxStacks.criticalChance).toBeCloseTo(baseCC * (1 + 1.2 + 0.4 * 5), 5);

      // Aiming on body shot (applyHeadshots: false) but with 5 kill stacks from previous kills
      const aimingBodyWithKillStacks = calc("braton", [slot("galvanized_scope")], {
        applyHeadshots: false,
        applyTriggerBuffs: true,
        killStacks: 5,
      });
      expect(aimingBodyWithKillStacks.criticalChance).toBeCloseTo(baseCC * (1 + 0.4 * 5), 5);
    });
  });

  describe("Issue 4: Ammo Efficiency (AX-52 hip-fire, Rivens, and 75% cap)", () => {
    it("AX-52 in hip-fire mode defaults to +75% Ammo Efficiency", () => {
      const ax52 = weaponsMap.get("ax_52")!;
      // Default / hip-fire: ax_52_aimed_headshot is 0
      const hipfireBuffs = resolveStandaloneExternalBuffs(ax52, {
        ...DEFAULT_SIM_PARAMS,
        weaponPassiveState: { ax_52_aimed_headshot: 0 },
      });
      const hipfire = calculateWeaponBuildWithArcanes(ax52, [], modsMap, [], undefined, DEFAULT_SIM_PARAMS, {
        externalBuffs: hipfireBuffs,
      });
      expect(hipfire.ammoEfficiency).toBeCloseTo(0.75, 5);

      // Aimed mode: gains +400% CC on headshots, ammo efficiency is 0
      const aimedBuffs = resolveStandaloneExternalBuffs(ax52, {
        ...DEFAULT_SIM_PARAMS,
        applyHeadshots: true,
        weaponPassiveState: { ax_52_aimed_headshot: 1 },
      });
      const aimed = calculateWeaponBuildWithArcanes(ax52, [], modsMap, [], undefined, {
        ...DEFAULT_SIM_PARAMS,
        applyHeadshots: true,
      }, {
        externalBuffs: aimedBuffs,
      });
      expect(aimed.ammoEfficiency).toBeCloseTo(0, 5);
      expect(aimed.criticalChance).toBeCloseTo(ax52.criticalChance * (1 + 4.0), 5);
    });

    it("Spliced Riven Ammo Efficiency is capped at 75%", () => {
      const braton = weaponsMap.get("braton")!;
      // Spliced 75% AE
      const with75 = calculateWeaponBuildWithArcanes(
        braton,
        [],
        modsMap,
        [],
        undefined,
        DEFAULT_SIM_PARAMS,
        undefined,
        undefined,
        { ammoEfficiency: 0.75 },
      );
      expect(with75.ammoEfficiency).toBeCloseTo(0.75, 5);

      // Over cap (e.g. 1.0) clamps to 0.75
      const with100 = calculateWeaponBuildWithArcanes(
        braton,
        [],
        modsMap,
        [],
        undefined,
        DEFAULT_SIM_PARAMS,
        undefined,
        undefined,
        { ammoEfficiency: 1.0 },
      );
      expect(with100.ammoEfficiency).toBeCloseTo(0.75, 5);
    });
  });
});
