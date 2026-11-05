import { allWeapons } from "@/data/weapons";
import type { Weapon } from "@/lib/types";
import { getRivenWeaponType, type RivenWeaponType } from "@/lib/weapons/riven-weapon-type";
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
  weaponType: RivenWeaponType;
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
  const defs = getRivenStatsForCategory(weaponType, { includeSpliced: true });
  const positiveRivenStats: RivenStat[] = [];
  let negativeRivenStat: RivenStat | null = null;
  const displayStats: SavedRivenStat[] = [];

  for (const [key, val] of Object.entries(stats)) {
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

/** Starters shown when the user first visits the library with no saved rivens */
export const STARTER_RIVENS: SavedRiven[] = [
  {
    id: "starter_torid",
    name: "Torid Sati-critacron",
    weaponId: "torid",
    weaponName: "Torid",
    weaponCategory: "primary",
    weaponType: "Rifle",
    polarity: "madurai",
    rank: 8,
    rerolls: 14,
    masteryRank: 12,
    stats: {
      criticalChance: 1.482,
      multishot: 0.945,
      zoom: -0.48,
    },
    displayStats: [
      { key: "criticalChance", label: "Critical Chance", value: 1.482, isPercent: true },
      { key: "multishot", label: "Multishot", value: 0.945, isPercent: true },
      { key: "zoom", label: "Zoom", value: -0.48, isPercent: true, isCurse: true },
    ],
    score: 4.85,
    grade: "God Roll",
    gradeColor: "#FFD700",
    createdAt: 1730000000000,
    updatedAt: 1730000000000,
  },
  {
    id: "starter_rubico",
    name: "Rubico Visi-acritis",
    weaponId: "rubico_prime",
    weaponName: "Rubico Prime",
    weaponCategory: "primary",
    weaponType: "Rifle",
    polarity: "vazarin",
    rank: 8,
    rerolls: 28,
    masteryRank: 14,
    stats: {
      damage: 1.624,
      criticalMultiplier: 1.185,
      ammoMax: -0.38,
    },
    displayStats: [
      { key: "damage", label: "Damage", value: 1.624, isPercent: true },
      { key: "criticalMultiplier", label: "Critical Damage", value: 1.185, isPercent: true },
      { key: "ammoMax", label: "Ammo Maximum", value: -0.38, isPercent: true, isCurse: true },
    ],
    score: 4.62,
    grade: "God Roll",
    gradeColor: "#FFD700",
    createdAt: 1730000001000,
    updatedAt: 1730000001000,
  },
  {
    id: "starter_ceramic_dagger",
    name: "Ceramic Dagger Locti-visicron",
    weaponId: "ceramic_dagger",
    weaponName: "Ceramic Dagger",
    weaponCategory: "melee",
    weaponType: "Melee",
    polarity: "naramon",
    rank: 8,
    rerolls: 9,
    masteryRank: 10,
    stats: {
      range: 1.85,
      criticalChance: 1.72,
      damage: 1.55,
      finisherDamage: -0.65,
    },
    displayStats: [
      { key: "range", label: "Range", value: 1.85, isPercent: false },
      { key: "criticalChance", label: "Critical Chance", value: 1.72, isPercent: true },
      { key: "damage", label: "Damage", value: 1.55, isPercent: true },
      { key: "finisherDamage", label: "Finisher Damage", value: -0.65, isPercent: true, isCurse: true },
    ],
    score: 4.1,
    grade: "Excellent",
    gradeColor: "#E91E63",
    createdAt: 1730000002000,
    updatedAt: 1730000002000,
  },
];

export function getSavedRivens(): SavedRiven[] {
  if (typeof window === "undefined") return STARTER_RIVENS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with starters on first run
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STARTER_RIVENS));
      return STARTER_RIVENS;
    }
    const rivens = JSON.parse(raw) as SavedRiven[];
    return Array.isArray(rivens) ? rivens : [];
  } catch {
    return STARTER_RIVENS;
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

const POLARITIES = ["madurai", "vazarin", "naramon", "zenurik"];

/**
 * Procedurally rolls a new authentic Riven for the requested weapon (or a random weapon).
 */
export function generateRandomRiven(targetWeaponId?: string): SavedRiven {
  const eligibleWeapons = allWeapons.filter(
    (w) => getRivenWeaponType(w) !== null && w.triggerType !== "Zaw Component",
  );

  const weapon: Weapon =
    (targetWeaponId ? eligibleWeapons.find((w) => w.id === targetWeaponId) : null) ??
    eligibleWeapons[Math.floor(Math.random() * eligibleWeapons.length)] ??
    eligibleWeapons[0];

  const weaponType = getRivenWeaponType(weapon) ?? "Rifle";
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

  const posPool = getStatsWithDisposition(weaponType.toLowerCase(), STANDARD_RIVEN_DISPOSITION, rangeOpts);
  const negPool = getNegativeStatsWithDisposition(STANDARD_RIVEN_DISPOSITION, {
    ...rangeOpts,
    category: weaponType.toLowerCase(),
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
