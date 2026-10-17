import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { sumInitialComboFromMods } from "@/lib/calc/melee-combo";

const modsMap = new Map(allMods.map((m) => [m.id, m]));

describe("R9-C1 Corrupt Charge (wiki.gg + fandom table: +7.5/15/22.5/30 combo, -12.5…-50% duration)", () => {
  it("initial combo per rank rounds to 8/15/23/30", () => {
    expect([0, 1, 2, 3].map((rank) => sumInitialComboFromMods([{ modId: "corrupt_charge", rank, slotIndex: 0 }], modsMap))).toEqual([8, 15, 23, 30]);
  });
  it("no attack speed stat", () => {
    const m = modsMap.get("corrupt_charge")!;
    expect(m.stats.attackSpeed).toBeUndefined();
    expect(m.stats.comboDuration! * 4).toBe(-50);
  });
});
