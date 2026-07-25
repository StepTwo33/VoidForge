import type { Weapon, WeaponRadialAttack } from "@/lib/types";

/** Wiki Module:Weapons/data/archwing Arbucep attack cycle (Space paper). */
export const ARBUCEP_ATTACK_MODES = [
  { mode: 1, label: "1st Attack (Blast)", element: "blast" },
  { mode: 2, label: "2nd Attack (Corrosive)", element: "corrosive" },
  { mode: 3, label: "3rd Attack (Gas)", element: "gas" },
  { mode: 4, label: "4th Attack (Magnetic)", element: "magnetic" },
  { mode: 5, label: "5th Attack (Radiation)", element: "radiation" },
  { mode: 6, label: "6th Attack (Viral)", element: "viral" },
] as const;

export type ArbucepAttackMode = (typeof ARBUCEP_ATTACK_MODES)[number]["mode"];
export type ArbucepElement = (typeof ARBUCEP_ATTACK_MODES)[number]["element"];

const SPACE = { direct: 16, radial: 114 } as const;
const ATMOSPHERE = { direct: 32, radial: 228 } as const;

export function normalizeArbucepAttackMode(mode: number | undefined): ArbucepAttackMode {
  if (mode == null || !Number.isFinite(mode)) return 1;
  const n = Math.round(mode);
  if (n < 1 || n > 6) return 1;
  return n as ArbucepAttackMode;
}

export function getArbucepAttackModeMeta(mode: number | undefined) {
  const m = normalizeArbucepAttackMode(mode);
  return ARBUCEP_ATTACK_MODES[m - 1]!;
}

function ordinalLabel(mode: ArbucepAttackMode): string {
  return ["1st", "2nd", "3rd", "4th", "5th", "6th"][mode - 1]!;
}

/**
 * Swap Arbucep's cycling elemental paper (direct + radial). Catalog default is
 * 1st Attack (Blast). Atmosphere doubles wiki Space magnitudes.
 */
export function applyArbucepAttackMode(
  weapon: Weapon,
  mode: number | undefined,
  options?: { atmosphere?: boolean },
): Weapon {
  if (weapon.id !== "arbucep") return weapon;
  const meta = getArbucepAttackModeMeta(mode);
  // Mode 1 matches catalog (+ Gravimag overlay) — no rewrite needed.
  if (meta.mode === 1) return weapon;

  const paper = options?.atmosphere ? ATMOSPHERE : SPACE;
  const radial: WeaponRadialAttack = {
    name: `${ordinalLabel(meta.mode)} Attack Radial Attack`,
    totalDamage: paper.radial,
    radius: 6.0,
    falloffReduction: 1.0,
    [meta.element]: paper.radial,
  };

  const merged: Weapon = {
    ...weapon,
    damage: paper.direct,
    blast: 0,
    corrosive: 0,
    gas: 0,
    magnetic: 0,
    radiation: 0,
    viral: 0,
    [meta.element]: paper.direct,
    radialAttacks: [radial],
  };

  if (options?.atmosphere && weapon.atmosphereStats) {
    merged.atmosphereStats = {
      ...weapon.atmosphereStats,
      damage: paper.direct,
      blast: 0,
      corrosive: 0,
      gas: 0,
      magnetic: 0,
      radiation: 0,
      viral: 0,
      [meta.element]: paper.direct,
      radialAttacks: [radial],
    };
  }

  return merged;
}
