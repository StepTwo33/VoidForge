import { describe, expect, it } from "vitest";
import { parseSavedRivenRow, sanitizeRivenMasteryRank, sanitizeRivenRerolls } from "./saved-rivens";

describe("saved riven rerolls and mastery rank", () => {
  it("clamps rerolls to whole numbers and keeps unknown as null", () => {
    expect(sanitizeRivenRerolls(12.4)).toBe(12);
    expect(sanitizeRivenRerolls(-3)).toBe(0);
    expect(sanitizeRivenRerolls(undefined)).toBeNull();
    expect(sanitizeRivenRerolls("5")).toBeNull();
  });

  it("clamps mastery rank to 8-16", () => {
    expect(sanitizeRivenMasteryRank(3)).toBe(8);
    expect(sanitizeRivenMasteryRank(14)).toBe(14);
    expect(sanitizeRivenMasteryRank(40)).toBe(16);
    expect(sanitizeRivenMasteryRank(null)).toBeNull();
  });

  it("reads rows saved before the columns existed as unknown", () => {
    const row = {
      id: "r1", weaponId: "torid", name: "Torid Crita-visitron", modId: "riven_rifle",
      stats: '{"criticalChance":1.2}', polarity: "madurai", drain: 15,
      createdAt: new Date(0), updatedAt: new Date(0),
    };
    expect(parseSavedRivenRow(row)).toMatchObject({ drain: 15, rerolls: null, masteryRank: null });
    expect(parseSavedRivenRow({ ...row, rerolls: 7, masteryRank: 13 })).toMatchObject({ rerolls: 7, masteryRank: 13 });
  });
});
