// Railjack data: components, armaments, and base stats

export interface RailjackComponent {
  id: string;
  name: string;
  type: "reactor" | "shield" | "engine" | "plating";
  tier: "mk1" | "mk2" | "mk3" | "mk4" | "mk5" | "sigma" | "lavan" | "vidar" | "zetki";
  stats: Record<string, number>;
  description: string;
}

export type RailjackArmamentTier = "mk1" | "mk2" | "mk3" | "mk4";

export interface RailjackArmament {
  id: string;
  name: string;
  type: "turret" | "ordnance";
  house: "sigma" | "lavan" | "vidar" | "zetki";
  tier?: RailjackArmamentTier;
  damage: number;
  critChance: number;
  critMultiplier: number;
  statusChance: number;
  fireRate: number;
  description: string;
}

/**
 * Rising Tide / unequipped baseline (wiki Engines + Plating + Shield Array base rows).
 * Equipped plating/shields replace hull/armor/shield; engines add cruise m/s after Conic scales base 150.
 * Flux base 273 matches Hyperflux wiki “100%” reference (reactors no longer list flux).
 */
export const railjackBaseStats = {
  hull: 1050,
  armor: 650,
  shield: 1000,
  speed: 150,
  /** Unequipped Speed While Boosting = 150 × 1.3 (wiki SWB column; UI boost often shows 1.25×). */
  boostMultiplier: 1.3,
  boostSpeed: 195,
  boostCost: 25,
  fluxCapacity: 273,
  shieldRecharge: 5,
  shieldRechargeDelayReduction: 0,
};

// ── Reactors ───────────────────────────────────────────────────────
// Avionics: mid of Empyrean 27.0.11 house ranges. Ability %: wiki Mk III mid-of-range.
export const reactors: RailjackComponent[] = [
  { id: "sigma_reactor_mk1", name: "Sigma Reactor Mk I", type: "reactor", tier: "sigma", stats: { avionicsCapacity: 20 }, description: "Basic Sigma-series reactor" },
  { id: "sigma_reactor_mk2", name: "Sigma Reactor Mk II", type: "reactor", tier: "sigma", stats: { avionicsCapacity: 30 }, description: "Improved Sigma-series reactor" },
  { id: "sigma_reactor_mk3", name: "Sigma Reactor Mk III", type: "reactor", tier: "sigma", stats: { avionicsCapacity: 40, abilityDuration: 0.15, abilityRange: 0.15, abilityStrength: 0.15 }, description: "Sigma Mk III — +15% Battle Mod Strength/Range/Duration" },
  { id: "lavan_reactor_mk3", name: "Lavan Reactor Mk III", type: "reactor", tier: "lavan", stats: { avionicsCapacity: 85, abilityDuration: 0.50, abilityStrength: 0.30 }, description: "Wiki mid Mk III — Duration 40–60% + Strength 20–40%; avionics 80–90" },
  { id: "vidar_reactor_mk3", name: "Vidar Reactor Mk III", type: "reactor", tier: "vidar", stats: { avionicsCapacity: 95, abilityRange: 0.50, abilityDuration: 0.30 }, description: "Wiki mid Mk III — Range 40–60% + Duration 20–40%; avionics 90–100" },
  { id: "zetki_reactor_mk3", name: "Zetki Reactor Mk III", type: "reactor", tier: "zetki", stats: { avionicsCapacity: 75, abilityStrength: 0.50, abilityRange: 0.30 }, description: "Wiki mid Mk III — Strength 40–60% + Range 20–40%; avionics 70–80" },
];

// ── Shield Arrays ──────────────────────────────────────────────────
// Capacity absolute mid-of-range. shieldRecharge = % max shields/s. Delay = wiki reduction (seconds).
export const shieldArrays: RailjackComponent[] = [
  { id: "sigma_shield_mk1", name: "Sigma Shield Array Mk I", type: "shield", tier: "sigma", stats: { shieldCapacity: 1200, shieldRecharge: 5, shieldRechargeDelayReduction: 0 }, description: "Wiki Sigma Mk I absolute capacity" },
  { id: "sigma_shield_mk2", name: "Sigma Shield Array Mk II", type: "shield", tier: "sigma", stats: { shieldCapacity: 1350, shieldRecharge: 5, shieldRechargeDelayReduction: 0.5 }, description: "Wiki Sigma Mk II absolute capacity" },
  { id: "sigma_shield_mk3", name: "Sigma Shield Array Mk III", type: "shield", tier: "sigma", stats: { shieldCapacity: 1500, shieldRecharge: 7, shieldRechargeDelayReduction: 1 }, description: "Wiki Sigma Mk III absolute capacity" },
  { id: "lavan_shield_mk3", name: "Lavan Shield Array Mk III", type: "shield", tier: "lavan", stats: { shieldCapacity: 1700, shieldRecharge: 22.5, shieldRechargeDelayReduction: 0.55 }, description: "Wiki mid Mk III capacity 1400–2000; recharge 15–30%/s" },
  { id: "vidar_shield_mk3", name: "Vidar Shield Array Mk III", type: "shield", tier: "vidar", stats: { shieldCapacity: 1475, shieldRecharge: 22.5, shieldRechargeDelayReduction: 1.25 }, description: "Wiki mid Mk III capacity 1200–1750; delay reduction 0.5–2.0s" },
  { id: "zetki_shield_mk3", name: "Zetki Shield Array Mk III", type: "shield", tier: "zetki", stats: { shieldCapacity: 1275, shieldRecharge: 11, shieldRechargeDelayReduction: 2.5 }, description: "Wiki mid Mk III capacity 1050–1500; best delay reduction 1–4s" },
];

// ── Engines ────────────────────────────────────────────────────────
// speed = wiki item Engine Speed (m/s). boostMultiplier = wiki item Engine Boost (additive on base 1.3).
export const engines: RailjackComponent[] = [
  { id: "sigma_engine_mk1", name: "Sigma Engines Mk I", type: "engine", tier: "sigma", stats: { speed: 10, boostMultiplier: 0 }, description: "Wiki Sigma Mk I (+10 m/s)" },
  { id: "sigma_engine_mk2", name: "Sigma Engines Mk II", type: "engine", tier: "sigma", stats: { speed: 20, boostMultiplier: 0.1 }, description: "Wiki Sigma Mk II (+20 m/s, +0.10× boost)" },
  { id: "sigma_engine_mk3", name: "Sigma Engines Mk III", type: "engine", tier: "sigma", stats: { speed: 30, boostMultiplier: 0.2 }, description: "Wiki Sigma Mk III (+30 m/s, +0.20× boost)" },
  { id: "lavan_engine_mk3", name: "Lavan Engines Mk III", type: "engine", tier: "lavan", stats: { speed: 20, boostMultiplier: 0.45 }, description: "Wiki mid — lower cruise, highest boost (+0.30–0.60×)" },
  { id: "vidar_engine_mk3", name: "Vidar Engines Mk III", type: "engine", tier: "vidar", stats: { speed: 45, boostMultiplier: 0.125 }, description: "Wiki mid — highest cruise (+30–60 m/s)" },
  { id: "zetki_engine_mk3", name: "Zetki Engines Mk III", type: "engine", tier: "zetki", stats: { speed: 30, boostMultiplier: 0.2 }, description: "Wiki mid — balanced cruise/boost" },
];

// ── Plating ────────────────────────────────────────────────────────
// hullBonus/armorBonus store wiki ABSOLUTE mid-of-range (calc replaces base when equipped).
export const plating: RailjackComponent[] = [
  { id: "sigma_plating_mk1", name: "Sigma Plating Mk I", type: "plating", tier: "sigma", stats: { hullBonus: 1350, armorBonus: 975 }, description: "Wiki Sigma Mk I absolute hull/armor" },
  { id: "sigma_plating_mk2", name: "Sigma Plating Mk II", type: "plating", tier: "sigma", stats: { hullBonus: 1750, armorBonus: 1300 }, description: "Wiki Sigma Mk II absolute hull/armor" },
  { id: "sigma_plating_mk3", name: "Sigma Plating Mk III", type: "plating", tier: "sigma", stats: { hullBonus: 2450, armorBonus: 1625 }, description: "Wiki Sigma Mk III absolute hull/armor" },
  { id: "lavan_plating_mk3", name: "Lavan Plating Mk III", type: "plating", tier: "lavan", stats: { hullBonus: 5250, armorBonus: 2419 }, description: "Wiki mid Mk III hull 4500–6000 / armor 2150–2688" },
  { id: "vidar_plating_mk3", name: "Vidar Plating Mk III", type: "plating", tier: "vidar", stats: { hullBonus: 3850, armorBonus: 3319 }, description: "Wiki mid Mk III hull 3300–4400 / armor 2950–3688" },
  { id: "zetki_plating_mk3", name: "Zetki Plating Mk III", type: "plating", tier: "zetki", stats: { hullBonus: 4200, armorBonus: 2644 }, description: "Wiki mid Mk III hull 3600–4800 / armor 2350–2938" },
];

// ── Turrets ────────────────────────────────────────────────────────
export const turrets: RailjackArmament[] = [
  { id: "sigma_apoc", name: "Sigma Apoc", type: "turret", house: "sigma", damage: 200, critChance: 0.14, critMultiplier: 1.6, statusChance: 0.05, fireRate: 6.7, description: "Rapid-fire ballistic turret" },
  { id: "vidar_apoc", name: "Vidar Apoc", type: "turret", house: "vidar", tier: "mk3", damage: 618, critChance: 0.28, critMultiplier: 2.0, statusChance: 0.10, fireRate: 8.33, description: "Enhanced Vidar ballistic turret (Mk III)" },
  { id: "zetki_apoc", name: "Zetki Apoc", type: "turret", house: "zetki", tier: "mk3", damage: 748, critChance: 0.30, critMultiplier: 2.0, statusChance: 0.10, fireRate: 8.33, description: "High-damage Zetki ballistic turret (Mk III)" },
  { id: "lavan_apoc", name: "Lavan Apoc", type: "turret", house: "lavan", tier: "mk3", damage: 662, critChance: 0.20, critMultiplier: 2.0, statusChance: 0.14, fireRate: 8.33, description: "Status-focused Lavan ballistic turret (Mk III)" },
  { id: "sigma_carcinnox", name: "Sigma Carcinnox", type: "turret", house: "sigma", damage: 90, critChance: 0.10, critMultiplier: 1.4, statusChance: 0.25, fireRate: 12, description: "Rapid-fire status turret" },
  { id: "vidar_carcinnox", name: "Vidar Carcinnox", type: "turret", house: "vidar", tier: "mk3", damage: 392, critChance: 0.19, critMultiplier: 2.0, statusChance: 0.24, fireRate: 15, description: "Enhanced Vidar rapid turret (Mk III)" },
  { id: "zetki_carcinnox", name: "Zetki Carcinnox", type: "turret", house: "zetki", tier: "mk3", damage: 510, critChance: 0.13, critMultiplier: 2.0, statusChance: 0.36, fireRate: 15, description: "High-damage Zetki rapid turret (Mk III)" },
  { id: "lavan_carcinnox", name: "Lavan Carcinnox", type: "turret", house: "lavan", tier: "mk3", damage: 420, critChance: 0.13, critMultiplier: 2.0, statusChance: 0.34, fireRate: 15, description: "High-status Lavan rapid turret (Mk III)" },
  // Photor — wiki Mk III total damage (×2 beams folded into damage); FR 12
  { id: "sigma_photor", name: "Sigma Photor", type: "turret", house: "sigma", damage: 270, critChance: 0.12, critMultiplier: 2.0, statusChance: 0.06, fireRate: 12, description: "Hitscan dual-beam Heat/Puncture turret" },
  { id: "lavan_photor", name: "Lavan Photor", type: "turret", house: "lavan", tier: "mk3", damage: 290, critChance: 0.12, critMultiplier: 2.0, statusChance: 0.085, fireRate: 12, description: "Status-focused Lavan beam turret (Mk III)" },
  { id: "vidar_photor", name: "Vidar Photor", type: "turret", house: "vidar", tier: "mk3", damage: 270, critChance: 0.17, critMultiplier: 2.0, statusChance: 0.06, fireRate: 12, description: "Enhanced Vidar beam turret (Mk III)" },
  { id: "zetki_photor", name: "Zetki Photor", type: "turret", house: "zetki", tier: "mk3", damage: 324, critChance: 0.18, critMultiplier: 2.0, statusChance: 0.09, fireRate: 12, description: "High-damage Zetki beam turret (Mk III)" },
  // Pulsar — wiki Mk III
  { id: "sigma_pulsar", name: "Sigma Pulsar", type: "turret", house: "sigma", damage: 589, critChance: 0.17, critMultiplier: 2.0, statusChance: 0.19, fireRate: 3.33, description: "Precision Electricity pulse turret" },
  { id: "lavan_pulsar", name: "Lavan Pulsar", type: "turret", house: "lavan", tier: "mk3", damage: 631, critChance: 0.17, critMultiplier: 2.0, statusChance: 0.27, fireRate: 3.33, description: "Status-focused Lavan precision turret (Mk III)" },
  { id: "vidar_pulsar", name: "Vidar Pulsar", type: "turret", house: "vidar", tier: "mk3", damage: 589, critChance: 0.24, critMultiplier: 2.0, statusChance: 0.19, fireRate: 3.33, description: "Enhanced Vidar precision turret (Mk III)" },
  { id: "zetki_pulsar", name: "Zetki Pulsar", type: "turret", house: "zetki", tier: "mk3", damage: 766, critChance: 0.17, critMultiplier: 2.0, statusChance: 0.29, fireRate: 3.33, description: "High-damage Zetki precision turret (Mk III)" },
  // Talyn — wiki Mk III
  { id: "sigma_talyn", name: "Sigma Talyn", type: "turret", house: "sigma", damage: 295, critChance: 0.13, critMultiplier: 2.0, statusChance: 0.20, fireRate: 16.67, description: "Spool-up Heat laser turret" },
  { id: "lavan_talyn", name: "Lavan Talyn", type: "turret", house: "lavan", tier: "mk3", damage: 316, critChance: 0.13, critMultiplier: 2.0, statusChance: 0.28, fireRate: 16.67, description: "Status-focused Lavan laser turret (Mk III)" },
  { id: "vidar_talyn", name: "Vidar Talyn", type: "turret", house: "vidar", tier: "mk3", damage: 295, critChance: 0.18, critMultiplier: 2.0, statusChance: 0.20, fireRate: 16.67, description: "Enhanced Vidar laser turret (Mk III)" },
  { id: "zetki_talyn", name: "Zetki Talyn", type: "turret", house: "zetki", tier: "mk3", damage: 384, critChance: 0.13, critMultiplier: 2.0, statusChance: 0.30, fireRate: 16.67, description: "High-damage Zetki laser turret (Mk III)" },
  // Cryophon — wiki Mk III Cold wave
  { id: "sigma_cryophon", name: "Sigma Cryophon", type: "turret", house: "sigma", damage: 4760, critChance: 0.20, critMultiplier: 1.5, statusChance: 0.30, fireRate: 1, description: "Heavy Cold wave turret" },
  { id: "lavan_cryophon", name: "Lavan Cryophon", type: "turret", house: "lavan", tier: "mk3", damage: 5094, critChance: 0.20, critMultiplier: 1.5, statusChance: 0.42, fireRate: 1, description: "Status-focused Lavan Cold wave turret (Mk III)" },
  { id: "vidar_cryophon", name: "Vidar Cryophon", type: "turret", house: "vidar", tier: "mk3", damage: 4760, critChance: 0.28, critMultiplier: 1.5, statusChance: 0.30, fireRate: 1, description: "High-crit Vidar Cold wave turret (Mk III)" },
  { id: "zetki_cryophon", name: "Zetki Cryophon", type: "turret", house: "zetki", tier: "mk3", damage: 6188, critChance: 0.20, critMultiplier: 2.0, statusChance: 0.45, fireRate: 1, description: "High-damage Zetki Cold wave turret (Mk III)" },
  // Glazio — wiki Mk III ice driver
  { id: "sigma_glazio", name: "Sigma Glazio", type: "turret", house: "sigma", damage: 2106, critChance: 0.33, critMultiplier: 2.5, statusChance: 0.20, fireRate: 1.5, description: "Heavy Cold/IPS ice driver turret" },
  { id: "lavan_glazio", name: "Lavan Glazio", type: "turret", house: "lavan", tier: "mk3", damage: 2317, critChance: 0.33, critMultiplier: 2.5, statusChance: 0.28, fireRate: 1.5, description: "Status-focused Lavan ice driver (Mk III)" },
  { id: "vidar_glazio", name: "Vidar Glazio", type: "turret", house: "vidar", tier: "mk3", damage: 2106, critChance: 0.47, critMultiplier: 2.5, statusChance: 0.20, fireRate: 1.5, description: "High-crit Vidar ice driver (Mk III)" },
  { id: "zetki_glazio", name: "Zetki Glazio", type: "turret", house: "zetki", tier: "mk3", damage: 2738, critChance: 0.50, critMultiplier: 2.5, statusChance: 0.20, fireRate: 1.5, description: "High-damage Zetki ice driver (Mk III)" },
  { id: "sigma_laith", name: "Sigma Laith", type: "turret", house: "sigma", damage: 2832, critChance: 0.24, critMultiplier: 2.0, statusChance: 0.09, fireRate: 2.5, description: "8-pellet shrapnel burst turret (Impact/Puncture/Slash)" },
  { id: "lavan_laith", name: "Lavan Laith", type: "turret", house: "lavan", tier: "mk3", damage: 3120, critChance: 0.24, critMultiplier: 2.0, statusChance: 0.126, fireRate: 2.5, description: "Status-focused Lavan shrapnel burst turret (Mk III)" },
  { id: "vidar_laith", name: "Vidar Laith", type: "turret", house: "vidar", tier: "mk3", damage: 2832, critChance: 0.39, critMultiplier: 2.0, statusChance: 0.09, fireRate: 2.5, description: "High-crit Vidar shrapnel burst turret (Mk III)" },
  { id: "zetki_laith", name: "Zetki Laith", type: "turret", house: "zetki", tier: "mk3", damage: 3680, critChance: 0.24, critMultiplier: 2.0, statusChance: 0.135, fireRate: 2.5, description: "High-damage Zetki shrapnel burst turret (Mk III, 8 pellets)" },
  { id: "sigma_vort", name: "Sigma Vort", type: "turret", house: "sigma", damage: 1224, critChance: 0.20, critMultiplier: 2.0, statusChance: 0.17, fireRate: 5, description: "Electricity line turret with high burst DPS" },
  { id: "lavan_vort", name: "Lavan Vort", type: "turret", house: "lavan", tier: "mk3", damage: 1310, critChance: 0.17, critMultiplier: 2.0, statusChance: 0.28, fireRate: 5, description: "Status-focused Lavan electricity turret (Mk III)" },
  { id: "vidar_vort", name: "Vidar Vort", type: "turret", house: "vidar", tier: "mk3", damage: 1224, critChance: 0.24, critMultiplier: 2.0, statusChance: 0.20, fireRate: 5, description: "High-crit Vidar electricity turret (Mk III)" },
  { id: "zetki_vort", name: "Zetki Vort", type: "turret", house: "zetki", tier: "mk3", damage: 1592, critChance: 0.26, critMultiplier: 2.0, statusChance: 0.10, fireRate: 5, description: "High-damage Zetki electricity turret (Mk III)" },
];

/** Hotfix 43.0.5: Steel Path Mk IV turrets are ~50% stronger than Mk III (wiki Mk III + patch notes). */
function toMk4Turret(turret: RailjackArmament): RailjackArmament {
  return {
    ...turret,
    id: `${turret.id}_mk4`,
    name: `${turret.name.replace(/ \(Mk III\)$/, "")} Mk IV`,
    tier: "mk4",
    damage: Math.round(turret.damage * 1.5),
    description: `${turret.description.replace(/ \(Mk III\)$/, "")}. Mk IV Steel Path variant (~50% stronger than Mk III).`,
  };
}

export const mk4Turrets: RailjackArmament[] = turrets
  .filter((t) => t.house !== "sigma")
  .map(toMk4Turret);

export const allTurrets: RailjackArmament[] = [...turrets, ...mk4Turrets];

/**
 * Tunguska Cannon (Forward Artillery) — fixed chin mount, not a turret slot.
 * Wiki: 56,500 Puncture, 300% CC (guaranteed red), 2.0× CD, 0% SC, 4s charge.
 * Dome Charges / Artillery Cheap Shot economy left out of paper DPS.
 */
export const tunguskaCannon = {
  id: "tunguska_cannon",
  name: "Tunguska Cannon",
  damage: 56500,
  critChance: 3.0,
  critMultiplier: 2.0,
  statusChance: 0,
  /** Wiki charge time to fire (seconds). */
  chargeTime: 4,
  description: "Chin-mounted Forward Artillery — consumes Dome Charges; 4s charge",
} as const;

/** Ordnance is Sigma-only (Dry Dock research). Wiki Mk tiers — no house variants. */
export const ordnance: RailjackArmament[] = [
  { id: "sigma_milati", name: "Milati", type: "ordnance", house: "sigma", damage: 10800, critChance: 0.10, critMultiplier: 2.0, statusChance: 0, fireRate: 0.5, description: "12-rocket dumbfire swarm (base)" },
  { id: "sigma_milati_mk1", name: "Milati Mk I", type: "ordnance", house: "sigma", tier: "mk1", damage: 19440, critChance: 0.20, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "12-rocket dumbfire swarm (Mk I)" },
  { id: "sigma_milati_mk2", name: "Milati Mk II", type: "ordnance", house: "sigma", tier: "mk2", damage: 33048, critChance: 0.26, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "12-rocket dumbfire swarm (Mk II)" },
  { id: "sigma_milati_mk3", name: "Milati Mk III", type: "ordnance", house: "sigma", tier: "mk3", damage: 52884, critChance: 0.30, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "12-rocket dumbfire swarm (Mk III)" },
  { id: "sigma_tycho_seeker", name: "Tycho Seeker", type: "ordnance", house: "sigma", damage: 8000, critChance: 0.20, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "Lock-on seeker missile (base)" },
  { id: "sigma_tycho_seeker_mk1", name: "Tycho Seeker Mk I", type: "ordnance", house: "sigma", tier: "mk1", damage: 14400, critChance: 0.30, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "Lock-on seeker missile (Mk I)" },
  { id: "sigma_tycho_seeker_mk2", name: "Tycho Seeker Mk II", type: "ordnance", house: "sigma", tier: "mk2", damage: 24480, critChance: 0.40, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "Lock-on seeker missile (Mk II)" },
  { id: "sigma_tycho_seeker_mk3", name: "Tycho Seeker Mk III", type: "ordnance", house: "sigma", tier: "mk3", damage: 39168, critChance: 0.50, critMultiplier: 2.0, statusChance: 0, fireRate: 1, description: "Lock-on seeker missile (Mk III)" },
  { id: "sigma_galvarc", name: "Galvarc", type: "ordnance", house: "sigma", damage: 375, critChance: 0, critMultiplier: 2.0, statusChance: 0.10, fireRate: 12, description: "Chain Heat arc ordnance (base)" },
  { id: "sigma_galvarc_mk1", name: "Galvarc Mk I", type: "ordnance", house: "sigma", tier: "mk1", damage: 675, critChance: 0, critMultiplier: 2.0, statusChance: 0.20, fireRate: 12, description: "Chain Heat arc ordnance (Mk I)" },
  { id: "sigma_galvarc_mk2", name: "Galvarc Mk II", type: "ordnance", house: "sigma", tier: "mk2", damage: 1188, critChance: 0, critMultiplier: 2.0, statusChance: 0.26, fireRate: 12, description: "Chain Heat arc ordnance (Mk II)" },
  { id: "sigma_galvarc_mk3", name: "Galvarc Mk III", type: "ordnance", house: "sigma", tier: "mk3", damage: 1901, critChance: 0, critMultiplier: 2.0, statusChance: 0.30, fireRate: 12, description: "Chain Heat arc ordnance (Mk III)" },
];

/** Legacy house-ordnance ids from older saves → Sigma Mk III. */
const ORDNANCE_ID_ALIASES: Record<string, string> = {
  vidar_milati: "sigma_milati_mk3",
  zetki_milati: "sigma_milati_mk3",
  vidar_tycho_seeker: "sigma_tycho_seeker_mk3",
  zetki_tycho_seeker: "sigma_tycho_seeker_mk3",
  vidar_galvarc: "sigma_galvarc_mk3",
  zetki_galvarc: "sigma_galvarc_mk3",
  vidar_milati_mk4: "sigma_milati_mk3",
  zetki_milati_mk4: "sigma_milati_mk3",
  vidar_tycho_seeker_mk4: "sigma_tycho_seeker_mk3",
  zetki_tycho_seeker_mk4: "sigma_tycho_seeker_mk3",
  vidar_galvarc_mk4: "sigma_galvarc_mk3",
  zetki_galvarc_mk4: "sigma_galvarc_mk3",
};

/** Steel Path Mk IV components — projected ~30% over wiki-mid Mk III (components not fully published). */
const MK4_COMPONENT_MULT = 1.3;

function toMk4Component(component: RailjackComponent): RailjackComponent {
  const scaledStats: Record<string, number> = {};
  for (const [key, val] of Object.entries(component.stats)) {
    scaledStats[key] = Math.round(val * MK4_COMPONENT_MULT * 100) / 100;
  }
  return {
    ...component,
    id: `${component.id.replace(/_mk3$/, "")}_mk4`,
    name: component.name.replace(/ Mk III$/, " Mk IV"),
    tier: "mk4",
    stats: scaledStats,
    description: `${component.description.replace(/ \(Mk III\)$/, "")}. Mk IV Steel Path variant (~30% stronger than Mk III).`,
  };
}

function mk4HouseComponents(list: RailjackComponent[]): RailjackComponent[] {
  return list.filter((c) => c.tier !== "sigma" && c.id.endsWith("_mk3")).map(toMk4Component);
}

export const mk4Reactors = mk4HouseComponents(reactors);
export const mk4ShieldArrays = mk4HouseComponents(shieldArrays);
export const mk4Engines = mk4HouseComponents(engines);
export const mk4Plating = mk4HouseComponents(plating);

export const allReactors: RailjackComponent[] = [...reactors, ...mk4Reactors];
export const allShieldArrays: RailjackComponent[] = [...shieldArrays, ...mk4ShieldArrays];
export const allEngines: RailjackComponent[] = [...engines, ...mk4Engines];
export const allPlating: RailjackComponent[] = [...plating, ...mk4Plating];

/** Ordnance is Sigma Dry Dock research only (no house Mk IV wreckage). */
export const allOrdnance: RailjackArmament[] = [...ordnance];

export function findRailjackComponent(id: string): RailjackComponent | undefined {
  return [...allReactors, ...allShieldArrays, ...allEngines, ...allPlating].find((c) => c.id === id);
}

export function findRailjackArmament(id: string): RailjackArmament | undefined {
  const resolved = ORDNANCE_ID_ALIASES[id] ?? id;
  return allTurrets.concat(allOrdnance).find((a) => a.id === resolved);
}

export function findRailjackEliteCrew(id: string): RailjackEliteCrew | undefined {
  return railjackEliteCrew.find((c) => c.id === id);
}

/** Normalize Mk IV ids to Mk III trait keys (same house unique pool). */
export function railjackTraitComponentKey(id: string): string {
  return id.replace(/_mk4$/, "_mk3");
}

export type RailjackHouseTraitEffect =
  | "lavan_plating_shield"
  | "shields_depleted_speed"
  | "shields_depleted_boost"
  | "shields_depleted_damage";

export interface RailjackHouseTrait {
  id: string;
  text: string;
  /** Optional paper/sim effect (other variants stay display-only). */
  effect?: RailjackHouseTraitEffect;
}

/**
 * Wiki Mk III house unique traits (wreckage rolls one per component).
 * Paper effects: Lavan reactor+plating shield synergy (always when both equipped);
 * shields-depleted engine/shield combat traits via simulation.shieldsDepleted.
 */
export const RAILJACK_HOUSE_TRAITS: Record<string, RailjackHouseTrait[]> = {
  lavan_reactor_mk3: [
    {
      id: "lavan_reactor_plating_shields",
      text: "Equipping Lavan Hull Plating increases max Shields by 25%",
      effect: "lavan_plating_shield",
    },
    {
      id: "lavan_reactor_slingshot_damage",
      text: "Tenno gain 50% Damage increase for 5s after being launched from the Slingshot",
    },
  ],
  vidar_reactor_mk3: [
    {
      id: "vidar_reactor_breach_immunity",
      text: "+100% damage immunity duration after a Major Breach is repaired",
    },
    {
      id: "vidar_reactor_archwing_speed",
      text: "Tenno gain 50% Speed Boost for 5s when deploying their Archwing",
    },
  ],
  zetki_reactor_mk3: [
    { id: "zetki_reactor_electric_hazard", text: "50% chance that an Electric Hazard will repair automatically after 5s" },
    { id: "zetki_reactor_fire_hazard", text: "50% chance that a Fire Hazard will repair automatically after 5s" },
    { id: "zetki_reactor_ice_hazard", text: "50% chance that an Ice Hazard will repair automatically after 5s" },
  ],
  lavan_shield_mk3: [
    { id: "lavan_shield_battle_energy", text: "+1000% of Energy consumed using Battle Mods is converted to Shields" },
    { id: "lavan_shield_cloak_recharge", text: "Shields replenish 50x faster while cloaked" },
  ],
  vidar_shield_mk3: [
    { id: "vidar_shield_divert_turret", text: "30% of Shield Damage is diverted to increase Turret Damage by up to 300 for the next shot fired" },
    { id: "vidar_shield_electric_pulse", text: "Every 10s, shields apply an Electrical proc to all enemies within 50m" },
    { id: "vidar_shield_kill_energy", text: "Redirect 50 Energy to Shields with every kill" },
  ],
  zetki_shield_mk3: [
    {
      id: "zetki_shield_depleted_damage",
      text: "+25% Railjack damage while shield depleted",
      effect: "shields_depleted_damage",
    },
    { id: "zetki_shield_tenno_shields", text: "+10% Tenno shields on Railjack" },
  ],
  lavan_engine_mk3: [
    {
      id: "lavan_engine_depleted_speed",
      text: "+20% Top Speed while shields are depleted",
      effect: "shields_depleted_speed",
    },
    { id: "lavan_engine_slingshot_overshields", text: "Tenno gain 500 overshields after being launched from the Slingshot" },
  ],
  vidar_engine_mk3: [
    {
      id: "vidar_engine_depleted_boost",
      text: "+50% boost speed while shield depleted",
      effect: "shields_depleted_boost",
    },
    { id: "vidar_engine_intruder_armor", text: "−10% Intruders armor" },
  ],
  zetki_engine_mk3: [
    { id: "zetki_engine_stationary_recharge", text: "Shields regenerate 50% faster when Railjack is stationary" },
    { id: "zetki_engine_tenno_weapon", text: "+20% Tenno weapon damage onboard Railjack" },
  ],
};

export function getRailjackComponentTraits(componentId: string): RailjackHouseTrait[] {
  return RAILJACK_HOUSE_TRAITS[railjackTraitComponentKey(componentId)] ?? [];
}

export function componentHasShieldsDepletedTrait(componentId: string | undefined): boolean {
  if (!componentId) return false;
  return getRailjackComponentTraits(componentId).some(
    (t) =>
      t.effect === "shields_depleted_speed" ||
      t.effect === "shields_depleted_boost" ||
      t.effect === "shields_depleted_damage",
  );
}

// ── Update 43: Uranus Proxima & reference loadouts ─────────────────

export interface RailjackMission {
  id: string;
  name: string;
  proxima: string;
  description: string;
  ally: string;
  rewards: string[];
  steelPath: boolean;
}

export interface RailjackPreset {
  id: string;
  name: string;
  owner: string;
  missionId: string;
  reactorId: string;
  shieldId: string;
  engineId: string;
  platingId: string;
  turretIds: string[];
  ordnanceId: string;
  /** Plexus mod ids (max-rank on apply). */
  integratedMods: string[];
  tacticalMods: string[];
  battleMods: string[];
}

export interface RailjackEliteCrew {
  id: string;
  name: string;
  description: string;
  competency: { piloting: number; gunnery: number; repair: number; combat: number; endurance: number };
  vendorCost: "crimson" | "emerald" | "both";
  requiresCommandRank: number;
}

export const uranusProximaMissions: RailjackMission[] = [
  {
    id: "scorias_angel",
    name: "Scoria's Angel",
    proxima: "Uranus",
    description: "Skirmish against Ryoku aboard Vena's Railjack The Marrowbone, then board his capital ship.",
    ally: "Vena",
    rewards: ["Crimson Talent", "Wrath blueprints", "Railjack components", "New Arcanes"],
    steelPath: true,
  },
  {
    id: "the_kuva_wytch",
    name: "The Kuva Wytch",
    proxima: "Uranus",
    description: "Skirmish against Vena aboard Ryoku's Railjack Santovan's Oath, then board her capital ship.",
    ally: "Ryoku",
    rewards: ["Emerald Talent", "Pride blueprints", "Railjack components", "New Arcanes"],
    steelPath: true,
  },
];

export const railjackPresets: RailjackPreset[] = [
  {
    id: "the_marrowbone",
    name: "The Marrowbone",
    owner: "Vena",
    missionId: "scorias_angel",
    reactorId: "lavan_reactor_mk3",
    shieldId: "zetki_shield_mk3",
    engineId: "vidar_engine_mk3",
    platingId: "lavan_plating_mk3",
    turretIds: ["zetki_laith_mk4", "zetki_pulsar_mk4", "zetki_cryophon_mk4"],
    ordnanceId: "sigma_tycho_seeker_mk3",
    integratedMods: [
      "ironclad_matrix", "conic_nozzle", "crimson_fugue", "forward_artillery", "predator",
      "cruising_speed", "hyperstrike", "ion_burn", "waveband_disruptor",
    ],
    tacticalMods: ["squad_renew", "battle_stations", "flow_burn"],
    battleMods: ["munitions_vortex", "particle_ram", "phoenix_blaze"],
  },
  {
    id: "santovans_oath",
    name: "Santovan's Oath",
    owner: "Ryoku",
    missionId: "the_kuva_wytch",
    reactorId: "vidar_reactor_mk3",
    shieldId: "lavan_shield_mk3",
    engineId: "vidar_engine_mk3",
    platingId: "lavan_plating_mk3",
    turretIds: ["zetki_vort_mk4", "zetki_photor_mk4", "zetki_glazio_mk4"],
    ordnanceId: "sigma_tycho_seeker_mk3",
    integratedMods: [
      "onslaught_matrix", "ion_burn", "fortifying_fire", "conic_nozzle", "forward_artillery",
      "predator", "protective_shots", "section_density", "cruising_speed",
    ],
    tacticalMods: ["intruder_stasis", "death_blossom", "void_cloak"],
    battleMods: ["blackout_pulse", "tether", "void_hole"],
  },
];

export const railjackEliteCrew: RailjackEliteCrew[] = [
  { id: "vena", name: "Vena", description: "Garuda Protoframe — queen of gore.", competency: { piloting: 0, gunnery: 2, repair: 0, combat: 5, endurance: 5 }, vendorCost: "both", requiresCommandRank: 10 },
  { id: "ryoku", name: "Ryoku", description: "Ash Protoframe — Scoria's deadliest assassin.", competency: { piloting: 0, gunnery: 2, repair: 2, combat: 5, endurance: 3 }, vendorCost: "both", requiresCommandRank: 10 },
  { id: "latrox_une", name: "Latrox Une", description: "Corpus researcher and Deimos ally.", competency: { piloting: 0, gunnery: 0, repair: 5, combat: 3, endurance: 4 }, vendorCost: "both", requiresCommandRank: 10 },
  { id: "jarka_lar", name: "Jarka Lar", description: "Freed from the Grineer Queens.", competency: { piloting: 0, gunnery: 2, repair: 0, combat: 5, endurance: 5 }, vendorCost: "both", requiresCommandRank: 10 },
];

// Helper to identify Railjack-relevant mods from the "general" category
// In-game these map to Integrated, Battle, and Tactical Plexus mods
export const RAILJACK_MOD_KEYWORDS = [
  "railjack", "turret", "hull", "breach", "flux",
  "ordnance", "crew", "shield recharge", "boost speed",
  "battle", "tactical", "archwing slingshot", "void cloak",
  "fire suppression", "shatter burst", "seeker volley",
  "munitions vortex", "particle ram", "tether", "blackout pulse",
  "void hole", "form up", "battle stations",
  "flow burn", "intruder stasis", "death blossom",
  "forward artillery", "omni revolite", "revolite",
  "phoenix blaze", "ion burn",
];

/** Plexus mods whose descriptions omit Railjack keywords (match by id). */
export const RAILJACK_MOD_IDS = new Set([
  "seeker_volley",
  "shatter_burst",
  "munitions_vortex",
  "revo_reducer",
  "ion_burn",
  "particle_ram",
  "phoenix_blaze",
  "blackout_pulse",
  "void_hole",
  "tether",
  "flow_burn",
  "intruder_stasis",
  "death_blossom",
  "void_cloak",
  "fire_suppression",
  "form_up",
  "battle_stations",
  "squad_renew",
  "forward_artillery",
]);

export interface RailjackModRef {
  id: string;
  name: string;
  description: string;
}

export function isRailjackMod(mod: RailjackModRef): boolean {
  if (mod.id === "firestorm" || mod.id === "primed_firestorm") return false;
  if (RAILJACK_MOD_IDS.has(mod.id)) return true;
  const desc = mod.description.toLowerCase();
  const name = mod.name.toLowerCase();
  return RAILJACK_MOD_KEYWORDS.some((kw) => desc.includes(kw) || name.includes(kw));
}
