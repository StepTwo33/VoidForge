/**
 * Pure-element / missing breakdown fills for weapons whose catalog total damage
 * is elemental but IPS/element fields are zero.
 *
 * Values are absolute base damage of that type (typically = weapon.damage).
 * chargeTime is base seconds to full charge (wiki Fire Rate).
 * burstCount / burstDelay for burst-fire effective rate formula.
 */

export type InnateElementKey =
  | "heat"
  | "cold"
  | "toxin"
  | "electricity"
  | "radiation"
  | "viral"
  | "corrosive"
  | "blast"
  | "gas"
  | "magnetic"
  | "impact"
  | "puncture"
  | "slash";

export interface WeaponInnateFill {
  /** Element/IPS fields to set when missing (absolute base damage). */
  elements?: Partial<Record<InnateElementKey, number>>;
  /** Base charge time in seconds (unmodded). */
  chargeTime?: number;
  /** Shots per burst (burst trigger). */
  burstCount?: number;
  /** Delay between shots inside a burst (seconds). */
  burstDelay?: number;
  /**
   * Charge fire-rate mode (wiki Fire Rate):
   * - standard: 1 / (CT + 1/FR)
   * - bow: 1 / (CT + reload)
   * - lanka: 1 / CT  (no inter-shot delay)
   */
  chargeMode?: "standard" | "bow" | "lanka";
}

/**
 * Full absolute element fills when weapon has zero IPS + zero elements.
 * Keys are weapon ids. Amounts use weapon.damage from catalog at patch time —
 * enrich applies proportionally if damage differs.
 */
export const WEAPON_INNATE_ELEMENT_FILLS: Record<string, InnateElementKey> = {
  // —— already patched in weapons.ts may still be listed as safety ——
  amprex: "electricity",
  quanta: "electricity",
  quanta_vandal: "electricity",
  lanka: "electricity",
  flux_rifle: "electricity",
  // Synapse is Corrosive in modern Warframe (not electricity)
  synapse: "corrosive",
  coda_synapse: "corrosive",
  glaxion: "cold",
  glaxion_vandal: "cold",
  tenet_glaxion: "cold",
  ignis: "heat",
  ignis_wraith: "heat",
  atomos: "heat",
  staticor: "radiation",
  nukor: "radiation",
  kuva_nukor: "radiation",
  ocucor: "radiation",
  spectra: "radiation",
  spectra_vandal: "radiation",
  cycron: "radiation",
  tenet_cycron: "radiation",
  embolist: "toxin",
  phage: "viral",
  shedu: "magnetic",

  // —— remaining pure-element catalog gaps ——
  angstrum: "blast",
  prisma_angstrum: "blast",
  catabolyst: "corrosive",
  coda_catabolyst: "corrosive",
  arca_plasmor: "radiation",
  tenet_arca_plasmor: "radiation",
  synoid_simulor: "magnetic",
  simulor: "magnetic",
  balefire: "electricity",
  balefire_prime: "electricity",
  artax: "cold",
  cryotra: "cold",
  verglas: "cold",
  gaze_chamber: "heat",
  vermisplicer_chamber: "toxin",
  alternox: "electricity",
  alternox_prime: "electricity",
  ambassador: "electricity",
  basmu: "electricity",
  coda_hema: "viral",
  hema: "viral",
  javlok: "heat",
  paracyst: "toxin",
  scourge: "corrosive",
  scourge_prime: "corrosive",
  torid: "toxin",
  ogris: "blast",
  acrid: "toxin",
  castanas: "electricity",
  sancti_castanas: "electricity",
  coda_pox: "toxin",
  pox: "toxin",
  detron: "radiation",
  mara_detron: "radiation",
  tenet_detron: "radiation",
  gammacor: "magnetic",
  synoid_gammacor: "magnetic",
  kompressa: "cold",
  kompressa_prime: "cold",
  stug: "corrosive",
  // Silva & Aegis — pure Heat melee
  "silva_&_aegis": "heat",
  "silva_&_aegis_prime": "heat",
  vadarya_prime: "electricity",
  coda_bassocyst: "viral",
  grimoire: "radiation",
  mandonel: "radiation",
};

/** Charge / burst timing overrides (wiki base values). */
export const WEAPON_FIRE_TIMING: Record<string, WeaponInnateFill> = {
  // Bows — charge + reload cycle
  paris: { chargeTime: 0.5, chargeMode: "bow" },
  paris_prime: { chargeTime: 0.5, chargeMode: "bow" },
  dread: { chargeTime: 0.5, chargeMode: "bow" },
  cernos: { chargeTime: 0.5, chargeMode: "bow" },
  cernos_prime: { chargeTime: 0.5, chargeMode: "bow" },
  rakta_cernos: { chargeTime: 0.5, chargeMode: "bow" },
  mutalist_cernos: { chargeTime: 0.5, chargeMode: "bow" },
  proboscis_cernos: { chargeTime: 0.5, chargeMode: "bow" },
  daikyu: { chargeTime: 1.0, chargeMode: "bow" },
  daikyu_prime: { chargeTime: 1.0, chargeMode: "bow" },
  nagantaka: { chargeTime: 0.5, chargeMode: "bow" },
  nagantaka_prime: { chargeTime: 0.5, chargeMode: "bow" },
  artemis_bow: { chargeTime: 1.0, chargeMode: "bow" },
  artemis_bow_prime: { chargeTime: 1.0, chargeMode: "bow" },
  // Lanka — charge only, no inter-shot delay
  lanka: { chargeTime: 1.0, chargeMode: "lanka" },
  // Standard charge guns
  opticor: { chargeTime: 2.0, chargeMode: "standard" },
  opticor_vandal: { chargeTime: 0.6, chargeMode: "standard" },
  ogris: { chargeTime: 0.3, chargeMode: "standard" },
  kuva_ogris: { chargeTime: 0.3, chargeMode: "standard" },
  kuva_bramma: { chargeTime: 0.4, chargeMode: "standard" },
  ferrox: { chargeTime: 0.5, chargeMode: "standard" },
  tenet_ferrox: { chargeTime: 0.5, chargeMode: "standard" },
  tenet_envoy: { chargeTime: 1.2, chargeMode: "standard" },
  angstrum: { chargeTime: 0.5, chargeMode: "standard" },
  prisma_angstrum: { chargeTime: 0.5, chargeMode: "standard" },
  drakgoon: { chargeTime: 0.3, chargeMode: "standard" },
  lenz: { chargeTime: 1.2, chargeMode: "standard" },
  balefire: { chargeTime: 2.0, chargeMode: "standard" },
  balefire_prime: { chargeTime: 2.0, chargeMode: "standard" },
  // Burst weapons (common 3-round)
  burston: { burstCount: 3, burstDelay: 0.04 },
  burston_prime: { burstCount: 3, burstDelay: 0.04 },
  sicarus: { burstCount: 3, burstDelay: 0.04 },
  sicarus_prime: { burstCount: 3, burstDelay: 0.04 },
  hind: { burstCount: 5, burstDelay: 0.04 },
  kuva_hind: { burstCount: 5, burstDelay: 0.04 },
  tiberon: { burstCount: 3, burstDelay: 0.06 },
  tiberon_prime: { burstCount: 3, burstDelay: 0.06 },
  tigris: { burstCount: 2, burstDelay: 0.15 },
  tigris_prime: { burstCount: 2, burstDelay: 0.15 },
  sancti_tigris: { burstCount: 2, burstDelay: 0.15 },
};
