import { getEffectiveModsMap } from "@/lib/weapons/effective-data";
import {
  findRailjackArmament,
  findRailjackComponent,
  findRailjackEliteCrew,
  getRailjackComponentTraits,
  railjackBaseStats,
  tunguskaCannon,
  type RailjackArmament,
  type RailjackComponent,
  type RailjackHouseTrait,
} from "@/data/railjack";
import {
  intrinsicPaperEffects,
  normalizeIntrinsics,
  type RailjackIntrinsicPaperEffects,
  type RailjackIntrinsics,
} from "@/data/railjack-intrinsics";
import {
  crewBonusesFromCompetency,
  RAILJACK_PLEXUS_ABILITIES,
  summarizeEquippedAbilities,
  type RailjackAbilitySummary,
} from "@/lib/codex/railjack-abilities";
import {
  applyVerifiedModStatToRailjack,
  type RailjackModAccumulators,
} from "@/lib/mods/mod-behavior-registry";
import type {
  Mod,
  ModSlot,
  RailjackAbilityComputed,
  RailjackArmamentComputed,
  RailjackCalculatedStats,
} from "@/lib/types";

type EquippedMod = Pick<ModSlot, "modId" | "rank">;

const CONDITIONAL_INTEGRATED_MODS = new Set([
  "crimson_fugue",
  "cruising_speed",
  "protective_shots",
]);

export interface RailjackSimulationInput {
  crimsonFugueStacks?: number;
  cruisingSpeedActive?: boolean;
  protectiveShotsActive?: boolean;
  /** House engine/shield traits that proc while Railjack shields are at 0. */
  shieldsDepleted?: boolean;
  activeBattleAbilityId?: string | null;
  activeTacticalAbilityId?: string | null;
}

export interface RailjackBuildInput {
  reactorId?: string;
  shieldId?: string;
  engineId?: string;
  platingId?: string;
  /** Selected Mk III wreckage unique trait ids (one roll per house component). */
  reactorTraitId?: string;
  shieldTraitId?: string;
  engineTraitId?: string;
  /** Nose / Dorsal / Ventral turret hardpoints (length 1–3; legacy 1–2 supported). */
  turretIds?: (string | undefined)[];
  /** Legacy single-turret saves. */
  turretId?: string;
  ordnanceId?: string;
  integratedMods?: EquippedMod[];
  battleMods?: EquippedMod[];
  tacticalMods?: EquippedMod[];
  eliteCrewId?: string;
  /** Player Intrinsics ranks (0–10 per tree). Dirac/grid removed U29.10. */
  intrinsics?: Partial<RailjackIntrinsics>;
  simulation?: RailjackSimulationInput;
}

/** Prefer an explicitly chosen trait; else first paper-effect trait; else first listed. */
export function resolveHouseTrait(
  traits: RailjackHouseTrait[],
  selectedId?: string,
): RailjackHouseTrait | undefined {
  if (!traits.length) return undefined;
  if (selectedId) {
    const picked = traits.find((t) => t.id === selectedId);
    if (picked) return picked;
  }
  return traits.find((t) => t.effect) ?? traits[0];
}

function modStatFraction(perRank: number, rank: number): number {
  return (perRank * (rank + 1)) / 100;
}

const TURRET_HARDPOINT_COUNT = 3;

function resolveTurretIds(input: RailjackBuildInput): (string | undefined)[] {
  const slots: (string | undefined)[] = [undefined, undefined, undefined];
  if (input.turretIds?.length) {
    for (let i = 0; i < TURRET_HARDPOINT_COUNT; i++) {
      slots[i] = input.turretIds[i];
    }
    return slots;
  }
  if (input.turretId) {
    slots[0] = input.turretId;
  }
  return slots;
}

function reactorScaling(reactor: RailjackComponent | undefined) {
  return {
    strength: 1 + (reactor?.stats.abilityStrength ?? 0),
    range: 1 + (reactor?.stats.abilityRange ?? 0),
    duration: 1 + (reactor?.stats.abilityDuration ?? 0),
  };
}

function scaleAbilitySummary(
  summary: RailjackAbilitySummary,
  reactor: RailjackComponent | undefined,
  simulation: RailjackSimulationInput | undefined,
  intrinsicFx: RailjackIntrinsicPaperEffects,
): RailjackAbilityComputed {
  const scale = reactorScaling(reactor);
  const isActive =
    summary.tab === "battle"
      ? simulation?.activeBattleAbilityId === summary.modId
      : simulation?.activeTacticalAbilityId === summary.modId;

  let energyCost = summary.energyCost;
  let cooldownSec = summary.cooldownSec;
  let turretDamageWhileActive = summary.turretDamageWhileActive;

  if (energyCost !== undefined && summary.scalesWith?.includes("strength")) {
    energyCost = Math.round(energyCost * scale.strength);
  }
  if (energyCost !== undefined && summary.tab === "battle") {
    energyCost = Math.round(energyCost * intrinsicFx.battleEnergyCostMult);
  }
  if (cooldownSec !== undefined && summary.scalesWith?.includes("duration")) {
    cooldownSec = Math.round(cooldownSec / scale.duration);
  }
  if (cooldownSec !== undefined && summary.tab === "tactical" && intrinsicFx.tacticalCooldownReduction > 0) {
    cooldownSec = Math.round(cooldownSec * (1 - intrinsicFx.tacticalCooldownReduction));
  }
  if (turretDamageWhileActive !== undefined) {
    if (summary.modId === "phoenix_blaze") {
      turretDamageWhileActive *= scale.strength;
    } else if (summary.modId === "battle_stations") {
      turretDamageWhileActive *= scale.duration;
    }
  }

  return {
    modId: summary.modId,
    name: summary.name,
    category: summary.category,
    description: summary.description,
    rank: summary.rank,
    energyCost,
    cooldownSec,
    turretDamageWhileActive,
    isSimulatedActive: isActive,
  };
}

function applyConditionalIntegratedMod(
  modId: string,
  rank: number,
  allMods: Map<string, Mod>,
  simulation: RailjackSimulationInput | undefined,
  acc: RailjackModAccumulators,
  panel: { modBonuses?: Record<string, number> },
): void {
  const mod = allMods.get(modId);
  if (!mod?.stats) return;

  if (modId === "crimson_fugue") {
    const stacks = Math.min(5, Math.max(0, simulation?.crimsonFugueStacks ?? 0));
    if (stacks === 0) return;
    const perStack = modStatFraction(mod.stats.damage ?? 0, rank);
    const totalBonus = perStack * stacks;
    acc.turretDamageBonus += totalBonus;
    panel.modBonuses = { ...panel.modBonuses, crimson_fugue: totalBonus };
    return;
  }

  if (modId === "cruising_speed") {
    if (!simulation?.cruisingSpeedActive) return;
    for (const [statKey, perRank] of Object.entries(mod.stats)) {
      if (statKey === "range") continue;
      applyVerifiedModStatToRailjack(panel, modId, statKey, modStatFraction(perRank, rank), acc);
    }
    return;
  }

  if (modId === "protective_shots") {
    if (!simulation?.protectiveShotsActive) return;
    for (const [statKey, perRank] of Object.entries(mod.stats)) {
      applyVerifiedModStatToRailjack(panel, modId, statKey, modStatFraction(perRank, rank), acc);
    }
  }
}

function applyIntegratedMods(
  equippedMods: EquippedMod[] | undefined,
  allMods: Map<string, Mod>,
  simulation: RailjackSimulationInput | undefined,
): { acc: RailjackModAccumulators; panel: { modBonuses?: Record<string, number> } } {
  const acc = {
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
  } satisfies RailjackModAccumulators;

  const panel: { modBonuses?: Record<string, number> } = {};

  for (const em of equippedMods ?? []) {
    const mod = allMods.get(em.modId);
    if (!mod?.stats) continue;

    const rank = Math.min(Math.max(em.rank ?? 0, 0), mod.maxRank);

    if (CONDITIONAL_INTEGRATED_MODS.has(em.modId)) {
      applyConditionalIntegratedMod(em.modId, rank, allMods, simulation, acc, panel);
      continue;
    }

    for (const [statKey, perRank] of Object.entries(mod.stats)) {
      const modValue = modStatFraction(perRank, rank);
      applyVerifiedModStatToRailjack(panel, mod.id, statKey, modValue, acc);
    }
  }

  return { acc, panel };
}

function abilityTurretDamageBonus(
  battleAbilities: RailjackAbilityComputed[],
  tacticalAbilities: RailjackAbilityComputed[],
): number {
  let bonus = 0;
  for (const ability of [...battleAbilities, ...tacticalAbilities]) {
    if (ability.isSimulatedActive && ability.turretDamageWhileActive) {
      bonus += ability.turretDamageWhileActive;
    }
  }
  return bonus;
}

/** Expected crit multiplier; linear form holds for CC above 100% (red/orange tiers). */
export function railjackCritAvgMultiplier(critChance: number, critMultiplier: number): number {
  return 1 + Math.max(0, critChance) * (critMultiplier - 1);
}

export function computeTunguskaStats(
  artilleryDamageBonus: number,
  extraRailjackDamageBonus = 0,
): NonNullable<RailjackCalculatedStats["artillery"]> {
  const damageMult = 1 + artilleryDamageBonus + extraRailjackDamageBonus;
  const damage = Math.round(tunguskaCannon.damage * damageMult);
  const avgHitMult = railjackCritAvgMultiplier(
    tunguskaCannon.critChance,
    tunguskaCannon.critMultiplier,
  );
  const avgShotDamage = Math.round(damage * avgHitMult);
  const estimatedDps = Math.round(avgShotDamage / tunguskaCannon.chargeTime);
  return {
    id: tunguskaCannon.id,
    name: tunguskaCannon.name,
    damage,
    critChance: tunguskaCannon.critChance,
    critMultiplier: tunguskaCannon.critMultiplier,
    statusChance: tunguskaCannon.statusChance,
    chargeTime: tunguskaCannon.chargeTime,
    avgShotDamage,
    estimatedDps,
  };
}

export function computeRailjackArmamentStats(
  armament: RailjackArmament,
  bonuses: Pick<
    RailjackModAccumulators,
    "turretDamageBonus" | "turretCritBonus" | "turretCritDmgBonus" | "ordnanceDamageBonus"
  >,
  extraTurretDamageBonus = 0,
): RailjackArmamentComputed {
  const isTurret = armament.type === "turret";
  const damageMult =
    1 + (isTurret ? bonuses.turretDamageBonus + extraTurretDamageBonus : bonuses.ordnanceDamageBonus);
  const damage = Math.round(armament.damage * damageMult);
  const critChance = Math.min(
    1,
    armament.critChance + (isTurret ? bonuses.turretCritBonus : 0),
  );
  const critMultiplier = armament.critMultiplier * (1 + (isTurret ? bonuses.turretCritDmgBonus : 0));
  const avgHitMult = railjackCritAvgMultiplier(critChance, critMultiplier);
  const estimatedDps = Math.round(damage * avgHitMult * armament.fireRate);

  return {
    id: armament.id,
    name: armament.name,
    type: armament.type,
    damage,
    critChance,
    critMultiplier,
    statusChance: armament.statusChance,
    fireRate: armament.fireRate,
    estimatedDps,
  };
}

export function calculateRailjackBuild(
  input: RailjackBuildInput,
  allMods: Map<string, Mod> = getEffectiveModsMap(),
): RailjackCalculatedStats {
  const base = { ...railjackBaseStats };
  let avionicsCapacity = 0;
  let shieldRechargePct = railjackBaseStats.shieldRecharge;
  let shieldRechargeDelayReduction = railjackBaseStats.shieldRechargeDelayReduction;
  let engineFlatSpeed = 0;
  let engineBoostAddon = 0;

  const reactor = input.reactorId ? findRailjackComponent(input.reactorId) : undefined;
  const shield = input.shieldId ? findRailjackComponent(input.shieldId) : undefined;
  const engine = input.engineId ? findRailjackComponent(input.engineId) : undefined;
  const plating = input.platingId ? findRailjackComponent(input.platingId) : undefined;
  const eliteCrew = input.eliteCrewId ? findRailjackEliteCrew(input.eliteCrewId) : undefined;
  const crewBonuses = eliteCrew ? crewBonusesFromCompetency(eliteCrew.competency) : undefined;

  // Plating / shields: wiki absolute equipped values (replace baseline).
  if (plating) {
    if (plating.stats.hullBonus != null) base.hull = plating.stats.hullBonus;
    if (plating.stats.armorBonus != null) base.armor = plating.stats.armorBonus;
  }
  if (shield) {
    if (shield.stats.shieldCapacity != null) base.shield = shield.stats.shieldCapacity;
    shieldRechargePct = shield.stats.shieldRecharge ?? shieldRechargePct;
    shieldRechargeDelayReduction =
      shield.stats.shieldRechargeDelayReduction ?? shieldRechargeDelayReduction;
  }
  // Engines: wiki cruise = [150 × (1 + Conic/Cruising)] + item Engine Speed
  // Boost mult = [baseBoost × (1 + Ion Burn)] + item Engine Boost; SWB = cruise × mult
  if (engine) {
    engineFlatSpeed = engine.stats.speed ?? 0;
    engineBoostAddon = engine.stats.boostMultiplier ?? 0;
  }
  if (reactor) {
    avionicsCapacity += reactor.stats.avionicsCapacity ?? 0;
  }

  const { acc, panel } = applyIntegratedMods(input.integratedMods, allMods, input.simulation);
  const intrinsics = normalizeIntrinsics(input.intrinsics);
  const intrinsicFx = intrinsicPaperEffects(intrinsics);

  if (crewBonuses) {
    acc.turretDamageBonus += crewBonuses.turretDamageBonus;
    acc.speedBonus += crewBonuses.speedBonus;
    acc.hullBonus += crewBonuses.hullBonus;
  }

  const battleSummaries = summarizeEquippedAbilities(input.battleMods ?? [], "battle");
  const tacticalSummaries = summarizeEquippedAbilities(input.tacticalMods ?? [], "tactical");
  const battleAbilities = battleSummaries.map((s) =>
    scaleAbilitySummary(s, reactor, input.simulation, intrinsicFx),
  );
  const tacticalAbilities = tacticalSummaries.map((s) =>
    scaleAbilitySummary(s, reactor, input.simulation, intrinsicFx),
  );
  const extraTurretDamageBonus = abilityTurretDamageBonus(battleAbilities, tacticalAbilities);

  const reactorTrait = resolveHouseTrait(
    reactor ? getRailjackComponentTraits(reactor.id) : [],
    input.reactorTraitId,
  );
  const shieldTrait = resolveHouseTrait(
    shield ? getRailjackComponentTraits(shield.id) : [],
    input.shieldTraitId,
  );
  const engineTrait = resolveHouseTrait(
    engine ? getRailjackComponentTraits(engine.id) : [],
    input.engineTraitId,
  );
  const selectedHouseTraits = [reactorTrait, shieldTrait, engineTrait].filter(
    (t): t is RailjackHouseTrait => !!t,
  );
  const activeHouseTraits: RailjackHouseTrait[] = [];

  // Lavan reactor plating-synergy trait only when that roll is selected (+ Lavan plating).
  let houseShieldBonus = 0;
  if (
    reactorTrait?.effect === "lavan_plating_shield" &&
    plating?.tier === "lavan"
  ) {
    houseShieldBonus += 0.25;
    activeHouseTraits.push(reactorTrait);
  }

  let houseSpeedBonus = 0;
  let houseBoostBonus = 0;
  let houseTurretDamageBonus = 0;
  const shieldsDepleted = !!input.simulation?.shieldsDepleted;
  if (shieldsDepleted) {
    for (const trait of [engineTrait, shieldTrait]) {
      if (!trait) continue;
      if (trait.effect === "shields_depleted_speed") {
        houseSpeedBonus += 0.2;
        activeHouseTraits.push(trait);
      } else if (trait.effect === "shields_depleted_boost") {
        houseBoostBonus += 0.5;
        activeHouseTraits.push(trait);
      } else if (trait.effect === "shields_depleted_damage") {
        houseTurretDamageBonus += 0.25;
        activeHouseTraits.push(trait);
      }
    }
  }

  const hull = Math.round(base.hull * (1 + acc.hullBonus));
  const armor = Math.round(base.armor * (1 + acc.armorBonus));
  const shieldCap = Math.round(base.shield * (1 + acc.shieldBonus + houseShieldBonus));
  const shieldRechargeRate =
    Math.round(shieldRechargePct * (1 + acc.shieldRechargeBonus) * 10) / 10;
  const speed = Math.round(
    railjackBaseStats.speed * (1 + acc.speedBonus + houseSpeedBonus) + engineFlatSpeed,
  );
  const boostMultiplier =
    railjackBaseStats.boostMultiplier * (1 + acc.boostSpeedBonus + houseBoostBonus) +
    engineBoostAddon;
  const boostSpeed = Math.round(speed * boostMultiplier);
  const boostCost = Math.max(0, Math.round(base.boostCost * (1 - acc.boostCostReduction)));
  const fluxCapacity = Math.round(base.fluxCapacity * (1 + acc.fluxBonus));
  const avionics = Math.round(avionicsCapacity * (1 + acc.avionicsBonus));
  const totalExtraTurretDamage = extraTurretDamageBonus + houseTurretDamageBonus;

  const turretIds = resolveTurretIds(input);
  // Nose=0, Dorsal=1, Ventral=2 — Gunnery 1 +50% applies to Dorsal/Ventral only.
  const turrets = turretIds
    .map((id, slotIndex) => {
      if (!id) return undefined;
      const armament = findRailjackArmament(id);
      if (!armament || armament.type !== "turret") return undefined;
      const gunnerySlotBonus =
        (slotIndex === 1 || slotIndex === 2) ? intrinsicFx.dorsalVentralTurretDamageBonus : 0;
      return computeRailjackArmamentStats(
        armament,
        acc,
        totalExtraTurretDamage + gunnerySlotBonus,
      );
    })
    .filter((t): t is RailjackArmamentComputed => !!t);

  const ordnanceRaw = input.ordnanceId ? findRailjackArmament(input.ordnanceId) : undefined;
  const ordnance =
    ordnanceRaw && ordnanceRaw.type === "ordnance"
      ? // Wiki Zetki shield: +25% Railjack damage (turrets + ordnance); ability turret buffs stay turret-only.
        computeRailjackArmamentStats(ordnanceRaw, acc, houseTurretDamageBonus)
      : null;

  // Tunguska: Forward Artillery mod + Zetki depleted-shield “Railjack damage” trait.
  const artillery = computeTunguskaStats(acc.artilleryDamageBonus, houseTurretDamageBonus);

  return {
    baseHull: railjackBaseStats.hull,
    baseArmor: railjackBaseStats.armor,
    baseShield: railjackBaseStats.shield,
    baseSpeed: railjackBaseStats.speed,
    baseBoostSpeed: railjackBaseStats.boostSpeed,
    baseBoostCost: railjackBaseStats.boostCost,
    baseFluxCapacity: railjackBaseStats.fluxCapacity,
    baseAvionicsCapacity: 0,
    baseShieldRecharge: railjackBaseStats.shieldRecharge,
    hull,
    armor,
    shield: shieldCap,
    shieldRecharge: shieldRechargeRate,
    shieldRechargeDelayReduction,
    speed,
    boostSpeed,
    boostMultiplier,
    boostCost,
    fluxCapacity,
    avionicsCapacity: avionics,
    turretDamageBonus: acc.turretDamageBonus + houseTurretDamageBonus,
    activeHouseTraits,
    turretCritBonus: acc.turretCritBonus,
    turretCritDmgBonus: acc.turretCritDmgBonus,
    ordnanceDamageBonus: acc.ordnanceDamageBonus,
    artilleryDamageBonus: acc.artilleryDamageBonus,
    turretRangeBonus: acc.turretRangeBonus,
    turretProjectileSpeedBonus: acc.turretProjectileSpeedBonus,
    ordnanceSpeedBonus: acc.ordnanceSpeedBonus,
    munitionsCapacityBonus: acc.munitionsCapacityBonus,
    turrets,
    ordnance,
    artillery,
    modBonuses: panel.modBonuses,
    abilityStrengthBonus: reactor?.stats.abilityStrength,
    abilityRangeBonus: reactor?.stats.abilityRange,
    abilityDurationBonus: reactor?.stats.abilityDuration,
    crewBonuses,
    battleAbilities,
    tacticalAbilities,
    abilityTurretDamageBonus: extraTurretDamageBonus,
    selectedHouseTraits,
    intrinsics,
    intrinsicEffects: {
      dorsalVentralTurretDamageBonus: intrinsicFx.dorsalVentralTurretDamageBonus,
      battleEnergyCostMult: intrinsicFx.battleEnergyCostMult,
      tacticalCooldownReduction: intrinsicFx.tacticalCooldownReduction,
      domeChargeForge: intrinsicFx.domeChargeForge,
      ordnanceForge: intrinsicFx.ordnanceForge,
      eliteCrewUnlocked: intrinsicFx.eliteCrewUnlocked,
      panelNotes: intrinsicFx.panelNotes,
    },
  };
}

/** Returns true when the build has mods/traits that use simulation toggles. */
export function railjackBuildNeedsSimulation(input: RailjackBuildInput): boolean {
  const integratedIds = new Set((input.integratedMods ?? []).map((m) => m.modId));
  const hasConditionalIntegrated = [...CONDITIONAL_INTEGRATED_MODS].some((id) => integratedIds.has(id));
  const hasAbilityBoost =
    (input.battleMods ?? []).some((m) => RAILJACK_PLEXUS_ABILITIES[m.modId]?.turretDamageWhileActive) ||
    (input.tacticalMods ?? []).some((m) => RAILJACK_PLEXUS_ABILITIES[m.modId]?.turretDamageWhileActive);
  const engineTrait = resolveHouseTrait(
    getRailjackComponentTraits(input.engineId ?? ""),
    input.engineTraitId,
  );
  const shieldTrait = resolveHouseTrait(
    getRailjackComponentTraits(input.shieldId ?? ""),
    input.shieldTraitId,
  );
  const hasShieldsDepletedTrait = [engineTrait, shieldTrait].some(
    (t) =>
      t?.effect === "shields_depleted_speed" ||
      t?.effect === "shields_depleted_boost" ||
      t?.effect === "shields_depleted_damage",
  );
  return hasConditionalIntegrated || hasAbilityBoost || hasShieldsDepletedTrait;
}
