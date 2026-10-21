import { describe, expect, it } from "vitest";
import { INNATE_POLARITIES } from "@/data/innate-polarities";
import {
  NO_POLARITY,
  applyPolarityOverride,
  effectiveSlotPolarities,
  innateSlotPolarities,
  isInnatePolarity,
} from "./innate-polarities";
import { computeWarframeAuraBonus, computeWarframeCapacityUsed, computeUsedCapacity } from "@/lib/calc/compute-used-capacity";
import { modSlotCapacityCost } from "@/lib/calc/mod-capacity";
import type { Mod } from "@/lib/types";

const VALID = new Set(["madurai", "vazarin", "naramon", "zenurik", "unairu", "penjaga", "umbra", "universal"]);

describe("innate polarity data", () => {
  it("covers every builder kind with only valid polarity names", () => {
    const kinds = new Set(Object.keys(INNATE_POLARITIES).map((k) => k.split(":")[0]));
    expect([...kinds].sort()).toEqual(["archwing", "companion", "necramech", "warframe", "weapon"]);
    for (const [key, e] of Object.entries(INNATE_POLARITIES)) {
      for (const p of [...(e.slots ?? []), e.aura, e.aura2, e.exilus, e.stance].filter(Boolean)) {
        expect(VALID.has(p as string), `${key}: ${p}`).toBe(true);
      }
      // Regular slots never reach the exilus index (weapon 8 / warframe 9).
      expect((e.slots ?? []).length).toBeLessThanOrEqual(8);
    }
  });

  it("matches WFCD + wiki for sampled items", () => {
    expect(INNATE_POLARITIES["warframe:wisp_prime"]).toEqual({ slots: ["madurai", "vazarin", "naramon"], aura: "naramon" });
    expect(INNATE_POLARITIES["warframe:grendel"]).toEqual({ slots: ["naramon", "vazarin", "vazarin"], aura: "naramon" });
    expect(INNATE_POLARITIES["warframe:sevagoth_prime"]?.slots).toEqual(["vazarin", "naramon", "madurai"]);
    expect(INNATE_POLARITIES["necramech:voidrig"]).toEqual({ slots: ["madurai", "vazarin", "naramon"] });
  });

  it("leaves out fields where WFCD and the wiki disagree", () => {
    expect(INNATE_POLARITIES["warframe:lavos"]?.aura).toBeUndefined();
    expect(INNATE_POLARITIES["warframe:voruna"]?.aura).toBeUndefined();
    expect(INNATE_POLARITIES["warframe:jade"]?.aura2).toBeUndefined();
  });
});

describe("innateSlotPolarities", () => {
  it("places warframe aura at 0 and regular slots from 1", () => {
    expect(innateSlotPolarities("warframe", "wisp_prime")).toEqual({ 0: "naramon", 1: "madurai", 2: "vazarin", 3: "naramon" });
  });
  it("places warframe exilus at 9", () => {
    const khora = innateSlotPolarities("warframe", "khora");
    expect(khora[9]).toBe(INNATE_POLARITIES["warframe:khora"]?.exilus);
  });
  it("places weapon slots from 0", () => {
    expect(innateSlotPolarities("weapon", "praedos")).toEqual({ 0: "madurai", 1: "naramon" });
  });
  it("returns nothing for unknown items", () => {
    expect(innateSlotPolarities("weapon", "no_such_weapon")).toEqual({});
    expect(innateSlotPolarities("weapon", undefined)).toEqual({});
  });
});

describe("overrides on top of innate defaults", () => {
  const innate = { 0: "naramon", 1: "madurai", 2: "vazarin" };

  it("imported / user forma replaces the default, others stay", () => {
    expect(effectiveSlotPolarities(innate, { 1: "vazarin", 5: "madurai" })).toEqual({
      0: "naramon", 1: "vazarin", 2: "vazarin", 5: "madurai",
    });
  });

  it("Remove polarity on an innate slot stores 'none' and clears it", () => {
    const next = applyPolarityOverride({}, innate, 1, null);
    expect(next).toEqual({ 1: NO_POLARITY });
    expect(effectiveSlotPolarities(innate, next)[1]).toBeUndefined();
    expect(isInnatePolarity(innate, next, 1)).toBe(false);
  });

  it("Remove polarity on a non-innate slot deletes the override", () => {
    expect(applyPolarityOverride({ 5: "madurai" }, innate, 5, null)).toEqual({});
  });

  it("picking the innate polarity again drops the override", () => {
    expect(applyPolarityOverride({ 1: NO_POLARITY }, innate, 1, "madurai")).toEqual({});
    expect(isInnatePolarity(innate, {}, 1)).toBe(true);
  });

  it("'none' is neutral for capacity", () => {
    expect(modSlotCapacityCost(10, NO_POLARITY, "madurai")).toBe(10);
    expect(modSlotCapacityCost(-7, NO_POLARITY, "naramon")).toBe(-7);
  });
});

describe("capacity with innate defaults", () => {
  const mod = (id: string, polarity: string, drain: number): Mod =>
    ({ id, name: id, polarity, drain, maxRank: 10, rarity: "rare", stats: {} }) as unknown as Mod;
  const mods = new Map<string, Mod>([
    ["intensify", mod("intensify", "madurai", 6)],
    ["vitality", mod("vitality", "vazarin", 2)],
    ["corrosive_projection", mod("corrosive_projection", "naramon", -4)],
  ]);
  const innate = innateSlotPolarities("warframe", "wisp_prime"); // aura naramon, 1 madurai, 2 vazarin, 3 naramon
  const equipped = [
    { modId: "corrosive_projection", rank: 5, slotIndex: 0 },
    { modId: "intensify", rank: 5, slotIndex: 1 },
    { modId: "vitality", rank: 10, slotIndex: 3 },
  ];

  it("matching innate slots halve drain, mismatches add 25%", () => {
    const eff = effectiveSlotPolarities(innate, {});
    // intensify 11 on madurai -> 6; vitality 12 on naramon -> 15
    expect(computeWarframeCapacityUsed(equipped, mods, eff, [0])).toBe(6 + 15);
    // aura -9 on naramon aura slot -> doubled 18
    expect(computeWarframeAuraBonus(equipped, mods, eff, [0])).toBe(18);
  });

  it("without innate defaults the old numbers are unchanged (parity)", () => {
    expect(computeWarframeCapacityUsed(equipped, mods, {}, [0])).toBe(11 + 12);
    expect(computeWarframeAuraBonus(equipped, mods, {}, [0])).toBe(9);
    expect(computeUsedCapacity(equipped, mods, {})).toBe(-9 + 11 + 12);
  });

  it("a user forma overrides the default for capacity", () => {
    const eff = effectiveSlotPolarities(innate, { 3: "vazarin" });
    expect(computeWarframeCapacityUsed(equipped, mods, eff, [0])).toBe(6 + 6);
  });
});
