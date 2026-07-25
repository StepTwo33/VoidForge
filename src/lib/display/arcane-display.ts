import { Mod } from "@/lib/types";
import { ARCANE_EFFECTS, ArcaneEffectDef, ArcaneTrigger } from "@/data/arcane-effects";
import { getPersistenceDamageCap, scaleArcaneEffectLine, scaleArcaneEffectValue } from "@/lib/calc/arcane-utils";

export interface ArcaneEffectLine {
  label: string;
  value: string;
  active?: boolean;
  note?: string;
}

export interface ArcaneDisplayInfo {
  name: string;
  rank: number;
  maxRank: number;
  description: string;
  applied: ArcaneEffectLine[];
  conditional: ArcaneEffectLine[];
}

const STAT_LABELS: Record<string, string> = {
  armor: "Armor",
  flatArmorBonus: "Armor",
  armorBonusAmount: "Armor",
  abilityStrength: "Ability Strength",
  abilityDuration: "Ability Duration",
  abilityEfficiency: "Ability Efficiency",
  abilityRange: "Ability Range",
  flowEnergyMax: "Max Energy",
  health: "Health",
  healthFlat: "Health",
  shield: "Shield",
  energy: "Energy",
  sprintSpeed: "Sprint Speed",
  sprintSpeedBonus: "Sprint Speed",
  parkourVelocity: "Parkour Velocity",
  healthOrbEffectiveness: "Health Orb Effectiveness",
  healthFromOrbs: "Health from Orbs",
  energyOrbBonus: "Energy from Orbs",
  allyEnergy: "Ally Energy Share",
  healthRegenAmount: "Health Regen/s",
  healthRegenPerSec: "Health Regen/s",
  healthRegen: "Health Regen/s",
  healthRegenChance: "Proc Chance",
  armorBonusChance: "Proc Chance",
  shieldRegenAmount: "Shield Regen/s",
  shieldRegenChance: "Proc Chance",
  meleeDamageBonus: "Melee Damage",
  meleeDamageChance: "Proc Chance",
  attackSpeedChance: "Proc Chance",
  attackSpeedBonus: "Attack Speed",
  critChanceOnDamaged: "Crit Chance",
  fireRateOnCrit: "Fire Rate",
  fireRateOnCritChance: "Proc Chance",
  buffDuration: "Duration",
  fireRateOnHeadshot: "Fire Rate",
  fireRate: "Fire Rate",
  criticalChance: "Crit Chance",
  criticalMultiplier: "Crit Damage",
  multishot: "Multishot",
  damage: "Damage",
  reloadSpeed: "Reload Speed",
  reloadSpeedBonus: "Reload Speed (bonus)",
  reloadSpeedChance: "Reload Speed proc chance",
  reloadDamageRamp: "Damage ramp after reload",
  damageOnRevive: "Damage on revive",
  statusChance: "Status Chance",
  statusResistance: "Status Resistance",
  coldResistance: "Cold Resistance",
  damageReduction: "Damage Reduction",
  energyRegen: "Energy Regen/s",
  energyPerArmor: "Energy per Armor",
  abilityStrengthToShield: "Shield → Strength",
  abilityStrengthPerHealth: "Strength per Health",
  ammoEfficiency: "Ammo Efficiency",
  holsterDamage: "Holster Damage",
  holsterSpeed: "Holster Speed",
  headshotDamage: "Headshot Damage",
  finisherDamage: "Finisher Damage",
  bonusDamageOnStatus: "Bonus Damage on Status",
  enemyResistanceReduction: "Enemy Resistance Reduction",
  operatorToWarframeHeal: "Operator → Warframe Heal",
  operatorEnergyToWarframe: "Operator Energy → Warframe",
  operatorHealthRegen: "Operator Health Regen",
  operatorHealth: "Operator Health",
  operatorArmor: "Operator Armor",
  operatorSprintSpeed: "Operator Sprint Speed",
  repairRadius: "Repair Radius",
  voidConversion: "Void Conversion",
  utilityEffect: "Special Effect",
  knockdownChance: "Knockdown Chance",
  escapistStackCap: "Escapist Stack Cap",
  invulnerabilityDuration: "Invulnerability Duration",
  freeAbilityCastChance: "Free Ability Cast Chance",
  freeAbilityCastCount: "Free Ability Casts",
  escapistStacksConsumed: "Escapist Stacks Consumed",
  viralStatusStacks: "Viral Status Stacks",
  contagionGlobeRange: "Contagion Globe Range",
  overguardThreshold: "Overguard Threshold",
  radialAttackRadius: "Radial Attack Radius",
  dissipateRadius: "Dissipate Radius",
  voidMoteEnergy: "Void Mote Energy",
  lethalInvulnDuration: "Lethal Invuln Duration",
  lethalHealPercent: "Lethal Heal",
  projectileOnAimGlide: "Aim Glide Projectile",
  shockwaveOnSlam: "Slam Shockwave",
  contagionProjectileDamage: "Projectile Damage (after 30m)",
  contagionExplosionRadius: "Explosion Radius",
  epidemicSuspendDuration: "Suspend Duration",
  pullChance: "Pull Chance",
  pullRadius: "Pull Radius",
  revertWindow: "Revert Window",
  revertHeal: "Revert Heal",
  debilitateStackThreshold: "Debilitate Stack Threshold",
  weaponJamRadius: "Weapon Jam Radius",
  weaponJamCooldown: "Weapon Jam Cooldown",
  statusChancePerHit: "Status Chance per Hit",
  tauronStrikeCharge: "Tauron Strike Charge",
  meleeComboChance: "Combo Count Chance",
  comboDuration: "Combo Duration",
  recoilReduction: "Recoil Reduction",
  headshotMultiplier: "Headshot Multiplier",
  statusProcChance: "Status Proc Chance",
  lifeStealChance: "Life Steal Chance",
  lifeSteal: "Life Steal",
  cooldown: "Cooldown",
  shieldRestorePercent: "Shield Restore",
  energyPickupChance: "Proc Chance",
  allyEnergyRadius: "Ally Radius",
  healthPickupChance: "Proc Chance",
  allyHealRadius: "Ally Heal Radius",
  reloadProcChance: "Proc Chance",
  holsterDamageChance: "Proc Chance",
  headshotHealthRegenChance: "Proc Chance",
  meleeHeavyCrit: "Heavy Attack Crit Chance",
  meleeHeavyCritCap: "Heavy Attack Crit Cap",
  dodgeSpeedChance: "Proc Chance",
  primaryDamageChance: "Proc Chance",
  voidSlingRadius: "Void Sling Radius",
  kdDriveSpeed: "K-Drive Speed",
  voidParticleCap: "Void Particle Cap",
  voidTrapTetherCount: "Tether Count",
  voidTrapRadius: "Trap Radius",
  operatorHeatDamage: "Operator Heat Damage",
  operatorHealPercent: "Health Restored",
  voidStunDuration: "Stun Duration",
  voidBlastRadius: "Blast Radius",
  meleeHeavyDamage: "Heavy Attack Damage",
  freezeRadius: "Freeze Radius",
  meleeDamagePerShieldCap: "Melee Damage Cap",
  airborneAccuracy: "Airborne Accuracy",
  airborneRecoilReduction: "Airborne Recoil Reduction",
  aimGlideDuration: "Aim Glide Duration",
  damagePerArmorCap: "Damage Cap",
  explosionRadiusScale: "Explosion Radius Scale",
  zoneProcChance: "Proc Chance",
  zoneDuration: "Zone Duration",
  zoneDamage: "Zone Damage",
  zoneDamagePerSec: "Zone Damage/s",
  headshotProcChance: "Proc Chance",
  killProcChance: "Proc Chance",
  overguardStrip: "Overguard Strip",
  ampAmmoEfficiency: "Amp Ammo Efficiency",
  ampBonusDamage: "Amp Bonus Damage",
  ampCritChance: "Amp Critical Chance",
  ampCritDamage: "Amp Critical Damage",
  ampDamage: "Amp Damage",
  ampFireRate: "Amp Fire Rate",
  ampMultishot: "Amp Multishot",
  ampReload: "Amp Reload Speed",
  ampStatusChance: "Amp Status Chance",
  ampStatusDamage: "Amp Status Damage",
  ampSchoolDamage: "Amp School Damage",
  ampEnergyRegen: "Amp Energy Regen",
  ampHeatDamage: "Amp Heat Damage",
  ampRange: "Amp Range",
  abilityStrengthCap: "Ability Strength Cap",
  abilityStrengthPerHealthStep: "Health Step Size",
  armorSteal: "Armor Steal",
  armorStealCap: "Armor Steal Cap",
  overguardStealCap: "Overguard Steal Cap",
  zoneBuffRadius: "Buff Radius",
  attackCount: "Attack Count",
  coldStacksApplied: "Cold Stacks Applied",
  coldSpreadRadius: "Cold Spread Radius",
  universalOrbChanceCap: "Universal Orb Chance Cap",
  companionDamageRamp: "Companion Damage Ramp",
  companionHeal: "Companion Heal",
  companionHealKillThreshold: "Companion Heal Kill Threshold",
  abilityDurationPerSecond: "Ability Duration per Second",
  critPerPunctureTen: "Crit per Puncture",
  damagePerArmorOver: "Damage per Armor",
  damagePerArmorThreshold: "Armor Threshold",
  damagePerEnergy: "Damage per Energy",
  damageTakenBonus: "Damage Taken Bonus",
  dodgeSpeed: "Dodge Speed",
  duplicateAttackChance: "Duplicate Attack Chance",
  elementalProcChance: "Elemental Proc Chance",
  energyCap: "Energy Cap",
  headshotHealthRegen: "Headshot Health Regen",
  healPerEnergySpent: "Heal per Energy Spent",
  invisibilityChance: "Invisibility Chance",
  invisibilityDuration: "Invisibility Duration",
  kitgunHoming: "Homing Projectiles",
  kitgunRecharge: "Battery Recharge",
  kitgunProjectileSpeed: "Projectile Speed",
  kitgunTether: "Ability Buff on Kill",
  meleeComboInitial: "Initial Combo",
  meleeDamagePerShield: "Melee Damage per Shield",
  overguardDamage: "Overguard Damage",
  persistenceDamageCapPerSecond: "Damage Cap / s",
  procDamageMultiplier: "Proc Damage Multiplier",
  removeShields: "Remove Shields",
  secondaryHeatDamage: "Secondary Heat Damage",
  secondaryStatusProc: "Secondary Status Proc",
  shieldRestoreChance: "Shield Restore Chance",
  sprintSpeedChance: "Proc Chance",
  statusStackBonus: "Status Stack Bonus",
  tauronChargeRate: "Tauron Charge Rate",
  transferenceStaticNegate: "Transference Static Negate",
  universalOrbChance: "Universal Orb Chance",
  voidBlastDamage: "Void Blast Damage",
  voidPullRadius: "Void Pull Radius",
  voidSprintSpeed: "Void Sprint Speed",
  voidTrapDuration: "Void Trap Duration",
  vulnerability: "Vulnerability",
  wallLatchDamage: "Wall Latch Damage",
  toxinPoolDuration: "Toxin Pool Duration",
  gasCloudDuration: "Gas Cloud Duration",
  electricZoneDuration: "Electric Zone Duration",
  reflectDamage: "Reflect Damage",
  nullifyChance: "Nullify Chance",
  energyOrbPulse: "Energy Orb Pulse",
  damageOnEnergyPickup: "Damage on Energy Pickup",
  meleeComboGain: "Combo Gain",
  voidModeSpeed: "Void Mode Speed",
  voidModeDamageReduction: "Void Mode DR",
  voidSprintDamage: "Void Sprint Damage",
  bigCritThreshold: "Big Critical Hit",
  procAuraRadius: "Range",
  zoneRadius: "Effect Range",
  corrosiveDamage: "Corrosive Damage",
  healthOrbPulse: "Health Orb Pulse",
};

export function getArcaneStatLabel(stat: string): string {
  return (
    STAT_LABELS[stat]
    ?? stat.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim()
  );
}

/** All arcane effect stat keys with human labels in the catalog. */
export function getKnownArcaneStatKeys(): string[] {
  return Object.keys(STAT_LABELS);
}

const PASSIVE_TRIGGERS = new Set<ArcaneTrigger>(["passive"]);

/** Proc/chance stats go in conditional; bonus stats use applied + trigger note. */
function isProcStat(stat: string, trigger: ArcaneTrigger): boolean {
  if (PASSIVE_TRIGGERS.has(trigger) || trigger === "stacks") return false;
  if (stat.endsWith("Chance")) return true;
  if (stat.endsWith("ProcChance")) return true;
  return false;
}

function fmtPct(n: number, decimals = 0): string {
  return `${n.toFixed(decimals)}%`;
}

function fmtStatValue(stat: string, scaled: number, flat?: boolean): string {
  if (flat) {
    if (["healthFlat", "health", "shield", "energy", "energyOrbBonus"].includes(stat)) {
      return `+${scaled.toFixed(0)}`;
    }
    if (stat === "energyPerArmor") return `${scaled.toFixed(2)}/armor`;
    return scaled % 1 !== 0 ? scaled.toFixed(1) : scaled.toFixed(0);
  }
  const isFlatResource = ["health", "shield", "energy"].includes(stat);
  if (isFlatResource) return `+${scaled.toFixed(0)}`;
  return fmtPct(scaled, scaled % 1 !== 0 ? 1 : 0);
}

function triggerNote(trigger: ArcaneTrigger, stackCap?: number | null): string | undefined {
  switch (trigger) {
    case "passive":
      return undefined;
    case "stacks":
      return stackCap ? `Stacks up to ${stackCap}x` : "Stacking";
    case "onKill":
      return "On kill";
    case "onHeadshot":
      return "On headshot";
    case "onDamaged":
      return "When damaged";
    case "onReload":
      return "On reload";
    case "onAbilityCast":
      return "On ability cast";
    case "onMeleeKill":
      return "On melee kill";
    case "onFinisher":
      return "On finisher";
    case "onStatus":
      return "On status proc";
    case "onPickup":
      return "On orb pickup";
    case "onVoidSling":
      return "On Void Sling";
    case "onMovement":
      return "On movement";
    case "onHit":
      return "On hit";
    case "onFreeze":
      return "On freeze";
    case "conditional":
      return "Conditional";
    default:
      return undefined;
  }
}

function buildLinesFromDef(
  def: ArcaneEffectDef,
  rank: number,
  context?: { totalArmor?: number; persistenceActive?: boolean },
  arcaneId?: string,
): Pick<ArcaneDisplayInfo, "applied" | "conditional"> {
  const applied: ArcaneEffectLine[] = [];
  const conditional: ArcaneEffectLine[] = [];
  const note = triggerNote(def.trigger, def.stackCap);

  if (arcaneId === "arcane_persistence") {
    const cap = getPersistenceDamageCap(rank, def.maxRank);
    applied.push({ label: "Shields", value: "Removed", active: true });
    const armorMet = (context?.totalArmor ?? 0) >= 700;
    conditional.push({
      label: "Damage cap",
      value: `${cap}/s`,
      active: armorMet && (context?.persistenceActive ?? false),
      note: armorMet ? "Active (Armor ≥ 700)" : "Requires Armor ≥ 700",
    });
    return { applied, conditional };
  }

  const seen = new Set<string>();

  for (const line of def.effects) {
    if (line.stat === "removeShields" || line.stat === "persistenceDamageCapPerSecond") continue;
    if (line.stat === "abilityStrengthPerHealthStep") continue;

    const scaled = scaleArcaneEffectLine(line, rank, def.maxRank);
    const label = getArcaneStatLabel(line.stat);
    const value = fmtStatValue(line.stat, scaled, line.flat);
    const proc = isProcStat(line.stat, def.trigger);
    const dedupeKey = `${line.stat}|${label}|${value}|${proc ? "c" : "a"}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    if (proc) {
      conditional.push({
        label,
        value,
        note: note ?? "Proc / conditional",
      });
    } else {
      applied.push({
        label,
        value,
        active: true,
        note: def.trigger === "stacks" && def.stackCap ? `Per stack (max ${def.stackCap})` : note,
      });
    }
  }

  return { applied, conditional };
}

export function getArcaneDisplayInfo(
  arcane: Mod,
  rank: number,
  context?: { totalArmor?: number; persistenceActive?: boolean },
  effectsMap: Record<string, ArcaneEffectDef> = ARCANE_EFFECTS,
): ArcaneDisplayInfo {
  const cleanDesc = arcane.description.replace(/<[^>]+>/g, "").replace(/\\ /g, " ").trim();
  const def = effectsMap[arcane.id];

  if (def && def.effects.length > 0) {
    const { applied, conditional } = buildLinesFromDef(def, rank, context, arcane.id);
    return {
      name: arcane.name,
      rank,
      maxRank: arcane.maxRank,
      description: cleanDesc,
      applied,
      conditional,
    };
  }

  // Fallback to legacy arcane.stats on Mod record
  const applied: ArcaneEffectLine[] = [];
  const conditional: ArcaneEffectLine[] = [];

  for (const [key, maxVal] of Object.entries(arcane.stats ?? {})) {
    const scaled = scaleArcaneEffectValue(maxVal, rank, arcane.maxRank);
    const label = getArcaneStatLabel(key);
    const value = fmtStatValue(key, scaled);
    if (key.endsWith("Chance")) {
      conditional.push({ label, value, note: "On proc" });
    } else {
      applied.push({ label, value, active: true });
    }
  }

  if (Object.keys(arcane.stats ?? {}).length === 0) {
    conditional.push({
      label: "Effect",
      value: cleanDesc.length > 120 ? `${cleanDesc.slice(0, 117)}…` : cleanDesc,
      note: "Proc / conditional",
    });
  }

  return { name: arcane.name, rank, maxRank: arcane.maxRank, description: cleanDesc, applied, conditional };
}
