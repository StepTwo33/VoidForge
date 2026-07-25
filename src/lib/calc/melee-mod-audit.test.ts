/**
 * Phase 2b — high-use melee mod apply goldens + biting_frost coverage.
 * Each case is wiki-checked for that mod ID (max rank).
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
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

function withMod(modId: string, sim = DEFAULT_SIM_PARAMS) {
  const weapon = requireWeapon("skana");
  const mod = requireMod(modId);
  return calculateWeaponBuild(
    weapon,
    [{ modId, rank: mod.maxRank, slotIndex: 0 }],
    modsMap(),
    undefined,
    sim,
  );
}

describe("melee damage / crit / status mods (wiki max rank)", () => {
  it("Pressure Point R5: +120% damage", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("pressure_point_r3");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.2, 8);
  });

  it("Primed Pressure Point R10: +165% damage", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("primed_pressure_point");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.65, 8);
  });

  it("True Steel R5: +120% crit chance", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("true_steel_r3");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 2.2, 8);
  });

  it("Organ Shatter R5: +90% crit damage after CM quantize", () => {
    const weapon = requireWeapon("skana");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("organ_shatter_r3");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.9, 8);
  });

  it("North Wind / Shocking Touch / Fever Strike: +90% elemental from base", () => {
    for (const [modId, type] of [
      ["north_wind_r3", "cold"],
      ["shocking_touch_r3", "electricity"],
      ["fever_strike_r3", "toxin"],
    ] as const) {
      const weapon = requireWeapon("skana");
      const stats = withMod(modId);
      const scale = stats.moddedBaseDamage / 32;
      const expected = quantizeDamageValue(weapon.damage * 0.9, scale);
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(expected, 8);
    }
  });

  it("Volcanic Edge R3: +60% heat and +60% status (manual override must keep heat)", () => {
    const weapon = requireWeapon("skana");
    const behavior = VERIFIED_MOD_BEHAVIORS.volcanic_edge;
    expect(behavior?.stats.some((s) => s.statKey === "heat" && s.target === "weapon_dps")).toBe(true);

    const stats = withMod("volcanic_edge");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
    const scale = stats.moddedBaseDamage / 32;
    const expectedHeat = quantizeDamageValue(weapon.damage * 0.6, scale);
    expect(stats.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(expectedHeat, 8);
  });

  it("Vicious Frost / Voltaic Strike / Virulent Scourge: 60/60 dual-stat", () => {
    for (const [modId, type] of [
      ["vicious_frost", "cold"],
      ["voltaic_strike", "electricity"],
      ["virulent_scourge", "toxin"],
    ] as const) {
      const weapon = requireWeapon("skana");
      const stats = withMod(modId);
      expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
      const scale = stats.moddedBaseDamage / 32;
      expect(stats.elements.find((e) => e.type === type)?.value).toBeCloseTo(
        quantizeDamageValue(weapon.damage * 0.6, scale),
        8,
      );
    }
  });
});

describe("melee remainder (wiki max rank, Phase M2)", () => {
  it("Primed Fever Strike R10: +165% toxin from base", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("primed_fever_strike");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "toxin")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 1.65, scale),
      8,
    );
  });

  it("Molten Impact R5: +90% heat from base", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("molten_impact_r3");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.9, scale),
      8,
    );
  });

  it("Primed Fury R10: +55% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("primed_fury");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.55, 8);
  });

  it("Primed Reach R10: catalog +3 range (panel / arsenal; not paper DPS)", () => {
    const mod = requireMod("primed_reach");
    expect(mod.stats.range! * (mod.maxRank + 1)).toBeCloseTo(3, 5);
    expect(VERIFIED_MOD_BEHAVIORS.primed_reach?.stats.every((s) => s.target === "mod_panel")).toBe(
      true,
    );
  });

  it("Berserker Fury R5: +35% AS per kill stack (cap 2) via killStacks", () => {
    const weapon = requireWeapon("skana");
    const bare = withMod("berserker_fury", { ...DEFAULT_SIM_PARAMS, killStacks: 0 });
    expect(bare.fireRate).toBeCloseTo(weapon.fireRate, 8);

    const stacked = withMod("berserker_fury", { ...DEFAULT_SIM_PARAMS, killStacks: 2 });
    expect(stacked.fireRate).toBeCloseTo(weapon.fireRate * 1.7, 5);
  });

  it("Sacrificial Steel R10: +220% crit chance", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("sacrificial_steel");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * 3.2, 8);
  });

  it("Sacrificial Pressure R10: +110% damage", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("sacrificial_pressure");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2.1, 8);
  });

  it("Primed Smite Grineer: ×1.55 paper DPS when targetFaction=grineer", () => {
    const bare = calculateWeaponBuild(requireWeapon("skana"), [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "grineer",
    });
    const modded = withMod("primed_smite_grineer", {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "grineer",
    });
    expect(modded.factionBonuses?.grineer).toBeCloseTo(0.55, 8);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1.55, 8);
  });
});

describe("melee cores (wiki max rank, Phase M5)", () => {
  it("Fury R5: +30% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("fury_r3");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.3, 8);
  });

  it("Quickening R3: +40% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("quickening_r3");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.4, 8);
  });

  it("Gladiator Might R5: +60% crit damage", () => {
    const weapon = requireWeapon("skana");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("gladiator_might");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.6, 8);
  });

  it("Gladiator Vice R5: +30% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("gladiator_vice");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.3, 8);
  });

  it("Melee Prowess R5: +90% status chance", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("melee_prowess");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.9, 8);
  });

  it("Killing Blow: heavy-attack damage is panel-only (no light paper DPS)", () => {
    const weapon = requireWeapon("skana");
    const beh = VERIFIED_MOD_BEHAVIORS.killing_blow;
    expect(beh?.stats.find((s) => s.statKey === "damage")?.target).toBe("mod_panel");
    expect(beh?.stats.find((s) => s.statKey === "heavyAttackDamage")?.target).toBe("mod_panel");
    const stats = withMod("killing_blow");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage, 8);
  });

  it("Amalgam Organ Shatter R5: +85% crit damage", () => {
    const weapon = requireWeapon("skana");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const stats = withMod("amalgam_organ_shatter");
    expect(stats.criticalMultiplier).toBeCloseTo(cmq * 1.85, 4);
  });

  it("Buzz Kill / Auger Strike / Collision Force: +120% Slash/Puncture/Impact", () => {
    const weapon = requireWeapon("skana");
    const slash = withMod("buzz_kill");
    const puncture = withMod("auger_strike");
    const impact = withMod("collision_force");
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

  it("Heavy Trauma / Primed Heavy Trauma: +90% / +165% Impact", () => {
    const weapon = requireWeapon("skana");
    const ht = withMod("heavy_trauma");
    const pht = withMod("primed_heavy_trauma");
    expect(ht.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 1.9, ht.moddedBaseDamage / 32),
      8,
    );
    expect(pht.impact).toBeCloseTo(
      quantizeDamageValue(weapon.impact * 2.65, pht.moddedBaseDamage / 32),
      8,
    );
  });

  it("Focus Energy R3: +60% electricity from base, +40% heavy attack efficiency", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("focus_energy_r3");
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "electricity")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
    expect(stats.heavyAttackEfficiency).toBeCloseTo(0.4, 8);
  });

  it("Drifting Contact R3: +40% status chance; +10s combo duration", () => {
    const weapon = requireWeapon("skana");
    const mod = requireMod("drifting_contact_r3");
    expect(mod.stats.comboDuration! * (mod.maxRank + 1)).toBeCloseTo(10, 8);
    const stats = withMod("drifting_contact_r3");
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.4, 8);
    expect(stats.comboDuration).toBeCloseTo(5 + 10, 8);
  });
});

describe("melee cores (wiki max rank, Phase M6)", () => {
  it("Spoiled Strike R3: +100% damage, −20% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("spoiled_strike_r3");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 2, 8);
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 0.8, 8);
  });

  it("Jagged Edge R5: +90% slash", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("jagged_edge");
    expect(stats.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9, stats.moddedBaseDamage / 32),
      8,
    );
  });

  it("Sundering Strike R5: +90% puncture", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("sundering_strike");
    expect(stats.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.9, stats.moddedBaseDamage / 32),
      8,
    );
  });

  it("Rending Strike R3: +60% slash, +80% puncture", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("rending_strike");
    expect(stats.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.6, stats.moddedBaseDamage / 32),
      8,
    );
    expect(stats.puncture).toBeCloseTo(
      quantizeDamageValue(weapon.puncture * 1.8, stats.moddedBaseDamage / 32),
      8,
    );
  });

  it("Carnis Mandible / Jugulus Barbs / Saxum Thorax: 90 IPS / 60 status", () => {
    const weapon = requireWeapon("skana");
    const slash = withMod("carnis_mandible");
    const puncture = withMod("jugulus_barbs");
    const impact = withMod("saxum_thorax");
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

  it("Primed Smite Corpus: ×1.55 paper DPS when targetFaction=corpus", () => {
    const bare = calculateWeaponBuild(requireWeapon("skana"), [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "corpus",
    });
    const modded = withMod("primed_smite_corpus", {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "corpus",
    });
    expect(modded.factionBonuses?.corpus).toBeCloseTo(0.55, 8);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1.55, 8);
  });
});

describe("melee cores (wiki max rank, Phase M7)", () => {
  it("Magnetic Rush R3: +60% magnetic from base, +20% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("magnetic_rush");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.2, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "magnetic")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Martial Fury R3: +20% attack speed", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("martial_fury");
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate * 1.2, 8);
  });

  it("Primed Smite Infested: ×1.55 paper DPS when targetFaction=infested", () => {
    const bare = calculateWeaponBuild(requireWeapon("skana"), [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "infested",
    });
    const modded = withMod("primed_smite_infested", {
      ...DEFAULT_SIM_PARAMS,
      targetFaction: "infested",
    });
    expect(modded.factionBonuses?.infested).toBeCloseTo(0.55, 8);
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1.55, 8);
  });

  it("Maiming Strike: slide crit is panel-only (no standing paper CC)", () => {
    const weapon = requireWeapon("skana");
    const beh = VERIFIED_MOD_BEHAVIORS.maiming_strike;
    expect(beh?.stats.every((s) => s.target === "mod_panel")).toBe(true);
    const stats = withMod("maiming_strike");
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance, 8);
  });
});

describe("melee utility cores (wiki max rank, Phase M9)", () => {
  it("Lasting Sting R10: +110% status duration", () => {
    expect(withMod("lasting_sting").statusDurationBonus).toBeCloseTo(1.1, 8);
  });

  it("Reflex Coil R5: +60% heavy attack efficiency", () => {
    expect(withMod("reflex_coil_r3").heavyAttackEfficiency).toBeCloseTo(0.6, 8);
  });

  it("Focus Radon R3: +60% radiation from base, +40% heavy attack efficiency", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("focus_radon");
    expect(stats.heavyAttackEfficiency).toBeCloseTo(0.4, 8);
    const scale = stats.moddedBaseDamage / 32;
    expect(stats.elements.find((e) => e.type === "radiation")?.value).toBeCloseTo(
      quantizeDamageValue(weapon.damage * 0.6, scale),
      8,
    );
  });

  it("Body Count R5: +12s combo duration (base 5 → 17)", () => {
    expect(withMod("body_count").comboDuration).toBeCloseTo(17, 8);
  });

  it("Gladiator Rush R5: +9s combo duration (base 5 → 14)", () => {
    expect(withMod("gladiator_rush").comboDuration).toBeCloseTo(14, 8);
  });

  it("Combo Killer R5: +5s combo duration (base 5 → ~10; catalog 0.83×6)", () => {
    expect(withMod("combo_killer").comboDuration).toBeCloseTo(5 + 0.83 * 6, 5);
  });

  it("True Punishment: −50% combo duration is panel-only (standing timer unchanged)", () => {
    const beh = VERIFIED_MOD_BEHAVIORS.true_punishment;
    expect(beh?.stats.find((s) => s.statKey === "comboDuration")?.target).toBe("mod_panel");
    expect(withMod("true_punishment").comboDuration).toBeCloseTo(5, 8);
  });
});

describe("contempt + charge cores (wiki max rank, Phase M10)", () => {
  it("Amar's Contempt R5: +90% damage, +30% slash (stacks on modded IPS)", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("amars_contempt");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.9, 8);
    expect(stats.slash).toBeCloseTo(
      quantizeDamageValue(weapon.slash * 1.9 * 1.3, stats.moddedBaseDamage / 32),
      8,
    );
  });

  it("Boreal's Contempt R5: +90% damage, +60% status damage", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("boreals_contempt");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.9, 8);
    expect(stats.statusDamageBonus).toBeCloseTo(0.6, 8);
  });

  it("Nira's Contempt R5: +90% damage, +60% status chance", () => {
    const weapon = requireWeapon("skana");
    const stats = withMod("niras_contempt");
    expect(stats.moddedBaseDamage).toBeCloseTo(weapon.damage * 1.9, 8);
    expect(stats.statusChance).toBeCloseTo(weapon.statusChance * 1.6, 8);
  });

  it("Corrupt Charge R3: −40% attack speed (initial combo panel-only)", () => {
    const weapon = requireWeapon("skana");
    expect(withMod("corrupt_charge").fireRate).toBeCloseTo(weapon.fireRate * 0.6, 5);
  });
});

describe("melee leftovers (wiki max rank, Phase M13)", () => {
  it("Impenetrable Offense R3: −10% melee damage", () => {
    const weapon = requireWeapon("skana");
    expect(withMod("impenetrable_offense").moddedBaseDamage).toBeCloseTo(
      weapon.damage * 0.9,
      5,
    );
  });

  it("Finishing Touch / Seismic Wave / Covert Lethality / IPS converts: panel-only", () => {
    for (const id of [
      "finishing_touch_r10",
      "seismic_wave",
      "covert_lethality",
      "counterweight",
      "serrated_edges",
      "sharpened_blade",
    ]) {
      const beh = VERIFIED_MOD_BEHAVIORS[id];
      expect(beh, id).toBeDefined();
      expect(
        beh!.stats.every((s) => s.target === "mod_panel"),
        id,
      ).toBe(true);
    }
  });
});

describe("melee leftovers (wiki max rank, Phase M14)", () => {
  it("Galvanized Reflex R10 paper: +50% heavy attack efficiency", () => {
    expect(withMod("galvanized_reflex").heavyAttackEfficiency).toBeCloseTo(0.5, 5);
  });
});

describe("syndicate melee exclusive paper (wiki max rank, Phase Sim6)", () => {
  it("Blade Of Truth / Bright Purity / Justice Blades: +100% melee damage", () => {
    const weapon = requireWeapon("skana");
    for (const id of ["blade_of_truth", "bright_purity", "justice_blades"]) {
      expect(withMod(id).moddedBaseDamage, id).toBeCloseTo(weapon.damage * 2, 8);
    }
  });

  it("Toxic Blight: +100% toxin from base", () => {
    const weapon = requireWeapon("skana");
    expect(withMod("toxic_blight").elements.find((e) => e.type === "toxin")?.value).toBeCloseTo(
      weapon.damage * 1,
      8,
    );
  });

  it("Gleaming Blight: +100% status chance (damageBonus stays panel)", () => {
    const weapon = requireWeapon("skana");
    const beh = VERIFIED_MOD_BEHAVIORS.stance_gleaming_talent;
    expect(beh?.stats.find((s) => s.statKey === "damageBonus")?.target).toBe("mod_panel");
    expect(withMod("stance_gleaming_talent").statusChance).toBeCloseTo(
      weapon.statusChance * 2,
      8,
    );
    expect(withMod("stance_gleaming_talent").moddedBaseDamage).toBeCloseTo(weapon.damage, 8);
  });
});

describe("melee trigger conditionals (wiki max rank, Phase M17/Sim1)", () => {
  it("Proton Snap: paper SC/toxin unchanged; trigger → +50% SC and +100% toxin", () => {
    const weapon = requireWeapon("skana");
    const beh = VERIFIED_MOD_BEHAVIORS.proton_snap;
    expect(beh?.stats.find((s) => s.statKey === "damage")?.mode).toBe(
      "conditional_stat_on_trigger",
    );
    expect(withMod("proton_snap").statusChance).toBeCloseTo(weapon.statusChance, 5);
    expect(withMod("proton_snap").moddedBaseDamage).toBeCloseTo(weapon.damage, 5);
    expect(withMod("proton_snap").elements.find((e) => e.type === "toxin")).toBeUndefined();
    const active = withMod("proton_snap", {
      ...DEFAULT_SIM_PARAMS,
      applyTriggerBuffs: true,
    });
    expect(active.statusChance).toBeCloseTo(weapon.statusChance * 1.5, 5);
    expect(active.moddedBaseDamage).toBeCloseTo(weapon.damage, 5);
    expect(active.elements.find((e) => e.type === "toxin")?.value).toBeCloseTo(
      weapon.damage * 1.0,
      5,
    );
  });
});

describe("biting_frost coverage (wiki Passive Augment)", () => {
  it("catalog matches wiki max rank table (+200% CC/CD, R3)", () => {
    const mod = requireMod("biting_frost");
    expect(mod.maxRank).toBe(3);
    expect(mod.warframeId).toBe("frost");
    expect(mod.stats.criticalChance! * (mod.maxRank + 1)).toBeCloseTo(200, 8);
    expect(mod.stats.criticalMultiplier! * (mod.maxRank + 1)).toBeCloseTo(200, 8);
  });

  it("has per-item mod_panel behavior (conditional frozen — not paper DPS)", () => {
    const behavior = VERIFIED_MOD_BEHAVIORS.biting_frost;
    expect(behavior).toBeDefined();
    expect(behavior!.stats.map((s) => s.statKey).sort()).toEqual([
      "criticalChance",
      "criticalMultiplier",
    ]);
    expect(behavior!.stats.every((s) => s.target === "mod_panel")).toBe(true);
  });

  it("push_&_pull remains registered (quoted id with &)", () => {
    expect(VERIFIED_MOD_BEHAVIORS["push_&_pull"]).toBeDefined();
  });
});
