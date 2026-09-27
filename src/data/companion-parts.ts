/**
 * MOA / Hound modular part catalogs.
 * Stats: wiki MOA (Companion), Hound (Companion), Core (Component) — post Companion Rework bases.
 * Ungilded % bonuses; gilding doubles core/gyro (MOA) and bracket (Hound) percentages.
 */

export type CompanionPartKind = "moa" | "hound";

export interface MoaModelPart {
  id: string;
  name: string;
  companionId: string;
  lotusPath?: string;
  preceptNames: [string, string];
}

export interface MoaCorePart {
  id: string;
  name: string;
  lotusPath?: string;
  /** Ungilded percent bonuses (gild doubles). */
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
}

export interface MoaGyroPart {
  id: string;
  name: string;
  lotusPath?: string;
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
}

export interface MoaBracketPart {
  id: string;
  name: string;
  lotusPath?: string;
  /** Extra polarity beyond the four Penjaga slots (slot index 0–3 are Penjaga). */
  extraPolarity?: string;
}

export interface HoundModelPart {
  id: string;
  name: string;
  companionId: string;
  weaponId: string;
  lotusPath?: string;
  preceptName: string;
}

export interface HoundCorePart {
  id: string;
  name: string;
  lotusPath?: string;
  health: number;
  shield: number;
  armor: number;
}

export interface HoundBracketPart {
  id: string;
  name: string;
  lotusPath?: string;
  /** Ungilded percent bonuses (gild doubles). */
  healthBonus: number;
  shieldBonus: number;
  armorBonus: number;
  preceptName: string;
}

export interface HoundStabilizerPart {
  id: string;
  name: string;
  lotusPath?: string;
  /** Extra polarity beyond four Penjaga slots. */
  extraPolarity: string;
  preceptName: string;
}

export const MOA_BASE_STATS = { health: 350, shield: 350, armor: 350 } as const;

export const moaModels: MoaModelPart[] = [
  {
    id: "moa_model_lambeo",
    name: "Lambeo",
    companionId: "lambeo",
    lotusPath: "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadLambeo",
    preceptNames: ["Shockwave Actuators", "Stasis Field"],
  },
  {
    id: "moa_model_olaro",
    name: "Oloro",
    companionId: "olaro",
    lotusPath: "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadOloro",
    preceptNames: ["Security Override", "Tractor Beam"],
  },
  {
    id: "moa_model_para",
    name: "Para",
    companionId: "para",
    lotusPath: "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadPara",
    preceptNames: ["Whiplash Mine", "Anti-Grav Grenade"],
  },
  {
    id: "moa_model_nychus",
    name: "Nychus",
    companionId: "nidus_moa",
    lotusPath: "/Lotus/Types/Friendly/Pets/MoaPets/MoaPetParts/MoaPetHeadMelee",
    preceptNames: ["Hard Engage", "Blast Shield"],
  },
];

export const moaCores: MoaCorePart[] = [
  { id: "moa_core_drex", name: "Drex", healthBonus: 5, shieldBonus: 7.5, armorBonus: 2.5 },
  { id: "moa_core_krisys", name: "Krisys", healthBonus: 5, shieldBonus: 2.5, armorBonus: 7.5 },
  { id: "moa_core_alcrom", name: "Alcrom", healthBonus: 5, shieldBonus: 5, armorBonus: 5 },
  { id: "moa_core_lehan", name: "Lehan", healthBonus: 7.5, shieldBonus: 0, armorBonus: 7.5 },
];

export const moaGyros: MoaGyroPart[] = [
  { id: "moa_gyro_trux", name: "Trux", healthBonus: 2.5, shieldBonus: -2.5, armorBonus: 5 },
  { id: "moa_gyro_harpen", name: "Harpen", healthBonus: 2.5, shieldBonus: 5, armorBonus: -2.5 },
  { id: "moa_gyro_aegron", name: "Aegron", healthBonus: -2.5, shieldBonus: 2.5, armorBonus: 5 },
  { id: "moa_gyro_hextra", name: "Hextra", healthBonus: 5, shieldBonus: 2.5, armorBonus: -2.5 },
  { id: "moa_gyro_munit", name: "Munit", healthBonus: 5, shieldBonus: -2.5, armorBonus: 2.5 },
  { id: "moa_gyro_atheca", name: "Atheca", healthBonus: 10, shieldBonus: -2.5, armorBonus: -2.5 },
  { id: "moa_gyro_phazor", name: "Phazor", healthBonus: -2.5, shieldBonus: 5, armorBonus: 2.5 },
  { id: "moa_gyro_tyli", name: "Tyli", healthBonus: 5, shieldBonus: -5, armorBonus: 5 },
];

export const moaBrackets: MoaBracketPart[] = [
  { id: "moa_bracket_drimper", name: "Drimper" },
  { id: "moa_bracket_tian", name: "Tian", extraPolarity: "vazarin" },
  { id: "moa_bracket_jonsin", name: "Jonsin", extraPolarity: "madurai" },
  { id: "moa_bracket_gauth", name: "Gauth", extraPolarity: "naramon" },
  { id: "moa_bracket_hona", name: "Hona", extraPolarity: "naramon" },
];

export const houndModels: HoundModelPart[] = [
  {
    id: "hound_model_bhaira",
    name: "Bhaira",
    companionId: "bhaira_hound",
    weaponId: "lacerten",
    lotusPath: "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadB",
    preceptName: "Null Audit",
  },
  {
    id: "hound_model_dorma",
    name: "Dorma",
    companionId: "dorma_hound",
    weaponId: "batoten",
    lotusPath: "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadA",
    preceptName: "Repo Audit",
  },
  {
    id: "hound_model_hec",
    name: "Hec",
    companionId: "hec_hound",
    weaponId: "akaten",
    lotusPath: "/Lotus/Types/Friendly/Pets/ZanukaPets/ZanukaPetParts/ZanukaPetPartHeadC",
    preceptName: "Equilibrium Audit",
  },
];

export const houndCores: HoundCorePart[] = [
  { id: "hound_core_adlet", name: "Adlet", health: 350, shield: 450, armor: 350 },
  { id: "hound_core_garmr", name: "Garmr", health: 350, shield: 350, armor: 450 },
  { id: "hound_core_raiju", name: "Raiju", health: 450, shield: 350, armor: 350 },
];

export const houndBrackets: HoundBracketPart[] = [
  {
    id: "hound_bracket_cela",
    name: "Cela",
    healthBonus: 10,
    shieldBonus: 15,
    armorBonus: -5,
    preceptName: "Reflex Denial",
  },
  {
    id: "hound_bracket_urga",
    name: "Urga",
    healthBonus: 15,
    shieldBonus: -5,
    armorBonus: 10,
    preceptName: "Diversified Denial",
  },
  {
    id: "hound_bracket_zubb",
    name: "Zubb",
    healthBonus: -5,
    shieldBonus: 10,
    armorBonus: 15,
    preceptName: "Evasive Denial",
  },
];

export const houndStabilizers: HoundStabilizerPart[] = [
  {
    id: "hound_stabilizer_frak",
    name: "Frak",
    extraPolarity: "vazarin",
    preceptName: "Focused Prospectus",
  },
  {
    id: "hound_stabilizer_hinta",
    name: "Hinta",
    extraPolarity: "madurai",
    preceptName: "Synergized Prospectus",
  },
  {
    id: "hound_stabilizer_wanz",
    name: "Wanz",
    extraPolarity: "naramon",
    preceptName: "Aerial Prospectus",
  },
];

export interface ModularCompanionParts {
  kind: CompanionPartKind;
  model: string;
  core: string;
  bracket: string;
  gyro?: string;
  stabilizer?: string;
  /** Default true for renamed/imported pets; doubles applicable % bonuses. */
  isGilded?: boolean;
}
