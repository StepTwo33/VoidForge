import { describe, expect, it } from "vitest";
import {
  critTiersToShow,
  critTierLabel,
  exceedsWarframeInt32,
  WF_DAMAGE_INT_MAX,
} from "@/lib/calc/crit-utils";

describe("critTiersToShow", () => {
  it("always shows yellow/orange/red even below 100% CC", () => {
    expect(critTiersToShow(0)).toEqual([1, 2, 3]);
    expect(critTiersToShow(0.5)).toEqual([1, 2, 3]);
  });

  it("keeps yellow/orange/red at 100–199% CC", () => {
    expect(critTiersToShow(1)).toEqual([1, 2, 3]);
    expect(critTiersToShow(1.5)).toEqual([1, 2, 3]);
  });

  it("keeps yellow/orange/red at 200% CC", () => {
    expect(critTiersToShow(2)).toEqual([1, 2, 3]);
  });

  it("adds unlimited higher tiers as CC climbs past 300%", () => {
    expect(critTiersToShow(3.2)).toEqual([1, 2, 3, 4]);
    expect(critTiersToShow(4)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("critTierLabel", () => {
  it("labels yellow/orange/red then generic tier", () => {
    expect(critTierLabel(1)).toBe("Yellow crit");
    expect(critTierLabel(2)).toBe("Orange crit");
    expect(critTierLabel(3)).toBe("Red crit");
    expect(critTierLabel(4)).toBe("Tier 4 crit");
  });
});

describe("exceedsWarframeInt32", () => {
  it("flags values above signed 32-bit max", () => {
    expect(exceedsWarframeInt32(WF_DAMAGE_INT_MAX)).toBe(false);
    expect(exceedsWarframeInt32(WF_DAMAGE_INT_MAX + 1)).toBe(true);
    expect(exceedsWarframeInt32(-(WF_DAMAGE_INT_MAX + 1))).toBe(true);
  });
});
