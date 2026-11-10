import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuildWithArcanes } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type SimulationParams } from "@/lib/types";

function build(weaponId: string, modIds: string[], sim: Partial<SimulationParams> = {}) {
  const weapon = allWeapons.find((x) => x.id === weaponId)!;
  return calculateWeaponBuildWithArcanes(
    weapon,
    modIds.map((modId, slotIndex) => ({ modId, rank: modsMap.get(modId)!.maxRank, slotIndex })),
    modsMap,
    [],
    undefined,
    { ...DEFAULT_SIM_PARAMS, ...sim },
  );
}

describe("Other buffs switch: which mods it covers", () => {
  it("lists leftover trigger mods and not named-switch mods", () => {
    const s = build("lex", ["pain_points"]);
    expect(s.triggerOtherModIds).toContain("pain_points");
    const named = build("latron", ["double_tap"]);
    expect(named.triggerOtherModIds ?? []).not.toContain("double_tap");
  });

  it("is empty for a build with no leftover trigger mods", () => {
    expect(build("braton", ["split_chamber_r3", "heavy_caliber"]).triggerOtherModIds ?? []).toEqual([]);
  });
});
