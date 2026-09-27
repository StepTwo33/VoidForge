import type { Mod } from "@/lib/types";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { isWarframeAugment } from "@/lib/mods/warframe-augment-mods";
import type { WeaponModSlotType } from "@/lib/mods/mod-weapon-eligibility";

export type ModPickerSlotKind = WeaponModSlotType | "aura" | "exilus" | "companion_precept";

export type ModStatFilterId =
  | "all"
  | "strength"
  | "duration"
  | "range"
  | "efficiency"
  | "survivability"
  | "speed"
  | "damage"
  | "crit"
  | "status"
  | "multishot"
  | "utility"
  | "augment";

export type ModSortId = "name" | "drain-asc" | "drain-desc";

export interface ModStatFilterOption {
  id: ModStatFilterId;
  label: string;
}

const WARFRAME_FILTERS: ModStatFilterOption[] = [
  { id: "all", label: "All" },
  { id: "strength", label: "Strength" },
  { id: "duration", label: "Duration" },
  { id: "range", label: "Range" },
  { id: "efficiency", label: "Efficiency" },
  { id: "survivability", label: "Survivability" },
  { id: "speed", label: "Speed" },
  { id: "utility", label: "Utility" },
  { id: "augment", label: "Augment" },
];

const WEAPON_FILTERS: ModStatFilterOption[] = [
  { id: "all", label: "All" },
  { id: "damage", label: "Damage" },
  { id: "crit", label: "Crit" },
  { id: "status", label: "Status" },
  { id: "multishot", label: "Multishot" },
  { id: "speed", label: "Speed" },
  { id: "range", label: "Range" },
  { id: "utility", label: "Utility" },
];

const COMPANION_FILTERS: ModStatFilterOption[] = [
  { id: "all", label: "All" },
  { id: "survivability", label: "Survivability" },
  { id: "damage", label: "Damage" },
  { id: "crit", label: "Crit" },
  { id: "status", label: "Status" },
  { id: "utility", label: "Utility" },
];

/** Map mod stat keys → picker filter tags (mods can match multiple). */
const STAT_KEY_FILTERS: Record<string, ModStatFilterId[]> = {
  abilityStrength: ["strength"],
  abilityDuration: ["duration"],
  abilityRange: ["range"],
  abilityEfficiency: ["efficiency"],
  castSpeed: ["speed", "utility"],
  health: ["survivability"],
  shield: ["survivability"],
  armor: ["survivability"],
  energy: ["survivability", "utility"],
  energyMax: ["survivability", "utility"],
  flow: ["utility"],
  flowEnergyMax: ["utility"],
  healthRegen: ["survivability"],
  shieldRecharge: ["survivability"],
  tauResistance: ["survivability"],
  bleedoutReduction: ["survivability"],
  overshieldConversion: ["survivability"],
  reviveShieldHealth: ["survivability"],
  sprintSpeed: ["speed"],
  parkourVelocity: ["speed"],
  bulletJump: ["speed"],
  aimGlideDuration: ["speed", "utility"],
  slideFriction: ["speed"],
  gravityReduction: ["speed"],
  hardLandingReduction: ["speed"],
  lootDetection: ["utility"],
  enemyRadar: ["utility", "range"],
  pickupDoubleChance: ["utility"],
  creditPickupDoubleChance: ["utility"],
  resourcePickupDoubleChance: ["utility"],
  damage: ["damage"],
  meleeDamage: ["damage"],
  gunDamage: ["damage"],
  impact: ["damage"],
  puncture: ["damage"],
  slash: ["damage"],
  heat: ["damage"],
  cold: ["damage"],
  toxin: ["damage"],
  electricity: ["damage"],
  blast: ["damage"],
  radiation: ["damage"],
  gas: ["damage"],
  magnetic: ["damage"],
  viral: ["damage"],
  corrosive: ["damage"],
  criticalChance: ["crit"],
  criticalChanceOnHeadshot: ["crit"],
  criticalChanceOnHeadshotKill: ["crit"],
  criticalMultiplier: ["crit"],
  criticalChancePerCombo: ["crit"],
  statusChance: ["status"],
  statusChancePerCombo: ["status"],
  damagePerStatus: ["status"],
  slashOnCrit: ["status", "crit"],
  extraElectricProcChance: ["status"],
  slashOnImpactProc: ["status"],
  damageFirstShot: ["damage"],
  multishot: ["multishot"],
  multishotOnKill: ["multishot"],
  fireRate: ["speed"],
  attackSpeed: ["speed"],
  reloadSpeed: ["utility"],
  magazine: ["utility"],
  accuracy: ["utility"],
  recoil: ["utility"],
  zoom: ["utility"],
  punchThrough: ["utility", "range"],
  range: ["range", "utility"],
  meleeRange: ["range"],
  flightSpeed: ["utility"],
  comboDuration: ["utility"],
  heavyAttackEfficiency: ["utility"],
  finisherDamage: ["damage"],
  slideAttack: ["damage"],
  weakspotDamage: ["damage"],
  weakPointDamage: ["damage"],
};

const WEAPON_CATEGORIES = new Set([
  "primary",
  "secondary",
  "melee",
  "archmelee",
  "archgun",
  "rifle",
  "shotgun",
  "bow",
  "pistol",
  "launcher",
]);

/** Stat keys from catalog + verified behaviors. */
export function getModEffectiveStatKeys(mod: Mod): string[] {
  const keys = new Set<string>();
  for (const key of Object.keys(mod.stats ?? {})) {
    keys.add(key);
  }
  const behavior = getVerifiedModBehavior(mod.id);
  if (behavior) {
    for (const line of behavior.stats) {
      keys.add(line.statKey);
    }
  }
  return [...keys];
}

export function getModStatFilterTags(mod: Mod): Set<ModStatFilterId> {
  const tags = new Set<ModStatFilterId>();
  if (isWarframeAugment(mod) || mod.category === "augment") {
    tags.add("augment");
  }
  for (const key of getModEffectiveStatKeys(mod)) {
    const mapped = STAT_KEY_FILTERS[key];
    if (mapped) {
      for (const tag of mapped) tags.add(tag);
    }
  }
  return tags;
}

export function modMatchesStatFilter(mod: Mod, filter: ModStatFilterId): boolean {
  if (filter === "all") return true;
  return getModStatFilterTags(mod).has(filter);
}

export function getModPickerStatFilters(
  builderCategory: string,
  slotType?: ModPickerSlotKind,
): ModStatFilterOption[] {
  if (slotType === "companion_precept" || builderCategory === "companion") {
    return COMPANION_FILTERS;
  }
  if (WEAPON_CATEGORIES.has(builderCategory)) {
    return WEAPON_FILTERS;
  }
  if (builderCategory === "warframe") {
    if (slotType === "aura" || slotType === "exilus") {
      return WARFRAME_FILTERS.filter((f) => f.id !== "augment");
    }
    return WARFRAME_FILTERS;
  }
  // Archwing, necramech, railjack, etc.
  if (["archwing", "necramech"].includes(builderCategory)) {
    return WARFRAME_FILTERS;
  }
  return WARFRAME_FILTERS;
}

export function sortMods(list: Mod[], sortId: ModSortId): Mod[] {
  const sorted = [...list];
  switch (sortId) {
    case "drain-asc":
      return sorted.sort((a, b) => a.drain - b.drain || a.name.localeCompare(b.name));
    case "drain-desc":
      return sorted.sort((a, b) => b.drain - a.drain || a.name.localeCompare(b.name));
    case "name":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}
