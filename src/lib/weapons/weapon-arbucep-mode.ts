import type { Weapon, WeaponRadialAttack } from "@/lib/types";

/**
 * wiki.warframe.com/w/Arbucep page body (Characteristics / Codex), which wins
 * over the Module infobox's single-attack cycle:
 * "fires six homing missiles, each bearing a payload of one of the six
 * combined elements" / "simultaneously fires six homing rockets."
 *
 * Space paper is 16 direct + 114 radial per missile (no AoE falloff; the
 * wiki Falloff values are shot range). Atmosphere (Gravimag) doubles that
 * to 32 / 228. One volley therefore deals 96 direct + 684 radial in Space
 * (192 + 1368 in Atmosphere), consumes 1 ammo, and repeats at 1.5 fire rate
 * from a 36-round magazine. Multishot increases damage, not missile count.
 *
 * Modes 1–6 isolate a single missile for inspection; 0 / unset is all six.
 */
export const ARBUCEP_ATTACK_MODES = [
  { mode: 1, label: "1st Attack (Blast)", element: "blast" },
  { mode: 2, label: "2nd Attack (Corrosive)", element: "corrosive" },
  { mode: 3, label: "3rd Attack (Gas)", element: "gas" },
  { mode: 4, label: "4th Attack (Magnetic)", element: "magnetic" },
  { mode: 5, label: "5th Attack (Radiation)", element: "radiation" },
  { mode: 6, label: "6th Attack (Viral)", element: "viral" },
] as const;

export type ArbucepAttackMode = 0 | (typeof ARBUCEP_ATTACK_MODES)[number]["mode"];
export type ArbucepElement = (typeof ARBUCEP_ATTACK_MODES)[number]["element"];

export const ARBUCEP_ELEMENTS: readonly ArbucepElement[] = ARBUCEP_ATTACK_MODES.map((m) => m.element);

export const ARBUCEP_SPACE = { direct: 16, radial: 114 } as const;
export const ARBUCEP_ATMOSPHERE = { direct: 32, radial: 228 } as const;

const ZERO_ELEMENTS: Record<ArbucepElement, number> = {
  blast: 0,
  corrosive: 0,
  gas: 0,
  magnetic: 0,
  radiation: 0,
  viral: 0,
};

function ordinalLabel(mode: 1 | 2 | 3 | 4 | 5 | 6): string {
  return ["1st", "2nd", "3rd", "4th", "5th", "6th"][mode - 1]!;
}

/** 0 / unset = all six simultaneous missiles; 1–6 isolate one element. */
export function normalizeArbucepAttackMode(mode: number | undefined): ArbucepAttackMode {
  if (mode == null || !Number.isFinite(mode) || mode === 0) return 0;
  const n = Math.round(mode);
  if (n < 1 || n > 6) return 0;
  return n as ArbucepAttackMode;
}

export function getArbucepAttackModeMeta(mode: number | undefined) {
  const m = normalizeArbucepAttackMode(mode);
  if (m === 0) {
    return { mode: 0 as const, label: "All six missiles", element: "all" as const };
  }
  return ARBUCEP_ATTACK_MODES[m - 1]!;
}

export function arbucepPaper(options?: { atmosphere?: boolean }) {
  return options?.atmosphere ? ARBUCEP_ATMOSPHERE : ARBUCEP_SPACE;
}

function volleyElements(paper: { direct: number }, mode: ArbucepAttackMode): Record<ArbucepElement, number> & { damage: number } {
  const elems = { ...ZERO_ELEMENTS };
  if (mode === 0) {
    for (const e of ARBUCEP_ELEMENTS) elems[e] = paper.direct;
    return { damage: paper.direct * ARBUCEP_ELEMENTS.length, ...elems };
  }
  const element = ARBUCEP_ATTACK_MODES[mode - 1]!.element;
  elems[element] = paper.direct;
  return { damage: paper.direct, ...elems };
}

function volleyRadials(paper: { radial: number }, mode: ArbucepAttackMode): WeaponRadialAttack[] {
  const modes = mode === 0 ? [...ARBUCEP_ATTACK_MODES] : [ARBUCEP_ATTACK_MODES[mode - 1]!];
  return modes.map((meta) => ({
    name: `${ordinalLabel(meta.mode)} Attack Radial Attack`,
    totalDamage: paper.radial,
    // wiki module: 4 m; its Falloff (1500–2003 m Space / 200–270 m Atmosphere) is shot range, not AoE falloff.
    radius: 4.0,
    [meta.element]: paper.radial,
  }));
}

/**
 * Apply Arbucep's volley paper (all six simultaneous missiles by default,
 * or a single isolated element when a 1–6 mode is selected). Atmosphere
 * doubles wiki Space magnitudes.
 */
export function applyArbucepAttackMode(
  weapon: Weapon,
  mode: number | undefined,
  options?: { atmosphere?: boolean },
): Weapon {
  if (weapon.id !== "arbucep") return weapon;
  const normalized = normalizeArbucepAttackMode(mode);
  const paper = arbucepPaper(options);
  const elems = volleyElements(paper, normalized);
  const radials = volleyRadials(paper, normalized);

  const merged: Weapon = {
    ...weapon,
    ...elems,
    radialAttacks: radials,
  };

  if (options?.atmosphere && weapon.atmosphereStats) {
    merged.atmosphereStats = {
      ...weapon.atmosphereStats,
      ...elems,
      radialAttacks: radials,
    };
  }

  return merged;
}

/** How many missiles this Arbucep volley fires (6 together, or 1 when isolated). */
export function arbucepProjectileCount(weapon: Pick<Weapon, "id">): number {
  if (weapon.id !== "arbucep") return 1;
  const rec = weapon as unknown as Record<string, unknown>;
  const n = ARBUCEP_ELEMENTS.filter((e) => Number(rec[e] ?? 0) > 0).length;
  return Math.max(1, n);
}
