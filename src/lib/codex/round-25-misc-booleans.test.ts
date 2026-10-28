import { describe, expect, it } from "vitest";
import { scaleAbilityMiscStats } from "./ability-misc-stats";

describe("Round 25: ability misc stats show yes/no instead of raw booleans", () => {
  const ctx = { strength: 1, duration: 1, range: 1, efficiency: 1 };

  it("renders true as Yes and false as No", () => {
    const lines = scaleAbilityMiscStats({ impactStatus: true, weakPoint: false }, ctx);
    expect(lines.find((l) => l.label === "Impact Status")).toMatchObject({ base: "Yes", scaled: "Yes" });
    expect(lines.find((l) => l.label === "Weak Point")).toMatchObject({ base: "No", scaled: "No" });
  });

  it("leaves numeric values untouched", () => {
    const lines = scaleAbilityMiscStats({ armorStripCap: 1 }, ctx);
    expect(lines.find((l) => l.label === "Armor Strip Cap")?.base).toBe("1");
  });
});
