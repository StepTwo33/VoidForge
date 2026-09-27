import { describe, expect, it } from "vitest";
import { findModByName, findWarframeByName, findWeaponByName, parseCustomItemName } from "@/lib/warframe-arsenal/catalog-match";
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

  it("resolves Dreamer's Bond aura (import + apostrophe variants)", () => {
    expect(findModByName("Dreamer's Bond")?.id).toBe("dreamers_bond");
    expect(findModByName("Dreamers Bond")?.id).toBe("dreamers_bond");
    expect(findModByName(`Dreamer\u2019s Bond`)?.id).toBe("dreamers_bond");
  });

  it("maps Update 44 arsenal export names onto catalog items", () => {
    expect(findWarframeByName("Duelist")?.id).toBe("narin");
    expect(findWeaponByName("Prime Steflos Shotgun")?.id).toBe("steflos_prime");
    expect(findWeaponByName("Prime Corufell Scythe Weapon")?.id).toBe("corufell_prime");
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

  it("maps archgun riven uniqueName to riven_rifle", () => {
    expect(rivenModIdFromUniqueName("/Lotus/Upgrades/Mods/Randomized/LotusArchgunRandomModRare")).toBe(
      "riven_rifle",
    );
  });

  it("parses DE arsenal tags into framehub stat keys", () => {
    const stats = parseRivenStatsFromUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/LotusPistolRandomModRare",
      rank: 8,
      buffs: [
        { tag: "WeaponStunChanceMod", val: 0.33 },
        { tag: "WeaponArmorPiercingDamageMod", val: 0.4 },
        { tag: "WeaponPunctureDepthMod", val: 1.2 },
        { tag: "WeaponZoomFovMod", val: 0.2 },
        { tag: "WeaponRecoilReductionMod", val: 0.5 },
        { tag: "WeaponFireDamageMod", val: 0.44 },
        { tag: "WeaponFactionDamageGrineer", val: 0.45 },
      ],
      curses: [{ tag: "WeaponFactionDamageInfested", val: 0.99 }],
    });
    expect(stats.statusChance).toBeCloseTo(0.33);
    expect(stats.puncture).toBeCloseTo(0.4);
    expect(stats.punchThrough).toBeCloseTo(1.2);
    expect(stats.zoom).toBeCloseTo(0.2);
    expect(stats.recoil).toBeCloseTo(-0.5);
    expect(stats.heat).toBeCloseTo(0.44);
    expect(stats.factionGrineer).toBeCloseTo(0.45);
    expect(stats.factionInfested).toBeCloseTo(-0.99);
  });

  it("parses melee damage and combo tags", () => {
    const stats = parseRivenStatsFromUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/PlayerMeleeWeaponRandomModRare",
      buffs: [
        { tag: "WeaponMeleeDamageMod", val: 0.55 },
        { tag: "ComboDurationMod", val: 2.4 },
        { tag: "WeaponMeleeFinisherDamageMod", val: 0.8 },
        { tag: "WeaponMeleeComboInitialBonusMod", val: 12 },
        { tag: "WeaponMeleeComboEfficiencyMod", val: 0.3 },
        { tag: "WeaponMeleeFactionDamageCorpus", val: 0.4 },
      ],
      curses: [],
    });
    expect(stats.damage).toBeCloseTo(0.55);
    expect(stats.comboDuration).toBeCloseTo(2.4);
    expect(stats.finisherDamage).toBeCloseTo(0.8);
    expect(stats.initialCombo).toBeCloseTo(12);
    expect(stats.heavyAttackEfficiency).toBeCloseTo(0.3);
    expect(stats.factionCorpus).toBeCloseTo(0.4);
  });

  it("reports unmapped combo-gain tags", () => {
    const riven = resolveRivenUpgrade({
      uniqueName: "/Lotus/Upgrades/Mods/Randomized/PlayerMeleeWeaponRandomModRare",
      buffs: [
        { tag: "WeaponMeleeDamageMod", val: 0.2 },
        { tag: "WeaponMeleeComboPointsOnHitMod", val: 0.1 },
        { tag: "SlideAttackCritChanceMod", val: 0.15 },
      ],
      curses: [],
    });
    expect(riven?.rivenStats.damage).toBeCloseTo(0.2);
    expect(riven?.unmappedTags).toEqual(
      expect.arrayContaining(["WeaponMeleeComboPointsOnHitMod", "SlideAttackCritChanceMod"]),
    );
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
    expect(riven?.unmappedTags).toEqual([]);
  });
});
