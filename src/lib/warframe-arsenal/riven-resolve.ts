type RivenBuff = { tag?: string; val?: number };

type RawRivenUpgrade = {
  uniqueName?: string;
  rank?: number;
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

  // Faction (gun + melee tags)
  WeaponFactionDamageGrineer: "factionGrineer",
  WeaponFactionDamageCorpus: "factionCorpus",
  WeaponFactionDamageInfested: "factionInfested",
  WeaponFactionDamageCorrupted: "factionOrokin",
  WeaponFactionDamageMurmurs: "factionMurmur",
  WeaponMeleeFactionDamageGrineer: "factionGrineer",
  WeaponMeleeFactionDamageCorpus: "factionCorpus",
  WeaponMeleeFactionDamageInfested: "factionInfested",
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

export function parseRivenStatsFromUpgrade(entry: RawRivenUpgrade): Record<string, number> {
  const stats: Record<string, number> = {};

  const apply = (buffs: RivenBuff[] | undefined, sign: 1 | -1) => {
    for (const buff of buffs ?? []) {
      const key = buff.tag ? RIVEN_TAG_TO_STAT[buff.tag] : undefined;
      if (!key || typeof buff.val !== "number") continue;
      const flipped = buff.tag && RIVEN_TAG_VALUE_FLIP.has(buff.tag) ? -buff.val : buff.val;
      stats[key] = (stats[key] ?? 0) + sign * flipped;
    }
  };

  apply(entry.buffs, 1);
  apply(entry.curses, -1);
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

export function resolveRivenUpgrade(
  entry: unknown,
): { modId: string; rank: number; rivenStats: Record<string, number>; unmappedTags: string[] } | undefined {
  if (!isRivenUpgrade(entry)) return undefined;
  const modId = entry.uniqueName ? rivenModIdFromUniqueName(entry.uniqueName) : undefined;
  if (!modId) return undefined;
  const rivenStats = parseRivenStatsFromUpgrade(entry);
  const unmappedTags = unmappedRivenTags(entry);
  const rank = typeof entry.rank === "number" ? entry.rank : 0;
  return { modId, rank, rivenStats, unmappedTags };
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
