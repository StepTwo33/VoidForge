import type { ItemApplyMode, ItemApplyTarget, VerifiedItemStatLine, VerifiedModBehavior } from "@/lib/codex/item-behavior-types";
import { VERIFIED_MOD_BEHAVIORS } from "@/data/mod-behaviors";
import { FACTION_STAT_TO_ID } from "@/lib/calc/combat-multipliers";
import type { Mod, SetBonusLinkage, Weapon } from "@/lib/types";

export type WeaponModAccumulators = {
  damageBonus: number;
  critChanceBonus: number;
  critMultBonus: number;
  fireRateBonus: number;
  multishotBonus: number;
  statusBonus: number;
  magBonus: number;
  /** Absolute magazine rounds added after % mag mods (Stinging Truth). */
  flatMagazineBonus: number;
  reloadBonus: number;
  /** Absolute status chance added after multiplicative SC mods (Entropy Burst / Napalm). */
  statusChanceFlatBonus: number;
  impactBonus: number;
  punctureBonus: number;
  slashBonus: number;
  /** Status Effect damage (Elementalist mods) — multiplies DoT ticks. */
  statusDamageBonus: number;
  /** Headshot / weak-point damage bonus (Acuity, etc.). */
  headshotDamageBonus: number;
  /** Status duration bonus (Continuous Misery, etc.) — extends DoT ticks. */
  statusDurationBonus: number;
  /** Normalized faction id → bonus fraction (Bane / Expel / Smite / Cleanse). */
  factionBonuses: Record<string, number>;
  hasBloodRush: boolean;
  bloodRushValue: number;
  hasConditionOverload: boolean;
  conditionOverloadPerStatus: number;
  hasWeepingWounds: boolean;
  weepingWoundsValue: number;
  hasBerserkerFury: boolean;
  berserkerFuryPerStack: number;
  galvMultishotOnKillPerStack: number;
  galvDamagePerStatusPerStack: number;
  /** In-game stack cap for the equipped galvanized multishot mod (Chamber 5, Hell/Diffusion 4). */
  galvMultishotStackCap: number;
  /** In-game stack cap for the equipped galvanized condition mod (Aptitude/Savvy 2, Shot 3). */
  galvDamagePerStatusStackCap: number;
  /** Galvanized Scope/Crosshairs: flat crit chance while aiming after a headshot. */
  galvCritOnHeadshotBase: number;
  /** Galvanized Scope/Crosshairs: extra crit chance per headshot-kill stack. */
  galvCritOnHeadshotPerStack: number;
  /** Non-stacking buffs active while kill stacks > 0 (statKey → summed bonus). */
  onKillStatBonuses: Record<string, number>;
  /** Per-kill-stack buffs (statKey → bonus per stack); cap in onKillPerStackCap. */
  onKillPerStackBonuses: Record<string, number>;
  /** In-game stack cap for onKillPerStackBonuses (Galvanized Steel/Elementalist: 4). */
  onKillPerStackCap: number;
  /** +% Heavy Attack Wind Up Speed (shortens windup time). */
  heavyAttackWindUpBonus: number;
  /** Aim/reload/cast/latch buffs gated by sim.applyTriggerBuffs (statKey → summed bonus). */
  triggerStatBonuses: Record<string, number>;
  /** Chance to force a Slash proc on crits (Hunter Munitions). */
  slashOnCritChance: number;
  /** Chance for Impact procs to add a Slash proc (Internal Bleeding / Hemorrhage; ×2 under 2.5 fire rate). */
  slashOnImpactProcChance: number;
  /** Bonus damage on the first shot of each magazine (Charged/Primed Chamber). */
  firstShotDamageBonus: number;
};

export type ModApplyWeaponContext = {
  modId: string;
  statKey: string;
  modValue: number;
  baseWeaponDamage: number;
  acc: WeaponModAccumulators;
  elementalMods: { type: string; value: number }[];
  comboDuration?: { add: (v: number) => void };
  heavyAttackEfficiency?: { add: (v: number) => void };
  /** Sim stack counts for exclusives that decay (miss / grenade). */
  simStacks?: {
    criticalPrecision?: number;
    criticalMutation?: number;
  };
};

export function getVerifiedModBehavior(modId: string): VerifiedModBehavior | undefined {
  return VERIFIED_MOD_BEHAVIORS[modId];
}

export function getVerifiedModStatLine(modId: string, statKey: string): VerifiedItemStatLine | undefined {
  const behavior = getVerifiedModBehavior(modId);
  return behavior?.stats.find((s) => s.statKey === statKey);
}

function trackModPanel(stats: { modBonuses?: Record<string, number> }, modId: string, statKey: string, value: number): void {
  if (!stats.modBonuses) stats.modBonuses = {};
  const key = `${modId}::${statKey}`;
  stats.modBonuses[key] = (stats.modBonuses[key] ?? 0) + value * 100;
}

/** In-game stack caps for galvanized on-kill effects (wiki mod pages). */
const GALV_STACK_CAPS: Record<string, number> = {
  galvanized_chamber: 5,
  galvanized_hell: 4,
  galvanized_diffusion: 4,
  galvanized_aptitude: 2,
  galvanized_savvy: 2,
  galvanized_shot: 3,
  galvanized_scope: 5,
  galvanized_crosshairs: 5,
  split_flights: 4,
  sentient_surge: 4,
  strain_infection: 8,
  galvanized_steel: 4,
  galvanized_elementalist: 4,
};

function applyModeToWeaponAcc(mode: ItemApplyMode, ctx: ModApplyWeaponContext): boolean {
  const { acc, modValue, statKey, elementalMods, baseWeaponDamage } = ctx;
  switch (mode) {
    case "multiplicative_percent":
      switch (statKey) {
        case "damage":
          acc.damageBonus += modValue;
          return true;
        case "criticalChance":
          acc.critChanceBonus += modValue;
          return true;
        case "criticalMultiplier":
          acc.critMultBonus += modValue;
          return true;
        case "fireRate":
        case "attackSpeed":
          acc.fireRateBonus += modValue;
          return true;
        case "multishot":
          acc.multishotBonus += modValue;
          return true;
        case "statusChance":
          acc.statusBonus += modValue;
          return true;
        case "magazine":
          acc.magBonus += modValue;
          return true;
        case "reloadSpeed":
          acc.reloadBonus += modValue;
          return true;
        case "impact":
          acc.impactBonus += modValue;
          return true;
        case "puncture":
          acc.punctureBonus += modValue;
          return true;
        case "slash":
          acc.slashBonus += modValue;
          return true;
        case "statusDamage":
        case "statusDamageBonus":
          acc.statusDamageBonus += modValue;
          return true;
        case "headshotDamage":
        case "headshotMultiplier":
        case "weakPointDamage":
          acc.headshotDamageBonus += modValue;
          return true;
        case "statusDuration":
          acc.statusDurationBonus += modValue;
          return true;
        case "heavyAttackSpeed":
        case "heavyAttackWindUp":
          acc.heavyAttackWindUpBonus += modValue;
          return true;
        default: {
          const factionId = FACTION_STAT_TO_ID[statKey];
          if (factionId) {
            acc.factionBonuses[factionId] = (acc.factionBonuses[factionId] ?? 0) + modValue;
            return true;
          }
          return false;
        }
      }
    case "elemental_from_base_damage":
      elementalMods.push({ type: statKey, value: baseWeaponDamage * modValue });
      return true;
    case "conditional_combo_crit":
      acc.hasBloodRush = true;
      acc.bloodRushValue = modValue;
      return true;
    case "conditional_combo_status":
      acc.hasWeepingWounds = true;
      acc.weepingWoundsValue = modValue;
      return true;
    case "conditional_damage_per_status":
      acc.hasConditionOverload = true;
      acc.conditionOverloadPerStatus = modValue;
      return true;
    case "conditional_multishot_on_kill":
      if (statKey === "multishot") {
        acc.multishotBonus += modValue;
        return true;
      }
      if (statKey === "multishotOnKill") {
        acc.galvMultishotOnKillPerStack = modValue;
        acc.galvMultishotStackCap = GALV_STACK_CAPS[ctx.modId] ?? 5;
        return true;
      }
      return false;
    case "conditional_crit_on_headshot":
      if (statKey === "criticalChanceOnHeadshot") {
        acc.galvCritOnHeadshotBase += modValue;
        return true;
      }
      if (statKey === "criticalChanceOnHeadshotKill") {
        acc.galvCritOnHeadshotPerStack = modValue;
        return true;
      }
      return false;
    case "conditional_damage_per_status_on_kill":
      if (statKey === "statusChance") {
        acc.statusBonus += modValue;
        return true;
      }
      if (statKey === "damagePerStatus") {
        acc.galvDamagePerStatusPerStack = modValue;
        acc.galvDamagePerStatusStackCap = GALV_STACK_CAPS[ctx.modId] ?? 5;
        return true;
      }
      return false;
    case "conditional_attack_speed_on_kill":
      acc.hasBerserkerFury = true;
      acc.berserkerFuryPerStack = modValue;
      return true;
    case "conditional_stat_on_kill":
      acc.onKillStatBonuses[statKey] = (acc.onKillStatBonuses[statKey] ?? 0) + modValue;
      return true;
    case "conditional_stat_per_kill_stack":
      acc.onKillPerStackBonuses[statKey] = (acc.onKillPerStackBonuses[statKey] ?? 0) + modValue;
      acc.onKillPerStackCap = GALV_STACK_CAPS[ctx.modId] ?? acc.onKillPerStackCap ?? 4;
      return true;
    case "conditional_stat_on_trigger": {
      // HP-cap exclusives: catalog `health` is a placeholder; assume wiki +360% cap.
      if (ctx.modId === "dreadful_killshot" && statKey === "health") {
        acc.triggerStatBonuses.damage = (acc.triggerStatBonuses.damage ?? 0) + 3.6;
        acc.triggerStatBonuses.statusChance =
          (acc.triggerStatBonuses.statusChance ?? 0) + 3.6;
        return true;
      }
      if (ctx.modId === "necrophagic_vigor" && statKey === "health") {
        acc.triggerStatBonuses.criticalChance =
          (acc.triggerStatBonuses.criticalChance ?? 0) + 3.6;
        acc.triggerStatBonuses.criticalMultiplier =
          (acc.triggerStatBonuses.criticalMultiplier ?? 0) + 3.6;
        return true;
      }
      // Proton Snap: catalog `damage` is wiki +Toxin (not base damage).
      // Pain Points: catalog `damage` is weak-point damage stacks.
      // Fired Up: catalog `damage` is per-hit Heat.
      let key = statKey;
      let value = modValue;
      if (ctx.modId === "proton_snap" && statKey === "damage") {
        key = "toxin";
      }
      if (ctx.modId === "pain_points" && statKey === "damage") {
        key = "weakPointDamage";
      }
      if (ctx.modId === "fired_up" && statKey === "damage") {
        key = "heat";
      }
      // Stack exclusives: catalog is per-stack; default max when trigger active.
      // Critical Precision / Mutation accept sim stack counts for miss/grenade decay.
      if (ctx.modId === "double_tap" && statKey === "damage") {
        value = modValue * 20;
      }
      if (ctx.modId === "critical_mutation" && (statKey === "criticalChance" || statKey === "criticalMultiplier")) {
        const stacks =
          ctx.simStacks?.criticalMutation !== undefined
            ? Math.min(10, Math.max(0, Math.floor(ctx.simStacks.criticalMutation)))
            : 10;
        value = modValue * stacks;
      }
      if (ctx.modId === "pain_points" && key === "weakPointDamage") {
        value = modValue * 10;
      }
      if (ctx.modId === "critical_precision" && statKey === "criticalChance") {
        const stacks =
          ctx.simStacks?.criticalPrecision !== undefined
            ? Math.min(50, Math.max(0, Math.floor(ctx.simStacks.criticalPrecision)))
            : 50;
        value = modValue * stacks;
      }
      if (ctx.modId === "fired_up" && key === "heat") {
        value = modValue * 20;
      }
      acc.triggerStatBonuses[key] = (acc.triggerStatBonuses[key] ?? 0) + value;
      return true;
    }
    case "slash_on_crit":
      acc.slashOnCritChance += modValue;
      return true;
    case "slash_on_impact_proc":
      acc.slashOnImpactProcChance += modValue;
      return true;
    case "first_shot_damage":
      acc.firstShotDamageBonus += modValue;
      return true;
    case "flat":
      if (statKey === "statusChance") {
        acc.statusChanceFlatBonus += modValue;
        return true;
      }
      if (statKey === "magazine") {
        acc.flatMagazineBonus += modValue;
        return true;
      }
      return false;
    case "additive_percent":
      if (statKey === "comboDuration" && ctx.comboDuration) {
        ctx.comboDuration.add(modValue);
        return true;
      }
      if (statKey === "heavyAttackEfficiency" && ctx.heavyAttackEfficiency) {
        ctx.heavyAttackEfficiency.add(modValue);
        return true;
      }
      return false;
    default:
      return false;
  }
}

/** Apply a single mod stat line when that mod has a verified per-item entry. Returns true if handled. */
export function applyVerifiedModStatToWeapon(
  stats: {
    modBonuses?: Record<string, number>;
    slideSpeedBonus?: number;
    sprintSpeedBonus?: number;
  },
  ctx: ModApplyWeaponContext,
): boolean {
  const line = getVerifiedModStatLine(ctx.modId, ctx.statKey);

  // Always apply combat-relevant keys even when unverified or tagged mod_panel.
  const combatKey =
    ctx.statKey.startsWith("faction") ||
    ctx.statKey === "statusDamage" ||
    ctx.statKey === "statusDamageBonus" ||
    ctx.statKey === "headshotDamage" ||
    ctx.statKey === "headshotMultiplier" ||
    ctx.statKey === "weakPointDamage";

  if (ctx.statKey === "slideSpeed") {
    stats.slideSpeedBonus = (stats.slideSpeedBonus ?? 0) + ctx.modValue;
    trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
    return true;
  }

  if (ctx.statKey === "sprintSpeed") {
    stats.sprintSpeedBonus = (stats.sprintSpeedBonus ?? 0) + ctx.modValue;
    trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
    return true;
  }

  if (!line) {
    if (combatKey && applyModeToWeaponAcc("multiplicative_percent", ctx)) {
      trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
      return true;
    }
    trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
    return false;
  }

  if (combatKey && line.mode === "multiplicative_percent") {
    if (applyModeToWeaponAcc(line.mode, ctx)) {
      trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
      return true;
    }
  }

  if (line.target === "mod_panel" || line.target === "pending") {
    trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
    return true;
  }

  if (line.target !== "weapon_dps") {
    trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
    return true;
  }

  if (line.mode === "custom") return false;

  if (applyModeToWeaponAcc(line.mode, ctx)) return true;

  trackModPanel(stats, ctx.modId, ctx.statKey, ctx.modValue);
  return true;
}

export type WarframeModAccumulators = {
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
  energyBonus: number;
  sprintSpeedBonus: number;
  /** Fraction bonus to slide speed (e.g. Maglev). */
  slideSpeedBonus: number;
  flowBonus: number;
  parkourVelocityBonus: number;
  abilityStrength: number;
  abilityDuration: number;
  abilityEfficiency: number;
  abilityRange: number;
};

export type ArchwingModAccumulators = WarframeModAccumulators & {
  flightSpeedBonus: number;
  kineticDiversionPercent: number;
};

export type CompanionModAccumulators = {
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
  shieldRechargeBonus: number;
  meleeDamageBonus: number;
  attackSpeedBonus: number;
  critChanceBonus: number;
  critDamageBonus: number;
  weakspotDamageBonus: number;
  finisherDamageBonus: number;
  damageReductionBonus: number;
  pickupDoubleChance: number;
  creditPickupDoubleChance: number;
  resourcePickupDoubleChance: number;
  impactStatusStacks: number;
  reviveShieldHealth: number;
  incapacitationTimerReduction: number;
  healthRegenBonus: number;
};

const COMPANION_BODY_STAT_KEYS = new Set([
  "health",
  "shield",
  "armor",
  "meleeDamage",
  "attackSpeed",
  "criticalChance",
  "criticalMultiplier",
  "critChance",
  "critDamage",
  "shieldRecharge",
]);

const COMPANION_UTILITY_STAT_KEYS = new Set([
  "weakspotDamage",
  "finisherDamage",
  "damageReduction",
  "pickupDoubleChance",
  "creditPickupDoubleChance",
  "resourcePickupDoubleChance",
  "impactStatusStacks",
  "reviveShieldHealth",
  "incapacitationTimerReduction",
  "healthRegen",
]);

function appliesToCompanionTotals(
  line: VerifiedItemStatLine | undefined,
  statKey: string,
  modCategory: string,
): boolean {
  if (line?.target === "companion_totals") return true;
  if (modCategory !== "companion" && modCategory !== "augment") return false;
  if (line?.target === "warframe_totals" && COMPANION_BODY_STAT_KEYS.has(statKey)) return true;
  if (COMPANION_UTILITY_STAT_KEYS.has(statKey)) return true;
  return false;
}

export function applyVerifiedModStatToCompanion(
  stats: { modBonuses?: Record<string, number> },
  modId: string,
  statKey: string,
  modValue: number,
  acc: CompanionModAccumulators,
  modCategory: string,
): boolean {
  const line = getVerifiedModStatLine(modId, statKey);
  if (!line) return false;

  if (!appliesToCompanionTotals(line, statKey, modCategory)) {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  switch (statKey) {
    case "health":
      acc.healthBonus += modValue;
      return true;
    case "shield":
      acc.shieldBonus += modValue;
      return true;
    case "armor":
      acc.armorBonus += modValue;
      return true;
    case "shieldRecharge":
      acc.shieldRechargeBonus += modValue;
      return true;
    case "meleeDamage":
      acc.meleeDamageBonus += modValue;
      return true;
    case "attackSpeed":
      acc.attackSpeedBonus += modValue;
      return true;
    case "criticalChance":
    case "critChance":
      acc.critChanceBonus += modValue;
      return true;
    case "criticalMultiplier":
    case "critDamage":
      acc.critDamageBonus += modValue;
      return true;
    case "weakspotDamage":
      acc.weakspotDamageBonus += modValue;
      return true;
    case "finisherDamage":
      acc.finisherDamageBonus += modValue;
      return true;
    case "damageReduction":
      acc.damageReductionBonus += modValue;
      return true;
    case "pickupDoubleChance":
      acc.pickupDoubleChance += modValue;
      return true;
    case "creditPickupDoubleChance":
      acc.creditPickupDoubleChance += modValue;
      return true;
    case "resourcePickupDoubleChance":
      acc.resourcePickupDoubleChance += modValue;
      return true;
    case "impactStatusStacks":
      acc.impactStatusStacks += modValue;
      return true;
    case "reviveShieldHealth":
      acc.reviveShieldHealth += modValue;
      return true;
    case "incapacitationTimerReduction":
      acc.incapacitationTimerReduction += modValue;
      return true;
    case "healthRegen":
      acc.healthRegenBonus += modValue;
      return true;
    default:
      trackModPanel(stats, modId, statKey, modValue);
      return true;
  }
}

export function applyVerifiedModStatToWarframe(
  stats: { modBonuses?: Record<string, number> },
  modId: string,
  statKey: string,
  modValue: number,
  acc: WarframeModAccumulators,
): boolean {
  const line = getVerifiedModStatLine(modId, statKey);
  if (!line) {
    trackModPanel(stats, modId, statKey, modValue);
    return false;
  }

  // Slide speed is real movement math even when the batch script tagged it mod_panel.
  // (Maglev, Cunning Drift, Streamlined Form, Air Thrusters, Armored Recovery, …)
  if (statKey === "slideSpeed" && line.mode === "multiplicative_percent") {
    acc.slideSpeedBonus += modValue;
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  if (line.target === "mod_panel" || line.target === "pending" || line.target !== "warframe_totals") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  switch (statKey) {
    case "health":
      acc.healthBonus += modValue;
      return true;
    case "shield":
      acc.shieldBonus += modValue;
      return true;
    case "armor":
      acc.armorBonus += modValue;
      return true;
    case "energy":
    case "energyMax":
      acc.energyBonus += modValue;
      return true;
    case "abilityStrength":
      acc.abilityStrength += modValue;
      return true;
    case "abilityDuration":
      acc.abilityDuration += modValue;
      return true;
    case "abilityEfficiency":
      acc.abilityEfficiency += modValue;
      return true;
    case "abilityRange":
      acc.abilityRange += modValue;
      return true;
    case "sprintSpeed":
      acc.sprintSpeedBonus += modValue;
      return true;
    case "slideSpeed":
      acc.slideSpeedBonus += modValue;
      return true;
    case "flow":
    case "flowEnergyMax":
      acc.flowBonus += modValue;
      return true;
    case "parkourVelocity":
      acc.parkourVelocityBonus += modValue;
      return true;
    default:
      trackModPanel(stats, modId, statKey, modValue);
      return true;
  }
}

/**
 * Sum slide-speed fraction from equipped weapon mods for warframe / loadout display.
 */
export function sumSlideSpeedBonusFromModSlots(
  slots: { modId: string; rank?: number }[] | undefined,
  allMods: Map<string, { maxRank: number; stats?: Record<string, number>; category?: string }>,
): number {
  return sumMovementBonusFromWeaponModSlots(slots, allMods, "slideSpeed");
}

/**
 * Sum sprint-speed fraction from equipped weapon mods (Amalgam Serration, etc.)
 * for warframe / loadout display.
 */
export function sumSprintSpeedBonusFromModSlots(
  slots: { modId: string; rank?: number }[] | undefined,
  allMods: Map<string, { maxRank: number; stats?: Record<string, number>; category?: string }>,
): number {
  return sumMovementBonusFromWeaponModSlots(slots, allMods, "sprintSpeed");
}

function sumMovementBonusFromWeaponModSlots(
  slots: { modId: string; rank?: number }[] | undefined,
  allMods: Map<string, { maxRank: number; stats?: Record<string, number>; category?: string }>,
  statKey: "slideSpeed" | "sprintSpeed",
): number {
  if (!slots?.length) return 0;
  let total = 0;
  for (const slot of slots) {
    const mod = allMods.get(slot.modId);
    const perRank = mod?.stats?.[statKey];
    if (perRank == null || !mod) continue;
    // Only weapon-slot mods contribute here (warframe mods are applied in calculateWarframeBuild).
    const cat = (mod.category ?? "").toLowerCase();
    if (cat === "warframe" || cat === "aura" || cat === "exilus" || cat === "augment") continue;
    const line = getVerifiedModStatLine(slot.modId, statKey);
    if (line && line.mode !== "multiplicative_percent") continue;
    const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod.maxRank);
    total += (perRank * (rank + 1)) / 100;
  }
  return total;
}

export function applyVerifiedModStatToNecramech(
  stats: { modBonuses?: Record<string, number> },
  modId: string,
  statKey: string,
  modValue: number,
  acc: ArchwingModAccumulators,
): boolean {
  const line = getVerifiedModStatLine(modId, statKey);
  if (!line) {
    trackModPanel(stats, modId, statKey, modValue);
    return false;
  }

  if (line.target === "mod_panel" || line.target === "pending") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  if (line.target !== "warframe_totals") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  switch (statKey) {
    case "health":
      acc.healthBonus += modValue;
      return true;
    case "shield":
      acc.shieldBonus += modValue;
      return true;
    case "armor":
      acc.armorBonus += modValue;
      return true;
    case "energy":
    case "energyMax":
      acc.energyBonus += modValue;
      return true;
    case "abilityStrength":
      acc.abilityStrength += modValue;
      return true;
    case "abilityDuration":
      acc.abilityDuration += modValue;
      return true;
    case "abilityEfficiency":
      acc.abilityEfficiency += modValue;
      return true;
    case "abilityRange":
      acc.abilityRange += modValue;
      return true;
    default:
      trackModPanel(stats, modId, statKey, modValue);
      return true;
  }
}

export function applyVerifiedModStatToArchwing(
  stats: { modBonuses?: Record<string, number> },
  modId: string,
  statKey: string,
  modValue: number,
  acc: ArchwingModAccumulators,
): boolean {
  if (modId === "kinetic_diversion" && statKey === "damage") {
    acc.kineticDiversionPercent += modValue * 100;
    return true;
  }

  const line = getVerifiedModStatLine(modId, statKey);
  if (!line) {
    trackModPanel(stats, modId, statKey, modValue);
    return false;
  }

  if (line.target === "mod_panel" || line.target === "pending") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  if (line.target !== "warframe_totals") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  switch (statKey) {
    case "health":
      acc.healthBonus += modValue;
      return true;
    case "shield":
      acc.shieldBonus += modValue;
      return true;
    case "armor":
      acc.armorBonus += modValue;
      return true;
    case "energy":
    case "energyMax":
      acc.energyBonus += modValue;
      return true;
    case "abilityStrength":
      acc.abilityStrength += modValue;
      return true;
    case "abilityDuration":
      acc.abilityDuration += modValue;
      return true;
    case "abilityEfficiency":
      acc.abilityEfficiency += modValue;
      return true;
    case "abilityRange":
      acc.abilityRange += modValue;
      return true;
    case "flightSpeed":
      acc.flightSpeedBonus += modValue;
      return true;
    default:
      trackModPanel(stats, modId, statKey, modValue);
      return true;
  }
}

export type RailjackModAccumulators = {
  hullBonus: number;
  armorBonus: number;
  shieldBonus: number;
  shieldRechargeBonus: number;
  speedBonus: number;
  boostSpeedBonus: number;
  boostCostReduction: number;
  fluxBonus: number;
  avionicsBonus: number;
  turretDamageBonus: number;
  turretCritBonus: number;
  turretCritDmgBonus: number;
  ordnanceDamageBonus: number;
  artilleryDamageBonus: number;
  turretRangeBonus: number;
  turretProjectileSpeedBonus: number;
  ordnanceSpeedBonus: number;
  munitionsCapacityBonus: number;
};

function emptyRailjackAccumulators(): RailjackModAccumulators {
  return {
    hullBonus: 0,
    armorBonus: 0,
    shieldBonus: 0,
    shieldRechargeBonus: 0,
    speedBonus: 0,
    boostSpeedBonus: 0,
    boostCostReduction: 0,
    fluxBonus: 0,
    avionicsBonus: 0,
    turretDamageBonus: 0,
    turretCritBonus: 0,
    turretCritDmgBonus: 0,
    ordnanceDamageBonus: 0,
    artilleryDamageBonus: 0,
    turretRangeBonus: 0,
    turretProjectileSpeedBonus: 0,
    ordnanceSpeedBonus: 0,
    munitionsCapacityBonus: 0,
  };
}

export function applyVerifiedModStatToRailjack(
  stats: { modBonuses?: Record<string, number> },
  modId: string,
  statKey: string,
  modValue: number,
  acc: RailjackModAccumulators,
): boolean {
  const line = getVerifiedModStatLine(modId, statKey);
  if (!line) {
    trackModPanel(stats, modId, statKey, modValue);
    return false;
  }

  if (line.target === "mod_panel" || line.target === "pending") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  if (line.target !== "railjack_totals") {
    trackModPanel(stats, modId, statKey, modValue);
    return true;
  }

  switch (statKey) {
    case "hull":
    case "health":
      acc.hullBonus += modValue;
      return true;
    case "armor":
      acc.hullBonus += modValue;
      acc.armorBonus += modValue;
      return true;
    case "shield":
      acc.shieldBonus += modValue;
      acc.shieldRechargeBonus += modValue;
      return true;
    case "engineSpeed":
    case "speed":
      acc.speedBonus += modValue;
      return true;
    case "boostSpeed":
      acc.boostSpeedBonus += modValue;
      return true;
    case "boostCostReduction":
      acc.boostCostReduction += modValue;
      return true;
    case "fluxCapacity":
    case "flux":
      acc.fluxBonus += modValue;
      return true;
    case "avionicsCapacity":
    case "avionics":
      acc.avionicsBonus += modValue;
      return true;
    case "turretDamage":
    case "damage":
      acc.turretDamageBonus += modValue;
      return true;
    case "turretCritChance":
    case "criticalChance":
      acc.turretCritBonus += modValue;
      return true;
    case "turretCritDamage":
    case "criticalMultiplier":
      acc.turretCritDmgBonus += modValue;
      return true;
    case "ordnanceDamage":
      acc.ordnanceDamageBonus += modValue;
      return true;
    case "artilleryDamage":
      acc.artilleryDamageBonus += modValue;
      return true;
    case "turretRange":
    case "range":
      acc.turretRangeBonus += modValue;
      return true;
    case "turretProjectileSpeed":
      acc.turretProjectileSpeedBonus += modValue;
      return true;
    case "ordnanceSpeed":
      acc.ordnanceSpeedBonus += modValue;
      return true;
    case "magazine":
    case "munitions":
      acc.munitionsCapacityBonus += modValue;
      return true;
    default:
      trackModPanel(stats, modId, statKey, modValue);
      return true;
  }
}

/**
 * Melee-slot mods that buff guns via loadout linkage (Sim5).
 * Host melee behaviors keep combat keys on mod_panel so melee paper stays clean.
 */
export function applyCrossSlotMeleeWeaponBuffs(
  acc: WeaponModAccumulators,
  weapon: Weapon,
  linkage: SetBonusLinkage | undefined,
  allMods: Map<string, Mod>,
): void {
  const meleeSlots = linkage?.meleeMods;
  if (!meleeSlots?.length) return;

  const isSecondary = ["pistol", "secondary", "dual_pistols"].includes(weapon.category);
  const isShotgun = weapon.category === "shotgun";

  for (const slot of meleeSlots) {
    const mod = allMods.get(slot.modId);
    if (!mod) continue;
    const rank = Math.min(Math.max(slot.rank ?? 0, 0), mod.maxRank);
    const mult = rank + 1;
    const pct = (key: string) => ((mod.stats[key] as number | undefined) ?? 0) * mult / 100;

    if (isSecondary) {
      if (mod.id === "combo_fury") {
        acc.onKillStatBonuses.magazine =
          (acc.onKillStatBonuses.magazine ?? 0) + pct("magazine");
        acc.onKillStatBonuses.reloadSpeed =
          (acc.onKillStatBonuses.reloadSpeed ?? 0) + pct("reloadSpeed");
      }
      if (mod.id === "mark_of_the_beast") {
        acc.onKillStatBonuses.criticalChance =
          (acc.onKillStatBonuses.criticalChance ?? 0) + pct("criticalChance");
        acc.onKillStatBonuses.statusChance =
          (acc.onKillStatBonuses.statusChance ?? 0) + pct("statusChance");
      }
      if (mod.id === "amalgam_furax_body_count") {
        acc.fireRateBonus += pct("fireRate");
      }
    }
    if (isShotgun && mod.id === "amalgam_ripkas_true_steel") {
      acc.reloadBonus += pct("reloadSpeed");
    }
  }
}

export function modHasVerifiedBehavior(modId: string): boolean {
  return modId in VERIFIED_MOD_BEHAVIORS;
}

export function listUnverifiedModIds(equippedModIds: string[]): string[] {
  return equippedModIds.filter((id) => !modHasVerifiedBehavior(id));
}

export function getModStatVerificationLabel(modId: string, statKey: string): ItemApplyTarget {
  return getVerifiedModStatLine(modId, statKey)?.target ?? "pending";
}
