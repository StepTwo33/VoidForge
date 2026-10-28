/**
 * Pure helpers behind the "Import mods" dialog: parse a pasted / OCR'd mod list into lines (with
 * optional ranks), match each line to a catalog mod, and turn the matches into a placement plan.
 *
 * Nothing here touches React, the DOM or the calculators. Matching only decides WHICH catalog mod a
 * pasted line means; it never changes a mod's data. Order of preference (each step only runs when the
 * previous one found nothing):
 *   1. exact name (case / spacing / punctuation insensitive)
 *   2. old name of a renamed or retired mod (Repelling Bastille -> Enduring Bastille)
 *   3. one small typo or a transposition ("split chmaber")
 *   4. a unique partial name ("Hammer" -> Hammer Shot, only when exactly one mod fits)
 * Several equally good mods = ambiguous (the player picks); no good mod = unmatched.
 */
import type { EquippedMod, Mod } from "@/lib/types";
import { areModsIncompatible } from "@/data/mod-exclusions";
import {
  RENAMED_MOD_IDS,
  RENAMED_MOD_OLD_NAMES,
  RENAMED_MOD_UPDATE,
  RETIRED_MODS,
  type RetiredModReason,
} from "@/lib/mods/known-mods";

/** A paste longer than this is cut (and the player is told). */
export const MAX_IMPORT_CHARS = 20_000;
/** More mod lines than this is never a real mod list (a full warframe build is 10). */
export const MAX_IMPORT_LINES = 60;

/* ------------------------------------------------------------------ parsing */

export interface ParsedModLine {
  /** 0-based position among the parsed (non-blank) lines. */
  index: number;
  /** The text as pasted (trimmed). */
  raw: string;
  /** Mod name with bullets, numbering, quantity and rank text removed. */
  name: string;
  /** Rank the player wrote (R10, "rank 5", 5/5, [10] ...) or null when none was written. */
  rank: number | null;
}

export interface ParsedModList {
  lines: ParsedModLine[];
  /** Non-blank lines beyond MAX_IMPORT_LINES that were ignored. */
  extraLines: number;
  /** Text beyond MAX_IMPORT_CHARS that was ignored. */
  textCut: boolean;
}

const BULLET_RE = /^\s*(?:[-*•·▪►>●○]+|\d{1,2}[.)]|#\d{1,2}|slot\s*\d{1,2}\s*[:.)-]?)\s+/i;
const QTY_PREFIX_RE = /^\d{1,2}\s*[x×]\s+/i;
const QTY_SUFFIX_RE = /\s+[x×]\s*\d{1,2}$/i;
const RANK_WORD = "(?:rank|rk|lvl|lv|level|r)";
const RANK_PATTERNS: RegExp[] = [
  // "Serration (rank 10)", "Serration [10]", "Serration (5/5)"
  new RegExp(`\\s*[(\\[]\\s*${RANK_WORD}?\\s*[:.]?\\s*(\\d{1,2})(?:\\s*/\\s*\\d{1,2})?\\s*[)\\]]\\s*$`, "i"),
  // "Serration - rank 10", "Serration: R10", "Serration R10"
  new RegExp(`\\s*(?:[:\\-–—]\\s*|\\s)${RANK_WORD}\\s*[:.]?\\s*(\\d{1,2})(?:\\s*/\\s*\\d{1,2})?\\s*$`, "i"),
  // "Serration 10/10"
  /\s+(\d{1,2})\s*\/\s*\d{1,2}\s*$/,
  // "Serration: 10", "Serration - 10"
  /\s*[:\-–—]\s*(\d{1,2})\s*$/,
  // "Serration 10" (mod names never end in a number)
  /\s+(\d{1,2})\s*$/,
];
const RANK_ONLY_RE = new RegExp(`^(?:${RANK_WORD}\\s*[:.]?\\s*)?(\\d{1,2})(?:\\s*/\\s*\\d{1,2})?$`, "i");
const LEADING_RANK_RE = /^(?:rank|rk|lvl|level)\s*[:.]?\s*(\d{1,2})\s+/i;

function cleanEdges(s: string): string {
  return s
    .replace(/^[\s"'“”‘’`.:;,\-–—|]+/, "")
    .replace(/[\s"'“”‘’`.:;,\-–—|]+$/, "")
    .replace(/\s+/g, " ");
}

/** Split one line into a mod name and an optional rank. Exported for tests. */
export function parseModLine(rawLine: string): { name: string; rank: number | null } {
  let s = rawLine.replace(/\t+/g, " ").trim();
  s = s.replace(BULLET_RE, "");
  s = s.replace(QTY_PREFIX_RE, "");
  let rank: number | null = null;
  const lead = s.match(LEADING_RANK_RE);
  if (lead) {
    rank = Number(lead[1]);
    s = s.slice(lead[0].length);
  }
  s = s.replace(QTY_SUFFIX_RE, "");
  if (rank === null) {
    for (const re of RANK_PATTERNS) {
      const m = s.match(re);
      if (m && m.index !== undefined && m.index > 0) {
        rank = Number(m[1]);
        s = s.slice(0, m.index);
        break;
      }
    }
  }
  return { name: cleanEdges(s), rank };
}

/**
 * Parse pasted text (or OCR output) into mod lines. Lines are split on newlines, commas, semicolons
 * and table bars; a cell that is only a rank ("10", "R5", "5/5") is attached to the line before it.
 */
export function parseModList(text: string): ParsedModList {
  const textCut = text.length > MAX_IMPORT_CHARS;
  const body = textCut ? text.slice(0, MAX_IMPORT_CHARS) : text;
  const cells = body.split(/[\r\n,;|]+/).map((c) => c.trim()).filter(Boolean);

  const parsed: { raw: string; name: string; rank: number | null }[] = [];
  for (const cell of cells) {
    const rankOnly = cell.match(RANK_ONLY_RE);
    if (rankOnly && parsed.length > 0 && parsed[parsed.length - 1].rank === null) {
      parsed[parsed.length - 1].rank = Number(rankOnly[1]);
      continue;
    }
    const { name, rank } = parseModLine(cell);
    if (!name || !/\p{L}/u.test(name)) continue;
    parsed.push({ raw: cell, name, rank });
  }
  const kept = parsed.slice(0, MAX_IMPORT_LINES);
  return {
    lines: kept.map((l, index) => ({ index, ...l })),
    extraLines: Math.max(0, parsed.length - kept.length),
    textCut,
  };
}

/* ----------------------------------------------------------------- matching */

export function normalizeModName(s: string): string {
  return s
    .replace(/[™®©]/g, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’`´"]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const squash = (norm: string) => norm.replace(/ /g, "");

/** Optimal-string-alignment distance (insert / delete / substitute / adjacent swap), capped. */
export function editDistance(a: string, b: string, cap = 4): number {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const m = a.length;
  const n = b.length;
  let prev2: number[] = [];
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
    }
    prev2 = prev;
    prev = cur;
  }
  return prev[n];
}

/** Largest typo we accept for a name of this (space-less) length. */
export function maxTypoDistance(len: number): number {
  if (len <= 4) return 0;
  if (len <= 8) return 1;
  return 2;
}

interface IndexEntry {
  mod: Mod;
  norm: string;
  sq: string;
  tokens: string[];
}

export interface ModIndex {
  entries: IndexEntry[];
  byNorm: Map<string, Mod>;
  bySquash: Map<string, Mod>;
  byId: Map<string, Mod>;
}

export function buildModIndex(mods: readonly Mod[]): ModIndex {
  const entries: IndexEntry[] = mods.map((mod) => {
    const norm = normalizeModName(mod.name);
    return { mod, norm, sq: squash(norm), tokens: norm.split(" ") };
  });
  const byNorm = new Map<string, Mod>();
  const bySquash = new Map<string, Mod>();
  const byId = new Map<string, Mod>();
  for (const e of entries) {
    if (!byNorm.has(e.norm)) byNorm.set(e.norm, e.mod);
    if (!bySquash.has(e.sq)) bySquash.set(e.sq, e.mod);
    byId.set(e.mod.id, e.mod);
  }
  return { entries, byNorm, bySquash, byId };
}

export type MatchKind = "exact" | "renamed" | "typo" | "partial";

interface Lookup {
  mod: Mod | null;
  kind: MatchKind | null;
  /** Equally plausible mods when the lookup could not choose one. */
  candidates: Mod[];
}

const NONE: Lookup = { mod: null, kind: null, candidates: [] };

function tokensPrefixMatch(queryTokens: string[], entryTokens: string[]): boolean {
  return queryTokens.every((q) => entryTokens.some((t) => t === q || (q.length >= 3 && t.startsWith(q))));
}

/** Look one pasted name up in one index (no rename / retired handling). */
function lookupIn(name: string, index: ModIndex): Lookup {
  const norm = normalizeModName(name);
  if (!norm) return NONE;
  const exact = index.byNorm.get(norm) ?? index.bySquash.get(squash(norm));
  if (exact) return { mod: exact, kind: "exact", candidates: [] };

  const sq = squash(norm);
  const cap = maxTypoDistance(sq.length);
  if (cap > 0) {
    let best = cap + 1;
    let hits: Mod[] = [];
    for (const e of index.entries) {
      const d = editDistance(sq, e.sq, cap);
      if (d > cap) continue;
      if (d < best) {
        best = d;
        hits = [e.mod];
      } else if (d === best) hits.push(e.mod);
    }
    if (hits.length === 1) return { mod: hits[0], kind: "typo", candidates: [] };
    if (hits.length > 1) return { mod: null, kind: null, candidates: hits.slice(0, 6) };
  }

  if (sq.length >= 4) {
    const qTokens = norm.split(" ");
    const partial = index.entries
      .filter((e) => e.sq.includes(sq) || tokensPrefixMatch(qTokens, e.tokens))
      .map((e) => e.mod);
    if (partial.length === 1) return { mod: partial[0], kind: "partial", candidates: [] };
    if (partial.length > 1) {
      partial.sort((a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name));
      return { mod: null, kind: null, candidates: partial.slice(0, 6) };
    }
  }
  return NONE;
}

const RENAMED_BY_NAME = new Map<string, string>(
  Object.entries(RENAMED_MOD_OLD_NAMES).map(([oldId, oldName]) => [normalizeModName(oldName), oldId]),
);
const RETIRED_BY_NAME = new Map<string, { name: string; reason: RetiredModReason }>(
  Object.values(RETIRED_MODS).map((r) => [normalizeModName(r.name), r]),
);

export const RETIRED_REASON_TEXT: Record<RetiredModReason, string> = {
  archived: "removed from the game",
  no_source: "not a real mod",
  unreleased: "never released",
  focus_2: "an old Focus 2.0 node",
  conclave: "Conclave (PvP) only",
};

/** Suggest the closest eligible mods for a name nothing matched (for the "Did you mean" buttons). */
export function suggestMods(name: string, index: ModIndex, limit = 5): Mod[] {
  const norm = normalizeModName(name);
  const sq = squash(norm);
  if (sq.length < 3) return [];
  const qTokens = norm.split(" ").filter((t) => t.length >= 3);
  const scored: { mod: Mod; score: number }[] = [];
  for (const e of index.entries) {
    let score = 0;
    const d = editDistance(sq, e.sq, 6);
    if (d <= 6) score = Math.max(score, 1 - d / Math.max(sq.length, e.sq.length));
    if (qTokens.length) {
      const shared = qTokens.filter((q) => e.tokens.some((t) => t === q || (q.length >= 4 && (t.startsWith(q) || q.startsWith(t) && t.length >= 4)))).length;
      score = Math.max(score, (shared / qTokens.length) * 0.75);
    }
    if (score >= 0.45) scored.push({ mod: e.mod, score });
  }
  scored.sort((a, b) => b.score - a.score || a.mod.name.localeCompare(b.mod.name));
  return scored.slice(0, limit).map((s) => s.mod);
}

export type LineStatus =
  | "exact" //      name matched exactly
  | "renamed" //    old name of a renamed mod, matched to the current mod
  | "typo" //       matched after fixing a small typo
  | "partial" //    matched a unique partial name
  | "ambiguous" //  several mods fit, the player must pick
  | "ineligible" // a real mod, but this item can't equip it
  | "retired" //    a mod that no longer exists
  | "unmatched"; // nothing close

export interface MatchedLine {
  line: ParsedModLine;
  status: LineStatus;
  /** The matched mod (exact / renamed / typo / partial), or the real-but-ineligible mod. */
  mod: Mod | null;
  /** Ambiguous: the mods to choose from. Unmatched: "did you mean" suggestions. */
  candidates: Mod[];
  /** Short explanation shown under the line. */
  note: string | null;
}

export interface ImportContext {
  /** Every catalog mod (used to say WHY a real mod can't be imported). */
  catalog: readonly Mod[];
  /** Same eligibility the in-builder mod picker uses for a regular slot. */
  isEligible: (mod: Mod) => boolean;
  /** Why a real mod doesn't fit this item. */
  explainIneligible?: (mod: Mod) => string;
  itemName: string;
}

export function defaultExplainIneligible(mod: Mod, itemName: string): string {
  if (mod.category === "conclave") return "Conclave (PvP) only";
  if (mod.subCategory === "riven") return "Rivens can't be imported (their stats aren't in a name list), add it from the mod picker";
  return `${mod.name} can't be equipped on ${itemName}`;
}

export interface MatchSession {
  ctx: ImportContext;
  pool: ModIndex;
  catalog: ModIndex;
}

export function createMatchSession(ctx: ImportContext): MatchSession {
  const pool = buildModIndex(ctx.catalog.filter(ctx.isEligible));
  const catalog = buildModIndex(ctx.catalog);
  return { ctx, pool, catalog };
}

function whyIneligible(mod: Mod, ctx: ImportContext): string {
  return ctx.explainIneligible?.(mod) ?? defaultExplainIneligible(mod, ctx.itemName);
}

const KIND_NOTE: Record<"typo" | "partial", string> = {
  typo: "Spelling corrected. Check it's the mod you meant",
  partial: "Only one mod fits this partial name. Check it's the mod you meant",
};

export function matchModLine(line: ParsedModLine, session: MatchSession): MatchedLine {
  const { ctx, pool, catalog } = session;
  const base = { line, candidates: [] as Mod[] };

  // 1. exact (any rank of typo / partial logic comes later)
  const norm = normalizeModName(line.name);
  const exactPool = pool.byNorm.get(norm) ?? pool.bySquash.get(squash(norm));
  if (exactPool) return { ...base, status: "exact", mod: exactPool, note: null };

  // 2. renamed / retired by name, before any fuzzy guess
  const renamedFrom = RENAMED_BY_NAME.get(norm);
  if (renamedFrom) {
    const target = catalog.byId.get(RENAMED_MOD_IDS[renamedFrom]);
    if (target) {
      const update = RENAMED_MOD_UPDATE[renamedFrom];
      const note = `"${RENAMED_MOD_OLD_NAMES[renamedFrom]}" is now ${target.name}${update ? ` (${update})` : ""}`;
      if (pool.byId.has(target.id)) return { ...base, status: "renamed", mod: target, note };
      return { ...base, status: "ineligible", mod: target, note: `${note}, but ${whyIneligible(target, ctx)}` };
    }
  }
  const retired = RETIRED_BY_NAME.get(norm);
  if (retired && !catalog.byNorm.has(norm)) {
    return { ...base, status: "retired", mod: null, note: `${retired.name} is ${RETIRED_REASON_TEXT[retired.reason]}` };
  }

  // 3 / 4. typo and partial matches among mods this item can equip
  const hit = lookupIn(line.name, pool);
  if (hit.mod && hit.kind && hit.kind !== "exact") {
    return { ...base, status: hit.kind === "typo" ? "typo" : "partial", mod: hit.mod, note: KIND_NOTE[hit.kind === "typo" ? "typo" : "partial"] };
  }
  if (hit.candidates.length > 1) {
    return { ...base, status: "ambiguous", mod: null, candidates: hit.candidates, note: "Several mods fit. Pick one" };
  }

  // A real mod that this item can't equip?
  const other = lookupIn(line.name, catalog);
  if (other.mod) {
    return { ...base, status: "ineligible", mod: other.mod, note: whyIneligible(other.mod, ctx) };
  }
  const suggestions = suggestMods(line.name, pool);
  return {
    ...base,
    status: "unmatched",
    mod: null,
    candidates: suggestions,
    note: suggestions.length ? "Not a mod name we know. Did you mean:" : "Not a mod name we know",
  };
}

export function matchModList(lines: readonly ParsedModLine[], session: MatchSession): MatchedLine[] {
  return lines.map((l) => matchModLine(l, session));
}

/* ------------------------------------------------------------------ planning */

export type ImportMode = "replace" | "fill";

export type SkipReason =
  | "unmatched"
  | "ambiguous"
  | "ineligible"
  | "retired"
  | "duplicate"
  | "conflict"
  | "no_slot"
  | "skipped";

export interface PlanRow {
  matched: MatchedLine;
  /** The mod that will be equipped, or null. */
  mod: Mod | null;
  rank: number | null;
  rankNote: string | null;
  slotIndex: number | null;
  /** Set when the row is NOT imported. */
  skip: SkipReason | null;
  skipNote: string | null;
}

export interface PlanOptions {
  mode: ImportMode;
  /** Regular slot indexes, in fill order. */
  regularSlots: readonly number[];
  /** Aura slot indexes (warframes); mods for which `isAura` is true go here. */
  auraSlots?: readonly number[];
  isAura?: (mod: Mod) => boolean;
  /** What is equipped now (used by "fill" to keep it and to avoid clashes). */
  existing?: readonly EquippedMod[];
  /** Player's choice per line index: a mod id to use instead, or "skip". */
  overrides?: Readonly<Record<number, string | "skip">>;
  /** Looks a mod up by id for overrides (defaults to the match session's catalog). */
  modById?: (id: string) => Mod | undefined;
}

export interface ImportPlan {
  rows: PlanRow[];
  /** The mods that will be added (not including kept existing mods). */
  added: EquippedMod[];
  /** Full list for the build after the import. */
  result: EquippedMod[];
  importedCount: number;
  skippedCount: number;
  /** How many equipped mods a "replace" import removes (0 for fill). */
  replacedCount: number;
}

export const SKIP_LABEL: Record<SkipReason, string> = {
  unmatched: "Not recognised",
  ambiguous: "Pick one",
  ineligible: "Doesn't fit this item",
  retired: "No longer in the game",
  duplicate: "Duplicate",
  conflict: "Conflicts",
  no_slot: "No free slot",
  skipped: "Skipped",
};

export function buildImportPlan(matched: readonly MatchedLine[], session: MatchSession, opts: PlanOptions): ImportPlan {
  const existing = opts.mode === "fill" ? [...(opts.existing ?? [])] : [];
  const usedSlots = new Set(existing.map((m) => m.slotIndex));
  const acceptedIds: string[] = existing.map((m) => m.modId);
  const idToName = (id: string) => session.catalog.byId.get(id)?.name ?? id;
  const modById = opts.modById ?? ((id: string) => session.catalog.byId.get(id));
  const added: EquippedMod[] = [];

  const rows: PlanRow[] = matched.map((m) => {
    const row: PlanRow = { matched: m, mod: null, rank: null, rankNote: null, slotIndex: null, skip: null, skipNote: null };
    const override = opts.overrides?.[m.line.index];
    let mod: Mod | null = null;

    if (override === "skip") {
      row.skip = "skipped";
      row.skipNote = "You chose to skip this line";
      return row;
    }
    if (override) {
      const picked = modById(override);
      if (picked && session.pool.byId.has(picked.id)) mod = picked;
    } else if (m.status === "exact" || m.status === "renamed" || m.status === "typo" || m.status === "partial") {
      mod = m.mod;
    }

    if (!mod) {
      row.skip = m.status === "ambiguous" ? "ambiguous" : m.status === "ineligible" ? "ineligible" : m.status === "retired" ? "retired" : "unmatched";
      row.skipNote = m.note;
      return row;
    }
    row.mod = mod;

    // rank
    const wanted = m.line.rank;
    if (wanted === null) {
      row.rank = mod.maxRank;
      row.rankNote = "No rank given, using max rank";
    } else if (wanted > mod.maxRank) {
      row.rank = mod.maxRank;
      row.rankNote = `Rank ${wanted} is above this mod's max, using ${mod.maxRank}`;
    } else {
      row.rank = wanted;
    }

    // duplicates / conflicts
    if (acceptedIds.includes(mod.id)) {
      row.skip = "duplicate";
      row.skipNote = opts.mode === "fill" && existing.some((e) => e.modId === mod!.id) ? "Already equipped on this build" : "Already listed above";
      return row;
    }
    const blocker = acceptedIds.find((id) => areModsIncompatible(id, mod!.id));
    if (blocker) {
      row.skip = "conflict";
      row.skipNote = `Can't be equipped together with ${idToName(blocker)}`;
      return row;
    }

    // slot
    const aura = opts.isAura?.(mod) ?? false;
    const pool = aura ? (opts.auraSlots ?? []) : opts.regularSlots;
    const slot = pool.find((s) => !usedSlots.has(s));
    if (slot === undefined) {
      row.skip = "no_slot";
      row.skipNote = aura ? "The Aura slot is already taken" : `All ${opts.regularSlots.length} mod slots are full`;
      return row;
    }
    usedSlots.add(slot);
    acceptedIds.push(mod.id);
    row.slotIndex = slot;
    added.push({ modId: mod.id, modName: mod.name, rank: row.rank, slotIndex: slot, polarity: mod.polarity, drain: mod.drain });
    return row;
  });

  const importedCount = added.length;
  return {
    rows,
    added,
    result: opts.mode === "fill" ? [...existing, ...added] : added,
    importedCount,
    skippedCount: rows.length - importedCount,
    replacedCount: opts.mode === "replace" ? (opts.existing?.length ?? 0) : 0,
  };
}
