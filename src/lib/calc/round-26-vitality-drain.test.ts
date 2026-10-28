import { describe, expect, it } from "vitest";
import { modCapacityAtRank, modSlotCapacityCost } from "./mod-capacity";

/**
 * Round 26 item 9. wiki.warframe.com/w/Vitality: Vazarin, base cost 2, rank 10 costs 12.
 * wiki.warframe.com/w/Mods (Installation): matching polarity halves, rounded up;
 * non-matching adds a quarter, rounded mathematically
 * (drain 2-5 +1, 6-9 +2, 10-13 +3, 14-16 +4).
 */
describe("Vitality drain in a mismatched slot (Round 26)", () => {
  it("rank 10 Vitality is 12 base, 15 in a Madurai slot, 6 in a Vazarin slot", () => {
    const r10 = modCapacityAtRank(2, 10);
    expect(r10).toBe(12);
    expect(modSlotCapacityCost(r10, "madurai", "vazarin")).toBe(15);
    expect(modSlotCapacityCost(r10, "vazarin", "vazarin")).toBe(6);
    expect(modSlotCapacityCost(r10, "universal", "vazarin")).toBe(6);
    expect(modSlotCapacityCost(r10, undefined, "vazarin")).toBe(12);
  });

  it("matches the wiki's rounding table for mismatched slots", () => {
    const extra = (d: number) => modSlotCapacityCost(d, "madurai", "naramon") - d;
    for (const d of [0, 1]) expect(extra(d)).toBe(0);
    for (const d of [2, 3, 4, 5]) expect(extra(d)).toBe(1);
    for (const d of [6, 7, 8, 9]) expect(extra(d)).toBe(2);
    for (const d of [10, 11, 12, 13]) expect(extra(d)).toBe(3);
    for (const d of [14, 15, 16]) expect(extra(d)).toBe(4);
  });
});
