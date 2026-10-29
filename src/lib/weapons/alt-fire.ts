import { enrichWeapon } from "@/lib/weapons/weapon-enrich";
import { getAlternateModes } from "@/lib/weapons/weapon-alternate-mode";
import { DMG_KEYS, WEAPON_ALT_FIRE } from "@/data/weapon-alt-fire";
import type { CalculatedStats, Weapon, WeaponAlternateModeStats } from "@/lib/types";

/**
 * ALT FIRE: read-only "other firing mode" results shown in the weapon stats panel.
 *
 * A mode is the same overlay shape the builder toggle used (WeaponAlternateModeStats), but the
 * build is never switched. Each mode is run through the caller's own calculator on a copy of the
 * weapon, so mods, arcanes and simulation settings apply exactly as they do to the primary mode,
 * and the primary result is never touched (purely additive).
 */
export interface AltFireMode extends WeaponAlternateModeStats {
  /** One-line plain-language note about how the mode differs (wiki-sourced). */
  note?: string;
  /** Show a DPS figure for this mode (default true). */
  showDps?: boolean;
  /**
   * Keep these of the weapon's existing radial rows (matched by exact name) in this mode.
   * With neither this nor `radialAttacks`, the mode shows no radial rows: the primary's radials
   * describe the primary mode, not this one.
   */
  radialsKeep?: string[];
  /**
   * The shot uses the whole (modded) magazine and its damage is multiplied by it (wiki Tenet
   * Plinx), so magazine mods scale it. The damage fields hold the per-round value.
   */
  damageTimesMagazine?: boolean;
  /** The shot uses the whole (modded) magazine at the listed damage (wiki Tenet Tetra). */
  usesWholeMagazine?: boolean;
  /** Multishot mods add nothing to this shot (wiki Stug: a full blob is capped at 10 stacks). */
  ignoreMultishotMods?: boolean;
  /**
   * Each round in the (modded) magazine adds this share to the explosion rows (wiki Javlok
   * throw: 300 x (1 + 0.2 x rounds)). Shown with a full magazine.
   */
  radialBonusPerRound?: number;
  /**
   * Melee damage mods (Pressure Point, Spoiled Strike, Incarnon +damage) add nothing to this attack;
   * elemental, faction, crit and status mods and general boosts (Vex Armor, Condition Overload)
   * still do (wiki: Tatsu Soul Swarm, Tenet Grigori Energy Disk, the Incarnon spectral attacks).
   * Arcanes are never in the shown per-type damage, so they aren't handled here.
   */
  ignoreBaseDamageMods?: boolean;
}

export interface AltFireResult {
  label: string;
  note?: string;
  showDps: boolean;
  stats: CalculatedStats;
}

/** Data-table modes first, then the weapon's legacy toggle overlays (stance-form swaps excluded: those stay a form switch). */
export function getAltFireModes(weapon: Weapon | null | undefined): AltFireMode[] {
  if (!weapon) return [];
  const legacy = getAlternateModes(weapon).filter((m) => !m.stanceType);
  return [...(WEAPON_ALT_FIRE[weapon.id] ?? []), ...legacy];
}

/** Overlay one alt-fire mode on a copy of the weapon (same merge rule as applyAlternateMode). */
export function applyAltFireMode(weapon: Weapon, mode: AltFireMode): Weapon {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { radialAttacks, radialsKeep, label, note, showDps, damageTimesMagazine, usesWholeMagazine, ignoreMultishotMods, radialBonusPerRound, ignoreBaseDamageMods, ...overrides } = mode;
  const merged: Weapon = { ...weapon, ...overrides };
  if (radialAttacks) merged.radialAttacks = radialAttacks;
  else if (radialsKeep) {
    const existing = enrichWeapon(weapon).radialAttacks ?? [];
    merged.radialAttacks = existing.filter((r) => radialsKeep.includes(r.name));
  } else merged.radialAttacks = [];
  return merged;
}

/** Run every alt-fire mode through the caller's calculator. Returns new objects; never mutates the weapon. */
export function computeAltFire(
  weapon: Weapon | null | undefined,
  calc: (w: Weapon) => CalculatedStats,
): AltFireResult[] {
  if (!weapon) return [];
  return getAltFireModes(weapon).map((mode) => ({
    label: mode.label,
    note: mode.note,
    showDps: mode.showDps !== false,
    stats: calcAltMode(weapon, mode, calc),
  }));
}

/** One calc, or two when a flag needs the modded result first (magazine or multishot). */
function calcAltMode(weapon: Weapon, mode: AltFireMode, calc: (w: Weapon) => CalculatedStats): CalculatedStats {
  let w = applyAltFireMode(weapon, mode);
  if (!mode.damageTimesMagazine && !mode.usesWholeMagazine && !mode.ignoreMultishotMods && !mode.radialBonusPerRound && !mode.ignoreBaseDamageMods) return calc(w);
  const first = calc(w);
  const base = w.multishot ?? 1;
  // Undo the multishot bonus: base x base / modded comes back out as base.
  if (mode.ignoreMultishotMods && first.multishot > 0) w = { ...w, multishot: (base * base) / first.multishot };
  const mag = Math.max(1, Math.round(first.magazine));
  if (mode.usesWholeMagazine) w = { ...w, ammoCost: mag };
  const times = <T extends object>(o: T, k: number): T => {
    const out = { ...o } as Record<string, unknown>;
    for (const f of [...DMG_KEYS, "damage", "totalDamage"]) if (typeof out[f] === "number") out[f] = (out[f] as number) * k;
    return out as T;
  };
  if (mode.damageTimesMagazine) w = { ...times(w, mag), ammoCost: mag, radialAttacks: w.radialAttacks?.map((r) => times(r, mag)) };
  const perRound = mode.radialBonusPerRound;
  if (perRound) w = { ...w, radialAttacks: w.radialAttacks?.map((r) => times(r, 1 + perRound * mag)) };
  if (mode.ignoreBaseDamageMods) {
    // Probe: 100 Tau only (no mod adds Tau), so modded Tau / 100 is the shown base-damage multiplier
    // (1 + all bonuses, before arcanes). Scale so it runs at (1 + all - melee mods) instead.
    const zero = Object.fromEntries(DMG_KEYS.map((k) => [k, 0]));
    const probe = calc({ ...w, ...zero, tau: 100, damage: 100, radialAttacks: [] });
    const all = ((probe.arsenalDamage?.elements ?? probe.elements).find((e) => e.type === "tau")?.value ?? 100) / 100;
    const k = all > 0 ? Math.max(0, all - (first.meleeModDamageBonus ?? 0)) / all : 1;
    if (k !== 1) w = { ...times(w, k), radialAttacks: w.radialAttacks?.map((r) => times(r, k)) };
  }
  return calc(w);
}
