import { describe, expect, it } from "vitest";
import { allWeapons } from "@/data/weapons";
import { customWeapons } from "@/data/custom-items";
import { allHelminthAbilities } from "@/data/helminth";
import { helminthToAbility } from "@/lib/builds/helminth-resolve";
import { isHildrynFrame, HILDRYN_SUBSUME_SHIELD_MULTIPLIER, applyCostAugments } from "@/lib/calc/ability-augment-rows";
import { getBaseRivenWeapons, getEffectiveRivenWeaponType, getRivenFamilyWeaponIds } from "@/lib/weapons/riven-family";
import { rivenModMatchesWeapon, isZawWeapon, isKitgunWeapon } from "@/lib/weapons/riven-weapon-type";
import { modFitsCompanionWeapon } from "@/lib/weapons/companion-weapons";
import { evaluateRiven, type RivenStat } from "@/lib/calc/riven-calculator";
import { formatArcaneRankDescription, getArcaneDisplayInfo } from "@/lib/display/arcane-display";
import { allArcanes } from "@/data/arcanes";
import { computeStyanaxHopliteCritChance } from "@/lib/codex/ability-misc-stats";
import { calcLoadoutStats } from "@/lib/builds/loadout-stats";
import { POLARITIES as DIALOG_POLARITIES } from "@/components/rivens/riven-dialog";
import { POLARITIES as STORAGE_POLARITIES } from "@/lib/rivens/riven-storage";
import { modMatchesExclusiveWeapon } from "@/lib/mods/weapon-mod-tags";
import type { Loadout, Weapon } from "@/lib/types";

describe("Round 56 - Issue Reports Verification", () => {
  const allSourceWeapons = [...allWeapons, ...customWeapons];

  describe("1. Hildryn Subsumed Abilities Shield Cost", () => {
    it("converts energy cost to 0 and sets miscStats.shieldCost = energyCost * 10 when subsumed onto Hildryn", () => {
      const roar = allHelminthAbilities.find((h) => h.name === "Roar")!;
      expect(roar).toBeDefined();

      const roarOnExcalibur = helminthToAbility(roar, "excalibur");
      expect(roarOnExcalibur.energyCost).toBe(roar.energyCost ?? 75);
      expect(roarOnExcalibur.miscStats?.shieldCost).toBeUndefined();

      const roarOnHildryn = helminthToAbility(roar, "hildryn");
      expect(roarOnHildryn.energyCost).toBe(0);
      expect(roarOnHildryn.miscStats?.shieldCost).toBe((roar.energyCost ?? 75) * HILDRYN_SUBSUME_SHIELD_MULTIPLIER);

      const roarOnHildrynPrime = helminthToAbility(roar, "hildryn_prime");
      expect(roarOnHildrynPrime.energyCost).toBe(0);
      expect(roarOnHildrynPrime.miscStats?.shieldCost).toBe((roar.energyCost ?? 75) * HILDRYN_SUBSUME_SHIELD_MULTIPLIER);
    });
  });

  describe("2. Nekros Despoil Health per Corpse", () => {
    it("converts Desecrate energyPerCorpse to healthPerCorpse and sets energyCost to 0", () => {
      const desecrate = {
        name: "Desecrate",
        energyCost: 10,
        description: "Costs 10 energy per corpse.",
        miscStats: {
          energyPerCorpse: 10,
          dropTableChance: 0.54,
        },
      };

      const augmented = applyCostAugments(desecrate, ["augment_nekros_despoil"]);
      expect(augmented.energyCost).toBe(0);
      expect(augmented.miscStats.healthPerCorpse).toBe(10);
      expect(augmented.miscStats.energyPerCorpse).toBeUndefined();
      expect(augmented.description).toContain("health per corpse (Despoil)");
    });
  });

  describe("3. Rivens: Base Weapons Only and Polarities", () => {
    it("only includes base weapons in getBaseRivenWeapons and excludes Prime/Kuva/Tenet/Wraith variants", () => {
      const baseWeapons = getBaseRivenWeapons();
      const baseIds = new Set(baseWeapons.map((w) => w.id));

      expect(baseIds.has("acceltra")).toBe(true);
      expect(baseIds.has("acceltra_prime")).toBe(false);

      expect(baseIds.has("nukor")).toBe(true);
      expect(baseIds.has("kuva_nukor")).toBe(false);

      expect(baseIds.has("bramma")).toBe(false);
      expect(baseIds.has("kuva_bramma")).toBe(true); // Kuva Bramma is base
    });

    it("restricts riven polarities to madurai, vazarin, and naramon (no zenurik)", () => {
      expect(DIALOG_POLARITIES).toEqual(["madurai", "vazarin", "naramon"]);
      expect(STORAGE_POLARITIES).toEqual(["madurai", "vazarin", "naramon"]);
      expect(DIALOG_POLARITIES).not.toContain("zenurik");
      expect(STORAGE_POLARITIES).not.toContain("zenurik");
    });
  });

  describe("4. Companion Weapon Rivens & Beast Companion Restrictions", () => {
    it("categorizes all companion weapons under Companion effective riven type", () => {
      const deconstructor = allSourceWeapons.find((w) => w.id === "deconstructor")!;
      const artax = allSourceWeapons.find((w) => w.id === "artax")!;
      const akaten = allSourceWeapons.find((w) => w.id === "akaten")!;

      expect(getEffectiveRivenWeaponType(deconstructor)).toBe("Companion");
      expect(getEffectiveRivenWeaponType(artax)).toBe("Companion");
      expect(getEffectiveRivenWeaponType(akaten)).toBe("Companion");
    });

    it("allows companion_weapon_riven_mod on sentinel weapons but denies on beast claws", () => {
      const deconstructor = allSourceWeapons.find((w) => w.id === "deconstructor")!;
      const sentinelMod = {
        id: "companion_weapon_riven_mod",
        category: "companion_weapon",
        subCategory: "riven",
      } as const;

      expect(modFitsCompanionWeapon(sentinelMod as never, deconstructor as never)).toBe(true);

      const beastClaws = {
        id: "smeeta_claws",
        category: "beast_claw",
      };
      expect(modFitsCompanionWeapon(sentinelMod as never, beastClaws as never)).toBe(false);
    });
  });

  describe("5. Riven Spliced Stats Quality & Grader", () => {
    it("awards high grade bonus for spliced stats in evaluateRiven", () => {
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
      const multishot: RivenStat = {
        name: "Multishot",
        type: "percent",
        baseValue: 110,
        minValue: 70,
        maxValue: 150,
      };
      const curse: RivenStat = {
        name: "Zoom",
        type: "percent",
        baseValue: -45,
        minValue: -60,
        maxValue: -30,
      };

      const rivenWithSpliced = {
        weaponName: "Torid",
        polarity: "madurai",
        rank: 8,
        rerolls: 10,
        positiveStats: [cc, multishot, viral],
        negativeStat: curse,
        disposition: 1.2,
      };

      const score = evaluateRiven(rivenWithSpliced);
      // Spliced stats now receive 1.3x magnitude multiplier and weight >= 0.9, allowing 3+1 rolls to achieve top tier
      expect(score).toBeGreaterThan(5.0);
    });
  });

  describe("6. Arcane Rank-Scaled Descriptions", () => {
    it("returns rank-scaled description in getArcaneDisplayInfo", () => {
      const strike = allArcanes.find((a) => a.id === "arcane_strike");
      expect(strike).toBeDefined();

      const r5 = getArcaneDisplayInfo(strike!, 5);
      const r0 = getArcaneDisplayInfo(strike!, 0);

      expect(r5.description).toContain("60%");
      expect(r0.description).toContain("10%");
      expect(r0.description).not.toContain("60%");
    });
  });

  describe("7. Cross-Equipment Loadout Boosts", () => {
    it("calculates Styanax Hoplite passive CC based on shields (+1% per 40 shields, double for Speargun)", () => {
      const normalCc = computeStyanaxHopliteCritChance(400, { speargun: false });
      expect(normalCc).toBeCloseTo(0.10, 5); // 400 / 40 = 10%

      const speargunCc = computeStyanaxHopliteCritChance(400, { speargun: true });
      expect(speargunCc).toBeCloseTo(0.20, 5); // 2x = 20%
    });

    it("applies Hunter Synergy and Mecha Overdrive in loadout stats for companion weapons", () => {
      const loadout: Loadout = {
        id: "test_loadout",
        name: "Synergy Test",
        primaryBuild: {
          weaponId: "soma_prime",
          mods: [
            { modId: "point_strike_r3", rank: 5, slotIndex: 0 }, // +150% CC
          ],
        },
        companionBuild: {
          companionId: "smeeta",
          mods: [
            { modId: "hunter_synergy", rank: 5, slotIndex: 0 }, // +30% of Primary modded CC
            { modId: "mecha_overdrive", rank: 5, slotIndex: 1 }, // +60% of Primary modded SC
          ],
          weaponMods: [
            { modId: "pressure_point", rank: 5, slotIndex: 0 },
          ],
        },
      };

      const stats = calcLoadoutStats(loadout);
      expect(stats.primary).toBeDefined();
      expect(stats.companion).toBeDefined();
      expect(stats.companion?.weapon).toBeDefined();

      // Soma Prime base CC is 30%. With Point Strike (+150%), modded CC is 75%.
      // Hunter Synergy (Rank 5 = 30%) gives 75% * 0.30 = 22.5% flat CC to companion weapon.
      expect(stats.primary!.stats.criticalChance).toBeCloseTo(0.75, 2);
      expect(stats.companion!.weapon!.stats.criticalChance).toBeGreaterThan(0.20);
    });
  });

  describe("8. Modular Builder & Riven Weapon Type Partitioning", () => {
    it("strictly partitions riven types between Zaw, Kitgun, Sentinel, and standard Melee", () => {
      const nikana = allSourceWeapons.find((w) => w.id === "nikana")!;
      const deconstructor = allSourceWeapons.find((w) => w.id === "deconstructor")!;
      const ballaStrike = allSourceWeapons.find((w) => w.id === "zaw_balla")!;
      const catchmoon = allSourceWeapons.find((w) => w.id === "catchmoon_chamber")!;

      expect(rivenModMatchesWeapon("zaw_riven_mod", ballaStrike)).toBe(true);
      expect(rivenModMatchesWeapon("riven_melee", ballaStrike)).toBe(false);

      expect(rivenModMatchesWeapon("kitgun_riven_mod", catchmoon)).toBe(true);
      expect(rivenModMatchesWeapon("riven_pistol", catchmoon)).toBe(false);

      expect(rivenModMatchesWeapon("companion_weapon_riven_mod", deconstructor)).toBe(true);
      expect(rivenModMatchesWeapon("riven_melee", deconstructor)).toBe(false);

      expect(rivenModMatchesWeapon("riven_melee", nikana)).toBe(true);
      expect(rivenModMatchesWeapon("zaw_riven_mod", nikana)).toBe(false);
      expect(rivenModMatchesWeapon("companion_weapon_riven_mod", nikana)).toBe(false);
    });

    it("resolves Riven family weapon IDs for assembled modular weapons", () => {
      const modularZaw = "zaw_zaw_balla_peye_vargeet_jai";
      const familyZaw = getRivenFamilyWeaponIds(modularZaw);
      expect(familyZaw).toContain("zaw_balla");

      const modularKitgun = "kitgun_catchmoon_chamber_haymaker_splat";
      const familyKitgun = getRivenFamilyWeaponIds(modularKitgun);
      expect(familyKitgun).toContain("catchmoon_chamber");
    });
  });

  describe("9. Weapon Augments on Weapon Variants", () => {
    it("allows weapon-exclusive augments to match weapon variants via Riven family", () => {
      expect(modMatchesExclusiveWeapon("acid_shells", "sobek")).toBe(true);
      expect(modMatchesExclusiveWeapon("acid_shells", "kuva_sobek")).toBe(true);

      expect(modMatchesExclusiveWeapon("scattered_justice", "hek")).toBe(true);
      expect(modMatchesExclusiveWeapon("scattered_justice", "vaykor_hek")).toBe(true);
      expect(modMatchesExclusiveWeapon("scattered_justice", "kuva_hek")).toBe(true);
    });
  });
});
