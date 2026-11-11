import { ArcaneEffectDef, ArcaneEffectLine } from "@/data/arcane-effects";
import { getArcaneEffectDef } from "@/lib/overrides/arcane-effect-overrides";
export { getArcaneEffectDef };
import { shouldApplyArcaneLineToBuild } from "@/lib/calc/arcane-behavior-registry";
import {
  applyCustomArcaneToWarframe,
  applyCustomArcaneToWeapon,
  MAX_RANK_PASSIVE_ARCANE_IDS,
  WarframeArcaneContext,
} from "@/lib/calc/arcane-handlers";
import { arcaneStackCap, getPersistenceDamageCap, scaleArcaneEffectLine } from "@/lib/calc/arcane-utils";
import {
  estimateEnervateCritStacks,
  isArcaneMetadataStat,
  arcaneEffectStackMultiplier,
  isArcaneProcChanceStat,
  scaleArcaneEffectForBuild,
} from "@/lib/calc/arcane-proc-model";
import { CalculatedStats, Mod, WarframeCalculatedStats, Weapon } from "@/lib/types";
import { addStatusResistance, ARCANE_STATUS_RESIST } from "@/lib/calc/status-resistance";

/**
 * Effective stack count for arcane effect scaling.
 * `rank` picks a per-rank stack cap (`stackCapByRank`). `stackOverride` lets a Warframe
 * arcane use a user-chosen stack count (Impetus / Camisado sliders, Intention ability count).
 */
export function effectiveArcaneStacks(
  def: ArcaneEffectDef,
  simStacks: number,
  isWeapon: boolean,
  rank?: number,
  stackOverride?: number,
): number {
  const isStacking = def.trigger === "stacks";

  if (isWeapon) {
    // Passive weapon arcanes (e.g. Cascadia Overcharge, Secondary Kinship) apply while
    // equipped — they do not need sim kill/stack ramps. Proc/uptime scaling still
    // happens in scaleArcaneEffectForBuild for onHit/conditional triggers.
    if (def.trigger === "passive") return 1;
    if (simStacks <= 0) return 0;
    if (!isStacking) return 1;
    const cap = arcaneStackCap(def, rank ?? def.maxRank) ?? def.maxRank + 1;
    return Math.min(simStacks, cap);
  }

  // Warframe: always active when equipped by default; conditional/non-passive arcanes can be
  // explicitly toggled off via `stackOverride === 0`, and stacking arcanes use `stackOverride`
  // or assume full stack cap.
  if (!isStacking) {
    if (
      def.trigger !== "passive" &&
      stackOverride != null &&
      Number.isFinite(stackOverride) &&
      stackOverride <= 0
    ) {
      return 0;
    }
    return 1;
  }
  const cap = arcaneStackCap(def, rank ?? def.maxRank);
  if (stackOverride != null && Number.isFinite(stackOverride)) {
    const n = Math.max(0, Math.floor(stackOverride));
    return cap != null ? Math.min(n, cap) : n;
  }
  return cap ?? 1;
}

export type { WarframeArcaneContext } from "@/lib/calc/arcane-handlers";

function ensureArcaneBonuses(stats: { arcaneBonuses?: Record<string, number> }): Record<string, number> {
  if (!stats.arcaneBonuses) stats.arcaneBonuses = {};
  return stats.arcaneBonuses;
}

function trackBonus(stats: { arcaneBonuses?: Record<string, number> }, stat: string, value: number): void {
  const bonuses = ensureArcaneBonuses(stats);
  bonuses[stat] = (bonuses[stat] ?? 0) + value;
}

function resolveEffectValue(
  def: ArcaneEffectDef,
  line: ArcaneEffectLine,
  rank: number,
  stacks: number,
  simStacks: number,
  fireRate: number,
  forBuild: boolean,
): number {
  if (forBuild) {
    return scaleArcaneEffectForBuild(def, line, rank, stacks, simStacks, fireRate);
  }
  const rankScaled = scaleArcaneEffectLine(line, rank, def.maxRank);
  return rankScaled * arcaneEffectStackMultiplier(def, line, stacks);
}

function applyWeaponDamage(stats: CalculatedStats, scaled: number): void {
  stats.totalDamage *= 1 + scaled;
  stats.impact *= 1 + scaled;
  stats.puncture *= 1 + scaled;
  stats.slash *= 1 + scaled;
  for (const e of stats.elements) e.value *= 1 + scaled;
  for (const e of stats.rawElements) e.value *= 1 + scaled;
  if (stats.arsenalDamage) {
    stats.arsenalDamage.totalDamage *= 1 + scaled;
    stats.arsenalDamage.impact *= 1 + scaled;
    stats.arsenalDamage.puncture *= 1 + scaled;
    stats.arsenalDamage.slash *= 1 + scaled;
    for (const e of stats.arsenalDamage.elements) e.value *= 1 + scaled;
  }
}

function applyWeaponStatToBuild(
  stats: CalculatedStats,
  stat: string,
  rawValue: number,
  line: ArcaneEffectLine,
  baseWeapon?: Weapon,
): void {
  const scaled = line.flat ? rawValue : rawValue / 100;
  const baseCritChance = baseWeapon?.criticalChance ?? stats.criticalChance;
  const baseCritMult = baseWeapon?.criticalMultiplier ?? stats.criticalMultiplier;
  const baseStatusChance = baseWeapon?.statusChance ?? stats.statusChance;

  switch (stat) {
    case "criticalChance":
    case "ampCritChance":
    case "critChanceOnDamaged":
      stats.criticalChance += baseCritChance * scaled;
      break;
    case "criticalMultiplier":
    case "ampCritDamage":
      stats.criticalMultiplier += baseCritMult * scaled;
      break;
    case "fireRate":
    case "ampFireRate":
      // Cannonade locks fire rate against all modification.
      if (!stats.fireRateLocked) {
        stats.fireRate *= 1 + scaled;
      }
      break;
    case "damage":
    case "ampDamage":
      applyWeaponDamage(stats, scaled);
      break;
    case "multishot":
    case "ampMultishot":
      // Multishot mods/arcanes are % of base pellets, not flat pellet adds.
      // Acuity locks multishot against all modification.
      if (!stats.multishotLocked) {
        stats.multishot += (baseWeapon?.multishot ?? 1) * scaled;
      }
      break;
    case "statusChance":
    case "statusChancePerHit":
    case "ampStatusChance":
    case "elementalProcChance":
      stats.statusChance += baseStatusChance * scaled;
      break;
    case "reloadSpeed":
    case "ampReload":
    case "reloadSpeedBonus":
      if (scaled > 0) stats.reloadTime /= 1 + scaled;
      break;
    case "attackSpeed":
    case "attackSpeedBonus":
      stats.fireRate *= 1 + scaled;
      break;
    case "meleeHeavyCrit":
    case "meleeHeavyDamage":
      stats.heavyAttackDamage *= 1 + scaled;
      break;
    case "meleeComboGain":
    case "meleeComboInitial":
      stats.comboCount += line.flat ? rawValue : 0;
      break;
    case "ammoEfficiency":
      stats.ammoEfficiency = (stats.ammoEfficiency ?? 0) + scaled;
      break;
    default:
      break;
  }
}

function applyWarframeStatToBuild(
  stats: WarframeCalculatedStats,
  stat: string,
  rawValue: number,
  line: ArcaneEffectLine,
  ctx: WarframeArcaneContext,
  def?: ArcaneEffectDef,
  arcaneId?: string,
): void {
  const pct = rawValue / 100;
  const flat = line.flat ? rawValue : 0;

  switch (stat) {
    case "armorBonusAmount":
    case "armor":
      stats.armorBonus += pct;
      break;
    case "flatArmorBonus":
      stats.flatArmorBonus += flat || rawValue;
      break;
    case "abilityStrength":
      stats.abilityStrength += pct;
      break;
    case "abilityDuration":
      stats.abilityDuration += pct;
      break;
    case "abilityEfficiency":
      stats.abilityEfficiency += pct;
      break;
    case "abilityRange":
      stats.abilityRange += pct;
      break;
    case "flowEnergyMax":
      stats.flowBonus += pct;
      break;
    case "health":
    case "healthFlat":
      if (line.flat) stats.flatHealthBonus += rawValue;
      else stats.healthBonus += pct;
      break;
    case "shield":
      stats.shieldBonus += pct;
      break;
    case "energy":
      stats.energyBonus += pct;
      break;
    case "sprintSpeedBonus":
    case "sprintSpeed":
      stats.sprintSpeedBonus += pct;
      break;
    case "parkourVelocity":
      stats.parkourVelocityBonus += line.flat ? rawValue : rawValue / 100;
      break;
    case "healthRegen":
    case "healthRegenAmount":
    case "healthRegenPerSec":
      stats.healthRegenPerSec += line.flat ? rawValue : rawValue / 100;
      break;
    case "damageReduction":
    case "voidModeDamageReduction":
      trackBonus(stats, "damageReduction", rawValue);
      break;
    case "statusResistance":
    case "coldResistance": {
      // Per-element status resist chance (not damage reduction). The six resist
      // arcanes are handled in arcane-handlers; this covers overrides/new arcanes.
      const info = arcaneId ? ARCANE_STATUS_RESIST[arcaneId] : undefined;
      addStatusResistance(stats, info?.element ?? (stat === "coldResistance" ? "Cold" : "Status"), rawValue, info?.name ?? arcaneId ?? "Arcane");
      break;
    }
    case "healthOrbEffectiveness":
      stats.healingBonus += pct;
      break;
    default:
      break;
  }
}

/** Sim / build context the weapon arcane handlers read. */
export interface ArcaneWeaponOpts {
  applyHeadshots?: boolean;
  applyWeakPoints?: boolean;
  warframeArmor?: number;
  warframeMaxEnergy?: number;
  /** Other arcane ids on the same weapon (Demulcent's paired Residual). */
  coArcaneIds?: string[];
}

export function applyArcaneEffectsToWeapon(
  stats: CalculatedStats,
  arcaneId: string,
  rank: number,
  simStacks: number,
  baseWeapon?: Weapon,
  opts?: ArcaneWeaponOpts,
): void {
  const def = getArcaneEffectDef(arcaneId);
  if (!def || def.effects.length === 0) return;

  const stacks = effectiveArcaneStacks(def, simStacks, true, rank);
  // Zid-An Haras amp AE is always-on even at 0 sim stacks; so are the max-rank passives of
  // Merciless (reload) / Deadhead (headshot, recoil) / Dexterity (combo duration).
  if (stacks <= 0 && arcaneId !== "zid_an_haras" && !MAX_RANK_PASSIVE_ARCANE_IDS.has(arcaneId)) return;

  const handlerCtx = {
    def,
    arcaneId,
    rank,
    stacks,
    baseWeapon,
    simStacks,
    applyHeadshots: opts?.applyHeadshots,
    applyWeakPoints: opts?.applyWeakPoints,
    warframeArmor: opts?.warframeArmor,
    warframeMaxEnergy: opts?.warframeMaxEnergy,
    coArcaneIds: opts?.coArcaneIds,
  };
  if (applyCustomArcaneToWeapon(stats, handlerCtx)) return;

  const fireRate = stats.fireRate;

  for (const line of def.effects) {
    const panelValue = resolveEffectValue(def, line, rank, stacks, simStacks, fireRate, false);
    trackBonus(stats, line.stat, line.flat ? panelValue : panelValue);

    if (!shouldApplyArcaneLineToBuild(arcaneId, line.stat, "weapon")) continue;
    if (isArcaneMetadataStat(line.stat) || isArcaneProcChanceStat(line.stat)) continue;

    const buildValue = resolveEffectValue(def, line, rank, stacks, simStacks, fireRate, true);
    if (buildValue === 0) continue;
    applyWeaponStatToBuild(stats, line.stat, buildValue, line, baseWeapon);
  }
}

function applyWarframeStat(
  stats: WarframeCalculatedStats,
  stat: string,
  rawValue: number,
  line: ArcaneEffectLine,
): void {
  trackBonus(stats, stat, line.flat ? rawValue : rawValue);
}

export function applyArcaneEffectsToWarframe(
  stats: WarframeCalculatedStats,
  arcaneId: string,
  rank: number,
  simStacks: number,
  ctx?: WarframeArcaneContext,
  stackOverride?: number,
): void {
  const def = getArcaneEffectDef(arcaneId);
  if (!def || def.effects.length === 0) return;

  const stacks = effectiveArcaneStacks(def, simStacks, false, rank, stackOverride);
  if (stacks <= 0) return;

  const context: WarframeArcaneContext = ctx ?? {
    totalHealth: stats.totalHealth,
    totalShield: stats.totalShield,
    totalArmor: stats.totalArmor,
  };

  const handlerCtx = { def, arcaneId, rank, stacks, warframeCtx: context, simStacks };
  if (applyCustomArcaneToWarframe(stats, handlerCtx)) return;

  for (const line of def.effects) {
    const panelValue = resolveEffectValue(def, line, rank, stacks, simStacks, 1, false);
    applyWarframeStat(stats, line.stat, panelValue, line);
    if (!shouldApplyArcaneLineToBuild(arcaneId, line.stat, "warframe")) continue;
    if (isArcaneMetadataStat(line.stat) || isArcaneProcChanceStat(line.stat)) continue;

    const buildValue = resolveEffectValue(def, line, rank, stacks, simStacks, 1, true);
    if (buildValue === 0) continue;
    applyWarframeStatToBuild(stats, line.stat, buildValue, line, context, def, arcaneId);
  }
}

/** Legacy wrapper — delegates to ARCANE_EFFECTS. Falls back to arcane.stats if no effect def. */
export function applyArcaneToWeaponFromMod(
  stats: CalculatedStats,
  arcane: Mod,
  stacks: number = 1,
  baseWeapon?: Weapon,
  opts?: ArcaneWeaponOpts,
  rank?: number,
): void {
  const effectiveRank =
    typeof rank === "number" && Number.isFinite(rank)
      ? Math.max(0, Math.min(arcane.maxRank, Math.trunc(rank)))
      : arcane.maxRank;
  if (getArcaneEffectDef(arcane.id)) {
    applyArcaneEffectsToWeapon(stats, arcane.id, effectiveRank, stacks, baseWeapon, opts);
    return;
  }
  // Fallback for arcanes missing from generated data
  const rankFactor = arcane.maxRank > 0 ? (effectiveRank + 1) / (arcane.maxRank + 1) : 1;
  for (const [stat, value] of Object.entries(arcane.stats)) {
    const line = { stat, maxValue: value, flat: false };
    const raw = value * rankFactor * stacks;
    trackBonus(stats, stat, raw);
    if (shouldApplyArcaneLineToBuild(arcane.id, stat, "weapon")) {
      applyWeaponStatToBuild(stats, stat, raw, line, baseWeapon);
    }
  }
}

export function applyArcaneToWarframeFromMod(
  stats: WarframeCalculatedStats,
  arcane: Mod,
  stacks: number = 1,
  rank?: number,
  ctx?: WarframeArcaneContext,
  stackOverride?: number,
): void {
  const r = rank ?? arcane.maxRank;
  if (getArcaneEffectDef(arcane.id)) {
    applyArcaneEffectsToWarframe(stats, arcane.id, r, stacks, ctx, stackOverride);
    return;
  }
  for (const [stat, value] of Object.entries(arcane.stats)) {
    const line = { stat, maxValue: value, flat: false };
    const raw = value * stacks;
    const wfCtx = ctx ?? {
      totalHealth: stats.totalHealth,
      totalShield: stats.totalShield,
      totalArmor: stats.totalArmor,
    };
    applyWarframeStat(stats, stat, raw, line);
    if (shouldApplyArcaneLineToBuild(arcane.id, stat, "warframe")) {
      applyWarframeStatToBuild(stats, stat, raw, line, wfCtx, undefined, arcane.id);
    }
  }
}
