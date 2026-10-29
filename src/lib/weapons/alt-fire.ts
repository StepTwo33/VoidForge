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
  const { radialAttacks, radialsKeep, label, note, showDps, damageTimesMagazine, usesWholeMagazine, ignoreMultishotMods, ...overrides } = mode;
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
  if (!mode.damageTimesMagazine && !mode.usesWholeMagazine && !mode.ignoreMultishotMods) return calc(w);
  const first = calc(w);
  const base = w.multishot ?? 1;
  // Undo the multishot bonus: base x base / modded comes back out as base.
  if (mode.ignoreMultishotMods && first.multishot > 0) w = { ...w, multishot: (base * base) / first.multishot };
  const mag = Math.max(1, Math.round(first.magazine));
  if (mode.usesWholeMagazine) w = { ...w, ammoCost: mag };
  if (mode.damageTimesMagazine) {
    const times = <T extends object>(o: T): T => {
      const out = { ...o } as Record<string, unknown>;
      for (const k of [...DMG_KEYS, "damage", "totalDamage"]) if (typeof out[k] === "number") out[k] = (out[k] as number) * mag;
      return out as T;
    };
    w = { ...times(w), ammoCost: mag, radialAttacks: w.radialAttacks?.map(times) };
  }
  return calc(w);
}
