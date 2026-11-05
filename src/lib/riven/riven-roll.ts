import { STANDARD_RIVEN_DISPOSITION } from "@/data/riven-dispositions";

/**
 * Riven roll → stat value conversion for Player Sync (Round 54b).
 *
 * The Warframe Arsenal export (getActiveLoadout.php) does NOT carry the rolled stat values.
 * Each riven buff/curse `val` is the normalized roll quality u (0..1), i.e. DE's fingerprint
 * integer Value / 0x3FFFFFFF. Evidence: every riven in the WFCD/arsenal-parser example payloads
 * (28 attributes, incl. our fixture wfcd-example7) has 0 <= val <= 1, curses are stored positive,
 * and values like Multishot 0.069 on a 3-buff shotgun riven or Crit Chance 0.02 on a melee riven
 * are far below the minimum possible roll.
 *
 * Formula (wiki.warframe.com/w/Riven_Mods § Attribute Value Formula, "Detailed Explanation"):
 *   v = b × 10 × (r + 1) × D × L × W,   W = 0.9 + 0.2u,   D = 1.2 (dispositions retired)
 *   L = bonus 0.99 / 1.2375 / 0.75 / 0.9375 (2+0, 2+1, 3+0, 3+1); malus 0.495 (2 buffs) / 0.75 (3 buffs)
 * Same formula as calamity-inc/warframe-riven-info RivenParser.parseRiven (1.5 × numBuffsAtten ×
 * 1.25^curses), which is what browse.wf/rivencalc uses. Coefficients b per riven type are from
 * that project's riven_tags.json (DE ExportUpgrades), matching the wiki "Base Values" table.
 * Spliced traits are not in riven_tags.json; their b is the wiki "Spliced Values" rank-8 base / 90.
 */

export type RivenRollType = "rifle" | "shotgun" | "pistol" | "kitgun" | "archgun" | "melee" | "zaw";

export const RIVEN_TAG_COEFFICIENTS: Record<RivenRollType, Record<string, number>> = {
  archgun: { WeaponArmorPiercingDamageMod: 0.01, WeaponCritChanceMod: 0.0111, WeaponCritDamageMod: 0.0089, WeaponElectricityDamageMod: 0.0133, WeaponFireDamageMod: 0.0133, WeaponFireRateMod: 0.00667, WeaponFreezeDamageMod: 0.0133, WeaponImpactDamageMod: 0.01, WeaponProcTimeMod: 0.01111, WeaponSlashDamageMod: 0.01, WeaponStunChanceMod: 0.0067, WeaponToxinDamageMod: 0.0133, WeaponAmmoMaxMod: 0.0111, WeaponClipMaxMod: 0.0067, WeaponDamageAmountMod: 0.0111, WeaponFireIterationsMod: 0.0067, WeaponPunctureDepthMod: 0.03, WeaponRecoilReductionMod: -0.01, WeaponReloadSpeedMod: 0.0111, WeaponFactionDamageCorpus: 0.005, WeaponFactionDamageGrineer: 0.005, WeaponZoomFovMod: 0.006666 },
  zaw: { WeaponMeleeDamageMod: 0.0183, WeaponArmorPiercingDamageMod: 0.0133, WeaponImpactDamageMod: 0.0133, WeaponSlashDamageMod: 0.0133, WeaponCritChanceMod: 0.02, WeaponCritDamageMod: 0.01, WeaponElectricityDamageMod: 0.01, WeaponFireDamageMod: 0.01, WeaponFreezeDamageMod: 0.01, WeaponToxinDamageMod: 0.01, WeaponProcTimeMod: 0.01111, WeaponMeleeFactionDamageCorpus: 0.005, WeaponMeleeFactionDamageGrineer: 0.005, WeaponMeleeFactionDamageInfested: 0.005, WeaponFireRateMod: 0.0061, WeaponStunChanceMod: 0.01, ComboDurationMod: 0.09, SlideAttackCritChanceMod: 0.013334, WeaponMeleeRangeIncMod: 0.02158, WeaponMeleeFinisherDamageMod: 0.0133, WeaponMeleeComboEfficiencyMod: 0.00816, WeaponMeleeComboInitialBonusMod: 0.27224, WeaponMeleeComboPointsOnHitMod: -0.01165, WeaponMeleeComboBonusOnHitMod: 0.00653 },
  kitgun: { WeaponArmorPiercingDamageMod: 0.01333, WeaponCritChanceMod: 0.016666, WeaponCritDamageMod: 0.01, WeaponElectricityDamageMod: 0.01, WeaponFireDamageMod: 0.01, WeaponFireRateMod: 0.0083, WeaponFreezeDamageMod: 0.01, WeaponImpactDamageMod: 0.013333, WeaponProcTimeMod: 0.01111, WeaponSlashDamageMod: 0.013333, WeaponStunChanceMod: 0.01, WeaponToxinDamageMod: 0.01, WeaponAmmoMaxMod: 0.01, WeaponClipMaxMod: 0.005555, WeaponDamageAmountMod: 0.0244, WeaponFireIterationsMod: 0.0133, WeaponProjectileSpeedMod: 0.01, WeaponPunctureDepthMod: 0.03, WeaponRecoilReductionMod: -0.01, WeaponReloadSpeedMod: 0.005555, WeaponFactionDamageCorpus: 0.005, WeaponFactionDamageGrineer: 0.005, WeaponFactionDamageInfested: 0.005, WeaponZoomFovMod: 0.0089 },
  pistol: { WeaponArmorPiercingDamageMod: 0.01333, WeaponCritChanceMod: 0.016666, WeaponCritDamageMod: 0.01, WeaponElectricityDamageMod: 0.01, WeaponFireDamageMod: 0.01, WeaponFireRateMod: 0.0083, WeaponFreezeDamageMod: 0.01, WeaponImpactDamageMod: 0.013333, WeaponProcTimeMod: 0.01111, WeaponSlashDamageMod: 0.013333, WeaponStunChanceMod: 0.01, WeaponToxinDamageMod: 0.01, WeaponAmmoMaxMod: 0.01, WeaponClipMaxMod: 0.005555, WeaponDamageAmountMod: 0.0244, WeaponFireIterationsMod: 0.0133, WeaponProjectileSpeedMod: 0.01, WeaponPunctureDepthMod: 0.03, WeaponRecoilReductionMod: -0.01, WeaponReloadSpeedMod: 0.005555, WeaponFactionDamageCorpus: 0.005, WeaponFactionDamageGrineer: 0.005, WeaponFactionDamageInfested: 0.005, WeaponZoomFovMod: 0.0089 },
  rifle: { WeaponArmorPiercingDamageMod: 0.01333, WeaponCritChanceMod: 0.016666, WeaponCritDamageMod: 0.013333, WeaponElectricityDamageMod: 0.01, WeaponFireDamageMod: 0.01, WeaponFireRateMod: 0.00667, WeaponFreezeDamageMod: 0.01, WeaponImpactDamageMod: 0.013333, WeaponProcTimeMod: 0.01111, WeaponSlashDamageMod: 0.013333, WeaponStunChanceMod: 0.01, WeaponToxinDamageMod: 0.01, WeaponAmmoMaxMod: 0.00555, WeaponClipMaxMod: 0.005555, WeaponDamageAmountMod: 0.018333, WeaponFireIterationsMod: 0.01, WeaponProjectileSpeedMod: 0.01, WeaponPunctureDepthMod: 0.03, WeaponRecoilReductionMod: -0.01, WeaponReloadSpeedMod: 0.005555, WeaponFactionDamageCorpus: 0.005, WeaponFactionDamageGrineer: 0.005, WeaponFactionDamageInfested: 0.005, WeaponZoomFovMod: 0.006666 },
  shotgun: { WeaponArmorPiercingDamageMod: 0.01333, WeaponCritChanceMod: 0.01, WeaponCritDamageMod: 0.01, WeaponElectricityDamageMod: 0.01, WeaponFireDamageMod: 0.01, WeaponFireRateMod: 0.01, WeaponFreezeDamageMod: 0.01, WeaponImpactDamageMod: 0.013333, WeaponProcTimeMod: 0.01111, WeaponSlashDamageMod: 0.013333, WeaponStunChanceMod: 0.01, WeaponToxinDamageMod: 0.01, WeaponAmmoMaxMod: 0.01, WeaponClipMaxMod: 0.005555, WeaponDamageAmountMod: 0.0183, WeaponFireIterationsMod: 0.0133, WeaponProjectileSpeedMod: 0.01, WeaponPunctureDepthMod: 0.03, WeaponRecoilReductionMod: -0.01, WeaponReloadSpeedMod: 0.005555, WeaponFactionDamageCorpus: 0.005, WeaponFactionDamageGrineer: 0.005, WeaponFactionDamageInfested: 0.005 },
  melee: { WeaponMeleeDamageMod: 0.0183, WeaponArmorPiercingDamageMod: 0.0133, WeaponImpactDamageMod: 0.0133, WeaponSlashDamageMod: 0.0133, WeaponCritChanceMod: 0.02, WeaponCritDamageMod: 0.01, WeaponElectricityDamageMod: 0.01, WeaponFireDamageMod: 0.01, WeaponFreezeDamageMod: 0.01, WeaponToxinDamageMod: 0.01, WeaponProcTimeMod: 0.01111, WeaponMeleeFactionDamageCorpus: 0.005, WeaponMeleeFactionDamageGrineer: 0.005, WeaponMeleeFactionDamageInfested: 0.005, WeaponFireRateMod: 0.0061, WeaponStunChanceMod: 0.01, ComboDurationMod: 0.09, SlideAttackCritChanceMod: 0.013334, WeaponMeleeRangeIncMod: 0.02158, WeaponMeleeFinisherDamageMod: 0.0133, WeaponMeleeComboEfficiencyMod: 0.00816, WeaponMeleeComboInitialBonusMod: 0.27224, WeaponMeleeComboPointsOnHitMod: -0.01165, WeaponMeleeComboBonusOnHitMod: 0.00653 },
};

/** Wiki Riven Mods § Spliced Values (rank-8 base %) / 90 / 100. Always positive. */
const SPLICED_COEFFICIENTS: Record<string, number> = {
  WeaponViralDamageMod: 0.01,
  WeaponCorrosiveDamageMod: 0.01,
  WeaponGasDamageMod: 0.01,
  WeaponRadiationDamageMod: 0.01,
  WeaponBlastDamageMod: 0.01,
  WeaponMagneticDamageMod: 0.01,
  WeaponStatusDamage: 0.01,
  WeaponFactionDamageCorrupted: 0.005,
  WeaponFactionDamageOrokin: 0.005,
  WeaponFactionDamageScaldra: 0.005,
  WeaponFactionDamageTechrot: 0.005,
  WeaponWeakpointDamage: 0.025,
  WeaponWeakpointCriticalChance: 0.0275,
  WeaponAmmoEfficiency: 0.005,
  WeaponMagazineReloadHolstered: 0.01,
  WeaponMeleeHeavyAttackChargeMod: 0.0133,
  WeaponMeleeHeavyAttackDamageMod: 0.0133,
  WeaponMeleeSlamDamageMod: 0.0133,
  WeaponMeleeParryAngleMod: 0.009,
};

/** Legacy alias tags (DE renamed a few) → current coefficient tag. */
const TAG_ALIAS: Record<string, string> = {
  WeaponPunctureDamageMod: "WeaponArmorPiercingDamageMod",
  WeaponProcChanceMod: "WeaponStunChanceMod",
  WeaponZoomMod: "WeaponZoomFovMod",
  WeaponPunchThroughMod: "WeaponPunctureDepthMod",
  WeaponComboDurationMod: "ComboDurationMod",
};

const ROLL_TYPE_PATTERNS: Array<[RegExp, RivenRollType]> = [
  [/LotusModularPistolRandomMod|CompanionWeaponRandomMod/i, "kitgun"],
  [/LotusModularMeleeRandomMod/i, "zaw"],
  [/LotusArchgunRandomMod/i, "archgun"],
  [/LotusPistolRandomMod/i, "pistol"],
  [/LotusShotgunRandomMod/i, "shotgun"],
  [/LotusRifleRandomMod/i, "rifle"],
  [/PlayerMeleeWeaponRandomMod/i, "melee"],
];

export function rivenRollTypeFromUniqueName(uniqueName: string): RivenRollType | undefined {
  for (const [re, t] of ROLL_TYPE_PATTERNS) if (re.test(uniqueName)) return t;
  return undefined;
}

export function rivenTagCoefficient(type: RivenRollType, tag: string): number | undefined {
  const t = TAG_ALIAS[tag] ?? tag;
  return RIVEN_TAG_COEFFICIENTS[type][t] ?? SPLICED_COEFFICIENTS[t] ?? SPLICED_COEFFICIENTS[tag];
}

/** Wiki L (bonus): 2+0 0.99, 2+1 1.2375, 3+0 0.75, 3+1 0.9375 (= 1.5 × numBuffsAtten × 1.25^curses). */
const BUFF_ATTEN = [0, 1, 0.66, 0.5, 0.4, 0.35];
/** Wiki L (malus): 2 buffs 0.495, 3 buffs 0.75 (= 1.5 × numBuffsCurseAtten). */
const CURSE_ATTEN_BY_BUFFS = [0, 1, 0.33, 0.5, 1.25, 1.5];

/** True when every val is a normalized roll (0..1), i.e. a real arsenal export. */
export function rivenValsAreRolls(vals: number[]): boolean {
  return vals.length > 0 && vals.every((v) => Number.isFinite(v) && v >= 0 && v <= 1);
}

/**
 * Attribute modifier v for one riven attribute (before display conversion), signed as the game
 * signs it: buffs use b, curses use −b. Recoil's b is negative, so a recoil buff is negative.
 */
export function rivenAttributeValue(opts: {
  type: RivenRollType;
  tag: string;
  u: number;
  rank: number;
  buffCount: number;
  curseCount: number;
  isCurse: boolean;
  disposition?: number;
}): number | undefined {
  const b = rivenTagCoefficient(opts.type, opts.tag);
  if (b == null) return undefined;
  const r = Math.max(0, Math.min(8, Math.round(opts.rank)));
  const D = opts.disposition ?? STANDARD_RIVEN_DISPOSITION;
  const W = 0.9 + 0.2 * Math.max(0, Math.min(1, opts.u));
  const buffs = Math.max(1, Math.min(BUFF_ATTEN.length - 1, opts.buffCount));
  let L: number;
  if (opts.isCurse) {
    L = 1.5 * CURSE_ATTEN_BY_BUFFS[buffs] * BUFF_ATTEN[Math.max(1, Math.min(BUFF_ATTEN.length - 1, opts.curseCount))];
    return -b * 10 * (r + 1) * D * L * W;
  }
  L = 1.5 * BUFF_ATTEN[buffs] * Math.pow(1.25, opts.curseCount);
  return b * 10 * (r + 1) * D * L * W;
}
