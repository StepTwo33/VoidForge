import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { getExcludedMods } from "@/data/mod-exclusions";
import { isWarframeExilusMod } from "@/lib/mods/mod-slot-categories";
import {
  modEligibleForWeaponSlot,
} from "@/lib/mods/mod-weapon-eligibility";
import {
  warframeAugmentEligibleInBuilder,
} from "@/lib/mods/warframe-augment-mods";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";

const modsById = new Map(allMods.map((m) => [m.id, m]));
const weaponsById = new Map(allWeapons.map((w) => [w.id, w]));

function primaryEligible(weaponId: string, modId: string): boolean {
  const weapon = weaponsById.get(weaponId)!;
  const mod = modsById.get(modId)!;
  return modEligibleForWeaponSlot(
    mod,
    "primary",
    weapon.category,
    "regular",
    getWeaponModProfile(weapon),
  );
}

describe("polarity spot-checks", () => {
  it("Archon Stretch is Naramon", () => {
    expect(modsById.get("archon_stretch")?.polarity).toBe("naramon");
  });

  it("Galvanized Elementalist is Vazarin", () => {
    expect(modsById.get("galvanized_elementalist")?.polarity).toBe("vazarin");
  });

  it("Galvanized Aptitude is Vazarin", () => {
    expect(modsById.get("galvanized_aptitude")?.polarity).toBe("vazarin");
  });
});

describe("Primed Sure Footed", () => {
  it("exists as Vazarin Exilus and excludes Sure Footed", () => {
    const mod = modsById.get("primed_sure_footed")!;
    expect(mod).toBeTruthy();
    expect(mod.polarity).toBe("vazarin");
    expect(mod.maxRank).toBe(10);
    expect(isWarframeExilusMod(mod)).toBe(true);
    expect(getExcludedMods("sure_footed_r5").has("primed_sure_footed")).toBe(true);
    expect(getExcludedMods("primed_sure_footed").has("sure_footed_r5")).toBe(true);
  });
});

describe("Fused Reservoir Exilus", () => {
  it("is Exilus and eligible for Wisp / Wisp Prime", () => {
    const mod = modsById.get("augment_wisp_fused_reservoir")!;
    expect(isWarframeExilusMod(mod)).toBe(true);
    expect(warframeAugmentEligibleInBuilder(mod, "warframe", "wisp")).toBe(true);
    expect(warframeAugmentEligibleInBuilder(mod, "warframe", "wisp_prime")).toBe(true);
    expect(warframeAugmentEligibleInBuilder(mod, "warframe", "excalibur")).toBe(false);
  });
});

describe("Helminth subsumed ability augments", () => {
  const shock = { sourceWarframeId: "volt", abilityName: "Shock" };

  it("unlocks Shock Trooper on Wukong with Shock subsumed", () => {
    expect(
      warframeAugmentEligibleInBuilder(
        modsById.get("augment_volt_shock_trooper")!,
        "warframe",
        "wukong",
        shock,
      ),
    ).toBe(true);
  });

  it("does not unlock other Volt augments from Shock alone", () => {
    expect(
      warframeAugmentEligibleInBuilder(
        modsById.get("augment_volt_capacitance")!,
        "warframe",
        "wukong",
        shock,
      ),
    ).toBe(false);
    expect(
      warframeAugmentEligibleInBuilder(
        modsById.get("augment_volt_shocking_speed")!,
        "warframe",
        "wukong",
        shock,
      ),
    ).toBe(false);
  });

  it("still grants all Volt augments on native Volt", () => {
    for (const id of [
      "augment_volt_shock_trooper",
      "augment_volt_capacitance",
      "augment_volt_shocking_speed",
    ]) {
      expect(warframeAugmentEligibleInBuilder(modsById.get(id)!, "warframe", "volt")).toBe(
        true,
      );
    }
  });
});

describe("shotgun vs rifle mod class filtering", () => {
  it("allows shotgun mods on Strun and Sobek; denies Serration", () => {
    for (const weaponId of ["strun", "sobek"]) {
      expect(primaryEligible(weaponId, "hells_chamber")).toBe(true);
      expect(primaryEligible(weaponId, "point_blank_r3")).toBe(true);
      expect(primaryEligible(weaponId, "accelerated_blast_r3")).toBe(true);
      expect(primaryEligible(weaponId, "blunderbuss_r3")).toBe(true);
      expect(primaryEligible(weaponId, "serration_r3")).toBe(false);
    }
  });

  it("allows Serration on Braton / Acceltra Prime; denies shotgun and Railjack", () => {
    for (const weaponId of ["braton", "acceltra_prime"]) {
      expect(primaryEligible(weaponId, "serration_r3")).toBe(true);
      expect(primaryEligible(weaponId, "hells_chamber")).toBe(false);
      expect(primaryEligible(weaponId, "point_blank_r3")).toBe(false);
      expect(primaryEligible(weaponId, "accelerated_blast_r3")).toBe(false);
      expect(primaryEligible(weaponId, "blunderbuss_r3")).toBe(false);
      expect(primaryEligible(weaponId, "battle_forge")).toBe(false);
      expect(primaryEligible(weaponId, "blackout_pulse")).toBe(false);
    }
  });

  it("Point Blank is categorized as shotgun", () => {
    expect(modsById.get("point_blank_r3")?.category).toBe("shotgun");
  });

  it("normalizes Shotgun-trigger weapons to shotgun category", () => {
    for (const id of [
      "astilla_prime",
      "bubonico",
      "coda_bubonico",
      "cedo",
      "cedo_prime",
      "coda_bassocyst",
      "convectrix",
      "felarx",
      "kuva_drakgoon",
      "kuva_sobek",
      "mk1_strun",
      "rauta",
      "sobek",
      "steflos",
    ]) {
      expect(weaponsById.get(id)?.category).toBe("shotgun");
    }
  });
});
