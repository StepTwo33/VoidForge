import { allWeapons } from "@/data/weapons";
import type { Weapon } from "@/lib/types";
import { getRivenWeaponType, type RivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import {
  getEffectiveRivenWeaponType,
  getBaseRivenWeapons,
  getRivenBaseWeapon,
  type ExtendedRivenWeaponType,
} from "@/lib/weapons/riven-family";
import {
  evaluateRiven,
  getRivenGrade,
  getGradeColor,
  getStatsWithDisposition,
  getNegativeStatsWithDisposition,
  STANDARD_RIVEN_DISPOSITION,
  type RivenMod,
  type RivenStat,
} from "@/lib/calc/riven-calculator";
import { formatRivenName } from "@/lib/calc/riven-naming";
import { getRivenStatsForCategory } from "@/lib/types";

export interface SavedRivenStat {
  key: string;
  label: string;
  value: number; // decimal fraction (1.45 = +145%) or flat units
  isPercent: boolean;
  isCurse?: boolean;
  spliced?: boolean;
}

export interface SavedRiven {
  id: string;
  name: string;
  weaponId: string;
  weaponName: string;
  weaponCategory: string;
  weaponType: ExtendedRivenWeaponType;
  statPoolCategory?: string;
  polarity: string;
  rank: number; // 0-8
  rerolls: number;
  masteryRank: number; // 8-16
  /** Builder-compatible stat map: positive values for buffs, negative for curses */
  stats: Record<string, number>;
  displayStats: SavedRivenStat[];
  score: number;
  grade: string;
  gradeColor: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "framehub_riven_library";

export function generateRivenId(): string {
  return `riven_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/** Turn messy stored stats (object, array of {key,value}, or array of single-key objects) into a map. */
export function coerceRivenStats(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (raw == null) return out;
  const absorb = (key: unknown, value: unknown) => {
    if (typeof key !== "string" || !key) return;
    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
    if (Number.isFinite(n)) out[key] = n;
  };
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      if ("key" in row && "value" in row) {
        absorb(row.key, row.value);
        continue;
      }
      for (const [k, v] of Object.entries(row)) {
        if (k === "isCurse" || k === "isPercent" || k === "spliced" || k === "label") continue;
        absorb(k, v);
      }
    }
    return out;
  }
  if (typeof raw === "object") {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) absorb(k, v);
  }
  return out;
}

/** Keep only well-formed display rows; missing or non-array input becomes []. */
export function coerceDisplayStats(raw: unknown): SavedRivenStat[] {
  if (!Array.isArray(raw)) return [];
  const out: SavedRivenStat[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const s = item as Partial<SavedRivenStat> & { value?: unknown };
    const value = typeof s.value === "number" ? s.value : typeof s.value === "string" ? Number(s.value) : NaN;
    if (!Number.isFinite(value)) continue;
    const key = typeof s.key === "string" ? s.key : "";
    const label = typeof s.label === "string" && s.label ? s.label : key || "Stat";
    out.push({
      key,
      label,
      value,
      isPercent: s.isPercent !== false,
      isCurse: !!s.isCurse || value < 0,
      spliced: !!s.spliced,
    });
  }
  return out;
}

/**
 * Repair or drop a stored riven so the library can render it. Returns null only when there is
 * no usable id (complete garbage). Missing displayStats are rebuilt from stats when possible;
 * a card with no readable stats still returns so the player can delete it.
 */
export function normalizeSavedRiven(raw: unknown): SavedRiven | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" && r.id.trim() ? r.id.trim() : "";
  if (!id) return null;

  const stats = coerceRivenStats(r.stats);
  let displayStats = coerceDisplayStats(r.displayStats);
  let score = typeof r.score === "number" && Number.isFinite(r.score) ? r.score : 0;
  let grade = typeof r.grade === "string" ? r.grade : "";
  let gradeColor = typeof r.gradeColor === "string" ? r.gradeColor : "";

  if (displayStats.length === 0 && Object.keys(stats).length > 0) {
    try {
      const ev = evaluateSavedRiven(
        String(r.weaponName ?? ""),
        String(r.weaponType ?? "Rifle"),
        stats,
        typeof r.rank === "number" && Number.isFinite(r.rank) ? r.rank : 8,
        typeof r.rerolls === "number" && Number.isFinite(r.rerolls) ? r.rerolls : 0,
        String(r.polarity ?? "madurai"),
      );
      displayStats = ev.displayStats;
      score = ev.score;
      grade = ev.grade;
      gradeColor = ev.color;
    } catch {
      // Card shows an empty-stats fallback.
    }
  }

  const asString = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
  const asNum = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

  return {
    id,
    name: asString(r.name, "Riven"),
    weaponId: asString(r.weaponId, ""),
    weaponName: asString(r.weaponName, ""),
    weaponCategory: asString(r.weaponCategory, ""),
    weaponType: (asString(r.weaponType, "Rifle") as SavedRiven["weaponType"]),
    statPoolCategory: typeof r.statPoolCategory === "string" ? r.statPoolCategory : undefined,
    polarity: asString(r.polarity, "madurai"),
    rank: asNum(r.rank, 8),
    rerolls: asNum(r.rerolls, 0),
    masteryRank: asNum(r.masteryRank, 8),
    stats,
    displayStats,
    score,
    grade,
    gradeColor,
    createdAt: asNum(r.createdAt, 0),
    updatedAt: asNum(r.updatedAt, 0),
  };
}

/** Safe list of rows for a card or canvas — never throws, never returns undefined. */
export function rivenDisplayStats(riven: { displayStats?: SavedRivenStat[] | null } | null | undefined): SavedRivenStat[] {
  return coerceDisplayStats(riven?.displayStats);
}


/** Converts stat key & decimal value to a RivenStat object for grading. */
function toRivenStat(key: string, value: number, category: string, isCurse: boolean, spliced?: boolean): RivenStat {
  const defs = getRivenStatsForCategory(category, { includeSpliced: true });
  const def = defs.find((d) => d.key === key);
  const label = def?.label.replace(" (Spliced)", "") ?? key;
  const isPercent = def ? def.isPercent : true;
  // In riven-calculator, percent stats use 100-based scale (145.0 for 145%)
  const rawMagnitude = isPercent ? Math.abs(value) * 100 : Math.abs(value);
  const signedValue = isCurse ? -rawMagnitude : rawMagnitude;

  return {
    name: label,
    type: isPercent ? "percent" : "integer",
    baseValue: signedValue,
    minValue: signedValue * 0.9,
    maxValue: signedValue * 1.1,
    spliced: !!spliced,
  };
}

export function evaluateSavedRiven(
  weaponName: string,
  weaponType: string,
  stats: Record<string, number>,
  rank = 8,
  rerolls = 0,
  polarity = "madurai",
): { score: number; grade: string; color: string; displayStats: SavedRivenStat[] } {
  const safeStats = coerceRivenStats(stats);
  const defs = getRivenStatsForCategory(weaponType, { includeSpliced: true });
  const positiveRivenStats: RivenStat[] = [];
  let negativeRivenStat: RivenStat | null = null;
  const displayStats: SavedRivenStat[] = [];

  for (const [key, val] of Object.entries(safeStats)) {
    const def = defs.find((d) => d.key === key);
    const label = def ? def.label.replace(" (Spliced)", "") : key;
    const isPercent = def ? def.isPercent : true;
    const isCurse = val < 0;
    const spliced = def?.spliced;

    displayStats.push({
      key,
      label,
      value: val,
      isPercent,
      isCurse,
      spliced,
    });

    const stat = toRivenStat(key, val, weaponType, isCurse, spliced);
    if (isCurse && !negativeRivenStat) {
      negativeRivenStat = stat;
    } else {
      positiveRivenStats.push(stat);
    }
  }

  const rivenObj: RivenMod = {
    weaponName,
    polarity,
    rank,
    rerolls,
    positiveStats: positiveRivenStats,
    negativeStat: negativeRivenStat,
    disposition: STANDARD_RIVEN_DISPOSITION,
  };

  const score = evaluateRiven(rivenObj);
  const grade = getRivenGrade(score);
  const color = getGradeColor(grade);

  return { score, grade, color, displayStats };
}

/**
 * Ids and seed timestamps of the three example rivens older builds wrote into every new library
 * (Torid, Rubico, Ceramic Dagger). They looked like rolls the player owned, so they are no longer
 * seeded. A copy is removed only while it is untouched: same id and the original seed time.
 * Any example the player edited (saving bumps updatedAt) stays theirs.
 */
export const LEGACY_STARTER_SEED: Readonly<Record<string, number>> = {
  starter_torid: 1730000000000,
  starter_rubico: 1730000001000,
  starter_ceramic_dagger: 1730000002000,
};

/** Drops untouched legacy example rivens; everything else is left alone. */
export function stripUntouchedStarters(rivens: SavedRiven[]): SavedRiven[] {
  return rivens.filter((r) => {
    const seededAt = LEGACY_STARTER_SEED[r?.id];
    return seededAt === undefined || r.updatedAt !== seededAt;
  });
}

export function getSavedRivens(): SavedRiven[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed
      .map((row) => normalizeSavedRiven(row))
      .filter((row): row is SavedRiven => row !== null);
    const rivens = stripUntouchedStarters(normalized);
    if (rivens.length !== parsed.length) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rivens));
      } catch {
        // Read-only storage: just hide them this time.
      }
    }
    return rivens;
  } catch {
    return [];
  }
}

export function saveRiven(riven: SavedRiven): void {
  const rivens = getSavedRivens();
  const index = rivens.findIndex((r) => r.id === riven.id);
  const now = Date.now();
  if (index >= 0) {
    rivens[index] = { ...riven, updatedAt: now };
  } else {
    rivens.unshift({ ...riven, createdAt: now, updatedAt: now });
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rivens));
  } catch (err) {
    console.warn("Failed to save riven to localStorage", err);
  }
}

export function deleteRiven(id: string): void {
  const rivens = getSavedRivens().filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rivens));
  } catch (err) {
    console.warn("Failed to delete riven from localStorage", err);
  }
}

export const POLARITIES = ["madurai", "vazarin", "naramon"];

/**
 * Procedurally rolls a new authentic Riven for the requested weapon (or a random weapon).
 */
export function generateRandomRiven(targetWeaponId?: string): SavedRiven {
  const eligibleWeapons = getBaseRivenWeapons();

  const weapon: Weapon =
    (targetWeaponId ? getRivenBaseWeapon(targetWeaponId) : null) ??
    eligibleWeapons[Math.floor(Math.random() * eligibleWeapons.length)] ??
    eligibleWeapons[0];

  const weaponType = getEffectiveRivenWeaponType(weapon) ?? "Rifle";
  const statCat =
    weaponType === "Kitgun"
      ? "pistol"
      : weaponType === "Zaw"
      ? "melee"
      : (getRivenWeaponType(weapon)?.toLowerCase() ?? "rifle");
  const hasNegative = Math.random() < 0.65; // 65% chance of a curse
  const positiveCount = Math.random() < 0.4 ? 3 : 2; // 60% 2-stat, 40% 3-stat
  const polarity = POLARITIES[Math.floor(Math.random() * POLARITIES.length)];
  const masteryRank = 8 + Math.floor(Math.random() * 9); // MR 8 to 16
  const rerolls = Math.floor(Math.random() * 25);

  const rangeOpts = {
    positiveCount,
    hasNegative,
    rank: 8,
    includeSpliced: Math.random() < 0.15, // 15% chance of rolling with a spliced trait
  };

  const posPool = getStatsWithDisposition(statCat, STANDARD_RIVEN_DISPOSITION, rangeOpts);
  const negPool = getNegativeStatsWithDisposition(STANDARD_RIVEN_DISPOSITION, {
    ...rangeOpts,
    category: statCat,
  });

  // Pick random positive stats without repeating
  const shuffledPos = [...posPool].sort(() => 0.5 - Math.random());
  const pickedPos: RivenStat[] = [];
  const pickedDefs = getRivenStatsForCategory(weaponType, { includeSpliced: true });

  for (const p of shuffledPos) {
    if (pickedPos.length >= positiveCount) break;
    // Only one spliced trait max
    if (p.spliced && pickedPos.some((s) => s.spliced)) continue;
    pickedPos.push(p);
  }

  // Pick optional curse
  let pickedNeg: RivenStat | null = null;
  if (hasNegative && negPool.length > 0) {
    const posNames = new Set(pickedPos.map((s) => s.name));
    const availableNeg = negPool.filter((n) => !posNames.has(n.name));
    if (availableNeg.length > 0) {
      pickedNeg = availableNeg[Math.floor(Math.random() * availableNeg.length)];
    }
  }

  // Build the stats map (decimal fractions for builder)
  const stats: Record<string, number> = {};
  const posKeys: string[] = [];

  for (const p of pickedPos) {
    // Generate a random roll within the min-max roll band (90%-110%)
    const rollFactor = 0.9 + Math.random() * 0.2;
    const rolledVal = Math.round(p.baseValue * rollFactor * 10) / 10;
    const def = pickedDefs.find((d) => d.label.replace(" (Spliced)", "") === p.name);
    const key = def?.key ?? p.name.toLowerCase().replace(/\s+/g, "");
    posKeys.push(key);
    stats[key] = def && !def.isPercent ? rolledVal : Math.round((rolledVal / 100) * 1000) / 1000;
  }

  if (pickedNeg) {
    const rollFactor = 0.9 + Math.random() * 0.2;
    const rolledVal = -Math.abs(Math.round(pickedNeg.baseValue * rollFactor * 10) / 10);
    const def = pickedDefs.find((d) => d.label.replace(" (Spliced)", "") === pickedNeg!.name);
    const key = def?.key ?? pickedNeg.name.toLowerCase().replace(/\s+/g, "");
    stats[key] = def && !def.isPercent ? rolledVal : Math.round((rolledVal / 100) * 1000) / 1000;
  }

  const evalResult = evaluateSavedRiven(weapon.name, weaponType, stats, 8, rerolls, polarity);
  const rivenName = formatRivenName(weapon.name, posKeys);

  return {
    id: generateRivenId(),
    name: rivenName,
    weaponId: weapon.id,
    weaponName: weapon.name,
    weaponCategory: weapon.category,
    weaponType,
    polarity,
    rank: 8,
    rerolls,
    masteryRank,
    stats,
    displayStats: evalResult.displayStats,
    score: evalResult.score,
    grade: evalResult.grade,
    gradeColor: evalResult.color,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
