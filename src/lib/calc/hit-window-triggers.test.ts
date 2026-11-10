import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type SimulationParams, type Weapon } from "@/lib/types";
import { maxStacksSimParams, paperSimParams } from "@/lib/ui/sim-presets";
import { HIT_WINDOW_TRIGGERS } from "@/lib/ui/hit-window-triggers";

function requireWeapon(id: string): Weapon {
  const w = allWeapons.find((x) => x.id === id);
  if (!w) throw new Error(`Weapon not found: ${id}`);
  return w;
}

function build(weaponId: string, modId: string, sim: Partial<SimulationParams>) {
  const weapon = requireWeapon(weaponId);
  const mod = modsMap.get(modId);
  if (!mod) throw new Error(`Mod not found: ${modId}`);
  return calculateWeaponBuildWithArcanes(
    weapon,
    [{ modId, rank: mod.maxRank, slotIndex: 0 }],
    modsMap,
    [],
    undefined,
    { ...DEFAULT_SIM_PARAMS, ...sim },
  );
}

describe("named hit-window trigger controls", () => {
  it("defaults off when the flag is untouched, and Paper keeps them off", () => {
    const weapon = requireWeapon("braton");
    expect(build("braton", "double_tap", {}).moddedBaseDamage).toBeCloseTo(weapon.damage, 5);
    expect(build("braton", "motus_setup", {}).criticalChance).toBeCloseTo(weapon.criticalChance, 5);
    const paper = paperSimParams({ ...DEFAULT_SIM_PARAMS, applyDoubleTap: true, applyMotusSetup: true });
    expect(paper.applyDoubleTap).toBe(false);
    expect(paper.applyMotusSetup).toBe(false);
    expect(build("braton", "double_tap", paper).moddedBaseDamage).toBeCloseTo(weapon.damage, 5);
  });

  it("each named flag applies only that mod, without the leftover trigger bucket", () => {
    const weapon = requireWeapon("braton");
    expect(
      build("braton", "double_tap", { applyDoubleTap: true, applyTriggerBuffs: false }).moddedBaseDamage,
    ).toBeCloseTo(weapon.damage * 5, 5);
    expect(
      build("braton", "triple_tap", { applyTripleTap: true, applyTriggerBuffs: false }).moddedBaseDamage,
    ).toBeCloseTo(weapon.damage * 1.4, 5);
    expect(
      build("braton", "final_tap", { applyFinalTap: true, applyTriggerBuffs: false }).moddedBaseDamage,
    ).toBeCloseTo(weapon.damage * 2, 5);
    expect(
      build("braton", "sudden_justice", { applySuddenJustice: true, applyTriggerBuffs: false }).fireRate,
    ).toBeCloseTo(weapon.fireRate * 1.3, 5);
    const motus = build("braton", "motus_setup", { applyMotusSetup: true, applyTriggerBuffs: false });
    expect(motus.criticalChance).toBeCloseTo(weapon.criticalChance * 2, 5);
    expect(motus.statusChance).toBeCloseTo(weapon.statusChance * 2, 5);
  });

  it("an explicit false flag stays off even if the leftover trigger bucket is on", () => {
    const weapon = requireWeapon("braton");
    expect(
      build("braton", "double_tap", { applyTriggerBuffs: true, applyDoubleTap: false }).moddedBaseDamage,
    ).toBeCloseTo(weapon.damage, 5);
  });

  it("saved explicit true values persist through a merge and Max stacks turns every hit-window flag on", () => {
    const saved: SimulationParams = { ...DEFAULT_SIM_PARAMS, applyDoubleTap: true };
    const merged: SimulationParams = { ...DEFAULT_SIM_PARAMS, ...saved };
    expect(merged.applyDoubleTap).toBe(true);
    expect(merged.applyMotusSetup).toBeUndefined();
    const weapon = requireWeapon("braton");
    expect(build("braton", "double_tap", merged).moddedBaseDamage).toBeCloseTo(weapon.damage * 5, 5);
    const maxed = maxStacksSimParams(DEFAULT_SIM_PARAMS, { isMelee: false, arcaneMax: 8 });
    for (const ev of HIT_WINDOW_TRIGGERS) expect(maxed[ev.flag]).toBe(true);
    expect(maxed.applyTriggerBuffs).toBe(false);
  });

  it("exposes the Double Tap bucket so the sim sheet can show the control while the flag is off", () => {
    const stats = build("braton", "double_tap", {});
    expect(stats.triggerBuckets?.doubleTap?.damage).toBeCloseTo(4, 5);
    expect(stats.moddedBaseDamage).toBeCloseTo(requireWeapon("braton").damage, 5);
  });
});
