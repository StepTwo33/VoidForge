import { getRivenDrain } from "@/lib/calc/riven-calculator";
import { rivenAttributeValue, rivenRollTypeFromUniqueName, rivenValsAreRolls } from "@/lib/riven/riven-roll";
type RivenBuff = { tag?: string; val?: number };

export type RawRivenUpgrade = {
  uniqueName?: string;
  rank?: number;
  /** DE polarity tag (AP_ATTACK / AP_DEFENSE / AP_TACTIC) or a plain polarity name, when present. */
  pol?: string;
  polarity?: string;
  /** Capacity drain, when the export carries it. */
  drain?: number;
  baseDrain?: number;
  buffs?: RivenBuff[];
  curses?: RivenBuff[];
};

/**
 * DE upgrade tags → Voidforge riven stat keys (decimal fractions, e.g. 0.44 = +44%).
 * Tags verified against @wfcd/items Riven `upgradeEntries` (Rifle/Pistol/Shotgun/Melee/Kitgun/Zaw/Archgun).
 */
export const RIVEN_TAG_TO_STAT: Record<string, string> = {
  // Damage / IPS / elements
  WeaponDamageAmountMod: "damage",
  WeaponMeleeDamageMod: "damage",
  WeaponImpactDamageMod: "impact",
  WeaponArmorPiercingDamageMod: "puncture",
  WeaponPunctureDamageMod: "puncture", // legacy alias
  WeaponSlashDamageMod: "slash",
  WeaponFireDamageMod: "heat",
  WeaponFreezeDamageMod: "cold",
  WeaponToxinDamageMod: "toxin",
  WeaponElectricityDamageMod: "electricity",

  // Crit / status (Stun Chance is DE's status-chance tag on rivens)
  WeaponCritChanceMod: "criticalChance",
  WeaponCritDamageMod: "criticalMultiplier",
  WeaponStunChanceMod: "statusChance",
  WeaponProcChanceMod: "statusChance", // legacy alias
  WeaponProcTimeMod: "statusDuration",

  // Gun handling
  WeaponFireIterationsMod: "multishot",
  WeaponFireRateMod: "fireRate",
  WeaponAmmoMaxMod: "ammoMax",
  WeaponReloadSpeedMod: "reloadSpeed",
  WeaponClipMaxMod: "magazine",
  WeaponZoomFovMod: "zoom",
  WeaponZoomMod: "zoom", // legacy alias
  WeaponPunctureDepthMod: "punchThrough",
  WeaponPunchThroughMod: "punchThrough", // legacy alias
  WeaponRecoilReductionMod: "recoil",
  WeaponProjectileSpeedMod: "projectileSpeed",

  // Melee
  WeaponMeleeRangeIncMod: "range",
  WeaponSlideAttackDamageMod: "slideAttack",
  ComboDurationMod: "comboDuration",
  WeaponComboDurationMod: "comboDuration", // legacy alias
  WeaponMeleeFinisherDamageMod: "finisherDamage",
  WeaponMeleeComboInitialBonusMod: "initialCombo",
  WeaponMeleeComboEfficiencyMod: "heavyAttackEfficiency",
  SlideAttackCritChanceMod: "slideAttackCritChance",
  WeaponMeleeComboBonusOnHitMod: "comboCountChance",
  // Curse-only stat; DE stores it negative and shows it as −100·v % (wiki Riven Mods), so
  // the value is taken as a magnitude and signed by buff/curse (see RIVEN_TAG_ABS).
  WeaponMeleeComboPointsOnHitMod: "comboGainChance",

  // Faction (gun + melee tags)
  WeaponFactionDamageGrineer: "factionGrineer",
  WeaponFactionDamageCorpus: "factionCorpus",
  WeaponFactionDamageInfested: "factionInfested",
  WeaponFactionDamageCorrupted: "factionOrokin",
  WeaponFactionDamageMurmurs: "factionMurmur",
  WeaponMeleeFactionDamageGrineer: "factionGrineer",
  WeaponMeleeFactionDamageCorpus: "factionCorpus",
  WeaponMeleeFactionDamageInfested: "factionInfested",
  WeaponFactionDamageOrokin: "factionOrokin",

  // Riven Splicer traits (Update 44.1) — keys match getRivenStatsForCategory spliced defs.
  WeaponViralDamageMod: "viral",
  WeaponCorrosiveDamageMod: "corrosive",
  WeaponGasDamageMod: "gas",
  WeaponRadiationDamageMod: "radiation",
  WeaponBlastDamageMod: "blast",
  WeaponMagneticDamageMod: "magnetic",
  WeaponStatusDamage: "statusDamage",
  WeaponFactionDamageScaldra: "factionScaldra",
  WeaponFactionDamageTechrot: "factionTechrot",
  WeaponWeakpointDamage: "weakPointDamage",
  WeaponWeakpointCriticalChance: "weakPointCritChance",
  WeaponAmmoEfficiency: "ammoEfficiency",
  WeaponMagazineReloadHolstered: "reloadWhileHolstered",
  WeaponMeleeHeavyAttackChargeMod: "heavyAttackWindUp",
  WeaponMeleeHeavyAttackDamageMod: "heavyAttackDamageBonus",
  WeaponMeleeSlamDamageMod: "slamDamage",
  WeaponMeleeParryAngleMod: "parryAngle",
};

const RIVEN_PATH_PATTERNS: Array<{ pattern: RegExp; modId: string }> = [
  { pattern: /LotusPistolRandomMod|ModularPistolRandomMod|CompanionWeaponRandomMod/i, modId: "riven_pistol" },
  { pattern: /LotusShotgunRandomMod/i, modId: "riven_shotgun" },
  { pattern: /LotusRifleRandomMod|LotusArchgunRandomMod/i, modId: "riven_rifle" },
  { pattern: /PlayerMeleeWeaponRandomMod|ModularMeleeRandomMod/i, modId: "riven_melee" },
];

export function isRivenUpgrade(entry: unknown): entry is RawRivenUpgrade {
  if (!entry || typeof entry !== "object") return false;
  const uniqueName = (entry as RawRivenUpgrade).uniqueName;
  if (!uniqueName) return false;
  return uniqueName.includes("/Randomized/") || /RandomMod/i.test(uniqueName);
}

export function rivenModIdFromUniqueName(uniqueName: string): string | undefined {
  for (const { pattern, modId } of RIVEN_PATH_PATTERNS) {
    if (pattern.test(uniqueName)) return modId;
  }
  return undefined;
}

/**
 * DE tags whose positive arsenal value means the opposite of FrameHub's signed
 * convention (e.g. RecoilReduction +0.5 → recoil −0.5).
 */
const RIVEN_TAG_VALUE_FLIP = new Set(["WeaponRecoilReductionMod"]);

/** Tags whose stored sign varies by source; use |val| and sign it by buff (+) / curse (−). */
const RIVEN_TAG_ABS = new Set(["WeaponMeleeComboPointsOnHitMod"]);

/**
 * Riven stat values for the builder (decimal fractions, signed by FrameHub's convention).
 *
 * Real arsenal exports carry each attribute's normalized roll u (0..1), not the stat value, so
 * values are rebuilt with the wiki formula (src/lib/riven/riven-roll.ts) from the riven type,
 * rank and buff/curse counts. Payloads whose vals are outside 0..1 (hand-built / legacy test data
 * that already holds final values) are taken as-is.
 */
export function parseRivenStatsFromUpgrade(entry: RawRivenUpgrade): Record<string, number> {
  const stats: Record<string, number> = {};
  const buffs = entry.buffs ?? [];
  const curses = entry.curses ?? [];
  const vals = [...buffs, ...curses].map((b) => b.val).filter((v): v is number => typeof v === "number");
  const rollType = entry.uniqueName ? rivenRollTypeFromUniqueName(entry.uniqueName) : undefined;
  const fromRolls = rollType != null && rivenValsAreRolls(vals);

  const apply = (list: RivenBuff[], isCurse: boolean) => {
    const sign = isCurse ? -1 : 1;
    for (const buff of list) {
      const key = buff.tag ? RIVEN_TAG_TO_STAT[buff.tag] : undefined;
      if (!key || !buff.tag || typeof buff.val !== "number") continue;
      let value: number | undefined;
      if (fromRolls) {
        const v = rivenAttributeValue({
          type: rollType!,
          tag: buff.tag,
          u: buff.val,
          rank: typeof entry.rank === "number" ? entry.rank : 0,
          buffCount: buffs.length,
          curseCount: curses.length,
          isCurse,
        });
        if (v == null) continue;
        // Game sign already matches FrameHub's except the curse-only combo-gain stat (shown −100v %).
        value = RIVEN_TAG_ABS.has(buff.tag) ? sign * Math.abs(v) : v;
      } else {
        value = RIVEN_TAG_ABS.has(buff.tag)
          ? sign * Math.abs(buff.val)
          : sign * (RIVEN_TAG_VALUE_FLIP.has(buff.tag) ? -buff.val : buff.val);
      }
      stats[key] = (stats[key] ?? 0) + value;
    }
  };

  apply(buffs, false);
  apply(curses, true);
  return stats;
}

/** Tags present on the upgrade that we do not map (for import warnings / diagnostics). */
export function unmappedRivenTags(entry: RawRivenUpgrade): string[] {
  const out: string[] = [];
  for (const buff of [...(entry.buffs ?? []), ...(entry.curses ?? [])]) {
    if (!buff.tag || typeof buff.val !== "number") continue;
    if (!RIVEN_TAG_TO_STAT[buff.tag] && !out.includes(buff.tag)) out.push(buff.tag);
  }
  return out;
}

/** DE polarity tags (wiki Polarity: AP_ATTACK = Madurai, AP_DEFENSE = Vazarin, AP_TACTIC = Naramon). */
const DE_POLARITY: Record<string, string> = {
  AP_ATTACK: "madurai",
  AP_DEFENSE: "vazarin",
  AP_TACTIC: "naramon",
};

/** Riven polarity from an arsenal entry; undefined when the export doesn't carry one. */
export function rivenPolarityFromUpgrade(entry: RawRivenUpgrade): string | undefined {
  const raw = entry.pol ?? entry.polarity;
  if (typeof raw !== "string") return undefined;
  const p = DE_POLARITY[raw.toUpperCase()] ?? raw.toLowerCase();
  return ["madurai", "vazarin", "naramon"].includes(p) ? p : undefined;
}

export function resolveRivenUpgrade(
  entry: unknown,
): {
  modId: string;
  rank: number;
  rivenStats: Record<string, number>;
  unmappedTags: string[];
  polarity?: string;
  drain?: number;
} | undefined {
  if (!isRivenUpgrade(entry)) return undefined;
  const modId = entry.uniqueName ? rivenModIdFromUniqueName(entry.uniqueName) : undefined;
  if (!modId) return undefined;
  const rivenStats = parseRivenStatsFromUpgrade(entry);
  const unmappedTags = unmappedRivenTags(entry);
  const rank = typeof entry.rank === "number" ? entry.rank : 0;
  const polarity = rivenPolarityFromUpgrade(entry);
  // The arsenal export has no drain field (only rank); drain is always 10 + rank (18 at rank 8).
  const drain = getRivenDrain(Math.max(0, Math.min(8, rank)));
  return {
    modId,
    rank,
    rivenStats,
    unmappedTags,
    ...(polarity ? { polarity } : {}),
    ...(drain != null ? { drain } : {}),
  };
}

/** Merge riven rolls from saved mod slots for weapon DPS calculation. */
export function rivenStatChangesFromModSlots(
  mods: Array<{ rivenStats?: Record<string, number> }>,
): Record<string, number> | undefined {
  const merged: Record<string, number> = {};
  for (const slot of mods) {
    if (!slot.rivenStats) continue;
    for (const [key, value] of Object.entries(slot.rivenStats)) {
      merged[key] = (merged[key] ?? 0) + value;
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}
