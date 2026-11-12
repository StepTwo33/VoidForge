import { describe, expect, it } from "vitest";
import { WEAPON_CATEGORY_LABELS, weaponMatchesCategoryFilter } from "./weapon-categories";

describe("weapon catalog category chips", () => {
  it("labels the slot-wide chips as All primary / All secondary so they are not confused with Rifles / Pistols", () => {
    expect(WEAPON_CATEGORY_LABELS.primary).toBe("All primary");
    expect(WEAPON_CATEGORY_LABELS.rifle).toBe("Rifles");
    expect(WEAPON_CATEGORY_LABELS.secondary).toBe("All secondary");
    expect(WEAPON_CATEGORY_LABELS.pistol).toBe("Pistols");
  });

  it("All primary matches rifles, shotguns, bows, and launchers, but not pistols or melee", () => {
    for (const cat of ["rifle", "shotgun", "bow", "launcher", "primary"]) {
      expect(weaponMatchesCategoryFilter(cat, "primary"), cat).toBe(true);
    }
    expect(weaponMatchesCategoryFilter("pistol", "primary")).toBe(false);
    expect(weaponMatchesCategoryFilter("melee", "primary")).toBe(false);
    expect(weaponMatchesCategoryFilter("sentinel_weapon", "primary")).toBe(false);
  });

  it("Rifles matches only the rifle category; All secondary matches pistols", () => {
    expect(weaponMatchesCategoryFilter("rifle", "rifle")).toBe(true);
    expect(weaponMatchesCategoryFilter("shotgun", "rifle")).toBe(false);
    expect(weaponMatchesCategoryFilter("pistol", "secondary")).toBe(true);
    expect(weaponMatchesCategoryFilter("dual_pistols", "secondary")).toBe(true);
    expect(weaponMatchesCategoryFilter("rifle", "secondary")).toBe(false);
  });
});
