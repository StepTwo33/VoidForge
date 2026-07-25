/**
 * Set-bonus accuracy goldens (wiki Augur / Hunter / Mecha / Umbral).
 */
import { describe, expect, it } from "vitest";
import { allMods } from "@/data/mods";
import { allWarframes } from "@/data/warframes";
import { calculateWarframeBuild, calculateWeaponBuild } from "@/lib/calc/calculator";
import {
  augurShieldsFromEnergySpent,
  buildWarframeSetBonusSummary,
  computeMechaSetMarkStats,
  computeMechaSpreadPaperDps,
  countAugurSetPieces,
  countHunterSetPieces,
  countMechaSetPieces,
  hunterCompanionDamageMultiplier,
  MECHA_EMPOWERED_VS_MARKED_MULTIPLIER,
  sumClawElementalBonuses,
  weaponSupportsHunterCompanionSet,
} from "@/lib/calc/set-bonuses";
import { scaledAbilityEnergyCost } from "@/lib/codex/ability-misc-stats";
import { resolveWeaponExternalBuffs } from "@/lib/weapons/weapon-external-buffs";
import type { Ability, SimulationParams, WarframeCalculatedStats, Weapon } from "@/lib/types";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";

const modsMap = () => new Map(allMods.map((m) => [m.id, m]));

describe("Augur set (wiki: +40% energy→shields per piece)", () => {
  it("scales panel percent with piece count (not only at 6)", () => {
    const excal = allWarframes.find((w) => w.id === "excalibur")!;
    const pieces = ["augur_message", "augur_reach", "augur_secrets"].map((id, i) => {
      const m = allMods.find((x) => x.id === id)!;
      return { modId: id, rank: m.maxRank, slotIndex: i };
    });
    expect(countAugurSetPieces(pieces)).toBe(3);

    const stats = calculateWarframeBuild(excal, pieces, modsMap());
    expect(stats.augurEnergyToShieldsPercent).toBe(120);

    const summary = buildWarframeSetBonusSummary(pieces);
    const aug = summary.find((s) => s.setId === "augur")!;
    expect(aug.active).toBe(true);
    expect(aug.pieces).toBe(3);
  });

  it("reaches 240% at 6 pieces including Augur Pact + Augur Seeker on secondary", () => {
    // Wiki: 4 Warframe + 2 pistol (Pact=`augur_breach`, Seeker=`augur_seeker`).
    const wfMods = ["augur_message", "augur_reach", "augur_secrets", "augur_accord"].map((id, i) => ({
      modId: id,
      rank: 3,
      slotIndex: i,
    }));
    const secondary = [
      { modId: "augur_breach", rank: 5, slotIndex: 0 },
      { modId: "augur_seeker", rank: 5, slotIndex: 1 },
    ];
    expect(countAugurSetPieces(wfMods, secondary)).toBe(6);
    const excal = allWarframes.find((w) => w.id === "excalibur")!;
    const stats = calculateWarframeBuild(excal, wfMods, modsMap(), {
      secondaryMods: secondary,
    });
    expect(stats.augurEnergyToShieldsPercent).toBe(240);
  });

  it("converts spent energy to shields at 40%/piece after Ability Efficiency", () => {
    // 3 pieces × 25 energy (100% EFF) → 30 shields; with 130% EFF cost drops to 17.5 → 21 shields
    expect(augurShieldsFromEnergySpent(25, 3)).toBe(30);
    expect(augurShieldsFromEnergySpent(0, 3)).toBe(0);
    expect(augurShieldsFromEnergySpent(25, 0)).toBe(0);
    const spent = scaledAbilityEnergyCost(25, 1.3);
    expect(spent).toBeCloseTo(17.5, 5);
    expect(augurShieldsFromEnergySpent(spent, 3)).toBeCloseTo(21, 5);
    expect(augurShieldsFromEnergySpent(scaledAbilityEnergyCost(25, 1), 6)).toBe(60);
  });
});

describe("Hunter set (wiki: +25% companion dmg per piece vs Slash)", () => {
  it("scales with piece count", () => {
    const excal = allWarframes.find((w) => w.id === "excalibur")!;
    const hunterAdrenaline = allMods.find((m) => m.id === "hunter_adrenaline")!;
    const slots = [{ modId: "hunter_adrenaline", rank: hunterAdrenaline.maxRank, slotIndex: 0 }];
    expect(countHunterSetPieces(undefined, slots)).toBe(1);
    const stats = calculateWarframeBuild(excal, slots, modsMap());
    expect(stats.hunterCompanionVsStatusDamagePercent).toBe(25);
  });

  it("multiplies companion claw DPS when vs-Slash toggle is on", () => {
    expect(hunterCompanionDamageMultiplier(0)).toBe(1);
    expect(hunterCompanionDamageMultiplier(1)).toBeCloseTo(1.25, 5);
    expect(hunterCompanionDamageMultiplier(6)).toBeCloseTo(2.5, 5);
    expect(weaponSupportsHunterCompanionSet({ category: "beast_claw" })).toBe(true);
    expect(weaponSupportsHunterCompanionSet({ category: "rifle" })).toBe(false);

    const claw: Weapon = {
      id: "test_claws",
      name: "Test Claws",
      category: "beast_claw",
      damage: 100,
      impact: 0,
      puncture: 0,
      slash: 100,
      fireRate: 1,
      criticalChance: 0,
      criticalMultiplier: 2,
      statusChance: 0,
      magazine: 0,
      reloadTime: 0,
      multishot: 1,
      triggerType: "Melee",
      modSlots: 8,
      hasPrimaryArcaneSlot: false,
      hasSecondaryArcaneSlot: false,
      isIncarnon: false,
      hasRivenSlot: false,
    };
    const linkage = {
      warframeMods: [{ modId: "hunter_adrenaline", rank: 5, slotIndex: 0 }],
      companionMods: [
        { modId: "hunter_recovery", rank: 5, slotIndex: 0 },
        { modId: "hunter_command", rank: 5, slotIndex: 1 },
      ],
    };
    expect(countHunterSetPieces(linkage, linkage.warframeMods)).toBe(3);

    const off = calculateWeaponBuild(claw, [], modsMap(), undefined, DEFAULT_SIM_PARAMS, undefined, linkage);
    const on = calculateWeaponBuild(
      claw,
      [],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyHunterSetVsSlashDamage: true },
      undefined,
      linkage,
    );
    expect(off.hunterSetVsSlashDamageMultiplier).toBeUndefined();
    expect(on.hunterSetVsSlashDamageMultiplier).toBeCloseTo(1.75, 5);
    expect(on.totalDamage / off.totalDamage).toBeCloseTo(1.75, 5);

    const rifle: Weapon = { ...claw, id: "t", name: "T", category: "rifle", triggerType: "Auto", magazine: 30, reloadTime: 2 };
    const rifleOn = calculateWeaponBuild(
      rifle,
      [],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyHunterSetVsSlashDamage: true },
      undefined,
      linkage,
    );
    expect(rifleOn.hunterSetVsSlashDamageMultiplier).toBeUndefined();
  });
});

describe("Mecha set (wiki: mark timing + Empowered vs marked)", () => {
  it("describes mark/spread with piece-scaled numbers, not explosion DPS", () => {
    const slots = [{ modId: "mecha_pulse_r3", rank: 3, slotIndex: 0 }];
    const line = buildWarframeSetBonusSummary(slots).find((s) => s.setId === "mecha")!;
    expect(line.active).toBe(true);
    expect(line.description).toMatch(/60s/);
    expect(line.description).toMatch(/3s/);
    expect(line.description).toMatch(/7\.5m/);
    expect(line.description.toLowerCase()).not.toMatch(/explode/);
  });

  it("scales mark cooldown / duration / range by piece count", () => {
    expect(computeMechaSetMarkStats(0)).toBeNull();
    expect(computeMechaSetMarkStats(1)).toEqual({
      pieces: 1,
      cooldownSec: 60,
      markDurationSec: 3,
      spreadRangeM: 7.5,
    });
    expect(computeMechaSetMarkStats(4)).toEqual({
      pieces: 4,
      cooldownSec: 15,
      markDurationSec: 12,
      spreadRangeM: 30,
    });
    expect(computeMechaSetMarkStats(9)?.pieces).toBe(4);
  });

  it("applies Mecha Empowered +150% vs marked when toggle + Empowered + set piece", () => {
    expect(MECHA_EMPOWERED_VS_MARKED_MULTIPLIER).toBe(2.5);
    const rifle: Weapon = {
      id: "t",
      name: "T",
      category: "rifle",
      damage: 100,
      impact: 100,
      puncture: 0,
      slash: 0,
      fireRate: 1,
      criticalChance: 0,
      criticalMultiplier: 2,
      statusChance: 0,
      magazine: 30,
      reloadTime: 2,
      multishot: 1,
      triggerType: "Auto",
      modSlots: 8,
      hasPrimaryArcaneSlot: false,
      hasSecondaryArcaneSlot: false,
      isIncarnon: false,
      hasRivenSlot: true,
    };
    const linkage = {
      warframeMods: [
        { modId: "mecha_empowered", rank: 5, slotIndex: 0 },
        { modId: "mecha_pulse_r3", rank: 3, slotIndex: 1 },
      ],
      companionMods: [{ modId: "mecha_recharge", rank: 5, slotIndex: 0 }],
    };
    expect(countMechaSetPieces(linkage.warframeMods, linkage.companionMods)).toBe(3);

    const excal = allWarframes.find((w) => w.id === "excalibur")!;
    const wfStats = calculateWarframeBuild(excal, linkage.warframeMods, modsMap(), {
      companionMods: linkage.companionMods,
    });
    expect(wfStats.mechaSetPieces).toBe(3);

    const off = calculateWeaponBuild(rifle, [], modsMap(), undefined, DEFAULT_SIM_PARAMS, undefined, linkage);
    const on = calculateWeaponBuild(
      rifle,
      [],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyMechaEmpoweredVsMarkedDamage: true },
      undefined,
      linkage,
    );
    expect(off.mechaEmpoweredVsMarkedDamageMultiplier).toBeUndefined();
    expect(on.mechaEmpoweredVsMarkedDamageMultiplier).toBe(2.5);
    expect(on.totalDamage / off.totalDamage).toBeCloseTo(2.5, 5);

    const noEmpowered = calculateWeaponBuild(
      rifle,
      [],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, applyMechaEmpoweredVsMarkedDamage: true },
      undefined,
      { warframeMods: [{ modId: "mecha_pulse_r3", rank: 3, slotIndex: 0 }] },
    );
    expect(noEmpowered.mechaEmpoweredVsMarkedDamageMultiplier).toBeUndefined();
  });

  it("papers mark-kill status-spread DoT (wiki sum × type fraction / CD)", () => {
    // Wiki: Slash 100 + Toxin 400 → Slash (500)×0.35=175, Toxin (500)×0.5=250
    const dps = computeMechaSpreadPaperDps({
      pieces: 4,
      enemies: 2,
      dotTicks: [
        { type: "slash", damagePerTick: 100 },
        { type: "toxin", damagePerTick: 400 },
      ],
      remainingDurationSec: 6,
    });
    // tickSum = 175+250 = 425; 2 enemies × 425 × 6 / 15s CD = 340
    expect(dps).toBeCloseTo(340, 5);

    // Cascade: +2 more enemies in the same CD → 4 × 425 × 6 / 15 = 680
    const withCascade = computeMechaSpreadPaperDps({
      pieces: 4,
      enemies: 2,
      cascadeEnemies: 2,
      dotTicks: [
        { type: "slash", damagePerTick: 100 },
        { type: "toxin", damagePerTick: 400 },
      ],
      remainingDurationSec: 6,
    });
    expect(withCascade).toBeCloseTo(680, 5);

    // Wiki Sepsis Claws: Toxin tick (500)×0.5×(1+3.30)=1075; Slash unchanged 175
    const sepsis = sumClawElementalBonuses(
      [{ modId: "sepsis_claws", rank: 10, slotIndex: 0 }],
      modsMap(),
    );
    expect(sepsis.toxin).toBeCloseTo(3.3, 5);
    const withClaw = computeMechaSpreadPaperDps({
      pieces: 4,
      enemies: 1,
      dotTicks: [
        { type: "slash", damagePerTick: 100 },
        { type: "toxin", damagePerTick: 400 },
      ],
      remainingDurationSec: 6,
      clawElementalBonuses: sepsis,
    });
    // tickSum = 175 + 1075 = 1250; 1 × 1250 × 6 / 15 = 500
    expect(withClaw).toBeCloseTo(500, 5);

    const rifle: Weapon = {
      id: "t",
      name: "T",
      category: "rifle",
      damage: 200,
      impact: 0,
      puncture: 0,
      slash: 100,
      toxin: 100,
      fireRate: 1,
      criticalChance: 0,
      criticalMultiplier: 2,
      statusChance: 1,
      magazine: 30,
      reloadTime: 2,
      multishot: 1,
      triggerType: "Auto",
      modSlots: 8,
      hasPrimaryArcaneSlot: false,
      hasSecondaryArcaneSlot: false,
      isIncarnon: false,
      hasRivenSlot: true,
    };
    const linkage = {
      warframeMods: [{ modId: "mecha_pulse_r3", rank: 3, slotIndex: 0 }],
      companionMods: [{ modId: "mecha_recharge", rank: 5, slotIndex: 0 }],
    };
    const off = calculateWeaponBuild(rifle, [], modsMap(), undefined, DEFAULT_SIM_PARAMS, undefined, linkage);
    const on = calculateWeaponBuild(
      rifle,
      [],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, mechaSpreadEnemies: 3 },
      undefined,
      linkage,
    );
    expect(off.mechaSpreadDps ?? 0).toBe(0);
    expect(on.mechaSpreadDps ?? 0).toBeGreaterThan(0);
    expect(on.burstDps).toBeGreaterThan(off.burstDps);

    const withSepsis = calculateWeaponBuild(
      rifle,
      [],
      modsMap(),
      undefined,
      { ...DEFAULT_SIM_PARAMS, mechaSpreadEnemies: 3 },
      undefined,
      {
        ...linkage,
        companionWeaponMods: [{ modId: "sepsis_claws", rank: 10, slotIndex: 0 }],
      },
    );
    expect(withSepsis.mechaSpreadDps ?? 0).toBeGreaterThan(on.mechaSpreadDps ?? 0);
  });
});

describe("weapon damageBuff gating (verified abilities only)", () => {
  const rifle: Weapon = {
    id: "t",
    name: "T",
    category: "rifle",
    damage: 100,
    impact: 100,
    puncture: 0,
    slash: 0,
    fireRate: 1,
    criticalChance: 0.2,
    criticalMultiplier: 2,
    statusChance: 0,
    magazine: 30,
    reloadTime: 2,
    multishot: 1,
    triggerType: "Auto",
    modSlots: 8,
    hasPrimaryArcaneSlot: false,
    hasSecondaryArcaneSlot: false,
    isIncarnon: false,
    hasRivenSlot: true,
  };

  const wfStats = {
    abilityStrength: 2,
  } as WarframeCalculatedStats;

  it("does not treat Breach Surge spark mult as a weapon damage buff", () => {
    const surge: Ability = {
      name: "Breach Surge",
      energyCost: 50,
      description: "sparks",
      // legacy mistaken field — must not apply even if present
      damageBuff: 2,
    };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Breach Surge"],
    };
    const buffs = resolveWeaponExternalBuffs(
      rifle,
      { warframeId: "wisp", warframeStats: wfStats, warframeAbilities: [surge] },
      sim,
    );
    expect(buffs.filter((b) => b.label === "Breach Surge")).toHaveLength(0);
  });

  it("still applies verified Roar", () => {
    const roar: Ability = { name: "Roar", energyCost: 75, description: "", damageBuff: 0.5 };
    const sim: SimulationParams = {
      ...DEFAULT_SIM_PARAMS,
      activeWeaponAbilityBuffs: ["Roar"],
    };
    const buffs = resolveWeaponExternalBuffs(
      rifle,
      { warframeId: "rhino", warframeStats: wfStats, warframeAbilities: [roar] },
      sim,
    );
    expect(buffs).toHaveLength(1);
    expect(buffs[0]!.damageMultBonus).toBeCloseTo(1.0, 5);
  });
});
