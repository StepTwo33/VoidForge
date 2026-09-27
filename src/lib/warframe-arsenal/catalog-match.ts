import { allMods } from "@/data/mods";
import { allArcanes } from "@/data/arcanes";
import { allWarframes } from "@/data/warframes";
import { allWeapons } from "@/data/weapons";
import { customWeapons } from "@/data/custom-items";
import { allCompanions } from "@/data/companions";
import type { Companion, Mod, Warframe, Weapon } from "@/lib/types";

export type NamedCatalogItem = { id: string; name: string };

const normalizeName = (value: string): string =>
  value
    .toLowerCase()
    // Strip ASCII + common Unicode apostrophes so arsenal/"smart quote" names match.
    .replace(/['\u2018\u2019\u201B\u2032`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function buildNameIndex<T extends NamedCatalogItem>(items: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    map.set(normalizeName(item.name), item);
  }
  return map;
}

/** Arsenal export names that do not match the catalog display name. */
const ARSENAL_NAME_ALIASES: Record<string, string> = {
  duelist: "Narin",
  "prime steflos shotgun": "Steflos Prime",
  "prime corufell scythe weapon": "Corufell Prime",
};

function resolveArsenalName(name: string): string {
  return ARSENAL_NAME_ALIASES[normalizeName(name)] ?? name;
}

const modsByName = buildNameIndex(allMods);
const arcanesByName = buildNameIndex(allArcanes);
const warframesByName = buildNameIndex(allWarframes);
const weaponsByName = buildNameIndex([...allWeapons, ...customWeapons]);
const companionsByName = buildNameIndex(allCompanions);

/** Parse custom weapon names from Twitch payload (`...|NAME`). */
export function parseCustomItemName(itemName?: string): string | undefined {
  if (!itemName) return undefined;
  const pipe = itemName.lastIndexOf("|");
  if (pipe >= 0 && pipe < itemName.length - 1) {
    return itemName.slice(pipe + 1).trim();
  }
  return itemName.trim() || undefined;
}

export function labelFromUnknown(item: unknown): string | undefined {
  if (!item || typeof item !== "object") return undefined;
  const record = item as Record<string, unknown>;
  if (typeof record.name === "string" && record.name.length > 0) return record.name;
  if (typeof record.itemName === "string") {
    return parseCustomItemName(record.itemName) ?? record.itemName;
  }
  if (typeof record.uniqueName === "string") {
    const segment = record.uniqueName.split("/").filter(Boolean).pop();
    return segment?.replace(/([a-z])([A-Z])/g, "$1 $2");
  }
  return undefined;
}

export function findModByName(name: string): Mod | undefined {
  return modsByName.get(normalizeName(name));
}

export function findArcaneByName(name: string): Mod | undefined {
  return arcanesByName.get(normalizeName(name));
}

export function findWarframeByName(name: string): Warframe | undefined {
  return warframesByName.get(normalizeName(resolveArsenalName(name)));
}

export function findWeaponByName(name: string): Weapon | undefined {
  return weaponsByName.get(normalizeName(resolveArsenalName(name)));
}

export function findCompanionByName(name: string): Companion | undefined {
  return companionsByName.get(normalizeName(name));
}
