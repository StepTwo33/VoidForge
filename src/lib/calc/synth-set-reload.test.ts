/**
 * Round 44b parity change (Jason-approved): the Synth set no longer adds +15% reload speed to
 * pistols at 4 pieces. wiki.warframe.com/w/Synth_Set lists only "Holstering Primary and Secondary
 * weapons reload X% of their Magazine per second" (5/10/15/20% at 1–4 pieces), which does not
 * change the equipped weapon's reload time.
 */
import { describe, expect, it } from "vitest";
import { modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { buildWeaponSetBonusSummary } from "@/lib/calc/set-bonuses";
import { DEFAULT_SIM_PARAMS, type ModSlot } from "@/lib/types";

const lato = allWeapons.find((w) => w.id === "lato")!;
const synthCharge: ModSlot[] = [{ modId: "synth_charge_r3", rank: 3, slotIndex: 0 }];
const reload = (mods: ModSlot[], extra = 0, linkage?: Parameters<typeof calculateWeaponBuild>[5]) =>
  calculateWeaponBuild(lato, mods, modsMap, undefined, { ...DEFAULT_SIM_PARAMS, extraSynthSetPiecesOffWeapon: extra }, undefined, linkage)
    .reloadTime;

describe("Synth set: no pistol reload-speed bonus (wiki Synth_Set)", () => {
  it("4 pieces via the off-weapon slider leave Lato's reload at its base 1.0 s (was 1/1.15 = 0.870 s)", () => {
    expect(reload([])).toBeCloseTo(lato.reloadTime, 9);
    expect(reload(synthCharge, 3)).toBeCloseTo(reload(synthCharge, 0), 9);
    expect(reload(synthCharge, 3)).toBeCloseTo(lato.reloadTime, 9);
  });

  it("4 pieces across a linked loadout also leave reload unchanged", () => {
    const linkage = {
      warframeMods: [{ modId: "synth_reflex_r3", rank: 3, slotIndex: 0 }],
      companionMods: [
        { modId: "synth_fiber", rank: modsMap.get("synth_fiber")!.maxRank, slotIndex: 0 },
        { modId: "synth_deconstruct", rank: modsMap.get("synth_deconstruct")!.maxRank, slotIndex: 1 },
      ],
    };
    expect(reload(synthCharge, 0, linkage)).toBeCloseTo(lato.reloadTime, 9);
  });

  it("the set summary still counts 4/4 pieces and states the wiki holster-reload text", () => {
    const line = buildWeaponSetBonusSummary(lato, synthCharge, undefined, { extraSynthSetPiecesOffWeapon: 3 }).find((l) => l.setId === "synth")!;
    expect(line.pieces).toBe(4);
    expect(line.description).toContain("reload 5% of their magazine per second");
  });
});
