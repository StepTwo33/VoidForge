import { describe, expect, it } from "vitest";
import { RIVEN_POLARITIES, clampRivenDrain, normalizeRivenPolarity, rivenDrainFromRank, rivenPolarityError, rivenRankFromDrain, validateRivenStats } from "@/lib/riven/riven-validation";
import { rivenPolarityFromUpgrade } from "@/lib/warframe-arsenal/riven-resolve";
import { sanitizeRivenStats } from "@/lib/riven/saved-rivens";

describe("Round 54 riven validation", () => {
  it("needs 2–3 positives and at most 1 negative", () => {
    expect(validateRivenStats({ criticalChance: 1 }, "rifle").ok).toBe(false);
    expect(validateRivenStats({ criticalChance: 1, criticalDamage: 0.8 }, "rifle").ok).toBe(true);
    expect(validateRivenStats({ criticalChance: 1, criticalDamage: 0.8, multishot: 0.7, zoom: -0.3 }, "rifle").ok).toBe(true);
  });
  it("rejects zero values", () => {
    expect(validateRivenStats({ criticalChance: 1, criticalDamage: 0 }, "rifle").ok).toBe(false);
  });
  it("clamps drain and normalizes polarity", () => {
    // Round 54b: drain is 10 + rank (getRivenDrain), 10 at rank 0, capped at 18 at rank 8.
    expect(clampRivenDrain(99)).toBe(18);
    expect(clampRivenDrain(0)).toBe(10);
    expect(rivenRankFromDrain(18)).toBe(8);
    expect(rivenDrainFromRank(3)).toBe(13);
    expect(RIVEN_POLARITIES).toEqual(["madurai", "naramon", "vazarin"]);
    expect(rivenPolarityError("universal")).not.toBeNull();
    expect(rivenPolarityError("zenurik")).not.toBeNull();
    expect(rivenPolarityError("vazarin")).toBeNull();
    expect(normalizeRivenPolarity("MADURAI")).toBe("madurai");
    expect(normalizeRivenPolarity("zenurik")).toBe("universal");
  });
  it("maps DE polarity tags from the arsenal export", () => {
    expect(rivenPolarityFromUpgrade({ pol: "AP_ATTACK" })).toBe("madurai");
    expect(rivenPolarityFromUpgrade({ pol: "AP_TACTIC" })).toBe("naramon");
    expect(rivenPolarityFromUpgrade({})).toBeUndefined();
  });
  it("sanitizes stored stats", () => {
    expect(sanitizeRivenStats({ a: 1, b: "x" })).toBeNull();
    expect(sanitizeRivenStats({ criticalChance: 1 })).toEqual({ criticalChance: 1 });
  });
});
