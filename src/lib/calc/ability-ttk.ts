import type { Ability, CalculatedStats, WarframeCalculatedStats } from "@/lib/types";
import { DEFAULT_SIM_PARAMS } from "@/lib/types";
import {
  calculateTTK,
  ENEMY_TYPES,
  scaleEnemyPools,
  type EnemyType,
  type TTKResult,
} from "@/lib/calc/ttk";

export interface AbilityTTKEntry {
  key: string;
  abilityName: string;
  slot: number;
  helminth?: boolean;
  /** Human-readable damage line for the panel header. */
  damageSummary: string;
  pseudoStats: CalculatedStats;
  ignoreArmor: boolean;
}

function normalizeDamageType(raw?: string): { type: string; ignoreArmor: boolean } {
  if (!raw) return { type: "heat", ignoreArmor: false };
  const lower = raw.toLowerCase();
  if (lower.includes("finisher") || lower === "true") {
    return { type: "slash", ignoreArmor: true };
  }
  const elementalMatch = lower.match(
    /\b(impact|puncture|slash|heat|cold|toxin|electricity|blast|corrosive|viral|gas|magnetic|radiation|void|tau)\b/,
  );
  if (elementalMatch) {
    const t = elementalMatch[1];
    return { type: t, ignoreArmor: false };
  }
  return { type: "heat", ignoreArmor: false };
}

function assignDamageToStats(stats: CalculatedStats, type: string, amount: number): void {
  if (type === "impact") stats.impact = amount;
  else if (type === "puncture") stats.puncture = amount;
  else if (type === "slash") stats.slash = amount;
  else stats.elements = [{ type, value: amount }];
  stats.totalDamage = amount;
}

export function abilityHasKillDamage(ability: Ability): boolean {
  if ((ability.damage ?? 0) > 0) return true;
  if ((ability.directDamage ?? 0) > 0) return true;
  if ((ability.aoeDamage ?? 0) > 0) return true;
  if ((ability.damagePerSecond ?? 0) > 0) return true;
  return false;
}

/** Scaled per-hit or per-second ability damage for TTK modeling. */
export function resolveAbilityHitDamage(ability: Ability, strength: number): number {
  const str = strength;
  if ((ability.damagePerSecond ?? 0) > 0) {
    return ability.damagePerSecond! * str;
  }
  const base = (ability.damage ?? 0) * str;
  if (base > 0) return base;
  const direct = (ability.directDamage ?? 0) * str;
  const aoe = (ability.aoeDamage ?? 0) * str;
  if (direct > 0 && aoe > 0) return direct + aoe;
  return Math.max(direct, aoe);
}

function resolveAbilityFireRate(ability: Ability): number {
  if ((ability.damagePerSecond ?? 0) > 0) return 1;
  if (ability.cooldown && ability.cooldown > 0) return 1 / ability.cooldown;
  if (ability.castTime && ability.castTime > 0) return 1 / ability.castTime;
  return 1.5;
}

function formatDamageSummary(ability: Ability, hitDamage: number, fireRate: number): string {
  if ((ability.damagePerSecond ?? 0) > 0) {
    return `${Math.round(hitDamage).toLocaleString()} DPS`;
  }
  const castsPerSec = fireRate.toFixed(2);
  return `${Math.round(hitDamage).toLocaleString()} dmg/cast · ~${castsPerSec}/s`;
}

export function abilityToPseudoWeaponStats(
  ability: Ability,
  wfStats: WarframeCalculatedStats,
): { stats: CalculatedStats; ignoreArmor: boolean } | null {
  const hitDamage = resolveAbilityHitDamage(ability, wfStats.abilityStrength);
  if (hitDamage <= 0) return null;

  const fireRate = resolveAbilityFireRate(ability);
  const { type, ignoreArmor } = normalizeDamageType(ability.damageType);

  const stats: CalculatedStats = {
    totalDamage: hitDamage,
    impact: 0,
    puncture: 0,
    slash: 0,
    elements: [],
    rawElements: [],
    fireRate,
    criticalChance: 0,
    criticalMultiplier: 1,
    statusChance: ability.statusChance
      ? Math.min(1, ability.statusChance * wfStats.abilityStrength)
      : 0,
    statusChancePerShot: 0,
    magazine: 0,
    reloadTime: 0,
    multishot: 1,
    burstDps: hitDamage * fireRate,
    sustainedDps: hitDamage * fireRate,
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
    simParams: { ...DEFAULT_SIM_PARAMS },
    galvanizedMultishotOnKill: 0,
    galvanizedDamagePerStatus: 0,
    berserkerFuryBonus: 0,
    weepingWoundsBonus: 0,
  };

  assignDamageToStats(stats, type, hitDamage);
  stats.statusChancePerShot = stats.statusChance;
  return { stats, ignoreArmor };
}

export function calculateAbilityTTK(
  entry: Pick<AbilityTTKEntry, "pseudoStats" | "ignoreArmor">,
  enemy: EnemyType,
  level: number,
  opts?: { steelPath?: boolean },
): TTKResult {
  const base = calculateTTK(entry.pseudoStats, enemy, level, opts);
  if (!entry.ignoreArmor) return base;

  const pools = scaleEnemyPools(enemy, level, opts);
  const pool = pools.health + pools.shield;
  const dps = base.sustainedDps > 0 ? base.sustainedDps : base.burstDps;
  if (dps <= 0) return base;

  const ttk = pool / dps;
  const casts = Math.ceil(pool / (entry.pseudoStats.totalDamage || 1));
  return {
    ...base,
    scaledArmor: 0,
    armorDR: 0,
    burstDps: dps,
    sustainedDps: dps,
    ttk,
    shotsToKill: casts,
    scaledHealth: pools.health,
    scaledShield: pools.shield,
    effectiveHealth: pool,
  };
}

export function buildAbilityTTKEntries(
  abilities: { ability: Ability; slot: number; helminth?: boolean }[],
  wfStats: WarframeCalculatedStats,
): AbilityTTKEntry[] {
  const entries: AbilityTTKEntry[] = [];
  for (const row of abilities) {
    if (!abilityHasKillDamage(row.ability)) continue;
    const pseudo = abilityToPseudoWeaponStats(row.ability, wfStats);
    if (!pseudo) continue;
    const hit = resolveAbilityHitDamage(row.ability, wfStats.abilityStrength);
    entries.push({
      key: `${row.slot}-${row.ability.name}`,
      abilityName: row.ability.name,
      slot: row.slot,
      helminth: row.helminth,
      damageSummary: formatDamageSummary(row.ability, hit, pseudo.stats.fireRate),
      pseudoStats: pseudo.stats,
      ignoreArmor: pseudo.ignoreArmor,
    });
  }
  return entries;
}

export { ENEMY_TYPES };
