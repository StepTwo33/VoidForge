import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import {
  MOD_FILTER_TAGS_BY_ID,
  getModPickerStatFilters,
  getModStatFilterTags,
} from "@/lib/mods/mod-stat-filters";

const tags = (id: string) => [...getModStatFilterTags(modsMap.get(id)!)].sort();

describe("Round 23: companion / Railjack / Archwing filter chips", () => {
  it("every companion mod matches at least one companion chip", () => {
    const ids = new Set(getModPickerStatFilters("companion").map((f) => f.id));
    const orphans = allMods
      .filter((m) => m.category === "companion")
      .filter((m) => ![...getModStatFilterTags(m)].some((t) => ids.has(t)))
      .map((m) => m.id);
    expect(orphans).toEqual([]);
  });

  it("every Railjack Plexus mod matches at least one Railjack chip, and the set is Railjack-shaped", () => {
    const chips = getModPickerStatFilters("railjack");
    expect(chips.map((f) => f.id)).toEqual(["all", "damage", "crit", "speed", "survivability", "utility"]);
    const ids = new Set(chips.map((f) => f.id));
    const railjack = allMods.filter((m) => m.category === "railjack");
    expect(railjack.length).toBe(49);
    const orphans = railjack.filter((m) => ![...getModStatFilterTags(m)].some((t) => ids.has(t))).map((m) => m.id);
    expect(orphans).toEqual([]);
  });

  it("Archwing weapon pickers (archgun / archmelee) use the weapon chip set", () => {
    for (const cat of ["archgun", "archmelee"]) {
      expect(getModPickerStatFilters(cat).map((f) => f.id)).toEqual(
        getModPickerStatFilters("primary").map((f) => f.id),
      );
    }
  });

  it("hand-checked wiki examples", () => {
    // Frenzied Posture: +80% Status Duration. Hunter Command: Slash Status makes the companion attack.
    expect(tags("frenzied_posture")).toContain("status");
    expect(tags("hunter_command")).toContain("status");
    // Primed Regen / Regen: revive with 10s invulnerability.
    expect(tags("primed_regen")).toContain("survivability");
    // Coolant Leak: 10m radial Cold blast.
    expect(tags("coolant_leak")).toContain("damage");
    // Railjack: Hyperstrike (turret damage), Predator (turret crit), Cruising Speed (engine speed).
    expect(tags("hyperstrike")).toContain("damage");
    expect(tags("predator")).toContain("crit");
    expect(tags("cruising_speed")).toContain("speed");
    expect(tags("quicklock")).toEqual(["utility"]);
  });

  it("the id table does not alter any Warframe or weapon mod", () => {
    const ids = Object.keys(MOD_FILTER_TAGS_BY_ID);
    const nonScoped = ids.filter((id) => {
      const c = modsMap.get(id)?.category;
      return c !== "companion" && c !== "railjack";
    });
    expect(nonScoped).toEqual([]);
  });

  it("key additions did not move other mods' chips (examples)", () => {
    expect(tags("hunter_track")).toEqual([]);
    expect(tags("rifle_elementalist")).toEqual(["range", "utility"]);
    expect(tags("augment_khora_pilfering_strangledome")).toEqual(["augment"]);
  });
});
