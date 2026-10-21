import { describe, expect, it } from "vitest";
import {
  applyPolarityOverride,
  effectiveSlotPolarities,
  innateSlotPolarities,
} from "@/lib/builds/innate-polarities";
import { computeUsedCapacity } from "@/lib/calc/compute-used-capacity";

describe("exalted weapon grids read their innate polarities (R10-C)", () => {
  const innate = innateSlotPolarities("weapon", "exalted_blade");

  it("Exalted Blade: madurai, madurai, naramon in slots 0-2", () => {
    expect(innate).toEqual({ 0: "madurai", 1: "madurai", 2: "naramon" });
  });

  it("capacity uses the innate slot: a max-rank 14-drain madurai mod in slot 0 costs 7, not 14", () => {
    const mods = new Map([["m", { drain: 4, polarity: "madurai" }]]);
    // drain 4 at rank 10 = 14; matched polarity halves it, rounding up (7).
    const eq = [{ modId: "m", rank: 10, slotIndex: 0 }];
    expect(computeUsedCapacity(eq, mods, {})).toBe(14);
    expect(computeUsedCapacity(eq, mods, effectiveSlotPolarities(innate, {}))).toBe(7);
  });

  it("forma over a default stays an override; removing it stores 'none'", () => {
    const o1 = applyPolarityOverride({}, innate, 0, "vazarin");
    expect(o1).toEqual({ 0: "vazarin" });
    expect(applyPolarityOverride(o1, innate, 0, "madurai")).toEqual({});
    expect(applyPolarityOverride({}, innate, 2, null)).toEqual({ 2: "none" });
    expect(effectiveSlotPolarities(innate, { 2: "none" })).toEqual({ 0: "madurai", 1: "madurai" });
  });
});
