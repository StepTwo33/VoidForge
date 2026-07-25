import type { Ability } from "@/lib/types";
import type { StatPickerOption } from "@/lib/overrides/override-stat-catalog";

/** Damage types the ability TTK calculator understands. */
export const ABILITY_DAMAGE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "Impact", label: "Impact" },
  { value: "Puncture", label: "Puncture" },
  { value: "Slash", label: "Slash" },
  { value: "Heat", label: "Heat" },
  { value: "Cold", label: "Cold" },
  { value: "Toxin", label: "Toxin" },
  { value: "Electricity", label: "Electricity" },
  { value: "Blast", label: "Blast" },
  { value: "Corrosive", label: "Corrosive" },
  { value: "Viral", label: "Viral" },
  { value: "Gas", label: "Gas" },
  { value: "Magnetic", label: "Magnetic" },
  { value: "Radiation", label: "Radiation" },
  { value: "Void", label: "Void" },
  { value: "Finisher", label: "Finisher (ignores armor)" },
  { value: "True", label: "True damage" },
];

export type AbilityFieldKind = "number" | "damageType" | "percent" | "subAbilities";

export interface AbilityFieldDef {
  key: keyof Ability | "miscStats";
  label: string;
  group: string;
  kind: AbilityFieldKind;
  placeholder?: string;
  step?: string;
}

/** Calculable ability fields — only what build math / TTK uses. */
export const ABILITY_FIELD_DEFS: AbilityFieldDef[] = [
  { key: "damage", label: "Damage", group: "Combat", kind: "number" },
  { key: "directDamage", label: "Direct hit damage", group: "Combat", kind: "number" },
  { key: "aoeDamage", label: "AoE damage", group: "Combat", kind: "number" },
  { key: "damagePerSecond", label: "Damage per second", group: "Combat", kind: "number" },
  { key: "statusChance", label: "Status chance", group: "Combat", kind: "percent", placeholder: "0–1 or %" },
  { key: "damageType", label: "Damage type", group: "Combat", kind: "damageType" },
  { key: "comboMultiplier", label: "Combo multiplier", group: "Combat", kind: "number" },
  { key: "range", label: "Range (m)", group: "Area & reach", kind: "number" },
  { key: "radius", label: "Radius (m)", group: "Area & reach", kind: "number" },
  { key: "duration", label: "Duration (s)", group: "Area & reach", kind: "number" },
  { key: "health", label: "Health bonus", group: "Survivability", kind: "number" },
  { key: "armor", label: "Armor bonus", group: "Survivability", kind: "number" },
  { key: "shield", label: "Shield bonus", group: "Survivability", kind: "number" },
  { key: "damageReduction", label: "Damage reduction", group: "Survivability", kind: "percent" },
  { key: "damageBuff", label: "Damage buff", group: "Survivability", kind: "percent" },
  { key: "castTime", label: "Cast time (s)", group: "Timing", kind: "number" },
  { key: "cooldown", label: "Cooldown (s)", group: "Timing", kind: "number" },
  { key: "maxTargets", label: "Max targets", group: "Chain & targets", kind: "number" },
  { key: "chainRange", label: "Chain range (m)", group: "Chain & targets", kind: "number" },
  { key: "chainLinks", label: "Chain links", group: "Chain & targets", kind: "number" },
  { key: "subAbilities", label: "Sub-abilities", group: "Other", kind: "subAbilities", placeholder: "Comma-separated names" },
  { key: "miscStats", label: "Extra stats", group: "Other", kind: "number" },
];

const ABILITY_FIELD_BY_KEY = new Map(ABILITY_FIELD_DEFS.map((d) => [d.key, d]));

export const ABILITY_FIELD_GROUPS = [...new Set(ABILITY_FIELD_DEFS.map((d) => d.group))];

/** miscStats keys shown in ability panels (from ability-misc-stats). */
const ABILITY_MISC_STAT_LABELS: Record<string, string> = {
  shieldStrip: "Shield strip",
  armorStrip: "Armor strip",
  arc: "Arc (degrees)",
  minRadius: "Min radius (m)",
  maxRadius: "Max radius (m)",
  decoyDamage: "Decoy damage",
  decoyRadius: "Decoy radius (m)",
  decoyDuration: "Decoy duration (s)",
  decoyCooldown: "Decoy cooldown (s)",
  damageReduction: "Damage reduction",
  healthRegen: "Health regen",
  reviveCooldown: "Revive cooldown (s)",
  criticalChanceBonus: "Crit chance bonus",
  maxConstellationStars: "Max stars",
  durationExtension: "Duration extension",
  slowPercent: "Slow %",
  lifeStealPercent: "Life steal %",
  defenseReduction: "Defense reduction",
  splashRadius: "Splash radius (m)",
  javelins: "Javelins",
  maggots: "Maggots",
  energyRegen: "Energy regen",
  shieldsPerKill: "Shields per kill",
  healthPerHit: "Health per hit",
  speedBuff: "Speed buff",
  reloadBuff: "Reload buff",
  gunDamage: "Gun damage",
  meleeDamage: "Melee damage",
  damageBonus: "Damage bonus",
  strengthBonus: "Strength bonus",
  enemyLinkRange: "Link range (m)",
  explosionRadius: "Explosion radius (m)",
  armorMultiplier: "Armor multiplier",
  damageGrowth: "Damage growth",
  electricDamageBonus: "Electric damage bonus",
  viralDamageBonus: "Viral damage bonus",
  voidDamageBonus: "Void damage bonus",
  critDamageBonus: "Crit damage bonus",
  energyDrain: "Energy drain",
  energyRefundPerHit: "Energy per hit",
  width: "Width (m)",
  mutationStackChance: "Mutation chance",
  mutationStackCost: "Mutation cost",
  statusCleanse: "Status cleanse",
  statusChance: "Status chance",
  healthMultiplier: "Health multiplier",
  damageMultiplier: "Damage multiplier",
  sparkDamageMultiplier: "Spark damage mult.",
  markDamageMultiplier: "Mark damage mult.",
  healPerMeter: "Heal per meter",
  stunRadius: "Stun radius (m)",
  armorCap: "Armor cap",
  armorDuration: "Armor duration (s)",
  drCap: "DR cap (internal)",
  slowCap: "Slow cap (internal)",
  channeled: "Channeled (internal)",
  maxDuration: "Max duration (internal)",
};

export function getAbilityMiscStatLabel(key: string): string {
  return ABILITY_MISC_STAT_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export function getAbilityMiscStatPickerOptions(): StatPickerOption[] {
  return Object.entries(ABILITY_MISC_STAT_LABELS).map(([value, label]) => ({
    value,
    label,
    group: "Ability extras",
  }));
}

export function getAbilityFieldDef(key: string): AbilityFieldDef | undefined {
  return ABILITY_FIELD_BY_KEY.get(key as AbilityFieldDef["key"]);
}

export interface AbilityDraft {
  name: string;
  energyCost: number;
  description: string;
  /** Optional fields the moderator chose to show/edit for this ability. */
  visibleFields: string[];
  damage?: number;
  directDamage?: number;
  aoeDamage?: number;
  damagePerSecond?: number;
  range?: number;
  duration?: number;
  radius?: number;
  health?: number;
  armor?: number;
  shield?: number;
  damageReduction?: number;
  damageBuff?: number;
  statusChance?: number;
  damageType?: string;
  castTime?: number;
  cooldown?: number;
  maxTargets?: number;
  chainRange?: number;
  chainLinks?: number;
  comboMultiplier?: number;
  subAbilities?: string[];
  miscStats?: Record<string, number>;
}

type OptionalScalarKey = Exclude<
  keyof AbilityDraft,
  "name" | "energyCost" | "description" | "visibleFields" | "subAbilities" | "miscStats"
>;

const OPTIONAL_SCALAR_KEYS: OptionalScalarKey[] = ABILITY_FIELD_DEFS.filter(
  (d): d is AbilityFieldDef & { key: OptionalScalarKey } =>
    d.key !== "miscStats" && d.key !== "subAbilities",
).map((d) => d.key);

function parseMiscStats(raw: Ability["miscStats"]): Record<string, number> | undefined {
  if (!raw) return undefined;
  const nums: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "number") nums[k] = v;
    else if (typeof v === "string") {
      const n = parseFloat(v.replace(/[^\d.-]/g, ""));
      if (Number.isFinite(n)) nums[k] = n;
    }
  }
  return Object.keys(nums).length ? nums : undefined;
}

function pickScalarsFromAbility(ability: Ability): Pick<AbilityDraft, OptionalScalarKey> {
  return {
    damage: ability.damage,
    directDamage: ability.directDamage,
    aoeDamage: ability.aoeDamage,
    damagePerSecond: ability.damagePerSecond,
    range: ability.range,
    duration: ability.duration,
    radius: ability.radius,
    health: ability.health,
    armor: ability.armor,
    shield: ability.shield,
    damageReduction: ability.damageReduction,
    damageBuff: ability.damageBuff,
    statusChance: ability.statusChance,
    damageType: ability.damageType,
    castTime: ability.castTime,
    cooldown: ability.cooldown,
    maxTargets: ability.maxTargets,
    chainRange: ability.chainRange,
    chainLinks: ability.chainLinks,
    comboMultiplier: ability.comboMultiplier,
  };
}

function applyVisibleScalarsFromDraft(draft: AbilityDraft, ability: Ability): void {
  const visible = new Set(draft.visibleFields);
  if (visible.has("damage") && draft.damage !== undefined) ability.damage = draft.damage;
  if (visible.has("directDamage") && draft.directDamage !== undefined) ability.directDamage = draft.directDamage;
  if (visible.has("aoeDamage") && draft.aoeDamage !== undefined) ability.aoeDamage = draft.aoeDamage;
  if (visible.has("damagePerSecond") && draft.damagePerSecond !== undefined) {
    ability.damagePerSecond = draft.damagePerSecond;
  }
  if (visible.has("range") && draft.range !== undefined) ability.range = draft.range;
  if (visible.has("duration") && draft.duration !== undefined) ability.duration = draft.duration;
  if (visible.has("radius") && draft.radius !== undefined) ability.radius = draft.radius;
  if (visible.has("health") && draft.health !== undefined) ability.health = draft.health;
  if (visible.has("armor") && draft.armor !== undefined) ability.armor = draft.armor;
  if (visible.has("shield") && draft.shield !== undefined) ability.shield = draft.shield;
  if (visible.has("damageReduction") && draft.damageReduction !== undefined) {
    ability.damageReduction = draft.damageReduction;
  }
  if (visible.has("damageBuff") && draft.damageBuff !== undefined) ability.damageBuff = draft.damageBuff;
  if (visible.has("statusChance") && draft.statusChance !== undefined) ability.statusChance = draft.statusChance;
  if (visible.has("damageType") && draft.damageType) ability.damageType = draft.damageType;
  if (visible.has("castTime") && draft.castTime !== undefined) ability.castTime = draft.castTime;
  if (visible.has("cooldown") && draft.cooldown !== undefined) ability.cooldown = draft.cooldown;
  if (visible.has("maxTargets") && draft.maxTargets !== undefined) ability.maxTargets = draft.maxTargets;
  if (visible.has("chainRange") && draft.chainRange !== undefined) ability.chainRange = draft.chainRange;
  if (visible.has("chainLinks") && draft.chainLinks !== undefined) ability.chainLinks = draft.chainLinks;
  if (visible.has("comboMultiplier") && draft.comboMultiplier !== undefined) {
    ability.comboMultiplier = draft.comboMultiplier;
  }
}
function collectVisibleFields(ability: Ability): string[] {
  const visible: string[] = [];
  for (const key of OPTIONAL_SCALAR_KEYS) {
    if (ability[key] !== undefined && ability[key] !== null && ability[key] !== "") {
      visible.push(key);
    }
  }
  if (ability.subAbilities?.length) visible.push("subAbilities");
  if (ability.miscStats && Object.keys(ability.miscStats).length > 0) visible.push("miscStats");
  return visible;
}

export function abilityToDraft(ability: Ability): AbilityDraft {
  return {
    name: ability.name,
    energyCost: ability.energyCost,
    description: ability.description,
    visibleFields: collectVisibleFields(ability),
    ...pickScalarsFromAbility(ability),
    subAbilities: ability.subAbilities?.length ? [...ability.subAbilities] : undefined,
    miscStats: parseMiscStats(ability.miscStats),
  };
}

export function abilitiesToDrafts(raw: unknown): AbilityDraft[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((ab) => abilityToDraft(ab as Ability));
}

export function draftToAbility(draft: AbilityDraft): Ability {
  const ability: Ability = {
    name: draft.name.trim(),
    energyCost: draft.energyCost,
    description: draft.description,
  };
  applyVisibleScalarsFromDraft(draft, ability);
  if (draft.visibleFields.includes("subAbilities") && draft.subAbilities?.length) {
    ability.subAbilities = draft.subAbilities;
  }
  if (draft.visibleFields.includes("miscStats") && draft.miscStats && Object.keys(draft.miscStats).length) {
    ability.miscStats = { ...draft.miscStats };
  }
  return ability;
}

export function draftsToAbilitiesPayload(drafts: AbilityDraft[]): Ability[] {
  return drafts.filter((d) => d.name.trim()).map(draftToAbility);
}

export function getAddableAbilityFields(draft: AbilityDraft): AbilityFieldDef[] {
  const used = new Set(draft.visibleFields);
  return ABILITY_FIELD_DEFS.filter((d) => !used.has(d.key));
}
