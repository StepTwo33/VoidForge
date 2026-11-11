import { RIVEN_MOD_IDS, sanitizeRivenStats } from "@/lib/riven/saved-rivens";
import { RIVEN_MAX_RANK, normalizeRivenPolarity } from "@/lib/riven/riven-validation";

/**
 * Riven Library "Equip": the link carries the whole riven (rolls, polarity, rank, name, library id),
 * and the builder adds it to the build already open in this tab instead of starting a new one.
 */
export interface RivenEquipPayload {
  stats: Record<string, number>;
  polarity: string;
  rank: number;
  name?: string;
  id?: string;
}

/** Any riven card (riven_rifle, kitgun_riven_mod, …). */
export function isRivenModId(id: string): boolean {
  return id.startsWith("riven_") || (RIVEN_MOD_IDS as readonly string[]).includes(id);
}

export const RIVEN_EQUIP_PARAMS = ["riven", "rivenPolarity", "rivenRank", "rivenName", "rivenId"] as const;

export function rivenEquipQuery(r: RivenEquipPayload): string {
  const p = new URLSearchParams();
  p.set("riven", JSON.stringify(r.stats));
  p.set("rivenPolarity", r.polarity);
  p.set("rivenRank", String(r.rank));
  if (r.name) p.set("rivenName", r.name);
  if (r.id) p.set("rivenId", r.id);
  return p.toString();
}

/** Builder link that equips a library riven (weapon, companion, kitgun or zaw builder). */
export function rivenEquipHref(r: {
  weaponId: string;
  weaponType?: string;
  weaponCategory?: string;
  stats: Record<string, number>;
  polarity: string;
  rank?: number;
  name?: string;
  id?: string;
}): string {
  const q = rivenEquipQuery({ stats: r.stats, polarity: r.polarity, rank: r.rank ?? RIVEN_MAX_RANK, name: r.name, id: r.id });
  const w = encodeURIComponent(r.weaponId);
  if (r.weaponType === "Companion") return `/companion-builder?weapon=${w}&${q}`;
  if (r.weaponType === "Kitgun" || r.weaponCategory === "kitgun_chamber") return `/modular-builder?type=kitgun&part=${w}&${q}`;
  if (r.weaponType === "Zaw" || r.weaponCategory === "zaw_strike") return `/modular-builder?type=zaw&part=${w}&${q}`;
  return `/weapon-builder?weapon=${w}&${q}`;
}

/** Reads an Equip link. Old links with only `riven=` still work (rank 8, polarity not chosen). */
export function parseRivenEquip(params: URLSearchParams): RivenEquipPayload | null {
  const raw = params.get("riven");
  if (!raw) return null;
  let stats: Record<string, number> | null = null;
  try {
    stats = sanitizeRivenStats(JSON.parse(raw));
  } catch {
    return null;
  }
  if (!stats) return null;
  const rankRaw = Number(params.get("rivenRank"));
  const rank = params.has("rivenRank") && Number.isFinite(rankRaw)
    ? Math.min(RIVEN_MAX_RANK, Math.max(0, Math.round(rankRaw)))
    : RIVEN_MAX_RANK;
  const name = params.get("rivenName")?.trim().slice(0, 80) || undefined;
  const id = params.get("rivenId")?.trim().slice(0, 100) || undefined;
  return { stats, polarity: normalizeRivenPolarity(params.get("rivenPolarity")), rank, name, id };
}

/** URL without the Equip params (so a refresh does not equip the riven again). */
export function stripRivenEquipParams(href: string): string {
  const url = new URL(href, "http://x");
  for (const k of RIVEN_EQUIP_PARAMS) url.searchParams.delete(k);
  const qs = url.searchParams.toString();
  return `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`;
}

export interface PlaceableMod {
  modId: string;
  modName: string;
  rank: number;
  slotIndex: number;
  polarity?: string;
  drain?: number;
  rivenId?: string;
}

/**
 * Puts a riven into a build: it takes the slot of a riven already there (a weapon holds one),
 * else the first empty regular slot, else the last regular slot (the replaced mod is reported).
 */
export function placeRiven<T extends PlaceableMod>(
  mods: readonly T[],
  rivenStats: Readonly<Record<number, Record<string, number>>>,
  riven: RivenEquipPayload & { modId: string; fallbackName: string; catalogDrain?: number },
  opts: { regularSlots: number; isRivenModId: (id: string) => boolean },
): { mods: T[]; rivenStats: Record<number, Record<string, number>>; slotIndex: number; replaced?: T } {
  const slots = Math.max(1, opts.regularSlots);
  const existing = mods.find((m) => opts.isRivenModId(m.modId) && m.slotIndex < slots)
    ?? mods.find((m) => opts.isRivenModId(m.modId));
  let slotIndex: number;
  let replaced: T | undefined;
  if (existing) {
    slotIndex = existing.slotIndex;
  } else {
    const used = new Set(mods.map((m) => m.slotIndex));
    const free = Array.from({ length: slots }, (_, i) => i).find((i) => !used.has(i));
    slotIndex = free ?? slots - 1;
    if (free == null) replaced = mods.find((m) => m.slotIndex === slotIndex);
  }
  const next = mods.filter((m) => m.slotIndex !== slotIndex && !opts.isRivenModId(m.modId));
  const entry = {
    modId: riven.modId,
    modName: riven.name || riven.fallbackName,
    rank: riven.rank,
    slotIndex,
    polarity: normalizeRivenPolarity(riven.polarity),
    drain: riven.catalogDrain,
    ...(riven.id ? { rivenId: riven.id } : {}),
  } as unknown as T;
  const stats: Record<number, Record<string, number>> = {};
  for (const [k, v] of Object.entries(rivenStats)) {
    const i = Number(k);
    if (next.some((m) => m.slotIndex === i)) stats[i] = v;
  }
  stats[slotIndex] = riven.stats;
  return { mods: [...next, entry], rivenStats: stats, slotIndex, replaced };
}

/** Per-tab draft of the build open in a builder, so leaving for the Riven Library and coming back keeps it. */
export interface BuilderDraft<D> {
  itemId: string;
  buildId: string | null;
  name: string;
  description: string;
  isPublic: boolean;
  tags: string[];
  createdAt: number | null;
  data: D;
}

const draftKey = (kind: string) => `voidforge:builder-draft:${kind}`;

export function saveBuilderDraft<D>(kind: string, draft: BuilderDraft<D> | null): void {
  try {
    if (!draft) sessionStorage.removeItem(draftKey(kind));
    else sessionStorage.setItem(draftKey(kind), JSON.stringify(draft));
  } catch {
    // storage full / disabled: Equip then starts from an empty build, as before
  }
}

export function readBuilderDraft<D>(kind: string): BuilderDraft<D> | null {
  try {
    const raw = sessionStorage.getItem(draftKey(kind));
    if (!raw) return null;
    const d = JSON.parse(raw) as BuilderDraft<D>;
    return d && typeof d.itemId === "string" && d.data ? d : null;
  } catch {
    return null;
  }
}
