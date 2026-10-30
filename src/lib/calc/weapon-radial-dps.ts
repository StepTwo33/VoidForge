import type { CalculatedStats, Weapon, WeaponRadialAttack } from "@/lib/types";
import { avgCritMultiplier } from "@/lib/calc/crit-utils";
import { ammoConsumptionFactor, neverConsumesAmmo } from "@/lib/calc/ammo-efficiency";
import { getWeaponRadialAttacks } from "@/lib/weapons/weapon-radial-utils";

export interface ScaledRadialAttack extends WeaponRadialAttack {
  /** Average damage after linear radius falloff (center = full, edge = 1 − falloffReduction). */
  avgDamage: number;
  /** Estimated single-target burst DPS (full damage on the direct-hit enemy); 0 for manual slams. */
  burstDps: number;
  /** True when this explosion is already part of the weapon's damage stat (launchers) — not re-added to DPS. */
  includedInDirect?: boolean;
}

/** Linear falloff average: center full damage, edge reduced by falloffReduction. */
export function avgRadialDamage(attack: WeaponRadialAttack): number {
  const falloff = attack.falloffReduction ?? 0;
  return attack.totalDamage * (1 - falloff * 0.5);
}

function isManualSlam(name: string): boolean {
  return /\bslam attack\b|\bheavy slam\b|\bground slam\b/i.test(name);
}

/**
 * Situational radials that do NOT accompany every primary shot: alt/secondary
 * fire modes, manual detonations, reload/turret/headshot triggers, deployed
 * cubes, ramping attack stages. Shown in the panel but excluded from auto DPS
 * (counting them at primary fire rate massively overstates DPS).
 *
 * Exact names (case-insensitive), not substrings: a substring match on
 * "charged" once caught Staticor's "Uncharged Explosion" and dropped its
 * normal-fire AoE from DPS. A radial whose name is not listed here counts.
 */
const SITUATIONAL_RADIAL_NAMES = new Set(
  [
    "1st Attack Radial Attack",
    "2nd Attack Radial Attack",
    "3rd Attack Radial Attack",
    "4th Attack Radial Attack",
    "5th Attack Radial Attack",
    "6th Attack Radial Attack",
    "Air Burst Explosion",
    "Alt-Fire AoE",
    "Alt-Fire Damage over Time",
    "Alt-Fire Explosion",
    "Alt-Fire Radial Attack",
    "Attraction Field",
    "Charged Throw Bounce Explosion",
    "Charged Throw Recall Explosion",
    "Cluster Bombs Explosion",
    "Cube (shot by player)",
    "Cube Explosion",
    "Embedded Detonation",
    "Grenade AoE",
    "Grenade Bounce AoE",
    "Headshot Explosion",
    "Homing Spore Explosion",
    "Incarnon Form Bounce Explosion",
    "Incarnon Form Headshot AoE",
    "Lock-On Radial Attack",
    "Mid-Flight Detonation",
    "Orb Explosion",
    "Orb Merging Damage",
    "Partial Reload Explosion",
    "Plasma Bomb Explosion",
    "Reload From Empty Explosion",
    "Secondary Fire AoE",
    "Throw Bounce Explosion",
    "Throw Recall Explosion",
  ].map((n) => n.toLowerCase()),
);

/**
 * Charged-shot radials: alt-fire on regular weapons, but the primary fire on
 * bows/charge weapons (e.g. Proboscis Cernos Charged Shot Explosion).
 */
const CHARGED_RADIAL_NAMES = new Set(
  [
    "Charged AoE",
    "Charged Radial Attack",
    "Charged Shot AoE",
    "Charged Shot Explosion",
    "Fully Charged Explosion",
  ].map((n) => n.toLowerCase()),
);

export function isSituationalRadial(name: string, chargeIsPrimary: boolean): boolean {
  const key = name.trim().toLowerCase();
  if (SITUATIONAL_RADIAL_NAMES.has(key)) return true;
  if (CHARGED_RADIAL_NAMES.has(key) && !chargeIsPrimary) return true;
  return false;
}

/** Radials that only exist in Incarnon form — excluded from DPS unless Incarnon is active. */
function isIncarnonFormAttack(attack: WeaponRadialAttack): boolean {
  return /incarnon form/i.test(attack.name);
}

function shotsPerSecond(stats: Pick<CalculatedStats, "fireRate" | "effectiveFireRate">): number {
  if (stats.effectiveFireRate != null && stats.effectiveFireRate > 0) {
    return stats.effectiveFireRate;
  }
  return Math.max(0, stats.fireRate);
}

/** Infer how often this radial fires alongside the primary attack pattern. */
export function radialAttacksPerSecond(
  attack: WeaponRadialAttack,
  stats: Pick<CalculatedStats, "fireRate" | "effectiveFireRate" | "multishot">,
  isMelee: boolean,
  chargeIsPrimary = false,
): number {
  if (isManualSlam(attack.name)) return 0;
  // Exalted Blade wave: one per swing (wiki), point-blank single target (no 40%/s or
  // 20%/enemy decay applied).
  if (attack.perSwing) return Math.max(0, stats.effectiveFireRate ?? stats.fireRate);
  // Melee radials (glaive throws, slam shockwaves) are manual actions —
  // never fire at attack-speed rate, so keep them out of sustained DPS.
  if (isMelee) return 0;
  // Alt-fires, manual detonations, reload/headshot triggers etc. don't
  // accompany the primary fire — panel-only.
  if (isSituationalRadial(attack.name, chargeIsPrimary)) return 0;
  const efr = shotsPerSecond(stats);
  // Incarnon-form radials fire once per trigger pull.
  if (isIncarnonFormAttack(attack)) return efr;
  // Innate per-projectile / per-pellet explosions (delayed or not) scale with
  // multishot — each projectile explodes (e.g. Kompressa bubbles).
  return efr * stats.multishot;
}

/**
 * Evolution-gated radials (e.g. Miter Sawblade Storm) merged from incarnonStatChanges.
 * Excluded while Incarnon Form is active when the perk does not affect form.
 */
export function evolutionExtraRadials(
  incarnonStatChanges: Record<string, number> | undefined,
  incarnonFormActive: boolean,
): WeaponRadialAttack[] {
  if (incarnonFormActive || !incarnonStatChanges) return [];
  const blast = incarnonStatChanges.sawbladeStormBlast;
  if (blast == null || blast <= 0) return [];
  return [
    {
      name: "Sawblade Storm Explosion",
      blast,
      totalDamage: blast,
      radius: incarnonStatChanges.sawbladeStormRadius ?? 5,
    },
  ];
}

export function scaleRadialAttacksWithDps(
  baseWeapon: Weapon,
  stats: CalculatedStats,
  /** Whether Incarnon form is active (evolutions selected) — gates Incarnon-only radials. */
  incarnonActive = false,
  /** Extra radials from selected evolutions (Sawblade Storm, etc.). */
  extraRadials: WeaponRadialAttack[] = [],
): {
  attacks: ScaledRadialAttack[];
  radialBurstDps: number;
  radialSustainedDps: number;
  /** Fraction of direct burst DPS to remove (folded explosion losing direct-only bonuses). */
  directAoeCorrection: number;
} {
  const attacks = [...getWeaponRadialAttacks(baseWeapon), ...extraRadials];
  if (!attacks.length || !baseWeapon.damage) {
    return { attacks: [], radialBurstDps: 0, radialSustainedDps: 0, directAoeCorrection: 0 };
  }

  const isMelee =
    baseWeapon.category === "melee" || baseWeapon.triggerType === "Melee";
  // Bows / charge-trigger weapons: their "Charged …" radial IS the primary fire.
  const chargeIsPrimary =
    baseWeapon.triggerType === "Bow" ||
    baseWeapon.triggerType === "Charge" ||
    baseWeapon.chargeMode != null ||
    (baseWeapon.chargeTime ?? 0) > 0;
  // Launchers (Bramma, Tonkor, Zarr, …) fold the explosion into the weapon's
  // damage stat: damage − (IPS + elements) ≈ the radial's damage. Adding such
  // a radial to DPS again would double-count the explosion.
  const partsSum =
    (baseWeapon.impact ?? 0) + (baseWeapon.puncture ?? 0) + (baseWeapon.slash ?? 0) +
    (["heat", "cold", "toxin", "electricity", "blast", "radiation", "gas", "magnetic", "viral", "corrosive", "tau"] as const)
      .reduce((sum, key) => sum + ((baseWeapon as unknown as Record<string, number>)[key] ?? 0), 0);
  let directResidual = Math.max(0, baseWeapon.damage - partsSum);
  // wiki (both): Galvanized per-status / CO bonuses are direct-hit only, not AoE.
  const applied = stats.appliedBaseDamageBonus ?? 0;
  const directOnly = stats.directOnlyDamageBonus ?? 0;
  const aoeFactor = directOnly > 0 && 1 + applied > 0 ? (1 + applied - directOnly) / (1 + applied) : 1;
  const mult = (stats.totalDamage / baseWeapon.damage) * aoeFactor;
  let directAoeCorrection = 0;
  const avgCrit = avgCritMultiplier(
    stats.criticalChance + (stats.vigilanteCritBonus ?? 0),
    stats.criticalMultiplier,
  );

  let radialBurstDps = 0;
  const scaled: ScaledRadialAttack[] = attacks.map((attack) => {
    // Komorex: "3.5x Zoom Radial Attack" only exists at max zoom; its 53 → 106 doubling comes
    // through `mult` (the zoom's +100% IPS doubles total damage).
    const zoomRadial = /zoom radial/i.test(attack.name);
    const zoomMult = zoomRadial ? (stats.sniperZoomRadialMult ?? 0) : 1;
    const totalDamage = attack.totalDamage * mult * zoomMult;
    const scaledAttack: WeaponRadialAttack = {
      name: attack.name,
      radius: attack.radius,
      totalDamage,
    };
    if (attack.perSwing) scaledAttack.perSwing = true;
    if (attack.falloffReduction != null) {
      scaledAttack.falloffReduction = attack.falloffReduction;
    }
    if (attack.explosionDelay != null) {
      scaledAttack.explosionDelay = attack.explosionDelay;
    }
    for (const key of [
      "impact", "puncture", "slash", "heat", "cold", "toxin", "electricity",
      "radiation", "viral", "corrosive", "blast", "gas", "magnetic", "tau",
    ] as const) {
      const val = attack[key];
      if (val != null && val > 0) scaledAttack[key] = val * mult * zoomMult;
    }

    const avgDamage = avgRadialDamage(scaledAttack);
    // Incarnon-form radials don't fire in normal form — exclude from DPS
    // unless Incarnon evolutions are active in the build.
    const gatedOut = (isIncarnonFormAttack(scaledAttack) && !incarnonActive) || zoomMult === 0;
    // Match this radial against the weapon's residual damage: if the residual
    // roughly equals the explosion, it's already counted in direct DPS.
    // Data-flagged rows (Glory) are the direct hit itself — never re-added to DPS.
    let includedInDirect = !gatedOut && attack.includedInDirect === true;
    if (
      !includedInDirect &&
      !gatedOut &&
      directResidual > 0 &&
      attack.totalDamage > 0 &&
      attack.totalDamage >= directResidual * 0.5 &&
      attack.totalDamage <= directResidual * 2.5
    ) {
      includedInDirect = true;
      // Share of the direct hit that is really this explosion loses the direct-only bonus.
      directAoeCorrection += Math.min(1, attack.totalDamage / baseWeapon.damage) * (1 - aoeFactor);
      directResidual = 0;
    }
    const rate =
      gatedOut || includedInDirect
        ? 0
        : radialAttacksPerSecond(scaledAttack, stats, isMelee, chargeIsPrimary);
    // wiki: falloff scales with distance from the blast centre, so the directly hit
    // enemy takes the full radial — single-target DPS uses full damage; avgDamage
    // (area average) stays for the panel.
    const burstDps = rate > 0 ? totalDamage * rate * avgCrit : 0;
    radialBurstDps += burstDps;

    return { ...scaledAttack, avgDamage, burstDps, includedInDirect };
  });

  let radialSustainedDps = radialBurstDps;
  const efr = shotsPerSecond(stats);
  // Bow cycle already includes reload in effective FR (calculateSustainedDps returns
  // burst for bows) — radials must not apply the mag/reload factor a second time.
  const isBow =
    (baseWeapon.chargeMode === "bow" || baseWeapon.triggerType === "Bow") && baseWeapon.chargeTime != null;
  if (!isMelee && !isBow && stats.magazine > 0 && efr > 0) {
    // Match direct sustained: ammo-restore + instant-reload (one opportunity / mag).
    const restoreP = stats.ammoRestoreChance ?? 0;
    const expectedRestore =
      restoreP * (stats.ammoRestoreFlat ?? 0) +
      restoreP * (stats.ammoRestoreMagFraction ?? 0) * stats.magazine;
    const ammoCost = Math.max(0.01, stats.ammoCost ?? 1);
    const ammoPerShot = neverConsumesAmmo(stats.infiniteAmmoUptime)
      ? 1e-9
      : ammoCost * ammoConsumptionFactor(stats.ammoEfficiency, stats.infiniteAmmoUptime);
    const magTime = (stats.magazine + expectedRestore) / (ammoPerShot * efr);
    const instantReloadChance = Math.min(
      1,
      (stats.instantReloadOnKillChance ?? 0) + (stats.instantReloadOnHeadshotChance ?? 0),
    );
    const effectiveReload = stats.reloadTime * (1 - instantReloadChance);
    const cycleTime = magTime + effectiveReload;
    if (cycleTime > 0) {
      radialSustainedDps = radialBurstDps * (magTime / cycleTime);
    }
  }

  return { attacks: scaled, radialBurstDps, radialSustainedDps, directAoeCorrection };
}
