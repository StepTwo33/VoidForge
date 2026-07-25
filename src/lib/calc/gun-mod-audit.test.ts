/**
 * Phase 2a — high-use primary / secondary / shotgun mod apply goldens.
 * Each case is wiki-checked for that mod ID (max rank).
 */
import { describe, expect, it } from "vitest";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild, quantizeDamageValue } from "@/lib/calc/calculator";
import { quantizeBaseCritMultiplier } from "@/lib/calc/crit-utils";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

function requireMod(id: string) {
  const mod = allMods.find((m) => m.id === id);
  expect(mod, `missing mod ${id}`).toBeDefined();
  return mod!;
}

function requireWeapon(id: string) {
  const weapon = allWeapons.find((w) => w.id === id);
  expect(weapon, `missing weapon ${id}`).toBeDefined();
  return weapon!;
}

function withMod(weaponId: string, modId: string, sim = DEFAULT_SIM_PARAMS) {
  const weapon = requireWeapon(weaponId);
  const mod = requireMod(modId);
  return calculateWeaponBuild(
    weapon,
    [{ modId, rank: mod.maxRank, slotIndex: 0 }],
    modsMap(),
    undefined,
    sim,
  );
}

describe("primary rifle mods (wiki max rank)", () => {
  it("Serration R10: +165% damage → Braton modded base 24×2.65", () => {
    const stats = withMod("braton", "serration_r3");
    expect(stats.moddedBaseDamage).toBeCloseTo(24 * 2.65, 8);
  });

  it("Split Chamber R5: +90% multishot", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "split_chamber_r3");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 1.9, 8);
  });

  it("Point Strike R5: +150% crit chance (additive on base)", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "point_strike_r3");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 2.5, 8);
  });

  it("Vital Sense R5: +120% crit damage after CM quantize", () => {
    const weapon = requireWeapon("braton");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("braton", "vital_sense_r3");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 2.2, 8);
  });

  it("Hellfire R5: +90% heat from base, then damage quantize", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "hellfire_r3");
    const rawHeat = weapon.damage * 0.9;
    const scale = stats.moddedBaseDamage / 32;
    const expected = quantizeDamageValue(rawHeat, scale);
    const heat = stats.elements.find((e) => e.type === "heat");
    expect(heat?.value).toBeCloseTo(expected, 8);
  });

  it("Stormbringer / Cryo Rounds / Infected Clip: ±90% elementals from base", () => {
    for (const [modId, type] of [
      ["stormbringer_r3", "electricity"],
      ["cryo_rounds_r3", "cold"],
      ["infected_clip_r3", "toxin"],
    ] as const) {
      const weapon = requireWeapon("braton");
      const stats = withMod("braton", modId);
      const scale = stats.moddedBaseDamage / 32;
      const expected = quantizeDamageValue(weapon.damage * 0.9, scale);
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(expected, 8);
    }
  });

  it("Primed Bane of Grineer: ×1.55 paper DPS when targetFaction=grineer", () => {
    const bare = calculateWeaponBuild(requireWeapon("braton"), [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "grineer",
    });
    const modded = withMod("braton", "primed_bane_of_grineer", {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "grineer",
    });
    expect(modded.factionBonuses?.grineer).toBeCloseTo(0.55, 8);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1.55, 8);
  });
});

describe("secondary pistol mods (wiki max rank)", () => {
  it("Hornet Strike R10: +220% damage", () => {
    const stats = withMod("lex", "hornet_strike_r3");
    expect(stats.moddedBaseDamage).toBeCloseTo(130 * 3.2, 8);
  });

  it("Barrel Diffusion R5: +120% multishot", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "barrel_diffusion_r3");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 2.2, 8);
  });

  it("Pistol Gambit R5: +120% crit chance", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "pistol_gambit_r3");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 2.2, 8);
  });

  it("Target Cracker R5: +60% crit damage after CM quantize", () => {
    const weapon = requireWeapon("lex");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("lex", "target_cracker_r3");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.6, 8);
  });

  it("Primed Target Cracker R10: +110% crit damage", () => {
    const weapon = requireWeapon("lex");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("lex", "primed_target_cracker");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 2.1, 8);
  });

  it("Primed Pistol Gambit R10: +187% crit chance", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "primed_pistol_gambit");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * (1 + 1.87), 8);
  });

  it("Primed Heated Charge R10: +165% heat from base", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "primed_heated_charge");
    const scale = stats.moddedBaseDamage / 32;
    const expected = quantizeDamageValue(weapon.damage * 1.65, scale);
    expect(stats.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(expected, 8);
  });
});

describe("shotgun mods (wiki max rank)", () => {
  it("Point Blank R5: +90% damage", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "point_blank_r3");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.9, 8);
  });

  it("Primed Point Blank R10: +165% damage", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "primed_point_blank");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.65, 8);
  });

  it("Hell's Chamber R5: +120% multishot", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "hells_chamber");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 2.2, 8);
  });

  it("Blaze R3: +60% damage and +60% heat from modded base", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "blaze");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.6, 8);
    const scale = stats.moddedBaseDamage / 32;
    // Wiki: elemental % applies to modded base (includes Blaze's own +damage)
    const expectedHeat = quantizeDamageValue(stats.moddedBaseDamage * 0.6, scale);
    expect(stats.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(expectedHeat, 8);
  });

  it("Shotgun Spazz R5: +90% fire rate", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "shotgun_spazz");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.9, 8);
  });

  it("Vicious Spread R5: +90% damage (spread panel-only)", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "vicious_spread");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.9, 8);
  });
});

describe("primary remainder (wiki max rank, Phase M1)", () => {
  it("Heavy Caliber R10: +165% damage (accuracy panel-only)", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "heavy_caliber");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.65, 8);
  });

  it("Amalgam Serration R10: +155% damage (cross-check amalgam-serration.test.ts)", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "amalgam_serration");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.55, 4);
  });

  it("Hunter Munitions R5: +30% slash-on-crit chance", () => {
    const stats = withMod("braton", "hunter_munitions");
    expect(stats.slashOnCritChance).toBeCloseTo(0.3, 8);
  });

  it("Primed Cryo Rounds R10: +165% cold from base", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "primed_cryo_rounds");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "cold")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 1.65, scale),
      8,
    );
  });

  it("Speed Trigger R5: +60% fire rate", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "speed_trigger_r3");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.6, 8);
  });

  it("Hammer Shot R3: +60% crit damage, +80% status", () => {
    const weapon = requireWeapon("braton");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("braton", "hammer_shot");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.6, 8);
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.8, 8);
  });

  it("Critical Delay R5: +200% crit chance, −20% fire rate", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "critical_delay");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 3, 4);
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 0.8, 4);
  });

  it("High Voltage / Rime Rounds / Malignant Force / Thermite: 60/60 dual-stat", () => {
    for (const [modId, type] of [
      ["high_voltage_r3", "electricity"],
      ["rime_rounds_r3", "cold"],
      ["malignant_force_r3", "toxin"],
      ["thermite_rounds_nightmare", "heat"],
    ] as const) {
      const weapon = requireWeapon("braton");
      const stats = withMod("braton", modId);
      expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.6, scale),
        8,
      );
    }
  });
});

describe("secondary remainder (wiki max rank, Phase M1)", () => {
  it("Lethal Torrent R5: +60% fire rate and +60% multishot", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "lethal_torrent");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.6, 8);
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 1.6, 8);
  });

  it("Anemic Agility R5: +90% fire rate, −15% damage", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "anemic_agility");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.9, 8);
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 0.85, 8);
  });

  it("Gunslinger R5: +72% fire rate", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "gunslinger_r3");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.72, 8);
  });

  it("Heated Charge / Pathogen / Deep Freeze / Convulsion: ±90% elementals", () => {
    for (const [modId, type] of [
      ["heated_charge_r3", "heat"],
      ["pathogen_rounds_r3", "toxin"],
      ["deep_freeze_r3", "cold"],
      ["convulsion_r3", "electricity"],
    ] as const) {
      const weapon = requireWeapon("lex");
      const stats = withMod("lex", modId);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.9, scale),
        8,
      );
    }
  });

  it("Frostbite / Pistol Pestilence / Jolt / Scorch: 60/60 dual-stat", () => {
    for (const [modId, type] of [
      ["frostbite_r3", "cold"],
      ["pistol_pestilence_r3", "toxin"],
      ["jolt_r3", "electricity"],
      ["scorch_r3", "heat"],
    ] as const) {
      const weapon = requireWeapon("lex");
      const stats = withMod("lex", modId);
      expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.6, scale),
        8,
      );
    }
  });
});

describe("shotgun remainder (wiki max rank, Phase M1)", () => {
  it("Primed Ravage R10: +110% crit damage", () => {
    const weapon = requireWeapon("strun");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("strun", "primed_ravage");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 2.1, 8);
  });

  it("Contagious Spread R5: +90% toxin from base", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "contagious_spread_r3");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "toxin")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.9, scale),
      8,
    );
  });

  it("Incendiary Coat / Charged Shell / Chilling Grasp: ±90% elementals", () => {
    for (const [modId, type] of [
      ["incendiary_coat_r3", "heat"],
      ["charged_shell_r3", "electricity"],
      ["chilling_grasp_r3", "cold"],
    ] as const) {
      const weapon = requireWeapon("strun");
      const stats = withMod("strun", modId);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.9, scale),
        8,
      );
    }
  });

  it("Frigid Blast / Shell Shock / Scattering Inferno / Toxic Barrage: 60/60", () => {
    for (const [modId, type] of [
      ["frigid_blast_r3", "cold"],
      ["shell_shock_r3", "electricity"],
      ["scattering_inferno_r3", "heat"],
      ["toxic_barrage_r3", "toxin"],
    ] as const) {
      const weapon = requireWeapon("strun");
      const stats = withMod("strun", modId);
      expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.6, scale),
        8,
      );
    }
  });
});

describe("primary cores (wiki max rank, Phase M5)", () => {
  it("Shred R5: +30% fire rate", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "shred");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.3, 8);
  });

  it("Primed Shred R10: +55% fire rate", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "primed_shred");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.55, 8);
  });

  it("Vigilante Armaments R5: +60% multishot", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "vigilante_armaments");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 1.6, 8);
  });

  it("Vigilante Fervor R5: +45% fire rate", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "vigilante_fervor");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.45, 8);
  });

  it("Vile Acceleration R5: +90% fire rate, −15% damage", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "vile_acceleration");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.9, 8);
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 0.85, 8);
  });

  it("Frail Momentum R5: +90% fire rate, −15% damage", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "frail_momentum");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.9, 8);
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 0.85, 8);
  });

  it("Rifle Aptitude R5: +90% status chance", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "rifle_aptitude_r3");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.9, 8);
  });

  it("Sawtooth Clip / Piercing Hit / Rupture: +90% Slash/Puncture/Impact", () => {
    const weapon = requireWeapon("braton");
    const slash = withMod("braton", "sawtooth_clip");
    const puncture = withMod("braton", "piercing_hit");
    const impact = withMod("braton", "rupture");
    expect(slash.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9, slash.moddedBaseDamage / 32),
      8,
    );
    expect(puncture.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.9, puncture.moddedBaseDamage / 32),
      8,
    );
    expect(impact.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 1.9, impact.moddedBaseDamage / 32),
      8,
    );
  });

  it("Fanged Fusillade / Piercing Caliber / Crash Course: +120% Slash/Puncture/Impact", () => {
    const weapon = requireWeapon("braton");
    const slash = withMod("braton", "fanged_fusillade");
    const puncture = withMod("braton", "piercing_caliber");
    const impact = withMod("braton", "crash_course");
    expect(slash.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 2.2, slash.moddedBaseDamage / 32),
      8,
    );
    expect(puncture.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 2.2, puncture.moddedBaseDamage / 32),
      8,
    );
    expect(impact.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 2.2, impact.moddedBaseDamage / 32),
      8,
    );
  });

  it("Primed Bane of Corpus: ×1.55 paper DPS when targetFaction=corpus", () => {
    const bare = calculateWeaponBuild(requireWeapon("braton"), [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "corpus",
    });
    const modded = withMod("braton", "primed_bane_of_corpus", {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "corpus",
    });
    expect(modded.factionBonuses?.corpus).toBeCloseTo(0.55, 8);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1.55, 8);
  });
});

describe("secondary cores (wiki max rank, Phase M5)", () => {
  it("Magnum Force R10: +165% damage (accuracy panel-only)", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "magnum_force");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.65, 8);
  });

  it("Augur Pact (augur_breach) R5: +90% damage", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "augur_breach");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.9, 8);
  });

  it("Creeping Bullseye R5: +200% crit chance, −20% fire rate", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "creeping_bullseye");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 3, 4);
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 0.8, 4);
  });

  it("Hollow Point R5: +60% crit damage, −15% damage", () => {
    const weapon = requireWeapon("lex");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("lex", "hollow_point");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.6, 8);
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 0.85, 8);
  });

  it("Primed Convulsion R10: +165% electricity from base", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "primed_convulsion");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "electricity")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 1.65, scale),
      8,
    );
  });

  it("Bore / Maim / Pummel: +120% Puncture/Slash/Impact", () => {
    const weapon = requireWeapon("lex");
    const puncture = withMod("lex", "bore");
    const slash = withMod("lex", "maim");
    const impact = withMod("lex", "pummel");
    expect(puncture.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 2.2, puncture.moddedBaseDamage / 32),
      8,
    );
    expect(slash.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 2.2, slash.moddedBaseDamage / 32),
      8,
    );
    expect(impact.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 2.2, impact.moddedBaseDamage / 32),
      8,
    );
  });

  it("Concussion Rounds / No Return / Razor Shot: +90% Impact/Puncture/Slash", () => {
    const weapon = requireWeapon("lex");
    const impact = withMod("lex", "concussion_rounds");
    const puncture = withMod("lex", "no_return");
    const slash = withMod("lex", "razor_shot");
    expect(impact.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 1.9, impact.moddedBaseDamage / 32),
      8,
    );
    expect(puncture.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.9, puncture.moddedBaseDamage / 32),
      8,
    );
    expect(slash.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9, slash.moddedBaseDamage / 32),
      8,
    );
  });
});

describe("shotgun cores (wiki max rank, Phase M5)", () => {
  it("Primed Charged Shell R10: +165% electricity from base", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "primed_charged_shell");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "electricity")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 1.65, scale),
      8,
    );
  });

  it("Primed Chilling Grasp R10: +165% cold from base", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "primed_chilling_grasp");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "cold")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 1.65, scale),
      8,
    );
  });
});

describe("primary cores (wiki max rank, Phase M6)", () => {
  it("Wildfire R3: +60% heat from base, +20% magazine", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "wildfire");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.2));
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Vile Precision R5: −36% fire rate (recoil panel-only)", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "vile_precision");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 0.64, 8);
  });

  it("Primed Bane of Infested: ×1.55 paper DPS when targetFaction=infested", () => {
    const bare = calculateWeaponBuild(requireWeapon("braton"), [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "infested",
    });
    const modded = withMod("braton", "primed_bane_of_infested", {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "infested",
    });
    expect(modded.factionBonuses?.infested).toBeCloseTo(0.55, 8);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1.55, 8);
  });
});

describe("secondary cores (wiki max rank, Phase M6)", () => {
  it("Amalgam Barrel Diffusion R5: +110% multishot", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "amalgam_barrel_diffusion");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 2.1, 5);
  });

  it("Ice Storm R3: +40% cold from base, +40% magazine", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "ice_storm");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.4));
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "cold")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.4, scale),
      8,
    );
  });

  it("Sure Shot R5: +90% status chance", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "sure_shot");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.9, 8);
  });

  it("Stunning Speed R3: +30% status, +40% reload speed", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "stunning_speed");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.3, 8);
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.4, 8);
  });

  it("Shrapnel Rounds R0: +200% multishot, −66% damage", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "shrapnel_rounds");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 3, 8);
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 0.34, 8);
  });

  it("Carnis Stinger / Jugulus Spines / Saxum Spittle: 90 IPS / 60 status", () => {
    const weapon = requireWeapon("lex");
    const slash = withMod("lex", "carnis_stinger");
    const puncture = withMod("lex", "jugulus_spines");
    const impact = withMod("lex", "saxum_spittle");
    expect(slash.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
    expect(puncture.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
    expect(impact.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
    expect(slash.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9, slash.moddedBaseDamage / 32),
      8,
    );
    expect(puncture.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.9, puncture.moddedBaseDamage / 32),
      8,
    );
    expect(impact.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 1.9, impact.moddedBaseDamage / 32),
      8,
    );
  });
});

describe("shotgun cores (wiki max rank, Phase M6)", () => {
  it("Critical Deceleration R5: +200% crit chance, −20% fire rate", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "critical_deceleration");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 3, 4);
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 0.8, 4);
  });
});

describe("primary magazine/reload cores (wiki max rank, Phase M7)", () => {
  it("Fast Hands R5: +30% reload speed", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "fast_hands_r3");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.3, 8);
  });

  it("Seeking Fury R5: +15% reload speed", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "seeking_fury");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.15, 8);
  });

  it("Magazine Warp R5 / Primed Magazine Warp R10: +30% / +55% magazine", () => {
    const weapon = requireWeapon("braton");
    expect(withMod("braton", "magazine_warp_r3").magazine).toBe(Math.round(weapon.magazine * 1.3));
    expect(withMod("braton", "primed_magazine_warp").magazine).toBe(Math.round(weapon.magazine * 1.55));
  });

  it("Tainted Mag R10: +66% magazine, −33% reload speed", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "tainted_mag");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.66));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime * 1.33, 8);
  });

  it("Depleted Reload R5: −60% magazine, +48% reload speed", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "depleted_reload");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 0.4));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.48, 8);
  });

  it("Maximum Capacity R5: +30% magazine, −15% reload speed", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "maximum_capacity");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.3));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime * 1.15, 8);
  });
});

describe("secondary magazine/reload cores (wiki max rank, Phase M7)", () => {
  it("Slip Magazine R5 / Primed Slip Magazine R10: +30% / +55% magazine", () => {
    const weapon = requireWeapon("lex");
    expect(withMod("lex", "slip_magazine_r3").magazine).toBe(Math.round(weapon.magazine * 1.3));
    expect(withMod("lex", "primed_slip_magazine").magazine).toBe(Math.round(weapon.magazine * 1.55));
  });

  it("Quickdraw R5: +48% reload speed", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "quickdraw_r3");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.48, 8);
  });

  it("Loose Magazine R5: +50% reload speed", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "loose_magazine");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.5, 5);
  });

  it("Tainted Clip R5: +60% magazine, −30% reload speed", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "tainted_clip");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.6));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime * 1.3, 8);
  });

  it("Full Capacity R5: +30% magazine, −15% reload speed", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "full_capacity");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.3));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime * 1.15, 8);
  });

  it("Merciless Gunfight R5: +45% crit damage", () => {
    const weapon = requireWeapon("lex");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("lex", "merciless_gunfight");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.45, 8);
  });

  it("Magnetic Might R3: +60% magnetic from base, +40% crit damage", () => {
    const weapon = requireWeapon("lex");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("lex", "magnetic_might");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Accelerated Isotope R3: +60% radiation from base, +40% fire rate", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "accelerated_isotope");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "radiation")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });
});

describe("shotgun magazine cores (wiki max rank, Phase M7)", () => {
  it("Burdened Magazine R5: +60% magazine, −18% reload speed", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "burdened_magazine");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.6));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime * 1.18, 8);
  });
});

describe("primary/secondary leftovers + elementalist (wiki max rank, Phase M8)", () => {
  it("Magnetic Capacity R3: +60% magnetic from base, +40% magazine", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "magnetic_capacity");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.4));
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Radiated Reload R3: +60% radiation from base, +40% reload speed", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "radiated_reload");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "radiation")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Loose Hatch R5: +30% reload speed (recoil panel-only)", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "loose_hatch");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.3, 8);
  });

  it("Rifle Elementalist R5: +90% status damage, no base damage inflate", () => {
    const weapon = requireWeapon("braton");
    const stats = withMod("braton", "rifle_elementalist");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage, 8);
    expect(stats.statusDamageBonus).toBeCloseTo(0.9, 8);
  });

  it("Pistol Elementalist R5: +90% status damage, +60% reload speed", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "pistol_elementalist");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage, 8);
    expect(stats.statusDamageBonus).toBeCloseTo(0.9, 8);
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.6, 8);
  });

  it("Shotgun Elementalist R5: +90% status damage, +60% magazine", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "shotgun_elementalist");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage, 8);
    expect(stats.statusDamageBonus).toBeCloseTo(0.9, 8);
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.6));
  });

  it("Damzav-Vati R5: +240% viral from base", () => {
    const weapon = requireWeapon("lex");
    const stats = withMod("lex", "damzav_vati");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "viral")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 2.4, scale),
      8,
    );
  });
});

describe("shotgun general cores (wiki max rank, Phase M9)", () => {
  it("Blunderbuss R5 / Primed Blunderbuss R10: +90% / +165% crit chance", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "blunderbuss_r3").criticalChance).toBeCloseTo(
      weapon.criticalChance * 1.9,
      8,
    );
    expect(withMod("strun", "primed_blunderbuss").criticalChance).toBeCloseTo(
      weapon.criticalChance * 2.65,
      8,
    );
  });

  it("Shotgun Savvy R5: +90% status chance", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "shotgun_savvy").statusChance).toBeCloseTo(
      weapon.statusChance * 1.9,
      8,
    );
  });

  it("Ammo Stock R5 / Primed Ammo Stock R10: +60% / +110% magazine", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "ammo_stock_r3").magazine).toBe(Math.round(weapon.magazine * 1.6));
    expect(withMod("strun", "primed_ammo_stock").magazine).toBe(Math.round(weapon.magazine * 2.1));
  });

  it("Amalgam Shotgun Barrage R5: +85% fire rate", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "amalgam_shotgun_barrage").fireRate).toBeCloseTo(
      weapon.fireRate * 1.85,
      3,
    );
  });

  it("Accelerated Blast R3: +60% fire rate, +60% puncture", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "accelerated_blast_r3");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.6, 8);
    expect(stats.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.6, stats.moddedBaseDamage / 32),
      8,
    );
  });

  it("Breach Loader / Full Contact: +120% puncture / impact; Flechette / Disruptor: +90%", () => {
    const weapon = requireWeapon("strun");
    const breach = withMod("strun", "breach_loader");
    const flechette = withMod("strun", "flechette");
    const full = withMod("strun", "full_contact");
    const disruptor = withMod("strun", "disruptor");
    expect(breach.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 2.2, breach.moddedBaseDamage / 32),
      8,
    );
    expect(flechette.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.9, flechette.moddedBaseDamage / 32),
      8,
    );
    expect(full.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 2.2, full.moddedBaseDamage / 32),
      8,
    );
    expect(disruptor.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 1.9, disruptor.moddedBaseDamage / 32),
      8,
    );
  });

  it("Chilling Reload R3: +60% cold from base, +40% reload speed", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "chilling_reload");
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime / 1.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "cold")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Atomic Fallout R3: +60% radiation from base, +40% magazine", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "atomic_fallout");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.4));
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "radiation")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Critical Meltdown R3: +60% radiation from base, +60% crit chance", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "critical_meltdown");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 1.6, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "radiation")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Cryo Coating R3: +60% cold from base, +60% status chance", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "cryo_coating");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "cold")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Magnetic Strafe R3: +60% magnetic from base, +40% fire rate", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "magnetic_strafe");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Magnetized Core R3: +60% magnetic from base, +40% crit damage", () => {
    const weapon = requireWeapon("strun");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("strun", "magnetized_core");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Loaded Capacity R5: +30% magazine, −15% reload speed", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "loaded_capacity");
    expect(stats.magazine).toBe(Math.round(weapon.magazine * 1.3));
    expect(stats.reloadTime).toBeCloseTo(weapon.reloadTime * 1.15, 8);
  });

  it("Loose Chamber R5: +30% reload speed", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "loose_chamber").reloadTime).toBeCloseTo(weapon.reloadTime / 1.3, 8);
  });

  it("Lingering Torment R5: +90% status duration", () => {
    expect(withMod("strun", "lingering_torment").statusDurationBonus).toBeCloseTo(0.9, 8);
  });

  it("Conductive Blade R5: +120% electricity from base", () => {
    const weapon = requireWeapon("strun");
    const stats = withMod("strun", "conductive_blade");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "electricity")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 1.2, scale),
      8,
    );
  });
});

describe("gun utility leftovers (wiki max rank, Phase M9)", () => {
  it("Hydraulic Gauge R3: −10% magazine", () => {
    const weapon = requireWeapon("braton");
    expect(withMod("braton", "hydraulic_gauge").magazine).toBe(Math.round(weapon.magazine * 0.9));
  });

  it("Hydraulic Barrel R3: −20% magazine", () => {
    const weapon = requireWeapon("lex");
    expect(withMod("lex", "hydraulic_barrel").magazine).toBe(Math.round(weapon.magazine * 0.8));
  });

  it("Bhisaj-Bal R5: +90% status chance", () => {
    const weapon = requireWeapon("braton");
    expect(withMod("braton", "bhisaj_bal").statusChance).toBeCloseTo(weapon.statusChance * 1.9, 8);
  });

  it("Dizzying Rounds R3: +200% status chance", () => {
    const weapon = requireWeapon("lex");
    expect(withMod("lex", "dizzying_rounds").statusChance).toBeCloseTo(
      weapon.statusChance * 3,
      8,
    );
  });

  it("Perpetual Agony R5: +90% status duration", () => {
    expect(withMod("lex", "perpetual_agony").statusDurationBonus).toBeCloseTo(0.9, 8);
  });

  it("Augur Seeker R5: +90% status duration", () => {
    expect(withMod("lex", "augur_seeker").statusDurationBonus).toBeCloseTo(0.9, 8);
  });
});

describe("shotgun/general leftovers (wiki max rank, Phase M12)", () => {
  it("Ravage R5: +60% crit damage", () => {
    const weapon = requireWeapon("strun");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    expect(withMod("strun", "ravage_r3").criticalMultiplier).toBeCloseTo(cmq * 1.6, 8);
  });

  it("Shotgun Barrage R5: +90% fire rate", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "shotgun_barrage").fireRate).toBeCloseTo(weapon.fireRate * 1.9, 8);
  });

  it("Tactical Pump R5: +60% reload speed", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "tactical_pump_r3").reloadTime).toBeCloseTo(weapon.reloadTime / 1.6, 8);
  });

  it("Tainted Shell R10: −55% fire rate", () => {
    const weapon = requireWeapon("strun");
    expect(withMod("strun", "tainted_shell_r10").fireRate).toBeCloseTo(weapon.fireRate * 0.45, 8);
  });

  it("Shredder R5 / Sweeping Serration R5: +90% / +120% slash", () => {
    const weapon = requireWeapon("strun");
    const shred = withMod("strun", "shredder");
    expect(shred.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9, shred.moddedBaseDamage / 32),
      8,
    );
    const sweep = withMod("strun", "sweeping_serration");
    expect(sweep.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 2.2, sweep.moddedBaseDamage / 32),
      8,
    );
  });
});

describe("gun leftovers (wiki max rank, Phase M13)", () => {
  it("Feathered Arrows R3: −20% damage", () => {
    const weapon = requireWeapon("paris");
    expect(withMod("paris", "feathered_arrows").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 0.8,
      5,
    );
  });

  it("Hydraulic Chamber R3: −10% magazine", () => {
    const weapon = requireWeapon("braton");
    expect(withMod("braton", "hydraulic_chamber").magazine).toBe(
      Math.round(weapon.magazine * 0.9),
    );
  });

  it("Toxic Sequence R3: +200% status duration", () => {
    expect(withMod("lex", "toxic_sequence").statusDurationBonus).toBeCloseTo(2, 8);
  });

  it("Soaring Truth R3: +200% crit chance", () => {
    const weapon = requireWeapon("lex");
    expect(withMod("lex", "soaring_truth").criticalChance).toBeCloseTo(
      weapon.criticalChance * 3,
      8,
    );
  });
});

describe("syndicate exclusive paper (wiki max rank, Phase Sim6)", () => {
  it("Scattered Justice / Gilded Truth / Deadly Sequence / Shattering Justice", () => {
    const strun = requireWeapon("strun");
    const braton = requireWeapon("braton");
    const lex = requireWeapon("lex");
    expect(withMod("strun", "scattered_justice").multishot).toBeCloseTo(strun.multishot * 3, 8);
    expect(withMod("braton", "gilded_truth").fireRate).toBeCloseTo(braton.fireRate * 1.8, 8);
    expect(withMod("lex", "deadly_sequence").criticalChance).toBeCloseTo(
      lex.criticalChance * 3,
      8,
    );
    expect(withMod("strun", "shattering_justice").statusChance).toBeCloseTo(
      strun.statusChance * 1.9,
      8,
    );
  });

  it("Eroding / Stockpiled Blight: +200% magazine", () => {
    const lex = requireWeapon("lex");
    expect(withMod("lex", "eroding_blight").magazine).toBe(Math.round(lex.magazine * 3));
    expect(withMod("lex", "stockpiled_blight").magazine).toBe(Math.round(lex.magazine * 3));
  });

  it("Photon Overcharge R5: +90% critical damage", () => {
    const weapon = requireWeapon("braton");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    expect(withMod("braton", "photon_overcharge").criticalMultiplier).toBeCloseTo(cmq * 1.9, 8);
  });

  it("syndicatePower lines stay panel-only", () => {
    for (const id of [
      "scattered_justice",
      "gilded_truth",
      "deadly_sequence",
      "shattering_justice",
      "eroding_blight",
      "stockpiled_blight",
      "toxic_sequence",
      "entropy_burst",
      "stinging_truth",
    ]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh?.stats.find((s) => s.statKey === "syndicatePower")?.target).toBe("mod_panel");
    }
  });
});

describe("final SC + flat magazine (wiki max rank, Phase Sim7)", () => {
  it("Entropy Burst: +20 Final SC after multiplicative mods", () => {
    const supra = requireWeapon("supra");
    expect(withMod("supra", "entropy_burst").statusChance).toBeCloseTo(
      supra.statusChance + 0.2,
      5,
    );
    const aptitude = requireMod("rifle_aptitude_r3");
    const both = calculateWeaponBuild(
      supra,
      [
        { modId: "rifle_aptitude_r3", rank: aptitude.maxRank, slotIndex: 0 },
        { modId: "entropy_burst", rank: requireMod("entropy_burst").maxRank, slotIndex: 1 },
      ],
      modsMap(),
    );
    expect(both.statusChance).toBeCloseTo(supra.statusChance * 1.9 + 0.2, 5);
  });

  it("Napalm Grenades: +30 Final SC only", () => {
    const penta = requireWeapon("penta");
    expect(withMod("penta", "napalm_grenades").statusChance).toBeCloseTo(
      penta.statusChance + 0.3,
      5,
    );
  });

  it("Stinging Truth: +40 flat magazine", () => {
    const viper = requireWeapon("viper");
    expect(withMod("viper", "stinging_truth").magazine).toBe(viper.magazine + 40);
  });
});

describe("gun leftovers continued (wiki max rank)", () => {
  it("Galvanized Diffusion / Hell R10 paper: +110% multishot at 0 stacks", () => {
    const lex = requireWeapon("lex");
    const strun = requireWeapon("strun");
    expect(withMod("lex", "galvanized_diffusion").multishot).toBeCloseTo(lex.multishot * 2.1, 8);
    expect(withMod("strun", "galvanized_hell").multishot).toBeCloseTo(strun.multishot * 2.1, 8);
  });
});

describe("gun leftovers (wiki max rank, Phase M14)", () => {
  it("Metamorphic Magazine R5: +90% magazine", () => {
    const weapon = requireWeapon("braton");
    expect(withMod("braton", "metamorphic_magazine").magazine).toBe(
      Math.round(weapon.magazine * 1.9),
    );
  });

  it("Thundermiter R3: −60% magazine", () => {
    const weapon = requireWeapon("braton");
    expect(withMod("braton", "thundermiter").magazine).toBe(Math.round(weapon.magazine * 0.4));
  });

  it("Draining Gloom R3: −60% magazine", () => {
    const weapon = requireWeapon("lex");
    expect(withMod("lex", "draining_gloom").magazine).toBe(Math.round(weapon.magazine * 0.4));
  });

  it("Semi-Rifle / Semi-Pistol / Semi-Shotgun Cannonade: +240% / +300% / +240% damage", () => {
    const braton = requireWeapon("braton");
    const lex = requireWeapon("lex");
    const strun = requireWeapon("strun");
    expect(withMod("braton", "semi_rifle_cannonade").moddedBaseDamage).toBeCloseTo(
      braton.damage * 3.4,
      5,
    );
    expect(withMod("lex", "semi_pistol_cannonade").moddedBaseDamage).toBeCloseTo(
      lex.damage * 4,
      5,
    );
    expect(withMod("strun", "semi_shotgun_cannonade").moddedBaseDamage).toBeCloseTo(
      strun.damage * 3.4,
      5,
    );
  });

  it("Galvanized Shot / Savvy R10 paper: +80% status chance at 0 stacks", () => {
    const lex = requireWeapon("lex");
    const braton = requireWeapon("braton");
    expect(withMod("lex", "galvanized_shot").statusChance).toBeCloseTo(
      lex.statusChance * 1.8,
      5,
    );
    expect(withMod("braton", "galvanized_savvy").statusChance).toBeCloseTo(
      braton.statusChance * 1.8,
      5,
    );
  });

  it("Harkonar Scope R5: +12s combo duration (base 5 → 17)", () => {
    expect(withMod("braton", "harkonar_scope").comboDuration).toBeCloseTo(17, 8);
  });
});

describe("gun leftovers (wiki max rank, Phase M15)", () => {
  it("Higasa Serration R5: +450% damage", () => {
    const weapon = requireWeapon("higasa");
    expect(withMod("higasa", "higasa_serration").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 5.5,
      5,
    );
  });

  it("Primed Chamber R3: +100% first-shot averaged over magazine in DPS", () => {
    const weapon = requireWeapon("braton");
    const bare = calculateWeaponBuild(weapon, [], modsMap());
    const modded = withMod("braton", "primed_chamber");
    expect(modded.totalDamage).toBeCloseTo(bare.totalDamage, 5);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1 + 1 / bare.magazine, 5);
  });

  it("Primed Charged Chamber R10: +110% first-shot averaged over magazine in DPS", () => {
    const weapon = requireWeapon("braton");
    const bare = calculateWeaponBuild(weapon, [], modsMap());
    const modded = withMod("braton", "primed_charged_chamber");
    expect(modded.totalDamage).toBeCloseTo(bare.totalDamage, 5);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1 + 1.1 / bare.magazine, 5);
  });

  it("Jet Stream: paper stays panel; Turbulence gate applies via external buffs", () => {
    const beh = VERIFIED_MOD_BEHAVIORS.jet_stream;
    expect(beh).toBeDefined();
    expect(beh!.stats.every((s) => s.target === "mod_panel")).toBe(true);
    expect(beh!.stats.map((s) => s.statKey).sort()).toEqual(["projectileSpeed", "sprintSpeed"]);
  });
});
