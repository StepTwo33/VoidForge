import { describe, expect, it } from "vitest";
import { allMods, modsMap } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { allWarframes } from "@/data/warframes";
import { allCompanions } from "@/data/companions";
import { findBlockingModId } from "@/data/mod-exclusions";
import { calculateWeaponBuild, calculateWarframeBuild } from "@/lib/calc/calculator";
import { calculateCompanionBuild } from "@/lib/calc/companion-calculator";
import { buildWarframeSetBonusSummary } from "@/lib/calc/set-bonuses";
import { getModStatDisplayLines } from "@/lib/display/mod-display";
import { resolveWeaponExternalBuffs } from "@/lib/weapons/weapon-external-buffs";
import { modEligibleForWeaponSlot } from "@/lib/mods/mod-weapon-eligibility";
import { getWeaponModProfile } from "@/lib/mods/weapon-mod-tags";
import { getModStatFilterTags } from "@/lib/mods/mod-stat-filters";
import { isArchmeleeMod } from "@/lib/mods/archmelee-mods";
import {
  isWarframeExilusMod,
  isPrimaryWeaponExilusMod,
  isSecondaryWeaponExilusMod,
  isMeleeWeaponExilusMod,
} from "@/lib/mods/mod-slot-categories";
import { RETIRED_MODS, dropRetiredMods } from "@/lib/mods/known-mods";
import { SET_BONUS_DEFINITIONS } from "@/lib/mods/set-mod-catalog";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const weaponById = new Map(allWeapons.map((w) => [w.id, w]));
const warframeById = new Map(allWarframes.map((w) => [w.id, w]));
const companionById = new Map(allCompanions.map((c) => [c.id, c]));
const cardLines = (id: string, rank?: number) => {
  const m = modsMap.get(id)!;
  return getModStatDisplayLines(m, rank ?? m.maxRank).map((l) => l.atRank);
};

describe("Mod Audit Fixes (Calculator, Card Text, Equip Rules, Metadata, Retired)", () => {
  it("Vigilante Fervor gives +90% fire rate on bows (2x) and +45% on rifles/shotguns, and equips on shotguns", () => {
    const mod = modsMap.get("vigilante_fervor")!;
    expect(mod.category).toBe("primary");
    expect(mod.description).toContain("x2 for Bows");

    const paris = weaponById.get("paris")!;
    const braton = weaponById.get("braton")!;
    const sobek = weaponById.get("sobek")!;

    const bowBare = calculateWeaponBuild(paris, [], modsMap);
    const bowModded = calculateWeaponBuild(
      paris,
      [{ modId: "vigilante_fervor", rank: mod.maxRank, slotIndex: 0 }],
      modsMap,
    );
    expect(bowModded.fireRate).toBeCloseTo(bowBare.fireRate * 1.9, 5);

    const rifleBare = calculateWeaponBuild(braton, [], modsMap);
    const rifleModded = calculateWeaponBuild(
      braton,
      [{ modId: "vigilante_fervor", rank: mod.maxRank, slotIndex: 0 }],
      modsMap,
    );
    expect(rifleModded.fireRate).toBeCloseTo(rifleBare.fireRate * 1.45, 5);

    expect(
      modEligibleForWeaponSlot(mod, "primary", sobek.category, "regular", getWeaponModProfile(sobek)),
    ).toBe(true);
  });

  it("Mecha Recharge boosts companion shield recharge (+90%) and leaves Raksa Kubrow shields at 390", () => {
    const raksa = companionById.get("raksa")!;
    const stats = calculateCompanionBuild(
      raksa,
      [{ modId: "mecha_recharge", rank: 5 }],
      modsMap,
    );
    expect(stats.totalShield).toBe(390);
    expect(stats.shieldRechargeBonus).toBeCloseTo(0.9, 5);
    expect(cardLines("mecha_recharge", 5)).toEqual(["+90% Shield Recharge"]);
  });

  it("Catalyzing Shields applies x0.20 max shield multiplier at max rank (R0-R3: 0.80..0.20) and reduces EHP", () => {
    const excal = warframeById.get("excalibur")!;
    const bare = calculateWarframeBuild(excal, [], modsMap);
    const r3 = calculateWarframeBuild(
      excal,
      [{ modId: "catalyzing_shields", rank: 3, slotIndex: 0 }],
      modsMap,
    );
    expect(r3.totalShield).toBeCloseTo(bare.totalShield * 0.2, 5);
    expect(r3.effectiveHealth).toBeLessThan(bare.effectiveHealth);

    const r0 = calculateWarframeBuild(
      excal,
      [{ modId: "catalyzing_shields", rank: 0, slotIndex: 0 }],
      modsMap,
    );
    expect(r0.totalShield).toBeCloseTo(bare.totalShield * 0.8, 5);

    expect(cardLines("catalyzing_shields", 3)).toEqual([
      "x0.20 Max Shield Capacity",
      "1.33s Full Shield Gate Duration",
    ]);
  });

  it("Melee Elementalist, Killing Blow, Amalgam Organ Shatter, and Swift Momentum stack wind-up speed additively", () => {
    const skana = weaponById.get("skana")!;
    const bare = calculateWeaponBuild(skana, [], modsMap);

    const withElem = calculateWeaponBuild(
      skana,
      [{ modId: "melee_elementalist", rank: 5, slotIndex: 0 }],
      modsMap,
    );
    expect(withElem.heavyAttackWindUp).toBeCloseTo(bare.heavyAttackWindUp / 1.6, 5);

    const withKbAndAos = calculateWeaponBuild(
      skana,
      [
        { modId: "killing_blow", rank: 5, slotIndex: 0 },
        { modId: "amalgam_organ_shatter", rank: 5, slotIndex: 1 },
      ],
      modsMap,
    );
    expect(withKbAndAos.heavyAttackWindUp).toBeCloseTo(bare.heavyAttackWindUp / (1 + 0.6 + 0.6), 5);

    const withElemAndSwift = calculateWeaponBuild(
      skana,
      [{ modId: "melee_elementalist", rank: 5, slotIndex: 0 }],
      modsMap,
      undefined,
      DEFAULT_SIM_PARAMS,
      undefined,
      {
        warframeMods: [{ modId: "swift_momentum", rank: 5, slotIndex: 0 }],
      },
    );
    expect(withElemAndSwift.heavyAttackWindUp).toBeCloseTo(bare.heavyAttackWindUp / (1 + 0.6 + 0.3), 5);
    expect(withElemAndSwift.comboDuration).toBeCloseTo(bare.comboDuration + 6, 5);

    expect(cardLines("melee_elementalist", 5)).toContain("+60% Heavy Attack Wind Up Speed");
    expect(cardLines("killing_blow", 5)).toEqual([
      "+120% Melee Damage On Heavy Attack",
      "+60% Heavy Attack Wind Up Speed",
    ]);
    expect(cardLines("amalgam_organ_shatter", 5)).toEqual([
      "+85% Crit multiplier",
      "+60% Heavy Attack Wind Up Speed",
    ]);
    expect(getModStatFilterTags(modsMap.get("melee_elementalist")!).has("speed")).toBe(true);
  });

  it("Teeming Virulence grants +200% Primary Critical Chance at max rank", () => {
    expect(cardLines("teeming_virulence", 3)).toEqual([
      "+200% Crit chance",
      "+15s Duration",
    ]);

    const braton = weaponById.get("braton")!;
    const excal = warframeById.get("excalibur")!;
    const wfStats = calculateWarframeBuild(excal, [], modsMap);
    const buffs = resolveWeaponExternalBuffs(
      braton,
      {
        warframeId: "nidus",
        warframeStats: { ...wfStats, abilityStrength: 1 },
        warframeAbilities: [{ name: "Virulence", energyCost: 40, description: "" }],
        warframeModSlots: [{ modId: "teeming_virulence", slotIndex: 0, rank: 3 }],
        allMods: modsMap,
      },
      { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Virulence"] },
    );
    expect(buffs.find((b) => b.id === "ability:Teeming Virulence")?.critChanceBonus).toBeCloseTo(2.0, 6);
  });

  it("Mod card text fixes: Claw Bite shows +220% Crit Damage (not +660%), Drift/Parkour cards show exact wiki stats", () => {
    expect(cardLines("claw_bite", 10)).toEqual([
      "+330% Crit chance",
      "+220% Crit multiplier",
    ]);
    expect(cardLines("firewalker", 10)).toEqual([
      "+24.2% Bullet Jump",
      "+24.2% Aim Glide/Wall Latch Duration",
      "+275% Heat damage",
    ]);
    expect(cardLines("battering_maneuver", 5)).toEqual([
      "+18% Bullet Jump",
      "+18% Aim Glide/Wall Latch Duration",
      "+60% Impact damage",
    ]);
    expect(cardLines("speed_drift", 5)).toEqual([
      "+12% Sprint speed",
      "+15% Cast Speed",
    ]);
    expect(cardLines("stealth_drift", 5)).toEqual([
      "+18m Enemy Radar",
      "+12% Aim Glide/Wall Latch Duration",
    ]);
    expect(cardLines("mobilize_r3", 3)).toEqual([
      "+20% Parkour Velocity",
      "+20% Aim Glide/Wall Latch Duration",
    ]);
    expect(cardLines("endurance_drift", 5)).toEqual([
      "+10% Energy Max",
      "+12% Parkour Velocity",
    ]);
    expect(cardLines("radon_claws", 3)).toEqual([
      "+60% Radiation damage",
      "+80% Crit multiplier",
    ]);
  });

  it("Nira's set bonus is +150% Slam Attack damage per piece (150/300/450%)", () => {
    expect(SET_BONUS_DEFINITIONS.set_bonus_nira.description).toContain("150%");
    const bonuses = buildWarframeSetBonusSummary([
      { modId: "niras_hatred", rank: 5, slotIndex: 0 },
      { modId: "niras_anguish", rank: 5, slotIndex: 1 },
    ]);
    const nira = bonuses.find((b) => b.setId === "nira");
    expect(nira?.description).toContain("+300%");
  });

  it("Chilling Globe and Cold Front cannot be equipped together", () => {
    expect(findBlockingModId("augment_frost_cold_front", ["augment_frost_chilling_globe"])).toBe(
      "augment_frost_chilling_globe",
    );
    expect(findBlockingModId("augment_frost_chilling_globe", ["augment_frost_cold_front"])).toBe(
      "augment_frost_cold_front",
    );
  });

  it("Exilus mods fit regular weapon slots too, and weapon Exilus slots enforce weapon class & sub-class", () => {
    const braton = weaponById.get("braton")!;
    const sobek = weaponById.get("sobek")!;
    const rubico = weaponById.get("rubico")!;
    const paris = weaponById.get("paris")!;
    const skana = weaponById.get("skana")!;
    const glaive = weaponById.get("glaive")!;

    const counterbalance = modsMap.get("counterbalance")!;
    const stabilizer = modsMap.get("stabilizer")!;
    const gunGlide = modsMap.get("gun_glide")!;
    const arrowMut = modsMap.get("arrow_mutation")!;
    const whirlwind = modsMap.get("whirlwind")!;
    const parry = modsMap.get("parry_r3")!;

    // Weapon Exilus mods fit regular slots on matching weapons
    expect(modEligibleForWeaponSlot(stabilizer, "primary", braton.category, "regular", getWeaponModProfile(braton))).toBe(true);
    expect(modEligibleForWeaponSlot(counterbalance, "primary", sobek.category, "regular", getWeaponModProfile(sobek))).toBe(true);
    expect(modEligibleForWeaponSlot(parry, "melee", skana.category, "regular", getWeaponModProfile(skana))).toBe(true);
    expect(modEligibleForWeaponSlot(parry, "melee", skana.category, "weapon_exilus_melee", getWeaponModProfile(skana))).toBe(true);

    // Shotgun Exilus does NOT fit Rifle Exilus or Regular; Rifle Exilus does NOT fit Shotgun Exilus or Regular
    expect(modEligibleForWeaponSlot(counterbalance, "primary", braton.category, "weapon_exilus_primary", getWeaponModProfile(braton))).toBe(false);
    expect(modEligibleForWeaponSlot(counterbalance, "primary", braton.category, "regular", getWeaponModProfile(braton))).toBe(false);
    expect(modEligibleForWeaponSlot(stabilizer, "primary", sobek.category, "weapon_exilus_primary", getWeaponModProfile(sobek))).toBe(false);
    expect(modEligibleForWeaponSlot(stabilizer, "primary", sobek.category, "regular", getWeaponModProfile(sobek))).toBe(false);

    // Sub-class restrictions apply in BOTH Exilus and Regular slots
    expect(modEligibleForWeaponSlot(gunGlide, "primary", braton.category, "weapon_exilus_primary", getWeaponModProfile(braton))).toBe(true);
    expect(modEligibleForWeaponSlot(gunGlide, "primary", rubico.category, "weapon_exilus_primary", getWeaponModProfile(rubico))).toBe(false);
    expect(modEligibleForWeaponSlot(gunGlide, "primary", paris.category, "weapon_exilus_primary", getWeaponModProfile(paris))).toBe(false);

    expect(modEligibleForWeaponSlot(arrowMut, "primary", paris.category, "weapon_exilus_primary", getWeaponModProfile(paris))).toBe(true);
    expect(modEligibleForWeaponSlot(arrowMut, "primary", braton.category, "weapon_exilus_primary", getWeaponModProfile(braton))).toBe(false);

    expect(modEligibleForWeaponSlot(whirlwind, "melee", glaive.category, "weapon_exilus_melee", getWeaponModProfile(glaive))).toBe(true);
    expect(modEligibleForWeaponSlot(whirlwind, "melee", skana.category, "weapon_exilus_melee", getWeaponModProfile(skana))).toBe(false);

    // Warframe/weapon Exilus set cleanups
    expect(isWarframeExilusMod(modsMap.get("augment_frost_cold_front")!)).toBe(true);
    expect(isWarframeExilusMod(modsMap.get("stealth_drift")!)).toBe(true);
    expect(isPrimaryWeaponExilusMod(modsMap.get("eagle_eye")!)).toBe(true);
    expect(isPrimaryWeaponExilusMod(modsMap.get("agile_aim")!)).toBe(true);
    expect(isSecondaryWeaponExilusMod(modsMap.get("hush_r3")!)).toBe(false);
    expect(isMeleeWeaponExilusMod(modsMap.get("snap_shot")!)).toBe(false);
  });

  it("Enforces Archmelee, Sniper-only, Bow-only, Assault-Rifle-only, Thrown, Glaive, and Contempt sub-class rules", () => {
    const braton = weaponById.get("braton")!;
    const rubico = weaponById.get("rubico")!;
    const paris = weaponById.get("paris")!;
    const sobek = weaponById.get("sobek")!;
    const lex = weaponById.get("lex")!;
    const kunai = weaponById.get("kunai")!;
    const castanas = weaponById.get("castanas")!;
    const skana = weaponById.get("skana")!;
    const glaive = weaponById.get("glaive")!;
    const fangPrime = weaponById.get("fang_prime")!;
    const orthosPrime = weaponById.get("orthos_prime")!;

    // Archmelee mods don't fit shotguns or ground melee
    for (const id of ["critical_meltdown", "cryo_coating", "magnetized_core", "conductive_blade"]) {
      const m = modsMap.get(id)!;
      expect(m.category).toBe("archmelee");
      expect(isArchmeleeMod(m)).toBe(true);
      expect(modEligibleForWeaponSlot(m, "primary", sobek.category, "regular", getWeaponModProfile(sobek))).toBe(false);
      expect(modEligibleForWeaponSlot(m, "melee", skana.category, "regular", getWeaponModProfile(skana))).toBe(false);
    }

    // Sniper-only
    const chargedChamber = modsMap.get("charged_chamber")!;
    expect(modEligibleForWeaponSlot(chargedChamber, "primary", rubico.category, "regular", getWeaponModProfile(rubico))).toBe(true);
    expect(modEligibleForWeaponSlot(chargedChamber, "primary", braton.category, "regular", getWeaponModProfile(braton))).toBe(false);
    expect(modEligibleForWeaponSlot(chargedChamber, "primary", paris.category, "regular", getWeaponModProfile(paris))).toBe(false);

    // Bow-only
    const thunderbolt = modsMap.get("thunderbolt")!;
    expect(modEligibleForWeaponSlot(thunderbolt, "primary", paris.category, "regular", getWeaponModProfile(paris))).toBe(true);
    expect(modEligibleForWeaponSlot(thunderbolt, "primary", braton.category, "regular", getWeaponModProfile(braton))).toBe(false);

    // Assault-Rifle-only
    const taintedMag = modsMap.get("tainted_mag")!;
    expect(modEligibleForWeaponSlot(taintedMag, "primary", braton.category, "regular", getWeaponModProfile(braton))).toBe(true);
    expect(modEligibleForWeaponSlot(taintedMag, "primary", rubico.category, "regular", getWeaponModProfile(rubico))).toBe(false);
    expect(modEligibleForWeaponSlot(taintedMag, "primary", paris.category, "regular", getWeaponModProfile(paris))).toBe(false);

    // Thrown Secondary-only (Concealed Explosives)
    const ce = modsMap.get("concealed_explosives")!;
    expect(modEligibleForWeaponSlot(ce, "secondary", kunai.category, "regular", getWeaponModProfile(kunai))).toBe(true);
    expect(modEligibleForWeaponSlot(ce, "secondary", lex.category, "regular", getWeaponModProfile(lex))).toBe(false);
    expect(modEligibleForWeaponSlot(ce, "secondary", castanas.category, "regular", getWeaponModProfile(castanas))).toBe(false);

    // Thrown Melee (Glaive)-only
    const powerThrow = modsMap.get("power_throw")!;
    expect(modEligibleForWeaponSlot(powerThrow, "melee", glaive.category, "regular", getWeaponModProfile(glaive))).toBe(true);
    expect(modEligibleForWeaponSlot(powerThrow, "melee", skana.category, "regular", getWeaponModProfile(skana))).toBe(false);

    // Archon Contempt melee mods fit regular melee slots of their weapon class
    const amarsContempt = modsMap.get("amars_contempt")!;
    const borealsContempt = modsMap.get("boreals_contempt")!;
    expect(modEligibleForWeaponSlot(amarsContempt, "melee", fangPrime.category, "regular", getWeaponModProfile(fangPrime))).toBe(true);
    expect(modEligibleForWeaponSlot(amarsContempt, "melee", skana.category, "regular", getWeaponModProfile(skana))).toBe(false);
    expect(modEligibleForWeaponSlot(borealsContempt, "melee", orthosPrime.category, "regular", getWeaponModProfile(orthosPrime))).toBe(true);
  });

  it("Fixes all 18 wiki name capitalizations, polarities, rarities, and retires the 11 removed mods", () => {
    expect(modsMap.get("bane_of_corpus")?.name).toBe("Bane of Corpus");
    expect(modsMap.get("primed_bane_of_grineer")?.name).toBe("Primed Bane of Grineer");
    expect(modsMap.get("mark_of_the_beast")?.name).toBe("Mark of the Beast");
    expect(modsMap.get("winds_of_purity")?.name).toBe("Winds of Purity");
    expect(modsMap.get("byteryte")?.name).toBe("ByteRyte");
    expect(modsMap.get("kaal_zidi")?.name).toBe("Kaal-zidi");

    expect(modsMap.get("claw_bite")?.rarity).toBe("rare");
    expect(modsMap.get("archon_intensify")?.rarity).toBe("legendary");
    expect(modsMap.get("archon_stretch")?.rarity).toBe("legendary");
    expect(modsMap.get("augment_universal_health_conversion")?.polarity).toBe("vazarin");
    expect(modsMap.get("claw_shred")?.polarity).toBe("madurai");

    const retired = [
      "cannonade",
      "resilient_focus",
      "divebomb_vortex",
      "iron_vault",
      "shield_transference",
      "soaring_truth",
      "air_martial",
      "harrowed_hook",
      "evolution_incarnon_rifle",
      "evolution_incarnon_pistol",
      "evolution_incarnon_melee",
    ];
    for (const id of retired) {
      expect(modsMap.has(id), id).toBe(false);
      expect(allMods.some((m) => m.id === id), id).toBe(false);
      expect(RETIRED_MODS[id], id).toBeDefined();
    }
    const { dropped } = dropRetiredMods([{ modId: "cannonade" }, { modId: "divebomb_vortex" }], modsMap);
    expect(dropped.map((d) => d.modId)).toEqual(["cannonade", "divebomb_vortex"]);
  });
});
