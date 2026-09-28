import { archwings, isNecramechId, necramechs } from "@/data/archwing";
import { allCompanions } from "@/data/companions";
import { ampPrisms, kitgunChambers, zawStrikes } from "@/data/modular-weapons";
import { reactors } from "@/data/railjack";
import { allWarframes } from "@/data/warframes";
import { allWeapons } from "@/data/weapons";

export interface BuildSearchItem {
  id: string;
  name: string;
  type: string;
}

const BUILD_ITEM_CATALOG: BuildSearchItem[] = (() => {
  const items: BuildSearchItem[] = [];
  for (const w of allWeapons) {
    if (w.isExalted) continue;
    items.push({ id: w.id, name: w.name, type: "weapon" });
  }
  for (const wf of allWarframes) {
    if (wf.id === "helminth" || isNecramechId(wf.id)) continue;
    items.push({ id: wf.id, name: wf.name, type: "warframe" });
    items.push({ id: wf.id, name: `${wf.name} loadouts`, type: "loadout" });
  }
  for (const c of allCompanions) {
    items.push({ id: c.id, name: c.name, type: "companion" });
  }
  for (const a of archwings) {
    items.push({ id: a.id, name: a.name, type: "archwing" });
  }
  for (const n of necramechs) {
    items.push({ id: n.id, name: n.name, type: "archwing" });
  }
  for (const c of kitgunChambers) {
    items.push({ id: `kitgun:${c.id}`, name: c.name, type: "modular" });
  }
  for (const s of zawStrikes) {
    items.push({ id: `zaw:${s.id}`, name: s.name, type: "modular" });
  }
  for (const p of ampPrisms) {
    items.push({ id: `amp:${p.id}`, name: p.name, type: "modular" });
  }
  items.push({ id: "railjack", name: "Railjack", type: "railjack" });
  for (const r of reactors) {
    items.push({ id: r.id, name: r.name, type: "railjack" });
  }
  return items;
})();

const CATALOG_BY_KEY = new Map(
  BUILD_ITEM_CATALOG.map((item) => [`${item.type}:${item.id}`, item]),
);

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function matchScore(item: BuildSearchItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(item.name);
  const id = item.id.toLowerCase();
  const qSlug = slugify(query);

  if (name === q || id === qSlug) return 1000;
  if (name.startsWith(q)) return 700 - name.length;
  if (id.startsWith(qSlug)) return 650 - id.length;
  if (name.includes(q)) return 400;
  if (id.includes(qSlug)) return 350;

  const qWords = q.split(/\s+/).filter(Boolean);
  if (qWords.length > 1 && qWords.every((word) => name.includes(word))) {
    return 300;
  }

  return 0;
}

export function searchBuildCatalog(query: string, limit = 8): BuildSearchItem[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const scored = BUILD_ITEM_CATALOG
    .map((item) => ({ item, score: matchScore(item, q) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  return scored.slice(0, limit).map((entry) => entry.item);
}

export function bestBuildCatalogMatch(query: string): BuildSearchItem | null {
  const matches = searchBuildCatalog(query, 1);
  return matches[0] ?? null;
}

export function getBuildItemRef(type: string, itemId: string): BuildSearchItem | null {
  return CATALOG_BY_KEY.get(`${type}:${itemId}`) ?? null;
}

export function buildDiscoverUrl(opts: {
  q?: string;
  type?: string;
  itemId?: string;
  slot?: string;
  sort?: "recent" | "popular";
  tag?: string;
}): string {
  const params = new URLSearchParams();
  if (opts.sort && opts.sort !== "recent") params.set("sort", opts.sort);
  if (opts.type) params.set("type", opts.type);
  if (opts.itemId) params.set("itemId", opts.itemId);
  if (opts.slot && opts.slot !== "all") params.set("slot", opts.slot);
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.tag?.trim()) params.set("tag", opts.tag.trim());
  const qs = params.toString();
  return qs ? `/discover?${qs}` : "/discover";
}
