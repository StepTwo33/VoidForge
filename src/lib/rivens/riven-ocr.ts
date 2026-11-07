import { getBaseRivenWeapons, type ExtendedRivenWeaponType } from "@/lib/weapons/riven-family";
import { getRivenStatsForCategory, type RivenStatDef } from "@/lib/types";
import { getRivenWeaponType } from "@/lib/weapons/riven-weapon-type";
import type { Weapon } from "@/lib/types";

export interface ParsedOcrRiven {
  weaponId?: string;
  weaponName?: string;
  weaponType?: ExtendedRivenWeaponType;
  customSuffix?: string;
  polarity: string;
  masteryRank: number;
  rerolls: number;
  positiveStats: { key: string; value: number }[];
  negativeStat: { key: string; value: number } | null;
  isLikelyUnranked?: boolean;
  confidence: {
    weaponMatched: boolean;
    statsCount: number;
    rawText: string;
  };
}

/** Known Warframe Riven stat aliases mapped to internal keys */
const STAT_ALIASES: { pattern: RegExp; key: string; isNegativeHint?: boolean }[] = [
  // Critical Chance & Damage
  { pattern: /\bcrit(?:ical)?\s*chance\s*(?:for\s*slide\s*attack|on\s*slide)?\b/i, key: "criticalChance" },
  { pattern: /\bcrit(?:ical)?\s*(?:damage|multiplier|dmg)\b/i, key: "criticalMultiplier" },

  // Specific Damage types first (before generic "damage")
  { pattern: /\bfinisher\s*damage\b/i, key: "finisherDamage" },
  { pattern: /\bstatus\s*damage\b/i, key: "statusDamage" },
  { pattern: /\bweak\s*point\s*damage\b/i, key: "weakPointDamage" },
  { pattern: /\bweak\s*point\s*crit(?:ical)?\s*chance\b/i, key: "weakPointCritChance" },
  { pattern: /\bmelee\s*damage\s*on\s*heavy\s*attack\b/i, key: "heavyAttackDamageBonus" },
  { pattern: /\bslam(?:\s*attack)?\s*damage\b/i, key: "slamDamage" },

  // Factions before generic damage
  { pattern: /\bdamage\s*(?:to|vs)\s*grineer\b/i, key: "factionGrineer" },
  { pattern: /\bdamage\s*(?:to|vs)\s*corpus\b/i, key: "factionCorpus" },
  { pattern: /\bdamage\s*(?:to|vs)\s*infested\b/i, key: "factionInfested" },
  { pattern: /\bdamage\s*(?:to|vs)\s*orokin\b/i, key: "factionOrokin" },
  { pattern: /\bdamage\s*(?:to|vs)\s*scaldra\b/i, key: "factionScaldra" },
  { pattern: /\bdamage\s*(?:to|vs)\s*techrot\b/i, key: "factionTechrot" },

  // Elements (before generic damage)
  { pattern: /\btoxin(?:\s*damage)?\b/i, key: "toxin" },
  { pattern: /\bheat(?:\s*damage)?\b/i, key: "heat" },
  { pattern: /\bcold(?:\s*damage)?\b/i, key: "cold" },
  { pattern: /\belectric(?:ity)?(?:\s*damage)?\b/i, key: "electricity" },
  { pattern: /\bviral(?:\s*damage)?\b/i, key: "viral" },
  { pattern: /\bcorrosive(?:\s*damage)?\b/i, key: "corrosive" },
  { pattern: /\bradiation(?:\s*damage)?\b/i, key: "radiation" },
  { pattern: /\bmagnetic(?:\s*damage)?\b/i, key: "magnetic" },
  { pattern: /\bblast(?:\s*damage)?\b/i, key: "blast" },
  { pattern: /\bgas(?:\s*damage)?\b/i, key: "gas" },
  { pattern: /\bimpact\b/i, key: "impact" },
  { pattern: /\bpuncture\b/i, key: "puncture" },
  { pattern: /\bslash\b/i, key: "slash" },

  // Generic Base Damage & Multishot
  { pattern: /\b(?:melee\s+)?damage\b/i, key: "damage" },
  { pattern: /\bmultishot\b/i, key: "multishot" },

  // Speed & Fire Rate
  { pattern: /\b(?:fire\s*rate|attack\s*speed)\b/i, key: "fireRate" },

  // Status
  { pattern: /\bstatus\s*chance\b/i, key: "statusChance" },
  { pattern: /\bstatus\s*duration\b/i, key: "statusDuration" },

  // Handling / Utility
  { pattern: /\bmagazine(?:\s*capacity)?\b/i, key: "magazine" },
  { pattern: /\breload(?:\s*speed)?\b/i, key: "reloadSpeed" },
  { pattern: /\brange\b/i, key: "range" },
  { pattern: /\bpunch\s*through\b/i, key: "punchThrough" },
  { pattern: /\bzoom\b/i, key: "zoom" },
  { pattern: /\b(?:weapon\s*)?recoil\b/i, key: "recoil" },
  { pattern: /\bammo\s*(?:maximum|max)\b/i, key: "ammoMax" },
  { pattern: /\b(?:projectile|flight)\s*speed\b/i, key: "projectileSpeed" },
  { pattern: /\bammo\s*efficiency\b/i, key: "ammoEfficiency" },

  // Melee specific
  { pattern: /\bcombo\s*duration\b/i, key: "comboDuration" },
  { pattern: /\binitial\s*combo\b/i, key: "initialCombo" },
  { pattern: /\bheavy\s*attack\s*efficiency\b/i, key: "heavyAttackEfficiency" },
  { pattern: /\bslide\s*attack\b/i, key: "slideAttack" },
];

/**
 * Parses raw OCR text from a Warframe riven card screenshot or image.
 */
export function parseRivenOcrText(rawText: string, weaponsList: Weapon[] = getBaseRivenWeapons()): ParsedOcrRiven {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Detect Mastery Rank (MR X)
  let masteryRank = 12;
  const mrMatch = rawText.match(/\bMR\s*[:#]?\s*(\d{1,2})\b/i) || rawText.match(/\bMastery\s*Rank\s*[:#]?\s*(\d{1,2})\b/i);
  if (mrMatch) {
    const val = parseInt(mrMatch[1], 10);
    if (val >= 8 && val <= 18) {
      masteryRank = val;
    }
  }

  // 2. Detect Cycles / Re-rolls
  let rerolls = 0;
  const cyclesMatch = rawText.match(/\b(\d+)\s*(?:Cycles?|Rerolls?|Rolls?)\b/i) || rawText.match(/(?:Cycles?|Rerolls?|Rolls?)\s*[:#]?\s*(\d+)\b/i);
  if (cyclesMatch) {
    rerolls = parseInt(cyclesMatch[1], 10);
  }

  // 3. Match Weapon Name
  let matchedWeapon: Weapon | undefined;
  let bestWeaponScore = 0;

  for (const w of weaponsList) {
    const wName = w.name.toLowerCase();
    // Check if the entire rawText contains the weapon name
    const reg = new RegExp(`\\b${wName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (reg.test(rawText)) {
      // Longer weapon names score higher to avoid substring collisions
      if (wName.length > bestWeaponScore) {
        matchedWeapon = w;
        bestWeaponScore = wName.length;
      }
    }
  }

  // Fallback: check each line for close weapon match
  if (!matchedWeapon) {
    for (const line of lines) {
      const cleanLine = line.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
      for (const w of weaponsList) {
        const wClean = w.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        if (cleanLine === wClean || cleanLine.startsWith(wClean + " ") || cleanLine.endsWith(" " + wClean)) {
          if (wClean.length > bestWeaponScore) {
            matchedWeapon = w;
            bestWeaponScore = wClean.length;
          }
        }
      }
    }
  }

  // Determine stat category
  const weaponCategory = matchedWeapon ? getRivenWeaponType(matchedWeapon) ?? "Rifle" : "Rifle";
  const statDefs = getRivenStatsForCategory(weaponCategory, { includeSpliced: true });
  const statDefsByKey = new Map<string, RivenStatDef>();
  for (const s of statDefs) {
    statDefsByKey.set(s.key, s);
  }

  // 4. Extract Stats
  const positiveStats: { key: string; value: number }[] = [];
  let negativeStat: { key: string; value: number } | null = null;
  const seenKeys = new Set<string>();

  // Stat line pattern:
  // Supports both standard "+148.2% Critical Chance" / "-48.0% Zoom" / "+1.9 Range"
  // AND Warframe's faction multiplier format "x1.45 Damage to Grineer" / "1.45x Damage to Corpus" / "x0.65 Damage to Infested".
  // The in-game card draws an element icon between the value and the stat name ("+9.2% 🔥 Heat"),
  // which OCR turns into stray symbols or letters, so everything after the number is matched loosely.
  const statLineRegex = /(?:([x×])\s*(\d+(?:[.,]\d+)?)|([+−–—\-]?\s*\d+(?:[.,]\d+)?)\s*([x×]|%|s|m)?)\s*(.+)/i;

  // A value alone on its line ("+9.2%") belongs with the stat name on the next line.
  const statLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    if (/^(?:[+−–—\-]\s*\d+(?:[.,]\d+)?\s*[x×%]?|\d+(?:[.,]\d+)?\s*[x×%])\W*$/i.test(cur) && i + 1 < lines.length) {
      statLines.push(`${cur} ${lines[i + 1]}`);
      i++;
    } else {
      statLines.push(cur);
    }
  }

  for (const line of statLines) {
    // Skip header/footer lines like "MR 12", "Cycles", "RIFLE RIVEN MOD"
    if (/^\s*(?:MR\s*\d+|cycles|rolls|riven mod|melee riven|rifle riven|pistol riven|shotgun riven)\s*$/i.test(line)) {
      continue;
    }

    const match = line.match(statLineRegex);
    if (!match) continue;

    const prefixMult = !!match[1];
    const suffixUnit = (match[4] || "").toLowerCase();
    const isMultNotation = prefixMult || suffixUnit === "x" || suffixUnit === "×";
    const rawSignedStr = prefixMult ? match[2] : match[3];
    const rawNumStr = rawSignedStr.replace(/[+−–—\-\s]/g, "").replace(",", ".");
    const rawVal = parseFloat(rawNumStr);
    if (isNaN(rawVal) || Math.abs(rawVal) === 0) continue;

    const restOfLine = match[5].trim();

    // Find matching stat alias
    let matchedKey: string | undefined;
    for (const alias of STAT_ALIASES) {
      if (alias.pattern.test(restOfLine)) {
        matchedKey = alias.key;
        break;
      }
    }

    if (!matchedKey || seenKeys.has(matchedKey)) continue;

    const def = statDefsByKey.get(matchedKey);
    const isFaction = matchedKey.startsWith("faction");
    const isPercent = def ? def.isPercent : true;

    let convertedVal: number;
    let isCurse: boolean;

    if (isFaction && (isMultNotation || (rawVal > 0 && rawVal < 3))) {
      // Warframe faction multiplier: x1.45 -> +0.45 buff; x0.65 -> 0.35 curse magnitude
      if (rawVal < 1) {
        convertedVal = Math.round((1 - rawVal) * 1000) / 1000;
        isCurse = true;
      } else {
        convertedVal = Math.round((rawVal - 1) * 1000) / 1000;
        isCurse = false;
      }
      if (convertedVal <= 0) continue;
    } else {
      // Convert value: if percent stat, store as fraction (148.2% -> 1.482)
      convertedVal = isPercent ? Math.abs(rawVal) / 100 : Math.abs(rawVal);
      const hasMinusSign = /[−–—\-]/.test(rawSignedStr) || /^[−–—\-]/.test(line.trim());
      if (positiveStats.length >= 3) {
        // Rivens have at most 3 positive stats; a 4th stat line is always the negative curse.
        isCurse = true;
      } else if (matchedKey === "recoil") {
        // In Warframe, "-72% Weapon Recoil" reduces recoil (buff); "+58% Weapon Recoil" increases recoil (curse).
        isCurse = !hasMinusSign;
      } else {
        isCurse = hasMinusSign;
      }
    }

    seenKeys.add(matchedKey);

    if (isCurse) {
      if (!negativeStat) {
        negativeStat = { key: matchedKey, value: convertedVal };
      }
    } else {
      if (positiveStats.length < 3) {
        // SavedRiven / RivenDialog convention: all positiveStats carry positive magnitude (> 0).
        positiveStats.push({ key: matchedKey, value: convertedVal });
      }
    }
  }

  // 5. Detect Riven Suffix
  let customSuffix: string | undefined;
  // Look for hyphenated names or words matching Warframe riven suffixes (case-insensitive)
  // e.g. "SATI-CRITACRON", "Ampi-critatin", "VISI-ACRITIS", "DAGGER LOCTI-VISICRON"
  const suffixPattern = /\b([a-zA-Z]{3,15}-[a-zA-Z]{3,15}(?:-[a-zA-Z]{3,15})?)\b/;
  for (const line of lines) {
    const sMatch = line.match(suffixPattern);
    if (sMatch) {
      customSuffix = sMatch[1];
      break;
    }
  }

  // Check if positive stats appear to be Rank 0 (unranked)
  // At Rank 0, stats are ~1/9th of typical values (under 25% for percent stats)
  const isLikelyUnranked = positiveStats.length > 0 && positiveStats.every((s) => Math.abs(s.value) < 0.25);

  return {
    weaponId: matchedWeapon?.id,
    weaponName: matchedWeapon?.name,
    weaponType: matchedWeapon ? (getRivenWeaponType(matchedWeapon) as ExtendedRivenWeaponType) : undefined,
    customSuffix,
    polarity: "madurai",
    masteryRank,
    rerolls,
    positiveStats,
    negativeStat,
    isLikelyUnranked,
    confidence: {
      weaponMatched: !!matchedWeapon,
      statsCount: positiveStats.length + (negativeStat ? 1 : 0),
      rawText,
    },
  };
}

/**
 * Runs client-side OCR on an image file using tesseract.js and parses the riven card text.
 */
export async function scanRivenImageFile(
  file: File | Blob,
  onProgress?: (progress: number, status: string) => void,
): Promise<ParsedOcrRiven> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");

  let objectUrl: string | null = null;
  try {
    onProgress?.(10, "Loading image...");
    const img = new Image();
    objectUrl = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for scanning"));
      img.src = objectUrl!;
    });

    onProgress?.(30, "Optimizing image for text recognition...");
    // Scale up smaller screenshots (under 800px) so character strokes are clean and legible for OCR
    const scale = Math.max(1, Math.min(3, 800 / img.width));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    onProgress?.(50, "Reading Riven text...");
    const { data } = await worker.recognize(canvas);

    onProgress?.(90, "Analyzing stats and weapon...");
    const parsed = parseRivenOcrText(data.text);
    onProgress?.(100, "Done!");
    return parsed;
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // worker termination cleanup
      }
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
