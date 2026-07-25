import { describe, expect, it } from "vitest";
import { calculateWeaponBuild } from "@/lib/calc/calculator";
import { computeDpsContributions } from "@/lib/calc/dps-contributions";
import {
  applyJetStreamWarframeMove,
  resolveWeaponExternalBuffs,
  weaponDamageBuffAbilities,
} from "@/lib/weapons/weapon-external-buffs";
import { allMods } from "@/data/mods";
import type { Ability, ModSlot, SimulationParams, WarframeCalculatedStats, Weapon } from "@/lib/types";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = new Map(allMods.map((m) => [m.id, m]));

const testRifle: Weapon = {
  id: "test_rifle",
  name: "Test Rifle",
  category: "rifle",
  damage: 100,
  impact: 100,
  puncture: 0,
  slash: 0,
  fireRate: 1,
  criticalChance: 0.25,
  criticalMultiplier: 2,
  statusChance: 0,
  magazine: 30,
  reloadTime: 2,
  multishot: 1,
  triggerType: "Auto",
  modSlots: 8,
  hasPrimaryArcaneSlot: true,
  hasSecondaryArcaneSlot: false,
  isIncarnon: false,
  hasRivenSlot: true,
};

const testMelee: Weapon = {
  ...testRifle,
  id: "test_melee",
  name: "Test Melee",
  category: "melee",
  triggerType: "Melee",
  fireRate: 1.2,
  hasPrimaryArcaneSlot: false,
};

const roarAbility: Ability = {
  name: "Roar",
  energyCost: 75,
  description: "Damage buff",
  damageBuff: 0.5,
};

const wfStats: WarframeCalculatedStats = {
  baseHealth: 100,
  baseShield: 100,
  baseArmor: 100,
  baseEnergy: 100,
  baseSprint: 1,
  healthBonus: 0,
  shieldBonus: 0,
  armorBonus: 0,
  energyBonus: 0,
  sprintSpeedBonus: 0,
  slideSpeedBonus: 0,
  flowBonus: 0,
  flatHealthBonus: 0,
  flatShieldBonus: 0,
  flatArmorBonus: 0,
  flatEnergyBonus: 0,
  abilityStrength: 1.3,
  abilityDuration: 1,
  abilityEfficiency: 1,
  abilityRange: 1,
  totalHealth: 100,
  totalShield: 100,
  totalArmor: 100,
  totalEnergy: 100,
  totalSprint: 1,
  effectiveHealth: 100,
  damageReduction: 0,
  castingSpeedBonus: 0,
  parkourVelocityBonus: 0,
  healthRegenPerSec: 0,
  elementalResistance: 0,
  primaryShardBonus: 0,
  secondaryShardBonus: 0,
  meleeCritDamageBonus: 0,
  healingBonus: 0,
  statusDurationBonus: 0,
  energyCostReduction: 0,
};

describe("resolveWeaponExternalBuffs", () => {
  it("applies Parasitic Link as Roar-style multiplicative weapon damage", () => {
    const serration = allMods.find((m) => m.id === "serration" || m.id === "serration_r3");
    if (!serration) return;
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Parasitic Link"],
    };
    // Wiki: 200% STR → +50% weapon damage; multiplicative with Serration.
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "nidus",
      warframeStats: { ...wfStats, abilityStrength: 2 },
      warframeAbilities: [
        { name: "Parasitic Link", energyCost: 25, description: "", damageBuff: 0.25 },
      ],
    }, sim);
    expect(buffs[0]!.damageMultBonus).toBeCloseTo(0.5, 5);
    expect(buffs[0]!.damageBonus).toBeUndefined();

    const slots = [{ modId: serration.id, rank: serration.maxRank, slotIndex: 0 }];
    const withBoth = calculateWeaponBuild(testRifle, slots, modsMap, undefined, sim, {
      externalBuffs: buffs,
    });
    const serBonus = (serration.stats.damage * (serration.maxRank + 1)) / 100;
    expect(withBoth.totalDamage).toBeCloseTo(100 * (1 + serBonus) * 1.5, 5);
  });

  it("uses Helminth Roar 30% base (not Rhino 50%)", () => {
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Roar"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "excalibur",
      warframeStats: wfStats,
      warframeAbilities: [{ name: "Roar", energyCost: 50, description: "", damageBuff: 0.3 }],
    }, sim);
    expect(buffs[0]!.damageMultBonus).toBeCloseTo(0.3 * 1.3, 5);
  });

  it("applies Shooting Gallery additively with Serration (not Roar mult)", () => {
    const serration = allMods.find((m) => m.id === "serration" || m.id === "serration_r3");
    if (!serration) return;
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Shooting Gallery"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "mesa",
      warframeStats: wfStats,
      warframeAbilities: [{ name: "Shooting Gallery", energyCost: 50, description: "", damageBuff: 0.25 }],
    }, sim);
    expect(buffs[0]!.damageBonus).toBeCloseTo(0.25 * 1.3, 5);
    expect(buffs[0]!.damageMultBonus).toBeUndefined();

    const slots = [{ modId: serration.id, rank: serration.maxRank, slotIndex: 0 }];
    const withBoth = calculateWeaponBuild(testRifle, slots, modsMap, undefined, sim, {
      externalBuffs: buffs,
    });
    const serBonus = (serration.stats.damage * (serration.maxRank + 1)) / 100;
    // Wiki: base × (1 + Serration + SG×STR)
    expect(withBoth.totalDamage).toBeCloseTo(100 * (1 + serBonus + 0.25 * 1.3), 5);
  });

  it("applies Symphony of Mercy Deathbringer additively (like Shooting Gallery)", () => {
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Symphony Of Mercy"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "jade",
      warframeStats: wfStats,
      warframeAbilities: [{ name: "Symphony Of Mercy", energyCost: 50, description: "", damageBuff: 1 }],
    }, sim);
    expect(buffs[0]!.damageBonus).toBeCloseTo(1 * 1.3, 5);
    expect(buffs[0]!.damageMultBonus).toBeUndefined();
  });

  it("does not list Empower as a weapon damage buff toggle", () => {
    expect(
      weaponDamageBuffAbilities([
        { name: "Empower", energyCost: 25, description: "", miscStats: { strengthBonus: 0.5 } },
        { name: "Roar", energyCost: 75, description: "", damageBuff: 0.5 },
      ]).map((a) => a.name),
    ).toEqual(["Roar"]);
  });

  it("applies Nourish as Viral elemental scaled by Strength", () => {
    const nourish: Ability = {
      name: "Nourish",
      energyCost: 50,
      description: "viral",
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Nourish"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "grendel",
      warframeStats: wfStats,
      warframeAbilities: [nourish],
    }, sim);
    expect(buffs[0]!.elemental).toEqual([{ type: "viral", bonusFraction: 0.75 * 1.3 }]);

    const helminthBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "excalibur",
      warframeStats: wfStats,
      warframeAbilities: [{ ...nourish, miscStats: { viralDamageBonus: 0.45 } }],
    }, sim);
    expect(helminthBuffs[0]!.elemental![0]!.bonusFraction).toBeCloseTo(0.45 * 1.3, 5);
  });

  it("applies Toxic Lash as Extra Hit (melee doubled) and scales DPS", () => {
    const lash: Ability = {
      name: "Toxic Lash",
      energyCost: 50,
      description: "toxin",
      miscStats: { gunDamage: 0.3, meleeDamage: 0.6 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Toxic Lash"],
    };
    const gunBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "saryn",
      warframeStats: wfStats,
      warframeAbilities: [lash],
    }, sim);
    expect(gunBuffs[0]!.extraHitDamageFraction).toBeCloseTo(0.3 * 1.3, 5);
    expect(gunBuffs[0]!.extraHitGuaranteedToxin).toBe(true);

    const meleeBuffs = resolveWeaponExternalBuffs(testMelee, {
      warframeId: "saryn",
      warframeStats: wfStats,
      warframeAbilities: [lash],
    }, sim);
    expect(meleeBuffs[0]!.extraHitDamageFraction).toBeCloseTo(0.6 * 1.3, 5);

    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim);
    const withLash = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: gunBuffs,
    });
    expect(withLash.burstDps / bare.burstDps).toBeCloseTo(1 + 0.3 * 1.3, 4);
  });

  it("Absorb adds sim-gated additive weapon damage from √(convert×STR×absorbed)", () => {
    const absorb: Ability = {
      name: "Absorb",
      energyCost: 75,
      description: "absorb",
      miscStats: { weaponDamageConvert: 0.025, weaponDamageCap: 4 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Absorb"],
      absorbAbsorbedDamage: 20_000,
    };
    const buffs = resolveWeaponExternalBuffs(
      testRifle,
      { warframeId: "nyx", warframeStats: wfStats, warframeAbilities: [absorb] },
      sim,
    );
    // wiki: √(0.025% × 130% × 20000) = √6.5 ≈ 2.54951 → +254.951%
    expect(buffs[0]?.damageBonus).toBeCloseTo(Math.sqrt(0.00025 * 1.3 * 20_000), 5);

    const atCap = resolveWeaponExternalBuffs(
      testRifle,
      { warframeId: "nyx", warframeStats: wfStats, warframeAbilities: [absorb] },
      { ...sim, absorbAbsorbedDamage: 64_000 },
    );
    // √(0.00025 × 1.3 × 64000) = √20.8 > 4 → capped
    expect(atCap[0]?.damageBonus).toBe(4);

    const off = resolveWeaponExternalBuffs(
      testRifle,
      { warframeId: "nyx", warframeStats: wfStats, warframeAbilities: [absorb] },
      { ...sim, absorbAbsorbedDamage: 0 },
    );
    expect(off.find((b) => b.id === "ability:Absorb")).toBeUndefined();
  });

  it("Jet Stream: Turbulence-gated move + projectile speed × Strength (display; no DPS)", () => {
    const turbulence: Ability = {
      name: "Turbulence",
      energyCost: 75,
      description: "deflect",
      range: 6,
      duration: 20,
    };
    const simOn: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Turbulence"],
    };
    const jetSlots: ModSlot[] = [{ modId: "jet_stream", slotIndex: 0, rank: 3 }];
    const ctx = {
      warframeId: "zephyr",
      warframeStats: { ...wfStats, abilityStrength: 1 },
      warframeAbilities: [turbulence],
      warframeModSlots: jetSlots,
      allMods: modsMap,
    };

    expect(weaponDamageBuffAbilities([turbulence]).map((a) => a.name)).toContain("Turbulence");

    // Paper / Turbulence off → no Jet Stream buff
    const off = resolveWeaponExternalBuffs(testRifle, ctx, DEFAULT_SIM_PARAMS);
    expect(off.find((b) => b.id === "ability:Jet Stream")).toBeUndefined();

    // Turbulence on, no augment → no buff
    const noAug = resolveWeaponExternalBuffs(
      testRifle,
      { ...ctx, warframeModSlots: [] },
      simOn,
    );
    expect(noAug.find((b) => b.id === "ability:Jet Stream")).toBeUndefined();

    // R3 @ 100% STR → +40% move / +100% proj
    const buffs = resolveWeaponExternalBuffs(testRifle, ctx, simOn);
    const jet = buffs.find((b) => b.id === "ability:Jet Stream");
    expect(jet?.sprintSpeedBonus).toBeCloseTo(0.4, 8);
    expect(jet?.projectileSpeedBonus).toBeCloseTo(1.0, 8);

    const withJet = calculateWeaponBuild(testRifle, [], new Map(), undefined, simOn, {
      externalBuffs: buffs,
    });
    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, simOn);
    expect(withJet.projectileSpeed).toBeCloseTo(1.0, 8);
    expect(withJet.burstDps).toBeCloseTo(bare.burstDps, 5);
    expect(withJet.sustainedDps).toBeCloseTo(bare.sustainedDps, 5);

    // STR=2 → double
    const buffs2 = resolveWeaponExternalBuffs(
      testRifle,
      { ...ctx, warframeStats: { ...wfStats, abilityStrength: 2 } },
      simOn,
    );
    const jet2 = buffs2.find((b) => b.id === "ability:Jet Stream");
    expect(jet2?.sprintSpeedBonus).toBeCloseTo(0.8, 8);
    expect(jet2?.projectileSpeedBonus).toBeCloseTo(2.0, 8);

    const wfMove = { ...wfStats, abilityStrength: 1, sprintSpeedBonus: 0, totalSprint: 1, baseSprint: 1 };
    applyJetStreamWarframeMove(wfMove, jetSlots, modsMap, simOn);
    expect(wfMove.sprintSpeedBonus).toBeCloseTo(0.4, 8);
    expect(wfMove.totalSprint).toBeCloseTo(1.4, 8);

    const wfOff = { ...wfStats, abilityStrength: 1, sprintSpeedBonus: 0, totalSprint: 1, baseSprint: 1 };
    applyJetStreamWarframeMove(wfOff, jetSlots, modsMap, DEFAULT_SIM_PARAMS);
    expect(wfOff.sprintSpeedBonus).toBe(0);
  });

  it("Furious Javelin: Radial Javelin enemy-count melee damage mult × Strength", () => {
    const javelin: Ability = { name: "Radial Javelin", energyCost: 75, description: "" };
    expect(weaponDamageBuffAbilities([javelin]).map((a) => a.name)).toContain("Radial Javelin");

    const ctx = {
      warframeId: "excalibur",
      warframeStats: { ...wfStats, abilityStrength: 1.3 },
      warframeAbilities: [javelin],
      warframeModSlots: [
        { modId: "augment_excalibur_furious_javelin", slotIndex: 0, rank: 3 },
      ] as ModSlot[],
      allMods: modsMap,
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Radial Javelin"],
      furiousJavelinEnemies: 5,
    };

    expect(
      resolveWeaponExternalBuffs(testMelee, ctx, {
        ...sim,
        furiousJavelinEnemies: 0,
      }).find((b) => b.id === "ability:Furious Javelin"),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(testRifle, ctx, sim).find(
        (b) => b.id === "ability:Furious Javelin",
      ),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        testMelee,
        { ...ctx, warframeModSlots: [] },
        sim,
      ).find((b) => b.id === "ability:Furious Javelin"),
    ).toBeUndefined();

    // R3, 5 enemies, STR 1.3 → 0.15 × 1.3 × 5 = 0.975
    const fj = resolveWeaponExternalBuffs(testMelee, ctx, sim).find(
      (b) => b.id === "ability:Furious Javelin",
    );
    expect(fj?.damageMultBonus).toBeCloseTo(0.15 * 1.3 * 5, 8);
    expect(fj?.damageBonus).toBeUndefined();

    // Exalted melee included
    const exalted = {
      ...testMelee,
      id: "exalted_blade",
      isExalted: true,
    };
    expect(
      resolveWeaponExternalBuffs(exalted, ctx, sim).find(
        (b) => b.id === "ability:Furious Javelin",
      )?.damageMultBonus,
    ).toBeCloseTo(0.975, 8);

    // Wiki worked example: base 100, PP +120%, FJ → 100 × 2.2 × 1.975 = 434.5
    const pp = allMods.find((m) => m.id === "pressure_point_r3");
    expect(pp).toBeDefined();
    const wikiWeapon = { ...testMelee, damage: 100, impact: 100 };
    const withBoth = calculateWeaponBuild(
      wikiWeapon,
      [{ modId: pp!.id, rank: pp!.maxRank, slotIndex: 0 }],
      modsMap,
      undefined,
      sim,
      { externalBuffs: [fj!] },
    );
    expect(withBoth.totalDamage).toBeCloseTo(100 * 2.2 * 1.975, 4);
  });

  it("Valence Formation: imbue-gated parallel elemental + guaranteed status (not × Strength)", () => {
    const catalyze: Ability = { name: "Catalyze", energyCost: 0, description: "" };
    expect(weaponDamageBuffAbilities([catalyze]).map((a) => a.name)).toContain(
      "Valence Formation",
    );

    const ctx = {
      warframeId: "lavos",
      warframeStats: { ...wfStats, abilityStrength: 2 },
      warframeAbilities: [catalyze],
      warframeModSlots: [{ modId: "valence_formation", slotIndex: 0, rank: 3 }] as ModSlot[],
      allMods: modsMap,
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Valence Formation"],
      valenceFormationElement: "heat",
    };

    expect(
      resolveWeaponExternalBuffs(testRifle, ctx, DEFAULT_SIM_PARAMS).find(
        (b) => b.id === "ability:Valence Formation",
      ),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(testRifle, ctx, {
        ...DEFAULT_SIM_PARAMS,
        activeWeaponAbilityBuffs: ["Valence Formation"],
      }).find((b) => b.id === "ability:Valence Formation"),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        testRifle,
        { ...ctx, warframeModSlots: [] },
        sim,
      ).find((b) => b.id === "ability:Valence Formation"),
    ).toBeUndefined();

    // R3 Heat → +200%; STR 2 must not scale
    const vf = resolveWeaponExternalBuffs(testRifle, ctx, sim).find(
      (b) => b.id === "ability:Valence Formation",
    );
    expect(vf?.elemental).toEqual([{ type: "heat", bonusFraction: 2.0, parallel: true }]);
    expect(vf?.guaranteedStatusElement).toBe("heat");

    const viral = resolveWeaponExternalBuffs(testRifle, ctx, {
      ...sim,
      valenceFormationElement: "viral",
    }).find((b) => b.id === "ability:Valence Formation");
    expect(viral?.elemental).toEqual([{ type: "viral", bonusFraction: 2.0, parallel: true }]);

    // R0 → 50%
    const r0 = resolveWeaponExternalBuffs(
      testRifle,
      {
        ...ctx,
        warframeModSlots: [{ modId: "valence_formation", slotIndex: 0, rank: 0 }],
      },
      sim,
    ).find((b) => b.id === "ability:Valence Formation");
    expect(r0?.elemental?.[0]?.bonusFraction).toBeCloseTo(0.5, 8);

    // Universal weapon bonus — exalted included
    expect(
      resolveWeaponExternalBuffs(
        { ...testMelee, isExalted: true, id: "exalted_valence" },
        ctx,
        sim,
      ).find((b) => b.id === "ability:Valence Formation")?.elemental?.[0]?.bonusFraction,
    ).toBeCloseTo(2.0, 8);

    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim);
    const withVf = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: [vf!],
    });
    expect(withVf.totalDamage).toBeCloseTo(bare.totalDamage * 3, 5);
    expect(withVf.elements.find((e) => e.type === "heat")?.value).toBeCloseTo(200, 5);
    expect(
      withVf.statusProcs.find((p) => p.description.includes("Valence Formation"))?.chance,
    ).toBe(1);

    // Parallel: Heat VF + Infected Clip toxin does not form Gas
    const toxinMod = allMods.find((m) => m.id === "infected_clip" || m.id === "infected_clip_r3");
    expect(toxinMod).toBeDefined();
    const mixed = calculateWeaponBuild(
      testRifle,
      [{ modId: toxinMod!.id, slotIndex: 0, rank: toxinMod!.maxRank }],
      modsMap,
      undefined,
      sim,
      { externalBuffs: [vf!] },
    );
    expect(mixed.elements.some((e) => e.type === "gas")).toBe(false);
    expect(mixed.elements.some((e) => e.type === "toxin")).toBe(true);
    expect(mixed.elements.some((e) => e.type === "heat")).toBe(true);
  });

  it("Razorwing Blitz / Critical Surge: stack and teleport-meter gates", () => {
    const razorwing: Ability = { name: "Razorwing", energyCost: 25, description: "" };
    const breach: Ability = { name: "Breach Surge", energyCost: 50, description: "" };
    expect(weaponDamageBuffAbilities([razorwing]).map((a) => a.name)).toContain("Razorwing");
    expect(weaponDamageBuffAbilities([breach]).map((a) => a.name)).toContain("Breach Surge");

    const pixia = { ...testRifle, id: "dex_pixia", name: "Dex Pixia", isExalted: true };
    const diwata = { ...testMelee, id: "diwata", name: "Diwata", isExalted: true };
    const blitzCtx = {
      warframeId: "titania",
      warframeStats: { ...wfStats, abilityStrength: 1 },
      warframeAbilities: [razorwing],
      warframeModSlots: [
        { modId: "augment_titania_razorwing_blitz", slotIndex: 0, rank: 3 },
      ] as ModSlot[],
      allMods: modsMap,
    };
    const simBlitz: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Razorwing"],
      razorwingBlitzStacks: 4,
    };

    // stacks 0 / no augment / wrong weapon → no Blitz
    expect(
      resolveWeaponExternalBuffs(pixia, blitzCtx, {
        ...simBlitz,
        razorwingBlitzStacks: 0,
      }).find((b) => b.id === "ability:Razorwing Blitz"),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(testRifle, blitzCtx, simBlitz).find(
        (b) => b.id === "ability:Razorwing Blitz",
      ),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        pixia,
        { ...blitzCtx, warframeModSlots: [] },
        simBlitz,
      ).find((b) => b.id === "ability:Razorwing Blitz"),
    ).toBeUndefined();

    // 4 stacks @ 100% STR → +100% FR
    const blitz = resolveWeaponExternalBuffs(pixia, blitzCtx, simBlitz).find(
      (b) => b.id === "ability:Razorwing Blitz",
    );
    expect(blitz?.fireRateBonus).toBeCloseTo(1.0, 8);

    const blitzDiwata = resolveWeaponExternalBuffs(diwata, blitzCtx, simBlitz).find(
      (b) => b.id === "ability:Razorwing Blitz",
    );
    expect(blitzDiwata?.fireRateBonus).toBeCloseTo(1.0, 8);

    const blitzStr2 = resolveWeaponExternalBuffs(
      pixia,
      { ...blitzCtx, warframeStats: { ...wfStats, abilityStrength: 2 } },
      { ...simBlitz, razorwingBlitzStacks: 2 },
    ).find((b) => b.id === "ability:Razorwing Blitz");
    // 25% × 2 stacks × 2 STR = 100%
    expect(blitzStr2?.fireRateBonus).toBeCloseTo(1.0, 8);

    const barePixia = calculateWeaponBuild(pixia, [], new Map(), undefined, simBlitz);
    const withBlitz = calculateWeaponBuild(pixia, [], new Map(), undefined, simBlitz, {
      externalBuffs: [blitz!],
    });
    expect(withBlitz.fireRate / barePixia.fireRate).toBeCloseTo(2, 5);

    // Critical Surge — 10m @ R3 100% STR → +100% primary CC; 25m → 250% cap
    const surgeCtx = {
      warframeId: "wisp",
      warframeStats: { ...wfStats, abilityStrength: 1 },
      warframeAbilities: [breach],
      warframeModSlots: [
        { modId: "augment_wisp_critical_surge", slotIndex: 0, rank: 3 },
      ] as ModSlot[],
      allMods: modsMap,
    };
    const simSurge: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Breach Surge"],
      criticalSurgeTeleportMeters: 10,
    };

    expect(
      resolveWeaponExternalBuffs(testRifle, surgeCtx, {
        ...simSurge,
        criticalSurgeTeleportMeters: 0,
      }).find((b) => b.id === "ability:Critical Surge"),
    ).toBeUndefined();
    // No spark-mult weapon buff without meters/augment (legacy damageBuff ignored)
    expect(
      resolveWeaponExternalBuffs(
        testRifle,
        {
          ...surgeCtx,
          warframeModSlots: [],
          warframeAbilities: [{ ...breach, damageBuff: 2 }],
        },
        { ...DEFAULT_SIM_PARAMS, activeWeaponAbilityBuffs: ["Breach Surge"] },
      ).filter((b) => b.label === "Breach Surge"),
    ).toHaveLength(0);

    const surge10 = resolveWeaponExternalBuffs(testRifle, surgeCtx, simSurge).find(
      (b) => b.id === "ability:Critical Surge",
    );
    expect(surge10?.critChanceBonus).toBeCloseTo(1.0, 8);

    // Values below min teleport clamp to 10m
    const surge5 = resolveWeaponExternalBuffs(testRifle, surgeCtx, {
      ...simSurge,
      criticalSurgeTeleportMeters: 5,
    }).find((b) => b.id === "ability:Critical Surge");
    expect(surge5?.critChanceBonus).toBeCloseTo(1.0, 8);

    const surgeCap = resolveWeaponExternalBuffs(testRifle, surgeCtx, {
      ...simSurge,
      criticalSurgeTeleportMeters: 50,
    }).find((b) => b.id === "ability:Critical Surge");
    expect(surgeCap?.critChanceBonus).toBeCloseTo(2.5, 8);

    const surgeStr2 = resolveWeaponExternalBuffs(
      testRifle,
      { ...surgeCtx, warframeStats: { ...wfStats, abilityStrength: 2 } },
      simSurge,
    ).find((b) => b.id === "ability:Critical Surge");
    // 10%/m × 10m × 2 STR = 200%
    expect(surgeStr2?.critChanceBonus).toBeCloseTo(2.0, 8);

    // Secondary / melee ignored
    expect(
      resolveWeaponExternalBuffs(testMelee, surgeCtx, simSurge).find(
        (b) => b.id === "ability:Critical Surge",
      ),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        { ...testRifle, category: "pistol", id: "test_pistol_surge" },
        surgeCtx,
        simSurge,
      ).find((b) => b.id === "ability:Critical Surge"),
    ).toBeUndefined();

    const bareRifle = calculateWeaponBuild(testRifle, [], new Map(), undefined, simSurge);
    const withSurge = calculateWeaponBuild(testRifle, [], new Map(), undefined, simSurge, {
      externalBuffs: [surge10!],
    });
    expect(withSurge.criticalChance).toBeCloseTo(bareRifle.criticalChance * (1 + 1.0), 5);
  });

  it("Thermal Transfer: Thermal Sunder-gated parallel Cold/Heat/Blast × Strength", () => {
    const sunder: Ability = { name: "Thermal Sunder", energyCost: 50, description: "" };
    expect(weaponDamageBuffAbilities([sunder]).map((a) => a.name)).toContain("Thermal Sunder");

    const ctx = {
      warframeId: "gauss",
      warframeStats: { ...wfStats, abilityStrength: 1 },
      warframeAbilities: [sunder],
      warframeModSlots: [
        { modId: "augment_gauss_thermal_transfer", slotIndex: 0, rank: 3 },
      ] as ModSlot[],
      allMods: modsMap,
    };
    const simCold: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Thermal Sunder"],
      thermalTransferPolarity: "cold",
    };

    // Ability off / polarity unset / no augment → no buff
    expect(
      resolveWeaponExternalBuffs(testRifle, ctx, DEFAULT_SIM_PARAMS).find(
        (b) => b.id === "ability:Thermal Transfer",
      ),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(testRifle, ctx, {
        ...DEFAULT_SIM_PARAMS,
        activeWeaponAbilityBuffs: ["Thermal Sunder"],
      }).find((b) => b.id === "ability:Thermal Transfer"),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        testRifle,
        { ...ctx, warframeModSlots: [] },
        simCold,
      ).find((b) => b.id === "ability:Thermal Transfer"),
    ).toBeUndefined();

    const cold = resolveWeaponExternalBuffs(testRifle, ctx, simCold).find(
      (b) => b.id === "ability:Thermal Transfer",
    );
    expect(cold?.elemental).toEqual([
      { type: "cold", bonusFraction: 0.75, parallel: true },
    ]);

    const heat = resolveWeaponExternalBuffs(testRifle, ctx, {
      ...simCold,
      thermalTransferPolarity: "heat",
    }).find((b) => b.id === "ability:Thermal Transfer");
    expect(heat?.elemental).toEqual([
      { type: "heat", bonusFraction: 0.75, parallel: true },
    ]);

    const blast = resolveWeaponExternalBuffs(testRifle, ctx, {
      ...simCold,
      thermalTransferPolarity: "blast",
    }).find((b) => b.id === "ability:Thermal Transfer");
    expect(blast?.elemental).toEqual([
      { type: "blast", bonusFraction: 1.5, parallel: true },
    ]);

    const coldStr2 = resolveWeaponExternalBuffs(
      testRifle,
      { ...ctx, warframeStats: { ...wfStats, abilityStrength: 2 } },
      simCold,
    ).find((b) => b.id === "ability:Thermal Transfer");
    expect(coldStr2?.elemental?.[0]?.bonusFraction).toBeCloseTo(1.5, 8);

    // R0 Cold → 40%
    const r0 = resolveWeaponExternalBuffs(
      testRifle,
      {
        ...ctx,
        warframeModSlots: [
          { modId: "augment_gauss_thermal_transfer", slotIndex: 0, rank: 0 },
        ],
      },
      simCold,
    ).find((b) => b.id === "ability:Thermal Transfer");
    expect(r0?.elemental?.[0]?.bonusFraction).toBeCloseTo(0.4, 8);

    // Exalted ignored
    expect(
      resolveWeaponExternalBuffs(
        { ...testRifle, isExalted: true, id: "exalted_thermal" },
        ctx,
        simCold,
      ).find((b) => b.id === "ability:Thermal Transfer"),
    ).toBeUndefined();

    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, simCold);
    const withCold = calculateWeaponBuild(testRifle, [], new Map(), undefined, simCold, {
      externalBuffs: [cold!],
    });
    expect(withCold.totalDamage).toBeCloseTo(bare.totalDamage * 1.75, 5);
    expect(withCold.elements.find((e) => e.type === "cold")?.value).toBeCloseTo(75, 5);

    // Parallel: Cold + Infected Clip toxin does not form Viral/Gas
    const toxinMod = allMods.find((m) => m.id === "infected_clip" || m.id === "infected_clip_r3");
    expect(toxinMod).toBeDefined();
    const mixed = calculateWeaponBuild(
      testRifle,
      [{ modId: toxinMod!.id, slotIndex: 0, rank: toxinMod!.maxRank }],
      modsMap,
      undefined,
      simCold,
      { externalBuffs: [cold!] },
    );
    expect(mixed.elements.some((e) => e.type === "viral" || e.type === "gas")).toBe(false);
    expect(mixed.elements.some((e) => e.type === "toxin")).toBe(true);
    expect(mixed.elements.some((e) => e.type === "cold")).toBe(true);
  });

  it("Teeming Virulence / Thrall Pact / Smoke Shadow: ability-gated primary buffs", () => {
    const virulence: Ability = { name: "Virulence", energyCost: 40, description: "" };
    const enthrall: Ability = { name: "Enthrall", energyCost: 25, description: "" };
    const smoke: Ability = { name: "Smoke Screen", energyCost: 35, description: "" };

    expect(weaponDamageBuffAbilities([virulence]).map((a) => a.name)).toContain("Virulence");
    expect(weaponDamageBuffAbilities([enthrall]).map((a) => a.name)).toContain("Enthrall");
    expect(weaponDamageBuffAbilities([smoke]).map((a) => a.name)).toContain("Smoke Screen");

    // Teeming Virulence — R3 @ 100% STR → +120% primary CC
    const teemingCtx = {
      warframeId: "nidus",
      warframeStats: { ...wfStats, abilityStrength: 1 },
      warframeAbilities: [virulence],
      warframeModSlots: [{ modId: "teeming_virulence", slotIndex: 0, rank: 3 }] as ModSlot[],
      allMods: modsMap,
    };
    const simVir: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Virulence"],
    };
    expect(
      resolveWeaponExternalBuffs(testRifle, teemingCtx, DEFAULT_SIM_PARAMS).find(
        (b) => b.id === "ability:Teeming Virulence",
      ),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        testRifle,
        { ...teemingCtx, warframeModSlots: [] },
        simVir,
      ).find((b) => b.id === "ability:Teeming Virulence"),
    ).toBeUndefined();

    const teeming = resolveWeaponExternalBuffs(testRifle, teemingCtx, simVir).find(
      (b) => b.id === "ability:Teeming Virulence",
    );
    expect(teeming?.critChanceBonus).toBeCloseTo(1.2, 8);

    const teemingStr2 = resolveWeaponExternalBuffs(
      testRifle,
      { ...teemingCtx, warframeStats: { ...wfStats, abilityStrength: 2 } },
      simVir,
    ).find((b) => b.id === "ability:Teeming Virulence");
    expect(teemingStr2?.critChanceBonus).toBeCloseTo(2.4, 8);

    // Secondary / archgun / exalted → no Teeming
    expect(
      resolveWeaponExternalBuffs(
        { ...testRifle, category: "pistol", id: "test_pistol" },
        teemingCtx,
        simVir,
      ).find((b) => b.id === "ability:Teeming Virulence"),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        { ...testRifle, category: "archgun", id: "test_arch" },
        teemingCtx,
        simVir,
      ).find((b) => b.id === "ability:Teeming Virulence"),
    ).toBeUndefined();
    expect(
      resolveWeaponExternalBuffs(
        { ...testRifle, isExalted: true, id: "test_exalted" },
        teemingCtx,
        simVir,
      ).find((b) => b.id === "ability:Teeming Virulence"),
    ).toBeUndefined();

    const withTeeming = calculateWeaponBuild(testRifle, [], new Map(), undefined, simVir, {
      externalBuffs: [teeming!],
    });
    const bareRifle = calculateWeaponBuild(testRifle, [], new Map(), undefined, simVir);
    // base 25% CC × (1 + 1.2) = 55%
    expect(withTeeming.criticalChance).toBeCloseTo(bareRifle.criticalChance * (1 + 1.2), 5);

    // Thrall Pact — R3, 4 thralls, STR 1.3 → 0.25 × 4 × 1.3 = 1.3
    const thrallCtx = {
      warframeId: "revenant",
      warframeStats: { ...wfStats, abilityStrength: 1.3 },
      warframeAbilities: [enthrall],
      warframeModSlots: [{ modId: "thrall_pact", slotIndex: 0, rank: 3 }] as ModSlot[],
      allMods: modsMap,
    };
    const simThrall: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Enthrall"],
      thrallCount: 4,
    };
    expect(
      resolveWeaponExternalBuffs(testRifle, thrallCtx, {
        ...simThrall,
        thrallCount: 0,
      }).find((b) => b.id === "ability:Thrall Pact"),
    ).toBeUndefined();

    const thrall = resolveWeaponExternalBuffs(testRifle, thrallCtx, simThrall).find(
      (b) => b.id === "ability:Thrall Pact",
    );
    expect(thrall?.damageBonus).toBeCloseTo(0.25 * 4 * 1.3, 8);

    // Clamp at 7 thralls
    const thrall7 = resolveWeaponExternalBuffs(testRifle, thrallCtx, {
      ...simThrall,
      thrallCount: 99,
    }).find((b) => b.id === "ability:Thrall Pact");
    expect(thrall7?.damageBonus).toBeCloseTo(0.25 * 7 * 1.3, 8);

    expect(
      resolveWeaponExternalBuffs(testMelee, thrallCtx, simThrall).find(
        (b) => b.id === "ability:Thrall Pact",
      ),
    ).toBeUndefined();

    const withThrall = calculateWeaponBuild(testRifle, [], new Map(), undefined, simThrall, {
      externalBuffs: [thrall!],
    });
    expect(withThrall.totalDamage).toBeCloseTo(bareRifle.totalDamage * (1 + 0.25 * 4 * 1.3), 5);

    // Smoke Shadow — R3 +150% CC, not × Strength; works on all weapons
    const smokeCtx = {
      warframeId: "ash",
      warframeStats: { ...wfStats, abilityStrength: 2 },
      warframeAbilities: [smoke],
      warframeModSlots: [{ modId: "augment_ash_smoke_shadow", slotIndex: 0, rank: 3 }] as ModSlot[],
      allMods: modsMap,
    };
    const simSmoke: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Smoke Screen"],
    };
    const smokeBuff = resolveWeaponExternalBuffs(testRifle, smokeCtx, simSmoke).find(
      (b) => b.id === "ability:Smoke Shadow",
    );
    expect(smokeBuff?.critChanceBonus).toBeCloseTo(1.5, 8);

    const smokeMelee = resolveWeaponExternalBuffs(testMelee, smokeCtx, simSmoke).find(
      (b) => b.id === "ability:Smoke Shadow",
    );
    expect(smokeMelee?.critChanceBonus).toBeCloseTo(1.5, 8);

    const smokeExalted = resolveWeaponExternalBuffs(
      { ...testRifle, isExalted: true, id: "exalted_smoke" },
      smokeCtx,
      simSmoke,
    ).find((b) => b.id === "ability:Smoke Shadow");
    expect(smokeExalted?.critChanceBonus).toBeCloseTo(1.5, 8);
  });

  it("Elemental infusion augments: ability-gated parallel element × Strength (no exalted)", () => {
    const cases: {
      ability: string;
      modId: string;
      element: string;
      label: string;
      warframeId: string;
    }[] = [
      {
        ability: "Fireball",
        modId: "augment_ember_fireball_frenzy",
        element: "heat",
        label: "Fireball Frenzy",
        warframeId: "ember",
      },
      {
        ability: "Freeze",
        modId: "augment_frost_freeze_force",
        element: "cold",
        label: "Freeze Force",
        warframeId: "frost",
      },
      {
        ability: "Shock",
        modId: "augment_volt_shock_trooper",
        element: "electricity",
        label: "Shock Trooper",
        warframeId: "volt",
      },
      {
        ability: "Spores",
        modId: "augment_saryn_venom_dose",
        element: "corrosive",
        label: "Venom Dose",
        warframeId: "saryn",
      },
      {
        ability: "Smite",
        modId: "smite_infusion",
        element: "radiation",
        label: "Smite Infusion",
        warframeId: "oberon",
      },
    ];

    for (const c of cases) {
      const ability: Ability = { name: c.ability, energyCost: 25, description: c.label };
      expect(weaponDamageBuffAbilities([ability]).map((a) => a.name)).toContain(c.ability);

      const simOn: SimulationParams = {
        ...DEFAULT_SIM_PARAMS,
        activeWeaponAbilityBuffs: [c.ability],
      };
      const slots: ModSlot[] = [{ modId: c.modId, slotIndex: 0, rank: 3 }];
      const ctx = {
        warframeId: c.warframeId,
        warframeStats: { ...wfStats, abilityStrength: 1 },
        warframeAbilities: [ability],
        warframeModSlots: slots,
        allMods: modsMap,
      };

      // Paper / ability off → no buff
      expect(
        resolveWeaponExternalBuffs(testRifle, ctx, DEFAULT_SIM_PARAMS).find(
          (b) => b.id === `ability:${c.label}`,
        ),
      ).toBeUndefined();

      // Ability on, no augment → no buff
      expect(
        resolveWeaponExternalBuffs(
          testRifle,
          { ...ctx, warframeModSlots: [] },
          simOn,
        ).find((b) => b.id === `ability:${c.label}`),
      ).toBeUndefined();

      // R3 @ 100% STR → +100% parallel element
      const buffs = resolveWeaponExternalBuffs(testRifle, ctx, simOn);
      const inf = buffs.find((b) => b.id === `ability:${c.label}`);
      expect(inf?.elemental).toEqual([
        { type: c.element, bonusFraction: 1, parallel: true },
      ]);

      const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, simOn);
      const withInf = calculateWeaponBuild(testRifle, [], new Map(), undefined, simOn, {
        externalBuffs: buffs,
      });
      // IPS-only rifle: +100% of base as parallel element → total damage ×2
      expect(withInf.totalDamage).toBeCloseTo(bare.totalDamage * 2, 5);
      expect(withInf.elements.find((e) => e.type === c.element)?.value).toBeCloseTo(100, 5);
      expect(withInf.burstDps / bare.burstDps).toBeCloseTo(2, 5);

      // STR=2 → +200%
      const buffs2 = resolveWeaponExternalBuffs(
        testRifle,
        { ...ctx, warframeStats: { ...wfStats, abilityStrength: 2 } },
        simOn,
      );
      expect(buffs2.find((b) => b.id === `ability:${c.label}`)?.elemental?.[0]?.bonusFraction).toBeCloseTo(
        2,
        8,
      );

      // Exalted weapons ignored
      const exalted = { ...testRifle, id: "exalted_test", isExalted: true };
      expect(
        resolveWeaponExternalBuffs(exalted, ctx, simOn).find((b) => b.id === `ability:${c.label}`),
      ).toBeUndefined();
    }

    // Parallel: heat infusion does not combine with toxin into Gas
    const fireball: Ability = { name: "Fireball", energyCost: 25, description: "" };
    const simFire: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Fireball"],
    };
    const toxinMod = allMods.find((m) => m.id === "infected_clip" || m.id === "infected_clip_r3");
    expect(toxinMod).toBeDefined();
    const frenzyBuffs = resolveWeaponExternalBuffs(
      testRifle,
      {
        warframeId: "ember",
        warframeStats: { ...wfStats, abilityStrength: 1 },
        warframeAbilities: [fireball],
        warframeModSlots: [{ modId: "augment_ember_fireball_frenzy", slotIndex: 0, rank: 3 }],
        allMods: modsMap,
      },
      simFire,
    );
    const toxinSlots: ModSlot[] = [{ modId: toxinMod!.id, slotIndex: 0, rank: toxinMod!.maxRank }];
    const mixed = calculateWeaponBuild(testRifle, toxinSlots, modsMap, undefined, simFire, {
      externalBuffs: frenzyBuffs,
    });
    expect(mixed.elements.some((e) => e.type === "gas")).toBe(false);
    expect(mixed.elements.some((e) => e.type === "toxin")).toBe(true);
    expect(mixed.elements.some((e) => e.type === "heat")).toBe(true);
  });

  it("Contagion Cloud adds sim-gated ability toxin DPS (gun/melee) when augment equipped", () => {
    const lash: Ability = {
      name: "Toxic Lash",
      energyCost: 50,
      description: "toxin",
      miscStats: {
        gunDamage: 0.3,
        meleeDamage: 0.6,
        contagionCloudDps: 300,
        contagionCloudMeleeMult: 2,
      },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Toxic Lash"],
      contagionCloudEnemies: 2,
    };
    const ctx = {
      warframeId: "saryn",
      warframeStats: wfStats,
      warframeAbilities: [lash],
      warframeModSlots: [{ modId: "augment_saryn_contagion_cloud", slotIndex: 0, rank: 3 }],
    };
    const gunBuffs = resolveWeaponExternalBuffs(testRifle, ctx, sim);
    const cloudGun = gunBuffs.find((b) => b.id === "ability:Contagion Cloud");
    // 300 × 1.3 STR × 2 enemies = 780
    expect(cloudGun?.abilityCloudDps).toBeCloseTo(300 * 1.3 * 2, 5);

    const meleeBuffs = resolveWeaponExternalBuffs(testMelee, ctx, sim);
    const cloudMelee = meleeBuffs.find((b) => b.id === "ability:Contagion Cloud");
    // 300 × 1.3 × 2 melee × 2 enemies = 1560
    expect(cloudMelee?.abilityCloudDps).toBeCloseTo(300 * 1.3 * 2 * 2, 5);

    const withCloud = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: gunBuffs,
    });
    expect(withCloud.contagionCloudDps).toBeCloseTo(780, 5);
    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: gunBuffs.filter((b) => b.id !== "ability:Contagion Cloud"),
    });
    expect(withCloud.burstDps - bare.burstDps).toBeCloseTo(780, 4);

    // No augment → no cloud contribution even with enemies > 0
    const noAug = resolveWeaponExternalBuffs(
      testRifle,
      { ...ctx, warframeModSlots: [] },
      sim,
    );
    expect(noAug.find((b) => b.id === "ability:Contagion Cloud")).toBeUndefined();
  });

  it("Toxic Lash Extra Hit double-dips elemental mods (wiki)", () => {
    const lash: Ability = {
      name: "Toxic Lash",
      energyCost: 50,
      description: "toxin",
      miscStats: { gunDamage: 0.3, meleeDamage: 0.6 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Toxic Lash"],
    };
    const gunBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "saryn",
      warframeStats: wfStats,
      warframeAbilities: [lash],
    }, sim);
    const toxinSlots: ModSlot[] = [{ modId: "infected_clip_r3", slotIndex: 0, rank: 5 }];
    // Infected Clip R5 = +90% toxin; Extra Hit fraction × (1 + 0.9)
    const frac = 0.3 * 1.3;
    const withDip = calculateWeaponBuild(testRifle, toxinSlots, modsMap, undefined, sim, {
      externalBuffs: gunBuffs,
    });
    expect(withDip.extraHitDamageFraction).toBeCloseTo(frac * (1 + 0.9), 5);
    const bareModded = calculateWeaponBuild(testRifle, toxinSlots, modsMap, undefined, sim);
    expect(withDip.burstDps / bareModded.burstDps).toBeCloseTo(1 + frac * (1 + 0.9), 4);
  });

  it("Toxic Lash + Spores doubles Extra Hit damage but not Toxin DoT stacks", () => {
    const lash: Ability = {
      name: "Toxic Lash",
      energyCost: 50,
      description: "toxin",
      miscStats: { gunDamage: 0.3, meleeDamage: 0.6 },
    };
    const baseSim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Toxic Lash"],
    };
    const sporeSim: SimulationParams = { ...baseSim, toxicLashSporesOnTarget: true };
    const gunBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "saryn",
      warframeStats: wfStats,
      warframeAbilities: [lash],
    }, baseSim);
    const frac = 0.3 * 1.3;
    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, baseSim);
    const without = calculateWeaponBuild(testRifle, [], new Map(), undefined, baseSim, {
      externalBuffs: gunBuffs,
    });
    const withSpores = calculateWeaponBuild(testRifle, [], new Map(), undefined, sporeSim, {
      externalBuffs: gunBuffs,
    });
    expect(without.extraHitInstances).toBe(1);
    expect(withSpores.extraHitInstances).toBe(2);
    expect(without.burstDps / bare.burstDps).toBeCloseTo(1 + frac, 4);
    expect(withSpores.burstDps / bare.burstDps).toBeCloseTo(1 + frac * 2, 4);
    // One guaranteed Toxin DoT either way (wiki: not two status stacks)
    const dpt1 = without.statusProcs.find((p) => p.description.includes("Toxic Lash"))!.damagePerTick;
    const dpt2 = withSpores.statusProcs.find((p) => p.description.includes("Toxic Lash"))!.damagePerTick;
    expect(dpt2).toBeCloseTo(dpt1, 5);
  });

  it("Toxic Lash adds guaranteed Toxin DoT and faction-triple-dips Extra Hit ticks", () => {
    const lash: Ability = {
      name: "Toxic Lash",
      energyCost: 50,
      description: "toxin",
      miscStats: { gunDamage: 0.3, meleeDamage: 0.6 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Toxic Lash"],
      targetFaction: "grineer",
    };
    const gunBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "saryn",
      warframeStats: wfStats,
      warframeAbilities: [lash],
    }, sim);
    const baneSlots: ModSlot[] = [{ modId: "bane_of_grineer", slotIndex: 0, rank: 5 }];
    const withTl = calculateWeaponBuild(testRifle, baneSlots, modsMap, undefined, sim, {
      externalBuffs: gunBuffs,
    });
    const frac = 0.3 * 1.3;
    const bane = withTl.factionBonuses?.grineer ?? 0;
    expect(bane).toBeCloseTo(0.3, 5);
    const f = 1 + bane;
    // Extra Hit second faction dip: DPS mult = 1 + frac × f
    const bare = calculateWeaponBuild(testRifle, baneSlots, modsMap, undefined, sim);
    expect(withTl.burstDps / bare.burstDps).toBeCloseTo(1 + frac * f, 4);

    const tlProc = withTl.statusProcs.find((p) =>
      p.description.includes("Toxic Lash"),
    );
    expect(tlProc).toBeDefined();
    expect(tlProc!.type).toBe("toxin");
    expect(tlProc!.chance).toBe(1);
    // tick = 0.5 × total × frac × avgCrit × f³ (no toxin mods / Elementalist / headshots)
    const avgCrit = 1 + withTl.criticalChance * (withTl.criticalMultiplier - 1);
    expect(tlProc!.damagePerTick).toBeCloseTo(
      0.5 * withTl.totalDamage * frac * avgCrit * f * f * f,
      3,
    );
  });

  it("applies Xata's Whisper as Void Extra Hit and Vex Armor max Fury as Serration-style", () => {
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Xata's Whisper", "Vex Armor"],
    };
    const xataBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "xaku",
      warframeStats: wfStats,
      warframeAbilities: [{ name: "Xata's Whisper", energyCost: 25, description: "" }],
    }, sim);
    expect(xataBuffs[0]!.extraHitDamageFraction).toBeCloseTo(0.26 * 1.3, 5);

    const vexBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "chroma",
      warframeStats: wfStats,
      warframeAbilities: [{ name: "Vex Armor", energyCost: 75, description: "" }],
    }, sim);
    // Max Fury 275% × 130% STR → +357.5% additive damage
    expect(vexBuffs[0]!.damageBonus).toBeCloseTo(2.75 * 1.3, 5);

    const withVex = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: vexBuffs,
    });
    expect(withVex.totalDamage).toBeCloseTo(100 * (1 + 2.75 * 1.3), 5);
  });

  it("scales Vex Armor Fury by vexArmorFuryFraction", () => {
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Vex Armor"],
      vexArmorFuryFraction: 0.5,
    };
    const vexBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "chroma",
      warframeStats: wfStats,
      warframeAbilities: [{ name: "Vex Armor", energyCost: 75, description: "" }],
    }, sim);
    expect(vexBuffs[0]!.damageBonus).toBeCloseTo(2.75 * 1.3 * 0.5, 5);
  });

  it("applies Electric Shield as fixed Electricity + crit mult (guns only)", () => {
    const shield: Ability = {
      name: "Electric Shield",
      energyCost: 50,
      description: "shield",
      miscStats: { electricDamageBonus: 0.5, critDamageBonus: 1.0 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Electric Shield"],
    };
    const gunBuffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "volt",
      warframeStats: wfStats,
      warframeAbilities: [shield],
    }, sim);
    expect(gunBuffs).toHaveLength(1);
    expect(gunBuffs[0]!.elemental).toEqual([{ type: "electricity", bonusFraction: 0.5 }]);
    expect(gunBuffs[0]!.critMultBonus).toBe(1);
    // 100% STR or 130% STR — same fixed values
    expect(gunBuffs[0]!.damageMultBonus).toBeUndefined();

    const meleeBuffs = resolveWeaponExternalBuffs(testMelee, {
      warframeId: "volt",
      warframeStats: wfStats,
      warframeAbilities: [shield],
    }, sim);
    expect(meleeBuffs.filter((b) => b.label === "Electric Shield")).toHaveLength(0);

    const withShield = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: gunBuffs,
    });
    // Wiki: 100 base → 150 total with +50% Electricity; CM ≈ 2 × (1+1) after quantize
    expect(withShield.totalDamage).toBeCloseTo(150, 5);
    expect(withShield.criticalMultiplier).toBeCloseTo(4, 2);
  });

  it("scales Roar with ability strength", () => {
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Roar"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "rhino",
      warframeStats: wfStats,
      warframeAbilities: [roarAbility],
    }, sim);

    expect(buffs).toHaveLength(1);
    expect(buffs[0].label).toBe("Roar");
    // Multiplicative with Serration (not additive base-damage pool)
    expect(buffs[0].damageMultBonus).toBeCloseTo(0.65, 5);
    expect(buffs[0].damageBonus).toBeUndefined();
  });

  it("scales Helminth Eclipse via helminth:: registry when host is not Mirage", () => {
    const eclipse: Ability = {
      name: "Eclipse",
      energyCost: 25,
      description: "Subsumed",
      damageBuff: 0.3, // wiki subsumed max bonus fraction
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Eclipse"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "excalibur",
      warframeStats: wfStats,
      warframeAbilities: [eclipse],
    }, sim);
    expect(buffs).toHaveLength(1);
    // 130% STR × 30% base = 39%
    expect(buffs[0]!.damageMultBonus).toBeCloseTo(0.3 * 1.3, 5);
  });

  it("increases weapon DPS when applied via calc options", () => {
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Roar"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "rhino",
      warframeStats: wfStats,
      warframeAbilities: [roarAbility],
    }, sim);

    const base = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim);
    const withRoar = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, { externalBuffs: buffs });

    // 130% strength Roar = +65% → ×1.65
    expect(withRoar.burstDps).toBeCloseTo(base.burstDps * 1.65, 5);
  });

  it("multiplies Roar with Serration instead of adding", () => {
    const serration = allMods.find((m) => m.id === "serration" || m.id === "serration_r3");
    if (!serration) return;
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Roar"],
    };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      warframeId: "rhino",
      warframeStats: wfStats,
      warframeAbilities: [roarAbility],
    }, sim);
    const slots = [{ modId: serration.id, rank: serration.maxRank, slotIndex: 0 }];
    const withBoth = calculateWeaponBuild(testRifle, slots, modsMap, undefined, sim, { externalBuffs: buffs });
    const serBonus = (serration.stats.damage * (serration.maxRank + 1)) / 100;
    // base × (1+Serration) × (1+Roar) — not × (1+Serration+Roar)
    const expected = testRifle.damage * (1 + serBonus) * 1.65;
    expect(withBoth.totalDamage).toBeCloseTo(expected, 5);
  });

  it("applies Voltaic Strike from warframe mod bar as external elemental", () => {
    const sim = DEFAULT_SIM_PARAMS;
    const wfMods: ModSlot[] = [{ modId: "voltaic_strike", rank: 3, slotIndex: 0 }];
    const buffs = resolveWeaponExternalBuffs(testMelee, {
      warframeModSlots: wfMods,
      allMods: modsMap,
    }, sim);

    const voltaic = buffs.find((b) => b.id === "wf-mod:voltaic_strike");
    expect(voltaic).toBeDefined();
    expect(voltaic!.elemental?.some((e) => e.type === "electricity" && e.bonusFraction > 0.5)).toBe(true);

    const shocking = modsMap.get("shocking_touch_r3")!;
    const modSlots: ModSlot[] = [
      { modId: shocking.id, rank: 10, slotIndex: 0 },
    ];
    const withExternal = calculateWeaponBuild(
      testMelee,
      modSlots,
      modsMap,
      undefined,
      sim,
      { externalBuffs: buffs },
    );
    const withModOnly = calculateWeaponBuild(testMelee, modSlots, modsMap, undefined, sim);
    const withBothManual = calculateWeaponBuild(
      testMelee,
      [...modSlots, { modId: "voltaic_strike", rank: 3, slotIndex: 1 }],
      modsMap,
      undefined,
      sim,
    );

    expect(withExternal.burstDps).toBeCloseTo(withBothManual.burstDps, 0);
    expect(withExternal.burstDps).toBeGreaterThan(withModOnly.burstDps);
  });

  it("applies Tenacious Bond crit mult when companion crit exceeds 50%", () => {
    const sim: SimulationParams = { ...DEFAULT_SIM_PARAMS, applyTenaciousBondCrit: true };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      companionModSlots: [{ modId: "tenacious_bond", rank: 5, slotIndex: 0 }],
      companionWeaponCritChance: 0.6,
      allMods: modsMap,
    }, sim);

    const tenacious = buffs.find((b) => b.id === "companion:tenacious_bond");
    expect(tenacious?.critMultFlatBonus).toBe(1.2);

    const critMod = modsMap.get("point_strike_r3")!;
    const modSlots: ModSlot[] = [{ modId: critMod.id, rank: 5, slotIndex: 0 }];
    const withBond = calculateWeaponBuild(testRifle, modSlots, modsMap, undefined, sim, { externalBuffs: buffs });
    const withoutBond = calculateWeaponBuild(testRifle, modSlots, modsMap, undefined, sim);

    expect(withBond.burstDps).toBeGreaterThan(withoutBond.burstDps * 1.05);
  });

  it("skips Tenacious Bond when companion crit is below 50%", () => {
    const sim: SimulationParams = { ...DEFAULT_SIM_PARAMS, applyTenaciousBondCrit: true };
    const buffs = resolveWeaponExternalBuffs(testRifle, {
      companionModSlots: [{ modId: "tenacious_bond", rank: 5, slotIndex: 0 }],
      companionWeaponCritChance: 0.3,
      allMods: modsMap,
    }, sim);

    expect(buffs.find((b) => b.id === "companion:tenacious_bond")).toBeUndefined();
  });
});

describe("computeDpsContributions with external sources", () => {
  it("shows lower marginal efficiency for duplicate electricity when Voltaic Strike is external", () => {
    const sim = DEFAULT_SIM_PARAMS;
    const wfMods: ModSlot[] = [{ modId: "voltaic_strike", rank: 3, slotIndex: 0 }];
    const buffs = resolveWeaponExternalBuffs(testMelee, { warframeModSlots: wfMods, allMods: modsMap }, sim);
    const shocking = modsMap.get("shocking_touch_r3")!;
    const modSlots: ModSlot[] = [{ modId: shocking.id, rank: 10, slotIndex: 0 }];

    const contributions = computeDpsContributions({
      baseWeapon: testMelee,
      modSlots,
      allMods: modsMap,
      simParams: sim,
      calcOptions: { externalBuffs: buffs },
    });

    const shockingContrib = contributions.find((c) => c.label === shocking.name);
    const voltaicContrib = contributions.find((c) => c.id === "wf-mod:voltaic_strike");

    expect(voltaicContrib).toBeDefined();
    expect(shockingContrib).toBeDefined();
    expect(shockingContrib!.burstMarginalPct).toBeGreaterThan(0);
    expect(voltaicContrib!.burstMarginalPct).toBeGreaterThan(0);

    // Diminishing returns: Shocking Touch is worth less with Voltaic already present than alone.
    const shockingAlone = computeDpsContributions({
      baseWeapon: testMelee,
      modSlots,
      allMods: modsMap,
      simParams: sim,
    }).find((c) => c.label === shocking.name);
    expect(shockingAlone).toBeDefined();
    expect(shockingContrib!.burstMarginalPct).toBeLessThan(shockingAlone!.burstMarginalPct);
  });

  it("shows crit chance mod gains more marginal value with Tenacious Bond active", () => {
    const sim: SimulationParams = { ...DEFAULT_SIM_PARAMS, applyTenaciousBondCrit: true };
    const critMod = modsMap.get("point_strike_r3")!;
    const modSlots: ModSlot[] = [{ modId: critMod.id, rank: 5, slotIndex: 0 }];

    const withoutBond = computeDpsContributions({
      baseWeapon: testRifle,
      modSlots,
      allMods: modsMap,
      simParams: sim,
    });
    const bondBuffs = resolveWeaponExternalBuffs(testRifle, {
      companionModSlots: [{ modId: "tenacious_bond", rank: 5, slotIndex: 0 }],
      companionWeaponCritChance: 0.6,
      allMods: modsMap,
    }, sim);
    const withBond = computeDpsContributions({
      baseWeapon: testRifle,
      modSlots,
      allMods: modsMap,
      simParams: sim,
      calcOptions: { externalBuffs: bondBuffs },
    });

    const critWithout = withoutBond.find((c) => c.label === critMod.name)!.burstMarginalPct;
    const critWith = withBond.find((c) => c.label === critMod.name)!.burstMarginalPct;

    expect(critWith).toBeGreaterThan(critWithout);
  });

  it("applies Redline full-battery fire rate × Duration (melee uses attack speed)", () => {
    const redline: Ability = {
      name: "Redline",
      energyCost: 100,
      description: "",
      miscStats: { fireRateBuff: 0.75, attackSpeedBuff: 0.4 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Redline"],
    };
    const stats = { ...wfStats, abilityDuration: 1.5 };
    const gunBuffs = resolveWeaponExternalBuffs(
      testRifle,
      { warframeId: "gauss", warframeStats: stats, warframeAbilities: [redline] },
      sim,
    );
    expect(gunBuffs[0]!.fireRateBonus).toBeCloseTo(0.75 * 1.5, 5);
    expect(weaponDamageBuffAbilities([redline]).map((a) => a.name)).toContain("Redline");

    const meleeBuffs = resolveWeaponExternalBuffs(
      testMelee,
      { warframeId: "gauss", warframeStats: stats, warframeAbilities: [redline] },
      sim,
    );
    expect(meleeBuffs[0]!.fireRateBonus).toBeCloseTo(0.4 * 1.5, 5);
  });

  it("applies Cathode Grace weapon crit chance additively × Strength", () => {
    const grace: Ability = {
      name: "Cathode Grace",
      energyCost: 75,
      description: "",
      miscStats: { criticalChanceBonus: 0.5 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Cathode Grace"],
    };
    const buffs = resolveWeaponExternalBuffs(
      testRifle,
      { warframeId: "gyre", warframeStats: wfStats, warframeAbilities: [grace] },
      sim,
    );
    expect(buffs[0]!.critChanceBonus).toBeCloseTo(0.5 * 1.3, 5);
    expect(weaponDamageBuffAbilities([grace]).map((a) => a.name)).toContain("Cathode Grace");

    const withBuff = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim, {
      externalBuffs: buffs,
    });
    const bare = calculateWeaponBuild(testRifle, [], new Map(), undefined, sim);
    expect(withBuff.criticalChance).toBeCloseTo(bare.criticalChance * (1 + 0.5 * 1.3), 5);
  });

  it("applies Wrathful Advance as flat final melee crit chance × Strength (guns ignore)", () => {
    const wrath: Ability = {
      name: "Wrathful Advance",
      energyCost: 25,
      description: "",
      miscStats: { criticalChanceBonus: 2 },
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Wrathful Advance"],
    };
    const gunBuffs = resolveWeaponExternalBuffs(
      testRifle,
      { warframeId: "kullervo", warframeStats: wfStats, warframeAbilities: [wrath] },
      sim,
    );
    expect(gunBuffs).toHaveLength(0);

    const meleeBuffs = resolveWeaponExternalBuffs(
      testMelee,
      { warframeId: "kullervo", warframeStats: wfStats, warframeAbilities: [wrath] },
      sim,
    );
    expect(meleeBuffs[0]!.critChanceFlatBonus).toBeCloseTo(2 * 1.3, 5);
    expect(weaponDamageBuffAbilities([wrath]).map((a) => a.name)).toContain("Wrathful Advance");

    const withBuff = calculateWeaponBuild(testMelee, [], new Map(), undefined, sim, {
      externalBuffs: meleeBuffs,
    });
    const bare = calculateWeaponBuild(testMelee, [], new Map(), undefined, sim);
    expect(withBuff.criticalChance).toBeCloseTo(bare.criticalChance + 2 * 1.3, 5);
  });
});
