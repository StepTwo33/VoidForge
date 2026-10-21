/**
 * Round 17: picker filter tags. Every mod with a damage resistance / damage reduction stat is under
 * Survivability (and not under Damage unless it also has a real damage stat).
 */
import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { getModEffectiveStatKeys, getModStatFilterTags } from "@/lib/mods/mod-stat-filters";

const mod = (id: string) => modsMap.get(id)!;
const tags = (id: string) => [...getModStatFilterTags(mod(id))].sort();

/** A stat that resists, reduces, redirects or reflects damage taken (not enemy armor/shield strip). */
const RESIST_KEY = /Resistance|DamageReduction|^damageReduction|DamageRedirect|^damageRedirect|^damageResistance|^evasion$/;

describe("filters: resistance / DR stats are Survivability, not Damage", () => {
  const resistMods = allMods.filter((m) => getModEffectiveStatKeys(m).some((k) => RESIST_KEY.test(k)));

  it("finds the Round 15b–17 resistance mods", () => {
    const ids = new Set(resistMods.map((m) => m.id));
    for (const id of [
      "adaptation", "aerodynamic", "agility_drift", "antitoxin", "aura_toxin_resistance", "aviator", "diamond_skin",
      "flame_repellent_r3", "insulation_r3", "lightning_rod_r3", "shock_absorbers", "resilient_focus", "fortitude",
      "power_drift", "sure_footed_r5", "primed_sure_footed", "umbra_vitality", "umbra_fiber", "umbra_intensify",
      "warding_thurible", "immolated_radiance", "ironclad_flight", "necramech_aviator", "armored_evade",
      "armored_acrobatics", "armored_recovery", "stand_ground", "anti_flak_plating", "augment_nekros_shield_of_shadows",
      "electromagnetic_shielding", "orgone_tuning_matrix", "loyal_companion",
    ]) expect(ids, id).toContain(id);
  });

  it("every mod with a resistance / DR stat is tagged Survivability", () => {
    const missing = resistMods.filter((m) => !getModStatFilterTags(m).has("survivability")).map((m) => m.id);
    expect(missing).toEqual([]);
  });

  it("no resistance-only mod is tagged Damage", () => {
    const bad = resistMods
      .filter((m) => getModEffectiveStatKeys(m).every((k) => RESIST_KEY.test(k) || !/damage/i.test(k)))
      .filter((m) => getModStatFilterTags(m).has("damage"))
      .map((m) => m.id);
    expect(bad).toEqual([]);
  });

  it("memberships from the before/after table", () => {
    expect(tags("antitoxin")).toEqual(["survivability"]);
    expect(tags("adaptation")).toEqual(["survivability"]);
    expect(tags("aerodynamic")).toEqual(["speed", "survivability", "utility"]);
    expect(tags("agility_drift")).toEqual(["survivability", "utility"]); // utility kept (was Accuracy)
    expect(tags("power_drift")).toEqual(["strength", "survivability"]);
    expect(tags("armored_recovery")).toEqual(["speed", "survivability"]);
    expect(tags("stasis_field")).toEqual(["survivability", "utility"]);
    expect(tags("augment_nekros_shield_of_shadows")).toEqual(["augment", "range", "survivability", "utility"]);
    expect(tags("mortal_conduct")).toEqual(["survivability"]);
    expect(tags("orgone_tuning_matrix")).toEqual(["survivability", "utility"]);
    expect(tags("suppress_r3")).toEqual(["utility"]);
    // Unchanged: real damage mods keep Damage.
    expect(tags("energy_channel_r10")).toContain("damage");
    expect(tags("charged_chamber")).toContain("damage");
  });
});
