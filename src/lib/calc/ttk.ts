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
} from "./combat-multipliers";

export interface EnemyType {
  id: string;
  name: string;
  faction: string;
  baseHealth: number;
  baseArmor: number;
  baseShield: number;
  healthType: string;
  armorType: string;
  shieldType: string;
}

export const ENEMY_TYPES: EnemyType[] = [
  // Grineer
  { id: "lancer", name: "Lancer", faction: "Grineer", baseHealth: 100, baseArmor: 100, baseShield: 0, healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none" },
  { id: "elite_lancer", name: "Elite Lancer", faction: "Grineer", baseHealth: 150, baseArmor: 200, baseShield: 0, healthType: "cloned_flesh", armorType: "alloy", shieldType: "none" },
  { id: "heavy_gunner", name: "Heavy Gunner", faction: "Grineer", baseHealth: 700, baseArmor: 500, baseShield: 0, healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none" },
  { id: "bombard", name: "Bombard", faction: "Grineer", baseHealth: 600, baseArmor: 400, baseShield: 0, healthType: "cloned_flesh", armorType: "alloy", shieldType: "none" },
  { id: "nox", name: "Nox", faction: "Grineer", baseHealth: 4000, baseArmor: 250, baseShield: 0, healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none" },
  { id: "demolisher", name: "Demolisher", faction: "Grineer", baseHealth: 2000, baseArmor: 500, baseShield: 0, healthType: "cloned_flesh", armorType: "alloy", shieldType: "none" },
  // Corpus
  { id: "crewman", name: "Crewman", faction: "Corpus", baseHealth: 60, baseArmor: 0, baseShield: 150, healthType: "flesh", armorType: "none", shieldType: "shield" },
  { id: "tech", name: "Tech", faction: "Corpus", baseHealth: 200, baseArmor: 25, baseShield: 400, healthType: "flesh", armorType: "none", shieldType: "shield" },
  { id: "moa", name: "MOA", faction: "Corpus", baseHealth: 100, baseArmor: 50, baseShield: 200, healthType: "robotic", armorType: "none", shieldType: "shield" },
  { id: "nullifier", name: "Nullifier", faction: "Corpus", baseHealth: 100, baseArmor: 0, baseShield: 300, healthType: "flesh", armorType: "none", shieldType: "shield" },
  // Infested
  { id: "charger", name: "Charger", faction: "Infested", baseHealth: 80, baseArmor: 5, baseShield: 0, healthType: "infested", armorType: "none", shieldType: "none" },
  { id: "ancient_healer", name: "Ancient Healer", faction: "Infested", baseHealth: 400, baseArmor: 50, baseShield: 0, healthType: "fossilized", armorType: "none", shieldType: "none" },
  { id: "toxic_ancient", name: "Toxic Ancient", faction: "Infested", baseHealth: 400, baseArmor: 50, baseShield: 0, healthType: "fossilized", armorType: "none", shieldType: "none" },
  // Corrupted
  { id: "corrupted_heavy", name: "Corrupted Heavy Gunner", faction: "Corrupted", baseHealth: 700, baseArmor: 500, baseShield: 0, healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none" },
  { id: "corrupted_bombard", name: "Corrupted Bombard", faction: "Corrupted", baseHealth: 600, baseArmor: 400, baseShield: 0, healthType: "cloned_flesh", armorType: "alloy", shieldType: "none" },
  // Special
  { id: "eximus_gunner", name: "Eximus Heavy Gunner", faction: "Grineer", baseHealth: 3500, baseArmor: 750, baseShield: 0, healthType: "cloned_flesh", armorType: "ferrite", shieldType: "none" },
  { id: "acolyte", name: "Acolyte", faction: "Stalker", baseHealth: 15000, baseArmor: 200, baseShield: 3000, healthType: "cloned_flesh", armorType: "ferrite", shieldType: "shield" },
];

// ── Type modifier tables ──────────────────────────────────────────────
export const HEALTH_MODIFIERS: Record<string, Record<string, number>> = {
  flesh:        { impact: -0.25, slash: 0.25, heat: 0.25, toxin: 0.5, viral: 0.5, gas: 0.5 },
  cloned_flesh: { impact: -0.25, slash: 0.25, heat: 0.25, viral: 0.75, gas: -0.50 },
  fossilized:   { slash: 0.15, cold: -0.25, toxin: -0.5, blast: 0.5, corrosive: 0.75, radiation: -0.25 },
  infested:     { slash: 0.25, heat: 0.25, gas: 0.75, radiation: -0.5 },
  infested_flesh: { slash: 0.5, heat: 0.5, gas: 0.5, corrosive: 0.75, viral: -0.5 },
  machinery:    { impact: 0.25, electricity: 0.5, toxin: -0.25, blast: 0.75, viral: -0.25 },
  robotic:      { puncture: 0.25, slash: -0.25, electricity: 0.5, toxin: -0.25, radiation: 0.25 },
  sinew:        { puncture: 0.25, slash: 0.25, blast: 0.5, gas: 0.25, corrosive: -0.25, viral: -0.5 },
};

export const ARMOR_MODIFIERS: Record<string, Record<string, number>> = {
  ferrite: { puncture: 0.5, slash: -0.15, toxin: 0.25, corrosive: 0.75, blast: -0.25 },
  alloy:   { puncture: 0.15, slash: -0.5, cold: 0.25, magnetic: -0.5, radiation: 0.75 },
};

export const SHIELD_MODIFIERS: Record<string, Record<string, number>> = {
  shield:       { impact: 0.5, puncture: -0.2, cold: 0.5, magnetic: 0.75, radiation: -0.25 },
  proto_shield: { impact: -0.15, puncture: -0.5, heat: -0.5, toxin: 0.25, magnetic: 0.75, corrosive: -0.5 },
};

export function getMod(table: Record<string, Record<string, number>>, key: string, dmgType: string): number {
  return table[key]?.[dmgType] ?? 0;
}

// ── Post-Update 32 S-curve scaling ────────────────────────────────────
export function scaleArmor(base: number, level: number): number {
  if (base <= 0) return 0;
  const d = level - 1;
  if (d <= 0) return Math.min(base, 2700);
  let s: number;
  if (d < 70) {
    s = base * (1 + 0.005 * Math.pow(d, 1.75));
  } else if (d > 80) {
    const a80 = base * (1 + 0.005 * Math.pow(80, 1.75));
    s = a80 + (d - 80) * 0.5;
  } else {
    const t = (d - 70) / 10;
    const sm = t * t * (3 - 2 * t);
    const lo = base * (1 + 0.005 * Math.pow(d, 1.75));
    const a80 = base * (1 + 0.005 * Math.pow(80, 1.75));
    const hi = a80 + (d - 80) * 0.5;
    s = lo * (1 - sm) + hi * sm;
  }
  return Math.max(base, Math.min(s, 2700));
}

/**
 * Enemy armor damage reduction (wiki Armor § Enemy Damage Reduction).
 * DR = 0.9 × NetArmor / 2700  (max 90% at the 2700 armor soft-cap).
 * Tenno armor still uses armor/(armor+300) — see calculator warframe EHP.
 */
export function enemyArmorDamageReduction(armor: number): number {
  if (armor <= 0) return 0;
  return Math.min(0.9, (0.9 * armor) / 2700);
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

export function scaleHealth(base: number, level: number, faction?: string): number {
  const d = level - 1;
  if (d <= 0) return base;
  const exp = faction?.toLowerCase() === "infested" ? 2.15 : 2.0;
  if (d < 70) return base * (1 + 0.015 * Math.pow(d, exp));
  if (d > 80) {
    const a80 = base * (1 + 0.015 * Math.pow(80, exp));
    return a80 * (1 + (d - 80) * 0.005);
  }
  const t = (d - 70) / 10;
  const sm = t * t * (3 - 2 * t);
  const lo = base * (1 + 0.015 * Math.pow(d, exp));
  const a80 = base * (1 + 0.015 * Math.pow(80, exp));
  const hi = a80 * (1 + (d - 80) * 0.005);
  return lo * (1 - sm) + hi * sm;
}

export function scaleShield(base: number, level: number): number {
  if (base <= 0 || level <= 1) return base;
  const d = level - 1;
  if (d < 70) return base * (1 + 0.0075 * Math.pow(d, 2));
  if (d > 80) {
    const a80 = base * (1 + 0.0075 * Math.pow(80, 2));
    return a80 * (1 + (d - 80) * 0.003);
  }
  const t = (d - 70) / 10;
  const sm = t * t * (3 - 2 * t);
  const lo = base * (1 + 0.0075 * Math.pow(d, 2));
  const a80 = base * (1 + 0.0075 * Math.pow(80, 2));
  const hi = a80 * (1 + (d - 80) * 0.003);
  return lo * (1 - sm) + hi * sm;
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

// ── Main TTK interface & calculator ───────────────────────────────────
export interface TTKResult {
  enemy: EnemyType;
  level: number;
  effectiveHealth: number;
  scaledArmor: number;
  scaledShield: number;
  scaledHealth: number;
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
  if (layer === "shield") {
    if (type === "toxin") return 0; // toxin bypasses — applied to health separately
    const sm = getMod(SHIELD_MODIFIERS, enemy.shieldType, type);
    return value * (1 + sm);
  }
  // health
  const hm = getMod(HEALTH_MODIFIERS, enemy.healthType, type);
  let dmg = value * (1 + hm) * viralMult;
  if (currentArmor > 0 && enemy.armorType !== "none" && type !== "slash") {
    // slash direct hits still hit armor; only slash DoT is cinematic
    const am = getMod(ARMOR_MODIFIERS, enemy.armorType, type);
    const effArmor = currentArmor * Math.max(0, 1 - am);
    dmg *= 1 - enemyArmorDamageReduction(effArmor);
  } else if (currentArmor > 0 && enemy.armorType !== "none" && type === "slash") {
    const am = getMod(ARMOR_MODIFIERS, enemy.armorType, type);
    const effArmor = currentArmor * Math.max(0, 1 - am);
    dmg *= 1 - enemyArmorDamageReduction(effArmor);
  }
  return dmg;
}

function currentArmorFromStrips(
  baseArmor: number,
  corrosiveStacks: number,
  heatActive: boolean,
  punctureStacks = 0,
  punctureStripPerStack = 0,
): number {
  return (
    baseArmor *
    corrosiveArmorRemaining(corrosiveStacks) *
    heatArmorRemaining(heatActive) *
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
  opts?: { maxTime?: number; maxShots?: number },
): TTKResult {
  const maxTime = opts?.maxTime ?? 600;
  const maxShots = opts?.maxShots ?? 50_000;

  const scaledHp = scaleHealth(enemy.baseHealth, level, enemy.faction);
  const baseArmor = scaleArmor(enemy.baseArmor, level);
  const scaledShield = scaleShield(enemy.baseShield, level);

  const dmgTypes = collectDamageTypes(stats);
  const totalRaw = dmgTypes.reduce((s, d) => s + d.value, 0);
  const zero: TTKResult = {
    enemy,
    level,
    effectiveHealth: scaledHp + scaledShield,
    scaledArmor: baseArmor,
    scaledShield,
    scaledHealth: scaledHp,
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

  const acm = avgCritMultiplier(stats.criticalChance, stats.criticalMultiplier);
  const moddedBase =
    stats.moddedBaseDamage != null && stats.moddedBaseDamage > 0
      ? stats.moddedBaseDamage
      : totalRaw;
  const sim = stats.simParams;
  const factionBonus = factionBonusFromStats(
    stats.factionBonuses,
    sim?.targetFaction ?? enemy.faction,
  );
  const factionHit = combatDamageMultiplier({
    factionBonus,
    applyHeadshots: sim?.applyHeadshots,
    headshotDamageBonus: stats.headshotDamageBonus ?? 0,
    stanceMultiplier:
      sim?.applyStanceMultiplier === false ? 1 : (stats.stanceDamageMultiplier ?? 1),
  });
  // factionHit already includes faction once; DoT needs faction²
  const factionDot = factionDotMultiplier(factionBonus);
  const statusDmg = 1 + (stats.statusDamageBonus ?? 0);
  const head = sim?.applyHeadshots ? 2 * (1 + (stats.headshotDamageBonus ?? 0)) : 1;
  // combatMult for hits uses factionHit; for DoT tick base rebuild without double head/stance
  const dotBase =
    moddedBase *
    acm *
    statusDmg *
    factionDot *
    head *
    (sim?.applyStanceMultiplier === false ? 1 : (stats.stanceDamageMultiplier ?? 1));

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
  let punctureStacks = 0;
  let heatActive = false;
  let heatExpire = 0;
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
          heatActive && heatExpire > d.nextTick,
          punctureStacks,
          punctureStrip,
        );
        const viralMult = d.useViral ? viralHealthMultiplier(viralStacks) : 1;
        let dmg = d.damagePerTick * viralMult;
        if (!d.ignoreArmor && armorNow > 0 && enemy.armorType !== "none") {
          dmg *= 1 - enemyArmorDamageReduction(armorNow);
        }
        // DoTs apply to health (toxin always; others after shields or through)
        if (d.ignoreShields || shield <= 0) {
          health -= dmg;
        } else {
          // non-toxin DoTs typically don't apply to shields in our model — apply to health
          health -= dmg;
        }
        d.remainingTicks -= 1;
        d.nextTick += 1; // 1s tick interval
        if (health <= 0) return;
      }
    }
    // prune finished
    for (let i = dots.length - 1; i >= 0; i--) {
      if (dots[i].remainingTicks <= 0) dots.splice(i, 1);
    }
  };

  const spawnDot = (
    type: string,
    expectedCount: number,
    frac: number,
    optsDot: { ignoreArmor: boolean; ignoreShields: boolean; useViral: boolean; typeMult: number },
  ) => {
    if (expectedCount <= 0 || frac <= 0) return;
    const perTick = frac * dotBase * optsDot.typeMult;
    if (perTick <= 0) return;
    // Spawn floor(expected) full procs + fractional expected as partial damage
    const full = Math.floor(expectedCount);
    const fracPart = expectedCount - full;
    const addOne = (scale: number) => {
      if (scale <= 0) return;
      dots.push({
        nextTick: time, // first tick on application (wiki: immediate + 6 more)
        remainingTicks: 7,
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

    // Expire heat strip
    if (heatActive && time >= heatExpire) heatActive = false;

    const armorNow = currentArmorFromStrips(
      baseArmor,
      corrosiveStacks,
      heatActive,
      punctureStacks,
      punctureStrip,
    );
    const viralMult = viralHealthMultiplier(viralStacks);

    // Direct hit (expected damage per shot)
    let shieldHit = 0;
    let healthHit = 0;
    let toxinBypass = 0;
    const hasShields = shield > 0 && enemy.shieldType !== "none";
    for (const d of dmgTypes) {
      const base = d.value * multishot * acm * factionHit;
      if (d.type === "toxin") {
        // toxin bypasses shields → health
        toxinBypass += typeHitDamage(d.type, base, enemy, armorNow, viralMult, "health");
      } else if (hasShields) {
        shieldHit += typeHitDamage(d.type, base, enemy, armorNow, 1, "shield");
      } else {
        healthHit += typeHitDamage(d.type, base, enemy, armorNow, viralMult, "health");
      }
    }

    if (hasShields) {
      const absorbed = Math.min(shield, shieldHit);
      shield -= absorbed;
      // Overkill past shields: re-apply the overflow fraction with health/armor mods.
      if (shield <= 0 && shieldHit > absorbed) {
        const overflowFrac = (shieldHit - absorbed) / Math.max(shieldHit, 1e-9);
        let overflowHealth = 0;
        for (const d of dmgTypes) {
          if (d.type === "toxin") continue;
          const base = d.value * multishot * acm * factionHit;
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
      const extraBase =
        totalRaw * extraFrac * multishot * acm * factionHit * fHit * extraInstances;
      if (stats.extraHitGuaranteedToxin) {
        health -= typeHitDamage("toxin", extraBase, enemy, armorNow, viralMult, "health");
      } else if (hasShields) {
        const absorbedEx = Math.min(shield, extraBase);
        shield -= absorbedEx;
        if (shield <= 0 && extraBase > absorbedEx) {
          health -= typeHitDamage(
            "impact",
            extraBase - absorbedEx,
            enemy,
            armorNow,
            viralMult,
            "health",
          );
        }
      } else {
        health -= typeHitDamage("impact", extraBase, enemy, armorNow, viralMult, "health");
      }
    }

    // Status stack gains (expected)
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
    peakCorrosive = Math.max(peakCorrosive, corrosiveStacks);
    if (heatGain > 0.05) {
      heatActive = true;
      heatExpire = time + 6; // heat proc duration
    }

    // DoT procs from this shot
    spawnDot("slash", expectedProcs("slash"), 0.35, {
      ignoreArmor: true,
      ignoreShields: false,
      useViral: true,
      typeMult: 1,
    });
    spawnDot("heat", expectedProcs("heat"), 0.5, {
      ignoreArmor: false,
      ignoreShields: false,
      useViral: false,
      typeMult: 1 + typeBonus("heat"),
    });
    spawnDot("toxin", expectedProcs("toxin"), 0.5, {
      ignoreArmor: false,
      ignoreShields: true,
      useViral: false,
      typeMult: 1 + typeBonus("toxin"),
    });
    spawnDot("electricity", expectedProcs("electricity"), 0.5, {
      ignoreArmor: false,
      ignoreShields: false,
      useViral: false,
      typeMult: 1 + typeBonus("electricity"),
    });
    spawnDot("gas", expectedProcs("gas"), 0.5, {
      ignoreArmor: false,
      ignoreShields: false,
      useViral: true,
      typeMult: 1 + typeBonus("gas"),
    });

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
        acm *
        toxinMult *
        statusDmg *
        fTriple *
        head *
        stance;
      if (tlTick > 0) {
        const full = Math.floor(multishot);
        const fracPart = multishot - full;
        const addTl = (scale: number) => {
          if (scale <= 0) return;
          dots.push({
            nextTick: time,
            remainingTicks: 7,
            damagePerTick: tlTick * scale,
            type: "toxin",
            ignoreArmor: false,
            ignoreShields: true,
            useViral: false,
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

  // Drain remaining DoTs if still alive but DoTs would finish (up to 7s of ticks)
  if (health > 0 && dots.length > 0) {
    const drainEnd = Math.min(maxTime, time + 7);
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
    heatActive,
    punctureStacks,
    punctureStrip,
  );
  const endViral = viralHealthMultiplier(viralStacks);
  const endArmorDR = enemyArmorDamageReduction(endArmor);
  let endHealthRatio = 0;
  for (const d of dmgTypes) {
    const hm = getMod(HEALTH_MODIFIERS, enemy.healthType, d.type);
    let typeDmg = (d.value / totalRaw) * (1 + hm);
    if (endArmor > 0 && enemy.armorType !== "none") {
      const am = getMod(ARMOR_MODIFIERS, enemy.armorType, d.type);
      typeDmg *= 1 - enemyArmorDamageReduction(endArmor * Math.max(0, 1 - am));
    }
    endHealthRatio += typeDmg;
  }
  endHealthRatio *= endViral;
  const rawPerShot = totalRaw * multishot * acm * factionHit;
  const healthPerShot = rawPerShot * endHealthRatio;
  const burstDps = healthPerShot * efr + (killed && ttk > 0 ? (scaledHp + scaledShield) / ttk * 0 : 0);
  // Prefer sim-derived average DPS when killed
  const avgDps = killed && ttk > 0 ? (scaledHp + scaledShield) / ttk : healthPerShot * efr;
  const ammoCost = Math.max(0.01, stats.ammoCost ?? 1);
  const shotsPerMag = stats.magazine / ammoCost;
  const sustainFactor =
    stats.magazine > 0 && stats.reloadTime > 0 && efr > 0
      ? shotsPerMag / efr / (shotsPerMag / efr + stats.reloadTime)
      : 1;

  return {
    enemy,
    level,
    effectiveHealth: scaledHp + scaledShield,
    scaledArmor: endArmor,
    scaledShield,
    scaledHealth: scaledHp,
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
export function calculateTTK(stats: CalculatedStats, enemy: EnemyType, level: number): TTKResult {
  return simulateDiscreteTTK(stats, enemy, level);
}
