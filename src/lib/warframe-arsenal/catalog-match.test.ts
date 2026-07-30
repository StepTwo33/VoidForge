import { describe, expect, it } from "vitest";
import { findModByName, parseCustomItemName } from "@/lib/warframe-arsenal/catalog-match";
import {
  findWeaponByLotusPath,
  findCompanionByLotusPath,
  mapModularPartsFromArsenal,
  resolveHelminthOverride,
} from "@/lib/warframe-arsenal/lotus-resolve";
import {
  parseRivenStatsFromUpgrade,
  resolveRivenUpgrade,
  rivenModIdFromUniqueName,
} from "@/lib/warframe-arsenal/riven-resolve";

describe("warframe arsenal catalog match", () => {
  it("parses custom weapon names from twitch itemName", () => {
    expect(parseCustomItemName("/Lotus/Language/Weapons/CrpBEFluxRifleName|FEDIA MIMESRO")).toBe("FEDIA MIMESRO");
  });

  it("finds catalog mods by display name", () => {
    expect(findModByName("Primed Point Blank")?.id).toBe("primed_point_blank");
    expect(findModByName("Serration")?.id).toBeTruthy();
  });

  it("finds Archon Amar's Hatred warframe set mod", () => {
    expect(findModByName("Amar's Hatred")?.id).toBe("amars_hatred");
    expect(findModByName("Amar's Anguish")?.id).toBe("amars_anguish");
  });
});

describe("warframe arsenal lotus resolve", () => {
  it("resolves helminth empower from DE ability path", () => {
    const result = resolveHelminthOverride({
      ability: "/Lotus/Powersuits/PowersuitAbilities/HelminthStrengthAbility",
      index: 3,
    });
    expect(result?.helminthAbilityId).toBe("helminth_empower");
    expect(result?.helminthSlot).toBe(2);
  });

  it("resolves Infested Mobility from wiki HelminthSpeedAbility suffix", () => {
    const result = resolveHelminthOverride({
      ability: "/Lotus/Powersuits/PowersuitAbilities/HelminthSpeedAbility",
      index: 1,
    });
    expect(result?.helminthAbilityId).toBe("helminth_infested_mobility");
    expect(result?.helminthSlot).toBe(0);
  });

  it("resolves subsumed Roar from ability path", () => {
    const result = resolveHelminthOverride({
      ability: "/Lotus/Powersuits/PowersuitAbilities/RhinoRoarAbility",
      index: 2,
    });
    expect(result?.helminthAbilityId).toBe("subsume_rhino");
    expect(result?.helminthSlot).toBe(1);
  });

  it("resolves Ophanim Eyes from ChoirEyesAbility codename", () => {
    const result = resolveHelminthOverride({
      ability: "/Lotus/Powersuits/Choir/Abilities/ChoirEyesAbility",
      index: 4,
    });
    expect(result?.helminthAbilityId).toBe("subsume_jade");
    expect(result?.helminthSlot).toBe(3);
  });

  it("resolves Rest & Rage from YinYangTargetAbility codename", () => {
    const result = resolveHelminthOverride({
      ability: "/Lotus/Powersuits/YinYang/Abilities/YinYangTargetAbility",
      index: 2,
    });
    expect(result?.helminthAbilityId).toBe("subsume_equinox");
    expect(result?.helminthSlot).toBe(1);
  });

  it("resolves weapons by lotus uniqueName", () => {
    const weapon = findWeaponByLotusPath("/Lotus/Weapons/Corpus/BoardExec/Primary/CrpBEFluxRifle/CrpBEFluxRifle");
    expect(weapon?.id).toBe("tenet_flux_rifle");
  });

  it("maps amp modular parts from twitch payload shape", () => {
    const mapped = mapModularPartsFromArsenal({
      LWPT_AMP_OCULUS: "/Lotus/Weapons/Corpus/OperatorAmplifiers/Set1/Barrel/CorpAmpSet1BarrelPartB",
      LWPT_AMP_CORE: "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set1/Chassis/SentAmpSet1ChassisPartA",
      LWPT_AMP_BRACE: "/Lotus/Weapons/Sentients/OperatorAmplifiers/Set2/Grip/SentAmpSet2GripPartA",
    });
    expect(mapped?.data.modularType).toBe("amp");
    expect(mapped?.data.parts.prism).toBe("amp_lega");
    expect(mapped?.data.parts.scaffold).toBe("amp_pencha");
    expect(mapped?.data.parts.brace).toBe("amp_anspatha");
  });

  it("resolves companions by uniqueName even when itemName is a custom pet name", () => {
    const companion = findCompanionByLotusPath(
      "/Lotus/Types/Game/KubrowPet/KubrowPetTypes/KubrowPetTypePharaoh",
      "Sir Barksalot",
    );
    expect(companion?.id).toBe("pharaoh_predasite");
  });

  it("resolves pharaoh predasite from path hint when wfcd name is missing", () => {
    const companion = findCompanionByLotusPath("/Lotus/Types/Game/CatbrowPet/PharaohPredasitePet");
    expect(companion?.id).toBe("pharaoh_predasite");
  });
});

describe("warframe arsenal riven resolve", () => {
  it("maps pistol riven uniqueName to riven_pistol", () => {
    expect(rivenModIdFromUniqueName("/Lotus/Upgrades/Mods/Randomized/LotusPistolRandomModRare")).toBe(
      "riven_pistol",
    );
  });

  it("parses riven buffs and curses into framehub stat keys", () => {
    const stats = parseRivenStatsFromUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/LotusPistolRandomModRare",
      rank: 8,
      buffs: [{ tag: "WeaponCritChanceMod", val: 0.12 }, { tag: "WeaponFireDamageMod", val: 0.44 }],
      curses: [{ tag: "WeaponFactionDamageInfested", val: 0.99 }],
    });
    expect(stats.criticalChance).toBeCloseTo(0.12);
    expect(stats.heat).toBeCloseTo(0.44);
    expect(stats).not.toHaveProperty("WeaponFactionDamageInfested");
  });

  it("resolves full riven upgrade for import", () => {
    const riven = resolveRivenUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/LotusPistolRandomModRare",
      rank: 8,
      buffs: [{ tag: "WeaponDamageAmountMod", val: 0.25 }],
      curses: [],
    });
    expect(riven?.modId).toBe("riven_pistol");
    expect(riven?.rank).toBe(8);
    expect(riven?.rivenStats.damage).toBeCloseTo(0.25);
  });
});
