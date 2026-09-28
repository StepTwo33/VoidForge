import {
  ampPrisms,
  kitgunChambers,
  zawStrikes,
} from "@/data/modular-weapons";
import { reactors } from "@/data/railjack";
import {
  getEffectiveArchwings,
  getEffectiveCompanions,
  getEffectiveNecramechs,
  getEffectiveWarframes,
  getEffectiveWeapons,
} from "@/lib/weapons/effective-data";
import { getModCategory } from "@/lib/weapons/weapon-categories";
import {
  CODEX_COMPANION_TYPE_FILTERS,
  CODEX_HIDDEN_WEAPON_CATEGORIES,
} from "@/lib/codex/codex-catalog";
import { getCompanionImage, getWarframeImage, getWeaponImage } from "@/lib/display/images";

/** Discover top-level build types (hub tiles). */
export const DISCOVER_CATEGORIES = [
  {
    id: "weapon",
    label: "Weapons",
    description: "Primary, secondary, and melee builds",
  },
  {
    id: "warframe",
    label: "Warframes",
    description: "Frame mods, arcanes, and shards",
  },
  {
    id: "companion",
    label: "Companions",
    description: "Sentinels, pets, MOAs, and hounds",
  },
  {
    id: "modular",
    label: "Modular",
    description: "Kitguns, Zaws, and Amps",
  },
  {
    id: "archwing",
    label: "Archwing",
    description: "Archwings and Necramechs",
  },
  {
    id: "railjack",
    label: "Railjack",
    description: "Railjack loadouts and reactors",
  },
  {
    id: "loadout",
    label: "Loadouts",
    description: "Full kits — frame and weapons together",
  },
] as const;

export type DiscoverCategoryId = (typeof DISCOVER_CATEGORIES)[number]["id"];

export interface DiscoverSubtype {
  id: string;
  label: string;
}

const WEAPON_SLOTS: DiscoverSubtype[] = [
  { id: "all", label: "All" },
  { id: "primary", label: "Primary" },
  { id: "secondary", label: "Secondary" },
  { id: "melee", label: "Melee" },
];

const MODULAR_SLOTS: DiscoverSubtype[] = [
  { id: "all", label: "All" },
  { id: "kitgun", label: "Kitguns" },
  { id: "zaw", label: "Zaws" },
  { id: "amp", label: "Amps" },
];

const ARCHWING_SLOTS: DiscoverSubtype[] = [
  { id: "all", label: "All" },
  { id: "archwing", label: "Archwing" },
  { id: "necramech", label: "Necramech" },
];

const COMPANION_SLOTS: DiscoverSubtype[] = CODEX_COMPANION_TYPE_FILTERS.map((f) =>
  f.id === "all" ? { id: "all", label: "All" } : { id: f.id, label: f.label },
);

/** Subtype chips for a Discover category; empty when the type has no slots. */
export function getDiscoverSubtypes(type: string): DiscoverSubtype[] {
  switch (type) {
    case "weapon":
      return WEAPON_SLOTS;
    case "companion":
      return COMPANION_SLOTS;
    case "modular":
      return MODULAR_SLOTS;
    case "archwing":
      return ARCHWING_SLOTS;
    default:
      return [];
  }
}

export function isValidDiscoverSlot(type: string, slot: string | null | undefined): boolean {
  if (!slot || slot === "all") return true;
  const subtypes = getDiscoverSubtypes(type);
  if (subtypes.length === 0) return false;
  return subtypes.some((s) => s.id === slot);
}

export type SubtypeItemFilter =
  | { kind: "none" }
  | { kind: "ids"; ids: string[] }
  | { kind: "prefix"; prefix: string };

/**
 * Resolve Prisma-friendly itemId constraints for a type + slot.
 * `slot` of null/"all"/invalid → no extra constraint.
 */
export function resolveSubtypeItemFilter(
  type: string,
  slot: string | null | undefined,
): SubtypeItemFilter {
  if (!slot || slot === "all" || !isValidDiscoverSlot(type, slot)) {
    return { kind: "none" };
  }

  if (type === "weapon") {
    const ids = getEffectiveWeapons()
      .filter((w) => !CODEX_HIDDEN_WEAPON_CATEGORIES.has(w.category))
      .filter((w) => getModCategory(w.category) === slot)
      .map((w) => w.id);
    return { kind: "ids", ids };
  }

  if (type === "companion") {
    const ids = getEffectiveCompanions()
      .filter((c) => c.type === slot)
      .map((c) => c.id);
    return { kind: "ids", ids };
  }

  if (type === "modular") {
    if (slot === "kitgun" || slot === "zaw" || slot === "amp") {
      return { kind: "prefix", prefix: `${slot}:` };
    }
    return { kind: "none" };
  }

  if (type === "archwing") {
    if (slot === "archwing") {
      return { kind: "ids", ids: getEffectiveArchwings().map((a) => a.id) };
    }
    if (slot === "necramech") {
      return { kind: "ids", ids: getEffectiveNecramechs().map((n) => n.id) };
    }
  }

  return { kind: "none" };
}

export function getDiscoverCategory(type: string) {
  return DISCOVER_CATEGORIES.find((c) => c.id === type) ?? null;
}

export interface DiscoverCatalogItem {
  id: string;
  name: string;
  image: string | null;
}

const WEAPON_SLOTS_SET = new Set(["primary", "secondary", "melee"]);

/** Full catalog for a Discover category (+ optional slot), for the item image grid. */
export function listDiscoverCatalogItems(
  type: string,
  slot: string | null | undefined = "all",
): DiscoverCatalogItem[] {
  const activeSlot = slot && slot !== "all" && isValidDiscoverSlot(type, slot) ? slot : "all";

  if (type === "weapon") {
    return getEffectiveWeapons()
      .filter((w) => !w.isExalted)
      .filter((w) => !CODEX_HIDDEN_WEAPON_CATEGORIES.has(w.category))
      .filter((w) => {
        const modCat = getModCategory(w.category);
        if (!WEAPON_SLOTS_SET.has(modCat)) return false;
        return activeSlot === "all" || modCat === activeSlot;
      })
      .map((w) => ({
        id: w.id,
        name: w.name,
        image: getWeaponImage(w.name, { category: w.category }),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "warframe") {
    return getEffectiveWarframes()
      .map((wf) => ({
        id: wf.id,
        name: wf.name,
        image: getWarframeImage(wf.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "companion") {
    return getEffectiveCompanions()
      .filter((c) => activeSlot === "all" || c.type === activeSlot)
      .map((c) => ({
        id: c.id,
        name: c.name,
        image: getCompanionImage(c.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "modular") {
    const parts: DiscoverCatalogItem[] = [];
    if (activeSlot === "all" || activeSlot === "kitgun") {
      for (const c of kitgunChambers) {
        parts.push({
          id: `kitgun:${c.id}`,
          name: c.name,
          image: getWeaponImage(c.name, { category: "kitgun_chamber" }),
        });
      }
    }
    if (activeSlot === "all" || activeSlot === "zaw") {
      for (const s of zawStrikes) {
        parts.push({
          id: `zaw:${s.id}`,
          name: s.name,
          image: getWeaponImage(s.name, { category: "zaw_strike" }),
        });
      }
    }
    if (activeSlot === "all" || activeSlot === "amp") {
      for (const p of ampPrisms) {
        parts.push({
          id: `amp:${p.id}`,
          name: p.name,
          image: getWeaponImage(p.name, { category: "amp_prism" }),
        });
      }
    }
    return parts.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "archwing") {
    const items: DiscoverCatalogItem[] = [];
    if (activeSlot === "all" || activeSlot === "archwing") {
      for (const a of getEffectiveArchwings()) {
        items.push({ id: a.id, name: a.name, image: getWarframeImage(a.name) });
      }
    }
    if (activeSlot === "all" || activeSlot === "necramech") {
      for (const n of getEffectiveNecramechs()) {
        items.push({ id: n.id, name: n.name, image: getWarframeImage(n.name) });
      }
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "railjack") {
    const items: DiscoverCatalogItem[] = [
      { id: "railjack", name: "Railjack", image: null },
    ];
    for (const r of reactors) {
      items.push({ id: r.id, name: r.name, image: null });
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (type === "loadout") {
    return getEffectiveWarframes()
      .map((wf) => ({
        id: wf.id,
        name: wf.name,
        image: getWarframeImage(wf.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return [];
}
