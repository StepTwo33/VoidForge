/**
 * Damage Simulator — paper breakdown + discrete TTK.
 * All armor / viral / corrosive / crit math comes from ttk.ts + crit-utils
 * (wiki Armor / Status Effect). Do not reimplement those formulas here.
 */
import { avgCritMultiplier } from "@/lib/calc/crit-utils";
import {
  combatDamageMultiplier,
  factionBonusFromStats,
  factionDotMultiplier,
} from "@/lib/calc/combat-multipliers";
import {
  ARMOR_MODIFIERS,
  calculateTTK,
  corrosiveArmorRemaining,
  enemyArmorDamageReduction,
  getMod,
  HEALTH_MODIFIERS,
  heatArmorRemaining,
  punctureArmorRemaining,
  scaleArmor,
  scaleHealth,
  scaleShield,
  SHIELD_MODIFIERS,
  viralHealthMultiplier,
  type EnemyType,
  type TTKResult,
} from "@/lib/calc/ttk";
import { DEFAULT_SIM_PARAMS, type CalculatedStats } from "@/lib/types";

export interface DamageSimInputs {
  dmgTypes: Record<string, number>;
  fireRate: number;
  critChance: number;
  critMulti: number;
  multishot: number;
  statusChance: number;
  magazine: number;
  reloadTime: number;
  statusDamageBonus: number;
  headshotDamageBonus: number;
  factionBonuses: Record<string, number>;
  applyHeadshots: boolean;
  /** Latron Flensing Spikes — passed through to discrete TTK. */
  punctureArmorStripPerStack?: number;
}

export interface DamageSimTypeRow {
  type: string;
  raw: number;
  vsShield: number;
  vsHealth: number;
  weight: number;
}

export interface DamageSimResult {
  hp: number;
  shield: number;
  /** Scaled armor before status strips. */
  baseArmor: number;
  /** Armor after corrosive (+ heat) strip used for paper breakdown. */
  armor: number;
  armorDR: number;
  effectiveHP: number;
  typeBreakdown: DamageSimTypeRow[];
  avgCrit: number;
  rawPerShot: number;
  shieldDmgPerShot: number;
  healthDmgPerShot: number;
  procsPerSec: number;
  viralMult: number;
  corrosiveStrippedArmor: number;
  slashDotDps: number;
  heatDotDps: number;
  toxinDotDps: number;
  totalDotDps: number;
  burstDps: number;
  sustainedDps: number;
  shieldBurstDps: number;
  healthBurstDps: number;
  shieldTime: number;
  healthTime: number;
  /** Discrete shot-by-shot TTK (same engine as builder stats panel). */
  ttk: number;
  shotsToKill: number;
  peakViralStacks: number;
  peakCorrosiveStacks: number;
  discrete: TTKResult;
}

/** Build a CalculatedStats stub so the discrete TTK engine can run on hand-entered values. */
export function simInputsToCalculatedStats(input: DamageSimInputs, enemyFaction: string): CalculatedStats {
  const impact = input.dmgTypes.impact ?? 0;
  const puncture = input.dmgTypes.puncture ?? 0;
  const slash = input.dmgTypes.slash ?? 0;
  const elements = Object.entries(input.dmgTypes)
    .filter(([type, value]) => value > 0 && !["impact", "puncture", "slash"].includes(type))
    .map(([type, value]) => ({ type, value }));
  const totalDamage = Object.values(input.dmgTypes).reduce((s, v) => s + v, 0);

  return {
    totalDamage,
    impact,
    puncture,
    slash,
    elements,
    rawElements: elements.map((e) => ({ ...e })),
    fireRate: input.fireRate,
    effectiveFireRate: input.fireRate,
    criticalChance: input.critChance,
    criticalMultiplier: input.critMulti,
    statusChance: input.statusChance,
    statusChancePerShot: input.statusChance,
    magazine: input.magazine,
    reloadTime: input.reloadTime,
    multishot: input.multishot,
    burstDps: 0,
    sustainedDps: 0,
    statusProcs: [],
    heavyAttackDamage: 0,
    heavyAttackWindUp: 0,
    comboCount: 0,
    comboDuration: 0,
    heavyAttackEfficiency: 0,
    comboMultiplier: 1,
    heavyAttackComboMultiplier: 1,
    conditionOverloadBonus: 0,
    bloodRushStacks: 0,
    weavingFrameBonus: 0,
    simParams: {
      ...DEFAULT_SIM_PARAMS,
      applyHeadshots: input.applyHeadshots,
      targetFaction: enemyFaction,
    },
    galvanizedMultishotOnKill: 0,
    galvanizedDamagePerStatus: 0,
    berserkerFuryBonus: 0,
    weepingWoundsBonus: 0,
    moddedBaseDamage: totalDamage,
    statusDamageBonus: input.statusDamageBonus,
    headshotDamageBonus: input.headshotDamageBonus,
    factionBonuses: { ...input.factionBonuses },
    punctureArmorStripPerStack: input.punctureArmorStripPerStack,
  };
}

function typeVsLayer(
  type: string,
  raw: number,
  enemy: EnemyType,
  currentArmor: number,
  viralMult: number,
  layer: "shield" | "health",
): number {
  if (layer === "shield") {
    if (type === "toxin") return 0;
    if (enemy.shieldType === "none") return raw;
    return raw * (1 + getMod(SHIELD_MODIFIERS, enemy.shieldType, type));
  }
  const hm = getMod(HEALTH_MODIFIERS, enemy.healthType, type);
  let dmg = raw * (1 + hm) * viralMult;
  if (currentArmor > 0 && enemy.armorType !== "none") {
    const am = getMod(ARMOR_MODIFIERS, enemy.armorType, type);
    const effArmor = currentArmor * Math.max(0, 1 - am);
    dmg *= 1 - enemyArmorDamageReduction(effArmor);
  }
  return dmg;
}

/**
 * Run the damage simulator.
 * Paper DPS / type breakdown use wiki helpers; TTK / shots come from calculateTTK.
 */
export function runDamageSim(
  input: DamageSimInputs,
  enemy: EnemyType,
  level: number,
): DamageSimResult | null {
  const totalRaw = Object.values(input.dmgTypes).reduce((s, v) => s + v, 0);
  if (totalRaw <= 0) return null;

  const stats = simInputsToCalculatedStats(input, enemy.faction);
  const discrete = calculateTTK(stats, enemy, level);

  const hp = scaleHealth(enemy.baseHealth, level, enemy.faction);
  const baseArmor = scaleArmor(enemy.baseArmor, level);
  const shield = scaleShield(enemy.baseShield, level);

  const procsPerSec = input.fireRate * input.statusChance * input.multishot;
  const corrosiveWeight = (input.dmgTypes.corrosive ?? 0) / totalRaw;
  const viralWeight = (input.dmgTypes.viral ?? 0) / totalRaw;
  const heatWeight = (input.dmgTypes.heat ?? 0) / totalRaw;
  const punctureWeight = (input.dmgTypes.puncture ?? 0) / totalRaw;
  const punctureStrip = input.punctureArmorStripPerStack ?? 0;

  // Prefer discrete peak stacks when the fight finishes; otherwise estimate from ~3s of procs.
  const corStacks =
    discrete.ttk !== Infinity && (discrete.peakCorrosiveStacks ?? 0) > 0
      ? discrete.peakCorrosiveStacks!
      : Math.min(10, procsPerSec * corrosiveWeight * 3);
  const virStacks =
    discrete.ttk !== Infinity && (discrete.peakViralStacks ?? 0) > 0
      ? discrete.peakViralStacks!
      : Math.min(10, procsPerSec * viralWeight * 3);
  const heatActive = heatWeight > 0 && procsPerSec > 0;
  const punctureStacks =
    punctureStrip > 0
      ? Math.min(1 / punctureStrip, procsPerSec * punctureWeight * 3)
      : 0;

  const viralMult = viralHealthMultiplier(virStacks);
  const corrosiveStrippedArmor =
    baseArmor *
    corrosiveArmorRemaining(corStacks) *
    heatArmorRemaining(heatActive) *
    punctureArmorRemaining(punctureStacks, punctureStrip);
  const armor = corrosiveStrippedArmor;
  const armorDR = enemyArmorDamageReduction(armor);

  const types = Object.entries(input.dmgTypes).filter(([, v]) => v > 0);
  const typeBreakdown: DamageSimTypeRow[] = types.map(([type, raw]) => {
    const weight = raw / totalRaw;
    const vsShield =
      shield > 0 && enemy.shieldType !== "none"
        ? typeVsLayer(type, raw, enemy, armor, 1, "shield")
        : raw;
    const vsHealth = typeVsLayer(type, raw, enemy, armor, viralMult, "health");
    return { type, raw, vsShield, vsHealth, weight };
  });

  const acm = avgCritMultiplier(input.critChance, input.critMulti);
  const shieldSum = typeBreakdown.reduce((s, t) => s + t.vsShield, 0);
  const healthSum = typeBreakdown.reduce((s, t) => s + t.vsHealth, 0);
  const factionBonus = factionBonusFromStats(input.factionBonuses, enemy.faction);
  const combatMult = combatDamageMultiplier({
    factionBonus,
    applyHeadshots: input.applyHeadshots,
    headshotDamageBonus: input.headshotDamageBonus,
  });
  const factionDot = factionDotMultiplier(factionBonus);
  const statusDmg = 1 + input.statusDamageBonus;
  const head = input.applyHeadshots ? 2 * (1 + input.headshotDamageBonus) : 1;
  const dotMult = statusDmg * factionDot * head;

  const rawPerShot = totalRaw * input.multishot * acm * combatMult;
  const shieldDmgPerShot = shieldSum * input.multishot * acm * combatMult;
  const healthDmgPerShot = healthSum * input.multishot * acm * combatMult;

  // DoT paper DPS — tick fractions match ttk spawnDot (slash 0.35, heat/toxin 0.5)
  let slashDotDps = 0;
  const slashRaw = input.dmgTypes.slash ?? 0;
  if (slashRaw > 0 && procsPerSec > 0) {
    const pps = procsPerSec * (slashRaw / totalRaw);
    const tickDmg = totalRaw * 0.35 * acm * dotMult;
    const hm = getMod(HEALTH_MODIFIERS, enemy.healthType, "slash");
    // Slash DoT is cinematic (ignores armor); 7 ticks / 6s → duty factor 7/6
    slashDotDps = pps * tickDmg * (7 / 6) * (1 + hm) * viralMult;
  }

  let heatDotDps = 0;
  const heatRaw = input.dmgTypes.heat ?? 0;
  if (heatRaw > 0 && procsPerSec > 0) {
    const pps = procsPerSec * (heatRaw / totalRaw);
    const tickDmg = totalRaw * 0.5 * acm * dotMult;
    const hm = getMod(HEALTH_MODIFIERS, enemy.healthType, "heat");
    heatDotDps = pps * tickDmg * (1 + hm) * (1 - armorDR);
  }

  let toxinDotDps = 0;
  const toxinRaw = input.dmgTypes.toxin ?? 0;
  if (toxinRaw > 0 && procsPerSec > 0) {
    const pps = procsPerSec * (toxinRaw / totalRaw);
    const tickDmg = totalRaw * 0.5 * acm * dotMult;
    const hm = getMod(HEALTH_MODIFIERS, enemy.healthType, "toxin");
    toxinDotDps = pps * tickDmg * (1 + hm) * (1 - armorDR);
  }

  const totalDotDps = slashDotDps + heatDotDps + toxinDotDps;
  const shieldBurstDps = shieldDmgPerShot * input.fireRate;
  const healthBurstDps = healthDmgPerShot * input.fireRate + totalDotDps;
  const sustainFactor =
    input.magazine > 0 && input.reloadTime > 0 && input.fireRate > 0
      ? input.magazine / input.fireRate / (input.magazine / input.fireRate + input.reloadTime)
      : 1;

  const shieldTime = shield > 0 && shieldBurstDps > 0 ? shield / shieldBurstDps : 0;
  const healthTime = healthBurstDps > 0 ? hp / healthBurstDps : Infinity;

  return {
    hp,
    shield,
    baseArmor,
    armor,
    armorDR,
    effectiveHP: hp + shield,
    typeBreakdown,
    avgCrit: acm,
    rawPerShot,
    shieldDmgPerShot,
    healthDmgPerShot,
    procsPerSec,
    viralMult,
    corrosiveStrippedArmor,
    slashDotDps,
    heatDotDps,
    toxinDotDps,
    totalDotDps,
    burstDps: healthBurstDps,
    sustainedDps: healthBurstDps * sustainFactor,
    shieldBurstDps,
    healthBurstDps,
    shieldTime,
    healthTime,
    ttk: discrete.ttk,
    shotsToKill: discrete.shotsToKill,
    peakViralStacks: discrete.peakViralStacks ?? 0,
    peakCorrosiveStacks: discrete.peakCorrosiveStacks ?? 0,
    discrete,
  };
}
