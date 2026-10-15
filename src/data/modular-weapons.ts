// Modular Weapons Data - Kitguns, Zaws, Amps
// Sources: https://warframe.fandom.com/wiki/Kitgun, https://warframe.fandom.com/wiki/Zaw, https://warframe.fandom.com/wiki/Amp
// Last verified: 2025-04

import { Weapon } from "@/lib/types";

// ── KITGUN SYSTEM ──────────────────────────────────────────────────────────
// Kitguns use a lookup-table system: chambers define base damage/types,
// grips define per-category damage bonus + fire rate, loaders define
// crit/status/magazine/reload. Stats are NOT simple multipliers.

type ChamberCategory = "projectile_shotgun" | "projectile_rifle" | "hitscan_auto" | "beam";

export interface KitgunChamber {
  id: string;
  name: string;
  description: string;
  category: ChamberCategory;
  baseDamage: number;
  damageRatios: Record<string, number>;
  triggerPrimary: string;
  triggerSecondary: string;
  baseCritChance: number;
  baseCritMultiplier: number;
  /** Primary-grip base CM when it differs from the secondary (wiki loader tables). */
  baseCritMultiplierPrimary?: number;
  baseStatusChance: number;
  magazineTiers: number[];
}

export interface KitgunGrip {
  id: string;
  name: string;
  type: "primary" | "secondary";
  description: string;
  bonuses: Record<ChamberCategory, { damage: number; fireRate: number }>;
}

export interface KitgunLoader {
  id: string;
  name: string;
  critChanceBonus: number;
  critMultiplierBonus: number;
  statusChanceBonus: number;
  magazineTier: number;
  reloadTime: number;
}

// ── KITGUN CHAMBERS ─────────────────────────────────────────────────────
/** Chamber Damage.Base from Module:Modular/data KitgunSecondary (wiki-locked B15). */
export const kitgunChambers: KitgunChamber[] = [
  {
    id: "catchmoon_chamber", name: "Catchmoon",
    description: "Wide plasma projectile with infinite body punch through. Short range with damage falloff. Impact/Heat.",
    category: "projectile_shotgun", baseDamage: 256,
    damageRatios: { impact: 89 / 256, heat: 167 / 256 },
    triggerPrimary: "Auto", triggerSecondary: "Semi-Auto",
    baseCritChance: 0.21, baseCritMultiplier: 2.0, baseStatusChance: 0.21,
    magazineTiers: [5, 7, 9, 11, 13, 17, 23, 39],
  },
  {
    id: "sporelacer_chamber", name: "Sporelacer",
    description: "Explosive spore projectiles with AoE on impact. Impact/Toxin damage.",
    category: "projectile_shotgun", baseDamage: 90,
    damageRatios: { impact: 21 / 90, toxin: 69 / 90 },
    triggerPrimary: "Auto", triggerSecondary: "Semi-Auto",
    baseCritChance: 0.21, baseCritMultiplier: 3.0, baseStatusChance: 0.21,
    // Wiki Sporelacer primary loader table: base CM 2.0x (secondary 3.0x).
    baseCritMultiplierPrimary: 2.0,
    magazineTiers: [5, 7, 9, 11, 13, 17, 23, 39],
  },
  {
    id: "tombfinger_chamber", name: "Tombfinger",
    description: "Precise projectile with explosion on impact. Primary charges for larger AoE. Impact/Puncture/Radiation.",
    category: "projectile_rifle", baseDamage: 84,
    damageRatios: { impact: 16 / 84, puncture: 9 / 84, radiation: 59 / 84 },
    triggerPrimary: "Charge", triggerSecondary: "Semi-Auto",
    baseCritChance: 0.24, baseCritMultiplier: 2.0, baseStatusChance: 0.24,
    magazineTiers: [9, 15, 19, 23, 29, 31, 35, 49],
  },
  {
    id: "rattleguts_chamber", name: "Rattleguts",
    description: "Rapid-fire hitscan automatic weapon. High fire rate, low per-shot damage. Impact/Puncture/Slash/Radiation.",
    category: "hitscan_auto", baseDamage: 33,
    damageRatios: { impact: 2 / 33, puncture: 10 / 33, slash: 8 / 33, radiation: 13 / 33 },
    triggerPrimary: "Auto", triggerSecondary: "Auto",
    baseCritChance: 0.19, baseCritMultiplier: 2.0, baseStatusChance: 0.19,
    // Wiki Rattleguts loader table: tier 3 (Bashrack/Deepbreath/Ramflare/Sparkfire/Splat) = 64.
    magazineTiers: [29, 45, 57, 64, 83, 75, 111, 153],
  },
  {
    id: "gaze_chamber", name: "Gaze",
    description: "Continuous beam weapon. Secondary is single-target beam, primary chains to multiple enemies. Puncture/Radiation.",
    category: "beam", baseDamage: 18,
    damageRatios: { puncture: 7 / 18, radiation: 11 / 18 },
    triggerPrimary: "Held", triggerSecondary: "Held",
    baseCritChance: 0.25, baseCritMultiplier: 2.0, baseStatusChance: 0.25,
    magazineTiers: [23, 31, 37, 43, 51, 49, 85, 113],
  },
  {
    id: "vermisplicer_chamber", name: "Vermisplicer",
    description: "Infested beam that fires homing tendrils. Secondary latches onto targets, primary chains. Puncture/Toxin.",
    category: "beam", baseDamage: 14,
    damageRatios: { impact: 1.5 / 14, puncture: 3.5 / 14, slash: 4.5 / 14, toxin: 4.5 / 14 },
    triggerPrimary: "Held", triggerSecondary: "Held",
    baseCritChance: 0.25, baseCritMultiplier: 2.0, baseStatusChance: 0.25,
    magazineTiers: [23, 31, 37, 43, 51, 49, 85, 113],
  },
];

// ── KITGUN GRIPS ─────────────────────────────────────────────────────────
// Per-category damage bonus (flat additive to chamber base) and fire rate (absolute).
export const kitgunGrips: KitgunGrip[] = [
  // Secondary grips
  {
    id: "grip_gibber", name: "Gibber", type: "secondary",
    description: "Lowest damage, highest fire rate. Spray-and-pray secondary.",
    bonuses: {
      // projectile_shotgun deltas from wiki Catchmoon; projectile_rifle from Tombfinger
      projectile_shotgun: { damage: -96, fireRate: 3.17 },
      projectile_rifle: { damage: -48, fireRate: 4.50 },
      hitscan_auto: { damage: -11, fireRate: 12.00 },
      beam: { damage: -2, fireRate: 12.00 },
    },
  },
  {
    id: "grip_ramble", name: "Ramble", type: "secondary",
    description: "Low damage, high fire rate. Fast-firing secondary.",
    bonuses: {
      projectile_shotgun: { damage: -48, fireRate: 2.50 },
      projectile_rifle: { damage: -24, fireRate: 3.67 },
      hitscan_auto: { damage: -6, fireRate: 8.83 },
      beam: { damage: -1, fireRate: 12.00 },
    },
  },
  {
    id: "grip_ulnaris", name: "Ulnaris", type: "secondary",
    description: "Balanced damage and fire rate. Versatile secondary grip.",
    bonuses: {
      projectile_shotgun: { damage: 34, fireRate: 1.83 },
      projectile_rifle: { damage: 16, fireRate: 2.83 },
      hitscan_auto: { damage: 6, fireRate: 6.67 },
      beam: { damage: 0, fireRate: 12.00 },
    },
  },
  {
    id: "grip_lovetap", name: "Lovetap", type: "secondary",
    description: "High damage, low fire rate. Hard-hitting secondary.",
    bonuses: {
      projectile_shotgun: { damage: 102, fireRate: 1.50 },
      projectile_rifle: { damage: 48, fireRate: 2.50 },
      hitscan_auto: { damage: 19, fireRate: 5.17 },
      beam: { damage: 1, fireRate: 12.00 },
    },
  },
  {
    id: "grip_haymaker", name: "Haymaker", type: "secondary",
    description: "Maximum damage, lowest fire rate. Big hits, slow shots.",
    bonuses: {
      projectile_shotgun: { damage: 204, fireRate: 1.17 },
      projectile_rifle: { damage: 96, fireRate: 2.17 },
      hitscan_auto: { damage: 38, fireRate: 3.67 },
      beam: { damage: 2, fireRate: 12.00 },
    },
  },
  // Primary grips
  {
    id: "grip_brash", name: "Brash", type: "primary",
    description: "Lowest damage, highest fire rate. Fast-firing primary.",
    bonuses: {
      projectile_shotgun: { damage: -24, fireRate: 5.67 },
      projectile_rifle: { damage: -20, fireRate: 3.77 },
      hitscan_auto: { damage: -2, fireRate: 17.00 },
      beam: { damage: -4, fireRate: 8.00 },
    },
  },
  {
    id: "grip_palmaris", name: "Palmaris", type: "primary",
    description: "Low damage, high fire rate. Rapid-fire primary grip.",
    bonuses: {
      projectile_shotgun: { damage: -18, fireRate: 5.17 },
      projectile_rifle: { damage: -15, fireRate: 3.45 },
      hitscan_auto: { damage: -1.5, fireRate: 15.50 },
      beam: { damage: -3, fireRate: 8.00 },
    },
  },
  {
    id: "grip_shrewd", name: "Shrewd", type: "primary",
    description: "Slightly below average damage, above average fire rate. Low recoil.",
    bonuses: {
      projectile_shotgun: { damage: -12, fireRate: 4.67 },
      projectile_rifle: { damage: -10, fireRate: 3.13 },
      hitscan_auto: { damage: -1, fireRate: 14.00 },
      beam: { damage: -2, fireRate: 8.00 },
    },
  },
  {
    id: "grip_steadyslam", name: "Steadyslam", type: "primary",
    description: "High damage, low fire rate. Heavy-hitting primary.",
    bonuses: {
      projectile_shotgun: { damage: 41, fireRate: 3.33 },
      projectile_rifle: { damage: 29, fireRate: 2.32 },
      hitscan_auto: { damage: 9, fireRate: 10.00 },
      beam: { damage: 2, fireRate: 8.00 },
    },
  },
  {
    id: "grip_tremor", name: "Tremor", type: "primary",
    description: "Maximum damage, lowest fire rate. Massive hits, high recoil.",
    bonuses: {
      projectile_shotgun: { damage: 82, fireRate: 3.00 },
      projectile_rifle: { damage: 58, fireRate: 2.13 },
      hitscan_auto: { damage: 18, fireRate: 9.00 },
      beam: { damage: 4, fireRate: 8.00 },
    },
  },
];

export interface KitgunGripRow {
  damage: number;
  types: Partial<Record<"impact" | "puncture" | "slash" | "heat" | "toxin" | "radiation" | "viral", number>>;
  /** Absent for beam chambers (grip changes beam range, not fire rate). */
  fireRate?: number;
}

/**
 * Per-chamber grip tables (wiki Module:Modular getKitgunTable / getKitgunPrimaryTable, "Grips" view).
 * damage = total base damage; types = per-type split; fireRate absent for beam chambers
 * (wiki: beam grips change range, not fire rate).
 */
export const KITGUN_GRIP_TABLE: Record<string, Record<string, KitgunGripRow>> = {
  catchmoon_chamber: {
    grip_gibber: { damage: 160, types: { impact: 41, heat: 119 }, fireRate: 3.17 },
    grip_ramble: { damage: 208, types: { impact: 65, heat: 143 }, fireRate: 2.5 },
    grip_lovetap: { damage: 358, types: { impact: 140, heat: 218 }, fireRate: 1.5 },
    grip_haymaker: { damage: 460, types: { impact: 191, heat: 269 }, fireRate: 1.17 },
    grip_ulnaris: { damage: 290, types: { impact: 106, heat: 184 }, fireRate: 1.83 },
    grip_brash: { damage: 110, types: { impact: 37, heat: 73 }, fireRate: 5.67 },
    grip_shrewd: { damage: 122, types: { impact: 43, heat: 79 }, fireRate: 4.67 },
    grip_steadyslam: { damage: 175, types: { impact: 69.5, heat: 105.5 }, fireRate: 3.33 },
    grip_tremor: { damage: 216, types: { impact: 90, heat: 126 }, fireRate: 3 },
    grip_palmaris: { damage: 116, types: { impact: 40, heat: 76 }, fireRate: 5.17 },
  },
  sporelacer_chamber: {
    grip_gibber: { damage: 103, types: { impact: 0, toxin: 103 }, fireRate: 3.17 },
    grip_ramble: { damage: 160, types: { impact: 9, toxin: 151 }, fireRate: 2.5 },
    grip_lovetap: { damage: 460, types: { impact: 159, toxin: 301 }, fireRate: 1.5 },
    grip_haymaker: { damage: 664, types: { impact: 261, toxin: 403 }, fireRate: 1.17 },
    grip_ulnaris: { damage: 324, types: { impact: 91, toxin: 233 }, fireRate: 1.83 },
    grip_brash: { damage: 90, types: { impact: 21, toxin: 69 }, fireRate: 5.67 },
    grip_shrewd: { damage: 114, types: { impact: 33, toxin: 81 }, fireRate: 4.67 },
    grip_steadyslam: { damage: 220, types: { impact: 86, toxin: 134 }, fireRate: 3.33 },
    grip_tremor: { damage: 302, types: { impact: 127, toxin: 175 }, fireRate: 3 },
    grip_palmaris: { damage: 102, types: { impact: 27, toxin: 75 }, fireRate: 5.17 },
  },
  tombfinger_chamber: {
    grip_gibber: { damage: 36, types: { impact: 8, puncture: 1, radiation: 27 }, fireRate: 4.5 },
    grip_ramble: { damage: 60, types: { impact: 12, puncture: 5, radiation: 43 }, fireRate: 3.67 },
    grip_lovetap: { damage: 132, types: { impact: 24, puncture: 17, radiation: 91 }, fireRate: 2.5 },
    grip_haymaker: { damage: 180, types: { impact: 32, puncture: 25, radiation: 123 }, fireRate: 2.17 },
    grip_ulnaris: { damage: 100.01, types: { impact: 18.67, puncture: 11.67, radiation: 69.67 }, fireRate: 2.83 },
    grip_brash: { damage: 38, types: { impact: 30, radiation: 8 }, fireRate: 3.77 },
    grip_shrewd: { damage: 48, types: { impact: 35, radiation: 13 }, fireRate: 3.13 },
    grip_steadyslam: { damage: 87, types: { impact: 54.5, radiation: 32.5 }, fireRate: 2.32 },
    grip_tremor: { damage: 116, types: { impact: 69, radiation: 47 }, fireRate: 2.13 },
    grip_palmaris: { damage: 43, types: { impact: 32.5, radiation: 10.5 }, fireRate: 3.45 },
  },
  rattleguts_chamber: {
    grip_gibber: { damage: 22, types: { impact: 0, puncture: 7, slash: 5, radiation: 10 }, fireRate: 11 },
    grip_ramble: { damage: 27, types: { impact: 0.5, puncture: 8.5, slash: 6.5, radiation: 11.5 }, fireRate: 8.83 },
    grip_lovetap: { damage: 52, types: { impact: 6.75, puncture: 14.75, slash: 12.75, radiation: 17.75 }, fireRate: 5.17 },
    grip_haymaker: { damage: 71, types: { impact: 11.5, puncture: 19.5, slash: 17.5, radiation: 22.5 }, fireRate: 3.67 },
    grip_ulnaris: { damage: 39, types: { impact: 3.5, puncture: 11.5, slash: 9.5, radiation: 14.5 }, fireRate: 6.67 },
    grip_brash: { damage: 17, types: { impact: 1.5, puncture: 4.5, slash: 2.5, radiation: 8.5 }, fireRate: 17 },
    grip_shrewd: { damage: 18.2, types: { impact: 1.8, puncture: 4.8, slash: 2.8, radiation: 8.8 }, fireRate: 14 },
    grip_steadyslam: { damage: 28.2, types: { impact: 4.3, puncture: 7.3, slash: 5.3, radiation: 11.3 }, fireRate: 10 },
    grip_tremor: { damage: 37, types: { impact: 6.5, puncture: 9.5, slash: 7.5, radiation: 13.5 }, fireRate: 9 },
    grip_palmaris: { damage: 18.1, types: { impact: 1.7, puncture: 4.8, slash: 2.7, radiation: 8.9 }, fireRate: 15.5 },
  },
  gaze_chamber: {
    grip_gibber: { damage: 16, types: { puncture: 6, radiation: 10 } },
    grip_ramble: { damage: 17, types: { puncture: 6.5, radiation: 10.5 } },
    grip_lovetap: { damage: 19, types: { puncture: 7.5, radiation: 11.5 } },
    grip_haymaker: { damage: 20, types: { puncture: 8, radiation: 12 } },
    grip_ulnaris: { damage: 18, types: { puncture: 7, radiation: 11 } },
    grip_brash: { damage: 29, types: { radiation: 29 } },
    grip_shrewd: { damage: 31, types: { radiation: 31 } },
    grip_steadyslam: { damage: 35, types: { radiation: 35 } },
    grip_tremor: { damage: 37, types: { radiation: 37 } },
    grip_palmaris: { damage: 30, types: { radiation: 30 } },
  },
  vermisplicer_chamber: {
    grip_gibber: { damage: 14, types: { impact: 1.5, puncture: 3.5, slash: 4.5, toxin: 4.5 } },
    grip_ramble: { damage: 15, types: { impact: 1.75, puncture: 3.75, slash: 4.75, toxin: 4.75 } },
    grip_lovetap: { damage: 17, types: { impact: 2.25, puncture: 4.25, slash: 5.25, toxin: 5.25 } },
    grip_haymaker: { damage: 18, types: { impact: 2.5, puncture: 4.5, slash: 5.5, toxin: 5.5 } },
    grip_ulnaris: { damage: 16, types: { impact: 2, puncture: 4, slash: 5, toxin: 5 } },
    grip_brash: { damage: 33, types: { impact: 5, puncture: 6, slash: 10, toxin: 12 } },
    grip_shrewd: { damage: 35, types: { impact: 5.5, puncture: 6.5, slash: 10.5, toxin: 12.5 } },
    grip_steadyslam: { damage: 33, types: { impact: 5, puncture: 6, slash: 10, toxin: 12 } },
    grip_tremor: { damage: 39, types: { impact: 6.5, puncture: 7.5, slash: 11.5, toxin: 13.5 } },
    grip_palmaris: { damage: 34.2, types: { impact: 5.3, puncture: 6.3, slash: 10.3, toxin: 12.3 } },
  },
};

// ── KITGUN LOADERS ───────────────────────────────────────────────────────
// CC/CM/SC bonuses are universal (additive to chamber base).
// Magazine tier indexes into the chamber's magazineTiers array.
// Reload time is absolute.
export const kitgunLoaders: KitgunLoader[] = [
  { id: "loader_zip", name: "Zip", critChanceBonus: 0, critMultiplierBonus: 0, statusChanceBonus: 0, magazineTier: 0, reloadTime: 0.9 },
  { id: "loader_zipfire", name: "Zipfire", critChanceBonus: -0.04, critMultiplierBonus: -0.1, statusChanceBonus: 0.07, magazineTier: 0, reloadTime: 0.9 },
  { id: "loader_zipneedle", name: "Zipneedle", critChanceBonus: 0.07, critMultiplierBonus: 0.1, statusChanceBonus: -0.04, magazineTier: 0, reloadTime: 0.9 },
  { id: "loader_killstream", name: "Killstream", critChanceBonus: 0.14, critMultiplierBonus: 0.3, statusChanceBonus: -0.08, magazineTier: 1, reloadTime: 1.3 },
  { id: "loader_slap", name: "Slap", critChanceBonus: 0, critMultiplierBonus: 0, statusChanceBonus: 0, magazineTier: 1, reloadTime: 1.3 },
  { id: "loader_slapneedle", name: "Slapneedle", critChanceBonus: 0.07, critMultiplierBonus: 0.1, statusChanceBonus: -0.04, magazineTier: 1, reloadTime: 1.3 },
  { id: "loader_swiftfire", name: "Swiftfire", critChanceBonus: -0.04, critMultiplierBonus: -0.1, statusChanceBonus: 0.07, magazineTier: 1, reloadTime: 1.3 },
  { id: "loader_flutterfire", name: "Flutterfire", critChanceBonus: -0.08, critMultiplierBonus: -0.3, statusChanceBonus: 0.14, magazineTier: 1, reloadTime: 1.3 },
  { id: "loader_arcroid", name: "Arcroid", critChanceBonus: 0.03, critMultiplierBonus: 0, statusChanceBonus: 0.03, magazineTier: 2, reloadTime: 1.5 },
  { id: "loader_bashrack", name: "Bashrack", critChanceBonus: 0.07, critMultiplierBonus: 0.1, statusChanceBonus: -0.04, magazineTier: 3, reloadTime: 1.7 },
  { id: "loader_deepbreath", name: "Deepbreath", critChanceBonus: 0, critMultiplierBonus: 0, statusChanceBonus: 0, magazineTier: 3, reloadTime: 1.7 },
  { id: "loader_sparkfire", name: "Sparkfire", critChanceBonus: -0.04, critMultiplierBonus: -0.1, statusChanceBonus: 0.07, magazineTier: 3, reloadTime: 1.7 },
  { id: "loader_splat", name: "Splat", critChanceBonus: 0.14, critMultiplierBonus: 0.3, statusChanceBonus: -0.08, magazineTier: 3, reloadTime: 1.7 },
  { id: "loader_ramflare", name: "Ramflare", critChanceBonus: -0.08, critMultiplierBonus: -0.3, statusChanceBonus: 0.14, magazineTier: 3, reloadTime: 1.7 },
  { id: "loader_bellows", name: "Bellows", critChanceBonus: 0, critMultiplierBonus: 0, statusChanceBonus: 0, magazineTier: 4, reloadTime: 2.1 },
  { id: "loader_stitch", name: "Stitch", critChanceBonus: 0.07, critMultiplierBonus: 0.1, statusChanceBonus: -0.04, magazineTier: 4, reloadTime: 2.1 },
  { id: "loader_thunderdrum", name: "Thunderdrum", critChanceBonus: -0.04, critMultiplierBonus: -0.1, statusChanceBonus: 0.07, magazineTier: 4, reloadTime: 2.1 },
  { id: "loader_thymoid", name: "Thymoid", critChanceBonus: 0, critMultiplierBonus: 0, statusChanceBonus: 0, magazineTier: 5, reloadTime: 2.3 },
  { id: "loader_macro_thymoid", name: "Macro Thymoid", critChanceBonus: 0.03, critMultiplierBonus: 0, statusChanceBonus: 0.03, magazineTier: 6, reloadTime: 2.9 },
  { id: "loader_macro_arcroid", name: "Macro Arcroid", critChanceBonus: 0, critMultiplierBonus: 0, statusChanceBonus: 0, magazineTier: 7, reloadTime: 3.1 },
];

// ── BUILD KITGUN ─────────────────────────────────────────────────────────
export function buildKitgun(chamber: KitgunChamber, grip: KitgunGrip, loader: KitgunLoader): Weapon {
  const gripStats = grip.bonuses[chamber.category];
  const row = KITGUN_GRIP_TABLE[chamber.id]?.[grip.id];
  const totalDamage = row ? row.damage : Math.round(chamber.baseDamage + gripStats.damage);
  const trigger = grip.type === "primary" ? chamber.triggerPrimary : chamber.triggerSecondary;

  const dmgBreakdown: Record<string, number> = {};
  if (row) {
    for (const [type, value] of Object.entries(row.types)) dmgBreakdown[type] = value;
  } else {
    for (const [type, ratio] of Object.entries(chamber.damageRatios)) {
      dmgBreakdown[type] = Math.round(totalDamage * ratio);
    }
  }
  const fireRate = row?.fireRate ?? gripStats.fireRate;
  const baseCritMultiplier =
    grip.type === "primary" && chamber.baseCritMultiplierPrimary != null
      ? chamber.baseCritMultiplierPrimary
      : chamber.baseCritMultiplier;

  return {
    id: `kitgun_${chamber.id}_${grip.id}_${loader.id}`,
    name: `${chamber.name} (${grip.name} / ${loader.name})`,
    category: grip.type === "primary" ? "primary" : "secondary",
    damage: totalDamage,
    impact: dmgBreakdown.impact || 0,
    puncture: dmgBreakdown.puncture || 0,
    slash: dmgBreakdown.slash || 0,
    heat: dmgBreakdown.heat,
    toxin: dmgBreakdown.toxin,
    radiation: dmgBreakdown.radiation,
    viral: dmgBreakdown.viral,
    fireRate: +fireRate.toFixed(2),
    criticalChance: +(chamber.baseCritChance + loader.critChanceBonus).toFixed(4),
    criticalMultiplier: +(baseCritMultiplier + loader.critMultiplierBonus).toFixed(3),
    statusChance: +(chamber.baseStatusChance + loader.statusChanceBonus).toFixed(4),
    magazine: chamber.magazineTiers[loader.magazineTier] || 10,
    reloadTime: loader.reloadTime,
    multishot: 1,
    triggerType: trigger,
    modSlots: 8,
    hasPrimaryArcaneSlot: false,
    hasSecondaryArcaneSlot: false,
    isIncarnon: false,
    hasRivenSlot: true,
    arcaneSlots: 2,
    arcaneType: "kitgun",
    kitgunChamberCategory: chamber.category,
  };
}

// ── ZAW SYSTEM ──────────────────────────────────────────────────────────
// Zaws use flat additive bonuses: final_damage = (strike + grip_bonus + link_bonus) × 2h_mult

export interface ZawStrike {
  id: string;
  name: string;
  description: string;
  damage: number;
  impact: number;
  puncture: number;
  slash: number;
  viral?: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  twoHandMult: number;
  /** Strike attack-speed modifier added to grip + link base speed (wiki Zaw § Strike "Speed"). */
  speedBonus: number;
  weaponTypes: { oneHand: string; twoHand: string };
}

export const zawStrikes: ZawStrike[] = [
  { id: "zaw_balla", name: "Balla", description: "Fast dagger (1H) or staff (2H). Puncture/Slash focused.", damage: 224, impact: 11.2, puncture: 134.4, slash: 78.4, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.00, speedBonus: 0.083, weaponTypes: { oneHand: "Dagger", twoHand: "Staff" } },
  { id: "zaw_cyath", name: "Cyath", description: "Machete (1H) or polearm (2H). Slash focused.", damage: 230, impact: 46.0, puncture: 11.5, slash: 172.5, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.08, speedBonus: 0.000, weaponTypes: { oneHand: "Machete", twoHand: "Polearm" } },
  { id: "zaw_dehtat", name: "Dehtat", description: "Rapier (1H) or polearm (2H). Balanced Puncture/Slash.", damage: 224, impact: 22.4, puncture: 112.0, slash: 89.6, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.09, speedBonus: 0.083, weaponTypes: { oneHand: "Rapier", twoHand: "Polearm" } },
  { id: "zaw_dokrahm", name: "Dokrahm", description: "Scythe (1H) or heavy blade (2H). High base damage, Slash focused.", damage: 309, impact: 46.4, puncture: 108.1, slash: 154.5, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 0.93, speedBonus: 0.083, weaponTypes: { oneHand: "Scythe", twoHand: "Heavy Blade" } },
  { id: "zaw_kronsh", name: "Kronsh", description: "Machete (1H) or polearm (2H). Impact heavy, no Puncture.", damage: 234, impact: 163.8, puncture: 0, slash: 70.2, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.07, speedBonus: -0.067, weaponTypes: { oneHand: "Machete", twoHand: "Polearm" } },
  { id: "zaw_mewan", name: "Mewan", description: "Sword (1H) or polearm (2H). Balanced distribution.", damage: 224, impact: 56.0, puncture: 78.4, slash: 89.6, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.09, speedBonus: -0.067, weaponTypes: { oneHand: "Sword", twoHand: "Polearm" } },
  { id: "zaw_ooltha", name: "Ooltha", description: "Sword (1H) or staff (2H). Puncture/Slash balanced.", damage: 224, impact: 22.4, puncture: 89.6, slash: 112.0, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.00, speedBonus: 0.000, weaponTypes: { oneHand: "Sword", twoHand: "Staff" } },
  { id: "zaw_rabvee", name: "Rabvee", description: "Machete (1H) or hammer (2H). Impact heavy.", damage: 234, impact: 140.4, puncture: 11.7, slash: 81.9, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.18, twoHandMult: 1.08, speedBonus: -0.067, weaponTypes: { oneHand: "Machete", twoHand: "Hammer" } },
  { id: "zaw_sepfahn", name: "Sepfahn", description: "Nikana (1H) or staff (2H). Higher crit/status than average. Slash focused.", damage: 226, impact: 22.6, puncture: 56.5, slash: 146.9, criticalChance: 0.20, criticalMultiplier: 2.0, statusChance: 0.20, twoHandMult: 1.00, speedBonus: 0.000, weaponTypes: { oneHand: "Nikana", twoHand: "Staff" } },
  { id: "zaw_plague_kripath", name: "Plague Kripath", description: "Rapier (1H) or polearm (2H). Has innate Viral damage. High crit.", damage: 213, impact: 30.0, puncture: 70.0, slash: 49.0, viral: 64.0, criticalChance: 0.22, criticalMultiplier: 2.2, statusChance: 0.18, twoHandMult: 1.08, speedBonus: 0.033, weaponTypes: { oneHand: "Rapier", twoHand: "Polearm" } },
  { id: "zaw_plague_keewar", name: "Plague Keewar", description: "Scythe (1H) or staff (2H). Has innate Viral damage. High status.", damage: 306, impact: 88.0, puncture: 57.0, slash: 91.0, viral: 70.0, criticalChance: 0.18, criticalMultiplier: 2.0, statusChance: 0.22, twoHandMult: 0.85, speedBonus: -0.033, weaponTypes: { oneHand: "Scythe", twoHand: "Staff" } },
];

// ── ZAW GRIPS ────────────────────────────────────────────────────────────
export interface ZawGrip {
  id: string;
  name: string;
  type: "1h" | "2h";
  description: string;
  damageBonus: number;
  baseSpeed: number;
}

export const zawGrips: ZawGrip[] = [
  { id: "zaw_grip_peye", name: "Peye", type: "1h", description: "Fast 1H grip. Slightly less damage, fastest speed.", damageBonus: -4, baseSpeed: 1.000 },
  { id: "zaw_grip_laka", name: "Laka", type: "1h", description: "Balanced 1H grip. No damage change, good speed.", damageBonus: 0, baseSpeed: 0.917 },
  { id: "zaw_grip_kwath", name: "Kwath", type: "1h", description: "Heavy 1H grip. Extra damage, slightly slower.", damageBonus: 14, baseSpeed: 0.850 },
  { id: "zaw_grip_korb", name: "Korb", type: "1h", description: "Heaviest 1H grip. Maximum 1H damage, slowest 1H speed.", damageBonus: 28, baseSpeed: 0.783 },
  { id: "zaw_grip_plague_akwin", name: "Plague Akwin", type: "1h", description: "Infested 1H grip. Slight damage reduction, above-average speed.", damageBonus: -2, baseSpeed: 0.950 },
  { id: "zaw_grip_seekalla", name: "Seekalla", type: "2h", description: "Fast 2H grip. Less damage, fastest 2H speed.", damageBonus: -4, baseSpeed: 1.000 },
  { id: "zaw_grip_jayap", name: "Jayap", type: "2h", description: "Balanced 2H grip. No damage change, good speed.", damageBonus: 0, baseSpeed: 0.917 },
  { id: "zaw_grip_kroostra", name: "Kroostra", type: "2h", description: "Heavy 2H grip. Extra damage, slower speed.", damageBonus: 14, baseSpeed: 0.850 },
  { id: "zaw_grip_shtung", name: "Shtung", type: "2h", description: "Heaviest 2H grip. Maximum 2H damage, slowest speed.", damageBonus: 28, baseSpeed: 0.783 },
  { id: "zaw_grip_plague_bokwin", name: "Plague Bokwin", type: "2h", description: "Infested 2H grip. Moderate damage bonus, moderate speed.", damageBonus: 7, baseSpeed: 0.883 },
];

// ── ZAW LINKS ────────────────────────────────────────────────────────────
export interface ZawLink {
  id: string;
  name: string;
  critBonus: number;
  statusBonus: number;
  damageBonus: number;
  speedBonus: number;
}

export const zawLinks: ZawLink[] = [
  { id: "zaw_link_ruhang", name: "Ruhang", critBonus: 0.0, statusBonus: 0.0, damageBonus: 14, speedBonus: -0.067 },
  { id: "zaw_link_jai", name: "Jai", critBonus: 0.0, statusBonus: 0.0, damageBonus: -4, speedBonus: 0.083 },
  { id: "zaw_link_ruhang_2", name: "Ruhang II", critBonus: 0.0, statusBonus: 0.0, damageBonus: 28, speedBonus: -0.133 },
  { id: "zaw_link_jai_2", name: "Jai II", critBonus: 0.0, statusBonus: 0.0, damageBonus: -8, speedBonus: 0.167 },
  { id: "zaw_link_vargeet_ruhang", name: "Vargeet Ruhang", critBonus: 0.07, statusBonus: -0.04, damageBonus: 14, speedBonus: -0.067 },
  { id: "zaw_link_vargeet_2_ruhang", name: "Vargeet II Ruhang", critBonus: 0.14, statusBonus: -0.08, damageBonus: 14, speedBonus: -0.067 },
  { id: "zaw_link_vargeet_ruhang_2", name: "Vargeet Ruhang II", critBonus: 0.07, statusBonus: -0.04, damageBonus: 28, speedBonus: -0.133 },
  { id: "zaw_link_ekwana_ruhang", name: "Ekwana Ruhang", critBonus: -0.04, statusBonus: 0.07, damageBonus: 14, speedBonus: -0.067 },
  { id: "zaw_link_ekwana_2_ruhang", name: "Ekwana II Ruhang", critBonus: -0.08, statusBonus: 0.14, damageBonus: 14, speedBonus: -0.067 },
  { id: "zaw_link_ekwana_ruhang_2", name: "Ekwana Ruhang II", critBonus: -0.04, statusBonus: 0.07, damageBonus: 28, speedBonus: -0.133 },
  { id: "zaw_link_vargeet_jai", name: "Vargeet Jai", critBonus: 0.07, statusBonus: -0.04, damageBonus: -4, speedBonus: 0.083 },
  { id: "zaw_link_vargeet_2_jai", name: "Vargeet II Jai", critBonus: 0.14, statusBonus: -0.08, damageBonus: -4, speedBonus: 0.083 },
  { id: "zaw_link_vargeet_jai_2", name: "Vargeet Jai II", critBonus: 0.07, statusBonus: -0.04, damageBonus: -8, speedBonus: 0.167 },
  { id: "zaw_link_ekwana_jai", name: "Ekwana Jai", critBonus: -0.04, statusBonus: 0.07, damageBonus: -4, speedBonus: 0.083 },
  { id: "zaw_link_ekwana_2_jai", name: "Ekwana II Jai", critBonus: -0.08, statusBonus: 0.14, damageBonus: -4, speedBonus: 0.083 },
  { id: "zaw_link_ekwana_jai_2", name: "Ekwana Jai II", critBonus: -0.04, statusBonus: 0.07, damageBonus: -8, speedBonus: 0.167 },
];

// ── BUILD ZAW ────────────────────────────────────────────────────────────
export function buildZaw(strike: ZawStrike, grip: ZawGrip, link: ZawLink): Weapon {
  const rawDamage = strike.damage + grip.damageBonus + link.damageBonus;
  const mult = grip.type === "2h" ? strike.twoHandMult : 1.0;
  const totalDamage = Math.round(rawDamage * mult);
  const ratio = totalDamage / (strike.damage || 1);
  const speed = +(grip.baseSpeed + link.speedBonus + strike.speedBonus).toFixed(3);
  const weaponType = grip.type === "1h" ? strike.weaponTypes.oneHand : strike.weaponTypes.twoHand;

  return {
    id: `zaw_${strike.id}_${grip.id}_${link.id}`,
    name: `${strike.name} (${grip.name} / ${link.name})`,
    category: "melee",
    damage: totalDamage,
    impact: Math.round(strike.impact * ratio),
    puncture: Math.round(strike.puncture * ratio),
    slash: Math.round(strike.slash * ratio),
    viral: strike.viral ? Math.round(strike.viral * ratio) : undefined,
    fireRate: speed,
    criticalChance: +(strike.criticalChance + link.critBonus).toFixed(4),
    criticalMultiplier: strike.criticalMultiplier,
    statusChance: +(strike.statusChance + link.statusBonus).toFixed(4),
    magazine: 0,
    reloadTime: 0,
    multishot: 1,
    triggerType: "Melee",
    modSlots: 8,
    hasPrimaryArcaneSlot: false,
    hasSecondaryArcaneSlot: false,
    isIncarnon: false,
    hasRivenSlot: true,
    arcaneSlots: 2,
    arcaneType: "exodia",
    stanceType: weaponType.toLowerCase().replace(" ", "_"),
  };
}

// ── AMP SYSTEM ──────────────────────────────────────────────────────────
// Amp damage is Void type (not represented in IPS). All damage goes into total.
// Values: wiki Module:Weapons/data/modular (wiki.warframe.com + fandom agree). Magazine = 100 amp
// energy; ammoCost = energy per shot (per tick for Held). The main weapon list mirrors these.

export const ampPrisms: Weapon[] = [
  { id: "amp_raplak", name: "Raplak", category: "amp_prism", damage: 3000, impact: 0, puncture: 0, slash: 0, fireRate: 2.0, criticalChance: 0.38, criticalMultiplier: 2.6, statusChance: 0.1, magazine: 100, ammoCost: 10, reloadTime: 2, multishot: 1, triggerType: "Semi-Auto", modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
  { id: "amp_shwaak", name: "Shwaak", category: "amp_prism", damage: 3500, impact: 0, puncture: 0, slash: 0, fireRate: 1.33, criticalChance: 0.1, criticalMultiplier: 1.6, statusChance: 0.2, magazine: 100, ammoCost: 10, reloadTime: 2, multishot: 1, triggerType: "Semi-Auto", modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
  // wiki Granmu Prism: Direct Hit 1000 Void + Explosion 1400 Void per shot (per-trigger sum, as for scaffolds); 3-round burst, 0.15s
  { id: "amp_granmu", name: "Granmu", category: "amp_prism", damage: 2400, impact: 0, puncture: 0, slash: 0, fireRate: 1.0, criticalChance: 0.26, criticalMultiplier: 2.0, statusChance: 0.12, magazine: 100, ammoCost: 5, reloadTime: 2, multishot: 1, triggerType: "Burst", burstCount: 3, burstDelay: 0.15, modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
  { id: "amp_rahn", name: "Rahn", category: "amp_prism", damage: 1000, impact: 0, puncture: 0, slash: 0, fireRate: 5.67, criticalChance: 0.3, criticalMultiplier: 2.0, statusChance: 0.04, magazine: 100, ammoCost: 3, reloadTime: 2, multishot: 1, triggerType: "Auto", modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
  { id: "amp_cantic", name: "Cantic", category: "amp_prism", damage: 1460, impact: 0, puncture: 0, slash: 0, fireRate: 2.67, criticalChance: 0.34, criticalMultiplier: 2.2, statusChance: 0.1, magazine: 100, ammoCost: 3, reloadTime: 2, multishot: 1, triggerType: "Burst", burstCount: 3, burstDelay: 0.08, modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
  { id: "amp_lega", name: "Lega", category: "amp_prism", damage: 600, impact: 0, puncture: 0, slash: 0, fireRate: 7.5, criticalChance: 0.08, criticalMultiplier: 1.6, statusChance: 0.34, magazine: 100, ammoCost: 0.8, reloadTime: 2, multishot: 1, triggerType: "Held", modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
  { id: "amp_klamora", name: "Klamora", category: "amp_prism", damage: 600, impact: 0, puncture: 0, slash: 0, fireRate: 12.0, criticalChance: 0.38, criticalMultiplier: 2.4, statusChance: 0.1, magazine: 100, ammoCost: 2.5, reloadTime: 2, multishot: 1, triggerType: "Held", modSlots: 0, hasPrimaryArcaneSlot: false, hasSecondaryArcaneSlot: false, isIncarnon: false, hasRivenSlot: false },
];

export interface AmpScaffold {
  id: string;
  name: string;
  damage: number;
  fireRate: number;
  criticalChance: number;
  criticalMultiplier: number;
  statusChance: number;
  description: string;
  /** Shots per burst / in-burst delay (s) for burst scaffolds (wiki BurstCount / BurstDelay). */
  burstCount?: number;
  burstDelay?: number;
}

// Damage is the per-trigger sum of the scaffold's attacks (wiki Module:Weapons/data/modular):
// Phahd 3000 direct + 1100 explosion; Shraksun 3000 + 4500; Dissic 15 impact + 6600 explosion + 9 × 300 fragments;
// Exard 200 impact + 2600 explosion per shot, 3-round burst (0.12s) at Fire Rate 1 (fandom's older 5 / 0.111 was
// corrected to 3 / 0.12 on wiki.warframe.com by the same editor in Feb 2025).
export const ampScaffolds: AmpScaffold[] = [
  { id: "amp_pencha", name: "Pencha", damage: 9000, fireRate: 2.0, criticalChance: 0.14, criticalMultiplier: 1.6, statusChance: 0.18, description: "Charged beam" },
  { id: "amp_shraksun", name: "Shraksun", damage: 7500, fireRate: 1.33, criticalChance: 0.20, criticalMultiplier: 2.0, statusChance: 0.20, description: "Explosive short-range" },
  { id: "amp_klebrik", name: "Klebrik", damage: 320, fireRate: 12.0, criticalChance: 0.16, criticalMultiplier: 1.6, statusChance: 0.14, description: "Homing beam" },
  { id: "amp_phahd", name: "Phahd", damage: 4100, fireRate: 1.67, criticalChance: 0.34, criticalMultiplier: 2.6, statusChance: 0.12, description: "Bouncing glaive" },
  { id: "amp_exard", name: "Exard", damage: 2800, fireRate: 1.0, criticalChance: 0.17, criticalMultiplier: 1.9, statusChance: 0.33, description: "Full-auto explosive", burstCount: 3, burstDelay: 0.12 },
  { id: "amp_dissic", name: "Dissic", damage: 9315, fireRate: 1.0, criticalChance: 0.03, criticalMultiplier: 1.5, statusChance: 0.37, description: "Lobbed fragmenting explosive" },
  { id: "amp_propa", name: "Propa", damage: 9000, fireRate: 2.0, criticalChance: 0.30, criticalMultiplier: 2.0, statusChance: 0.0, description: "Deployable mine" },
];

export interface AmpBrace {
  id: string;
  name: string;
  description: string;
  rechargeDelayReduction: number;
  maxEnergyBonus: number;
  rechargeRateBonus: number;
  critChanceBonus: number;
  statusChanceBonus: number;
}

export const ampBraces: AmpBrace[] = [
  { id: "amp_clapkra", name: "Clapkra", description: "+40 energy pool", rechargeDelayReduction: 0, maxEnergyBonus: 40, rechargeRateBonus: 0, critChanceBonus: 0, statusChanceBonus: 0 },
  { id: "amp_juttni", name: "Juttni", description: "-1.0s recharge delay", rechargeDelayReduction: 1.0, maxEnergyBonus: 0, rechargeRateBonus: 0, critChanceBonus: 0, statusChanceBonus: 0 },
  { id: "amp_lohrin", name: "Lohrin", description: "+12% crit & status chance", rechargeDelayReduction: 0, maxEnergyBonus: 0, rechargeRateBonus: 0, critChanceBonus: 0.12, statusChanceBonus: 0.12 },
  { id: "amp_anspatha", name: "Anspatha", description: "+20 energy, +15/s recharge", rechargeDelayReduction: 0, maxEnergyBonus: 20, rechargeRateBonus: 15, critChanceBonus: 0, statusChanceBonus: 0 },
  { id: "amp_suo", name: "Suo", description: "+100 energy, +2.0s delay", rechargeDelayReduction: -2.0, maxEnergyBonus: 100, rechargeRateBonus: 0, critChanceBonus: 0, statusChanceBonus: 0 },
  { id: "amp_plaga", name: "Plaga", description: "-1.5s delay, -20 energy", rechargeDelayReduction: 1.5, maxEnergyBonus: -20, rechargeRateBonus: 0, critChanceBonus: 0, statusChanceBonus: 0 },
  { id: "amp_certus", name: "Certus", description: "+20% critical chance", rechargeDelayReduction: 0, maxEnergyBonus: 0, rechargeRateBonus: 0, critChanceBonus: 0.20, statusChanceBonus: 0 },
];

// ── RECOMMENDED BUILDS ──────────────────────────────────────────────────
export interface RecommendedBuild {
  name: string;
  type: "kitgun" | "zaw" | "amp";
  parts: string[];
  description: string;
  tags: string[];
}

export const recommendedBuilds: RecommendedBuild[] = [
  // Kitgun recommendations
  { name: "Catchmoon Crit", type: "kitgun", parts: ["Catchmoon", "Haymaker", "Splat"], description: "Maximum damage per shot with high crit. The classic hard-hitting secondary. Great for close-range nuking.", tags: ["Secondary", "Crit", "AoE"] },
  { name: "Catchmoon Status", type: "kitgun", parts: ["Catchmoon", "Haymaker", "Flutterfire"], description: "High status chance with massive base damage. Excellent for applying procs to groups of enemies.", tags: ["Secondary", "Status", "AoE"] },
  { name: "Tombfinger Crit", type: "kitgun", parts: ["Tombfinger", "Haymaker", "Splat"], description: "Hard-hitting semi-auto with AoE explosion. High crit (38%) and great single-target DPS.", tags: ["Secondary", "Crit", "Precision"] },
  { name: "Rattleguts Speed", type: "kitgun", parts: ["Rattleguts", "Gibber", "Splat"], description: "Bullet hose secondary with high crit. 12 shots/sec with 33% CC. Melts enemies at close-mid range.", tags: ["Secondary", "Crit", "Rapid-fire"] },
  { name: "Rattleguts DPS", type: "kitgun", parts: ["Rattleguts", "Lovetap", "Killstream"], description: "Balanced damage and fire rate with maximum crit chance. Great sustained DPS.", tags: ["Secondary", "Crit", "Balanced"] },
  { name: "Gaze Beam Crit", type: "kitgun", parts: ["Gaze", "Haymaker", "Splat"], description: "Continuous beam with high crit. Melts single targets. Beam ramps up damage over time.", tags: ["Secondary", "Crit", "Beam"] },
  { name: "Sporelacer Hybrid", type: "kitgun", parts: ["Sporelacer", "Haymaker", "Arcroid"], description: "Explosive spores with balanced crit/status. Innate Toxin makes Viral builds easy.", tags: ["Secondary", "Hybrid", "AoE"] },
  { name: "Vermisplicer Beam", type: "kitgun", parts: ["Vermisplicer", "Haymaker", "Splat"], description: "Homing beam tendrils with high crit. Auto-aims at enemies. Great for mobile gameplay.", tags: ["Secondary", "Crit", "Homing"] },
  { name: "Primary Tombfinger AoE", type: "kitgun", parts: ["Tombfinger", "Tremor", "Splat"], description: "Maximum charged shot damage with huge AoE explosion radius. Top-tier primary kitgun.", tags: ["Primary", "Crit", "AoE"] },
  { name: "Primary Rattleguts", type: "kitgun", parts: ["Rattleguts", "Brash", "Killstream"], description: "Extremely high fire rate primary (17 shots/sec). Sustained DPS machine with 33% crit.", tags: ["Primary", "Crit", "Rapid-fire"] },
  // Zaw recommendations
  { name: "Plague Kripath Crit", type: "zaw", parts: ["Plague Kripath", "Peye", "Vargeet II Jai"], description: "Fast rapier with innate Viral and high crit (36% CC). Top-tier melee with great status.", tags: ["1H", "Crit", "Viral"] },
  { name: "Plague Kripath Polearm", type: "zaw", parts: ["Plague Kripath", "Seekalla", "Vargeet II Jai"], description: "Polearm with innate Viral and 36% CC. Excellent reach and combo potential.", tags: ["2H", "Crit", "Polearm"] },
  { name: "Dokrahm Heavy Blade", type: "zaw", parts: ["Dokrahm", "Shtung", "Vargeet II Jai"], description: "Massive heavy blade with high base damage. Great with Tempo Royale stance.", tags: ["2H", "Crit", "Heavy Blade"] },
  { name: "Sepfahn Nikana", type: "zaw", parts: ["Sepfahn", "Peye", "Vargeet II Jai"], description: "Fast nikana with highest base crit (34%) among zaws. Slash-focused for bleed procs.", tags: ["1H", "Crit", "Slash"] },
  { name: "Balla Dagger Speed", type: "zaw", parts: ["Balla", "Peye", "Vargeet II Jai"], description: "Fastest attack speed dagger. Great for Covert Lethality and finisher-focused builds.", tags: ["1H", "Speed", "Dagger"] },
  { name: "Plague Keewar Status", type: "zaw", parts: ["Plague Keewar", "Seekalla", "Ekwana II Jai"], description: "High status staff with innate Viral. 36% status chance makes status builds trivial.", tags: ["2H", "Status", "Viral"] },
  // Amp recommendations (prism / scaffold / brace)
  { name: "177 Certus", type: "amp", parts: ["Raplak", "Pencha", "Certus"], description: "Classic sniper amp. Raplak prism + Pencha charged beam with Certus crit. Excellent Eidolon limb DPS.", tags: ["Crit", "Eidolon", "Beam"] },
  { name: "773 Certus", type: "amp", parts: ["Cantic", "Shraksun", "Certus"], description: "Burst prism with Shraksun explosive scaffold and Certus. Strong all-round Void DPS with splash.", tags: ["Crit", "AoE", "Burst"] },
  { name: "Propa Certus", type: "amp", parts: ["Raplak", "Propa", "Certus"], description: "Deployable Propa mines with Raplak primary fire and Certus. High burst for big Void targets.", tags: ["Crit", "Mine", "Burst"] },
  { name: "Xatti Exard", type: "amp", parts: ["Cantic", "Exard", "Certus"], description: "Full-auto Exard scaffold with Cantic bursts and Certus. Sustained explosive Void DPS.", tags: ["Crit", "AoE", "Auto"] },
  { name: "Klamora Beam Crit", type: "amp", parts: ["Klamora", "Pencha", "Certus"], description: "Held Klamora prism with Pencha alt-fire and Certus. High crit beam for operator combat.", tags: ["Crit", "Beam", "Held"] },
  { name: "Lega Status", type: "amp", parts: ["Lega", "Dissic", "Lohrin"], description: "Status-oriented Lega prism with Dissic fragmenting explosives and Lohrin hybrid brace.", tags: ["Status", "AoE", "Hybrid"] },
  { name: "Phahd Crit", type: "amp", parts: ["Raplak", "Phahd", "Certus"], description: "Bouncing Phahd glaive scaffold with Raplak and Certus. Great for groups of Void-weak enemies.", tags: ["Crit", "Glaive", "AoE"] },
  { name: "Rahn Rapid", type: "amp", parts: ["Rahn", "Klebrik", "Certus"], description: "Auto Rahn prism with Klebrik homing beam scaffold. Mobile operator DPS with Certus crit.", tags: ["Crit", "Homing", "Auto"] },
];
