import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { customWeapons } from "@/data/custom-items";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import { getEffectiveRivenWeaponType, getBaseRivenWeapons } from "@/lib/weapons/riven-family";
import { evaluateRiven, type RivenStat } from "@/lib/calc/riven-calculator";
import { formatArcaneRankDescription } from "@/lib/display/arcane-display";
import { applyCostAugments } from "@/lib/calc/ability-augment-rows";
import { scaleAbilityMiscStats } from "@/lib/codex/ability-misc-stats";
import { DISCOVER_CATEGORIES } from "@/lib/builds/discover-subtypes";
import { resolveBuildItemDisplay } from "@/lib/builds/build-item-display";
import { builderCtaForFilter } from "@/lib/builds/builder-cta";
import { allArcanes } from "@/data/arcanes";

describe("Round 55 - Additional Community Reports", () => {
  describe("Report 1: Companion Weapon Rivens category", () => {
    it("classifies sentinel weapons and hound weapons as Companion riven category", () => {
      const allSource = [...allWeapons, ...customWeapons];
      const artax = allSource.find((w) => w.id === "artax");
      const sweeper = allSource.find((w) => w.id === "sweeper");
      const deconstructor = allSource.find((w) => w.id === "deconstructor");
      const akaten = allSource.find((w) => w.id === "akaten");

      expect(artax).toBeDefined();
      expect(sweeper).toBeDefined();
      expect(deconstructor).toBeDefined();
      expect(akaten).toBeDefined();

      expect(getEffectiveRivenWeaponType(artax!)).toBe("Companion");
      expect(getEffectiveRivenWeaponType(sweeper!)).toBe("Companion");
      expect(getEffectiveRivenWeaponType(deconstructor!)).toBe("Companion");
      expect(getEffectiveRivenWeaponType(akaten!)).toBe("Companion");
    });

    it("preserves underlying stat mod classes for companion weapons", () => {
      const allSource = [...allWeapons, ...customWeapons];
      const artax = allSource.find((w) => w.id === "artax")!;
      const sweeper = allSource.find((w) => w.id === "sweeper")!;
      const deconstructor = allSource.find((w) => w.id === "deconstructor")!;
      const akaten = allSource.find((w) => w.id === "akaten")!;

      expect(getRivenWeaponType(artax)).toBe("Rifle");
      expect(getRivenWeaponType(sweeper)).toBe("Shotgun");
      expect(getRivenWeaponType(deconstructor)).toBe("Melee");
      expect(getRivenWeaponType(akaten)).toBe("Melee");
    });

    it("includes companion weapons in base riven eligible weapons", () => {
      const baseWeapons = getBaseRivenWeapons();
      expect(baseWeapons.some((w) => w.id === "artax")).toBe(true);
      expect(baseWeapons.some((w) => w.id === "sweeper")).toBe(true);
      expect(baseWeapons.some((w) => w.id === "deconstructor")).toBe(true);
      expect(baseWeapons.some((w) => w.id === "akaten")).toBe(true);
    });
  });

  describe("Report 2: Riven Spliced Stats evaluation", () => {
    it("adds value to the riven grade when spliced stats are present", () => {
      const cc: RivenStat = {
        name: "Critical Chance",
        type: "percent",
        baseValue: 150,
        minValue: 90,
        maxValue: 200,
      };
      const viral: RivenStat = {
        name: "Viral Damage (Spliced)",
        type: "percent",
        baseValue: 90,
        minValue: 54.5,
        maxValue: 119.9,
        spliced: true,
      };
      const baseRiven = {
        weaponName: "Braton",
        polarity: "madurai",
        rank: 8,
        rerolls: 0,
        positiveStats: [cc],
        negativeStat: null,
        disposition: 1,
      };

      const scoreWithout = evaluateRiven(baseRiven);
      const scoreWith = evaluateRiven({ ...baseRiven, positiveStats: [cc, viral] });

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });
  });

  describe("Report 3: Arcane descriptions scale with selected rank", () => {
    it("scales numbers in arcane description according to the rank", () => {
      const fury = allArcanes.find((a) => a.id === "arcane_fury");
      expect(fury).toBeDefined();

      const maxDesc = formatArcaneRankDescription(fury!, 5);
      const r0Desc = formatArcaneRankDescription(fury!, 0);

      expect(maxDesc).toContain("180%");
      expect(maxDesc).toContain("60%");

      // At rank 0, values should scale down (30% melee damage, 10% chance)
      expect(r0Desc).toContain("30%");
      expect(r0Desc).toContain("10%");
      expect(r0Desc).not.toContain("180%");
    });
  });

  describe("Report 4: Yareli Loyal Merulina augment", () => {
    it("updates Merulina description and adds efficiency-scaled attack cooldown", () => {
      const baseMerulina = {
        name: "Merulina",
        energyCost: 25,
        description: "Summon Merulina, a rideable creature of the waves.",
        miscStats: {
          merulinaHealth: 7500,
          damageRedirection: 0.9,
        },
      };

      const augmented = applyCostAugments(baseMerulina, ["loyal_merulina"]);

      expect(augmented.description).toContain("Loyal Merulina");
      expect(augmented.miscStats?.seaSnareCooldown).toBe(2);
      expect(augmented.miscStats?.seaSnareRange).toBe(15);

      // Verify efficiency scaling: at 175% efficiency, 2s cooldown scales down to 0.5s
      const scaledRows = scaleAbilityMiscStats(
        augmented.miscStats!,
        {
          strength: 1,
          duration: 1,
          efficiency: 1.75,
          range: 1,
        },
        {
          warframeId: "yareli",
          abilityName: "Merulina",
        },
      );

      const cdRow = scaledRows.find((r) => r.label === "Sea Snare Cooldown");
      expect(cdRow).toBeDefined();
      expect(cdRow?.scaled).toBe("0.5s");

      // Verify normal efficiency: at 100% efficiency, 2s cooldown stays 2s
      const normalRows = scaleAbilityMiscStats(
        augmented.miscStats!,
        {
          strength: 1,
          duration: 1,
          efficiency: 1.0,
          range: 1,
        },
        {
          warframeId: "yareli",
          abilityName: "Merulina",
        },
      );
      const normalCdRow = normalRows.find((r) => r.label === "Sea Snare Cooldown");
      expect(normalCdRow?.scaled).toBe("2s");
    });
  });

  describe("Report 5: Vehicle label on /discover", () => {
    it("labels the archwing category as Vehicles on /discover", () => {
      const category = DISCOVER_CATEGORIES.find((c) => c.id === "archwing");
      expect(category).toBeDefined();
      expect(category?.label).toBe("Vehicles");
    });

    it("uses Vehicle typeLabel in build item display and builder CTA", () => {
      const display = resolveBuildItemDisplay("archwing", "odonata");
      expect(display.typeLabel).toBe("Vehicle");

      const cta = builderCtaForFilter("archwing");
      expect(cta.label).toBe("Open Vehicle Builder");
      expect(cta.href).toBe("/archwing-builder");
    });
  });
});
