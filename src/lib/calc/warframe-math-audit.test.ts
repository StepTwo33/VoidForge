/**
 * Regression tests for Warframe wiki formulas audited 2026-07-12.
 * Sources: wiki.warframe.com Damage/Calculation, Status Effect, Armor, Calculating Bonuses.
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWeapons } from "@/data/weapons";
import { calculateWeaponBuild, quantizeDamageValue } from "@/lib/calc/calculator";
import { avgCritMultiplier, quantizeBaseCritMultiplier } from "@/lib/calc/crit-utils";
import {
  averageProcsPerShot,
  corrosiveArmorRemaining,
  enemyArmorDamageReduction,
  scaleArmor,
  scaleHealth,
  scaleShield,
} from "@/lib/calc/ttk";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

describe("crit averaging (wiki Damage/Calculation)", () => {
  it("matches 1 + CC×(CM−1) for sub-100% crit", () => {
    expect(avgCritMultiplier(0.25, 2)).toBeCloseTo(1.25, 10);
    expect(avgCritMultiplier(1, 2)).toBeCloseTo(2, 10);
  });

  it("matches 1 + CC×(CM−1) for orange/red tiers (equivalent closed form)", () => {
    // 250% CC, 3× CM → avg = 1 + 2.5×2 = 6
    expect(avgCritMultiplier(2.5, 3)).toBeCloseTo(1 + 2.5 * (3 - 1), 10);
    expect(avgCritMultiplier(2.5, 3)).toBeCloseTo(6, 10);
  });
});

describe("base crit multiplier quantization (wiki Critical Hit)", () => {
  it("matches wiki Critical Parallel example: (1.6+0.4) quantized × (1+1.2)", () => {
    const quantized = quantizeBaseCritMultiplier(1.6 + 0.4);
    expect(quantized).toBeCloseTo((256 * 32) / 4095, 10);
    expect(quantized * (1 + 1.2)).toBeCloseTo(4.401074481, 6);
  });

  it("quantizes weapon base CM before crit-damage mods in calculateWeaponBuild", () => {
    const weapon = allWeapons.find((w) => Math.abs(w.criticalMultiplier - 1.6) < 0.001);
    if (!weapon) return;
    const bare = calculateWeaponBuild(weapon, [], modsMap());
    expect(bare.criticalMultiplier).toBeCloseTo(quantizeBaseCritMultiplier(1.6), 6);
  });

  it("folds Critical Parallel into base before Vital Sense / Point Strike", () => {
    const braton = allWeapons.find((w) => w.id === "braton");
    const vital = allMods.find((m) => m.id === "vital_sense_r3");
    const pointStrike = allMods.find((m) => m.id === "point_strike_r3");
    if (!braton || !vital || !pointStrike) return;

    const withCm = calculateWeaponBuild(
      braton,
      [{ modId: vital.id, rank: vital.maxRank, slotIndex: 0 }],
      modsMap(),
      { criticalMultiplier: 0.4 },
    );
    expect(withCm.criticalMultiplier).toBeCloseTo(4.401074481, 6);

    const withCc = calculateWeaponBuild(
      braton,
      [{ modId: pointStrike.id, rank: pointStrike.maxRank, slotIndex: 0 }],
      modsMap(),
      { criticalChance: 0.16 },
    );
    // (0.12 + 0.16) × (1 + 1.5) — not 0.12×2.5 + 0.16
    expect(withCc.criticalChance).toBeCloseTo(0.7, 6);
  });
});

describe("damage quantization (wiki Damage/Calculation)", () => {
  it("matches wiki 100-damage IPS example", () => {
    const scale = 100 / 32;
    expect(quantizeDamageValue(30, scale)).toBeCloseTo(31.25, 10);
    expect(quantizeDamageValue(40, scale)).toBeCloseTo(40.625, 10);
  });
});

describe("elemental combo order (wiki: mods first, innate last)", () => {
  it("combines mod elements before innate electricity (Tenet Quanta / Amprex-style)", () => {
    // Tenet Quanta has electricity:18 in data. Heat + Cold mods → Blast + Electricity.
    // (Amprex is pure electricity in-game but currently lacks the electricity field in data.)
    const weapon = allWeapons.find((w) => w.id === "tenet_quanta");
    const hellfire = allMods.find(
      (m) => m.id === "hellfire" || m.id === "hellfire_r3" || (m.stats.heat != null && (m.category === "rifle" || m.category === "primary")),
    );
    const cryo = allMods.find(
      (m) => m.id === "cryo_rounds" || m.id === "cryo_rounds_r3" || (m.stats.cold != null && (m.category === "rifle" || m.category === "primary")),
    );
    if (!weapon || !hellfire || !cryo) return;
    expect(weapon.electricity).toBeGreaterThan(0);

    const stats = calculateWeaponBuild(
      weapon,
      [
        { modId: hellfire.id, rank: hellfire.maxRank, slotIndex: 0 },
        { modId: cryo.id, rank: cryo.maxRank, slotIndex: 1 },
      ],
      modsMap(),
    );

    const types = stats.elements.map((e) => e.type).sort();
    expect(types).toContain("blast");
    expect(types).toContain("electricity");
    expect(types).not.toContain("radiation");
    expect(types).not.toContain("cold");
    expect(types).not.toContain("heat");
  });

  it("merges duplicate combined types from separate mod pairs (Viral+Viral → one Viral)", () => {
    const lesion = allWeapons.find((w) => w.id === "lesion");
    const fever = allMods.find((m) => m.id === "fever_strike_r3" || m.id === "fever_strike");
    const north = allMods.find((m) => m.id === "north_wind_r3" || m.id === "north_wind");
    const virulent = allMods.find((m) => m.id === "virulent_scourge");
    const frost = allMods.find((m) => m.id === "vicious_frost");
    if (!lesion || !fever || !north || !virulent || !frost) return;

    const stats = calculateWeaponBuild(
      lesion,
      [
        { modId: fever.id, rank: fever.maxRank, slotIndex: 0 },
        { modId: north.id, rank: north.maxRank, slotIndex: 1 },
        { modId: virulent.id, rank: virulent.maxRank, slotIndex: 2 },
        { modId: frost.id, rank: frost.maxRank, slotIndex: 3 },
      ],
      modsMap(),
    );

    const viral = stats.elements.filter((e) => e.type === "viral");
    expect(viral).toHaveLength(1);
    expect(viral[0]!.value).toBeGreaterThan(0);
    expect(stats.elements.filter((e) => e.type === "toxin" || e.type === "cold")).toHaveLength(0);
  });

  it("preserves residual base damage when IPS/element fields are missing", () => {
    // Amprex-like: total damage set, IPS zero, no electricity field
    const amprex = allWeapons.find((w) => w.id === "amprex");
    if (!amprex) return;
    const stats = calculateWeaponBuild(amprex, [], modsMap());
    expect(stats.totalDamage).toBeCloseTo(amprex.damage, 5);
  });
});

describe("multishot (wiki Calculating Bonuses)", () => {
  it("is base × (1 + multishot bonus)", () => {
    const strun = allWeapons.find((w) => w.id === "strun");
    const hells = allMods.find((m) => m.id === "hells_chamber");
    if (!strun || !hells) return;
    const stats = calculateWeaponBuild(
      strun,
      [{ modId: hells.id, rank: hells.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    expect(stats.multishot).toBeCloseTo(strun.multishot * (1 + 1.2), 5);
  });
});

describe("average procs per shot (wiki Status Effect § Multishot)", () => {
  it("equals multishot × status chance (not at-least-one)", () => {
    expect(averageProcsPerShot(0.5, 2)).toBeCloseTo(1, 10);
    // At-least-one would be 0.75 — we must NOT use that for DoT rates
    expect(1 - Math.pow(1 - 0.5, 2)).toBeCloseTo(0.75, 10);
    expect(averageProcsPerShot(1, 2)).toBeCloseTo(2, 10);
    expect(averageProcsPerShot(1.5, 2)).toBeCloseTo(3, 10);
  });
});

describe("enemy armor DR (wiki Armor § Enemy)", () => {
  it("uses 0.9 × AR / 2700, not Tenno AR/(AR+300)", () => {
    expect(enemyArmorDamageReduction(300)).toBeCloseTo(0.1, 10);
    expect(enemyArmorDamageReduction(2700)).toBeCloseTo(0.9, 10);
    expect(enemyArmorDamageReduction(0)).toBe(0);
    // Classic Tenno formula would give 50% at 300 armor — must differ
    expect(300 / (300 + 300)).toBeCloseTo(0.5, 10);
  });
});

describe("corrosive armor strip (wiki Status Effect)", () => {
  it("is −26% then −6% additive of original, max −80%", () => {
    expect(corrosiveArmorRemaining(0)).toBeCloseTo(1, 10);
    expect(corrosiveArmorRemaining(1)).toBeCloseTo(0.74, 10);
    expect(corrosiveArmorRemaining(2)).toBeCloseTo(0.68, 10);
    expect(corrosiveArmorRemaining(10)).toBeCloseTo(0.2, 10);
    // Multiplicative 0.74^10 ≈ 0.049 would be wrong (~95% strip)
    expect(Math.pow(0.74, 10)).toBeLessThan(0.1);
  });
});

describe("status DoT tick fractions (wiki Damage/Calculation)", () => {
  it("slash uses 0.35 × modded base × avg crit (no type mult)", () => {
    const weapon = allWeapons.find((w) => w.slash > 0 && w.category !== "melee" && w.criticalChance === 0);
    // Prefer a known zero-crit or low-crit primary
    const braton = allWeapons.find((w) => w.id === "braton" || w.name === "Braton");
    const target = weapon ?? braton;
    if (!target) return;

    const stats = calculateWeaponBuild(target, [], modsMap(), undefined, {
      ...DEFAULT_SIM_PARAMS,
    });
    const slashProc = stats.statusProcs.find((p) => p.type === "slash");
    if (!slashProc || stats.moddedBaseDamage == null) return;

    const avgCrit = avgCritMultiplier(stats.criticalChance, stats.criticalMultiplier);
    expect(slashProc.damagePerTick).toBeCloseTo(stats.moddedBaseDamage * 0.35 * avgCrit, 2);
    expect(slashProc.ticks).toBe(7);
  });
});

describe("Acuity mods (wiki: weak point damage/crit, multishot locked)", () => {
  it("locks multishot against mod bonuses and gates crit/damage on headshots", () => {
    const weapon = allWeapons.find((w) => w.id === "braton_prime" || w.name === "Braton Prime");
    const acuity = allMods.find((m) => m.id === "primary_acuity");
    const multishotMod = allMods.find((m) => m.id === "split_chamber_r3" || m.stats.multishot != null && m.category === "rifle");
    if (!weapon || !acuity || !multishotMod) return;

    const simHead = { ...DEFAULT_SIM_PARAMS, applyHeadshots: true };
    const stats = calculateWeaponBuild(
      weapon,
      [
        { modId: multishotMod.id, rank: multishotMod.maxRank, slotIndex: 0 },
        { modId: acuity.id, rank: acuity.maxRank, slotIndex: 1 },
      ],
      modsMap(),
      undefined,
      simHead,
    );
    // "Multishot cannot be modified" — Split Chamber has no effect
    expect(stats.multishot).toBeCloseTo(weapon.multishot, 5);
    expect(stats.multishotLocked).toBe(true);
    // +350% weak point crit chance, applied only when headshots are simulated
    expect(stats.criticalChance).toBeCloseTo(weapon.criticalChance * (1 + 3.5), 3);
    // +350% weak point damage routes to headshot damage bonus
    expect(stats.headshotDamageBonus).toBeCloseTo(3.5, 3);

    const noHead = calculateWeaponBuild(
      weapon,
      [{ modId: acuity.id, rank: acuity.maxRank, slotIndex: 0 }],
      modsMap(),
      undefined,
      DEFAULT_SIM_PARAMS,
    );
    expect(noHead.criticalChance).toBeCloseTo(weapon.criticalChance, 5);
  });
});

describe("status duration mods extend DoT ticks (wiki Status Effect)", () => {
  it("Continuous Misery (+100%) doubles slash duration: 12s / 13 ticks", () => {
    const weapon = allWeapons.find((w) => w.id === "braton_prime" || w.name === "Braton Prime");
    const misery = allMods.find((m) => m.id === "continuous_misery");
    if (!weapon || !misery) return;

    const base = calculateWeaponBuild(weapon, [], modsMap());
    const modded = calculateWeaponBuild(
      weapon,
      [{ modId: misery.id, rank: misery.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    const baseSlash = base.statusProcs.find((p) => p.type === "slash");
    const moddedSlash = modded.statusProcs.find((p) => p.type === "slash");
    if (!baseSlash || !moddedSlash) return;

    expect(baseSlash.duration).toBe(6);
    expect(baseSlash.ticks).toBe(7);
    expect(moddedSlash.duration).toBeCloseTo(12, 5);
    expect(moddedSlash.ticks).toBe(13);
    expect(moddedSlash.totalDamage).toBeCloseTo(baseSlash.totalDamage * (13 / 7), 3);
  });
});

describe("Charged Chamber first-shot bonus (wiki)", () => {
  it("leaves arsenal damage unchanged and averages +40% over the magazine in DPS", () => {
    const weapon = allWeapons.find((w) => w.id === "rubico_prime" || w.name === "Rubico Prime");
    const cc = allMods.find((m) => m.id === "charged_chamber");
    if (!weapon || !cc) return;

    const bare = calculateWeaponBuild(weapon, [], modsMap());
    const modded = calculateWeaponBuild(
      weapon,
      [{ modId: cc.id, rank: cc.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    // Conditional bonus must not inflate arsenal-style damage display
    expect(modded.totalDamage).toBeCloseTo(bare.totalDamage, 5);
    // DPS averages the first-shot bonus over the magazine
    expect(modded.burstDps / bare.burstDps).toBeCloseTo(1 + 0.4 / bare.magazine, 5);
  });
});

describe("Internal Bleeding forced Slash on Impact procs (wiki)", () => {
  it("adds a slash proc proportional to the impact proc chance", () => {
    const weapon = allWeapons.find((w) => w.id === "rubico_prime" || w.name === "Rubico Prime");
    const ib = allMods.find((m) => m.id === "internal_bleeding");
    if (!weapon || !ib) return;

    const stats = calculateWeaponBuild(
      weapon,
      [{ modId: ib.id, rank: ib.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    const impact = stats.statusProcs.find((p) => p.type === "impact");
    const forced = stats.statusProcs.find((p) => p.description.includes("Internal Bleeding"));
    if (!impact) return;
    expect(forced).toBeDefined();
    const rateMult = stats.fireRate < 2.5 ? 2 : 1;
    expect(forced!.chance).toBeCloseTo(impact.chance * Math.min(0.35 * rateMult, 1), 5);
  });
});

describe("Vigilante crit-tier enhance folded into DPS", () => {
  it("burst DPS uses crit chance + 0.05 per Vigilante mod", () => {
    const weapon = allWeapons.find((w) => w.id === "braton_prime" || w.name === "Braton Prime");
    const va = allMods.find((m) => m.id === "vigilante_armaments");
    if (!weapon || !va) return;

    const bare = calculateWeaponBuild(weapon, [], modsMap());
    const vig = calculateWeaponBuild(
      weapon,
      [{ modId: va.id, rank: va.maxRank, slotIndex: 0 }],
      modsMap(),
    );
    const expected =
      (vig.multishot / bare.multishot) *
      (avgCritMultiplier(vig.criticalChance + 0.05, vig.criticalMultiplier) /
        avgCritMultiplier(bare.criticalChance, bare.criticalMultiplier));
    expect(vig.burstDps / bare.burstDps).toBeCloseTo(expected, 5);
  });
});

describe("Cannonade mods lock fire rate (wiki: cannot be modified)", () => {
  it("nulls fire rate mods when a Cannonade mod is equipped", () => {
    const weapon = allWeapons.find((w) => w.id === "latron_prime" || w.name === "Latron Prime");
    const st = allMods.find((m) => m.id === "speed_trigger_r3" || m.id === "speed_trigger");
    const cannonade = allMods.find((m) => m.id === "semi_rifle_cannonade");
    if (!weapon || !st || !cannonade) return;

    const stats = calculateWeaponBuild(
      weapon,
      [
        { modId: st.id, rank: st.maxRank, slotIndex: 0 },
        { modId: cannonade.id, rank: cannonade.maxRank, slotIndex: 1 },
      ],
      modsMap(),
    );
    expect(stats.fireRate).toBeCloseTo(weapon.fireRate, 5);
    expect(stats.fireRateLocked).toBe(true);
    // Damage bonus still applies (+240%)
    expect(stats.totalDamage / weapon.damage).toBeCloseTo(3.4, 2);
  });
});

describe("Incarnon-form radials excluded until Incarnon is active", () => {
  it("does not add Incarnon Form AoE DPS on a bare build", () => {
    const weapon = allWeapons.find((w) => w.id === "braton_prime" || w.name === "Braton Prime");
    if (!weapon) return;
    const bare = calculateWeaponBuild(weapon, [], modsMap());
    expect(bare.radialBurstDps ?? 0).toBe(0);
    // Form-active flag (not merely any evolution numeric) enables Incarnon Form AoE
    const incarnon = calculateWeaponBuild(weapon, [], modsMap(), undefined, undefined, {
      incarnonFormActive: true,
    });
    expect(incarnon.radialBurstDps ?? 0).toBeGreaterThan(0);
  });
});

describe("Devouring Attrition (wiki: 50% chance +2000% on non-crit hits)", () => {
  it("boosts DPS by the average non-crit bonus", () => {
    const weapon = allWeapons.find((w) => w.id === "lex_prime" || w.id === "lex");
    if (!weapon) return;
    const base = calculateWeaponBuild(weapon, [], modsMap());
    const withPerk = calculateWeaponBuild(weapon, [], modsMap(), { devouringAttrition: 20 });
    // Expected: avgCrit gains (1 − cc) × 10
    const cc = base.criticalChance;
    const cm = base.criticalMultiplier;
    const avgCrit = 1 + cc * (cm - 1);
    const expectedFactor = (avgCrit + (1 - cc) * 10) / avgCrit;
    expect(withPerk.burstDps / base.burstDps).toBeCloseTo(expectedFactor, 2);
  });

  it("gives no bonus at 100%+ crit chance", () => {
    const weapon = allWeapons.find((w) => w.id === "lex_prime" || w.id === "lex");
    if (!weapon) return;
    const base = calculateWeaponBuild(weapon, [], modsMap(), { criticalChance: 1 });
    const withPerk = calculateWeaponBuild(weapon, [], modsMap(), {
      criticalChance: 1,
      devouringAttrition: 20,
    });
    expect(withPerk.burstDps).toBeCloseTo(base.burstDps, 6);
  });
});

describe("incarnon evolutions (wiki-parsed)", () => {
  it("flat base damage adds scale all damage proportionally", () => {
    const weapon = allWeapons.find((w) => w.id === "lex_prime" || w.id === "lex");
    if (!weapon) return;
    const base = calculateWeaponBuild(weapon, [], modsMap());
    const withPerk = calculateWeaponBuild(weapon, [], modsMap(), { flatBaseDamage: 60 });
    expect(withPerk.totalDamage / base.totalDamage).toBeCloseTo(1 + 60 / weapon.damage, 3);
  });

  it("genesis weapons use real wiki evolutions (no fabricated Devouring Attrition)", async () => {
    const { incarnonDataMap } = await import("@/data/incarnon");
    const braton = incarnonDataMap.get("braton_prime");
    expect(braton).toBeDefined();
    const names = braton!.evolutions.map((e) => e.name);
    expect(names).not.toContain("Devouring Attrition");
    expect(names).toContain("Critical Parallel");
    // Variant-specific values resolve for Braton Prime
    const cp = braton!.evolutions.find((e) => e.name === "Critical Parallel")!;
    expect(cp.variantStatChanges?.["braton_prime"]?.criticalChance).toBeCloseTo(0.18, 6);
  });

  it("native incarnons keep Devouring Attrition with correct model", async () => {
    const { incarnonDataMap } = await import("@/data/incarnon");
    const phenmor = incarnonDataMap.get("phenmor");
    const da = phenmor!.evolutions.find((e) => e.name === "Devouring Attrition");
    expect(da?.statChanges.devouringAttrition).toBe(20);
  });
});

describe("radial DPS inference (wiki: launchers, alt-fires, glaives)", () => {
  it("glaive charged-throw explosions are manual — not in melee DPS", () => {
    const weapon = allWeapons.find((w) => w.id === "glaive_prime");
    if (!weapon) return;
    const stats = calculateWeaponBuild(weapon, [], modsMap());
    expect(stats.radialBurstDps ?? 0).toBe(0);
  });

  it("alt-fire explosions (Corinth Air Burst) are excluded from auto DPS", () => {
    const weapon = allWeapons.find((w) => w.id === "corinth_prime");
    if (!weapon) return;
    const stats = calculateWeaponBuild(weapon, [], modsMap());
    const airBurst = (stats.radialAttacks ?? []).find((a) => /air burst/i.test(a.name));
    expect(airBurst?.burstDps ?? 0).toBe(0);
  });

  it("launcher direct-hit paper + radial explosion (Kuva Bramma, B17)", () => {
    const weapon = allWeapons.find((w) => w.id === "kuva_bramma");
    if (!weapon) return;
    expect(weapon.damage).toBeCloseTo(187, 4);
    expect(weapon.impact).toBeCloseTo(187, 4);
    const stats = calculateWeaponBuild(weapon, [], modsMap());
    const main = (stats.radialAttacks ?? []).find((a) => a.name === "Radial Attack");
    expect(main?.includedInDirect).toBe(false);
    expect(main?.burstDps ?? 0).toBeGreaterThan(0);
    // Cluster bombs are extra damage on top and still counted.
    const cluster = (stats.radialAttacks ?? []).find((a) => /cluster/i.test(a.name));
    expect(cluster?.burstDps ?? 0).toBeGreaterThan(0);
  });

  it("innate per-shot explosions still contribute (Zakti gas cloud)", () => {
    const weapon = allWeapons.find((w) => w.id === "zakti_prime");
    if (!weapon) return;
    const stats = calculateWeaponBuild(weapon, [], modsMap());
    expect(stats.radialBurstDps ?? 0).toBeGreaterThan(0);
  });
});

describe("archgun Gravimag modes (wiki: Archwing vs Atmosphere)", () => {
  it("base archgun stats are the Archwing (space) profile (Imperator)", () => {
    const imperator = allWeapons.find((w) => w.id === "imperator")!;
    expect(imperator.damage).toBe(50);
    expect(imperator.fireRate).toBeCloseTo(16.7, 5);
    expect(imperator.magazine).toBe(200);
  });

  it("applyGravimagMode swaps to atmosphere stats (Imperator: 2× damage, 2s reload)", async () => {
    const { applyGravimagMode, weaponHasGravimagMode } = await import("@/lib/weapons/weapon-gravimag");
    const imperator = allWeapons.find((w) => w.id === "imperator")!;
    expect(weaponHasGravimagMode(imperator)).toBe(true);
    const atmos = applyGravimagMode(imperator);
    expect(atmos.damage).toBe(100);
    expect(atmos.impact).toBe(40);
    expect(atmos.reloadTime).toBe(2);
    // Unchanged fields carry over
    expect(atmos.fireRate).toBeCloseTo(16.7, 5);
    const stats = calculateWeaponBuild(atmos, [], modsMap());
    expect(stats.totalDamage).toBeCloseTo(100, 5);
  });

  it("Corvas atmosphere mode becomes an 11-pellet shotgun without heat", async () => {
    const { applyGravimagMode } = await import("@/lib/weapons/weapon-gravimag");
    const corvas = allWeapons.find((w) => w.id === "corvas")!;
    expect(corvas.heat).toBe(480);
    const atmos = applyGravimagMode(corvas);
    expect(atmos.heat).toBe(0);
    expect(atmos.multishot).toBe(11);
    expect(atmos.damage).toBe(160);
  });

  it("atmosphere radial attacks replace Archwing ones (Kuva Ayanga 187 → 280)", async () => {
    const { applyGravimagMode } = await import("@/lib/weapons/weapon-gravimag");
    const { getWeaponRadialAttacks } = await import("@/lib/weapons/weapon-radial-utils");
    const ayanga = allWeapons.find((w) => w.id === "kuva_ayanga")!;
    expect(getWeaponRadialAttacks(ayanga)[0]?.totalDamage).toBeCloseTo(187, 5);
    const atmos = applyGravimagMode(ayanga);
    expect(getWeaponRadialAttacks(atmos)[0]?.totalDamage).toBeCloseTo(280, 5);
  });

  it("weapons without a distinct atmosphere profile have no gravimag mode", async () => {
    const { weaponHasGravimagMode } = await import("@/lib/weapons/weapon-gravimag");
    // Corvas Prime: identical stats in both modes on the wiki — no toggle.
    const corvasPrime = allWeapons.find((w) => w.id === "corvas_prime")!;
    expect(weaponHasGravimagMode(corvasPrime)).toBe(false);
    // Non-archguns never have one.
    const braton = allWeapons.find((w) => w.id === "braton_prime");
    if (braton) expect(weaponHasGravimagMode(braton)).toBe(false);
  });
});

describe("alternate weapon modes (Staticor charged / DSS Heavy Blade)", () => {
  it("Staticor default keeps uncharged explosion; charged overlay swaps radial only", async () => {
    const { applyAlternateMode, weaponHasAlternateMode } = await import(
      "@/lib/weapons/weapon-alternate-mode"
    );
    const { getWeaponRadialAttacks } = await import("@/lib/weapons/weapon-radial-utils");
    const w = allWeapons.find((x) => x.id === "staticor")!;
    expect(weaponHasAlternateMode(w)).toBe(true);
    expect(w.damage).toBe(44);
    expect(w.radiation).toBe(44);
    expect(getWeaponRadialAttacks(w)[0]?.totalDamage).toBeCloseTo(88, 5);
    expect(getWeaponRadialAttacks(w)[0]?.radius).toBeCloseTo(2.4, 5);
    const charged = applyAlternateMode(w);
    expect(charged.damage).toBe(44);
    expect(charged.ammoCost).toBe(5);
    expect(charged.chargeTime).toBe(1);
    expect(charged.chargeMode).toBe("standard");
    expect(charged.triggerType).toBe("Charge");
    expect(getWeaponRadialAttacks(charged)[0]?.name).toBe("Fully Charged Explosion");
    expect(getWeaponRadialAttacks(charged)[0]?.totalDamage).toBeCloseTo(106, 5);
    expect(getWeaponRadialAttacks(charged)[0]?.radius).toBeCloseTo(9.6, 5);
    expect(getWeaponRadialAttacks(charged)[0]?.falloffReduction).toBeCloseTo(0.9, 5);

    // Wiki: EFR = 1 / (CT + 1/FR) = 1 / (1 + 1/3.5)
    const chargedStats = calculateWeaponBuild(charged, [], modsMap());
    expect(chargedStats.ammoCost).toBe(5);
    expect(chargedStats.effectiveFireRate).toBeCloseTo(1 / (1 + 1 / 3.5000002), 4);
    // Mag 48 / 5 ammo = 9.6 shots before reload
    const efr = chargedStats.effectiveFireRate!;
    const magTime = 48 / (5 * efr);
    const cycle = magTime + 1.5;
    const expectedSustain = chargedStats.burstDps * (magTime / cycle);
    expect(chargedStats.sustainedDps).toBeCloseTo(expectedSustain, 2);
  });

  it("Dark Split-Sword default Dual Swords; Heavy Blade overlay swaps paper + stance + slams", async () => {
    const { applyAlternateMode, weaponHasAlternateMode } = await import(
      "@/lib/weapons/weapon-alternate-mode"
    );
    const { getWeaponRadialAttacks } = await import("@/lib/weapons/weapon-radial-utils");
    const w = allWeapons.find((x) => x.id === "dark_split_sword")!;
    expect(weaponHasAlternateMode(w)).toBe(true);
    expect(w.stanceType).toBe("dual_swords");
    expect(w.damage).toBe(116);
    expect(w.puncture).toBe(56);
    expect(w.slash).toBe(28);
    expect(w.radiation).toBe(32);
    expect(w.criticalChance).toBeCloseTo(0.25, 4);
    expect(w.fireRate).toBeCloseTo(1.17, 4);
    const dualSlams = getWeaponRadialAttacks(w);
    expect(dualSlams[0]?.totalDamage).toBeCloseTo(232, 5);
    expect(dualSlams[1]?.totalDamage).toBeCloseTo(462, 5);

    const heavy = applyAlternateMode(w);
    expect(heavy.stanceType).toBe("heavy_blade");
    expect(heavy.damage).toBe(230);
    expect(heavy.puncture).toBe(78);
    expect(heavy.slash).toBe(52);
    expect(heavy.radiation).toBe(100);
    expect(heavy.criticalChance).toBeCloseTo(0.15, 4);
    expect(heavy.criticalMultiplier).toBeCloseTo(2, 4);
    expect(heavy.statusChance).toBeCloseTo(0.25, 4);
    expect(heavy.fireRate).toBeCloseTo(0.917, 4);
    const heavySlams = getWeaponRadialAttacks(heavy);
    expect(heavySlams[0]?.totalDamage).toBeCloseTo(460, 5);
    expect(heavySlams[1]?.totalDamage).toBeCloseTo(690, 5);

    const stats = calculateWeaponBuild(heavy, [], modsMap());
    expect(stats.moddedBaseDamage).toBeCloseTo(230, 3);
  });
});

describe("Animal Instinct radar values (wiki: Animal Instinct stats)", () => {
  it.each([
    ["animal_instinct", 5, 30, 18],
    ["primed_animal_instinct", 10, 55, 33],
  ] as const)(
    "%s stores per-rank radar values without a bogus range stat",
    (modId, maxRank, expectedLootRadar, expectedEnemyRadar) => {
      const mod = allMods.find((candidate) => candidate.id === modId)!;

      expect(mod.maxRank).toBe(maxRank);
      expect(mod.stats.lootRadar * (maxRank + 1)).toBe(expectedLootRadar);
      expect(mod.stats.enemyRadar * (maxRank + 1)).toBe(expectedEnemyRadar);
      expect(mod.stats).not.toHaveProperty("range");
    },
  );
});

describe("enemy level scaling smoke checks", () => {
  it("caps armor at 2700", () => {
    expect(scaleArmor(500, 200)).toBeLessThanOrEqual(2700);
  });

  it("scales health and shields above level 1", () => {
    expect(scaleHealth(100, 50)).toBeGreaterThan(100);
    expect(scaleShield(100, 50)).toBeGreaterThan(100);
    expect(scaleHealth(100, 1)).toBe(100);
  });
});

describe("warframe Tenno armor EHP still uses AR/(AR+300)", () => {
  it("300 armor = 50% DR", () => {
    const armor = 300;
    const dr = armor / (armor + 300);
    expect(dr).toBeCloseTo(0.5, 10);
    expect(enemyArmorDamageReduction(300)).not.toBeCloseTo(dr, 1);
  });
});

/**
 * Bare-weapon paper DPS goldens (Phase 1 accuracy audit).
 * Locks wiki pipeline: CM quantize → avg crit → burst/sustained — no Galv/Incarnon.
 */
describe("bare weapon paper DPS goldens (Phase 1)", () => {
  function bare(id: string) {
    const weapon = allWeapons.find((w) => w.id === id);
    expect(weapon).toBeDefined();
    return { weapon: weapon!, stats: calculateWeaponBuild(weapon!, [], modsMap()) };
  }

  it("Braton: quantized IPS, CM, avg crit, burst and sustained DPS", () => {
    const { weapon, stats } = bare("braton");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const avgCrit = avgCritMultiplier(weapon.criticalChance, cmq);

    expect(stats.criticalMultiplier).toBeCloseTo(cmq, 10);
    expect(stats.criticalChance).toBeCloseTo(0.12, 10);
    expect(stats.moddedBaseDamage).toBeCloseTo(24, 10);
    // Wiki IPS quantize can raise displayed total above catalog base
    expect(stats.impact).toBeCloseTo(8.25, 10);
    expect(stats.puncture).toBeCloseTo(8.25, 10);
    expect(stats.slash).toBeCloseTo(8.25, 10);
    expect(stats.totalDamage).toBeCloseTo(24.75, 10);
    expect(stats.fireRate).toBeCloseTo(8.75, 10);
    expect(stats.multishot).toBeCloseTo(1, 10);

    const expectedBurst = stats.totalDamage * stats.multishot * stats.fireRate * avgCrit;
    expect(stats.burstDps).toBeCloseTo(expectedBurst, 8);

    const magTime = stats.magazine / stats.fireRate;
    const expectedSustained = expectedBurst * (magTime / (magTime + stats.reloadTime));
    expect(stats.sustainedDps).toBeCloseTo(expectedSustained, 8);
  });

  it("Lex: secondary semi-auto paper DPS cycle", () => {
    const { weapon, stats } = bare("lex");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const avgCrit = avgCritMultiplier(weapon.criticalChance, cmq);

    expect(stats.criticalMultiplier).toBeCloseTo(cmq, 10);
    expect(stats.moddedBaseDamage).toBeCloseTo(130, 10);
    expect(stats.totalDamage).toBeCloseTo(
      stats.impact + stats.puncture + stats.slash,
      8,
    );
    expect(stats.fireRate).toBeCloseTo(1.08, 10);

    const expectedBurst = stats.totalDamage * stats.fireRate * avgCrit;
    expect(stats.burstDps).toBeCloseTo(expectedBurst, 8);
    const magTime = stats.magazine / stats.fireRate;
    expect(stats.sustainedDps).toBeCloseTo(
      expectedBurst * (magTime / (magTime + stats.reloadTime)),
      8,
    );
  });

  it("Skana: melee burst equals sustained (no reload cycle)", () => {
    const { weapon, stats } = bare("skana");
    const cmq = quantizeBaseCritMultiplier(weapon.criticalMultiplier);
    const avgCrit = avgCritMultiplier(weapon.criticalChance, cmq);

    expect(stats.criticalMultiplier).toBeCloseTo(cmq, 10);
    expect(stats.moddedBaseDamage).toBeCloseTo(120, 10);
    expect(stats.magazine).toBe(0);
    expect(stats.burstDps).toBeCloseTo(
      stats.totalDamage * stats.fireRate * avgCrit,
      8,
    );
    expect(stats.sustainedDps).toBeCloseTo(stats.burstDps, 10);
  });

  it("Amprex: pure electricity innate is on the weapon row and in elements", () => {
    const { weapon, stats } = bare("amprex");
    expect(weapon.electricity).toBeGreaterThan(0);
    expect(stats.elements.map((e) => e.type)).toEqual(["electricity"]);
    expect(stats.elements[0]!.value).toBeCloseTo(weapon.electricity!, 5);
    expect(stats.impact + stats.puncture + stats.slash).toBe(0);
  });
});
