import { find } from "@wfcd/items/utilities";
import { archwings, necramechs } from "@/data/archwing";
import {
  houndBrackets,
  houndCores,
  houndModels,
  houndStabilizers,
  moaBrackets,
  moaCores,
  moaGyros,
  moaModels,
  type ModularCompanionParts,
} from "@/data/companion-parts";
import { allHelminthAbilities } from "@/data/helminth";
import {
  ampBraces,
  ampPrisms,
  ampScaffolds,
  kitgunChambers,
  kitgunGrips,
  kitgunLoaders,
  zawGrips,
  zawLinks,
  zawStrikes,
} from "@/data/modular-weapons";
import type { ModularBuildData } from "@/lib/types";
import {
  findCompanionByName,
  findWarframeByName,
  findWeaponByName,
  labelFromUnknown,
  parseCustomItemName,
} from "@/lib/warframe-arsenal/catalog-match";
import { HELMINTH_LOTUS_SUFFIX_TO_ID } from "@/lib/warframe-arsenal/helminth-lotus-aliases";

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const helminthByName = new Map(allHelminthAbilities.map((a) => [normalize(a.name), a.id]));

const archwingsByName = new Map(archwings.map((a) => [normalize(a.name), a.id]));
const necramechsByName = new Map(necramechs.map((m) => [normalize(m.name), m.id]));

type ModularPartRef = { modularType: ModularBuildData["modularType"]; partKey: string; id: string };

function modularLookupKey(name: string): string {
  return normalize(
    name
      .replace(/\s+prism$/i, "")
      .replace(/\s+scaffold$/i, "")
      .replace(/\s+brace$/i, "")
      .replace(/\s+amp$/i, ""),
  );
}

function indexModularParts(): Map<string, ModularPartRef> {
  const map = new Map<string, ModularPartRef>();
  const add = (name: string, ref: ModularPartRef) => {
    map.set(normalize(name), ref);
    map.set(modularLookupKey(name), ref);
  };

  for (const p of kitgunChambers) add(p.name, { modularType: "kitgun", partKey: "chamber", id: p.id });
  for (const p of kitgunGrips) add(p.name, { modularType: "kitgun", partKey: "grip", id: p.id });
  for (const p of kitgunLoaders) add(p.name, { modularType: "kitgun", partKey: "loader", id: p.id });
  for (const p of zawStrikes) add(p.name, { modularType: "zaw", partKey: "strike", id: p.id });
  for (const p of zawGrips) add(p.name, { modularType: "zaw", partKey: "grip", id: p.id });
  for (const p of zawLinks) add(p.name, { modularType: "zaw", partKey: "link", id: p.id });
  for (const p of ampPrisms) add(p.name.replace(" Prism", ""), { modularType: "amp", partKey: "prism", id: p.id });
  for (const p of ampPrisms) add(p.name, { modularType: "amp", partKey: "prism", id: p.id });
  for (const p of ampScaffolds) add(p.name.replace(" Scaffold", ""), { modularType: "amp", partKey: "scaffold", id: p.id });
  for (const p of ampScaffolds) add(p.name, { modularType: "amp", partKey: "scaffold", id: p.id });
  for (const p of ampBraces) add(p.name.replace(" Brace", ""), { modularType: "amp", partKey: "brace", id: p.id });
  for (const p of ampBraces) add(p.name, { modularType: "amp", partKey: "brace", id: p.id });

  return map;
}

const modularPartsByName = indexModularParts();

const ELEMENT_DAMAGE_TAGS: Record<string, string> = {
  WeaponToxinDamageMod: "toxin",
  WeaponFireDamageMod: "heat",
  WeaponFreezeDamageMod: "cold",
  WeaponElectricityDamageMod: "electricity",
  WeaponImpactDamageMod: "impact",
  WeaponSlashDamageMod: "slash",
  WeaponPunctureDamageMod: "puncture",
  WeaponRadiationDamageMod: "radiation",
  WeaponViralDamageMod: "viral",
  WeaponCorrosiveDamageMod: "corrosive",
  WeaponGasDamageMod: "gas",
  WeaponMagneticDamageMod: "magnetic",
  WeaponBlastDamageMod: "blast",
};

export function lotusItemName(uniqueName: string): string | undefined {
  const item = find.findItem(uniqueName);
  if (item && typeof item.name === "string") return item.name;
  return labelFromUnknown({ uniqueName });
}

export function findWarframeByLotusPath(uniqueName?: string) {
  if (!uniqueName) return undefined;
  const name = lotusItemName(uniqueName);
  if (!name) return undefined;
  return findWarframeByName(name);
}

export function findWeaponByLotusPath(uniqueName?: string, itemName?: string) {
  if (uniqueName) {
    const resolved = lotusItemName(uniqueName);
    if (resolved) {
      const byResolved = findWeaponByName(resolved);
      if (byResolved) return byResolved;
    }
    const segment = uniqueName.split("/").filter(Boolean).pop() ?? "";
    const stem = segment
      .replace(/Weapon$/i, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/Kuva|Tenet|Prime|Wraith|Vandal/gi, (m) => ` ${m} `)
      .replace(/\s+/g, " ")
      .trim();
    const byStem = findWeaponByName(stem);
    if (byStem) return byStem;
  }
  if (itemName) {
    const custom = parseCustomItemName(itemName);
    if (custom) {
      // Custom Kuva/Tenet names are not catalog keys — caller should use uniqueName.
    }
  }
  return undefined;
}

export function findCompanionByLotusPath(uniqueName?: string, itemName?: string) {
  if (uniqueName) {
    const resolved = lotusItemName(uniqueName);
    if (resolved) {
      const byResolved = findCompanionByName(resolved);
      if (byResolved) return byResolved;
    }
    const byHint = findCompanionByPathHint(uniqueName);
    if (byHint) return byHint;
  }

  if (itemName) {
    const parsed = parseCustomItemName(itemName);
    if (parsed) {
      const byParsed = findCompanionByName(parsed);
      if (byParsed) return byParsed;
    }
    const byItem = findCompanionByName(itemName);
    if (byItem) return byItem;
  }

  return undefined;
}

/** Match breed-specific companions when lotusItemName is unavailable (e.g. predasites). */
function findCompanionByPathHint(uniqueName: string): ReturnType<typeof findCompanionByName> {
  const path = uniqueName.toLowerCase();
  const hints: Array<{ pattern: RegExp; name: string }> = [
    { pattern: /pharaoh|predasitepharaoh/, name: "Pharaoh Predasite" },
    { pattern: /vizier|predasitevizier/, name: "Vizier Predasite" },
    { pattern: /medjay|predasitemedjay/, name: "Medjay Predasite" },
    { pattern: /sly|vulpaphylasly/, name: "Sly Vulpaphyla" },
    { pattern: /crescent|vulpaphylacrescent/, name: "Crescent Vulpaphyla" },
    { pattern: /panzer|vulpaphylapanzer/, name: "Panzer Vulpaphyla" },
    { pattern: /sahasa/, name: "Sahasa Kubrow" },
    { pattern: /huras/, name: "Huras Kubrow" },
    { pattern: /chesa/, name: "Chesa Kubrow" },
    { pattern: /raksa/, name: "Raksa Kubrow" },
    { pattern: /sunika/, name: "Sunika Kubrow" },
    { pattern: /helminthcharger|helminth.?charger/, name: "Helminth Charger" },
    { pattern: /smeeta/, name: "Smeeta Kavat" },
    { pattern: /adarza/, name: "Adarza Kavat" },
    { pattern: /vasca/, name: "Vasca Kavat" },
    // MOA models
    { pattern: /lambeo/, name: "Lambeo Moa" },
    { pattern: /olaro|oloro/, name: "Oloro Moa" },
    { pattern: /para(?![a-z])|paramoa|moapara/, name: "Para Moa" },
    { pattern: /nychus|nidus.?moa|moanychus/, name: "Nychus Moa" },
    // Hound models
    { pattern: /bhaira/, name: "Bhaira Hound" },
    { pattern: /dorma/, name: "Dorma Hound" },
    { pattern: /hechound|\bhec\b|houndhec/, name: "Hec Hound" },
  ];

  for (const { pattern, name } of hints) {
    if (pattern.test(path)) return findCompanionByName(name);
  }
  return undefined;
}

export function findArchwingByLotusPath(uniqueName?: string) {
  const name = uniqueName ? lotusItemName(uniqueName) : undefined;
  if (!name) return undefined;
  const id = archwingsByName.get(normalize(name));
  return id ? { id, name } : undefined;
}

export function findNecramechByLotusPath(uniqueName?: string) {
  const name = uniqueName ? lotusItemName(uniqueName) : undefined;
  if (!name) return undefined;
  const id = necramechsByName.get(normalize(name));
  return id ? { id, name } : undefined;
}

/** Map DE abilityOverride to Voidforge helminth fields (0-based slot). */
export function resolveHelminthOverride(override?: {
  ability?: string;
  index?: number;
}): { helminthSlot: number; helminthAbilityId: string } | undefined {
  if (!override?.ability || override.index == null) return undefined;

  const suffix = override.ability.split("/").filter(Boolean).pop() ?? "";
  const mappedId = HELMINTH_LOTUS_SUFFIX_TO_ID[suffix];
  if (mappedId) {
    return { helminthAbilityId: mappedId, helminthSlot: normalizeAbilitySlot(override.index) };
  }

  const abilityLabel = suffix
    .replace(/Ability$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/Powersuit/i, "")
    .trim();

  for (const [normName, id] of helminthByName) {
    if (normalize(abilityLabel).includes(normName) || normName.includes(normalize(abilityLabel))) {
      return { helminthAbilityId: id, helminthSlot: normalizeAbilitySlot(override.index) };
    }
  }

  const fuzzy = allHelminthAbilities.find((a) => normalize(a.name) === normalize(abilityLabel));
  if (fuzzy) {
    return { helminthAbilityId: fuzzy.id, helminthSlot: normalizeAbilitySlot(override.index) };
  }

  return undefined;
}

function normalizeAbilitySlot(index: number): number {
  // DE uses 1–4 in the Twitch payload; Voidforge uses 0–3.
  if (index >= 1 && index <= 4) return index - 1;
  if (index >= 0 && index <= 3) return index;
  return Math.max(0, Math.min(3, index));
}

type RawUpgrade = {
  uniqueName?: string;
  rank?: number;
  buffs?: Array<{ tag?: string; val?: number }>;
};

export function parseProgenitorFromRawWeapon(raw?: {
  upgradeType?: string;
  upgrades?: unknown;
}): { progenitorElement?: string; progenitorBonusPercent?: number } {
  if (!raw?.upgradeType?.includes("InnateDamage")) return {};

  const upgradesRaw = raw.upgrades;
  const upgrades: RawUpgrade[] = Array.isArray(upgradesRaw)
    ? (upgradesRaw as RawUpgrade[])
    : upgradesRaw && typeof upgradesRaw === "object" && "mods" in upgradesRaw
      ? ((upgradesRaw as { mods?: RawUpgrade[] }).mods ?? [])
      : [];

  const innate = upgrades.find(
    (u) =>
      u.uniqueName?.includes("InnateDamage") ||
      u.uniqueName === raw.upgradeType,
  );

  if (innate?.buffs?.length) {
    for (const buff of innate.buffs) {
      const tag = buff.tag ?? "";
      const element = ELEMENT_DAMAGE_TAGS[tag];
      if (element && typeof buff.val === "number") {
        return {
          progenitorElement: element,
          progenitorBonusPercent: Math.round(buff.val * 100),
        };
      }
    }
  }

  return {};
}

function partNameFromLotus(part: unknown): string | undefined {
  if (!part) return undefined;
  if (typeof part === "string") return lotusItemName(part);
  if (typeof part === "object") {
    const record = part as Record<string, unknown>;
    if (typeof record.uniqueName === "string") return lotusItemName(record.uniqueName);
    if (typeof record.name === "string") return record.name;
  }
  return labelFromUnknown(part);
}

function modularPartFromPathHint(path: string): ModularPartRef | undefined {
  const segment = path.split("/").pop() ?? "";
  for (const [name, ref] of modularPartsByName) {
    if (segment.toLowerCase().includes(name.replace(/\s+/g, ""))) return ref;
    if (segment.toLowerCase().includes(name.replace(/\s+/g, "").slice(0, 4))) return ref;
  }
  const catchmoon = /catchmoon/i.test(segment) ? modularPartsByName.get("catchmoon") : undefined;
  if (catchmoon) return catchmoon;
  const kronsh = /kronsh/i.test(segment) ? modularPartsByName.get("kronsh") : undefined;
  if (kronsh) return kronsh;
  return undefined;
}

type CompanionPartHit = {
  kind: "moa" | "hound";
  slot: "model" | "core" | "gyro" | "bracket" | "stabilizer";
  id: string;
};

function indexCompanionParts(): Array<{ stem: string; hit: CompanionPartHit }> {
  const out: Array<{ stem: string; hit: CompanionPartHit }> = [];
  const add = (name: string, hit: CompanionPartHit, lotusPath?: string) => {
    out.push({ stem: normalize(name).replace(/\s+/g, ""), hit });
    if (lotusPath) {
      const seg = lotusPath.split("/").pop() ?? "";
      out.push({ stem: seg.toLowerCase(), hit });
    }
  };
  for (const p of moaModels) add(p.name, { kind: "moa", slot: "model", id: p.id }, p.lotusPath);
  for (const p of moaCores) add(p.name, { kind: "moa", slot: "core", id: p.id }, p.lotusPath);
  for (const p of moaGyros) add(p.name, { kind: "moa", slot: "gyro", id: p.id }, p.lotusPath);
  for (const p of moaBrackets) add(p.name, { kind: "moa", slot: "bracket", id: p.id }, p.lotusPath);
  for (const p of houndModels) add(p.name, { kind: "hound", slot: "model", id: p.id }, p.lotusPath);
  for (const p of houndCores) add(p.name, { kind: "hound", slot: "core", id: p.id }, p.lotusPath);
  for (const p of houndBrackets) add(p.name, { kind: "hound", slot: "bracket", id: p.id }, p.lotusPath);
  for (const p of houndStabilizers) {
    add(p.name, { kind: "hound", slot: "stabilizer", id: p.id }, p.lotusPath);
  }
  // Nychus head path uses MoaPetHeadMelee
  out.push({
    stem: "moapetheadmelee",
    hit: { kind: "moa", slot: "model", id: "moa_model_nychus" },
  });
  return out;
}

const companionPartIndex = indexCompanionParts();

function matchCompanionPartPath(pathOrName: string): CompanionPartHit | undefined {
  const compact = normalize(pathOrName).replace(/\s+/g, "");
  const segment = (pathOrName.split("/").pop() ?? pathOrName).toLowerCase();
  let best: CompanionPartHit | undefined;
  let bestLen = 0;
  for (const { stem, hit } of companionPartIndex) {
    if (!stem) continue;
    if (segment.includes(stem) || compact.includes(stem) || stem.includes(segment)) {
      if (stem.length > bestLen) {
        best = hit;
        bestLen = stem.length;
      }
    }
  }
  return best;
}

/** Map DE companion modularParts to Voidforge MOA/Hound part selection. */
export function mapCompanionPartsFromArsenal(
  parts: Record<string, unknown> | undefined,
): ModularCompanionParts | undefined {
  if (!parts) return undefined;

  const collected: Partial<Record<CompanionPartHit["slot"], string>> = {};
  let kind: "moa" | "hound" | undefined;

  for (const part of Object.values(parts)) {
    const path =
      typeof part === "string"
        ? part
        : typeof part === "object" && part && "uniqueName" in part
          ? String((part as { uniqueName: string }).uniqueName)
          : undefined;
    const display = partNameFromLotus(part) ?? (path ? lotusItemName(path) : undefined);
    const hit =
      (path ? matchCompanionPartPath(path) : undefined) ??
      (display ? matchCompanionPartPath(display) : undefined);
    if (!hit) continue;
    kind = hit.kind;
    collected[hit.slot] = hit.id;
  }

  if (!kind || !collected.model || !collected.core || !collected.bracket) return undefined;
  if (kind === "moa" && !collected.gyro) return undefined;
  if (kind === "hound" && !collected.stabilizer) return undefined;

  return {
    kind,
    model: collected.model,
    core: collected.core,
    bracket: collected.bracket,
    ...(kind === "moa" ? { gyro: collected.gyro } : { stabilizer: collected.stabilizer }),
    isGilded: true,
  };
}

/** Map DE modularParts / parser parts to Voidforge modular build parts. */
export function mapModularPartsFromArsenal(
  parts: Record<string, unknown> | undefined,
): { data: ModularBuildData; slot: "primary" | "secondary" | "melee" } | undefined {
  if (!parts) return undefined;

  const collected: Partial<Record<string, string>> = {};
  let modularType: ModularBuildData["modularType"] | undefined;

  for (const [slotKey, part] of Object.entries(parts)) {
    const path =
      typeof part === "string"
        ? part
        : typeof part === "object" && part && "uniqueName" in part
          ? String((part as { uniqueName: string }).uniqueName)
          : undefined;

    const displayName = partNameFromLotus(part) ?? (path ? lotusItemName(path) : undefined);
    let ref = displayName ? modularPartsByName.get(modularLookupKey(displayName)) : undefined;
    if (!ref && displayName) ref = modularPartsByName.get(normalize(displayName));
    if (!ref && path) ref = modularPartFromPathHint(path);

    if (!ref) continue;
    modularType = ref.modularType;
    collected[ref.partKey] = ref.id;
  }

  if (!modularType) return undefined;

  const requiredKeys: Record<ModularBuildData["modularType"], string[]> = {
    kitgun: ["chamber", "grip", "loader"],
    zaw: ["strike", "grip", "link"],
    amp: ["prism"],
  };

  const needed = requiredKeys[modularType];
  if (!needed.every((k) => collected[k])) return undefined;

  const data: ModularBuildData = {
    modularType,
    parts: collected as Record<string, string>,
    mods: [],
    hasOrokinCatalyst: false,
    slotPolarities: {},
  };

  let slot: "primary" | "secondary" | "melee" = "secondary";
  if (modularType === "zaw") slot = "melee";
  else if (modularType === "amp") slot = "primary";
  else {
    const gripId = collected.grip;
    const grip = kitgunGrips.find((g) => g.id === gripId);
    slot = grip?.type === "primary" ? "primary" : "secondary";
  }

  return { data, slot };
}

export function readAbilityOverride(rawWarframe?: unknown) {
  if (!rawWarframe || typeof rawWarframe !== "object") return undefined;
  const override = (rawWarframe as Record<string, unknown>).abilityOverride;
  if (!override || typeof override !== "object") return undefined;
  const record = override as Record<string, unknown>;
  return {
    ability: typeof record.ability === "string" ? record.ability : undefined,
    index: typeof record.index === "number" ? record.index : undefined,
  };
}

export function readRawWeaponFields(raw?: unknown) {
  if (!raw || typeof raw !== "object") return {};
  const record = raw as Record<string, unknown>;
  return {
    uniqueName: typeof record.uniqueName === "string" ? record.uniqueName : undefined,
    itemName: typeof record.itemName === "string" ? record.itemName : undefined,
    upgradeType: typeof record.upgradeType === "string" ? record.upgradeType : undefined,
    modularParts:
      record.modularParts && typeof record.modularParts === "object"
        ? (record.modularParts as Record<string, unknown>)
        : undefined,
    upgrades: record.upgrades,
    xp: typeof record.xp === "number" ? record.xp : undefined,
  };
}
