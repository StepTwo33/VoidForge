import { describe, expect, it } from "vitest";
import {
  computeArmorScaledPool,
  computeMassVitrifyAbsorbFloor,
  computeMassVitrifyEnemyAbsorb,
  computeMassVitrifySegmentHealth,
  getArmorPoolInvulnAbsorb,
  scaleAbilityMiscStats,
  scaledAbilityEnergyCost,
  computeInfernoRingDps,
  computeImmolationDrAtHeat,
  computeFireBlastArmorStripAtHeat,
  computeFireballHeatDamage,
  computeFireballComboMultiplier,
  computeKineticPlatingDrAtBattery,
  computeRedlineBuffAtBattery,
  computeGaussPassiveShieldRecharge,
  computeGaussPassiveRechargeDelayReduction,
  computeThermalSunderRedlineArmorStrip,
  computeThuribleEnergyPerKill,
  computeMetamorphosisBonusAtTime,
  computeCovenantCritChance,
  computeBaruukRestraintDr,
  computeVirulenceDamage,
  computeValkyrRageMeleeBonus,
  valkyrRageDeathPreventionActive,
  computeEmberPassiveAbilityStrength,
  computeGarudaPassiveDamageBonus,
  computeFrostPassiveArmor,
  computeCyte09PracticedAimCritChance,
  computeGrendelPassiveArmor,
  computeCalibanAdaptiveArmorDr,
  computeProteaPassiveStrengthBonus,
  computeStyanaxHopliteCritChance,
  computeYareliCriticalFlowCritChance,
  computeZephyrAirborneCritChance,
  computeXakuPassiveEvasion,
  computeVoltStaticDischargeDamage,
  computeTrinityLifegiverBonusHealth,
  computeMesaPassiveBonuses,
  computeQorvexPassivePunchThrough,
  computeExcaliburSwordsmanshipBonuses,
  computeSarynPassiveStatusDurationMultiplier,
  computeKullervoMeleePassiveBonuses,
  computeVaubanIncapacitatedDamageBonus,
  computeAshSlashPassiveBonuses,
  computeHydroidCorrosiveArmorStrip,
  computeDanteChroniclersMarkStatusChance,
  computeDagathAbundantAbyss,
  computeEquinoxOrbConversion,
  computeRevenantShieldDepletionPulse,
  computeRevenantShieldPulseDamageAtDistance,
  computeOctaviaInspirationPassive,
  computeOctaviaInspirationEnergyRemaining,
  computeNekrosDeathHealPassive,
  computeNekrosDeathHealTotal,
  computeNovaPassiveOrbChances,
  computeNovaPassiveExpectedOrbs,
  computeIvaraEnemyRadarRange,
  DEFAULT_ENEMY_RADAR_M,
  computeNezhaSlidePassiveBonuses,
  computeMirageParkourPassiveBonuses,
  computeLokiWallLatchPassive,
  DEFAULT_WALL_LATCH_SEC,
  computeLavosValenceBlockPassive,
  computeLavosValenceBlockRemaining,
  computeKhoraVenariPassive,
  computeOberonRighteousNegationPassive,
  computeOberonRighteousNegationStacks,
  computeJadeJudgmentPassive,
  computeJadeJudgmentRemaining,
  computeJadeJudgmentDamageMultiplier,
  computeTempleBackbeatEfficiencyBonus,
  computeOraxiaPredatorsLurkPassive,
  computeOraxiaPredatorsLurkRemaining,
  computeRhinoHardLandingPulse,
  computeRhinoHardLandingDamageAtDistance,
  computeGaraPassiveBlind,
  computeGaraPassiveBlindChance,
  computeLimboRiftPassive,
  computeLimboRiftEnergyGained,
  computeMagVacuumPassive,
  computeKoumeiFatePassive,
  computeKoumeiFateRemaining,
  computeBansheeSilencePassive,
  computeAtlasKnockdownPassive,
  computeNyxPsychicCritChance,
  computeHarrowPassive,
  computeGyreAbilityCritChance,
  computeCitrineGeoluminesence,
  computeChromaDragonFlightPassive,
  computeChromaElementCycle,
  computeTitaniaUpsurgePassive,
  computeTitaniaUpsurgeRemaining,
  computeHildrynShieldGatePassive,
  computeNidusUndyingPassive,
  computeSiriusOrionPassive,
  computeSiriusOrionEfficiencyCastsRemaining,
  computeWispAirborneInvisPassive,
  computeFollieInkblotPassive,
  computeFollieInkblotExpected,
  computeSevagothTombstonePassive,
  computeSevagothTombstoneSoulsRemaining,
  computeInarosPassive,
  computeInarosFinisherHeal,
  computeNokkoVitalDecayPassive,
  computeNokkoVitalDecayRemaining,
  computeWukongFiveTechniquesPassive,
  computeVorunaWolvesPassive,
  computeVorunaUlfrunCooldownRemaining,
  computeUrielLegionPassive,
  computeUrielDemonResurrectRemaining,
  lerpBatteryValue,
  lerpBatteryMaxStat,
} from "@/lib/codex/ability-misc-stats";

describe("computeArmorScaledPool", () => {
  // wiki Iron Skin: (1200 + (2.5 × 240 × 2)) × 1.3 = 3120
  it("matches wiki Iron Skin Overguard before absorb", () => {
    expect(computeArmorScaledPool(1200, 2.5, 480, 1.3)).toBe(3120);
  });
  // wiki Iron Skin: initial + absorbed (absorb outside STR)
  it("adds Iron Skin invuln absorb outside Strength", () => {
    expect(
      computeArmorScaledPool(1200, 2.5, 480, 1.3, {
        absorbedDamage: 5000,
        absorbMode: "additive",
      }),
    ).toBe(8120);
  });
  // wiki Snow Globe: {3500 + 5 × [300 × (1 + 1)]} × 1.3 = 8450
  it("matches wiki Snow Globe health before absorb", () => {
    expect(computeArmorScaledPool(3500, 5, 600, 1.3)).toBe(8450);
  });
  // wiki Mass Vitrify segment: (1600 + 5 × (160 × 2)) × 1.3 = 4160
  it("matches wiki Mass Vitrify segment health before absorb", () => {
    expect(computeArmorScaledPool(1600, 5, 320, 1.3)).toBe(4160);
  });

  // wiki: floor/enemy (320 + 5×320)×1.3 = 2496; segment +1 enemy = 6656
  it("matches wiki Mass Vitrify crystallized-enemy absorb", () => {
    expect(computeMassVitrifyAbsorbFloor(320, 1.3)).toBe(2496);
    expect(computeMassVitrifyEnemyAbsorb(320, 1.3, 0)).toBe(2496);
    expect(computeMassVitrifyEnemyAbsorb(320, 1.3, 30_000)).toBe(3000); // max path
    expect(computeMassVitrifySegmentHealth(1600, 5, 320, 1.3, 0)).toBe(4160);
    expect(computeMassVitrifySegmentHealth(1600, 5, 320, 1.3, 1)).toBe(6656);
    expect(computeMassVitrifySegmentHealth(1600, 5, 320, 1.3, 1, 30_000)).toBe(7160);
  });
  // wiki Shield Maiden: (2000 + (2.5 × 480)) × 1.6 = 7040
  it("matches wiki Shield Maiden health before absorb", () => {
    expect(computeArmorScaledPool(2000, 2.5, 960, 1.6)).toBe(7040);
  });
  // wiki Warding Halo: (base + armorMult×armor + absorbed×2.5) × STR
  it("folds Warding Halo absorb inside Strength with absorb Mult", () => {
    // pre-absorb wiki sample shape: (1000 + 2.5×870) × 1.3 — use round numbers
    // (1000 + 2.5×400 + 2000×2.5) × 1.3 = (1000 + 1000 + 5000) × 1.3 = 9100
    expect(
      computeArmorScaledPool(1000, 2.5, 400, 1.3, {
        absorbedDamage: 2000,
        absorbMode: "inside_strength",
        absorptionMultiplier: 2.5,
      }),
    ).toBe(9100);
  });
  // wiki Storm Shroud: no armor — (base + absorbed × absorbMult) × STR
  it("matches Storm Shroud pool with invuln absorb inside Strength", () => {
    expect(computeArmorScaledPool(1200, 0, 0, 1.3)).toBe(1560);
    expect(
      computeArmorScaledPool(1200, 0, 0, 1.3, {
        absorbedDamage: 1000,
        absorbMode: "inside_strength",
        absorptionMultiplier: 2,
      }),
    ).toBe(4160); // (1200 + 2000) × 1.3
  });
});

describe("getArmorPoolInvulnAbsorb", () => {
  it("maps additive pools and Halo/Shroud inside_strength absorb Mult", () => {
    expect(getArmorPoolInvulnAbsorb("Iron Skin")).toEqual({
      mode: "additive",
      absorptionMultiplier: 1,
    });
    expect(getArmorPoolInvulnAbsorb("Snow Globe")).toEqual({
      mode: "additive",
      absorptionMultiplier: 1,
    });
    expect(getArmorPoolInvulnAbsorb("Tectonics")).toEqual({
      mode: "additive",
      absorptionMultiplier: 1,
    });
    expect(getArmorPoolInvulnAbsorb("Shield Maiden")).toEqual({
      mode: "additive",
      absorptionMultiplier: 1,
    });
    expect(getArmorPoolInvulnAbsorb("Warding Halo", { absorptionMultiplier: 2.5 })).toEqual({
      mode: "inside_strength",
      absorptionMultiplier: 2.5,
    });
    expect(getArmorPoolInvulnAbsorb("Storm Shroud", { absorptionMultiplier: 2 })).toEqual({
      mode: "inside_strength",
      absorptionMultiplier: 2,
    });
    expect(getArmorPoolInvulnAbsorb("Mass Vitrify")).toBeNull();
  });
});

describe("Fire Blast heat energy lerp", () => {
  it("lerps cast cost from 75 to 25 then applies Efficiency", () => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    expect(scaledAbilityEnergyCost(lerp(75, 25, 0), 1.3)).toBe(52.5);
    expect(scaledAbilityEnergyCost(lerp(75, 25, 1), 1.3)).toBe(17.5);
    expect(scaledAbilityEnergyCost(lerp(75, 25, 0.5), 1)).toBe(50);
  });
});

describe("Ember Immolation heat formulas", () => {
  it("Inferno ring DPS doubles at max heat then × STR", () => {
    expect(computeInfernoRingDps(350, 0, 1)).toBe(350);
    expect(computeInfernoRingDps(350, 1, 1)).toBe(700);
    expect(computeInfernoRingDps(350, 1, 1.3)).toBe(910);
    expect(computeInfernoRingDps(350, 0.5, 1)).toBe(525);
  });

  // wiki Immolation example at 75% heat, 130% STR → 80% DR
  it("matches wiki Immolation DR at 75% heat with Intensify", () => {
    expect(computeImmolationDrAtHeat(0.75, 1.3)).toBeCloseTo(0.8, 5);
    expect(computeImmolationDrAtHeat(0, 1.3)).toBeCloseTo(0.5, 5); // initial cap
    expect(computeImmolationDrAtHeat(1, 1.3)).toBeCloseTo(0.9, 5); // max cap
  });

  it("Fire Blast strip lerps 50–100% with heat and caps at heat value", () => {
    expect(computeFireBlastArmorStripAtHeat(0, 1)).toBe(0.5);
    expect(computeFireBlastArmorStripAtHeat(1, 1)).toBe(1);
    expect(computeFireBlastArmorStripAtHeat(1, 1.3)).toBe(1); // STR above 100% no extra
    expect(computeFireBlastArmorStripAtHeat(0, 1.3)).toBe(0.5);
    expect(computeFireBlastArmorStripAtHeat(0.5, 0.7)).toBeCloseTo(0.75 * 0.7, 5);
  });

  it("Fireball first-cast is ×3 at max heat then × STR", () => {
    expect(computeFireballHeatDamage(800, 0, 1)).toBe(800);
    expect(computeFireballHeatDamage(800, 1, 1)).toBe(2400);
    expect(computeFireballHeatDamage(300, 1, 1)).toBe(900);
    expect(computeFireballHeatDamage(800, 1, 1.3)).toBe(3120);
  });

  // wiki: combo 1/2/4/8 + 4×heat; dmg = 400×(combo+1) / 150×(combo+1)
  it("Fireball combo×heat matches wiki chain goldens", () => {
    expect(computeFireballComboMultiplier(0, 0)).toBe(1);
    expect(computeFireballComboMultiplier(1, 0)).toBe(2);
    expect(computeFireballComboMultiplier(2, 0)).toBe(4);
    expect(computeFireballComboMultiplier(3, 0)).toBe(8);
    expect(computeFireballComboMultiplier(0, 1)).toBe(5);
    expect(computeFireballComboMultiplier(1, 1)).toBe(6);
    expect(computeFireballComboMultiplier(2, 1)).toBe(8);
    expect(computeFireballComboMultiplier(3, 1)).toBe(12);
    expect(computeFireballComboMultiplier(0, 0.75)).toBe(4); // 1 + 3
    // max combo, 0 heat → 3600 / 1350
    expect(computeFireballHeatDamage(800, 0, 1, 3)).toBe(3600);
    expect(computeFireballHeatDamage(300, 0, 1, 3)).toBe(1350);
    // max combo + max heat → 5200 / 1950
    expect(computeFireballHeatDamage(800, 1, 1, 3)).toBe(5200);
    expect(computeFireballHeatDamage(300, 1, 1, 3)).toBe(1950);
    expect(computeFireballHeatDamage(800, 1, 1.3, 3)).toBe(6760);
  });
});

describe("Gauss battery formulas", () => {
  // wiki Kinetic Plating: 20% + (100%−20%)×80% = 84% at 100% STR
  it("matches wiki Kinetic Plating DR at 80% battery", () => {
    expect(computeKineticPlatingDrAtBattery(0.8, 1)).toBeCloseTo(0.84, 5);
    expect(computeKineticPlatingDrAtBattery(0, 1)).toBeCloseTo(0.2, 5);
    expect(computeKineticPlatingDrAtBattery(1, 1)).toBeCloseTo(1, 5);
    expect(computeKineticPlatingDrAtBattery(0, 1.3)).toBeCloseTo(0.26, 5); // 20%×1.3 < 50% cap
    expect(computeKineticPlatingDrAtBattery(1, 1.3)).toBeCloseTo(1, 5); // full cap 100%
  });

  it("lerps Thermal Sunder damage/status with battery (min = max/5)", () => {
    expect(lerpBatteryMaxStat(750, 0)).toBe(150);
    expect(lerpBatteryMaxStat(750, 1)).toBe(750);
    expect(lerpBatteryMaxStat(1500, 0.8)).toBeCloseTo(1260, 5);
    expect(lerpBatteryValue(4, 8, 0.8)).toBeCloseTo(7.2, 5);
  });

  // wiki: 75% FR at full battery × 127.5% DUR → 95.625%
  it("Redline buffs lerp with battery then × Duration", () => {
    expect(computeRedlineBuffAtBattery(0.75, 0, 1)).toBeCloseTo(0.15, 5);
    expect(computeRedlineBuffAtBattery(0.75, 1, 1)).toBeCloseTo(0.75, 5);
    expect(computeRedlineBuffAtBattery(0.75, 1, 1.275)).toBeCloseTo(0.95625, 5);
    expect(computeRedlineBuffAtBattery(0.4, 0.8, 1)).toBeCloseTo(0.336, 5);
  });

  // wiki: 80% battery → 96% recharge / 64% delay (linear; not × STR)
  it("matches wiki Gauss passive shield recharge at battery", () => {
    expect(computeGaussPassiveShieldRecharge(0)).toBe(0);
    expect(computeGaussPassiveRechargeDelayReduction(0)).toBe(0);
    expect(computeGaussPassiveShieldRecharge(0.8)).toBeCloseTo(0.96, 5);
    expect(computeGaussPassiveRechargeDelayReduction(0.8)).toBeCloseTo(0.64, 5);
    expect(computeGaussPassiveShieldRecharge(1)).toBeCloseTo(1.2, 5);
    expect(computeGaussPassiveRechargeDelayReduction(1)).toBeCloseTo(0.8, 5);
  });

  // wiki: 0% strip at ≤80% battery → 100% at full (Redline Blast combo)
  it("Thermal Sunder Redline armor strip ramps 80→100% battery", () => {
    expect(computeThermalSunderRedlineArmorStrip(0)).toBe(0);
    expect(computeThermalSunderRedlineArmorStrip(0.8)).toBe(0);
    expect(computeThermalSunderRedlineArmorStrip(0.9)).toBeCloseTo(0.5, 5);
    expect(computeThermalSunderRedlineArmorStrip(1)).toBe(1);
  });
});

describe("Thurible energy per kill", () => {
  // wiki: 25 channeled, 130% EFF, 130% STR → ≈7.964 body / ≈31.857 headshot
  it("matches wiki Thurible EPK at 25 energy / 130% EFF / 130% STR", () => {
    const epk = computeThuribleEnergyPerKill(25, 1.3, 1.3);
    expect(epk.body).toBeCloseTo(7.964285714, 5);
    expect(epk.headshot).toBeCloseTo(31.857142857, 5);
  });

  it("gives 1 energy at zero channel", () => {
    expect(computeThuribleEnergyPerKill(0, 1, 1).body).toBe(1);
    expect(computeThuribleEnergyPerKill(0, 1.3, 1.3).headshot).toBe(4);
  });
});

describe("Metamorphosis linear decay", () => {
  // wiki: peak × STR, linear to 0 over D (DUR-scaled)
  it("decays Night/Day bonuses linearly over duration", () => {
    expect(computeMetamorphosisBonusAtTime(250, 1.3, 0, 25)).toBe(325);
    expect(computeMetamorphosisBonusAtTime(250, 1.3, 12.5, 25)).toBe(162.5);
    expect(computeMetamorphosisBonusAtTime(250, 1.3, 25, 25)).toBe(0);
    expect(computeMetamorphosisBonusAtTime(150, 1.3, 12.5, 25)).toBe(97.5);
    expect(computeMetamorphosisBonusAtTime(0.25, 1.3, 0, 25)).toBeCloseTo(0.325, 5);
    expect(computeMetamorphosisBonusAtTime(0.15, 1.3, 12.5, 25)).toBeCloseTo(0.0975, 5);
    expect(computeMetamorphosisBonusAtTime(250, 1.3, 12.5, 50)).toBe(243.75); // 200% DUR
  });
});

describe("Covenant Retaliation crit chance", () => {
  it("matches wiki base / absorb / caps", () => {
    const z = computeCovenantCritChance(0, 1);
    expect(z.body).toBeCloseTo(0.05, 5);
    expect(z.headshot).toBeCloseTo(0.2, 5);

    const cap = computeCovenantCritChance(3000, 1);
    expect(cap.body).toBeCloseTo(0.5, 5);
    expect(cap.headshot).toBeCloseTo(2, 5);

    const mid = computeCovenantCritChance(2000, 1.3);
    expect(mid.body).toBeCloseTo(0.455, 5);
    expect(mid.headshot).toBeCloseTo(1.82, 5);

    const baseStr = computeCovenantCritChance(0, 1.3);
    expect(baseStr.body).toBeCloseTo(0.065, 5);
    expect(baseStr.headshot).toBeCloseTo(0.26, 5);
  });
});

describe("Baruuk Restraint passive DR", () => {
  it("scales linearly to 50% at full erosion", () => {
    expect(computeBaruukRestraintDr(0)).toBe(0);
    expect(computeBaruukRestraintDr(0.5)).toBeCloseTo(0.25, 5);
    expect(computeBaruukRestraintDr(1)).toBeCloseTo(0.5, 5);
  });
});

describe("Virulence Mutation stacks", () => {
  // wiki: 200 × (1+0.15+0.3) × (1+100) = 29,290
  it("matches wiki amplified damage with stacks", () => {
    expect(computeVirulenceDamage(200, 1, 0)).toBe(200);
    expect(computeVirulenceDamage(200, 1, 100)).toBe(20200);
    expect(computeVirulenceDamage(200, 1.3, 100)).toBe(26260);
    expect(computeVirulenceDamage(200, 1.45, 100)).toBe(29290);
    expect(computeVirulenceDamage(100, 1.45, 100)).toBe(14645); // field DPS base
  });
});

describe("Valkyr Rage passive", () => {
  it("melee bonus tracks Rage % up to 300; death prevention at 150+", () => {
    expect(computeValkyrRageMeleeBonus(0)).toBe(0);
    expect(computeValkyrRageMeleeBonus(150)).toBe(1.5);
    expect(computeValkyrRageMeleeBonus(300)).toBe(3);
    expect(computeValkyrRageMeleeBonus(400)).toBe(3);
    expect(valkyrRageDeathPreventionActive(149)).toBe(false);
    expect(valkyrRageDeathPreventionActive(150)).toBe(true);
    expect(valkyrRageDeathPreventionActive(300)).toBe(true);
  });
});

describe("Ember Heat-enemy passive STR", () => {
  it("grants +5% Ability Strength per Heat-status enemy in Affinity Range", () => {
    expect(computeEmberPassiveAbilityStrength(0)).toBe(0);
    expect(computeEmberPassiveAbilityStrength(1)).toBeCloseTo(0.05, 5);
    expect(computeEmberPassiveAbilityStrength(10)).toBeCloseTo(0.5, 5);
    expect(computeEmberPassiveAbilityStrength(3.9)).toBeCloseTo(0.15, 5);
  });
});

describe("Garuda Death's Gate passive", () => {
  it("grants +5% damage per kill up to 100%", () => {
    expect(computeGarudaPassiveDamageBonus(0)).toBe(0);
    expect(computeGarudaPassiveDamageBonus(1)).toBeCloseTo(0.05, 5);
    expect(computeGarudaPassiveDamageBonus(20)).toBeCloseTo(1, 5);
    expect(computeGarudaPassiveDamageBonus(25)).toBeCloseTo(1, 5);
  });
});

describe("Frost Fortifying Freeze passive", () => {
  it("grants +50 Armor per Cold-status enemy", () => {
    expect(computeFrostPassiveArmor(0)).toBe(0);
    expect(computeFrostPassiveArmor(1)).toBe(50);
    expect(computeFrostPassiveArmor(5)).toBe(250);
    expect(computeFrostPassiveArmor(2.9)).toBe(100);
  });
});

describe("Cyte-09 Practiced Aim passive", () => {
  it("grants +1% WP crit chance per kill up to 300%", () => {
    expect(computeCyte09PracticedAimCritChance(0)).toBe(0);
    expect(computeCyte09PracticedAimCritChance(1)).toBeCloseTo(0.01, 5);
    expect(computeCyte09PracticedAimCritChance(150)).toBeCloseTo(1.5, 5);
    expect(computeCyte09PracticedAimCritChance(300)).toBeCloseTo(3, 5);
    expect(computeCyte09PracticedAimCritChance(400)).toBeCloseTo(3, 5);
  });
});

describe("Grendel belly armor passive", () => {
  it("grants +250 Armor per gut enemy up to 5 (+1250)", () => {
    expect(computeGrendelPassiveArmor(0)).toBe(0);
    expect(computeGrendelPassiveArmor(1)).toBe(250);
    expect(computeGrendelPassiveArmor(5)).toBe(1250);
    expect(computeGrendelPassiveArmor(8)).toBe(1250);
    // Catgut max-rank path: 400/enemy → 2000 at cap
    expect(computeGrendelPassiveArmor(5, { armorPerEnemy: 400 })).toBe(2000);
  });
});

describe("Caliban Adaptive Armor passive", () => {
  it("grants +5% typed DR per hit up to 50%", () => {
    expect(computeCalibanAdaptiveArmorDr(0)).toBe(0);
    expect(computeCalibanAdaptiveArmorDr(1)).toBeCloseTo(0.05, 5);
    expect(computeCalibanAdaptiveArmorDr(10)).toBeCloseTo(0.5, 5);
    expect(computeCalibanAdaptiveArmorDr(20)).toBeCloseTo(0.5, 5);
  });
});

describe("Protea 4th-cast Strength passive", () => {
  it("grants +100% STR when power recorder is full (3 bars)", () => {
    expect(computeProteaPassiveStrengthBonus(0)).toBe(0);
    expect(computeProteaPassiveStrengthBonus(2)).toBe(0);
    expect(computeProteaPassiveStrengthBonus(3)).toBe(1);
    expect(computeProteaPassiveStrengthBonus(4)).toBe(1);
  });
});

describe("Styanax Hoplite passive", () => {
  it("grants +1% CC per 40 shields; doubles with Speargun", () => {
    expect(computeStyanaxHopliteCritChance(0)).toBe(0);
    expect(computeStyanaxHopliteCritChance(39)).toBe(0);
    expect(computeStyanaxHopliteCritChance(40)).toBeCloseTo(0.01, 5);
    expect(computeStyanaxHopliteCritChance(825)).toBeCloseTo(0.2, 5); // floor(825/40)=20
    expect(computeStyanaxHopliteCritChance(825, { speargun: true })).toBeCloseTo(0.4, 5);
    expect(computeStyanaxHopliteCritChance(1200, { speargun: true })).toBeCloseTo(0.6, 5);
  });
});

describe("Yareli Critical Flow passive", () => {
  it("grants +200% secondary CC while moving", () => {
    expect(computeYareliCriticalFlowCritChance(false)).toBe(0);
    expect(computeYareliCriticalFlowCritChance(true)).toBe(2);
  });
});

describe("Zephyr airborne crit passive", () => {
  it("grants +150% weapon CC while airborne", () => {
    expect(computeZephyrAirborneCritChance(false)).toBe(0);
    expect(computeZephyrAirborneCritChance(true)).toBeCloseTo(1.5, 5);
  });
});

describe("Xaku dodge / AoE DR passive", () => {
  it("is 25%/25% baseline and 75%/75% during Vast Untime", () => {
    expect(computeXakuPassiveEvasion(false)).toEqual({
      dodgeChance: 0.25,
      aoeDamageReduction: 0.25,
    });
    expect(computeXakuPassiveEvasion(true)).toEqual({
      dodgeChance: 0.75,
      aoeDamageReduction: 0.75,
    });
  });
});

describe("Volt Static Discharge passive", () => {
  it("builds 10 Electricity per meter up to 1000", () => {
    expect(computeVoltStaticDischargeDamage(0)).toBe(0);
    expect(computeVoltStaticDischargeDamage(10)).toBe(100);
    expect(computeVoltStaticDischargeDamage(100)).toBe(1000);
    expect(computeVoltStaticDischargeDamage(150)).toBe(1000);
  });
});

describe("Trinity Lifegiver passive", () => {
  it("grants allies Health equal to 50% of max Energy", () => {
    expect(computeTrinityLifegiverBonusHealth(175)).toBe(87.5);
    expect(computeTrinityLifegiverBonusHealth(350)).toBe(175);
    expect(computeTrinityLifegiverBonusHealth(0)).toBe(0);
  });
});

describe("Mesa sidearm / health passive", () => {
  it("applies dual FR, single reload, and no-melee health", () => {
    expect(computeMesaPassiveBonuses({ sidearmStyle: "dual", meleeEquipped: true })).toEqual({
      fireRateBonus: 0.15,
      reloadSpeedBonus: 0,
      bonusHealth: 0,
    });
    expect(computeMesaPassiveBonuses({ sidearmStyle: "single", meleeEquipped: false })).toEqual({
      fireRateBonus: 0,
      reloadSpeedBonus: 0.25,
      bonusHealth: 50,
    });
    expect(computeMesaPassiveBonuses({ sidearmStyle: "none", meleeEquipped: false })).toEqual({
      fireRateBonus: 0,
      reloadSpeedBonus: 0,
      bonusHealth: 50,
    });
  });
});

describe("Qorvex Core Exposure passive", () => {
  it("grants +3 Punch Through", () => {
    expect(computeQorvexPassivePunchThrough()).toBe(3);
  });
});

describe("Excalibur Swordsmanship passive", () => {
  it("grants +10% damage and attack speed with swords", () => {
    expect(computeExcaliburSwordsmanshipBonuses(false)).toEqual({
      damageBonus: 0,
      attackSpeedBonus: 0,
    });
    expect(computeExcaliburSwordsmanshipBonuses(true)).toEqual({
      damageBonus: 0.1,
      attackSpeedBonus: 0.1,
    });
  });
});

describe("Saryn status duration passive", () => {
  it("multiplies status duration by 1.25", () => {
    expect(computeSarynPassiveStatusDurationMultiplier()).toBe(1.25);
  });
});

describe("Kullervo melee passive", () => {
  it("grants +75% HAE and +100% Heavy Wind Up", () => {
    expect(computeKullervoMeleePassiveBonuses()).toEqual({
      heavyAttackEfficiency: 0.75,
      heavyAttackWindUpSpeed: 1,
    });
  });
});

describe("Vauban incapacitated damage passive", () => {
  it("grants +25% multiplicative damage vs incapacitated", () => {
    expect(computeVaubanIncapacitatedDamageBonus(false)).toBe(0);
    expect(computeVaubanIncapacitatedDamageBonus(true)).toBeCloseTo(0.25, 5);
  });
});

describe("Ash Slash status passive", () => {
  it("grants +25% Slash status damage and +50% duration", () => {
    expect(computeAshSlashPassiveBonuses()).toEqual({
      statusDamageBonus: 0.25,
      statusDurationBonus: 0.5,
    });
  });
});

describe("Hydroid Corrosive armor strip passive", () => {
  it("raises first/full Corrosive strip to 50%/100% when marked", () => {
    expect(computeHydroidCorrosiveArmorStrip(false)).toEqual({
      firstStackStrip: 0.26,
      fullStackStrip: 0.8,
    });
    expect(computeHydroidCorrosiveArmorStrip(true)).toEqual({
      firstStackStrip: 0.5,
      fullStackStrip: 1,
    });
  });
});

describe("Dante Chronicler's Mark passive", () => {
  it("multiplies status chance by 1.5 on fully scanned targets", () => {
    expect(computeDanteChroniclersMarkStatusChance(0.4, false)).toBeCloseTo(0.4, 5);
    expect(computeDanteChroniclersMarkStatusChance(0.4, true)).toBeCloseTo(0.6, 5);
    expect(computeDanteChroniclersMarkStatusChance(0, true)).toBe(0);
  });
});

describe("Dagath Abundant Abyss passive", () => {
  it("has 35% chance of ×4 orb yield; expected ≈2.05×", () => {
    const avg = computeDagathAbundantAbyss(25);
    expect(avg.procChance).toBeCloseTo(0.35, 5);
    expect(avg.procYieldMultiplier).toBe(4);
    expect(avg.expectedYieldMultiplier).toBeCloseTo(2.05, 5);
    expect(avg.effectiveValue).toBeCloseTo(51.25, 5);
    expect(computeDagathAbundantAbyss(25, { forceProc: true }).effectiveValue).toBe(100);
    expect(computeDagathAbundantAbyss(25, { forceProc: false }).effectiveValue).toBe(25);
  });
});

describe("Equinox orb conversion passive", () => {
  it("converts 10% of Health orbs to Energy and Energy orbs to Health", () => {
    expect(computeEquinoxOrbConversion(50, "health")).toEqual({
      primaryAmount: 50,
      convertedAmount: 5,
      convertedResource: "energy",
    });
    expect(computeEquinoxOrbConversion(25, "energy")).toEqual({
      primaryAmount: 25,
      convertedAmount: 2.5,
      convertedResource: "health",
    });
  });
});

describe("Revenant shield-depletion pulse", () => {
  it("is 100 damage / 7.5m with 75% edge falloff", () => {
    expect(computeRevenantShieldDepletionPulse()).toEqual({
      damage: 100,
      radius: 7.5,
      maxFalloff: 0.75,
    });
    expect(computeRevenantShieldPulseDamageAtDistance(0)).toBe(100);
    expect(computeRevenantShieldPulseDamageAtDistance(1)).toBeCloseTo(25, 5);
    expect(computeRevenantShieldPulseDamageAtDistance(0.5)).toBeCloseTo(62.5, 5);
  });
});

describe("Octavia Inspiration passive", () => {
  it("restores 1 energy/s for 30s within 15m (30 total)", () => {
    expect(computeOctaviaInspirationPassive()).toEqual({
      energyPerSecond: 1,
      durationSec: 30,
      radiusM: 15,
      totalEnergy: 30,
    });
    expect(computeOctaviaInspirationEnergyRemaining(0)).toBe(30);
    expect(computeOctaviaInspirationEnergyRemaining(10)).toBe(20);
    expect(computeOctaviaInspirationEnergyRemaining(30)).toBe(0);
    expect(computeOctaviaInspirationEnergyRemaining(40)).toBe(0);
  });
});

describe("Nekros death heal passive", () => {
  it("restores 5 Health per death within 10m", () => {
    expect(computeNekrosDeathHealPassive()).toEqual({ healthPerDeath: 5, radiusM: 10 });
    expect(computeNekrosDeathHealTotal(0)).toBe(0);
    expect(computeNekrosDeathHealTotal(3)).toBe(15);
    expect(computeNekrosDeathHealTotal(10)).toBe(50);
  });
});

describe("Nova Molecular Prime orb passive", () => {
  it("grants 15% Health orb while slowed and 15% Energy orb while sped", () => {
    expect(computeNovaPassiveOrbChances("none")).toEqual({
      healthOrbChance: 0,
      energyOrbChance: 0,
    });
    expect(computeNovaPassiveOrbChances("slowed")).toEqual({
      healthOrbChance: 0.15,
      energyOrbChance: 0,
    });
    expect(computeNovaPassiveOrbChances("sped")).toEqual({
      healthOrbChance: 0,
      energyOrbChance: 0.15,
    });
    expect(computeNovaPassiveExpectedOrbs(20, "slowed")).toEqual({
      expectedHealthOrbs: 3,
      expectedEnergyOrbs: 0,
    });
    expect(computeNovaPassiveExpectedOrbs(20, "sped")).toEqual({
      expectedHealthOrbs: 0,
      expectedEnergyOrbs: 3,
    });
  });
});

describe("Ivara enemy radar passive", () => {
  it("is 50m base and stacks with extra radar", () => {
    expect(DEFAULT_ENEMY_RADAR_M).toBe(30);
    expect(computeIvaraEnemyRadarRange()).toBe(50);
    expect(computeIvaraEnemyRadarRange(30)).toBe(80);
  });
});

describe("Nezha slide passive", () => {
  it("grants +60% slide speed and +35% slide distance", () => {
    expect(computeNezhaSlidePassiveBonuses()).toEqual({
      slideSpeedBonus: 0.6,
      slideDistanceBonus: 0.35,
    });
  });
});

describe("Mirage parkour passive", () => {
  it("grants +85% slide duration and +50% maneuver speed", () => {
    expect(computeMirageParkourPassiveBonuses()).toEqual({
      slideDurationBonus: 0.85,
      maneuverSpeedBonus: 0.5,
    });
  });
});

describe("Loki wall latch passive", () => {
  it("is 10× default latch (60s)", () => {
    expect(DEFAULT_WALL_LATCH_SEC).toBe(6);
    expect(computeLokiWallLatchPassive()).toEqual({ multiplier: 10, durationSec: 60 });
  });
});

describe("Lavos Valence Block passive", () => {
  it("grants 10s status immunity with 5s orb cooldown", () => {
    expect(computeLavosValenceBlockPassive()).toEqual({
      immunityDurationSec: 10,
      orbPickupCooldownSec: 5,
    });
    expect(computeLavosValenceBlockRemaining(0)).toBe(10);
    expect(computeLavosValenceBlockRemaining(4)).toBe(6);
    expect(computeLavosValenceBlockRemaining(10)).toBe(0);
  });
});

describe("Khora Venari passive", () => {
  it("grants +15% move speed while Venari is alive; 45s respawn", () => {
    expect(computeKhoraVenariPassive(true)).toEqual({ moveSpeedBonus: 0.15, respawnSec: 45 });
    expect(computeKhoraVenariPassive(false)).toEqual({ moveSpeedBonus: 0, respawnSec: 45 });
  });
});

describe("Oberon Righteous Negation passive", () => {
  it("caps at 3 stacks with 0.25s / 0.5s final invuln", () => {
    expect(computeOberonRighteousNegationPassive()).toEqual({
      maxStacks: 3,
      invulnOnConsumeSec: 0.25,
      invulnOnFinalSec: 0.5,
    });
    expect(computeOberonRighteousNegationStacks(0)).toBe(0);
    expect(computeOberonRighteousNegationStacks(2)).toBe(2);
    expect(computeOberonRighteousNegationStacks(5)).toBe(3);
  });
});

describe("Jade Judgment passive", () => {
  it("applies 50% vulnerability for 10s and two Aura slots", () => {
    expect(computeJadeJudgmentPassive()).toEqual({
      damageVulnerability: 0.5,
      durationSec: 10,
      auraSlots: 2,
    });
    expect(computeJadeJudgmentRemaining(0)).toBe(10);
    expect(computeJadeJudgmentRemaining(4)).toBe(6);
    expect(computeJadeJudgmentDamageMultiplier(false)).toBe(1);
    expect(computeJadeJudgmentDamageMultiplier(true)).toBeCloseTo(1.5, 5);
  });
});

describe("Temple Backbeat efficiency", () => {
  it("grants +50% Ability Efficiency on Backbeat casts", () => {
    expect(computeTempleBackbeatEfficiencyBonus(false)).toBe(0);
    expect(computeTempleBackbeatEfficiencyBonus(true)).toBeCloseTo(0.5, 5);
  });
});

describe("Oraxia Predator's Lurk passive", () => {
  it("grants 8s invisibility from wall latch", () => {
    expect(computeOraxiaPredatorsLurkPassive()).toEqual({ invisibilitySec: 8 });
    expect(computeOraxiaPredatorsLurkRemaining(0)).toBe(8);
    expect(computeOraxiaPredatorsLurkRemaining(3)).toBe(5);
    expect(computeOraxiaPredatorsLurkRemaining(8)).toBe(0);
  });
});

describe("Rhino hard-landing pulse", () => {
  it("is 100 damage / 6m with 90% edge falloff", () => {
    expect(computeRhinoHardLandingPulse()).toEqual({
      damage: 100,
      radius: 6,
      maxFalloff: 0.9,
    });
    expect(computeRhinoHardLandingDamageAtDistance(0)).toBe(100);
    expect(computeRhinoHardLandingDamageAtDistance(1)).toBeCloseTo(10, 5);
    expect(computeRhinoHardLandingDamageAtDistance(0.5)).toBeCloseTo(55, 5);
  });
});

describe("Gara radial blind passive", () => {
  it("starts at 15% and gains +20% per missed cast up to 100%", () => {
    expect(computeGaraPassiveBlind()).toEqual({
      baseChance: 0.15,
      chanceIncreasePerMiss: 0.2,
      durationSec: 10,
      radiusM: 12,
    });
    expect(computeGaraPassiveBlindChance(0)).toBeCloseTo(0.15, 5);
    expect(computeGaraPassiveBlindChance(1)).toBeCloseTo(0.35, 5);
    expect(computeGaraPassiveBlindChance(5)).toBe(1);
  });
});

describe("Limbo Rift energy passive", () => {
  it("grants 10 Energy/kill and 2 Energy/s in the Rift", () => {
    expect(computeLimboRiftPassive()).toEqual({
      portalDurationSec: 5,
      energyPerKill: 10,
      energyPerSecondInRift: 2,
      portalBanishDurationSec: 15,
    });
    expect(computeLimboRiftEnergyGained(3, 10)).toBe(50); // 30 + 20
    expect(computeLimboRiftEnergyGained(0, 5)).toBe(10);
  });
});

describe("Mag vacuum passive", () => {
  it("vacuums pickups within 8m", () => {
    expect(computeMagVacuumPassive()).toEqual({ radiusM: 8 });
  });
});

describe("Koumei Fate status passive", () => {
  it("selects a weapon every 60s for 60s of random status", () => {
    expect(computeKoumeiFatePassive()).toEqual({ intervalSec: 60, durationSec: 60 });
    expect(computeKoumeiFateRemaining(0)).toBe(60);
    expect(computeKoumeiFateRemaining(20)).toBe(40);
    expect(computeKoumeiFateRemaining(60)).toBe(0);
  });
});

describe("Banshee silence passive", () => {
  it("marks all equipped weapons as silent", () => {
    expect(computeBansheeSilencePassive()).toEqual({ weaponsSilent: true });
  });
});

describe("Atlas knockdown passive", () => {
  it("grants knockdown immunity only while grounded", () => {
    expect(computeAtlasKnockdownPassive(true)).toEqual({ knockdownImmuneWhileGrounded: true });
    expect(computeAtlasKnockdownPassive(false)).toEqual({ knockdownImmuneWhileGrounded: false });
  });
});

describe("Nyx psychic crit passive", () => {
  it("grants +40% gun CC per Confused enemy up to +200%", () => {
    expect(computeNyxPsychicCritChance(0)).toBe(0);
    expect(computeNyxPsychicCritChance(1)).toBeCloseTo(0.4, 5);
    expect(computeNyxPsychicCritChance(5)).toBeCloseTo(2, 5);
    expect(computeNyxPsychicCritChance(8)).toBeCloseTo(2, 5);
  });
});

describe("Harrow overshield / energy passive", () => {
  it("doubles overshield cap and starts at max energy", () => {
    expect(computeHarrowPassive()).toEqual({
      baseOvershieldCap: 1200,
      overshieldCap: 2400,
      startAtMaxEnergy: true,
    });
  });
});

describe("Gyre ability crit passive", () => {
  it("grants +10% ability CC per Electric status with yellow/orange/red tiers", () => {
    expect(computeGyreAbilityCritChance(0)).toMatchObject({ critChance: 0, tier: "none" });
    expect(computeGyreAbilityCritChance(1)).toMatchObject({
      critChance: 0.1,
      critMultiplier: 2,
      tier: "yellow",
    });
    expect(computeGyreAbilityCritChance(11)).toMatchObject({
      critChance: 1.1,
      critMultiplier: 3,
      tier: "orange",
    });
    expect(computeGyreAbilityCritChance(21)).toMatchObject({
      critChance: 2.1,
      critMultiplier: 4,
      tier: "red",
    });
    expect(computeGyreAbilityCritChance(40).critChance).toBe(3);
  });
});

describe("Citrine Geoluminesence passive", () => {
  it("scales heal rate from 5 to 25 HP/s over 200 Health Orbs", () => {
    expect(computeCitrineGeoluminesence(0)).toMatchObject({
      healPerSec: 5,
      radiusM: 50,
      orbsToMax: 200,
    });
    expect(computeCitrineGeoluminesence(50).healPerSec).toBeCloseTo(10, 5);
    expect(computeCitrineGeoluminesence(200).healPerSec).toBe(25);
    expect(computeCitrineGeoluminesence(300).healPerSec).toBe(25);
  });
});

describe("Chroma Dragon's Flight / element cycle", () => {
  it("grants an extra air jump and cycles basic elements", () => {
    expect(computeChromaDragonFlightPassive()).toEqual({ extraAirJump: true });
    expect(computeChromaElementCycle("heat").label).toBe("Heat");
    expect(computeChromaElementCycle("cold").element).toBe("cold");
  });
});

describe("Titania Upsurge passive", () => {
  it("grants parkour bonus and 4 HP/s Upsurge for 20s in 15m", () => {
    const p = computeTitaniaUpsurgePassive();
    expect(p).toMatchObject({
      parkourDistanceBonus: 0.25,
      healRadiusM: 15,
      healPerSec: 4,
      durationSec: 20,
    });
    expect(computeTitaniaUpsurgeRemaining(0)).toBe(20);
    expect(computeTitaniaUpsurgeRemaining(8)).toBe(12);
    expect(computeTitaniaUpsurgeRemaining(20)).toBe(0);
  });
});

describe("Hildryn shield gate passive", () => {
  it("uses 3.5s full gate and converts Energy Orbs to Shields", () => {
    expect(computeHildrynShieldGatePassive()).toEqual({
      fullGateSec: 3.5,
      energyOrbShieldRestore: 25,
      abilitiesUseShields: true,
    });
  });
});

describe("Nidus Undying passive", () => {
  it("consumes 15 Mutation stacks for 5s invuln and 50% heal", () => {
    expect(computeNidusUndyingPassive(10)).toMatchObject({
      undyingReady: false,
      stacksAfterUndying: 10,
    });
    expect(computeNidusUndyingPassive(40)).toMatchObject({
      undyingReady: true,
      stacksRequired: 15,
      invulnSec: 5,
      healFraction: 0.5,
      stacksAfterUndying: 25,
      stackCap: 200,
    });
    expect(computeNidusUndyingPassive(250).stackCap).toBe(200);
  });
});

describe("Sirius & Orion swap passive", () => {
  it("grants +45% Efficiency for 2 casts after swapping", () => {
    expect(computeSiriusOrionPassive()).toEqual({
      efficiencyBonus: 0.45,
      casts: 2,
      energyStealThreshold: 50,
    });
    expect(computeSiriusOrionEfficiencyCastsRemaining(0)).toBe(2);
    expect(computeSiriusOrionEfficiencyCastsRemaining(1)).toBe(1);
    expect(computeSiriusOrionEfficiencyCastsRemaining(2)).toBe(0);
  });
});

describe("Wisp airborne invisibility passive", () => {
  it("is invisible only while airborne", () => {
    expect(computeWispAirborneInvisPassive(true)).toEqual({ invisibleWhileAirborne: true });
    expect(computeWispAirborneInvisPassive(false)).toEqual({ invisibleWhileAirborne: false });
  });
});

describe("Follie Inkblot passive", () => {
  it("applies 50% slow for 10s and 20% balloon chance for 3 orbs", () => {
    expect(computeFollieInkblotPassive()).toEqual({
      slowFraction: 0.5,
      durationSec: 10,
      balloonChance: 0.2,
      orbsPerBalloon: 3,
    });
    expect(computeFollieInkblotExpected(10)).toEqual({
      expectedBalloons: 2,
      expectedOrbs: 6,
    });
  });
});

describe("Sevagoth Tombstone passive", () => {
  it("requires 5 souls within 14m to revive", () => {
    expect(computeSevagothTombstonePassive()).toEqual({
      soulsRequired: 5,
      soulTrackRangeM: 14,
    });
    expect(computeSevagothTombstoneSoulsRemaining(0)).toBe(5);
    expect(computeSevagothTombstoneSoulsRemaining(3)).toBe(2);
    expect(computeSevagothTombstoneSoulsRemaining(5)).toBe(0);
  });
});

describe("Inaros Sarcophagus / Finisher heal passive", () => {
  it("restores 20% max Health on Finisher kills and enables Sarcophagus", () => {
    expect(computeInarosPassive()).toEqual({
      finisherHealFraction: 0.2,
      sarcophagusOnFatal: true,
    });
    expect(computeInarosFinisherHeal(2000)).toBe(400);
  });
});

describe("Nokko Vital Decay passive", () => {
  it("gives 15s to reach a mushroom when one is active", () => {
    expect(computeNokkoVitalDecayPassive()).toEqual({
      timeLimitSec: 15,
      requiresActiveMushroom: true,
      postReviveInvulnSec: 1,
    });
    expect(computeNokkoVitalDecayRemaining(0)).toBe(15);
    expect(computeNokkoVitalDecayRemaining(10)).toBe(5);
    expect(computeNokkoVitalDecayRemaining(15)).toBe(0);
  });
});

describe("Wukong Five Techniques passive", () => {
  it("lists five techniques with 3 available per mission", () => {
    const p = computeWukongFiveTechniquesPassive();
    expect(p.techniquesPerMission).toBe(3);
    expect(p.deathGateInvulnSec).toBe(2);
    expect(p.deathGateHealFraction).toBe(0.5);
    expect(p.techniques).toHaveLength(5);
    expect(p.techniques.map((t) => t.id)).toEqual([
      "primal_forces",
      "heavenly_cloak",
      "cosmic_armour",
      "monkey_luck",
      "sly_alchemy",
    ]);
  });
});

describe("Voruna wolf passives", () => {
  it("lists Dynar / Raksh / Lycath / Ulfrun with Ulfrun 60s CD", () => {
    const p = computeVorunaWolvesPassive();
    expect(p.wolves.map((w) => w.id)).toEqual(["dynar", "raksh", "lycath", "ulfrun"]);
    expect(p.wolves[0]).toMatchObject({ bonus: 0.5, summary: "+50% Parkour Velocity" });
    expect(p.wolves[2]).toMatchObject({ bonus: 1 });
    expect(p.heavyAttackEfficiencyCap).toBe(0.9);
    expect(p.wolves[3]).toMatchObject({ cooldownSec: 60, invulnSec: 3 });
    expect(computeVorunaUlfrunCooldownRemaining(0)).toBe(60);
    expect(computeVorunaUlfrunCooldownRemaining(45)).toBe(15);
    expect(computeVorunaUlfrunCooldownRemaining(60)).toBe(0);
  });
});

describe("Uriel Legion passive", () => {
  it("defines three demons with 60s resurrect and key numbers", () => {
    const p = computeUrielLegionPassive();
    expect(p.resurrectSec).toBe(60);
    expect(p.demons.map((d) => d.id)).toEqual(["catenach", "gulphagor", "vythelas"]);
    expect(p.catenach).toMatchObject({
      maxChained: 5,
      durationSec: 10,
      damagePerSec: 100,
      slowFraction: 0.5,
      damageShare: 1,
    });
    expect(p.gulphagor).toMatchObject({
      latchDurationSec: 10,
      damagePerTick: 750,
      ticksPerSec: 4,
      healthOrbChance: 3,
      painRadiusM: 4,
    });
    expect(p.vythelas).toMatchObject({
      ritualIntervalSec: 12,
      fireRateBonus: 0.3,
      heatDamageBonus: 0.3,
      maxRunes: 3,
    });
    expect(computeUrielDemonResurrectRemaining(20)).toBe(40);
  });
});

describe("scaleAbilityMiscStats", () => {
  it("keeps Iron Skin armorMultiplier Misc-fixed (outer STR on pool)", () => {
    const lines = scaleAbilityMiscStats(
      { armorMultiplier: 2.5, invulnerabilityDuration: 3 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "rhino", abilityName: "Iron Skin" },
    );
    expect(lines.find((l) => l.label === "Armor Mult.")!).toMatchObject({
      base: "2.5x",
      scaled: "2.5x",
      modified: false,
    });
  });

  it("formats flat heal/shield/count misc without percent (Evade/Condemn/packs)", () => {
    const evade = scaleAbilityMiscStats(
      { healthRestore: 100 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "cyte_09", abilityName: "Evade" },
    );
    expect(evade.find((l) => l.label === "Health Restore")!).toMatchObject({
      base: "100",
      scaled: "130",
      scaleAttr: "strength",
    });
    const remedium = scaleAbilityMiscStats(
      { healthRestore: 0.5 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "uriel", abilityName: "Remedium" },
    );
    expect(remedium.find((l) => l.label === "Health Restore")!).toMatchObject({
      base: "50%",
      scaled: "65%",
      scaleAttr: "strength",
    });
    const condemn = scaleAbilityMiscStats(
      { shieldsPerEnemy: 150 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "harrow", abilityName: "Condemn" },
    );
    expect(condemn.find((l) => l.label === "Shields per Enemy")!).toMatchObject({
      base: "150",
      scaled: "195",
    });
    const meta = scaleAbilityMiscStats(
      { nightShields: 150 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "equinox", abilityName: "Metamorphosis" },
    );
    expect(meta.find((l) => l.label === "Night Shields")!).toMatchObject({
      base: "150",
      scaled: "195",
    });
    const packs = scaleAbilityMiscStats(
      { ammoPacks: 2, maxAmmoPacks: 6 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "cyte_09", abilityName: "Resupply" },
    );
    expect(packs.find((l) => l.label === "Ammo Packs")!).toMatchObject({
      base: "2",
      scaled: "2",
      modified: false,
    });
    expect(packs.find((l) => l.label === "Max Ammo Packs")!.base).toBe("6");
    const mark = scaleAbilityMiscStats(
      { hitsPerMark: 1 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "ash", abilityName: "Blade Storm" },
    );
    expect(mark.find((l) => l.label === "Hits per Mark")!.base).toBe("1");
    const globe = scaleAbilityMiscStats(
      { healthCap: 1_000_000 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "frost", abilityName: "Snow Globe" },
    );
    expect(globe.find((l) => l.label === "Health Cap")!.base).toBe("1000000");
  });

  it("formats combo/kill windows and lifespans as seconds", () => {
    const landslide = scaleAbilityMiscStats(
      { comboWindow: 5 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "atlas", abilityName: "Landslide" },
    );
    expect(landslide.find((l) => l.label === "Combo Window")!.base).toBe("5.0s");
    const omikuji = scaleAbilityMiscStats(
      { allyKillWindow: 2, cooldownCap: 150 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "koumei", abilityName: "Omikuji" },
    );
    expect(omikuji.find((l) => l.label === "Ally Kill Window")!.base).toBe("2.0s");
    // wiki Omikuji: decree cooldown hard-cap is 150 seconds
    expect(omikuji.find((l) => l.label === "Cooldown Cap")!.base).toBe("150.0s");
    const swarm = scaleAbilityMiscStats(
      { swarmKavatLifespan: 20 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "inaros", abilityName: "Scarab Swarm" },
    );
    expect(swarm.find((l) => l.label === "Swarm Kavat Lifespan")!.base).toBe("20.0s");
  });

  it("does not format flat counts/damage/angles as percent points", () => {
    const shuriken = scaleAbilityMiscStats(
      { shurikenCount: 5, homingAngle: 90 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "ash", abilityName: "Shuriken" },
    );
    expect(shuriken.find((l) => l.label === "Shuriken Count")!.base).toBe("5");
    expect(shuriken.find((l) => l.label === "Homing Angle")!.base).toBe("90.0°");
    const amd = scaleAbilityMiscStats(
      { absorbedDamageCap: 25000 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "nova", abilityName: "Antimatter Drop" },
    );
    expect(amd.find((l) => l.label === "Absorbed Damage Cap")!.base).toBe("25000");
    const progeny = scaleAbilityMiscStats(
      { maxSummulysts: 1 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "caliban", abilityName: "Lethal Progeny" },
    );
    expect(progeny.find((l) => l.label === "Max Summulysts")!.base).toBe("1");
    const evade = scaleAbilityMiscStats(
      { cooldown: 60 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "cyte_09", abilityName: "Evade" },
    );
    expect(evade.find((l) => l.label === "Cooldown")!.base).toBe("60.0s");
    // Real 100%/200% fraction fields still format as percent
    const petrify = scaleAbilityMiscStats(
      { rumblerHeal: 1 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "atlas", abilityName: "Petrify" },
    );
    expect(petrify.find((l) => l.label === "Rumbler Heal")!.base).toBe("100%");
    const plunder = scaleAbilityMiscStats(
      { corrosiveBonusCap: 2 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "hydroid", abilityName: "Plunder" },
    );
    expect(plunder.find((l) => l.label === "Corrosive Bonus Cap")!.base).toBe("200%");
  });

  it("keeps Warding Halo halo/armor/absorb mults Misc-fixed", () => {
    const lines = scaleAbilityMiscStats(
      { haloHealth: 1000, armorMultiplier: 2.5, absorptionMultiplier: 2.5 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "nezha", abilityName: "Warding Halo" },
    );
    expect(lines.find((l) => l.label === "Halo Health")!).toMatchObject({
      base: "1000",
      scaled: "1000",
      modified: false,
    });
    expect(lines.find((l) => l.label === "Armor Mult.")!).toMatchObject({
      base: "2.5x",
      scaled: "2.5x",
      modified: false,
    });
    expect(lines.find((l) => l.label === "Absorption Mult.")!).toMatchObject({
      base: "2.5x",
      scaled: "2.5x",
      modified: false,
    });
  });

  it("scales Celestial Twin health as a multiplier, not seconds/percent", () => {
    const lines = scaleAbilityMiscStats(
      { healthMultiplier: 2, damageMultiplier: 0.5, markDamageMultiplier: 3 },
      { strength: 1.5, duration: 1, range: 1 },
      { warframeId: "wukong", abilityName: "Celestial Twin" },
    );
    const health = lines.find((l) => l.label === "Health Multiplier")!;
    expect(health.base).toBe("2.0x");
    expect(health.scaled).toBe("3.0x");
    expect(health.modified).toBe(true);

    // Damage mults are fixed (unverified) — show base, no STR scale.
    const dmg = lines.find((l) => l.label === "Damage Multiplier")!;
    expect(dmg.base).toBe("0.50x");
    expect(dmg.scaled).toBe("0.50x");
    expect(dmg.modified).toBe(false);
  });

  it("scales Spores damageGrowth with Strength as a multiplier", () => {
    const lines = scaleAbilityMiscStats(
      { damageGrowth: 2 },
      { strength: 1.5, duration: 1, range: 1 },
      { warframeId: "saryn", abilityName: "Spores" },
    );
    expect(lines[0]!.base).toBe("2.0x");
    expect(lines[0]!.scaled).toBe("3.0x");
    expect(lines[0]!.modified).toBe(true);
  });

  it("keeps Miasma Spores damage multiplier fixed at 4x (no STR)", () => {
    const lines = scaleAbilityMiscStats(
      { sporesDamageMultiplier: 4 },
      { strength: 2, duration: 1, range: 1 },
      { warframeId: "saryn", abilityName: "Miasma" },
    );
    expect(lines[0]!.label).toBe("Spores Damage Mult.");
    expect(lines[0]!.base).toBe("4.0x");
    expect(lines[0]!.scaled).toBe("4.0x");
    expect(lines[0]!.modified).toBe(false);
  });

  it("scales Pillage strip with Strength and caps at 100%", () => {
    const lines = scaleAbilityMiscStats(
      { shieldStrip: 0.25, armorStrip: 0.25 },
      { strength: 4, duration: 1, range: 1 },
      { warframeId: "hildryn", abilityName: "Pillage" },
    );
    const shield = lines.find((l) => l.label === "Shield Strip")!;
    const armor = lines.find((l) => l.label === "Armor Strip")!;
    expect(shield.base).toBe("25%");
    expect(shield.scaled).toBe("100%");
    expect(armor.scaled).toBe("100%");
  });

  it("scales Terrify armor strip and enemy count with Strength", () => {
    const lines = scaleAbilityMiscStats(
      { armorStrip: 0.6, affectedEnemies: 20 },
      { strength: 1.67, duration: 1, range: 1 },
      { warframeId: "nekros", abilityName: "Terrify" },
    );
    const strip = lines.find((l) => l.label === "Armor Strip")!;
    const enemies = lines.find((l) => l.label === "Affected Enemies")!;
    expect(strip.base).toBe("60%");
    expect(strip.scaled).toBe("100%");
    expect(enemies.base).toBe("20");
    expect(enemies.scaled).toBe("33");
  });

  it("scales Tharros Strike strip and health per hit with Strength", () => {
    const lines = scaleAbilityMiscStats(
      { shieldStrip: 1, armorStrip: 0.5, healthPerHit: 250 },
      { strength: 2, duration: 1, range: 1 },
      { warframeId: "styanax", abilityName: "Tharros Strike" },
    );
    const shield = lines.find((l) => l.label === "Shield Strip")!;
    const armor = lines.find((l) => l.label === "Armor Strip")!;
    const health = lines.find((l) => l.label === "Health per Hit")!;
    expect(shield.base).toBe("100%");
    expect(shield.scaled).toBe("100%"); // capped
    expect(armor.base).toBe("50%");
    expect(armor.scaled).toBe("100%");
    expect(health.base).toBe("250");
    expect(health.scaled).toBe("500");
  });

  it("scales Parasitic Link strength bonus with Strength", () => {
    const lines = scaleAbilityMiscStats(
      { strengthBonus: 0.25, enemyLinkRange: 20 },
      { strength: 2, duration: 1, range: 1.5 },
      { warframeId: "nidus", abilityName: "Parasitic Link" },
    );
    const str = lines.find((l) => l.label === "Strength Bonus")!;
    const range = lines.find((l) => l.label === "Link Range")!;
    expect(str.base).toBe("25%");
    expect(str.scaled).toBe("50%");
    expect(range.base).toBe("20.0m");
    expect(range.scaled).toBe("30.0m");
  });

  it("scales Gravitic Slash strip with Strength (cap 100%)", () => {
    const lines = scaleAbilityMiscStats(
      { shieldStrip: 0.35, armorStrip: 0.35 },
      { strength: 3, duration: 1, range: 1 },
      { warframeId: "sirius_orion", abilityName: "Gravitic Slash" },
    );
    const shield = lines.find((l) => l.label === "Shield Strip")!;
    expect(shield.base).toBe("35%");
    expect(shield.scaled).toBe("100%");
  });

  it("still formats numeric armorDuration as seconds when verified", () => {
    const lines = scaleAbilityMiscStats(
      { armorDuration: 25, damageMultiplier: 7.5 },
      { strength: 1, duration: 1.2, range: 1 },
      { warframeId: "wukong", abilityName: "Defy" },
    );
    const dur = lines.find((l) => l.label === "Armor Duration")!;
    expect(dur.base).toBe("25.0s");
    expect(dur.scaled).toBe("30.0s");
  });

  // wiki Shroud: flat melee CD × STR; status/speed/CC Misc fixed; buff extension × DUR
  it("scales Shroud of Dynar melee CD with Strength (status/speed fixed)", () => {
    const lines = scaleAbilityMiscStats(
      {
        speedBuff: 1,
        meleeBuffDuration: 3,
        durationExtension: 5,
        criticalChanceBonus: 1,
        statusChance: 1,
        critDamageBonus: 2,
        parkourVelocity: 0.5,
      },
      { strength: 2, duration: 1.5, range: 1 },
      { warframeId: "voruna", abilityName: "Shroud Of Dynar" },
    );
    const cd = lines.find((l) => l.label === "Crit Damage Bonus")!;
    const sc = lines.find((l) => l.label === "Status Chance")!;
    const speed = lines.find((l) => l.label === "Speed Buff")!;
    const cc = lines.find((l) => l.label === "Crit Chance Bonus")!;
    const ext = lines.find((l) => l.label === "Duration Extension")!;
    expect(cd.base).toBe("+2.0x");
    expect(cd.scaled).toBe("+4.0x");
    expect(sc.base).toBe("100%");
    expect(sc.scaled).toBe("100%");
    expect(sc.modified).toBe(false);
    expect(speed.scaled).toBe(speed.base);
    expect(speed.modified).toBe(false);
    expect(cc.scaled).toBe("100%");
    expect(cc.modified).toBe(false);
    expect(ext.base).toBe("5.0s");
    expect(ext.scaled).toBe("7.5s");
  });

  it("scales Psychic Bolts defenseStrip with Strength (cap 100%)", () => {
    const lines = scaleAbilityMiscStats(
      { defenseStrip: 0.8 },
      { strength: 1.25, duration: 1, range: 1 },
      { warframeId: "nyx", abilityName: "Psychic Bolts" },
    );
    expect(lines[0]!.label).toBe("Defense Strip");
    expect(lines[0]!.base).toBe("80%");
    expect(lines[0]!.scaled).toBe("100%");
  });

  it("keeps Ulfrun Descent speedBuff fixed (Misc, not STR)", () => {
    const lines = scaleAbilityMiscStats(
      { speedBuff: 0.5, killDamageBonus: 2 },
      { strength: 2, duration: 1, range: 1 },
      { warframeId: "voruna", abilityName: "Ulfrun's Descent" },
    );
    const speed = lines.find((l) => l.label === "Speed Buff")!;
    expect(speed.base).toBe("50%");
    expect(speed.scaled).toBe("50%");
    expect(speed.modified).toBe(false);
  });

  it("scales Larva mutationStackChance with Strength (cap 100%)", () => {
    const lines = scaleAbilityMiscStats(
      { mutationStackChance: 0.5 },
      { strength: 2, duration: 1, range: 1 },
      { warframeId: "nidus", abilityName: "Larva" },
    );
    expect(lines[0]!.label).toBe("Mutation Chance");
    expect(lines[0]!.base).toBe("50%");
    expect(lines[0]!.scaled).toBe("100%");
  });

  it("scales Elemental Ward bonuses (toxin reload × DUR; heat DPS × STR)", () => {
    const lines = scaleAbilityMiscStats(
      {
        auraRadius: 12,
        heatHealthBonus: 0.55,
        heatDps: 100,
        toxinReloadBonus: 0.35,
        coldArmorBonus: 1.45,
        coldReflectMult: 3,
      },
      { strength: 2, duration: 2, range: 1.25 },
      { warframeId: "chroma", abilityName: "Elemental Ward" },
    );
    expect(lines.find((l) => l.label === "Aura Radius")!.scaled).toBe("15.0m");
    expect(lines.find((l) => l.label === "Heat Health Bonus")!.scaled).toBe("110%");
    expect(lines.find((l) => l.label === "Heat DPS")!.scaled).toBe("200/s");
    expect(lines.find((l) => l.label === "Toxin Reload Bonus")!.scaled).toBe("70%");
    expect(lines.find((l) => l.label === "Cold Armor Bonus")!.base).toBe("145%");
    expect(lines.find((l) => l.label === "Cold Armor Bonus")!.scaled).toBe("290%");
    expect(lines.find((l) => l.label === "Cold Reflect Mult.")!.scaled).toBe("6.0x");
  });

  it("formats Fangs of Raksh statusTypes/stacks as counts not percent", () => {
    const lines = scaleAbilityMiscStats(
      { statusTypes: 5, statusStacks: 10 },
      { strength: 2, duration: 1, range: 1 },
      { warframeId: "voruna", abilityName: "Fangs of Raksh" },
    );
    expect(lines.find((l) => l.label === "Status Types")!.base).toBe("5");
    expect(lines.find((l) => l.label === "Status Types")!.scaled).toBe("5");
    expect(lines.find((l) => l.label === "Stacks per Status")!.base).toBe("10");
    expect(lines.find((l) => l.label === "Stacks per Status")!.scaled).toBe("10");
  });

  it("formats Effigy sentry/stun Misc-fixed; drain × EFF/DUR", () => {
    const lines = scaleAbilityMiscStats(
      {
        sentryArmor: 200,
        energyDrain: 10,
        stunRadius: 30,
        creditPickupRadius: 10,
      },
      { strength: 2, duration: 2, range: 2, efficiency: 1 },
      { warframeId: "chroma", abilityName: "Effigy" },
    );
    expect(lines.find((l) => l.label === "Sentry Armor")!.base).toBe("200");
    expect(lines.find((l) => l.label === "Sentry Armor")!.scaled).toBe("200");
    expect(lines.find((l) => l.label === "Sentry Armor")!.modified).toBe(false);
    // 10 × max((2−1)÷2, 0.25) = 5/s
    expect(lines.find((l) => l.label === "Energy Drain")!).toMatchObject({
      base: "10/s",
      scaled: "5/s",
      modified: true,
      scaleAttr: "efficiency",
    });
    expect(lines.find((l) => l.label === "Stun Radius")!.base).toBe("30.0m");
    expect(lines.find((l) => l.label === "Stun Radius")!.modified).toBe(false);
    expect(lines.find((l) => l.label === "Credit Pickup Radius")!.base).toBe("10.0m");
    expect(lines.find((l) => l.label === "Credit Pickup Radius")!.modified).toBe(false);
  });

  it("scales Vex Armor scorn/fury max with Strength", () => {
    const lines = scaleAbilityMiscStats(
      { auraRadius: 18, scornMax: 3.5, furyMax: 2.75 },
      { strength: 2, duration: 1, range: 1 },
      { warframeId: "chroma", abilityName: "Vex Armor" },
    );
    expect(lines.find((l) => l.label === "Scorn Max")!.base).toBe("350%");
    expect(lines.find((l) => l.label === "Scorn Max")!.scaled).toBe("700%");
    expect(lines.find((l) => l.label === "Fury Max")!.base).toBe("275%");
    expect(lines.find((l) => l.label === "Fury Max")!.scaled).toBe("550%");
  });

  // wiki cast costs × EFF: Pillage 150 shields; Exalted slide 25; Prowl 2/10; Zephyr air 12.5/25; Kiss 15
  it("scales activation cast costs with Efficiency across frames", () => {
    const ctx = { strength: 1, duration: 1, range: 1, efficiency: 1.3 };
    const pillage = scaleAbilityMiscStats(
      { shieldCost: 150 },
      ctx,
      { warframeId: "hildryn", abilityName: "Pillage" },
    );
    expect(pillage.find((l) => l.label === "Shield Cost")!).toMatchObject({
      base: "150",
      scaled: "105",
      scaleAttr: "efficiency",
    });
    const blade = scaleAbilityMiscStats(
      { slideEnergyCost: 25 },
      ctx,
      { warframeId: "excalibur", abilityName: "Exalted Blade" },
    );
    expect(blade.find((l) => l.label === "Slide Energy Cost")!).toMatchObject({
      base: "25",
      scaled: "17.5",
      scaleAttr: "efficiency",
    });
    const prowl = scaleAbilityMiscStats(
      { meleeEnergyCost: 2, damageEnergyCost: 10 },
      ctx,
      { warframeId: "ivara", abilityName: "Prowl" },
    );
    expect(prowl.find((l) => l.label === "Melee Energy Cost")!).toMatchObject({
      base: "2",
      scaled: "1.4",
    });
    expect(prowl.find((l) => l.label === "Damage Energy Cost")!).toMatchObject({
      base: "10",
      scaled: "7",
    });
    const tail = scaleAbilityMiscStats(
      { airborneEnergyCost: 12.5 },
      ctx,
      { warframeId: "zephyr", abilityName: "Tail Wind" },
    );
    expect(tail.find((l) => l.label === "Airborne Energy Cost")!).toMatchObject({
      base: "12.50",
      scaled: "8.8",
    });
    const burst = scaleAbilityMiscStats(
      { airborneEnergyCost: 25 },
      ctx,
      { warframeId: "zephyr", abilityName: "Airburst" },
    );
    expect(burst.find((l) => l.label === "Airborne Energy Cost")!.scaled).toBe("17.5");
    const kiss = scaleAbilityMiscStats(
      { kissEnergyCost: 15 },
      ctx,
      { warframeId: "bonewidow", abilityName: "Shield Maiden" },
    );
    expect(kiss.find((l) => l.label === "Maiden's Kiss Energy")!).toMatchObject({
      base: "15",
      scaled: "10.5",
    });
    const mark = scaleAbilityMiscStats(
      { energyPerMark: 12 },
      ctx,
      { warframeId: "ash", abilityName: "Blade Storm" },
    );
    expect(mark.find((l) => l.label === "Energy per Mark")!).toMatchObject({
      base: "12",
      scaled: "8.4",
    });
    const artemis = scaleAbilityMiscStats(
      { energyPerShot: 15 },
      ctx,
      { warframeId: "ivara", abilityName: "Artemis Bow" },
    );
    expect(artemis.find((l) => l.label === "Energy per Shot")!).toMatchObject({
      base: "15",
      scaled: "10.5",
      scaleAttr: "efficiency",
    });
    const noctua = scaleAbilityMiscStats(
      { energyPerShot: 2 },
      ctx,
      { warframeId: "dante", abilityName: "Noctua" },
    );
    expect(noctua.find((l) => l.label === "Energy per Shot")!.scaled).toBe("1.4");
    const neutralize = scaleAbilityMiscStats(
      { energyPerShot: 10, altFireEnergy: 20 },
      ctx,
      { warframeId: "cyte_09", abilityName: "Neutralize" },
    );
    expect(neutralize.find((l) => l.label === "Energy per Shot")!.scaled).toBe("7");
    expect(neutralize.find((l) => l.label === "Alt-Fire Energy")!.scaled).toBe("14");
    const inferno = scaleAbilityMiscStats(
      { energyPerEnemy: 10 },
      ctx,
      { warframeId: "ember", abilityName: "Inferno" },
    );
    expect(inferno.find((l) => l.label === "Energy per Enemy")!).toMatchObject({
      base: "10",
      scaled: "7",
      scaleAttr: "efficiency",
    });
    const fireBlast = scaleAbilityMiscStats(
      { maxHeatEnergyCost: 25 },
      ctx,
      { warframeId: "ember", abilityName: "Fire Blast" },
    );
    expect(fireBlast.find((l) => l.label === "Energy Cost (Max Heat)")!).toMatchObject({
      base: "25",
      scaled: "17.5",
      scaleAttr: "efficiency",
    });
    const glory = scaleAbilityMiscStats(
      { altFireEnergy: 25 },
      ctx,
      { warframeId: "jade", abilityName: "Glory On High" },
    );
    expect(glory.find((l) => l.label === "Alt-Fire Energy")!).toMatchObject({
      base: "25",
      scaled: "17.5",
      scaleAttr: "efficiency",
    });
    // wiki Virulence: refund = 25% of cast cost → follows cast_cost; higher EFF lowers refund
    const virulence = scaleAbilityMiscStats(
      { energyRefundPerHit: 10 },
      ctx,
      { warframeId: "nidus", abilityName: "Virulence" },
    );
    expect(virulence.find((l) => l.label === "Energy per Hit")!).toMatchObject({
      base: "10",
      scaled: "7",
      scaleAttr: "efficiency",
      positive: false,
    });
    const virulenceLowEff = scaleAbilityMiscStats(
      { energyRefundPerHit: 10 },
      { ...ctx, efficiency: 0.7 },
      { warframeId: "nidus", abilityName: "Virulence" },
    );
    expect(virulenceLowEff.find((l) => l.label === "Energy per Hit")!).toMatchObject({
      scaled: "13",
      positive: true,
    });
    const desecrate = scaleAbilityMiscStats(
      { energyPerCorpse: 10 },
      ctx,
      { warframeId: "nekros", abilityName: "Desecrate" },
    );
    expect(desecrate.find((l) => l.label === "Energy per Corpse")!).toMatchObject({
      base: "10",
      scaled: "7",
    });
    const provoke = scaleAbilityMiscStats(
      { energyPerAbility: 3 },
      ctx,
      { warframeId: "equinox", abilityName: "Pacify & Provoke" },
    );
    expect(provoke.find((l) => l.label === "Energy per Ability")!).toMatchObject({
      base: "3",
      scaled: "2.1",
    });
    const nav = scaleAbilityMiscStats(
      { energyDrainGrowth: 2 },
      ctx,
      { warframeId: "ivara", abilityName: "Navigator" },
    );
    expect(nav.find((l) => l.label === "Energy Drain Growth")!).toMatchObject({
      base: "2/s",
      scaled: "1.4/s",
    });
    const vampire = scaleAbilityMiscStats(
      { energyPerPulse: 25 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "trinity", abilityName: "Energy Vampire" },
    );
    expect(vampire.find((l) => l.label === "Energy per Pulse")!).toMatchObject({
      base: "25",
      scaled: "33",
      scaleAttr: "strength",
    });
    const bright = scaleAbilityMiscStats(
      { energyRestore: 15 },
      { strength: 1.3, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "nokko", abilityName: "Brightbonnet" },
    );
    expect(bright.find((l) => l.label === "Energy Restore")!).toMatchObject({
      base: "15",
      scaled: "20",
      scaleAttr: "strength",
    });
    const mutation = scaleAbilityMiscStats(
      { mutationStackCost: 1 },
      ctx,
      { warframeId: "nidus", abilityName: "Parasitic Link" },
    );
    expect(mutation.find((l) => l.label === "Mutation Cost")!).toMatchObject({
      base: "1",
      scaled: "1",
      modified: false,
    });
  });

  // wiki Haven/Aegis/Balefire: shield drains × EFF/DUR; cast shieldCost × EFF; recharge × DUR
  it("scales Hildryn Haven/Aegis/Balefire shield costs and drains", () => {
    const haven = scaleAbilityMiscStats(
      {
        allyShieldBonus: 500,
        shieldRechargeRate: 0.8,
        shieldCost: 250,
        shieldDrainPerAlly: 5,
        shieldDrainPerEnemy: 25,
      },
      { strength: 1.3, duration: 1.3, range: 1, efficiency: 1.3 },
      { warframeId: "hildryn", abilityName: "Haven" },
    );
    expect(haven.find((l) => l.label === "Ally Shields")!.scaled).toBe("650");
    expect(haven.find((l) => l.label === "Shield Recharge Rate")!).toMatchObject({
      base: "80%",
      scaled: "104%",
      scaleAttr: "duration",
    });
    expect(haven.find((l) => l.label === "Shield Cost")!).toMatchObject({
      base: "250",
      scaled: "175",
      scaleAttr: "efficiency",
    });
    // 5 × (0.7 / 1.3) ≈ 2.69
    expect(haven.find((l) => l.label === "Shield Drain/Ally")!.scaled).toBe("2.7/s");
    expect(haven.find((l) => l.label === "Shield Drain/Enemy")!.scaled).toBe("13.5/s");
    const storm = scaleAbilityMiscStats(
      { shieldCost: 100, shieldDrain: 25, shieldDrainPerEnemy: 25, dodgeShieldCost: 50 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "hildryn", abilityName: "Aegis Storm" },
    );
    expect(storm.find((l) => l.label === "Shield Cost")!.scaled).toBe("70");
    expect(storm.find((l) => l.label === "Shield Drain")!.scaled).toBe("17.5/s");
    expect(storm.find((l) => l.label === "Dodge Shield Cost")!).toMatchObject({
      base: "50",
      scaled: "35",
      scaleAttr: "efficiency",
    });
    const balefire = scaleAbilityMiscStats(
      { shieldCost: 50 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.75 },
      { warframeId: "hildryn", abilityName: "Balefire" },
    );
    expect(balefire.find((l) => l.label === "Shield Cost")!).toMatchObject({
      base: "50",
      scaled: "12.5",
      scaleAttr: "efficiency",
    });
  });

  // wiki channeled drains: Peacemaker 15, Hysteria 5, Spectral Scream 3, Danse 20/40, Prowl 1/3 moving
  it("scales high-use channeled energyDrain with EFF/DUR across frames", () => {
    const drain = (wf: string, ability: string, misc: Record<string, number>) =>
      scaleAbilityMiscStats(misc, { strength: 1, duration: 1, range: 1, efficiency: 1.3 }, {
        warframeId: wf,
        abilityName: ability,
      });
    expect(drain("mesa", "Peacemaker", { energyDrain: 15 }).find((l) => l.label === "Energy Drain")).toMatchObject({
      base: "15/s",
      scaled: "10.5/s",
      scaleAttr: "efficiency",
    });
    expect(drain("valkyr", "Hysteria", { energyDrain: 5 }).find((l) => l.label === "Energy Drain")!.scaled).toBe(
      "3.5/s",
    );
    expect(drain("chroma", "Spectral Scream", { energyDrain: 3 }).find((l) => l.label === "Energy Drain")!.scaled).toBe(
      "2.1/s",
    );
    expect(drain("excalibur", "Exalted Blade", { energyDrain: 2.5 }).find((l) => l.label === "Energy Drain")).toMatchObject({
      base: "2.5/s",
      scaled: "1.8/s",
    });
    const danse = drain("revenant", "Danse Macabre", { energyDrain: 20, boostedEnergyDrain: 40 });
    expect(danse.find((l) => l.label === "Energy Drain")!.scaled).toBe("14/s");
    expect(danse.find((l) => l.label === "Boosted Energy Drain")!.scaled).toBe("28/s");
    const prowl = drain("ivara", "Prowl", { energyDrain: 1, energyDrainMoving: 3 });
    expect(prowl.find((l) => l.label === "Energy Drain")!).toMatchObject({
      base: "1/s",
      scaled: "0.70/s",
    });
    expect(prowl.find((l) => l.label === "Energy Drain (Moving)")!).toMatchObject({
      base: "3/s",
      scaled: "2.1/s",
    });
  });

  // wiki Pacify 0.5/s/enemy + Mend 3.5/s channeled drains
  it("scales Equinox Pacify/Mend channeled drains with EFF/DUR", () => {
    const pacify = scaleAbilityMiscStats(
      { energyDrainPerEnemy: 0.5 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "equinox", abilityName: "Pacify & Provoke" },
    );
    expect(pacify.find((l) => l.label === "Energy Drain per Enemy")!).toMatchObject({
      base: "0.50/s",
      scaled: "0.35/s",
      modified: true,
      scaleAttr: "efficiency",
    });
    const mend = scaleAbilityMiscStats(
      { energyDrain: 3.5 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "equinox", abilityName: "Mend & Maim" },
    );
    expect(mend.find((l) => l.label === "Energy Drain")!).toMatchObject({
      base: "3.5/s",
      // 3.5 × 0.7 → 2.45 (float → 2.4 with toFixed(1))
      scaled: "2.4/s",
      modified: true,
      scaleAttr: "efficiency",
    });
  });

  // wiki Gloom: 0.75/s/enemy × max((2−EFF)÷DUR, 0.25); was mis-shown as 75%
  it("scales Gloom energyDrainPerEnemy with channeled EFF/DUR and formats as /s", () => {
    const bare = scaleAbilityMiscStats(
      { energyDrainPerEnemy: 0.75, energyDrainEnemyCap: 10 },
      { strength: 1, duration: 1, range: 1, efficiency: 1 },
      { warframeId: "sevagoth", abilityName: "Gloom" },
    );
    expect(bare.find((l) => l.label === "Energy Drain per Enemy")!).toMatchObject({
      base: "0.75/s",
      scaled: "0.75/s",
      modified: false,
      scaleAttr: "efficiency",
    });
    expect(bare.find((l) => l.label === "Energy Drain Enemy Cap")!).toMatchObject({
      base: "10",
      modified: false,
    });
    const streamline = scaleAbilityMiscStats(
      { energyDrainPerEnemy: 0.75 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "sevagoth", abilityName: "Gloom" },
    );
    expect(streamline.find((l) => l.label === "Energy Drain per Enemy")!).toMatchObject({
      base: "0.75/s",
      // 0.75 × 0.7 → 0.525 (float → 0.52 with toFixed(2))
      scaled: "0.52/s",
      modified: true,
      scaleAttr: "efficiency",
    });
    const helminth = scaleAbilityMiscStats(
      { energyDrainPerEnemy: 0.75 },
      { strength: 1, duration: 1.3, range: 1, efficiency: 1.3 },
      { warframeId: "helminth", abilityName: "Gloom" },
    );
    // 0.75 × (0.7 / 1.3) ≈ 0.4038
    expect(helminth.find((l) => l.label === "Energy Drain per Enemy")!.scaled).toBe("0.40/s");
  });

  // wiki Nourish: 1+((mult−1)×STR); native 2×→2.3× / Helminth 1.6×→1.8× at 130% STR
  it("scales Nourish energyMultiplier as 1+(bonus×STR)", () => {
    const native = scaleAbilityMiscStats(
      { energyMultiplier: 2 },
      { strength: 1.3, duration: 1, range: 1 },
      { warframeId: "grendel", abilityName: "Nourish" },
    );
    expect(native.find((l) => l.label === "Energy Multiplier")!).toMatchObject({
      base: "2.0x",
      scaled: "2.3x",
      modified: true,
      scaleAttr: "strength",
    });
    const helminth = scaleAbilityMiscStats(
      { energyMultiplier: 1.6 },
      { strength: 1.3, duration: 1, range: 1 },
      { warframeId: "helminth", abilityName: "Nourish" },
    );
    expect(helminth.find((l) => l.label === "Energy Multiplier")!).toMatchObject({
      base: "1.6x",
      scaled: "1.8x",
      modified: true,
      scaleAttr: "strength",
    });
  });

  // wiki Absorb: 0.025% convert × STR (buff √(convert×STR×absorbed) needs absorbed sim)
  it("scales Absorb weaponDamageConvert percent-points with Strength", () => {
    const lines = scaleAbilityMiscStats(
      { weaponDamageConvert: 0.025, weaponDamageCap: 4 },
      { strength: 1.3, duration: 1, range: 1 },
      { warframeId: "nyx", abilityName: "Absorb" },
    );
    expect(lines.find((l) => l.label === "Weapon Damage Convert")!).toMatchObject({
      base: "0.025%",
      scaled: "0.0325%",
      modified: true,
      scaleAttr: "strength",
    });
    expect(lines.find((l) => l.label === "Weapon Damage Cap")!.modified).toBe(false);
  });

  // wiki channeled drain: base × max((2−EFF)÷DUR, 0.25); Sol Gate 12 → 8.4 at 130% EFF
  it("scales Sol Gate energyDrain with channeled EFF/DUR formula", () => {
    const streamline = scaleAbilityMiscStats(
      { energyDrain: 12, boostedEnergyDrain: 24 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "wisp", abilityName: "Sol Gate" },
    );
    expect(streamline.find((l) => l.label === "Energy Drain")!).toMatchObject({
      base: "12/s",
      scaled: "8.4/s",
      modified: true,
      scaleAttr: "efficiency",
    });
    expect(streamline.find((l) => l.label === "Boosted Energy Drain")!.scaled).toBe("16.8/s");
    const both = scaleAbilityMiscStats(
      { energyDrain: 12 },
      { strength: 1, duration: 1.3, range: 1, efficiency: 1.3 },
      { warframeId: "wisp", abilityName: "Sol Gate" },
    );
    // 12 × (0.7 / 1.3) ≈ 6.46
    expect(both.find((l) => l.label === "Energy Drain")!.scaled).toBe("6.5/s");
    const floor = scaleAbilityMiscStats(
      { energyDrain: 12 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.75 },
      { warframeId: "wisp", abilityName: "Sol Gate" },
    );
    expect(floor.find((l) => l.label === "Energy Drain")!.scaled).toBe("3/s");
  });

  // wiki Pacify: Modified DR = 1 − (0.5 ÷ STR); Intensify 130% → 61.5%
  it("scales Pacify damage reduction with 1−(base÷STR)", () => {
    const bare = scaleAbilityMiscStats(
      { pacifyDamageReduction: 0.5 },
      { strength: 1, duration: 1, range: 1 },
      { warframeId: "equinox", abilityName: "Pacify & Provoke" },
    );
    expect(bare.find((l) => l.label === "Pacify Damage Reduction")!).toMatchObject({
      base: "50%",
      scaled: "50%",
      modified: false,
      scaleAttr: "strength",
    });
    const intensify = scaleAbilityMiscStats(
      { pacifyDamageReduction: 0.5 },
      { strength: 1.3, duration: 1, range: 1 },
      { warframeId: "equinox", abilityName: "Pacify & Provoke" },
    );
    expect(intensify.find((l) => l.label === "Pacify Damage Reduction")!).toMatchObject({
      base: "50%",
      scaled: "62%",
      modified: true,
      scaleAttr: "strength",
    });
  });

  // wiki Energy Vampire: pulse interval ÷ DUR, floor 0.5s (2.25→1.125 at 200%; 0.5 at 500%)
  it("scales Energy Vampire pulseInterval inversely with Duration (0.5s floor)", () => {
    const at2x = scaleAbilityMiscStats(
      { pulseInterval: 2.25 },
      { strength: 1, duration: 2, range: 1 },
      { warframeId: "trinity", abilityName: "Energy Vampire" },
    );
    expect(at2x.find((l) => l.label === "Pulse Interval")!).toMatchObject({
      base: "2.3s",
      scaled: "1.1s",
      modified: true,
      scaleAttr: "duration",
    });
    const at5x = scaleAbilityMiscStats(
      { pulseInterval: 2.25 },
      { strength: 1, duration: 5, range: 1 },
      { warframeId: "trinity", abilityName: "Energy Vampire" },
    );
    expect(at5x.find((l) => l.label === "Pulse Interval")!.scaled).toBe("0.5s");
  });

  // wiki Shadows / Navigator / Prowl — decay, growth, steal time ÷ DUR
  it("scales Shadows decay, Navigator growth, and Prowl steal time inversely with Duration", () => {
    const shadows = scaleAbilityMiscStats(
      { healthDecayPerSecond: 0.03 },
      { strength: 1, duration: 2, range: 1 },
      { warframeId: "nekros", abilityName: "Shadows Of The Dead" },
    );
    expect(shadows.find((l) => l.label === "Health Decay/s")!).toMatchObject({
      base: "3%",
      scaled: "2%",
      modified: true,
      scaleAttr: "duration",
    });
    const nav = scaleAbilityMiscStats(
      { multiplierGrowth: 1 },
      { strength: 1, duration: 2, range: 1 },
      { warframeId: "ivara", abilityName: "Navigator" },
    );
    // wiki: 100%/s growth ≡ +1.0x/s; Modified = base ÷ Duration (HUD shows multipliers)
    expect(nav.find((l) => l.label === "Multiplier Growth")!).toMatchObject({
      base: "1.00x",
      scaled: "0.50x",
      modified: true,
      scaleAttr: "duration",
    });
    const prowl = scaleAbilityMiscStats(
      { stealTime: 2.5 },
      { strength: 1, duration: 2, range: 1 },
      { warframeId: "ivara", abilityName: "Prowl" },
    );
    expect(prowl.find((l) => l.label === "Steal Time")!).toMatchObject({
      base: "2.5s",
      scaled: "1.3s",
      modified: true,
      scaleAttr: "duration",
    });
  });

  // wiki Bloodletting R3: 40% energy gain × Ability Efficiency (Streamline 130% → 52%)
  it("scales Bloodletting energyGainPercent with Efficiency", () => {
    const lines = scaleAbilityMiscStats(
      { energyGainPercent: 0.4, healthDeducted: 0.5, minimumHealth: 2 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "garuda", abilityName: "Bloodletting" },
    );
    const gain = lines.find((l) => l.label === "Energy Gain")!;
    expect(gain.base).toBe("40%");
    expect(gain.scaled).toBe("52%");
    expect(gain.modified).toBe(true);
    expect(gain.scaleAttr).toBe("efficiency");
    expect(lines.find((l) => l.label === "Health Deducted")!.modified).toBe(false);
  });

  // wiki Transmutation Probe: 1.5s CDR × Ability Efficiency (Streamline 130% → 1.95s)
  it("scales Transmutation Probe cooldownReduction with Efficiency", () => {
    const lines = scaleAbilityMiscStats(
      { cooldownReduction: 1.5, probeDuration: 3, probeSpeed: 15, haltDelay: 0.5 },
      { strength: 1, duration: 1, range: 1, efficiency: 1.3 },
      { warframeId: "lavos", abilityName: "Transmutation Probe" },
    );
    const cdr = lines.find((l) => l.label === "Cooldown Reduction")!;
    expect(cdr.base).toBe("1.5s");
    expect(cdr.scaled).toBe("2.0s");
    expect(cdr.modified).toBe(true);
    expect(cdr.scaleAttr).toBe("efficiency");
    expect(lines.find((l) => l.label === "Probe Duration")!.modified).toBe(false);
    expect(lines.find((l) => l.label === "Probe Speed")!.modified).toBe(false);
  });

  // wiki Contagion Cloud R3: 300 Toxin/s × STR, 5m × RNG, 12s × DUR; melee mult 2× fixed
  it("scales Contagion Cloud miscStats with STR/RNG/DUR (melee mult fixed)", () => {
    const lines = scaleAbilityMiscStats(
      {
        contagionCloudDps: 300,
        contagionCloudRange: 5,
        contagionCloudDuration: 12,
        contagionCloudMeleeMult: 2,
      },
      { strength: 2, duration: 1.5, range: 1.2 },
      { warframeId: "saryn", abilityName: "Toxic Lash" },
    );
    const dps = lines.find((l) => l.label === "Contagion Cloud DPS")!;
    const range = lines.find((l) => l.label === "Contagion Cloud Range")!;
    const duration = lines.find((l) => l.label === "Contagion Cloud Duration")!;
    const melee = lines.find((l) => l.label === "Contagion Melee Mult.")!;
    expect(dps.base).toBe("300/s");
    expect(dps.scaled).toBe("600/s");
    expect(range.base).toBe("5.0m");
    expect(range.scaled).toBe("6.0m");
    expect(duration.base).toBe("12.0s");
    expect(duration.scaled).toBe("18.0s");
    expect(melee.base).toBe("2.0x");
    expect(melee.scaled).toBe("2.0x");
    expect(melee.modified).toBe(false);
  });
});
