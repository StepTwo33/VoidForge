import { allMods } from "@/data/mods";
import { allArcanes } from "@/data/arcanes";
import { allArchonShards } from "@/data/archon-shards";
import { ARCANE_EFFECTS } from "@/data/arcane-effects";
import { getArcaneStatLabel, getKnownArcaneStatKeys } from "@/lib/display/arcane-display";
import { formatOverrideFieldLabel } from "@/lib/overrides/override-schemas";

export type StatPickerOption = {
  value: string;
  label: string;
  group: string;
};

/** Mod stats the calculator understands — always offer even if unused in data yet. */
const MOD_STAT_FALLBACK_KEYS = [
  "damage",
  "criticalChance",
  "criticalChancePerCombo",
  "criticalChanceOnHeadshot",
  "criticalChanceOnHeadshotKill",
  "criticalMultiplier",
  "fireRate",
  "attackSpeed",
  "multishot",
  "multishotOnKill",
  "statusChance",
  "statusChancePerCombo",
  "damagePerStatus",
  "magazine",
  "reloadSpeed",
  "accuracy",
  "recoil",
  "zoom",
  "punchThrough",
  "range",
  "flightSpeed",
  "comboCountChance",
  "comboDuration",
  "heavyAttackEfficiency",
  "initialCombo",
  "meleeRange",
  "slashSize",
  "finisherDamage",
  "slideAttack",
  "channelingDamage",
  "channelingEfficiency",
  "health",
  "shield",
  "armor",
  "energy",
  "energyMax",
  "abilityStrength",
  "abilityDuration",
  "abilityEfficiency",
  "abilityRange",
  "sprintSpeed",
  "slideSpeed",
  "parkourVelocity",
  "flow",
  "flowEnergyMax",
  "tauResistance",
  "impact",
  "puncture",
  "slash",
  "heat",
  "cold",
  "toxin",
  "electricity",
  "blast",
  "radiation",
  "gas",
  "magnetic",
  "viral",
  "corrosive",
  "meleeDamage",
  "shieldRecharge",
  "healthRegen",
  "lootDetection",
  "lootRadar",
  "enemyRadar",
  "flatBaseDamage",
  "statusDamage",
  "statusDamageBonus",
  "headshotDamage",
  "headshotMultiplier",
  "weakPointDamage",
  "tau",
  "void",
  "castSpeed",
  "bleedoutReduction",
  "gravityReduction",
  "hardLandingReduction",
  "blockStaggerChance",
  "blockStunChance",
  "blockAngle",
  "overshieldConversion",
  "aimGlideDuration",
  "slideFriction",
  "bulletJump",
  "pickupDoubleChance",
  "creditPickupDoubleChance",
  "resourcePickupDoubleChance",
  "impactStatusStacks",
  "reviveShieldHealth",
  "weakspotDamage",
  "incapacitationTimerReduction",
  "disposition",
] as const;

const MOD_STAT_GROUPS: Record<string, string> = {
  damage: "Weapon — offense",
  criticalChance: "Weapon — offense",
  criticalChancePerCombo: "Weapon — offense",
  criticalChanceOnHeadshot: "Weapon — offense",
  criticalChanceOnHeadshotKill: "Weapon — offense",
  criticalMultiplier: "Weapon — offense",
  fireRate: "Weapon — offense",
  attackSpeed: "Weapon — offense",
  multishot: "Weapon — offense",
  multishotOnKill: "Weapon — offense",
  statusChance: "Weapon — offense",
  statusChancePerCombo: "Weapon — offense",
  damagePerStatus: "Weapon — offense",
  finisherDamage: "Weapon — offense",
  slideAttack: "Weapon — offense",
  meleeDamage: "Weapon — offense",
  impact: "Weapon — physical",
  puncture: "Weapon — physical",
  slash: "Weapon — physical",
  heat: "Weapon — elemental",
  cold: "Weapon — elemental",
  toxin: "Weapon — elemental",
  electricity: "Weapon — elemental",
  extraElectricProcChance: "Weapon — offense",
  falloffDistance: "Weapon — utility",
  blast: "Weapon — elemental",
  radiation: "Weapon — elemental",
  gas: "Weapon — elemental",
  magnetic: "Weapon — elemental",
  viral: "Weapon — elemental",
  corrosive: "Weapon — elemental",
  magazine: "Weapon — utility",
  reloadSpeed: "Weapon — utility",
  accuracy: "Weapon — utility",
  recoil: "Weapon — utility",
  zoom: "Weapon — utility",
  punchThrough: "Weapon — utility",
  range: "Weapon — utility",
  flightSpeed: "Weapon — utility",
  holsterRate: "Weapon — utility",
  comboDuration: "Melee",
  comboCountChance: "Melee",
  heavyAttackEfficiency: "Melee",
  initialCombo: "Melee",
  meleeRange: "Melee",
  slashSize: "Melee",
  channelingDamage: "Melee",
  channelingEfficiency: "Melee",
  health: "Warframe — defense",
  shield: "Warframe — defense",
  armor: "Warframe — defense",
  energy: "Warframe — defense",
  energyMax: "Warframe — defense",
  shieldRecharge: "Warframe — defense",
  healthRegen: "Warframe — defense",
  tauResistance: "Warframe — defense",
  abilityStrength: "Warframe — ability",
  abilityDuration: "Warframe — ability",
  abilityEfficiency: "Warframe — ability",
  abilityRange: "Warframe — ability",
  flow: "Warframe — ability",
  flowEnergyMax: "Warframe — ability",
  sprintSpeed: "Movement",
  slideSpeed: "Movement",
  parkourVelocity: "Movement",
  aimGlideDuration: "Movement",
  pickupDoubleChance: "Loot",
  creditPickupDoubleChance: "Loot",
  resourcePickupDoubleChance: "Loot",
  impactStatusStacks: "Status",
  reviveShieldHealth: "Defense",
  weakspotDamage: "Weapon — offense",
  incapacitationTimerReduction: "Companion",
  slideFriction: "Movement",
  bulletJump: "Movement",
  castSpeed: "Warframe — ability",
  bleedoutReduction: "Warframe — defense",
  gravityReduction: "Movement",
  hardLandingReduction: "Movement",
  blockStaggerChance: "Melee — block",
  blockStunChance: "Melee — block",
  blockAngle: "Melee — block",
  overshieldConversion: "Warframe — defense",
  lootDetection: "Utility",
  lootRadar: "Utility",
  enemyRadar: "Utility",
  flatBaseDamage: "Weapon — offense",
  statusDamage: "Weapon — offense",
  statusDamageBonus: "Weapon — offense",
  headshotDamage: "Weapon — offense",
  headshotMultiplier: "Weapon — offense",
  weakPointDamage: "Weapon — offense",
  tau: "Weapon — elemental",
  void: "Weapon — elemental",
  disposition: "Other",
};

const ARCANE_CATALOG_GROUPS: Record<string, string> = {
  ampHeatDamage: "Amplifier",
  ampCritDamage: "Amplifier",
  ampStatusChance: "Amplifier",
  ampStatusDamage: "Amplifier",
  ampSchoolDamage: "Amplifier",
  ampEnergyRegen: "Amplifier",
  ampBonusDamage: "Amplifier",
  ampReload: "Amplifier",
  ampMultishot: "Amplifier",
  ampCritChance: "Amplifier",
  ampRange: "Amplifier",
  ampFireRate: "Amplifier",
  ampDamage: "Amplifier",
  fireRateOnCrit: "Conditional",
  shieldRegenChance: "Regen / proc",
  shieldRegenAmount: "Regen / proc",
};

function modStatGroup(key: string): string {
  return MOD_STAT_GROUPS[key] ?? (key.startsWith("amp") ? "Arcane catalog" : "Other");
}

export function getModStatLabel(key: string): string {
  return formatOverrideFieldLabel(key);
}

function collectRecordKeys(
  items: { stats?: Record<string, unknown>; statBonuses?: Record<string, unknown> }[],
  field: "stats" | "statBonuses",
  fallbacks: readonly string[] = [],
): string[] {
  const keys = new Set<string>(fallbacks);
  for (const item of items) {
    const record = item[field];
    if (record) {
      for (const k of Object.keys(record)) keys.add(k);
    }
  }
  return [...keys].sort((a, b) => getModStatLabel(a).localeCompare(getModStatLabel(b)));
}

function toOptions(keys: string[], labelFn: (k: string) => string, groupFn: (k: string) => string): StatPickerOption[] {
  return keys.map((value) => ({
    value,
    label: labelFn(value),
    group: groupFn(value),
  }));
}

export function getModStatPickerOptions(): StatPickerOption[] {
  const keys = collectRecordKeys(allMods, "stats", MOD_STAT_FALLBACK_KEYS);
  return toOptions(keys, getModStatLabel, modStatGroup);
}

export function getArcaneCatalogStatPickerOptions(): StatPickerOption[] {
  const keys = collectRecordKeys(allArcanes, "stats");
  return toOptions(keys, getModStatLabel, (k) => ARCANE_CATALOG_GROUPS[k] ?? "Catalog stat");
}

export function getArcaneEffectStatPickerOptions(): StatPickerOption[] {
  const keys = new Set<string>(getKnownArcaneStatKeys());
  for (const def of Object.values(ARCANE_EFFECTS)) {
    for (const line of def.effects ?? []) keys.add(line.stat);
  }
  return toOptions(
    [...keys].sort((a, b) => getArcaneStatLabel(a).localeCompare(getArcaneStatLabel(b))),
    getArcaneStatLabel,
    (k) => {
      if (k.endsWith("Chance") || k.includes("Proc")) return "Proc / conditional";
      if (k.includes("Duration") || k === "buffDuration") return "Duration";
      if (
        k === "reloadSpeed"
        || k === "reloadSpeedBonus"
        || k === "reloadSpeedChance"
        || k === "reloadDamageRamp"
      ) {
        return "On reload / reload speed";
      }
      if (["damage", "criticalChance", "criticalMultiplier", "multishot", "fireRate", "attackSpeed", "statusChance", "meleeDamageBonus"].includes(k)) {
        return "Combat stats";
      }
      if (k.startsWith("operator")) return "Operator";
      if (["health", "healthFlat", "shield", "armor", "energyRegen", "damageReduction"].includes(k)) {
        return "Defense / sustain";
      }
      if (k.startsWith("ability") || k.includes("Energy") || k === "ammoEfficiency") return "Ability / utility";
      return "Other effects";
    },
  );
}

export function getShardStatPickerOptions(): StatPickerOption[] {
  const keys = collectRecordKeys(allArchonShards, "statBonuses");
  return toOptions(keys, getModStatLabel, () => "Shard bonus");
}

export function filterUnusedStatOptions(
  options: StatPickerOption[],
  usedKeys: Set<string>,
): StatPickerOption[] {
  return options.filter((o) => !usedKeys.has(o.value));
}
