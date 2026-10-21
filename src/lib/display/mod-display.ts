import type { Mod } from "@/lib/types";
import { modCapacityAtRank } from "@/lib/calc/mod-capacity";
import { getModStatLabel } from "@/lib/overrides/override-stat-catalog";

/** Strip wiki/HTML markup from mod descriptions for UI. */
export function cleanModDescription(description: string): string {
  return description
    .replace(/\\n/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const FLAT_STAT_KEYS = new Set([
  "range",
  "duration",
  "cooldown",
  "mutationStackBonus",
  "damageResistanceCap",
  "attractionRange",
  "allyRadius",
  "ricochetBounces",
  "syndicatePower",
  "blockAngle",
  "abilityProjectileCount",
  "impactStatusStacks",
  "reviveShieldHealth",
  "incapacitationTimerReduction",
  "ampCritDamage",
  "ampStatusDamage",
  "ampSchoolDamage",
  "ampEnergyRegen",
  "killsRequired",
]);

const PERCENT_LIKE_KEYS = new Set([
  "damage",
  "criticalChance",
  "criticalChanceOnHeadshot",
  "criticalChanceOnHeadshotKill",
  "criticalMultiplier",
  "fireRate",
  "attackSpeed",
  "multishot",
  "multishotOnKill",
  "slashOnCrit",
  "slashOnImpactProc",
  "extraElectricProcChance",
  "falloffDistance",
  "damageFirstShot",
  "statusChance",
  "abilityStrength",
  "abilityDuration",
  "abilityEfficiency",
  "abilityRange",
  "health",
  "shield",
  "armor",
  "energy",
  "sprintSpeed",
  "slideSpeed",
  "critBonusPerKill",
  "damageReductionPerKill",
  "tributeEfficiency",
  "speedPerCast",
  "damageResistancePerStack",
  "shieldRecharge",
  "shieldRechargeDelay",
  "aimGlide",
  "wallLatch",
  // Umbral mods' Tau resistance (wiki.warframe.com Umbral Vitality / Fiber / Intensify: +1%/rank, 11% R10).
  "tauResistance",
  // Chance to resist knockdown (wiki.warframe.com Sure Footed, Primed Sure Footed, Power Drift, Fortitude).
  "knockdownResistance",
  // Round 17 labels (wiki.warframe.com): Armored Evade/Acrobatics/Anti-Flak Plating "Mobility",
  // Agility Drift "Evasion", Mortal Conduct "Damage Reflected", Shield of Shadows damage redirected,
  // Orgone Tuning Matrix (fandom + WFCD; wiki page down) forge/elemental/turret heat rows.
  "mobility",
  "evasion",
  "damageReflected",
  "damageRedirectedPerShadow",
  "forgeCapacity",
  "forgeCooldown",
  "elementalResistance",
  "turretHeatCapacity",
  // Round 18: stats the wiki gives as % that showed a bare number (wiki.warframe.com Eagle Eye /
  // Hawk Eye "Zoom", Stabilizer / Steady Hands "Weapon Recoil", Suppress / Hush / Silent Battery
  // "Noise Reduction", the elemental / IPS mods, Magnum Force accuracy, etc.).
  "zoom",
  "recoil",
  "noiseReduction",
  "accuracy",
  "spread",
  "impact",
  "puncture",
  "slash",
  "heat",
  "cold",
  "toxin",
  "electricity",
  "blast",
  "radiation",
  "gas",
  "magnetic",
  "viral",
  "corrosive",
  "magazine",
  "ammoMaximum",
  "ammoConversion",
  "ammoEfficiency",
  "ampAmmoEfficiency",
  "ampEnergy",
  "ampMultishot",
  "aimGlideDuration",
  "armorDebuffOnKill",
  "shieldDebuffOnKill",
  "armorReduction",
  "auraStrengthSelf",
  "auraStrengthSquad",
  "blastRange",
  "bleedoutReduction",
  "bulletJump",
  "criticalChancePerCombo",
  "damagePerStatus",
  "damageVulnerability",
  "energyOnAbility",
  "gravityReduction",
  "hardLandingReduction",
  "headshotMultiplier",
  "heavyAttackEfficiency",
  "heavyWindUp",
  "knockdownRecovery",
  "lifeSteal",
  "lifestealToOwner",
  "operatorHealthShields",
  "operatorJumpHeight",
  "overshieldConversion",
  "parkourVelocity",
  "slashSize",
  "slideFriction",
  "statusDuration",
  "tauronCharge",
  "transferenceStaticDuration",
  "turretRange",
  "voidModeEfficiency",
  "voidSlingDistance",
  "voidSlingEfficiency",
  // Round 18 stray-damage relabels (wiki.warframe.com stat tables).
  "damageRedirected",
  "damageBlock",
  "maxHealthAbsorbed",
  "sandstormRange",
  "reckoningRange",
  "provokeStrength",
  "pacifySlow",
]);

/**
 * Mods whose stat is a flat number although the key is a % stat elsewhere (wiki.warframe.com):
 * Stinging Truth "+40 Magazine Capacity", Shattering Impact "reduces enemy Armor by 6".
 */
const FLAT_STAT_KEYS_BY_MOD: Record<string, ReadonlySet<string>> = {
  stinging_truth: new Set(["magazine"]),
  augment_universal_shattering_impact: new Set(["armorReduction"]),
};

/**
 * Mods whose stat is a % although the key is flat elsewhere (wiki.warframe.com): Corrupt Charge /
 * True Punishment "-50% Combo Duration" (other mods give Combo Duration in seconds), Endurance Drift
 * "+10% Energy Max".
 */
const PERCENT_STAT_KEYS_BY_MOD: Record<string, ReadonlySet<string>> = {
  corrupt_charge: new Set(["comboDuration"]),
  true_punishment: new Set(["comboDuration"]),
  endurance_drift: new Set(["energyMax"]),
};

/**
 * wiki.warframe.com stat tables for mods whose values aren't linear in rank (index = rank).
 * Display only: the card shows the wiki value at each rank instead of perRank × (rank + 1).
 */
const MOD_RANK_VALUE_TABLES: Record<string, Record<string, readonly number[]>> = {
  // Adaptation: +5% … +10% per stack, 10 s … 20 s (R0–R10); calculator: adaptationDrPerStack.
  adaptation: {
    damageResistancePerStack: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    duration: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
  // Immolated Radiance: shares 20/30/40/50% of Immolation's damage reduction (R0–R3).
  immolated_radiance: { sharedDamageReduction: [20, 30, 40, 50] },
  // Warding Thurible: allies take 30/35/40/50% less damage (R0–R3).
  warding_thurible: { allyDamageReduction: [30, 35, 40, 50] },
  // Shield of Shadows: each Shadow takes 3/4/5/6% of Nekros's damage, 50 m at every rank (R0–R3).
  augment_nekros_shield_of_shadows: { damageRedirectedPerShadow: [3, 4, 5, 6], range: [50, 50, 50, 50] },
  // Electromagnetic Shielding: redirects 25 … 50% of allies' damage within 2 … 12 m (R0–R5).
  electromagnetic_shielding: { allyDamageRedirected: [25, 30, 35, 40, 45, 50], range: [2, 4, 6, 8, 10, 12] },
  // Stasis Field: the field lasts 5 … 30 s (R0–R5).
  stasis_field: { duration: [5, 10, 15, 20, 25, 30] },
  // Mortal Conduct: reflect window 2/4/6/8 s (R0–R3).
  mortal_conduct: { duration: [2, 4, 6, 8] },
  // Reach: +1.5 m at the wiki infobox Max Rank 5, linear 0.25 m/rank (R0–R5).
  reach_r3: { range: [0.25, 0.5, 0.75, 1, 1.25, 1.5] },
  // Intruder: +8s to Hacking at the wiki infobox Max Rank 3, linear 2 s/rank (R0–R3).
  intruder: { duration: [2, 4, 6, 8] },
  // Round 18 (wiki.warframe.com stat tables, index = rank).
  // Auto Omni: 17/34/51/68/85/100% repair chance (R0–R5).
  auto_omni: { repairChance: [17, 34, 51, 68, 85, 100] },
  // Mischief: decoy Evasion Chance 0/5/10/15%, invisible 6/7/8/9 s (R0–R3).
  mischief: { decoyEvasionChance: [0, 5, 10, 15], duration: [6, 7, 8, 9] },
  // Reflex Denial: 5–10 s, 2–12 m (R0–R5).
  reflex_denial: { duration: [5, 6, 7, 8, 9, 10], range: [2, 4, 6, 8, 10, 12] },
  // Tek Assault: immune 1–4 s (R0–R3).
  tek_assault_r3: { duration: [1, 2, 3, 4] },
  // Vicious Bond: spread radius 1.5–9 m (R0–R5).
  vicious_bond: { range: [1.5, 3, 4.5, 6, 7.5, 9] },
  // Rumbled: Rock Armor absorbs 200/225/250/300% max health (R0–R3).
  augment_atlas_rumbled: { maxHealthAbsorbed: [200, 225, 250, 300] },
  // Elemental Sandstorm: +20/30/40/50% Ability Range (R0–R3).
  augment_inaros_elemental_sandstorm: { sandstormRange: [20, 30, 40, 50] },
  // Capacitance: 1.5/2/2.5/3% Damage to Shield Conversion (R0–R3).
  augment_volt_capacitance: { damageToShieldConversion: [1.5, 2, 2.5, 3] },
  // Deceptive Bond: 20/30/45/50% Damage Redirected (R0–R3).
  deceptive_bond: { damageRedirected: [20, 30, 45, 50] },
  // Hallowed Reckoning: +40% Ability Range at every rank, 1.5–3 m radius (R0–R3).
  hallowed_reckoning: { reckoningRange: [40, 40, 40, 40], range: [1.5, 2, 2.5, 3] },
  // Peaceful Provocation: Pacify Slow 20/30/35/40%, Provoke Ability Strength +6/9/12/15% (R0–R3).
  peaceful_provocation: { pacifySlow: [20, 30, 35, 40], provokeStrength: [6, 9, 12, 15] },
  // Reverse Rotorswell: 20/25/30/35% of damage received redirected (R0–R3).
  reverse_rotorswell: { damageRedirected: [20, 25, 30, 35] },
  // Radiant Finish: blinded enemies take +150/200/250/300% Finisher Damage (R0–R3).
  augment_excalibur_radiant_finish: { finisherDamage: [150, 200, 250, 300] },
  // Heartseeker: targeting radius 0.25–1 m (R0–R3).
  heartseeker: { range: [0.25, 0.5, 0.75, 1] },
};

/** Card text for a stat that has a wiki rank table or a cap, else null (use the per-rank formula). */
export function formatModStatSpecial(modId: string, statKey: string, perRank: number, rank: number): string | null {
  const table = MOD_RANK_VALUE_TABLES[modId]?.[statKey];
  if (table) {
    const value = table[Math.min(Math.max(Math.round(rank), 0), table.length - 1)];
    const label = getModStatLabel(statKey);
    if (statKey === "duration") return `${formatStatNumber(value)}s ${label}`;
    if (statKey === "range") return `${formatStatNumber(value)}m ${label}`;
    return `${formatStatNumber(value)}% ${label}`;
  }
  // Adaptation: "Stacks up to 90%" (wiki); the cap doesn't scale with rank.
  if (statKey === "damageResistanceCap") return `Stacks up to ${perRank}%`;
  return null;
}

/** Flat seconds stored per rank (× (rank+1)), e.g. Aerodynamic +1s Aim Glide / +2s Wall Latch. */
const SECONDS_PER_RANK_KEYS = new Set(["aimGlideTime", "wallLatchTime"]);

/** Percent stats stored as the live value (not per-rank × (rank+1)). */
const RANK_INDEPENDENT_PERCENT_KEYS = new Set([
  "extraElectricProcChance",
]);

function usesPercentDisplay(statKey: string): boolean {
  if (RANK_INDEPENDENT_PERCENT_KEYS.has(statKey)) return true;
  if (FLAT_STAT_KEYS.has(statKey)) return false;
  if (PERCENT_LIKE_KEYS.has(statKey)) return true;
  if (statKey.endsWith("Chance") || statKey.endsWith("Percent") || statKey.endsWith("Bonus")) return true;
  return statKey.includes("Damage") || statKey.includes("Speed") || statKey.includes("Rate");
}

/** True when catalog stores a per-rank % that scales as base × (rank+1). */
export function isPercentLikeModStat(statKey: string): boolean {
  return usesPercentDisplay(statKey);
}

export function isFlatModStat(statKey: string): boolean {
  return FLAT_STAT_KEYS.has(statKey);
}

/**
 * One decimal when the value isn't a whole number and is under 100 (wiki tables: 12.5%, 22.5%,
 * Umbral Tau 14.3%, Primed Sure Footed 18.18% → 18.2%); whole numbers and values ≥ 100 show no
 * decimals. Float noise from per-rank storage (6.666667 × 6 = 40.000002) rounds to a whole number.
 */
export function formatStatNumber(value: number): string {
  const abs = Math.abs(value);
  const tenths = Math.round(abs * 10) / 10;
  const decimals = abs < 100 && tenths % 1 !== 0 ? 1 : 0;
  const body = value.toFixed(decimals);
  return value > 0 && Number(body) !== 0 ? `+${body}` : body;
}

/** Per-rank catalog value → total at a given rank (mods store per-rank increments). */
export function modStatTotalAtRank(perRank: number, rank: number): number {
  return perRank * (rank + 1);
}

export function formatModStatValue(
  statKey: string,
  perRank: number,
  rank: number,
  multiplier = 1,
): string {
  const total = modStatTotalAtRank(perRank, rank) * multiplier;
  const label = getModStatLabel(statKey);
  if (statKey === "ampBonusDamage") {
    return `x${total.toFixed(1)} ${label}`;
  }
  if (statKey === "critDecayPerSecond") {
    return `${formatStatNumber(total)}%/s ${label}`;
  }
  if (usesPercentDisplay(statKey)) {
    return `${formatStatNumber(total)}% ${label}`;
  }
  if (statKey === "ricochetBounces") {
    return `${formatStatNumber(perRank)} bounces`;
  }
  if (statKey === "syndicatePower") {
    return `+${perRank} syndicate power`;
  }
  if (statKey === "abilityProjectileCount") {
    return `${formatStatNumber(perRank)} projectiles`;
  }
  if (statKey === "range" || statKey === "attractionRange" || statKey === "allyRadius" || statKey === "blastStaggerRadius") {
    return `${formatStatNumber(total)}m ${label}`;
  }
  if (statKey === "duration" || statKey === "cooldown" || SECONDS_PER_RANK_KEYS.has(statKey)) {
    return `${formatStatNumber(total)}s ${label}`;
  }
  return `${formatStatNumber(total)} ${label}`;
}

export interface ModStatDisplayLine {
  statKey: string;
  label: string;
  atRank: string;
  atMax: string;
}

export function getModStatDisplayLines(mod: Mod, rank: number): ModStatDisplayLine[] {
  const stats = mod.stats ?? {};
  return Object.entries(stats).map(([statKey, perRank]) => {
    const special = formatModStatSpecial(mod.id, statKey, perRank, rank);
    if (special !== null) {
      const atMax = formatModStatSpecial(mod.id, statKey, perRank, mod.maxRank)!;
      return { statKey, label: getModStatLabel(statKey), atRank: special, atMax: rank >= mod.maxRank ? special : atMax };
    }
    const flatForMod = FLAT_STAT_KEYS_BY_MOD[mod.id]?.has(statKey) === true;
    if (flatForMod || PERCENT_STAT_KEYS_BY_MOD[mod.id]?.has(statKey)) {
      const label = getModStatLabel(statKey);
      const unit = flatForMod ? "" : "%";
      const flatAt = (r: number) => `${formatStatNumber(modStatTotalAtRank(perRank, r))}${unit} ${label}`;
      const atRank = flatAt(rank);
      return { statKey, label, atRank, atMax: rank >= mod.maxRank ? atRank : flatAt(mod.maxRank) };
    }
    const unscaled = FLAT_STAT_KEYS.has(statKey) || RANK_INDEPENDENT_PERCENT_KEYS.has(statKey);
    const atRank = unscaled
      ? formatModStatValue(statKey, perRank, 0)
      : formatModStatValue(statKey, perRank, rank);
    const atMax = unscaled
      ? atRank
      : formatModStatValue(statKey, perRank, mod.maxRank);
    return {
      statKey,
      label: getModStatLabel(statKey),
      atRank,
      atMax: rank >= mod.maxRank ? atRank : atMax,
    };
  });
}

/**
 * Capacity at a rank, same rule as the calculator (modCapacityAtRank): +1 per rank for normal
 * mods, -1 per rank for negative-drain mods (stances, Orgone Tuning Matrix: -2 R0 → -7 R5).
 */
export function modDrainAtRank(baseDrain: number, rank: number): number {
  return modCapacityAtRank(baseDrain, rank);
}
