// Time-to-Kill Calculator
// Post-Update 32 S-curve scaling, proper armor/shield/health type interactions,
// Viral/Corrosive status accounting, Slash/Heat/Toxin DoT damage, reload cycles
import { CalculatedStats } from "../types";
import { avgCritMultiplier } from "./crit-utils";
import {
  combatDamageMultiplier,
  factionBonusFromStats,
  factionDotMultiplier,
  factionHitMultiplier,
  factionTripleDotMultiplier,
  headCritFactor,
  headshotMultiplier,
} from "./combat-multipliers";

export type { EnemyType, EnemyKind } from "@/data/enemies";
export {
  ENEMY_TYPES,
  getEnemyById,
  COMMON_TTK_ENEMY_IDS,
  getCommonTtkEnemies,
  filterTtkEnemies,
  isCommonTtkEnemyId,
} from "@/data/enemies";
import type { EnemyType } from "@/data/enemies";
import { enemyDamageTypeMultiplier } from "@/data/faction-damage-modifiers";
import { BLAST_FUSE_SECONDS, DOT_BASE_DURATION, dotFirstTickDelay, dotTickCount } from "@/lib/calc/dot-ticks";

// ── Damage type modifiers (Update 36) ─────────────────────────────────
// Health / armor / shield classes were removed in Update 36; vulnerabilities and
// resistances come only from the enemy's faction (wiki Damage, Damage/Overview Table).
export { enemyDamageTypeMultiplier } from "@/data/faction-damage-modifiers";

// ── Level scaling (wiki Enemy Level Scaling) ──────────────────────────
/** Smoothstep weight between the lower (L) and upper (U) level-difference bounds. */
function smoothstepWeight(d: number, lo: number, hi: number): number {
  const t = Math.min(1, Math.max(0, (d - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
}

/**
 * Enemy armor at level (wiki Enemy Level Scaling § Armor; base level 1):
 *   f1 = 1 + 0.005·d^1.75, f2 = 1 + 0.4·d^0.75, mult = f1 + (f2 − f1)·s  (s: smoothstep 70→80)
 * Initial armor is clamped to [200, 2700] (wiki Armor); removal can still go below 200.
 */
export function scaleArmor(base: number, level: number): number {
  if (base <= 0) return 0;
  const d = Math.max(0, level - 1);
  const f1 = 1 + 0.005 * Math.pow(d, 1.75);
  const f2 = 1 + 0.4 * Math.pow(d, 0.75);
  const mult = f1 + (f2 - f1) * smoothstepWeight(d, 70, 80);
  return Math.min(2700, Math.max(200, base * mult));
}

/**
 * Enemy armor damage reduction (wiki Armor § Enemy Damage Reduction Formula):
 *   DR = 0.9 × √(NetArmor / 2700) for NetArmor ≤ 2700; above that, NetArmor / (NetArmor + 300).
 * Tenno armor still uses armor/(armor+300) — see calculator warframe EHP.
 */
export function enemyArmorDamageReduction(armor: number): number {
  if (armor <= 0) return 0;
  if (armor > 2700) return armor / (armor + 300);
  return 0.9 * Math.sqrt(armor / 2700);
}

/**
 * Corrosive status armor remaining fraction (wiki Status Effect).
 * Stack 1: −26%; stacks 2–10: −6% each of original; max −80% at 10 stacks.
 * Fractional stacks (TTK estimates) are linearly interpolated.
 */
export function corrosiveArmorRemaining(stacks: number): number {
  if (stacks <= 0) return 1;
  const s = Math.min(10, stacks);
  const reductionAt = (n: number) => {
    if (n <= 0) return 0;
    return Math.min(0.8, 0.26 + 0.06 * Math.max(0, n - 1));
  };
  const lo = Math.floor(s);
  const hi = Math.ceil(s);
  if (lo === hi) return 1 - reductionAt(lo);
  const t = s - lo;
  return 1 - (reductionAt(lo) * (1 - t) + reductionAt(hi) * t);
}

/**
 * Flensing Spikes-style: remove `stripPerStack` of original armor per Puncture stack.
 * Wiki Latron: 20%/stack → 5 stacks full strip. Fractional stacks interpolate.
 */
export function punctureArmorRemaining(stacks: number, stripPerStack: number): number {
  if (stripPerStack <= 0 || stacks <= 0) return 1;
  const maxStacks = 1 / stripPerStack;
  const s = Math.min(maxStacks, stacks);
  return Math.max(0, 1 - stripPerStack * s);
}

/**
 * Average status procs per shot (wiki Status Effect § Multishot).
 * Avg procs = Multishot × Status Chance (SC may exceed 100% for multi-procs).
 * Not the same as arsenal "chance of at least one proc" = 1−(1−SC)^MS.
 */
export function averageProcsPerShot(statusChance: number, multishot: number): number {
  const sc = Math.max(0, statusChance);
  const ms = Math.max(0, multishot);
  return sc * ms;
}

type ScaleCurve = { c1: number; e1: number; c2: number; e2: number };

/** Wiki Enemy Level Scaling § Health (base level 1, smoothstep 70→80 on level difference). */
const HEALTH_CURVES: Record<string, ScaleCurve> = {
  grineer: { c1: 0.015, e1: 2.12, c2: 10.7332, e2: 0.72 },
  corpus: { c1: 0.015, e1: 2.12, c2: 13.4165, e2: 0.55 },
  infested: { c1: 0.0225, e1: 2.12, c2: 16.0998, e2: 0.72 },
  corrupted: { c1: 0.015, e1: 2.1, c2: 10.7332, e2: 0.685 },
  techrot: { c1: 0.02, e1: 2.12, c2: 15.0998, e2: 0.7 },
  /** Murmur, Sentient and Unaffiliated. */
  other: { c1: 0.015, e1: 2, c2: 10.7332, e2: 0.5 },
};

/** Wiki Enemy Level Scaling § Shields. */
const SHIELD_CURVES: Record<string, ScaleCurve> = {
  corpus: { c1: 0.02, e1: 1.76, c2: 2, e2: 0.76 },
  corrupted: { c1: 0.02, e1: 1.75, c2: 2, e2: 0.75 },
  techrot: { c1: 0.02, e1: 1.76, c2: 3.5, e2: 0.76 },
  /** Grineer and Sentient (also used for factions the wiki lists no shield curve for). */
  other: { c1: 0.02, e1: 1.75, c2: 1.6, e2: 0.75 },
};

function healthCurveKey(faction?: string): string {
  switch ((faction ?? "").toLowerCase()) {
    case "grineer":
    case "scaldra":
      return "grineer";
    case "corpus":
      return "corpus";
    case "infested":
      return "infested";
    case "corrupted":
    case "anarch":
    case "anarchs":
      return "corrupted";
    case "techrot":
      return "techrot";
    default:
      return "other";
  }
}

function shieldCurveKey(faction?: string): string {
  const k = healthCurveKey(faction);
  return k === "corpus" || k === "corrupted" || k === "techrot" ? k : "other";
}

function curveMultiplier(c: ScaleCurve, d: number): number {
  const f1 = 1 + c.c1 * Math.pow(d, c.e1);
  const f2 = 1 + c.c2 * Math.pow(d, c.e2);
  return f1 + (f2 - f1) * smoothstepWeight(d, 70, 80);
}

/** Enemy health at level (wiki Enemy Level Scaling § Health, per faction; base level 1). */
export function scaleHealth(base: number, level: number, faction?: string): number {
  const d = level - 1;
  if (d <= 0) return base;
  return base * curveMultiplier(HEALTH_CURVES[healthCurveKey(faction)], d);
}

/** Enemy shields at level (wiki Enemy Level Scaling § Shields, per faction; base level 1). */
export function scaleShield(base: number, level: number, faction?: string): number {
  if (base <= 0 || level <= 1) return base;
  return base * curveMultiplier(SHIELD_CURVES[shieldCurveKey(faction)], level - 1);
}

/**
 * Steel Path mission modifiers (wiki The Steel Path, post-U36):
 * ×2.5 Health & Shields after level scaling. Armor is not multiplied.
 * Level is the enemy's combat level (set node+100 yourself if comparing star-chart nodes).
 */
export const STEEL_PATH_HEALTH_MULT = 2.5;
export const STEEL_PATH_SHIELD_MULT = 2.5;

export type EnemyScaleOpts = {
  /** Apply Steel Path ×2.5 HP/Shield (no armor bonus). */
  steelPath?: boolean;
};

/**
 * Eximus base-stat level factor k(x) (wiki Enemy Level Scaling § Eximus); x = current level.
 * 1 up to 15, then piecewise linear: 1.25 @25, 2.5 @35, 4.5 @50, 6 @100, flat 6 above.
 */
export function eximusLevelFactor(level: number): number {
  const x = level;
  if (x <= 15) return 1;
  if (x <= 25) return 1 + 0.025 * (x - 15);
  if (x <= 35) return 1.25 + 0.125 * (x - 25);
  if (x <= 50) return 2.5 + (2 / 15) * (x - 35);
  if (x <= 100) return 4.5 + 0.03 * (x - 50);
  return 6;
}

/**
 * Eximus base health/shields before faction level scaling (wiki Enemy Level Scaling § Eximus).
 * Health: max(1.1·base, c·(base + 900)·k), c = 0.25 with shields or armor, 0.375 without.
 * Shields: max(1.1·base, base·k). Overguard: see eximusOverguard.
 */
export function eximusBasePools(
  enemy: Pick<EnemyType, "baseHealth" | "baseShield" | "baseArmor">,
  level: number,
): { health: number; shield: number } {
  const k = eximusLevelFactor(level);
  const c = enemy.baseShield > 0 || enemy.baseArmor > 0 ? 0.25 : 0.375;
  const health = Math.max(enemy.baseHealth * 1.1, c * (enemy.baseHealth + 900) * k);
  const shield = enemy.baseShield > 0 ? Math.max(enemy.baseShield * 1.1, enemy.baseShield * k) : 0;
  return { health, shield };
}

/**
 * Eximus Overguard (wiki Enemy Level Scaling § Overguard): base 12 ×
 *   f1 = 1 + 0.0015·q^4, f2 = 1 + 260·q^0.9, smoothstep 45→50, q = level − 1
 * (ignores the unit's BaseLevel). No Steel Path multiplier is documented.
 */
export function eximusOverguard(level: number): number {
  const q = Math.max(0, level - 1);
  const f1 = 1 + 0.0015 * Math.pow(q, 4);
  const f2 = 1 + 260 * Math.pow(q, 0.9);
  return 12 * (f1 + (f2 - f1) * smoothstepWeight(level, 45, 50));
}

/** Level-scaled pools with optional Steel Path HP/Shield multipliers. */
export function scaleEnemyPools(
  enemy: EnemyType,
  level: number,
  opts?: EnemyScaleOpts,
): { health: number; armor: number; shield: number; overguard: number; steelPath: boolean } {
  const steelPath = !!opts?.steelPath;
  const eximus = enemy.kind === "eximus" ? eximusBasePools(enemy, level) : null;
  const baseHealth = eximus ? eximus.health : enemy.baseHealth;
  const baseShield = eximus ? eximus.shield : enemy.baseShield;
  // wiki Enemy Level Scaling: curves take (level − BaseLevel); catalog stats are at BaseLevel.
  // The scale* helpers use (lvl − 1), so shift by BaseLevel − 1 (no down-scaling below it).
  const scaleLevel = Math.max(1, level - Math.max(0, (enemy.baseLevel ?? 1) - 1));
  const health =
    scaleHealth(baseHealth, scaleLevel, enemy.faction) *
    (steelPath ? STEEL_PATH_HEALTH_MULT : 1);
  const shield =
    scaleShield(baseShield, scaleLevel, enemy.faction) * (steelPath ? STEEL_PATH_SHIELD_MULT : 1);
  const armor = scaleArmor(enemy.baseArmor, scaleLevel);
  // wiki Overguard: every Eximus has Overguard (Archwing/Warden/Prosecutor eximus excepted;
  // none of those are in the catalog's eximus bucket).
  const overguard = enemy.kind === "eximus" ? eximusOverguard(level) : 0;
  return { health, armor, shield, overguard, steelPath };
}

// ── Crit averaging — single source of truth in crit-utils ─────────────
/** @deprecated Prefer avgCritMultiplier from crit-utils; alias kept for existing imports. */
export const avgCritMult = avgCritMultiplier;

// ── Viral stack multiplier (wiki Status Effect) ───────────────────────
/** Health damage mult from viral stacks (1 = no viral). Stack1=+100%, +25%/stack → max 4.25×. */
export function viralHealthMultiplier(stacks: number): number {
  if (stacks <= 0) return 1;
  const s = Math.min(10, stacks);
  const lo = Math.floor(s);
  const hi = Math.ceil(s);
  const multAt = (n: number) => (n <= 0 ? 1 : 2.0 + Math.min(n - 1, 9) * 0.25);
  if (lo === hi) return multAt(lo);
  const t = s - lo;
  return multAt(lo) * (1 - t) + multAt(hi) * t;
}

/** Heat status gradually strips up to 50% armor while active. */
export function heatArmorRemaining(heatActive: boolean): number {
  return heatActive ? 0.5 : 1;
}

/**
 * wiki Heat Damage (both wikis): armor strip ramps 15 / 30 / 40 / 50% every 0.5 s after the
 * proc (Status Duration stretches the steps), then after expiry recovers 50 → 40 → 30 → 15 → 0%
 * every 1.5 s.
 */
export const HEAT_STRIP_STEPS = [0, 0.15, 0.3, 0.4, 0.5] as const;
export const HEAT_STRIP_RAMP_STEP = 0.5;
export const HEAT_STRIP_DECAY_STEP = 1.5;

// ── Main TTK interface & calculator ───────────────────────────────────
export interface TTKResult {
  enemy: EnemyType;
  level: number;
  /** Steel Path ×2.5 HP/Shield applied. */
  steelPath?: boolean;
  effectiveHealth: number;
  scaledArmor: number;
  scaledShield: number;
  scaledHealth: number;
  /** Eximus Overguard at level (0 when none). */
  scaledOverguard?: number;
  armorDR: number;
  burstDps: number;
  sustainedDps: number;
  ttk: number;
  shotsToKill: number;
  /** Peak viral stacks reached during discrete sim (0–10). */
  peakViralStacks?: number;
  /** Peak corrosive stacks reached during discrete sim (0–10). */
  peakCorrosiveStacks?: number;
  /** Whether discrete shot-by-shot sim was used. */
  discrete?: boolean;
}

export interface DotInstance {
  /** Absolute time of next tick. */
  nextTick: number;
  remainingTicks: number;
  damagePerTick: number;
  type: string;
  /** Bypass armor (slash cinematic). */
  ignoreArmor: boolean;
  /** Bypass shields (toxin). */
  ignoreShields: boolean;
  /** Apply viral mult (slash/gas). */
  useViral: boolean;
}

function collectDamageTypes(stats: CalculatedStats): { type: string; value: number }[] {
  const dmgTypes: { type: string; value: number }[] = [];
  if (stats.impact > 0) dmgTypes.push({ type: "impact", value: stats.impact });
  if (stats.puncture > 0) dmgTypes.push({ type: "puncture", value: stats.puncture });
  if (stats.slash > 0) dmgTypes.push({ type: "slash", value: stats.slash });
  if (stats.elements) {
    for (const e of stats.elements) {
      if (e.value > 0) dmgTypes.push({ type: e.type, value: e.value });
    }
  }
  return dmgTypes;
}

function shotsPerSecond(stats: CalculatedStats): number {
  if (stats.effectiveFireRate != null && stats.effectiveFireRate > 0) {
    return stats.effectiveFireRate;
  }
  return Math.max(0, stats.fireRate);
}

/** wiki Magnetic: shield/Overguard damage multiplier at `stacks` (expected, may be fractional). */
export function magneticShieldMultiplier(stacks: number): number {
  if (stacks <= 0) return 1;
  if (stacks < 1) return 1 + stacks;
  return 2 + 0.25 * (Math.min(stacks, 10) - 1);
}

/**
 * Direct-hit damage through current armor/viral for one damage type value
 * against a given health/shield layer.
 */
function typeHitDamage(
  type: string,
  value: number,
  enemy: EnemyType,
  currentArmor: number,
  viralMult: number,
  layer: "shield" | "health",
): number {
  const fm = enemyDamageTypeMultiplier(enemy, type);
  if (layer === "shield") {
    if (type === "toxin") return 0; // toxin bypasses — applied to health separately
    return value * fm;
  }
  // health: faction modifier × viral, then armor DR (direct Slash hits still hit armor;
  // only the Slash bleed DoT bypasses it)
  let dmg = value * fm * viralMult;
  if (currentArmor > 0) dmg *= 1 - enemyArmorDamageReduction(currentArmor);
  return dmg;
}

function currentArmorFromStrips(
  baseArmor: number,
  corrosiveStacks: number,
  heatRemaining: number,
  punctureStacks = 0,
  punctureStripPerStack = 0,
): number {
  return (
    baseArmor *
    corrosiveArmorRemaining(corrosiveStacks) *
    heatRemaining *
    punctureArmorRemaining(punctureStacks, punctureStripPerStack)
  );
}

/**
 * Discrete shot-by-shot TTK with expected-value Viral/Corrosive stacking,
 * Heat armor strip, DoT ticks, and reload cycles.
 *
 * Uses expected procs per shot (MS × SC × weight) — deterministic, not Monte Carlo.
 */
export function simulateDiscreteTTK(
  stats: CalculatedStats,
  enemy: EnemyType,
  level: number,
  opts?: { maxTime?: number; maxShots?: number; steelPath?: boolean },
): TTKResult {
  const maxTime = opts?.maxTime ?? 600;
  const maxShots = opts?.maxShots ?? 50_000;
  const steelPath = !!opts?.steelPath;

  const pools = scaleEnemyPools(enemy, level, { steelPath });
  const scaledHp = pools.health;
  const baseArmor = pools.armor;
  const scaledShield = pools.shield;
  const scaledOverguard = pools.overguard;

  const dmgTypes = collectDamageTypes(stats);
  const totalRaw = dmgTypes.reduce((s, d) => s + d.value, 0);
  const zero: TTKResult = {
    enemy,
    level,
    steelPath,
    effectiveHealth: scaledHp + scaledShield + scaledOverguard,
    scaledArmor: baseArmor,
    scaledShield,
    scaledHealth: scaledHp,
    scaledOverguard,
    armorDR: enemyArmorDamageReduction(baseArmor) * 100,
    burstDps: 0,
    sustainedDps: 0,
    ttk: Infinity,
    shotsToKill: Infinity,
    peakViralStacks: 0,
    peakCorrosiveStacks: 0,
    discrete: true,
  };
  if (totalRaw <= 0) return zero;

  const efr = shotsPerSecond(stats);
  if (efr <= 0) return zero;

  const multishot = Math.max(0, stats.multishot);
  const statusChance = Math.max(0, stats.statusChance);
  const procsPerShot = averageProcsPerShot(statusChance, multishot);
  const shotInterval = 1 / efr;

  const moddedBase =
    stats.moddedBaseDamage != null && stats.moddedBaseDamage > 0
      ? stats.moddedBaseDamage
      : totalRaw;
  const sim = stats.simParams;
  const targetFaction = sim?.targetFaction ?? enemy.faction;
  // Critical headshots: 2 × total crit multiplier on headcrit-able factions (wiki Critical Hit).
  const headCrit = headCritFactor(sim?.applyHeadshots, targetFaction);
  const acm = avgCritMultiplier(stats.criticalChance, stats.criticalMultiplier * headCrit);
  // wiki Cold / Puncture (both wikis): Cold adds +0.1 crit damage at 1 stack, +0.05 per
  // further stack (+0.5 at 9), +1.0 while frozen (10 stacks, 3 s, then 3 stacks remain);
  // additive with crit-damage mods, before tiers. Puncture adds flat +5% crit chance per
  // stack (max 5). Neither applies to AoE (no AoE in this sim).
  let coldStacks = 0;
  let frozenUntil = 0;
  let punctureCritStacks = 0;
  const coldCritBonus = (): number => {
    if (frozenUntil > 0) return 1;
    if (coldStacks <= 0) return 0;
    if (coldStacks < 1) return 0.1 * coldStacks;
    return 0.1 + 0.05 * (Math.min(coldStacks, 9) - 1);
  };
  let critScale = 1; // acmNow / acm for the current shot (DoTs inherit the hit's crit)
  const acmAt = (): number =>
    avgCritMultiplier(
      stats.criticalChance + 0.05 * punctureCritStacks,
      (stats.criticalMultiplier + coldCritBonus()) * headCrit,
    );
  const factionBonus = factionBonusFromStats(stats.factionBonuses, targetFaction);
  const factionHit = combatDamageMultiplier({
    factionBonus,
    applyHeadshots: sim?.applyHeadshots,
    headshotDamageBonus: stats.headshotDamageBonus ?? 0,
    weakPointDamageBonus: stats.weakPointDamageBonus ?? 0,
    targetFaction,
    stanceMultiplier:
      sim?.applyStanceMultiplier === false ? 1 : (stats.stanceDamageMultiplier ?? 1),
  });
  // factionHit already includes faction once; DoT needs faction²
  const factionDot = factionDotMultiplier(factionBonus);
  const statusDmg = 1 + (stats.statusDamageBonus ?? 0);
  const head = headshotMultiplier(
    sim?.applyHeadshots,
    stats.headshotDamageBonus ?? 0,
    stats.weakPointDamageBonus ?? 0,
    targetFaction,
  );
  // combatMult for hits uses factionHit; for DoT tick base rebuild without double head/stance
  const dotBase =
    moddedBase *
    acm *
    statusDmg *
    factionDot *
    head *
    (sim?.applyStanceMultiplier === false ? 1 : (stats.stanceDamageMultiplier ?? 1));

  const beamDotFactor = Math.max(0, stats.continuousMultishotFactor ?? 1);

  const typeBonus = (type: string): number => {
    const el = dmgTypes.find((d) => d.type === type);
    if (!el || moddedBase <= 0) return 0;
    return el.value / moddedBase;
  };

  const weight = (type: string): number => {
    const el = dmgTypes.find((d) => d.type === type);
    return el ? el.value / totalRaw : 0;
  };

  // Expected procs of each type per shot
  const expectedProcs = (type: string) => procsPerShot * weight(type);

  let health = scaledHp;
  let shield = scaledShield;
  let viralStacks = 0;
  let corrosiveStacks = 0;
  // wiki Magnetic (both wikis): +100% damage to shields (and Overguard) at 1 stack, +25% per
  // further stack (+325% at 10). When shields break: 3% of max shields per stack as
  // Electricity plus a forced Electricity proc.
  let magneticStacks = 0;
  let shieldBreakHandled = scaledShield <= 0;
  // wiki Overguard: neutral to every damage type except +50% Void; no armor, no Viral;
  // Magnetic amplifies it like shields and its break triggers the same burst.
  let overguard = scaledOverguard;
  let overguardBreakHandled = scaledOverguard <= 0;
  /** Absorb `raw` (faction-neutral) damage of `type` into Overguard; return pass-through fraction. */
  const hitOverguard = (raw: number, voidRaw = 0): number => {
    if (overguard <= 0) return 1;
    const og = (raw + 0.5 * voidRaw) * magneticShieldMult();
    if (og <= 0) return 1;
    const absorbed = Math.min(overguard, og);
    overguard -= absorbed;
    return (og - absorbed) / og;
  };
  const magneticShieldMult = (): number => magneticShieldMultiplier(magneticStacks);
  let punctureStacks = 0;
  // wiki Heat Damage: one consolidated Heat pool — each proc adds a stack and refreshes
  // every stack's duration; one tick per second while the pool is alive.
  let heatEver = false;
  let heatExpire = 0;
  let heatRampStart = 0;
  let heatPool = 0; // tick damage of all live stacks
  let heatPending = 0; // expected tick damage from procs not yet landed
  let heatAcc = 0; // expected Heat procs since the last landed proc
  let heatNextTick = 0;
  let peakViral = 0;
  let peakCorrosive = 0;
  let time = 0;
  let shots = 0;
  let ammo = stats.magazine > 0 ? stats.magazine : Infinity;
  const punctureStrip = stats.punctureArmorStripPerStack ?? 0;
  const punctureStackCap = punctureStrip > 0 ? 1 / punctureStrip : 0;
  const dots: DotInstance[] = [];

  const tickDot = (t: number) => {
    for (const d of dots) {
      while (d.remainingTicks > 0 && d.nextTick <= t + 1e-12) {
        const armorNow = currentArmorFromStrips(
          baseArmor,
          corrosiveStacks,
          heatRemainingAt(d.nextTick),
          punctureStacks,
          punctureStrip,
        );
        const viralMult = d.useViral ? viralHealthMultiplier(viralStacks) : 1;
        // wiki Damage over Time / Shield (both wikis): only Toxin ticks bypass shields; other
        // ticks hit shields first (no armor, no Viral; Magnetic amplifies), overflow to health.
        let toHealthFrac = 1;
        if (overguard > 0) {
          const fm = enemyDamageTypeMultiplier(enemy, d.type);
          const raw = fm > 0 ? d.damagePerTick / fm : 0;
          toHealthFrac = hitOverguard(raw, d.type === "void" ? raw : 0);
        }
        if (!d.ignoreShields && shield > 0 && toHealthFrac > 0) {
          const shieldDmg = d.damagePerTick * toHealthFrac * magneticShieldMult();
          const absorbed = Math.min(shield, shieldDmg);
          shield -= absorbed;
          toHealthFrac *= shieldDmg > 0 ? (shieldDmg - absorbed) / shieldDmg : 0;
        }
        let dmg = d.damagePerTick * viralMult * toHealthFrac;
        if (!d.ignoreArmor && armorNow > 0) {
          dmg *= 1 - enemyArmorDamageReduction(armorNow);
        }
        health -= dmg;
        d.remainingTicks -= 1;
        d.nextTick += 1; // 1s tick interval
        if (health <= 0) return;
      }
    }
    while (heatPool > 0 && heatNextTick <= t + 1e-12) {
      if (heatNextTick > heatExpire + 1e-9) {
        heatPool = 0;
        break;
      }
      const armorNow = currentArmorFromStrips(
        baseArmor,
        corrosiveStacks,
        heatRemainingAt(heatNextTick),
        punctureStacks,
        punctureStrip,
      );
      let heatFrac = 1;
      if (overguard > 0) {
        const fm = enemyDamageTypeMultiplier(enemy, "heat");
        heatFrac = hitOverguard(fm > 0 ? heatPool / fm : 0);
      }
      let dmg = heatPool * heatFrac * viralHealthMultiplier(viralStacks);
      if (armorNow > 0) dmg *= 1 - enemyArmorDamageReduction(armorNow);
      health -= dmg;
      heatNextTick += 1;
      if (health <= 0) return;
    }
    if (heatPool > 0 && heatNextTick > heatExpire + 1e-9) heatPool = 0;
    // prune finished
    for (let i = dots.length - 1; i >= 0; i--) {
      if (dots[i].remainingTicks <= 0) dots.splice(i, 1);
    }
  };

  // Status Duration mods lengthen DoTs (more ticks), matching calculateStatusProcs.
  const durScale = Math.max(0, 1 + (stats.statusDurationBonus ?? 0));
  const dotDuration = DOT_BASE_DURATION * durScale;

  const heatStripIdx = (t: number): number => {
    if (!heatEver || t < heatRampStart) return 0;
    const ramp = (u: number) =>
      Math.min(4, Math.floor((u - heatRampStart) / (HEAT_STRIP_RAMP_STEP * durScale) + 1e-9));
    if (t < heatExpire) return ramp(t);
    return Math.max(0, ramp(heatExpire) - Math.floor((t - heatExpire) / HEAT_STRIP_DECAY_STEP + 1e-9));
  };
  const heatRemainingAt = (t: number): number => 1 - HEAT_STRIP_STEPS[heatStripIdx(t)];

  const spawnDot = (
    type: string,
    expectedCount: number,
    frac: number,
    optsDot: { ignoreArmor: boolean; ignoreShields: boolean; useViral: boolean; typeMult: number },
  ) => {
    if (expectedCount <= 0 || frac <= 0) return;
    // DoT ticks keep their damage type, so the faction modifier applies (wiki Damage).
    // wiki Multishot: beam ticks merge multishot, so damaging status scales twice.
    const perTick =
      frac *
      dotBase *
      critScale *
      beamDotFactor *
      optsDot.typeMult *
      enemyDamageTypeMultiplier(enemy, type);
    if (perTick <= 0) return;
    // Spawn floor(expected) full procs + fractional expected as partial damage
    const full = Math.floor(expectedCount);
    const fracPart = expectedCount - full;
    const addOne = (scale: number) => {
      if (scale <= 0) return;
      dots.push({
        // wiki Damage over Time: Slash/Heat/Toxin first tick 1s after the proc,
        // Electricity/Gas on application; 6 ticks at base duration.
        nextTick: time + dotFirstTickDelay(type),
        remainingTicks: dotTickCount(type, dotDuration),
        damagePerTick: perTick * scale,
        type,
        ignoreArmor: optsDot.ignoreArmor,
        ignoreShields: optsDot.ignoreShields,
        useViral: optsDot.useViral,
      });
    };
    for (let i = 0; i < full; i++) addOne(1);
    if (fracPart > 0.01) addOne(fracPart);
  };

  while (health > 0 && time < maxTime && shots < maxShots) {
    // Reload if needed
    if (ammo <= 0 && stats.magazine > 0 && stats.reloadTime > 0) {
      time += stats.reloadTime;
      ammo = stats.magazine;
      tickDot(time);
      if (health <= 0) break;
    }

    // Process DoTs up to this shot
    tickDot(time);
    if (health <= 0) break;

    const armorNow = currentArmorFromStrips(
      baseArmor,
      corrosiveStacks,
      heatRemainingAt(time),
      punctureStacks,
      punctureStrip,
    );
    const viralMult = viralHealthMultiplier(viralStacks);

    if (frozenUntil > 0 && time >= frozenUntil) {
      frozenUntil = 0;
      coldStacks = 3;
    }
    const acmShot = acmAt();
    critScale = acm > 0 ? acmShot / acm : 1;

    // Overguard layer first (all types incl. Toxin; faction-neutral; Void +50%).
    let ogPass = 1;
    if (overguard > 0) {
      let raw = 0;
      let voidRaw = 0;
      for (const d of dmgTypes) {
        const v = d.value * multishot * acmShot * factionHit;
        raw += v;
        if (d.type === "void") voidRaw += v;
      }
      ogPass = hitOverguard(raw, voidRaw);
    }

    // Direct hit (expected damage per shot)
    let shieldHit = 0;
    let healthHit = 0;
    let toxinBypass = 0;
    const hasShields = shield > 0;
    for (const d of dmgTypes) {
      const base = d.value * multishot * acmShot * factionHit * ogPass;
      if (d.type === "toxin") {
        // toxin bypasses shields → health
        toxinBypass += typeHitDamage(d.type, base, enemy, armorNow, viralMult, "health");
      } else if (hasShields) {
        shieldHit += typeHitDamage(d.type, base, enemy, armorNow, 1, "shield") * magneticShieldMult();
      } else {
        healthHit += typeHitDamage(d.type, base, enemy, armorNow, viralMult, "health");
      }
    }

    if (hasShields) {
      const absorbed = Math.min(shield, shieldHit);
      shield -= absorbed;
      // Overkill past shields: re-apply the overflow fraction with health/armor mods.
      if (shield <= 0 && shieldHit > absorbed) {
        // Overflow fraction is measured in amplified shield damage; health takes the unamplified share.
        const overflowFrac = (shieldHit - absorbed) / Math.max(shieldHit, 1e-9);
        let overflowHealth = 0;
        for (const d of dmgTypes) {
          if (d.type === "toxin") continue;
          const base = d.value * multishot * acmShot * factionHit * ogPass;
          overflowHealth +=
            typeHitDamage(d.type, base, enemy, armorNow, viralMult, "health") * overflowFrac;
        }
        healthHit += overflowHealth;
      }
    }
    health -= healthHit + toxinBypass;

    // Extra Hit (Toxic Lash / Xata): second faction dip; TL is Toxin (bypasses shields).
    // Spores synergy can double Extra Hit damage instances (not DoT stacks).
    const extraFrac = stats.extraHitDamageFraction ?? 0;
    const extraInstances = Math.max(1, stats.extraHitInstances ?? 1);
    if (extraFrac > 0 && totalRaw > 0) {
      const fHit = factionHitMultiplier(factionBonus);
      const extraRaw =
        totalRaw * extraFrac * multishot * acmShot * factionHit * fHit * extraInstances;
      const extraBase =
        extraRaw * hitOverguard(extraRaw, stats.extraHitGuaranteedToxin ? 0 : extraRaw);
      if (stats.extraHitGuaranteedToxin) {
        health -= typeHitDamage("toxin", extraBase, enemy, armorNow, viralMult, "health");
      } else if (hasShields) {
        // Non-Toxin Extra Hit is Xata's Whisper Void damage (Zariman vulnerable after shields).
        const exShield = extraBase * magneticShieldMult();
        const absorbedEx = Math.min(shield, exShield);
        shield -= absorbedEx;
        if (shield <= 0 && exShield > absorbedEx) {
          health -= typeHitDamage(
            "void",
            (extraBase * (exShield - absorbedEx)) / exShield,
            enemy,
            armorNow,
            viralMult,
            "health",
          );
        }
      } else {
        health -= typeHitDamage("void", extraBase, enemy, armorNow, viralMult, "health");
      }
    }

    // Magnetic Overguard-break burst (wiki Overguard): 3%/stack of max Overguard as
    // Electricity + forced Electricity proc.
    if (!overguardBreakHandled && overguard <= 0) {
      overguardBreakHandled = true;
      if (magneticStacks > 0) {
        const burst = 0.03 * Math.min(magneticStacks, 10) * scaledOverguard;
        if (shield > 0) {
          shield = Math.max(0, shield - burst * enemyDamageTypeMultiplier(enemy, "electricity") * magneticShieldMult());
        } else {
          health -= typeHitDamage("electricity", burst, enemy, armorNow, viralMult, "health");
        }
        spawnDot("electricity", 1, 0.5, {
          ignoreArmor: false,
          ignoreShields: false,
          useViral: true,
          typeMult: 1 + typeBonus("electricity"),
        });
      }
    }

    // Magnetic shield-break burst (wiki Magnetic): 3%/stack of max shields as Electricity
    // + one forced Electricity proc.
    if (!shieldBreakHandled && shield <= 0) {
      shieldBreakHandled = true;
      if (magneticStacks > 0) {
        health -= typeHitDamage(
          "electricity",
          0.03 * Math.min(magneticStacks, 10) * scaledShield,
          enemy,
          armorNow,
          viralMult,
          "health",
        );
        spawnDot("electricity", 1, 0.5, {
          ignoreArmor: false,
          ignoreShields: false,
          useViral: true,
          typeMult: 1 + typeBonus("electricity"),
        });
      }
    }

    // Status stack gains (expected)
    magneticStacks = Math.min(10, magneticStacks + expectedProcs("magnetic"));
    const viralGain = expectedProcs("viral");
    const corrGain = expectedProcs("corrosive");
    const heatGain = expectedProcs("heat");
    const punctureGain = punctureStrip > 0 ? expectedProcs("puncture") : 0;
    viralStacks = Math.min(10, viralStacks + viralGain);
    corrosiveStacks = Math.min(10, corrosiveStacks + corrGain);
    if (punctureStackCap > 0) {
      punctureStacks = Math.min(punctureStackCap, punctureStacks + punctureGain);
    }
    peakViral = Math.max(peakViral, viralStacks);
    punctureCritStacks = Math.min(5, punctureCritStacks + expectedProcs("puncture"));
    if (frozenUntil <= 0) {
      coldStacks += expectedProcs("cold");
      // wiki Overguard: at most 4 Cold stacks while Overguard is up (no freeze).
      if (overguard > 0) coldStacks = Math.min(4, coldStacks);
      if (coldStacks >= 10 - 1e-9) {
        coldStacks = 10;
        frozenUntil = time + 3;
      }
    }
    peakCorrosive = Math.max(peakCorrosive, corrosiveStacks);
    if (heatGain > 0) {
      heatPending +=
        heatGain *
        0.5 *
        dotBase *
        critScale *
        beamDotFactor *
        (1 + typeBonus("heat")) *
        enemyDamageTypeMultiplier(enemy, "heat");
      heatAcc += heatGain;
      // A Heat proc lands once the expected count reaches 1 (no per-shot threshold).
      if (heatAcc >= 1 - 1e-9) {
        heatAcc -= Math.floor(heatAcc + 1e-9);
        if (!heatEver || time >= heatExpire) {
          // Pool had expired: stacks gone; strip ramps up from its current recovery level.
          heatPool = 0;
          const idx = heatEver ? heatStripIdx(time) : 0;
          heatRampStart = time - idx * HEAT_STRIP_RAMP_STEP * durScale;
          heatNextTick = time + dotFirstTickDelay("heat");
          heatEver = true;
        }
        heatPool += heatPending;
        heatPending = 0;
        heatExpire = time + dotDuration;
      }
    }

    // DoT procs from this shot
    spawnDot("slash", expectedProcs("slash"), 0.35, {
      ignoreArmor: true,
      ignoreShields: false,
      useViral: true,
      typeMult: 1,
    });
    // Heat DoT: consolidated pool above (wiki Heat Damage), not independent stacks.
    spawnDot("toxin", expectedProcs("toxin"), 0.5, {
      ignoreArmor: false,
      ignoreShields: true,
      useViral: true, // wiki Viral: amplifies every DoT tick dealt to health,
      typeMult: 1 + typeBonus("toxin"),
    });
    spawnDot("electricity", expectedProcs("electricity"), 0.5, {
      ignoreArmor: false,
      ignoreShields: false,
      useViral: true, // wiki Viral: amplifies every DoT tick dealt to health,
      typeMult: 1 + typeBonus("electricity"),
    });
    spawnDot("gas", expectedProcs("gas"), 0.5, {
      ignoreArmor: false,
      ignoreShields: false,
      useViral: true,
      typeMult: 1 + typeBonus("gas"),
    });

    // Blast Detonate: one hit of 0.3 × modded base per proc after the 1.5s fuse
    // (wiki Damage/Blast). No Heat/Cold type bonus; armor and Viral apply.
    const blastProcs = expectedProcs("blast");
    if (blastProcs > 0) {
      const perHit = 0.3 * dotBase * critScale * enemyDamageTypeMultiplier(enemy, "blast") * blastProcs;
      if (perHit > 0) {
        dots.push({
          nextTick: time + BLAST_FUSE_SECONDS * durScale,
          remainingTicks: 1,
          damagePerTick: perHit,
          type: "blast",
          ignoreArmor: false,
          ignoreShields: false,
          useViral: true,
        });
      }
    }

    // Toxic Lash: guaranteed Toxin DoT per pellet; ticks use faction³
    if (stats.extraHitGuaranteedToxin && extraFrac > 0) {
      const fTriple = factionTripleDotMultiplier(factionBonus);
      const toxinMult = 1 + (stats.toxinModBonusFraction ?? 0);
      const stance =
        sim?.applyStanceMultiplier === false ? 1 : (stats.stanceDamageMultiplier ?? 1);
      const tlTick =
        0.5 *
        totalRaw *
        extraFrac *
        acmShot *
        toxinMult *
        statusDmg *
        fTriple *
        head *
        stance *
        enemyDamageTypeMultiplier(enemy, "toxin");
      if (tlTick > 0) {
        const full = Math.floor(multishot);
        const fracPart = multishot - full;
        const addTl = (scale: number) => {
          if (scale <= 0) return;
          dots.push({
            nextTick: time + dotFirstTickDelay("toxin"),
            remainingTicks: dotTickCount("toxin", dotDuration),
            damagePerTick: tlTick * scale,
            type: "toxin",
            ignoreArmor: false,
            ignoreShields: true,
            useViral: true,
          });
        };
        for (let i = 0; i < full; i++) addTl(1);
        if (fracPart > 0.01) addTl(fracPart);
      }
    }

    shots += 1;
    ammo -= Math.max(0.01, stats.ammoCost ?? 1);
    time += shotInterval;

    // Apply immediate DoT tick at shot time
    tickDot(time);
  }

  // Drain remaining DoTs if still alive but DoTs would finish (delay + duration of ticks)
  if (health > 0 && dots.length > 0) {
    const drainEnd = Math.min(maxTime, time + 1 + dotDuration);
    const healthBeforeDrain = health;
    // Step 0.25s so TTK reflects the tick that actually kills
    let t = time;
    while (health > 0 && t < drainEnd - 1e-12) {
      t = Math.min(drainEnd, t + 0.25);
      tickDot(t);
    }
    if (health <= 0) {
      time = t;
    } else if (health < healthBeforeDrain) {
      time = drainEnd;
    }
  }

  const killed = health <= 0;
  const ttk = killed ? time : Infinity;

  // Paper DPS at end-state stacks (for UI comparison)
  const endArmor = currentArmorFromStrips(
    baseArmor,
    corrosiveStacks,
    heatRemainingAt(time),
    punctureStacks,
    punctureStrip,
  );
  const endViral = viralHealthMultiplier(viralStacks);
  const endArmorDR = enemyArmorDamageReduction(endArmor);
  let endHealthRatio = 0;
  for (const d of dmgTypes) {
    let typeDmg = (d.value / totalRaw) * enemyDamageTypeMultiplier(enemy, d.type);
    if (endArmor > 0) typeDmg *= 1 - enemyArmorDamageReduction(endArmor);
    endHealthRatio += typeDmg;
  }
  endHealthRatio *= endViral;
  const rawPerShot = totalRaw * multishot * acm * factionHit;
  const healthPerShot = rawPerShot * endHealthRatio;
  const burstDps = healthPerShot * efr + (killed && ttk > 0 ? (scaledHp + scaledShield) / ttk * 0 : 0);
  // Prefer sim-derived average DPS when killed
  const avgDps =
    killed && ttk > 0 ? (scaledHp + scaledShield + scaledOverguard) / ttk : healthPerShot * efr;
  const ammoCost = Math.max(0.01, stats.ammoCost ?? 1);
  const shotsPerMag = stats.magazine / ammoCost;
  const sustainFactor =
    stats.magazine > 0 && stats.reloadTime > 0 && efr > 0
      ? shotsPerMag / efr / (shotsPerMag / efr + stats.reloadTime)
      : 1;

  return {
    enemy,
    level,
    steelPath,
    effectiveHealth: scaledHp + scaledShield + scaledOverguard,
    scaledArmor: endArmor,
    scaledShield,
    scaledHealth: scaledHp,
    scaledOverguard,
    armorDR: endArmorDR * 100,
    burstDps: Math.max(avgDps, healthPerShot * efr),
    sustainedDps: Math.max(avgDps * sustainFactor, healthPerShot * efr * sustainFactor),
    ttk,
    shotsToKill: killed ? Math.max(1, shots) : Infinity,
    peakViralStacks: peakViral,
    peakCorrosiveStacks: peakCorrosive,
    discrete: true,
  };
}

/** Main entry — discrete Viral/Corrosive-aware TTK sim. */
export function calculateTTK(
  stats: CalculatedStats,
  enemy: EnemyType,
  level: number,
  opts?: { steelPath?: boolean },
): TTKResult {
  return simulateDiscreteTTK(stats, enemy, level, opts);
}
