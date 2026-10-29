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
  /** Apply charge timing although triggerType is a category label (Auto-Charge weapons). */
  chargeTimingAlways?: boolean;
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
  // wiki Module:Weapons/data/primary Rakta Cernos Charged Shot ChargeTime 0.25; Fire Rate list 0.25 sec.
  rakta_cernos: { chargeTime: 0.25, chargeMode: "bow" },
  mutalist_cernos: { chargeTime: 0.5, chargeMode: "bow" },
  // wiki Module:Weapons/data/primary Charged Shot ChargeTime + Fire Rate list: Cinta 1.5 s,
  // Evensong 1.2 s, Nataruk 1.0 s (they fell back to the 0.5 s Bow default in weapon-enrich).
  cinta: { chargeTime: 1.5, chargeMode: "bow" },
  evensong: { chargeTime: 1.2, chargeMode: "bow" },
  nataruk: { chargeTime: 1.0, chargeMode: "bow" },
  // wiki Module:Weapons (both wikis) + Fire Rate list: 0.70s
  proboscis_cernos: { chargeTime: 0.7, chargeMode: "bow" },
  daikyu: { chargeTime: 1.0, chargeMode: "bow" },
  daikyu_prime: { chargeTime: 1.0, chargeMode: "bow" },
  // wiki Nagantaka: a Semi-Auto crossbow (Module Trigger "Semi-Auto", no ChargeTime, not on the
  // Fire Rate charge list) that "counts as a bow in regards to fire rate mods". Bow mod bonus only;
  // no charge time, so it fires at its listed rate and reloads after the 9-round magazine.
  nagantaka: { chargeMode: "bow" },
  nagantaka_prime: { chargeMode: "bow" },
  artemis_bow: { chargeTime: 1.0, chargeMode: "bow" },
  artemis_bow_prime: { chargeTime: 1.0, chargeMode: "bow" },
  // Lanka — charge only, no inter-shot delay
  lanka: { chargeTime: 1.0, chargeMode: "lanka" },
  // Standard charge guns
  // chargeTimingAlways: the catalog trigger reads "Rifle", which hid the charge time (wiki Fire Rate
  // list + Module Charged Shot ChargeTime: Opticor 2.0 s, Opticor Vandal 0.6 s, Ferrox 0.5 s, Miter 0.75 s).
  opticor: { chargeTime: 2.0, chargeMode: "standard", chargeTimingAlways: true },
  opticor_vandal: { chargeTime: 0.6, chargeMode: "standard", chargeTimingAlways: true },
  miter: { chargeTime: 0.75, chargeMode: "standard", chargeTimingAlways: true },
  ogris: { chargeTime: 0.3, chargeMode: "standard" },
  ferrox: { chargeTime: 0.5, chargeMode: "standard", chargeTimingAlways: true },
  // wiki Module:Weapons (both wikis) + Fire Rate list: 0.40s
  tenet_ferrox: { chargeTime: 0.4, chargeMode: "standard" },
  angstrum: { chargeTime: 0.5, chargeMode: "standard" },
  // wiki Module:Weapons (both wikis) + Fire Rate list: 0.20s single rocket
  prisma_angstrum: { chargeTime: 0.2, chargeMode: "standard" },
  // wiki Auto-Charge (wiki.warframe.com; no fandom page): 1 / (CT + 1/FR)
  vadarya_prime: { chargeTime: 0.75, chargeMode: "standard", chargeTimingAlways: true },
  // wiki Module:Weapons (both wikis) Auto-Charge projectile: CT 0.30s
  javlok: { chargeTime: 0.3, chargeMode: "standard", chargeTimingAlways: true },
  // wiki Nunchasa (Narin bow; wiki.warframe.com only) Charged Shot CT 0.60s; bow cycle CT + reload
  nunchasa: { chargeTime: 0.6, chargeMode: "bow" },
  // wiki Fire Rate: Epitaph charged shot uses the bow formula 1 / (CT + reload); CT 0.36s (both wikis)
  epitaph: { chargeTime: 0.36, chargeMode: "bow" },
  epitaph_prime: { chargeTime: 0.36, chargeMode: "bow" },
  // wiki Module Charged Shot ChargeTime + Fire Rate list: Drakgoon 0.5 s, Kuva Drakgoon 0.3 s
  // (Kuva Drakgoon's catalog trigger reads "Shotgun", so charge timing is forced on).
  drakgoon: { chargeTime: 0.5, chargeMode: "standard" },
  kuva_drakgoon: { chargeTime: 0.3, chargeMode: "standard", chargeTimingAlways: true },
  // wiki Module:Weapons/data/archwing Charged Shot ChargeTime: Corvas / Corvas Prime 0.5 s, Velocitus 1.0 s.
  corvas: { chargeTime: 0.5, chargeMode: "standard" },
  corvas_prime: { chargeTime: 0.5, chargeMode: "standard" },
  velocitus: { chargeTime: 1.0, chargeMode: "standard" },
  // wiki Module:Weapons + fandom infobox: Class/Type "Bow", Charged Shot CT 0.4s → bow cycle.
  kuva_bramma: { chargeTime: 0.4, chargeMode: "bow" },
  // wiki Module:Weapons (both wikis): Class "Bow" → bow cycle 1 / (CT + reload) per Fire Rate.
  lenz: { chargeTime: 1.2, chargeMode: "bow" },
  // Both wikis (wiki.warframe.com and fandom, checked 2026-10-21) list Charge Time 1.2s.
  // Kept at 0.8s on purpose: Jason measured 0.8s in game (in-game check beats the wikis).
  prisma_lenz: { chargeTime: 0.8, chargeMode: "bow" },
  balefire: { chargeTime: 2.0, chargeMode: "standard" },
  balefire_prime: { chargeTime: 2.0, chargeMode: "standard" },
  // Burst weapons — BurstCount / BurstDelay from Module:Weapons/data/{primary,secondary,archwing}
  // (wiki.warframe.com; fandom agrees unless noted). Only where VF's base fireRate is the
  // wiki's burst-mode Fire Rate (bursts per second), so the burst formula isn't double-counted.
  // Kuva Hind (FR 10) and Tiberon Prime (FR 8.33) are modelled in their Auto mode: no burst timing.
  burston: { burstCount: 3, burstDelay: 0.061 },
  burston_prime: { burstCount: 3, burstDelay: 0.04 },
  sicarus: { burstCount: 3, burstDelay: 0.04 },
  sicarus_prime: { burstCount: 3, burstDelay: 0.04 },
  hind: { burstCount: 5, burstDelay: 0.12 },
  tiberon: { burstCount: 3, burstDelay: 0.06 },
  akarius: { burstCount: 2, burstDelay: 0.12 },
  akarius_prime: { burstCount: 2, burstDelay: 0.12 },
  ballistica: { burstCount: 4, burstDelay: 0.05 },
  rakta_ballistica: { burstCount: 4, burstDelay: 0.05 },
  battacor: { burstCount: 2, burstDelay: 0.08 },
  hema: { burstCount: 3, burstDelay: 0.1 },
  coda_hema: { burstCount: 3, burstDelay: 0.1 }, // wiki.warframe.com only (not on fandom)
  cyngas: { burstCount: 3, burstDelay: 0.06 },
  sybaris: { burstCount: 2, burstDelay: 0.101 },
  sybaris_prime: { burstCount: 2, burstDelay: 0.062 },
  dex_sybaris: { burstCount: 2, burstDelay: 0.09 },
  harpak: { burstCount: 3, burstDelay: 0.1 },
  higasa: { burstCount: 5, burstDelay: 0.1 },
  kraken: { burstCount: 2, burstDelay: 0.05 },
  kuva_kraken: { burstCount: 3, burstDelay: 0.03 },
  paracyst: { burstCount: 3, burstDelay: 0.05 },
  perigale: { burstCount: 4, burstDelay: 0.04 },
  perigale_prime: { burstCount: 4, burstDelay: 0.04 }, // wiki.warframe.com only
  thornbak: { burstCount: 4, burstDelay: 0.066 }, // wiki.warframe.com only
  // Tigris family is Duplex on both wikis (no BurstCount); kept as the prior 2-shot approximation.
  // Simultaneous bursts (BurstDelay 0, both wikis): every pull fires all rounds at once,
  // so shots/s = BurstCount x FR (Akjagara 8.3 semi -> 5 x 2 when converted to burst; verified in game).
  quartakk: { burstCount: 4, burstDelay: 0 },
  akjagara: { burstCount: 2, burstDelay: 0 },
  akjagara_prime: { burstCount: 2, burstDelay: 0 },
  sepulcrum: { burstCount: 2, burstDelay: 0 },
  morgha: { burstCount: 2, burstDelay: 0 },
  tigris: { burstCount: 2, burstDelay: 0.15 },
  tigris_prime: { burstCount: 2, burstDelay: 0.15 },
  sancti_tigris: { burstCount: 2, burstDelay: 0.15 },
  // Companion / sentinel burst weapons — BurstCount / BurstDelay from Module:Weapons/data/companion
  // (wiki.warframe.com and warframe.fandom.com agree).
  burst_laser: { burstCount: 3, burstDelay: 0.4 },
  burst_laser_prime: { burstCount: 5, burstDelay: 0.2 },
  prisma_burst_laser: { burstCount: 4, burstDelay: 0.3 },
  helstrum: { burstCount: 4, burstDelay: 0.1 },
  multron: { burstCount: 3, burstDelay: 0.4 },
};
