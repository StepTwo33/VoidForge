import { describe, expect, it } from "vitest";
import { allWarframes } from "@/data/warframes";
import { allArcanes } from "@/data/arcanes";
import { applyWarframeShardsAndArcanes, calculateWarframeBuild } from "./calculator";
import { addStatusResistance } from "./status-resistance";

const excal = allWarframes.find((w) => w.id === "excalibur")!;
const arc = (id: string) => allArcanes.find((a) => a.id === id)!;

describe("arcane status resistance is per element (R15-4)", () => {
  it("two resist arcanes stay separate instead of summing to 204%", () => {
    const s = applyWarframeShardsAndArcanes(calculateWarframeBuild(excal, [], new Map()), undefined, [
      arc("arcane_ice"),
      arc("arcane_nullifier"),
    ]);
    expect(s.statusResistances).toEqual([
      { element: "Heat", chance: 100, sources: ["Arcane Ice"] },
      { element: "Magnetic", chance: 100, sources: ["Arcane Nullifier"] },
    ]);
  });

  it("lower ranks: 17% per rank (R2 = 51%)", () => {
    const s = applyWarframeShardsAndArcanes(calculateWarframeBuild(excal, [], new Map()), undefined, [arc("arcane_warmth")], [2]);
    expect(s.statusResistances?.[0].element).toBe("Cold");
    expect(s.statusResistances?.[0].chance).toBeCloseTo(51, 6);
  });

  it("same element combines as independent rolls, capped at 100%", () => {
    const stats: { statusResistances?: { element: string; chance: number; sources: string[] }[] } = {};
    addStatusResistance(stats, "Cold", 50, "A");
    addStatusResistance(stats, "Cold", 50, "B");
    // 1 − 0.5 × 0.5 = 75%
    expect(stats.statusResistances).toEqual([{ element: "Cold", chance: 75, sources: ["A", "B"] }]);
    addStatusResistance(stats, "Cold", 102, "C");
    expect(stats.statusResistances?.[0].chance).toBe(100);
  });
});
