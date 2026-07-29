import { describe, expect, it } from "vitest";
import {
  computeCrewPaperBonuses,
  migrateEliteCrewIdToSlots,
  namedEliteFixedTraitId,
  normalizeCrewSlots,
  PILOTING_SPEED_BONUS,
  resolveSlotEliteTraitId,
  type RailjackCrewSlot,
} from "@/data/railjack-crew";
import {
  clampProgenitorBonusPercent,
  findDuplicateCrewWeaponIds,
  filterAdversaryWeapons,
  isCrewWeaponTakenByOtherSlot,
  isRailjackCrewAssignableWeapon,
} from "@/data/railjack-crew-weapons";
import { calculateRailjackBuild } from "@/lib/calc/railjack-calculator";
import { computeCrewBoardingDps } from "@/lib/calc/railjack-crew-boarding";
import { allWeapons } from "@/data/weapons";
import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import { PROGENITOR_BONUS_DEFAULT } from "@/lib/weapons/weapon-progenitor";

describe("railjack crew paper bonuses", () => {
  it("applies wiki piloting speed table only for Pilot role", () => {
    const pilot: RailjackCrewSlot = {
      role: "pilot",
      source: "ticker",
      profileId: "the_perrin_sequence",
      competency: { piloting: 5, gunnery: 0, repair: 0, combat: 0, endurance: 0 },
    };
    const gunner: RailjackCrewSlot = {
      role: "gunner",
      source: "ticker",
      profileId: "steel_meridian",
      competency: { piloting: 5, gunnery: 5, repair: 0, combat: 0, endurance: 0 },
    };
    expect(computeCrewPaperBonuses([pilot, null, null]).speedBonus).toBe(PILOTING_SPEED_BONUS[5]);
    expect(computeCrewPaperBonuses([gunner, null, null]).speedBonus).toBe(0);
  });

  it("elite gunnery trait buffs matching house turrets only", () => {
    const slots: (RailjackCrewSlot | null)[] = [
      {
        role: "gunner",
        source: "ticker",
        profileId: "credits_hire",
        competency: { piloting: 0, gunnery: 5, repair: 0, combat: 0, endurance: 0 },
        eliteTraitId: "elite_gunnery_zetki_turrets",
      },
      null,
      null,
    ];
    const withHouse = calculateRailjackBuild({
      turretIds: ["zetki_apoc", "vidar_apoc", undefined],
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    const bare = calculateRailjackBuild({
      turretIds: ["zetki_apoc", "vidar_apoc", undefined],
      intrinsics: { command: 10 },
    });
    expect(withHouse.turrets[0]!.damage).toBe(Math.round(bare.turrets[0]!.damage * 1.5));
    expect(withHouse.turrets[1]!.damage).toBe(bare.turrets[1]!.damage);
  });

  it("vidar piloting trait does not buff lavan engines", () => {
    const slots: (RailjackCrewSlot | null)[] = [
      {
        role: "pilot",
        source: "ticker",
        profileId: "credits_hire",
        competency: { piloting: 0, gunnery: 0, repair: 0, combat: 0, endurance: 0 },
        eliteTraitId: "elite_piloting_vidar_engines",
      },
      null,
      null,
    ];
    const vidar = calculateRailjackBuild({
      engineId: "vidar_engine_mk3",
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    const lavan = calculateRailjackBuild({
      engineId: "lavan_engine_mk3",
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    expect(vidar.speed).toBe(Math.round(150 * 1.25 + 45));
    expect(lavan.speed).toBe(150 + 20);
  });

  it("legacy combined piloting trait aliases to vidar house", () => {
    const slots: (RailjackCrewSlot | null)[] = [
      {
        role: "pilot",
        source: "ticker",
        profileId: "credits_hire",
        competency: { piloting: 0, gunnery: 0, repair: 0, combat: 0, endurance: 0 },
        eliteTraitId: "elite_piloting_engine_speed",
      },
      null,
      null,
    ];
    const house = calculateRailjackBuild({
      engineId: "vidar_engine_mk3",
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    const sigma = calculateRailjackBuild({
      engineId: "sigma_engine_mk3",
      crewSlots: slots,
      intrinsics: { command: 10 },
    });
    expect(house.speed).toBe(Math.round(150 * 1.25 + 45));
    expect(sigma.speed).toBe(150 + 30);
  });

  it("locks named elite wiki traits", () => {
    expect(namedEliteFixedTraitId("vena")).toBe("elite_endurance_kill_heal");
    expect(namedEliteFixedTraitId("ryoku")).toBe("elite_combat_crit_damage");
    expect(namedEliteFixedTraitId("latrox_une")).toBe("elite_endurance_protective_shield");
    expect(namedEliteFixedTraitId("jarka_lar")).toBe("elite_combat_crit_chance_rifles");

    const vena: RailjackCrewSlot = {
      role: "defender",
      source: "elite",
      profileId: "vena",
      eliteTraitId: "elite_gunnery_zetki_turrets",
    };
    expect(resolveSlotEliteTraitId(vena)).toBe("elite_endurance_kill_heal");
    expect(normalizeCrewSlots([vena, null, null])[0]?.eliteTraitId).toBe(
      "elite_endurance_kill_heal",
    );
  });

  it("migrates legacy eliteCrewId into slot A", () => {
    const slots = migrateEliteCrewIdToSlots("vena");
    expect(slots[0]?.source).toBe("elite");
    expect(slots[0]?.profileId).toBe("vena");
    expect(slots[0]?.eliteTraitId).toBe("elite_endurance_kill_heal");
    expect(normalizeCrewSlots(undefined, "ryoku")[0]?.profileId).toBe("ryoku");
  });

  it("does not invent hull/turret bonuses from raw competency", () => {
    const bonuses = computeCrewPaperBonuses([
      {
        role: "defender",
        source: "elite",
        profileId: "vena",
        competency: { piloting: 0, gunnery: 5, repair: 0, combat: 5, endurance: 5 },
      },
      null,
      null,
    ]);
    expect(bonuses.speedBonus).toBe(0);
    expect(bonuses.houseTurretDamageBonus).toBe(0);
    expect(bonuses.panelNotes.some((n) => n.startsWith("Defender:"))).toBe(true);
  });

  it("persists weaponLoadout through normalizeCrewSlots", () => {
    const slots = normalizeCrewSlots([
      {
        role: "defender",
        source: "ticker",
        profileId: "steel_meridian",
        competency: { piloting: 0, gunnery: 0, repair: 0, combat: 5, endurance: 5 },
        weaponLoadout: {
          weaponId: "braton",
          mods: [{ modId: "serration", rank: 10, slotIndex: 0 }],
          progenitorBonusPercent: 55,
        },
      },
      null,
      null,
    ]);
    expect(slots[0]?.weaponLoadout?.weaponId).toBe("braton");
    expect(slots[0]?.weaponLoadout?.mods).toEqual([
      { modId: "serration", rank: 10, slotIndex: 0 },
    ]);
  });
});

describe("railjack crew weapons", () => {
  it("excludes bows and melee from crew-assignable weapons", () => {
    expect(
      isRailjackCrewAssignableWeapon({ id: "paris", name: "Paris", category: "bow" }),
    ).toBe(false);
    expect(
      isRailjackCrewAssignableWeapon({ id: "skana", name: "Skana", category: "melee" }),
    ).toBe(false);
    expect(
      isRailjackCrewAssignableWeapon({ id: "braton", name: "Braton", category: "rifle" }),
    ).toBe(true);
  });

  it("filters adversary weapons by family including dual_coda, melee, and primary", () => {
    const sample = [
      allWeapons.find((w) => w.id === "kuva_kohm")!,
      allWeapons.find((w) => w.id === "kuva_karak")!, // primary category
      allWeapons.find((w) => w.id === "kuva_shildeg")!, // melee
      allWeapons.find((w) => w.id === "kuva_bramma")!, // bow-like primary — still adversary-owned
      allWeapons.find((w) => w.id === "tenet_cycron")!,
      allWeapons.find((w) => w.id === "tenet_envoy")!, // launcher
      allWeapons.find((w) => w.id === "dual_coda_torxica")!,
      allWeapons.find((w) => w.id === "coda_hema")!, // primary
      allWeapons.find((w) => w.id === "kuva_ayanga")!, // archgun — excluded
      allWeapons.find((w) => w.id === "braton")!,
    ].filter(Boolean);

    const lich = filterAdversaryWeapons("kuva_lich", sample).map((w) => w.id);
    const sister = filterAdversaryWeapons("sister_of_parvos", sample).map((w) => w.id);
    const coda = filterAdversaryWeapons("technocyte_coda", sample).map((w) => w.id);

    expect(lich).toEqual(
      expect.arrayContaining(["kuva_kohm", "kuva_karak", "kuva_shildeg", "kuva_bramma"]),
    );
    expect(lich).not.toContain("kuva_ayanga");
    expect(lich).not.toContain("braton");
    expect(sister).toEqual(expect.arrayContaining(["tenet_cycron", "tenet_envoy"]));
    expect(coda).toEqual(expect.arrayContaining(["dual_coda_torxica", "coda_hema"]));
    expect(coda).not.toContain("braton");
  });

  it("includes FrameHub primary-category rifles for ticker crew", () => {
    expect(
      isRailjackCrewAssignableWeapon({
        id: "kuva_karak",
        name: "Kuva Karak",
        category: "primary",
      }),
    ).toBe(true);
    expect(
      isRailjackCrewAssignableWeapon({
        id: "kuva_bramma",
        name: "Kuva Bramma",
        category: "primary",
      }),
    ).toBe(false);
    expect(
      isRailjackCrewAssignableWeapon({
        id: "kuva_shildeg",
        name: "Kuva Shildeg",
        category: "melee",
      }),
    ).toBe(false);
  });

  it("enforces unique weapon ids across crew slots", () => {
    const slots: (RailjackCrewSlot | null)[] = [
      {
        role: "defender",
        source: "ticker",
        profileId: "steel_meridian",
        weaponLoadout: { weaponId: "braton", mods: [] },
      },
      {
        role: "gunner",
        source: "ticker",
        profileId: "red_veil",
        weaponLoadout: { weaponId: "braton", mods: [] },
      },
      null,
    ];
    expect(findDuplicateCrewWeaponIds(slots)).toEqual(["braton"]);
    expect(isCrewWeaponTakenByOtherSlot(slots, "braton", 0)).toBe(true);
    expect(isCrewWeaponTakenByOtherSlot(slots, "braton", 1)).toBe(true);
    expect(isCrewWeaponTakenByOtherSlot(slots, "soma", 0)).toBe(false);
  });

  it("clamps progenitor bonus percent to 25–60", () => {
    expect(clampProgenitorBonusPercent(10)).toBe(25);
    expect(clampProgenitorBonusPercent(99)).toBe(60);
    expect(clampProgenitorBonusPercent(undefined)).toBe(PROGENITOR_BONUS_DEFAULT);
    expect(clampProgenitorBonusPercent(42)).toBe(42);
  });
});

describe("railjack crew boarding dps", () => {
  it("applies combat competency as additive damage for ticker/elite", () => {
    const braton = allWeapons.find((w) => w.id === "braton")!;
    const modsMap = getEffectiveModsMap();
    const slot: RailjackCrewSlot = {
      role: "defender",
      source: "ticker",
      profileId: "steel_meridian",
      competency: { piloting: 0, gunnery: 0, repair: 0, combat: 5, endurance: 0 },
      weaponLoadout: { weaponId: "braton", mods: [] },
    };
    const result = computeCrewBoardingDps(slot, braton, modsMap)!;
    expect(result.combatDamageBonus).toBe(2);
    expect(result.boardingDps).toBeCloseTo(result.baseDps * 3, 5);
  });

  it("does not apply combat competency for adversaries", () => {
    const weapon = allWeapons.find((w) => w.id === "kuva_kohm")!;
    const modsMap = getEffectiveModsMap();
    const slot: RailjackCrewSlot = {
      role: "defender",
      source: "adversary",
      profileId: "kuva_lich",
      weaponLoadout: {
        weaponId: "kuva_kohm",
        mods: [],
        progenitorElement: "heat",
        progenitorBonusPercent: 55,
      },
    };
    const result = computeCrewBoardingDps(slot, weapon, modsMap)!;
    expect(result.combatDamageBonus).toBe(0);
    expect(result.boardingDps).toBe(result.baseDps);
  });
});
