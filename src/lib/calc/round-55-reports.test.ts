import { describe, it, expect } from "vitest";
import { applyCostAugments, isHildrynFrame, HILDRYN_SUBSUME_SHIELD_MULTIPLIER } from "@/lib/calc/ability-augment-rows";
import { getVerifiedMiscScaling } from "@/lib/codex/ability-scaling-registry";
import { scaleAbilityMiscStats } from "@/lib/codex/ability-misc-stats";
import { allWeapons } from "@/data/weapons";
import { getRivenBaseName, getRivenBaseWeapon, isRivenVariant, getEffectiveRivenWeaponType, getRivenFamilyWeaponIds } from "@/lib/weapons/riven-family";
import { formatRivenStatLine } from "@/components/riven-library";

describe("Round 55 Bug Reports", () => {
  describe("Report 1: Hildryn subsume shield cost", () => {
    it("recognizes hildryn and hildryn_prime as shield-casting frames", () => {
      expect(isHildrynFrame("hildryn")).toBe(true);
      expect(isHildrynFrame("hildryn_prime")).toBe(true);
      expect(isHildrynFrame("excalibur")).toBe(false);
    });

    it("converts energy cost to shield cost at 10x multiplier", () => {
      const baseEnergyCost = 50; // e.g. Roar or Pillage
      const shieldCost = baseEnergyCost * HILDRYN_SUBSUME_SHIELD_MULTIPLIER;
      expect(shieldCost).toBe(500);
    });
  });

  describe("Report 2: Nekros Despoil health per corpse", () => {
    it("replaces energyPerCorpse with healthPerCorpse when Despoil is equipped", () => {
      const desecrate = {
        name: "Desecrate",
        description: "Forces fallen enemies around you to drop additional loot. Costs 10 energy per corpse.",
        miscStats: {
          energyPerCorpse: 10,
          dropTableChance: 0.54,
        },
      };

      const withDespoil = applyCostAugments(desecrate, ["augment_nekros_despoil"]);
      expect(withDespoil.miscStats.healthPerCorpse).toBe(10);
      expect(withDespoil.miscStats.energyPerCorpse).toBeUndefined();
      expect(withDespoil.description).toContain("health per corpse");
    });

    it("scales healthPerCorpse with efficiency (cast_cost)", () => {
      const scaling = getVerifiedMiscScaling("nekros", "Desecrate", "healthPerCorpse");
      expect(scaling).toEqual({ scale: "efficiency", formula: "cast_cost" });

      const lines = scaleAbilityMiscStats(
        { healthPerCorpse: 10 },
        { efficiency: 1.75, strength: 1, duration: 1, range: 1 },
        { warframeId: "nekros", abilityName: "Desecrate" },
      );
      expect(lines[0].label).toBe("Health per Corpse");
      expect(lines[0].scaled).toBe("2.5");
      expect(lines[0].modified).toBe(true);
    });
  });

  describe("Report 3: Riven weapon variants", () => {
    it("identifies variants and maps to base weapon", () => {
      expect(isRivenVariant("acceltra_prime")).toBe(true);
      expect(getRivenBaseWeapon("acceltra_prime").name).toBe("Acceltra");

      expect(isRivenVariant("kuva_nukor")).toBe(true);
      expect(getRivenBaseWeapon("kuva_nukor").name).toBe("Nukor");
    });

    it("family IDs include both base and variants", () => {
      const nukorFamily = getRivenFamilyWeaponIds("kuva_nukor");
      expect(nukorFamily).toContain("nukor");
      expect(nukorFamily).toContain("kuva_nukor");
    });
  });

  describe("Report 4: Faction damage format on rivens", () => {
    it("formats faction damage as a multiplier e.g. 1.55x", () => {
      // 0.55 bonus -> 1.55x damage to faction
      const line = formatRivenStatLine("factionGrineer", 0.55, "rifle");
      expect(line).toBe("1.55x Damage to Grineer");
    });
  });

  describe("Report 5: Kitgun and Zaw modular riven categories", () => {
    it("classifies Sporelacer and kitguns under Kitgun category", () => {
      const sporelacer = allWeapons.find((w) => w.name === "Sporelacer")!;
      expect(getEffectiveRivenWeaponType(sporelacer)).toBe("Kitgun");
    });

    it("classifies plague kripath and zaws under Zaw category", () => {
      const kripath = allWeapons.find((w) => w.name === "Plague Kripath")!;
      expect(getEffectiveRivenWeaponType(kripath)).toBe("Zaw");
    });
  });
});
