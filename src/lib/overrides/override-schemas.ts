import { OverrideCategory, OVERRIDE_CATEGORIES } from "@/lib/overrides/data-overrides";
import { CODEX_COMPANION_TYPE_FILTERS, CODEX_WEAPON_CATEGORY_LABELS } from "@/lib/codex/codex-catalog";
import { WEAPON_ELEMENT_KEYS } from "@/lib/codex/codex-catalog";

/** Record fields edited as individual stat rows (mods, arcanes, shards). */
export const NESTED_RECORD_FIELDS: Partial<Record<OverrideCategory, string[]>> = {
  mod: ["stats"],
  arcane: ["stats"],
  archon_shard: ["statBonuses"],
};

/** Fields edited with dedicated form components (not raw JSON). */
export const STRUCTURED_OVERRIDE_FIELDS: Partial<Record<OverrideCategory, string[]>> = {
  warframe: ["abilities"],
  arcane: ["effects"],
  arcane_effect: ["effects"],
  weapon: ["radialAttacks"],
};

/** When saving arcane catalog fixes, effect fields go to arcane_effect overrides. */
export const ARCANE_EFFECT_FIELD_KEYS = new Set(["effects", "trigger", "stackCap"]);

/** Hidden from the editor — too complex for moderators; use a report instead. */
export const HIDDEN_OVERRIDE_FIELDS = new Set([
  "id",
  "incarnonEvolutions",
]);

/** Long text fields use a textarea instead of a single-line input. */
export const TEXTAREA_FIELDS = new Set([
  "description",
  "passive",
  "precept",
  "note",
]);

export const SELECT_FIELD_OPTIONS: Record<string, { value: string; label: string }[]> = {
  polarity: [
    { value: "madurai", label: "Madurai (V)" },
    { value: "vazarin", label: "Vazarin (D)" },
    { value: "naramon", label: "Naramon (Dash)" },
    { value: "zenurik", label: "Zenurik (—)" },
    { value: "penjaga", label: "Penjaga (Y)" },
    { value: "unairu", label: "Unairu" },
    { value: "umbra", label: "Umbra" },
    { value: "exilus", label: "Exilus" },
    { value: "universal", label: "Universal" },
    { value: "any", label: "Any" },
    { value: "none", label: "None" },
  ],
  rarity: [
    { value: "common", label: "Common" },
    { value: "uncommon", label: "Uncommon" },
    { value: "rare", label: "Rare" },
    { value: "legendary", label: "Legendary" },
    { value: "peculiar", label: "Peculiar" },
  ],
  trigger: [
    { value: "passive", label: "Passive (always on)" },
    { value: "stacks", label: "Stacks (Merciless, Deadhead, etc.)" },
    { value: "onKill", label: "On kill" },
    { value: "onHeadshot", label: "On headshot" },
    { value: "onDamaged", label: "When damaged" },
    { value: "onReload", label: "On reload" },
    { value: "onAbilityCast", label: "On ability cast" },
    { value: "onMeleeKill", label: "On melee kill" },
    { value: "onFinisher", label: "On finisher" },
    { value: "onStatus", label: "On status proc" },
    { value: "onPickup", label: "On orb pickup" },
    { value: "onVoidSling", label: "On Void Sling" },
    { value: "onMovement", label: "On movement (slide / aim glide)" },
    { value: "onHit", label: "On hit" },
    { value: "onFreeze", label: "On freeze" },
    { value: "conditional", label: "Conditional (proc chance + effect)" },
  ],
  subCategory: [
    { value: "warframe", label: "Warframe" },
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "melee", label: "Melee" },
    { value: "operator", label: "Operator (Magus)" },
    { value: "kitgun", label: "Kitgun" },
    { value: "amp", label: "Amp (Virtuos)" },
    { value: "zaw", label: "Zaw / Exodia" },
    { value: "tektolyst", label: "Tektolyst" },
  ],
  color: [
    { value: "crimson", label: "Crimson" },
    { value: "azure", label: "Azure" },
    { value: "amber", label: "Amber" },
    { value: "violet", label: "Violet" },
    { value: "topaz", label: "Topaz" },
    { value: "emerald", label: "Emerald" },
  ],
  category: Object.entries(CODEX_WEAPON_CATEGORY_LABELS)
    .filter(([id]) => id !== "all")
    .map(([value, label]) => ({ value, label })),
  type: CODEX_COMPANION_TYPE_FILTERS.filter((f) => f.id !== "all").map((f) => ({
    value: f.id,
    label: f.label,
  })),
  triggerType: [
    { value: "Auto", label: "Auto" },
    { value: "Semi", label: "Semi-auto" },
    { value: "Burst", label: "Burst" },
    { value: "Charge", label: "Charge" },
    { value: "Duplex", label: "Duplex" },
    { value: "Melee", label: "Melee" },
    { value: "Active", label: "Active" },
    { value: "Held", label: "Held" },
  ],
  modCategory: [
    { value: "warframe", label: "Warframe" },
    { value: "aura", label: "Aura" },
    { value: "exilus", label: "Exilus" },
    { value: "rifle", label: "Rifle" },
    { value: "shotgun", label: "Shotgun" },
    { value: "bow", label: "Bow" },
    { value: "launcher", label: "Launcher" },
    { value: "primary", label: "Primary" },
    { value: "pistol", label: "Pistol" },
    { value: "secondary", label: "Secondary" },
    { value: "dual_pistols", label: "Dual pistols" },
    { value: "melee", label: "Melee" },
    { value: "stance", label: "Stance" },
    { value: "companion", label: "Companion" },
    { value: "archwing", label: "Archwing" },
    { value: "archgun", label: "Archgun" },
    { value: "archmelee", label: "Archmelee" },
    { value: "necramech", label: "Necramech" },
    { value: "arcane", label: "Arcane" },
    { value: "kdrive", label: "K-Drive" },
    { value: "amp", label: "Amp" },
    { value: "kitgun", label: "Kitgun" },
    { value: "zaw", label: "Zaw" },
  ],
  damageType: [
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
    { value: "Finisher", label: "Finisher" },
    { value: "True", label: "True" },
  ],
  arcaneType: [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "melee", label: "Melee" },
    { value: "kitgun", label: "Kitgun" },
    { value: "exodia", label: "Exodia (Zaw)" },
    { value: "archgun", label: "Archgun" },
    { value: "amp", label: "Amp" },
  ],
  stanceType: [
    { value: "sword", label: "Sword" },
    { value: "sword_shield", label: "Sword & Shield" },
    { value: "dual_swords", label: "Dual Swords" },
    { value: "dual_nikana", label: "Dual Nikanas" },
    { value: "dual_daggers", label: "Dual Daggers" },
    { value: "heavy_blade", label: "Heavy Blade" },
    { value: "heavy_scythe", label: "Heavy Scythe" },
    { value: "polearm", label: "Polearm" },
    { value: "staff", label: "Staff" },
    { value: "whip", label: "Whip" },
    { value: "fist", label: "Fist" },
    { value: "claw", label: "Claw" },
    { value: "nikana", label: "Nikana" },
    { value: "two_handed_nikana", label: "Two-Handed Nikana" },
    { value: "glaive", label: "Glaive" },
    { value: "scythe", label: "Scythe" },
    { value: "nunchaku", label: "Nunchaku" },
    { value: "gunblade", label: "Gunblade" },
    { value: "rapier", label: "Rapier" },
    { value: "machete", label: "Machete" },
    { value: "dagger", label: "Dagger" },
    { value: "tonfa", label: "Tonfa" },
    { value: "sparring", label: "Sparring" },
    { value: "warfan", label: "Warfan" },
    { value: "blade_whip", label: "Blade & Whip" },
    { value: "hammer", label: "Hammer" },
    { value: "bladesaw", label: "Assault Saw" },
  ],
};

/** Friendly labels moderators understand. */
export const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  drain: "Drain (base at rank 0)",
  maxRank: "Max rank",
  polarity: "Polarity",
  rarity: "Rarity",
  category: "Category",
  subCategory: "Sub-category",
  description: "Description",
  warframeId: "Warframe ID",
  trigger: "Trigger type",
  stackCap: "Stack cap",
  health: "Health",
  shield: "Shield",
  armor: "Armor",
  energy: "Energy",
  sprintSpeed: "Sprint speed",
  passive: "Passive description",
  damage: "Damage",
  fireRate: "Fire rate",
  blastStaggerRadius: "Blast proc and stagger radius",
  criticalChance: "Crit chance",
  criticalChanceOnHeadshot: "Crit chance on headshot",
  criticalChanceOnHeadshotKill: "Crit chance per headshot kill",
  weakPointDamage: "Weak point damage",
  criticalMultiplier: "Crit multiplier",
  slashOnCrit: "Slash proc chance on crit",
  extraElectricProcChance: "Extra Electric proc chance on hit",
  falloffDistance: "Falloff distance",
  slashOnImpactProc: "Slash proc chance on Impact proc",
  damageFirstShot: "Damage on first shot in magazine",
  statusChance: "Status chance",
  magazine: "Magazine size",
  reloadTime: "Reload time",
  multishot: "Multishot",
  modSlots: "Mod slots",
  tier: "Tier",
  color: "Shard color",
  isCoalescent: "Coalescent variant",
  stats: "Mod stats (per-rank base)",
  statBonuses: "Shard stat options",
  effects: "Effect stat values",
  abilities: "Abilities",
  radialAttacks: "Radial / AoE attacks",
  impact: "Impact damage",
  puncture: "Puncture damage",
  slash: "Slash damage",
  heat: "Heat damage",
  cold: "Cold damage",
  toxin: "Toxin damage",
  electricity: "Electricity damage",
  radiation: "Radiation damage",
  viral: "Viral damage",
  corrosive: "Corrosive damage",
  blast: "Blast damage",
  gas: "Gas damage",
  magnetic: "Magnetic damage",
  triggerType: "Trigger type",
  hasPrimaryArcaneSlot: "Primary arcane slot",
  hasSecondaryArcaneSlot: "Secondary arcane slot",
  isIncarnon: "Incarnon weapon",
  hasRivenSlot: "Riven slot",
  arcaneSlots: "Arcane slots",
  arcaneType: "Arcane type",
  stanceType: "Melee stance type",
  abilityName: "Ability (exalted)",
  isExalted: "Exalted weapon",
  companionType: "Companion type",
  weaponCategory: "Weapon category",
  focusSchool: "Focus school",
  kitgunChamberCategory: "Kitgun chamber",
  type: "Companion type",
  precept: "Precept",
  speed: "Flight speed",
};

/** Help text for StatRowsEditor — mod vs arcane catalog stats use different scaling. */
export const STAT_RECORD_HELP: Partial<Record<OverrideCategory, string>> = {
  mod: "Per-rank base from data. Max in build = base × (max rank + 1). Trash icon removes bogus wiki-parsed stats permanently for this fix.",
  arcane:
    "Legacy catalog stats on the arcane card (display / fallback). Values are at max rank and scale linearly by rank — not the mod formula. Build math uses effect lines below. Trash strips junk stats.",
  archon_shard: "Bonus amount for each shard stat option. Trash removes incorrect bonus keys.",
};

export const OVERRIDE_EDITOR_CATEGORIES = OVERRIDE_CATEGORIES;

export const OVERRIDE_CATEGORY_LABELS: Record<OverrideCategory, string> = {
  weapon: "Weapons",
  mod: "Mods",
  warframe: "Warframes",
  companion: "Companions",
  arcane: "Arcanes (catalog + build effects)",
  arcane_effect: "Arcane effect values only",
  archon_shard: "Archon Shards",
  archwing: "Archwings",
  necramech: "Necramechs",
};

export const OVERRIDE_ACTION_LABELS: Record<"modify" | "add" | "remove", string> = {
  modify: "Fix data",
  add: "New item",
  remove: "Hidden",
};

export const ADD_ITEM_TEMPLATES: Partial<Record<OverrideCategory, Record<string, unknown>>> = {
  mod: {
    id: "",
    name: "New Mod",
    polarity: "madurai",
    drain: 6,
    maxRank: 5,
    category: "warframe",
    stats: {},
    description: "",
    rarity: "common",
  },
  weapon: {
    id: "",
    name: "New Weapon",
    category: "rifle",
    damage: 100,
    impact: 0,
    puncture: 0,
    slash: 0,
    fireRate: 1,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    statusChance: 0.05,
    magazine: 30,
    reloadTime: 2,
    multishot: 1,
    triggerType: "auto",
    modSlots: 8,
    hasPrimaryArcaneSlot: true,
    hasSecondaryArcaneSlot: false,
    isIncarnon: false,
    hasRivenSlot: true,
  },
  warframe: {
    id: "",
    name: "New Warframe",
    health: 100,
    shield: 100,
    armor: 100,
    energy: 100,
    sprintSpeed: 1,
    description: "",
    passive: "",
    abilities: [],
  },
  arcane: {
    id: "",
    name: "New Arcane",
    polarity: "zenurik",
    drain: 0,
    maxRank: 5,
    category: "arcane",
    stats: {},
    description: "",
    rarity: "common",
  },
  arcane_effect: {
    name: "Arcane name",
    trigger: "passive",
    maxRank: 5,
    effects: [],
  },
  archon_shard: {
    id: "",
    name: "New Shard",
    color: "crimson",
    tier: 1,
    statBonuses: {},
    description: "",
    isCoalescent: false,
  },
  companion: {
    id: "",
    name: "New Companion",
    type: "sentinel",
    health: 100,
    shield: 100,
    armor: 100,
    description: "",
    precept: "",
  },
  archwing: {
    id: "",
    name: "New Archwing",
    health: 400,
    shield: 400,
    armor: 100,
    energy: 100,
    speed: 1,
    description: "",
  },
  necramech: {
    id: "",
    name: "New Necramech",
    health: 1000,
    shield: 500,
    armor: 500,
    energy: 100,
    description: "",
  },
};

export function getNestedRecordFields(category: OverrideCategory): string[] {
  return NESTED_RECORD_FIELDS[category] ?? [];
}

export function getStructuredOverrideFields(category: OverrideCategory): string[] {
  return STRUCTURED_OVERRIDE_FIELDS[category] ?? [];
}

export function formatOverrideFieldLabel(key: string): string {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/_/g, " ");
}

export function getSelectOptions(
  fieldKey: string,
  category?: OverrideCategory,
): { value: string; label: string }[] | null {
  if (fieldKey === "category" && category === "mod") {
    return SELECT_FIELD_OPTIONS.modCategory ?? null;
  }
  return SELECT_FIELD_OPTIONS[fieldKey] ?? null;
}

/** Group scalar fields into moderator-friendly sections per item type. */
export const CATEGORY_FIELD_SECTIONS: Partial<
  Record<OverrideCategory, { title: string; fields: string[] }[]>
> = {
  weapon: [
    { title: "Identity", fields: ["name", "category", "triggerType"] },
    { title: "Base damage", fields: ["damage", "impact", "puncture", "slash"] },
    { title: "Elements", fields: [...WEAPON_ELEMENT_KEYS] },
    {
      title: "Performance",
      fields: [
        "fireRate",
        "criticalChance",
        "criticalMultiplier",
        "statusChance",
        "magazine",
        "reloadTime",
        "multishot",
      ],
    },
    {
      title: "Slots & flags",
      fields: [
        "modSlots",
        "hasPrimaryArcaneSlot",
        "hasSecondaryArcaneSlot",
        "isIncarnon",
        "hasRivenSlot",
        "arcaneSlots",
        "arcaneType",
        "stanceType",
      ],
    },
    {
      title: "Exalted / companion",
      fields: [
        "warframeId",
        "abilityName",
        "isExalted",
        "companionType",
        "weaponCategory",
        "focusSchool",
        "kitgunChamberCategory",
      ],
    },
    { title: "Description", fields: ["passive"] },
  ],
  warframe: [
    { title: "Stats", fields: ["name", "health", "shield", "armor", "energy", "sprintSpeed"] },
    { title: "Description", fields: ["passive", "description"] },
  ],
  companion: [
    { title: "Identity", fields: ["name", "type"] },
    { title: "Stats", fields: ["health", "shield", "armor"] },
    { title: "Description", fields: ["precept", "description"] },
  ],
  archwing: [
    { title: "Identity", fields: ["name"] },
    { title: "Stats", fields: ["health", "shield", "armor", "energy", "speed"] },
    { title: "Description", fields: ["description"] },
  ],
  necramech: [
    { title: "Identity", fields: ["name"] },
    { title: "Stats", fields: ["health", "shield", "armor", "energy"] },
    { title: "Description", fields: ["description"] },
  ],
  mod: [
    { title: "Identity", fields: ["name", "category", "polarity", "rarity", "subCategory"] },
    { title: "Values", fields: ["drain", "maxRank", "warframeId"] },
    { title: "Description", fields: ["description"] },
  ],
  archon_shard: [
    { title: "Identity", fields: ["name", "color", "tier", "isCoalescent"] },
    { title: "Description", fields: ["description"] },
  ],
};

export function groupScalarFieldsForCategory(
  category: OverrideCategory,
  fields: { key: string; currentValue: unknown; inputType: string }[],
): { title: string; fields: typeof fields }[] {
  const sections = CATEGORY_FIELD_SECTIONS[category];
  if (!sections?.length) {
    return [{ title: "Basic info", fields }];
  }
  const byKey = new Map(fields.map((f) => [f.key, f]));
  const used = new Set<string>();
  const grouped: { title: string; fields: typeof fields }[] = [];
  for (const section of sections) {
    const sectionFields = section.fields
      .map((key) => byKey.get(key))
      .filter((f): f is (typeof fields)[number] => Boolean(f));
    sectionFields.forEach((f) => used.add(f.key));
    if (sectionFields.length) grouped.push({ title: section.title, fields: sectionFields });
  }
  const rest = fields.filter((f) => !used.has(f.key));
  if (rest.length) grouped.push({ title: "Other", fields: rest });
  return grouped;
}

/** Arcane trigger types for override editors and Codex inline edit. */
export const ARCANE_TRIGGER_OPTIONS = SELECT_FIELD_OPTIONS.trigger!;

/** Preferred field order per category (most-edited first). */
export const FIELD_ORDER: Partial<Record<OverrideCategory, string[]>> = {
  mod: ["name", "drain", "maxRank", "polarity", "rarity", "category", "description", "warframeId", "stats"],
  arcane: ["name", "subCategory", "drain", "maxRank", "description", "stats", "trigger", "stackCap", "effects"],
  arcane_effect: ["name", "trigger", "maxRank", "stackCap", "effects"],
  archon_shard: ["name", "color", "tier", "description", "isCoalescent"],
  warframe: ["name", "health", "shield", "armor", "energy", "sprintSpeed", "passive", "description", "abilities"],
  weapon: [
    "name",
    "category",
    "triggerType",
    "damage",
    "impact",
    "puncture",
    "slash",
    "fireRate",
    "criticalChance",
    "criticalMultiplier",
    "statusChance",
    "magazine",
    "reloadTime",
    "multishot",
    "passive",
  ],
  companion: ["name", "type", "health", "shield", "armor", "precept", "description"],
  archwing: ["name", "health", "shield", "armor", "energy", "speed", "description"],
};

export function sortFieldsForCategory(category: OverrideCategory, keys: string[]): string[] {
  const order = FIELD_ORDER[category] ?? [];
  const rank = new Map(order.map((k, i) => [k, i]));
  return [...keys].sort((a, b) => (rank.get(a) ?? 999) - (rank.get(b) ?? 999) || a.localeCompare(b));
}

/** Human-readable summary of saved override fields (no JSON). */
export function formatOverrideFieldsSummary(fields: Record<string, unknown>): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const [subKey, subVal] of Object.entries(value as Record<string, unknown>)) {
        lines.push(`${formatOverrideFieldLabel(key)} → ${formatOverrideFieldLabel(subKey)}: ${subVal}`);
      }
    } else if (Array.isArray(value)) {
      lines.push(`${formatOverrideFieldLabel(key)}: ${value.length} entries updated`);
    } else {
      lines.push(`${formatOverrideFieldLabel(key)}: ${String(value)}`);
    }
  }
  return lines;
}
