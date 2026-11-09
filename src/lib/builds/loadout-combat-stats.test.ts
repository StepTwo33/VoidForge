import { describe, expect, it } from "vitest";
import { loadoutCombatStatCells } from "@/lib/builds/loadout-combat-stats";
import type { WarframeCalculatedStats } from "@/lib/types";

describe("loadout combat summary", () => {
  it("keeps EHP and Sprint and lists Duration, Efficiency, Range, Strength", () => {
    const cells = loadoutCombatStatCells({
      effectiveHealth: 1200,
      totalSprint: 1.25,
      abilityDuration: 1.2,
      abilityEfficiency: 1,
      abilityRange: 1.45,
      abilityStrength: 1.3,
    } as WarframeCalculatedStats);
    expect(cells.map((cell) => cell.label)).toEqual([
      "EHP",
      "Sprint",
      "Duration",
      "Efficiency",
      "Range",
      "Strength",
    ]);
    expect(cells.find((cell) => cell.label === "Range")?.value).toBe("145%");
    expect(cells.find((cell) => cell.label === "Duration")?.value).toBe("120%");
    expect(cells.find((cell) => cell.label === "Strength")?.value).toBe("130%");
  });
});
