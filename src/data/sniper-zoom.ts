/**
 * Sniper Rifle zoom buffs and Shot Combo Counter data.
 *
 * Source: wiki.warframe.com Module:Weapons/data/primary (SniperComboMin, SniperComboReset,
 * Zoom), cross-checked against the "Zoom and Minimum Combo Stats" table on both
 * wiki.warframe.com/w/Sniper_Rifle and warframe.fandom.com/wiki/Sniper_Rifle (2026-10-15).
 *
 * Only snipers present with matching values on BOTH wikis are listed. Perigale Prime,
 * Coda Sporothrix and Vadarya Prime appear on wiki.gg only (no fandom page), so they are
 * intentionally omitted until fandom catches up.
 *
 * Zoom buffs (wiki):
 *  - Critical Chance (Lanka): flat +X added after mods.
 *  - Critical Multiplier: additive with crit-damage mods ("treated like a respective mod").
 *  - Headshot Damage: additive with headshot-damage mods.
 * Komorex (both wikis): 2x zoom −50% recoil, +2 m punch through (no DPS effect); 3.5x zoom
 * +100% Impact/Puncture/Slash (additive with physical mods), −75% fire rate (additive with
 * mods; nulled by Cannonade) and enables the Viral explosion (53 base → 106 at zoom; radius
 * 3.5 m per both wikis' article text — Module:Weapons/data lists 3.6 m).
 * Not modelled: the zoom's +100% elemental multiplier on status proc damage (fandom note).
 */

export interface SniperZoomLevel {
  /** e.g. "3.5x" */
  label: string;
  critChanceFlat?: number;
  critMultBonus?: number;
  headshotDamageBonus?: number;
  /** Additive with Impact/Puncture/Slash mods (Komorex 3.5x: +1.0). */
  physicalBonus?: number;
  /** Additive with fire-rate mods (Komorex 3.5x: −0.75). */
  fireRateBonus?: number;
  /** Enables the weapon's "Zoom Radial Attack" explosion, × this damage multiplier. */
  zoomRadialMult?: number;
}

export interface SniperData {
  /** Hits required for the first (1.5×) combo tier. */
  minCombo: number;
  /** Seconds before the counter decays by one (display only). */
  comboDuration: number;
  zooms: SniperZoomLevel[];
}

const hs = (label: string, v: number): SniperZoomLevel => ({ label, headshotDamageBonus: v });
const cm = (label: string, v: number): SniperZoomLevel => ({ label, critMultBonus: v });
const cc = (label: string, v: number): SniperZoomLevel => ({ label, critChanceFlat: v });

export const SNIPER_DATA: Record<string, SniperData> = {
  komorex: {
    minCombo: 5,
    comboDuration: 2,
    zooms: [{ label: "2x" }, { label: "3.5x", physicalBonus: 1, fireRateBonus: -0.75, zoomRadialMult: 1 }],
  },
  lanka: { minCombo: 2, comboDuration: 6, zooms: [cc("3x", 0.2), cc("5x", 0.3), cc("8x", 0.5)] },
  perigale: { minCombo: 1, comboDuration: 2, zooms: [cm("2x", 0.2), cm("4x", 0.4)] },
  rubico: { minCombo: 1, comboDuration: 2, zooms: [cm("3.5x", 0.35), cm("6x", 0.5)] },
  rubico_prime: { minCombo: 1, comboDuration: 2, zooms: [cm("2.5x", 0.35), cm("5x", 0.5)] },
  snipetron: { minCombo: 3, comboDuration: 2, zooms: [hs("2.5x", 0.3), hs("6x", 0.5)] },
  snipetron_vandal: { minCombo: 3, comboDuration: 2, zooms: [hs("2.5x", 0.3), hs("6x", 0.5)] },
  sporothrix: { minCombo: 1, comboDuration: 2, zooms: [hs("2.7x", 0.5)] },
  vectis: { minCombo: 1, comboDuration: 2, zooms: [hs("3x", 0.3), hs("4.5x", 0.5)] },
  vectis_prime: { minCombo: 5, comboDuration: 2, zooms: [hs("3.5x", 0.4), hs("6x", 0.6)] },
  vulkar: { minCombo: 2, comboDuration: 2, zooms: [hs("2.5x", 0.35), hs("4x", 0.55), hs("8x", 0.7)] },
  vulkar_wraith: { minCombo: 2, comboDuration: 2, zooms: [hs("2.5x", 0.35), hs("4x", 0.55), hs("8x", 0.7)] },
};

/** Highest combo tier offered in the builder (tier 5 = 3.5×). */
export const SNIPER_MAX_COMBO_TIER = 5;

/** wiki: Damage Multiplier = 1.5 + 0.5 × (tier − 1); tier 0 = counter inactive (1×). */
export function sniperComboMultiplier(tier: number): number {
  const t = Math.max(0, Math.min(SNIPER_MAX_COMBO_TIER, Math.floor(tier)));
  return t === 0 ? 1 : 1.5 + 0.5 * (t - 1);
}

/** wiki: Combo Required = Minimum Combo × 3^(tier − 1). */
export function sniperComboHitsRequired(minCombo: number, tier: number): number {
  return tier <= 0 ? 0 : minCombo * 3 ** (tier - 1);
}
