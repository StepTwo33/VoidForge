import type { ArcaneEffectDef, ArcaneEffectLine, ArcaneTrigger } from "@/data/arcane-effects";
import { scaleArcaneEffectLine } from "@/lib/calc/arcane-utils";

/** Triggers where the effect applies on every qualifying event (no proc roll). */
const ALWAYS_ON_TRIGGERS = new Set<ArcaneTrigger>(["passive", "onHit", "onStatus", "onFreeze"]);

/** Panel-only / metadata stats — never scaled by proc uptime for DPS. */
const METADATA_STATS = new Set([
  "buffDuration",
  "cooldown",
  "bigCritThreshold",
  "voidConversion",
  "zoneDamage",
  "zoneDamagePerSec",
  "zoneDuration",
  "zoneRadius",
  "zoneBuffRadius",
  "zoneProcChance",
  "procAuraRadius",
  "healthOrbPulse",
  "healthFromOrbs",
  "allyHealRadius",
  "allyEnergyRadius",
  "voidTrapRadius",
  "voidTrapDuration",
  "voidTrapTetherCount",
  "debilitateStackThreshold",
  "escapistStackCap",
  "stackCap",
  "removeShields",
  "persistenceDamageCapPerSecond",
  "overguardDamage",
  "procDamageMultiplier",
  "corrosiveDamage",
  "enemyResistanceReduction",
  "damagePerEnergy",
  "reloadDamageRamp",
  "energyRegen",
  "voidSlingRadius",
  "kdDriveSpeed",
]);

/** Build stats that represent proc chance, not direct bonuses. */
const PROC_CHANCE_STATS = new Set([
  "healthRegenChance",
  "killProcChance",
  "headshotProcChance",
  "statusProcChance",
  "fireRateOnCritChance",
  "reloadProcChance",
  "holsterDamageChance",
  "meleeDamageChance",
  "attackSpeedChance",
  "shieldRestoreChance",
  "shieldRegenChance",
  "armorBonusChance",
  "invisibilityChance",
  "zoneProcChance",
  "energyPickupChance",
  "healthPickupChance",
  "primaryDamageChance",
  "dodgeSpeedChance",
  "lifeStealChance",
  "duplicateAttackChance",
  "freeAbilityCastChance",
  "headshotHealthRegenChance",
  "pullChance",
  "knockdownChance",
  "nullifyChance",
  "universalOrbChance",
]);

export function isArcaneMetadataStat(stat: string): boolean {
  return METADATA_STATS.has(stat);
}

/**
 * Stack multiplier for an effect line.
 * Per-stack bonuses (`stacking: true`) always × stacks.
 * Duration/cooldown/radius windows and `constantAtAllRanks` caps do not × stacks
 * (fixes Hot Shot 10s→500s, Fortification 10s→300s, Exhilarate 10s→30s).
 */
export function arcaneEffectStackMultiplier(
  def: ArcaneEffectDef,
  line: ArcaneEffectLine,
  stacks: number,
): number {
  if (line.stacking) return Math.max(stacks, 1);
  if (line.constantAtAllRanks) return 1;
  // Window / radius / threshold metadata is never a per-stack multiplier.
  if (
    line.stat === "buffDuration" ||
    line.stat === "cooldown" ||
    line.stat === "bigCritThreshold" ||
    line.stat === "zoneDuration" ||
    line.stat === "zoneRadius" ||
    line.stat === "zoneBuffRadius" ||
    line.stat === "allyEnergyRadius" ||
    line.stat === "allyHealRadius" ||
    line.stat === "procAuraRadius" ||
    line.stat === "coldSpreadRadius"
  ) {
    return 1;
  }
  if (def.trigger === "stacks") return Math.max(stacks, 1);
  return 1;
}

export function isArcaneProcChanceStat(stat: string): boolean {
  if (PROC_CHANCE_STATS.has(stat)) return true;
  // Status chance bonuses are real build stats — not proc rolls.
  if (stat === "statusChance" || stat === "ampStatusChance" || stat === "statusChancePerHit") {
    return false;
  }
  if (stat.endsWith("Chance") && stat !== "criticalChance") return true;
  return false;
}

/** Proc chance % at rank (first proc-chance line on the def). */
export function getArcaneProcChancePercent(def: ArcaneEffectDef, rank: number): number | null {
  for (const line of def.effects) {
    if (!isArcaneProcChanceStat(line.stat)) continue;
    return scaleArcaneEffectLine(line, rank, def.maxRank);
  }
  return null;
}

/** Buff duration in seconds when present. */
export function getArcaneBuffDuration(def: ArcaneEffectDef, rank: number): number | null {
  const line = def.effects.find((e) => e.stat === "buffDuration");
  if (!line) return null;
  return scaleArcaneEffectLine(line, rank, def.maxRank);
}

/**
 * Expected fraction of combat time a proc buff contributes to DPS (0–1).
 * - passive / stacks: caller handles separately
 * - onHit/onStatus: full uptime when sim active
 * - proc buffs: procChance × duration factor
 */
export function getArcaneProcUptime(
  def: ArcaneEffectDef,
  rank: number,
  simStacks: number,
  fireRate = 1,
): number {
  if (simStacks <= 0) return 0;

  if (def.trigger === "passive") return 1;

  if (def.trigger === "stacks") return 1;

  if (ALWAYS_ON_TRIGGERS.has(def.trigger)) return 1;

  const procPct = getArcaneProcChancePercent(def, rank);
  const duration = getArcaneBuffDuration(def, rank);

  if (procPct == null) {
    // Conditional / onKill without explicit proc line — moderate uptime in combat sim.
    return def.trigger === "conditional" ? 0.5 : 0.65;
  }

  const p = Math.min(1, Math.max(0, procPct / 100));

  if (duration != null && duration > 0) {
    // Refreshable buff: higher fire rate ⇒ more proc opportunities during the buff window.
    const procsInWindow = 1 - Math.pow(1 - p, Math.max(1, fireRate * Math.min(duration, 12)));
    const durationFactor = Math.min(1, duration / 10);
    return Math.min(1, procsInWindow * 0.85 + p * durationFactor * 0.35);
  }

  return p;
}

/** Scale an effect value for build math (not panel tracking). */
export function scaleArcaneEffectForBuild(
  def: ArcaneEffectDef,
  line: ArcaneEffectLine,
  rank: number,
  stacks: number,
  simStacks: number,
  fireRate = 1,
): number {
  const rankScaled = scaleArcaneEffectLine(line, rank, def.maxRank);
  let value = rankScaled * arcaneEffectStackMultiplier(def, line, stacks);

  if (isArcaneMetadataStat(line.stat) || isArcaneProcChanceStat(line.stat)) {
    return value;
  }

  if (def.trigger === "passive" || def.trigger === "stacks") {
    return value;
  }

  const uptime = getArcaneProcUptime(def, rank, simStacks, fireRate);
  return value * uptime;
}

/** Rate of hits that count as a Big Critical Hit (orange tier, crit > 100%). */
export function bigCritProcRate(critChance: number): number {
  if (critChance <= 1) return 0;
  const tier = Math.floor(critChance);
  const remainder = critChance - tier;
  if (tier < 1) return 0;
  if (tier === 1) return remainder;
  return 1;
}

/** Steady-state Enervate crit stacks before reset (simplified). */
export function estimateEnervateCritStacks(
  critChance: number,
  perHitBonusPct: number,
  bigCritThreshold: number,
  simStacks: number,
): number {
  if (simStacks <= 0) return 0;
  const bigRate = bigCritProcRate(critChance);
  if (bigRate <= 0 || bigCritThreshold <= 0) {
    return Math.min(6, Math.max(1, Math.floor(simStacks / 2)));
  }
  const hitsPerReset = bigCritThreshold / Math.max(bigRate, 0.05);
  return Math.min(10, Math.max(1, Math.floor(hitsPerReset / 2)));
}
