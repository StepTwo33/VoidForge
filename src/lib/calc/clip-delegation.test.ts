import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = new Map(allMods.map((mod) => [mod.id, mod]));
const sobek = allWeapons.find((weapon) => weapon.id === "sobek")!;
const clip = modsMap.get("clip_delegation")!;

function build(shots: number, rank = clip.maxRank) {
  return calculateWeaponBuild(
    sobek,
    [{ modId: "clip_delegation", rank, slotIndex: 0 }],
    modsMap,
    undefined,
    { ...DEFAULT_SIM_PARAMS, clipDelegationShots: shots },
  );
}

describe("Clip Delegation", () => {
  it("adds status and multishot per shot landed, not magazine size", () => {
    const bare = calculateWeaponBuild(sobek, [], modsMap, undefined, DEFAULT_SIM_PARAMS);
    const empty = build(0);
    const full = build(15);

    expect(empty.magazine).toBeCloseTo(bare.magazine, 5);
    expect(full.magazine).toBeCloseTo(bare.magazine, 5);
    expect(empty.statusChance).toBeCloseTo(bare.statusChance, 5);
    expect(empty.multishot).toBeCloseTo(bare.multishot, 5);

    // Rank 5 is +15% status and multishot per shot, 15 shots.
    expect(full.statusChance).toBeCloseTo(bare.statusChance * (1 + 0.15 * 15), 5);
    expect(full.multishot).toBeCloseTo(bare.multishot * (1 + 0.15 * 15), 5);
  });

  it("uses the equipped rank for the per-shot bonus", () => {
    const bare = calculateWeaponBuild(sobek, [], modsMap, undefined, DEFAULT_SIM_PARAMS);
    const rank0 = build(10, 0);
    expect(rank0.statusChance).toBeCloseTo(bare.statusChance * (1 + 0.05 * 10), 5);
  });
});
