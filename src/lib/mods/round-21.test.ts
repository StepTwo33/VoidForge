/**
 * Round 21: companion builder stat chips, and the wrong-value fixes from the Oct 27 dev review.
 * Expected card text is worked by hand from wiki.warframe.com stat tables quoted in each case.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { getModPickerStatFilters, getModStatFilterTags } from "@/lib/mods/mod-stat-filters";

const ids = (category: string) => getModPickerStatFilters(category, "regular").map((f) => f.id);

describe("companion builder stat chips (D: `_prefiltered` fell through to the Warframe chip set)", () => {
  it("companion pool uses the companion chips, weapon pool the weapon chips", () => {
    expect(ids("companion")).toEqual(["all", "survivability", "damage", "crit", "status", "utility"]);
    expect(ids("primary")).toEqual(["all", "damage", "crit", "status", "multishot", "speed", "range", "utility"]);
    // The old fall-through: Strength / Efficiency / Augment chips that no companion mod can match.
    expect(ids("_prefiltered")).toContain("strength");
    const comp = allMods.filter((m) => m.category === "companion");
    for (const chip of ["strength", "efficiency", "augment"] as const) {
      expect(comp.filter((m) => getModStatFilterTags(m).has(chip))).toHaveLength(0);
    }
  });

  it("the companion builder passes the chip category for each picker target", () => {
    const src = readFileSync("src/app/companion-builder/page.tsx", "utf8");
    expect(src).toMatch(/statFilterCategory=\{modPickerTarget === "weapon" \? "primary" : "companion"\}/);
    expect(src).toMatch(/category="_prefiltered"/);
  });

  it("companion health/shield/armor mods land under Survivability", () => {
    // Link Vitality: +health (wiki: companion Health); Link Fiber: +armor.
    for (const id of ["link_vitality", "link_fiber"]) {
      expect(getModStatFilterTags(modsMap.get(id)!).has("survivability"), id).toBe(true);
    }
  });
});
