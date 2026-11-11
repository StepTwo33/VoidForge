import { RIVEN_MOD_IDS, sanitizeRivenStats } from "@/lib/riven/saved-rivens";
import { RIVEN_MAX_RANK, normalizeRivenPolarity, rivenDrainFromRank } from "@/lib/riven/riven-validation";
import type { ModSlot } from "@/lib/types";
import { getRivenFamilyWeaponIds } from "@/lib/weapons/riven-family";
import { getRivenModIdForWeapon } from "@/lib/weapons/riven-weapon-type";

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

/** Regular (non-Exilus / non-posture) slots a riven may occupy. */
export const RIVEN_REGULAR_SLOTS = 8;

export function rivenEquipQuery(r: RivenEquipPayload): string {
  const p = new URLSearchParams();
  p.set("riven", JSON.stringify(r.stats));
  p.set("rivenPolarity", r.polarity);
  p.set("rivenRank", String(r.rank));
  if (r.name) p.set("rivenName", r.name);
  if (r.id) p.set("rivenId", r.id);
  return p.toString();
}

export type BuilderDraftKind = "weapon" | "companion" | "modular";

export const BUILDER_DRAFT_KINDS: readonly BuilderDraftKind[] = ["companion", "modular", "weapon"];

export interface BuilderDraftLoadout {
  loadoutId: string;
  loadoutName: string;
  kind: string;
  slot: string;
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
  /** `loadout` / `slot` query to put back on the builder URL after Equip. */
  returnSearch?: string;
  loadout?: BuilderDraftLoadout;
}

export type RivenCatalogWeapon = {
  name: string;
  category: string;
  hasRivenSlot?: boolean;
  kitgunChamberCategory?: string;
  arcaneType?: string;
  id?: string;
};

/**
 * Why Equip must not run for this weapon, or null when it can take a riven.
 * Exalted weapons, Garuda's Talons, amps, arch-melee and beast claws cannot.
 */
export function rivenCannotEquipReason(
  weapon?: RivenCatalogWeapon | null,
  fallbackName?: string,
): string | null {
  if (!weapon) return null;
  if (getRivenModIdForWeapon(weapon)) return null;
  const name = weapon.name?.trim() || fallbackName?.trim() || "This weapon";
  return `${name} cannot use Rivens.`;
}

export type RivenEquipLinkInput = {
  weaponId: string;
  weaponType?: string;
  weaponCategory?: string;
  weaponName?: string;
  stats: Record<string, number>;
  polarity: string;
  rank?: number;
  name?: string;
  id?: string;
};

export type RivenEquipDrafts = Partial<Record<BuilderDraftKind, BuilderDraft<unknown> | null>>;

/** True when a draft's item is this riven's weapon or a variant that takes the same riven. */
export function draftMatchesRivenWeapon(itemId: string | undefined, weaponId: string): boolean {
  if (!itemId || !weaponId) return false;
  if (itemId === weaponId) return true;
  const family = new Set([weaponId, ...getRivenFamilyWeaponIds(weaponId)]);
  if (family.has(itemId)) return true;
  // Assembled kitgun/zaw ids are resolved from the draft item as well.
  return getRivenFamilyWeaponIds(itemId).includes(weaponId);
}

/** Which open builder should receive this riven (more specific builders first). */
export function matchingDraftKind(weaponId: string, drafts: RivenEquipDrafts | undefined): BuilderDraftKind | null {
  if (!drafts) return null;
  for (const kind of BUILDER_DRAFT_KINDS) {
    const draft = drafts[kind];
    if (draft && draftMatchesRivenWeapon(draft.itemId, weaponId)) return kind;
  }
  return null;
}

function defaultBuilderPath(r: Pick<RivenEquipLinkInput, "weaponId" | "weaponType" | "weaponCategory">): string {
  const w = encodeURIComponent(r.weaponId);
  if (r.weaponType === "Companion") return `/companion-builder?weapon=${w}`;
  if (r.weaponType === "Kitgun" || r.weaponCategory === "kitgun_chamber") return `/modular-builder?type=kitgun&part=${w}`;
  if (r.weaponType === "Zaw" || r.weaponCategory === "zaw_strike") return `/modular-builder?type=zaw&part=${w}`;
  return `/weapon-builder?weapon=${w}`;
}

function pathForKind(kind: BuilderDraftKind, r: Pick<RivenEquipLinkInput, "weaponId" | "weaponType" | "weaponCategory">, itemId: string): string {
  const w = encodeURIComponent(itemId || r.weaponId);
  if (kind === "companion") return `/companion-builder?weapon=${w}`;
  if (kind === "modular") {
    if (r.weaponType === "Zaw" || r.weaponCategory === "zaw_strike") return `/modular-builder?type=zaw&part=${w}`;
    return `/modular-builder?type=kitgun&part=${w}`;
  }
  return `/weapon-builder?weapon=${w}`;
}

/** Keep only loadout edit params so Equip can restore the "editing this loadout" banner. */
export function builderReturnSearch(search: string): string | undefined {
  const p = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out = new URLSearchParams();
  const loadout = p.get("loadout");
  const slot = p.get("slot");
  if (loadout) out.set("loadout", loadout);
  if (slot) out.set("slot", slot);
  const s = out.toString();
  return s || undefined;
}

export function appendReturnSearch(href: string, returnSearch?: string): string {
  if (!returnSearch) return href;
  const url = new URL(href, "http://x");
  const extra = new URLSearchParams(returnSearch.startsWith("?") ? returnSearch.slice(1) : returnSearch);
  for (const [k, v] of extra) {
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
  }
  const qs = url.searchParams.toString();
  return `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`;
}

export function loadoutFieldsForDraft(
  ctx: BuilderDraftLoadout | null | undefined,
  search?: string,
): Pick<BuilderDraft<unknown>, "returnSearch" | "loadout"> {
  const fromArg = search != null ? builderReturnSearch(search) : undefined;
  const fromWindow =
    fromArg === undefined && typeof window !== "undefined"
      ? builderReturnSearch(window.location.search)
      : undefined;
  const returnSearch = fromArg ?? fromWindow;
  return {
    ...(returnSearch ? { returnSearch } : {}),
    ...(ctx
      ? { loadout: { loadoutId: ctx.loadoutId, loadoutName: ctx.loadoutName, kind: ctx.kind, slot: ctx.slot } }
      : {}),
  };
}

/** Reads drafts from this tab (empty when storage is unavailable). */
export function readAllBuilderDrafts(): RivenEquipDrafts {
  return {
    weapon: readBuilderDraft("weapon"),
    companion: readBuilderDraft("companion"),
    modular: readBuilderDraft("modular"),
  };
}

/**
 * Builder link that equips a library riven. When a matching build is open in this tab
 * (weapon, companion or modular), the link returns to that builder so the riven is added
 * to that build. Weapons that cannot take rivens should be blocked by {@link rivenCannotEquipReason}
 * before following the link.
 */
export function rivenEquipHref(r: RivenEquipLinkInput, opts?: { drafts?: RivenEquipDrafts }): string {
  const q = rivenEquipQuery({ stats: r.stats, polarity: r.polarity, rank: r.rank ?? RIVEN_MAX_RANK, name: r.name, id: r.id });
  const drafts = opts?.drafts ?? (typeof window !== "undefined" ? readAllBuilderDrafts() : undefined);
  const kind = matchingDraftKind(r.weaponId, drafts);
  const draft = kind && drafts ? drafts[kind] : undefined;
  const base = kind && draft
    ? pathForKind(kind, r, draft.itemId || r.weaponId)
    : defaultBuilderPath(r);
  const sep = base.includes("?") ? "&" : "?";
  return appendReturnSearch(`${base}${sep}${q}`, draft?.returnSearch);
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

/** Place a library riven onto saved {@link ModSlot}s, keeping other mods and writing riven fields. */
export function placeLibraryRivenOnMods(
  mods: readonly ModSlot[],
  riven: RivenEquipPayload & { modId: string; fallbackName: string; catalogDrain?: number },
  regularSlots: number = RIVEN_REGULAR_SLOTS,
): { mods: ModSlot[]; slotIndex: number; replaced?: ModSlot } {
  const baseStats: Record<number, Record<string, number>> = {};
  for (const m of mods) {
    if (m.rivenStats) baseStats[m.slotIndex] = m.rivenStats;
  }
  const placed = placeRiven(
    mods.map((m) => ({
      modId: m.modId,
      modName: m.rivenName || m.modId,
      rank: m.rank,
      slotIndex: m.slotIndex,
      ...(m.rivenId ? { rivenId: m.rivenId } : {}),
    })),
    baseStats,
    riven,
    { regularSlots, isRivenModId },
  );
  const bySlot = new Map(mods.map((m) => [m.slotIndex, m]));
  const next: ModSlot[] = placed.mods.map((m) => {
    if (m.slotIndex !== placed.slotIndex) {
      const prev = bySlot.get(m.slotIndex);
      return prev ?? { modId: m.modId, rank: m.rank, slotIndex: m.slotIndex };
    }
    return {
      modId: m.modId,
      rank: m.rank,
      slotIndex: m.slotIndex,
      rivenStats: riven.stats,
      rivenPolarity: riven.polarity,
      rivenDrain: rivenDrainFromRank(riven.rank),
      ...(riven.name ? { rivenName: riven.name } : {}),
      ...(riven.id ? { rivenId: riven.id } : {}),
    };
  });
  const replaced = placed.replaced ? bySlot.get(placed.replaced.slotIndex) ?? undefined : undefined;
  return { mods: next, slotIndex: placed.slotIndex, replaced };
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
