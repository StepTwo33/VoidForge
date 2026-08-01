type RivenBuff = { tag?: string; val?: number };

type RawRivenUpgrade = {
  uniqueName?: string;
  rank?: number;
  buffs?: RivenBuff[];
  curses?: RivenBuff[];
};

/** DE upgrade tags → Voidforge riven stat keys (decimal fractions, e.g. 0.44 = +44%). */
const RIVEN_TAG_TO_STAT: Record<string, string> = {
  WeaponDamageAmountMod: "damage",
  WeaponCritChanceMod: "criticalChance",
  WeaponCritDamageMod: "criticalMultiplier",
  WeaponProcChanceMod: "statusChance",
  WeaponFireIterationsMod: "multishot",
  WeaponFireRateMod: "fireRate",
  WeaponAmmoMaxMod: "ammoMax",
  WeaponReloadSpeedMod: "reloadSpeed",
  WeaponClipMaxMod: "magazine",
  WeaponZoomMod: "zoom",
  WeaponPunchThroughMod: "punchThrough",
  WeaponRecoilReductionMod: "recoil",
  WeaponProjectileSpeedMod: "projectileSpeed",
  WeaponMeleeRangeIncMod: "range",
  WeaponSlideAttackDamageMod: "slideAttack",
  WeaponComboDurationMod: "comboDuration",
  WeaponFireDamageMod: "heat",
  WeaponFreezeDamageMod: "cold",
  WeaponToxinDamageMod: "toxin",
  WeaponElectricityDamageMod: "electricity",
  WeaponSlashDamageMod: "slash",
  WeaponPunctureDamageMod: "puncture",
  WeaponImpactDamageMod: "impact",
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

export function parseRivenStatsFromUpgrade(entry: RawRivenUpgrade): Record<string, number> {
  const stats: Record<string, number> = {};

  const apply = (buffs: RivenBuff[] | undefined, sign: 1 | -1) => {
    for (const buff of buffs ?? []) {
      const key = buff.tag ? RIVEN_TAG_TO_STAT[buff.tag] : undefined;
      if (!key || typeof buff.val !== "number") continue;
      stats[key] = (stats[key] ?? 0) + sign * buff.val;
    }
  };

  apply(entry.buffs, 1);
  apply(entry.curses, -1);
  return stats;
}

export function resolveRivenUpgrade(
  entry: unknown,
): { modId: string; rank: number; rivenStats: Record<string, number> } | undefined {
  if (!isRivenUpgrade(entry)) return undefined;
  const modId = entry.uniqueName ? rivenModIdFromUniqueName(entry.uniqueName) : undefined;
  if (!modId) return undefined;
  const rivenStats = parseRivenStatsFromUpgrade(entry);
  const rank = typeof entry.rank === "number" ? entry.rank : 0;
  return { modId, rank, rivenStats };
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
