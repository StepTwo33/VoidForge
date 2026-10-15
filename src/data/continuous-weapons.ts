/**
 * Continuous (beam) weapons whose primary fire merges multishot into one damage tick.
 * Source: wiki.warframe.com Module:Weapons/data/{primary,secondary,archwing} weapon-level
 * Trigger = "Held", plus Quanta / Tenet Quanta / Quanta Vandal / Phantasma (Prime) / Enkaus
 * whose "Beam" / "Primary" attack is Held. Phage is excluded (fandom Multishot: additional
 * multishot adds real beams on Phage).
 *
 * wiki Multishot (both wikis): on continuous weapons the merged tick's damage and status
 * chance both scale with multishot, so damaging status (Slash/Heat/Toxin/Electricity/Gas)
 * is affected twice. Innate beams (Quanta 2, Phantasma 6) stay separate instances; the
 * multishot bonus applies per beam.
 */
export const CONTINUOUS_WEAPON_IDS: ReadonlySet<string> = new Set([
  "amprex", "coda_synapse", "convectrix", "flux_rifle", "glaxion", "glaxion_vandal",
  "ignis", "ignis_wraith", "lizzie", "synapse", "tenet_glaxion", "atomos", "catabolyst",
  "coda_catabolyst", "cycron", "embolist", "gammacor", "kuva_nukor", "nukor", "ocucor",
  "spectra", "spectra_vandal", "synoid_gammacor", "tenet_cycron", "cortege", "larkspur",
  "larkspur_prime", "quanta", "quanta_vandal", "tenet_quanta", "phantasma", "phantasma_prime",
  "enkaus",
]);
