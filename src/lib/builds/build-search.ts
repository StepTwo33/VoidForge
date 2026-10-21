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

  return typoScore(name, q, qWords);
}

/** Minimum query length before one-typo matches are allowed (avoids noise on short queries). */
const TYPO_MIN_LENGTH = 4;

/** True when a and b differ by at most one insertion, deletion, substitution or adjacent swap. */
export function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  while (i < la && i < lb && a[i] === b[i]) i++;
  if (la === lb) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true; // substitution
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // swap
  }
  return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1); // deletion / insertion
}

/** One-typo fallback, always ranked below exact, prefix and substring matches (≤ 200). */
function typoScore(name: string, q: string, qWords: string[]): number {
  if (q.length < TYPO_MIN_LENGTH) return 0;
  if (withinOneEdit(name, q)) return 200;
  const nameWords = name.split(" ");
  const wordHit = (w: string) =>
    nameWords.some((nw) => nw.startsWith(w) || (w.length >= TYPO_MIN_LENGTH && withinOneEdit(nw, w)));
  if (qWords.length === 1) {
    return nameWords.some((nw) => withinOneEdit(nw, q)) ? 150 : 0;
  }
  // Multi-word: every word matches a name word, and at most one of them needed a typo fix.
  let typos = 0;
  for (const w of qWords) {
    if (nameWords.some((nw) => nw.startsWith(w))) continue;
    if (!wordHit(w)) return 0;
    typos++;
  }
  return typos <= 1 ? 120 : 0;
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
