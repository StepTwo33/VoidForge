import { describe, expect, it } from "vitest";
import { warframeStatSummary, weaponStatSummary } from "./mobile-stat-summary";
import type { CalculatedStats, WarframeCalculatedStats } from "@/lib/types";

describe("mobile stat summary", () => {
  it("returns nothing without stats", () => {
    expect(warframeStatSummary(null)).toEqual([]);
    expect(weaponStatSummary(null)).toEqual([]);
  });

  it("warframe: uses the same totals and formatting as the full panel", () => {
    const s = { totalHealth: 740.4, totalShield: 370, totalArmor: 105, totalEnergy: 225, effectiveHealth: 1738.6 } as WarframeCalculatedStats;
    expect(warframeStatSummary(s).map((i) => [i.label, i.value])).toEqual([
      ["HP", "740"],
      ["Shield", "370"],
      ["Armor", "105"],
      ["Energy", "225"],
      ["Eff. HP", "1739"],
    ]);
  });

  it("weapon: DPS totals, CC %, CD multiplier (crit damage) and SC %", () => {
    const s = { burstDps: 1285.4, sustainedDps: 857.2, criticalChance: 0.32, criticalMultiplier: 2.8, statusChance: 0.06 } as CalculatedStats;
    const items = weaponStatSummary(s);
    expect(items.map((i) => [i.label, i.value])).toEqual([
      ["Burst DPS", "1285"],
      ["Sust. DPS", "857"],
      ["CC", "32.0%"],
      ["CD", "2.80x"],
      ["SC", "6.0%"],
    ]);
    expect(items.find((i) => i.key === "cd")?.title).toMatch(/critical damage/i);
  });
});
