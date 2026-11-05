import { describe, expect, it } from "vitest";
import { clampRivenDrain, normalizeRivenPolarity, validateRivenStats } from "@/lib/riven/riven-validation";
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
    expect(clampRivenDrain(99)).toBe(30);
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
