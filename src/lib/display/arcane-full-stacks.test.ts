import { describe, expect, it } from "vitest";
import { allArcanes } from "@/data/arcanes";
import { getArcaneDisplayInfo } from "@/lib/display/arcane-display";

// R11-S4: Warframe stacking arcanes are always calculated at full stacks; the display says so.
describe("arcane display fullStacks", () => {
  const get = (id: string) => {
    const a = allArcanes.find((x) => x.id === id)!;
    return getArcaneDisplayInfo(a, a.maxRank);
  };
  it("Molt Augmented is labelled with its 250-stack cap", () => {
    expect(get("molt_augmented").fullStacks).toBe(250);
  });
  it("non-stacking arcanes have no label", () => {
    expect(get("molt_efficiency").fullStacks).toBeUndefined();
  });
});
