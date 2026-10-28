import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { getModPickerStatFilters, getModStatFilterTags } from "@/lib/mods/mod-stat-filters";

const tags = (id: string) => [...getModStatFilterTags(modsMap.get(id)!)].sort();
const reachable = (id: string, chips: string) =>
  getModPickerStatFilters(chips).some((f) => f.id !== "all" && getModStatFilterTags(modsMap.get(id)!).has(f.id));

describe("Round 24: Necramech and companion-weapon chips", () => {
  it("the Necramech mods the wiki lists all match at least one chip", () => {
    // Pressure Point (+60% Melee Damage) and Seismic Wave (+45% Slam Attack Damage) have no chip that
    // fits: the Warframe chip set (also used for Necramechs) has no Damage chip.
    const known = new Set(["necramech_pressure_point", "necramech_seismic_wave"]);
    const orphans = allMods
      .filter((m) => m.category === "necramech" && !known.has(m.id))
      .filter((m) => !reachable(m.id, "necramech"))
      .map((m) => m.id);
    expect(orphans).toEqual([]);
  });

  it("companion weapon mods (Claws) match a chip in the weapon chip set", () => {
    const orphans = allMods
      .filter((m) => m.category === "companion_weapon" && m.subCategory === "beast_weapon")
      .filter((m) => !reachable(m.id, "primary"))
      .map((m) => m.id);
    expect(orphans).toEqual([]);
  });

  it("hand-checked wiki examples", () => {
    expect(tags("necramech_reach")).toEqual(["range"]); // +1 Melee Range
    expect(tags("necramech_efficiency")).toContain("efficiency"); // +30% Engine Efficiency
    expect(tags("necramech_thrusters")).toEqual(["utility"]); // +100% Engine Max
    expect(tags("bell_ringer")).toEqual(["status"]); // +4 Impact Status Effects
    expect(tags("bloodthirst")).toEqual(["utility"]);
  });
});
