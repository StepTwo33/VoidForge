import { describe, expect, it } from "vitest";
import { buildRivenStats, rivenDisplayName, splitRivenStats } from "./riven-form";

describe("riven dialog form helpers", () => {
  it("treats negative recoil as a buff and positive recoil as a curse", () => {
    expect(splitRivenStats({ criticalChance: 1.2, recoil: -0.6 })).toEqual({
      positives: [{ key: "criticalChance", value: 1.2 }, { key: "recoil", value: 0.6 }],
      negative: null,
    });
    expect(splitRivenStats({ multishot: 0.9, recoil: 0.5 }).negative).toEqual({ key: "recoil", value: 0.5 });
  });

  it("round-trips signs", () => {
    const stats = { criticalChance: 1.2, recoil: -0.6, zoom: -0.3 };
    const { positives, negative } = splitRivenStats(stats);
    expect(buildRivenStats(positives, negative)).toEqual(stats);
    expect(buildRivenStats([{ key: "multishot", value: 0.9 }], { key: "recoil", value: 0.5 })).toEqual({
      multishot: 0.9,
      recoil: 0.5,
    });
  });

  it("keeps a custom name exactly as typed (no doubled weapon name)", () => {
    expect(rivenDisplayName("Torid", "Crita-visitron", "Torid")).toBe("Torid");
    expect(rivenDisplayName("Torid", "Crita-visitron", "My lucky Torid")).toBe("My lucky Torid");
    expect(rivenDisplayName("Torid", "Crita-visitron", "  ")).toBe("Torid Crita-visitron");
  });
});
