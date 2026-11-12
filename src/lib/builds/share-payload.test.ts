import { describe, expect, it } from "vitest";
import {
  buildShareUrl,
  decodeBuild,
  encodeBuild,
  encodeJsonPayload,
  packShareableBuild,
  unpackShareableBuild,
  type ShareableBuild,
} from "@/lib/builds/build-url";
import type { ArchwingBuildData, CompanionBuildData, RailjackBuildData } from "@/lib/builds/build-storage";
import type { LoadoutOperatorBuild, ModularBuildData } from "@/lib/types";
import {
  archwingBuildToShare,
  archwingShareToBuild,
  companionBuildToShare,
  companionShareToBuild,
  modularBuildToShare,
  modularShareToBuild,
  operatorBuildToShare,
  operatorShareToBuild,
  RAILJACK_SHARE_ITEM_ID,
  railjackBuildToShare,
  railjackShareToBuild,
} from "@/lib/builds/share-payload";

function roundTrip<T>(
  data: T,
  toShare: (d: T) => ShareableBuild,
  fromShare: (s: ShareableBuild) => T | null,
): T {
  const share = toShare(data);
  const encoded = encodeBuild(share);
  expect(encoded).not.toBe("");
  const decoded = decodeBuild(encoded);
  expect(decoded).not.toBeNull();
  const restored = fromShare(decoded!);
  expect(restored).not.toBeNull();
  return restored!;
}

describe("companion share round-trip", () => {
  const data: CompanionBuildData = {
    companionId: "carrier_prime",
    mods: [
      { modId: "animal_instinct", rank: 5, slotIndex: 0 },
      { modId: "primed_regen", rank: 10, slotIndex: 1 },
    ],
    weaponId: "verglas_prime",
    weaponMods: [
      {
        modId: "companion_weapon_riven_mod",
        rank: 8,
        slotIndex: 2,
        rivenStats: { critical_chance: 1.48, multishot: 0.92 },
        rivenPolarity: "madurai",
        rivenDrain: 16,
        rivenName: "Verglas Crita-Tox",
        rivenId: "lib_riven_1",
      },
      { modId: "serration", rank: 10, slotIndex: 3 },
    ],
    weaponSlotPolarities: { 2: "madurai", 3: "naramon" },
    arcaneIds: [],
    hasReactor: true,
    hasCatalyst: true,
    isMR30: false,
    slotPolarities: { 0: "vazarin", 1: "madurai" },
    customName: "Cargo",
    parts: {
      kind: "moa",
      model: "paramour",
      core: "detha",
      bracket: "heca",
      gyro: "aetheon",
      isGilded: true,
    },
  };

  it("encodes and restores mods, polarities, weapon rivens, parts, and reactor", () => {
    const restored = roundTrip(data, companionBuildToShare, companionShareToBuild);
    expect(restored.companionId).toBe("carrier_prime");
    expect(restored.mods).toEqual(data.mods);
    expect(restored.weaponId).toBe("verglas_prime");
    expect(restored.weaponMods).toEqual(data.weaponMods);
    expect(restored.weaponSlotPolarities).toEqual(data.weaponSlotPolarities);
    expect(restored.hasReactor).toBe(true);
    expect(restored.hasCatalyst).toBe(true);
    expect(restored.slotPolarities).toEqual(data.slotPolarities);
    expect(restored.customName).toBe("Cargo");
    expect(restored.parts).toEqual(data.parts);
  });

  it("still unpacks a packed v1 companion link without the new extras", () => {
    const packed = [1, "c", "carrier_prime", [["animal_instinct", 5, 0]]];
    expect(unpackShareableBuild(packed)).toEqual({
      type: "companion",
      itemId: "carrier_prime",
      mods: [{ id: "animal_instinct", rank: 5, slotIndex: 0 }],
    });
  });

  it("routes the share URL to companion-builder", () => {
    const url = buildShareUrl(companionBuildToShare(data), "CODE");
    expect(url).toBe("/companion-builder?build=CODE");
  });
});

describe("modular share round-trip", () => {
  const kitgun: ModularBuildData = {
    modularType: "kitgun",
    parts: { chamber: "catchmoon", grip: "gibber", loader: "ramble" },
    mods: [
      { modId: "hornet_strike", rank: 10, slotIndex: 0 },
      {
        modId: "kitgun_riven_mod",
        rank: 8,
        slotIndex: 1,
        rivenStats: { damage: 1.65, status_chance: 0.8 },
        rivenPolarity: "naramon",
        rivenDrain: 14,
        rivenName: "Catchmoon Dexa-Crita",
      },
    ],
    arcaneIds: ["arcane_awakening", null],
    arcaneRanks: [5, 5],
    hasOrokinCatalyst: true,
    isMR30: false,
    slotPolarities: { 0: "madurai", 1: "naramon" },
    customName: "Moonshot",
  };

  it("encodes and restores kitgun parts, rivens, arcanes, and polarities", () => {
    const restored = roundTrip(kitgun, modularBuildToShare, modularShareToBuild);
    expect(restored.modularType).toBe("kitgun");
    expect(restored.parts).toEqual(kitgun.parts);
    expect(restored.mods).toEqual(kitgun.mods);
    expect(restored.arcaneIds).toEqual(kitgun.arcaneIds);
    expect(restored.arcaneRanks).toEqual(kitgun.arcaneRanks);
    expect(restored.hasOrokinCatalyst).toBe(true);
    expect(restored.slotPolarities).toEqual(kitgun.slotPolarities);
    expect(restored.customName).toBe("Moonshot");
  });

  it.each([
    [
      "zaw",
      {
        modularType: "zaw",
        parts: { strike: "baho", grip: "seekalla", link: "vargeet_jai" },
        mods: [{ modId: "pressure_point", rank: 5, slotIndex: 0 }],
        hasOrokinCatalyst: false,
      } satisfies ModularBuildData,
    ],
    [
      "amp",
      {
        modularType: "amp",
        parts: { prism: "raplak", scaffold: "pencha", brace: "certus" },
        mods: [],
        arcaneIds: ["virtuos_strike", "eternal_eradicate"],
        arcaneRanks: [3, 5],
        hasOrokinCatalyst: true,
      } satisfies ModularBuildData,
    ],
  ])("round-trips a %s", (_label, data) => {
    const restored = roundTrip(data, modularBuildToShare, modularShareToBuild);
    expect(restored.modularType).toBe(data.modularType);
    expect(restored.parts).toEqual(data.parts);
    expect(restored.mods).toEqual(data.mods);
    expect(restored.hasOrokinCatalyst).toBe(data.hasOrokinCatalyst);
    if (data.arcaneIds) expect(restored.arcaneIds).toEqual(data.arcaneIds);
  });

  it("still unpacks a packed v1 modular link without rivens", () => {
    const packed = [
      1,
      "m",
      "catchmoon",
      [["hornet_strike", 10, 0]],
      { mt: "kitgun", p: { chamber: "catchmoon", grip: "gibber", loader: "ramble" }, oc: 1 },
    ];
    const unpacked = unpackShareableBuild(packed);
    expect(unpacked).toMatchObject({
      type: "modular",
      itemId: "catchmoon",
      modularType: "kitgun",
      parts: { chamber: "catchmoon", grip: "gibber", loader: "ramble" },
      hasOrokinCatalyst: true,
      mods: [{ id: "hornet_strike", rank: 10, slotIndex: 0 }],
    });
    expect(unpacked?.rivenBySlot).toBeUndefined();
    const restored = modularShareToBuild(unpacked!);
    expect(restored?.mods[0]?.modId).toBe("hornet_strike");
    expect(restored?.mods[0]?.rivenStats).toBeUndefined();
  });

  it("routes the share URL to modular-builder", () => {
    expect(buildShareUrl(modularBuildToShare(kitgun), "CODE")).toBe("/modular-builder?build=CODE");
  });
});

describe("archwing share round-trip", () => {
  const archwing: ArchwingBuildData = {
    mode: "archwing",
    frameId: "odonata_prime",
    frameMods: [
      { modId: "energy_field", rank: 5, slotIndex: 0 },
      { modId: "system_reroute", rank: 5, slotIndex: 1 },
    ],
    weaponId: "imperator_vandal",
    weaponMods: [
      {
        modId: "archgun_riven_mod",
        rank: 8,
        slotIndex: 0,
        rivenStats: { damage: 1.2, multishot: 0.6 },
        rivenPolarity: "madurai",
        rivenDrain: 18,
        rivenName: "Imperator Dexa",
      },
    ],
    hasReactor: true,
    hasCatalyst: true,
    isMR30: false,
    framePolarities: { 0: "madurai" },
    weaponPolarities: { 0: "naramon" },
    railjackGunnery: 7,
  };

  it("encodes and restores frame, weapon rivens, polarities, and gunnery", () => {
    const restored = roundTrip(archwing, archwingBuildToShare, archwingShareToBuild);
    expect(restored.mode).toBe("archwing");
    expect(restored.frameId).toBe("odonata_prime");
    expect(restored.frameMods).toEqual(archwing.frameMods);
    expect(restored.weaponId).toBe("imperator_vandal");
    expect(restored.weaponMods).toEqual(archwing.weaponMods);
    expect(restored.hasReactor).toBe(true);
    expect(restored.hasCatalyst).toBe(true);
    expect(restored.framePolarities).toEqual(archwing.framePolarities);
    expect(restored.weaponPolarities).toEqual(archwing.weaponPolarities);
    expect(restored.railjackGunnery).toBe(7);
  });

  it("round-trips a necramech with exalted weapon mods", () => {
    const mech: ArchwingBuildData = {
      mode: "necramech",
      frameId: "voidrig",
      frameMods: [{ modId: "necramech_vitality", rank: 10, slotIndex: 0 }],
      weaponId: "morgha",
      weaponMods: [{ modId: "shell_shock", rank: 3, slotIndex: 0 }],
      hasReactor: true,
      hasCatalyst: false,
      isMR30: false,
      framePolarities: { 0: "vazarin" },
      weaponPolarities: {},
      exaltedWeaponMods: [{ modId: "combustion_beam", rank: 5, slotIndex: 0 }],
      exaltedWeaponPolarities: { 0: "madurai" },
    };
    const restored = roundTrip(mech, archwingBuildToShare, archwingShareToBuild);
    expect(restored.mode).toBe("necramech");
    expect(restored.frameId).toBe("voidrig");
    expect(restored.exaltedWeaponMods).toEqual(mech.exaltedWeaponMods);
    expect(restored.exaltedWeaponPolarities).toEqual(mech.exaltedWeaponPolarities);
    expect(restored.hasCatalyst).toBe(false);
  });

  it("still unpacks a packed v1 archwing link without the new extras", () => {
    const packed = [1, "a", "Odonata", [["energy_field", 5, 0]]];
    expect(unpackShareableBuild(packed)).toEqual({
      type: "archwing",
      itemId: "Odonata",
      mods: [{ id: "energy_field", rank: 5, slotIndex: 0 }],
    });
  });

  it("routes the share URL to archwing-builder", () => {
    expect(buildShareUrl(archwingBuildToShare(archwing), "CODE")).toBe("/archwing-builder?build=CODE");
  });
});

describe("railjack share round-trip", () => {
  const data: RailjackBuildData = {
    reactorId: "vidar_reactor_mk3",
    shieldId: "zetki_shield_mk3",
    engineId: "latoro_engine_mk3",
    platingId: "vidar_plating_mk3",
    reactorTraitId: "vidar_reactor_heat",
    shieldTraitId: "zetki_shield_cap",
    engineTraitId: "latoro_engine_speed",
    turretIds: ["vidar_cryophon_mk3", "zetki_phalax_mk3"],
    ordnanceId: "tether",
    integratedMods: [
      { modId: "hyperstrike", rank: 5, slotIndex: 0 },
      { modId: "bulkhead", rank: 5, slotIndex: 1 },
    ],
    battleMods: [{ modId: "void_hole", rank: 3, slotIndex: 0 }],
    tacticalMods: [{ modId: "flow_burn", rank: 3, slotIndex: 0 }],
    integratedPolarities: { 0: "madurai" },
    battlePolarities: { 0: "naramon" },
    tacticalPolarities: { 0: "vazarin" },
    crewSlots: [
      {
        role: "pilot",
        source: "elite",
        profileId: "sevagoth_crew",
        competency: { piloting: 5, gunnery: 3, repair: 2, combat: 4, endurance: 3 },
        eliteTraitId: "on_slaught",
        weaponLoadout: {
          weaponId: "prisma_grinlok",
          mods: [
            {
              modId: "rifle_riven_mod",
              rank: 8,
              slotIndex: 0,
              rivenStats: { damage: 1.1 },
              rivenPolarity: "madurai",
              rivenDrain: 16,
              rivenName: "Grinlok Dexa",
            },
          ],
          slotPolarities: { 0: "madurai" },
          hasOrokinCatalyst: true,
        },
      },
      null,
      {
        role: "gunner",
        source: "ticker",
        profileId: "crew_b",
      },
    ],
    eliteCrewId: "sevagoth_crew",
    intrinsics: { tactical: 10, piloting: 8, gunnery: 10, engineering: 7, command: 5 },
    simulation: {
      crimsonFugueStacks: 5,
      cruisingSpeedActive: false,
      protectiveShotsActive: true,
      shieldsDepleted: false,
      activeBattleAbilityId: "void_hole",
      activeTacticalAbilityId: null,
    },
  };

  it("encodes and restores components, all plexus tabs, crew, rivens, intrinsics, and simulation", () => {
    const restored = roundTrip(data, railjackBuildToShare, railjackShareToBuild);
    expect(restored.reactorId).toBe(data.reactorId);
    expect(restored.shieldId).toBe(data.shieldId);
    expect(restored.engineId).toBe(data.engineId);
    expect(restored.platingId).toBe(data.platingId);
    expect(restored.reactorTraitId).toBe(data.reactorTraitId);
    expect(restored.turretIds).toEqual(data.turretIds);
    expect(restored.ordnanceId).toBe("tether");
    expect(restored.integratedMods).toEqual(data.integratedMods);
    expect(restored.battleMods).toEqual(data.battleMods);
    expect(restored.tacticalMods).toEqual(data.tacticalMods);
    expect(restored.integratedPolarities).toEqual(data.integratedPolarities);
    expect(restored.battlePolarities).toEqual(data.battlePolarities);
    expect(restored.tacticalPolarities).toEqual(data.tacticalPolarities);
    expect(restored.crewSlots?.[0]).toEqual(data.crewSlots?.[0]);
    expect(restored.crewSlots?.[1]).toBeNull();
    expect(restored.crewSlots?.[2]).toEqual(data.crewSlots?.[2]);
    expect(restored.intrinsics).toEqual(data.intrinsics);
    expect(restored.simulation).toEqual(data.simulation);
    expect(railjackBuildToShare(data).itemId).toBe(RAILJACK_SHARE_ITEM_ID);
  });

  it("still unpacks a packed v1 railjack link with only itemId and mods", () => {
    const packed = [1, "r", "railjack", [["hyperstrike", 5, 0]]];
    const unpacked = unpackShareableBuild(packed);
    expect(unpacked).toEqual({
      type: "railjack",
      itemId: "railjack",
      mods: [{ id: "hyperstrike", rank: 5, slotIndex: 0 }],
    });
    const restored = railjackShareToBuild(unpacked!);
    expect(restored?.integratedMods).toEqual([{ modId: "hyperstrike", rank: 5, slotIndex: 0 }]);
    expect(restored?.battleMods).toEqual([]);
  });

  it("routes the share URL to railjack-builder", () => {
    expect(buildShareUrl(railjackBuildToShare(data), "CODE")).toBe("/railjack-builder?build=CODE");
  });
});

describe("operator share round-trip", () => {
  const data: LoadoutOperatorBuild = {
    focusSchool: "Madurai",
    arcaneIds: ["magus_lockdown", "magus_accelerant"],
    arcaneRanks: [5, 3],
    ampId: "modular_",
    ampName: "Raplak Certus",
    ampArcaneIds: ["virtuos_strike", null],
    ampArcaneRanks: [4, 5],
    ampModularBuild: {
      modularType: "amp",
      parts: { prism: "raplak", scaffold: "pencha", brace: "certus" },
      mods: [],
      arcaneIds: ["virtuos_strike", "eternal_eradicate"],
      arcaneRanks: [4, 5],
      hasOrokinCatalyst: true,
      slotPolarities: {},
    },
  };

  it("encodes and restores focus school, operator arcanes, and modular amp", () => {
    const restored = roundTrip(data, operatorBuildToShare, operatorShareToBuild);
    expect(restored.focusSchool).toBe("Madurai");
    expect(restored.ampId).toBe("modular_");
    expect(restored.ampName).toBe("Raplak Certus");
    expect(restored.arcaneIds).toEqual(data.arcaneIds);
    expect(restored.arcaneRanks).toEqual(data.arcaneRanks);
    expect(restored.ampArcaneIds).toEqual(data.ampArcaneIds);
    expect(restored.ampArcaneRanks).toEqual(data.ampArcaneRanks);
    expect(restored.ampModularBuild?.parts).toEqual(data.ampModularBuild?.parts);
    expect(restored.ampModularBuild?.arcaneIds).toEqual(data.ampModularBuild?.arcaneIds);
    expect(restored.ampModularBuild?.hasOrokinCatalyst).toBe(true);
    const packed = packShareableBuild(operatorBuildToShare(data));
    expect(packed[0]).toBe(1);
    expect(packed[1]).toBe("o");
  });

  it("round-trips a preset Amp without a modular payload", () => {
    const preset: LoadoutOperatorBuild = {
      focusSchool: "Vazarin",
      ampId: "sirocco",
      ampName: "Sirocco",
      arcaneIds: [null, null],
      arcaneRanks: [5, 5],
      ampArcaneIds: ["virtuos_surge", "eternal_onslaught"],
      ampArcaneRanks: [5, 5],
    };
    const restored = roundTrip(preset, operatorBuildToShare, operatorShareToBuild);
    expect(restored.focusSchool).toBe("Vazarin");
    expect(restored.ampId).toBe("sirocco");
    expect(restored.ampModularBuild).toBeUndefined();
    expect(restored.ampArcaneIds).toEqual(preset.ampArcaneIds);
  });

  it("routes the share URL to operator-builder", () => {
    expect(buildShareUrl(operatorBuildToShare(data), "CODE")).toBe("/operator-builder?build=CODE");
  });

  it("unknown type codes still return null (old decoder behaviour)", () => {
    expect(unpackShareableBuild([1, "z", "x", []])).toBeNull();
  });
});

describe("legacy share objects and existing warframe links", () => {
  it("decodes a legacy JSON companion object with new optional fields", () => {
    const legacy = {
      type: "companion",
      itemId: "dethcube_prime",
      mods: [{ id: "animal_instinct", rank: 5, slotIndex: 0 }],
      weaponId: "deth_machine_rifle_prime",
      hasOrokinReactor: true,
    };
    // encodeBuild packs; decode a raw JSON payload by going through unpack of a
    // hand-written object via the public decode path (legacy object, not array).
    const raw = encodeJsonPayload(legacy);
    const decoded = decodeBuild(raw);
    expect(decoded).toMatchObject(legacy);
    expect(companionShareToBuild(decoded!)?.weaponId).toBe("deth_machine_rifle_prime");
  });

  it("packed warframe extras are unchanged when the new fields are absent", () => {
    const build: ShareableBuild = {
      type: "warframe",
      itemId: "mesa_prime",
      mods: [{ id: "blind_rage", rank: 10, slotIndex: 0 }],
      arcanes: ["arcane_energize"],
      hasOrokinReactor: true,
    };
    const packed = packShareableBuild(build);
    expect(packed[0]).toBe(1);
    expect(packed[1]).toBe("f");
    const extras = packed[4] as Record<string, unknown>;
    expect(extras.a).toEqual(["arcane_energize"]);
    expect(extras.hr).toBe(1);
    expect(extras.rs).toBeUndefined();
    expect(extras.rj).toBeUndefined();
    expect(extras.wid).toBeUndefined();
    expect(decodeBuild(encodeBuild(build))).toMatchObject(build);
  });
});
