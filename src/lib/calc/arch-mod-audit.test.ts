/**
 * Phase M8 — archgun / archmelee always-on mod apply goldens.
 * Imperator (archgun) + Veritux (archmelee); each case wiki max-rank.
 */
import { describe, expect, it } from "vitest";
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

describe("archgun cores (wiki max rank, Phase M8)", () => {
  it("Rubedo-Lined Barrel R5 / Primed Rubedo R10: +100% / +187% damage", () => {
    const weapon = requireWeapon("imperator");
    // Catalog 16.6667%/rank leaves ~1e-4 residue vs exact wiki +100%
    expect(withMod("imperator", "rubedo_lined_barrel").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 2,
      3,
    );
    expect(withMod("imperator", "primed_rubedo_lined_barrel").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 2.87,
      3,
    );
  });

  it("Dual Rounds R5 / Primed Dual Rounds R10: +60% / +110% multishot", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "dual_rounds").multishot).toBeCloseTo(weapon.multishot * 1.6, 8);
    expect(withMod("imperator", "primed_dual_rounds").multishot).toBeCloseTo(
      weapon.multishot * 2.1,
      8,
    );
  });

  it("Automatic Trigger R5: +60% fire rate", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "automatic_trigger").fireRate).toBeCloseTo(
      weapon.fireRate * 1.6,
      8,
    );
  });

  it("Combustion Rounds R5 / Primed Combustion R10: +120% / +187% heat from base", () => {
    const weapon = requireWeapon("imperator");
    for (const [modId, pct] of [
      ["combustion_rounds", 1.2],
      ["primed_combustion_rounds", 1.87],
    ] as const) {
      const stats = withMod("imperator", modId);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * pct, scale),
        8,
      );
    }
  });

  it("Hollowed Bullets R3: +80% crit damage after CM quantize", () => {
    const weapon = requireWeapon("imperator");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    expect(withMod("imperator", "hollowed_bullets").criticalMultiplier).toBeCloseTo(
      cmq * 1.8,
      8,
    );
  });

  it("Parallax Scope R3: +100% crit chance", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "parallax_scope").criticalChance).toBeCloseTo(
      weapon.criticalChance * 2,
      8,
    );
  });

  it("Magazine Extension R5: +60% magazine", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "magazine_extension").magazine).toBe(
      Math.round(weapon.magazine * 1.6),
    );
  });

  it("Quick Reload R3: +100% reload speed", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "quick_reload").reloadTime).toBeCloseTo(
      weapon.reloadTime / 2,
      8,
    );
  });

  it("Venomous Clip R5 / Primed Venomous Clip: +120% / +187% toxin from base", () => {
    const weapon = requireWeapon("imperator");
    for (const [modId, pct] of [
      ["venomous_clip", 1.2],
      ["primed_venomous_clip", 1.87],
    ] as const) {
      const stats = withMod("imperator", modId);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === "toxin")?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * pct, scale),
        8,
      );
    }
  });

  it("Electrified Barrel / Polar Magazine R5: +120% electricity / cold from base", () => {
    const weapon = requireWeapon("imperator");
    for (const [modId, type] of [
      ["electrified_barrel", "electricity"],
      ["polar_magazine", "cold"],
    ] as const) {
      const stats = withMod("imperator", modId);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 1.2, scale),
        8,
      );
    }
  });

  it("Modified Munitions R5: +60% status chance", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "modified_munitions").statusChance).toBeCloseTo(
      weapon.statusChance * 1.6,
      8,
    );
  });

  it("Hypothermic Shell / Contamination Casing / Charged Bullets / Magma Chamber: 60/60", () => {
    const weapon = requireWeapon("imperator");
    for (const [modId, type] of [
      ["hypothermic_shell", "cold"],
      ["contamination_casing", "toxin"],
      ["charged_bullets", "electricity"],
      ["magma_chamber", "heat"],
    ] as const) {
      const stats = withMod("imperator", modId);
      expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.6, scale),
        8,
      );
    }
  });

  it("Sabot Rounds R5: +60% damage", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "sabot_rounds").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 1.6,
      8,
    );
  });

  it("Comet Blast / Quasar Drill / Zodiac Shred: +90% IPS", () => {
    const weapon = requireWeapon("imperator");
    const impact = withMod("imperator", "comet_blast");
    const puncture = withMod("imperator", "quasar_drill");
    const slash = withMod("imperator", "zodiac_shred");
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

  it("Containment Breach R3: +60% radiation from base, +30% multishot", () => {
    const weapon = requireWeapon("imperator");
    const stats = withMod("imperator", "containment_breach");
    expect(stats.multishot).toBeCloseTo(weapon.multishot * 1.3, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "radiation")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Magnetized Cycle R3: +60% magnetic from base, +30% fire rate", () => {
    const weapon = requireWeapon("imperator");
    const stats = withMod("imperator", "magnetized_cycle");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.3, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });
});

describe("archgun leftovers (wiki max rank, Phase M14)", () => {
  it("Shell Rush R3: +50% charge rate (fire rate)", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "shell_rush").fireRate).toBeCloseTo(weapon.fireRate * 1.5, 8);
  });
});

describe("archgun trigger conditionals (wiki max rank, Phase M16)", () => {
  it("Critical Focus: paper no CC/CD; applyTriggerBuffs → +60% CC and CD", () => {
    const weapon = requireWeapon("imperator");
    const bare = calculateWeaponBuild(weapon, [], modsMap());
    const paper = withMod("imperator", "critical_focus");
    expect(paper.criticalChance).toBeCloseTo(weapon.criticalChance, 5);
    expect(paper.criticalMultiplier).toBeCloseTo(bare.criticalMultiplier, 5);
    const active = withMod("imperator", "critical_focus", {
      ...DEFAULT_SIM_PARAMS,
      applyTriggerBuffs: true,
    });
    expect(active.criticalChance).toBeCloseTo(weapon.criticalChance * 1.6, 5);
    expect(active.criticalMultiplier).toBeCloseTo(bare.criticalMultiplier * 1.6, 4);
  });

  it("Marked Target: paper SC unchanged; applyTriggerBuffs → +120% SC", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "marked_target").statusChance).toBeCloseTo(
      weapon.statusChance,
      5,
    );
    expect(
      withMod("imperator", "marked_target", {
        ...DEFAULT_SIM_PARAMS,
        applyTriggerBuffs: true,
      }).statusChance,
    ).toBeCloseTo(weapon.statusChance * 2.2, 5);
  });
});

describe("archgun trigger conditionals (wiki max rank, Phase M17)", () => {
  it("Archgun Ace: paper FR/reload unchanged; kill → +50% FR, +100% reload", () => {
    const weapon = requireWeapon("imperator");
    const paper = withMod("imperator", "archgun_ace");
    expect(paper.fireRate).toBeCloseTo(weapon.fireRate, 5);
    expect(paper.reloadTime).toBeCloseTo(weapon.reloadTime, 5);
    const active = withMod("imperator", "archgun_ace", {
      ...DEFAULT_SIM_PARAMS,
      killStacks: 1,
    });
    expect(active.fireRate).toBeCloseTo(weapon.fireRate * 1.5, 4);
    expect(active.reloadTime).toBeCloseTo(weapon.reloadTime / 2, 4);
  });

  it("Deadly Efficiency / Primed: paper damage unchanged; trigger → +120% / +220%", () => {
    const weapon = requireWeapon("imperator");
    expect(withMod("imperator", "deadly_efficiency").moddedBaseDamage).toBeCloseTo(
      weapon.damage,
      5,
    );
    expect(
      withMod("imperator", "deadly_efficiency", {
        ...DEFAULT_SIM_PARAMS,
        applyTriggerBuffs: true,
      }).moddedBaseDamage,
    ).toBeCloseTo(weapon.damage * 2.2, 5);
    expect(withMod("imperator", "primed_deadly_efficiency").moddedBaseDamage).toBeCloseTo(
      weapon.damage,
      5,
    );
    expect(
      withMod("imperator", "primed_deadly_efficiency", {
        ...DEFAULT_SIM_PARAMS,
        applyTriggerBuffs: true,
      }).moddedBaseDamage,
    ).toBeCloseTo(weapon.damage * 3.2, 5);
  });
});

describe("archmelee cores (wiki max rank, Phase M8)", () => {
  it("Cutting Edge R10: +110% melee damage", () => {
    const weapon = requireWeapon("veritux");
    expect(withMod("veritux", "cutting_edge").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 2.1,
      8,
    );
  });

  it("Tempered Blade R5: +150% crit chance", () => {
    const weapon = requireWeapon("veritux");
    expect(withMod("veritux", "tempered_blade").criticalChance).toBeCloseTo(
      weapon.criticalChance * 2.5,
      8,
    );
  });

  it("Bleeding Edge R10: +110% crit damage after CM quantize", () => {
    const weapon = requireWeapon("veritux");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    expect(withMod("veritux", "bleeding_edge").criticalMultiplier).toBeCloseTo(cmq * 2.1, 8);
  });

  it("Furor R3: +10% attack speed", () => {
    const weapon = requireWeapon("veritux");
    expect(withMod("veritux", "furor").fireRate).toBeCloseTo(weapon.fireRate * 1.1, 8);
  });

  it("Blazing Steel / Glacial Edge / Poisonous Sting R5: +120% element from base", () => {
    const weapon = requireWeapon("veritux");
    for (const [modId, type] of [
      ["blazing_steel", "heat"],
      ["glacial_edge", "cold"],
      ["poisonous_sting", "toxin"],
    ] as const) {
      const stats = withMod("veritux", modId);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 1.2, scale),
        8,
      );
    }
  });

  it("Astral Slash / Meteor Crash / Nebula Bore: +90% IPS", () => {
    const weapon = requireWeapon("veritux");
    const slash = withMod("veritux", "astral_slash");
    const impact = withMod("veritux", "meteor_crash");
    const puncture = withMod("veritux", "nebula_bore");
    expect(slash.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9, slash.moddedBaseDamage / 32),
      8,
    );
    expect(impact.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 1.9, impact.moddedBaseDamage / 32),
      8,
    );
    expect(puncture.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.9, puncture.moddedBaseDamage / 32),
      8,
    );
  });

  it("Sudden Impact R5: +60% status chance", () => {
    const weapon = requireWeapon("veritux");
    expect(withMod("veritux", "sudden_impact").statusChance).toBeCloseTo(
      weapon.statusChance * 1.6,
      8,
    );
  });

  it("Infectious Injection / Ion Infusion / Searing Steel: 60/60", () => {
    const weapon = requireWeapon("veritux");
    for (const [modId, type] of [
      ["infectious_injection", "toxin"],
      ["ion_infusion", "electricity"],
      ["searing_steel", "heat"],
    ] as const) {
      const stats = withMod("veritux", modId);
      expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.6, scale),
        8,
      );
    }
  });
});
