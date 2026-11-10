import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { modsMap } from "@/data/mods";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { DEFAULT_SIM_PARAMS, type WeaponExternalBuff } from "@/lib/types";

const weapon = (id: string) => allWeapons.find((w) => w.id === id)!;
const slot = (modId: string, rank?: number) => ({ modId, rank: rank ?? modsMap.get(modId)!.maxRank, slotIndex: 0 });

describe("Recoil row", () => {
  it("includes always-on recoil mods at their rank (Steady Hands -60% at max)", () => {
    const s = calculateWeaponBuild(weapon("lex"), [slot("steady_hands")], modsMap, undefined, DEFAULT_SIM_PARAMS);
    expect(s.recoil).toBeCloseTo(-0.6, 5);
  });

  it("leaves slide-only mods out", () => {
    const s = calculateWeaponBuild(weapon("lex"), [slot("strafing_slide")], modsMap, undefined, DEFAULT_SIM_PARAMS);
    expect(s.recoil ?? 0).toBe(0);
  });

  it("caps mods plus Overdrive at -100%", () => {
    const overdrive = { id: "overdrive", label: "Overdrive", recoil: -1 } as unknown as WeaponExternalBuff;
    const s = calculateWeaponBuild(weapon("athodai"), [slot("steady_hands")], modsMap, undefined, DEFAULT_SIM_PARAMS, {
      externalBuffs: [overdrive],
    });
    expect(s.recoil).toBe(-1);
  });
});
