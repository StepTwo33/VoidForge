/**
 * Round 54b regression: drive the mod picker's own filter + search (filterPickerMods, the code
 * <ModPicker> runs on "Search mods...") for the mods users reported as missing.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allCompanions } from "@/data/companions";
import { getEffectiveWeapons } from "@/lib/weapons/effective-data";
import { filterPickerMods } from "@/components/mod-picker-filter";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { companionPreceptModsForBuilder, companionStatModsForBuilder } from "@/lib/mods/companion-precept-eligibility";
import { isCompanionPostureMod, modFitsCompanionWeapon, resolveDefaultCompanionWeapon } from "@/lib/weapons/companion-weapons";

const weapons = getEffectiveWeapons();

function weaponSearch(weaponId: string, search: string): string[] {
  const weapon = weapons.find((w) => w.id === weaponId)!;
  expect(weapon, weaponId).toBeTruthy();
  return filterPickerMods({
    mods: allMods,
    category: getModCategory(weapon.category),
    slotType: "regular",
    search,
    weaponCategory: weapon.category,
    weaponModProfile: getWeaponModProfile(weapon),
    weapon,
  }).map((m) => m.name);
}

describe("Blood Rush in the weapon-builder picker (soapydragon report)", () => {
  const melee = ["skana", "nikana_prime", "exalted_blade", "talons", "tenet_exec", "kuva_shildeg", "zaw_plague_kripath"];
  for (const id of melee) {
    it(`${id}: found by "Blood Rush", "blood rush", "blood", "BLOOD", "rush"`, () => {
      for (const q of ["Blood Rush", "blood rush", "blood", "BLOOD", "rush"]) {
        expect(weaponSearch(id, q), `${id} / ${q}`).toContain("Blood Rush");
      }
    });
  }
  it("still blocked on sentinel weapons (wiki SENTINEL_WEAPON incompatibility)", () => {
    const sentinelMelee = weapons.find((w) => w.category === "sentinel_weapon" && /prime|sword|deconstructor/i.test(w.name));
    if (sentinelMelee) expect(weaponSearch(sentinelMelee.id, "blood")).not.toContain("Blood Rush");
  });
});

function companionPools(companionId: string) {
  const companion = allCompanions.find((c) => c.id === companionId)!;
  const precepts = companionPreceptModsForBuilder(companion, allMods);
  const stats = companionStatModsForBuilder(companion, allMods, ["universal", "beast"]);
  const companionPool = [...new Map([...precepts, ...stats].map((m) => [m.id, m])).values()];
  const claw = resolveDefaultCompanionWeapon(companion, weapons)!;
  const weaponPool = allMods.filter((m) => modFitsCompanionWeapon(m, claw) && !isCompanionPostureMod(m));
  const search = (pool: typeof allMods, q: string) =>
    filterPickerMods({ mods: pool, category: "_prefiltered", slotType: "regular", search: q }).map((m) => m.name);
  return { claw, companionSearch: (q: string) => search(companionPool, q), weaponSearch: (q: string) => search(weaponPool, q) };
}

describe("Vulpaphyla mods in the companion builder", () => {
  for (const id of ["panzer_vulpaphyla", "sly_vulpaphyla", "crescent_vulpaphyla"]) {
    it(`${id}: Martyr Symbiosis in the companion panel (wiki Type = Vulpaphyla precept)`, () => {
      const p = companionPools(id);
      expect(p.companionSearch("martyr")).toContain("Martyr Symbiosis");
      expect(p.weaponSearch("martyr")).not.toContain("Martyr Symbiosis");
    });
    it(`${id}: Immunity Resistance on the claws (wiki Type = Claws, Beast Claws mod)`, () => {
      const p = companionPools(id);
      expect(p.claw.category).toBe("beast_claw");
      expect(p.weaponSearch("immunity")).toContain("Immunity Resistance");
      expect(p.companionSearch("immunity")).not.toContain("Immunity Resistance");
    });
  }
  it("Martyr Symbiosis is not offered to non-Vulpaphyla beasts", () => {
    expect(companionPools("smeeta").companionSearch("martyr")).not.toContain("Martyr Symbiosis");
  });
});
