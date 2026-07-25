// ==========================================================================
// INCARNON EVOLUTION DATA
// ==========================================================================
// Converted from lib/data/incarnon_data_complete.dart
// 53 Incarnon weapons with full evolution data
// Evolution perks are resolved from wiki-parsed data (see
// src/data/incarnon-genesis-evolutions.ts); inline lists remain as fallback.
// ==========================================================================
import { WIKI_INCARNON_EVOLUTIONS } from "./incarnon-genesis-evolutions";

export interface IncarnonEvolution {
  tier: number;
  slot: number;
  name: string;
  description: string;
  statChanges: Record<string, number>;
  /** Per-variant overrides (wiki tables list different values per variant, e.g. Bo vs Bo Prime). */
  variantStatChanges?: Record<string, Record<string, number>>;
  /**
   * Extra flat deltas applied only while Incarnon Form is active
   * (e.g. Elemental Dominance doubling, "+Y% for Incarnon Form").
   */
  formStatChanges?: Record<string, number>;
  /** Per-variant overrides for formStatChanges. */
  variantFormStatChanges?: Record<string, Record<string, number>>;
  /**
   * Extra deltas for charge-mode Incarnon attacks only (e.g. Onos Devastation Cascade
   * on the fully charged blast). Merged when merge options.chargeMode is true.
   */
  chargeStatChanges?: Record<string, number>;
}

export interface IncarnonForm {
  name: string;
  damage: number;
  fireRate: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  triggerType: string;
  magazine?: number;
  reloadTime?: number;
  multishot?: number;
  impact?: number;
  puncture?: number;
  slash?: number;
  /** When set, form damage is this pure element (clears IPS). */
  damageType?: string;
  heat?: number;
  cold?: number;
  toxin?: number;
  electricity?: number;
  radiation?: number;
  viral?: number;
  corrosive?: number;
  blast?: number;
  gas?: number;
  magnetic?: number;
  tau?: number;
  specialMechanics?: Record<string, string>;
}

export interface IncarnonWeaponData {
  weaponId: string;
  weaponName: string;
  challenge: string;
  category: string;
  variants?: string[];
  forms: IncarnonForm[];
  evolutions: IncarnonEvolution[];
}

// Standard evolution pools - 3 choices per tier, based on weapon type
function getRangedEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
    // Tier 2: Damage bonuses
    { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
    { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when only this weapon type is equipped.", statChanges: {} },
    { tier: 2, slot: 2, name: "Rapid Wrath", description: "On kill: +20% Fire Rate for 4s.", statChanges: {} },
    // Tier 3: Utility/damage
    { tier: 3, slot: 0, name: "Elemental Excess", description: "+20% Elemental Damage per unique status type affecting the target.", statChanges: {} },
    { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Transmutation Buildup.", statChanges: {} },
    { tier: 3, slot: 2, name: "Metabolic Recharge", description: "+100% Ammo Efficiency in Incarnon Form.", statChanges: {} },
    // Tier 4: Offensive utility
    { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
    { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
    { tier: 4, slot: 2, name: "Hound's Flare", description: "On kill: +30% Critical Chance for 12s.", statChanges: {} },
    // Tier 5: Major tradeoffs
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

function getMeleeEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Heavy/Slide attacks to transform.", statChanges: {} },
    // Tier 2: Core stat boosts
    { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
    { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
    { tier: 2, slot: 2, name: "Vehement Charge", description: "+40% Attack Speed.", statChanges: { fireRate: 0.4 } },
    // Tier 3: Utility/damage
    { tier: 3, slot: 0, name: "Elemental Excess", description: "+20% Elemental Damage per unique status type affecting the target.", statChanges: {} },
    { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Transmutation Buildup.", statChanges: {} },
    { tier: 3, slot: 2, name: "Metabolic Recharge", description: "+100% Combo Efficiency (combo counter decays slower).", statChanges: {} },
    // Tier 4: Offensive utility
    { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Melee Range.", statChanges: {} },
    { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
    { tier: 4, slot: 2, name: "Combo Fury", description: "+50% Combo Count Chance.", statChanges: {} },
    // Tier 5: Major tradeoffs
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

// Update 43 genesis weapons use weapon-specific evolution perks (wiki-verified).
const WEAPON_SPECIFIC_EVOLUTION_IDS = new Set([
  "felarx", "laetum",
  "vectis_incarnon", "stug_incarnon", "ballistica_incarnon", "destreza_incarnon", "obex_incarnon",
]);

function getVectisIncarnonEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire while unscoped to transform.", statChanges: {} },
    { tier: 2, slot: 0, name: "Inciting Incident", description: "On Headshot: +100% Ammo Efficiency for 4s.", statChanges: {} },
    { tier: 2, slot: 1, name: "Lone Enforcer", description: "+75 Base Damage (+150 Vectis Prime) and +25% Multishot when no enemies are within range.", statChanges: {} },
    { tier: 3, slot: 0, name: "Rapid Reinforcement", description: "+60% Reload Speed.", statChanges: { reloadSpeed: 0.6 } },
    { tier: 3, slot: 1, name: "Marksman's Hand", description: "+60% Zoom while Aiming.", statChanges: {} },
    { tier: 3, slot: 2, name: "Silent Running", description: "100% Noise Reduction.", statChanges: {} },
    { tier: 4, slot: 0, name: "Deadhead", description: "On Headshot Kill: +100% Damage for 8s.", statChanges: {} },
    { tier: 4, slot: 1, name: "Critical Parallel", description: "+Critical Chance and +0.5x Critical Damage.", statChanges: { criticalChance: 0.2, criticalMultiplier: 0.5 } },
    { tier: 4, slot: 2, name: "Survivor's Edge", description: "+30% of Critical Chance as Status Chance, up to +40%.", statChanges: {} },
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

function getStugIncarnonEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Direct hits charge Incarnon Transmutation. Alt-fire to unleash bouncing corrosive blobs.", statChanges: {} },
    { tier: 2, slot: 0, name: "Blazing Barrel", description: "+175 Base Damage. On hit: +5% Multishot for 3s, stacks up to 10x (resets on reload).", statChanges: {} },
    { tier: 2, slot: 1, name: "Overcharge Blast", description: "+300 Base Damage. Blast radius scales with max Warframe Energy above 700.", statChanges: {} },
    { tier: 3, slot: 0, name: "Rapid Reinforcement", description: "+50% Reload Speed.", statChanges: { reloadSpeed: 0.5 } },
    { tier: 3, slot: 1, name: "Swift Deliverance", description: "+80% Projectile Speed.", statChanges: {} },
    { tier: 3, slot: 2, name: "Resonant Restore", description: "+10 Magazine Capacity. Reloading from empty grants +10 Magazine, stacks up to 3x.", statChanges: {} },
    { tier: 4, slot: 0, name: "Survivor's Edge", description: "+15% Critical Chance and +15% Status Chance in both forms.", statChanges: { criticalChance: 0.15, statusChance: 0.15 } },
    { tier: 4, slot: 1, name: "Death Trap Trigger", description: "+25% Critical Chance and +1.5x Critical Damage.", statChanges: { criticalChance: 0.25, criticalMultiplier: 1.5 } },
    { tier: 4, slot: 2, name: "Elemental Dominance", description: "+20% Status Chance. Doubles in Incarnon Form.", statChanges: { statusChance: 0.2 } },
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

function getBallisticaIncarnonEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire for cross-shaped Slash projectiles.", statChanges: {} },
    { tier: 2, slot: 0, name: "Headcracker", description: "On Punch Through Hit: +7.5% Critical Chance for 3s. Stacks up to 10x.", statChanges: {} },
    { tier: 2, slot: 1, name: "Prolific Perforation", description: "On Punch Through Hit: +10% Critical Chance for 3s. Stacks up to 8x.", statChanges: {} },
    { tier: 3, slot: 0, name: "Rapid Reinforcement", description: "+50% Reload Speed.", statChanges: { reloadSpeed: 0.5 } },
    { tier: 3, slot: 1, name: "Swift Deliverance", description: "+80% Projectile Speed.", statChanges: {} },
    { tier: 3, slot: 2, name: "Void's Guidance", description: "+40% Accuracy, -40% Recoil.", statChanges: {} },
    { tier: 4, slot: 0, name: "Elemental Balance", description: "Increase Base Status per projectile and in Incarnon Form.", statChanges: {} },
    { tier: 4, slot: 1, name: "Survivor's Edge", description: "+30% of Critical Chance as Status Chance, up to +40%.", statChanges: {} },
    { tier: 4, slot: 2, name: "Critical Parallel", description: "+Critical Chance and +0.5x Critical Damage.", statChanges: { criticalChance: 0.2, criticalMultiplier: 0.5 } },
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

function getDestrezaIncarnonEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Reach 6x Combo then Heavy Attack. Lasts 180 seconds.", statChanges: {} },
    { tier: 2, slot: 0, name: "Weighted Impetus", description: "+100% Heavy Attack Wind Up Speed.", statChanges: {} },
    { tier: 2, slot: 1, name: "Piercing Stature", description: "On Puncture proc: +20% Status Chance for 6s. Stacks 5x.", statChanges: {} },
    { tier: 2, slot: 2, name: "Orokin Reach", description: "+1.2m Range.", statChanges: {} },
    { tier: 3, slot: 0, name: "Overhand", description: "+30% Heavy Attack Damage.", statChanges: {} },
    { tier: 3, slot: 1, name: "Adept Reflexes", description: "+20 Initial Combo.", statChanges: {} },
    { tier: 3, slot: 2, name: "Swift Transformation", description: "+50% Incarnon Transmutation Buildup.", statChanges: {} },
    { tier: 4, slot: 0, name: "Absolute Dominion", description: "+Status Chance.", statChanges: { statusChance: 0.25 } },
    { tier: 4, slot: 1, name: "Critical Forte", description: "+Critical Damage in Incarnon Form.", statChanges: {} },
    { tier: 4, slot: 2, name: "Decisive Stature", description: "+25% Attack Speed, +35% Heavy Attack Speed.", statChanges: { fireRate: 0.25 } },
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

function getObexIncarnonEvolutions(): IncarnonEvolution[] {
  return [
    { tier: 1, slot: 0, name: "Incarnon Form", description: "Reach 6x Combo then Heavy Attack. Finishers deal radial damage. Lasts 180 seconds.", statChanges: {} },
    { tier: 2, slot: 0, name: "Balanced Stagger", description: "20% chance to stun on Neutral Combo hits, opening finishers.", statChanges: {} },
    { tier: 2, slot: 1, name: "Armored Finisher", description: "With Armor over 450: +80% Finisher Damage.", statChanges: {} },
    { tier: 3, slot: 0, name: "Rapid Conclusion", description: "On Finisher Kill: +2.5% Parkour Velocity. Stacks up to 16x.", statChanges: {} },
    { tier: 3, slot: 1, name: "Standoff", description: "Combo timer pauses when weapon is holstered.", statChanges: {} },
    { tier: 3, slot: 2, name: "Orokin Reach", description: "+1.2m Range.", statChanges: {} },
    { tier: 4, slot: 0, name: "Absolute Dominion", description: "+Status Chance.", statChanges: { statusChance: 0.25 } },
    { tier: 4, slot: 1, name: "Subtle Force", description: "+10% Damage.", statChanges: { damage: 0.1 } },
    { tier: 4, slot: 2, name: "Critical Coefficient", description: "+0.6x Critical Damage.", statChanges: { criticalMultiplier: 0.6 } },
    { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
    { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to highest Elemental type.", statChanges: {} },
    { tier: 5, slot: 2, name: "Rapacious Cruelty", description: "+50% Critical Chance, -50% Status Chance.", statChanges: { criticalChance: 0.5, statusChance: -0.5 } },
  ];
}

function resolveIncarnonEvolutions(data: IncarnonWeaponData, isMelee: boolean): IncarnonEvolution[] {
  // Wiki-parsed evolutions (scripts/_generate_incarnon_evolutions.js) are the
  // source of truth; earlier hand-written pools contained fabricated perks.
  const wiki = WIKI_INCARNON_EVOLUTIONS[data.weaponId];
  if (wiki && wiki.length > 0) return wiki;
  if (WEAPON_SPECIFIC_EVOLUTION_IDS.has(data.weaponId)) return data.evolutions;
  return isMelee ? getMeleeEvolutions() : getRangedEvolutions();
}

export const INCARNON_WEAPON_IDS = new Set([
  "ack_&_brunt",
  "ack_brunt_incarnon",
  "angstrum",
  "angstrum_incarnon",
  "anku",
  "anku_incarnon",
  "atomos",
  "atomos_incarnon",
  "ballistica",
  "ballistica_incarnon",
  "ballistica_prime",
  "bo",
  "bo_incarnon",
  "bo_prime",
  "boar",
  "boar_incarnon",
  "boar_prime",
  "boltor",
  "boltor_incarnon",
  "boltor_prime",
  "braton",
  "braton_incarnon",
  "braton_prime",
  "braton_vandal",
  "bronco",
  "bronco_incarnon",
  "bronco_prime",
  "burston",
  "burston_incarnon",
  "burston_prime",
  "ceramic_dagger",
  "ceramic_dagger_incarnon",
  "cestra",
  "cestra_incarnon",
  "dera",
  "dera_incarnon",
  "dera_vandal",
  "despair",
  "despair_incarnon",
  "destreza",
  "destreza_incarnon",
  "destreza_prime",
  "dex_sybaris",
  "dread",
  "dread_incarnon",
  "dual_ichor",
  "dual_ichor_incarnon",
  "dual_toxocyst",
  "dual_toxocyst_incarnon",
  "felarx",
  "furia",
  "furax_incarnon",
  "furia_wraith",
  "furis",
  "furis_incarnon",
  "gammacor",
  "gammacor_incarnon",
  "gorgon",
  "gorgon_incarnon",
  "gorgon_wraith",
  "hate",
  "hate_incarnon",
  "innodem",
  "kunai",
  "kunai_incarnon",
  "laetum",
  "lato",
  "lato_incarnon",
  "lato_prime",
  "lato_vandal",
  "latron",
  "latron_incarnon",
  "latron_prime",
  "latron_wraith",
  "lex",
  "lex_incarnon",
  "lex_prime",
  "magistar",
  "magistar_incarnon",
  "miter",
  "miter_incarnon",
  "mk1_bo",
  "mk1_braton",
  "mk1_furax",
  "mk1_furis",
  "mk1_kunai",
  "mk1_paris",
  "mk1_strun",
  "nami_solo",
  "nami_solo_incarnon",
  "obex",
  "obex_incarnon",
  "okina",
  "okina_incarnon",
  "okina_prime",
  "onos",
  "paris",
  "paris_incarnon",
  "paris_prime",
  "phenmor",
  "praedos",
  "prisma_angstrum",
  "prisma_gorgon",
  "prisma_obex",
  "prisma_skana",
  "rakta_ballistica",
  "ruvox",
  "sancti_magistar",
  "sibear",
  "sibear_incarnon",
  "sicarus",
  "sicarus_incarnon",
  "sicarus_prime",
  "skana",
  "skana_incarnon",
  "skana_prime",
  "soma",
  "soma_incarnon",
  "soma_prime",
  "strun",
  "strun_incarnon",
  "strun_prime",
  "strun_wraith",
  "stug",
  "stug_incarnon",
  "sybaris",
  "sybaris_incarnon",
  "sybaris_prime",
  "synoid_gammacor",
  "telos_boltor",
  "thalys",
  "torid",
  "torid_incarnon",
  "vasto",
  "vasto_incarnon",
  "vasto_prime",
  "vectis",
  "vectis_incarnon",
  "vectis_prime",
  "zylok",
  "zylok_incarnon",
  "zylok_prime",
]);

export const incarnonWeaponData: IncarnonWeaponData[] = [
  // Felarx (native) - wiki-verified evolutions
  {
    weaponId: "felarx",
    weaponName: "Felarx",
    challenge: "Kill 100 enemies",
    category: "native",
    forms: [
      { name: "Felarx", damage: 760.0, fireRate: 3.0, criticalChance: 0.2, criticalMultiplier: 2.0, statusChance: 0.055, triggerType: "Auto", magazine: 6, reloadTime: 3.7, multishot: 4, impact: 38, puncture: 68.4, slash: 83.6 },
      {
        // Wiki: Impact 200 + Radiation 400, Semi FR 1.5, 20%/3x/20%, mag 60
        name: "Felarx Incarnon",
        damage: 600,
        fireRate: 1.5,
        criticalChance: 0.2,
        criticalMultiplier: 3.0,
        statusChance: 0.2,
        triggerType: "Semi",
        magazine: 60,
        reloadTime: 3.7,
        multishot: 1,
        impact: 200,
        radiation: 400,
        specialMechanics: { evolutionMode: "Semi-auto energy projectiles with punch through", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation; Alt Fire transmutes.", statChanges: {} },
      { tier: 2, slot: 0, name: "Attuned Accuracy", description: "+40% Accuracy when Aiming.", statChanges: {} },
      { tier: 2, slot: 1, name: "Kinetic Baffle", description: "-50% Weapon Recoil.", statChanges: {} },
      { tier: 2, slot: 2, name: "Frictionless Flight", description: "+50% Projectile Speed.", statChanges: {} },
      { tier: 3, slot: 0, name: "Dual-Mode Chamber", description: "Reload toggles between +100% Projectile Speed and +4m Punch Through.", statChanges: {} },
      { tier: 3, slot: 1, name: "Evolved Autoloader", description: "+50% Magazine Reloaded/s when Holstered.", statChanges: {} },
      { tier: 3, slot: 2, name: "Mounting Momentum", description: "Reload increases Fire Rate by +10% per shell. Resets on reload.", statChanges: {} },
      { tier: 4, slot: 0, name: "Brutal Edge", description: "+10% Critical Chance, +10% Status Chance.", statChanges: { criticalChance: 0.1, statusChance: 0.1 } },
      { tier: 4, slot: 1, name: "Incarnon Catalyst", description: "Headshots build 50% more Incarnon Transmutation charge.", statChanges: {} },
      { tier: 4, slot: 2, name: "Wracking Wrath", description: "+20% Status Chance, -10% Critical Chance.", statChanges: { statusChance: 0.2, criticalChance: -0.1 } },
      { tier: 5, slot: 0, name: "Devastating Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Ruptured Plenitude", description: "On Punch Through 3 enemies: +70% Ammo Efficiency for 20s.", statChanges: {} },
      { tier: 5, slot: 2, name: "Agile Executor", description: "Gain 50% Ammo Efficiency while Aim Gliding and Sliding.", statChanges: {} },
    ],
  },
  // Innodem (native)
  {
    weaponId: "innodem",
    weaponName: "Innodem",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "native",
    forms: [
      { name: "Innodem", damage: 230.0, fireRate: 1.0, criticalChance: 0.24, criticalMultiplier: 2.2, statusChance: 0.18, triggerType: "Melee" },
      { name: "Innodem Incarnon", damage: 460.0, fireRate: 1.0, criticalChance: 0.34, criticalMultiplier: 2.8, statusChance: 0.28, triggerType: "Melee", specialMechanics: { evolutionMode: "Heavy attacks fire void energy wave", modeSwitch: "Heavy attack or Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Laetum (native)
  {
    weaponId: "laetum",
    weaponName: "Laetum",
    challenge: "Kill 100 enemies with headshots",
    category: "native",
    forms: [
      { name: "Laetum", damage: 160.0, fireRate: 2.5, criticalChance: 0.22, criticalMultiplier: 2.2, statusChance: 0.22, triggerType: "Semi", magazine: 12, reloadTime: 2.0, impact: 64, slash: 96 },
      {
        // Wiki: Auto Impact 100 + Radiation radial 300, FR 6.67, mag 216
        name: "Laetum Incarnon",
        damage: 100,
        fireRate: 6.67,
        criticalChance: 0.22,
        criticalMultiplier: 2.2,
        statusChance: 0.22,
        triggerType: "Auto",
        magazine: 216,
        reloadTime: 2.0,
        impact: 100,
        specialMechanics: { evolutionMode: "Full-auto explosive rounds", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Marksman's Hand", description: "-40% Weapon Recoil.", statChanges: {} },
      { tier: 2, slot: 1, name: "Rapid Wrath", description: "+20% Fire Rate.", statChanges: { fireRate: 0.2 } },
      { tier: 2, slot: 2, name: "Raptor's Chase", description: "+50% Aim Move Speed.", statChanges: {} },
      { tier: 3, slot: 0, name: "Lethal Rearmament", description: "On Headshot: +30% Reload Speed for 12s. Stacks up to 3x.", statChanges: {} },
      { tier: 3, slot: 1, name: "Awakened Readiness", description: "+30% Magazine Reloaded/s when Holstered.", statChanges: {} },
      { tier: 3, slot: 2, name: "Feather of Justice", description: "+60% Ammo Efficiency while Aim Gliding and Sliding.", statChanges: {} },
      { tier: 4, slot: 0, name: "Caput Mortuum", description: "+50% Headshot Damage.", statChanges: {} },
      { tier: 4, slot: 1, name: "Incarnon Efficiency", description: "Headshots build 50% more Incarnon Transmutation charge.", statChanges: {} },
      { tier: 4, slot: 2, name: "Elemental Excess", description: "+20% Status Chance.", statChanges: { statusChance: 0.2 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Reaper's Plenty", description: "On Headshot: +40% Ammo Efficiency for 8s.", statChanges: {} },
      { tier: 5, slot: 2, name: "Overwhelming Attrition", description: "On Hit that is neither Critical nor Status: +400% Damage for 10s. Stacks up to 3x.", statChanges: {} },
    ],
  },
  // Phenmor (native)
  {
    weaponId: "phenmor",
    weaponName: "Phenmor",
    challenge: "Kill 100 enemies",
    category: "native",
    forms: [
      { name: "Phenmor", damage: 140.0, fireRate: 3.0, criticalChance: 0.2, criticalMultiplier: 2.0, statusChance: 0.2, triggerType: "Semi", magazine: 30, reloadTime: 2.8, puncture: 42, slash: 98 },
      {
        // Wiki: Slash 80 + Radiation 60, FR 13.33, mag 408, Auto, 3m punch-through
        name: "Phenmor Incarnon",
        damage: 140,
        fireRate: 13.33,
        criticalChance: 0.2,
        criticalMultiplier: 2.0,
        statusChance: 0.2,
        triggerType: "Auto",
        magazine: 408,
        reloadTime: 2.8,
        slash: 80,
        radiation: 60,
        specialMechanics: { evolutionMode: "Full-auto Slash/Radiation with punch-through", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Praedos (native)
  {
    weaponId: "praedos",
    weaponName: "Praedos",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "native",
    forms: [
      { name: "Praedos", damage: 260.0, fireRate: 1.0, criticalChance: 0.26, criticalMultiplier: 2.2, statusChance: 0.18, triggerType: "Melee" },
      { name: "Praedos Incarnon", damage: 520.0, fireRate: 1.0, criticalChance: 0.36, criticalMultiplier: 2.8, statusChance: 0.28, triggerType: "Melee", specialMechanics: { evolutionMode: "Extended combos with void explosions", modeSwitch: "Heavy or Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Onos (native)
  {
    weaponId: "onos",
    weaponName: "Onos",
    challenge: "Kill 100 enemies",
    category: "native",
    forms: [
      { name: "Onos", damage: 220.0, fireRate: 1.4, criticalChance: 0.26, criticalMultiplier: 2.4, statusChance: 0.22, triggerType: "Auto", magazine: 20, reloadTime: 2.0, puncture: 220 },
      {
        // Wiki Held beam default; full-charge Heat 2200 via resolveIncarnonActiveWeapon onosIncarnonMode
        name: "Onos Incarnon",
        damage: 30,
        fireRate: 2,
        criticalChance: 0.14,
        criticalMultiplier: 1.6,
        statusChance: 0.18,
        triggerType: "Held",
        magazine: 350,
        reloadTime: 2.0,
        radiation: 30,
        specialMechanics: { evolutionMode: "Charging arm-cannon Radiation beam; full charge Heat blast", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Ruvox (native)
  {
    weaponId: "ruvox",
    weaponName: "Ruvox",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "native",
    forms: [
      { name: "Ruvox", damage: 280.0, fireRate: 1.0, criticalChance: 0.28, criticalMultiplier: 2.2, statusChance: 0.16, triggerType: "Melee" },
      { name: "Ruvox Incarnon", damage: 560.0, fireRate: 1.0, criticalChance: 0.38, criticalMultiplier: 2.8, statusChance: 0.26, triggerType: "Melee", specialMechanics: { evolutionMode: "Heavy attacks create void vortex", modeSwitch: "Heavy or Slide kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Thalys (native melee) — form is buff-driven (+3 Range / +40% AS via wiki evolutions); forms[] unused for arsenal swap
  {
    weaponId: "thalys",
    weaponName: "Thalys",
    challenge: "Kill 100 enemies",
    category: "native",
    forms: [
      { name: "Thalys", damage: 300, fireRate: 0.917, criticalChance: 0.3, criticalMultiplier: 2.2, statusChance: 0.24, triggerType: "Melee" },
      { name: "Thalys Incarnon", damage: 300, fireRate: 0.917, criticalChance: 0.3, criticalMultiplier: 2.2, statusChance: 0.24, triggerType: "Melee", specialMechanics: { evolutionMode: "Void shards; +3 Range +40% AS", modeSwitch: "6x Combo + Heavy Attack" } },
    ],
    evolutions: [],
  },
  // Boar Incarnon (genesis_primary)
  {
    weaponId: "boar_incarnon",
    weaponName: "Boar Incarnon",
    challenge: "Kill 100 enemies with Slam Attacks",
    category: "genesis_primary",
    variants: ["boar", "boar_prime"],
    forms: [
      { name: "Boar", damage: 360.0, fireRate: 5.0, criticalChance: 0.15, criticalMultiplier: 2.0, statusChance: 0.3, triggerType: "Auto", magazine: 20, reloadTime: 2.7 },
      {
        // Wiki: Heat 20 Held beam, FR 7.5, 18%/1.8x/20%, mag 150, MS 1 (drops shotgun pellets)
        name: "Boar Incarnon",
        damage: 20,
        fireRate: 7.5,
        criticalChance: 0.18,
        criticalMultiplier: 1.8,
        statusChance: 0.2,
        triggerType: "Held",
        magazine: 150,
        reloadTime: 2.7,
        multishot: 1,
        heat: 20,
        specialMechanics: { evolutionMode: "Held Heat beam", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Boltor Incarnon (genesis_primary)
  {
    weaponId: "boltor_incarnon",
    weaponName: "Boltor Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_primary",
    variants: ["boltor", "boltor_prime", "telos_boltor"],
    forms: [
      { name: "Boltor", damage: 60.0, fireRate: 8.75, criticalChance: 0.1, criticalMultiplier: 1.8, statusChance: 0.14, triggerType: "Auto", magazine: 60, reloadTime: 2.6 },
      {
        // Wiki: 4 IPS × 3 multishot, FR 10, 22%/2.8x/9.33%, mag 160
        name: "Boltor Incarnon",
        damage: 4,
        fireRate: 10,
        criticalChance: 0.22,
        criticalMultiplier: 2.8,
        statusChance: 0.0933,
        triggerType: "Auto",
        magazine: 160,
        reloadTime: 2.6,
        multishot: 3,
        impact: 0.4,
        puncture: 1.2,
        slash: 2.4,
        specialMechanics: { evolutionMode: "Slash-biased bolts with base Multishot 3", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Braton Incarnon (genesis_primary)
  {
    weaponId: "braton_incarnon",
    weaponName: "Braton Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_primary",
    variants: ["braton", "braton_prime", "braton_vandal", "mk1_braton"],
    forms: [
      { name: "Braton", damage: 24.0, fireRate: 8.75, criticalChance: 0.12, criticalMultiplier: 1.6, statusChance: 0.06, triggerType: "Auto", magazine: 45, reloadTime: 2.0, impact: 7.92, puncture: 7.92, slash: 8.16 },
      {
        // Wiki base Braton form: IPS 50, FR 5, 30%/3x/12%, mag 200 + Heat AoE 50
        name: "Braton Incarnon",
        damage: 50,
        fireRate: 5,
        criticalChance: 0.3,
        criticalMultiplier: 3.0,
        statusChance: 0.12,
        triggerType: "Auto",
        magazine: 200,
        reloadTime: 2.0,
        impact: 20,
        puncture: 2,
        slash: 28,
        specialMechanics: { evolutionMode: "Hitscan with radial Heat", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Burston Incarnon (genesis_primary)
  {
    weaponId: "burston_incarnon",
    weaponName: "Burston Incarnon",
    challenge: "Land 10 headshots in a single mission",
    category: "genesis_primary",
    variants: ["burston", "burston_prime"],
    forms: [
      { name: "Burston", damage: 30.0, fireRate: 5.0, criticalChance: 0.06, criticalMultiplier: 1.6, statusChance: 0.18, triggerType: "Burst", magazine: 45, reloadTime: 2.0, impact: 10, puncture: 10, slash: 10 },
      {
        // Wiki base Burston: pure Heat 3, Auto FR 20, 30%/3x/30%, mag 600 (+ Heat radial; Prime uses 13 via radial sync)
        name: "Burston Incarnon",
        damage: 3,
        fireRate: 20,
        criticalChance: 0.3,
        criticalMultiplier: 3.0,
        statusChance: 0.3,
        triggerType: "Auto",
        magazine: 600,
        reloadTime: 2.0,
        damageType: "heat",
        heat: 3,
        specialMechanics: { evolutionMode: "Full-auto Heat with radial explosion", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Dera Incarnon (genesis_primary)
  {
    weaponId: "dera_incarnon",
    weaponName: "Dera Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_primary",
    variants: ["dera", "dera_vandal"],
    forms: [
      { name: "Dera", damage: 30.0, fireRate: 11.25, criticalChance: 0.08, criticalMultiplier: 2.0, statusChance: 0.16, triggerType: "Burst", magazine: 45, reloadTime: 1.8 },
      {
        // Wiki: IPS+Magnetic 330, FR 2, 22%/3x/18%, mag 50
        name: "Dera Incarnon",
        damage: 330,
        fireRate: 2,
        criticalChance: 0.22,
        criticalMultiplier: 3.0,
        statusChance: 0.18,
        triggerType: "Semi",
        magazine: 50,
        reloadTime: 1.8,
        impact: 40,
        puncture: 130,
        slash: 80,
        magnetic: 80,
        specialMechanics: { evolutionMode: "Heavy Magnetic bolts", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Dread Incarnon (genesis_primary)
  {
    weaponId: "dread_incarnon",
    weaponName: "Dread Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_primary",
    variants: ["dread"],
    forms: [
      { name: "Dread", damage: 200.0, fireRate: 1.0, criticalChance: 0.5, criticalMultiplier: 2.0, statusChance: 0.2, triggerType: "Charge", magazine: 1, reloadTime: 0.9 },
      {
        // Wiki charged: Impact 100 + Slash 100 + Heat 200, FR 1.5, 50%/3x/30%, mag 20
        name: "Dread Incarnon",
        damage: 400,
        fireRate: 1.5,
        criticalChance: 0.5,
        criticalMultiplier: 3.0,
        statusChance: 0.3,
        triggerType: "Charge",
        magazine: 20,
        reloadTime: 0.9,
        impact: 100,
        slash: 100,
        heat: 200,
        specialMechanics: { evolutionMode: "Larger Heat-charged arrows", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Gorgon Incarnon (genesis_primary)
  {
    weaponId: "gorgon_incarnon",
    weaponName: "Gorgon Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_primary",
    variants: ["gorgon", "gorgon_wraith", "prisma_gorgon"],
    forms: [
      { name: "Gorgon", damage: 25.0, fireRate: 12.5, criticalChance: 0.17, criticalMultiplier: 1.5, statusChance: 0.09, triggerType: "Auto", magazine: 90, reloadTime: 4.2, impact: 18.75, puncture: 3.75, slash: 2.5 },
      {
        // Wiki: IPS 100, Auto Charge FR 0.833, 21%/1.9x/19%, mag 20 + Heat AoE 750
        name: "Gorgon Incarnon",
        damage: 100,
        fireRate: 0.833,
        criticalChance: 0.21,
        criticalMultiplier: 1.9,
        statusChance: 0.19,
        triggerType: "Auto",
        magazine: 20,
        reloadTime: 4.2,
        impact: 20,
        puncture: 60,
        slash: 20,
        specialMechanics: { evolutionMode: "Embedding projectiles with delayed Heat explosion", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Latron Incarnon (genesis_primary)
  {
    weaponId: "latron_incarnon",
    weaponName: "Latron Incarnon",
    challenge: "Land 10 headshots in a single mission",
    category: "genesis_primary",
    variants: ["latron", "latron_prime", "latron_wraith"],
    forms: [
      { name: "Latron", damage: 55.0, fireRate: 4.17, criticalChance: 0.12, criticalMultiplier: 2.0, statusChance: 0.12, triggerType: "Semi", magazine: 15, reloadTime: 2.4, impact: 8.25, puncture: 38.5, slash: 8.25 },
      {
        // Wiki base Latron form: Impact 50 projectile, FR 3.33, 32%/3x/24%, mag 40 (+ AoE Puncture/Heat)
        name: "Latron Incarnon",
        damage: 50,
        fireRate: 3.33,
        criticalChance: 0.32,
        criticalMultiplier: 3.0,
        statusChance: 0.24,
        triggerType: "Semi",
        magazine: 40,
        reloadTime: 2.4,
        impact: 50,
        specialMechanics: { evolutionMode: "Ricocheting projectile with radial explosion", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Paris Incarnon (genesis_primary)
  {
    weaponId: "paris_incarnon",
    weaponName: "Paris Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_primary",
    variants: ["paris", "paris_prime", "mk1_paris"],
    forms: [
      { name: "Paris", damage: 180.0, fireRate: 1.0, criticalChance: 0.35, criticalMultiplier: 2.0, statusChance: 0.1, triggerType: "Charge", magazine: 1, reloadTime: 1.0 },
      {
        // Wiki charged: Impact 95 + Heat 365, FR 1, 40%/3x/20%, mag 20
        name: "Paris Incarnon",
        damage: 460,
        fireRate: 1,
        criticalChance: 0.4,
        criticalMultiplier: 3.0,
        statusChance: 0.2,
        triggerType: "Charge",
        magazine: 20,
        reloadTime: 1.0,
        impact: 95,
        heat: 365,
        specialMechanics: { evolutionMode: "Heat-charged arrows", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Soma Incarnon (genesis_primary)
  {
    weaponId: "soma_incarnon",
    weaponName: "Soma Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_primary",
    variants: ["soma", "soma_prime"],
    forms: [
      { name: "Soma", damage: 12.0, fireRate: 15.0, criticalChance: 0.3, criticalMultiplier: 3.0, statusChance: 0.07, triggerType: "Auto", magazine: 100, reloadTime: 3.0, impact: 1.2, puncture: 4.8, slash: 6 },
      {
        // Wiki: 8-pellet shotgun, 8 dmg/pellet (0.48/2.24/5.28), FR 7, 10%/3x/2.5% per pellet, mag 200
        name: "Soma Incarnon",
        damage: 8,
        fireRate: 7,
        criticalChance: 0.1,
        criticalMultiplier: 3.0,
        statusChance: 0.025,
        triggerType: "Auto",
        magazine: 200,
        reloadTime: 3.0,
        multishot: 8,
        impact: 0.48,
        puncture: 2.24,
        slash: 5.28,
        specialMechanics: { evolutionMode: "Full-auto shotgun with 8 base Multishot", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Strun Incarnon (genesis_primary)
  {
    weaponId: "strun_incarnon",
    weaponName: "Strun Incarnon",
    challenge: "Kill 100 enemies with Slam Attacks",
    category: "genesis_primary",
    variants: ["strun", "strun_prime", "strun_wraith", "mk1_strun"],
    forms: [
      { name: "Strun", damage: 300.0, fireRate: 2.5, criticalChance: 0.075, criticalMultiplier: 1.5, statusChance: 0.05, triggerType: "Semi", magazine: 6, reloadTime: 3.75, multishot: 12, impact: 13.75, puncture: 3.75, slash: 7.5 },
      {
        // Wiki: Impact 100 projectile, FR 2, 44%/2.8x/40%, mag 40 + Blast/Slash/Puncture AoE
        name: "Strun Incarnon",
        damage: 100,
        fireRate: 2,
        criticalChance: 0.44,
        criticalMultiplier: 2.8,
        statusChance: 0.4,
        triggerType: "Semi",
        magazine: 40,
        reloadTime: 3.75,
        multishot: 1,
        impact: 100,
        specialMechanics: { evolutionMode: "Explosive projectile (loses shotgun multishot)", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Sybaris Incarnon (genesis_primary)
  {
    weaponId: "sybaris_incarnon",
    weaponName: "Sybaris Incarnon",
    challenge: "Land 10 headshots in a single mission",
    category: "genesis_primary",
    variants: ["sybaris", "sybaris_prime", "dex_sybaris"],
    forms: [
      { name: "Sybaris", damage: 75.0, fireRate: 3.33, criticalChance: 0.3, criticalMultiplier: 2.0, statusChance: 0.25, triggerType: "Burst", magazine: 20, reloadTime: 2.0 },
      {
        // Wiki: IPS 90, 4-round Burst FR 3.33, 20%/3x/20%, mag 200, forced Blast
        name: "Sybaris Incarnon",
        damage: 90,
        fireRate: 3.33,
        criticalChance: 0.2,
        criticalMultiplier: 3.0,
        statusChance: 0.2,
        triggerType: "Burst",
        magazine: 200,
        reloadTime: 2.0,
        impact: 29.7,
        puncture: 29.7,
        slash: 30.6,
        specialMechanics: { evolutionMode: "4-round burst with forced Blast", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Miter Incarnon (genesis_primary)
  {
    weaponId: "miter_incarnon",
    weaponName: "Miter Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_primary",
    variants: ["miter"],
    forms: [
      { name: "Miter", damage: 100.0, fireRate: 2.5, criticalChance: 0.05, criticalMultiplier: 2.0, statusChance: 0.2, triggerType: "Charge", magazine: 20, reloadTime: 2.0, impact: 20, puncture: 10, slash: 70 },
      {
        // Wiki: IPS 60 Auto FR 3.33, 20%/3.3x/56%, mag 20 + Heat radial 80
        name: "Miter Incarnon",
        damage: 60,
        fireRate: 3.33,
        criticalChance: 0.2,
        criticalMultiplier: 3.3,
        statusChance: 0.56,
        triggerType: "Auto",
        magazine: 20,
        reloadTime: 2.0,
        impact: 12,
        puncture: 6,
        slash: 42,
        specialMechanics: { evolutionMode: "Homing bouncing Heat explosives", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Torid Incarnon (genesis_primary)
  {
    weaponId: "torid_incarnon",
    weaponName: "Torid Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_primary",
    variants: ["torid"],
    forms: [
      {
        name: "Torid",
        damage: 140,
        fireRate: 1.5,
        criticalChance: 0.15,
        criticalMultiplier: 2.0,
        statusChance: 0.23,
        triggerType: "Semi",
        magazine: 5,
        reloadTime: 1.7,
        damageType: "toxin",
        toxin: 140,
      },
      {
        // Wiki Incarnon Form: long-range toxin beam (Held), 51 toxin, 8 FR, 29% / 3.1x / 39%, 170 charge
        name: "Torid Incarnon",
        damage: 51,
        fireRate: 8,
        criticalChance: 0.29,
        criticalMultiplier: 3.1,
        statusChance: 0.39,
        triggerType: "Held",
        magazine: 170,
        reloadTime: 1.7,
        damageType: "toxin",
        toxin: 51,
        specialMechanics: {
          evolutionMode: "Long-range Toxin beam; chain to nearby enemies",
          modeSwitch: "Direct shots charge Incarnon; Alt-fire transmutes",
        },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Vasto Incarnon (genesis_secondary)
  {
    weaponId: "vasto_incarnon",
    weaponName: "Vasto Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_secondary",
    variants: ["vasto", "vasto_prime"],
    forms: [
      { name: "Vasto", damage: 65.0, fireRate: 4.17, criticalChance: 0.2, criticalMultiplier: 1.8, statusChance: 0.08, triggerType: "Semi", magazine: 6, reloadTime: 1.5 },
      {
        // Wiki: 30 IPS × 6 Burst, FR 2.5, 30%/2.8x/2.67%, mag 24
        name: "Vasto Incarnon",
        damage: 30,
        fireRate: 2.5,
        criticalChance: 0.3,
        criticalMultiplier: 2.8,
        statusChance: 0.0267,
        triggerType: "Burst",
        magazine: 24,
        reloadTime: 1.5,
        multishot: 6,
        impact: 7.5,
        puncture: 7.5,
        slash: 15,
        specialMechanics: { evolutionMode: "6-round Burst with base Multishot 6", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Lex Incarnon (genesis_secondary)
  {
    weaponId: "lex_incarnon",
    weaponName: "Lex Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_secondary",
    variants: ["lex", "lex_prime"],
    forms: [
      { name: "Lex", damage: 130.0, fireRate: 1.08, criticalChance: 0.2, criticalMultiplier: 2.0, statusChance: 0.1, triggerType: "Semi", magazine: 6, reloadTime: 2.35, impact: 13, puncture: 104, slash: 13 },
      {
        // Wiki base Lex: Radiation 700 + Impact 300, FR 0.67, 30%/3x/22%, mag 20
        name: "Lex Incarnon",
        damage: 1000,
        fireRate: 0.67,
        criticalChance: 0.3,
        criticalMultiplier: 3.0,
        statusChance: 0.22,
        triggerType: "Semi",
        magazine: 20,
        reloadTime: 2.35,
        impact: 300,
        radiation: 700,
        specialMechanics: { evolutionMode: "Wide Radiation projectile with punch-through", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Lato Incarnon (genesis_secondary)
  {
    weaponId: "lato_incarnon",
    weaponName: "Lato Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_secondary",
    variants: ["lato", "lato_prime", "lato_vandal"],
    forms: [
      { name: "Lato", damage: 30.0, fireRate: 6.67, criticalChance: 0.1, criticalMultiplier: 1.8, statusChance: 0.08, triggerType: "Semi", magazine: 15, reloadTime: 1.4 },
      {
        // Wiki: 64 IPS × Multishot 2, FR 3.5, 16%/2.6x/6%, mag 24
        name: "Lato Incarnon",
        damage: 64,
        fireRate: 3.5,
        criticalChance: 0.16,
        criticalMultiplier: 2.6,
        statusChance: 0.06,
        triggerType: "Semi",
        magazine: 24,
        reloadTime: 1.4,
        multishot: 2,
        impact: 16,
        puncture: 16,
        slash: 32,
        specialMechanics: { evolutionMode: "Ricocheting Multishot rounds", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Angstrum Incarnon (genesis_secondary)
  {
    weaponId: "angstrum_incarnon",
    weaponName: "Angstrum Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_secondary",
    variants: ["angstrum", "prisma_angstrum"],
    forms: [
      { name: "Angstrum", damage: 450.0, fireRate: 2.0, criticalChance: 0.16, criticalMultiplier: 2.0, statusChance: 0.22, triggerType: "Charge", magazine: 3, reloadTime: 2.5 },
      {
        // Wiki: Heat 30 Auto seeking fireballs, FR 6, 18%/1.8x/18%, mag 120
        name: "Angstrum Incarnon",
        damage: 30,
        fireRate: 6,
        criticalChance: 0.18,
        criticalMultiplier: 1.8,
        statusChance: 0.18,
        triggerType: "Auto",
        magazine: 120,
        reloadTime: 2.5,
        heat: 30,
        specialMechanics: { evolutionMode: "Seeking Heat fireballs with ricochet", modeSwitch: "Direct hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Atomos Incarnon (genesis_secondary)
  {
    weaponId: "atomos_incarnon",
    weaponName: "Atomos Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_secondary",
    variants: ["atomos"],
    forms: [
      { name: "Atomos", damage: 29.0, fireRate: 8.0, criticalChance: 0.15, criticalMultiplier: 1.7, statusChance: 0.21, triggerType: "Held", magazine: 70, reloadTime: 2.0, heat: 29 },
      {
        // Wiki: Impact 100 direct + Blast 450 radial, Semi FR 1.5, 18%/3x/41%, mag 21
        name: "Atomos Incarnon",
        damage: 100,
        fireRate: 1.5,
        criticalChance: 0.18,
        criticalMultiplier: 3.0,
        statusChance: 0.41,
        triggerType: "Semi",
        magazine: 21,
        reloadTime: 2.0,
        impact: 100,
        specialMechanics: { evolutionMode: "Semi-auto grenades with Blast radial", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Bronco Incarnon (genesis_secondary)
  {
    weaponId: "bronco_incarnon",
    weaponName: "Bronco Incarnon",
    challenge: "Kill 100 enemies with Slam Attacks",
    category: "genesis_secondary",
    variants: ["bronco", "bronco_prime"],
    forms: [
      { name: "Bronco", damage: 280.0, fireRate: 5.0, criticalChance: 0.06, criticalMultiplier: 2.0, statusChance: 0.22, triggerType: "Semi", magazine: 4, reloadTime: 1.05 },
      {
        // Wiki: 22 IPS × Multishot 7, FR 2.5, 20%/3x/18.86%, mag 20
        name: "Bronco Incarnon",
        damage: 22,
        fireRate: 2.5,
        criticalChance: 0.2,
        criticalMultiplier: 3.0,
        statusChance: 0.1886,
        triggerType: "Semi",
        magazine: 20,
        reloadTime: 1.05,
        multishot: 7,
        impact: 13.2,
        puncture: 2.2,
        slash: 6.6,
        specialMechanics: { evolutionMode: "Ricocheting shotgun pellets", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Cestra Incarnon (genesis_secondary)
  {
    weaponId: "cestra_incarnon",
    weaponName: "Cestra Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_secondary",
    variants: ["cestra"],
    forms: [
      { name: "Cestra", damage: 26.0, fireRate: 8.33, criticalChance: 0.06, criticalMultiplier: 1.6, statusChance: 0.2, triggerType: "Auto", magazine: 60, reloadTime: 2.0 },
      {
        // Wiki: Impact 10 + Puncture 40, FR 6.67, 50%/3x/18%, mag 150
        name: "Cestra Incarnon",
        damage: 50,
        fireRate: 6.67,
        criticalChance: 0.5,
        criticalMultiplier: 3.0,
        statusChance: 0.18,
        triggerType: "Auto",
        magazine: 150,
        reloadTime: 2.0,
        impact: 10,
        puncture: 40,
        specialMechanics: { evolutionMode: "High-crit Auto bolts", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Despair Incarnon (genesis_secondary)
  {
    weaponId: "despair_incarnon",
    weaponName: "Despair Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_secondary",
    variants: ["despair"],
    forms: [
      { name: "Despair", damage: 58.0, fireRate: 3.33, criticalChance: 0.16, criticalMultiplier: 1.6, statusChance: 0.16, triggerType: "Auto", magazine: 10, reloadTime: 0.75, impact: 2.9, puncture: 46.4, slash: 8.7 },
      {
        // Wiki: IPS 60, FR 3, 30%/3x/20%, mag 20 + Heat radial 160
        name: "Despair Incarnon",
        damage: 60,
        fireRate: 3,
        criticalChance: 0.3,
        criticalMultiplier: 3.0,
        statusChance: 0.2,
        triggerType: "Auto",
        magazine: 20,
        reloadTime: 0.75,
        impact: 3,
        puncture: 48,
        slash: 9,
        specialMechanics: { evolutionMode: "Embedding projectiles with Heat explosion", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Dual Toxocyst Incarnon (genesis_secondary)
  {
    weaponId: "dual_toxocyst_incarnon",
    weaponName: "Dual Toxocyst Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_secondary",
    variants: ["dual_toxocyst"],
    forms: [
      { name: "Dual Toxocyst", damage: 70.0, fireRate: 1.0, criticalChance: 0.05, criticalMultiplier: 2.0, statusChance: 0.37, triggerType: "Semi", magazine: 12, reloadTime: 2.35 },
      {
        // Wiki: IPS 75 Auto, FR 4.5, 11%/3x/43%, mag 270
        name: "Dual Toxocyst Incarnon",
        damage: 75,
        fireRate: 4.5,
        criticalChance: 0.11,
        criticalMultiplier: 3.0,
        statusChance: 0.43,
        triggerType: "Auto",
        magazine: 270,
        reloadTime: 2.35,
        impact: 15,
        puncture: 37.5,
        slash: 22.5,
        specialMechanics: { evolutionMode: "Auto fire with ricochet", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Furis Incarnon (genesis_secondary)
  {
    weaponId: "furis_incarnon",
    weaponName: "Furis Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_secondary",
    variants: ["furis", "mk1_furis"],
    forms: [
      { name: "Furis", damage: 18.0, fireRate: 10.0, criticalChance: 0.05, criticalMultiplier: 1.8, statusChance: 0.12, triggerType: "Auto", magazine: 35, reloadTime: 1.4 },
      {
        // Wiki: Heat 100 Held beam, FR 12, 26%/3.4x/24%, mag 280
        name: "Furis Incarnon",
        damage: 100,
        fireRate: 12,
        criticalChance: 0.26,
        criticalMultiplier: 3.4,
        statusChance: 0.24,
        triggerType: "Held",
        magazine: 280,
        reloadTime: 1.4,
        heat: 100,
        specialMechanics: { evolutionMode: "Wide Heat beam", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Gammacor Incarnon (genesis_secondary)
  {
    weaponId: "gammacor_incarnon",
    weaponName: "Gammacor Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_secondary",
    variants: ["gammacor", "synoid_gammacor"],
    forms: [
      { name: "Gammacor", damage: 16.0, fireRate: 12.0, criticalChance: 0.08, criticalMultiplier: 1.8, statusChance: 0.2, triggerType: "Held", magazine: 60, reloadTime: 1.4, magnetic: 16 },
      {
        // Wiki: Impact 80 Semi FR 1, 14%/1.8x/22%, mag 15 + Cold radial 660
        name: "Gammacor Incarnon",
        damage: 80,
        fireRate: 1,
        criticalChance: 0.14,
        criticalMultiplier: 1.8,
        statusChance: 0.22,
        triggerType: "Semi",
        magazine: 15,
        reloadTime: 1.4,
        impact: 80,
        specialMechanics: { evolutionMode: "Pulling projectiles with Cold explosion", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Kunai Incarnon (genesis_secondary)
  {
    weaponId: "kunai_incarnon",
    weaponName: "Kunai Incarnon",
    challenge: "Kill 100 enemies",
    category: "genesis_secondary",
    variants: ["kunai", "mk1_kunai"],
    forms: [
      { name: "Kunai", damage: 46.0, fireRate: 3.33, criticalChance: 0.08, criticalMultiplier: 1.6, statusChance: 0.08, triggerType: "Auto", magazine: 10, reloadTime: 0.8 },
      {
        // Wiki: IPS 40 × Multishot 2, FR 3.33, 18%/2x/16%, mag 20
        name: "Kunai Incarnon",
        damage: 40,
        fireRate: 3.33,
        criticalChance: 0.18,
        criticalMultiplier: 2.0,
        statusChance: 0.16,
        triggerType: "Auto",
        magazine: 20,
        reloadTime: 0.8,
        multishot: 2,
        impact: 8,
        puncture: 14,
        slash: 18,
        specialMechanics: { evolutionMode: "Seeking Multishot kunai", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Sicarus Incarnon (genesis_secondary)
  {
    weaponId: "sicarus_incarnon",
    weaponName: "Sicarus Incarnon",
    challenge: "Land 10 headshots in a single mission",
    category: "genesis_secondary",
    variants: ["sicarus", "sicarus_prime"],
    forms: [
      { name: "Sicarus", damage: 42.0, fireRate: 7.5, criticalChance: 0.16, criticalMultiplier: 2.0, statusChance: 0.1, triggerType: "Burst", magazine: 15, reloadTime: 2.0 },
      {
        // Wiki: IPS 40, Burst FR 3.5, 20%/3x/20%, mag 120
        name: "Sicarus Incarnon",
        damage: 40,
        fireRate: 3.5,
        criticalChance: 0.2,
        criticalMultiplier: 3.0,
        statusChance: 0.2,
        triggerType: "Burst",
        magazine: 120,
        reloadTime: 2.0,
        impact: 28,
        puncture: 6,
        slash: 6,
        specialMechanics: { evolutionMode: "Sustained Burst with Punch Through", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Zylok Incarnon (genesis_secondary)
  {
    weaponId: "zylok_incarnon",
    weaponName: "Zylok Incarnon",
    challenge: "Kill 100 enemies with headshots",
    category: "genesis_secondary",
    variants: ["zylok", "zylok_prime"],
    forms: [
      { name: "Zylok", damage: 140.0, fireRate: 1.8, criticalChance: 0.08, criticalMultiplier: 2.0, statusChance: 0.26, triggerType: "Duplex", magazine: 8, reloadTime: 1.2, impact: 44.8, puncture: 16.8, slash: 78.4 },
      {
        // Wiki: Charge Impact 160 + Puncture 240, FR 1, 20%/2x/40%, mag 12 + Heat radial 600
        name: "Zylok Incarnon",
        damage: 400,
        fireRate: 1,
        criticalChance: 0.2,
        criticalMultiplier: 2.0,
        statusChance: 0.4,
        triggerType: "Charge",
        magazine: 12,
        reloadTime: 1.2,
        impact: 160,
        puncture: 240,
        specialMechanics: { evolutionMode: "Charged shot with radial Heat", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Ready Retaliation", description: "+100% Damage when wielding Melee weapon.", statChanges: {} },
      { tier: 2, slot: 1, name: "Lone Gun", description: "+60% Damage when no Primary equipped.", statChanges: {} },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Long Shot", description: "+100% Damage Falloff Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Status Surge", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Bo Incarnon (genesis_melee)
  {
    weaponId: "bo_incarnon",
    weaponName: "Bo Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks (Heavy Attacks count as 2)",
    category: "genesis_melee",
    variants: ["bo", "bo_prime", "mk1_bo"],
    forms: [
      { name: "Bo", damage: 200.0, fireRate: 1.0, criticalChance: 0.25, criticalMultiplier: 2.0, statusChance: 0.2, triggerType: "Melee" },
      { name: "Bo Incarnon", damage: 400.0, fireRate: 0.8, criticalChance: 0.35, criticalMultiplier: 2.5, statusChance: 0.3, triggerType: "Melee", specialMechanics: { evolutionMode: "Heavy slam creates shockwave", evolutionBonus: "Heavy attacks fire energy wave" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Skana Incarnon (genesis_melee)
  {
    weaponId: "skana_incarnon",
    weaponName: "Skana Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "genesis_melee",
    variants: ["skana", "skana_prime", "prisma_skana"],
    forms: [
      { name: "Skana", damage: 120.0, fireRate: 1.0, criticalChance: 0.15, criticalMultiplier: 1.8, statusChance: 0.1, triggerType: "Melee" },
      { name: "Skana Incarnon", damage: 240.0, fireRate: 1.0, criticalChance: 0.25, criticalMultiplier: 2.3, statusChance: 0.22, triggerType: "Melee", specialMechanics: { evolutionMode: "Void blade extensions on heavy attack", modeSwitch: "Slide or Heavy attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Ack & Brunt Incarnon (genesis_melee)
  {
    weaponId: "ack_brunt_incarnon",
    weaponName: "Ack & Brunt Incarnon",
    challenge: "Block 1000 damage",
    category: "genesis_melee",
    variants: ["ack_&_brunt"],
    forms: [
      { name: "Ack & Brunt", damage: 230.0, fireRate: 0.833, criticalChance: 0.1, criticalMultiplier: 2.0, statusChance: 0.25, triggerType: "Melee" },
      { name: "Ack & Brunt Incarnon", damage: 460.0, fireRate: 0.833, criticalChance: 0.22, criticalMultiplier: 2.5, statusChance: 0.4, triggerType: "Melee", specialMechanics: { evolutionMode: "Shield throw with void explosion on return", modeSwitch: "Block damage builds evolution" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Anku Incarnon (genesis_melee)
  {
    weaponId: "anku_incarnon",
    weaponName: "Anku Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "genesis_melee",
    variants: ["anku"],
    forms: [
      { name: "Anku", damage: 195.0, fireRate: 1.08, criticalChance: 0.2, criticalMultiplier: 2.0, statusChance: 0.25, triggerType: "Melee" },
      { name: "Anku Incarnon", damage: 390.0, fireRate: 1.08, criticalChance: 0.32, criticalMultiplier: 2.5, statusChance: 0.4, triggerType: "Melee", specialMechanics: { evolutionMode: "Void scythe waves on heavy attack", modeSwitch: "Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Ceramic Dagger Incarnon (genesis_melee)
  {
    weaponId: "ceramic_dagger_incarnon",
    weaponName: "Ceramic Dagger Incarnon",
    challenge: "Kill 100 enemies with Finisher Attacks",
    category: "genesis_melee",
    variants: ["ceramic_dagger"],
    forms: [
      { name: "Ceramic Dagger", damage: 110.0, fireRate: 1.0, criticalChance: 0.05, criticalMultiplier: 1.5, statusChance: 0.1, triggerType: "Melee" },
      { name: "Ceramic Dagger Incarnon", damage: 220.0, fireRate: 1.0, criticalChance: 0.18, criticalMultiplier: 2.2, statusChance: 0.25, triggerType: "Melee", specialMechanics: { evolutionMode: "Finisher attacks create void implosion", modeSwitch: "Finisher kills build evolution" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Dual Ichor Incarnon (genesis_melee)
  {
    weaponId: "dual_ichor_incarnon",
    weaponName: "Dual Ichor Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "genesis_melee",
    variants: ["dual_ichor"],
    forms: [
      { name: "Dual Ichor", damage: 175.0, fireRate: 1.0, criticalChance: 0.15, criticalMultiplier: 3.0, statusChance: 0.15, triggerType: "Melee" },
      { name: "Dual Ichor Incarnon", damage: 350.0, fireRate: 1.0, criticalChance: 0.28, criticalMultiplier: 3.5, statusChance: 0.3, triggerType: "Melee", specialMechanics: { evolutionMode: "Toxic void slashes with spreading corrosion", modeSwitch: "Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Furax Incarnon (genesis_melee)
  {
    weaponId: "furax_incarnon",
    weaponName: "Furax Incarnon",
    challenge: "Kill 100 enemies with Ground Finishers",
    category: "genesis_melee",
    variants: ["furia", "mk1_furax", "furia_wraith"],
    forms: [
      { name: "Furax", damage: 130.0, fireRate: 1.0, criticalChance: 0.2, criticalMultiplier: 2.0, statusChance: 0.1, triggerType: "Melee" },
      { name: "Furax Incarnon", damage: 260.0, fireRate: 1.0, criticalChance: 0.32, criticalMultiplier: 2.5, statusChance: 0.22, triggerType: "Melee", specialMechanics: { evolutionMode: "Void-charged uppercut with knockback wave", modeSwitch: "Ground finisher kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Hate Incarnon (genesis_melee)
  {
    weaponId: "hate_incarnon",
    weaponName: "Hate Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "genesis_melee",
    variants: ["hate"],
    forms: [
      { name: "Hate", damage: 250.0, fireRate: 1.08, criticalChance: 0.3, criticalMultiplier: 2.5, statusChance: 0.2, triggerType: "Melee" },
      { name: "Hate Incarnon", damage: 500.0, fireRate: 1.08, criticalChance: 0.42, criticalMultiplier: 3.0, statusChance: 0.35, triggerType: "Melee", specialMechanics: { evolutionMode: "Void reaping arc on heavy attack", modeSwitch: "Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Magistar Incarnon (genesis_melee)
  {
    weaponId: "magistar_incarnon",
    weaponName: "Magistar Incarnon",
    challenge: "Kill 100 enemies with Heavy Attacks",
    category: "genesis_melee",
    variants: ["magistar", "sancti_magistar"],
    forms: [
      { name: "Magistar", damage: 240.0, fireRate: 0.833, criticalChance: 0.2, criticalMultiplier: 2.0, statusChance: 0.15, triggerType: "Melee" },
      { name: "Magistar Incarnon", damage: 480.0, fireRate: 0.833, criticalChance: 0.32, criticalMultiplier: 2.5, statusChance: 0.3, triggerType: "Melee", specialMechanics: { evolutionMode: "Void slam creates sanctifying ground", modeSwitch: "Heavy attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Nami Solo Incarnon (genesis_melee)
  {
    weaponId: "nami_solo_incarnon",
    weaponName: "Nami Solo Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "genesis_melee",
    variants: ["nami_solo"],
    forms: [
      { name: "Nami Solo", damage: 145.0, fireRate: 0.917, criticalChance: 0.1, criticalMultiplier: 1.5, statusChance: 0.2, triggerType: "Melee" },
      { name: "Nami Solo Incarnon", damage: 290.0, fireRate: 0.917, criticalChance: 0.22, criticalMultiplier: 2.2, statusChance: 0.35, triggerType: "Melee", specialMechanics: { evolutionMode: "Void cutlass combos with water slash waves", modeSwitch: "Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Okina Incarnon (genesis_melee)
  {
    weaponId: "okina_incarnon",
    weaponName: "Okina Incarnon",
    challenge: "Kill 100 enemies with Slide Attacks",
    category: "genesis_melee",
    variants: ["okina", "okina_prime"],
    forms: [
      { name: "Okina", damage: 160.0, fireRate: 1.17, criticalChance: 0.1, criticalMultiplier: 2.0, statusChance: 0.25, triggerType: "Melee" },
      { name: "Okina Incarnon", damage: 320.0, fireRate: 1.17, criticalChance: 0.22, criticalMultiplier: 2.5, statusChance: 0.4, triggerType: "Melee", specialMechanics: { evolutionMode: "Rapid void stabs with bleeding procs", modeSwitch: "Slide attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Sibear Incarnon (genesis_melee)
  {
    weaponId: "sibear_incarnon",
    weaponName: "Sibear Incarnon",
    challenge: "Kill 100 enemies with Heavy Attacks",
    category: "genesis_melee",
    variants: ["sibear"],
    forms: [
      { name: "Sibear", damage: 260.0, fireRate: 0.917, criticalChance: 0.15, criticalMultiplier: 2.0, statusChance: 0.1, triggerType: "Melee" },
      { name: "Sibear Incarnon", damage: 520.0, fireRate: 0.917, criticalChance: 0.28, criticalMultiplier: 2.5, statusChance: 0.25, triggerType: "Melee", specialMechanics: { evolutionMode: "Void frost slam creates ice field", modeSwitch: "Heavy attack kills" } },
    ],
    evolutions: [
      { tier: 1, slot: 0, name: "Incarnon Form", description: "Weakpoint hits charge Incarnon Transmutation. Alt-fire to transform.", statChanges: {} },
      { tier: 2, slot: 0, name: "Rupture Strike", description: "+50% Status Chance.", statChanges: { statusChance: 0.5 } },
      { tier: 2, slot: 1, name: "Critical Strike", description: "+20% Critical Chance.", statChanges: { criticalChance: 0.2 } },
      { tier: 3, slot: 0, name: "Elemental Excess", description: "+200% Elemental Damage.", statChanges: {} },
      { tier: 3, slot: 1, name: "Swift Transformation", description: "+50% Incarnon Buildup.", statChanges: {} },
      { tier: 4, slot: 0, name: "Extended Strike", description: "+1.5m Range.", statChanges: {} },
      { tier: 4, slot: 1, name: "Finishing Touch", description: "+150% Finisher Damage.", statChanges: {} },
      { tier: 5, slot: 0, name: "Devouring Attrition", description: "50% chance to deal +2000% Damage on non-critical hits.", statChanges: { devouringAttrition: 20 } },
      { tier: 5, slot: 1, name: "Elemental Flow", description: "Convert 100% of Physical Damage to Elemental.", statChanges: {} },
    ],
  },
  // Vectis Incarnon (genesis_primary) — Update 43
  {
    weaponId: "vectis_incarnon",
    weaponName: "Vectis Incarnon",
    challenge: "Land 10 headshots in a single mission",
    category: "genesis_primary",
    variants: ["vectis", "vectis_prime"],
    forms: [
      { name: "Vectis", damage: 225.0, fireRate: 1.5, criticalChance: 0.25, criticalMultiplier: 2.0, statusChance: 0.3, triggerType: "Sniper", magazine: 1, reloadTime: 1.0 },
      {
        // Wiki tooltip: Cold 5 projectile + form AoEs, FR 1.333, 30%/2.5x/30%, mag 45
        name: "Vectis Incarnon",
        damage: 5,
        fireRate: 1.333,
        criticalChance: 0.3,
        criticalMultiplier: 2.5,
        statusChance: 0.3,
        triggerType: "Semi",
        magazine: 45,
        reloadTime: 1.0,
        cold: 5,
        specialMechanics: { evolutionMode: "Embedding Cold projectiles; explode on headshot", modeSwitch: "Weakpoint hits charge; Alt-fire while unscoped" },
      },
    ],
    evolutions: getVectisIncarnonEvolutions(),
  },
  // Stug Incarnon (genesis_secondary) — Update 43
  {
    weaponId: "stug_incarnon",
    weaponName: "Stug Incarnon",
    challenge: "Kill 100 enemies with this weapon's Incarnon Form",
    category: "genesis_secondary",
    variants: ["stug"],
    forms: [
      { name: "Stug", damage: 79.0, fireRate: 4.0, criticalChance: 0.05, criticalMultiplier: 1.5, statusChance: 0.0, triggerType: "Charge", magazine: 20, reloadTime: 2.0 },
      {
        // Wiki: Corrosive 50 direct + form blob radials, FR 4, 15%/2x/20%, mag 120
        name: "Stug Incarnon",
        damage: 50,
        fireRate: 4,
        criticalChance: 0.15,
        criticalMultiplier: 2.0,
        statusChance: 0.2,
        triggerType: "Auto",
        magazine: 120,
        reloadTime: 2.0,
        corrosive: 50,
        specialMechanics: { evolutionMode: "Bouncing corrosive blobs", modeSwitch: "Direct hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: getStugIncarnonEvolutions(),
  },
  // Ballistica Incarnon (genesis_secondary) — Update 43
  {
    weaponId: "ballistica_incarnon",
    weaponName: "Ballistica Incarnon",
    challenge: "Land 10 headshots in a single mission",
    category: "genesis_secondary",
    variants: ["ballistica", "ballistica_prime", "rakta_ballistica"],
    forms: [
      { name: "Ballistica", damage: 100.0, fireRate: 3.33, criticalChance: 0.025, criticalMultiplier: 1.5, statusChance: 0.1, triggerType: "Burst", magazine: 16, reloadTime: 2.0 },
      {
        // Wiki: Slash 640 Charge, FR 3.33, 20%/2x/20%, mag 18
        // Wiki: single X-projectile (MS 1), Slash 640, Charge FR 3.33, 20%/2x/20%, mag 18
        name: "Ballistica Incarnon",
        damage: 640,
        fireRate: 3.33,
        criticalChance: 0.2,
        criticalMultiplier: 2.0,
        statusChance: 0.2,
        triggerType: "Charge",
        magazine: 18,
        reloadTime: 2.0,
        multishot: 1,
        slash: 640,
        specialMechanics: { evolutionMode: "Cross-shaped Slash projectiles", modeSwitch: "Weakpoint hits charge; Alt-fire transmutes" },
      },
    ],
    evolutions: getBallisticaIncarnonEvolutions(),
  },
  // Destreza Incarnon (genesis_melee) — Update 43
  {
    weaponId: "destreza_incarnon",
    weaponName: "Destreza Incarnon",
    challenge: "Kill 100 enemies with Heavy Attacks",
    category: "genesis_melee",
    variants: ["destreza", "destreza_prime"],
    forms: [
      { name: "Destreza", damage: 158.0, fireRate: 1.0, criticalChance: 0.28, criticalMultiplier: 2.0, statusChance: 0.14, triggerType: "Melee" },
      { name: "Destreza Incarnon", damage: 316.0, fireRate: 1.0, criticalChance: 0.38, criticalMultiplier: 2.5, statusChance: 0.28, triggerType: "Melee", specialMechanics: { evolutionMode: "Ghostly rapiers fly forth on Heavy Attacks; Heavy kills grant Puncture Damage", modeSwitch: "Build 6x combo then Heavy Attack; lasts 180s" } },
    ],
    evolutions: getDestrezaIncarnonEvolutions(),
  },
  // Obex Incarnon (genesis_melee) — Update 43
  {
    weaponId: "obex_incarnon",
    weaponName: "Obex Incarnon",
    challenge: "Kill 100 enemies with Finisher Attacks",
    category: "genesis_melee",
    variants: ["obex", "prisma_obex"],
    forms: [
      { name: "Obex", damage: 120.0, fireRate: 1.0, criticalChance: 0.25, criticalMultiplier: 2.0, statusChance: 0.1, triggerType: "Melee" },
      { name: "Obex Incarnon", damage: 240.0, fireRate: 1.0, criticalChance: 0.35, criticalMultiplier: 2.5, statusChance: 0.22, triggerType: "Melee", specialMechanics: { evolutionMode: "Large radial attack for each Finisher strike", modeSwitch: "Build 6x combo then Heavy Attack; lasts 180s" } },
    ],
    evolutions: getObexIncarnonEvolutions(),
  },
];

// Melee weapon IDs (for determining evolution pool)
const MELEE_INCARNON_IDS = new Set([
  "innodem", "praedos", "ruvox",
  "ack_brunt_incarnon", "ack_&_brunt",
  "anku_incarnon", "anku",
  "bo_incarnon", "bo", "bo_prime", "mk1_bo",
  "ceramic_dagger_incarnon", "ceramic_dagger",
  "destreza_incarnon", "destreza", "destreza_prime",
  "dual_ichor_incarnon", "dual_ichor",
  "furax_incarnon", "furia", "furia_wraith", "mk1_furax",
  "hate_incarnon", "hate",
  "magistar_incarnon", "magistar", "sancti_magistar",
  "nami_solo_incarnon", "nami_solo",
  "okina_incarnon", "okina", "okina_prime",
  "obex_incarnon", "obex", "prisma_obex",
  "sibear_incarnon", "sibear",
  "skana_incarnon", "skana", "skana_prime", "prisma_skana",
]);

// Quick lookup: weapon ID → incarnon data
// Genesis weapons use shared pools; native and Update 43 weapons keep weapon-specific perks.
export const incarnonDataMap = new Map<string, IncarnonWeaponData>();
for (const data of incarnonWeaponData) {
  const isMelee = MELEE_INCARNON_IDS.has(data.weaponId) ||
    data.forms.some((f) => f.triggerType === "Melee");
  const correctedData: IncarnonWeaponData = {
    ...data,
    evolutions: resolveIncarnonEvolutions(data, isMelee),
  };
  incarnonDataMap.set(correctedData.weaponId, correctedData);
  if (correctedData.variants) {
    for (const v of correctedData.variants) {
      incarnonDataMap.set(v, correctedData);
    }
  }
}
