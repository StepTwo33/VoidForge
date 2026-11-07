import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type ModSlot, type SimulationParams } from "@/lib/types";

const modsMap = new Map(allMods.map((m) => [m.id, m]));
const daikyu = allWeapons.find((w) => w.id === "daikyu")!;
const tigris = allWeapons.find((w) => w.id === "tigris" || w.id === "tigris_prime") ?? allWeapons.find((w) => w.category === "shotgun")!;

function slot(id: string, rank?: number): ModSlot {
  const mod = modsMap.get(id);
  if (!mod) throw new Error(`Mod ${id} not found`);
  return {
    modId: id,
    rank: rank ?? mod.maxRank,
    slotIndex: 0,
  };
}

describe("Daikyu Augments and Conditionals", () => {
  it("Amalgam Daikyu Target Acquired grants +75% headshot damage multiplier when headshots are active", () => {
    const baseHead = calculateWeaponBuild(daikyu, [], modsMap, undefined, {
      ...DEFAULT_SIM_PARAMS,
      applyHeadshots: true,
    });
    const withAmalgam = calculateWeaponBuild(
      daikyu,
      [slot("amalgam_daikyu_target_acquired")],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyHeadshots: true },
    );

    expect(withAmalgam.headshotDamageBonus).toBeCloseTo(0.75, 4);
    // Headshot damage ratio should be 1.75× the baseline headshot DPS
    expect(withAmalgam.burstDps / baseHead.burstDps).toBeCloseTo(1.75, 4);
  });

  it("Spring-Loaded Broadhead gives +40% damage conditionally when target is >15m (trigger buffs active)", () => {
    const bareDaikyu = calculateWeaponBuild(daikyu, [], modsMap);
    const closeTarget = calculateWeaponBuild(
      daikyu,
      [slot("spring_loaded_broadhead")],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyTriggerBuffs: false },
    );
    const farTarget = calculateWeaponBuild(
      daikyu,
      [slot("spring_loaded_broadhead")],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyTriggerBuffs: true },
    );

    expect(closeTarget.totalDamage).toBeCloseTo(bareDaikyu.totalDamage, 4);
    expect(farTarget.totalDamage).toBeCloseTo(bareDaikyu.totalDamage * 1.4, 4);
  });

  it("Shrapnel Shot activates +99% Critical Multiplier on kill stacks (not trigger buffs)", () => {
    const bareTigris = calculateWeaponBuild(tigris, [], modsMap);
    const noKill = calculateWeaponBuild(
      tigris,
      [slot("shrapnel_shot")],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, killStacks: 0 },
    );
    const withKill = calculateWeaponBuild(
      tigris,
      [slot("shrapnel_shot")],
      modsMap,
      undefined,
      { ...DEFAULT_SIM_PARAMS, killStacks: 1 },
    );

    expect(noKill.criticalMultiplier).toBeCloseTo(bareTigris.criticalMultiplier, 4);
    expect(withKill.criticalMultiplier).toBeCloseTo(bareTigris.criticalMultiplier * 1.99, 4);
  });
});
