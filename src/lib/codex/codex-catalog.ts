import type { Weapon } from "@/lib/types";
import { getWeaponRadialAttacks, weaponHasRadialAttacks } from "@/lib/weapons/weapon-radial-utils";

/** Modular part categories — hidden from codex weapon browse (same as weapon builder). */
export const CODEX_HIDDEN_WEAPON_CATEGORIES = new Set([
  "amp_prism",
  "zaw_strike",
  "kitgun_chamber",
]);

export const CODEX_WEAPON_CATEGORY_LABELS: Record<string, string> = {
  all: "All Weapons",
  rifle: "Rifles",
  shotgun: "Shotguns",
  bow: "Bows",
  pistol: "Pistols",
  secondary: "Secondary",
  dual_pistols: "Dual Pistols",
  melee: "Melee",
  launcher: "Launchers",
  archgun: "Archguns",
  archmelee: "Archmelee",
  primary: "Primary",
  sentinel_weapon: "Sentinel",
  hound_weapon: "Hound",
  beast_claw: "Beast Claws",
  tektolyst: "Tektolyst",
};

export const CODEX_WEAPON_CATEGORY_FILTERS = Object.entries(CODEX_WEAPON_CATEGORY_LABELS).map(
  ([id, label]) => ({ id, label }),
);

export const CODEX_COMPANION_TYPE_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All Companions" },
  { id: "sentinel", label: "Sentinels" },
  { id: "kubrow", label: "Kubrows" },
  { id: "kavat", label: "Kavats" },
  { id: "moa", label: "MOAs" },
  { id: "predasite", label: "Predasites" },
  { id: "vulpaphyla", label: "Vulpaphylas" },
  { id: "hound", label: "Hounds" },
];

export function formatWeaponCategory(category: string): string {
  return CODEX_WEAPON_CATEGORY_LABELS[category] ?? category.replace(/_/g, " ");
}

export function formatCompanionType(type: string): string {
  const match = CODEX_COMPANION_TYPE_FILTERS.find((f) => f.id === type);
  return match?.label ?? type.replace(/_/g, " ");
}

export function getCodexWikiUrl(name: string): string {
  return `https://wiki.warframe.com/w/${encodeURIComponent(name.replace(/ /g, "_"))}`;
}

export function matchesCodexSearch(
  query: string,
  fields: (string | undefined | null)[],
): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export function filterCodexWeapons(
  weapons: Weapon[],
  category: string,
  searchQuery: string,
  opts?: { aoeOnly?: boolean },
): Weapon[] {
  let list = weapons.filter((w) => !CODEX_HIDDEN_WEAPON_CATEGORIES.has(w.category));
  if (category !== "all") {
    list = list.filter((w) => w.category === category);
  }
  if (opts?.aoeOnly) {
    list = list.filter((w) => weaponHasRadialAttacks(w));
  }
  if (searchQuery.trim()) {
    list = list.filter((w) =>
      matchesCodexSearch(searchQuery, [
        w.name,
        w.id,
        w.category,
        w.triggerType,
        w.passive,
        w.abilityName,
        ...getWeaponRadialAttacks(w).map((a) => a.name),
      ]),
    );
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export const WEAPON_ELEMENT_KEYS = [
  "heat",
  "cold",
  "toxin",
  "electricity",
  "radiation",
  "viral",
  "corrosive",
  "blast",
  "gas",
  "magnetic",
  "tau",
  "void",
] as const;

export function weaponElementEntries(weapon: Weapon): { label: string; value: number }[] {
  const entries: { label: string; value: number }[] = [];
  for (const key of WEAPON_ELEMENT_KEYS) {
    const val = weapon[key];
    if (val && val > 0) {
      entries.push({ label: key, value: val });
    }
  }
  return entries;
}

export function pct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}
