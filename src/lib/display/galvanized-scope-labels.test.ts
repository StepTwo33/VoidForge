import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { getModStatDisplayLines } from "@/lib/display/mod-display";

const byId = new Map(allMods.map((mod) => [mod.id, mod]));

function critLabels(id: string): string[] {
  const mod = byId.get(id);
  if (!mod) throw new Error(`missing mod ${id}`);
  return getModStatDisplayLines(mod, mod.maxRank)
    .filter((line) => line.statKey.startsWith("criticalChanceOnHeadshot"))
    .map((line) => line.label);
}

describe("weak-point crit mod summaries", () => {
  it("Galvanized Scope card says weak point, matching the wiki body", () => {
    expect(critLabels("galvanized_scope")).toEqual([
      "Crit chance on weak point",
      "Crit chance per weak point kill",
    ]);
  });

  it("Galvanized Crosshairs, Argon Scope, and Hydraulic Crosshairs use the same weak-point labels", () => {
    expect(critLabels("galvanized_crosshairs")).toEqual([
      "Crit chance on weak point",
      "Crit chance per weak point kill",
    ]);
    expect(critLabels("argon_scope")).toEqual(["Crit chance on weak point"]);
    expect(critLabels("hydraulic_crosshairs")).toEqual(["Crit chance on weak point"]);
  });
});
