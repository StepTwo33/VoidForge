import type { Mod } from "@/lib/types";
import { getVerifiedModBehavior } from "@/lib/mods/mod-behavior-registry";
import { isPanelOnlyModStat } from "@/lib/display/mod-wiki-tables";
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

/** Railjack Plexus mods are turret / ordnance / ability mods, not Warframe ability-stat mods. */
const RAILJACK_FILTERS: ModStatFilterOption[] = [
  { id: "all", label: "All" },
  { id: "damage", label: "Damage" },
  { id: "crit", label: "Crit" },
  { id: "speed", label: "Speed" },
  { id: "survivability", label: "Survivability" },
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
  // Damage resistance / damage reduction keys (Rounds 15b–17, wiki.warframe.com stat names).
  toxinDamageResistance: ["survivability"],
  physicalDamageResistance: ["survivability"],
  heatDamageResistance: ["survivability"],
  coldDamageResistance: ["survivability"],
  electricityDamageResistance: ["survivability"],
  radiationDamageResistance: ["survivability"],
  blastDamageResistance: ["survivability"],
  stunDamageResistance: ["survivability"],
  dodgeDamageResistance: ["survivability"],
  bulletJumpDamageResistance: ["survivability"],
  knockedDownDamageResistance: ["survivability"],
  airborneDamageReduction: ["survivability"],
  damageResistancePerStack: ["survivability"],
  damageResistanceCap: ["survivability"],
  allyDamageReduction: ["survivability"],
  sharedDamageReduction: ["survivability"],
  conditionalDamageReduction: ["survivability"],
  abilityDamageReductionWhileBlocking: ["survivability"],
  damageRedirectedPerShadow: ["survivability"],
  allyDamageRedirected: ["survivability"],
  damageReflected: ["survivability"],
  enemyProjectileDamage: ["survivability"],
  elementalResistance: ["survivability"],
  knockdownResistance: ["survivability"],
  knockdownRecovery: ["survivability"],
  statusImmunity: ["survivability"],
  evasion: ["survivability", "utility"],
  sprintSpeed: ["speed"],
  parkourVelocity: ["speed"],
  bulletJump: ["speed"],
  aimGlideDuration: ["speed", "utility"],
  aimGlideTime: ["speed", "utility"],
  aimGlide: ["speed", "utility"],
  wallLatchTime: ["utility"],
  mobility: ["speed"],
  slideSpeed: ["speed"],
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
  noiseReduction: ["utility"],
  forgeCapacity: ["utility"],
  forgeCooldown: ["utility"],
  turretHeatCapacity: ["utility"],
  enemyProjectileSpeed: ["utility"],
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
  // Round 18: keys that replaced stray `damage` keys (wiki.warframe.com stat tables).
  repairChance: ["utility"],
  decoyEvasionChance: ["survivability"],
  reflectChance: ["survivability"],
  reflectedDamageAmplification: ["survivability"],
  lethalImmunityChance: ["survivability"],
  lifestealToOwner: ["survivability"],
  maxHealthAbsorbed: ["survivability"],
  sandstormRange: ["range"],
  damageToShieldConversion: ["survivability"],
  damageRedirected: ["survivability"],
  reckoningRange: ["range"],
  // Round 23: Hallowed Reckoning (wiki.warframe.com stat table) and Retribution's +20/rank Electricity.
  armorBonusRadius: ["range"],
  reckoningArmor: ["survivability"],
  reckoningDuration: ["duration"],
  reckoningArmorGrace: ["survivability"],
  retaliationElectricity: ["survivability"],
  pacifySlow: ["utility"],
  provokeStrength: ["strength"],
  energyOnHealthDamage: ["survivability", "utility"],
  retaliationChance: ["survivability"],
  comboCountChance: ["utility"],
  initialCombo: ["utility"],
  // Round 19: Duplex Bond's Energy Orb drop chance (replaced its stray `energy` key).
  energyOrbDropChance: ["utility"],
  // Round 23: companion mods whose only stat keys had no chip (effects from the wiki max-rank text).
  healOnMelee: ["survivability"], // Pack Leader: heal the companion on melee hits, excess becomes Overguard
  healthPickupBonus: ["survivability"], // Synth Fiber: Health Orbs give the companion Armor
  stealthDurationCap: ["utility"], // Covert Bond: companion stealth
  reviveOverguard: ["survivability"], // Reinforced Bond: reload restores companion Overshields
  healthOnKill: ["survivability"], // Restorative Bond
  restoreNearby: ["survivability"],
  coldDamage: ["damage"], // Coolant Leak: radial Cold blast
  shieldRestore: ["survivability"], // Guardian, Protect
  healthRestore: ["survivability"], // Medi-Ray
  healthRestoreMove: ["survivability"], // Odomedic
  bubbleHealth: ["survivability"], // Sanctuary
  overshields: ["survivability"], // Shield Charger
  regenCharges: ["survivability"], // Regen, Primed Regen (revive)
  revive: ["survivability"], // Sacrifice
  blastDamage: ["damage"], // Self Destruct
  autoRevive: ["survivability"], // Reawaken
  statusImmunity: ["survivability"], // Negate
  digCooldown: ["utility"], // Dig
  buffChance: ["utility"], // Charm
  reviveChance: ["survivability"], // Transfusion
  commandOnStatus: ["status"], // Hunter Command: Slash status makes the companion attack
  critLink: ["crit"], // Hunter Synergy: Critical Chance added to the companion
  energyOnAssist: ["utility"], // Energy Generator
  hotspotRange: ["utility"], // Scan Aquatic Lifeforms
  dodgeChance: ["survivability"], // Evasive Denial
  fireRateBonus: ["utility"], // Reinforced Bond: +60% fire rate while the companion has 1200+ shields
};

/**
 * Mods whose effect is in their wiki text but not in any chip-mapped stat key (generic duration /
 * cooldown, or no stats at all). Tags come from the wiki max-rank description (wiki.warframe.com
 * mod pages, Plexus Mods table). Applied on top of STAT_KEY_FILTERS.
 */
export const MOD_FILTER_TAGS_BY_ID: Record<string, readonly ModStatFilterId[]> = {
  // --- Companion (Companion filters: survivability / damage / crit / status / utility) ---
  tenacious_bond: ["survivability", "crit"], // headshot kills cut Recovery Time; +1.2x Final Crit Damage over 50% crit
  manifold_bond: ["status", "utility"], // precepts apply Status Effects; ability cooldown reduction
  anabolic_pollination: ["damage"], // +100% Toxin Damage cloud
  crescent_devolution: ["damage"], // larval charge dealing 100 Puncture
  panzer_devolution: ["damage"], // quills dealing 60 Viral each
  sly_devolution: ["survivability"], // enemy accuracy -20%
  focused_prospectus: ["damage"], // beam dealing 900 Heat
  iatric_mycelium: ["survivability"], // heals the companion and allies 300 health
  null_audit: ["utility"], // Eximus aura / abilities, strips Overguard
  survival_instinct: ["survivability"], // enemies lose sight on Bullet Jump
  tandem_bond: ["damage"], // Combo and +30% companion melee damage
  ammo_case: ["utility"], // +25% Ammo Capacity, ammo pickup conversion
  elusive_posture: ["survivability"], // +50% Evasion
  scavenge: ["utility"], // locker prying
  // Keys shared with non-companion mods (Health Orb chance, loot chance, status damage / duration)
  // are tagged by id so no Warframe / weapon mod changes chip.
  synth_deconstruct: ["survivability"], // Health Orb drops
  spare_parts: ["utility"], // marked target drops more items
  immunity_resistance: ["status"], // +50% Status Damage
  frenzied_posture: ["status"], // +80% Status Duration
  mystic_bond: ["utility"], // free Warframe ability cast after the companion uses abilities
  anti_grav_array: ["utility"], // owner jump height +40%
  coolant_leak: ["damage", "status"], // radial Cold blast, slows / Cold stacks
  regen: ["survivability"], // Sentinel revives with 10s invulnerability
  primed_regen: ["survivability"],
  reawaken: ["survivability"], // Overshields + recovery timer
  negate: ["survivability"], // prevents Status Effects on the owner
  dig: ["utility"], // sniffs out buried objects
  transfusion: ["survivability"], // Vasca Kavat raises its bleeding-out Master
  hunter_command: ["status"], // Slash Status makes the companion attack the target
  energy_generator: ["utility"], // Dethcube drops Energy Orbs
  tek_enhance: ["utility"], // +30% Ability Duration for the Tek abilities
  // --- Railjack (RAILJACK_FILTERS: damage / crit / speed / survivability / utility) ---
  indomitable_matrix: ["survivability"],
  ironclad_matrix: ["survivability"],
  onslaught_matrix: ["damage", "survivability"],
  orgone_tuning_matrix: ["survivability", "utility"],
  raider_matrix: ["utility", "speed", "damage"],
  conic_nozzle: ["speed"],
  cruising_speed: ["speed"],
  ion_burn: ["speed"],
  crimson_fugue: ["damage"],
  defensive_fire: ["survivability"],
  fortifying_fire: ["survivability", "crit"],
  hyperstrike: ["damage"],
  predator: ["crit"],
  protective_shots: ["damage"],
  section_density: ["crit"],
  turret_velocity: ["utility"],
  waveband_disruptor: ["crit", "damage"],
  granums_nemesis: ["damage"],
  sentient_scalpel: ["damage"],
  worms_torment: ["damage"],
  ordnance_cheap_shot: ["utility"],
  ordnance_velocity: ["utility"],
  overloader: ["utility"],
  quicklock: ["utility"],
  ripload: ["utility"],
  scourging_warheads: ["damage"],
  warhead: ["damage"],
  artillery_cheap_shot: ["utility"],
  forward_artillery: ["damage"],
  revo_reducer: ["utility"],
  blackout_pulse: ["damage", "utility"],
  countermeasures: ["survivability"],
  munitions_vortex: ["survivability", "damage"],
  particle_ram: ["damage"],
  shatter_burst: ["damage"],
  tether: ["utility", "damage"],
  phoenix_blaze: ["damage", "speed", "survivability"],
  seeker_volley: ["damage"],
  void_hole: ["damage", "utility"],
  battle_forge: ["utility"],
  breach_quanta: ["survivability"],
  death_blossom: ["damage"],
  fire_suppression: ["survivability"],
  flow_burn: ["speed"],
  form_up: ["survivability"],
  squad_renew: ["survivability"],
  intruder_stasis: ["survivability"],
  battle_stations: ["damage"],
  void_cloak: ["survivability"],
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
    // Pseudo-stats the card doesn't show (wiki has no stat by that name) don't earn a chip either.
    if (isPanelOnlyModStat(mod.id, key)) continue;
    const mapped = STAT_KEY_FILTERS[key];
    if (mapped) {
      for (const tag of mapped) tags.add(tag);
    }
  }
  for (const tag of MOD_FILTER_TAGS_BY_ID[mod.id] ?? []) tags.add(tag);
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
  if (builderCategory === "railjack") {
    return RAILJACK_FILTERS;
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
